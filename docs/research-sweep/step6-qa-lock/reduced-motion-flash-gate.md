# Reduced-motion + flash gate (Step 6, QA lock) — NEW this pass
Source: WCAG 2.2 success criteria (public standard, no licence issue):
- 2.3.1 Three Flashes or Below Threshold (Level A): nothing flashes more
  than three times in any one-second period, unless below the general
  and red flash thresholds.
- 2.3.3 Animation from Interactions (Level AAA): motion triggered by an
  interaction can be disabled unless essential. Implementation: honour
  the prefers-reduced-motion media query (matchMedia
  "(prefers-reduced-motion: reduce)") AND provide an in-game setting —
  the system query alone is not enough for a game with its own settings
  screen.
- 2.2.2 Pause, Stop, Hide (Level A): anything that moves/blinks on its
  own for more than five seconds can be paused, stopped or hidden.
Lane gates derived from the standard (authored here):
1. Hit flash, screen flash and camera shake each have an off/reduced
   switch; reduced mode turns shake + flash + knockback OFF and halves
   squash (same rule as the step1 juice study note).
2. No battle exchange, VFX burst or title sequence flashes more than
   three times per second at full-screen brightness. The hit flash is
   3–6 frames on the target only, never full-screen, and never repeated
   inside one second.
3. Reduced-motion mode never changes game LOGIC: damage, turn order and
   capture odds are identical; only presentation changes. A playtest in
   reduced mode must produce the same battle outcome as normal mode.
4. Information is never audio-only or flash-only: a contact is shown by
   flash AND sound AND spark together (step1 stack), so muting one
   channel never hides the event.
Wiring target: Step 6 agent — QA gate + settings wiring (Step 2 battle
view, Step 4 VFX layer); Step 5 agent re-runs one playtest per mode.
