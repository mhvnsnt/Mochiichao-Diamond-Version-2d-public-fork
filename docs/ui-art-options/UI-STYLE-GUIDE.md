# Mochiichao UI Style Guide — UI Art lane, v1

Lane: Mochiichao – UI Art (side chat d2afac6f, forked from main 2026-10-25).
Runs in parallel with Human Characters and Sprite Art (creature) lanes.
Nothing in this folder is committed to the public repo from this lane —
art is shown in the UI Art chat, reported ready, and main chat wires/swaps it
via the PR gate.

## Problem this fixes
Live build screenshots: mono teal terminal text, "M. OS // CHRONICLES" frame,
bracket buttons "[ RETURN TO WORLD ]", fixed 800px centred box with black
bars above/below on a phone, D-pad squeezed, B button half cut off.
Grid Asset Forge panel leaking into Roster. Emoji people/trees in world.

## One consistent style (all pieces, no exceptions)
- Font: one rounded, bold, game font for headings + UI text. NEVER mono
  terminal font for player-facing text. Dialogue text: clean rounded
  sans, large enough to read on a phone.
- Panels: dark slate-blue glass panels, 2px bright teal/cyan border,
  rounded 16px corners, soft glow shadow, subtle digital circuit / data
  pattern in the background — NOT a flat black terminal box, NOT a
  1px teal border on slate-950.
- Buttons: filled, rounded, high-contrast, with an icon + label, tap
  target at least 48px tall on mobile. Selected/hover: bright teal glow.
  NEVER bracket text links, NEVER plain text buttons.
- HP bars: rounded bar, green >50%, yellow >20%, red <=20%, with a thin
  white border and a dark track. Name + Lv above the bar, HP numbers
  (player only) below/right.
- Dialogue box: bottom panel, rounded, dark glass, white text, small
  creature/human portrait on the left where a speaker exists, continue
  arrow bottom-right. NEVER a mono log with timestamps and `>` prompts.
- Colours (Mochiichao digital world, not terminal teal-on-black):
  - Background deep navy: #0b1220
  - Panel: #16233a at ~92% opacity
  - Primary accent teal/cyan: #22d3ee
  - Gold accent (CR, champion, Mythic): #fbbf24
  - Text: #f1f5f9 white, secondary #94a3b8
  - Danger: #ef4444, warning: #facc15, success: #22c55e
- 12 True Element colours for move/type chips (from TYPE_COLORS in game):
  Water, Chrome, Earth, Bug, Umbral, Aero, Core, Strike, Deep, Flame,
  Mythic, Normal — each chip is a rounded pill with its element colour
  background + white text + small icon. Do not invent new element colours
  without a manifest entry.
- Layout: full-screen first. Menus fill the viewport. HUD is an overlay on
  top of the world, not a separate box above it. Portrait phone first:
  100dvh, safe-area padding, D-pad bottom-left, A/B/START bottom-right,
  all fully on-screen, nothing clipped.
- Placement (from menu-placement-base.md, structure only, art is ours):
  Title full-screen; Main menu vertical list; Pause as overlay, world
  dimmed behind; Battle enemy panel top-left, player panel bottom-right,
  move menu bottom panel (4 moves + Bag/Cube + Flee); Roster list left +
  detail right; Shop list + CR + buy/sell; PC storage list.

## Deliverables per piece
Each piece gets: asset file(s) + manifest entry (file, size, screen/panel,
placeholder replaced, status: finished / placeholder / missing).
Status is reported honestly — a piece is not "done" on a single mock.

