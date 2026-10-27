#!/usr/bin/env python3
"""Pack title pose PNGs into atlas sheets + JSON manifest (staging -> repo tools/).
Deterministic row packing, no scaling, no art change. Atlas cells keep
original filenames so the game can map cell -> pose.
Usage: title_atlas.py <frames_dir> <out_png> <out_json> [max_width]
"""
import json, os, sys
from PIL import Image
def main():
    src, out_png, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
    max_w = int(sys.argv[4]) if len(sys.argv) > 4 else 2048
    files = sorted(f for f in os.listdir(src) if f.endswith(".png"))
    cells, x, y, row_h = [], 0, 0, 0
    imgs = []
    for f in files:
        im = Image.open(os.path.join(src, f)).convert("RGBA"); imgs.append((f, im))
        if x + im.width > max_w: x, y, row_h = 0, y + row_h, 0
        cells.append({"file": f, "x": x, "y": y, "w": im.width, "h": im.height}); x += im.width; row_h = max(row_h, im.height)
    atlas = Image.new("RGBA", (max_w, y + row_h), (0, 0, 0, 0))
    for (f, im), c in zip(imgs, cells): atlas.paste(im, (c["x"], c["y"]))
    atlas.save(out_png)
    json.dump({"atlas": os.path.basename(out_png), "width": atlas.width, "height": atlas.height, "cells": cells}, open(out_json, "w"), indent=2)
    print(f"{len(cells)} cells -> {out_png} {atlas.width}x{atlas.height} {os.path.getsize(out_png)} bytes")
if __name__ == "__main__": main()
