# #127 — CONNECTED-WORLD TRAVEL → region-transition system (discovery, not a gate)

**OWNER RULING (Jamar, 2026-10-27) + REFINEMENT (later
the same day) — this system exists because of both:**
there is NO New Game Plus restart mode in Mochiichao, and
there is no one-way post-region gate either. The world is
**ONE CONNECTED OPEN WORLD**. Beating a region opens the
way to the next — but a route into another region can
also be **DISCOVERED**: by travelling and finding it
(possibly early, even by accident), through side stories,
or through map connections — however it is found. The
journey just continues, in the owner's words: "it's kind
of still a new game plus but it's not — it's just
continue." #122 is CLOSED as a mode; its disposition
table survives only as continuity reference. This spec is
the live system, specified on the discovery model:
**progression unlock is one route kind among several;
nothing resets, ever.**

**What was studied.** Region connection in the reference
games, as publicly documented, in both its classic shapes:
the gated two-region journey (league completion opens the
second region) and the connected-open-world shape (later
documented designs where neighbouring areas are reachable
by walking, riding, or sailing into them, with authored
difficulty gradients standing in for locks). The kit
taken: a border is not a door with one key — it is a
**set of connections**, each with its own way of being
found; difficulty is authored into the far side's tables,
never computed from the visitor. No maps, routes, or text
are copied.

## Canon anchors (verified in the packages + season canon)

