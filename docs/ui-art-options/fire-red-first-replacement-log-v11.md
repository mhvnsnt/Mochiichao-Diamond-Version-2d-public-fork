# FireRed FIRST, one by one — replacement log (v11)

Work order Mars set 2026-10-25: do ONE game at a time, starting
with FireRed / LeafGreen, 100% of its steps, then change every
proprietary thing, then move to the next game. NOT all games at
once. The earlier list of all games was an OVERVIEW only — work
starts here, with FireRed, and does not move on until FireRed's
steps are done.

Rule for every element below: show the FireRed element FIRST
(from the files), then say EXACTLY what Mochiichao thing replaces
it in that spot, and whether we HAVE it or NEED TO MAKE it.
No random art placed without a label. No battle elements on a
non-battle screen.

## SCREEN 1 — TITLE (FireRed intro.c + title)
FireRed element -> Mochiichao replacement -> status
- Logo, centre screen -> MOCHIICHAO logo, centre screen
  -> NEED TO MAKE: a clean MOCHIICHAO logo image (not the
  text-only title we have now, not a random diamond graphic).
  This is where they put their Pokemon logo, so we need to
  make our logo for this spot.
- Version subtitle under logo -> DIAMOND VERSION under logo
  -> HAVE (text), NEED TO MAKE: styled subtitle art matching logo.
- Creature / mascot art behind logo -> Mochii cutout behind logo
  -> HAVE: mochii-front-cut.png (from sheet, not a new likeness).
- "Press Start" / "Press Any Key" prompt, flashing -> PRESS ANY
  KEY prompt, flashing -> HAVE (text), NEED: make it a game
  button prompt, not plain text.
- NO menu, NO battle, NO HP, NO moves on this screen.
  If any of those appear here, that is a bug, not a feature.

## SCREEN 2 — MAIN MENU ONLY (FireRed main_menu.c:74-120)
FireRed element -> Mochiichao replacement -> status
- CONTINUE window, left 3 / top 1, 24 wide x 10 high, palette 15,
  text FONT_NORMAL at (2,2), fill 10, save stats inside
  (player name, play time, dex count, badge count)
  -> CONTINUE window, same spot, same tall shape, stats inside
  (player name, roster count, dojos cleared, CR, map, save date;
  play time once tracking is added)
  -> NEED TO MAKE: separate framed CONTINUE window art
  (main_menu_panel SVG, gold highlight when selected).
  Current build has this as ONE list panel — WRONG, fix it.
- NEW GAME window, left 3 / top 13, 24 wide x 2 high
  -> NEW GAME window, same spot, short, below CONTINUE
  -> NEED TO MAKE: separate framed NEW GAME window art,
  same panel, unselected teal border.
- Third window slot, left 3 / top 17, 24 wide x 2 high
  (Mystery Gift in FireRed)
  -> SETTINGS window, same spot, short, below NEW GAME
  -> NEED TO MAKE: separate framed SETTINGS window art +
  a REAL settings screen behind it (not a "coming soon" note).
- Background behind windows -> title background behind windows
  -> HAVE (gradient), NEED: title art background, not blank navy.
- NO battle on this screen. NO enemy HP, NO player HP, NO move
  grid, NO creatures in battle stance on this screen.
  Answer to Mars's question, plainly: NO, that is NOT what
  happens on their main menu screen. Their main menu has
  title + menu windows only. Battle is a completely separate
  screen, later. The earlier image that put battle HP boxes
  on the main menu was WRONG and is discarded — do not reuse it.

## What "100% of FireRed, then change proprietary things" means
Step by step, for FireRed only, in order:
1. Title (above) -> replace logo, subtitle, mascot art.
2. Main menu (above) -> replace windows, stats, settings.
3. New game / Prof intro -> replace professor, town, lab,
   starter creatures, dialogue (Mochiichao words, same beats).
4. Route 1, Viridian, Pewter, etc. -> replace EACH town/route/
   gym with a Mochiichao map/dojo, one at a time, logging
   each replacement the same way as above.
Proprietary things changed at each step, logged here:
city/town names, gym leader names, Pokemon species, Pokemon
art/sprites, Pokemon dialogue text, Pokemon music. What stays:
layout, window sizes, menu order, battle positions, dialogue
box size, save flow, unlock rules — those are the TEMPLATE,
not proprietary content.

## Next game, only after FireRed is done
HeartGold second, Black 2 third, then Gen 1/3/4 pret games
as reference only. Do NOT start HeartGold work until the
FireRed main menu + title above are verified on Pages.
