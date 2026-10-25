# Settings > Menu Creator — v2 Pokemon-style (Mars, 2026-10-25 17:14 CDT)
SUPERSEDES v1 overlay mock. v1 controls are kept, v1 PRESENTATION is
discarded: no terminal menu, no overlay popup on top of the main menu.

## Pokemon structure FIRST (FireRed option_menu.c, read 2026-10-25)
- FireRed options is a DEDICATED FULL SCREEN, not a popup:
  SetMainCallback2(CB2_InitOptionMenu), own background layers,
  own windows, own task. It replaces the previous screen, and
  CloseAndSaveOptionMenu returns to the previous screen.
- Windows: header 26 wide x 2 tall at (2,3); options list 26 x 12
  at (2,7); top help bar 30 x 2 at (0,0) — in FireRed that bar is
  the "PICK / SWITCH / CANCEL" line. No overlay, no terminal.
- Rows, in order: TEXT SPEED, BATTLE SCENE, BATTLE STYLE, SOUND,
  BUTTON MODE, FRAME, CANCEL. Each row: label left, value right.
- Input: UP/DOWN moves cursor, wrapping CANCEL -> first row and
  first row -> CANCEL. LEFT/RIGHT cycles the value (3 text speeds,
  2 battle scene, 2 battle style, 2 sound, 3 button mode, 10 frames).
  A / B on CANCEL saves and exits. Frame change reloads the window
  graphics live — that is the Pokemon live-preview pattern.
- HeartGold options_app.c is the same idea, later: full app,
  menu entries TEXT SPEED / BATTLE SCENE / BATTLE STYLE / SOUND /
  BUTTON MODE / FRAME, values saved back to player Options on exit.

## Mochiichao replacement, in that exact structure
Path: Main Menu -> SETTINGS (full screen, FireRed options layout)
  -> MENU CREATOR (full screen, same layout, next screen, NOT a popup)
  -> B: BACK saves and returns to SETTINGS, same as CANCEL.

Screen layout (full screen, Y2K theme, rounded glossy panels):
- Header window, top, full width: "MENU CREATOR"
- List window below it, one row per setting, cursor ► on the left:
  label left, current value right, LEFT/RIGHT cycles the value.
- Help bar, bottom, full width: "A: SELECT   LEFT/RIGHT: CHANGE   B: BACK"
- Live preview: changing a value that affects the frame/logo (like
  FireRed FRAME reloading graphics) shows it on the MAIN MENU the
  moment you go back — preview is the real menu, not a fake panel
  inside settings. A small preview strip is NOT added; Pokemon does
  not preview inside options, it shows the result on the real screen.
- Pages, because Menu Creator has more rows than Pokemon's 7:
  Page 1 LOGO, Page 2 BACKGROUND, Page 3 ANIMATION, Page 4 PANELS.
  Last row on each page is "NEXT PAGE" (except page 4, where it is
  "BACK TO SETTINGS"). Cursor wraps like Pokemon, page changes are
  a full-screen change, not a popup.

## Rows (same controls as v1, now as Pokemon rows)
Page 1 LOGO: Logo Image (OFFICIAL / V1 / V2 / V3), Logo Size (900),
  Logo Centre (50/50 ON), Outline Backing (BLACK ON), Outline Width,
  Chrome (BLUE/PINK), Orbit Ring (ON), Rainbow Arcs (ON), Logo Circles (ON)
Page 2 BACKGROUND: Symbols (300), Symbol Shapes, Symbol Colors,
  Golden Angle (137.5), Full Start (905), Gone Point (620),
  Golden Line (729), Fade Length (285), Full Width (ON)
Page 3 ANIMATION: Rise (ON), Rise Speed (5.5), Loop (SEAMLESS),
  Sine (ON), Side Sway (3), Bob (2), Fade On Rise (ON),
  Reduced Motion (FREEZE TO V32)
Page 4 PANELS: Panel Colors, Rounded Radius, White Border (ON),
  Glow (ON), Cloud (ON), Mochii Cue (ON), CONTINUE Sublabel (ON),
  BACK TO SETTINGS

## Lock rules (unchanged)
- Editing makes a preset, never overwrites locked v32 until Mars
  locks the new one. Reset to Locked Default (v32) is a row on
  Page 4. Symbols stay on symbol layer, top layers on top, clamped
  620-1500, never above logo.
