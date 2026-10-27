# Avatar-Stack Pipeline — the in-repo contract

The avatar stack is how Doro's avatar videos — and, by the owner's
standing order, the show's character animations — are made. This folder
wires that pipeline **into the repo**: the contract, the bundle tooling,
a real likeness gate, and a registry of the free backends that can run
the generation step.

## The honesty preamble (read first)

The reference implementation is Muse's **hosted** avatar generator.
It is a hosted service feature: there are no weights, no endpoint, and
no API that this repo can copy or call, and nothing here pretends
otherwise. What the repo owns is:

1. the **contract** — the 1–5 order below, the bundle format, the gate;
2. **free backends** that can execute step 2 (see `backends.json`);
3. the **tooling** that assembles, measures, and registers bundles.

A bundle produced by any backend is only "the avatar stack" if it
passes through all five steps, in order, with the gate packet attached.

## The 1–5 order

### 1. Canon source art
Every character starts from its actual art already in the canon — the
model sheet / canon cutout (`canon-cutouts/<species>.png`) and, for
Dorowani, the owner-chosen avatar still. **Likeness law:** characters
are always built from their real images in the repo; likenesses are
never invented from text descriptions. The generation input is the
canon still, full-body, on its white field.

### 2. I2V generation (the backend step)
The still is animated by an image-to-video backend into a **performed**
clip — real frame-level motion (head turns, steps, cries, squash and
stretch), never a slideshow pan/zoom over a still. Backends are
registered in `backends.json` with honest statuses; today exactly one
free backend has produced real motion (Kaggle Wan 2.2) and **none has
yet passed the likeness gate** — see "Measured facts" below. The
hosted Muse generator is the reference: it produced the accepted
avatar set, and its outputs enter this pipeline at step 3 like any
other backend's.

### 3. Bundle
`generate_bundle.py` assembles the bundle directory:

```
<species>/
  <species>-<variant>.mp4               the clip, byte-for-byte
  <species>-<variant>.transparent.webm  alpha twin (white-field sources)
  <species>.webp                        poster (source still, else frame 0)
  manifest.json                         measured spec + sha256 per file
  gate-packet.json                      when --run-gate is used
```

Target spec: **720×720, 8 s, 24 fps (192 frames)**. The manifest never
asserts this — it records the spec **measured by ffprobe** from the
produced file and a `conformance.meets_target` boolean. The transparent
twin is produced by `white_matte.py` **only** for white-field sources
(`--white-field`); anything else records `SKIPPED_NOT_WHITE_FIELD` and
ships no twin rather than a faked one. The reference avatar set carries
six variant names over four unique clips (idle/connecting share one;
working/waiting_for_subagents share one; making_something;
milestone_level_up).

### 4. Likeness gate
`likeness_gate.py` compares the clip's middle frame against the canon
cutout and emits a **gate packet** with three measured numbers (no
constants posing as results):

| metric | what it measures | threshold (packet config) |
|---|---|---|
| `ssim_union` | windowed SSIM, averaged over the union of the aligned silhouettes | ≥ 0.50 |
| `silhouette_iou` | IoU of the frame's non-white foreground vs the cutout's alpha silhouette, after bbox-fit alignment | ≥ 0.55 |
| `rgb_mad_255` | masked mean absolute RGB difference (0–255) inside the union silhouette | ≤ 40.0 |

The packet's verdict is a **recommendation**. Per the orchestrator law,
a gate packet never promotes anything itself (`promotion_status` is
always `PENDING_OWNER_OR_SCORER_RECORD`); promotion happens only when a
verdict is recorded in `show/shared/clip-index.json`. If a measurement
cannot be computed, the verdict is `FAIL_CANNOT_MEASURE` — never a
default pass. Every packet records the sha256 of both the clip and the
cutout it was scored against, so the reference is never ambiguous.
Packets (schema v2) also carry a `measurements_v2_normalized`
diagnostic block from the calibration-v2 normalized path — reported
alongside the v1 numbers, never (yet) the verdict; see "Calibration
v2" under Measured facts.

