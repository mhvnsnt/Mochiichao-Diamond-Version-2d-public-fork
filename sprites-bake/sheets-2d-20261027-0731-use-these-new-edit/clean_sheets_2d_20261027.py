#!/usr/bin/env python3
"""Clean 2D-sourced Dorowani + Gabu sheets per Mars 2026-10-27 ~07:26 CDT order.

Removes, alpha-only (alpha -> 0, RGB kept), from every cell:
  1. WHITE: near-white (>=245 all channels) pixels in the lower half (y >= 32)
     = leg-gap whites. Upper-row near-whites (eye highlights) are KEPT.
  2. SHADOW: grey-ish pixels (max-min <= 25, 60 <= min, max <= 215) in rows
     that contain a contiguous grey run of length >= 8 and y >= 42
     = grey ground band under the feet. Scattered body shading is KEPT.
  3. ARTIFACTS: every pixel of any detached component (8-connected, not the
     main body component) that contains ZERO body-colour pixels
     = dark grid-line / border-bleed fragments. Detached components that
     contain body colour (e.g. a toe fragment) are KEPT.
  4. LEFTOVER: after passes 1-3, any remaining component (other than main)
     with zero body-colour pixels (shadow-outline fragments detached by the
     grey removal) is also removed.

Reads ONLY from SRC. Writes ONLY to DST. Never modifies a source file.
"""
import json, os, sys, hashlib
from collections import deque
from PIL import Image

SRC = os.path.expanduser('~/workspace/mochiichao-work/sprites-bake/sheets-2d-20261027')
DST = os.path.expanduser('~/workspace/mochiichao-work/sprites-bake/sheets-2d-20261027-0731-use-these-new-edit')

def is_white(r, g, b, a):
    return a > 0 and r >= 245 and g >= 245 and b >= 245

def is_grey(r, g, b, a):
    if a == 0:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    return (mx - mn) <= 25 and 60 <= mn and mx <= 215

def is_dark(r, g, b, a):
    return a > 0 and max(r, g, b) < 60

def is_body(r, g, b, a):
    # opaque, not white, not grey-ish, not dark outline
    if a == 0 or is_white(r, g, b, a) or is_grey(r, g, b, a) or is_dark(r, g, b, a):
        return False
    return True

def components(px):
    seen = [[False] * 64 for _ in range(64)]
    comps = []
    for y in range(64):
        for x in range(64):
            if px[x, y][3] == 0 or seen[y][x]:
                continue
            q = deque([(x, y)])
            seen[y][x] = True
            pts = []
            while q:
                cx, cy = q.popleft()
                pts.append((cx, cy))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < 64 and 0 <= ny < 64 and not seen[ny][nx] and px[nx, ny][3] > 0:
                            seen[ny][nx] = True
                            q.append((nx, ny))
            comps.append(pts)
    comps.sort(key=len, reverse=True)
    return comps

def clean_cell(src_path):
    im = Image.open(src_path).convert('RGBA')
    px = im.load()
    report = {'white_before': 0, 'white_removed': [], 'grey_before': 0,
              'shadow_rows': [], 'grey_removed': 0, 'artifact_removed': 0,
              'leftover_removed': 0, 'kept_mixed_components': []}
    # count before
    for y in range(64):
        for x in range(64):
            r, g, b, a = px[x, y]
            if is_white(r, g, b, a):
                report['white_before'] += 1
            if is_grey(r, g, b, a):
                report['grey_before'] += 1
    # pass 1: leg-gap whites, lower half only
    for y in range(32, 64):
        for x in range(64):
            r, g, b, a = px[x, y]
            if is_white(r, g, b, a):
                px[x, y] = (r, g, b, 0)
                report['white_removed'].append((x, y))
    # pass 2: shadow rows = grey run >= 8 and y >= 42
    shadow_rows = []
    for y in range(42, 64):
        run = 0
        for x in range(64):
            if is_grey(*px[x, y]):
                run += 1
                if run >= 8:
                    shadow_rows.append(y)
                    break
            else:
                run = 0
    report['shadow_rows'] = shadow_rows
    for y in shadow_rows:
        for x in range(64):
            r, g, b, a = px[x, y]
            if is_grey(r, g, b, a):
                px[x, y] = (r, g, b, 0)
                report['grey_removed'] += 1
    # pass 3: detached components with zero body-colour pixels
    for comp in components(px)[1:]:
        if any(is_body(*px[x, y]) for x, y in comp):
            xs = [x for x, y in comp]; ys = [y for x, y in comp]
            report['kept_mixed_components'].append(
                {'n': len(comp), 'x': [min(xs), max(xs)], 'y': [min(ys), max(ys)]})
            continue
        for x, y in comp:
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 0)
            report['artifact_removed'] += 1
    # pass 4: leftover detached no-body-colour components (detached by grey removal)
    for comp in components(px)[1:]:
        if any(is_body(*px[x, y]) for x, y in comp):
            continue
        for x, y in comp:
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 0)
            report['leftover_removed'] += 1
    # after counts
    white_after = grey_after = 0
    for y in range(64):
        for x in range(64):
            r, g, b, a = px[x, y]
            if is_white(r, g, b, a):
                white_after += 1
            if is_grey(r, g, b, a):
                grey_after += 1
    report['white_after'] = white_after
    report['grey_after'] = grey_after
    report['white_after_rows'] = sorted({y for y in range(64) for x in range(64)
                                         if is_white(*px[x, y])})
    return im, report

