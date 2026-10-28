#!/usr/bin/env python3
"""Produce a palette-variant preview from a design PNG + palette map.

The lustre system in one rule: a variant is a PALETTE SWAP, never a
redraw. This tool shifts every pixel that sits near a mapped source
colour by that entry's colour delta, so shading, gradients and
linework ride along untouched. Protected colours (outlines, eyes —
the identity locks) and the near-white field are never remapped.

Palette map JSON:
{
  "variant_id": "lustre",
  "protect_hex": ["#000000"],
  "entries": [
    {"from": "#8fb2ca", "to": "#e0aa4e", "tolerance": 60}
  ]
}
`tolerance` is RGB euclidean distance: pixels within it of `from`
shift by (to - from), weighted to full at the centre, fading at the
rim, so soft edges don't band.

Usage:
  palette_variant.py <in.png> <palette.json> <out.png> [--report <r.json>]
Stdlib + PIL only.
"""
import argparse
import json
import math
from pathlib import Path

from PIL import Image


def hx(s):
    s = s.lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("palette")
    ap.add_argument("out")
    ap.add_argument("--report")
    args = ap.parse_args()

    pal = json.loads(Path(args.palette).read_text())
    entries = [(hx(e["from"]), hx(e["to"]), float(e.get("tolerance", 48)))
               for e in pal["entries"]]
    protect = [hx(c) for c in pal.get("protect_hex", [])]
    protect_tol = float(pal.get("protect_tolerance", 24))

    im = Image.open(args.src).convert("RGB")
    px = im.load()
    w, h = im.size
    counts = [0] * len(entries)
    protected = skipped_bg = 0

    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r > 245 and g > 245 and b > 245:  # white field
                skipped_bg += 1
                continue
            if any((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
                   <= protect_tol ** 2 for pr, pg, pb in protect):
                protected += 1
                continue
            best, best_d = None, None
            for i, (f, t, tol) in enumerate(entries):
                d = math.sqrt((r - f[0]) ** 2 + (g - f[1]) ** 2 + (b - f[2]) ** 2)
                if d <= tol and (best_d is None or d < best_d):
                    best, best_d = i, d
            if best is None:
                continue
            f, t, tol = entries[best]
            wgt = 1.0 - 0.5 * (best_d / tol)  # 1.0 centre -> 0.5 rim
            px[x, y] = tuple(
                max(0, min(255, round(c + (tc - fc) * wgt)))
                for c, fc, tc in zip((r, g, b), f, t))
            counts[best] += 1

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    im.save(args.out)
    report = {
        "source": str(args.src), "output": str(args.out),
        "variant_id": pal.get("variant_id"),
        "size": [w, h], "pixels_remapped_per_entry": counts,
        "pixels_protected": protected, "pixels_white_field_skipped": skipped_bg,
    }
    print(json.dumps(report, indent=2))
    if args.report:
        Path(args.report).write_text(json.dumps(report, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
