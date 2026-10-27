#!/usr/bin/env python3
"""KITTEMBER GLOW V2 BUILDER — circular radial glow with blur + white-hot core.

Mars corrections (2026-10-26 ~10:22 CDT) over v1:
  1. MORE BLUR + hotter core as it grows: Gaussian blur on the glow layer
     (sigma per frame) and core colour moving toward white with size.
  2. CIRCULAR crop: v1's rectangular feathered mask (x>=180, y 40..200)
     left an axis-aligned (square) fade. V2 has NO rectangular mask:
     falloff is pure Euclidean distance from the orb centre, so the disc
     is a true circle, plus a smooth COSINE angular feather on the
     whisker side (wide angle ramp, no step anywhere) instead of an
     x-cut. Blur is isotropic, so it cannot introduce a square edge.

Pokemon-file grounding (checked, not invented):
  - FireRed pokefirered-leafgreen/src/battle_anim_bug.c:170-179:
    TailGlow orb affine anim scales a radial glow sprite (0x10 -> 0x8
    over 18 frames, then +-0x5 oscillation loop) — Pokemon's glow
    pulses by scaling a radial sprite, it has no blur math.
  - FireRed graphics/battle_anims/sprites/glowy_red_orb.png (+
    glowy_blue/green_orb.pal): the glow shape itself is a radial disc
    sprite. V2 keeps that shape model (radial disc, pulsing scale
    across A->B->C) and adds the modern blur + hot-core falloff from
    open-source technique (multi-scale blur falloff; radial gradient
    + Screen/additive-style layering).
  - No Gaussian-blur or hot-core gradient code exists in the decomp
    files checked — that part is open-source technique, stated plainly.

Method per frame (glow drawn UNDERNEATH the figure, never over it):
  d = euclidean distance from orb centre / R   (0 at centre, 1 at edge)
  falloff alpha = peak * (1-d)^2               (smooth, derivative 0 at edge)
  colour = lerp(white_core, peach, clamp(d*1.6, 0, 1))
           -> white-hot centre, peach mid-zone, transparent edge
  angular feather (whisker side only): w = smooth cosine ramp on the
     direction from the centre; full strength pointing right, fading to
     0 across a wide band toward the left. No axis-aligned cut.
  then Gaussian blur (sigma per frame) over the whole glow layer.
  Composite: glow layer UNDER figure layer (figure pixels untouched).

Frames (287x304, same shipped #84 clean figure + restored bubbles):
  A  = clean, no glow (existing file, reused as-is)
  B2 = R=80,  peak 0.75, blur sigma 6,  core (255,245,230)
  C2 = R=115, peak 0.95, blur sigma 10, core (255,252,246) — hotter/whiter
  falloff (1-d)^1.6; colour ramp s = (d-0.15)/0.85 (white persists past
  the orb surface, full peach only at the disc edge); angular cosine
  feather on the whisker side; vertical cosine feather y 190..215.

Usage: python3 build_glow_v2.py  (writes frames, GIF, strip, verification)
"""
import json
import math
import os

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
A_PATH = os.path.join(HERE, "kittember-bubbles-clean-20261026.png")
PEACH = np.array([253.0, 213.0, 168.0])

PARAMS = {
    "B2": dict(R=80, peak=0.75, sigma=6.0, core=(255, 245, 230),
                out="kittember-bubbles-clean-glow-v2-20261026.png"),
    "C2": dict(R=115, peak=0.95, sigma=10.0, core=(255, 252, 246),
                out="kittember-bubbles-clean-glow-strong-v2-20261026.png"),
}


def find_orb_centre(img):
    """Centroid of the saturated orange orb in the right half (sanity-check
    against the v1-documented centre (245,125))."""
    a = np.asarray(img.convert("RGBA")).astype(float)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mask = (al > 200) & (r > 200) & (g > 90) & (g < 180) & (b < 90)
    ys, xs = np.where(mask)
    # keep the rightmost large blob: x >= 200
    keep = xs >= 200
    xs, ys = xs[keep], ys[keep]
    return float(xs.mean()), float(ys.mean()), int(len(xs))


