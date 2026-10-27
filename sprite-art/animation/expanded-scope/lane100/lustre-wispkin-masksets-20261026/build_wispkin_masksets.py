#!/usr/bin/env python3
"""WISPKIN MASK SETS 2 + 3 (2026-10-26, Mars expansion ~19:45 CDT).

SUPERSEDES the 6-white/4-as-is split (dropped, never built). Nothing
confirmed is replaced: these are EXTRA variant sets alongside the
confirmed front-fix 10 (Mars confirmed the front-fix 10 as PERFECT
~19:44 CDT, then asked for white-mask versions).

- SET 2: mask BONE-WHITE on ALL 10 kinds, including Night, Prism, Iron,
  Showtime. Mask palette entries keep their exact base values.
- SET 3: mask a COMPLETELY DIFFERENT COLOR than the rest of him in each
  kind: mask hue chosen by MEASUREMENT (max-min circular hue distance
  to the kind's body hues, >= 90 degrees required), contrasting, not
  matching.

Base: atlases/wispkin/wispkin_cell_00.png (confirmed true front,
relabeled battle_front_new). Body treatments are the front-fix KINDS
body functions verbatim (same hues/saturations/value lifts, same
Showtime-brighten / Night-glow rims on body edges only). Face-bbox
guard verbatim: mask entries count as mask only inside rows 8-38,
cols 16-48; the same entries outside take the body treatment.

Staged only. NO PR, NO lock. Show-first. Confirmed front-fix 10 untouched.
Pixel work is local CPU -- GPU genuinely cannot help, no Kaggle job.
"""
import colorsys
import json
import os
from PIL import Image, ImageDraw
import numpy as np

BASE_DIR = os.path.expanduser('~/workspace/mochiichao-work/sprite-art')
EXP = os.path.join(BASE_DIR, 'animation/expanded-scope')
OUT = os.path.join(EXP, 'lane100', 'lustre-wispkin-masksets-20261026')
FRONT_DIR = os.path.join(EXP, 'lane100', 'lustre-wispkin-frontfix-20261026')
os.makedirs(OUT, exist_ok=True)

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


def hexcol(rgb):
    return '#%02x%02x%02x' % rgb


base = Image.open(os.path.join(BASE_DIR, SRC)).convert('RGBA')
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

y0, y1, x0, x1 = FACE_BBOX
yy, xx = np.mgrid[0:64, 0:64]
in_bbox = (yy >= y0) & (yy < y1) & (xx >= x0) & (xx < x1)
is_mask_px = np.isin(idx, mask_idx) & in_bbox & opaque
is_body_px = opaque & ~is_mask_px
print('mask px (in bbox):', int(is_mask_px.sum()),
      'body px:', int(is_body_px.sum()))

BODY_VMAX = max(to_hsv(palette[i])[2] for i in body_idx)
MASK_VMIN = min(to_hsv(palette[i])[2] for i in mask_idx)


def body_v(orig_v, lo, hi):
    return clamp(lo + (orig_v / BODY_VMAX) * (hi - lo))


def mask_v(orig_v, lo=0.92, hi=1.00):
    span = 0.98 - MASK_VMIN
    return clamp(lo + ((orig_v - MASK_VMIN) / span) * (hi - lo)) if span > 0 else 0.96


def body_simple(hue, sat, lo, hi):
    def fn(h, s, v):
        return hue / 360, sat, body_v(v, lo, hi)
    return fn


# Front-fix body functions, verbatim.
BODY_FNS = {
    'solar':    body_simple(40, 0.80, 0.45, 0.70),
    'lunar':    body_simple(230, 0.75, 0.45, 0.70),
    'bare':     body_simple(35, 0.35, 0.45, 0.62),
    'clothed':  body_simple(205, 0.85, 0.42, 0.65),
    'showtime': body_simple(340, 0.90, 0.55, 0.78),
    'iron':     body_simple(210, 0.50, 0.48, 0.72),
    'ember':    body_simple(20, 0.85, 0.45, 0.70),
    'night':    body_simple(250, 0.75, 0.35, 0.55),
}


def prism_body(h, s, v):
    band = 280 / 360 if v < 0.08 else (190 / 360 if v < 0.16 else 320 / 360)
    return band, 0.85, body_v(v, 0.50, 0.72)


def parade_body(h, s, v):
    if v < 0.12:
        return 280 / 360, 0.85, body_v(v, 0.50, 0.65)
    return 45 / 360, 0.80, body_v(v, 0.60, 0.72)


