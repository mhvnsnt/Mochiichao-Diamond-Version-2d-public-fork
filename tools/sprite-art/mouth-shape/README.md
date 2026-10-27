# Mouth-shape tool — Razorgater take-6, generalized

Mars, 2026-10-26 ~15:29 CDT: take-6 APPROVED PERFECT. Razorgater's mouth
shape is an upside-down triangle (wide top, point at chin), NOT ellipse /
circle. Take-6 is the LOCKED MAIN Razorgater attacks version (version-lock
rule, Mars 2026-10-26 ~15:31 CDT); take-5 and earlier takes are DO NOT USE
for Razorgater attacks — see mouth-shape-registry.json.

## Files in this PR (additions only, 0 deletions)
- `mouth_shape.py` — per-creature mouth-shape detection. Measures the
  detected jaw (take-5 sensor, OpenCV) + dark-cavity row profile and
  proposes a shape ONLY under strict rules; otherwise "unknown". Also
  `classify_mask()` checks a drawn mask's own shape (triangle mask ->
  triangle, ellipse mask -> ellipse, verified 2026-10-26).
- `mouth_fit_wide5.py` — take-5 sensor + ellipse draw (reused, unchanged).
- `mouth_fit_wide6.py` — take-6 triangle mask + triangle jaw draw.
- `build_razorgater_wide6.py` — take-6 builder (venv python; cv2 lives
  in `sprite-art/atlases/_tools/.venv-opencv`, not system python).
- `razorgater/` — take-6 cells (22, transparent), take-6 GIF,
  side-by-side take-5 vs take-6 GIF, mouth zooms, manifest
  (shape=triangle, 4/4 impact frames gate_ok), verification note.
- `shape-detection-log.json` — measured proposals on v2-rework batch-a
  impact cells: Razorgater triangle (high); Tyrage, Sproutle, Kittember,
  Tiidebiite unknown. No other creature's shape is locked by this PR.
- `mouth-shape-registry.json` — current vs superseded registry (above).

## GPU note
This is OpenCV CPU work on 64x64 cells; a GPU genuinely cannot help
this step. GPU-able work goes to Kaggle GPU first per docs/gpu-workflow.md
(PR #204); no Kaggle run is used or needed here, no Blender install.

## What this PR does NOT do
No Batch B, no other creature's art touched, no deletions, no take-4/5
shipped as Razorgater attacks, no file Mars has seen overwritten.
