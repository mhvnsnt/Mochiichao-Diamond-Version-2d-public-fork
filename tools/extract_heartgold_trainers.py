#!/usr/bin/env python3
"""Convert HeartGold trainer JSON into neutral generated JSON.

Source: pokeheartgold/files/poketool/trainer/trainers.json
Output: src/lib/generated/decomp_heartgold_trainers.json

Party species are validated against decomp_heartgold_species.json.
Unresolved party species are listed, never silently dropped.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HG = ROOT / "pokeheartgold/files/poketool"
OUT = ROOT / "src/lib/generated/decomp_heartgold_trainers.json"


def main():
    trainers = json.loads((HG / "trainer/trainers.json").read_text())["trainers"]
    species = json.loads((ROOT / "src/lib/generated/decomp_heartgold_species.json").read_text())["species"]
    known = {s["sourceConstant"] for s in species}
    unresolved = set()
    total_party = 0
    for t in trainers:
        for mon in t.get("party", []):
            total_party += 1
            sp = mon.get("species")
            if sp and sp not in known:
                unresolved.add(sp)
    payload = {
        "source": "pokeheartgold/files/poketool/trainer/trainers.json",
        "sourceRepo": "pret/pokeheartgold",
        "trainerCount": len(trainers),
        "totalPartyMembers": total_party,
        "unresolvedPartySpecies": sorted(unresolved),
        "trainers": trainers,
    }
    OUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"trainers: {len(trainers)}, party members: {total_party}, unresolved: {sorted(unresolved)}")
    assert len(trainers) == 738


if __name__ == "__main__":
    main()
