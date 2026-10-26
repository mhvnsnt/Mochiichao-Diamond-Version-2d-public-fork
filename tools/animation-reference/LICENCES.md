# Animation reference — licences

Every file in this directory is openly licensed for redistribution.
Attribution is recorded here; licence texts ship alongside the files.

## CC0-1.0 — Fantasy Creatures animation code (public domain dedication)

- Source: https://github.com/danielgruginski/Beasts
  (`beasts/` — 35 files: per-creature `*_anim.py` clip/keyframe scripts,
  `beast_common.py`, `beast_export.py`, `*_rig.py` bone tables,
  `*_pose.py` pose definitions, `*_gdx.py` export format code)
  Licence text: `beasts/LICENSE-CC0`
- Source: https://github.com/danielgruginski/Insectoids
  (`insectoids/` — 8 files: `centipede_anim.py`, `spider_anim.py`,
  `wasp_anim.py`, `bug_common.py`, `bug_export.py`, `bug_rig.py`,
  `bug_gdx.py`)
  Licence text: `insectoids/LICENSE-CC0`
- These are the animation/movement definitions (clip timing, keyframes,
  gaits, root motion, event times, export JSON schema) for 26 original
  fantasy creatures (wolf, dragon, hydra, spider, wasp, turtle, etc.).
  No creature art, textures, or models from these repos are included —
  only the animation/movement code.

## GPL-3.0 — Tuxemon animation system code

- Source: https://github.com/Tuxemon/Tuxemon (branch `development`)
  (`tuxemon/` — 7 files: `animation.py`, `surfanim.py`,
  `animation_entity.py`, `state/animation_group.py`,
  `state/animation_mixin.py`, `state/animation_transition.py`,
  `states/combat_animations.py` — the battle-animation sequencing system)
  Licence text: `tuxemon/LICENSE-GPL3`
- Tuxemon's technique-effect sprite PNGs and monster art are NOT included;
  only the animation system code (frame timing, sequencing, transitions).

## What is deliberately NOT here

- No Nintendo art, model, music, or logo files.
- No Pikachu and no Pokemon character art of any kind.
- No files of unclear licence (see `colosseum-2d-fan-projects.md`).
