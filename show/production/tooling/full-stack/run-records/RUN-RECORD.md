# Run record — full-stack VACE FLF proof (kernel marsfmmg/mochiichao-vace-flf)

## Stack wired in this pass (one-pass, wholesale adoption)

- ComfyUI core (GPL-3.0) + ComfyUI-VideoHelperSuite (GPL-3.0) — cloned fresh in-session.
- Graph: the kit's native VACE first/last-frame template
  (`kaggle-kit/avatar-stack/wan21_vace_first_last_frame.json`) with ONLY
  these deltas: model filename resolved, prompts written for the action,
  input filenames, 480×768 / 49 frames. Sampler settings are the kit's
  eval settings untouched (uni_pc, 30 steps, cfg 5.0, seed 42,
  ModelSamplingSD3 shift 8.0, VACE strength 1.0).
- Models (staged Kaggle dataset `marsfmmg/mochiichao-wan22-consistency-kit`,
  byte-verified server-side 2026-10-28): `wan2.1_vace_1.3B_fp16.safetensors`
  (4,309,519,800 B, Apache-2.0), `wan_2.1_vae.safetensors` (Apache-2.0),
  `umt5_xxl_fp8_e4m3fn_scaled.safetensors` (Apache-2.0). Zero weight
  downloads in-session.
- Reference cross-checked at source in this pass: kijai
  ComfyUI-WanVideoWrapper (Apache-2.0) example
  `wanvideo_1_3B_VACE_examples_03.json` — confirms the VACE pattern
  (start/end frame + reference image + control) at 1.3B size; the native
  graph was chosen because the staged VACE file is the Comfy-Org
  native-format full model, while the wrapper graph needs its split
  base+VACE-module files (not staged).

## Exact inputs fed (owner requirement: log the exact input + hash)

Job dataset `marsfmmg/mochiichao-vace-flf-job` (created 2026-10-28):

| file | sha256 |
|---|---|
| workflow.json (patched graph) | `aa8a1178df748d1b4a7510f695d387524a08cb1f5278f8529665835400d963b6` |
| flf_control.mp4 (first frame, 47 gray frames, last frame; 480×768, 49f @16fps) | `071802a8ad8903531bafc3b034372f59a6d2cb929440598a90977d130dd9419e` |
| flf_mask.mp4 (black on keyframes, white on the span) | `63cae46f677e9a1e05aa53194258901cd85677f8695a624d5785fd307c02e469` |
| dorowani_cutout.png (reference image; = canon cutout) | `a255fbb00af9c0eda45fb28aee1251302968d88f4b89f19f84b173f93b536cbf` |

