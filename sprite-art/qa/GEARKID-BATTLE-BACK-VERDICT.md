# GEARKID #032 — battle_back SHEET-RESOLUTION VERDICT (Phase A, 2026-10-25)

Re-sequence (Mars 2026-10-25 ~21:55 CDT): Gearkid is a Region 1 set (in R1
trainer teams) and battle cannot ship with a provisional back. This
re-verify was done FIRST, before the rest of Phase B.

## VERDICT — battle_back cell 3 is NOT a back. DO NOT SHIP BATTLE WITH IT.

`game-ready/gearkid/cells/gearkid_cell_03.png` (manifest role
`battle_back`, lock note: "PROVISIONAL: eyes visible at 64px, key visible;
closest back candidate") — viewed enlarged 8x from the 64px cell AND
against the full-resolution angles sheet — is unambiguously FRONT-facing:
gold gear head, black face visor, two bright green glowing eyes, gold
body, silver fist raised. The 64px reading was correct; sheet resolution
does not rescue it. The provisional label is CONFIRMED WRONG, not resolved.

## A true back DOES exist — in the angles sheet, not in the atlas

Source (sheet resolution, viewed full-frame):
`sprite-art/2d-sheets/gearkid/media-generation-gearkid-angles-0-62830925-e065-4b3c-98ab-98e3804fc776.webp`

- Row 1, column 6 (top-right): Gearkid from behind — gear head seen
  from the back (no face, no eyes), key rising behind the head, body
  back with panel. Plus a small circular back-of-head detail inset.
- Row 2, column 5 and column 6: back / back-three-quarter views —
  gear back + key, face not visible.

So the manifest's "QA sheet-level says a true back exists" is CONFIRMED
for the angles sheet. What does NOT exist yet is a 64px atlas cell of
that back pose. Extracting one (as a NEW cell file, via the atlas
extraction tooling — never a hand edit, never overwriting cell 3) and
relabeling battle_back to it is OWED work for the atlas/Step 1 lane.
This QA step records the verdict and stages the source; it does not
fabricate the cell, and it does not silently relabel the manifest
(the manifest file itself is untouched here).

## Verdict per cell (locked atlas, Gearkid)

Evidence levels: INDIVIDUAL = cell viewed enlarged 8x on its own;
GRID = cell identified in the 4x atlas sheet by its manifest atlas_x/y.
"Manifest role" is what `gearkid.manifest.locked.json` claims.

| Cell | Manifest role | Sheet-resolution verdict | Evidence |
|---|---|---|---|
| 00 | overworld_back | FRONT (green eyes, gold gear/body) — role WRONG | INDIVIDUAL |
| 01 | overworld_front | FRONT, key variant — role CORRECT | INDIVIDUAL |
| 02 | battle_front | FRONT, key chest, arms out — role CORRECT | INDIVIDUAL |
| 03 | battle_back | FRONT (green eyes, gold body, fist up) — role WRONG, BLOCKER | INDIVIDUAL |
| 04 | overworld_back_2 | SIDE/profile (one eye sliver, key on side) — NOT a back; closest atlas side | INDIVIDUAL |
| 05 | overworld_side | FRONT, key variant — role WRONG | INDIVIDUAL |
| 06 | overworld_front_2 | FRONT — role CORRECT | GRID |
| 07 | overworld_front_3 | FRONT — role CORRECT | GRID |
| 08 | overworld_side_2 | FRONT (green eyes, gold body) — role WRONG | INDIVIDUAL |
| 09 | overworld_side_3 | FRONT (green eyes, gold body) — role WRONG | INDIVIDUAL |
| 10 | overworld_front_4 | SIDE/profile — role WRONG (side, not front) | INDIVIDUAL |
| 11 | overworld_front_5 | SIDE/profile — role WRONG (side, not front) | INDIVIDUAL |
| 12 | walk_front_0 | FRONT — role CORRECT | GRID |
| 13 | walk_front_1 | FRONT — role CORRECT | GRID |
| 14 | walk_front_2 | FRONT — role CORRECT | GRID |
| 15 | walk_front_3 | FRONT — role CORRECT | GRID |
| 05mir | walk_side_mirror | Mirror of FRONT cell 05 — still FRONT, not a side | DERIVED |
| 08mir | walk_side_mirror | Mirror of FRONT cell 08 — still FRONT, not a side | DERIVED |
| icon_derived | icon | Head crop from battle_front cell 2 — as manifest states | MANIFEST |

Summary counts for Gearkid's 16 base cells: front 13/16 = 81%,
side 3/16 = 19% (cells 04, 10, 11), back 0/16 = 0%.
Manifest role accuracy on those 16: correct 8/16 = 50%
(01, 02, 06, 07, 12, 13, 14, 15), wrong 8/16 = 50%
(00, 03, 04, 05, 08, 09, 10, 11). The two mirror entries inherit their
sources' error.

## What this blocks, and what it does not

- BLOCKS: shipping Gearkid battle with cell 3 as battle_back, and any
  overworld/side logic that trusts manifest roles for cells 00, 04, 05,
  08, 09, 10, 11 or the mirrors without this table.
- DOES NOT BLOCK (show-first, never block on one decision): everything
  else in Phase B — VFX/audio hookup, playtest/balance, and the QA lock
  for all other sets proceed; Gearkid's FILES are still hash-locked in
  qa-lock-manifest.json (their pixels are frozen, only their role labels
  are wrong), and the back-cell extraction + manifest relabel are staged
  here with source paths for Mars/parent show.
- No file was overwritten. Enlarged check crops live in /tmp/gearkid-qa/
  (ephemeral); the verdict, paths, and table above are the durable record.
