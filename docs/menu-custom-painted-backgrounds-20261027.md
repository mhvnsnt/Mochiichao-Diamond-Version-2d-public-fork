# Menu Customisation — painted backgrounds wired (2026-10-27)

Mars approval (2026-10-27 verdicts, item 9): all 10 v2 paintings are
menu-background options. This PR wires them; it adds options only.

## What changed (2 files edited, 1 doc added, 0 deleted)

- `src/lib/menuCustom.ts`
  - New `paintedBackground: PaintedBackground` field (`'OFF' |
    TitleBiomeId`), default `'OFF'`.
  - New `PAINTED_BACKGROUNDS` = `['OFF', ...TITLE_BIOME_LIST ids]`,
    derived from `titleBiomes.ts` so the row can never drift from the
    paintings on main.
  - New `paintedBackgroundImage()` (URL from the painting's own
    `titleBiomes.ts` `backgroundImage` slot, or null when OFF) and
    `sanitisePaintedBackground()` (unknown values fall back to OFF).
  - `loadMenuCustom()` sanitises the stored choice instead of forcing
    `backgroundPainted: false`; `backgroundPainted` is kept as a boolean
    (true exactly when a painting is picked) for preset JSON
    compatibility. Render code reads `paintedBackground`, never the
    flag alone.
- `src/components/game/SettingsScreen.tsx` (Menu Customisation page)
  - The PAINTED BACKGROUND row now cycles OFF + all 10 paintings
    (LEFT/RIGHT), shows the picked painting in the preview line, and
    renders the picked painting as a cover background layer over the
    gradient (BACKGROUND FADE still controls its opacity). Preset
    load paths sanitise the choice the same way.
  - The BACKGROUND BIOME note is corrected: that gradient row offers
    8 biomes; mythar + lantern are painted options only.
- No change to `menuEditor.ts` (that file lives only on open PR #260,
  not on main) and no change to the locked title / locked v32 menu.

## The 10 options (10/10 = 100%)

All through the same PAINTED BACKGROUND row in Menu Customisation.
No painting is a default and no painting is hard-mapped to a specific
menu — no existing source mapped paintings to specific menus, and
this PR does not invent such a mapping.

| # | Row value | Painting file on main (v2, 1600x900) |
|---|-----------|----------------------------------------|
| 1 | SNOW | `src/assets/title/title-bg-snow-v2.png` |
| 2 | GRASS | `src/assets/title/title-bg-grass-v2.png` |
| 3 | WATER | `src/assets/title/title-bg-water-v2.png` |
| 4 | SAND | `src/assets/title/title-bg-sand-v2.png` |
| 5 | STONE | `src/assets/title/title-bg-stone-v2.png` |
| 6 | FOREST | `src/assets/title/title-bg-forest-v2.png` |
| 7 | RAIN | `src/assets/title/title-bg-rain-v2.png` |
| 8 | NIGHT | `src/assets/title/title-bg-night-v2.png` |
| 9 | MYTHAR | `src/assets/title/title-bg-mythar-v2.png` |
| 10 | LANTERN | `src/assets/title/title-bg-lantern-v2.png` |

All 10 PNGs were already on main; this PR uploads no painting.
Deliberately excluded: `title-bg-key-art-v2.png` (unmapped extra,
not one of the 10) and every v1 file (superseded, none referenced).

## No-default-change verification

- `DEFAULT_MENU_CUSTOM.paintedBackground` is `'OFF'` and
  `backgroundPainted` is still `false`.
- With OFF, `paintedBackgroundImage()` returns null, no painted layer
  div renders, and the gradient path is byte-identical logic to
  before this PR. With no option picked, the game looks exactly as
  before. The locked title and locked v32 main menu are untouched
  (no edits to `lockedV32Menu.ts`, `IntroSequence.tsx`, or
  `MainMenuBackground.tsx`).
- Old presets (saved before this PR, no `paintedBackground` field)
  load as OFF, not as a painting.

## Gates (run 2026-10-27 on a clean depth-1 clone of main + these
edits; scratch clone kept at
`~/workspace/mochiichao-work/painted-wiring-20261027/testclone/`)

