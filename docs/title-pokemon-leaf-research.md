# Pokemon leaf research: what the actual LeafGreen leaf files do

Read 2026-10-26 from the repo's FireRed/LeafGreen decomp submodule,
structure + numbers only. No Pokemon tile pixels are shipped in the
Mochiichao repo - see the swap note at the end.

## Source files

- `pokefirered-leafgreen/src/title_screen.c` - leaf spawner, leaf
  sprite callback, leaf animation, streak sprites.
- `pokefirered-leafgreen/graphics/title_screen/leafgreen/leaves.png`
  - a 16x176 palette preview sheet: 11 frames of 16x16, stacked.
  - Palette colours in the sheet: bright green (148, 255, 57),
    mid green (98, 222, 57), dark green (57, 189, 65).
  - The sheet's salmon background (230, 123, 90) is the preview
    background, not a leaf colour.
- Tile data named in code: `graphics/title_screen/leafgreen/leaves.gbapal`
  (palette) and `leaves.4bpp.lz` (compressed 4bpp tiles). Those tile
  bytes are NOT copied into this repo.

## The leaf sprite, exactly as the code defines it

- Size: OAM square, size 1 = 16x16 pixels, priority 3, palette 0.
- Animation (`sSpriteAnim_Leaf`): 11 frames, tile numbers
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, each held 8 frames, then
  JUMP(0) - a full tumble loop of 88 frames. Each tile is a
  different stage of the same leaf turning over as it moves.
- Movement (`SpriteCallback_TitleScreenLeaf` + `CreateLeafSprite`):
  spawns at the right edge (DISPLAY_WIDTH = 240), at a random height
  y = 32 + (rand % 88), so y in 32..119 on a 160-high screen.
  Moves LEFT at xspeed 16, 24, or 48 (in 1/16-pixel units, so
  1, 1.5, or 3 pixels per frame), with a small vertical drift
  yspeed in -2..+1. Destroyed when x < -8, or y < 16, or y > 200.
- Spawner (`Task_LeafSpawner`): a new leaf every 6..11 frames
  (delay = rand % 6 + 6), seeded 30840. So leaves are frequent,
  overlapping, and never in a neat row.
- Streaks: 4 streak sprites alongside the leaves, moving left at
  7 pixels per frame, wrapping to the right edge, at heights
  40, 80, 110, 60, 90, 70, 100, 50 (cycled). The streaks are the
  fast wind lines behind the slow tumbling leaves.

## What this means for Gabu - and what was swapped

Mars (2026-10-26 ~07:07 CDT): "use the actual leaves from the Pokemon
games files." What was taken from the files: the SIZE (small, 16px
class), the SHAPE IDEA (a pointed leaf blade with a stem, not a dot),
the TUMBLE (rotating through stages as it moves, not a static
ellipse), the MOTION (drift left/down with sway, frequent spawns),
and the GREEN FAMILY (bright / mid / dark green).

What was NOT taken: the Pokemon leaf tile pixels themselves. Those
are Pokemon art, and this lane's standing order is no Pokemon art
in any PR. Per Mars's own pull-then-swap rule, the file was pulled
in, studied, and the leaf was swapped fast for a Mochiichao-original
leaf drawn in Pillow: pointed blade + stem + vein, in the same three
greens, rotated through angles as it moves. That is the leaf in
`gabu-action-shot-v3.png` (staging, shown to Mars) and in
`gabu-action-anim-v2.gif` (shipped here), and the leaf shape drawn
in `TitleScene.tsx` for Gabu's burst and for leaf weather (pointed
lens blade + stem line, not an ellipse).

If Mars wants the literal Pokemon tile pixels instead, that is a
different decision from the one recorded here, and it would break
the no-Pokemon-art rule for this lane - say so and it can be
revisited, it is not silently done here.
