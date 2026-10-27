#!/usr/bin/env python3
"""Articulation v3 retime (2026-10-26) — PER-SET timing modes (Mars rulings).

Mars 2026-10-26 ~09:13 CDT (Dreadtoise hurts v2): IMPACT-MOMENTARY RULE —
articulation faces show ONLY momentarily at CONNECTION/impact, NOT before
(windup) and NOT after (recover). Placement APPROVED in the same message.
Mars 2026-10-26 ~09:15 CDT (Mochii attacks v2): timing is PER CHARACTER /
PER SET, NOT universal — Mochii attacks keep the LONGER overlay duration
("matches him the face better"): his face MAY STAY ON for the whole phase.
Mars 2026-10-26 ~09:14 CDT (Mochii attacks v2): Mochii HAS NO TEETH — never
draw teeth on his mouth overlays; squiggly mouth + lowered eyes APPROVED
("really good"); eyes black with white inside (no white sclera).

TIMING MODES (named parameter TIMING_MODE, recorded per set in manifest):
- Mode A 'impact': overlay ONLY on the impact/connection frame, as a brief
  flash. IMPACT_FLASH_MS caps overlay visibility in the GIF: if the impact
  frame lasts longer than IMPACT_FLASH_MS, the GIF shows the overlay for
  IMPACT_FLASH_MS then the BASE face for the remainder of the beat — total
  set duration unchanged, overlay visibility <= IMPACT_FLASH_MS (150ms).
- Mode B 'persistent': overlay stays up through the WHOLE phase (windup,
  strike, impact, recover) — Mochii attacks only, as approved.
- Mode 'base': no overlays at all — face-changing sets (Mochii hurts: his
  hurt face already changes on its own) ship base art only.

SHIP BATCH: Dreadtoise hurts = Mode A; Mochii attacks = Mode B (toothless
mouths, squiggly mouth + lowered eyes kept, black-with-white-inside eyes);
Mochii hurts = Mode base. NEW tag retime20261026; never reuses
v2place20261026, artic20261026, or any shown filename. Pilot originals,
v1 articulation, and v2-place files untouched. No PR from this builder
(the push script ships it after verification).
"""
import json, ast, math, os
from PIL import Image, ImageDraw

import sys
TEMPLATE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PILOT = os.path.join(TEMPLATE_DIR, 'inputs')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(TEMPLATE_DIR, 'restored')
TAG = 'retime20261026'
os.makedirs(OUT, exist_ok=True)

# NAMED TIMING PARAMETERS (Mars rulings above; grammar doc section 8 mirrors this).
IMPACT_FLASH_MS = 120          # overlay visibility cap inside an impact beat (<=150ms target)
IMPACT_ROLES = ('impact',)     # the only role that carries an overlay in Mode A

SRC = {'mochii': {'eyes': [(20, 31), (41, 31)], 'mouth': (31, 38)},
       'dreadtoise': {'eyes': [(26, 31), (38, 31)], 'mouth': (32, 38)}}

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

def roles(kind, n):
    if kind == 'attack':
        return ['windup', 'lean', 'strike', 'impact', 'recover'][:n] if n == 5 else \
               ['windup', 'charge', 'strike', 'impact', 'hold', 'recover'][:n]
    return ['impact', 'recoil', 'recover'][:n] if n == 3 else \
           ['impact', 'recoil', 'stagger', 'recover'][:n]

FAMILY = {
    'physical': {'windup': ('grimace', 'narrowed'), 'lean': ('grimace', 'narrowed'),
                 'charge': ('grimace', 'narrowed'), 'strike': ('open-roar', 'widened'),
                 'impact': ('open-bite', 'widened'), 'hold': ('open-bite', 'widened'),
                 'recover': ('grin', 'blink')},
    'special': {'windup': ('closed', 'narrowed'), 'lean': ('closed', 'glance'),
                'charge': ('closed', 'narrowed'), 'strike': ('open-roar', 'widened'),
                'impact': ('grin', 'glance'), 'hold': ('grin', 'glance'),
                'recover': ('closed', 'blink')},
    'signature': {'windup': ('closed', 'narrowed'), 'lean': ('closed', 'narrowed'),
                  'charge': ('closed', 'narrowed'), 'strike': ('open-roar', 'widened'),
                  'impact': ('open-bite', 'widened'), 'hold': ('open-bite', 'widened'),
                  'recover': ('grin', 'blink')},
    'heavy': {'windup': ('grimace', 'narrowed'), 'lean': ('grimace', 'narrowed'),
              'charge': ('grimace', 'narrowed'), 'strike': ('open-bite', 'widened'),
              'impact': ('grimace', 'half'), 'hold': ('grimace', 'half'),
              'recover': ('grin', 'blink')},
    'flinch': {'impact': ('o-shock', 'widened'), 'recoil': ('grimace', 'narrowed'),
               'stagger': ('grimace', 'narrowed'), 'recover': ('closed', 'blink')},
    'knockback': {'impact': ('o-shock', 'widened'), 'recoil': ('open-roar', 'half'),
                  'stagger': ('frown', 'half'), 'recover': ('closed', 'blink')},
    'wobble': {'impact': ('grimace', 'dizzy'), 'recoil': ('o-shock', 'dizzy'),
               'stagger': ('grimace', 'dizzy'), 'recover': ('closed', 'blink')},
    'stagger': {'impact': ('frown', 'half'), 'recoil': ('frown', 'half'),
                'stagger': ('o-shock', 'half'), 'recover': ('closed', 'blink')},
}

