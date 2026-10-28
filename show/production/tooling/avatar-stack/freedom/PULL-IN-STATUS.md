# Pull-in status — the six teardown pieces, after the freedom landing

Dated: **2026-10-28**. Source list: `AVATAR-TOOL-TEARDOWN.md` (measured
2026-10-28), "EXACT PULL-IN LIST". This file is the status of those six
pieces after the `freedom/` package landed. Licence labels follow the
licence/pricing honesty law: open source (licence named) / free
proprietary / free-but-restricted / paid — verified at the source, as
recorded in the teardown.

| # | Piece | Pull-in | Status after this landing |
|---|---|---|---|
| 1 | Input / reference prep | **BiRefNet** (MIT) | **Have it, staging owed.** Weights already downloaded locally (`~/opt/hf-cache`); measured on this show's material (see `backends.json`: loses to white-matte on white-field clips, wins by default on non-white fields). Still owed: its TeraBox staging slot. Not touched by this package. |
| 2 | Auto character description / prompt extension | **Qwen/Qwen2.5-VL-7B-Instruct** (Apache-2.0 — the 7B specifically) | **Still owed.** Named and licence-verified in the teardown; not yet pulled or staged anywhere. The freedom path does not block on it: `prompt_library.json` (this folder) carries hand-written canon prompts today; Qwen-VL prompt extension is an upgrade, not a prerequisite. |
| 3 | Still generator (restyle) | **black-forest-labs/FLUX.1-schnell** (Apache-2.0; explicitly NOT FLUX.1-dev) | **Still owed, and bypassed by default.** The wired default animates canon art directly (likeness law — restyle is why likeness drifts). FLUX.1-schnell is only for when a genuinely new still is needed; not yet staged. |
| 4 | Job control (replaces the activation gate) | **ComfyUI** (GPL-3.0) headless, driven by `generate_bundle.py` | **Have it.** ComfyUI is the Kaggle lane's host (notebook `mochiichao-comfyui-wan`); `generate_bundle.py` is in the repo avatar-stack tooling. This package adds the v2 scene job format (`job_format_v2.md` + `scene_job.example.json`) on top: multiple characters, segment lists, free-text actions, no activation. |
| 5 | Video model (the engine) | **Wan-AI/Wan2.2-TI2V-5B** (Apache-2.0) working engine; **Wan2.2-I2V-A14B** (Apache-2.0) quality tier; consistency: **Wan2.1-VACE** + **Wan2.1-FLF2V-14B-720P** (both Apache-2.0) + **kohya-ss/musubi-tuner** (Apache-2.0) for per-character LoRAs | **Prepared, likeness unproven.** The 5B kit is staged in the private Kaggle datasets (consistency-kit / -core / -accel, per the staging records); motion is proven, likeness is not — the first free-model test drifted Wispkin to a realistic 3D skull, and no character LoRA has been trained yet. A14B quality tier not yet staged (needs 80GB-class or quantized/offload runs). |
| 6 | Finishing / packaging | **FFmpeg + libx264** (free software, LGPL/GPL depending on build) + repo's own `white_matte.py` and `likeness_gate.py` | **Have it, in use — and extended by this package.** The measured encode recipe (720×720, 24 fps, 192 frames) and the transparent-twin path were already wired. This landing adds `chain_segments.py` (segment joining + seam report) and `scene_composite.py` (multi-character composite, composite-time shadows only), both smoke-tested locally — numbers in `SMOKE-TESTS.md`. |

## Also landed here, beyond the six

- **RIFE interpolation** (`rife_workflow.json` + `interpolation.md`):
  the ComfyUI-Frame-Interpolation pack (MIT, verified at its repo
  2026-10-28). **Gap flagged in writing in `interpolation.md`: the
  `rife47.pth` flownet is staged nowhere** — the scene notebook fetches
  it in-session on first run, and staging it (Kaggle dataset or
  TeraBox, with a manifest entry) is still owed after that first run.

## Note on backends.json wording (checked, not edited)

The retired wording — IP-Adapter / ControlNet described as Wan locks
that were "installed, not yet engaged" — was checked in
`show/production/tooling/avatar-stack/backends.json` on main during
this landing. **It is already corrected there**: both entries now read
`not_a_wan_lock` with the 2026-10-27 research correction and the
2026-10-28 wiring-package correction on record. No edit was needed, so
this package does not touch `backends.json`.