### 5. Ship
The bundle lands in the repo (bundle folder + registration in
`clip-index.json` with an honest `quality_status`). Only a bundle whose
gate verdict has been recorded may carry a production status. Anything
else stays `PENDING_GATE` / `PENDING_VERIFICATION`.

## Backends (summary — `backends.json` is the registry of record)

| id | kind | licence (honest bucket) | status |
|---|---|---|---|
| `muse-hosted-avatar-generator` | external reference | free proprietary — hosted Muse service, **not callable from the repo** | reference only; produced the accepted avatar set |
| `kaggle-wan22-ti2v-5b` | I2V | open source — Wan 2.2 **Apache-2.0** (Turbo LoRA repack flagged `RECHECK_BEFORE_COMMERCIAL_SHIP`) | **motion proven, likeness unproven** |
| `ltx-2.3` | I2V | free-but-restricted — LTX-2 Community License: free commercial **under $10M annual revenue**, paid agreement above | catalogued, not wired |
| `hunyuan-video-1.5` | I2V | free-but-restricted — Tencent Hunyuan Community License: **does not apply in EU/UK/South Korea**; separate agreement above 100M MAU | catalogued, not wired |
| `local-white-matte` | post (matting) | open source — project code | **wired** (the Dorowani twins) |
| `robust-video-matting` | post (matting) | open source — GPL-3.0 | evaluated, **rejected for this material** (measured) |

Licence labels follow the owner's **Licence/Pricing Honesty Law**
(`show/production/pipeline/ORCHESTRATOR.md`): classify by what the
software actually is, verified at the source — never a fake paywall on
free software, never "free" for something with a real paywall or a
restricted community licence. The Wan/LTX/Hunyuan terms above were
re-verified against their licence texts on 2026-10-27.

## Measured facts (not aspirations)

**Kaggle Wan 2.2 test 1 — Wispkin (2026-10-27).** Notebook
`mochiichao-comfyui-wan`, Kaggle T4 ×2, ComfyUI v0.43.0, Wan 2.2
TI2V-5B fp16, start image = the canon Wispkin cutout. Settings: 20
steps, uni_pc, CFG 5.5, seed 42, 480×1024 latent, 49 frames.
Generation took ≈ 28.5 minutes (~70 s/step on T4). The clip contains
**real performed motion** — and it **failed the likeness gate**: plain
I2V rendered a realistic 3D human skull with anatomical teeth instead
of the flat cartoon character (no round black body, no mask-as-mask,
no flame tip). Registered in clip-index as
`kaggle-wan-test-wispkin-00001 / rejected_likeness_fail`. Two process
facts from the same run: the delivered file came out **960×2048** —
a 2× upscale defect in the borrowed graph (the v2 notebook carries an
`audit_graph()` step to catch exactly this) — and the only lock engaged
was start-image conditioning.

**The lock stack is the unproven piece.** Installed on the Kaggle
notebook but **not yet engaged in any executed Wan graph**:
ComfyUI_IPAdapter_plus and comfyui_controlnet_aux. Test 2 is the proof
point: the same subject with IP-Adapter + ControlNet engaged, tight
framing on the character, the accelerated path (WanVideoWrapper +
Wan22 Turbo LoRA, 4 steps, CFG 1.0, torch.compile) — and a likeness
gate packet on the result. The longer-term route is a **character LoRA
trained on the owner's own canon art**; none has been trained yet, and
the registry says so.

**Likeness gate — first calibration data (2026-10-27).** The gate was
run the day it was wired; the numbers are recorded here so the
thresholds can be calibrated with evidence, not vibes:

