#!/usr/bin/env python3
"""SHADOW PASS — removes baked ground shadows from the 3 draft pixel cells
that have them (reaperdile ellipse, chromejaww bar, razorgater blob), then
re-runs the pixel conversion for those 3 creatures only.

Why full-res flat-run detection: at 64px the shadow shares the body's
silver-gray, so color alone cannot separate them. At full res the shadow
is a FLAT neutral gray (brightness varies < 12 across runs of 120+ px),
while body shading gradients, teal lines, and claws break flatness. Rule,
applied only in the bottom 200 rows of the figure bbox:
  a run of consecutive figure pixels is shadow iff it is neutral
  (channel spread < 12), mid-bright (85-170), >= 120px long, and flat
  (max-min brightness < 12 across the run).
Removed pixels are cut from the figure mask before downscale; everything
else in the conversion is identical to build_pixel_cells_20261026.py, so
the shadowfree cells differ from the drafts ONLY by the removed shadow.

Outputs: cells/<creature>-back-pixel-shadowfree-20261026.png (new files;
drafts untouched) + shadow-pass-report-20261026.json. The other 7
creatures have no ground shadow in their smooth originals (verified by
eye on the draft sheet) and get no shadowfree file — Step 2 uses their
draft cells and records that.
"""
import os, json
import numpy as np
from PIL import Image

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
PIX = os.path.join(BASE, "animation/expanded-scope/trueback-pixel-20261026")
TB = os.path.join(BASE, "animation/expanded-scope/trueback-20261026")

SOURCES = {
    "reaperdile": os.path.join(TB, "gen/media-generation-truebacka-reaperdile-20261026-0-6d5db02b-c68a-4620-8ec8-e96b5acae73c.webp"),
    "chromejaww": os.path.join(TB, "gen/media-generation-truebacka-chromejaww-20261026-0-391858d7-415b-44e2-a591-f4606464d370.webp"),
    "razorgater": os.path.join(TB, "retry/media-generation-razorgater-trueback-retry-2026-0-b1f32a30-4c5e-4a6e-8daa-c005ce106288.webp"),
}


def drop_singletons(alpha):
    h, w = alpha.shape
    seen = np.zeros_like(alpha, dtype=bool)
    out = alpha.copy()
    removed = 0
    for y in range(h):
        for x in range(w):
            if alpha[y, x] and not seen[y, x]:
                stack = [(y, x)]
                seen[y, x] = True
                pts = []
                while stack:
                    cy, cx = stack.pop()
                    pts.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            stack.append((ny, nx))
                if len(pts) == 1:
                    out[pts[0]] = 0
                    removed += 1
    return out, removed


def shadow_runs(row_mask, row_spread, row_bright, min_len=120):
    """Return a boolean array: True where the pixel belongs to a flat,
    neutral, mid-bright run of >= min_len in this row."""
    n = len(row_mask)
    out = np.zeros(n, dtype=bool)
    x = 0
    cand = row_mask & (row_spread < 12) & (row_bright >= 85) & (row_bright <= 170)
    while x < n:
        if not cand[x]:
            x += 1
            continue
        x1 = x
        while x1 < n and cand[x1]:
            x1 += 1
        run = row_bright[x:x1]
        if (x1 - x >= min_len) and (run.max() - run.min() < 12):
            out[x:x1] = True
        x = x1
    return out


def main():
    report = {}
    for c, src in SOURCES.items():
        rgb = np.array(Image.open(src).convert("RGB")).astype(int)
        border = np.concatenate([rgb[0, :].reshape(-1, 3), rgb[-1, :].reshape(-1, 3),
                                 rgb[:, 0].reshape(-1, 3), rgb[:, -1].reshape(-1, 3)])
        bgmed = np.median(border, axis=0)
        mask = (np.abs(rgb - bgmed).max(axis=2) > 14)
        ys, xs = np.where(mask)
        ybot = ys.max()
        spread = rgb.max(axis=2) - rgb.min(axis=2)
        bright = rgb.mean(axis=2)
        shadow = np.zeros_like(mask)
        for y in range(max(0, ybot - 199), ybot + 1):
            shadow[y] = shadow_runs(mask[y], spread[y], bright[y])
        n_shadow = int(shadow.sum())
        mask2 = mask & ~shadow
        ys2, xs2 = np.where(mask2)
        y0, y1, x0, x1 = ys2.min(), ys2.max(), xs2.min(), xs2.max()
        crop_rgb = Image.fromarray(rgb[y0:y1 + 1, x0:x1 + 1].astype("uint8"))
        crop_a = Image.fromarray((mask2[y0:y1 + 1, x0:x1 + 1] * 255).astype("uint8"))
        cw, ch = crop_rgb.size
        scale = 62.0 / max(cw, ch)
        nw, nh = max(1, round(cw * scale)), max(1, round(ch * scale))
        small_rgb = crop_rgb.resize((nw, nh), Image.LANCZOS)
        small_a = crop_a.resize((nw, nh), Image.LANCZOS)
        canvas = Image.new("RGB", (64, 64), (0, 0, 0))
        canvas.paste(small_rgb, ((64 - nw) // 2, 64 - nh))
        acanvas = Image.new("L", (64, 64), 0)
        acanvas.paste(small_a, ((64 - nw) // 2, 64 - nh))
        quant = canvas.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
        a = np.array(acanvas)
        a_snapped = np.where(a >= 128, 255, 0).astype("uint8")
        a_clean, n_speck = drop_singletons(a_snapped > 0)
        final = quant.copy()
        final.putalpha(Image.fromarray((a_clean * 255).astype("uint8")))
        fn = f"{c}-back-pixel-shadowfree-20261026.png"
        final.save(os.path.join(PIX, "cells", fn))
        ab = Image.fromarray((a_clean * 255).astype("uint8")).getbbox()
        report[c] = {"source": os.path.relpath(src, BASE), "shadow_px_removed_fullres": n_shadow,
                     "shadow_rows": [int(ybot - 199), int(ybot)], "file": fn,
                     "new_bbox": [int(x0), int(y0), int(x1), int(y1)],
                     "opaque_px": int(a_clean.sum()), "bbox_64": list(ab) if ab else None,
                     "singleton_specks_dropped": int(n_speck)}
        print(c, report[c])
    with open(os.path.join(PIX, "shadow-pass-report-20261026.json"), "w") as f:
        json.dump(report, f, indent=1)
    print("Shadowfree cells written; drafts untouched.")


if __name__ == "__main__":
    main()
