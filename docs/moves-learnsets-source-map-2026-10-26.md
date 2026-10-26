# Slice 2 — Moves / Learnsets / Evolutions: decomp source → Mochiichao replacement

Status: STAGED ONLY. NO commit, NO push, NO PR, NO repo edits, NOT wired live.
In-game counts below are unchanged by this slice; staged counts are new.

## Per-item counts (percentage rule: count behind every %)

| Item | Before (in code) | This slice (staged) | Staged % | Still NOT done |
|---|---|---|---|---|
| Moves catalogue | 36/354 FireRed = 10% | 36 existing + 84 new = 120 staged | 120/354 = 34% vs FireRed; 120/560 = 21% vs Black 2 | 234 moves to FireRed parity; 440 to Black 2 parity. Live game still uses 36 only. |
| Learnsets — level | 12/47 species = 26% | 47/47 species, 333 entries | 100% staged | Wiring into species.ts for 35 species (see drift note). |
| Learnsets — TM | 0/47 = 0% | 47/47 species, 328 entries, TM catalogue 20 slots | 100% staged (20-slot catalogue) | TM catalogue expansion 20 → 50 TM + 8 HM (later batch, once catalogue grows). |
| Learnsets — HM | 0/47 = 0% | Shape present, assignments 0/47 | 0% filled, 100% shape | HM assignments NEED a field-system decision (see below). |
| Learnsets — tutor | 0/47 = 0% | 47/47 species, 138 entries | 100% staged | Wiring only. |
| Learnsets — egg | 0/47 = 0% | 16 species carry egg moves (48 entries); 31 species [] by design | 16/16 = 100% of applicable base forms | None under the egg rule (see below). |
| Evolutions — data | 29 roster links; 7 in species.ts code | 29/29 roster links verbatim, 18 terminal/single null | 100% staged data | Wiring into species.ts for species beyond the 12 in code. |
| Evolutions — mid-fight | Direction only, 0% wired | Hook shape defined (trigger + cancellable prompt), showcase 013→014 | 100% shape, 0% wired | BattleView + party wiring (checklist in evolution-hook.ts). |
| Roster battle-ready (species.ts) | 12/47 = 26% | Data for 47/47 staged for THESE THREE systems only | Not 47/47 battle-ready yet | Stats/catch/exp wiring for 35 species + drift resolution + Pebblefist HP (Mars-only). |

## Decomp source → Mochiichao replacement → HAVE / NEED TO MAKE

### (a) Moves — HAVE: moves-catalogue.ts (84 new) + moves-provenance.json
- Decomp source (in order): FireRed `pokefirered-leafgreen/src/data/battle_moves.h`
  via `src/lib/generated/decomp_firered_moves.json` (354 moves) — PRIMARY.
  Black 2 `pokebw2/res/moves/*/data.json` via `decomp_black2_moves.json` (560)
  — used for exactly 2 moves: DRAGON_SURGE (MOVE_DRAGON_PULSE) and
  UMBRAL_PULSE (MOVE_DARK_PULSE). HeartGold has no standalone move table
  in generated/ and was not needed as a shape source.
- Replacement rule: numbers (type/category/power/accuracy/PP/priority)
  copied from ONE decomp move; name + description are Mochiichao originals.
  Full per-move mapping is in moves-provenance.json (sourceConstant,
  decomp type/effect, stored values, accuracy notes).
- Category caveat (HAVE, documented): FireRed categories are DERIVED
  (Gen 3 has no category field; power 0 = Status, FIRE/WATER/GRASS/
  ELECTRIC/PSYCHIC/ICE/DRAGON/DARK = Special, else Physical). Black 2
  categories are native. Where they conflict (e.g. FR MOVE_BITE is derived
  Special), this slice keeps the FireRed shape and flags it in provenance;
  a re-cut to native categories is a coordinator decision, not silent here.
- Accuracy transforms (HAVE, flagged per move in provenance):
  decomp acc 0 + ALWAYS_HIT → stored 100 (SWIFT_STRIKE, TRUE_WING,
  SHADOW_AMBUSH, PHANTOM_FIST); decomp acc 101 (Black 2 never-miss) → 100
  (none of the 2 Black 2 moves needed it); acc 0 on self-target status
  moves → stored 0, meaning "no accuracy check" in decomp convention
  (GUARD_WALL, CHARGE_UP, INNER_FOCUS, MIND_SHIELD, IRON_FORTRESS).
- FAIRY (HAVE, honestly borrowed): no Fairy type exists in FireRed or
  Black 2 decomp, so GLIMMER_BURST / PIXIE_KISS / FAIRY_LIGHT borrow
  FireRed shapes (MOVE_PSYCHIC / MOVE_SWEET_KISS / MOVE_CHARM) with only
  the type reassigned to FAIRY. Provenance says "BORROWED SHAPE" for all 3.
