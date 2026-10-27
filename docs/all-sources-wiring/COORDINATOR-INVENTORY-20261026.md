# All-sources wiring — coordinator inventory (interim, 2026-10-26)
Mars orders: 20:38 CDT wire everything 100% just how Pokemon does it, all games + mod files; 20:39 proprietary definition + opponent-direction + queued start screens; 20:41 autonomous until 100%.

## Proprietary rule (Mars 20:39, supersedes earlier town/cry flagging)
Swap out ONLY: Pokemon species/characters, Pokemon names, Pokemon images, logos, actual literal dialogue. Cries in swap bucket (a Pokemon's voice). Literally everything else usable at 100%: code, move names/moves, systems, structure, values.
Pipeline: full game into private repo mhvnsnt/pokebw2-private-reference first (currently README-only, full push blocked on git credential — do NOT claim pushed, do NOT duplicate private-repo worker), convert Pokemon stuff to Mochiichao there, then bring converted work to public fresh-start repo. Local conversion staging here is separate from the public PR path.

## Canonical sources verified on disk (duplicate clones excluded)
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
| gen5plus/pokeapi-src | 5+ API | 252 | 50M (dir total incl. generated JSONs) |
| fan-reference | fan | 1,111 | 32M |
| TOTAL canonical | 1-5 + fan/API | 253,120 | ~1,900M |

Decomp git shorts (submodules in fresh-start are submodule checkouts, no .git dir at that path): crystal 5c877ef, diamond b623abef, emerald 731ad5b, gold fc702b6, platinum 6eeb1b04, red 171e2c2, ruby 5784633, yellow 9327549. Fresh-start submodule commit known: pokebw2 e522642f9ec496783642df075f05fcd07d3cbc1b.
Fan-reference dirs: BerserkLove_PokemonColosseum, Blynch17_poke-arena, Freakyy-11_Arena-2D, hiro-s-2000_pokemon_arena_2d, lcheng871118-glitch_Empress-iOS, sunsunyul2014-ai_pokemon-arena, plus LICENCES-NOTES.md, MECHANICS-EXTRACT.md.

## Workers fanned out (6, parallel, no further coordinator layer)
1. battle — core + opponent-direction inventory only, NO VFX build (combat/VFX coordinator owns build)
2. menus-bag-shop-pc-save — dedicated full screens only
3. overworld — encounters/weather/camera/lighting/zones/field, builds on Black 2 batches
4. data-systems — species/moves/abilities/items/natures/types/learnsets/evolutions/trainers/facilities/classes/AI, cross-gen
5. title-inventory-queued — title/start code per gen, QUEUED NOT APPLIED, background-video slot only, logo/studio untouched
6. mod-community — mod/open-source/fan inventory, duplicates counted as 0 new sources

## Do NOT duplicate / overwrite
- Combat/attack wiring coordinator (19:49 CDT) — combat build
- Black 2 whole-game coordinator (19:42 CDT) — Black 2 usable extraction
- PR #240 fix-then-merge worker — GardenView + sheet errors, then merge PR #240, SHA-verify 14/14
- black2-everything-else/stage2-pr/, wiring/, batch-* staging
- No PR creation/merging in this coordinator task — report PR-ready batches only.

## Queued after wiring (do not apply yet)
- Interchangeable start screens: background videos only, coded how Pokemon codes title screens, Black 2 + all gens, logo/studio card untouched.

## On main (already verified by parent, not re-claimed here)
- Original Black 2 data: species 652, moves 560, learnsets, evolutions, trainers 814 — on main.
- PR #240: OPEN, NOT merged, 14 files, 0 deletions, stage2-display 15/15, stage2-playable 0/15. Do not claim merged until fix-then-merge worker verifies.

## Worker results (reconciled as they land)
### Worker 6/6 mod-community — DONE 2026-10-27
File: all-sources-wiring/mod-community/mod-community-inventory-2026-10-26.md
- Fan-reference 6/6 = 100%, 936 files (934 project + 2 notes): Colosseum 792, poke-arena 66, Arena-2D 28, arena_2d licence-only 2, Empress-iOS 41, ai-arena 5.
- Usable-structure code 84/936 = 9%; reference-only 852/936 = 91% (image bulk 803/936 = 86%). Licence caveat: 4/6 fan projects have no licence file — re-implementation reference only, not verbatim vendoring, until licence confirmed.
- Gen5plus: 7 files (species 532, moves 871, learnsets 532 species / 8,541 entries, evolutions 380); pokeapi-src 212 files (187 CSV + 25 code/build/config/doc, BSD-3-Clause code).
- Inventory docs 3/3 located: fresh-start/docs/modding-pulls-inventory.md (86 lines), open-source-pulls.md (70 lines), goal files pulled-in-inventory.md (5,647 bytes; no copy under fresh-start/docs/).
- Vendored tools 248/248 = 100% usable under stated licences (rot.js, FastNoiseLite MIT, WFC MIT, DSDecmp, ndstool, 17 own scripts/docs).
- Duplicates counted as 0 new sources: 67 dirs matching duplicate-clone patterns under mochiichao-work, plus fan .git internals 173 files, plus decomps trees (decomp lane, would double-count).
- Gaps: 1/6 fan projects licence-only, 1/6 porting shell only (no game bundle), fan audio 0 files, pulled-in-inventory missing from repo docs tree (1/3 docs).

### Worker menus-bag-shop-pc-save — DONE 2026-10-27
Files: all-sources-wiring/menus-bag-shop-pc-save/mapping-menus-bag-shop-pc-save.md, wiring-snippets.ts
- Overall HAVE 20/97 = 21%, NEED 77/97 = 79% (table-row grep verified).
- By system: field menu 0/9, title-adjacent main menu 0/5, options 0/7, bag 3/18 = 17%, shop 7/15 = 47%, storage boxes 7/16 = 44%, item terminal/mailbox 0/8, save/load 3/14 = 21%, trainer card 0/5.
- Key real-file numbers: bag FireRed 5 pockets 186 slots, HeartGold 8 pockets 486 slots, Black 2 5 pockets + Free Space 614 slots; boxes FireRed/Emerald 14x30=420, HeartGold 18x30=540, Black 2 up to 24x30=720 (8->16->24 unlock), Gen2 14x20=280, Gen1 12x20=240, party 6 every gen; shop sell = floor(buy/2), Black 2 shop list max 45; save FireRed 2 slots x 14 sectors, sector 3968+128, signature 0x08012025.
- Form gaps (not extra rows): Shop confirm and Save load-confirm currently render as overlay divs, source pattern is a window on the same dedicated full screen.
- Mars-only decisions owed: canonical box count 14 vs 18 vs 24-unlocked; bag pockets 5 vs 8 vs 5+Free Space; whether to offer release at all (PcView deliberately does not); item descriptions/prices for non-Mochiichao items; save-shape medium (block vs sector payload); options frame art (10 types); link-player field-menu row depends on link play.
- Sanitising: forbidden grep 0 hits on both staged files; 0 files unsiftable.

### Worker title-inventory-queued — DONE 2026-10-27, QUEUED NOT APPLIED
File: all-sources-wiring/title-inventory-queued/title-inventory-queued-2026-10-26.md (517 lines)
- Generations inventoried 11/11 = 100%; primary title-code files 24; title-named files by filename 132 across 10 gens; Diamond 0 by filename (gap).
- Per gen primary files: FireRed title_screen.c 1,315 lines; HeartGold 863; Black 2 ov162/title.c 719 (layers hidden frame 1,740, timeout 6,780); Emerald 869; Ruby 814; Crystal title.asm 374 + unused 171; Gold 206; Yellow 383 + 122 + 109 variants; Red 417 + 120; Platinum applications/title_screen.c 1,426; Diamond 0 code, assets only (op_demo 74 + titledemo 3, 96 format files total).
- Background-video slot in every gen: background plane / animated scene loaded in step 2, BEHIND logo slot and BEHIND start prompt. Black 2 TitleBG + TitleG3D curve scene is closest analogue to timed video background.
- Graphics/sound structure only, no art/audio bytes: GBA sound files FireRed 844, Emerald 1,303, Ruby 940; DS Nitro formats; Platinum res/sound 1,406; Black 2 res/sound 13,934; GB/GBC audio Crystal 113, Gold 102, Yellow 511, Red 385.
- Queued build needs from Mars (not invented): Diamond dropped vs generic demo loader; Yellow variant choice; video source list/order/loop-vs-once. No game view edited, no logo/studio/title art touched, no video added, 0 deletions.
- Unfinished in inventory: Diamond code source 0/1 (10/11 gens with located code = 91%).

### Worker data-systems — DONE 2026-10-27
File: all-sources-wiring/data-systems/data-systems-mapping-20261026.md (619 lines)
- Systems mapped 12/12 = 100% (species, moves, abilities, items, natures, types, learnsets, evolutions, trainers, facilities, classes, AI). Mapping 100% != wired 100%.
- Extraction re-verified: species Yellow 151, Crystal 251, FireRed 386, Emerald/Ruby 386, Diamond 500, HeartGold 507, Black 2 652; moves Yellow 165, Crystal 251, FireRed 354, Diamond 470, Black 2 560; Black 2 learnsets level 9,604 / TM-HM 20,604 / tutor 7,117 / egg 2,773; evolutions FireRed 184, Diamond 246, HeartGold 247, Black 2 321; trainers Black 2 814/1,808, HeartGold 738/1,776, Emerald 854/1,825, Diamond 849/1,585, Crystal 541/1,254.
- Cross-gen conflicts (9): Gen1 baseSpecial split; Gen2 no abilities/natures; Gen3 no move category (derivedCategory only) vs Black 2 explicit; learnset shapes differ; held items 2 vs 3 slots; FireRed JSON 13 fields vs ~22 in source; source types 17 vs live constants.ts 18; species.ts single-target evolutions vs branched source; Black 2 trainer JSON drops ai_flags/items/heals/money/reward/messages — backfill needed.
- True Elements applied: 21:01 rulings + 21:09 Earth=Ground confirmed, Clairvoyant firm, Deep=Ground withdrawn + 21:10 Deep-might-be-Psychic question (no ruling). Worker ALSO reports a 21:13 Option A (Deep stays separate mystical legendary, count 19 STANDS, locked 19 list) sourced from a MEMORY update — PARENT TO CONFIRM SOURCE, not independently verified by coordinator.
- Gaps to 100%: 20 NEED items (§5 of mapping), incl. species conversion table, HeartGold moves/learnsets JSONs, move/ability/item dispatch, nature assignments, True chart wiring (waits on Deep + new-element matchups), unified learnset loader, evolution widening, trainer backfill, class renames, facility level rules, AI unification. Live-game context: species.ts 12/47 roster slots = 26%.
- Caveats: facilities/classes/AI brief totals NOT re-verified to exact totals (distinct class keys Black 2 126 + HeartGold 83 + Emerald 64 + Diamond 96 + FireRed 107, so 237 must be deduped/single-gen — OWED-VERIFY); Black 2 battle-facility trainers still unextracted; sanitisation final re-check 494 Black 2 species names = 0 hits.

### Worker battle-core — DONE 2026-10-27, inventory only, NO VFX build
Files: all-sources-wiring/battle/battle-core-mapping-20261026.md, battle-core-snippets-20261026.md
- Mapping rows HAVE* 6/28 = 21%, NEED 22/28 = 79%. Sources deep-read 3/11 trees = 27% (FireRed, HeartGold, Black 2); file-list/count-only 8/11 = 73%.
- Systems: battle flow 10 steps, turn order (run-first, switch/item before moves, priority-then-speed, random ties), damage core ((2L/5+2)xPowerxA/D)/50+2 plus crit/STAB/type/screen/weather/spread order, accuracy stages, crit stages {16,8,4,3,2} x2, random 85-100 (100-rand%16), stat stages -6..+6, statuses with end-turn fractions, multi-hit/charge/recoil/trapping/protect/substitute/weather/screens.
- Menus as dedicated full screens: Gen3 windows 25/25, Gen4 states 21/21, Gen5 screens 4/4 inventoried; menu wiring 0/3 families = 0%.
- Swap-correction applied: mapping does NOT propose replacing resolver (PR #107 live engine); battle-math stays reference module. Caveat: HAVE* means exists per PR #107 correction, worker read stale work-clone branch not live main, so resolver not re-verified by this worker.
- OPPONENT DIRECTION code truth: every animation places effects attacker anchor -> target anchor via same sprite-coord accessors, so opponent attacks travel left + down, never right. Verified anchors (240x160, y down): single opponent (176,40) -> player (72,80) = (-104,+40); doubles opp-left (200,40) -> player-left (32,80) = (-168,+40); opp-right (152,32) -> player-right (90,88) = (-62,+56). No degree angles guessed — angle is atan2(dy,dx) from those pairs. Effect Y = picture-offset Y (table Y + front/back offset - elevation opposing, +8 player side, clamped); shadows at target Y+29, engine-added.
- Archetypes 8/8 = 100% inventoried (contact lunge, projectile, beam/line, target burst, attacker self, ground/shadow at feet, spread/multi, target-indicator bounce); wiring 0/8 = 0% (coordinator/VFX-owned).
- Plain gap: source code does NOT encode body parts — mouth/hands/cannons is an art-layer rig anchor, not a code value; any table claiming a code file gives a mouth coordinate per move would be invented. Per-move origin/angle table 0/1 = 0%, coordinator-owned, built from vectors + per-move animation-script offsets + VFX rig points.
- Gaps: line-level battle diff 8/11 trees = 73%; True matchup values 0/19 rows = 0% (data worker area). Mars-only decisions (4): Gen3 grid vs Gen4 corner menu layout; badge-boost counterpart; physical/special canonical confirmation; True matchup values incl. Deep.
- Sanitisation: forbidden grep 0 hits on both files (source filename replaced with creature-data-module); species-locked damage branches (4) replaced by generic roster-lock note; 0/2 files unsifted.
