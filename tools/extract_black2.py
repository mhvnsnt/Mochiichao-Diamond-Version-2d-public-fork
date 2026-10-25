#!/usr/bin/env python3
"""Convert Black 2/White 2 decomp species JSON into neutral generated JSON.

Source: pokebw2/res/pokemon/*/data.json (fuddlesworth/pokebw2, WIP decomp)
Output: src/lib/generated/decomp_black2_species.json

No Mochiichao conversion here; source fields are preserved, with a
sourceConstant added (SPECIES_<UPPER_SNAKE_NAME>).
Cross-check: Bulbasaur base stats must match FireRed/HeartGold
(45/49/49/45/65/65).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BW2 = ROOT / "pokebw2/res/pokemon"
OUT = ROOT / "src/lib/generated/decomp_black2_species.json"


def main():
    species = []
    missing = []
    for d in sorted(BW2.iterdir()):
        if not d.is_dir():
            continue
        p = d / "data.json"
        if not p.exists():
            missing.append(d.name)
            continue
        entry = json.loads(p.read_text())
        bs = entry.get("base_stats", {})
        species.append({
            "sourceDir": d.name,
            "sourceConstant": f"SPECIES_{d.name.upper()}",
            "name": entry.get("name"),
            "base_stats": bs,
            "types": entry.get("types"),
            "catch_rate": entry.get("catch_rate"),
            "evolution_stage": entry.get("evolution_stage"),
            "ev_yields": entry.get("ev_yields"),
        })
    bulba = next(s for s in species if s["name"] == "Bulbasaur")
    assert (bulba["base_stats"]["hp"], bulba["base_stats"]["attack"], bulba["base_stats"]["defense"], bulba["base_stats"]["speed"], bulba["base_stats"]["special_attack"], bulba["base_stats"]["special_defense"]) == (45, 49, 49, 45, 65, 65), bulba
    payload = {
        "source": "pokebw2/res/pokemon/*/data.json",
        "sourceRepo": "fuddlesworth/pokebw2",
        "sourceCommit": "e522642f9ec496783642df075f05fcd07d3cbc1b",
        "note": "pokebw2 is a WIP decomp; this is its res/ species data as checked out after the 2026-10-25 restore (git status clean).",
        "count": len(species),
        "dirsWithoutDataJson": missing,
        "crossCheck": "Bulbasaur matches FireRed/HeartGold: 45/49/49/45/65/65",
        "species": species,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"black2 species: {len(species)}, dirs without data.json: {missing}")
    print("BULBASAUR:", bulba)


if __name__ == "__main__":
    main()
