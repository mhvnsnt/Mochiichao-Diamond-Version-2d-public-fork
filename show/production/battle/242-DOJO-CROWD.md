# #242 — DOJO CROWD & SPECTATING → the crowd is a chorus, never a judge

**The gap this fills.** Spectating exists (#188): a
read-only projection of a battle, built from what the
battle's own presentation shows, under an information
contract — hidden state never crosses. But #188's
spectators are *clients*: other players watching
through the system. A dojo battle has a different
watcher — the crowd in the room. People on benches.
Other Rangers' partners at their feet. This spec is
that crowd: what it sees, how it reacts, and the one
thing it can never do.

**Canon anchors (verified in the packages).**
- #188's information contract binds by derivation: a
  view built from the displayed queue contains nothing
  else to leak. **The crowd's view is that same
  derivation with feet on the floor** — the crowd sees
  exactly what the battle's presentation shows in the
  room, because that is all there is in the room to
  see.
- #10's battle flow runs on a `tempo_state` (calm /
  tense / dread, presentation only) that the living
  field breathes by. The crowd breathes by the same
  tempo: it is a presentation layer reading a
  presentation signal — it cannot reach the battle,
  for the same architectural reason #10's living field
  can't: it holds no reference to the battle's state.

## Native spec — `mochiichao/dojo-crowd/v1` (fragment beside this doc)

- **A crowd record** seats on the battle's venue — the
  dojo's encounter seat (#30/#45's circuit records own
  the dojo; the crowd is a presentation annex there,
  or on the interior record #119 where the dojo has
  one): `{venueSeat, sizeClass, composition}` where
  composition is drawn from who is plausibly in the
  room — local NPCs (#93's schedules say where people
  are), visiting Rangers (#145's travellers when
  present), partners at feet (principals, #58's class —
  never ambient). A crowd is *cast from the world's
  facts*, not generated from a crowd-shaped fog: the
  roster-binding law (#84's family) applies to people
  too — a dojo in a fishing town crowds with fishers.
- **What the crowd sees** is the information contract,
  stated for a room: the creatures on the field, the
  moves as performed, health as displayed, the tempo.
  The crowd does **not** see: benched party members,
  held items until play names them, a Ranger's pending
  choice, anything on a screen anyone is holding
  (#149's device is personal). A crowd reaction to
  something it couldn't have seen is a writing error,
  in either lane.
- **How the crowd reacts.** Reactions are keyed to the
  battle's own beats, read off #10's queue as it
  displays: a reaction table per venue class —
  `onEntry` (the challenger walks in), `onTempoShift`
  (calm→tense is a murmur rising; tense→dread is the
  room going quiet — dread silences a crowd, it does
  not excite it), `onSignature` (a signature move
  performed, #131's register — the home crowd knows
  its own dojo leader's signature the way a town knows
  its anthem), `onFaint`, `onResult`. Reaction
  *content* (which loop, which cry-adjacent murmur —
  crowds are human voices and creature cries in their
  own lanes, never a blend) comes from the venue's
  presentation data, the #152-class read: profiles say
  how creatures in the room behave; the crowd record
  says the room's size and temper. Values are data;
  the table's shape is the system.
- **The crowd is a chorus, never a judge.** Stated as
  law: crowd reaction is presentation only. It writes
  no record, moves no outcome, feeds no scorer (#18's
  AI never reads the room), grants no honour (#104's
  occasions do not include "the crowd liked it"), and
  tips no odds anywhere. A battle the crowd hated and
  a battle the crowd loved resolve identically if the
  commands were identical. This is #70's refusal of
  hidden bending, applied to people: applause is not a
  mechanic.
- **Stakes of the room.** What a dojo crowd *can* do is
  be remembered: the show and the game's presentation
  may carry a crowd's temper into the next scene's
  staging (a town talking about the battle at dinner —
  #93/#172's texture), because that is story, not
  state. The battle record itself (#126-class history)
  records the battle; the crowd is not in it.

## Show lane

The show's dojo crowd is this same crowd, cast: the
episode draws the room from the same facts (who lives
here, who is visiting, whose partner is at whose feet)
and plays the same reaction grammar to the same beats.
A crowd shot in the show that reacts to an unrevealed
held item is a board error by the contract above —
the rule travels because the *facts* travel, not
because the lanes share code.

## Wiring

Reads: #10 (queue + tempo), #188 (the contract, by
derivation), #93/#145 (who is in the room), #131
(signature register), #152 (creature behaviour in the
room). Seats: #30/#45 dojo records or #119 interior
annex. Writes: nothing, anywhere, ever.

## Open slots

Reaction content per venue (loops, murmurs, sizes) is
presentation data for the content lane to author
dojo by dojo. No mechanic is parked: the contract, the
reaction table's shape, and the chorus law are fixed.

## Coverage — honest

- Information contract by derivation: #188's verified
  architecture, applied to a room instead of a client.
- Contents: zero crowds instanced — no dojo interior
  or crowd record exists yet (#119 instances none);
  the shape lands ahead of the venues, like #241's.

**Landing citations — List 36 (2026-10-27; STAGING steps 6 and 7).** The crowd/opponent fence, stated in both homes: the room reacts via this file (#242); the opponent speaks via #352 (`show/production/battle/352-OPPONENT-VOICE.md`); neither writes the other's lines. Review note from #355: a room staged without reaction while #272 counts witnesses is a defect — crowd/staging consistency is checked against the witness count at landing review.
