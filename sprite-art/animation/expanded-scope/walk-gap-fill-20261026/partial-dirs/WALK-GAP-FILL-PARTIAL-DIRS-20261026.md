# WALK-GAP FILL — PARTIAL DIRS + 3 LOCKED SIDES — 2026-10-26 (STAGED ONLY)

Mars order 2026-10-26 ~17:56 CDT: creatures missing left/right (or any direction)
get those frames MADE — do not flag them, fill them. This batch covers exactly the
8 partial walk-frames dirs from the Razorgater audit, plus locked sides for the 3
of them that also had zero locked-side cells. STAGED ONLY, show-first: NO PR,
NO lock, NO overwrite of existing walk-frames or locked files. Nothing in
`walk-frames/` or `atlases/` was written by this batch (builder + outputs live
only in this dir).

Pixel work is local CPU — Kaggle GPU genuinely cannot help these steps (64x64
pixel transforms, no render, no training). No Kaggle job. No generation was
performed, so the likeness-generation rule was not triggered (no prompt, no name,
no franchise reference anywhere); everything below is the creatures' OWN art,
transformed only by copy / mirror / crop / NEAREST fit / the cleanups listed.

## COUNTS

- Walk frames built: 32/32 = 100% (4 frames x 8 creatures: left_0, left_1,
  right_0, right_1, all 64x64 RGBA, dated `*_20261026.png` in this dir).
- Locked-side cells built: 6/6 = 100% (overworld_side + overworld_side_2 x 3
  creatures: aerobeak, floatcalf, megalochrome — pixel-identical to the newly
  built left_0 / left_1 in this batch, Razorgater convention, 64x64 RGBA).
- Before/after sheets: 8/8 = 100% (existing down_0/1 + up_0/1 vs new left/right,
  plus locked sides where built).
- Walk-cycle GIFs: 8/8 = 100% (8 frames: down_0, down_1, left_0, left_1, up_0,
  up_1, right_0, right_1, 3x, 300 ms/frame — preview timing only, not a game
  timing claim).
- Manifest: `walk-gap-fill-partial-dirs-manifest-20261026.json` (per-frame md5,
  palette size, new-colour count, bbox, bottom-row counts, source + mode).
- Builder: `build_partial_dirs.py` (PIL + scipy only, re-runnable).

## METHOD (same for every creature unless noted per creature)

1. Own locked side cells first (5 creatures that have them): verbatim copies,
   cleaned ONLY by: alpha<32 stripped, <4px specks dropped, detached bright
   low-saturation components wholly below the body midline dropped (that is
   what removes zephling's wind rings; see stormtalon caveat for the attached
   case). No face redraw, no colour change.
2. Mirrors: horizontal flip of a verbatim own frame. Lane precedent: ashemit's
   walk left_0 / right_0 are pixel-exact mirrors of each other. A mirror swaps
   the side the face points to (that IS the direction change); it does not
   redraw the face.
3. Angles-sheet crops (the 3 zero-locked-side creatures only): the creatures'
   OWN 2d-sheet angles panels (not another creature, not a new drawing):
   border-connected white-bg flood removal, largest component only, NEAREST
   fit to 64x64. NEAREST resampling only ever selects source-panel pixels, so
   it cannot invent interpolated colours.
4. Palette check per frame: colours compared against the creature's OWN art
   universe (its walk down/up frames + the locked cells used + its crop-panel
   pixels). Result for all 32 frames + 6 cells: 0 new colours. Palette sizes
   are in the manifest (e.g. finblade 1,092/1,105; megalochrome 1,182-1,291).
   Note honestly: for the 3 crop creatures the check is partly by construction
   (NEAREST-only transforms), because their side palettes come from their own
   angles panels, not from their walk frames — those panel colours are still
   their own art, not invented here.
5. Shadow check per frame: semi-transparent gray pixels (alpha 32-254, low
   saturation, mid brightness — the baked-shadow signature) in rows 56-63:
   0 on ALL 32 frames and all 6 cells. Opaque pixels in rows 56-63 on aerobeak
   (330/34) and floatcalf (196/159) are opaque BODY (flyer legs/wing tips,
   floater belly), not a shadow ellipse — see sheets. Engine renders shadows
   afterwards, as always; nothing shadow-shaped was baked in.

## PER CREATURE

- aerobeak (flyer, side flight): left_0 = own angles-lighting panel, top-row
  col3 (side, facing left); right_0 = own angles-top-diagonal panel,
  bottom-row col2 (side, facing right); left_1 = mirror(right_0),
  right_1 = mirror(left_0). Two distinct poses per direction, both verbatim
  own panels. Caveat for Mars's eye: left_0 fills its 64px box edge-to-edge
  (bbox 0,0-62,63) because that panel pose is large and diagonal; nothing
  looks cut in the sheet, but it is tighter than its siblings.
