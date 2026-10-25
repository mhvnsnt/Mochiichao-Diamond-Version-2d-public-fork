#!/usr/bin/env python3
"""Parse FireRed/LeafGreen battle_moves.h into neutral JSON.

Source: pokefirered-leafgreen/src/data/battle_moves.h (pret/pokefirered).
Output: src/lib/generated/decomp_firered_moves.json

Gen 3 has no physical/special category field in this table. The JSON
records a *derived* category separately, with the derivation rule stated,
so source data and derivation are never confused:
  power == 0 -> Status
  type in {FIRE, WATER, GRASS, ELECTRIC, PSYCHIC, ICE, DRAGON, DARK} -> Special
  otherwise -> Physical
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "pokefirered-leafgreen/src/data/battle_moves.h"
OUT = ROOT / "src/lib/generated/decomp_firered_moves.json"
SPECIAL_TYPES = {"FIRE", "WATER", "GRASS", "ELECTRIC", "PSYCHIC", "ICE", "DRAGON", "DARK"}


def parse_block(block):
    e = {}
    for f in ["power", "accuracy", "pp", "secondaryEffectChance", "priority"]:
        m = re.search(rf"\.{f}\s*=\s*(-?\d+)", block)
        if m:
            e[f] = int(m.group(1))
    for f, prefix in [("effect", "EFFECT_"), ("type", "TYPE_"), ("target", "MOVE_TARGET_")]:
        m = re.search(rf"\.{f}\s*=\s*([A-Z0-9_]+)", block)
        if m:
            e[f] = m.group(1).replace(prefix, "")
    m = re.search(r"\.flags\s*=\s*([^,\n]+)", block)
    if m:
        flags = m.group(1).strip()
        e["flags"] = [] if flags == "0" else [x.strip().replace("FLAG_", "") for x in flags.split("|")]
    return e


def main():
    text = SRC.read_text()
    starts = list(re.finditer(r"\[MOVE_([A-Z0-9_]+)\]\s*=\s*\{", text))
    moves = []
    for i, m in enumerate(starts):
        name = m.group(1)
        if name == "NONE":
            continue
        end = starts[i + 1].start() if i + 1 < len(starts) else len(text)
        block = text[m.end():end]
        e = {"sourceConstant": f"MOVE_{name}"}
        e.update(parse_block(block))
        # derived category, clearly labelled as derived, not source
        if e.get("power", 0) == 0:
            e["derivedCategory"] = "Status"
        elif e.get("type") in SPECIAL_TYPES:
            e["derivedCategory"] = "Special"
        else:
            e["derivedCategory"] = "Physical"
        moves.append(e)
    payload = {
        "source": "pokefirered-leafgreen/src/data/battle_moves.h",
        "sourceRepo": "pret/pokefirered",
        "count": len(moves),
        "categoryDerivation": "Gen 3 has no category field. power 0 = Status; FIRE/WATER/GRASS/ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special; otherwise Physical. Recorded as derivedCategory only.",
        "moves": moves,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"wrote {OUT} with {len(moves)} moves")
    by = {m["sourceConstant"]: m for m in moves}
    print("POUND:", by.get("MOVE_POUND"))
    assert by["MOVE_POUND"]["power"] == 40
    assert by["MOVE_POUND"]["derivedCategory"] == "Physical"
    assert len(moves) > 300
    assert len(by) == len(moves)


if __name__ == "__main__":
    main()
