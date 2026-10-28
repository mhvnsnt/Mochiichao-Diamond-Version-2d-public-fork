# #348 — ATTEMPT DEEDS → the ledger counts what you tried to do

**Where this starts.** #269's table already holds
one attempt row — "Attempt a steal (failed snag),
−3" — and its addendum note pins down what that
row means: because every snag throw is
confirmation-gated (#268/#347), the attempt row is
the price of a *deliberate* attempt, never an
accident. This spec generalises that seed into the
attempt class: how tries are scored across the
deed vocabulary, what witnesses make of a try, and
the wall between an attempt and a reputation.

## Native spec — `mochiichao/attempt-deeds/v1` (fragment beside this doc)

- **The attempt class (proposed into #269's table,
  in #269's file).** Every taking-class deed in
  #269's closed vocabulary gains an attempt sibling
  at **half the completed deed's weight, rounded
  toward zero** (drafted pattern — the seed fits
  it exactly: steal −6 → attempt −3). The class
  covers, at build:
  - *Attempted theft* — a confirmed snag throw that
    fails (the seed row; restated here as the
    class's first member, not re-founded).
  - *Attempted betrayal-taking* — a confirmed
    #347-family taking from a trusted keeper
    (#280's betrayal classification) that fails:
    scored at the attempt weight of the completed
    betrayal deed it aimed at.
  - Attempt rows for non-taking deeds are **not**
    founded: there is no "attempted donation," and
    an intimidation that was spoken *is* the deed
    (#269 scores the speaking, not its success).
    The attempt class exists only where an act can
    be launched and fail — throws, takings,
    reachings-for. That boundary is the class's
    definition.
- **What counts as an attempt — the confirmation
  is the threshold.** An attempt exists only after
  the act's own gate is passed: for theft, the
  confirmed throw (#268's addendum — a declined
  prompt writes nothing; a device refusal before
  the throw writes nothing, #351). An attempt is a
  launched act that did not land: the ball was
  thrown and the Mochi broke free, the taking was
  begun and stopped by the world's mechanics. Acts
  interrupted *before* launch (refusals, prompts
  declined, menus closed) are not attempts — #350's
  input honesty is what makes this line checkable.
- **Conscience counts tries in full.** The attempt
  deed appends to the ledger with its witness set
  exactly as a completed deed does (#269's
  discipline), and it moves morale at its attempt
  weight **whether or not anyone saw it** — the
  RDR2 rule the whole list hangs on: you know what
  you tried to do. An unseen failed theft is not a
  clean conscience; it is a −3 the world never
  learns about. This is the deliberate asymmetry
  the owner bought with the confirmation: because
  trying is always a choice, trying is always
  scored.
- **Evidence counts tries at attempt weight.** A
  witnessed attempt enters #272's flow as an
  attempt: it can ground a report and a finding,
  but the wanted level it sets is read from the
  attempt row, not the completed deed's — the law
  answers what was *done*, and a failed throw did
  less. (A pattern of attempts is read by #272's
  history rule as the law reads history: repeated
  attempts stop looking like attempts. The pattern
  rule is #272's, cited not rebuilt.)
- **Reputation hears nothing until someone tells
  it.** Attempts never appear in #270's tallies on
  their own: fame and infamy are built from
  witnessed, reported facts, and an unwitnessed
  attempt is neither. A *witnessed and reported*
  attempt enters the group's belief as an attempt —
  the tally records the trying, at attempt weight —
  and an attempt that was never reported, however
  black it sits in the ledger, is invisible to
  every group in the world. The three ledgers of a
  life stay separate: conscience knows, the law
  knows what it was told, the world believes what
  reached it.

## Show lane

The failed steal is the show's cheapest honest
character beat: the throw that broke free tells the
audience exactly what the thrower is, and — if
nobody in the scene saw it — sets up #276's
dramatic irony in one move. The staging of the
throw itself is #355's.

## Wiring

Rows proposed into #269's table (attempt siblings,
in #269's file — STAGING step 2); the seed row
already lives there. Witness/evidence read: #272.
Reputation fence: #270 (a negative rule landing as
a validation note in #270's home). Launch threshold
definition depends on #350's input pipeline and
#351's refusal order — the three specs state one
pipeline from three sides and must land together.

## Open slots

The attempt-weight rounding pattern is drafted
system data (half, toward zero — fits the one
landed row; tunable at landing as data). No story
facts are open in this spec.

## Coverage — honest

- Class law: fully specified over #269's landed
  table and #272's landed flow.
- Contents: one attempt row exists today (theft);
  the betrayal-attempt row is a proposal into
  #269's file, landing with this package.
