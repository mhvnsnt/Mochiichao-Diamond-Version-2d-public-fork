# Engine decision — pass 1 (mod layer, not a rewrite)

## The layer split (Mars's "like a mod" path, confirmed 2026-10-25)

- **BASE LAYER — the actual files we already have.** The existing
  fresh-start game code (App, WorldEngine, BattleView, store, maps,
  species/moves), the decomp JSONs now on main (FireRed, HeartGold,
  Black 2, Gen 5+, pret Batch A Emerald/Ruby/Crystal/Yellow/Diamond),
  the Dorowani/Gabu sheets, the specs/docs. Pass 1 patches and extends
  this base. It does NOT rewrite the game from scratch, does NOT create
  a new repo, and does NOT replace the store, save format, maps, or
  turn-based damage logic.
- **MOD LAYER — Mochiichao's own original code/data on top.** This is
  what ships: the PixiJS renderer, the sheet loader, the real menus,
  the roster/moves/maps as they are unified, and later Garden / Arena /
  Creature systems. Everything in `src/components/game/` in pass 1 is
  mod layer.
- **REFERENCE LAYER — decomp data shapes only.** Stat / move /
  learnset / trainer / encounter shapes, sprite cell + palette systems,
  and menu/battle structure, read at build/dev time for validation and
  design. Reference JSONs are never imported as playable Mochiichao
  content: no Pokemon species, move, sprite, or code is in the game
  roster. Validation lives in `src/lib/validate-reference.ts` and runs
  as `npm run validate:reference`.
- **PLACEHOLDER LAYER — local only, never committed, never shipped.**
  Gap-fillers for art/data not yet original: coloured silhouette +
  name + manifest stats, drawn PixiJS tiles, bob/transform fallbacks
  for walk/attack/hit/faint views. Tracked in
  `docs/placeholder-manifest.md` (pass 1 count: 50 — 49 creature sheet
  sets + 1 tile art set). A releasable build is placeholder count 0.
  Editing an official file would not make it proprietary; replacement
  with original work is the clean step. No official Nintendo/Game
  Freak art, code, music, ROM, or leaked source is in this tree,
  private or public, mod or not.

## Why PixiJS v8 (and why not the alternatives)

- **PixiJS v8** is the Phase 2 renderer, world canvas + battle canvas
  only. It is a 2D sprite renderer with a scene graph, camera-by-
  container (pivot/scale/position), and texture atlases — exactly the
  "looks 3D, runs 2D" contract: the game eats 64x64 sheet cells, the
  renderer draws them at depth-sorted positions with a following
  camera. It drops into the existing React app without a rewrite.
- **Not Phaser:** a full game framework would want to own the loop,
  input, scenes, and state. That is a heavier rewrite of the base
  layer for no pass-1 benefit; PixiJS lets React keep menus/HUD and
  Zustand keep state.
- **Not Three.js:** true 3D in-game is a later fork only, never this
  plan. Sheets baked from 3D models give the 3D look with 2D delivery.
- **Not a voxel / Minecraft world:** settled direction. Tile-based
  top-down world, turn-based battles, HeartGold / Black-White / X-Y
  style.

## Who owns what

- **React** owns: title, main menu, pause menu, Roster, Shop, battle
  move menu, HUD, dialog, save/load UI. All of it full-viewport
  (`100dvh`, safe-area insets), portrait-mobile first.
- **PixiJS** owns: the world picture (tiles, figures, sheets, camera)
  and the battle arena picture (creatures, lunge/projectile, flash,
  recoil, shake). HP bars and names are React, above the canvas, and
  never move with the camera/shake.
- **Zustand (`store/gameStore`)** owns: party, wallet, inventory,
  badges, dex, map/position, save slot. Unchanged format; saves still
  go through `lib/saveSystem` (localStorage).

## Sheet format the engine consumes

