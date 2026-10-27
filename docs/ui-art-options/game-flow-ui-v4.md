# Game flow + menu beauty — Pokemon-file template, Mochiichao story on top (v4)

User verdict 2026-10-25: menus/UI still ugly, game flow bad, no
narrative, no "this is where you start, this is what's happening".
Fix = fill EVERY gap with the Pokemon flow template (structure only),
then write Mochiichao's own story on top. NO Pokemon dialogue text,
names, towns, or characters copied in — only the shape of the flow.

## Flow template (from the decomps, structure only)
Files: FireRed intro.c (cinematic -> title), main_menu.c (title ->
main menu), new_game.c (player/rival name state), choose_starter
(HeartGold choose_starter.c: cursorPos over starters, confirm choice),
start_menu.c (in-game pause), field_message_box.c (message box types:
NORMAL / AUTO_SCROLL / HIDDEN), text_window.c (9-slice frame:
corners + edges + fill, DrawFrameAndWindow).

1. Cinematic / logo -> TITLE (MOCHIICHAO / DIAMOND VERSION /
   PRESS ANY KEY — title ONLY here).
2. MAIN MENU (v3, already in IntroSequence): CONTINUE (with stats)
   / NEW GAME / SETTINGS, separate framed windows, overwrite confirm.
3. NEW GAME — Prof intro, in order, each as ONE dialogue-box message
   with continue arrow, never a scrolling log:
   a. Prof Aeon introduces the world (Mainframe Region) and the
      creatures (Mochiichao) — Mochiichao words only.
   b. "Are you a boy or a girl?" — gender select.
   c. "What is your name?" — name entry, confirm.
   d. Rival intro — Hex, name entry/confirm (Hex is already canon).
   e. Prof closing: "Your journey begins in Sector 0."
4. SPAWN — fade into HOME (Sector 0, Boot Harbor area), NOT straight
   into open world with everything unlocked. Mom dialogue first
   (one message box, portrait).
5. LAB — walk to Prof Aeon's lab. Starter table: Mochii / Razorgater
   / Tyrage (+ Kittember / Sproutle already in lab in canon).
   Cursor over starters, confirm, "You chose your partner!"
   (WorldEngine already has pick_starter events — wire them as the
   ONLY way to get a starter, not a free select screen).
6. RIVAL BATTLE — Hex picks a starter, first battle immediately,
   in the lab / outside it, using the battle UI from v1. Win or lose,
   flow continues (Pokemon first rival battle is scripted, not a
   game-over).
7. GIFTS + GOAL — Aeon gives the MochiDex (roster/dex) + 5 Luigi
   Cubes (already in WorldEngine dialogue — keep that, move it to
   this beat). Mom / Aeon state the goal: visit the dojos, beat the
   Champion Mythar, stop the Hackers/Syndicate — Mochiichao story,
   in that order, told in dialogue, not in a menu header.
8. FIRST ROUTE — Route 1.0 / Binary Woods: tall-grass encounters
   only AFTER the starter + cubes are in hand. First town =
   Silicon Town, first shop, first dojo later. Gate: no starter =
   cannot leave Sector 0 lab area (NPC / Aeon blocks the exit with
   a message box, the way Pokemon blocks the route before the
   starter). This is the missing "where do I start" — currently the
   game spawns in the world with all views unlocked and no gate.
9. IN-GAME PAUSE (start_menu.c order): Roster, Bag/Shop, Player,
   Save, Settings, Exit — framed over the world, help line at bottom.

## Why menus look ugly now — and the Pokemon-file fix
- Mixed panels: some views use game-panel divs, some use UiPanel
  SVGs, some still carry terminal/mono styling. Pokemon rule:
  ONE frame everywhere — StdWindowFrame, 9-slice (corners + edges +
  fill), same palette, same radius, same shadow. Audit index.css +
  every View: delete mono/terminal classes, delete "[ RETURN ]"
  bracket buttons, delete emoji icons, delete version footers.
- Text: ONE game font (UI-STYLE-GUIDE: one rounded bold font, never
  mono). Pokemon: FONT_NORMAL for dialogue, FONT_SMALL for menu
  lists, fg/bg/shadow triplet per window (battle_message: moves
  fg13/bg14/shadow15, message fg1/bg15/shadow6 — translate to
  Mochiichao palette: text #f1f5f9, panel #16233a ~92%, border
  teal/cyan #22d3ee, gold accent #fbbf24, danger #ef4444).
- Dialogue box: bottom, full width, 2 lines max, typewriter print,
  ▼ continue arrow, portrait on the left for Aeon / Mochiko / Hex /
  Mom (humanSheets portraits when ready, silhouette placeholder
  until then — never emoji, never a text-only floating box).
- Menus: framed window OVER the world (world visible, slightly
  darkened around it, never a full-screen blank panel), vertical
  list, cursor arrow on the selected row, bottom help line
  describing that row, scroll arrows when the list overflows.
- Battle: healthbox = name + Lv + HP bar + numbers in ONE box
  (v1), 2x2 move grid + PP + TYPE, no title in battle, arena
  background behind everything (v1/v2, already wired).
- Buttons: filled rounded game buttons, min 48px tap, A / B /
  START as buttons, not text brackets.

## Mochiichao story on top (canon, NOT Pokemon)
Prof Aeon, assistant Mochiko, rival Hex, Mom, Mainframe Region,
Sector 0 Boot Harbor, Binary Woods, Silicon Town, MochiiPlex,
Castagnoli Island, dojos (not gyms), Hackers / Syndicate /
Liberation Front, Junk Warlord Krix, Champion Mythar, Luigi Cubes,
Mend Patch, Credits (CR). All dialogue written fresh in that
canon, in the dialogue box above. No Pokemon names, towns, or
lines reused.

## Wire order (main, after the Pages playtest reports)
1. Dialogue system: typewriter + portrait + ▼ + 2-line bottom box,
   used by EVERY NPC / Prof / Mom line (replace scrolling log as
   the primary story carrier; log stays only as battle history).
2. IntroSequence: add rival-name phase + lab/first-battle gate
   (phases already exist for cinematic/title/main/prof/gender/name
   — extend, do not rebuild).
3. WorldEngine: spawn = home, Mom first, lab gate (no starter =
   blocked exit with message), starter table = only starter source,
   Hex first battle, Aeon gifts at that beat, then Route 1.0 opens.
4. CSS + menu audit: one frame, one font, help lines, no mono,
   no brackets, no emoji, no footers, across Battle/Roster/Shop/
   PC/Garden/Arena/Creature/Ring/Cheat views.
5. Gate-checked PR vs main @44730aff (PR #18), then rebuild Pages
   via publish_pages_clean.py pattern, then live playtest the
   flow end-to-end (title -> new game -> prof -> name -> lab ->
   starter -> Hex battle -> route). No Pillow mock, no claim
   until that playtest passes.
