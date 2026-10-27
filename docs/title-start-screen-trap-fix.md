# Interchangeable start screens — black-screen trap fix

## Live bug (2026-10-27, browser playtest)

Locked default title works. Settings TITLE SCREEN row works and saves.
But every preset tested so far black-screens on BACK TO TITLE and traps
the game: Snow — Yogiferno and Grass — Sproutle both showed a completely
black title (no video, no creature, no logo, no subtitle, no press
prompt), with Enter/Space/click/B/Escape doing nothing, even after
60 s / reload. 2/2 presets tested fail, so this is systemic, not a
Snow-only issue. RESET TO LOCKED DEFAULT was not in the main Settings
list, so there was no in-game recovery while trapped (workaround was
removing the `mochiichao_player_title_screen_preset` localStorage key).

## What was ruled OUT (evidence, not guesses)

- Missing files: all 10 final videos + their loader chunks ARE on
  gh-pages (tree listing), and the live bundle (`index-D6PBFv8g.js`,
  main 53c1ea9f) contains the preset registry, the `title-anim-final`
  dynamic imports, and the TitleStartScreen overlay markup verbatim.
- Wrong chunk URLs: the live bundle resolves video chunks with
  `new URL(<mp4>, import.meta.url)` relative to `assets/`, and the
  yogiferno loader chunk resolves to the mp4 blob that is on gh-pages.
- LockedStage old formula: the live bundle's LockedStage is the FIXED
  measured-centering version (scale from measured host size), not the
  old `600 - 600*scale` formula that pushed the stage off-screen.
- Settings key mismatch: the TITLE SCREEN row and the TITLE branch
  use the same key (`mochiichao_player_title_screen_preset`) and the
  same preset ids; the row saves immediately on cycling.
- Missing markup: server-rendering TitleStartScreen (Grass preset)
  produces PRESS ANY KEY, DIAMOND VERSION, both logos, and the
  TitleScene strip markup. The overlay markup exists; the live
  failure is runtime-only.
- Locked default regression: the locked TITLE branch, its keys, and
  its press path are untouched by this fix (see below).

## What the fix does (preset path ONLY)

1. Painted fallback layer: TitleStartScreen always renders the SAME
   preset's painted background as a full-screen `<img>` behind the
   video. If the video and the Pixi canvas both fail, the screen
   still shows the painting + overlay — never black.
2. No new class component: an earlier draft wrapped the Pixi strip
   in an error boundary, but the repo ships no @types/react, so no
   class component type-checks under the repo's actual toolchain
   (verified: any class component errors the same way here, and
   tsc already fails on main for unrelated missing modules).
   The boundary was removed rather than shipped broken. This costs
   nothing in practice: TitleScene failures happen inside effect
   / async code, which cannot unmount the React tree, and its
   render path is trivial JSX guarded by the painted fallback and
   the overlay above it.
3. LockedStage first-paint fallback: initial host size falls back to
   the viewport size when measurement has not run yet, so the stage
   never paints at scale 0. Measured values overwrite the guess
   before first paint in normal cases and always win afterwards —
   locked title/menu geometry is unchanged once measured.
4. Preset title owns its press path: TitleStartScreen receives
   `onAdvance` (IntroSequence advanceIntro) and handles clicks
   (outer-div mousedown, stopped) and any key (window listener,
   registered in the child's effect before the parent's, with
   stopImmediatePropagation) itself, so a preset title advances even
   if the parent window handler is ever absent. No double chirp:
   the parent handler never fires for the same event. The locked
   default keeps IntroSequence's handler exactly as before.
5. In-title recovery (preset titles only — locked default keys are
   unchanged): pressing R, or tapping the RESET TITLE button
   (top-right, above the overlay), clears the stored preset and
   re-renders the locked default title via `onReset`. R is safe
   because this handler only exists while a preset title is mounted.
6. Reachable RESET: a RESET TITLE SCREEN row in the MAIN Settings
   list (right after TITLE SCREEN) clears only the title pick.
   The full RESET TO LOCKED DEFAULT stays where it was (Menu
   Creator pages) and is unchanged.

## Files

- `src/components/game/TitleStartScreen.tsx` — items 1, 4, 5
  (item 2 is the deliberate non-boundary above).
  The locked overlay copy inside it is byte-identical in
  coordinates/content to before (logo, subtitle, press, studio).
- `src/components/IntroSequence.tsx` — preset branch only: passes
  `onAdvance`/`onReset` + a nonce that re-renders the TITLE branch
  after a reset. The locked TITLE branch below is untouched.
- `src/components/game/SettingsScreen.tsx` — one new row in the
  main list (item 6). No other row changed.
- `src/components/game/LockedStage.tsx` — item 3 only (initial
  state). No coordinate, font, logo, or menu change.
- This doc.

## Recovery, for players

- On a preset title: press R, or tap RESET TITLE (top-right).
- In Settings (main list): RESET TITLE SCREEN.
- Last resort (unchanged): remove the
  `mochiichao_player_title_screen_preset` key from localStorage.

## Still owed after merge (live playtest, not claimed here)

Re-run the preset playtest on the merged build: all 10 presets
(Back to Title + fresh reload each), the video + overlay + press +
MAIN_MENU path per preset, the R reset, the RESET button, the
Settings RESET TITLE SCREEN row, phone 390x844, and reduced motion.
Presets are NOT proven live until that playtest reports.
