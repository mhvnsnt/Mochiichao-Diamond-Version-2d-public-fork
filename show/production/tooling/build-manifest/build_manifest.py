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

# LIVING WORLD (owner directive 2026-10-27; FULLSTACK-WIRING wiring):
# every scene carries ambient_layers[]; each VISUAL layer must name a
# paired SOUND row or it is recorded as an audio-gate failure.
AMBIENT = {
 "01": [("cloud_drift","wind_bed_soft"), ("grass_sway","grass_rustle_light"), ("gate_swing_breeze","gate_creak_soft")],
 "02": [("cloud_drift","wind_bed_soft"), ("grass_sway","grass_rustle_light")],
 "03": [("gate_swing_breeze","gate_creak_soft"), ("leaf_drift","leaf_rustle_pass")],
 "04": [("grass_sway","grass_rustle_light"), ("leaf_drift","leaf_rustle_pass"), ("distant_creature_crossing_sky","distant_cry_faint_GAP")],
 "05": [("cloud_drift","wind_bed_soft"), ("grass_sway","grass_rustle_light")],
 "06": [("water_ripple","pond_lap_light"), ("reeds_sway","reed_rustle")],
 "07": [("water_ripple","pond_lap_light")],
 "08": [("water_ripple","pond_lap_light"), ("grass_sway","grass_rustle_light")],
 "09": [("reeds_sway","reed_rustle"), ("leaf_drift","leaf_rustle_pass")],
 "13": [("water_ripple_dusk","pond_lap_dusk"), ("reeds_still","dusk_air_hush")],
 "17": [("water_ripple_dusk","pond_lap_dusk")],
 "20": [("gate_still_night","night_air"), ("board_creak","wood_creak_soft")],
 "23": [("smoke_drift","night_air")],
 "25": [("FOREST: pattern still, no cycles","forest_silence (no birdsong - by design)")],
 "26": [("FOREST: no ambient motion","forest_silence (by design)")],
 "28": [("single_leaf_fall","one_leaf_land_soft")],
}
for c in cuts:
    layers = AMBIENT.get(c["cut"], [])
    c["ambient_layers"] = [{"visual": v, "sound": s} for v, s in layers]
    for v, s in layers:
        if s.endswith("_GAP") or "GAP" in s:
            c["flags"].append(f"AMBIENT SOUND GAP: {v} paired sound '{s}' not yet sourced (sfx_pull, FULLSTACK-WIRING phase Now)")

cue = open(os.path.join(EP, "CUE-SHEET.md")).read()
gaps = re.findall(r"GAP: [^|]+", cue)
manifest = {
    "episode": "EP01 - The Garden Has a Ghost",
    "script_status": "LOCKED (EP01-SHOOTING-SCRIPT-v2.md)",
    "finish_target": "-14 LUFS",
    "total_cut_seconds": sum(c["seconds"] for c in cuts),
    "cuts": cuts,
    "audio_gaps": [g.strip() for g in gaps],
    "ambient_gate": "PASS rule: every ambient visual layer names a paired sound row; GAP-paired layers are flagged per cut, never silent (LIVING-WORLD directive 2026-10-27)",
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
