#!/usr/bin/env python3
"""Build rig-baked sheets AFTER the resumed bake finishes. DO NOT RUN EARLY.

Run only when sheets-rigged/bake_rigged_resume.log contains ALL_BAKES_DONE
(or both renders dirs hold their full expected sets: Dorowani 27, Gabu 31
including the 3 Gabu 512px side previews). This script does NOT render:
it only runs the existing make_rigged_sheets.py per creature, validates
counts, and builds eye-check contact sheets (enlarged + 64px) for the
NEEDS-MARS-EYES list — any sheet that disagrees with the 2D sheets joins
that list instead of being decided here.

Usage: python3 build_rigged_sheets_after_bake.py
Outputs (new files, never overwriting existing renders):
  sheets-rigged/<slug>/  strips + <slug>_rigged_sheets_manifest.json
  sprite-art/needs-mars-eyes-2026-10-25/<slug>_rigged_sheets_contact.png
"""
import json
import os
import subprocess
import sys

BASE = "/home/hatch/workspace/mochiichao-work/sprites-bake"
EXPECTED = {"dorowani": 27, "gabu": 31}  # gabu: 28 clip renders + 3 side previews


def main():
    for slug, n in EXPECTED.items():
        renders = os.path.join(BASE, "sheets-rigged", slug, "renders")
        got = [f for f in os.listdir(renders) if f.endswith(".png")] if os.path.isdir(renders) else []
        if len(got) != n:
            print(f"NOT READY {slug}: {len(got)}/{n} renders in {renders} — "
                  f"bake is not finished, refusing to build sheets.")
            return 1
    for slug in EXPECTED:
        out = os.path.join(BASE, "sheets-rigged", slug)
        res = subprocess.run(
            [sys.executable, os.path.join(BASE, "make_rigged_sheets.py"),
             os.path.join(out, "renders"), slug, out],
            capture_output=True, text=True)
        print(res.stdout)
        if res.returncode != 0:
            print(res.stderr, file=sys.stderr)
            return res.returncode
        man = json.load(open(os.path.join(out, f"{slug}_rigged_sheets_manifest.json")))
        print(f"{slug}: manifest frames {len(man['frames'])}")
    print("SHEETS_READY — next: eye-check every strip, then add any "
          "sheet-vs-2D disagreement to NEEDS-MARS-EYES.md (do not decide it here).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
