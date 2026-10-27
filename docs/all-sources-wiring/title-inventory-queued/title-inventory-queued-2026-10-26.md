# Title / start-screen code INVENTORY — QUEUED, NOT APPLIED

Status: QUEUED NOT APPLIED. Inventory only. No game view was edited, no
logo file, studio-card file, or locked title-art file was touched, no
start screen was built, no background video was added, no git commit
was made, no PR was created or merged, 0 deletions.

Order source: 2026-10-26 20:39 CDT — interchangeable start screens are
QUEUED, to be built AFTER the wiring work above is done, using title /
start-screen code from Black 2 + all other generations on disk, adding
ONLY background videos, never clobbering the logo, the studio card, or
any locked title art.

Sanitisation rule applied to this file: swap-bucket material is NOT
reproduced here — no species/character identifiers, no species/character
names, no image bytes, no logo art content or logo filenames, no literal
dialogue text, no voice-cue bytes or voice-cue identifiers. Where a
source identifier would fall in the swap bucket, this file says
[REDACTED — swap bucket] instead of quoting it. Locked slots are named
only as slots, never by content.

## Counts

- Generations inventoried: 11/11 = 100%
  - Fresh-start tree (3): FireRed/LeafGreen, HeartGold/SoulSilver,
    Black 2/White 2
  - Decomps tree (8): Emerald, Ruby, Crystal, Gold, Yellow, Red,
    Diamond, Platinum
- Primary title-code files found: 24/24 counted below (Diamond = 0,
  see its gap note; every other generation has at least 2)
- Title-named files found by filename search: 132 total across 10
  generations (Diamond = 0 by filename, because its title assets use
  numbered archive names, not title names — see Diamond section)
- Title-asset directories counted by format only, never by art content:
  see per-generation notes. No art bytes are included in this file.

## How to read the structure notes

Every generation follows the same broad order, with the platform
changing the mechanism:

1. Clear / reset display state (palettes, sprites, tilemaps, GPU/VRAM
   banks as applicable).
2. Load the background plane(s) and palette(s).
3. Load the foreground slots on top of the background: the logo slot
   (LOCKED — not inventoried by content, not to be touched), the
   version/credit slot where present, and the start prompt
   (blinking sprite on GBA/GB, window on DS — prompt text NOT
   reproduced here).
4. Run an animation / scene state machine (GBA tasks, GB jumptable,
   DS overlay/application main loop, Black 2 proc state machine).
5. Wait for input, then fade and transition to the main menu, or to a
   special screen (save-clear, mic test, etc. — see exit lists).
6. On timeout where the code defines one, exit to a demo/timeout path
   instead of the menu.

The background-video slot, in every generation, is step 2 — the
background plane / animated scene that sits BEHIND the logo slot and
BEHIND the start prompt. A later build would replace only that plane's
source with a video source, keeping the logo slot, the studio-card
slot, the start prompt, the input handling, and the fade/transition
code exactly where they already are. The video never replaces the
logo, the prompt, or the transition.

## Per-generation inventory

### 1. FireRed/LeafGreen — GBA — 2 primary code files

Paths (relative to the generation root):
- `src/title_screen.c` — 1,315 lines
- `include/title_screen.h` — 6 lines

Structure / order:
- Entry: `CB2_InitTitleScreen`, state-machine init, then
  `CB2_TitleScreenRun` as the main callback.
- GPU reset first (`ResetGpuRegs`), then palette/BG load
  (`LoadMainTitleScreenPalsAndResetBgs`, `SetGpuRegsForTitleScreenRun`).
- Scene state machine: init, flash-sprite, fade-in, run, restart
  (function names in the file follow that order).
- Particle spawners run as tasks alongside the scene: flame, leaf,
  streak, and slash sprite callbacks/tasks.
- Start prompt: blinking-prompt task
  (`Task_TitleScreen_BlinkPressStart` pattern).
- Input: new-press A / B / Start advances the scene in the run state;
  A / Start in the prompt state advances to a post-input voice-cue
  state [REDACTED — swap bucket]; held-key combinations route to the
  save-clear and berry-fix special screens.
- Transitions: fade-out callbacks to the save-clear screen, the
  berry-fix screen, and onward to the main menu.
- Background-video slot: the BG plane loaded by the palette/BG load
  step, behind the logo slot and the particle sprites. The slash /
  flame / leaf particle layer stays on top of the video plane.

