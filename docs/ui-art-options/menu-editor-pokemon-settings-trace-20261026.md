# Menu Editor — Pokémon Settings/Options Trace

Research-only trace, 2026-10-26. No repo files modified; this file is the only write.
Source root for all paths below: `~/workspace/mochiichao-work/fresh-start/`
(the Mochiichao repo work clone). Research order: FireRed, then HeartGold, then Black 2.
Scope rule: copy the STRUCTURE (screen layout, row/value model, input model, save
model). Do not copy Pokémon names, art, dialogue, logos, cries or town names into
the public Mochiichao copy — those slots get Mochiichao replacements. Quoted
identifiers are code identifiers from the decomp sources, quoted for research only.

## TL;DR — the shared structure (all three games)

1. One dedicated full screen, entered from the in-game (Start/field) menu — never
   a popup over gameplay.
2. A vertical list of rows. Each row = option name on the left + current value on
   the right (FireRed) or all values shown with the current one highlighted
   (HeartGold, Black 2).
3. Up/Down moves the row cursor (wraps in all three).
4. Left/Right cycles the current row's value. No A-confirm per row in
   FireRed/HeartGold; Black 2 also accepts tapping a value directly.
5. No submenus anywhere in any of the three options screens. No sliders, no
   numeric text fields, no volume/brightness control, no colour picker, no
   layer-order editor, no preset system, no export — in any of the three.
   Every value is a small fixed choice list (2-3 values, or a frame index).
6. Save model differs per game (see below), but in all three the values live in
   a small save-block struct and are applied to the live game at exit / on change.
   There is no separate "settings file" and no flash-write call inside any
   options screen itself.

---

## 1. FireRed / LeafGreen — `pokefirered-leafgreen`

### Key files

- `pokefirered-leafgreen/src/option_menu.c` (575 lines) — whole screen: state
  machine, windows, input, save-back. Entry: `CB2_OptionsMenuFromStartMenu()`.
- `pokefirered-leafgreen/include/option_menu.h` — that single entry point.
- `pokefirered-leafgreen/include/global.h` lines ~337-342 — save-block fields.
- `pokefirered-leafgreen/include/constants/global.h` lines 95-107 —
  `OPTIONS_TEXT_SPEED_*`, `OPTIONS_SOUND_*`, `OPTIONS_BATTLE_STYLE_*`,
  `OPTIONS_BUTTON_MODE_*`.
- `pokefirered-leafgreen/src/start_menu.c` line ~531 — Start menu routes here.
- `pokefirered-leafgreen/src/text_window_graphics.c`
  (`GetUserWindowGraphics`, `gUserFrames[]`) — selectable frame graphics.
- `pokefirered-leafgreen/src/menu.c`, `include/menu.h` — shared menu helpers (§4).
- `pokefirered-leafgreen/src/list_menu.c`, `include/list_menu.h` — shared
  list-menu framework (§4). Note: the options screen itself does NOT use it;
  it is hand-rolled.

### Screen structure, in plain steps

1. Entry `CB2_OptionsMenuFromStartMenu()` saves the return callback
   (`gMain.savedCallback`, default `CB2_ReturnToFieldWithOpenMenu`), allocates
   scratch `struct OptionMenu` (`option[MENUITEM_COUNT]`, `cursorPos`,
   `loadState`, `state`, `loadPaletteState`), copies the six live save values
   into it, and clamps out-of-range values to 0.
2. Build sequence in `CB2_OptionMenu()` states 0-9, then `SetOptionMenuTask()`
   creates `Task_OptionMenu`: `InitOptionMenuBg()` (3 BGs from
   `sOptionMenuBgTemplates`, windows from `sOptionMenuWinTemplates`, blend
   registers for the highlight band); `LoadOptionMenuPalette()` (4 sub-steps:
   currently selected frame tiles/palette via
   `GetUserWindowGraphics(option[FRAMETYPE])`, options palette
   `graphics/misc/option_menu.gbapal`, standard window graphics);
   `PrintOptionMenuHeader()`; `DrawOptionMenuBg()` (hand-drawn border tiles);
   `LoadOptionMenuItemNames()` (all 7 labels); `BufferOptionMenuString(i)` for
   every row (current values); `UpdateSettingSelectionDisplay(cursorPos)`;
   `OptionMenu_PickSwitchCancel()` (footer hint strip).
3. Windows (`sOptionMenuWinTemplates[]`):
   - `WIN_TEXT_OPTION` (window 0): BG 1, tilemap (2,3), 26x2 — header, `gText_Option`.
   - `WIN_OPTIONS` (window 1): BG 0, tilemap (2,7), 26x12 — the list. Labels at
     x=8; values at pixel x=`0x82` (130) via `BufferOptionMenuString()`;
     row y = `(maxLetterHeight-1)*selection + 2`.
   - Window 2: BG 2, tilemap (0,0), 30x2 — footer "Pick / Switch / Cancel" hint.
