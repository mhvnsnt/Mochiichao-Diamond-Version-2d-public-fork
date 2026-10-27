#!/usr/bin/env python3
"""Cut characters from their existing sheets — no hand-guessing, no generation.

Open source: Pillow (PIL) only. Method: crop the front cell from the
2D sheet in sprite-art/2d-sheets/<creature>/, then flood-fill from the
border (colour distance to the sheet background, threshold 60) so the
sheet background AND its graph-paper grid lines are removed, while the
creature inside its dark outline is preserved. Transparent PNG out.
Dorowani/Gabu also have already-transparent Blender bake frames in
sprites-bake/sheets/<creature>/*_64.png — those are copied as-is, not redrawn.
Outputs: ui-art/cutouts/*-cut.png (transparent) + cutout-title/menu/battle.png
composites built ONLY from those cutouts + navy/teal/gold UI panels.
"""
import os, math, collections
from PIL import Image, ImageDraw, ImageFont
BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/2d-sheets")
OUT = os.path.expanduser("~/workspace/mochiichao-work/ui-art/cutouts")
os.makedirs(OUT, exist_ok=True)

def cut_flood(name, rel, cols, rows, cx, cy, thresh=60):
    im = Image.open(os.path.join(BASE, rel)).convert("RGB")
    w, h = im.size; cw, ch = w // cols, h // rows
    ix, iy = int(cw * 0.02), int(ch * 0.02)
    cell = im.crop((cx * cw + ix, cy * ch + iy, (cx + 1) * cw - ix, (cy + 1) * ch - iy)).convert("RGBA")
    W, H = cell.size; px = cell.load()
    bg_cols = [px[x, y][:3] for x in range(10) for y in range(10)]
    bg = tuple(sum(c[i] for c in bg_cols) // len(bg_cols) for i in range(3))
    def dist(p):
        return math.sqrt((p[0] - bg[0]) ** 2 + (p[1] - bg[1]) ** 2 + (p[2] - bg[2]) ** 2)
    seen = bytearray(W * H); dq = collections.deque()
    for x in range(W):
        dq.append((x, 0)); dq.append((x, H - 1))
    for y in range(H):
        dq.append((0, y)); dq.append((W - 1, y))
    while dq:
        x, y = dq.popleft(); i = y * W + x
        if seen[i]:
            continue
        seen[i] = 1
        if dist(px[x, y][:3]) > thresh:
            continue
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and not seen[ny * W + nx]:
                dq.append((nx, ny))
    bbox = cell.getchannel("A").getbbox()
    if bbox:
        cell = cell.crop(bbox)
    p = os.path.join(OUT, f"{name}-cut.png"); cell.save(p); print(name, p, cell.size)
    return p

if __name__ == "__main__":
    cut_flood("mochii-front", "mochii/media-generation-mochii-sheet-v1-0-65de801c-ae7a-43be-a175-e256a7acc5ca.webp", 4, 4, 0, 0)
    cut_flood("dorowani-front-2d", "dorowani/dorowani_sheet_v1.webp", 4, 3, 2, 0)
    cut_flood("gabu-front-2d", "gabu/gabu_sheet_v1.webp", 4, 4, 2, 0)
