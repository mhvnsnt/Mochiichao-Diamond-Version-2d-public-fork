# #126 — HALL OF FAME → Hall of Fame record

**What was studied.** The Hall of Fame in the publicly
documented record: at the moment of a league victory, the
game writes a **snapshot** of the winning team — who they
were at that moment — into a permanent, viewable archive.
Every later change to the living team (growth, trades, new
moves, release) leaves the snapshot untouched, because the
snapshot's whole purpose is to be the past. The kit taken:
history is stored as snapshots *on purpose*, in a system
where almost everything else is derived. No record
layouts, ceremony text, or team data are copied.

## Canon anchors (verified)

- **The trigger already exists:** #100's gauntlet fragment
  fixes the capstone — Champion Hex, clear flag
  `story.champion_defeated` (#12). The Hall of Fame record
  is written when that flag is set, including on rematch
  clears (#100's rematch ladders / #87), one record per
  clear, never an overwrite.
- **#98's licence is the view; this is the archive beneath
  it.** The licence *displays* gauntlet standing as a
  derivation and stores nothing. Standing answers "how far
  has this Ranger got?"; the Hall answers "with whom, and
  when?" — the fact/view split #98 itself established,
  with the facts living here.
- **#104's honours cross-link:** honours are stored stamps
  on the living individual record. A snapshot records
  which honour ids the individual held *at the clear* —
  so a Mochi traded away (#68) or released (#106) after
  the victory still shows its honours in the record of
  the run it won. (#122 shape 3 leans on exactly this
  bridge, and cites it there.)
- **The rename law binds history too:** display names are
  always #23 lookups, so the snapshot stores **ids and
  facts, never name strings** — a species renamed by owner
  ruling renders under its current display name in the
  archive, exactly as everywhere else. History keeps the
  facts; the present keeps the names.

## Native spec — `mochiichao/hall-of-fame/v1` (fragment beside this doc)

A record is written once, at a capstone clear:

- `recordId` — stable id; `cycle` — the run's cycle
  counter (1 for a first-run clear; #122's proposed
  `meta.cycle` if NG+ is ruled in — the field reads 1
  until then, no dependency taken).
- `clearFlag` — `story.champion_defeated` (the #12 fact
  that fired the write; a record whose flag cannot be
  resolved is a data error, per #104's stamp discipline).
- `rangerId` — the licence identity (#98/#96 `meta`).
- `team` — one snapshot row per party individual at the
  clear:
  - `individualId` — the #80 record id (a reference for
    as long as the record lives; the snapshot must not
    *depend* on it resolving).
  - `speciesId` — the species id, copied as a fact.
  - `honoursAtClear` — the #104 honour ids held at the
    clear, copied as facts.
  - `movesAtClear` — move ids known at the clear, copied
    as facts (join keys into the registry, per #101).
  - **Deliberately absent: any "level" field.** The
    audited canon data carries baseStats and the effort
    ledger (#39) but no level field this package can
    cite; growth-at-clear joins by whatever field the
    game rules in, registered OPEN rather than assumed.
- `sequence` — the gauntlet composition the run cleared
  (the #100 sequence as run: Umi / Gin / Hono / Yoru /
  Hex), copied as ids so a future re-composition of the
  circuit cannot rewrite past victories.
- **Append-only:** records are never edited or deleted by
  any system. (The production-side echo of the same law is
  #53's board-pipeline versioning: never overwrite.)

**Storage:** a `hallOfFame` facts section in the save
payload, arriving under #96's rule for new sections —
*absent = default* (an older save simply has no records
yet). It is a facts section: rows are stored, and nothing
in it is derived. Derived views over it — "first clear",
clear count, the licence's standing line — are computed
at read, per #14/#98.

## Wiring

Written by #100's capstone event (the flag-set at
`story.champion_defeated` — the write hooks the same
declared completion point #120's `on_complete` discipline
uses); reads #80 (individuals), #104 (honour ids), #98
(identity + the standing view that renders over it),
#23 (all rendering). Display home in-world — a facility
under #86 or a licence case view — is **OPEN**.

## Coverage — honest

- **Architecture: fully documented**; snapshot-on-victory
  is the standard pattern across the record.
- **Contents: the growth-at-clear field (pending the
  level ruling), the in-world display home, and ceremony
  presentation are OPEN.** The record shape, trigger, and
  cross-links are fixed by real joins (#100/#98/#104),
  and zero records exist — there has been no clear to
  record, and this package does not fabricate one.

**Ruling received (List 19 #178, landing 2026-10-27):** hall-of-fame snapshot rows carry `levelAtClear` — the individual's derived level (#178's derivation from #177's gain total) evaluated at the clear and COPIED into the snapshot as a fact, per this file's own snapshot discipline. The level itself is derived and stored nowhere else; the snapshot copy is the one stored form.
