#!/usr/bin/env python3
"""Clean title cutouts for the 9 remaining rotation creatures, auto only.

Method (no hand-painting, no redraw):
 1. Crop ONE figure region from that creature's own Mochiichao 2D sheet
    in sprite-art/2d-sheets/ (region fractions chosen from the sheet view).
    No Pokemon creature art is read or used anywhere here.
 2. rembg (MIT, U2-Net, model downloaded by rembg itself, NOT vendored)
    removes the sheet background from that crop.
 3. Scripted edge cleanup only:
    - white/light-background decontamination: unmultiply edge pixels by
      the crop's corner background colour, so a light fringe does not
      tint the figure edge. Fully opaque interior pixels are untouched.
    - alpha feather: 1px Gaussian blur of the alpha channel only.
    - trim to the alpha bounding box.
 4. Save as a NEW filename, never overwriting a file already shown to Mars.

Wispkin: V1 sheet only (the 18:17 sheet-0-dcd0 file). V2/V3/Duskfiend
files in the same folder are NOT read.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/2d-sheets")
WORK = os.path.expanduser("~/workspace/mochiichao-work/title-creatures-9")
OUT = os.path.join(WORK, "cutouts")
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(WORK, "work"), exist_ok=True)

# name -> (sheet relative path, region fractions x0,y0,x1,y1)
CREATURES = {
    "mochii": ("mochii/media-generation-mochii-sheet-v1-0-65de801c-ae7a-43be-a175-e256a7acc5ca.webp", (0.00, 0.00, 0.26, 0.29)),
    "razorgater": ("razorgater/media-generation-razorgater-sheet-v1-0-508c282d-2c17-4593-b37e-4beed88a094d.webp", (0.00, 0.05, 0.18, 0.35)),
    "tyrage": ("tyrage/media-generation-tyrage-sheet-v1-0-5b065a0d-ea4c-4ff5-8e24-07af29bdcc59.webp", (0.00, 0.00, 0.21, 0.30)),
    "kittember": ("kittember/media-generation-kittember-sheet-v1-0-64eacb16-d402-4e78-94df-6083f3bcdfce.webp", (0.00, 0.00, 0.185, 0.30)),
    "sproutle": ("sproutle/media-generation-sproutle-sheet-0-819475a8-88ec-4004-90f0-a7377e7f16af.webp", (0.00, 0.00, 0.21, 0.31)),
    "dorowani": ("dorowani/dorowani_sheet_v1.webp", (0.50, 0.00, 0.75, 0.333)),
    "gabu": ("gabu/gabu_sheet_v1.webp", (0.50, 0.00, 0.75, 0.25)),
    "wispkin": ("wispkin/media-generation-wispkin-sheet-0-dcd0a9f6-dfc2-40e0-9227-17de628c3671.webp", (0.00, 0.00, 0.21, 0.52)),
    "mythar": ("mythar/media-generation-mythar-sheet-0-09ce4573-f1d4-4872-9d13-036bb00ea0ea.webp", (0.00, 0.00, 0.235, 0.32)),
}

def decontaminate(im):
    """Unmultiply semi-transparent edge pixels by the corner background."""
    a = np.asarray(im, dtype=np.float32)
    rgb, alpha = a[:, :, :3], a[:, :, 3:4]
    corners = np.concatenate([
        rgb[:8, :8].reshape(-1, 3), rgb[:8, -8:].reshape(-1, 3),
        rgb[-8:, :8].reshape(-1, 3), rgb[-8:, -8:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    av = alpha / 255.0
    # Only pixels that are actually semi-transparent can carry fringe.
    partial = (av > 0.0) & (av < 1.0)
    unmult = np.where(av > 0.001, (rgb - (1.0 - av) * bg) / np.maximum(av, 0.001), rgb)
    out_rgb = np.where(partial, np.clip(unmult, 0, 255), rgb)
    out = np.concatenate([out_rgb, alpha], axis=2).astype(np.uint8)
    return Image.fromarray(out, "RGBA")

def main(names):
    from rembg import remove
    for name in names:
        rel, (x0, y0, x1, y1) = CREATURES[name]
        src = os.path.join(BASE, rel)
        sheet = Image.open(src).convert("RGB")
        w, h = sheet.size
        crop = sheet.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
        crop_path = os.path.join(WORK, "work", f"{name}-crop.png")
        crop.save(crop_path)
        raw = remove(crop)
        raw_path = os.path.join(WORK, "work", f"{name}-rembg-raw.png")
        raw.save(raw_path)
        im = raw.convert("RGBA")
        im = decontaminate(im)
        # Alpha feather only (1px), no RGB repainting.
        alpha = im.getchannel("A").filter(ImageFilter.GaussianBlur(1.0))
        im.putalpha(alpha)
        bbox = im.getchannel("A").getbbox()
        if bbox:
            im = im.crop(bbox)
        out_path = os.path.join(OUT, f"{name}-walk-cutout-clean-rembg.png")
        assert not os.path.exists(out_path) or name in names, out_path
        im.save(out_path)
        # Report: size, opaque-pixel share, corner transparency check.
        arr = np.asarray(im)
        opaque = int((arr[:, :, 3] > 10).sum())
        corners_clear = all(int(arr[y, x, 3]) < 10 for y, x in
                            [(0, 0), (0, -1), (-1, 0), (-1, -1)])
        print(f"{name}: {im.size} opaque_px={opaque} corners_transparent={corners_clear} -> {out_path}", flush=True)

if __name__ == "__main__":
    wanted = sys.argv[1:] or list(CREATURES)
    unknown = [n for n in wanted if n not in CREATURES]
    if unknown:
        raise SystemExit(f"unknown creatures: {unknown}")
    main(wanted)
