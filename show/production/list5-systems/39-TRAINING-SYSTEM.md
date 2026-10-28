# #39 — TRAINING STRUCTURES (teardown → native spec)

**What was studied.** Effort-training systems in the reference
games, as publicly documented: beneath the visible level sits a
**hidden effort ledger** — training accrues invisible points per
stat from the *kind* of work done (which opponents faced, which
drills run), the ledger is capped per-stat and in total, and its
effect only shows as a steeper growth curve. Two design lessons
matter more than the arithmetic: (1) effort is *typed* — what you
train against shapes what grows; (2) the ledger is per-individual,
so two of the same species raised differently are genuinely
different creatures. Mochiichao's version keeps both lessons and
re-grounds them in the Garden's care loop, which canon already
has: feeding rounds, check-ins, the Manual.

## The native model — care-typed effort

- **The ledger lives on the individual, not the species.** Core
  species data (stats, learnsets, growth edges) is unchanged; a
  kept Mochi carries an `effort` block in its individual record
  (the same individual record the rival grammar's `individualId`
  points at, #37 — one individual, one record, both lanes).
- **Effort is earned in care vocabulary, not combat vocabulary.**
  Accrual sources are the Garden's own activities, each typed to
  the stat family it feeds:

  | Source (canon activity) | Feeds | Note |
  |---|---|---|
  | Feeding rounds | vitality family | Manual-run; quality of food is a data field, values OPEN |
  | Check-ins / handling | bond family | Also the accrual source for `bond`-class growth edges (#8) |
  | Garden work & play | body family | Includes the species' signature motion practised as play |
  | Outings / route walks | sense family | Area-typed: an outing's area id comes from the route graph (#11) |
  | Sparring (living-fight practice) | battle family | Show doctrine applies: practice fights are autonomous first, directed second |

  The stat families above are *slots named by function*; mapping
  them onto the six core stats (`hp/atk/def/spa/spd/spe`) is an
  owner/lane decision recorded in the block's `familyMap`, which
  ships **OPEN** — this spec does not assert the mapping.
- **Caps are shape, not numbers.** The block carries
  `perFamilyCap` and `totalCap` fields; both ship `null`. The
  *rule* is specified (caps exist; hitting the total cap is the
  individual's "fully raised" state and is a story-visible event),
  the values are OPEN.
- **Bond is a trained quantity here, not a mood.** `bond`-class
  evolution edges already exist in the evolution vocabulary (#8,
  zero asserted instances). Training is where their operand
  (`{bondCount: n}` in the edge's trigger shape) would accrue —
  from check-ins and shared outings — which is what makes a
  bond growth *earned in data* rather than declared in prose.
  No bond thresholds are set by this package.
- **No grinding theatre in the show lane.** The show never depicts
  ledger-farming; it depicts the care the ledger counts. A show
  training montage is staged from the accrual sources above
  (feeding, check-in, play, outing, sparring), in that vocabulary —
  the numbers stay in the game lane where they belong. Two lanes,
  one truth: the creature the audience watches being cared for is
  the creature the data says grew.

## Data shape (no new store)

The effort block extends the individual record; it is specified
here in prose because its home (the individual-record schema) is
a game-lane file this package does not own:

```json
"effort": {
  "familyMap": null,              // OPEN: family -> core stat mapping
  "accrued": { "vitality": 0, "bond": 0, "body": 0, "sense": 0, "battle": 0 },
  "perFamilyCap": null,           // OPEN
  "totalCap": null,               // OPEN
  "fullyRaised": false,           // derived: total accrued >= totalCap, once set
  "history": []                   // {storyBeat, source, family, amount} — amounts OPEN-scale
}
```

`history` entries cite the event flag (#12) of the activity, so a
creature's raising is auditable against the story — the same
audit-trail discipline as capture attempts (#38).

## Wiring

- Consumes: **learnsets** (training is also how tutor/level moves
  are *practised into reliability* in show terms; data-side, move
  acquisition stays exactly where core data puts it — training
  changes no learnset), **evolution edges (#8)** (`bond`/`growth`
  operands accrue here), **route graph (#11)** (outing areas),
  **spawn tables (#7)** (sparring partners are area-legal species).
- Feeds: **rival grammar (#37)** — a rival's `growth-proof` slot
  diffs two appearances; the effort block is what makes that diff
  explainable rather than asserted.
- The **completion loop (#14)** does not count effort. Raising is
  not collecting; the Mochiioteca counts meetings and keepings,
  never care. (Deliberate separation, stated so nobody wires it
  later by accident.)

## Coverage — honest

- **Architecture: fully documented.** Typed hidden ledgers with
  per-stat and total caps are the publicly documented
  effort-training pattern; the per-individual consequence is its
  best-known property.
- **Contents: shape only, by design.** Canon gives the care loop
  (feeding rounds, check-ins, the Manual) and the `bond` edge
  vocabulary. It gives no numbers, no stat-family mapping, and no
  accrual rates. Every value in this spec is OPEN; what is
  finished is where effort lives, what earns it, and what it may
  and may not feed.
