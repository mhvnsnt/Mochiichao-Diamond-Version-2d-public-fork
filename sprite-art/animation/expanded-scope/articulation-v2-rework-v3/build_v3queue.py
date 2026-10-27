#!/usr/bin/env python3
"""PIPELINE V3 QUEUE-WIDE APPLICATION (2026-10-26).

Tag: artic-pipev3q-20261026. Staged only, show-first, NO PR, no repo edits.
Applies articulation-pipev3/mouth_fit.contour_fit_mouth onto the V2-rework
eyes-only impact frames (cell-03 of each attack set) for ALL batches A/C/D/E.

Binding method (PIPELINE-V3.md): feathered elliptical contour masks fitted
to RE-MEASURED true mouths (enlarged source front cells, 2026-10-26);
blurred-base clear (NO flat median blocks, NO rectangular crops anywhere);
teeth ONLY where evidenced, clipped by the mask; gates ON the final frame
(pre: centre in silhouette; post: changed px >=2 levels inside feathered
mask support dilated 2px + inside silhouette, changed-bbox fill < 0.85).
Fail either gate = eyes-only base, never forced.
Non-impact cells are copied BYTE-IDENTICAL (shutil.copyfile, verified by
sha256); the ONLY delta on any set is the cell-03 mouth.

Measured mouth centres (source space, from enlarged game-ready front cells):
- Batch A fresh: razorgater (32,36) open jaw, teeth YES (white teeth top+bottom);
  tyrage (28.5,28.5) mouth line (old (31,28) sat between the y27 snout line
  and the y29 shadow; centre placed mid, mask covers both), teeth no;
  sproutle (31.5,27.5) smile arc x28-35/y27-28 (old (32,33) was 5.5px LOW, on
  neck shadow -- blind-copy trap, NOT reused), teeth no.
- Batch A reuse (verbatim, NOT rebuilt): kittember (22.5,30) teeth yes,
  tiidebiite (27,24) teeth no -- cells copied byte-identical from the proven
  articulation-pipev3 build, only filenames re-tagged.
- Batch C: mythar (31.5,27.5) tiny mark below nose, no teeth;
  ashemit (26,27.5) closed mouth bar across cream face (old (32,26) was
  right-biased, NOT reused), no teeth; floatcalf (31.5,26.5) dark band
  x27-36/y26-27 on the dome, darker than dome (lum 4-18 vs 23-24), no teeth;
  gabu (32,29) open pink mouth x24-40/y25-33, no teeth (white at mouth
  bottom is chin, not teeth -- per C verification note).
- Batch D: strikechamp_unsuited (32,17), strikechamp_unsuited_full (30,18),
  humanoid mouth lines, no teeth.
- Batch E: punchkid (32.5,21.0) faint line, no teeth.
FLAGGED, NOT PLACED (no cleanly measurable mouth line on the front cell):
- dorowani: old (31,24) sits on plain blue snout (lum 92-205, no line);
  no distinct mouth feature anywhere on the snout -- eyes-only.
- pyromonk: face pattern noise swamps any mouth line; no distinct line
  visible on enlarged front cell -- eyes-only.
- krakenox / pebblefist / inklet: no measurable front mouth (v1 + v2 rule).
- All other Batch D sets: no mouth over beaks/masks/visors (D rule).
"""
import ast
import glob
import hashlib
import json
import os
import shutil
import sys

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                '..', 'articulation-pipev3'))
from mouth_fit import (contour_fit_mouth, draw_grimace, draw_grin,
                       draw_open_bite, propagate)

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope')
V2R = os.path.join(BASE, 'articulation-v2-rework')
P3 = os.path.join(BASE, 'articulation-pipev3')
OUT = os.path.dirname(os.path.abspath(__file__))
TAG = 'artic-pipev3q-20261026'

MASK_R = {'open-bite': (7.0, 6.0), 'grin': (6.5, 3.5), 'grimace': (6.5, 4.0)}
EXPR = {'physical': 'open-bite', 'special': 'grin',
        'signature': 'open-bite', 'heavy': 'grimace'}

