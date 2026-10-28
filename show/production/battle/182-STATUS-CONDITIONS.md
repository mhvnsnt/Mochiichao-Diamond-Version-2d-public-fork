# #182 — STATUS CONDITION SYSTEM → the battle layer #27 assigned (resolution over #27's records)

**Doctrine seat:** #27 already founded the condition
record — the two classes, **`persistent`** (one at a
time, survives the battle) and **`volatile`** (several
may stack, battle-scoped, cleared on switch); the
`effect` hook shape with every value null; `cureBy`
joins to #31; the icon grammar — and it left the
roster, every name, and every number OPEN, noting
that the persistent exclusivity rule "is enforced by
the battle layer, not the record." **This package is
that battle layer**: application, tick sequencing,
and cure-route mechanics over #27's records. (The
commissioning brief's "non-volatile" is #27's
`persistent` — same class; #27's word governs, and
this spec uses it throughout.) No condition is named
or instanced here; naming remains the owner canon
pass #27 flagged. The vocabulary is native and the
mechanics come from public documentation — nothing
is copied from any source game's roster.

**What was studied.** Condition resolution in the
publicly documented record: application as an effect
on a move/ability/item, resolved in the turn queue
with immunity checks; persistent exclusivity enforced
at application; end-of-turn residual ticks in a fixed
order against field effects and faint checks;
volatile conditions evaporating on switch; cures via
items in battle and full service cures out of it. The
kit taken: check order, tick order, and the cure-route
map — the resolution truth #27's records presuppose.

## Native spec — condition resolution (record shape in #27's schema; no fragment)

- **Application.** An application is an effect hook
  on a move, ability (#107 status hooks), or item
  record naming a #27 `conditionId`. It resolves
  inside #10's `RESOLUTION` as a `status` queue item
  (the queue kind #10 already defines). **Check order
  at resolution, fixed:**
  1. **Field block** — an active field condition's
     `status_block` (#47) naming this condition ends
     the application (shown, per the legibility
     discipline #38 set for refusals).
  2. **Ability immunity** — a #107 status hook on the
     target naming the condition or its class.
  3. **Class rule** — persistent: the target already
     carrying a persistent condition fails the
     application (shown as a `status` message; the
     acting side's turn is spent — application was the
     action). Volatile: stacks, subject to the
     record's own data.
  Application chance, where a hook carries one, is the
  **applying record's** data (move data), resolved in
  #17's accuracy terms — the condition record carries
  no application chance, and #27's null effect values
  stay null until the balance pass.
- **Ticks.** Per the record's `tick.timing`:
  - `end-of-turn` ticks resolve in #10's `END_CHECK`
    in this order: **field ticks/expiry (#47/#181) →
    condition ticks → turn-end abilities (#184)** —
    and faint `interrupt` items outrank all of it,
    jumping the queue whenever they occur (#10's rule:
    nothing outranks a faint).
  - `on-attempt` ticks (the `action-gate` kind) resolve
    at the attempt, inside `RESOLUTION`, before the
    acting individual's move resolves: a gated action
    fails as a `status` queue item and the turn is
    spent. Stated here so landing implements one
    behaviour.
  - `continuous` (the `stat-stage` kind) is not a
    tick: stages compose in #17's chain for as long
    as the condition is active — read, not event.
- **Cure routes (closed).**
  - **In battle:** #165 bag commands whose item's #31
    record stands in the condition's `cureBy` join
    (the bidirectional data check #31 already
    specifies); move/ability cure hooks naming
    condition ids.
  - **Switch:** volatile conditions clear when their
    holder switches out — by their class definition,
    not as a cure event. Persistent conditions never
    clear on switch.
  - **After battle:** #132's centre `cure` service —
    persistent class only (volatile conditions have
    already ceased with the battle), performing what
    `cureBy` performs, as a service (#132's own terms:
    "no second cure system"). `fullHealClears` (#27)
    governs service/item full-cures.
  - **Decay:** a condition may carry a data rule for
    time/chance-based clearing — shape noted, **no
    record exists to carry one**; none is asserted.
- **Field behaviour (the #152 join).** A *persistent*
  condition is a state the world can see: Garden and
  field presentation read it (the individual rests, is
  tended — #65's care loop already *consumes* the
  status system on exactly these terms). Read-only:
  a condition never edits the behaviour profile
  (#152), temperament (#108), or the personality seed
  (#80). **A condition is a state, never a personality
  change.** Volatile conditions have no existence
  outside the battle object at all.

## Show lane

#27's line stands, unextended: show conditions are
performance/FX states needing an owner ruling; the
STATE language (Base/Bright/Guard/Overwhelm) is
emotion, not status, and the two are never conflated.

## Wiring

Resolution sits in #10's queue/`END_CHECK` beside
#47's ticks; records stay in #27's schema home;
cure joins read #31 (via #165 in battle, #132 after);
immunity hooks read #107; presentation reads join
#152/#65. Landing's negative tests: a second
persistent application fails legibly; a volatile
condition cannot be found on any record after its
battle; a centre cure touches persistent only.

## Coverage — honest

- **Architecture: fully documented** (application
  checks, tick order, cure routes are the published
  pattern; the queue seats are this programme's own
  verified #10/#47 shapes).
- **Contents: still zero conditions.** The roster,
  names, and every effect value remain the OPEN owner
  canon pass #27 flagged. The yield is resolution
  truth: when the first condition is ever named, its
  record already knows how it will apply, tick, and
  cure.

**Landing note — List 30 (2026-10-27).** #289 (`show/production/battle/289-FRENZY.md`) lands its frenzy condition in #27's schema family (volatile class), with the closed-heart application gate as a record-level class rule this file's check order reads; the keeper's call seats in #10's command ring beside #165's bag refusal. Negative tests carried from #289's spec: an open-hearted individual cannot be frenzied, and a frenzy never writes a #269/#270 fact.
