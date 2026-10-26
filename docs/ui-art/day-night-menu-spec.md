# Day/night menu spec — spec only, NOT wired

UI Art lane, 2026-10-26. This document defines what each menu looks
like at each time of day. It changes NO code, NO locked default, and
NO existing file. Wiring is a separate, later PR; until that PR lands,
nothing on screen changes because of this spec.

## Status

- Spec: 8/8 skin menus below = 100% specified (main-menu, pause,
  settings, save-slots, bag, shop, battle, dialogue).
- Follow-up rows NOT specified here: roster/party, PC. Those menus
  have no Y2K skin preset yet (open PR #151 covers the 8 above), so
  their day/night rows wait for their skin presets rather than being
  guessed here.
- Locked default: EXEMPT, always. See "What never changes".

## Wiring status (stacked wiring PR, base = this spec branch)

- WIRED HERE (1 new module + line replacements only, 0 files deleted):
  `src/lib/dayNightMenuVariants.ts` resolves the variant once per
  menu render from the SAME Settings storage the DAY/NIGHT rows
  already write (no new row, no new storage key — the selection
  control is the existing Settings rows). `applyMenuCustom()` now
  also sets `--menu-daynight-panel` and `--menu-daynight-muted` on
  `:root` (those two were missing before, so no menu could read
  the full palette). In-game effect: PauseMenu carries the
  resolved vars + a scaled tint overlay; DialogueBox's frame
  accent is the resolved accent (its Batch A panel background is
  NOT overridden). SettingsScreen keeps its own equivalent tint
  implementation and is not refactored here.
- NOT WIRED HERE (still owed, not guessed): bag / shop / battle /
  save-slots panel + accent recolours — their panels are
  skin/CSS-defined, so they wait for the skins work (PR #151)
  rather than being repainted by guesswork here. Main-menu
  preset-only application waits for preset selection (#157 /
  #199 branches), which are not on this branch. Roster/party +
  PC rows wait for their skin presets, as in the Status section.
  Locked default title + v32 main menu remain EXEMPT, always.
- Tint strength: the SPEC PROPOSAL above is implemented in the
  new module as specified (alpha scaling only, 0% = no overlay,
  palettes still change). Default DAY frame border note: the
  dialogue frame border goes from the old 60%-alpha teal to the
  solid DAY accent (same hue, per the spec palette) — layout,
  labels, margins, fonts, and cursors are unchanged.

## Sources, in order (Pokemon-first rule)

1. Locked default title + main menu — `docs/locked-default-title-menu.md`
   and `docs/ui-art-options/main-menu-default-locked-v32.md` (v32:
   1200x1500 stage, logo y180 w900, cloud centre (600,738) 700x180,
   CONTINUE y788 h110 pink / NEW GAME y918 h70 yellow / SETTINGS
   y1008 h70 blue / BACK TO TITLE y1098 h70 green, background full
   start 905, fade 620-905 split at 729).
2. Day/night system already on main — `src/lib/menuCustom.ts`
   (Batch B, merged PR #60) and `docs/menu-custom-batch-b.md`.
   Everything in "Periods", "Palettes", and "Gradual transition"
   below is copied from that code, not invented here. Where this
   spec ADDS a rule the code does not have yet, it says so plainly
   as "SPEC PROPOSAL (not in code yet)".
3. Menu set — the 8 menus in open PR #151
   (`docs/ui-art/menu-skins/`: bag, battle, dialogue, main-menu,
   pause, save-slots, settings, shop). This spec does not touch
   those skin files; it sits alongside them.

## Periods (from HeartGold, as transcribed in menuCustom.ts)

HeartGold `gf_rtc` hour table (`pokeheartgold/src/gf_rtc.c`,
`GF_RTC_GetTimeOfDayByHour`), transcribed as data in Batch B:

| RTC period | Hours | Visual state shown |
|---|---|---|
| LATE | 0-3 | NITE (LATE folds to NITE visually) |
| MORN | 4-9 | MORN |
| DAY | 10-17 | DAY |
| EVE | 18-20 | EVE |
| NITE | 21-23 | NITE |

## Modes (from menuCustom.ts `resolveDayNightPalette`)

- AUTO (default): visual state comes from the device clock at render
  (this web game has no separate simulated in-game clock yet — that
  is a Batch B NEED, not claimed here).
- CUSTOM: the player-picked period overrides the DISPLAY period only;
  it does not advance a game clock.
- OFF: the DAY palette is shown at all hours.

## Palettes (exact values from menuCustom.ts `DAY_NIGHT_COLOURWAYS`)

Original Mochiichao colourways, not Pokemon palettes. Each state has
panel / accent / text / muted / skyTop / skyBottom / tint:

- MORN: panel `rgba(38, 52, 84, 0.92)`, accent `#fbbf24`,
  text `#fef3c7`, muted `#fde68a`, skyTop `#f59e0b`,
  skyBottom `#1e3a5f`, tint `rgba(251, 191, 36, 0.10)`.
- DAY: panel `rgba(22, 35, 58, 0.92)`, accent `#22d3ee`,
  text `#f1f5f9`, muted `#bae6fd`, skyTop `#38bdf8`,
  skyBottom `#0b1226`, tint `rgba(34, 211, 238, 0.06)`.
- EVE: panel `rgba(46, 28, 58, 0.92)`, accent `#f472b6`,
  text `#fdf2f8`, muted `#fbcfe8`, skyTop `#ec4899`,
  skyBottom `#1e1b4b`, tint `rgba(244, 114, 182, 0.12)`.
- NITE: panel `rgba(10, 16, 34, 0.94)`, accent `#818cf8`,
  text `#e0e7ff`, muted `#a5b4fc`, skyTop `#1e1b4b`,
  skyBottom `#020617`, tint `rgba(129, 140, 248, 0.14)`.

The machine-readable copy of these values is
`docs/ui-art/day-night-menu-variants.json` in this same PR.

## Gradual transition (from menuCustom.ts `dayNightBlend`)

- During the LAST hour of a period, the palette blends toward the
  next period by minute/60 (t = minute/60, 0 to 1). Outside that
  hour, t = 0 (pure current palette).
- Last hours: MORN ends 09, DAY ends 17, EVE ends 20, NITE ends 23.
- What blends: accent, text, muted, skyTop, skyBottom.
- What does NOT blend (code fact, kept in this spec): panel and
  tint stay at the current period's values through the blend hour.
- Midnight is not a blend point: NITE ends at 23, LATE renders as
  NITE, so no visual change happens at 0:00. That is correct, not
  a gap.

## Tint strength (SPEC PROPOSAL, not in code yet)

Batch B stores a DAY/NIGHT TINT row (0-100%) but the code's tint is
a fixed rgba per state. This spec proposes, for the wiring PR to
confirm or reject: tint strength scales the overlay alpha only.
Strength 100 = the rgba alpha listed above; strength 50 = half that
alpha; strength 0 = no tint overlay at all (palettes still change).
Tint never recolours the logo, never recolours button labels, and
never moves any element.

## Per-menu variants

Rules shared by all 8 menus: only panel colour, accent, text/muted,
backdrop sky gradient, and tint overlay change with the period.
Nothing moves, nothing resizes, no label text changes, and no
button colour identity changes (a pink CONTINUE stays pink, a
yellow NEW GAME stays yellow — day/night tints the panel and
backdrop around them, it does not repaint the buttons).

| Menu | DAY (base) | MORN variant | EVE variant | NITE variant |
|---|---|---|---|---|
| main-menu (preset only, NEVER the locked v32 default — see below) | v32 panel/backdrop colours as the preset defines them, DAY palette accents | MORN panel + amber accent on the preset's panel shapes, sky gradient amber-to-deep-blue behind the preset art | EVE panel + pink accent, rose-to-indigo sky behind the preset art | NITE panel + indigo accent, indigo-to-near-black sky behind the preset art |
| pause | DAY panel, cyan accent, light text | MORN panel, amber accent, warm text | EVE panel, pink accent, rose text | NITE panel, indigo accent, pale-indigo text |
| settings | DAY panel, cyan accent (this is the one menu Batch B already tints today) | MORN panel, amber accent, sky gradient behind the settings rows | EVE panel, pink accent, rose sky behind the rows | NITE panel, indigo accent, dark sky behind the rows |
| save-slots | DAY panel, cyan accent on slot frames | MORN panel, amber slot-frame accents | EVE panel, pink slot-frame accents | NITE panel, indigo slot-frame accents |
| bag | DAY panel, cyan accent on category tabs | MORN panel, amber tab accents | EVE panel, pink tab accents | NITE panel, indigo tab accents |
| shop | DAY panel, cyan accent on price/buy accents | MORN panel, amber buy accents | EVE panel, pink buy accents | NITE panel, indigo buy accents |
| battle | DAY panel, cyan accent on battle panels | MORN panel, amber battle accents | EVE panel, pink battle accents | NITE panel, indigo battle accents |
| dialogue | DAY panel, cyan accent on the dialogue box frame (dialogue already reads Batch B CSS vars today) | MORN panel, amber frame accent | EVE panel, pink frame accent | NITE panel, indigo frame accent |

Backdrop rule (SPEC PROPOSAL, not in code yet): where a menu has a
backdrop sky gradient, it uses that period's skyTop-to-skyBottom.
Where a menu sits over game art (battle, dialogue over the world),
there is no sky gradient — only the panel + accent + tint overlay
change, so the game art underneath is never repainted.

## What never changes

- The locked default TITLE: no day/night variant, at any hour, in
  any mode. Logo is the uploaded logo PNG
  (`src/assets/ui/mochiichao-main-logo.png`), never font text.
- The locked default MAIN MENU (v32): no day/night variant, at any
  hour, in any mode. The main-menu row in the table above applies
  ONLY when a non-locked preset is active. A future "day/night on
  the locked default" action needs Mars's own explicit yes, like
  every other default change.
- Locked placements: v32 coordinates above, title stage geometry
  (logo centre (600,450), PRESS ANY KEY y927, studio top 944),
  button order and labels, panel positions and sizes.
- Other lanes' pieces, named only as owed by their lane: painted
  menu backgrounds (show-first, not wired), title/background art,
  music, sprites, cutouts. This spec does not spec, move, or wire
  any of them.

## Wiring checklist (for the later wiring PR, NOT done here)

1. Read the resolved palette (mode + period + blend) once per menu
   render; do not recompute per element.
2. Apply panel / accent / text / muted / sky / tint only; assert no
   layout value changes in the same PR (layout diff must be empty).
3. Add the roster/party + PC rows when their skin presets land.
4. Add the simulated/frozen game clock if Mars wants CUSTOM to mean
   more than a display override (Batch B NEED, still open).
5. Prove OFF = DAY at every hour, and midnight = no visual jump
   (NITE into LATE), in the wiring PR's checks.

## What this spec does NOT claim

- No menu is wired to day/night by this PR. Batch B today wires
  only the Settings screen itself (background tint, panel width /
  gap / preview) and the DialogueBox CSS vars; day/night tint
  while pausing/playing is still a Batch B NEED because PauseMenu
  has no Settings entry yet.
- No new art, no new fonts, no new palettes beyond the four Batch B
  colourways. The EVE/MORN/NITE looks here are those colourways
  applied per menu, not newly invented colours.
