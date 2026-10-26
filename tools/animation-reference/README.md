# Animation reference

Pulled 2026-10-25 under Mars's rule: Mochiichao makes its own art, models,
and music — what gets pulled in is everything else, 100% of it: movements,
timing, techniques, systems, structures, data shapes, and file formats for
creature animation and battle presentation.

## What is here

- `beasts/` — CC0 clip/keyframe animation code for quadruped and flying
  fantasy creatures: gait phase tables (walk / trot / gallop / bound),
  leg IK pose machinery, per-clip timing, root motion on a Motion bone,
  and the clip JSON export schema (loop, root motion, event times).
- `insectoids/` — CC0 animation code for spider, wasp, and centipede
  (multi-leg gaits, crawl, lunge, web/spawn clips).
- `tuxemon/` — GPL-3.0 animation system code from the open-source
  monster-taming RPG Tuxemon: frame animation (`animation.py`,
  `surfanim.py`), animation groups/transitions, and the battle-animation
  sequencing state (`states/combat_animations.py`) — how a monster
  battle stages telegraphs, attacks, impacts, and returns.

## How to use it

These files are REFERENCE, not game code: read the gait tables, clip
timing, and battle sequencing, then implement the same movements in
Mochiichao's own art and rigs. Nothing here is imported by the game.

## What was searched and skipped

See `colosseum-2d-fan-projects.md` for the Colosseum 2D / Arena 2D fan
project search and why no files from those projects were pulled.