# creature -> (mouth_src or None, teeth, reason-if-None)
MOUTH = {
    'razorgater': ((32, 36), True, None),
    'tyrage': ((28.5, 28.5), False, None),
    'sproutle': ((31.5, 27.5), False, None),
    'mythar': ((31.5, 27.5), False, None),
    'ashemit': ((26, 27.5), False, None),
    'floatcalf': ((31.5, 26.5), False, None),
    'gabu': ((32, 29), False, None),
    'strikechamp_unsuited': ((32, 17), False, None),
    'strikechamp_unsuited_full': ((30, 18), False, None),
    'punchkid': ((32.5, 21.0), False, None),
    'dorowani': (None, False, 'no distinct mouth line on front cell; old (31,24) sits on plain snout'),
    'pyromonk': (None, False, 'no cleanly measurable mouth line; face pattern noise swamps any line'),
    'krakenox': (None, False, 'no measurable front mouth (v1 + v2 rule)'),
    'pebblefist': (None, False, 'no measurable front mouth (v1 + v2 rule)'),
    'inklet': (None, False, 'no measurable front mouth; mouth on underside, not front'),
}
REUSE_A = ('kittember', 'tiidebiite')


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})


def family_of(s):
    for k in ('physical', 'special', 'signature', 'heavy'):
        if k in s:
            return k
    return 'special'


def post_gate(base_rgba, v3_rgba, mask):
    b = np.array(base_rgba.convert('RGBA')).astype(int)
    v = np.array(v3_rgba.convert('RGBA')).astype(int)
    diff = (np.max(np.abs(b[:, :, :3] - v[:, :, :3]), axis=2) >= 2) & (b[:, :, 3] > 0)
    ys, xs = np.where(diff)
    if len(xs) == 0:
        return False, {'changed': 0}
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    fill = len(xs) / float(bw * bh)
    sup = (mask > 0.002).astype(np.uint8)
    sup_d = cv2.dilate(sup, np.ones((5, 5), np.uint8))
    inside = bool(np.all(sup_d[diff])) if len(xs) else False
    sil = (b[:, :, 3] > 0).astype(np.uint8)
    dil = cv2.dilate(sil, np.ones((5, 5), np.uint8))
    off_sil = bool(np.any(diff & (dil == 0)))
    ok = inside and (not off_sil) and fill < 0.85
    return ok, {'changed': int(len(xs)), 'bbox': [int(x0), int(y0), int(bw), int(bh)],
                'fill_ratio': round(fill, 3), 'inside_mask_dil2': inside,
                'off_silhouette': off_sil}


def src_manifest(batch, creature):
    if batch == 'batch-a':
        return json.load(open(glob.glob(os.path.join(BASE, 'batch-a', creature,
                                                     '*.batch-a-manifest.json'))[0]))
    if batch == 'batch-c':
        return json.load(open(glob.glob(os.path.join(BASE, 'articulation-batch-cd',
                                                     'batch-c', creature,
                                                     '*-base-manifest.json'))[0]))
    if batch == 'batch-d':
        return json.load(open(glob.glob(os.path.join(BASE, 'articulation-batch-cd',
                                                     'batch-d', creature,
                                                     '*.batch-d-manifest.json'))[0]))
    if batch == 'batch-e':
        return json.load(open(glob.glob(os.path.join(BASE, 'articulation-batch-cd',
                                                     'batch-e', creature,
                                                     '*-base-manifest.json'))[0]))
    raise ValueError(batch)


