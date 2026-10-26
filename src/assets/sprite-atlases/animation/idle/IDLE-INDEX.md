# IDLE LOOPS — all 51 sets (local staging, 2026-10-25 ~19:00 CDT)

Replaces the old "standing reuse" proposal (static, pending Mars confirm) with a
REAL loop per creature: 4 steps `[A, B, A, C]`, loop = true, built from the
creature's own locked battle_front cell. No AI-generated frames, no new art
files overwritten, no git / src/assets changes.

## Why transforms, not mapped second cells or AI frames

- Eye-check at 64px and enlarged (4x): overworld_front cells are near-identical
  to battle_front (Mochii cell00 vs cell01 differ only by crop/scale). Mapping
  them would fake a loop, not make one.
- Every set has exactly ONE distinct battle_front cell, except Manticlaw
  (cells 00 and 02 are distinct poses, 2903 px differ) — Manticlaw's C frame
  is that second locked cell, mapped, not rendered.
- AI generation for 51 sets would exceed the 4-per-response generation cap
  and risk likeness drift. Bob/breath transforms of the locked cell guarantee
  likeness and visibly move. If Mars still wants redrawn second poses for
  specific creatures, that is a per-creature generation job, not a blocker here.
- Per Mars 2026-10-25 corrections: movement/timing/techniques/structures are
  usable without proprietary hedging (not a logo, not Pikachu). The only line
  kept: no binary animation/model/sprite/music files from commercial games
  into the repo. No openly-licensed pull-agent files were present locally at
  build time; if they land, reconcile timing against them.

## Timing — RECONCILED 2026-10-25 (51/51 manifests carry timing_reconciliation)

Baseline: 2400ms = calm baseline, the midpoint of the research calm full-breath
cycle 2.0-3.0s (BATTLE-ANIMATION-RESEARCH.md s5.2; static idle 2-4s, s3c).
Research s5.3 FORBIDS one idle for all 51 creatures: variation by body /
temperament is required, and the chosen cycle is recorded per creature — so
classes below the baseline are deliberate, justified deviations, not errors,
while classes below every research range were retimed UP to the lowest
justified value, not silently kept. No PNG changed; only cycle_ms and step
durations in the manifests (and _build_idle.py, so a rerun preserves this).
Engine note (s5.2, not a manifest change): idle never stops during the
opponent's turn; the second creature's loop is offset 30-50% of a cycle.

| Class | Sets | Final cycle | Steps [A,B,A,C] ms | Change | Rationale |
|---|---|---|---|---|---|
| grounded_standard | 25 | 2400 ms | 700, 500, 700, 500 | RETIMED 1800->2400 | Adopts baseline exactly. Old 1800ms was below medium biped 2.0-2.5s and quadruped 2.2-2.8s (s5.3), with no justification for running faster than calm. |
| small_bouncy | 7 | 1600 ms | 400, 400, 400, 400 | RETIMED 1200->1600 | Deliberately faster than baseline, but old 1200ms breached the s5.2 floor (faster than ~1.5s looks nervous/broken at battle scale) and fell below small/light/fast 1.6-2.0s (s5.3). 1600ms = low end of that range, still 800ms faster than baseline — bouncy read kept, nervous read removed. |
| float_hover | 2 | 1800 ms | 450, 450, 450, 450 | KEPT 1800 | Deliberately faster than baseline: continuous hover sine bob, not a ground breath hold. 1800ms = low end of flyer/hoverer 1.8-2.4s (s5.3). |
| hover_swim | 9 | 1800 ms | 450, 450, 450, 450 | RETIMED 1400->1800 | Deliberately faster than baseline, but old 1400ms breached the s5.2 ~1.5s floor and fell below flyer/hoverer 1.8-2.4s (s5.3). 1800ms = flyer low end; hover/swim sine stays faster than a breath cycle without the nervous read. |
| seated | 1 | 2400 ms | 700, 500, 700, 500 | KEPT 2400 | Exactly the baseline: seated, minimal motion (-1px shift + 1.01 breath), no reason to differ. |
| static_crystal | 1 | 2200 ms | 600, 500, 600, 500 | KEPT 2200 | Near-baseline, 200ms under: crystal pulse cadence, not breath, scale-only, no translation. Inside calm 2.0-3.0s; faster would flicker. Kept and recorded, not silently rounded to 2400. |
| heavy_slow | 6 | 2800 ms | 800, 600, 800, 600 | KEPT 2800 | Deliberately slower than baseline: large/heavy slow deep whole-torso breath. 2800ms = low end of large/heavy 2.8-3.5s (s5.3). |

