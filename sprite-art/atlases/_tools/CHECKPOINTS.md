# CHECKPOINTS — Razorgater idle between-feet + Gate C + shadows-separate (full scope, checkpointed)
Mars rule (2026-10-25 ~20:23 CDT): never narrow scope to avoid drops — do ALL work in segments with checkpoints, so a restart resumes from the last checkpoint.

## Segment 0 — Setup / resumed state (2026-10-25, this run)
- Prior state verified on disk: `sprite-art/atlases/_tools/spot_check.py` (Gates A + B, scipy/BFS components), `SPOT-CHECK-UPGRADE.md` (v2 sweep results), `sprite-stack-upgrade/` mirror, Razorgater `animation/idle/razorgater/` idle_a/b/c + `_clean` files, `animation/hurt/razorgater/` hurt clean.
- Decomp shadow evidence already located (to be written up in Segment 3):
  - Black 2 `pokebw2/src/ov036/fldeff_shadow.c` — header: "The shadow under each field actor: a billboard that follows the actor and hides while it can't have one."
  - Black 2 `pokebw2/src/ov012/fldmmdl.c` — `FldAct_SetShadowGroup` / `actor->shadowGroup` / `FldAct_SetForceOffShadow`.
  - FireRed `pokefirered-leafgreen/src/field_effect_helpers.c` — `FldEff_Shadow()` creates a SEPARATE sprite via `CreateSpriteAtEnd(gFieldEffectObjectTemplateIds[graphicsInfo->shadowSize])` (sizes S/M/L/XL + vertical offsets), `UpdateShadowFieldEffect` follows the linked object event.
- Venv present at `atlases/_tools/.venv-opencv/` (bin/python exists); OpenCV install pending (prior pip run was interrupted).
- Status: Segment 0 DONE. Next: Segment 1 (Razorgater idle between-feet, OpenCV segmentation).

