# SHADOW STRIP REPORT (2026-10-25, shadow_strip.py v3 — Pillow + numpy only)

Tool: `sprite-art/atlases/_tools/shadow_strip.py` (py_compile clean).
Method (open-source only, NO hand-tool pixel edits): bottom band y >= 0.70H,
flat low-chroma colour (chroma <= 25) occurring NOWHERE outside the band
(colour-uniqueness, same idea as spot_check.py v2 Gate B), candidate bbox
wide/flat (width >= 0.30W, width >= 2x height, y_max >= 0.85H), top-row
safety + 40%-of-opaque cap. Originals NEVER overwritten; outputs are
`<stem>_shadowfree.png` next to the original.

History (honest, including the failure): v1 of this script added a
row-dominance filter; eye-check at 4x showed it cut only 65 of 151 shadow
px in razorgater attack_b and left a HOLE inside the blob
(proof kept at `animation/attack/razorgater/attack_b_strike_proof.png`
from the v1 run — superseded). The row filter was REMOVED; v3 cuts the
whole unique-colour set. A seed-grow experiment into adjacent low-chroma
pixels ate body (606 px, bbox x12-63) and was DISCARDED, not shipped.
Gradient edge shades (each < 12 px, e.g. 136-165 gray around the 141/142
flat interior) are NOT removed by a flat-colour gate — that remnant is
identical in kind to the already-approved spot_check _clean outputs.

## Shipped (18 files, 880 px) — eye-checked enlarged AND at 64 px

| Creature / set | Files | Px removed |
|---|---|---|
| Razorgater attack (attack_b_strike, attack_c_impact) | 2 | 296 (148 each) |
| Kittember game-ready cells (00, 03, 04, 05, 06, 08, 09, 10, 12, 13, 14, 16, 17, 21) | 14 | 488 |
| Razorgater game-ready cells (cell_01, cell_16) | 2 | 96 (17 + 79) |

Checks on shipped files: feet/tails intact, no holes in bodies, topmost
opaque row unchanged in every file. Razorgater attack _shadowfree differs
from the spot_check `_clean` file by only 3 px alpha per file — i.e. this
pass reproduces the already-approved clean for those frames.
Proofs (orig left, shadowfree right, 4x + 64 px native):
`animation/attack/razorgater/attack_b_strike_proof.png`,
`attack_b_strike_proof64.png`, same for attack_c_impact;
`_shadow_work/kittember_cell_06_proof.png`,
`_shadow_work/razorgater_cell_16_proof.png`.

## Swept, no cut (full scope — every input was scanned)

- Game-ready: 958 inputs scanned (final gates). Only the 16 cells above
  + 3 non-cell hits (below) passed.
- Idle: 153 inputs, 0 changed. (Idle ground blobs were already removed
  by spot_check _clean; remaining bottom-band colours occur in the body.)
- Attack: 353 attack+idle inputs in the combined final run, 2 changed
  (the Razorgater pair above).
- Hurt cells: 60 extracted 64 px cells (`*_hurt_cell_*.png`), 0 changed
  under final gates, except the 1 HELD file below.
- Hurt raw generation images: 21 non-cell, non-_clean files scanned.
  Final gates found 6 hits / 19,631 px (chromejaww 30, duneclaw 221,
  manticlaw 126, mythar 7,547, oblivirex 10,783, sproutle 924) — NOT
  APPLIED and NOT eye-checked: these are 1600x1600 single generation
  images, not shipped cells, and a sheet-level bottom band is not a
  per-cell shadow gate (the _masks pass on a 1600px image also aborted
  in-session, so no proof was produced). Their shipped derivatives are
  the 64 px hurt cells above, which were swept. If a future cell
  extraction re-cuts from these raws, the strip runs on the extracted
  cells, not on the raws.

## NOT shipped — excluded or HELD (never silently dropped)

- Excluded as non-cell inputs (3 files, 47 px in the dry run, NOT applied):
  `game-ready/gearkid/icons/gearkid_icon64.png` (12 px, an icon, not a
  character cell), `game-ready/sproutle/sproutle_atlas_64_locked.png`
  (18 px) and `game-ready/terrapod/terrapod_atlas_64_locked.png` (17 px)
  (atlas SHEETS — a sheet-level bottom band is not a per-cell shadow;
  their cells are covered by the cell sweep).
