# #189 — CHALLENGE MODES → the Dial C operating system

**What was studied.** Player-chosen difficulty in the
publicly documented record — and, first, this programme's
own #70, which already did the teardown: three mechanisms
share the name "dynamic difficulty" — (1) rubber-banding,
(2) presentation directors, (3) scaled content — and #70
adopted (2) and (3) and **refused (1) in writing**. Challenge
modes are mechanism (3)'s player-facing half. No option
names, band values, or text are copied from any source.

## Canon anchors (verified in the packages)

- **#70 Dial C is this system's charter.** "Fixed, named
  difficulty options at file start (the honest form of
  rubber-banding's intent): they select among pre-authored
  band sets (Dial A variants) and are recorded in the save
  header. Names, count, and deltas are OPEN." #189 changes
  none of that — it specifies how the election lives, shows,
  and changes over a save's life.
- **#70 Dial A is what a mode selects.** Encounter bands are
  authored data in the #7/encounter files, keyed to
  progression state (#12) — "a designer reads the exact
  party a player at Fragment-count *n* will meet". A mode
  chooses among *authored variants of those files' band
  sets*. Bands are never computed from the visitor, and
  canon encounters with locked levels keep them under every
  mode (#70, verbatim force).
- **#98's licence is a view, not a store.** "The licence
  record stores identity facts and nothing else"; standings
  are renderings of save facts. An election is not an
  identity fact — so the licence **displays** the election
  and stores nothing (below).
- **#132's centres are the world's service counters** —
  the place where recorded standings are serviced by a
  keeper, on a schedule (#93). Election changes happen
  there or nowhere.

## Native spec — `mochiichao/challenge-mode/v1` (fragment beside this doc)

- **One election, stored once.** The current election is a
  single fact in the save's `meta` section (#96) — the seat
  #70 named ("recorded in the save header"). The licence
  (#98) renders it as a standing, by the same derivation
  discipline as fragments held or gauntlet standing; the
  rendering is proposed into #98's home and stores nothing
  there. There is no second copy of the election anywhere.
- **The refusal, restated with #70's force.** No mode —
  chosen or otherwise — may bend outcome math, read win/loss
  history, soften or stiffen an opponent's party after the
  fact, or adjust anything silently. **Hidden rubber-banding
  is refused**; a mode is a *declared* selection among
  authored band sets, visible on the licence, identical for
  every encounter it governs until changed at a centre.
  (The commissioning brief pointed at "#76" for this
  refusal; #76 is web export and carries no difficulty
  content — the refusal lives in #70, and #99 and #139
  already cite it from there. Noted so the citation chain
  stays honest.)
- **Change rule.** The election changes **only at a care
  centre** (#132 service place, keeper-serviced), never
  mid-route, never mid-battle, never by the game itself.
  A change is an append-only event in the save's history
  (the seat #106's tombstones use: facts kept with #12's
  history) — `{from, to, changedBeat, centreId}` — so a
  save's challenge history is auditable, and honours or
  records earned under an earlier election stay honestly
  attributed to it. The new election governs encounters
  authored after the change; nothing in progress is
  re-banded.
- **What modes never touch.** Outcome math (#70's law);
  locked canon levels; story and progress flags (#12);
  the Dark Forest depths — their emptiness and weather
  NONE are canon, not a band, and no mode populates or
  animates them; the show lane entire (autonomous-action
  doctrine — a show fight has no difficulty).

## Wiring

Stores: #96 `meta` (the election fact). Renders: #98
(proposed standing). Selects among: #70 Dial A band-set
variants in #7/encounter files. Changes at: #132 centres,
recorded beside #12's history (the #106 tombstone seat).

## Coverage — honest

- **Architecture: complete** against #70's charter — this
  package adds the election's lifecycle (seat, display,
  change, audit) and nothing else.
- **Contents: the mode set itself is entirely OPEN** —
  names, count, and band deltas are the owner's ruling,
  inherited from #70 Dial C's open slot. Zero modes are
  instanced here.
