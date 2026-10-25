# Decomp extraction — provenance (first pass, 2026-10-25)

Neutral intermediate JSON only. No Mochiichao conversion, no IDs remapped,
no trade/item/friendship evolution converted to level, no Gen 3 category
invented (derivedCategory is labelled as derived).

## FireRed / LeafGreen — pret/pokefirered, submodule pokefirered-leafgreen
- decomp_firered_species.json — 386 species, from src/data/pokemon/species_info.h
- decomp_firered_moves.json — 354 moves, from src/data/battle_moves.h
- decomp_firered_learnsets.json — 411 learnset arrays, 4,052 level-up moves,
  386 match species.json, 25 placeholder Species252–276, 0 unresolved moves
- decomp_firered_evolutions.json — 172 species, 184 evolutions, 0 unresolved targets
- decomp_firered_tmhm_learnsets.json — 372 species, 8,927 TM/HM entries, 0 unresolved
- decomp_firered_tutor_learnsets.json — 372 species, 2,388 tutor entries, 0 unresolved

## HeartGold / SoulSilver — pret/pokeheartgold, submodule pokeheartgold
- decomp_heartgold_species.json — 507 species (508 raw minus NONE),
  from files/poketool/personal/personal.json
- decomp_heartgold_evolutions.json — 229 species, 247 evolutions,
  from files/poketool/personal/evo.json
- decomp_heartgold_trainers.json — 738 trainers, 1,776 party members,
  0 unresolved party species, from files/poketool/trainer/trainers.json

## Black 2 / White 2 — fuddlesworth/pokebw2, submodule pokebw2 @ e522642
- decomp_black2_species.json — 652 species, from res/pokemon/*/data.json
  (657 dirs minus pokestar/shared, which are not species)
- decomp_black2_moves.json — 560 moves, from res/moves/*/data.json
  (561st entry in res/moves is move.schema.json, not a move)
- decomp_black2_learnsets.json — 652 species: level 9,604, TM/HM 20,604,
  tutor 7,117, egg 2,773, 0 unresolved moves, from species data.json learnset fields
- decomp_black2_evolutions.json — 303 species, 321 evolutions,
  0 unresolved targets, methods preserved exactly
- Black 2 encounters / trainers: NOT extracted yet (res/trainers exists,
  needs a separate pass).

## Cross-checks (all pass)
- Bulbasaur base stats match across FireRed, HeartGold, and Black 2:
  45 / 49 / 49 / 45 / 65 / 65
- Bulbasaur evolution: level 16 → Ivysaur, in FireRed and HeartGold
- Every learnset / TM / tutor move resolves against the moves JSON
- Every evolution target resolves against the species JSON
