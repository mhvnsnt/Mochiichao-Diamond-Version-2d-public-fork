#!/usr/bin/env python3
"""Yogiferno torch poses v3: v2 poses + torch baked into the front fist,
plus 2 new poses (torch-raise, stomp) -> 5-pose walk cycle.
Torch anchor = front (far) fist, the fist at mid-torso on the facing side.
Handle passes through the fist (5px line vs ~28px fist = grip reads),
flame above the fist. No limb surgery, no leg swaps (those mangled him in v2).
Pose space is the 145x190 cutout space; video scales to 448 tall.
"""
import math
from PIL import Image, ImageDraw

V2F = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v3/frames"
import os
os.makedirs(OUT, exist_ok=True)

def load(p):
    return Image.open(f"{V2F}/yogiferno-pose-{p}.png").convert("RGBA")

def flame(d, cx, cy, w, h, lean=0):
    # glow halo
    d.ellipse([cx - w, cy - h * 0.8, cx + w, cy + h * 0.8], fill=(249, 115, 22, 60))
    # outer teardrop (polygon, tip leaning by `lean`)
    d.polygon([(cx - w * 0.7, cy + h * 0.6), (cx - w * 0.5, cy - h * 0.2),
               (cx + lean, cy - h), (cx + w * 0.5, cy - h * 0.2),
               (cx + w * 0.7, cy + h * 0.6)], fill=(249, 115, 22, 255))
    d.ellipse([cx - w * 0.45, cy - h * 0.1, cx + w * 0.45, cy + h * 0.7], fill=(251, 191, 36, 255))
    d.ellipse([cx - w * 0.22, cy + h * 0.1, cx + w * 0.22, cy + h * 0.6], fill=(254, 243, 199, 255))

def torch(im, fist, tip, fw, fh, lean=0, handle_top=None):
    """fist=(x,y) grip centre, tip=(x,y) flame centre. Handle runs from
    below the fist through the fist to just under the flame."""
    im = im.copy()
    d = ImageDraw.Draw(im, "RGBA")
    hx, hy = fist
    tx, ty = tip
    # handle: short, through the FRONT fist only (bottom just below the
    # fist) -- a long handle reached the near hand and read as the wrong grip
    d.line([(hx, hy + 12), (tx, ty + fh * 0.6)], fill=(101, 67, 33, 255), width=5)
    # wrap bands on handle
    for t in (0.35, 0.6):
        bx = hx + (tx - hx) * t; by = hy + 26 + (ty + fh * 0.6 - (hy + 26)) * t
        d.line([(bx - 4, by), (bx + 4, by)], fill=(220, 180, 90, 255), width=2)
    flame(d, tx, ty, fw, fh, lean=lean)
    return im

# base poses from v2 (own cutout pixels, untouched except torch)
bases = {
    "step-a": (load("step-a"), (96, 110), (106, 62), 13, 20, 2),
    "pass": (load("pass"), (96, 110), (104, 64), 12, 18, 0),
    "lean": (load("lean"), (94, 108), (102, 60), 13, 19, -4),
}
for name, (im, fist, tip, fw, fh, lean) in bases.items():
    out = torch(im, fist, tip, fw, fh, lean=lean)
    out.save(f"{OUT}/yogiferno-pose-{name}.png")
    print("pose", name, out.size)

# torch-raise: step-a tilted +3 (whole-body rotate, clean per v2 lessons),
# torch steeper and higher, flame larger
from PIL import Image as _I
base = load("step-a")  # no body rotation: rotation moved the fist off the anchor
out = torch(base, (96, 110), (110, 44), 15, 24, lean=3)
out.save(f"{OUT}/yogiferno-pose-torch-raise.png")
print("pose torch-raise", out.size)

# stomp: step-a squashed (timed squash, battle_anim style), torch tilted
# forward, flame wide and short
base = load("step-a").resize((152, 180), Image.LANCZOS)
canvas = Image.new("RGBA", (145, 190), (0, 0, 0, 0))
canvas.paste(base, (-3, 10), base)
out = torch(canvas, (96, 118), (108, 70), 16, 15, lean=6)
out.save(f"{OUT}/yogiferno-pose-stomp.png")
print("pose stomp", out.size)
