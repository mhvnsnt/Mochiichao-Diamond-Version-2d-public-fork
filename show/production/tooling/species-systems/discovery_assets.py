#!/usr/bin/env python3
"""discovery_assets.py — Mochiichao silhouette + footprint derivation tool.

Implements teardown #3 (see SILHOUETTE-DISCOVERY.md): every species'
discovery presentation is derived from ONE alpha mask of its finished
design, gated by two discovery flags (seen / met), exactly the way the
classic creature-collector games gate their dex presentation behind
seen/caught bits:

    UNSEEN  -> number only, no art, all data fields masked
    SEEN    -> silhouette + name; body data stays masked
    MET     -> full-colour art, full record, footprint + cry unlocked

From a canon cutout PNG (RGBA) this tool derives:
    <slug>.silhouette.png     ink-filled silhouette, same canvas as source
    <slug>.footprint.1bpp     footprint bitmap: 16x16 grid, 1 bit/cell,
                              row-major, MSB = leftmost pixel, 32 bytes
                              (the MOCHIIOTECA-FORMATS.md footprint grid)
    <slug>.footprint.png      the same bitmap as a PNG preview (x16 NEAREST)
    <slug>.footprint.txt      ASCII rendering of the 16x16 grid
    <slug>.discovery.png      3-state preview strip (UNSEEN/SEEN/MET)

FOOTPRINT HONESTY NOTE: a true footprint is authored from a species'
foot anatomy (its sheet's footprint_spec). What this tool derives
automatically is a CONTACT-PATCH PROXY — the ground-contact band of
the design collapsed onto the grid — which is the gap-fill starting
point the design lane refines, never a finished print. Species whose
footprint_spec says has_footprint = false (floaters, swimmers) store
the all-zero bitmap and show a blank print area, the same rule the
original games use for legless species.

Requires Pillow (already used across this repo's tooling).
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

GRID = 16                 # footprint grid is GRID x GRID cells
ALPHA_THRESHOLD = 128     # pixel counts as "body" at/above this alpha
INK = (20, 22, 28, 255)   # silhouette ink (near-black, warm-neutral)
CARD = (208, 240, 240)    # Mochiioteca card colour (#d0f0f0, identity kit)
PAPER = (246, 248, 244)


def alpha_grid(img, threshold=ALPHA_THRESHOLD):
    """Return (width, height, rows) where rows[y][x] is True for body."""
    a = img.convert("RGBA").getchannel("A")
    w, h = a.size
    px = a.load()
    rows = [[px[x, y] >= threshold for x in range(w)] for y in range(h)]
    return w, h, rows


def bbox_of(rows, w, h):
    xs = [x for y in range(h) for x in range(w) if rows[y][x]]
    ys = [y for y in range(h) for x in range(w) if rows[y][x]]
    if not xs:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def make_silhouette(img, ink=INK):
    """Solid ink fill wherever the design is opaque; transparent elsewhere."""
    img = img.convert("RGBA")
    mask = img.getchannel("A").point(lambda v: 255 if v >= ALPHA_THRESHOLD else 0)
    out = Image.new("RGBA", img.size, ink)
    out.putalpha(mask)
    return out


def footprint_grid_from_cutout(img, band_fraction=0.18, coverage=0.30):
    """Derive the 16x16 contact-patch proxy grid from a cutout.

    Takes the bottom `band_fraction` of the design's opaque bounding
    box (the ground-contact zone), and marks a grid cell when at least
    `coverage` of the source pixels mapping into it are body.
    Returns a list of 16 rows of 16 bools.
    """
    w, h, rows = alpha_grid(img)
    box = bbox_of(rows, w, h)
    if box is None:
        return [[False] * GRID for _ in range(GRID)]
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    band_h = max(1, int(round(bh * band_fraction)))
    band_y0 = y1 - band_h + 1
    grid = []
    for gy in range(GRID):
        row = []
        sy0 = band_y0 + (gy * band_h) // GRID
        sy1 = band_y0 + ((gy + 1) * band_h) // GRID
        for gx in range(GRID):
            sx0 = x0 + (gx * bw) // GRID
            sx1 = x0 + ((gx + 1) * bw) // GRID
            total = hit = 0
            for sy in range(sy0, max(sy1, sy0 + 1)):
                for sx in range(sx0, max(sx1, sx0 + 1)):
                    total += 1
                    if rows[sy][sx]:
                        hit += 1
            row.append(total > 0 and hit / total >= coverage)
        grid.append(row)
    return grid


def pack_1bpp(grid):
    """Pack a 16x16 bool grid to 32 bytes: row-major, MSB = leftmost."""
    out = bytearray()
    for row in grid:
        for chunk in range(0, GRID, 8):
            byte = 0
            for bit in range(8):
                if row[chunk + bit]:
                    byte |= 0x80 >> bit
            out.append(byte)
    return bytes(out)


def grid_to_png(grid, scale=16):
    img = Image.new("RGB", (GRID * scale, GRID * scale), PAPER)
    d = ImageDraw.Draw(img)
    for y in range(GRID):
        for x in range(GRID):
            if grid[y][x]:
                d.rectangle(
                    [x * scale, y * scale, (x + 1) * scale - 1, (y + 1) * scale - 1],
                    fill=(26, 26, 26),
                )
    return img


def grid_to_ascii(grid):
    return "\n".join("".join("##" if c else " ." for c in row) for row in grid)


def state_strip(img, slug):
    """Three-card preview: UNSEEN (masked), SEEN (silhouette), MET (full)."""
    thumb_w, thumb_h = 240, 240
    pad, label_h = 12, 22
    strip = Image.new(
        "RGB", (3 * thumb_w + 4 * pad, thumb_h + label_h + 2 * pad), (232, 236, 238)
    )
    d = ImageDraw.Draw(strip)

    def fit(im):
        im = im.convert("RGBA")
        im.thumbnail((thumb_w - 16, thumb_h - 16), Image.LANCZOS)
        return im

    cards = []
    unseen = Image.new("RGBA", (thumb_w - 16, thumb_h - 16), (0, 0, 0, 0))
    du = ImageDraw.Draw(unseen)
    du.text((unseen.width // 2 - 14, unseen.height // 2 - 10), "???", fill=(120, 128, 132, 255))
    cards.append(("UNSEEN", unseen))
    cards.append(("SEEN", fit(make_silhouette(img))))
    cards.append(("MET", fit(img)))
    for i, (label, card_img) in enumerate(cards):
        x = pad + i * (thumb_w + pad)
        d.rectangle([x, pad, x + thumb_w, pad + thumb_h], fill=CARD)
        cx = x + (thumb_w - card_img.width) // 2
        cy = pad + (thumb_h - card_img.height) // 2
        strip.paste(card_img, (cx, cy), card_img)
        d.text((x + 8, pad + thumb_h + 4), f"{slug} - {label}", fill=(30, 34, 40))
    return strip


def process(cutout_path, slug, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    img = Image.open(cutout_path).convert("RGBA")
    w, h, rows = alpha_grid(img)
    box = bbox_of(rows, w, h)
    body_px = sum(sum(r) for r in rows)

    sil = make_silhouette(img)
    sil_path = out_dir / f"{slug}.silhouette.png"
    sil.save(sil_path)

    grid = footprint_grid_from_cutout(img)
    packed = pack_1bpp(grid)
    (out_dir / f"{slug}.footprint.1bpp").write_bytes(packed)
    grid_to_png(grid).save(out_dir / f"{slug}.footprint.png")
    (out_dir / f"{slug}.footprint.txt").write_text(grid_to_ascii(grid) + "\n", encoding="utf-8")

    state_strip(img, slug).save(out_dir / f"{slug}.discovery.png")

    set_bits = sum(sum(r) for r in grid)
    return {
        "species": slug,
        "source": str(cutout_path),
        "source_size": [w, h],
        "body_alpha_coverage_pct": round(100.0 * body_px / (w * h), 1),
        "bbox": list(box) if box else None,
        "silhouette": str(sil_path),
        "footprint_set_cells": set_bits,
        "footprint_1bpp_bytes": len(packed),
    }


def main(argv):
    if len(argv) < 4 or argv[2] != "--slug":
        print(__doc__)
        return 2
    cutout, slug = argv[1], argv[3]
    out_dir = "discovery-out"
    if "-o" in argv:
        out_dir = argv[argv.index("-o") + 1]
    print(json.dumps(process(cutout, slug, out_dir), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
