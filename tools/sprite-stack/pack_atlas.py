#!/usr/bin/env python3
"""Atlas packer for Mochiichao 2D sprite cells — original project script.

Packs a directory of PNG cells into one atlas PNG plus a JSON manifest
of frame positions, in the same frame style the game already eats
(atlas_x / atlas_y / width / height per frame).

This is the project's own packer, written for this repo (Pillow only).
It is NOT FreeTexturePacker code. FreeTexturePacker (odrick/free-tex-packer,
MIT) is the GUI equivalent for artists who want a visual packer — see
README.md — but it is an Electron app, so it is an install note, not a
vendored binary, and this script is the wired CLI packer the pipeline
actually runs.

Packing: deterministic shelf packing, sorted by filename. Cells are
NOT rotated (rotation would break facing/view orientation) and are NOT
rescaled. Optional --trim trims fully-transparent borders per cell and
records the trimmed box in the manifest, so the game can restore the
original 64x64 placement; without --trim, frames keep their full cell
size and positions are a plain grid walk.

Usage:
  python3 pack_atlas.py --cells <dir> --out-atlas <png> --out-manifest <json>
      [--cols 6] [--padding 0] [--trim] [--force]
  Cell files: *.png in --cells (sorted). A sibling <stem>.manifest.json
  is used, when present, to carry role/kind/view into the packed
  manifest; otherwise frame names come from filenames.
Refuses to overwrite outputs unless --force is given.
"""

import argparse
import json
import os
import sys

from PIL import Image


def load_manifest(cells_dir, manifest_path=None):
    """Return (manifest_or_None, frames_by_file)."""
    if manifest_path:
        try:
            with open(manifest_path) as fh:
                man = json.load(fh)
        except Exception:
            return None, {}
        by_file = {}
        for fr in man.get("frames", []):
            for key in ("file64", "file"):
                if fr.get(key):
                    by_file[fr[key]] = fr
        return man, by_file
    for fn in sorted(os.listdir(cells_dir)):
        if fn.endswith(".manifest.json") and not fn.endswith("-clean.json"):
            try:
                with open(os.path.join(cells_dir, fn)) as fh:
                    man = json.load(fh)
            except Exception:
                return None, {}
            by_file = {}
            for fr in man.get("frames", []):
                for key in ("file64", "file"):
                    if fr.get(key):
                        by_file[fr[key]] = fr
            return man, by_file
    return None, {}


def trim_box(im):
    """Bounding box of non-transparent pixels, or None if fully empty."""
    alpha = im.getchannel("A")
    return alpha.getbbox()


def pack_cells(cells_dir, out_atlas, out_manifest, cols=6, padding=0,
               trim=False, force=False, manifest_path=None):
    if not force and (os.path.exists(out_atlas) or os.path.exists(out_manifest)):
        raise SystemExit("outputs already exist, re-run with --force: "
                         f"{out_atlas}, {out_manifest}")
    files = sorted(f for f in os.listdir(cells_dir)
                   if f.lower().endswith(".png"))
    if not files:
        raise SystemExit(f"no PNG cells in {cells_dir}")
    man, by_file = load_manifest(cells_dir, manifest_path)
    cells = []
    for fn in files:
        im = Image.open(os.path.join(cells_dir, fn)).convert("RGBA")
        box = trim_box(im) if trim else None
        if box is None:
            # Fully transparent cell: keep a 1x1 placeholder so the
            # frame still exists in the manifest.
            box = (0, 0, 1, 1) if trim else (0, 0, im.size[0], im.size[1])
        crop = im.crop(box)
        cells.append({"file": fn, "image": crop, "box": box,
                      "full": im.size, "src": by_file.get(fn, {})})
    # Shelf packing: rows of up to `cols` cells, row height = tallest
    # cell in the row. Deterministic: input order is sorted filenames.
    rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
    row_heights = [max(c["image"].size[1] for c in row) for row in rows]
    row_widths = [sum(c["image"].size[0] for c in row)
                  + padding * (len(row) - 1) for row in rows]
    width = max(row_widths)
    height = sum(row_heights) + padding * (len(rows) - 1)
    atlas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    frames = []
    y = 0
    for row, rh in zip(rows, row_heights):
        x = 0
        for idx, c in enumerate(row):
            w, h = c["image"].size
            atlas.paste(c["image"], (x, y), c["image"])
            src = c["src"]
            frames.append({
                "cell": len(frames),
                "role": src.get("role", os.path.splitext(c["file"])[0]),
                "kind": src.get("kind", ""),
                "view": src.get("view", ""),
                "name": src.get("name", os.path.splitext(c["file"])[0]),
                "file": c["file"],
                "atlas_x": x, "atlas_y": y, "x": x, "y": y,
                "width": w, "height": h, "w": w, "h": h,
                "trimmed": bool(trim),
                "trim_box": list(c["box"]) if trim else None,
                "full_size": list(c["full"]),
            })
            x += w + padding
        y += rh + padding
    atlas.save(out_atlas)
    out = {
        "tool": "tools/sprite-stack/pack_atlas.py (Pillow, original project script)",
        "atlas_file": os.path.basename(out_atlas),
        "atlas_size": {"width": width, "height": height},
        "cols": cols, "padding": padding, "trim": trim,
        "frame_count": len(frames),
        "source_manifest": (man.get("atlas_file") if man else None),
        "frames": frames,
    }
    with open(out_manifest, "w") as fh:
        json.dump(out, fh, indent=1)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cells", required=True)
    ap.add_argument("--out-atlas", required=True)
    ap.add_argument("--out-manifest", required=True)
    ap.add_argument("--cols", type=int, default=6)
    ap.add_argument("--padding", type=int, default=0)
    ap.add_argument("--trim", action="store_true")
    ap.add_argument("--manifest", default=None,
                    help="manifest whose role/kind/view carry into frames")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    out = pack_cells(args.cells, args.out_atlas, args.out_manifest,
                     cols=args.cols, padding=args.padding,
                     trim=args.trim, force=args.force,
                     manifest_path=args.manifest)
    print(json.dumps({"atlas": args.out_atlas, "manifest": args.out_manifest,
                      "frames": out["frame_count"],
                      "size": out["atlas_size"]}))


if __name__ == "__main__":
    main()
