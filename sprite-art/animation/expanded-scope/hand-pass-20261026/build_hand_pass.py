#!/usr/bin/env python3
"""Hand-movement pass, Layer 2 Phase 1 (2026-10-26).

Adds HAND overlays only, on top of approved face finals (ship) or staged
face sets (staged-only). Never overwrites anything Mars has seen: all
outputs are NEW files under hand-pass-20261026/ (ship) and
hand-pass-20261026-staged/ (staged). No generations, PIL only.
Spec: HAND-PASS-SPEC-2026-10-26.md in the same dir.
"""
import json, os, re, sys
from collections import Counter
from PIL import Image, ImageDraw, ImageFilter

BASE = '/home/hatch/workspace/mochiichao-work/sprite-art/animation/expanded-scope'
OUT_SHIP = os.path.join(BASE, 'hand-pass-20261026')
OUT_STAGED = os.path.join(BASE, 'hand-pass-20261026-staged')
TAG = 'hand20261026'

# (mouth, eyes, hands) roles are face grammar; only HANDS is used here.
FAMILY_HANDS = {
    'physical': {'windup': 'guard', 'lean': 'guard', 'charge': 'guard',
                 'strike': 'punch', 'impact': 'punch', 'hold': 'punch',
                 'recover': 'folded'},
    'special': {'windup': 'cast', 'lean': 'cast', 'charge': 'cast',
                'strike': 'cast', 'impact': 'cast', 'hold': 'cast',
                'recover': 'folded'},
    'signature': {'windup': 'brace', 'lean': 'brace', 'charge': 'brace',
                  'strike': 'brace', 'impact': 'brace', 'hold': 'brace',
                  'recover': 'folded'},
    'heavy': {'windup': 'grab', 'lean': 'grab', 'charge': 'grab',
              'strike': 'punch', 'impact': 'grab', 'hold': 'grab',
              'recover': 'folded'},
    'flinch': {'impact': 'guard', 'recoil': 'folded', 'stagger': 'folded',
               'recover': 'folded'},
    'knockback': {'impact': 'flail', 'recoil': 'flail', 'stagger': 'droop',
                  'recover': 'folded'},
    'wobble': {'impact': 'guard', 'recoil': 'flail', 'stagger': 'guard',
               'recover': 'folded'},
    'stagger': {'impact': 'droop', 'recoil': 'droop', 'stagger': 'droop',
                'recover': 'folded'},
}

def roles(kind, n):
    if kind == 'attack':
        return ['windup', 'lean', 'strike', 'impact', 'recover'][:n] if n == 5 else \
               ['windup', 'charge', 'strike', 'impact', 'hold', 'recover'][:n]
    return ['impact', 'recoil', 'recover'][:n] if n == 3 else \
           ['impact', 'recoil', 'stagger', 'recover'][:n]

def family_of(setname, kind):
    if kind == 'attack':
        for fam in ('physical', 'special', 'signature', 'heavy'):
            if f'atk_{fam}_' in setname or setname.startswith(f'atk_{fam}'):
                return fam
    else:
        for fam in ('flinch', 'knockback', 'wobble', 'stagger'):
            if fam in setname:
                return fam
    raise ValueError(f'unknown family: {setname}')

STD_DUR = {
    ('attack', 'physical', 5): [180, 120, 100, 90, 300],
    ('attack', 'special', 5): [200, 140, 110, 110, 300],
    ('attack', 'signature', 6): [200, 220, 100, 140, 120, 300],
    ('attack', 'heavy', 6): [220, 160, 140, 120, 100, 420],
    ('hurt', 'flinch', 3): [140, 180, 200],
    ('hurt', 'knockback', 4): [160, 180, 180, 180],
    ('hurt', 'wobble', 3): [200, 240, 300],
    ('hurt', 'stagger', 4): [280, 300, 300, 300],
}

PILOT_FIST = {
    'mochii': {'guard': [(20, 46), (44, 46)], 'punch': (54, 40),
               'grab': [(28, 50), (36, 50)], 'flail': [(14, 22), (50, 22)],
               'droop': [(14, 52), (50, 52)], 'cast': (48, 32)},
    'dreadtoise': {'guard': [(20, 44), (46, 44)], 'punch': (52, 44),
                   'grab': [(26, 50), (40, 50)], 'flail': [(12, 24), (54, 24)],
                   'droop': [(16, 54), (50, 54)], 'cast': (33, 20),
                   'brace': [(14, 36), (52, 36)]},
}
CLAWED = {'aquariios', 'reaperdile', 'tyrage', 'duneclaw', 'oblivirex',
          'razorgater'}
