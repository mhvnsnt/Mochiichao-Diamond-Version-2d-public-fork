# Mochioteka (Pokédex) + Pause Menu — per-generation research

Date: 2026-10-26. Research only. No code changed, no PR, no merge.
Scope rule used throughout: only trees actually on disk were read. Paths below are
relative to `~/workspace/mochiichao-work/` unless stated otherwise. The 11 trees are:

- Gen 1: `decomps/pokered`, `decomps/pokeyellow`
- Gen 2: `decomps/pokegold`, `decomps/pokecrystal`
- Gen 3: `decomps/pokeruby`, `decomps/pokeemerald`, `fresh-start/pokefirered-leafgreen`
- Gen 4: `decomps/pokediamond`, `decomps/pokeplatinum`, `fresh-start/pokeheartgold`
- Gen 5: `fresh-start/pokebw2`

Terminology warning, verified in the files: in Gen 5 Black 2/White 2 the file
`src/ov162/startmenu.c` is **not** the in-game pause menu. Its own header comment
says "The menu after the title screen" (Continue / New Game / …). The in-game
pause menu in Gen 5 is `src/ov036/field_menu.c`. Likewise, Gen 5's Pokédex UI is
not `src/system/pokedex.c` (save-data flags only); it is the `zukan*` overlays
(`ov296`–`ov302`). Do not wire the Gen 5 title menu in as a pause menu.

A second warning: Gen 4 HeartGold function names in the Pokédex overlay are
largely unrenamed (`ov18_021E5C40.c` etc.), so its layout below is described at
app/data level, not by readable function names. Diamond is the one real gap in
Gen 4 (see table).

## (a) Per-generation Pokédex layout

### Gen 1 — Red / Yellow — VERIFIED, same structure, small diffs

Files (both trees, same filenames):
`engine/menus/pokedex.asm` (`ShowPokedexMenu`, `HandlePokedexListMenu`,
`HandlePokedexSideMenu`, `ShowPokedexData` / `ShowPokedexDataInternal`,
`PokedexToIndex` / `IndexToPokedex`), `engine/gfx/load_pokedex_tiles.asm`
(`LoadPokedexTilePatterns`), `engine/menus/draw_start_menu.asm` (for entry only).

List layout — one column, 7 rows visible at once, starting at tile (1,3) with
the list header at (1,1) (`PokedexContentsText`). Each row: 3-digit number
(leading zeroes), a Poké Ball tile ($72) if owned, then the name — or
`----------` if not seen. Right side, separated by a vertical-line tile ($71)
at x=14: SEEN count at (16,3) and OWN count at (16,6), plus the side-menu
labels at (16,10) (`PokedexMenuItemsText`). Only species up to the highest seen
number (`wDexMaxSeenMon`) are listed at all; unseen-beyond-that do not appear.

Detail layout — full screen, bordered frame: top border row 0, bottom row 17,
left column x=0, right column x=19, corner tiles $63/$65/$6c/$6e, horizontal
divider at row 9 (`PokedexDataDividerLine`). Sprite (flipped front sprite) at
(1,1); name at (9,2); species/category text at (9,4); `№.` + number at (2,8);
`HT ?′??″` / `WT ???lb` labels at (9,6). Height/weight/description are printed
**only if owned** — if not owned, the code jumps straight to
`.waitForButtonPress` and prints none of them. The cry plays on entry
(`PlayCry` after `LoadFlippedFrontSpriteByMonIndex`). No type field is shown
on either screen in Gen 1. No footprint field.

Navigation — list: Up/Down = 1 row, Left/Right = 7 rows (a page), A = open the
side menu for the highlighted entry, B = exit. Side menu (placed at (15,10),
4 items, in this order): DATA, CRY, AREA, QUIT. Unseen entry chosen from the
list returns to the list without opening the side menu. Detail: A or B only,
returns to the list/side-menu loop; no prev/next stepping inside detail was
found in this file. Colour/frame: `SET_PAL_GENERIC` for the list,
`SET_PAL_POKEDEX` for detail, `GBPalWhiteOut` / `GBPalNormal` transitions.