4. Highlight: NOT a cursor sprite. `UpdateSettingSelectionDisplay()` sets
   hardware window registers `WIN0V`/`WIN0H` to a horizontal band
   (`WIN_RANGE(y, y+maxLetterHeight)`, `WIN_RANGE(0x10, 0xE0)`) over the selected
   row, with BG0 lightened through blend registers. A band, not a moving icon.
5. Input — `OptionMenu_ProcessInput()`, polled in `Task_OptionMenu` loadState 2:
   - `JOY_REPT(DPAD_LEFT/RIGHT)` — cycle current row's value, WRAPPING
     (past last to 0, below 0 to last). Returns 4 (re-print value), or 2 for the
     frame row (reload frame tiles+palette + re-print, so the change is live).
   - `JOY_REPT(DPAD_UP/DOWN)` — move cursor, WRAPPING (top to CANCEL, CANCEL to
     top). Returns 3 (re-draw highlight band).
   - `JOY_NEW(B_BUTTON) || JOY_NEW(A_BUTTON)` — exit, from ANY row. Returns 1,
     then fade out, then `CloseAndSaveOptionMenu()`.
   - NO separate confirm step and NO discard step: A and B do the same thing.
     The `MENUITEM_CANCEL` row is just a label; pressing A/B on it exits and
     saves exactly like any other row.
   - No submenu from any row. No touch input (GBA).
6. Exit/save — `CloseAndSaveOptionMenu()` (~line 508): copies scratch values
   back into `gSaveBlock2Ptr` (below), calls `SetPokemonCryStereo(optionsSound)`,
   frees scratch struct and task, returns to `gMain.savedCallback`. There is NO
   flash-save call in this file — values sit in the RAM save block and persist
   when the player next uses the game's normal Save command.

### FireRed options list and value types

Row enum: `MENUITEM_TEXTSPEED, MENUITEM_BATTLESCENE, MENUITEM_BATTLESTYLE,
MENUITEM_SOUND, MENUITEM_BUTTONMODE, MENUITEM_FRAMETYPE, MENUITEM_CANCEL`
(`MENUITEM_COUNT` = 7). Counts: `sOptionMenuItemCounts = {3, 2, 2, 2, 3, 10, 0}`.

| Row | Save field (`gSaveBlock2Ptr->...`, `global.h`) | Type / values |
|---|---|---|
| Text Speed | `optionsTextSpeed` (u16 :3) | Choice list, 3: Slow / Mid / Fast (`OPTIONS_TEXT_SPEED_SLOW=0, MID=1, FAST=2`); default Mid (`src/new_game.c` line 62). Delay via `sTextSpeedFrameDelays[]` in `new_menu_helpers.c` |
| Battle Scene | `optionsBattleSceneOff` (u16 :1) | On/off toggle, 2: On / Off. Field is inverted: stored bit means OFF |
| Battle Style | `optionsBattleStyle` (u16 :1) | Choice list, 2: Shift / Set (`OPTIONS_BATTLE_STYLE_SHIFT=0, SET=1`) |
| Sound | `optionsSound` (u16 :1) | Choice list, 2: Mono / Stereo (`OPTIONS_SOUND_MONO=0, STEREO=1`); default Mono |
| Button Mode | `optionsButtonMode` (u8) | Choice list, 3: Help / LR / L=A (`OPTIONS_BUTTON_MODE_HELP=0, LR=1, L_EQUALS_A=2`) |
| Frame Type | `optionsWindowFrameType` (u16 :5) | Index, 10 values in this screen. Displayed as `TYPE` + number (1-10) via `gText_FrameType` + `ConvertIntToDecimalStringN(value+1)`; graphics from `gUserFrames[10]`. Discrepancy to note: `global.h`'s comment says "one of the 20 decorative borders" and `GetUserWindowGraphics()` guards `idx >= 20` (an RSE leftover), but only 10 frames exist in `gUserFrames[]` and the screen only cycles 10 |
| Cancel | — (count 0, no value printed) | Exit row, not a setting |

No numeric slider, no volume, no brightness, no animation on/off toggle as such
(Battle Scene On/Off is the closest — it gates battle animations). New-game
defaults (`src/new_game.c` lines 62-68): text speed Mid, frame 0, sound Mono,
battle style Shift, battle scene Off = FALSE (i.e. ON), button mode Help.

---

## 2. HeartGold / SoulSilver — `pokeheartgold`

### Key files

- `pokeheartgold/src/options.c` (105 lines) + `include/options.h` — `Options`
  struct, getters/setters, defaults.
- `pokeheartgold/src/options_app.c` (1,058 lines) + `include/options_app.h` —
  whole screen: `OptionsMenu_Init / OptionsMenu_Main / OptionsMenu_Exit`
  (OverlayManager app, overlay `options_app`).
- `pokeheartgold/src/launch_application.c` line ~670 (`OptionsMenu_LaunchApp`)
  — entry from Start menu (`start_menu.c`: `Task_StartMenu_Options`).
