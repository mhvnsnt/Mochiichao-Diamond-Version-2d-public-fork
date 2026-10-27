# Pokemon game-file UI wiring — read from the actual decomps in the repo, not from Mochiichao code

Sources (all already in the repo as submodules / decomps, reference only — no code or art copied, structure and rules translated):
- pokefirered-leafgreen/src/battle_interface.c
- pokefirered-leafgreen/src/battle_message.c (line 1282, window texts 2395+)
- pokefirered-leafgreen/src/start_menu.c
- pokefirered-leafgreen/src/menu.c, window.c, text_window.c
- pokeheartgold/src/battle/battle_hp_bar.c, src/dialog_box.c, src/start_menu.c, src/party_menu.c
- pokebw2 (fuddlesworth, GPL-3.0, reference only) — battle data shapes, not UI code

## 1. Battle — how FireRed actually builds it
- Healthbox is NOT one panel. battle_interface.c:517+: it is TWO sprites —
  main (left, 64x64) + other (right, 64x64), plus a THIRD sprite for the
  healthbar. Healthbar sprite x = healthbox x + 16 (player) / + 8 (other),
  y = healthbox y. Name / level text is printed INTO the healthbox object,
  not as a separate React label floating over it.
- HP bar colour, battle_interface.c:1907-1912 and 2165-2179: green when
  filled pixels > 50%, yellow when > 20%, red when 20% or less. Same
  thresholds in Mochiichao already (BattleView hpColor), keep them —
  they match the Pokemon files, do not invent new thresholds.
- Action menu, battle_message.c:1282: gText_BattleMenu =
  "FIGHT{CLEAR_TO 56}BAG\nPOKéMON{CLEAR_TO 56}RUN" — a 2x2 grid, right
  column starts at x=56, palette 5, highlight shadow 13/14/15.
  Mochiichao mapping (names stay Mochiichao, layout stays Pokemon):
  top-left = first move / FIGHT, top-right = Luigi Cube / BAG,
  bottom-left = Roster / POKéMON, bottom-right = Flee / RUN.
  In current BattleView.tsx the moves are already a 2x2 grid + Luigi
  Cube + Flee — keep that grid, do NOT turn it into a vertical list.
- Move menu: B_WIN_MOVE_NAME_1..4 are FOUR separate windows, FONT_SMALL,
  fg 13 / bg 14 / shadow 15, x=0 y=1, plus a PP window and a TYPE window
  for the selected move (B_WIN_PP, B_WIN_MOVE_TYPE). Mochiichao already
  shows type + PP under each move button in BattleView.tsx — keep
  PP + TYPE visible for the selected move, like the Pokemon files.
- Message window: B_WIN_MSG, FONT_NORMAL, x=2 y=2, lineSpacing 2,
  fg 1 / bg 15 / shadow 6, fill 0xf, text speed 1. Bottom full-width
  dialogue box, text prints in, it is NOT a title banner, it is NOT
  a log list. Mochiichao BattleView log is a scrolling list — the
  Pokemon rule is: one message box at the bottom, current message
  only, previous messages scroll away. Apply: keep the log, but the
  CURRENT message must be in the bottom message box, full width.
- NO title in battle. There is no title window in battle_message.c's
  window list. Title belongs on the title screen only.

## 2. Start / main menu — how FireRed actually builds it
- start_menu.c:116-125, 210-252: order = Pokedex, Pokemon, Bag, Player,
  Save, Option, Exit (Safari: + Retire; Link: Player2 instead of Player).
  Mochiichao mapping: Roster (= Pokemon), Bag/Shop (= Bag), Player,
  Save, Settings (= Option), Exit. Same vertical order, one item per
  row, 15px row spacing (Print at i * 15).
- The menu is a FRAMED WINDOW over the field, not a full-screen blank
  panel: LoadStdWindowFrameGfx(), DrawStdWindowFrame(CreateStartMenuWindow),
  CopyWindowToVram(). Background = the world behind it, still visible
  around the window.
- Help line: every cursor move redraws a help message window at the
  bottom (sStartMenuDescPointers, DrawHelpMessageWindowWithText,
  Menu_MoveCursor +/-1). Mochiichao menus must have a bottom help line
  describing the selected item — currently missing in the Pillow mocks,
  add it in the real menu, do not add it as a mock image.
- Cursor: Menu_InitCursor(window, FONT_NORMAL, 0, 0, 15, numItems, pos)
  — arrow cursor, not a highlighted button row. Mochiichao game-button
  style can stay, but the cursor/selected row must be visually distinct
  from unselected rows, like the Pokemon cursor.

## 3. Dialogue box — how HeartGold actually builds it
- dialog_box.c:29-39: DialogBox_AddWindowToLayer3, DIALOG_BOX_X/Y/W/H,
  frame gfx loaded from the player's Options frame choice,
  FillWindowPixelBuffer(15) (white), DrawFrameAndWindow2.
  Dialogue box = bottom, full width, framed, on BG layer 3, on both
  screens. Mochiichao dialogue box must be bottom, full width, framed
  (SVG dialogue-box.svg from PR #14), over the world/battle background
  — never floating on blank navy, never a title header.

## 4. What this means for Mochiichao wiring (files to change, in main chat — NOT in this lane)
- BattleView.tsx: keep 2x2 move grid + PP/TYPE, HP panels as healthbox
  (name + Lv + bar in ONE box, bar offset inside the box, green/yellow/
  red at 50%/20%), message box bottom full width for the current
  message, NO title, NO blank background — PixiBattleCanvas arena
  behind it (app #0b1526, floor 0x1a2a1a from vh*0.55, shadows).
- PixiBattleCanvas.tsx: player three-quarter-right (147), opponent
  three-quarter-left (148) — already wired via battleSpriteUrl, keep it.
- Menus (main/pause/roster/shop/PC/garden/arena/creature/ring/cheat):
  framed window over the world, vertical list, 15px-ish row spacing,
  distinct cursor, bottom help line describing the selected item.
- uiArt.ts / src/assets/ui/: panels/buttons/bars from PR #14 are the
  frames for those windows — use them, do not draw new panels in Pillow.
- NO Pillow battle/menu composites from here on. The next visual of
  any menu or battle must be from the real game build in the browser.
