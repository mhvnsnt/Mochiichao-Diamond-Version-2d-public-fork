# #236 — MOCHI SPORTS & RACING → non-battle athletic institutions

**What was studied.** Racing and athletics in the
publicly documented record, real and fictional:
ranked-by-performance institutions (a finish order,
a track, a field) whose drama is speed and nerve
rather than combat — and the creature-racing form,
where the field is limited by what the animals
*are*: a race only ever fields anatomies that can
run it. The kit taken: the institution grammar of
#151 with the battle taken out, and eligibility
read off the body, not off a list.

## Canon anchors (verified in the packages)

- **#151 owns the institution grammar** —
  brackets, records, append-only results — for
  *battle* institutions. Sports borrow that
  grammar by contrast and say so on their face: a
  race's result record is the same shape of public
  fact (an event, a field, a finish order, a date
  on #19's clock), while its resolution contains
  **no battle resolution at all** — no damage, no
  #17 pipeline, no winner-by-faint. A "race" whose
  record shows battle terms is a different system
  mislabelled, and is refused by validation here.
- **Eligibility is anatomy, derived.** From the
  species sheets via #152/#43-class anatomy facts:
  a footrace fields anatomies with running
  locomotion; a swim race fields swimmers; a flight
  race fields fliers. The derivation rule is the
  spec; **no species list exists in this format**,
  so eligibility can never drift from the sheets —
  a species becomes eligible when its sheet says
  its body can do the thing, and a sheet that says
  nothing fields nothing.
- **#56 owns the ethics.** Prizes are honours and
  cosmetics, never power: a race pays in #104
  stamps, ribbons-as-items (#31 material class),
  and standing in the chronicle sense (#172/#224-
  class reporting) — never in anything that touches
  a battle fact. Entry is never gated behind a
  token spend that pressures (#56's no-pressure
  law, inherited whole).

## Native spec — `mochiichao/sport-event/v1` (fragment beside this doc)

- **The event record**: `{eventId, class, course,
  field[], finishOrder[], beat}`. `class` is a
  small closed vocabulary of race kinds —
  `footrace | swim | flight | course` (a general
  obstacle/course class) — extendable only by
  vocabulary amendment, for the same legibility
  reason as #232's classes. `course` references a
  #7/#119 place or a defined route over #137's
  atlas; a course that exists nowhere is
  unrepresentable.
- **The field is individuals.** Entries are #80
  individuals (kept Mochi entered by their Rangers,
  and — where a race's fiction allows — wild
  individuals entered by no one, present as
  themselves under the agency doctrine). The result
  appends to the individual's history as an event
  stamp in #168's append-only discipline: the race
  happened to this individual, and the record keeps
  it.
- **Finish order is a fact, recorded once.** In
  the game lane it is produced by the event's own
  performance arithmetic — which this package
  deliberately does not found: speed facts belong
  to species data (sheet locomotion + #178-class
  derivation are the candidate homes, flagged in
  STAGING rather than asserted). What this package
  fixes is the record's shape and the fence: the
  arithmetic, whatever it becomes, reads body
  facts and the day's conditions — it never reads
  battle stats as a proxy for speed without that
  being an authored, visible rule.

## Show lane

A race episode is #82 choreography with a finish
order the story decides: the record shape is the
same, the producer differs — the show *casts* its
finish order for story reasons, openly, the way it
casts everything; no dice are dressed up as
destiny. The eligibility law binds the show too:
a race staged with an anatomy that can't run it
is a staging error, however good the scene.

## Wiring

Result records join #151's results family (shape
citation); stamps append via #80/#168 discipline;
prizes via #104 + #31; reporting colour via #172.
Lands beside 151-TOURNAMENT-SYSTEM in the list16
home.

## Coverage — honest

- **Architecture: fully specified** — record,
  eligibility-by-anatomy, prize ethics, battle
  fence.
- **Contents: zero events instanced;** every
  course, race, and field is content. **The
  game-lane performance arithmetic (how a finish
  order is produced from body facts) is an OPEN
  mechanical slot**, flagged plainly here and in
  STAGING — per the standing gap rule it is to be
  filled from canon first, then from the reference
  pattern (locomotion-derived speed classes), when
  the game lane takes it up; this package does not
  invent it.

**Finish order — FILLED at landing under the owner's Pokemon-base rule (2026-10-27; this note is the record of the fill, it was not silent):** a race runs in legs, each leg in one movement class (run / swim / flight / climb, as the course declares). An entrant's pace on a leg is its Speed in that leg's movement class; the finish order ranks entrants by total pace across all legs, highest first; equal totals share the placing. This is the Pokemon way of deciding it — the same stat that orders battle turns orders a race — and Jamar's canon overrides it wherever canon speaks. The package's staging left this open; the owner's rule closes mechanical gaps, so it is closed here.