- `pokeheartgold/src/player_data.c` lines 12, 23-25 + `include/player_data.h`
  line 37 — `Save_PlayerData_GetOptionsAddr()`; options live in player/save data.
- `pokeheartgold/src/list_menu.c`, `include/list_menu.h`, `list_menu_cursor.h`,
  `list_menu_items.c` — shared list-menu framework (§4). Again the options
  screen does NOT use it; it is its own carousel app.
- `pokeheartgold/src/menu_input_state.c`, `include/menu_input_state.h` —
  `MenuInputStateMgr`, tracks Buttons vs Touch input mode.

### Screen structure, in plain steps

1. Entry: `OptionsMenu_LaunchApp(fieldSystem)` builds `OptionsApp_Args`
   (`options` = `Save_PlayerData_GetOptionsAddr(saveData)` + `MenuInputStateMgr`)
   and launches the `options_app` overlay.
2. `OptionsMenu_Init()` copies the six live values into a local
   `OptionsApp_Options` (same fields, two members swapped vs `Options` — the
   source file itself comments on this) and into `menuEntries[]`.
3. Layout — two DS screens, five windows, five BGs (`OptionsApp_SetupBgConfig`:
   `GF_BG_LYR_MAIN_0/1/2` + `GF_BG_LYR_SUB_0/1`; `OptionsApp_SetupWindows` via
   `AddWindowParameterized`):
   - `windows.optionsTitle` — Main BG 1, (1,0), 12x3 — "OPTIONS" title.
   - `windows.selectedOption` — Main BG 1, (1,3), 30x18 — the list, rows at
     y = `i*24 + 5` pixels (24 px row pitch).
   - `windows.frameAndTextSpeedTest` — Sub BG 1, (2,19), 27x4 — LIVE PREVIEW
     box: prints `WINDOW TYPE XX` (msg `msg_0045_00040 + frame`) at the current
     text speed, framed with the currently selected frame
     (`LoadUserFrameGfx2(..., frame)`). Changing text speed re-prints the
     preview at the new speed; changing frame re-frames the box.
   - `windows.confirmButton` — Main BG 1, (15,21), 7x3 — "CONFIRM".
   - `windows.quitButton` — Main BG 1, (24,21), 7x3 — "QUIT".
   - Plus 9 sprites (`ov54_021E6EAC`): 5 active-choice markers (x set by
     `OptionsApp_SetActiveButtonsXPosition()` from `sActiveButtonXCoords`), 2
     frame-scroll arrows, Confirm (sprite 8) / Quit (sprite 7) buttons. The
     moving row border is a BG scroll: `sMenuEntryBorderYCoords`
     (`-8, -32, -56, -80, -104, -128, -156`) applied with
     `BgSetPosTextAndCommit(GF_BG_LYR_MAIN_0, ...)` in `ov54_021E69D4()`.

4. Value display — the HeartGold difference: `ov54_021E6418()` prints ALL values
   of a row in one line (`sOptionChoiceLabelXCoords[row][i]`, each centred on
   its own width), current value in selected colour `MAKE_TEXT_COLOR(1, 2, 0)`,
   others in `MAKE_TEXT_COLOR(15, 2, 0)`. Exception: the Frame row prints only
   the single current value (centred), because 20 values will not fit in one
   line. Model = carousel: all choices visible, highlight = colour.
5. Input — `OptionsApp_HandleInput()` / `OptionsApp_HandleKeyInput()`:
   - D-Pad Left/Right on a setting row: `OptionsApp_UpdateMenuEntryCarousel()`
     — value wraps with modulo (`(value +/- 1) % numStrings`). Frame arrows
     animate. Sound `SEQ_SE_DP_SELECT`.
   - D-Pad Left/Right on the Confirm/Quit row (`MENU_ENTRY_6`): toggles Quit
     (value 0) / Confirm (value 1).
   - D-Pad Up/Down: move row, wrapping with modulo over `MENU_ENTRY_COUNT`
     (7). `ov54_021E69D4()` moves the border BG / toggles button sprites.
   - A on Confirm/Quit row: Confirm sets `unk10_0 = 1`, save sound
     `SEQ_SE_DP_SAVE`; Quit sets `unk10_0 = 2`, cancel sound
     `SEQ_SE_GS_GEARCANCEL`. A on a setting row does nothing.
   - B anywhere: `unk10_0 = 2` (quit path), cancel sound. Unlike FireRed, B
     here is a real discard path — with the caveat under Save below.
   - Touch: 16 hitboxes in `sOptionsAppTouchscreenHitboxes` — one per value
     (24 px row pitch, x bands per value), plus Confirm (hitbox 13) and Quit
     (hitbox 14). Tapping a value sets it directly; tapping a Frame arrow steps
     +/-1 (`ov54_021E6DA8` maps hitbox to row/value, values 3/4 = step -1/+1).
6. No submenu from any row. No slider, no numeric field.

### HeartGold options list and value types

