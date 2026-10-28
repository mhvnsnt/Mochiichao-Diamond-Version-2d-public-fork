# #352 — OPPONENT VOICE IN BATTLE → Rangers react like people, from facts, never from a bark table

**The gap.** Battles in this programme have
commands, math, crowds (#242), and staging — but
the other Ranger has been silent at the exact
moments silence is loudest: when someone reaches
for *their* partner. A steal attempt is the most
personal act the battle system can hold (#268),
and a system where the victim watches it happen
without a word would be staging a theft in a
soundproof room. This spec gives the opponent
their voice — keyed to who they are and what they
know, never rolled from a generic bark list.

## Native spec — `mochiichao/opponent-voice/v1` (fragment beside this doc)

- **Reaction classes (closed) — what a Ranger can
  answer:**
  - **`to-attempt`** — spoken at a snag attempt
    against their Mochi, before the throw resolves
    (the throw is in the air; the words are the
    first counterplay, #354 is the mechanical
    one). Sub-classes by the throw's shape:
    *outrage* (an open-heart theft attempt),
    *horror-recognition* (they know what the device
    is — Syndicate-literate opponents name it),
    *cold-warning* (the class of opponent who does
    not shout: the line that tells the player the
    wanted system just acquired a very motivated
    witness, #272).
  - **`to-loss`** — spoken when a steal *lands*:
    grief and rage classes, keyed to the bond the
    record holds between them and the taken Mochi
    (#39 read — a fresh capture and a lifelong
    partner do not get the same line, because they
    are not the same loss).
  - **`to-rescue`** — the mirror: the reaction when
    the throw at a closed heart is a rescue (#349) —
    including the hardest class, the *holder's*
    reaction: a Syndicate holder watching their
    processed Mochi be rescued does not grieve; the
    classes are proprietary-anger and threat, and
    the difference is how the audience learns whose
    side the scene is on.
  - **`to-mercy`** — answers to #353's beats:
    surrender offered, mercy shown, mercy refused.
  - **`to-refusal`** — the small, telling class: an
    opponent whose own device was refused (#351)
    reacts to being *seen* improvising — embarrassment,
    cover, or the professional's shrug.
- **Keying — facts, not dice.** A reaction is
  **selected, never rolled**: the class is fixed by
  the event; the *line within the class* is chosen
  by the opponent's facts — their #301 dialogue
  data (voice, tone classes keyed to their #271
  standing and their #270 standing toward the
  player), their relationship facts (#93 — a friend
  being stolen from lands in a different line than
  a stranger, and #280's betrayal classification
  keys the bitterest rows), and the battle's state
  (first attempt vs. second — nobody's second
  reaction is their first reaction said again;
  repetition state is part of the key). Two Rangers
  with identical facts may share a line; two with
  different facts may not be given the same one by
  a content shortcut. That is the discipline:
  reaction text is #301 data with a battle address,
  not a bark table with a random index.
- **Timing — reactions are beats, not
  interruptions.** A reaction renders inside the
  battle's own queue (#10): the `to-attempt` line
  rides the throw's queue segment (spoken while
  the ball is in the air — it does not delay the
  resolution, and the throw does not wait for the
  talking); `to-loss` lands after the theft's
  history write resolves, before the next command
  ring opens (#356's changed battle begins with
  the victim's words still in the air). No reaction
  ever blocks input, gates a command, or carries a
  mechanical effect of its own — voice is
  information and feeling, not a hidden modifier
  (#180's law applied to people: if mercy or rage
  ever bends a number, it does so through a
  declared row in its own system — #353's deeds,
  #354's guard — never through a line of dialogue).
- **The victim is a witness with a voice.** #272
  already makes the victim the strongest report in
  the wanted system. This spec adds the battle-side
  of that fact: what the victim *says* at the
  attempt is the report being born — the
  `cold-warning` class exists so the player can
  hear the legal consequence arrive before the law
  does. Voice never *replaces* the report flow; it
  is how the flow becomes legible at the table.

## Show lane

The show uses the **same reaction classes as
staging notes** (#82's production grammar): an
episode's theft scene is staged by class —
outrage, cold-warning, grief — before a word of
episode dialogue is written, so the game's victim
and the show's victim are recognisably the same
kind of person in the same kind of moment. Human
dialogue in the show is episode writing; the
classes are the shared skeleton underneath both
lanes, and creatures stay cries-only in both —
a stolen Mochi's answer is #273's behaviour and
#136's cries, never words.

## Wiring

Reaction data seats in #301's dialogue layer with
a battle address space (proposed into #301's file
— STAGING step 6); selection reads #301 tone
classes + #270/#271 standings + #93 relationship
facts + #39 bond read; triggers ride #10's queue
segments at the throw and theft beats (#268/#356);
crowd answers belong to #242 (the room reacting is
the crowd's system — this spec is the *opponent's*
voice only, and the fence between them is stated
so neither lane double-writes a reaction).

## Open slots

Every line of reaction text (dialogue writing —
the classes, keys, and timing are the system; the
words are #301 content) · per-character voice
casting (show canon, carried from the voice work).
No mechanic is parked, and no character's lines
are invented here.

## Coverage — honest

- Classes, keying, and timing: fully specified
  over verified homes (#301's dialogue data shape,
  #10's queue, #272's victim rule).
- Contents: zero lines written. The opponent has a
  voice system and, as yet, nothing to say — that
  is the correct order; lines written before the
  keying existed would be barks.
