# Menu Customisation — batch B (Settings > Menu Creator > Menu Customisation)

2026-10-25. One batch, one PR. Pokemon structure translated only —
no Pokemon sprites, dialogue, music, cries, or art in this batch.

## Where it lives

- Rows: Settings > Menu Creator > MENU CUSTOMISATION (new screen in
  `src/components/game/SettingsScreen.tsx`; one entry row added to
  Menu Creator page 1). Draft until SAVE + BACK, like every other
  row on that screen.
- Logic: `src/lib/menuCustom.ts` (new). Persistence: own
  localStorage key `mochiichao_menu_custom_v1`, mirrored into the
  preset on save, so preset JSON export carries the custom block.
- Application: `applyMenuCustom()` sets CSS vars on `:root` on
  SAVE + BACK (live-on-return) and at startup (`src/main.tsx`);
  defaults in `src/index.css` match the pre-existing look, so
  nothing changes visually until a player saves a choice.
- Dialogue: `src/components/game/DialogueBox.tsx` reads
  `--menu-text-*` and `--menu-dialogue-radius` (fallbacks = the
  pre-existing 16px / 1.625 / white / 14px).
- Presets: save / load / export JSON / RESET TO LOCKED DEFAULT
  reuse the existing preset system in `src/lib/gameSettings.ts`
  (MenuPreset gained an optional `custom` block; presets saved
  before batch B still load, with defaults merged in). Saving a
  preset NEVER overwrites locked v32 — only RESET restores v32 +
  these defaults.

## Rows — 33 + BACK = 34

| Group | Rows | Status in this batch |
|---|---|---|
| Layout (7) | MENU X, MENU Y, MENU W, MENU H, MENU SPACING, MENU ORDER, MENU ANCHOR | Stored + exported + applied to the Settings screen's own container (width/gap/anchor). Application to other menus: NEED — they do not read layout-as-data yet. Layout numbers are also mirrored into `preset.layout` (menuX/menuY/menuW/menuH/menuSpacing), the existing Layout Editor path. |
| Animation (3) | ANIMATION STYLE (SINE / FLOW / RISE_FADE), ANIMATION SPEED (0.5–2.0x), SWAY (0–8) | Stored + exported; preview strip in Menu Custom follows style label + speed + reduced-motion. Full sine/flow/rise-fade motion on real title/main-menu symbol layers: NEED (existing page-3 note). Animation speed is the single global row — it is also the gameplay-adjacent animation-speed row, counted once. |
| Background (4) | BACKGROUND BIOME (AUTO / NONE / 8 title biomes), PAINTED BACKGROUND, SYMBOL LAYER, BACKGROUND FADE (0–100%) | Biome / symbol / fade applied to the Settings screen background on return. PAINTED BACKGROUND: GAP for menus — painted title backgrounds now exist for 8/8 biomes (Title Backgrounds lane, complete) but are NOT wired as menu backgrounds yet, so the row is labelled NEED and changes nothing. |
| Day/night (5) | DAY/NIGHT MODE (AUTO / CUSTOM / OFF), DAY/NIGHT PERIOD, GRADUAL TRANSITION, DAY/NIGHT TINT (0–100%), GAME TIME NOW (read-only) | HeartGold `gf_rtc` structure, transcribed as data: LATE 0–3, MORN 4–9, DAY 10–17, EVE 18–20, NITE 21–23; visual states MORN/DAY/EVE/NITE, LATE renders as NITE (HeartGold wild-param fold). Gradual = palette blends toward the next period across its last hour (minute/60). Colourways are original Mochiichao palettes, not Pokemon palettes. GAME time = device clock at render (no simulated in-game clock exists yet — NEED; CUSTOM period overrides the display period only). Tint applied to the Settings screen; tint visible while pausing/playing: NEED — PauseMenu has no Settings entry yet. |
| Themes (4) | SAVE THEME, LOAD THEME, EXPORT THEME JSON, RESET TO LOCKED DEFAULT (v32) | All reuse the existing preset system. Reset is the only row that restores v32. |
| Sprite Proportions (1) | SPRITE PROPORTIONS (CHIBI / TALL) | CHIBI (default) is the rendered path. TALL is stored and labelled "falls back to Chibi" — display NEVER goes blank and NEVER shows a missing sprite. Real tall rendering: NEED. |
| Text extras (5) | TEXT SIZE (S/M/L/XL = 12/14/16/20px), LINE SPACING (1.0–2.0), TEXT COLOUR, TEXT SHADOW, DIALOGUE BOX STYLE (ROUNDED 14 / SQUARE 2 / GLOSS 18 / MINIMAL 8px) | Applied to DialogueBox + Settings row labels via CSS vars on return. The 6 font rows themselves are NOT touched here (font batch owns them). |
| Gameplay-adjacent (4) | CAMERA SHAKE, REDUCED MOTION, TOUCH SIZE (44/48/56px, default 48), SAFE AREA | Touch + safe area applied to the Settings screen immediately/on return; reduced motion stops the preview strip and sets `--menu-reduced-motion`. Camera shake: stored + exported only — no battle/world camera reads the flag yet (NEED). |

Count: rows present 33/33 = 100%. Rows with a real effect
somewhere in the game (Settings screen and/or DialogueBox):
31/33 = 94% (all except PAINTED BACKGROUND and TALL rendering,
which are stored + labelled fallbacks/GAPs, never blank, never
claimed as done). Rows whose effect reaches every menu in the
game: 5/33 text extras only (DialogueBox) + Settings-screen
effects — full cross-menu application is the NEED list below.

## NEED list (honest, not claimed)

1. Painted menu backgrounds (title paintings exist for 8/8 biomes; wiring them as menu backgrounds is still owed).
2. Tall sprite rendering (fallback to chibi until built).
3. Layout-as-data application to menus other than Settings.
4. Real sine/flow/rise-fade animation on title/main-menu symbol layers.
5. Day/night tint visible from pause / while playing (needs a PauseMenu → Settings path).
6. Camera-shake application in battle/world cameras.
7. Full reduced-motion suppression across battle/world animation.
8. A simulated in-game clock (today: device clock) and a frozen/custom clock.
9. Per-menu panel colour / frame overrides beyond the existing FRAME + panel rows (batch A territory — not duplicated here).

## NOT changed by this batch

HUD/borders/cursors (batch A), the 6 font rows, creator screens
(INTRO VIDEO / START SCREEN), title scene, main menu layout
(locked v32 untouched), saves, package.json / package-lock.json.
No file deletions. No Pokemon sprites, dialogue, music, cries,
or art. No secrets (manual check: no keys/tokens in the diff;
gitleaks is not installed, so no formal gitleaks run is claimed).
