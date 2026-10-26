#!/usr/bin/env python3
"""spot_check.py — pre-presentation background-spot detector/cleaner (open source: Pillow + numpy).

Why this exists (2026-10-25, Mars's standing rule): Mars must never have to flag a
white/light spot again. Any art file headed for presentation gets scanned FIRST;
trapped background spots are auto-cleaned when they pass the gates, and anything
suspicious that FAILS a gate is reported loudly (non-zero exit) instead of shown.

Design lessons baked in (v2, after a v1 over-cut on 2026-10-25):
  * Small near-white clusters (teeth, eye highlights, claw tips, <=22px in
    Razorgater idle) are DESIGN. v1 cut them because it used the atlas gates
    (3-400px) on animation cells. v2 only auto-cuts LARGE pure patches.
  * A ground shadow blob is NOT one clean component: it merges with adjacent
    body pixels in a flat-gray mask. v2 cuts by exact-colour uniqueness instead
    of by whole component.

Gates — position/component/colour-uniqueness based, NEVER colour alone
(Razorgater's body is steel-gray, so gray ON the body is design):
  Gate A — trapped near-white patch: pixels min(R,G,B) >= 215, chroma <= 30,
    alpha >= 200, forming a component of >= 30 px with mean min-channel >= 240,
    touching NO cell border, FULLY INTERIOR (every 4-neighbour of every component
    pixel is opaque). Razorgater hurt: 95px, mean ~246, fully interior -> cut.
    Near-white components < 30px are noted, NOT cut and NOT failed (teeth).
    Near-white components >= 30px that fail interior/border are FLAGGED (fail).
  Gate B — flat ground patch: inside a mid-gray flat component in the bottom
    25% of the cell (y_min >= 0.70 * height), find colours (<= 2 of them) with
    >= 10 px each inside the component whose TOTAL occurrences in the whole
    image equal their in-component count (the colour exists nowhere else).
    Cut exactly those pixels, not the whole component. Razorgater idle: flat
    141/142 gray, 139px, occurs nowhere else -> cut; the ~107 adjacent body
    pixels in the same mask component are kept.
  Gate C — ground-zone loop (OpenCV segmentation): a gray component
    (chroma <= 15, value 90-220) of >= 40 px, in the GROUND ZONE (y_min >=
    0.65 * height), that encloses a transparent hole >= 10 px AND is a thin
    stroke (cv2.distanceTransform max <= 2.5 px). That combination is a
    shadow outline ring / trapped loop under the feet, e.g. the Razorgater
    idle ellipse loop left after Gate B (111 px, hole 142 px, maxDist 2.00).
    The band is calibrated on the observed sample: shadow loops start at
    y_min >= 0.6875H, body loops at y_min <= 0.594H, so 0.65H separates
    them; loops in the borderline band (0.60H-0.65H) are FLAGGED, never
    cut. A thin gray TAIL above the ground zone (Razorgater hurt original,
    bbox y32-53) also encloses a hole and would false-positive under a
    wider band — Gate C ignores everything above 0.60H. Thick holed loops
    in the ground zone are FLAGGED, never cut; without OpenCV, holed loops
    are FLAGGED, never cut.

SHADOWS RULE (2026-10-25, Mars, verified from the decomp files — see
SPOT-CHECK-UPGRADE.md): Pokemon adds shadows SEPARATELY. Baked soft shadows
are NOT part of the character art and are REMOVED by these gates; the engine
adds the shadow as its own separate layer/object. Never treat a baked shadow
as design to be kept.

Exit contract: 0 = clean or only auto-cut spots found; 1 = a flagged component
needs human review — do not present that file until it is resolved.

Usage:
  spot_check.py [--clean] [--fail-on-flagged] <file-or-dir> [...]
  --clean: write cleaned copies as <stem>_clean.png next to each changed file
           (originals are NEVER overwritten).
"""
import sys, os
from collections import deque, Counter
import numpy as np
from PIL import Image

def _components(mask):
    """4-connected components via scipy (fast); falls back to BFS if scipy missing."""
    try:
        from scipy import ndimage
        lab, n = ndimage.label(mask, structure=np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]]))
        comps = []
        for i in range(1, n + 1):
            ys, xs = np.where(lab == i)
            pts = list(zip(ys.tolist(), xs.tolist()))
            comps.append({'size': len(pts), 'x_min': int(xs.min()), 'x_max': int(xs.max()),
                          'y_min': int(ys.min()), 'y_max': int(ys.max()), 'pts': pts})
        return comps
    except ImportError:
        pass
    H, W = mask.shape
    seen = np.zeros_like(mask)
    comps = []
    for y in range(H):
        for x in range(W):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)]); seen[y, x] = True; pts = []
                while q:
                    cy, cx = q.popleft(); pts.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; q.append((ny, nx))
                ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
                comps.append({'size': len(pts), 'x_min': min(xs), 'x_max': max(xs),
                              'y_min': min(ys), 'y_max': max(ys), 'pts': pts})
    return comps

