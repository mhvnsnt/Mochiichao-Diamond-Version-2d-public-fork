#!/usr/bin/env python3
"""Sprite pipeline runner — one entry point for the sprite tool stack.

Runs, in order, on a named creature, using only the vendored/open
tools in this stack:

  1. extract — from a source sheet via tools/sprite-stack/extract_atlas.py
     (Pillow + scipy), OR from an already-extracted atlas dir
     (--cells-dir + --manifest), staging its cells and validating each
     one is 64x64.
  2. clean — tools/sprite-atlas-cleanup/clean_atlas.py's gates, reused
     by import (near-background + component 3-400 px off-border +
     fully-interior + sheet-background colour match <=25/channel).
     Writes NEW clean files only; inputs are never overwritten.
  3. pack — tools/sprite-stack/pack_atlas.py packs the cleaned cells
     into one atlas PNG + packed manifest.
  4. manifest — a pipeline manifest summarising every stage, with
     counts, so a run can be checked without re-reading every file.

Optional pre-clean stage: --with-rembg runs
tools/sprite-stack/remove_background.py first. It is OFF by default
and fails loudly if rembg is not installed, rather than silently
skipping — background removal is not the same job as the clean gates,
so it must never be quietly replaced by them.

Usage:
  python3 sprite_pipeline.py --creature pyromonk
      --cells-dir <atlas dir> --manifest <atlas dir>/<stem>.manifest.json
      [--sheets-dir <2d-sheets dir>] --outdir <dir> [--force]
  python3 sprite_pipeline.py --creature <name> --sheet <sheet.webp>
      --roster-id <num> [--roles <overrides.json>] --outdir <dir>
All outputs go under --outdir. Refuses to run if pipeline outputs
already exist there unless --force is given.
"""

import argparse
import importlib.util
import json
import os
import shutil
import subprocess
import sys

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))


def find_clean_atlas():
    candidates = [
        os.environ.get("SPRITE_CLEAN_ATLAS", ""),
        os.path.join(HERE, "clean_atlas.py"),
        os.path.join(os.path.dirname(HERE), "sprite-atlas-cleanup",
                     "clean_atlas.py"),
    ]
    for path in candidates:
        if path and os.path.exists(path):
            return path
    raise SystemExit("clean_atlas.py not found next to this runner or in "
                     "../sprite-atlas-cleanup/; set SPRITE_CLEAN_ATLAS")


