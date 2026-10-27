# Playable Slice 1 — ready checklist (from the game files, not guesses)

Goal Mars set 2026-10-25: play through the first few routes/towns,
catch a few Mochiichao, fight a few trainers, explore, with good
UX/UI/menus/gameplay. This is the gap audit + what to finish first.

## What ALREADY exists in the game files (FullWorldMaps.ts, verified)
- Sector 0 — Boot Harbor: Mom, Hex, Technology Enthusiast,
  route-block NPCs (noStarter gate).
- Aeon's Lab: Prof Aeon, Mochiko, Hex lab battle, 5 starter balls
  (Mochii 001, Razorgater 004, Tyrage 007, Kittember 010, Sproutle 038),
  Dorowani 147 / Gabu 148 display only.
- Route 1.0 — Greenfield Path: 4 trainers (Youngster Jay/Sproutle,
  Lass Amy/Mochii, Hiker Dan/Tyrage, Bug Catcher Rick/Squirmite),
  wild pool Sproutle/Mochii/Kittember/Zephling, tall-grass encounters.
- Silicon Town + MochiiPlex: heal nurse, shop clerk.
- Silicon Town: Dojo Acolyte, Town Girl, Old Man (Mythar lore).
- Dojo 1 — The Core Gate: 4 acolytes (Ken/Ren/Shin/Ryu) +
  Master Lin boss (Dreadtoise 039, reward Core Fragment).
- The Dark Forest: Hacker Grunt (Liberation Front), wild Kittember.
- Cave of Echoes, Neon City, etc. exist as later maps — NOT slice 1.

So slice 1 is NOT "build a world from scratch" — it is finish,
clean, and wire what is already mapped, in this order.

## Gaps that block "playable + looks good" (in priority order)
1. NPCs are EMOJI, not people. FullWorldMaps uses sprite:"👩","😤",
   "🥋", etc. for Mom/Hex/Aeon/Mochiko/trainers. Human Characters
   lane has Player A v1 in-game + Player D v2, but NPC portraits /
   in-game sheets for Mom, Aeon, Mochiko, Hex, Youngster/Lass/Hiker/
   Bug Catcher, Dojo acolytes, Master Lin are NOT wired into
   WorldEngine. Fix: wire humanSheets portraits + in-game sheets
   where they exist, silhouette placeholder where they do not —
   never emoji in the playable build. This is the single biggest
   "looks ugly" gap for slice 1.
2. Creature sheets for slice 1 are READY locally, not all on main
   in playable form. sprite-art/2d-sheets/ has 44 folders, including
   ALL slice-1 creatures: mochii, razorgater, tyrage, kittember,
   sproutle, zephling, squirmite, dreadtoise. Check each is a
   complete 3-sheet set (main + angles + lighting) under the
   LIKENESS-RULE, then PR the slice-1 set first — do NOT wait for
   all 47 to be perfect before slice 1 is playable.
3. Dorowani 147 / Gabu 148 are DISPLAY ONLY in the lab ("stats not
   set yet, not choosable"). That is correct for slice 1 (Gen 2
   starters, later) — do NOT make them choosable to fill a gap, and
   do NOT invent stats. Their display text must say Gen 2 / later,
   not "not set yet" in player-facing text.
4. Trainer / wild stats in FullWorldMaps are HAND-WRITTEN in the
   map file (e.g. Sproutle 35/35/35/50, Mochii 38/38/35/45) and use
   OLD type names (Water/Grass/Fire/Steel/Earth/Bug/Flying), NOT
   the 12 True Elements and NOT the decomp-extracted stats.
   Fix: map each slice-1 species to its canon True Element and to
   species.ts / decomp stats where they exist, and flag every
   hand-written number as placeholder in the file — do not present
   them as canon. Pebblefist HP 45 is still an unconfirmed guess
   (not slice 1, do not use it here).
5. Flow gates exist but are not all wired to the v4 flow: Mom-first
   dialogue exists in WorldEngine, route block exists, Hex lab
   battle exists, starter choice exists, but the v4 sequence
   (home -> Mom -> lab -> starter -> Hex battle -> gifts -> route
   open -> Silicon Town -> Dojo 1) must be playtested end-to-end
   on Pages, with the dialogue system (typewriter + portrait + ▼)
   as the story carrier, not the scrolling log.
6. Menus/UI: v4 audit still pending — one frame, one font, help
   lines, no mono/brackets/emoji/footers, across Roster/Shop/PC/
   Battle. Slice 1 menus are: main menu, pause menu, battle, roster,
   shop, PC, save. Garden/Arena/Creature/Ring/Cheat are NOT slice 1
   — they stay, but they do not block slice 1.

## Open-source + modding pulls for worlds (100% legal, already in repo or standard)
- Tiled (.tmx) map format: used by Tuxemon (GPL-3.0, JSON data,
  Tiled maps, scriptable dialog) and by LITIENGINE (free/open
  Java 2D engine, Tiled .tmx support, spritesheet animations,
  lighting, particles). Mochiichao world maps are currently in
  TypeScript (FullWorldMaps.ts) — the pull is the FORMAT lesson:
  keep maps as data (tiles, zones, NPCs, encounters, trainers),
  not as code, so routes/towns can be added without rewriting
  WorldEngine. Do NOT switch engines (game stays React/PixiJS).
- Kenney UI Pack / tiles (CC0, kenney.nl): 9-slice panel/button/
  bar structure only, already used for UI — art stays Mochiichao.
- PixiJS (MIT): already the world/battle renderer.
- Modding community, already in repo (reference only, no vendored
  pret code): pret decomps Gen 1-4 (Emerald/Ruby/Crystal/Yellow/
  Diamond/Platinum partial, on main via PR #12), pokebw2
  (fuddlesworth, GPL-3.0, reference only), PKHeX / pkNX study
  clones in tools/ (GPL-3.0, code NOT vendored), plus tools/
  vendored in PR #7 (rot.js, FastNoiseLite, WFC, DSDecmp, ndstool).
  "Modding wired up 100%" = these data shapes + trainer/encounter
  structures are the template for Mochiichao's own trainer/
  encounter data — NOT copying their Pokemon, maps, or text.
- NOT pulled: Pokemon Essentials, commercial ROMs, commercial
  game files, modded APKs — same boundary as before.

## Slice 1 definition of done (playable, testable)
New Game -> Prof intro -> name -> home/Mom -> lab -> starter ->
Hex battle -> gifts -> Route 1.0 (catch at least 2 wild, beat at
least 2 of the 4 trainers) -> Silicon Town (heal + shop) -> Dojo 1
(beat at least 1 acolyte, Master Lin attempt) -> The Dark Forest
(Hacker Grunt) -> save + Continue works. All with: no emoji NPCs,
no terminal menus, no title in battle, dialogue box with portrait
+ ▼, help lines, HP panels, 2x2 moves, Luigi Cube catch, PC
storage. If any step fails, that step is the bug report — not
"the game is bad" in general.
