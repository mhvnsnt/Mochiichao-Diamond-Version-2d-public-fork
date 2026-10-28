# #119 — INTERIOR / DUNGEON LAYOUTS → interior area design system

**What was studied.** Interior layout grammar in the
publicly documented 2D RPG record: a building is a **graph
of rooms** hung off one exterior entrance; rooms connect by
typed links (doors, stairs, one-way drops, warp returns);
challenge is placed spatially — encounters that trigger on
*sight lines* (a watcher who sees the entrant), gates that
sit on the only path, rest points placed before peaks. The
kit taken: interiors are sub-graphs with typed links, and
every encounter/gate inside is a reference to the system
that owns it — layout owns space, nothing else. No maps,
room layouts, or dungeon contents are copied.

## Canon anchors (verified)

- **#11's route graph stays the world layer.** Its nodes are
  places; its edges already carry gates. Interiors do not
  extend the route graph — an interior is a sub-graph whose
  single host is one node, exactly as #99 ruled for
  hideouts: the event layer "returns the Ranger to the
  hideout's entrance." One host, one entrance contract.
- **#99's hideout grammar is the event layer above this
  one.** A hideout is "an event space on the #12
  architecture, specified as a beat sequence" — beats happen
  *in rooms*; this spec is the rooms. A hideout instance
  needs both: #99's beats, placed on this spec's layout.
- **#59's puzzle gates are placed, not floating:** a gate
  record's `pays` field ("route | area | encounter-table |
  story beat") already assumes a spatial home; interiors
  are where `area`-paying gates live.
- **#30's dojo encounters are the sight-line precedent:**
  dojo Rangers battle because they *see* the challenger —
  the encounter record owns the party; the interior owns
  the sight line that triggers it.

## Native spec — `mochiichao/interiors/v1`

An interior record:

- `interiorId` — stable id; `hostNode` — a #11 route-graph
  node id (verified at landing; a host that isn't a node is
  a data error).
- `rooms` — a list of room records:
  - `roomId` — unique within the interior.
  - `floor` — integer floor index (multi-floor = more rooms
    + stair links; no separate floor object).
  - `links` — typed connections to sibling rooms:
    `{to, kind}` with `kind` closed: `door | stairs |
    one_way | warp`. `one_way` links name their return
    explicitly or declare `return: host-entrance` (the #99
    contract) — a one-way link with no declared return is a
    schema error, because a soft-locked player is a layout
    bug, not a difficulty choice.
  - `gates` — #59 gate record ids placed in this room.
  - `sightlines` — encounter triggers:
    `{watcher: <#30 encounter record id>, range: <tiles>,
    facing: <direction>}`. The watcher is a reference —
    parties, dialogue, and outcomes stay in #30/#37. Range
    and facing are per-instance data; **no range values are
    asserted by this spec.**
  - `scripts` — #12 script/beat references staged in the
    room (#99 beats, #120 cutscenes).
  - `npcs` — #93 schedule references: which scheduled NPCs
    are present in this room is read from their timetables,
    never duplicated here.
  - `ambient` — the room's LIVING-WORLD place binding
    (beds, cycles). Interiors do not read #19 weather —
    weather is an exterior state; a room that needs a
    weather read (a broken roof, a greenhouse) declares it
    as an explicit exception field, default none.
- **Sight-line law:** a sight-line trigger fires on entry
  into the watched cells and resolves through the encounter
  system it references. Layout never decides outcomes —
  and a sightline whose watcher record has been cleared
  reads its state from #12 flags like every other encounter
  (no per-room "defeated" copies).

**The Dark Forest exception, stated once:** the Forest's
interior content is canon-named doors (the Aero Dojo and
the Cave of Echoes doors stand in it, per the season canon
map) — those are host-node facts, and the Forest depths
take no interior instances under this spec, for the same
reason their spawn table is empty: canon has not stocked
them. An interior proposed for the depths is a canon event,
not a layout decision.

## Wiring

Hosts on #11 nodes; gates from #59; encounters from #30
(over #37 parties); beats/scripts from #12 (incl. #99's
hideout grammar and #120's scenes); NPC presence from #93;
shops (#118) and services site their `placeId` here.
Save impact: none of its own — states live in #12 flags
and #96's sections, as everywhere.

## Coverage — honest

- **Grammar: fully documented** — room graphs, typed links,
  sight-line triggers are the standard published vocabulary.
- **Contents: zero interiors instanced.** No dojo floor
  counts, no hideout layouts, no sight ranges exist in
  canon, and none are invented here. Dojo interiors become
  instancible when #30's records exist to reference; the
  Syndicate hideouts when #99's instances are authored.

**PROPOSAL from List 25 #241 (registered at its landing, 2026-10-27):** a `followerRule` field on this file's interior record, default `welcome` (the record's own default). Garden law as a validation rule beside it: a Garden seat carrying `park`-as-exclusion or `barred` FAILS validation. Zero interiors are assigned a rule by this proposal.
