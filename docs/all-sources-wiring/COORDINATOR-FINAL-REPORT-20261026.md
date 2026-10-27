# All-sources wiring 100% — coordinator final report (2026-10-26/27)
Mars orders: 20:38 CDT wire everything 100% just how Pokemon does it, all games + mod files; 20:39 proprietary definition + opponent direction + queued start screens; 20:41 autonomous until 100%.
NO PR created or merged by this coordinator. No other lane's staging overwritten. No git commit from the dirty work tree.

## Proprietary rule (Mars 20:39, reaffirmed 20:52)
Swap out ONLY: Pokemon species/characters, Pokemon names, Pokemon images, logos, actual literal dialogue. Cries in swap bucket (a Pokemon's voice). Town names no longer separately flagged. Literally everything else usable at 100%: code, move names/moves, systems, structure, values.
Pipeline: full game into private repo mhvnsnt/pokebw2-private-reference first (README-only, full push blocked on git credential — NOT claimed pushed, NOT duplicated here), convert Pokemon stuff to Mochiichao there, then bring converted work to public repo. Local conversion staging here is separate from the public PR path.

## Sources inventoried: 13 canonical, 252,945 non-.git files, ~1,900 MB
Duplicate clones (67 dirs matching duplicate patterns) counted as 0 new sources.
| Source | Gen | Files | Size |
|---|---|---|---|
| fresh-start/pokefirered-leafgreen | 3 | 9,858 | 62M |
| fresh-start/pokeheartgold | 4 | 14,776 | 198M |
| fresh-start/pokebw2 | 5 | 129,633 | 822M |
| decomps/pokecrystal | 2 | 4,641 | 28M |
| decomps/pokediamond | 4 | 33,283 | 224M |
| decomps/pokeemerald | 3 | 11,586 | 91M |
| decomps/pokegold | 2 | 4,110 | 24M |
| decomps/pokeplatinum | 4 | 28,098 | 263M |
| decomps/pokered | 1 | 2,904 | 16M |
| decomps/pokeruby | 3 | 9,812 | 72M |
| decomps/pokeyellow | 1 | 3,056 | 18M |
| gen5plus/pokeapi-src | 5+ API | 252 (187 CSV confirmed; worker's 212 figure superseded by coordinator re-count) | 50M dir total |
| fan-reference | fan | 936 non-.git | 32M |
Decomp git shorts: crystal 5c877ef, diamond b623abef, emerald 731ad5b, gold fc702b6, platinum 6eeb1b04, red 171e2c2, ruby 5784633, yellow 9327549; pokebw2 submodule e522642f9ec496783642df075f05fcd07d3cbc1b.

## Systems inventoried and wired staged — per worker (6/6 workers complete)
### Battle (inventory only, no VFX build)
Mapping HAVE* 6/28 = 21%, NEED 22/28 = 79%. Deep-read 3/11 trees = 27%, list/count-only 8/11 = 73%. Menus inventoried Gen3 25/25, Gen4 21/21, Gen5 4/4; menu wiring 0/3 families = 0%. Opponent archetypes 8/8 = 100% inventoried, wiring 0/8 = 0%.
### Menus / bag / shop / PC / save
HAVE 20/97 = 21%, NEED 77/97 = 79%. Field menu 0/9, main menu 0/5, options 0/7, bag 3/18, shop 7/15, storage 7/16, terminal/mailbox 0/8, save/load 3/14, trainer card 0/5.
### Overworld code-flow layer (new, Black 2 batches NOT redone)
HAVE 14/77 = 18%, NEED 63/77 = 82%. Movement 4/17, encounters 2/18, weather 2/11, camera 1/6, lighting 2/7, zones 2/10, day/night/seasons 1/8. Game wiring of new items 0/77 = 0% (staged only).
### Row-counted total (battle + menus + overworld)
HAVE 40/202 = 20%, NEED 162/202 = 80%. Battle HAVE* caveat: exists per PR #107 resolver correction, worker read stale work-clone branch, not live main — not re-verified by this coordinator.
### Data systems
Mapped 12/12 = 100% (species, moves, abilities, items, natures, types, learnsets, evolutions, trainers, facilities, classes, AI). Mapping 100% != wired 100%. Gaps: 20 NEED items. Live context: species.ts 12/47 roster = 26%; BattleView uses constants.ts 18-chart, battleTypeChart.ts True chart exists but unused, species.ts still source type words.
### Title / start screens — QUEUED NOT APPLIED
Inventoried 11/11 generations = 100%; primary title-code files 24; title-named files 132 across 10 gens; Diamond code 0/1 (assets only) = 10/11 gens with located code = 91%. Wired into game 0/11 = 0% by design (queued after wiring; logo/studio untouched).
### Mod-community / open-source / fan
Fan 6/6 = 100% (936 files); usable-structure code 84/936 = 9%, reference-only 852/936 = 91% (image bulk 803/936 = 86%); 4/6 fan projects no licence file = re-implementation reference only, not verbatim vendoring. Gen5plus 7 files + pokeapi-src 252. Inventory docs 3/3 located. Vendored tools 248/248 = 100% usable under stated licences.

## Opponent direction (combat-first, code truth)
Opponent attacks travel left + down, never right, attacker anchor -> target anchor. Single (176,40)->(72,80)=(-104,+40); doubles left (200,40)->(32,80)=(-168,+40); right (152,32)->(90,88)=(-62,+56) on 240x160, y down. Angle = atan2(dy,dx) from those pairs; no degree angles guessed. Shadows at target Y+29, engine-added. PLAIN GAP: source code does NOT encode body parts — mouth/hands/cannons is an art-layer rig anchor, not a code value; any table claiming a code mouth coordinate per move would be invented. Per-move origin/angle table 0/1 = 0%, coordinator/VFX-owned, built from vectors + animation-script offsets + VFX rig points. Do NOT duplicate the combat/VFX build.

## Systems on main (verified by parent, NOT re-claimed by this coordinator)
- Original Black 2 data on main: species 652, moves 560, learnsets, evolutions, trainers 814 (5 categories).
- PR #240: OPEN, NOT merged, 14 files, 0 deletions, stage2-display 15/15, stage2-playable 0/15 — until fix-then-merge worker verifies 14/14 on main, do not claim merged.
- This coordinator applied 0 new files to main (no PR). Other lanes' merges since (battle-math, world maps, mythar, etc.) are NOT counted as this coordinator's wiring.

## Gap list to 100% wired (counts)
- Battle NEED 22/28 rows; line-level diff 8/11 trees = 73% owed.
- Menus NEED 77/97 rows, in build order: field menu 9 -> options 7 -> bag 15 -> shop 8 -> storage 9 -> terminals 8 -> save 11 -> main menu + trainer card 10. Plus form gap: Shop confirm + Save load-confirm currently overlay divs, source pattern is a window on the same dedicated full screen.
- Overworld NEED 63/77 items: movement 13, encounters 16, weather 9, camera 5, lighting 5, zones 8, day/night/seasons 7. Plus Black 2 field dirs 9 inventoried, content 0% extracted in batch B (0 added here).
- Data NEED 20 items: species conversion table, FireRed field-completeness, HeartGold moves/learnsets JSONs, move/ability/item dispatch, item text, nature assignments, True chart wiring, unified learnset loader, evolution widening, trainer backfill, class renames, trainer name swap, facility set-count verification, facility level rules, facility trainer extraction, deduped cross-gen class table, AI unification.
- Title build owed AFTER wiring: 11 gens inventoried, 0 wired; Diamond code source still owed.
- Mod integration: 84 usable-structure code files as reference/re-implementation (not verbatim where unlicensed); fan audio 0 files.

## Mars-only decisions owed (never silently decided)
Battle: Gen3 grid vs Gen4 corner menu layout; badge-boost counterpart; physical/special canonical confirmation; True matchup values incl. Deep.
Menus: box count 14 vs 18 vs 24-unlocked; bag pockets 5 vs 8 vs 5+Free Space; release offered at all?; item descriptions/prices for non-Mochiichao items; save-shape medium (block vs sector); options frame art (10 types); link-player field-menu row (link play).
Overworld: zone->map assignments (615 Black 2 + 264 FireRed + 143 HeartGold); weather-code interpretation; Black 2 projection/camera values; lighting set->location/time; encounter->47 roster mapping; season clock source (device vs in-game); fieldWeather.ts verification gap (in wiring map, absent from work-clone src — re-verify on live main).
Data: item text, nature assignments, class/role renames, trainer name swap, facility level rules, True chart wiring (waits on Deep + new-element matchups), facilities/classes/AI totals owed-verify (distinct class keys Black 2 126 + HeartGold 83 + Emerald 64 + Diamond 96 + FireRed 107 vs 237 brief total), Black 2 battle-facility trainers unextracted.
Title queued: Diamond dropped vs demo loader; Yellow variant choice; video list/order/loop-vs-once.
True Elements: list locked 19/19 (Mars 21:13 Option A, Deep separate mystical legendary, count 19 stands); Deep + new-element matchup values owed (separate True worker staged, no PR); phone check LAST globally after all lanes + True wiring + Pages rebuild — do not ask for it now.
Private repo: full push blocked on git credential (exact error already reported); conversion pipeline not duplicated here.
