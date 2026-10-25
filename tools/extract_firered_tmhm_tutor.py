#!/usr/bin/env python3
"""Parse FireRed TM/HM and tutor learnsets into neutral JSON.

Sources:
  pokefirered-leafgreen/src/data/pokemon/tmhm_learnsets.h
  pokefirered-leafgreen/src/data/pokemon/tutor_learnsets.h
Outputs:
  src/lib/generated/decomp_firered_tmhm_learnsets.json
  src/lib/generated/decomp_firered_tutor_learnsets.json

TM/HM entries are machine names like TM06_TOXIC / HM01_CUT. The move is
the suffix after TMxx_/HMxx_, recorded as MOVE_<suffix> and validated
against decomp_firered_moves.json. Unresolved moves are listed, not dropped.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PK = ROOT / "pokefirered-leafgreen/src/data/pokemon"
OUTDIR = ROOT / "src/lib/generated"


def main():
    moves = {m["sourceConstant"] for m in json.loads((OUTDIR / "decomp_firered_moves.json").read_text())["moves"]}
    species = {s["sourceConstant"] for s in json.loads((OUTDIR / "decomp_firered_species.json").read_text())["species"]}

    # TM/HM
    text = (PK / "tmhm_learnsets.h").read_text()
    # Entries end with "))," after the TMHM_LEARNSET(...) block.
    rows = re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*TMHM_LEARNSET\((.*?)\)\s*,", text, re.S)
    tmhm = {}
    unresolved_tmhm = set()
    total_tmhm = 0
    for name, block in rows:
        const = f"SPECIES_{name}"
        machines = re.findall(r"TMHM\((TM\d+_[A-Z0-9_]+|HM\d+_[A-Z0-9_]+)\)", block)
        entries = []
        for mach in machines:
            total_tmhm += 1
            move_name = re.sub(r"^(TM\d+|HM\d+)_", "", mach)
            move = f"MOVE_{move_name}"
            if move not in moves:
                unresolved_tmhm.add(move)
            entries.append({"machine": mach, "move": move})
        if entries:
            tmhm[const] = entries
    (OUTDIR / "decomp_firered_tmhm_learnsets.json").write_text(json.dumps({
        "source": "pokefirered-leafgreen/src/data/pokemon/tmhm_learnsets.h",
        "sourceRepo": "pret/pokefirered",
        "speciesWithTMHM": len(tmhm),
        "totalTMHMEntries": total_tmhm,
        "unresolvedMoves": sorted(unresolved_tmhm),
        "learnsets": tmhm,
    }, indent=2) + "\n")
    print(f"TM/HM: {len(tmhm)} species, {total_tmhm} entries, unresolved: {sorted(unresolved_tmhm)}")
    print("BULBASAUR TM/HM:", tmhm.get("SPECIES_BULBASAUR"))

    # Tutor
    text2 = (PK / "tutor_learnsets.h").read_text()
    # Tutor table starts after the sTutorMoves table; isolate it.
    tutor_text = text2.split("static const u16 sTutorLearnsets[]", 1)[1]
    rows2 = re.findall(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*(.*?)(?:,\n\s*\n|\n\s*\n\[SPECIES_|\Z)", tutor_text, re.S)
    # Simpler robust approach: split by species markers in tutor_text.
    markers = list(re.finditer(r"\[SPECIES_([A-Z0-9_]+)\]\s*=\s*", tutor_text))
    tutor = {}
    unresolved_tutor = set()
    total_tutor = 0
    for i, m in enumerate(markers):
        name = m.group(1)
        end = markers[i + 1].start() if i + 1 < len(markers) else len(tutor_text)
        block = tutor_text[m.end():end]
        moves_in = re.findall(r"TUTOR\((MOVE_[A-Z0-9_]+)\)", block)
        if not moves_in:
            continue
        total_tutor += len(moves_in)
        for mv in moves_in:
            if mv not in moves:
                unresolved_tutor.add(mv)
        tutor[f"SPECIES_{name}"] = moves_in
    (OUTDIR / "decomp_firered_tutor_learnsets.json").write_text(json.dumps({
        "source": "pokefirered-leafgreen/src/data/pokemon/tutor_learnsets.h",
        "sourceRepo": "pret/pokefirered",
        "speciesWithTutor": len(tutor),
        "totalTutorEntries": total_tutor,
        "unresolvedMoves": sorted(unresolved_tutor),
        "learnsets": tutor,
    }, indent=2) + "\n")
    print(f"Tutor: {len(tutor)} species, {total_tutor} entries, unresolved: {sorted(unresolved_tutor)}")
    print("BULBASAUR tutor:", tutor.get("SPECIES_BULBASAUR"))
    assert "MOVE_SWORDS_DANCE" in tutor["SPECIES_BULBASAUR"]
    assert any(e["machine"] == "TM06_TOXIC" for e in tmhm["SPECIES_BULBASAUR"])


if __name__ == "__main__":
    main()
