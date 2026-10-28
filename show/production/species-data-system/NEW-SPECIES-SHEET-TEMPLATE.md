# New-species sheet template — data first, design second

For every NEW Mochi species, from concept to complete sheet. Aligned to the
lane's existing format (AUDIT-WHAT-EXISTS.md §"The lane's format") — a
complete species is a set of artefacts at fixed locations, and **the data
record is completed and owner-locked before any design is built from it**
(the data-before-designs charter). Machine companion:
`new-species-record-template.json` — one file per species at intake.

Source pools for new species, in the lane's current order: the 60 brainstorm
concepts in `show/production/NEW-SPECIES-IDEAS.md` (written under
`REGIONAL-FLAVOR-LAW.md`), the 2 owner anchors, the 6 register sketches —
**none of which are canon until the owner locks a concept at Gate 0.**

## The workflow (gates, in order)

### Gate 0 — Lock + number (owner)
- Owner picks the concept (or directs a new one) and locks its **name**.
- **Numbering:** blocked on TBD D1 — two schemes are live (core 001–047;
  dex 001–046 + 147/148 + 331). Until the owner rules the canonical scheme,
  intake records carry `gate0_numbering` as PENDING and no id is
  self-assigned. Once ruled: ids are issued sequentially from the canonical
  registry, never reused, never re-sequenced (the Mythar 331→047 repair is
  the cautionary example).
- Region assignment per REGIONAL-FLAVOR-LAW; element(s) chosen from the
  canon element vocabulary (TBD D6).

### Sheet part 1 — Core record (data, before design)
Fill `core_record` in the template, in `species.json` shape:
- name, types, baseStats (owner-locked numbers; a stat may sit null with an
  `hpStatus: pending-decision` note — never guessed, Pebblefist precedent),
  catchRate / expYield / growthRate, abilities / hiddenAbility / eggGroups
  (empty + TBD-register entry if not yet designed), dexText (bio_short, in
  the voice of the 12 locked entries).
- `provenance` names the source of every value (intake sheet, owner
  decision, drafting credit).
- `name_record` (#55 NAME-LOCALIZATION): the name is a record — stable id (never
  localized, never renamed), display_name (source of truth), etymology (TBD on
  existing sheets), pun_joint, syllables/stress, register, sound_notes,
  line_thread, collision screens, per-locale slots (ALL OPEN until a locale is
  commissioned).
- `growth_curve` (#52 §2.3): `growth_curve: <id | TBD>`, id in {swift, steady,
  deep} (native names, OPEN set).
- Gameplay rows: learnset (verified at intake or flagged provisional like
  the existing 35), evolution row if the species is part of a line.

### Sheet part 2 — Natural history + body (data, before design)
- `natural_history_block`: bio_long, category, temperament, diet, social
  pattern. (No lane home exists for this block yet — TBD W2/W3. Fill it at
  intake anyway; the data must exist before the design brief is written
  from it.)
- `body_block`: body_plan (cast.json vocabulary), distinguishing anatomy —
  **written so the silhouette survives at 16px** (the silhouette pipeline
  downscales the finished design; anatomy that vanishes at 16px is a design
  flaw caught here, on paper, for free). Height/weight: owner/lane set at
  this gate (TBD D5) or explicitly deferred into the TBD register.
- `voice_block`: cry description in words. **Canon law: pure cries and
  sounds only — no words, no name-saying.**
- `discovery_block`: habitats/methods/levels for `encounters.json`;
  first-appearance episode hook for the show.
- `show_block`: locomotion + signature motion (+ signature move only from
  game canon mapping, per-species, never a shared template) +
  `plush_sheet` (the plush/merch pattern sheet emitted per PLUSH-SPEC,
  `show/production/list3-systems/PLUSH-SPEC.md` — a design-gate output).

### Gate 1 — Data review (lane)
- Mochiioteca entry text drafted from this sheet passes the #48 entry gate
  (MOCHIIOTECA-ENTRY-STYLE §4) before it ships.
- Record validates against `species.schema.json` shape; every null/empty
  field is either a deliberate design choice or a TBD-register line.
