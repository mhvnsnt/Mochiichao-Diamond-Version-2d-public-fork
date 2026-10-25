#!/usr/bin/env python3
"""Aseprite / LibreSprite JSON export -> game manifest converter.

Aseprite and LibreSprite are pixel editors, not libraries, so neither
is vendored here — and Aseprite must not be: since August 2016 its
EULA forbids redistributing compiled Aseprite (see README.md).
LibreSprite is the GPLv2 fork of the last GPL Aseprite commit, but a
full C++ editor build is impractical to vendor, so this script is the
working integration instead: it consumes what both editors already
export and converts it into the game's frame format.

Two modes:
  1. Convert an existing export (no editor needed):
       python3 aseprite_export.py --data <export.json>
           --out-manifest <manifest.json> [--sheet <sheet.png>]
     The JSON is the standard Aseprite export format: a "frames" object
     (hash form, keyed by filename) or list, each frame with
     {"frame": {"x","y","w","h"}, "duration": ms}. Output frames carry
     atlas_x/atlas_y/width/height plus the source frame and duration,
     in the same shape tools/sprite-stack/pack_atlas.py writes.
  2. Export from a .aseprite file, when an editor binary is installed:
       python3 aseprite_export.py --export <file.aseprite>
           --sheet-out <sheet.png> --data-out <data.json>
     Runs `aseprite -b --sheet ... --data ...` (or `libresprite` if
     that is the binary on PATH). If neither binary is on PATH it
     stops with install instructions instead of pretending to export.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys


def convert(data_path, out_manifest, sheet_path=None):
    with open(data_path) as fh:
        data = json.load(fh)
    frames_in = data.get("frames", data)
    items = []
    if isinstance(frames_in, dict):
        items = sorted(frames_in.items())
    elif isinstance(frames_in, list):
        items = [(f.get("filename", f"frame_{i}"), f)
                 for i, f in enumerate(frames_in)]
    else:
        raise SystemExit("unrecognised Aseprite JSON: 'frames' is not "
                         "an object or a list")
    frames = []
    for name, entry in items:
        box = entry.get("frame", entry)
        frames.append({
            "cell": len(frames),
            "name": os.path.splitext(os.path.basename(name))[0],
            "file": os.path.basename(name),
            "atlas_x": int(box["x"]), "atlas_y": int(box["y"]),
            "x": int(box["x"]), "y": int(box["y"]),
            "width": int(box["w"]), "height": int(box["h"]),
            "w": int(box["w"]), "h": int(box["h"]),
            "duration_ms": entry.get("duration"),
            "source": {"aseprite_json": os.path.basename(data_path)},
        })
    out = {
        "tool": "tools/sprite-stack/aseprite_export.py "
                "(Aseprite/LibreSprite JSON -> game manifest)",
        "sheet": os.path.basename(sheet_path) if sheet_path else None,
        "meta": data.get("meta", {}),
        "frame_count": len(frames),
        "frames": frames,
    }
    parent = os.path.dirname(out_manifest)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(out_manifest, "w") as fh:
        json.dump(out, fh, indent=1)
    print(json.dumps({"manifest": out_manifest, "frames": len(frames),
                      "sheet": out["sheet"]}))
    return out


def export_cli(ase_path, sheet_out, data_out):
    binary = shutil.which("aseprite") or shutil.which("libresprite")
    if not binary:
        print("ERROR: no Aseprite or LibreSprite binary on PATH.",
              file=sys.stderr)
        print("Install one, then re-run:", file=sys.stderr)
        print("  Aseprite (paid, EULA: do not redistribute the binary): "
              "https://www.aseprite.org/", file=sys.stderr)
        print("  LibreSprite (GPLv2, free fork): "
              "https://github.com/LibreSprite/LibreSprite", file=sys.stderr)
        return 2
    cmd = [binary, "-b", ase_path, "--sheet", sheet_out,
           "--data", data_out]
    print("running:", " ".join(cmd))
    res = subprocess.run(cmd)
    return res.returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=None)
    ap.add_argument("--sheet", default=None)
    ap.add_argument("--out-manifest", default=None)
    ap.add_argument("--export", default=None, help=".aseprite file to export")
    ap.add_argument("--sheet-out", default=None)
    ap.add_argument("--data-out", default=None)
    args = ap.parse_args()
    if args.export:
        if not args.sheet_out or not args.data_out:
            ap.error("--export needs --sheet-out and --data-out")
        return export_cli(args.export, args.sheet_out, args.data_out)
    if not args.data or not args.out_manifest:
        ap.error("convert mode needs --data and --out-manifest")
    convert(args.data, args.out_manifest, args.sheet)
    return 0


if __name__ == "__main__":
    sys.exit(main())
