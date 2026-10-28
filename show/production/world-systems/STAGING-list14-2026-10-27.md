# STAGING — List 14 (items 127–136)

All ten yields are text specs (Markdown + JSON fragments,
~82 KB total, measured). **Nothing is TeraBox-class; nothing
was downloaded or staged locally** (workspace staging rule —
local disk is the workbench; these land in GitHub with the
other teardown packages, through the side lane's PR flow).

**Real-code wiring law applies to every step below**
(standing, 2026-10-27): before wiring, the landing lane
audits the actual repo for what exists — real files, real
schemas, real paths — and wires into THAT. The paths and
joins named here are the *proposed* homes and the
*intended* connections, written from verified workspace
evidence (the earlier teardown packages, `species-data-
system/AUDIT-WHAT-EXISTS.md`, and `~/workspace/mochichao-
design/`). Where a target could not be verified from those
sources, it is registered below as an **UNVERIFIED TARGET**
— the honest landing for those steps is the spec plus the
gap flagged in the PR body, never invented glue presented
as wired. Every landing PR report names the real files it
touched and what changed in them.

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.

## Proposed repo paths (game repo, show-inside-repo layout)

| File | Proposed home |
|---|---|
| `127-REGION-TRANSITION.md` + `region-transition-fragment.json` | `show/production/world-systems/` (beside REGION1-ROUTE-GRAPH — the #11 spec whose edge shape connections extend; connection records ultimately live in the game data's route-graph layer) |
| `128-BATTLE-PLATES.md` | `show/production/` beside the battle-presentation package (plate entries themselves land in `parts-catalog.json`, SHOW-HOME's shared manifest) |
| `129-LEVEL-UP-LEARNING.md` | game data docs beside the moves registry / learnsets (with #101) |
| `130-FORME-CHANGE.md` + `forme-change-fragment.json` | `show/production/species-data/` (beside #40's regional-variant package — the sibling axis) |
| `131-SIGNATURE-MOVES.md` + `signature-register-fragment.json` | game data docs beside the moves registry; cross-ref from `show/production/` (two-lane designation) |
| `132-CARE-CENTRES.md` | `show/production/world-systems/` (service-place cluster, beside #118 shops) |
| `133-LICENCE-TRIALS.md` + `licence-trials-fragment.json` | `show/production/world-systems/` (beside the #98 licence package it completes) |
| `134-FIELD-CAMP.md` | `show/production/world-systems/` (beside the #28/#65 Garden packages, across the boundary it defines) |
| `135-HATCH-PRESENTATION.md` + `hatch-fragment.json` | `show/production/species-data/` (beside #77's egg package, whose owed field it defines) |
| `136-CRY-COMPREHENSION.md` | `show/production/` show-lane neighbourhood (beside the #82 arc-planning package) |
| `README.md` | `show/production/list14-systems-INDEX.md` on landing, or folded into the production research INDEX |
| `STAGING.md` | stays with the package until landing; then `show/production/world-systems/STAGING-list14-2026-10-27.md` as the landing record |

## Concrete wiring steps for the landing lane

1. **Cross-reference index entries.** Add all ten items to
   the production research INDEX / parts-catalogue with
   their numbers (127–136), and add reciprocal links from
   the packages each item extends: #122's file → #127 (its
   ruling already points here; confirm the link lands);
   #11/#96/#98 docs → #127; #61/#73 docs → #128; #101 doc
   → #129 + #131; #40/#42 docs → #130; #27/#28 docs →
   #132; #98 doc → #133; #28/#39 docs → #134; #77 doc →
   #135; #82/#89 docs → #136. Links point both ways or the
   wiring is not done.
2. **#127 → game data first (owner refinement).** The
   discovery model wires primarily into the GAME DATA:
   connection records are data in the route-graph layer,
   not prose. Landing order: (a) verify the route graph's
   in-repo home (carried UNVERIFIED from List 13's
   register — the workspace copy is the design copy, not
   the authority); (b) instance the connection record
   *shape* in that layer with zero connections (no region
   pair has verified node sets on both sides yet); (c) the
   discovery derivation reuses #125/#32 arrival evidence —
   confirm that derivation exists in the landed code/data
   before claiming discovery is wired; (d) #122's file
   lands carrying its ruling + refinement and its CLOSED
   status — do not land any `meta.cycle` field from its
   fragment.
3. **#127 discovery kinds are per-connection content.**
   No connection ships with kinds pre-assigned by this
   package. When a border is authored, its kinds are the
   region build's decision, recorded on the record.
4. **#128 → catalogue entries, not a new registry.** Plate
   entries land inside `parts-catalog.json` under its
   existing version-marking discipline (one CURRENT per
   plate per use). Verify the catalogue's in-repo home
   and current entry shape before adding the plate role
   fields; if the catalogue has no version-chain shape
   yet, that gap is flagged in the PR body, not bridged
   with a private format.
5. **#129 → no data migration.** The flow reads existing
   learnsets/registry; its one audit question — the
   evolution-boundary offer priority — is answered from
   the real learnset data at landing and recorded either
   as found-in-data or as an OPEN slot in the PR body.
6. **#130 → family field lands empty-but-shaped.** The
   `formFamily` block is added to the species-record
   neighbourhood as a shape with exactly one family
   (Strikechamp, forms verified in the audit) and zero
   battle facts; any `persistAfterBattle` roster field
   waits for a per-family ruling (absent = default under
   #96 if it ever lands).
7. **#131 → land the register with its conflict ON it.**
   The four id-carrying rows join the registry normally.
   The Dorowani/Gabu rows land with `moveId: null` and
   the tension note attached — resolving the AQUA_SHOT /
   EARTH_TREMOR representation is an owner/landing
   reconciliation (see the contradiction register below),
   never a silent join.
8. **#132/#134 → the non-joins are the wiring.** Landing
   verifies by inspection that neither system's records
   write to #28's care profile, #104 honours, #14 dex, or
   #12 story flags; camp's care-fact writes (present
   individuals, #39/#28 families) are the single intended
   exception and ship behind #134's accrual-rate slot
   staying OPEN.
9. **#133 → tier table lands EMPTY.** Do not populate
   rank names/thresholds from any source but an owner
   ruling. The region-gating proposal lands as proposal
   text attached to #127's `progression` kind only.
10. **#135 → close #77's owed-field loop.** On landing,
    #77's spec gains its reciprocal pointer to #135 as
    `hatchPresentation`'s content definition; the field
    itself stays per-species OPEN data via sheet intake.
11. **#136 → show-lane landing only.** This spec lands in
    the show production neighbourhood and touches NO game
    data, schema, or save shape. Any landing diff that
    adds a comprehension field to game data is a defect
    against this package, to be reverted in review.
12. **Open-slot discipline (all items).** Every OPEN below
    lands open. Where a spec flags an owner decision, the
    package lands with the slot empty — per the full-wiring
    order, an open slot never holds a package.

## UNVERIFIED TARGETS register (nothing here was invented)

| Target | Needed by | What was actually verified |
|---|---|---|
| Game engine / runtime code (battle loop, learnset prompt UI, forme-shift executor, camp state) | #128, #129, #130, #134 | The audit evidence covers data + docs (`src/data/core/`, `src/lib/global_roster.json`) and the teardown packages' specs. No engine code appears in the audited sources — engine integration is spec-level throughout this package |
| The route graph's in-repo schema/home | #127 | Workspace copy verified: `teardowns/world-systems/region1-route-graph.json` + REGION1-ROUTE-GRAPH.md (Region 1 nodes/edges, gate kinds `story_flag`/`technique`). Repo home per the world-systems package's own STAGING — landing confirms before any connection record is treated as wired. Carried from List 13's register |
| Region 2–5 node sets / graphs | #127 | Canon fixes that five regions exist (season canon map); no verified node-level data for any region past Region 1 exists in the workspace sources. Zero connections instanced for this reason |
| `parts-catalog.json` in-repo home + entry shape | #128 | Verified as the show's shared manifest concept in `mochiichao-show/SHOW-HOME.md` (parts-catalogue holds backgrounds/props with versions per the current-version law). Its exact in-repo path and whether its entries already carry a version-chain shape are landing verifications |
| The machine registry's in-repo home (352 moves, PR #366) | #129, #131 | Verified as the class/join authority via #101's spec and the move programme's records; the audit-verified in-repo move set is the smaller core `moves.json` (36/36). Landing confirms the registry's path before joining rows — carried from List 13's register |
| Move-set capacity constant | #129 | The flow's space check reads capacity from the move-data layer; no capacity value was found asserted in the audited sources, so none is asserted here |
| Strikechamp's forms' battle data (criteria, deltas, types) | #130 | Forms' EXISTENCE verified (AUDIT-WHAT-EXISTS; GAP-AUDIT: `unsuited` / `unsuited_full` are forms, own footprints). No battle facts for them exist in the audited sources — all OPEN in the spec |

## Wiring summary (what each plugs into)

- **127** connection records over #11's edge shape;
  discovery derived from #125/#32 arrival evidence +
  #12 standing facts; continuity over #96/#14/#97;
  capstone facts #100/#126; licence view #98; band law
  #52; individual continuity #68/#80/#104/#106; show
  downstream of game geography (#82).
- **128** entries in `parts-catalog.json`; selection
  derived from #7 area/surface + #19 state; living layer
  #61/#73; consumed by #10's presentation; cited by #53.
- **129** reads learnsets + registry (via #101's join);
  writes individual records (#80/#106); renders #23;
  relearn pool derived for #101.
- **130** family on the species record; criteria read
  #27/#31; performances #9; staging #42; composition
  #40/#15; dex derivation #14.
- **131** designation on the species move block; registry
  joins by id where verified; learning #129/#101;
  presentation #9/#82; display #23.
- **132** places #11/#119; keepers #93; services read
  #27/#19/#20; non-joins to #28/#104/#14/#12 by design.
- **133** pass facts #12; standings #98/#45/#100;
  challenges #30/#37; proposal-only join to #127.
- **134** clock #19; items #31; care writes #39/#28
  families (present individuals only); presence #58;
  ingredients from #79; boundary vs #132.
- **135** fulfils #77's owed fields; creates #80 records;
  roster/storage #106/#38; derivations #14/#97; cries
  #2; staging #42; housing #65/#28.
- **136** show only: arc gates #82; sibling literacy #89;
  signal #2; learning ethic #101. No game joins, by law.

## Open slots inventory (nothing invented)

Per-connection discoveryKinds + every connection record,
passage fiction, first-arrival beats, Region 2–5 bands /
circuits / dex sections (#127) · all plate artwork,
version chains, which areas hold plates (#128) ·
move-set capacity, evolution-boundary priority ruling
(#129) · Strikechamp criteria / direction / deltas /
persistence + any further form families (#130) · wider
roster signatures; the Dorowani/Gabu registry
representation; Water Orb + Tremor stats (owner-TBD)
(#131) · every centre's place, keeper, service list;
cost ruling; staffing fiction (#132) · the whole tier
table (names + thresholds), every trial's challenge,
eligibility thresholds, region-gating proposal ruling
(#133) · pitch-site legality, rest recovery shape, care
accrual rate, recipes/ingredients (#134) · per-species
`hatchPresentation` values, egg staging classes, naming
offer + rules (#135) · readers' scopes/stages per season,
every staged read (#136).

## Contradiction / tension register

1. **#131 — Water Orb / Tremor vs the registry rename
   pass (flagged, unresolved).** The research mapping
   (CANON-SIGNATURE-ATTACKS.md, on file evidence) states
   Water Orb has NO moves.json entry and is NOT
   AQUA_SHOT, and that game data assigned Gabu no canon
   attack; the move programme's later rename records
   touch AQUA_SHOT's display and name EARTH_TREMOR as
   Tremor's underlying id. Both cannot be silently true
   of the registry at once. This package lands both
   signatures as owner canon with `moveId: null` and the
   conflict written on the register; reconciliation is
   an owner/landing act. No other package is contradicted
   — #131's other four rows verify cleanly against the
   learnsets.
2. **Clarification (not a contradiction): #133 vs #127.**
   Read together after #127's refinement, #133's
   region-gating proposal survives only in its narrowed
   form (tier condition on the `progression` discovery
   kind). #133's spec and fragment were amended in this
   build to state exactly that, so the two files cannot
   drift apart on landing.
3. **Interface-level joins for the post-landing link
   check:** #77's reciprocal pointer to #135 (step 10);
   #98's reciprocal pointer to #133 (its tier slot's
   system); #101's relearn-pool consumption of #129's
   derivation; and confirmation that #130's `formFamily`
   exists in exactly one home (the species record) with
   #40's delta records never citing it as a variant axis.
