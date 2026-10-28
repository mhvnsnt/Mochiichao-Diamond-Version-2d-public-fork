# #251 — PRIORITY & TURN ORDER → who acts first, decided in the open

**Doctrine seat.** #10 fixed the turn's *shape* (command
→ COMMIT → RESOLUTION queue) but never stated the order
*between* the two sides' commands — every earlier spec
that needed it (#157's multis, #165's bag, #184's
triggers) assumed an answer. This spec states the
documented answer: **priority bracket first, then
effective Speed, then the seeded draw** — and seats the
two non-move commands (switch, bag) where the base game
seats them. The order is computed from declared data
only; it never reads anything about the player the
no-rubber-banding law (#70) protects.

## Native spec — `mochiichao/turn-order/v1`

### The order, per turn

1. **Switch commands resolve first** — a Ranger's switch
   (and a forced replacement after a faint, #10's
   interrupt) completes before any bag or move command.
   The incoming individual is on the field for everything
   that follows, including taking the opponent's move.
   (The full semantics of switching are hole H2's
   candidate spec, #247 — this item fixes only its seat.)
2. **Bag commands resolve second** — an item used from
   the battle bag (#165) lands before moves. Its target
   is whoever is on the field after step 1.
3. **Move commands resolve by priority bracket, then
   Speed:**
   - Each move carries a **priority bracket** in its
     data (registry field; default 0). Documented
     brackets run −7 … +7: negative brackets are the
     delayed classes (the counter/charge classes),
     positive brackets the first-strike classes. Values
     are move data — this spec fixes the mechanism, the
     registry fills the column.
   - Within a bracket, **higher effective Speed acts
     first**. Effective Speed = the computed stat
     (#248) × its stage multiplier (#250), with
     condition modifiers applied where a condition
     record says so (the paralysis class's speed cut is
     #182-roster data, applied at its seat).
   - **Ties break by #94's seeded draw**, recorded in
     the turn record — never by side, never by slot
     order, and reproducible in #187's replays.
4. **Reversal effects are field data, not machinery.** A
   room-slot condition record (#47) whose data carries
   the reversal flag flips the Speed comparison *within*
   each bracket (slowest first); brackets themselves
   never flip. When the record expires, the comparison
   restores. No system outside #47's records can create
   this effect.

### Where it runs

Order is computed once per turn at #10's COMMIT →
RESOLUTION boundary and frozen into the turn record;
the RESOLUTION queue then drains in that order (#10's
law: interrupts — a faint, a forced switch — jump the
queue by their own rule and are not re-sorted by this
spec). In #157 multi formats the same key orders every
side's commands together (bracket → speed → draw),
with partner-AI commands seated exactly as a Ranger's
own. #184's trigger steps (entry, on-hit, turn-end)
hang off the resolved actions in this order.

### What order never does

- It never changes mid-turn except by #10's interrupts.
- It never consults party state, story state, or the
  player's history. A faster wild Mochi outspeeds a
  slower kept one, full stop (#52's world honesty,
  applied to the turn).
- The show lane has no turn order (autonomous-action
  doctrine): Rangers sometimes command, the fight runs
  living between beats, and "who went first" is
  choreography, not a bracket.

## Wiring

Consumed by #10 (turn construction), #157 (multi
interleave), #165 (bag seat), #184 (trigger order),
#187 (replay determinism — the frozen order plus the
recorded draw seed reproduces a battle exactly).

## Coverage — honest

- **Mechanism: complete and asserted** (documented
  base mechanics).
- **Contents:** per-move bracket values are registry
  data — the column exists from this spec; moves whose
  data hasn't filled it read 0, which is the documented
  default, not an error.
