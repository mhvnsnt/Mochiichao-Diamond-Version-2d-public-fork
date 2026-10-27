#!/usr/bin/env python3
"""Final pose fixes: move FOREARM/HAND/Tail-tip only (boxes that do not overlap
the torso), so no torso-edge strips are created. Tail wag uses pivot rotation
around the tail attach point, so the stem stays attached."""
import numpy as np
from PIL import Image


def load(c):
    return Image.open(f"/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title/{c}-walk-cutout.png").convert("RGBA")


FRAMES = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"


def heal(new, orig):
    from scipy.ndimage import convolve
    na = np.array(new)
    oa = np.array(orig.split()[3])
    mask_new = na[:, :, 3] > 20
    hole = (oa > 20) & (~mask_new)
    cnt = convolve(mask_new.astype(np.int32), np.ones((3, 3), dtype=np.int32), mode="constant") - mask_new.astype(np.int32)
    fill = hole & (cnt >= 5)
    if fill.any():
        for _ in range(3):
            for ch in range(3):
                vals = na[:, :, ch].astype(np.float32)
                s = convolve(np.where(mask_new, vals, 0), np.ones((3, 3)), mode="constant")
                cc = convolve(mask_new.astype(np.float32), np.ones((3, 3)), mode="constant")
                mean = np.divide(s, cc, out=np.zeros_like(s), where=cc > 0)
                na[:, :, ch] = np.where(fill, mean.astype(np.uint8), na[:, :, ch])
            na[:, :, 3] = np.where(fill, 255, na[:, :, 3])
            mask_new = na[:, :, 3] > 20
    return Image.fromarray(na, "RGBA")


def move_t(im, box, dx, dy):
    W, H = im.size
    x0, y0, x1, y1 = (int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))
    region = im.crop((x0, y0, x1, y1))
    base = im.copy()
    ra = np.array(region.split()[3])
    ba = np.array(base.split()[3])
    sub = ba[y0:y1, x0:x1]
    sub[ra > 20] = 0
    ba[y0:y1, x0:x1] = sub
    base.putalpha(Image.fromarray(ba))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(base, (0, 0), base)
    out.paste(region, (x0 + dx, y0 + dy), region)
    return heal(out, im)


def pivot_rotate(im, box, pivot_rel, deg):
    """Rotate only the region in box around pivot_rel (fractions of full image),
    using a padded canvas so rotation is about the pivot, not the box centre."""
    W, H = im.size
    x0, y0, x1, y1 = (int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))
    px, py = int(pivot_rel[0] * W), int(pivot_rel[1] * H)
    region = im.crop((x0, y0, x1, y1))
    # clear region in base
    base = im.copy()
    ra = np.array(region.split()[3])
    ba = np.array(base.split()[3])
    sub = ba[y0:y1, x0:x1]
    sub[ra > 20] = 0
    ba[y0:y1, x0:x1] = sub
    base.putalpha(Image.fromarray(ba))
    # padded canvas: place region so pivot is at canvas centre, rotate, crop back
    pad = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0))
    pad.paste(region, (W + x0 - px, H + y0 - py), region)
    rot = pad.rotate(deg, resample=Image.BICUBIC, center=(W, H))
    moved = rot.crop((W - (px - x0) - 0, H - (py - y0), W - (px - x0) + (x1 - x0), H - (py - y0) + (y1 - y0)))
    # The crop above is size of region but positioned at rotated location: instead
    # paste the whole rotated pad back offset so pivot aligns, then crop to image.
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(base, (0, 0), base)
    full = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0))
    full.paste(region, (W + x0 - px, H + y0 - py), region)
    full = full.rotate(deg, resample=Image.BICUBIC, center=(W, H))
    cropped = full.crop((W, H, W + W, H + H))
    out.paste(cropped, (0, 0), cropped)
    return heal(out, im)


def squash(im, sy, sx=1.0):
    w, h = im.size
    a = np.array(im.split()[3])
    ys = np.where(a > 20)[0]
    fb = int(ys.max())
    nw, nh = max(1, int(w * sx)), max(1, int(h * sy))
    r = im.resize((nw, nh), Image.LANCZOS)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(r, ((w - nw) // 2, fb - (nh - 1)), r)
    return out


# Dorowani swim-together: hands only move inward + left leg kick
im = load("dorowani")
tmp = move_t(im, (0.03, 0.82, 0.20, 0.98), 12, -4)
tmp = move_t(tmp, (0.80, 0.82, 0.97, 0.98), -12, -4)
tmp = move_t(tmp, (0.20, 0.82, 0.46, 1.00), 0, -12)
tmp.save(f"{FRAMES}/dorowani-pose-swim-together.png")
print("dorowani swim-together v3")

# Gabu arms-up / leaf-throw: forearms only (below shell, y 0.60+)
im = load("gabu")
tmp = move_t(im, (0.02, 0.60, 0.24, 0.88), -2, -14)
tmp = move_t(tmp, (0.76, 0.60, 0.98, 0.88), 2, -14)
tmp.save(f"{FRAMES}/gabu-pose-arms-up.png")
print("gabu arms-up v3")
tmp = move_t(im, (0.76, 0.60, 0.98, 0.88), 16, -6)
tmp.save(f"{FRAMES}/gabu-pose-leaf-throw.png")
print("gabu leaf-throw v3")

# Sproutle wave: forearm only
im = load("sproutle")
move_t(im, (0.72, 0.62, 0.98, 0.88), 2, -14).save(f"{FRAMES}/sproutle-pose-wave.png")
print("sproutle wave v3")

# Tyrage impact: squash only (no arm moves)
im = load("tyrage")
squash(im, 0.88, 1.05).save(f"{FRAMES}/tyrage-pose-impact.png")
print("tyrage impact v3")

# Kittember tail-down: pivot rotation around tail attach (0.70, 0.62), tail box x 0.68+
im = load("kittember")
pivot_rotate(im, (0.68, 0.28, 1.00, 0.78), (0.70, 0.62), 22).save(f"{FRAMES}/kittember-pose-tail-down.png")
print("kittember tail-down v3")

# Mythar wings-up: narrower wing boxes that do not overlap the body
im = load("mythar")
tmp = move_t(im, (0.00, 0.00, 0.30, 0.85), -4, -16)
tmp = move_t(tmp, (0.70, 0.00, 1.00, 0.85), 4, -16)
tmp.save(f"{FRAMES}/mythar-pose-wings-up.png")
print("mythar wings-up v3")
