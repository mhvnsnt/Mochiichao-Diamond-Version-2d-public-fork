# #227 — PROVENANCE STORYTELLING → how the show tells where a Mochi came from (SHOW lane)

**What was studied.** Origin-story episodes in the
publicly documented record of long-running creature
shows: the flashback episode that explains how a
partner was met, given, rescued, or traded for —
usually told by a character, in pieces, when the
present-day story gives the past a reason to surface.
The kit taken: provenance is *told*, on a present-day
occasion, and the telling is shaped by the teller —
but the facts told are not the teller's to change.

## Canon anchors (verified in the packages)

- **The depiction ruling (owner, 2026-10-27).**
  Trades may be depicted in the show — as stories,
  side stories, and backstory, including "characters
  talk about how they got their Mochi in a trade, and
  it evolved." #68's "the show lane never trades" is
  the *system* rule (the show never runs the trading
  mechanic); depiction as story is legitimate. #218
  (List 23) governs the staged trade itself; this
  spec governs the *telling about* an origin, which
  is the wider class.
- **#80 + #168 own the truth.** The individual's
  record carries its keeper history as append-only
  stamps — `{met_via: trade | gift, from, to, beat}`
  on `previous_keepers[]` (#168, in #68's stamp
  vocabulary), plus rescue/kept facts in the same
  family. A provenance tale is an *illustration* of
  entries already on that record. It can reveal a
  stamp the audience hadn't seen; it can never write,
  move, or contradict one.
- **#82 owns continuity.** A provenance tale is a
  flashback class under #82's arc planning and its
  conservation checklist: the tale changes nothing in
  the present-day state except what an audience now
  *knows*. Entry state = exit state, knowledge aside.
- **The subtitle law.** Subtitles appear only at
  important moments; provenance is important-moment
  material by default — an origin reveal is exactly
  the class of beat the law reserves subtitles for,
  including the creature's side of the story told in
  cries (#136's comprehension grammar stages who in
  the room understands how much of that).

## Native spec — `mochiichao/provenance-tale/v1` (fragment beside this doc)

- **The tale record** (a production-side record, one
  per told origin): `{individualId, occasion,
  teller, classes[], recordStamps[], beatRefs[]}`.
  `classes[]` is a closed vocabulary of origin kinds:
  `trade | gift | rescue | kept-wild | hatched |
  inherited | found`. Every class named in a tale
  must correspond to at least one stamp or fact on
  the individual's #80 record — the record is
  checked at script stage, not after broadcast.
- **The occasion rule.** A tale is told *for a
  reason in the present*: a new Ranger asking, a
  reunion, a trade being considered (#218), an
  evolution that makes the old story matter again.
  A tale with no present-day occasion is exposition,
  and exposition is not a class this format carries.
- **Evolution inside a tale.** "I got him in a
  trade, and he evolved" is a named pattern, not an
  accident: where the record shows a `trade`-class
  edge (#199's method layer — trade edges fire
  inside #168's completion), the tale may stage the
  evolution as the trade's emotional completion. The
  tale stages what the record already says happened;
  it never invents an evolution the record doesn't
  hold.
- **Partial telling is legal; false telling is
  not.** A teller may omit, compress, or not know a
  chapter (recorded on the tale as the teller's
  limit, so a later tale can complete it). A tale
  may not assert an origin the record contradicts —
  if canon ever wants an *unreliable* teller, that
  is an owner-level canon event, not a format
  feature, and is flagged as such wherever proposed.

## Game lane

None — this is a show system. The game lane's peer
is the record itself (#80's history, readable in the
Mochiioteca per #207-class discovery states): the
game *shows the stamps*; the show *tells the story
of the stamps*. One truth, two surfaces.

## Wiring

Reads: #80 record + #168 stamps (truth), #199
(trade-edge staging), #136 (comprehension staging),
#82 (continuity + conservation). Lands in the show
production home beside #82's arc planning.

## Coverage — honest

- **Architecture: fully specified** — tale record,
  occasion rule, record-check discipline.
- **Contents: zero tales instanced.** Every actual
  origin story is episode content (show lane /
  owner canon), and none is written here.
