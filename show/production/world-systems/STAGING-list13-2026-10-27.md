# STAGING — List 13 (items 117–126)

All ten yields are text specs (Markdown + JSON fragments,
~72 KB total, measured). **Nothing is TeraBox-class; nothing
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
| `117-FIELD-TECHNIQUES.md` + `techniques-fragment.json` | `show/production/world-systems/` (beside EVENT-FLAG-ARCHITECTURE / REGION1-ROUTE-GRAPH — the #11/#12 specs it is the referent for) |
| `118-SHOP-SYSTEM.md` | game data docs beside the #31 item data layer + cross-ref from #20's economy doc |
| `119-INTERIOR-AREAS.md` | `show/production/world-systems/` (beside the #99/#30 packages) |
| `120-CUTSCENE-STAGING.md` | `show/production/` beside the audio-timing package (staging/timing neighbourhood) |
| `121-ACCESSIBILITY.md` | game data docs beside `src/data/core/` (engine-facing spec) |
| `122-NEW-GAME-PLUS.md` + `ngplus-fragment.json` | game data docs beside `src/data/core/` (with #96; lands labelled PROPOSED — NOT CANON at its head) |
| `123-MOUNT-TRAVERSAL.md` | `show/production/world-systems/` (beside SPAWN-TABLES / the #58 follower package) |
| `124-EVENT-ROTATION.md` | `show/production/world-systems/` (beside TIME-WEATHER-STATES / the #93 package) |
| `125-FAST-TRAVEL.md` + `fast-travel-fragment.json` | `show/production/world-systems/` (beside REGION1-ROUTE-GRAPH + MOCHIIOTECA-MAP-MODULE) |
| `126-HALL-OF-FAME.md` + `hall-of-fame-fragment.json` | `show/production/world-systems/` (beside the #98/#100 packages) |
| `README.md` | `show/production/list13-systems-INDEX.md` on landing, or folded into the production research INDEX |
| `STAGING.md` | stays with the package until landing; then `show/production/world-systems/STAGING-list13-2026-10-27.md` as the landing record |

## Concrete wiring steps for the landing lane

1. **Cross-reference index entries.** Add all ten items to
   the production research INDEX / parts-catalogue with
   their numbers (117–126), and add reciprocal links from
   the packages each item extends: #11/#12/#59 docs →
   #117; #20/#31 docs → #118; #99/#30/#59 docs → #119;
   #21/#12 docs → #120; #27/#23 docs → #121; #96 doc →
   #122 + #126; #58/#43 docs → #123; #19/#93 docs → #124;
   #11/#32 docs → #125; #98/#100 docs → #126. Links point
   both ways or the wiring is not done.
2. **#117 → no schema work needed to start.** #12's
   `tech.*` namespace, #11's `technique` gate kind and
   #59's `technique` lock class already exist in their
   specs; landing adds the reciprocal referent links and
   joins the fragment's one row to the machine registry's
   Illuminate entry (PR #366 layer — verify the registry's
   in-repo home first; the core `moves.json` in
   `src/data/core/` is the verified smaller set and is
   *not* the class authority).
3. **#117 edge ruling stays open.** The held-vs-performed
   disagreement case (sole knower leaves the party) lands
   as an OPEN decision recorded in the PR body — do not
   implement either branch silently.
4. **#118 → zero stock rows.** Landing creates the shop
   record shape only; every `placeId` must resolve against
   the real #11 graph / #119 records at instancing time.
   The `sellFraction` ships unset (PROPOSED default ½
   documented in the spec) until the owner rules.
5. **#120 → first instancing candidate.** The game's real
   Ink opening (`region1-truck-start.ink`, per #12's
   record) is the natural first scene to express in the
   cue format — as a *parallel record*, not a rewrite of
   the working Ink. The cue executor itself is an
   UNVERIFIED TARGET (below); until engine code exists,
   the format lands as spec + the one parallel record.
6. **#121 → nothing engine-side lands.** The action
   vocabulary and the profile/settings store are
   UNVERIFIED TARGETS; land the spec, register the mode
   tables as a measured work item (colour-vision
   simulation pass), and take no defaults.
7. **#122 → lands as a proposal.** The package header's
   PROPOSED — NOT CANON label survives landing verbatim.
   The `meta.cycle` field is *specified*, not added to any
   schema, until the owner rules the mode in.
8. **#123 → derivation is a data pass, not a doc edit.**
   Register the per-species eligibility derivation (over
   #43 classes + sheet anatomy) as a work item owned by
   the data lane; the `RIDDEN` state is a *proposal to
   #58's package* — it lands only if #58's owner accepts
   the vocabulary extension in its own file.
9. **#125 → annotation waits on verification.** Do not
   annotate any node until the route graph's in-repo
   schema is verified (UNVERIFIED TARGET below). The
   workspace graph (`world-systems/region1-route-graph.json`)
   is the design copy, not the authority.
10. **#126 → save section registration.** Register
    `hallOfFame` in #96's payload map as a future facts
    section (absent = default). No record is created; the
    write hook arms when #100's capstone is instanced in
    real encounter records.
11. **Open-slot discipline (all items).** Every OPEN below
    lands open. Where a spec flags an owner decision, the
    package lands with the slot empty — per the full-wiring
    order, an open slot never holds a package.

## UNVERIFIED TARGETS register (nothing here was invented)

| Target | Needed by | What was actually verified |
|---|---|---|
| Game engine / runtime code (cue executor, input system, settings store) | #120, #121, #122 | The audit evidence covers data + docs: `src/data/core/` (species/moves/learnsets/encounters + schemas) and `src/lib/global_roster.json`. No engine code appears in the audited sources — engine integration is spec-level throughout this package |
| The route graph's in-repo schema/home | #119, #125 | Workspace copies verified: `teardowns/world-systems/region1-route-graph.json` + REGION1-ROUTE-GRAPH.md. Repo home per the world-systems package's own STAGING — landing confirms before the `travelPoint` annotation or any host-node join is treated as wired |
| The event-flag schema's in-repo home | #117, #120, #124 | Workspace copy verified: `teardowns/world-systems/event-flag.schema.json`; the `tech.*` namespace and dialogue-pointer shapes are verified from EVENT-FLAG-ARCHITECTURE.md. Repo path to confirm at landing |
| Machine registry's in-repo home (352 moves, PR #366) | #117, #126 | Verified as the class/join authority via #101's spec and the move programme's records; the audit-verified in-repo move set is the smaller core `moves.json` (36/36). Landing confirms the registry's path before joining rows to it |
| Profile/settings store (device-level, pre-save) | #121 | Does not exist in any audited source. #121's placement is a reasoned proposal, registered here as unverified |
| Actor pace/speed vocabulary for #120 `move` cues | #120 | No engine movement constants exist in the audited sources; the cue shape ships with the vocabulary marked PROPOSED |

## Wiring summary (what each plugs into)

- **117** referent for #12 `tech.*` + #11 `technique` gates
  + #59 `technique` locks; class authority = machine
  registry via #101; performances = #9 animscripts.
- **118** stock over #31 ids; money per #20; places #11/
  #119; gating #12; rotation hooks #124; distinct from
  #101's service economy.
- **119** sub-graphs on #11 hosts; gates #59; sight-lines →
  #30 records; beats #99/#120; NPC presence #93.
- **120** cues over #21 camera records + #12 dialogue
  pointers/flags + #2 cries + #51/#13 sound; stages #11/
  #119; conservation per #82.
- **121** presentation-only: modes constrained by #27 ink
  law; text over #23; captions from #51 classes; motion
  contract read by #21 consumers; no save-payload home.
- **122** disposition over #96 sections (+ #97/#104/#106/
  #126 additions); scaling via #113 overlays under #52
  law; locks per #68; baseline #100/#87.
- **123** eligibility derived from #43 + sheet anatomy;
  states join #58 (extension proposed); areas per #7/#52;
  clock #19; separate layer from #117.
- **124** function over #19; writes #96 `world` overrides
  in #93 shapes; announces via #90; hosts #56/#78/#105;
  facts in #12 `vars.*`.
- **125** derived over #11 nodes + #32 arrival evidence;
  rendered through #32's map; clock ruling #19; no save
  section.
- **126** written at #100's capstone flag; identities #98;
  stamps cross-linked from #104; payload section per #96;
  rendering via #23.

## Open slots inventory (nothing invented)

Technique roster beyond Illuminate + held/performed edge
ruling (#117) · every shop inventory, place, name, keeper;
sell fraction ruling; currency name (inherited from #20)
(#118) · all interior layouts, floor counts, sight ranges
(#119) · all scene scripts and cue timings; pace vocabulary
(#120) · colour-mode tables, text-scale bounds, subtitle/
input defaults, action vocabulary (#121) · **whether NG+
exists at all**, dex ruling, roster ruling, locked-
individual fates, all overlay tables (#122) · per-species
eligibility results, all speeds, mounted encounter-rate
question, #58 `RIDDEN` acceptance, Dark Forest mount ruling
(#123) · the calendar itself (day kinds/week shape/seasons)
and every fixture (#124) · travel-point annotation pass,
clock ruling, fee ruling (#125) · growth-at-clear field
(pending the level ruling), display home, ceremony (#126).

## Interface-check note for landing

Three joins in this package are **interface-level** (their
sibling targets are landing in the same wave): the #58
`RIDDEN` state proposal (#123), the #96 payload-map
registrations for `hallOfFame` (#126) and the NG+ `cycle`
field (#122 — specified only, not registered), and #32's
arrival-evidence derivation that #125 consumes. One link
check after all packages land is worth doing: confirm each
of these exists exactly once, in exactly one home, and
that #117's fragment row resolves against the registry's
real Illuminate entry. One clarification this package
registers for that check (not a contradiction): #12's
`tech.*` booleans record *acquisition*; #117's live party
check governs *performance* — the two readings are
compatible, and the sole-knower-leaves edge between them
is the OPEN ruling in step 3 above, not a defect in either
package.
