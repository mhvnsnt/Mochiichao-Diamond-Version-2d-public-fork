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

**Pose-matched cropped references — RETIRED (owner decision,
2026-10-27).** History, kept for the record only: an experiment
("Option A") built cropped references
(`canon-cutouts/<species>-upper.png`, each canon cutout cut at
0.91 of its silhouette height — the measured performed-framing
line of the hosted generator) and measured clips against them
instead of the full-body cutouts. Pose-matched readings (v2 path,
mid frame): real Dorowani idle IoU **0.884** / MAD **44.9** /
SSIM 0.403; glossy Gabu reject IoU **0.646** / MAD **90.8** —
wider separation than the full-body path, and still FAIL against
the shipped thresholds. A threshold set proposed on those points
(IoU ≥ 0.75 + MAD ≤ 65, SSIM reported-only) was **NOT adopted —
the proposal dies with the references**. The owner retired the
experiment the same day: the crop sliced the bottom ~9% — the
feet — off a perfect full-body cutout, and a feet-chopped
reference is not usable for production. The `-upper` files are
deleted, the gate's pose-matched mode is removed, and the
full-body canon cutouts are the sole ground truth. The gate
remains an honest measuring instrument at the shipped thresholds
(SSIM ≥ 0.50, IoU ≥ 0.55, MAD ≤ 40.0); promotion is the human
scorer's call.

```bash
# gate a clip against its full-body canon reference, with a visual debug frame
python3 likeness_gate.py \
  --clip <clip>.mp4 --species dorowani \
  --debug-dir ~/workspace/mochiichao-show/gate-debug \
  --out gate-packet-dorowani.json
```

## Files in this folder

| file | role |
|---|---|
| `AVATAR-STACK-PIPELINE.md` | this spec |
| `backends.json` | machine-readable backend registry (status + honest licence per backend) |
| `generate_bundle.py` | step 3: clip → bundle + measured manifest (+ optional gate run) |
| `likeness_gate.py` | step 4: measured gate packet vs the full-body canon cutout (optional debug alignment export) |
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