- HELD for show-first confirmation (Mars ~20:41 rule — staged, does NOT
  block the rest of the batch): `animation/hurt/mechapion/mechapion_hurt_cell_00.png`
  — candidate 27 px, bbox x12-58 y47-61, SPARSE (27 px across a 47 px-wide
  bbox, not a coherent blob). Proof staged at
  `sprite-art/_shadow_work/mechapion_hurt_proof.png` (orig left, candidate
  cut right — at 4x the two sides look near-identical; feet intact).
  Parent: SHOW this proof to Mars before deciding; do not apply until he
  says so. This file is NOT counted in the shipped totals.
- Razorgater hurt + idle cleans: APPROVED by Mars ~20:11 CDT — CLOSED,
  not re-cut, not re-opened here. Existing `_clean` files untouched.

## Known limit (stated, not hidden)

Flat-colour gates remove the shadow INTERIOR only. A 1-px gradient edge
ring remains on shipped cells (visible at 4x on kittember/razorgater
proofs, barely visible at native 64 px). The engine shadow ellipse
(SHADOW-LAYER-SPEC.md) is drawn under the creature at the same footprint
and covers most of that ring. Full gradient-edge removal needs a real
segmentation tool (OpenCV/rembg class); neither is installed in this
session, so no such claim is made here — that is follow-up work, not a
reason to hold the interior cut or the engine layer.

## Addendum A — Aerobeak gradient ellipse (ellipse_strip.py v2)

Flat-colour shadow_strip found 0 px in Aerobeak cells, but the art plainly
has a light-grey GRADIENT ellipse under the feet (verified at 4x:
`_shadow_work/aerobeak_cell00_4x.png`). Tool:
`sprite-art/atlases/_tools/ellipse_strip.py` — row-run gate (bright
low-chroma rows, >= 45% bright, bottom-most run, taper extension).
v1 component gate FAILED (gradient fragments into < 32 px components);
v2 row fractions verified on cell_00 (rows 55-61 bright 0.49-0.88 vs feet
rows 44-54 <= 0.33). SHIPPED 9 files / 1,295 px: game cells 00, 01, 02,
03, 06, 07 + idle a/b/c (266 px each — ellipse + the spot_check white
patch, body intact). Eye-checked 4x (cell_00, cell_01, cell_06, idle_a
`*_ellipse_proof.png` in `_shadow_work/`). Cells 04, 05, 08, 09, 10 have
no ellipse (0 px). Engine replacement: Aerobeak is flyer/M in
shadowLayer.ts — the engine ellipse goes underneath.
Full ellipse-gate sweep (game-ready + idle + attack, 1,311 inputs) hit
296 files / 40,616 px — NOT applied: the gate fires on light-bodied
creatures too (e.g. Razorgater attack_b would lose 403 px, mostly steel
body, vs the verified 151 px shadow). The gate is valid only where the
body is dark and the ellipse is distinct (Aerobeak, verified); wider use
needs a per-creature body-brightness guard first. Those 296 hits are
recorded in `_shadow_work/dry_ellipse_all.json`, not shipped, not
claimed clean or dirty.

## Addendum B — Locked atlases (reconciliation defect)

The atlas reconciliation batch proved (visible-pixel comparison) that
the locked atlases still contain the baked shadow: atlas cell == plain
cell, NOT shadowfree, for Kittember 14 cells, Razorgater 2 cells,
Aerobeak 6 cells. Canonical locked atlases ship AS-IS (NOT claimed
clean) until rebuilt. Rebuilds (this lane,
`sprite-art/atlases/_tools/rebuild_atlases.py`, visible-pixel verification):
`_shadow_work/rebuilt-atlases/` — kittember/razorgater/aerobeak
`_atlas_64_shadowfree.png`, 22 cells replaced, 0 flagged, verify_ok all
three (rebuilt region == shadowfree on visible pixels; all other cells
visible-identical to the locked atlas). Rebuilt atlases use NEW
filenames so they cannot overwrite the canonical locked atlases; the
parent re-stages them when ready. Note on comparison method: exact RGBA
comparison falsely flagged all 22 cells (locked atlases zero RGB at
alpha 0; cells carry junk RGB there — kittember_cell_00: 165 exact-diff
px, 0 alpha diffs, 0 opaque RGB diffs). Visible-pixel comparison is the
correct gate, and it confirms the reconciliation finding.
48/51 sets were NOT tested by the reconciliation method ("not flagged"
= "not tested", NOT "verified clean") — this report claims clean only
for the cells listed as shipped above.
