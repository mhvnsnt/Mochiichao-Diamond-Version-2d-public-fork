#!/usr/bin/env python3
"""TAKE-6 TRIANGLE MOUTH — extends the take-5 stack, does not replace it.

Mars on take-4 vs take-5 (2026-10-26 ~15:22 CDT): the two look almost
the same; the real fault is SHAPE — take-5 gives a CIRCULAR mouth,
Razorgater's mouth is kind of an UPSIDE-DOWN TRIANGLE (wide top,
point at the chin). Teeth and everything else look good; only the
mouth shape is wrong. Fallback, Mars's own words: if the triangle
cannot be done right, KEEP take-5.

Why a new mask, not a new drawing inside the old mask: take-5's
contour_fit_mouth clips its overlay to a feathered ELLIPSE mask, so
any triangle drawn inside it still reads as an ellipse at the
boundary. Take-6 therefore replaces the mask itself with a feathered
TRIANGLE mask: top edge = detected jaw width x 1.20 at the lip line,
apex = detected jaw centre bottom (jaw centre + ry), sides following
the detected jaw edges. Everything else is take-5, unchanged:
  * sensor: detect_mouth_v5 imported from mouth_fit_wide5 (OpenCV
    connectedComponents, same venv stack, no new install);
  * scale: radii = detected jaw half-size x 1.20 (17.4 x 10.2);
  * tongue: a smaller ellipse inside the triangle (top cy-0.30ry,
    bottom cy+0.80ry, 0.70rx wide), clipped by the triangle mask
    — first build used a trapezoid tongue and it filled the whole
    triangle, leaving only a thin dark strip; the ellipse keeps
    the dark cavity band visible above it, as in take-5;
  * teeth: top teeth EXACTLY take-5 (0.9px half-width triangles at
    fx -0.62,-0.31,0,0.31,0.62, tip from cy-ry*0.85 to cy-ry*0.50);
    bottom teeth kept at 3 triangles but NARROWED to fx
    -0.15,0,0.15, because at cy+ry*0.55 the triangle's half-width
    is only 0.225*rx — take-5's +/-0.45 bottom teeth would fall
    outside the triangle and be clipped away;
  * rim: 1px light-steel outline around the triangle, so the whole
    jaw reads on the dark GIF flatten background;
  * trail fix: GIF flattened onto opaque dark RGB (24,28,40),
    disposal=2; cells stay transparent.
Triangle vertices (final-frame coords, cx,cy = detected jaw centre,
rx,ry = detected jaw half-size x 1.20):
  top-left  (cx-rx, cy-ry), top-right (cx+rx, cy-ry),
  apex      (cx,   cy+ry)
Top width = 2*rx (34.8px on all 4 impact cells, vs 29px detected jaw
= x1.20, the take-5 scale). Apex y = cy+ry, i.e. 2.2px below the detected jaw bottom
(jaw_bbox max, inclusive) — the same vertical overshoot
take-5's ellipse bottom already had; the gate checks
0px off silhouette, so an overshoot that lands off the creature
fails the gate instead of shipping silently.
Feathering (Gaussian sigma 1.0, same as take-5) rounds the apex
and top corners by ~1px; that is a measured softening, not a
return to a circle — the straight sides stay straight.
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..',
                                'articulation-pipev3-wide5'))
from mouth_fit_wide5 import DARK, RIM, TONGUE_GREY, WHITE, detect_mouth_v5  # noqa: E402


def triangle_vertices(cx, cy, rx, ry):
    return [(cx - rx, cy - ry), (cx + rx, cy - ry), (cx, cy + ry)]


def feathered_triangle_mask(h, w, cx, cy, rx, ry, feather_sigma=1.0):
    yy, xx = np.mgrid[0:h, 0:w]
    # Barycentric-style test for the upside-down triangle:
    # inside iff y between top and apex AND |x-cx| <= rx*(apex_y-y)/(2*ry)
    top, apex = cy - ry, cy + ry
    half = np.where((yy >= top) & (yy <= apex),
                    rx * np.clip((apex - yy) / max(2 * ry, 0.5), 0, 1), 0.0)
    mask = ((yy >= top) & (yy <= apex) & (np.abs(xx - cx) <= half)).astype(np.float32)
    if feather_sigma > 0:
        mask = cv2.GaussianBlur(mask, (0, 0), feather_sigma)
    return mask


def contour_fit_triangle_mouth(cell_rgba, cx, cy, rx, ry, draw_fn,
                               feather_sigma=1.0, blur_sigma=1.2):
    """Same contract as take-5 contour_fit_mouth, triangle mask."""
    base = np.array(cell_rgba.convert('RGBA')).astype(np.float32)
    h, w = base.shape[:2]
    sil = (base[:, :, 3] > 0).astype(np.float32)
    mask = feathered_triangle_mask(h, w, cx, cy, rx, ry, feather_sigma) * sil
    blurred = cv2.GaussianBlur(base[:, :, :3], (0, 0), blur_sigma)
    cleared = base[:, :, :3] * (1.0 - mask[:, :, None]) + blurred * mask[:, :, None]
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    draw_fn(d, cx, cy, rx, ry)
    ov = np.array(layer).astype(np.float32)
    oa = (ov[:, :, 3] / 255.0) * mask
    out_rgb = cleared * (1.0 - oa[:, :, None]) + ov[:, :, :3] * oa[:, :, None]
    out = np.dstack([out_rgb, base[:, :, 3]]).clip(0, 255)
    out = np.round(out).astype(np.uint8)
    return Image.fromarray(out, 'RGBA'), mask, {'mask_px': float((mask > 0.05).sum())}


def draw_triangle_jaw_v6(d, cx, cy, rx, ry):
    """Upside-down triangle jaw. Cavity = triangle inset 8%/15%;
    tongue = trapezoid following the triangle sides, 20%-to-95%
    down the jaw; top teeth = take-5 exactly; bottom teeth narrowed
    to fit the triangle at their height (see module docstring)."""
    top, apex = cy - ry, cy + ry
    # Rim: triangle outline.
    d.polygon(triangle_vertices(cx, cy, rx, ry), outline=RIM)
    # Cavity: inset triangle (92% width, top +15% down, apex -15% up).
    d.polygon([(cx - rx * 0.92, top + ry * 0.15),
               (cx + rx * 0.92, top + ry * 0.15),
               (cx, apex - ry * 0.15)], fill=DARK)
    # Tongue, REVISED after first build eye-check: a trapezoid
    # tongue (widest at its top, 20% down) filled the whole triangle
    # and left only a thin dark strip at the top — the cavity
    # stopped reading as a mouth. So the tongue is now a smaller
    # ellipse inside the triangle (top cy-0.30ry, bottom cy+0.80ry,
    # 0.70rx wide), clipped by the triangle mask like take-5's
    # tongue was clipped by its ellipse mask. The OUTER shape is
    # what Mars asked to change (triangle, not circle); the inner
    # tongue keeps take-5's rounded proportions, and the dark
    # cavity band above it (cy-0.85ry to cy-0.30ry) stays visible.
    d.ellipse([cx - rx * 0.70, cy - ry * 0.30,
               cx + rx * 0.70, cy + ry * 0.80], fill=TONGUE_GREY)
    tw = 0.9
    for fx in (-0.62, -0.31, 0.0, 0.31, 0.62):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy - ry * 0.85), (tx + tw, cy - ry * 0.85),
                   (tx, cy - ry * 0.50)], fill=WHITE)
    for fx in (-0.15, 0.0, 0.15):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy + ry * 0.95), (tx + tw, cy + ry * 0.95),
                   (tx, cy + ry * 0.55)], fill=WHITE)
