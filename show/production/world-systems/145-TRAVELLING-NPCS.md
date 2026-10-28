# #145 — TRAVELLING NPC CONTINUITY → one person, many regions

**Seat in the doctrine:** a connected world is stitched
together by the people who move through it. The merchant
met in Region 1 turns up in Region 3 and *remembers you* —
or the fiction breaks. #93 built NPC schedules as
first-match timetables over one town's geography. This
spec extends that machinery across the world graph:
a traveller is one NPC whose schedule rows span areas and
regions, whose identity and memory live outside the
schedule layer (exactly as #93's law demands), and whose
meetings chain the way #37 taught appearance records to
chain.

**What was studied.** Recurring NPCs in the publicly
documented record: wandering merchants and lookers who
appear in several towns on a rotation; rivals and mentors
whose meetings are staged per appearance with the party's
state read at each meeting; and television's recurring
travellers, who carry news between otherwise separate
story worlds. The kit taken: rotation is a *schedule*,
recognition is a *flag read*, and a traveller's narrative
job — carrying hints, goods, and consequences between
regions — is content layered over those two mechanisms,
never a third mechanism.

## Native spec — `mochiichao/travelling-npc/v1` (no fragment — the shape extends #93's)

- **One record, spanning rows.** A travelling NPC has ONE
  schedule record in #93's format whose rows' locations
  may be any area in any region (or `transit` — on a route
  or sailing, #141). First-match semantics are unchanged:
  the table is not a brain; the NPC has no memory *in the
  schedule layer*. Cross-region rows simply have longer
  shadows: a traveller in Region 3 on a given day is, by
  the same first-match read, *not* in Region 1 that day —
  absence is derived, never scripted twice.
- **Continuity lives in flags.** What the traveller
  remembers — meetings, favours, the side story (#138)
  they own — is #12 facts, read by dialogue at each
  meeting (pointer-only pairing, per #12). A first meeting
  in Region 3 by a Ranger who skipped Region 1 falls to
  the never-met rows (#139's rule: no line whose flag
  hasn't been earned). The traveller is the same record
  in every region; there is no per-region copy to drift.
- **Travellers are a discovery route.** A traveller's
  dialogue may set a hint flag for a #137 connection —
  they are one of `hintSources[]`' goods: tales of where
  they've been. A traveller physically *leading* the
  Ranger somewhere is a #138 side story (travel case) with
  the traveller as owner, not a schedule behaviour.
- **Transit is a place.** While a row says `transit`, the
  NPC is encounterable on the connection itself — the
  border zone (#140), the ferry (#141) — which is where
  the world's connective scenes naturally happen. Their
  encounters there are world-open class (#139).

**Show lane:** travellers are the season arc's connective
tissue (#82): a recurring traveller lets a later season
open in a new region with one familiar face already
there, under entry = exit conservation (the traveller
carries *knowledge and continuity*, never a permanent
party change). The stopped-thing law binds them too: a
traveller may hint at the Dark Forest; no traveller's
tale answers it.

## Wiring

Schedules extend #93 (same format, wider rows); identity
and memory join #12; meetings chain per #37's appearance
discipline; hint role joins #137; escort role joins
#138; transit presence joins #140/#141; early-meeting
behaviour joins #139. Human records stay under #33's
model-sheet standard — a traveller's sheet is one sheet;
their wardrobe may vary by region via #116's outfit sets
(field/dojo/casual contexts are the traveller's natural
vocabulary).

## Coverage — honest

- **Architecture: fully specified** (one record, spanning
  rows, flags for memory, three named narrative roles).
- **Instances: zero.** No traveller is named or routed:
  who travels, their circuits, their goods and tales are
  content — OPEN. In particular, whether any *canon* NPC
  (a dojo master, Assistant Mochiko, a Syndicate figure)
  travels is an owner/content decision this package does
  not presume; Falk's falconry-field life makes him an
  obvious *candidate* shape, recorded here as a question
  for the content lane, not as an assignment.
