# RAZORGATER TRIANGLE-JAW REBUILD TAKE 6 — VERIFICATION (artic-pipev3w6-20261026)

Mars on take-4 vs take-5 (2026-10-26 ~15:22 CDT): the two look almost
the same; the real fault is SHAPE — take-5 gives a CIRCULAR mouth,
Razorgater's mouth is kind of an UPSIDE-DOWN TRIANGLE (wide top,
point at the chin). Teeth and everything else look good; only the
mouth shape is wrong. Fallback, Mars's own words: if the triangle
cannot be done right, KEEP take-5. Take-5 untouched. No PR. No
judgment made here — Mars judges take-6 vs take-5.

## Why take-5 read as a circle (measured, not assumed)
Take-5's contour_fit_mouth clips its overlay to a feathered ELLIPSE
mask, so any mouth drawn inside it still reads as an ellipse at the
boundary. Take-6 therefore replaces the MASK itself with a feathered
TRIANGLE mask; the drawing alone could not fix the shape.

## Take-6 construction (wired into the stack, not a one-off)
- Sensor: take-5's detect_mouth_v5, reused unchanged (OpenCV 5.0.0
  connectedComponents + numpy + Pillow, existing venv-opencv stack,
  no new install, no model download). Detected jaw per impact cell
  is 29x17 on all 4 cells, same as take-5.
- Module: articulation-pipev3-wide6/mouth_fit_wide6.py —
  feathered_triangle_mask + contour_fit_triangle_mouth +
  draw_triangle_jaw_v6, importable by future builders. Manifest
  carries shape="triangle" (vs take-5's ellipse) plus top_width,
  apex, and apex_vs_jaw_bottom per impact cell.
- Geometry: top edge = detected jaw width x 1.20 at the lip,
  apex = detected jaw centre bottom. Vertices (cx,cy = detected
  jaw centre, rx,ry = jaw half-size x 1.20 = 17.4 x 10.2):
  top-left (cx-rx, cy-ry), top-right (cx+rx, cy-ry),
  apex (cx, cy+ry). Top width 34.8px, top_width_vs_jaw_width 1.20.
- Scale: same as take-5 (x 1.20). Teeth: top teeth EXACTLY take-5
  (0.9px half-width triangles, fx -0.62,-0.31,0,0.31,0.62, from
  cy-ry*0.85 to cy-ry*0.50). Bottom teeth kept at 3 triangles but
  NARROWED to fx -0.15,0,0.15, because at cy+ry*0.55 the triangle's
  half-width is only 0.225*rx — take-5's +/-0.45 bottom teeth
  would fall outside the triangle and be clipped away.
- Rim: 1px light-steel (190,200,210) triangle outline, so the jaw
  reads on the dark GIF flatten background.
- Trail fix kept: GIF flattened onto opaque dark RGB (24,28,40),
  disposal=2 on all 22 frames of both GIFs; cells stay transparent.

## First build failure inside take-6 (disclosed, fixed before showing)
The first take-6 build drew the tongue as a trapezoid, widest at
its top (20% down the jaw). Eye-check of the mouth zooms showed
that trapezoid filled the whole triangle and left only a thin dark
strip at the top — the cavity stopped reading as a mouth. That
build was NOT shown to Mars. The tongue was changed to a smaller
ellipse inside the triangle (top cy-0.30ry, bottom cy+0.80ry,
0.70rx wide), clipped by the triangle mask, exactly as take-5's
tongue was clipped by its ellipse mask. The outer shape is what
Mars asked to change (triangle, not circle); the inner tongue
keeps take-5's rounded proportions, and the dark cavity band above
it (cy-0.85ry to cy-0.30ry) stays visible. The files below are
the rebuilt, eye-checked version.

## Per-impact-frame triangle fit (4/4, gate_ok true, 0px off silhouette)
| Set | Detected jaw (x-y) | Centre | Top edge (y, width) | Apex (x,y) | Apex vs jaw bottom | Changed / fill |
|---|---|---|---|---|---|---|
| physical | x27-55 / y34-50 | (41.0, 42.0) | y31.8, 34.8px | (41.0, 52.2) | +2.2px | 492px / 0.518 |
| special | x12-40 / y26-42 | (26.0, 34.0) | y23.8, 34.8px | (26.0, 44.2) | +2.2px | 510px / 0.559 |
| signature | x13-41 / y29-45 | (27.0, 37.0) | y26.8, 34.8px | (27.0, 47.2) | +2.2px | 507px / 0.571 |
| heavy | x22-50 / y35-51 | (36.0, 43.0) | y32.8, 34.8px | (36.0, 53.2) | +2.2px | 474px / 0.534 |
Changed px are lower than take-5 (652-679px, fill 0.669-0.696)
because a triangle's area is ~0.64x an ellipse's for the same
bbox — that is geometry, not a smaller mouth: top width and
height are identical to take-5 (34.8 x 20.4px mask).
Non-impact cells: 18/18 verified byte-identical (md5) to the v2
eyes-only inputs, same as take-5 — no open mouth invented on a
closed frame. Special-set grin -> wide-jaw change from take-4 is
still carried in take-6 and still flagged for Mars's veto.

## Eye-check (mouth zooms, take-5 left | take-6 right)
On all 4 zooms the take-6 mouth reads as an upside-down triangle,
not a circle: wide dark top band, sides sloping inward, pale
tongue narrowing toward the chin point. Top teeth match take-5.
The triangle is NOT distorted on any impact frame and does NOT
bleed off the silhouette (gate 0px off on all 4).

## Honest limitations (do not quote past these)
- Feathering (Gaussian sigma 1.0, same as take-5) rounds the apex
  and top corners by ~1px; the sides stay straight, so the shape
  still reads as a triangle, but the apex is not a sharp pixel
  point.
- Jaw width is window-capped at 29px, inherited from take-5's
  sensor (seed +-14px) — width is not independently measured;
  lip line, tongue bbox, centre, and height are.
- Apex sits 2.2px below the detected jaw bottom (same vertical
  overshoot take-5's ellipse bottom already had); the gate
  confirms it still lands on the creature, not off it.
- Bottom teeth are narrower and less visible than take-5's,
  by necessity (see above) — if Mars wants take-5's bottom
  teeth, that would mean widening the triangle's lower half,
  i.e. giving up the triangle point.

## Verdict for Mars (not a lock)
Take-6 achieves the asked shape: upside-down triangle, teeth
unchanged, no distortion, no silhouette bleed. It is a real
alternative to take-5, not a forced replacement — if Mars thinks
the triangle reads worse at game size, take-5 stays the keeper
per his own fallback, and take-6 is simply not used.

## Files (new tag artic-pipev3w6-20261026, take-5 untouched)
- GIF: articulation-pipev3-wide6/razorgater/razorgater-attacks-artic-pipev3w6-20261026.gif (22 frames, 64x64)
- Side-by-side GIF: articulation-pipev3-wide6/razorgater/razorgater-attacks-take5-vs-take6-artic-pipev3w6-20261026.gif (22 frames, 128x64, left take-5, right take-6)
- Cells: articulation-pipev3-wide6/razorgater/razorgater-artic-pipev3w6-20261026-*.png (22)
- Manifest: articulation-pipev3-wide6/razorgater/manifest-artic-pipev3w6-20261026.json (detection + shape="triangle" per impact cell)
- Mouth zooms (take-5 | take-6): articulation-pipev3-wide6/razorgater/razorgater_*_mouthzoom_take5_take6.png (4)
- Builders: articulation-pipev3-wide6/build_razorgater_wide6.py, articulation-pipev3-wide6/mouth_fit_wide6.py