- Phase 2 later: font, full colors, themes, day/night colorways —
  as new rows/pages in this same full-screen structure, not as a popup.

## UI CREATOR / UI EDITOR — sub-menu inside Menu Creator (Mars, 2026-10-25 17:18 CDT)
Name: UI CREATOR (also called UI Editor in this spec — same screen,
NOT "Menu Editor"). Path, all full screens, no popups:
  Main Menu -> SETTINGS -> MENU CREATOR -> UI CREATOR -> B: BACK
  returns to MENU CREATOR, same as Pokemon CANCEL saves+exits.

Pokemon structure first, same as Menu Creator v2:
- FireRed option_menu.c: dedicated full screen, header window,
  list window, help bar, label left / value right, UP/DOWN wraps,
  LEFT/RIGHT cycles value, CANCEL saves+exits.
- FireRed also has FRAME (10 window frame types) — that is the
  Pokemon precedent for editing a UI frame: pick a frame type,
  graphics reload live. UI Creator extends that same slot, it does
  not invent a new panel system.

What UI Creator edits (rows, grouped by Pokemon UI system):
Page 1 — MENU UI: Main Menu Panels, Title Logo, Pause Menu,
  Dialogue Box, Help Bar
Page 2 — BATTLE UI: Enemy Healthbox, Player Healthbox, Action Menu
  (FIGHT / Luigi Cube / Roster / Flee), Message Window, HP Bar
Page 3 — SYSTEM UI: Bag Window, Shop Window, PC Window, Party
  Window, Save Window, Settings Window itself
Each row: LEFT/RIGHT cycles its current style/value; A on a row
opens that element's own full-screen edit page (same layout),
with rows for: Frame Type, Outline, Rounded Radius, Border,
Glow, Panel Color, Text Color (Phase 2 font/colors apply here too).
Changing a frame reloads live on the real screen it belongs to
when you go back — Pokemon FRAME pattern, not a preview popup.

Lock rules: UI Creator edits presets only, never overwrites
locked v32 or any locked UI until Mars locks it. Reset to Locked
Default is a row on Page 3. Symbol layer rules, top-layer rules,
and the Pokemon-first rule all still apply inside UI Creator.

## UI vs LAYOUT — they are DIFFERENT, so BOTH sub-menus exist (Mars, 2026-10-25 17:19 CDT)
- UI = what an element LOOKS like: frame type, outline, border,
  rounded radius, glow, panel color, text color, HP bar style,
  button fill, shadow. That is UI CREATOR.
- LAYOUT = where an element GOES and how big it is: x, y, width,
  height, spacing, order, alignment, anchor, screen position.
  That is LAYOUT EDITOR, a second sub-menu, same level as UI Creator.
- Path, all full screens, no popups:
    Settings -> Menu Creator -> UI CREATOR
    Settings -> Menu Creator -> LAYOUT EDITOR
  B: BACK from either returns to Menu Creator.

## LAYOUT EDITOR rows (Pokemon coordinates first)
Pokemon layout facts already in the repo:
- FireRed option_menu.c windows: header (2,3) 26x2, list (2,7)
  26x12, help bar (0,0) 30x2 — tilemapLeft / tilemapTop / width /
  height are the layout fields, and LAYOUT EDITOR edits exactly
  those fields for Mochiichao windows.
- FireRed main_menu.c: CONTINUE (3,1) 24x10, NEW GAME (3,13) 24x2,
  third slot (3,17) 24x2 — separate windows, not one list.
- HeartGold dialog_box.c: dialogue X=2 Y=19 W=27 H=4, 2 lines.
- Mochiichao battle placements already in game: player
  (vw*0.22, vh*0.78), enemy (vw*0.78, vh*0.42).
Layout Editor pages:
Page 1 — MENU LAYOUT: Logo X/Y/W, Main Menu Panel X/Y/W/H,
  CONTINUE X/Y, NEW GAME X/Y, SETTINGS X/Y, BACK TO TITLE X/Y,
  Cloud X/Y, Mascot X/Y, Panel Spacing, Centre 50/50 lock
Page 2 — BATTLE LAYOUT: Enemy HP X/Y, Player HP X/Y, Action Menu
  X/Y, Message Window X/Y/W/H, Creature Positions, HP Bar W/H
