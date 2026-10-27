#!/usr/bin/env python3
"""PIPELINE V3 PROOF BUILD — Kittember + Tiidebiite attacks (2026-10-26).

Tag: artic-pipev3-20261026. Staged only, show-first, no PR.
Inputs (read-only): batch-a manifests + cells (transforms/durations),
articulation-v2-rework eyes-only attack cells (mouths held), old
retrofit cells (for before/after triplets only).
Outputs: this dir — per-creature v3 cells, attacks GIFs, triplets,
mouth-zone zoom strips, manifest, verification note.

Mouth centres: corrected source anchors measured on the enlarged
source front cells (V2 rule — marker crosses are hypotheses, not
measurements):
- Kittember true mouth line: darker run x20-25 at y30 on the front
  cell -> centre (22.5, 30), w~6, h~1. Old (23,31) was within 1.5px;
  the fault was the rectangle + oversize, not the centre.
- Tiidebiite true mouth line: darker run x26-28 at y24 -> centre
  (27, 24), w~3-4, h~1. Old (27,24) confirmed exact.
Final-frame centre = propagate(corrected anchor, cell transform).
Mask radii are expression sizes x the frame's (sx, sy); the drawn
mouth sits inside the mask, so nothing can spill into a block.
Impact expressions (arefit IMPACT_EXPR): physical/signature open-bite,
special grin, heavy grimace. Only cell_03 (impact) of each attack set
is touched; every other cell is copied verbatim from the v2-rework
eyes-only frame.
"""
import ast
import glob
import json
import math
import os
import sys

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mouth_fit import (contour_fit_mouth, draw_grimace, draw_grin,
                       draw_open_bite, propagate)

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope')
BA = os.path.join(BASE, 'batch-a')
V2R = os.path.join(BASE, 'articulation-v2-rework', 'batch-a')
OLD = os.path.join(BASE, 'articulation-batch-a-retrofit')
OUT = os.path.dirname(os.path.abspath(__file__))
TAG = 'artic-pipev3-20261026'

CREATURES = {
    'kittember': {'mouth_src': (22.5, 30), 'teeth': True},
    'tiidebiite': {'mouth_src': (27, 24), 'teeth': False},
}
# mask radii at source scale; multiplied by the frame's (sx, sy)
MASK_R = {'open-bite': (7.0, 6.0), 'grin': (6.5, 3.5), 'grimace': (6.5, 4.0)}
EXPR = {'physical': 'open-bite', 'special': 'grin',
        'signature': 'open-bite', 'heavy': 'grimace'}


def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})


def family_of(setname):
    for k in ('physical', 'special', 'signature', 'heavy'):
        if k in setname:
            return k
    return 'special'


def post_gate(base_rgba, v3_rgba, mask):
    """Returns (ok, info). Changed px must sit inside the feathered
    mask support (+1px) and inside the silhouette; the changed bbox
    must NOT be a filled rectangle (fill ratio < 0.85 proves the
    overlay is a shaped, feathered patch, not a block)."""
    b = np.array(base_rgba.convert('RGBA')).astype(int)
    v = np.array(v3_rgba.convert('RGBA')).astype(int)
    # Visible change only: >=2 levels on some channel (1-level flips
    # are float-rounding noise in the feather tail, not paint).
    diff = (np.max(np.abs(b[:, :, :3] - v[:, :, :3]), axis=2) >= 2) & (b[:, :, 3] > 0)
    ys, xs = np.where(diff)
    if len(xs) == 0:
        return False, {'changed': 0}
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    fill = len(xs) / float(bw * bh)
    my, mx = np.where(mask > 0.002)
    mb = (mx.min() - 1, mx.max() + 1, my.min() - 1, my.max() + 1) if len(mx) else (0, 0, 0, 0)
    # Containment against the feathered mask support dilated by 2px
    # (the fringe fades over ~3.5 sigma, so a 1px bbox tolerance
    # false-fails on rounding at the fringe edge).
    sup = (mask > 0.002).astype(np.uint8)
    sup_d = cv2.dilate(sup, np.ones((5, 5), np.uint8))
    inside = bool(np.all(sup_d[diff])) if len(xs) else False
    sil = (b[:, :, 3] > 0).astype(np.uint8)
    dil = cv2.dilate(sil, np.ones((5, 5), np.uint8))
    off_sil = bool(np.any(diff & (dil == 0)))
    ok = inside and (not off_sil) and fill < 0.85
    return ok, {'changed': int(len(xs)), 'bbox': [int(x0), int(y0), int(bw), int(bh)],
                'fill_ratio': round(fill, 3), 'inside_mask_bbox': inside,
                'off_silhouette': off_sil}


