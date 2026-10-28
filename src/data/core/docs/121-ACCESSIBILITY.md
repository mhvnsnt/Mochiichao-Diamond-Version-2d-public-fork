# #121 — ACCESSIBILITY GUIDELINES → accessibility options architecture (game lane)

**What was studied.** Published accessibility practice —
the Game Accessibility Guidelines and platform accessibility
guidance, both public: ensure no information is carried by
colour alone; offer text scaling; allow input remapping at
the *action* level; subtitle dialogue and caption important
sound effects with speaker identification. The kit taken:
accessibility is a **presentation-layer options system** —
it changes how the game's facts are rendered, never the
facts. No guideline text is reproduced; the architecture
is what transfers.

## The two subtitle laws — never conflated

This spec governs the **game only**. The show's subtitle
law is separate canon (DESIGN-BRIEF-canon-world.md):
silent-film intertitles, only at certain important moments.
The game's standard is the opposite shape, because the
medium's job differs:

- **Game dialogue subtitles:** all spoken dialogue
  subtitled when the option is on, with speaker labels
  resolved through #23 (names are lookups — a renamed
  character's label renames everywhere, subtitles included).
- **SFX captions:** caption cues for gameplay-relevant
  sounds, keyed to the #51 SFX taxonomy classes (a caption
  names the *class* of event — a cry, a gate, weather —
  never a transcript of audio the player cannot use).
- Neither rule touches the show's intertitle law, and no
  show tooling reads this spec.

## Canon constraint — the reserved-ink law binds the modes

#27 STATUS-SYSTEM fixes the icon grammar's ink law: status
icons never use the reserved outline ink `#101010` and
never the alert red `#a03436` (reserved by canon).
Colour-vision modes operate *inside* that law:

- Modes remap the **presentation palette** of UI and field
  elements; the two reserved values stay reserved in every
  mode — a mode table that recolours an icon into either
  value is invalid by construction.
- **No status meaning may ride on colour alone** — this
  spec's requirement, stated as system law: status is
  carried by icon shape (#27's grammar) with colour as
  redundant coding, so a colour-vision mode can shift hues
  freely without moving meaning. Where #27's grammar is
  silent on a shape/colour pairing, the pairing is flagged
  for the mode tables' authoring pass, not assumed here.
- Mode palette tables themselves are **work items, not
  content this spec asserts**: they must be produced under
  colour-vision simulation and measured, per the published
  method. Zero tables are instanced.

## Native spec — `mochiichao/accessibility/v1`

An options record (player settings; one per player profile):

- `colourMode` — `standard` + one slot per colour-vision
  mode table as tables land (vocabulary grows by measured
  table, never by free string).
- `textScale` — a renderer-side multiplier over #23 string
  rendering. Strings are lookups; scaling changes layout,
  never content. **Range OPEN** — the min/max bounds are a
  UI-engine fact this spec does not invent.
- `subtitles` — `{dialogue: bool, sfxCaptions: bool}` per
  the standard above; defaults OPEN (owner ruling).
- `inputMap` — action-level remapping: rows keyed by
  **action id** (the systems' own verbs — confirm, cancel,
  menu, interact…), each row holding the player's binding.
  The action vocabulary is owned by the engine layer and is
  an UNVERIFIED TARGET (no engine/input code exists in the
  audited sources); this spec fixes the *shape* — bindings
  attach to actions, never to raw inputs scattered per
  system — and instances no bindings.
- `reducedMotion` — honoured by the systems that animate:
  camera moves (#21 records) degrade to cuts, ambient
  cycles hold. Stated as a consumer contract: any system
  that moves the frame reads this flag; the flag's home is
  here.

**Where settings live — a ruling with its reason stated:**
settings must apply at the title screen, *before* any save
loads, so they cannot live inside #96's save payload. This
spec places them in a device/profile store beside the
saves. Whether that store exists in the repo today is an
UNVERIFIED TARGET (STAGING.md) — the placement is the
spec's proposal, flagged as such, not a claim about the
repo.

## Wiring

Consumers: #27 (icon rendering under modes), #23 (text
rendering + subtitle labels), #51 (caption class source),
#21 (motion degradation), every input consumer (action
map). Producers: none — options are player facts. Save
impact: explicitly none (see placement ruling).

## Coverage — honest

- **Architecture: fully documented** in the public
  guidelines; the presentation-layer separation is their
  core pattern.
- **Contents: no mode tables, no scale bounds, no default
  bindings, no defaults asserted.** The engine-side targets
  (action vocabulary, settings store) are UNVERIFIED —
  this is a spec whose joins are real and whose engine
  does not exist in the audited sources yet.
