# LOCKED-SIDE GAP FILL — 7 CREATURES — 2026-10-26 (STAGED ONLY)

Mars order 2026-10-26 ~17:56 CDT: fill the gaps, do not flag them; gap-filling is
mundane completion, not a design decision. Razorgater method throughout.
Pixel work is local CPU — Kaggle GPU genuinely cannot help these steps
(64x64 PNG copies + sheets + GIFs; no training, no rendering). No Kaggle job.

## COUNTS LINE

- Cells built: **14 / 14 = 100%** (7 creatures x 2 cells each).
- Creatures with ZERO locked side/walk cells before, now staged: 7/7 = 100%.
- Locked atlases/manifests modified: 0. PRs: 0. Locks: 0. Overwrites of locked
  files: 0. All output is new dated files under
  `animation/expanded-scope/walk-gap-fill-20261026/locked-side/`, show-first.

## METHOD (identical for all 7)

- Each new cell is a pixel-identical copy of that creature's OWN walk-frames
  left pair (`<creature>_walk_left_0/1.png`, already 64x64 RGBA) — NOT newly
  drawn poses, NOT another creature's cells. Verified by md5 + full pixel
  comparison per cell (see per-creature manifests).
- Roles follow the dorowani / ashemit / finblade locked convention:
  `overworld_side` + `overworld_side_2`, 64x64 RGBA.
- NO face changes (a copy cannot change a face). NO baked shadows in any new
  cell (checks per creature below; shadows are engine-rendered afterwards,
  never baked into sheet art). NO generation was performed, so the
  likeness-generation rule (reference image first, attributes only, no name,
  no franchise reference) was not triggered — there was nothing to generate.
- GIFs: 2 frames at 3x (192x192), 300ms/frame, loop — preview timing only,
  not a game timing claim (same as the Razorgater precedent).
- Before/after sheets: BEFORE = that creature's locked `overworld_front` cell
  as stand-in + a blank side slot; AFTER = the 2 new side cells at 3x.

## PALETTE — READ THIS HONESTLY (two different numbers)

- New colours vs the creature's OWN walk-frames source: **0 for all 7
  creatures** (pixel-identical copies; nothing was edited or invented).
- Opaque colours in the new cells that are NOT present in that creature's
  locked cells dir: cocoonode 165 + 1,404; inklet 1,681 + 1,702;
  oblivirex 901 + 921; pixilite 703 + 862; pyropaw 514 + 528;
  shellguard 1,121 + 1,118; wispkin 399 + 399. Those are the walk-frames
  palettes themselves (generated/transformed art with anti-aliasing), not
  colours invented in this task — but a future lock amendment must accept the
  walk-frames palette, because the new cells do NOT match the locked palette.
  Do not quote "0 new colours" without that qualifier.

## PER-CREATURE RESULTS

| Creature | Roster | New cells | Source (own left pair) | Shadow check | Caveat (from walk.json, unchanged) |
|---|---|---|---|---|---|
| cocoonode | 017 | 11 overworld_side, 12 overworld_side_2 | left_0 md5 6b44afcffad2b66434a53e3e28ab74b2, left_1 78bc155022819be169a2d34560831fa8 | Crystal point tapers rows 56-63 (15->0 px); no detached ellipse | Faceless crystal; sides reuse front cell, 6% scale pulse (1.00 vs 1.06), no leg walk — NOT a newly drawn profile |
| inklet | 026 | 11 overworld_side, 12 overworld_side_2 | left_0 0f8cda174d8e6492d07bad604c9f4b5b, left_1 fcfb20fc99b5a1455b3247a96e20d6e0 | Jar base rows 56-63 is the jar body itself (same base as down frame); no separate shadow ellipse | Jar identical all directions; direction reads only from the octopus inside (profile shown) |
| oblivirex | 009 | 14 overworld_side, 15 overworld_side_2 | left_0 094be9f92d44dd48db6d3c74086219c5, left_1 83ab8b09ab8602d8feaa567783d3dcc1 | Bbox ends y56; ZERO px rows 56-63. walk.json style_note also: no baked shadow in shipped cells | heavy_slow; genuine quadruped side profile (original 8-panel sheet) |
| pixilite | 041 | 12 overworld_side, 13 overworld_side_2 | left_0 f09e4d467ff9164bda8f501fe3bcd01d, left_1 83a393093400225bf97e065f655be1a2 | Bottom rows are feet/body (28-31 px tapering to 12); no detached ellipse | Faceless by design; side reads via single leaf arm + splayed feet |
| pyropaw | 011 | 15 overworld_side, 16 overworld_side_2 | left_0 0736c62767c133bf994ad0d63d157e0f, left_1 f16a339c4b6588238a8f8a46047162f0 | Bottom rows are legs/paws (36->11 px); no detached ellipse | Side phase pairs clearly alternate quadruped trot (original 8-panel sheet) |
| shellguard | 039 | 13 overworld_side, 14 overworld_side_2 | left_0 0bab2ccac8456c0b0c631d3cc10806fe, left_1 34455ef0a6f9b1b564d0fc0ed59bacc8 | Bbox ends y62; rows 62-63 ZERO; rows 56-61 legs/feet (21->8 taper). walk.json style_note also: no baked shadow | grounded_standard, alternating legs. SEE discrepancy note below |
| wispkin | 042 | 10 overworld_side, 11 overworld_side_2 | left_0 2edd83e4e49cd808c5e3301118e90983, left_1 d3105dc328dd29ecc08564e4d111bc20 | Bottom rows are the wisp's own smoke trail (body effect, 7->0 px); hover creature; rows 62-63 zero | Hover bob (0 vs -3px); sides are tilt variants of the front cell — NOT a newly drawn profile |

All 7 left pairs were usable as-is: no creature needed drawing, and no
creature's cells were borrowed from another creature. Left-pair phase pairs
are genuinely distinct (differing pixels 1,225-2,648 / 4,096), not duplicates.

## SHELLGUARD DISCREPANCY (pre-existing, NOT caused by this task)

- Shellguard's locked manifest says `frame_count: 13` but its frames list has
  14 entries (last cell id is the string `'icon_derived'`, not a number).
- Staged cells 13/14 follow the highest NUMERIC cell (12), not the
  frame_count field. A future lock amendment must reconcile that field
  (it would need to read 16 with these 2 cells added, not 15). This task did
  not edit the locked manifest to fix it — staged only.

## FILES (per creature: 2 cells + before/after sheet + GIF + manifest)

- `locked-side/<creature>/<creature>_walk_side_0_20261026.png`
- `locked-side/<creature>/<creature>_walk_side_1_20261026.png`
- `locked-side/<creature>/<creature>-walk-before-after-20261026.png`
- `locked-side/<creature>/<creature>-walk-cycle-20261026.gif`
- `locked-side/<creature>/<creature>-walk-cells-manifest-20261026.json`
- Combined: `locked-side/walk-gap-fill-manifest-20261026.json`,
  `locked-side/build_walk_gap_fill.py` (reproducible builder),
  this report.
- Locked verification: all 7 locked atlases + all 7 locked manifests md5-verified
  unchanged after this task (same md5s as before the build).

## WHAT THIS DOES NOT DECIDE

- Whether Mars wants newly drawn side poses instead of promoted walk-frames
  (especially cocoonode pulse phases and wispkin tilt variants, which are
  front-derived by walk.json's own account). That is a follow-up order; the
  locked atlas/manifest are untouched, so nothing is burned in.
- The sheet-vs-frames source-of-truth choice (unchanged from the Razorgater audit).
- Lock/ship: these cells are staged, show-first. Ship + lock only after Mars
  confirms in words.
