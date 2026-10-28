# #289 — FRENZY → the closed heart in battle (Hyper Mode native)

**Doctrine seat:** A closed heart (#287) is quiet in
the field and dangerous in battle. The documented
source behaviour: a shadow creature in battle may
slip into a **frenzy state** — stronger in its
shadow moves, unreachable by ordinary commands —
and the keeper's one reliable cure is to *call it
back to itself*, an act that itself opens the heart
a little further (#288's largest walking-road
event). This package re-expresses that state on
#182's condition machinery and #47's field layer.
It is not a power-up. Read the show note first if
in doubt: **a frenzy is terrifying, never cool.**

## Native spec — `mochiichao/frenzy/v1` (fragment beside this doc)

- **Class and seat.** Frenzy is a **volatile**
  condition in #27's record family (battle-scoped,
  clears on switch and at battle end — #182's class
  rules verbatim), with one fence: **only a closed-
  heart individual can carry it** (the record's
  `heart.closed` is the application gate — application
  to an open-hearted individual fails at #182's
  check step 2, as if immune by class).
- **Trigger (data, on #182's machinery).** At each
  of the holder's action attempts while closed, a
  frenzy check rolls (chance is condition data;
  weighted by how *deep* the remaining gauge is —
  a nearly-open heart frenzies rarely; the weighting
  shape is data, the direction is law). On trigger,
  frenzy applies to the holder as an `on-attempt`
  family state: it does not tick for damage; it
  changes what an attempt *is*.
- **Effects (while frenzied).**
  - **Commands fail open.** A move order may be
    refused, replaced by a shadow move (#290), or
    spent idle-flailing — resolved on #273's
    disobedience family with frenzy weights (the
    machinery is shared; frenzy is its worst case).
  - **Shadow moves sharpen.** #290's shadow-class
    moves gain the documented critical-lean while
    frenzied (value is move/condition data) — the
    one mechanical "benefit," fenced by everything
    else on this page: it applies only to moves
    that leave at purification, only while a wound
    is open.
  - **The keeper's side narrows.** The holder cannot
    be given items by its keeper while frenzied (the
    #165 bag refuses — you cannot hand anything to
    a creature in that state), and it cannot be
    switched *by order* — a switch attempt is a
    command, and commands are what is broken.
    Fainting still resolves normally (#182: nothing
    outranks a faint).
- **Cures (closed, on #182's routes).**
  - **The call** — the keeper calls the Mochi by its
    name (or its species call — #239's record is
    read: the called name is the *individual's*).
    The call is a free action in the command ring,
    once per battle per individual (data may tune);
    on success frenzy clears and the heart gauge
    takes #288's call-back reduction. On failure
    (chance is data), the call is spent and frenzy
    holds. The call is the emotional centre of the
    system and is staged as such (#147: the camera
    is on the keeper's face and the Mochi's turn of
    the head — never on a UI prompt).
  - **Switch by circumstance** — if the holder
    leaves the field by any effect that is not an
    order, frenzy clears with the volatile class.
  - **Battle end** — frenzy clears; the gauge does
    not change for having frenzied. Frenzy is a
    symptom, and symptoms are not sins: **no morale
    or reputation fact ever reads a Mochi's frenzy**
    (#269/#270 read the *keeper's* deeds, never the
    wounded creature's state).
- **Frequency fence.** Frenzy can trigger at most
  once per battle per individual (data may lower,
  never raise, the cap without a revision here):
  the state is a rupture, not a rhythm.

## Show lane

Frenzy staging is a *scare*, full stop: sound drops
(#215 bed pulls out), the cry goes wrong (#155),
framing tightens, and the scene's only heroism is
the keeper calling and being heard. #147's coverage
reads frenzy beats as dread beats. A cut that plays
frenzy as a power fantasy is a defect against this
spec, not a taste call.

## Wiring

Condition record in #27's schema home (application
gate reads #287); resolution in #182's check order;
disobedience resolution reads #273's family; the
call seats in #10's command ring beside #165's
refusal rule; gauge write rides #288's call-back
event. STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — class, gate,
  trigger shape, effects, cures, fences.
- **Contents: no values.** Trigger chances, gauge
  weighting, shadow-crit value, call success chance
  are balance data. The yield is the battle face of
  the wound: the moment the whole heart system is
  *for*.