Graphics/sound system (inventory level only):
- Title asset directory: `graphics/title_screen/` — 33 files total
  (formats: binary tile data, palette files, PNG sources; individual
  locked-art filenames NOT listed here).
- Sound: `sound/songs/midi/mus_title.mid` (MIDI sequence for the
  title track); whole `sound/` tree: 844 files — 477 WAV, 347 MIDI,
  11 PCM, 7 include, 1 assembly, 1 config. Voice-group include files
  and a song table define the playback banks; no audio bytes are
  included here.

### 2. HeartGold/SoulSilver — DS — 2 primary code files

Paths:
- `src/title_screen.c` — 863 lines
- `include/title_screen.h` — 82 lines

Structure / order:
- Overlay application: `gApplication_TitleScreen` template with
  Init / Main / Exit stages; overlay data struct
  `TitleScreenOverlayData` (0x2F8 bytes in the header comment).
- VRAM bank setup (`TitleScreen_SetGfxBanks`), then 3D VRAM manager
  create, then 3D object load (model + up to 4 animation objects per
  object: skeletal, texture, pattern, material — see format list).
- BG init (`TitleScreen_InitBgs`), 2D BG graphics load, top-screen
  glow animation state machine, camera position/curve handling
  (initial position, next position, camera scenes with timers).
- Title-layer fade-in step, then a touch-to-start window on the
  lower screen (`TitleScreen_RemoveTouchToStartWindow` on exit).
- Input: PAD buttons A / B / Start / Select / X / Y and D-pad up/down
  appear in the file; exit modes in the header: unset, menu,
  clear-save, timeout, unused, mic-test.
- Background-video slot: the 3D scene + top-screen 2D BG plane,
  behind the title-layer fade-in and behind the touch-to-start
  window. The camera-curve step is the timing model a video would
  inherit (fixed-length scene, then prompt).

Graphics/sound system (inventory level only):
- Title demo asset directory: `files/demo/title/titledemo/` — 45
  files, by format: 8 screen files, 7 palette files, 6 model files,
  5 PNG sources, 4 tile files, 4 skeletal-animation files,
  4 texture-animation files, 4 pattern files, 2 material-animation
  files, 1 build file. Format names: NSCR, NCLR, NSBMD, NCGR, NSBCA,
  NSBTA, NSBTP, NSBMA.
- No sound bytes are included here; DS sound on this platform is
  sequence + bank + wave-archive based (see Platinum section for
  the same family of formats).

### 3. Black 2/White 2 — DS — 2 primary code files (+ 2 adjacent, not main title)

Paths:
- `src/ov162/title.c` — 719 lines (overlay 162; the main title proc)
- `include/app/title.h` — 10 lines (`TITLE_PROC_FUNCTIONS` proc table)
- Adjacent, NOT the main title screen (do not confuse with the above):
  `src/ov214/worldtrade_title.c`, `src/ov319/manual_title.c`

Structure / order:
- Proc state machine: INIT, INIT_DISPLAY, RUN, WAIT_FADE_IN,
  WAIT_FADE_OUT, post-input voice-cue wait [state name REDACTED —
  swap bucket], FADE_OUT, END, FREE.
- Subsystems, each with Init / Update / Free: `TitleBG` (2D
  background system), `TitleG3D` (3D curve-driven scene), `TitleObj`
  (object layer), `TitleSys` (display, VBlank, capture blend).
- Timing constants in the file: layers are hidden at frame 1,740
  (white flash, layout switch, BG planes re-enabled), and the title
  ends at frame 6,780 (timeout constant).
- Input: pressed-keys read via the HID key query; A / B / Start
  while layers are hidden restores the layers; A / Start then
  routes to NEXT_START_MENU via the post-input wait state.
  Held-key combinations route to delete-save (Up + Select + B)
  and mic-test (Down + X + Y) paths.
- Transitions: fade engine (white, both screens, 16 steps) and a
  next-screen selector (start menu, delete-save, mic-test, none).
- Background-video slot: `TitleBG` + `TitleG3D` together — the
  curve-driven 3D scene and its 2D BG planes, behind the object
  layer and behind the start prompt. This is the closest existing
  analogue to a video background: a timed, camera-curved scene
  that plays, hides its layers at a fixed frame, and then waits
  for input. A video would sit in exactly this slot, with the
  1,740-frame hide point and the 6,780-frame timeout as the
  timing reference for the later build.

