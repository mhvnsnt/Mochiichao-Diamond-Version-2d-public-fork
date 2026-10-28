# #168 — RANGER-TO-RANGER TRADING → record semantics for a transfer of care

**Seat in the doctrine:** #68 built the trade
*protocol* — the two-phase commit two save registries
would exchange (escrow-by-reference, atomic swap,
provenance stamps, gift as one-way escrow) — and left
every policy value OPEN, design-only, for a feature
that does not exist. #68 assumed something it did not
build: that when a transfer completes, everyone knows
what it *does to the individual's record*. This spec
is that half, for the in-world case — two Rangers in
one world, one Mochi whose keeper changes. Protocol
is #68's; **record semantics are here.** If a
cross-save trade is ever built, it runs #68's protocol
and lands on these semantics — the record cannot tell
which transport carried it.

**What was studied.** Transfer-of-ownership semantics
in the documented record, read at the data layer: the
reference systems stamp provenance and change the
keeper reference — and, instructively, they let almost
everything else about the creature ride along untouched,
because the creature's history is the creature's. The
kit taken: one mutable seat, an append-only history,
locks evaluated before any interface. Welfare framing
is #68's and is kept: the vocabulary is keeper/partner
language, and the format has no ownership/price fields
— a trade is an exchange of *care*.

## Native spec — the transfer operation over `mochiichao/individual/v1` (#80)

- **Exactly one seat changes.** A completed trade
  rewrites the individual's **current keeper** — the
  seat that says whose roster (#96) and whose keeping
  this individual is in — and *nothing else on the
  record*. Invariant under trade, by construction:
  `individual_id`, `species`, `personality_seed`, all
  of `variance`, `deviations[]`, honours (#104 stamps
  stay on the record — they were earned by *this*
  individual), and the care history (#28 careLog entries
  are the individual's past, not the outgoing keeper's
  property). **Deviations travel with the individual:**
  a RULED deviation is a fact about a person (Doro's
  eye-whites are his, whoever keeps him); the
  consistency duty transfers to the new keeper's
  presentation, and the deviation record itself is not
  edited by the trade.
- **History is append-only — the trade is an event ON
  the record.** Completion appends one entry to the
  record's keeper history, in #68's stamp vocabulary
  verbatim: the outgoing keeper joins
  `previous_keepers[]`, and the entry stamps
  `{met_via: trade | gift, from, to, beat}` (beat = the
  #12 event reference). Prior ownership stays legible
  forever; history entries have no edit or delete path
  — the same discipline as #106's release tombstone and
  #100's append-only results. A gift is the degenerate
  case (#68): no return record; the seat change and the
  history entry are the identical shape.
- **Locks are inherited, never re-invented.** #68's
  `locks` evaluate before any trade interface opens:
  `story_locked` individuals (a partnered/principal
  individual) can never be escrowed, therefore can
  never be traded; egg/unhatched states are excluded;
  `species_untradeable` is a per-species flag whose
  **values remain OPEN** (#68's slot, carried). And
  #68's completion rule binds: #14 kept-state does not
  change hands inside the trade — the receiver's
  registry marks the species kept only via the normal
  kept transition the completed trade constitutes, so
  trades can never launder completion.
- **Storage semantics during a trade (#106).** Escrow
  is a lock, not a place: #106's `location` gains **no
  fourth kind**. While escrowed, the record's location
  keeps its pre-trade value and the record is
  escrow-locked — no party/Garden/storage moves, and
  release is refused by the same lock evaluation (a
  Mochi mid-trade cannot be released out from under
  the commit). On commit, `location` is set by the
  *receiver's* placement (party | garden | storage,
  chosen at receipt — part of the completion, not a
  default). On abort or decline, the escrow lifts and
  nothing has changed anywhere: #68's atomicity (both
  sides write, or neither does) at record level.
- **Show lane — a clarification, registered openly.**
  #68 ruled "the show lane never trades," and that
  ruling governs the **system**: no episode mechanic
  depends on the protocol, and partner bonds are
  narrative, never escrowed. This spec's mirror is
  narrower than a system: if a story ever *depicts* a
  transfer of care, it is an authored story event, and
  these semantics are what the story must stay
  consistent with (the individual's history gains an
  entry; nothing else about them changes; a principal
  partner is never the subject). If the owner reads
  #68's sentence as barring even a depicted transfer,
  that reading wins and this paragraph is void — the
  tension is registered in STAGING for the link check,
  not silently resolved here.

## Open slots (nothing invented)

Whether in-world Ranger-to-Ranger trading exists as a
game feature at all (that NPC Rangers hold tradable
individuals is content, not format) · `species_untradeable`
values (inherited #68) · gift channels and expiries
(inherited #68) · any trade interface · whether the
keeper-history array lives on #80's record or in #96's
history section beside #106's tombstones (a landing
seat decision — one home, recorded in the PR).

**OWNER RULING — flag RESOLVED (2026-10-27, applied at the List 18 landing):** the show MAY depict trades — as stories, side stories, and backstory (characters talk about how they got their Mochi in a trade, and how they evolved). #68's "the show lane never trades" is the SYSTEM rule only (the show never runs the trading mechanic); #168's show mirror STANDS as legitimate. A depicted trade turns on the Mochi's own wishes — creature agency stays at the centre. The earlier either/or flag is removed as resolved-by-ruling.
