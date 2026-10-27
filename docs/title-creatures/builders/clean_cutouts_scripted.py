#!/usr/bin/env python3
"""Scripted (auto, no hand-painting, no rembg) title cutouts, v20261025.

This is the fast auto route that produced the Mars-confirmed Mochii
cutout and Yogiferno v2 (134x190): flood-fill the sheet background
from the crop border (same method as ui-art/cut_from_sheets.py,
threshold 60), then scripted white-fringe decontamination
(unmultiply edge pixels by the corner background) + 1px alpha feather,
then trim to the alpha bbox.

Why not rembg here: rembg's U2-Net model download is ~1.02 GB at
~700 kB/s on this machine (killed at 22% in another lane) — the
scripted pass is the auto route that actually finishes, and it is
the same pass Mars already confirmed good for Mochii.

Scope: the 8 creatures still owed after Mochii's confirmation.
Mochii and Yogiferno are NOT re-cut here. Wispkin uses its V1 sheet
only (sheet-0-dcd0); V2/V3/Duskfiend files are never read.
No Pokemon creature art is read or used.
Outputs use NEW dated filenames, never overwriting a shown file.
"""
import collections, math, os, sys
import numpy as np
from PIL import Image, ImageFilter

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/2d-sheets")
WORK = os.path.expanduser("~/workspace/mochiichao-work/title-creatures-9")
OUT = os.path.join(WORK, "cutouts")
os.makedirs(OUT, exist_ok=True)

CREATURES = {
    "razorgater": ("razorgater/media-generation-razorgater-sheet-v1-0-508c282d-2c17-4593-b37e-4beed88a094d.webp", (0.00, 0.05, 0.165, 0.35)),
    "tyrage": ("tyrage/media-generation-tyrage-sheet-v1-0-5b065a0d-ea4c-4ff5-8e24-07af29bdcc59.webp", (0.00, 0.00, 0.21, 0.275)),
    "kittember": ("kittember/media-generation-kittember-sheet-v1-0-64eacb16-d402-4e78-94df-6083f3bcdfce.webp", (0.00, 0.00, 0.185, 0.275)),
    "sproutle": ("sproutle/media-generation-sproutle-sheet-0-819475a8-88ec-4004-90f0-a7377e7f16af.webp", (0.00, 0.00, 0.21, 0.275)),
    "dorowani": ("dorowani/dorowani_sheet_v1.webp", (0.50, 0.00, 0.75, 0.333)),
    "gabu": ("gabu/gabu_sheet_v1.webp", (0.51, 0.01, 0.74, 0.24)),
    "wispkin": ("wispkin/media-generation-wispkin-sheet-0-dcd0a9f6-dfc2-40e0-9227-17de628c3671.webp", (0.00, 0.00, 0.21, 0.505)),
    "mythar": ("mythar/media-generation-mythar-sheet-0-09ce4573-f1d4-4872-9d13-036bb00ea0ea.webp", (0.00, 0.00, 0.235, 0.285)),
}

def flood_cut(crop, thresh=60):
    im = crop.convert("RGBA")
    W, H = im.size
    px = im.load()
    bg_cols = [px[x, y][:3] for x in range(10) for y in range(10)]
    bg = tuple(sum(c[i] for c in bg_cols) // len(bg_cols) for i in range(3))
    def dist(p):
        return math.sqrt((p[0] - bg[0]) ** 2 + (p[1] - bg[1]) ** 2 + (p[2] - bg[2]) ** 2)
    seen = bytearray(W * H)
    dq = collections.deque()
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
    return im, bg

def decontaminate(im, bg):
    a = np.asarray(im, dtype=np.float32)
    rgb, alpha = a[:, :, :3], a[:, :, 3:4]
    bgv = np.array(bg, dtype=np.float32)
    av = alpha / 255.0
    partial = (av > 0.0) & (av < 1.0)
    unmult = np.where(av > 0.001, (rgb - (1.0 - av) * bgv) / np.maximum(av, 0.001), rgb)
    out_rgb = np.where(partial, np.clip(unmult, 0, 255), rgb)
    return Image.fromarray(np.concatenate([out_rgb, alpha], axis=2).astype(np.uint8), "RGBA")

def main(names):
    for name in names:
        rel, (x0, y0, x1, y1) = CREATURES[name]
        sheet = Image.open(os.path.join(BASE, rel)).convert("RGB")
        w, h = sheet.size
        crop = sheet.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
        im, bg = flood_cut(crop)
        im = decontaminate(im, bg)
        im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(1.0)))
        bbox = im.getchannel("A").getbbox()
        if bbox:
            im = im.crop(bbox)
        out_path = os.path.join(OUT, f"{name}-title-cutout-20261025-v3.png")
        if os.path.exists(out_path):
            raise SystemExit(f"REFUSING to overwrite existing {out_path}")
        im.save(out_path)
        arr = np.asarray(im)
        opaque = int((arr[:, :, 3] > 10).sum())
        corners = all(int(arr[y, x, 3]) < 10 for y, x in [(0, 0), (0, -1), (-1, 0), (-1, -1)])
        print(f"{name}: {im.size} opaque_px={opaque} corners_transparent={corners} bg={bg} -> {out_path}", flush=True)

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(CREATURES)
    unknown = [n for n in wanted if n not in CREATURES]
    if unknown:
        raise SystemExit(f"unknown: {unknown}")
    main(wanted)
