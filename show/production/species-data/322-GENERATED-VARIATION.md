# #322 — GENERATED INDIVIDUAL VARIATION (GAME) → wild individuals differ, a little, on purpose

**The gap this fills.** #80 founded the individual
record and its two halves — rolled *variance*
(numbers, size class) and ruled *deviations*
(visible, named, owner's). Between them sits a gap
the game needs filled: **visible** differences on
**unnamed** wild individuals — the second Flickfin
off the same reef should not be a photocopy, and no
owner is going to rule ten thousand markings by
hand. This spec builds the generator that fills the
gap, inside fences strict enough that it can never
counterfeit the register (#318).

**One correction, stated before the spec.** The
commissioning brief listed "minor palette shifts"
among the variation kinds. **The standing law
forbids them:** #80's deviation rules and #196's
canon anchors both carry the Lustre Law — colourways
never vary per individual; palette variation has no
field in #80's schema. The generator therefore
varies **pattern and proportion, never palette**.
A marking may sit differently; its colour is the
species' colour. (Registered as a resolved
contradiction in STAGING.)

## Native spec — `mochiichao/generated-variation/v1` (fragment beside this doc)

- **One seed, third read.** Variation derives from
  #80's `personality_seed` by a derivation in #108's
  idiom — the same roll that drives variance and
  temperament drives this. **No second roll, ever:**
  a re-derived individual is identical, and a
  disagreement between reads is a derivation bug,
  never two facts (#108's law).
- **The variation table (closed kinds):**
  - `marking-placement` — the species' own marking
    vocabulary (the sheet's patterns, spots, bands,
    streaks) placed at bounded offsets / counts
    within the sheet's stated ranges. The generator
    chooses *where and how many* from the sheet's
    vocabulary; it cannot invent a marking the
    sheet does not carry.
  - `proportion` — limb/head/tail proportions moved
    within #80's `size_class` bounds and the sheet's
    silhouette tolerance — the same fence #80 puts
    on size: variation never rescues or breaks a
    silhouette read.
  - `part-finish` — surface finish of grown parts
    within the sheet's material words (a shield's
    veining density, a crown petal's count within
    range) — bounded by the part record (#259/#317),
    and a part's *presence* is never a finish.
- **Rarity shape.** Most individuals derive the
  species-typical read on most kinds (the table is
  weighted to typical, in #80's "mostly alike"
  register); a visible distinction on one kind is
  uncommon, on two is rare, and the combination is
  what #319's recognition reads as a generated key.
  The weights are presentation data on the table,
  tuned per species by the design lane — the
  *shape* (typical-weighted, bounded) is the law.
- **The fences (closed, each one a validation):**
  1. **Never register-class.** The table holds no
     absence-of-part, no posture-class change, no
     feature #318's form could describe. The register
     is read by the generator as an **exclusion
     list**: a derivation that would land on a
     registered individual's distinction is
     re-derived against the next table cell (stated
     as an algorithm obligation, since two
     individuals sharing the maskless one's
     distinction would quietly unmake the story).
  2. **Never sheet-forbidden anatomy.** The table is
     built per species from its sheet; a kind the
     sheet's must-never-change list touches is not
     in that species' table at all.
  3. **Never a new part.** Presence/absence of parts
     is species anatomy (#259/#317 stage records),
     not variation. Variation finishes parts; it
     does not found or remove them.
  4. **Never palette** (the correction above).
- **Where it lives.** The derived variation read is
  stored **on the individual's record** as a
  derivation snapshot at first encounter/keep (the
  record #80 owns, a new annex field proposed into
  #80's home) — stored because rendering (#325),
  inheritance (#324), and recognition (#319) must
  all read the *same* variation without re-deriving
  against a table that may have been retuned since.
  Retuning a table changes future individuals,
  never existing ones.

## Show lane

None, directly — the show's individuals are cast,
not generated (#326). The generator's existence is
why the show lane must never treat a game-generated
distinction as a cast fact: a generated standout is
a game's individual until the pipeline in #326
makes it more.

## Wiring

Derivation beside #108's reads; tables per species
from the sheet pass (same pass that owes #152/#258/
#259 annexes); snapshot proposed into #80's record;
read by #319, #323, #324, #325. Writes: the
snapshot annex, once, at first encounter/keep.

## Open slots

Authored content only: each species' table contents
(marking vocabulary ranges, proportion bounds,
finish ranges, rarity weights) — design-lane data
per sheet; zero tables are fabricated here.

## Coverage — honest

- Architecture: derivation discipline, the three
  kinds, the rarity shape, the four fences, the
  snapshot rule — complete.
- Contents: zero species tables instanced; the
  mechanism lands whole so the sheet pass can stock
  it line by line.


**Reconciliation — List 35 #337 (recorded at List 35's landing, 2026-10-27):** this file's seed-generated variation composes UNDER #337's drift, in #337's composition order (337-RAISED-VARIATION.md). The register/rates wall stands: nothing here joins #318's register in either direction.
