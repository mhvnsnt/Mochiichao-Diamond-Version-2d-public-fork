# Footprints — LANE-100% build (staged only, 2026-10-26)

## Pokemon precedent

FireRed: `graphics/pokemon/<species>/footprint.png`, 16x16, mode 1 (bilevel),
black print on white — verified at that size for 387/387 species.

## Mochiichao method (honest limit, stated plainly)

These are FULL-BODY silhouettes downscaled from each creature's locked
`battle_front` cell (alpha > 0 -> black, LANCZOS to 16x16, threshold 128),
saved as 16x16 mode-1 black-on-white PNGs to match Pokemon's format.
They are NOT foot-traced prints: Pokemon's footprints are foot-shaped, and
no foot-tracing data exists for our creatures. A foot-traced pass (isolating
each creature's feet from its front cell) would be a separate art task;
what is staged here is the silhouette set, which is what the footprint slot
needs to exist at all.

## Outputs (51/51 = 100%)

- `footprints/<creature>_footprint.png` (16x16, mode 1).
- `footprints/FOOTPRINT-MANIFEST.json` (source cell + black-px count).
- `footprints/contact_sheet_51.png` — all 51 at 8x, eye-checked: silhouettes
  are distinct per creature (blobs at 16px are expected; identity reads
  from outline, as with Pokemon's prints).

## Builder

`../build_lane100.py`. Rerun reproduces all three lane100 builds.
