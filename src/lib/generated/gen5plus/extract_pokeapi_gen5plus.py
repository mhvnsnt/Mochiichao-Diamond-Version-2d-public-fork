#!/usr/bin/env python3
"""Extract Gen 5+ reference DATA SHAPES from PokeAPI CSV data (BSD-3-Clause).

Source: ~/workspace/mochiichao-work/gen5plus/pokeapi-src/data/v2/csv/
  (PokeAPI/pokeapi, sparse checkout of data/v2/csv only — no sprites,
   no sprite URLs, no game art, no code vendored into the game repo.)

Scope: pokemon_species with generation_id >= 5 (Gen 5 Unova through Gen 9).
  Species IDs 494-1025 in this dataset (532 species).
  Default pokemon forms only (pokemon.is_default=1) to avoid form duplicates.
  Moves: union of (a) moves introduced in Gen 5+ and (b) moves appearing in
  Gen 5+ level-up learnsets. Learnsets: level-up method only (method 1),
  deduplicated per pokemon/move keeping the minimum level across version
  groups, and recording the version-group count as a shape note.
  Evolutions: pokemon_evolution rows whose evolved species is Gen 5+.

Output: gen5plus_species.json, gen5plus_moves.json, gen5plus_learnsets.json,
  gen5plus_evolutions.json — all in this directory, local only, NOT a repo PR.
  Pokemon names/types are REFERENCE data only. They are NOT Mochiichao canon:
  Mochiichao uses its own 12 True Elements and roster IDs 001-046+331, and
  no Pokemon type/name is mapped to a Mochiichao element or roster slot here.
"""
import csv, json, os, sys
from collections import defaultdict

CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "pokeapi-src", "data", "v2", "csv")

