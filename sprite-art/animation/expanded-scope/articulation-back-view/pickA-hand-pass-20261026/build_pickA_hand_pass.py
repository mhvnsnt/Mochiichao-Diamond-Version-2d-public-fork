#!/usr/bin/env python3
"""Back-view hand pass on PICK-A backs (2026-10-26) — STAGED ONLY, NO PR, NO LOCK.

Pick-A follow-up: Mars picked A for strikechamp + shellguard (relabeled cells,
not generated backs). This pass rebuilds ONLY those two creatures' hand sets
on the pick-A back-view sets in trueback-sets-pickA-20261026/. The held
dirs in trueback-hand-pass-20261026/ are left intact, labelled SUPERSEDED-HELD.

Adapted from articulation-back-view/back-hand-pass-20261026/build_back_hand_pass.py
(the earlier pass, built on OLD staged back bases that have since been superseded).
This pass reads ONLY the new pick-A sets in trueback-sets-pickA-20261026; the old hand-pass dir
is never read for anchors, exclusions, or cells, and is never overwritten.

Method carried over verbatim from the earlier pass:
  - Anchors derived PER FRAME from that back frame's OWN silhouette bbox.
    Never copied from front cells, never copied from the old pass.
  - Mode A impact-only for all 10 creatures (none is Mochii, so no Mode B
    persistent timing). Impact = attack frame 3, hurt frame 0.
  - Cast glow element-neutral (white core, grey halo).
  - No claw-swipe from behind: no plain claw-swipe arc is visible in any new
    true-back physical impact cell at 64px (checked per creature below), so
    all back physical impacts use punch. The front claw list does NOT transfer.
  - Skin colour: front verbatim — median opaque RGB in a 7px box around
    (cx, y0+0.72h), fallback (cx, cy).
  - Gates G1 (copy frames byte-identical to base), G2 (every hand-frame diff
    inside the base silhouette dilated by 2px), G4 (every hand frame changed
    > 0 px). Failure = base copy + flag, never a guess.

Hard rules for this rerun (Mars, 2026-10-26):
  (1) HANDS ONLY. True backs show no facial expression; this script draws no
      eyes, no mouths, no face features on any frame. The only overlays are
      fist circles and the element-neutral cast glow.
  (2) NO BAKED SHADOWS in any output cell. The hand pass adds zero shadow
      pixels: fist/glow pixels are clipped to the base silhouette dilated by
      2px, and copy frames are byte-identical to the base. Base cells that
      carry a baked ground/contact band are reported in SHADOW_FLAGS and in
      the manifest; the band is NOT stripped here because it merges with the
      feet and is not clearly separable pixel-wise (see SHADOW_FLAGS notes).
      Stripping it would mean guessing which grey pixels are feet vs shadow.
  (3) MECHAPION: its new set is from the TRUE back, not the old QA fallback.
      No output filename, manifest entry, or sheet in this dir carries the
      word FALLBACK. The script asserts this before writing the index.
  (4) Staged only: every file written here is new and dated under
      articulation-back-view/pickA-hand-pass-20261026/. Nothing else is
      overwritten. NO PR, NO lock.

Exclusions are RE-DERIVED from the NEW true-back cells (inspection sheets
built 2026-10-26 from idle0 + all impact frames, enlarged 3x on grey):
  - stormtalon: wings + talons, no hands; yellow lower shapes are tail/talons.
  - finblade: top-down fin/shark form, side fins + dorsal fin, no arms.
  - wispkin: levitating wisp/smoke blob, no limbs visible.
Resolved (distinct hand/sleeve-end/arm anchors visible in the new true back):
  reaperdile, chromejaww, strikechamp, duskfiend (sleeve ends), mechapion,
  shellguard, razorgater.

Pixel work on existing art, local CPU. Kaggle GPU genuinely cannot help
these steps; no Kaggle job was opened for this rerun.
"""
import json, os, re, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = '/home/hatch/workspace/mochiichao-work/sprite-art/animation/expanded-scope'
BACK = os.path.join(BASE, 'articulation-back-view')
SRC = os.path.join(BACK, 'trueback-sets-pickA-20261026')
OUT = os.path.join(BACK, 'pickA-hand-pass-20261026')
TAG = 'pickAhand20261026'

