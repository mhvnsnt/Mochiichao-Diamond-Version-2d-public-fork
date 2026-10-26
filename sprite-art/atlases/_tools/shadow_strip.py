#!/usr/bin/env python3
"""shadow_strip.py — strip BAKED ground-shadow blobs from character cells (open source: Pillow + numpy only).

Mars rule (2026-10-25 ~20:12 CDT): Pokemon adds shadows SEPARATELY. Shadows are
NOT part of the character art. Baked soft shadows are REMOVED from character art;
the engine adds a shadow as a separate layer (see SHADOW-LAYER-SPEC.md).
This script removes the baked blob; it never invents a shadow.

Identification is by POSITION + SOFTNESS/SHAPE + COLOUR-UNIQUENESS, never by
gray colour alone (Razorgater's body is steel-gray, so gray on the body is design):
  Gate 1 — bottom band only: y >= 0.70 * height.
  Gate 2 — flat low-chroma colour: chroma (max-min channel) <= 25, and the exact
    RGBA colour occurs NOWHERE outside the bottom band (total count == band count).
    This is the spot_check.py v2 Gate B uniqueness idea, applied to shadows.
  Gate 3 — ellipse shape: the candidate pixels' bbox is wide and flat
    (width >= 0.30 * cell width, width >= 2 * height, y_max >= 0.85 * height).
  Gate 4 — (REMOVED 2026-10-25 after eye-check): a row-dominance filter cut only
    65 of 151 shadow px in razorgater attack_b and left a HOLE inside the blob
    (proof: animation/attack/razorgater/attack_b_strike_proof.png). The blob is
    removed as a whole by Gate 2 instead: the exact unique colours are cut
    wherever they occur in the band. Protection against eating feet/tails is
    Gate 2 itself (a body colour occurs elsewhere in the image, so it is never
    a candidate) plus Gate 5 — the same method as spot_check.py v2 Gate B,
    whose _clean outputs Mars already approved for Razorgater.
  Gate 5 — safety: after the cut, the cell's topmost opaque row must be unchanged
    and the cut must be <= 40% of all opaque pixels; otherwise the file is
    FLAGGED, not cut, and no output is written for it.

Outputs: <stem>_shadowfree.png next to the original. Originals are NEVER overwritten.
Existing *_clean.png / *_shadowfree.png files are inputs only if explicitly listed;
by default the scan skips *_clean* and *_shadowfree* files.

Usage:
  shadow_strip.py --dry-run <file-or-dir> [...]
  shadow_strip.py --apply --report out.json <file-or-dir> [...]
Exit: 0 = done (flagged files listed in report, not fatal); 2 = usage error.
"""
import sys, os, json
import numpy as np
from PIL import Image

def _masks(a):
    """Vectorised (numpy, no per-pixel Python loops): return opaque, cand_mask, band_y0.

    Candidate colours: flat low-chroma opaque colours in the bottom band with
    >=12 px in the band and 0 px outside the band (colour-uniqueness gate).
    """
    H, W = a.shape[:2]
    opaque = a[:, :, 3] >= 200
    band_y0 = int(0.70 * H)
    rgb = a[:, :, :3].astype(np.int64)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    flat = (chroma <= 25) & opaque
    band_flat = flat.copy(); band_flat[:band_y0, :] = False
    keys = (rgb[:, :, 0] << 24) | (rgb[:, :, 1] << 16) | (rgb[:, :, 2] << 8) | a[:, :, 3].astype(np.int64)
    if band_flat.sum() < 12:
        return opaque, np.zeros_like(opaque), band_y0
    bk, bc = np.unique(keys[band_flat], return_counts=True)
    ok, oc = np.unique(keys[flat & ~band_flat], return_counts=True)
    outside = dict(zip(ok.tolist(), oc.tolist()))
    cand_keys = {int(k) for k, c in zip(bk.tolist(), bc.tolist()) if c >= 12 and outside.get(int(k), 0) == 0}
    cand_mask = band_flat & np.isin(keys, list(cand_keys)) if cand_keys else np.zeros_like(opaque)
    return opaque, cand_mask, band_y0

