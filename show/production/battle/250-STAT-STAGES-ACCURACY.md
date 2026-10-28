# #250 — STAT STAGES & ACCURACY/EVASION → the in-battle arithmetic of rising and falling

**Doctrine seat.** #17 named these tables and flagged
their values PROPOSED ("standard reference fractions").
This spec states the documented tables in full — under
the Pokémon-base rule they are **locked, not proposed**
— and fixes where stage changes live: on the battle
individual, inside the battle, reset by leaving it.
Who may change a stage is move/ability data (#9/#107);
this is the arithmetic and the display, nothing else.

## Native spec — `mochiichao/stages/v1` (fragment beside this doc)

### Stat stages (−6 … +6; Attack, Defence, Sp. Atk, Sp. Def, Speed)

A staged stat reads `floor(stat × multiplier)`:

| stage | −6 | −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 | +6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| × | 2/8 | 2/7 | 2/6 | 2/5 | 2/4 | 2/3 | 1 | 3/2 | 4/2 | 5/2 | 6/2 | 7/2 | 8/2 |
| = | .25 | .286 | .333 | .40 | .50 | .667 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 |

A stage change that would pass ±6 does not apply and
the failure is shown (the documented "won't go higher /
lower" beat) — clamping is a presentation fact, never a
silent no-op.

### Accuracy & evasion stages (the thirds table)

Accuracy stages and evasion stages share one table,
built on thirds:

| stage | −6 | −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 | +6 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| × | 3/9 | 3/8 | 3/7 | 3/6 | 3/5 | 3/4 | 1 | 4/3 | 5/3 | 6/3 | 7/3 | 8/3 | 9/3 |

A move connects when the seeded draw (#94) falls under:

`accuracy(move) × accMult(attacker's accuracy stage) / evaMult(defender's evasion stage)`

—the move's printed accuracy is its data (registry);
weather and field modifiers to accuracy arrive as move/
field data seats (#252's STORM seat is the standing
example). A move whose accuracy is `null` in its data
never rolls — it cannot miss (the Water Orb precedent:
`accuracy: null` is a first-class value in this game's
move data, owner-set).

### Critical stages (the rate table #248 rolls against)

| crit stage | 0 | +1 | +2 | +3 or more |
|---|---|---|---|---|
| rate | 1/24 | 1/8 | 1/2 | always |

A combatant's crit stage is 0 unless move or ability
data raises it for that action (a high-crit move, a
held item, an ability — all data seats, #9/#107/#183).
The ×1.5 and the stage-reading exceptions live in #248.

### Where stages live

- Stages are **battle state** on the individual,
  starting at 0 on entry — including re-entry: leaving
  the field (switch, #251's seat) resets all of that
  individual's stages to 0. This is the documented rule
  and it is why switching is a real decision.
- Stage changes resolve inside #10's RESOLUTION as
  effects and are announced through its queue (the
  `status`-class message: what rose/fell, and the
  clamped-failure beat) — cause precedes the next
  action, always.
- **LIVING_FIELD never reads or writes stages** (#10's
  doctrine guardrail: presentation holds a read-only
  snapshot; the snapshot may *show* a staged posture,
  it cannot move a number).
- Nothing about stages is stored after the battle —
  they are not facts on #80's record, they leave no
  trace in #96's save, and #187's replays reproduce
  them from the turn record like everything else.

## Show lane

None as arithmetic. A show creature "fighting above
itself" or "slowed, rattled" is performance (#136's
comprehension grammar can name the state); no stage
number ever appears on screen (subtitle law —
important moments only, and a multiplier is never one).

## Wiring

#248 reads staged stats and the crit table; #251 reads
staged Speed; #10's RESOLUTION applies and announces
changes; #184 seats ability-driven changes in the
trigger order; #18's AI reads the same tables for
scoring. The fragment's tables are the single source —
no consumer hard-codes a fraction.

## Coverage — honest

- **Tables: complete and asserted** (documented base
  mechanics, base-rule filled; #17's PROPOSED flag is
  closed for these tables).
- **Contents:** which moves and abilities change which
  stages is their data — the registry's, growing with
  it. The arithmetic waits on nobody.
