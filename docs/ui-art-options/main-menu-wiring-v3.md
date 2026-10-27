# Main menu — built from FireRed main_menu.c, NOT hand-tooled

Source: pokefirered-leafgreen/src/main_menu.c, structure/rules only,
no code/art copied. This is a NEW screen Mochiichao currently lacks:
IntroSequence goes straight to WorldEngine. The main menu goes
BETWEEN title and world.

## What FireRed does (file/line)
- Menu items are SEPARATE windows, not one list (sWindowTemplate,
  main_menu.c:74-120): NEWGAME_ONLY at left 3 / top 1 / 24x2;
  CONTINUE at 3/1 / 24x10; NEWGAME at 3/13 / 24x2; MYSTERYGIFT at
  3/17 / 24x2; ERROR at 3/15 / 24x4. Palette 15, frame drawn per
  window (MainMenu_DrawWindow), text FONT_NORMAL at (2,2), window
  fill 10.
- Which windows show depends on save state (main_menu.c:236-272):
  no save -> NEW GAME only. Save exists -> CONTINUE + NEW GAME.
  Mystery Gift only if enabled — Mochiichao has NO equivalent, do
  NOT invent one.
- CONTINUE window prints stats (PrintContinueStats, called at
  362/378): player name, play time, dex count, badge count.
  Mochiichao mapping: player name, play time (from saveSystem if
  tracked, else omit — do NOT invent a fake time), roster count
  (creatures caught / total roster), dojos cleared (Mochiichao's
  gym equivalent), CR balance. Only stats the save actually holds.
- Cursor: up/down moves between CONTINUE and NEW GAME (and Mystery
  Gift where present); selected window is the highlighted one, others
  stay framed but unhighlighted. B / back returns to title.
- Save flow (start_menu.c save dialog, same pattern): New Game over
  an existing save -> confirm overwrite (Yes/No window) BEFORE
  erasing; saving -> "Saving... do not turn off power" equivalent
  ("Saving... please wait" — no fake power warning on web, keep the
  meaning: do not leave mid-save); then result ("Saved" / error).
  Existing SaveMenu.tsx already has a save dialog — reuse it, do
  not build a second save system.

## Mochiichao main menu (new component, e.g. MainMenuView)
- Flow: Title (IntroSequence, MOCHIICHAO / DIAMOND VERSION / PRESS
  ANY KEY — title stays ONLY here) -> Main Menu -> World / Starter
  Select / Settings, or back to Title.
- Layout, in the game's own UI (PR #14 SVGs, UI-STYLE-GUIDE, no
  Pillow image, no new hand-drawn mock): background = the title
  screen background (gradient + game world behind, never blank
  navy, never a bare panel), then framed windows over it, one per
  item, using main_menu_panel / title panel SVGs from src/assets/ui/.
  CONTINUE window is tall (stats inside), NEW GAME is short below
  it, SETTINGS below that. Same proportions as FireRed: CONTINUE
  tall, NEW GAME short, stacked vertically, left-aligned.
- Items, in order:
  1. CONTINUE — only if a save exists in saveSystem. Shows the
     stats above, inside the same window.
  2. NEW GAME — always. If a save exists, overwrite confirm first.
  3. SETTINGS — existing settings (Option in start_menu.c).
  4. (No Mystery Gift, no version footer, no fake patch number.)
- Controls: tap / click a window, or up/down + confirm, B / back to
  title. Selected window = gold/teal highlighted frame (UI style
  guide), unselected = standard framed panel. Min 48px tap target.
- Pause menu is SEPARATE (start_menu.c, already specced in v1/v2):
  Roster, Bag/Shop, Player, Save, Settings, Exit — that menu is
  over the world in-game, NOT the main menu. Do not merge them.
- Apply AFTER the running monster-tamer worker finishes, in the
  same work tree, same gate (build + lint + validate), then into
  the same PR batch as battle three-quarter + Pokemon-UI v1/v2 +
  monster-tamer (diff vs main 2b645f1f via GitHub API, additions
  only where possible, 0 deletions unless named). No Pillow
  composite, no live-browser screenshot claim until a deploy
  actually publishes (Netlify pause still in effect).