def new_name(old):
    # dorowani_idle_front_00_2d.png -> dorowani_idle_front_00_2d-use-these-new-edit.png
    base, ext = os.path.splitext(old)
    return base + '-use-these-new-edit' + ext

def main():
    os.makedirs(DST, exist_ok=True)
    full = {'cells': {}, 'totals': {}}
    for creature in ('dorowani', 'gabu'):
        src_dir = os.path.join(SRC, creature)
        dst_dir = os.path.join(DST, creature)
        os.makedirs(dst_dir, exist_ok=True)
        with open(os.path.join(src_dir, f'{creature}_2d_sheets_manifest.json')) as f:
            man = json.load(f)
        new_man = dict(man)
        new_man['kind'] = 'locked_2d_front_sheets_v1_cleaned_use-these-new-edit'
        new_man['source'] = 'LOCKED_2D_FRONT_SHEETS_NOT_3D_CLEANED_USE-THESE-NEW-EDIT'
        new_man['source_label'] = ('2D-SOURCED CLEANED USE-THESE NEW EDIT — white leg-gap spots and '
                                   'grey ground shadows removed alpha-only from the 20261027 2D set. '
                                   'NOT 3D renders.')
        new_man['supersedes'] = 'sheets-2d-20261027 (old files renamed -DO-NOT-USE)'
        new_man['cleaning_report'] = 'CLEANING-REPORT-20261027-0731-use-these-new-edit.md'
        new_fams = {}
        for fam, fdata in man['families'].items():
            if fdata['status'] != 'HAVE':
                new_fams[fam] = fdata
                continue
            frames = fdata['frames']
            new_frames = []
            for fr in frames:
                cell, rep = clean_cell(os.path.join(src_dir, fr))
                nn = new_name(fr)
                cell.save(os.path.join(dst_dir, nn))
                new_frames.append(nn)
                full['cells'][f'{creature}/{fr}'] = {
                    'new_file': nn,
                    'white_before': rep['white_before'],
                    'white_removed': len(rep['white_removed']),
                    'white_removed_rows': sorted({y for x, y in rep['white_removed']}),
                    'white_after': rep['white_after'],
                    'white_after_rows': rep['white_after_rows'],
                    'grey_before': rep['grey_before'],
                    'shadow_rows': rep['shadow_rows'],
                    'grey_removed': rep['grey_removed'],
                    'grey_after': rep['grey_after'],
                    'artifact_removed': rep['artifact_removed'],
                    'leftover_removed': rep['leftover_removed'],
                    'kept_mixed_components': rep['kept_mixed_components'],
                }
            # rebuild strip from cleaned cells, same order
            cells = [Image.open(os.path.join(dst_dir, nf)) for nf in new_frames]
            w = 64 * len(cells)
            strip = Image.new('RGBA', (w, 64), (0, 0, 0, 0))
            for i, c in enumerate(cells):
                strip.paste(c, (64 * i, 0), c)
            ns = new_name(fdata['strip'])
            strip.save(os.path.join(dst_dir, ns))
            nf = dict(fdata)
            nf['frames'] = new_frames
            nf['strip'] = ns
            nf['strip_size'] = [w, 64]
            new_fams[fam] = nf
        new_man['families'] = new_fams
        new_frames_list = []
        for fr in man['frames']:
            nf = dict(fr)
            nf['file'] = new_name(fr['file'])
            nf['source_file'] = fr['source_file'] + ' -> cleaned use-these-new-edit'
            new_frames_list.append(nf)
        new_man['frames'] = new_frames_list
        with open(os.path.join(dst_dir, f'{creature}_2d_sheets_manifest-use-these-new-edit.json'), 'w') as f:
            json.dump(new_man, f, indent=1)
    tot = {'cells': len(full['cells']),
           'white_removed': sum(c['white_removed'] for c in full['cells'].values()),
           'grey_removed': sum(c['grey_removed'] for c in full['cells'].values()),
           'artifact_removed': sum(c['artifact_removed'] for c in full['cells'].values()),
           'leftover_removed': sum(c['leftover_removed'] for c in full['cells'].values())}
    full['totals'] = tot
    with open(os.path.join(DST, 'CLEANING-COUNTS-20261027-0731-use-these-new-edit.json'), 'w') as f:
        json.dump(full, f, indent=1)
    print(json.dumps(tot, indent=1))
    for k in sorted(full['cells']):
        c = full['cells'][k]
        print(f"{k}: white {c['white_before']}->{c['white_after']} (removed {c['white_removed']} rows {c['white_removed_rows']}) "
              f"| shadow_rows {c['shadow_rows']} grey_removed {c['grey_removed']} grey_after {c['grey_after']} "
              f"| artifact {c['artifact_removed']} leftover {c['leftover_removed']} kept_mixed {c['kept_mixed_components']}")

if __name__ == '__main__':
    main()
