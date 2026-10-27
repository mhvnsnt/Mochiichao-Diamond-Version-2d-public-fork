#!/usr/bin/env python3
"""Finalize BiRefNet title cutouts: auto edge cleanup only, no hand-painting.
- Decontaminate semi-transparent edge pixels by the crop corner background
  (median of 8x8 corners), fully opaque interior pixels untouched.
- 1px Gaussian blur of alpha channel only.
- Trim to alpha bbox.
- Save as NEW dated filename 20261026-v1, refusing to overwrite.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

BASE = os.path.expanduser("~/workspace/mochiichao-work/title-biref-20261026")
RAW = os.path.join(BASE, "raw")
FINAL = os.path.join(BASE, "final")
os.makedirs(FINAL, exist_ok=True)

def decontaminate(im):
    a = np.asarray(im, dtype=np.float32)
    rgb, alpha = a[:, :, :3], a[:, :, 3:4]
    corners = np.concatenate([
        rgb[:8, :8].reshape(-1, 3), rgb[:8, -8:].reshape(-1, 3),
        rgb[-8:, :8].reshape(-1, 3), rgb[-8:, -8:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    av = alpha / 255.0
    partial = (av > 0.0) & (av < 1.0)
    unmult = np.where(av > 0.001, (rgb - (1.0 - av) * bg) / np.maximum(av, 0.001), rgb)
    out_rgb = np.where(partial, np.clip(unmult, 0, 255), rgb)
    return Image.fromarray(np.concatenate([out_rgb, alpha], axis=2).astype(np.uint8), "RGBA")

def main(names):
    for name in names:
        raw_path = os.path.join(RAW, f"{name}-crop.png")
        if not os.path.exists(raw_path):
            print(f"SKIP missing raw: {name}")
            continue
        im = Image.open(raw_path).convert("RGBA")
        im = decontaminate(im)
        im.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(1.0)))
        bbox = im.getchannel("A").getbbox()
        if bbox:
            im = im.crop(bbox)
        out_path = os.path.join(FINAL, f"{name}-title-cutout-20261026-v1.png")
        if os.path.exists(out_path):
            raise SystemExit(f"REFUSING to overwrite existing {out_path}")
        im.save(out_path)
        arr = np.asarray(im)
        opaque = int((arr[:, :, 3] > 10).sum())
        corners = all(int(arr[y, x, 3]) < 10 for y, x in [(0, 0), (0, -1), (-1, 0), (-1, -1)])
        import hashlib
        sha = hashlib.sha256(open(out_path, "rb").read()).hexdigest()
        print(f"{name}: {im.size} bytes={os.path.getsize(out_path)} opaque_px={opaque} corners_transparent={corners} sha256={sha[:16]}... -> {out_path}", flush=True)

if __name__ == "__main__":
    main(sys.argv[1:] or ["wispkin", "tyrage", "kittember", "sproutle", "dorowani", "gabu", "mythar"])
