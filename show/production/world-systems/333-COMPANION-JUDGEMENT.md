# #333 — COMPANION JUDGEMENT → the ones who travel with you have opinions

**The gap this fills.** #160's field-partner AI
makes a travelling partner *useful* — it follows,
assists, reacts. List 28 then gave the Ranger a
conscience (#269), a standing (#270), and a law
(#272) — but the person walking beside you through
all of it had no verdict of their own. Fallout's
companions do: they watch what you do, they approve
and disapprove, and at the ends of the scale they
defend you or they leave. This spec pulls that
grammar in — for human companions *and* for the
partner Mochi, whose judgement is the one this
world's doctrine cares about most: a Mochi who
travels with a thief is a witness with a heart.

**What was studied.** Fallout's companion affinity
as publicly documented (approval tracked per
companion, thresholds that change what a companion
says and whether they stay, the companion who
*refuses* — some will not be present for some
deeds), read against List 28's own evidence law:
#272 already rules that a deed's worldly weight
runs through witnesses. Judgement here runs on the
same rails.

## Native spec — `mochiichao/companion-judgement/v1` (fragment beside this doc)

- **Presence is the input rule.** A companion
  judges only deeds they are present for — present
  in #272's witness sense (there, able to perceive
  it). An unwitnessed deed moves the Ranger's
  morale (#269, the conscience) and never the
  companion's read. This is the spec's heart and
  its honesty: your partner judges the person they
  have *seen*, which is why the double life (#281)
  is a real, playable tension and not a stat leak.
- **The read.** Per companion, an affinity *band*
  derived from the witnessed-deed facts (List 28
  facts, witnessed-by flags) — derived, never a
  stored meter, and never shown as a number. Band
  names and thresholds are data. The read is over
  the *same* facts the world's systems use; a
  companion invents no private ledger.
- **The thresholds (what the bands DO):**
  - **Deepening** — the companion offers more:
    #164 help unasked, #301 candour (the
    conversations that only happen beside someone
    who trusts you), warnings before you walk into
    what they'd regret watching.
  - **Refusal** — a companion at a low band will
    not be present for the deed that would lower it
    further: they step out, say why (humans) or
    show why (Mochi), and the deed, if done, is
    done without them — and their absence is itself
    a fact. Refusal is a *presence* consequence,
    never a lock on the player: the world does not
    grey out the button; your friend leaves the
    room.
  - **Departure** — at the floor band, the
    companionship ends as a world fact: a human
    companion leaves (#93/#145 take them back into
    the world's life; #331's rank with them records
    the wreck honestly). A partner *Mochi's*
    departure is graver and rarer, and it is the
    Mochi's own act: a kept individual who leaves
    keeping writes a departure event and enters the
    world under #267's persistence — findable,
    themselves, gone. (The event class is proposed
    into #80/#267's homes; this spec founds the
    threshold, not the event.)
  - **Defence** — at the top band, a companion
    speaks for you: #272 proceedings and #270
    rooms hear a witness *for* the Ranger, in the
    companion's own voice.
- **Expression follows the voice laws.** Humans
  judge in words (#301's grammar — judgement is
  conversation, with the rank and standing facts
  conversation already reads). Mochi judge in
  behaviour and cry (#136's comprehension family,
  #152's profiles, #160's conduct): a partner who
  flinches from your hand has said everything, and
  — per #180's declaration spirit — if a Mochi's
  judgement changes their behaviour, the change is
  *visible in the behaviour*, never a hidden
  modifier. The show mirror is the same law staged:
  the audience reads the partner's judgement off
  the partner, never off a caption.

## Wiring (proposed)

The read seats beside #160 (companions) reading
List 28's fact families; the departure event class
is a proposal into #80/#267's homes. Reads: #269/
#270/#272 facts with witness flags, #93/#145
(human companions' world seats), #331 ranks.
Writes: nothing of its own — thresholds manifest
through the host systems' own events.

## Open slots (nothing invented)

Band names/thresholds per companion class (data) ·
which authored companions exist and travel
(casting/world content — #93/#145's lanes) · the
specific deeds each companion class cannot abide
(authored per companion — a person's lines are
character writing) · whether any canon companion
ever departs in the show (story fact).