def main():
    report = {'tag': TAG, 'method': 'V3 contour-fit mouth on V2 eyes-only frames (queue-wide)',
              'batches': {}}
    totals = {'cells': 0, 'impact': 0, 'mouth_applied': 0, 'eyes_only_impact': 0,
              'nonimpact_byte_identical': 0, 'nonimpact_total': 0}
    for batch, v2man_path, creatures in [
        ('batch-a', os.path.join(V2R, 'batch-a', 'manifest-artic-v2rework-20261026.json'),
         ['razorgater', 'tyrage', 'sproutle', 'kittember', 'tiidebiite']),
        ('batch-c', os.path.join(V2R, 'batch-c', 'manifest-artic-v2rework-20261026.json'),
         ['krakenox', 'mythar', 'pebblefist', 'ashemit', 'dorowani', 'floatcalf', 'gabu', 'inklet']),
        ('batch-d', os.path.join(V2R, 'batch-d', 'batch-d-artic-artic-v2rework-20261026-manifest.json'),
         ['squirmite', 'stormtalon', 'strikechamp', 'strikechamp_unsuited',
          'strikechamp_unsuited_full', 'terradog', 'toxitacle', 'yogiferno', 'zephling']),
        ('batch-e', os.path.join(V2R, 'batch-e', 'manifest-artic-v2rework-20261026-eyesonly.json'),
         ['punchkid', 'pyromonk']),
    ]:
        v2man = json.load(open(v2man_path))
        bdir = os.path.join(OUT, batch)
        os.makedirs(bdir, exist_ok=True)
        brep = {'creatures': {}}
        for creature in creatures:
            v2sets = v2man['creatures'][creature]['sets']
            sman = src_manifest(batch, creature)
            odir = os.path.join(bdir, creature)
            os.makedirs(odir, exist_ok=True)
            crep = {'sets': {}, 'mouth': None}
            gif_frames, gif_durs = [], []
            for setname, vs in v2sets.items():
                if vs.get('kind') != 'attack':
                    continue
                fam = vs.get('family') or family_of(setname)
                expr = EXPR[fam]
                ssrc = sman['sets'][setname]
                files, states = [], []
                for i, v2f in enumerate(vs['files']):
                    v2path = os.path.join(V2R, batch, creature, v2f)
                    fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
                    outp = os.path.join(odir, fn)
                    action, gate, fmouth = 'copy-v2eyes', {}, None
                    if i == 3:
                        totals['impact'] += 1
                        if creature in REUSE_A:
                            p3f = (f"{creature}-artic-pipev3-20261026-{setname}-cell-03.png")
                            shutil.copyfile(os.path.join(P3, creature, p3f), outp)
                            action = 'reuse-pipev3-verbatim'
                            gate = {'source': 'articulation-pipev3 proof build (gates passed there)'}
                            fmouth = None
                            totals['mouth_applied'] += 1
                        else:
                            msrc, teeth, reason = MOUTH.get(creature, (None, False, 'no mouth rule'))
                            if msrc is None:
                                shutil.copyfile(v2path, outp)
                                action = 'eyes-only'
                                gate = {'reason': reason}
                                totals['eyes_only_impact'] += 1
                            else:
                                cell = ssrc['cells'][i]
                                t = trf(cell)
                                # Batch C/D/E v2rework manifests also carry the
                                # impact transform; prefer it when present.
                                f3 = [f for f in vs.get('frames', []) if f.get('frame') == 3]
                                if f3 and f3[0].get('transform') is not None:
                                    t = trf(f3[0])
                                src = Image.open(v2path).convert('RGBA')
                                mx, my = propagate(msrc, t)
                                sil = np.array(src)[:, :, 3] > 0
                                pre = (0 <= int(round(my)) < 64 and 0 <= int(round(mx)) < 64
                                       and bool(sil[max(0, int(round(my)) - 1):int(round(my)) + 2,
                                                    max(0, int(round(mx)) - 1):int(round(mx)) + 2].any()))
                                if pre:
                                    rx = MASK_R[expr][0] * t.get('sx', 1.0)
                                    ry = MASK_R[expr][1] * t.get('sy', 1.0)
                                    fn_draw = (draw_open_bite(teeth) if expr == 'open-bite'
                                               else draw_grin if expr == 'grin' else draw_grimace)
                                    out, mask, _ = contour_fit_mouth(src, mx, my, rx, ry, fn_draw)
                                    ok, gate = post_gate(src, out, mask)
                                    if ok:
                                        out.save(outp)
                                        action = f'v3-mouth-{expr}'
                                        fmouth = (round(mx, 1), round(my, 1))
                                        totals['mouth_applied'] += 1
                                    else:
                                        shutil.copyfile(v2path, outp)
                                        action = 'base-gate-failed'
                                        gate['pre_ok'] = True
                                        totals['eyes_only_impact'] += 1
                                else:
                                    shutil.copyfile(v2path, outp)
                                    action = 'base-pre-gate-failed'
                                    totals['eyes_only_impact'] += 1
                    else:
                        shutil.copyfile(v2path, outp)
                        totals['nonimpact_total'] += 1
                        if sha(v2path) == sha(outp):
                            totals['nonimpact_byte_identical'] += 1
                        else:
                            action = 'COPY-MISMATCH'
                    files.append(fn)
                    states.append({'frame': i, 'action': action, 'gate': gate,
                                   'final_mouth': fmouth})
                    gif_frames.append((fn, odir))
                    # durations: source manifest per set; A/C/E add +250 tail
                    # on each set's last frame (their v2rework convention);
                    # D uses pilot durations verbatim (its v2rework convention).
                    dur = ssrc['cells'][i]['duration_ms']
                    gif_durs.append(dur)
                if batch != 'batch-d':
                    gif_durs[-1] += 250
                crep['sets'][setname] = {'family': fam, 'expression': expr,
                                         'files': files, 'frames': states}
                # mouth zoom pair (v2eyes | v3) for applied sets
                if states[3]['action'] in ('v3-mouth-open-bite', 'v3-mouth-grin',
                                           'v3-mouth-grimace', 'reuse-pipev3-verbatim'):
                    mxf, myf = states[3]['final_mouth'] or (None, None)
                    if creature in REUSE_A:
                        # final-frame centre recomputed for the zoom window only
                        t3 = trf(ssrc['cells'][3])
                        src_m = {'kittember': (22.5, 30), 'tiidebiite': (27, 24)}[creature]
                        mxf, myf = propagate(src_m, t3)
                    v2im = Image.open(os.path.join(V2R, batch, creature, vs['files'][3])).convert('RGBA')
                    v3im = Image.open(os.path.join(odir, files[3])).convert('RGBA')
                    zx0 = max(0, min(64 - 28, int(mxf) - 14))
                    zy0 = max(0, min(64 - 20, int(myf) - 10))
                    zoom = Image.new('RGBA', (224, 320), (24, 28, 40, 255))
                    for k, im in enumerate((v2im, v3im)):
                        crop = im.crop((zx0, zy0, zx0 + 28, zy0 + 20)).resize((224, 160), Image.NEAREST)
                        zoom.paste(crop, (0, k * 160), crop)
                    zoom.save(os.path.join(bdir, f'{creature}_{setname}_mouthzoom_v2eyes_v3.png'))
            fr, du = [], []
            for (fn, od), ms in zip(gif_frames, gif_durs):
                im = Image.open(os.path.join(od, fn)).convert('RGBA').resize((256, 256), Image.NEAREST)
                bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255))
                bg.paste(im, (0, 0), im)
                fr.append(bg.convert('P', palette=Image.ADAPTIVE))
                du.append(ms)
            gif_name = f'{creature}-attacks-{TAG}.gif'
            fr[0].save(os.path.join(bdir, gif_name), save_all=True,
                       append_images=fr[1:], duration=du, loop=0)
            msrc, teeth, reason = MOUTH.get(creature, (None, False, 'reuse' if creature in REUSE_A else 'no mouth rule'))
            crep['mouth'] = {'source': msrc, 'teeth': teeth, 'reason': reason,
                             'gif': gif_name, 'gif_frames': len(fr)}
            crep['mouth_applied_sets'] = sum(1 for s in crep['sets'].values()
                                             if s['frames'][3]['action'].startswith('v3-mouth')
                                             or s['frames'][3]['action'] == 'reuse-pipev3-verbatim')
            brep['creatures'][creature] = crep
            totals['cells'] += len(gif_frames)
            print(batch, creature, gif_name, len(fr), 'frames, mouth sets',
                  crep['mouth_applied_sets'], '/4')
        json.dump(brep, open(os.path.join(bdir, f'manifest-{TAG}.json'), 'w'), indent=1)
        report['batches'][batch] = brep
    report['totals'] = totals
    json.dump(report, open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
    print('TOTALS', totals)


if __name__ == '__main__':
    main()
