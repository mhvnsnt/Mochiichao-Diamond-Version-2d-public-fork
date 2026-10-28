# #267 — RELEASED MOCHI RETURN TO THE WILD → release is a change of state, not an ending

**OWNER RULING (Jamar, 2026-10-27), stated first
because it reverses earlier work.** In the game, a
released Mochi goes back into the wild **as the same
individual**. It can be found and caught again — by
the Ranger who released it, or by a different Ranger.
This ruling **supersedes** the game-side model in
#106 (release as permanent deletion) and #211's
game-side refusal ("the same individual's return is
impossible by construction"). Those two files are
revised at landing per STAGING's revision steps —
the revision is written into their homes, not left
as a contradiction between packages. The show side
of #211 (a released character may return as story)
is no longer a special mirror: both lanes now agree
the individual continues, wild, with its record
intact. What the farewell *presentation* built in
#211 stays — a release is still a goodbye scene,
not a button. What changes is what the goodbye
means: you are giving up the keeping, not ending
the life.

**What was studied.** Release in the reference
games is deletion with a persistent dex fact — the
individual is gone, the species fact remains.
Returns of a specific released individual are a
*show-side* device in the reference record (a
released partner reappears, wild, and is recognised)
with no game mechanic behind it. The research pass
confirms the stronger statement: **release-return
exists nowhere in Pokémon or its mod scene — it is
original design** (RESEARCH-SOURCES.md). What does
exist, and what this system is built from, is the
**roaming model**: the reference games' roaming
legendaries are persistent wild individuals — the
same record, with its HP, status, and identity
intact, surviving across encounters, fleeing and
being met again until the meeting resolves. A
released Mochi is exactly that shape with an
ordinary species and a personal history: a
persistent wild individual the world keeps track
of. The roaming model supplies the persistence;
the return itself is ours.

## Native spec — `mochiichao/released-return/v1` (fragment beside this doc)

- **The revision to #106, in one move.** #106's
  `location` field gains a fourth value: `wild`.
  Release no longer deletes the individual record;
  it sets `location.kind: wild`, clears party/Garden/
  storage seats, and appends a release entry to the
  individual's history: `{releasedBy (Ranger ref),
  releasedBeat, releaseArea (#7 ref)}`. The record —
  variance (#80), honours (#104), care history (#28
  careLog), bond facts (#39), trade history (#68) —
  survives whole. #106's tombstone is superseded:
  the append-only history entry stays, but it now
  points at a living wild record instead of marking
  an end. There is still no undo: a released Mochi
  cannot be un-released from a menu — the only road
  back is finding and catching it again, below.
- **Where it re-enters the wild.** The individual
  joins the **wild-individual pool**: encounterable
  individuals who are specific records, not generated
  stock. Its re-entry area is worked out, not chosen:
  the nearest area of its species' home range
  (#102's range maps) to the release point. If the
  release point is already inside the range, that
  area is the re-entry area. (Designed, per the
  owner's brief: the release point alone would strand
  species outside their ecology; the range alone
  would make the release place meaningless. Nearest-
  in-range honours both.) It then lives in that
  area's encounter life like any wild individual —
  it can drift within its range by the ordinary
  roaming grammar (#114) but never leaves the range.
- **Finding it again.** A pooled individual surfaces
  through the ordinary encounter system (#7/#52) as
  itself: when its area generates an encounter of its
  species, the pool is checked first — a pooled
  individual present in the area can be the one met,
  weighted ahead of generated stock (designed value,
  in the fragment). Meeting it is a **recognition**:
  the Mochiioteca reads the record it already has —
  the individual shows as known (its history, its
  former keeper, its nickname if it carries one,
  #239), never as a stranger of its species. The
  dex state (#14) does not change by the meeting —
  `kept` was already true and stays a historical
  fact, exactly as #106 held.
- **Catching it again — by anyone.** Capture runs on
  #38's ordinary math; a pooled individual is a wild
  target like any other (it is nobody's, now — the
  keeper seat is empty, which is what release means).
  - **By its old Ranger:** the catch is a reunion in
    data. The keeper seat refills with the same
    Ranger; bond (#39) resumes from the record's own
    accrued facts — nothing was erased, so nothing is
    restarted. The history gains a `rekept` entry
    citing the release it answers.
  - **By a different Ranger:** the pool is world
    state (#146's one-world save is its home), so
    another Ranger's world can surface the same
    individual. The catch writes that Ranger as
    keeper, with the full history — including who
    released it, and when — travelling inside the
    record, exactly as a trade's provenance travels
    (#168). To the new keeper it reads as a Mochi
    with a past, because it is one. (The transport
    between players' worlds is engine territory —
    see STAGING's UNVERIFIED register; the *data*
    shape, one record with one keeper seat, is what
    this spec fixes.)
- **What release still refuses.** Story-locked
  individuals remain unreleasable (#68's lock, read
  by #106, unchanged — a partnered/principal
  individual cannot be released, full stop). A pooled
  individual cannot be released *again* while wild
  (it has no keeper; the act has no subject). A
  pooled individual is never breeding stock, gift
  stock, or exchange stock for any generator (#219's
  generator never mints or moves real records — the
  pool is only ever surfaced by encounters, in its
  own areas).

## Show lane

The show gains what the game now also has: a release
is a door, not a wall. A released character living
wild — recognised on sight by the Ranger who let it
go, or met as a stranger-with-a-past by a new one —
is a story the record itself supports, with
continuity (the same record) rather than #211's old
casting-only reappearance. Whether any release and
return is ever written is an episode decision (#82);
the system holds the road open.

## Wiring

Revision target: #106 (location vocabulary + release
semantics + tombstone supersession — STAGING step 1).
Presentation: #211 (farewell grammar stands; its
game-side refusal is revoked — STAGING step 2).
Pool home: #146's world state; surfacing: #7/#52
encounters, #102 ranges, #114 roaming; recognition
reads #14/#239; capture: #38; history discipline:
#68/#168's append-only provenance.

## Open slots

Which species, if any, canon forbids releasing
beyond the story lock (a story/canon call — none
asserted) · the show's first release-and-return beat
(canon — an arc decision, not a system one). The
mechanics — state, pool, re-entry, recognition,
re-keep by anyone — are filled in full.

## Coverage — honest

- Model: fully specified over verified homes
  (#106's field, #102's ranges, #146's world state,
  #38's math).
- Contents: zero pooled individuals exist (nobody
  has released anyone yet); the cross-player
  *transport* is registered UNVERIFIED in STAGING —
  the record shape is fixed, the engine is not
  audited because it does not exist in the sources.
