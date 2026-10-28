# #125 — FAST-TRAVEL NETWORKS → fast-travel network

**What was studied.** Fast travel in the publicly
documented record, in its two durable forms: the
*discovered-point network* (travel between places already
reached — the network is a memory of the journey) and the
*granted network* (points unlocked by an item or ability).
The kit taken is the discovered-point form, for a reason
the architecture below makes structural: a network derived
from arrival can never take the player somewhere the story
hasn't. No point lists, maps, or unlock schedules are
copied.

## Canon anchors (verified)

- **#11's route graph is the only geography.** Nodes are
  places, edges carry gates (`story_flag`, `technique`,
  threshold kinds). A travel point that is not a graph node
  does not exist — the network inherits the graph whole,
  so it can never contradict the map (#32 renders the same
  graph).
- **#32 MOCHIIOTECA-MAP-MODULE already derives place
  knowledge from flags:** reveal states are derived over
  route-graph nodes. Arrival evidence and reveal evidence
  are the same evidence — this spec deliberately consumes
  the derivation #32 owns rather than minting a parallel
  "visited" store.
- **#12's law underneath everything:** Fragments and dex
  states are derived, never stored. A stored list of
  unlocked travel points would be the same anti-pattern in
  a new coat, and is refused here on the same grounds.

## Native spec — `mochiichao/fast-travel/v1` (fragment beside this doc)

- **Travel point** = a route-graph node annotated as one.
  The annotation is a proposed additive field on the node
  record (`travelPoint: true`) — proposed, because the
  graph's in-repo schema is the landing lane's to verify
  (workspace copy: `world-systems/region1-route-graph.json`;
  see STAGING.md). **Which nodes qualify is an annotation
  pass over the real R1 graph — OPEN, zero nodes annotated
  by this spec.**
- **Eligibility is derived at read time.** Node N is
  travel-eligible iff (a) N is annotated a travel point,
  and (b) the arrival evidence #32's reveal derivation
  reads for N shows the Ranger has reached N. Both inputs
  are facts the game already holds; the eligible set is a
  function of them, recomputed whenever it is shown.
- **Travel itself** moves the Ranger between two eligible
  points. Edges between them are not traversed and their
  gates are not re-tested — and this is safe *by
  construction*, not by exception list: eligibility
  requires prior arrival, so travel can only ever connect
  places the gated journey already legitimately reached.
  Sequence-breaking into an unvisited area is not a bug
  this system must guard against; its derivation makes it
  unrepresentable.
- **The clock:** travel consumes #19 time as the owner
  rules — instant vs phase-advancing is an **OPEN** ruling
  (both are documented patterns); this spec takes neither.
- **Cost:** none asserted. A currency fee (#20) is possible
  and unruled — **OPEN**; the shape ships fee-free because a
  fee field invented here would be a balance fact, and
  balance facts are the owner's.
- **Show lane:** none. Fast travel is a game-lane
  compression of journeys the show plays at full length;
  show scripts never reference it.

## Wiring

Derives over #11 (nodes, annotation pending landing
verification) using #32's arrival/reveal evidence and #12
flags; displayed through #32's map module (the map is
where a player picks a point — the module gains a travel
affordance, not a second map); time behaviour reads #19.
Save impact: none — the system's entire state is derived.

## Coverage — honest

- **Architecture: fully documented**; the derived-network
  form is this package's consistent application of the
  house derivation law to a documented pattern.
- **Contents: the annotation pass over the R1 graph, the
  clock ruling, and the fee ruling are OPEN.** The node
  annotation's target schema is flagged UNVERIFIED in
  STAGING.md until landing checks the graph's repo home.
