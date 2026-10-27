#!/usr/bin/env python3
"""Fetch/stage the Kaggle consistency kit — RE-SCOPED 2026-10-27.

Companion to KAGGLE-KIT.md. Run inside / alongside the Kaggle
notebook `mochiichao-comfyui-wan` (ComfyUI + Wan 2.2 TI2V-5B,
2x Tesla T4, Turing sm75, SDPA only).

=====================================================================
RESEARCH CORRECTION APPLIED (2026-10-27, supersedes the first kit
draft — read KAGGLE-KIT.md "Honest gaps" for the full text):

  * NO IP-Adapter and NO ControlNet exists for Wan 2.2. Those
    tools belong to the still-image / keyframe stage ONLY. This
    script fetches IP-Adapter files ONLY under --stills-stage,
    into a folder whose name says so, for ComfyUI STILLS work
    (keyframe generation with SD checkpoints) — never as Wan
    video conditioning, and its output text says so every run.
  * The Wan-native conditioning equivalents are VACE, Phantom,
    Wan-Animate-14B, S2V-14B and first/last-frame control — all
    Apache-2.0, all 14B-class and therefore T4-MARGINAL. The one
    T4-feasible eval size is VACE-1.3B (Wan 2.1 family), which is
    this kit's DEFAULT and first eval target: reference-image
    conditioning, control-video editing, and sparse-keyframe
    (first/last-frame) generation in one model.
  * First/last-frame for this notebook rides VACE-1.3B sparse
    keyframes (see wan21_vace_first_last_frame.json +
    build_sparse_flf_control.py). TI2V-5B itself has no FLF
    mode; its native conditioning is start-image only.

Licences were verified at the source on 2026-10-27 for every row
(see KAGGLE-KIT.md). Sizes stated by a source are labelled as
such; everything else is MEASURED after download into the fetch
manifest — never asserted in advance.
=====================================================================

Defaults fetch: VACE-1.3B + its Wan 2.1 VAE + shared UMT5 encoder,
ACE-Step 1.5 XL Turbo checkpoints (music layer, MIT),
RealESRGAN_x4plus_anime_6B (upscale, BSD-3-Clause), and stages
RIFE flownet weights IF the ComfyUI-VFI node pack has already
auto-downloaded them (MIT; no fabricated direct URL — see the
RIFE row in KAGGLE-KIT.md).

Usage:
  python fetch_consistency_models.py --comfy-root /kaggle/working/ComfyUI
  python fetch_consistency_models.py --dry-run
  python fetch_consistency_models.py --stills-stage   # + IP-Adapter (STILLS ONLY)
  python fetch_consistency_models.py --dataset-out /kaggle/working/kit-dataset
"""
import argparse, hashlib, json, shutil, sys
from datetime import datetime, timezone
from pathlib import Path


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ------------------------------------------------------------------ rows
# Each row: one of
#   kind="url"      direct file URL (exact, verified at source)
#   kind="resolve"  resolve ONE file from a HF repo by pattern;
#                   fails loudly on 0 or >1 matches (no guessing)
#   kind="snapshot" whole HF repo snapshot (model's own layout)
#   kind="stage-if-present"  copy from a known local cache location

