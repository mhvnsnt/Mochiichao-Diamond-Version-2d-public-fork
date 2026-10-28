# #147 — MOVE-ANIMATION COVERAGE SYSTEM → the coverage ledger over #9

**Seat in the doctrine:** #9 built the animscript format
(`mochiichao/move-animscript/v1` — shared base tracks +
one performance block per anatomy, mandatory
`variance_notes`, a validator that refuses a performance
cueing anchors its body lacks) and the anatomy-variance
doctrine says a move's animation is not one thing: it is
one performance per body that can perform it. Nobody
owns the question that doctrine immediately raises —
*which moves have scripts, and for which anatomies are
performances still owed?* This spec is that layer: a
coverage ledger that is **derived**, never hand-written,
so the answer can never drift from the registry it
describes.

**What was studied.** Coverage tracking in the publicly
documented record: animation libraries in production are
managed as matrices (asset × variant) generated from the
asset database, not maintained as documents; a
hand-maintained coverage list is a known failure mode —
it reports the library its author remembers, not the one
that exists. The kit taken: the ledger is a *report*,
regenerated from three real sources (the move registry,
the animscript files, the species/anatomy data), and a
coverage claim is only ever a query result.

## Native spec — `mochiichao/anim-coverage/v1` (fragment beside this doc)

- **Inputs, all verified authorities.** (a) The move
  registry — 352 moves, PR #366 layer (its in-repo home
  is an UNVERIFIED TARGET carried from List 13's register;
  the core `moves.json` is *not* the authority). (b) The
  animscript files in their registry home, read for
  `moveId`, the anatomies their performance blocks cover,
  and their `variance_notes`. (c) The anatomy classes the
  animscript format itself validates against — coverage is
  counted over the format's real anatomy vocabulary, not
  an invented one.
- **The ledger row** (one per registry move):
  `{moveId, scriptState, anatomiesCovered[],
  anatomiesOwed[], baseTracksPresent}` where
  `scriptState ∈ {scripted, base-only, unscripted}` —
  `base-only` means shared tracks exist with no anatomy
  performance yet; `unscripted` means no file. Rows are
  computed; the fragment beside this doc is one row's
  shape, not a row set.
- **`anatomiesOwed` is doctrine, not backlog noise.** A
  move is owed a performance for an anatomy when a species
  of that anatomy can learn it (learnsets, 47/47 verified
  for Gen 1 scope) and no block exists. The debt list is
  therefore *species-driven*: it answers "what would this
  creature's version look like" before a production needs
  it, per the doctrine that one creature's performance is
  never the universal animation.
- **Priority is a view, not a field.** Signature moves
  (#131's register), starter-line moves, and episode-
  attached moves are the production-relevant slices; the
  ledger supports filtering by them but stores no priority
  — priorities change with production, coverage facts
  don't.
- **The show consumes the same ledger.** An episode that
  wants a move performed checks coverage first; an
  unscripted or anatomy-owed move in a script is a
  production flag at board stage (#53's passes), not a
  surprise at composite time. This is the join that makes
  #131's signature presentations plannable.

## Open slots (nothing invented)

Which anatomy classes the first coverage pass runs over
(the format's vocabulary is real; the pass order is a
production call) · whether `base-only` counts as covered
for game-lane purposes (the game may ship base tracks
where the show may not — lane ruling, OPEN) · the owed-
performance production order itself.

**UNVERIFIED TARGET:** the animscript files' in-repo
registry home — #9's package stages them repo-ready, but
their landed path is confirmed at landing; the ledger
reads whatever home landing verifies, and until then this
spec is the derivation rule, not a report.


**Landing note — List 27 #258 (2026-10-27):** grown-weapon growth records (258-GROWN-WEAPON-GROWTH.md) are read by this ledger — which weapon shape a stage performs with. The records' ids never resolve in #31's item layer (the non-join fence, structural in the record shape).
