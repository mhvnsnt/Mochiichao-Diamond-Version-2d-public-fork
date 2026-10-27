#!/usr/bin/env python3
"""Fix3: paste-over limb moves (NO clearing, so no channels/notches through the
body -- a limb gets slightly thicker, never cut) + Razorgater mouth by BAND
COMPRESS (the mouth cavity shrinks vertically, chin rises, instead of filling
the cavity grey which still read as an open mouth in video)."""
import numpy as np
from PIL import Image
from scipy.ndimage import label


def load(c):
    return Image.open(f"/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title/{c}-walk-cutout.png").convert("RGBA")


FRAMES = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"


def paste_over(im, box, dx, dy):
    W, H = im.size
    x0, y0, x1, y1 = (int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))
    region = im.crop((x0, y0, x1, y1))
    out = im.copy()
    out.paste(region, (x0 + dx, y0 + dy), region)
    return out


def band_compress_mouth(im, frac):
    """Compress the mouth band vertically by frac; fill below with neck colour."""
    arr = np.array(im)
    a = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(int)
    dark = (a > 20) & (rgb.sum(axis=2) < 240)
    H, W = a.shape
    region = np.zeros_like(dark)
    region[int(H * 0.38):int(H * 0.82), int(W * 0.18):int(W * 0.82)] = True
    lab, n = label(dark & region)
    sizes = [(lab == i).sum() for i in range(1, n + 1)]
    mouth = lab == (int(np.argmax(sizes)) + 1)
    ys, xs = np.where(mouth)
    y_top, y_bot = int(ys.min()) - 3, int(ys.max()) + 3
    x_left, x_right = int(xs.min()), int(xs.max())
    band = im.crop((0, y_top, W, y_bot))
    new_h = max(4, int((y_bot - y_top) * frac))
    band2 = band.resize((W, new_h), Image.LANCZOS)
    # neck colour: median opaque colour in a strip below the original mouth
    strip = arr[y_bot + 5:y_bot + 30, x_left:x_right]
    mask = strip[:, :, 3] > 20
    neck = np.median(strip[:, :, :3][mask], axis=0).astype(np.uint8) if mask.any() else np.array([180, 180, 180], dtype=np.uint8)
    out = im.copy()
    # fill the whole old band area with neck colour first, then paste compressed band on top
    from PIL import ImageDraw
    d = ImageDraw.Draw(out)
    d.rectangle([0, y_top, W, y_bot], fill=(int(neck[0]), int(neck[1]), int(neck[2]), 255))
    out.paste(band2, (0, y_top), band2)
    return out


# Dorowani swim: paste-over arms/hands (no clearing)
im = load("dorowani")
tmp = paste_over(im, (0.02, 0.55, 0.24, 0.97), 14, 0)
tmp = paste_over(tmp, (0.76, 0.55, 0.98, 0.97), -14, 0)
tmp = paste_over(tmp, (0.20, 0.82, 0.46, 1.00), 0, -12)
tmp.save(f"{FRAMES}/dorowani-pose-swim-together.png")
print("dorowani swim-together paste-over")
tmp = paste_over(im, (0.02, 0.55, 0.24, 0.97), -14, 0)
tmp = paste_over(tmp, (0.76, 0.55, 0.98, 0.97), 14, 0)
tmp = paste_over(tmp, (0.54, 0.82, 0.80, 1.00), 0, -12)
tmp.save(f"{FRAMES}/dorowani-pose-swim-apart.png")
print("dorowani swim-apart paste-over")

# Gabu arms-up / leaf-throw: paste-over forearms
im = load("gabu")
tmp = paste_over(im, (0.02, 0.60, 0.24, 0.88), -2, -14)
tmp = paste_over(tmp, (0.76, 0.60, 0.98, 0.88), 2, -14)
tmp.save(f"{FRAMES}/gabu-pose-arms-up.png")
print("gabu arms-up paste-over")
paste_over(im, (0.76, 0.60, 0.98, 0.88), 16, -6).save(f"{FRAMES}/gabu-pose-leaf-throw.png")
print("gabu leaf-throw paste-over")

# Sproutle wave: paste-over forearm
im = load("sproutle")
paste_over(im, (0.72, 0.62, 0.98, 0.88), 2, -14).save(f"{FRAMES}/sproutle-pose-wave.png")
print("sproutle wave paste-over")

# Mythar wings: paste-over translate (root stays covered by original wing)
im = load("mythar")
tmp = paste_over(im, (0.00, 0.00, 0.36, 0.85), -4, -16)
tmp = paste_over(tmp, (0.64, 0.00, 1.00, 0.85), 4, -16)
tmp.save(f"{FRAMES}/mythar-pose-wings-up.png")
print("mythar wings-up paste-over")
tmp = paste_over(im, (0.00, 0.00, 0.36, 0.85), -4, 14)
tmp = paste_over(tmp, (0.64, 0.00, 1.00, 0.85), 4, 14)
tmp.save(f"{FRAMES}/mythar-pose-wings-down.png")
print("mythar wings-down paste-over")

# Razorgater mouth: band compress (closed 18%, half 55%)
im = load("razorgater")
band_compress_mouth(im, 0.18).save(f"{FRAMES}/razorgater-pose-mouth-closed.png")
print("razorgater mouth-closed band-compress")
band_compress_mouth(im, 0.55).save(f"{FRAMES}/razorgater-pose-mouth-half.png")
print("razorgater mouth-half band-compress")
