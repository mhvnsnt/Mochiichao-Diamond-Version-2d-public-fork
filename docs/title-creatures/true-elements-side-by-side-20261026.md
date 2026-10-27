# True Elements side-by-side — Mochiichao vs Pokemon

**Measured 2026-10-26, staged only. PROPOSAL for Mars to decide — NOT canon.**
Nothing in this doc changes any repo file, renames any creature or type, or
decides a final True Elements slot. Mars directed (2026-10-26 ~14:26 CDT):
"we're going to make our own equivalence" — so the equivalence below is
presented as a proposal, with every Mars-directed mapping labelled as a
STARTING mapping and every final slot labelled OPEN.

**Snapshot:** gate clone `~/workspace/mochiichao-work/title-creatures-9/repo`,
branch main, HEAD `28196096` (Merge PR #161). Main may have moved since;
this doc is a snapshot at that HEAD. Gate-clone submodules were empty, so
decomp files were read from the work clone
`~/workspace/mochiichao-work/fresh-start/` submodules (same three decomps).

## 1. Mochiichao's side — measured from the repo files

### 1a. The 12 canonical True Elements (3 files agree, 12/12)

`src/lib/monster-tamer-systems.ts:31`, `src/lib/battleTypeChart.ts:37`,
`src/lib/validate-reference.ts:30`, and `docs/unification-map.md §1` all list
the same 12:

**Water, Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Deep, Flame,
Mythic, Normal — 12 total.**

### 1b. The roster's own element words (15 distinct, 47 creatures, 87 slots)

`src/lib/global_roster.json`, tolerant parse only. The file does NOT parse
strictly — two typos, patched in memory for counting and NOT fixed in the
repo by this task: line 14, Tiidebiite `"atk: 63` (missing closing quote);
line 266, Pebblefist `"hp": 4-5` (a range, not a number). After patching
both in memory: 47 entries parse, IDs 001–046 + 331.

| Roster element | Creatures | IDs |
|---|---|---|
| Aqua | 10 | 001 Mochii, 002 Tiidebiite, 003 AquariiOS, 022 Finblade, 023 Megalochrome, 024 Floatcalf, 025 Astroleviathan, 026 Inklet, 027 Toxitacle, 028 Krakenox |
| Chrome | 14 | 004 Razorgater, 005 Chromejaww, 006 Reaperdile, 022 Finblade, 023 Megalochrome, 032 Gearkid, 033 Mechapion, 034 Gorokappa, 035 Pebblefist, 036 Cragarm, 037 Terrapod, 038 Sproutle, 039 Shellguard, 040 Dreadtoise |
| Core | 12 | 007 Tyrage, 008 Duneclaw, 009 Oblivirex, 029 Punchkid, 030 Strikechamp, 031 Kickmaster, 032 Gearkid, 033 Mechapion, 034 Gorokappa, 035 Pebblefist, 036 Cragarm, 037 Terrapod |
| Umbral | 7 | 008 Duneclaw, 009 Oblivirex, 026 Inklet, 027 Toxitacle, 028 Krakenox, 042 Wispkin, 043 Duskfiend |
| Beast | 6 | 010 Kittember, 011 Pyropaw, 012 Manticlaw, 013 Pupbble, 014 Terradog, 015 Quakehound |
| Flame | 6 | 010 Kittember, 011 Pyropaw, 012 Manticlaw, 044 Ashemit, 045 Pyromonk, 046 Yogiferno |
| Mythic | 6 | 002 Tiidebiite, 003 AquariiOS, 044 Ashemit, 045 Pyromonk, 046 Yogiferno, 331 Mythar |
| Strike | 5 | 005 Chromejaww, 006 Reaperdile, 029 Punchkid, 030 Strikechamp, 031 Kickmaster |
| Flora | 4 | 038 Sproutle, 039 Shellguard, 040 Dreadtoise, 041 Pixilite |
| Aero | 3 | 019 Zephling, 020 Aerobeak, 021 Stormtalon |
| Bug | 3 | 016 Squirmite, 017 Cocoonode, 018 Mothrix |
| Earth | 3 | 013 Pupbble, 014 Terradog, 015 Quakehound |
| Silk | 3 | 016 Squirmite, 017 Cocoonode, 018 Mothrix |
| Wind | 3 | 019 Zephling, 020 Aerobeak, 021 Stormtalon |
| Neon | 2 | 024 Floatcalf, 025 Astroleviathan |

**15 distinct roster words. 10 of them are already in the 12** (Aqua is a
rename of Water; Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Flame,
Mythic are exact). **5 are NOT in the 12: Beast (6), Silk (3), Wind (3),
Neon (2), Flora (4).**

How the 5 open words ride (measured, not assumed):
- Beast always rides second: with Flame (3: Kittember line) or Earth (3: canine line).
- Silk always rides with Bug (3/3 — the same three creatures carry both).
- Wind always rides with Aero (3/3 — the same three creatures carry both).
- Neon always rides with Aqua (2/2 — Floatcalf, Astroleviathan).
- Flora rides with Chrome (3/3) except Pixilite (041), the ONE creature whose
  only element is an open word (Flora alone).

Two canonical True Elements are used by ZERO roster creatures: **Deep (0/47)
and Normal (0/47).** Every chart cell involving Deep ships x1.0 and OWED
(`battleTypeChart.ts` header: 44/144 = 31% owed cells are all Aero/Deep).

### 1c. species.ts — the other Mochiichao vocabulary (12 species, 11 Pokemon words)

`src/lib/species.ts` still types its 12 battle species with Pokemon type
words, not True Elements (`validate-reference.ts` flags this as an open
unification decision, warning only): WATER, FIGHTING, PSYCHIC, STEEL, DARK,
DRAGON, GROUND, ROCK, GHOST, FIRE, GRASS — **11 distinct Pokemon words.**
Its type field is typed by `src/lib/types.ts` `ElementType`, which lists
exactly the modern 18 Pokemon types (see §2). `src/lib/constants.ts`
lines 4–21 carries the same modern 18-type chart that BattleView still
uses — the True Elements chart is NOT wired into BattleView
(`battleTypeChart.ts` header). So today the game battles on Pokemon's 18,
not on the 12.

`src/lib/titleRotation.ts` vibes (water / steel / ground / fire / grass /
ghost words) are descriptive starter labels, not a type system, and are not
counted above.

## 2. Pokemon's side — measured from the decomp files

### 2a. FireRed / LeafGreen (Gen 3)

`pokefirered-leafgreen/include/constants/pokemon.h:96–114`:
TYPE_NONE 255, TYPE_NORMAL 0, TYPE_FIGHTING 1, TYPE_FLYING 2,
TYPE_POISON 3, TYPE_GROUND 4, TYPE_ROCK 5, TYPE_BUG 6, TYPE_GHOST 7,
TYPE_STEEL 8, TYPE_MYSTERY 9, TYPE_FIRE 10, TYPE_WATER 11, TYPE_GRASS 12,
TYPE_ELECTRIC 13, TYPE_PSYCHIC 14, TYPE_ICE 15, TYPE_DRAGON 16,
TYPE_DARK 17.

### 2b. HeartGold / SoulSilver (Gen 4)

`pokeheartgold/include/constants/pokemon.h:18–36`: the IDENTICAL list,
including TYPE_MYSTERY 9, with `NUMBER_OF_MON_TYPES 18` (that 18 counts
Mystery — it is 17 battle types + Mystery, not 18 battle types).

### 2c. Black 2 / White 2 (Gen 5)

`pokebw2/res/types/`: 17 type files — bug, dark, dragon, electric,
fighting, fire, flying, ghost, grass, ground, ice, normal, poison,
psychic, rock, steel, water — plus `type.schema.json`. No `fairy.json`.

### 2d. The Fairy fact — stated plainly, not fudged

**Fairy appears in NONE of the three decomps in this repo.** All three
games predate Gen 6, when Fairy was added. The modern 18th type exists in
this repo only in the repo's own modern vocabulary (`src/lib/types.ts`
`ElementType`, `src/lib/constants.ts` lines 4–21), not in any decomp file
read here. Any side-by-side that cites Fairy "from the decomp" would be
invented; this doc does not do that.

