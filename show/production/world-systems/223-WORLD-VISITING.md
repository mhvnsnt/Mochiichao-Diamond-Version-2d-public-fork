# #223 — WORLD VISITING SYSTEM → a guest changes nothing

**Seat in the doctrine:** #146 founded the one-world
save and refused every per-region fork with a
derivation. Visiting is the social shape of the same
doctrine, one level up: a Ranger from one world
stands in **another Ranger's world** — and the save
architecture's answer is the same as it was for
regions. A guest is not a fork. This spec founds
visiting as **read-only presence**: the visitor is
*there*, socially and visually, and the host's world
is exactly as it was, plus a guest in it.

**What was studied.** Guest/visiting systems in the
publicly documented record: the visit as a session
(a host world opened, guests admitted, the session
ends and the world closes unchanged); venues as the
visit's container (a home/base shown to guests rather
than the world at large); the strict separation
between what a guest may *see* (generous) and what a
guest may *change* (the host's facts: nothing). The
kit taken: session-shaped presence, venue classes,
and the sees-much/changes-nothing contract.

## Native spec — `mochiichao/world-visiting/v1`

- **The visit session.** A visit is a session record,
  not a save structure:

  ```
  { host, guest, venue: <venue ref>,
    openedBeat, closedBeat: <beat | null> }
  ```

  Beats are session markers in #12's vocabulary, not
  world facts: opening a visit writes **nothing** to
  the host's world state, story flags, dex, economy,
  or any individual's record. #146's audit standard
  applies verbatim — every proposed guest-write is
  refused with a derivation, and the net stored
  change a visit proposes to the host's save is
  **zero**. What the guest carries home is their own
  session memory (their save's record that the visit
  happened — a #146 visit-record-class derivation on
  the *guest's* side, symmetric and equally thin).
- **Read-only presence, enumerated.** A guest may:
  be present and be seen; move within the venue's
  terms; view what the venue presents (a hideout's
  decoration, #169; the host's presented individuals,
  as presentation — seeing a Mochi is #14's *seen*
  class at most, and whether guest-seeing touches the
  guest's own dex derivations is a #14 question this
  package flags, not settles); and talk (the #90
  social layer's business). A guest may **not**:
  battle in the host's world for stakes or records
  (a friendly field duel is #210's grammar and its
  own records class — visiting grants no battle
  rights by itself); trade, gift, or receive
  (transfers are #68's protocol between saves, a
  separate act a visit may *occasion* but does not
  perform); touch the host's Garden, storage, shelter,
  or economy; or leave anything behind (no items, no
  messages-in-world, no marks — departure restores
  the venue exactly; a guest gift, if the story wants
  one, goes through #217 properly, outside the visit
  session).
- **The venue.** **Hideouts (#169) are the visit's
  venue class**: a hideout is already a personal,
  decorated, visitable interior with visiting rules
  in its own spec — visiting inherits them whole and
  adds no second visiting law. Whether venues exist
  beyond hideouts (a Garden parlour class, a town
  social space) is OPEN; the format's `venue` field
  is a ref precisely so the class can grow in its
  owners' files, not here.
- **Abuse shape.** Because a visit writes nothing,
  there is nothing to grief with: the worst visit is
  a boring one. Host controls (admit, close) are
  session facts on the host's side; a closed session
  is ended, not punished, and leaves no record on the
  guest beyond the session's own closed beat.
- **Show lane.** None as a system — stated plainly:
  visiting is a game-social system. The show's cast
  travels **its own** world under #137's geography
  and the connected-world doctrine; a "visitor from
  another world" is not a show concept, and no
  episode grammar is founded here. (A guest character
  *within* the world is ordinary casting, #145's
  travelling-NPC continuity — not this system.)

## Open slots (nothing invented)

Venue classes beyond hideouts · whether guest-seeing
derives dex *seen* state on the guest's save (flagged
to #14's home — not settled here) · session capacity
and simultaneity (how many guests a venue holds —
content/policy) · any visit occasion (a #104 proposal;
none asserted) · whether visiting exists as a shipped
feature (a product decision the format survives
either way).

## Coverage — honest

- **Architecture: fully documented** — session
  presence with a zero-write contract, derived
  directly from #146's verified anti-fork audit.
- **Contents: zero visits.** The yield is a guest who
  can be welcomed completely precisely because they
  can change nothing.
