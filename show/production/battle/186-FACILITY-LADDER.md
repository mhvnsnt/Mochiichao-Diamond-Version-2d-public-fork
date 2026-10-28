# #186 — FACILITY LADDER SYSTEM → the endless run, on authored rungs

**Doctrine seat:** #86 founded the postgame
facilities — the streak core (RUN / SET of 7 / RECORD
derived from run history / HEAD milestones), level
normalisation, and the format-slot table — and left
further slots OPEN: *"a facility is added by ruling,
with its one bent rule stated in one line."* The
ladder is that addition, and its bent rule is: **the
run has no set boundary — it continues until a loss,
and the opposition escalates by authored rung bands.**
This package specifies the ladder over #86's streak
machinery and #94's seeded generator. It is not a
tournament (#151), not a versus ruleset (#109), and
joins neither — stated so landing cannot miswire it.

**What was studied.** Endless/asymptotic facility
formats in the publicly documented record: a run that
continues past set boundaries until the first loss;
difficulty expressed as *which pool tier and band the
generator draws from* at each depth — authored
escalation, never a function of the visitor's team;
records kept per format from run history; the loss
itself costing nothing but the run. The kit taken:
rung banding, seeded generation, append-only run
records, and the clean loss.

## Native spec — `mochiichao/facility-ladder/v1` (fragment beside this doc)

- **The slot (proposed into #86's table).** `ladder`
  joins #86's facility rule-set slots as a format
  whose run is a single sequence of battles — **rungs**,
  numbered from 1 — with no SET boundary: the run
  ends at the first loss, or when the Ranger withdraws
  (a withdrawal is a recorded run end, neither a win
  nor a loss — the record says which).
- **Rung bands (authored, per #52's laws).** A band
  table (data) maps rung ranges to **#94 pool tiers +
  opponent level bands**. The table obeys #52 B1/B2
  verbatim: bands never read the visitor (no party
  level, no win history, no playtime), and there is
  **no interpolation** — a rung takes its band row
  whole, so the owner can read every fight the ladder
  can produce at every depth. Escalation is authored
  or it does not happen. Band contents are OPEN (no
  facility exists in canon — #86/#94's state).
- **Generation.** #94's contract verbatim, with
  `round = rung`: parties drawn from the rung's pool
  tier under #94's constraint order (banned list → no
  duplicate species → anatomy sanity → variant roll);
  the seed derives from the run record, so **every
  rung's party is reproducible** — a disputed ladder
  is replayable, exactly as #94 demands of streaks.
  Generated parties belong to the facility; the
  ladder never generates a named Ranger (#94's
  boundary).
- **The visitor's side.** Entrants are the Ranger's
  own individuals (#80 records — variance and RULED
  deviations ride along, per #86), or rental snapshots
  when the ladder run is hosted in a rental format
  (#159 — snapshots live inside the run record and
  expire at run end, *including at the loss*). #86
  normalisation applies unchanged (fixed band, value
  OPEN). The ladder escalates **opposition only**: the
  visitor's derived levels and stats are never scaled,
  and are read for nothing but normalisation.
- **The loss (and the record).** A loss ends the run
  immediately. The run record appends to the facility's
  run history — the same stored-facts home #86's
  RECORD derivations read:

  ```
  { facilityId, format: "ladder", rungsCleared,
    endKind: loss | withdrawn, seedLine,
    partyIds: [...], lostAtRung: <n | null> }
  ```

  Records are **append-only** (#126's discipline: a
  run, once recorded, is never edited or deleted).
  Best-ladder marks, clear counts, and completion
  surfaces derive from run history at read (#14's
  derive-don't-store law, #86's RECORD rule). **A
  loss writes nothing else** — no roster write, no
  honour loss, no progress change, no penalty of any
  kind; the run record is the whole consequence.
- **Gain.** Ladder battles produce **no gain events**
  (#177's structural exclusion: levels are normalised;
  the record is the reward).
- **Milestones.** #86's HEAD pattern may seat heads
  at ladder rungs — milestone rungs are band-table
  data, and every head is a casting/canon decision
  (#86's OPEN slot, inherited unchanged: none is
  asserted, named, or implied here). Head-win honours
  ride #86's symbol fiction, which remains OPEN.

## Show lane

None. Facilities are game systems (#94's line); a
show visit to a facility uses authored parties and
story stakes, never ladder records.

## Wiring

The slot is proposed into #86's rule-set table (its
home disposes); generation is #94's contract (no
second generator); run history joins the store #86's
RECORD derivations already read, under #96's
absent = default arrival; band tables sit with #52's
band data (authored-band home); rental hosting reads
#159; the no-gain exclusion is cited in #177.

## Coverage — honest

- **Architecture: fully documented** (endless runs,
  authored escalation bands, seeded generation,
  append-only records are the published facility
  pattern, re-expressed over this programme's own
  verified machinery).
- **Contents: no facility, no bands, no heads.** Which
  isle or building hosts a ladder, every rung band,
  and every milestone are canon/balance content #86
  already left OPEN. The yield is the format: an
  endless run whose every fight is authored-readable
  and whose loss costs exactly one record line.
