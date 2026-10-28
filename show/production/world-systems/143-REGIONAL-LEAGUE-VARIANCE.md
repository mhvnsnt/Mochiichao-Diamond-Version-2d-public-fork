# #143 — REGIONAL LEAGUE VARIANCE → each region's league as slots over one system

**Seat in the doctrine:** the connected world holds five
regions, and each region's league is *that region's own*
— but "own" must mean filled slots in one system, not
five bespoke systems, or nothing (licence, gauntlet, Hall
of Fame) can render across regions. #45 wrote Region 1's
circuit spine once for both lanes; #100 built its gauntlet
operations; #133 added rank trials. This spec extracts
the *variance shape* those three already imply: what may
differ per region, what may never differ, and which slots
sit empty until a region is designed.

**What was studied.** League structures across the
publicly documented record: the classic eight-badge
linear circuit; regions that loosen ordering (several
gyms challengeable in the order found); leagues whose
entry is gated by trials rather than badges; and champion
structures that vary (a final four, a title match, a
tournament bracket). The kit taken: a league is a small
record of *structural choices* over shared machinery —
the circuit, gauntlet, and licence systems are the
machinery; the choices are the region's signature.

## Native spec — `mochiichao/league-structure/v1` (fragment beside this doc)

- `leagueStructure` record per region: `{regionId,
  dojoCount, ordering: linear | open | mixed, fragment
  Fiction — the display noun for the circuit's tokens
  (Region 1: Fragments), threshold (count at the Victory
  gate), eliteStructure: four-and-champion |
  title-match | bracket | other-ruled, championSlot,
  trialsJoin (#133 rank trials, if the region uses
  them), capstoneFlag (#12 `story.*`)}`.
- **What may never vary** (the machinery, fixed): clears
  are `progress.*` facts (#12); the Fragment case is a
  derived view on the licence (#98); the capstone writes
  the Hall of Fame snapshot (#126); bands never scale
  (#52); a circuit's internal order, however loose, is
  expressed as gate flags on #11's graph, never as code.
- **The seeded instance — Region 1, from canon only:**
  8 dojos; ordering **linear** (#45: a cleared dojo
  hard-gates the next); tokens are **Fragments**;
  threshold 8 — *carried as #11/#45's flagged STRUCTURAL
  INFERENCE, not as a canon quote* (List 11 #100's
  register); elite structure four-and-champion (Elite
  Four Umi / Gin / Hono / Yoru → Champion Hex, #100);
  capstone `story.champion_defeated` (verified in
  #100/#126); the Syndicate-dojo anomaly (the eighth
  dojo's master) is Region 1 content whose name stays
  OPEN, exactly as #30/#99 left it.
- **Regions 2–5:** every slot null. Not "to be similar" —
  null. A region's league is designed when the region is,
  and this record is where the design lands. Even the
  *token fiction* may differ (another region need not
  collect Fragments); the licence renders whatever the
  record names, by #23 lookup.

**Show lane:** the season-per-region structure (#82,
#127) reads this record for its spine: a season's dojo
arc count and ordering come from the region's structure,
which is why a region whose ordering is `open` produces a
genuinely different season shape, not a reskin.

## Wiring

Instance data joins #45 (circuit), #100 (gauntlet),
#126 (capstone write), #98 (licence rendering), #133
(trials where used), #11 (order as gates), #12 (flags).
#137/#127 read a region's capstone as the progression
route's evidence — structure record is where "beaten the
region" gets its definition, per region.

## Coverage — honest

- **Architecture: fully specified** (slot record + the
  fixed machinery list).
- **Instances: one of five.** Region 1 is instanced from
  canon with its one flagged inference labelled. Regions
  2–5 are empty slots by design — their counts, ordering,
  fictions, and champions are OPEN, owned by each region's
  own build, and this package guesses at none of them.

**Clarification registered at List 31 landing (2026-10-27, from #305).** This file's Region 1 linearity is read by #305 (`src/data/core/docs/305-OPEN-LEAGUE-STRUCTURE.md`) as that region's authored data standing unchanged under an open-order system: the system permits what Region 1's contents don't use; Regions 2–5 (null here) may author open shapes on the same machinery. This is a clarification, not an edit to Region 1's record.
