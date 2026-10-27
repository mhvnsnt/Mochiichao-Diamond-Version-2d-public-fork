#!/usr/bin/env python3
"""PIPELINE-V2 REWORK — BATCH A, EYES-ONLY under MOUTH HOLD (2026-10-26), tag artic-v2rework-20261026.

Binding method: articulation/PIPELINE-V2.md (final-frame coords, per-frame
(sx,sy) geometry, ellipses under squash, NO clear-box, gates on final frame).
MOUTH HOLD (Mars 2026-10-26 ~10:50/10:51 CDT): Kittember + Tiidebiite attacks
retrofit mouths were rejected (square skin/fur crop, does not fit) and a V3
contour-fit mouth module is being wired as the new standard. NO mouth is
finalized here: impact frames get EYES ONLY under V2; every mouth anchor is
recorded as HELD-V3 and no mouth shape, crop, or clear-box is drawn anywhere
in this build. When PIPELINE-V3.md + the contour module land, mouths are
applied on top of these eyes-only frames and the delta vs V2 is reported.
Scope: razorgater, tyrage, kittember, sproutle, tiidebiite attacks ONLY.
Aquariios + Reaperdile are DONE under artic-pipev2-20261026 — NOT touched.
Chromejaww stays BASE (flagged, no overlays). All hurts stay BASE.
Base cells are the clean batch-a cells (NOT the retrofit cells, which carry
old overlays on impact frames — reusing them would double-overlay). Non-impact
frames are therefore byte-identical to batch-a base cells, as in pipev2.
Timing: Mode A impact-momentary — overlay ONLY on cell_03 of each attack set.
Corrected eye anchors (64px source coords) — cluster centroids of TRUE
feature pixels on the untransformed source front cell, eye-checked on
enlarged markers (old cyan vs new magenta; see VERIFICATION note):
  razorgater (21.7,21.3),(37.7,21.3) red cores, 3px clusters, eye_r 1
  tyrage     (20.2,15.0),(35.5,14.7) dark discs + white bar, eye_r 2
             (right = dark+white-bar combined centre; dark-only centroid
              was 35.2,14.5 — bar shifts it +0.3/+0.2, still inside disc)
  kittember  (16.0,26.3),(30.3,25.8) amber clusters, eye_r 2
  sproutle   (24.3,20.1),(38.5,19.7) teal discs in visor, eye_r 2
  tiidebiite (23.0,21.6),(31.2,20.0) black discs, eye_r 1
Old anchors (retrofit): razorgater (22,22),(38,22); tyrage (21,17),(35,18);
kittember (17,26),(31,26); sproutle (24,21),(40,21); tiidebiite (23,21),(31,20).
"""
import json, ast, math, os, glob
import numpy as np
from PIL import Image, ImageDraw

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art')
BA = os.path.join(BASE, 'animation/expanded-scope/batch-a')
RT = os.path.join(BASE, 'animation/expanded-scope/articulation-batch-a-retrofit')
OUT = os.path.dirname(os.path.abspath(__file__))
TAG = 'artic-v2rework-20261026'
SRC_DIR = {'razorgater': 'razorgater-rebased', 'tyrage': 'tyrage-rebased',
           'sproutle': 'sproutle-rebased', 'kittember': 'kittember',
           'tiidebiite': 'tiidebiite'}
OLD_ANCH = {'razorgater': [(22,22),(38,22)], 'tyrage': [(21,17),(35,18)],
            'kittember': [(17,26),(31,26)], 'sproutle': [(24,21),(40,21)],
            'tiidebiite': [(23,21),(31,20)]}
OLD_MOUTH = {'razorgater': (32,40), 'tyrage': (31,28), 'kittember': (23,31),
             'sproutle': (32,33), 'tiidebiite': (27,24)}
CORR = {
 'razorgater': {'eyes': [(21.7,21.3),(37.7,21.3)], 'eye_r': 1,
                'disc': (125,70,55,255), 'inner': (30,20,15,255), 'inner_style': 'pupil'},
 'tyrage': {'eyes': [(20.2,15.0),(35.5,14.7)], 'eye_r': 2,
            'disc': (30,35,30,255), 'inner': (255,255,255,255), 'inner_style': 'bar'},
 'kittember': {'eyes': [(16.0,26.3),(30.3,25.8)], 'eye_r': 2,
               'disc': (200,160,60,255), 'inner': (15,15,15,255), 'inner_style': 'pupil'},
 'sproutle': {'eyes': [(24.3,20.1),(38.5,19.7)], 'eye_r': 2,
              'disc': (20,125,133,255), 'inner': (255,255,255,255), 'inner_style': 'dot'},
 'tiidebiite': {'eyes': [(23.0,21.6),(31.2,20.0)], 'eye_r': 1,
                'disc': (20,25,30,255), 'inner': (255,255,255,255), 'inner_style': 'dot'},
}
IMPACT_EXPR = {'physical': 'widened', 'special': 'glance',
               'signature': 'widened', 'heavy': 'half'}

