# #106 — PC / BOX STORAGE → Mochi storage system

**What was studied.** Creature-storage architecture in the
reference games, as publicly documented: a kept creature not in
the active party lives in a **storage system** — an organised
set of boxes/walls of slots, each slot holding one individual's
full record; moving between party and storage is a record
*relocation*, never a copy; **release** deletes the individual
and returns it to the wild, permanently, while the dex's
registration of its species **persists** (you once kept one;
that fact is history). Later systems add search/sort views and
batch operations, but the core is: one record, one location,
honest deletion. The kit taken: single-home records, location
as data, views as derivations, release as tombstoned deletion.
No box art, names, capacities, or code are copied.

## Native spec — `mochiichao/storage/v1` (fragment beside this doc)

- **One individual, one record, one location.** The individual
  record lives where #80/#96 put it (the save's roster). Storage
  adds exactly one field to it: `location` —
  `{kind: party | garden | storage, box: <boxId|null>, slot:
  <int|null>}`. Party membership, Garden residence (#58's
  follower system reads Garden-resident individuals; PRINCIPAL
  roster-binding applies there), and storage are three values
  of one field, so an individual can never be in two places or
  none. **There is no storage database** — storage is a view
  over the roster filtered by `location.kind`, which is what
  keeps #96's save sections singular.
- **Boxes are organisation, not capacity fiction.** A box is
  `{boxId, label}` — the label is the Ranger's own word for the
  box (a display string via #23, owner's content). Box *count*
  and slot *capacity* are **OPEN** numbers (no canon figure
  exists; the reference games' capacities are their tuning, not
  ours). Sort/search/filter are **derived views** over record
  fields (species, level, variant, honours count) — computed at
  read time, never stored, per the programme-wide derived law.
- **Roster-binding joins.** Storage respects the bindings the
  other systems already wrote:
  - The **partner/principal** individual follows #58's
    PRINCIPAL-class binding and #68's story lock (below) — the
    format marks the partner's record; whether the partner may
    be *stored* at all is an **OPEN** owner decision (the slot
    ships with the question, not an answer).
  - Egg/unhatched states (#77) are location-legal in storage
    and Garden per #77's day-care housing; the egg record is
    the individual record in its egg state, not a second kind
    of thing.

## Release — modelled honestly

Release is the one irreversible act in the system, and the
spec refuses to soften it:

- **Release is permanent deletion of the individual record** —
  its variance roll (#80), its honours (#104), its care history
  (#28 careLog entries for that individual) go with it. There
  is no undo slot, no recently-released recovery, no trash
  folder in this format. A UI built on this spec must say so
  at the point of action, in those terms.
- **A tombstone remains.** Release writes one append-only
  record to the save's history: `{speciesId, variantId,
  honoursCount, keptBeat, releasedBeat}` — enough for the
  world (and the show's records) to remember *that* an
  individual was kept and released, never enough to resurrect
  it. Tombstones are facts, kept with #12's history, not in
  the roster.
- **The dex does not revert.** `kept` in #14 is a historical
  state (a species the Ranger has kept); releasing every
  individual of a species leaves the entry kept — the
  documented behaviour of the reference systems and the only
  reading consistent with #14's state machine (states advance
  on events; release is not an un-keep event).
- **Story-locked individuals are unreleasable.** #68's lock is
  reused verbatim: `story_locked` (a partnered/principal
  individual can never be escrowed) applies to release with
  the same force — a story-locked individual cannot be
  released, full stop, evaluated before any confirmation
  prompt. The lock is a property other systems already read;
  storage adds no second lock vocabulary.

## Show-side echo

The show has no storage UI — it has the Garden: kept Mochi
*who are not travelling* live somewhere, and that somewhere is
the Garden under Assistant Mochiko's keeping (R1-BEAT3). The
show's word for `location.kind: garden` is home; `storage` as
a fiction is a game-lane abstraction the show never depicts as
boxes. Release, if a story ever touches it, is a goodbye the
tombstone models honestly: permanent, remembered, not undone.

## Wiring

Record home: #80 individual model + #96 roster section (one
new field — registered in STAGING as a schema note, not
silently assumed). Locks: #68. Dex permanence: #14. Garden
residence: #58/#65. Eggs: #77. Honours carried in-record:
#104. Display strings: #23.

## Coverage — honest

- **Architecture: fully documented** across every generation
  of the reference systems.
- **Contents: mechanics specified; numbers and the partner-
  storage question OPEN.** No capacity, box count, or partner
  rule exists in canon, and none is invented here.

**PROPOSAL from List 20 #193 (registered at its landing, 2026-10-27):** an additive, nullable custody marker on this file's location record for daycare custody. Until accepted here, custody reads as Garden residence plus #193's service record, and no report may call the sub-seat wired.

**PROPOSAL from List 23 #220 (registered at its landing, 2026-10-27):** a shelter custody seat — a place an individual can be WITHOUT a keeper change — proposed into this file's location model. Until accepted here, shelter custody is spec-level. The non-write audit stands beside #132's: an intake changes no keeper seat and writes no care axis, and a reunion completes with NO transfer stamp at all (the keeper never changed).
