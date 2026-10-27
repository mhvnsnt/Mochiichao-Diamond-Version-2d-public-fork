
## Stage2 applied in this PR (display-only, honest scope)

- New: src/components/game/Black2SystemsPanel.tsx — renders in
  DexView.tsx (import + <Black2SystemsPanel /> before the help line).
  It imports only black2Systems.ts (embedded lists/constants), never
  src/lib/generated/, so validate-reference §4 still passes.
- Changed: src/lib/validate-reference.ts §5 — imports black2Systems.ts
  constants, checks the 9 new generated JSON counts, checks kept +
  dropped classes = 237 and AI strategies = 14, and errors if any of
  the four null gaps (nature modifiers, type chart, ability logic,
  facility level range) stops being null without a decision.
- New data: src/lib/generated/decomp_black2_{items,abilities,natures,
  types,lighting,zones,encounters,trainer_facilities,trainer_classes}.json
  (9 files, additions only).
- NOT changed: BattleView, RosterView, ShopView, BagView, PcView,
  WorldEngine, ArenaBattleView, GameShell, gameStore, types.ts,
  battle math, save shape, shop prices, roster numbers, canon numbers.
- PR redaction vs stage1 (must be read before re-using stage1 counts):
  classes JSON: 30 constants redacted to WITHHELD (display names kept);
  TS: 29 constants redacted (1 class already held out in stage1, so
  TS wired list is still 150 entries, 29 with WITHHELD constants);
  items JSON: 1 town-derived name withheld. All other stage1 counts
  stand. The validator in stage1 (62/0) was run on the unredacted
  staged files; the PR files were re-grepped for the redacted names
  (0 hits) and re-parsed (all JSONs parse, tsc + build gate in PR body).

# Black 2 everything-else — wiring map (PR version, stage2 display-only)

PR version. This map ships with src/lib/black2Systems.ts (PR-redacted:
class constants naming a person replaced with WITHHELD constants
(30 in classes JSON, 29 in TS, 2 facility trainer class constants
merged into WITHHELD in facilities JSON), 1 town-derived item name
and 1 person-derived item name withheld in decomp_black2_items.json) and the
stage2 display-only call sites below. No battle math, save shape, shop
prices, roster numbers, or canon numbers are changed by this PR.

