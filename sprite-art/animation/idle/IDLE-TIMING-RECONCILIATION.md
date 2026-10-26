# IDLE TIMING RECONCILIATION — audit 2026-10-25 (Mars consolidated list item 7)

**Re-sequence applied:** Phase A (Region 1, #001–#046) FIRST, then Phase B
(#147/#148/#331). Phase A gates the Phase A game-ready PR; Phase B does not
block it. No PR opened by this audit. Corrected manifests ship with the art
PR batch gated on the atlas reconciliation.

## Verdict on the conflict (honest, from the files)

- **Step 1 claim "51/51 = 100% recorded": TRUE at class level, FALSE at
  per-creature level.** All 51 manifests carry `timing_reconciliation`
  (baseline, previous ms, final ms, research refs) and every manifest's
  `cycle_ms` equals its frame-duration sum (0 mismatches). The IDLE-INDEX.md
  old-timing table matches every manifest's `previous_cycle_ms`.
- **Mars's "0/51": TRUE at per-creature level.** Step 1's rationales are
  7 identical class templates (1 distinct rationale per class, verified
  scripted) — not per-creature justifications. Research s5.3 requires the
  chosen cycle be recorded *per creature in its animation manifest*.
  This audit supplies that per-manifest record for all 51.
- **Silent retimes found: 0.** Step 1 retimed 41 manifests (grounded 25:
  1800→2400; small_bouncy 7: 1200→1600; hover_swim 9: 1400→1800) and recorded
  each change in the manifest and in the index old table, and in
  `_build_idle.py` comments. Nothing was changed without a record.
  What Step 1 got wrong was not silence but *class*: its hover_swim class
  lumps swimmers under the flyer range, and its own TR text admits the
  serpent/swimmer range (2.4–3.2s) is higher — yet kept flyer timing for
  swimmers. That produced the 3 corrections below.
- **Research baseline used:** BATTLE-ANIMATION-RESEARCH.md s5.2 calm full
  breath 2.0–3.0s, baseline 2400ms (midpoint), cycles faster than ~1.5s read
  nervous/broken; s5.3 ranges: small/light/fast 1.6–2.0s, medium biped
  2.0–2.5s, large/heavy 2.8–3.5s, quadruped 2.2–2.8s, flyer/hoverer 1.8–2.4s,
  serpent/swimmer/gelatinous 2.4–3.2s; Section 6 table values: calm 2400ms,
  small/fast 1600ms, large/heavy 3200ms (example, see heavy note).
- **Mars corrections applied in this audit (2026-10-25 ~22:15 CDT):**
  Aerobeak idle APPROVED as-is → verified, not flagged. Finblade idle has
  NO water and NEEDS a shadow (the earlier "already has water" version was
  wrong) — its 2400ms correction stands under BOTH readings (swimmer row
  and grounded row both contain 2400). Megalochrome already HAS water
  (blue ripple rings), no shadow/water owed — verified 1800ms hover.
- **Staging rule honoured:** originals untouched. Each row's justification
  lives in a NEW file
  `animation/idle/<creature>/<creature>.idle.reconciled-20261025.json`
  (full copy + `audit_reconciliation_20261025` note). The audit script is
  `animation/idle/_audit_idle_reconciliation.py` (rerunnable, asserts
  cycle==frame-sum and old ms before writing).

## Counts

- **Total: verified 47/51, corrected 3/51, flagged 1/51.**
- **Phase A (48 sets): verified 44, corrected 3, flagged 1.**
- **Phase B (3 sets): verified 3, corrected 0, flagged 0.**
- Slots #047–#146 stay UNFILLED (not counted, not touched).

## PHASE A — Region 1 #001–#046 (48 sets; strikechamp = 3 looks, 1 roster slot)

| # | Creature | Class | Old ms | New ms | Frames [A,B,A,C] ms | Justification (short; full text in reconciled file) | Status |
|---|---|---|---|---|---|---|---|
| 001 | mochii | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small starter, squash+bob; = §6 small/fast 1600, s5.3 low end | verified |
| 002 | tiidebiite | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small water starter evo, squash+bob; s5.3 small/fast low end | verified |
| 003 | aquariios | hover_swim | 1800 | 1800 | 450,450,450,450 | STAGED FOR MARS EYES: flyer (1.8–2.4s) vs serpent/swimmer (2.4–3.2s) unsettled, no body evidence on file; ms unchanged | flagged |
| 004 | razorgater | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 005 | chromejaww | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 006 | reaperdile | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 007 | tyrage | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 008 | duneclaw | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 009 | oblivirex | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s (§6 example 3200 noted, range governs) | verified |
| 010 | kittember | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 011 | pyropaw | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 012 | manticlaw | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; C = mapped locked cell, timing unaffected | verified |
| 013 | pupbble | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small, squash+bob; = §6 small/fast 1600 | verified |
| 014 | terradog | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside quadruped 2.2–2.8s | verified |
| 015 | quakehound | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside quadruped 2.2–2.8s | verified |
| 016 | squirmite | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small, squash+bob; = §6 small/fast 1600 | verified |
| 017 | cocoonode | static_crystal | 2200 | 2200 | 600,500,600,500 | Crystal pulse, scale-only, inside calm 2.0–3.0s; not rounded to 2400 | verified |
| 018 | mothrix | hover_swim | 1800 | 1800 | 450,450,450,450 | Moth flyer; flyer/hoverer low end 1.8s | verified |
| 019 | zephling | hover_swim | 1800 | 1800 | 450,450,450,450 | Wind flyer; flyer/hoverer low end 1.8s | verified |
| 020 | aerobeak | hover_swim | 1800 | 1800 | 450,450,450,450 | Mars 22:15: idle APPROVED as-is; ground-stance tension resolved by approval (shadow-gap item separate, not timing) | verified |
| 021 | stormtalon | hover_swim | 1800 | 1800 | 450,450,450,450 | Flyer; flyer/hoverer low end 1.8s | verified |
| 022 | finblade | hover_swim | 1800 | 2400 | 600,600,600,600 | CORRECTED: swimmer row 2.4–3.2s (flyer 1.8s contradicted body); 2400 also inside grounded rows (Mars 22:15: no water, needs shadow) | corrected |
| 023 | megalochrome | hover_swim | 1800 | 1800 | 450,450,450,450 | Levitator, no legs (Mars-locked); flyer/hoverer low end; water ripples already present | verified |
| 024 | floatcalf | float_hover | 1800 | 1800 | 450,450,450,450 | Continuous hover sine −4/+2; flyer/hoverer low end 1.8s | verified |
| 025 | astroleviathan | hover_swim | 1800 | 2800 | 700,700,700,700 | CORRECTED: large serpent/swimmer — serpent 2.4–3.2s ∩ heavy 2.8–3.5s → 2800 (heavy low end, inside serpent range) | corrected |
| 026 | inklet | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small, squash+bob; = §6 small/fast 1600 | verified |
| 027 | toxitacle | hover_swim | 1800 | 2400 | 600,600,600,600 | CORRECTED: tentacle gelatinous/swimmer row 2.4–3.2s (flyer 1.8s contradicted body); 2400 = row low end | corrected |
| 028 | krakenox | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s | verified |
| 029 | punchkid | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside medium biped 2.0–2.5s | verified |
| 030 | strikechamp | grounded_standard | 2400 | 2400 | 700,500,700,500 | Suited default look; calm baseline, biped row | verified |
| 030 | strikechamp_unsuited | grounded_standard | 2400 | 2400 | 700,500,700,500 | Regular no-armor look; same timing, look only | verified |
| 030 | strikechamp_unsuited_full | grounded_standard | 2400 | 2400 | 700,500,700,500 | Rare shiny variant ~10%; same timing, look only | verified |
| 031 | kickmaster | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside medium biped row | verified |
| 032 | gearkid | grounded_standard | 2400 | 2400 | 700,500,700,500 | Mechanical; no machine row in research, calm baseline as neutral default (noted) | verified |
| 033 | mechapion | grounded_standard | 2400 | 2400 | 700,500,700,500 | Mechanical; no machine row, calm baseline as neutral default (noted) | verified |
| 034 | gorokappa | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s | verified |
| 035 | pebblefist | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s | verified |
| 036 | cragarm | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s | verified |
| 037 | terrapod | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 038 | sproutle | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small, squash+bob; = §6 small/fast 1600 | verified |
| 039 | shellguard | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; weight not on file — if later weighed heavy it moves to 2800, not an error today | verified |
| 040 | dreadtoise | heavy_slow | 2800 | 2800 | 800,600,800,600 | Large/heavy low end 2.8s | verified |
| 041 | pixilite | small_bouncy | 1600 | 1600 | 400,400,400,400 | Small, squash+bob; = §6 small/fast 1600 | verified |
| 042 | wispkin | float_hover | 1800 | 1800 | 450,450,450,450 | Floating wisp, hover sine −4/+2; flyer/hoverer low end | verified |
| 043 | duskfiend | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |
| 044 | ashemit | seated | 2400 | 2400 | 700,500,700,500 | Seated, minimal motion; baseline exactly | verified |
| 045 | pyromonk | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside medium biped row | verified |
| 046 | yogiferno | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline; inside biped + quadruped rows | verified |

## PHASE B — #147 / #148 / #331 (3 sets; do not block Phase A)

| # | Creature | Class | Old ms | New ms | Frames [A,B,A,C] ms | Justification (short) | Status |
|---|---|---|---|---|---|---|---|
| 147 | dorowani | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline, grounded rows. Rig-idle-clip timing still owed separately (no rig clip on file; this is baseline timing, NOT rig-derived) | verified |
| 148 | gabu | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline, grounded rows. Rig note as dorowani | verified |
| 331 | mythar | grounded_standard | 2400 | 2400 | 700,500,700,500 | Calm baseline, grounded rows | verified |

## Silent retimes (full list — none unrecorded)

Step 1's retimes, all recorded in manifest `timing_reconciliation` +
IDLE-INDEX.md old table + `_build_idle.py` comments:
- grounded_standard 25: 1800→2400 (all 25 grounded sets incl. Phase B 3)
- small_bouncy 7: 1200→1600 (mochii, pupbble, squirmite, pixilite, inklet, sproutle, tiidebiite)
- hover_swim 9: 1400→1800 (zephling, aerobeak, stormtalon, finblade, megalochrome, astroleviathan, aquariios, mothrix, toxitacle)
- Kept with (class-template) justification 10: heavy_slow 6 at 2800, float_hover 2 at 1800, seated 1 at 2400, static_crystal 1 at 2200.
- **Unrecorded changes: 0/51.** The audit's corrections above are the first
  changes since Step 1, and they are recorded in the new reconciled files,
  not by overwriting originals.

## Registry impact — DO NOT EDIT HERE (follow-up PR's job)

- The Step 2 staging copy `battle-integration-step2/battleSpriteRegistry.json`
  (51 sets) embeds per set: `cycleMs` + `idleClass` + `stagingPath` +
  `onMain: false` for all 51. It does NOT embed frame durations, so only
  cycle totals (not step splits) affect it.
- **Affected entries if this audit's corrections land (3):**
  - finblade (#022): registry `cycleMs` 1800 → must become 2400
  - astroleviathan (#025): registry `cycleMs` 1800 → must become 2800
  - toxitacle (#027): registry `cycleMs` 1800 → must become 2400
- **Not affected:** aquariios (flagged, ms unchanged at 1800); all verified
  sets (ms unchanged). The registry copy on main (PR #55 per brief) was NOT
  verified in this audit — the work clone was not touched and no registry
  file was edited. Parent: re-verify the main registry's `cycleMs` values
  for these 3 slugs before the follow-up PR, since main has moved since
  Step 2 staging.
- **Note:** idle sets landed on main via PR #66 (merged, parent-verified
  2026-10-25 ~22:32 CDT) AFTER Step 1 staging — so these corrections must
  ship as a follow-up change, not as an edit to already-merged files.
  This audit stages them as new revision files for the art PR batch.

## Follow-ups / observations (NOT changed here, NOT blockers)

1. **Builder drift:** `_build_idle.py` still encodes hover_swim 1800 for
   all 9 — a rerun would revert the 3 corrections. The art PR batch must
   update the builder's hover_swim mapping (split flyer vs swimmer) or
   treat the reconciled files as authoritative. Flagged, not edited here.
2. **Hold ratio (s5.2):** research says top/rest holds ~2x transitions;
   manifests use equal steps (450×4, 400×4) or 700/500 splits (~1.4x).
   Step splits were NOT changed in this audit — changing them would
   retime motion cadence beyond the loop-ms scope. Battle-animation
   follow-up may revisit; it does not change any loop total here.
3. **Heavy §6 example:** Section 6 lists large/heavy idle as 3200ms while
   s5.3's range is 2.8–3.5s. Heavy sets kept at 2800 (range low end) —
   recorded as range-valid, not as matching the table example.
4. **Flagged, show-first:** aquariios (#003) — file path
   `sprite-art/animation/idle/aquariios/aquariios.idle.reconciled-20261025.json`
   (ms unchanged at 1800, flag + both candidate totals recorded). Mars
   decides hover (keep 1800) vs swim (2400); audit continues regardless.

---

# 2026-10-26 RE-VERIFICATION — Segment 7 (this pass, appended; prior 2026-10-25 audit above is preserved, not overwritten)

**Scope:** local staging ONLY. No manifest, PNG, registry, or game file was changed in this pass. No push to GitHub, no `fresh-start` touch, no Blender, no Gabu bake/Kaggle work. Every original manifest (`<creature>.idle.json`) was read fresh 2026-10-26 and left untouched; this record lives in this file (appended section) plus one NEW sidecar per creature, `<creature>.idle.timing-20261026.json` — distinct from the 2026-10-25 `<creature>.idle.reconciled-20261025.json` files, which were not overwritten.

**Baseline:** 2400ms = calm baseline, midpoint of research calm full-breath 2.0–3.0s (sprite-art/BATTLE-ANIMATION-RESEARCH.md s5.2; static idle 2–4s, s3c). s5.3 per-body ranges: small/light/fast 1.6–2.0s, medium biped 2.0–2.5s, large/heavy 2.8–3.5s, quadruped 2.2–2.8s, flyer/hoverer 1.8–2.4s, serpent/swimmer/gelatinous 2.4–3.2s. Section 6 table: calm 2400ms, small/fast 1600ms, large/heavy example 3200ms (range governs, see heavy note). s5.2 floor: cycles faster than ~1.5s read nervous/broken.

**Important — brief durations vs current manifests:** the Segment 7 brief lists the ORIGINAL build durations (grounded 1800ms, small_bouncy 1200ms, hover_swim 1400ms, float_hover 1800ms, seated Ashemit 2400ms, static Cocoonode 2200ms, heavy 2800ms). Those are the `previous_cycle_ms` values still recorded inside each manifest's `timing_reconciliation`. The CURRENT manifest finals, read fresh this pass, are: grounded 2400ms, small_bouncy 1600ms, hover_swim 1800ms, float_hover 1800ms, seated 2400ms, static_crystal 2200ms, heavy 2800ms — i.e. Step 1 (2026-10-25) had already retimed grounded 1800→2400, small 1200→1600, hover_swim 1400→1800, and kept the other four classes. This pass re-verifies those finals; it does not re-apply or silently change them.

## Counts (this pass)

- Manifests read: 51/51 = 100% (48 Phase A sets incl. 3 Strikechamp looks for 1 roster slot, + 3 Phase B sets).
- Frame structure: 4 steps [A, B, A, C] in 51/51 = 100%; frame-duration sum == `cycle_ms` in 51/51 = 100% (0 sum mismatches).
- Distinct PNGs referenced per manifest: 3 (idle_a/b/c) in 51/51 = 100%; 153/153 core PNGs present on disk = 100%.
- Total PNGs in the 51 idle dirs: 201. The other 48 are `_clean` / `_clean2` / `_clean3` / `_shadowfree` variants in 12 dirs — NOT referenced by any manifest frame, NOT missing files, NOT mismatches (see PNG section).
- Recommendations (wiring-time only, nothing applied): KEEP 47/51 = 92%, ADJUST AT WIRING 3/51 = 6%, HOLD/FLAGGED 1/51 = 2%.
- By current cycle: 2400ms 26/51 = 51% (25 grounded_standard + 1 seated), 1800ms 11/51 = 22% (9 hover_swim + 2 float_hover), 1600ms 7/51 = 14% (small_bouncy), 2800ms 6/51 = 12% (heavy_slow), 2200ms 1/51 = 2% (static_crystal).
- By class: grounded_standard 25/51 = 49%, hover_swim 9/51 = 18%, small_bouncy 7/51 = 14%, heavy_slow 6/51 = 12%, float_hover 2/51 = 4%, seated 1/51 = 2%, static_crystal 1/51 = 2%.
- Deltas vs 2400ms baseline: 0ms 26/51, −600ms 11/51, −800ms 7/51, +400ms 6/51, −200ms 1/51.

## Full table — current timing, delta vs baseline, wiring-time recommendation

| # | Creature | Class | Steps [A,B,A,C] ms | Current ms | Delta vs 2400ms | Recommendation | Wiring ms |
|---|---|---|---|---|---|---|---|
| 001 | mochii | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 002 | tiidebiite | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 003 | aquariios | hover_swim | 450,450,450,450 | 1800 | -600 | hold_flagged | 1800 |
| 004 | razorgater | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 005 | chromejaww | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 006 | reaperdile | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 007 | tyrage | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 008 | duneclaw | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 009 | oblivirex | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 010 | kittember | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 011 | pyropaw | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 012 | manticlaw | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 013 | pupbble | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 014 | terradog | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 015 | quakehound | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 016 | squirmite | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 017 | cocoonode | static_crystal | 600,500,600,500 | 2200 | -200 | keep | — (keep current) |
| 018 | mothrix | hover_swim | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 019 | zephling | hover_swim | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 020 | aerobeak | hover_swim | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 021 | stormtalon | hover_swim | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 022 | finblade | hover_swim | 450,450,450,450 | 1800 | -600 | adjust_at_wiring | 2400 |
| 023 | megalochrome | hover_swim | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 024 | floatcalf | float_hover | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 025 | astroleviathan | hover_swim | 450,450,450,450 | 1800 | -600 | adjust_at_wiring | 2800 |
| 026 | inklet | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 027 | toxitacle | hover_swim | 450,450,450,450 | 1800 | -600 | adjust_at_wiring | 2400 |
| 028 | krakenox | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 029 | punchkid | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 030 | strikechamp | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 030 | strikechamp_unsuited | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 030 | strikechamp_unsuited_full | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 031 | kickmaster | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 032 | gearkid | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 033 | mechapion | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 034 | gorokappa | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 035 | pebblefist | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 036 | cragarm | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 037 | terrapod | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 038 | sproutle | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 039 | shellguard | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 040 | dreadtoise | heavy_slow | 800,600,800,600 | 2800 | +400 | keep | — (keep current) |
| 041 | pixilite | small_bouncy | 400,400,400,400 | 1600 | -800 | keep | — (keep current) |
| 042 | wispkin | float_hover | 450,450,450,450 | 1800 | -600 | keep | — (keep current) |
| 043 | duskfiend | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 044 | ashemit | seated | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 045 | pyromonk | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 046 | yogiferno | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 147 | dorowani | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 148 | gabu | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |
| 331 | mythar | grounded_standard | 700,500,700,500 | 2400 | +0 | keep | — (keep current) |

## Per-creature reasons (full text is in each sidecar; summary here)

- **001 mochii** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small starter, bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end and Section 6 small/fast value. Deliberately 800ms under baseline, above the s5.2 ~1.5s nervous floor (old 1200ms breached it). Keep at wiring.
- **002 tiidebiite** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small water starter evolution, bob + squash; 1600ms = s5.3 small/light/fast low end and Section 6 small/fast value. Deliberately under baseline, above the nervous floor. Keep at wiring.
- **003 aquariios** (hover_swim, 1800ms, delta -600ms) — HOLD_FLAGGED at wiring to 1800ms: HOLD / FLAGGED — ms UNCHANGED at wiring until Mars decides. Water starter evolution in hover_swim at the flyer/hoverer low end (1.8s), but no body-shape evidence on file settles flyer vs serpent/swimmer: if serpent/swimmer, the research row is 2.4-3.2s and the correct total would be 2400ms. Do NOT retime until Mars confirms body/motion (hover vs swim). Show-first item; audit continues regardless.
- **004 razorgater** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **005 chromejaww** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **006 reaperdile** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **007 tyrage** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **008 duneclaw** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **009 oblivirex** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **010 kittember** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **011 pyropaw** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **012 manticlaw** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath; C frame is the second distinct locked battle_front cell (mapped, not rendered) — timing unaffected by the mapped pose. 2400ms = calm baseline, inside grounded rows; keep at wiring.
- **013 pupbble** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end (1.6-2.0s) and Section 6 small/fast value. Deliberately 800ms under baseline, but above the s5.2 ~1.5s nervous floor (the old 1200ms breached it). Keep at wiring.
- **014 terradog** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **015 quakehound** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **016 squirmite** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end (1.6-2.0s) and Section 6 small/fast value. Deliberately 800ms under baseline, but above the s5.2 ~1.5s nervous floor (the old 1200ms breached it). Keep at wiring.
- **017 cocoonode** (static_crystal, 2200ms, delta -200ms) — KEEP: Static crystal, scale-only pulse (1.03/0.99), no translation, not a breath; 2200ms sits inside calm 2.0-3.0s (s5.2). No crystal row exists in s5.3, so the authored pulse cadence is kept and recorded rather than rounded to 2400ms; faster would read as flicker. Keep at wiring.
- **018 mothrix** (hover_swim, 1800ms, delta -600ms) — KEEP: Moth flyer, hover bob -3px + sway; 1800ms = low end of s5.3 flyer/hoverer 1.8-2.4s. Hover sine, not a ground breath hold. Keep at wiring.
- **019 zephling** (hover_swim, 1800ms, delta -600ms) — KEEP: Wind flyer, hover bob -3px + sway; 1800ms = low end of s5.3 flyer/hoverer 1.8-2.4s. Keep at wiring.
- **020 aerobeak** (hover_swim, 1800ms, delta -600ms) — KEEP: Mars 2026-10-25 ~22:15 CDT: Aerobeak idle APPROVED as-is, so 1800ms is kept as approved, not re-litigated. Flyer/hoverer low end (1.8s). The separate shadow-gap item is art, not timing. Keep at wiring.
- **021 stormtalon** (hover_swim, 1800ms, delta -600ms) — KEEP: Flyer (talon), hover bob -3px + sway; 1800ms = low end of s5.3 flyer/hoverer 1.8-2.4s. Keep at wiring.
- **022 finblade** (hover_swim, 1800ms, delta -600ms) — ADJUST_AT_WIRING at wiring to 2400ms: ADJUST AT WIRING 1800->2400ms (steps 450x4 -> 600x4, sine character unchanged). Swimmer body: research serpent/swimmer/gelatinous row is 2.4-3.2s, so the flyer low end (1.8s) contradicts its body. 2400ms = swimmer low end = calm baseline. Converges under the second reading too: Mars 2026-10-25 corrected that Finblade's idle has NO water and NEEDS a shadow (a grounded read), and 2400ms is inside grounded rows as well. NOT applied here — wiring step only.
- **023 megalochrome** (hover_swim, 1800ms, delta -600ms) — KEEP: Levitator (Mars-locked: no legs, engine shadow underneath); hover bob -3px + sway at flyer/hoverer low end 1800ms. Mars 2026-10-25: already HAS water (blue ripple rings), so no shadow/water owed; timing unaffected. Keep at wiring.
- **024 floatcalf** (float_hover, 1800ms, delta -600ms) — KEEP: Continuous hover bob -4px/+2px (vertical sine), not a ground breath hold; 1800ms = low end of s5.3 flyer/hoverer 1.8-2.4s. Keep at wiring.
- **025 astroleviathan** (hover_swim, 1800ms, delta -600ms) — ADJUST_AT_WIRING at wiring to 2800ms: ADJUST AT WIRING 1800->2800ms (steps 450x4 -> 700x4, sine character unchanged). Large leviathan serpent/swimmer: serpent/swimmer row 2.4-3.2s AND large/heavy row 2.8-3.5s both apply; 1800ms contradicts both. 2800ms = large/heavy low end and inside the serpent range (the overlap of the two rows). NOT applied here — wiring step only.
- **026 inklet** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end (1.6-2.0s) and Section 6 small/fast value. Deliberately 800ms under baseline, but above the s5.2 ~1.5s nervous floor (the old 1200ms breached it). Keep at wiring.
- **027 toxitacle** (hover_swim, 1800ms, delta -600ms) — ADJUST_AT_WIRING at wiring to 2400ms: ADJUST AT WIRING 1800->2400ms (steps 450x4 -> 600x4, sine character unchanged). Tentacle (gelatinous/swimmer) body: research serpent/swimmer/gelatinous row is 2.4-3.2s, so the flyer low end (1.8s) contradicts its body. 2400ms = swimmer/gelatinous low end = calm baseline. NOT applied here — wiring step only.
- **028 krakenox** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **029 punchkid** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **030 strikechamp** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded biped (suited = default look), bob -2px + breath; 2400ms = calm baseline, inside medium-biped 2.0-2.5s. Timing is shared across all three Strikechamp looks; looks differ, timing does not. Keep at wiring.
- **030 strikechamp_unsuited** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded biped (regular no-armor second look, helmeted lower-only), same 2400ms calm-baseline timing as suited; look variant only, no timing difference. Keep at wiring.
- **030 strikechamp_unsuited_full** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded biped (rare shiny variant ~10%, NOT the canonical regular look), same 2400ms calm-baseline timing; look variant only. Keep at wiring.
- **031 kickmaster** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **032 gearkid** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded mechanical stance, bob -2px + breath. Research has no machine row; 2400ms calm baseline is the neutral default, not a machine-specific claim. Keep at wiring; revisit only if a machine row is ever authored.
- **033 mechapion** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded mechanical stance, bob -2px + breath. Research has no machine row; 2400ms calm baseline is the neutral default, as for gearkid. Keep at wiring.
- **034 gorokappa** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **035 pebblefist** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **036 cragarm** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **037 terrapod** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **038 sproutle** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end (1.6-2.0s) and Section 6 small/fast value. Deliberately 800ms under baseline, but above the s5.2 ~1.5s nervous floor (the old 1200ms breached it). Keep at wiring.
- **039 shellguard** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath; 2400ms = calm baseline, inside quadruped 2.2-2.8s and calm 2.0-3.0s. Weight is not on file — if Shellguard is later weighed heavy it would move to 2800ms at wiring, but on current evidence 2400ms is not an error; keep at wiring.
- **040 dreadtoise** (heavy_slow, 2800ms, delta +400ms) — KEEP: Large/heavy slow deep whole-torso breath (bob -1px + scaleY 1.01); 2800ms = low end of s5.3 large/heavy 2.8-3.5s. NOTE: Section 6 table example for large/heavy is 3200ms; 2800ms is range-valid, so the range governs and 2800ms is kept, not an error. Deliberately 400ms over baseline. Keep at wiring.
- **041 pixilite** (small_bouncy, 1600ms, delta -800ms) — KEEP: Small bob -3px + squash (1.03 x 0.97); 1600ms = s5.3 small/light/fast low end (1.6-2.0s) and Section 6 small/fast value. Deliberately 800ms under baseline, but above the s5.2 ~1.5s nervous floor (the old 1200ms breached it). Keep at wiring.
- **042 wispkin** (float_hover, 1800ms, delta -600ms) — KEEP: Floating wisp, continuous hover bob -4px/+2px (vertical sine), not a ground breath hold; 1800ms = low end of s5.3 flyer/hoverer 1.8-2.4s. Keep at wiring.
- **043 duskfiend** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **044 ashemit** (seated, 2400ms, delta +0ms) — KEEP: Seated, minimal motion (shift -1px + breath 1.01); 2400ms = calm baseline exactly, no body reason to differ. Keep at wiring. (Separate art item — rembg/white-space — is not a timing change.)
- **045 pyromonk** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **046 yogiferno** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.
- **147 dorowani** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath; 2400ms = calm baseline, inside grounded rows. SEPARATE owed item, not a timing error: no Dorowani/Gabu rig idle-clip file was found locally, so this is baseline timing, NOT rig-derived. Keep at wiring.
- **148 gabu** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath; 2400ms = calm baseline, inside grounded rows. Rig-idle-clip note as dorowani: baseline timing, not rig-derived. Keep at wiring.
- **331 mythar** (grounded_standard, 2400ms, delta +0ms) — KEEP: Grounded bob -2px + breath scaleY 1.02; 2400ms = calm baseline, inside medium-biped 2.0-2.5s / quadruped 2.2-2.8s and calm 2.0-3.0s (s5.2/s5.3). No body reason to differ; keep at wiring.

## PNG verification (per manifest vs files on disk)

- Method: each manifest's 4 steps reference 3 distinct files (idle_a.png twice, idle_b.png, idle_c.png). Checked all 3 distinct files per creature for existence on disk. Zero-byte check: no zero-byte PNG was found in any idle dir.
- Result: 51/51 sets have 3/3 core PNGs present = 100%; 153/153 core files present. **Mismatch list: NONE for manifest-referenced PNGs (0/51 sets missing a referenced file).**
- The 12 dirs with MORE than 3 PNGs are not mismatches — the extras are variant files the manifest does not reference: aerobeak 9 (clean + shadowfree per frame), ashemit 12 (clean/clean2/clean3 per frame), razorgater 9 (clean/clean2 per frame), and chromejaww, duneclaw, floatcalf, megalochrome, mothrix, pyromonk, reaperdile, tyrage, zephling 6 each (clean per frame). Total: 153 core + 48 variants = 201 PNGs. Wiring must use the 3 core files (or an explicitly adopted clean variant, decided elsewhere — not by this timing pass).
- Frame-count note: 'frame count' here means 4 steps per loop (A, B, A, C), built from 3 distinct PNGs. Any count of '3 frames' vs '4 steps' is the same loop described two ways, not a discrepancy.

## What changes at wiring time (and what does NOT change here)

- ADJUST AT WIRING (3): finblade 1800→2400ms (600×4), astroleviathan 1800→2800ms (700×4), toxitacle 1800→2400ms (600×4). If these land, any registry copy embedding `cycleMs` must be updated for exactly these 3 slugs at the same time — that registry edit is the wiring PR's job, not this pass, and no registry file was touched here.
- HOLD (1): aquariios stays 1800ms until Mars confirms hover vs swim; candidate wiring value if swimmer is 2400ms. Show-first, not silently decided.
- KEEP (47): wire the current `cycle_ms` as-is, including heavy 2800ms (range-valid despite the Section 6 3200ms example) and Cocoonode 2200ms (pulse cadence, not rounded to 2400ms).
- Builder drift (carried forward, not fixed here): `_build_idle.py` still encodes hover_swim 1800ms for all 9 — a rerun would revert the 3 wiring adjustments unless the builder's hover_swim mapping is split (flyer vs swimmer) or the sidecars are treated as authoritative at wiring time.
- Silent retimes in this pass: 0/51. Every recommendation above is a recommendation; no `cycle_ms`, step duration, PNG, or registry value was edited.