PAW_NOTE = {'terradog', 'manticlaw', 'pyropaw', 'quakehound', 'mythar'}

def sil_bbox(im):
    a = im.getchannel('A')
    bb = a.getbbox()
    return bb  # (x0, y0, x1, y1), x1/y1 exclusive

def dil_mask(im, px=2):
    a = im.getchannel('A').point(lambda v: 255 if v > 0 else 0)
    if px:
        a = a.filter(ImageFilter.MaxFilter(px * 2 + 1))
    return a

def skin_median(im, cx, cy):
    px = im.load()
    vals = []
    for y in range(max(0, cy - 3), min(64, cy + 4)):
        for x in range(max(0, cx - 3), min(64, cx + 4)):
            r, g, b, al = px[x, y]
            if al > 0:
                vals.append((r, g, b))
    if not vals:
        return None
    vals.sort()
    return vals[len(vals) // 2]

def derived_anchors(bb):
    x0, y0, x1, y1 = bb
    w, h, cx = x1 - x0, y1 - y0, (x0 + x1) // 2
    return {
        'guard': [(round(x0 + 0.20 * w), round(y0 + 0.60 * h)),
                  (round(x1 - 0.20 * w), round(y0 + 0.60 * h))],
        'punch': (round(x1 - 0.08 * w), round(y0 + 0.55 * h)),
        'grab': [(round(cx - 0.12 * w), round(y0 + 0.68 * h)),
                 (round(cx + 0.12 * w), round(y0 + 0.68 * h))],
        'flail': [(round(x0 + 0.10 * w), round(y0 + 0.28 * h)),
                  (round(x1 - 0.10 * w), round(y0 + 0.28 * h))],
        'droop': [(round(x0 + 0.14 * w), round(y1 - 0.10 * h)),
                  (round(x1 - 0.14 * w), round(y1 - 0.10 * h))],
        'cast': (round(cx + 0.18 * w), round(y0 + 0.42 * h)),
        'brace': [(round(x0 + 0.16 * w), round(y0 + 0.50 * h)),
                  (round(x1 - 0.16 * w), round(y0 + 0.50 * h))],
    }

def anchors_for(creature, im):
    if creature in PILOT_FIST:
        return PILOT_FIST[creature], 'pilot-measured'
    bb = sil_bbox(im)
    return derived_anchors(bb), f'derived-from-silhouette-bbox-{bb}'

def fist(d, xy, color, r=4):
    d.ellipse((xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r),
              fill=color, outline=(10, 10, 10, 255), width=1)

def draw_hands(d, state, A, skin, clawed):
    if state in ('folded', 'none'):
        return []
    if state == 'punch':
        p = A['punch']
        fist(d, p, skin, 5)
        for y in (p[1] - 3, p[1], p[1] + 3):
            d.line((p[0] - 10, y, p[0] - 6, y), fill=(255, 255, 255, 200), width=1)
        return [p]
    if state == 'claw':
        p = A['punch']
        for k, dy in enumerate((-6, 0, 6)):
            d.arc((p[0] - 16, p[1] - 10 + dy, p[0] + 2, p[1] + 8 + dy),
                  start=-50, end=50, fill=(255, 255, 255, 255), width=2)
        return [p]
    if state == 'cast':
        cx, cy = A['cast']
        for r, col in ((6, (220, 220, 220, 120)), (4, (240, 240, 240, 200)),
                       (2, (255, 255, 255, 255))):
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
        return [(cx, cy)]
    key = state  # guard / grab / flail / droop / brace
    pts = A.get(key, A['guard'])
    for xy in pts:
        fist(d, xy, skin, 4)
    return list(pts)

def gif_durations(path, ncells):
    try:
        im = Image.open(path)
        durs = []
        for i in range(ncells):
            im.seek(i)
            durs.append(im.info.get('duration', 150))
        if len(durs) == ncells and all(durs):
            return durs
    except Exception as e:
        print(f'  gif durations unavailable {path}: {e}')
    return None

def diff_stats(a, b):
    """(changed_px, bbox) between two RGBA images, alpha-aware."""
    import numpy as np
    A = np.array(a).astype(int)
    B = np.array(b).astype(int)
    diff = (np.abs(A - B).sum(axis=2) > 0)
    n = int(diff.sum())
    if n == 0:
        return 0, None
    ys, xs = np.where(diff)
    return n, [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]


# ---------------- source specs ----------------

def ship_specs():
    """Return {creature: {mode, base, sets: {setname: {kind, family, files,
    roles, impact, durations, source}}}} from the approved manifests."""
    specs = {}
    # pilots: retime manifest
    rt = json.load(open(os.path.join(
        BASE, 'articulation-v3-impact/manifest-retime20261026.json')))
    rtdir = 'articulation-v3-impact/mochii'
    for setname, s in rt['mochii_attacks'].items():
        specs.setdefault('mochii', {'mode': 'persistent', 'base': rtdir,
                                    'sets': {}, 'source': 'retime Mode B'})['sets'][setname] = {
            'kind': 'attack', 'family': family_of(setname, 'attack'),
            'files': s['files'], 'roles': [f['role'] for f in s['frames']],
            'impact': [i for i, f in enumerate(s['frames']) if f['role'] == 'impact'],
            'durations': [f['duration_ms'] for f in s['frames']]}
    specs['mochii']['hurts_base'] = True
    rtd = 'articulation-v3-impact/dreadtoise'
    for setname, s in rt['dreadtoise_hurts'].items():
        specs.setdefault('dreadtoise', {'mode': 'impact', 'base': rtd,
                                        'sets': {}, 'source': 'retime Mode A'})['sets'][setname] = {
            'kind': 'hurt', 'family': family_of(setname, 'hurt'),
            'files': s['files'], 'roles': [f['role'] for f in s['frames']],
            'impact': [i for i, f in enumerate(s['frames']) if f['role'] == 'impact'],
            'durations': [f['duration_ms'] for f in s['frames']]}
    # pipev2: aquariios + reaperdile
    p2 = json.load(open(os.path.join(BASE, 'articulation-pipev2/manifest-artic-pipev2-20261026.json')))
    for c in ('aquariios', 'reaperdile'):
        d = f'articulation-pipev2/{c}'
        gifp = os.path.join(BASE, 'articulation-pipev2',
                            f'{c}-attacks-artic-pipev2-20261026.gif')
        for setname, s in p2['creatures'][c]['sets'].items():
            n = len(s['files'])
            durs = gif_durations(gifp, 22)
            # gif holds all 4 sets concatenated; slice by file order across sets
            specs.setdefault(c, {'mode': 'impact', 'base': d,
                                 'sets': {}, 'source': 'pipev2 PR #164'})['sets'][setname] = {
                'kind': 'attack', 'family': s.get('family', family_of(setname, 'attack')),
                'files': s['files'],
                'roles': roles('attack', n),
                'impact': [i for i, f in enumerate(s['frames'])
                           if f.get('action', '').startswith('overlay')],
                'durations': None}
        specs[c]['_gif'] = gifp
    # v3q (11) + v2rework-only (11)
    v3q = json.load(open(os.path.join(
        BASE, 'articulation-v2-rework-v3/manifest-artic-pipev3q-20261026.json')))
    v3q11 = ['ashemit', 'floatcalf', 'gabu', 'kittember', 'mythar', 'punchkid',
             'sproutle', 'strikechamp_unsuited', 'strikechamp_unsuited_full',
             'tiidebiite', 'tyrage']
    for batch, bv in v3q['batches'].items():
        for c, cd in bv['creatures'].items():
            if c not in v3q11:
                continue
            d = f'articulation-v2-rework-v3/{batch}/{c}'
            gifp = os.path.join(BASE, f'articulation-v2-rework-v3/{batch}',
                                f'{c}-attacks-artic-pipev3q-20261026.gif')
            for setname, s in cd['sets'].items():
                n = len(s['files'])
                specs.setdefault(c, {'mode': 'impact', 'base': d,
                                     'sets': {}, 'source': 'v3q PR #173'})['sets'][setname] = {
                    'kind': 'attack', 'family': s.get('family', family_of(setname, 'attack')),
                    'files': s['files'], 'roles': roles('attack', n),
                    'impact': [i for i, f in enumerate(s['frames'])
                               if f.get('action', '') != 'copy-v2eyes'],
                    'durations': None}
            specs[c]['_gif'] = gifp
    v2r11 = ['inklet', 'krakenox', 'pebblefist', 'pyromonk', 'squirmite',
             'stormtalon', 'strikechamp', 'terradog', 'toxitacle',
             'yogiferno', 'zephling']
    v2r_files = {
        'batch-c': 'manifest-artic-v2rework-20261026.json',
        'batch-d': 'batch-d-artic-artic-v2rework-20261026-manifest.json',
        'batch-e': 'manifest-artic-v2rework-20261026-eyesonly.json',
    }
    for batch, mf in v2r_files.items():
        mp = os.path.join(BASE, 'articulation-v2-rework', batch, mf)
        if not os.path.exists(mp):
            print(f'  v2rework manifest missing: {mp}'); continue
        m = json.load(open(mp))
        for c, cd in m['creatures'].items():
            if c not in v2r11:
                continue
            d = f'articulation-v2-rework/{batch}/{c}'
            gifp = os.path.join(BASE, f'articulation-v2-rework/{batch}',
                                f'{c}-attacks-artic-v2rework-20261026.gif')
            if not os.path.exists(gifp):
                alt = os.path.join(BASE, f'articulation-v2-rework/{batch}',
                                   f'{c}-attacks-artic-v2rework-20261026-eyesonly.gif')
                if os.path.exists(alt):
                    gifp = alt
            for setname, s in cd['sets'].items():
                n = len(s['files'])
                imp = [i for i, f in enumerate(s['frames'])
                       if 'overlay' in f.get('action', '')]
                if not imp:
                    imp = [3] if n >= 4 else [0]
                specs.setdefault(c, {'mode': 'impact', 'base': d,
                                     'sets': {}, 'source': 'v2rework PR #174'})['sets'][setname] = {
                    'kind': 'attack', 'family': s.get('family', family_of(setname, 'attack')),
                    'files': s['files'], 'roles': roles('attack', n),
                    'impact': imp, 'durations': None}
            specs[c]['_gif'] = gifp
    # resolve gif durations per creature (concatenated set order = manifest order)
    for c, sp in specs.items():
        if '_gif' in sp:
            sets = list(sp['sets'].values())
            total = sum(len(s['files']) for s in sets)
            durs = gif_durations(sp['_gif'], total)
            if durs:
                off = 0
                for s in sets:
                    s['durations'] = durs[off:off + len(s['files'])]
                    off += len(s['files'])
            else:
                for s in sets:
                    s['durations'] = STD_DUR.get(
                        (s['kind'], s['family'], len(s['files'])),
                        [150] * len(s['files']))
        sp.pop('_gif', None)
    return specs

def staged_specs():
    """Group staged base-dir files by set; Mode A staged-default."""
    resolve = json.load(open(os.path.join(OUT_SHIP, 'staged-base-resolve.json')))
    build = ['cragarm', 'dorowani', 'duneclaw', 'duskfiend', 'gearkid',
             'gorokappa', 'kickmaster', 'manticlaw', 'mechapion',
             'oblivirex', 'pixilite', 'pupbble', 'pyropaw', 'quakehound',
             'razorgater', 'shellguard']
    specs = {}
    pat = re.compile(r'-(atk_.+|hurt_.+)-cell-(\d+)\.png$')
    for c in build:
        cand, _ = resolve[c]
        d = os.path.join(BASE, cand, c)
        groups = {}
        for fn in sorted(os.listdir(d)):
            m = pat.search(fn)
            if not m:
                continue
            groups.setdefault(m.group(1), []).append(fn)
        sets = {}
        for setname, files in sorted(groups.items()):
            kind = 'attack' if setname.startswith('atk_') else 'hurt'
            fam = family_of(setname, kind)
            n = len(files)
            sets[setname] = {'kind': kind, 'family': fam, 'files': files,
                             'roles': roles(kind, n),
                             'impact': [3] if kind == 'attack' and n >= 4 else [0],
                             'durations': STD_DUR.get((kind, fam, n), [150] * n)}
        specs[c] = {'mode': 'impact-staged-default', 'base': f'{cand}/{c}',
                    'sets': sets, 'source': f'staged base {cand}'}
    return specs

# ---------------- build ----------------

def build_creature(creature, spec, outroot):
    outdir = os.path.join(outroot, creature)
    os.makedirs(outdir, exist_ok=True)
    mode = spec['mode']
    man_sets, gif_frames = {}, {}
    n_hand_frames, n_copy_frames, n_flagged = 0, 0, 0
    flags = []
    for setname, s in spec['sets'].items():
        fam, kind = s['family'], s['kind']
        rls = s['roles']
        hand_states = []
        for r in rls:
            h = FAMILY_HANDS[fam][r]
            if h == 'punch' and creature in CLAWED and kind == 'attack':
                h = 'claw'
            if creature == 'mochii' and kind == 'hurt' and h == 'flail':
                h = 'guard'
            if creature == 'mochii' and fam == 'signature' and h == 'brace':
                h = 'guard'  # pilot verbatim fallback (no mochii brace anchor)
            hand_states.append(h)
        if mode == 'persistent':
            apply = [h not in ('folded', 'none') for h in hand_states]
        elif mode in ('impact', 'impact-staged-default'):
            apply = [i in s['impact'] for i in range(len(s['files']))]
        else:
            apply = [False] * len(s['files'])
        new_files, frame_notes = [], []
        for i, fn in enumerate(s['files']):
            srcp = os.path.join(BASE, spec['base'], fn)
            src = Image.open(srcp).convert('RGBA')
            outfn = f'{creature}-{TAG}-{setname}-cell-{i:02d}.png'
            note = {'frame': i, 'role': rls[i], 'hand_state': hand_states[i],
                    'source': fn, 'applied': False}
            if apply[i] and hand_states[i] not in ('folded', 'none'):
                A, anchor_src = anchors_for(creature, src)
                bb = sil_bbox(src)
                skin = skin_median(src, (bb[0] + bb[2]) // 2,
                                   bb[1] + int(0.72 * (bb[3] - bb[1])))
                if skin is None:
                    skin = skin_median(src, (bb[0] + bb[2]) // 2, (bb[1] + bb[3]) // 2)
                layer = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
                d = ImageDraw.Draw(layer)
                pts = draw_hands(d, hand_states[i], A, skin or (128, 128, 128),
                                 creature in CLAWED)
                mask = dil_mask(src, 2)
                # gate G3: fist centres inside dilated silhouette
                mpx = mask.load()
                ok = all(0 <= x < 64 and 0 <= y < 64 and mpx[x, y] > 0 for x, y in pts)
                if not ok or skin is None:
                    flags.append({'set': setname, 'frame': i,
                                  'reason': 'anchor-outside-silhouette' if ok is False else 'no-skin-sample'})
                    src.save(os.path.join(outdir, outfn))
                    note['flag'] = flags[-1]['reason']
                    n_flagged += 1
                else:
                    comp = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
                    comp.paste(layer, (0, 0), mask)
                    out = Image.alpha_composite(src, comp)
                    nch, bbox = diff_stats(src, out)
                    if nch == 0:
                        flags.append({'set': setname, 'frame': i,
                                      'reason': 'zero-change'})
                        src.save(os.path.join(outdir, outfn))
                        note['flag'] = 'zero-change'
                        n_flagged += 1
                    else:
                        out.save(os.path.join(outdir, outfn))
                        note.update({'applied': True, 'changed_px': nch,
                                     'diff_bbox': bbox, 'anchors': anchor_src})
                        n_hand_frames += 1
            else:
                src.save(os.path.join(outdir, outfn))
                n_copy_frames += 1
            new_files.append(outfn)
            frame_notes.append(note)
        man_sets[setname] = {'kind': kind, 'family': fam, 'roles': rls,
                             'hand_states': hand_states, 'files': new_files,
                             'durations_ms': s['durations'],
                             'total_ms': sum(s['durations']),
                             'frames': frame_notes}
        # gif frames for this set
        for fn, ms in zip(new_files, s['durations']):
            im = Image.open(os.path.join(outdir, fn)).convert('RGBA').resize(
                (256, 256), Image.NEAREST)
            bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255))
            bg.paste(im, (0, 0), im)
            gif_frames.setdefault(kind, []).append((bg.convert(
                'P', palette=Image.ADAPTIVE), ms))
    gifs = {}
    for kind, fr in gif_frames.items():
        if not fr:
            continue
        durs = [ms for _, ms in fr]
        durs[-1] += 250
        gp = os.path.join(outdir, f'{creature}-{kind}s-{TAG}.gif')
        fr[0][0].save(gp, save_all=True,
                      append_images=[f for f, _ in fr[1:]], duration=durs, loop=0)
        gifs[kind] = {'gif': os.path.basename(gp), 'frames': len(fr)}
    man = {'creature': creature, 'tag': TAG,
           'method': 'Layer 2 hand overlays only on approved/staged face finals; 0 generations; base finals untouched',
           'source_final': spec['source'], 'timing_mode': mode,
           'clawed_physical': creature in CLAWED,
           'paw_note': creature in PAW_NOTE,
           'sets': man_sets, 'gifs': gifs, 'flags': flags,
           'counts': {'hand_frames': n_hand_frames, 'copy_frames': n_copy_frames,
                      'flagged_frames': n_flagged,
                      'cells': n_hand_frames + n_copy_frames + n_flagged}}
    json.dump(man, open(os.path.join(outdir, f'{creature}-{TAG}-manifest.json'), 'w'), indent=1)
    # G1 verify: copy frames byte-identical to base
    g1_fail = []
    for setname, s in spec['sets'].items():
        for i, fn in enumerate(s['files']):
            if not man_sets[setname]['frames'][i]['applied']:
                a = open(os.path.join(BASE, spec['base'], fn), 'rb').read()
                b = open(os.path.join(outdir, man_sets[setname]['files'][i]), 'rb').read()
                if a != b:
                    g1_fail.append((setname, i))
    man['gate_g1_copy_identical'] = (len(g1_fail) == 0)
    json.dump(man, open(os.path.join(outdir, f'{creature}-{TAG}-manifest.json'), 'w'), indent=1)
    print(f'{creature}: sets={len(man_sets)} hand={n_hand_frames} copy={n_copy_frames} flagged={n_flagged} g1={man["gate_g1_copy_identical"]}')
    return man