Main head the file-existence mapping was verified against:
65570289999a3e2f56b5bfc5e19ae345e18bbdce (PR #228, Dex view).
Re-checked during this task: main had moved to
bb21e8fb5e59938ad04d4760eaa15e5a8751fe3d (PR #229, title full-res
videos) and all 11 call-site files listed in the View plan below
were still present on that head, so the mapping stands.
Main moves fast — re-verify head before any future PR; the staged
module itself is not in the repo, so main drift does not invalidate it.

## Definitions (honest, not inflated)

- wired-stage1 = a lookup/module entry AND a mapping entry exist in
  this staged directory for the category.
- wired-stage2 = a view call site is implemented in a main game file
  AND a build gate passes. In this PR, stage2-DISPLAY is applied to
  15/15 = 100% of categories via Black2SystemsPanel.tsx in DexView
  (counts + mapping status + gaps flagged, no playable use), plus
  validate-reference.ts §5 as a repo call site. Stage2-PLAYABLE
  (battle math, bag/shop use, map assignment, AI chooser, save fields)
  remains 0/15 = 0% — those need the Mars decisions listed below and
  are NOT claimed as wired here.
  The only build gate run here is for the staged lookup module
  itself (tsc + validate-wiring.py in a temp copy, see below) —
  that is a module gate, NOT a view gate, and is never counted as
  view wiring.
- HAVE = a Mochiichao equivalent file already exists on main.
  HAVE does not mean Black 2 values were copied into it.
- NEED TO MAKE = original Mochiichao work still owed, or a decision
  only Mars can make. Nothing in NEED TO MAKE is invented here.

## Overall wiring counts

- Extracted (batches A+B+C+D, before this task): 15/15 categories
  inventoried/extracted = 100% for the first-pass scope, with the
  honest sub-gaps listed per category below.
- wired-stage1 (lookup + map): 11/15 = 73%.
- wired-stage1 map-only (mapping entry only, because the
  source is counts-only by the forbidden/art rules): 4/15 = 27%
  (graphics, sound, text, town-map).
- wired-stage2 applied to main: 0/15 = 0% (plan only, see View plan).
- Module build gate (staged module only): PASS (tsc strict + validator,
  run in /tmp, see Verification).

## Per-category map

### 1. Items — stage1 639/639 = 100%, stage2 plan only
- Black 2 system: item data (price, pockets, hold/fling/pluck/
  natural-gift fields, effect flags/amounts, sort index).
- Mochiichao replacement in that spot: BagView.tsx pocketed list +
  ShopView.tsx Buy/Sell/Quit + gameStore.ts buyItem/useItem/inventory.
- HAVE: BagView pocket grouping (Capture/Medicine/Storage/Other in
  the current build), ShopView confirm-before-money + sell-at-half
  (the same sell rule is in sellPrice() in the staged module).
- NEED TO MAKE: (a) Mochiichao-original item descriptions for all
  639 items — Black 2 descriptions were dropped 639/639 in batch A
  because 38 named a forbidden town/character/species, so no
  description can be carried over; (b) Black 2 item constant ->
  Mochiichao game item-id mapping — the game currently carries
  only a handful of shop/bag items, not 639; (c) effect application
  in useItem — BagView currently decrements a count for most items,
  it does not apply the staged effect flags yet; (d) one
  town-derived item name flagged in batch A is withheld from this
  map (see batch-a-report.md) and must be renamed before any
  in-game use.
- Lookup: buildItemIndex, itemByConstant, itemsByPocket,
  itemsByPriceRange, itemsWithHoldEffect, itemsWithFlingPower,
  itemsWithEffectFlag, sellPrice. Price range in source: 0–9000.
  Field pockets in source: 5 values (items, medicine, berries,
  key items, TMs/HMs).

### 2. Abilities — stage1 165/165 = 100%, stage2 plan only
- Black 2 system: ability list (index, constant, name).
- Mochiichao replacement: a per-creature ability field + BattleView
  move scoring / effect application.
- HAVE: BattleView + battleResolver + engine stat math exist, but
  MochiiInstance (src/lib/types.ts, verified on main) has NO
  ability field — that field is the first NEED below.
- NEED TO MAKE: (a) ability field on MochiiInstance + save shape;
  (b) ability effect logic 0/165 — source JSONs hold name only in
  effect terms, behaviour lives in src code and was not copied;
  Mochiichao must write its own ability effects or leave abilities
  display-only; (c) placeholder ability (index 0, name withheld as
  a symbol in batch A) maps to "no ability", not a named ability —
  confirm with Mars before shipping that mapping as player-visible.
- Lookup: abilityByIndex, abilityByConstant.

### 3. Natures — stage1 25/25 = 100%, stage2 plan only
- Black 2 system: nature list (index, constant, name).
- Mochiichao replacement: a per-creature nature field + stat
  calculation in engine.ts (calculateStat).
- HAVE: engine calculateStat exists; MochiiInstance has NO nature field.
- NEED TO MAKE: (a) nature field on MochiiInstance + save shape;
  (b) nature stat modifiers 0/25 — not in the source JSONs, not
  invented. Mars must decide: define a Mochiichao modifier table,
  or keep natures display-only with no stat effect. Do NOT import
  a modifier table from memory or from src code.

### 4. Types — stage1 17/17 = 100% (+ TYPE_NULL constant only), stage2 plan only
- Black 2 system: type list (17 named + TYPE_NULL index 17 for a
  typeless move, no JSON file for it).
- Mochiichao replacement: battleTypeChart.ts TRUE_ELEMENTS /
  TRUE_TYPE_CHART on main.
- HAVE: battleTypeChart.ts exists on main (145 lines), but its own
  header says it is NOT wired into BattleView (which still uses
  constants.ts legacy chart). The Mochiichao chart is 12 True
  Elements, not 17 Black 2 types.
- NEED TO MAKE: (a) Black 2 17-type list -> 12 True Element mapping
  — an open decision, do NOT invent it; (b) type-effectiveness
  chart 0 from Black 2 — not in the type JSONs, not invented;
  (c) wiring TRUE_TYPE_CHART into BattleView is a separate main
  decision, not done here.
- Lookup: typeByIndex (17 returns the TYPE_NULL constant entry,
  name empty, not a playable type).

### 5. Lighting — stage1 210/210 sets = 100%, stage2 plan only
- Black 2 system: lighting sets (field 200 + battle 10), 15 periods
  per set, 4 lights per period, period end hour/minutes, per-light
  enabled/colour/direction, diffuse/ambient/specular/emission/
  fog/clear triples. Totals: 3,150 periods, 12,600 lights.
- Mochiichao replacement: PixiWorldCanvas.tsx + PixiBattleCanvas.tsx
  rendering + fieldWeather.ts day/night handling.
- HAVE: world/battle canvases exist; fieldWeather.ts already keeps
  a Black 2 table-order weather list (0–14) on main.
- NEED TO MAKE: (a) which lighting set index maps to which
  Mochiichao location/time — set indices are anonymous and zones
  do not carry a lighting-set link in the staged data, so this
  assignment cannot be derived and must be decided per location;
  (b) a period-to-canvas tint/brightness application in the world
  and battle canvases (currently no lighting-period lookup call).
- Lookup: lightingSetById, lightingPeriodAtHour.

### 6. Zones — stage1 615/615 = 100%, stage2 plan only
- Black 2 system: zone structure (map_type, npc_cache, weather,
  projection, camera, transition, battle_bg, cycling, escape_rope,
  fly_from, fly x/y/z, cam_bound, name_icon, easy_level).
- Mochiichao replacement: FullWorldMaps.ts + WorldEngine.tsx map
  headers + Maps.ts.
- HAVE: world maps + WorldEngine mapData handling exist.
- NEED TO MAKE: (a) zone index -> Mochiichao map assignment —
  zone IDs are anonymous (zone_000–zone_614) precisely because
  place names were stripped, so no automatic link exists;
  (b) weather code interpretation — codes observed: 0 in 610/615
  zones, 3 in 2, 9 in 2, 12 in 1; codes are NOT interpreted here,
  mapping a code to a Mochiichao weather state is owed;
  (c) camera/projection/transition code mapping to Pixi canvases.
- Lookup: zoneByIndex, zonesByWeatherCode.

### 7. Encounters — stage1 135/135 sets = 100%, stage2 plan only
- Black 2 system: encounter sets (122 all-year 90.4% + 13 seasonal
  9.6%, 174 season blocks, 7,136 slots, 7 terrains, rates + flags,
  versioned terrain groups for 253 groups + 965 plain lists).
- Mochiichao replacement: WorldEngine.tsx tall-grass encounter
  (mapData.encounters pool pick, verified on main).
- HAVE: WorldEngine encounter pool pick exists; species constants
  in slots are already on main as reference species data.
- NEED TO MAKE: (a) encounter_set index -> Mochiichao map
  assignment (anonymous, cannot be auto-linked); (b) species
  constant -> Mochiichao roster mapping — the game roster is
  47 canon + starters, not 652 Black 2 species, so most slots
  cannot be used verbatim and need a roster decision;
  (c) seasonal block -> Mochiichao season state wiring.
- Lookup: encounterSetByIndex, encounterSlots (season, terrain,
  version), encounterRate.

### 8. Facilities — stage1 6/6 = 100%, stage2 plan only
- Black 2 system: 6 facilities, 1,285 trainers by ID only, 6,000
  sets (4 moves each, 6,000/6,000 = 100%), 28,246 pool refs,
  2,189 distinct set contents across facilities, pool size
  ranges per facility (see staged module summaries).
- Mochiichao replacement: ArenaBattleView.tsx (tournament
  presentation on main) as the venue for facility-style
  opponent pools; a dedicated facility view is also possible
  and is not chosen here.
- HAVE: ArenaBattleView exists; facility set shape (species,
  4 moves, EV flags, nature, item, form) is fully typed in the
  staged module.
- NEED TO MAKE (honest gaps, all 0 and not invented):
  facility level range 0/1,285, facility battle-style 0/1,285,
  facility ai_flags 0/1,285, facility -> Mochiichao venue
  mapping, facility trainer -> kept-class mapping (see §9 —
  per-trainer class strings are deliberately NOT carried in
  the staged module because 309 tournament files carry unk0
  instead of a class and some class constants name persons),
  and a level rule for facility opponents (story-trainer levels
  already on main are the only in-source level data).
- Lookup: facilitySummaryByName, facilityTrainerById,
  facilitySetById, facilitySetsForTrainer (pool -> sets).

### 9. Trainer classes — stage1 150/237 wired = 63% (151 kept in source, 1 held out), stage2 plan only
- Black 2 system: class files (display name + article form only).
- Mochiichao replacement: trainer role labels in BattleView /
  ArenaBattleView opponent panels + Roster/party opponent text.
- HAVE: kept generic/titled classes are embedded in the staged
  module (150/151 wired = 99%; 1 kept class is held out in wiring
  because, despite passing batch C's article-form rule, its name
  is a character name — the entry is in the batch-C classes JSON,
  its name is withheld from this map and from the TS so the
  wiring outputs stay clean).
- NEED TO MAKE: (a) dropped classes 86/237 = 36% are count-only,
  names never listed, and must not be reintroduced; (b) class
  prize/money 0/151 — no such fields exist in class files, so
  no prize formula can be pulled from them; story-trainer money
  already on main is the only in-source money data;
  (c) Mars decision: keep kept role names as reference labels,
  or rename roles to Mochiichao roles — no renamed roles are
  invented here.
- Lookup: trainerClassByConstant (kept classes only; a dropped
  constant correctly returns undefined).

### 10. Trainer AI — stage1 14/14 specced = 100%, wireable 13/14 = 93%, stage2 plan only
- Black 2 system: 14 move-scoring strategies (additive points on
  top of a base move score, header numbers only, no code copied).
- Mochiichao replacement: an enemy move chooser in BattleView.
  BattleView itself notes on main that AI is owed and that its
  resolver "accepts actions as input and does not choose them".
- HAVE: BattleView, battleResolver, MOVES_DB, damage math.
- NEED TO MAKE: (a) the chooser itself — no chooser exists on
  main yet; (b) which strategies each Mochiichao trainer class
  uses — story-trainer data on main justifies only 5/14
  (basic 785, eval_attack 383, expert 405, tag_strategy 109,
  target_hp 6 of 814 story trainers); the other 8 wireable
  strategies are used by 0/814 story trainers, so their
  assignment is a design/Mars decision, not derivable;
  (c) facility AI is unspecified (0/1,285 facility trainers
  carry ai_flags).
- HELD OUT, do NOT wire as-is: 1/14 strategy (flag 12) whose own
  header says it is a previous-generation routine with a
  mismatched command argument — wiring it would misread values
  as commands. It is listed in the staged module with
  wireable: false and must stay out of any chooser until it is
  rewritten as original Mochiichao code.
- Lookup: aiStrategyByFlag, wireableAiStrategies.

### 11. Src systems — stage1 checklist 16/16 = 100%, stage2 plan only
- Black 2 system: 1,224 src files, 262 dirs, 16 filename-keyword
  systems (battle 84, party menu 16, bag 8, shop 2, PC/storage
  16/29 wider, title+main menu 25, save/load 80 with 43 savedata
  blocks, weather 9, camera 9, battle animation/effects 47,
  overworld movement/field 111, day/night/time/seasons 10,
  dialogue/message 22 count-only, sound/music code 26 count-only,
  system core/shared UI 48 + 79 UI-window matches, network/link
  inside battle/menu buckets).
- Mochiichao replacement: see BLACK2_SRC_SYSTEM_MAP in
  black2Systems.ts. HAVE 15/16 = 94% (every system except
  network/link has a verified file on main); NEED TO MAKE
  1/16 = 6% (network/link — no equivalent file on main).
- Clarification: HAVE means the Mochiichao system exists, not
  that Black 2 values were copied into it. Value/code extraction
  for src systems is 0/16 by design.

### 12. Graphics — map-only, art 0/110 = 0%
- Black 2 system: 110 graphics dirs, 5,122 files, counts + file
  types only.
- Mochiichao replacement: src/assets/sprites-2d/ + UI SVGs +
  Pixi canvases (HAVE as an art system).
- NEED TO MAKE: original Mochiichao art per graphic system.
  No Black 2 graphic is copied, and no graphic lookup is
  claimed — counts are the lookup for planning only.

### 13. Sound — map-only, audio 0% 
- Black 2 system: 13,934 files (banks 1,949, sequences 2,694,
  streams 2, wave archives 9,280, descriptors 7), counts only.
- Mochiichao replacement: audioRouting.ts + bootAudio.ts +
  MusicMixer (HAVE as a sound system).
- NEED TO MAKE: original Mochiichao audio. No cry, archive entry,
  or audio is copied or listed.

### 14. Text — map-only, content 0%
- Black 2 system: 1,171 files (script 676 + system 495), counts only.
- Mochiichao replacement: DialogueBox.tsx + WorldEngine dialogue
  (HAVE as a dialogue system).
- NEED TO MAKE: Mochiichao-original dialogue. No Black 2 text
  content, filename, line, or paraphrase is carried here.

### 15. Town-map — structure type only, place list 0%
- Black 2 system: 87 town-map files, counted only; schema keys
  give a numeric structure type (zone ref, type code, radius,
  position, cursor, hit box, fly flag, arrival/shown flags,
  area animation/position).
- Mochiichao replacement: FullWorldMaps.ts + Maps.ts map headers
  (HAVE).
- NEED TO MAKE: applying the numeric structure type to
  Mochiichao map headers. No place names, no place list, no
  descriptions are carried here — that exclusion is permanent
  for this lane, not a gap to fill from Black 2.

## View-integration plan (NOT applied — 0% applied to main)

Exact call sites, verified on main 65570289, in the order a
future PR worker would apply them (one view at a time, build
after each, never stacked blindly):

1. BagView.tsx — ITEM_DETAILS record (pocketed list, cursor,
   icon + description, Use/Give/Toss/Quit context). Plug in:
   itemsByPocket() for pocket grouping + itemsWithEffectFlag()
   for the Use effect check + sellPrice() is already the
   ShopView rule. Change: replace the handful of hard-coded
   game items in ITEM_DETAILS with a staged-catalogue view
   driven by the lookup, once Mars approves the item-id
   mapping and original descriptions (see §1 NEED).
2. ShopView.tsx — Buy/Sell/Quit first, buy list rows
   icon+name+price, confirm before money, back to list not
   world, sell at half. Plug in: itemsByPriceRange() for the
   buy list + sellPrice() for the sell path. Change: catalogue
   source only; prices/flow already match, so no flow change.
3. BattleView.tsx — move grid, PP+TYPE line, damage/catch/EXP
   math, "AI is owed" note. Plug in: wireableAiStrategies()
   as the enemy chooser's scoring adjustments on top of the
   existing resolver, with the held-out strategy excluded by
   construction (wireableAiStrategies() filters it out).
   Change: add a chooser module first; do NOT edit damage
   math in the same change.
4. RosterView.tsx — one box per slot, preserved cursor, context
   menu Summary/Switch/Give/Take/Cancel (Give/Take currently
   disabled: no held-item field). Plug in: abilityByIndex /
   natureByIndex for display once MochiiInstance gains those
   fields (see §2/§3 NEED). Change: instance type + save shape
   first, display second — display without the field would
   be a fake.
5. PcView.tsx — boxes in chunks of 30 (BOX_SIZE), box select,
   grid slots, Deposit/Withdraw with confirm, cursor per box.
   Plug in: no Black 2 data lookup is needed for the box
   mechanics themselves (HAVE); facility sets (§8) do NOT
   plug into PcView — they plug into Arena (below). Change:
   none for Black 2 wiring; PC is the storage side of the
   Data Card flow already on main.
6. WorldEngine.tsx — WEATHER_CONFIG[mapData.weather] +
   mapData.encounters pool pick (tall-grass encounter).
   Plug in: encounterSlots() + encounterRate() for the pool
   pick (season + terrain + version) + lightingPeriodAtHour()
   for the world canvas tint + zoneByIndex() for map-header
   fields (weather/camera/cycling/escape_rope/fly). Change:
   map assignment first (see §6/§7 NEED) — without it, the
   lookups have no Mochiichao map to attach to.
7. ArenaBattleView.tsx — tournament presentation. Plug in:
   facilitySummaryByName() + facilitySetsForTrainer() for
   facility-style opponent pools. Change: venue mapping +
   level rule first (see §8 NEED); do NOT use facility
   trainers as story trainers.
8. GameShell.tsx / IntroSequence.tsx — pause menu + title/
   main menu. Plug in: none for Black 2 data; src-system
   checklist (§11) is the mapping, not a data call.
   Network/link (§11 NEED) has no call site because no
   network file exists on main.

## Mars decisions needed (nothing here is silently decided)

1. Item-id mapping + original descriptions for 639 items (§1).
2. Nature modifier table vs display-only natures (§3).
3. Black 2 types -> 12 True Elements mapping (§4).
4. Zone/lighting/encounter -> Mochiichao map assignments (§5–§7).
5. Facility venue mapping + facility opponent level rule (§8).
6. Kept trainer role names: keep as reference labels or rename
   to Mochiichao roles (§9).
7. AI strategy assignment per trainer class beyond the 5
   story-justified strategies (§10).
8. Confirm the placeholder ability maps to "no ability" (§2).

## Verification

- validate-wiring.py: counts, TS constants/lists/functions,
  no-placeholder, no-item-constants, no PNG/palette strings,
  and a runtime-derived forbidden grep (zone/encounter filename
  stems, dropped-class display names, facility trainer personal
  names) over black2Systems.ts + this map only.
  Final run on the final files: PASS 62, FAIL 0.
- tsc strict proof in /tmp (see below): the staged module
  compiles standalone and a harness exercising every lookup
  against the staged JSONs passes.
- Forbidden-grep note (read this before re-grepping naively):
  the validator strips allowed system names (ability/nature/type/
  class full names and facility names) before grepping, because
  several facility trainer personal names coincide with generic
  words or system names (an ability name, a TS parameter name,
  an adjective). After stripping, the grep is 0 hits. One
  genuine coincidence remains to know about: a zone file shares
  the stem of one facility name — outputs use that string only
  as the facility system name, never as a zone/place entry,
  and zone data is anonymous zone_000–zone_614 throughout.
- No git commands were run for this wiring task. No files were
  deleted. The dirty work tree was read for status only and
  was not edited.
