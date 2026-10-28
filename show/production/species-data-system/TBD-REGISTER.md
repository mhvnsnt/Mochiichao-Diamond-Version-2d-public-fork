# TBD register — Gen 1 species data

Every unknown in the Gen 1 species data, in one place. House rule (the data
core's own convention): **unknowns are never silently filled** — they sit
here, owned, until the owner or the responsible lane supplies them. Items
marked ◆ are owner decisions (only Jamar can close them); the rest are lane
work items.

## Owner decisions ◆

| # | TBD | Scope | Notes |
|---|---|---|---|
| D1 ◆ | Canonical numbering registry | all species | Core says Mythar 047; dex registry says 331 and adds Dorowani 147 / Gabu 148. Pick the canonical scheme before any new-species numbering (intake template Gate 0). See GAP-AUDIT Conflict 2. |
| D2 ◆ | Pebblefist HP | Pebblefist | Roster now reads 40; species.json carries null + "pending-decision". Ratify 40 or set another value; then align both files. GAP-AUDIT Conflict 3. |
| D3 ◆ | Dorowani + Gabu base stats | 2 species | No canon stats exist anywhere. Needed before either can battle in game data. Gap-fill records carry null stats in the core's convention. |
| D4 ◆ | Dorowani + Gabu types confirmation | 2 species | Gap fill derives Aqua (Water Orb canon) / Earth (Tremor canon) from their owner-locked signature moves. Confirm or correct. |
| D5 ◆ | Height / weight / category per species | 49 species | Recorded nowhere in the repo. Can be set per species at sheet time (design lane proposes, owner locks) — the intake template carries the fields. |
| D6 ◆ | Type vocabulary unification | system | species.ts Pokémon-style names vs roster elements (data-core README, open decision). Intake uses elements until ruled otherwise. |

## Lane work items (writing / data completion)

| # | TBD | Scope | Where it lands |
|---|---|---|---|
| W1 | bio_short (dexText) | 35 core species + Dorowani + Gabu | `species.json:dexText` — writing task in the house dex voice (12 existing entries are the style reference) |
| W2 | bio_long | all 49 | New written block; no lane location exists yet — propose `species.json:bioLong` via schema extension or a companion file, lane to choose |
| W3 | temperament / diet / social pattern | all 49 | Same new natural-history block as W2 |
| W4 | abilities + hidden ability + egg groups | 47 core (+2 gap-fill records) | `species.json` fields exist, values owed (data-core README) |
| W5 | catchRate / expYield / growthRate | 35 core + Dorowani + Gabu | `species.json` fields exist |
| W6 | Full region encounter tables (habitat, method, levels, time, weather) | 36 species unseeded; seed covers 13 on 3 maps | `encounters.json` (maps/world lane owns map definitions) |
| W7 | Verified learnsets | 35 species on provisional baselines | `learnsets.json` (provisional flags already in place) |
| W8 | Dorowani + Gabu learnsets + evolution data | 2 species | `learnsets.json` / `evolutions.json` have no rows for them at all |
| W9 | Cry *descriptions* (written) | 49 | Audio exists 49/49; no written cry description field exists — add only if the dex design needs it |
| W10 | Per-species palette record | 49 | Palette assets/systems exist (garden sets, creaturePaletteSheets); no per-species palette field in the core |
| W11 | Stale silhouette-manifest note | 1 file | `SILHOUETTE-MANIFEST.json:_purpose` still says footprints "still to be made" — update to point at PR #237's footprints-real set |

## Explicitly NOT TBD (already done — do not redo)

Footprints 49/49 · silhouettes 49/49 · cries 49/49 (V1+R1) · discovery
states + dex media wiring 49/49 · types + design tags 47/47 · base stats
47/47 (except Pebblefist HP, D2) · evolutions for the 47 · idle sets 49/49 ·
garden poses 49/49 (+1 form).

## Owed fields — egg system (#77, registered 2026-10-27)

- `hatchCycles` — owed field on the species core record (shape defined by `src/data/core/schemas/egg-system.schema.json`, beside the existing `eggGroups` gap). No values exist yet; do not backfill.
- `hatchPresentation` — owed field, same registration and status.
