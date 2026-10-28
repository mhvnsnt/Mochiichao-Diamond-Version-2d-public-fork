# LORA-MANIFEST — Mochiichao character LoRAs (Wispkin + Dorowani)

Status: **TRAINED — kernel `marsfmmg/mochiichao-lora-train` v5 COMPLETE 2026-10-28, both characters train_rc=0.**
Hashes below were computed on Kaggle in `lora-files.json` and re-verified byte-for-byte after download (local sha256 == Kaggle sha256 for all 4 files).
Date: 2026-10-28. Worker work dir: `~/workspace/avatar-tool-build/lora/`

## Trained files

| character | file | bytes | sha256 | staged at |
|---|---|---|---|---|
| Wispkin | `wispkin_mochii_wan21_1.3b.safetensors` (final, epoch 10) | 87,594,264 | `c349a6c089806c3c7e2120fe48710102cab4b548a48c101128090dae3cbd1230` | Kaggle dataset `marsfmmg/mochiichao-character-loras` + local `output/v5/lora-output/` |
| Wispkin | `wispkin_mochii_wan21_1.3b-000005.safetensors` (epoch-5 checkpoint) | 87,594,256 | `7c07516b0d7dfe698d93333f3c53c94776fbb5e5ecfa5fca42e81706b8de287c` | local `output/v5/lora-output/` |
| Dorowani | `dorowani_mochii_wan21_1.3b.safetensors` (final, epoch 10) | 87,594,264 | `266db2639af56903200e98b33e7c61f8137fe9b6a597ab1bc52281de206aa176` | Kaggle dataset `marsfmmg/mochiichao-character-loras` + local `output/v5/lora-output/` |
| Dorowani | `dorowani_mochii_wan21_1.3b-000005.safetensors` (epoch-5 checkpoint) | 87,594,264 | `bed7f5df163d5d716a89083b24526e48e375f05e1dd9b3b5351d8429fe2af5fc` | local `output/v5/lora-output/` |

File verification (read from the delivered files, not the log): 900 tensors each,
`modelspec.architecture = wan2.1/lora`, rank-16 `lora_down` shapes [16, 1536] / [16, 8960],
embedded training metadata: Wispkin 26 items / 130 steps / 10 epochs; Dorowani 28 items /
140 steps / 10 epochs; base `wan2.1_t2v_1.3B_fp16.safetensors`; ~5 min training each on a Tesla T4.

Target staging after a successful run: private Kaggle dataset
`marsfmmg/mochiichao-character-loras` (owner: marsfmmg).

## ⚠️ Base-model finding (verified at source, read this first)

The original brief assumed musubi-tuner trains the Wan2.2 **TI2V-5B** model that the
test scene uses. It does not — verified 2026-10-28 against kohya-ss/musubi-tuner @ main
commit `f8a1b03794a49239a3539015075f5123d6c07d66`:

- `src/musubi_tuner/wan/configs/__init__.py` → `WAN_CONFIGS` keys are only
  `t2v-14B, t2v-1.3B, i2v-14B, t2i-14B, flf2v-14B, t2v-1.3B-FC, t2v-14B-FC, i2v-14B-FC,
  i2v-A14B, t2v-A14B`. There is **no `ti2v-5B` task** (the string appears only in a
  leftover `SUPPORTED_SIZES` entry), and `wan_train_network.py` hard-codes 16 latent
  channels while TI2V-5B uses the 48-channel Wan2.2 VAE.
- So a musubi-tuner LoRA **cannot** be trained on, or loaded into, TI2V-5B today.

What this package trains instead: **Wan2.1 T2V-1.3B** (`--task t2v-1.3B`), the task in
musubi's own documented training example (docs/wan.md), sized to fit a Kaggle T4.
The notebook still mounts `marsfmmg/mochiichao-wan22-core` and inventories it, and its
preflight cell prints the `WAN_CONFIGS` task list so the gap is visible in the run log.

