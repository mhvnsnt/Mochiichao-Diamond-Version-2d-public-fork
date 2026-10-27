# Delta-time animation note (Step 2, battle integration) — NEW this pass
Source technique: PixiJS Ticker deltaMS (PixiJS is MIT licensed; no PixiJS
code staged here) + the generic frame-animation pattern found this pass.
Rule: accumulate elapsed milliseconds (currentTime += deltaMS) and advance
frames only when the accumulator passes a frame's duration; a while-loop
catches up after a spike instead of dropping the event order. Frame count
must NEVER drive timing on its own — a 60 Hz display and a 144 Hz display
would otherwise play the same exchange at different speeds, and a
backgrounded tab would desync sound from the contact frame.
Wiring target: Step 2 agent — the Pixi animation adapter (existing
pixiAnimationAdapter.js lineage) and the battle timeline player: timeline
events fire on accumulated time, and hit-stop freezes the accumulator for
both sides while the wall clock keeps the freeze length honest (see step1
juice-stack-study-note: hitstop timed on wall clock).
Gate: the same exchange recorded at 60 Hz and at 144 Hz shows the contact
event, flash, sound and spark on the same timeline millisecond, and the
HP drain still starts only after hold_end.