# ---------------- main ----------------

SHIP_BUILD = ['aquariios', 'ashemit', 'dreadtoise', 'gabu', 'mochii',
              'mythar', 'punchkid', 'pyromonk', 'reaperdile', 'sproutle',
              'strikechamp', 'strikechamp_unsuited',
              'strikechamp_unsuited_full', 'terradog', 'tiidebiite',
              'tyrage', 'yogiferno']
SHIP_HNONE = {
    'floatcalf': 'levitating, no hands visible in front cell; H-none per grammar (levitating creatures)',
    'squirmite': 'limbless worm; no arms/hands visible; H-none per grammar (limbless creatures)',
}
SHIP_EXCLUDED = {
    'inklet': 'tentacles, no hands; tentacle-tip-as-hand vs glow-only needs a Mars canon call',
    'kittember': 'paws tucked into body mass in front cell, no distinct paw anchor; paw pose needs a Mars canon call',
    'krakenox': 'no delineated limbs in front cell (dark spiky mass); tentacle form needs a Mars canon call',
    'pebblefist': 'front cell is head-only framing, no arms visible; arm form needs a Mars canon call',
    'stormtalon': 'wings + talons, no hands; wing/talon-as-hand needs a Mars canon call',
    'toxitacle': 'tentacles, no hands; tentacle-tip-as-hand vs glow-only needs a Mars canon call',
    'zephling': 'bird wings, no hands; wing-as-hand needs a Mars canon call',
}
STAGED_HNONE = {
    'cocoonode': 'canon: NO face, NO limbs (Batch B group 2 record); H-none',
    'finblade': 'faceless top-down front, no arms (Batch B group 3 record); H-none',
    'megalochrome': 'levitating disc, side probes/fins, no arms visible; H-none (levitating)',
    'mothrix': 'moth wings only, ~8px head; no hands, overlay scale would dwarf face (Batch B group 2 record); H-none',
    'wispkin': 'levitating wisp/smoke, no limbs visible; H-none (levitating)',
}
STAGED_EXCLUDED = {
    'aerobeak': 'bird wings + talons, no hands; wing/talon-as-hand needs a Mars canon call',
    'astroleviathan': 'tentacle/star appendages, form unclear in front cell; appendage-as-hand needs a Mars canon call',
    'terrapod': 'rock tortoise mass, forelimbs not distinct in front cell; limb form needs a Mars canon call',
    'chromejaww': 'no staged 4-set attack/hurt base exists anywhere (audit-only, no cells)',
}

