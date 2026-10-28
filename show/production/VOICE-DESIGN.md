# VOICE DESIGN — human voices by prosody, not by copying (owner method, 2026-10-27)

Method and line-reading rules: see PROSODY-SYSTEM.md (companion, same folder).

Owner's method, in his words' substance: get the voices from
INSPIRATIONS — anime and cartoon voice types — for the IDEA of how
a voice should be: its pacing, its toning, its PROSODY. Nobody's
exact voice gets taken. We design the pattern; the pattern is ours.

## The chain
1. VOICE SHEET per human character (this doc): a prosody spec —
   pitch register, pace, rhythm and stress habits, sentence melody
   (where lines rise/fall), breath and energy, verbal tics that are
   OURS, and how the prosody shifts per emotional state.
2. REFERENCE AUDIO cast TO the spec: an original recording or a
   properly sourced licensed/dataset reference whose natural
   prosody matches the sheet. The ref serves the spec, never the
   other way round; a ref that IS a recognisable performer's voice
   is a failed casting (same law as likeness: patterns transfer,
   identities don't).
3. RENDER via the owner's Wizard Gang pipeline pattern
   (wizard-gang-voice-pipe: Chatterbox zero-shot clone from the
   reference + per-character tuned exaggeration / CFG in a
   render-queue). Model weights staged per the STAGING RULE
   (TeraBox bulk, rationed into repos in batches — AGENTS.md).
4. GATE: lines are reviewed against the sheet (does the pacing /
   melody / energy match?) before they enter a mix. Scratch renders
   are labelled VOICE-SCRATCH until the owner passes a casting.

## Draft sheets (DRAFT — owner tunes; archetype-level inspiration)
### MOCHIKO — the keeper
Bright mid-high register. Quick, eager pace; sentences tilt UP at
the end when she's discovering something (wonder contour), land
FLAT and slow when she reads the Manual aloud (reverence contour —
the rules slow her down). Short breaths, talks to creatures in the
same voice she talks to people (no baby-talk — house respect rule).
Tic: names what she sees before she judges it ("Ducks don't roll
uphill."). Render start: exaggeration 0.45, cfg 0.5.
### HEX — the mirror
Lower, drier register. Deliberate pace — beats land on the LAST
word, not the first. Dead-level melody that only moves twice an
episode, so the two times read as events. Never raises volume to
win a point; goes QUIETER. Tic: states the time or the count
("Tomorrow, then.") — precision as armour. Render start:
exaggeration 0.3 (restraint is the performance), cfg 0.6.
### PROF. AEON — the presenter
Warm low register, unhurried. Lecturer's prosody: thesis lines get
space around them; lists are ceremonies (each starter's name lands
alone). Laugh lives in the voice even when the line is straight.
Tic: "There isn't one."-style deflations — pops pomposity,
including his own. Render start: exaggeration 0.4, cfg 0.55.

## Open items
- Reference casting for all three (owner's ear decides).
- Creature performances stay cries-only by law — this doc governs
  HUMANS only. No prosody sheet gives a creature words.