Yellow differences (diff of the two files, not guessed): window-height
constants written as `lb bc, 14, 8` / `lb bc, 12, 8` instead of separate
`ld b` / `ld c`, and the start-menu label text differs (`#MON` in the Yellow
file vs `POKéMON` in Red's `draw_start_menu.asm`). Pokédex structure itself
is the same file with the same entry points.

Gaps (Gen 1): no search, no sort modes, no type display, no footprint, no
height/weight for seen-but-not-owned.

### Gen 2 — Gold / Crystal — VERIFIED, same structure, small diffs

Files (both trees, same filenames): `engine/pokedex/pokedex.asm` (`Pokedex`,
`InitPokedex`, `Pokedex_InitMainScreen`, `Pokedex_UpdateMainScreen`,
`Pokedex_InitDexEntryScreen`, `Pokedex_UpdateDexEntryScreen`, `Pokedex_Page`,
`Pokedex_InitOptionScreen`, `Pokedex_InitSearchScreen`,
`Pokedex_InitSearchResultsScreen`, `Pokedex_InitUnownMode`,
`Pokedex_ListingHandleDPadInput`, `Pokedex_PrintListing`,
`Pokedex_DrawMainScreenBG`, `Pokedex_DrawDexEntryScreenBG`,
`Pokedex_DrawOptionScreenBG`, `Pokedex_DrawSearchScreenBG`,
`Pokedex_DrawSearchResultsScreenBG`, `Pokedex_DrawUnownModeBG`,
`Pokedex_DrawFootprint`, `Pokedex_PlaceCaughtSymbolIfCaught`),
`engine/pokedex/pokedex_2.asm` (`DisplayDexEntry`),
`engine/pokedex/pokedex_3.asm`, `engine/pokedex/new_pokedex_entry.asm`,
`engine/pokedex/unown_dex.asm`.

List layout — two visual zones. Left sidebar: two bordered boxes
(7×7 at (0,0) and 6×7 at (0,9)), SEEN count at (5,12), OWN count at (5,15),
`SELECT > OPTION` at (1,17), `START > SEARCH` at (0,17). Main listing:
one column, rows spaced 2 tiles apart starting at (0,2)
(`Pokedex_PrintListing`), `wDexListingHeight` rows. In OLD mode each row also
prints its number above the name; in the newer mode the number is omitted.
Caught rows get the caught symbol ($4f); not-seen rows print `-----` instead
of a name. The selected entry's front sprite is shown at the top-left corner
area of the listing screen.

Detail layout — full-screen bordered box 15×18 at (0,0) plus a right-edge
column at x=19; divider row at y=10; `HT ?'??"` at (9,7), `WT ???lb` at (9,9);
bottom action bar at row 17, in this order: PAGE, AREA, CRY, PRNT (cursor
positions (1,17), (6,17), (11,17), (15,17) in
`DexEntryScreen_ArrowCursorData`, actions in `DexEntryScreen_MenuActionJumptable`).
`DisplayDexEntry` prints: name at (9,3), category/species text at (9,5),
`No.` + number at (2,8), then height/weight **only if caught**, then the
flavour text; PAGE toggles `wPokedexStatus` between the two text pages.
Footprint: a 2×2 footprint tile block drawn at (18,1)–(19,2)
(`Pokedex_DrawFootprint`, tiles $62–$65, loaded by
`Pokedex_LoadCurrentFootprint`). Cry plays on entry (`PlayMonCry`).
Type is **not** a detail-screen field here either; type appears only as the
search-screen filter (`Pokedex_UpdateSearchMonType` /
`Pokedex_PlaceSearchScreenTypeStrings`).

Navigation — listing: Up/Down = 1 row (cursor, then scroll),
Left/Right = a full page (`Pokedex_ListingMoveUpOnePage` /
`Pokedex_ListingMoveDownOnePage`); A = entry screen, START = search,
SELECT = option screen. Entry screen: Left/Right moves the bottom arrow
cursor across PAGE/AREA/CRY/PRNT, A activates it, B returns to the previous
screen; `Pokedex_NextOrPreviousDexEntry` steps between entries (the exact
key binding for that step was not quoted from the excerpt — do not assume
L/R). Option screen adds ordering modes (OLD / ABC / NEW in the mode code)
and Unown mode when unlocked (`STATUSFLAGS_UNOWN_DEX_F`).
Colour/frame: `Pokedex_PlaceBorder` boxes, `Pokedex_FillBackgroundColor2`,
SGB layout `SCGB_POKEDEX` (`Pokedex_GetSGBLayout`).

Gold vs Crystal diff: same layout and entry points; diffs are implementation
details only (Crystal: `GSReloadPalettes` vs Gold `ReloadPalettes`; Crystal
`FillBoxWithByte` helper vs Gold's inline fill loop; decompress-buffer address
spelling). No layout difference was found.

Gaps (Gen 2): no height/weight for seen-but-not-caught; no type on the detail
screen; the "PRNT" (Game Boy Printer) action has no web equivalent and should
be dropped, not ported literally.

### Gen 3 — Ruby / Emerald / FireRed — VERIFIED, two different systems

#### Ruby + Emerald (shared `pokedex.c` lineage)

Files: `src/pokedex.c`, `src/pokedex_area_screen.c`,
`src/pokedex_cry_screen.c`, `include/pokedex.h`, plus data
`src/data/pokemon/pokedex_entries.h` (category, height, weight, description),
`src/data/pokemon/pokedex_orders.h`, `src/data/pokemon/pokedex_text.h`.
Emerald-only extra: `src/pokedex_area_region_map.c`,
`src/data/pokedex_area_glow.h`.

List layout — full-screen list window: `sPokemonList_WindowTemplate`
(bg 2, 32×32 tiles at (0,0)). `MAX_MONS_ON_SCREEN` = 4 sprites shown at once
(Emerald `src/pokedex.c:107`); the list itself scrolls smoothly
(`TryDoPokedexScroll`, `UpdateDexListScroll`, `SpriteCB_Scrollbar`,
`SpriteCB_ScrollArrow`). Each list item is a `PokedexListItem` (dexNum +
seen/owned bits) in `PokedexView.pokedexList[NATIONAL_DEX_COUNT + 1]`, with
`seenCount` / `ownCount` totals. Unseen rows show the number + `----------`
(`sText_TenDashes`); owned rows get the caught-ball sprite
(`CreateCaughtBall`, `sCaughtBall_Gfx`). Modes: Hoenn vs National dex
(`DEX_MODE_HOENN` / `DEX_MODE_NATIONAL`); sort orders: Numerical, A–Z,
Heaviest, Lightest, Tallest, Smallest (`gPokedexOrder_Weight` /
`gPokedexOrder_Height` tables).

Detail layout — the Info screen is a full-screen set of windows, not a
single box: `sInfoScreen_WindowTemplates` = WIN_INFO (bg 2, 32×20 at (0,0)),
WIN_FOOTPRINT (bg 2, 2×2 at (25,8), palette 15 — `DrawFootprint` from
`data/pokemon_graphics/footprint_table.h`), WIN_CRY_WAVE (bg 0, 32×7 at
(0,12)), WIN_VU_METER (bg 2, 10×8 at (18,3)). `PrintMonInfo` prints, in
pixel coordinates: number (`{NO}000` format) at (0x60,0x19), name at
(0x84,0x19), category at (0x64,0x29), `HT` label at (0x60,0x39) + height at
(0x81,0x39), `WT` label at (0x60,0x49) + weight at (0x81,0x49), description
centred at y=95. Not-owned: category becomes `?????` (`gText_5MarksPokemon`),
height/weight become `???` (`gText_UnkHeight` / `gText_UnkWeight`),
description blank. A top select bar switches sub-screens
(`LoadScreenSelectBarMain`, `HighlightScreenSelectBarItem`): INFO, AREA,
CRY, SIZE, CANCEL — pages `PAGE_INFO` / `PAGE_AREA` / `PAGE_CRY` /
`PAGE_SIZE` (`src/pokedex.c:35–41`), tasks `Task_LoadAreaScreen`,
`Task_LoadCryScreen`, `Task_LoadSizeScreen`. Cry screen has its own layout
file (`pokedex_cry_layout.bin.lz` in Ruby) and a VU meter; Size screen
compares the creature silhouette against the player
(`sSizeScreenSilhouette_Pal`, `pokedex_heightweight`-style data).

Navigation — list: D-pad Up/Down steps (held = smooth scroll), Left/Right
steps too (`TryDoPokedexScroll` handles all four directions; L/R also step
when `optionsButtonMode == OPTIONS_BUTTON_MODE_LR`); A on a seen entry slides
the sprite to the info screen (`Task_OpenInfoScreenAfterMonMovement`,
`SpriteCB_MoveMonForInfoScreen`); START opens the in-dex menu
(`Task_HandlePokedexStartMenuInput`: BACK TO LIST / LIST TOP / LIST BOTTOM /
CLOSE POKéDEX, Up/Down cursor, START or B closes it); SELECT opens Search
(`LoadSearchMenu`, fade + `SE_PC_LOGIN`); B closes the dex. Info screen:
Left/Right (or L/R) moves the select-bar highlight between INFO/AREA/CRY/
SIZE/CANCEL, A activates, B exits back to the list.
Colour/frame: `LoadPokedexBgPalette` (search vs normal palettes differ),
Ruby embeds `graphics/pokedex/search.gbapal` and
`graphics/pokedex/national.gbapal`; no single hard-coded frame colour — the
frame is the GBA window/tilemap art.

Ruby vs Emerald: same file/function skeleton; Emerald adds the area region
map screen and the Frontier/Safari start-menu variants (see pause table).
No layout contradiction was found between them.

#### FireRed / LeafGreen (separate system — do not merge with Ruby/Emerald)

Files: `src/pokedex_screen.c` (`Task_PokedexScreen`,
`Task_DexScreen_NumericalOrder`, `Task_DexScreen_CharacteristicOrder`,
`Task_DexScreen_CategorySubmenu`, `Task_DexScreen_ShowMonPage`,
`DexScreen_DrawMonDexPage`, `DexScreen_DrawMonAreaPage`,
`DexScreen_InputHandler_StartToCry`), `src/pokedex.c` (flags only:
`DexScreen_GetSetPokedexFlag`), `src/pokedex_area_markers.c`,
`include/pokedex_screen.h`, data `src/data/pokemon/pokedex_categories.h`,
`pokedex_entries.h`, `pokedex_orders.h`, `pokedex_text.h`,
`pokedex_text_fr.h` / `pokedex_text_lg.h`.

List layout — starts at a **mode-select menu**, not a flat list:
`sWindowTemplate_ModeSelect` (bg 1, 20×16 at (1,2)) with items
`gText_PokemonList` / `gText_NumericalMode` (header) then the nine habitat
categories (headers + entries): Grassland, Forest, Waters Edge, Sea, Cave,
Mountain, Rough Terrain, Urban, Rare (`sListMenuItems_KantoDexModeSelect`).
Supporting windows: `sWindowTemplate_SelectionIcon` (8×6 at (21,11)),
`sWindowTemplate_DexCounts` (9×9 at (21,2)), top/bottom bars
(30×2 at (0,0) and (0,18), palette 15) in `sWindowTemplates`. Numerical list
is a `ListMenu` (`ItemPrintFunc_OrderedListMenu`,
`DexScreen_CreateDexOrderScrollArrows`); category pages show 4 creatures per
page (`pageSpecies[4]`, `categoryMonWindowIds[4]` /
`categoryMonInfoWindowIds[4]` in `PokedexScreenData`), with a category cursor
object and page-flip (`DexScreen_FlipCategoryPageInDirection`). Caught
marker art: `graphics/pokedex/caught_marker.4bpp`.

Detail layout — a "Dex page" (`DexScreen_DrawMonDexPage`) plus a separate
area page (`DexScreen_DrawMonAreaPage`); cry is triggered from the page by
`DexScreen_InputHandler_StartToCry` (START button on the page). Exact
pixel fields for number/name/category/height/weight/description on the
FireRed page were **not** quoted in this pass (the page is drawn through
window printers, not one `PrintMonInfo`-style function) — that is a gap to
close by reading `DexScreen_DrawMonDexPage` in full before porting, not by
copying Emerald's coordinates onto FireRed.

Navigation — mode select → numerical list or category page; shoulder
buttons are read by `DexScreen_InputHandler_GetShoulderInput`; vertical
scroll by `DexScreen_TryScrollMonsVertical`; START on a Dex page plays the
cry. A page/category is locked until unlocked
(`DexScreen_IsPageUnlocked`, `DexScreen_IsCategoryUnlocked`).

Gaps (Gen 3): FireRed page pixel layout unquoted (see above); no type field
on any Gen 3 detail screen found in this pass — type appears in battle/status
screens, not the dex detail.

### Gen 4 — Diamond: GAP · Platinum: VERIFIED · HeartGold: VERIFIED (obfuscated names)

#### Diamond — NOT VERIFIABLE as a screen layout

On disk: `arm9/src/pokedex.c` exists but is save-data logic only
(`Pokedex_CountSeen…`, `Pokedex_HasSeen…Form`, `Save_Pokedex_Init` in
`include/pokedex.h`); `include/start_menu.h` holds only a
`StartMenuState` enum plus a `StartMenuTaskData` struct explicitly marked
`// TODO: fill out` with filler fields. **No `start_menu.c` file was found
under `decomps/pokediamond/` and no Pokédex application/UI file was found
there.** Do not present a Diamond dex or pause layout: Diamond is a gap in
this tree, and its layout must not be inferred from Platinum.

#### Platinum — VERIFIED (dual-screen application)

Files: `src/applications/pokedex/pokedex_main.c` (`PokedexMain_Init`,
`PokedexMain_Main`, `PokedexMain_Exit`, `PokedexMain_NewPokedexApp`,
`PokedexState`: TRANSITION_IN / USE / TRANSITION_OUT / WAIT_EXIT),
`pokedex_panel.c` (`PokedexPanelData`), `pokedex_sort.c`, `pokedex_search.c`,
`pokedex_graphics.c`, `pokedex_text.c` / `pokedex_text_manager.c`,
`pokedex_updater.c`, `pokedex_enc_data.c`, `pokedex_field_map.c`,
`pokedex_height_check.c`, `infomain.c` (info screen), `formmain.c` /
`formsub.c` (form screens), `crysub.c` (cry, sub-screen),
`footprint.c`, `src/pokedex.c` (save data), `src/pokedex_heightweight.c`
(`Pokedex_HeightWeightData`, height/weight arrays + trainer/creature
position and scale for the height-comparison screen),
`src/pokedex_data_index.c`, `src/pokedex_language.c`,
`src/pokedex_memory.c`.

Layout — a DS application spanning **both screens**: main screen + sub
screen (`DS_SCREEN_MAIN` / `DS_SCREEN_SUB`,
`ResetVisibleHardwareWindows` for both in `PokedexMain_Main`),
`FADE_BOTH_SCREENS` brightness fades on entry/exit, GX bank setup
(`PokedexMain_InitGX`). The app is updater-driven: four `PokedexUpdater`
instances (main/sub × panel/text) with `PokedexUpdater_UpdateData` /
`UpdateGraphics`. Sub-screens: Info (`infomain.c`), Forms (`formmain.c`,
with `FormCategory` and per-form sprite/text boxes), Cry (`crysub.c`),
Height-check (`pokedex_height_check.c` + `Pokedex_HeightWeightData` —
creature vs trainer scale/position, the Gen 4 version of Gen 3's Size
screen), Area/field map (`pokedex_field_map.c`), Search (`pokedex_search.c`),
Sort (`pokedex_sort.c`). Exact per-field pixel coordinates were not
extracted in this pass (the DS app lays fields out through graphics/text
managers, not one print function) — same gap class as FireRed, but the
screen *set* and the height/weight data path are verified.

Navigation — application state machine (`PokedexMain_Main` switches on
`PokedexState`); touch + buttons are both in play on DS (the panel code
exposes button width/height via `PokedexPanel_GetCurrentButtonWidthHeight`);
exact key map for list/detail switching was not quoted here — mark as
unquoted, not as absent.

#### HeartGold — VERIFIED at app level, names obfuscated

Files: `src/application/pokedex/ov18_021E590C.c`,
`ov18_021E5AA0.c` (`Pokedex_Init` / `Pokedex_Main` / `Pokedex_Exit`,
`PokedexAppData`, `HEAP_ID_POKEDEX_APP`), `ov18_021E5C40.c` (the large
implementation file: list rendering into tile buffers,
`PokedexApp_3DigitNumToTiles`, windows array, seen/caught checks
`Pokedex_CheckMonCaughtFlag`, language/international-view checks),
`ov18_021E8BF4.c`, `src/pokedex.c` / `src/pokedex_util.c`,
`include/application/pokedex/pokedex_internal.h`,
`pokedex_internal_constants.h`, `include/pokedex.h`.
Layout facts verified: DS overlay application with a `PokedexAppData`
windows array; list rows rendered as 3-digit numbers into tile buffers;
NatDex flag gates the list (`Pokedex_GetNatDexFlag`); Giratina form
handling on init (`SetDexBanksByGiratinaForm`). The readable detail fields
(number/name/category/height/weight/description/footprint/cry) are **not**
named in this tree's function list, because the implementation functions
carry `ov18_…` addresses instead of names — a rename pass would be needed
before a field-level HeartGold port. Do not copy Platinum's field layout
onto HeartGold and call it HeartGold's.

Gaps (Gen 4): Diamond entirely; Platinum/HeartGold pixel-level field
positions unquoted; HeartGold function-level names unrecovered.

### Gen 5 — Black 2 / White 2 — VERIFIED (zukan overlays, not `pokedex.c`)

Files: `src/ov302/zukan.c` / `zukan_common.c` (app entry),
`src/ov299/zukanlist.c` (`ZukanList_ProcInit` / `ZukanList_ProcMain` /
`ZukanList_ProcEnd`, `ZukanList_ProcFunctions`),
`src/ov300/zukansearch.c`, `src/ov301/zukan_open.c`,
`src/ov298/zukan_detail.c` / `zukan_detail_common.c` /
`zukan_detail_graphic.c` / `zukan_detail_headbar.c` /
`zukan_detail_info.c` / `zukan_detail_map.c` / `zukan_detail_procsys.c` /
`zukan_detail_touchbar.c` / `zukan_detail_voice.c` /
`zukan_detail_form.c` / `zukan_detail_form_data.c`,
`src/ov296/zukan_info.c`, `src/ov297/zukan_nickname.c` /
`zukan_toroku.c` / `zukan_toroku_graphic.c`,
`include/app/zukan_detail.h`, `include/app/zukan.h`,
`include/app/zukanlist.h`, `include/app/zukansearch.h`,
data `res/text/system/pokedex_entries*.txt` (entries),
`pokedex_heights*.txt`, `pokedex_weights*.txt` (per-language height/weight
text), `src/system/pokedex.c` (save flags only — see warning above),
`src/system/pokedex_skin_save.c` (dex skin/appearance save).

List layout — a GameProc-based list (`zukanlist.c` is a thin proc wrapper;
the rendered list itself lives in the zukan common/graphic code). The
detail side is the best-documented part: detail pages are an enum in
`include/app/zukan_detail.h:19–23` — `ZUKAN_DETAIL_PAGE_NONE`,
`ZUKAN_DETAIL_PAGE_INFO`, `ZUKAN_DETAIL_PAGE_MAP`, `ZUKAN_DETAIL_PAGE_VOICE`,
`ZUKAN_DETAIL_PAGE_FORM` — driven through a touch bar
(`ZukanDetailTouchbar_SetType` / `SetPage` in `zukan_detail_info.c:230–234`).
So Gen 5 detail = Info + Map (area) + Voice (cry) + Form pages, touch-bar
switched, with a headbar (`zukan_detail_headbar.c`) and a form-data table
(`zukan_detail_form_data.c`). Height/weight text exists as data
(`pokedex_heights*.txt`, `pokedex_weights*.txt`); the Info-page pixel
layout was not quoted in this pass (same gap class as FireRed/Platinum).
Search is its own proc (`zukansearch.c`, `zukan_search_engine.h`);
habitat data is separate (`zukan_habitat.h`,
`src/system/zukan_habitat_savedata.c`).

Navigation — list proc + detail proc system (`GameProcFunctions`);
touch-bar page switching is verified; the exact button/touch key map for
list→detail and detail-page stepping was not quoted — mark unquoted.

Gaps (Gen 5): list pixel layout and detail Info-page pixel layout
unquoted; footprint presence in the Gen 5 detail UI was not confirmed in
this pass (footprint files exist for Gen 3/Gen 2; do not assume Gen 5
keeps the footprint block).

### Pokédex summary table

| Gen | Trees | Verifiable layout? | List | Detail fields verified | Navigation verified | Gaps |
|---|---|---|---|---|---|---|
| 1 | Red, Yellow | Yes | 1 col, 7 rows, number + ball + name/`----------`, SEEN/OWN counts right side | Number, name, category, HT, WT, description (owned only), sprite, cry | Up/Down 1, Left/Right 7, A side menu, B exit; side menu DATA/CRY/AREA/QUIT | No search/sort/type/footprint; no HT/WT if not owned |
| 2 | Gold, Crystal | Yes | 1 col, 2-tile rows, sidebar SEEN/OWN, caught symbol, `-----` unseen; OLD mode adds numbers | Number, name, category, HT, WT, description (caught only), footprint 2×2, cry, 2 text pages; bottom PAGE/AREA/CRY/PRNT | Listing Up/Down 1, Left/Right page; START search, SELECT option; entry Left/Right over 4 actions, A act, B back | No type on detail; PRNT is hardware-only |
| 3 | Ruby, Emerald | Yes | Full-screen window, smooth scroll, 4 sprites, caught ball, `----------` unseen; Hoenn/National + 6 sort orders | Number, name, category, HT, WT, description (owned only), footprint 2×2, cry wave + VU meter, area map, size compare; select bar INFO/AREA/CRY/SIZE/CANCEL | D-pad step/scroll, A info, START in-dex menu, SELECT search, B close; info bar Left/Right + A | No type on detail |
| 3 | FireRed/LeafGreen | Yes (page pixels unquoted) | Mode-select first: Numerical list OR 9 habitat categories, 4 per category page, dex-counts + icon windows | Dex page + area page; cry via START on page; category/page unlock gates | Mode select → list/page; shoulder input; vertical scroll; page flip | Dex-page pixel fields unquoted |
| 4 | Diamond | **No — gap** | — | — (save data only) | — | No dex UI file, no `start_menu.c` found; `start_menu.h` is a TODO stub |
| 4 | Platinum | Yes (pixels unquoted) | DS app, updater-driven, main+sub screens | Info, Forms, Cry, Height-check (vs trainer), Area map, Search, Sort; height/weight data path verified | App state machine; panel buttons; exact key map unquoted | Pixel field positions unquoted |
| 4 | HeartGold | Yes at app level (names obfuscated) | DS overlay app, 3-digit tile-buffer list rows, NatDex-gated | App/data verified; field-level names not recovered | Proc/app entry verified; key map unquoted | `ov18_…` names; field positions unquoted |
| 5 | Black 2/White 2 | Yes (pixels unquoted) | GameProc list (`zukanlist.c`) + search proc | Detail pages INFO/MAP/VOICE/FORM via touch bar + headbar; height/weight text data; form data | Touch-bar page switching verified; list→detail key map unquoted | List/detail pixel layout unquoted; footprint unconfirmed |

## (b) Per-generation pause / start menu (in-game, mid-game menu)

"Entries in order" below means the **normal-field** order (no Safari, link,
contest, or facility variants) unless a variant is named. Every generation
builds its list dynamically: entries are hidden when not yet obtained, so
the order is a filtered order, not a fixed row count.

### Gen 1 — Red / Yellow — VERIFIED

Files: `engine/menus/draw_start_menu.asm` (`DrawStartMenu`),
`home/start_menu.asm` (`DisplayStartMenu`, `RedisplayStartMenu`,
`CloseStartMenu`, `StartMenu_Pokedex` / `_Pokemon` / `_Item` /
`_TrainerInfo` / `_SaveReset` / `_Option`).

Layout — a text box at (10,0), width 8 tiles, height $0e (14) with the
dex, $0c (12) without it (`TextBoxBorder`); first item at (11,2); items
printed 2 rows apart (`PrintStartMenuItem`, `SCREEN_WIDTH * 2` steps);
watched keys: Down/Up/Start/B/A. The menu remembers the last selection
(`wBattleAndStartSavedMenuItem`). Safari Zone step text is overlaid by
`PrintSafariZoneSteps` when applicable.

Entries in order (with dex): POKéDEX, POKéMON, ITEM, [player name],
SAVE (or RESET when link-connected), OPTION, EXIT. Without the dex the
first row drops out and the count drops from 7 to 6; Up/Down wrap around
at both ends. Submenus: A opens the chosen screen (each `StartMenu_*`
handler); B or START closes; EXIT falls through to `CloseStartMenu`
(restores text-box tiles, `CloseTextDisplay`). No icons, no descriptions,
no second column.

### Gen 2 — Gold / Crystal — VERIFIED

Files: `engine/menus/start_menu.asm` (`StartMenu`, `.SetUpMenuItems`,
`.MenuReturns`, `StartMenu_Pokedex` / `_Pokemon` / `_Pack` / `_Status` /
`_Save` / `_Option` / `_Exit` / `_Pokegear` / `_Quit`, `.MenuHeader` /
`.ContestMenuHeader`).

Layout — variable-length menu box (`LoadMenuHeader`,
`DrawVariableLengthMenuBox`) with a second, optional description box:
the "menu account" box at (0,13), 3×8, shown only when the MENU_ACCOUNT
option bit is set (`.DrawMenuAccount`, `.PrintMenuAccount`), printing each
item's description text (`.PokedexDesc` etc. alongside `.PokedexString`).
Bug Contest replaces the header and adds a contest status box
(`StartMenu_DrawBugContestStatusBox`, `StartMenu_PrintBugContestStatus`).
Cursor position persists in `wBattleMenuCursorPosition`.

Entries — the **build order** in `.SetUpMenuItems` (each appended only if
its condition holds): #DEX (if dex flag), #MON (if party non-empty), PACK
(unless link mode or Bug Contest), POKéGEAR (if obtained), [player name]
(always), SAVE (unless link mode; QUIT replaces SAVE during Bug Contest),
OPTION, EXIT. So the normal-field order is: #DEX, #MON, PACK, POKéGEAR,
[player], SAVE, OPTION, EXIT. Submenus: `.OpenMenu` dispatches to the
item handler; `.MenuReturns` decides Reopen vs Exit vs close-text variants
per item (e.g. saving exits; most screens reopen the menu on return).
B exits (`GetInput` returns carry on B).

### Gen 3 — Ruby / Emerald / FireRed — VERIFIED

Files (Emerald, representative): `src/start_menu.c`
(`sStartMenuItems`, `BuildStartMenuActions`,
`BuildStartMenuActions_Normal` / `_SafariZone` / `_Link` /
`_BattlePyramid` variants, `PrintStartMenuActions`, `InitStartMenuStep`,
`Task_StartMenu`, `StartMenu_InputProcessCallback`),
`include/start_menu.h`. Ruby: same skeleton with `SystemText_*` labels and
`StartMenu_*Callback` names. FireRed: `src/start_menu.c`
(`sStartMenuActionTable`, `SetUpStartMenu_NormalField` /
`_SafariZone` / `_Link` / `_UnionRoom`, `sStartMenuDescPointers`).

Layout — a standard framed window: `DrawStdWindowFrame(AddStartMenuWindow
(sNumStartMenuActions), FALSE)`; items printed at x=8, y=(index×16)+9
(`PrintStartMenuActions`, one 16-px row per item, player name printed via
`PrintPlayerNameOnWindow`). Extra context windows sit beside it when
relevant: Safari Balls window (`sWindowTemplate_SafariBalls`), Battle
Pyramid floor/peak window (`sWindowTemplate_PyramidFloor` /
`_PyramidPeak`), save-info window (`sSaveInfoWindowTemplate`). FireRed
adds per-item description pointers (`sStartMenuDescPointers`).

Entries in order, normal field — Emerald: POKéDEX, POKéMON, BAG, POKéNAV,
[player], SAVE, OPTION, EXIT. Ruby: same, except POKéNAV is spelled
POKENAV in its labels and the Safari variant is RETIRE-first. FireRed:
POKéDEX, POKéMON, BAG, [player], SAVE, OPTION, EXIT (no POKéNAV entry in
FireRed's `STARTMENU_*` enum). Variants change the set, not the base
order: Safari puts RETIRE first and drops SAVE; Link drops POKéDEX/SAVE
and uses a link player entry; Battle Pyramid (Emerald) uses PYRAMID_BAG
plus REST/RETIRE and drops SAVE. Submenus: each entry is a
`MenuAction` {text, callback} (`StartMenuPokedexCallback` etc.); the
callback returns and the task either reopens the menu or closes it
(START/B close; the menu task is `Task_StartMenu`).

Gaps (Gen 3 pause): exact window x/y/width for the main start-menu window
is computed by `AddStartMenuWindow(count)` and was not quoted as literal
coordinates in this pass — the row geometry (x=8, 16-px rows) is verified,
the box origin is not.

### Gen 4 — Diamond: GAP · Platinum: VERIFIED · HeartGold: VERIFIED

#### Diamond — NOT VERIFIABLE

No `start_menu.c` found; `include/start_menu.h` is a state enum +
TODO-stub struct only (see Pokédex section). Do not infer Diamond's pause
menu from Platinum.

#### Platinum — VERIFIED (icon menu, not a text list)

Files: `src/start_menu.c` (`StartMenu_Open`, `StartMenu_OpenUnionRoom`,
`StartMenu_OpenColosseum`, `StartMenu_OpenFromScript`, `StartMenu_New`,
`StartMenu_Main`, `StartMenu_InitMenu`, `StartMenu_Select`,
`StartMenu_MakeOptionList`, `StartMenu_Close`, `StartMenu_InitSprites`,
`StartMenu_SetCursorPos`, `StartMenu_SetIconAnimationAndPalette`,
`StartMenu_ChangeActiveMenuIcon`,
`StartMenu_TryTransitionIconAnimationToWiggle`,
`sStartMenuActions`), `include/start_menu.h` (assumed; the enum below is
from `src/start_menu.c:94–103`).

Layout — icon-based: each option is a sprite with its own animation and
palette (`StartMenu_InitSprites`, per-gender sprites); the cursor is a
sprite positioned by `StartMenu_SetCursorPos`; the selected icon can
transition to a "wiggle" animation. A Safari ball-count readout is drawn
by `StartMenu_PrintBallCount` / `EraseBallCount`. This is a different
interaction shape from Gen 1–3's text window: the editor must not reuse a
text-list layout and call it Platinum-style.

Entries — enum order (`StartMenuOption`): POKéDEX, POKéMON, BAG,
TRAINER_CASE, SAVE, OPTIONS, EXIT, CHAT, RETIRE. Displayed set =
enum order minus hide flags (`StartMenu_GetNormalHiddenOptions` etc.):
normal field hides POKéDEX (if not obtained), POKéMON (if no starter /
in Amity Square), BAG (if not acquired / in Amity Square), and always
hides CHAT and RETIRE; Safari hides SAVE+CHAT; Pal Park hides
SAVE+CHAT+BAG; Battle Tower Salon hides POKéDEX+BAG+SAVE+CHAT+RETIRE;
Union Room hides SAVE+RETIRE; Colosseum hides SAVE+POKéDEX+CHAT+RETIRE.
So normal-field display order is: POKéDEX, POKéMON, BAG, TRAINER_CASE
(player name), SAVE, OPTIONS, EXIT. Submenus: `StartMenu_Select*` +
`StartMenu_Open*` / `Exit*` task pairs per option
(`StartMenu_SelectPokedex` → `StartMenu_OpenPokedex` →
`StartMenu_ExitPokedex`, and likewise TrainerCase, Options, Chat,
Pokemon/party, Bag, Save, Retire); the menu is a `FieldSystem` task
(`StartMenu_Main` state machine), and returning from a submenu resumes
the task rather than rebuilding the menu from scratch.

#### HeartGold — VERIFIED (button/icon menu with touch)

Files: `src/start_menu.c` (`StartMenu_Create`, `Task_StartMenu`,
`Task_StartMenu_DrawCursor`, `Task_StartMenu_HandleInput`,
`StartMenu_HandleKeyInput`, `StartMenu_HandleTouchInput`,
`StartMenu_BuildActionLists`, `StartMenuButton_Insert`,
`StartMenu_CreateCursor` / `DestroyCursor`,
`Task_StartMenu_HandleSelection_Pokedex` / `_Pokemon` / `_Bag` …,
`Task_StartMenu_WaitFade` / `WaitApp`),
`include/constants/start_menu_icons.h`, `include/start_menu.h`.

Layout — button-based with both key and touch input paths
(`StartMenu_HandleKeyInput` and `StartMenu_HandleTouchInput` are
separate functions); cursor is a created sprite (`StartMenu_CreateCursor`,
gender-parameterised). Background art is loaded from NARC
(`GfGfxLoader_GXLoadPal(NARC_a_0_1_4, …)`, screen data on
`GF_BG_LYR_MAIN_3` in the excerpt).

Entries — enum order (`StartMenuAction`): POKéDEX, POKéMON, BAG,
TRAINER_CARD, SAVE, OPTIONS, RUNNING_SHOES, [7, unnamed in enum],
RETIRE, [9, 10, unnamed], POKéGEAR, [12, unnamed]. **Display order was
not verified as enum order**: the visible order is built by
`StartMenu_BuildActionLists` via `StartMenuButton_Insert` (insertion
order + display order are separate outputs), gated by inhibit-flag
functions per context (`…_Normal`, `…_Safari`, `…_BugContest`,
`…_PalPark`, `…_BattleTowerMultiPartnerSelectRoom`). Do not ship the
enum order as HeartGold's display order without reading
`StartMenu_BuildActionLists` in full. Submenus: per-action selection
handlers (`Task_StartMenu_HandleSelection_*`) + open/wait/return task
triples; RUNNING_SHOES is a toggle-style entry, not a screen (its
handler differs from the screen-opening handlers — verify before
porting it as a submenu).

### Gen 5 — Black 2 / White 2 — VERIFIED (icon grid, not a list)

Files: `src/ov036/field_menu.c` (`FieldMenu`, `FieldMenuItem`,
`FieldMenuItemSetup`, `FieldMenu_CreateItem`, `FieldMenu_MoveCursor`,
`FieldMenu_UpdateKeys`, `FieldMenu_UpdateTouch`,
`FieldMenu_SelectOrCancel`, `FieldMenu_PulseCursorTCB`,
`FIELD_MENU_ITEMS`, `FIELD_MENU_SLOT_COORDINATES`,
`FIELD_MENU_NAME_WINDOW_POSITIONS`, `FIELD_MENU_CURSOR_MOVES`,
`FIELD_MENU_ICON_FILES`), `src/ov036/field_subscreen.c`,
`src/ov036/field_menu_event.c`, `src/ov012/event_field_menu.c`.
(The title-screen file `src/ov162/startmenu.c` is listed here only to
exclude it: Continue / New Game / Mystery Gift / Battle Competition /
Game Sync / WFC Settings / Mic Test / Unova Link — that is the
title menu, not the pause menu.)

Layout — a 2-column icon grid on the touch screen, 7 slots total:
slot coordinates (col,row) = (0,0), (1,0), (0,1), (1,1), (0,2), (1,2),
(0,3); name-window positions = (6,4), (22,4), (6,10), (22,10), (6,16),
(22,16), (13,21) (`FIELD_MENU_NAME_WINDOW_POSITIONS`,
`FIELD_MENU_SLOT_COORDINATES`). Slot 6 (bottom, (0,3)) is the RETURN
button. Each item has an icon triple (character/cell/animation file ids
in `FIELD_MENU_ICON_FILES`, 11 rows including female-player variants for
Bag/Pokédex/Retire). Cursor: pulsing colour between two endpoints
(`sCursorColorEndpoints`: {9,31,18}→{17,31,23} and {0,25,18}→{31,31,31},
`FieldMenu_PulseCursorTCB`); cursor movement is a per-menu-type table
(`FIELD_MENU_CURSOR_MOVES[3][8][4]`, for 4-, 5- and 6-item menus; 6 =
return button). States: SCROLL_IN / PRINT / WAIT_WIPE / INPUT /
WAIT_RETURN_BUTTON / DECIDE / WAIT_CURSOR / CLOSED / SELECTED /
SCROLL_OUT / DONE.

Entries in order, normal field (`FIELD_MENU_TYPE_NORMAL`, slot order
0–5 + return): POKéMON, POKéDEX, BAG, TRAINER_CARD, SAVE, OPTIONS,
RETURN. Variants: Union Room / Royal Unova / Force Season Sync drop
SAVE (OPTIONS, NONE, RETURN in slots 4–6); No-Pokédex drops POKéDEX
(POKéMON, BAG, TRAINER_CARD, SAVE, OPTIONS, NONE, RETURN); No-Pokémon
drops POKéMON+POKéDEX (BAG, TRAINER_CARD, SAVE, OPTIONS, NONE, NONE,
RETURN); Inf-Dungeon (in-game dungeon) uses POKéMON, POKéDEX,
TRAINER_CARD, SAVE, OPTIONS, RETIRE, RETURN. Submenus: selecting an
item scrolls the menu out (`FIELD_MENU_STATE_SCROLL_OUT`) and opens the
subscreen (`field_subscreen.c`); cancelling restores the subscreen
(`FieldMenu_RestoreSubscreenOnCancel`); both key and touch input paths
exist (`FieldMenu_UpdateKeys`, `FieldMenu_UpdateTouch`).

### Pause / start menu summary table

| Gen | Trees | Verifiable? | Normal-field entries in order | Layout | Gaps |
|---|---|---|---|---|---|
| 1 | Red, Yellow | Yes | POKéDEX, POKéMON, ITEM, [player], SAVE/RESET, OPTION, EXIT (6 without dex) | Text box (10,0), 8 wide, 14/12 high, items at x=11, 2 rows apart, remembered cursor, wrap-around | — |
| 2 | Gold, Crystal | Yes | #DEX, #MON, PACK, POKéGEAR, [player], SAVE/QUIT, OPTION, EXIT | Variable-length box + optional description box (0,13) if MENU_ACCOUNT set; contest header variant | — |
| 3 | Ruby, Emerald | Yes | POKéDEX, POKéMON, BAG, POKéNAV, [player], SAVE, OPTION, EXIT | Framed window, items x=8, 16-px rows; Safari/Pyramid context windows | Main box origin unquoted (computed by `AddStartMenuWindow`) |
| 3 | FireRed/LeafGreen | Yes | POKéDEX, POKéMON, BAG, [player], SAVE, OPTION, EXIT | Same window system + per-item descriptions | No POKéNAV entry (verified absence in enum) |
| 4 | Diamond | **No — gap** | — | — | No `start_menu.c`; header is a TODO stub |
| 4 | Platinum | Yes | POKéDEX, POKéMON, BAG, TRAINER_CASE, SAVE, OPTIONS, EXIT | Icon sprites + sprite cursor + wiggle on select; hide-flag filtering | Exact icon coordinates unquoted |
| 4 | HeartGold | Yes (display order unquoted) | Enum: POKéDEX, POKéMON, BAG, TRAINER_CARD, SAVE, OPTIONS, RUNNING_SHOES, …, RETIRE, …, POKéGEAR | Button/icon menu, key + touch input, sprite cursor | Display order ≠ proven enum order; unnamed enum slots 7/9/10/12 |
| 5 | Black 2/White 2 | Yes | POKéMON, POKéDEX, BAG, TRAINER_CARD, SAVE, OPTIONS, RETURN | 2-col icon grid, 7 slots, pulsing cursor, per-type cursor-move tables | Title menu (`ov162/startmenu.c`) must not be confused with this |

Note the Gen 5 order break: it is the only generation where POKéMON
precedes POKéDEX in the pause menu (Gen 1–4 all put the dex first). An
editor that offers "Pokémon order" as a preset must keep that distinction.

## (c) Mapping: Pokémon element → Mochioteka / Pause Editor replacement → HAVE / NEED TO MAKE

HAVE is judged strictly against what was read in
`menu-editor-tree/src/components/views/DexView.tsx` (230 lines, read
2026-10-26) and the views directory listing of that tree (12 views:
ArenaBattleView, BagView, BattleView, CheatConsoleView, CreatureModeView,
DexView, GardenView, HubView, PcView, RingCaptureView, RosterView,
ShopView — **no PauseView / StartMenuView file in that listing**).
Nothing else in the Mochiichao repo was counted as HAVE for this table.
A "PARTIAL" counts as HAVE for the part named and NEED for the rest.

### Mochioteka (dex) mapping — 16 elements counted

| # | Pokémon element (exact spot) | Mochioteka replacement in that exact spot | HAVE / NEED TO MAKE |
|---|---|---|---|
| 1 | List: number-ordered rows (all gens) | Number-ordered rows #001… in DexView | HAVE |
| 2 | List: name per row, `----------`/`-----` if unseen (Gen 1/2) | Name if discovered, literal `???` if not (DexView) | HAVE |
| 3 | List: owned marker — Poké Ball tile / caught symbol (Gen 1/2/3) | Status word Caught/Seen/Undiscovered per row (DexView) — icon form not present | PARTIAL — HAVE (status text), NEED (caught icon tile) |
| 4 | List: SEEN count + OWN count, separate (Gen 1/2/3) | One combined line: Discovered X / ROSTER_COUNT + unfilled-slot count (DexView header) | PARTIAL — HAVE (combined count), NEED (separate Seen vs Own counts) |
| 5 | List: sprite/icon per row (Gen 2 selected sprite; Gen 3 4 sprites) | Static 48-px `CreaturePortrait` per row, `animateIdle=false` (DexView) | HAVE |
| 6 | List: undiscovered silhouette, name hidden (DexView's own PR #175 rule; Gen 1–3 show dashes, not art) | Silhouette portrait + `???` (DexView, `undiscovered=true`) | HAVE |
| 7 | List: unfilled slots #047–#146 as `?` tiles (Mochioteka-only; no Pokémon equivalent — Pokémon lists stop at max seen) | `?` tile rows #047–#146 (DexView) | HAVE (Mochioteka original, not a port) |
| 8 | Detail: portrait, large (all gens) | 128-px `CreaturePortrait`, idle-animated when discovered (DexView detail) | HAVE |
| 9 | Detail: number + name + status (all gens) | `#NNN name` + Caught/Seen/Undiscovered (DexView detail) | HAVE |
| 10 | Detail: type pills — **not a dex-detail field in Gen 1–3** (type lives in battle/status); Gen 2 uses type only for search | Type pills in detail (DexView, from `species.ts`) | HAVE, but only where a `species.ts` entry exists (12 species) — NEED for the other 37 roster species |
| 11 | Detail: description / flavour text (all gens, owned/caught only) | Description paragraph (DexView, from `species.ts`) | PARTIAL — same 12-species limit as #10; NEED for 37/49 roster species (37/49 = 76% still owed on this field) |
| 12 | Detail: height + weight (all gens, owned/caught only; Gen 3 pixel spots (0x81,0x39)/(0x81,0x49)) | — no height/weight row in DexView | NEED TO MAKE |
| 13 | Detail: category / species text (Gen 1 (9,4); Gen 2 (9,5); Gen 3 (0x64,0x29)) | — no category line in DexView | NEED TO MAKE |
| 14 | Detail: footprint 2×2 block (Gen 2 (18,1); Gen 3 (25,8)) | — no footprint in DexView | NEED TO MAKE |
| 15 | Detail: cry playback on entry (Gen 1/2) + dedicated CRY/VOICE page (Gen 2 bottom bar; Gen 3 CRY screen + VU meter; Gen 5 VOICE page) | — no cry button/playback in DexView | NEED TO MAKE |
| 16 | Detail sub-screens: AREA/MAP, SIZE/height-check, FORM (Gen 2 AREA; Gen 3 AREA+SIZE; Gen 4 Forms+Height-check; Gen 5 MAP+FORM) | — no sub-screen tabs in DexView | NEED TO MAKE |
| 17 | Dex-level functions: search, sort orders, modes (Gen 2 Option/Search; Gen 3 Hoenn/National + 6 sorts + Search; Gen 4 Sort/Search; Gen 5 Search proc) | — no search/sort/mode control in DexView (click-to-select only) | NEED TO MAKE |
| 18 | Navigation: D-pad/keyboard list + detail stepping (all gens) | Click/tap to select only; no keyboard/D-pad handler in DexView | NEED TO MAKE |

Dex count: full HAVE = rows 1, 2, 5, 6, 7, 8, 9 = 7/18 = 39%;
PARTIAL = rows 3, 4, 10, 11 = 4/18 = 22%; NEED = rows 12–18 = 7/18 = 39%.

### Pause Editor mapping — 10 elements counted

| # | Pokémon element (exact spot) | Pause Editor replacement in that exact spot | HAVE / NEED TO MAKE |
|---|---|---|---|
| 1 | Pause menu container (text box Gen 1/2/3; icon menu Gen 4; icon grid Gen 5) | A Pause Editor screen that can switch container style per preset | NEED TO MAKE — no PauseView/StartMenuView in the views listing |
| 2 | Entry: Dex (first in Gen 1–4; second in Gen 5 grid) | Mochioteka entry, opening DexView | NEED TO MAKE (DexView itself exists; the pause-menu entry pointing at it does not) |
| 3 | Entry: Party/Creatures (POKéMON, all gens) | Roster/party entry | NEED TO MAKE (RosterView exists as a screen; the pause entry does not) |
| 4 | Entry: Bag/Items (ITEM/PACK/BAG, all gens) | Bag entry | NEED TO MAKE (BagView exists as a screen; the pause entry does not) |
| 5 | Entry: Player/Trainer Card (player name Gen 1–3; TRAINER_CASE/TRAINER_CARD Gen 4–5) | Trainer-card entry | NEED TO MAKE |
| 6 | Entry: Save (all gens; hidden in link/Safari/Union variants) | Save entry | NEED TO MAKE |
| 7 | Entry: Options (OPTION/OPTIONS, all gens) | Options entry | NEED TO MAKE |
| 8 | Entry: Exit/Return (EXIT Gen 1–4; RETURN slot 6 Gen 5) | Close/return action | NEED TO MAKE as a pause entry (DexView's own Close button is not a pause menu) |
| 9 | Context variants: Safari RETIRE-first, Link, Union Room, Bug Contest QUIT, Battle Pyramid, No-Dex/No-Pokémon (Gen 2–5) | Variant rule set in the editor (which entries hide/show per context) | NEED TO MAKE |
| 10 | Per-entry descriptions (Gen 2 menu-account box; FireRed `sStartMenuDescPointers`) + remembered cursor (Gen 1 `wBattleAndStartSavedMenuItem`; Gen 2 `wBattleMenuCursorPosition`) + wrap-around (Gen 1) / grid cursor tables (Gen 5) | Description line + remembered cursor + navigation rules in the editor | NEED TO MAKE |

Pause count: HAVE 0/10 = 0%; NEED 10/10 = 100%. Existing screens
(DexView, RosterView, BagView) are destinations, not the pause menu
itself, and were not counted as pause-menu HAVE.

### Editor implications (what the research says to build, in Pokémon's order)

1. Mochioteka first: add, in DexView's detail spot and in Gen 3's order
   (number → name → category → HT → WT → description), the category line,
   height, weight, footprint block, and cry playback; then the sub-screen
   tabs in Gen 3's select-bar order (INFO / AREA / CRY / SIZE, plus FORM
   from Gen 4/5). Keep the owned/caught-only gating: Gen 1–3 all hide
   HT/WT/description until owned/caught — DexView already gates name and
   description on discovered; extend that gate to the new fields rather
   than showing them for seen-only entries.
2. Mochioteka list second: split the header count into Seen vs Own
   (Gen 1/2/3), add the caught icon beside owned rows, then search +
   sort (Gen 3's six orders are the fullest verified set) + keyboard/D-pad
   navigation (Gen 1's Up/Down 1, Left/Right page is the simplest verified
   scheme; Gen 5's grid is not a dex scheme).
3. Pause Editor: build the container + entry-order presets from the
   pause table — Gen 1 text box, Gen 2 box + descriptions, Gen 3 framed
   window, Gen 4 icon menu, Gen 5 2-column icon grid — with the Gen 5
   POKéMON-before-POKéDEX order kept as its own preset, not merged into
   the Gen 1–4 order. Variant hiding (Safari/Link/Union/No-Dex) is a
   rule table in the editor, not hard-coded rows.
4. Do not port: Gen 2's PRNT action (Game Boy Printer hardware), Gen 5's
   title menu as a pause menu, Diamond layouts (unverified), or
   HeartGold's enum order as display order (unverified).

## Sources checked, by tree (all read from disk, 2026-10-26)

- pokered / pokeyellow: `engine/menus/pokedex.asm`,
  `engine/menus/draw_start_menu.asm`, `home/start_menu.asm`,
  `engine/gfx/load_pokedex_tiles.asm` (diffed Red vs Yellow).
- pokegold / pokecrystal: `engine/pokedex/pokedex.asm`,
  `pokedex_2.asm`, `pokedex_3.asm`, `new_pokedex_entry.asm`,
  `unown_dex.asm`, `engine/menus/start_menu.asm` (diffed Gold vs Crystal).
- pokeruby / pokeemerald: `src/pokedex.c`, `src/pokedex_area_screen.c`,
  `src/pokedex_cry_screen.c`, `src/start_menu.c`,
  `include/pokedex.h`, `include/start_menu.h`,
  `src/data/pokemon/pokedex_entries.h` (Emerald).
- pokefirered-leafgreen: `src/pokedex_screen.c`, `src/pokedex.c`,
  `src/pokedex_area_markers.c`, `src/start_menu.c`,
  `include/pokedex_screen.h`,
  `src/data/pokemon/pokedex_categories.h`.
- pokediamond: `arm9/src/pokedex.c`, `include/pokedex.h`,
  `include/start_menu.h` (searched for `start_menu.c` — not found).
- pokeplatinum: `src/applications/pokedex/pokedex_main.c`,
  `pokedex_panel.c`, `pokedex_sort.c`, `pokedex_search.c`,
  `pokedex_graphics.c`, `pokedex_height_check.c`, `infomain.c`,
  `formmain.c`, `crysub.c`, `footprint.c`, `src/pokedex.c`,
  `src/pokedex_heightweight.c`, `src/start_menu.c`.
- pokeheartgold: `src/application/pokedex/ov18_021E5AA0.c`,
  `ov18_021E5C40.c`, `ov18_021E590C.c`, `ov18_021E8BF4.c`,
  `src/pokedex.c`, `src/start_menu.c`,
  `include/application/pokedex/pokedex_internal.h`.
- pokebw2: `src/ov036/field_menu.c`, `src/ov036/field_subscreen.c`,
  `src/ov299/zukanlist.c`, `src/ov300/zukansearch.c`,
  `src/ov301/zukan_open.c`, `src/ov302/zukan.c`,
  `src/ov298/zukan_detail*.c`, `src/ov296/zukan_info.c`,
  `src/ov297/zukan_*.c`, `include/app/zukan_detail.h`,
  `src/system/pokedex.c` (save data), `src/ov162/startmenu.c`
  (title menu — excluded, see warning).
- Mochiichao side (read-only): `menu-editor-tree/src/components/views/DexView.tsx`
  (230 lines) + that tree's `src/components/views/` listing (12 files).
