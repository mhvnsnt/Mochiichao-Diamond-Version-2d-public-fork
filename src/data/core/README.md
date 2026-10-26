# Data-driven JSON core — `src/data/core/`

Single data-driven JSON core from the Quickest 2026 Ways plan (§1b shapes):
`species.json`, `moves.json`, `learnsets.json`, `evolutions.json`, `trainers.json`,
`encounters.json`, plus JSON Schemas for all six tables and schema-only files for
`maps`, `music`, `backgrounds` (those lanes own the contents — see below).

## Rules followed

- Decomp files (FireRed / HeartGold / Black 2, pret) were used for **schema/structure
  only** — field names, order, state-machine shape. No Pokemon names, stats, dialogue,
  sprites, music, or code were copied into this core. Every value here comes from
  main-branch Mochiichao sources (`global_roster.json`, `species.ts`, `moves.ts`)
  or is flagged provisional/seed (below).
- No ROMs, no paid assets. No new assets are shipped by this PR at all.
- This PR is **additions only**: no existing file is modified or deleted, so the
  live game is unchanged until a wiring PR swaps `species.ts`/`moves.ts` reads to
  these JSON files. That wiring is owed (see below) and needs one decision first:
  `tsconfig.json` on main has no `resolveJsonModule`, so a TS file importing these
  JSONs would fail `npm run lint` (`tsc --noEmit`). The wiring PR must enable it
  (or load via fetch) — not silently done here.

## Coverage (percentages + counts)

| Table | Covered | Detail |
|---|---|---|
| Species (id/name/types/baseStats) | 47/47 = 100% | All 47 roster creatures. One field blocked: Pebblefist HP (see below). |
| Species catchRate/expYield/growthRate/dexText | 12/47 = 26% | From species.ts; null for 35/47, not invented. |
| Species abilities / eggGroups | 0/47 = 0% | Empty in this core; owed, not invented. |
| Moves | 36/36 = 100% | Every move in moves.ts, converted to the plan's effect-object shape. |
| Learnsets, level-up | 47/47 = 100% rows; 12/47 = 26% verified | 12 from species.ts; 35 provisional baseline (TACKLE / QUICK_ATTACK + first-element move), flagged per record. |
| Learnsets, TM / egg / tutor | 0/47 = 0% | Empty; owed, not copied from decomp tables. |
| Evolutions | 29 evolutions, 29/47 = 62% evolve, 18/47 = 38% terminal | All level evolutions from the roster; no item/friendship/time/trade evolutions exist in the roster, none invented. |
| Trainers | 8 trainers, 16 party members (seed) | Original classes/names; no trainer canon exists on main, so a full region roster is owed. |
| Encounters | 3 maps, 4 method tables (seed) | Weights sum to 100 per table/method; full region tables owed. |
| Maps / music / backgrounds | Schema only, 0 content files | Contents owned by the maps / music / backgrounds workers. This core only defines the shapes and the map ids its seed tables reference. |

## Source conflicts found on main (roster wins; all flagged, none silently decided)

1. `global_roster.json` on main is **not valid JSON**: entry 002 reads `"atk: 63`
   (missing quote) and entry 035 reads `"hp": 4-5`. This core repairs 002 to atk 63
   and carries 035 HP as `null` with `hpStatus: pending-decision`.
2. **Pebblefist HP is a Mars decision, still owed.** The roster's `4-5` is not a
   number; this core does not guess 4, 5, 45, or anything else.
3. Roster last entry id reads `331` (sequence is 001–046, then 331). This core
   corrects it to `047` for Mythar and flags it on that entry. If Mars meant
   otherwise, that one entry is the only change needed.
4. `species.ts` (12 entries: 001–010, 038, and Dreadtoise labelled 039) vs roster:
   roster id `040` Dreadtoise wins (matched by name); roster name `AquariiOS` wins
   over species.ts `Aquari-OS`; roster name `Chromejaww` wins over species.ts
   `Chromedile`; roster stats win for 038 Sproutle and 040 Dreadtoise where they
   differ from species.ts. Roster 039 Shellguard has no species.ts entry.
5. `species.ts` still uses Pokemon-style type names (WATER, etc.) while the roster
   uses Mochiichao elements (Aqua, Flora, Chrome…). This core keeps roster elements
   as species `types` and keeps moves.ts type names on moves (the battle code reads
   them). Unifying the two vocabularies is an open decision already warned about
   by `validate:reference` — not decided here.
6. Some moves.ts move names coincide with generic battle-game terms already on main.
   They are carried verbatim because learnset and animation keys reference these
   ids; renaming them is a Mars decision, not made in this PR.

## What remains owed (after this PR)

- Pebblefist HP decision (Mars) — 1 field.
- Abilities + eggGroups for 47/47; catchRate/expYield/growthRate/dexText for 35/47.
- Full level-up learnsets for 35/47 (provisional baselines in place); TM/egg/tutor for 47/47.
- Full region trainers and encounters (seed sets in place: 8 trainers, 3 maps).
- Map definitions for `meadow-route-01`, `pond-route-01`, `cave-route-01` (maps/world lane).
- Music track contents (music worker) and background contents (backgrounds worker), per the schemas here.
- Wiring PR: enable JSON loading (`resolveJsonModule` or fetch) and swap game reads
  from `species.ts`/`moves.ts` to these JSON files, then re-run build/lint/validate.

## Validation

Run `python3 tools/validate_data_core.py` from the repo root. It parses every JSON
file, checks all cross-references resolve (learnset moves, evolution targets, trainer
party species/moves, encounter species), checks encounter weights sum to 100, and
reports the coverage table above. It exits 0 with warnings for the known gaps
(Pebblefist HP, abilities, TM/egg/tutor, seed-only trainers/encounters) — warnings
are open decisions, not failures.
