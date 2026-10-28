# Menu Editor layout — derived from Pokemon code (2026-10-27 expansion)

How the editor is laid out, and which Pokemon settings structures each
section comes from. Pokemon-first rule: the game files come first, then
open source, then industry practice. Anything below marked X is a
Mochiichao editor-tool extension, NOT a Pokemon option — it is labelled
so it is never mistaken for one.

## The one-sentence derivation

Pokemon options screens are flat rows on a dedicated full screen, with
LEFT/RIGHT changing a value and a pinned help/description line. The
editor keeps that row discipline for every GAME_OPTIONS row, and puts
the draggable/minimizable/pinchable layers ONLY inside the editor tool
itself — Mars's own 2026-10-26 decision: draggable layers exist inside
the editor, never in the game menus.

## Row structure: FireRed option_menu.c → GAME_OPTIONS

FireRed (`pokefirered-leafgreen/src/option_menu.c`,
`sOptionMenuWinTemplates`):
- Text window bg1 (2,3) 26×2, pal 1, baseBlock 2 — the header row.
- Options window bg0 (2,7) 26×12, pal 1, baseBlock 0x36 — the rows.
- Bottom bar bg2 (0,0) 30×2, pal 15, baseBlock 0x16e — the
  PICK/SWITCH/CANCEL help line, FONT_SMALL, right-aligned.
- Highlight window follows the selected row (font-height pitch).
- Item counts (`sOptionMenuItemCounts`): text speed 3, battle scene 2,
  battle style 2, sound 2, button mode 3, frame 10, cancel 0.

The editor's GAME_OPTIONS panel copies this shape: a header block, flat
rows with LEFT/RIGHT values, and a pinned description line at the
bottom. The six shipped rows (TEXT SPEED, BATTLE ANIMATION, BATTLE
STYLE, SOUND, BUTTON MODE, FRAME) are the FireRed six, with the
FireRed frame range 1–10 as the shipped default range and 1–20
available through the RETRO frame sets.

## Window templates → editor chrome presets (OPTIONS LAYOUT)

Each layout preset in RETRO_OPTIONS restyles the GAME_OPTIONS panel
chrome after that game's real options window geometry. These are
panel-chrome presets, not full-screen ports — the geometry is real,
the scope is honest.

- RED (`pokered engine/menus/main_menu.asm DisplayOptionMenu`):
  three TextBoxBorder boxes at (0,0), (0,5), (0,10), each 3×18;
  labels at (1,1), (1,6), (1,11); CANCEL at (2,16). No sound, print,
  or frame rows exist in Red — none are invented.
- YELLOW (`pokeyellow engine/menus/options.asm`): single box (0,0) to
  SCREEN−2; labels at (2,2); values at x=14 for rows 2/4/6 and x=8
  for rows 8/10; CANCEL at (2,16); ▶ cursor at x=1, pitch 2.
- CRYSTAL (`pokecrystal engine/menus/options_menu.asm`): single
  Textbox (0,0) to SCREEN−2; labels at (2,2), two-line rows; values
  at x=11 for rows 3/5/7/9/11/13; frame digit badge at tile (16,15)
  showing 1–8; ▶ cursor at x=1, pitch 2. The editor's CRYSTAL frame
  badge reproduces that badge position as a panel corner mark.
- EMERALD (`pokeemerald src/option_menu.c`): header window bg1 (2,1)
  26×2 pal 1 baseBlock 2; options window bg0 (2,5) 26×14 pal 1
  baseBlock 0x36; row pitch 16px; choices at x=104, right-aligned
  to 198; header text at (8,1) FONT_NORMAL; background frames on
  bg1 pal 7; highlight WIN0H (16, DISPLAY−16), WIN0V
  (row×16+40, row×16+56).
- FIRERED: as the GAME_OPTIONS section above.
- HEARTGOLD (`pokeheartgold` options app): title MAIN_1 (1,0) 12×3
  pal 13 baseTile 0xA; selected option MAIN_1 (1,3) 30×18 pal 13
  0x2E; quit button MAIN_1 (24,21) 7×3 pal 13 0x24A; frame/test
  window SUB_1 (2,19) 27×4 pal 12 0x1; confirm button MAIN_1
  (15,21) 7×3 pal 13 0x25F; border Y values
  {−8,−32,−56,−80,−104,−128,−156}; 15 touch hitboxes. MENU_ENTRY_6
  is the Confirm/Quit cursor, NOT a 7th option — there are six
  options, and the editor does not invent a seventh.