def angular_feather(dx, dy):
    """Smooth cosine ramp: 1 pointing right, 0 pointing left, wide band.
    cos(a)=1 -> right, cos(a)=-1 -> left. Ramp over cos in [-0.35, 0.35]
    with a raised-cosine profile, so no step anywhere. At the exact
    centre pixel (no direction) weight is 1, not the cos=0 midpoint."""
    dist = np.sqrt(dx * dx + dy * dy)
    cos_a = np.where(dist > 0, dx / np.maximum(dist, 1e-6), 1.0)
    t = np.clip((cos_a + 0.35) / 0.70, 0.0, 1.0)
    return 0.5 - 0.5 * np.cos(np.pi * t)


def vertical_feather(yy):
    """Smooth cosine ramp keeping glow out of the below-feet zone:
    full strength up to y=190, fading to 0 by y=215. Smooth, never a
    hard cut, so it cannot introduce a square edge."""
    t = np.clip((yy - 190.0) / 25.0, 0.0, 1.0)
    return 1.0 - (0.5 - 0.5 * np.cos(np.pi * t))


def build_glow(size, centre, p):
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    dx, dy = xx - centre[0], yy - centre[1]
    d = np.sqrt(dx * dx + dy * dy) / p["R"]
    d_clip = np.clip(d, 0.0, 1.0)
    # slower falloff than v1's squared curve so the halo stays brighter
    fall = (1.0 - d_clip) ** 1.6 * (d <= 1.0)
    alpha = fall * p["peak"] * angular_feather(dx, dy) * vertical_feather(yy)
    # colour: white persists past the orb surface, then grades to peach.
    # s starts at d=0.15 so the visible inner ring (orb edge) is still
    # near-white, reaching full peach only at the disc edge.
    s = np.clip((d - 0.15) / 0.85, 0.0, 1.0)[..., None]
    core = np.array(p["core"], dtype=float)
    rgb = core[None, None, :] * (1.0 - s) + PEACH[None, None, :] * s
    layer = np.zeros((h, w, 4), dtype=np.uint8)
    layer[..., 0] = rgb[..., 0]
    layer[..., 1] = rgb[..., 1]
    layer[..., 2] = rgb[..., 2]
    layer[..., 3] = (alpha * 255).astype(np.uint8)
    im = Image.fromarray(layer, "RGBA")
    if p["sigma"] > 0:
        im = im.filter(ImageFilter.GaussianBlur(p["sigma"]))
    # re-apply the vertical feather AFTER blur so blur spill cannot leak
    # below the feet zone; the 25px cosine ramp stays smooth, no step.
    arr = np.asarray(im).astype(float)
    yy2 = np.mgrid[0:h, 0:w][0].astype(float)
    arr[..., 3] *= vertical_feather(yy2)
    im = Image.fromarray(arr.astype(np.uint8), "RGBA")
    return im