| subject | reference | SSIM | IoU | RGB MAD | verdict |
|---|---|---|---|---|---|
| Dorowani idle (owner-chosen avatar clip), mid frame | canon cutout | 0.310 | 0.770 | 61.3 | FAIL |
| Dorowani idle, all frames sampled (0/48/96/144/191) | canon cutout | 0.29–0.32 | 0.77–0.79 | 61–65 | FAIL |
| Dorowani idle | cutout derived from the avatar still itself | 0.281 | 0.746 | 66.9 | FAIL |
| Dorowani working (via `generate_bundle.py --run-gate`) | canon cutout | 0.304 | 0.473 | 91.9 | FAIL |
| **Glossy Gabu (rejected batch)** | canon cutout | 0.357 | 0.638 | 88.9 | FAIL |
| Control: idle clip vs a cutout made from its own frame 96 | own frame | **0.9998** | **0.9999** | **0.07** | PASS |

Readings, honestly:

- **The instrument is sound** — the control scores ~1.0 across the
  board, so low scores are content, not measurement error.
- **The known-bad ranks below the owner-chosen** on IoU (0.64 vs 0.77)
  and RGB MAD (89 vs 61). SSIM alone would mislead (the glossy render's
  smooth gradients score marginally higher) — which is why the verdict
  ANDs all three.
- **Even the owner-chosen avatar clips FAIL the as-shipped
  thresholds.** The hosted generator *reframes* its source: the still
  is a full-body drawing, the clip is a zoomed upper-body performance.
  Bbox alignment cannot reconcile that framing difference, and the
  pixel metrics (SSIM, MAD) punish it. IoU — the identity-level
  metric — is the one that says "same creature" (0.75–0.79).
- **Calibration is an owner/scorer decision.** These thresholds were
  set a priori for a same-framing render check. Whether production
  gating should weight IoU over pixel metrics for generative I2V, use
  pose-matched reference frames, or score multiple frames is exactly
  the kind of call the packet system exists to support: the packet
  reports, a human (or a calibrated scorer) promotes. Nobody retunes
  the constants quietly to make a favourite clip pass.

**Calibration v2 — framing-normalized path (2026-10-27).** The v1
constants above stand as measured v1 observations — in particular the
identity-level separation the gate already achieves: real Dorowani
idle IoU **0.7702** vs the glossy reject's **0.6377**. Calibration v2
adds a second, normalized measurement path to `likeness_gate.py`
(packets now schema v2, both paths reported). Method: bbox-crop both
the clip frame and the reference using the gate's existing mask logic
(white-distance foreground for the frame, alpha for the cutout —
never a naive grayscale threshold, which on white-field material
marks the whole frame as foreground), then aspect-preserving
letterbox/pad to a common square canvas (never warped to a fixed
non-square size — aspect distortion corrupts IoU), the mask
resampled NEAREST so silhouette edges stay hard, and IoU / SSIM /
masked MAD computed with the exact v1 definitions on the normalized
pair. Measured results (mid frame; the refactored code's v1 path
reproduces the published v1 numbers exactly):

| subject | reference | path | SSIM | IoU | RGB MAD | vs shipped thresholds |
|---|---|---|---|---|---|---|
| Dorowani idle (owner-chosen) | canon cutout | v1 | 0.3099 | 0.7702 | 61.281 | FAIL |
| Dorowani idle (owner-chosen) | canon cutout | v2 | 0.3340 | 0.7679 | 61.687 | FAIL |
| Glossy Gabu (rejected batch) | canon cutout | v1 | 0.3568 | 0.6377 | 88.942 | FAIL |
| Glossy Gabu (rejected batch) | canon cutout | v2 | 0.3891 | 0.6371 | 88.988 | FAIL |
| Control: idle vs cutout from its own frame 96 | own frame | v1 | 0.9997 | 1.0000 | 0.028 | PASS |
| Control: idle vs cutout from its own frame 96 | own frame | v2 | 0.9997 | 1.0000 | 0.024 | PASS |

Readings, honestly:

- **The control survives v2** (0.9997 / 1.0000 / 0.024) — the
  normalized path did not break the instrument.
