#!/usr/bin/env python3
"""sprite_pipeline_spotcheck.py — pipeline variant with the spot_check gate wired in.

NEW FILE (2026-10-25, sprite-art lane recovery pass). Does NOT overwrite or
edit sprite_pipeline.py: that runner's clean stage uses the older
clean_atlas.py gates, and it has no spot_check stage at all (verified by
reading it: stages are extract -> clean_atlas -> pack -> manifest).

This variant runs, in order, on a named creature, using only staged/open
tools:

  1. extract — from an already-extracted atlas dir (--cells-dir +
     --manifest), staging its cells and validating each one is 64x64
     (same check as sprite_pipeline.py's cells-dir mode).
  2. spot_check — sprite-art/atlases/_tools/spot_check.py (v2 gates:
     Gate A trapped near-white >=30px fully-interior, Gate B flat
     ground patch by exact-colour uniqueness in the bottom 25%),
     run as `spot_check.py --clean --fail-on-flagged <staged dir>`.
     Exit 1 (flagged) ABORTS the pipeline before pack — flagged art is
     never packed or presented. Cleaned cells are taken from the
     <stem>_clean.png copies spot_check writes; originals are never
     overwritten, and _clean intermediates are NOT packed (only the
     resolved per-cell file, under its original name, goes to pack).
  3. pack — tools/sprite-stack/pack_atlas.py packs the spot-checked
     cells into one atlas PNG + packed manifest.
  4. manifest — a pipeline manifest summarising every stage, with
     counts, including the spot_check stdout tail and the number of
     cells that came from _clean copies.

Shadows note (Mars correction 2026-10-25 ~20:12 CDT): shadows are a
separate engine layer, NOT part of character art. This gate does not
add shadows and does not treat a baked contact shadow as design to
keep; Gate B's flat-ground-patch cut is the mechanism that removes
such a patch when it passes its uniqueness/position gates. Anything
it cannot cut cleanly is flagged, not silently kept.

Usage:
  python3 sprite_pipeline_spotcheck.py --creature mochii \\
      --cells-dir <atlas dir> --manifest <atlas dir>/<stem>.manifest.json \\
      --outdir <dir> [--spot-check <path to spot_check.py>] [--force]
All outputs go under --outdir. Refuses to run if pipeline outputs
already exist there unless --force is given. Inputs are read-only:
no file under --cells-dir is written.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SPOT_CHECK = (
    "/home/hatch/workspace/mochiichao-work/sprite-art/atlases/_tools/spot_check.py"
)


def run(cmd, stage):
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR in {stage} stage:\n{res.stdout}\n{res.stderr}", file=sys.stderr)
        raise SystemExit(f"pipeline failed at {stage} stage (exit {res.returncode})")
    return res.stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--creature", required=True)
    ap.add_argument("--cells-dir", required=True)
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--outdir", required=True)
    ap.add_argument("--pack-cols", type=int, default=6)
    ap.add_argument("--spot-check", default=None,
                    help="path to spot_check.py (default: atlases/_tools/spot_check.py)")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    spot_check = args.spot_check or os.environ.get("SPOT_CHECK_PY", "") or DEFAULT_SPOT_CHECK
    if not os.path.exists(spot_check):
        raise SystemExit(f"spot_check.py not found: {spot_check}")

    staged = os.path.join(args.outdir, "staged")
    spot_dir = os.path.join(args.outdir, "spotchecked")
    summary = {"creature": args.creature, "stages": {},
               "spot_check_tool": spot_check}

    if not args.force and os.path.exists(os.path.join(args.outdir, "spotchecked")):
        raise SystemExit("pipeline outputs already exist in --outdir, re-run with --force")
    os.makedirs(staged, exist_ok=True)
    os.makedirs(spot_dir, exist_ok=True)

    # --- Stage 1: extract (cells-dir mode, read-only source) ---------
    with open(args.manifest) as fh:
        manifest = json.load(fh)
    frames = manifest["frames"]
    for fr in frames:
        cell_file = fr.get("file64") or fr.get("file")
        src = os.path.join(args.cells_dir, cell_file)
        if not os.path.exists(src):
            raise SystemExit(f"extract stage: missing cell {src}")
        im = Image.open(src).convert("RGBA")
        if im.size != (64, 64):
            raise SystemExit(f"extract stage: {cell_file} is {im.size}, not 64x64")
        shutil.copy(src, os.path.join(staged, cell_file))
    summary["stages"]["extract"] = {
        "mode": "cells-dir", "frames": len(frames),
        "manifest": os.path.basename(args.manifest)}

    # --- Stage 2: spot_check gate ------------------------------------
    # Run on the staged copies (never on the source dir), so _clean
    # files land next to staged copies and the source stays untouched.
    out = run([sys.executable, spot_check, "--clean", "--fail-on-flagged", staged],
              "spot_check")
    # Resolve: _clean copy wins where spot_check wrote one, else staged original.
    cleaned_cells = []
    for fr in frames:
        cell_file = fr.get("file64") or fr.get("file")
        stem, ext = os.path.splitext(cell_file)
        clean_candidate = os.path.join(staged, stem + "_clean" + ext)
        if os.path.exists(clean_candidate):
            shutil.copy(clean_candidate, os.path.join(spot_dir, cell_file))
            cleaned_cells.append(cell_file)
        else:
            shutil.copy(os.path.join(staged, cell_file),
                        os.path.join(spot_dir, cell_file))
    # The last stdout line is the "scanned N files, M with findings" summary.
    tail = out.strip().splitlines()[-1] if out.strip() else ""
    summary["stages"]["spot_check"] = {
        "tool": spot_check, "args": "--clean --fail-on-flagged",
        "scanned_frames": len(frames), "cleaned_cells": len(cleaned_cells),
        "cleaned_files": cleaned_cells, "summary_line": tail,
        "fail_on_flagged": True}
    print(f"spot_check: {tail}; cleaned cells: {len(cleaned_cells)} {cleaned_cells}")

    # --- Stage 3: pack -------------------------------------------------
    packed_png = os.path.join(args.outdir, args.creature + "_packed.png")
    packed_man = os.path.join(args.outdir, args.creature + ".packed-manifest.json")
    clean_man_path = os.path.join(args.outdir, args.creature + ".spotchecked-manifest.json")
    spot_man = dict(manifest)
    spot_man["spot_check"] = summary["stages"]["spot_check"]
    with open(clean_man_path, "w") as fh:
        json.dump(spot_man, fh, indent=1)
    out = run([sys.executable, os.path.join(HERE, "pack_atlas.py"),
               "--cells", spot_dir, "--out-atlas", packed_png,
               "--out-manifest", packed_man, "--manifest", clean_man_path,
               "--cols", str(args.pack_cols), "--force"], "pack")
    with open(packed_man) as fh:
        packed = json.load(fh)
    summary["stages"]["pack"] = {
        "frames": packed["frame_count"],
        "atlas_size": packed["atlas_size"], "detail": out}

    # --- Stage 4: manifest ---------------------------------------------
    summary["outputs"] = {
        "staged_dir": staged, "spotchecked_dir": spot_dir,
        "spotchecked_manifest": clean_man_path,
        "packed_atlas": packed_png, "packed_manifest": packed_man}
    pipe_man = os.path.join(args.outdir, args.creature + ".pipeline-spotcheck-manifest.json")
    with open(pipe_man, "w") as fh:
        json.dump(summary, fh, indent=1)
    summary["pipeline_manifest"] = pipe_man
    print(json.dumps(summary, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