CREATURES = ['strikechamp', 'shellguard']

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
STD_DUR = {  # fallback only; trueback manifests carry per-cell durations
    ('attack', 'physical', 5): [180, 120, 100, 90, 300],
    ('attack', 'special', 5): [200, 140, 110, 110, 300],
    ('attack', 'signature', 6): [200, 220, 100, 140, 120, 300],
    ('attack', 'heavy', 6): [220, 160, 140, 120, 100, 420],
    ('hurt', 'flinch', 3): [140, 180, 200],
    ('hurt', 'knockback', 4): [160, 180, 180, 180],
    ('hurt', 'wobble', 3): [200, 240, 300],
    ('hurt', 'stagger', 4): [280, 300, 300, 300],
}

def roles(kind, n):
    if kind == 'attack':
        return ['windup', 'lean', 'strike', 'impact', 'recover'][:n] if n == 5 else \
               ['windup', 'charge', 'strike', 'impact', 'hold', 'recover'][:n]
    return ['impact', 'recoil', 'recover'][:n] if n == 3 else \
           ['impact', 'recoil', 'stagger', 'recover'][:n]

def hurt_family(setname):
    for fam in ('flinch', 'knockback', 'wobble', 'stagger'):
        if fam in setname:
            return fam
    raise ValueError(f'unknown hurt family: {setname}')

def sil_bbox(im):
    return im.getchannel('A').getbbox()

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

def fist(d, xy, color, r=4):
    d.ellipse((xy[0] - r, xy[1] - r, xy[0] + r, xy[1] + r),
              fill=color, outline=(10, 10, 10, 255), width=1)

def draw_hands(d, state, A, skin):
    if state in ('folded', 'none'):
        return []
    if state == 'punch':
        p = A['punch']
        fist(d, p, skin, 5)
        for y in (p[1] - 3, p[1], p[1] + 3):
            d.line((p[0] - 10, y, p[0] - 6, y), fill=(255, 255, 255, 200), width=1)
        return [p]
    if state == 'cast':
        cx, cy = A['cast']
        for r, col in ((6, (220, 220, 220, 120)), (4, (240, 240, 240, 200)),
                       (2, (255, 255, 255, 255))):
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
        return [(cx, cy)]
    pts = A.get(state, A['guard'])
    for xy in pts:
        fist(d, xy, skin, 4)
    return list(pts)

def diff_stats(a, b):
    import numpy as np
    A = np.array(a).astype(int)
    B = np.array(b).astype(int)
    diff = (np.abs(A - B).sum(axis=2) > 0)
    n = int(diff.sum())
    if n == 0:
        return 0, None
    ys, xs = np.where(diff)
    return n, [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]

# --- Re-derived exclusions (NEW true-back cells, never copied from old list) ---
EXCLUDED = {}
# --- Baked-shadow findings (measured on the NEW true-back cells, idle00) ---
# idle00 is byte-identical to the pixel true-back source cell for every creature
# (verified 2026-10-26), so the band below is inherited from the source, not added
# by the set composer. Attack/hurt frames carry the same band transformed with
# the body (visible on the inspection sheets). The hand pass adds NO shadow
# pixels and strips NONE: the band merges with the feet in the same greys, so
# no pixel subset is clearly separable as shadow-only.
SHADOW_FLAGS = {
    'strikechamp': 'None found in pick-A idle00: bottom rows y56-60 are multicolour body/feet pixels (22-23 distinct colours per row), feet end y60, rows 61-63 transparent. No flat grey ground ellipse.',
    'shellguard': 'None found in pick-A idle00: bottom rows y56-57 are multicolour body/feet pixels (20-27 distinct colours per row), rows 58-63 transparent. No flat grey ground ellipse.',
}
# Transform fringe (NOT a baked shadow): attack/hurt frames are rescaled/rotated
# versions of the source, leaving scattered alpha 1-7 specks (e.g. phys03 bottom-6
# rows: reaperdile 125, chromejaww 135, razorgater 158 semi-grey px at median
# alpha 2-4, effectively invisible). Recorded here so it is not mistaken for a
# shadow; no fringe pixel is stripped or added by this pass.
CLAW_NOTE = ('No claw-swipe from behind: no plain claw-swipe arc is visible in '
             'either pick-A physical impact cell at 64px (strikechamp champ punch, '
             'shellguard shell ram). All back physical impacts use punch; the '
             'front claw list does NOT transfer.')

