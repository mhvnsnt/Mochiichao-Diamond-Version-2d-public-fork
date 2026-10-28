# #298 — AMBIENT WORLD EVENTS → the world happens whether you stop or not

**What this grows.** #231 already gave the wild its
read-time texture — wild Mochi living their
territory moments, derived from the area's stock and
profiles, writing nothing. But #231's world is
wild-only and consequence-free. An open world (the
owner's essence statement) needs the human half of
that aliveness: the GTA / Red Dead stranger moment —
someone in trouble, a theft happening *now*, a duel
two Rangers started without you. This spec is that
layer: events generated from world facts, staged on
#231/#93's simulation floor, with real doors in and
a real right to walk past.

**What was studied.** Emergent-event systems in the
owner's named kin, as publicly documented: GTA and
Red Dead's random encounters (a stranger, a robbery,
an ambush — brief, unscripted-feeling, generated
from who's around and what the world knows), and the
programme's own floor (#231's derive-don't-store
discipline, #93's schedules, #145's travellers). The
kit taken: the event is *found*, not assigned; it is
small; and the world does not hold its breath while
you decide.

## Native spec — `mochiichao/ambient-event/v1` (fragment beside this doc)

- **Generation is a read, like everything alive
  here.** An ambient event is *derived at encounter
  time* from world facts: who is present by #93's
  schedules and #145's transit, what area this is
  (#297's terrain + #7 stock), the hour and weather
  (#19/#61), and what the ladder says about the
  people involved (#270's group reads, #269's bands
  as authoring inputs for NPC behaviour). Nothing is
  scheduled in a store; the same facts re-derive the
  same class of moment, and a moment nobody reached
  in time is never written anywhere — #231's
  writes-nothing law, inherited for the parts of an
  event the player never touches.
- **The event classes (closed vocabulary):**
  - `trouble` — a person or Mochi in difficulty in
    the open (hurt, stranded, cornered): helping is
    #245's rescue shape when it completes; walking
    away costs nothing but the knowledge.
  - `theft-in-progress` — a taking happening now:
    a snag attempt on someone's Mochi (#268's
    machinery, NPC-side) or a goods theft. The
    witness set is computed live (#272's flow) —
    the research floor under this class is real:
    the mod community's snag rules already refuse a
    theft with too many witnesses watching, and
    ours reads the same set the law will.
  - `duel-in-progress` — two Rangers fighting it out
    (#210's grammar, already running): joinable only
    as #210 allows, watchable under #188's contract,
    and none of the player's business by default.
  - `migration-crossing` — a moving body of wild
    Mochi crosses the Ranger's path (the #226-class
    spectacle at walking scale): a presence event,
    not an encounter — it writes nothing and cannot
    be farmed (#226's law).
  - `wild-disturbance` — #231's texture at event
    scale: a territory flare, a predator's pass —
    the wild's own business, staged close.
  - `traveller-meeting` — a #145 traveller whose road
    crosses yours with something in hand: news,
    a warning, a small exchange — the world's
    connective tissue, met on the road.
- **Intervening writes through the real systems —
  never through the event.** The event record holds
  no outcomes. What a resolution writes depends on
  what actually happened: a deed in #269's ledger
  (you helped; you stole the thief's prize; you
  robbed the victim yourself — the ledger doesn't
  care that it started as ambience), a #245 rescue
  record, a #272 witness/report chain, a #12 fact
  for an authored participant. The event is a door
  into the standing systems, and it closes behind
  whichever fact was written.
- **Walking away is a complete play.** Every event
  carries a resolution-without-you: the theft
  succeeds or fails on the participants' own facts,
  the duel ends, the traveller walks on. The world
  does not pause, scale, or repeat the moment until
  you agree to matter in it — and a consequence that
  ripples (#270 hearing of what happened in its
  town) arrives through the witness/report flow,
  not through the event remembering you declined.

## Show lane

Ambient events are the show's road grammar: the
cold-open stranger, the theft the cast walks into
mid-journey. Episodes may stage them under #82's
conservation; the game-side derivation is the shared
floor both lanes imagine from.

## Wiring

Derived from #231 (texture floor + write-nothing
law), #93/#145 (presence), #297/#7 (place + stock),
#19/#61 (hour + weather), #270/#269 (who these
people are, to the world and to themselves). Doors
into #245, #268, #210, #188, #272, #226-class
spectacles. Event classes closed; a new class is a
proposal into this file.

## Open slots

Event *contents* — the specific strangers, their
troubles, an authored participant's beats — are
content, authored per region with its cast. The
classes, the derivation, and the walk-away law are
filled in full; zero events are instanced here.

## Coverage — honest

- System: complete over the verified floor. One
  dependency is cited by commissioned subject, not
  landed text: #272's witness computation (List 28
  is mid-build in this workspace — see STAGING's
  UNVERIFIED register).
- Contents: none instanced, by design.
