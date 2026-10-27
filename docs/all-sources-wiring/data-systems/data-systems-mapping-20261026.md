# Data systems — cross-gen mapping (Worker 4/6) — 2026-10-26

Sanitized output. No species common names, no character personal names, no
literal dialogue, no dex-entry text, no item/ability display text, no cry
data. Slots are referenced by source constant / slot index / count only.
Move constants (MOVE_*) and system constants (TYPE_*, ITEM_*, ABILITY_*) are
code structure, usable at 100% per Mars 2026-10-26 20:39: swap out ONLY
species/characters, species names, images, logos, literal dialogue, and
cries (cries = a species voice, swap bucket). Everything else — code,
move names/moves, systems, structure, values — is usable at 100%.

Format per system: Source element -> Mochiichao replacement in that exact
spot -> HAVE / NEED TO MAKE, with counts. Percentages carry counts.
Do NOT touch: black2-everything-else/stage2-pr/, wiring/, batch-*.
No git commit, no PR from this staging file. 0 deletions.

## Headline

- Systems mapped: 12/12 = 100% (species, moves, abilities, items, natures,
  types, learnsets, evolutions, trainers, facilities, classes, AI).
- Cross-gen extraction already on main / in generated JSON: see §2 counts.
  This file adds the cross-gen comparison + code-consumption layer on top
  of that extraction; it does not redo the extraction.
- Live-game wiring is a separate step and is NOT 100%: the game still
  carries its own small hand-built tables (see §3, per system). Mapping
  100% != wired 100%.
- Mars-only decisions still owed are listed as OWED, never invented here:
  item display text, nature assignments for original creatures, type ->
  True Elements final lock (see §Types — rulings landed 21:01–21:02
  CDT, updated 21:09 CDT, Deep-psychic question 21:10 CDT with NO
  ruling, resolved 21:13 CDT Option A: list locked at 19,
  matchups + wiring still owed, listed as decided / withdrawn /
  superseded / open, not extended),
  facility level rules, class/role renames, AI assignments beyond
  story-justified cases.

## 1. How to read the code flow (all gens, same pattern)

1. Static table, indexed by ID constant (species / move / item / ability /
   nature / type / trainer / class). No runtime database lookup.
2. A runtime instance struct holds only: species ID, level, stats/IVs,
   moves (max 4 in Gen 3–5), PP per move slot, held item ID, ability
   slot, nature (derived from personality value in Gen 3), status.
3. Battle code reads the static table by ID at the moment of use:
   damage reads move power/type/effect/flags; stat calc reads base
   stats + nature table + growth-rate exp table; type chart reads the
   effectiveness triple list; AI reads move power/type/effect + the
   trainer's aiFlags bitfield; menus read the same tables (bag reads
   item pocket + field/battle function IDs; party menu reads species
   base stats + learnsets).
4. Consequence for Mochiichao wiring: keep the same split — one static
   table per system, indexed by ID; one instance struct; battle/menu
   code reads by ID, never copies display text into battle logic.

## 2. Extraction already HAVE (counts, verified on disk 2026-10-26)

All counts below are the generated JSONs in
fresh-start/src/lib/generated/ plus the Black 2 res/ dirs, re-counted
on disk this pass unless marked "per brief".

| System | Gen 1 | Gen 2 | Gen 3 FireRed | Gen 3 Emerald/Ruby | Gen 4 Diamond | Gen 4 HeartGold | Gen 5 Black 2 |
|---|---|---|---|---|---|---|---|
| Species slots | 151 | 251 | 386 | 386 | 500 | 507 | 652 |
| Moves | 165 | 251 | 354 | 354 | 470 | see note | 560 |
| Level learnset entries | 755 | 2,215 | 4,052 | 3,972 | 6,597 | — | 9,604 |
| TM/HM entries | 725 | 6,592 | 8,927 | 8,927 | 17,812 | — | 20,604 |
| Tutor entries | — (none) | — (in TM/HM line) | 2,388 | 5,309 (Emerald) / 0 (Ruby: no per-species tutor table found) | — | — | 7,117 |
| Egg entries | 0 (no breeding Gen 1) | 480 | see egg_moves.h | 973 | — | — | 2,773 |
| Evolutions (total / species with) | 72 / 70 | 122 / 113 | 184 / 172 | 184 / 172 | 246 / 229 | 247 / 229 | 321 / 303 |
| Trainers / party members | 364 party rows, 47 class groups (summary only) | 541 / 1,254 | — (see trainers.h, 2,969 TRAINER_ lines incl. parties) | 854 / 1,825 | 849 / 1,585 | 738 / 1,776 | 814 / 1,808 |
| Abilities (Black 2 res/) | — | — | 78 constants incl. NONE (Gen 3 file) | same Gen 3 set | — | — | 165 files (166 files incl. schema) |
| Items (Black 2 res/) | — | — | 434 ITEM_ constants (Gen 3 file) | same Gen 3 set | — | — | 639 data.json dirs |
| Natures | — | — | 25 | 25 | 25 | 25 | 25 files (26 incl. schema) |
| Types | — | — | 17 + TYPE_NULL slot | 17 | 17 | 17 | 17 files (18 incl. schema) |