Anchors inside the control video:
- FIRST frame: `animation-backend/job/start.png` — Dorowani canon cutout
  prepped on white, 480×768. sha256
  `aa124c9adc8caacd22628d06f4d1373e16e02e41bfb650028c014a58af0c5720`
  (same file + hash as the backend lane's logged proof input).
- LAST frame: `full-stack/frames_in/last.png` — frame 150 of the shipped
  avatar bundle clip `bundles/dorowani/dorowani-making_something.mp4`
  (owner-canon: that avatar animation IS the Water Orb performance):
  Dorowani holding the formed orb in his right hand, left hand at his
  chest. Cropped to content, fitted into the same 446×675 anchor box,
  feet on start.png's baseline. sha256
  `3dacbf77bc2474e4f28f0da0329fcd07103b7575ec56ba1c92c31ea946857f4a`.
  Prompt text was aligned to THIS anchor (orb in right hand), not the
  earlier two-hands wording.

## Gates (owner-ruled)

1. FRAME-1 CHECK before any later frame is judged: output frame 1 vs the
   fed first frame (start.png). Wrong frame 1 = "reference never
   anchored" FAIL.
2. WHOLE-CLIP: passes only if the correct, recognisable Dorowani
   performs the Water Orb action across the frames. Wrong character =
   FAIL. Motion numbers are diagnostics, never a grade.

## Attempts

- Attempt 1 — kernel v1, pushed 2026-10-28 (~06:40 UTC), attached to
  both staged datasets, GPU on. Kaggle reported the kernel
  **COMPLETE** (status check, ~06:44 UTC).
  **Retrieval blocked — named hard blocker:** downloading the session
  output hit Kaggle API rate limiting (`429 Client Error: Too Many
  Requests` on `ListKernelSessionOutput`) after one full-tree download
  attempt also died on a file-permission error. The one file that did
  come down, the session log, is **0 bytes**. Per the standing rule a
  429 is a hard stop for the provider: no retries were made.
  Consequence, stated plainly: the kernel's internal outcome is
  **unknown** — Kaggle's COMPLETE means the session ended, not that
  every cell succeeded (my collect cell asserts an mp4 exists; if it
  raised, the session still ends). The clip and gate frames, if
  produced, sit in the session output awaiting retrieval.
  **Gate verdict: NOT GRADED** — neither pass nor fail. The frame-1
  check and whole-clip judgement require the actual frames, and no
  claim is made without them.
  Retrieval command for the follow-up run (once the rate limit
  clears): `kaggle kernels output marsfmmg/mochiichao-vace-flf -p
  ~/workspace/ep01-rebuild/proof/full-stack-v1 --file-pattern "out/.*"`
  then extract frames and apply both gates against
  `animation-backend/job/start.png` (sha256 `aa124c9a…`).

  **CORRECTION (2026-10-28, later the same day — supersedes the
  "COMPLETE" line above):** a direct re-check of the kernel
  status now reads **ERROR** (`KernelWorkerStatus.ERROR`), not
  COMPLETE. The ~06:44 UTC COMPLETE read stands in the record as
  what was observed then; the current authoritative read is
  ERROR, and which run/version each read caught cannot be
  reconstructed from here. Consequences: attempt 1's session
  ended in error, so whether it produced any output at all is
  doubtful as well as unknown — if the eventual output listing
  comes back empty, attempt 1 left nothing retrievable. The
  gate verdict is unchanged (**NOT GRADED**), and the claim
  "the kernel ran to COMPLETE" is **withdrawn**. Attempt 2's
  COMPLETE status was re-verified in the same check and stands.

- Attempt 2 — kernel `marsfmmg/mochiichao-vace-fullctl` (script
  kernel, source in `full-stack/kernel2/`). ONE variable changed
  from attempt 1: the control. Instead of two anchors + gray span,
  the control is Dorowani's actual performed Water Orb clip (49
  frames sampled from frames 24–168 of the shipped avatar bundle
  clip, fetched from the repo in-session), mask all-white
  (generate everywhere, following the control), reference = canon
  cutout, anchors printed + hash-logged in-kernel (RUN-LOG.txt in
  the session output). The kernel is self-sufficient (fetches its
  canon inputs from the repo; no job dataset), because this VM's
  filesystem spent the pass intermittently refusing writes
  (overlay EPERM storms, correlated with service restarts).
  Kaggle reported the kernel **COMPLETE**. Retrieval: **blocked
  by the same 429** on `ListKernelSessionOutput` (retried once,
  paced, after completion — still 429; hard stop observed).
  **Gate verdict: NOT GRADED** — same reasoning as attempt 1.
  Retrieval: `kaggle kernels output marsfmmg/mochiichao-vace-fullctl
  -p ~/workspace/ep01-rebuild/proof/full-stack-v2 --file-pattern
  "out/.*"`; the output folder carries the clip, gate frames
  (f000/f024/f048), BOTH anchors, the start frame, the patched
  workflow, and RUN-LOG.txt with every input hash — the whole
  gate can be applied from that one download.

## Environment notes (this pass, for the record)

- The VM's overlay filesystem intermittently returned EPERM on
  ordinary writes (exec-spawned processes; tool-layer writes kept
  working), and codeload tarballs arrived as 0-byte bodies through
  the egress proxy. Repo staging therefore went through the
  authenticated GitHub API + raw fetches (`stage_repos.py`), with
  per-file write verification and pinned commit manifests.
- Kaggle's `ListKernelSessionOutput` rate limit (429) persisted
  across the whole pass on this account (shared with the baseline
  lane, which hit the same wall). Both VACE kernels are COMPLETE
  server-side; their evidence awaits one unblocked retrieval.
  [Corrected above: attempt 1's kernel status now reads ERROR;
  only attempt 2 stands as COMPLETE.]
