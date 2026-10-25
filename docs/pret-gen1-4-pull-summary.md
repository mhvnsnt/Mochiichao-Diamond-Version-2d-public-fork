# Pret Gen 1–4 pull — COMPLETE, local only, no PR yet

No PR has been pushed or opened for any of this work. Submodule reference + neutral JSON data shapes only, no pret code/text/music/sprites vendored, no ROM built, no ROMs/official art/leaked source downloaded, no GPL code vendored.

Outputs live under ~/workspace/mochiichao-work/extractions/ (emerald/, ruby/, crystal/, gold/, yellow/, red/, platinum/, diamond/) with extractor scripts alongside; study clones under ~/workspace/mochiichao-work/decomps/.

## Per-project status

| # | Project | Status | Counts (validated) |
|---|---|---|---|
| 1 | pret/pokeemerald (731ad5b, 91 MB) | Pulled, extracted, validated — PR-ready | Species 386, moves 354, level-up 411/3,972, TM/HM 372/8,927, tutor 372/5,309, egg 165/973, evolutions 172/184, trainers 854/1,825, encounters 3 groups/135 maps/2,107 entries/143 distinct |
| 2 | pret/pokeruby (5784633, 72 MB) | Pulled, extracted, validated — PR-ready | Species 386, moves 354, level-up 411/3,972, TM/HM 372/8,927, egg 165/973, evolutions 172/184, trainers 693/1,486, encounters 1 group/194 maps/3,262 entries/118 distinct; tutor = none (no per-species tutor table in Ruby, recorded not failed) |
| 3 | pret/pokecrystal (5c877ef, 28 MB) | Pulled, extracted, validated — PR-ready (Gen 2 canonical) | Species 251, moves 251, level-up 251/2,215, TM/HM 242/6,592, egg 105/480, evolutions 113/122, trainers 541/1,254, encounters 153 blocks/2,097 entries/130 distinct |
| 4 | pret/pokegold (fc702b6, 24 MB) | Pulled, cross-check only, kept local — not a separate PR batch (near-duplicate of Crystal) | Species stats identical to Crystal for all 251; differences are only Crystal's extra tutor moves, learnset/egg/trainer/wild diffs noted locally; files still named decomp_crystal_* — rename before any PR use |
| 5 | pret/pokeyellow (9327549, 18 MB) | Pulled, extracted, validated — PR-ready as Gen 1 baseline | Species 151, moves 165, level-up 151/755, TM/HM 145/725, evolutions 70/72, trainers 47 class groups/364 rows/112 distinct, wild 632 entries (lower bound)/75 distinct; egg = none (no breeding in Gen 1); 5 stats only (baseSpecial, no invented split) |
| 6 | pret/pokered (171e2c2, 16 MB) | Pulled, cross-check only, kept local — not a separate PR batch | Evolutions identical to Yellow (0 differing); differences are only level-1 learnsets for 15 species + trainer/wild diffs; files still named decomp_yellow_* — rename before any PR use |
| 7 | pret/pokeplatinum (6eeb1b04, 263 MB) | Pulled, partial only — clearly labelled, not a full set | Species names only 495, move names only 468 (stats/moves live in binary personal.narc/waza_tbl.narc, no JSON equivalent — full extraction needs a separate NARC pass, not attempted); trainers 928/1,878, 0 unresolved, dialogue stripped; encounters/frontier trainers not extracted |
| 8 | pret/pokediamond (b623abef, 224 MB) | Pulled, extracted, validated — PR-ready (except encounters, see below) | Species 500, moves 470, level-up 500/6,597, TM/HM 500/17,812, evolutions 229/246, trainers 849/1,585 — all unresolved = 0 |

## Diamond detail (new work this run)

