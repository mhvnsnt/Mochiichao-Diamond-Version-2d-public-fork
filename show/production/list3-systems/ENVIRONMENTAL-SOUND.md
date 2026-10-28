# #22 — ENVIRONMENTAL SOUND SYSTEMS → audio-bed construction spec

**Teardown (public documentation + game-audio practice).** Two
systems hide under "ambience": (1) **terrain footsteps** — a lookup,
not recordings-per-character: surface id × mover weight class → a
small variant pool, with cadence derived from the animation's stride
events so feet and sound share one clock; (2) **ambient beds** —
constructed loops: a continuous base layer (room tone / weather), a
sparse random-event layer (distant calls, creaks) fired by a
scheduler with min/max intervals, and a state layer that crossfades
by game state. The craft rules are consistent across sources: beds
are built per location×time, loops are long and non-commensurate so
the ear can't find the seam, and *absence is a designed layer*, not
a missing one.

**Native spec — `mochiichao/env-sound/v1`** — the construction
manual for the bed system LIVING-WORLD §2.4 already names
(`BED-[LOC]-[TIME]`, FOLEY, `SFX-[ACTION]-##`).

- Bed recipe (per bed id, a build sheet, not just a mix): `base`
  layer (source, loop length), `events` layer (pool + scheduler
  interval range + per-state density), `state` behaviour keyed to
  WIND-STATE (picture/audio one state, C3) and SCORE-STATE (audio-
  timing teardown), and the −14 LUFS / −1 dBTP finish the EP01 beds
  already gate at. Loop lengths follow the prime/non-commensurate
  law of the ambient cycles.
- The named beds stay exactly LIVING-WORLD's table (Gate morning/
  night, Pond day/dusk, Green day, Forest day) — this spec adds the
  *recipe format* and two rulings: BED-POND-DUSK's emptying is a
  scheduler density ramp in data (not a hand-mixed one-off), and
  **BED-FOREST is an absence recipe**: base = room-tone hush at a
  named floor level, events pool = empty by design, one scripted
  leaf as a SPOT effect. #19's frost nights attach here as
  `BED-GATE-NIGHT.frost_variant` (a variant recipe: base thins,
  event pool gains the faint aura shimmer — content PROPOSED until
  the owner/board locks frost sound).
- Footsteps: `surface_id` comes from the location's materials (the
  parts-catalog/environment data), mover classes `light | standard |
  heavy | none` (floaters/ghosts = none; Wispkin gets *no* footstep
  row — its sound identity is smoke/frost, per canon). Stride events
  are emitted by the rig/animation step so foley sync is data, not
  an editor's eyeball. Game lane uses the same table (surface ×
  class → pool) — two-lane law.
- SFX spot taxonomy stays `SFX-[ACTION]-##`; the 13-item EP01 spot
  list is the worked example of the format.

**Wiring.** LIVING-WORLD owns *which* beds exist; this owns *how a
bed is built and proven*. Adaptive music (#13) consumes the same
state globals; beds and score never fight because SCORE-STATE's
ABSENCE forces music stems null and leaves the bed alone with the
room. Cry placement in beds follows the cry rules (distant sky-class
sparse, per LIVING-WORLD) — cries themselves are the cry-synth's
artefacts, never bed ingredients at close range.

**Coverage.** Architecture: standard documented practice. Recipes
for the six named beds are format + the canon content LIVING-WORLD
already lists; frost-variant content and footstep pools are to be
recorded/synthesised at production time — not claimed to exist.
