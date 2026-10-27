#!/usr/bin/env python3
"""Yogiferno v4 poses, take 2: torch TRACKED to the measured front fist AND
angled OUTWARD clear of the face.

Take-1 failure (eye-checked, discarded): flame centred directly above the
fist at (fist_x+10, fist_y-44) landed ON the cheek, because the front fist
(124,110) sits below the face (face spans x~105-144, y~25-95 in 145x190
space). A vertical torch from that fist goes straight into the face — that
is why v3 read as floating/through the body.

Take-2 fix: pad every pose canvas to 200x190 so the torch can lean FORWARD
clear of the silhouette. Facing right: figure pasted at x=10, front fist at
(134,110); handle runs diagonally from the fist up-right to a flame centre
at (180,55), fully right of the face (face right edge 154 in padded space).
Facing left (look-back): figure pasted at x=45, front fist at (65,110);
flame at (20,55), fully left of the face (face left edge 46 in padded space).

Fist anchors (measured by scipy grey-component labelling on torchless bases,
then shifted by the pad offset):
  facing-right step-a/pass : (134,110)   stomp: (136,114)   lean: (132,114)
  facing-left mirrored     : (65,110)
Grip method unchanged: handle in two segments, fist pixels intact between
them, so the fist visibly wraps the handle. Flame directly above-and-outward
from the fist, never over the face, never through the chest.

Bases are the creature's own cutout pixels (v2 poses / mirrored step-a /
squashed step-a). No angle-sheet figure is pasted in (different render,
would break title continuity). Opposite stride: NOT in this file — six
methods tried, none clean (see v4 report); no fake stride is shipped.
"""
import os
from PIL import Image, ImageDraw

V2F = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v4/frames"
os.makedirs(OUT, exist_ok=True)

def load(p):
    return Image.open(f"{V2F}/yogiferno-pose-{p}.png").convert("RGBA")

def pad(im, ox):
    c = Image.new("RGBA", (200, 190), (0, 0, 0, 0))
    c.paste(im, (ox, 0), im)
    return c

def flame(d, cx, cy, w, h, lean=0):
    d.ellipse([cx - w, cy - h * 0.8, cx + w, cy + h * 0.8], fill=(249, 115, 22, 60))
    d.polygon([(cx - w * 0.7, cy + h * 0.6), (cx - w * 0.5, cy - h * 0.2),
               (cx + lean, cy - h), (cx + w * 0.5, cy - h * 0.2),
               (cx + w * 0.7, cy + h * 0.6)], fill=(249, 115, 22, 255))
    d.ellipse([cx - w * 0.45, cy - h * 0.1, cx + w * 0.45, cy + h * 0.7], fill=(251, 191, 36, 255))
    d.ellipse([cx - w * 0.22, cy + h * 0.1, cx + w * 0.22, cy + h * 0.6], fill=(254, 243, 199, 255))

def torch_tracked(im, fist, flame_xy, fw, fh, lean=0):
    """Handle in two segments with the fist intact between them; flame at
    flame_xy (forward of the fist, clear of the face)."""
    im = im.copy()
    d = ImageDraw.Draw(im, "RGBA")
    fx, fy = fist
    tx, ty = flame_xy
    # below fist: short stub going down-forward from the fist bottom
    d.line([(fx, fy + 10), (fx + (1 if tx > fx else -1) * 3, fy + 28)], fill=(101, 67, 33, 255), width=6)
    # above fist: diagonal from fist top to flame base
    d.line([(fx, fy - 10), (tx, ty + fh * 0.6)], fill=(101, 67, 33, 255), width=6)
    d.line([(fx, fy - 14), (fx + (1 if tx > fx else -1) * 5, fy - 14)], fill=(220, 180, 90, 255), width=2)
    flame(d, tx, ty, fw, fh, lean=lean)
    return im

step = pad(load("step-a"), 10)
pas = pad(load("pass"), 10)
lean_base = pad(load("lean"), 10)
_stomp = load("step-a").resize((152, 180), Image.LANCZOS)
_c = Image.new("RGBA", (145, 190), (0, 0, 0, 0))
_c.paste(_stomp, (-3, 10), _stomp)
stomp = pad(_c, 10)
mir = pad(load("step-a").transpose(Image.FLIP_LEFT_RIGHT), 45)
mir_pass = pad(load("pass").transpose(Image.FLIP_LEFT_RIGHT), 45)

# (name, base, fist, flame_xy, fw, fh, lean)
POSES = [
    ("stride-a",       step,      (134, 110), (180, 55), 13, 20, 4),
    ("pass",           pas,       (134, 110), (178, 58), 12, 18, 2),
    ("torch-forward",  step,      (134, 110), (186, 48), 15, 22, 8),
    ("look-back",      mir,       (65, 110),  (20, 55),  13, 20, -4),
    ("stomp",          stomp,     (136, 114), (182, 62), 16, 15, 8),
    ("torch-raise",    step,      (134, 110), (180, 40), 15, 26, 4),
    ("torch-low",      step,      (134, 110), (172, 72), 11, 15, 2),
    ("lean",           lean_base, (132, 114), (178, 58), 12, 18, -2),
    ("look-back-pass", mir_pass,  (65, 110),  (22, 58),  12, 18, -2),
]
for name, base, fist, fxy, fw, fh, lean in POSES:
    out = torch_tracked(base, fist, fxy, fw, fh, lean=lean)
    out.save(f"{OUT}/yogiferno-pose-{name}.png")
    print("pose", name, out.size, "fist", fist, "flame", fxy)
print("poses:", len(POSES))
