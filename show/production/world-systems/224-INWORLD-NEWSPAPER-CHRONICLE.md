# #224 — IN-WORLD NEWSPAPER & CHRONICLE → what the world believes, in print

**Seat in the doctrine:** #172 founded in-world
broadcasts — six closed content classes over #90's
grid, airing derived, cries never as speech. Print is
broadcast's slower sibling, and it is not a reskin:
a broadcast is heard and gone; a **chronicle**
persists, is cited, and becomes the public source
other systems read. This spec founds the newspaper/
chronicle layer — and with it, the world's public
memory: what the paper prints is what the world
believes, which is not always what the record says.

**What was studied.** In-world print media in the
publicly documented record: the town paper as a
system (editions on a schedule, content drawn from
world events — deeds, results, sightings, weather);
the chronicle as reputation's amplifier (to be
written about is to be known); and the honest-paper
pattern — corrections printed when the paper errs,
because the paper's authority rests on admitting it.
The kit taken: edition records over real world facts,
content classes mirroring #172's, the belief/record
split as a first-class law, and corrections as a
format feature, not an embarrassment.

## Native spec — `mochiichao/chronicle/v1` (fragment beside this doc)

- **The edition record.** An edition is a derived
  publication over world facts:

  ```
  { editionId, regionRef, issuedBeat (#19/#124 class),
    items: [ {class, subjectRef, sourceRef} ... ] }
  ```

  Every item carries its **source** — the record it
  reports (a fixture result, a #12 deed fact, a #153
  phenomenon witness record, a #126 induction). An
  item without a resolvable source cannot be printed:
  the chronicle reports the world, it does not invent
  it. Issuance rides the same derivation discipline
  as #172's airing (#124's read-time projection over
  #19's clock) — editions are computed, not authored
  by hand, wherever their content is systemic.
- **Content classes** (closed, mirroring #172's
  broadcast classes so the two media never drift):
  `deeds` (Ranger accomplishments and #30/#100-class
  results) · `results` (league and facility outcomes,
  from their records) · `phenomena` (weather and
  phenomenon reports — projections labelled as such,
  #142's no-forecasting-fiction law inherited whole) ·
  `forest_bulletin` (**TRACE class only**, #163's
  discipline: the paper may print that something was
  heard at the Forest's edge; it may never print a
  depths fact, because there are none to print) ·
  `community` (programmes, festivals, shelter
  reunions — the society pages) · `chronicle_proper`
  (the long record: profiles, histories, memorials —
  the class #225's sites and this paper share).
- **The belief/record split — the load-bearing law.**
  The chronicle is **#201 reputation's public
  source**: what the paper prints is what NPCs
  believe before they meet a Ranger (#201's derived
  standing reads the chronicle as its loudest input).
  But the paper **can err** — a misreported result, a
  misspelled name, a deed credited to the wrong
  Ranger — and the underlying record cannot. The
  format therefore keeps two layers forever separate:
  the **record** (the fixture, the deed fact, the
  individual's history — append-only, never edited)
  and the **report** (this edition's item — the
  world's belief, correctable). A correction is a new
  item in a later edition citing the erring item; the
  erring item is never silently rewritten (back-issues
  are what they were — see below). A system that
  reads *truth* reads records; a system that reads
  *belief* reads the chronicle. Confusing the two is
  the one wiring error this package exists to prevent.
  (#201's own package was not in the workspace at
  build time — the reputation join is registered
  UNVERIFIED in STAGING and lands as a citation
  proposal in #201's home.)
- **Back-issues.** Past editions persist as readable
  objects. That a back-issue may exist as a **#31-class
  collectable item** (a physical paper a Ranger keeps)
  is a **proposal, flagged**: it lands only as an edit
  in #31's home, and until accepted there, editions
  are media records, not inventory. The distinction
  matters: a collected paper is an *item about* an
  edition, never the edition itself.
- **Show lane.** The paper is show texture with
  teeth: a character reads their own misreported deed
  aloud; a chronicle profile is how the audience —
  and a rival — learns a backstory the show hasn't
  staged (including, lawfully, a #218 backstory trade,
  printed as community news in its day). Print obeys
  the subtitle law (legible text on screen is a
  chosen beat, not set dressing) and the Leak rule
  (a printed name is a display name, #23 lookups,
  always).

## Open slots (nothing invented)

Paper names, mastheads, and regional editions
(content/branding — none asserted) · edition cadence
per region · the error rate and correction culture
(how often the paper errs is a tone decision for the
show/game writers, not a format constant) · letters/
reader content (a class addition would land here by
ruling; none founded) · the #31 collectable proposal
(above).

## Coverage — honest

- **Architecture: fully documented** — editions over
  sourced facts, classes mirrored to #172, the
  belief/record split stated as law.
- **Contents: zero editions.** No paper has a name,
  no deed has been printed. The yield is a public
  memory that can be wrong in print and right in the
  record — and knows the difference.

---

**Landing citation — List 33 (2026-10-27).**

#319 individual recognition (`world-systems/319-INDIVIDUAL-RECOGNITION.md`) reads fame from this file's printed record together with #93's town data — fame lives in the world's public layer, exactly here, and no fame field is added to any individual record. The chronicle is #224 (not #95, the SFX variation engine): the correction registered in List 33's STAGING is carried here. Which individuals the chronicle has written about stays authored content in this file's seat.
