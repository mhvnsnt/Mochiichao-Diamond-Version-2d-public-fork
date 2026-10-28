# #323 — STANDOUT WILD ENCOUNTERS → meeting *someone*, out where anyone could be met

**The gap this fills.** Wild encounters deal in
species (#7's tables, #255's rates). But the world
now contains unique individuals who live wild — a
roamer is already one record walking the map (#114),
and a released Mochi persists as itself (#267). When
an encounter's subject is not "a Verdilance" but
"*the* Verdilance" — or any one individual with a
visible distinction — the encounter is a different
kind of event, with a different weight in the
world's memory. This spec founds that class.

**Two citation corrections, made where they land.**
Roaming is **#114**, not #113 (#113 is swarm
events); the chronicle is **#224** (#95 is the SFX
variation engine). Both are corrected here and
registered in STAGING so the chain stays honest.

## Native spec — `mochiichao/standout-encounter/v1` (fragment beside this doc)

- **The class.** A standout encounter is an
  encounter whose subject is a **pre-existing
  individual record** (#80) carrying a **visible
  distinction**, met through the ordinary encounter
  machinery of its seat. Two distinction sources,
  kept apart in the record:
  - `generated` — the individual's distinction is a
    #322 variation snapshot (a wild individual who
    happens to be unmistakable);
  - `placed` — the individual is a story-placed
    standout: a persistent record with a seat in the
    world (the #114 roamer shape, or #267's
    released-and-returned persistence), whose
    distinction is authored or registered (#318).
- **Persistence is the entry fee.** Only an
  individual who *persists* can be a standout: the
  record exists before the meeting and survives it
  (met-and-fled standouts are met again as
  themselves — #114's state persistence, #267's
  history). A one-roll encounter individual with a
  lucky variation is a #322 individual in an ordinary
  encounter until it is kept or released; the
  standout class begins where the world's memory of
  the individual does.
- **The meeting's weight.** A standout encounter is
  a **chronicle event**: the chronicle's sighting
  class (#224) can print it, and printing it is how
  a placed standout gains fame (#319) beyond the
  Rangers who have met it. The encounter itself
  writes the ordinary history the records carry —
  #319's recognition reads later meetings of the
  same record as *recognitions*, not discoveries.
  #207's discovery states stay species-level and
  untouched: meeting the maskless one does not
  change what "seen" means for Verdilance.
- **No rate is founded here.** Standouts do not get
  a spawn-table row or an encounter rate (#255's
  discipline): a placed standout is where its record
  says it is; a generated standout is an ordinary
  encounter whose individual rolled rare. Any system
  that *boosts* standout frequency is a different
  proposal, in #255's home, and none is made here.

## The maskless Verdilance, in the game — the default, stated plainly

He is a **show individual**. Whether he is
encounterable in the game is a **content placement**
— a decision for the content lane and the owner in
canon docs, *not* a slot this package parks: the
**default is show-only until placed**. If the content
lane places him, he is placed as a `placed` standout
on the same #80 record the show casts from (#326),
and #318's register entry is what the placement
cites. Nothing in this spec instances him in any
table, area, or rate.

## Show lane

The show's standouts are cast, not encountered
(#326) — but the show uses this spec's weight rule
in mirror: a standout's first on-screen meeting with
a character plays as an *event* (the chronicle may
already have made him famous, #319), not as a
species introduction.

## Wiring

Class seated beside #114/#267's persistence records;
distinction read from #322 snapshots / #318
register; chronicle join at #224's sighting class;
recognition consequences read by #319. Writes:
the ordinary encounter history on the individual's
record — no standout-specific state is stored.

## Open slots

Content placements only: which placed standouts
exist in the game, and where — content-lane canon,
decided individual by individual; the generated
class needs no placement at all. No mechanic is
left open.

## Coverage — honest

- Architecture: the class, its two sources, the
  persistence fee, the chronicle weight, the no-rate
  discipline, and the show-default for the maskless
  individual — complete.
- Contents: zero standouts instanced in the game by
  this package, by design.
