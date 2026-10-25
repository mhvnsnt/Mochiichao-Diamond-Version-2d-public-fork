#!/usr/bin/env python3
"""Surgical atlas cleanup — open-source only (Pillow + numpy, no cv2 needed).

Removes trapped sheet-background pixels from 64x64 atlas cells WITHOUT
regenerating, re-extracting, or hand-editing anything.

Rule (conservative, three gates):
  1. CANDIDATE: opaque pixel (alpha >= 200) that is near-light-neutral:
     min(R,G,B) >= 215 and (max-min) <= 30. This matches sheet-background
     cream (~248,248,244) while excluding coloured design pixels, yellow
     flame highlights (high chroma), and saturated colours.
  2. FULLY INTERIOR: every 4-neighbour of every component pixel is opaque.
     This is the key correction: trapped background in a sprite silhouette
     is enclosed BY DEFINITION (that is why the original extraction, which
     only removed border-connected background, left it behind). A white
     patch that touches the outside world anywhere is surface design.
     NOTE: the first version of this script used a flood-fill "gap test"
     (remove -> must connect to border) and it was WRONG: it classified
     every trapped patch as surface design and cut nothing. Interior
     white design (a white chest marking fully surrounded by fur) would
     also pass this gate, so gate 3 + eye verification are the safeguards.
  3. SHEET-BACKGROUND COLOUR MATCH: the component mean colour must be
     within 25 per channel of the creature's own source-sheet background
     colour (corner median of the source sheet in 2d-sheets/). Trapped
     background IS sheet background; deliberate white design is usually
     pure white or a different tint, and large (see size gate).
  Size gate: components must be 3..400 px and must not touch the cell
  border. Large white regions (Yogiferno fur, Wispkin mask) are excluded
  by size. Anything cut is verified by eye per creature class; any
  creature whose clean eats design is reverted and logged unfixable.

Outputs (NEW files only, originals untouched):
  <creature>/<creature>_atlas_64_clean.png   (rebuilt from cleaned cells
      at the exact atlas_x/atlas_y positions in the original manifest)
  <creature>/clean/<cell>.png                (every cell, cleaned)
  <creature>/<creature>.manifest-clean.json (copy of the original manifest
      + clean_changelog; original frame entries preserved)

Usage:
  python3 clean_atlas.py [--all | <creature> ...] [--force]
Refuses to overwrite existing clean outputs unless --force is given.
"""

import argparse
import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/atlases")
MIN_CH = 215
MAX_CHROMA = 30
MIN_SIZE = 3
MAX_SIZE = 400
OPAQUE = 200


def components(mask):
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    comps = []
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)])
                seen[y, x] = True
                pts = []
                while q:
                    cy, cx = q.popleft()
                    pts.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
                comps.append(pts)
    return comps


