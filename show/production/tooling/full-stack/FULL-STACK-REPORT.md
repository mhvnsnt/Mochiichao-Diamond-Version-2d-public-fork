# FULL-STACK REPORT — one-pass wiring of the character-consistency stack

Date: 2026-10-28. Order: Jamar — pull free full-stack public
solutions for the video problem, wire them 100% in one pass, as
fast as possible without losing quality; the problem is generated
animation where the character is CORRECT.

## What was pulled in (all free, licences verified at source)

| Component | Source | Licence | Role in the stack |
|---|---|---|---|
| ComfyUI core | github.com/comfyanonymous/ComfyUI | GPL-3.0 (LICENSE read at source this pass) | Runtime + the native Wan/VACE nodes (`WanVaceToVideo`) |
| ComfyUI-VideoHelperSuite | github.com/Kosinkadink/ComfyUI-VideoHelperSuite | GPL-3.0 (LICENSE read at source this pass) | Video load/combine nodes the graph uses |
| VACE graph (sparse-keyframe first/last-frame) | The show's own kit (`kaggle-kit/avatar-stack/wan21_vace_first_last_frame.json`), a native-node graph built on ComfyUI's VACE pattern | project-owned; pattern from VACE community docs | The workflow — adopted wholesale, placeholders resolved by a patcher script |
| Sparse-keyframe control builder | Same kit (`build_sparse_flf_control.py`) | project-owned | Builds control+mask videos from two canon anchor frames |
| Wan 2.1 VACE-1.3B | Comfy-Org/Wan_2.1_ComfyUI_Repackaged via staged Kaggle dataset | Apache-2.0 (card, verified 2026-10-27) | The conditioning model: reference image + control video + first/last anchors |
| Wan 2.1 VAE + UMT5-XXL fp8 encoder | same repack / staged dataset | Apache-2.0 | VACE's VAE + text encoder |
| kijai ComfyUI-WanVideoWrapper | github.com/kijai/ComfyUI-WanVideoWrapper | Apache-2.0 (LICENSE read in the local clone this pass) | Reference cross-check: its `wanvideo_1_3B_VACE_examples_03.json` confirms the same VACE pattern at 1.3B. NOT the runtime graph — see wiring decision below |

Surveyed and deliberately not wired in this pass (documented in
`kaggle-kit/avatar-stack/KAGGLE-KIT.md`, licences verified there
2026-10-27): VACE-14B, Phantom, Wan-Animate-14B, S2V-14B,
FLF2V-14B — all Apache-2.0, all 14B-class = T4-marginal, none of
their weights staged. Wan-Animate is the obvious next eval if a
performance-driven route is wanted at full size; it is a second
pass, not a silent swap.

