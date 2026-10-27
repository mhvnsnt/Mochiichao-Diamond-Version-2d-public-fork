#!/usr/bin/env python3
"""Render each final cutout on solid black (to expose baked shadows / halos)
and on white, side by side, for eye-checking. No edits to the finals."""
import os
from PIL import Image

BASE = os.path.expanduser("~/workspace/mochiichao-work/title-biref-20261026")
FINAL = os.path.join(BASE, "final")
OUT = os.path.join(BASE, "check")
os.makedirs(OUT, exist_ok=True)

for fn in sorted(os.listdir(FINAL)):
    if not fn.endswith(".png"):
        continue
    im = Image.open(os.path.join(FINAL, fn)).convert("RGBA")
    black = Image.new("RGBA", im.size, (0, 0, 0, 255))
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    comp = Image.new("RGBA", (im.size[0] * 2 + 10, im.size[1]), (128, 128, 128, 255))
    comp.alpha_composite(black, (0, 0))
    comp.alpha_composite(im, (0, 0))
    comp.alpha_composite(white, (im.size[0] + 10, 0))
    comp.alpha_composite(im, (im.size[0] + 10, 0))
    comp.convert("RGB").save(os.path.join(OUT, fn.replace(".png", "-check.png")))
    print(fn, im.size)
print("done")
