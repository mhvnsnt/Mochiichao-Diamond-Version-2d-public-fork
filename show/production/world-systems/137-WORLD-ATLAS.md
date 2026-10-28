# #137 — WORLD ATLAS & CONNECTION DISCOVERY → one-graph atlas system

**Charter (OWNER RULING + REFINEMENT, Jamar, 2026-10-27,
carried on #122's face and specified by #127):** Mochiichao
is ONE CONNECTED OPEN WORLD. Beating a region opens the way
to the next, but a route can also be DISCOVERED — by
travelling and finding it (possibly early, even by
accident), through side stories, or through map
connections. This spec is the map of that world: one
continuous graph, with the *connections between regions*
as first-class records whose discovery is a derived state,
never a stored unlock list.

**What was studied.** World-map systems in the publicly
documented record: regional maps that reveal progressively
as the traveller arrives (the map is a record of presence,
not a menu), multi-region atlases in the two-region games
(one map surface, region pages), and open-world maps whose
routes render only once a hint source has spoken of them.
The kit taken: the atlas is a *view over presence and
hearsay* — an area or route shows because the world has
evidence for it, in three grades: never heard of it, heard
of it, been there / can go there. No maps, art, or text are
copied.

## Canon anchors (verified in the packages)

- **#32's map module is per-area and derived:** area reveal
  states derive from #12 flags (`map-reveal.schema.json`:
  per area, a `revealFlag` the state derives from). #137
  adds the missing layer beside it: *connections*, in the
  same derived idiom. It does not replace #32.
- **#127 defined the link's shape:** a cross-region
  connection is an edge in #11's own terms — `{from, to,
  gate, status}` — with zero edges instanced, because
  Region 2's graph is not yet verified data. #137's record
  *is* that edge, plus its discovery derivation.
- **#11's verified graph is Region 1's only** (28 nodes /
  20 edges, workspace `world-systems/region1-route-
  graph.json`). The world graph this spec describes is the
  *composition* of regional graphs by connection edges;
  today exactly one regional graph exists as data.
- **The Leak rule binds every display surface (#85):** no
  sign, marker, or device-rendered text may carry
  secret-layer vocabulary (no "Mainframe" / "Data" /
  "Binary"); display names are #23 lookups. The atlas is a
  device-rendered surface — it renders display names only,
  and an undiscovered connection renders *nothing at all*,
  not a greyed secret.

## Native spec — `mochiichao/world-atlas/v1` (fragment beside this doc)

- `connection` — one record per inter-region connection:
  `{connectionId, fromNode, toNode, gate (#11 kinds),
  hintSources[], regionPair}`. The record is *authored
  shape*; it asserts a connection exists in the world
  design. It does NOT assert the player knows.
- `discovery` — **derived, never stored**, per connection,
  in exactly three states:
  - `unknown` — no evidence: no hint flag set, no arrival
    evidence. The atlas renders nothing for this edge.
  - `hinted` — at least one hint-source flag is set: a
    side story beat (#138), a traveller's tale (#145), an
    Iridescence media mention (#90 generators read state;
    they may only hint at what their state already knows).
    The atlas renders the connection as a *rumoured route*
    — destination shown by display name, path not drawn.
  - `open` — arrival evidence exists (a #12 flag set on
    the far side: an arrival beat per #127, a reveal flag
    per #32, a progress clear) OR the #127 progression
    route has fired (the region's capstone clear). The
    atlas draws the route.
  The derivation reads #12 flags only — the same evidence
  #32's reveal and #125's travel set already read. Three
  consumers, one evidence base, no new stored state.
- `regionPair` names the two regions; region membership of
  nodes stays with each region's own graph. Border-zone
  nodes (#140) belong to the world graph and appear in
  both regions' atlas pages.

**Discovery is multi-route by construction (the doctrine):**
progression (#127 capstone), side story (#138), traveller
or media hint (#145/#90), and *blind travel* — walking a
border zone (#140) and physically arriving sets arrival
evidence directly, so `open` can be reached with no hint
at all. The derivation cannot distinguish *how* the
evidence got there, and must not try: however it is found
is the owner's doctrine, verbatim.

## Wiring

Extends #32 (per-area reveal) with the per-connection
layer; edge shape from #127 over #11's graph; evidence =
#12 flags; hint sources = #138/#145/#90; border nodes =
#140; sea edges render through #141's route records;
display through #23 under #85's Leak rule; #125's travel
set reads the same `open` derivation (a travel point is
reachable only across open connections — #125 already
derives from arrival evidence; this spec names the shared
evidence, it does not fork it).

## Coverage — honest

- **Architecture: fully specified** (derived three-state
  discovery over one evidence base).
- **Instances: zero.** No connection is instanced: Region
  2's graph does not exist as verified data, so no real
  `fromNode`/`toNode` pair can be written. The fragment
  ships the shape with null endpoints. Every concrete
  connection — endpoints, gates, which regions touch — is
  OPEN, owned by each region's own build.

**Consumer citation (List 17 #163, landing 2026-10-27):** mythical-habitat sealing behaviour is decided in 163-MYTHICAL-HABITAT-SEALING.md (show/production/world-systems/), not in this document.
