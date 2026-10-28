#!/usr/bin/env python3
"""Character IMAGE-LoRA dataset prep + launch-command printer.

Companion to CHARACTER-LORA-PLAN.md and KAGGLE-KIT.md in this folder.
Trainer of record: **musubi-tuner** (kohya-ss) — see the plan doc
for the evidence and for why ai-toolkit is the documented alternate
rather than the primary.

RE-SCOPE (2026-10-27 research correction): the T4-feasible
consistency path is a per-character **IMAGE LoRA** — musubi-tuner
image training is documented at ~12 GB VRAM, inside a T4's 16 GB.
**Video LoRA at recommended settings is NOT T4-feasible** (the
trainer's own guidance puts video training at 24 GB+ VRAM); that
is a headline honest gap in KAGGLE-KIT.md, not a setting to tune
around. This script therefore builds an IMAGE dataset (canon
still + rig-render frames as stills) and trains single-frame:
the resulting LoRA teaches identity/appearance, which the video
backends (TI2V-5B start-image, VACE reference) then animate.
It does not pretend to teach motion.

This script:

  1. builds a per-species training dataset from REPO canon only —
     show/production/canon-cutouts/<species>.png plus rig renders
     under show/production/rigs/previews/ and
     show/production/rigs/builds/<species>/ (likeness law: no
     invented or external imagery enters a character dataset);
  2. writes a caption .txt beside every image (unique trigger token
     + a factual template caption; trait-level enrichment is an
     owner/scorer pass before a real run — see the plan doc);
  3. writes a musubi-tuner dataset_config.toml;
  4. PRINTS the exact latent-cache, text-encoder-cache and
     training commands for Kaggle T4 x2 (Turing sm75).

It does NOT run training. It does not download weights (the base
TI2V-5B files come from the notebook's existing install / the
consistency-kit Dataset — see KAGGLE-KIT.md staging table).

Kaggle T4 constraints baked into the printed commands:
  * --sdpa attention ONLY. FlashAttention-2 needs sm80+; SageAttention
    is not a T4 path. (The notebook already runs SDPA-only.)
  * fp16 mixed precision, NOT bf16: T4 tensor cores are fp16/int8;
    bf16 has no tensor-core path on Turing.
  * FP8 is a memory trick on T4, never a speed trick (no FP8 tensor
    cores before Ada sm89): musubi's --fp8_scaled is listed in the
    plan doc as an optional add-on, deliberately NOT in the default
    printed command.
  * Gradient checkpointing + adamw8bit + block swapping carry the
    16 GB fit; default is a SINGLE GPU (the second T4 stays free
    for the ComfyUI server / caching passes). A --multi-gpu variant
    of the launch line is printed as a comment, not the default:
    DDP overhead on a dataset this small buys little.

Usage (Kaggle, repo checked out or Dataset-mounted at --repo-root):
  python train_character_lora.py --species wispkin \
      --repo-root /kaggle/working/repo --out /kaggle/working/lora/wispkin
  python train_character_lora.py --species dorowani --dry-run
"""
import argparse, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path

PILOT_SPECIES = ["mochii", "dorowani", "gabu", "kittember",
                 "sproutle", "wispkin"]

# Factual caption scaffolding ONLY. Deliberately generic: detailed
# trait language (markings, colours, signature features) belongs to
# the canon model sheets and is added by the owner/scorer pass
# before a real training run — this script never invents traits.
CAPTION_TEMPLATE = ("{trigger}, a flat 2D cartoon creature character, "
                    "full body, on a plain white background, "
                    "clean silhouette, show style")

# musubi-tuner (pinned at run time; see plan doc). Clone URL is the
# one published in the project's own docs.
MUSUBI_CLONE = "https://github.com/kohya-ss/musubi-tuner"

# Paths INSIDE the Kaggle session, matching the notebook's existing
# Wan install layout (Comfy-Org repackaged split files). The launch
# script checks each exists and fails loudly rather than guessing.
DEFAULT_PATHS = {
    "dit": "/kaggle/working/ComfyUI/models/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors",
    "vae": "/kaggle/working/ComfyUI/models/vae/wan2.2_vae.safetensors",
    "text_encoder": "/kaggle/working/ComfyUI/models/text_encoders/umt5_xxl_fp16.safetensors",
}


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_images(repo_root, species):
    """Canon cutout + rig renders for one species. Repo paths only."""
    found = []
    cutout = repo_root / "show/production/canon-cutouts" / f"{species}.png"
    if cutout.exists():
        found.append((cutout, "canon_cutout"))
    previews = repo_root / "show/production/rigs/previews"
    if previews.exists():
        for p in sorted(previews.rglob(f"{species}*")):
            if "strip" in p.name.lower() or "sheet" in p.name.lower():
                continue  # filmstrips are contact sheets, not frames
            if p.is_file() and p.suffix.lower() in (".png", ".gif"):
                found.append((p, "rig_preview"))
    builds = repo_root / "show/production/rigs/builds" / species
    if builds.exists():
        for p in sorted(builds.rglob("*.png")):
            # filmstrips / contact sheets are not training frames
            if "strip" in p.name.lower() or "sheet" in p.name.lower():
                continue
            found.append((p, "rig_build_frame"))
    return found


