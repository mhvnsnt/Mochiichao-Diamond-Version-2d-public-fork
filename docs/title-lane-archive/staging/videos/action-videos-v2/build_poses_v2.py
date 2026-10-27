#!/usr/bin/env python3
"""V2 pose frames from each creature's OWN title cutout (exact pixels, no redraw).
Method (Pokemon structure, Mochiichao art): FireRed event_object_movement.c
SetStepAnimHandleAlternation alternates between two distinct GO frames per step
(animPos 0<->3, 1<->2) -- never a position slide of one frame. Battle anims use
AffineAnim squash params (xScale/yScale start->end over a duration).
Here: pose frames are discrete cuts, position moves only as part of a pose cycle.
Limb edits: cut a limb region, transform it, paste it back, then fill interior
holes (pixels opaque in the original but transparent in the new frame AND
surrounded by opaque pixels) with neighbouring colour, so torso notches heal.
Output: action-videos-v2/frames/<creature>-pose-*.png, same canvas as cutout.
"""
import os
import numpy as np
from PIL import Image, ImageDraw

SRC = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
os.makedirs(OUT, exist_ok=True)


def load(c):
    return Image.open(f"{SRC}/{c}-walk-cutout.png").convert("RGBA")


def feet_bottom(im):
    a = np.array(im.split()[3])
    ys = np.where(a > 20)[0]
    return int(ys.max()) if len(ys) else im.size[1] - 1


def reanchor(im, orig_bottom):
    """Shift image so its opaque bbox bottom == orig_bottom (canvas same size)."""
    a = np.array(im.split()[3])
    ys = np.where(a > 20)[0]
    if not len(ys):
        return im
    dy = orig_bottom - int(ys.max())
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, dy), im)
    return out


