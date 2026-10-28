# #231 — WILD TERRITORY EVENTS → wild-vs-wild dynamics in the living world

**What was studied.** Territory behaviour in the
publicly documented ethology record — displays,
boundary disputes, displacements, the brief noisy
reshaping of who holds a clearing — and its use in
living-world game design, where ambient animal
conflict is staged as *weather of the living world*:
it happens whether or not anyone watches, and
watching it is the reward. The kit taken: territory
events are derived world texture with witnesses,
not encounters wearing a costume.

## Canon anchors (verified in the packages)

- **#152 owns behaviour.** Behaviour profiles
  carry `threatResponse ∈ {flee, freeze, display,
  charge, vanish}`, `sociality`, `displayBehaviours[]`
  — the exact vocabulary a territory event is made
  of. An event may only stage behaviours its
  participants' profiles hold (the roster-binding
  law in motion form: a place behaves only of
  species it stocks, doing only what their profiles
  say they do).
- **#7 owns who is present.** Participants are
  drawn from the area's spawn table stock — an
  event can never import a species the table
  doesn't hold, and can never feature a species in
  an area its table excludes. The Dark Forest
  depths' table is empty (verified standing fact):
  **the depths hold no territory events that are
  recorded** — stated exactly so. If anything
  disputes territory down there, this system does
  not know about it, and the not-knowing is the
  canon.
- **#153 owns witness discipline.** Phenomena are
  witnessed world events whose only payload is the
  witness record; territory events adopt the rule:
  an event is *witnessed or missed*, and being
  missed costs nothing and leaves nothing.

## Native spec — `mochiichao/territory-event/v1` (fragment beside this doc)

- **The event is derived, not stored as
  content.** At read time, an area's stocked
  species whose profiles carry display/charge
  threat responses and overlapping activity phases
  (#19) define a *possibility space* of events
  (display-off, boundary dispute, displacement).
  Whether one is staged when a Ranger is present
  is a presentation decision made from that space
  (seeded per #94's discipline where a roll is
  needed) — there is no event table to complete,
  no checklist to hunt.
- **The event writes nothing.** A territory event
  sets no Ranger-facing flag, advances no research
  tally (#97 tallies are for the Ranger's own
  encounters — watching a dispute is not one, and
  this spec refuses the join explicitly), changes
  no spawn table, and moves no individual record.
  The loser of a displacement is staged leaving;
  the *table* still stocks what it stocks tomorrow.
  World texture, zero bookkeeping.
- **It never guarantees an encounter.** An event
  is not a lure: participants are mid-dispute,
  presented under #152's wild view, and whether
  the ordinary encounter machinery engages any of
  them is #7/#18's business on its own terms. A
  Ranger who watches every dispute in an area has
  gained exactly the watching.
- **Show lane.** The same derivation feeds #82's
  background staging: a territory dispute at a
  story's edge is cast from the place's real stock
  and profiles, under the subtitle law (a dispute
  is texture; it earns subtitles only when the
  story makes it matter). The show does not stage
  depths events either — the recorded silence is
  shared canon.

## Wiring

Derivation over #7 tables + #152 profiles + #19
phases; witness discipline shared with #153;
presentation via #152's wild view; explicitly NO
join to #97. Lands beside 152-SPECIES-BEHAVIOUR-
PROFILES in the list16 home.

## Coverage — honest

- **Architecture: fully specified** — derivation
  space, write-nothing law, depths exclusion.
- **Contents: zero events instanced, by
  construction** — the system has no content table
  to fill; per-area staging taste is presentation
  work, and any future *scripted* set-piece dispute
  is authored content, not this system.
