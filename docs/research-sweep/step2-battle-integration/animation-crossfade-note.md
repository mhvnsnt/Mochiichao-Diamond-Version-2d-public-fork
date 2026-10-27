# Animation crossfade note (Step 2, battle integration)

Source technique: three.js AnimationMixer + AnimationAction crossfading
(three.js is MIT licensed; no three.js code is staged here).
Pattern found in public three.js docs/discussion: one mixer per rig,
one action per clip, fade between actions so a walk can blend into an
attack and back to idle with bones in sync, rather than snapping.

## What it improves

The existing lane work proves single exchanges (rest -> attack -> rest
returns to exactly zero displacement). Crossfading is the next step:
idle <-> attack <-> hurt <-> walk transitions without a visible pop,
and a principled way to layer a hurt flinch over a walk cycle instead
of cutting between them.

## Rules for this lane

- Crossfade duration is part of the clip contract, not a renderer
  default: record fade-in / fade-out ms per transition pair.
- Never crossfade two clips that drive the same bone with conflicting
  root motion; root motion belongs to exactly one active action.
- A crossfaded transition must pass the same rest-return gate as a
  hard cut: after the blend completes, displacement from rest must be
  near zero for a return-to-idle transition.

## Wiring target

- Owning step agent: Step 2 (battle integration).
- Target module: the 3D/rig playback path; the 2D path keeps the
  existing treatments module and does not need this note.
- Gate: a side-by-side recording of idle -> attack -> idle with
  crossfade shows no single-frame pose snap at either boundary.
