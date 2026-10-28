# STAGING — List 12 (items 107–116)

All ten yields are text specs (Markdown + JSON fragments,
~76 KB total). **Nothing is TeraBox-class; nothing was
downloaded or staged locally** (workspace staging rule — these
land in GitHub with the other teardown packages).

**Real-code discipline (binding law, Jamar 2026-10-27).**
Every wiring step below either (a) names a target **verified**
from the repo audit (`species-data-system/
AUDIT-WHAT-EXISTS.md`, read-only against `main`, 2026-10-27)
or from a file read in this workspace during this build, or
(b) is entered in the **UNVERIFIED TARGETS register** at the
bottom. Nothing in this package claims an integration that
was not checked. Evidence class is stated per step.

## Proposed repo paths (game repo, show-inside-repo layout)

| File | Proposed home |
|---|---|
| `107-ABILITY-SYSTEM.md` + `ability-registry-fragment.json` | game data docs beside `src/data/core/`; the registry itself is proposed as a core data file beside `species.json` |
| `108-PERSONALITY-SYSTEM.md` + `personality-fragment.json` | game data docs beside `src/data/core/` (individual-record family) |
| `109-VERSUS-LOBBY.md` + `versus-ruleset-fragment.json` | game data docs beside `src/data/core/` |
| `110-SANCTUARY-ZONE.md` | `show/production/world-systems/` (referent for the #7 schema patch) |
| `111-ANGLING-SYSTEM.md` | `show/production/world-systems/` |
| `112-ENCOUNTER-MODIFIERS.md` + `encounter-modifier-fragment.json` | `show/production/world-systems/` (records themselves live in the #31 registry) |
| `113-SWARM-EVENTS.md` + `swarm-overlay-fragment.json` | `show/production/world-systems/`; overlay registry proposed beside #7's spawn-table instances |
| `114-ROAMING-ENCOUNTERS.md` | `show/production/world-systems/` |
| `115-EXCAVATION-SYSTEM.md` | `show/production/world-systems/` — lands carrying its PROPOSAL — NOT CANON banner; deletable as one file |
| `116-RANGER-WARDROBE.md` + `wardrobe-fragment.json` | `show/production/model-sheets/` beside #33's standard; wardrobe indexes land with each human's sheet in `model-sheets/humans/` |

## Wiring steps — verified targets

- **107 species side — VERIFIED (audit).** `src/data/core/
  species.json` records already carry `abilities` /
  `hiddenAbility`, governed by `src/data/core/schemas/
  species.schema.json`; audit coverage: 0/47 populated. Step:
  land the ability registry as the referent those ids resolve
  against. **No species schema edit.**
- **107 battle/field hooks — VERIFIED (workspace files).**
  #17 `list3-systems/TYPE-SYSTEM.md` (staged pipeline), #27
  `list4-systems/STATUS-SYSTEM.md`, #19 `list3-systems/
  TIME-WEATHER-STATES.md` + `world-state-fragment.json`, #7
  spawn roll via #112 ops.
- **108 seed join — VERIFIED (workspace file).**
  `list9-systems/80-INDIVIDUAL-VARIATION.md` defines
  `personality_seed`, `variance`, `temperament_read`
  (`mochiichao/individual/v1`). Step: register the temperament
  block as a derived view of that record — no new roll, no
  schema fork. #39/#28 joins: `list5-systems/
  39-TRAINING-SYSTEM.md` (care families, `familyMap` OPEN),
  `list4-systems/GARDEN-RAISING-SYSTEM.md` (care axes).
- **109 validator data — VERIFIED (audit).** species.json +
  schema, `src/data/core/learnsets.json` (47/47 rows),
  `src/data/core/moves.json`, PR #366 machine registry,
  `src/lib/global_roster.json`. Steps are data-layer only.
- **110/111 schema patches — VERIFIED (workspace file).**
  `world-systems/spawn-table.schema.json` read in full for
  this build: area shape (`encounterMode` patch, #110) and
  slot shape (`rodTier` beside `timeOfDay`/`weather`, #111)
  are additive optional fields in the schema's own idiom.
  Landing applies both patches to that file; this package
  edited nothing in world-systems.
- **112 item records — VERIFIED (workspace files).**
  `list4-systems/ITEM-DATA-LAYER.md` + `list4-systems/
  schemas/item.schema.json`: `effect.system: "field"` exists
  in the closed vocabulary; additional-properties ban gives
  the no-move-class guarantee mechanically.
- **113 clock + media — VERIFIED (workspace files).** #19
  `world-state-fragment.json` (phase ids), #90
  `list10-systems/90-IRIDESCENCE-MEDIA.md` (`spawn_report`
  generator, state-input rule, naming discipline).
- **114 graph + grammar — VERIFIED (workspace files).**
  `world-systems/REGION1-ROUTE-GRAPH.md` +
  `region1-route-graph.json` (gate kinds), #41
  `list5-systems/41-MYTHICAL-PRESENTATION.md` (five beats,
  null catchRate legality), #38 capture (scripted/special
  record family).
- **115 remnant writes — VERIFIED (workspace file).** #44
  `list5-systems/44-EXTINCT-REVIVAL.md` remnant record shape
  (`{remnantId, pointsTo, originArea, status}`) — #115
  populates `originArea` only.
- **116 sheet annex — VERIFIED (workspace file).** #33
  `list4-systems/HUMAN-MODEL-SHEET-STANDARD.md` §6/§7;
  `show/shared/cast.json` exists per audit (candidate field
  proposed, not edited).

## UNVERIFIED TARGETS register (gaps — flagged, not filled)

1. **#109 engine surface.** No battle engine, link/
   networking code, or lobby UI appears in any audited
   source. The ruleset + validator land as data-layer specs;
   engine integration waits until the lane identifies or
   builds the real surface. **Do not mark #109 "wired" beyond
   the data layer until then.**
2. **#116 Falk wardrobe sheets.** Owner-confirmed in the side
   lane (2026-10-27) but no Falk file exists in
   `~/workspace/mochichao-design/` or the teardown packages
   (searched this build). Falk's fragment rows stay
   REPORTED/UNVERIFIED until the design lane files the set.
3. **#107 `abilitySlot` field.** A proposed addition to #80's
   individual record — landing registers it with the
   individual-record owner; this package did not edit #80.
4. **#41 `presentationClass` field** (consumed by #109's
   `mythical-class` clause). Itself a proposal awaiting the
   sheet-standard lane; the clause is unenforceable until it
   lands, and the fragment says so.
5. **#114/#115 area↔node id alignment.** Spot evidence is
   positive (#11's Garden subnodes deliberately share ids
   with #7's spawn bundle), but a complete alignment audit of
   spawn `areaId`s vs graph node ids is a landing check, not
   asserted here.
6. **List 11 cross-references (#103 materials, #106
   location field).** List 11 was building in parallel; at
   this build its README + #97/#98 were present. Cross-refs
   are keyed to its README's stated yields — landing
   reconciles against List 11's final STAGING.md.

## Discrepancy register (found this build, pre-existing)

- **Phase vocabulary mismatch:** #19's `world-state/v1`
  fragment names phases `dawn | day | dusk | night`; #7's
  `spawn-table.schema.json` `timeOfDay` enum uses
  `morning | day | dusk | night`. #113/#114 key to the
  world-state ids and flag the enum wherever touched.
  Landing reconciles in ONE place (either the schema enum or
  the state ids) — this package picked neither silently.

## Owner-decision slots (landed OPEN, nothing invented)

Repel floor semantics — Shape A (party-relative) vs Shape B
(item-fixed) against #52's law (#112) · hidden-ability unlock
rule (#107) · #18 AI ability knowledge, full vs partial
(#107) · temperament growth-modifier value + all 25 display
names + preference→#39 accrual interface (#108) · versus
level value, every ruleset and tier (#109) · first sanctuary
designation + flee rates (#110) · rod tier count/names + the
rod's #31 category (#111) · roll composition order, #112
modifiers vs #113 overlays (#112/#113) · swarm schedule home
and all overlay contents (#113) · any roaming individual
(#114) · excavation entire — PROPOSAL — NOT CANON (#115) ·
all non-Falk wardrobes (#116).

## Validation

All six JSON fragments in this package parse as strict JSON
(`python3 -m json.tool`, run at build time). Schemas named in
the specs are specified as shapes/fragments in the prior
waves' prose-first convention; JSON-schema files get cut at
landing if the lane wants them machine-checked.
