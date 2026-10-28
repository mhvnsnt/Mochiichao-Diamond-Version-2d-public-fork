# #204 — EGG-MOVE INHERITANCE → what a hatchling may know, and what it may never inherit

**Seat in the doctrine:** three systems meet at a
hatch. #171 decides which pairings are compatible
(and instances no assignments). #80 owns the
individual — its variance rolls fire at hatch
(#135). #77 owns the egg record. This package
defines the **move-inheritance rules** the hatch
consumes: given a compatible pairing and two
parents' known moves, what the offspring may hatch
knowing. #171 already anticipated the join — its
derivation treats inheritance as consumed from
#80's side. The rules live here; the rolls stay
#80's; the pairing gate stays #171's.

**What was studied.** Egg-move mechanics in the
publicly documented record: a hatchling may know,
at birth, moves outside its own level-up learnset
when a parent knows them and the species' own data
admits them — inheritance is a *bloodline* path,
gated on both sides (the offspring's eligibility
and the parent's knowledge), distinct from learning
and from teaching. The kit taken: the two-sided
gate and the at-hatch recording. No move lists,
eligibilities, or values are copied — every content
slot below ships empty.

## Native spec — `mochiichao/egg-move-inheritance/v1` (fragment beside this doc)

- **Classes (closed):**
  - `level-native` — moves the offspring species'
    own learnset grants at hatch level. **Not
    inheritance**; named only to fence it out of
    the inheritance record. A hatchling's
    level-native moves are its learnset's business
    (#129's family), and recording them as
    "inherited" would corrupt both records.
  - `inherited` — a move is inherited **iff all
    three hold**: (a) it stands in the offspring
    species' **inheritance-eligible set** — a
    per-species annex list, species data, contents
    OPEN (an *empty* annex is a legal authored
    state: the species inherits nothing, and the
    system says so rather than implying a default);
    (b) at least one parent **knows** the move —
    known = on that parent individual's move
    record, by whatever legitimate path it got
    there; (c) the pairing passed #171's
    derivation. On (c), #171's three-valued law
    binds exactly: *unknown is not incompatible* —
    but unknown is also not a pairing. No egg, no
    inheritance, no exceptions argued at the hatch.
  - Everything else is `not-inherited`. There is
    no third path, no pity rule, no story override
    inside this system.
- **THE SIGNATURE BAR — absolute, mechanical.**
  A signature move (#131 — *a signature belongs to
  its species alone*; exclusivity is checkable
  against #131's register) can **never** be
  inherited. Not cross-species: a Dorowani parent
  does not pass Water Orb to another species'
  child, however the pairing is arranged. And not
  within the species by this system either: a
  signature reaches its own species' members by
  its own canon handling (#131's register and the
  lanes' signature doctrine), never as an
  inheritance outcome. Validation rule, stated as a
  test: **any inheritance result containing a
  signature id is a data error**, full stop,
  whoever produced it — parent-knows (b) never
  outranks this bar.
- **The record.** Inherited moves are written onto
  the offspring individual's record **at hatch** —
  birth facts are stored facts (#80's precedent:
  the seed is stored; what a hatchling knows at
  birth is the same class of fact). They surface
  in #135's sequence at **FIRST BOND** — the
  registration beat is where the world first reads
  what the hatchling knows; presentation is #135's,
  the write is #80's, the eligibility is this
  package's. Three homes, one event, no overlaps.
- **Cap (PROPOSED shape, values open).** How many
  inherited moves a hatchling may carry is a data
  slot — no number is asserted. Selection order
  when eligibility exceeds the cap is likewise
  data. One rule *is* proposed, marked as such:
  **one knowing parent suffices** (gate (b) as
  written). If the owner wants both parents to
  know, the revision lands here, argued — it is
  not smuggled into an implementation.

## Wiring (proposed)

Rules beside the #77/#171 species-data docs;
consumed by #80's hatch writes; validated against
#131's register. Reads: #171 pairings, parent move
records, species annexes (empty), #131 register.
Writes: the offspring's at-hatch move record (via
#80), nothing else.

## Open slots (nothing invented)

Every species' inheritance-eligible annex (species
data — all empty today) · the cap and the
selection rule · the one-parent-suffices proposal
(owner's to confirm or revise) · every actual
inheritance event (none can occur until #171 has
assignments — 0/47 today, by #171's own coverage
read).
