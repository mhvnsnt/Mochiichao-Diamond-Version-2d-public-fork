# Hit-stop feedback stack — wiring spec (Step 1, attack + hurt)

Source (technique article, not code): GameDesignerX, "Hit Feedback in Frames:
Designing Impact With Hit-Stop, Shake and Knockback"
(https://gamedesignerx.com/blog/hit-feedback-in-frames-designing-impact-with-hit-stop-shake-and-knockback).
Licence: article text is NOT staged here and NOT copied; only the timing
structure below, restated in this lane's own terms, is staged. No licence
applies to a timing table of this generality, but the article itself is
study-only — do not repost it.

## The stack, in order, measured at 60 fps

| Layer | Starts | Typical duration | Job |
|---|---|---|---|
| Hit-stop (freeze both sides) | frame 0 (contact) | 2–12 frames, scaled by attack weight | weight and force |
| Impact sound | frame 0 | — | material / size |
| Hit flash on target | frame 0 | 3–6 frames | "that one registered" |
| Particle / spark | frame 0–1 | 10–20 frames | direction and damage type |
| Camera shake | frame 1–2 | 6–12 frames | scale of the event |
| Knockback / stagger | after the freeze | 8–30 frames | spacing, whose turn it is to act |
| Damage number / bar drain | after the freeze | 10–20 frames | exact arithmetic |

Two rules from the article, adopted as lane gates:
1. Contact cues (sound, flash, spark) must land ON frame 0. A sound 3 frames
   late reads as a different event, not a late version of the same one.
2. Arithmetic cues (numbers, bar drain) must land AFTER the freeze, while
   the eye is locked on the collision point during the freeze.

## Fit with existing lane work

This stack matches the existing battle-treatments module's structure
(windup + travel + hold + recoil + recover, HP draining after the hold)
and gives it numbers to tune against: light / medium / heavy / critical
hit-stop of roughly 2 / 5 / 8 / 12 frames, with knockback and shake
scaling in the same order. It does NOT replace the existing module; it
is the tuning table the Step 1 / Step 2 agents check their timings against.

## Wiring target

- Owning step agent: Step 1 (attack + hurt) for the freeze/flash/recoil
  values per attack weight; Step 2 (battle integration) for sequencing
  the stack in the battle timeline.
- Target module: the battle treatments module (existing) + the battle
  timeline schema staged in step2-battle-integration/.
- Gate: a recorded exchange must show flash + sound + spark on the
  contact frame and the bar drain starting only after the freeze ends.
  If the drain starts during the freeze, the exchange fails the gate.
