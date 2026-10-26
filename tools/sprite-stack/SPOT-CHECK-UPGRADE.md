# spot_check.py — UPGRADE note (2026-10-25)

## Why
Mars's standing rule: he must never have to flag a white/light spot again.
The original `clean_atlas.py` only removed border-connected background, so
trapped background in enclosed negative space survived into presentations
(Razorgater hurt: a 95px white patch; Razorgater idle: a 139px flat-gray
ground blob underneath the body). `spot_check.py` is the pre-presentation
gate that runs BEFORE anything is shown.

## What it does
- Gate A (trapped near-white patch): >= 30px, mean min-channel >= 240,
  fully interior, no border touch -> auto-cut to transparent.
- Gate B (flat ground patch): flat mid-gray colours that occur NOWHERE else
  in the image, in the bottom 25% of the cell -> cut exactly those pixels.
- Gate C (ground-zone loop, OpenCV): a gray-mask component (chroma <= 15,
  value 90-220) of >= 40 px, in the GROUND ZONE (y_min >= 0.65 * height),
  that encloses a transparent hole >= 10 px AND is a thin stroke
  (cv2.distanceTransform max <= 2.5 px) -> auto-cut. Proved on Razorgater
  idle a/b/c: 111 px each (bbox x19-44, hole 142 px, maxDist 2.00) — the
  soft-shadow ellipse loop left after Gate B. The band is calibrated on
  the observed sample (shadow loops y_min >= 0.6875H, body loops y_min <=
  0.594H); borderline-band loops (0.60H-0.65H) are FLAGGED, never cut, and
  everything above 0.60H is ignored by Gate C (a thin gray tail above the
  ground zone false-positives under a wider band). Thick holed loops in
  the ground zone are FLAGGED, never cut; without OpenCV, holed loops are
  FLAGGED, never cut. Install: `python3 -m venv .venv-opencv &&
  .venv-opencv/bin/pip install opencv-python-headless numpy Pillow`
  (system pip is PEP 668-blocked here).
- Small near-white clusters (< 30px: teeth, eye highlights, claw tips) are
  NOT cut and NOT failed — v1 cut them and damaged Razorgater's teeth.
- Large near-white patches that fail interior/border gates are FLAGGED and
  the run exits 1: do not present that file until a human resolves it.
- Originals are NEVER overwritten: cleaned copies are `<stem>_clean.png`.

## Pipeline integration (for the next sprite-stack PR)
The runner in `tools/sprite-stack/sprite_pipeline.py` must call, in order:
1. `extract` -> 2. `spot_check.py --clean --fail-on-flagged <out-dir>` ->
3. `pack` -> 4. `manifest`. If step 2 exits 1, the pipeline stops and the
report (file/cell/component/pixel count) is the work item — no presentation
happens with an unflagged trapped spot.

## v2 correction history
- v1 used the atlas gates (3-400px) on animation cells: it cut 126px of
  design highlights from Razorgater idle and missed the ground patch
  (merged with body pixels in the flat mask). Those v1 `_clean` files were
  deleted. v2 (size floor >= 30px, exact-colour uniqueness for Gate B)
  cuts exactly 95px (hurt) and 139px (idle a/b/c) and nothing else.

## Roster-wide sweep results (2026-10-25, v2 tool)
- animation/idle + game-ready: 1111 files scanned, 102 files cleaned
  (8125px), 191 files flagged-only (design whites kept, not cut).
  Cleaned leaders: idle 36 files; finblade 9, zephling 8, razorgater 8,
  tyrage 5, mothrix 5, duneclaw 5.
- animation/hurt cells (51 cell_00 files): 8 files cleaned (674px:
  chromejaww 32, cocoonode 71, floatcalf 41, krakenox 66, megalochrome
  184, oblivirex 137, pyromonk 48, razorgater 95); 10 files flagged-only.
- Flagged-only = review queue, NOT auto-cut: Wispkin white masks,
  Zephling white bellies, Yogiferno cream fur, Punchkid white data-tape
  fists, Pixilite white crystal — all design whites that touch
  transparency (not fully interior) or are off-white (mean-too-dark).
  They are kept deliberately; a future pass may add a per-creature
  design-white allowlist so preflight passes clean on them.
- Kept by design (not a trapped spot): design whites that touch
  transparency or are off-white — see "Flagged-only" above. (CORRECTION
  2026-10-25, shadows-separate rule, supersedes the earlier bullet that
  kept soft contact shadows as design: baked soft shadows are NOT design.
  They are removed by Gates A/B/C wherever the gates can separate them
  cleanly, and the engine adds the shadow as its own separate layer —
  see "Shadows-separate verification" below. A baked shadow merged with
  body pixels so tightly that no gate can separate it without eating
  body pixels is FLAGGED for review, never blessed as design.)

## Shadows-separate verification (2026-10-25, from the actual decomp files)
Pokemon adds shadows SEPARATELY. The shadow is its own sprite/object that
follows the character; it is never baked into the character's sprite art.
Evidence checked in the repo's own submodules (work clone
`mochiichao-work/fresh-start/`):
- FireRed, overworld: `pokefirered-leafgreen/src/field_effect_helpers.c`
  — `FldEff_Shadow()` creates a SEPARATE sprite with
  `CreateSpriteAtEnd(gFieldEffectObjectTemplatePointers[
  gShadowEffectTemplateIds[graphicsInfo->shadowSize]])`, sizes S/M/L/XL
  with vertical offsets, and `UpdateShadowFieldEffect` follows the linked
  object event. Separate shadow graphics live at
  `graphics/field_effects/pics/shadow_small.png`, `shadow_medium.png`,
  `shadow_large.png`, `shadow_extra_large.png`.
- FireRed, battle: `pokefirered-leafgreen/src/battle_gfx_sfx_util.c`
  lines 891-950 — `LoadAndCreateEnemyShadowSprites()` loads a separate
  `gSpriteSheet_EnemyShadow` and creates a separate shadow sprite
  (`gSpriteTemplate_EnemyShadow`) under the battler (Y+29), with its own
  callback `SpriteCB_EnemyShadow` and `HideBattlerShadowSprite`.
  Separate graphic: `graphics/battle_interface/enemy_mon_shadow.png`.
- Black 2, overworld: `pokebw2/src/ov036/fldeff_shadow.c` — header:
  "The shadow under each field actor: a billboard that follows the actor
  and hides while it can't have one." Plus `pokebw2/src/ov012/fldmmdl.c`
  — `FldAct_SetShadowGroup` / `actor->shadowGroup` /
  `FldAct_SetForceOffShadow`: shadow grouping is a per-actor property of
  the field actor, separate from its model.
- Consequence for this lane (standing rule): baked soft shadows are
  REMOVED from character art by the spot-check gates; the game engine
  adds the shadow as a separate layer (overworld: shadow object following
  the actor; battle: shadow sprite under the battler). See also
  `sprite-art/SHADOWS-SEPARATE-NOTE.md`.
- Proof strips are composites of checked cells and are eye-verified, not
  pixel-swept (their 768px width makes the Python scan slow); full-size
  generated source art (media-generation-*) is checked at 64px cut time.
- Razorgater manifests still point at the original filenames; the next
  push batch adopts the `_clean` files (hurt 95px, idle a/b/c 139px each)
  and rebuilds the proof strip from them (v2 strip already built).