def family_of(setname, kind):
    if kind == 'hurt':
        for k in ('flinch', 'knockback', 'wobble', 'stagger'):
            if k in setname:
                return k
        return 'flinch'
    for k in ('physical', 'special', 'signature', 'heavy'):
        if k in setname:
            return k
    return 'special'

def patch_median(im, cx, cy, r=3):
    vals = []
    for y in range(max(0, cy - r), min(64, cy + r + 1)):
        for x in range(max(0, cx - r), min(64, cx + r + 1)):
            p = im.getpixel((x, y))
            if len(p) == 4 and p[3] < 128:
                continue
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            if lum < 35:
                continue
            vals.append(p[:3])
    if not vals:
        return (128, 128, 128, 255)
    vals.sort()
    return vals[len(vals) // 2] + (255,)

def eye_feature_count(im, cx, cy, creature):
    n = 0
    for y in range(max(0, cy - 5), min(64, cy + 6)):
        for x in range(max(0, cx - 5), min(64, cx + 6)):
            p = im.getpixel((x, y))
            if len(p) == 4 and p[3] < 128:
                continue
            if creature == 'mochii':
                if 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] < 100:
                    n += 1
            else:
                if p[0] > 110 and p[1] > 80 and p[2] < 130:
                    n += 1
    return n

def draw_mouth(d, im, mouth, mx, my, creature):
    skin = patch_median(im, mx, my - 10, r=3) if creature == 'dreadtoise' else patch_median(im, mx, my + 12, r=3)
    d.rectangle((mx - 8, my - 5, mx + 8, my + 5), fill=skin)
    dark, inner = (30, 10, 10, 255), (170, 50, 50, 255)
    white = (255, 255, 255, 255)
    # MOCHII HAS NO TEETH (Mars 2026-10-26 ~09:14 CDT): no white teeth drawn
    # on ANY Mochii mouth state, ever. Dreadtoise keeps its teeth (its own art).
    teeth = creature != 'mochii'
    if mouth == 'closed':
        d.line((mx - 5, my, mx + 5, my), fill=dark, width=2)
    elif mouth == 'grin':
        d.arc((mx - 7, my - 4, mx + 7, my + 4), 20, 160, fill=dark, width=2)
        if teeth:
            d.rectangle((mx - 5, my - 1, mx - 3, my + 1), fill=white)
            d.rectangle((mx + 3, my - 1, mx + 5, my + 1), fill=white)
    elif mouth in ('open-roar', 'open-bite'):
        d.ellipse((mx - 6, my - 3, mx + 6, my + 5), fill=dark)
        d.ellipse((mx - 4, my, mx + 4, my + 4), fill=(200, 90, 90, 255) if creature == 'dreadtoise' else inner)
        if teeth:
            d.rectangle((mx - 5, my - 3, mx - 3, my - 1), fill=white)
            d.rectangle((mx + 3, my - 3, mx + 5, my - 1), fill=white)
            if mouth == 'open-bite':
                d.rectangle((mx - 1, my - 3, mx + 1, my - 1), fill=white)
    elif mouth == 'o-shock':
        d.ellipse((mx - 3, my - 3, mx + 3, my + 3), fill=dark)
    elif mouth == 'grimace':
        pts = [(mx - 6, my), (mx - 3, my - 2), (mx, my + 1), (mx + 3, my - 2), (mx + 6, my)]
        d.line(pts, fill=dark, width=2, joint='curve')
    elif mouth == 'frown':
        d.arc((mx - 5, my - 2, mx + 5, my + 5), 200, 340, fill=dark, width=2)

