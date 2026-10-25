# Pret Gen 1–4 reference data — Batch A provenance

Reference namespace only. These JSON files are neutral intermediate extractions
of data *shapes* (species stats, moves, learnsets, evolutions, trainers,
encounters) from public disassembly projects. They are NOT Mochiichao canon:
no roster IDs, no Mochiichao types, no conversion to Mochiichao creatures has
been applied. No pret code, text, music, sprites, ROMs, official art, or
leaked source is vendored here.

## Licence status

The pret projects below ship no licence file (GitHub licence detection:
null). Treatment is therefore submodule reference + neutral JSON extraction
only. Do NOT vendor pret code wholesale, and do NOT build a ROM from it in
this repo. Vendoring pret code needs a separate licence decision.

## Sources (study clones, local only, not in this repo)

| Game | Source repo | Commit |
|---|---|---|
| Emerald | pret/pokeemerald | 731ad5b |
| Ruby | pret/pokeruby | 5784633 |
| Crystal | pret/pokecrystal | 5c877ef |
| Yellow | pret/pokeyellow | 9327549 |
| Diamond | pret/pokediamond | b623abef |

## Contents and validated counts

| Game | Species | Moves | Level-up | TM/HM | Tutor | Egg | Evolutions | Trainers | Encounters |
|---|---|---|---|---|---|---|---|---|---|
| Emerald | 386 | 354 | 411 species / 3,972 | 372 / 8,927 | 372 / 5,309 | 165 / 973 | 172 / 184 | 854 / 1,825 | 3 groups / 135 maps / 2,107 entries / 143 distinct |
| Ruby | 386 | 354 | 411 / 3,972 | 372 / 8,927 | none (see below) | 165 / 973 | 172 / 184 | 693 / 1,486 | 1 group / 194 maps / 3,262 entries / 118 distinct |
| Crystal | 251 | 251 | 251 / 2,215 | 242 / 6,592 | — (Gen 2 TM/HM/tutor is one combined list) | 105 / 480 | 113 / 122 | 541 / 1,254 | 153 blocks / 2,097 entries / 130 distinct |
| Yellow | 151 | 165 | 151 / 755 | 145 / 725 | — | none (Gen 1, no breeding) | 70 / 72 | 47 class groups / 364 rows / 112 distinct | 632 entries (lower bound) / 75 distinct |
| Diamond | 500 | 470 | 500 / 6,597 | 500 / 17,812 | — (see below) | — (see below) | 229 / 246 | 849 / 1,585 | none (see below) |

Cross-checks: Bulbasaur is 45/49/49/45/65/65 in Emerald, Ruby, Crystal and
Diamond (split SpAttack/SpDefense), and 45/49/49/45/65 in Yellow (single
baseSpecial — Gen 1 has no split, and none was invented). Bulbasaur evolves
at Lv 16 to Ivysaur in the games that carry it. Diamond vs HeartGold:
499 species in common, 0 stat differences. Diamond vs FireRed: 386 in
common, 0 stat differences.

## Explicitly listed gaps and quirks (not failures, not fudged)

- Emerald / Ruby level-up learnsets list 25 "unresolved" species:
  decomp placeholders Species252–276 (SPECIES_SPECIES252 … SPECIES_SPECIES276).
  They are flagged in the files, not dropped, and not real species. All move
  references resolve (unresolvedMoves = []).
- Ruby tutor: `decomp_ruby_tutor_learnsets.json` is an explicit none-record
  (speciesWithTutor 0, totalTutorEntries 0) — no per-species tutor table
  exists in pokeruby as searched. Not a failed extraction, and no tutor
  file was invented.
- Yellow egg: `decomp_yellow_egg_learnsets.json` is an explicit none-record
  (0 entries) — Gen 1 has no breeding.
- Yellow learnsets list 39 unmatched sections (MissingNo entries,
  FossilKabutops, FossilAerodactyl, MonGhost) — these are not species in
  the Yellow species file and were not added as species.
- Yellow encounters are a lower-bound count: Gen 1 wild files use several
  layouts, so the count is not map-by-map complete.
- Emerald / Ruby / Crystal encounters are summary + species validation
  only; the full wild-encounter source files remain in the decomp clones
  and were not copied here.
- Diamond encounters: NOT extracted. `files/fielddata/encountdata/` is
  binary NARC bins only. A Diamond encounters set would need a separate
  NARC pass.
- Diamond egg-move table: no per-species egg table exists in Diamond's
  poketool JSON. Diamond move-tutor table: Gen 4 tutors are NPC scripts,
  not a per-species table. Neither file was invented.
- Diamond species 500 = 493 national species + Deoxys (3 extra forms) +
  Wormadam (2 extra forms) + EGG + MANAPHY_EGG (10 in every stat, flagged
  as non-battle placeholders). Diamond trainers exclude the index-0
  empty-party placeholder. Dialogue was stripped; data shapes only.
- Gen 2 has no abilities field. Gen 2 / Gen 3 move files have no category
  field; category was derived (power 0 = Status; certain types = Special;
  otherwise Physical) and the derivation is recorded in the move files.
- Crystal's TM/HM file is the Gen 2 combined TM/HM/tutor list per species.

## Excluded from this batch (by design)

- Gold and Red: cross-check only, near-duplicates of Crystal and Yellow.
  Their local files are still named decomp_crystal_* / decomp_yellow_*
  and were NOT uploaded under wrong names.
- Platinum: partial only (names + trainers), needs a separate NARC pass
  for full stats/moves/encounters. Separate later decision.
- Dorowani/Gabu GLBs, placeholder art, official art: none in this batch.
- Open Mochiichao decisions (starter evolution naming, Pebblefist HP,
  Beast/Flora/Neon elements): NOT resolved or silently merged here.

## Extractors

`tools/extract_emerald.py`, `tools/extract_ruby.py`,
`tools/extract_crystal.py`, `tools/extract_yellow.py`,
`tools/extract_diamond.py` — included in this batch.
