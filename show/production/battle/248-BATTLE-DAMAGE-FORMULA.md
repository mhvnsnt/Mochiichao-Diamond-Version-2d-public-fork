# #248 — BATTLE DAMAGE FORMULA → the arithmetic every hit runs through

**Doctrine seat.** #17 fixed the pipeline's *shape* —
`base(level, power, atk, def) → STAB → chart product →
field modifiers → variance`, integer floors after each
stage, minimum 1 on a connecting hit that isn't immune —
and left its constants PROPOSED. Under the Pokémon-base
rule (owner, 2026-10-27: fill the gaps the way Pokémon
does), this spec states the documented arithmetic in
full. **The constants below are locked by the base rule,
not proposed** — this closes #17's PROPOSED register for
everything it covers. Where Mochiichao canon speaks, it
overrides: type ids are #249's, the field step reads
#47/#181's records, and no term anywhere reads hidden
state about the player (the no-rubber-banding law, #70).

**What was studied.** The documented damage arithmetic of
the reference games: a level/power/attack/defence base
term, then a sequential multiplier chain — same-type
bonus, type effectiveness, weather and field modifiers,
critical, the attacker's burn on physical moves, and a
random factor applied last — with the combat stats
themselves computed from base stats, individual variance,
earned effort, and a temperament modifier.

## Native spec — `mochiichao/damage/v1` (fragment beside this doc)

### The stats a battle reads (computed at battle entry, #10's snapshot)

For each individual, per stat, from the species' base
value `B` (species data), level `L` (#178's derived
level), individual variance `V` (#80's record — the
documented 0–31 seat), earned effort `E` (#39's ledger,
converted by #179's application layer), and temperament
modifier `T` (#108's seat — the nature position):

- **HP:** `floor((2B + V + floor(E/4)) × L/100) + L + 10`
- **Any other stat:** `floor((floor((2B + V + floor(E/4)) × L/100) + 5) × T)`,
  where `T ∈ {1.1, 1.0, 0.9}` by temperament. Which
  temperament raises or lowers which stat is the mapping
  table registered as hole H4 in #247 — the seat and the
  values are filled here; the table is a data pass.

In battle, a stat's effective value applies its stage
multiplier (#250) at read time. Stats are recomputed,
never stored (#14/#96 law — the stored facts are the
record's; levels and stats are derivations).

### The base term

`base = floor( floor( (floor(2L/5) + 2) × P × A / D ) / 50 ) + 2`

where `P` is the move's power (move data, #9/#147
registry), `A` the attacker's effective Attack or
Sp. Atk and `D` the defender's effective Defence or
Sp. Def — physical moves read the physical pair, special
moves the special pair (the move's category is its data).

### The chain (order fixed by #17; applied with a floor after each stage)

1. **STAB ×1.5** when the move's type is one of the
   attacker's own types. An ability may raise this to
   ×2.0 — that is ability data (#107), applied at
   #184's seat, never a second rule here.
2. **Chart product** — #249's multiplier for (move type
   × each of the defender's types), multiplied together.
   A product of 0 is an immunity: the move fails with
   the immunity shown, and no later term runs.
3. **Field modifiers** — the battle field's records in
   #181's fixed resolution order (weather → terrain →
   room): weather terms from #252, terrain/room terms
   from their #47 records where a record provides them.
4. **Critical ×1.5** when the hit is critical. Critical
   rate is a stage table (#250); the roll is #94's
   seeded draw. A critical hit reads the attacker's
   attack stages as no lower than 0 and the defender's
   defence stages as no higher than 0 (documented).
   There are no screen-class records for it to ignore
   yet — that seat waits on hole H1 (#247).
5. **Burn ×0.5** when the attacker carries the burn
   class of condition (#182's roster) and the move is
   physical.
6. **Spread ×0.75 per target** in multi formats (#157)
   when one move strikes more than one target.
7. **Variance ×(0.85–1.00)** — applied last, from
   #94's seeded draw (the same draw discipline #187's
   replays depend on: a seeded battle replays exactly).

Minimum damage is 1 on any hit that connects and is not
immune (#17's rule, kept). A move with no power (status
moves) never enters this formula — it resolves through
its own effect in #10's RESOLUTION.

## Show lane

None. The show has no damage numbers (#129's line);
hits land as choreography and consequence, never as
arithmetic. The chart and formula are game-lane data —
the show expresses advantage as skill and training
(two-lane doctrine, #17).

## Wiring

Consumed inside #10's RESOLUTION — the only place
outcomes are written; #18's AI reads the same formula
for scoring (its largest term is the chart product,
#17); #252/#47/#181 supply step 3; #250 supplies stages
and critical rates; #249 supplies step 2. Move power,
category, and type are move data — this spec hard-codes
no move.

## Coverage — honest

- **Arithmetic: complete and asserted** — every constant
  above is the documented base mechanic, filled under
  the Pokémon-base rule. #17's PROPOSED status is
  superseded for: the base term, STAB, the variance
  range, and the stat formula.
- **Seats filled by other people's data:** temperament
  mapping (H4), ability modifiers (#107/#184), field
  record terms (#47 contents), move data (registry).
  The formula is finished; its inputs are their owners'.