Graphics/sound system (inventory level only):
- Whole `res/sound/` tree: 13,934 files — 8,022 WAV, 4,608 JSON
  descriptors, 1,304 assembly. Descriptors cover banks, groups,
  players, sequences, and streams (schema files present); no
  audio bytes are included here, and no voice-cue identifiers
  are listed.
- Title text data lives under `res/text/system/title*.txt` (16
  numbered files plus a main title file) — text content NOT
  reproduced here, per the dialogue rule.

### 4. Emerald — GBA — 2 primary code files

Paths:
- `src/title_screen.c` — 869 lines
- `include/title_screen.h` — 8 lines

Structure / order:
- Entry: `CB2_InitTitleScreen` with a `gMain.state` switch, then
  `MainCB2` as the running callback, VBlank callback for palette
  and sprite updates.
- Three task phases: Phase 1 (skip on A / B / Start / Select or a
  skip flag, resets the counter), Phase 2 (same skip rule), Phase 3
  (A / Start only: fade out the music over 4 steps, white palette
  fade, then set the main callback to the main menu).
- Banner sprites: version banner (left/right callbacks), start
  prompt banner, and copyright banner (create functions take x/y
  coordinates).
- Logo-shine sprite callbacks (shine function names REDACTED in
  part — they contain a swap-bucket word; the mechanism is a
  shine sprite sweeping across the logo slot, with a fast variant
  and a background-colour mode switch).
- Transitions: callbacks to the main menu, copyright screen,
  clear-save screen, RTC-reset screen, and berry-fix screen.
- Background-video slot: the BG plane behind the banner sprites
  and the logo-shine sprite — same slot as FireRed/LeafGreen.

Graphics/sound system (inventory level only):
- Title-named files: 19 total (code + MIDI + voice-group includes
  + other screen title binaries, which are NOT the main title
  screen and are not counted as title code).
- Sound: `sound/songs/midi/mus_title.mid` plus a second title
  MIDI variant in the same directory; voice-group includes for
  the title track exist in `sound/voicegroups/`. Whole `sound/`
  tree: 1,303 files — 544 WAV, 530 MIDI, 202 include, 25 PCM,
  1 assembly, 1 config. No audio bytes included here.

### 5. Ruby — GBA — 2 primary code files

Paths:
- `src/title_screen.c` — 814 lines
- `include/title_screen.h` — 15 lines

Structure / order:
- Same GBA family as Emerald: `CB2_InitTitleScreen`,
  `MainCB2`, VBlank callback, three task phases with the same
  skip rule (A / B / Start / Select in Phases 1–2; A / Start in
  Phase 3 with a 4-step music fade-out and a white palette fade
  to the main menu).
- Banner sprites: version banner (left/right), start-prompt
  banner, copyright banner; logo-shine sprite callback (name
  REDACTED in part, same mechanism as Emerald: shine sweep across
  the logo slot).
- Transitions: main menu, test menu (Ruby-only extra), copyright
  screen, clear-save screen, RTC-reset screen.
- Background-video slot: the BG plane behind the banner sprites
  and the logo-shine sprite — same slot as Emerald/FireRed.

Graphics/sound system (inventory level only):
- Title-named files: 4 total (code + header + title MIDI + one
  interface binary that is NOT the main title screen).
- Sound: `sound/songs/midi/mus_title.mid`. Whole `sound/` tree:
  940 files — 506 WAV, 417 MIDI, 10 PCM, 6 include, 1 config.
  No audio bytes included here.

### 6. Crystal — GB/GBC — 3 primary code files

Paths:
- `engine/movie/title.asm` — 374 lines
- `engine/movie/unused_title.asm` — 171 lines (unused variant;
  inventory only, not the live path)
- `audio/music/titlescreen.asm` — 1,170 lines

Structure / order:
- Entry label `_TitleScreen`: clear BG palettes, clear sprites,
  clear tilemap, set BG map mode to 0, zero the jumptable index,
  the selected-option byte, and the 2-byte title timer.
- Disable LCD, decompress title graphics into VRAM tile slots,
  fill attribute maps with palette numbers per tilemap row
  (palette indices 1–7 assigned by row in the file), then
  re-enable the display.