**Pokemon totals, measured:**
- Decomp battle types (all three games agree): **17** — Normal, Fighting,
  Flying, Poison, Ground, Rock, Bug, Ghost, Steel, Fire, Water, Grass,
  Electric, Psychic, Ice, Dragon, Dark — plus TYPE_MYSTERY (???), which is
  not a real battle type and is counted separately, never as a missing type.
- Modern Pokemon types (repo's own types.ts / constants.ts): **18** — the
  same 17 + Fairy.

## 3. Mars-directed starting mappings (2026-10-26, STARTING only, final OPEN)

| Mars mapping | Status |
|---|---|
| Beast → Normal-equivalent | Directed 2026-10-26 ~13:53 CDT (Pokemon-first starting point) |
| Flora → Grass-equivalent | Directed 2026-10-26 ~13:53 CDT (Pokemon-first starting point) |
| Silk → Bug | Directed 2026-10-26 ~14:06 CDT ("match them up like Pokemon") |
| Wind → Flying | Directed 2026-10-26 ~14:06 CDT |
| Neon → Electric | Directed 2026-10-26 ~14:06 CDT |

These SUPERSEDE the older in-repo proposals where they conflict, and the
conflicts are flagged, not hidden:
- Old `docs/unification-map.md §2` proposed: Beast → Normal OR drop;
  Silk → drop (type = Bug); Wind → drop (type = Aero); Neon → drop
  (type = Aqua) OR Mythic; Flora → Earth (candidate) OR 13th element.
  Mars's versions now stand instead: Silk → Bug (same effect as the old
  drop-to-Bug), Wind → Flying (a Pokemon type, not "drop to Aero"),
  Neon → Electric (NOT Aqua, NOT Mythic), Flora → Grass-equivalent
  (NOT Earth), Beast → Normal-equivalent (one of the old options).
