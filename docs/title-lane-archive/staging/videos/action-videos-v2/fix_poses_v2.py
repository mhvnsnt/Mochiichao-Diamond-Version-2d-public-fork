#!/usr/bin/env python3
"""Fix pass for v2 poses that failed eye-check: box ROTATION around the centre
cut limbs into floating chunks. This pass uses TRANSLATION ONLY for limbs
(plus whole-body squash/tilt, which passed), colour-aware erasing where a limb
differs in colour from what it overlaps, and component-swap for Yogiferno feet.
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label
import sys
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2")
from build_poses_v2 import load, save, heal, squash, rotate, close_mouth

SRC = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"


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


def move_dark(im, box, dx, dy):
    """Move only dark pixels in box (Wispkin black hands over a white face)."""
    W, H = im.size
    x0, y0, x1, y1 = (int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))
    region = np.array(im.crop((x0, y0, x1, y1)))
    dark = (region[:, :, 3] > 20) & (region[:, :, :3].astype(int).sum(axis=2) < 200)
    hand = np.zeros_like(region)
    hand[dark] = region[dark]
    hand_img = Image.fromarray(hand, "RGBA")
    base = np.array(im)
    sub_a = base[y0:y1, x0:x1, 3]
    sub_a[dark] = 0
    base[y0:y1, x0:x1, 3] = sub_a
    base_img = Image.fromarray(base, "RGBA")
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(base_img, (0, 0), base_img)
    out.paste(hand_img, (x0 + dx, y0 + dy), hand_img)
    return heal(out, im)


def swap_feet(im, y0f, y1f):
    """Swap the two largest opaque components in a bottom band (Yogiferno feet)."""
    W, H = im.size
    y0, y1 = int(y0f * H), int(y1f * H)
    arr = np.array(im)
    band = arr[y0:y1, :, 3] > 20
    lab, n = label(band)
    comps = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if len(ys) >= 20:
            comps.append((len(ys), xs.mean(), i))
    comps.sort(reverse=True)
    if len(comps) < 2:
        print("swap_feet: fewer than 2 components", comps)
        return im
    left = min(comps[:2], key=lambda t: t[1])
    right = max(comps[:2], key=lambda t: t[1])
    shift = int(round(right[1] - left[1]))
    out = arr.copy()
    # clear both components in band
    for _, _, idx in (left, right):
        m = lab == idx
        out[y0:y1][m] = (0, 0, 0, 0)
    # paste left component shifted right, right shifted left
    for (size, cx, idx), s in ((left, shift), (right, -shift)):
        m = lab == idx
        ys, xs = np.where(m)
        for y, x in zip(ys, xs):
            nx = x + s
            if 0 <= nx < W:
                out[y0 + y, nx] = arr[y0 + y, x]
    return heal(Image.fromarray(out, "RGBA"), im)


def close_mouth_dark(im, frac):
    """Razorgater half: fill bottom of mouth blob with DARK (mouth interior),
    so the opening shrinks dark, instead of a light-grey mass."""
    from scipy.ndimage import label as _label
    arr = np.array(im)
    a = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(int)
    dark = (a > 20) & (rgb.sum(axis=2) < 240)
    H, W = a.shape
    region = np.zeros_like(dark)
    region[int(H * 0.38):int(H * 0.82), int(W * 0.18):int(W * 0.82)] = True
    lab, n = _label(dark & region)
    sizes = [(lab == i).sum() for i in range(1, n + 1)]
    mouth = lab == (int(np.argmax(sizes)) + 1)
    ys, xs = np.where(mouth)
    y_lo = ys.min() + int((ys.max() - ys.min()) * (1 - frac))
    out = arr.copy()
    fillmask = mouth.copy()
    fillmask[:y_lo, :] = False
    # fill with the jaw's own shadow grey: sample dark-grey pixels just outside mouth
    out[fillmask] = np.array([70, 70, 72, 255], dtype=np.uint8)
    return Image.fromarray(out, "RGBA")


# Yogiferno step-b: component swap of feet
im = load("yogiferno")
save(swap_feet(im, 0.78, 1.00), "yogiferno", "step-b")

# Dorowani swim, translation only
im = load("dorowani")
tmp = move_t(im, (0.02, 0.55, 0.24, 0.97), 14, 0)
tmp = move_t(tmp, (0.76, 0.55, 0.98, 0.97), -14, 0)
tmp = move_t(tmp, (0.20, 0.82, 0.46, 1.00), 0, -12)
save(tmp, "dorowani", "swim-together")
tmp = move_t(im, (0.02, 0.55, 0.24, 0.97), -14, 0)
tmp = move_t(tmp, (0.76, 0.55, 0.98, 0.97), 14, 0)
tmp = move_t(tmp, (0.54, 0.82, 0.80, 1.00), 0, -12)
save(tmp, "dorowani", "swim-apart")

# Razorgater half: dark fill
save(close_mouth_dark(load("razorgater"), 0.45), "razorgater", "mouth-half")

# Gabu arms, translation only
im = load("gabu")
tmp = move_t(im, (0.02, 0.45, 0.24, 0.85), -4, -14)
tmp = move_t(tmp, (0.76, 0.45, 0.98, 0.85), 4, -14)
save(tmp, "gabu", "arms-up")
tmp = move_t(im, (0.76, 0.45, 0.98, 0.85), 18, -8)
tmp = rotate(tmp, -5)
save(tmp, "gabu", "leaf-throw")

# Wispkin peel: dark-only move + strands
im = load("wispkin")
tmp = move_dark(im, (0.00, 0.22, 0.30, 0.55), -14, 0)
tmp = move_dark(tmp, (0.70, 0.22, 1.00, 0.55), 14, 0)
d = ImageDraw.Draw(tmp)
W, H = tmp.size
for fx in (0.30, 0.34, 0.38):
    d.line([(fx * W, 0.38 * H), ((fx - 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
for fx in (0.62, 0.66, 0.70):
    d.line([(fx * W, 0.38 * H), ((fx + 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
save(tmp, "wispkin", "hands-peel")

# Sproutle wave: translation only
im = load("sproutle")
save(move_t(im, (0.72, 0.48, 0.98, 0.85), 4, -16), "sproutle", "wave")

# Tyrage: stomp leg only; impact squash + arm translate
im = load("tyrage")
save(move_t(im, (0.55, 0.78, 0.88, 1.00), 0, -20), "tyrage", "stomp-up")
tmp = squash(im, 0.88, 1.05)
tmp = move_t(tmp, (0.02, 0.48, 0.26, 0.85), 0, -8)
tmp = move_t(tmp, (0.74, 0.48, 0.98, 0.85), 0, -8)
save(tmp, "tyrage", "impact")

# Kittember walk-b smaller shift; tail-down translation
im = load("kittember")
tmp = move_t(im, (0.32, 0.78, 0.52, 1.00), 8, 0)
tmp = move_t(tmp, (0.52, 0.78, 0.72, 1.00), -8, 0)
save(tmp, "kittember", "walk-b")
save(move_t(im, (0.68, 0.28, 1.00, 0.78), 0, 14), "kittember", "tail-down")

# Mythar wings-up: translation only
im = load("mythar")
tmp = move_t(im, (0.00, 0.00, 0.36, 0.85), -4, -16)
tmp = move_t(tmp, (0.64, 0.00, 1.00, 0.85), 4, -16)
save(tmp, "mythar", "wings-up")
print("fix pass done")
