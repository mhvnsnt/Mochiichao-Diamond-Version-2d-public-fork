# Quickest 2026 Ways — checklist scored in impact order

Scored against main `407e0b05` (PR #102) plus open PRs known at this
check (2026-10-26 ~01:xx CDT). "On main" means verified in the main tree
this worker cloned; "open PR" means another lane's PR, NOT merged and NOT
counted as done; "owed" means not on main and not in an open PR this
worker verified. Percentages always carry their count (Mars rule).
Items this slice did not count are marked "not counted here" — the
owning lane's report is the source, not this file.

Impact order = the plan's own multiplier order (§3/§4): data first,
then the battle engine, then overworld, then art pipelines, then music,
then backgrounds, then title/intro polish, then breeding/garden, then
accessibility/performance. Cheapest rows that unlock the most other
rows come first.

## 1. Data-driven JSON core (§1b, §3, §4 step 2) — biggest multiplier

| Item | Score |
|---|---|
| species.json (plan week-1 target: 20; roster canon: 47) | Open PR #98: 47/47 = 100% rows, 0/47 on main as JSON (species.ts 12/47 = 26% of roster) |
| moves.json (plan target: 40; moves.ts canon: 36) | Open PR #98: 36/36 = 100% rows; on main as TS 36/36 = 100% |
| typeChart.json (12 True Elements, 144 cells) | This PR (TS, not JSON): 76/144 = 53% sourced; 24/144 = 17% conflict; 44/144 = 31% owed |
| learnsets.json | Open PR #98: 47/47 rows, 12/47 = 26% verified (per its README) |
| evolutions.json | Open PR #98: 29 evolutions (per its README) |
| trainers.json (plan target: 10) | Open PR #98: 8 seed trainers (per its README) |
| encounters.json | Open PR #98: 3 maps / 4 tables seed (per its README) |
| Schemas + completeness validator | Open PR #98: 6 schemas (per its README); on-main validator exists (validate-reference.ts) but flags True-Element warnings |
| **Data core, on main** | **0/7 tables as JSON = 0%; as TS on main 2/7 (species partial, moves full)** |

## 2. Battle resolver (§2f, this slice)

| Item | Score |
|---|---|
| Turn loop in resolver code (order / action / target / resolve / win-check) | 5/5 = 100% |
| Turn loop wired into live BattleView | 0/5 = 0% |
| Damage (formula / STAB / crit / roll) | 4/4 = 100% (BattleView formula preserved) |
| Effect strings mapped (data, not per-move code) | 13/13 = 100%; moves convertible 36/36 = 100% |
| Status moves existing | 0/36 = 0% (none in moves.ts — content owed, not code) |
| Switching / AI choice / double battle / capture-in-resolver | 0/4 = 0% |
| NineSlice frames: API + defs / texture assets / PixiBattleCanvas wiring | 3/3 defs = 100%; 0/3 textures = 0%; 0/1 wiring = 0% |
| Live win-path playtest (VICTORY + Continue in browser) | 0/1 = 0% — must be delegated; subagents cannot run a live browser |

## 3. Overworld engine (§4 step 3: Tiled loader, collision, warps, NPC dialogue)

| Item | Score |
|---|---|
| Tiled / pixi-tiledmap wiring | Open PR #61 (world wiring 1, unverified by this worker — not counted here) |
| Maps on main | Not counted here (FullWorldMaps/Maps.ts exist; tileset lane owns the count) |
| Capture formula / party (6) / storage / levelling / evolution / save-load | Not counted here; BattleView catch + engine gainExp exist on main, full-system count owed to its lane |

## 4. Sprite cleanup + animation (§2a, §2b)

| Item | Score |
|---|---|
| rembg + BiRefNet (MIT) bulk cleanup pipeline | Separate sprite-cleanup worker running at this check — not counted here, do not duplicate |
| Title cutouts confirmed by Mars | 2/10 = 20% (Yogiferno v2, Mochii v1, per coordinator inventory); 8/10 = 80% owed |
| Sprite animation (Pixelorama / cel pipeline) | Not counted here |

## 5. Music system (§2e, §5)

| Item | Score |
|---|---|
| Music engine (buses, stems, gapless OGG registry) | Open PR #96: system 4/4 = 100% (per its worker report, not merged) |
| Soundtrack registry entries | Open PR #96: 37/37 = 100% registry; tracks composed 0/37 = 0% |
| Title/intro/main-menu wiring | Open PR #104 (v3 re-cut, not merged at this check) vs PR #103 (conflicted, closed) — decision owed: draft-only vs wire-v3-as-official; do not merge either over the other silently |
| Boot B + press-start M3 wiring | On main: 2/2 = 100% (PR #79 merged) |

## 6. Tileset / background system (§6)

| Item | Score |
|---|---|
| Tileset system (primary+secondary, metatiles, layers, day/night/season/weather) | Separate tileset worker running at this check — not counted here, do not duplicate |
| Places as recombinations (plan: 20+; §4 week-1 target: 5 maps) | Not counted here |

## 7. Title / intro / UI frames (§2c, §2d)

| Item | Score |
|---|---|
| Title backgrounds on main | 8/8 = 100% files, 0/8 wired until Mars sees the PNGs (show-first) |
| Per-menu Y2K skins | On main 2/8 = 25% (Pause, Bag); 6/8 = 75% owed |
| Swappable frames (NineSlice, this slice) | API 1/1 = 100%; texture assets 0/3 = 0% (see §2) |
| Intro playback | Open PR #63 (mergeable unknown at last coordinator check — do not merge over unknown) |

## 8. Breeding / garden / quests / weather-time-seasons (§2f)

| Item | Score |
|---|---|
| Breeding system (plan: ~5 rules + UI, no library exists) | 0/1 = 0% in this slice's count; garden design doc exists, build 0% per prior audit — lane count owed |
| Garden / raising | Not counted here (Chao Garden conversion doc exists; engine count owed to its lane) |
| Weather / time / seasons systems | Open PR #64 (field/weather, per coordinator inventory) + §6 system — not counted here |

## 9. Polish (§4 step 5)

| Item | Score |
|---|---|
| Accessibility (reduced motion, contrast, font scaling) | Not counted here |
| Performance (atlas packing, batching, WebGL fallback test) | Not counted here |
| Pages deploy from latest main | Owed after every merge batch (coordinator owns Pages; this PR publishes nothing) |

## Plan §2f "100% of systems" definition of done, scored as rows

title / intro / new-continue / overworld / encounters / capture / party /
storage / summary / battle (wild, trainer, gym/dojo, rival, champion,
double) / levelling / evolution / breeding / garden / items / quests /
weather-time-seasons / save-load / settings / music-SFX mixer / credits:
counted rows this worker can verify — battle resolver code 1 row's engine
portion done, live battle row still owed (no win-path playtest), settings
rows largely present on main, everything else = lane counts owed. A single
100% number for this list would be invented; the per-item table above is
the honest score until each lane reports its row with counts.
