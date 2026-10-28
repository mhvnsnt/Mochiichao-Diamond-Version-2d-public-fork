# #158 — HORDE BATTLES → many wild opponents, from the tables as they stand

**Doctrine seat:** a horde is an encounter-roll outcome,
not a new table. The spawn tables (#7) already say which
species live in an area and at what weights; a horde is
what happens when one roll is allowed to bring several
of them onto the field at once. This spec defines the
composition and its handling. It rewrites no table row
and instances no horde.

**What was studied.** Horde/swarm encounters in the
publicly documented record: a single encounter produces
a group (classically five) of wild creatures drawn from
the area's own population, usually of one or two species;
the player fields fewer combatants than the horde holds;
experience is shared across the party; and capture is
restricted until the group is thinned — you cannot take
one member out of a surrounding pack, which makes the
fight's shape (thin, then take) legible. The kit taken:
roll-time group composition over existing rows, the
thin-then-take capture rule, and battle-end learning
treated as one event per participant.

## Native spec — horde composition over #7 (record shape in prose; no fragment)

- **Eligibility is a table-level field, not a row
  edit.** A #7 area table gains a proposed slot
  `horde: null | {size}` beside its slots — null (the
  universal current state) means the area never hordes.
  The field is proposed into #7's schema home at
  landing; until a table carries it, no horde can roll
  there. Size values are data; none are set here.
- **Composition at roll time only.** When a horde
  rolls: one slot is drawn from the table by its
  weights as the lead; the remaining members are drawn
  from the **same table's** slots, weights renormalised
  over the eligible set — the horde is the area's own
  population, so a horde can never contain a species
  the table doesn't stock (the roster-binding law,
  encounter form; #84's audio twin and #152's behaviour
  twin are the same law in other media). Time/weather
  discriminators on slots (#7's `timeOfDay`, `weather`,
  #111's `rodTier` posture) apply to horde draws exactly
  as to single draws.
- **Levels** come from each drawn slot's own
  `minLevel`/`maxLevel` band — hordes are authored by
  the table's bands, never scaled to the visitor
  (#52's law, restated for groups).
- **The battle** runs on #157's geometry (one side
  holds many slots, all `opponent-ai` under #18's
  `wild` class) and #10's flow: `INTRO` admits the
  group, `LIVING_FIELD` carries group presentation,
  `RESOLUTION` is one queue. No new states.
- **Capture under #38 — the thin-then-take rule.** A
  capture attempt is legal only when exactly one
  opposing individual remains on the field. While more
  remain, the attempt is refused at command time with
  the refusal shown (legibility is #38's requirement,
  applied here: the player always knows *why*). When
  legal, the attempt runs #38's staged checks against
  the remaining individual, unchanged.
- **Learning at battle end.** Each Ranger-side
  participant in the battle produces one battle-end
  learning event, consumed by #129's flow (offers,
  relearn pool) exactly as after a single battle. **The
  gain arithmetic behind "level" is not specified by
  this package or any earlier one** — no experience
  system exists in Lists 1–16. This spec fixes the
  interface (one event per participant, horde size is
  an input the future system may read) and registers
  the absence in STAGING rather than inventing a
  formula or a split rule.

## Show lane

A horde in the show is a staging problem, not a system:
a group of wild Mochi behaving per #152's wild view
(sociality: group/colony species horde-read naturally;
a solitary species in a horde is a board-stage flag).
No table, roll, or capture rule from this spec appears
on screen.

## Wiring

Eligibility field proposed to #7's schema; composition
reads #7 rows + #61/#19 state for discriminators;
geometry from #157; AI from #18's `wild` class;
capture from #38; learning events into #129; balance
review under #52 (horde bands are encounter bands).

## Coverage — honest

- **Architecture: fully specified** (eligibility,
  composition, capture rule, flow preservation).
- **Instances: zero** — no area carries the horde slot;
  sizes are unset data.
- **One absent system, named:** experience/gain
  arithmetic does not exist in the programme yet; this
  spec's learning interface is written to receive it.
