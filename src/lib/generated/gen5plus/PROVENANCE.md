# Gen 5+ reference data — provenance

Source: PokeAPI/pokeapi, sparse checkout of `data/v2/csv` only (41 MB, 187 CSVs).
PokeAPI code is BSD-3-Clause; that licence covers API code, and data/trademarks are
separate — it does NOT grant sprite art rights, and no sprite art is included here.

Scope: generation_id >= 5 (Gen 5–9), default forms only, level-up learnsets only.
Extractor: `extract_pokeapi_gen5plus.py` (in this directory).

Counts, validated 2026-10-25, 0 unresolved throughout:
- `gen5plus_species.json` — 532 species (Gen 5: 156, Gen 6: 72, Gen 7: 88, Gen 8: 96,
  Gen 9: 120; IDs 494–1025)
- `gen5plus_moves.json` — 871 moves (union of Gen 5+ introduced 452 and Gen 5+
  learnset moves 714; 937 total in moves.csv; 313 have null power = Status moves)
- `gen5plus_learnsets.json` — 532 species, 8,541 deduplicated level entries
- `gen5plus_evolutions.json` — 380 evolutions
- `gen5plus_summary.json` — machine-readable counts

Namespace rule (do not break this): all Gen 5+ data lives in a separate reference
namespace (`pokeapi_species_id`, `pokeapi_move_<id>`). It is NOT roster data and
must never be written into roster IDs 001–046 + 331 (or 147/148 — Dorowani/Gabu,
which are Mochiichao originals, not PokeAPI entries).

Type rule: Pokémon type names are NOT mapped to the 12 True Elements here.
The unification map only covers species.ts types; Gen 5+ types such as fairy have
no canonical mapping yet. Any future template use needs a per-type, Mars-approved
mapping, logged, not guessed.

Move rule: `damage_class` maps to canonical category; power/accuracy/pp/priority
map directly. `effect`/`effectChance`/`anim`/`desc` are NOT in the PokeAPI CSV move
table and must come from a Mochiichao design decision, not be invented.
Learnsets here are level-up only; TM/HM/tutor/egg learnsets are a follow-up
extractor change, not a re-pull. Non-default forms (regional/Mega/Gigantamax)
are excluded; form-aware extraction needs a separate scope decision.

Evolution triggers with no Mochiichao equivalent (tower-of-darkness/waters,
three-critical-hits, three-defeated-bisharp, gimmighoul-coins, meltan-candies,
agile/strong-style-move) must not be copied as Mochiichao methods without a
design decision.

No sprites, no ROMs, no dumps, no game files, no official art/music, no leaked
source were downloaded for this data. This is a 2026-10-25 snapshot of PokeAPI's
CSV data; re-run the extractor after a fresh sparse pull for updates.