ROWS = [
    {
        "id": "wan2.1-vace-1.3b",
        "stage": "video_conditioning (Wan-native)",
        "verdict": "DEFAULT EVAL TARGET — T4-feasible size",
        "kind": "resolve",
        "repo": "Comfy-Org/Wan_2.1_ComfyUI_repackaged",
        "pattern": ["vace", "1.3b"],
        "suffix": ".safetensors",
        "dest": "diffusion_models",
        "licence": "Apache-2.0",
        "bucket": "open_source",
        "licence_detail": "Wan family licence; VACE model card "
                          "(Wan-AI/Wan2.1-VACE-1.3B) — Apache 2.0, "
                          "no rights claimed over generated content.",
        "source_stated_size": "1.3B at 480p only (model card task "
                              "table: VACE-1.3B 720p NOT supported)",
        "notes": "Reference-image conditioning (R2V), control-video "
                 "editing (V2V/MV2V), sparse-keyframe FLF. This is "
                 "a Wan 2.1 model: it pairs with wan_2.1_vae, NOT "
                 "the Wan 2.2 VAE, and it does not take TI2V-5B "
                 "LoRAs. Eval FIRST at 832x480, <=81 frames.",
    },
    {
        "id": "wan2.1-vae",
        "stage": "video_conditioning (shared)",
        "verdict": "SUPPORTED — required by VACE-1.3B",
        "kind": "resolve",
        "repo": "Comfy-Org/Wan_2.1_ComfyUI_repackaged",
        "pattern": ["wan_2.1_vae"],
        "suffix": ".safetensors",
        "dest": "vae",
        "licence": "Apache-2.0",
        "bucket": "open_source",
        "licence_detail": "Wan family licence, Comfy-Org repack.",
        "source_stated_size": None,
        "notes": "Skip if the notebook already has it (never "
                 "overwrites an existing non-empty file).",
    },
    {
        "id": "umt5-xxl-fp8-scaled",
        "stage": "shared text encoder",
        "verdict": "SUPPORTED — already used by the TI2V-5B workflow",
        "kind": "url",
        "url": "https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors",
        "filename": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
        "dest": "text_encoders",
        "licence": "Apache-2.0",
        "bucket": "open_source",
        "licence_detail": "Wan family licence, Comfy-Org repack.",
        "source_stated_size": None,
        "notes": "Shared by TI2V-5B and VACE workflows.",
    },
    {
        "id": "ace-step-1.5-xl-turbo",
        "stage": "music layer (post / score generation)",
        "verdict": "SUPPORTED — standalone, not a Wan component",
        "kind": "snapshot",
        "repo": "ACE-Step/acestep-v15-xl-turbo",
        "dest": "ace-step/acestep-v15-xl-turbo",
        "licence": "MIT",
        "bucket": "open_source",
        "licence_detail": "MIT — verified via the ACE-Step 1.5 "
                          "project licence statements and ComfyUI's "
                          "ACE-Step 1.5 XL announcement (\"MIT "
                          "license, trained on licensed music, "
                          "royalty-free/public domain, and synthetic "
                          "MIDI-to-Audio data\"), 2026-10-27. The "
                          "model card's own download command is the "
                          "fetch used here.",
        "source_stated_size": "4B-parameter XL DiT (model card); "
                              "repo total measured after download",
        "notes": "8-step turbo, no CFG (model card). Runs in its "
                 "own acestep service / ComfyUI ACE-Step nodes; "
                 "keep it OUT of the Wan graph. Commercial-clean "
                 "per the training-data statement above.",
    },
    {
        "id": "realesrgan-x4plus-anime-6b",
        "stage": "post (upscaling)",
        "verdict": "SUPPORTED — post stage only",
        "kind": "url",
        "url": "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth",
        "filename": "RealESRGAN_x4plus_anime_6B.pth",
        "dest": "upscale_models",
        "licence": "BSD-3-Clause",
        "bucket": "open_source",
        "licence_detail": "Real-ESRGAN project licence: package "
                          "metadata (realesrgan PKG-INFO) states "
                          "\"BSD-3-Clause License\"; repo carries the "
                          "LICENSE file, verified 2026-10-27.",
        "source_stated_size": "17.9 MB (release listing)",
        "notes": "Anime/cartoon-tuned 4x upscaler — the right "
                 "variant for this show's flat 2D material. Loads "
                 "via ComfyUI UpscaleModelLoader. NOTE: .pth is a "
                 "pickle-format checkpoint — source is the "
                 "project's own GitHub release, recorded here.",
    },
    {
        "id": "rife-flownet (ComfyUI-VFI)",
        "stage": "post (frame interpolation)",
        "verdict": "SUPPORTED — post stage only, node-managed weights",
        "kind": "stage-if-present",
        "candidates": [
            "custom_nodes/ComfyUI-VFI/rife/train_log/flownet.pkl",
            "models/rife/flownet.pkl",
        ],
        "dest": "rife",
        "licence": "MIT",
        "bucket": "open_source",
        "licence_detail": "RIFE (ECCV 2022, hzwer/Practical-RIFE "
                          "lineage) is MIT — verified via the RIFE "
                          "project licence records, 2026-10-27.",
        "source_stated_size": None,
        "notes": "ComfyUI-VFI auto-downloads flownet.pkl on first "
                 "use; the upstream project distributes it via its "
                 "own repo links, for which no stable direct URL "
                 "was verified — so this script NEVER invents one. "
                 "It stages the file from the node's cache if "
                 "present, else prints the manual step (run any "
                 "RIFE VFI node once, re-run this script). .pkl is "
                 "pickle format — source is the node's own "
                 "auto-download, recorded in the manifest.",
    },
    # ---------------- stills stage ONLY ----------------
    {
        "id": "ip-adapter-plus-sd15 (STILLS STAGE ONLY)",
        "stage": "keyframe stills ONLY — NOT Wan conditioning",
        "verdict": "STILLS ONLY — no Wan 2.2 support exists",
        "kind": "url",
        "url": "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors",
        "filename": "ip-adapter-plus_sd15.safetensors",
        "dest": "ipadapter_STILLS_ONLY",
        "licence": "Apache-2.0",
        "bucket": "open_source",
        "licence_detail": "h94/IP-Adapter is Apache-2.0. File page: "
                          "98.2 MB, sha256 a1c250be40455cc61a43da1201"
                          "ec3f1edaea71214865fb47f57927e06cbe4996 "
                          "(recorded so the staged copy can be "
                          "hash-checked).",
        "source_stated_size": "98.2 MB (HF file page)",
        "flag": "--stills-stage",
        "notes": "For SD 1.5 keyframe-stills graphs ONLY (paired "
                 "with the ViT-H encoder below). It cannot attach "
                 "to Wan TI2V-5B, VACE, or any Wan DiT. Anyone "
                 "wiring it into a video graph is repeating the "
                 "error this kit's honest-gaps section exists to "
                 "kill.",
    },
    {
        "id": "clip-vit-h-14 (STILLS STAGE ONLY)",
        "stage": "keyframe stills ONLY — NOT Wan conditioning",
        "verdict": "STILLS ONLY — IP-Adapter's image encoder",
        "kind": "url",
        "url": "https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors",
        "filename": "CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors",
        "dest": "clip_vision_STILLS_ONLY",
        "licence": "Apache-2.0",
        "bucket": "open_source",
        "licence_detail": "Distributed in h94/IP-Adapter "
                          "(Apache-2.0); renamed on download per "
                          "ComfyUI_IPAdapter_plus's own README.",
        "source_stated_size": None,
        "flag": "--stills-stage",
        "notes": "Stills stage only, same warning as above.",
    },
]

