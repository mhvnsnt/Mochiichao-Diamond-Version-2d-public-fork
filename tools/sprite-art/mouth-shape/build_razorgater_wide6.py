#!/usr/bin/env python3
"""RAZORGATER TRIANGLE-JAW REBUILD — TAKE 6 (Mars-ordered 2026-10-26 ~15:22 CDT).

Mars on take-4 vs take-5: almost the same; real fault is SHAPE —
take-5 gives a circular mouth, Razorgater's mouth is kind of an
upside-down triangle. Teeth look good; only shape is wrong. Fallback:
if the triangle cannot be done right, KEEP take-5. Take-5 untouched.

Changes vs take-5, nothing else:
- MASK: feathered triangle (mouth_fit_wide6.contour_fit_triangle_mouth)
  instead of feathered ellipse; top edge = detected jaw width x 1.20
  at the lip, apex = detected jaw centre bottom.
- DRAW: draw_triangle_jaw_v6 — cavity triangle, tongue trapezoid
  following the triangle, top teeth exactly take-5, bottom teeth
  narrowed to fit the triangle at their height.
- SENSOR, SCALE, TRAIL FIX, NON-IMPACT RULE: identical to take-5
  (detect_mouth_v5 per impact cell, radii = jaw half-size x 1.20,
  GIF flattened dark (24,28,40) + disposal=2, cells transparent,
  18/18 non-impact cells byte-identical v2 copies).
Inputs: articulation-v2-rework/batch-a/razorgater/* (eyes-only).
Outputs (NEW tag artic-pipev3w6-20261026, take-5 untouched):
  articulation-pipev3-wide6/razorgater/*.png, GIF, side-by-side
  take-5 vs take-6 GIF, mouth zooms (take-5 | take-6), manifest,
  VERIFICATION note.
Run with the venv python (cv2 lives there, not in system python):
  ~/workspace/mochiichao-work/sprite-art/atlases/_tools/.venv-opencv/bin/python build_razorgater_wide6.py
No PR from this builder. Show-first.
"""
import ast
import glob
import json
import os
import shutil
import sys

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..',
                                'articulation-pipev3-wide5'))
from mouth_fit_wide5 import detect_mouth_v5, propagate  # noqa: E402
from mouth_fit_wide6 import contour_fit_triangle_mouth, draw_triangle_jaw_v6, triangle_vertices  # noqa: E402

EXP = os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope')
V2R = os.path.join(EXP, 'articulation-v2-rework', 'batch-a')
W5 = os.path.join(EXP, 'articulation-pipev3-wide5', 'razorgater')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'razorgater')
TAG = 'artic-pipev3w6-20261026'
SCALE = 1.20
SRC_CENTRE = (32.0, 42.6)
SRC_RADII = (15.0, 10.6)


def trf(cell):
    t = cell.get('transform', {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})


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
    ok = inside and (not off_sil)
    return ok, {'changed': int(len(xs)), 'bbox': [int(x0), int(y0), int(bw), int(bh)],
                'fill_ratio': round(fill, 3), 'inside_mask_dil2': inside,
                'off_silhouette': off_sil}


def zoom_pair(a_path, b_path, outp):
    def crop(p):
        bg = Image.new('RGBA', (64, 64), (255, 255, 255, 255))
        bg.alpha_composite(Image.open(p).convert('RGBA'))
        return bg.crop((8, 22, 60, 58)).resize((208, 144), Image.NEAREST)
    pair = Image.new('RGBA', (416, 144), (255, 255, 255, 255))
    pair.alpha_composite(crop(a_path), (0, 0))
    pair.alpha_composite(crop(b_path), (208, 0))
    pair.save(outp)


