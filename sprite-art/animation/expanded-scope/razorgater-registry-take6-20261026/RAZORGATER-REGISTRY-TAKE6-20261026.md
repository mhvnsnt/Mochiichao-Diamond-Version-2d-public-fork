# Razorgater registry → take-6 reconciliation — 2026-10-26

## Authority (checked before any asset use)
- `docs/locked-versions.json` + `docs/locked-versions.md` on main: Razorgater attacks
  CURRENT = **take-6**, tag `artic-pipev3w6-20261026`, mouth **triangle** (wide top,
  point at chin), LOCKED MAIN — Mars approved perfect 2026-10-26 ~15:29 CDT.
- SUPERSEDED — DO NOT USE: take-5 (ellipse), take-4 (ellipse), take-1/2/3.
- Source of the new entry (generated, not hand-typed):
  `tools/sprite-art/mouth-shape/razorgater/manifest-artic-pipev3w6-20261026.json`
  (shape: triangle, method: V6 auto-sensed triangle jaw) — on main via PR #208.

## The defect
`src/lib/creatureAnimation.ts` ARTICULATION entry for `razorgater` pointed at the
V2 eyes-only base (`razorgater-artic-v2rework-20261026-*`, mouth: eyes-only,
layer: v2, batch: batch-a) even though take-6 is CURRENT. The file's own
resolver comment admitted it ("reconciling the registry to take-6 is the art
lane's job"). `PixiBattleCanvas` renders whatever `attackSetFor()` returns, so
Razorgater's Physical/Special attacks rendered eyes-only.

## The fix (this PR, razorgater ONLY — no other creature touched)
- `razorgater` ARTICULATION entry: 4 sets repointed to the take-6 files
  (22 cells, same set names, same cell counts as the old entry):
  `atk_heavy_jaw_crash_finisher` 6, `atk_physical_razor_rush` 5,
  `atk_signature_cross_slash` 6, `atk_special_blade_wave` 5.
  Each set: mouth `eyes-only` → `fresh` (a mouth is now drawn), layer `v2` →
  `v3w6`, batch `batch-a` → `take-6` (provenance).
- Loader: `ArticSet.layer` and `AttackSetChoice.layer` unions gain `v3w6`;
  `loadArticCell()` gains a `v3w6` branch resolving via a new glob over the
  take-6 cells' real home on main,
  `tools/sprite-art/mouth-shape/razorgater/*.png` (suffix
  `/mouth-shape/razorgater/<file>`). No cell file is moved, copied, or
  duplicated — the locked take-6 cells stay the single source of truth.
  `PixiBattleCanvas` already passes `setChoice.layer`/`setChoice.batch`
  through, so no caller change was needed.
- Header counts updated to stay honest: fallback 52 sets / 286 cells /
  13 entries → 48 sets / 264 cells / 12 entries; mouths 41/96 → 45/96 sets;
  take-6 sentence added. The "13 entries' v3q cells were never uploaded"
  sentence is unchanged (still true — razorgater uses take-6, not v3q).
- Resolver comment updated: reconciled, no longer rendered as-is eyes-only.

## Proof (measured, not claimed)
- Old vs new, per cell, all 4 sets: ONLY impact cell-03 differs in each set
  (heavy 546px, physical 533px, signature 552px, special 553px); every other
  cell is byte-identical. Take-6 = the v2 eyes cells + the triangle mouth on
  the impact frame.
- Take-6 cells on main are byte-identical to the staging set (22/22, sha256).
- Before/after sheet (impact cell-03, old vs new, all 4 sets):
  `razorgater-registry-take6-before-after-20261026.png` (this dir).
- Scope check: 26 registry entries compared old vs new — ONLY `razorgater`
  changed (24 articulation + 2 pilots; no pilot entry touched).
- Gates owed before merge: build + typecheck on a fresh clone at PR head
  (the new `import.meta.glob` over `tools/` must bundle), mergeable + clean,
  blob-SHA re-verify on main after merge.

## Out of scope (not done here)
- No other creature's registry entry, no v2rework file moved or deleted
  (old eyes-only cells stay on main, superseded for Razorgater's attacks
  only by this repoint, not deleted per the 0-deletion rule).
- No live deploy: merged code reaches players only after a Pages rebuild.
- No VFX re-aim: the VFX origin/aim pass owns travel direction; this item
  only fixes which cells render.
