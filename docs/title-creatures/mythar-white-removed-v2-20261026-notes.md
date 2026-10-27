# Mythar white gaps v2 — staged, show-first (2026-10-26)

Mars ruling (2026-10-26 ~15:21 CDT, replying to the v1 white-removed show
sheet): there are two more white gaps right next to the ones already
removed, on each side, that still need to come out.

## Answer to the count question — measured, not assumed

Mars's words are exact: **2 more per side, 4 total.** The gold ring
veins split each visual pocket, but the near-white component count is:

- LEFT: 2 components, 265 px
- RIGHT: 2 components, 457 px
- TOTAL v2 removed: 722 px

## Deliverables (staged only, no repo edit, no PR, no deletion)

- New cutout: `work/mythar-white-removed-v2-20261026.png` (434x350 RGBA)
- Before/after show sheet:
  `work/show-100/mythar-white-removed-v2-show-20261026.png`
  (full figure before/after on black and on dark ground (24,32,48),
  plus a 5x zoom pair for EACH of the 4 newly removed gaps, on black)
- This notes file.

Base: v1 `work/mythar-white-removed-20261026.png` (434x350, opaque
76,412 px). Shipped original `repo/src/assets/title/mythar-walk-cutout.png`
is untouched by this task; deletion + new lock remain gated on Mars
confirming a version in words, as a separate step.

## Method (scripted, open-source only — no hand pixel edits)

1. Near-white mask on v1: opaque (alpha > 128) AND R,G,B all > 235.
   Connected components, 8-connectivity (scipy ndimage).
2. For every side-zone component >= 20 px, measured its 2-px
   neighbourhood: % gold neighbours (warm gold pixels), % dark-outline
   neighbours, % transparent neighbours. This split is what separates
   sheet pockets from ring/sparkle whites — u2netp alone does NOT split
   them (it keeps 99-100% of all of these pockets as "figure", which is
   why pass 1, which used u2netp diff with a >= 500 px threshold, missed
   them; the two pass-1 zones were the only pockets u2netp cut out).
3. Removed ONLY components with gold-neighbour share 0-1% (true
   pockets, bounded by outline/wing/body, not by gold stroke).
   Alpha set to 0 on exactly those pixels in a copy of v1.
   RGB was NOT touched anywhere.

## What was removed — per side, per gap

### LEFT — 265 px

| Gap | Pixels | Bounding box (x, y, w, h) | Mean RGB | Gold neighbours |
|---|---|---|---|---|
| L-B | 119 | 76, 207, 10, 23 | (246.0, 243.9, 240.3) | 1% |
| L-C | 146 | 102, 212, 12, 24 | (247.1, 244.3, 241.1) | 0% |

L-C sits 8 px west of the pass-1 left zone (121,214,35,41); L-B sits
further west in the same pocket chain (36 px from pass-1).

### RIGHT — 457 px

| Gap | Pixels | Bounding box (x, y, w, h) | Mean RGB | Gold neighbours |
|---|---|---|---|---|
| R-A | 350 | 298, 214, 31, 35 | (244.3, 241.9, 239.2) | 0% |
| R-C | 107 | 345, 207, 9, 17 | (246.4, 244.0, 240.9) | 1% |

R-A touches the pass-1 right zone (272,213,34,41) at distance 0
(it overlaps its eastern edge); R-C sits east of the wing tip, inside
the ring, 40 px from pass-1.

## Explicitly NOT removed — ambiguous / design whites, LEFT

These near-white pieces look white at a glance but are ring/sparkle
whites: 41-51% of their 2-px neighbourhood is gold stroke, 0% is dark
outline. Removing them cuts black holes into the ring and sparkles
(an initial 10-component draft did exactly that and was discarded
after eye-check — it is NOT delivered). Left, with reasons:

| Piece | Pixels | Bounding box (x, y, w, h) | Mean RGB | Gold neighbours | Why left |
|---|---|---|---|---|---|
| L-A | 97 | 62, 183, 11, 40 | (254.2, 254.2, 242.7) | 42% | Ring-arc white highlight strip |
| L-D | 55 | 110, 250, 11, 13 | (254.4, 254.6, 246.9) | 49% | Sparkle core (gold star centre) |
| L-E | 25 | 73, 236, 17, 11 | (254.7, 254.6, 239.7) | 51% | Ring/sparkle white |
| L-F | 20 | 68, 227, 4, 7 | (252.9, 254.1, 244.2) | 41% | Ring-arc white sliver |

## Explicitly NOT removed — ambiguous / design whites, RIGHT

| Piece | Pixels | Bounding box (x, y, w, h) | Mean RGB | Gold neighbours | Why left |
|---|---|---|---|---|---|
| R-B | 44 | 327, 191, 10, 24 | (254.1, 253.7, 242.8) | 48% | Ring-arc white strip |
| R-D | 71 | 334, 236, 10, 15 | (253.0, 251.8, 246.2) | 45% | Sparkle core (gold star centre) |
| R-E | 140 | 345, 170, 21, 67 | (254, 254, 242) | 48% | Tall ring/wing-edge highlight, spans wing + ring |

Also preserved exactly as in pass 1: face/forehead highlights, chest
iridescence, wing-pane light spots, white tail between legs
(x199-213, y204-228), light ring/halo itself (gold ellipse + sparkles),
wing-tip/horn design edges, and the 1,739 u2netp edge-trim pixels
(mean RGB ~213-234, would alter design edges).

If Mars meant one of the LEFT pieces above when he said "two more on
each side", he can point at it by location and that single piece can
be removed as a further shown step — it is reported here rather than
deleted on a guess, per the task's ambiguous rule.

## Verification (measured, not claimed)

- Diff v1 vs v2: exactly 722 px, and diff == removal mask exactly.
- Alpha-only change: 722 px changed alpha, 0 px changed RGB.
- New opaque count: 75,690 px (76,412 - 722).
- Output size/mode unchanged: 434x350 RGBA.
- Whole-image near-white (>235) remaining: 1,707 px (2,429 - 722),
  all in preserved design areas (face, panes, fur highlights, ring
  whites listed above). Largest remaining near-white component in the
  side pocket regions is 110 px of the ambiguous R-E ring piece, left
  intentionally (see above); largest remaining in the left pocket
  region is 14 px.
- Eye-check: v2 on black shows both side pockets black (transparent),
  ring arcs and sparkles intact, body/wings/legs/tail/face intact.
  The discarded 10-component draft is not delivered and its file was
  overwritten by the corrected 4-component v2 before any showing
  (it was never shown to Mars).

## Gated next step (NOT done here)

Deletion of the old shipped file + new lock happen ONLY after Mars
confirms in words that a version is right the first time, as a
separate step. Until then: old shipped file stays, v1 stays staged,
v2 stays staged for him to judge from the show sheet.

## GPU note

CPU-only step, stated plainly: this is a tiny 434x350 PNG alpha
operation; a GPU genuinely cannot help it. Any future GPU-able lane
work goes to Kaggle GPU first per the standing GPU-first rule.
