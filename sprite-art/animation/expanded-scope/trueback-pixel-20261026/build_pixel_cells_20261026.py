#!/usr/bin/env python3
"""STEP 1 — TRUE-BACK PIXEL CONVERSION, 2026-10-26. Staged only, NO PR, NO lock.

Converts the 10 approved smooth 1600x1600 true-back renderings (9 batch PASS +
Razorgater clean retry) to 64x64 pixel-style cells matching the locked sheet
cells' look: transparent background, crisp pixels, palette true to the smooth
original. NO baked shadow is kept in the final cells — shadows are
engine-rendered afterwards, never baked into sheet art (standing rule).
Shadow removal is done in a second pass (see remove_shadow_pass.py notes in
the run log): this builder does background removal + downscale + quantize +
alpha snap only, and writes DRAFT cells for eye-check; the shadow pass then
removes any remaining ground-shadow pixels and the drafts are re-checked.

Background: estimated PER IMAGE from the border median (batch gens ~46 gray,
Razorgater retry ~32 gray) — never a fixed constant. Mask = max channel
difference from the border median > 14. Figure is fit longest-side to 62px,
centered horizontally, bottom-aligned at y=63 (feet at the cell bottom, the
same seating the set builder's compose() expects). Downscale LANCZOS for RGB
and alpha separately; RGB quantized to 64 colors, MEDIANCUT, no dither;
alpha snapped at 128 (crisp pixel edges). Isolated 1px alpha specks dropped.
Razorgater FAILED first attempt is never read here (see SOURCES).
"""
import os, json
import numpy as np
from PIL import Image

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
TB = os.path.join(BASE, "animation/expanded-scope/trueback-20261026")
OUT = os.path.join(BASE, "animation/expanded-scope/trueback-pixel-20261026")
GEN = os.path.join(TB, "gen")
RETRY = os.path.join(TB, "retry")

SOURCES = {
    "reaperdile": os.path.join(GEN, "media-generation-truebacka-reaperdile-20261026-0-6d5db02b-c68a-4620-8ec8-e96b5acae73c.webp"),
    "chromejaww": os.path.join(GEN, "media-generation-truebacka-chromejaww-20261026-0-391858d7-415b-44e2-a591-f4606464d370.webp"),
    "strikechamp": os.path.join(GEN, "media-generation-truebacka-strikechamp-20261026-0-ef4681ed-627e-4eb0-b582-cfdda85c1951.webp"),
    "stormtalon": os.path.join(GEN, "media-generation-truebackb-stormtalon-20261026-0-f8dde49d-ae07-466d-bc25-65a0bf1922fa.webp"),
    "duskfiend": os.path.join(GEN, "media-generation-truebackb-duskfiend-20261026-0-3750a2e5-dccb-4ac6-afa2-b4c9ab13214d.webp"),
    "finblade": os.path.join(GEN, "media-generation-truebackb-finblade-20261026-0-6a36c531-5f02-467a-a9fc-037afc31747a.webp"),
    "mechapion": os.path.join(GEN, "media-generation-truebackb-mechapion-20261026-0-9f331043-2faa-4ccf-a68f-ebdcabeb208d.webp"),
    "wispkin": os.path.join(GEN, "truebackC-wispkin-20261026.webp"),
    "shellguard": os.path.join(GEN, "truebackC-shellguard-20261026.webp"),
    # CLEAN RETRY ONLY — the FAILED jaw attempt (gen/media-generation-truebacka-razorgater-*.webp)
    # is never read, never converted, stays marked FAILED and untouched.
    "razorgater": os.path.join(RETRY, "media-generation-razorgater-trueback-retry-2026-0-b1f32a30-4c5e-4a6e-8daa-c005ce106288.webp"),
}


def drop_singletons(alpha):
    """Remove isolated 1px alpha components (4-connectivity). Returns (cleaned, n_removed)."""
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


def main():
    os.makedirs(os.path.join(OUT, "cells"), exist_ok=True)
    rep_path = os.path.join(OUT, "pixel-conversion-report-20261026.json")
    report = json.load(open(rep_path)) if os.path.exists(rep_path) else {}
    for c, src in SOURCES.items():
        fn0 = f"{c}-back-pixel-20261026.png"
        if os.path.exists(os.path.join(OUT, "cells", fn0)):
            print(c, "exists, skipped (resume)")
            continue
        rgb = np.array(Image.open(src).convert("RGB")).astype(int)
        h, w = rgb.shape[:2]
        border = np.concatenate([rgb[0, :].reshape(-1, 3), rgb[-1, :].reshape(-1, 3),
                                 rgb[:, 0].reshape(-1, 3), rgb[:, -1].reshape(-1, 3)])
        bgmed = np.median(border, axis=0)
        mask = (np.abs(rgb - bgmed).max(axis=2) > 14)
        ys, xs = np.where(mask)
        y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
        crop_rgb = Image.fromarray(rgb[y0:y1 + 1, x0:x1 + 1].astype("uint8"))
        crop_a = Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype("uint8"))
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
        fn = f"{c}-back-pixel-20261026.png"
        final.save(os.path.join(OUT, "cells", fn))
        ab = Image.fromarray((a_clean * 255).astype("uint8")).getbbox()
        ncolors = len(final.convert("RGB").getcolors(maxcolors=100000) or [])
        report[c] = {"source": os.path.relpath(src, BASE), "bg_median": [float(v) for v in bgmed],
                     "source_bbox": [int(x0), int(y0), int(x1), int(y1)],
                     "fitted_size": [nw, nh], "file": fn,
                     "opaque_px": int(a_clean.sum()), "bbox_64": list(ab) if ab else None,
                     "palette_colors": ncolors, "singleton_specks_dropped": int(n_speck)}
        print(c, report[c])
    with open(os.path.join(OUT, "pixel-conversion-report-20261026.json"), "w") as f:
        json.dump(report, f, indent=1)
    print("DRAFT cells written (shadow pass still owed before show-first final).")


if __name__ == "__main__":
    main()
