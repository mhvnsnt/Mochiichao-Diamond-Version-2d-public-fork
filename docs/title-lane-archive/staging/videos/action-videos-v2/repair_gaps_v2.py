#!/usr/bin/env python3
"""Repair pass: fill INTERIOR gaps only -- holes (opaque in the original cutout,
transparent in the pose) that are bounded by opaque pixels on BOTH sides in the
same row. Those are torso notches left by a limb-box clear, not legitimately
vacated limb space (which is bounded on one side only and stays transparent)."""
import numpy as np
from PIL import Image, ImageDraw
import sys
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2")
from build_poses_v2 import load
from fix_poses_v2 import move_dark

FRAMES = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"


def fill_interior_gaps(new_im, orig_im):
    new = np.array(new_im)
    oa = np.array(orig_im.split()[3]) > 20
    na = new[:, :, 3] > 20
    hole = oa & (~na)
    H, W = hole.shape
    out = new.copy()
    for y in range(H):
        row_hole = hole[y]
        x = 0
        while x < W:
            if not row_hole[x]:
                x += 1
                continue
            x0 = x
            while x < W and row_hole[x]:
                x += 1
            x1 = x  # hole run [x0, x1)
            left_ok = x0 > 0 and na[y, x0 - 1]
            right_ok = x1 < W and na[y, x1]
            if left_ok and right_ok:
                # fill with nearest opaque colour per pixel (closer side wins)
                for xx in range(x0, x1):
                    dl, dr = xx - (x0 - 1), (x1) - xx
                    src = x0 - 1 if dl <= dr else x1
                    out[y, xx, :3] = new[y, src, :3]
                    out[y, xx, 3] = 255
    return Image.fromarray(out, "RGBA")


def repair(creature, pose):
    orig = load(creature)
    p = f"{FRAMES}/{creature}-pose-{pose}.png"
    fixed = fill_interior_gaps(Image.open(p).convert("RGBA"), orig)
    fixed.save(p)
    print("repaired", creature, pose)


for c, p in [
    ("dorowani", "swim-together"),
    ("gabu", "arms-up"),
    ("gabu", "leaf-throw"),
    ("sproutle", "wave"),
    ("tyrage", "impact"),
    ("kittember", "tail-down"),
    ("kittember", "walk-b"),
    ("mythar", "wings-up"),
]:
    repair(c, p)

# Wispkin peel rebuilt with tight hand boxes (y 0.22-0.42, hands only, not body)
im = load("wispkin")
tmp = move_dark(im, (0.00, 0.22, 0.30, 0.42), -14, 0)
tmp = move_dark(tmp, (0.70, 0.22, 1.00, 0.42), 14, 0)
d = ImageDraw.Draw(tmp)
W, H = tmp.size
for fx in (0.30, 0.34, 0.38):
    d.line([(fx * W, 0.38 * H), ((fx - 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
for fx in (0.62, 0.66, 0.70):
    d.line([(fx * W, 0.38 * H), ((fx + 0.06) * W, 0.42 * H)], fill=(60, 60, 60, 180), width=3)
tmp = fill_interior_gaps(tmp, im)
tmp.save(f"{FRAMES}/wispkin-pose-hands-peel.png")
print("rebuilt wispkin hands-peel")