## Net

Have it working: **#4, #6**. Downloaded/prepared, staging owed: **#1,
#5**. Named and licence-verified, not yet pulled: **#2, #3** (and #3 is
bypassed by design). Plus one newly recorded gap: the **RIFE flownet**.
Nothing on this list is paid, and nothing is free-but-restricted.

---
# CORRECTION NOTE — dated 2026-10-28 (avatar-stack parity round)

Appended to `PULL-IN-STATUS.md` by the parity-round PR. The original
lines stay in place above for the record; where they conflict with
this note, THIS NOTE is current.

1. **Split grading retired.** Line 16's "motion is proven, likeness
   is not" used the split grade the owner retired on 2026-10-28.
   Current wording: the Wan backend is **WIRED UNPROVEN**. A clip
   passes only when the CORRECT character performs the action;
   motion/frame-diff numbers are diagnostics, never grades. The
   Dorowani Water Orb proof (2026-10-28) graded **FAIL — reference
   never anchored** (frame 1 already the wrong character; frame-0
   gate SSIM 0.2938 vs min 0.50, RGB MAD 100.29 vs max 40).

2. **RIFE staging sentence was wrong.** The claim that `rife47.pth`
   "is staged nowhere" is corrected: **rife47.pth (21,344,827 B,
   sha256 6a8a825a…) and rife49.pth (21,345,274 B, sha256 e55fd00f…)
   are staged in the private Kaggle dataset
   `marsfmmg/mochiichao-wan22-consistency-kit` v1** (server-side
   listing verified 2026-10-28; pull-in programme ledger §C).
   Licence: MIT (open source). Sessions mount that dataset and use
   RIFE from there; no in-session flownet fetch is needed.

3. **musubi-tuner licence** is recorded inconsistently across the
   staging paperwork (Apache-2.0 in the teardown, MIT in one
   staging-table row). Re-verified at source this round (repo
   README licence section): **Apache-2.0**. The staging-table MIT
   line is the wrong one.

4. **Outcomes added by the parity round (2026-10-28, measured):**
   - Character LoRAs now EXIST: Wispkin + Dorowani trained
     (musubi-tuner) and staged in private Kaggle dataset
     `marsfmmg/mochiichao-character-loras` — but as **Wan2.1-1.3B**
     LoRAs, because musubi-tuner cannot train TI2V-5B (verified at
     source). They do not load in the 5B scene yet; see
     `lora/LORA-MANIFEST.md`.
   - The Turbo-path failure is root-caused: the wrapper's T5 loader
     rejects the staged scaled-fp8 UMT5 unconditionally, and the
     wrapper renamed its LoRA input (`lora_args`→`lora`). Fixes:
     `parity/TURBO-T5-FIX.md` + `parity/workflow-turbo-fixed.json`
     (not yet run).
   - Likeness lock: there is no IP-Adapter node for Wan; the lock
     is VACE reference control, now wired engaged in
     `parity/workflow-i2v-locked.json` (not yet run).
   - A14B tier: parity tier is 5B + lock + LoRAs; the only
     stageable A14B variant (GGUF Q4_K_M) is planned in writing in
     `parity/A14B-TIER.md`, unproven.
   - The two-character test scene COMPLETED on Kaggle but its
     outputs remain unharvested — Kaggle API 429 on three attempts
     across two rounds (09:52 / 10:07 / 10:23 UTC). Full parity
     table: `parity/PARITY-REPORT.md`.

## Corrective pass addendum — 2026-10-28

The proof failure logged in `parity/PARITY-REPORT.md` (frame-1
reference-never-anchored, SSIM 0.2938 / RGB MAD 100.29) is now fenced
by code, not by care: `parity/preflight.py` aborts runs before GPU
time on unlogged/mismatched reference hashes, disengaged VACE
reference connections, stale `lora_args` keys / unmerged LoRAs, and
scaled-fp8 T5 files fed to the wrapper loader; `parity/frame1_gate.py`
attaches a labelled frame-1 verdict packet to every output. Backend
status remains **WIRED UNPROVEN** until a gated run passes.
