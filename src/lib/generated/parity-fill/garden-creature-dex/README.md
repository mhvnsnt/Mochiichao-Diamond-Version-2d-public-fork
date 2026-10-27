# Slice 6 — Garden / Chao + Creature Mode + Dex / Breeding / Post-game + Multiplayer shape

**STAGED ONLY, 2026-10-26. NO commit, NO push, NO PR, NO repo edits, NO live
wiring.** For the coordinator to merge in batches without clobbering in-flight
work. Staged shapes do NOT change any in-game percentage.

## Files in this folder

| File | What it holds |
|---|---|
| `garden-system.json` | Garden system shapes + counts vs conversion doc |
| `garden-creature.ts` | TS shapes (extends `mochiichao-systems.ts`, does not replace it) |
| `creature-mode-wiring-checklist.md` | Dorowani/Gabu-only wiring checklist + 8-step live-playtest list (0/8, NOT playtested) |
| `mochi-dex.json` | Dex shape: 47 roster + 100 discoverable slots (NOT filled) + 2 reserved |
| `breeding-shape.json` | Breeding/egg shape from conversion-doc rules |
| `post-game-shape.json` | Post-game shape: Grand Champion target + rematch slots |
| `multiplayer-validation.json` | Trade VALIDATION shape only (no network, no server) |
| `multiplayer-validation.ts` | Extended validator (same `string[] errors` contract) |
| `README.md` | This file: source → replacement → HAVE / NEED TO MAKE + counts |

## Source → Mochiichao replacement → HAVE / NEED TO MAKE

### (a) Garden / Chao

| Source element | Mochiichao replacement | Status |
|---|---|---|
| Chao stats (Swim/Fly/Run/Power/Stamina) | Garden stats Dive/Glide/Sprint/Might/Endurance, 1–99 doc / 0–99 code clamp, 10 boxes/level | HAVE in code (`mochiichao-systems.ts`) + STAGED shape; persistence NEED TO MAKE |
| Chaos Drives | Data Shards: Aqua/Aero/Sprint/Might/Blue/Gold Mythic/Umbral (7/7) | STAGED shape; in-game feeding is placeholder buttons only |
| Chao animals + parts | Garden Critters (4/21 named: Tide-Pup, Glider-Moth, Sprint-Hare, Forge-Bear; 17 slots empty) + parts Head/Back/Feet/Tail/Ears | STAGED shape; 17 critter names NEED TO MAKE (not invented) |
| Chao alignment (Hero/Dark) | Bright/Neutral/Umbral, slider −100…+100, code band ±25 | HAVE in code + STAGED shape |
| Chao evolution (1st/2nd) | Data Cocoon → Garden Form I/II, palette + accessory + aura, NOT a species change | HAVE thresholds in code (150/300) + STAGED slider/lock rules; cocoon flow NEED TO MAKE |
| Chao reincarnation | Data Rebirth: 1 Garden Year = 1 in-game week / ~60 min; life ≈ 5 years; Bond >50 = Rebirth Egg, ≤50 = Last-Chance → Memorial + Legacy Egg | STAGED shape; code has `dataRevert` (halve) only |
| Chaos Chao | Mythic Form: Rebirth ≥2×, Bond >50, 21 Critter types, no Shards after 2nd Rebirth, alignment in 3rd life; immortal, cannot breed, stats locked | STAGED shape (5/5 reqs); Mythar is template, not the only Mythic |
| Chao breeding (season/heart fruit) | Bonding Season (Garden Age 2) / Heart Berry (rare Market/farm, last bite, one per parent); flower ring + heart icon; both in season = guaranteed egg; 1 free egg/life | STAGED shape; parent+fruit map BLOCKED (Mars-only) |
| Chao Gardens (Hero/Dark/Neutral) | Mainframe Gardens: Sector 0 Plaza (Neutral), Aeon Spire Garden (Bright), Deep Sector Garden (Umbral); 8/garden, overflow MochiiPlex | STAGED shape; visit-shift amount NOT set (not invented) |
| Kindergarten | Mochiko Academy, Silicon Town: Aeon Clinic + lessons Dance/Song/Sketch/Rhythm (idle anims + Bond, NOT battle power) | STAGED shape; GardenView place is PLACEHOLDER |
| Black Market | Silicon Town Market: rotating stock, tiers by Dojo Badges + quest emblems; sells palette eggs/seeds/hats/Heart Berries/Strong Nuts; NEVER roster species | STAGED shape; GardenView place is PLACEHOLDER |
| Chao Races | MochiiPlex Circuit: Dive/Glide/Sprint/Might/Grand Circuit; Endurance = pauses/sleep; medals → toys/market tiers/training points | STAGED shape; GardenView place is PLACEHOLDER |
| Chao Karate | Dojo Sparring (MochiiPlex Dojo): auto-battler; Endurance=HP, Might=damage, Sprint=ring-out speed, Dive/Glide=dodge; rewards training points + titles, NOT XP | STAGED shape; GardenView place is PLACEHOLDER |
| Chao fruit farming | Data-Fruit farming: 3 trees/garden; shake→harvest→feed; regrow 1 in-game day (~7 min active); garden fruit = Endurance only; Bright/Umbral Berry, Strong Nut (2× Endurance), Smart Berry, element fruit; favourite = 2× Bond | STAGED shape; full fruit→stat map BLOCKED (Mars-only); GardenView fruit buttons are PLACEHOLDER +10 values, NOT canon |
| Chao grades/inheritance | Grades E→S per Garden Stat; child 50/50 genes, higher wins visible 70%, recessives in grandchildren; Two-tone palettes; Glitch-Shine dominant; dominant-stat training bumps a grade one step | STAGED shape |

