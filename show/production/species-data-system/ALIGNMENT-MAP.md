# Alignment map — draft schema ↔ the lane's existing format

The schema drafted for this sideline (Mochiioteca species record: identity,
bio, body, footprint, silhouette, discovery, voice, gameplay, show,
provenance) was written before the audit. The audit found the lane's format
already covers most of it — **scattered across the fixed locations listed in
AUDIT-WHAT-EXISTS.md**. This map aligns the two field by field. The lane's
format wins wherever both exist; the draft schema adds value only as (a) a
checklist of what "complete" means and (b) names for the genuinely absent
fields, which are registered as TBD rather than filled.

| Draft-schema field | Lane equivalent (location) | Status |
|---|---|---|
| mochiioteca_number | dex registry id (`dexEntryMedia-20261026.json` keys) | EXISTS — but see Conflict 2: dex ids ≠ core ids for Mythar (331 vs 047); Dorowani/Gabu exist only here (147/148) |
| id / slug | core `species.json:id` + asset folder slug | EXISTS (47); missing for Dorowani/Gabu → gap fill |
| name | core `species.json:name` | EXISTS (47); Doro/Gabu names canon via dex/show layers |
| category / genus label | — | ABSENT everywhere → TBD register |
| typing / affinities | core `types` = roster `elements` | EXISTS (47); Doro/Gabu signature-derived in gap fill, owner to confirm |
| bio_short | core `dexText` | EXISTS 12/47; missing 35 + Doro/Gabu → TBD |
| bio_long | — | ABSENT for all 49 → TBD register (owner/lane writing task) |
| temperament / behaviour | — (garden `.garden.json` pose sets imply behaviour visually; nothing written) | ABSENT as data → TBD |
| diet | — | ABSENT → TBD |
| social pattern | — | ABSENT → TBD |
| height / weight | — | ABSENT for all 49 → TBD (owner decision per species) |
| body_plan | `show/shared/cast.json:body_plan` | EXISTS for pilot 6 only; derived working values in gap fills for the rest (marked derived, not canon) |
| colour palette refs | garden-poses sets + `src/lib/creaturePaletteSheets.ts` system | PARTIAL — assets exist per species; no per-species palette *record* in the data core |
| distinguishing anatomy | roster `api_search_tags` + footprint manifest `foot_type`/`toe_note` | EXISTS as tags/anatomy notes (47 + footprint anatomy for 49); not a structured field |
| footprint_spec | `FOOTPRINT-MANIFEST-51-20261026.json` entry (foot_type, toe note, source view, native size, confidence) | EXISTS 49/49 — this *is* the spec; the PNG is rendered from the species' own cells per the manifest method |
| footprint asset | `footprints-real/<slug>_footprint.png` | EXISTS 49/49 (+2 forms) |
| silhouette_spec | `DISCOVERY-SILHOUETTES-NOTE.md` method (locked battle_front alpha → black, 16×16) | EXISTS — derivation is a documented pipeline, not per-species data |
| silhouette states (unseen/seen/caught) | DexView (PR #228) + dex registry rules (footprint caught-only; cry seen/caught) | EXISTS as *code + rules*, not per-species data fields — correct design: states are presentation logic over one registry entry |
| discovery: habitat/region | core `encounters.json` | SEED ONLY — 13 species across 3 maps; full region tables owed |
| discovery: rarity | core `catchRate` | EXISTS 12/47; else TBD |
| discovery: encounter method / time / season | `encounters.json` (method; timeOfDay/weather fields exist, null in seed) | PARTIAL — shape exists, contents seed |
| discovery: first-appearance episode hook | show episode docs (EP01–EP05 scripts/beat sheets name their species) | EXISTS informally in episode docs for cast species; no per-species field → candidate field for the intake template |
| voice: cry asset ref | dex registry `cry_v1`/`cry_r1`/`cry_default` + `public/audio/cries/` | EXISTS 49/49 |
| voice: cry description (written) | — (manifests carry file status only) | ABSENT as written data → TBD (low priority; audio exists) |
| gameplay: base stats | core `baseStats` | EXISTS 47/47 (Pebblefist HP null — Conflict 4) |
| gameplay: abilities / hidden / egg groups | core fields | FIELDS EXIST, VALUES 0/47 (owed) |
| gameplay: growth / catch / exp | core fields | EXISTS 12/47 |
| gameplay: evolution links | `evolutions.json` (29) + roster `evolution_reqs` | EXISTS for the 47; Doro/Gabu have no evolution data anywhere |
| gameplay: learnsets | `learnsets.json` | EXISTS 47/47 rows (35 provisional, flagged) |
| show: animation notes (locomotion, signature motion) | rig specs, POSING-SYSTEM.md, CANON-SIGNATURE-ATTACKS.md, per-species rig notes | EXISTS for cast/pilot species as prose docs; no per-species structured field |
| show: spotlight/episode usage | episode beat sheets/scripts + `show/shared/clip-index.json` | EXISTS for episode species; not a species-record field |
| provenance / status per field | core `provenance` + `notes` per record; manifests carry confidence/status | EXISTS as the lane's convention (record-level, not field-level) — gap fills follow it |

**Net:** of the draft schema's blocks, identity/bio-short/footprint/
silhouette/discovery-media/voice-assets/gameplay are lane-covered; the true
schema-level absences are the *written natural-history block* (bio_long,
temperament, diet, social, category) and the *measured body block* (height,
weight) — both registered TBD, both owner/lane writing-and-decision work,
not data that can be harvested from the repo.