- **Five regions exist in canon** (season canon map:
  Region 1 Iridescence; Regions 2–5 for later seasons) in
  one world — Regions 2–5 are *later-season* content, not
  separate games, and Region 1's own completion shape is
  already built (circuit #45 → gauntlet #100 → Hall of
  Fame record #126 at `story.champion_defeated`).
- **The Seven Mochii Isles are Region 1's postgame** (#66)
  — intra-region travel, the near model for how "more
  world" opens without anything resetting.
- **#11's graph is Region 1's, and it is a graph.**
  `world-systems/region1-route-graph.json` holds Region 1
  nodes/edges with typed gates (`story_flag`, `technique`)
  — the same edge machinery expresses a border connection.
  No cross-region edge exists in the verified graph yet;
  this spec defines the record that one will be.
- **Continuity is the save's nature:** #96's payload is
  one continuing record; #14 completion is derived from
  global bitsets at read time. Discovery adds *facts*
  (found routes); it never touches the reset column —
  #122's table has no reset column here because there is
  no cycle to reset into.

## Native spec — `mochiichao/region-transition/v1` (fragment beside this doc)

The unit is the **connection**, not the transition:

- `connectionId` — `<fromNode>--<toNode>` across a region
  border (`fromRegion` / `toRegion` carried on the record;
  a connection is an #11-shaped edge whose endpoints sit
  in different regions' node sets).
- `discoveryKinds[]` — the closed vocabulary of ways this
  connection can be found; a connection carries **one or
  more** kinds, and any one of them suffices:
  - `progression` — beating the near region opens it
    (the gauntlet/circuit standing route; the documented
    classic, demoted by the ruling to one kind among
    several).
  - `exploration` — travelling and finding it: reaching
    its near endpoint in the world (walking the coast,
    the pass, the shore) — **including by accident, and
    including early**, before the near region is beaten.
  - `side-story` — a side story opens it: an authored
    beat chain (#12 `story.*` facts) whose resolution
    reveals or clears the way.
  - `map-connection` — the map itself joins: a connection
    that exists because the world map's geography touches
    (a ferry line, a shared cave system, a bridge on the
    chart) — found by reaching *either* endpoint or by
    the connection's own chart fact.
- `discovery` — per-connection state, **derived, not
  stored as a list**: a connection is *open to this
  Ranger* iff at least one of its kinds' conditions holds
  (a `progress.*` standing for `progression`; an arrival
  fact at the near endpoint for `exploration` — the same
  arrival evidence #125/#32 already derive travel and map
  reveal from; the side story's resolution fact for
  `side-story`; endpoint/chart facts for
  `map-connection`). Discovery is therefore per-Ranger,
  per-connection, and — once true under any kind — true
  for good: **a found route is never un-found.**
- `arrivalStaging` — what crossing *does*: nothing to the
  traveller (no reset, no scaling, no confiscation — see
  continuity below) and one thing to the world record: a
  first-arrival fact in the destination (`story.*` beat
  namespace of the destination region) the first time
  this Ranger crosses *by any connection*, so first-
  arrival staging (the region's opening beats, its
  circuit's welcome) fires exactly once however early or
  late, by whichever door, the Ranger came in.

## Early and out-of-order arrival — the designed case, not an exploit

The refinement makes early arrival a **first-class
case**, and the system's honesty about it is mechanical:

- **Bands are authored, never scaled (#52, inherited
  whole).** A Ranger who finds Region 2 at hour three
  meets Region 2's authored encounter bands — likely far
  above their party. The world does not apologise and
  does not adjust: the gradient IS the design. (#52's law
  — wild bands never read party state — is precisely what
  makes discovered-early travel survivable as a design:
  the far side was never pretending to be for you yet.)
- **Nothing on the far side pretends you finished the
  near side.** Destination systems read their own facts:
  its circuit's gates test its `progress.*` flags, its
  story beats test their prerequisites — an early Ranger
  simply has fewer of them true. Content that requires
  near-region completion states that requirement in its
  own gate (an #11 gate kind / #12 flag), it does not
  inherit a border lock from this system.
- **Story order is content's business, not travel's.**
  This spec guarantees movement and continuity; whether a
  destination beat *makes sense* before a near-region
  beat is an authoring question for the beat's own
  prerequisites (#82's conservation discipline at region
  scale), flagged here so nobody "fixes" it by locking
  the border.
- **Return is symmetric.** A discovered connection
  travels both ways (a connection record with a genuine
  one-way geography — a falls, a one-way current — states
  `oneWay: true` as an authored exception, never a
  default).

## Continuity rules (the anti-NG+, restated for one world)

- **Party and roster: unchanged by any crossing.**
  Individuals travel as themselves — same #80 records,
  same #104 honours, #68 locks intact; #106 `location`
  semantics unchanged (crossing a border is not a storage
  event). No crossing deletes, archives, or re-levels
  anyone, at any point, for any reason. There is no
  transition "output" to audit because there is no
  transformation.
- **Dex: one dex, regional sections as views.** Global
  bitsets (#96); a regional dex is a derived view over
  the region's species subset (#14 popcounts; #102's
  per-area projection is the same move at smaller scale).
  An early-found region's section simply starts filling
  early — derivation has no opinion about order. #97
  research facts likewise persist and re-derive per view.
- **Licence: one licence.** #98's view gains each
  region's circuit as that region is entered (its
  Fragment case renders per circuit). #133's region-
  gating idea survives only as its flagged PROPOSAL
  attached to the `progression` kind — it may never, if
  ruled in, seal a connection whose other kinds a Ranger
  has already satisfied: a discovered route stays
  discovered. (Recorded here so the proposal can never be
  landed as a border lock by drift.)
- **World state:** #19's producer is global; each
  region's weather/phase flavour is its own tables
  (#61/#73). The traveller's `world` section persists
  (#96) and is read under whichever region the Ranger is
  standing in.

**Game data first (owner wiring refinement, 2026-10-27):**
the discovery model is wired primarily into the GAME
DATA — connections as records in the route-graph layer,
early-arrival handling in the encounter/region systems,
one-world continuity in the save — not as spec prose
alone. The connection record below is a data shape meant
to live beside #11's edges and be audited against the
real graph at landing.

**Show lane (secondary, and downstream of the game):**
the show is built off the game's geography — it follows
the game's connections and does not invent its own.
Region discovery may be how the show's characters reach
the next region / next season; regions may overlap
seasons or be hinted at before arrival. Discovery is the
show's natural grammar — a found pass is an episode, a
side story is an arc — and #82 conservation applies at
region scale: what crosses into a new region's season is
exactly what the previous season's exit state holds,
whenever the crossing happens.

## Wiring

Extends #11 (connection = an edge record across region
node sets; the graph's in-repo home is a landing
verification carried from List 13's register — no graph
file is edited by this package). Reads #96 (continuity),
#14/#97/#102 (derived views), #100 + #126 (the
`progression` kind's standing facts + capstone), #98
(licence view), #52 (band law), #68/#80/#104/#106
(individual continuity), #125/#32 (arrival evidence —
the same derivation discovery reuses), #82 (show
conservation). Replaces #122 as the live answer to "what
happens between regions"; #122's file carries the ruling
+ refinement on its face and stays as reference.

## Coverage — honest

- **Architecture: documented in both shapes** (gated
  two-region journeys; connected open worlds), and the
  discovery model is the owner's ruling, not a pattern
  claim.
- **Contents: zero connections instanced.** No border,
  endpoint, passage fiction, or first-arrival beat is
  asserted for any region pair — Region 2's node set is
  not yet verified data, and the connection records land
  when the regions they join exist as data. Per-border
  `discoveryKinds` assignments, the side stories that
  open routes, and every region's bands are OPEN /
  region-build content. This spec fixes the model so a
  connection, when authored, is a record with a discovery
  state — never a hard-coded gate in code.