Page 3 — SYSTEM LAYOUT: Dialogue X/Y/W/H, Pause Menu X/Y,
  Bag Grid, Shop List X/Y, Party List X/Y, Save Window X/Y,
  Screen Anchor (top-left / centre / bottom), Safe Area
Each row: LEFT/RIGHT cycles / nudges value; A opens that
element's full-screen layout page (X, Y, W, H, anchor, spacing).
Changing layout shows live on the real screen on return, same
as Pokemon FRAME reload — no preview popup.

## Everything pulled in — Menu Creator + UI Creator + Layout Editor
Sources, Pokemon-first order, all as ROWS (not just notes):
A. Game files we have (in repo):
   - FireRed: option_menu windows/inputs, main_menu windows,
     start_menu order, battle healthbox + 2x2 action menu,
     dialogue window, frame types (10).
   - HeartGold: options_app entries, dialog_box X/Y/W/H,
     time-of-day (for Phase 2 day/night layouts, not now).
   - Black 2: battle / menu window shapes as reference for
     later pages (not yet pulled into a row list — flagged).
B. Already in Mochiichao (HAVE, so they become rows, not new work):
   - v32 locked coordinates (logo 900, cloud 600,738, panels
     788/918/1008/1098, fade 905/729/620, symbols 300).
   - Y2K theme: glossy rounded panels, white border, glow,
     per-menu colors (Roster pink, Shop yellow, Bag green,
     Battle red/orange, PC blue, Garden purple).
   - uiArt.ts slotIds, StdWindow, MenuList, Pixi battle positions.
C. Open source we can use (MIT / CC0 / OFL, no paid, no Pokemon art):
   - PixiJS v8 (MIT, already in game): anchor, x/y, scale, ticker
     animation — layout anchor + animation rows come from this.
   - Tuxemon (GPL-3.0, reference only until licence decision):
     maps-as-data, menu as data — layout-as-data row (save layout
     as JSON, not code) comes from this idea.
   - Kenney CC0 UI packs (already in open-source pull list):
     rounded button / panel shapes as UI Creator frame options.
   - game-icons.net (CC BY 3.0, attribution only): icon shapes
     for cursor / button icons in UI Creator.
   - Bungee / Titan One / Fredoka (OFL lookalikes): Phase 2 font
     rows, already named in Y2K theme, not bought fonts.
D. Industry / academic (design rules, not code to copy):
   - 60-30-10 color proportion, golden ratio lines (573 / 927),
     phi fade split, reduced-motion freeze, 48px minimum touch
     target — these become Layout Editor / UI Creator defaults
     and limits, labelled as rules, not as Pokemon facts.
E. NOT pulled in: paid fonts, commercial Pokemon art/code/
   dialogue/towns/names, ROMs, >100 MB binaries — same boundary
   as tools/README.md. If a source needs a licence decision,
   its rows are marked REFERENCE ONLY until Mars decides.

All three menus (Menu Creator, UI Creator, Layout Editor) share
the same lock rule: presets only, Reset to Locked Default always
visible, only a new lock from Mars makes a preset the default.

## ALL Pokemon-editable UI, plus extra freedom rows (Mars, 2026-10-25 17:20 CDT)
Pokemon-first, labelled: P = Pokemon actually lets you edit this
in FireRed/HeartGold options or by frame choice. X = Mochiichao
extension for more freedom, NOT a Pokemon option — do not claim
Pokemon had it. All rows live in Menu Creator / UI Creator /
Layout Editor, full screens, LEFT/RIGHT cycles, A opens element page.

### P — Pokemon options (FireRed option_menu.c + HeartGold options_app.c)
- TEXT SPEED: SLOW / MID / FAST (3) — FireRed, HeartGold.
- BATTLE SCENE: ON / OFF (2) — animations on/off.
- BATTLE STYLE: SHIFT / SET (2).
- SOUND: MONO / STEREO (FireRed) ; in HeartGold SOUND METHOD.
- BUTTON MODE: NORMAL / LR / L=EQUALS=A (3 in FireRed).
- FRAME: FireRed 10 selectable frame types (option count 10,
  text_window_graphics.c types 1-10, each with its own tiles +
  palette .gbapal; global.h comment says 20 decorative borders
  in the RSE numbering, FireRed menu only cycles 10).
  HeartGold FRAME: 20 choices (options_app.c numChoices 20).
  Mochiichao row: FRAME 1-20, with FireRed 1-10 as the base set
  and HeartGold 11-20 as additional frame styles, all as
  ORIGINAL Mochiichao frames in those slots — no Pokemon frame
  tiles copied.
