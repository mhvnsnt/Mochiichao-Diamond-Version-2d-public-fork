# #159 — RENTAL BATTLE SYSTEM → borrowed teams that never become yours

**Doctrine seat:** a rental Mochi is a snapshot, not an
individual. It is built on the individual model's shape
(#80) so battles can run over it honestly, but it is
never written to the roster, never gains a `location`
(#106), and expires with the run that borrowed it. The
borrowed are never the Ranger's individuals — not during
the run, not after, not by any accident of bookkeeping.
That is this system's whole law; everything below is
machinery to keep it true.

**What was studied.** Rental/draft battle formats in
the publicly documented record (the factory pattern):
the entrant picks a team from a presented set of
ready-made creatures, wins let them swap one member for
a presented option from the defeated side or a fresh
pool, and the borrowed creatures were never the player's
— no training, no keeping, no records attach to them;
the *streak* is the record. The kit taken: presented
sets, swap-on-win, snapshot individuals, expiry at run
end. #86 already names this architecture in its format
slots (`streak-draft`, `streak-swap`); this spec is the
record layer underneath those slots.

## Native spec — `mochiichao/rental/v1` (fragment beside this doc)

- **The rental snapshot:** `{snapshotId, runId (#86
  RUN), speciesId, variance (rolled from the run seed
  under #80's model), moves (from the species'
  learnset/registry as presented), heldItem (nullable,
  #31), provenance: "rental"}`. A snapshot is generated
  under #94's generator contract (seeded, reproducible:
  same seed + run = same presented sets) or drafted
  from a presented pool the generator produced. It is
  **not** an #80 record and must never be written where
  #80 records live.
- **Where snapshots live:** inside the run record
  (#86). A run holds its current snapshot set and its
  swap history. Nothing else in the save references a
  snapshotId — no roster entry, no dex fact, no
  careLog line, no honour.
- **What a rental battle writes — and doesn't.**
  Writes: the run's streak state (#86's own records).
  Does not write: roster (#106 untouched — no location
  is ever assigned), honours (#104 stamps land on
  individuals; a snapshot is not one, and the Ranger's
  own individuals gain nothing from a rental run),
  research tallies for the borrowed species (#97 — the
  Ranger did not meet it in the world), #14 kept state
  for the borrowed species. Opposing species met in
  rental battles produce `seen` evidence as any
  encounter does — the asymmetry is deliberate and
  stated: you can learn *of* a species by facing it;
  you cannot *keep* one by borrowing it.
- **Validation exception (registered, not hidden).**
  #109's validator sources parties from individual
  records with `location == party`; snapshots fail that
  check by construction. Rental formats therefore
  validate against a **rental source class** (source =
  the run's snapshot set, legality checks otherwise
  identical: species exists, move legality, item
  legality). The source class is proposed into #109's
  validator vocabulary in #109's own file at landing —
  until then, rental validation is spec-level.
- **Return conditions.** A snapshot set expires when
  its run ends — streak loss, format completion, or
  withdrawal; expiry is total (no snapshot survives
  into a later run; a new run generates fresh sets from
  its own seed). A swap (#86 `streak-swap`) expires the
  outgoing snapshot at the moment of swap and admits
  the presented replacement; swap history stays in the
  run record as run facts, not as creature records.
- **Normalisation** is #86's (fixed level band, value
  OPEN there); rentals change nothing about it.

## Show lane

A borrowed-team facility on screen is a place and a
stakes shape (the streak), staged under #82
conservation: the Ranger leaves with records and
knowledge, never with a borrowed partner. The snapshot
layer is invisible to the show.

## Wiring

Home formats: #86 `streak-draft` / `streak-swap`;
generation: #94's contract (seed from the streak
record, as #94 already specifies); model shape: #80
(read-only — the snapshot borrows the shape, writes
nothing back); validation: #109 with the proposed
source class; non-writes verified against #106/#104/
#97/#14 at landing as negative tests.

## Coverage — honest

- **Architecture: fully specified** (snapshot shape,
  home, non-write set, expiry, swap).
- **Instances: zero.** No facility hosts rentals yet
  (inherited #86 OPEN); presented-set sizes, pool
  composition rules, and swap cadence are content/balance
  slots — the documented shapes (pick-from-presented,
  swap-after-a-set) are named, their numbers not adopted.
