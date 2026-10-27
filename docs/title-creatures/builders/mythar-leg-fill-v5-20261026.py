#!/usr/bin/env python3
"""Mythar leg-only fill v5 (staged only).

Mars rejected v4 (2026-10-26 ~17:55 CDT): v4 filled the WRONG gaps (wing gaps
and light-ring circle gaps that had to stay removed). Corrected order: go back
to V3, fill HIS LEGS ONLY.

Leg location (measured from the shipped image, not guessed):
- The figure's two front legs hang beneath the body and separate from the
  body mass at y~280 (left) / y~290 (right), verified from opaque-mask row
  runs. LEFT leg: bbox x149-178, y280-349. RIGHT leg: bbox x247-278,
  y290-349. The central tail (x~185-245) and the gold ring/V are NOT legs
  and are excluded. Two small pale fragments at the very bottom centre
  (x183-192, x234-243, y338-349) are also excluded (not front legs).
- Why the legs read as "barely visible / colour removed": inside those leg
  shapes, 82%+ of shipped pixels are PARTIAL alpha (left 1220/1491, right
  ~1100/1400) — the legs are mostly semi-transparent in the shipped file
  itself (u2netp mask), so they render faint. v3 removed NOTHING inside the
  leg shapes (0 px), so the fix is to make the leg shapes solid, not to
  restore removed pixels.

Changes (all inside the two leg shapes, nothing else):
(a) restore: leg-shape pixels opaque in shipped but transparent in v3 ->
    exact shipped RGBA (measured: 0 such pixels; implemented anyway).
(b) solidify: leg-shape pixels with 0 < alpha < 255 -> alpha 255, RGB
    unchanged (each pixel keeps its OWN colour; no hue invented).
(c) holes: enclosed transparent pixels inside the leg bboxes (left 12 px
    near the left paw, right 15 px near the right paw) -> iterative
    neighbour-mean fill from adjacent leg pixels, alpha 255.

Guardrails verified on reload: wing/ring gap pixels (the v3 removed set,
1871 px, y207-253) 0 changed; gold pixels 0 changed; every changed pixel
inside a leg shape; everything else byte-identical to v3.
CPU-only: 434x350 PNG work; a GPU genuinely cannot help this step.
"""
from PIL import Image
import numpy as np
from scipy import ndimage
import json

W = '/home/hatch/workspace/mochiichao-work/title-creatures-9/work/'
SHIP = '/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/src/assets/title/mythar-walk-cutout.png'

ship = np.array(Image.open(SHIP).convert('RGBA')).astype(int)
v3 = np.array(Image.open(W + 'mythar-white-removed-v3-20261026.png').convert('RGBA')).astype(int)
assert ship.shape == v3.shape == (350, 434, 4)
sa, v3a = ship[:, :, 3] > 0, v3[:, :, 3] > 0
removed = sa & ~v3a  # wing/flank/ring gap pixels removed in v3 (1871 px)

LEGS = {
    'LEFT':  (149, 178, 280, 349),
    'RIGHT': (247, 278, 290, 349),
}
out = v3.copy()
report = {'legs': {}, 'guardrails': {}}
total_changed = 0

