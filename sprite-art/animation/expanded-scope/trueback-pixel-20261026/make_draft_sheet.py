#!/usr/bin/env python3
"""Draft before/after sheet: smooth crop vs 64px pixel cell, per creature."""
import json, os
from PIL import Image, ImageDraw

BASE = "/home/hatch/workspace/mochiichao-work/sprite-art"
PIX = os.path.join(BASE, "animation/expanded-scope/trueback-pixel-20261026")
DARK = (24, 28, 40, 255)
CELLS = ["reaperdile", "chromejaww", "strikechamp", "stormtalon", "duskfiend",
         "finblade", "mechapion", "wispkin", "shellguard", "razorgater"]
S = 256
rep = json.load(open(os.path.join(PIX, "pixel-conversion-report-20261026.json")))
sheet = Image.new("RGBA", (S * 2 + 180, S * len(CELLS) + 40), DARK)
d = ImageDraw.Draw(sheet)
d.text((6, 6), "TRUE-BACK PIXEL DRAFT — smooth (left) vs 64px pixel (right), 256px tiles", fill=(255, 255, 0, 255))
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
    px = Image.open(os.path.join(PIX, "cells", rep[c]["file"])).convert("RGBA").resize((S, S), Image.NEAREST)
    bg2 = Image.new("RGBA", (S, S), DARK)
    bg2.alpha_composite(px)
    sheet.alpha_composite(bg2, (180 + S, y))
sheet.save(os.path.join(PIX, "scratch/pixel-draft-sheet.png"))
print("draft sheet saved")