- Jumptable-driven loop (the file uses the jumptable-index
  pattern; the timer and selected-option bytes are the state).
- Palette, tilemap, and BG-map calls appear throughout; input
  handling is via the GB joypad path in the surrounding movie
  code, not a single named input function in this file.
- Background-video slot: the BG tilemap plane (20 tiles wide,
  full-height attribute map) behind the foreground title tiles.
  On GB/GBC there is no separate video plane — the video would
  replace the tilemap content step, with palettes applied per
  row as the file already does.

Graphics/sound system (inventory level only):
- Title graphics directory: `gfx/title/` — 11 files, formats:
  PNG sources, palette files, tilemap files. Individual art
  filenames NOT listed here (they fall in the swap bucket).
- Sound: whole `audio/` tree: 113 assembly files (music written
  as assembly note/channel data, not MIDI). Title music file
  listed above. No audio bytes included here.

### 7. Gold — GB/GBC — 2 primary code files

Paths:
- `engine/movie/title.asm` — 206 lines
- `audio/music/titlescreen.asm` — 1,235 lines

Structure / order:
- Entry label `TitleScreen`: clear BG palettes, clear tilemap,
  disable LCD, clear sprites, zero BG map mode, map-animation
  flags, and scroll registers (SCX/SCY).
- Four graphics chunks decompressed/copied into VRAM tile slots
  (tile slots 0, 1, 2, and a partial slot at tile offset 0x78),
  then title palettes filled and the title tilemap loaded.
- Sprite-animation dictionary initialised, LCD object size bit
  set, LCD re-enabled, jumptable index / selected option / timer
  zeroed, then a sprite-animation struct initialised for the
  intro animation object.
- Background-video slot: the tilemap + palette step, behind the
  sprite-animation object layer — same GB pattern as Crystal,
  with the sprite-animation layer staying on top of the video.

Graphics/sound system (inventory level only):
- Title graphics directory: `gfx/title/` — 12 files, formats:
  PNG sources, palette files (background gold/silver variants
  and a foreground palette), tilemap file, trail images.
  Individual art filenames NOT listed here.
- Sound: whole `audio/` tree: 102 assembly files. No audio
  bytes included here.

### 8. Yellow — GB/GBC — 4 primary code files

Paths:
- `engine/movie/title.asm` — 383 lines (shared preparation)
- `engine/movie/title_rb.asm` — 122 lines (earlier-version variant)
- `engine/movie/title_yellow.asm` — 109 lines (Yellow variant)
- `audio/music/titlescreen.asm` — 669 lines
- Extra title-named asset: a tilemap under `gfx/` for a different
  screen (directory name REDACTED — swap bucket), NOT the main
  title screen; counted in the filename total, not as title code.

Structure / order:
- Shared preparation label `PrepareTitleScreen` in
  `title.asm`: joypad, start-prompt, fade, palette, and BG
  handling across 53 call sites and 13 jumps in that file.
- The two variant files split the version-specific title
  behaviour (earlier-version path vs. Yellow path); the Yellow
  variant file has 12 BG references and 7 tilemap references.
- Background-video slot: the BG/tilemap plane in the shared
  preparation step, behind the variant-specific foreground.
  A later build would need to pick which variant file is the
  live path before swapping the background plane.

Graphics/sound system (inventory level only):
- Whole `audio/` tree: 511 files — 469 assembly, 42 WAV.
  Title graphics live under `gfx/title/` (12 files by the
  directory count in the earlier scan; formats: tilemap and
  image sources). Individual art filenames NOT listed here.
  No audio bytes included here.

### 9. Red — GB/GBC — 3 primary code files

Paths:
- `engine/movie/title.asm` — 417 lines (contains
  `PrepareTitleScreen` and `DisplayTitleScreen`)
- `engine/movie/title2.asm` — 120 lines (second title file)
- `audio/music/titlescreen.asm` — 669 lines
- Extra title-named data file: `data/pokemon/title_mons.asm` —
  NOT title-screen code; it is a data table for a different
  purpose and is NOT counted as title code (its filename is
  listed here only to exclude it explicitly).

Structure / order:
- `PrepareTitleScreen`: zero window Y, letter-printing delay
  flags, and status-flag bytes; set the audio ROM bank for the
  title music.