Notes:
- HeartGold moves: no separate HeartGold moves JSON on main in this
  pass; HeartGold species/evolutions/trainers are HAVE, HeartGold
  moves/learnsets are a gap (see §3 Moves, NEED).
- Gen 5+ (pokeapi-src, ~/workspace/mochiichao-work/gen5plus/):
  species in scope 532, moves union 871 (452 introduced Gen 5+,
  714 referenced by Gen 5+ level learnsets), level entries 8,541
  deduplicated, evolutions 380, 0 unresolved in all three. This is a
  post-Gen-5 supplement, NOT a replacement for the Black 2 652.
- Batches A–C per brief (items 639, abilities 165, natures 25,
  types 17, facilities 1,285 trainers + 6,000 sets, classes 237,
  AI 14): the first five counts re-verify exactly against Black 2
  res/ on disk this pass (639 / 165 / 25 / 17). Facilities 1,285 +
  6,000 and classes 237 and AI 14 were NOT re-verified to those exact
  totals on disk in this pass — they are carried as brief-claimed,
  flagged OWED-VERIFY in §3 Facilities/Classes/AI. FireRed alone
  contributes 107 TRAINER_CLASS_ constants and a separate
  FACILITY_CLASS -> pic lookup table; Black 2 trainers alone use
  126 distinct class keys; HeartGold 83; Emerald 64; Diamond 96.
  Union across gens is therefore >237 in raw keys — the 237 figure
  needs a deduped cross-gen class table before it can be claimed.
- Black 2 battle-facility trainers are a separate, smaller set not
  yet extracted (known gap from 2026-10-25).

## 3. System-by-system mapping

### 3.1 Species — structure HAVE, conversion mapping NEED

- Source: FireRed src/data/pokemon/species_info.h (struct SpeciesInfo,
  indexed [SPECIES_*]): baseHP/Attack/Defense/Speed/SpAttack/SpDefense,
  types[2], catchRate, expYield, evYield[6], itemCommon/itemRare,
  genderRatio, eggCycles, friendship, growthRate, eggGroups[2],
  abilities[2], safariZoneFleeRate, bodyColor, noFlip.
  -> Mochiichao replacement in that exact spot: same struct shape,
  same field order, Mochiichao roster slot ID in place of the source
  constant. Species common name / dex text / image / cry: SWAP BUCKET,
  never carried over.
  -> HAVE: struct shape + 386/386 FireRed slots, 652/652 Black 2
  slots (base_stats + types + catch_rate + ev_yields + egg_groups +
  abilities + hidden_ability + growth_rate + held_items +
  gender_ratio + hatch_cycles + base_friendship + forms), 507
  HeartGold, 500 Diamond, 251 Crystal, 151 Yellow.
  -> NEED TO MAKE: 1/1 conversion table mapping decomp slot index ->
  Mochiichao roster slot (47 slots in global_roster.json; 12 slots
  in species.ts). 0/1 done. Mars-only: which decomp slot maps to
  which original creature — OWED, not guessed here.
- Consumers (FireRed): pokemon.c CreateMon / CalculateMonStats
  (base stats + IV + nature + level, via gSpeciesInfo[species]),
  GetMonData/MON_DATA_* fields, exp via
  gExperienceTables[gSpeciesInfo[species].growthRate][level],
  ability slot pick in CreateMon (abilities[1] if present).
  HeartGold: files/poketool/personal/personal.json + evo.json,
  consumed by personal data accessors + battle setup.
  Black 2: res/pokemon/*/data.json, consumed by generated data
  tables (schema-checked), not by hand-written C structs.
- Cross-gen conflicts:
  (a) Gen 1 has ONE baseSpecial stat, not SpAttack/SpDefense split.
      Any Gen 1 -> later-gen merge must split or carry a single-stat
      legacy flag; do not silently duplicate the value into both.
  (b) Gen 2 has NO abilities field; Gen 3+ has abilities[2];
      Black 2 adds hidden_ability as a third slot.
  (c) Gen 4 Diamond JSON = 500 entries = 493 national slots + form
      extras + 2 egg placeholders (10 in every stat, not battle
      species). HeartGold = 507 slots, 508 raw entries incl. NONE.
      Slot counts differ by form/placeholder handling, not by roster.
  (d) FireRed species JSON on main drops evYield/item/gender/
      friendship/bodyColor fields present in the source .h — the
      source file is the authority, the JSON is a subset. NEED:
      1 field-completeness pass over the FireRed JSON (fields
      present 13, fields in source ~22).

### 3.2 Moves — HAVE for Gen 3/5, NEED HeartGold + effect wiring

- Source: FireRed src/data/battle_moves.h (struct BattleMove,
  indexed [MOVE_*]): effect, power, type, accuracy, pp,
  secondaryEffectChance, target, priority, flags
  (MAKES_CONTACT / PROTECT_AFFECTED / MIRROR_MOVE_AFFECTED /
  KINGS_ROCK_AFFECTED, etc.).
  -> Mochiichao replacement: same struct, MOVE_* constant kept
  (move names explicitly usable), same field order.
  -> HAVE: 354/354 FireRed, 354 Emerald/Ruby, 251 Crystal, 165
  Yellow, 470 Diamond, 560/560 Black 2 (res/moves/*/data.json:
  type, category, power, accuracy, pp, priority, effect,
  target, flags, hits min/max, inflicts condition/probability/duration,
  crit_stage, flinch_chance, drain, heal, stat_changes).
  -> NEED: HeartGold moves table (0/1 — no HeartGold moves JSON
  on main); effect-code wiring: battle_script_commands.c effect
  dispatch (EFFECT_* -> script) is not yet a Mochiichao module
  (0/1 module; battle-math.ts covers damage/accuracy/priority/
  speed/STAB/type/crit/random/effects for a subset only).
