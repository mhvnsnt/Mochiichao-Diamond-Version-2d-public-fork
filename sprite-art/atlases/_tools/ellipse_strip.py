#!/usr/bin/env python3
"""ellipse_strip.py — strip GRADIENT grey shadow ellipses (open source: Pillow + numpy).

Why a second script: shadow_strip.py v3 catches FLAT-colour shadow interiors
(one or two exact colours, colour-unique in the bottom band). Aerobeak's shadow
is different: a light-grey GRADIENT ellipse under the feet — dozens of shades,
each under the 12 px flat-colour gate, so v3 finds 0 px in aerobeak cells
(verified: aerobeak_cell_00 candidate = 0 px) even though the ellipse is
plainly visible at 4x.

Gate (position + brightness + row-run + bottom-most, never colour alone).
v1 used a connected-component gate; it FAILED on aerobeak_cell_00 because
the gradient ellipse is fragmented by dark foot-tip pixels and
semi-transparent edge pixels into components under 32 px wide. v2 uses
rows, which is what the pixel data actually shows (aerobeak_cell_00:
rows 55-61 bright fraction 0.49-0.88, span 39-46; rows 44-54 dark feet,
fraction <= 0.33):
  * Bottom band only: y >= 0.70 * height.
  * Bright low-chroma mask: alpha >= 100, min-channel >= 100, chroma <= 40.
    Aerobeak's body is dark (feet 21-39); its beak white is ABOVE the band.
  * A row qualifies if bright pixels are >= 45% of that row's
    alpha>=100 pixels AND the row's opaque span >= 0.30 * cell width.
  * A RUN of >= 2 consecutive qualifying rows qualifies, ONLY if it is
    the bottom-most opaque content: at most 5 alpha>=100 pixels in all
    rows below the run. This is what protects a white belly / beak
    (dark legs/feet sit below a belly, so a belly run is not bottom-most).
  * Safety: topmost opaque row unchanged; cut <= 40% of opaque pixels.
  * Only bright pixels inside qualifying rows are cut (dark foot-tip
    pixels inside those rows are kept).

Outputs: <stem>_shadowfree.png next to the original. Originals NEVER overwritten.
Skips *_clean*, *_shadowfree*, *_proof* inputs by default.

Usage: ellipse_strip.py --dry-run|--apply [--report out.json] <file-or-dir> [...]
"""
import sys, os, json
import numpy as np
from PIL import Image

def _cut_mask(a):
    """Row-run gate (see module docstring). Returns (cut_mask, run_rows)."""
    H, W = a.shape[:2]
    opaque = a[:, :, 3] >= 200
    present = a[:, :, 3] >= 100
    rgb = a[:, :, :3].astype(int)
    bright = (rgb.min(axis=2) >= 100) & (rgb.max(axis=2) - rgb.min(axis=2) <= 40) & present
    band_y0 = int(0.70 * H)
    qual = []
    for y in range(band_y0, H):
        n = int(present[y].sum())
        if n == 0:
            qual.append(False); continue
        xs = np.where(present[y])[0]
        span = int(xs.max() - xs.min() + 1)
        qual.append(int(bright[y].sum()) * 100 >= 45 * n and span >= 0.30 * W)
    # runs of >= 2 consecutive qualifying rows, bottom-most only
    cut_mask = np.zeros_like(opaque)
    runs = []
    y = 0
    while y < len(qual):
        if qual[y]:
            j = y
            while j + 1 < len(qual) and qual[j + 1]:
                j += 1
            if j - y + 1 >= 2:
                runs.append((y, j))
            y = j + 1
        else:
            y += 1
    final_runs = []
    for (r0, r1) in runs:
        # Extend down through tapering ellipse-tip rows: bright-majority even
        # when the span narrows below the width gate (aerobeak_cell_00 rows
        # 60-61: bright 0.71/0.88, span 14/8 — still ellipse, not body).
        j = r1
        while j + 1 < len(qual):
            yy = band_y0 + j + 1
            n = int(present[yy].sum())
            if n > 0 and int(bright[yy].sum()) * 100 >= 45 * n:
                j += 1
            else:
                break
        # Bottom-most check counts only DARK pixels below the run: bright
        # taper pixels below do not disqualify; dark legs/feet below a white
        # belly DO (that is the belly protection).
        below_dark = 0
        if band_y0 + j + 1 < H:
            below_dark = int((present[band_y0 + j + 1:, :] & ~bright[band_y0 + j + 1:, :]).sum())
        if below_dark <= 5:
            for yy in range(band_y0 + r0, band_y0 + j + 1):
                cut_mask[yy] = bright[yy]
            final_runs.append((band_y0 + r0, band_y0 + j))
    return cut_mask, final_runs

def analyze(path):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im)
    H, W = a.shape[:2]
    opaque = a[:, :, 3] >= 200
    if not opaque.any():
        return {'path': path, 'cut': 0, 'flag': 'empty/transparent', 'size': [W, H]}
    old_top = int(np.where(opaque)[0].min())
    cut_mask, runs = _cut_mask(a)
    cut = int(cut_mask.sum())
    if cut == 0:
        return {'path': path, 'cut': 0, 'flag': None, 'size': [W, H], 'note': f'no bottom-most bright run (runs={runs})'}
    if cut > 0.40 * int(opaque.sum()):
        return {'path': path, 'cut': 0, 'flag': 'cut would exceed 40% of opaque pixels', 'size': [W, H]}
    rem = opaque & ~cut_mask
    if int(np.where(rem)[0].min()) != old_top:
        return {'path': path, 'cut': 0, 'flag': 'topmost row would change', 'size': [W, H]}
    ys, xs = np.where(cut_mask)
    return {'path': path, 'cut': cut, 'flag': None, 'size': [W, H], 'runs': runs,
            'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}

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
    report = argv[argv.index('--report') + 1] if '--report' in argv else None
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
            im = Image.open(f).convert('RGBA')
            a = np.asarray(im).copy()
            cut_mask, _runs = _cut_mask(a)
            a[cut_mask, 3] = 0; a[cut_mask, :3] = 0
            stem, _ = os.path.splitext(f)
            out = stem + '_shadowfree.png'
            Image.fromarray(a, 'RGBA').save(out)
            info['output'] = out
        results.append(info)
    changed = [r for r in results if r.get('cut', 0) > 0]
    flagged = [r for r in results if r.get('flag')]
    summary = {'inputs': len(files), 'changed': len(changed), 'flagged': len(flagged),
               'total_px_removed': sum(r.get('cut', 0) for r in changed), 'results': results}
    print(f"inputs={len(files)} changed={len(changed)} flagged={len(flagged)} px_removed={summary['total_px_removed']}")
    if report:
        with open(report, 'w') as fh:
            json.dump(summary, fh, indent=1)
        print(f"report={report}")
    return 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
