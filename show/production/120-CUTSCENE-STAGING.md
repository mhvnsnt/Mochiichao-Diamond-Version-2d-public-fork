# #120 — EVENT-SCENE SCRIPTING → game cutscene staging

**What was studied.** In-engine event staging as publicly
documented in engine and decomp sources: a scene is an
ordered list of **cues** executed by the engine — move the
actors (blocking), move the camera, open a text window,
play a sound, set a flag — with the scene's state changes
declared at its boundaries so the world before and after is
knowable. The kit taken: a closed cue vocabulary, blocking
as data, and the rule that a scene may only touch the world
through the systems that own each piece. No scripts, scene
contents, or dialogue are copied.

## Canon anchors (verified)

- **Camera is #21, verbatim.** CAMERA-SYSTEM already defines
  the record — `{type: static|pan|truck|zoom_in|zoom_out|
  tilt|handheld_micro, from_field, to_field, dur_f, ease,
  parallax}` on the Palm/Knee/Waist/Tower field ladder —
  and its house rules bind scenes too, including the Forest
  rule: *inside the Dark Forest the camera does not travel.*
  A cutscene cue carries a #21 record; there is no second
  camera vocabulary for scenes.
- **Dialogue is pointer-only, per #12.** EVENT-FLAG-
  ARCHITECTURE §"Pairing with the dialogue kit" fixes the
  reference shape — `{source: "dialogue-kit", path, entry}`
  or `{source: "ink", path, knot}` — and records that the
  game already scripts its opening in Ink
  (`region1-truck-start.ink`). Scene records embed no text.
- **Creatures vocalise as cries, never lines** (voice law):
  a creature cue is a cry — species id + the #2 cry-synth
  parameter block (base/pitch/length) — rendered by the
  species-systems renderer. There is no creature dialogue
  cue type, by design.
- **Flags are the only world-writes.** A scene reads and
  sets #12 flags (story./progress./tech./vars.) and nothing
  else; derived state (Fragments, dex counts) moves only
  because the flags did (#14 law).

## Native spec — `mochiichao/cutscene/v1`

A scene record:

- `sceneId` — stable id; `place` — a #11 node id or a #119
  room id (the scene's stage).
- `requires` — #12 flags that must exist for the scene to
  stage; `once` — whether the scene is consumed on play
  (its completion flag is a `story.*` fact like any other).
- `cast` — actor bindings: `{actor: <npc id (#93) |
  individual id (#80) | "ranger">, enter: <room position
  ref>}`. Positions are layout references into #119, never
  free coordinates invented per scene.
- `cues` — the ordered cue list. Cue types are **closed**:
  - `camera` — a #21 camera record, whole.
  - `move` — blocking: `{actor, to: <position ref>,
    pace: walk | run}` (pace vocabulary PROPOSED — engine
    speeds are an UNVERIFIED TARGET, see STAGING.md).
  - `face` — `{actor, toward: <actor | direction>}`.
  - `say` — a #12 dialogue pointer (dialogue-kit entry or
    Ink knot). Humans only, enforced by the pointer's
    target, not by a flag on the cue.
  - `cry` — `{species, params: <#2 cry parameter block>}`.
  - `sound` — a #51 SFX class reference; `score` — a #13
    SCORE-STATE transition (the global, set by cue, as the
    adaptive-music system already allows events to do).
  - `wait` — `{frames}` at the house 24fps (timing system,
    #16); frame counts are data, tuned per scene.
  - `set_flag` — legal **only** in the scene's declared
    `on_complete` block or at a cue explicitly marked as a
    branch point; a mid-scene unmarked flag write is a
    schema error. The world changes where the script says
    it changes — auditable in one read.
- `on_complete` — `{flags_set: [...]}`: the scene's entire
  declared effect on the world. Entry = exit conservation
  (#82's law, applied to staging): a scene that leaves a
  permanent change not listed here is defective by
  definition.

## Wiring

Executes over #21 (camera), #12 (flags + dialogue
pointers), #2 (cry rendering), #51/#13 (sound/score),
#119/#11 (stages), #93/#80 (cast). The opening scene's
real target already exists in the game — the Ink opening
(#12's record) — making `region1-truck-start` the natural
first instancing candidate at landing; this package
instances no scenes.

## Coverage — honest

- **Architecture: fully documented**; cue-list staging is
  the standard engine pattern across the public record.
- **Contents: zero scenes instanced; all cue timing values
  are per-scene authoring, not system facts.** The `pace`
  vocabulary and the engine-side cue executor are flagged
  UNVERIFIED TARGETS in STAGING.md — no engine code exists
  in the audited sources for a cue to execute on yet.
