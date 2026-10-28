# #245 — FIELD RESCUE SERVICE → hurt wild Mochi are treated and let go, never kept

**The gap this fills.** The world has answers for a
kept Mochi who is hurt (centres, #132; the Garden,
#28) and for a wild Mochi you battle (#38's encounter
grammar). It has no answer for the third case: a wild
Mochi found hurt — a fall on a route, a storm's
leavings, a territory dispute's loser (#231). Somebody
in this world does that work. This spec is that work,
as an institution with one bright line through it:
**rescue never keeps.** A rescue ends with the Mochi
back in its life, or sheltered toward one — never in
the rescuer's party.

**How the reference record fills the same gap:**
Pokémon's world scatters the pieces — rangers (the
other kind) who heal wild creatures in the field, a
shelter in the anime that takes in the hurt and the
abandoned, released back when they can go. The working
shape is constant: care is given, custody is temporary,
and the wild life resumes. Mochiichao gathers the
pieces into one service and writes the custody down.

## Native spec — `mochiichao/field-rescue/v1` (fragment beside this doc)

- **Rescue as a mission.** A rescue begins as a
  mission under the board's closed vocabulary (#164):
  it instances as an **`assist`** — the kind whose
  shape is helping at a place — carrying a rescue
  sub-record from this package (below). No new mission
  kind is founded; if landing prefers `rescue` as its
  own kind, that word is proposed into #164's file, in
  #164's home (STAGING step 8). Rescues also arise
  without a board: a Ranger who finds a hurt wild
  Mochi in the field can begin the same record on the
  spot (a found rescue is the same record with a
  different first entry — the board is a way in, not
  the only door).
- **The rescue record** (this package's home):
  `{rescueId, foundArea (#7 ref), species (as
  identified — a rescue can begin before the species
  is certain, and the record may hold a discovery-state
  read per #207 rather than a name), condition
  (presentation classes: hurt / trapped / stranded —
  conditions here are the field kind, never battle
  status, #182's vocabulary is not borrowed), custody
  (chain of seats), outcome}`.
- **The custody chain — the whole lifecycle:**
  - **Treat:** first care where it lies, or carried to
    the service's hands. Treatment is a service act in
    the centre family's discipline (#132): it performs
    the defined thing — this wild individual is made
    well — and writes no care axes, no bond, no dex
    state (a rescued Mochi is not "met" by being saved;
    discovery is the encounter system's grammar, not
    gratitude's).
  - **Shelter:** if it cannot be released at once, it
    rests under the shelter's custodial record
    (#220) — custody, exactly as #220 holds strays:
    a seat, a stay, an ending owed.
  - **Release:** the default ending — let go at (or
    as near as is safe to) where it belongs: its home
    area's edge of the event that hurt it. Release
    writes the outcome and closes the record. The
    released individual is a wild individual again in
    every system that reads it. The rescue record is
    the **service's** record; the wild individual's own
    record is touched only if it later gains one by
    being kept through the ordinary door. A rescue
    leaves no claim on a wild life.
  - **The bond exception, stated carefully:** sometimes
    a rescued Mochi does not want to go. That is not
    the rescue keeping it — that is a new story, and it
    travels the only roads canon has for it: the
    shelter's adoption path (#217), or a later ordinary
    encounter (#38) where the keeping is the encounter
    system's act, done in the open, by that system's
    rules. The rescue record closes as *sheltered →
    adopted* or *released*, and the keeping, if it ever
    happens, has its own first page elsewhere. A rescue
    whose procedure ends in a party slot is a data
    error by construction: this record's outcome
    vocabulary has no such word.
- **The Dark Forest edge.** Rescues happen at the
  Forest's edge and on its surface paths, like
  everything human in that place. The depths take no
  rescues: there is no service road into them, no
  record's `foundArea` may name the depths, and a hurt
  thing in the depths is the Forest's business — the
  standing law, stated at the one service whose whole
  instinct is to go in. (What the show does with that
  fact is the show's dread to spend; the service's map
  ends at the edge either way.)

## Show lane

A rescue is one of the show's natural episodes — the
service as a place, its keepers as cast (content-lane
casting; no rescuer is invented here), a hurt wild
Mochi as a guest the audience roots for precisely
because everyone on screen knows it has to be let go.
The bond exception, when the show spends it, is a
season-grade beat and travels #217's road on screen
the same as off it.

## Wiring

Instances under #164 (`assist` + this sub-record);
treatment in #132's discipline; custody in #220;
endings in #220's release or #217's adoption. Writes:
the rescue record (service-side), custody events in
#220's home. Never writes: a keep, a dex state, a
care axis, a bond.

## Open slots

The service's name, its places, its people — story/
canon facts and world content, the owner's and the
content lane's, kept as slots. Every rescue ever
instanced: zero. The mechanics — lifecycle, custody,
the never-keeps law, the depths line — are filled in
full.

## Coverage — honest

- Treat → shelter → release with custody written
  down: the scattered reference shape gathered into
  one service, seated on verified homes (#164/#132/
  #220/#217).
- Contents: no rescue, rescuer, or service post is
  instanced.

**Link-check reconciliation (List 25 landing, 2026-10-27):** #245 and List 24's #231 (wild territory events) were built in parallel and agree — a rescue happens where the territory event put the one who needs it; #231 derives the event, #245 answers it.
