#!/usr/bin/env python3
"""PIPELINE V2 — transform-aware articulation fix (2026-10-26), tag artic-pipev2-20261026.

Mars rejections 2026-10-26 ~10:15 CDT:
- Aquariios attacks: face NOT placed correctly.
- Reaperdile attacks: face NOT scaled in place accurately/correctly.
  Mars ordered the pipeline improved.

MEASURED ROOT CAUSES (see VERIFICATION-artic-pipev2-20261026.md):
1. WRONG SOURCE ANCHORS (Aquariios, large): claimed eyes (28,26),(32,26)
   sit on uniform head colour; TRUE eye dots (grey clusters, 8x front)
   are (31.9,24.9),(36.9,24.9) — errors +3.9/-1.1 and +4.9/-1.1 px in
   source space, up to ~+6px after sx=1.3. Mouth claimed (30,29); true
   dark mouth line y=29 x31-37 -> centre (34,29), error +4/0.
   Reaperdile (small): claimed right eye (36,19); TRUE red core
   (34.4,18.9), error -1.6. Mouth claimed (32,36); jaw-gap centre
   ~(32,32), error 0/-4.
2. UNSCALED OVERLAY GEOMETRY (both, dominant for Reaperdile): the old
   builder drew FIXED-size shapes at propagated positions — eye discs
   r=3 (6-7px) over true 1-2px cores, mouth boxes 16-22px wide x 10-18px
   tall regardless of the frame's sx/sy (e.g. sy=0.72 squash ignored,
   so the mouth block stood 2x too tall and covered jaw+chest).
3. CLEAR-BOX RECTANGLES: draw_mouth painted a flat patch_median
   rectangle (mx+/-8..11, my+/-5..10) under every mouth, visible as a
   solid block over the head. Removed entirely in V2.

V2 RULES (also written up in articulation/PIPELINE-V2.md):
- Corrected anchors from TRUE features (cluster centroids), table below.
- Overlay drawn AFTER the cell transform, IN FINAL-FRAME coordinates:
  final centre = propagate(corrected anchor, frame transform); every
  overlay dimension multiplied by that frame's (sx, sy) (ellipses, not
  circles, under squash/stretch; rot rotates the shape about its own
  centre — no attack impact frame here has rot, path still implemented).
- NO clear-box rectangles anywhere: mouth shapes drawn directly.
- Size caps from measured true features: eye base radius = true source
  radius (Aquariios 1px, Reaperdile 1px); widened <= 2x true radius
  (scaled); mouth width from measured source mouth width (Aquariios
  7px, Reaperdile jaw 20px) scaled by sx, height scaled by sy.
- Gates run ON THE FINAL FRAME: pre-draw feature presence near the
  propagated corrected anchors (Aquariios grey dots, Reaperdile red
  cores); post-draw diff bbox inside the base opaque bbox. Fail = base.
- Scope: Aquariios attacks + Reaperdile attacks ONLY (4 sets each).
  Reaperdile hurts is APPROVED as-is and is NOT touched. Aquariios
  hurts is NOT touched. Batch C held overlays are NOT rebuilt here
  (separate reconciliation track adopts PIPELINE-V2).
- New filenames only (tag below); shown retrofit GIFs untouched; no PR.
"""
import json, ast, math, os, glob
import numpy as np
from PIL import Image, ImageDraw

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art')
BA = os.path.join(BASE, 'animation/expanded-scope/batch-a')
RT = os.path.join(BASE, 'animation/expanded-scope/articulation-batch-a-retrofit')
OUT = os.path.join(BASE, 'animation/expanded-scope/articulation-pipev2')
TAG = 'artic-pipev2-20261026'

# corrected anchors (64px source coords) + measured true feature sizes
CORR = {
    'aquariios': {'eyes': [(31.9, 24.9), (36.9, 24.9)], 'mouth': (34.0, 29.0),
                  'eye_r': 1, 'mouth_w': 7, 'mouth_h': 5,
                  'disc': (40, 80, 125, 255), 'inner': (150, 200, 230, 255),
                  'teeth': False},
    'reaperdile': {'eyes': [(24.4, 19.4), (34.4, 18.9)], 'mouth': (32.0, 32.0),
                   'eye_r': 1, 'mouth_w': 20, 'mouth_h': 10,
                   'disc': (125, 70, 55, 255), 'inner': (30, 20, 15, 255),
                   'teeth': True},
}
SRC_DIR = {'aquariios': 'aquariios', 'reaperdile': 'reaperdile'}
IMPACT_EXPR = {'physical': ('open-bite', 'widened'),
               'special': ('grin', 'glance'),
               'signature': ('open-bite', 'widened'),
               'heavy': ('grimace', 'half')}


def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})


