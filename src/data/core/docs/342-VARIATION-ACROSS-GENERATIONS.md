# #342 — VARIATION ACROSS GENERATIONS → a lineage raised one way starts to look like itself

**The gap this fills.** #337's drift dies with the
individual in every spec so far — each hatchling
starts from the plain sheet plus its seed. But the
owner's direction says variation runs **throughout
all generations**, and the Chao record agrees: in
the documented system, grades and leanings pass a
bounded slice down (a well-raised line throws
better-raised young), and Pokémon's own inheritance
(#80's bounded variance slice, #204's move path)
has always let lines drift without leaving the
species. This spec is the generational layer of
raised variation: what a distinctively-raised
parent's offspring *starts* with — stated as an
echo with hard bounds, because the failure mode
(Lamarckian overwrite: the child IS the parent's
life) would dissolve #80's whole doctrine.

## Native spec — `mochiichao/lineage-variation/v1` (fragment beside this doc)

- **The lean.** At hatch, an offspring's #337
  drift read gains a **starting lean**: a bias in
  the derivation, sourced from its parents'
  *settled* drift classes (the growth-moment facts,
  #337/#293) in the channels the parents agree in.
  - **Bounded:** the lean is at most **one class-
    step** in any channel — a lean, never a look.
    The offspring is born *toward* its parents'
    shape, visibly only in the way a family
    resemblance is visible: you see it once you
    know the parents.
  - **An echo, not a fact:** the lean is **computed
    at read time from the parents' records** while
    those records stand — nothing is written onto
    the offspring's record at hatch (the contrast
    with #204 is deliberate: inherited *moves* are
    birth facts, written at hatch by #204's rule;
    a lean is a *reading* of two records, and it
    lives in the derivation, per the derivational
    house style — #14/#96's law: countable/derived
    things are derived at read, never stored).
  - **It decays unless lived.** The lean's weight
    fades as the offspring's own raising facts
    accrue (#338's recency weighting works against
    it from the first meal): a child raised
    opposite its parents ends up its own shape,
    with the lean readable only in its earliest
    presentation. Sustained by like raising, the
    lean never *grows* past its bound on its own —
    the offspring's own drift does the growing.
- **The fences (inherited from the neighbours,
  verbatim where they bind).**
  - **#80:** deviations are **never inherited** —
    a ruling is about a person, not a gene (#80's
    own rule 2 family). The lean can never carry,
    imitate, or approximate a parent's RULED
    deviation: if a channel would echo a trait
    under ruling, that channel reads zero lean.
  - **#204:** the move-inheritance path is
    untouched and separate — moves inherit by
    #204's gates (including its absolute signature
    bar); presentation leans by this spec; the two
    systems share a hatch and nothing else.
  - **#324 (List 33, mid-build — cited by subject):**
    species anatomy **reasserts at evolution** —
    no lean, and no accumulated drift, survives an
    evolution except as re-derived from the new
    stage's own facts and settled presentation
    (#337's settling already encodes this; the
    lean adds nothing across a stage boundary).
  - **Envelope:** the lean lives inside #337's
    envelope test by construction — it biases
    channels that are themselves envelope-bound,
    and a one-step bias of a legal channel is a
    legal read.
- **The family look (emergent, derived).** A
  lineage raised one way for generations shows a
  **house style**: same lean, refreshed each
  generation by like raising, plus each
  generation's own drift on top. This spec names
  that emergence as the candidate mechanism
  behind the world's regional house styles — the
  way a region's Mochi of one species come to
  look like *that region's* — and seats the read
  beside **#198's regional views**: a regional
  "look" cited in a dex view should be traceable
  to raising culture (keepers, climate of care,
  local work) read through this spec, **never** to
  a minted regional form. Regional *forms* are
  #40/#205's axis and this spec mints none — a
  house style is a resemblance, a form is anatomy,
  and confusing them is the exact error #205's
  separation law exists to prevent.
- **Wild lines.** Offspring of unknown parents
  read lean-less (the paperwork rule, #338:
  absence is not neglect and not lineage). A wild
  population's shared look, where one exists, is
  read by #346/#214's wild-facts route — territory
  and weather raising a population in parallel —
  not by this spec's parentage read.

## Show lane

A breeder's line, a family's partners across a
time-skip, a returned elder meeting a grandchild
who stands the way it stands: the show casts
lineage from this read (#346), and a house style
becoming visible across a season is one of the
cheapest deep-continuity pays the programme owns.
No genetics dialogue, ever — resemblance is drawn.

## Wiring

Reads parents' settled drift facts (via #337's
settlement records on their #80 records) at the
offspring's read time; joins #77's hatch moment
as a derivation input (writes nothing into the
egg record); cited by #198 (regional look
tracing) and #346. #204's hatch writes are
untouched.

## Open slots

Story/canon facts only: none. The lean's decay
rate and class-step size are balance data; which
lineages canon actually keeps (named families,
breeder houses) is content the read serves when
written, not a slot this spec parks.

## Coverage — honest

- **Architecture: fully specified** — the lean,
  its bound, its read-time (never stored) seat,
  its decay, and the four fences.
- **Contents: zero** — no lineage is instanced,
  no decay values asserted, no regional look is
  claimed for any region.
