# Discovery silhouettes — pre-discovery blacked-out display (2026-10-26)

## Purpose (corrected by Mars, 2026-10-26 ~12:33 CDT)

These are FULL-BODY SILHOUETTES for the pre-discovery display: the blacked-out
shape a player sees before discovering a creature, Pokemon-style. They are
NOT footprints. The name/purpose was corrected from the earlier lane100
"footprints" label: Mars approved this exact set as perfect on 2026-10-26
~12:31 CDT under that corrected purpose.

## Method (honest limit, stated plainly)

Full-body silhouettes downscaled from each creature's locked `battle_front`
cell (alpha > 0 -> black, LANCZOS to 16x16, threshold 128), saved as 16x16
mode-1 black-on-white PNGs. At 16px they read as blobs whose identity comes
from the outline, as with Pokemon's pre-discovery silhouettes.

## What this is NOT

Actual footprints (foot/paw prints) are a SEPARATE build, still to be made
from the creatures' feet. Nothing in this directory is a footprint.

## Outputs (51/51 = 100%)

- `silhouettes/<creature>_silhouette.png` (16x16, mode 1).
- `silhouettes/SILHOUETTE-MANIFEST.json` (source cell + black-px count).
- `silhouettes/contact_sheet_51.png` — all 51 at 8x, eye-checked: silhouettes
  are distinct per creature.

## Builder

`../build_lane100.py` (lane100 build; silhouette files byte-identical to the
Mars-approved set). Actual footprints are not produced by that builder.
