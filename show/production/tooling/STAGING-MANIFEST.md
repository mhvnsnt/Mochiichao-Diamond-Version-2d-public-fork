# STAGING-MANIFEST — every weight the wired stack needs, and where it lives

> **CORRECTION - 2026-10-28 (owner law: "YOU HAVE A BROWSER";
> the body below is the 2026-10-28 manifest, kept as written):**
> Every "owner batch" label in the TeraBox columns below
> (section A "PENDING - owner batch #6" / "PENDING #6",
> section B "PENDING #6", section C "PENDING - owner batch #4"
> and "owner batch #5", section D "PENDING - owner batch #2" /
> "PENDING #2", section E "PENDING - owner batch #3",
> section G "TeraBox PENDING - owner batch #1"), the Totals
> row "PREPARED - owner's one upload session", and the closing
> sentence "waiting on the owner's single upload session" are
> superseded as to WHO uploads. Owner's words: "anytime
> something says only the browser can do this you have a
> browser. You can do it. Forever and always." The batch
> numbers survive as checklist numbering only; the uploads run
> through Muse's own signed-in browser, whose file picker
> reads this machine's own disk. State at correction time:
> batches #1 (dialogue kit), #3 (BiRefNet) and #5 (FluidR3)
> are uploaded and verified in the TeraBox folder
> `Mochiichao-Staging`; #2 (voice weights) is in flight, going
> up part by part; #4 (ACE-Step) was dispatched 2026-10-28;
> #6 (Wan masters) has no local files on this VM - it is
> assembled from the Kaggle kit first and then goes up the
> same way. Nothing on this list waits on an owner upload
> session. Full law: `show/production/pipeline/ORCHESTRATOR.md`,
> "You have a browser law".

Compiled **2026-10-28** for Jamar's order: everything free that
does what the avatar-scoped tool does gets wired completely and
staged in the repo AND on TeraBox.

**Staging law (owner, standing):** GitHub for what fits ·
TeraBox for what's too big · local disk is a workbench, never
the warehouse. Kaggle private datasets are the GPU seat's fast
cache — a real durable home, but the TeraBox master is still
owed for every weight row (see the TeraBox column).

**Licence law:** every label below was verified at the source
(model card / licence file / project record) on the date named —
never flattened. Buckets: **open source** (licence named) ·
**free proprietary** · **free-but-restricted** (conditions
named) · **not declared at source** (flagged, never relabelled).

**Cross-checks done for this manifest** (so nothing is
double-staged or double-claimed):

- The wan22 bundle folder's `ace-step/` subfolder is **empty** —
  ACE-Step does not ride inside the Wan kit. It is its own
  Kaggle dataset (split forced by Kaggle's ~21 GB kernel
  working-disk quota). Older text in `ace-step-stage/MANIFEST.md`
  ("inside the wan22 kit") is stale; this manifest governs.
- Voice weights exist in three layers on purpose — HF cache
  (the local seat's working copy, installation), the local
  stage folder (transit), the Kaggle dataset (durable cache).
  That is layering, not duplication. The TeraBox master is the
  one layer still missing.
- RealESRGAN exists in the bundle folder AND the Kaggle
  dataset — the dataset copy is the staged one; the bundle
  folder is its upload source. One asset, two seats, recorded.
- RIFE's staged files are `rife47.pth` / `rife49.pth` (the
  checkpoints the VFI node actually consumes). The older
  staging table's `flownet.pkl` name is the upstream repo's
  training layout — superseded, recorded in the bundle's
  DATASET-STATUS note.

---

## A. Animation — Wan 2.2 generation set

Kaggle homes (all private, all status `ready`, every file
byte-size-verified server-side 2026-10-28):

