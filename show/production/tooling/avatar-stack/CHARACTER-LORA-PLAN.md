# Character IMAGE-LoRA plan — the T4-feasible consistency path

Re-scoped 2026-10-27 (see `KAGGLE-KIT.md`, Honest gaps #2):
**video LoRA at recommended settings is not T4-feasible.**
What fits a Kaggle T4 (16 GB) is a per-character **image LoRA**:
it teaches the video backends what a character *is* (identity,
proportions, colourway, style), while start-image / VACE
reference conditioning supplies the frame it performs from.
Motion style is not taught by this LoRA and is not claimed.

## Trainer decision: musubi-tuner (primary), ai-toolkit (alternate)

Both trainers were verified to support Wan 2.2 TI2V-5B LoRA
training at the source on 2026-10-27. The choice is about the
T4 seat, not about capability on a big card:

**musubi-tuner (kohya-ss) — PRIMARY.**
- Supported-architecture list includes Wan 2.1/2.2 with a
  dedicated trainer, `wan_train_network.py`, and `docs/wan.md`
  covers the Wan tasks including `ti2v-5B`.
- Its published VRAM guidance is the deciding evidence:
  **~12 GB is enough for image-based training** (with
  `blocks_to_swap` + fp8 options), while **24 GB+ is
  recommended for video training**. The first number fits a
  T4; the second is exactly why video LoRA is a gap, not a plan.
- Script-first (dataset TOML + cache-then-train commands),
  which is what a one-attach-and-run Kaggle session needs;
  two-stage caching (VAE latents, then text-encoder outputs)
  means a crashed session re-pays minutes, not hours.
- Licence: the project is open source (verify the LICENSE file
  at the pinned commit in-session; the plan does not ship
  musubi code, it clones it at run time).

**ai-toolkit (ostris) — DOCUMENTED ALTERNATE, not primary.**
- Verified support: its supported-models list includes
  `Wan-AI/Wan2.2-TI2V-5B-Diffusers` explicitly, and community
  Wan 2.2 5B LoRAs credit it as their trainer. Licence: **MIT**
  (GitHub licence record for `ostris/ai-toolkit`).
- Why not primary here: it is GUI/YAML-first (weaker fit for a
  scripted Kaggle cell), and its published practical guidance
  starts around 24 GB-class cards for video-model training —
  the same wall, without musubi's documented 12 GB image path
  and block-swap tooling for this exact model family. If a
  future seat has 24 GB+, re-evaluate it for the *video* LoRA
  this plan defers.

## Dataset spec (per species) — canon only

Built by `train_character_lora.py` from the repo checkout:

| source | repo path | use |
|---|---|---|
| canon cutout | `show/production/canon-cutouts/<species>.png` | the likeness reference of record; always included, highest repeat weight via the folder repeat count |
| rig previews | `show/production/rigs/previews/` (`<species>-idle.gif` + filmstrips) | GIF frames extracted as stills (≤24, white-composited); filmstrips are contact sheets — excluded as training images, they teach grid layouts, not characters |
| rig build frames | `show/production/rigs/builds/<species>/**.png` | pose/expression variety from the TextRig builds (idle + signature poses); strip/sheet files excluded by name |

Rules:
- **No external or generated imagery.** Likeness law: datasets
  are built from the character's actual repo art only. The
  rejected glossy batch is not training data.
- Dedupe by sha256; cap ≈ 96 images/species. Small and clean
  beats large and noisy at this scale.
- Wispkin trains from the **canon (masked) cutout** — the
  owner-confirmed reference of record. The pre-mask flashback
  look is a different (deliberate) design and is NOT mixed in.
- Kittember frames with a detached flame are design-gate
  failures in canon; if any slip into rig frames, they are
  excluded at dataset review, not trained around.

## Captioning

musubi consumes a `.txt` beside each image. The launch script
writes a **template** caption per image:

```
<species>_chr, a flat 2D cartoon creature character, full body,
on a plain white background, clean silhouette, show style
```

- The `<species>_chr` trigger token is unique per species and
  is `keep_tokens = 1` in the dataset TOML, so the token binds
  to the character and the descriptive tail can vary.
- **Honesty note:** trait-level caption language (markings,
  colourway, signature features — e.g. Dorowani's shell and
  fin cheeks, Wispkin's cracked skull mask) belongs to the
  canon model sheets. The script does not invent traits;
  enriching captions from the model sheets is an owner/scorer
  pass recorded in the dataset manifest
  (`caption_status: TEMPLATE_ONLY`) before a run is called
  production training rather than a smoke test.
- Auto-captioning with a VLM (musubi ships a Qwen-VL captioner)
  was considered and rejected as the default: generic VLM
  captions describe cartoon creatures poorly and can contradict
  canon (the exact failure behind earlier likeness drift).
  Template + canon enrichment is slower and truer.

## Settings (T4 16 GB starting point — image training)

| setting | value | why |
|---|---|---|
| task | `ti2v-5B` (musubi Wan task) | the show's wired base model |
| resolution bucket | 512×512, bucketing on | canon material is square; 512 is the documented 12 GB-class image bucket — 720² is a later experiment, not the default |
| batch size | 1 | 16 GB ceiling |
| LoRA rank / alpha | 16 / 8 | the common character-LoRA default in the trainer's guidance; enough for identity at this dataset size |
| optimizer / LR | adamw8bit, 1e-4 | 8-bit optimizer is a VRAM lever, LR is the conservative character-LoRA start |
| mixed precision | **fp16** (not bf16) | T4 tensor cores are fp16; bf16 has no tensor-core path on Turing (sm75) |
| attention | **SDPA only** (`--sdpa`) | FlashAttention-2 requires sm80+; the notebook already runs SDPA-only |
| block swap | `--blocks_to_swap 18` (of 30) | the documented low-VRAM lever; raise toward 24 before lowering resolution |
| gradient checkpointing | on | standard 16 GB fit |
| fp8 | NOT in the default command | on T4, fp8 is storage-only dequantisation (no FP8 tensor cores before Ada) — a memory option if block swap alone overflows, recorded as such if used |
| epochs / repeats | 10 epochs × 10 repeats (≈ 800–1,500 steps at the capped dataset size) | identity LoRAs converge in this range; save every 2 epochs and gate clips from ≥2 checkpoints before choosing |
| GPUs | 1 of the 2 T4s | the second T4 keeps ComfyUI warm; DDP overhead buys little at this dataset size |

Printed commands (latent cache → text-encoder cache → train)
are emitted by `train_character_lora.py`; flag provenance is
musubi's `docs/wan.md` as verified 2026-10-27, and the script
instructs diffing them against `--help` at the pinned commit
before a real run.

## After training

1. Stage the LoRA + dataset manifest to the private Kaggle
   Dataset `mochiichao-character-loras` (see KAGGLE-KIT.md) —
   never session-local, never in git.
2. Produce test clips (TI2V-5B start-image + LoRA; VACE R2V is
   a separate family and does not take this LoRA).
3. `likeness_gate.py` vs the canon cutout; promotion only by
   the recorded owner/scorer verdict (pipeline law).
4. Record the run — trainer commit, final settings, gate
   numbers — in the production log. A LoRA with no gate packet
   is an experiment, not a consistency lock.
