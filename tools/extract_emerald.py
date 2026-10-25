#!/usr/bin/env python3
"""Extract pret/pokeemerald data shapes into neutral JSON (local only).

Source clone: ~/workspace/mochiichao-work/decomps/pokeemerald (shallow clone,
commit recorded in output). Output: ~/workspace/mochiichao-work/extractions/
emerald/*.json — NOT in the game repo yet; a later PR batch decides that.

Treatment (per task): submodule reference + neutral JSON of data shapes
only. No pret code/text/music/sprites vendored, no ROM built here.
Format notes vs FireRed:
- species_info.h / battle_moves.h: same field style as FireRed.
- TM/HM: Emerald stores a bitfield of move names (.TOXIC = TRUE), NOT a
  TMxx machine list. Output records move names directly, with that note.
- Tutor: TUTOR(MOVE_X) list per species.
- Trainers: 4 party struct variants (NoItem/Item x Default/Custom moves).
- Encounters: source wild_encounters.json is already JSON; output is a
  summary + species-reference validation, not a copy of the whole file.
Validation: every move/species reference must resolve against the
Emerald species/moves extracted in this same run; unresolved are listed,
never dropped. Bulbasaur cross-checks vs FireRed are printed, not asserted
as identical (Emerald learnsets differ from FireRed by design).
"""
import json, re, sys
from pathlib import Path

EM = Path.home() / "workspace/mochiichao-work/decomps/pokeemerald"
FR = Path.home() / "workspace/mochiichao-work/fresh-start/src/lib/generated"
OUT = Path.home() / "workspace/mochiichao-work/extractions/emerald"
OUT.mkdir(parents=True, exist_ok=True)
SPECIAL = {"FIRE", "WATER", "GRASS", "ELECTRIC", "PSYCHIC", "ICE", "DRAGON", "DARK"}

def dump(name, payload):
    p = OUT / name
    p.write_text(json.dumps(payload, indent=2) + "\n")
    return p

def camel(name):
    s = re.sub(r"(?<=[a-z])(?=[A-Z])", "_", name)
    s = re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])", "_", s)
    return s.upper()

