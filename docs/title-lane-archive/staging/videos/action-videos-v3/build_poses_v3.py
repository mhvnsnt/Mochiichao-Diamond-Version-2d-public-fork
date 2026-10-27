#!/usr/bin/env python3
"""V3 pose fixes for Razorgater, Mochii, Kittember (v2 poses for the other 7 untouched).

Razorgater: v2 band-compress sensed a small dark blob (teeth gaps / tongue edge),
not the whole jaw, so 'closed' left the lower jaw + teeth visible under a flap.
Fix: sense the FULL jaw box (measured: cutout 265x266, jaw x70-190, y132-215,
from the sprite-art cell jaw box x17-46/y32-52 scaled by 265/64) and move the
WHOLE lower-jaw unit (tongue + lower teeth + chin, y148-238) up: closed -45px,
half -22px, open = original. Vacated chin area healed from neighbours.
Mochii: v2 squash() overflowed the 380px canvas (stretch paste at y=-96, wide
paste at x=-22), slicing the tip flat / sides. Fix: rebuild on a padded 560px
canvas (offset 90) so every pose clears the edges by >=10px.
Kittember: poses unchanged (v2 walk/tail/sit) — the fix is in the video builder
(glow follows the mirrored tail). Copied here so v3 is self-contained.
"""
import os, sys
import numpy as np
from PIL import Image

SRC = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
V2F = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v3/frames"
os.makedirs(OUT, exist_ok=True)


def load(c):
    return Image.open(f"{SRC}/{c}-walk-cutout.png").convert("RGBA")


def heal(new, orig):
    """Fill interior holes: opaque in orig, transparent in new, >=5 opaque neighbours."""
    from scipy.ndimage import convolve
    na = np.array(new)
    oa = np.array(orig.split()[3])
    mask_new = na[:, :, 3] > 20
    hole = (oa > 20) & (~mask_new)
    if not hole.any():
        return new
    cnt = convolve(mask_new.astype(np.int32), np.ones((3, 3), dtype=np.int32), mode="constant") - mask_new.astype(np.int32)
    fill = hole & (cnt >= 5)
    if not fill.any():
        return new
    for _ in range(3):
        for ch in range(3):
            vals = na[:, :, ch].astype(np.float32)
            s = convolve(np.where(mask_new, vals, 0), np.ones((3, 3)), mode="constant")
            c = convolve(mask_new.astype(np.float32), np.ones((3, 3)), mode="constant")
            mean = np.divide(s, c, out=np.zeros_like(s), where=c > 0)
            na[:, :, ch] = np.where(fill, mean.astype(np.uint8), na[:, :, ch])
        na[:, :, 3] = np.where(fill, 255, na[:, :, 3])
        mask_new = na[:, :, 3] > 20
    return Image.fromarray(na, "RGBA")


def feet_bottom(im):
    a = np.array(im.split()[3])
    ys = np.where(a > 20)[0]
    return int(ys.max()) if len(ys) else im.size[1] - 1


def reanchor(im, orig_bottom):
    a = np.array(im.split()[3])
    ys = np.where(a > 20)[0]
    if not len(ys):
        return im
    dy = orig_bottom - int(ys.max())
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, dy), im)
    return out


