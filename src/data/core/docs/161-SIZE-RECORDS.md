# #161 — SIZE RECORDS & SPECIMEN CONTESTS → records over measurements that don't exist yet

**Read this first — the standing gap.** Height and
weight are **TBD for all 49 Gen 1 species**: recorded
nowhere in the canon data (species-data audit: body
data 0 full / 6 partial / 43 missing; "height/weight/
category: TBD for all 49"). #80 rolls stat variance
(0–15) and derives a `size_class` (small / standard /
large) from the individual seed — a *class*, not a
measurement. So there is, today, **no number this
system could record**. This spec therefore does exactly
three things: it defines the record shape, it defines
where measurement facts will live when measurements
exist, and it defines the contest grammar that will
read them. **It instances nothing.** Any version of
this system that shipped with numbers in it would be
inventing them.

**What was studied.** Specimen records in the publicly
documented record: per-species largest/smallest records
kept by an in-world authority; fishing contests that
measure the catch at the moment of capture; size-based
judging where the presented specimen is compared
against the standing record. The kit taken: records are
*derived from measurement events*, contests are
*comparisons against the derived record*, and the
measurement happens at an event the game already has
(the keep, the catch) rather than in a separate
minigame.

## Native spec — `mochiichao/size-records/v1` (fragment beside this doc)

- **The measurement fact.** When measurements exist, a
  measurement is an append-only FACT of the same class
  as #97's research tallies (stored facts; everything
  above them derived): `{speciesId, individualRef,
  measure, unit, beat}`. Proposed home: the save's
  research-adjacent fact store beside #97's tallies —
  proposed into #96/#97's homes at landing, not asserted
  as their current content. Facts survive the
  individual's release (a record set by a since-released
  individual stands — the fact was true when measured;
  #106's tombstone, which carries no measurement, is
  not the record's home and never becomes it).
- **`measure` is null-shape-wide.** The field that
  carries the number does not exist yet. The owed work,
  stated as this system's single dependency: a species
  base measurement (owner/data-lane, per species — the
  same TBD slot as height/weight in the audit) composed
  with individual variance (the derivation — e.g.
  whether #80's `size_class` or a dedicated size
  variance drives it — is a data-lane design decision,
  OPEN). Until that lands, every record query returns
  the empty state honestly: no records, no "—" dressed
  as a number.
- **The record is derived.** Largest/smallest per
  species = max/min over that species' measurement
  facts, read at query time (#14/#96 law: derived,
  never stored). #43's Palm/Knee/Waist/Tower ladder is
  the *display* grammar for records (a record is shown
  against its species' class), never the record itself.
- **When measurement events fire** (once measures
  exist): at a keep (#38's kept moment — the individual
  is measured as it joins), and at a contest
  presentation (below). Wild encounters that end
  without a keep produce no fact — you cannot record
  the size of a creature you only saw. (Whether a
  snapshot/sighting estimate class should exist is
  OPEN; not proposed here.)

## Specimen contests

- A contest is a comparison event: a presented
  individual (kept, present — #106 location party/
  garden) is measured on presentation; its measure is
  read against the species' derived record and against
  the contest's other entrants. Winning is a *record
  outcome*, handled in the reward grammar of #20
  (currency/items as data) and #104 (an honour stamp
  may record the individual's win — stamps are #104's
  vocabulary; the contest proposes the occasion, not
  the stamp).
- **Fishing contests** are the angling instance: the
  catch is measured at the #38 keep, under #111's rod/
  table rules — the specimen is the fish the table
  actually produced, measured by the same fact
  pipeline. No contest-only species, no contest-only
  sizes.
- Contests are places and occasions (a host, a
  schedule joining #124's rotation if recurring) —
  all content, all OPEN. No contest is instanced.

## Show lane

A specimen contest is an episode beat under #82
conservation: records are knowledge the characters
carry away; the party is unchanged. The record board
is a #149-class screen only if the device shows it —
display names via #23, Leak rule applies.

## Wiring

Facts proposed beside #97 (stored-fact class) in #96's
payload map; derivation read by #32 (device display),
#90 (a record is media-generator state of the same
kind as #90's spawn reports — no new generator
proposed), contest rewards via #20/#104; angling join
#111/#38; display ladder #43.

## Coverage — honest

- **Architecture: fully specified** (fact shape,
  derivation, contest grammar, event points).
- **Instances: zero, by necessity, stated plainly:**
  no measurement exists for any species, so no fact,
  no record, and no contest can be instanced until the
  height/weight TBD closes in the data lane. This
  package is the shape waiting for that number.
