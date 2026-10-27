# Kaggle Consistency Kit — one-attach-and-run for Wan test 2+

**Scope correction applied 2026-10-27.** This kit was re-scoped
mid-build after deep research confirmed the original premise was
wrong. The correction is recorded here in full because it changes
what "the lock stack" honestly is:

> **No IP-Adapter and no ControlNet exists for Wan 2.2.** Those
> tools belong to the still-image/keyframe stage only. The
> Wan-native conditioning equivalents are **VACE, Phantom,
> Wan-Animate-14B, S2V-14B, and first/last-frame control** — all
> Apache-2.0, all 14B-class and therefore **T4-marginal** — plus
> **VACE-1.3B** as the T4-feasible eval size.

Everything below follows that correction. The earlier framing in
`backends.json` ("IP-Adapter + ControlNet installed, not yet
engaged") should be read through it: the node packs are cloned in
the notebook, but **there is no Wan model for them to engage**,
and no future test should be planned as if engaging them locks
likeness on Wan.

## Kit contents (this folder)

| file | what it is |
|---|---|
| `fetch_consistency_models.py` | Fetch/stage script: VACE-1.3B + shared Wan files, ACE-Step 1.5, RealESRGAN anime, RIFE staging; IP-Adapter only under `--stills-stage`. Writes a measured sha256 fetch manifest. |
| `wan21_vace_first_last_frame.json` | ComfyUI workflow **template** for first/last-frame generation on VACE-1.3B (loader names are placeholders for the fetch script's resolved names; audit before queueing; not yet executed). |
| `build_sparse_flf_control.py` | Builds the sparse-keyframe control+mask videos that workflow consumes (first + last canon frames, blank span). |
| `train_character_lora.py` | Per-species **image**-LoRA dataset prep (repo canon only) + printed musubi-tuner training commands for T4. Does not run training. |
| `CHARACTER-LORA-PLAN.md` | The trainer decision (evidence), dataset spec, and T4 settings. |
| `KAGGLE-KIT.md` | This document: manifest, staging, session procedure, honest gaps. |

## Model manifest — licence-verified at source, 2026-10-27

Licence honesty law: every label below was checked against the
model card / licence file / project record named in the fetch
script's rows on 2026-10-27. Sizes are source-stated (labelled)
or measured into the fetch manifest at download time.

### Default fetch (the eval kit)

| component | role | licence (bucket) | size | staged to |
|---|---|---|---|---|
| **Wan2.1-VACE-1.3B** (Comfy-Org repackaged single file; filename pattern-resolved at fetch time, script fails loudly if ambiguous) | Wan-native conditioning: reference-image (R2V), control-video editing, sparse-keyframe FLF | **Apache-2.0** (open source) | 1.3B; card task table: **480p only** (720p ✗ for 1.3B) | Kaggle Dataset (below) → `models/diffusion_models/` |
| `wan_2.1_vae.safetensors` | VAE for VACE (2.1 family — not the 2.2 VAE) | Apache-2.0 (open source) | measured at fetch | Dataset → `models/vae/` |
| `umt5_xxl_fp8_e4m3fn_scaled.safetensors` | text encoder, shared with TI2V-5B | Apache-2.0 (open source) | measured at fetch | Dataset → `models/text_encoders/` |
| **ACE-Step 1.5 XL Turbo** (`ACE-Step/acestep-v15-xl-turbo`, fetched by its own card's download command) | generative **music layer** (score/beds; standalone service, not a Wan node) | **MIT** (open source); project states training data = licensed music + royalty-free/public domain + synthetic MIDI-to-audio | 4B DiT; repo total measured at fetch | Dataset → `ace-step/` |
| **RealESRGAN_x4plus_anime_6B.pth** (xinntao/Real-ESRGAN release v0.2.2.4) | post upscaling, anime-tuned 4x (the right variant for flat 2D) | **BSD-3-Clause** (open source; package metadata + repo LICENSE) | **17.9 MB** (release listing) | Dataset → `models/upscale_models/` |
| **RIFE flownet** (ComfyUI-VFI) | post frame interpolation | **MIT** (open source) | measured when staged | Dataset → `models/rife/` |

RIFE fetch honesty: ComfyUI-VFI auto-downloads `flownet.pkl` on
first use; upstream distributes it through the RIFE repo's own
links, for which **no stable direct URL was verified** — so the
fetch script never invents one. It stages the file from the
node's cache if present, else prints the manual step. (`.pkl` /
`.pth` pickle-format weights are only ever taken from the
project's own release / the node's own download, and the source
is recorded in the fetch manifest.)

### Stills stage ONLY (fetched only with `--stills-stage`)

| component | licence | size | hard rule |
|---|---|---|---|
| `ip-adapter-plus_sd15.safetensors` (h94/IP-Adapter) | Apache-2.0 | 98.2 MB (HF file page; sha256 recorded in the fetch script for hash-checking) | **Keyframe stills with SD 1.5 checkpoints ONLY.** Cannot attach to any Wan model. Lands in `models/ipadapter_STILLS_ONLY/` so the folder name itself carries the warning. |
| `CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors` (h94/IP-Adapter image encoder, renamed per the node pack's README) | Apache-2.0 | measured at fetch | Same rule; `models/clip_vision_STILLS_ONLY/`. |

There is deliberately **no ControlNet row at all** — not even a
stills row in the default kit: SD ControlNets were not needed
for the keyframe plan (Canny preprocessing is built into
ComfyUI), and adding SD1.5 ControlNet weights to a Wan kit is
exactly the category error this document exists to prevent. If a
stills graph later needs one, it gets its own verified row then.

### Documented, NOT wired (14B-class, T4-marginal)

All Apache-2.0 (Wan family / project cards, verified 2026-10-27).
None is a kit default; each needs VACE-1.3B to prove the workflow
first, then its own eval at 480p / short frame counts with
offloading and slow runtimes expected on a 16 GB T4:

- **VACE-14B** — the full-size VACE; 480p+720p per its card.
- **Phantom** (Wan 2.1) — subject-consistency from reference
  images; the fallback if VACE R2V underperforms.
- **Wan-Animate-14B** — character animation/replacement from a
  driving video (rig-performance transfer is its obvious show
  use, later). Upstream cautions against Wan 2.2 LoRAs on
  Animate — recorded in the avatar-stack research.
- **Wan2.2-S2V-14B** — audio-driven video. Creatures are
  cries-only by voice law; only a human-cast test would use it.
- **Wan 2.1 FLF2V-14B** — the dedicated first/last-frame model.
  The kit's FLF route is VACE-1.3B sparse keyframes instead.

## Staging (staging law: weights never live only in a session)

Scripts and docs live in **this repo** (this PR). Weights live in
private Kaggle Datasets, created once under the notebook account
(Mars FMMG) and attached to every session:

| Kaggle Dataset (private, to create) | contents |
|---|---|
| `mochiichao-wan22-consistency-kit` | VACE-1.3B file, `wan_2.1_vae`, UMT5 fp8 encoder, RealESRGAN anime 6B, RIFE flownet (once staged), ACE-Step 1.5 XL Turbo checkpoints under `ace-step/`, and the fetch manifest JSON from the staging run. Layout mirrors `models/<subdir>/` so attach = copy/symlink, no renaming. |
| `mochiichao-character-loras` | Trained per-species image LoRAs (`<species>_wan22_ti2v5b_lora*.safetensors`) + each dataset-manifest.json from `train_character_lora.py`. LoRAs are versioned here, never committed to git, never left session-local. |

Anything that later outgrows Kaggle Datasets follows the
standing staging law (GitHub for what fits, TeraBox for the
rest) — local/session-only copies are staging debt.

## One-attach-and-run session procedure (Wan test 2+)

1. Open notebook `mochiichao-comfyui-wan`; attach
   `mochiichao-wan22-consistency-kit` (and
   `mochiichao-character-loras` once any LoRA exists).
2. Run the notebook's existing install cells (ComfyUI + Wan 2.2
   TI2V-5B as before). Copy/symlink the Dataset's `models/*`
   into `ComfyUI/models/*`.
   - If a file is missing from the Dataset, run
     `fetch_consistency_models.py --comfy-root /kaggle/working/ComfyUI`
     in a cell — it fetches only the verified rows and writes
     its manifest into `models/`.
3. **Test 2 (unchanged goal, corrected locks):** TI2V-5B with
   start-image conditioning + the species **image LoRA** (when
   trained) at tight framing — the locks that actually exist.
4. **VACE eval (new):** load `wan21_vace_first_last_frame.json`,
   replace the `REPLACE_ME` loader/input names with the
   resolved fetch names + a control pair from
   `build_sparse_flf_control.py` (canon first/last frames),
   **audit the graph** (the test-1 2×-upscale defect rule),
   run at 832×480 / 81 frames.
5. Every produced clip: `generate_bundle.py` →
   `likeness_gate.py` vs the canon cutout. No gate packet, no
   production claim (pipeline law, unchanged).
6. Post for kept clips only: RealESRGAN anime upscale →
   RIFE VFI (×2 only if fps-doubling is wanted) → music bed
   from the ACE-Step service attached as the scene is built
   (production direction), all recorded in the bundle manifest.
7. Copy any newly trained LoRA + its dataset manifest into
   `mochiichao-character-loras` (new Dataset version) **before**
   the session ends.

## HONEST GAPS — headline items first

1. **No IP-Adapter or ControlNet for Wan 2.2 exists.** (Research
   correction, 2026-10-27.) The SD1.5/SDXL/Flux IP-Adapter models
   and all SD ControlNet checkpoints — including every line-art
   ControlNet — condition Stable Diffusion UNets and cannot
   attach to a Wan DiT. Any plan, graph, or claim that locks Wan
   likeness "with IP-Adapter + ControlNet" is wiring parts that
   do not exist for this model. In this kit they appear only at
   the **keyframe-stills stage**, labelled as such. The
   `backends.json` lock entries for the Wan backend
   (`ip_adapter` / `controlnet`: "installed_not_yet_engaged")
   describe cloned node packs, not usable Wan conditioning, and
   should be reworded at the next backends update.
2. **Video LoRA is not T4-feasible at recommended settings.**
   musubi-tuner's own guidance puts Wan **video** training at
   24 GB+ VRAM; a T4 has 16 GB. The feasible path is the
   per-character **image LoRA** (~12 GB image training), which
   teaches identity/appearance only — **not motion**. A LoRA
   that also teaches how a character *moves* waits for a bigger
   GPU seat; nothing in this kit fakes it with image training
   relabelled.
3. **All the strong Wan-native conditioning is 14B-class.**
   VACE-14B, Phantom, Wan-Animate-14B, S2V-14B, FLF2V-14B are
   Apache-2.0 and real, but on T4×2 they are marginal: 480p,
   short, offloaded, slow. The kit's working eval is
   VACE-**1.3B**, a Wan **2.1** model — it does not share
   TI2V-5B's VAE, does not take TI2V-5B LoRAs, and its card
   supports 480p only. Cross-family expectations must be set
   accordingly: the eval proves the *conditioning workflow*,
   not final-quality conditioning for the 5B show pipeline.
4. **VACE sparse-keyframe FLF is a documented pattern, not a
   measured result.** The control/mask convention in
   `build_sparse_flf_control.py` (neutral-gray blank span) comes
   from VACE community documentation of the sparse-keyframe
   pattern; it has not yet survived a gated test on this show's
   material. The eval in step 4 above is what would prove or
   correct it (blank value is a flag, not a belief).
5. **ACE-Step 1.5 is a music layer, not a consistency tool.**
   It is in the kit because it is MIT-clean and commercial-safe
   for score/beds — it does nothing for character likeness, and
   its XL checkpoints share the T4 with nothing else: run it
   when the Wan graph is idle.
6. **Nothing here has been run yet.** This kit is scripts, a
   workflow template, and verified staging — the VACE eval, the
   first image LoRA, and the FLF pair all still have to earn
   their gate packets in session. Statuses in `backends.json`
   (Wan: motion proven / likeness unproven) are unchanged by
   anything in this PR.

## Sources (verified 2026-10-27)

- VACE model cards: `Wan-AI/Wan2.1-VACE-1.3B` /
  `-diffusers` (task table: 1.3B = 480p) and `Wan-AI/Wan2.1-VACE-14B`
  — Apache-2.0; VACE user guide (R2V/V2V/MV2V inputs) and the
  sparse-keyframe description in VACE community workflow docs.
- ComfyUI VACE / Wan template records (VACE 1.3B + 14B listed;
  ACE-Step 1.5 XL template family) and ComfyUI's ACE-Step 1.5
  XL announcement (MIT; training-data statement).
- ACE-Step 1.5: project repo `ACE-Step/ACE-Step-1.5` (MIT) and
  the `ACE-Step/acestep-v15-xl-turbo` card (its own
  `huggingface-cli download` command; 8-step turbo, no CFG).
- Real-ESRGAN: `xinntao/Real-ESRGAN` LICENSE (BSD-3-Clause,
  also in the package PKG-INFO) and release v0.2.2.4 listing
  (`RealESRGAN_x4plus_anime_6B.pth`, 17.9 MB).
- RIFE: ECCV 2022 project (`hzwer/Practical-RIFE` lineage,
  MIT); ComfyUI-VFI node documentation (auto-download of
  `flownet.pkl` on first use; manual placement paths).
- IP-Adapter (stills only): `cubiq/ComfyUI_IPAdapter_plus`
  README model list (SD 1.5 / SDXL / Kolors / Flux — no Wan) and
  `h94/IP-Adapter` file pages (Apache-2.0; plus_sd15 size +
  sha256 as recorded in the fetch script).
- musubi-tuner: project README/docs (Wan 2.1/2.2 via
  `wan_train_network.py`; ~12 GB image training, 24 GB+ video
  guidance) — see `CHARACTER-LORA-PLAN.md`.
