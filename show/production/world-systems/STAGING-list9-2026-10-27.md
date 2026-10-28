# STAGING — list9-systems teardown package

**Size class: everything here is repo-sized.** The whole package is
Markdown + JSON, on the order of tens of KB total. Nothing is
TeraBox-class; per Jamar's staging rule it all belongs in GitHub,
landing through the side lane's PR flow (this package is the
repo-ready source, staged in the workspace only until that
landing).

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths

| File | Proposed home | Why there |
|---|---|---|
| `77-EGG-SYSTEM.md`, `79-MOCHI-FRUIT-FARM.md`, `84-SOUND-ECOLOGY.md`, `85-IRIDESCENCE-WAYFINDING.md`, `86-POSTGAME-FACILITIES.md` | `show/production/world-systems/` | With the List-2 world-systems docs (spawn tables, route graph, completion) they extend |
| `egg-system.schema.json` | `src/data/core/schemas/egg-system.schema.json` | With the core schemas; it defines shape for the existing `eggGroups` core field plus the owed `hatchCycles`/`hatchPresentation` fields |
| `78-GARDEN-SHOWCASE.md` | `show/production/world-systems/` (Garden cluster, beside the care-loop/raising docs when they land) | A Garden event system; its engine constraint (no battle state) is stated for the game lane from there |
| `80-INDIVIDUAL-VARIATION.md` | `show/production/species-data/` | The individual layer over the species sheets — beside the evolution edges and sheet docs |
| `individual-variation.schema.json` | `src/data/core/schemas/individual.schema.json` | Core schemas; consumed by the save layer and the art lanes' deviation gate |
| `81-MOCHIIOTECA-DEVICE-BEHAVIOUR.md` | `show/production/world-systems/` (beside MOCHIIOTECA-COMPLETION.md) | The device behaviour layer over the completion loop's data |
| `82-SHOW-ARC-PLANNING.md` | `show/production/` (beside SEASON-CANON-MAP) | A show-planning instrument; arc-plan records created under it live with episode packages |
| `83-BATTLE-SPRITE-PRESENTATION.md` | `show/production/battle/` (with BATTLE-UI-FLOW.md and the animscript docs) | The staging layer under the battle UI flow |
| `README.md` | `show/production/list9-systems-INDEX.md` on landing, or folded into the production research INDEX | Package index |
| `STAGING.md` | stays with the package until landing; then `show/production/world-systems/STAGING-list9-2026-10-27.md` as the landing record | Landing bookkeeping, per lane convention |

## Landing notes for the side lane

- **No existing repo file is modified by this package.** Two
  follow-on edits are *proposed*, not made: (a) register
  `hatchCycles` + `hatchPresentation` as owed fields in
  TBD-REGISTER beside the existing eggGroups gap; (b) optionally
  add `appeal` to move records for #78 — field proposed, values
  OPEN. Both are lane decisions at landing.
- **#80's deviation registry has exactly one canon entry** (Doro's
  eye whites, ruled 2026-10-27, sourced to MEMORY.md). Land the
  schema + that one entry only; do not bulk-generate deviations.
- **#85's Leak rule is checkable at landing:** the secret-vocabulary
  list in the doc can be run against existing R1 sign lines as a
  smoke test (the canon sweep already scrubbed them; expect zero
  hits — a hit is a finding, not a formality).
- **#84's depths table is intentionally empty.** Land it empty.
  Any future row there is a canon event.
- **#86 uses display names** (Seven Mochii Isles) in all
  player-facing strings per the two-lane law; production ids are
  untouched.
