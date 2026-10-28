# #199 — EVOLUTION METHODS SYSTEM → the system layer over #8's edge model

**Seat in the doctrine:** the vocabulary already
exists, and this package mints no second one. #8
(EVOLUTION-DATA-MODEL) built the edge list — every
evolution in the world is one edge
`{from, to, methodClass, trigger, conditions[],
representation, status}` — with the method-class
enum **`growth | level | bond | colony | form-shift
| item | trade | place | time`**, and `single-stage`
expressed as the **absence** of an edge (the schema
forbids placeholder edges). #199 is the layer above
that model: how a line *declares* its method per
stage on its sheet, and what each class means when
the game consumes it.

> **Clarification (registered in STAGING):** the
> commissioning brief names an "exchange" class.
> In #8's verified vocabulary that class is
> **`trade`** — exchange between Rangers. This
> package uses #8's names throughout; renaming the
> class here would fork one vocabulary into two
> homes, which is the exact failure the real-code
> wiring law exists to prevent.

**What was studied.** Method taxonomies in the
publicly documented decomp record: a small closed
enum of method classes, an operand per edge, extra
gates carried as conditions in the world's shared
condition shape. The kit taken is #8's own, already
native — this package contributes declaration
discipline and consumption semantics, not new data
shapes.

## Native spec — the method layer over `mochiichao/evolution-edges/v1` (#8)

- **Declaration is per edge, on the sheet.** The
  sheet's prose Evolution field is the declaration
  (#8's fields-only rule: the prose is the record;
  the edge is derived from it at coding time, as
  `evolution-edges.wave1.json` already does for 64
  wave-1 edges). Per stage means per edge: a
  three-stage line declares **two** methods, and
  they may differ — a `growth` first edge and a
  `bond` second edge is legal, ordinary data.
- **Consumption semantics, per class** (what a
  consumer checks at the evolution moment):
  - `growth` — stage progression itself; `trigger`
    stays null until the canon lock sets numbers
    (#197). All 64 wave-1 edges are this class
    today, because the sheets set no numbers by
    design.
  - `level` — threshold read against the
    individual's derived level (#178). Gen 1 core's
    29 edges in `evolutions.json` are this class —
    structured already, mapped by #8, **never
    re-encoded** by this package.
  - `bond` — reads the bond/care facts (the #39
    family). Battle expression of bond is #180's
    lane; an evolution consumer reads the underlying
    facts, not #180's presentation.
  - `colony` / `form-shift` — wave-1 sourced classes
    (the design lane's C4 disclosures: colony
    formation; "the dome gains the face").
    Consumption is line-specific and defined on the
    sheet; **no generic engine semantics are
    asserted** for either.
  - `item` — the item is consumed from #31's layer
    through #91's evolution-items family; the
    edge's `trigger` names the item id. Class
    exists; canon edges: none yet (#8).
  - `trade` (the brief's "exchange") — fires
    **inside #168's transfer protocol**, as part of
    the exchange completing — never as a field
    action performed on a kept Mochi. #168's record
    semantics are untouched: the keeper seat
    rewrites, and the evolved individual is the
    *same* individual, form changed by the
    exchange's completion.
  - `place` — reads the individual's current area
    state (#7). #8's own note stands: candidate
    shape for habitat-locked lines; no canon
    instance asserted.
  - `time` — reads #19's clock band. No instance
    asserted.
- **Show-lane mirror.** In the show an evolution is
  the creature's own growth moment (the
  autonomous-action doctrine): the method is
  **biography, never a trigger**. A script may show
  the bond, the place, the item as the moment's
  *meaning*; no Ranger pulls a method like a lever,
  and no method is a mechanic the script invokes.
  Treating a method as biography is this system used
  correctly; treating it as a device is a doctrine
  violation, flagged for script review.
- **The A9 fence — untouched.** The pair-merge
  edges (Lonelily → Pairbloom → Twinvow) carry
  `representation: "OWNER_DECISION"` in #8's data,
  and #103's flag stands with them (the word
  "fusion" was refused there because it collides
  with these edges). This package defines **no**
  consumption semantics for pair-merge
  representation: how a pair occupies roster
  representation is the owner's decision, cited
  here, not resolved, not routed around.
- **The numbers fence.** Trigger values are null
  across wave-1 by design. A declared method with a
  null trigger is a complete declaration awaiting
  the lock act (#197) — not a gap this package
  fills, and not a defect in the sheet.

## Wiring (proposed)

Lands as a citation + semantics layer in #8's home
(the evolution package) — **zero schema edits, zero
vocabulary edits**. Reads: #8 edges, sheet prose,
and per class: #178 level, #39 bond facts, #31/#91
items, #168 protocol, #7 area state, #19 clock.
Writes: nothing.

## Open slots (nothing invented)

Any line whose sheet prose leaves its method
ambiguous (a per-line data-lane reading) · all
trigger values (lock-time, #197) · generic
`colony`/`form-shift` semantics if canon ever needs
them · A9 pair-merge representation (**OWNER
DECISION** — #103's flag, carried verbatim).