def main():
    os.makedirs(OUT, exist_ok=True)
    v2man = json.load(open(os.path.join(V2R, 'manifest-artic-v2rework-20261026.json')))
    sman = json.load(open(glob.glob(os.path.join(EXP, 'batch-a', 'razorgater',
                                                 '*.batch-a-manifest.json'))[0]))
    v2sets = v2man['creatures']['razorgater']['sets']
    report = {'tag': TAG, 'creature': 'razorgater', 'method': 'V6 auto-sensed triangle jaw',
              'sensor': 'detect_mouth_v5 (OpenCV, take-5 module, reused)',
              'shape': 'triangle', 'scale_vs_detected_jaw': SCALE,
              'take5_keeper_fallback': True, 'sets': {}}
    gif_frames, gif_durs = [], []
    sbs_frames = []
    for setname, vs in v2sets.items():
        if vs.get('kind') != 'attack':
            continue
        ssrc = sman['sets'][setname]
        files, states = [], []
        for i, v2f in enumerate(vs['files']):
            v2path = os.path.join(V2R, 'razorgater', v2f)
            fn = f"razorgater-{TAG}-{setname}-cell-{i:02d}.png"
            outp = os.path.join(OUT, fn)
            src = Image.open(v2path).convert('RGBA')
            t = trf(ssrc['cells'][i])
            if i == 3:
                seed = tuple(vs['frames'][3].get('prop_mouth_held_v3', (32.0, 42.6)))
            else:
                seed = propagate(SRC_CENTRE, t)
            det = detect_mouth_v5(src, seed[0], seed[1])
            det_j = dict(det)
            det_j['seed'] = list(det['seed'])
            det_j['centre'] = list(det['centre'])
            action, gate, fmouth = 'copy-v2eyes', {}, None
            if i == 3 and det['confidence'] == 'high':
                cx, cy = det['centre']
                rx = det['jaw_w'] / 2.0 * SCALE
                ry = det['jaw_h'] / 2.0 * SCALE
                verts = triangle_vertices(cx, cy, rx, ry)
                out, mask, _ = contour_fit_triangle_mouth(src, cx, cy, rx, ry,
                                                          draw_triangle_jaw_v6)
                ok, gate = post_gate(src, out, mask)
                out.save(outp)
                jaw = det['jaw_bbox']
                fmouth = {'shape': 'triangle', 'centre': [round(cx, 1), round(cy, 1)],
                          'radii': [round(rx, 1), round(ry, 1)],
                          'top_width': round(2 * rx, 1),
                          'top_y': round(cy - ry, 1),
                          'apex': [round(cx, 1), round(cy + ry, 1)],
                          'apex_vs_jaw_bottom': round((cy + ry) - jaw[3], 1),
                          'top_width_vs_jaw_width': round(2 * rx / det['jaw_w'], 2),
                          'detected_jaw': jaw, 'detected_gap': det['gap'],
                          'confidence': det['confidence'], 'gate_ok': ok,
                          'vertices': [[round(x, 1), round(y, 1)] for x, y in verts]}
                action = 'v6triangle-jaw'
            else:
                shutil.copyfile(v2path, outp)
                if i == 3:
                    action = 'fallback-copy-v2eyes-low-confidence'
            files.append(fn)
            states.append({'frame': i, 'action': action, 'gate': gate,
                           'detection': det_j, 'final_mouth': fmouth})
            gif_frames.append(outp)
            dur = ssrc['cells'][i]['duration_ms']
            gif_durs.append(dur)
            w5p = os.path.join(W5, f"razorgater-artic-pipev3w5-20261026-{setname}-cell-{i:02d}.png")
            pair = Image.new('RGB', (128, 64), (24, 28, 40))
            for k, pp in enumerate([w5p, outp]):
                bg = Image.new('RGBA', (64, 64), (24, 28, 40, 255))
                bg.alpha_composite(Image.open(pp).convert('RGBA'))
                pair.paste(bg.convert('RGB'), (k * 64, 0))
            sbs_frames.append(pair)
        gif_durs[-1] += 250
        report['sets'][setname] = {'files': files, 'frames': states}
        if states[3]['action'].startswith('v6triangle'):
            w5cell = os.path.join(W5, f"razorgater-artic-pipev3w5-20261026-{setname}-cell-03.png")
            zoom_pair(w5cell, os.path.join(OUT, files[3]),
                      os.path.join(OUT, f'razorgater_{setname}_mouthzoom_take5_take6.png'))
    frames = []
    for p in gif_frames:
        bg = Image.new('RGBA', (64, 64), (24, 28, 40, 255))
        bg.alpha_composite(Image.open(p).convert('RGBA'))
        frames.append(bg.convert('RGB'))
    gifp = os.path.join(OUT, f'razorgater-attacks-{TAG}.gif')
    frames[0].save(gifp, save_all=True, append_images=frames[1:],
                   duration=gif_durs, loop=0, disposal=2)
    sbsp = os.path.join(OUT, f'razorgater-attacks-take5-vs-take6-{TAG}.gif')
    sbs_frames[0].save(sbsp, save_all=True, append_images=sbs_frames[1:],
                       duration=gif_durs, loop=0, disposal=2)
    report['gif'] = os.path.basename(gifp)
    report['side_by_side_gif'] = os.path.basename(sbsp)
    json.dump(report, open(os.path.join(OUT, f'manifest-{TAG}.json'), 'w'), indent=1)
    print(json.dumps(report, indent=1))


if __name__ == '__main__':
    main()
