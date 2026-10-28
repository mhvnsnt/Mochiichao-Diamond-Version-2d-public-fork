# #141 — FERRY & SEA-ROUTE NETWORK → sea travel as discovered routes

**Doctrine seat:** the sea is part of the connected world
(OWNER REFINEMENT, 2026-10-27): you reach the islands —
and some regions — by *sailing*, and a sea route, like a
land route, is discovered. A ferry is therefore modelled
as a *route that runs on the world's clock*, never as a
teleport: this system is the deliberate other half of
#125. Fast travel (#125) is a derived convenience over
places already reached; the ferry is how a place gets
reached the first time, and how it stays reachable in the
fiction when fast travel isn't the answer.

**What was studied.** Ship travel in the publicly
documented record: ferries that depart on schedules (the
boat is somewhere, at some times, and the traveller plans
around it), sea routes that open when a harbourmaster,
ticket, or story beat admits the traveller, and island
chains served as a sequence of short hops rather than one
long jump. The kit taken: a route is a *scheduled edge
with landings* — it exists in the timetable whether or not
the player has found it, and finding it is #137 discovery
applied to water.

## Native spec — `mochiichao/ferry-route/v1` (fragment beside this doc)

- `ferryRoute` record: `{routeId, landings: [nodeA,
  nodeB] (#11 nodes / #140 border landings), connectionId
  (#137, nullable for intra-region routes), sailings[] —
  phase windows over #19's producer (departure phases per
  direction), durationPhases, discovery — the #137
  derivation, fare (nullable #20 economy join)}`.
- **Schedules are world-clock facts.** A sailing is
  computed from #19's phase/day producer at read time —
  the same deterministic-over-clock discipline as #124's
  rotation and #93's schedules (first-match, no memory in
  the layer). A missed ferry is never a fail state: the
  next sailing is a lookup, and waiting is a world
  activity (the landing is a real place, #140/#119).
- **Discovery is #137's, unchanged.** A route whose
  connection is `unknown` does not appear in any timetable
  the Ranger can read (harbour boards are display surfaces
  — #85 Leak rule + display names only); `hinted` shows
  the route as rumoured ("a boat goes *somewhere* from
  the east pier"); `open` shows sailings. Blind discovery
  exists at sea too: being *carried* somewhere by a side
  story (#138 travel case) sets arrival evidence directly.
- **Riding is an event, not a cut.** The crossing takes
  `durationPhases` of world time; weather en route is the
  border climate seam (#142); wild encounters at sea, if
  a route's design carries them, read the route's own #7
  water tables (never a region's), under #139's world-open
  class.

**The Region 1 instance — seeded, contents OPEN:** the
**Seven Mochii Isles** (display name; production-layer
"Seven Data Isles" survives in ids — #66, #23 lookup law)
are Region 1's postgame archipelago, reached by sea from
Region 1's harbours. This spec asserts exactly that shape
— an intra-region ferry network serving the isles — and
nothing else: isle names, themes, contents, landing
places, and the harbour of departure are all #66's OPEN
slots, inherited open, never filled here.

## Wiring

Routes join #137 (discovery derivation) and #11/#140
(landing nodes); clock joins #19 (phase ids — note the
inherited flag: #7's spawn enum spells the first phase
`morning` where #19 says `dawn`; landing reconciles in
one place per List 12's register — this spec keys to #19
throughout); timetables render through #23/#85; fares
join #20/#118 (prices are data); rotation of special
sailings (festival boats) joins #124/#105.

## Coverage — honest

- **Architecture: fully specified** (scheduled-edge
  record, discovery reuse, clock discipline).
- **Instances: shape only.** The Seven Isles network is
  asserted as a shape over #66's open contents; every
  other route — every landing pair, schedule, and fare —
  is OPEN. No timetable in this package contains a real
  sailing.
