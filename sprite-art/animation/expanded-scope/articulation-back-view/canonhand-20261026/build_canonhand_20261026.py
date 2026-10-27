#!/usr/bin/env python3
"""Back-view hand pass for 7 CANON-APPROVED anchor creatures (2026-10-26) — STAGED ONLY, NO PR, NO LOCK.

Mars confirmation 2026-10-26 ~18:44 CDT (re-dispatched; first worker died in a
daemon restart with no checkpoint):
  (1) WINGS/TALONS AS HANDS: aerobeak, stormtalon, zephling.
  (2) TENTACLE TIPS AS HANDS: astroleviathan, inklet, krakenox, toxitacle.
  (3) NO HANDS (NOT built here): kittember, pebblefist, terrapod. Terrapod
      nuance from Mars: it HAS feet, but no hands — its rocks float apart,
      not hands — so terrapod stays H-none for hands despite having feet.

Method carried over verbatim from articulation-back-view/back-hand-pass-20261026
and trueback-hand-pass-20261026/build_trueback_hand_pass.py, with ONE
adaptation: the anchor POINT. The earlier passes derived anchors from
silhouette-bbox fractions (arm positions on a humanoid back). Here the canon
anchor is a TIP, so anchors are measured per frame from that frame's own
silhouette extremes:
  - Wings: lateral extremes (spread-wing tips genuinely are the lateral
    extremes — verified on inspection sheets for all 3 birds). Two-point
    states use left + right extremes; flail uses top-band extremes (wings
    raised); droop uses bottom-band extremes (tail/talons low); punch/cast
    single point uses the right (attacking-side) extreme.
  - Tentacles: lateral extremes within the middle band (35%-85% of bbox
    height), so top props (astroleviathan horn, inklet jar lid, toxitacle
    top bumps) and bottom props never become the anchor. Flail uses
    top-band extremes; droop uses bottom-band extremes (bottom tentacle
    tips, e.g. toxitacle's purple bottom tips).
  - Each tip anchor is shifted inward toward bbox centre so the fist
    circle stays mostly visible instead of half-clipped at the silhouette
    edge (two-point states: 5px; single-point punch/cast: 8px, covering
    the fist radius 5 / glow radius 6); if the shifted point leaves the
    dilated silhouette, the unshifted extreme is used; if that also fails,
    the frame is base copy + flag. Never guessed.
Everything else verbatim: Mode A impact-only (attack frame 3, hurt frame 0),
cast glow element-neutral, no claw-swipe from behind (no plain claw arc
visible in any physical impact cell at 64px), skin = median opaque RGB in a
7px box around (cx, y0+0.72h) with centre fallback, gates G1 (copy frames
byte-identical) + anchor-inside-silhouette-dilated-2px + changed > 0 px.

Hard rules (Mars, 2026-10-26):
  (1) HANDS ONLY. No face overlays on any frame: no eyes, no mouths.
  (2) NO BAKED SHADOWS added by this pass (0 shadow pixels); base cells
      carrying a baked ground band are REPORTED, not stripped here.
  (3) Staged only: every file written here is new and dated under
      articulation-back-view/canonhand-20261026/. Nothing else overwritten.
      NO PR, NO lock.

Pixel work on existing art, local CPU. Kaggle GPU genuinely cannot help
these steps; no Kaggle job was opened.
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = '/home/hatch/workspace/mochiichao-work/sprite-art/animation/expanded-scope'
BACK = os.path.join(BASE, 'articulation-back-view')
OUT = os.path.join(BACK, 'canonhand-20261026')
TAG = 'canonhand20261026'

WINGS = ['aerobeak', 'stormtalon', 'zephling']
TENTACLES = ['astroleviathan', 'inklet', 'krakenox', 'toxitacle']
CREATURES = WINGS + TENTACLES

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

def hurt_family(setname):
    for fam in ('flinch', 'knockback', 'wobble', 'stagger'):
        if fam in setname:
            return fam
    raise ValueError(f'unknown hurt family: {setname}')

def atk_family(setname):
    for fam in ('physical', 'special', 'signature', 'heavy'):
        if f'_{fam}_' in setname or setname.endswith(f'_{fam}'):
            return fam
    raise ValueError(f'unknown attack family: {setname}')

def load_sets(creature, d):
    if creature == 'stormtalon':
        m = json.load(open(os.path.join(d, 'manifest-trueback-20261026.json')))
        out = {}
        for sn, s in m['sets'].items():
            if sn == 'back_idle':
                continue
            out[sn] = {'kind': s['kind'],
                       'family': hurt_family(sn) if s['kind'] == 'hurt' else s['family'],
                       'files': [x['file'] for x in s['cells']],
                       'durs': [x['duration_ms'] for x in s['cells']]}
        return out
    m = json.load(open(os.path.join(d, 'manifest-back-20261026.json')))
    out = {}
    for sn, s in m['sets'].items():
        if sn == 'back_idle':
            continue
        if 'cells' in s:
            files = [x['file'] for x in s['cells']]
            durs = [x['duration_ms'] for x in s['cells']]
        elif 'durations_ms' in s:
            files = s['files']; durs = s['durations_ms']
        else:
            files = [x['file'] for x in s['frames']]
            durs = [x['duration_ms'] for x in s['frames']]
        fam = s.get('family')
        if not fam or s['kind'] == 'hurt':
            fam = hurt_family(sn) if s['kind'] == 'hurt' else atk_family(sn)
        out[sn] = {'kind': s['kind'], 'family': fam, 'files': files, 'durs': durs}
    return out

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

def band_extremes(im, bb, lo, hi):
    """Leftmost/rightmost opaque pixels whose y lies in [y0+lo*h, y0+hi*h]."""
    x0, y0, x1, y1 = bb
    h = y1 - y0
    ya, yb = y0 + lo * h, y0 + hi * h
    a = im.getchannel('A')
    L = R = None
    for y in range(max(0, int(ya)), min(63, int(yb)) + 1):
        for x in range(max(0, x0), min(63, x1) + 1):
            if a.getpixel((x, y)) > 0:
                if L is None or x < L[0]:
                    L = (x, y)
                if R is None or x > R[0]:
                    R = (x, y)
    return L, R

def tip_anchors(im, bb, anchor_kind):
    """Anchor dict in the same shape as the earlier derived_anchors, but
    measured from silhouette extremes (tips), not bbox fractions."""
    x0, y0, x1, y1 = bb
    cx = (x0 + x1) // 2
    if anchor_kind == 'wing':
        gl, gr = band_extremes(im, bb, 0.0, 1.0)
        fl, fr = band_extremes(im, bb, 0.0, 0.40)
        dl, dr = band_extremes(im, bb, 0.70, 1.0)
    else:
        gl, gr = band_extremes(im, bb, 0.35, 0.85)
        fl, fr = band_extremes(im, bb, 0.0, 0.40)
        dl, dr = band_extremes(im, bb, 0.70, 1.0)
    def inward(p, toward, n):
        if p is None:
            return None
        x, y = p
        if toward == 'right':
            return (min(x + n, x1), y)
        if toward == 'left':
            return (max(x - n, x0), y)
        return p
    # Two-point states use the pair; single-point states use the right tip.
    guard = [inward(gl, 'right', 5), inward(gr, 'left', 5)]
    flail = [inward(fl, 'right', 5), inward(fr, 'left', 5)]
    droop = [inward(dl, 'right', 5), inward(dr, 'left', 5)]
    punch = inward(gr, 'left', 8)
    cast = inward(gr, 'left', 8)
    return {'guard': guard, 'brace': guard, 'grab': guard, 'flail': flail,
            'droop': droop, 'punch': punch, 'cast': cast,
            '_raw': {'guard': (gl, gr), 'flail': (fl, fr), 'droop': (dl, dr)}}

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

def shadow_note(creature, d, spec):
    """Measure idle00 bottom strip for a baked ground band (reported only)."""
    for fn in os.listdir(d):
        if fn.endswith('idle-cell-00.png'):
            im = Image.open(os.path.join(d, fn)).convert('RGBA')
            a = im.getchannel('A')
            px = im.load()
            grey = 0
            for y in range(56, 64):
                for x in range(64):
                    if a.getpixel((x, y)) > 0:
                        r, g, b, _ = px[x, y]
                        if max(r, g, b) - min(r, g, b) <= 25:
                            grey += 1
            return (f'idle00 bottom rows 56-63: {grey} desaturated-grey opaque px; '
                    'no ground ellipse stripped here (hand pass adds 0 shadow px).')
    return 'no back-idle-cell-00 found; shadow check skipped for idle.'

def build_creature(creature, srcdir, anchor_kind):
    spec = load_sets(creature, srcdir)
    assert len(spec) == 8, f'{creature}: expected 8 sets, got {sorted(spec)}'
    assert sum(len(v['files']) for v in spec.values()) == 36, creature
    outdir = os.path.join(OUT, creature)
    os.makedirs(outdir, exist_ok=True)
    man_sets, gif_frames = {}, {}
    n_hand = n_copy = n_flagged = 0
    flags = []
    for setname, s in sorted(spec.items()):
        fam, kind = s['family'], s['kind']
        rls = roles(kind, len(s['files']))
        hand_states = [FAMILY_HANDS[fam][r] for r in rls]
        imp = 3 if kind == 'attack' else 0
        new_files, frame_notes = [], []
        for i, fn in enumerate(s['files']):
            src = Image.open(os.path.join(srcdir, fn)).convert('RGBA')
            assert src.size == (64, 64), f'{creature} {fn} size {src.size}'
            outfn = f'{creature}-{TAG}-{setname}-cell-{i:02d}.png'
            note = {'frame': i, 'role': rls[i], 'hand_state': hand_states[i],
                    'source': fn, 'applied': False}
            if i == imp and hand_states[i] not in ('folded', 'none'):
                bb = sil_bbox(src)
                A = tip_anchors(src, bb, anchor_kind)
                skin = skin_median(src, (bb[0] + bb[2]) // 2,
                                   bb[1] + int(0.72 * (bb[3] - bb[1])))
                if skin is None:
                    skin = skin_median(src, (bb[0] + bb[2]) // 2, (bb[1] + bb[3]) // 2)
                layer = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
                d = ImageDraw.Draw(layer)
                pts = draw_hands(d, hand_states[i], A, skin or (128, 128, 128))
                mask = dil_mask(src, 2)
                mpx = mask.load()
                ok = all(p is not None and 0 <= p[0] < 64 and 0 <= p[1] < 64
                         and mpx[p[0], p[1]] > 0 for p in pts)
                if not ok or skin is None or not pts:
                    # Fallback: retry with raw (unshifted) extremes.
                    raw = A['_raw']
                    key = {'guard': 'guard', 'brace': 'guard', 'grab': 'guard',
                           'flail': 'flail', 'droop': 'droop'}.get(hand_states[i])
                    if hand_states[i] in ('punch', 'cast'):
                        raw_pts = raw['guard'][1]
                    elif key and raw[key][0] and raw[key][1]:
                        raw_pts = list(raw[key])
                    else:
                        raw_pts = None
                    if raw_pts is not None:
                        layer = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
                        d = ImageDraw.Draw(layer)
                        A2 = dict(A)
                        A2[hand_states[i]] = raw_pts
                        pts = draw_hands(d, hand_states[i], A2, skin or (128, 128, 128))
                        ok = all(p is not None and 0 <= p[0] < 64 and 0 <= p[1] < 64
                                 and mpx[p[0], p[1]] > 0 for p in pts)
                    if not ok or skin is None or not pts:
                        flags.append({'set': setname, 'frame': i,
                                      'reason': 'anchor-outside-silhouette'})
                        src.save(os.path.join(outdir, outfn))
                        note['flag'] = 'anchor-outside-silhouette'
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
                                         'anchors': f'tip-anchors-from-own-silhouette-{anchor_kind}-bbox-{bb}'})
                            n_hand += 1
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
                                     'anchors': f'tip-anchors-from-own-silhouette-{anchor_kind}-bbox-{bb}'})
                        n_hand += 1
            else:
                src.save(os.path.join(outdir, outfn))
                n_copy += 1
            new_files.append(outfn)
            frame_notes.append(note)
        man_sets[setname] = {'kind': kind, 'family': fam, 'roles': rls,
                             'hand_states': hand_states, 'files': new_files,
                             'durations_ms': s['durs'],
                             'total_ms': sum(s['durs']),
                             'frames': frame_notes}
        for fn2, ms in zip(new_files, s['durs']):
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
    g1_fail = []
    for setname, s in spec.items():
        for i, fn in enumerate(s['files']):
            if not man_sets[setname]['frames'][i]['applied']:
                a = open(os.path.join(srcdir, fn), 'rb').read()
                b = open(os.path.join(outdir, man_sets[setname]['files'][i]), 'rb').read()
                if a != b:
                    g1_fail.append((setname, i))
    man = {'creature': creature, 'tag': TAG, 'bucket': 'resolved',
           'anchor_canon': ('wings/talons as hands' if anchor_kind == 'wing'
                            else 'tentacle tips as hands'),
           'anchor_method': 'tip anchors measured per frame from that frame\'s own silhouette extremes (wings: lateral extremes; tentacles: middle-band lateral extremes), shifted inward (5px pair / 8px single) so fists render whole; raw-extreme fallback, else base copy + flag. Never guessed.',
           'method': 'Layer 2 hand overlays only on staged back sets; 0 generations; back-set files untouched; Mode A impact-only (attack f3, hurt f0); cast glow element-neutral; no claw-swipe from behind; HANDS ONLY, no face overlays.',
           'source_back_dir': os.path.relpath(srcdir, BACK),
           'timing_mode': 'impact-only-mode-A',
           'clawed_physical': False,
           'shadow_note': shadow_note(creature, srcdir, spec),
           'shadow_stripped_px': 0,
           'sets': man_sets, 'gifs': gifs, 'flags': flags,
           'counts': {'hand_frames': n_hand, 'copy_frames': n_copy,
                      'flagged_frames': n_flagged,
                      'cells': n_hand + n_copy + n_flagged},
           'gate_g1_copy_identical': len(g1_fail) == 0,
           'gate_g1_failures': g1_fail}
    json.dump(man, open(os.path.join(outdir, f'{creature}-{TAG}-manifest.json'), 'w'), indent=1)
    print(f'{creature} [{anchor_kind}]: hand={n_hand} copy={n_copy} flagged={n_flagged} g1={man["gate_g1_copy_identical"]}')
    return man

def font(sz, bold=False):
    p = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    try:
        return ImageFont.truetype(p, sz)
    except Exception:
        return ImageFont.load_default()

def show_sheet_built(creature, srcdir, man):
    TILE = 256
    blocks = []
    for setname in sorted(man['sets']):
        s = man['sets'][setname]
        imp = 3 if s['kind'] == 'attack' else 0
        fr = s['frames'][imp]
        applied = 'HAND' if fr['applied'] else ('BASE (flag: %s)' % fr.get('flag') if fr.get('flag') else 'BASE copy')
        title = f"{creature} {setname} f{fr['frame']} hand={fr['hand_state']} -> {applied}"
        blocks.append((setname, fr, textwrap.wrap(title, 40)))
    LAB = 66
    sheet = Image.new('RGBA', (TILE * 2, len(blocks) * (TILE + LAB)), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (setname, fr, lines) in enumerate(blocks):
        y = i * (TILE + LAB)
        for j, pp in enumerate((os.path.join(srcdir, fr['source']),
                               os.path.join(OUT, creature, man['sets'][setname]['files'][fr['frame']]))):
            im = Image.open(pp).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
            sheet.paste(im, (j * TILE, y), im)
        for k, ln in enumerate(lines):
            dr.text((8, y + TILE + 4 + 22 * k), ln, font=font(15, True), fill=(255, 255, 255, 255))
        dr.text((8, y + TILE + 4 + 22 * len(lines)), 'LEFT base back cell  |  RIGHT hand pass (HANDS ONLY, no face)', font=font(14), fill=(180, 190, 205, 255))
    out = os.path.join(OUT, creature, f'{creature}-{TAG}-show-sheet.png')
    sheet.save(out)
    print('  sheet:', out, sheet.size)
    return os.path.basename(out)

def combined_sheet(index):
    TILE = 192
    rows = []
    for c in CREATURES:
        man = index['resolved'][c]['manifest']
        for prefix, fr_idx in (('atk_physical', 3), ('hurt_heavy_knockback', 0)):
            sname = [k for k in man['sets'] if k.startswith(prefix)][0]
            fr = man['sets'][sname]['frames'][fr_idx]
            state = 'HAND' if fr['applied'] else ('BASE flag:' + fr.get('flag', '')) if fr.get('flag') else 'BASE copy'
            rows.append((c, sname, fr, man['sets'][sname]['files'][fr_idx], state))
    LAB = 44
    sheet = Image.new('RGBA', (TILE * 2, len(rows) * (TILE + LAB)), (24, 28, 40, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (c, sname, fr, outfn, state) in enumerate(rows):
        y = i * (TILE + LAB)
        srcdir = os.path.join(BACK, index['resolved'][c]['srcdir'])
        base = Image.open(os.path.join(srcdir, fr['source'])).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
        sheet.paste(base, (0, y), base)
        hp = Image.open(os.path.join(OUT, c, outfn)).convert('RGBA').resize((TILE, TILE), Image.NEAREST)
        sheet.paste(hp, (TILE, y), hp)
        dr.text((8, y + TILE + 4), f'{c} {sname.split("_", 2)[-1]} -> {state}', font=font(15, True), fill=(255, 255, 255, 255))
        dr.text((8, y + TILE + 24), 'LEFT base back  |  RIGHT hand pass', font=font(13), fill=(180, 190, 205, 255))
    out = os.path.join(OUT, 'combined', f'{TAG}-combined-show-sheet.png')
    os.makedirs(os.path.join(OUT, 'combined'), exist_ok=True)
    sheet.save(out)
    print('  combined:', out, sheet.size)
    return os.path.basename(out)

def main():
    index = {'tag': TAG, 'staging_only': True, 'no_pr': True, 'no_lock': True,
             'method_note': 'Canon-anchor hand pass for the 7 Mars-confirmed anchor creatures only (2026-10-26 ~18:44 CDT). Wings/talons as hands (aerobeak, stormtalon, zephling); tentacle tips as hands (astroleviathan, inklet, krakenox, toxitacle). Kittember/pebblefist/terrapod NOT built (confirmed no-hands; terrapod has feet but no hands). Anchors = silhouette-extreme tips per frame; Mode A impact-only; cast glow element-neutral; no claw-swipe; HANDS ONLY, no face overlays; 0 shadow pixels added.',
             'not_built': {'kittember': 'confirmed no-hands', 'pebblefist': 'confirmed no-hands',
                           'terrapod': 'confirmed no-hands (has feet; rocks float apart, not hands)'},
             'resolved': {}}
    for c in CREATURES:
        kind = 'wing' if c in WINGS else 'tentacle'
        srcdir = os.path.join(BACK, 'trueback-sets-20261026', 'stormtalon') if c == 'stormtalon' else os.path.join(BACK, c)
        os.makedirs(os.path.join(OUT, c), exist_ok=True)
        man = build_creature(c, srcdir, kind)
        sheet = show_sheet_built(c, srcdir, man)
        index['resolved'][c] = {'anchor_canon': man['anchor_canon'],
                                'sets': list(man['sets'].keys()),
                                'counts': man['counts'], 'flags': man['flags'],
                                'g1': man['gate_g1_copy_identical'],
                                'shadow_note': man['shadow_note'],
                                'show_sheet': sheet, 'srcdir': os.path.relpath(srcdir, BACK),
                                'manifest': man}
    comb = combined_sheet(index)
    index['combined_show_sheet'] = f'combined/{comb}'
    for c in list(index['resolved']):
        index['resolved'][c].pop('manifest')
    cells = sum(v['counts']['cells'] for v in index['resolved'].values())
    hands = sum(v['counts']['hand_frames'] for v in index['resolved'].values())
    flagged = sum(len(v['flags']) for v in index['resolved'].values())
    index['totals'] = {'creatures': len(CREATURES), 'resolved': len(CREATURES),
                       'cells': cells, 'hand_frames': hands, 'flagged_frames': flagged,
                       'gifs': len(CREATURES) * 2}
    json.dump(index, open(os.path.join(OUT, f'{TAG}-manifest.json'), 'w'), indent=1)
    print(f'SUMMARY resolved={len(CREATURES)} cells={cells} hand_frames={hands} flagged={flagged} gifs={len(CREATURES)*2}')

if __name__ == '__main__':
    main()