def expand_gif(path, out_dir, species, idx_start):
    """Extract up to 24 frames from a rig-preview GIF as PNGs."""
    try:
        from PIL import Image
    except ImportError:
        print(f"  (no Pillow: skipping GIF frames from {path.name}; "
              f"pip install pillow to include them)")
        return []
    out = []
    im = Image.open(path)
    n = getattr(im, "n_frames", 1)
    step = max(1, n // 24)
    for i in range(0, n, step):
        im.seek(i)
        frame = im.convert("RGBA")
        bg = Image.new("RGBA", frame.size, (255, 255, 255, 255))
        bg.alpha_composite(frame)
        dst = out_dir / f"{species}_{idx_start + len(out):03d}.png"
        bg.convert("RGB").save(dst)
        out.append(dst)
    return out


def main():
    ap = argparse.ArgumentParser(
        description="Prepare a per-species musubi-tuner dataset and "
                    "print the exact Kaggle T4 training command.")
    ap.add_argument("--species", required=True, choices=PILOT_SPECIES)
    ap.add_argument("--repo-root", default="/kaggle/working/repo",
                    help="checkout of this repo inside the session")
    ap.add_argument("--out", default=None,
                    help="dataset/output root "
                         "(default: /kaggle/working/lora/<species>)")
    ap.add_argument("--musubi-dir", default="/kaggle/working/musubi-tuner")
    ap.add_argument("--dit", default=DEFAULT_PATHS["dit"])
    ap.add_argument("--vae", default=DEFAULT_PATHS["vae"])
    ap.add_argument("--text-encoder", default=DEFAULT_PATHS["text_encoder"])
    ap.add_argument("--num-repeats", type=int, default=10)
    ap.add_argument("--epochs", type=int, default=10)
    ap.add_argument("--network-dim", type=int, default=16)
    ap.add_argument("--learning-rate", default="1e-4")
    ap.add_argument("--blocks-to-swap", type=int, default=18,
                    help="of the TI2V-5B DiT's blocks; raise toward "
                         "24 if VRAM still overflows, lower for speed")
    ap.add_argument("--resolution", type=int, default=512,
                    help="square training bucket; canon material is "
                         "square and the avatar target is 720x720 — "
                         "512 is the T4-safe starting bucket")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the plan; write nothing")
    args = ap.parse_args()

    species = args.species
    trigger = f"{species}_chr"
    repo_root = Path(args.repo_root)
    out_root = Path(args.out) if args.out else \
        Path(f"/kaggle/working/lora/{species}")
    img_dir = out_root / "dataset" / f"{args.num_repeats}_{trigger}"

    sources = collect_images(repo_root, species)
    print(f"species: {species}  trigger: {trigger}")
    print(f"sources found in repo: {len(sources)}")
    for p, kind in sources[:12]:
        print(f"  [{kind}] {p.relative_to(repo_root)}")
    if len(sources) > 12:
        print(f"  ... and {len(sources) - 12} more")
    if not sources:
        print("\nFATAL: no canon sources found. Check --repo-root "
              f"(looked under {repo_root}/show/production/). A LoRA "
              "dataset is never built from non-canon imagery "
              "(likeness law).", file=sys.stderr)
        return 2

    written = []
    if not args.dry_run:
        img_dir.mkdir(parents=True, exist_ok=True)
        seen = set()
        idx = 0
        for p, kind in sources:
            if p.suffix.lower() == ".gif":
                for dst in expand_gif(p, img_dir, species, idx):
                    written.append(dst)
                    idx += 1
                continue
            digest = sha256_of(p)
            if digest in seen:
                continue
            seen.add(digest)
            dst = img_dir / f"{species}_{idx:03d}{p.suffix.lower()}"
            idx += 1
            dst.write_bytes(p.read_bytes())
            written.append(dst)
            if idx >= 97:  # cap: small, clean datasets beat big noisy ones
                break
        caption = CAPTION_TEMPLATE.format(trigger=trigger)
        for dst in written:
            dst.with_suffix(".txt").write_text(caption + "\n")
        print(f"\nwrote {len(written)} images + captions -> {img_dir}")

        toml = out_root / "dataset_config.toml"
        toml.write_text(
            "# musubi-tuner dataset config — generated by\n"
            "# train_character_lora.py (see CHARACTER-LORA-PLAN.md)\n"
            "[general]\n"
            "shuffle_caption = true\n"
            'caption_extension = ".txt"\n'
            "keep_tokens = 1\n\n"
            "[[datasets]]\n"
            f"resolution = [{args.resolution}, {args.resolution}]\n"
            "batch_size = 1\n"
            "enable_bucket = true\n\n"
            "  [[datasets.directory]]\n"
            f'  path = "{img_dir}"\n'
            f"  num_repeats = {args.num_repeats}\n")
        print(f"wrote {toml}")

        manifest = {
            "schema": "mochiichao-show/character-lora-dataset/v1",
            "species": species, "trigger": trigger,
            "created_utc": datetime.now(timezone.utc).isoformat(),
            "trainer": "musubi-tuner (kohya-ss) — IMAGE LoRA (single-frame) training; see CHARACTER-LORA-PLAN.md",
            "training_kind": "image_lora_single_frame (NOT video LoRA — not T4-feasible at recommended settings)",
            "sources": [{"path": str(p), "kind": k,
                         "sha256": sha256_of(p)} for p, k in sources],
            "images_written": len(written),
            "caption_template": CAPTION_TEMPLATE.format(trigger=trigger),
            "caption_status": "TEMPLATE_ONLY — trait-level enrichment "
                              "is an owner/scorer pass before training",
            "quality_status": "PENDING_GATE",
        }
        (out_root / "dataset-manifest.json").write_text(
            json.dumps(manifest, indent=2) + "\n")

    steps = max(1, len(written) if written else len(sources)) \
        * args.num_repeats * args.epochs
    musubi = args.musubi_dir
    toml_path = out_root / "dataset_config.toml"
    print("\n" + "=" * 72)
    print("EXACT COMMANDS — Kaggle T4 x2 session (run in order)")
    print("=" * 72)
    print(f"""
# 0. trainer (once per session; pin the commit in the session log)
git clone {MUSUBI_CLONE} {musubi}
cd {musubi} && pip install -e .   # plus the notebook's torch build

# 1. cache VAE latents
python wan_cache_latents.py \\
    --dataset_config {toml_path} \\
    --vae {args.vae}

# 2. cache text-encoder outputs
python wan_cache_text_encoder_outputs.py \\
    --dataset_config {toml_path} \\
    --text_encoder {args.text_encoder} --batch_size 16

# 3. train the IMAGE LoRA (single T4 by default; ~{steps} optimizer
#    steps at the prepared dataset size x {args.num_repeats} repeats
#    x {args.epochs} epochs). The dataset is images only — musubi
#    trains them as single frames. This is deliberately NOT a video
#    LoRA run: video training at recommended settings needs 24 GB+
#    VRAM and does not fit a T4 (KAGGLE-KIT.md, Honest gaps #2).
accelerate launch --num_cpu_threads_per_process 4 wan_train_network.py \\
    --task ti2v-5B \\
    --dit {args.dit} \\
    --dataset_config {toml_path} \\
    --sdpa --mixed_precision fp16 \\
    --gradient_checkpointing \\
    --blocks_to_swap {args.blocks_to_swap} \\
    --optimizer_type adamw8bit --learning_rate {args.learning_rate} \\
    --network_module networks.lora_wan \\
    --network_dim {args.network_dim} --network_alpha {args.network_dim // 2} \\
    --timestep_sampling shift --discrete_flow_shift 3.0 \\
    --max_train_epochs {args.epochs} --save_every_n_epochs 2 \\
    --seed 42 \\
    --output_dir {out_root}/output --output_name {species}_wan22_ti2v5b_lora

# multi-GPU variant (only if step 3 is provably VRAM-bound, not
# time-bound): prefix with `accelerate config` for 2x T4 multi_gpu
# and launch with --num_processes 2; expect modest gains at this
# dataset size.
#
# FLAG PROVENANCE: flags above are musubi-tuner's documented Wan
# training interface (docs/wan.md, verified 2026-10-27). Before a
# real run, diff them against `wan_train_network.py --help` at the
# pinned commit and record any drift in the production log —
# never silently.
#
# OUTPUT: {out_root}/output/{species}_wan22_ti2v5b_lora*.safetensors
# Stage it to the private Kaggle Dataset named in KAGGLE-KIT.md
# (mochiichao-character-loras) — never leave it session-local,
# never commit weights to git. Gate any clip it produces with
# likeness_gate.py before it is shown as production.""")
    return 0


if __name__ == "__main__":
    sys.exit(main())
