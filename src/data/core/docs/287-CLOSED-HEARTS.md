# #287 — CLOSED HEARTS → the corruption state (Colosseum/XD native)

**Owner direction (2026-10-27):** Colosseum and XD
mechanics are pulled in 100% and rebuilt native. This
package founds the state those games are built on: a
creature whose heart has been *closed* — by theft, by
shadow-class processing, by abuse — and everything
that state means until it is opened again (#288).

**Doctrine seat:** List 28 built stealing (#268), the
stolen Mochi's side (#273), and redemption (#275) —
but a stolen Mochi's *damage* had no engine. This is
it. A closed heart is not a mood (#202), not a status
condition (#182), and not a personality change (#108
and #80 stand untouched: **the seed does not change;
a door in front of it is shut**). The distinction is
the whole design: what was done to the Mochi is a
state the world can heal, not a rewrite of who it is.

**What was studied.** The documented Colosseum/XD
record: a shadow creature carries a **heart gauge** —
a finite measure of how closed the heart is, shown in
segments — which empties only through care-class
contact (#288's roads). While closed it cannot gain
experience (experience is held, not lost), it cannot
evolve, its move set is shadow-class (#290), and it
may fall into frenzy (#289). Certain people and one
device function can *see* the closure — an aura read —
while everyone else just sees a Mochi that is wrong.
The kit taken: the gauge, the freeze rules, and the
read. The names, the processes, and every number are
ours.

## Native spec — `mochiichao/closed-heart/v1` (fragment beside this doc)

- **The gauge is a record — and this spec says why.**
  Nearly everything in this programme is derived
  (#202's mood, #243's life stage). The heart gauge
  is **stored**, on #80's record family, because it
  fails the derivation test on all three counts:
  (1) it is changed by *events*, not computable from
  other facts (a battle walked, a call-out in frenzy,
  a care session — the same history can end at
  different gauges depending on order); (2) it must
  survive transfers (#168/#268) intact — a stolen
  Mochi's gauge is evidence, and evidence is never
  recomputed; (3) #288's completion is a threshold
  crossing of this exact value, and a threshold needs
  a stored subject. Stored shape: `heart:
  { closed: bool, gauge: <int>, gaugeMax: <int>,
  cause: <class>, closedBeat: <beat> }`, **absent =
  open** (#96's absent = default arrival: an ordinary
  record carries no heart field at all).
- **Gauge size is the individual's fact.** `gaugeMax`
  is set at closing, from the individual's own facts
  (species sheet class + what was done — a snagged
  Mochi's quick scare is not a processed Mochi's deep
  closure). The value bands are data (balance pass);
  the rule is: deeper process, larger gauge; the
  flagship class (#288) sits outside the bands
  entirely.
- **Cause classes (closed):** `theft` (taken by snag,
  #268 — including a Mochi stolen *from* a thief on
  re-snag, which does not stack a second closure:
  closure is a state, not a counter), `processing`
  (Syndicate shadow-class work, #99's teeth), `abuse`
  (sustained neglect/cruelty read from care facts —
  the class #245 rescue and #220 shelter intakes
  test for). Causes are history facts: the record
  keeps *how* the heart was closed, because #288's
  roads and #275's redemption both read it.
- **What a closed heart does (the freeze rules):**
  - **Experience is held in reserve.** Battles still
    happen, but #177 gain events are *banked*, not
    applied: the individual does not level while
    closed. The bank is part of the heart record —
    it pays out whole at opening (#288), so nothing
    earned in the dark is ever stolen from them.
  - **Evolution is frozen.** No #199 edge may fire
    while closed, whatever its trigger — a closed
    heart cannot become. (An evolution that would
    have fired is not queued; it is simply re-tested
    after opening, on the individual's then-facts.)
  - **Growth presentation is frozen.** #243's life
    stage read holds at the closing moment's shape;
    the Mochi does not visibly age or flourish while
    closed. The show reads the same freeze (#296's
    staging grammar carries it).
  - **Moves are shadow-class** — #290 owns the slot
    semantics.
  - **Obedience is broken, not inverted.** A closed
    Mochi is not loyal to its closer. In battle it
    may refuse, idle, or frenzy (#289) — resolved on
    #273's stolen-Mochi machinery (bond facts to the
    *true* keeper still read; bond to the holder does
    not accrue while closed — #180's declaration law:
    no bond effect may present as growing from a
    closed heart).
  - **Care still lands.** #28's care loop and #132's
    services work on a closed Mochi — indeed they are
    #288's roads. Care never *requires* an open heart;
    that is the point of the system.
- **The read — Aura Reader native.** The Mochiioteca
  gains a device function that renders closure
  visible: it seats in #149's **closed** screen
  classes — `identify` (the entry assembles *wrong*:
  the silhouette grammar shows the shut door as a
  dark band across the assembling card) and `alert`
  (a closure state change — opened, deepened — is a
  beat). **No new screen class is founded**; #149's
  set stays exactly four. In the game lane the same
  function is a #81 device behaviour: scanning a
  closed Mochi returns the closure read (gauge band,
  never a fake-precise number the fiction hasn't
  earned) instead of a clean entry. Who may hold a
  reader is world content (a device function is
  data on the device record, not a new item class).
- **What closing is not.** Closing is never a player
  tool *against* their own kept Mochi as an upgrade:
  there is no benefit state on the far side of a
  closed heart (no power, no move worth keeping —
  #290's shadow moves leave at opening). The only
  actors who close hearts in the fiction are the
  Syndicate and cruelty; the system's asymmetry is
  deliberate and stated here so no later package
  "balances" it into a build choice.

## Show lane

A closed Mochi is played, never labelled: the cries
are wrong (flat, cut short — #2/#155's vocal layer
carries it), the body language is #152 behaviours
with the warmth removed. The device read is the
audience's one explicit window, staged under #149.
Creatures stay cries-only; no creature explains its
own heart.

## Wiring

Record lands on #80's family (beside the seed —
seed untouched); gain banking fences #177; freeze
fences #199 and #243; obedience reads #273/#180;
intake tests join #245/#220; the read joins #149
(identify/alert) and #81. STAGING carries the steps.

## Coverage — honest

- **Architecture: fully specified** — gauge, causes,
  freeze rules, the read, and the stored-not-derived
  argument.
- **Contents: zero closures instanced.** Which
  Syndicate process closes hearts, gauge band values,
  and the flagship class's contents are content and
  canon slots (#288's register). The yield is the
  state itself: List 28's theft now has a wound, and
  the wound has a measure.
