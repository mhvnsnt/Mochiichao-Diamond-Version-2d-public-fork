# #211 — RELEASE & FAREWELL PRESENTATION → the goodbye is a scene, not a button

**Doctrine seat:** #106 founded release, honestly:
release is **permanent deletion of the individual
record** — no undo slot, no recovery — and what
remains is a **tombstone**: one append-only fact
`{ honoursCount, keptBeat, releasedBeat, ... }`, kept
with #12's history, "enough for the hall to know the
individual was kept and released, never enough to
resurrect it." That model does not change here by a
single field. What #106 does not specify — because
it is a storage system — is the *moment*: how the
game presents an irreversible act so it lands with
the weight the data says it has. This package is
that presentation grammar, in both lanes.

**What was studied.** Release presentation in the
publicly documented record: the reference games'
release is famously abrupt (a menu, a wave, a "bye-
bye" text box) while their *shows* give releases
full farewell episodes — the gap between the two is
the teardown's finding, and this package closes it
on the game side without softening the data's
honesty: the act stays permanent; only its staging
grows up.

## Native spec — `mochiichao/release-farewell/v1` (presentation grammar; no new stored shape)

- **The act is a place, not a menu.** A release is
  performed in the field, with the individual present
  (#58's follower presence — you release who is *with*
  you, face to face). The sequence is fixed in order:
  1. **Statement.** The game says what release is, in
     #23 display strings, before any confirm: the
     individual leaves, the record ends, there is no
     undo. (The two-step legible confirm is a
     presentation requirement precisely because #106
     offers no recovery — the UI must be as honest
     as the data.)
  2. **The farewell beat.** The individual performs
     its farewell — the cry is the species' call/
     affection variant from #2's cry spec (the sheet
     vocabulary already carries both), and the
     animation is a *leaving*: the individual departs
     the frame under its own locomotion (anatomy
     classes from the sheet — it walks, swims, flies,
     or fades as its kind does; #147's ledger owns
     the owed-animation accounting). Never a fade-to-
     nothing delete, never a ball-opening in reverse.
  3. **The departure completes; then the tombstone
     writes.** Order is law: #106's deletion +
     tombstone happen **after** the farewell
     completes. Backing out at any point before the
     departure writes nothing — the act is the
     goodbye, not the menu click.
- **Farewell never deletes history.** The tombstone
  is the only new fact, and everything already true
  stays true: #104's honours facts stand (they were
  earned; #161's build verified the same reading for
  measurement facts — "a record set by a since-
  released individual stands"), #126's snapshots
  still show the individual in the run it won, #97's
  tallies stand, #68's trade history stands. Release
  ends a record; it does not revise the past.
- **What is refused.** Recovery, recently-released
  lists, release-undo items, and any "the same
  individual returns" mechanic in the game: #106's
  model makes the same individual's return
  **impossible by construction** (the record is
  deleted; the tombstone cannot resurrect). This
  package states that refusal on its face so no
  future system mistakes the show mirror (below)
  for a game feature.

## Show lane — the lanes split, stated carefully

In the show, a release is a **character's choice
with weight**: a Ranger releasing a partner is a
named canon beat in the arc plan — it is precisely
the class of permanent change #82's entry = exit
conservation exists to gate (the checklist item is
not "unresolved" — the beat *is* the named change).
And the show may, as authored story, bring that
character back in a later episode as a wild
individual — the creature the audience knows,
living wild — because the show is cast, not saved.
**That reappearance is a story act with no record
continuity:** there is no #80 record it resumes (in
game terms the record ended), no save will ever
show it, and scripts must not present the return as
the game's release being reversible. The lanes are
stated this way so each stays honest: the game's
release is final; the show's farewell is a door
story may reopen *as story*.

## Wiring

Consumes #106's release + tombstone unchanged (the
tombstone's shape is #106's; this package adds no
fragment because it stores nothing); presence reads
#58; cry variants read #2; departure animations join
#147's coverage; the history-survival lines cite
#104/#126/#97/#68 in their homes at landing.

## Coverage — honest

- **Grammar: fully specified** over #106's verified
  model; the sequence's order law and the lanes
  split are this package's whole yield.
- **Contents:** farewell animation coverage is owed
  per species/anatomy (#147's ledger counts it);
  no farewell variant is asserted as existing for
  any species today.

## Open slots (nothing invented)

Farewell beat durations and staging values
(production) · the exact display strings (writing,
via #23) · whether any place is release-forbidden
(a story/canon call — a #12 fact would gate it;
none asserted) · the show's first release beat
itself (canon — an arc decision, not a system one).

**OWNER RULING — game side SUPERSEDED (2026-10-27, applied at the List 22 landing):** in the GAME, a released Mochi goes back into the wild as the same individual — findable and catchable again by its old Ranger or a different player, history intact. Release is a change of the individual's state to wild, NOT a record closing forever; this supersedes this file's game-side refusal. The SHOW side of this file stands as written (a released character reappearing in the show is authored casting, with no record continuity) — the two lanes state it from their own sides and are not harmonised. The #106/#211 revision lands with List 28 (items 267-276).


**REVISION — List 28 #267 (applied at its landing, 2026-10-27), completing the OWNER RULING note above:** (a) The game-side refusal in "What is refused" ("the same individual returns" as impossible by construction) is revoked, as the note above records. (b) The doctrine-seat paragraph's claim that #106's model "does not change by a single field" is corrected: at the List 28 landing #106's model changed by exactly the `wild` location value and the release semantics (see #106's own revision note) — the farewell grammar below is written against the revised model. (c) The lanes-split section is rewritten by this note: both lanes now hold the same fact — a released individual continues, wild, with its record intact (#267) — so a show return is no longer a casting-only reappearance with no record continuity; it is the same recorded individual, in both lanes. The List 22 note's sentence "the two lanes state it from their own sides and are not harmonised" is superseded by #267's ruling. (d) What stands entire: the farewell presentation grammar — the act is a place, not a menu; the sequence's order is law (statement, farewell beat, departure completes, *then* the record writes) — the record now writes a release entry to a living wild record instead of a deletion plus tombstone. Backing out before the departure still writes nothing. Farewell still never deletes history.
