# Follower-walking spec — party creatures follow the player (HANDOFF)

Status: SPEC + PROTOTYPE MODULE (`followerWalk.js`, tested). NOT wired
into the game, the overworld, or battle. Wiring owner: the Step 3
overworld agent. This is the Ranger-type system Mars DID want
(2026-10-25 ~19:45 CDT): creatures walking around with the player —
not the capture loop, which is a separate gated system
(see `../ring-capture-zone-spec.md`).

## 1. What follows, and when

- The player's party, in party order, walks behind the player in the
  overworld. Slot 1 follows closest, slot 2 behind slot 1, and so on.
- Followers are visible whenever the player is walking in the
  overworld. They do not follow into battle screens, menus, or
  cutscenes unless the overworld agent explicitly stages them there.
- A follower is a companion sprite, not a second player: it cannot be
  directly controlled, cannot block the player, and cannot trigger
  encounters on its own.

## 2. Positioning (the prototype's rules)

- **Trail rule.** The game keeps the player's recent path (positions
  sampled per step). Follower *i* (0-based) targets the path point
  `SPACING * (i + 1)` distance-units behind the player's current
  position, walking the same path the player walked. This keeps
  followers out of walls the player already cleared and makes them
  snake around corners instead of cutting across.
- **Spacing default.** `SPACING = 1.0` tile (one full tile behind per
  follower). Tunable per creature size: large creatures may use 1.25,
  small ones 0.75 — the prototype takes spacing as a parameter, the
  overworld agent sets it per species.
- **Speed.** A follower moves at the player's walk speed, plus a
  catch-up bonus when it falls more than 2 tiles behind (1.5x until
  within 1 tile). It never teleports except on map change, where all
  followers respawn in trail order behind the player.
- **No stacking.** If two followers would land on the same tile, the
  rear one waits one step (its target advances only when its tile is
  free). Followers never occupy the player's tile.

## 3. Facing

- While moving, a follower faces its direction of travel (the
  direction it just stepped).
- While idle (player standing still, follower arrived at its trail
  target), a follower faces the PLAYER — the classic companion look.
- While the player is idle for a long stand (overworld agent's
  threshold, spec suggestion 5 s), followers may play their idle
  animation in place; facing stays toward the player.

## 4. Prototype module contract (`followerWalk.js`)

- `createFollowerState(count, spacing)` — followers start stacked on
  the player's spawn, marked not-yet-placed.
- `recordPlayerStep(state, x, y)` — push the player's new tile onto
  the path history (history capped at 256 points).
- `updateFollowers(state, playerX, playerY, playerFacing)` — advance
  each follower toward its trail target by one step at most per call;
  returns the follower array `{ x, y, facing }` (facing: up/down/
  left/right, or toward-player when idle).
- Pure, no DOM, no game imports, node-testable
  (`node --test followerWalk.test.js`). The overworld agent adapts
  tiles/units to its own renderer; it does not need to keep the
  prototype's coordinate system.

## 5. Open questions for the overworld agent (NOT decided here)

- Do followers appear in interiors, or only outdoors? (Spec default
  suggestion: everywhere the player walks, except where the map
  explicitly flags no-followers.)
- Which creature sprite set walks (walk frames exist for a subset of
  the roster; the rest need walk sets or a fallback bob). Do not
  invent walk art silently — flag missing sets to the sprite lane.
- Interaction: can the player talk to / check on a follower? If yes,
  that is a new interaction, not a free side effect of following.
