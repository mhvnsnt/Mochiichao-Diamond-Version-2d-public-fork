# BIG-WEIGHTS STAGING TABLE — Mochiichao show pipeline

> **STATUS CORRECTION — 2026-10-28 (wiring package; the table
> below is the 2026-10-27/28 record, kept as written — rows that
> say "to create" or "IN PROGRESS" describe the state when it was
> compiled):**
> - **All Kaggle datasets now exist and are server-verified**
>   (2026-10-28): `marsfmmg/mochiichao-wan22-consistency-kit`,
>   `marsfmmg/mochiichao-wan22-core`, `marsfmmg/mochiichao-wan22-accel`
>   (the kit split three ways — a Kaggle kernel's /kaggle/working
>   quota is ~21 GB, so no single version can hold 38.5 GB),
>   `marsfmmg/mochiichao-ace-step-15-xl-turbo` (**standalone** —
>   ACE-Step does NOT ride in an `ace-step/` folder inside the
>   wan22 kit; the v1 placeholder folder is empty), and
>   `marsfmmg/mochiichao-voice-weights`. Kaggle total staged:
>   61,934,128,382 B.
> - The ACE-Step pull is **COMPLETE**: all four shards
>   sha256-verified against the LFS hashes, folder total exactly
>   19,953,378,268 B, `PULL-DONE` written.
> - RIFE is staged as `rife47.pth` + `rife49.pth` (the VFI node's
>   real checkpoints); the `flownet.pkl` row below names the
>   upstream training layout and is superseded.
> - The owner's `~/.kaggle/kaggle.json` is placed (the "owner
>   places token" action below is done).
> - **The only staging step left in this table is the TeraBox
>   masters batch** (owner's browser session; checklist in
>   `pull-in-programme/TERABOX-MANIFEST.md`). Current grades:
>   `show/production/tooling/WIRE-STATUS.md`; current homes for
>   every row: `show/production/tooling/STAGING-MANIFEST.md`.

Compiled 2026-10-27/28 by the big-weights staging pass. Rule
(workspace AGENTS.md + show staging law): nothing production lives
only on local/ephemeral storage — GitHub for what fits, **TeraBox**
for the big masters, private **Kaggle Datasets** as the GPU seat's
fast cache, local disk is a workbench (transit copies are marked
TRANSIT and cleared once durable copies confirm).

Sizes are byte-exact: HF source metadata or local measurement, as
marked. Licences verified at source 2026-10-27 (licence/pricing
honesty law — buckets named, never flattened).

## 1. Wan / ComfyUI weights — dataset `marsfmmg/mochiichao-wan22-consistency-kit` (to create, private)

Bundle prepared at
[~/workspace/big-weights-stage/kaggle-bundle/mochiichao-wan22-consistency-kit/](../big-weights-stage/kaggle-bundle/mochiichao-wan22-consistency-kit/)
(`dataset-metadata.json`, `BUNDLE-CONTENTS.md`, `UPLOAD-COMMANDS.md`).

| Asset | Bytes | Licence (bucket) | Current homes | Durable home | Remaining action — whose |
|---|---:|---|---|---|---|
| Wan 2.2 TI2V-5B core set (ti2v_5B_fp16 9,999,658,848 + umt5 fp8 6,735,906,897 + wan2.2_vae 1,409,400,960) | **18,144,966,705** | Apache-2.0 (open source) | Kaggle notebook ephemeral storage ONLY (~18 GB re-download per reset) + HF source | Kaggle Dataset (cache) + TeraBox (master) | Owner places `~/.kaggle/kaggle.json`; then Route A in UPLOAD-COMMANDS.md (in-notebook assembly + kagglehub create) — owner token, then one notebook run (parent/orchestrator) |
| Wan22 Turbo LoRA (rank 64 fp16) | 332,348,584 | Kijai/WanVideo_comfy repack of Wan-family weights; treat as Apache-2.0 lineage, card states no separate licence | Kaggle notebook ephemeral + HF source | Same dataset (`models/loras/`) | Same Route A |
| FastWan FullAttn bf16 checkpoint | 9,999,659,744 | Apache-2.0 family (notebook manifest) | Kaggle notebook ephemeral + HF source | Same dataset (`models/diffusion_models/`) | Same Route A |
| GGUF Q8_0 fallback (optional) | 5,400,179,040 | Apache-2.0 | HF source only (notebook pulls on demand) | Same dataset (`models/unet/`) — first split candidate if the dataset size cap bites | Same Route A (optional row) |
| Wan 2.1 VACE-1.3B (`wan2.1_vace_1.3B_fp16`) | 4,309,519,800 | Apache-2.0 (open source) | HF source only — never downloaded | Same dataset (`models/diffusion_models/`) | Route A fetch step. **Kit defect flagged:** the fetch script's resolve pattern also matches the `_preview_` file and will fail loud — exact filename recorded in BUNDLE-CONTENTS.md |
| Wan 2.1 VAE | 253,815,318 | Apache-2.0 | HF source only | Same dataset (`models/vae/`) | Route A fetch step |
| RealESRGAN x4plus anime 6B | 17,938,799 (measured; sha256 `f872d837…f99da`) | BSD-3-Clause (open source) | **Staged in the bundle folder NOW** + upstream GitHub release | Same dataset (`models/upscale_models/`) | None for the file itself — rides Route A |
| RIFE flownet (`flownet.pkl`) | not measured — never staged anywhere | MIT (open source) | **Nowhere** — not on this VM, not on Kaggle | Same dataset (`models/rife/`) | In a Kaggle session: run any ComfyUI-VFI RIFE node once (auto-downloads), re-run the fetch script to stage it, new dataset version — parent/orchestrator, next Wan session. No verified direct URL exists; none was invented |
| IP-Adapter stills pair (plus_sd15 + ViT-H encoder) | 98,183,288 + 2,528,373,448 | Apache-2.0 | HF source only; NOT pulled (stills stage is opt-in) | Same dataset, `*_STILLS_ONLY/` folders, only if the stills stage is adopted | Optional — fetch script `--stills-stage` during Route A |

