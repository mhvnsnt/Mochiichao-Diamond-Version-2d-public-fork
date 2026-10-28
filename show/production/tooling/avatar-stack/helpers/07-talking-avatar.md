# 07 — Talking-avatar stack (dialogue performance)

**Status: SPEC with real interfaces — ships AFTER the core test scene**
(owner addendum). Verification 2026-10-28 at source as noted per item.
Prior-lane findings reused and cited: pull-in ledger A1 (voice
weights), D (Rhubarb), and the avatar-stack `backends.json` record on
MuseTalk (PR #350-era production log + backends entry: "MIT
(TMElyralab/MuseTalk LICENSE file read at source 2026-10-27)").

## The wired spine (exists today, no new dependency)

```
human line text
 → TTS slot (below) → line WAV
 → Rhubarb 1.13.0 (MIT; install repaired + run verified, ledger D)
 → rhubarb_to_mouthdata.py → mochiichao-mouth-data/v1
 → mouth-swap stepped display (mochiichao-show/mouth-swap/v1) on the
   cut-out rig; body held per the dialogue method
 → composite (shadows at composite time only)
```

Humans only. Creatures are cries-only by owner law and never enter
this stack.

## TTS backend slots — WIRED (weights staged, byte-verified)

From pull-in ledger **A1**: Kaggle dataset
`marsfmmg/mochiichao-voice-weights`, status ready, server-side listing
byte-matched to the manifest (17 files):

- **Chatterbox** — **MIT** (open source). Files: t3_cfg
  2,129,653,744 B; s3gen 1,056,484,620 B; ve 5,695,784 B; conds.pt
  107,374 B; tokenizer.json 25,470 B. Slot use: cloned character
  voices (per-character `character.yaml` skeletons for Aeon/Hex/
  Mochiko ride in the same dataset).
- **Kokoro-82M** — **Apache-2.0** (open source). kokoro-v1_0.pth
  327,212,226 B + config + 6 voice packs. Slot use: clean stock
  voices / fallback.

`07_dialogue_spec.py` names these exact files in every generated
spec, so a TTS run resolves weights from the dataset, never from a
fresh download.

## Wan2.2-S2V-14B — SPEC / GAP, not staged

- **Verified at the HF source** (`Wan-AI/Wan2.2-S2V-14B` model card,
  read 2026-10-28): audio-driven cinematic video generation (image +
  audio + optional prompt/pose video, 480P/720P, clip length follows
  the audio). **Licence: Apache-2.0** ("The models in this repository
  are licensed under the Apache 2.0 License… We claim no rights over
  your generated contents"). Code repo Wan-Video/Wan2.2 is likewise
  Apache-2.0 (LICENSE.txt read).
- **Size, honestly:** it is a 14B-parameter checkpoint — ~28 GB at
  bf16 for the transformer alone, before the T5 encoder/VAE/audio
  components the repo also ships. (Estimate from parameter count;
  a per-file HF listing was not pulled this session, so no exact
  byte total is claimed.)
- **Why it does not fit the current seat:** the card's own
  single-GPU command "can run on a GPU with at least 80GB VRAM"; the
  documented alternative is 8-GPU FSDP+Ulysses. Our seat is Kaggle
  T4 ×2 (16 GB each) with a measured ~21 GB `/kaggle/working` quota
  (ledger A2) — the checkpoint alone exceeds the working quota, and
  no 80 GB device exists in the lane. Quantized/offload community
  routes (FP8/GGUF via WanVideoWrapper) are **unevaluated for S2V**
  and are not claimed.
- Disposition: the spec generator emits the S2V job shape
  (`{task: s2v-14B, image, audio, prompt, size}`) per line with
  status `spec_gap_not_staged`. Adoption needs a bigger seat or a
  measured quantized proof — a future decision, not a wiring claim.

## MuseTalk — SPEC ONLY, not staged

- **Code licence: MIT** — LICENSE file (Tencent Music Entertainment
  Group copyright) read at source this session, confirming the prior
  lane's 2026-10-27 finding (GitHub's licence API still returns
  NOASSERTION for it; the file itself is MIT).
- **Weights licence: stated, not formal.** Its README's
  Disclaimer/License section says "The trained model are available
  for any purpose, even commercially" — but there is **no separate
  weights licence file**, and the same section requires the other
  component models to follow their own licences (whisper,
  ft-mse-vae, dwpose, S3FD), and its test data is non-commercial
  research only. Bucket: **code = open source (MIT); weights =
  project-stated commercial-ok, formally unlicenced → scratch /
  evaluation only until a staging decision re-verifies each
  component.** No weights were staged by this lane.
- Fit note: MuseTalk is latent-inpainting lip-sync for realistic
  footage faces; our humans are flat cut-outs whose mouth lane is
  the Blair stepped display. Even if staged, it would be an
  experiment against the wired Rhubarb lane, not a replacement —
  the same conclusion the unified-pipeline doc already recorded.

## Deliverable in this folder

- `07_dialogue_spec.py` — generates a per-scene dialogue-performance
  spec (`mochiichao-show/dialogue-performance/v1-spec`) over the
  real interfaces above: TTS slot + staged weight files, Rhubarb →
  mouth-data/v1 paths, cut-out performance step, and the S2V /
  MuseTalk stages labelled spec/gap. Refuses creature lines.
  Run-tested (1-line scene; creature line correctly refused).
