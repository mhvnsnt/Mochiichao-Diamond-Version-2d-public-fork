# LIST 12 TEARDOWNS (items 107–116) — package index

Auto-dispatched under Jamar's AUTO-WIRE RULE (the list IS the
order, 2026-10-27). Same standard as Lists 1–11: public
documentation / open sources → **native** Mochiichao
specs/formats, staged repo-ready **and wired** to the systems
already built. No copied game assets, data tables, or text.
Canon is never invented — every spec names its open slots, and
owner decisions land OPEN.

**Built under the REAL-CODE WIRING LAW (Jamar, 2026-10-27):**
every wiring claim below was checked against the actual
evidence — the repo audit in `species-data-system/
AUDIT-WHAT-EXISTS.md` (read-only, against `main`), the earlier
teardown packages' real schemas, and this workspace's files.
Where a target could not be verified from those sources, the
spec says so in-line and STAGING.md registers it as an
**UNVERIFIED TARGET** — a gap flagged, never a path invented.

| # | File | Yield in one line |
|---|---|---|
| 107 | `107-ABILITY-SYSTEM.md` + `ability-registry-fragment.json` | The referent for the species record's existing-but-empty `abilities`/`hiddenAbility` fields: a registry of trigger-classed traits, split battle vs field, keyed to stable ids. **Zero abilities, zero assignments asserted** — canon's field is 0/47 and stays that way until the owner/lane fills it |
| 108 | `108-PERSONALITY-SYSTEM.md` + `personality-fragment.json` | Temperament as the mechanical layer under #80's *same* `personality_seed` (no second roll): an (up, down) stat-pair grid + care-preference pair joining #28 axes and #39 care-typed effort. Modifier magnitude and all temperament names OPEN |
| 109 | `109-VERSUS-LOBBY.md` + `versus-ruleset-fragment.json` | Versus rulesets as data + a team validator specified against the *real* schemas (species, learnsets, machine registry PR #366, individual record #80, storage location #106). Engine integration is an UNVERIFIED TARGET — no battle/link code was found in the audited sources |
| 110 | `110-SANCTUARY-ZONE.md` | Capture-only area grammar: an `encounterMode` area flag over the #7 spawn schema — same tables, battle never initialises, resolution goes straight to #38 capture. Zero areas designated; the Garden is **not** reclassified |
| 111 | `111-ANGLING-SYSTEM.md` | Angling as a refinement of the canon `fish` method (the pond seed rows already exist), not a new method: an optional `rodTier` slot discriminator proposed beside `timeOfDay`/`weather`, a bite-cue chain on #51 SFX classes. Rod tiers and the rod's item category OPEN |
| 112 | `112-ENCOUNTER-MODIFIERS.md` + `encounter-modifier-fragment.json` | Repel/lure-class items expressed entirely through the #31 item layer (`effect.system: field`, spawn ops) as roll-time transforms — tables on disk never change; #31's no-move-class schema check applies unchanged. The repel-vs-#52 interface tension is flagged, not resolved |
| 113 | `113-SWARM-EVENTS.md` + `swarm-overlay-fragment.json` | Swarm/outbreak overlays on the #19 world clock: weighted overrides applied at roll time over #7 tables, announced through #90's `spawn_report` generator. The Dark Forest depths can never take an overlay. Zero instances |
| 114 | `114-ROAMING-ENCOUNTERS.md` | Roaming individuals as records that walk the #11 route graph one edge per phase tick, persist state between meetings, and are staged under #41's five-beat grammar. Zero roamers asserted; roaming is a movement pattern, not a rarity class |
| 115 | `115-EXCAVATION-SYSTEM.md` | Dig sites and remnant sourcing feeding #44 — **the whole file carries #44's PROPOSAL — NOT CANON labelling.** Finds resolve to items/remnants only, never to living encounters; its one real output is a remnant's `originArea` |
| 116 | `116-RANGER-WARDROBE.md` + `wardrobe-fragment.json` | Outfit sets per context (field / dojo / casual) as an annex to #33 §6 costume breakdown: sets organise breakdowns, the face never changes. Falk's three-outfit set is design-lane *reported* and flagged UNVERIFIED in workspace files |

**Cross-package wiring at a glance:** #107→species.json
`abilities` fields (real, empty) + #17 damage pipeline + #27
status + #7/#112 field interface + #9 presentation; #108→#80
seed + #28 care axes + #39 effort; #109→species/learnset/
machine-registry data + #80 individuals + #106 locations + #41
class axis; #110→#7 tables + #38 capture; #111→#7 `fish`
method + #31 items + #51 SFX; #112→#31 item layer + #7 roll +
#52 balance law; #113→#19 clock + #7 tables + #90 media + #84
sound ecology; #114→#11 graph + #19 ticks + #41 grammar + #38
capture + #1/#14 discovery; #115→#44 remnants + #31 items +
#103 materials; #116→#33 §6/§7 + #12 lane chooser flags.

**Discrepancy found while building (pre-existing, flagged for
landing — not silently resolved here):** the phase vocabulary
disagrees across packages — #19's `world-state/v1` fragment
names the phases `dawn | day | dusk | night`, while #7's
`spawn-table.schema.json` `timeOfDay` enum uses
`morning | day | dusk | night`. Items #113/#114 key their ticks
to the world-state ids and note the mismatch wherever a spawn
slot is touched.

**Nothing here is TeraBox-class.** All files are Markdown +
JSON, repo-sized (see STAGING.md).
