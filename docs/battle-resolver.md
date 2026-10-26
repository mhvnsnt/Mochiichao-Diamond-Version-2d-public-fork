# Battle resolver — Showdown-style data-table architecture (plan §1b / §2f)

Status: resolver code shipped in this PR, NOT wired into live BattleView.
BattleView.tsx keeps its inline player-then-enemy damage path untouched;
a wiring PR must route it through `resolveTurn` and pick ONE type chart
(see chart warning below). Do NOT claim playable until a live win-path
playtest passes (VICTORY banner + Continue in a browser).

## Files in this PR (additions only, 0 deletions)

- `src/lib/battleResolver.ts` — pure resolver + legacy adapters.
- `src/lib/battleTypeChart.ts` — generated True-Elements chart + conflict/owed lists.
- `src/lib/battleFrames.ts` — PixiJS v8 NineSlice frame wiring to the FRAME system.
- `docs/battle-resolver.md` — this file.
- `docs/quickest-2026-checklist.md` — plan items scored in impact order.

## Turn loop (plan: Speed → action → target → resolve → win/lose)

| Step | Resolver | Wired into live BattleView |
|---|---|---|
| Order by priority, then effective Speed (stage × paralysis ½) | 1/1 | 0/1 |
| Action select (move / pass / run as data) | 1/1 | 0/1 (BattleView has its own move UI) |
| Target select (foe / self; fainted target fails, never invented) | 1/1 | 0/1 |
| Resolve (accuracy → damage → secondary → recoil → faint) | 1/1 | 0/1 |
| Win/lose check after every action + turn end | 1/1 | 0/1 (BattleView checks only after its own two phases) |
| **Resolver steps total** | **5/5 = 100%** | **0/5 = 0%** |

## Damage and effects — coverage with counts

- Damage formula: identical to BattleView.executeDamage (level formula,
  STAB ×1.5, crit ×1.5 at 6% base, roll 85–100%). HIGH_CRIT doubles the
  base crit rate to 12% — labelled a resolver rule, not canon data.
- Moves convertible by the legacy adapter: 36/36 = 100% (moves.ts).
- Effect strings mapped by table (not per-move code): 13/13 = 100%
  (NONE, BURN, PARALYSIS, POISON, SPDEF_DOWN1, DEF_DOWN1, ACC_DOWN1,
  SPE_DOWN1, RECOIL_25, MULTI_HIT, HIGH_CRIT, CHARGE_TURN, FLINCH).
- Status-category moves in moves.ts: 0/36 = 0% — none exist, so the
  resolver's Status path is code-complete but content-empty (owed: a
  status move, not a guess).
- End-of-turn ticks: burn/poison 1/16 max HP (resolver rule, labelled).
- Switching: 0/1 — the resolver has no switch action yet (BattleView's
  SHIFT/SET switch UI is separate and untouched). Owed.
- AI opponent choice: 0/1 — BattleView picks an enemy move elsewhere;
  the resolver accepts actions as input and does not choose them. Owed.
- Double battles: 0/1. Capture inside the resolver: 0/1 (BattleView's
  Luigi Cube catch is separate). Both owed, neither faked.

## Type chart — read this before wiring

- Legacy chart (constants.ts, 18 types) is what live BattleView uses today.
- True-Elements chart (battleTypeChart.ts, 12 elements) is DERIVED from
  it by the unification-map §3 mapping. 144 cells: 76/144 = 53% sourced
  (27 non-neutral + 49 agreed-neutral), 24/144 = 17% conflict-neutral
  (CONFLICT_CELLS — Mars decisions, e.g. Umbral vs Normal loses GHOST
  immunity in the merge), 44/144 = 31% owed (OWED_CELLS — every Aero
  and Deep cell, no legacy source, no invented matchup).
- Legacy types with NO True mapping (unification-map proposes none):
  ELECTRIC, ICE, POISON, FLYING, FAIRY. A legacy move of those types
  used through the True chart resolves at ×1.0 with `typeChartMissing`
  only if its type row is absent; conflict/owed cells at ×1.0 are NOT
  runtime-flagged — read the lists. Wiring must pick ONE chart.
- Open Mars decisions that block a final chart (from unification-map):
  Beast, Silk, Wind, Neon, Flora element rulings (5/5 = 100% still open
  at this PR's base) + Pebblefist HP. None are decided here.

## NineSlice frames

- PixiJS v8 NineSlicePlane API: wired 1/1 (`createBattleFrame` — corners
  fixed at `insets`, only centre/edges scale, so pixel-art edges are
  never stretched).
- Frame defs: 3/3 (battle-command, battle-dialogue, battle-hud), resolved
  from live settings via hudCustom.menuFrame/menuFrameAccent (BATTLE key)
  so Pixi and DOM battle frames follow the same FRAME row.
- Texture-backed frames: 0/3 = 0% — no 9-slice frame PNG exists in the
  repo (FRAME 1-20 are accent colours/radii, StdWindow is CSS). Insets
  are placeholder 8px until a real PNG's corner size is measured.
- Wired into PixiBattleCanvas: 0/1 — owed follow-up, not claimed.

## How to adopt (follow-up wiring PR, not this one)

1. Build ResolverBattlers via `instanceToResolverBattler` (player + foe).
2. Convert moves via `legacyMoveToResolverMove` (or, after PR #98
   merges, from `src/data/core/moves.json` — same plan shape; the
   resolver takes tables as input, so no resolver change is needed).
3. Call `resolveTurn` per turn; apply its returned battler HP/stages/
   status to the store; render its events through battleIntegration.
4. Pick ONE chart (legacy constants.ts OR TRUE_TYPE_CHART) and delete
   the other path from live play — never run both in one battle.
5. Run the live win-path playtest (title → battle → VICTORY + Continue)
   before claiming playable.

## What this PR deliberately does NOT do

- No Pokemon species, moves, types, or stats. All values come from
  main-branch Mochiichao files (species.ts, moves.ts, constants.ts).
- No edits to BattleView, battleIntegration, battleTreatments, species,
  moves, constants, or any existing file. No deletions. No Pages publish.
- No new species stats or move powers. Gaps above are owed with counts.