- Consumers: battle_util.c (power==0 = status check for Taunt,
  target resolution via gBattleMoves[move].target, contact-flag
  checks for abilities/items), battle_ai_script_commands.c
  (AI reads power/type/effect per considered move),
  pokemon.c (PP initialised from gBattleMoves[move].pp on learn/
  create), battle_controller_opponent.c (target-bit check).
- Cross-gen conflicts:
  (a) Gen 3 and earlier have NO category field. The generated JSONs
      record derivedCategory only (power 0 = Status; elemental
      types = Special; else Physical). Black 2 HAS an explicit
      category field. Never present a derived category as a source
      field.
  (b) Gen 1 move table has NO effect-probability field; Gen 2 spellings
      differ from Gen 3 (recorded as-is in the Crystal JSON).
  (c) Black 2 move JSON adds fields Gen 3 lacks: hits, inflicts,
      drain, heal, stat_changes, quality. A unified move struct
      must be the Black 2 superset with Gen 3 fields mapped into
      it, not the Gen 3 struct with Black 2 fields dropped.

### 3.3 Abilities — HAVE 165/165 (Black 2), NEED effect wiring

- Source: Black 2 res/abilities/*.json (165 + schema): description
  field present in source but NOT quoted here (display text is
  not battle logic). FireRed include/constants/abilities.h:
  78 constants incl. NONE; species_info.h abilities[2] per species.
  -> Mochiichao replacement: ABILITY_* constant in the species
  abilities[2] / hidden slot, same position.
  -> HAVE: 165/165 Black 2 ability files counted; 78/78 Gen 3
  constants counted.
  -> NEED: ability effect code — FireRed ability effects live in
  battle_util.c / battle_script_commands.c as per-ability branches,
  not in the ability table itself. 0/1 Mochiichao ability-effect
  dispatch module. Mars-only: which original creature gets which
  ability slot — OWED where it is a new assignment, not a slot
  conversion.
- Consumers: battle_util.c contact/type/immunity checks,
  pokemon.c ability-slot pick, AI switch/item code (ability-aware
  type checks).
- Conflict: Gen 1/2 have no abilities at all. Any Gen 1/2 species
  slot carried forward gains abilities[2] = NONE unless Mars
  assigns — do not backfill from later gens silently.

### 3.4 Items — HAVE 639/639 (Black 2), NEED description/function wiring

- Source: Black 2 res/items/*/data.json (639): price, hold_effect,
  hold_param, pluck/fling effects + power, natural_gift power/type,
  important, registrable, field_pocket, battle_pocket, field_func,
  battle_func, kind, sort_index, effects list. FireRed
  src/data/items.json + include/constants/items.h (434 constants)
  + src/data/pokemon/item_effects.h (hold-effect table).
  -> Mochiichao replacement: ITEM_* constant in the same pockets
  (field_pocket / battle_pocket) and same hold_effect slot.
  -> HAVE: 639/639 Black 2 item dirs counted; 434 Gen 3 constants
  counted; item_effects.h structure read.
  -> NEED: 1/1 Mochiichao item catalogue — display text for
  original items is Mars-only (OWED, not invented here); field_func
  / battle_func dispatch (function IDs, not text) is the wiring
  step (0/1 module). Bag/pocket order = sort_index, not
  alphabetical.
- Consumers: bag.c (pocket + field_func), battle item use
  (battle_func + hold_effect on equip/trigger), species held_items
  common/rare/very_rare (Black 2 adds very_rare; Gen 3 has
  common/rare only — conflict, see below).