- FRAME PALETTES: stdpal_0-4 (5 palettes in text_window_graphics.c),
  option_menu.gbapal, main menu palette, signpost window,
  quest log window — these become Mochiichao palette rows.
- FONTS in game (not user-selectable in Pokemon options, but they
  ARE the game's fonts, so they become selectable rows here):
  FONT_SMALL, FONT_NORMAL, FONT_BOLD, FONT_MALE, FONT_FEMALE,
  FONT_BRAILLE. Mochiichao row: Font = Small / Normal / Bold /
  Male-style / Female-style / Braille-style, mapped to OFL
  lookalikes (Bungee / Titan One / Fredoka / rounded sans), never
  Pokemon font files copied.
- TEXT COLORS: option menu uses TEXT_COLOR_WHITE, DARK_GRAY,
  LIGHT_RED, RED, TRANSPARENT; text system has Save/RestoreText
  Colors with fg / bg / shadow. Rows: Text Color, Text Shadow
  Color, Background Color, Selected Text Color.
- DIALOGUE: HeartGold dialog_box X=2 Y=19 W=27 H=4, 2 lines,
  arrow; FireRed message window bottom full-width. Rows:
  Dialogue X/Y/W/H, Lines (2), Arrow Style, Text Speed (above),
  Dialogue Frame (FRAME row), Dialogue Portrait ON/OFF.
- PANELS / WINDOWS (all are WindowTemplates in Pokemon, so all
  become editable elements in UI Creator / Layout Editor):
  Main Menu windows, Start/Pause Menu, Options Header/List/Help,
  Battle Healthboxes (enemy top-left, player bottom-right),
  Battle Action Menu 2x2 + PP/TYPE, Party Menu, Bag/Item Menu,
  Shop Buy/Sell/Quit, PC Storage, Save Menu, Signpost, Quest Log.
  Each gets: Frame, Palette, X/Y/W/H, Border (see X below).

### X — Extra freedom rows (Mochiichao extensions, labelled X)
- Panel Border Radius (0-24, Y2K default 20+), Panel Glow
  (on/off, color, blur), Panel Shadow (on/off, offset, blur),
  Panel Opacity (100% default), Panel Border Width, White Border
  ON/OFF, Gradient Fill (Y2K cyan/blue/pink/purple), Outline
  Backing (black dilation, from logo work).
- Cursor: ► style, color, blink, selected highlight color.
- Per-element override: Global Frame vs Per-Element Frame toggle
  (Pokemon only had one global frame; per-element is the extra).
- Animation: Symbol count/density, Rise Speed, Sine Sway/Bob,
  Fade Length/Gone/Golden Line, Loop Seamless, Reduced Motion.
- Sound on cursor move / confirm / back (ON/OFF, volume).
- Touch target minimum 48px, Safe Area, Screen Anchor,
  Day/Night colorway override (Phase 2, game time).
- Presets: Save / Load / Reset to Locked Default (v32), Export
  preset as JSON (layout-as-data, Tuxemon idea, MIT/GPL rules
  as before — export is our own JSON, not Pokemon code).

All of the above are ROWS in the three menus, not notes. If a row
cannot be wired yet, it is marked NEED TO MAKE in the
Pokemon-element -> Mochiichao-replacement -> HAVE/NEED log.

## Interchangeable elements (Mars, 2026-10-25 17:27 CDT)
Every prototype element is a row/value, see
menu-elements-interchangeable-index.md. Nothing is deleted when
a new default is locked. Menu Creator picks the element, UI Creator
picks its look, Layout Editor picks its place/size. Rejected
defaults (v31, v22, v23, sparse flow) stay selectable, labelled.

## Corrections + new sub-menus (Mars, 2026-10-25 17:35 CDT)
### 1. FOOTER — NOT a Pokemon main-menu placement, corrected
- Pokemon files checked: main_menu.c has NO footer. Title screen
  DOES have copyright/press-start tiles (title_screen.c:
  gGraphics_TitleScreen_CopyrightPressStartTiles/Map) and a
  separate copyright screen after title (CB2_InitCopyrightScreen
  AfterTitleScreen). So a studio credit belongs on the TITLE
  screen, bottom, in that copyright slot — NOT as a main-menu footer.
- Correction: footer text is NOT "MOCHII STUDIOS". It is
  "M HEAVENSENT STUDIOS", and it is a LOGO, not text.
  Mars says he has that logo — it was NOT found in user/files
  on 2026-10-25, so: placeholder text "M HEAVENSENT STUDIOS" is
  used until Mars uploads the actual logo, then the logo replaces
  the text in the title copyright slot. Main-menu footer row is
  kept only as an optional extension, labelled X, default OFF.
- Asset to replace: footer-mochii-studios.png is SUPERSEDED.

### 2. HELP LINE / BACK TO TITLE — Pokemon does NOT do this on main menu
- Main menu (FireRed main_menu.c) is just windows: CONTINUE,
  NEW GAME, third slot. No help bar on the main menu screen.
- Help bar DOES exist on Options (option_menu.c, 30x2 bar,
  "PICK / SWITCH / CANCEL") and on other list screens.
- Correction: BACK TO TITLE stays as a MENU ROW (green, v32),
  not as a permanent help bar on the main menu. The help bar
  "A: SELECT  LEFT/RIGHT: CHANGE  B: BACK" belongs in
  Settings / Menu Creator / UI Creator / Layout Editor screens,
  where Pokemon puts help bars. Help-line asset is kept for
  those screens, not for the main menu.

### 3. DIAMOND VERSION SUBTITLE — placed on top of cloud, for now
- Per Mars: put back the pink-outline / white-font subtitle
  already made, placed on top of the cloud for now, until he
  looks at exact placement.
- Composite: menu-v32-subtitle-on-cloud.png — subtitle 700 wide,
  centred on cloud centre (600,738), on top of cloud layer.
  Placement is TEMPORARY, labelled as such, not locked.

### 4. CURSOR CREATOR — new sub-menu, Pokemon base + editable
- Pokemon base, list_menu.c / menu.c: cursor is a selector arrow
  (gText_SelectorArrow2, printed at the row), with a PALETTE:
  cursorPal and cursorShadowPal in ListMenuTemplate, plus
  cursorKind (arrow vs highlight). No glow ring in Pokemon —
  glow is a Mochiichao extension.
- New sub-menu: Settings -> Menu Creator -> CURSOR CREATOR
  Rows: Cursor Shape (ARROW / ► / GLOW RING), Cursor Color
  (cursorPal row, recolorable), Shadow Color (cursorShadowPal),
  Glow (ON/OFF, color, blur), Size, Blink (ON/OFF, speed),
  Highlight Row Color, Sound on Move.
  All full screens, B: BACK to Menu Creator.

### 5. PANEL FRAME EDITOR — new sub-menu, Pokemon base + editable
- Pokemon base: FRAME row, 10 FireRed / 20 HeartGold frame types,
  each with tiles + palette, plus std/signpost/quest palettes.
  Y2K glossy rounded panels are NOT Pokemon — they are the
  Mochiichao extension on top of the FRAME slot.
- New sub-menu: Settings -> Menu Creator -> PANEL FRAME EDITOR
  Rows: Frame Type (1-20), Frame Palette, Rounded Radius,
  Border Width, White Border, Gloss (ON/OFF), Glow, Shadow,
  Gradient, Panel Color (per menu: pink/yellow/blue/green).
  All full screens, B: BACK to Menu Creator.

### 6. SPARKLES / STARS / ORBIT — editable, research-based
- New rows in Menu Creator / UI Creator: Sparkles ON/OFF, Stars
  ON/OFF, Orbit ON/OFF, Sparkle Count, Sparkle Colors, Orbit
  Color/Width, Golden-Angle Placement (137.508), Fade with symbols.
- Research basis (see Real Research rule below): golden-angle
  placement, pastel Y2K on white, 60-30-10 proportion, saturated
  red/orange <2% of field, symbols as small variable reward cues
  (dopamine = anticipation, not pleasure after reward — Schultz,
  via color/neurochemistry report), twinkle every 3-7s max 1 at a
  time. Sparkle layer asset is a starting layer, not a final locked
  placement — Mars to eye-check the research version.