- Old `battleTypeChart.ts` header proposed GRASS → Earth (candidate).
  That now conflicts with Flora → Grass-equivalent: if Flora IS our Grass
  slot, Grass does not also map to Earth. That chart mapping needs Mars's
  ruling before any chart re-derivation — this doc does not retire it.

## 4. Side-by-side table (PROPOSAL — Mars decides)

Legend: DIRECT = name already matches or rename only. OLD = proposed in
`battleTypeChart.ts` / `unification-map.md`, unconfirmed. MARS = Mars-directed
starting mapping, final slot OPEN. CANDIDATE = old proposal, unsettled.

| Mochiichao element (roster count) | Pokemon equivalent | Basis |
|---|---|---|
| Water — roster word Aqua (10) | Water | DIRECT, rename only |
| Chrome (14) | Steel | OLD (STEEL → Chrome) |
| Earth (3) | Ground | OLD, partial (GROUND → Earth; ROCK went to Core, so Earth is NOT 1:1 with any single Pokemon type) |
| Bug (3) | Bug | DIRECT |
| Umbral (7) | Dark + Ghost (2-to-1 merge) | OLD — known loss: GHOST immunity vs Normal does NOT survive the merge (chart ships that cell neutral until Mars rules) |
| Aero (3) | Flying | PROPOSAL — Aero is our Flying-side slot; Wind → Flying (MARS) lands here unless Mars keeps Wind separate |
| Core (12) | Rock | CANDIDATE (ROCK → Core, old proposal, unsettled) |
| Strike (5) | Fighting | OLD (FIGHTING → Strike) |
| Deep (0) | — none | UNIQUE TO US (see §5) |
| Flame (6) | Fire | DIRECT (FIRE → Flame) |
| Mythic (6) | Psychic + Dragon (2-to-1 merge) | CANDIDATE (both old proposals, unsettled) |
| Normal (0) | Normal | DIRECT; Beast → Normal-equivalent (MARS) would put the 6 Beast creatures here if that mapping wins |
| Beast (6, open) | Normal-equivalent | MARS starting mapping, final slot OPEN |
| Silk (3, open) | Bug | MARS starting mapping; creatures already carry Bug + Silk, so this folds cleanly |
| Wind (3, open) | Flying | MARS starting mapping; creatures already carry Aero + Wind, so this folds into Aero unless Mars keeps Wind separate |
| Neon (2, open) | Electric | MARS starting mapping, final slot OPEN — Electric has NO True slot yet (see decision 1) |
| Flora (4, open) | Grass-equivalent | MARS starting mapping, final slot OPEN — the 13th-element question (see decision 2) |

## 5. Missing on our side, and unique to us

### Missing — Pokemon types with NO Mochiichao equivalent

Before Mars's 2026-10-26 mappings, the old chart left **5** unmapped
(`battleTypeChart.ts` header): ELECTRIC, ICE, POISON, FLYING, FAIRY.

After Mars's starting mappings (Flying → Aero/Wind, Electric → Neon),
**3 remain with no starting mapping: Ice, Poison, Fairy.**

- Ice: no roster creature, no species.ts creature, no True slot, no old proposal.
- Poison: same — nothing in any measured file points at it. (Note: roster
  026–028 Inklet/Toxitacle/Krakenox SOUND poison-adjacent but are typed
  Aqua/Umbral in the roster — do not retype them on a name guess.)
