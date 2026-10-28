# #213 — FRAGMENT CASE PRESENTATION → the circuit, carried in the hand

**Doctrine seat:** #98 founded the Fragment case and
fixed what it *is*: a **view specification, not
data** — one slot per dojo in circuit order, a slot
lit iff its `progress.dojo_r1_NN_clear` flag exists,
dim otherwise; holding a Fragment *is* the flag
existing (no fragment item, no inventory, nothing to
store); and the case can never claim a Fragment the
gate would deny, because gates and case read the
same flags. #98 then left one thing open by name:
*"Case presentation (materials, arrangement, the
physical object's design) is OPEN — the same class
of owner decision as the Mochiioteca's physical
design (#81)."* This package specifies the
presentation **grammar** that lives inside that
openness — how the case renders, reads, travels,
and completes — while leaving the object's look
itself exactly where #98 put it: with the owner.

**What was studied.** Badge-case presentation in
the publicly documented record (the reference
games' case screens: slots in circuit order, earned
tokens lit, the case as the circuit's portrait) and
#98's own show echo: a Ranger opening the case is
the circuit drawn for the audience, and scripts
reference case state by flag id so a script can
never show an unearned Fragment.

## Native spec — `mochiichao/fragment-case-presentation/v1` (fragment beside this doc)

- **The render (a derivation, per #98).** The case
  view is computed at read from #12's flags over
  #45/#143's circuit order: Region 1 — eight slots,
  linear order, each `lit | dim` by its flag. No
  case state is stored anywhere; the case in the
  hand and the case on the licence (#98) and the
  gate's reading (#11/#45) are three renders of one
  flag set, incapable of disagreeing.
- **Presentation states beyond lit/dim** (all
  derived at render, none stored):
  - **`next`** — in a linear circuit, the earliest
    dim slot is the case's visual focus (the slot
    the eye is drawn to; in a loosened-order region
    per #143, `next` is the set of currently
    reachable dim slots — the derivation follows
    the region's ordering rule, never a second
    rule here).
  - **`case-complete`** — all slots lit: the case
    renders the circuit whole. Completion is a
    render state of the region's case, not a flag —
    #100's gauntlet reads the same flags for its
    own gate, and no package writes a "case done"
    fact for the case's sake.
  - **Region face** — one case view per region
    circuit (#143's slots): the grammar is region-
    agnostic; contents inherit #143's openness
    (Region 1 instanced; Regions 2–5 circuits are
    #143's OPEN slots, and their cases render
    nothing until their circuits exist).
- **Carried-object continuity.** The case is a
  physical object the Ranger carries — #116
  wardrobe-adjacent (it travels with the Ranger's
  presentation; outfit contexts home/field/ceremony
  govern where it appears on the person) and #150
  field-kit-adjacent (it is *carried gear*, with the
  kit law's discipline inverted: the case is not a
  kit slot and grants nothing — it displays). Show
  continuity rule (extending #98's echo): the case
  on screen shows exactly the flags the record
  holds at that story point — #82 conservation
  applies to props, so an episode's case is checked
  against the arc's flag state like any other
  continuity fact.
- **The case in ceremony.** #216's completion
  ceremony presents the case as the circuit's
  portrait at the run's end (the grammar joins
  there); the case also appears at #98's licence
  moments (issue, tier derivations) as the same
  render. One object, one derivation, every stage.
- **What this package refuses.** The object's
  materials, form factor, and ornament (owner OPEN
  per #98 — a grammar cannot settle a design);
  Fragment items or inventory in any form; case
  "upgrades" as data (a fancier case is a #116
  presentation fact, not a progression fact); any
  stored case state whatsoever.

## Show lane

Covered above: the case is the show's circuit
graphic carried in the hand — opening it is the
audience's progress recap, earned slots only, under
#82 prop conservation. A case shown fuller than the
record is a continuity defect of the same class as
an unearned Fragment in dialogue.

## Wiring

Reads #12 flags + #45/#143 circuit order; renders
beside #98's licence view (same derivation, cited
both ways); continuity joins #116/#150 at landing;
ceremony joins #216. Nothing is proposed into any
file — #98 already owns the case; this package is
its presentation annex and lands beside it.

## Coverage — honest

- **Grammar: fully specified** for Region 1 (the
  only instanced circuit) and region-agnostic by
  construction for the rest.
- **Contents:** the physical design remains OPEN
  (owner), exactly as #98 left it; Regions 2–5 case
  contents wait on #143's circuits, not on this
  package.

## Open slots (nothing invented)

The case's physical design (owner, inherited from
#98 — deliberately not narrowed here) · render
motion/timing values (production) · whether loosened
circuits render `next` as a set or a path (#143's
ordering data decides when it exists).
