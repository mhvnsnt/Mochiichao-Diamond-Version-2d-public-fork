# #188 — SPECTATOR MODE → read-only battle projection

**What was studied.** Spectator clients in the publicly
documented versus record: an observer client receives the
match's *presentation stream* — what the game shows — while
the server withholds hidden state (hands, unrevealed team
members, pending choices) by construction, not by the
client's good behaviour. Delayed feeds exist in the record
as an anti-ghosting measure. The kit taken: spectating as a
projection with an information contract — the spectator's
view is *derived* from the presentation layer, and there is
no code path by which hidden state reaches it. No client
code, protocols, or data are copied.

## Canon anchors (verified in the packages)

- **#10 already built the spectator's seat.** The
  `LIVING_FIELD` layer "holds no reference to the battle
  state object — it receives a read-only render snapshot
  (species, positions, tempo)". A spectator is that same
  snapshot, delivered to a third party: the architecture's
  own read-only surface, reused, never widened.
- **#109's versus lobby owns who is in a match.** Its
  validator checks entrants (party legality, held-item
  rules); a spectator is not an entrant and the validator
  never sees them — spectating adds no party, no record, no
  standing to a versus battle.
- **#86's facilities own the other spectating seat.** A
  streak RUN in progress is a presentation; its RECORD is
  post-hoc data kept forever. Watching a run is watching
  presentation — the record is read afterwards like any
  history (#126).

## Native spec — `mochiichao/spectator/v1` (fragment beside this doc)

- **The projection.** A spectator session is
  `{battleRef, viewer, mode}` where the view delivered is
  exactly #10's queue as it displays: announcements,
  animscripts, damage numbers, status messages, cries —
  plus the field state the presentation itself shows
  (species on the field, positions, tempo, health bars as
  displayed). Live spectating rides the live battle;
  spectating a finished battle is replay playback (#187)
  and inherits its sandbox.
- **The information contract (what never crosses).**
  - Unrevealed party members — a side's benched individuals
    are invisible until the battle's own presentation sends
    them in.
  - Held items **beyond what presentation reveals** — an
    item becomes spectator-visible only when a queue item
    has named it in play; the pre-battle held slot (#31 /
    #109's validator read) is hidden state.
  - Any command before it resolves — the spectator sees
    `COMMIT` outcomes through the queue, never a pending
    choice, never both sides' inputs in advance.
  - AI internals (#18's scores), unrevealed variance and
    deviation data (#80 records are not broadcast), and any
    Ranger's private layers (journal #191, vault #190).
  The contract is enforced by derivation: the projection is
  built from the displayed queue, so there is nothing else
  in it to leak.
- **Writes: none.** Spectating writes no record in the
  spectator's save or the battle's. No honours, no tallies,
  no "watched" flags — attention is not a world fact in
  this programme (compare #97: research is stored facts
  from *encounters*, not from watching).
- **Live vs delayed.** Whether versus spectating is live or
  delayed (the anti-ghosting question) is a ruleset
  property — it lands as a slot on #109's ruleset record,
  values OPEN, proposed into #109's home. This package
  fixes only that the choice is the ruleset's, recorded,
  and the same for every spectator of a match.

## Show lane

Crowds in the show are staged fiction — a dojo crowd is
part of an episode's staging under the show's arc grammar
(#82's home), performed like any other scene element. This
package asserts no crowd system and supplies none; #82's
file, checked at this build, carries no crowd-specific
grammar, so crowd staging remains episode content (OPEN),
not a mechanic either lane imports.

## Wiring

Reads: #10 (queue + render snapshot), #187 (finished
battles). Seats: #109 (versus), #86 (facility runs).
Writes: nothing. Proposed: delay slot into #109's ruleset
record (its home decides).

## Coverage — honest

- **Architecture: fully documented**; the information
  contract is the documented core of every honest
  spectator client.
- **Contents: no match is instanced;** the live/delayed
  ruling and any facility-specific spectating etiquette
  are OPEN.