def draw_eyes(d, im, eyes, anchors, creature):
    for (cx, cy) in anchors:
        if eyes == 'normal':
            continue
        lid = patch_median(im, cx, cy - 8, r=2)
        if creature == 'mochii':
            # BLACK disc + WHITE highlight inside. Never white sclera.
            if eyes == 'blink':
                d.rectangle((cx - 4, cy - 4, cx + 4, cy + 4), fill=lid)
                d.arc((cx - 4, cy - 2, cx + 4, cy + 2), 20, 160, fill=(20, 20, 20, 255), width=2)
            elif eyes == 'widened':
                d.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=(12, 12, 12, 255))
                d.ellipse((cx - 2, cy - 3, cx + 2, cy + 1), fill=(255, 255, 255, 255))
            elif eyes == 'narrowed':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(12, 12, 12, 255))
                d.ellipse((cx - 1, cy - 2, cx + 1, cy), fill=(255, 255, 255, 255))
                d.rectangle((cx - 4, cy - 4, cx + 4, cy - 1), fill=lid)
            elif eyes == 'half':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(12, 12, 12, 255))
                d.rectangle((cx - 4, cy - 4, cx + 4, cy + 1), fill=lid)
            elif eyes == 'glance':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(12, 12, 12, 255))
                d.ellipse((cx + 1, cy - 2, cx + 3, cy), fill=(255, 255, 255, 255))
            elif eyes == 'dizzy':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(12, 12, 12, 255))
                d.line((cx - 3, cy - 3, cx + 3, cy + 3), fill=(255, 255, 255, 255), width=2)
                d.line((cx - 3, cy + 3, cx + 3, cy - 3), fill=(255, 255, 255, 255), width=2)
        else:
            # DREADTOISE: AMBER iris + DARK pupil. Never white sclera.
            if eyes == 'blink':
                d.rectangle((cx - 4, cy - 4, cx + 4, cy + 4), fill=lid)
                d.line((cx - 4, cy, cx + 4, cy), fill=(20, 20, 20, 255), width=2)
            elif eyes == 'widened':
                d.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=(220, 170, 40, 255))
                d.ellipse((cx - 2, cy - 2, cx + 2, cy + 2), fill=(15, 15, 15, 255))
            elif eyes == 'narrowed':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(220, 170, 40, 255))
                d.ellipse((cx - 1, cy - 1, cx + 1, cy + 1), fill=(15, 15, 15, 255))
                d.rectangle((cx - 4, cy - 4, cx + 4, cy - 1), fill=lid)
            elif eyes == 'half':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(220, 170, 40, 255))
                d.rectangle((cx - 4, cy - 4, cx + 4, cy + 1), fill=lid)
            elif eyes == 'glance':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(220, 170, 40, 255))
                d.ellipse((cx + 1, cy - 1, cx + 3, cy + 1), fill=(15, 15, 15, 255))
            elif eyes == 'dizzy':
                d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(220, 170, 40, 255))
                d.line((cx - 3, cy - 3, cx + 3, cy + 3), fill=(15, 15, 15, 255), width=2)
                d.line((cx - 3, cy + 3, cx + 3, cy - 3), fill=(15, 15, 15, 255), width=2)