- `DisplayTitleScreen`: white-out palettes, enable auto BG
  transfer, zero tile animations and scroll registers, set
  window Y to 0x90, clear the screen, disable LCD, load font
  tile patterns, then copy graphics chunks into title VRAM
  slots (5 tiles, 9 tiles, then 0x60 + 0x10 tiles in two chunks
  for the logo slot — sizes from the file, content NOT
  reproduced), then clear both BG maps and place logo tiles
  in a 16-wide, 6-row loop.
- Background-video slot: the BG maps cleared and filled in
  `DisplayTitleScreen`, behind the logo tile loop. The logo
  tile loop itself is LOCKED — a video would replace the BG
  maps, not the logo tiles.

Graphics/sound system (inventory level only):
- Title graphics directory: `gfx/title/` — 5 files, formats:
  PNG sources (version and studio-card images are in this
  directory family; filenames NOT listed, studio card LOCKED).
- Sound: whole `audio/` tree: 385 assembly files. No audio
  bytes included here.

### 10. Diamond — DS — 0 primary code files found (GAP)

Paths:
- No file named `*title*` in code: 0 title-named code files.
- Title asset directories (formats only, no art content):
  - `files/demo/title/op_demo/` — 74 files
  - `files/demo/title/titledemo/` — 3 files (numbered archive
    names; the build file lists them as a single NARC)
  - Combined title-directory total: 96 files by format: 20 tile
    files, 20 screen files, 19 palette files, 8 model files,
    6 cell files, 6 animation files, 6 PNG sources, 5 palette
    source files, 2 texture-animation files, 1 texture file,
    3 files with no extension (archive/index entries).
    Format names: NCGR, NSCR, NCLR, NSBMD, NCER, NANR, NSBTA,
    NSBTX.
- Build references (not code): `arm9/src/filesystem.c` lists the
  titledemo NARC path; `filesystem.mk` and `graphics_rules.mk`
  list the same NARC and its component files (4bpp/8bpp tile
  rules). No title application template, proc table, or
  overlay-manager template was found under a title name in
  `arm9/src/` or `include/` by the searches run for this
  inventory.

Gap note (plain, not a guess): Diamond's title behaviour cannot
be inventoried from a title-named code file on disk. The later
build step will need either (a) the Diamond title entry point
identified from the generic application/demo loader that loads
the titledemo NARC, or (b) Diamond dropped from the code-source
list, with its title-demo asset formats (above) used only as a
format reference. Do NOT invent a Diamond title filename.

Background-video slot (provisional, from assets only): the
titledemo NARC's screen/tile/palette planes, behind whatever
foreground the (not yet located) Diamond title loader puts on
top. This slot is NOT confirmed until the loader is located.

### 11. Platinum — DS — 2 primary code files (+ supporting data)

Paths:
- `src/applications/title_screen.c` — 1,426 lines
- `include/applications/title_screen.h` — 8 lines
  (`gTitleScreenAppTemplate` application template)
- Supporting data (not code, listed for completeness):
  `res/graphics/title_screen/titledemo.order` (load order file),
  `res/text/title_screen.json` (title-screen text data — content
  NOT reproduced here)

Structure / order:
- Application template: Init / Main / Exit, with VBlank
  callback, VRAM bank setup, and 3D pipeline init/free.
- Load steps in file order: 3D graphics load (model + texture
  animation parameters [parameter names REDACTED where they
  fall in the swap bucket]), cutscene 3D graphics load, BG init,
  top-screen BG load, 2D graphics load, blur-effect step.
- Render steps: main render, intro-graphics render, intro
  camera update, title camera update, light updates (two
  lights, state machines), coordinate init, camera helper.
- Input: PAD buttons A / B / Start / Select and D-pad up appear
  in the file; a should-skip-intro check gates the intro-to-
  main transition; text rendering step exists for the title
  text layer.
- Background-video slot: the 3D pipeline scene + top-screen BG
  plane, behind the 2D graphics layer and the title text layer.
  The intro-camera and title-camera curves are the timing
  model a video would inherit, as in HeartGold and Black 2.

Graphics/sound system (inventory level only):
- Title graphics directory: `res/graphics/title_screen/` — 28
  files, by format: 8 screen files, 6 PNG sources, 3 palette
  files, 3 model files, 3 skeletal-animation files, 2
  texture-animation files, 1 material-animation file, 1 build
  file, 1 load-order file. Format names: NSCR, NCLR, NSBMD,
  NSBCA, NSBTA, NSBMA. Individual art filenames NOT listed
  here (logo and foreground art are LOCKED).
