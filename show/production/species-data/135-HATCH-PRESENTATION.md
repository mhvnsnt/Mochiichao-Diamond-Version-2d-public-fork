# #135 — HATCHING → hatch presentation & first-bond system

**What was studied.** Hatching sequences in the reference
games and anime, as publicly documented: in the games, a
threshold event — the egg's cycle count completes and the
hatch fires as a short staged sequence (the egg, the
light, the reveal, the registration prompt); in the anime,
the hatch is a *birth scene* — witnessed, emotional, the
first bond formed in the room. The kit taken: the hatch
is a **sequence grammar over an owed data slot**, ending
in two registrations — the individual joins the roster,
and the dex records the meeting — in that order, because
the individual is the fact and the dex entry is its
shadow. No sequences, text, or data are copied.

## Canon anchors (verified — this spec is an owed referent)

- **#77 built the egg system and left two fields owed:**
  `hatchCycles` (a species-data field #77 adds to the
  sheet schema — the cycle count an egg of that species
  needs) and `hatchPresentation` (per-species data on the
  species record, #77's own lines: cycles come "from
  offspring species data: hatchCycles"; presentation is
  "per-species data (`hatchPresentation` on the species
  record)"). #77 specified that the fields exist; **this
  spec is what `hatchPresentation` contains** and how the
  moment is staged in both lanes.
- **The Garden is the hatch's home** in the game lane:
  #77 housed day-care in the Mochi Garden under Mochiko
  (the keeper, #65's loop). An egg hatching in the Garden
  is the default staging; a hatch elsewhere (field) is
  the same grammar in a different room, not a different
  system.
- **The individual is born with its variance:** #80's
  rolls happen at the individual's creation — stat
  variance bounded 0–15, size within tolerance,
  temperament from the same `personality_seed` #108 reads.
  A hatch is a creation: the rolls fire here, not at
  capture, and #80's inheritance rule (a bounded slice of
  parental variance) applies to bred eggs exactly as #80
  wrote it.

## Native spec — `mochiichao/hatch-presentation/v1` (fragment beside this doc)

`hatchPresentation` on the species record carries the
**grammar slots**, per species (contents OPEN):

- `shellBreak` — how this species' egg opens (a staging
  class, not an asset: crack pattern family, from the
  sheet's egg data where #77's system holds it).
- `revealBeat` — the reveal staging: the hatchling's
  first presentation held long enough to be memorised
  (#42's landing rule borrowed for a birth: the audience
  must be able to draw the new individual afterward).
- `firstCry` — the newborn's first cry, rendered from the
  species' #2 cry parameters (a cry is the hatchling's
  first act in both lanes; in the show it is the scene's
  sound centre, per the voice law — creatures are cries).

**The sequence (both lanes, one grammar):**

```
READY (cycles complete — #77's counter reaches its
  species' hatchCycles; the egg signals readiness by its
  own staging class)
→ BREAK (shellBreak fires; held, not rushed — #42's held-
  pose discipline: the change happens on a held frame)
→ REVEAL (revealBeat: the hatchling, whole, held)
→ FIRST CRY (firstCry from #2 params)
→ FIRST BOND (the registration beat — below)
```

**First bond & registration (the system's real yield):**

- The hatch creates the **individual record** (#80):
  variance rolls, personality seed, and the record's
  origin written as `hatched` with the egg's parentage
  refs where #77's breeding data supplies them (facts,
  per #96's law).
- The individual enters the **roster** at the hatch
  place: in the party if a slot is open, else into
  storage under #106's `location` semantics — the same
  rule a capture follows (#38), so a hatchling is never a
  special case in the roster code.
- **Name-giving** is offered at registration (the
  documented pattern: the hatch is the naming moment) —
  names are #23-layer display data on the individual;
  whether Mochiichao offers naming, and its rules, is
  **OPEN** (no canon rules it; the slot is recorded, the
  answer is not invented).
- **Dex:** the species' `met` state derives from the
  roster exactly as a capture's does (#14) — a hatchling
  is met because it *is*, not because a flag was set for
  the occasion. #97 research tallies treat the hatch as
  the encounter fact it is.

**Show lane:** the hatch is a birth scene under the
sequence grammar above, staged with #42's channels where
they fit (silhouette first — the shape in the shell —
then colour, then aura) and scored as the episode's
emotional centre; arc conservation (#82) counts a
hatchling as a change the exit state must honour, same
as a capture.

## Wiring

Fulfils #77's two owed fields (this spec is
`hatchPresentation`'s content definition; `hatchCycles`
stays #77's field). Creates records in #80's shape;
roster/storage joins #106/#38; dex/research derivations
#14/#97; cry rendering #2; staging grammar #42; Garden
housing #65/#28. Save impact: the individual record is
#96 payload, like any other.

## Coverage — honest

- **Architecture: fully documented** in both media
  (threshold hatch + registration in the games; birth
  scene in the anime).
- **Contents: the grammar and the registration order.**
  Per-species `hatchPresentation` values, egg staging
  classes, and the naming rules are OPEN — species data
  and owner decisions, landing through the sheet-intake
  gate (#77's registration path), not asserted here.
