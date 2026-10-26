# Battle resolver — Showdown-style data-table architecture (plan §1b / §2f)

Status: resolver code shipped in PR #107, and now WIRED into live
BattleView by the wiring follow-up PR (see "BattleView wiring" below).
BattleView no longer has its own inline player-then-enemy damage path;
its turns go through `resolveTurn` on the legacy chart (see chart
warning below — the legacy-vs-True choice is still a Mars decision).
Do NOT claim playable until a live win-path playtest passes (VICTORY
banner + Continue in a browser) — that playtest is still owed.

## Files in this PR (additions only, 0 deletions)

- `src/lib/battleResolver.ts` — pure resolver + legacy adapters.
- `src/lib/battleTypeChart.ts` — generated True-Elements chart + conflict/owed lists.
- `src/lib/battleFrames.ts` — PixiJS v8 NineSlice frame wiring to the FRAME system.
- `docs/battle-resolver.md` — this file.
- `docs/quickest-2026-checklist.md` — plan items scored in impact order.

## Turn loop (plan: Speed → action → target → resolve → win/lose)

| Step | Resolver | Wired into live BattleView |
|---|---|---|
| Order by priority, then effective Speed (stage × paralysis ½) | 1/1 | 1/1 |
| Action select (move / pass / run as data) | 1/1 | 1/1 (move UI + pass for the catch follow-up; run/flee stay in BattleView) |
| Target select (foe / self; fainted target fails, never invented) | 1/1 | 1/1 |
| Resolve (accuracy → damage → secondary → recoil → faint) | 1/1 | 1/1 |
| Win/lose check after every action + turn end | 1/1 | 1/1 (centralised end-of-turn handling on resolver final HPs) |
| **Resolver steps total** | **5/5 = 100%** | **5/5 = 100%** |

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

## How to adopt (follow-up wiring PR — steps 1–4 done there, step 5 owed)

1. Build ResolverBattlers via `instanceToResolverBattler` (player + foe)
   — done, via `battleWiring.makeResolverBattler` (per-battle carried
   stages/status/volatile; HP to the store/state, stages/status kept
   in the battle ref, not the store).
2. Convert moves via `legacyMoveToResolverMove` (or, after PR #98
   merges, from `src/data/core/moves.json` — same plan shape; the
   resolver takes tables as input, so no resolver change is needed)
   — done, via `battleWiring.buildLegacyMoveTable`.
3. Call `resolveTurn` per turn; apply its returned battler HP/stages/
   status; render its events — done (events play through the Pixi
   pipeline; HP applied at impact + final tick sync).
4. Pick ONE chart (legacy constants.ts OR TRUE_TYPE_CHART) and delete
   the other path from live play — never run both in one battle —
   done for live play (legacy chart selected; True chart unreferenced
   by BattleView, kept in repo pending the Mars decision — see the
   wiring section above).
5. Run the live win-path playtest (title → battle → VICTORY + Continue)
   before claiming playable — STILL OWED (coordinator owns Pages +
   playtest sequencing).

## BattleView wiring (follow-up PR — what changed, what did not)

- Files: `src/lib/battleWiring.ts` (new adapter: legacy chart +
  move table + per-battle battler builder) and `src/components/views/
  BattleView.tsx` (turn flow only) + this doc's status table.
- Chart: live play uses the LEGACY constants.ts chart (probed 18×18
  from `calcTypeMultiplier` — the chart BattleView already used, so no
  matchup changes). The True-Elements chart is NOT referenced by
  BattleView; it stays in the repo unused by live play pending the Mars
  decision. Only one chart runs in any battle.
- Turn flow: one `resolveTurn` per turn — player move + BattleView's
  existing random enemy move (enemy choice stays in BattleView; the
  resolver does not choose moves). The catch break-free follow-up is a
  resolver turn with a player pass + enemy move. Events play in
  resolver order through the existing Pixi impact/done pipeline
  (damage/miss events animate, HP drains at impact; other events are
  log-only). BATTLE SCENE OFF applies the same result directly.
- State scope: stat stages, status and charging state are carried in a
  per-battle BattleView ref (reset on switch-in and battle start) and
  are never written back to the store; PP is fed to the resolver but
  likewise never written back (PP write-back would invent a depletion
  mechanic with no restore path — owed as a follow-up decision).
- Unchanged: catch (Luigi Cube), flee, SHIFT/SET switch UI, Data
  Fusion (fused stats feed the player battler), EXP/wallet amounts
  (50 Credits on victory), HUD and move buttons. The old inline
  `executeDamage` was deleted after its formula was verified identical
  to `calculateDamage` at stage 0 (972/972 tested cases; the only
  labelled divergences are the resolver's own rules: HIGH_CRIT 12%,
  burn halving Physical, accuracy rolls, secondaries, 1/16 ticks).
- Still owed after wiring (not invented here): resolver switching
  action, enemy AI choice, double battles, capture inside the
  resolver, a status move (0/36 moves are Status), PP write-back
  decision, NineSlice texture PNG + PixiBattleCanvas frame wiring
  (0/3 textures, no PNG exists), the legacy-vs-True chart decision
  with Beast/Silk/Wind/Neon/Flora rulings and Pebblefist HP, and the
  live win-path playtest (VICTORY + Continue in a browser).

## What this PR deliberately does NOT do

- No Pokemon species, moves, types, or stats. All values come from
  main-branch Mochiichao files (species.ts, moves.ts, constants.ts).
- No edits to BattleView, battleIntegration, battleTreatments, species,
  moves, constants, or any existing file. No deletions. No Pages publish.
- No new species stats or move powers. Gaps above are owed with counts.
