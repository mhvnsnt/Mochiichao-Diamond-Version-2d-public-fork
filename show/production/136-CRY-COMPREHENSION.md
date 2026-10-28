# #136 — CRY COMPREHENSION → Ranger cry-reading system (SHOW LANE ONLY)

**Scope line, stated before anything else: this system
exists in the SHOW LANE ONLY.** The game lane has no
equivalent — no comprehension meter, no unlock, no
translation feature — and this spec proposes none.
Comprehension is a *character's growing skill*, and
characters live in the show.

**The voice law, which this system exists inside of
(never around):** Mochiichao creatures are **pure cries
and sounds only** — no word dialogue, no name-saying, in
any lane. Comprehension changes nothing the creatures
*do*; it changes what one human has learned to *hear*.
A Ranger who comprehends is never subtitled as translating
speech — there is no speech. (Subtitle law likewise
holds: silent-film style, subtitles only at certain
important moments — comprehension is shown, not captioned.)

**What was studied.** Creature-communication arcs in the
reference anime, as publicly documented across the genre:
the protagonist who begins hearing only noise and ends a
season reading intention — distress, warning, invitation,
refusal — from sound and body together, earned through
repeated contact rather than granted by a device. The kit
taken: comprehension is **staged fluency** — a small set
of readable states, acquired per relationship and per
species-family exposure, demonstrated in scenes rather
than announced. No dialogue, scripts, or scenes are
copied.

## Canon anchors (verified)

- **The skill family already exists in canon:** #89's
  tracking mechanic formalises Mochiko learning to read
  Wispkin's Frost path — sign → direction → freshness,
  each sign carrying less than the full fact. Reading a
  *trace* and reading a *cry* are the same literacy at
  different senses; this spec is the auditory half of the
  skill #89 built the visual half of, and cites its read-
  gate discipline (a read is gated by exposure; an ungated
  read is never written).
- **Cries are data with colour:** #2's cry synthesis gives
  every species a parameterised cry (base/pitch/length),
  and #40's variant law carries `cryColourNotes` — cries
  have *character* that varies by form and, staged here,
  by state. The show's sound design already has something
  consistent to be comprehended *from*.
- **The device does not do this:** #81's Mochiioteca
  behaviour grammar deliberately carries no resident-
  creature fiction and no translation function — the
  device identifies; only the human understands. This
  spec protects that line: comprehension is never a
  device feature, in either lane.

## Native spec — `mochiichao/cry-comprehension/v1` (show production format)

Comprehension is tracked as **production knowledge about
a character**, in arc-planning terms (#82's home):

- `reader` — the Ranger (the canon-shaped case is
  Mochiko; the format is per-Ranger).
- `scope` — what the fluency attaches to, in widening
  rings: a **bonded individual** first (the partner's
  cries are learned as a voice is learned), then the
  individual's **species**, then a **family/habitat
  class** of species (exposure generalises slowly). A
  Ranger never "comprehends Mochi" as a blanket state.
- `readableStates` — the closed vocabulary of what a cry
  can be read *as*, deliberately coarse (fluency is
  reading intention, not decoding sentences):
  `distress` · `warning` · `summons` · `refusal` ·
  `contentment` · `challenge` · `grief` · `play` —
  plus `unread` (heard, not yet understood — the honest
  default for a new scope). **No state is a sentence;**
  the vocabulary has no way to express propositions,
  which is the voice law enforced at the format level.
- `stage` — per (reader, scope): `deaf` (noise) →
  `gist` (valence only: good/bad, calm/alarmed) →
  `states` (the readable vocabulary lands) → `fluent`
  (states + body language read together — posture, the
  #58-class tells, sign per #89). Stage advances are
  **arc facts**, written by episodes that *demonstrate*
  the advance (a scene where the read succeeds, or fails
  informatively — #101's FAIL-FORWARD ethic applies to
  human skills too), never by an off-screen counter.
- **Body language is half the channel.** A `fluent` read
  cites cry + body together; production notes for a read
  record both sources, so a read can never be staged as
  the creature "saying" something — the Ranger is
  *reading a creature*, the way #89 reads a trail.

**Failure is part of the format:** a misread is a legal,
recordable event (`read: X, actual: Y`) — early-stage
Rangers misread, and the arc's honesty about it is what
makes later fluency mean anything. A comprehension system
that cannot record a misread would be a translation
device wearing the law's clothes.

**Show-lane mechanics for writers:** episode planning
(#82) may gate a beat on a (reader, scope, stage) — the
gate is a production fact about the character, checked
like entry/exit state. The audience learns the states
the way the Ranger does: repetition with variation, the
same cry in a known context before an unknown one —
teaching the audience is a staging discipline, recorded
in the episode's notes, not a system output.

## Wiring

Show production only: arc planning (#82 gates + records),
#89 (the sibling literacy; shared read-gate discipline),
#2 (cry parameters — the consistent signal being read),
#101 (FAIL-FORWARD learning grammar), #58-class body
tells (presentation sources). **Explicit non-joins:**
no game save field, no Mochiioteca behaviour (#81), no
subtitle rule changes, no creature-side data of any kind
— a species' sheet gains nothing from this system,
because comprehension is not a property of the creature.

## Coverage — honest

- **Architecture: documented genre pattern** (staged
  fluency arcs), formalised here as production data.
- **Contents: the vocabulary and the stage ladder.**
  Which Rangers comprehend, their scopes/stages per
  season, and every staged read are episode content —
  OPEN, owned by show writing. Mochiko's exact arc (which
  scopes, which episodes advance her) is the show lane's
  to write; this spec gives it a format that cannot
  quietly become creature dialogue.
