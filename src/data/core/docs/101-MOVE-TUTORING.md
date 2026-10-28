# #101 — MOVE TUTORS → tutoring services, both lanes, kept distinct

**What was studied.** Move-tutor architecture in the reference
games, as publicly documented: specialist NPCs who teach moves
outside species' level-up learnsets, each tutor holding a fixed
move list, gated by a **cost model** (a special currency, shards,
or heart-scale-class items in the documented variants) and by
**compatibility** (a species either can or cannot learn a given
tutored move — a per-species flag beside the learnset). Beside
it, the anime's parallel system: moves are *taught by people
and learned by practice* — a mentor demonstrates, the creature
attempts, fails informatively, and masters over an episode.
Mochiichao's two-lane canon doctrine takes **both, separately**:
the game gets the service system; the show gets the training
grammar. Neither lane borrows the other's mechanics.

## Lane 1 — GAME: tutor service records

- **Tutor record:** `{tutorId, npcRef, placeId, moveIds[],
  costModel, status}` in the item/economy data neighbourhood.
  - `npcRef` / `placeId` — a named NPC on a #93 schedule at a
    #11 route node. Tutors are *people with routines*, not
    menu kiosks: the schedule decides when the service exists.
  - `moveIds[]` — stable move ids from the moves registry (PR
    #366; display names resolve via #23 lookups — rename-on-use
    safe, ids never change).
  - **Compatibility** is a per-species datum beside the learnset
    (a `tutor` list on the species record's move block, sibling
    of the level-up learnset — 47/47 learnsets exist; tutor
    lists are an **owed field, contents OPEN**, registered in
    STAGING for the landing lane rather than asserted here).
- **Cost model — shape fixed, currency OPEN.** A cost is
  `{kind: currency | item | none, ref, amount}`: `currency`
  resolves to #20's single integer currency (whose **name is
  OPEN**, per #20 — the cost model inherits the open slot, it
  does not fill it); `item` resolves to a #31 item id (shard-
  class materials are the documented pattern; **no Mochiichao
  tutoring material is canon**, so item costs ship unlisted);
  amounts ship `null`. A tutor with `kind: none` (a mentor who
  teaches for a story beat) is legal and likely the show-adjacent
  case.
- **The class law holds.** General/Rare classification (PR #366)
  is a property of the move registry. A tutor record *references*
  moves; it can never reclassify one, and — following #31's
  schema-enforced distinction — no tutor record carries a
  move-class field. **Whether a tutor may teach a Rare-class
  move at all is an OPEN owner decision** (canon: Rare Moves
  also arrive pre-known or by alternate routes; whether tutoring
  is one of those routes is exactly the owner's call). The
  format carries the slot; it does not presume the answer.

## Lane 2 — SHOW: the training grammar

In the show there are no tutor NPCs-as-services and no costs.
There are **teachers and practice**, written as a beat grammar
episode planning can cite:

```
DEMONSTRATE (the teacher — Ranger, elder Mochi, or a wild
  individual — performs the move; autonomous-action doctrine:
  the creature acts, it is not puppeteered)
→ ATTEMPT (the learner tries; the attempt is anatomically
  theirs — variance doctrine, #9: the same move is a different
  performance on a different body)
→ FAIL-FORWARD (the failure teaches the specific thing the
  mastery needs; losses are structure, #45's ethic)
→ MASTERY (the move lands in a living fight, un-commanded or
  Ranger-called — both are canon battle grammar)
```

- A show-learned move is logged in the episode's production
  notes against the species' registry id, so show and game
  describe the same learnset growth in their own vocabularies
  (arc conservation, #82: a move learned in an arc is a change
  the exit state must honour).
- Tutors in the show are **characters** (a dojo master's
  signature slot, #37, is their teaching thesis) — never
  service windows.

## The pairing, stated once

| | Game lane | Show lane |
|---|---|---|
| Teacher | NPC record on a schedule | Character with a thesis |
| Cost | Currency/item slots (OPEN) | Story cost: time, failure, trust |
| Compatibility | Per-species tutor list (owed field) | Anatomy + character: can *this* body/temperament learn it |
| Record | Move added to the individual's move set | Beat logged in production notes |

## Wiring

Moves registry (PR #366) is the join key both lanes share.
Game: #93 schedules + #11 places + #20 economy + #31 items +
species-sheet learnset block (owed-field registration in
STAGING). Show: #37 signature slots + #9 anatomy variance +
#82 arc records.

## Coverage — honest

- **Architecture: fully documented** in both media (service
  tutors in the games; mentor training in the anime).
- **Contents: zero instanced.** No tutor NPC, move list, price,
  or compatibility row exists in canon. The Rare-teaching
  question and the currency name are OPEN owner decisions,
  carried open.

**Downstream (List 14, 2026-10-27):** the level-up learning flow is `129-LEVEL-UP-LEARNING.md` and the signature-move register is `131-SIGNATURE-MOVES.md` (same folder); #129's relearn pool derives for this package's tutoring.
