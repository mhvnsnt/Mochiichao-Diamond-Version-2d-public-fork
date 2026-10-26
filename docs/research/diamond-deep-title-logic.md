# Diamond deep title logic — full extraction (5/5)

Source files read (structure/order/values only, no Pokemon art, music, or code copied):
pokediamond `arm9/src/filesystem.c` (NARC table + NARC member reader),
`arm9/overlays/63/src/ov63_021DB450.c` + `arm9/overlays/63/include/ov63_021DB450.h`
(title monster animation), `arm9/overlays/63/asm/ov63_021D8890.s` (title caller),
and the decomp file trees `files/demo/title/titledemo/`, `files/demo/title/op_demo/`,
`files/graphic/opening/`. Date of pull: 2026-10-26.

This finishes the extraction the 2026-10-25 research document left at 1/5
(only the monster-animation function name). All 5 pieces are now extracted.

## Piece 1/5 (previously done, restated for completeness): title monster-animation setup

`Title_SetupMonAnimationSprites` (ov63_021DB450.c) creates the world view
(the file's own comment: without this step the screen stays black), then loops
over exactly 3 creatures — the three starters, in order — assigns each an
animation, and stores the resulting animated objects in `field_04[0..2]`.
The middle creature gets an extra animation assignment (animation 35, versus
animation 6 for all three). It then allocates a 0x4800-byte buffer, builds a
render context from it, sets the camera perspective clipping planes
(0x1000 near, 0x384000 far), and binds a model/animation resource (id 0x3D,
slot 4) at priority 10, slot 1.

Mochiichao translation: title screen shows exactly 3 starter creatures, in
order, middle one with a distinct animation; the world view must be created
before any creature is visible, or the title is black. HAVE: title starter
trio pattern (intro-frame-02). NEED TO MAKE: 3-creature title animation rig
with a distinct middle-creature animation.

## Piece 2/5 (new): the per-creature 6-state animation state machine

`ov63_021DB5CC` is a per-creature state machine driven by `field_1C`
(state) and `field_1D` (frame counter), called once per frame per creature
(the assembly caller invokes it 3 times, once per creature index). States:

| State | What happens | Exit condition |
|---|---|---|
| 0 | Window-outside plane set to OBJ+BG0; animation slots 12 and 13 set to 0x400, slot 6 set to 0; fall through to state 1 | Immediate (fallthrough) |
| 1 | Run this creature's first hop function (see pairs below); reset counter | Hop function returns TRUE |
| 2 | Bind two animation resources for this creature (pair indices from table `ov63_021DBF08`: creature 0 -> slots 4,5; creature 1 -> slots 2,3; creature 2 -> slots 0,1) and a position callback (`ov63_021DB940`) | Immediate |
| 3 | Wait until the bound animation is finished AND the global frame counter reaches this creature's threshold | Thresholds: creature 0 = 0x703 (1795), creature 1 = 0x7CE (1998), creature 2 = 0x8A8 (2216) — staggered, so creatures finish in order, ~200 frames apart |
| 4 | Run this creature's second hop function; restore animation slot 6 to 1; reset counter | Second hop returns TRUE |
| 5 | Hold: counter increments; at 20 frames, reset counter and state to 0 and return TRUE (creature cycle complete, ready to run again) | 20 frames |

Per-creature hop pairs (each hop moves the creature a few units per frame for
exactly 6 frames, then restores animation slots 12/13 to 0x100 and returns TRUE):

| Creature index | First hop (state 1) | Second hop (state 4) |
|---|---|---|
| 0 | X +0, Y +6 per frame; slots 12/13 -0x80 per frame | X -3, Y -0x12 per frame |
| 1 | X -0x10, Y -0x10 per frame; slots 12/13 -0x80 per frame | X -6, Y -0x10 per frame |
| 2 | X +8, Y -0x10 per frame; slots 12/13 -0x80 per frame | X +6, Y -0x14 per frame |

Spawn positions (table `ov63_021DBEF0`, X, Y): creature 0 = (0x080, 0xC0),
creature 1 = (0x100, 0xC0), creature 2 = (0x050, 0xC0) — left, centre, and
near-left, all on the same baseline, not evenly spaced.

Mochiichao translation: a 6-state loop per title creature (pose -> hop ->
bind animation -> wait for staggered threshold -> return hop -> 20-frame
hold -> repeat), with per-creature hop directions and staggered finish
thresholds ~200 frames apart. HAVE: title action-loop pattern. NEED TO MAKE:
the 6-state machine itself, the hop tables, and the staggered thresholds.

## Piece 3/5 (new): titledemo NARC inventory (the title-demo asset pack)

`demo/title/titledemo.narc` is listed in filesystem.c (line 61). Its decomp
tree holds 19 member files (numbered narc_0000..narc_0019, with gaps where
the NARC skips indices): 4 NSCR (screen/tilemap), 6 PNG (raster art),
2 NSBMD (3D models), 2 NSBTA (3D animation), 5 .pal (palettes). In other
words the title demo is a small mixed pack: tilemaps + flat art + two 3D
models with their animations + palettes — not a video, not one big image.

Mochiichao translation: the title-demo equivalent is a small mixed pack in
the same proportions (tilemaps, flat art, 2 animated figures, palettes).
HAVE: title figure art pipeline (2D sheets). NEED TO MAKE: a titledemo-style
asset list for the Mochiichao title (no 3D models — PixiJS 2D sheets in
those slots, per the standing 2D-sheets rule).

## Piece 4/5 (new): op_demo NARC inventory (the opening-demo asset pack)

`demo/title/op_demo.narc` is listed in filesystem.c (line 141). Its decomp
tree holds 74 member files (narc_0000..narc_0073, no gaps): 19 NCLR
(palettes), 20 NCGR (character/tile graphics), 16 NSCR (screens), 6 NCER
(cells), 6 NANR (cell animations), 6 NSBMD (3D models), 1 NSBTX (texture).
That is the full 2D asset stack (palette + tiles + screen + cell + cell
animation) plus a 3D model set — the opening demo is built from the same
five 2D layers the intro/title research already describes, with 3D models
only for the model shots.

Mochiichao translation: the opening-demo equivalent is the same five 2D
layers (palette, tiles, screen, cell, cell animation) per scene, with 2D
figure sheets standing in for the 6 model slots. HAVE: the 2D layer pattern.
NEED TO MAKE: an op_demo-style per-scene asset list for the Mochiichao
opening (palette/tile/screen/cell/animation per scene).

## Piece 5/5 (new): opening NARC inventory + NARC load path + title lifecycle

(a) Opening assets: `graphic/opening.narc` is listed in filesystem.c, and
`files/graphic/opening/` holds 21 member files (narc_0000..narc_0020):
10 NSCR, 2 NCGR, 5 NCLR, 2 NANR, 2 NCER — the same five 2D layers, no 3D
models at all. The opening is therefore a pure 2D tile/cell animation,
unlike the title demo (which mixes in 3D). This is distinct from
`demo/intro/intro.narc`, which is a separate archive.

(b) Load path: `ReadFromNarcMemberByPathAndId` opens a NARC by path,
reads its header chunk size, seeks past the file-allocation table, asserts
the requested member index is in range, and reads that member by offset
and size into a destination buffer. Every title/opening asset above is
loaded this way — by (archive path, member index), never by filename.

(c) Title lifecycle (ov63_021DB450.c + caller assembly): setup creates the
world view and the 3 creatures (Piece 1) and then, in the caller, lights
are set (4 lights, vectors + colours), the display is swapped, and a
palette fade runs before the per-frame state-machine calls; teardown
(`ov63_021DB580`) frees the 0x4800 buffer and the world view, a null-guarded
update step (`ov63_021DB598`) advances the world view, and a render step
(`ov63_021DB5A8`) resets the software sprite camera and runs the render
callbacks. The position callback (`ov63_021DB940`) converts a creature's
model position into screen position with a fixed scale (0xAC) and offsets
(-0x80 X, -0x60 Y, 0x40 Z) added to a base position.

Mochiichao translation: load title/opening assets by (pack, index) from a
manifest, not by filename; setup order is world -> lights -> palette fade
-> per-frame creature state machines; teardown frees the world and the
render buffer in that order; screen position = model position x fixed
scale + fixed offset. HAVE: manifest/asset-list pattern. NEED TO MAKE:
the (pack, index) loader convention for title/opening packs and the
setup/fade/teardown order in TitleScene.

## Counts

- Diamond deep title logic: 5/5 = 100% (1 previously done + 4 new in this
  document). No Diamond title-logic piece remains owed in this item.
- Diamond title asset inventories counted: titledemo 19 files, op_demo
  74 files, opening 21 files — 114 files total, all by extension above.
- Proprietary files swapped: none. No Pokemon art, music, or code was
  copied; only structure, counts, coordinates, timers, and thresholds are
  recorded, which is the same class of fact as the prior research documents.
