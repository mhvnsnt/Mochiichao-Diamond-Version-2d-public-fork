#!/usr/bin/env python3
"""FINAL show sheet: smooth (left) vs final pixel cell (right) per creature.
Final pixel cell = shadowfree file when one exists, else the draft cell.
Also writes a shadow-zoom sheet for the 3 shadow creatures: draft bottom
strip vs shadowfree bottom strip at 8x NEAREST."""
import json, os
from PIL import Image, ImageDraw

BASE = "/home/hatch/workspace/mochiichao-work/sprite-art"
PIX = os.path.join(BASE, "animation/expanded-scope/trueback-pixel-20261026")
DARK = (24, 28, 40, 255)
CELLS = ["reaperdile", "chromejaww", "strikechamp", "stormtalon", "duskfiend",
         "finblade", "mechapion", "wispkin", "shellguard", "razorgater"]
S = 256
rep = json.load(open(os.path.join(PIX, "pixel-conversion-report-20261026.json")))
try:
    shrep = json.load(open(os.path.join(PIX, "shadow-pass-report-20261026.json")))
except FileNotFoundError:
    shrep = {}

sheet = Image.new("RGBA", (S * 2 + 180, S * len(CELLS) + 40), DARK)
d = ImageDraw.Draw(sheet)
d.text((6, 6), "TRUE-BACK PIXEL FINAL — smooth (left) vs 64px pixel (right), 256px tiles", fill=(255, 255, 0, 255))
for i, c in enumerate(CELLS):
    y = 40 + i * S
    d.text((6, y + 120), c, fill=(255, 255, 255, 255))
    srcp = os.path.join(BASE, rep[c]["source"])
    im = Image.open(srcp).convert("RGB")
    x0, y0, x1, y1 = rep[c]["source_bbox"]
    sm = im.crop((x0, y0, x1 + 1, y1 + 1))
    sm.thumbnail((S, S), Image.LANCZOS)
    bg = Image.new("RGBA", (S, S), DARK)
    bg.paste(sm, ((S - sm.size[0]) // 2, (S - sm.size[1]) // 2))
    sheet.alpha_composite(bg, (180, y))
    fn = shrep.get(c, {}).get("file", rep[c]["file"])
    px = Image.open(os.path.join(PIX, "cells", fn)).convert("RGBA").resize((S, S), Image.NEAREST)
    bg2 = Image.new("RGBA", (S, S), DARK)
    bg2.alpha_composite(px)
    sheet.alpha_composite(bg2, (180 + S, y))
sheet.save(os.path.join(PIX, "pixel-final-sheet-20261026.png"))
print("final sheet saved")

# shadow zooms: bottom 16 rows of draft vs shadowfree, 8x
zoom = Image.new("RGBA", (64 * 8 * 2 + 180, 16 * 8 * 3 + 40), DARK)
dz = ImageDraw.Draw(zoom)
dz.text((6, 6), "SHADOW ZOOM — draft bottom 16 rows (left) vs shadowfree (right), 8x", fill=(255, 255, 0, 255))
for i, c in enumerate(("reaperdile", "chromejaww", "razorgater")):
    y = 40 + i * 16 * 8
    dz.text((6, y + 50), c, fill=(255, 255, 255, 255))
    for j, fn in enumerate((rep[c]["file"], shrep[c]["file"])):
        cell = Image.open(os.path.join(PIX, "cells", fn)).convert("RGBA").crop((0, 48, 64, 64))
        cell = cell.resize((64 * 8, 16 * 8), Image.NEAREST)
        bgz = Image.new("RGBA", (64 * 8, 16 * 8), DARK)
        bgz.alpha_composite(cell)
        zoom.alpha_composite(bgz, (180 + j * 64 * 8, y))
zoom.save(os.path.join(PIX, "pixel-shadow-zoom-20261026.png"))
print("shadow zoom saved")
