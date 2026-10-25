#!/usr/bin/env python3
"""Parse FireRed/LeafGreen evolution table into neutral JSON.

Source: pokefirered-leafgreen/src/data/pokemon/evolution.h
Output: src/lib/generated/decomp_firered_evolutions.json

Method and parameter are preserved exactly. Trade / item / friendship
evolutions are NEVER converted to level evolutions here — conversion,
if the game ever needs it, is a separate decision with its own record.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pokefirered-leafgreen/src/data/pokemon/evolution.h"
OUT = ROOT / "src/lib/generated/decomp_firered_evolutions.json"
SPECIES = ROOT / "src/lib/generated/decomp_firered_species.json"


def main():
    text = SRC.read_text()
    species = {e["sourceConstant"] for e in json.loads(SPECIES.read_text())["species"]}
    # Each row: [SPECIES_X] = {{...}}, possibly spanning lines.
    rows = re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*\{\{(.*?)\}\},?", text, re.S)
    evolutions = {}
    unresolved = []
    total = 0
    for name, inner in rows:
        const = f"SPECIES_{name}"
        entries = []
        for method, param, target in re.findall(r"EVO_([A-Z_]+),\s*([^,]+),\s*(SPECIES_[A-Z0-9_]+)", inner):
            total += 1
            if target not in species:
                unresolved.append(target)
            entries.append({"method": method, "param": param.strip(), "target": target})
        if entries:
            evolutions[const] = entries
    payload = {
        "source": "pokefirered-leafgreen/src/data/pokemon/evolution.h",
        "sourceRepo": "pret/pokefirered",
        "speciesWithEvolutions": len(evolutions),
        "totalEvolutions": total,
        "unresolvedTargets": sorted(set(unresolved)),
        "note": "Methods preserved exactly. No trade/item/friendship evolution converted to level.",
        "evolutions": evolutions,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT}: {len(evolutions)} species, {total} evolutions")
    print("BULBASAUR:", evolutions.get("SPECIES_BULBASAUR"))
    print("EEVEE:", evolutions.get("SPECIES_EEVEE"))
    print("KADABRA:", evolutions.get("SPECIES_KADABRA"))
    print("unresolved:", payload["unresolvedTargets"])
    assert evolutions["SPECIES_BULBASAUR"] == [{"method": "LEVEL", "param": "16", "target": "SPECIES_IVYSAUR"}]
    assert len(evolutions["SPECIES_EEVEE"]) == 5
    assert evolutions["SPECIES_KADABRA"][0]["method"] == "TRADE"


if __name__ == "__main__":
    main()