BODY_FNS['prism'] = prism_body
BODY_FNS['parade'] = parade_body
RIMS = {'showtime': 'brighten', 'night': 'glow'}


def circ_dist(a, b):
    d = abs(a - b) % 360
    return min(d, 360 - d)


def choose_contrast_hue(body_hues_deg, body_mean_lum, mask_vs):
    """Mask hue + saturation maximizing the min circular distance to body
    hues covering >= 5% of body pixels, SUBJECT TO luminance contrast
    >= 3.0 against the body mean. Tries saturations 0.60, 0.45, 0.30,
    0.15 in order (paler = brighter = higher luminance) and returns the
    first saturation with a passing candidate. Returns
    (hue_deg, sat, min_dist_deg, dom_hue, contrast_ratio, gate_met)."""
    hist = np.zeros(360, dtype=float)
    for hd in body_hues_deg:
        hist[int(hd) % 360] += 1
    hist /= hist.sum()
    dom = int(np.argmax(hist))
    sig = [h for h in range(360) if hist[h] >= 0.05]

    def mask_mean_lum(hue_deg, sat):
        tot, rs, gs, bs = 0, 0.0, 0.0, 0.0
        for mv, w in mask_vs:
            r, g, b = to_rgb(hue_deg / 360, sat, mv)
            rs += r * w; gs += g * w; bs += b * w; tot += w
        return lum((int(round(rs / tot)), int(round(gs / tot)), int(round(bs / tot))))

    for sat in (0.60, 0.45, 0.30, 0.15):
        cands = []
        for cand in range(360):
            d = min(circ_dist(cand, s) for s in sig)
            if d >= 90:
                cands.append((cand, d))
        passing = [(c, d) for (c, d) in cands
                   if contrast(mask_mean_lum(c, sat), body_mean_lum) >= 3.0]
        if passing:
            c, d = max(passing, key=lambda t: (t[1],
                        contrast(mask_mean_lum(t[0], sat), body_mean_lum)))
            return c, sat, d, dom, contrast(mask_mean_lum(c, sat), body_mean_lum), True
    # No saturation passes: best hue distance, reported honestly.
    c, d = max(((cand, min(circ_dist(cand, s) for s in sig)) for cand in range(360)),
               key=lambda t: t[1])
    return c, 0.60, d, dom, contrast(mask_mean_lum(c, 0.60), body_mean_lum), False