**How the test scene engages these LoRAs (honest version):** in a Wan2.1-1.3B ComfyUI /
ComfyUI-WanVideoWrapper workflow, add a `WanVideoLoraSelect` node (the same node the
existing TI2V-5B scene workflow uses for its Turbo LoRA) with the character LoRA file,
`strength = 0.8–1.0`, feeding `WanVideoModelLoader` for `wan2.1_t2v_1.3B`; prompt must
contain the trigger token. **The current TI2V-5B scene workflow cannot load these
files** (different architecture) — engaging the characters *in the 5B scene* stays
blocked until musubi-tuner (or another Apache-2.0 trainer) supports TI2V-5B, or the
scene gets a 1.3B variant. That is a named gap, not a silent substitution.

## Source art (canon only)

Full per-file list with bytes + sha256: `DATASET-SOURCES.md` (same folder).
Summary:

- **Wispkin — 1 distinct canon artwork** (`canon-cutouts/wispkin.png`, 288×609 RGBA,
  sha256 `b9de2318…a0523`) + 12 TextRig build frames (float_idle / float_up /
  mask_tilt_left) that deform those same canon pixels.
- **Dorowani — 2 distinct canon artworks** (canon cutout 263×398, sha256 `a255fbb0…6cbf`,
  + the 1600×1600 avatar-stack transparent poster, sha256 `2de3ec92…0ac6`) + 12 TextRig
  build frames (idle_breathe / water_orb_charge / fin_flick).

No donor-production art anywhere (construction-kit rule).

## Datasets (as built, `build_datasets.py`, reproducible)

| dataset | images | captions | construction |
|---|---|---|---|
| `datasets/wispkin/` | 26 PNG (512×512 RGB) + 26 `.txt` | trigger `wispkin_mochii` first token | full-body on white/black/cream/gray × scales, upper-body + head crops, smoke-tail close-up, 12 rig-frame poses. **No horizontal flip** (asymmetric cracked mask). |
| `datasets/dorowani/` | 28 PNG (512×512 RGB) + 28 `.txt` | trigger `dorowani_mochii` first token | same recipe + high-res poster variants + 2 horizontal flips (near-symmetric design, canon-safe). |

Every caption: `<trigger>, <fixed character description>, <view/background>, flat 2D
cartoon illustration, clean black outlines, cel shading`. Contact sheets
(`datasets/contact-*.png`) were visually checked by the worker; two crop defects found
and fixed before training (mid-face head crop, mis-captioned Wispkin “feet” crop →
smoke-tail close-up).

## Training parameters (configs in this folder)

- Trainer: kohya-ss/musubi-tuner @ `f8a1b03`, **Apache-2.0** (repo README licence
  section: “Other code is under the Apache License 2.0”).
- Dataset configs: `dataset_wispkin.toml` / `dataset_dorowani.toml` (musubi
  `docs/dataset_config.md` format): resolution [512,512], bucket on, no upscale,
  batch 1, per-character cache directory.
- Training configs: `train_wispkin.toml` / `train_dorowani.toml` (musubi
  `--config_file` TOML format, `docs/advanced_config.md`): task `t2v-1.3B`,
  DiT Wan2.1 T2V-1.3B fp16 (Comfy-Org repackaged, per docs/wan.md), `--sdpa`,
  mixed precision fp16, `blocks_to_swap = 20` (documented low-VRAM option),
  gradient checkpointing, `adamw8bit`, lr 1e-4, `networks.lora_wan`,
  network_dim 16 / alpha 16, timestep_sampling `shift`, discrete_flow_shift 3.0,
  10 epochs, save every 5, seed 42.
- `fp8_base` (documented) deliberately **omitted**: Kaggle free GPUs (T4/P100) have no
  fp8 tensor cores, and the fp16 1.3B weights (~2.8 GB) fit T4 VRAM with block swap.
- Pre-caching per docs/wan.md: `wan_cache_latents.py --vae wan_2.1_vae.safetensors`;
  `wan_cache_text_encoder_outputs.py --t5 models_t5_umt5-xxl-enc-bf16.pth --fp8_t5`
  (documented <16 GB VRAM option). No CLIP (only required for Wan2.1 I2V).
- Notebook: `mochiichao-lora-train.ipynb`, kernel `marsfmmg/mochiichao-lora-train`,
  datasets `marsfmmg/mochiichao-wan22-core` + `marsfmmg/mochiichao-lora-datasets`.