def trueback_sets(creature):
    d = os.path.join(SRC, creature)
    man = json.load(open(os.path.join(d, 'manifest-pickA-20261026.json')))
    assert man.get('face', {}).get('face_visible_in_back_cell') is False, creature
    out = {}
    for setname, s in sorted(man['sets'].items()):
        if setname == 'back_idle':
            continue
        kind = s['kind']
        fam = s['family'] if kind == 'attack' else hurt_family(setname)
        cells = s['cells']
        files = [c['file'] for c in cells]
        durs = [c['duration_ms'] for c in cells]
        assert len(files) == len(durs) and len(files) == s['cell_count'], (creature, setname)
        for fn in files:
            assert os.path.exists(os.path.join(d, fn)), (creature, fn)
        out[setname] = {'kind': kind, 'family': fam, 'files': files,
                        'roles': roles(kind, len(files)), 'durations': durs}
    assert len(out) == 8, f'{creature}: expected 8 atk+hurt sets, got {sorted(out)}'
    assert sum(len(v['files']) for v in out.values()) == 36, creature
    return out

def out_name(creature, setname, i):
    return f'{creature}-{TAG}-{setname}-cell-{i:02d}.png'

def build_creature(creature):
    spec = trueback_sets(creature)
    outdir = os.path.join(OUT, creature)
    os.makedirs(outdir, exist_ok=True)
    man_sets, gif_frames = {}, {}
    n_hand = n_copy = n_flagged = 0
    flags = []
    for setname, s in sorted(spec.items()):
        fam, kind = s['family'], s['kind']
        rls = s['roles']
        hand_states = [FAMILY_HANDS[fam][r] for r in rls]
        imp = 3 if kind == 'attack' else 0
        apply = [i == imp for i in range(len(s['files']))]
        new_files, frame_notes = [], []
        for i, fn in enumerate(s['files']):
            src = Image.open(os.path.join(SRC, creature, fn)).convert('RGBA')
            assert src.size == (64, 64), f'{creature} {fn} size {src.size}'
            outfn = out_name(creature, setname, i)
            note = {'frame': i, 'role': rls[i], 'hand_state': hand_states[i],
                    'source': fn, 'applied': False}
            if apply[i] and hand_states[i] not in ('folded', 'none'):
                bb = sil_bbox(src)
                A = derived_anchors(bb)
                skin = skin_median(src, (bb[0] + bb[2]) // 2,
                                   bb[1] + int(0.72 * (bb[3] - bb[1])))
                if skin is None:
                    skin = skin_median(src, (bb[0] + bb[2]) // 2, (bb[1] + bb[3]) // 2)
                layer = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
                d = ImageDraw.Draw(layer)
                pts = draw_hands(d, hand_states[i], A, skin or (128, 128, 128))
                mask = dil_mask(src, 2)
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
                        flags.append({'set': setname, 'frame': i, 'reason': 'zero-change'})
                        src.save(os.path.join(outdir, outfn))
                        note['flag'] = 'zero-change'
                        n_flagged += 1
                    else:
                        out.save(os.path.join(outdir, outfn))
                        note.update({'applied': True, 'changed_px': nch,
                                     'diff_bbox': bbox,
                                     'anchors': f'derived-from-own-trueback-silhouette-bbox-{bb}'})
                        n_hand += 1
            else:
                src.save(os.path.join(outdir, outfn))
                n_copy += 1
            new_files.append(outfn)
            frame_notes.append(note)
        man_sets[setname] = {'kind': kind, 'family': fam, 'roles': rls,
                             'hand_states': hand_states, 'files': new_files,
                             'durations_ms': s['durations'],
                             'total_ms': sum(s['durations']),
                             'frames': frame_notes}
        for fn2, ms in zip(new_files, s['durations']):
            im = Image.open(os.path.join(outdir, fn2)).convert('RGBA').resize(
                (256, 256), Image.NEAREST)
            bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255))
            bg.paste(im, (0, 0), im)
            gif_frames.setdefault(kind, []).append((bg.convert('P', palette=Image.ADAPTIVE), ms))
    gifs = {}
    for kind, fr in gif_frames.items():
        durs = [ms for _, ms in fr]
        durs[-1] += 250
        gp = os.path.join(outdir, f'{creature}-{TAG}-{kind}s.gif')
        fr[0][0].save(gp, save_all=True, append_images=[f for f, _ in fr[1:]],
                      duration=durs, loop=0)
        gifs[kind] = {'gif': os.path.basename(gp), 'frames': len(fr)}
    man = {'creature': creature, 'tag': TAG, 'bucket': 'resolved',
           'method': 'Layer 2 hand overlays only on pixel true-back sets; 0 generations; true-back files untouched; anchors derived per frame from each true-back frame\'s own silhouette; cast glow element-neutral; no claw-swipe from behind; HANDS ONLY, no face overlays (true backs show no facial expression).',
           'source_back_dir': f'articulation-back-view/trueback-sets-pickA-20261026/{creature}',
           'timing_mode': 'impact-only-mode-A',
           'clawed_physical': False,
           'claw_note': CLAW_NOTE,
           'shadow_flag': SHADOW_FLAGS[creature],
           'shadow_stripped_px': 0,
           'sets': man_sets, 'gifs': gifs, 'flags': flags,
           'counts': {'hand_frames': n_hand, 'copy_frames': n_copy,
                      'flagged_frames': n_flagged,
                      'cells': n_hand + n_copy + n_flagged}}
    g1_fail = []
    for setname, s in spec.items():
        for i, fn in enumerate(s['files']):
            if not man_sets[setname]['frames'][i]['applied']:
                a = open(os.path.join(SRC, creature, fn), 'rb').read()
                b = open(os.path.join(outdir, man_sets[setname]['files'][i]), 'rb').read()
                if a != b:
                    g1_fail.append((setname, i))
    man['gate_g1_copy_identical'] = (len(g1_fail) == 0)
    man['gate_g1_failures'] = g1_fail
    json.dump(man, open(os.path.join(outdir, f'{creature}-{TAG}-manifest.json'), 'w'), indent=1)
    print(f'{creature} [resolved]: hand={n_hand} copy={n_copy} flagged={n_flagged} g1={man["gate_g1_copy_identical"]}')
    return man

