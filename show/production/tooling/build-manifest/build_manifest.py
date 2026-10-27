#!/usr/bin/env python3
"""EP01 build-manifest compiler v0 (UNIFIED-PIPELINE step 1).

Reads the LOCKED shooting script's planning companions (storyboard
plan + cue sheet) and emits a per-cut build manifest: route, assets,
audio, gates. House law enforced in code: OPEN ITEMS halt the cuts
they touch (flagged HALT, never silently passed); Mochiko dialogue
cuts are flagged VOICE-SCRATCH while casting is an open item.
"""
import json, re, sys, os

EP = os.path.join(os.path.dirname(__file__), "..", "..", "..", "episodes", "EP01")
board = open(os.path.join(EP, "STORYBOARD-PLAN.md")).read()
cuts = []
for m in re.finditer(r"\| (\d{2}) \| 0:(\d{2}) \| (.+?) \| (.+?) \|", board):
    n, sec, content, assets = m.groups()
    cuts.append({"cut": n, "seconds": int(sec), "content": content.strip(),
                 "assets": assets.strip(), "route": "puppet",
                 "flags": [], "gates": ["anim-gate", "likeness-gate"]})

OPEN_ITEM_RULES = [
    (r"device prop \(OPEN ITEM\)", "HALT: keeper device design is an OPEN ITEM (script)"),
    (r"BG .*\(MAKE", "MAKE: background not yet built"),
    (r"Forest BG \(MAKE", "MAKE: Dark Forest BG (stinger) not yet built"),
]
for c in cuts:
    for pat, flag in OPEN_ITEM_RULES:
        if re.search(pat, c["assets"] + " " + c["content"]):
            c["flags"].append(flag)
    if "Mochiko's line" in c["content"] or "read aloud" in c["content"] or "Mochiko kneels" in c["content"]:
        c["flags"].append("VOICE-SCRATCH: Mochiko casting OPEN - dialogue rendered scratch only")
    if "SUBTITLE" in c["content"]:
        c["gates"].append("subtitle-law-check (earned moments only)")
    if "STINGER" in c["content"] or "Forest" in c["content"] or "forest" in c["content"]:
        c["gates"].append("forest-rules (STILL-FOREST camera, no pattern-fill, colour script stinger)")

cue = open(os.path.join(EP, "CUE-SHEET.md")).read()
gaps = re.findall(r"GAP: [^|]+", cue)
manifest = {
    "episode": "EP01 - The Garden Has a Ghost",
    "script_status": "LOCKED (EP01-SHOOTING-SCRIPT-v2.md)",
    "finish_target": "-14 LUFS",
    "total_cut_seconds": sum(c["seconds"] for c in cuts),
    "cuts": cuts,
    "audio_gaps": [g.strip() for g in gaps],
    "global_open_items": [
        "Mochiko voice casting (all Mochiko dialogue = scratch until decided)",
        "Keeper device design (cut 12 HALT)",
        "What stopped moving in the Dark Forest (never filled in silently)",
    ],
}
out = os.path.join(os.path.dirname(__file__), "EP01-manifest.json")
json.dump(manifest, open(out, "w"), indent=2)
halts = [c["cut"] for c in cuts if any(f.startswith("HALT") for f in c["flags"])]
print(f"manifest: {len(cuts)} cuts, {manifest['total_cut_seconds']}s cut time, HALT cuts: {halts}, audio gaps: {len(gaps)}")
print("wrote", out)