def analyze(path):
    """Return dict with cut count, flagged reason (or None), and bbox info."""
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im)
    H, W = a.shape[:2]
    opaque, cand_mask, band_y0 = _masks(a)
    if not opaque.any():
        return {'path': path, 'cut': 0, 'flag': 'empty/transparent', 'size': [W, H]}
    ys, xs = np.where(opaque)
    old_top = int(ys.min()); old_bottom = int(ys.max())
    if cand_mask.sum() < 12:
        return {'path': path, 'cut': 0, 'flag': None, 'size': [W, H], 'note': 'no unique flat colour in band >=12px'}
    cys, cxs = np.where(cand_mask)
    cw = int(cxs.max() - cxs.min() + 1); ch = int(cys.max() - cys.min() + 1)
    if cw < 0.30 * W or cw < 2 * ch or int(cys.max()) < 0.85 * H:
        return {'path': path, 'cut': 0, 'flag': None, 'size': [W, H],
                'note': f'candidate bbox not ellipse-like (w={cw} h={ch} ymax={int(cys.max())})'}
    # Cut the whole unique-colour set in the band (see Gate 4 note above).
    cut_mask = cand_mask
    cut = int(cut_mask.sum())
    if cut < 12:
        return {'path': path, 'cut': 0, 'flag': None, 'size': [W, H], 'note': 'row-dominant cut <12px'}
    if cut > 0.40 * int(opaque.sum()):
        return {'path': path, 'cut': 0, 'flag': 'cut would exceed 40% of opaque pixels', 'size': [W, H]}
    # Safety: topmost opaque row unchanged (cut is band-only by construction, verify).
    rem = opaque & ~cut_mask
    rys = np.where(rem)[0]
    if len(rys) == 0 or int(rys.min()) != old_top:
        return {'path': path, 'cut': 0, 'flag': 'topmost row would change', 'size': [W, H]}
    return {'path': path, 'cut': cut, 'flag': None, 'size': [W, H],
            'bbox': [int(cxs.min()), int(cys.min()), int(cxs.max()), int(cys.max())],
            'old_bottom': old_bottom, 'new_bottom': int(rys.max())}

def apply_cut(path, info):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im).copy()
    H, W = a.shape[:2]
    opaque, cand_mask, band_y0 = _masks(a)
    # Whole unique-colour set in the band (Gate 4 note above).
    cut_mask = cand_mask
    a[cut_mask, 3] = 0
    a[cut_mask, :3] = 0
    stem, _ = os.path.splitext(path)
    out = stem + '_shadowfree.png'
    Image.fromarray(a, 'RGBA').save(out)
    return out

def collect(paths):
    files = []
    for p in paths:
        if os.path.isdir(p):
            for root, _, names in os.walk(p):
                for n in sorted(names):
                    if n.lower().endswith('.png') and '_clean' not in n and '_shadowfree' not in n and '_proof' not in n:
                        files.append(os.path.join(root, n))
        elif p.lower().endswith('.png'):
            files.append(p)
    return sorted(set(files))

def main(argv):
    dry = '--dry-run' in argv; apply = '--apply' in argv
    report = None
    if '--report' in argv:
        report = argv[argv.index('--report') + 1]
    paths = [x for x in argv[1:] if not x.startswith('--') and x != report]
    if not paths or (dry == apply):
        print(__doc__); return 2
    files = collect(paths)
    results = []
    for f in files:
        try:
            info = analyze(f)
        except Exception as e:
            info = {'path': f, 'cut': 0, 'flag': f'error: {e}'}
        if apply and info.get('cut', 0) > 0 and not info.get('flag'):
            info['output'] = apply_cut(f, info)
        results.append(info)
    changed = [r for r in results if r.get('cut', 0) > 0]
    flagged = [r for r in results if r.get('flag')]
    total_px = sum(r.get('cut', 0) for r in changed)
    summary = {'inputs': len(files), 'changed': len(changed), 'flagged': len(flagged),
               'total_px_removed': total_px, 'results': results}
    print(f"inputs={len(files)} changed={len(changed)} flagged={len(flagged)} px_removed={total_px}")
    if report:
        with open(report, 'w') as fh:
            json.dump(summary, fh, indent=1)
        print(f"report={report}")
    return 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