# ---- species ----
text = (EM / "src/data/pokemon/species_info.h").read_text()
starts = list(re.finditer(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{", text))
species = []
for i, m in enumerate(starts):
    if m.group(1) == "NONE":
        continue
    end = starts[i+1].start() if i+1 < len(starts) else len(text)
    block = text[m.end():end]
    e = {"sourceConstant": f"SPECIES_{m.group(1)}"}
    for f in ["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense","catchRate","expYield"]:
        mm = re.search(rf"\.{f}\s*=\s*(\d+)", block)
        if mm: e[f] = int(mm.group(1))
    mm = re.search(r"\.types\s*=\s*\{([^}]+)\}", block)
    if mm: e["types"] = [t.strip().replace("TYPE_","") for t in mm.group(1).split(",")]
    mm = re.search(r"\.abilities\s*=\s*\{([^}]+)\}", block)
    if mm: e["abilities"] = [a.strip().replace("ABILITY_","") for a in mm.group(1).split(",")]
    mm = re.search(r"\.eggGroups\s*=\s*\{([^}]+)\}", block)
    if mm: e["eggGroups"] = [g.strip().replace("EGG_GROUP_","") for g in mm.group(1).split(",")]
    mm = re.search(r"\.growthRate\s*=\s*([A-Z0-9_]+)", block)
    if mm: e["growthRate"] = mm.group(1)
    species.append(e)
sp_set = {e["sourceConstant"] for e in species}
dump("decomp_emerald_species.json", {"source":"pokeemerald/src/data/pokemon/species_info.h","sourceRepo":"pret/pokeemerald","count":len(species),"notes":"Neutral intermediate JSON. No Mochiichao conversion.","species":species})
print("species:", len(species))
bulba = next(e for e in species if e["sourceConstant"]=="SPECIES_BULBASAUR")
print("BULBASAUR:", bulba)
assert bulba["baseHP"]==45 and bulba["baseAttack"]==49 and bulba["baseSpAttack"]==65

# ---- moves ----
text = (EM / "src/data/battle_moves.h").read_text()
starts = list(re.finditer(r"\[MOVE_([A-Z0-9_]+)\]\s*=\s*\{", text))
moves = []
for i, m in enumerate(starts):
    if m.group(1) == "NONE":
        continue
    end = starts[i+1].start() if i+1 < len(starts) else len(text)
    block = text[m.end():end]
    e = {"sourceConstant": f"MOVE_{m.group(1)}"}
    for f in ["power","accuracy","pp","secondaryEffectChance","priority"]:
        mm = re.search(rf"\.{f}\s*=\s*(-?\d+)", block)
        if mm: e[f] = int(mm.group(1))
    for f, prefix in [("effect","EFFECT_"),("type","TYPE_"),("target","MOVE_TARGET_")]:
        mm = re.search(rf"\.{f}\s*=\s*([A-Z0-9_]+)", block)
        if mm: e[f] = mm.group(1).replace(prefix,"")
    mm = re.search(r"\.flags\s*=\s*([^,\n]+)", block)
    if mm:
        fl = mm.group(1).strip()
        e["flags"] = [] if fl=="0" else [x.strip().replace("FLAG_","") for x in fl.split("|")]
    e["derivedCategory"] = "Status" if e.get("power",0)==0 else ("Special" if e.get("type") in SPECIAL else "Physical")
    moves.append(e)
mv_set = {m["sourceConstant"] for m in moves}
dump("decomp_emerald_moves.json", {"source":"pokeemerald/src/data/battle_moves.h","sourceRepo":"pret/pokeemerald","count":len(moves),"categoryDerivation":"Gen 3 has no category field. power 0 = Status; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special; otherwise Physical. Recorded as derivedCategory only.","moves":moves})
print("moves:", len(moves))
pound = next(m for m in moves if m["sourceConstant"]=="MOVE_POUND")
print("POUND:", pound); assert pound["power"]==40 and pound["derivedCategory"]=="Physical"

# ---- level-up learnsets ----
text = (EM / "src/data/pokemon/level_up_learnsets.h").read_text()
learnsets, un_sp, un_mv, total = {}, set(), set(), 0
for name, block in re.findall(r"static const u16 s(\w+)LevelUpLearnset\[\] = \{(.*?)\n\};", text, re.S):
    const = f"SPECIES_{camel(name)}"
    entries = []
    for lvl, mv in re.findall(r"LEVEL_UP_MOVE\(\s*(\d+),\s*(MOVE_[A-Z0-9_]+)\)", block):
        total += 1
        if mv not in mv_set: un_mv.add(mv)
        entries.append({"level": int(lvl), "move": mv})
    if const not in sp_set: un_sp.add(const)
    learnsets[const] = entries
# note: SPECIES_SPECIES252-276 are the same 25 decomp placeholder slots
# flagged in FireRed (sSpecies252LevelUpLearnset etc.), not real species.
dump("decomp_emerald_learnsets.json", {"source":"pokeemerald/src/data/pokemon/level_up_learnsets.h","sourceRepo":"pret/pokeemerald","speciesWithLearnsets":len(learnsets),"totalLevelUpMoves":total,"unresolvedSpecies":sorted(un_sp),"unresolvedMoves":sorted(un_mv),"learnsets":learnsets})
print("level-up:", len(learnsets), "species,", total, "moves, unresolved species:", sorted(un_sp), "moves:", sorted(un_mv))
print("BULBASAUR learnset:", learnsets.get("SPECIES_BULBASAUR"))

# ---- TM/HM (move-name bitfield) ----
text = (EM / "src/data/pokemon/tmhm_learnsets.h").read_text()
tmhm, un_tm, total_tm = {}, set(), 0
for name, block in re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{\s*\.learnset\s*=\s*\{(.*?)\}\s*,?\s*\}", text, re.S):
    const = f"SPECIES_{name}"
    entries = []
    for mvname in re.findall(r"\.([A-Z0-9_]+)\s*=\s*TRUE", block):
        total_tm += 1
        mv = f"MOVE_{mvname}"
        if mv not in mv_set: un_tm.add(mv)
        entries.append({"move": mv})
    if entries: tmhm[const] = entries
dump("decomp_emerald_tmhm_learnsets.json", {"source":"pokeemerald/src/data/pokemon/tmhm_learnsets.h","sourceRepo":"pret/pokeemerald","formatNote":"Emerald TM/HM is a bitfield of move names (.TOXIC = TRUE), NOT a TMxx machine list as in FireRed. Output records move names directly.","speciesWithTMHM":len(tmhm),"totalTMHMEntries":total_tm,"unresolvedMoves":sorted(un_tm),"learnsets":tmhm})
print("TM/HM:", len(tmhm), "species,", total_tm, "entries, unresolved:", sorted(un_tm))

# ---- tutor ----
text = (EM / "src/data/pokemon/tutor_learnsets.h").read_text()
tutor, un_tu, total_tu = {}, set(), 0
# sTutorLearnsets section only (after that marker)
tutor_sec = text.split("sTutorLearnsets[]")[-1]
for name, block in re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\((.*?)\)\s*,", tutor_sec, re.S):
    const = f"SPECIES_{name}"
    entries = []
    for mv in re.findall(r"TUTOR\((MOVE_[A-Z0-9_]+)\)", block):
        total_tu += 1
        if mv not in mv_set: un_tu.add(mv)
        entries.append({"move": mv})
    if entries: tutor[const] = entries
dump("decomp_emerald_tutor_learnsets.json", {"source":"pokeemerald/src/data/pokemon/tutor_learnsets.h","sourceRepo":"pret/pokeemerald","speciesWithTutor":len(tutor),"totalTutorEntries":total_tu,"unresolvedMoves":sorted(un_tu),"learnsets":tutor})
print("tutor:", len(tutor), "species,", total_tu, "entries, unresolved:", sorted(un_tu))

# ---- egg moves ----
text = (EM / "src/data/pokemon/egg_moves.h").read_text()
egg, un_eg, total_eg = {}, set(), 0
for sp, block in re.findall(r"egg_moves\(([A-Z0-9_]+),\s*(.*?)\)\s*,", text, re.S):
    const = f"SPECIES_{sp}"
    entries = []
    for mv in re.findall(r"(MOVE_[A-Z0-9_]+)", block):
        total_eg += 1
        if mv not in mv_set: un_eg.add(mv)
        entries.append({"move": mv})
    if const not in sp_set: un_eg.add(const)  # reuse set? keep separate below
    egg[const] = entries
# recompute unresolved species properly
un_eg_sp = sorted({c for c in egg if c not in sp_set})
un_eg_mv = sorted({e["move"] for v in egg.values() for e in v if e["move"] not in mv_set})
dump("decomp_emerald_egg_learnsets.json", {"source":"pokeemerald/src/data/pokemon/egg_moves.h","sourceRepo":"pret/pokeemerald","speciesWithEggMoves":len(egg),"totalEggMoves":total_eg,"unresolvedSpecies":un_eg_sp,"unresolvedMoves":un_eg_mv,"learnsets":egg})
print("egg:", len(egg), "species,", total_eg, "moves, unresolved species:", un_eg_sp, "moves:", un_eg_mv)

# ---- evolutions ----
text = (EM / "src/data/pokemon/evolution.h").read_text()
evos, un_ev, total_ev = {}, set(), 0
for name, inner in re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{\{(.*?)\}\},?", text, re.S):
    const = f"SPECIES_{name}"
    entries = []
    for method, param, target in re.findall(r"EVO_([A-Z_]+),\s*([^,]+),\s*(SPECIES_[A-Z0-9_]+)", inner):
        total_ev += 1
        if target not in sp_set: un_ev.add(target)
        entries.append({"method": method, "param": param.strip(), "target": target})
    if entries: evos[const] = entries
dump("decomp_emerald_evolutions.json", {"source":"pokeemerald/src/data/pokemon/evolution.h","sourceRepo":"pret/pokeemerald","speciesWithEvolutions":len(evos),"totalEvolutions":total_ev,"unresolvedTargets":sorted(un_ev),"note":"Methods preserved exactly.","evolutions":evos})
print("evolutions:", len(evos), "species,", total_ev, "evolutions, unresolved:", sorted(un_ev))
print("BULBASAUR evo:", evos.get("SPECIES_BULBASAUR"), "EEVEE:", evos.get("SPECIES_EEVEE"))
assert evos["SPECIES_BULBASAUR"] == [{"method":"LEVEL","param":"16","target":"SPECIES_IVYSAUR"}]

# ---- trainers + parties ----
parties_text = (EM / "src/data/trainer_parties.h").read_text()
parties = {}
for pname, block in re.findall(r"static const struct TrainerMon\w+ (sParty_\w+)\[\] = \{(.*?)\n\};", parties_text, re.S):
    mons = []
    for mon in re.findall(r"\{\s*(.*?)\s*\}", block, re.S):
        sp = re.search(r"\.species\s*=\s*(SPECIES_[A-Z0-9_]+)", mon)
        lvl = re.search(r"\.lvl\s*=\s*(\d+)", mon)
        iv = re.search(r"\.iv\s*=\s*(\d+)", mon)
        held = re.search(r"\.heldItem\s*=\s*(ITEM_[A-Z0-9_]+)", mon)
        mvlist = re.findall(r"MOVE_[A-Z0-9_]+", mon)
        # moves field is .moves = {MOVE_...}; filter out species-like matches (none start MOVE_)
        mons.append({"species": sp.group(1) if sp else None, "level": int(lvl.group(1)) if lvl else None, "iv": int(iv.group(1)) if iv else None, "heldItem": held.group(1) if held else None, "moves": mvlist})
    parties[pname] = mons
trainers_text = (EM / "src/data/trainers.h").read_text()
trainers, un_tr, total_party = [], set(), 0
for tname, block in re.findall(r"\[TRAINER_([A-Z0-9_]+)\]\s*=\s*\{(.*?)\n    \},", trainers_text, re.S):
    if tname == "NONE": continue
    cls = re.search(r"\.trainerClass\s*=\s*(TRAINER_CLASS_[A-Z0-9_]+)", block)
    nm = re.search(r"\.trainerName\s*=\s*_\(\"([^\"]*)\"\)", block)
    party_ref = re.search(r"\.party\s*=\s*[A-Z_]*\(?(sParty_\w+)\)?", block)
    party = parties.get(party_ref.group(1), []) if party_ref else []
    for mon in party:
        total_party += 1
        if mon["species"] not in sp_set: un_tr.add(mon["species"])
        for mv in mon["moves"]:
            if mv not in mv_set and mv != "MOVE_NONE": un_tr.add(mv)
        # MOVE_NONE = empty move slot in custom parties (68 slots), a sentinel
    trainers.append({"sourceConstant": f"TRAINER_{tname}", "trainerClass": cls.group(1) if cls else None, "trainerName": nm.group(1) if nm else None, "partyRef": party_ref.group(1) if party_ref else None, "party": party})
dump("decomp_emerald_trainers.json", {"source":"pokeemerald/src/data/trainers.h + src/data/trainer_parties.h","sourceRepo":"pret/pokeemerald","trainerCount":len(trainers),"totalPartyMembers":total_party,"unresolvedPartySpeciesOrMoves":sorted(x for x in un_tr if x),"trainers":trainers})
print("trainers:", len(trainers), "party members:", total_party, "unresolved:", sorted(un_tr))

# ---- encounters (summary + validation from wild_encounters.json) ----
enc = json.loads((EM / "src/data/wild_encounters.json").read_text())
groups = enc.get("wild_encounter_groups", [])
maps = 0; enc_species = set(); entries_total = 0
for g in groups:
    for mon in g.get("mons", []) if isinstance(g, dict) else []:
        pass
# wild_encounters.json structure: groups -> encounters (per map) -> mons with species
def walk(o):
    global entries_total
    if isinstance(o, dict):
        if "species" in o and isinstance(o["species"], str):
            enc_species.add(o["species"]); entries_total += 1
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(enc)
# count map entries: encounters arrays length
map_count = 0
for g in groups:
    for enc_entry in g.get("encounters", []) if isinstance(g, dict) else []:
        map_count += 1
un_enc = sorted({s for s in enc_species if f"SPECIES_{s}" not in sp_set and s not in sp_set})
dump("decomp_emerald_encounters.json", {"source":"pokeemerald/src/data/wild_encounters.json","sourceRepo":"pret/pokeemerald","note":"Summary + species validation only; full wild_encounters.json remains in the decomp clone, not copied here.","wildEncounterGroups":len(groups),"mapEncounterEntries":map_count,"encounterSpeciesEntries":entries_total,"distinctEncounterSpecies":len(enc_species),"unresolvedEncounterSpecies":un_enc,"encounterSpecies":sorted(enc_species)})
print("encounters: groups", len(groups), "map entries", map_count, "species entries", entries_total, "distinct", len(enc_species), "unresolved", un_enc)

# ---- FireRed cross-check (read-only) ----
fr_sp = {e["sourceConstant"]: e for e in json.loads((FR/"decomp_firered_species.json").read_text())["species"]}
fr_mv = {m["sourceConstant"]: m for m in json.loads((FR/"decomp_firered_moves.json").read_text())["moves"]}
same_stats = sum(1 for c in sp_set if c in fr_sp and all(fr_sp[c].get(k)==next(e for e in species if e["sourceConstant"]==c).get(k) for k in ["baseHP","baseAttack","baseDefense","baseSpeed","baseSpAttack","baseSpDefense"]))
print("cross-check: Emerald species also in FireRed:", len(sp_set & set(fr_sp)), "with identical 6 base stats:", same_stats)
print("cross-check: Emerald moves also in FireRed:", len(mv_set & set(fr_mv)), "of", len(mv_set))
print("DONE")