| Asset | Bytes | Source | Licence (verified) | GitHub home | Kaggle home | TeraBox home | Local transit |
|---|---:|---|---|---|---|---|---|
| `wan2.2_ti2v_5B_fp16.safetensors` | 9,999,658,848 | Comfy-Org/Wan_2.2_ComfyUI_Repackaged | **Apache-2.0** (open source; card licence field, 2026-10-27) | — (too big) | `marsfmmg/mochiichao-wan22-core` → `models/diffusion_models/` | PENDING — owner batch #6 | notebook ephemeral only |
| `wan2.2_vae.safetensors` | 1,409,400,960 | same | **Apache-2.0** | — | `…-wan22-core` → `models/vae/` | PENDING #6 | notebook ephemeral only |
| `umt5_xxl_fp8_e4m3fn_scaled.safetensors` | 6,735,906,897 | same (shared with §B) | **Apache-2.0** | — | `…-wan22-consistency-kit` → `models/text_encoders/` | PENDING #6 | notebook ephemeral only |
| `Wan2_2-TI2V-5B-FastWanFullAttn_bf16.safetensors` | 9,999,659,744 | Kijai/WanVideo_comfy repack | **Not declared on the repack card** — base Wan 2.2 is Apache-2.0; **RECHECK BEFORE COMMERCIAL SHIP** | — | `…-wan22-accel` → `models/diffusion_models/` | PENDING #6 | notebook ephemeral only |
| `Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors` | 332,348,584 | Kijai/WanVideo_comfy repack | **Not declared on the repack card** — underlying Self-Forcing is MIT, base Wan Apache-2.0; **RECHECK BEFORE COMMERCIAL SHIP** (flag carried in repo `backends.json`) | — | `…-wan22-accel` → `models/loras/` | PENDING #6 | notebook ephemeral only |
| `Wan2.2-TI2V-5B-Q8_0.gguf` (optional VRAM fallback) | 5,400,179,040 | QuantStack/Wan2.2-TI2V-5B-GGUF | **Apache-2.0** (per bundle composition record, 2026-10-27) | — | `…-wan22-accel` → `models/unet/` | PENDING #6 | — |

**Section total: 38,458,427,990 B** (the full three-dataset
scope, GGUF included). TeraBox batch #6 counts the Wan masters
as 33,040,310,151 B (core + accel + §B rows, priced before the
GGUF was folded in — the checklist total is in §Totals).

## B. Animation — consistency + post set

| Asset | Bytes | Source | Licence (verified) | GitHub home | Kaggle home | TeraBox home | Local transit |
|---|---:|---|---|---|---|---|---|
| `wan2.1_vace_1.3B_fp16.safetensors` | 4,309,519,800 | Comfy-Org/Wan_2.1_ComfyUI_repackaged (the non-preview file — the fetch script's resolve pattern also matches a `_preview_` file and fails loud; exact name recorded here) | **Apache-2.0** (card, 2026-10-27) | — | `…-wan22-consistency-kit` → `models/diffusion_models/` | PENDING #6 | — (never downloaded to this VM) |
| `wan_2.1_vae.safetensors` | 253,815,318 | same | **Apache-2.0** | — | `…-wan22-consistency-kit` → `models/vae/` | PENDING #6 | — |
| `rife47.pth` | 21,344,827 | ComfyUI-Frame-Interpolation project's own release mirrors (from `vfi_utils.py`'s download list) | **MIT** (hzwer/ECCV2022-RIFE licence, verified 2026-10-28) | — | `…-wan22-consistency-kit` → `models/rife/` | PENDING #6 | bundle folder `models/rife/` (upload source) |
| `rife49.pth` | 21,345,274 | same | **MIT** | — | same | PENDING #6 | bundle folder (upload source) |
| `RealESRGAN_x4plus_anime_6B.pth` | 17,938,799 (sha256 `f872d837…f99da`) | xinntao/Real-ESRGAN release v0.2.2.4 | **BSD-3-Clause** (repo LICENSE + package metadata, 2026-10-27) | — | `…-wan22-consistency-kit` → `models/upscale_models/` | PENDING #6 | bundle folder (upload source) |

**Section total: 4,623,964,018 B** (UMT5 counted once, in §A).

## C. Music — ACE-Step 1.5 XL Turbo + soundfont