def _components_cv(mask):
    """Components via OpenCV (cv2.connectedComponentsWithStats) when it is
    installed, else the scipy/BFS fallback. Same dict shape as _components."""
    try:
        import cv2
        n, lab, stats, _ = cv2.connectedComponentsWithStats(
            mask.astype(np.uint8), connectivity=4)
        comps = []
        for i in range(1, n):
            x, y, w, h, area = (int(v) for v in stats[i])
            ys, xs = np.where(lab == i)
            comps.append({'size': int(area), 'x_min': x, 'x_max': x + w - 1,
                          'y_min': y, 'y_max': y + h - 1,
                          'pts': list(zip(ys.tolist(), xs.tolist()))})
        return comps
    except ImportError:
        return _components(mask)

def _hole_area(comp, H, W):
    """Transparent pixels fully enclosed by the component (a ring's interior).
    BFS over the padded bbox crop; the crop is tiny, so this is fast."""
    x0 = max(0, comp['x_min'] - 1); x1 = min(W - 1, comp['x_max'] + 1)
    y0 = max(0, comp['y_min'] - 1); y1 = min(H - 1, comp['y_max'] + 1)
    pts = set(comp['pts'])
    seen = set(); q = deque()
    for x in range(x0, x1 + 1):
        for y in (y0, y1):
            if (y, x) not in pts and (y, x) not in seen:
                seen.add((y, x)); q.append((y, x))
    for y in range(y0, y1 + 1):
        for x in (x0, x1):
            if (y, x) not in pts and (y, x) not in seen:
                seen.add((y, x)); q.append((y, x))
    while q:
        cy, cx = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if x0 <= nx <= x1 and y0 <= ny <= y1 and (ny, nx) not in pts and (ny, nx) not in seen:
                seen.add((ny, nx)); q.append((ny, nx))
    total = (x1 - x0 + 1) * (y1 - y0 + 1)
    return total - len(pts) - len(seen)

