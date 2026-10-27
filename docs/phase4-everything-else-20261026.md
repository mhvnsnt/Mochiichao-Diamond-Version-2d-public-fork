# PHASE 4 — EVERY OTHER SYSTEM + WORKSPACE MODS (2026-10-26)

Mars's go-ahead: 2026-10-26 ~20:52 CDT. This PR extends (never redoes)
`COMBINED-INVENTORY-20261026.md`: combat wiring belongs to the sibling
worker. This PR touches NO battle files: no battleResolver,
battleIntegration, battleWiring, battleTreatments, BattleView,
PixiBattleCanvas, or creatureAnimation.ts.

Local CPU only — no Kaggle, no GPU. Merged ≠ live until a Pages rebuild +
playtest. This PR is opened, NOT merged (a sibling worker may be merging
combat in parallel; the parent sequences merges).

## Shown first: what this PR does

In Pokemon's own order (overworld → clock → weather → encounters →
trainers → items/berries → breeding/daycare → Garden → contests/frontier →
storage/save → art), it wires what the workspace mods/tools ACTUALLY
support — world generation, Garden systems, and art pipelines — and it
registers everything else with an honest status instead of claiming it.

## Files in this PR (additions only, 0 deletions)

| File | What it wires |
|---|---|
| `src/lib/wiring/phase4-worldgen.ts` | rot.js-shape dungeon (rooms + corridors + connectivity) + FastNoiseLite-shape fractal value noise + biome thresholds + line-of-sight FOV. Original code; vendored libraries not copied. WFC is NOT duplicated — `wiring/wfc-isle.ts` already covers isle maps on main. |
| `src/lib/wiring/phase4-garden.ts` | Berry growth-stage machine (plant → sprout → growing → bloom → fruit → withered, watering multiplier, harvest-timing yield, multi-patch manager) + Chao-lane companion care loop (hunger/mood/energy/affection decay + effect deltas + rebirth gate) + daycare step-tick helper. Complements `garden-wiring.ts`, `garden-data.ts`, `creatureDaycare.ts` — replaces none of them. |
| `src/lib/wiring/phase4-art-pipeline.ts` | Background-removal job spec (rembg shape) + masked-edit job spec (edit one region, preserve rest) + sprite-sheet validation (locked vs staging) + Garden model/level/texture pipeline stages (sa_tools shape, Garden only). Offline authoring jobs — the game ships finished art, not the tools. |
| `src/lib/wiring/phase4-data-shapes.ts` | Personal-data table type + legality checklist validator (tables passed in, never hardcoded) + versioned learnset-table check (pkNX lesson: formats change per generation) + NDS header-field spec + safe 512-byte header parser (oversize rejected, no ROM bytes). PKHeX/pkNX are GPL-3.0: shapes only, zero lines copied. |
| `src/lib/wiring/phase4-everything-else.ts` | Registry of 24 non-combat systems in Pokemon's order, each with sources, what it wires, what it cannot, and status. Includes the Arena-2D rebuild label (below). |
| `src/lib/generated/phase4-crosschecks-20261026.json` | Aggregate counts only (species/moves/learnsets/trainers/encounters/evolutions per tree + Gen 5–9), with extraction flags embedded. Zero individual names. |
| `docs/phase4-everything-else-20261026.md` | This doc. |

All Phase-4 modules are import-free (no imports from game screens or
battle files), so they cannot break sibling files or drift with main.
Each module carries a self-check function; no test-runner change is in
this PR (package.json untouched).

## Phase-2 inventory: trees 8/8 = 100%

Full detail: workspace `mochiichao-work/combat-wiring-20261026/
PHASE2-INVENTORY-20261026.md` (extends the combined inventory).

| Tree | What it is | Can wire (non-combat) | Cannot (honest) |
|---|---|---|---|
| pokered (Gen 1 asm) | 226 maps, wild/item/tileset tables, overworld events, daycare EXP | Wild tables, trainer shape, overworld events, daycare EXP/step shape, growth rates | Breeding, day/night, berries, held items, abilities — none exist in Gen 1; no Red-only JSONs on main |
| pokeyellow (Gen 1 asm) | Red + follower-companion data | Everything Red can + follower shape | Same Gen-1 limits; follower art/cries not wired |
| pokegold (Gen 2 asm) | 608 maps, RTC, phone, radio, decorations, pokegear device | Day/night clock shape, time-of-day encounters, phone/radio/decoration shapes, held items, breeding shape | No Gold-only JSONs on main (Crystal is the counted Gen-2 source) |
| pokecrystal (Gen 2 asm) | Gold + Battle Tower; 643 maps | All Gold shapes, counted: 251 species, 251 moves, 541 trainers, breeding/egg counts, Tower streak shape | Berry planting machine (Gen 3), contests, abilities |
| pokeruby (Gen 3 C) | Berry, daycare, storage, contest, secret base, safari, field weather, clock | Berry machine, storage boxes, contest shape, secret-base shape, safari rules, field weather | Frontier (Emerald only); tutor extraction empty (0/0, flagged) |
| pokeemerald (Gen 3 C) | Ruby + Frontier, factory, mystery gift, tutor set | All Ruby shapes + Frontier/facility shapes, mystery-gift record shape, tutor learnsets (372 species / 5,309) | Contest art/music, facility art |
| pokediamond (Gen 4 DS) | ARM9: daycare, storage, berry-tree + underground script commands, RTC weather, mail, device widgets, 82 overlays | Physical/special split as shape, underground shape, RTC-weather shape, device-widget shape, move-relearner shape | Encounters + egg JSONs owed; contest tables not in JSON |
| pokeplatinum (Gen 4 DS) | Berry-patch manager, underground, Frontier + regulation/validation, transfers, poffin cooking | Berry-patch manager shape, underground inventory, regulation/legality-checklist shape, transfer shape, cooking shape | Stats/moves/learnsets/evolutions/encounters NOT extracted (binary-only); names only, with a 1-entry count-field discrepancy (496 vs 495 species, 469 vs 468 moves) |

