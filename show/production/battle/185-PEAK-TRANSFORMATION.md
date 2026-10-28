# #185 — PEAK TRANSFORMATION SYSTEM → a class ON #130's forme axis (not a new axis)

**Doctrine seat:** #130 founded the forme axis —
`formFamily` on the species record, the individual's
active `forme` as **battle state**, criterion kinds
(`move-use | state | held | command`), direction,
deltas as family data, and E4's identity law
(silhouette primitive + signature motif persist across
forms). Peak transformation — the battle-only,
story-gated, once-per-side transformation of the
documented record — is specified here as **a class of
forme on that axis**, distinguished by its entry
conditions and its discipline, reusing every #130
mechanism. A parallel transformation system beside
#130 would be exactly the axis-merging #130's opening
table forbids.

**What was studied.** Peak/burst transformation in the
publicly documented record: a transformation beyond
ordinary forme change, gated by a key item *and* an
earned story/bond state, usable once per side per
battle, dramatically staged, and reverted when the
battle ends — its power is narrative as much as
mechanical, which is why its conditions are facts
about the story, not stats. The kit taken: the
dual gate (item + fact), the one-per-side discipline,
class-level one-way direction, and mandatory
reversion.

## Native spec — the peak class (annex shape in the fragment)

- **The class flag (proposed into #130's home).** A
  form in a species' `formFamily` may carry
  `peak: true` — a proposed field in #130's fragment,
  landing in #130's file with this package cited. A
  peak form is otherwise an ordinary #130 form: its
  `statBlock` / `typeDelta` are family data (zero
  asserted), its active state is the battle-state
  `forme`, its presentation rides #130's hooks.
  **Strikechamp's `unsuited` forms are not asserted
  to be peak** — their criterion is #130's OPEN slot
  and stays untouched.
- **Entry conditions (the class definition).** A peak
  form's criterion is #130's `held` kind, gated by
  **both**:
  - a **#31 item condition** — the individual's held
    slot carries the family's named item id (read by
    the same seat #183/#109 use), and
  - a **#12 story fact** — a named fact in the family
    record's `requiresFacts[]` stands true.
  Either missing, the criterion cannot fire. The
  criterion record's shape admits further fact kinds
  by data; contents are OPEN per family. (Bond as a
  third gate is *not* asserted: #180's bond is a read
  with its own table, and no family here names it.)
- **One per side, once per battle.** Per battle, per
  side, at most one individual may enter a peak form.
  In the game lane the shift is offered as a command
  surface on the acting individual's turn when the
  entry conditions hold **and** the side's peak use
  is unspent; otherwise the command is absent —
  refused legibly, never silently (#38's legibility
  discipline). Once spent, no second shift on that
  side this battle, even if the first form ends.
  **Direction for the class is `one-way` within the
  battle** (a #130 direction value, fixed for the
  class): a peak form does not revert mid-battle
  except at faint or battle end.
- **Reversion: at battle end, always, stored
  nowhere.** The peak class sets `persistAfterBattle:
  false` **by class law** — a family record may not
  override it for a peak form (ordinary forms keep
  #130's per-family rule). A faint ends the form; a
  re-entering individual comes in at the family's
  default form.
- **Exclusivity is a data slot, OPEN.** Which species
  classes may hold peak forms at all is a registry
  slot, `peakEligibleClasses`, shipped `null`. The
  documented pattern's mythical-class exclusivity is
  **not** asserted — whether peak transformation is
  mythical-only, signature-linked (#131), or broader
  is an owner ruling, and this spec's class machinery
  works under any of them.
- **Presentation.** The shift stages through #42's
  transformation-sequence grammar (announcement →
  held pose → change channels in fixed order →
  background divorce → landing), performed via #9
  animscript blocks under #130's presentation hook,
  with E4 identity holding: a "peak form" that breaks
  the silhouette primitive is a different species
  wearing the name, per #130.

## Show lane

Under the autonomous-action doctrine, a show peak
transformation is **the creature's own moment** — its
effort and its choice, staged at a story beat the arc
rules (#82) sanction. A Ranger may witness, call out,
hope; the game lane's command surface does not exist
on screen, and no show transformation is ever *a
command effect*. The item/fact gate is game-lane
data; the show expresses the same truth as story —
the creature transforms when the story has earned it,
which is the gate, in the show's grammar.

## Wiring

The `peak` flag and criterion shape are proposed into
#130's fragment home; entry reads #31 (held slot) and
#12 (facts); the command surface joins #10's ring at
landing; presentation joins #42/#9. No save impact:
active forme is battle state (#130), and the class
law forbids the persistence path #130 left per-family.

## Coverage — honest

- **Architecture: fully documented** (dual-gated,
  once-per-side, reverting transformation is the
  published pattern).
- **Contents: zero peak forms.** No species is given
  one; Strikechamp is explicitly not claimed; the
  eligibility class set, every family's item/fact
  gates, and all deltas are OPEN. The yield is the
  class machinery on the existing axis — so a peak
  form, when ruled, is a flagged row in a family the
  programme already has.
