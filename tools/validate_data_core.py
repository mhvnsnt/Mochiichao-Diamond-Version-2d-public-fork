#!/usr/bin/env python3
"""Validate src/data/core/*.json: parse, cross-reference, coverage report.
Exit 0 = no hard errors. Known gaps print as warnings (open decisions, not failures).
Run from the repo root: python3 tools/validate_data_core.py"""
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CORE = ROOT / "src" / "data" / "core"
errors, warnings = [], []
def load(name):
    try: return json.loads((CORE / name).read_text())
    except Exception as e: errors.append(f"{name}: unparsable: {e}"); return {}
species = load("species.json").get("species", [])
moves = load("moves.json").get("moves", [])
learnsets = load("learnsets.json").get("learnsets", [])
evolutions = load("evolutions.json").get("evolutions", [])
trainers = load("trainers.json").get("trainers", [])
encounters = load("encounters.json").get("encounters", [])
sp_ids = {s["id"] for s in species}
mv_ids = {m["id"] for m in moves}
if len(species) != 47: errors.append(f"species count {len(species)} != 47")
if [s["id"] for s in species] != [f"{i:03d}" for i in range(1, 48)]:
    errors.append("species ids are not 001-047 in order")
if len(sp_ids) != len(species): errors.append("duplicate species ids")
for s in species:
    for k, v in s["baseStats"].items():
        if v is None:
            warnings.append(f"Species {s['id']} ({s['name']}): baseStat {k} is null (pending decision)")
        elif not (1 <= v <= 255): errors.append(f"Species {s['id']}: stat {k}={v} out of range")
    if not s["types"]: errors.append(f"Species {s['id']}: no types")
for m in moves:
    if m["power"] < 0 or m["power"] > 250: warnings.append(f"Move {m['id']}: power {m['power']} unusual")
    if not (1 <= m["pp"] <= 40): warnings.append(f"Move {m['id']}: PP {m['pp']} unusual")
ls_ids = set()
for l in learnsets:
    ls_ids.add(l["speciesId"])
    if l["speciesId"] not in sp_ids: errors.append(f"Learnset species {l['speciesId']} not in species")
    for lv, mid in l["levelUp"]:
        if mid not in mv_ids: errors.append(f"Learnset {l['speciesId']}: move {mid} not in moves")
    for mid in l["tm"] + l["egg"] + l["tutor"]:
        if mid not in mv_ids: errors.append(f"Learnset {l['speciesId']}: TM/egg/tutor move {mid} not in moves")
if ls_ids != sp_ids: errors.append(f"learnset species mismatch: {sorted(sp_ids - ls_ids)} missing")
for e in evolutions:
    if e["fromId"] not in sp_ids: errors.append(f"Evolution from {e['fromId']} not in species")
    if e["toId"] not in sp_ids: errors.append(f"Evolution to {e['toId']} not in species")
for t in trainers:
    for p in t["party"]:
        if p["speciesId"] not in sp_ids: errors.append(f"Trainer {t['id']}: species {p['speciesId']} not in species")
        for mid in p["moves"]:
            if mid not in mv_ids: errors.append(f"Trainer {t['id']}: move {mid} not in moves")
for t in encounters:
    if sum(s["weight"] for s in t["slots"]) != 100: errors.append(f"Encounters {t['mapId']}/{t['method']}: weights != 100")
    for s in t["slots"]:
        if s["speciesId"] not in sp_ids: errors.append(f"Encounters {t['mapId']}: species {s['speciesId']} not in species")
        if s["minLevel"] > s["maxLevel"]: errors.append(f"Encounters {t['mapId']}: min>max level")
print(f"species: {len(species)}/47  moves: {len(moves)}  learnsets: {len(learnsets)}/47 "
      f"(verified {sum(1 for l in learnsets if l['source'].startswith('species.ts'))}, "
      f"provisional {sum(1 for l in learnsets if l['source'].startswith('provisional'))})  "
      f"evolutions: {len(evolutions)}  trainers: {len(trainers)}  encounter tables: {len(encounters)}")
print(f"dexText present: {sum(1 for s in species if s['dexText'])}/47  "
      f"abilities present: {sum(1 for s in species if s['abilities'])}/47  "
      f"TM/egg/tutor present: {sum(1 for l in learnsets if l['tm'] or l['egg'] or l['tutor'])}/47")
print(f"Warnings ({len(warnings)}):")
for x in sorted(set(warnings)): print(f"  WARN: {x}")
if errors:
    print(f"ERRORS ({len(errors)}):")
    for e in errors: print(f"  ERROR: {e}")
    sys.exit(1)
print("validate_data_core PASSED (warnings are open decisions, not failures).")