- **V2 barely moves the real set** (SSIM +0.024; IoU −0.002; MAD
  +0.4). That is itself the finding: v1's bbox alignment already
  removed scale and translation, so the letterbox normalization only
  strips second-order artefacts (canvas margin, bilinear mask
  erosion). The dominant penalty was never scale/translation — the
  reframed clip shows a *different body region* (zoomed upper body,
  different internal proportions, different pose) than the full-body
  cutout, and no bounding-box normalization can reconcile content
  that isn't in the frame. **The owner-chosen set still FAILS the
  shipped thresholds on the v2 path.** Nothing was tuned to change
  that.
- **Separation survives normalization**: IoU gap real-vs-glossy
  ≈ 0.13 (0.7679 vs 0.6371), MAD gap ≈ 27 (61.7 vs 89.0). And SSIM
  is *still inverted* on this pair (glossy 0.3891 > real 0.3340) —
  on v2 numbers as on v1, SSIM cannot discriminate these two clips
  at any threshold: whatever admits the real clip admits the glossy
  one.
- **What threshold the v2 data would support** (stated, NOT adopted —
  threshold changes are an owner/scorer decision): on the measured
  v2 points, a separating gate exists only on IoU and MAD — e.g.
  IoU ≥ 0.70 and MAD ≤ 75 both sit between the real and rejected
  measurements with margin — while SSIM would have to be dropped,
  re-weighted, or replaced (e.g. by pose-matched reference frames or
  multi-frame scoring) for a v2-based verdict to mean anything. This
  rests on n=1 per class (one owner-chosen clip, one reject), so it
  is indicative, not calibrated.
- Until that decision is recorded, **the packet verdict remains the
  v1 path** against the shipped thresholds (SSIM ≥ 0.50, IoU ≥ 0.55,
  MAD ≤ 40.0); the v2 block rides along as diagnostics, and
  `promotion_status` is unchanged.

**Option A — pose-matched references (owner decision, 2026-10-27).**
The owner chose the robust path over threshold surgery on n=1:
build references in the framing the generator actually performs, and
measure like against like. The gate now supports
`--reference-mode {full,pose-matched}` (default `full`, unchanged
behaviour). Pose-matched mode measures against
`canon-cutouts/<species>-upper.png` (same local-only home as the
full cutouts — they are not in the repo) and the packet records
`reference_mode` and the exact `reference_file` used. A missing
`-upper` file is **FAIL_CANNOT_MEASURE — never a silent fallback**
to the full cutout (re-tested after the change, exit 2, alongside
the unknown-species case). `--debug-dir DIR` additionally writes
`debug_alignment.png` into DIR (never the repo tree): aligned
reference | aligned prediction | contour overlay (reference contour
green, prediction contour red) with the v2 metrics burned in, so a
human can see exactly what the gate scored.

*The crop rule and its derivation.* The references were built by
cropping each canon cutout horizontally at **0.91 of its
alpha-silhouette bounding-box height** (keep rows
`[0, sil_y0 + round(0.91 × sil_H))`, full width, transparency
kept). The 0.91 was measured on the accepted Dorowani idle clip
three ways:

- **Silhouette registration (primary):** for each sampled frame
  (every 24th of 192), the top-f crop of the full cutout whose
  v2-normalized silhouette best matches the frame's — the IoU(f)
  curve is smooth, peaks at **f = 0.91 for every sampled frame**
  (IoU 0.884–0.913 at the peak, vs 0.768 at f = 1.00).
- **Belly landmark (cross-check):** the pale belly patch's bottom
  edge sits at 0.799 of the full silhouette height in the cutout
  and at 0.872 of the *visible* silhouette height in the performed
  frames → f = 0.799 / 0.872 = **0.916**.
- **Width profile (corroboration):** the performed silhouette's
  bottom rows run at 0.61 of its max width with no taper (cut off
  mid-body by the frame edge); the cutout's width at 0.90 of its
  height is 0.62 of max. (A fourth estimator — bounding-box aspect
  ratio — gives 0.865 and is the outlier: the redraw widened the
  body, so bbox aspect is not framing-pure. The two framing-pure
  estimators agree at ≈ 0.91, which is what was adopted.)