- finblade (swimmer, side swim): locked cells 05 + 06 both face RIGHT visually
  (the red-eye marker test was contaminated by the red belly and is NOT
  trusted; facing was judged by eye). right_0 = cell05 verbatim,
  right_1 = cell06 verbatim, left_0/left_1 = their mirrors. Cells 04 (vertical
  view, not a side swim) and 08/09 (motion-streak variants) were NOT used.
- floatcalf (hover, side hover): right_0 = own angles-lighting panel,
  top-row col3 (side, facing right; cyan rings dropped as detached
  components); left_0 = mirror(right_0). Phase 2 is the ONE scripted phase in
  this batch: right_1 = right_0 tilted +4deg (NEAREST) + 1px lift = hover bob,
  left_1 = its mirror. The second angles panel (bottom-row col2, sunset glow)
  was tried and DISCARDED: its light-gradient + orange-glow background could
  not be flood-removed without eating the pale belly, and a salvage attempt
  returned only the dark cap with the belly gone — so it is not used at all.
  A small cyan fin-fragment touches the body at the top-left of the crop and
  is retained as part of the body (visible on the sheet).
- megalochrome (hover/swim, side swim): left_0 = own angles-lighting panel,
  row1 col3 (side, facing left); right_0 = row2 col2 (side, facing right);
  left_1 = mirror(right_0), right_1 = mirror(left_0). Ripple removal:
  454px (left base) / 367px (right base) of bright-blue ripple cleared, plus
  detached ripple fragments. CAVEAT, stated not hidden: a FAINT 1-2px light
  gray-blue ripple arc remnant survives at rows ~48-51, because at 64px it
  touches the tail fin / belly and shares the body's neutral-silver colour
  range — removing it would cut fin pixels. It is not a shadow (0 semi-gray
  bottom-row px, above), it is a waterline remnant, and it is visible on the
  sheet for Mars's eye. If he wants it gone, that needs a hand edit, not
  another blind filter pass.
- mothrix (flyer, side flight): left_0 = locked cell06, left_1 = cell09,
  right_0 = cell05, right_1 = cell16 — all verbatim, facing judged by eye +
  eye-position check (cell06/09 left, cell05/16 right). Specks dropped: 2/1/2/0
  px; cell16 lost one 8px below-body fragment. Tiny wing-dust specks that are
  part of the source cells remain (visible as 1px dots on the sheet).
- squirmite (limbless worm, side crawl): left_0 = locked cell06 (flat crawl),
  left_1 = cell09 (arched crawl phase), right_0 = cell07 (flat, facing right),
  right_1 = cell11 (arched, facing right) — all verbatim, no mirrors needed.
  Cleanest set: 0 specks, 0 below-body drops, 0 bottom-row px.
- stormtalon (flyer, side flight): left_0 = locked cell08 (facing left),
  right_0 = cell09 (facing right), left_1 = mirror(cell09),
  right_1 = mirror(cell08). CAVEAT, stated not hidden: cell09-derived frames
  RETAIN its storm-cloud puffs under the talons, because at 64px the puffs are
  CONNECTED to the talon/wing mass (not a detached component like zephling's
  rings), so the component filter cannot remove them without cutting talons.
  They are a storm effect attached to the creature, not a ground shadow
  (0 semi-gray bottom-row px), and they are visible on the sheet.
- zephling (flyer, side flight): left_0 = locked cell04 (wing folded, facing
  left), left_1 = cell06 (wing raised, facing left), right_0 = cell05 (wing
  folded, facing right), right_1 = cell09 (wing raised, facing right) — all
  verbatim. Wind-ring removal: 150+125px (left_0), 409px (left_1), 312px
  (right_0), 402px (right_1) of detached below-body ring strokes dropped.
  Cell03 (front view) was not used as a side.

## LOCKED SIDES (3 creatures, Razorgater convention)

- aerobeak: overworld_side = new left_0, overworld_side_2 = new left_1.
- floatcalf: overworld_side = new left_0, overworld_side_2 = new left_1.
- megalochrome: overworld_side = new left_0, overworld_side_2 = new left_1.
  Locked atlases + locked manifests were NOT edited; these are staged cells
  only, for a future lock to adopt (which would then also have to accept the
  angles-panel palettes for these 3, per the palette note above).

## WHAT WAS NOT DONE HERE (scope boundary, not a gap in this batch)

- The other locked-side gaps (cocoonode, inklet, oblivirex, pixilite, pyropaw,
  shellguard, wispkin), Punchkid's 2nd side frame, and the strikechamp_unsuited_full
  walk dir are covered by sibling fill work under
  `walk-gap-fill-20261026/locked-side/` and `punchkid-51st/` — not repeated
  here, not claimed here.
- No PR, no lock, no ship: everything above is staged in this dir until Mars
  confirms in words. In particular the megalochrome ripple remnant and the
  stormtalon cloud puffs are shown as-is for his eye, not silently fixed by
  cutting body pixels.