def verify(base, out_img, glow_img, centre, p, tag):
    b = np.asarray(base.convert("RGBA")).astype(int)
    o = np.asarray(out_img.convert("RGBA")).astype(int)
    g = np.asarray(glow_img.convert("RGBA")).astype(float)
    opaque = b[..., 3] == 255
    changed_opaque = int(np.any(b[opaque] != o[opaque], axis=1).sum())
    near_white = lambda arr: (arr[..., 3] > 0) & (arr[..., :3].min(axis=2) >= 240)
    nw_b, nw_o = near_white(b), near_white(o)
    new_white = nw_o & ~nw_b
    h, w = b.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    dist = np.sqrt((xx - centre[0]) ** 2 + (yy - centre[1]) ** 2)
    # core-white: new near-white inside 0.35R of centre (intended hot core)
    core_white = new_white & (dist <= 0.35 * p["R"])
    outside = new_white & (dist > p["R"] + 2 * p["sigma"])
    # edge profiles sampled on the GLOW LAYER ALONE (composite hits the
    # opaque figure and would pollute the readings)
    prof = {}
    for name, ang in [("right", 0.0), ("down-right", 45.0), ("down", 90.0),
                      ("left", 180.0)]:
        th = math.radians(ang)
        vals = []
        for frac in [0.0, 0.25, 0.5, 0.75, 0.9, 1.0, 1.1]:
            x = int(round(centre[0] + math.cos(th) * p["R"] * frac))
            y = int(round(centre[1] + math.sin(th) * p["R"] * frac))
            if 0 <= x < w and 0 <= y < h:
                vals.append(int(g[y, x, 3]))
            else:
                vals.append(None)  # off-canvas (orb sits near right edge)
        prof[name] = vals
    steps = []
    for vals in prof.values():
        seq = [v for v in vals if v is not None]
        steps += [abs(seq[i + 1] - seq[i]) for i in range(len(seq) - 1)]
    corners = [int(g[0, 0, 3]), int(g[0, w - 1, 3]),
               int(g[h - 1, 0, 3]), int(g[h - 1, w - 1, 3])]
    # whisker-side check: max glow alpha with x < 180
    whisker_max = int(g[:, :180, 3].max())
    # below-feet check: max glow alpha with y > 200
    feet_max = int(g[201:, :, 3].max())
    # angular profile: glow alpha at fixed 0.5R across directions 0..180 deg
    # (proves the whisker-side fade is a smooth angular ramp, not a cut)
    ang_prof = []
    for adeg in range(0, 181, 15):
        th = math.radians(adeg)
        x = int(round(centre[0] + math.cos(th) * p["R"] * 0.5))
        y = int(round(centre[1] + math.sin(th) * p["R"] * 0.5))
        ang_prof.append(int(g[y, x, 3]) if 0 <= x < w and 0 <= y < h else None)
    # visible-ring whiteness: mean min-channel of composited pixels where
    # the glow is visible (glow alpha > 30) and the figure is transparent
    vis = (g[..., 3] > 30) & (b[..., 3] == 0)
    ring_white = float(o[..., :3][vis].min(axis=1).mean()) if vis.any() else 0.0
    # max glow alpha strictly below the feather band (y > 215)
    below_band = int(g[216:, :, 3].max())
    return {
        "tag": tag, "changed_opaque_px": changed_opaque,
        "near_white_base": int(nw_b.sum()), "near_white_out": int(nw_o.sum()),
        "new_white_px": int(new_white.sum()),
        "core_white_px_intended": int(core_white.sum()),
        "new_white_outside_disc": int(outside.sum()),
        "glow_alpha_corners_TL_TR_BL_BR": corners,
        "glow_alpha_max_whisker_side_x_lt_180": whisker_max,
        "glow_alpha_max_below_feet_y_gt_200": feet_max,
        "glow_alpha_max_below_feather_band_y_gt_215": below_band,
        "visible_ring_mean_min_channel": round(ring_white, 1),
        "edge_profiles_glow_alpha": prof,
        "angular_profile_alpha_at_0.5R_deg0_to_180": ang_prof,
    }


def main():
    base = Image.open(A_PATH).convert("RGBA")
    cx, cy, n = find_orb_centre(base)
    centre = (cx, cy)
    print(f"orb centre measured: ({cx:.1f}, {cy:.1f}) from {n} orb px")
    results = {}
    frames = {"A": base}
    for tag, p in PARAMS.items():
        glow = build_glow(base.size, centre, p)
        out = Image.new("RGBA", base.size, (0, 0, 0, 0))
        out.alpha_composite(glow)
        out.alpha_composite(base)
        out.save(os.path.join(HERE, p["out"]))
        frames[tag] = out
        results[tag] = verify(base, out, glow, centre, p, tag)
        print(tag, json.dumps(results[tag], indent=1))
    # cycle GIF A -> B2 -> C2 -> B2 -> A, 500ms/frame
    gif_frames = [frames["A"], frames["B2"], frames["C2"], frames["B2"], frames["A"]]
    gif_frames[0].save(
        os.path.join(HERE, "kittember-illumination-cycle-glow-v2-20261026.gif"),
        save_all=True, append_images=gif_frames[1:], duration=500, loop=0)
    # strip on black
    strip = Image.new("RGBA", (base.width * 5, base.height), (0, 0, 0, 255))
    for i, f in enumerate(gif_frames):
        strip.alpha_composite(f, (i * base.width, 0))
    strip.convert("RGB").save(
        os.path.join(HERE, "kittember-illumination-cycle-glow-v2-20261026-strip-onblack.png"))
    with open(os.path.join(HERE, "glow-v2-verification.json"), "w") as fh:
        json.dump({"orb_centre": [cx, cy], "params": PARAMS, "results": results},
                  fh, indent=1, default=str)
    print("done.")


if __name__ == "__main__":
    main()
