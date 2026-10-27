#!/usr/bin/env python3
"""Per-creature rig-baked sheet builder (STAGED, gated).

Why this exists: build_rigged_sheets_after_bake.py gates on BOTH creatures
(Dorowani 27 AND Gabu 31) before building anything. The lane instruction is
the opposite: build sheets for a creature as soon as THAT creature's renders
complete; do not wait for the other creature.

This script does NOT render and does NOT touch the running bake. It only
runs the existing make_rigged_sheets.py for ONE creature, and only when
that creature's own render count is full:
  dorowani: 27 renders (idle 4 + walk 8 + ready 3 + attack 4 + hit 4 + faint 4)
  gabu:     31 renders (idle 4 + walk 8 + ready 3 + attack 5 + hit 4 + faint 4
            + 3x 512px attack side previews; previews are NOT sheet frames,
            make_rigged_sheets.py builds 28 manifest frames for gabu)

Usage: python3 build_rigged_sheets_per_creature.py <dorowani|gabu>
Outputs (same format as build_rigged_sheets_after_bake.py):
  sheets-rigged/<slug>/  <slug>_<clip>_<view>_strip.png (64px cells)
  sheets-rigged/<slug>/  <slug>_rigged_sheets_manifest.json
View mapping (by what the creature is doing, never by camera number):
  front = face+belly visible, side = profile. The rigged bake renders
  front for all clips and side for walk only — there is NO back view
  (shell/back away) in the rigged bake; this builder does NOT invent one
  by mirroring. Back-view gap is flagged in the checkpoint, not papered over.
Shadows: bake renders are transparent-background (film_transparent, no
ground plane), so no baked ground shadow is in the sheets; the engine
adds shadows as a separate layer per the shadows-separate rule.
Canon-draft rule: if a rigged sheet disagrees with the 2D sheet, FLAG it
in NEEDS-MARS-EYES.md — do not silently change canon here.
"""
import json
import os
import subprocess
import sys

BASE = "/home/hatch/workspace/mochiichao-work/sprites-bake"
EXPECTED_RENDERS = {"dorowani": 27, "gabu": 31}
EXPECTED_FRAMES = {"dorowani": 27, "gabu": 28}


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in EXPECTED_RENDERS:
        print("usage: build_rigged_sheets_per_creature.py <dorowani|gabu>")
        return 2
    slug = sys.argv[1]
    renders = os.path.join(BASE, "sheets-rigged", slug, "renders")
    got = [f for f in os.listdir(renders) if f.endswith(".png")] \
        if os.path.isdir(renders) else []
    if len(got) != EXPECTED_RENDERS[slug]:
        print(f"NOT READY {slug}: {len(got)}/{EXPECTED_RENDERS[slug]} "
              f"renders in {renders} — refusing to build sheets.")
        return 1
    out = os.path.join(BASE, "sheets-rigged", slug)
    res = subprocess.run(
        [sys.executable, os.path.join(BASE, "make_rigged_sheets.py"),
         renders, slug, out], capture_output=True, text=True)
    print(res.stdout)
    if res.returncode != 0:
        print(res.stderr, file=sys.stderr)
        return res.returncode
    man = json.load(open(os.path.join(
        out, f"{slug}_rigged_sheets_manifest.json")))
    n = len(man["frames"])
    print(f"{slug}: manifest frames {n} (expected {EXPECTED_FRAMES[slug]})")
    if n != EXPECTED_FRAMES[slug]:
        print(f"FRAME COUNT MISMATCH for {slug}")
        return 1
    print(f"SHEETS_READY {slug} — next: eye-check every strip, then add "
          f"any sheet-vs-2D disagreement to NEEDS-MARS-EYES.md (do not "
          f"decide it here).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
