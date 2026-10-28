# #70 — DYNAMIC DIFFICULTY CURVES → game difficulty spec

**Teardown (public documentation).** "Dynamic difficulty" in the
published design record is three different mechanisms sharing a name:
(1) **rubber-banding** — hidden outcome adjustment (opponent speed /
accuracy bends toward the player's recent results; racing games are
the documented home); (2) **director systems** — a pacing director
(Left 4 Dead's AI Director is the public exemplar) that modulates
*intensity of presentation* — spawn pacing, lull/peak rhythm — on a
measured tension curve, while the underlying combat math stays fixed;
(3) **scaled content** — opponent levels/parties chosen from bands
keyed to player progress (the creature-game pattern: route trainers
scale to badge count, wild levels are area-fixed). The honest
literature consensus, and the kit taken: mechanism (2) + (3) age
well and preserve player trust; mechanism (1) is detectable, resented
when found, and incompatible with any game whose battles are also
canon. Our spec adopts (2) and (3) and **refuses (1) in writing**.

**The Mochiichao law this spec is built around.** In the game lane,
battles are command-driven and commands are what affect health and
outcome (Battle Doctrine); in the show lane creatures fight with
their own agency and the game cannot reach in. A hidden outcome-bend
would falsify both lanes at once — the same fight must be winnable
by the same commands in every save. So: **outcome math is fixed and
auditable; difficulty adapts only what the player meets and how it
is presented, never what a command does.**

**Native spec — three dials, all visible in data:**

- **Dial A — Progression bands (scaled content).** Every encounter
  source (#7 spawn tables, dojo/rival formats) carries level/party
  **bands** keyed to progression state (#12 `progress.*`: Fragments
  held, route position), not to win/loss history. Bands are data in
  the encounter files — a designer reads the exact party a player at
  Fragment-count *n* will meet. Canon encounters with locked levels
  keep them; banding applies where canon left levels open (most
  spawn rows are null-levelled today — bands fill *ranges*, never
  override a canon number).
- **Dial B — Presentation director.** A tension curve over a play
  session (explore → encounter density → lull), implemented as
  *pacing weights* on the spawn tables and ambient behaviour (#67):
  after a hard fight, grass density weights dip for a window; before
  a dojo, they settle. The director touches **weights and timing
  only** — levels, stats, and battle math are outside its reach by
  construction (it has no write path to them).
- **Dial C — Player-chosen challenge.** Fixed, named difficulty
  options at file start (the honest form of rubber-banding's intent):
  they select among pre-authored band sets (Dial A variants) and are
  recorded in the save header. Names, count, and deltas are **OPEN**
  owner decisions; the spec fixes only that the choice is explicit,
  stored, and never silently re-chosen by the game.

**What is NOT in this spec.** No hidden modifiers, no loss-streak
mercy math, no opponent AI sandbagging (#18's AI spec scores moves
to win within its party's real data). If a future owner ruling wants
an accessibility assist, it lands as a Dial C option — visible,
chosen, recorded — or it does not land.

**Wiring.** Reads: #12 progression flags. Writes: nothing at runtime
— bands are authored data in #7/encounter formats; the director's
weight windows are fields on the spawn-table schema (additive,
nullable — the seed rows validate unchanged). Show lane: untouched
(autonomous-action doctrine is itself the refusal of a director over
outcomes).

**Coverage.** Mechanisms: fully documented publicly, including the
trust literature against rubber-banding. Contents: dial *architecture*
complete; band numbers, director window lengths, and Dial C's option
set are OPEN tuning/owner content — the spec fixes where tuning
lives, not its values.
