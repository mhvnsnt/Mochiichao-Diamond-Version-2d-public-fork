# #277 — GENERATIONAL PROTAGONIST ROTATION → one world, many leads, in parts

**OWNER'S CANON (Jamar, 2026-10-27) — this system exists
because of it:** in later generations (the Gen 3/4 era),
the story can **switch protagonists** — the way Pokémon
and Yu-Gi-Oh! change leads between generations, and the
way JoJo is built from **parts**: each part follows its
own lead, feels like its own story, and all of it stands
in **one shared world** (the owner's example: Steel Ball
Run against the early JoJo parts — very different, same
universe). This spec is the parts structure itself: what
a part is, what carries across one, and what never does.

**What was studied.** Generational lead changes in the
publicly documented record: Pokémon's per-generation new
protagonists in a continuing world; Yu-Gi-Oh!'s series
handoffs; JoJo's parts (a lead, a place, a tone per part;
the world and its history continuous, earlier parts'
people and deeds still true in later ones); Sonic
Adventure 2's character rotation (held for #282, the
within-part half of the same idea). The kit taken is
JoJo's: **a part is a lead + a place + a span of the one
world's history** — the world is the constant, the lead
is the variable. No characters, settings, names, or
text are copied from any of it; the parts named here are
Mochiichao's own generations.

## Native spec — `mochiichao/part-rotation/v1` (fragment beside this doc)

- **The part record** lives in canon docs (the season
  canon map's family), one per part:
  - `partId` / `generation` — the part's number and the
    generation it belongs to (Gen 1 is the current
    canon spine; later parts are Gen 3/4-era per the
    owner's brief — which generation each future part
    is, is canon content, OPEN per part).
  - `lead` — the ONE Ranger the part follows (a #98
    identity reference; for a part not yet cast, the
    slot stands open — a part record with no lead is a
    plan, not a part).
  - `span` — the part's place in the world's history:
    its sector(s)/region(s) (#137 atlas references) and
    its story span (the canon beats it covers). A part
    may overlap another part's time and place; overlap
    is a fact the records state, not a contradiction
    (#282 is the machinery that runs inside it).
  - `entryWorldState` — **quoted, not invented**: the
    world facts the part opens inside of — the previous
    part's exit facts (#286's handover writes them),
    the world's standing records (#126's Hall, the
    regions' states under #127), and every earlier
    deed that is still true. The part inherits the
    WORLD. That is the whole inheritance.
- **What a part never inherits: the previous lead's
  personal records.** The old lead's party, their #80
  individuals, their licence standing, their List 28
  morale/reputation state — none of it transfers to the
  new lead, in either lane. Those facts do not vanish;
  they stay attached to the person they belong to, and
  if that person appears in the new part, they appear
  WITH them (#283). A new lead starts as a new Ranger
  starts: their own record, in a world that remembers
  everyone else's.
- **World continuity is carried by the systems that
  already carry it.** Places persist because the world
  is one connected world (#127: nothing resets, ever).
  History persists because records are append-only
  (#126's law, generalised in #286). People persist as
  world people (#93's named NPCs, #145's travellers —
  a part boundary does not clear anyone's schedule).
  The rotation spec founds no continuity machinery of
  its own; it is the **index** that says which lead,
  which span, which inherited facts — and the rule
  that the index is a canon fact, written once per
  part, never derived from play or ratings or air
  order after the fact.

## Game mirror

The game's same-world opening is #240's **New Ranger**
flow read under this doctrine: a new campaign is a new
person starting in the world as it stands — #240's
postcard already draws a world with history (its
derivations read the save's facts), and #146's one-world
save is the architecture underneath (one payload, no
per-generation fork; net stored change from rotation:
**none**, exactly as #146 proved for regions). A game
campaign keyed to a later part is authored content on
that architecture — its starting place and opening beats
are the part's canon span, not a new save format.

## Show lane

The part record is a show-first object: season planning
(#82) anchors each part's arcs to its span and lead the
way arcs anchor to canon beats today. #82's conservation
law gets its part-scale reading in #286; inside a part,
#82 is unchanged.

## Wiring

Reads: #127 (one world, nothing resets), #146 (one
payload), #240 (the New Ranger opening), #126 (history
as records), #82 (arc planning anchors), #93/#145
(people persist), #98 (lead identity). Writes: the part
records themselves, in canon docs only. Cites List 28
(the engine later parts run on) without building on its
unlanded internals — see STAGING's UNVERIFIED register.

## Open slots

**Each future part's generation, sector, span, and
lead — canon facts, one part at a time** (the Gen 3/4
thief's part is the briefed example; his NAME is #278's
headed slot, not this file's). Season/part lengths are
standing owner canon. No mechanic is left open: the
structure above is complete with every part slot empty.

## Coverage — honest

- Architecture: the parts model is the owner's named
  structure (JoJo/Pokémon/Yu-Gi-Oh! handovers,
  publicly documented shapes), seated entirely on
  verified continuity machinery (#127/#146/#126).
- Contents: zero parts beyond Gen 1 are instanced —
  no future lead is named, placed, or cast here.