def analyze(path):
    """Return (cut_pixels, cleaned_meta, flagged, noted) for one RGBA image."""
    im = Image.open(path).convert('RGBA')
    a = np.array(im).astype(int)
    H, W = a.shape[:2]
    alpha = a[:, :, 3]
    rgb = a[:, :, :3]
    mn = rgb.min(axis=2); mx = rgb.max(axis=2)
    cut = set(); cleaned_meta = []; flagged = []; noted = []
    # Gate A
    mask_a = (mn >= 215) & ((mx - mn) <= 30) & (alpha >= 200)
    for c in _components(mask_a):
        touches_border = (c['x_min'] == 0 or c['y_min'] == 0 or
                          c['x_max'] == W - 1 or c['y_max'] == H - 1)
        fully_interior = all(0 < py < H - 1 and 0 < px < W - 1 and
                             all(alpha[py + dy, px + dx] >= 200
                                 for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                             for py, px in c['pts'])
        vals = rgb[[p[0] for p in c['pts']], [p[1] for p in c['pts']]]
        mean_min = float(vals.min(axis=1).mean()) if len(vals) else 0.0
        meta = {'gate': 'A-trapped-white', 'size': c['size'],
                'bbox': [c['x_min'], c['y_min'], c['x_max'], c['y_max']]}
        if c['size'] >= 30 and mean_min >= 240 and not touches_border and fully_interior:
            cut.update(c['pts']); cleaned_meta.append(meta)
        elif c['size'] >= 30:
            meta['reason'] = ('border-touching' if touches_border else
                              'not-fully-interior' if not fully_interior else 'mean-too-dark')
            flagged.append(meta)
        else:
            noted.append(meta)
    # Gate B
    flat = (alpha >= 200) & (np.abs(rgb[:, :, 0] - rgb[:, :, 1]) <= 2) & \
           (np.abs(rgb[:, :, 1] - rgb[:, :, 2]) <= 2) & \
           (rgb[:, :, 0] >= 100) & (rgb[:, :, 0] <= 200)
    total_colours = Counter()
    ys, xs = np.where(flat)
    for y, x in zip(ys, xs):
        total_colours[tuple(rgb[y, x])] += 1
    for c in _components(flat):
        if c['size'] < 10:
            continue
        in_comp = Counter(tuple(rgb[py, px]) for py, px in c['pts'])
        unique_cols = [col for col, n in in_comp.items()
                       if n >= 10 and total_colours[col] == n]
        if unique_cols:
            pts = [p for p in c['pts'] if tuple(rgb[p[0], p[1]]) in unique_cols]
            # judge the unique-colour pixels' OWN position (the merged component
            # may reach higher via adjacent body pixels, e.g. idle_b y=44 vs
            # patch pixels starting y=46)
            if len(pts) >= 10 and min(p[0] for p in pts) >= 0.70 * H:
                cut.update(pts)
                cleaned_meta.append({'gate': 'B-flat-ground-patch', 'size': len(pts),
                                     'bbox': [min(p[1] for p in pts), min(p[0] for p in pts),
                                              max(p[1] for p in pts), max(p[0] for p in pts)]})
    # Gate C — ground-zone loop (OpenCV segmentation). The ground-zone
    # restriction is load-bearing: a thin gray tail above the ground zone
    # (Razorgater hurt original, y32-53) also encloses a hole and would
    # false-positive under a wider band. Band calibrated on the observed
    # sample: shadow loops y_min >= 0.6875H, body loops y_min <= 0.594H.
    gray_c = ((mx - mn) <= 15) & (rgb[:, :, 0] >= 90) & (rgb[:, :, 0] <= 220) & (alpha >= 200)
    # A gray component that encloses a transparent hole and is a THIN stroke
    # is a shadow outline ring / trapped loop, not body (body is thick).
    gray_c = ((mx - mn) <= 15) & (rgb[:, :, 0] >= 90) & (rgb[:, :, 0] <= 220) & (alpha >= 200)
    try:
        import cv2 as _cv2
        _has_cv2 = True
    except ImportError:
        _cv2 = None
        _has_cv2 = False
    for c in _components_cv(gray_c):
        if c['size'] < 40 or c['y_min'] < 0.60 * H:
            continue
        hole = _hole_area(c, H, W)
        max_dist = None
        if _has_cv2:
            m = np.zeros((H, W), dtype=np.uint8)
            for py, px in c['pts']:
                m[py, px] = 1
            max_dist = float(_cv2.distanceTransform(m, _cv2.DIST_L2, 5).max())
        meta = {'gate': 'C-between-limbs-loop', 'size': c['size'],
                'bbox': [c['x_min'], c['y_min'], c['x_max'], c['y_max']],
                'hole': hole, 'maxDist': max_dist}
        if hole >= 10 and c['y_min'] >= 0.65 * H and max_dist is not None and max_dist <= 2.5:
            cut.update(c['pts']); cleaned_meta.append(meta)
        elif hole >= 10:
            meta['reason'] = ('borderline-band-needs-review' if c['y_min'] < 0.65 * H
                              else 'thick-loop-needs-review' if max_dist is not None
                              else 'no-opencv-thinness-unmeasured')
            flagged.append(meta)
    return cut, cleaned_meta, flagged, noted, im

def clean_file(path, suffix='_clean'):
    cut, cleaned_meta, flagged, noted, im = analyze(path)
    out = None
    if cut:
        a = np.array(im)
        for py, px in cut:
            a[py, px, 3] = 0
        stem, ext = os.path.splitext(path)
        out = stem + suffix + ext
        Image.fromarray(a).save(out)
    return {'file': path, 'cleaned_px': len(cut), 'cleaned': cleaned_meta,
            'flagged': flagged, 'noted': noted, 'out': out}

def main(argv):
    do_clean = '--clean' in argv
    fail = '--fail-on-flagged' in argv
    paths = [p for p in argv[1:] if not p.startswith('--')]
    files = []
    for p in paths:
        if os.path.isdir(p):
            for root, _, names in os.walk(p):
                files += [os.path.join(root, n) for n in sorted(names)
                          if n.lower().endswith('.png') and '_clean' not in n]
        elif os.path.isfile(p):
            files.append(p)
    report, any_flagged = [], False
    for f in files:
        try:
            r = clean_file(f) if do_clean else None
            if r is None:
                cut, cm, fl, no, _ = analyze(f)
                r = {'file': f, 'cleaned_px': len(cut), 'cleaned': cm,
                     'flagged': fl, 'noted': no, 'out': None}
            if r['flagged']:
                any_flagged = True
            if r['cleaned'] or r['flagged']:
                report.append(r)
                print(f"{f}: cleaned {r['cleaned_px']}px {r['cleaned']} "
                      f"flagged {r['flagged']}" + (f" -> {r['out']}" if r['out'] else ''))
        except Exception as e:
            print(f"{f}: ERROR {e}", file=sys.stderr)
            any_flagged = True
    print(f"scanned {len(files)} files, {len(report)} with findings, "
          f"flagged-unresolved: {any_flagged}")
    if fail and any_flagged:
        print("PREFLIGHT FAILED: unresolved background spots remain — do not present.",
              file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv))
