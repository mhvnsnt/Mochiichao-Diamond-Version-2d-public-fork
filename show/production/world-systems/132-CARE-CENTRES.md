# #132 — HEALING CENTRES → care centre system (town field infrastructure)

**What was studied.** The healing-centre institution of
the reference games, as publicly documented: a building in
(nearly) every town offering one core service — the party
is restored to full — free at the point of use in the
classic form, staffed by a named-role keeper, and doubled
as the town's social anchor (the place travellers meet,
hear news, and re-orient). The kit taken: restoration is
**infrastructure, not an encounter** — instant, reliable,
un-dramatised in the game lane — and the centre's second
job is being a *place*: staffed, placed, and scheduled
like other world services. No layouts, dialogue, or names
are copied.

## The Garden distinction (read first — this is not a second Garden)

- **The Mochi Garden is home.** #28's care loop
  (ARRIVE/ASSESS/TREAT/BOND/RETURN, opened at R1-BEAT3 by
  Assistant Mochiko) is *raising*: care over time, axes,
  bond — the relationship layer. Garden care accrues; it
  is where individuals live.
- **A care centre is field infrastructure.** It does in
  minutes what the field needs — restore vitality, cure
  status — and nothing else. A centre visit writes **no
  care axes, no bond, no honours**: passing a centre
  through the care profile would let travel substitute
  for raising, which is exactly the confusion this spec
  exists to prevent. The two systems share a vocabulary
  (TREAT appears in both) over deliberately separate
  ledgers.

## Native spec — `mochiichao/care-centres/v1`

A centre is a **service place record**, in the family of
#118's shops and #101's tutors — places are data:

- `centreId`, `placeId` — a #11 route-graph node (or a
  #119 interior hanging off one); a centre may only cite
  a place that exists.
- `keeper` — an NPC reference on a #93 schedule; staffing
  fiction is **Assistant-class** (the Garden's keeper is
  *Assistant Mochiko* — the role word is canon; whether
  town keepers share the title, a rota, or an organisation
  is fiction content, **OPEN**).
- `services[]` — closed vocabulary, contents per centre
  OPEN:
  - `restore` — party vitality to full (the core service).
  - `cure` — persistent-status cure, expressed in #27's
    own terms: clears the individual's persistent
    condition (the one-at-a-time class); volatile
    conditions are battle-scoped and never a centre's
    business. The centre performs what #27's `cureBy`
    item hooks perform, as a service — no second cure
    mechanic is defined.
  - `rest` — a stay that passes world time (hands off to
    #19's clock; whether rest advances phases, and what
    it skips, is the clock's own law — the centre
    requests, it does not rule).
- `cost` — the documented classic is free. Mochiichao's
  ruling is **OPEN**: if a cost exists it is service data
  on #20's economy (single currency, name OPEN there),
  never a hardcoded number here. The fragment of the
  record ships `cost: null` — unset, not zero.

**What a centre never does:** it does not heal *story*
states (a scripted injury is a story fact, #12 — services
do not edit story flags), does not resurrect the
distinction between seen/met in the dex (no dex writes),
and does not store anyone (#106 is storage; a centre
visit leaves the roster exactly as it arrived).

**Show lane:** centres are road-episode infrastructure —
the place the party is *safe*, staged as such (the
#134 camp is the field counterpart: camp is improvised
care, the centre is civic care). A keeper is a character
with a thesis when the episode needs one (#37's grammar
for named NPCs), a scheduled presence when it doesn't.

## Wiring

Place joins: #11 nodes / #119 interiors. People: #93
schedules. Services read #27 (status classes + cure
semantics), #19 (rest/time), #20 (cost slot). Deliberate
non-joins, stated for the landing audit: **no writes** to
#28's care profile, #104 honours, #14 dex, or #12 story
flags — a centre's only writes are the party's vitality
and persistent-status fields, which are the battle/
roster layer's own.

## Coverage — honest

- **Architecture: fully documented** (the centre is the
  reference games' most stable institution).
- **Contents: zero centres instanced.** Locations,
  keepers, per-centre service lists, the cost ruling, and
  the staffing fiction are OPEN. The spec's load-bearing
  content is the Garden boundary — the rest is a service
  record shape the world build can instance town by town.

**Seat reconciliation (List 20 #193, landing 2026-10-27):** daycare custody seats in #77's Garden housing. Centres under this file store NOBODY — no centre build may seat custody here.