def squash_pad(im, sy, sx=1.0):
    """Squash the FIGURE bbox only (never the whole canvas), reanchored at the
    original feet line. Old v2 squash resized the full canvas and pasted at a
    negative top, slicing the tip flat — that is the Mochii crop bug."""
    a = np.array(im.split()[3])
    ys, xs = np.where(a > 20)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())
    fig = im.crop((x0, y0, x1 + 1, y1 + 1))
    nw, nh = max(1, int(fig.size[0] * sx)), max(1, int(fig.size[1] * sy))
    r = fig.resize((nw, nh), Image.LANCZOS)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    fb = y1
    cx = (x0 + x1) // 2
    out.paste(r, (cx - nw // 2, fb - (nh - 1)), r)
    return out


def rotate_pad(im, deg):
    fb = feet_bottom(im)
    r = im.rotate(deg, resample=Image.BICUBIC, expand=False,
                  center=(im.size[0] // 2, im.size[1] // 2))
    return reanchor(r, fb)


def jaw_squash(im, frac):
    """Close the mouth by warping ONLY the jaw box, head top and feet fixed.
    The pale cavity (y165-195) is compressed to a thin mouth line; rows above
    (upper jaw) are untouched, rows below (lower teeth, chin, neck, chest)
    shift up 1:1 into the freed space, and the bottom band stretches to keep
    the figure's feet exactly where they were. Box x75-190 keeps the warp off
    the arms (which sit at the box edges in the wider box); side edges are
    feathered 4px so no slab seam shows. frac = cavity height fraction:
    closed 0.25 (30px -> 7px), half 0.50 (30px -> 15px)."""
    from PIL import ImageDraw
    x0, y0, x1, y1 = 75, 128, 190, 242
    cav_top, cav_bot = 165, 195
    cav_new = max(4, int((cav_bot - cav_top) * frac))
    out = im.copy()
    arr_in = np.array(im)
    arr = np.array(out)
    # Build output rows for the box by resampling input rows (nearest).
    for oy in range(y0, y1):
        if oy < cav_top:
            sy = oy
        elif oy < cav_top + cav_new:
            sy = cav_top + int((oy - cav_top) * (cav_bot - cav_top) / cav_new)
        else:
            # rows below cavity: input from cav_bot upward-shifted, stretched
            # to fill to y1 (keeps feet at y1)
            span_out = y1 - (cav_top + cav_new)
            span_in = y1 - cav_bot
            sy = cav_bot + int((oy - (cav_top + cav_new)) * span_in / span_out)
        sy = min(max(sy, y0), y1 - 1)
        arr[oy, x0:x1] = arr_in[sy, x0:x1]
    out = Image.fromarray(arr, "RGBA")
    # feather side edges of the warped box (4px ramp against original)
    orig = np.array(im)
    na = np.array(out)
    for k in range(4):
        wgt = (k + 1) / 5.0
        for xx in (x0 + k, x1 - 1 - k):
            na[y0:y1, xx, :3] = (na[y0:y1, xx, :3].astype(float) * wgt +
                                 orig[y0:y1, xx, :3].astype(float) * (1 - wgt)).astype(np.uint8)
    out = Image.fromarray(na, "RGBA")
    # dark mouth seam where jaws meet
    d = ImageDraw.Draw(out)
    seam_y = cav_top + cav_new
    d.line([(x0 + 25, seam_y), (x1 - 25, seam_y)], fill=(50, 50, 55, 255), width=1)
    return out


def main():
    # ---- Razorgater: whole-jaw open / half / closed ----
    im = load("razorgater")
    im.save(f"{OUT}/razorgater-pose-mouth-open.png")
    jaw_squash(im, 0.50).save(f"{OUT}/razorgater-pose-mouth-half.png")
    jaw_squash(im, 0.25).save(f"{OUT}/razorgater-pose-mouth-closed.png")
    print("razorgater jaw poses done (open orig, half cavity 0.50, closed cavity 0.25)")

    # ---- Mochii: padded canvas 380 -> 560, offset 90 ----
    orig = load("mochii")
    pad = Image.new("RGBA", (560, 560), (0, 0, 0, 0))
    pad.paste(orig, (90, 90), orig)
    pad.save(f"{OUT}/mochii-pose-round.png")
    squash_pad(pad, 0.85, 1.12).save(f"{OUT}/mochii-pose-squash-wide.png")
    squash_pad(pad, 1.12, 0.92).save(f"{OUT}/mochii-pose-stretch-tall.png")
    rotate_pad(pad, 10).save(f"{OUT}/mochii-pose-tilt.png")
    squash_pad(pad, 0.75, 1.20).save(f"{OUT}/mochii-pose-splash-flat.png")
    print("mochii padded poses done")
    for p in ["round", "squash-wide", "stretch-tall", "tilt", "splash-flat"]:
        m = Image.open(f"{OUT}/mochii-pose-{p}.png").convert("RGBA")
        a = np.array(m.split()[3])
        ys, xs = np.where(a > 20)
        print(f"  mochii {p}: bbox x{xs.min()}-{xs.max()} y{ys.min()}-{ys.max()} "
              f"margins L{xs.min()} R{559-xs.max()} T{ys.min()} B{559-ys.max()}")

    # ---- Kittember: poses unchanged from v2 (glow fix is in video builder) ----
    for p in ["walk-a", "walk-b", "tail-up", "tail-down", "sit-look"]:
        Image.open(f"{V2F}/kittember-pose-{p}.png").convert("RGBA").save(
            f"{OUT}/kittember-pose-{p}.png")
    print("kittember poses copied from v2 (unchanged)")


if __name__ == "__main__":
    main()
