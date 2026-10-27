# Mythar leg-tool v6 — notes (staged only, show-first)

## What Mars ordered (2026-10-26 ~18:19 CDT)

Get the lane to 100% and call it done by finding the BEST open-source
detect-and-fill tool BETTER than this lane's custom connected-components +
neighbour-mean diffusion, pulling it in, and using it on the Mythar leg issue
IN THE CORRECT AREAS ONLY. The 18:11 deferral ("fix it later, v5 fill too
small") is lifted by this order. The v4 lesson is binding: legs ONLY, never
the wing gaps or light-ring circle gaps. Base = white-removed v3 (v4
discarded, never a base). "Call it done" = the lane is called done once v6
is confirmed by Mars and shipped — NOT shipped sight-unseen.

## Why the legs read faint (measured, not guessed)

Leg shapes, binding for this task, located from the shipped image:
LEFT leg bbox x149–178, y280–349; RIGHT leg bbox x247–278, y290–349
(legs beneath the body; central tail x~185–245, gold ring/V, wing fragments
explicitly NOT legs). Inside those shapes the shipped file itself is mostly
semi-transparent (LEFT 82% partial alpha, RIGHT 80%), so the legs render
faint/drained. v3 removed NOTHING inside the separated leg shapes (0 px);
all 1,871 v3 removals sit at y207–253 (flank/wing/ring gaps). v5 solidified
the legs to full opacity keeping each pixel's own RGB; Mars judged that
fill too small.

## Tool comparison — measured on the actual leg masks (CPU, 434x350)

Mask for every candidate: leg-shape pixels with v3 alpha<255 + enclosed
holes inside the leg boxes (FULL mask: LEFT 1,232 px, RIGHT 1,081 px,
holes 12/15). Every candidate then solidifies all leg-shape pixels to
alpha 255, so candidates differ ONLY in the masked pixels' RGB. Metrics
are leg-shape means (v5 baseline: lum 166.5/169.9, texture std 77.0/77.6,
saturation 0.093/0.102).

| Tool | Licence / stack | Leg lum L/R | Texture std L/R | Sat L/R | Verdict |
|---|---|---|---|---|---|
| OpenCV Telea r3/r5 (fast marching) | Apache-2.0, cv2 5.0.0 (in venv) | 189–194 / 192–197 | 37–41 / 37–41 | 0.046–0.049 / 0.043–0.054 | REJECTED: smooth pale fill; erases the legs' own dark outline strokes (they are partial-alpha, so they fall inside the weak mask); legs read washed out |
| OpenCV NS r3/r5 (Navier-Stokes) | Apache-2.0, cv2 5.0.0 | 186–192 / 191–196 | 41–43 / 41–42 | 0.050–0.052 / 0.046–0.056 | REJECTED: same failure, slightly smoother than Telea |
| scikit-image inpaint_biharmonic | BSD-3, pip-installed into rembg venv | 172.2 / 180.3 | 46.6 / 46.4 | 0.053 / 0.053 | REJECTED: closest classical result, but still erases strokes and pales the legs |
| OpenCV distance-transform nearest-strong-pixel fill | Apache-2.0, cv2 5.0.0 | 147.7 / 155.1 | 33.9 / 38.2 | 0.051 / 0.044 | REJECTED: darker, but faceted Voronoi bands; fine lines partly lost |
| LaMa / Lama Cleaner (IOPaint) | Apache-2.0, ~208 MB weights | not run | not run | not run | REJECTED on evidence, not familiarity: large-mask specialist, generative (hallucination risk for a character's anatomy), 200 MB+ torch stack, GPU-preferred; overkill for 2,313 masked pixels and riskier than a 28 MB mobile model on the no-invented-anatomy rule |
| **MI-GAN ONNX pipeline — WINNER** | MIT, Picsart AI Research ICCV 2023, 28 MB ONNX, CPU via onnxruntime 1.31.0 (already in rembg venv) | **167.7 / 177.0** | **66.6 / 59.3** | **0.058 / 0.058** | **WINNER: luminance closest to v5, texture std closest to v5, and — decisively on the visual comparison — it RECONSTRUCTS the legs' dark outline strokes inside the mask instead of smoothing them away, so the legs read FULL and SOLID with anatomy intact** |

Why MI-GAN wins here is specific to this job, not a general claim that
learned inpainting always beats classical: the legs' defining detail is
thin dark strokes that are themselves partial-alpha, so any mask-based
classical fill that treats "weak = unknown" destroys exactly the detail
that makes legs read as legs. MI-GAN, given the same mask, regenerates
stroke-continuing texture from the surrounding leg context. Honest limit:
MI-GAN is generative (Places2-trained); the safeguard is strict
compositing — ONLY masked leg pixels take MI-GAN RGB, everything else is
v3 byte-for-byte, and the silhouette is exactly the shipped leg shapes,
so no hallucinated anatomy can leak anywhere. If Mars's eye says any
stroke looks invented rather than continued, that spot is named and fixed;
nothing here claims the model "knows" Mythar.

## Pull-in record (open-source only)

- Winner: MI-GAN ONNX pipeline, file `migan_pipeline_v2.onnx`
  (28,079,181 bytes), vendored into `work/` (staged only, NOT shipped to
  the repo). Source: Hugging Face `andraniksargsyan/migan`
  (`migan_pipeline_v2.onnx`), the pre-converted pipeline from the official
  MI-GAN repository (Picsart AI Research, ICCV 2023 paper, MIT licence
  per the repository's open-source release). Input convention per the
  official README: uint8 RGB image (NCHW) + uint8 grayscale mask (NCHW,
  255 = known, 0 = masked); the pipeline crops around the mask, resizes to
  512, runs, resizes back and blends — our compositing then restricts the
  result strictly to the leg mask (see below).
- Runtime: onnxruntime 1.31.0, already in `rembg-venv` (no new install
  needed). CPU-only: MI-GAN runs on CPU here in ~8 s; a GPU genuinely
  cannot help this step beyond speed, and no Kaggle run was needed.
- Classical contenders needed no pull-in: OpenCV 5.0.0 already in
  `rembg-venv`; scikit-image was pip-installed into `rembg-venv` for the
  biharmonic test (BSD-3).
- Build script (vendored, dated): `mythar-leg-tool-v6-20261026.py`
  (runs MI-GAN, composites, verifies guardrails, writes JSON).
  Show-sheet script: `mythar-leg-tool-v6-show-20261026.py`.

## v6 result (verified on reload, not just from the build log)

- Per leg: LEFT shape 1,491 px, masked fill 1,232 px (incl. 12 holes),
  lum 167.7, std 66.6, sat 0.058, sampled shipped-leg median RGB
  (204.0, 193.0, 191.0); RIGHT shape 1,334 px, masked fill 1,081 px
  (incl. 15 holes), lum 177.0, std 59.3, sat 0.058, sampled median RGB
  (202.0, 201.0, 203.0). Sampled colours are the legs' own pale
  lavender-grey, not an invented hue.
- Total changed vs v3: 2,313 px — ALL inside the two leg boxes
  (2,286 inside leg shapes + 27 enclosed paw holes inside the boxes).
- Changed outside the leg boxes: 0.
- Wing/flank/ring removed set (1,871 px) changed: 0 — wing gaps and
  light-ring circle gaps are pixel-identical to v3 and STAY OPEN.
- Everything else byte-identical to v3. No silhouette expansion beyond
  the leg shapes (v6 silhouette inside the boxes = shipped leg shapes).
- v6 opaque (alpha==255) whole-image count: 70,554 vs v3 68,241
  (delta exactly +2,313, the leg change).

## Deliverables (all new dated files, v3/v4/v5 untouched)

- `work/mythar-leg-tool-v6-20261026.png` — 434x350 RGBA, the v6 cutout
- `work/show-100/mythar-leg-tool-v6-show-20261026.png` — v3 vs v6 on
  black AND dark ground (24,32,48), full figure + 4x leg zooms + gap
  proof crops (wing/ring gaps identical)
- `work/mythar-leg-tool-v6-20261026.json` — per-leg counts + guardrails
- `work/mythar-leg-tool-v6-20261026.py` — build script (MI-GAN + composite + verify)
- `work/mythar-leg-tool-v6-show-20261026.py` — show-sheet script
- `work/migan_pipeline_v2.onnx` — vendored MI-GAN pipeline (28 MB)

## Status

Staged only, show-first. Ship + old-file deletion happen ONLY after Mars
confirms v6 in words. If confirmed and shipped, v6 becomes the new locked
Mythar cutout and the lane is called done on this item (per Mars's
18:19 CDT order); v3/v4/v5 remain staged records, never overwritten.