- PLATINUM (`pokeplatinum` options menu): title MAIN_1 (1,0) 12×2
  pal 13 baseTile 10; entries MAIN_1 (1,3) 30×14 pal 13 baseTile 34;
  description MAIN_1 (2,19) 27×4 pal 12 baseTile 454; standard
  window pal 14, message box pal 15; per-row description strings;
  confirmation popup MAIN_3 (25,13) 6×4 pal 13.
- BLACK 2 (`pokebw2` config panel): message window (BG_MESSAGE,1,19,
  30,4,4,TRUE); confirm window (BG_CONFIRM,1,1,30,4,15,TRUE);
  title window (BG_BAR,0,0,16,3,8,TRUE); label/item pixel tables
  with values Slow/Mid/Fast, On/Off, Shift/Set, Stereo/Mono,
  Save/NoSave; rows at y 24–168; confirm rect {112,168,184,192},
  quit rect {184,168,256,192}.

## Frame counts → FRAME SET (RETRO_OPTIONS)

- Crystal/Gold: 8 frames (+1 unused tile, gfx/frames/9.png unused).
- FireRed: 10 (`sOptionMenuItemCounts` frame entry = 10).
- Emerald/Ruby: 20 (`text_window.h WINDOW_FRAMES_COUNT 20`).
- HeartGold: 20 (frame entry 20; msg_0045 WINDOW TYPE 1–20).
- Platinum: 20 (`game_options.h OPTIONS_FRAME_1–20`).
- Black 2: no frame row on its panel — the editor does not add one
  for Black 2.

Changing FRAME SET clamps the shipped FRAME setting into the new
set's range. The Mochiichao frames in slots 1–20 are ORIGINAL Y2K
variants, not Pokemon frame tiles — stated on the GAME_OPTIONS FRAME
row itself.

## Font tables → reference only (NOT font-picker entries)

No font files exist in the repo for these ids, so they are documented
here and NOT added as selectable fonts. Adding them as picker entries
without files would ship broken rows.

- FireRed (`text.h`): 8 ids — SMALL, NORMAL_COPY_1, NORMAL, NORMAL_
  COPY_2, MALE, FEMALE, BRAILLE, BOLD. Options use NORMAL labels +
  SMALL pick/switch bar.
- Emerald (`text.h`): 10 ids — SMALL, NORMAL, SHORT, SHORT_COPY_1–3,
  BRAILLE, NARROW, SMALL_NARROW, BOLD ("JP glyph set only").
  Options use NORMAL.
- HeartGold (`font.h`): 6 ids — SYSTEM 0, MESSAGE, SUBSCREEN,
  UNOWN, UNK_4, UNK_5. Options print with ids 0 and 1.
- Platinum: only FONT_SYSTEM verified in the options file.
- Black 2: no named font table in the panel (font index 0).

Only fonts actually wired in `src/lib/fonts.ts` stay selectable.

## Colour/theme tables → OPTIONS THEME

- Emerald: background palette single RGB(17,18,31) — exact. Selected
  values carry GREEN / LIGHT_GREEN prefixes; selected text is
  RED / LIGHT_RED.
- FireRed: option menu palette to BG pal 1; selected triple
  TRANSPARENT / LIGHT_RED / RED; help bar triple DYNAMIC_6 / WHITE /
  DARK_GRAY.
- HeartGold: text-colour triples — unselected (15,2,0), selected
  (1,2,0), frame/test (1,2,15); FontPal0 slot 13, FontPal1 slot 12,
  frame graphics pal 15.
- Platinum: TEXT_COLOR (1,2,0) transparent background, (1,2,15)
  white background; windows pal 13, description pal 12, standard
  pal 14, message box pal 15.
- Black 2: row palettes {3,1,0,1,3}; cursor palette from slot 7;
  pulsing cursor interpolates palette entries 11↔12.
- Gen 2: NO named menu palette table in the options file (only
  ClearBGPalettes / SCGB_DIPLOMA / default BGP/OBP) — so Gen 2 has
  no theme preset, and none is invented.

Emerald's RGB(17,18,31) is exact. All other theme colours are
index-mapped shades and are labelled approximations in the row note
and in code comments — never presented as exact palette dumps.

## New RETRO rows and their sources

- GEN 1 BATTLE ANIMATION — Red `pokered` main menu (BATTLE ANIMATION
  ON/OFF). OFF freezes the preview (same freeze as reduced motion).