- Cross-checks: name not colliding with any existing species/concept;
  element pair legal; evolution line consistent both directions.
- **No design work starts before Gate 1 passes.** This is the whole point
  of data-first: the design lane designs *from* this sheet.

### Sheet part 3 — Design (from the locked data)
- Design built from the sheet: body plan, anatomy, palette, region flavour.
  Rendered in the **one Mochi art style** — the repo's canon species art is
  the style of record; design *influence* may lean Pokémon/Digimon/Monster
  Rancher per generation direction, the render style never varies.
- Likeness/style gate against canon art per the lane's existing gate
  practice; owner promotes.

### Sheet part 4 — Derived media (pipelines, not hand-work)
All three are *derived from the finished design* by documented pipelines —
they are outputs, not design tasks:
- **Silhouette:** locked battle_front alpha → black, 16×16 (PR #175
  method) → `lane100/silhouettes/` + manifest entry.
- **Footprint:** traced from the design's own feet/contact cells →
  `footprints-real/` + FOOTPRINT-MANIFEST entry (foot_type, toe note,
  source view, confidence — honest about what isn't resolvable).
- **Cry:** V1 + R1 WAVs → `public/audio/cries/`.
- **Plush sheet:** pattern derived from the finished design per PLUSH-SPEC (`mochiichao/plush/v1`) — passes on the 32px + one-colour plush-read proofs.

### Gate 2 — Wiring + registration
- Core record merged into `species.json`; roster entry into
  `global_roster.json` (elements, evolution reqs, `api_search_tags` design
  tags — required: the dex/design layers read them).
- Dex entry added to the dex registry (footprint/silhouette/cry refs under
  the footprint_rule + cry_rule).
- Idle set + garden poses produced; show-side model sheet/cutout/rig if the
  species joins the cast; `cast.json` entry if principal.
- Run the repo's own data validation (`tools/validate_data_core.py`) and
  this package's audit pattern: the species must show ●/◐-explained on
  every matrix element before it counts as complete.

## Scaling path — 49 → thousands without quality collapse

The Gen-1 audit shows exactly where the strain appears first, and the
intake above is built to relieve it:

1. **Numbering is the first wall.** Fix D1 now, at 49 species, while the
   repair is 3 entries — at 1,000 species a split registry is unfixable.
   Rule going forward: one canonical registry issues ids; every other file
   references, never re-numbers.
2. **Records are generated, not hand-kept.** Intake starts from
   `new-species-record-template.json`; a species folder/record is the
   single source the game JSON, dex entry and show brief are all exported
   from (the Gen-1 pain — the same species kept in species.json, roster,
   dex registry, two manifests and cast.json, drifting apart — is what
   generation prevents). Drift checks (like `validate_gap_audit.py`:
   claims vs live files) run per batch, not per memory.
3. **Batch by region/generation, gate per batch.** Concepts arrive in
   regional buckets under the Flavor Law (the brainstorm's A/B/C/D buckets
   are the model: ~10–40 per batch). Gate 0/1/2 run per batch; a batch
   ships only when every species in it clears Gate 2, so partial species
   never accumulate silently — Gen 1's debt (35 missing bios, 0 long bios,
   seed encounters) is precisely what un-gated accumulation produced.
4. **Derived media scales free; written data is the bottleneck.** 
   Silhouettes, footprints and (increasingly) cries are pipelines. Bios,
   natural history, stats and learnsets are human/owner-paced: schedule
   them at Gate 0 (a batch's writing load is known before design starts),
   and let the TBD register — not memory — carry what's owed.
5. **Provisional is a first-class state.** The core already models it
   (provisional learnsets, pending-decision HP, seed encounters). Keep it:
   at scale, a flagged provisional beats a silent invention every time,
   and the register makes the debt visible per generation.
6. **Forms are not species.** Strikechamp's unsuited variants carry their
   own derived media but no new number. Hold that line or the count
   inflates and the registry rots (the "51 species" confusion in Gen 1
   came from exactly this).
