#!/usr/bin/env python3
"""build_turnaround_job.py - Steps B and C of the generated-turnaround
pipeline (see ../animation-method/GENERATED-TURNAROUND-PIPELINE.md).

Given a character-bank record (schema mochiichao-show/character-bank/v1,
see avatar-stack/helpers/05_character_bank_schema.json) and a DESIGN
INVENTORY written from the character's canon record, this builds:

  1. a TURNAROUND job (Step B) - schema mochiichao-show/turnaround-job/v1.
     STATUS: SPEC. The landed scene-job format v2 has no image-to-image
     job type, and no landed driver consumes an I2I job yet (the
     LightX2V pull-in carries Qwen-Image I2I configs under
     tooling/full-stack/lightx2v/configs/disagg/qwen/, but nothing in
     the landed stack runs them as a turnaround step). This script
     therefore emits the job in its spec shape and stamps it
     "status": "SPEC_NOT_RUNNABLE" - it never pretends to be wired.

  2. an ANIMATE scene job (Step C) - schema
     mochiichao-show/scene-job/v2, the LANDED format
     (avatar-stack/freedom/job_format_v2.md). The character's cutout
     is the turnaround sheet's side-profile cell - the output Step B
     will produce - so once a turnaround sheet exists, the animate
     job runs on the existing wired path (run_backend.py segments,
     chain_segments.py, white_matte.py, scene_composite.py).

The design inventory is an input file, never invented here: if it is
missing, the script refuses to run. An inventory is a JSON file:

  {"character": "mochiko",
   "features": [{"name": "twin tails",
                 "constraint": "dark-brown twin tails, teal scrunchies, ..."},
                ...]}

Usage:
  build_turnaround_job.py --bank bank-manifest.json --character mochiko \
      --inventory mochiko-design-inventory.json \
      --action "Mochiko walks steadily to the right in full profile, ..." \
      --background-clip <repo path> --background-note "<which version is current>" \
      --out-dir jobs/
"""
import argparse
import json
import sys
from pathlib import Path

TURNAROUND_SCHEMA = "mochiichao-show/turnaround-job/v1"
SCENE_SCHEMA = "mochiichao-show/scene-job/v2"
BANK_SCHEMA = "mochiichao-show/character-bank/v1"

VIEWS = ["front", "three_quarter", "side_profile", "back"]


def fail(msg: str) -> int:
    print(f"error: {msg}", file=sys.stderr)
    return 2


def build_prompts(character: str, description: str, features: list[dict]) -> tuple[str, str]:
    inv = "; ".join(f"{f['name']}: {f['constraint']}" for f in features)
    prompt = (
        f"Full character turnaround model sheet of {character} - front view, "
        f"three-quarter view, side profile view, back view - one character, "
        f"four views in a row on a plain white field, identical design in every "
        f"view, 2D anime style matching the reference art exactly. "
        f"Canon design: {description} "
        f"Design inventory (every feature is a hard constraint in EVERY view, "
        f"including the side profile): {inv}."
    )
    negative = (
        "3d render, cgi, pixar, photorealistic, realistic, blurry, distorted, "
        "deformed, morphing, changing design, extra characters, extra limbs, "
        "text, watermark, logo, camera movement, zoom, background change, "
        "colored background, missing features, dropped accessories, "
        "front-facing face on the side profile view, both eyes on the side "
        "profile view"
    )
    return prompt, negative