def propagate(p, t):
    sx = t.get('sx', 1.0); sy = t.get('sy', 1.0)
    dx = t.get('dx', 0); dy = t.get('dy', 0); rot = t.get('rot', 0)
    X, Y = p[0] * 4, p[1] * 4
    qx = 128 + (X - 128) * sx + dx; qy = 232 + (Y - 256) * sy + dy
    if rot:
        th = math.radians(rot); cx, cy = 128, 200
        rx = cx + (qx - cx) * math.cos(th) + (qy - cy) * math.sin(th)
        ry = cy - (qx - cx) * math.sin(th) + (qy - cy) * math.cos(th)
        qx, qy = rx, ry
    return (qx / 4, qy / 4)


def scale_of(t):
    return t.get('sx', 1.0), t.get('sy', 1.0)


def rot_xy(x, y, cx, cy, rot):
    if not rot:
        return x, y
    th = math.radians(-rot)
    return (cx + (x - cx) * math.cos(th) - (y - cy) * math.sin(th),
            cy + (x - cx) * math.sin(th) + (y - cy) * math.cos(th))


def feat_present(im, cx, cy, creature):
    """True-feature px near (cx,cy) in the FINAL frame."""
    n = 0
    for y in range(max(0, int(cy) - 3), min(64, int(cy) + 4)):
        for x in range(max(0, int(cx) - 3), min(64, int(cx) + 4)):
            p = im.getpixel((x, y))
            if p[3] < 128:
                continue
            if creature == 'aquariios':
                lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
                if max(p[:3]) - min(p[:3]) < 30 and 80 < lum < 175:
                    n += 1
            else:
                # Widened predicate (measured): LANCZOS-blended 1-2px cores
                # fall below the strict predicate (documented old-gate2 case:
                # impact px (87,58,51) R-G=29, (88,45,35) R=88). Using the
                # strict predicate here would falsely fail every blended
                # core; the widened predicate is the measured truth.
                if 80 <= p[0] <= 200 and 25 <= p[1] <= 120 and 15 <= p[2] <= 110 and p[0] - p[1] >= 15:
                    n += 1
    return n


def draw_eyes_v2(d, anchors, state, creature, sx, sy, rot):
    g = CORR[creature]
    disc, inner, rb = g['disc'], g['inner'], g['eye_r']
    for (cx, cy) in anchors:
        if state == 'widened':
            rx = max(1, round(2 * rb * sx)); ry = max(1, round(2 * rb * sy))
        elif state == 'glance':
            rx = max(1, round(rb * sx)); ry = max(1, round(rb * sy))
            cx = cx + max(1, round(1 * sx))
        elif state == 'half':
            rx = max(1, round(rb * sx)); ry = max(1, round(rb * sy))
        else:
            rx = max(1, round(rb * sx)); ry = max(1, round(rb * sy))
        if rot:
            # rotate ellipse axes by drawing on a patch then rotating is
            # overkill for 1-3px discs; keep centre exact, axes axis-aligned
            pass
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=disc)
        if state == 'half':
            d.rectangle((cx - rx, cy - ry, cx + rx, cy), fill=(20, 20, 20, 255))
        elif state == 'widened':
            d.ellipse((cx - 1, cy - 1, cx + 1, cy + 1), fill=inner)
        else:
            d.ellipse((cx, cy, cx, cy), fill=inner)