- Fairy: same, plus the §2d fact — it is not in any of the three decomps
  at all, so there is no decomp behaviour to pull for it.
- TYPE_MYSTERY (???) is NOT counted as missing: it is a decomp placeholder,
  not a battle type, in all three games.

Question for Mars (not decided here): do Ice / Poison / Fairy need
equivalents at all right now, when no roster creature uses them — or do
they stay missing until a creature actually needs one?

### Unique — Mochiichao elements with NO Pokemon equivalent

Strictly, **1: Deep.** No Pokemon type maps to it, no roster creature uses
it, and every chart cell involving it is owed. Everything else either
matches a Pokemon type directly, merges two of them (Umbral, Mythic), or
now has a Mars-directed Pokemon equivalent (Beast, Silk, Wind, Neon,
Flora).

Open-question unique: **Flora, IF it stays separate from Grass.** If Mars
keeps Flora as its own slot rather than as the Grass-equivalent, Flora
becomes a second unique element (a 13th True Element) alongside Deep.
That is decision 2 below, not a fact in this doc.

## 6. Decisions owed to Mars (proposal only — nothing here is canon)

1. **Neon → Electric: new slot or fold?** Electric has no True slot. A
   13th True Element, a fold into an existing element, or something else
   entirely — NOT silently assigned to Core or any other element.
2. **Flora → Grass-equivalent: 13th element, or rename?** Keep Flora as
   its own slot (13 True Elements), or make Flora the Grass slot and
   retire the old GRASS → Earth chart mapping? Pixilite (Flora-only) is
   the creature most affected.
3. **Wind → Flying vs Aero:** does Wind fold into Aero (creatures already
   carry both), or does Flying stay its own slot beside Aero?
4. **Beast → Normal:** do the 6 Beast creatures become Normal-typed, or
   does Beast stay a body category (feline/canine) with Flame/Earth as
   the type, per the old alternative?
5. **Ice / Poison / Fairy:** leave missing until a creature needs them,
   or invent equivalents now? (No roster creature needs them today.)
6. **Two 2-to-1 merges, confirm or split?** Umbral = Dark + Ghost (with
   the known Ghost-immunity loss) and Mythic = Psychic + Dragon — both
   old proposals, neither confirmed.
7. **Deep: what is it?** The one strictly unique element, zero roster
   usage, all chart cells owed. Its meaning and matchups are entirely open.

## 7. Counts behind every claim (so nothing here is a bare assertion)

- Mochiichao canonical True Elements: **12** (3 files agree).
- Mochiichao roster element words: **15** distinct, **47** creatures,
  **87** element slots (tolerant parse, typos in §1b).
- Roster words already in the 12: **10** (Aqua as Water rename + 9 exact).
- Roster words NOT in the 12: **5** (Beast 6, Silk 3, Wind 3, Neon 2, Flora 4).
- Canonical elements used by zero roster creatures: **2** (Deep, Normal).
- species.ts: **12** species, **11** distinct Pokemon type words.
- Pokemon decomp battle types: **17** in each of FireRed, HeartGold,
  Black 2 (+ Mystery placeholder, not a battle type).
- Pokemon modern types (repo types.ts / constants.ts): **18** (17 + Fairy).
- Pokemon types with no Mochiichao equivalent: **3** after Mars's
  mappings (Ice, Poison, Fairy); **5** before them (+ Electric, Flying).
- Mochiichao elements with no Pokemon equivalent: **1** strict (Deep);
  **2** if Flora stays separate (Deep + Flora).

## Sources (all read from files, not memory)

- Gate clone main `28196096`: `src/lib/global_roster.json`,
  `src/lib/species.ts`, `src/lib/types.ts`, `src/lib/titleRotation.ts`,
  `src/lib/monster-tamer-systems.ts`, `src/lib/battleTypeChart.ts`,
  `src/lib/validate-reference.ts`, `src/lib/constants.ts`,
  `docs/unification-map.md`.
- Work clone `~/workspace/mochiichao-work/fresh-start/`:
  `pokefirered-leafgreen/include/constants/pokemon.h`,
  `pokeheartgold/include/constants/pokemon.h`,
  `pokebw2/res/types/` (17 type files + `type.schema.json`).
- Mars directions: Beast/Flora starting mappings 2026-10-26 ~13:53 CDT;
  Silk/Wind/Neon starting mappings 2026-10-26 ~14:06 CDT; "make our own
  equivalence" side-by-side order 2026-10-26 ~14:26 CDT.
