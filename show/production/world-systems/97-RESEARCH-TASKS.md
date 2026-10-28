# #97 — POKÉDEX RESEARCH TASKS → Mochiioteca research levels

**What was studied.** The research-task architecture added by
the reference series' open-area entry, as publicly documented:
alongside the binary seen/caught states, each species carries a
list of **field tasks** (observe it, feed it, see it use a move,
defeat it, catch a number of them…), each task tallies a count,
the tallies sum into a per-species **research level**, and the
level — not the catch alone — is what "completing" that species'
entry means. The kit taken: per-species task lists, tallied
counts, a derived level, and the design fact that research
rewards *attention* (watching, feeding, tracking) and not only
capture. No task lists, thresholds, or text are copied.

## The line this spec must not cross (#14 owns completion)

MOCHIIOTECA-COMPLETION (#14) fixed the truth and this spec
**extends it, never duplicates it**:

- The discovery **states** (unseen / seen / kept) and everything
  derived from them (counts, percentages, the reward ladder) are
  #14's. Research adds **no fourth state** and no second
  completion percentage.
- #14's law is *states are data, counts are derived*. Research
  honours the same split one level down: **task tallies are
  stored facts; research levels are derived at read time, never
  stored.** A tally is a fact like a flag (this Ranger has fed
  Kittember three times); a level is a count over facts, and a
  stored level that could disagree with its tallies is the exact
  bug farm #12/#14 exist to prevent. (Same distinction #96's save
  spec draws: the save stores facts; everything countable is
  counted fresh.)

## Native spec — `mochiichao/research/v1` (fragment beside this doc)

- **Task kinds — closed vocabulary.** A research task is
  `{taskId, speciesId, kind, target}` where `kind` is one of:
  - `observe` — witness the species in the field (a spawn-table
    encounter, #7, that lasts / is watched, not just triggered)
  - `feed` — offer food in the field or Garden (care vocabulary,
    #28/#39; the food item resolves through #31, effect OPEN)
  - `battle-witness` — see the species *use a move* in a living
    fight (the move resolves by id through the moves registry;
    the witness is of the performance, so anatomy variance #9
    is what is being researched)
  - `track` — read its trace: footprint grid / trace kind read
    through the tracking mechanic (#89), including `foot_type:
    none` species whose trace is Frost-class, not a print
  - `care` — a Garden care act logged in the individual's
    careLog (#28: careLog is truth, profile derived)
  The vocabulary is closed for the same reason #69's predicate
  vocabulary is closed: a task kind outside this list would need
  state no system tracks, and is rejected at design review.
- **Tallies** live in the save's `research` section as
  `{speciesId: {taskId: count}}` — facts only. Counts increment
  on the event, from the wired source system; no system writes
  another system's tally (feeding writes via the care path,
  battle-witness via the battle path).
- **Research level** — derived: `level(species) = f(tallies vs
  targets)`, computed at read time wherever displayed (the
  Mochiioteca entry page, #81's device behaviour reads it for
  its feedback states). The function's shape (per-task weights,
  level bands) is specified as slots; **all numbers are OPEN**
  — thresholds and weights are an owner/game-design pass,
  exactly as #14 left its ladder's prizes OPEN.
- **What research unlocks** — by #14's division of labour,
  research **grants nothing world-shaped**. Proposed kind only:
  a species' research-complete flag feeds #14's ladder as one
  more milestone *kind* (the device remembers you studied it),
  and entry prose depth in the Mochiioteca (the long-bio page,
  #48's style) may key off research level — **both PROPOSED,
  contents OPEN**, landed open for the owner's call.

## Show-side echo

Research is the show's natural history grammar: Mochiko
*studying* Wispkin — watching, tracking Frost, learning by
attention before any battle — is a research-task episode told
without UI. Episode production notes may tag a species'
research beats with these task kinds so the show and the
Mochiioteca describe the same acts in the same words (two-lane
law: same truth, each lane in its own medium).

## Wiring

Consumes #7 (encounters), #28/#39 (care acts + careLog), #9
(move performances witnessed), #89 (trace reading), #31 (feed
items). Feeds #14 (milestone kind, proposed) and #81 (device
feedback). Save section registered in #96's payload map at
landing (facts section, checksummed like the rest).

## Coverage — honest

- **Architecture: fully documented** publicly; the
  tally→level derivation is the documented shape.
- **Contents: zero instanced.** No per-species task list exists
  in canon; every species' tasks, targets, weights, and any
  reward are OPEN. This spec is the machine and the vocabulary;
  canon supplies the lists.