- New-move type counts (actual, from validation): NORMAL 8, WATER 6,
  FIRE 5, GRASS 6, ELECTRIC 5, ICE 4, FIGHTING 4, POISON 5, GROUND 5,
  FLYING 5, PSYCHIC 6, BUG 4, ROCK 4, GHOST 4, DRAGON 3, DARK 3, STEEL 4,
  FAIRY 3 = 84. Categories: Physical 36, Special 32, Status 16.
  Note: INNER_FOCUS is stored PSYCHIC (its source MOVE_MEDITATE is
  Psychic-type in FireRed), though it is assigned to the Fighting line —
  source-faithful, not a STAB claim.
- NEED TO MAKE: (1) merge MOCHIICHAO_MOVES_NEW into MOVES_DB;
  (2) battle-engine support for 14 NEW effect tokens (data only here):
  ATK_DOWN1, ATK_DOWN2, ATK_UP1, DEF_UP1, DEF_UP2, SPDEF_UP1, SPDEF_UP2,
  ALL_UP1, DRAIN, SLEEP, FREEZE, CONFUSE, PROTECT, TRAP — BattleView
  currently handles only the 13 pre-existing tokens; (3) multi-turn /
  conditional rules NOT modelled in this slice (plain damage instead):
  BURROW_STRIKE (Dig dive), SKY_DIVE (Bounce hop), RAGE_STORM (Outrage
  rampage), FUTURE_STRIKE (delayed hit), DREAM_BITE (asleep-only),
  CHASE_DOWN (switch pursuit), TIDE_SPOUT (HP-scaled power);
  (4) 234 more moves to FireRed parity.
- Pre-existing verbatim names — NOT introduced here, NOT renamed here:
  16/36 existing moves.ts names match Black 2 move names verbatim
  (Aqua Jet, Fire Punch, Razor Leaf, Thunderbolt, Wild Charge, Flash
  Cannon, Earth Power, Bulldoze, Dark Pulse, Night Slash, Crunch, Tackle,
  Quick Attack, Body Slam, Dragon Claw, Poison Jab). Renaming them would
  break species.ts references; that rename is a coordinator decision.

### (b) Learnsets — HAVE: learnsets.json
- Decomp shape (structure brought over literally): FireRed
  `level_up_learnsets.h` (level lists), `tmhm_learnsets.h` (machine→move),
  `tutor_learnsets.h` (tutor move lists); Black 2 `data.json` learnset
  fields (by_level / by_tm / by_tutor / egg_moves, 652 species) —
  structure only; Mochiichao assignments are theme-based, not copied
  species tables (there is no 1:1 Mochiichao↔Pokemon species map).
- Level rule: Lv1 TACKLE + Lv5 QUICK_ATTACK follow the existing species.ts
  BASIC_MOVES pattern; theme moves follow roster elements; evolved forms
  re-list early moves (inheritance by listing, as in decomp tables).
- TM rule: tm field lists machine codes (TM01–TM20); tmCatalogue resolves
  each code to a moveId. Every species gets 6–8 codes (328 entries total).
- Tutor rule: tutor field lists moveIds directly (138 entries total).
- Egg rule: egg moves live ONLY on base-form species (first stage of a
  line), as in decomp egg tables. 16 base forms carry 2–4 egg moves each
  (48 entries); 041 Pixilite is single-stage with [] (no breeding line
  in roster); all 30 evolved/single other species are [] BY DESIGN, not
  as a gap. Mythar (331) is [] under the same rule.
- HM — NEED TO MAKE (decision, not data): hm is [] for all 47, shape
  present. No surf/cut/fly field system exists in Mochiichao code, so
  labelling battle moves as HMs would be a false claim. PROPOSED (not
  data, coordinator to approve): HM01 crossing → a WATER move
  (SURGE_RIDE), HM02 cutting → a blade move (LEAF_EDGE), HM03 flight →
  a FLYING move (SKY_DIVE), HM04 strength → a power move (BRICK_SMASH)
  — only once field effects exist in world code.
- NEED TO MAKE: wire level/tm/tutor/egg into species.ts (or its successor)
  for all 47; expand TM catalogue when the move catalogue grows.

### (c) Evolutions — HAVE: evolutions.json + evolution-hook.ts
- Decomp shape: FireRed evolution.h (LEVEL 134, ITEM 21, TRADE_ITEM 8,
  FRIENDSHIP 7, TRADE 4, + rarer, 184 total); HeartGold evo.json
  (EVO_LEVEL 162, EVO_STONE 25, EVO_TRADE_ITEM 13, EVO_FRIENDSHIP 9,
  EVO_HAS_MOVE 7, + location/time, 246 total); Black 2 data.json
  (EVO_METHOD_LEVEL 221, ITEM 34, TRADE_WITH_ITEM 14, FRIENDSHIP 11,
  KNOWS_MOVE 7, + Moss/Ice Rock, magnetic field, etc., 321 total).
