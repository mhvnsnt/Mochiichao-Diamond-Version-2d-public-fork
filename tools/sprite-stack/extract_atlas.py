#!/usr/bin/env python3
"""Content-aware 64x64 atlas extractor for Mochiichao 2D draft sheets.

NOT a grid slicer: draft sheets are irregular composites, so this:
  1. estimates the sheet background colour from the four corners,
  2. segments non-background pixels into connected components,
  3. absorbs detached effect fragments whose boxes overlap a larger pose box
     (e.g. water swirls floating next to a body) into that pose,
  4. splits merged multi-pose components at column-projection valleys
     (poses that touch/overlap in a walk row),
  5. trims each pose, letterboxes it into a 64x64 cell preserving aspect
     (never stretches), packs cells into one atlas PNG, and writes a
     JSON manifest in the Dorowani bake-manifest style (cell_size 64,
     frames with kind/view/file) plus the Dorowani v1 grid fields
     (name/x/y/w/h/file64) and the source box in the original sheet.

Role honesty: roles are heuristic guesses (size tier + position + dark-eye
score) UNLESS a per-creature override is supplied in role_overrides.json
(eye-verified against the source sheet, or read from labels printed on the
sheet). Every frame carries role_status: "confirmed" only for override
roles; everything else is "role_unconfirmed" and is listed in the
manifest's role_unconfirmed array. Never guess silently.

Usage:
  python3 extract_atlas.py --sheet <main.webp> --creature <name> \
      --roster-id <num> --outdir <dir> [--roles overrides.json]
  python3 extract_atlas.py --batch batch.json   (see batch spec in main)
Outputs in outdir: <creature>_atlas_64.png, <creature>.manifest.json,
and per-cell <creature>_cell_NN.png files (QA aids).
"""
import argparse, json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.signal import find_peaks

CELL = 64
BG_DIST = 32          # distance from corner-median background = foreground
MIN_W, MIN_H, MIN_AREA = 90, 90, 5000   # pose floor; letters/droplets/shadows fall below
PAD = 10              # px padding around a trimmed pose box
MIN_SPLIT_W = 110     # a split piece must be at least this wide


def load_mask(path):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    patches = np.concatenate([a[:40, :40].reshape(-1, 3), a[:40, -40:].reshape(-1, 3),
                              a[-40:, :40].reshape(-1, 3), a[-40:, -40:].reshape(-1, 3)])
    bg = np.median(patches, axis=0)
    dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
    return im, a, (dist > BG_DIST), bg