**Wiring decision (native graph over wrapper graph):** the staged
VACE weight is the Comfy-Org *native-format full model*
(`wan2.1_vace_1.3B_fp16.safetensors`). The kijai wrapper's VACE
graph instead loads a split pair (T2V-1.3B base + separate VACE
module file) that is **not staged** — wiring it would have meant
new multi-GB downloads and a fast-moving node API (the exact API
that broke the parallel lane's runs 1–2 with renamed inputs).
The native graph runs on the staged bytes as-is. Zero weight
downloads happened in this pass.

## Wiring map

```
canon cutout (dorowani.png, hash-logged)
  └─ reference_image ──────────────┐
avatar bundle clip (making_something = canon Water Orb performance)
  └─ frame 150 ─► last.png ────────┤  anchors
backend lane start.png ────────────┤  (first/last)
                                   ▼
        build_sparse_flf_control.py ─► flf_control.mp4 + flf_mask.mp4
                                   ▼
Kaggle kernel marsfmmg/mochiichao-vace-flf (T4, headless):
  clones ComfyUI + VHS → symlinks staged models → stages inputs
  → AUDIT (graph size == control size; VACE file size == manifest)
  → ComfyUI server → POST /prompt (patched workflow.json)
  → poll /history → clip + gate frames (0/24/48) to kernel output
                                   ▼
        gate: frame-1 check vs start.png, then whole-clip verdict
```

Everything the graph names exists in the run: UNETLoader file =
the staged VACE file (size-asserted in-kernel against the staging
manifest), CLIP/VAE loaders = staged files, both VHS loaders =
files in ComfyUI/input, LoadImage = the canon cutout. No
"installed but not engaged" parts: the conditioning inputs
(control video, mask, reference image, first/last anchors) are
the graph's required inputs, and the audit cell fails the run
before queueing if any size disagrees.

## The speed method (researched, then applied)

Researched from how these stacks are actually shipped and from
this workspace's own failure record; applied in this pass:

1. **Adopt workflow JSONs wholesale; patch, never hand-build.**
   Graphs are data. A small patcher script resolves loader
   names/prompts/sizes in a community-or-kit graph. Hand-building
   node graphs is where the parallel lane lost two consecutive
   runs to node-schema drift — the most expensive failure mode in
   this stack, and it is a *process* failure, not a model failure.
2. **Verify schemas against source before queueing.** The wrapper
   repo was cloned locally and its 1.3B VACE example read node by
   node before the native graph was trusted.
3. **Pre-stage weights once, attach forever.** The ~62 GB staged
   Kaggle datasets mean a session starts with every weight
   present; in-session weight downloads are the single biggest
   time sink in Kaggle video work and this pass had zero.
4. **Headless API runner, not UI clicking.** Clone → symlink →
   server → `/prompt` → `/history` poll → outputs + gate frames
   extracted in-session. One push runs the whole pipeline.
5. **Audit in-kernel, before the expensive step.** Assert graph
   dimensions equal the control video's real dimensions and the
   model file's byte size equals the manifest — the test-1 2×
   upscale defect and silent wrong-file loads both die here,
   in seconds, not after a 30-minute generation.
6. **Parallel prep.** Anchors, control/mask videos, hashes, the
   run record and this report's skeleton were all built locally
   while the kernel executed.
7. **One variable per iteration.** Any retry changes a single
   named thing (blank value, strength, prompt) with the change
   written into the run record before the run.

## Gate results

- **Attempt 1 (kernel `marsfmmg/mochiichao-vace-flf` v1): NOT
  GRADED.** The pass was wired completely and the kernel ran to
  Kaggle-COMPLETE status with the audited graph and hash-logged
  inputs. Retrieval of the session output was then blocked by
  Kaggle API rate limiting (429 on the output-listing endpoint;
  the session log that did download is 0 bytes), and a 429 is a
  hard stop — no retries, no workarounds. Without the frames,
  neither the frame-1 check nor the whole-clip verdict can be
  applied, and this report does not guess either way. The
  retrieval command and the exact gate procedure are recorded in
  `run-records/RUN-RECORD.md` for the follow-up run.
- Everything up to the blocked step is verifiable locally: the
  patched graph (`full-stack/job/workflow.json`), the control and
  mask videos, the anchor frames, and every input hash
  (`run-records/INPUT-HASHES.txt`).
- **CORRECTION (2026-10-28, later the same day):** attempt 1's
  kernel status, re-checked directly, now reads **ERROR**, not
  COMPLETE — the sentence above ("ran to Kaggle-COMPLETE
  status") is **withdrawn** for attempt 1. Its session ended in
  error; whether it produced any output is doubtful as well as
  unknown. Attempt 1's verdict remains NOT GRADED; if its
  output listing eventually comes back empty, the honest final
  entry for attempt 1 is "session errored, nothing retrievable."
  Attempt 2's COMPLETE status was re-verified in the same check
  and stands. Full correction block: `run-records/RUN-RECORD.md`.
- **Attempt 2 (kernel `marsfmmg/mochiichao-vace-fullctl`): NOT
  GRADED, same blocker.** One variable changed — full performed
  control (Dorowani's real Water Orb performance as the control
  video, mask all-white) instead of sparse anchors. The kernel
  ran to COMPLETE; the 429 on the output endpoint persisted
  (one paced retry after completion, still limited), so its
  frames are stranded the same way. The graded generation
  evidence for this cycle therefore remains the baseline lane's:
  plain single-frame I2V, **FAIL** (reference never anchored,
  2-for-2 with Wispkin test-1). The VACE route is wired, run,
  and ungraded — retrieval is a single command away and is
  recorded in the run record.
- The owner's nine-repo target list is verified, staged, and
  graded in the companion document
  (`full-stack/TARGET-WIRING-REPORT.md`): flow WIRED-PARTIAL
  (MIT orchestration staged; GPU-backend adapter + a T4 model
  profile are the named missing wires; paid seats flagged),
  comfyui-wan-video-pipeline NOT WIRED (no licence; function
  already covered), Wan2.2 suite WIRED-PARTIAL (official code
  staged; S2V/Animate weights not staged, T4-marginal),
  LightX2V + synctoon staged with roles named, MuseTalk
  WIRED-PARTIAL (code + seat confirmed; weights not staged),
  AIComicBuilder + cartoon-story-generator NOT WIRED (paid-API
  generation seats / unlicensed — flagged in writing), and the
  topics sweep reported with one find (aid-studio) held for a
  future verification pass.

## Honest gaps

- VACE-1.3B is a Wan **2.1**, 480p-class model. Even a pass here
  proves the *conditioning workflow* at eval size; the 5B/14B
  production-quality conditioning eval is a later pass.
- The sparse-keyframe blank value (neutral gray) is a documented
  community convention, unproven on this material until this run.
- No per-character LoRA exists yet (image-LoRA training is the
  documented T4-feasible path; it is a separate job, not part of
  this pass, and nothing here claims it).
- Operational gap found by this pass: Kaggle's kernel-output
  endpoint rate-limits after heavy session use, and the session
  log can arrive empty — a completed run's evidence can be
  stranded server-side. Future kernels should also write their
  gate frames + clip to a versioned output dataset from inside
  the session, so retrieval never depends on the output endpoint
  alone.
