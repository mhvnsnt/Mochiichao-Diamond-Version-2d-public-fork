# PIPELINE V3 — contour-fit mouths (2026-10-26)

Builds on PIPELINE-V2 (final-frame coordinates, per-frame sx/sy,
gates on the final frame) and adds contour fitting for every mouth.
Binding for the whole V2-rework queue: no mouth is final until it is
drawn with this module. Supersedes the old retrofit draw_mouth
everywhere.

## Why V3 exists (Mars, 2026-10-26 ~10:50 + 10:51 CDT)

Kittember attacks retrofit: "the little skin coloured or fur coloured
crop around the mouth kind of gets square and doesn't fit correctly."
Tiidebiite attacks: the SAME fault. Mars's order: pull in tools and
wire them up for accurate fitting so he stops having to do
fine-tuning tweaks. This is systemic, not a Kittember patch.

Measured fault (old `draw_mouth` in build_arefit.py): before drawing
any mouth it painted `patch_median` — a FLAT median-colour rectangle
(16x10 for non-jaw creatures) — under the mouth. On Kittember's dark
fur that reads as a light-grey square block; on Tiidebiite's light
blue it reads as a flat cyan square. The rectangle, not the mouth
shape, is what Mars saw. The old mouth centres were NOT the problem:
Kittember true mouth line is x20-25 at y30 (centre (22.5,30), w~6);
old (23,31) was within 1.5px. Tiidebiite true mouth line is x26-28
at y24 (centre (27,24)); old (27,24) was exact. The fault was the
block + oversize, and V3 fixes the block while keeping honest centres.

## V3 rules (binding)

1. NO RECTANGLES, NO FLAT MEDIAN PATCHES, NO SQUARE CROPS in any
   mouth overlay. Every mouth is drawn inside a feathered ELLIPTICAL
   contour mask. Teeth are small ellipses clipped by the mask, never
   white rectangles. (The old eye-lid rectangles are out of scope
   here — V3 mouths only; the V2-rework eyes-only frames already
   carry V2 eyes.)
2. CONTOUR, NOT BLOCK. The mask is an ellipse fitted to the measured
   true mouth, with radii = expression size x the frame's (sx, sy),
   centred on propagate(corrected source anchor, frame transform).
   Mask radii (source scale): open-bite (7, 6), grin (6.5, 3.5),
   grimace (6.5, 4). The drawn mouth sits INSIDE the mask, so nothing
   can spill into a block.
3. CLEAR = BLURRED BASE, NOT FLAT COLOUR. Under a new mouth, the old
   mouth line is removed by compositing the base cell's own
   Gaussian-blurred pixels (sigma 1.2 at 64px) inside the mask. The
   cleared area keeps the local fur/skin texture and gradient.
4. FEATHERED EDGE. The mask alpha is Gaussian-blurred (sigma 1.0),
   so the overlay fades into surrounding fur over ~3.5px instead of
   ending in a step. No hard boundary exists anywhere in a V3 mouth.
5. SILHOUETTE CONSTRAINT. The mask is multiplied by the base cell's
   own alpha silhouette (exact by construction). No overlay pixel
   can land off the creature.
6. GATES ON THE FINAL FRAME. Pre: mouth centre inside the silhouette.
   Post: every visibly-changed pixel (>=2 levels, so 1-level float
   rounding noise in the feather tail does not count) lies inside
   the feathered mask support dilated by 2px AND inside the
   silhouette; and the changed-pixel bbox fill ratio is < 0.85 —
   a filled rectangle would score ~1.0, so this ratio PROVES the
   patch is shaped, not a block. Fail either gate = base, never a
   guess. (Two gate fixes were measurement, not loosening: visible
   change is >=2 levels, and outputs are rounded, not truncated,
   before casting to uint8 — truncation alone flipped 1-level pixels
   across the whole feather tail.)
7. MEASURED CENTRES, NOT COPIED ANCHORS. V3 mouth centres are
   re-measured per creature from the enlarged source front cell
   (Kittember (22.5,30), Tiidebiite (27,24)) and propagated per
   frame. If a future creature's mouth line is not cleanly measurable
   (cf. Batch E pyromonk, flagged in the V2-rework notes), V3 must
   measure, not guess — flag it, do not place it.

## Tool chain (what actually runs here)

- OpenCV 5.0.0 (`atlases/_tools/.venv-opencv`): GaussianBlur for the
  feather + the blurred-base clear; connectedComponents for
  measurement. This is the pulled-in fitting tooling Mars ordered.
- Pillow 13.0.0 + numpy 2.5.4 for compositing.
- REJECTED, with reasons: GrabCut — tested on the enlarged Kittember
  impact cell, IoU 0.428 against the true alpha silhouette (dark fur
  on dark background confuses it); the cell's own alpha channel is
  already the exact silhouette, so GrabCut can only make the fit
  worse. rembg — not installed, would need a model download, and
  adds nothing over the exact alpha silhouette. scipy — not
  installed; cv2 covers the blurs.
- Pokemon files: no mouth-fitting code exists in the decomps checked
  (battle anims are sprite/particle scripts, not face fitting); the
  contour + feather method is open-source image technique, stated
  plainly, not a Pokemon copy.

## Proof (this module, tag artic-pipev3-20261026)

Builder: articulation-pipev3/build_v3.py. Module:
articulation-pipev3/mouth_fit.py. Inputs: V2-rework eyes-only attack
frames (mouths held) + batch-a transforms/durations; old retrofit
cells appear only in the before/after triplets.
- Kittember attacks + Tiidebiite attacks: 8/8 impact frames pass
  both gates (changed bboxes 15x9 to 22x13, fill ratios 0.62-0.75 —
  all < 0.85, i.e. shaped patches, not blocks; 0 px off-silhouette).
- Non-impact cells: 18/18 per creature byte-identical to the
  V2-rework eyes-only inputs — the ONLY delta is the mouth.
- Enlarged eye-check PASS on all 8 triplets (base | old | V3) + all
  8 mouth-zone zooms: every old tile shows the square block, no V3
  tile does. V3 grimaces read smaller/subtler than the old big
  grimaces — that is the contour fit (mask sized to the face), and
  its size is Mars's call, not a defect.
- GIFs: kittember-attacks-artic-pipev3-20261026.gif,
  tiidebiite-attacks-artic-pipev3-20261026.gif (22 frames each,
  pilot durations verbatim). Staged only, show-first, no PR.
- Untouched: pilots, approved hurts, Aquariios/Reaperdile V2
  attacks, Batch B, all v2-rework inputs, all old retrofit files.

## Adoption (queue-wide)

Apply mouth_fit.contour_fit_mouth to every held mouth in the
V2-rework queue (Batches C/D/E/A eyes-only frames) with
per-creature re-measured mouth centres + anatomy (teeth only where
evidenced). Do NOT re-run the old draw_mouth anywhere. A mouth that
cannot be measured cleanly is flagged, not placed.
