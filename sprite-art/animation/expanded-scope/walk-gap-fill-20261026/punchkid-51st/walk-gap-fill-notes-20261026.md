# WALK GAP FILL — PUNCHKID 2ND SIDE FRAME + 51ST LOOK WALK DIR — 2026-10-26 (STAGED ONLY)

Mars order 2026-10-26 ~17:56 CDT: fill the gaps, no call needed.
Staged only, show-first. NO PR, NO lock, NO overwrite of locked files or existing frames.
All files in this dir: `animation/expanded-scope/walk-gap-fill-20261026/punchkid-51st/`.
Pixel work is local CPU — Kaggle GPU genuinely cannot help 64x64 PNG copies/verifications, so no Kaggle job.

## COUNTS (percentage rule)

- Punchkid 2nd side frame: 1/1 = 100%
- 51st-look walk dir (strikechamp_unsuited_full): 8/8 = 100%
- New art files total: 9 (1 + 8), all 64x64 RGBA, all md5-verified copies of own art
- New colours invented: 0 in every new file (byte-identical copies — see manifest)
- Base Strikechamp walk frames reused for the 51st look: 0
- Locked files touched: 0

## ITEM 1 — PUNCHKID overworld_side_2

- Before: locked manifest (`game-ready/punchkid/punchkid.manifest.locked.json`) had a SINGLE
  side cell: overworld_side, cell 06, faces RIGHT.
- New: `punchkid_overworld_side_2_20261026.png` = pixel-identical copy of his OWN
  `walk-frames/punchkid/punchkid_walk_left_1.png` (md5 222fb69c6711818303d32f82b7b17660,
  1,418 colours = source). Razorgater method: left pair first, md5-verified where copied.
- Direction: new cell faces LEFT. That follows the lane's own side-pair convention —
  Dorowani locked side faces LEFT and side_2 faces RIGHT, so side_2 is the opposite
  direction, not a same-direction phase. The locked side (RIGHT) + new side_2 (LEFT)
  give both directions, like Dorowani.
- Style caveat, stated plainly: the walk sheet is smooth cartoon vs the pixel locked cell.
  That drift was already in walk-frames (punchkid.walk.json) and is NOT introduced here.
  The new cell is a copy, NOT a redraw in locked pixel style. No face change.
- GIF: `punchkid_walk_cycle_20261026.gif` — left_0 <-> left_1, 3x, 300 ms/frame
  (preview timing only, not a game timing claim).
- Sheet: `punchkid_before_after_20261026.png` — before (1 locked side), after (locked + new),
  source walk pair, direction/style notes.

## ITEM 2 — 51ST LOOK: strikechamp_unsuited_full walk dir

What the look is: the THIRD Strikechamp variant — the rare no-helmet, no-armor FULL look
(red suit, full body). NOT the suited default. NOT the helmeted, lower-only regular
second look (strikechamp_unsuited). Its locked side was complete (18 side/walk cells)
but its walk-frames dir was MISSING. The old "share-base-walk vs build-one" question
is answered by BUILDING: every new frame comes from this look's OWN locked cells.

Mapping — by EYE direction, NOT by locked manifest label (labels for this set are wrong):

| New frame | Source locked cell | Source label | Eye direction |
|---|---|---|---|
| down_0 | cell 08 | walk_front_0 | FRONT |
| down_1 | cell 14 | walk_front_2 | FRONT |
| left_0 | cell 07 | walk_side_0 | SIDE-LEFT stride |
| left_1 | cell 02 | overworld_side | SIDE-LEFT standing |
| right_0 | cell 07mir | walk_side_mirror (locked mirror) | SIDE-RIGHT stride |
| right_1 | cell 05 | overworld_side_2 | SIDE-RIGHT standing |
| up_0 | cell 09 | walk_front_1 | BACK |
| up_1 | cell 12 | walk_back_1 | BACK |

- Down = first two TRUE fronts in walk_front order (08, 14); up = first two TRUE backs
  in walk order (09, 12). Sides use the only true side cells: 07/02 left, 07mir/05 right.
- Label corrections found by eye (do NOT reuse manifest roles blindly for this set):
  cell 03 labelled overworld_front is a BACK; cell 04 labelled overworld_back is a FRONT;
  cell 09 labelled walk_front_1 is a BACK; cell 11 / 13 labelled walk_side_1 / _2 are
  FRONTS; cell 14 labelled walk_front_2 is a FRONT; cell 10 labelled walk_back_0 is a
  FRONT; cell 16 labelled walk_back_2 is a FRONT.
- Pre-existing artefact copied as-is: the white patch on cell 07 / 07mir's leg is in the
  locked cells; it was NOT fixed here (no editing of locked art).
- Walk manifest entry: `strikechamp_unsuited_full.walk.json` in this dir.
- GIF: `strikechamp_unsuited_full_walk_cycle_20261026.gif` — all 8 frames
  (down, left, right, up), 3x, 250 ms/frame (preview timing only).
- Sheet: `strikechamp_unsuited_full_show_20261026.png` — what the look is, its locked
  side cells, the 8 new walk frames, and the label warning.
- Full md5 / colour / size verification: `walk-gap-fill-manifest-20261026.json`.

## SHADOWS (both items)

NO baked shadows in any new cell/frame. Every new file is a byte-identical copy, so it
adds and removes nothing: bottom-row non-transparency is feet (opaque tan/red plus
anti-alias edges, checked at 8x), not a detached gray ground ellipse in any source.
Shadows are engine-rendered afterwards, never baked.

## LIKENESS / GENERATION

No generation was used in this task, so there is no generation prompt to audit.
Had generation been used, the rule would apply: reference image first, visible
attributes only, NO creature name, NO franchise reference in prompts.

## NOT DONE HERE (not hidden)

- No PR, no lock, no game src wiring — staging only, for Mars to see first.
- Punchkid side_2 is a copy in walk-sheet style, not a locked-pixel-style redraw.
  If Mars wants a redrawn pixel-style side_2, that is a separate new-art order.
- The strikechamp_unsuited_full locked manifest's wrong front/back/side labels were
  NOT rewritten here (this task stages walk frames only; a manifest relabel is separate).