Row enum: `MENU_ENTRY_TEXT_SPEED, MENU_ENTRY_BATTLE_SCENE, MENU_ENTRY_BATTLE_STYLE,
MENU_ENTRY_SOUND_METHOD, MENU_ENTRY_BUTTON_MODE, MENU_ENTRY_FRAME, MENU_ENTRY_6`
(`MENU_ENTRY_COUNT` = 7). Counts: `sNumChoicesPerMenuEntry = {3, 2, 2, 2, 2, 20, 2}`
— Frame is 20 here (vs FireRed's 10), Button Mode is 2 here (vs FireRed's 3).

| Row | `Options` field (`include/options.h`) | Type / values |
|---|---|---|
| Text Speed | `textSpeed : 4` | Choice list, 3. Delay in `Options_GetTextFrameDelay()`: 0 to 8, 1 to 4, else to 1 frames |
| Battle Scene | `battleScene : 1` | On/off, 2 |
| Battle Style | `battleStyle : 1` | Choice list, 2 (Shift/Set) |
| Sound Method | `soundMethod : 2` | Choice list, 2 (Stereo/Mono) |
| Button Mode | `buttonMode : 2` | Choice list, 2. `Options_SetButtonModeOnMain()` maps 1 to `gSystem.buttonMode=3`, else 0 |
| Frame | `frame : 5` | Index, 20 values (msg `msg_0045_00040 + frame` = "WINDOW TYPE XX") |
| Confirm/Quit (`MENU_ENTRY_6`) | `menuEntries[6].value` (0 = Quit, 1 = Confirm) | Exit row, not a setting |

`Options` struct: bitfields `textSpeed:4, soundMethod:2, battleStyle:1,
battleScene:1, buttonMode:2, frame:5, dummy:1` (one u16). Defaults
(`Options_Init()`): textSpeed 1 (mid), soundMethod 0 (stereo), battleStyle 0
(shift), battleScene 0 (on), buttonMode 0 (normal), frame 0. Names are msg IDs
`msg_0045_00001 + i`; values are consecutive msg IDs from `msg_0045_00009`,
loaded in `OptionsApp_LoadMenuEntriesData()`.

### HeartGold save behaviour — NOT a clean confirm/discard

- Some changes apply LIVE during editing: `ov54_021E6418()` calls
  `GF_SndSetMonoFlag()` for Sound, `Options_SetButtonModeOnMain()` for Button
  Mode, and `Options_SetTextSpeed(data->playerOptions, ...)` for Text Speed —
  that last one writes straight into the live player options, not the scratch copy.
- `OptionsMenu_Exit()` then: if `unk10_0 == 1` (Confirm), copies all six
  `menuEntries[].value` back through the `Options_Set*` setters into
  `playerOptions`. If `unk10_0 == 2` (Quit/B), it does NOT copy the other five
  fields back — but it does re-apply mono flag, button mode, and text speed
  from the scratch copy, so Text Speed (already live-written) is not reverted
  by Quit either. A builder copying this must decide deliberately: clean
  confirm/discard (scratch-only until Confirm) is the safer Mochiichao choice;
  HeartGold's live-leak is a quirk, not a pattern to copy blindly.
- As in FireRed, there is no flash-save call in the options app. The
  `playerOptions` struct is part of save data; persistence comes from the
  game's normal save flow.

---

## 3. Black 2 / White 2 — `pokebw2`

### Key files

- `pokebw2/src/system/config.c` (98 lines) + `pokebw2/include/save/config.h` —
  the `Config` struct and its getters/setters. Note the header's own warning:
  field names are guessed except `kanji` and `cgearOn`, which the code's use shows.
- `pokebw2/src/ov140/config_panel.c` (1,981 lines) + `pokebw2/include/app/config_panel.h` —
  the options screen. The file header says the ROM has no name for it;
  "config_panel.c" is the decomp's guess. Entry: `CONFIG_PANEL_PROC_FUNCTIONS`
  (a `GameProc`), param `ConfigPanelParam` (`result`, `gsys`).
- `pokebw2/src/system/bmp_menu.c`, `bmp_menulist.c`, `bmp_menuwork.c` +
  `pokebw2/include/system/bmp_menu*.h` — shared bitmap-menu framework (§4).
  The config panel uses `AppTaskMenu` for its confirm dialog, not `BmpMenu`
  for the rows.

### Screen structure, in plain steps

1. Entry `ConfigPanel_Init()`: creates heap `HEAPID_CONFIG_PANEL` (0x1c),
   loads the UI overlay, font, print queue, message data
   (`ARCID_SYSTEM_MESSAGE`, `TEXT_BANK_TITLE_2`), and snapshots the live
   config into TWO copies: `wk->saved` and the scroll state's copy, both via
   `ConfigPanelOptions_Init()` reading `(Config *)getTrainerDataBlkAddress(...)`
   — i.e. the config sits at the start of the trainer-data save block.
