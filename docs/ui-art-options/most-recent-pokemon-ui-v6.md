# Most recent Pokemon files — UI brought over 100% (layout/structure) — v6

Most recent Pokemon game files in the repo, verified 2026-10-25:
- NEWEST GAME: Black 2 / White 2, Gen 5, DS, pokebw2 (fuddlesworth,
  GPL-3.0, reference only). UI files: src/ov162/title.c (A/Start
  -> start menu, Up/Select/B = delete save, Down/X/Y = microphone),
  src/ov162/startmenu.c (items drawn as actors, palette per row,
  saved game shown, item flags unlock items as you progress),
  src/ov036/field_menu.c, src/ov142/itemmenu.c, src/system/
  bmp_menu.c / bmp_menulist.c (bitmap menu + list).
- NEWEST CLEAR UI CODE: HeartGold / SoulSilver, Gen 4, DS,
  pokeheartgold. UI files: src/title_screen.c (title demo, fade,
  press to proceed), src/dialog_box.c (DIALOG_BOX_X=2, Y=19,
  W=27, H=4, BG layer 3, user frame choice, FillWindowPixelBuffer
  white), src/start_menu.c (Pokedex/Pokemon/Bag/Player/Save/
  Options, items unlock only when got: CheckGotPokedex,
  CheckGotStarter, CheckGotMenuIcon, CheckGotPokegear),
  src/battle/battle_hp_bar.c + party_gauge.c, src/party_menu.c,
  src/list_menu.c / list_menu_2d.c, src/touchscreen_list_menu.c.
- FireRed Gen 3 is OLDER, but has the clearest main-menu window
  templates (main_menu.c) — used where BW2/HG code is opaque.

What "100%" means here (and what it does NOT mean):
- 100% of the LAYOUT / STRUCTURE / RULES are brought over:
  title -> main menu -> new game -> pause menu -> battle ->
  party -> bag -> shop -> PC, in that order, with the same
  window, cursor, help, unlock, and save rules.
- NOT 100% of Pokemon art, sprites, music, dialogue text, town
  names, or character names — those are not in this file, not
  in the game, and not shown as a Pokemon screenshot (no ROM
  exists here to screenshot, and copying them into a public
  game would make it a Pokemon clone). The diagram
  pokemon-vs-mochiichao-layout-v6.png shows the Pokemon
  LAYOUT (boxes + labels from the files above) on the left,
  and the Mochiichao art to make next on the right.
- Next step, in Mars's sequence: make OUR art for our version,
  piece by piece, in the same layout: (1) NEW GAME window frame
  + panel art, (2) CONTINUE window + stats, (3) SETTINGS window
  + real settings screen, (4) pause menu windows, (5) dialogue
  box, (6) battle HP boxes + 2x2 move grid, (7) party/bag/shop/
  PC lists — all using Mochiichao panels (PR #14 SVGs), Mochiichao
  palette (navy/teal/gold), Mochiichao sheet cutouts for
  characters, never Pokemon art, never AI mock likenesses.

Wire order (main, after running v4 worker, do NOT interrupt):
main menu first (separate framed windows, v3/v6), then pause,
then HUD, then dialogue, then battle — PR vs main @44730aff,
rebuild Pages, capture REAL main menu from Pages and show Mars.