- 192x64 PNG, three 64x64 cells: front x=0, back x=64, side x=128.
- JSON manifest per creature (cell size, frame x/y, views done/missing).
- Battle mapping: opponent = front, player = back. World mapping:
  down = front, up = back, left/right = side (left mirrored in code
  until a second side angle is baked).
- Fallback, per creature with no sheet: original coloured silhouette
  (type colour) + name, labelled "Art in progress" in Roster. Swapping
  a placeholder for an original sheet is a file swap — no code change.

## Menus, menu by menu — placement reference and Mochiichao replacement

"Placement reference" means layout/structure only. No official art,
text, or code was copied into the game tree for any menu below.

1. **TITLE** — Reference: the existing title-screen concept already
   in the base (full-screen, logo, PRESS ANY KEY). No decomp menu
   file was needed for this one, and none is claimed. Replacement:
   MOCHII STUDIOS / MOCHIICHAO / DIAMOND VERSION, game font, drawn
   trainer figure, gradient panel — no terminal frame, no mono.
2. **MAIN MENU** — Reference: Pokemon-style X-menu structure —
   vertical list in a game panel (the in-game menu structure as it
   appears across the HeartGold / Black-White decomp menu shapes in
   the reference JSONs: list + panel + cursor, not a terminal table).
   Replacement: Continue / New Game / Save Files / Settings
   (placeholder, marked "coming soon") in a game panel with game
   buttons. Roster lives in-game (pause/HUD), as in the reference
   games' X-menu, not on the title menu.
3. **PAUSE / IN-GAME MENU** — Reference: same X-menu panel, overlaid
   on the world (world still visible behind, dimmed) — the standard
   in-game menu placement from the same reference structure.
   Replacement: Team / Shop / Save Game / Load-Save Files / Quit to
   Title / Back to Game, as game buttons over the dimmed PixiJS world.
4. **BATTLE HUD** — Reference: Arena spec §3 (singles layout) +
   Black-White battle layout shape: enemy name/HP top-left, player
   name/HP/numbers bottom-right, move menu as a bottom panel.
   Replacement: React HP panels above the PixiJS arena (never moving
   with shake), 4 type-coloured move buttons + Luigi Cube + Flee in
   the bottom panel, battle log as plain game dialogue text (no
   timestamps, no `>` prompts, no mono log).
5. **ROSTER** — Reference: HeartGold / Black-White party-screen
   structure: list on one side, detail panel on the other.
   Replacement: party list (portrait, name, level, HP bar) + detail
   panel (large sheet/silhouette, name, level, HP numbers, types,
   description, stats, moves). No Grid Asset Forge panel anywhere in
   it — that placeholder generator is not a player feature.
6. **SHOP** — Reference: same panel style as Roster/Battle (item list
   + inventory panel), following the reference games' shop structure
   (list, price, buy/sell, count). Replacement: Syndicate Kiosk item
   cards with prices in CR, Buy buttons, Bag panel with counts and
   Sell (half price) buttons.

## Battle timeline (Arena spec, simplified for pass 1)

Cue (move-name banner, React) -> windup (scale pulse) -> approach:
PHYSICAL attacker lunges to the target with BOTH creatures on screen
at impact (PBR-1); SPECIAL attacker stays and a coloured projectile
travels to the target; STATUS glows on the target -> impact: HP drains
at the triggered frame, target flashes white, recoils, stage shakes ->
return to base. Total per attack ~1.3–1.8s in pass 1 (spec budget
108–192 frames at 60fps is the target for the full Arena pass).
No per-move creature art: front/back sheets + element-coloured VFX.

## What pass 1 deliberately does NOT do

- No roster unify (starter naming, Pebblefist HP, Beast/Flora/Neon
  still open — nothing in this pass resolves or hard-codes them).
- No Garden, Ring Capture, Creature Mode, audio, doubles layout, or
  full per-element VFX library.
- No walk/attack/hit/faint poses (fallback transforms, tracked in
  the placeholder manifest).
- No Dorowani/Gabu GLBs in the game tree (sheets + manifests only).
- No decomp Pokemon content as playable content (see reference layer).
