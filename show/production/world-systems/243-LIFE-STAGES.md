# #243 — LIFE STAGES & AGING PRESENTATION → how old a Mochi looks is a look, not a fact that changes

**The gap this fills.** Individuals are born (hatched,
#77/#135), grow (levels, #178), and evolve (#199's
methods). Nowhere is it written how *old* an individual
looks — whether the Mochii you've had since the harbour
is drawn as the youngster it was or the veteran it is.
This spec answers with the narrowest possible claim:
**life stage is a presentation layer.** It changes how
an individual is drawn and animated. It changes
nothing the individual *is* on paper.

**How the reference record fills the same gap:**
Pokémon mostly doesn't age individuals at all — a
creature is its species' look from hatch to the Hall
of Fame, and youth exists only as separate baby species
(other species, not stages of yours). Where aging does
appear in the wider record, it is cosmetic — an old
creature greys; it does not re-stat. Mochiichao takes
the cosmetic half and gives it a derivation, because
canon here *does* grow creatures in the telling (the
show's seasons pass time; a partner's journey is long)
— but it refuses the mechanical half entirely.

## Native spec — `mochiichao/life-stage/v1` (fragment beside this doc)

- **Stage is derived from growth facts that already
  exist.** The read takes: the individual's time in
  keeping (from #80's history — the met/kept beats),
  its level (#178's derivation, from accumulated
  gain), and the species' own growth shape (the sheet's
  size/growth data — a species that matures in a season
  and a species that takes a decade read differently
  from the same raw age). Output is a **presentation
  class** per individual: `young` / `prime` / `elder`
  is the shape of the vocabulary (the class list itself
  is presentation data; three broad classes, because
  looks come in broad strokes). The exact thresholds —
  how much level, how much time, per growth shape —
  are **data**, tuned per species family in the sheet
  data pass. The derivation's *shape* is the system;
  nothing about it is left as a decision.
- **What a stage changes:** the drawn look — posture,
  size within the species' own range (#80's size_class
  bounds it: an elder is not bigger than the species
  gets, only older *in* its size), coat/plate wear,
  the rig's idle choices (#152's loops read through the
  stage — an elder's idle is slower at the edges), cry
  colour at the margins (#2's synth may read stage as a
  presentation parameter, the way it reads size). All
  of it presentation, all of it reversible by re-deriving
  — there is no stage *field* on the record to get out
  of sync, the same discipline as mood (#202).
- **What a stage never changes:** stats, moves,
  temperament (#108), quirks (#237), honours, history,
  the seed. Aging is not a system that acts on the
  individual; it is a way of *showing* the individual.
  An elder Mochii is not weaker, wiser, or worth more
  in any derivation — if canon ever wants a venerable
  elder to matter mechanically, that is a new system
  proposed on its own, not a rider smuggled into a
  look.
- **Evolution is not aging.** An evolved individual is
  its new species, drawn as that species — its stage
  read continues across the change (a young Bastihound
  who just evolved is `young` in a Bastihound's shape;
  the history is continuous, #80's record is one life).
- **Wild individuals** carry stage the same way — a
  wild elder met on a route (#7) is drawn elder. The
  read needs only the facts the encounter already
  generates (#214's wild derivation family).

## Show lane

The cast ages **in looks only, and only as canon
directs**: this package builds the machinery (a
season-3 Mochii *can* be drawn with a season of life
on her, through the same stage read) and makes **no
claim that anyone ages** — whether the show's timeline
ages its cast, and by how much, is a story/canon call
that stays the owner's, entire. The machinery waits
for the ruling; it does not argue for one. Human aging
is outside this spec altogether (human characters are
cast facts, not derived ones).

## Wiring

Reads: #80 (history), #178 (level), species growth
data (sheets), #214 (wild reads). Feeds presentation:
rig/idle selection (#152), cry colour (#2), portrait
and summary surfaces (#196/#240 — a portrait of an
elder shows an elder, per the portrait rule).
Writes: nothing.

## Open slots

One owner slot, and it is a story/canon fact, kept
open under the gap rule on purpose: **whether the
show's cast ages on screen across seasons, and how
much.** Everything mechanical is filled: vocabulary
shape, derivation inputs, the no-record-writes law.
Per-species stage thresholds are tuning data (sheet
pass), not decisions.

## Coverage — honest

- Presentation-only aging with a derivation: the
  reference record's cosmetic half, completed against
  canon's growth facts.
- Contents: zero individuals staged; the class
  vocabulary's final wording is presentation data.