def split_component(mask2d):
    """Split one component mask (bool array, bbox-local) into sub-boxes.

    Uses the smoothed column projection: pose bodies are peaks, the
    touch/overlap zone between two poses is a valley. Splits only when a
    valley between two strong peaks dips below 80% of the weaker peak.
    A single wide body (e.g. a side profile) has no such valley and is
    left whole. Returns list of (x0, x1) column ranges, local coords.
    """
    h, w = mask2d.shape
    # Projection uses the top 78% of rows only: ground effects (cracks,
    # shadows, water lines) run along the bottom and connect otherwise
    # separate poses; body gaps in the upper region are the true cuts.
    col = mask2d[:max(1, int(h * 0.78))].sum(axis=0).astype(float)
    win = max(5, w // 100)
    ker = np.ones(win) / win
    sm = np.convolve(col, ker, mode='same')
    if w < 2 * MIN_SPLIT_W:
        return [(0, w)]
    peaks, props = find_peaks(sm, distance=MIN_SPLIT_W,
                              prominence=0.20 * sm.max())
    if len(peaks) < 2:
        return [(0, w)]
    cuts = []
    for p0, p1 in zip(peaks[:-1], peaks[1:]):
        seg = sm[p0:p1 + 1]
        v = int(p0 + np.argmin(seg))
        if sm[v] < 0.80 * min(sm[p0], sm[p1]):
            if (not cuts or v - cuts[-1] >= 80) and w - v >= 80:
                cuts.append(v)
    if not cuts:
        return [(0, w)]
    bounds = [0] + cuts + [w]
    pieces = [(bounds[i], bounds[i + 1]) for i in range(len(bounds) - 1)]
    # Sliver guard: a piece much narrower than its siblings is a false
    # cut through one pose (e.g. Tyrage's tail). Fold it into its right
    # neighbour (or left, if it is the last piece) so no sliver ships.
    if len(pieces) > 1:
        widths = sorted(x1 - x0 for x0, x1 in pieces)
        med = widths[len(widths) // 2]
        fixed = []
        for idx, (x0, x1) in enumerate(pieces):
            if x1 - x0 < 0.35 * med:
                if idx < len(pieces) - 1:
                    nx0, nx1 = pieces[idx + 1]
                    pieces[idx + 1] = (x0, nx1)
                    continue
                if fixed:
                    px0, _ = fixed[-1]
                    fixed[-1] = (px0, x1)
                    continue
            fixed.append((x0, x1))
        pieces = fixed
    return pieces


def extract_frames(sheet_path):
    """Return (PIL image, frames) where each frame has a source box and a
    boolean crop mask (full-sheet coords, restricted to its labels)."""
    im, rgb, mask, bg = load_mask(sheet_path)
    W, H = im.size
    lab, _ = ndimage.label(mask, structure=np.ones((3, 3), int))
    objs = ndimage.find_objects(lab)
    comps = []  # (area, x0, y0, x1, y1, label)
    for i, sl in enumerate(objs):
        if sl is None:
            continue
        y0, y1 = sl[0].start, sl[0].stop
        x0, x1 = sl[1].start, sl[1].stop
        area = int((lab[sl] == i + 1).sum())
        comps.append((area, x0, y0, x1, y1, i + 1))
    # Text-row exclusion: printed labels are rows of many small
    # letter-sized components at one y-centre. They must never become
    # cells and never be absorbed into a pose box (Chromejaww's header
    # and "Battle Front"/"Walk Cycle"/"Icon" labels leaked into cells
    # before this). Droplets are scattered, not row-aligned, so they
    # are unaffected.
    letter_like = [c for c in comps if c[0] < 2000 and 12 <= (c[4] - c[2]) <= 55
                   and 3 <= (c[3] - c[1]) <= 110]
    # dashes / punctuation of a label row: wide, very thin
    dash_like = [c for c in comps if (c[4] - c[2]) <= 12 and (c[3] - c[1]) >= 15]
    letter_like = letter_like + dash_like
    # thin horizontal rules (label underlines): long, <=10px tall.
    # They sit directly under poses and get absorbed into pose boxes
    # (Cragarm/Dreadtoise label specks). Never a pose, never absorbed.
    rule_like = {c[5] for c in comps
                 if (c[4] - c[2]) <= 10 and (c[3] - c[1]) >= 15}
    text_labels = set()
    for c in letter_like:
        cy = (c[2] + c[4]) / 2
        row = [d for d in letter_like if abs((d[2] + d[4]) / 2 - cy) <= 12]
        if len(row) >= 4:
            text_labels.add(c[5])
    comps = [c for c in comps
             if c[5] not in text_labels and c[5] not in rule_like]
    # Largest first. A component is absorbed into an already-kept pose
    # when it is small relative to that pose AND its centre lies inside
    # the pose box (detached effect swirls, droplets) or its box overlaps
    # the pose box by >50% of itself. This applies to pose-sized
    # fragments too: Tiidebiite's water swirls are 8k px each and sit
    # inside the overworld poses' boxes. Genuine neighbouring poses have
    # disjoint boxes and centres outside other poses' boxes, so they
    # survive. Anything not absorbed and pose-sized becomes a pose.
    comps.sort(reverse=True)
    poses = []  # dicts with box + label set
    for area, x0, y0, x1, y1, lbl in comps:
        cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
        absorbed = False
        for p in poses:
            px0, py0, px1, py1 = p['box']
            inter = max(0, min(x1, px1) - max(x0, px0)) * max(0, min(y1, py1) - max(y0, py0))
            if area < 0.25 * p['area'] and (
                    (px0 - 30 <= cx <= px1 + 30 and py0 - 30 <= cy <= py1 + 30) or
                    inter > 0.50 * (x1 - x0) * (y1 - y0)):
                p['box'] = [min(px0, x0), min(py0, y0), max(px1, x1), max(py1, y1)]
                p['labels'].add(lbl)
                p['absorbed'].append((area, x0, y0, x1, y1))
                absorbed = True
                break
        if absorbed:
            continue
        if area >= MIN_AREA and (x1 - x0) >= MIN_W and (y1 - y0) >= MIN_H:
            poses.append({'box': [x0, y0, x1, y1], 'labels': {lbl},
                          'area': area, 'absorbed': []})
    # Split merged multi-pose components, then re-sort by (y0, x0).
    # Gate: only row-like boxes (wide AND clearly shorter than the
    # tallest pose) are split candidates. A tall wide pose (battle pose
    # with effect rings) must never be split by its own effect peaks.
    max_h = max((p['box'][3] - p['box'][1] for p in poses), default=0)
    heights = sorted(p['box'][3] - p['box'][1] for p in poses)
    med_h = heights[len(heights) // 2] if heights else 0
    frames = []
    for p in poses:
        x0, y0, x1, y1 = p['box']
        sub = np.isin(lab[y0:y1, x0:x1], list(p['labels']))
        if (x1 - x0) >= 1.45 * (y1 - y0) and (y1 - y0) <= 0.9 * max_h:
            ranges = split_component(sub)
            for rx0, rx1 in ranges:
                frames.append({'box': [x0 + rx0, y0, x0 + rx1, y1],
                               'labels': p['labels'], 'split': len(ranges) > 1,
                               'absorbed': p['absorbed']})
        elif (y1 - y0) >= 1.4 * (x1 - x0) and (y1 - y0) >= 1.5 * med_h:
            # Tall stacked column (Kickmaster strips, Toxitacle stacked
            # pair): split by row projection via the transposed mask.
            # split_component's top-78% window then covers the left 78%
            # of columns, which holds the bodies, not trailing ghosts.
            ranges = split_component(sub.T)
            for ry0, ry1 in ranges:
                frames.append({'box': [x0, y0 + ry0, x1, y0 + ry1],
                               'labels': p['labels'], 'split': len(ranges) > 1,
                               'absorbed': p['absorbed']})
        else:
            frames.append({'box': [x0, y0, x1, y1],
                           'labels': p['labels'], 'split': False,
                           'absorbed': p['absorbed']})
    frames.sort(key=lambda f: (f['box'][1], f['box'][0]))
    # eye score: very dark pixels inside the eroded silhouette (eyes show
    # on front/side views, not on backs). Computed per frame on its box.
    for f in frames:
        x0, y0, x1, y1 = f['box']
        m = np.isin(lab[y0:y1, x0:x1], list(f['labels']))
        m = ndimage.binary_fill_holes(m)
        er = ndimage.binary_erosion(m, iterations=6) if m.sum() > 200 else m
        sub_rgb = rgb[y0:y1, x0:x1]
        dark = (sub_rgb[:, :, 0] < 90) & (sub_rgb[:, :, 1] < 90) & (sub_rgb[:, :, 2] < 90)
        f['eye_score'] = int((dark & er).sum())
        # face blobs: compact near-round dark clusters inside the
        # silhouette (eyes). Armour lines / outlines are elongated and
        # fail the roundness test, so they do not count as eyes.
        dlab, _ = ndimage.label(dark & er, structure=np.ones((3, 3), int))
        dobjs = ndimage.find_objects(dlab)
        blobs = 0
        blob_area = 0
        for j, sl in enumerate(dobjs):
            if sl is None:
                continue
            bh, bw = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
            ba = int((dlab[sl] == j + 1).sum())
            if 80 <= ba <= 4000 and 0.4 <= bw / max(bh, 1) <= 2.5 and \
               ba >= 0.4 * bw * bh:
                blobs += 1
                blob_area += ba
        f['face_blobs'] = blobs
        f['face_blob_area'] = blob_area
        f['mask'] = m
        f['cropped'] = bool(x0 <= 2 or y0 <= 2 or x1 >= W - 2 or y1 >= H - 2)
        f['area'] = int(m.sum())
    return im, rgb, (W, H), frames


def guess_roles(frames):
    """Heuristic roles (ALL unconfirmed unless an override replaces them).
    Method: cluster frames into horizontal bands by y-centre; the top
    band holds battle/overworld poses, later bands hold overworld or
    walk rows. Within a band, x-clusters are direction groups; a group's
    direction comes from its mean dark-eye score (front high, back ~0)
    and aspect (side profiles are wide). Battle vs overworld within the
    top band is positional only (left pair = battle) and is the weakest
    inference in the manifest - it is flagged, not asserted."""
    n = len(frames)
    if n == 0:
        return []
    areas = np.array([f['area'] for f in frames], float)
    mx = areas.max()
    H = max(f['box'][3] for f in frames)
    roles = [None] * n
    walk_counters = {}
    med = np.median(areas)
    icon_idx = int(np.argmin(areas))
    if areas[icon_idx] < 0.45 * med:
        roles[icon_idx] = ('icon', 'icon', 'front')
    rest = [i for i in range(n) if roles[i] is None]
    # bands by y-centre, tolerance 5% of sheet height
    bands = []
    for i in sorted(rest, key=lambda i: (frames[i]['box'][1] + frames[i]['box'][3]) / 2):
        yc = (frames[i]['box'][1] + frames[i]['box'][3]) / 2
        if bands and yc - bands[-1][-1][1] <= 0.05 * H:
            bands[-1].append((i, yc))
        else:
            bands.append([(i, yc)])

    def direction_of(members):
        blobs = np.mean([frames[i]['face_blobs'] for i in members])
        asp = np.mean([(frames[i]['box'][2] - frames[i]['box'][0]) /
                       max(frames[i]['box'][3] - frames[i]['box'][1], 1)
                       for i in members])
        if blobs >= 2:
            return 'front'
        if blobs <= 0:
            return 'back'
        return 'side' if asp > 0.9 else 'front'

    def x_clusters(members):
        members = sorted(members, key=lambda i: frames[i]['box'][0])
        groups, cur = [], [members[0]]
        for i in members[1:]:
            gap = frames[i]['box'][0] - frames[cur[-1]]['box'][2]
            if gap > 80:
                groups.append(cur); cur = []
            cur.append(i)
        groups.append(cur)
        return groups

    for bi, band in enumerate(bands):
        members = [i for i, _ in band]
        if bi == 0:
            # top band: left pair = battle, rest = overworld
            groups = x_clusters(members)
            flat = [i for g in groups for i in g]
            # pair up left-to-right: (front, back) by eye score within pair
            used = set()
            pair_no = 0
            for a, b in zip(flat[0::2], flat[1::2]):
                tier = 'battle' if pair_no == 0 else 'overworld'
                ka = (frames[a]['face_blobs'], frames[a]['face_blob_area'])
                kb = (frames[b]['face_blobs'], frames[b]['face_blob_area'])
                f, bk = (a, b) if ka >= kb else (b, a)
                roles[f] = (f"{tier}_front", tier, 'front')
                roles[bk] = (f"{tier}_back", tier, 'back')
                used.update((a, b)); pair_no += 1
            for i in flat:
                if i not in used:
                    roles[i] = (f"overworld_{direction_of([i])}", 'overworld',
                                direction_of([i]))
            continue
        rel = np.mean([areas[i] / mx for i in members])
        tier = 'overworld' if (rel >= 0.30 and bi <= 2) else 'walk'
        for g in x_clusters(members):
            v = direction_of(g)
            if tier == 'walk':
                for i in g:
                    k = f"walk_{v}"
                    roles[i] = (f"{k}_{walk_counters.get(k, 0)}", 'walk', v)
                    walk_counters[k] = walk_counters.get(k, 0) + 1
            else:
                for i in g:
                    roles[i] = (f"overworld_{v}", 'overworld', v)
    out = []
    for i, r in enumerate(roles):
        if r is None:
            out.append((f"pose_{i}", 'pose', 'unknown'))
        else:
            out.append(r)
    return out


def render_cell(rgb, frame):
    """Crop the frame box with padding, letterbox into a 64x64 RGBA cell."""
    x0, y0, x1, y1 = frame['box']
    x0p, y0p = max(0, x0 - PAD), max(0, y0 - PAD)
    x1p, y1p = min(rgb.shape[1], x1 + PAD), min(rgb.shape[0], y1 + PAD)
    crop = rgb[y0p:y1p, x0p:x1p]
    m = np.zeros((y1p - y0p, x1p - x0p), bool)
    m[y0 - y0p:y1 - y0p, x0 - x0p:x1 - x0p] = frame['mask']
    m = ndimage.binary_fill_holes(m)
    rgba = np.zeros((m.shape[0], m.shape[1], 4), np.uint8)
    rgba[:, :, :3] = np.clip(crop, 0, 255)
    rgba[:, :, 3] = np.where(m, 255, 0).astype(np.uint8)
    cell_img = Image.fromarray(rgba, 'RGBA')
    w, h = cell_img.size
    scale = min(CELL / w, CELL / h)
    nw, nh = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    small = cell_img.resize((nw, nh), Image.LANCZOS)
    cell = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
    cell.paste(small, ((CELL - nw) // 2, (CELL - nh) // 2), small)
    return cell


def build(sheet_path, creature, roster_id, outdir, overrides=None,
          draft=False, variant=None, notes=''):
    im, rgb, (W, H), frames = extract_frames(sheet_path)
    roles = guess_roles(frames)
    # overrides: list parallel to frames in (y0, x0) order. A string is an
    # eye-verified role (confirmed); null keeps the heuristic guess and
    # stays role_unconfirmed. Duplicate guessed/overridden role names get
    # _2, _3 suffixes so every cell has a distinct manifest name.
    confirmed = [False] * len(frames)
    if overrides:
        for i, r in enumerate(overrides[:len(frames)]):
            if r:
                kind = 'icon' if r == 'icon' else ('battle' if r.startswith('battle') else
                      ('walk' if r.startswith('walk') else 'overworld'))
                view = 'front' if r == 'icon' else (
                    'back' if 'back' in r else ('side' if 'side' in r else
                    ('front' if 'front' in r else 'unknown')))
                roles[i] = (r, kind, view)
                confirmed[i] = True
    seen = {}
    for i, (r, k, v) in enumerate(roles):
        if r in seen:
            seen[r] += 1
            roles[i] = (f"{r}_{seen[r]}", k, v)
        else:
            seen[r] = 1
    os.makedirs(outdir, exist_ok=True)
    stem = creature if not variant else f"{creature}_{variant}"
    cols = 6
    rows = math.ceil(len(frames) / cols) if frames else 1
    atlas = Image.new('RGBA', (cols * CELL, rows * CELL), (0, 0, 0, 0))
    out_frames, unconfirmed = [], []
    for i, f in enumerate(frames):
        cell = render_cell(rgb, f)
        cell_path = os.path.join(outdir, f"{stem}_cell_{i:02d}.png")
        cell.save(cell_path)
        cx, cy = (i % cols) * CELL, (i // cols) * CELL
        atlas.paste(cell, (cx, cy), cell)
        x0, y0, x1, y1 = f['box']
        role, kind, view = roles[i]
        status = 'confirmed' if confirmed[i] else 'role_unconfirmed'
        if status == 'role_unconfirmed':
            unconfirmed.append({'cell': i, 'role': role, 'reason': 'heuristic guess (size tier + position + eye score); needs QA/lock eye-check'})
        out_frames.append({
            'cell': i, 'role': role, 'kind': kind, 'view': view,
            'role_status': status,
            'name': f"{stem}_{role}",
            'file': f"{stem}_cell_{i:02d}.png", 'file64': f"{stem}_cell_{i:02d}.png",
            'atlas_x': cx, 'atlas_y': cy, 'width': CELL, 'height': CELL,
            'x': cx, 'y': cy, 'w': CELL, 'h': CELL,
            'source': {'file': os.path.basename(sheet_path), 'x': x0, 'y': y0,
                       'w': x1 - x0, 'h': y1 - y0},
            'eye_score': f['eye_score'], 'face_blobs': f['face_blobs'],
            'face_blob_area': f['face_blob_area'],
            'split_from_merged': bool(f['split']),
            'absorbed_fragments': len(f['absorbed']),
            'cropped_at_sheet_edge': bool(f['cropped']),
        })
    atlas_path = os.path.join(outdir, f"{stem}_atlas_64.png")
    atlas.save(atlas_path)
    manifest = {
        'creature': creature, 'roster_id': roster_id, 'variant': variant,
        'version': 'atlas-from-2d-sheet-v1', 'cell_size': CELL,
        'game_rule': 'looks 3D, runs 2D - game eats only these 2D cells',
        'source_sheet': {'file': os.path.basename(sheet_path), 'width': W, 'height': H},
        'atlas_file': os.path.basename(atlas_path),
        'atlas_size': {'width': cols * CELL, 'height': rows * CELL},
        'frame_count': len(frames),
        'draft': bool(draft),
        'draft_note': 'Roster-name draft only; final naming set undecided by Mars.' if draft else '',
        'notes': notes,
        'role_unconfirmed': unconfirmed,
        'frames': out_frames,
    }
    man_path = os.path.join(outdir, f"{stem}.manifest.json")
    with open(man_path, 'w') as fh:
        json.dump(manifest, fh, indent=2)
    return manifest, atlas_path, man_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sheet', required=True)
    ap.add_argument('--creature', required=True)
    ap.add_argument('--roster-id', required=True)
    ap.add_argument('--outdir', required=True)
    ap.add_argument('--roles', default=None, help='JSON list of roles in frame order (eye-verified)')
    ap.add_argument('--draft', action='store_true')
    ap.add_argument('--variant', default=None)
    ap.add_argument('--notes', default='')
    a = ap.parse_args()
    overrides = None
    if a.roles:
        with open(a.roles) as fh:
            overrides = json.load(fh)
    man, atlas_path, man_path = build(a.sheet, a.creature, a.roster_id,
                                      a.outdir, overrides, a.draft, a.variant, a.notes)
    print(f"{a.creature}: {man['frame_count']} cells -> {atlas_path}")
    print(f"  roles: {[f['role'] for f in man['frames']]}")
    print(f"  unconfirmed: {len(man['role_unconfirmed'])}  manifest: {man_path}")


if __name__ == '__main__':
    main()
