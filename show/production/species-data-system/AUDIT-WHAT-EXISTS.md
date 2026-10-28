# Audit — what already exists (Gen 1 species data apparatus)

Audited 2026-10-27, read-only via the GitHub PAT against
`mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start` @ `main`, plus the local
workspace staging (`~/workspace/mochiichao-show/repo-add/`). **Conclusion up
front: the species data apparatus is already built.** This package does not
replace any of it — it maps the gaps in it and fills only those.

## The headline finding

There are **three different roster counts live in the repo at once**:

| Layer | Count | Where |
|---|---|---|
| Core data | **47** | `src/data/core/species.json` (+ `src/lib/global_roster.json`) |
| Asset / dex layer | **49 species** | dex registry, footprints, silhouettes, cries, idle/garden assets |
| Brainstorm | **60 concepts** | `show/production/NEW-SPECIES-IDEAS.md` — explicitly *ideas, not canon* |

The 49 = the core 47 **plus Dorowani and Gabu**, who exist in every asset and
dex layer but have **no record in species.json or global_roster.json** (see
GAP-AUDIT.md, Conflicts). The lane's "51" figures (PR titles, manifest names)
count *files*: 49 species + Strikechamp's two form variants
(`strikechamp_unsuited`, `strikechamp_unsuited_full`). The "60" is the
brainstorm bucket count in NEW-SPECIES-IDEAS.md, whose own header states the
canon roster is 47 and nothing in the file adds to it. There are also 2
owner-directed anchors (the Volcano Oni of the Festival, Pantera) and 6
Bucket-D register sketches in that file — candidates, none confirmed, none
with sheets.

**Gen 1 working roster for this package = 49 species** (47 core + Dorowani +
Gabu), with Strikechamp's forms tracked as forms of Strikechamp.

## What exists, by element

### Core data (game) — `src/data/core/` (PR #98, data-core)
- `species.json` — 47 records: id, name, types, baseStats, hpStatus,
  abilities, hiddenAbility, eggGroups, catchRate, expYield, growthRate,
  dexText, provenance, notes. Shape governed by
  `src/data/core/schemas/species.schema.json`.
- Coverage per the core's own README: id/name/types/stats 47/47;
  catchRate/expYield/growthRate/dexText only 12/47 (from `species.ts`);
  abilities/eggGroups 0/47 (empty, owed).
- `moves.json` 36/36 · `learnsets.json` 47/47 rows (12 verified, 35
  provisional baselines, flagged per record) · `evolutions.json` 29 level
  evolutions · `encounters.json` — **seed only**: 3 maps, 4 tables, 13
  species · `trainers.json` — seed (8 trainers).
- The core README is the lane's standard-setter: values come from main-branch
  sources or are flagged provisional/seed; **unknowns are null/empty and
  listed as owed, never invented.** Every gap fill in this package follows
  that convention exactly.

### Mochiioteca (dex) layer
- `src/lib/generated/dexEntryMedia-20261026.json` (PR #243) — the dex media
  registry: 49 entries keyed by dex id, each with footprint path/status,
  silhouette path, cry V1/R1 paths + default, under two stated rules
  (Pokémon structure, Mochiichao media only):
  - **footprint_rule:** footprint visible for CAUGHT entries only, hidden
    for seen-only and undiscovered.
  - **cry_rule:** play-cry on the detail panel for seen/caught entries;
    default V1, R1 available.
- `src/components/views/DexView.tsx` (PR #228) — the dex view itself:
  registry portraits + discovery silhouettes + unfilled slots.

### Footprint system (PR #237, merged)
- `sprite-art/animation/expanded-scope/footprints-real/` — one footprint PNG
  per species (49) + Strikechamp's 2 form footprints.
- `FOOTPRINT-MANIFEST-51-20261026.json` — per-species footprint *spec* data:
  `status`, `foot_type` (28 distinct anatomies: paw, talon, fin contact,
  tentacle-tip spread, wisp hem, cocoon base…), `toe_count`/`toe_note`,
  `source_view`, `foot_band_rows`, `foot_native_size`, `confidence`.
  Derived from the creatures' own walk/battle cells — no anatomy invented
  (its notes say so per entry).

### Silhouette / discovery system (PR #175, merged)
- `sprite-art/animation/expanded-scope/lane100/silhouettes/` — 16×16 mode-1
  full-body discovery silhouettes, one per species + 2 forms, +
  `contact_sheet_51.png`.
- `SILHOUETTE-MANIFEST.json` + `DISCOVERY-SILHOUETTES-NOTE.md` — method:
  alpha of the locked `battle_front` cell → black, downscaled; owner-approved
  2026-10-26 under the corrected purpose (pre-discovery display, explicitly
  NOT footprints).

### Cries (PR #193, merged)
- `public/audio/cries/` — 100 files: for each of the 49 species a V1 cry and
  an R1 take; Astroleviathan and Floatcalf also carry a V2 take. Pure cries
  only (canon law: no words, no name-saying).

### Design assets per species
- `sprite-art/animation/idle/` — idle sets for 49 species + 2 Strikechamp
  forms (51 folders + timing doc).
- `sprite-art/garden-poses/` — garden pose sets (feed/play/reaction/sleep +
  `.garden.json`) for 49 species + `strikechamp_unsuited` (50 folders;
  PR #114: "50 sets, 200 poses").
- Title videos for 10 species (`src/assets/title/videos/`).
- Show side: model sheets for the pilot six
  (`show/production/model-sheets/`), character-sheet clip bundles
  (`show/production/character-sheets/`, PR #360), canon cutouts for the pilot
  six (`show/production/canon-cutouts/`), rigs + rig specs
  (`show/production/rigs/`).
- `show/shared/cast.json` — the show's two-way cast index; records
  `body_plan` for the pilot six (mochii `compact_round`, dorowani
  `bipedal_amphibian`, gabu `bulky_bruiser`, kittember `small_feline`,
  sproutle `small_plant_biped`, wispkin `ghost_float`) and game/show asset
  pointers per cast member.

### Species-creation side (already started by the lane)
- `show/production/REGIONAL-FLAVOR-LAW.md` (PR #379) — the regional flavour
  law new species are designed under.
- `show/production/NEW-SPECIES-IDEAS.md` (PR #379) — 60 brainstorm concepts
  in regional buckets + 2 owner anchors + 6 register sketches. **Not canon.**

## The lane's format (the standard this package maps to)

A complete Gen-1 species, as the lane has actually built it, is a *set of
artefacts across fixed locations*, not one file:

1. Core record — `src/data/core/species.json` (schema-checked).
2. Roster entry — `src/lib/global_roster.json` (elements, evolution reqs,
   `api_search_tags` design tags).
3. Dex entry — `dexEntryMedia-20261026.json` (footprint/silhouette/cry
   wiring under the footprint/cry rules).
4. Footprint asset + manifest spec — `footprints-real/`.
5. Silhouette asset + manifest entry — `lane100/silhouettes/`.
6. Cry WAVs (V1 + R1) — `public/audio/cries/`.
7. Design assets — idle set, garden poses, portrait/lustre; show-side model
   sheet + cutout + rig when the species enters the cast.
8. Learnset/evolution/encounter rows in the core tables (or an explicit
   owed/provisional flag, per the core README's convention).

`NEW-SPECIES-SHEET-TEMPLATE.md` in this package is exactly this set, turned
into an intake checklist.
