# #78 — CONTEST / SHOWCASE EVENT SYSTEMS → GARDEN SHOWCASE EVENT FORMAT

**What was studied.** The contest architecture of the reference
games and their anime: (1) **appeal rounds** — a performance is
broken into judged *appeals*, each a short staged moment scored on
a declared category (the games' condition axes: beauty/cool/cute/
smart/tough, re-skinned per generation); (2) **two-phase structure**
— a visual/introduction phase (the creature is *seen*: condition,
sheen, presentation) then an appeal phase (the creature *does*:
move-based performances in turn order, with combination and
audience-reaction mechanics); (3) **judging as theatre** — named
judges, visible reaction beats, results as a reveal, not a table;
(4) the anime's coordinator register: contests are the *care*
counterweight to battles — same creatures, same moves, read as
expression instead of force.

**Our register is already set.** Canon/donor research on file:
**Garden "contests" are never battles-to-harm in the Garden's care
register**, staged with phase clarity — wide establishing → the
attempt → reaction close → resolve wide (the same shape EP01's Gabu
lunge-and-miss already uses). The Mochi Garden — opened by
Assistant Mochiko at R1-BEAT3 — is the showcase's home, and Mochiko
is its host by role. This format builds the event system on that
ground; it does not import the reference games' category names or
judging fiction.

## Native spec: `mochiichao/garden-showcase/v1`

### Event shape (one showcase = one Garden gathering)

```
GATHERING      wide establishing — Garden, entrants, audience (care register)
PRESENT phase  each entrant is SEEN: one held presentation beat
               (pose/grooming/condition read — no moves)
APPEAL phase   4 appeal beats per entrant, in rotating order;
               each appeal = one move or signature motion performed
               as expression (animscript with target = audience)
REACT beats    after each appeal: reaction close (judges + audience
               + rival entrants) — reaction is scored content, not filler
RESOLVE        wide resolve — results revealed as a Garden moment
               (ribbon-equivalent token; token design OPEN)
```

### Scoring model

- Each appeal is scored on the entrant's **declared axis** for the
  event. Axes are read off the species sheet, not a fixed category
  list: the axis vocabulary is the sheet's own (`temperament`,
  signature motion, element). An event declares 1 axis per entrant
  at entry (`axis: <sheet field value>`).
- Appeal score = base (move's appeal value — **a data gap**: moves
  carry no appeal field today; this spec proposes `appeal` as an
  optional moves.json field, values OPEN per move) + combination
  bonus (an appeal that answers the previous entrant's element or
  motion scores a harmony bonus) − repetition penalty (same move
  twice in one event decays).
- **No damage, no fainting, no HP.** A failed appeal is a flubbed
  performance beat (comedy/sympathy register), never an injury.
  This is an architectural constraint, like the battle doctrine's
  read-only living field: the showcase engine holds no reference
  to battle state.
- Judges: Mochiko hosts; judge seats beyond the host are **OPEN**
  (NPC seats filled per event from the region cast — no judge
  characters are invented here).

### Show-lane read

- The phase grammar (wide → attempt → reaction → resolve) is the
  storyboard unit: one appeal = one board sequence.
- Subtitle law applies unchanged: showcase narration, if any, is
  rationed to important moments; the device and host carry
  exposition beats (see #81 for device behaviour at events).
- Signature moves in appeals use the same canon mapping as battles
  (per-species signature attacks are canon) — performed *as
  expression*: Water Orb as a held, blooming orb, not a thrown one.
  The animscript format's `target` field takes `audience` for this
  lane (MOVE-ANIM-SCRIPT-FORMAT extension, proposed).

## Wiring

- **Garden (#65 care loop, #28 raising):** showcase is a Garden
  event type beside care and day-care (#77 residency); condition
  for the PRESENT phase reads the raising system's care state.
- **Moves data:** proposes optional `appeal` on move records —
  register in TBD as an owed field; no values assigned here.
- **Animscripts:** appeals are animscripts with audience target;
  anatomy-variance doctrine applies identically (performance
  blocks per body plan).
- **Events (#12):** a showcase run is an event-flag script
  (`story.showcase.*`) with the phase machine above as its states.
- **Completion (#14):** showcase participation is a device-visible
  record (ribbon-equivalent count) — presentation over event data,
  per the completion loop's derive-don't-store rule.

## Open slots (not invented)

- The results token (ribbon-equivalent) — name/design OPEN.
- Judge seats beyond Mochiko.
- Per-move `appeal` values (field proposed, values owed).
- Whether showcases exist outside the Garden (touring events) —
  canon silent; Garden-only until ruled.
