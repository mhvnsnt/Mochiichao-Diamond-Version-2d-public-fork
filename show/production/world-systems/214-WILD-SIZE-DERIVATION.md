# #214 — WILD SIZE DERIVATION → the owed derivation, proposed home

**Doctrine seat:** List 17's #161 founded size
records and registered, as its **single dependency**,
the thing it could not itself supply — quoted from
#161's file: *"`measure` is null-shape-wide. The
field that carries the number does not exist yet.
The owed work, stated as this system's single
dependency: a species base measurement (owner/
data-lane, per species — the same TBD slot as
height/weight in the audit) composed with individual
variance (the derivation — e.g. whether #80's
`size_class` or a dedicated size variance drives
it — is a data-lane design decision, OPEN)."* This
package is the candidate answer to that dependency:
it proposes the derivation **into #161's home**,
per the proposal discipline (a proposal lands only
in its owner's file, citing this package — the #58
`RIDDEN` precedent). Until #161's home accepts it,
the derivation is spec-level and nothing in this
package instances a measurement.

**What was studied.** Size variance in the publicly
documented record: the reference games' per-
individual size variation (a species base composed
with an individual factor, classed for display) and
this programme's own variance machinery — #80
founded `size_class` (`small | standard | large`,
derived from the individual's seed, weighted) under
the doctrine that **one roll drives many reads**,
and #43's scale chart already consumes `size_class`
for display.

## Native spec — `mochiichao/wild-size-derivation/v1` (fragment beside this doc — the proposal destined for #161's home)

- **The derivation.** At encounter generation, a
  wild individual's measure derives as:

  ```
  measure(individual) = base(species) × factor(size_class(individual))
  ```

  where `base(species)` is the species' base
  measurement (**species data — TBD for every
  species today**: the Gen 1 audit found height/
  weight recorded nowhere, and #161 carries the
  same slot), `size_class` is #80's seed-derived
  class, and `factor` maps the three classes to
  multipliers — **shape only**: small < 1,
  standard = 1, large > 1, symmetric in intent.
  Every numeric factor value is data-lane data,
  OPEN; this package asserts the composition, not
  a single number.
- **Why `size_class` drives it (the proposal's
  argument, for #161's home to accept or decline).**
  #161's own text names `size_class` as the
  candidate. #80's doctrine settles the rest: the
  individual's variance is one seed driving many
  reads — a second, dedicated size roll would make
  the same creature large to the scale chart (#43
  reads `size_class`) and standard to the tape, a
  contradiction two systems would then have to
  reconcile forever. One driver, every consumer:
  encounter derivation (here), #43 display, #83's
  sprite presentation scaling (within #80's
  silhouette tolerance — size variance never
  rescues or breaks a silhouette read), and #161's
  records when they fire.
- **Encounter-transient, fact only under #161's
  rules.** The derived measure exists for the
  encounter (the wild individual's presented size —
  in-field scale, battle presentation) and is
  recomputed from the seed on demand; it is **not**
  a stored fact. It becomes a #161 measurement fact
  only where #161 already says facts are written:
  at a keep (#38's kept moment) and at a contest
  presentation. A wild encounter that ends without
  a keep produces no fact — #161's sentence stands
  verbatim: *you cannot record the size of a
  creature you only saw.* This package changes none
  of #161's write rules; it supplies only the number
  those rules carry.
- **Honest empty state.** Until species base
  measurements exist, the derivation returns #161's
  specified empty state (no measure, no dressed-up
  placeholder) — the composition is ready the day
  the data lands, and until then every consumer
  reads the same honest nothing #161 already reads.

## Show lane

A wild individual's size on screen is casting +
#152/#83 presentation, never this derivation — the
show does not measure creatures. (A "huge one!"
beat in an episode is story; if the game ever
records that individual, it does so by the rules
above, not by the episode's framing.)

## Wiring

The derivation is proposed into #161's file as an
edit citing this package (its home disposes — the
dependency slot is #161's to close); `size_class`
reads #80 unchanged; display consumers #43/#83 are
cited, not modified; the base-measurement slot is
the species record's (data lane — the same TBD the
audit and #161 both carry).

## Coverage — honest

- **Composition: fully specified** and argued from
  verified text (#161's dependency paragraph, #80's
  class + doctrine) — as a **proposal**. Its
  acceptance lives in #161's home; this package
  does not close #161's dependency by its own say.
- **Contents: zero measurements.** Base values for
  all species remain TBD species data; factor
  values remain OPEN data. Nothing here can be run
  against a real creature until the data lane
  supplies bases — stated so no landing PR
  describes the derivation as data-wired.

## Open slots (nothing invented)

Every species' base measurement (data lane, per
species — the audit's height/weight TBD) · the
three class factor values (data) · whether measure
is one number (length) or a pair (height/weight)
— #161's record shape carries the question; the
derivation composes per component if the pair
lands, and the proposal says so in #161's edit.