| Asset | Bytes | Source | Licence (verified) | GitHub home | Kaggle home | TeraBox home | Local transit |
|---|---:|---|---|---|---|---|---|
| ACE-Step snapshot, 4 shards + `silence_latent.pt` + configs/code | **19,953,378,268** (per-shard bytes + LFS sha256 in `ace-step-stage/MANIFEST.md`; all four shards sha256-VERIFIED locally 2026-10-28) | HF `ACE-Step/acestep-v15-xl-turbo` | **MIT** (open source — HF card `license: mit` + ACE-Step-1.5 repo LICENSE, both read 2026-10-27). Project states training data = licensed + royalty-free/public-domain + synthetic | — (too big) | `marsfmmg/mochiichao-ace-step-15-xl-turbo` (standalone; `ready`, server-verified 2026-10-28) | PENDING — owner batch #4 (upload-ready: local pull verified, `PULL-DONE` written) | `~/workspace/ace-step-stage/acestep-v15-xl-turbo/` — TRANSIT master, cleared once TeraBox + Kaggle confirm (Kaggle has) |
| `FluidR3_GM.sf2` (GM soundfont for the LMMS/MIDI seat) | 148,398,306 (sha256 `74594e8f…1cb0`) | Debian `fluid-soundfont-gm` package (Frank Wen) | **MIT** (upstream statement in the Debian copyright file, fetched + staged with the file, 2026-10-28) | doc only — `show/production/sfx-library/SOUNDFONT.md` (file exceeds GitHub's 100 MB limit) | — | PENDING — owner batch #5 (its durable home) | `~/workspace/pull-in-programme/soundfont/` |

## D. Voice — Chatterbox + Kokoro

Kaggle home for the whole section: private dataset
`marsfmmg/mochiichao-voice-weights` — `ready`, all 17 files
byte-verified server-side 2026-10-28. (Dataset metadata carries
the single name "MIT" because Kaggle accepts one licence; both
licences are documented in the manifest inside the dataset.)

| Asset | Bytes | Source | Licence (verified) | GitHub home | TeraBox home | Local transit |
|---|---:|---|---|---|---|---|
| Chatterbox `t3_cfg.safetensors` | 2,129,653,744 | HF `ResembleAI/chatterbox` @ `5bb1f6ee` | **MIT** (code + weights; package metadata + project record, 2026-10-27) | manifest only — `show/production/tooling/VOICE-WEIGHTS-MANIFEST.md` | PENDING — owner batch #2 | `~/workspace/voice-weights-stage/chatterbox/` |
| Chatterbox `s3gen.safetensors` | 1,056,484,620 | same | **MIT** | same | PENDING #2 | same |
| Chatterbox `ve.safetensors` | 5,695,784 | same | **MIT** | same | PENDING #2 | same |
| Chatterbox `conds.pt` + `tokenizer.json` | 107,374 + 25,470 | same | **MIT** | same | PENDING #2 | same |
| Kokoro `kokoro-v1_0.pth` | 327,212,226 (sha256 matches the HF card) | HF `hexgrad/Kokoro-82M` @ `f3ff3571` | **Apache-2.0** (open weights; card + package metadata, 2026-10-27; card states training audio is permissive/non-copyrighted only) | same | PENDING #2 | `~/workspace/voice-weights-stage/kokoro/` |
| Kokoro `config.json` + 6 voice packs | 2,351 + 6 × ~523,425 | same | **Apache-2.0** | same | PENDING #2 | same |

**Section total: 3,522,322,124 B.** Per-character reference
audio: **none staged anywhere** — casting is the owner's call
and the slots are empty by design (audition candidates live at
`~/workspace/voice-casting-samples/`, local only, ~1 MB class —
they land in the repo's `voice-kit/refs/` once he rules).

## E. Matting

| Asset | Bytes | Source | Licence (verified) | GitHub home | Kaggle home | TeraBox home | Local transit |
|---|---:|---|---|---|---|---|---|
| BiRefNet `model.safetensors` | 444,473,596 (sha256 `9ab37426…e056`) | HF `ZhengPeng7/BiRefNet` | **MIT** (upstream LICENSE read at source 2026-10-27) | — | — (its seat is the local/Kaggle batch matting plan, not the Wan kit) | PENDING — owner batch #3 (copy staged ready at `~/workspace/terabox-session/BiRefNet-model.safetensors`) | HF cache (working copy) + terabox-session copy |
| RVM TorchScripts (resnet50 + mobilenetv3) | 123,565,575 | PeterL1n/Robust-Video-Matting releases | GPL-3.0 | — | — | **NOT STAGED — evaluated and rejected** for this material (alpha collapse). Listed so the audit is complete; re-downloadable if ever revisited | `~/opt/tools/rvm/` (installation, not staging) |

## F. Fonts — GitHub-sized, staged in the repo

| Asset | Bytes | Source | Licence (verified) | GitHub home |
|---|---:|---|---|---|
| `Bungee-Regular.ttf` | 118,996 (sha256 `c4f5361c…6e3f`) | google/fonts `ofl/bungee/` | **SIL Open Font License 1.1** (OFL.txt read at source 2026-10-28; staged beside the font) | `show/production/fonts/` ✔ on main |
| `Fredoka[wdth,wght].ttf` | 159,184 (sha256 `2ba02e68…3fc8`) | google/fonts `ofl/fredoka/` | **SIL OFL 1.1** (same) | `show/production/fonts/` ✔ on main |

No Kaggle/TeraBox copies needed — the repo is the durable home;
the render seat loads from the repo path.

## G. Reference media

| Asset | Bytes | Licence | Homes |
|---|---:|---|---|
| Pokémon dialogue kit folder (`~/workspace/pokemon-dialogue-kit/`) | 186,277,499 | Reference only — public decomp/documentation material; never shipped as content | TeraBox PENDING — owner batch #1. Not a repo item. |
| Canon cutouts (7 files, the likeness gate's ground truth) | small | Owner's own art | GitHub ✔ — `show/production/canon-cutouts/` on main, md5-verified at landing; the cleaned Sproutle is CURRENT, the baked-shadow version is marked NOT USABLE |

## H. Deliberately NOT staged

| Item | Why not |
|---|---|
| LTX-2.3 weights | **Free-but-restricted** (LTX-2 Community License: commercial use free only under $10M annual revenue). Catalogue-only until an adoption decision. |
| HunyuanVideo 1.5 weights | **Free-but-restricted** (Tencent Hunyuan Community License: does not apply in EU/UK/KR; separate agreement above 100M MAU). Catalogue-only. |
| IP-Adapter stills pair (98,183,288 + 2,528,373,448) | Apache-2.0, but **not pulled**: the stills stage is opt-in and unadopted. The fetch script pulls them under `--stills-stage` into `*_STILLS_ONLY/` folders if that day comes. They can never attach to a Wan model. |
| Per-character LoRAs | **Do not exist.** Nothing to stage. First training run creates the `mochiichao-character-loras` dataset (procedure in KAGGLE-KIT.md step 7). |
| ComfyUI / node packs / musubi-tuner | Code, not weights (GPL-3.0 / MIT). Cloned fresh per Kaggle session from GitHub; notebooks + kit scripts are versioned in the repo. Not staging debt. |
| Installed tools under `~/opt` (Blender, Krita, Rhubarb, …) | Installation, not staging (workspace rule). Excluded by definition. |

## Totals

| Scope | Bytes | State |
|---|---:|---|
| Kaggle-staged, server-verified 2026-10-28 (Wan three datasets 38,458,427,990 + ACE-Step 19,953,378,268 + voice 3,522,322,124) | **61,934,128,382** | DONE — durable cache homes confirmed |
| TeraBox batch still owed (dialogue kit 186,277,499 + voice 3,522,322,124 + BiRefNet 444,473,596 + ACE-Step 19,953,378,268 + FluidR3 148,398,306 + Wan masters 33,040,310,151) | **57,295,159,944** | PREPARED — owner's one upload session (`~/workspace/pull-in-programme/TERABOX-MANIFEST.md` is the checklist) |
| GitHub-staged (fonts + all code/docs/manifests) | small | DONE — on main, verified by tree audit 2026-10-28 |

**The one-sentence version:** everything is staged except the
TeraBox masters — 57.3 GB across six checklist items, all
sitting ready on this VM, waiting on the owner's single upload
session.

---

## CORRECTION (2026-10-28) — Voice-weights TeraBox staging: COMPLETE at listing level

Dated follow-up to this document's earlier position, which made no TeraBox completion claim for the voice weights because the upload chain was still mid-flight at landing time.

- The voice-weights split set is now COMPLETE in the TeraBox folder `Mochiichao-Staging`: all 38 parts (aa–bl) verified present by a full-set listing check — complete sequence, none missing, none duplicated. The final part was verified 2026-10-28, 07:04 CDT. Account usage at completion: 38.3 GB / 1024 GB.
- Scope of that verification, stated plainly: it is LISTING-level only (file names + displayed sizes in the folder listing). It is NOT byte-level verification. Byte-completeness of the set is established only on download, reassembly, and sha256 comparison against MANIFEST.txt.
- Flag carried forward: part-be (part 31 of 38) showed a "System Error" label on its upload panel during its upload, despite completing and appearing in the listing. Part-be is specifically flagged for checksum verification on download, before the set is relied on.