- `tsc --noEmit`: baseline (pristine main) = 1 error, in
  `src/lib/wiring/phase4-garden.ts` (missing `fruit` key, unrelated
  to this PR); edited tree = the same 1 error, unchanged.
  Errors in PR files (`menuCustom.ts`, `SettingsScreen.tsx`) = 0.
- `vite build`: passing (`✓ built in 8m 51s`, `dist/index.html`
  present; the >500 kB chunk warning is the app's existing bundle
  size, not an error).
- Per-painting load check (esbuild bundle of the edited
  `menuCustom.ts` + `titleBiomes.ts`, PNGs as files): 17/17
  assertions passed — options list is exactly OFF + the 10 ids in
  titleBiomes order; default is OFF; OFF resolves to null; each of
  the 10 resolves to its own `title-bg-<id>-v2` PNG; sanitise
  falls back to OFF for bogus/undefined; key-art is not an option.
  The vite `dist/assets/` also contains exactly those 10
  `title-bg-*-v2` PNGs (hashed names) and no key-art PNG.
- No-default-change check: default OFF verified by assertion
  above; with OFF no painted layer renders and the gradient path
  is unchanged code.

## Still needing Mars's word

- Nothing for this item: approval was given and the wiring is
  complete at 10/10. Open follow-up (not in this PR): the gradient
  BACKGROUND BIOME row still offers only 8 biomes (mythar/lantern
  are painted-only there) — say the word if that row should also
  gain them.
- Scope-guard note: the Menu Editor (open PR #260 at the time this
  item was assigned) has since landed on main as the MENU_EDITOR
  screen inside `SettingsScreen.tsx` (PR #313). This PR does not
  touch `MenuEditorScreen.tsx` or `menuEditor.ts`; its
  `SettingsScreen.tsx` edits are confined to the Menu Customisation
  rows + background render, rebased onto the post-#313 base, so
  there is no competing editor edit in this PR.

## Re-verified on the retry run (2026-10-27, new main head)

The previous worker died on a runtime drain before opening a PR; no
remote branch or PR for this wiring existed (verified via
`git ls-remote`: no `feature/menu-custom-painted-backgrounds-20261027`
branch, no open PR with painted + background in the title). Main had
moved from 26e388236 (PR #318) to f5fa59a41 (PR #319, learnsets-live);
the two base files were verified byte-identical between those heads,
so this same wiring applies cleanly to f5fa59a41 with no rebase edits.

- Scope guard re-checked on f5fa59a41: `src/lib/menuEditor.ts` exists
  on main and contains zero painted references; the PAINTED
  BACKGROUND row lives in `SettingsScreen.tsx` (Menu Customisation)
  and its state lives in `menuCustom.ts`. Wiring is implemented
  outside `menuEditor.ts`, so no competing editor edit and no patch
  file is needed. `menuEditor.ts` and `MenuEditorScreen.tsx` are
  untouched by this PR.
- `tsc --noEmit` on f5fa59a41: baseline = 27 pre-existing errors
  (docs/title-lane-archive .tsx scripts, IntroSequence
  PINNED_SUBTITLE_FONT, phase4-garden fruit key); edited tree = the
  same 27, identical output, 0 in the PR files.
- Per-painting check re-run independently (esbuild bundle of the
  edited `menuCustom.ts` + `titleBiomes.ts`): 19/19 pass — OFF + 10
  in order, default OFF / backgroundPainted false, OFF resolves to
  null, each of the 10 resolves to its own `title-bg-<id>-v2` PNG,
  sanitise falls back to OFF for bogus/undefined, key-art excluded,
  no v1 option.
- No-default-change: default OFF verified by assertion; with OFF no
  painted layer renders and the gradient path is unchanged code.
- `vite build` on f5fa59a41 + this wiring: passing (built in 2m 49s,
  `dist/index.html` present); `dist/assets/` contains exactly the 10
  `title-bg-*-v2` PNGs and no key-art PNG. The >500 kB chunk warning
  is the app's existing bundle size, not an error.

Note at PR creation: main moved again to e1eecd70 (PR #324,
title-creatures docs only) during the gate run. That merge touches
none of this PR's files (verified: empty diff for menuCustom.ts,
SettingsScreen.tsx, and this doc between f5fa59a41 and e1eecd70), so
the PR diff is identical to the gated diff and the gates above stand
for this PR content; mergeability is confirmed by the PR API check
after creation, not by the gate-run head.
