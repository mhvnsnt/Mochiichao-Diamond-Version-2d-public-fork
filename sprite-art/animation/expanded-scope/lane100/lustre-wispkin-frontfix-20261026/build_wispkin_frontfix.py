#!/usr/bin/env python3
"""WISPKIN LUSTRE FRONT-FIX (2026-10-26, Mars diagnosis ~19:37 CDT).

Mars, replying to the Wispkin revision sheet: the Wispkin images on that
sheet are all BACK images, while every other creature shows FRONT images.
A file labeled front is actually a back, and that must be fixed: show his
FRONT images, any of them.

Audit result (measured + eye-verified on the 10-cell contact sheet):
- atlases/wispkin/wispkin_cell_02.png -- labeled battle_front in the
  locked manifest (eye_status "eye_confirmed") -- is actually a BACK
  view: black teardrop + smoke, NO mask face. The trueback pass's own
  note defines the true back as "no face, no mask visible, black teardrop
  + black smoke wisps" -- cell_02 matches that description exactly.
- atlases/wispkin/wispkin_cell_01.png -- labeled overworld_front -- is
  also a back/side-back view (black teardrop, no mask face).
- TRUE FRONTS (white cracked mask face visible): cell_00, 04, 05, 06,
  07, 08, 09. cell_03 (labeled overworld_back) is correctly a back.
- cell_00 is the relabeled battle_front_new from the trueback pass
  (eye verdict "FACE-VISIBLE: white cracked mask face"), so it is the
  front base used here.
- The wrong base is shared by EVERY Wispkin variant set built so far:
  shiny-v2 SOURCE-LINEAGE (cell_02), pilot manifest (cell_02),
  full-510 manifest (cell_02), and the 19:34 revision (cell_02). This
  front-fix rebuilds ONLY the 10 revision variants from the true front;
  the pilot/full Wispkin 10 are reported as sharing the wrong base and
  are NOT silently rebuilt -- the confirmed other 500 looks are untouched.

Front-base palette note: cell_00 quantizes to a near-grayscale ramp, so
mask vs body cannot be split by palette value alone (bright smoke wisps
share the mask's white entries). A measured face-bbox region guard is
used: the mask face's bright core is a 114px component at y 12-26,
x 23-39, so the face bbox is rows 8-38, cols 16-48. Palette entries with
v >= 0.90 count as MASK only inside that bbox; the same entries outside
it (lower smoke wisps) take the body treatment. Mask may recolor per
kind but must stay bright/visible; body values are lifted so colors show.

Staged only. NO PR, NO lock. Show-first.
Pixel work is local CPU -- GPU genuinely cannot help, no Kaggle job.
"""
import colorsys
import json
import os
from PIL import Image, ImageDraw
import numpy as np

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art')
EXP = os.path.join(BASE, 'animation/expanded-scope')
OUT = os.path.join(EXP, 'lane100', 'lustre-wispkin-frontfix-20261026')
OLD_DIR = os.path.join(EXP, 'lane100', 'lustre-wispkin-revision-20261026')
os.makedirs(OUT, exist_ok=True)

# TRUE FRONT base: relabeled battle_front_new (trueback pass).
# Deliberately NOT shiny-v2 SOURCE-LINEAGE cell_02: that file is a back.
SRC = 'atlases/wispkin/wispkin_cell_00.png'
FACE_BBOX = (8, 38, 16, 48)  # y0, y1, x0, x1 (exclusive end)

ORDER = ['solar', 'lunar', 'prism', 'bare', 'clothed',
         'showtime', 'iron', 'ember', 'night', 'parade']


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def to_hsv(rgb):
    return colorsys.rgb_to_hsv(*[c / 255.0 for c in rgb])