- YELLOW SOUND — Yellow `pokeyellow options.asm`,
  OptionsMenu_SpeakerSettings, SOUND_MASK %110000: MONO / EARPHONE1 /
  EARPHONE2 / EARPHONE3. Stored as a Yellow-variant setting; it is
  NOT merged into the shipped 2-way SOUND row.
- PRINT BRIGHTNESS — Yellow `options.asm` + Crystal
  `options_menu.asm` Options_Print: LIGHTEST / LIGHTER / NORMAL /
  DARKER / DARKEST, codes $00/$20/$40/$60/$7f. The panel swatch
  shows the darkness live.
- MENU ACCOUNT — Crystal `options_menu.asm` OPT_MENU_ACCOUNT
  (wOptions2 bit 0, default ON); `start_menu.asm .IsMenuAccountOn`
  draws a 5×10-tile box at (0,13). The editor shows the box outline
  when ON; box contents are not ported (not guessed).
- SAVE BEFORE IR — Black 2 `config_panel.c` OPTION_SAVE_BEFORE_IR
  (Config_Get/SetSaveBeforeIR, field unk9, default 1). The LEFT =
  Save / RIGHT = No Save order is reversed vs other toggles in the
  original and is preserved here.
- HG BUTTON MODE — HeartGold `options_app.c`
  sNumChoicesPerMenuEntry button entry = 2: NORMAL / L=A. No LR in HG.
- PLAT BUTTON MODE — Platinum `game_options.h`:
  NORMAL / START_IS_X / L_IS_A. (Emerald/FireRed's middle value is
  LR instead — that is the shipped BUTTON MODE row, not this one.)
- C-GEAR / KANJI — Black 2 `config.h` save fields (cgearOn,
  kanji), set outside `config_panel.c`. Listed as info rows in
  RETRO_OPTIONS so they are never mistaken for panel rows.
- TEXT DELAYS — HeartGold + Diamond `options.c`
  Options_GetTextFrameDelay: SLOW 8, MID 4, FAST 1 frames per char.
  The PLAY TYPE SAMPLE button types MOCHII at the current TEXT
  SPEED so the delay is visible.

## Checked and NOT found (do not invent)

- No volume slider in any options file checked.
- No screen-brightness/backlight option in any options file checked.
- No button-mode row in the Black 2 panel.
- No frame row in the Black 2 panel.
- No sound row in Red; no print/frame rows in Red.
- No Diamond options-menu SCREEN file found in this checkout
  (Diamond options DATA file exists: options.c + options.h, same
  6-field struct/defaults as HeartGold; the screen layout is a gap
  and is NOT inferred from Platinum).
- No 7th HeartGold option (MENU_ENTRY_6 is Confirm/Quit).

## Editor-tool items (X — industry practice, not Pokemon)

- Pinch-to-scale + wheel/slider scale + reset-to-100% (touch
  editor convention; pinch distance ratio, wheel ×1.1/×0.9 steps).
- Draggable / minimizable / ghost / parkable panels, resize grip,
  snap-to-10px grid, undo/redo (cap 50), align tools, copy-style
  (Figma-style editor chrome).
- Per-layer save, per-piece save, library search/filter, rename /
  duplicate / update-from-draft (asset-library convention).
- Accessibility block: reduced motion (WCAG 2.x + OS
  prefers-reduced-motion), high contrast, touch targets 44/56/68px,
  preview font scale 0.85–1.30, focus ring, WCAG contrast notes on
  label-colour rows, keyboard navigation with focus order following
  visual row order (Pokemon LEFT/RIGHT/SELECT discipline kept for
  every row).
- Label style presets incl. white-letters/black-outline and
  black-letters/white-outline as saved option sets (Mars's combos
  as data, never hardcoded, never the locked default).
- Crystal frame badge on the GAME_OPTIONS panel (tile (16,15)
  position reproduced as a corner mark) + Black 2 row-palette strip
  preview (row palettes 3/1/0/1/3 mapped to shades).

## What the locked default is, and is not

Locked v32 (read-only, RESTORE LOCKED V32) is untouched by every row
above: black letters, CONTINUE + SETTINGS white halo radius 2,
sublabel black + white halo radius 1, centered real-menu labels,
preview LEFT with #206 margins. Editor edits save to named working
presets only. The preview/real-menu alignment gap (preview LEFT vs
real menu centered on this branch until the #260 merge reconciles
with merged #206) is stated in the editor header, not hidden.
