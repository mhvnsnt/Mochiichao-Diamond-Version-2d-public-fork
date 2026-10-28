# #293 — RAISING DEPTH → Chao-grade care in the Garden

**Doctrine seat:** Mochiichao's own root is *Chao
Garden + Pokémon* — the Garden (#28) is canon core,
not a side mode. #28 already founded the care
profile: five axis slots, drives, and a keeper-steered
**alignment** value (−1..+1). What it lacks is the
documented Chao *depth*: what feeding actually does,
what an animal-equivalent gift does, how alignment
shows on the body, and how any of it is judged. This
package supplies that depth on #28's record — it
extends #28, it does not refound it. And it must
draw one hard line, in the open, before anything
else is built on it:

## The line this spec draws: care stats are NOT battle stats

**Raising never changes battle stats.** Feeding,
gifts, and care raise **care-axis values** that
govern Garden life and **care sports** (#294) —
full stop. Battle stats stay exactly where Pokémon
puts them: species base + #80 variance + #39 effort
+ #178 growth, earned in battle and training, and
read by #17. A fed Mochi is a *thriving* Mochi, not
a stronger one.

**The defence, plainly.** (1) *The base rule decides
ties:* where two parent designs disagree, Pokémon's
way governs battle — because battle is the game's
public promise (PvP, facilities, #109's lobby all
assume battle stats mean the same thing for every
player). Chao's way — where what you feed a creature
literally builds its numbers — governs the Garden,
because the Garden is where raising *is* the game.
Each parent rules its own house; neither colonises
the other's. (2) *The alternative poisons both
systems:* if feeding moved battle stats, every
battle would silently price in grocery labour (an
invisible bend — #180's law forbids the shape), and
the Garden would stop being care and become
optimisation homework. (3) *The visible-drift prize
(below) is worth more than points:* what raising
changes is how a Mochi *is* — and in this design,
how a Mochi is, is shown, not summed.

**What was studied.** The documented Chao record:
five care stats (swim/fly/run/power/stamina class)
raised by given items and creatures, each gift
carrying a *grade* that scales its teaching; fruit
that restores and flavours; an alignment steered by
*which kind of keeper raises the creature and how
it is treated*, which at growth moments resolves
into visible form — body colour, features, bearing —
a Hero-shaped or Dark-shaped adult, readable at a
glance across a garden; and a school where the
creature learns behaviours over time. The kit taken:
feeding with effects, grades, visible alignment,
lessons. All names and values are native.

## Native spec — `mochiichao/raising-depth/v1` (fragment beside this doc)

- **Feeding & gifts (the care-item layer).** #31
  gains a care-item class reading (proposed into
  #31's home): every care item carries **taste data**
  (which axes it speaks to, how strongly, liked/
  neutral/disliked per species-sheet palate — sheet
  data, #152's family) and an **effect record**
  written to the individual's care profile at the
  act: axis deltas (small, capped per act — data),
  drive refills (#28's drives), and a history beat.
  Gifts of found natural items (the animal-class
  equivalent — carried things from habitats, #66)
  work the same way with **wilder variance**: a
  found gift's axis lean is its own fact, discovered
  by giving. Nothing in this layer touches an #80
  variance stat, a #39 ledger, or a battle number —
  the fence is in the effect record's schema: it
  has **no field capable of naming a battle stat**
  (schema-level refusal, like #245's never-keeps).
- **Grades at checkups.** A care centre visit (#132)
  may include a **checkup**: the individual's care
  axes are graded — a letter-class grade per axis
  (the documented E–S shape; the grade bands are
  data) — and the grades are **record facts** on
  the care profile (they change only at checkups,
  so a grade is a kept fact with a date, not a live
  computation). Grades predict growth quality in
  *care* terms (how fast an axis learns from the
  next gifts — the multiplier table is data on the
  grade, read by the feeding layer). A checkup
  writes grades and nothing else (#132 discipline
  inherited: no bond, no honours, no dex).
- **Alignment drift, made visible.** #28's alignment
  value is joined by its presentation law:
  - Drift inputs are *acts*, read at the act: who
    raises (keeper facts), how the Mochi is treated
    (care consistency, #245/#220-class neglect
    facts, praise/neglect events) — the documented
    steering, on #28's existing value; no second
    alignment store.
  - **At growth moments** (#199 evolution and #243's
    stage boundaries), the accumulated drift
    resolves into **visible form**: body read —
    posture, feature accents, colour warmth within
    the species' palette law (the Lustre Law's fence
    stands: alignment never repaints a species'
    identity colours; it works in the margins the
    individual-variation doctrine (#80) allows) —
    recorded as a #80 deviation-class presentation
    fact so every later render reproduces it (the
    #196 rule: ruled/derived presentation facts
    MUST reproduce).
  - The visible read joins **#202's mood family as
    its long layer**: mood is hours; alignment-form
    is the *years* layer — a stranger meeting the
    Mochi can see which way it has been raised
    before a word is exchanged. It also reads
    against **#271's ladder** from the other side:
    the ladder is what the world thinks of the
    *Ranger*; the drift-form is what a Mochi's body
    says about the Ranger. Both are legible. Neither
    is a number on a screen in the show.
  - **Drift is not destiny and not morality for the
    Mochi:** a dark-drifted Mochi is not evil and
    not damaged — it is *shaped*. Only #287 closure
    is damage, and closure never comes from ordinary
    raising; abuse-class facts are #287's gate, far
    beyond drift's range (the two systems' fence is
    stated here so no landing merges them).
- **Lessons (the school class).** A Garden/care
  facility class where a resident learns **behaviours**
  over time — dances, greetings, tricks of bearing —
  which join #152's stocked behaviour pool for that
  individual (lessons write behaviour repertoire,
  never stats). Lesson contents are world content;
  the class and its write discipline are this spec's.

## Show lane

Raising is the show's quiet gold: feeding scenes,
a checkup beat, and the long payoff — a Mochi whose
grown form *shows* its childhood. Directors read
drift-form from the individual's record like any
presentation fact (#196). No meters, no grades on
screen; grades live in the game's checkup, and the
show shows the *body* the grades were describing.

## Wiring

Care profile stays in #28's home — this package's
records are annexes there; care-item reading
proposed into #31; checkups seat in #132's service
family; growth-moment resolution hooks #199/#243;
visible facts land as #80 presentation facts read
by #152/#196/#202. STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — feeding,
  grades, visible drift, lessons, and the
  battle-stats line drawn and defended above.
- **Contents: zero items, palates, or lessons
  instanced;** grade bands, caps, and multiplier
  tables are balance data. The yield is depth with
  a conscience: the Garden can now be *played*,
  and battle stays honest.


**PROPOSAL — List 35 #337/#341 (registered at List 35's landing, 2026-10-27):** the settlement extension. #337's drift read (337-RAISED-VARIATION.md) and #341's stat-shaped emphasis (341-STAT-SHAPED-EMPHASIS.md) settle via THIS file's raising mechanism — no second settlement mechanism is founded in #337's file. The extension inherits this file's fences as they stand: raising writes CARE axes only, and no care write may carry a battle-stat argument (this file's settled line, machine-checked at List 30's landing against the care-profile schema). Proposal discipline: the extension takes effect only as carried here.
