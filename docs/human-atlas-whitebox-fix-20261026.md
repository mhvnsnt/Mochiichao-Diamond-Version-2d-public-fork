# Human atlas white-box fix — 2026-10-26

## Problem
All 12 human in-game atlases (`src/assets/human-characters/in-game-sheets/*-atlas-64x64.png`),
14 cells each = 168 cells, were **0.0% transparent**. The atlas cutter detected the
light-grey background but never set it transparent, so `PixiWorldCanvas` drew the whole
64x64 square around every human in the world. That is the white box seen in every playtest.

## Method (scripted, no hand edits)
Script: `human-characters/whitebox-fix-20261026/cut_background.py` (staging copy; the
originals are checkpointed next to it in `originals/`).

Per 64x64 cell:
- seed = per-channel median of the 4 corner pixels (background greys measured 221–246
  across atlases);
- flood-fill from the cell border through pixels within RGB distance 20 of the seed;
- masked pixels get alpha = 0 with RGB untouched; every other pixel is byte-identical.

Border-connected background only is removed, so interior light pixels that belong to the
figure (enclosed by its outline) are never eaten. This is not a chroma-key hack: no figure
pixel is recolored or deleted.

## Verification
- 168/168 cells now transparent. Player A: 43.5% (portrait) to 79.2% (walk left idle)
  per cell, from 0.0% everywhere.
- 0 figure pixels changed outside the mask (byte-identical check over all 168 cells).
- Eye-checked on a dark background: Player A world_front, Mom Latina world_front,
  Shopkeeper world_front — figures intact, no background slab, no box. The lowest
  post-fix percentages (~21–25% on some front/back cells) are large figures filling
  the cell, not leftover background — confirmed on the dark composites.
- Fixed PNGs keep the same paths, dimensions (256x256), cell layout, and manifests,
  so no code change was needed. Originals are preserved in git history and in the
  staging `originals/` checkpoint.

## Files
12 atlas PNG content updates + this doc. 0 deletions.
