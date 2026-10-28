# Creature Mode prototype — design spec

Designed 2026-10-25, from earlier Creature Mode research, adapted to Mars's
2026-10-25 direction: Pokemon-style, Nintendo-based, 2D/2.5D tile world.
NOT voxel, NOT Minecraft, NOT a 3D R3F world. Creature Mode is a separate mode
alongside Trainer Mode — it does not replace turn-based battles.

## 1. What it is
- The player plays AS a creature, walking around the open world in real time,
  fighting wild creatures and trainers' creatures in real time, instead of
  issuing turn-based commands as a trainer.
- Reference feel (from earlier research, as design only): Pokemon Battle
  Coliseum / Arena-style 2D fan projects, Mystery Dungeon's play-as-Pokemon
  idea — NOT Pokemon Ranger (Ranger is a human capturing by circling, not
  play-as-Pokemon).

## 2. Controls (2D top-down, keyboard + touch mapping to be finalized)
- Move: WASD / D-pad. Sprint: Shift (drains a stamina meter, refills at rest).
- Moves: keys 1–4, each with its own cooldown (cooldowns from the move data,
  not invented per-creature). No move spamming — cooldown is the balance lever.
- Dodge: Space, ~0.25s i-frames. Perfect Dodge (dodging within the hit window)
  refunds part of the dodged move's cooldown — the skill expression in the mode.
- Jump: Q (short hop over low obstacles / gaps in the tile map only — no
  vertical platforming, no voxel height).
- Tag-switch: Tab switches to another party creature, with a short switch
  cooldown so switching is tactical, not a free heal.

## 3. Combat loop (real-time, separate from turn-based battle code)
- Wild creatures and enemy creatures use the same real-time loop: move, chase,
  flee, or attack based on temperament (from the Mochiimind behavior matrix
  idea: solitary / pack / skittish / territorial — as data, not as AI chat).
- Pack creatures spawn together and move as a flock (Boids rules, MIT) —
  a pack encounter is a different fight from a solo encounter.
- Skittish creatures flee if the player gets too close too fast; territorial
  creatures engage on sight; curious creatures approach and watch.
- Damage uses the canonical move record (power / accuracy / type from the
  unify map) converted to real-time hits — same numbers, different delivery.
  Do NOT maintain a second, divergent damage table.
- Defeat / capture in Creature Mode: a defeated wild creature can be caught
  with a Luigi Cube (same item, same capture math as Trainer Mode) or left.
  Ring Capture (Ranger-style circling) is a separate capture mode, not the
  default Creature Mode capture.

## 4. World and sprites
- Same tile maps as Trainer Mode (Sector 0, The Dark Forest, etc.) — no separate
  world, no separate engine. Creature Mode reuses the world renderer.
- Sprites: top-down / 2.5D creature sprites from the asset manifests
  (batches 001–040 + starters-and-final), with a walk cycle and a facing
  direction. Back-view / front-view battle sprites are NOT reused for
  top-down walking — walking needs its own frames, and that is a known
  sprite-production cost, not a free reuse.
- Camera: follows the player creature, same view size as Trainer Mode world.

## 5. Progression
- The played creature gains XP and levels like in Trainer Mode, from the same
  canonical roster data. Garden stats / Garden Forms apply the same capped
  +9% battle bonus — Garden and Creature Mode share the bonus, they do not stack.
- Creature Mode progress and Trainer Mode progress share one save file and
  one party. Switching modes never duplicates a creature or an item.

## 6. Wiring order and blockers (why this is a spec, not a prototype yet)
1. Roster unify PR (canonical IDs, types, moves — Creature Mode damage and
   cooldowns must read canonical data, not three conflicting systems).
2. PR #9 lands (mochiichao-systems.ts — Garden bonus shared with Creature Mode).
3. PixiJS 2.5D renderer (Phase-2, stacks-50) — real-time movement on the
   current CSS renderer would be janky and would have to be rebuilt anyway.
4. Top-down walk sprites for at least the starter lines (Mochii / Razorgater /
   Tyrage lines — starter evolution NAMES still open, see the options question).
- This spec is the design deliverable. No Creature Mode code is written yet,
  and no repo file changes because of this file.
