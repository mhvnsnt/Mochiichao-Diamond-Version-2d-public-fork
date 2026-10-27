# Follower steering spec (Step 3, overworld / follower)

Source technique: Craig Reynolds' steering behaviours (1987; described
in public teaching material, e.g. The Nature of Code ch. 6 and the
UNR AI-for-games notes). This is a technique description, not staged
code — the pseudocode below is authored for this lane.

## Behaviours used (and only these, for a single follower)

- SEEK: desired velocity = direction to target, scaled to max speed;
  steering force = desired velocity minus current velocity.
- ARRIVE: as SEEK, but inside an arrival radius the desired speed
  scales down linearly with distance, so the follower slows into its
  slot instead of oscillating through it.
- SEPARATION (follower vs player only): if closer than a minimum
  distance, steer away. This is what prevents stacking on the player.
- Path following is NOT steering: the follower follows the player's
  recorded trail (existing follower spec, PR #37 lineage), and steering
  only smooths how it moves along that trail.

## Slot rule (unchanged from existing follower spec)

Trail rule, fixed spacing behind the player, facing the player's facing
on idle, no stacking. Steering changes HOW the follower moves between
trail points; it does not change WHERE the follower is allowed to be.

## Tuning starting points (to be verified in playtest, not asserted)

- Arrival radius: roughly 1 tile. Minimum separation: roughly 0.5 tile.
- Follower max speed: slightly above player walk speed, so it catches
  up after a turn without teleporting; never so fast it laps the player.

## Wiring target

- Owning step agent: Step 3 (overworld / walk + follower).
- Target module: the follower movement module (existing follower
  trail logic) — add a steering smoothing pass between trail-point
  selection and position update.
- Gate: follower never overlaps the player, never oscillates around its
  slot for more than 2 frames, and reaches its slot within 1 second of
  the player stopping, on flat ground with no obstacles.
- NOT re-pulled: grid pathfinding is already covered in this project
  by the world lane's A* pull; do not add a second pathfinder here.