## LIKENESS RULE (Mars, 2026-10-25, standing) — see LIKENESS-RULE.md
Do NOT generate a new likeness for any character that already has a
description, image, 2D sheet, or 3D bake. Source of truth is
sprite-art/2d-sheets/<creature>/ (and on main, src/assets/sprites-2d/
after PR #13, main b6cc35e1). Dorowani #147 = bipedal blue croc-turtle,
tall blue fin, RED star cheek frills, RED eyes in the 2D sheet,
pale belly, tan mottled shell — NOT quadruped, NOT yellow eyes, NO
backpack/necklace. Gabu #148 = bipedal teal turtle, YELLOW eyes, DARK
TEAL spikes (not crystals), tan belly/shell — NOT quadruped. Mochii
#001 = blue water blob with wave pattern — NOT a reptile. Manticlaw
normal = hulking tiger; Tripo golem = special variant only. Any UI mock
that drifts from the sheet is labelled DRIFT and is not a final asset.

## Canon lock (Mars, 2026-10-25) — no random words, no random titles
Title is always MOCHIICHAO / DIAMOND VERSION (MOCHII STUDIOS). No other
game title, no fake version footer, no invented creature/move names in
final art. Mock images are labelled mock when they contain mock values.
Real game files used as templates: src/lib/species.ts (Mochii 001,
Tiidebiite 002, Aquari-OS 003, Razorgater 004, Chromedile 005, Reaperdile
006, Tyrage 007, Duneclaw 008, Oblivirex 009, Kittember 010, Sproutle 038,
Dreadtoise 039 — note: roster naming for 005 differs, do NOT rename
silently), src/lib/moves.ts (Tackle, Quick Attack, Water Orb, Hydro Rush,
etc.), src/lib/uiArt.ts (36 slots, see wiring below), FullWorldMaps
landmarks, mochiichao-systems.ts, and the decomp JSONs on main as
placement/structure templates (not copied art/code).
Likeness lock: Dorowani = blue, tall head fin, red star cheek frills,
pale belly, tan shell. Gabu = teal, yellow eyes, dark teal spikes,
tan/yellow belly/shell. Style = Pokemon/Digimon-style: bold outlines,
rounded, saturated, anime eyes. NOT generic flat UI, NOT realistic,
NOT Kenney raw sprites (Kenney CC0 9-slice structure only, see below).

## Cut-out pieces (v2, 2026-10-25) — set up for every menu, not just art
- 48 SVG files, transparent background, 0 XML errors, in assets/svg/:
  panels (main/small/title/dialogue/HUD/party-slot), buttons
  (primary/gold/danger/small/A/B/START), bars (frame/track/HP
  green/yellow/red/XP blue), D-pad, 12 True Element icons, item icons
  (Luigi Cube, Mend Patch, Revive Core, coin, roster, bag, save,
  settings, map, garden, arena, cheat), status icons
  (burn/poison/paralysis/faint).
- Wiring: assets/ui-art-wiring.json maps all 36 uiArt.ts slotIds to a
  file, 0 missing. CSS: assets/mochiichao-ui.css. Build script:
  build_assets.py (SVG open standard, Python stdlib).
- Open-source used: Kenney UI Pack (CC0, kenney.nl/assets/ui-pack)
  9-slice panel/button/bar structure as structural reference; art is
  original Mochiichao work, recoloured/restyled, NOT Kenney raw sprites
  (raw generic art would drift the style lock above). PixiJS (MIT) is
  the game renderer in pass 1; SVG is the cut-out master — PNG exports
  at 1x/2x/4x are produced on import from the SVG, never hand-drawn
  separately from the AI mocks.
- Canon-corrected mocks (v2): main menu canon (MOCHIICHAO header only,
  no footer), battle HUD canon (GABU vs DOROWANI, Tackle/Quick Attack/
  Aqua Shot/Aqua Jet — Lv/HP numbers in the mock are INVENTED mock values
  only, Dorowani/Gabu have no stats assigned yet, final HUD uses runtime
  values), UI kit canon (MOCHII, 12 True Elements — mock sheet duplicates
  Core and Strike, final SVG icons are one each, correct 12).
- Push handoff sent to main chat (submission a32ea8f0): gate-checked PR
  for pass 1 code + these UI assets + uiArt.ts assetUrl updates only,
  additions/modifications listed, deletions 0 unless explicitly named,
  build + mergeable CLEAN first, live-browser deploy check after
  (previous 401 is the Netlify Private note, not proof the site is down),
  do NOT touch endearing-scone-b3d816.

## Queue status (v1, 2026-10-25)
- [x] Title art — DONE, checked by eye: MOCHIICHAO / DIAMOND VERSION /
      PRESS ANY KEY correct, Dorowani (blue, red frills) + Gabu (teal, spiky)
      in a digital harbour, no terminal text.
      File: media-generation-mochiichao-title-art-0-*.png
- [x] UI kit reference sheet — DONE as reference only: dark glass panel,
      filled rounded buttons, HP bar, dialogue box, vertical menu list,
      D-pad + A/B, element icons. WARNING: this sheet uses generic mock
      labels (SLIMEPUFF, JOLLY, WATER/FIRE/PSYCHIC/GRASS/GOLD) and a
      segmented rainbow HP bar — final game icons must use the 12 True
      Elements, and the HP bar must be a single green/yellow/red bar.
      File: media-generation-mochiichao-ui-kit-sheet-0-*.png
- [x] Main menu mock — DONE as reference, ONE FLAW TO FIX: panel, buttons
      (CONTINUE / NEW GAME / ROSTER / SAVE / SETTINGS) and harbour art are
      right, but the header says "CREATURES" and the footer says
      "v1.2.4 • PATCH 08" — final version must say MOCHIICHAO and drop the
      fake version footer. File: media-generation-mochiichao-main-menu-0-*.png
- [x] Battle HUD mock — DONE as reference, placement correct: enemy panel
      top-left, player panel bottom-right, 4 moves + BAG + FLEE bottom,
      dialogue text. WARNING: creature/move names in the mock (Spiketail
      Turtle, Gatorback, Shell Slam, etc.) are invented mock names, NOT
      canon — final HUD uses real roster names/moves.
      File: media-generation-mochiichao-battle-hud-0-*.png
- [ ] Pause menu, HUD (world overlay), Roster UI, Shop UI, PC UI
- [ ] Garden / Arena / Creature / Ring UI, cheat console panel
- [ ] Icons + controls: D-pad, A/B/START, 12 element icons, item/status icons
- [ ] Victory / defeat / loading screens, banners, dialogue boxes
All four v1 images are local only in ~/workspace/mochiichao-work/ui-art/,
NOT committed to the public repo from this lane — main chat wires/swaps
them via the PR gate.

## What is NOT copied
No official Pokemon / Nintendo menu art, sprites, music, code, or text.
Placement follows real-game menu layout studied from decomp structure and
specs; art, text, and panels are original Mochiichao work.
