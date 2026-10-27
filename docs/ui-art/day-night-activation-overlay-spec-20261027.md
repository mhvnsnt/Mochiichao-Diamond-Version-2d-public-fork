# Day/Night Activation — overlay spec (Mars verdict, 2026-10-27)

Docs only. This file changes NO code, NO locked default, NO existing
file, and NO theme. It is an ADDENDUM to PR #153, not a replacement
for it, and it deepens (but does not replace) the wiring plan in
PR #212. See "Relationship to #153 / #212" at the end. The companion
wiring plan is `day-night-activation-overlay-plan-20261027.md` in
this same PR.

## Mars's ruling, in plain terms

On default, the menu has a setting that says day/night activation,
and no matter what custom theme you do, it applies its own
variation and changing of the day/night cycle — an OVERLAY cycle,
not a replacement theme.

That sentence fixes three things that PR #153 left open:

1. The setting is present BY DEFAULT (a first-class row in the
   default Settings menu, not a hidden or preset-only switch).
2. The cycle applies OVER any custom theme. The theme stays.
   A day/night overlay modulates it. The cycle never replaces,
   rewrites, or clobbers a custom theme.
3. The cycle is therefore a LAYER, not a theme. Turning it off
   must return the theme exactly as it was, because the theme
   was never touched.

## 1. The setting

### Location (exact row)

`src/components/game/SettingsScreen.tsx`, in the existing
"Day / night" block, as the FIRST row of that block — immediately
after the `BACKGROUND FADE` row and immediately before the
existing `DAY/NIGHT MODE` row.

