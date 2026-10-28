# #271 — THE 50-STEP SPECTRUM → one ladder for what you are and what they think

**The owner's shape, in his numbers:** the combined
morale/reputation spectrum has **about 25 branches
on the good side and 25 on the bad side — fifty in
total.** This spec is that ladder: the single
vocabulary every morale and reputation read in the
game (and, per #276, the show's writers' room) is
spoken in. Morale (#269) reads it directly; group
reputation (#270) reads it per group, so a Ranger
can stand at +14 with one town, −9 with another,
and carry a personal morale of +3 underneath both —
three true sentences in one language.

## Native spec — `mochiichao/spectrum/v1` (fragment beside this doc)

- **The steps.** Positions −25…+25 around **0,
  unmarked**. Each position is a step; steps are
  where the number stops, bands are what the steps
  are *called*, and effects hang on bands (below).
  A deed moves a read by its value (#269's table);
  crossing a band edge is the moment the world's
  terms change — the presentation marks band
  crossings (a greeting cools, a shopkeeper's price
  moves) and never marks single steps, so the ladder
  is felt in chapters, not in ticks.
- **The bands — DRAFTED vocabulary.** The names
  below are **drafted in RDR2/FNV style and are not
  canon**: they are working words the owner can
  rename wholesale; the ladder's shape, widths, and
  effects do not depend on the names. Five bands of
  five steps per side:

  | Steps | Good side (draft) | Bad side (draft) |
  |---|---|---|
  | 1–5 | **Decent** | **Rough** |
  | 6–10 | **Good-Hearted** | **Shady** |
  | 11–15 | **Honourable** | **Ruthless** |
  | 16–20 | **Gallant** | **Villainous** |
  | 21–25 | **Paragon** | **Black-Hearted** |
  | 0 | **Unmarked** (either system) | |

  For group reputation, the same band words are read
  as the group's word for the Ranger ("the town
  holds her Honourable; the Syndicate holds her
  Ruthless — in their swapped reading, a compliment",
  #270), and the **mixed flag** (#270) prefixes its
  own draft word — **Two-Storied** — at any band:
  a Two-Storied Decent Ranger is a different social
  fact from a Decent one, and the word says why.
- **Per-step and per-band effects (system data,
  filled).** Steps carry the small continuous terms;
  bands carry the doors:
  - **Steps (morale reads):** honest-shop price
    adjustment accrues per step (draft: 1% per step
    to a band-capped ceiling — good side discounts,
    bad side surcharges); fence payout adjustment
    mirrors per step on the bad side only.
  - **Bands (both systems):** greeting and crowd
    registers (#93/#242); #164 posting gates (service
    work opens at Decent+, underworld work at Shady−
    in the underworld's own reading); fence access
    bands (#274); wanted-response tempering (#272 —
    the law leans harder on repeat bad bands);
    first-impression defaults (#269's interaction
    rule reads the band, never the raw sum).
  The full effect table is data in the fragment —
  values drafted, tunable at landing; the *seats*
  (which systems read steps, which read bands) are
  the spec.
- **Two reads, one ladder — the discipline.** Morale
  reads the ladder with the ledger's full sum
  (unseen deeds included). A group's reputation is
  *placed* on the ladder by its named combination
  (#270 — fame band × infamy band; the coordinate
  points at the combination and is never an
  arithmetic difference, because fame and infamy do
  not cancel). Nothing else in the game may invent a
  third scale:
  a system that needs standing reads #269 or #270
  through this ladder, or proposes its read into
  this file. (The #201 inheritance: standing is
  derived, never stored, never currency — the
  ladder is a way of *reading* facts, not a wallet.)

## Show lane

The ladder is also the show's production vocabulary:
a character's band is written on their arc sheet
(#82), so "he enters the season Ruthless and the
town holds him Two-Storied" is a sentence the whole
crew can use. #276 carries the mirror; the long
game the owner has named — a thief anti-hero lead
in a later generation — is an arc *drawn on this
ladder*, which is why the ladder's fifty steps
matter: an anti-hero needs somewhere fine-grained
to climb.

## Wiring

Reads: #269 (morale position), #270 (per-group
positions + mixed flag). Read by: #118 (prices),
#93/#242 (faces), #164 (postings), #272 (law
temper), #274 (fence gates), #276 (show vocabulary).
Band-name strings are #23 display lookups — renaming
the draft words is a data edit, never a code change.

## Open slots

**The band names are drafted, not canon** — the
owner renames them when he wants; flagged here and
in the fragment so no later package quotes them as
settled. Effect values are drafted system data.
Nothing else is open: the shape is the owner's and
is fixed.

## Coverage — honest

- Shape: exactly the owner's — 25 steps a side,
  fifty total, one ladder for both systems.
- Contents: zero Rangers stand anywhere on it yet
  (the ledgers it reads are empty).
