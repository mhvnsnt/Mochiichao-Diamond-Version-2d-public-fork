# #301 — DIALOGUE & PLAYER VOICE (GAME LANE) → what you can say is a system

**The gap, stated plainly.** Every system so far
knows what NPCs *do* (#93 schedules, #244 customs,
#270 standing) — but the game has had no spec for the
moment a Ranger *talks*: what choices of words the
player is offered, and why this townsperson answers
this Ranger warmly and that one through their teeth.
The Pokémon base barely has one (its dialogue is
authored lines behind a Yes/No). The owner's essence
statement names Fallout, Skyrim, and Persona 5 —
games where conversation is gameplay. This spec
builds the game lane's conversation system at that
scale, and fences it hard from the show's voice law
so the two lanes never blur.

**Lane fence, first, in the spec's opening lines
(the #136 precedent).** This system is **game-side
humans talking to humans**. The show's laws are
untouched and do not apply here: show creatures are
cries only and show subtitles are rare *in the show*.
And the fence runs both ways: **in the game, Mochi do
not speak either.** A Mochi in a game conversation is
present the way #152's profiles and #2's cries make
them present — sound, posture, a partner's reaction
the humans read. There is no game-side equivalent of
#136 and none of this spec's machinery may grow one:
the choice grammar below is a human grammar.

**What was studied.** Conversation systems in the
named kin, as publicly documented: Fallout/Skyrim's
topic-and-check dialogue (what you can raise, what
your standing and history unlock — including the
famous shape where a *reputation-gated* line exists
only for a Ranger the faction fears), Persona 5's
answer-tone design (the same question, answered in
the voice you are performing), and the programme's
own floor: #12's pointer-only dialogue pairing
(lines are content, addressed by facts — never text
stored inside systems). The kit taken: options are
*derived from facts*, tone is *chosen and
consequential*, and the system's job is the grammar —
never the lines.

## Native spec — `mochiichao/dialogue/v1` (fragment beside this doc)

- **An option exists because a fact does.** The
  choices offered in a conversation are derived at
  read time from standing vocabularies of fact:
  what this NPC's #93 record knows and does, what
  flags the Ranger holds (#12), what the two have
  between them (#93 relationship facts, #280's trust
  where it exists), what the Ranger belongs to
  (#299 membership — when worn or known, per #299's
  knowledge rule), and what the room believes
  (#270). An option whose fact is absent is not
  greyed out — **it is not there** (the Pokémon-base
  shape at option scale: the game does not advertise
  roads the world hasn't built). A landing may not
  add an option source outside this list without a
  proposal into this file.
- **Tone classes, keyed to the ladder.** Beyond
  topics, the player chooses *how* to speak, from a
  closed tone vocabulary whose availability reads
  #271: a Ranger a town holds in a high band can
  speak with **authority** and be heard; a Ranger in
  the deep bad bands gets **threat** and **bluff**
  options the shining never see (and loses some
  gentle ones in rooms that fear them); the **kind**
  and **plain** tones are everyone's floor. Tone is
  not decoration: a spoken tone is a deed-class
  input — the NPC's answer, and any #269/#270
  consequence of being spoken to that way in front
  of witnesses, run through the real systems (a
  threat made before the town is a #272-witnessed
  fact like any other). Drafted tone set (vocabulary
  is system data, tunable; contents — the lines —
  are #23 content): `plain / kind / authority /
  bargain / threat / bluff / joke`. A feared Ranger's
  options *differing* from a beloved one's is the
  brief's core example, and it falls out of this
  rule mechanically, not by authoring two dialogues.
- **Answers read the same facts.** An NPC's response
  selection is a read over their own record: their
  #93 facts, their group's #270 standing toward the
  Ranger, the tone just used, and what they
  personally witnessed (#272's reports reach NPCs as
  knowledge, not as global omniscience — a
  townsperson answers from what *they* know, and can
  be wrong in the ways a person is wrong; the system
  tracks knowledge per NPC/group, never a world-wide
  truth flag for opinion). Refusals are answers with
  content ("we don't serve your kind here anymore" is
  #270 worn in a sentence); a refusal never softlocks
  the spine — story-critical services answer under
  their own story flags (#139's story-locked class),
  and standing colours the *framing*, per #270's
  licence-trial rule generalised: **reputation colours
  the room, not the ruling.**
- **Nothing is stored but the facts.** A conversation
  leaves behind only what the real systems record:
  the #12 facts its beats set, the deeds and reports
  its witnessed tones earned. There is no dialogue
  log, no relationship-points number (#280 owns trust
  as its own record where trust exists), and no
  "dialogue skill" — the player's voice is their
  record, spoken back to them.

## Show lane

None — deliberately. The show's human dialogue is
scriptwriting under #82, and its creature law is
#136's. This spec exists so the *game* can hold a
conversation at RPG scale without importing the
show's grammar or breaking its own.

## Wiring

Option/answer derivation reads #12 (facts + the
pointer-only pairing — this spec founds no text
store), #93 (NPC records + relationships), #270/#271
(standing + tone gates), #299 (membership, under its
knowledge rule), #272 (witnessed speech), #244
(customs frame the occasion's openings), #23 (every
line is a lookup). Consequences write through #269 /
#270 / #12 only.

## Open slots

All lines, all NPC knowledge contents, and the
per-conversation topic contents are content — the
dialogue kit's authored data, town by town. Tone-set
tuning is system data. No mechanic is open: the
option derivation, the tone gates, the knowledge
discipline, and the lane fence are filled in full.

## Coverage — honest

- System: complete. Contents: zero conversations
  authored — the kit's existing dialogue data gains
  a grammar here, not new text.


**PROPOSAL — List 36 #352 (registered at List 36's landing, 2026-10-27):** #352's opponent reaction classes are proposed into this file as a BATTLE ADDRESS SPACE — the opponent speaks through this file's dialogue machinery in battle, in #352's reaction classes (352-OPPONENT-VOICE.md). The crowd fence stands with it: the room reacts via #242, the opponent speaks via #352, and neither writes the other's lines. All reaction lines themselves are authored content — none are instanced here.