def main() -> int:
    ap = argparse.ArgumentParser(description="Build turnaround (SPEC) + animate (landed v2) jobs.")
    ap.add_argument("--bank", required=True, help="character-bank manifest JSON (v1)")
    ap.add_argument("--character", required=True, help="character id in the bank manifest")
    ap.add_argument("--inventory", required=True,
                    help="design-inventory JSON written from the canon record (required; never invented)")
    ap.add_argument("--action", action="append", default=[],
                    help="free-text segment action for the animate job (repeatable; job_format_v2 segments)")
    ap.add_argument("--duration-s", type=float, default=4.0, help="per-segment duration (default 4.0)")
    ap.add_argument("--seed", type=int, default=1201, help="first segment seed (default 1201)")
    ap.add_argument("--background-clip", required=True,
                    help="repo path of the scene background clip (current-version law: name the current piece)")
    ap.add_argument("--background-note", required=True,
                    help="which version of that background piece is current for this scene, and why")
    ap.add_argument("--scene-id", default=None, help="scene id (default: turnaround-<character>-01)")
    ap.add_argument("--out-dir", required=True, help="directory to write the two job files into")
    args = ap.parse_args()

    bank = json.loads(Path(args.bank).read_text())
    if bank.get("schema") != BANK_SCHEMA:
        return fail(f"bank manifest schema is {bank.get('schema')!r}, expected {BANK_SCHEMA!r}")
    chars = bank.get("manifest", {}).get("characters", {})
    if args.character not in chars:
        return fail(f"character {args.character!r} not in bank manifest (has: {sorted(chars)})")
    record = chars[args.character]
    for field in ("cutout", "description", "current_version"):
        if not record.get(field):
            return fail(f"bank record for {args.character!r} lacks {field!r} - the canon record comes first")

    inv_path = Path(args.inventory)
    if not inv_path.exists():
        return fail(f"design inventory {inv_path} not found - write it from the character's "
                    "canon record first; this script never invents design features")
    inventory = json.loads(inv_path.read_text())
    if inventory.get("character") != args.character:
        return fail(f"inventory is for {inventory.get('character')!r}, not {args.character!r}")
    features = inventory.get("features") or []
    if not features:
        return fail("design inventory has no features - an empty inventory cannot constrain a turnaround")

    prompt, negative = build_prompts(args.character, record["description"], features)
    scene_id = args.scene_id or f"turnaround-{args.character}-01"
    sheet_path = f"turnaround/{args.character}/turnaround-sheet.png"
    profile_cell = f"turnaround/{args.character}/side-profile.png"

    turnaround_job = {
        "schema": TURNAROUND_SCHEMA,
        "status": "SPEC_NOT_RUNNABLE",
        "gap": ("No landed image-to-image job type exists in scene-job v2 and no landed "
                "driver consumes one. Components present in the landed stack: LightX2V "
                "Qwen-Image I2I configs (tooling/full-stack/lightx2v/configs/disagg/qwen/ "
                "qwen_image_i2i_*.json) and the staged Qwen2.5-VL weights. Wiring this job "
                "means adding a driver that runs an I2I backend against it - until then "
                "this file is the spec of that job, not a runnable job."),
        "character": args.character,
        "source_art": record["cutout"],
        "source_art_current_version": record["current_version"],
        "views": VIEWS,
        "design_inventory": features,
        "prompt": prompt,
        "negative": negative,
        "negative_note": ("House negative block follows the prompt library's shared style "
                          "block (avatar-stack/freedom/prompt_library.json, sourced from "
                          "run_backend.py DEFAULT_NEG), extended with turnaround-specific "
                          "feature-drop terms."),
        "output_sheet": sheet_path,
        "output_cells": {v: f"turnaround/{args.character}/{v.replace('_', '-')}.png" for v in VIEWS},
    }

    segments = []
    actions = args.action or [
        f"{args.character} walks in full side profile along the ground line, "
        "arms swinging in opposition to the legs, gaze along the direction of travel"
    ]
    for i, action in enumerate(actions):
        segments.append({"action": action, "duration_s": args.duration_s, "seed": args.seed + i})

    scene_job = {
        "schema": SCENE_SCHEMA,
        "scene_id": scene_id,
        "canvas": {"width": 1280, "height": 720},
        "fps": 24,
        "background": {"clip": args.background_clip, "note": args.background_note},
        "characters": [{
            "character": args.character,
            "cutout": profile_cell,
            "cutout_note": ("The side-profile cell of the turnaround sheet this pipeline "
                            "produces (Step B output). Until a sheet passes the gates, "
                            "this job's start art does not exist - that is the honest "
                            "dependency, stated rather than papered over."),
            "segments": segments,
            "layer": {"x": 0.5, "y": 0.92, "scale": 0.62, "z_order": 1, "start_offset_s": 0.0},
        }],
    }

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    t_path = out_dir / f"{scene_id}.turnaround-job.json"
    s_path = out_dir / f"{scene_id}.scene-job.json"
    t_path.write_text(json.dumps(turnaround_job, indent=1, sort_keys=True) + "\n")
    s_path.write_text(json.dumps(scene_job, indent=1, sort_keys=True) + "\n")
    print(f"turnaround job (SPEC): {t_path}")
    print(f"animate scene job (landed format {SCENE_SCHEMA}): {s_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
