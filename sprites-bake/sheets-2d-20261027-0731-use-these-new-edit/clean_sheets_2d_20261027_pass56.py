#!/usr/bin/env python3
"""Pass 5+6 for the 2D cleaned sheets (DST only, SRC never touched).

Pass 5 — straight-line artifacts (grid/border bleed) that merged into the main
component where they cross the body, so component analysis missed them:
  * vertical: dark pixel with transparent left AND right neighbours, not
    adjacent (8-conn) to any body-colour pixel, in a vertical run of such
    pixels of length >= 3 in one column.
  * horizontal: dark pixel with transparent above AND below neighbours, not
    adjacent (8-conn) to any body-colour pixel, in a horizontal run of such
    pixels of length >= 8 in one row.
Body outline is always adjacent to body colour, so it is never removed.
Pass 6 — below-feet fringe: dark pixels in rows strictly below the cell's
last body-colour row that are NOT 4-adjacent to any body-colour pixel
(shadow bottom-edge bars, dashed-line remnants). Foot outline is
4-adjacent to its body, so it is never removed.
Alpha-only removal throughout (alpha -> 0, RGB kept).
After passes, all 12 strips are rebuilt from the final cells.
"""
import json, os
from PIL import Image

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
    return not (a == 0 or is_white(r, g, b, a) or is_grey(r, g, b, a) or is_dark(r, g, b, a))

def body_adjacent(px, x, y):
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if 0 <= nx < 64 and 0 <= ny < 64 and is_body(*px[nx, ny]):
                return True
    return False

def body_4adjacent(px, x, y):
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < 64 and 0 <= ny < 64 and is_body(*px[nx, ny]):
            return True
    return False

def clean_cell(path):
    im = Image.open(path).convert('RGBA')
    px = im.load()
    rep = {'pass5_vertical': 0, 'pass5_horizontal': 0, 'pass6_fringe': 0}
    # candidate grid: dark, transparent left+right (for vertical) / above+below (for horizontal), not body-adjacent
    def transparent(x, y):
        return not (0 <= x < 64 and 0 <= y < 64) or px[x, y][3] == 0
    # pass 5 vertical
    remove = set()
    for x in range(64):
        run = []
        for y in range(64):
            ok = (is_dark(*px[x, y]) and transparent(x - 1, y) and transparent(x + 1, y)
                  and not body_adjacent(px, x, y))
            if ok:
                run.append((x, y))
            else:
                if len(run) >= 3:
                    remove.update(run)
                run = []
        if len(run) >= 3:
            remove.update(run)
    for x, y in remove:
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
    rep['pass5_vertical'] = len(remove)
    # pass 5 horizontal
    remove = set()
    for y in range(64):
        run = []
        for x in range(64):
            ok = (is_dark(*px[x, y]) and transparent(x, y - 1) and transparent(x, y + 1)
                  and not body_adjacent(px, x, y))
            if ok:
                run.append((x, y))
            else:
                if len(run) >= 8:
                    remove.update(run)
                run = []
        if len(run) >= 8:
            remove.update(run)
    for x, y in remove:
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
    rep['pass5_horizontal'] = len(remove)
    # pass 6: below-feet fringe
    last_body_row = -1
    for y in range(64):
        for x in range(64):
            if is_body(*px[x, y]):
                last_body_row = y
    for y in range(last_body_row + 1, 64):
        for x in range(64):
            if is_dark(*px[x, y]) and not body_4adjacent(px, x, y):
                r, g, b, a = px[x, y]
                px[x, y] = (r, g, b, 0)
                rep['pass6_fringe'] += 1
    im.save(path)
    return rep

def main():
    totals = {'pass5_vertical': 0, 'pass5_horizontal': 0, 'pass6_fringe': 0}
    per_cell = {}
    for creature in ('dorowani', 'gabu'):
        d = os.path.join(DST, creature)
        with open(os.path.join(d, f'{creature}_2d_sheets_manifest-use-these-new-edit.json')) as f:
            man = json.load(f)
        for fam, fdata in man['families'].items():
            if fdata['status'] != 'HAVE':
                continue
            for fr in fdata['frames']:
                rep = clean_cell(os.path.join(d, fr))
                per_cell[f'{creature}/{fr}'] = rep
                for k in totals:
                    totals[k] += rep[k]
            # rebuild strip from final cells
            cells = [Image.open(os.path.join(d, nf)) for nf in fdata['frames']]
            w = 64 * len(cells)
            strip = Image.new('RGBA', (w, 64), (0, 0, 0, 0))
            for i, c in enumerate(cells):
                strip.paste(c, (64 * i, 0), c)
            strip.save(os.path.join(d, fdata['strip']))
    print(json.dumps(totals, indent=1))
    for k in sorted(per_cell):
        r = per_cell[k]
        if r['pass5_vertical'] or r['pass5_horizontal'] or r['pass6_fringe']:
            print(f"{k}: v={r['pass5_vertical']} h={r['pass5_horizontal']} fringe={r['pass6_fringe']}")
    with open(os.path.join(DST, 'CLEANING-COUNTS-PASS56-20261027-0731-use-these-new-edit.json'), 'w') as f:
        json.dump({'totals': totals, 'cells': per_cell}, f, indent=1)

if __name__ == '__main__':
    main()
