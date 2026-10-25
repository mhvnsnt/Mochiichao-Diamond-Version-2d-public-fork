#!/usr/bin/env python3
"""Convert HeartGold/SoulSilver decomp JSON into neutral generated JSON.

Sources (pokeheartgold submodule, pret/pokeheartgold):
  files/poketool/personal/personal.json  (baseStats list)
  files/poketool/personal/evo.json       (evoTable list)
  files/poketool/trainer/trainers.json   (counted only in this pass)

Outputs:
  src/lib/generated/decomp_heartgold_species.json
  src/lib/generated/decomp_heartgold_evolutions.json

No Mochiichao conversion here; source constants and fields are preserved.
Cross-check: Bulbasaur base stats must match the FireRed extraction
(45/49/49/45/65/65) — if they disagree, this script fails loudly.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HG = ROOT / "pokeheartgold/files/poketool"
OUTDIR = ROOT / "src/lib/generated"


def main():
    personal = json.loads((HG / "personal/personal.json").read_text())
    evo = json.loads((HG / "personal/evo.json").read_text())
    trainers = json.loads((HG / "trainer/trainers.json").read_text())
    base = personal["baseStats"]
    species = []
    for entry in base:
        if entry.get("species") == "NONE":
            continue
        e = dict(entry)
        e["sourceConstant"] = f"SPECIES_{entry['species']}"
        species.append(e)
    bulba = next(s for s in species if s["sourceConstant"] == "SPECIES_BULBASAUR")
    assert (bulba["hp"], bulba["atk"], bulba["def"], bulba["speed"], bulba["spatk"], bulba["spdef"]) == (45, 49, 49, 45, 65, 65), bulba
    species_payload = {
        "source": "pokeheartgold/files/poketool/personal/personal.json",
        "sourceRepo": "pret/pokeheartgold",
        "count": len(species),
        "rawEntriesIncludingNone": len(base),
        "trainerCountNoted": len(trainers["trainers"]),
        "crossCheck": "Bulbasaur matches FireRed extraction: 45/49/49/45/65/65",
        "species": species,
    }
    (OUTDIR / "decomp_heartgold_species.json").write_text(json.dumps(species_payload, indent=2) + "\n")
    evos = {}
    total = 0
    for row in evo["evoTable"]:
        if row.get("evos"):
            evos[row["baseSpecies"]] = row["evos"]
            total += len(row["evos"])
    assert evos["SPECIES_BULBASAUR"] == [{"method": "EVO_LEVEL", "param": 16, "target": "SPECIES_IVYSAUR"}]
    evo_payload = {
        "source": "pokeheartgold/files/poketool/personal/evo.json",
        "sourceRepo": "pret/pokeheartgold",
        "speciesWithEvolutions": len(evos),
        "totalEvolutions": total,
        "evolutions": evos,
    }
    (OUTDIR / "decomp_heartgold_evolutions.json").write_text(json.dumps(evo_payload, indent=2) + "\n")
    print(f"heartgold species: {len(species)} (raw {len(base)}), evolutions: {len(evos)} species, {total} evolutions, trainers noted: {len(trainers['trainers'])}")


if __name__ == "__main__":
    main()