## Segment 1 — Razorgater idle between-feet, DONE (OpenCV, no hand edits)
- Diagnosis (eye + pixel data): the residue was a gray ellipse outline loop hanging below/between the feet (the soft shadow's edge; Gate B had cut only its flat 141/142 fill, 139px). In `idle_a_clean.png` it is one gray-mask component: 111px, bbox x19-44 / y46-60, 65 distinct grays (mean ~142, std 18.4 — NOT flat, so flatness is the wrong discriminator), enclosing a 142px transparent hole (the between-feet gap), maxDist 2.00 (thin stroke) vs body mass maxDist 4.20 (thick).
- Method: OpenCV 5.0.0 installed in `.venv-opencv/` (venv pip, system pip is PEP 668-blocked + debian numpy uninstall-blocked). Gate C rule (see Segment 2): gray component + size >= 40 + lower 60% + enclosed hole >= 10 + thin stroke (distanceTransform max <= 2.5) -> cut; thick holed loops -> flagged, never cut; without OpenCV, holed loops -> flagged, never cut.
- Outputs (NEW files, shown originals untouched): `animation/idle/razorgater/idle_a_clean2.png`, `idle_b_clean2.png`, `idle_c_clean2.png` — each exactly 111px cut via Gate C (b: bbox x19-44 / y44-58, same hole/maxDist). Eye-verified enlarged on black: between-feet space fully clear, feet/teeth/eyes/body intact. Remaining bottom-band opaque pixels are right-foot only (x45-57); faint bottom pixels are semi-transparent anti-aliasing, not residue.
- Fallback proof: system python (no cv2) on `idle_a_clean.png` correctly FLAGS the loop (hole 142, maxDist None) instead of cutting — preflight fails safe.
- Status: Segment 1 DONE. Next: Segment 2 (Gate C mirror + sample proof).

## Segment 2 — Gate C wired + mirrored, DONE
- `atlases/_tools/spot_check.py` now contains Gate C (OpenCV
  `connectedComponentsWithStats` + `distanceTransform` thinness test,
  scipy/BFS fallback that flags instead of cutting without OpenCV).
  `py_compile` passes.
- Mirrored byte-identical to `sprite-stack-upgrade/spot_check.py` and
  `sprite-stack-upgrade/SPOT-CHECK-UPGRADE.md` (diff clean) for the next
  stack PR. The repo's `tools/sprite-stack/sprite_pipeline.py` was NOT
  edited (it lives in the repo, not locally) — the upgrade note documents
  the exact hookup (extract -> spot_check --clean --fail-on-flagged ->
  pack -> manifest).
- Sample proof (beyond Razorgater): see Segment 4 sweep. Gate C behavior
  on the Razorgater sample: 111px cut x3 frames (OpenCV), flagged x1
  (no-OpenCV fallback) — both paths behave as designed.
- Status: Segment 2 DONE. Next: Segment 3 (shadows docs).

## Segment 3 — Shadows-separate verified from decomp files, DONE
- Overworld, FireRed: `pokefirered-leafgreen/src/field_effect_helpers.c`
  (`FldEff_Shadow`, separate sprite, S/M/L/XL templates + offsets) and
  `graphics/field_effects/pics/shadow_small|medium|large|extra_large.png`.
- Battle, FireRed: `pokefirered-leafgreen/src/battle_gfx_sfx_util.c`
  lines 891-950 (`LoadAndCreateEnemyShadowSprites`,
  `gSpriteTemplate_EnemyShadow` at battler Y+29, `SpriteCB_EnemyShadow`,
  `HideBattlerShadowSprite`) and
  `graphics/battle_interface/enemy_mon_shadow.png`.
- Overworld, Black 2: `pokebw2/src/ov036/fldeff_shadow.c` (shadow =
  billboard following the actor) and `pokebw2/src/ov012/fldmmdl.c`
  (`shadowGroup`, `SetForceOffShadow`).
- Docs updated: `SPOT-CHECK-UPGRADE.md` gained Gate C + a
  "Shadows-separate verification" section; the old "kept by design"
  bullet that kept soft contact shadows was REPLACED with a dated
  correction (baked shadows are removed by the gates; engine adds the
  shadow separately; inseparable merged remnants are flagged, never
  blessed as design). The old "float every character" rationale now
  occurs 0 times in both doc copies (grep-verified). New spec note:
  `sprite-art/SHADOWS-SEPARATE-NOTE.md` (overworld + battle rules).
- Status: Segment 3 DONE. Next: Segment 4 (roster-wide between-limbs sweep).

## Segment 4 — Roster-wide between-limbs sweep, DONE
- Scope: `animation/idle/` (153 files) + `animation/hurt/` (52 files) =
  205 original files, analyze-only (nothing overwritten, no _clean file
  touched). Results saved to `atlases/_tools/gatec_sweep.json`
  (original Gate C rule) and `gatec_sweep_tight.json` (final rule).
- CRITICAL FINDING (eye-verified, caught before any cut): under the
  original wider-band Gate C, the sweep's single would-cut hit was a
  FALSE POSITIVE — the Razorgater hurt original's TAIL (154px, bbox
  x40-59 / y32-53, hole 15, maxDist 2.20), shown in red overlay: body,
  not residue. The approved hurt clean is UNAFFECTED (sweep was
  analyze-only). The other 7 original-rule hits were correctly FLAGGED,
  never cut: oblivirex idle a/b/c (138-140px, hole 10, maxDist 2.80 —
  torso body, eye-verified), finblade hurt (128px, hole 11, maxDist
  2.80), gearkid hurt (261px, hole 31, maxDist 3.60), oblivirex hurt
  (156px, hole 11, maxDist 3.60), shellguard hurt (201px, hole 24,
  maxDist 2.80).
- FIX APPLIED: Gate C band tightened to ground zone (cut at y_min >=
  0.65H, flag at 0.60H-0.65H, ignore above 0.60H), calibrated on the
  observed sample (shadow loops y_min >= 0.6875H, body loops y_min <=
  0.594H). A 0.70H band was tried first and wrongly excluded
  idle_b (y_min 44); 0.65H admits all three Razorgater idle frames.
- FINAL SWEEP (tightened rule): 205 files, 0 Gate C hits on originals —
  expected: originals' stage-1 shadows are Gate B territory (filled
  ellipses have no hole); Gate C is the stage-2 gate and fires on the
  _clean files, verified 3/3 on Razorgater idle a/b/c (111px each).
  Wispkin idle: no Gate C finding (white mask protected: value > 220
  excluded, touches transparency so never enclosed).
- OpenCV install note: system pip is PEP 668-blocked and debian numpy
  cannot be uninstalled, so OpenCV 5.0.0 lives in
  `atlases/_tools/.venv-opencv/` (venv pip). Without OpenCV, Gate C
  flags instead of cutting — preflight fails safe.
- Status: Segment 4 DONE. ALL SEGMENTS DONE.
