# #157 — MULTI-BATTLE FORMATS → doubles and partner battles as format records

**Doctrine seat:** a battle with more than two combatants
is not a new battle system. It is #109's format record
grown a second axis — *who controls each slot* — laid over
the same turn machinery (#10's flow, #17's pipeline,
#18's scorers). This spec builds that axis. It instances
no formats.

**What was studied.** Multi-combatant battles in the
publicly documented record: doubles (two active slots
per side, one controller per side), multi battles (the
player and an allied partner each field one slot against
two opponents), spread moves that strike several targets
at reduced effect, and partner trainers who bring their
own parties and fight them with simple AI. The kit
taken: the format record gains sides-and-slots geometry
and a control map; the damage pipeline and the turn flow
do not change shape at all — only the number of bodies
they are run over.

## Native spec — `mochiichao/multi-battle/v1` (fragment beside this doc)

- **A multi-battle format is a #109 ruleset plus a
  `sides` block:** `{sideA: {slots: n, controllers[]},
  sideB: {...}}`. Each slot's controller is one of
  `ranger` (the player), `partner-ai`, or `opponent-ai`.
  Singles is the degenerate case (1 slot, `ranger` vs
  `opponent-ai`) and stays #109's home ground — this
  spec never redefines it.
- **Clauses are inherited, not forked.** A multi format
  lists clauses from #109's closed vocabulary verbatim
  (species-clause, item-clause, machine-moves,
  mythical-class under its stated dependency). Team
  validation runs #109's validator **per entrant**: a
  partner's party validates against the partner's own
  individuals, with the same party-source check
  (#106 `location == party`).
- **Target rules.** Every combatant is targetable under
  the format's geometry (own side, opposing side, any
  slot a move's targeting names). A multi-target move
  resolves **per target through #17's staged pipeline
  unchanged** — if a spread modifier exists, it is a
  constant in #17's pipeline, owned by #17's file; this
  spec names the hook and asserts no number.
- **Partner AI is #18, scoped.** A partner fights with
  the #18 scorer stack, under the flag set of its
  authored class (a named Ranger partner uses their
  class; an unnamed facility partner defaults to the
  `ranger` set). Three partner-specific constraints,
  stated as rules of the format, not new scorers:
  (1) the partner reads the whole field — both opposing
  slots and its ally's state — when its scorers run;
  (2) the partner never spends the Ranger's bag (item
  use, if any, is governed by #165's class flag against
  the partner's own stock); (3) the partner's switching,
  if its class set includes S-SWITCH, switches its own
  party only. No `partner` class row is minted here —
  if landing wants one, it is proposed into #18's file,
  which owns the class table.
- **Flow.** #10's states hold verbatim. `COMMAND_RING`
  iterates over Ranger-controlled slots only (partner
  and opponent slots never wait for input);
  `LIVING_FIELD` carries the additional bodies as
  presentation (animscript-class loops, #9/#147 owe the
  multi-body variants); `RESOLUTION` drains one queue
  for the whole field, in the format's stated order —
  order vocabulary is the format's own slot, values
  OPEN.

## The doctrine line (restated because formats tempt it)

#18's scorers and this spec's partner AI are **game-lane
only**. In the show, Mochi fight with their own agency
under the autonomous-action doctrine, and Rangers
sometimes command; no scorer output, clause, or format
geometry may choreograph a show fight (#109 states the
same line for versus). A show doubles battle is staged
from story, in #30/#100's encounter grammar — this
format is, at most, the shape of the poster.

## Wiring

Ruleset home: #109's fragment gains the `sides` block by
landing edit in #109's own file (this package proposes,
#109 disposes). Parties validate via #109's validator;
partner parties are authored records in the #37/#30
pattern; facilities that host multi formats read #86's
format slots (`streak-standard` already names doubles);
turn machinery is #10 + #17 untouched.

## Coverage — honest

- **Architecture: fully specified** (geometry, control
  map, inheritance of clauses and validation, partner
  constraints, flow preservation).
- **Instances: zero.** No format beyond singles is
  instanced; no partner roster exists; the spread
  constant (if any) is #17's open balance slot; the
  resolution-order vocabulary is OPEN.
