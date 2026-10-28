# #237 — INDIVIDUAL IDLE QUIRKS → the small behaviours that make an individual itself

**The gap this fills.** Three layers already say what a
species does and what an individual is like. The species
profile (#152) stocks the behaviours a species has. The
temperament (#108) — worked out once from the
individual's seed (#80) and true for its whole life —
says how it leans. The mood (#202) is the weather of a
day. None of them answers the smallest question: what
does *this* Mochii do when nothing is happening? It
chases its own tail-fin. It sleeps facing the door. It
hums one note before it eats. That is a quirk, and this
spec gives quirks a home.

**How Pokémon fills the same gap** (public record): a
creature's characteristic line is worked out from its
hidden values — one short piece of text, shown on its
summary, that is flavour and nothing else. It never
touches a number. Mochiichao takes that shape and does
one thing more: the quirk is not only a line of text, it
is a behaviour other systems can play.

## Native spec — `mochiichao/quirks/v1` (fragment beside this doc)

- **Where a quirk comes from.** A quirk is **worked out
  from the same `personality_seed`** #108 reads — no
  second roll, no new stored fact. The seed picks from
  the quirk vocabulary the same way it picks the
  temperament cell: same seed, same quirk, for the
  individual's whole life. If a quirk is ever stored,
  it is stored as a read (a cache of the derivation,
  the #108 pattern), never as a rolled fact.
- **The vocabulary is a closed list, held as data.**
  Each entry is one small behaviour with a plain name
  (`tail-chaser`, `door-sleeper`, `food-hummer` are the
  shape, not the contents — the full list is a data
  slot, filled by a pass over the sheets the way #152's
  profiles are distilled, species by species). An entry
  may be marked as fitting some body plans and not
  others (a fin quirk cannot land on a creature with no
  fin — the pick filters by the species' anatomy, the
  same sheet facts #152's profiles read). What the
  vocabulary may never contain: anything that changes a
  number. A quirk is behaviour colour, full stop.
- **Where quirks play.**
  - **Idle and field:** the follower / field-partner
    layer (#58's IDLE state, #160's assistance reads)
    mixes the quirk into the idle cycle — the quirk is
    the topmost flavour on #152's stocked idle loops,
    played when nothing else is asking for the
    creature's attention.
  - **The Garden:** #28/#65's care loop reads the quirk
    the same way — a quirk can be what a care moment is
    *about* (you play with the tail-chaser by playing
    chase), but it writes no care axis and changes no
    care value. The care system says what care means;
    the quirk says what it looked like.
  - **The summary screen:** like Pokémon's
    characteristic line, the quirk shows as a plain
    line of text on the individual's summary — a #23
    lookup, display layer only.
- **What a quirk never does.** No battle math, ever —
  #17's pipeline has no quirk term and this spec gives
  it none. No flags: a quirk playing is not an event
  and sets nothing (#12). No mood interaction beyond
  colour: mood (#202) picks *which* stocked behaviour
  plays; the quirk is part of what is stocked for this
  individual, so a flat mood can quiet a quirk without
  deleting it.
- **Deviations outrank quirks.** If an individual has a
  RULED deviation on #80's record that touches
  behaviour, the deviation is the character and the
  quirk yields to it — the same direction #80 already
  rules for looks (deviation is character, not error;
  a derivation is a default).

## Wiring

Reads: #80 (seed), #108 (the derivation pattern),
#152 (stocked idle loops the quirk flavours). Plays
through: #58 IDLE, #160, #28/#65 Garden reads. Writes:
nothing. Proposed: the quirk vocabulary list lands in
the species-sheet data pass beside #152's profiles.

## Open slots

Only content, no mechanics: **the quirk vocabulary's
contents** (the list itself, and which entries fit
which body plans) — content-lane data work, like #152's
profile contents. No owner story/canon decision is
parked here.

## Coverage — honest

- Derivation-from-seed and flavour-only effects: the
  documented shape (Pokémon's characteristic), extended
  to behaviour playback under canon's own layering.
- Contents: zero quirks instanced; the vocabulary is a
  data slot by design.
