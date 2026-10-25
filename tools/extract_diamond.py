#!/usr/bin/env python3
"""Extract neutral JSON data shapes from pret/pokediamond (Diamond, Gen 4).

Sources (all JSON, no binary parsing):
  files/poketool/personal/personal.json  - base stats + TM/HM numbers per species
  files/poketool/personal/evo.json       - evolutions
  files/poketool/personal/wotbl.json     - level-up learnsets
  files/poketool/waza/waza_tbl.json      - move data
  files/poketool/trainer/trdata.json     - trainers + parties
  include/constants/items.h              - TM01-92 / HM01-08 -> move mapping
NOT extracted (binary only): wild encounters (files/fielddata/encountdata/*/narc_*.bin),
egg-move table (no per-species egg table found in poketool JSON), move-tutor table
(Gen 4 tutors are NPC scripts, not a per-species table). Dialogue/names stripped
where applicable; data shapes only, no pret code/text/music/sprites.
"""
import json, re
from pathlib import Path

D = Path.home() / "workspace/mochiichao-work/decomps/pokediamond"
OUT = Path.home() / "workspace/mochiichao-work/extractions/diamond"
OUT.mkdir(parents=True, exist_ok=True)

def dump(name, obj):
    (OUT / name).write_text(json.dumps(obj, indent=2) + "\n")
    print(name, "->", OUT / name)

def strip(prefix, s):
    return s[len(prefix):] if s.startswith(prefix) else s

personal = json.load(open(D / "files/poketool/personal/personal.json"))["baseStats"]
evos = json.load(open(D / "files/poketool/personal/evo.json"))["evos"]
wotbl = json.load(open(D / "files/poketool/personal/wotbl.json"))["wotbl"]
waza = json.load(open(D / "files/poketool/waza/waza_tbl.json"))["waza_tbl"]
trdata = json.load(open(D / "files/poketool/trainer/trdata.json"))["trdata"]

# TM/HM mapping from items.h: #define TM_FOCUS_PUNCH ITEM_TM01 etc.
tm_map, hm_map = {}, {}
for line in open(D / "include/constants/items.h"):
    m = re.match(r"#define (TM|HM)_(\w+)\s+ITEM_(TM|HM)(\d+)", line)
    if m:
        kind, move, _, num = m.groups()
        (tm_map if kind == "TM" else hm_map)[int(num)] = "MOVE_" + move
assert len(tm_map) == 92, len(tm_map)
assert len(hm_map) == 8, len(hm_map)

species_names = [s["species"] for s in personal]
assert species_names[0] == "NONE" and species_names[1] == "BULBASAUR"
move_names = [m["name"] for m in waza]
assert move_names[0] == "MOVE_NONE" and move_names[1] == "MOVE_POUND"

species_set = set(species_names)
move_set = set(move_names)
unresolved = set()

# --- species ---
species = []
for s in personal:
    if s["species"] == "NONE":
        continue
    species.append({
        "sourceConstant": "SPECIES_" + s["species"],
        "baseHP": s["hp"], "baseAttack": s["atk"], "baseDefense": s["def"],
        "baseSpeed": s["speed"], "baseSpAttack": s["spatk"], "baseSpDefense": s["spdef"],
        "catchRate": s["catchRate"], "expYield": s["expYield"],
        "types": [strip("TYPE_", t) for t in s["types"]],
        "abilities": [strip("ABILITY_", a) for a in s["abilities"]],
        "eggGroups": [strip("EGG_GROUP_", g) for g in s["eggGroups"]],
        "growthRate": s["growthRate"],
    })
dump("decomp_diamond_species.json", {
    "source": "pokediamond/files/poketool/personal/personal.json",
    "sourceRepo": "pret/pokediamond",
    "sourceCommit": "b623abef",
    "count": len(species),
    "notes": "Neutral intermediate JSON. No Mochiichao conversion. 500 entries = 493 national species "
               "plus Deoxys (3 extra forms) and Wormadam (2 extra forms) plus 2 egg placeholders "
               "(EGG, MANAPHY_EGG, 10 in every stat, not battle species). NONE excluded.",
    "species": species})

# --- moves ---
moves = []
for m in waza:
    if m["name"] == "MOVE_NONE":
        continue
    moves.append({
        "sourceConstant": m["name"],
        "power": m["power"], "type": strip("TYPE_", m["type"]),
        "accuracy": m["accuracy"], "pp": m["pp"],
        "category": strip("CLASS_", m["class"]),
        "effect": m["effect"], "priority": m["priority"],
    })
dump("decomp_diamond_moves.json", {
    "source": "pokediamond/files/poketool/waza/waza_tbl.json",
    "sourceRepo": "pret/pokediamond", "sourceCommit": "b623abef",
    "count": len(moves), "moves": moves})

