# #98 — TRAINER CARD / BADGE CASE → Ranger licence & Fragment case

**What was studied.** The league record architecture of the
reference games, as publicly documented: a single **trainer
card** that carries the player's identity and standing (name,
id number, start date, money, play time, badges displayed), and
a **badge case** — a dedicated container/view that holds the
league tokens in order and is shown, as an object, at gates and
in ceremonies. The architecture's load-bearing property: the
card is a *view over the save's facts*, re-rendered wherever it
is shown; the badges in the case are the same progress facts the
gates test, not a second inventory. The kit taken: one identity
record, standings as renderings, the case as a ceremonial view
of progress. No card layouts, badge designs, or text are copied.

## Canon vocabulary (display-layer law applies throughout)

Badges in Mochiichao are **Fragments**; the competitors are
**Rangers** ("trainer" was never canon — it survives only as a
data-layer seed label, and never on a player-facing surface).
Every player-facing string in this system resolves through the
text engine (#23): names are lookups, never literals, so the
rename law holds on the licence exactly as everywhere else.
Region display name is **Iridescence**; the production name
stays in production docs only.

## Native spec — `mochiichao/licence/v1` (fragment beside this doc)

**The licence record** stores identity facts and nothing else:

- `rangerId` — the save's identity key (joins #96's `meta`
  section; the licence is a rendering of save facts, not a
  second store)
- `displayName` — resolved via #23 lookup at render time
- `partnerId` — reference to the partner individual record
  (#80); a reference, never a copy
- `issuedBeat` — the `story.*` flag of the beat that issued the
  licence (the opening's handover shape; **which beat issues it
  is OPEN** — canon fixes the Mochiioteca handover, not a
  licence ceremony)
- `originPlace` — a route-graph node id (#11), rendered by
  lookup

**Standings are derived, never stored on the licence:**
fragments held (popcount over `progress.*`, #12), dex counts
(#14's derivations), gauntlet standing (#100), research
summaries (#97). The licence *displays* these by calling the
owning derivations at read time. A licence that stored its own
fragment count would be a second ledger — #45 already ruled
this out for the circuit ("the circuit reads flags; it keeps no
second ledger"), and the rule is inherited verbatim.

**The Fragment case** is a view specification, not data:

- One slot per dojo, in circuit order, rendered from the dojo
  records (#30 encounter records / #45 circuit entries): a slot
  is **lit** iff its `progress.dojo_r1_NN_clear` flag exists,
  dim otherwise. Holding a Fragment *is* the flag existing —
  there is no fragment item, no fragment inventory, nothing to
  store.
- The case is the object gates and ceremonies *show*: Victory
  Route's gate (#11/#45) reads the same flags the case renders,
  so the case can never claim a Fragment the gate would deny.
- Case presentation (materials, arrangement, the physical
  object's design) is **OPEN** — the same class of owner
  decision as the Mochiioteca's physical design (#81): the
  behaviour and data are specified; the object's look is the
  owner's to set.

**Licence tiers / ranks** — the reference games promote the
card itself as standing grows. Mochiichao format: a `tier`
field **derived** from derived standings (fragments + gauntlet
standing), tier thresholds and names **OPEN**. The field ships
as a derivation slot, not a stored rank.

## Show-side echo

The case is a prop with a rule: in the show, a Ranger opening
the case is the circuit drawn for the audience — Fragments
lighting a route, the same graphic family #45 specified for
keeper-tech UI. Show scripts reference case state by the same
flag ids, so a script can never show a Fragment the game-side
record hasn't earned (entry = exit conservation, #82, applies
to props too).

## Wiring

Reads #12 flags (fragments, issue beat), #14 derivations (dex
counts), #30/#45 (dojo order + records), #11 (place lookups),
#23 (all display strings), #96 (`meta` section is the identity
home). Consumed by #100 (gauntlet standing display) and #90
(media may quote licence standings — display-layer names only).

## Coverage — honest

- **Architecture: fully documented**; card-as-view and
  case-as-progress-render are the documented pattern.
- **Contents: identity shape fixed by canon joins; ceremony,
  case design, and tier table OPEN.** No licence-issuing beat,
  rank name, or case design exists in canon, and none is
  invented here.