def sample_sheet():
    pairs = [
        ('mochii', 'atk_physical_body_slam'),
        ('dreadtoise', 'hurt_heavy_knockback'),
        ('aquariios', 'atk_physical_aqua_ram'),
        ('punchkid', 'atk_physical_jab_rush'),
        ('terradog', 'atk_physical_terra_charge'),
        ('tiidebiite', 'atk_special_tide_jet'),
        ('strikechamp_unsuited_full', 'atk_signature_suit_barrage'),
    ]
    specs = ship_specs()
    TILE, LABEL = 512, 40
    rows = len(pairs)
    sheet = Image.new('RGBA', (TILE * 2, rows * (TILE + LABEL)), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (c, setname) in enumerate(pairs):
        man = json.load(open(os.path.join(OUT_SHIP, c, f'{c}-{TAG}-manifest.json')))
        s = man['sets'][setname]
        imp = [f for f in s['frames'] if f['applied']]
        fr = imp[0] if imp else s['frames'][0]
        basep = os.path.join(BASE, specs[c]['base'], fr['source'])
        handp = os.path.join(OUT_SHIP, c, s['files'][fr['frame']])
        y = i * (TILE + LABEL)
        for j, p in enumerate((basep, handp)):
            im = Image.open(p).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
            sheet.paste(im, (j * TILE, y), im)
        dr.text((8, y + TILE + 10),
                f'{c} {setname} frame {fr["frame"]} hand={fr["hand_state"]} | LEFT base final | RIGHT hand pass',
                fill=(255, 255, 255, 255))
    out = os.path.join(OUT_SHIP, 'show-hand-sample-512.png')
    sheet.save(out)
    print('sample sheet:', out, sheet.size)

def main():
    specs = ship_specs()
    print('ship specs creatures:', sorted(specs.keys()))
    for c, sp in specs.items():
        for setname, s in sp['sets'].items():
            if not s['impact']:
                print(f'  WARNING no impact frame detected: {c} {setname} -> fallback [3]')
                s['impact'] = [3]
    index = {'tag': TAG, 'ship': {}, 'staged': {}, 'hnone_ship': SHIP_HNONE,
             'hnone_staged': STAGED_HNONE, 'excluded_ship': SHIP_EXCLUDED,
             'excluded_staged': STAGED_EXCLUDED}
    for c in SHIP_BUILD:
        if c not in specs:
            print(f'  ERROR ship creature missing from specs: {c}')
            continue
        man = build_creature(c, specs[c], OUT_SHIP)
        index['ship'][c] = {'source': specs[c]['source'],
                            'mode': specs[c]['mode'],
                            'sets': list(specs[c]['sets'].keys()),
                            'counts': man['counts'],
                            'flags': man['flags'],
                            'g1': man['gate_g1_copy_identical']}
    sspecs = staged_specs()
    for c, sp in sspecs.items():
        man = build_creature(c, sp, OUT_STAGED)
        index['staged'][c] = {'source': sp['source'], 'mode': sp['mode'],
                              'sets': list(sp['sets'].keys()),
                              'counts': man['counts'],
                              'flags': man['flags'],
                              'g1': man['gate_g1_copy_identical']}
    json.dump(index, open(os.path.join(OUT_SHIP, f'{TAG}-manifest.json'), 'w'), indent=1)
    sample_sheet()
    ship_cells = sum(v['counts']['cells'] for v in index['ship'].values())
    ship_hand = sum(v['counts']['hand_frames'] for v in index['ship'].values())
    st_cells = sum(v['counts']['cells'] for v in index['staged'].values())
    st_hand = sum(v['counts']['hand_frames'] for v in index['staged'].values())
    print(f'SUMMARY ship creatures={len(index["ship"])} cells={ship_cells} hand_frames={ship_hand}')
    print(f'SUMMARY staged creatures={len(index["staged"])} cells={st_cells} hand_frames={st_hand}')
    print(f'SUMMARY hnone ship={len(SHIP_HNONE)} staged={len(STAGED_HNONE)} excluded ship={len(SHIP_EXCLUDED)} staged={len(STAGED_EXCLUDED)}')

if __name__ == '__main__':
    main()
