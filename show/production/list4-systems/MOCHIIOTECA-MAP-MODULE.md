# #32 — WORLD-MAP / MINIMAP SYSTEMS → Mochiioteca map module spec

**What was studied.** Map-screen architecture in the reference
games, publicly documented: a stylised region map where areas
light up under a **fog-of-discovery** rule (unvisited = hidden/
silhouette, visited = revealed, current = marked), location
entries that join the dex's "where is it found" data, and a
fast-travel layer gated by story flags. The yield: the data and
behaviour spec for the Mochiioteca's map module.

## Fixed inputs (do not re-derive)

- The device is the **MOCHIIOTECA**; its **physical design is
  undesigned in canon** (SEASON-CANON-MAP) — this spec is data
  + behaviour only. Presentation/art is OPEN and nothing here
  presumes a screen shape.
- Area ids come from the route graph (#11) and ecology zones
  (#29); the map module owns no geography of its own.
- Discovery states are the species-systems three-state model
  (unseen/seen/met — SILHOUETTE-DISCOVERY #3); area reveal
  states below are the *place* analogue, deliberately parallel.

## The module spec

**Area reveal states** (per area, derived from #12 flags —
never stored as map data):

| State | Rule (derived) | Map behaviour |
|---|---|---|
| `unreached` | no `progress.*` flag touches the area | name hidden; silhouette landmass only |
| `reached` | entered-area flag set | name + zone classes shown |
| `known` | reached + any species in the area at seen/met | resident hint list (species silhouettes until seen — the #3 rule applied to places) |

**Data record** — `map-reveal.schema.json`: per area
`{areaId, displayName (display-sweep names — Region 1 displays
as Iridescence), graphNode (route-graph join), ecologyZone
(#29 join), revealFlag (the #12 flag the state derives from),
fastTravel: {unlockFlag: null}}`. Fast-travel existence per
area is a flag slot; whether the game offers it at all is an
OPEN design decision (canon silent) — the slot existing is not
the feature existing.

**Minimap behaviour** (in-world, game lane): current-area
highlight derives from the same record + the player's area id;
no separate minimap data exists. Show lane: the Mochiioteca's
map appears on screen only as story beats direct (EP01 cut 12's
abstract light+icons treatment is canon's current answer) —
the module constrains *what the device may truthfully show*
(an episode may not show a `known` resident list for an area
the story hasn't reached), which is the two-lane consistency
law applied to a prop.

## Coverage — honest

- **Architecture: fully documented.**
- **Contents: joins and rules only.** Every area's reveal flag
  and fast-travel slot is OPEN until the route/flag pass assigns
  them; the device's physical/visual design is OPEN by canon.
  Nothing here invents a flag, a place, or a screen.
