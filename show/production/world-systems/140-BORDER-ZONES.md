# #140 — BORDER ZONE DESIGN SYSTEM → the spaces between regions, designed

**Doctrine seat:** in a connected open world (OWNER
REFINEMENT, 2026-10-27), the way to another region is a
*place* before it is a menu: somewhere you can walk to,
camp in, get lost in, and cross by accident. Border zones
are those places — first-class areas of the world graph
that belong to neither region alone. This spec is the
design grammar for them; it zones no geography.

**What was studied.** Threshold spaces in the publicly
documented record: the routes and sea-lanes that join
regions in the two-region games (authored areas with their
own encounters, not loading corridors), mountain passes
and straits in open-world design writing (the crossing is
content: weather turns, the far side's species start
appearing before the border is formally crossed), and
border shrines/gates as cultural thresholds — in this
world's grammar, the shrine gate (torii) that already
names the dojo gates in canon. The kit taken: a border
zone is a *gradient, not a line* — origin-region character
thins, destination character gathers, and the crossing is
the middle of the zone, not its edge.

## Native spec — `mochiichao/border-zone/v1` (fragment beside this doc)

- `borderZone` record: `{zoneId, between: [regionA,
  regionB], connectionId (#137), areas[] — #7/#29 area
  records whose `regionMembership` is `border`,
  gradient: {nearSide, farSide} — which species/habitat
  tables lean which way, gate (nullable #59 lock),
  landing (nullable #141 ferry landing), campSpots
  (#134 joins)}`.
- **Membership rule:** a border area appears in *both*
  regions' atlas pages (#137) and *neither* region's dex
  section alone (#127: a regional dex is a view over home
  data; border species' home data is the zone). Its spawn
  tables are its own #7 tables, authored — never a blend
  computed from the two regions' tables.
- **Gradient rule:** the zone's tables may include
  destination-region species *before* the connection is
  formally open — this is the authored form of discovery:
  meeting the far region's creatures on the near side of
  the pass is how a Ranger learns something is over there.
  (Audio joins #84's roster-binding law: a border zone
  may only sound of species its own tables stock.)
- **Gates, when present,** use #59's closed lock classes
  with the mandatory ordered clue chain and soft
  fail-states; a border gate is a *place's* door (a shrine
  gate, a harbour chain, a Syndicate-held checkpoint per
  #99's grammar), never an invisible wall. A gated border
  still allows the zone itself to be explored up to the
  gate — the gate locks the crossing, not the approach.
- **Interiors** in a border zone (a gatehouse, a ferry
  office, a shrine shelter) hang off the zone's nodes per
  #119's one-host rule, exactly as town interiors do.

**Design grammar (the qualitative half):** every border
zone must read as *between* in at least three registers —
ecology (the gradient), climate (#142: the zone carries
the seam of the two regions' climates), and culture
(signage under #85's Leak rule in the origin's idiom
facing out, the destination's facing back; the shrine
gate stands at the seam, not at either end). A border
zone that reads as merely "the last route of Region A"
has failed the grammar even if its data is valid.

## Wiring

Areas join #7/#29 (spawn/ecology) with the `border`
membership value; connections join #137; gates join #59;
interiors join #119; landings join #141; climate seam
joins #142; sound joins #84; camps join #134; discovery
by walking the zone is #137's blind-travel route and
#139's early-arrival case made geographic.

## Coverage — honest

- **Grammar + record shape: fully specified.**
- **Instances: zero.** No border zone is designed: which
  regions touch, where, through what terrain, and every
  zone's contents are OPEN — geography belongs to each
  region pair's own build, and Region 2 does not yet exist
  as verified data to border *with*.