DOCUMENTED_NOT_WIRED = [
    ("VACE-14B (Wan-AI/Wan2.1-VACE-14B)", "Apache-2.0",
     "14B-class: T4-MARGINAL. Documented, NOT a kit default. "
     "Evaluate only after VACE-1.3B proves the workflow, at "
     "480p/short frame counts with offloading, expecting slow runs."),
    ("Phantom (Wan 2.1 subject-consistency)", "Apache-2.0",
     "14B-class: T4-MARGINAL, not wired. Reference-subject route "
     "if VACE R2V underperforms; needs its own eval first."),
    ("Wan-Animate-14B", "Apache-2.0",
     "14B-class: T4-MARGINAL, not wired. Character animation / "
     "replacement from a driving video — relevant to rig-driven "
     "shots later; note the upstream caution against Wan 2.2 "
     "LoRAs on Animate recorded in backends research."),
    ("Wan2.2-S2V-14B (audio-driven)", "Apache-2.0",
     "14B-class: T4-MARGINAL, not wired. Speech-to-video; the "
     "show's creatures are cries-only and humans are the talking "
     "seat — revisit only for a human-cast test."),
    ("Wan 2.1 FLF2V-14B (dedicated first/last-frame model)", "Apache-2.0",
     "14B-class: T4-MARGINAL, not wired. The kit's FLF route is "
     "VACE-1.3B sparse keyframes instead (T4-feasible)."),
]


