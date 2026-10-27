# 2D SHEETS CLEANED — USE-THESE NEW EDIT (2026-10-27 07:31 CDT)

Per Mars 2026-10-27 ~07:26 CDT: cut ALL little white spots between the legs + shadows
underneath in all 34 cells, save as the newest use-these new-edit versions, mark the
old white-spot/shadow versions DO NOT USE (marked, never deleted).

New directory: `sheets-2d-20261027-0731-use-these-new-edit/` (this directory).
Old directory: `sheets-2d-20261027/` — all 48 art/manifest files renamed `-DO-NOT-USE`.
Source: locked 2D front-facing sheets ONLY. NOT 3D renders. No new colours, no redrawn
anatomy, no mirrored backs. All removals are alpha-only (alpha -> 0, RGB kept).

## What was removed (net totals across 34 cells)

- Leg-gap whites: 92 px (Dorowani idle/attack/ready 5/cell, walk-front 13/cell)
- Grey ground-shadow bands: 812 px (shadow rows only, run >= 8)
- Detached dark grid/border artifacts: 676 px (passes 1-4)
- Straight-line artifacts merged into main component: 393 vertical + 142 horizontal px
- Below-feet dark fringe: 292 px
- Newly-detached fragments after band/line removal: 112 px
- Surgical lone fragments: 4 px (2px x 2 cells, Dorowani walk_side_01/03 at (14,55-56), 9px left of foot)
- **TOTAL NET REMOVED: 2523 px**

## Pass 8 — attempted and REVERTED (0 net effect)

An iterative floating-dark pass removed 427 px, but coordinate diffing proved it trimmed
real extremities: Dorowani snout tip (walk_side 2x8 block), hand/fingertip edges, head-crest
tip, and Gabu dark head-spike tips / fingertip edges at the cell borders. Pass 8 was fully
reverted: all 34 cells were restored to their pre-pass-8 state from a deterministic rebuild,
and strips were rebuilt from the restored cells. No pass-8 pixel remains in this directory.

## Kept deliberately (NOT removed)

- Eye highlights: Dorowani hit keeps 1 near-white px (row 6), Gabu hit keeps 3 (rows 15-17).
  All other near-white px are gone; remaining whites are upper-row highlights only.
- Body shading: scattered grey-ish body shading (Gabu 45-81 px/cell, Dorowani 17-41 px/cell
  outside shadow rows) is body shading, not shadow — kept.
- Foot outline: dark outline pixels 4-adjacent to body colour are foot outline, kept.
- 3 detached micro-fragments that contain body colour and sit at the feet/tail (plausibly
  tail-tip/toe): Dorowani walk_side_01/03 3px at (41-43,57), walk_side_02 7px at (20-22,54-57).
  Removed only the 2px fragment with no plausible body location (see above).
- Gabu: 0 white spots and 0 shadow bands existed in any Gabu cell (verified: 1 component,
  no grey run >= 5, no near-whites except hit highlights). Gabu cells carry only fringe/grid
  cleanup counts; their art is otherwise unchanged, carried under the new names.

## Per-cell counts (white_removed / grey_removed / artifact+line+fringe+pass7+surgical)

