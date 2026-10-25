#!/usr/bin/env python3
"""Extract Black 2 trainers from pokebw2 res/trainers/data/*.json.
Output: src/lib/generated/decomp_black2_trainers.json
Validates party species against decomp_black2_species.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "pokebw2/res/trainers/data"
OUT = ROOT / "src/lib/generated/decomp_black2_trainers.json"


def main():
    species = {s["sourceConstant"] for s in json.loads((ROOT / "src/lib/generated/decomp_black2_species.json").read_text())["species"]}
    trainers = []
    total_party = 0
    unresolved = set()
    skipped = []
    for p in sorted(DATA.glob("*.json")):
        t = json.loads(p.read_text())
        if not isinstance(t, dict):
            skipped.append(p.name)
            continue
        party = t.get("party", [])
        total_party += len(party)
        for m in party:
            if m["species"] not in species:
                unresolved.add(m["species"])
        trainers.append({
            "sourceFile": p.name,
            "name": t.get("name"),
            "trainerClass": t.get("class"),
            "battleStyle": t.get("battle_style"),
            "party": party,
        })
    OUT.write_text(json.dumps({
        "source": "pokebw2/res/trainers/data/*.json",
        "sourceRepo": "fuddlesworth/pokebw2",
        "trainerCount": len(trainers),
        "skippedNonTrainerFiles": skipped,
        "totalPartyMembers": total_party,
        "unresolvedPartySpecies": sorted(unresolved),
        "trainers": trainers,
    }, indent=2) + "\n")
    print(f"black2 trainers: {len(trainers)}, party members: {total_party}, unresolved: {sorted(unresolved)}")
    print("first:", trainers[0]["name"], trainers[0]["party"][:1])


if __name__ == "__main__":
    main()
