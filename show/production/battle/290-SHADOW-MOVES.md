# #290 — SHADOW MOVE CLASS → what a closed heart knows

**Doctrine seat:** In the documented source design,
a closed-heart creature's move set is *wrong*: it
knows a small set of shadow moves — blunt, uniform,
effective against the open-hearted and weak against
its own kind — and as the heart opens, ordinary
moves are remembered slot by slot until, at the
rite, the shadow moves are gone. This package seats
that class on #9's move-script and #17's damage
machinery. Shadow moves are not a type, not a
reward, and not a build: they are the sound a shut
door makes.

## Native spec — `mochiichao/shadow-moves/v1` (fragment beside this doc)

- **The class flag.** A move record (#9/#17 family)
  may carry class `shadow`. Shadow-class records are
  authored natively like every move — the documented
  *shape* (a short, generic list: a rush, a wave, a
  hold-class move, a weather-class move…) is the
  pattern; **names follow the rename law**: display
  names are Mochiichao names drafted under #23's
  discipline and approved by the owner in batches —
  no source-game name is carried over, and none is
  instanced in this package.
- **Slot semantics (the heart of the spec).** A
  closed individual's move set is read as:
  - Its ordinary known moves are **sealed** — present
    on the record, unusable, exactly as its
    experience is banked (#287): nothing is deleted
    by closure, ever.
  - Its usable set is shadow-class: at closing, the
    individual gains a shadow loadout by its cause
    class (#287) — a small fixed shape (data: the
    documented default is one shadow move per
    deepening band of the gauge, capped low), drawn
    from the shadow list by species eligibility
    (anatomy, #9's coverage rules — a shadow move
    still needs a body that can perform it, #147).
  - **As the gauge empties, slots reopen in order:**
    at each gauge band crossed downward (#288's
    events), one sealed ordinary move returns to
    the usable set and the shadow loadout shrinks
    from the top — healing literally reads as the
    Mochi remembering itself, move by move. The
    band thresholds are data on #287's record.
  - **At the rite (#288), all remaining shadow moves
    are forgotten** and the full ordinary set stands
    usable. A purified individual can never relearn
    a shadow move: the class has no tutor, no TM
    seat (#101's lanes stay shut to it), no egg
    inheritance (#204's bar reads it too — proposed
    there by citation).
- **Battle behaviour (on #17's chain, no new pipe).**
  - Shadow moves run through #17's pipeline as
    ordinary moves with class data: their type
    interaction is the documented asymmetry —
    **strong against open-hearted targets, weak
    against closed-hearted targets** (multipliers
    are move data) — implemented as a target-state
    modifier in the chain, beside #248's factors,
    visibly declared wherever it applies (#180's
    law: no invisible bends).
  - While frenzied (#289), shadow moves gain their
    documented critical-lean (frenzy's data).
  - Shadow moves never carry bond effects, never
    trigger #180 rows, and their use by a Mochi is
    never a deed of the Mochi's (#269 reads keepers).
- **Learning fence.** No closed individual learns
  ordinary moves by #129 level-up while closed (its
  levels are banked anyway, #287); move tutors
  refuse closed individuals with the #132-family
  legibility (shown refusal, not a silent no).

## Show lane

A shadow move in the show is staged as *flat*:
no flourish, no signature grammar (#131's register
never seats one), a move performed like a reflex
rather than a choice. The contrast is the point —
when the first ordinary move comes back mid-arc,
the audience should feel the difference before
anyone says anything. Creatures stay cries-only.

## Wiring

Class flag proposed into the move record in its
home (#9/#17 family); slot read/write rides #287's
record + #288's band events; target-state modifier
seats in #17's chain beside #248; inheritance and
tutor fences proposed into #204/#101 by citation.
STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — class, slots,
  reopening order, battle asymmetry, fences.
- **Contents: zero moves instanced.** The shadow
  list's size, shapes, and owner-approved names are
  a move-data pass under the rename law. The yield
  is the grammar of forgetting and remembering that
  #287/#288 needed to be playable.