On main at the time of writing (head `60b5e62d`, PR #289), that
block is:

```
// Day / night — HeartGold gf_rtc structure, GAME (device) time.
DAY/NIGHT MODE          (line 450)
DAY/NIGHT PERIOD        (line 451)
GRADUAL TRANSITION      (line 452)
DAY/NIGHT TINT          (line 453)
GAME TIME NOW           (line 454, read-only)
```

The new row is inserted above `DAY/NIGHT MODE`, so the block
becomes:

```
DAY/NIGHT ACTIVATION    <- NEW, this spec
DAY/NIGHT MODE          (existing, unchanged)
DAY/NIGHT PERIOD        (existing, unchanged)
GRADUAL TRANSITION      (existing, unchanged)
DAY/NIGHT TINT          (existing, unchanged)
GAME TIME NOW           (existing, read-only, unchanged)
```

No other row moves, is renamed, or is removed. The row follows
the existing Settings pattern: name left / value right, Left/Right
cycles the value, A confirms, B goes back.

### Values and default

- Label: `DAY/NIGHT ACTIVATION`
- Values: `ON` / `OFF` only. Left/Right toggles. No third value.
- Default value: `OFF`.
- Why OFF, not ON: the hard guard on this work is that the
  default look WITHOUT activation on must be provably unchanged.
  The only default consistent with that guard is OFF: out of the
  box, no overlay renders, no menu changes, and the locked
  default looks exactly as it does on main today. "Present by
  default" in Mars's ruling is therefore read as "the ROW is
  present by default", not "the cycle is ON by default".
  If Mars meant default = ON, that is a separate, explicit order
  (it would change the out-of-box look by definition) — see
  "Still needing Mars's word".
- Note text on the row (proposed wording for the wiring PR):
  "OFF = menus show the theme exactly as saved. ON = the
  day/night overlay modulates the theme (panel / accent / sky /
  tint only). The theme itself is never rewritten."

### What the existing rows do once Activation exists

Activation is a master gate for the OVERLAY LAYER only. It does
not rename, delete, or re-default the existing rows:

- `DAY/NIGHT MODE` (AUTO / CUSTOM / OFF, default AUTO): when
  Activation is ON, this selects the cycle source (see §2).
  When Activation is OFF, this row's value is stored but has
  NO effect on any menu outside the Settings screen itself.
- `DAY/NIGHT PERIOD` (MORN / DAY / EVE / NITE): the CUSTOM
  period. Same gating as MODE.
- `GRADUAL TRANSITION` (ON / OFF, default ON): the last-hour
  blend. Same gating as MODE.
- `DAY/NIGHT TINT` (0–100%, default 100): scales ONLY the
  overlay tint alpha (see §3). Same gating as MODE.
- `GAME TIME NOW` (read-only): unchanged. It keeps reporting
  the clock and the resolved visual state whether Activation is
  ON or OFF, so the player can configure the cycle before
  switching it on.

Deliberate UX rule: the MODE / PERIOD / TRANSITION / TINT rows
stay visible and editable while Activation is OFF. They are NOT
greyed out or hidden, so a player can pre-configure a cycle and
then flip one switch to see it. Gating is at render time (the
overlay is not drawn), never by hiding or discarding settings.

### Settings screen's own tint is a preview, not the overlay

On main today, SettingsScreen already draws its own day/night
tint div (main `SettingsScreen.tsx` ~line 615: tint div shown
when MODE is not OFF, opacity = TINT / 100). This spec does NOT
change that behaviour: the Settings screen's tint is the cycle's
PREVIEW, and it stays exactly as it is on main. Activation gates
the overlay on menus (pause, dialogue, bag, shop, battle,
save-slots, roster/party, PC, preset main-menu). It does not
gate, remove, or restyle the Settings preview. That separation
is what makes "OFF = unchanged" provable: the one screen that
already tints on main keeps tinting exactly as before, and every
other menu is untouched when Activation is OFF.

## 2. Cycle behaviour (timing and source)

The cycle reuses the existing Batch B machinery exactly. This
spec invents no new clock, no new hour table, and no new
periods.

### Source: device clock at render (no in-game clock yet)

- AUTO: the visual state comes from the DEVICE clock at render
  time, exactly as `getGameVisualState(now)` does on main today
  (`src/lib/menuCustom.ts`). This web game has NO separate
  simulated in-game clock yet — that is still the Batch B NEED
  named in PR #153, and it is NOT claimed here.
- CUSTOM: the player-picked PERIOD overrides the DISPLAY period
  only. It does not advance, freeze, or replace any game clock.
- MODE = OFF (the existing row, distinct from ACTIVATION = OFF):
  the DAY palette at all hours. MODE = OFF with Activation ON
  therefore means "overlay on, but always DAY" — a valid,
  boring combination, not an error.
- If a simulated/frozen in-game clock lands later, AUTO's source
  switches to it and NOTHING in this overlay contract changes:
  the overlay still receives one resolved visual state + one
  blended palette per render, from the same resolver.

### Periods (HeartGold RTC hour table, as transcribed in Batch B)

| RTC period | Hours | Visual state shown |
|---|---|---|
| LATE | 0–3 | NITE (LATE folds to NITE visually) |
| MORN | 4–9 | MORN |
| DAY | 10–17 | DAY |
| EVE | 18–20 | EVE |
| NITE | 21–23 | NITE |

- Midnight is not a visual jump: NITE ends at 23 and LATE
  renders as NITE, so 23:59 → 00:00 shows no change.
- Gradual transition (existing `dayNightBlend`): during the LAST
  hour of a period (MORN ends 09, DAY ends 17, EVE ends 20,
  NITE ends 23), accent / text / muted / skyTop / skyBottom
  blend toward the next period by minute/60. Panel and tint do
  NOT blend — they stay at the current period's values through
  the blend hour. With TRANSITION = OFF, the change is a hard
  cut at the boundary hour.
- Resolution is once per menu render, from the same stored
  settings (PR #212 checklist item 1). The overlay is never
  recomputed per element, and it never ticks on its own timer:
  a menu that stays open across a boundary hour re-resolves on
  its next render, exactly like Batch B today.

### Palettes (existing Batch B colourways — quoted, not changed)

Original Mochiichao colourways, not Pokemon palettes. These are
the OVERLAY's colours; the theme underneath keeps its own.

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

Tint strength scales the overlay alpha ONLY: strength 100 =
the alpha above, 50 = half, 0 = no visible tint overlay at all
(the palette vars still apply — see PR #153's tint rule, which
PR #212 already implements as `scaleTintAlpha`).

## 3. The overlay model: what it touches, what it never touches

### How it is drawn (the whole mechanism)

The overlay is a render-time composition, in this order,
bottom to top:

1. BASE LAYER — the theme, exactly as saved: its skin files,
   its panel art, its button colours, its layout, its fonts.
   Drawn first, untouched.
2. OVERLAY LAYER (only when Activation is ON) — two things,
   and only two things:
   a. A single `pointer-events-none`, `aria-hidden` tint div
      over the menu surface, background = the period tint
      rgba with alpha scaled by DAY/NIGHT TINT (the pattern
      already used by SettingsScreen on main and by PR #212's
      PauseMenu tint). It never intercepts clicks.
   b. The seven day/night CSS vars (`--menu-daynight-panel`,
      `--menu-daynight-accent`, `--menu-daynight-text`,
      `--menu-daynight-muted`, `--menu-daynight-sky-top`,
      `--menu-daynight-sky-bottom`, `--menu-daynight-tint`),
      consumed ONLY by menu surfaces that opt in — i.e. they
      modulate panel fill, frame accent, text/muted, and a
      backdrop sky gradient where the menu already has one.
3. Nothing else. No second theme is loaded, no skin file is
   swapped, no theme value is overwritten in memory or storage.

When Activation is OFF, layer 2 does not exist: no overlay div
is mounted, and no menu reads the day/night vars. The DOM and
the render path are therefore identical to main today for every
menu. That is the proof obligation for every wiring step
(see the companion plan, gate G1).

### Layers the overlay TOUCHES (only these, only as above)

- Menu panel fill (via `--menu-daynight-panel`) on menus that
  opt in.
- Frame / tab / slot-frame accent (via
  `--menu-daynight-accent`): pause panel accent, dialogue frame
  accent, bag category tabs, shop price/buy accents, battle
  panel accents, save-slot frames, roster/party and PC accents.
- Text / muted colours (via `--menu-daynight-text` /
  `--menu-daynight-muted`) on those same surfaces.
- Backdrop sky gradient (skyTop → skyBottom) ONLY where a menu
  already has a backdrop sky gradient (Settings preview,
  preset main-menu backdrops). Where a menu sits over game art
  (battle, dialogue over the world), there is NO sky gradient:
  only panel + accent + tint change, so the game art
  underneath is never repainted.
- The tint overlay div described above.

### Layers the overlay NEVER touches

- Theme storage: the Batch B localStorage key
  (`mochiichao_menu_custom_v1`) is never rewritten by the
  overlay. Activation itself is one new boolean FIELD inside
  that same existing key (see the plan, step 1) — no new key,
  and no theme field is ever written by cycle code.
- Saved / loaded / exported theme JSON: overlay state and
  overlay colours are NEVER included in a theme export, and
  loading a theme NEVER changes Activation. A theme saved
  with Activation ON exports byte-identically (for its theme
  fields) to the same theme saved with Activation OFF.
- Skin files (`docs/ui-art/menu-skins/*`, `menuSkins.css`,
  `menuSkins.ts`): never edited, never swapped by the cycle.
- Button colour identity, labels, order, and geometry: a pink
  CONTINUE stays pink, a yellow NEW GAME stays yellow; no
  element moves, resizes, or changes label or font.
- The logo: always the uploaded logo PNG
  (`src/assets/ui/mochiichao-main-logo.png`), never font text,
  never recoloured by any tint.
- Title video / art and world / battle art / sprites: never
  repainted, never tinted by the menu overlay. The overlay's
  scope is menus only.
- Music: the menu overlay is VISUAL ONLY in this spec. (In
  HeartGold, night music is a separate per-map alternate track
  — see §4 — not a tint. Any Mochiichao night-music hook is
  owed by the audio lane, not smuggled into this menu spec.)
- Game clock, save data, and gameplay state: the cycle reads
  the clock; it never writes time, encounters, or saves.
- Layout values: any wiring step whose diff changes a layout
  value (position, size, margin, font, cursor) is out of scope
  for that step and must be split out or dropped.

## 4. Research: what the games actually vary vs what is Mochiichao design

Pokemon-first rule, as in PR #153. Sources are checked in this
order: pokeheartgold submodule first, then industry sources.
File references are to the repo's `pokeheartgold/` submodule
unless stated otherwise.

### HeartGold / SoulSilver — what the code actually does

1. The clock is the hardware RTC, not a simulated clock.
   `include/gf_rtc.h` defines `RTC_TimeOfDay` (MORN, DAY, EVE,
   NITE, LATE, COUNT) and `GF_RTC_GetTimeOfDay()` /
   `GF_RTC_GetTimeOfDayByHour(hour)`. `src/gf_rtc.c`
   `GF_RTC_GetTimeOfDayByHour` is a 24-entry hour table:
   LATE 0–3, MORN 4–9, DAY 10–17, EVE 18–20, NITE 21–23.
   `IsNighttime()` in the same file is true for NITE or LATE
   only. The wild-encounter mapping
   (`GF_RTC_GetTimeOfDayWildParamByHour`) folds MORN → wild
   MORN, DAY + EVE → wild DAY, NITE + LATE → wild NITE — the
   origin of the "LATE renders as NITE" rule Batch B copied.
2. The overworld varies LIGHTING and PROP ANIMATION, not menu
   art. `src/field/overlay_01_02204004.c`
   (`FieldSystemUnkSub104_SwitchTimeOfDay`) keeps a stored
   period, and ONLY when the RTC period changes, it swaps
   each map prop's animation to that period's variant, via a
   4-entry visual-state table (MORN 0, DAY 1, EVE 2, NITE 3,
   LATE 3). The props keep all four variants; the active one
   is swapped — the same shape as Mochiichao's overlay idea
   (modulate, don't replace the asset). Separately,
   `src/field/fieldmap.c` calls
   `AreaLightManager_UpdateActiveTemplate` on map load
   (interface: `include/field/area_light.h`); per-area lighting
   templates are the field-lighting mechanism. No standalone
   `area_light.c` exists in the submodule tree — the manager's
   implementation lives in field overlay code, so this spec
   cites the header + call site only, and does not invent a
   palette-tint function HeartGold does not show.
3. Battles inherit the field period. `src/battle/battle_setup.c`
   sets `setup->timeOfDay` from `Field_GetTimeOfDay` (or the
   saved RTC hour) in every setup path, and forces NITE for
   cave battles. Time of day is therefore a battle parameter,
   not a battle re-skin.
4. Music is a per-map ALTERNATE TRACK, not a tint.
   `src/data/map_headers.h` carries a `.nightMusicId` per map
   (often `SEQ_DUMMY` = no night track). Night music is a
   data hook chosen per map, which is why this spec keeps
   music out of the menu overlay: a menu tint cannot and
   should not imply a music change.
5. Encounters, rematches, and phone dialogue branch on the
   period (`src/field/encounter_check.c`,
   `src/application/pokegear/phone/*`): period is gameplay
   data first, presentation second.
6. What HeartGold does NOT do (checked, not assumed): no
   time-of-day menu palette code was found in the submodule.
   The start / bag / settings-style menus are not re-tinted
   by the RTC in HGSS. The menu day/night cycle in Mochiichao
   is therefore MOCHIIChAO DESIGN that borrows HeartGold's
   clock + period + visual-state machinery — it is not a
   claim that HGSS menus change colour at night.

Secondary corroboration (Bulbapedia, "Time" page):
morning tints the world pale blue, day shows natural colours,
evening brings an orange hue with city floodlights on, night
darkens the landscape with building lights; Gen VI later
stretched period transitions to up to ~15 minutes, i.e. the
industry direction is gradual lighting change, which Batch B's
last-hour blend already follows in Mochiichao's own way.
(Bulbapedia "Time": https://bulbapedia.bulbagarden.net/wiki/Time)

### Industry pattern — overlay, not replacement

The overlay model is the standard implementation, not a
Mochiichao invention:

- Adventure Game Studio's Day/Night Cycle module implements
  night as "an overlay (in the form of a full-screen,
  non-clickable GUI)" — a dark-blue image at chosen opacity
  laid over the scene, with the scene's own art untouched.
  (https://www.adventuregamestudio.co.uk/forums/modules-plugins-tools/module-daynight-cycle-seasons/)
- Unity day/night guides drive the same effect through a
  light / skybox gradient (ambient light, fog colour, skybox
  tint) evaluated per phase, and explicitly warn to
  instantiate skybox materials at runtime "to avoid
  permanently modifying assets in the editor" — modulate at
  render time, never rewrite the asset.
  (https://outscal.com/blog/how-to-create-day-night-cycle-in-unity?srsltid=AfmBOoqraIui_3PU_GxYfJZzA_0ziq8rx7fOhhIsdZo3iCkeRDLgVQpL)
- Post-processing colour grading (e.g. ReShade) applies
  saturation / contrast / tone over rendered frames "without
  replacing the game's original assets" — the same layer
  separation, one level up the stack.
  (https://www.analyticsinsight.net/ampstories/gaming/reshade-explained-9-ways-gamers-transform-graphics-and-visual-effects)

### What is Mochiichao design (not from the games)

- Applying the cycle to MENUS at all (HGSS varies field,
  battle, encounters, music — not menus).
- The four Batch B colourways (MORN amber, DAY cyan, EVE pink,
  NITE indigo) and their exact rgba/hex values: original
  Mochiichao colours, quoted in §2, not Pokemon palettes.
- The last-hour blend by minute/60 with panel + tint
  unblended: a Mochiichao smoothing rule on top of HGSS's
  discrete hour table.
- The Activation master switch itself, and the rule that the
  overlay never writes theme storage: Mars's ruling, not a
  Pokemon behaviour.

## 5. Interaction with presets (PR #259) and the Menu Editor (PR #260)

### Presets — PR #259 (MERGED into main; read this as merged, not open)

PR #259 ("Interchangeable title start screens: 10 presets,
video + TitleScene + locked overlay") is MERGED, so its
presets are on main now. The interaction rule is:

- The overlay NEVER touches a preset's video or art. A
  #259 preset's title video, scene art, and locked overlay
  are the base layer, exactly like a theme's skin art.
- When a NON-LOCKED preset is the active start screen, its
  MENU layer (panel / buttons over the preset) may receive
  the overlay when Activation is ON, under the same rules as
  any custom theme: panel / accent / sky / tint only, button
  colour identity unchanged.
- When the LOCKED DEFAULT start screen is active, the overlay
  does not apply to it at all (see §6). Preset selection
  never changes Activation, and Activation never changes
  which preset is selected.
- The existing PR #153 main-menu row ("preset only, NEVER
  the locked v32 default") is therefore KEPT, and this spec
  extends it with the Activation gate: preset-menu overlay
  requires Activation ON as well as a non-locked preset.

### Menu Editor — PR #260 (OPEN, not on main; sibling-owned)

PR #260 is OPEN and its files (`src/lib/menuEditor.ts`,
`src/components/game/MenuEditorScreen.tsx`,
`src/lib/menuEditorExport.ts`, +284-line trace doc) are NOT on
main yet — verified via the Contents API (both editor files
404 on main). The interaction is therefore a CONTRACT for the
future merge, not a change to main today, and this spec PR
does NOT edit `menuEditor.ts` (a sibling agent owns it) or
any other #260 file:

- The Editor edits the BASE THEME. The overlay is not an
  editor field, not an editor row, and not part of any theme
  the Editor saves, loads, or exports.
- Overlay state is never persisted into an Editor theme or
  export, and an Editor export/import round-trip must render
  identically with Activation OFF — the plan's gate G5
  proves this.
- The Editor's live preview shows the BASE THEME. If the
  sibling owner wants a preview-with-overlay toggle inside
  the Editor, that is their follow-up step, owned by them:
  it must render the overlay on top of the preview without
  writing anything into the theme being edited, and it must
  not reuse this spec's Activation row as an editor row.
- Merge-order note for the Editor lane: when #260 lands, its
  Settings-screen changes (it touches `SettingsScreen.tsx`
  +8/−3) will sit next to this spec's one new Activation row.
  The row insertion point in §1 (before DAY/NIGHT MODE) is
  chosen so the Editor lane can re-apply it without moving
  any Editor row; if #260 merges first, the wiring PR
  re-checks the insertion point against #260's version of
  the file and reports any shift instead of guessing.

## 6. What never changes (guards, restated for this addendum)

- The locked default TITLE: no overlay, at any hour, in any
  mode, with Activation ON or OFF. Logo is the uploaded logo
  PNG, never font text.
- The locked default MAIN MENU (v32): no overlay, at any
  hour, in any mode, with Activation ON or OFF. v32 placements
  never move (logo y180 w900, cloud (600,738) 700x180,
  CONTINUE y788 h110 pink / NEW GAME y918 h70 yellow /
  SETTINGS y1008 h70 blue / BACK TO TITLE y1098 h70 green).
  The main-menu overlay row applies ONLY to non-locked
  presets / custom themes.
- The default look WITHOUT Activation ON is provably
  unchanged: OFF means no overlay div, no day/night var
  consumption, and no theme-storage write — for every menu,
  including every custom theme. (The Settings preview tint,
  which already exists on main, is the single stated
  exception, and it is unchanged rather than added.)
- 0 FILE deletions in this PR and in every wiring step that
  follows it. No force-push, no rebase, no amend. No merge
  and no Pages publish by this PR.

## Relationship to #153 / #212

- PR #153 (OPEN, mergeable, +169/−0, branch
  `feature/day-night-menu-spec-1`): the per-menu day/night
  SPEC this addendum builds on. This PR does NOT edit,
  duplicate, or supersede #153's files
  (`docs/ui-art/day-night-menu-spec.md`,
  `docs/ui-art/day-night-menu-variants.json`). Where #153
  says a menu "applies per resolved period", this addendum
  adds the missing gate: "per resolved period AND Activation
  ON". Where #153 marks the locked default EXEMPT, this
  addendum keeps that exemption and extends the same logic
  to custom themes (they are modulated, never replaced).
  #153 can merge before, after, or independently of this PR:
  the files do not overlap, so there is no content conflict.
- PR #212 (OPEN, mergeable, +201/−1, branch
  `feature/day-night-menu-variants-wiring`, base =
  #153's branch, "DO NOT merge to main"): the wiring that
  makes #153's variants actually switchable (new
  `src/lib/dayNightMenuVariants.ts`, PauseMenu tint,
  DialogueBox frame accent, two missing `:root` vars).
  This addendum DEEPENS #212's plan (see the companion plan
  file) and adds ONE REQUIRED CHANGE to #212 before it
  merges: its PauseMenu tint and DialogueBox accent must be
  gated by Activation (OFF = today's render, exactly).
  Until that gate is added, #212 as written would apply the
  cycle whenever MODE is not OFF — which is NOT Mars's
  overlay ruling (it would change the default look, since
  MODE defaults to AUTO). #212 must therefore NOT merge
  ungated, and it still must NOT merge to main directly:
  it merges onto #153's branch first, as its own title says.
- Merge order recommended: (1) this docs PR (independent,
  safe any time); (2) #153; (3) #212 with the Activation
  gate added, onto #153's branch; (4) the overlay wiring
  steps in the companion plan, one menu slice at a time.
- This PR itself: 2 files ADDED, 0 modified, 0 deleted.
  Docs only, so no buildable code is touched and no
  `npm run build` is claimed for it.

## Still needing Mars's word

1. Default value: this spec sets Activation default = OFF so
   the default look is provably unchanged. If Mars meant the
   cycle to be ON out of the box, say so explicitly — that
   changes the out-of-box look and needs its own order, like
   any locked-default change.
2. Locked default + Activation ON: this spec keeps the locked
   title / v32 menu exempt even when Activation is ON, per
   #153's rule that any day/night-on-default needs Mars's
   own explicit yes. If Mars wants the overlay over the
   locked default too when Activation is ON, that is a
   second explicit yes, separate from (1).
3. In-game clock: AUTO = device clock until a simulated
   in-game clock exists. No decision is needed now, but if
   Mars wants CUSTOM to mean "freeze / advance a game clock"
   rather than "fixed display period", that is a new scope
   item for a later spec, not a silent extension of this one.
4. Night music: out of scope here by design (see §3/§4). If
   Mars wants menu-adjacent night-music hooks, that belongs
   to the audio lane with per-area data like HGSS's
   `.nightMusicId`, not to this overlay.