2. Layout — 6 BGs (`sConfigPanelBgSetups[BG_COUNT]`: BG_BAR 0, BG_TEXT 1,
   BG_ROWS 2, BG_CONFIRM 3, BG_MESSAGE 4, plus a 6th setup entry) and windows
   (`WINDOW_OPTION = 11, WINDOW_TITLE = 16, WINDOW_MESSAGE, WINDOW_CONFIRM`).
   Rows are 24 px tall, screen row area `ROWS_TOP = 24` to `ROWS_BOTTOM = 168`.
   Value texts and option names are fixed-position labels in
   `sConfigPanelLabels[LABEL_COUNT]` (16 entries: 11 value labels at x 14-26,
   then 5 option names at x=1, rows y = 5, 8, 11, 14, 17 tiles).
   Each value is also a framed "actor" (sprite): 11 value actors
   (`ACTOR_ITEM + i`, `ACTOR_COUNT = 14`), animated together by a pulse
   (`ConfigPanelGraphic` pulse angle/colour, frame counter resetting past 96).
3. Per-row explanation: unlike FireRed/HeartGold, the row under the cursor gets
   an explanation line printed in the message window
   (`ConfigPanelScroll_Main()`: `sConfigPanelOptions[cursor].msgId`, streamed
   at the current text speed for Text Speed, instant otherwise). This is the
   closest thing in any of the three games to a "help pane" for the current row.
4. Input — `ConfigPanelUi_Main()` maps hardware input to an `INPUT_*` enum,
   then `ConfigPanelScroll_Main()` acts on it:
   - Up/Down (held repeats after 10 frames): cursor moves, WRAPPING
     (`cursor == 0` to `CURSOR_MAX`, `CURSOR_MAX` to 0). Cursor range includes
     the buttons: `CURSOR_CONFIRM = OPTION_COUNT` (5), `CURSOR_QUIT` (6),
     `CURSOR_MAX = CURSOR_QUIT`. Sound `SEQ_SE_SELECT1`.
   - Left/Right on an option row: `ConfigPanelScroll_Step()` /
     `ConfigPanelOptions_Step()` — step to the next/previous value in that
     option's item list, CLAMPED at the ends (does NOT wrap — this differs
     from FireRed/HeartGold). `ConfigPanelOptions_SetItem()` / `Step()` call
     `ConfigPanelOptions_Apply()` immediately, so the change is live in the
     save-block `Config` at once (see Save below).
   - Left/Right on Confirm/Quit rows moves between the two buttons.
   - Touch: tap a row's value area (`sConfigPanelItems[]` hit rects, e.g.
     Text Speed values at hit x 112/160/208, width 48, height 24) to set that
     value directly (`ConfigPanelScroll_TouchItems()`); drag vertically
     (`INPUT_SLIDE`) scrolls the rows (`ConfigPanelScroll_Move()`); first key
     press after touch just restores the cursor (`INPUT_KEY_MODE`).
   - B maps to `INPUT_CANCEL`; in `ConfigPanelScroll_Main()` DECIDE/CANCEL are
     draw-only. The real exit path is the app bar (below), not B alone.
5. Exit — a state machine (`ConfigPanelSeq_*`): `ConfigPanelSeq_Input` ->
   Confirm/Quit/Close decision -> `ConfigPanelSeq_Save` or `ConfigPanelSeq_Quit`
   -> `ConfigPanelSeq_FadeOut` (fade both screens to black, 16 steps).
   - App bar buttons: `BUTTON_CONFIRM`, `BUTTON_QUIT`, and `BUTTON_CLOSE`
     (touch-bar close icon). Confirm goes straight to Save.
   - Quit or Close: if the current values equal `wk->saved`
     (`ConfigPanelOptions_Equals()`, compares `OPTION_COUNT` bytes), quit
     directly; if anything changed, show the confirm dialog
     (`ConfigPanelSeq_Confirm`): dim the screen
     (`G2x_SetBlendBrightness_(..., 8)`), enable BG_CONFIRM, print
     "Would you like to make these changes?" (`Title2_Text_WouldLikeMakeThese`)
     with a Yes/No `AppTaskMenu` (bottom-right, 13x3, items
     `Title2_Text_Yes + i`). Yes -> Save; No -> Quit.
   - Special case in Input state 1: if Save-Before-IR was turned off while
     another game's save exists, it forces the value back to 1 and prints
     `Title2_Text_HaveSavedDataAlready`.

### Black 2 options list and value types — FEWER options, different set

Option enum: `OPTION_TEXT_SPEED, OPTION_BATTLE_SCENE, OPTION_BATTLE_STYLE,
OPTION_SOUND, OPTION_SAVE_BEFORE_IR` (`OPTION_COUNT` = 5). 11 value items in
`sConfigPanelItems[ITEM_COUNT]`, grouped by `sConfigPanelOptions[OPTION_COUNT]`
(each with an explanation msgId, a count, and item indices).

