# #253 — PRIZE MONEY & BATTLE REWARDS → what winning pays, and what losing costs

**Doctrine seat.** #20 built the economy (one currency —
its name is a canon slot this spec does not touch —
integer-only, faucets and sinks) but no package ever
stated where battle money comes from or what a loss
takes. This spec states the documented shapes over
#20's economy. Money is a game-lane system entirely;
the show shows Rangers living, never earning on screen
(#20's line).

## Native spec — `mochiichao/prize-money/v1`

### Winning

- **Ranger battles pay; wild battles do not.** A wild
  Mochi has no money and drops none — what a wild battle
  pays is gain (#177) and drops (#166). Stated flatly:
  no faucet hides in the grass.
- **Payout = `classBase × level of the final opposing
  individual`** (the documented shape). `classBase` is
  opponent-class data carried by the authored party
  records — rival teams (#37), dojo parties (#45),
  encounter parties (#52) each carry their class's base
  as data. The values are authored contents; the formula
  is this spec's, and it is asserted.
- The payout lands as a single #20 faucet event at
  battle end, recorded like every other money movement.

### Losing (the blackout rule, stated kindly and exactly)

Losing a battle never costs a Mochi, an item, or a
step of progress. It costs money and position:

- **You pay out** `min(held, lossBase × highest level
  among your party)` — `lossBase` is a single economy
  constant carried as #20 data (the documented shape
  scales the sting to how far you've come; the constant
  is a data value, tuned with #20's pass).
- **You come to at the last centre you visited**, and
  the centre's heal step (#256) restores the team. The
  world does not move on without you: no flags change,
  no encounter is consumed, the route is where you
  left it.
- A loss to a wild battle follows the same rule (the
  documented games make no distinction worth keeping).

### The no-money formats (exclusions, matching #177)

- **Versus (#109/#157):** no money changes hands in
  either direction, win or lose. The record is the
  reward.
- **Facilities & the ladder (#86/#186):** no money.
  Rewards are #86's device-shaped rewards and the run
  record itself (#177's exclusion, extended to money
  by this spec — stated here so nobody has to infer it).
- **Rentals (#159):** any money a run's fiction shows
  stays inside the run record and expires with it
  (#159's non-writes, untouched).
- **Field duels (#210)** follow Ranger-battle rules for
  payout unless the duel's own terms (honours only)
  were declared at the challenge — the duel record
  states which, before the battle, never after.

## Show lane

None. A show Ranger who loses is carried home by the
story, not by a payout formula; money on screen is
texture (a meal paid for, a fare) under #172/#90's
world grammar, never a battle consequence.

## Wiring

Reads: authored party records (#37/#45/#52) for
`classBase`; #178 for levels; #20 for the faucet event
and the `lossBase` constant's home. Consumed by #10's
battle-end step (after #177's gain events — order:
gain, then money, then the return-to-centre move on a
loss), and by #253's own exclusions list at #109/#86/
#159's seats.

## Coverage — honest

- **Shapes: asserted** (documented base mechanics).
- **Contents:** every `classBase` value and the
  `lossBase` constant are authored economy data — they
  belong to #20's tuning pass and are not invented
  here. The formula needs no one's permission to be
  finished; the numbers are the economy lane's to set.
