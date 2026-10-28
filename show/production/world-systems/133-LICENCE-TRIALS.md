# #133 — LICENCE PROMOTION TRIALS → licence rank trials system

**What was studied.** Promotion-by-trial structures in
the reference games and their wider genre, as publicly
documented: standing that advances not by accumulation
alone but by a **set challenge** — an examination, a
qualifying run, a judged performance — whose passing is
the tier boundary. The documented shapes agree on the
bones: eligibility is derived from standing, the trial is
an authored encounter set (not a random draw), the pass
is a fact recorded once, and failure costs nothing but
time (the trial re-opens). The kit taken: tiers are
*earned at gates*, and the gate is content with a record
shape. No examinations, challenges, or text are copied.

## Canon anchors (verified)

- **#98 built the slot this fills:** the licence's `tier`
  is a derivation over derived standings (fragments +
  gauntlet standing) with "tier thresholds and names
  **OPEN**" — #98 deliberately shipped the rank *field*
  without a rank *system*. This spec is the system; the
  names and thresholds remain OPEN here too.
- **Fragments + gauntlet are the Region 1 standing
  facts** (#12 `progress.*` flags; #45 circuit; #100
  gauntlet standing derived from bout flags + the
  `story.champion_defeated` capstone). A trial system
  that invented its own progress currency would break
  #98's no-second-ledger rule — trials *read* those
  derivations and add only pass facts of their own.
- **The dojo circuit is not re-used as trials.** Dojos
  grant Fragments; the gauntlet is the region's capstone.
  Trials are a third thing — licence business — and
  conflating them with dojo clears would double-count the
  same flags as two standings.

## Native spec — `mochiichao/licence-trials/v1` (fragment beside this doc)

- `trial` record: `{trialId, fromTier, toTier, eligibility,
  challenge, passFlag}`.
  - `eligibility` — a derivation expression over existing
    standings (#98's inputs: fragment popcount, gauntlet
    standing, dex counts where a tier wants them). The
    trial can be *attempted* iff eligibility derives true
    — no trial-specific progress store.
  - `challenge` — references to authored encounter records
    (#30 encounter shape, parties as #37 records) or to a
    non-battle challenge shape where a tier wants one
    (the vocabulary of challenge *kinds* is OPEN — canon
    names no trial content at all).
  - `passFlag` — one `progress.*` fact (#12) written on
    passing. **Tier is then derived** (#98 unchanged):
    tier = the highest `toTier` whose pass fact exists,
    checked against eligibility derivations. Passing is a
    fact; rank is a view. This keeps #98's derivation
    honest — the licence never stores a rank the facts
    don't support.
  - `attempts` — recorded as data (the #45/#100 ethic:
    attempts are facts, failure is not punished beyond
    the run ending).
- **What ranks exist is OPEN beyond canon's shape.** Canon
  gives a licence, Fragments, and a champion; it names no
  rank ladder. The fragment ships the record shape with
  an **empty tier table** — inventing rank names here
  would be inventing canon (and rank names are display
  strings, which under the naming law are the owner's
  vocabulary to set).

**The region-gating question — PROPOSAL, flagged, and
narrowed by #127's discovery model:** #127 (as refined by
the owner) models borders as multiple discovered
connections, with `progression` only one discovery kind
among several. Licence-rank gating therefore **cannot**
be a border lock — a discovered route stays discovered.
What survives as a proposal is narrower: a tier condition
on the `progression` discovery kind alone (the league's
certified route opens at a rank), expressed in #127's own
terms and read from #98's derivation. **Registered as a
proposal for owner ruling, not canon, not a default** —
and it can never seal `exploration`, `side-story`, or
`map-connection` routes, ruled in or not. No system here
reaches into #127's records.

**Show lane:** a trial is an episode-shaped thing (the
judged performance is the genre's natural bottle episode)
— show trials follow the same record (eligibility read
from the show's own arc facts per #82), and a pass in the
show is a story fact, not a game flag; the lanes share
the *record shape*, never the ledger.

## Wiring

Reads #98 (tier derivation — this spec supplies its
missing input: pass facts), #12 (flags), #30/#37
(challenge records), #45/#100 (standing sources),
#23 (rank display names, when the owner sets them).
Proposal-only join to #127 (region gating) — flagged
above and in STAGING; nothing in #127's package is
edited by this one.

## Coverage — honest

- **Architecture: documented pattern** (promotion trials
  across the genre; eligibility/pass-fact/rank-as-view is
  this programme's standing derivation law applied).
- **Contents: entirely OPEN.** The tier table, every
  trial's challenge, eligibility thresholds, and the
  region-gating proposal all await the owner. The spec's
  yield is the guarantee that when ranks are ruled, they
  land as derivations over facts that already exist —
  not as a second progression system bolted onto the
  licence.
