# #217 — GIFT & ADOPTION TRANSFERS → the other occasions on #168's semantics

**Seat in the doctrine:** #68 built the trade
*protocol* (escrow-by-reference, atomic commit,
provenance stamps, gift as the degenerate one-way
case); #168 built the *record semantics* of a
completed transfer (exactly one seat changes — the
current keeper — plus one append-only history entry
`{met_via, from, to, beat}`). Neither founded the
*occasions*: the non-trade reasons a keeper seat
legitimately changes hands. This spec is that layer.
A gift and an adoption are not new mechanics — they
are transfer classes that run #68's protocol and land
on #168's semantics, identical in shape, different in
occasion. If the record cannot tell which occasion
carried it beyond the stamp, that is correct: the
record's job is the fact, the occasion's job is the
meaning.

**What was studied.** Gift and adoption transfer
patterns in the publicly documented record: the
one-way gift (no consideration, no return obligation,
provenance stamped at receipt); shelter/rescue
adoption (custody transferred by an institution after
a custodial interval, the prior history preserved,
not erased); ceremonial presentation of a first
partner. The kit taken: occasion as a closed class on
an unchanged operation, provenance legibility, and
the institution as custodian — never as owner.

## Native spec — transfer classes over `mochiichao/trade-transfer/v1` (#168)

- **The operation does not change.** Every class
  below completes as #168 specifies: the current
  keeper seat is rewritten, the receiver sets
  `location` on commit (#106 kinds — party | garden |
  storage, no fourth kind), and one history entry
  appends. All #168 invariants hold for every class:
  identity, species, seed, variance, `deviations[]`,
  honours (#104), and care history (#28 careLog) ride
  along untouched. #68's locks evaluate before any
  class opens: `story_locked` individuals can never
  be escrowed, therefore can never be gifted or
  adopted out; egg/unhatched states are excluded.
- **Gift (`met_via: gift`).** #68's degenerate case,
  founded here as an occasion class: one-way escrow,
  `request: null`, `channel` + `expires` per #68 (both
  values inherited OPEN). A gift has **no price field
  and no consideration slot — by construction**: the
  format cannot express a purchasable gift. This is
  #56's M1 law (tokens never buy power or progress)
  applied to persons: a Mochi is never merchandise, so
  no transfer class in this package may carry a cost,
  a fee, or a reciprocal obligation of value. A gift
  occasion may carry an **honour** where #104's
  vocabulary supplies one (occasions are #104's
  proposals to accept there — e.g. a service or
  mentorship gift; none is asserted here).
- **Adoption (`met_via: adoption`).** The receiving
  end of #220's shelter system: an individual whose
  keeper seat is held by a shelter's custodial record
  (custody, not keeping — #220) transfers to a Ranger.
  The adoption entry stamps the shelter as `from` and
  the full prior history — including the surrender or
  stray-intake entry — **stays on the record,
  legible forever**. Adoption never launders a past:
  a Ranger adopting a stray receives the individual
  *with* their history, and the reunion rule (#220)
  means an adoption completed while a prior keeper is
  still recorded as seeking is a data conflict, not a
  valid transfer (the shelter's procedure in #220
  disposes; the format here simply cannot stamp over
  an open seeking state).
- **Programme gift.** A first partner received under
  a regional starter programme is a gift-class
  transfer whose `from` is the programme (#222) —
  founded there, cited here so the classes share one
  stamp vocabulary.
- **The giver's legibility.** In every class, the
  outgoing keeper joins `previous_keepers[]` and is
  never removed or anonymised. Gratitude, grief, and
  story all read the same field: who had this Mochi
  before is a fact of the individual's life, not a
  transaction detail to be cleaned up.

## Show lane

A depicted gift or adoption is a story event under
#82's conservation (entry = exit, or the canon beat
that changes it is named) and #218's grammar where a
trade is depicted; gifts and adoptions on screen turn
on the same agency centre #218 states — the Mochi's
own disposition is the story. Backstory gifts ("my
grandfather gave me…") are provenance storytelling,
governed by #218's backstory class.

## Open slots (nothing invented)

Gift channels and expiries (inherited #68, OPEN) ·
`species_untradeable` values (inherited #68) · every
#104 occasion a gift or adoption may stamp (proposals
into #104's home) · whether NPC Rangers gift in-world
as content (format yes, instances none) · the
keeper-history seat (#168's landing decision,
inherited).

## Coverage — honest

- **Architecture: fully documented** — occasion
  classes over a verified transfer operation.
- **Contents: zero.** No gift, adoption, or programme
  instance is asserted; the yield is the class layer
  that lets #220's adoptions and #222's programme
  gifts stamp identically to trades.
