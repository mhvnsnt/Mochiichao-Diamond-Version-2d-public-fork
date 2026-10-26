# Title-screen presets — creator seam (definitions only, 2026-10-26)

## Status

- Preset set defined: **10/10** (one per on-main title biome).
- Wired into any creator screen: **0/10** — deliberately not done here.
  This batch is definitions only, so it cannot conflict with the
  creator export worker's open PR #155, which touches creator screens.
- Locked default title + v32 main menu: untouched, still the default.
  No preset in this set is the default, and selecting a preset must
  never overwrite the locked default (that guard is the creator-UI
  plumbing step's job, owed after #155 merges).

## Files (all NEW, 0 edits to existing files)

- `src/lib/titleScreenPresets.ts` — canonical registry: types, the
  10-preset table, `resolveTitleScreenPreset()`,
  `validateTitleScreenPresets()`, `toTitleSceneProps()`,
  `toCreatorPresetData()`. Imports only on-main lib modules
  (titleBiomes, titleCardEffects, music's MusicTrack type) and the
  on-main title cutout assets.
- `src/lib/titleScreenPresets.json` — snapshot of the same table
  (format `mochiichao-title-screen-presets`, version 1) for
  JSON-loading creators. The `.ts` table is canonical; if the two
  ever disagree, the `.ts` table wins and the `.json` is regenerated
  from it. `validateTitleScreenPresets()` checks the `.ts` table
  against the on-main source maps, so drift surfaces as errors.
- This doc — the seam contract.

## The 10 presets (biome + creature pairs are exactly TITLE_CARD_CREATURES on main)

| Preset id | Background | Creature figure | Music | Press-start |
|---|---|---|---|---|
| title-snow-yogiferno | snow, title-bg-snow-v2.png | yogiferno-walk-cutout.png, YogifernoTitleWalk, 145x190, fire trail on | title | press-any-key-to-main-menu |
| title-grass-sproutle | grass, title-bg-grass-v2.png | sproutle-walk-cutout.png, TitleCreatureFigure, 259x333 | title | press-any-key-to-main-menu |
| title-water-dorowani | water, title-bg-water-v2.png | dorowani-walk-cutout.png, TitleCreatureFigure, 263x398 | title | press-any-key-to-main-menu |
| title-sand-tyrage | sand, title-bg-sand-v2.png | tyrage-walk-cutout.png, TitleCreatureFigure, 327x305 | title | press-any-key-to-main-menu |
| title-stone-razorgater | stone, title-bg-stone-v2.png | razorgater-walk-cutout.png, TitleCreatureFigure, 265x266 | title | press-any-key-to-main-menu |
| title-forest-gabu | forest, title-bg-forest-v2.png | gabu-walk-cutout.png, TitleCreatureFigure, 292x295 | title | press-any-key-to-main-menu |
| title-rain-mochii | rain, title-bg-rain-v2.png | mochii-walk-cutout.png, TitleCreatureFigure, 380x380 | title | press-any-key-to-main-menu |
| title-night-wispkin | night, title-bg-night-v2.png | wispkin-walk-cutout.png, TitleCreatureFigure, 288x609 | title | press-any-key-to-main-menu |
| title-mythar-mythar | mythar, title-bg-mythar-v2.png | mythar-walk-cutout.png, TitleCreatureFigure, 434x350 | title | press-any-key-to-main-menu |
| title-lantern-kittember | lantern, title-bg-lantern-v2.png | kittember-walk-cutout.png, TitleCreatureFigure, 287x304 | title | press-any-key-to-main-menu |

Effect set per preset (resolved from on-main maps, not re-typed):
biome weather + count, card effect (TITLE_CARD_EFFECTS), creature
action + burst (CREATURE_ACTIONS), background drift
(TITLE_BIOME_MOTION). Full values are in
`resolveTitleScreenPreset()` output; e.g. snow = snow weather 40 +
twinkle 12 + roar/fire + drift 10/3/0.25; rain = rain 50 + lightning
1 + glide/bubbles + drift 2/6/0.40; stone = no weather + scan 1
(Razorgater only, per the card note) + scan/sparks + no drift.

Music: every preset uses the existing `title` theme only
(mochiichao-title-v3.wav, loops). No per-preset theme exists yet;
the Title Music lane's gate holds for new music.

Press-start (identical on all 10): PRESS ANY KEY, blink 30 on /
15 off, M3 Mochii Chirp press sound, white fade 350ms, destination
MAIN_MENU — the locked default's behaviour, reused unchanged.

## Import seam (for the creator screens, AFTER PR #155 merges)

```ts
import {
  TITLE_SCREEN_PRESETS,
  resolveTitleScreenPreset,
  validateTitleScreenPresets,
  toTitleSceneProps,
  toCreatorPresetData,
} from '../lib/titleScreenPresets';
```

Steps for the plumbing worker (not done here):

1. Before listing, call `validateTitleScreenPresets()`; if it
   returns any strings, show them as GAP/errors and do not list
   the affected presets as ready. An empty array means clean.
2. Preview: `const resolved = resolveTitleScreenPreset(preset);`
   then render `<TitleScene {...toTitleSceneProps(resolved)} />`.
   This needs no edit to TitleScene, IntroSequence, LockedStage,
   or any menu screen — `toTitleSceneProps()` returns only props
   TitleScene already accepts, with `startPrompt: false` (the
   press prompt stays owned by IntroSequence's wiring).
3. Store/export: `toCreatorPresetData(resolved)` is the JSON-safe
   shape (format `mochiichao-title-screen-preset`, version 1).

## Field map: title preset -> creator preset shapes (proposed, not locked)

The creator shapes live in the creator screens / lib modules that
PR #155 touches, so this map is a proposal for the plumbing worker
to confirm against the merged #155 code — it does not change any
creator field today:

- title preset `background` (biome id) -> StartScreenPreset
  `background` (same TitleBiomeId values; note the start-screen
  preset's `backgrounds` list predates the mythar/lantern biomes
  and may need those two ids added by the plumbing worker).
- title preset `creature` -> StartScreenPreset `creature`
  (same 10-name rotation pool).
- title preset `effects.weather` / card effect / creature action
  -> IntroVideoScene particle / effect fields where the kind fits;
  kinds that do not fit are stored and shown, not forced into a
  frame (same rule PR #155 states for open-source picks).
- title preset `musicTheme` (name only) -> the intro timeline's
  music slot (name only; exports stay silent until original final
  music exists, same as PR #155's export note).
- title preset `pressStart` -> StartScreenPreset's pinned
  pressAnyKey slots (y = 927, blink 30/15) — values already match;
  the plumbing worker confirms, never moves, the locked slots.
- title preset `isDefault: false` -> the creator's "locked default
  never overwritten" guard: a title preset must be stored as a
  variant, never written over the locked default preset.

## GAPs, honestly marked

- Figure GAP: 0/10. All 10 cutouts ship on main.
- Background GAP: 0/10. All 10 painted backgrounds ship on main.
- Per-preset music themes: 0/10 exist (all presets share the
  existing `title` theme). New themes are the Title Music lane's
  gated work, not invented here.
- Creator-UI plumbing (list / preview / select / persist a preset
  in the creator screens): 0/1 — owed after PR #155 merges. This
  includes choosing a selection storage key (deliberately not
  invented here, to avoid colliding with #155's preset storage).
- Live playtest of a selected preset on a device: 0/1 — build +
  typecheck verify the definitions, not a played session.
- Logo: untouched (PNG, never font text). Locked default: untouched.
