#!/usr/bin/env python3
"""Parse FireRed/LeafGreen level-up learnsets into neutral JSON.

Source: pokefirered-leafgreen/src/data/pokemon/level_up_learnsets.h
Output: src/lib/generated/decomp_firered_learnsets.json

Validation done here, not silently: every move must resolve against
decomp_firered_moves.json, and every species learnset name must resolve
against decomp_firered_species.json where a matching name exists.
Unresolved entries are reported in the output as unresolved[], never dropped.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pokefirered-leafgreen/src/data/pokemon/level_up_learnsets.h"
OUT = ROOT / "src/lib/generated/decomp_firered_learnsets.json"
SPECIES = ROOT / "src/lib/generated/decomp_firered_species.json"
MOVES = ROOT / "src/lib/generated/decomp_firered_moves.json"


def camel_to_constant(name):
    # Bulbasaur -> BULBASAUR, MrMime -> MR_MIME handled by generic camel split
    s = re.sub(r"(?<=[a-z])(?=[A-Z])", "_", name)
    s = re.sub(r"(?<=[A-Z])(?=[A-Z][a-z])", "_", s)
    return s.upper()


def main():
    text = SRC.read_text()
    species = {e["sourceConstant"] for e in json.loads(SPECIES.read_text())["species"]}
    moves = {m["sourceConstant"] for m in json.loads(MOVES.read_text())["moves"]}
    pattern = re.compile(r"static const u16 s(\w+)LevelUpLearnset\[\] = \{(.*?)\n\};", re.S)
    learnsets = {}
    unresolved_species = []
    unresolved_moves = []
    total = 0
    for name, block in pattern.findall(text):
        const = f"SPECIES_{camel_to_constant(name)}"
        entries = []
        for lvl, move in re.findall(r"LEVEL_UP_MOVE\((\d+),\s*(MOVE_[A-Z0-9_]+)\)", block):
            total += 1
            if f"{move}" not in moves:
                unresolved_moves.append(move)
            entries.append({"level": int(lvl), "move": move})
        if const not in species:
            unresolved_species.append(const)
        learnsets[const] = entries
    payload = {
        "source": "pokefirered-leafgreen/src/data/pokemon/level_up_learnsets.h",
        "sourceRepo": "pret/pokefirered",
        "speciesWithLearnsets": len(learnsets),
        "totalLevelUpMoves": total,
        "unresolvedSpecies": sorted(set(unresolved_species)),
        "unresolvedMoves": sorted(set(unresolved_moves)),
        "learnsets": learnsets,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT}: {len(learnsets)} species, {total} moves")
    print("Bulbasaur:", learnsets.get("SPECIES_BULBASAUR"))
    print("unresolved species:", payload["unresolvedSpecies"][:20])
    print("unresolved moves:", payload["unresolvedMoves"][:20])
    assert learnsets["SPECIES_BULBASAUR"][0] == {"level": 1, "move": "MOVE_TACKLE"}
    assert len(learnsets["SPECIES_BULBASAUR"]) == 11


if __name__ == "__main__":
    main()
