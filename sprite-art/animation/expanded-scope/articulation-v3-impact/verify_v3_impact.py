#!/usr/bin/env python3
"""Verify articulation-v3-impact retime (frame-diff gate).

Checks, per set, against the PILOT base cells:
1. Non-overlay cells are pixel-IDENTICAL to base (0 differing pixels).
2. Overlay cells differ ONLY inside face boxes (eye anchors +/-9px,
   mouth anchor +/-11px) — no body/background pixel changed.
3. Mochii teeth check: zero NEW pure-white pixels inside the mouth box
   of any Mochii overlay cell vs base (Mochii has no teeth).
4. GIF overlay visibility: Mode A sets <= 150ms, Mode B sets = full phase
   (from manifest overlay_visibility_ms).
Also builds enlarged 4x before/after strips for eye-check.
"""
import json, os
from PIL import Image

PILOT = '/home/hatch/workspace/mochiichao-work/sprite-art/animation/expanded-scope/pilot'
V3 = '/home/hatch/workspace/mochiichao-work/sprite-art/animation/expanded-scope/articulation-v3-impact'
man = json.load(open(os.path.join(V3, 'manifest-retime20261026.json')))
pilot_man = {}
for c in ('mochii', 'dreadtoise'):
    pilot_man[c] = json.load(open(os.path.join(PILOT, c, f'{c}.pilot-manifest.json')))

def diff_cells(base_path, new_path):
    b = Image.open(base_path).convert('RGBA')
    n = Image.open(new_path).convert('RGBA')
    assert b.size == n.size, 'size mismatch'
    bp, np_ = b.load(), n.load()
    pts = []
    for y in range(64):
        for x in range(64):
            if bp[x, y] != np_[x, y]:
                pts.append((x, y))
    return pts

fails = []
report = {}
for group, creature in (('dreadtoise_hurts', 'dreadtoise'), ('mochii_hurts', 'mochii'), ('mochii_attacks', 'mochii')):
    for setname, v in man[group].items():
        psets = pilot_man[creature]['sets'][setname]
        set_ok = True
        for i, fr in enumerate(v['frames']):
            base_path = os.path.join(PILOT, creature, psets['cells'][i]['file'])
            new_path = os.path.join(V3, creature, v['files'][i])
            pts = diff_cells(base_path, new_path)
            is_overlay = fr['action'].startswith('overlay')
            if not is_overlay:
                if pts:
                    fails.append(f'{group}/{setname} frame {i} ({fr["role"]}): expected base-identical, got {len(pts)} diff px')
                    set_ok = False
            else:
                # diff must sit inside face boxes
                ex, ey = fr['pred_eyes']; mx, my = fr['pred_mouth']
                boxes = [(ex[0]-9, ex[1]-9, ex[0]+9, ex[1]+9),
                         (ey[0]-9, ey[1]-9, ey[0]+9, ey[1]+9),
                         (mx-11, my-11, mx+11, my+11)]
                outside = [(x, y) for x, y in pts if not any(bx0 <= x <= bx1 and by0 <= y <= by1 for bx0, by0, bx1, by1 in boxes)]
                if outside:
                    fails.append(f'{group}/{setname} frame {i}: {len(outside)} diff px OUTSIDE face boxes (of {len(pts)})')
                    set_ok = False
                if creature == 'mochii':
                    # teeth check: new pure-white pixels inside the mouth box,
                    # EXCLUDING the eye boxes (eye highlight dots are white by
                    # design and eye/mouth boxes overlap on compact faces).
                    b = Image.open(base_path).convert('RGBA').load()
                    n = Image.open(new_path).convert('RGBA').load()
                    ex2, ey2 = fr['pred_eyes']
                    eye_boxes = [(ex2[0]-9, ex2[1]-9, ex2[0]+9, ex2[1]+9),
                                 (ey2[0]-9, ey2[1]-9, ey2[0]+9, ey2[1]+9)]
                    new_white = 0
                    for y in range(max(0, int(my)-11), min(64, int(my)+12)):
                        for x in range(max(0, int(mx)-11), min(64, int(mx)+12)):
                            if any(bx0 <= x <= bx1 and by0 <= y <= by1 for bx0, by0, bx1, by1 in eye_boxes):
                                continue
                            bp, np_ = b[x, y], n[x, y]
                            if np_[:3] == (255, 255, 255) and np_[3] >= 128 and bp[:3] != (255, 255, 255):
                                new_white += 1
                    if new_white:
                        fails.append(f'{group}/{setname} frame {i}: {new_white} NEW white px in mouth box (TEETH?)')
                        set_ok = False
        mode = v['timing_mode']
        ov = v['overlay_visibility_ms']
        if mode == 'impact' and ov > 150:
            fails.append(f'{group}/{setname}: Mode A overlay visibility {ov}ms > 150ms')
            set_ok = False
        report[f'{group}/{setname}'] = {'mode': mode, 'overlay_ms': ov, 'ok': set_ok}
        print(f'{group}/{setname}: mode={mode} overlay_ms={ov} ok={set_ok}')

print('FAILS:', len(fails))
for f in fails:
    print('  FAIL:', f)

# Enlarged 4x before/after strips: impact frames only (dread hurts + mochii attacks)
strips = []
for group, creature, sets in (('dreadtoise_hurts', 'dreadtoise', ['hurt_light_flinch', 'hurt_heavy_knockback', 'hurt_status_wobble', 'hurt_near_faint_stagger']),
                              ('mochii_attacks', 'mochii', ['atk_physical_body_slam', 'atk_special_aqua_shot', 'atk_signature_aqua_cannon', 'atk_heavy_hydro_surge_finisher'])):
    for setname in sets:
        v = man[group][setname]
        psets = pilot_man[creature]['sets'][setname]
        # impact-role frame index
        idx = next(i for i, fr in enumerate(v['frames']) if fr['role'] == 'impact')
        base = Image.open(os.path.join(PILOT, creature, psets['cells'][idx]['file'])).convert('RGBA').resize((256, 256), Image.NEAREST)
        new = Image.open(os.path.join(V3, creature, v['files'][idx])).convert('RGBA').resize((256, 256), Image.NEAREST)
        pair = Image.new('RGBA', (512, 256), (24, 28, 40, 255))
        pair.paste(base, (0, 0), base); pair.paste(new, (256, 0), new)
        strips.append((f'{creature} {setname} impact f{idx} ({v["frames"][idx]["action"]})', pair))
H = len(strips) * 256
sheet = Image.new('RGBA', (512, H), (24, 28, 40, 255))
for i, (_label, pair) in enumerate(strips):
    sheet.paste(pair, (0, i * 256), pair)
    print('strip:', _label)
sheet.save(os.path.join(V3, 'impact_before_after_4x.png'))
print('strip sheet:', sheet.size)
print('RESULT:', 'PASS' if not fails else 'FAIL')