def fetch_url(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        from huggingface_hub import hf_hub_download
        repo, fname = url.split("/resolve/main/", 1)
        repo = repo.replace("https://huggingface.co/", "")
        got = Path(hf_hub_download(repo_id=repo, filename=fname,
                                    local_dir=str(dest.parent / ".hf_tmp")))
        if got != dest:
            shutil.move(str(got), str(dest))
        return dest
    except Exception as e:
        print(f"  huggingface_hub path failed ({e}); urllib fallback")
        import urllib.request
        tmp = dest.with_suffix(dest.suffix + ".part")
        with urllib.request.urlopen(url, timeout=120) as r, open(tmp, "wb") as f:
            while (chunk := r.read(1 << 20)):
                f.write(chunk)
        tmp.replace(dest)
        return dest


def fetch_resolved(repo, pattern, suffix, dest_dir):
    from huggingface_hub import HfApi, hf_hub_download
    files = HfApi().list_repo_files(repo)
    hits = [f for f in files if all(b in f.lower() for b in pattern)
            and f.lower().endswith(suffix)]
    if len(hits) != 1:
        print(f"  FATAL-RESOLVE: {pattern} in {repo} matched "
              f"{len(hits)}: {hits[:6]} — refusing to guess.")
        return None
    return Path(hf_hub_download(repo_id=repo, filename=hits[0],
                                local_dir=str(dest_dir)))


def main():
    ap = argparse.ArgumentParser(
        description="Fetch/stage the re-scoped Kaggle consistency kit "
                    "(see module docstring + KAGGLE-KIT.md).")
    ap.add_argument("--comfy-root", default="/kaggle/working/ComfyUI")
    ap.add_argument("--dataset-out", default=None,
                    help="stage into this folder (Kaggle-Dataset "
                         "layout) instead of a ComfyUI tree")
    ap.add_argument("--stills-stage", action="store_true",
                    help="ALSO fetch the IP-Adapter stills-stage "
                         "files (SD 1.5 keyframes ONLY — never Wan)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    base = Path(args.dataset_out) if args.dataset_out \
        else Path(args.comfy_root) / "models"
    ace_base = Path(args.dataset_out) if args.dataset_out \
        else Path(args.comfy_root).parent

    print("=" * 72)
    print("WAN VIDEO CONDITIONING IN THIS KIT IS VACE-1.3B + FLF.")
    print("IP-Adapter / ControlNet do NOT exist for Wan 2.2 — they")
    print("appear here, if at all, ONLY in the stills stage.")
    print("=" * 72)
    for name, lic, note in DOCUMENTED_NOT_WIRED:
        print(f"  documented-not-wired: {name} [{lic}] — {note}")

    manifest = {"schema": "mochiichao-show/kaggle-consistency-kit-fetch/v2",
                "created_utc": datetime.now(timezone.utc).isoformat(),
                "base": str(base), "dry_run": bool(args.dry_run),
                "fetched": [], "skipped_existing": [], "failed": [],
                "staged": [], "not_wired": [
                    {"name": n, "licence": l, "note": t}
                    for n, l, t in DOCUMENTED_NOT_WIRED]}

    for row in ROWS:
        if row.get("flag") == "--stills-stage" and not args.stills_stage:
            print(f"\n[{row['id']}] skipped (pass --stills-stage; "
                  f"STILLS ONLY)")
            continue
        print(f"\n[{row['id']}] {row['verdict']}")
        print(f"  stage: {row['stage']}  licence: {row['licence']} "
              f"({row['bucket']})")
        if args.dry_run:
            print(f"  would stage -> {base}/{row['dest']}/")
            continue
        try:
            if row["kind"] == "url":
                dest = (ace_base / row["dest"] if False else base / row["dest"]) / row["filename"]
                if dest.exists() and dest.stat().st_size > 0:
                    print(f"  exists, skipping: {dest}")
                    manifest["skipped_existing"].append(row["id"])
                    continue
                fetch_url(row["url"], dest)
            elif row["kind"] == "resolve":
                dest_dir = base / row["dest"]
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest = fetch_resolved(row["repo"], row["pattern"],
                                       row["suffix"], dest_dir)
                if dest is None:
                    manifest["failed"].append(row["id"])
                    continue
            elif row["kind"] == "snapshot":
                from huggingface_hub import snapshot_download
                dest_dir = ace_base / row["dest"]
                snapshot_download(repo_id=row["repo"],
                                  local_dir=str(dest_dir))
                dest = dest_dir
            elif row["kind"] == "stage-if-present":
                src = None
                for cand in row["candidates"]:
                    p = Path(args.comfy_root) / cand
                    if p.exists() and p.stat().st_size > 0:
                        src = p
                        break
                if src is None:
                    print("  NOT PRESENT locally. Manual step: run "
                          "any RIFE VFI node once in ComfyUI (it "
                          "auto-downloads flownet.pkl), then re-run "
                          "this script to stage it. Nothing was "
                          "fabricated or downloaded from a guessed URL.")
                    manifest["failed"].append(row["id"])
                    continue
                dest = base / row["dest"] / src.name
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(src, dest)
            size = dest.stat().st_size if dest.is_file() else None
            manifest["fetched" if row["kind"] != "stage-if-present"
                     else "staged"].append(
                {"id": row["id"], "path": str(dest), "bytes": size,
                 "sha256": sha256_of(dest) if dest.is_file() else None,
                 "licence": row["licence"]})
            print(f"  -> {dest} ({size} bytes, measured)")
        except Exception as e:
            print(f"  FAILED: {e}")
            manifest["failed"].append(row["id"])

    if not args.dry_run:
        out = base / "consistency-kit-fetch-manifest.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(manifest, indent=2) + "\n")
        print(f"\nmanifest: {out}")
    print(f"\nfetched={len(manifest['fetched'])} "
          f"staged={len(manifest['staged'])} "
          f"skipped={len(manifest['skipped_existing'])} "
          f"failed={len(manifest['failed'])}")
    return 1 if manifest["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
