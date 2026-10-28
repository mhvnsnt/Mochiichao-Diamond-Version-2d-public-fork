#!/usr/bin/env python3
"""slice_pack.py - Step D (EXPORT) of the generated-turnaround pipeline.

Takes a directory of frame PNGs (extracted from a generated clip, e.g.
with ffmpeg) and produces game-ready output:

  * one trimmed PNG per frame (transparent padding removed),
  * a single horizontal sprite sheet PNG,
  * an atlas JSON (schema mochiichao-show/sprite-atlas/v1) recording,
    per frame: its rect in the sheet, its original canvas size, and
    the trim offset - everything an engine needs to draw the frame
    back at its original placement.

Dependencies: Python 3 + Pillow only. No model, no network.

Trim rule (stated so a reviewer knows exactly what was measured):
  * RGBA frames: the content box is the bounding box of pixels with
    alpha > 8.
  * RGB frames: the content box is the bounding box of pixels whose
    colour differs from the frame's own corner colour by more than
    12 per channel summed - the same corner-colour foreground
    heuristic family the proof gate uses (verify_proof.py).
  * A frame with no content at all is an error (exit 2): an empty
    frame in a character clip is a defect, not a sprite.

Usage:
  slice_pack.py <frame_dir> --out <out_dir> [--name <base-name>]
                [--key alpha|corner|auto]

Outputs in <out_dir>:
  <name>-f000.png ...   trimmed frames
  <name>-sheet.png      horizontal sprite sheet
  <name>-atlas.json     the atlas
"""
import argparse
import json
import sys
from pathlib import Path

from PIL import Image

ALPHA_THRESHOLD = 8
CORNER_TOLERANCE = 12


def content_bbox(img: Image.Image, key: str) -> tuple[int, int, int, int]:
    """Bounding box (left, upper, right, lower) of the frame's content."""
    mode = img.mode
    use_alpha = key == "alpha" or (key == "auto" and mode in ("RGBA", "LA"))
    if use_alpha:
        alpha = img.convert("RGBA").getchannel("A")
        mask = alpha.point(lambda a: 255 if a > ALPHA_THRESHOLD else 0)
        bbox = mask.getbbox()
    else:
        rgb = img.convert("RGB")
        w, h = rgb.size
        corner = rgb.getpixel((0, 0))
        px = rgb.load()
        minx, miny, maxx, maxy = w, h, -1, -1
        for y in range(h):
            for x in range(w):
                r, g, b = px[x, y]
                if (abs(r - corner[0]) + abs(g - corner[1]) + abs(b - corner[2])
                        > CORNER_TOLERANCE):
                    if x < minx:
                        minx = x
                    if x > maxx:
                        maxx = x
                    if y < miny:
                        miny = y
                    if y > maxy:
                        maxy = y
        bbox = None if maxx < 0 else (minx, miny, maxx + 1, maxy + 1)
    if bbox is None:
        raise ValueError("frame has no content under the trim rule")
    return bbox


def main() -> int:
    ap = argparse.ArgumentParser(description="Trim frames and pack a sprite sheet + atlas.")
    ap.add_argument("frame_dir", help="directory of frame PNGs (sorted by filename)")
    ap.add_argument("--out", required=True, help="output directory")
    ap.add_argument("--name", default="sprite", help="base name for outputs")
    ap.add_argument("--key", choices=["alpha", "corner", "auto"], default="auto",
                    help="trim key: alpha channel, corner colour, or auto (default)")
    args = ap.parse_args()

    frame_dir = Path(args.frame_dir)
    frames = sorted(frame_dir.glob("*.png"))
    if not frames:
        print(f"error: no PNG frames in {frame_dir}", file=sys.stderr)
        return 2

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    trimmed = []          # (PIL image, record dict)
    sheet_w = 0
    sheet_h = 0
    for i, fpath in enumerate(frames):
        img = Image.open(fpath)
        img.load()
        try:
            bbox = content_bbox(img, args.key)
        except ValueError:
            print(f"error: {fpath.name} has no content under the trim rule", file=sys.stderr)
            return 2
        crop = img.crop(bbox)
        rec = {
            "index": i,
            "source_file": fpath.name,
            "file": f"{args.name}-f{i:03d}.png",
            "sheet": {"x": sheet_w, "y": 0, "w": crop.size[0], "h": crop.size[1]},
            "source_size": {"w": img.size[0], "h": img.size[1]},
            "trim_offset": {"x": bbox[0], "y": bbox[1]},
        }
        trimmed.append((crop, rec))
        sheet_w += crop.size[0]
        sheet_h = max(sheet_h, crop.size[1])

    sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
    for crop, rec in trimmed:
        crop.save(out_dir / rec["file"])
        sheet.paste(crop.convert("RGBA"), (rec["sheet"]["x"], rec["sheet"]["y"]),
                    crop.convert("RGBA"))
    sheet_path = out_dir / f"{args.name}-sheet.png"
    sheet.save(sheet_path)

    atlas = {
        "schema": "mochiichao-show/sprite-atlas/v1",
        "name": args.name,
        "sheet": sheet_path.name,
        "sheet_size": {"w": sheet_w, "h": sheet_h},
        "frame_count": len(trimmed),
        "frames": [rec for _, rec in trimmed],
        "notes": ("trim_offset is where the trimmed frame's top-left corner sat on the "
                  "original canvas; an engine restoring original placement draws the "
                  "sheet rect at (trim_offset.x, trim_offset.y) on a source_size canvas."),
    }
    atlas_path = out_dir / f"{args.name}-atlas.json"
    atlas_path.write_text(json.dumps(atlas, indent=1, sort_keys=True) + "\n")

    print(f"frames: {len(trimmed)}  sheet: {sheet_w}x{sheet_h}  -> {sheet_path}")
    print(f"atlas: {atlas_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
