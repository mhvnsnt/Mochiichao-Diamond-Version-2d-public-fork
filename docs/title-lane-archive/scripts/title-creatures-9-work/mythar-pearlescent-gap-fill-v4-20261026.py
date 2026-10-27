#!/usr/bin/env python3
"""Mythar pearlescent gap-fill v4 (staged only).

Mars direction 2026-10-26 ~17:26 CDT (overrides alpha-only for v4):
fill the remaining gap interiors with the little pearlescent colour he
has on him, so flanks/legs read full and continuous instead of showing
background through holes. RGB fill explicitly authorized by Mars for v4.

Base: v3 (white-removed-v3) + shipped (md5 474b1583464fe377fb32098781b37bcf).
Removed set = shipped opaque AND v3 transparent (expect 1,871 px).
Fill method: iterative nearest-pale-fur diffusion — known colours are
ONLY pale-fur pixels in v3 (opaque, mean>165, spread<55, blue>110, the
same pale-fur definition as v3 notes); each removed pixel, layer by
layer, takes the mean of its already-known neighbours, so colour
gradients inward from the fur edge. No invented hue: every fill colour
derives from his own fur pixels. Filled pixels are a subset of the
shipped-removed set (exactly the set); silhouette of v4 == shipped
silhouette; everything else byte-identical to v3.
"""
import json
from collections import deque
import hashlib
import numpy as np
from PIL import Image

WORK = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/"
SHIPPED = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/src/assets/title/mythar-walk-cutout.png"
V3 = WORK + "mythar-white-removed-v3-20261026.png"
V4 = WORK + "mythar-pearlescent-gap-fill-v4-20261026.png"

sh = np.array(Image.open(SHIPPED).convert("RGBA")).astype(np.int32)
v3 = np.array(Image.open(V3).convert("RGBA")).astype(np.int32)
assert sh.shape == v3.shape == (350, 434, 4), sh.shape
md5 = hashlib.md5(open(SHIPPED, "rb").read()).hexdigest()
print("shipped md5:", md5)
assert md5 == "474b1583464fe377fb32098781b37bcf", "shipped file changed!"

sh_op = sh[:, :, 3] > 0
v3_op = v3[:, :, 3] > 0
removed = sh_op & ~v3_op
print("removed px (shipped opaque, v3 transparent):", int(removed.sum()))
assert int(removed.sum()) == 1871, int(removed.sum())

# Pale-fur definition (same as v3 notes)
rgb = v3[:, :, :3]
mean_ch = rgb.mean(axis=2)
spread = rgb.max(axis=2) - rgb.min(axis=2)
pale_fur = v3_op & (mean_ch > 165) & (spread < 55) & (rgb[:, :, 2] > 110)
print("pale-fur px in v3:", int(pale_fur.sum()))

# Connected components of removed set (4-connectivity) for per-gap reporting
H, W = removed.shape
label = np.zeros((H, W), dtype=np.int32)
cur = 0
for y in range(H):
    for x in range(W):
        if removed[y, x] and label[y, x] == 0:
            cur += 1
            dq = deque([(y, x)])
            label[y, x] = cur
            while dq:
                cy, cx = dq.popleft()
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < H and 0 <= nx < W and removed[ny, nx] and label[ny, nx] == 0:
                        label[ny, nx] = cur
                        dq.append((ny, nx))
print("removed components:", cur)

# Per-gap adjacent pale-fur sample: pale-fur pixels within Chebyshev distance 3
# of the component (dilated mask), from v3.
gaps = []
for c in range(1, cur + 1):
    ys, xs = np.where(label == c)
    n = len(ys)
    if n < 3:
        gaps.append(dict(id=c, n=n, note="tiny, merged into nearest gap for fill reporting"))
        continue
    comp = label == c
    dil = np.zeros_like(comp)
    for dy in range(-3, 4):
        for dx in range(-3, 4):
            ys2 = slice(max(0, dy), H + min(0, dy) if dy < 0 else H)
            xs2 = slice(max(0, dx), W + min(0, dx) if dx < 0 else W)
            ys1 = slice(max(0, -dy), H + min(0, -dy) if -dy < 0 else H)
            xs1 = slice(max(0, -dx), W + min(0, -dx) if -dx < 0 else W)
            dil[ys2, xs2] |= comp[ys1, xs1]
    adj = dil & pale_fur & ~comp
    cols = rgb[adj]
    gaps.append(dict(
        id=c, n=int(n),
        bbox=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
        adj_fur_px=int(adj.sum()),
        adj_mean=[round(float(v), 1) for v in cols.mean(axis=0)] if len(cols) else None,
        adj_median=[int(v) for v in np.median(cols, axis=0)] if len(cols) else None,
        adj_spread=[round(float(v), 1) for v in cols.std(axis=0)] if len(cols) else None,
    ))
for g in gaps:
    print(g)

# Fill: iterative diffusion from pale-fur known pixels only.
filled = v3[:, :, :3].copy()
known = pale_fur.copy()
# Unknown = removed set. Iterate: unknown px with >=1 known 4-neighbour
# takes mean of known neighbours; repeat until none remain.
remaining = removed.copy()
iters = 0
while remaining.any():
    iters += 1
    cand_y, cand_x = np.where(remaining)
    to_fill = []
    for y, x in zip(cand_y, cand_x):
        vals = []
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < H and 0 <= nx < W and known[ny, nx]:
                vals.append(filled[ny, nx])
        if vals:
            to_fill.append((y, x, np.mean(vals, axis=0)))
    assert to_fill, "diffusion stalled with remaining pixels"
    for y, x, col in to_fill:
        filled[y, x] = np.round(col)
        known[y, x] = True
        remaining[y, x] = False
    if iters > 200:
        raise RuntimeError("too many diffusion iterations")
print("diffusion iterations:", iters)

out = v3.copy()
out[removed, :3] = filled[removed]
out[removed, 3] = 255
# Verify: everything else byte-identical to v3
same = ~removed
assert np.array_equal(out[same], v3[same]), "non-gap pixels changed!"
assert np.array_equal(out[removed, 3], np.full(int(removed.sum()), 255))
# Silhouette == shipped silhouette
assert np.array_equal(out[:, :, 3] > 0, sh_op), "v4 silhouette != shipped silhouette"
print("v3 opaque:", int(v3_op.sum()), "-> v4 opaque:", int((out[:, :, 3] > 0).sum()),
      "(shipped:", int(sh_op.sum()), ")")

# Per-gap final fill colours
for g in gaps:
    if g["n"] < 3:
        continue
    cols = out[label == g["id"], :3]
    g["fill_mean"] = [round(float(v), 1) for v in cols.mean(axis=0)]
    g["fill_median"] = [int(v) for v in np.median(cols, axis=0)]

Image.fromarray(out.astype(np.uint8), "RGBA").save(V4)
print("saved", V4)
with open(WORK + "mythar-pearlescent-gap-fill-v4-20261026.json", "w") as f:
    json.dump({
        "shipped_md5": md5,
        "removed_total": int(removed.sum()),
        "v3_opaque": int(v3_op.sum()),
        "v4_opaque": int((out[:, :, 3] > 0).sum()),
        "shipped_opaque": int(sh_op.sum()),
        "diffusion_iterations": iters,
        "gaps": gaps,
        "method": "iterative nearest-pale-fur diffusion; known colours = pale-fur pixels only "
                  "(mean>165, spread<55, blue>110); each removed pixel takes mean of "
                  "already-known 4-neighbours layer by layer; alpha 255 on filled pixels",
    }, f, indent=2)
print("saved json")
