# Game-feel stack — study-only note (Step 1, attack + hurt) — NEW this pass
Sources found this pass (technique descriptions only, NOTHING staged from them):
- SimVX game-feel docs (shake + hitstop + punch + flash + particles as five
  independently toggleable ingredients; hitstop timed on the wall clock, not
  the scaled clock, or a 0.1 s freeze lasts 20x too long; a new hit stops the
  old punch coroutine first so recoil never accumulates drift).
- Hitfeel Kit / Sprite Juice Kit 2D / Game Juice (commercial/paid add-ons):
  profile sets light / medium / heavy / crit / block / parry / heal / explosion;
  trauma-squared camera shake (shake grows with trauma^2, decays on its own,
  camera returns exactly); hit-stop that restores time scale exactly once even
  under repeated calls; pooled floating damage numbers (max 64, stacking
  offset so numbers never overlap); atlas-safe outline that never samples
  outside the current frame.
Licence/status: PAID commercial products — licence NOT open, code NOT
staged, NOT vendored. Study-only: adopt only the generic profile names and
the two invariants (time-scale restored exactly once; recoil never drifts),
both already consistent with this lane's existing hit-stop spec and
treatments module (monotonic recoil/shake/particle/zoom scaling).
Wiring target: Step 1 agent — per-weight profile table (light/medium/heavy/
crit) checked against the existing treatments tests; Step 6 agent — the
exactly-once restore + no-drift rules become QA gates.
Accessibility gate (see step6): every one of these effects must have an
off/reduced switch; a reduced-motion setting halves squash and turns off
shake, flash and knockback (see step6 reduced-motion-flash-gate).