def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})

def propagate(p, t):
    sx = t.get('sx', 1.0); sy = t.get('sy', 1.0)
    dx = t.get('dx', 0); dy = t.get('dy', 0); rot = t.get('rot', 0)
    X, Y = p[0]*4, p[1]*4
    qx = 128 + (X-128)*sx + dx; qy = 232 + (Y-256)*sy + dy
    if rot:
        th = math.radians(rot); cx, cy = 128, 200
        rx = cx + (qx-cx)*math.cos(th) + (qy-cy)*math.sin(th)
        ry = cy - (qx-cx)*math.sin(th) + (qy-cy)*math.cos(th)
        qx, qy = rx, ry
    return (qx/4, qy/4)

def feat_present(im, cx, cy, creature):
    n = 0
    for y in range(max(0,int(cy)-3), min(64,int(cy)+4)):
        for x in range(max(0,int(cx)-3), min(64,int(cx)+4)):
            p = im.getpixel((x,y))
            if p[3] < 128: continue
            r,g,b = p[:3]; lum = 0.299*r+0.587*g+0.114*b
            if creature == 'razorgater':
                if 80 <= r <= 200 and 25 <= g <= 120 and 15 <= b <= 110 and r-g >= 15: n += 1
            elif creature == 'tyrage':
                if lum < 80: n += 1
            elif creature == 'kittember':
                if r > 140 and 90 <= g <= 200 and b < 140 and r-b > 40: n += 1
            elif creature == 'sproutle':
                if r < 90 and 50 <= g <= 140 and 60 <= b <= 150 and b > r+20: n += 1
            elif creature == 'tiidebiite':
                if lum < 90: n += 1
    return n

GATE_THR = {'razorgater': 1, 'tyrage': 2, 'kittember': 3, 'sproutle': 3, 'tiidebiite': 2}

def draw_eyes_v2(d, anchors, state, creature, sx, sy):
    g = CORR[creature]; disc, inner, rb = g['disc'], g['inner'], g['eye_r']
    for (cx, cy) in anchors:
        if state == 'widened':
            rx = max(1, round(2*rb*sx)); ry = max(1, round(2*rb*sy))
        else:
            rx = max(1, round(rb*sx)); ry = max(1, round(rb*sy))
        if state == 'glance':
            cx = cx + max(1, round(1*sx))
        d.ellipse((cx-rx, cy-ry, cx+rx, cy+ry), fill=disc)
        if state == 'half':
            # lid: top half of the EYE DISC itself, not a clear-box patch
            d.rectangle((cx-rx, cy-ry, cx+rx, cy), fill=(20,20,20,255))
        elif g['inner_style'] == 'bar':
            d.line((cx, cy-ry, cx, cy+ry), fill=inner, width=1)
        elif state == 'widened':
            d.ellipse((cx-1, cy-1, cx+1, cy+1), fill=inner)
        else:
            d.ellipse((cx, cy, cx, cy), fill=inner)

def family_of(setname):
    for k in ('physical','special','signature','heavy'):
        if k in setname: return k
    return 'special'