def build(kind, mask_mode):
    """mask_mode: 'white' (SET 2) or 'contrast' (SET 3)."""
    body_fn = BODY_FNS[kind]
    rim = RIMS.get(kind)
    # Body palette first.
    body_pal = {}
    for i in body_idx:
        h, s, v = to_hsv(palette[i])
        body_pal[i] = to_rgb(*body_fn(h, s, v))
    # Provisional array: body entries mapped, mask entries at base.
    pal_arr = np.array([body_pal.get(i, palette[i]) for i in range(16)],
                       dtype=np.uint8)
    arr = np.zeros((64, 64, 4), dtype=np.uint8)
    arr[..., 0] = pal_arr[idx, 0]
    arr[..., 1] = pal_arr[idx, 1]
    arr[..., 2] = pal_arr[idx, 2]
    arr[..., 3] = alpha
    # Guard: mask-entry pixels OUTSIDE the face bbox take body treatment.
    guard = np.isin(idx, mask_idx) & ~in_bbox & opaque
    if guard.any():
        for (gy, gx) in np.argwhere(guard):
            h, s, v = to_hsv(tuple(palette[idx[gy, gx]]))
            arr[gy, gx, :3] = to_rgb(*body_fn(h, s, v))
    # Choose mask treatment.
    mask_pal = {}
    info = {}
    if mask_mode == 'white':
        for i in mask_idx:
            mask_pal[i] = palette[i]  # exact base bone-white values
        info['mask_mode'] = 'bone-white (base values unchanged)'
    else:
        body_pixels = arr[is_body_px][:, :3]
        hues = np.array([to_hsv(tuple(p))[0] * 360 for p in body_pixels])
        body_mean = body_pixels.mean(axis=0)
        body_mean_lum = lum(tuple(body_mean.round().astype(int)))
        mask_vs = [(mask_v(to_hsv(palette[i])[2]),
                    int((is_mask_px & (idx == i)).sum())) for i in mask_idx]
        mh, msat, md, dom, mrat, mgate = choose_contrast_hue(
            hues, body_mean_lum, mask_vs)
        for i in mask_idx:
            h, s, v = to_hsv(palette[i])
            mask_pal[i] = to_rgb(mh / 360, msat, mask_v(v))
        info['mask_mode'] = 'contrast hue (measured)'
        info['mask_hue_deg'] = mh
        info['mask_saturation'] = msat
        info['body_dominant_hue_deg'] = dom
        info['min_hue_distance_deg'] = md
        info['contrast_gate_met_at_choice'] = mgate
    # Fill mask pixels from the mask palette.
    full_pal = [mask_pal.get(i, body_pal.get(i, palette[i])) for i in range(16)]
    full_arr = np.array(full_pal, dtype=np.uint8)
    arr[is_mask_px, 0] = full_arr[idx[is_mask_px], 0]
    arr[is_mask_px, 1] = full_arr[idx[is_mask_px], 1]
    arr[is_mask_px, 2] = full_arr[idx[is_mask_px], 2]
    # Rim (body edges only), verbatim from front-fix.
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
    return Image.fromarray(arr, 'RGBA'), full_pal, info


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
    'base_source_note': 'TRUE FRONT: relabeled battle_front_new (trueback pass). '
                        'Same base as the confirmed front-fix 10.',
    'face_bbox': {'y0': y0, 'y1': y1, 'x0': x0, 'x1': x1},
    'mask_palette_idx': mask_idx,
    'body_palette_idx': body_idx,
    'sets': {
        'set2_white_mask_all10': 'Extra set: bone-white mask on ALL 10 kinds '
                                 '(incl. Night, Prism, Iron, Showtime). Confirmed '
                                 'front-fix 10 untouched.',
        'set3_contrast_mask': 'Extra set: mask hue measured per kind to maximize '
                              'distance from that kind\'s body hues (min >= 90 deg '
                              'required), contrasting, not matching.',
    },
    'dropped': 'The 6-white/4-as-is partial split (Mars correction ~19:44 CDT) '
               'was SUPERSEDED by the ~19:45 CDT expansion before it was built; '
               'it is subsumed by SET 2 (white on all 10). Nothing was built for it.',
    'variants': {},
}

for set_name, mode, tag in [('set2_white_mask_all10', 'white', 'set2-white'),
                            ('set3_contrast_mask', 'contrast', 'set3-contrast')]:
    for kind in ORDER:
        img, new_pal, info = build(kind, mode)
        img.save(os.path.join(OUT, f'wispkin-lustre-{tag}-{kind}.png'))
        swatch(new_pal, os.path.join(OUT, f'wispkin-lustre-{tag}-{kind}-swatch.png'))
        new_arr = np.array(img)
        m_mean = new_arr[is_mask_px][:, :3].mean(axis=0)
        b_mean = new_arr[is_body_px][:, :3].mean(axis=0)
        m_v = float(np.mean([to_hsv(tuple(p))[2] for p in new_arr[is_mask_px][:, :3]]))
        b_v = float(np.mean([to_hsv(tuple(p))[2] for p in new_arr[is_body_px][:, :3]]))
        ratio = contrast(lum(tuple(m_mean.round().astype(int))),
                         lum(tuple(b_mean.round().astype(int))))
        px_changed = float((np.any(new_arr[..., :3] != base_arr[..., :3], axis=2)
                            & opaque).sum() / opaque.sum())
        conf_path = os.path.join(FRONT_DIR, f'wispkin-lustre-frontfix-{kind}.png')
        conf_arr = np.array(Image.open(conf_path).convert('RGBA'))
        px_vs_conf = float((np.any(new_arr[..., :3] != conf_arr[..., :3], axis=2)
                            & opaque).sum() / opaque.sum())
        entry = {
            'palette_before': [hexcol(c) for c in palette],
            'palette_after': [hexcol(c) for c in new_pal],
            'palette_changed': sum(1 for a, b in zip(palette, new_pal) if a != b),
            'mask_mean_rgb': [int(x) for x in m_mean],
            'body_mean_rgb': [int(x) for x in b_mean],
            'mask_mean_v': round(m_v, 3),
            'body_mean_v': round(b_v, 3),
            'mask_body_contrast_ratio': round(ratio, 2),
            'px_changed_vs_base': round(px_changed, 3),
            'px_changed_vs_confirmed_frontfix': round(px_vs_conf, 3),
        }
        entry.update(info)
        manifest['variants'].setdefault(set_name, {})[kind] = entry
        print(f'{tag} {kind:9s} pal_changed={entry["palette_changed"]}/16 '
              f'mask_v={m_v:.2f} contrast={ratio:.2f} px_vs_base={px_changed:.3f} '
              f'px_vs_conf={px_vs_conf:.3f} {info}')