def border_reachable(transparent):
    h, w = transparent.shape
    seen = np.zeros_like(transparent, dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if transparent[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if transparent[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    while q:
        cy, cx = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and transparent[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    return seen


def clean_cell(arr, bg_color):
    """Return (cleaned_array, entry_or_None, kept, skipped, cut_mask)."""
    alpha, rgb = arr[..., 3], arr[..., :3].astype(int)
    opaque = alpha >= OPAQUE
    cand = opaque & (rgb.min(axis=2) >= MIN_CH) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= MAX_CHROMA)
    out = arr.copy()
    mask = np.zeros(opaque.shape, dtype=bool)
    removed = 0
    kept, skipped = [], []
    h, w = opaque.shape
    for comp in components(cand):
        n = len(comp)
        if n < MIN_SIZE:
            continue
        touches = any(p[0] in (0, 63) or p[1] in (0, 63) for p in comp)
        if touches:
            skipped.append({"px": n, "reason": "touches cell border"})
            continue
        if n > MAX_SIZE:
            skipped.append({"px": n, "reason": "oversize, needs review"})
            continue
        # Gate 2: fully interior — every 4-neighbour of every pixel opaque.
        interior = True
        for (y, x) in comp:
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if not (0 <= ny < h and 0 <= nx < w and opaque[ny, nx]):
                    interior = False
                    break
            if not interior:
                break
        if not interior:
            kept.append({"px": n, "reason": "not fully interior (touches outside world), kept as surface design"})
            continue
        # Gate 3: mean colour close to this creature's sheet background.
        cols = np.array([rgb[y, x] for (y, x) in comp], dtype=float)
        mean = cols.mean(axis=0)
        if np.max(np.abs(mean - np.array(bg_color, dtype=float))) > 25:
            kept.append({"px": n, "mean_rgb": [round(float(v), 1) for v in mean],
                         "reason": "mean colour does not match sheet background, kept as design"})
            continue
        for (y, x) in comp:
            out[y, x, 3] = 0
            mask[y, x] = True
        removed += n
    entry = {"removed_px": removed} if removed else None
    return out, entry, kept, skipped, mask


def sheet_background(creature_dir, manifest):
    """Corner-median background colour of the creature's source sheet."""
    try:
        src = manifest.get("source_sheet", {}).get("file", "")
        sheet = os.path.join(os.path.expanduser("~/workspace/mochiichao-work/sprite-art/2d-sheets"),
                             creature_dir, src)
        im = Image.open(sheet).convert("RGB")
        a = np.array(im)
        corners = np.concatenate([
            a[:20, :20].reshape(-1, 3), a[:20, -20:].reshape(-1, 3),
            a[-20:, :20].reshape(-1, 3), a[-20:, -20:].reshape(-1, 3)])
        return np.median(corners, axis=0)
    except Exception:
        return np.array([248.0, 248.0, 244.0])


def clean_creature(name, force=False):
    d = os.path.join(BASE, name)
    manifests = [f for f in os.listdir(d) if f.endswith(".manifest.json") and not f.endswith("-clean.json")]
    if not manifests:
        return {"creature": name, "error": "no original manifest found"}
    man_path = os.path.join(d, manifests[0])
    with open(man_path) as fh:
        man = json.load(fh)
    # Output stem comes from the MANIFEST filename, not the creature field:
    # variant dirs (strikechamp_unsuited) carry creature="strikechamp" but
    # their own manifest/atlas names. Using the creature field misnamed
    # that dir's clean outputs (caught and fixed 2026-10-25).
    stem = manifests[0][:-len(".manifest.json")]
    atlas_name = stem + "_atlas_64_clean.png"
    clean_man_name = stem + ".manifest-clean.json"
    atlas_out = os.path.join(d, atlas_name)
    man_out = os.path.join(d, clean_man_name)
    clean_dir = os.path.join(d, "clean")
    if not force and (os.path.exists(atlas_out) or os.path.exists(man_out)):
        return {"creature": name, "error": "clean outputs already exist, re-run with --force"}
    os.makedirs(clean_dir, exist_ok=True)
    bg = sheet_background(name, man)
    # Clean per-cell files first, remembering the exact cut masks.
    cut_masks = {}  # frame index -> boolean 64x64 mask of cut pixels
    changed, kept_all, skipped_all, unchanged = [], [], [], 0
    for idx, fr in enumerate(man["frames"]):
        cell_file = fr.get("file64") or fr.get("file")
        src = os.path.join(d, cell_file)
        if not os.path.exists(src):
            skipped_all.append({"cell": fr.get("cell"), "file": cell_file, "reason": "source cell file missing"})
            continue
        im = Image.open(src).convert("RGBA")
        arr = np.array(im)
        if arr.shape[0] != 64 or arr.shape[1] != 64:
            skipped_all.append({"cell": fr.get("cell"), "file": cell_file, "reason": f"not 64x64: {arr.shape[:2]}"})
            continue
        cleaned, entry, kept, skipped, mask = clean_cell(arr, bg)
        Image.fromarray(cleaned).save(os.path.join(clean_dir, cell_file))
        if entry:
            cut_masks[idx] = mask
            changed.append({"cell": fr.get("cell"), "file": cell_file, "removed_px": entry["removed_px"],
                            "reason": "trapped sheet-background gap (fully interior + sheet-background colour match)"})
        else:
            unchanged += 1
        kept_all.extend({"cell": fr.get("cell"), **k} for k in kept)
        skipped_all.extend({"cell": fr.get("cell"), **k} for k in skipped)
    # Atlas: start from the ORIGINAL atlas and apply ONLY the cut masks.
    # (Rebuilding the atlas from cells would also change ~800 edge pixels
    # the original atlas build dropped; direct masking keeps the diff
    # exactly equal to the cuts, nothing else.)
    orig_atlas_path = os.path.join(d, man["atlas_file"])
    atlas_img = Image.open(orig_atlas_path).convert("RGBA")
    atlas_arr = np.array(atlas_img)
    atlas_applied = 0
    for idx, mask in cut_masks.items():
        fr = man["frames"][idx]
        x, y = fr["atlas_x"], fr["atlas_y"]
        region = atlas_arr[y:y + 64, x:x + 64]
        before = int((region[..., 3] >= OPAQUE).sum())
        region[mask, 3] = 0
        after = int((region[..., 3] >= OPAQUE).sum())
        atlas_applied += before - after
    Image.fromarray(atlas_arr).save(atlas_out)
    clean_man = dict(man)
    clean_man["atlas_file"] = atlas_name
    clean_man["version"] = str(man.get("version", "")) + "-clean"
    clean_man["clean_changelog"] = {
        "tool": "atlases/_tools/clean_atlas.py (Pillow + numpy, open source)",
        "method": "near-background candidate (min>=215, chroma<=30) + fully-interior "
                  "gate + sheet-background colour match (<=25/channel); "
                  "surface design kept; originals untouched",
        "sheet_background_rgb": [round(float(v), 1) for v in bg],
        "atlas_applied_px": atlas_applied,
        "changed_cells": changed,
        "unchanged_cells": unchanged,
        "kept_surface_components": kept_all,
        "skipped_components": skipped_all,
    }
    with open(man_out, "w") as fh:
        json.dump(clean_man, fh, indent=1)
    return {"creature": name, "changed_cells": len(changed),
            "removed_px": sum(c["removed_px"] for c in changed),
            "atlas_applied_px": atlas_applied,
            "unchanged_cells": unchanged, "kept": len(kept_all), "skipped": len(skipped_all),
            "atlas": atlas_name, "manifest": clean_man_name}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("creatures", nargs="*", help="creature dirs; empty with --all means all")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    if args.all or not args.creatures:
        names = sorted(d for d in os.listdir(BASE)
                       if os.path.isdir(os.path.join(BASE, d)) and not d.startswith("_"))
    else:
        names = args.creatures
    summary = []
    for n in names:
        r = clean_creature(n, force=args.force)
        summary.append(r)
        print(json.dumps(r))
    tot_cells = sum(s.get("changed_cells", 0) for s in summary)
    tot_px = sum(s.get("removed_px", 0) for s in summary)
    print(f"TOTAL changed_cells={tot_cells} removed_px={tot_px} creatures={len(summary)}")


if __name__ == "__main__":
    main()
