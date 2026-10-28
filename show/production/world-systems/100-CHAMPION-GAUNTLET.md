# #100 — ELITE FOUR / CHAMPION RUNS → Champion gauntlet format

**What was studied.** The endgame gauntlet architecture of the
reference games, as publicly documented: after the token
threshold, the league ends in a **fixed sequence** — four elite
encounters in a set order with **no return to the open world
between them**, healing handled by a deliberate rule (the
player's own items in the classic form; a restore point in some
later facilities), capped by a single champion encounter whose
party answers the whole run. Losing anywhere ends the run; the
run, not the individual bout, is the unit of progress. The kit
taken: sequence-as-unit, typed heal gates, champion as capstone
record. No parties, orderings beyond our own canon, or text are
copied.

## Relationship to #45 (read first — this extends, not repeats)

#45's dojo-circuit format already fixed the canon spine —
**Elite Four Umi / Gin / Hono / Yoru → Champion Hex** — and the
gauntlet's *composition* rule (records written as a set, each
member's `answer` slot answering the previous fight). What #45
deliberately left at the level of a gate (`sequence_clear`,
#11) is the run's **operational format**: how bouts chain, what
happens between them, what a loss does, and how rematches work.
That is this spec, and only that.

## Native spec — `mochiichao/gauntlet/v1` (fragment beside this doc)

- **Run record:** `{runId, sequence: [encounterRef ×4],
  capstone: encounterRef, gateIn, status}`.
  - `gateIn` — Victory Route's fragment gate (#45): the run
    opens iff the derived `fragment_count` meets the threshold
    (8, flagged STRUCTURAL INFERENCE in #11/#45 — inherited
    as-is, not silently hardened here).
  - `sequence` — four **dojo-encounter records (#30)** with
    `tier: elite`, in canon list order: **Umi, Gin, Hono,
    Yoru**. Parties are #37 rival records, authored as the set
    #45 requires.
  - `capstone` — Champion Hex's record (`tier: champion`), the
    rival chain's terminus (#37: first-run `rematch: null`) —
    the neighbour and Region 1 Champion from the season spine.
- **Heal gates — typed, slotted, contents OPEN.** Between
  consecutive bouts sits a `healGate` of a closed kind:
  `none` (straight through) · `items` (the Ranger may use their
  own items — the classic rule) · `restore` (a full restore
  point). The format fixes the *slot and the vocabulary*;
  **which kind sits at which gate is an OPEN owner/game-design
  decision** — the fragment ships all four gates as `null`.
  Inventing a heal rule would be inventing game balance.
- **Run state is flags, the standing is derived.** Bout clears
  write `progress.*` flags (#12); the run's `status`
  (not-entered / in-run / fallen / cleared) is **derived** from
  those flags plus the capstone flag (`story.champion_defeated`
  — the #12 architecture's own worked example) at read time.
  The licence (#98) displays gauntlet standing by this same
  derivation.
- **Loss rule.** A loss ends the run: the sequence flags for
  *this run's* bouts are archived to the challenger's attempt
  record (attempt counts are data, per #45) and the gate
  re-tests the full sequence on re-entry. A loss never removes
  a Fragment, never costs a kept Mochi, never re-locks Victory
  Route — #45's ladder-of-mastery ethic, applied at the top.
  **Format note:** whether re-entry replays all four bouts or
  resumes is the documented-classic behaviour (full replay)
  adopted here as the format default; if the owner prefers a
  resume rule, it is a one-field change (`lossRule: replay |
  resume`) — the field ships `replay`, flagged as a default,
  not a canon ruling.
- **Rematch ladder.** After the capstone falls, the gauntlet
  becomes re-challengeable as a set: each member + Hex gains a
  **#87 rematch record** (rung ladder over the same party
  records — references, never copies). The gauntlet's rematch
  home is the postgame structure (#66 isles / #86 facilities),
  unconfirmed as #87 already flagged; the records are valid
  wherever the owner houses them.

## Show-side echo

The gauntlet is the season's composed argument (#45): four
fights that answer each other, then the neighbour. Show
staging follows #64's boss-intro grammar at capstone weight,
and the heal gates are *scenes* in the show lane — the quiet
between bouts is where the arc breathes (rest, doubt, the
partner's state) — which is why the format types them instead
of leaving them as dead air between data rows.

## Wiring

Spine + composition: #45. Records: #30 (`tier` vocabulary) over
#37 parties. Gates/state: #11 (`sequence_clear`), #12 flags.
Standing display: #98 licence derivation. Rematches: #87.
Postgame housing: #66/#86 (OPEN).

## Coverage — honest

- **Architecture: fully documented**; sequence-unit + capstone
  is the documented league endgame across eras.
- **Contents: spine canon, operations open.** Canon fixes the
  four names, their order, and the Champion. Heal-gate kinds,
  the threshold number (inherited inference), and the rematch
  housing are OPEN or flagged defaults — nothing here hardens
  an inference into a ruling.