# --- level-up learnsets ---
learnsets, total_level = [], 0
for entry in wotbl:
    if entry["species"] == "NONE":
        continue
    lst = []
    for mv in entry["moves"]:
        # wotbl move tokens are bare (TACKLE); waza names carry MOVE_ prefix
        if ("MOVE_" + mv["move"]) not in move_set:
            unresolved.add("level:" + mv["move"])
        lst.append({"move": "MOVE_" + mv["move"] if not mv["move"].startswith("MOVE_") else mv["move"],
                    "level": mv["level"]})
    total_level += len(lst)
    learnsets.append({"species": "SPECIES_" + entry["species"], "moves": lst})
dump("decomp_diamond_learnsets.json", {
    "source": "pokediamond/files/poketool/personal/wotbl.json",
    "sourceRepo": "pret/pokediamond", "sourceCommit": "b623abef",
    "speciesCount": len(learnsets), "totalMoves": total_level,
    "unresolvedMoves": sorted(unresolved),
    "learnsets": learnsets})

# --- TM/HM learnsets ---
tmhm, total_tmhm = [], 0
for s in personal:
    if s["species"] == "NONE":
        continue
    entries = []
    for n in s["tms"]:
        mv = tm_map.get(n)
        if mv is None:
            unresolved.add(f"tm:{n}")
        else:
            entries.append({"machine": f"TM{n:02d}", "move": mv})
    for n in s["hms"]:
        mv = hm_map.get(n)
        if mv is None:
            unresolved.add(f"hm:{n}")
        else:
            entries.append({"machine": f"HM{n:02d}", "move": mv})
    total_tmhm += len(entries)
    tmhm.append({"species": "SPECIES_" + s["species"], "machines": entries})
dump("decomp_diamond_tmhm_learnsets.json", {
    "source": "pokediamond/files/poketool/personal/personal.json (tms/hms) + include/constants/items.h (TM/HM->move)",
    "sourceRepo": "pret/pokediamond", "sourceCommit": "b623abef",
    "speciesCount": len(tmhm), "totalEntries": total_tmhm,
    "tmCount": 92, "hmCount": 8,
    "unresolvedMoves": sorted(unresolved),
    "learnsets": tmhm})

# --- evolutions ---
evolutions, total_evo = [], 0
for entry in evos:
    if entry["species"] == "NONE":
        continue
    lst = []
    for e in entry["evos"]:
        if e["target"] not in species_set:
            unresolved.add("evo:" + e["target"])
        lst.append({"method": e["method"], "target": "SPECIES_" + e["target"], "param": e.get("param")})
    total_evo += len(lst)
    if lst:
        evolutions.append({"species": "SPECIES_" + entry["species"], "evolutions": lst})
dump("decomp_diamond_evolutions.json", {
    "source": "pokediamond/files/poketool/personal/evo.json",
    "sourceRepo": "pret/pokediamond", "sourceCommit": "b623abef",
    "speciesWithEvolutions": len(evolutions), "totalEvolutions": total_evo,
    "unresolvedTargets": sorted(x for x in unresolved if x.startswith("evo:")),
    "evolutions": evolutions})

# --- trainers ---
trainers, total_party = [], 0
for tr in trdata:
    if not tr["party"]:
        continue  # index-0 placeholder, no party
    party = []
    for mem in tr["party"]:
        sp = mem["species"]
        # trainer species carry SPECIES_ prefix; species_set holds bare names
        if strip("SPECIES_", sp) not in species_set:
            unresolved.add("trainer:" + sp)
        mv_list = []
        for mv in mem.get("moves") or []:
            if mv not in move_set:
                unresolved.add("trainer-move:" + mv)
            mv_list.append(mv)
        party.append({"species": sp, "level": mem["level"],
                      "item": mem.get("item"), "moves": mv_list})
    total_party += len(party)
    name = tr["name"].replace("{TRNAME}", "")
    trainers.append({"index": tr["index"], "name": name,
                     "trainerClass": tr["class"], "type": tr["type"],
                     "items": tr["items"], "doubleBattle": bool(tr["doubleBattle"]),
                     "party": party})
dump("decomp_diamond_trainers.json", {
    "source": "pokediamond/files/poketool/trainer/trdata.json",
    "sourceRepo": "pret/pokediamond", "sourceCommit": "b623abef",
    "note": "Dialogue messages stripped; data shapes only. Index-0 placeholder (empty party) excluded. "
            "No separate battle-facility set extracted here.",
    "trainerCount": len(trainers), "totalPartyMembers": total_party,
    "unresolvedPartySpeciesOrMoves": sorted(x for x in unresolved if x.startswith("trainer")),
    "trainers": trainers})

print("UNRESOLVED:", sorted(unresolved))
print(f"species={len(species)} moves={len(moves)} level={total_level} tmhm={total_tmhm} "
      f"evo_species={len(evolutions)} evo={total_evo} trainers={len(trainers)} party={total_party}")
bulb = [s for s in species if s["sourceConstant"] == "SPECIES_BULBASAUR"][0]
print("Bulbasaur:", bulb["baseHP"], bulb["baseAttack"], bulb["baseDefense"],
      bulb["baseSpeed"], bulb["baseSpAttack"], bulb["baseSpDefense"])
bulb_evo = [e for e in evolutions if e["species"] == "SPECIES_BULBASAUR"][0]
print("Bulbasaur evo:", bulb_evo)