Anatomically, for Dorowani the 0.91 line passes through the **lower
thighs, just above the feet**: fin, head, torso, belly, shell,
arms, hands, hips and thighs are all in the performed frame; only
the feet and the lowest leg segment (the bottom ~9% of silhouette
height) fall outside it. That corrects the earlier "waist/hips"
description of the reframe — Dorowani's legs are stubby (belly
bottom at 0.80, crotch at ~0.94 of silhouette height), so the
performed crop is anatomically shallower than first described. The
zoom is real (the body is scaled up to fill the frame); the missing
content is the bottom ~9%, not the whole lower body. For **Wispkin**
— no legs; a ghost body dissolving into a smoke tail — the same
0.91 fraction trims the **lower tip of the smoke tail** (the bottom
9% of its tall silhouette); its upper reference reads as body +
mask + most of the tail. Per-species builds (silhouette height →
cut row): dorowani 398 → 362, gabu 292 → 269, kittember 297 → 274,
mochii 317 → 300, sproutle 331 → 304, wispkin 606 → 554.

*Measured results* (mid frames; full-mode rows repeat the tables
above so the comparison is side by side in one place):

| subject | reference | path | SSIM | IoU | RGB MAD | vs shipped thresholds |
|---|---|---|---|---|---|---|
| Dorowani idle (owner-chosen) | full | v1 | 0.3099 | 0.7702 | 61.281 | FAIL |
| Dorowani idle (owner-chosen) | full | v2 | 0.3340 | 0.7679 | 61.687 | FAIL |
| Dorowani idle (owner-chosen) | pose-matched | v1 | 0.3787 | 0.8862 | 44.506 | FAIL |
| Dorowani idle (owner-chosen) | pose-matched | v2 | 0.4030 | 0.8836 | 44.938 | FAIL (`pose_matched_verdict` FAIL) |
| Glossy Gabu (rejected batch) | full | v1 | 0.3568 | 0.6377 | 88.942 | FAIL |
| Glossy Gabu (rejected batch) | full | v2 | 0.3891 | 0.6371 | 88.988 | FAIL |
| Glossy Gabu (rejected batch) | pose-matched | v1 | 0.3489 | 0.6483 | 90.532 | FAIL |
| Glossy Gabu (rejected batch) | pose-matched | v2 | 0.3782 | 0.6460 | 90.798 | FAIL (`pose_matched_verdict` FAIL) |
| Control: idle vs cutout from its own frame 96 | own frame | v1 | 0.9997 | 1.0000 | 0.028 | PASS |
| Control: idle vs cutout from its own frame 96 | own frame | v2 | 0.9997 | 1.0000 | 0.024 | PASS |

Readings, honestly:

- **Pose-matching works as designed — for the accepted set.** On
  the v2 path the real clip gains IoU 0.768 → **0.884**, MAD
  61.7 → **44.9**, SSIM 0.334 → **0.403**; the glossy reject barely
  moves (IoU 0.637 → 0.646, MAD 89.0 → 90.8), because its mismatch
  was never framing. Separation widens accordingly: IoU gap
  0.131 → **0.238**, MAD gap 27.3 → **45.9**.
- **The SSIM inversion is gone** under pose-matched references —
  on both paths the real clip now out-scores the reject (v1:
  0.3787 vs 0.3489; v2: 0.4030 vs 0.3782). But the margin is thin
  (0.025–0.030) and both clips still sit below the 0.50 threshold,
  so SSIM is rehabilitated in *ordering*, not yet in *authority*.
- **The owner-chosen set still FAILS the shipped thresholds**
  under pose-matched references (`pose_matched_verdict` FAIL):
  SSIM 0.403 < 0.50 and MAD 44.9 > 40.0, with IoU passing easily.
  Nothing was retuned to change that. What remains after framing
  is removed is pose and redraw: the debug alignment for the idle
  case (kept locally at
  `~/workspace/mochiichao-show/gate-debug/debug_alignment.png`)
  shows the contours tracking closely while the arms pose and the
  internal proportions differ — content a reference crop cannot
  and should not absorb.
