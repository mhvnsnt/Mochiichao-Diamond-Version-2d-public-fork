# World Wiring 1 — inkjs, easystarjs, Pixi adapter, IndexedDB saves, Tone jingles, Tiled maps, WFC isles, audio wiring

Additions only, no deletions. This PR pulls in open-source
libraries (licences re-checked from their package.json at
install, 2026-10-25) and wires them as adapters, not as a
rewrite of the game. React still owns UI/menus/dialogue
presentation; the game's own data model is unchanged.

## What was pulled, with licences verified at install
- inkjs 2.4.0 — MIT, zero dependencies, Compiler in
  ink-full. Dialogue: src/lib/wiring/dialogue/*.ink
  compiled to JSON, loaded by dialogue-ink.ts.
- easystarjs 0.4.4 — MIT. Pathfinding: pathfinding.ts.
- tone 15.1.22 — MIT. Jingles as data: tone-jingles.ts.
- idb 8.0.4 — ISC. IndexedDB save store: save-store.ts.
- pixi.js 8.22.0 — MIT, ALREADY in package.json on main.
  Adapter only: pixi-adapter.ts, WebGPU opt-in / WebGL2
  fallback, shadows on a separate layer (not baked).
- zustand 5.0.13 — MIT, ALREADY in package.json on main.
  Save store is ready for a Zustand slice in a follow-up;
  this PR does not change gameStore, to avoid clashing
  with v5.3 in flight.
- vitest 5.0.5 — MIT, @playwright/test 1.64.1,
  axe-core 4.14.0 — MPL-2.0. Tests: tests/wiring.test.ts
  (7 tests, passing locally), tests/e2e/smoke.spec.ts
  (Playwright, not run in this session — CI runs it).

## What was wired, with proof
- Ink: region1-truck-start.ink → compiled JSON, 14 lines
  end to end, 5 starter choices, variables clock_set /
  codex_get / sprint_boots all true at the end. Verified
  by running the Story in Node, not by counting lines.
- Pathfinding: grid path around a wall, null when the
  target tile is blocked, follower trails 3 steps back.
  Vitest 7/7 passing.
- Tiled: sector0.json validates as a town (heal + shop
  + sign, noWild note, exits to aeon_lab / route_1).
  Missing exit target fails validation — tested.
- WFC isles: same seed reproduces the same map;
  isleConnected() is a BFS check, and a generated isle
  that fails it is rejected, not shipped.
- Audio: audio-system.ts (from the goal file, 608 lines)
  is now in src/lib/, and audio-wiring.ts registers
  the PR #36 title/intro files. Boot pick is NOT made
  here: M1/M2/M3 are options only, caller picks.
- Tone jingles: victory / badge / level-up as note
  data, original notes only.

## What this PR does NOT do (follow-ups, not hidden)
- It does NOT change App.tsx, WorldEngine, gameStore,
  or BattleView, so it cannot clobber v5.3. The next
  PR swaps one call site at a time: DialogueBox ← Ink,
  NPC walks ← pathfinding, WorldEngine rendering ←
  Pixi adapter, saveSystem ← save-store.
- It does NOT wire trainer teams (needs SPECIES_DB
  promotion + 147/148 stats, both still open — see
  the confirmation list in the lane).
- It does NOT pick a boot sound, a ring-zone name,
  or dojo/E4/Champion names — those need Mars.
- Playwright smoke test is a file, not a run: the
  browser run is owed in CI / a playtest session.

## Decomp structure used (structure only, no copied files)
- FireRed scripts.inc pattern: lock → msgbox → flag
  → warp/battle, mirrored in Ink knots with variables.
- HeartGold title: 60-frame fade, mirrored in the
  audio manager's crossfade (already in audio-system).
- Pokemon tile movement is 4-directional: pathfinding
  diagonals are off by default.
- No Pokemon dialogue, names, art, music, or code
  is in this PR. Ink lines, map names, and jingle
  notes are Mochiichao-original.
- Shadows: separate layer, not baked into art.

## Deletions
NONE. package.json / package-lock.json are the only
modified files (dependency additions + test script);
every other file in this PR is new.
