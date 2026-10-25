#!/usr/bin/env python3
"""Extract Black 2 moves, learnsets, and evolutions from pokebw2 res/ JSON.

Sources:
  pokebw2/res/moves/*/data.json
  pokebw2/res/pokemon/*/data.json (learnset + evolutions fields)
Outputs:
  src/lib/generated/decomp_black2_moves.json
  src/lib/generated/decomp_black2_learnsets.json
  src/lib/generated/decomp_black2_evolutions.json

Methods are preserved exactly (EVO_METHOD_LEVEL, EVO_METHOD_ITEM,
EVO_METHOD_FRIENDSHIP_DAY, etc.) — never converted to level.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BW2 = ROOT / "pokebw2"
OUT = ROOT / "src/lib/generated"


def main():
    moves = []
    for d in sorted((BW2 / "res/moves").iterdir()):
        if not d.is_dir():
            continue
        p = d / "data.json"
        if not p.exists():
            continue
        m = json.loads(p.read_text())
        moves.append({
            "sourceDir": d.name,
            "sourceConstant": f"MOVE_{d.name.upper()}",
            "name": m.get("name"),
            "type": m.get("type"),
            "category": m.get("category"),
            "power": m.get("power"),
            "accuracy": m.get("accuracy"),
            "pp": m.get("pp"),
            "priority": m.get("priority"),
            "effect": m.get("effect"),
        })
    move_consts = {m["sourceConstant"] for m in moves}

    learnsets = {}
    evolutions = {}
    species_consts = set()
    unresolved_moves = set()
    unresolved_evos = set()
    total_level = total_tm = total_tutor = total_egg = total_evos = 0
    for d in sorted((BW2 / "res/pokemon").iterdir()):
        if not d.is_dir():
            continue
        p = d / "data.json"
        if not p.exists():
            continue
        entry = json.loads(p.read_text())
        const = f"SPECIES_{d.name.upper()}"
        species_consts.add(const)
        ls = entry.get("learnset", {})
        by_level = ls.get("by_level", [])
        by_tutor = ls.get("by_tutor", [])
        egg = ls.get("egg_moves", [])
        for _, mv in by_level:
            if mv not in move_consts:
                unresolved_moves.add(mv)
        for mv in by_tutor + egg:
            if mv not in move_consts:
                unresolved_moves.add(mv)
        learnsets[const] = {
            "by_level": by_level,
            "by_tm": ls.get("by_tm", []),
            "by_tutor": by_tutor,
            "egg_moves": egg,
        }
        total_level += len(by_level)
        total_tm += len(ls.get("by_tm", []))
        total_tutor += len(by_tutor)
        total_egg += len(egg)
        evos = entry.get("evolutions", [])
        if evos:
            evolutions[const] = evos
            total_evos += len(evos)
    for src, evos in evolutions.items():
        for e in evos:
            if e["species"] not in species_consts:
                unresolved_evos.add(e["species"])

    (OUT / "decomp_black2_moves.json").write_text(json.dumps({
        "source": "pokebw2/res/moves/*/data.json",
        "sourceRepo": "fuddlesworth/pokebw2",
        "count": len(moves),
        "moves": moves,
    }, indent=2) + "\n")
    (OUT / "decomp_black2_learnsets.json").write_text(json.dumps({
        "source": "pokebw2/res/pokemon/*/data.json learnset fields",
        "sourceRepo": "fuddlesworth/pokebw2",
        "speciesWithLearnsets": len(learnsets),
        "totalLevelUp": total_level,
        "totalTMHM": total_tm,
        "totalTutor": total_tutor,
        "totalEgg": total_egg,
        "unresolvedMoves": sorted(unresolved_moves),
        "learnsets": learnsets,
    }, indent=2) + "\n")
    (OUT / "decomp_black2_evolutions.json").write_text(json.dumps({
        "source": "pokebw2/res/pokemon/*/data.json evolutions fields",
        "sourceRepo": "fuddlesworth/pokebw2",
        "speciesWithEvolutions": len(evolutions),
        "totalEvolutions": total_evos,
        "unresolvedTargets": sorted(unresolved_evos),
        "evolutions": evolutions,
    }, indent=2) + "\n")
    print(f"moves: {len(moves)}")
    print(f"learnsets: {len(learnsets)} species, level {total_level}, TM/HM {total_tm}, tutor {total_tutor}, egg {total_egg}, unresolved moves: {sorted(unresolved_moves)}")
    print(f"evolutions: {len(evolutions)} species, {total_evos} evolutions, unresolved targets: {sorted(unresolved_evos)}")
    print("BULBASAUR level:", learnsets["SPECIES_BULBASAUR"]["by_level"][:3], "evos:", evolutions["SPECIES_BULBASAUR"])
    print("EEVEE evos:", evolutions["SPECIES_EEVEE"])


if __name__ == "__main__":
    main()