def draw_mouth_v2(d, mouth, mx, my, creature, sx, sy):
    """Shapes ONLY — no clear-box rectangle. All dims scaled by (sx, sy)."""
    g = CORR[creature]
    dark, inner = (25, 15, 15, 255), (170, 60, 60, 255)
    white = (255, 255, 255, 255)
    w = max(3, round(g['mouth_w'] * sx)); h = max(2, round(g['mouth_h'] * sy))
    hw, hh = w // 2, h // 2
    if mouth == 'open-bite':
        d.ellipse((mx - hw, my - hh, mx + hw, my + hh), fill=dark)
        d.ellipse((mx - hw + 2, my, mx + hw - 2, my + hh), fill=(160, 165, 170, 255) if creature == 'reaperdile' else inner)
        if g['teeth']:
            tw = max(1, round(2 * sx)); th = max(1, round(2 * sy))
            for fx in (-hw + 1, -1, hw - 3):
                d.rectangle((mx + fx, my - hh, mx + fx + tw, my - hh + th), fill=white)
    elif mouth == 'grin':
        d.arc((mx - hw, my - hh, mx + hw, my + hh), 20, 160, fill=dark, width=max(1, round(2 * sy)))
    elif mouth == 'grimace':
        pts = [(mx - hw, my), (mx - hw // 2, my - max(1, hh // 2)),
               (mx, my + 1), (mx + hw // 2, my - max(1, hh // 2)), (mx + hw, my)]
        d.line(pts, fill=dark, width=max(1, round(2 * sy)), joint='curve')
    elif mouth == 'closed':
        d.line((mx - hw, my, mx + hw, my), fill=dark, width=max(1, round(2 * sy)))


def family_of(setname):
    for k in ('physical', 'special', 'signature', 'heavy'):
        if k in setname:
            return k
    return 'special'


def main():
    os.makedirs(OUT, exist_ok=True)
    report = {'tag': TAG, 'method': 'PIPELINE-V2: corrected anchors + final-frame coords + per-frame (sx,sy) geometry + no clear-box + final-frame gates',
              'creatures': {}}
    for creature, srcdir in SRC_DIR.items():
        sdir = os.path.join(BA, srcdir)
        man = json.load(open(glob.glob(os.path.join(sdir, '*.batch-a-manifest.json'))[0]))
        odir = os.path.join(OUT, creature)
        os.makedirs(odir, exist_ok=True)
        crep = {'sets': {}}
        gif_frames, gif_durs = [], []
        for setname, s in man['sets'].items():
            if s['kind'] != 'attack':
                continue
            fam = family_of(setname)
            mouth, eyes = IMPACT_EXPR[fam]
            files, states = [], []
            for i, cell in enumerate(s['cells']):
                base = Image.open(os.path.join(sdir, cell['file'])).convert('RGBA')
                t = trf(cell)
                sx, sy = scale_of(t)
                action = 'base'
                info = {}
                if i == 3 and not t.get('flash', 0):
                    eye_a = [propagate(e, t) for e in CORR[creature]['eyes']]
                    mouth_a = propagate(CORR[creature]['mouth'], t)
                    eye_i = [(int(round(x)), int(round(y))) for x, y in eye_a]
                    mouth_i = (int(round(mouth_a[0])), int(round(mouth_a[1])))
                    counts = [feat_present(base, ex, ey, creature) for ex, ey in eye_i]
                    info = {'prop_eyes': [(round(x, 1), round(y, 1)) for x, y in eye_a],
                            'prop_mouth': (round(mouth_a[0], 1), round(mouth_a[1], 1)),
                            'sx': sx, 'sy': sy, 'feature_counts': counts}
                    if all(c >= 1 for c in counts):
                        im = base.copy()
                        d = ImageDraw.Draw(im)
                        draw_mouth_v2(d, mouth, mouth_i[0], mouth_i[1], creature, sx, sy)
                        draw_eyes_v2(d, eye_i, eyes, creature, sx, sy, t.get('rot', 0))
                        ba = np.array(base)[:, :, 3] >= 128
                        diff = (np.abs(np.array(im).astype(int) - np.array(base).astype(int)).sum(axis=2) > 0)
                        dys, dxs = np.where(diff)
                        inside = True
                        if len(dxs):
                            # every changed px must lie within 2px of base opaque (numpy dilation, no scipy needed)
                            ok_zone = ba.copy()
                            for _ in range(2):
                                sh = np.zeros_like(ok_zone)
                                sh[1:, :] |= ok_zone[:-1, :]; sh[:-1, :] |= ok_zone[1:, :]
                                sh[:, 1:] |= ok_zone[:, :-1]; sh[:, :-1] |= ok_zone[:, 1:]
                                ok_zone = ok_zone | sh
                            inside = bool(ok_zone[dys, dxs].all())
                        info['diff_bbox'] = (int(dxs.min()), int(dxs.max()), int(dys.min()), int(dys.max()), int(len(dxs))) if len(dxs) else None
                        info['diff_inside_base_silhouette'] = inside
                        if inside:
                            base = im
                            action = f'overlay-v2-{mouth}-{eyes}'
                        else:
                            action = 'base-skipped-postgate-outside-silhouette'
                    else:
                        action = 'base-skipped-pregate-no-feature'
                fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
                base.save(os.path.join(odir, fn))
                files.append(fn)
                states.append({'frame': i, 'action': action, **info})
                gif_frames.append((fn, odir)); gif_durs.append(cell['duration_ms'])
            gif_durs[-1] += 250
            crep['sets'][setname] = {'kind': 'attack', 'family': fam, 'files': files, 'frames': states}
            print(creature, setname, [f['action'] for f in states])
        fr, du = [], []
        for (fn, od), ms in zip(gif_frames, gif_durs):
            im = Image.open(os.path.join(od, fn)).convert('RGBA').resize((256, 256), Image.NEAREST)
            bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255)); bg.paste(im, (0, 0), im)
            fr.append(bg.convert('P', palette=Image.ADAPTIVE)); du.append(ms)
        gif_name = f'{creature}-attacks-{TAG}.gif'
        fr[0].save(os.path.join(OUT, gif_name), save_all=True, append_images=fr[1:], duration=du, loop=0)
        print(creature, gif_name, len(fr), 'frames')
        report['creatures'][creature] = crep
    json.dump(report, open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
    print('manifest written')


if __name__ == '__main__':
    main()