## Gen 5–9 PokeAPI cross-check (re-counted, not copied from the summary)

532 species (Gen 5: 156, Gen 6: 72, Gen 7: 88, Gen 8: 96, Gen 9: 120);
871 moves (physical 373, special 242, status 256; null power 313, null
accuracy 273); 8,541 deduplicated level learnset entries across 532
species; 380 evolutions (level-up 254, spin 63, use-item 37, trade 11,
other 15 — the trigger enum must stay open-ended). Use: data-shape
validation only. No Gen 5–9 decomp code exists on disk, so no Gen 5–9
system is wired, and no Gen 5–9 names appear in this PR.

## Tool groups wired: 10/10 = 100% (to what each actually supports)

| Group | Wired to | Combat? |
|---|---|---|
| rot.js | Dungeon + FOV (`phase4-worldgen.ts`) | No |
| FastNoiseLite | Terrain noise (`phase4-worldgen.ts`) | No |
| WaveFunctionCollapse | Already on main (`wfc-isle.ts`); not duplicated | No |
| dsdecmp | Compression-kind + header descriptors, offline only | No |
| ndstool | Container header-field spec, offline only | No |
| pkhex (GPL-3.0) | Personal table + legality checklist shapes only | No |
| pknx (GPL-3.0) | Versioned learnset-table shape only | No |
| sa_tools | Garden model/level/texture pipeline stages only | No |
| image-editing | Masked-edit job spec | No |
| venv-rembg | Background-removal job spec | No |

Tool groups wiring combat: 0/10 = 0% — by design, confirmed, not a gap.

## Arena-2D: STUDY/REBUILD ONLY

Freakyy-11 Arena-2D (4,403 lines; `attaques.js` 2,001 lines) has NO
licence file. Its code and art are NEVER copied and NEVER shipped. Its
ideas already exist as Mochiichao's own rebuild in
`sprite-art/arena-combat/` (arenaCombat.js 1,129 + moveData.js 738 +
fanMechanics.js 510 + tests) — this PR does not re-derive or touch it,
and labels every reference to it as REBUILD. The other five arena
projects and `chao-modding-docs/` are study sources only (Garden for the
latter, never attack wiring).

## Registry summary (25 systems)

On main already: 7 (overworld maps, WFC isle, day/night, field weather,
trainers, items, breeding/daycare). Added in this PR: 8 (dungeon, noise,
FOV, berries, Garden care, storage/data shapes, binary tooling, art
pipeline — see `phase4-everything-else.ts`).
Owed (extraction or future pass): 6 (wild encounters for Diamond/
Platinum, contests tables, frontier/safari/underground playability,
True-Elements chart wiring). Study-only: 4 (follower, phone/radio/
decorations, Arena-2D rebuild, Gen 5–9 cross-check). 7 + 8 + 6 + 4 = 25.
Full per-system table lives in the registry file, not just here.

## What remains (counted)

- Platinum stats/moves/learnsets/evolutions/encounters extraction; Diamond
  encounters + egg extraction; Gold-specific extraction (or an explicit
  decision to keep Crystal as the Gen-2 counted source); Ruby tutor
  extraction; Emerald/Ruby 25 unresolved learnset sections; Platinum
  names count-field explanation; contest move-table JSONs.
- True-Elements chart wiring: list locked at 19 during this work (Deep
  separate mystical legendary, option A, 2026-10-26 ~21:13 CDT;
  Clairvoyant stays Psychic) — matchup values still owed, and chart
  switching stays a Mars decision, not a wiring default. Not decided here.
- Merges (parent sequences), Pages rebuild + playtest (follows merges),
  combat wiring (sibling worker).

## Proprietary rule (governing, 2026-10-26 ~20:39 CDT)

Swap out ONLY species/characters, names, images, logos, literal dialogue;
cries stay swapped out. Town names are NOT re-flagged. Mechanics, timing,
structures, orders, windows, inputs, values, and data shapes are the
wireable layer. This PR contains zero species/character names, zero
dialogue, zero cries, zero logos, zero art from any other game.
Deletions: NONE.
