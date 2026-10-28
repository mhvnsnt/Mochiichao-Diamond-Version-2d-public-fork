# #337 — RAISED VARIATION → two of one species, raised differently, are visibly two lives

**OWNER'S DIRECTION (Jamar, 2026-10-27):** raising
has Chao-Garden depth in this game — how a Mochi
is raised (its stats, its care, its bond and
friendship, the moves it learns) visibly changes
what it becomes, **throughout all generations and
species, within species envelopes.** "Get our own
version of all of that stuff in our universe 100%."

**The seat this fills, honestly.** Three neighbours
already stand, and this spec is the floor they were
missing — it does not refound any of them:

- **#80** founded the individual record: rolled
  variance (numeric, invisible, same model sheet for
  every individual) and **deviations** (visible,
  feature-level, RULED by the owner for named
  individuals — #318's register indexes them).
- **#293** founded Garden raising depth: feeding,
  checkup grades, and **alignment drift resolving
  into visible form at growth moments**, recorded as
  a #80 presentation fact. #293's drift is one
  channel — keeper alignment — read from Garden acts.
- **#322** (List 33, mid-build) generates small
  variation from the personality seed at creation.

What none of them says is the owner's sentence
whole: that an individual's **whole life of being
raised** — care, bond, moves, activities, places,
rest — continuously shapes how it looks and carries
itself, for every raised individual, named or not.
That general read is this spec: the **raised-
variation engine**. #293's alignment-form is one of
its input channels (#338 names the full set); #329
(List 34, mid-build) owns what raising does to
*evolution branches*; this spec owns what raising
does **within a life and a stage**.

## Native spec — `mochiichao/raised-variation/v1` (fragment beside this doc)

- **Drift is a read, never a stored form.** The
  engine derives an individual's current drift —
  a small set of presentation values — from its
  raising facts (#338's closed read set) at read
  time, exactly the way #243 derives life stage and
  #202 derives mood. **There is no form field on
  #80's record, and landing may not add one.** What
  a renderer needs is computed; what history needs
  is already in the facts.
- **The channels (closed list).** Drift speaks in
  exactly four channels, each a bounded presentation
  parameter, none of them a fact about anatomy:
  1. **Posture & bearing** — openness, readiness,
     ease: how the individual holds itself standing,
     resting, approached. (Read by #152's behaviour
     layer, which stocks the loops the bearing
     selects among — the same seat #243's stage
     reads through.)
  2. **Proportion emphasis** — the silhouette's
     *emphasis* within #80's `size_class` bounds:
     sleeker here, sturdier there — never a size
     change, never a silhouette change (#341 owns
     the emphasis vocabulary this channel speaks).
  3. **Palette warmth** — a render parameter at the
     margins of the species' locked colourway, the
     same class of parameter as #243's cry colour:
     warmth/coolness and wear of finish **within**
     the Lustre Law fence. Drift never recolours,
     never adds or removes a colour block, never
     touches an identity colour (#293's fence,
     inherited verbatim).
  4. **Surface & wear** — the finish of a lived
     life: gloss, scuff, weather-touch, grooming
     state, at the level a still can show. Wear is
     biography, not damage — damage is #287's
     territory and ordinary raising never reaches
     it (#293's fence, inherited).
- **Gradual, early, settling.** Drift accrues from
  the first raising facts — a young individual's
  drift is small but already readable — and grows
  with the life. At **growth moments** (#199
  evolution, #243's stage boundaries) the settled
  portion resolves into presentation facts by
  #293's mechanism (recorded so every later render
  reproduces it — #196's law), and the live read
  continues from the settled base. Settled is not
  frozen: the *next* growth moment re-settles from
  the facts as they then stand, so a life that
  changes direction can change looks across a stage
  boundary — a rescued individual's recovery is
  allowed to show (#339 states the bond side of
  this; #288's purification is the extreme case and
  stays #288's).
- **The envelope test (checkable, two halves).**
  Every drift output must pass both:
  - **One species:** the model sheet still governs.
    Drift may not change a silhouette read, add or
    remove a part, change a posture *class* (the
    bipedal/quadrupedal class is anatomy — a drift
    to "stands differently" means bearing within
    the species' posture, never a new posture
    class), alter eye construction, or move any
    trait a #318 register entry could describe.
    **The register's entry form is the negative
    space of this vocabulary:** if a drift output
    could be written as a register entry, it is
    out of envelope, full stop.
  - **Two lives:** two individuals of one species
    with materially different raising histories must
    be distinguishable at sight by a viewer who
    knows the species — in a still, without a
    caption. If the drift is too subtle to pass
    this half, it is not variation, it is noise.
- **Composition order (who wins, stated once).**
  A render composes: species sheet → #322 generated
  variation → settled drift facts → live drift read
  (this spec) → #243 life stage → #202 mood.
  **#80 RULED deviations bind as exclusions over
  the whole stack:** no channel may read, write, or
  approximate a trait named in a `deviations[]`
  entry — a ruled trait is that individual's
  character, and drift walks around it (#237's
  precedent: ruled deviations outrank derived
  layers). Drift never applies to a trait under
  ruling, even in the opposite direction.
- **Who has drift.** Every individual with raising
  facts: kept partners, Garden residents, NPC
  partners, cast. **Wild individuals** read drift
  from encounter-generated facts (#243's wild
  precedent, #214's family): a wild life is a
  raising too — weather, territory, hunger seasons
  — and #346's show read depends on it. An
  individual with no facts reads zero drift: the
  species sheet, plain. Zero is a reading, not a
  missing value.
- **What drift never does.** No battle number (the
  #293 line: battle stats are species base + #80
  variance + #39 effort + #178 growth, earned in
  battle/training — drift's fragment schema, like
  #293's effect records, **has no field capable of
  naming a battle stat**). No evolution destination
  (#329's branch layer reads care facts itself;
  drift is not its input). No obedience, bond, or
  outcome effect except through systems that declare
  one (#180's rows are #180's). Drift is how a life
  **shows**. Showing is the whole claim.

## Show lane

The show renders named Mochi from this read (#346
owns the casting discipline). A partner who has
been with a character for a season should not look
like a stock sheet with a name — the drift read is
why. No meters, no before/after captions: bodies.

## Wiring

Read set defined in #338; channels consumed by
#152 (behaviour), #196 (renders/portraits —
settled facts must reproduce), #243 (composition
neighbour), #346 (casting). Settlement rides
#293's growth-moment mechanism — proposed as an
extension in #293's home, not a second mechanism.

## Open slots

Story/canon facts only: none at the engine level.
Per-family drift vocabularies (what "weathered"
looks like on a water species vs a plant species)
are art-lane data beside the sheets — contents
slots, the channels land complete.

## Coverage — honest

- **Architecture: fully specified** — the read, the
  four channels, the settling, the envelope test,
  the composition order, and the fences against
  #80/#318/#322/#329 are all stated as rules.
- **Contents: zero** — no drift values, vocabularies,
  or per-species parameters are instanced; those
  are data passes over the sheets, owned by the
  lanes that own the sheets.
