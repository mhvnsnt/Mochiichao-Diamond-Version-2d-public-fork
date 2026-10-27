#!/usr/bin/env python3
"""Fix enclosed sheet-background spots in 4 title cutouts, scripted only.

Mars feedback (2026-10-25 ~20:53-20:55 CDT, on the PR #51 cutouts):
- Sproutle, Dorowani, Tyrage, Kittember have white spots underneath /
  between feet / between head and tail that must come out.
- Tyrage's GREEN cracks stay; only the white spots between his feet,
  lower body and the cracks come out.
- Shadows come out only where cleanly separable; otherwise they stay.
- Gabu is FINE (Mars correction 21:08 CDT) — Gabu is NOT touched here.
- Mochii (confirmed), Razorgater, Wispkin, Mythar are NOT touched here.

Why flood-fill missed these spots: they are sheet-background islands
enclosed by body / legs / whiskers / tail, so a border flood never
reaches them. They are NOT design whites:
- Their colour is within 12 of the sheet background (spot means are
  1-3 units from bg), while design whites are farther: teeth are
  ~25-28 from bg, Wispkin skull ~29, pale bellies >20.
- Their size is >=30px, while design teeth are <=22px (spot_check
  size-floor lesson, sprite-art lane).

Rule (no hand-painting, no per-pixel edits):
 1. Candidate = opaque pixel with colour distance <12 to that
    sheet's background colour.
 2. Label candidate components (4-connected, BFS).
 3. Remove a component only if size >=30 AND it does not touch the
    trimmed image border (interior island, not an edge highlight).
 4. Shadow pass (separate, conditional): grey pixels (channel
    spread <18, mean brightness 70-215, so white claws/teeth at
    255 are untouched) in the bottom half of the image. This is
    tried, eye-checked on black, and reverted per-creature if it
    damages feet — Mars's "if you can't, leave the shadow" rule.
Outputs use NEW dated filenames, never overwriting a shown file.
"""
import collections, os, sys
import numpy as np
from PIL import Image, ImageFilter

BASE = os.path.expanduser("~/workspace/mochiichao-work/title-creatures-9/cutouts")
OUT = BASE  # new dated filenames in the same folder
# name -> (source file, sheet bg, next version)
CREATURES = {
    "sproutle": ("sproutle-title-cutout-20261025-v3.png", (250, 240, 232), "v4"),
    "dorowani": ("dorowani-title-cutout-20261025-v1.png", (241, 239, 237), "v2"),
    "tyrage": ("tyrage-title-cutout-20261025-v2.png", (239, 250, 241), "v3"),
    "kittember": ("kittember-title-cutout-20261025-v2.png", (241, 239, 240), "v3"),
}

def components(mask):
    ys, xs = np.where(mask)
    s = set(zip(ys.tolist(), xs.tolist()))
    seen = set()
    out = []
    for p in list(s):
        if p in seen:
            continue
        dq = collections.deque([p]); seen.add(p); pts = []
        while dq:
            y, x = dq.popleft(); pts.append((y, x))
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                q = (y + dy, x + dx)
                if q in s and q not in seen:
                    seen.add(q); dq.append(q)
        out.append(pts)
    return out

def main(names, shadow):
    for name in names:
        src, bg, ver = CREATURES[name]
        path = os.path.join(BASE, src)
        im = Image.open(path).convert("RGBA")
        arr = np.asarray(im).astype(int)
        rgb, alpha = arr[:, :, :3], arr[:, :, 3]
        H, W = alpha.shape
        dist = np.sqrt(((rgb - np.array(bg)) ** 2).sum(axis=2))
        cand = (alpha > 10) & (dist < 12)
        removed, kept = [], []
        for pts in components(cand):
            yy = [p[0] for p in pts]; xx = [p[1] for p in pts]
            interior = min(xx) > 2 and min(yy) > 2 and max(xx) < W - 3 and max(yy) < H - 3
            if len(pts) >= 30 and interior:
                removed.append(pts)
            else:
                kept.append(pts)
        out_alpha = alpha.copy()
        for pts in removed:
            for y, x in pts:
                out_alpha[y, x] = 0
        print(f"{name}: spot components removed={len(removed)} px={sum(len(p) for p in removed)} kept={len(kept)}", flush=True)
        for pts in sorted(removed, key=len, reverse=True)[:6]:
            yy = [p[0] for p in pts]; xx = [p[1] for p in pts]
            print(f"    removed size={len(pts)} x{min(xx)}-{max(xx)} y{min(yy)}-{max(yy)}", flush=True)
        shadow_px = 0
        if shadow:
            # Grey, mid-brightness, bottom half only.
            mx = rgb.max(axis=2); mn = rgb.min(axis=2); mean = rgb.mean(axis=2)
            grey = (mx - mn) < 18
            mid = (mean >= 70) & (mean <= 215)
            bottom = np.zeros_like(grey); bottom[H // 2:, :] = True
            smask = (out_alpha > 10) & grey & mid & bottom
            shadow_px = int(smask.sum())
            out_alpha[smask] = 0
            print(f"{name}: shadow pixels removed={shadow_px}", flush=True)
        out = np.asarray(im).copy()
        out[:, :, 3] = out_alpha
        out_im = Image.fromarray(out.astype(np.uint8), "RGBA")
        # 1px alpha feather, then trim (same as the original pass).
        out_im.putalpha(out_im.getchannel("A").filter(ImageFilter.GaussianBlur(1.0)))
        bbox = out_im.getchannel("A").getbbox()
        if bbox:
            out_im = out_im.crop(bbox)
        out_path = os.path.join(OUT, f"{name}-title-cutout-20261025-{ver}.png")
        if os.path.exists(out_path):
            raise SystemExit(f"REFUSING to overwrite existing {out_path}")
        out_im.save(out_path)
        print(f"{name}: -> {out_im.size} {out_path}", flush=True)

if __name__ == "__main__":
    shadow = "--shadow" in sys.argv
    wanted = [a for a in sys.argv[1:] if not a.startswith("--")] or list(CREATURES)
    main(wanted, shadow)