- Roster data: ONLY method LEVEL exists in global_roster.json (29 links,
  verbatim levels/targets, re-verified by validate.py). All other methods
  exist in evolution-hook.ts as TYPES with 0 roster instances — shape
  only, never presented as data.
- Mid-fight hook (shape only): EvolutionTrigger (levelUpInBattle /
  levelUpOutOfBattle / itemUsed / tradeCompleted / other) +
  MidFightEvolutionPrompt (title/body/confirm "Let it evolve" /
  cancel "Stop evolution", canCancel always true) + buildMidFightPrompt
  + locked showcase Pupbble (013) → Terradog (014), Cowboy Kid.
  NEED TO MAKE: BattleView + party wiring per the checklist at the end
  of evolution-hook.ts. Cancelling must not consume the level-up/item/
  trade. No move-learn-on-evolution ordering exists yet (prompt runs
  after evolution resolves, per checklist).

## Element mapping — what is asserted vs placeholder
- Used for theme assignment only (not as a type-chart claim):
  Aqua→WATER, Chrome→STEEL, Core→GROUND/ROCK, Strike→FIGHTING,
  Flame→FIRE, Umbral→GHOST/DARK, Aero/Wind→FLYING, Bug/Silk→BUG,
  Earth→GROUND, Mythic→PSYCHIC/DRAGON (precedent in species.ts: 003
  PSYCHIC; 009 GHOST; 005 DARK; 038 GRASS).
- MARS-ONLY placeholders (do NOT treat as mapped): Beast, Flora, Neon.
  Species with those elements got moves by theme/name, and any STAB
  claim for them is UNCONFIRMED until Mars maps them. Flora species
  were given GRASS-themed moves (Sproutle is GRASS in species.ts), but
  that is theme assignment, not a Flora→GRASS chart mapping.
- No Ghost-element / Poison-element mapping is asserted for the roster
  (roster has no Ghost element and no Poison element as elements;
  poison appears as a move effect, e.g. Toxitacle's poison moves).

## Mars-only placeholders — explicitly NOT invented here
- Pebblefist (035) HP: null in tolerant parse (roster line 266 literally
  says `"hp": 4-5`, not a number). No HP value is used anywhere in this
  slice (learnsets/evolutions carry no stats).
- Dorowani (#147) / Gabu (#148): not in the 47-roster; no stats,
  learnsets, evolutions, or moves invented for them.
- Beast / Flora / Neon element mappings (above).
- HM assignments, evolution-item ids, evolution-location ids (types
  exist; ids do not).
- Capsule price/rate, starter stats for 147/148, Kaggle dataset — out of
  scope for this slice, untouched.

## Roster-file typos (tolerant parse, repo file NOT edited)
- Line 14: `"atk: 63` — missing closing quote after atk (Tiidebiite 002).
  Repaired in-memory to `"atk": 63`.
- Line 266: `"hp": 4-5` — Pebblefist 035 HP is not a number. Repaired
  in-memory to `"hp": null` (Mars-only placeholder, not a value).
- A strict json.load of global_roster.json FAILS on these two lines.
  The coordinator's PR batch should fix the repo file (2 lines) or the
  next slice keeps carrying the tolerant parse. This slice did not edit
  the repo file (staged-only rule).

## species.ts drift — coordinator must resolve BEFORE a PR batch
Staged files follow global_roster.json (per task). species.ts disagrees:
- 003: code "Aquari-OS" vs roster "AquariiOS".
- 005: code "Chromedile" vs roster "Chromejaww".
- 039: code "Dreadtoise" vs roster 039 "Shellguard" (roster 040 is
  "Dreadtoise"). The code's 039 block is, by roster numbering, the
  040 species under the wrong id.
- 038 Sproutle stats: code 50/60/50/40/40/30 vs roster
  55/68/64/45/55/31.
- species.ts has 7 evolution fields (001, 002, 004, 005, 007, 008, 038);
  staged evolutions.json has all 29 roster links. Merging without
  resolving the 039 id drift would attach Shellguard's learnset to a
  "Dreadtoise" entry. Do NOT merge blindly.

## PR-batch readiness
READY to be picked up as one batch (after drift resolution above):
moves-catalogue.ts (merge into MOVES_DB), moves-provenance.json,
learnsets.json, evolutions.json, evolution-hook.ts (wire later).
NOT ready: live battle use (new effect tokens unwired, mid-fight hook
unwired, species.ts still 12/47), HM assignments, TM expansion.