- Clone: ~/workspace/mochiichao-work/decomps/pokediamond, shallow, 224 MB, commit b623abef. Gate passed: Diamond's data is clean JSON (same poketool pattern as HeartGold), not binary NARCs, so full extraction was possible.
- Extractor: ~/workspace/mochiichao-work/extractions/extract_diamond.py
- Species 500 (501 raw incl. NONE): 493 national species + Deoxys 3 extra forms + Wormadam 2 extra forms + EGG + MANAPHY_EGG (10 in every stat, flagged as non-battle placeholders, not dropped silently)
- Moves 470 (471 incl. MOVE_NONE)
- TM/HM mapped via include/constants/items.h (92 TMs + 8 HMs, verified: Bulbasaur TM06 = Toxic, HM01 = Cut)
- Evolutions 229 species / 246, 27 methods incl. Gen 4 location evos EVO_CORONET (Magnezone), EVO_ETERNA (Leafeon), EVO_ROUTE217 (Glaceon); Eevee 7 branches
- Trainers 849 / 1,585 party members (850 raw incl. index-0 empty-party placeholder, excluded and noted; 543 party members carry explicit moves; types: TRTYPE_MON 620, TRTYPE_MON_MOVES 208, TRTYPE_MON_ITEM_MOVES 21). Dialogue stripped, data shapes only.
- Cross-checks all pass: Bulbasaur 45/49/49/45/65/65, Lv 16 → Ivysaur, Pound 40/Physical — matches FireRed, HeartGold, Emerald, Black 2. vs HeartGold: 499 species in common, 0 stat differences; Diamond-only = MANAPHY_EGG; HeartGold-only = BAD_EGG, Giratina Origin, 5 Rotom appliance forms, Shaymin Sky. vs FireRed: 386 in common, 0 stat differences.
- Resolver bug found and fixed during validation (not a data problem): first run flagged thousands of "unresolved" because Diamond's level-up table uses bare move tokens (TACKLE) while the move table uses MOVE_TACKLE, and trainer parties use SPECIES_ prefixes while the species table uses bare names. Output names were already correct; checks were wrong. Fixed, re-ran clean: unresolved = [] in all six files. A second class of evo entries (22: Friendship, Trade, location evos) carries no param field — preserved as param: null, not dropped.
- Explicitly NOT extracted (not fudged): wild encounters — files/fielddata/encountdata/ is binary NARC bins only, same limitation as Platinum; egg-move table — no per-species egg table exists in Diamond's poketool JSON; move-tutor table — Gen 4 tutors are NPC scripts, not a per-species table. So Diamond is PR-ready as a species/moves/learnsets/evolutions/trainers batch; a Diamond encounters set would need a separate NARC pass. Pearl (personal_pearl/ dir exists) was not extracted — Diamond is the canonical Gen 4 source, Pearl would be cross-check only.

## What is ready for a later PR batch (parent's call on batching)

- Batch A (full, validated): Emerald + Ruby + Crystal + Yellow + Diamond — species, moves, level-up, TM/HM, evolutions, trainers (+ encounters for Emerald/Ruby/Crystal/Yellow, + tutor/egg where they exist).
- Batch B (partial, only if a partial is worth shipping): Platinum names + trainers, labelled partial.
- Not for PR as duplicate sets: Gold and Red — diff notes only, after renaming their files to decomp_gold_* / decomp_red_*.
- Still separate scoped work if wanted: Platinum full extraction (NARC pass) and Diamond encounters (NARC pass). Neither is claimed or fudged here.

## Side-chat update noted 2026-10-25 (separate from this pull)

Dorowani and Gabu numbering is now CONFIRMED in the Sprite Art lane (via a MEMORY update from that lane): Dorowani 147, Gabu 148, Gen 2 choosable starters, gap 047-146 to fill as built, all gens mixed into one game. This supersedes the earlier "unnumbered, do not assign 047/048" rule — 147/148 are NOT 047/048. Each of Dorowani, Gabu, Mochii #001 now has 3 sheets in sprite-art/2d-sheets/<creature>/: main, angles top/diagonal, angles+lighting. That sheet work lives in the Sprite Art lane, not in this pret pull.