- **What threshold the pose-matched data would support**
  (PROPOSED, **not adopted** — owner/scorer ratification required):
  on the v2 pose-matched points a separating set exists — e.g.
  IoU ≥ 0.75 (real 0.884 / reject 0.646) and MAD ≤ 65 (44.9 /
  90.8) both sit between the classes with real margin. SSIM would
  need ≈ ≥ 0.39 to separate, a margin of only ~0.025 over the
  reject — inside redraw noise at this sample size — so the
  defensible proposal is a pose-matched gate on **IoU + MAD**,
  with SSIM reported but not gating until more samples exist.
  This still rests on n = 1 per class (one owner-chosen clip, one
  reject): indicative, not calibrated. Until a decision is
  recorded, the shipped thresholds stand, the packet verdict
  remains the v1 path, and `pose_matched_verdict` is reported as a
  recommendation against the shipped thresholds only.
- `generate_bundle.py` compatibility was re-verified end-to-end
  after the change (default full mode: packet attached, verdict
  read, `quality_status` stays PENDING_GATE).

```bash
# gate a clip against its pose-matched reference, with a visual debug frame
python3 likeness_gate.py \
  --clip <clip>.mp4 --species dorowani \
  --reference-mode pose-matched \
  --debug-dir ~/workspace/mochiichao-show/gate-debug \
  --out gate-packet-dorowani.json
```

## Files in this folder

| file | role |
|---|---|
| `AVATAR-STACK-PIPELINE.md` | this spec |
| `backends.json` | machine-readable backend registry (status + honest licence per backend) |
| `generate_bundle.py` | step 3: clip → bundle + measured manifest (+ optional gate run) |
| `likeness_gate.py` | step 4: measured gate packet vs the canon cutout (full or pose-matched reference; optional debug alignment export) |
| `white_matte.py` | the white-field matting tool (twins); wired since PR #341 |

## Worked example

```bash
# bundle an existing clip (provenance: the hosted reference backend),
# produce its white-field twin, and attach a gate packet
python3 generate_bundle.py \
  --source-clip ~/workspace/avatars/<working-clip>.mp4 \
  --species dorowani --variant working \
  --backend muse-hosted-avatar-generator \
  --source-still ~/workspace/avatars/<avatar-still>.webp \
  --white-field --run-gate --out-dir /tmp/bundle-test

# gate any clip on its own
python3 likeness_gate.py \
  --clip <clip>.mp4 --species wispkin \
  --out gate-packet-wispkin.json
```

## HUMAN DIALOGUE & LIP-SYNC SEAT (owner correction, 2026-10-27)

The voice law scopes to CREATURES (pure cries and sounds only).
The HUMAN cast - Mochiko, Hex, Aeon - speaks words, and talking
is a real production seat. An earlier adjudication wrongly
dismissed lip-sync tooling wholesale by misapplying the
creature law to the whole cast; the owner corrected that
2026-10-27 and this section is the correction on record.

WIRED PATH (2D, installed today): Chatterbox renders the human
voice (prosody design sheets) -> Rhubarb Lip Sync 1.13.0
(installed, ~/opt/tools) extracts phoneme/viseme timings from
the rendered line -> Preston Blair mouth charts (donor
animation playbook) drive mouth shapes in Tahoma2D / Blender.

GENERATIVE CANDIDATES (catalogued in backends.json, NOT wired,
NOT measured on this show's stylized 2D humans): MuseTalk
(audio-driven lip-sync, MIT code) and LivePortrait
(expression/pose driving, MIT code but InsightFace dependency
is non-commercial-research - flagged, never hidden).
First engagement test: when the first human line is rendered,
run Rhubarb on it and a MuseTalk comparison pass on Kaggle;
measure, then decide the seat. Creatures are never lip-sync
targets.