| Row | `Config` field (`include/save/config.h`) | Type / values |
|---|---|---|
| Text Speed | `textSpeed : 4` | Choice list, 3: Slow / Mid / Fast (items 0,1,2) |
| Battle Scene | `unk7 : 1` via `Config_Get/SetBattleScene()` | On/off, 2: On / Off (items 3,4). Field name guessed |
| Battle Style | `unk6 : 1` via `Config_Get/SetBattleStyle()` | Choice list, 2: Shift / Set (items 5,6). Field name guessed |
| Sound | `soundFlags : 2` via `getSoundFlags / Config_SetSoundFlags()` | Choice list, 2: Stereo / Mono (items 7,8). NOTE the polarity differs from FireRed: in `ConfigPanelScroll_ApplySound()`, value 0 = stereo ON, 1 = mono (stereo OFF). Applied live so the change is heard while on the row |
| Save Before IR | `unk9 : 1` via `Config_Get/SetSaveBeforeIR()` | On/off, 2: Save / No Save (items 9,10 — note item order is 1 then 0 in `sConfigPanelItems`). Default 1 in `Config_Init()` |

Full `Config` struct (bitfields in one u16, plus `unk2`): `textSpeed:4,
soundFlags:2, unk6:1, unk7:1, kanji:1, unk9:1, cgearOn:1, :5`, plus `u16 unk2`.
`Config_Init()` defaults: textSpeed 1, soundFlags 0, unk6 0, unk7 0, kanji 0,
unk9 1, cgearOn 0.

### Does Black 2 differ? Yes — in four ways

1. FEWER editable options (5, not 6): Button Mode and Frame Type are GONE from
   the panel. The `Config` struct has no frame or button-mode field at all.
2. NEW option: Save Before IR (whether the game saves before infrared
   communication) — no equivalent in FireRed/HeartGold.
