#!/usr/bin/env python3
"""rebuild_atlases.py — rebuild locked atlases from *_shadowfree cells (no hand edits).

Context: the atlas reconciliation batch (scripted atlas-vs-plain-vs-shadowfree
pixel comparison) proved the locked atlases still contain the baked shadow:
atlas cell == plain cell, NOT shadowfree, in Kittember 14 cells, Razorgater
2 cells, Aerobeak 6 cells. Canonical locked atlases ship as-is (NOT claimed
clean) until rebuilt; this script produces the rebuilds.

Coordination (do not overwrite canonical): outputs go to an OUT dir given on
the command line (default: sprite-art/_shadow_work/rebuilt-atlases/) as
<set>_atlas_64_shadowfree.png — NEW filenames, never overwriting
<set>_atlas_64_locked.png in the live dir. Canonical staging copies no
cells/, so cells/ _shadowfree files are unaffected either way.

Verification per replaced cell (all recorded in the report JSON):
  1. locked-atlas region == original cell on VISIBLE pixels (else FLAGGED,
     not replaced — the atlas was not built from that cell, so pasting
     would be wrong). VISIBLE = alpha >= 200 in either image. (Exact RGBA
     comparison is WRONG here: locked atlases zero the RGB of fully
     transparent pixels while extracted cells carry junk RGB at alpha 0
     — kittember_cell_00: 165 exact-diff pixels, 0 alpha diffs, 0 opaque
     RGB diffs. The reconciliation batch's "atlas matches plain" is true
     on visible pixels; v1 of this script flagged all 22 cells on
     invisible noise and was corrected.)
  2. rebuilt-atlas region == shadowfree cell on visible pixels (0 diff).
  3. every non-replaced cell region is visible-identical to the locked atlas.
Originals and locked atlases are NEVER modified; only the out dir is written.

Usage: rebuild_atlases.py <set> [<set> ...] [--out DIR]
Sets are looked up under sprite-art/game-ready/<set>/.
"""
import sys, os, json
import numpy as np
from PIL import Image

def visible_diff(a, b):
    """Count pixels differing on VISIBLE pixels (alpha >= 200 in either)."""
    vis = (a[:, :, 3] >= 200) | (b[:, :, 3] >= 200)
    return int(((a != b).any(axis=2) & vis).sum())

BASE = '/home/hatch/workspace/mochiichao-work/sprite-art/game-ready'

def rebuild(set_name, outdir):
    manifest_path = os.path.join(BASE, set_name, f'{set_name}.manifest.locked.json')
    with open(manifest_path) as fh:
        man = json.load(fh)
    atlas_path = os.path.join(BASE, set_name, man['atlas_file'])
    atlas = Image.open(atlas_path).convert('RGBA')
    a = np.asarray(atlas).copy()
    cell_size = man.get('cell_size', 64)
    replaced, flagged, unchanged = [], [], []
    for fr in man['frames']:
        cell_file = fr['file']
        if 'atlas_x' not in fr or 'atlas_y' not in fr:
            continue  # icon_derived frames: not atlas cells, nothing to rebuild
        x, y = int(fr['atlas_x']), int(fr['atlas_y'])
        orig_path = os.path.join(BASE, set_name, 'cells', cell_file)
        stem, _ = os.path.splitext(cell_file)
        sf_path = os.path.join(BASE, set_name, 'cells', stem + '_shadowfree.png')
        region = np.asarray(atlas)[y:y + cell_size, x:x + cell_size]
        if not os.path.exists(sf_path):
            unchanged.append(cell_file)
            continue
        orig = np.asarray(Image.open(orig_path).convert('RGBA'))
        sf = np.asarray(Image.open(sf_path).convert('RGBA'))
        if region.shape != orig.shape or visible_diff(region, orig) != 0:
            flagged.append({'cell': cell_file,
                            'reason': 'locked-atlas region != original cell on visible pixels (not built from this cell)'})
            unchanged.append(cell_file)
            continue
        a[y:y + cell_size, x:x + cell_size] = sf
        replaced.append({'cell': cell_file, 'atlas_x': x, 'atlas_y': y,
                         'shadowfree_px_changed_vs_orig': int(((orig[:, :, 3] >= 200) & (sf[:, :, 3] < 200)).sum())})
    out_path = os.path.join(outdir, f'{set_name}_atlas_64_shadowfree.png')
    Image.fromarray(a, 'RGBA').save(out_path)
    # verify: rebuilt regions == shadowfree exactly; others == locked exactly
    rebuilt = np.asarray(Image.open(out_path).convert('RGBA'))
    locked = np.asarray(atlas)
    verify_ok = True
    for r in replaced:
        x, y = r['atlas_x'], r['atlas_y']
        sf = np.asarray(Image.open(os.path.join(BASE, set_name, 'cells', os.path.splitext(r['cell'])[0] + '_shadowfree.png')).convert('RGBA'))
        if visible_diff(rebuilt[y:y + cell_size, x:x + cell_size], sf) != 0:
            verify_ok = False
    for cell_file in unchanged:
        fr = next(f for f in man['frames'] if f['file'] == cell_file)
        x, y = int(fr['atlas_x']), int(fr['atlas_y'])
        if visible_diff(rebuilt[y:y + cell_size, x:x + cell_size], locked[y:y + cell_size, x:x + cell_size]) != 0:
            verify_ok = False
    return {'set': set_name, 'locked_atlas': man['atlas_file'], 'output': out_path,
            'replaced': replaced, 'flagged': flagged,
            'unchanged_cells': len(unchanged), 'verify_ok': verify_ok}

def main(argv):
    args = [x for x in argv[1:] if not x.startswith('--')]
    outdir = argv[argv.index('--out') + 1] if '--out' in argv else '/home/hatch/workspace/mochiichao-work/sprite-art/_shadow_work/rebuilt-atlases'
    os.makedirs(outdir, exist_ok=True)
    results = []
    for s in args:
        r = rebuild(s, outdir)
        results.append(r)
        print(f"{s}: replaced={len(r['replaced'])} flagged={len(r['flagged'])} unchanged={r['unchanged_cells']} verify_ok={r['verify_ok']} -> {r['output']}", flush=True)
        for f in r['flagged']:
            print(f"  FLAGGED: {f}", flush=True)
    with open(os.path.join(outdir, 'rebuilt-atlas-report.json'), 'w') as fh:
        json.dump(results, fh, indent=1)
    return 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