Retimed: 41/51 sets (grounded 25, hover_swim 9, small_bouncy 7). Kept with
justification: 10/51 sets (heavy 6, float_hover 2, seated 1, static_crystal 1).
Reconciliation: 51/51 = 100%. Dorowani/Gabu rig note unchanged: no rig
idle-clip file found locally, so their timing is the reconciled grounded
baseline, NOT invented from a rig.

## Timing (OLD, pre-reconciliation — kept for audit trail only, superseded above)

| Class | Sets | Cycle | Steps [A,B,A,C] ms | Motion |
|---|---|---|---|---|
| grounded_standard | 25 | 1800 ms | 500, 400, 500, 400 | bob −2px + breath scaleY 1.02, bottom-anchored |
| small_bouncy | 7 | 1200 ms | 300, 300, 300, 300 | bob −3px + squash (1.03 × 0.97) |
| float_hover | 2 | 1800 ms | 450, 450, 450, 450 | float bob −4px / +2px |
| hover_swim | 9 | 1400 ms | 350, 350, 350, 350 | hover bob −3px + sway (+1px, +1px) |
| seated | 1 | 2400 ms | 700, 500, 700, 500 | seated shift −1px + breath 1.01 |
| static_crystal | 1 | 2200 ms | 600, 500, 600, 500 | crystal pulse scale 1.03 / 0.99, no translation |
| heavy_slow | 6 | 2800 ms | 800, 600, 800, 600 | slow breath, bob −1px |

Class members:
- float_hover: wispkin, floatcalf
- hover_swim: zephling, aerobeak, stormtalon, finblade, megalochrome, astroleviathan, aquariios, mothrix, toxitacle
- seated: ashemit
- static_crystal: cocoonode
- heavy_slow: pebblefist, cragarm, dreadtoise, gorokappa, oblivirex, krakenox
- small_bouncy: mochii, pupbble, squirmite, pixilite, inklet, sproutle, tiidebiite
- grounded_standard: all other 25 sets, incl. dorowani, gabu (no rig clip file
  found locally — dorowani-gabu-pulled/ holds only a README — so standard
  grounded timing is used and flagged, not invented from a rig)

## Strikechamp FINAL structure (Mars 2026-10-25 ~19:01 CDT)

- strikechamp (suited) = default look.
- strikechamp_unsuited (helmeted lower-only: bare chest, red pants, helmet) =
  REGULAR no-armor second look, the one Mars likes more.
- strikechamp_unsuited_full (no-helmet full unsuited: face showing, red suit) =
  RARE SHINY VARIANT (~10%). NOT canonical, NOT the regular second look.
- Recorded in all three idle manifests AND in the three existing
  `animation/<name>.animation.json` files (`look_structure` field + pointer
  to the real idle manifest). No full-unsuited-as-canonical claim remains
  in any animation manifest.

## Files

- Per creature: `animation/idle/<creature>/<creature>.idle.json` +
  `idle_a.png` (locked battle_front), `idle_b.png` (bob), `idle_c.png`
  (breath / mapped Manticlaw second pose). All PNGs 64×64 RGBA.
- Builder (rerunnable, local only): `animation/idle/_build_idle.py`
- Machine-readable verification: `animation/idle/IDLE-COVERAGE-REPORT.json`
  (alpha px + A-vs-B / A-vs-C pixel diffs per creature; all B/C differ
  from A, all diffs are small transform-scale, none are 0 or whole-sprite).

## Counts

- Idle loops delivered: 51/51 = 100%
- Frame files: 153 (51 × 3), manifests: 51
- Mapped locked cells: 51 battle_front A frames + 1 Manticlaw C frame
- Transform-rendered frames: 101 (51 B + 50 C)
- AI-generated frames: 0 (deliberate, see above)
- Eye-check: enlarged 4× contact sheet verified for mochii, wispkin,
  cocoonode, ashemit, zephling, strikechamp_unsuited, manticlaw — all read
  as idle (bob/breath/hover/pulse), not attack, not walk. Lesson applied
  from the approved Mochii hurt pilot: check enlarged before flagging
  anything (the old "oval arm" read was wrong — arms folded to front,
  hands together).

## Remains (idle only)

- Timing reconciliation: DONE 2026-10-25, 51/51 = 100% (see reconciled table
  above; supersedes the old timing table below it).
- Optional per-creature redrawn second poses (AI generation) — 0/51 done,
  not required for a moving loop, only if Mars wants redrawn poses.
- Dorowani/Gabu rig-idle-clip timing — 0/2, no clip file found locally.
- Push to repo / src/assets wiring — 0%, deliberately NOT done here
  (local staging only, per brief).