for set_name in manifest['variants']:
    pals = [tuple(v['palette_after']) for v in manifest['variants'][set_name].values()]
    print(set_name, 'identical-palette collisions:',
          'NONE' if len(set(pals)) == len(pals) else 'COLLISION!')
    for kind, v in manifest['variants'][set_name].items():
        assert v['mask_body_contrast_ratio'] >= 3.0, f'{set_name}/{kind} contrast'
        assert v['mask_mean_v'] >= 0.90, f'{set_name}/{kind} mask_v'
        if set_name == 'set3_contrast_mask':
            assert v['min_hue_distance_deg'] >= 90, f'{set_name}/{kind} hue dist'
        if set_name == 'set2_white_mask_all10':
            for i in mask_idx:
                assert v['palette_after'][i] == hexcol(palette[i]), \
                    f'{set_name}/{kind} mask entry {i} not bone-white base value'
print('GATES PASS for both sets')

json.dump(manifest, open(os.path.join(OUT, 'wispkin-lustre-masksets-manifest-20261026.json'), 'w'), indent=2)

# Show sheets: one per set. Rows = kinds, cols = BASE | CONFIRMED front-fix | NEW.
TILE = 64
LABEL_H = 16
for tag, title in [('set2-white', 'SET 2 -- WHITE MASK ON ALL 10'),
                   ('set3-contrast', 'SET 3 -- CONTRAST MASK')]:
    sheet = Image.new('RGBA', (3 * (TILE + 8) + 8, len(ORDER) * (TILE + LABEL_H + 4) + 2 * LABEL_H + 8),
                      (255, 255, 255, 255))
    d = ImageDraw.Draw(sheet)
    d.text((8, 4), title, fill=(0, 0, 0))
    for ci, htxt in enumerate(['BASE', 'CONFIRMED', 'NEW']):
        d.text((8 + ci * (TILE + 8) + 4, LABEL_H + 4), htxt, fill=(0, 0, 0))
    for ri, kind in enumerate(ORDER):
        y0s = 2 * LABEL_H + 8 + ri * (TILE + LABEL_H + 4)
        d.text((8, y0s + TILE + 2), kind.upper(), fill=(0, 0, 0))
        tiles = [base,
                 Image.open(os.path.join(FRONT_DIR, f'wispkin-lustre-frontfix-{kind}.png')).convert('RGBA'),
                 Image.open(os.path.join(OUT, f'wispkin-lustre-{tag}-{kind}.png')).convert('RGBA')]
        for ci, im in enumerate(tiles):
            t = im.resize((TILE, TILE), Image.NEAREST)
            x = 8 + ci * (TILE + 8)
            sheet.paste(t, (x, y0s), t)
    sheet.save(os.path.join(OUT, f'wispkin-masksets-show-sheet-{tag}-20261026.png'))
    print('sheet saved:', tag)

with open(os.path.join(OUT, 'NOTES-20261026.md'), 'w') as f:
    f.write('# WISPKIN MASK SETS 2 + 3 — 2026-10-26\n\n')
    f.write('Mars expansion ~19:45 CDT, superseding the 6-white/4-as-is split '
            '(dropped before it was built; subsumed by SET 2).\n\n')
    f.write('SET 2: bone-white mask on ALL 10 kinds (mask palette entries keep '
            'exact base values #f8f8fb / #eceae9).\n\n')
    f.write('SET 3: mask hue measured per kind = hue maximizing the min circular '
            'distance to body hues covering >= 5% of body pixels (min >= 90 deg '
            'required, contrasting not matching), SUBJECT TO luminance contrast '
            '>= 3.0 against the body mean (saturation falls back 0.60 -> 0.45 -> '
            '0.30 -> 0.15 when a hue-distant color is too close in brightness; '
            'per-kind hue, saturation, distance recorded in the manifest).\n\n')
    f.write('Body treatments = front-fix KINDS body functions verbatim; '
            'Showtime-brighten / Night-glow rims on body edges only.\n\n')
    f.write('Confirmed front-fix 10 untouched. Staged only, NO PR, NO lock, '
            'show-first.\n')
print('notes saved')