def squash(im, sy, sx=1.0, anchor="feet"):
    w, h = im.size
    nw, nh = max(1, int(w * sx)), max(1, int(h * sy))
    r = im.resize((nw, nh), Image.LANCZOS)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    fb = feet_bottom(im)
    # place resized so feet stay at fb (for sy<1 the top moves down; keep centred x)
    top = fb - (nh - 1)
    out.paste(r, ((w - nw) // 2, top), r)
    return reanchor(out, fb)


def rotate(im, deg):
    fb = feet_bottom(im)
    r = im.rotate(deg, resample=Image.BICUBIC, expand=False, center=(im.size[0] // 2, im.size[1] // 2))
    return reanchor(r, fb)


def move_region(im, box, dx, dy, angle=0):
    """box = (x0,y0,x1,y1) in relative coords. Cut, clear, transform, paste, heal holes."""
    W, H = im.size
    x0, y0, x1, y1 = (int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))
    region = im.crop((x0, y0, x1, y1))
    base = im.copy()
    # clear region: set alpha 0 where region had alpha, inside box only
    ra = np.array(region.split()[3])
    ba = np.array(base.split()[3])
    sub = ba[y0:y1, x0:x1]
    sub[ra > 20] = 0
    ba[y0:y1, x0:x1] = sub
    base.putalpha(Image.fromarray(ba))
    if angle:
        region = region.rotate(angle, resample=Image.BICUBIC, expand=False,
                               center=(region.size[0] // 2, region.size[1] // 2))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(base, (0, 0), base)
    out.paste(region, (x0 + dx, y0 + dy), region)
    return heal(out, im)


def heal(new, orig):
    """Fill interior holes: opaque in orig, transparent in new, >=5 opaque neighbours."""
    na = np.array(new)
    oa = np.array(orig.split()[3])
    mask_new = na[:, :, 3] > 20
    hole = (oa > 20) & (~mask_new)
    if not hole.any():
        return new
    # neighbour count
    from scipy.ndimage import convolve
    cnt = convolve(mask_new.astype(np.int32), np.ones((3, 3), dtype=np.int32), mode="constant") - mask_new.astype(np.int32)
    fill = hole & (cnt >= 5)
    if not fill.any():
        return new
    for _ in range(3):
        # fill each hole pixel with mean of opaque neighbours
        for ch in range(3):
            vals = na[:, :, ch].astype(np.float32)
            s = convolve(np.where(mask_new, vals, 0), np.ones((3, 3)), mode="constant")
            c = convolve(mask_new.astype(np.float32), np.ones((3, 3)), mode="constant")
            mean = np.divide(s, c, out=np.zeros_like(s), where=c > 0)
            na[:, :, ch] = np.where(fill, mean.astype(np.uint8), na[:, :, ch])
        na[:, :, 3] = np.where(fill, 255, na[:, :, 3])
        mask_new = na[:, :, 3] > 20
    return Image.fromarray(na, "RGBA")


def save(im, creature, name):
    p = f"{OUT}/{creature}-pose-{name}.png"
    im.save(p)
    print("pose", creature, name, im.size)
    return p


def build():
    # ---- Yogiferno: walk steps. Legs live y 0.70-1.00; front leg left, back leg right.
    im = load("yogiferno")
    save(im, "yogiferno", "step-a")
    # step-b: front leg box shifts right, back leg box shifts left (feet keep orientation)
    tmp = move_region(im, (0.05, 0.70, 0.50, 1.00), 18, 0)
    tmp = move_region(tmp, (0.50, 0.70, 0.98, 1.00), -18, 0)
    save(tmp, "yogiferno", "step-b")
    save(rotate(im, -5), "yogiferno", "lean")

    # ---- Dorowani: swim. Arms hang at sides y 0.45-0.98; legs y 0.80-1.00.
    im = load("dorowani")
    save(im, "dorowani", "stand")
    # swim-together: arms rotate inward (toward belly), left leg kicks up, right leg down
    tmp = move_region(im, (0.00, 0.45, 0.30, 0.98), 10, -6, angle=28)
    tmp = move_region(tmp, (0.70, 0.45, 1.00, 0.98), -10, -6, angle=-28)
    tmp = move_region(tmp, (0.15, 0.80, 0.48, 1.00), 0, -14, angle=18)
    save(tmp, "dorowani", "swim-together")
    # swim-apart: arms rotate outward wide, right leg kicks up, left leg down
    tmp = move_region(im, (0.00, 0.45, 0.30, 0.98), -12, 0, angle=-30)
    tmp = move_region(tmp, (0.70, 0.45, 1.00, 0.98), 12, 0, angle=30)
    tmp = move_region(tmp, (0.52, 0.80, 0.85, 1.00), 0, -14, angle=-18)
    save(tmp, "dorowani", "swim-apart")

    # ---- Razorgater: mouth open / half / closed by filling the dark mouth blob.
    im = load("razorgater")
    save(im, "razorgater", "mouth-open")
    save(close_mouth(im, 1.0), "razorgater", "mouth-closed")
    save(close_mouth(im, 0.45), "razorgater", "mouth-half")

    # ---- Gabu: stand / arms-up guard / leaf-throw / crouch
    im = load("gabu")
    save(im, "gabu", "stand")
    tmp = move_region(im, (0.00, 0.42, 0.28, 0.88), 0, -8, angle=38)
    tmp = move_region(tmp, (0.72, 0.42, 1.00, 0.88), 0, -8, angle=-38)
    save(tmp, "gabu", "arms-up")
    tmp = move_region(im, (0.72, 0.42, 1.00, 0.88), 16, -10, angle=-55)
    tmp = rotate(tmp, -5)
    save(tmp, "gabu", "leaf-throw")
    save(squash(im, 0.85, 1.04), "gabu", "crouch")

    # ---- Wispkin: 6 poses, most frames of any creature.
    im = load("wispkin")
    save(im, "wispkin", "hands-face")
    # hands-press: black hand blobs move inward (hands are black, face white)
    tmp = move_region(im, (0.00, 0.22, 0.30, 0.55), 12, 0)
    tmp = move_region(tmp, (0.70, 0.22, 1.00, 0.55), -12, 0)
    save(tmp, "wispkin", "hands-press")
    # hands-peel: hands outward + sticky strands drawn between hand and face
    tmp = move_region(im, (0.00, 0.22, 0.30, 0.55), -14, 0)
    tmp = move_region(tmp, (0.70, 0.22, 1.00, 0.55), 14, 0)
    d = ImageDraw.Draw(tmp)
    W, H = tmp.size
    for fx in (0.30, 0.34, 0.38):
        d.line([(fx * W, 0.38 * H), ((fx - 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
    for fx in (0.62, 0.66, 0.70):
        d.line([(fx * W, 0.38 * H), ((fx + 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
    save(tmp, "wispkin", "hands-peel")
    save(rotate(im, -8), "wispkin", "tilt-left")
    save(rotate(im, 8), "wispkin", "tilt-right")
    save(squash(im, 0.90, 1.05), "wispkin", "smoke-puff")

    # ---- Sproutle: few poses (ordered low count).
    im = load("sproutle")
    save(im, "sproutle", "stand")
    tmp = move_region(im, (0.70, 0.45, 1.00, 0.85), 6, -10, angle=-50)
    save(tmp, "sproutle", "wave")
    tmp = move_region(im, (0.18, 0.78, 0.48, 1.00), 10, -4)
    tmp = rotate(tmp, -4)
    save(tmp, "sproutle", "step")

    # ---- Tyrage: rage stomp cycle.
    im = load("tyrage")
    save(im, "tyrage", "stand")
    tmp = move_region(im, (0.55, 0.75, 0.88, 1.00), 0, -22, angle=-15)
    tmp = move_region(tmp, (0.00, 0.45, 0.30, 0.85), 0, -6, angle=25)
    save(tmp, "tyrage", "stomp-up")
    tmp = squash(im, 0.88, 1.05)
    tmp = move_region(tmp, (0.00, 0.45, 0.30, 0.85), 0, -10, angle=40)
    tmp = move_region(tmp, (0.70, 0.45, 1.00, 0.85), 0, -10, angle=-40)
    save(tmp, "tyrage", "impact")
    save(squash(im, 1.06, 0.96), "tyrage", "roar-up")

    # ---- Mochii: blob shape poses (shape change IS the pose for a drop).
    im = load("mochii")
    save(im, "mochii", "round")
    save(squash(im, 0.85, 1.12), "mochii", "squash-wide")
    save(squash(im, 1.12, 0.92), "mochii", "stretch-tall")
    save(rotate(im, 10), "mochii", "tilt")
    save(squash(im, 0.75, 1.20), "mochii", "splash-flat")

    # ---- Kittember: walk steps, tail wag, sit-look.
    im = load("kittember")
    save(im, "kittember", "walk-a")
    tmp = move_region(im, (0.30, 0.75, 0.55, 1.00), 12, 0)
    tmp = move_region(tmp, (0.55, 0.75, 0.80, 1.00), -12, 0)
    save(tmp, "kittember", "walk-b")
    # tail: orange tail + orb on the right, y 0.30-0.75
    tmp = move_region(im, (0.68, 0.28, 1.00, 0.78), 0, -16, angle=-20)
    save(tmp, "kittember", "tail-up")
    tmp = move_region(im, (0.68, 0.28, 1.00, 0.78), 0, 12, angle=18)
    save(tmp, "kittember", "tail-down")
    save(squash(im, 0.90, 1.03), "kittember", "sit-look")

    # ---- Mythar: wing poses.
    im = load("mythar")
    save(im, "mythar", "wings-neutral")
    tmp = move_region(im, (0.00, 0.00, 0.38, 0.85), -6, -14, angle=18)
    tmp = move_region(tmp, (0.62, 0.00, 1.00, 0.85), 6, -14, angle=-18)
    save(tmp, "mythar", "wings-up")
    tmp = move_region(im, (0.00, 0.00, 0.38, 0.85), 0, 12, angle=-15)
    tmp = move_region(tmp, (0.62, 0.00, 1.00, 0.85), 0, 12, angle=15)
    save(tmp, "mythar", "wings-down")
    save(squash(im, 0.92, 0.94), "mythar", "wings-fold")


def close_mouth(im, frac):
    """Fill the dark mouth blob from the bottom up by frac (1.0 = fully closed),
    then draw a closed-mouth line with teeth ticks along the new mouth edge."""
    from scipy.ndimage import label
    arr = np.array(im)
    a = arr[:, :, 3]
    rgb = arr[:, :, :3].astype(int)
    dark = (a > 20) & (rgb.sum(axis=2) < 240)
    # mouth region: centre band, below eyes
    H, W = a.shape
    region = np.zeros_like(dark)
    region[int(H * 0.38):int(H * 0.82), int(W * 0.18):int(W * 0.82)] = True
    cand = dark & region
    lab, n = label(cand)
    if n == 0:
        return im
    sizes = [(lab == i).sum() for i in range(1, n + 1)]
    mouth = lab == (int(np.argmax(sizes)) + 1)
    ys, xs = np.where(mouth)
    # jaw grey: median colour of light-grey pixels near the mouth
    near = (a > 20) & (~mouth)
    grey = np.median(arr[:, :, :3][near], axis=0).astype(np.uint8)
    out = arr.copy()
    if frac >= 1.0:
        out[mouth] = np.array([grey[0], grey[1], grey[2], 255], dtype=np.uint8)
        # mouth line across the top of the filled blob + teeth ticks
        top = ys.min()
        d = ImageDraw.Draw(Image.fromarray(out, "RGBA"))
        # draw on out via PIL image wrapper
        pil = Image.fromarray(out, "RGBA")
        d = ImageDraw.Draw(pil)
        d.line([(xs.min(), top + 6), (xs.max(), top + 6)], fill=(0, 0, 0, 255), width=3)
        for tx in range(int(xs.min()) + 12, int(xs.max()) - 8, 18):
            d.polygon([(tx, top + 6), (tx + 8, top + 6), (tx + 4, top + 16)], fill=(255, 255, 255, 255))
        return pil
    # partial: fill only the bottom frac of the blob rows
    y_lo = ys.min() + int((ys.max() - ys.min()) * (1 - frac))
    fillmask = mouth.copy()
    fillmask[:y_lo, :] = False
    out[fillmask] = np.array([grey[0], grey[1], grey[2], 255], dtype=np.uint8)
    return Image.fromarray(out, "RGBA")


if __name__ == "__main__":
    build()