- dorowani/dorowani_attack_front_00_2d.png: white 5 / grey 58 / other 140 (shadow_rows [50, 51, 52, 53], white_after 0, grey_after 27)
- dorowani/dorowani_attack_front_01_2d.png: white 5 / grey 60 / other 141 (shadow_rows [49, 50, 51, 52], white_after 0, grey_after 28)
- dorowani/dorowani_attack_front_02_2d.png: white 5 / grey 60 / other 141 (shadow_rows [49, 50, 51, 52], white_after 0, grey_after 28)
- dorowani/dorowani_attack_front_03_2d.png: white 5 / grey 58 / other 142 (shadow_rows [50, 51, 52, 53], white_after 0, grey_after 30)
- dorowani/dorowani_hit_front_00_2d.png: white 0 / grey 0 / other 1 (shadow_rows [], white_after 1, grey_after 22)
- dorowani/dorowani_idle_front_00_2d.png: white 5 / grey 58 / other 142 (shadow_rows [50, 51, 52, 53], white_after 0, grey_after 30)
- dorowani/dorowani_idle_front_01_2d.png: white 5 / grey 58 / other 139 (shadow_rows [48, 49, 50, 51], white_after 0, grey_after 30)
- dorowani/dorowani_idle_front_02_2d.png: white 5 / grey 58 / other 145 (shadow_rows [50, 51, 52, 53], white_after 0, grey_after 33)
- dorowani/dorowani_ready_front_00_2d.png: white 5 / grey 58 / other 142 (shadow_rows [50, 51, 52, 53], white_after 0, grey_after 30)
- dorowani/dorowani_walk_front_00_2d.png: white 13 / grey 0 / other 5 (shadow_rows [], white_after 0, grey_after 17)
- dorowani/dorowani_walk_front_01_2d.png: white 13 / grey 106 / other 92 (shadow_rows [56, 57, 58, 59], white_after 0, grey_after 39)
- dorowani/dorowani_walk_front_02_2d.png: white 13 / grey 0 / other 5 (shadow_rows [], white_after 0, grey_after 17)
- dorowani/dorowani_walk_front_03_2d.png: white 13 / grey 106 / other 92 (shadow_rows [56, 57, 58, 59], white_after 0, grey_after 39)
- dorowani/dorowani_walk_side_00_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 25)
- dorowani/dorowani_walk_side_01_2d.png: white 0 / grey 66 / other 133 (shadow_rows [55, 56, 57], white_after 0, grey_after 41)
- dorowani/dorowani_walk_side_02_2d.png: white 0 / grey 0 / other 1 (shadow_rows [], white_after 0, grey_after 24)
- dorowani/dorowani_walk_side_03_2d.png: white 0 / grey 66 / other 133 (shadow_rows [55, 56, 57], white_after 0, grey_after 41)
- gabu/gabu_attack_front_00_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 69)
- gabu/gabu_attack_front_01_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 70)
- gabu/gabu_attack_front_02_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 70)
- gabu/gabu_attack_front_03_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 73)
- gabu/gabu_hit_front_00_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 3, grey_after 80)
- gabu/gabu_idle_front_00_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 73)
- gabu/gabu_idle_front_01_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 73)
- gabu/gabu_idle_front_02_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 75)
- gabu/gabu_ready_front_00_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 73)
- gabu/gabu_walk_front_00_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 67)
- gabu/gabu_walk_front_01_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 45)
- gabu/gabu_walk_front_02_2d.png: white 0 / grey 0 / other 5 (shadow_rows [], white_after 0, grey_after 81)
- gabu/gabu_walk_front_03_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 45)
- gabu/gabu_walk_side_00_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 71)
- gabu/gabu_walk_side_01_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 73)
- gabu/gabu_walk_side_02_2d.png: white 0 / grey 0 / other 2 (shadow_rows [], white_after 0, grey_after 71)
- gabu/gabu_walk_side_03_2d.png: white 0 / grey 0 / other 0 (shadow_rows [], white_after 0, grey_after 73)

## Verification (run after final strip rebuild)

- 34/34 cleaned cells + 12/12 rebuilt strips present, all open (PIL verify).
- Both manifests resolve every frame + strip file; strip sizes match frame counts.
- Every strip slice is byte-identical to its source cell (plain-paste concatenation).
- Post-clean near-white: only Dorowani hit (1) + Gabu hit (3) eye highlights remain.
- Post-clean shadow rows: no row with a grey run >= 8 at y >= 42 remains in any cell.
- Remaining detached components in final cells: only the 3 kept body-colour micro-fragments above.
- Old directory: 48/48 files renamed -DO-NOT-USE, md5-verified identical before/after rename,
  0 deletions, 0 original names remaining for those files.
