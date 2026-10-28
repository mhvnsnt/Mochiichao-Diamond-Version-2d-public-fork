# #232 — WORKING MOCHI PROFESSIONS → Mochi in town jobs

**What was studied.** Working animals in the
publicly documented record — messenger birds,
herding and guard dogs, lighthouse and station
animals kept as town fixtures — and their fiction
form, where a creature with a job is a *citizen
with a role*, known by name at its post. The kit
taken: a profession is a relationship between a
creature, a place, and a community — recorded as
such, and never as a stat, a buff, or an employment
contract over a piece of property.

## Canon anchors (verified in the packages)

- **The agency law (canon doctrine, stated here as
  system law).** A working Mochi has **a keeper or
  a town — never an owner-employer in the property
  sense.** The profession record names the keeper
  (an individual Ranger/NPC) or the town (a civic
  seat) as the relationship's other side; there is
  no field for wages-as-ownership, no field that
  makes the Mochi an asset of the job. A Mochi may
  be *retired* from a profession by record; it may
  not be *sold out of* one (#168's transfers move
  keeper seats for kept Mochi; a town's lighthouse
  Mochi changing keepers is a town event, recorded
  the same append-only way).
- **#93 owns the towns.** NPC schedules seat people
  in places on #19's clock; a profession seats a
  *Mochi* the same way — its post is a place, its
  hours are phases, and the town's daily texture
  (#172's community broadcast class among them)
  reads the seating. A profession whose post is
  not a #119/#7 place is unrepresentable.
- **#152 bounds the work.** A profession is legal
  only where the species' behaviour profile can
  carry it — a courier's profile needs the
  locomotion and curiosity for routes; a guard's
  needs a display/charge threat response at a post.
  Eligibility is read from the profile, never from
  a species whitelist: the format holds no species
  list, so a new species becomes employable the day
  its profile lands, and no other way.
- **#221 (List 23) owns mentorship's world** —
  Rangers learning from Rangers; professions are
  the Mochi-side civic fabric of the same towns:
  a junior Ranger's route through a town passes
  working Mochi the way it passes working people.
  (Forward citation — List 23 builds in parallel;
  see STAGING's register.)

## Native spec — `mochiichao/profession/v1` (fragment beside this doc)

- **The profession record**: `{individualId,
  class, post, keeperRef | townRef, phases[],
  status}`. `class` is a small closed vocabulary
  of civic roles: `courier | guard | farmhand |
  lighthouse | guide | mascot` — closed so the
  civic grammar stays legible; a role the
  vocabulary can't say is new canon, proposed as a
  vocabulary amendment, not smuggled in as a free
  string. `status ∈ {active, retired}` — retirement
  is a state on the record, not a deletion.
- **A profession is presentation + relationship
  data, never a stat.** It writes nothing to the
  individual's battle facts, grants its keeper no
  mechanical edge, pays out in no currency (a town
  may honour its working Mochi — #104 stamps are
  the honour layer's business, proposed there, not
  asserted here). The record's whole payload is:
  this individual, this role, this post, these
  hours, this community.
- **Wild individuals can hold town professions**
  in exactly one shape: the `townRef` form, where
  no keeper exists and the individual is a fixture
  of the place (the lighthouse Mochi nobody keeps).
  Its #80 record is untouched by the profession —
  profession is a civic overlay, and overlay never
  writes the individual's facts.

## Show lane

Working Mochi are ready-made world texture under
#82: the courier who crosses the episode, the
guard at the gate the cast must greet by name.
Professions give the show recurring non-cast
Mochi with continuity — and the agency law keeps
the staging honest: the courier is a person doing
a job, greeted, thanked, and free to refuse a
scene's errand in the fiction's terms.

## Wiring

Records seat beside #93's schedules (same clock,
same places); eligibility read from #152; honour
occasions proposed into #104; broadcast colour via
#172's community class. Lands in the world-systems
home beside 93-NPC-SCHEDULES.

## Coverage — honest

- **Architecture: fully specified** — record,
  closed class vocabulary, eligibility-by-profile,
  agency law.
- **Contents: zero professions instanced.** Every
  actual working Mochi is town content (content
  lane / owner canon); whether canon's towns yet
  employ any Mochi is an open content question,
  not answered here.