3. Fields that exist but are NOT editable on this panel: `kanji` (message
   language; `Config_SetKanji()` also calls `GFL_MsgDataSetDefaultLangID()`)
   and `cgearOn` (set from the start menu's continue question). A builder must
   not assume "every Config field appears on screen".
4. Confirm discipline is stricter and cleaner than HeartGold's: changes are
   live-applied during editing, but Quit re-applies the `wk->saved` snapshot
   (`ConfigPanelSeq_Quit()`: `ConfigPanelOptions_Apply(&wk->saved)` +
   `ConfigPanelScroll_ApplySound(saved sound, TRUE)`), so Quit genuinely
   reverts — unlike HeartGold's live-leak. Confirm (`ConfigPanelSeq_Save()`)
   re-applies the current values, plays `SEQ_SE_SAVE`, and fades out. As in
   the other two games, no flash-write call appears in the panel itself; the
   `Config` pointer IS the save block, so "apply" = write to save-block RAM.

---

## 4. Menu navigation frameworks the settings screens sit on

These are the reusable systems. Note the pattern: the options screens
themselves mostly do NOT use the generic list menu — they hand-roll a
row/value model on top of the window/BG/palette systems. A Mochiichao builder
should copy the window/BG/cursor systems, not force the options screen into
the list-menu widget.

- FireRed `include/menu.h` / `src/menu.c`: `Menu_InitCursor()`,
  `Menu_MoveCursor()`, `Menu_ProcessInput()`, `PrintMenuTable()`,
  `MultichoiceList_PrintItems()`, `CreateYesNoMenu()`, `Menu_GetCursorPos()`,
  `MENU_B_PRESSED = -1`, `MENU_NOTHING_CHOSEN = -2`. Window helpers:
  `DrawStdFrameWithCustomTileAndPalette()`, `SetWindowTemplateFields()`.
  `include/window.h` + `src/text_window.c`: `WindowTemplate` (bg, tilemapLeft,
  tilemapTop, width, height, paletteNum, baseBlock), `InitWindows()`,
  `PutWindowTilemap()`, `CopyWindowToVram()`, `FillWindowPixelBuffer()`,
  `AddTextPrinterParameterized*()` (font, x, y, colour triple, speed).
  Text-window graphics: `GetUserWindowGraphics(idx)` returns
  `{tiles, palette}` for a frame index — the frame-type mechanism.
- FireRed `include/list_menu.h` / `src/list_menu.c`: `ListMenuTemplate`
  (items, moveCursorFunc, itemPrintFunc, totalItems, maxShowed, windowId,
  header/item/cursor X, cursorPal, fillValue, cursorShadowPal, lettersSpacing,
  itemVerticalPadding, scrollMultiple, fontId, cursorKind),
  `ListMenuItem {label, index}`, `LIST_CANCEL = -2`. Used by bag/party/etc.,
  not by the options screen.
- HeartGold `include/list_menu.h` / `src/list_menu.c`: same shape, DS version
  (`ListMenuInit()`, `ListMenu_ProcessInput()`, `DestroyListMenu()`,
  `RedrawListMenu()`, `LISTMENUATTR_*`), plus `list_menu_cursor.h`
  (cursor sprite) and `list_menu_2d.c` (grid variant).
  HeartGold `include/bg_window.h` / `src/bg_window.c`: `BgTemplate`,
  `AddWindowParameterized()`, `DrawFrameAndWindow2()`,
  `LoadUserFrameGfx2()`, `CopyWindowToVram()`. `menu_input_state.*`:
  Buttons-vs-Touch mode tracking used by the options app.
- Black 2 `include/system/bmp_menu.h`, `bmp_menulist.h`, `bmp_menuwork.h` /
  `src/system/bmp_menu.c`, `bmp_menulist.c`, `bmp_menuwork.c`: bitmap-window
  menu system (`BmpWin`, `BmpWin_DrawFrame()`), used by the config panel's
  confirm dialog via `AppTaskMenu` (`include/system/app_taskmenu.h`,
  `AppTaskMenu_Create/Update/GetCursorPos/Free`, `AppTaskMenuWin`). BG system:
  `GFL_BGSysCreateBG()` with `BGSetup`, `GFL_BGSysSetScrPaletteNo()`,
  `GFL_BGSysMoveBGReq()` (scroll), `GFL_BGSysSetBGEnabled()`. Fade:
  `GFL_FadeSet(FADE_ENGINE_A_BLACK | FADE_ENGINE_B_BLACK, ...)`.
  Confirm-dialog dim: `G2x_SetBlendBrightness_(..., 8)` — this is the
  "background fade" mechanism in Black 2 (a brightness blend over the whole
  screen while a dialog sits on top), not a per-panel fade control.

---

## 5. Mapping table — Pokémon element -> Mochiichao Menu Editor replacement

Status meaning (checked in this job, 2026-10-26): HAVE = the editor feature
already exists in the Mochiichao game repo; NEED TO MAKE = it does not.
A grep of the game repo found NO MenuEditor component (no file matching
menu/title editor; existing UI is `src/components/IntroSequence.tsx`,
`src/components/SaveMenu.tsx`, view components, `src/lib/saveSystem.ts`,
`src/lib/uiArt.ts`). So the editor itself is 0/12 categories built = 0%.
"Pattern in decomp" means the Pokémon structure is available to copy; it does
NOT count as HAVE for the editor.

| Pokémon element (exact spot) | Mochiichao editor replacement in that exact spot | Status |
|---|---|---|
| Options full screen, entered from Start menu (FR `CB2_OptionsMenuFromStartMenu`, HG `OptionsMenu_LaunchApp`, BW2 `CONFIG_PANEL_PROC_FUNCTIONS`) | Menu Editor as its own full screen/route in the game, entered from the game's menu — not a popup | NEED TO MAKE |
| Row list: name left + value right (FR `WIN_OPTIONS`, HG `windows.selectedOption`, BW2 `sConfigPanelLabels`) | Editor row list: one row per editable menu element, name left + current value/setting right | NEED TO MAKE |
| Row highlight band (FR `UpdateSettingSelectionDisplay` WIN0 band; HG BG-scroll border + colour; BW2 row palettes `sConfigPanelRowPalettes` + pulse) | Selected-row highlight in the editor (band / colour / pulse — pick one, do not mix all three) | NEED TO MAKE |
| Value cycling Left/Right, wrapping (FR/HG) or clamped (BW2) | Left/Right (and click/tap) cycling for choice-list editor settings; decide wrap vs clamp per row and document it — Pokémon itself is inconsistent here | NEED TO MAKE |
| Confirm/Quit exit rows + Yes/No dialog on changed exit (HG `MENU_ENTRY_6`; BW2 `BUTTON_CONFIRM/QUIT/CLOSE` + `Title2_Text_WouldLikeMakeThese` dialog) | Editor Save / Discard buttons + "keep these changes?" dialog when exiting with unsaved edits. Use Black 2's discipline (snapshot + restore on discard), NOT HeartGold's live-leak and NOT FireRed's save-on-B | NEED TO MAKE |
| Cloud — NO equivalent: no cloud element on any options screen; backgrounds are flat BGs + frame tiles | Cloud layer/position control for the menu background | NEED TO MAKE — no Pokémon source; new Mochiichao art/control, do not cite Pokémon for it |
| Symbols/Animation — PARTIAL only: cursor/button sprites and frame-arrow sprites (HG 9 sprites; BW2 value actors + pulse) animate, but there is no symbol picker and no per-symbol animation editor | Symbols/Animation picker + animation controls in the editor | NEED TO MAKE — sprite-animation pattern exists in decomp, the picker/editor does not |
| Logo Emblems — NO equivalent on any options screen (options screens carry no logo; a logo lives on the title screen, a different system not traced here) | Logo Emblems slot/picker in the editor | NEED TO MAKE — no Pokémon options source; do not invent one |
| Panels — YES: window templates + frame graphics (FR `WindowTemplate`/`gUserFrames[10]`; HG `AddWindowParameterized` + 20 frames; BW2 `BmpWin` + `BmpWin_DrawFrame`) | Panels: panel template + frame-style picker (the direct analogue of Frame Type) | NEED TO MAKE as an editor; pattern fully available in decomp |
| Logo slot — NO equivalent on any options screen | Dedicated Logo slot in the editor layout | NEED TO MAKE — no Pokémon options source |
| Background fade — PARTIAL: full-screen fades on entry/exit (FR `BeginNormalPaletteFade`; HG `BeginNormalPaletteFade` both screens; BW2 `GFL_FadeSet` + confirm-dialog brightness blend `G2x_SetBlendBrightness_(..., 8)`). No per-background fade slider/editor | Background fade control (fade in/out + dialog dim amount) | NEED TO MAKE as an editor control; fade mechanism pattern available in decomp |
| Title — PARTIAL only: a title window/row exists (FR `WIN_TEXT_OPTION` header; HG `windows.optionsTitle`; BW2 `WINDOW_TITLE`) but it is a fixed label, not an editable title | Editable Title text/position in the editor | NEED TO MAKE as an editor; header-window slot pattern available |
| Text — YES as a system: row labels + value labels + per-row explanation (BW2 message window) and a live preview box (HG `frameAndTextSpeedTest`) | Text rows + explanation pane + live preview box in the editor | NEED TO MAKE as an editor; text/window/preview pattern available |
| Fonts — PARTIAL: font + colour triples are parameters everywhere (FR `FONT_NORMAL`/`FONT_SMALL` + colour arrays; HG `MAKE_TEXT_COLOR` + `LoadFontPal0/1`; BW2 `GFL_FontCreate`), but there is NO font picker and no per-row font choice | Fonts picker in the editor | NEED TO MAKE — font plumbing exists, the picker does not |
| Layers — PARTIAL only: BG layers, priorities and window stacking exist (FR 3 BGs + blend; HG 5 BGs; BW2 6 BGs + `GFL_BGSysSetBGEnabled`), but there is NO user-editable layer-order editor in any game | Layers: layer order / visibility editor | NEED TO MAKE — layer system exists in decomp, the editor does not |
| Presets — NO equivalent in any game: no saved preset, no preset list, no preset switching anywhere in the three options systems | Presets: save/load/switch named menu layouts | NEED TO MAKE — entirely new design, no Pokémon source |
| Export — NO equivalent in any game: no export, no sharing, no file output from any options screen | Export: export a menu layout (file/share) | NEED TO MAKE — entirely new design, no Pokémon source |

Editor build total: 0/12 categories HAVE as editor features = 0% built.
Pattern coverage from decomp: 6/12 categories have a directly copyable
Pokémon pattern (Panels, Background fade mechanism, Title slot, Text system,
Fonts plumbing, Layers system) = 50%; the other 6/12 (Cloud, Symbols/Animation
picker, Logo Emblems, Logo slot, Presets, Export) have no Pokémon options
equivalent and must be designed new for Mochiichao.

## 6. Gaps where Pokémon has NO equivalent — stated plainly

- No layer-order editor, no per-panel colour editor, no per-panel opacity
  control (only whole-screen fade/dim). No cloud, logo, emblem, or symbol
  editor on an options screen. No presets. No export. No sliders of any kind
  (volume, brightness, or otherwise). No numeric input. No submenu system
  inside options. No search/filter. No per-row reset-to-default button
  (defaults exist only as `*_Init()` values, applied at new game, not as a
  user-facing reset). No undo history beyond Black 2's single saved snapshot
  restored on Quit.
- Frame counts are inconsistent across games and must not be merged blindly:
  FireRed cycles 10 frames, HeartGold 20, Black 2 has no frame option at all.
  The Mochiichao editor needs its own single frame/panel catalogue count.
- Sound polarity is inconsistent: FireRed 0 = Mono, 1 = Stereo; Black 2
  0 = Stereo, 1 = Mono. Do not copy either numbering without checking which
  one the Mochiichao audio code expects.

## 7. Builder checklist (structure to copy, in order)

1. Dedicated full screen, entered from the game menu, returning to it.
2. Scratch copy of settings on entry; live-apply only the things that must be
   previewed (frame, text speed, sound); snapshot the entry values.
3. Rows: name left, value right (single value) or carousel (all values,
   current coloured) — pick one display model and keep it consistent.
4. Up/Down = row (wrap). Left/Right = cycle value (document wrap vs clamp).
   Touch/click = tap a value to set it (HeartGold/Black 2 hitboxes).
5. A live preview box (HeartGold's `frameAndTextSpeedTest` is the best model:
   current frame + current text speed rendering sample text).
6. Exit: Confirm saves scratch to the save struct; Quit/Discard restores the
   entry snapshot (Black 2 model); if changed, ask Yes/No before discarding.
7. Persist via the game's normal save flow — do not invent a separate
   settings file unless the Mochiichao save system (`src/lib/saveSystem.ts`)
   already provides a slot for it.