def main():
    os.makedirs(OUT, exist_ok=True)
    report = {'tag': TAG, 'method': 'PIPELINE-V2 eyes-only under MOUTH HOLD (V3 pending): corrected cluster-centroid eye anchors + final-frame (sx,sy) ellipses + final-frame gates; NO mouth drawn anywhere',
              'mouth_status': 'HELD-V3 for all 5 creatures (Kittember + Tiidebiite are the V3 proof scope per Mars 2026-10-26 ~10:50/10:51 CDT)',
              'old_anchors': {c: OLD_ANCH[c] for c in SRC_DIR},
              'old_mouths_held': OLD_MOUTH,
              'corrected_eyes': {c: CORR[c]['eyes'] for c in SRC_DIR},
              'creatures': {}}
    for creature, srcdir in SRC_DIR.items():
        sdir = os.path.join(BA, srcdir)
        man = json.load(open(glob.glob(os.path.join(sdir, '*.batch-a-manifest.json'))[0]))
        odir = os.path.join(OUT, creature); os.makedirs(odir, exist_ok=True)
        rdir = os.path.join(RT, creature)
        crep = {"sets": {}}; gif_frames = []; gif_durs = []; triplets = []
        for setname, s in man['sets'].items():
            if s['kind'] != 'attack': continue
            fam = family_of(setname); eyes_state = IMPACT_EXPR[fam]
            files, states = [], []
            for i, cell in enumerate(s['cells']):
                base = Image.open(os.path.join(sdir, cell['file'])).convert('RGBA')
                t = trf(cell); sx, sy = t.get('sx',1.0), t.get('sy',1.0)
                action = 'base'; info = {}
                if i == 3 and not t.get('flash', 0):
                    eye_a = [propagate(e, t) for e in CORR[creature]['eyes']]
                    mouth_a = propagate(OLD_MOUTH[creature], t)
                    eye_i = [(int(round(x)), int(round(y))) for x, y in eye_a]
                    counts = [feat_present(base, ex, ey, creature) for ex, ey in eye_i]
                    thr = GATE_THR[creature]
                    info = {'prop_eyes': [(round(x,1), round(y,1)) for x, y in eye_a],
                            'prop_mouth_held_v3': (round(mouth_a[0],1), round(mouth_a[1],1)),
                            'sx': sx, 'sy': sy, 'feature_counts': counts, 'gate_thr': thr}
                    if all(c >= thr for c in counts):
                        im = base.copy(); d = ImageDraw.Draw(im)
                        draw_eyes_v2(d, eye_i, eyes_state, creature, sx, sy)
                        ba = np.array(base)[:, :, 3] >= 128
                        diff = (np.abs(np.array(im).astype(int) - np.array(base).astype(int)).sum(axis=2) > 0)
                        dys, dxs = np.where(diff)
                        inside = True
                        if len(dxs):
                            ok_zone = ba.copy()
                            for _ in range(2):
                                sh = np.zeros_like(ok_zone)
                                sh[1:,:] |= ok_zone[:-1,:]; sh[:-1,:] |= ok_zone[1:,:]
                                sh[:,1:] |= ok_zone[:,:-1]; sh[:,:-1] |= ok_zone[:,1:]
                                ok_zone = ok_zone | sh
                            inside = bool(ok_zone[dys, dxs].all())
                        info['diff_bbox'] = (int(dxs.min()), int(dxs.max()), int(dys.min()), int(dys.max()), int(len(dxs))) if len(dxs) else None
                        info['diff_inside_base_silhouette'] = inside
                        if inside:
                            base = im; action = f'overlay-v2-eyes-only-{eyes_state}-mouth-held-v3'
                        else:
                            action = 'base-skipped-postgate-outside-silhouette'
                    else:
                        action = 'base-skipped-pregate-no-feature'
                fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
                base.save(os.path.join(odir, fn)); files.append(fn)
                states.append({'frame': i, 'action': action, **info})
                gif_frames.append((fn, odir)); gif_durs.append(cell['duration_ms'])
                if i == 3:
                    # triplet: base batch-a cell | old retrofit impact cell | new eyes-only cell
                    old_fn = glob.glob(os.path.join(rdir, f"{creature}-artic-arefit-20261026-{setname}-cell-03.png"))
                    tiles = []
                    tiles.append(Image.open(os.path.join(sdir, cell['file'])).convert('RGBA').resize((256,256), Image.NEAREST))
                    if old_fn:
                        tiles.append(Image.open(old_fn[0]).convert('RGBA').resize((256,256), Image.NEAREST))
                    tiles.append(Image.open(os.path.join(odir, fn)).convert('RGBA').resize((256,256), Image.NEAREST))
                    sheet = Image.new('RGBA', (256*len(tiles), 256), (24,28,40,255))
                    for j, tl in enumerate(tiles):
                        sheet.paste(tl, (j*256, 0), tl)
                    tname = f"{creature}_{setname}_base_old_v2eyes.png"
                    sheet.save(os.path.join(OUT, tname)); triplets.append(tname)
            gif_durs[-1] += 250
            crep['sets'][setname] = {'kind': 'attack', 'family': fam, 'eyes_state': eyes_state,
                                     'mouth': 'HELD-V3', 'files': files, 'frames': states}
            print(creature, setname, [f['action'] for f in states])
        fr, du = [], []
        for (fn, od), ms in zip(gif_frames, gif_durs):
            im = Image.open(os.path.join(od, fn)).convert('RGBA').resize((256,256), Image.NEAREST)
            bg = Image.new('RGBA', (256,256), (24,28,40,255)); bg.paste(im, (0,0), im)
            fr.append(bg.convert('P', palette=Image.ADAPTIVE)); du.append(ms)
        gif_name = f'{creature}-attacks-{TAG}.gif'
        fr[0].save(os.path.join(OUT, gif_name), save_all=True, append_images=fr[1:], duration=du, loop=0)
        print(creature, gif_name, len(fr), 'frames; triplets:', len(triplets))
        crep['gif'] = gif_name; crep['gif_frames'] = len(fr); crep['triplets'] = triplets
        report['creatures'][creature] = crep
    json.dump(report, open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
    print('manifest written')

if __name__ == '__main__':
    main()