def to_rgb(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (int(round(r * 255)), int(round(g * 255)), int(round(b * 255)))


def lum(rgb):
    def f(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


# --- load true-front base, quantize, classify mask vs body ---
base = Image.open(os.path.join(BASE, SRC)).convert('RGBA')
alpha = np.array(base.split()[3])
opaque = alpha >= 200
q = base.convert('RGB').quantize(colors=16, method=Image.MEDIANCUT)
pal = q.getpalette()[:48]
palette = [tuple(pal[i * 3:i * 3 + 3]) for i in range(16)]
idx = np.array(q, dtype=np.uint8)

mask_idx, body_idx = [], []
for i, rgb in enumerate(palette):
    h, s, v = to_hsv(rgb)
    if v >= 0.90:
        mask_idx.append(i)
    else:
        body_idx.append(i)
print('mask palette idx:', mask_idx, 'body palette idx:', body_idx)
for i, rgb in enumerate(palette):
    h, s, v = to_hsv(rgb)
    print(f'  pal {i:2d} {rgb} h={h*360:4.0f} s={s:.2f} v={v:.2f} -> '
          f'{"MASK-in-bbox" if i in mask_idx else "body"}')

# Per-pixel class map: mask only for mask entries INSIDE the face bbox.
y0, y1, x0, x1 = FACE_BBOX
yy, xx = np.mgrid[0:64, 0:64]
in_bbox = (yy >= y0) & (yy < y1) & (xx >= x0) & (xx < x1)
is_mask_px = np.isin(idx, mask_idx) & in_bbox & opaque
is_body_px = opaque & ~is_mask_px
print('mask px (in bbox):', int(is_mask_px.sum()),
      'body px:', int(is_body_px.sum()))

BODY_VMAX = max(to_hsv(palette[i])[2] for i in body_idx)
MASK_VMIN = min(to_hsv(palette[i])[2] for i in mask_idx)
print('BODY_VMAX:', round(BODY_VMAX, 3), 'MASK_VMIN:', round(MASK_VMIN, 3))


def body_v(orig_v, lo, hi):
    return clamp(lo + (orig_v / BODY_VMAX) * (hi - lo))


def mask_v(orig_v, lo=0.92, hi=1.00):
    span = 0.98 - MASK_VMIN
    return clamp(lo + ((orig_v - MASK_VMIN) / span) * (hi - lo)) if span > 0 else 0.96


def body_simple(hue, sat, lo, hi):
    def fn(h, s, v):
        return hue / 360, sat, body_v(v, lo, hi)
    return fn


def mask_simple(hue, sat):
    def fn(h, s, v):
        return hue / 360, sat, mask_v(v)
    return fn


KINDS = {
    'solar':    (body_simple(40, 0.80, 0.45, 0.70), mask_simple(45, 0.30), None),
    'lunar':    (body_simple(230, 0.75, 0.45, 0.70), mask_simple(220, 0.25), None),
    'prism':    (None, mask_simple(320, 0.15), None),
    'bare':     (body_simple(35, 0.35, 0.45, 0.62), mask_simple(40, 0.18), None),
    'clothed':  (body_simple(205, 0.85, 0.42, 0.65), mask_simple(200, 0.20), None),
    'showtime': (body_simple(340, 0.90, 0.55, 0.78), mask_simple(340, 0.10), 'brighten'),
    'iron':     (body_simple(210, 0.50, 0.48, 0.72), mask_simple(210, 0.10), None),
    'ember':    (body_simple(20, 0.85, 0.45, 0.70), mask_simple(30, 0.30), None),
    'night':    (body_simple(250, 0.75, 0.35, 0.55), mask_simple(190, 0.25), 'glow'),
    'parade':   (None, mask_simple(45, 0.25), None),
}


def prism_body(h, s, v):
    band = 280 / 360 if v < 0.08 else (190 / 360 if v < 0.16 else 320 / 360)
    return band, 0.85, body_v(v, 0.50, 0.72)


def parade_body(h, s, v):
    if v < 0.12:
        return 280 / 360, 0.85, body_v(v, 0.50, 0.65)
    return 45 / 360, 0.80, body_v(v, 0.60, 0.72)


KINDS['prism'] = (prism_body, KINDS['prism'][1], None)
KINDS['parade'] = (parade_body, KINDS['parade'][1], None)


def build(kind):
    body_fn, mask_fn, rim = KINDS[kind]
    new_pal = []
    for i, rgb in enumerate(palette):
        h, s, v = to_hsv(rgb)
        nh, ns, nv = mask_fn(h, s, v) if i in mask_idx else body_fn(h, s, v)
        new_pal.append(to_rgb(nh, ns, nv))
    pal_arr = np.array(new_pal, dtype=np.uint8)
    arr = np.zeros((64, 64, 4), dtype=np.uint8)
    arr[..., 0] = pal_arr[idx, 0]
    arr[..., 1] = pal_arr[idx, 1]
    arr[..., 2] = pal_arr[idx, 2]
    arr[..., 3] = alpha
    # Region guard: mask-entry pixels OUTSIDE the face bbox take body treatment.
    guard = np.isin(idx, mask_idx) & ~in_bbox & opaque
    if guard.any():
        for (gy, gx) in np.argwhere(guard):
            h, s, v = to_hsv(tuple(palette[idx[gy, gx]]))
            nh, ns, nv = body_fn(h, s, v)
            arr[gy, gx, :3] = to_rgb(nh, ns, nv)
    if rim:
        op = opaque
        edge = np.zeros_like(op)
        edge[1:, :] |= op[1:, :] & ~op[:-1, :]
        edge[:-1, :] |= op[:-1, :] & ~op[1:, :]
        edge[:, 1:] |= op[:, 1:] & ~op[:, :-1]
        edge[:, :-1] |= op[:, :-1] & ~op[:, 1:]
        rim_px = edge & is_body_px
        if rim == 'brighten':
            rgb_f = arr[..., :3].astype(float) / 255.0
            flat = rgb_f[rim_px]
            for j, (r, g, b) in enumerate(flat):
                h, s, v = colorsys.rgb_to_hsv(r, g, b)
                nr, ng, nb = colorsys.hsv_to_rgb(h, s, clamp(v + 0.15, hi=0.95))
                flat[j] = (nr, ng, nb)
            rgb_f[rim_px] = flat
            arr[..., :3] = (rgb_f * 255).round().astype(np.uint8)
        elif rim == 'glow':
            arr[rim_px, 0] = 153
            arr[rim_px, 1] = 235
            arr[rim_px, 2] = 255
    return Image.fromarray(arr, 'RGBA'), new_pal


def hexcol(rgb):
    return '#%02x%02x%02x' % rgb


def swatch(palette_, path, cell=16):
    im = Image.new('RGB', (cell * len(palette_), cell), (255, 255, 255))
    px = im.load()
    for i, c in enumerate(palette_):
        for y in range(cell):
            for x in range(cell):
                px[i * cell + x, y] = c
    im.save(path)


base_arr = np.array(base)
manifest = {
    'base_source': SRC,
    'base_source_note': 'TRUE FRONT: relabeled battle_front_new (trueback pass, '
                        'eye verdict FACE-VISIBLE). Replaces mislabeled '
                        'atlases/wispkin/wispkin_cell_02.png (labeled battle_front, '
                        'actually a back view).',
    'face_bbox': {'y0': y0, 'y1': y1, 'x0': x0, 'x1': x1},
    'mask_palette_idx': mask_idx,
    'body_palette_idx': body_idx,
    'supersedes': 'lustre-wispkin-revision-20261026/wispkin-lustre-rev-* '
                  '(10 back-based revision variants); other 500 LUSTRE looks untouched; '
                  'pilot/full Wispkin 10 share the same wrong cell_02 base (reported, '
                  'not silently rebuilt)',
    'variants': {},
}
for kind in ORDER:
    img, new_pal = build(kind)
    img.save(os.path.join(OUT, f'wispkin-lustre-frontfix-{kind}.png'))
    swatch(new_pal, os.path.join(OUT, f'wispkin-lustre-frontfix-{kind}-swatch.png'))
    new_arr = np.array(img)
    m_mean = new_arr[is_mask_px][:, :3].mean(axis=0)
    b_mean = new_arr[is_body_px][:, :3].mean(axis=0)
    m_v = float(np.mean([to_hsv(tuple(p))[2] for p in new_arr[is_mask_px][:, :3]]))
    b_v = float(np.mean([to_hsv(tuple(p))[2] for p in new_arr[is_body_px][:, :3]]))
    ratio = contrast(lum(tuple(m_mean.round().astype(int))),
                     lum(tuple(b_mean.round().astype(int))))
    px_changed = float((np.any(new_arr[..., :3] != base_arr[..., :3], axis=2)
                        & opaque).sum() / opaque.sum())
    old_path = os.path.join(OLD_DIR, f'wispkin-lustre-rev-{kind}.png')
    old_changed = None
    if os.path.exists(old_path):
        old_arr = np.array(Image.open(old_path).convert('RGBA'))
        old_changed = float((np.any(new_arr[..., :3] != old_arr[..., :3], axis=2)
                             & opaque).sum() / opaque.sum())
    manifest['variants'][kind] = {
        'palette_before': [hexcol(c) for c in palette],
        'palette_after': [hexcol(c) for c in new_pal],
        'palette_changed': sum(1 for a, b in zip(palette, new_pal) if a != b),
        'mask_mean_rgb': [int(x) for x in m_mean],
        'body_mean_rgb': [int(x) for x in b_mean],
        'mask_mean_v': round(m_v, 3),
        'body_mean_v': round(b_v, 3),
        'mask_body_contrast_ratio': round(ratio, 2),
        'px_changed_vs_base': round(px_changed, 3),
        'px_changed_vs_old_revision': round(old_changed, 3) if old_changed is not None else None,
    }
    print(f'{kind:9s} pal_changed={manifest["variants"][kind]["palette_changed"]}/16 '
          f'mask_v={m_v:.2f} body_v={b_v:.2f} contrast={ratio:.2f} '
          f'px_vs_base={px_changed:.3f} px_vs_old={old_changed}')

seen = {}
coll = []
for kind, v in manifest['variants'].items():
    key = tuple(v['palette_after'])
    if key in seen:
        coll.append((seen[key], kind))
    seen[key] = kind
print('identical-palette collisions:', coll if coll else 'NONE')

for kind, v in manifest['variants'].items():
    assert v['palette_changed'] == 16, f'{kind}: palette_changed {v["palette_changed"]} != 16'
    assert v['px_changed_vs_base'] >= 0.95, f'{kind}: px_vs_base {v["px_changed_vs_base"]} < 0.95'
    assert v['mask_body_contrast_ratio'] >= 3.0, f'{kind}: contrast {v["mask_body_contrast_ratio"]} < 3.0'
    assert v['mask_mean_v'] >= 0.90, f'{kind}: mask_v {v["mask_mean_v"]} < 0.90'
print('GATES PASS: 16/16 palette, >=95% px changed, contrast >= 3.0, mask_v >= 0.90, all 10 kinds')

json.dump(manifest, open(os.path.join(OUT, 'wispkin-lustre-frontfix-manifest-20261026.json'), 'w'), indent=2)

# Show sheet: rows = kinds, cols = TRUE-FRONT BASE | OLD (back-based revision) | NEW (front-based)
TILE = 64
LABEL_H = 16
sheet = Image.new('RGBA', (3 * (TILE + 8) + 8, len(ORDER) * (TILE + LABEL_H + 4) + LABEL_H + 8),
                  (255, 255, 255, 255))
d = ImageDraw.Draw(sheet)
for ci, htxt in enumerate(['BASE (true front)', 'OLD (back-based)', 'NEW (front-based)']):
    d.text((8 + ci * (TILE + 8) + 4, 4), htxt, fill=(0, 0, 0))
for ri, kind in enumerate(ORDER):
    y0s = LABEL_H + 8 + ri * (TILE + LABEL_H + 4)
    d.text((8, y0s + TILE + 2), kind.upper(), fill=(0, 0, 0))
    tiles = [base,
             Image.open(os.path.join(OLD_DIR, f'wispkin-lustre-rev-{kind}.png')).convert('RGBA'),
             Image.open(os.path.join(OUT, f'wispkin-lustre-frontfix-{kind}.png')).convert('RGBA')]
    for ci, im in enumerate(tiles):
        t = im.resize((TILE, TILE), Image.NEAREST)
        x = 8 + ci * (TILE + 8)
        sheet.paste(t, (x, y0s), t)
sheet.save(os.path.join(OUT, 'wispkin-frontfix-show-sheet-20261026.png'))
print('sheet saved')