- Sound: whole `res/sound/` tree: 1,406 files — 967 MIDI
  sequences, 380 WAV, 31 build files, 27 text files, 1 JSON.
  Subdirectories: SEQ (968 sequence files counted at the
  directory level), BANK (28 bank files), WAVARC (28 wave-
  archive files). Title sequences exist in SEQ (two numbered
  title sequences plus a test title sequence — filenames are
  generic sequence names, no content reproduced). No audio
  bytes included here.

## Cross-generation comparison (for the later build)

| Generation | Platform | Title mechanism | Input gate | Fade/transition | Video slot |
|---|---|---|---|---|---|
| FireRed/LeafGreen | GBA | Task + scene state machine | A/B/Start, then A/Start | Palette fade + callback | BG plane, behind logo + particles |
| HeartGold/SoulSilver | DS | Overlay app, 3D + 2D BG | PAD buttons + touch window | Title-layer fade-in, overlay exit | 3D scene + top BG, behind title layer + touch window |
| Black 2/White 2 | DS | Proc, BG + 3D curve + Obj | A/B/Start (layers hidden), then A/Start | White fade, both screens | BG + 3D curve scene, behind Obj layer |
| Emerald | GBA | 3 task phases | A/B/Start/Select, then A/Start | 4-step music fade + white palette fade | BG plane, behind banners + shine sprite |
| Ruby | GBA | 3 task phases | A/B/Start/Select, then A/Start | 4-step music fade + white palette fade | BG plane, behind banners + shine sprite |
| Crystal | GB/GBC | Jumptable loop | GB joypad path (surrounding code) | Palette handling in file | BG tilemap plane, behind foreground tiles |
| Gold | GB/GBC | Jumptable loop | GB joypad path (surrounding code) | Palette fill + tilemap load | Tilemap plane, behind sprite-animation layer |
| Yellow | GB/GBC | Shared prep + 2 variants | Joypad in shared prep | Fade calls in shared prep | BG/tilemap plane in shared prep |
| Red | GB/GBC | Prep + display functions | GB joypad path (surrounding code) | White-out palettes, auto BG transfer | BG maps, behind logo tile loop (LOCKED) |
| Diamond | DS | NOT FOUND by title name (gap) | Unknown from this inventory | Unknown from this inventory | Provisional: titledemo NARC planes only |
| Platinum | DS | Application template, 3D + 2D | PAD A/B/Start/Select + D-pad up, skip-intro check | Blur + fade steps in file | 3D scene + top BG, behind 2D + text layers |

## Queued item — exact description (NOT built)

Queued work, in order, after the wiring work above is done:
1. Take the background plane/slot from the table above (Black 2
   first, then HeartGold, Platinum, then the GBA and GB families
   as format references).
2. Add interchangeable background videos INTO that slot only.
3. Do NOT change, move, replace, or re-render: the logo slot,
   the studio-card slot, the start prompt, the input handling,
   the fade/transition code, or any locked title art.
4. Resolve the Diamond gap first (see Diamond section) before
   claiming Diamond as a code source.

## What the later build step will need from Mars

Nothing invented here. The only open items are decisions/facts
that only Mars (or the later build step's own lookup) can supply:
- Diamond title entry point: confirm whether Diamond is dropped
  as a code source, or whether its generic demo loader is the
  intended source (see gap note).
- Yellow variant choice: confirm which of the two variant files
  is the live title path for any Yellow-derived reference.
- Video source list: which background videos are the
  interchangeable set (filenames, order, and whether they loop
  or play once) — this inventory deliberately does not invent
  a video list.
- No other approval is assumed. In particular, this inventory
  does NOT assume approval to touch the logo, the studio card,
  or any locked title art, and does NOT assume a video format
  or codec — the later build step must state those from the
  actual target platform, not from this inventory.

## Completion

- Generations inventoried: 11/11 = 100%
- Primary title-code files: 24 found, 1 generation (Diamond)
  with 0 code files — that gap is recorded above, not hidden.
- Edits made by this task: 0 game-view edits, 0 logo/studio/
  title-art touches, 0 deletions, 0 commits, 0 PRs.
- This file is the only output of this task.
