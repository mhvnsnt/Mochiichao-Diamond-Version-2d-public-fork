# Mythar pearlescent gap-fill v4 — staged only

## Mars's direction (2026-10-26 ~17:26 CDT, replying to the v3 show sheet)

v3 did NOT restore the legs to his eye — the fringe restoration did not read
as his legs back. His explicit new direction, which OVERRIDES the alpha-only
approach for this version: FILL those gaps with the little pearlescent colour
he has on him ("or something") — the remaining gap interiors become
pearlescent fur colour, so the flanks/legs read full and continuous instead
of showing background through holes. **This RGB fill is explicitly authorized
by Mars for v4.** It is a departure from the earlier alpha-only cleanups
(v1/v2/v3 removed pixels by alpha only); it is recorded here as his order,
not a worker invention. Do NOT re-argue pixel-vs-eye here; his eye is final.

## Base files (434x350 RGBA throughout)

- Shipped: `repo/src/assets/title/mythar-walk-cutout.png`,
  md5 `474b1583464fe377fb32098781b37bcf` (verified unchanged).
- V3: `work/mythar-white-removed-v3-20261026.png` (opaque 83,601 px).
- V4: `work/mythar-pearlescent-gap-fill-v4-20261026.png` (opaque 85,472 px).

## What was filled

Removed set = shipped opaque AND v3 transparent = **1,871 px** (verified,
matches v3 notes exactly). Components (4-connectivity), 6 gaps + 2 tiny px:

| Gap | Px | Bbox (x, y, x, y) | Adjacent fur mean RGB (pale fur within 3 px) | Adjacent fur median RGB | Final fill mean RGB | Final fill median RGB |
|---|---|---|---|---|---|---|
| LEFT big | 706 | 122, 214, 155, 253 | 232.6, 227.5, 216.2 (spread 22.6, 21.3, 22.2) | 243, 235, 217 | 245.0, 241.9, 236.8 | 245, 242, 240 |
| RIGHT big | 690 | 272, 213, 306, 252 | 239.2, 234.7, 224.3 (spread 15.7, 15.2, 18.6) | 244, 239, 229 | 247.6, 245.1, 241.7 | 247, 244, 242 |
| RIGHT mid | 246 | 310, 217, 327, 238 | 242.4, 237.8, 226.6 (spread 8.6, 9.0, 12.9) | 244, 240, 231 | 243.7, 241.4, 237.7 | 244, 241, 238 |
| LEFT small | 95 | 104, 213, 112, 232 | 244.1, 238.1, 225.8 (spread 9.9, 10.5, 14.1) | 246, 241, 230 | 248.2, 244.9, 238.7 | 248, 245, 238 |
| RIGHT small | 67 | 346, 207, 352, 222 | 242.4, 235.4, 222.9 (spread 13.6, 13.8, 17.2) | 245, 239, 228 | 247.3, 243.7, 240.1 | 247, 244, 239 |
| LEFT small | 65 | 77, 208, 83, 226 | 243.6, 237.7, 225.0 (spread 9.1, 9.6, 14.4) | 245, 240, 229 | 246.5, 243.7, 238.7 | 246, 243, 238 |
| Tiny | 2 | x84, y227-228 | (filled with nearest-gap diffusion, same method) | — | — | — |

Overall fill: mean RGB (246.1, 243.3, 239.0), median (246, 242, 240).

Honest colour note, stated plainly: his flank fur adjacent to the gaps is
itself near-white pearlescent cream (medians ~243-246 red, ~235-241 green,
~217-231 blue — warm, blue channel lower than red, i.e. a cream/lavender
tint, not neutral sheet white at ~245, 243, 240). No hue was invented: every
fill colour derives from his own fur pixels. Because the fur is near-white,
the fill necessarily reads pale — the visible change is NOT a new colour
appearing, it is holes (background showing through in v3) becoming
continuous opaque flank in v4. On black and on dark ground the v3 holes
read as black bites; the v4 flanks read full.

## Method (scripted, no hand pixel edits)

Iterative nearest-pale-fur diffusion, 13 iterations. Known colours are ONLY
pale-fur pixels in v3 (opaque, mean channel > 165, channel spread < 55,
blue > 110 — the same pale-fur definition as the v3 notes; this excludes
gold ring, wing glass, and dark outlines, so no gold/dark bleeds into the
fill). Each removed pixel, layer by layer, takes the mean of its
already-known 4-neighbours, so colour gradients inward from the fur edge
instead of flat patches. A smooth gradient was chosen over nearest-colour
(Voronoi) blocks because it reads more like fur. Filled pixels get
alpha 255. Build script:
`work/mythar-pearlescent-gap-fill-v4-20261026.py`; counts JSON:
`work/mythar-pearlescent-gap-fill-v4-20261026.json`.

## Verification (on reload, not from the build log alone)

- Pixels differing v3 -> v4: exactly 1,871 (the filled set, nothing else).
- Every non-filled pixel byte-identical to v3: True.
- Filled pixels are a SUBSET of the shipped-removed set (exactly that set):
  no silhouette expansion beyond shipped opaque + pocket interiors.
- V4 silhouette == shipped silhouette exactly (opaque mask identical).
- Opaque counts: v3 83,601 -> v4 85,472 = shipped 85,472 (as expected when
  all 1,871 interiors are filled).
- Design whites untouched: face/forehead highlights, chest iridescence,
  wing-pane light spots, white tail (x199-213, y204-228), gold ring/halo,
  wing-tip/horn edges — none of these were in the removed set, none changed.
- Legs: unchanged from v3 (and from shipped below y254); leg zooms on the
  show sheet are identical by design, shown for continuity.
- Sheet eye-check: full figure v3 vs v4 on black AND dark ground
  (24,32,48) — v3 black bites at the flanks are gone in v4, flanks read
  continuous; tight per-gap zooms (8x) + both leg zooms (3x) with readable
  v3/v4 tags. First sheet draft had washed-out zoom tags and loose flank
  boxes; it was rebuilt with black-strip yellow tags and tight gap boxes
  before delivery.

## Status

STAGED ONLY. No repo edit, no PR, no ship, no deletion. V3 is superseded
for showing by v4 (newest dated edit, per the save rule). Ship + old-file
deletion happen ONLY after Mars confirms v4 in words.

CPU-only step, stated plainly: a 434x350 PNG operation — a GPU genuinely
cannot help that step.
