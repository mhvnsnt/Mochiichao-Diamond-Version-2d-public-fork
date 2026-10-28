# #129 — LEVEL-UP MOVE LEARNING → learnset prompt flow (game lane)

**What was studied.** The level-up learning flow of the
reference games, as publicly documented: at a growth
threshold the learner is offered a move from its learnset;
if its move set is full, the player chooses a slot to
replace, may decline (the move is not learned), and in
later documented forms may change their mind at the prompt
before committing. Beside it, the **relearn** pattern: a
service that re-offers moves the learner once passed or
replaced. The kit taken: learning is a *flow with a
decision point*, not an automatic write — the offer, the
choice, and the decline are all recorded shapes. No text,
layouts, or move data are copied.

## Canon anchors (verified)

- **Learnsets exist for all 47 core species** (learnsets
  47/47, verified in the audit and in #101: "47/47
  learnsets exist"). The learnset is the flow's source:
  rows keyed by the growth threshold at which the offer
  fires (the core data's level-keyed rows — the threshold
  *field* is the data's own; this spec names no stat or
  level value).
- **Moves are registry rows** (machine registry, PR #366;
  core `moves.json` the smaller verified set). The flow
  references move ids only.
- **Display names are #23 lookups** (TEXT-ENGINE: display
  names always resolve at render). Consequence this spec
  exists to state: a rename-on-use landing mid-game can
  never break a pending or historical learning record,
  because records store ids and the prompt renders names
  at display time — the rename law is safe *inside* the
  flow, not just around it.
- **Move sets live on the individual**, under the roster
  records (#80's individual record family; #106's storage
  reads the same records). The flow writes to the
  individual, never to the species.

## Native spec — `mochiichao/learnset-flow/v1`

The flow is a small state machine per learning event:

1. **OFFER** — a learnset row's threshold is crossed; the
   offered `moveId` is read from the row. If the
   individual already knows the move, no event fires (the
   documented duplicate rule).
2. **SPACE CHECK** — if the individual's move set has an
   open slot (set capacity is the move-data layer's own
   constant — not asserted here; the flow reads it), the
   move is added and the event closes as `learned`.
3. **DECISION** — if the set is full, the prompt presents
   the current set (rendered by #23 lookup) and the offer.
   Legal exits, closed vocabulary:
   - `replace` — a chosen known move is overwritten; the
     event records `{learned: moveId, replaced: moveId}`.
   - `decline` — the offer is refused; event records
     `{declined: moveId}`. A decline is a *fact about the
     individual*, not a dead end — it is what makes the
     move re-offerable below.
4. **RECORD** — the event appends to the individual's
   learning history (facts, per #96's facts-vs-derivation
   law; the current move set is the latest state of the
   record, history is never rewritten — a replaced move
   stays in history as replaced, which is what relearn
   reads).

**Relearning joins #101, it does not duplicate it.** The
relearn pool for an individual = learnset rows whose
threshold has passed and whose move is not currently
known — *derived* from the learnset + history at read
time, never stored as a list. #101's tutor service is the
documented home of the relearn *service* (a person who
re-teaches); this flow supplies the pool derivation its
records need. Whether the relearn service exists as a
#101 tutor entry, at what cost — #101's OPEN slots,
inherited unchanged.

**Edge rules, stated not assumed:**

- **Signature moves** (#131) enter the learnset like any
  row unless #131's designation marks them otherwise —
  the flow is designation-blind by design; signature
  handling lives in #131.
- **Evolution-boundary offers** (a move offered at the
  same threshold as a growth event) sequence as data
  order in the learnset rows; this spec asserts no
  priority rule of its own — if the data layer fixes one,
  the flow inherits it. **OPEN** if the landing audit
  finds no such rule in the real data.
- **The flow is game-lane only.** The show has no levels
  and no prompts: a show Mochi's new move is a #101
  training-grammar event, full stop (two-lane doctrine).

## Wiring

Reads learnsets (core data, verified) + the move registry
via #101's join; writes individual records (roster family,
#80/#106 neighbourhood); renders via #23; history rides
#96's save payload as facts on the individual record.
Relearn pool is consumed by #101's service records.

## Coverage — honest

- **Architecture: fully documented** (offer/decide/record
  across the reference eras, incl. the forget-and-relearn
  pair).
- **Contents: flow only.** Move-set capacity, threshold
  values, and every species' rows are existing data
  questions, not this spec's to assert; the evolution-
  boundary priority is OPEN pending the landing audit of
  the real learnset data.

**Landing audit (2026-10-27, real data):** evolution-boundary offer priority was checked against src/data/core/learnsets.json + species.json — no species in the current data learns a move at its exact evolution level, so the boundary case does not occur in the data; the priority rule remains an OPEN slot for when a case is authored, recorded as audited-not-assumed.
