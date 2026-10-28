# #254 — ESCAPE & FLEEING → how a wild battle lets you go

**Doctrine seat.** #10's command ring has always had a
RUN command; no package ever said when it works. This
spec states the documented rule: escape is a speed
contest you can retry, each failed try makes the next
one easier, and some battles cannot be run from at all.

## Native spec — `mochiichao/escape/v1`

### The attempt

Running is a command (#10's ring; it consumes the
turn — in the order of #251 it resolves as the
command it is, and a successful escape ends the battle
before the opposing side's move commands resolve).

Each attempt computes:

`F = ( (A × 128 / B) + 30 × C ) mod 256` — escape succeeds when #94's seeded draw in 0–255 falls **below F**.

- `A` = the fleeing side's active individual's
  effective Speed (#248 × #250 stages).
- `B` = the opposing active individual's effective
  Speed. Against a horde (#158) or several wild
  opponents, `B` is the **highest** opposing Speed on
  the field (you have to outrun the fastest thing
  present — stated as this spec's fill for the
  multi-opponent case).
- `C` = escape attempts already made **this battle**.
  Failed attempts are counted as a battle fact; the
  count resets when the battle ends. This is the
  documented mercy: persistence is eventually rewarded
  by arithmetic, not by pity.

### Guaranteed and blocked (all data seats, no new machinery)

- **Guaranteed escape** when the fleeing individual
  carries an ability or held item whose data grants it
  (the Run Away / Smoke Ball classes — #107/#31 seats,
  read through #183/#184 at their trigger seats).
- **Blocked** when a move or ability in effect carries
  the trapping flag (move/ability data), or the
  battle's format forbids flight (below). A blocked
  attempt is shown as blocked — the command fails with
  its reason in the queue, never silently.
- Conditions never block escape by themselves; a
  condition's own movement effects are its record's
  business (#182), not this spec's.

### Where running does not exist

- **Ranger battles: no escape, ever.** Stated flatly —
  it is the base game's rule and it is this game's. The
  RUN command is absent from the ring in a Ranger
  battle (not greyed — absent; #10's ring is built per
  battle).
- Versus, facilities, rentals, and any scripted battle
  whose encounter record carries `noEscape` (authored
  data, #52's parties): same absence.
- What you *can* always do in a Ranger battle is lose
  honestly — #253's blackout rule is the exit, and it
  costs money, never dignity or progress.

### Show lane

Leaving a fight in the show is choreography and
courage, never a dice roll: a Mochi breaks off because
it chooses to, a Ranger calls a retreat because the
story needs one, and the Forest's things do not chase
past where canon lets them. No number from this spec
ever appears on screen.

## Wiring

Consumed by #10 (RUN command + ring construction),
reading #248/#250 (effective Speed), #94 (the draw),
#107/#31 (guarantee/block seats), #158 (the horde `B`
rule). Attempts write only to battle state — nothing
survives the battle (#14 law).

## Coverage — honest

- **Rule: complete and asserted** (documented base
  mechanic, including the retry mercy and the mod-256
  wrap, which is part of the documented shape and kept
  deliberately — very fast flee-ers can, rarely, fail
  a first attempt exactly as the base game allows).
- **Contents:** which abilities/items carry the
  guarantee or the trap is their data, in their homes.