Garden counts: 5/5 stats, 7/7 shards, 4/21 critters named (19%), 3/3 alignments,
2/2 Form stages, 4/4 Rebirth rules, 5/5 Mythic reqs, 7/7 season rules,
3/3 gardens, 1 clinic + 4/4 lessons, 5/5 market categories, 5/5 race courses,
4/4 sparring mappings, 5/5 fruit special categories. Garden places playable:
0/5. Garden spec 100%, Garden playable 0% — unchanged by this slice.

### (b) Creature Mode (play-as-creature, real-time)

| Source element | Mochiichao replacement | Status |
|---|---|---|
| Pokemon Ranger circling capture (NOT play-as-Pokemon) | NOT the model — Creature Mode is its own system; Ring Capture stays a separate capture mode | SPEC (creature-mode-spec.md) |
| Battle Coliseum / Arena 2D fan projects + Mystery Dungeon play-as idea | Creature Mode: WASD move, Shift sprint/stamina, keys 1–4 moves + cooldowns, Space dodge + i-frames, Q hop, Tab tag-switch, pack/skittish/territorial temperaments, Boids packs | SPEC + code per parity (PR #72/#87 on main); THIS clone has pass-1 only — see checklist warning |
| Walk sheets | Dorowani/Gabu 2D sets only today (13 + 20 locked cells per Phase 2) | UNVERIFIED in this clone; wiring 0/8 items |
| Live playtest (pass3/pass4 steps) | Glide, sprint stamina, Razorgater pathing around a building, Garden bonus HUD, Guardian save/load, hitstop HP-after, pack engagement, strafe | 0/8 passed = 0% — NOT playtested, NOT claimed |

### (c) Dex / breeding / post-game

| Source element | Mochiichao replacement | Status |
|---|---|---|
| Pokedex Seen/Caught | MochiDex: 47 roster entries shaped (001–046 + 331 Mythar), all Seen/Caught false in this shape; in-game today = starter gift + MOCHII-ALL cheat Seen only | SHAPE 47/47; in-game Dex 20% ESTIMATE (parity §24), unchanged |
| Discoverable Dex slots | Slots 047–146 = 100 slots, ALL explicitly NOT filled (no species, no stats, no names) | 100/100 marked unfilled |
| Reserved Dex slots | 147 Dorowani, 148 Gabu — reserved markers only, no stats | BLOCKED (Mars-only stats) |
| Day-Care breeding + egg groups + egg moves | Bonding Season/Heart Berry breeding (conversion-doc rules 8/8 shaped); egg groups NOT defined; egg moves = 1 inherited move from non-species parent | SHAPE 8/8 rules; playable 0%; egg groups 0/1 |
| Post-game (Frontier/rematches) | Grand Champion Mythar, Mainframe Plateau, true final: 331 + 003/046/043/028/021 all Lv100, reward 20000 (canon target, NOT built); rematch shape fields 5/5, entries 0 | SHAPE staged; playable 0%; Elite 0/4; Champion conflict unresolved (Mars-only) |
| Decomp reference shapes | FireRed species_info.h (catchRate/expYield/eggGroups/growthRate), HeartGold personal.json (eggCycles/friendship/EV yields), Black 2 res data (evolution_stage/ev_yields), egg-learnset files (Crystal/Emerald/Ruby/Yellow) | REFERENCE ONLY — no decomp values copied in as Mochiichao data |

### (d) Multiplayer / trading — VALIDATION ONLY

| Source element | Mochiichao replacement | Status |
|---|---|---|
| Link trade | Mochi Link validation (`mochiLinkValidate` contract: `string[] errors`, empty = valid) | HAVE 2/2 checks in code |
| Trade legality | Extended staged checks: species-known (roster only; 147/148 reserved fail; 047–146 fail), level positive integer, party max 6 (Pokemon-baseline shape), no same-instance both sides | STAGED 4 checks, NEED wiring |
| Undecided trade rules | Mythic Form trade, egg trade | DECISION-OWED — validator returns a decision-owed error, never a silent pass |
| Online play / PvP netcode / server | EXPLICITLY NOT STAGED — no network code, no server, no matchmaking | 0% by design (parity §23: 5% ESTIMATE = validation only) |

Validation checks total: 8 (2 HAVE-in-code, 4 STAGED-need-wiring/shape,
2 DECISION-OWED).

## Percentages (per Mars's percentage rule — staged shape ≠ in-game done)

- Garden system shapes: 14/14 conversion-doc subsystems shaped (100% of shape);
  Garden playable: 0/5 places (0%). Overall Garden in-game stays 40% ESTIMATE
  (parity §21: view + spec + helpers) — this slice does not move it.
- Creature Mode walk wiring (Dorowani/Gabu): 0/8 items (0%).
- Creature Mode live playtest: 0/8 steps (0%).
- Dex shape: 47/47 roster entries (100% shape) + 100/100 discoverable slots
  marked unfilled (100% of the NOT-filled requirement) + 2/2 reserved markers.
- Breeding shape: 8/8 rules (100% shape); playable 0%; egg groups 0/1; parent+fruit map 0/1 (Mars-only).
- Post-game shape: 1/1 Grand Champion target staged; rematches 0 entries;
  playable post-game 0%.
- Multiplayer validation shape: 8/8 checks defined (2 HAVE, 4 STAGED, 2 DECISION-OWED);
  playable trade/battle 0% — unchanged, by design.

## Validation run (this slice)

- All JSON files parsed with `python3 -m json.tool` (see report).
- TS files: `garden-creature.ts` + `multiplayer-validation.ts` — syntax-checked
  (see report for method/result).
- No repo files touched: `git status` in the fresh-start clone was NOT modified
  by this slice (pre-existing modifications on its branch were left alone).
- No commit, no push, no PR, no publish, no deletions (0 deletions — additions-only staging).

## Mars-only blockers (nothing here is guessed)

1. Garden breeding parent + fruit map (incl. favourite fruit per creature).
2. Dorowani stats + Gabu stats (incl. starter stats for 147/148).
3. Dorowani V3 mouths 0/4 (eyes-only ships unless Mars rules otherwise).
4. Cooldown table numbers (provisional → canon approval).
5. Champion-after-Elite decision (Hex vs Mythar vs other) — gates post-game unlock.
6. Trade legality cap (level cap, if any) + Mythic Form trade rule + egg trade rule.
7. Visit-alignment-shift amount for Mainframe Gardens + hatch-steps equivalent.
8. Walk-gate pick (parity §14, still owed).

## Caveats / discrepancies found (for the coordinator)

- This work clone is stale: branch `feature/unified-data-sprites-2.5d` at
  `11e9a3b`, pre-PR #72. `docs/creature-mode-pass2/3/4.md` and
  `creatureCooldowns.ts` were NOT found here; pass3/pass4 steps in the checklist
  come from parity §22 + task text. Verify against main before wiring.
- Phase 2 pivot staging: CORRECTION — it DOES exist, at
  `~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/pivot-2d-20261026/`
  (outside the fresh-start clone, which is why the clone check missed it).
  Verified 2026-10-26: manifest + 8/8 game-path replacement mapping;
  Dorowani atlas 384x192, 13 cells; Gabu atlas 384x256, 20 cells; locked
  manifests in `sprite-art/game-ready/<creature>/`. Checklist item 1 is now
  VERIFIED; wiring itself is still 0% done. The mapping also notes the game
  path currently loads 2D bake PNGs (no `.glb` loaded by the game) and that
  `src/assets/sprite-atlases/` does NOT exist in the work clone — Phase 3
  must confirm against repo main.
- `global_roster.json` in this clone has a malformed line (entry 002:
  `"atk: 63` missing closing quote). Dex names/ids here were regex-extracted,
  not JSON-parsed. Flagged, NOT fixed here (no repo edits in this slice).
- Garden stat range discrepancy: conversion doc says 1–99, code clamps 0–99.
  Flagged in `garden-system.json`; code wins until Mars rules.
- Breeding parent rule discrepancy: conversion doc says different-lines →
  higher-Bond parent's base form; garden-mode-spec.md notes player-chooses vs
  mother-default "to be confirmed with Mars before wiring". Staged rule follows
  the conversion doc; the spec-doc question is left open for Mars.
