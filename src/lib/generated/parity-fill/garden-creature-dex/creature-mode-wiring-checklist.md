# Creature Mode wiring checklist — Dorowani/Gabu only today (slice 6, STAGED)

**NOT live wiring. NOT playtested. NOT a commit/PR.** This checklist is staged
for the coordinator; wiring happens in a later slice after Phase 1 merges
(Phase 3 wires after Phase 1 merges, per Pivot Phase 2 note).

## 0. Clone-staleness warning — read first

- This work clone is on branch `feature/unified-data-sprites-2.5d` at `11e9a3b`
  (pre-PR #72). Its `CreatureModeView.tsx` is **pass-1 only**: tile-step
  movement, 800 ms flat cooldown, 500 ms dodge, fixed training dummy,
  `Math.floor(move.bp / 2)` damage — and its header says so itself.
- The parity report (§22) describes merged pass 2+3 (PR #72: smooth movement,
  easystar A*, cooldown table, Garden +9% sharing, Guardian persistence,
  checklist 23/23) and pass 4 (PR #87: hitstop 90 ms with HP draining after it,
  tag-team pack engagement 5 s, territorial strafe).
- The task's `docs/creature-mode-pass2/3/4.md` files were **NOT found in this
  clone**, and `creatureCooldowns.ts` was **NOT found in this clone** either.
  The 8 playtest steps below are taken from the parity report §22 + task text,
  NOT re-verified from pass3/pass4 docs on disk here.
- **Coordinator must verify the pass2/3/4 state against main before wiring.**
  Do NOT wire from this clone's pass-1 view as if it were pass 4.

## 1. Walk-sheet wiring — Dorowani (#147) and Gabu (#148) ONLY today

Per Pivot Phase 2 (2026-10-26, staged, NO PR): Dorowani 13 locked cells,
Gabu 20 locked cells; idle/hurt/attacks 100% both except Dorowani V3 mouths
0/4 (no front mouth line — eyes-only ships, Mars decision owed); Gabu V3 4/4
stands untouched; game-path mapping 8/8 bake files → locked 2D cells staged at
`sprite-art/animation/expanded-scope/pivot-2d-20261026/`.

CORRECTION 2026-10-26 (late background find, verified after the first
report): the staging path DOES exist — just outside the fresh-start clone, at
`~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/pivot-2d-20261026/`
(manifest `pivot-2d-20261026-manifest.json`, mapping
`REPLACEMENT-MAPPING-2026-10-26.md`, 6 files each under `dorowani/` and `gabu/`).
The mapping doc's §1 lists 8/8 game-path replacements (Dorowani atlas
`dorowani_atlas_64_locked.png`, 384x192, 13 cells; Gabu atlas
`gabu_atlas_64_locked.png`, 384x256, 20 cells; locked manifests in
`sprite-art/game-ready/<creature>/`). Item 1 below is therefore VERIFIED;
items 2–8 remain NEED TO MAKE / BLOCKED — the mapping exists, the wiring does not.

| # | Wiring item | Dorowani | Gabu | Status |
|---|---|---|---|---|
| 1 | Confirm locked 2D cell set exists at Phase 2 staging path | 13 cells | 20 cells | VERIFIED 2026-10-26 (manifest + mapping doc; path is `mochiichao-work/sprite-art/...`, not inside the fresh-start clone) |
| 2 | Map walk-sheet frames to Creature Mode player sprite (top-down walk; battle front/back sprites are NOT reused for walking — creature-mode-spec §4) | — | — | NEED TO MAKE |
| 3 | Idle loop wired as player-creature idle | 100% per Phase 2 | 100% per Phase 2 | NEED TO MAKE (verify) |
| 4 | Hurt + attack frames wired | 100% per Phase 2 | 100% per Phase 2 | NEED TO MAKE (verify) |
| 5 | V3 mouths: Dorowani 0/4 — ship eyes-only until Mars rules; Gabu 4/4 untouched | 0/4, Mars decision owed | 4/4 | BLOCKED (Dorowani mouths) |
| 6 | Stats wired (battle stats, level, moves) | Mars-only, owed | Mars-only, owed | BLOCKED |
| 7 | Creature Mode entry: playable as party member via Data Tape Transform list | — | — | NEED TO MAKE (after 1–6) |
| 8 | Guardian assignment path (Guardian = creature defending a Garden) | — | — | NEED TO MAKE (after 1–6) |

Counts: walk-sheet wiring 1/8 items verified (12%), 0/8 wired (0% done).
No other species are in scope today — the other 49 walk sets are NOT this slice.

## 2. Live-playtest step list (from pass3/pass4 per parity §22) — 0/8 passed

**NOT playtested. Do NOT claim playtested.** Playtest on a Pages build
containing PR #87, by named step:

| # | Step | What passes | Status |
|---|---|---|---|
| 1 | Glide | Glide movement works in Creature Mode | 0 — NOT verified |
| 2 | Sprint stamina | Sprint drains stamina, refills at rest | 0 — NOT verified |
| 3 | Razorgater pathing around a building | Pathing (easystar A*) routes around a building, no clipping | 0 — NOT verified |
| 4 | Garden bonus HUD | Garden +9% sharing shown in HUD | 0 — NOT verified |
| 5 | Guardian save/load | Guardian assignment persists across save/load | 0 — NOT verified |
| 6 | Hitstop HP-after | Hitstop 90 ms, HP drains AFTER the hitstop | 0 — NOT verified |
| 7 | Pack engagement | Tag-team pack engagement 5 s | 0 — NOT verified |
| 8 | Strafe | Territorial strafe behaviour | 0 — NOT verified |

**Live playtest: 0/8 = 0% done.** Code (per parity report) 70% ESTIMATE;
playtest is a separate denominator and it is 0%.

## 3. Provisional numbers — do NOT treat as canon

- Cooldown table numbers are **PROVISIONAL** (shown 2026-10-25, not canon
  until Mars approves a change). `creatureCooldowns.ts` was not found in this
  clone, so no cooldown numbers are reproduced here at all.
- Creature Mode damage in this clone's view is `Math.floor(move.bp / 2)` on a
  dummy — placeholder shape, NOT the Trainer damage formula and NOT canon.
- Garden bonus shared with Creature Mode is capped +9% and does NOT stack
  with Trainer Mode's bonus (creature-mode-spec §5) — that cap IS canon.

## 4. Mars-only blockers for this checklist

1. Dorowani stats + Gabu stats (incl. starter stats for 147/148).
2. Dorowani V3 mouths (0/4 — no front mouth line; eyes-only ships unless Mars rules otherwise).
3. Cooldown table numbers (provisional → canon approval).
4. Walk-gate pick (parity §14, still owed).