**Dataset totals:** core+accel+VACE+VAE+RealESRGAN = **33,058,248,950**;
+GGUF = 38,458,427,990; +ACE-Step (row 2) = 53,011,627,218 /
58,411,806,258.

## 2. ACE-Step 1.5 XL Turbo — music layer

| Asset | Bytes | Licence (bucket) | Current homes | Durable home | Remaining action — whose |
|---|---:|---|---|---|---|
| `ACE-Step/acestep-v15-xl-turbo` full snapshot (4 safetensors shards 4,986,971,456 / 4,986,942,776 / 4,986,942,808 / 4,988,483,464 + silence_latent.pt 3,841,215 + configs/code) | **19,953,378,268** (source total) | **MIT** (open source) — CONFIRMED at source 2026-10-27: HF card `license: mit` + ACE-Step-1.5 GitHub repo LICENSE file (MIT, © ACEStep) | **Pull IN PROGRESS on this VM** → `~/workspace/ace-step-stage/acestep-v15-xl-turbo/` (chunk-parallel resumable pull, sha256-verified per shard vs HF LFS hashes; progress in `~/workspace/ace-step-stage/pull.log`, `PULL-DONE` marker on completion). TRANSIT copy per workspace rule | Kaggle: inside dataset row 1 under `ace-step/` (kit design — no separate dataset; standalone metadata prepared anyway in `ace-step-stage/kaggle-dataset/`). Master: TeraBox | (a) Pull finishes unattended — nobody's action; verify `PULL-DONE` + VERIFIED log lines, then (b) TeraBox upload of the folder — **owner's browser step** (can ride the same session as the voice-weights upload); (c) Kaggle copy arrives via Route A fetch — same step as row 1 |

## 3. Voice weights — SIBLING JOB (cross-reference only, not duplicated)

| Asset | Bytes | Licence | State |
|---|---:|---|---|
| Chatterbox set + Kokoro set | **3,522,322,124** | MIT / Apache-2.0 | Staged at `~/workspace/voice-weights-stage/`; dataset `marsfmmg/mochiichao-voice-weights` bundle prepared. Awaiting: owner's `kaggle.json` + owner's TeraBox upload. Manifest: `~/workspace/voice-weights-stage/VOICE-WEIGHTS-MANIFEST.md` |

## 4. Stragglers audit — everything else heavy on this VM

| Asset | Bytes | Licence | Finding | Remaining action — whose |
|---|---:|---|---|---|
| BiRefNet `model.safetensors` (ZhengPeng7/BiRefNet) | 444,473,596 (measured, hf-cache blob) | MIT | Only copy is `~/opt/hf-cache` on this VM (already cross-noted in the voice manifest). Measured production role: non-white-field matting (PR #365). No durable staged copy yet | Add to the owner's TeraBox masters upload batch (same session as rows 2–3) — owner; or accept HF as source-of-truth and record the debt — parent's call |
| RVM torchscripts (resnet50 108,063,684 + mobilenetv3 15,501,891) in `~/opt/tools/rvm/` | 123,565,575 | MIT (project) | Local-only, but the backend is **evaluated_rejected** (alpha collapses on this material) — not a production dependency | None. Re-downloadable from the project's GitHub releases if ever revisited; listed so the audit is complete |
| HunyuanVideo 1.5 / LTX-2.3 weights | — | (catalogue entries only) | Verified **absent** from this VM — backends.json candidates, never downloaded | None unless adopted; LTX carries its community-licence revenue condition, Hunyuan excludes EU/UK/KR — flags already in backends.json |
| Character LoRAs (`mochiichao-character-loras` dataset) | — | owner's own art derivatives | No LoRA trained yet, dataset does not exist | Created at the first training run (KAGGLE-KIT.md procedure step 7: copy LoRA + dataset manifest in before the session ends) — parent/orchestrator, during Wan test 2 |
| musubi-tuner, ComfyUI + node packs | code only | GPL-3.0 (ComfyUI) / MIT (musubi-tuner) etc. | Cloned fresh per Kaggle session from GitHub; the notebooks + kit scripts are versioned in the repo | None — code is not staging debt |
| Installed tools under `~/opt` (Blender, Krita, Tahoma2D, Kdenlive, MuseScore, …) | — | per TOOLS-MANIFEST | Installation, not staging (AGENTS.md) — excluded from this table by definition | None |

## 5. The short list of human steps left

1. **Owner:** place `~/.kaggle/kaggle.json` (kaggle.com/settings → Create New Token). This single token unblocks BOTH Kaggle datasets (voice + wan22 kit).
2. **Owner (browser):** one TeraBox upload session carrying: voice-weights folder (3,522,322,124), ACE-Step folder (19,953,378,268, once the pull verifies), BiRefNet file (444,473,596).
3. **Parent/orchestrator:** run Route A in the next Kaggle session to create `marsfmmg/mochiichao-wan22-consistency-kit`; do NOT disturb the currently running A/B browser task.
4. **Nobody:** the ACE-Step pull — it runs unattended, resumable, self-verifying.

**Grand total of production weights accounted for in this table:**
18,144,966,705 (Wan core) + 10,332,008,328 (accel) + 4,563,335,118
(VACE+VAE) + 17,938,799 (RealESRGAN) + 19,953,378,268 (ACE-Step) +
3,522,322,124 (voice) + 444,473,596 (BiRefNet) = **56,978,422,938
bytes**, plus the optional GGUF 5,400,179,040.
