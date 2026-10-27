# PixiJS particle emitter — tool note (Step 4, VFX + sound) — NEW this pass
Source: @pixi/particle-emitter (formerly pixi-particles), PixiJS
userland particle system. Licence: MIT (per package metadata as reported
in search results). Peer: PixiJS v6+ (supports up to v8 per the write-up).
What it is: declarative emitter configs (behaviours for life, position,
velocity, acceleration, size, colour, rotation, spawn shape); object
pooling + linked lists so thousands of particles stay cheap; one-shot
ring bursts (emitting=false until fired, restart() per hit) — exactly the
impact-spark shape the battle treatments module already emits as counts
(6/12/20/28 by weight in the existing treatments tests).
What it replaces / does not replace: it replaces hand-rolled per-frame
particle loops in the VFX layer; it does NOT replace the treatments
module's timing (windup/travel/hold/recoil/recover) — the emitter fires
on the treatments module's onImpact event, at the contact frame.
Also noted, same family, NOT adopted here: NixieFX (MIT runtime, browser
editor, JSON effects, PixiJS + Three.js adapters) — a heavier authoring
workflow; Step 4 agent may evaluate it later, but the emitter above is
the smaller, already-fitting choice. No NixieFX code staged.
Wiring target: Step 4 agent — VFX layer: one emitter config per damage
type / weight, textures from the existing atlas workflow, never a baked
shadow texture (shadows are a separate layer).
Gate: a heavy hit emits its full burst on the contact frame, all
particles die within their configured life, and no emitter survives a
scene teardown (destroy() releases everything).
