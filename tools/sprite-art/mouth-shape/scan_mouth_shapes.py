#!/usr/bin/env python3
"""Scan v2-rework batch-a impact cells and log per-creature shape proposals.

Usage (venv python, cv2 lives there, not system python):
  sprite-art/atlases/_tools/.venv-opencv/bin/python scan_mouth_shapes.py
Inputs are the workspace v2-rework manifest + cells (staging paths, see
README); output is shape-detection-log.json in this directory.
A proposal is not a lock — only Mars approval locks a shape, recorded
in mouth-shape-registry.json.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mouth_shape import detect_mouth_shape, propose_creature_shape  # noqa: E402
from PIL import Image  # noqa: E402

EXP = os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope')

def main():
    man = json.load(open(f'{EXP}/articulation-v2-rework/batch-a/manifest-artic-v2rework-20261026.json'))
    log = {}
    for cr, cv in man['creatures'].items():
        meas = []
        for setname, vs in cv['sets'].items():
            if vs.get('kind') != 'attack' or len(vs['files']) < 4:
                continue
            cell = Image.open(f"{EXP}/articulation-v2-rework/batch-a/{cr}/{vs['files'][3]}").convert('RGBA')
            fr = vs.get('frames')
            seed = fr[3].get('prop_mouth_held_v3') if isinstance(fr, list) and len(fr) > 3 and isinstance(fr[3], dict) else None
            if not seed:
                seed = man['old_mouths_held'][cr]
            meas.append(detect_mouth_shape(cell, seed[0], seed[1]))
        log[cr] = propose_creature_shape(meas)
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shape-detection-log.json')
    json.dump(log, open(out, 'w'), indent=1)
    print(json.dumps(log, indent=1))

if __name__ == '__main__':
    main()
