# Intro/title research finish — 12/12 games + Platinum options (follow-up to PR #154)

Follow-up to PR #154 (merged; its three files are byte-identical on `main`
as of the 2026-10-27 re-check: `docs/research/yellow-intro-structure-mochiichao-translation.md`,
`docs/research/diamond-deep-title-logic.md`, and the appended lab section of
`docs/research/color-neurochemistry-design.md`).

This document closes the one sub-item PR #154 itself left owed — Platinum
options details — and records a game-by-game source check for all 12 games,
re-verified 2026-10-27 against the local decomp trees
(`~/workspace/mochiichao-work/decomps/` and the repo submodules
`pokeheartgold`, `pokefirered-leafgreen`, `pokebw2`).

Scope, as with #154: docs only. Structure, counts, coordinates, timers and
thresholds only. No Pokemon art, dialogue, music, or code is copied here.
No gameplay, code, default, or asset change is made by this document.

## What this document does NOT change

- The locked default title and the locked v32 menu are untouched
  (`docs/locked-default-title-menu.md`, `docs/locked-versions.json` are not
  in this PR's file list). The logo is the logo PNG, never font text.
- No file is deleted by this PR. Additions only.
- Wiring any of this into the game is a separate, Mars-approved step.

## 1. Platinum options details — the owed sub-item, now closed

Sources (local decomp tree, structure only):

- `pokeplatinum/src/game_options.c` (128 lines) — the options data + defaults.
- `pokeplatinum/src/applications/options_menu.c` (970 lines) — the options
  menu screen itself.
- `pokeplatinum/src/applications/title_screen.c` (1,426 lines) — the title
  screen that leads to the menu; `pokeplatinum/src/game_opening/` (4 files,
  4,052 lines total) — the opening flow.

### 1a. The 7 menu entries (7/7 = 100%)

The menu's entry enum (`OptionsMenuEntryID`) is, in order:

| # | Entry (structural name) | Choices in the menu |
|---|---|---|
| 0 | Text speed | 3 |
| 1 | Sound mode | 2 |
| 2 | Battle scene | 2 |
| 3 | Battle style | 2 |
| 4 | Button mode | 3 |
| 5 | Message-box frame | 20 |
| 6 | Close (no choices) | 0 |

Total choice slots across the 6 choosable entries: 3 + 2 + 2 + 2 + 3 + 20 = 32.

### 1b. Defaults (from `Options_Init`)

- Text speed: Normal.
- Sound mode: Stereo.
- Battle style: Shift.
- Battle scene: On.
- Button mode: Normal.
- Message-box frame: frame 1 (the first frame slot; the menu offers 20).

The stored options record packs these into bitfields (text speed 4 bits,
sound mode 2, battle style 1, battle scene 1, button mode 2, frame 5).

### 1c. Menu behaviour (structure only)

- Layout: 3 windows, 5 background templates. Entries are laid out one per
  row: each entry row is 16 px high, the first entry offset is 24 px.
- Input: Left/Right cycles the focused entry's choice (wrapping modulo that
  entry's choice count) with a confirm sound; Up/Down moves the cursor
  (wrapping modulo 7, i.e. including Close) and scrolls the background layer
  by `-(cursor * 16 + 24)` px, and refreshes the selected entry's description.
- Each entry has its own description text slot, shown for the focused entry.
- Exit: leaving the menu compares the menu's selections against the stored
  options; only if something changed does it show a confirmation prompt
  (a 6 x 4-tile window at tilemap (25, 13), palette 13) with a Yes/No choice.
  If nothing changed, it exits without prompting.
- Menu state machine, in order: setup visuals -> wait for fade-in ->
  handle input -> confirm new settings -> wait for confirmation ->
  handle Yes/No input -> start visual teardown -> wait for fade-out ->
  teardown. That is 9 states.

### 1d. Mochiichao translation

- A Mochiichao options screen in this shape is: 6 choosable rows + Close,
  Left/Right to cycle, Up/Down to move with a scrolling list, a per-row
  description line, and a confirm prompt only when something actually
  changed. HAVE: the locked v32 menu pattern and the Settings screen pattern.
  NEED TO MAKE (Mars decision): whether Mochiichao keeps a confirm-on-change
  prompt at all, and which of the 6 rows map onto Mochiichao settings
  (text speed, sound, and button layout have direct equivalents; battle
  scene/style and message-box frame are Pokemon-specific and do not map
  one-to-one).
- Platinum options details: 7/7 entries, 6/6 defaults, 9/9 menu states =
  100%. No Platinum options sub-item remains owed after this document.

## 2. The 12/12 games — source check, game by game

Counting rule: one count per intro/title codebase. Sibling versions that
share a codebase are not double-counted (for example the FireRed/LeafGreen
repo counts as 2 because its title code branches on `FIRERED` /
`LEAFGREEN`, while a shared-codebase sibling such as SoulSilver in the
HeartGold tree or White 2 in the Black 2 tree is not a second count).

"Verified present" below means the file was listed in the local decomp tree
on 2026-10-27 and, where a line count is given, counted with `wc -l`.
It does not mean a full scene-by-scene extraction for that game lives in
this document — the detailed extractions in this finish are Yellow (§2,
row 2), Diamond (PR #154), and Platinum options (§1). For the other games,
this table records the source files that anchor the prior research; the
prior 2026-10-25 checklist document itself was not located in the `main`
docs tree during this re-check, so it is cited as prior work, not
reproduced here.

| # | Game | Intro source (verified present) | Title source (verified present) | Detail in this finish |
|---|---|---|---|---|
| 1 | Red | `pokered/engine/movie/intro.asm` (470 lines) | `pokered/engine/movie/title.asm` (417 lines) | Source-identified |
| 2 | Yellow | `pokeyellow/engine/movie/intro_yellow.asm` (1,094 lines) | `pokeyellow/engine/movie/title_yellow.asm` (109 lines) + Yellow path of `title.asm` | Full: 18/18 scenes in PR #154 (jumptable entries 0–17 re-counted 2026-10-27) |
| 3 | Gold | `pokegold/engine/movie/intro.asm` (1,277 lines) | `pokegold/engine/movie/title.asm` (206 lines) | Source-identified |
| 4 | Crystal | `pokecrystal/engine/movie/intro.asm` (1,779 lines) | `pokecrystal/engine/movie/title.asm` (374 lines) | Source-identified |
| 5 | Ruby | `pokeruby/src/intro.c` (2,808 lines) | `pokeruby/src/title_screen.c` (814 lines) | Source-identified |
| 6 | Emerald | `pokeemerald/src/intro.c` (3,435 lines) | `pokeemerald/src/title_screen.c` (869 lines) | Source-identified |
| 7 | FireRed | `pokefirered-leafgreen/src/intro.c` (2,805 lines, shared tree) | `pokefirered-leafgreen/src/title_screen.c` (1,315 lines; `FIRERED` branches verified) | Source-identified |
| 8 | LeafGreen | Same shared `intro.c` | Same shared `title_screen.c` (`LEAFGREEN` branches verified) | Source-identified |
| 9 | Diamond | `pokediamond/files/demo/intro/` + `files/graphic/opening/` | `pokediamond/arm9/overlays/63/src/ov63_021DB450.c` (273 lines) + caller assembly (3,831 lines) | Full: 5/5 in PR #154; asset counts re-counted 2026-10-27 — titledemo 19, op_demo 74, opening 21 (114 total) |
| 10 | Platinum | `pokeplatinum/src/game_opening/` (4 files, 4,052 lines) | `pokeplatinum/src/applications/title_screen.c` (1,426 lines) | Full options: §1 of this document (7/7 entries) |
| 11 | HeartGold | `pokeheartgold/src/intro_movie.c` (206 lines) + `intro_movie_scene_1.c`–`intro_movie_scene_5.c` + `intro_movie_scenes_lib.c` | `pokeheartgold/src/title_screen.c` (863 lines) | Source-identified |
| 12 | Black 2 | `pokebw2/src/ov162/boot_screens.c` + `game_start.c` (title overlay's boot/start flow; no separate scene list is claimed for Black 2's opening) | `pokebw2/src/ov162/title.c` (719 lines) | Source-identified (title); opening flow identified, not scene-listed |

Counts:

- Games with an identified intro source and title source: 12/12 = 100%.
- Games with a full detailed extraction in PR #154 or this document:
  Yellow, Diamond, Platinum (options): 3/12 detailed in-repo; the other
  9 games are source-identified above and rest on prior research, not
  re-extracted scene-by-scene here. That distinction is stated, not hidden,
  so Mars can decide whether in-repo detailed extracts for those 9 are
  wanted as a further item.
- Platinum options sub-item: closed (§1). No sub-item flagged by PR #154
  remains owed after this document.

## 3. Color-artifact edit — status

The color-artifact edit is the lab-studies section appended by PR #154 to
`docs/research/color-neurochemistry-design.md` (PR #154: +193/−0 on that
file; section "Lab studies added 2026-10-26", 5/5 studies: Koepp 1998, Kim
Tetris, Santaniello 2025, Takagi 2026, Weinstein/Dunbar 2016, with the
standing caveat kept verbatim at the top of the section). That repo copy
is merged on `main` (file blob identical to the #154 branch blob).

The paste of that same section into the web artifact is a separate,
parent-side step: this subagent has no web-artifact edit access. The exact
paste text is saved alongside this work as
`color-artifact-edit-paste.md` (from "## Lab studies added 2026-10-26"
through the end of the file, "## What stays unchanged by this edit"
included) and is ready to paste verbatim; no existing recommendation,
number, or threshold in the artifact should change when it is pasted.

## 4. Gate for this PR

- Additions only: 1 new file, 0 deletions (this document). No code, no
  default title/menu change, no asset change, no logo change.
- PR #154 relationship: this is a follow-up to merged PR #154, not an
  update to its branch. It does not force-push, rebase, or amend anything.
- Locked default title and locked v32 menu: verified untouched — neither
  `docs/locked-default-title-menu.md` nor `docs/locked-versions.json` is
  in this PR, and this document changes no game file.