for name, (x0, x1, y0, y1) in LEGS.items():
    box = (slice(y0, y1 + 1), slice(x0, x1 + 1))
    s = sa[box]
    shape = s  # leg shape = shipped alpha>0 pixels inside the tight bbox
    a3 = v3[box][:, :, 3]
    # (a) restore
    restore = shape & (a3 == 0) & ~np.zeros_like(shape, dtype=bool)  # placeholder, refined below
    # restore = shipped-opaque but v3-transparent, excluding enclosed holes (handled in (c))
    # enclosed holes: v3-transparent pixels in the box not reachable from the box border
    transp = ~v3a[box]
    seed = np.zeros_like(transp)
    seed[0, :] = transp[0, :]; seed[-1, :] = transp[-1, :]
    seed[:, 0] = transp[:, 0]; seed[:, -1] = transp[:, -1]
    reached = ndimage.binary_propagation(seed, mask=transp)
    holes = transp & ~reached
    restore = shape & (v3[box][:, :, 3] == 0) & ~holes
    # (b) solidify partial-alpha leg pixels (own RGB kept)
    solid = shape & (a3 > 0) & (a3 < 255)
    # apply restore + solidify (use index arrays: boolean fancy-index
    # getitem returns a copy, so channel assignment must go through indices)
    sub = out[box]
    sub[restore] = ship[box][restore]
    ys, xs = np.where(solid)
    sub[ys, xs, 3] = 255
    out[box] = sub
    # (c) fill holes by iterative neighbour-mean diffusion from known pixels
    known = ~holes
    fill = out[box].copy()
    cur = fill[:, :, :3].astype(float)
    known_mask = known.copy()
    # seed known colours from current (post-restore/solidify) box
    for _ in range(200):
        if not np.any(holes & ~known_mask):
            break
        # mean of known 4-neighbours for unknown hole pixels
        acc = np.zeros_like(cur); cnt = np.zeros(cur.shape[:2])
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            shifted_known = np.roll(known_mask, (dy, dx), axis=(0, 1))
            shifted_col = np.roll(cur, (dy, dx), axis=(0, 1))
            # zero out wrapped edges
            if dy == 1: shifted_known[0, :] = False
            if dy == -1: shifted_known[-1, :] = False
            if dx == 1: shifted_known[:, 0] = False
            if dx == -1: shifted_known[:, -1] = False
            acc[shifted_known] += shifted_col[shifted_known]
            cnt += shifted_known
        target = holes & ~known_mask & (cnt > 0)
        cur[target] = acc[target] / cnt[target][:, None]
        known_mask |= target
    filled = holes & known_mask
    fill[filled, :3] = np.round(cur[filled]).astype(int)
    fill[filled, 3] = 255
    out[box] = fill
    # per-leg colour samples (shipped leg pixels in the box)
    px = ship[box][shape][:, :3]
    m = px.mean(axis=1); spread = px.max(axis=1) - px.min(axis=1)
    pale = px[(m > 165) & (spread < 55) & (px[:, 2] > 110)]
    report['legs'][name] = {
        'bbox': [x0, x1, y0, y1],
        'shape_px': int(shape.sum()),
        'partial_alpha_px': int(solid.sum()),
        'restore_px': int(restore.sum()),
        'hole_px': int(filled.sum()),
        'changed_px': int(restore.sum() + solid.sum() + filled.sum()),
        'pale_leg_median_rgb': [float(v) for v in np.median(pale, axis=0)] if len(pale) else None,
        'pale_leg_count': int(len(pale)),
        'hole_fill_mean_rgb': [float(v) for v in np.mean(cur[filled], axis=0)] if filled.sum() else None,
    }
    total_changed += int(restore.sum() + solid.sum() + filled.sum())

# ---- verification on the saved result ----
Image.fromarray(out.astype('uint8')).save(W + 'mythar-leg-fill-v5-20261026.png')
v5 = np.array(Image.open(W + 'mythar-leg-fill-v5-20261026.png').convert('RGBA')).astype(int)
diff = np.any(v5 != v3, axis=2)
# every changed pixel inside a leg shape or a leg-box hole?
allowed = np.zeros((350, 434), dtype=bool)
for name, (x0, x1, y0, y1) in LEGS.items():
    box = (slice(y0, y1 + 1), slice(x0, x1 + 1))
    allowed[box] |= sa[box]
    transp = ~v3a[box]
    seed = np.zeros_like(transp)
    seed[0, :] = transp[0, :]; seed[-1, :] = transp[-1, :]
    seed[:, 0] = transp[:, 0]; seed[:, -1] = transp[:, -1]
    reached = ndimage.binary_propagation(seed, mask=transp)
    allowed[box] |= (transp & ~reached)
outside = diff & ~allowed
rgb = v5[:, :, :3]
gold = (rgb[:, :, 0] > 180) & ((rgb[:, :, 0] - rgb[:, :, 2]) > 80) & (rgb[:, :, 1] > 120) & (rgb[:, :, 1] < 220)
gold3 = (v3[:, :, :3][:, :, 0] > 180) & ((v3[:, :, :3][:, :, 0] - v3[:, :, :3][:, :, 2]) > 80) & (v3[:, :, :3][:, :, 1] > 120) & (v3[:, :, :3][:, :, 1] < 220)
report['guardrails'] = {
    'changed_total': int(diff.sum()),
    'changed_outside_leg_shapes': int(outside.sum()),
    'removed_set_changed': int((diff & removed).sum()),
    'gold_pixels_changed': int((np.any(v5 != v3, axis=2) & (gold | gold3)).sum()),
    'v5_opaque': int((v5[:, :, 3] > 0).sum()),
    'v3_opaque': int((v3[:, :, 3] > 0).sum()),
    'shipped_opaque': int(sa.sum()),
}
report['total_changed'] = total_changed
with open(W + 'mythar-leg-fill-v5-20261026.json', 'w') as f:
    json.dump(report, f, indent=2)
print(json.dumps(report, indent=2))