def read(name):
    with open(os.path.join(CSV, name), newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

def to_int(v):
    try:
        return int(v) if v not in ('', None) else None
    except ValueError:
        return None

species_rows = read("pokemon_species.csv")
pokemon_rows = read("pokemon.csv")
stats_rows = read("pokemon_stats.csv")
types_rows = read("pokemon_types.csv")
moves_rows = read("moves.csv")
pmoves_rows = read("pokemon_moves.csv")
evo_rows = read("pokemon_evolution.csv")

type_names = {int(r["id"]): r["identifier"] for r in read("types.csv")}
dmg_names = {int(r["id"]): r["identifier"] for r in read("move_damage_classes.csv")}
stat_names = {1: "hp", 2: "attack", 3: "defense", 4: "special_attack",
              5: "special_defense", 6: "speed"}
trigger_names = {int(r["id"]): r["identifier"] for r in read("evolution_triggers.csv")}
item_names = {}
try:
    item_names = {int(r["id"]): r["identifier"] for r in read("items.csv")}
except FileNotFoundError:
    pass

gen5_species = [r for r in species_rows if to_int(r["generation_id"]) and to_int(r["generation_id"]) >= 5]
gen5_species_ids = {int(r["id"]) for r in gen5_species}
species_by_id = {int(r["id"]): r for r in gen5_species}

# default pokemon per species
default_pokemon = {}
for r in pokemon_rows:
    sid = to_int(r["species_id"])
    if sid in gen5_species_ids and r["is_default"] == "1":
        default_pokemon[sid] = int(r["id"])
pokemon_to_species = {pid: sid for sid, pid in default_pokemon.items()}

# base stats + types for default pokemon
stats = defaultdict(dict)
for r in stats_rows:
    pid = int(r["pokemon_id"])
    if pid in pokemon_to_species:
        sid_stat = to_int(r["stat_id"])
        if sid_stat in stat_names:
            stats[pid][stat_names[sid_stat]] = int(r["base_stat"])
ptypes = defaultdict(list)
for r in types_rows:
    pid = int(r["pokemon_id"])
    if pid in pokemon_to_species:
        ptypes[pid].append((int(r["slot"]), type_names.get(int(r["type_id"]), f"type_{r['type_id']}")))
for pid in ptypes:
    ptypes[pid] = [name for _, name in sorted(ptypes[pid])]

species_out = []
unresolved_species = []
for r in gen5_species:
    sid = int(r["id"])
    pid = default_pokemon.get(sid)
    if pid is None:
        unresolved_species.append({"species_id": sid, "name": r["identifier"], "reason": "no default pokemon form"})
        continue
    s = stats.get(pid, {})
    missing = [k for k in ("hp", "attack", "defense", "special_attack", "special_defense", "speed") if k not in s]
    if missing:
        unresolved_species.append({"species_id": sid, "name": r["identifier"], "reason": f"missing stats {missing}"})
    species_out.append({
        "pokeapi_species_id": sid,
        "name": r["identifier"],
        "generation": int(r["generation_id"]),
        "default_pokemon_id": pid,
        "base_stats": {k: s.get(k) for k in ("hp", "attack", "defense", "special_attack", "special_defense", "speed")},
        "pokemon_types": ptypes.get(pid, []),
        "evolves_from_species_id": to_int(r["evolves_from_species_id"]),
        "evolution_chain_id": to_int(r["evolution_chain_id"]),
        "_note": "REFERENCE ONLY — pokemon type names are not Mochiichao elements; no roster mapping applied.",
    })
species_out.sort(key=lambda x: x["pokeapi_species_id"])

# moves table
moves_by_id = {}
for r in moves_rows:
    moves_by_id[int(r["id"])] = {
        "pokeapi_move_id": int(r["id"]),
        "name": r["identifier"],
        "introduced_generation": to_int(r["generation_id"]),
        "pokemon_type": type_names.get(to_int(r["type_id"]), f"type_{r['type_id']}"),
        "power": to_int(r["power"]),
        "pp": to_int(r["pp"]),
        "accuracy": to_int(r["accuracy"]),
        "priority": to_int(r["priority"]),
        "damage_class": dmg_names.get(to_int(r["damage_class_id"]), None),
        "effect_chance": to_int(r["effect_chance"]),
    }

# level-up learnsets for Gen 5+ default pokemon
learnsets = defaultdict(dict)  # pid -> move_id -> {level, version_groups}
unresolved_moves = set()
for r in pmoves_rows:
    pid = int(r["pokemon_id"])
    if pid not in pokemon_to_species:
        continue
    if r["pokemon_move_method_id"] != "1":  # level-up only
        continue
    mid = int(r["move_id"])
    if mid not in moves_by_id:
        unresolved_moves.add(mid)
        continue
    lvl = to_int(r["level"])
    entry = learnsets[pid].get(mid)
    if entry is None:
        learnsets[pid][mid] = {"level": lvl, "version_groups": 1}
    else:
        if lvl is not None and (entry["level"] is None or lvl < entry["level"]):
            entry["level"] = lvl
        entry["version_groups"] += 1

learnsets_out = {}
total_level_entries = 0
for pid in sorted(learnsets):
    sid = pokemon_to_species[pid]
    lst = [{"move_id": mid, "move_name": moves_by_id[mid]["name"], "level": v["level"],
            "version_groups_seen": v["version_groups"]}
           for mid, v in sorted(learnsets[pid].items(), key=lambda kv: (kv[1]["level"] is None, kv[1]["level"] or 0, kv[0]))]
    learnsets_out[str(sid)] = lst
    total_level_entries += len(lst)

referenced_move_ids = {mid for pid in learnsets for mid in learnsets[pid]}
gen5plus_move_ids = {mid for mid, m in moves_by_id.items()
                     if m["introduced_generation"] and m["introduced_generation"] >= 5}
moves_out_ids = sorted(referenced_move_ids | gen5plus_move_ids)
moves_out = [moves_by_id[mid] for mid in moves_out_ids]

# evolutions for Gen 5+ evolved species
evo_out = []
unresolved_evo = []
for r in evo_rows:
    evolved = to_int(r["evolved_species_id"])
    if evolved not in gen5_species_ids:
        continue
    # evolves_from is in species table
    src = species_by_id.get(evolved, {})
    evo_out.append({
        "evolved_species_id": evolved,
        "evolved_species_name": src.get("identifier"),
        "evolves_from_species_id": to_int(src.get("evolves_from_species_id")) if src else None,
        "evolution_chain_id": to_int(src.get("evolution_chain_id")) if src else None,
        "trigger": trigger_names.get(to_int(r["evolution_trigger_id"]), f"trigger_{r['evolution_trigger_id']}"),
        "minimum_level": to_int(r["minimum_level"]),
        "trigger_item": item_names.get(to_int(r["trigger_item_id"])) if to_int(r["trigger_item_id"]) else None,
        "minimum_happiness": to_int(r["minimum_happiness"]),
        "time_of_day": r["time_of_day"] or None,
        "known_move_id": to_int(r["known_move_id"]),
        "known_move_name": moves_by_id[to_int(r["known_move_id"])]["name"] if to_int(r["known_move_id"]) and to_int(r["known_move_id"]) in moves_by_id else None,
    })
    if to_int(r["known_move_id"]) and to_int(r["known_move_id"]) not in moves_by_id:
        unresolved_evo.append({"evolved_species_id": evolved, "reason": f"known_move {r['known_move_id']} not in moves.csv"})
evo_out.sort(key=lambda x: (x["evolved_species_id"], x["trigger"]))

outdir = os.path.dirname(os.path.abspath(__file__))
def dump(name, obj):
    with open(os.path.join(outdir, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, sort_keys=False)
    print(f"{name}: {len(obj) if isinstance(obj, (list, dict)) else obj}")

dump("gen5plus_species.json", species_out)
dump("gen5plus_moves.json", moves_out)
dump("gen5plus_learnsets.json", learnsets_out)
dump("gen5plus_evolutions.json", evo_out)

summary = {
    "source": "PokeAPI/pokeapi data/v2/csv (BSD-3-Clause code; data/trademarks separate)",
    "scope": "pokemon_species generation_id >= 5 (Gen 5-9)",
    "species_in_scope": len(gen5_species),
    "species_extracted": len(species_out),
    "species_with_default_pokemon": len(default_pokemon),
    "unresolved_species": unresolved_species,
    "moves_in_moves_csv_total": len(moves_by_id),
    "moves_introduced_gen5plus": len(gen5plus_move_ids),
    "moves_referenced_by_gen5plus_level_learnsets": len(referenced_move_ids),
    "moves_output_union": len(moves_out),
    "learnset_species_with_level_moves": len(learnsets_out),
    "learnset_level_entries_deduplicated": total_level_entries,
    "unresolved_learnset_move_ids": sorted(unresolved_moves),
    "evolutions_gen5plus": len(evo_out),
    "unresolved_evolutions": unresolved_evo,
}
dump("gen5plus_summary.json", summary)
print(json.dumps(summary, indent=2))