## Licence

- Training art: Mochiichao's own canon art (the user's own production material).
- Trainer: musubi-tuner, Apache-2.0. Base model: Wan2.1 (Apache-2.0, Alibaba Wan team).
- Resulting LoRAs: derived from the user's own art on an Apache-2.0 base — no
  third-party character, name, or branding is involved.

## Honest quality note (spec, not spin)

- **We have almost no distinct canon art per character: Wispkin 1 artwork, Dorowani 2.**
  Everything else in the sets is the same pixels re-composited, cropped, scaled, or
  rig-deformed. Expect these LoRAs to act as **identity anchors for the front-facing
  full-body look**, not as general character models: side/back views, new expressions,
  and interaction poses are simply not in the data, and the model will invent them in
  base-model style, not canon style.
- The rig frames add only small pose deltas (breathing, tilt, fin flick) — they help
  the LoRA accept slight motion without breaking, they do not teach new poses.
- 512×512 single-frame (image-mode) training teaches appearance, not motion. In an
  I2V/T2V workflow the character's *look* should hold better than with prompt alone;
  its *movement* remains the base model's.
- What would most improve round 2, in order: (1) a real model sheet per character —
  front / ¾ / side / back at one consistent scale; (2) 6–10 expression/head variants;
  (3) 10–20 short canon clips (even rig renders exported as video) so a video-mode
  dataset can teach motion; (4) the same character in 3–4 scene backgrounds instead of
  only flat fields. With ~30 *distinct* images per character, a rank-16 LoRA of this
  kind normally becomes reliable; with 1–2, treat output as a first anchor to iterate on.

## Run history + remaining step

Kernel runs: v1 ERROR (dataset mount race — dataset still processing), v2 ERROR (Kaggle CLI dropped dataset subfolders on upload; mount contained root files only), v3 ERROR (worker's preflight regex missed uppercase task keys — fixed and unit-tested), v4 ERROR (same regex; a failed patch script let the push go out unpatched — owned here), **v5 COMPLETE** (dataset shipped as flat root files; notebook rebuilds per-character dirs in-kernel). No 429 was hit at any point; all calls were single and spaced, first call at 10:15 UTC, 20+ min after work start.

## Staging — done

Both final LoRAs + this manifest + `DATASET-SOURCES.md` + `lora-files.json` are staged in
the private Kaggle dataset `marsfmmg/mochiichao-character-loras` (file listing verified
2026-10-28: both `.safetensors` at 87,594,264 bytes). Training data is staged in
`marsfmmg/mochiichao-lora-datasets`. Local copies of the LoRAs live in
`output/v5/lora-output/` (workbench copy; the partial bulk `kernels output` download of
the run's working dir — models/caches — was killed and cleaned once the LoRA outputs and
their hashes were secured, so the full v5 kernel log was not retained; every claim above
rests on `lora-files.json` and on the delivered files' own embedded metadata, both
re-verified locally).

## Reproduce / resume commands (for the record)

Kaggle discipline used this round: first Kaggle call at 10:15 UTC, 20+ minutes after
work start (shared account rate limits), single spaced calls, stop on any 429 (none hit).

```bash
# 1. upload the training-data dataset (private)
/opt/tools/kaggle-venv/bin/kaggle datasets create -p ~/workspace/avatar-tool-build/lora/kaggle-dataset
# 2. push + run the training kernel
/opt/tools/kaggle-venv/bin/kaggle kernels push -p ~/workspace/avatar-tool-build/lora/kernel
# 3. poll (spaced, single calls)
/opt/tools/kaggle-venv/bin/kaggle kernels status marsfmmg/mochiichao-lora-train
# 4. on COMPLETE: harvest
/opt/tools/kaggle-venv/bin/kaggle kernels output marsfmmg/mochiichao-lora-train -p ~/workspace/avatar-tool-build/lora/output
# 5. stage trained LoRAs as a private dataset (after filling hashes into this manifest)
#    folder: output/lora-output/ + dataset-metadata.json {id: marsfmmg/mochiichao-character-loras}
/opt/tools/kaggle-venv/bin/kaggle datasets create -p ~/workspace/avatar-tool-build/lora/output-dataset
```