def main():
    report = {'tag': TAG, 'method': 'V3 contour-fit mouth on V2 eyes-only frames',
              'creatures': {}}
    for creature, cfg in CREATURES.items():
        man = json.load(open(glob.glob(os.path.join(BA, creature, '*.batch-a-manifest.json'))[0]))
        odir = os.path.join(OUT, creature)
        os.makedirs(odir, exist_ok=True)
        crep = {'sets': {}}
        gif_frames, gif_durs = [], []
        for setname, s in man['sets'].items():
            if s['kind'] != 'attack':
                continue
            fam = family_of(setname)
            expr = EXPR[fam]
            files, states = [], []
            for i, cell in enumerate(s['cells']):
                v2f = f"{creature}-artic-v2rework-20261026-{setname}-cell-{i:02d}.png"
                src = Image.open(os.path.join(V2R, creature, v2f)).convert('RGBA')
                fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
                action, gate = 'copy-v2eyes', {}
                if i == 3:
                    t = trf(cell)
                    mx, my = propagate(cfg['mouth_src'], t)
                    sil = np.array(src)[:, :, 3] > 0
                    pre = (0 <= int(round(my)) < 64 and 0 <= int(round(mx)) < 64
                           and bool(sil[max(0, int(round(my)) - 1):int(round(my)) + 2,
                                        max(0, int(round(mx)) - 1):int(round(mx)) + 2].any()))
                    if pre:
                        rx = MASK_R[expr][0] * t.get('sx', 1.0)
                        ry = MASK_R[expr][1] * t.get('sy', 1.0)
                        fn_draw = (draw_open_bite(cfg['teeth']) if expr == 'open-bite'
                                   else draw_grin if expr == 'grin' else draw_grimace)
                        out, mask, _ = contour_fit_mouth(src, mx, my, rx, ry, fn_draw)
                        ok, gate = post_gate(src, out, mask)
                        if ok:
                            src = out
                            action = f'v3-mouth-{expr}'
                        else:
                            action = 'base-gate-failed'
                            gate['pre_ok'] = True
                    else:
                        action = 'base-pre-gate-failed'
                src.save(os.path.join(odir, fn))
                files.append(fn)
                states.append({'frame': i, 'action': action, 'gate': gate})
                gif_frames.append((fn, odir))
                gif_durs.append(cell['duration_ms'])
            gif_durs[-1] += 250
            crep['sets'][setname] = {'family': fam, 'expression': expr,
                                     'files': files, 'frames': states}
            # triplets + mouth zooms for the impact frame
            cell3 = s['cells'][3]
            t3 = trf(cell3)
            mx3, my3 = propagate(cfg['mouth_src'], t3)
            base_im = Image.open(os.path.join(BA, creature, cell3['file'])).convert('RGBA')
            oldf = f"{creature}-artic-arefit-20261026-{setname}-cell-03.png"
            old_im = Image.open(os.path.join(OLD, creature, oldf)).convert('RGBA')
            v3_im = Image.open(os.path.join(odir, files[3])).convert('RGBA')
            trip = Image.new('RGBA', (768, 256), (24, 28, 40, 255))
            for k, im in enumerate((base_im, old_im, v3_im)):
                trip.paste(im.resize((256, 256), Image.NEAREST), (k * 256, 0), im.resize((256, 256), Image.NEAREST))
            trip.save(os.path.join(OUT, f'{creature}_{setname}_base_old_v3.png'))
            zx0 = max(0, int(mx3) - 14); zy0 = max(0, int(my3) - 10)
            zoom = Image.new('RGBA', (224, 480), (24, 28, 40, 255))
            for k, im in enumerate((base_im, old_im, v3_im)):
                crop = im.crop((zx0, zy0, zx0 + 28, zy0 + 20)).resize((224, 160), Image.NEAREST)
                zoom.paste(crop, (0, k * 160), crop)
            zoom.save(os.path.join(OUT, f'{creature}_{setname}_mouthzoom_base_old_v3.png'))
        fr, du = [], []
        for (fn, od), ms in zip(gif_frames, gif_durs):
            im = Image.open(os.path.join(od, fn)).convert('RGBA').resize((256, 256), Image.NEAREST)
            bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255)); bg.paste(im, (0, 0), im)
            fr.append(bg.convert('P', palette=Image.ADAPTIVE)); du.append(ms)
        gif_name = f'{creature}-attacks-{TAG}.gif'
        fr[0].save(os.path.join(OUT, gif_name), save_all=True, append_images=fr[1:], duration=du, loop=0)
        print(creature, gif_name, 'frames', len(fr))
        report['creatures'][creature] = crep
    json.dump(report, open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
    print('manifest written')


if __name__ == '__main__':
    main()