def build(creature, sets_wanted, mode, gif_name):
    """mode: 'impact' (Mode A), 'persistent' (Mode B), 'base' (face-changing)."""
    man = json.load(open(os.path.join(PILOT, f'{creature}.pilot-manifest.json')))
    outdir = os.path.join(OUT, creature)
    os.makedirs(outdir, exist_ok=True)
    report = {}
    gif_items = []  # (image path, duration_ms, has_overlay)
    cell_files = []
    for setname in sets_wanted:
        s = man['sets'][setname]
        fam = family_of(setname, s['kind'])
        rls = roles(s['kind'], len(s['cells']))
        src_faces = ['hurt' if 'hurt_cell' in c.get('source', '') else 'front' for c in s['cells']]
        changing = any(src_faces[i] != src_faces[i + 1] for i in range(len(src_faces) - 1))
        files, states = [], []
        overlay_ms = 0
        for i, cell in enumerate(s['cells']):
            base = Image.open(os.path.join(PILOT, 'cells', cell['file'])).convert('RGBA')
            t = trf(cell)
            flash = t.get('flash', 0) > 0
            eye_a = [propagate(e, t) for e in SRC[creature]['eyes']]
            mouth_a = propagate(SRC[creature]['mouth'], t)
            counts = [eye_feature_count(base, int(round(x)), int(round(y)), creature) for x, y in eye_a]
            thr = 18 if creature == 'mochii' else 5
            verified = (not flash) and all(n >= thr for n in counts)
            mouth, eyes = FAMILY[fam][rls[i]]
            # TIMING MODE GATE: Mode A overlays ONLY on impact-role frames.
            want_overlay = (mode == 'persistent') or (mode == 'impact' and rls[i] in IMPACT_ROLES)
            if mode == 'base' or changing:
                want_overlay = False
            action = 'base'
            img = base
            if want_overlay:
                if not verified:
                    action = 'base-skipped-unverified' + ('-flash' if flash else '')
                else:
                    img = base.copy()
                    d = ImageDraw.Draw(img)
                    draw_mouth(d, img, mouth, int(round(mouth_a[0])), int(round(mouth_a[1])), creature)
                    draw_eyes(d, img, eyes, [(int(round(x)), int(round(y))) for x, y in eye_a], creature)
                    action = f'overlay-{mouth}-{eyes}'
            elif changing:
                action = 'base-no-overlay-set-changing'
            fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
            img.save(os.path.join(outdir, fn))
            files.append(fn); cell_files.append(fn)
            dur = cell['duration_ms']
            if action.startswith('overlay'):
                if mode == 'impact' and dur > IMPACT_FLASH_MS:
                    # Momentary flash: overlay for IMPACT_FLASH_MS, then base face
                    # for the remainder of the same beat. Total duration unchanged.
                    gif_items.append((os.path.join(outdir, fn), IMPACT_FLASH_MS, True))
                    gif_items.append((os.path.join(PILOT, 'cells', cell['file']), dur - IMPACT_FLASH_MS, False))
                    overlay_ms += IMPACT_FLASH_MS
                else:
                    gif_items.append((os.path.join(outdir, fn), dur, True))
                    overlay_ms += dur
            else:
                gif_items.append((os.path.join(outdir, fn), dur, False))
            states.append({'frame': i, 'role': rls[i], 'source_face': src_faces[i],
                           'pred_eyes': [(round(x, 1), round(y, 1)) for x, y in eye_a],
                           'pred_mouth': (round(mouth_a[0], 1), round(mouth_a[1], 1)),
                           'eye_feature_counts': counts, 'verified': verified,
                           'action': action, 'duration_ms': dur})
        if gif_items:
            gif_items[-1] = (gif_items[-1][0], gif_items[-1][1] + 250, gif_items[-1][2])
        report[setname] = {'kind': s['kind'], 'family': fam, 'timing_mode': mode,
                           'source_faces': src_faces, 'face_changing': changing,
                           'files': files, 'frames': states,
                           'overlay_visibility_ms': overlay_ms,
                           'total_ms': sum(c['duration_ms'] for c in s['cells'])}
    # GIF
    fr, du = [], []
    for (path, ms, _ov) in gif_items:
        im = Image.open(path).convert('RGBA').resize((256, 256), Image.NEAREST)
        bg = Image.new('RGBA', (256, 256), (24, 28, 40, 255)); bg.paste(im, (0, 0), im)
        fr.append(bg.convert('P', palette=Image.ADAPTIVE)); du.append(ms)
    fr[0].save(os.path.join(OUT, gif_name), save_all=True, append_images=fr[1:], duration=du, loop=0)
    # 128px/cell preview montage (shipped cells only, one tile per cell)
    tiles = [Image.open(os.path.join(outdir, fn)).convert('RGBA').resize((128, 128), Image.NEAREST) for fn in cell_files]
    cols = 6; rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * 128, rows * 128), (24, 28, 40, 255))
    for i, t in enumerate(tiles):
        sheet.paste(t, ((i % cols) * 128, (i // cols) * 128), t)
    sheet.save(os.path.join(OUT, gif_name.replace('.gif', '-preview.png')))
    print(creature, gif_name, 'gif_items', len(gif_items), 'sets', list(report.keys()))
    for k, v in report.items():
        print('  ', k, 'mode=', v['timing_mode'], 'changing=', v['face_changing'],
              'overlay_ms=', v['overlay_visibility_ms'], 'actions=', [f['action'] for f in v['frames']])
    return report, gif_items

dread_hurts = ['hurt_light_flinch', 'hurt_heavy_knockback', 'hurt_status_wobble', 'hurt_near_faint_stagger']
r1, g1 = build('dreadtoise', dread_hurts, 'impact', f'dreadtoise-hurts-{TAG}.gif')
json.dump({'tag': TAG, 'timing_modes': {
               'impact': 'Mode A: overlay ONLY on impact/connection frame, flash capped at IMPACT_FLASH_MS=120ms in GIF (base face resumes for remainder of beat); total set duration unchanged (Mars 2026-10-26 ~09:13 CDT, Dreadtoise hurts).'},
           'dreadtoise_hurts': r1},
          open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
print('manifest written')
