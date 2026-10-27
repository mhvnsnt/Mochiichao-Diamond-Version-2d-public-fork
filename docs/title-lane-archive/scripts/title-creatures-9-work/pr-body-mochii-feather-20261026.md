Ship feathered Mochii preview as the new locked Mochii cutout (files only).

Mars approved the feathered previews in words 2026-10-26 ~16:52 CDT
(replying to the feather show sheet): "barely feathered, so light they're
not noticeable — those are fine, those are perfect." This PR ships ONLY
Mochii. Yogiferno feathered ships separately AFTER the clean-v3 ship
lands, to avoid two PRs fighting over the same Yogiferno file.

Change (1 file, replace, 0 deletions):
- src/assets/title/mochii-walk-cutout.png replaced with
  mochii-feather-preview-20261026.png (380x380 RGBA): 1px feather on the
  shipped locked Mochii — outermost opaque ring (touching transparency)
  at alpha 128 (2,047 px), interior byte-identical, RGB unchanged
  everywhere, same dimensions, same bounding box, same visible-pixel
  count. The figure does not shrink; the edge only softens from a hard
  0 -> 255 cut to a 0 -> 128 -> 255 step.

Not touched: Yogiferno, any other cutout, any code, any cry file, any
other asset. No wiring. Merged file is not live until a Pages rebuild.