- Conflict: held-item slots differ by gen (Gen 3: 2 slots;
  Black 2: 3 slots). Unified struct = 3 slots, Gen 3 rare -> rare,
  very_rare = NONE unless sourced.

### 3.5 Natures — HAVE 25/25, NEED Mochiichao assignment

- Source: FireRed include/constants/pokemon.h NATURE_* 0–24
  (25 total) + src/pokemon.c sNatureStatTable[25][5]
  (Attack/Defense/Speed/Sp.Atk/Sp.Def, values +1/0/-1) +
  ModifyStatByNature: +1 -> stat*110/100, -1 -> stat*90/100,
  HP/Accuracy/Evasion never modified; nature derived from
  personality value (GetNatureFromPersonality).
  Black 2 res/natures/*.json: 25 files, name-only files — "what
  it does is the code's" (schema comment).
  -> Mochiichao replacement: same 25-slot table shape, same
  +10%/-10% rule, Mochiichao nature slot in place of NATURE_*.
  -> HAVE: 25/25 constants + 25/25 table rows + formula.
  -> NEED: Mochiichao nature assignments (which original creature
  / which name) — Mars-only, OWED, not invented here. The
  +1/0/-1 table itself is source structure and is HAVE.
- Consumers: pokemon.c CalculateMonStats (ModifyStatByNature
  applied per non-HP stat), CreateMonWithNature.
- Conflict: none in count (25 in every gen from Gen 3 on). Gen 1/2
  have no natures — same backfill rule as abilities (NONE-equivalent
  = no modifier, do not invent).

### 3.6 Types — HAVE 17/17 source, Mars rulings in progress, wiring NEED

- Source: FireRed src/battle_main.c gTypeEffectiveness[336]:
  112 triples (attacking type, defending type, multiplier),
  multiplier fixed-point: 20 = x2.0 SUPER_EFFECTIVE, 10 = x1.0
  NORMAL, 05 = x0.5 NOT_EFFECTIVE, 00 = x0.0 NO_EFFECT.
  Access macros in include/battle_main.h
  (TYPE_EFFECT_ATK_TYPE / DEF_TYPE / MULTIPLIER).
  Black 2 res/types/*.json: 17 files, name-only; the chart itself
  is code/data elsewhere in Black 2, not in these files.
  -> Mochiichao replacement: True Elements chart in the same
  triple-list shape, same multiplier encoding.
  -> HAVE: 17/17 Black 2 type files; 112/112 FireRed triples
  located; live game constants.ts already encodes an 18-type
  chart (super/notVery/noEffect lists) — see conflict.
  -> NEED: True chart wiring (0/1): per 2026-10-26 21:01–21:02
  Mars rulings, battleTypeChart.ts (True chart) exists but NO
  battle code uses it; BattleView still uses constants.ts;
  species.ts still carries source type words. Wiring is owed
  AFTER the 18-vs-19 lock (below), not before.
- Mars True Elements rulings (2026-10-26 21:01–21:02, recorded,
  not extended here):
  Decided: Electric, Grass, Frost (for Ice), Toxic (for Poison),
  Cryptid (for Fairy, picked with hesitation), Paranormal (for
  Ghost), Water itself (roster word Aqua = Water rename, 10
  creatures), Dark only (split, not Dark+Ghost), Dragon only
  (split, not Psychic+Dragon).
  Decided, update1 2026-10-26 21:09 CDT (supersedes the Deep
  hypothesis below): Earth = Ground CONFIRMED (Earth keeps the
  Ground slot; Earth 3 creatures; canine line reads Normal +
  Ground under Beast -> Normal); Clairvoyant = Psychic name
  CONFIRMED FIRM (no longer tentative).
  Qualified: Normal probably (Beast -> Normal, filled by 6 Beast
  creatures), Wind folded (Aero folded, decided as a fold).
  WITHDRAWN, do not use: Deep = Ground hypothesis, and the
  Deep = Ground + Earth-steps-aside = 18 reconciliation built on
  it — both dead once Earth = Ground was confirmed.
  Deep, working direction only (21:09, NOT locked): something
  way underground, like a different version of mythical like
  dragon — a legendary depth force, NOT regular Ground, NOT
  just another Dragon; Deep is a separate canonical element,
  0 creatures, never defined before, matchups none set.
  Deep, QUESTION only (21:10, NO ruling made): Mars reconsidering
  — Deep might have been psychic. Options on record, Mars
  decides, none chosen here: (A) Deep stays separate mystical
  legendary, Clairvoyant stays Psychic, count 19; (B) Deep
  BECOMES Psychic, Clairvoyant retired/repurposed, count drops
  to 18 (only route back to 18 that does not touch Earth — but
  it undoes the minutes-old Clairvoyant firming); (C) Deep stays
  its own element but psychic-flavored = deep mind/subconscious
  vs Clairvoyant = clear foresight, count 19. Blend names
  judged on record: Deepsight (cleanest), Subconscious (exact
  deep-mind concept), Undermind (workable), Abyssal (drops the
  psychic root), Deepmind AVOID (company name collision), or
  keep 'Deep' with a psychic definition. Recommendation on
  record (Mars decides): leave separate mystical legendary,
  psychic side in the definition; rename only if the name must
  say psychic, then Deepsight.
  RESOLVED, update3 2026-10-26 21:13 CDT (Mars answered 'A' to
  the Deep fork; this supersedes the 21:10 open question):
  Deep stays a SEPARATE mystical legendary (way-underground
  primordial depth force; NOT Ground, NOT Psychic itself, NOT
  renamed); Clairvoyant stays Psychic (no retirement); count
  19 STANDS (no fold ruled). Locked True list, 19 concepts:
  Water (Aqua), Chrome (Steel), Earth (Ground), Bug, Umbral
  (Dark), Aero (Wind/Flying), Core (Rock), Strike (Fighting),
  Deep (separate mystical legendary), Flame (Fire), Mythic
  (Dragon), Normal (Beast), Neon (Electric), Flora (Grass),
  Frost (Ice), Toxic (Poison), Cryptid (Fairy), Paranormal
  (Ghost), Clairvoyant (Psychic).
  Still OWED, Mars-only: Deep + new-element matchup values,
  then True chart wiring (list now locked; matchups still
  owed). The 21:10 options (B)/(C) and blend names are now
  superseded history, kept above for audit only, not live
  options.
  Electric+Flying answered as Neon + Aero (Flying PLUS Neon),
  no creature guessed.
  Gen 2 rule (standing): everything made next is Gen 2+; current
  47 are Gen 1 by implication; later evolutions may introduce
  secondary + tertiary types (tertiary = third type slot,
  Mochiichao direction, not implemented) — do not retype
  type-adjacent creatures now.
- Cross-gen conflicts:
  (a) Source gens have 17 types; the live game has 18 (adds
      Fairy/Cryptid slot). Any merge must state the 18th slot's
      matchups explicitly — it has no FireRed triple.
  (b) Black 2 type files carry NO matchups. Do not claim the
      Black 2 chart from res/types/*.json alone.
  (c) Type count vs True count: 17 source vs 19 ruled vs 18
      target — the lock is OWED, see above.

### 3.7 Learnsets — HAVE per-gen, NEED unified loader

- Source shapes differ by gen (this is the biggest structural
  conflict in the lane):
  FireRed: level_up_learnsets.h (level,move pairs, 4,052) +
  level_up_learnset_pointers.h + tmhm_learnsets.h (bitfield,
  8,927) + tutor_learnsets.h (2,388) + egg_moves.h.
  Emerald: same shape, tutor 5,309 (different tutor set from
  FireRed — same file name, different contents).
  Crystal/Yellow: evos_attacks.asm (level + evo in one file) +
  base_stats tmhm lines (Gen 2 tmhm = combined TM/HM/tutor
  list, 6,592; Gen 1 tmhm 725).
  Diamond: personal/wotbl.json (level, 6,597) + personal.json
  tms/hms (17,812, via items.h TM/HM -> move map, 92 TM + 8 HM).
  HeartGold: wotbl equivalent exists in poketool but no
  HeartGold learnsets JSON on main (gap, same as moves).
  Black 2: per-species data.json learnset object: by_level
  (9,604), by_tm (20,604, TM/HM codes not move constants —
  needs the TM -> move map), by_tutor (7,117), egg_moves (2,773).
  -> Mochiichao replacement: one unified learnset object per
  species slot with four channels (level / machine / tutor /
  egg), TM codes resolved to MOVE_* via the gen's TM map.
  -> HAVE: all per-gen counts above; 0 unresolved moves in
  Black 2, FireRed, Emerald, Diamond learnsets.
  -> NEED: 1/1 unified loader (TM-code resolution + tutor-set
  union rule for FireRed-vs-Emerald conflict) + HeartGold
  learnsets JSON (0/1).
- Consumers: pokemon.c (learn on level-up, PP from move table),
  party/menu move learning, TM/HM menu (machine -> move map),
  tutor menu, breeding (egg channel + eggGroups).

### 3.8 Evolutions — HAVE, NEED trigger wiring

- Source: FireRed src/data/pokemon/evolution.h:
  gEvolutionTable[NUM_SPECIES][EVOS_PER_MON], entries
  {method, param, target}: EVO_LEVEL (param = level),
  EVO_ITEM (param = ITEM_*), EVO_TRADE, EVO_TRADE_ITEM,
  EVO_FRIENDSHIP, plus Gen 4/5 extensions (Black 2:
  EVO_METHOD_LEVEL, KNOWS_MOVE, and others — 321 total).
  -> Mochiichao replacement: same {method, param, target-slot}
  triple, target = Mochiichao roster slot, param = level /
  item constant / move constant as in source.
  -> HAVE: 184 FireRed, 184 Emerald/Ruby, 246 Diamond,
  247 HeartGold, 321 Black 2, 122 Crystal, 72 Yellow,
  380 Gen 5+; 0 unresolved targets in Black 2 / FireRed.
  -> NEED: evolution trigger code in the live game (level-up
  check, item-use check, trade/friendship equivalents) — 0/1
  module; Mars-only: trade/friendship equivalents for
  original creatures are OWED, not auto-converted to level
  (the FireRed JSON note already preserves methods exactly).
- Consumers: pokemon.c level-up / item-use / trade evolution
  checks, party menu evolution prompt.
- Conflict: branching (one source -> 2+ targets, e.g. item-split
  and day/night friendship branches in later gens) vs linear
  chains — the table shape already supports branches
  (EVOS_PER_MON > 1); the live game's species.ts evolution
  field is single-target only (1 target) and must be widened
  to a list (NEED).

### 3.9 Trainers — HAVE, NEED ai_flags backfill + name swap

- Source: FireRed src/data/trainers.h (struct Trainer:
  trainerClass, encounterMusic_gender, trainerPic, trainerName
  [blanked in this decomp's trainer entries — names live in
  a separate text table], items[4], doubleBattle, aiFlags,
  party macro: NO_ITEM_DEFAULT_MOVES / ITEM_CUSTOM_MOVES /
  etc.) + trainer_parties.h (party rows: species, level, item,
  moves where custom).
  HeartGold files/poketool/trainer/trainers.json: type, class,
  items, ai_flags (integer bitfield; 13 distinct values seen),
  double, party, messages (messages = dialogue — SWAP BUCKET,
  stripped in the generated JSON).
  Black 2 res/trainers/data/*.json: class, battle_style
  (SINGLE/DOUBLE etc.), items, ai_flags list, heals, money,
  reward (ITEM_*), party[{species, form, level, difficulty,
  gender, ability}] — note: the generated
  decomp_black2_trainers.json on main DROPS ai_flags, items,
  heals, money, reward, messages vs the source files.
  -> Mochiichao replacement: same struct, class -> Mochiichao
  role slot (rename OWED), party species -> roster slots,
  personal name -> Mochiichao character (SWAP BUCKET if it is
  a source character; original characters are Mars-only).
  -> HAVE: 814 Black 2, 738 HeartGold, 854 Emerald, 849
  Diamond, 541 Crystal, 364 Yellow party rows.
  -> NEED: (1) Black 2 generated-trainer backfill: ai_flags /
  items / heals / money / reward (0/1 pass — fields exist in
  source, missing in generated JSON); (2) class/role renames
  (0/1 table, Mars-only, OWED); (3) trainer personal-name
  swap table (0/1, Mars-only).
- Consumers: battle_setup.c (trainer -> party load, aiFlags ->
  AI script select), battle_controller_opponent.c, money/
  reward on win, double-battle flag -> 2v2 setup.

### 3.10 Facilities — HAVE structure, NEED set tables + level rules

- Source: FireRed src/data/battle_tower/level_50_mons.h +
  level_100_mons.h (3,903 lines each; facility mon sets at
  fixed levels 50 / 100) + src/battle_tower.c + trainer_tower.c
  + trainer_tower_sets.c + src/data/pokemon/
  trainer_class_lookups.h (FACILITY_CLASS -> pic index).
  Emerald src/data/battle_frontier/: battle_frontier_mons.h
  (6,177 lines), battle_frontier_trainers.h (2,403 lines),
  battle_frontier_trainer_mons.h (7,369 lines),
  battle_pyramid_*_wild_mons.h, battle_tent.h, trainer_hill.h,
  apprentice.h, battle_frontier_exchange_corner.h.
  Black 2: subway / tower code in src/ov012/bsubway_*,
  src/ov061/scrcmd_black_tower.c, save headers
  (bsubway_save.h) — facility trainer data is code-driven,
  not in res/trainers/data/.
  -> Mochiichao replacement: facility = a roster of fixed-level
  sets + a facility trainer table + a streak/record system,
  in the same slots (level-50 set table, level-100 set table,
  facility class -> pic lookup).
  -> HAVE: file structure + line counts above; FireRed tower
  set files located.
  -> NEED: (1) facility set counts verified — brief-claimed
  1,285 trainers + 6,000 sets NOT re-verified here (OWED-VERIFY);
  (2) facility level rules — Mars-only (OWED, not invented);
  (3) Black 2 facility trainer extraction (0/1 — separate from
  the 814 story trainers); (4) streak/record wiring (0/1).
- Consumers: battle_tower.c / frontier_util.c (set pick by
  streak/level bracket, facility class -> sprite, record save).

### 3.11 Classes — HAVE raw keys, NEED deduped table

- Source: FireRed include/constants/trainers.h: 107
  TRAINER_CLASS_ constants; trainer_class_lookups.h:
  FACILITY_CLASS -> TRAINER_PIC_*.
  Black 2 trainers: 126 distinct class keys. HeartGold: 83.
  Emerald: 64. Diamond: 96. Crystal: class-grouped parties
  (class is the group key, not a per-trainer field in the
  generated JSON — 1 distinct key recorded, i.e. missing,
  not 1 class).
  -> Mochiichao replacement: one deduped class table
  (class ID -> pic index -> encounter music -> money rate),
  Mochiichao role slot in place of each source class.
  -> HAVE: raw per-gen key counts above.
  -> NEED: 1/1 deduped cross-gen class table (brief-claimed
  237 NOT verified — raw union already exceeds 237 before
  dedup, so the 237 figure must be a deduped subset or a
  single-gen count; OWED-VERIFY); role renames Mars-only
  (OWED); Crystal class extraction (0/1 — group keys need
  splitting into per-trainer class values).
- Consumers: battle_setup (class -> pic/music/money),
  trainer card / vs screen (class -> display), facility
  lookup (facility class -> pic).

### 3.12 AI — HAVE flag sets, NEED script wiring

- Source: FireRed include/constants/battle_ai.h: AI_SCRIPT_*
  bitfield — CHECK_BAD_MOVE (1<<0), CHECK_VIABILITY (1<<1),
  TRY_TO_FAINT (1<<2), SETUP_FIRST_TURN (1<<3), RISKY (1<<4),
  PREFER_STRONGEST_MOVE (1<<5), PREFER_BATON_PASS (1<<6),
  DOUBLE_BATTLE (1<<7), HP_AWARE (1<<8), UNKNOWN (1<<9),
  ROAMING (1<<29), SAFARI (1<<30), FIRST_BATTLE (1<<31).
  Implementation: src/battle_ai_script_commands.c (per-move
  scoring: power/type/effect reads, discouraged-effect lists,
  viability checks) + src/battle_ai_switch_items.c
  (switch/item scoring, ModulateByTypeEffectiveness using the
  same gTypeEffectiveness triples).
  HeartGold: src/battle/trainer_ai.c (aiFlags -> trainerAIData,
  AI_DOUBLES flag OR-ed in for doubles) + battle system
  trainer data aiFlags field.
  Black 2: trainer ai_flags lists in source files (e.g.
  BASIC / EVAL_ATTACK / EXPERT pattern) — but dropped in the
  generated JSON (see §3.9 NEED 1).
  -> Mochiichao replacement: same bitfield + same scoring
  commands, AI flag set per trainer/class in the trainer table.
  -> HAVE: 14/14 named FireRed flag bits located (11 lower bits
  + 3 high special bits = 14 defined); HeartGold AI entry
  points located; Black 2 flag vocabulary sampled.
  -> NEED: (1) Black 2 AI backfill (same pass as §3.9);
  (2) 1/1 Mochiichao AI scoring module (battle-math.ts covers
  damage only, not move scoring / switch / item use);
  (3) AI assignments per trainer beyond story-justified cases
  — Mars-only (OWED); brief-claimed "AI 14" is consistent
  with the 14 FireRed bits, but cross-gen AI vocabularies
  (HeartGold/Black 2 flags) are NOT yet unified — OWED-VERIFY
  whether 14 is FireRed-only or cross-gen.
- Consumers: battle_setup (aiFlags -> script set), AI turn
  (score each move, score switch, score item), opponent
  controller (AI-chosen move execution).

## 4. Files read (paths, this pass)

- fresh-start/pokefirered-leafgreen/src/data/pokemon/species_info.h
- fresh-start/pokefirered-leafgreen/src/data/battle_moves.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/evolution.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/level_up_learnsets.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/tmhm_learnsets.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/tutor_learnsets.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/egg_moves.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/experience_tables.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/item_effects.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/trainer_class_lookups.h
- fresh-start/pokefirered-leafgreen/src/data/pokemon/cry_ids.h (existence only — cry data NOT used, swap bucket)
- fresh-start/pokefirered-leafgreen/src/data/trainers.h
- fresh-start/pokefirered-leafgreen/src/data/trainer_parties.h (referenced)
- fresh-start/pokefirered-leafgreen/src/data/items.json
- fresh-start/pokefirered-leafgreen/src/data/battle_tower/level_50_mons.h
- fresh-start/pokefirered-leafgreen/src/data/battle_tower/level_100_mons.h
- fresh-start/pokefirered-leafgreen/src/battle_main.c (gTypeEffectiveness, 112 triples)
- fresh-start/pokefirered-leafgreen/src/battle_util.c (move/type/ability reads)
- fresh-start/pokefirered-leafgreen/src/battle_ai_script_commands.c
- fresh-start/pokefirered-leafgreen/src/battle_ai_switch_items.c
- fresh-start/pokefirered-leafgreen/src/pokemon.c (CreateMon, CalculateMonStats, ModifyStatByNature, sNatureStatTable)
- fresh-start/pokefirered-leafgreen/src/battle_tower.c, src/trainer_tower.c, src/trainer_tower_sets.c
- fresh-start/pokefirered-leafgreen/include/constants/abilities.h, items.h, pokemon.h, trainers.h, battle_ai.h
- fresh-start/pokefirered-leafgreen/include/battle_main.h (type macros)
- fresh-start/pokeheartgold/files/poketool/personal/personal.json, evo.json, growtbl.csv
- fresh-start/pokeheartgold/files/poketool/trainer/trainers.json
- fresh-start/pokeheartgold/files/poketool/waza/ (narc container — table not yet JSON-extracted, see gap)
- fresh-start/pokeheartgold/src/battle/trainer_ai.c
- fresh-start/pokebw2/res/pokemon/*/data.json (schema + sample structure)
- fresh-start/pokebw2/res/moves/*/data.json
- fresh-start/pokebw2/res/abilities/*.json, res/natures/*.json, res/types/*.json
- fresh-start/pokebw2/res/items/*/data.json
- fresh-start/pokebw2/res/trainers/data/*.json
- fresh-start/pokebw2/src/ov012/bsubway_trainers.c, src/ov061/scrcmd_black_tower.c (existence)
- fresh-start/src/lib/generated/decomp_*.json (all gens, counts re-read)
- fresh-start/src/lib/species.ts, moves.ts, types.ts, constants.ts, global_roster.json (live-game side)
- decomps/pokeemerald/src/data/battle_frontier/*.h (file list + line counts)
- gen5plus/gen5plus_summary.json, gen5plus_*.json (counts)
- all-sources-wiring/COORDINATOR-INVENTORY-20261026.md (lane assignment only)

## 5. Gaps to 100% (with counts — percentage rule)

Mapping itself: 12/12 systems = 100%.
Wiring / conversion (the work after this file): counted NEEDs below.
Total NEED items listed: 20.

1. Species conversion table (decomp slot -> roster slot): 0/1.
2. FireRed species JSON field-completeness pass: 0/1 (13 fields present vs ~22 in source).
3. HeartGold moves JSON: 0/1.
4. HeartGold learnsets JSON: 0/1.
5. Move effect dispatch module (EFFECT_* -> script): 0/1.
6. Ability effect dispatch module: 0/1.
7. Mochiichao item catalogue display text: 0/1 (Mars-only).
8. Item field/battle function dispatch module: 0/1.
9. Mochiichao nature assignments: 0/1 (Mars-only).
10. True Elements lock, updated 21:13 (Option A): list LOCKED at 19 concepts (see §3.6); 0/2 wiring inputs still owed (Deep + new-element matchup values, then True chart wiring). Decided and NOT reopened here: Earth = Ground, Clairvoyant = Psychic firm, Deep separate mystical legendary, count 19 stands. Withdrawn/superseded: Deep = Ground hypothesis + its 18-reconciliation; Deep-becomes-Psychic option (B) and psychic-flavored option (C).
11. True chart wiring (BattleView -> True chart): 0/1.
12. Unified learnset loader (TM resolution + FireRed/Emerald tutor union): 0/1.
13. Evolution field widened to list + trigger module: 0/1 (single-target field now).
14. Black 2 generated-trainer backfill (ai_flags/items/heals/money/reward): 0/1.
15. Class/role rename table: 0/1 (Mars-only).
16. Trainer personal-name swap table: 0/1 (Mars-only).
17. Facility set counts verify (1,285 + 6,000 brief-claimed): 0/1.
18. Facility level rules: 0/1 (Mars-only).
19. Black 2 facility trainer extraction: 0/1.
20. Deduped cross-gen class table + AI vocabulary unification + AI scoring module: 0/3 sub-items (class table, AI vocab, scoring module).

Wiring done so far in the live game (for proportion, not a claim of
completion): species.ts 12 slots vs 47 roster slots = 26%;
moves.ts small hand-built table vs 560 Black 2 moves (exact live
count not re-verified this pass — do not quote a live-move % until
counted); types chart present in constants.ts but True chart
unwired (0/1 battle call sites switched).

## 6. What the next worker / PR should do, in order

1. Backfill pass (items 14 + 3 + 4): regenerate Black 2 trainer
   JSON with ai_flags/items/heals/money/reward, and add HeartGold
   moves + learnsets JSONs — all from files already on disk, no
   new extraction design.
2. Unified learnset loader + evolution list widening (items 12 + 13).
3. Mars decisions (items 7, 9, 10, 15, 16, 18) — shown to Mars,
   never guessed.
4. Dispatch modules (items 5, 6, 8, 20-scoring) + True chart
   wiring (item 11) after the 18-lock.
5. Facility verification + extraction (items 17, 19) + class
   dedup (item 20-class).

End of mapping. No deletions made. No commits made. No PR created.
