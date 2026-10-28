# #183 — HELD-ITEM BATTLE EFFECTS → what the held slot does, and when (trigger resolution)

**Doctrine seat:** #31 founded the held layer
(category `held`, `useContext.held`); #166 fills the
slot from wild drops; #109's validator reads it. None
of them says what a held item *does* in a battle, or
when. This package is trigger resolution only: the
closed trigger classes, the one-effect discipline,
and the shared firing order it agrees with #184.
**Effect values are #31 item data** (null until the
item layer sets them); no item is named, instanced,
or given an effect here.

**What was studied.** Held-item mechanics in the
publicly documented record: one item per creature,
held passively; effects that are continuous while
held, threshold-triggered (firing when the holder's
state crosses a line), reactive on dealing or taking
a hit, or consumable — firing once and leaving the
slot empty. The discipline the record teaches: the
item is data, the battle engine owns exactly one
resolution order, and an item never carries its own
combat math. The kit taken: the four trigger classes
and the consumption rule.

## Native spec — held-item trigger resolution (shape in the fragment)

- **The hook.** A held item's battle effect is a
  **single** hook on its #31 record:
  `{triggerClass, effectTarget}` — where `effectTarget`
  names a stage of #17's pipeline or a #10 queue
  behaviour (the #107 discipline: hooks compose in
  systems that exist; items carry no math of their
  own). An item naming two hooks is a **data error**,
  checker-class like #31's cure-consistency check. An
  item with no hook is inert in battle — still held,
  still read by #109's validator, simply silent.
- **Trigger classes (closed).**
  - `standing` — continuous while held: composes in
    #17's chain at the stage `effectTarget` names,
    for as long as the item is held.
  - `threshold` — fires when a stated battle fact
    crosses a stated threshold (the fact and the
    threshold are item data — a holder-HP fraction is
    the documented shape). Fires once per crossing:
    it re-arms only after the fact leaves the zone,
    so a holder hovering at the line cannot retrigger
    every turn.
  - `on-dealt` / `on-taken` — at hit resolution: the
    effect emits as a queue item **immediately after
    that hit's `damage` item** (#10's rule: cause
    precedes effect; a reaction follows its cause).
  - `consumed` — a modifier on any class above, not a
    fifth class: when a consumed item's effect fires,
    the item is spent. Consumption is a battle event
    (announced in the queue); at battle end the held
    slot on the individual's record is **empty** —
    the documented consumable-held pattern. Items
    without the modifier persist untouched.
- **The shared trigger order (stated identically in
  #184).** At any single trigger point: the acting
  side's effects resolve before the receiving side's;
  within a side, **abilities (#184) resolve before
  held items** — the creature's own trait precedes
  its equipment. Field modifiers are not triggered
  effects and are not in this ordering: they compose
  inside #17's `[field]` stage under #181's order.
- **The slot in battle: fixed at entry.** #10's
  command ring has no held-item command; the bag
  (#165) cannot reach the held slot (bag reachability
  is `useContext.battle`, a different field); no
  mid-battle equip or swap exists. **No effect in
  canon moves a held item between individuals** — if
  a future move proposes one, it needs its own
  ruling; this spec asserts no such effect and
  provides no seat for it.
- **Neighbours.** Versus (#109) reads the slot as
  data, unchanged. Rental snapshots (#159) carry held
  items that resolve identically inside the run and
  expire with it — including consumption, which
  spends the *snapshot's* item, never a real one
  (rentals own nothing; #159's non-writes hold).

## Show lane

A held item in the show is a prop a creature carries
— staging and character, read by boards — never a
trigger table. Show fights are autonomous; nothing
in this spec reaches them.

## Wiring

The hook shape is proposed into #31's effect-join
documentation (its home disposes); resolution sits
in #10's queue beside #184's ability order, which
landing implements as one ordering, not two; the
validator join is #109's (read-only); consumption
writes land on the individual record's held slot at
battle end (battle-events → record discipline, as
#177's gain facts).

## Coverage — honest

- **Architecture: fully documented** (one item, four
  trigger shapes, consumption are the published
  pattern).
- **Contents: zero items, zero effects.** Which items
  exist, which carry hooks, and every effect value
  are #31's data and the owner balance pass. The
  yield is resolution: when an item is ever given a
  battle effect, the engine already knows when it
  fires and in what order.