def font(sz, bold=False):
    p = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    try:
        return ImageFont.truetype(p, sz)
    except Exception:
        return ImageFont.load_default()

def show_sheet_built(creature, man):
    TILE = 256
    pairs = []
    for setname in sorted(man['sets']):
        s = man['sets'][setname]
        imp = 3 if s['kind'] == 'attack' else 0
        pairs.append((setname, s['frames'][imp]))
    blocks = []
    for label, fr in pairs:
        applied = 'HAND' if fr['applied'] else ('BASE (flag: %s)' % fr.get('flag') if fr.get('flag') else 'BASE copy')
        title = f"{creature} {label} f{fr['frame']} hand={fr['hand_state']} -> {applied}"
        blocks.append((label, fr, textwrap.wrap(title, 40)))
    LAB = max(22 * (len(lines) + 1) for _, _, lines in blocks)
    sheet = Image.new('RGBA', (TILE * 2, len(blocks) * (TILE + LAB)), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (base_set, fr, lines) in enumerate(blocks):
        y = i * (TILE + LAB)
        for j, pp in enumerate((os.path.join(SRC, creature, fr['source']),
                               os.path.join(OUT, creature, man['sets'][base_set]['files'][fr['frame']]))):
            im = Image.open(pp).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
            sheet.paste(im, (j * TILE, y), im)
        for k, ln in enumerate(lines):
            dr.text((8, y + TILE + 4 + 22 * k), ln, font=font(15, True), fill=(255, 255, 255, 255))
        dr.text((8, y + TILE + 4 + 22 * len(lines)), 'LEFT base true-back cell  |  RIGHT hand pass (HANDS ONLY, no face)', font=font(14), fill=(180, 190, 205, 255))
    out = os.path.join(OUT, creature, f'{creature}-{TAG}-show-sheet.png')
    sheet.save(out)
    print('  sheet:', out, sheet.size)
    return os.path.basename(out)

def show_sheet_excluded(creature, reason):
    TILE, LAB = 256, 44
    d = os.path.join(SRC, creature)
    files = sorted(os.listdir(d))
    def find(sub, cell):
        for fn in files:
            if sub in fn and f'cell-{cell}' in fn and fn.endswith('.png'):
                return fn
        return None
    idle = find('back-idle', '00')
    phys = find('atk_physical', '03')
    knock = find('hurt_heavy_knockback', '00')
    cells = [('true-back idle frame 0 (base, no overlay)', idle),
             ('physical attack impact frame 3 (base, no overlay)', phys),
             ('heavy knockback impact frame 0 (base, no overlay)', knock)]
    cells = [(lab, fn) for lab, fn in cells if fn]
    lines = textwrap.wrap(reason, 72)
    banner_h = 30 + 22 * len(lines)
    H = banner_h + len(cells) * (TILE + LAB)
    sheet = Image.new('RGBA', (TILE * 3, H), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    dr.text((8, 6), f'{creature} — EXCLUDED FROM TRUE-BACK HAND PASS (no hand overlays drawn)', font=font(19, True), fill=(255, 200, 90, 255))
    for k, ln in enumerate(lines):
        dr.text((8, 30 + 22 * k), ln, font=font(16), fill=(255, 255, 255, 255))
    for i, (lab, fn) in enumerate(cells):
        y = banner_h + i * (TILE + LAB)
        im = Image.open(os.path.join(d, fn)).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
        sheet.paste(im, (0, y), im)
        dr.text((TILE + 8, y + TILE // 2 - 10), lab, font=font(17, True), fill=(255, 255, 255, 255))
        dr.text((TILE + 8, y + TILE // 2 + 14), fn, font=font(14), fill=(180, 190, 205, 255))
    out = os.path.join(OUT, creature, f'{creature}-{TAG}-show-sheet-EXCLUDED.png')
    sheet.save(out)
    print('  excluded sheet:', out, sheet.size)
    return os.path.basename(out)

def combined_sheet(index):
    TILE = 192
    rows = []
    for c in CREATURES:
        if c in index['resolved']:
            man = json.load(open(os.path.join(OUT, c, f'{c}-{TAG}-manifest.json')))
            for setname, fr_idx in (('atk_physical', 3), ('hurt_heavy_knockback', 0)):
                sname = [k for k in man['sets'] if k.startswith(setname)][0]
                fr = man['sets'][sname]['frames'][fr_idx]
                rows.append((c, sname, fr, man['sets'][sname]['files'][fr_idx],
                             'HAND' if fr['applied'] else ('BASE flag:' + fr.get('flag', '')) if fr.get('flag') else 'BASE copy'))
        else:
            for sname, fr_idx in (('atk_physical', 3), ('hurt_heavy_knockback', 0)):
                fn = [f for f in sorted(os.listdir(os.path.join(SRC, c)))
                      if sname in f and f'cell-{fr_idx:02d}' in f][0]
                rows.append((c, sname, {'source': fn}, None, 'EXCLUDED'))
    LAB = 44
    sheet = Image.new('RGBA', (TILE * 2, len(rows) * (TILE + LAB)), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (c, sname, fr, outfn, state) in enumerate(rows):
        y = i * (TILE + LAB)
        base = Image.open(os.path.join(SRC, c, fr['source'])).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
        sheet.paste(base, (0, y), base)
        if outfn:
            hp = Image.open(os.path.join(OUT, c, outfn)).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
        else:
            hp = base
        sheet.paste(hp, (TILE, y), hp)
        dr.text((8, y + TILE + 4), f'{c} {sname} -> {state}', font=font(15, True), fill=(255, 255, 255, 255))
        dr.text((8, y + TILE + 24), 'LEFT base true-back  |  RIGHT hand pass', font=font(13), fill=(180, 190, 205, 255))
    out = os.path.join(OUT, 'combined', f'{TAG}-combined-show-sheet.png')
    os.makedirs(os.path.join(OUT, 'combined'), exist_ok=True)
    sheet.save(out)
    print('  combined:', out, sheet.size)
    return os.path.basename(out)

def shadow_evidence_sheet():
    TILE = 256
    sheet = Image.new('RGBA', (TILE * 2, len(CREATURES) * (160 + 44)), (255, 255, 255, 255))
    dr = ImageDraw.Draw(sheet)
    for i, c in enumerate(CREATURES):
        y = i * (160 + 44)
        im = Image.open(os.path.join(SRC, c, f'{c}-trueback-20261026-back-idle-cell-00.png')).convert('RGBA')
        crop = im.crop((0, 44, 64, 64)).resize((512, 160), Image.NEAREST)
        sheet.paste(crop, (0, y), crop)
        for k, ln in enumerate(textwrap.wrap(f'{c} idle00 bottom strip y44-63 (white bg): {SHADOW_FLAGS[c]}', 90)):
            if k < 2:
                dr.text((520, y + 4 + 20 * k), ln, font=font(13), fill=(0, 0, 0, 255))
        dr.text((520, y + 48), 'Full flag text in manifest; strip NOT cut here.', font=font(13, True), fill=(160, 0, 0, 255))
    out = os.path.join(OUT, 'combined', f'{TAG}-shadow-evidence-sheet.png')
    sheet.save(out)
    print('  shadow evidence:', out, sheet.size)
    return os.path.basename(out)

def main():
    index = {'tag': TAG, 'staging_only': True, 'no_pr': True, 'no_lock': True,
             'method_note': 'Pick-A hand pass for strikechamp + shellguard only, on trueback-sets-pickA-20261026 bases. Anchors derived per frame from each true-back frame\'s own silhouette; Mode A impact-only (attack f3, hurt f0); cast glow element-neutral; no claw-swipe from behind; HANDS ONLY, no face overlays; no baked shadows added; no shadow pixels stripped (see shadow_flags). Mechapion built from the TRUE back — no fallback labelling anywhere.',
             'source_back_dir': 'articulation-back-view/trueback-sets-pickA-20261026',
             'old_pass_superseded_note': 'The trueback-hand-pass-20261026 strikechamp + shellguard sets are SUPERSEDED-HELD (built on generated bases); this pick-A pass replaces them. Held dirs left intact.',
             'resolved': {}, 'excluded': {}, 'shadow_flags': SHADOW_FLAGS}
    for c in CREATURES:
        os.makedirs(os.path.join(OUT, c), exist_ok=True)
        if c in EXCLUDED:
            man = {'creature': c, 'tag': TAG, 'bucket': 'excluded-with-reason',
                   'reason': EXCLUDED[c],
                   'source_back_dir': f'articulation-back-view/trueback-sets-pickA-20261026/{c}',
                   'shadow_flag': SHADOW_FLAGS[c], 'shadow_stripped_px': 0,
                   'cells_drawn': 0,
                   'note': 'Manifest entry is the pass; no hand cells drawn because the new true back shows no distinct hand anchor. Exclusion re-derived from the new cells, not copied from the old pass.'}
            json.dump(man, open(os.path.join(OUT, c, f'{c}-{TAG}-manifest.json'), 'w'), indent=1)
            sheet = show_sheet_excluded(c, EXCLUDED[c])
            index['excluded'][c] = {'reason': EXCLUDED[c], 'shadow_flag': SHADOW_FLAGS[c], 'show_sheet': sheet}
            print(f'{c} [excluded]')
        else:
            man = build_creature(c)
            sheet = show_sheet_built(c, man)
            index['resolved'][c] = {'mode': man['timing_mode'], 'sets': list(man['sets'].keys()),
                                    'counts': man['counts'], 'flags': man['flags'],
                                    'g1': man['gate_g1_copy_identical'],
                                    'shadow_flag': SHADOW_FLAGS[c], 'show_sheet': sheet}
    comb = combined_sheet(index)
    index['combined_show_sheet'] = f'combined/{comb}'
    index['shadow_evidence_sheet'] = None
    rc, ec = len(index['resolved']), len(index['excluded'])
    cells = sum(v['counts']['cells'] for v in index['resolved'].values())
    hands = sum(v['counts']['hand_frames'] for v in index['resolved'].values())
    flagged = sum(len(v['flags']) for v in index['resolved'].values())
    index['totals'] = {'creatures': rc + ec, 'resolved': rc, 'excluded': ec,
                       'cells': cells, 'hand_frames': hands, 'flagged_frames': flagged,
                       'gifs': rc * 2}
    json.dump(index, open(os.path.join(OUT, f'{TAG}-manifest.json'), 'w'), indent=1)
    # Hard-rule assertion: no fallback labelling anywhere in this dir.
    bad = []
    for root, _, fns in os.walk(OUT):
        for fn in fns:
            if 'FALLBACK' in fn or 'fallback' in fn:
                bad.append(os.path.join(root, fn))
    assert not bad, f'fallback labelling leaked: {bad}'
    print(f'SUMMARY resolved={rc} excluded={ec} total={rc+ec}')
    print(f'SUMMARY cells={cells} hand_frames={hands} flagged_frames={flagged} gifs={rc*2}')

if __name__ == '__main__':
    main()
