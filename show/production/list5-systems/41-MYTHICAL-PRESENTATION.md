# #41 — LEGENDARY / MYTHICAL PRESENTATION GRAMMAR (teardown → native staging spec)

**What was studied.** How creature-catcher anime and the
reference games present the rarest class, as publicly documented
in production writing on the genre: a mythical is never introduced
like a regular creature. The grammar is consistent across decades:
**withholding before showing** (silhouette, trace, story — the
creature exists as evidence before it exists as footage),
**scale against the known** (it is staged against a Tower-class
or familiar body so its size is *felt*), **the world's behaviour
changes around it** (weather, sound, other creatures go quiet or
wrong), **one held reveal** (a single sustained shot, not a
montage), and **no ordinary capture frame** — the bond, if any,
is a story event, not a mechanic use. Mochiichao already owns the
deepest version of the withholding rule in its own canon: the
Dark Forest's depths, where things stopped moving, are never
populated on screen (LIVING-WORLD P5; DESIGN-BRIEF §8 item 7).
This spec generalises that discipline to a class.

## The class axis (data first, as always)

The anatomy-variance doctrine already names the axis: a move's
animation varies by shape/size/build **and mythical/legendary
class** (DESIGN-BRIEF §4.5; #9 animscript performance blocks
carry the class). This spec proposes the matching species-sheet
field so every downstream system reads the same value:

```json
"presentationClass": "standard" | "mythical"   // default: standard
```

- The field is proposed here for the sheet standard (lane owns
  the standard; this package does not edit it). Until a species
  is owner-locked `mythical`, it is `standard` — **no species is
  asserted mythical by this package**, and no roster of mythicals
  exists in canon for this package to restate.
- The class is a *presentation and animation* axis, not a power
  stat: it changes how the creature is staged, how its moves are
  performed (animscript class block), and how the Mochiioteca may
  register it (below). It grants no numbers anywhere.

## The staging grammar (show format)

Five beats, in order; a mythical introduction uses all five, a
mythical *reappearance* may compress to beats 3–5:

1. **TRACE.** The creature is present as evidence only: its
   footprint (footprint-type rules apply — some leave Frost,
   some leave nothing), a cry at the edge of hearing, a Manual
   line, an elder's unfinished sentence. The Mochiioteca shows
   the silhouette state at most (discovery: seen-as-trace is
   still `unseen` in data — the registry does not grade rumours).
2. **QUIET.** The world reacts before the audience sees: ambient
   population exits frame, the wind-state drops, SCORE-STATE
   moves to ABSENCE (List 2, #13). What is *missing* is the
   announcement.
3. **SCALE.** First body footage is staged against the known:
   a Tower-class reference or a familiar principal in frame,
   scale-chart rules (#43) applied strictly — no cheating the
   chart for a mythical; its size is canon or it is not shown.
4. **THE HELD REVEAL.** One sustained shot. State grammar (#42):
   the mythical is staged in **Base** — it does not perform
   Bright/Guard for the audience on first meeting; its stillness
   is the menace/wonder. Subtitle law applies at full rationing:
   a mythical reveal is one of the moments an intertitle may
   carry meaning — and most should still choose silence.
5. **NO ORDINARY FRAME.** The encounter does not resolve through
   the standard capture staging (#38): either no attempt is
   possible (the fiction says why, in-world, without computer
   tells), or the bond is a declared story event with a scripted
   capture record. In game data, a mythical's `catchRate` may be
   `null` permanently — *not capturable in data* is a legal,
   meaningful value (see #38), not a gap.

## Registry treatment

The Mochiioteca registers a mythical like any species — same
slot family, same discovery states — with one display rule: its
entry's media unlock follows the *strictest* reading of the canon
rules (footprint at kept-only stays kept-only even in flashback
montages; the silhouette is the public face until the reveal
episode airs). Completion counting (#14) includes mythicals in
the species total only once canon has *named* them into the
registry; an unnamed presence is not a countable slot. (Counting
what canon hasn't named would leak THE SECRET's inverse: the
registry knowing more than the world does.)

## Wiring

- Axis consumed by: **animscripts (#9)** (class performance
  blocks), **scale chart (#43)** (strict staging), **capture
  (#38)** (null catchRate legality), **completion (#14)**
  (named-only counting), **lab exposition (#46)** (mythicals are
  the lab's *limits* — what Aeon's instruments register as trace,
  never as specimen).
- The Dark Forest depths rule is this grammar's standing
  instance zero: what stopped moving is an owner decision
  (DESIGN-BRIEF §8 item 7) and stays unstaged until he decides.

## Coverage — honest

- **Architecture: fully documented as genre grammar.** Withhold →
  quiet → scale → held reveal → no ordinary frame is the
  consistent, publicly discussed presentation pattern for the
  class across the reference anime and games.
- **Contents: none asserted.** Canon fixes the axis (doctrine),
  the Forest discipline, and the registry rules. It names no
  mythical roster, no mythical species, and no reveal episode.
  The spec is a stage waiting for its cast — deliberately.
