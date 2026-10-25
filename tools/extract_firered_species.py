#!/usr/bin/env python3
"""Parse FireRed/LeafGreen species_info.h into neutral JSON.

Source: pokefirered-leafgreen/src/data/pokemon/species_info.h
(submodule, pret/pokefirered, pinned in this repo).

Output: src/lib/generated/decomp_firered_species.json
Each entry preserves the source constant (e.g. SPECIES_BULBASAUR) and the
raw fields from the decomp. Nothing is converted to Mochiichao IDs here;
conversion is a separate, later step with its own provenance file.
Gen 3 has no physical/special category field — it is NOT invented here.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pokefirered-leafgreen/src/data/pokemon/species_info.h"
OUT = ROOT / "src/lib/generated/decomp_firered_species.json"

INT_FIELDS = [
    "baseHP", "baseAttack", "baseDefense", "baseSpeed",
    "baseSpAttack", "baseSpDefense", "catchRate", "expYield",
]
STR_FIELDS = ["growthRate"]


def parse_block(block):
    entry = {}
    for f in INT_FIELDS:
        m = re.search(rf"\.{f}\s*=\s*(\d+)", block)
        if m:
            entry[f] = int(m.group(1))
    m = re.search(r"\.types\s*=\s*\{([^}]+)\}", block)
    if m:
        entry["types"] = [t.strip().replace("TYPE_", "") for t in m.group(1).split(",")]
    m = re.search(r"\.abilities\s*=\s*\{([^}]+)\}", block)
    if m:
        entry["abilities"] = [a.strip().replace("ABILITY_", "") for a in m.group(1).split(",")]
    m = re.search(r"\.eggGroups\s*=\s*\{([^}]+)\}", block)
    if m:
        entry["eggGroups"] = [g.strip().replace("EGG_GROUP_", "") for g in m.group(1).split(",")]
    for f in STR_FIELDS:
        m = re.search(rf"\.{f}\s*=\s*([A-Z0-9_]+)", block)
        if m:
            entry[f] = m.group(1)
    return entry


def main():
    text = SRC.read_text()
    # Slice by entry start, so the trivial [SPECIES_NONE] = {0}, entry
    # cannot swallow the following Bulbasaur block.
    starts = list(re.finditer(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{", text))
    entries = []
    for i, m in enumerate(starts):
        name = m.group(1)
        if name == "NONE":
            continue
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        block = text[m.end():end]
        e = {"sourceConstant": f"SPECIES_{name}"}
        e.update(parse_block(block))
        entries.append(e)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": "pokefirered-leafgreen/src/data/pokemon/species_info.h",
        "sourceRepo": "pret/pokefirered",
        "count": len(entries),
        "notes": "Neutral intermediate JSON. No Mochiichao conversion, no category field invented.",
        "species": entries,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT} with {len(entries)} entries")
    # sanity: first few + a known check
    by_name = {e["sourceConstant"]: e for e in entries}
    bulba = by_name.get("SPECIES_BULBASAUR", {})
    print("BULBASAUR:", bulba)
    assert bulba.get("baseHP") == 45, "Bulbasaur baseHP sanity check failed"
    assert len(entries) > 300, "unexpectedly few species parsed"


if __name__ == "__main__":
    main()
