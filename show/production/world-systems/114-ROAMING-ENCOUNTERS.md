# #114 — ROAMING CREATURE SYSTEMS → roaming encounter system

**What was studied.** The roaming architecture of the
reference games, as publicly documented: a **unique
individual** is released into the world and thereafter
**moves between adjacent areas** on a timer or step trigger;
it can be met in battle where it currently stands, it
**flees** rather than fighting to a finish, and its state
(damage, status) **persists between meetings**, so a campaign
against it accretes across the map. Once seen, its position
is tracked on the map. The kit taken: one individual record,
graph movement, persistent state, evidence-first tracking.
No roamer's species, territory, or story is taken — none is
canon, and none is asserted here.

## Native format — a record that walks the graph

A roamer is an **individual** (#80's record, `individual_id`
+ species reference + variance), carrying one extra block:

```
roaming {
  currentNode: <route-graph node id>,       // #11
  moveRule: "phase-step",                    // one edge per #19 phase tick
  territory: [<node ids>] | null,            // OPEN; null = whole graph
  state: { vitality: <persisted>, conditions: [<#27 ids>] },
  seenTracking: false                        // -> true at first meeting
}
```

- **Movement reads only the graph.** The route graph (#11,
  `region1-route-graph.json` — verified: nodes/edges with gate
  kinds `story_flag | technique | fragment_count |
  sequence_clear | null`) is the roamer's whole world: each
  #19 phase tick, the roamer steps along ONE edge from its
  current node. **Gates do not apply to the roamer** — gates
  test the *Ranger's* progression state (#12); a wild
  individual's movement is not a progression fact. Its world
  is the graph's *topology*, not its locks.
- **Presence is a record check, not a table slot.** Spawn
  tables stay species-level and principal-clean (LIVING-WORLD
  P1: a spawn row never casts a named individual). Meeting a
  roamer is resolved by comparing the Ranger's current area
  against `currentNode` — the tables are never polluted with
  one-off rows, and removing the roamer record leaves every
  table unchanged (the same layering proof as #112/#113).
  - ⚠ **Join flagged:** this requires spawn `areaId`s and
    graph node ids to name the same places. Both files are
    real (#7 instances reuse canon map ids; #11's Garden
    subnodes deliberately share ids with the spawn bundle) —
    but a full id-alignment audit is a **landing check**
    (STAGING.md), not something this spec asserts complete.
- **State persists.** Vitality and #27 conditions carry
  between meetings (stored on the record, saved under #96's
  roster section). A roamer at low vitality is a *campaign
  fact*; healing it between meetings is a world decision —
  default: it does not heal off-screen, and any exception is
  a scripted #12 event, not a system kindness.

## Meetings — presentation obeys #41

Every roamer meeting is staged under the **mythical
presentation grammar (#41)** — whether or not the species is
`presentationClass: mythical`, because the *shape* of the
encounter is the same: **TRACE before body** (its footprint
or Frost-class trace, a cry at the edge of hearing — the map
marker unlocks only after a first meeting: `seenTracking`),
**QUIET** (ambient population withdraws), and **no ordinary
frame**: the meeting resolves through #38's scripted/special
record family or not at all — a roamer's `catchRate` may
legally be `null` (not capturable in data, #41), and flight,
not fainting, is the default ending. Roaming and mythical
stay **separate axes** (the #44 independence discipline): a
roamer need not be mythical; a mythical need not roam. This
spec borrows #41's *staging*, not its class.

## Discovery and media

- First meeting sets the species' `seen` bit (discovery
  bitsets, species-systems #1); `met` only on a bond, per
  #14's rules — a season of meetings with an uncaught roamer
  leaves the registry exactly as honest as it should be.
- #90 media may report a *disturbance* moving through areas
  (the #113 announcement discipline: never naming an unmet
  species, never printing a roamer's node as a spoiler). The
  map marker is the Ranger's own record, earned by meeting —
  the media system is not a tracking service.

## Wiring

- Movement producer: #19 phase ticks (the same single
  producer #113's windows read — one clock for all movers).
- Position store: the individual record (roster section of
  the save, #96); position is *stored* state (unlike
  Fragments/dex states, which are derived — a roamer's node
  cannot be re-derived from anything else, so it is honestly
  a fact, kept beside #97's stored-facts discipline).
- Show lane: a roamer is a recurring-presence device — its
  appearances chain like #37's per-appearance records
  (diffing meetings is how its story is told), and every
  appearance is boarded under #41's beats. The game record
  and the show chain are two reads of one individual's life,
  per the two-lane one-truth rule.

## Coverage — honest

- **Architecture: fully documented** (unique individual +
  graph movement + persistent state + flee-first meetings).
- **Contents: zero roamers.** No species, territory, or node
  is asserted; canon names no roaming individual. The record,
  the movement rule, the persistence rule, and the staging
  discipline are the yield — plus one flagged join (area/node
  id alignment) for landing to verify rather than assume.

---

**Landing citation — List 33 (2026-10-27).**

#323 standout encounters (`world-systems/323-STANDOUT-ENCOUNTERS.md`) rides this file's persistence records: a standout is a pre-existing persistent individual met in the wild, presented as an encounter-presentation read — #323 instances no standout in any spawn table, area, or rate, and founds no rate of its own. Roaming is #114 (not #113, swarm events): the correction registered in List 33's STAGING is carried here.