def load_clean_cell():
    path = find_clean_atlas()
    spec = importlib.util.spec_from_file_location("clean_atlas_mod", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.clean_cell, path


def sheet_background(sheets_dir, creature, manifest):
    """Corner median of the source sheet, else the clean script default."""
    try:
        src = manifest.get("source_sheet", {}).get("file", "")
        sheet = os.path.join(sheets_dir, creature, src) if sheets_dir else ""
        if sheet and os.path.exists(sheet):
            im = Image.open(sheet).convert("RGB")
            a = np.array(im)
            corners = np.concatenate([
                a[:20, :20].reshape(-1, 3), a[:20, -20:].reshape(-1, 3),
                a[-20:, :20].reshape(-1, 3), a[-20:, -20:].reshape(-1, 3)])
            return np.median(corners, axis=0)
    except Exception:
        pass
    return np.array([248.0, 248.0, 244.0])


def run(cmd, stage):
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in {stage} stage:\n{res.stdout}\n{res.stderr}",
              file=sys.stderr)
        raise SystemExit(f"pipeline failed at {stage} stage")
    return res.stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--creature", required=True)
    ap.add_argument("--cells-dir", default=None)
    ap.add_argument("--manifest", default=None)
    ap.add_argument("--sheet", default=None)
    ap.add_argument("--roster-id", default=None)
    ap.add_argument("--roles", default=None)
    ap.add_argument("--sheets-dir", default=None)
    ap.add_argument("--outdir", required=True)
    ap.add_argument("--pack-cols", type=int, default=6)
    ap.add_argument("--with-rembg", action="store_true")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    staged = os.path.join(args.outdir, "staged")
    clean_dir = os.path.join(args.outdir, "clean")
    summary = {"creature": args.creature, "stages": {}}

    if not args.force and os.path.exists(os.path.join(args.outdir, "clean")):
        raise SystemExit("pipeline outputs already exist in --outdir, "
                         "re-run with --force")
    os.makedirs(staged, exist_ok=True)
    os.makedirs(clean_dir, exist_ok=True)

    # --- Stage 1: extract ---------------------------------------------
    if args.sheet:
        if not args.roster_id:
            ap.error("--sheet mode needs --roster-id")
        cmd = [sys.executable, os.path.join(HERE, "extract_atlas.py"),
               "--sheet", args.sheet, "--creature", args.creature,
               "--roster-id", str(args.roster_id), "--outdir", staged]
        if args.roles:
            cmd += ["--roles", args.roles]
        out = run(cmd, "extract")
        man_name = f"{args.creature}.manifest.json"
        man_path = os.path.join(staged, man_name)
        with open(man_path) as fh:
            manifest = json.load(fh)
        summary["stages"]["extract"] = {
            "mode": "sheet", "frames": manifest["frame_count"], "detail": out}
    else:
        if not args.cells_dir or not args.manifest:
            ap.error("needs --cells-dir + --manifest, or --sheet")
        with open(args.manifest) as fh:
            manifest = json.load(fh)
        stem = os.path.basename(args.manifest)[:-len(".manifest.json")]
        frames = manifest["frames"]
        for fr in frames:
            cell_file = fr.get("file64") or fr.get("file")
            src = os.path.join(args.cells_dir, cell_file)
            if not os.path.exists(src):
                raise SystemExit(f"extract stage: missing cell {src}")
            im = Image.open(src).convert("RGBA")
            if im.size != (64, 64):
                raise SystemExit(f"extract stage: {cell_file} is "
                                 f"{im.size}, not 64x64")
            shutil.copy(src, os.path.join(staged, cell_file))
        # Keep the original atlas alongside, so the clean stage can
        # apply cut masks to it exactly like clean_atlas.py does.
        orig_atlas = manifest.get("atlas_file")
        if orig_atlas and os.path.exists(os.path.join(args.cells_dir,
                                                      orig_atlas)):
            shutil.copy(os.path.join(args.cells_dir, orig_atlas),
                        os.path.join(staged, orig_atlas))
        summary["stages"]["extract"] = {
            "mode": "cells-dir", "frames": len(frames),
            "manifest": os.path.basename(args.manifest)}
        man_path = os.path.join(staged, os.path.basename(args.manifest))
        with open(man_path, "w") as fh:
            json.dump(manifest, fh, indent=1)

    # --- Optional pre-clean: rembg ------------------------------------
    if args.with_rembg:
        rb_out = os.path.join(args.outdir, "rembg")
        out = run([sys.executable, os.path.join(HERE, "remove_background.py"),
                   "--input", staged, "--output", rb_out], "rembg")
        summary["stages"]["rembg"] = {"detail": out}

    # --- Stage 2: clean (imported gates from clean_atlas.py) ----------
    clean_cell, clean_path = load_clean_cell()
    bg = sheet_background(args.sheets_dir, args.creature, manifest)
    stem = os.path.basename(man_path)[:-len(".manifest.json")]
    changed, kept_all, skipped_all = [], [], []
    removed_total, unchanged = 0, 0
    cut_masks = {}
    for idx, fr in enumerate(manifest["frames"]):
        cell_file = fr.get("file64") or fr.get("file")
        im = Image.open(os.path.join(staged, cell_file)).convert("RGBA")
        cleaned, entry, kept, skipped, mask = clean_cell(np.array(im), bg)
        Image.fromarray(cleaned).save(os.path.join(clean_dir, cell_file))
        if entry:
            cut_masks[idx] = mask
            removed_total += entry["removed_px"]
            changed.append({"cell": fr.get("cell"), "file": cell_file,
                            "removed_px": entry["removed_px"]})
        else:
            unchanged += 1
        kept_all.extend({"cell": fr.get("cell"), **k} for k in kept)
        skipped_all.extend({"cell": fr.get("cell"), **k} for k in skipped)
    atlas_applied = None
    orig_atlas = manifest.get("atlas_file")
    atlas_name = stem + "_atlas_64_clean.png"
    if orig_atlas and os.path.exists(os.path.join(staged, orig_atlas)):
        atlas_img = Image.open(os.path.join(staged, orig_atlas)).convert("RGBA")
        atlas_arr = np.array(atlas_img)
        applied = 0
        for idx, mask in cut_masks.items():
            fr = manifest["frames"][idx]
            x, y = fr["atlas_x"], fr["atlas_y"]
            region = atlas_arr[y:y + 64, x:x + 64]
            before = int((region[..., 3] >= 200).sum())
            region[mask, 3] = 0
            after = int((region[..., 3] >= 200).sum())
            applied += before - after
        Image.fromarray(atlas_arr).save(os.path.join(args.outdir, atlas_name))
        atlas_applied = applied
    clean_man = dict(manifest)
    clean_man["atlas_file"] = atlas_name
    clean_man["version"] = str(manifest.get("version", "")) + "-clean"
    clean_man["clean_changelog"] = {
        "tool": f"sprite_pipeline.py via {clean_path} clean_cell gates",
        "sheet_background_rgb": [round(float(v), 1) for v in bg],
        "atlas_applied_px": atlas_applied,
        "changed_cells": changed,
        "unchanged_cells": unchanged,
        "kept_surface_components": kept_all,
        "skipped_components": skipped_all,
    }
    clean_man_path = os.path.join(args.outdir, stem + ".manifest-clean.json")
    with open(clean_man_path, "w") as fh:
        json.dump(clean_man, fh, indent=1)
    summary["stages"]["clean"] = {
        "tool": clean_path, "changed_cells": len(changed),
        "removed_px": removed_total, "atlas_applied_px": atlas_applied,
        "unchanged_cells": unchanged, "kept": len(kept_all),
        "skipped": len(skipped_all),
        "sheet_background_rgb": [round(float(v), 1) for v in bg]}

    # --- Stage 3: pack -------------------------------------------------
    packed_png = os.path.join(args.outdir, args.creature + "_packed.png")
    packed_man = os.path.join(args.outdir, args.creature + ".packed-manifest.json")
    out = run([sys.executable, os.path.join(HERE, "pack_atlas.py"),
               "--cells", clean_dir, "--out-atlas", packed_png,
               "--out-manifest", packed_man, "--manifest", clean_man_path,
               "--cols", str(args.pack_cols), "--force"], "pack")
    with open(packed_man) as fh:
        packed = json.load(fh)
    summary["stages"]["pack"] = {
        "frames": packed["frame_count"],
        "atlas_size": packed["atlas_size"], "detail": out}

    # --- Stage 4: manifest ---------------------------------------------
    summary["outputs"] = {
        "clean_dir": clean_dir, "clean_manifest": clean_man_path,
        "clean_atlas": os.path.join(args.outdir, atlas_name)
        if atlas_applied is not None else None,
        "packed_atlas": packed_png, "packed_manifest": packed_man}
    pipe_man = os.path.join(args.outdir,
                            args.creature + ".pipeline-manifest.json")
    with open(pipe_man, "w") as fh:
        json.dump(summary, fh, indent=1)
    summary["pipeline_manifest"] = pipe_man
    print(json.dumps(summary, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
