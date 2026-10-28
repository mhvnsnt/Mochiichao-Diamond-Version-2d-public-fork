# #297 — OPEN TRAVERSABLE WORLD → routes are places, not corridors

**The owner's essence statement (Jamar, 2026-10-27) is
this spec's charter:** Mochiichao is at heart an
open-world RPG — deeper and more open than a Pokémon
game even though it is built on the Pokémon base. A
Pokémon route is a corridor you walk between towns;
an open world's road is a *place* — it has width,
edges, detours, and far sides you can see before you
can reach them. This spec grows #127's connections
from graph edges into terrain: the connection record
stays the world's skeleton, and the land itself is
what the Ranger walks.

**What was studied.** The traversable-world shape of
the owner's named kin, as publicly documented:
Skyrim and Fallout's continuous landmass (you walk
to the horizon; difficulty is authored into the
country, not keyed to your level), GTA and Red Dead's
roads as lived space (places happen *on* them, #298),
and the Pokémon base's own answer kept where the base
is right (#11's graph, #59's authored gates, #140's
border gradients). The kit taken: continuity of
terrain, honesty of danger, and a gate discipline —
a gate is a thing in the world with a reason, never
a wall the world won't explain.

## Native spec — `mochiichao/open-world/v1` (fragment beside this doc)

- **Terrain hangs off the graph; it does not replace
  it.** #11's nodes and edges remain the world's
  addressing system, and #127's connection records
  remain how regions join. What this spec adds is a
  **terrain record per area**: the area's traversal
  classes (open ground / water / climb / cave /
  depth-class), its authored danger band reference
  (#52 — the band is the area's own, read from its
  #7 tables), and its edges described as geography:
  where the area simply *ends* (sea, cliff, the
  Forest's deepening dark) and where it *joins* the
  next area (#127 connections, #140 border zones).
  A route, under this record, is an area like any
  other — it has spawn tables (#7), weather (#61),
  behaviour (#152), and width. Corridors exist only
  where geography makes them (a pass, a bridge, a
  cave mouth) — authored, never default.
- **Wandering somewhere dangerous early is allowed,
  and the world answers honestly.** This is #139's
  ruling built into the ground: the early-discovery
  two-class law (world-open systems fully live on
  presence; story-locked systems test their own
  flags) and #52's no-scaling law (bands never read
  party state) are the whole of it. The terrain
  record adds the presentation of that honesty: a
  dangerous area *reads* dangerous before it proves
  it — the #152 behaviour of its residents, the
  #215 beds, the land's own look — because an open
  world that kills without warning is not honest,
  it is just unmarked. Warning is presentation;
  mercy is never machinery.
- **Every block is geography or a gate with a
  reason.** The closed set of things that can stop
  a Ranger:
  - **Geography** — the terrain record says the land
    ends or turns impassable (open sea without a
    crossing, a cliff without a climb). Geography is
    never a flag; it is fixed until the world itself
    is re-authored.
  - **An authored gate** — a #59-class gate or a
    #117 technique gate placed in the terrain, and
    every gate record carries an **`inWorldReason`**
    (why, inside the fiction, this stops you: the
    pass is snowed in, the door is the dojo's, the
    current takes boats one way) and the **fact
    class that opens it** (#12 flag classes, a
    technique, a #127 discovery kind). A gate whose
    reason cannot be said in-world is not a gate —
    it is a defect, and landing validation rejects
    it.
  - **Nothing else.** There is no third member of
    this set. An invisible wall — a block with no
    geography and no gate record — is unrepresentable
    in the terrain record's shape, on purpose.
- **Seeing is not reaching, and both are legal.**
  Terrain records carry sight lines as presentation
  data (the far shore visible from this one, #140's
  gradient country where the next region's species
  already drift through): the open world advertises
  itself. #137's atlas derivation (unknown / hinted /
  open) reads the same facts, so what the eye is told
  and what the map says can never disagree.

## Show lane

The show walks the same ground (#127's law: the show
follows the game's geography and invents none). A
route in an episode is a place the cast crosses,
camps in (#134), and meets people in — never a
hallway between scenes. #306 carries the presence
that fills it.

## Wiring

Terrain records sit beside #11's graph data and read
#7/#52 (bands), #140 (border gradients), #59/#117
(gates), #127 (connections), #137 (atlas agreement),
#139 (the arrival law this builds on — see STAGING
for the brief's #142 citation, reconciled), #123
(mounted traversal over the same terrain), #141
(ferries as geography's crossings).

## Open slots

Which areas exist, their terrain, their bands, and
every gate's in-world reason are world content —
authored with the map, region by region. Region 1's
graph (#11) is the only verified node set; Regions
2–5 terrain is content their builds own. No mechanic
is open: the traversal classes, the block set, and
the gate contract are filled in full.

## Coverage — honest

- System: complete — the terrain layer, the block
  set, and the gate-honesty contract are specified
  whole.
- Contents: zero terrain records instanced (the
  graph they hang off is Region 1's only, and its
  areas' terrain authoring is the world-data pass).
