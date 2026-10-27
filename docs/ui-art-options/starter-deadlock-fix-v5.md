# Fix v5 — the starter deadlock (playtest-proven, 2026-10-25 Pages playtest)

Playtest result that proves Mars's complaint: title/main/save/
shop/bag/PC mostly pass, BUT world/battle FAIL — walking in Boot
Harbor tall grass triggered NO encounter, HUD stayed "No partner
yet", Arena/Creature both said "Visit Prof. Aeon's Lab and choose
a starter first", and the lab was UNREACHABLE: player tried all
four brown buildings, aligned with dark doors, pressed Up/Space/A,
player stopped at door/wall, no interior opened, no building
labeled, NPCs/signposts gave NO dialogue on A/Space/Enter.
Fusion never seen because no partner/battle was obtainable.
That is a deadlock, not a content gap: no starter -> no battle/
catch -> no progress, and the starter door is the broken link.

## Root cause found in the files (WorldEngine.tsx / FullWorldMaps.ts)
- Doors ARE defined: Sector 0 door {x:10, y:3, to:"aeon_lab",
  enterAt:{x:6, y:12}, label:"Prof. Aeon's Lab"}; lab exit
  {x:6, y:13, to:"sector0", enterAt:{x:10, y:4}}.
- move() checks tile solid (tile 1/4 = solid, tile 2 = water)
  BEFORE it checks doors/exits. If the door tile is a wall tile,
  the player stops at the wall and the door code never runs —
  exactly the playtest symptom. Fix: check doors/exits BEFORE
  the solid-tile return, or mark door tiles walkable in the map
  data. Test by walking INTO the lab door tile, not by pressing A.
- interact() looks at the FACING tile only (playerDir +/-1).
  Playtest pressing A is ambiguous: 'a' is also bound to move
  left in the same handler, and Space/Enter only work when
  screen === "overworld" and the player is facing the NPC.
  Fix: (a) show an on-screen interact prompt ("Press A / tap")
  when the facing tile holds an NPC, door, or signpost;
  (b) make tap/click on an adjacent NPC/door also interact
  (mobile players do not have a reliable A key);
  (c) make signposts interactable objects with a label + text —
  currently they are decoration with no dialogue, so a new player
  cannot learn where the lab is.
- Buildings are UNLABELED in the world view. Fix: render the
  door label ("Prof. Aeon's Lab") above/near the door tile, and
  a map header that says the current map + objective ("Go to
  Prof. Aeon's Lab" until starter chosen).
- Tall grass in Boot Harbor: Sector 0 has NO encounter pool in
  the map data (pools are on Route 1.0, Binary Woods, Cave).
  That is correct in Pokemon terms (no wild battles before the
  starter in the starting town) — but the game must TELL the
  player that, instead of silently doing nothing. Fix: when a
  player steps on tall grass with no partner, show the route-
  block message ("It's dangerous... go see Prof. Aeon first"),
  not silence. Once the starter is chosen, Route 1.0 encounters
  (Sproutle/Mochii/Kittember/Zephling) must trigger — playtest
  that separately, it was never reached.

## Template, not literal copy (the boundary, plainly)
Mars said: copy their dialogue/towns/words/names at first, then
change to ours. What CAN be copied 1:1 into Mochiichao:
town layout template (home -> lab -> route -> town -> heal/shop
-> dojo), NPC roles (mom, professor, assistant, rival, nurse,
clerk, trainer classes, dojo master), dialogue BEATS in order
(prof intro, mom, lab choice, rival battle, gifts, route block,
trainer pre/post battle, heal, shop), map/encounter/trainer data
SHAPES from the decomps.
What CANNOT be copied verbatim into a public repo/game, even
temporarily: Pokemon dialogue text, town names, character names,
or Pokemon species — that is their copyrighted writing/content,
and shipping it (even as a "base") makes the game a Pokemon
clone with a takedown risk, not a template. The Mochiichao
version of every beat is written fresh, in the same slot, same
order, same function — that IS the base template, and it is what
the v4 flow already does. No Pokemon text is added to the repo
by this fix.

## Engine — what Pokemon actually used, and what Mochiichao uses
- FireRed (GBA) and HeartGold (DS) do NOT run on Unity, Unreal,
  Godot, or any public engine. They are custom C + assembly
  engines for Nintendo handheld hardware: hardware tilemaps,
  hardware sprites, hardware sound, cartridge save. The decomps
  in the repo are reverse-engineered C for THAT hardware —
  they cannot be dropped into a web game as an engine.
- Mochiichao's engine is already: React (UI) + PixiJS v8
  (world/battle renderer, MIT) + Vite build + TypeScript game
  code (WorldEngine, BattleView, gameStore). That stack IS open
  and IS the engine. The work is translating decomp SYSTEMS
  (tile maps, encounters, trainers, menus, dialogue, saves)
  into Pixi/React — not importing a Pokemon engine, because
  there is no importable one.
- Open engines that fit this kind of game, for reference only
  (do NOT switch engines now — that would throw away everything
  already built): Godot (MIT, 2D tilemaps, used for monster
  tamers), Tuxemon (Python/Pygame, GPL-3.0, JSON data + Tiled
  maps). Their lesson is already applied: maps as data, not code.
- "Leave everything we have, build on top": YES — mod-layer
  architecture, no deletions. This fix ADDS door/interact/label/
  prompt code, it does not delete Mochiichao content.

## Fix order (main, AFTER the running v4 worker finishes — do NOT interrupt it)
1. Door-before-solid + lab door label + objective header.
2. Interact prompt + tap-to-interact + signposts as objects.
3. Playtest ONLY the starter path on Pages: title -> new game
   -> name -> home -> Mom -> walk into lab door -> starter
   choice -> Hex battle -> gifts -> Route 1.0 wild encounter
   -> Luigi Cube catch -> trainer battle. Report each step
   pass/fail by name. Do NOT claim "playable" until that chain
   passes.
4. Then: A/B buttons unclipped (playtest: A/B partially clipped
   + overlapped by MochiiMind button — move MochiiMind, do not
   shrink A/B), player sprite transparent cutout (playtest:
   white box around Player A — use the sheet cutout, not the
   raw sheet cell), main menu separate framed windows (playtest:
   one list panel, not separate windows — v3 spec), gender
   portraits clean (playtest: BOY silhouette "ART IN PROGRESS",
   GIRL as a sheet strip — use humanSheets portraits, silhouette
   placeholder, never a strip).
5. Gate PR vs main @44730aff, rebuild Pages, re-playtest.
