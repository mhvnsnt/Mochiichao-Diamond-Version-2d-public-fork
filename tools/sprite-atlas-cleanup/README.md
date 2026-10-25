# Sprite atlas cleanup — saved tool

Saved 2026-10-25 from the atlas cleanup run that fixed Pyromonk's white
spots between the legs (and the same artifact class across all 50
atlases). This is the exact script that ran, copied unchanged, plus its
report. Open source only: Pillow 10.2.0 + numpy 1.26.4. No paid tools,
no image-editor hand edits, no regeneration from sheets, no
re-extraction.

## What it does

`clean_atlas.py` removes trapped sheet-background pixels from 64x64
atlas cells without touching anything else. Trapped background is the
enclosed cream patch the original extraction left behind, because
extraction only removed border-connected background.

## The four gates

A candidate pixel is cut ONLY if it passes all four gates, or it is
kept as surface design:

1. **Near-background** — opaque (alpha >= 200), min(R,G,B) >= 215,
   (max-min) <= 30. This matches sheet-background cream (~248,248,244)
   while excluding coloured design pixels, yellow flame highlights
   (high chroma), and saturated colours.
2. **Component 3–400 px, not touching the cell border** — large white
   regions (Yogiferno fur, Wispkin mask) are excluded by size; a patch
   touching the border is surface, not trapped.
3. **Fully interior** — every 4-neighbour of every component pixel is
   opaque. Trapped background is enclosed by definition; a white patch
   that touches the outside world anywhere is surface design.
4. **Sheet-background colour match ≤ 25/channel** — the component mean
   colour must be within 25 per channel of that creature's own
   source-sheet background colour (corner median of the source sheet).
   Trapped background IS sheet background; deliberate white design is
   usually pure white or a different tint.

## Usage

```
python3 clean_atlas.py [--all | <creature> ...] [--force]
```

Run it from a checkout where the atlas tree lives at the path in the
script's `BASE` (`~/workspace/mochiichao-work/sprite-art/atlases`), or
edit `BASE` to point at your atlas tree. Refuses to overwrite existing
clean outputs unless `--force` is given.

## Originals are never overwritten

Clean outputs are NEW files only, and the originals are never written
to:

- `<stem>_atlas_64_clean.png` — starts from the ORIGINAL atlas and
  applies ONLY the cut masks (alpha-only diff, zero RGB changes).
- `<stem>.manifest-clean.json` — copy of the original manifest plus a
  `clean_changelog` (changed cells, kept components, skipped
  components).
- `clean/` — every cell, cleaned.

Original atlas PNGs, manifests, and per-cell PNGs stay exactly as they
were.

## Proven result (2026-10-25, all 50 atlases)

441 changed cells, 37,065 px removed, 595 surface components kept,
5 skipped/flagged, 6 zero-change dirs. Pyromonk: 8 cells / 292 px,
including cell 12, the strip between the legs Mars flagged. Full
per-creature table: `CLEANUP-REPORT.md`.
