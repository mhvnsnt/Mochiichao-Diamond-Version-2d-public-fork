#!/usr/bin/env python3
"""Remove a ground-level white spot between a creature's feet — and nothing else.

This is the tool behind the Sproutle spot fix (2026-10-26, Mars-approved):
the sample scan had wrongly claimed Sproutle needed "nothing", because it
looked at an atlas montage. This tool checks PER CELL, finds connected
components of near-white opaque pixels, and removes ONLY a component that
matches the ground-spot pattern:

  * touches the ground line (max y == 56 on a 64px cell, i.e. the bottom
    band) and starts at y >= 54,
  * size >= 5 pixels (single-pixel specks and claw highlights are left),
  * sits in the lower band only — design whites (Wispkin's mask, Zephling's
    belly, Yogiferno's cream fur, Punchkid's data-tape fists, Pixilite's
    crystal) are never in this band as a ground-touching component, and the
    tool refuses to touch anything above it.

Everything else is left byte-identical: feet, claws, body shading, and
filled contact shadows are untouched. Outputs are NEW files
(<name>_spotfree.png); originals are never overwritten.

Usage:
    python3 remove_ground_spot.py <cell.png> [<cell2.png> ...] [-o OUTDIR]
    python3 remove_ground_spot.py --check <cell.png>   # report only, no write

Exit 0 = done (or nothing matched); prints one line per changed cell with
the removed component's (size, xmin, xmax, ymin, ymax).
"""
import argparse
import os
import sys
from collections import deque

from PIL import Image

NEAR_WHITE = 230  # r, g, b must all exceed this, alpha > 200


def ground_spot_components(im):
    """Return a list of (pixels, bbox) for ground-spot components only."""
    w, h = im.size
    px = im.load()
    seen = set()
    spots = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 200 and r > NEAR_WHITE and g > NEAR_WHITE and b > NEAR_WHITE \
                    and (x, y) not in seen:
                q = deque([(x, y)])
                seen.add((x, y))
                pts = []
                while q:
                    cx, cy = q.popleft()
                    pts.append((cx, cy))
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen:
                            r2, g2, b2, a2 = px[nx, ny]
                            if a2 > 200 and r2 > NEAR_WHITE and g2 > NEAR_WHITE \
                                    and b2 > NEAR_WHITE:
                                seen.add((nx, ny))
                                q.append((nx, ny))
                xs = [p[0] for p in pts]
                ys = [p[1] for p in pts]
                # Ground-spot pattern on a 64px cell: touches y=56 (ground
                # line in the atlas layout), starts at y>=54, size>=5.
                # Scaled for other cell sizes by the same bottom-band rule.
                ground = int(h * 0.875)
                top = int(h * 0.84375)
                if max(ys) == ground and min(ys) >= top and len(pts) >= 5:
                    spots.append((pts, (len(pts), min(xs), max(xs),
                                        min(ys), max(ys))))
    return spots


def process(path, outdir=None, write=True):
    im = Image.open(path).convert("RGBA")
    spots = ground_spot_components(im)
    if not spots:
        return []
    if write:
        for pts, _bbox in spots:
            for (x, y) in pts:
                im.putpixel((x, y), (0, 0, 0, 0))
        base = os.path.basename(path)
        stem = base[:-4] if base.lower().endswith(".png") else base
        out = os.path.join(outdir or os.path.dirname(path),
                            stem + "_spotfree.png")
        im.save(out)
    return [bbox for _pts, bbox in spots]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("cells", nargs="+", help="64px cell PNGs to check/fix")
    ap.add_argument("-o", "--outdir", default=None,
                    help="output dir (default: alongside inputs)")
    ap.add_argument("--check", action="store_true",
                    help="report only, do not write")
    args = ap.parse_args(argv)
    total_px = 0
    changed = 0
    for path in args.cells:
        spots = process(path, args.outdir, write=not args.check)
        if spots:
            changed += 1
            total_px += sum(s[0] for s in spots)
            print(f"{os.path.basename(path)}: removed {spots}")
    print(f"cells changed: {changed}, total px removed: {total_px}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
