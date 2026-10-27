#!/usr/bin/env python3
"""CONTOUR-FIT MOUTH MODULE — PIPELINE V3 (2026-10-26).

Replaces the old retrofit draw_mouth, whose fault Mars identified
2026-10-26 ~10:50 CDT: a flat patch_median RECTANGLE painted under every
mouth (16x10 skin/fur block) that reads as a square crop sitting on the
face instead of fitting it.

V3 rules (binding, see PIPELINE-V3.md):
1. NO rectangles, NO flat median patches, NO square crops anywhere in a
   mouth overlay. Every mouth shape is drawn inside a feathered
   ELLIPTICAL contour mask fitted to the measured true mouth.
2. The "clear" under a new mouth is NOT a flat colour: it is the base
   cell itself Gaussian-blurred, so the cleared area keeps the local
   fur/skin texture and gradient instead of a solid block.
3. The mask edge is feathered (Gaussian blur on the mask alpha), so the
   overlay fades into the surrounding fur instead of ending in a step.
4. The mask is constrained to the base cell's own alpha silhouette
   (exact, IoU 1.0 by construction). GrabCut was tested and REJECTED:
   on the dark-fur Kittember impact cell it reached only IoU 0.428
   against the true silhouette (dark fur on dark background confuses
   it), so it can only make the fit worse.
5. All geometry is in FINAL-frame coordinates (V2): centre =
   propagate(corrected source anchor, frame transform); radii are
   multiplied by that frame's (sx, sy). Ellipses under squash, never
   circles carried through a transform.
6. Teeth are small ellipses clipped by the mask, never white rectangles.

Tools actually used (all present in this environment):
- OpenCV 5.0.0 (atlases/_tools/.venv-opencv): GaussianBlur for the
  feather + the blurred-base clear, connectedComponents for measurement.
- Pillow 13.0.0 + numpy 2.5.4 for compositing.
Rejected: rembg (not installed; would need a model download, and the
cell's own alpha channel already gives the exact silhouette, so a
learned segmenter adds nothing here); scipy (not installed; cv2 covers
the blurs); GrabCut (measured IoU 0.428, rejected, see rule 4).
"""
import math

import cv2
import numpy as np
from PIL import Image, ImageDraw


def propagate(p, t):
    """Same compose math as the batch-a / arefit builders: scale about
    bottom-centre (128,232)@256, translate, rotate about (128,200)@256,
    downscale /4. Input p is a 64px source anchor; output is a 64px
    final-frame position."""
    sx = t.get('sx', 1.0); sy = t.get('sy', 1.0)
    dx = t.get('dx', 0); dy = t.get('dy', 0); rot = t.get('rot', 0)
    X, Y = p[0] * 4, p[1] * 4
    qx = 128 + (X - 128) * sx + dx; qy = 232 + (Y - 256) * sy + dy
    if rot:
        th = math.radians(rot); cx, cy = 128, 200
        rx = cx + (qx - cx) * math.cos(th) + (qy - cy) * math.sin(th)
        ry = cy - (qx - cx) * math.sin(th) + (qy - cy) * math.cos(th)
        qx, qy = rx, ry
    return (qx / 4, qy / 4)


def feathered_ellipse_mask(h, w, cx, cy, rx, ry, feather_sigma=1.0):
    """Float mask 0..1: 1 inside the ellipse, feathered by a Gaussian
    blur so the boundary fades over ~2*sigma px instead of stepping."""
    yy, xx = np.mgrid[0:h, 0:w]
    q = ((xx - cx) / max(rx, 0.5)) ** 2 + ((yy - cy) / max(ry, 0.5)) ** 2
    mask = (q <= 1.0).astype(np.float32)
    if feather_sigma > 0:
        mask = cv2.GaussianBlur(mask, (0, 0), feather_sigma)
    return mask


def contour_fit_mouth(cell_rgba, cx, cy, rx, ry, draw_fn,
                      feather_sigma=1.0, blur_sigma=1.2):
    """Apply one expression mouth to a 64x64 RGBA cell.

    cell_rgba: PIL RGBA image (already transformed base / eyes-only
      frame). cx, cy: final-frame mouth centre. rx, ry: final-frame
      mask radii (already scaled by sx/sy). draw_fn: callable taking
      (ImageDraw, cx, cy, rx, ry) that draws the expression into an
      overlay layer using ellipses/arcs/polylines only — no rectangles.
    Returns (out_pil_rgba, mask, info). The mask is constrained to the
    base silhouette so no overlay pixel can land off the creature.
    """
    base = np.array(cell_rgba.convert('RGBA')).astype(np.float32)
    h, w = base.shape[:2]
    sil = (base[:, :, 3] > 0).astype(np.float32)
    mask = feathered_ellipse_mask(h, w, cx, cy, rx, ry, feather_sigma) * sil
    blurred = cv2.GaussianBlur(base[:, :, :3], (0, 0), blur_sigma)
    # Clear: local blurred base inside the mask (keeps fur texture).
    cleared = base[:, :, :3] * (1.0 - mask[:, :, None]) + blurred * mask[:, :, None]
    # Expression overlay, clipped by the same feathered mask.
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    draw_fn(d, cx, cy, rx, ry)
    ov = np.array(layer).astype(np.float32)
    oa = (ov[:, :, 3] / 255.0) * mask
    out_rgb = cleared * (1.0 - oa[:, :, None]) + ov[:, :, :3] * oa[:, :, None]
    out = np.dstack([out_rgb, base[:, :, 3]]).clip(0, 255)
    out = np.round(out).astype(np.uint8)
    return Image.fromarray(out, 'RGBA'), mask, {'mask_px': float((mask > 0.05).sum())}


# --- Expression drawings: ellipses / arcs / polylines only. ----------
DARK = (25, 15, 15, 255)
INNER = (170, 60, 60, 255)
WHITE = (255, 255, 255, 255)


def draw_open_bite(teeth):
    def fn(d, cx, cy, rx, ry):
        d.ellipse([cx - rx * 0.8, cy - ry * 0.7, cx + rx * 0.8, cy + ry * 0.7], fill=DARK)
        d.ellipse([cx - rx * 0.6, cy - ry * 0.1, cx + rx * 0.6, cy + ry * 0.65], fill=INNER)
        if teeth:
            for fx in (-0.45, 0.0, 0.45):
                d.ellipse([cx + fx * rx - 1.2, cy - ry * 0.7,
                           cx + fx * rx + 1.2, cy - ry * 0.25], fill=WHITE)
    return fn


def draw_grin(d, cx, cy, rx, ry):
    d.arc([cx - rx * 0.85, cy - ry, cx + rx * 0.85, cy + ry], 20, 160, fill=DARK, width=2)


def draw_grimace(d, cx, cy, rx, ry):
    pts = []
    for i in range(9):
        t = i / 8.0
        px = cx - rx * 0.8 + 2 * rx * 0.8 * t
        py = cy + (ry * 0.35 if i % 2 == 0 else -ry * 0.35)
        pts.append((px, py))
    d.line(pts, fill=DARK, width=2, joint='curve')
