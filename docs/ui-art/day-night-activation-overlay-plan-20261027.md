# Day/Night Activation — wiring plan (deepened from PR #212)

Docs only. Companion to
`day-night-activation-overlay-spec-20261027.md` in this same PR.
This plan changes NO code. It orders the implementation of the
overlay so that each step is small, reviewable, and provable —
and so that no step ever rewrites a theme.

Base assumptions (all re-verified 2026-10-27, see "Verified
state" below): PR #153 (spec) and PR #212 (variants wiring) are
OPEN and mergeable; PR #259 (title presets) is MERGED; PR #260
(Menu Editor) is OPEN and NOT on main; main head is `60b5e62d`.

## Verified state (2026-10-27, via GitHub API)

- Main head: `60b5e62d475664d3cca8edc43b44641e742ae574`,
  "Environment tiles step 3 (#289)", pushed 2026-10-27T13:07:42Z.
  Verified via the repo's Contents API (the
  `custom.github-api` helper script itself only exposes
  `me` / `list-repos`; the Contents calls in this check used
  the same surrogate-credential mechanism as
  `~/workspace/mochiichao-work/gh.py`).
- PR #153: OPEN, mergeable, +169/−0, 2 files, head
  `feature/day-night-menu-spec-1` @ `c28957244639`, base main.
  Files: `docs/ui-art/day-night-menu-spec.md` (+168, added),
  `docs/ui-art/day-night-menu-variants.json` (+1, added).
- PR #212: OPEN, mergeable, +201/−1, 5 files, head
  `feature/day-night-menu-variants-wiring` @ `123c38249aad`,
  base = #153's branch. Files: spec doc (+29, modified),
  `src/components/game/DialogueBox.tsx` (+10),
  `src/components/game/GameShell.tsx` (+12/−1),
  `src/lib/dayNightMenuVariants.ts` (+148, added),
  `src/lib/menuCustom.ts` (+2).
- PR #259: CLOSED + MERGED, +633/−6, 6 files. Its presets are
  therefore on main; the spec file treats them as merged.
- PR #260: OPEN, mergeable, +2442/−129, 9 files, head
  `feature/menu-editor-20261026` @ `63d3be8dcbac`, base main.
  Files include `src/lib/menuEditor.ts` (+580, added) and
  `src/components/game/MenuEditorScreen.tsx` (+775, added).
- Main Contents checks: `docs/ui-art/` on main holds ONLY
  `menu-skins/` (the #153 spec files are NOT on main yet);
  `src/lib/menuCustom.ts` (18,868 bytes) and
  `src/components/game/SettingsScreen.tsx` (71,199 bytes)
  exist on main; `src/lib/menuEditor.ts` and
  `src/components/game/MenuEditorScreen.tsx` 404 on main
  (they exist only on #260's branch).
- Main Settings day/night block (from main
  `SettingsScreen.tsx`): comment line 449, `DAY/NIGHT MODE`
  450, `DAY/NIGHT PERIOD` 451, `GRADUAL TRANSITION` 452,
  `DAY/NIGHT TINT` 453, `GAME TIME NOW` 454 (read-only),
  then the Themes block (`SAVE THEME` 456 … `RESET TO
  LOCKED DEFAULT (v32)` 459). The Activation row goes
  between the block comment and `DAY/NIGHT MODE`.
- The local `~/workspace/mochiichao-work/fresh-start`
  checkout was NOT used for any commit: it is dirty (14
  modified + ~100 untracked files) and stale (it predates
  `menuCustom.ts` entirely). All state above came from the
  API, and this PR is created via the API, not from that
  tree. No git commit was made from the dirty tree.
- Main `menu-skins/` now includes `party.y2k-skins.json`
  and `pc.y2k-skins.json` alongside the 8 skins #153 was
  built on — so roster/party + PC are no longer blocked on
  skins (see step 8).

## Design contract the steps must honour (from the spec)

- Overlay = render-time layer only: one `pointer-events-none`,
  `aria-hidden` tint div + the seven `--menu-daynight-*` vars,
  consumed only by opted-in menu surfaces.
- Activation OFF = no overlay div mounted, no day/night var
  consumption, no theme-storage write, for every menu.
- The theme is never written by cycle code, in memory or in
  storage, in either direction (ON or OFF).
- Layout diff must be empty for every wiring step: no
  position, size, margin, font, label, order, or cursor change.
- Locked default title + v32 main menu never call the
  overlay resolver, at any hour, in any mode, with
  Activation ON or OFF.
- Logo stays the uploaded logo PNG, never font text, never
  recoloured by any tint.

## Steps, in order

### Step 0 — This PR (docs only) — DONE HERE

- What changes: 2 files ADDED, 0 modified, 0 deleted:
  `docs/ui-art/day-night-activation-overlay-spec-20261027.md`
  and this plan file. No `src/` change, no build claimed.
- Must NOT touch: everything else. In particular, do not
  edit #153's spec file, #212's module, or `menuEditor.ts`.
- Gate: file list + diff stat only (see "Gates").

### Step 1 — `src/lib/menuCustom.ts`: the Activation field (foundation)

- What changes: add ONE field to `MenuCustomSettings`:
  `dayNightActivation: boolean`, default `false` (OFF).
  Add it to `DEFAULT_MENU_CUSTOM` beside the existing
  `dayNightMode: 'AUTO'` / `dayNightCustom: 'DAY'` /
  `dayNightTransition: true` / `dayNightTint: 100` defaults.
  `loadMenuCustom()` migration: a stored settings object
  without the field (every existing save) resolves to
  `false` — old players' look is unchanged by construction.
  No new localStorage key: the field lives inside the
  existing `mochiichao_menu_custom_v1` key.
- Must NOT touch: any theme field, any default other than
  the new field, the hour table, the colourways, or the
  blend rule. Do not rename MODE / PERIOD / TRANSITION /
  TINT, and do not change their defaults.
- Delivers: the single source of truth every later step
  reads. Nothing renders differently yet (no caller reads
  the field until step 2).

### Step 2 — `src/lib/dayNightMenuVariants.ts` (#212 module): the gate

- What changes (this is the REQUIRED change to PR #212,
  applied when #212 is rebased after #153 merges — #212
  must NOT merge ungated): add an activation-aware entry
  point, e.g. `getDayNightOverlayVariant(now?)` returning
  `DayNightMenuVariant | null` — `null` when
  `dayNightActivation` is OFF, otherwise the existing
  `dayNightMenuVariantFor(loadMenuCustom(), now)` result
  (which already reuses `resolveDayNightPalette` +
  `scaleTintAlpha`). Keep the existing pure
  `dayNightMenuVariantFor(settings, now)` untouched for
  tests; the gate lives in the wrapper, not in the palette
  resolver, so OFF-mode and palette tests keep passing
  unchanged.
- Must NOT touch: `menuEditor.ts` (not a dependency),
  any theme or skin file, or the resolver's palette maths.
- Delivers: every menu caller has exactly one call to make
  (`null` = render exactly as today) and one branch to test.

### Step 3 — `src/components/game/SettingsScreen.tsx`: the Activation row

- What changes: insert ONE row, first in the day/night
  block, between the block comment (main line 449) and
  `DAY/NIGHT MODE` (main line 450): label
  `DAY/NIGHT ACTIVATION`, value `ON` / `OFF`, Left/Right
  toggles `dayNightActivation`, note text as proposed in
  the spec §1. The row uses the existing `setC` /
  persist-on-save path — no new storage plumbing.
- Must NOT touch: any other row, the Themes block below
  (`SAVE THEME` … `RESET TO LOCKED DEFAULT (v32)`), the
  Settings preview tint div, or (if #260 has merged by
  then) any Menu Editor row — re-check the insertion point
  against the then-current file and report any shift.
- Delivers: the setting Mars ordered, present by default,
  in the default menu. Still no menu changes: the row alone
  renders nothing until a menu caller reads the gate.

### Step 4 — `src/components/game/GameShell.tsx` PauseMenu: first gated overlay

- What changes: adapt PR #212's PauseMenu wiring to the
  gate: `const dn = getDayNightOverlayVariant()`; mount
  the tint div and spread `dayNightMenuVarStyle(dn)` ONLY
  when `dn !== null`. When `null`, the JSX is byte-for-byte
  #212's pre-wiring render (and therefore main's render).
- Must NOT touch: the pause panel's Y2K skin class or
  background, labels, margins, fonts, cursor glyphs, or
  button order. The panel background stays the skin's.
- Delivers: the first visible proof that ON modulates and
  OFF restores exactly.

### Step 5 — `src/components/game/DialogueBox.tsx`: gated frame accent

- What changes: adapt PR #212's DialogueBox wiring to the
  gate: pass `accent={dn.vars['--menu-daynight-accent']}`
  to `StdWindow` ONLY when `dn !== null`; otherwise pass
  no accent override (today's render). No sky gradient
  over the world, ever.
- Must NOT touch: the Batch A message-window panel
  background, labels, margins, fonts, or cursors. The
  dialogue panel background is NOT overridden (PR #212
  already respects this; the gate preserves it).

### Step 6 — Remaining #153 menus, one slice each, in this order

Each slice is its own reviewable change (own commit or own
small PR, never bundled with a layout change), and each
follows the same pattern: read the gate once per render,
apply panel / accent / text / tint only, no sky gradient
where the menu sits over game art.

1. Save-slots: accent on slot frames.
2. Bag: accent on category tabs.
3. Shop: accent on price / buy accents.
4. Battle: panel + accent only; NO sky gradient (battle
   sits over game art); game art underneath never repainted.
5. Settings: NO CHANGE in this step — its preview tint is
   already on main and is explicitly out of the overlay's
   scope (spec §1). If a later step wants Settings to
   preview the overlay, it is a separate, explicitly
   scoped change, not part of step 6.

- Must NOT touch (all slices): skin files, button colour
  identity, labels, layout, fonts, cursors, or any other
  menu's file. A slice that needs a layout change is
  split, not smuggled.

### Step 7 — Preset main-menu (non-locked presets only)

- What changes: in the preset main-menu render path ONLY,
  apply the gated overlay (panel / accent / backdrop sky /
  tint) when Activation is ON AND the active preset is NOT
  the locked default. The guard is explicit:
  `if (isLockedDefault) skip overlay entirely` — the
  resolver is never even called for the locked path.
- Must NOT touch: the locked v32 render path, any #259
  preset video or art, the locked overlay, v32 placements,
  or preset selection state. Preset selection never
  changes Activation; Activation never changes selection.
- Delivers: Mars's "no matter what custom theme" rule for
  the main menu, without touching the locked default.

### Step 8 — Roster/party + PC (now unblocked)

- What changes: per-menu rows for roster/party and PC,
  same gated pattern as step 6 (panel / accent / text /
  tint, no sky gradient over game art where applicable).
- Why now, not later: PR #153 deferred these rows because
  no skin presets existed; main's `menu-skins/` now
  includes `party.y2k-skins.json` and `pc.y2k-skins.json`,
  so the blocker is gone. If those skins change before
  this step lands, re-read them first; do not guess.
- Must NOT touch: anything outside the two menus' render
  paths, and no skin file.

### Step 9 — Menu Editor contract verification (NO `menuEditor.ts` edit)

- What changes: NOTHING in `menuEditor.ts`,
  `MenuEditorScreen.tsx`, or `menuEditorExport.ts`. This
  step is verification only, owned by this lane but
  executed without editing the sibling's files:
  (a) export a theme with Activation ON, re-import it,
  render with Activation OFF, and diff against the same
  theme exported with Activation OFF — theme fields must
  be identical; (b) confirm no overlay value appears in
  any exported theme JSON; (c) confirm loading a theme
  never flips Activation.
- If the Editor lane wants a preview-with-overlay toggle,
  that is the sibling owner's follow-up: it must render
  the overlay over the preview WITHOUT writing into the
  theme being edited, and it must not reuse the Activation
  row as an editor row. This plan does not spec its UI.
- Must NOT touch: any #260 file, even for a "trivial"
  fix found during verification — report it to the sibling
  owner instead.

### Step 10 — Final gates + close-out (all steps)

- Run every gate in "Gates" below against the finished
  overlay (all menus, all four visuals, both Activation
  values). Only then may any wiring PR claim mergeability.
- Update #153's spec doc (a small, separate docs change on
  #153's branch, before it merges) with one line per menu
  row: "applies when DAY/NIGHT ACTIVATION = ON" — so the
  base spec and this addendum can never drift apart.
  That edit is to #153's branch, not to main, and not in
  this PR.

## Gates (each wiring step; G1 is the proof obligation)

- G1 — OFF = unchanged: with Activation OFF, every gated
  menu renders exactly as on main today (no overlay div in
  the DOM, no day/night var consumed). Automated check:
  render each menu with Activation OFF vs the same menu on
  main and diff the DOM subtree excluding the Settings
  preview (which is unchanged by design, not by overlay).
- G2 — ON at four visuals: with Activation ON, render each
  gated menu at MORN, DAY, EVE, NITE (via CUSTOM period)
  and confirm only panel / accent / text / muted / sky /
  tint differ — screenshot or DOM diff, no layout delta.
- G3 — Blend + midnight: AUTO across a last-hour boundary
  (e.g. 09:xx MORN → DAY) blends by minute/60; 23:59 →
  00:00 shows no visual jump (NITE → LATE-as-NITE).
- G4 — Tint 0%: overlay alpha 0 (no visible tint) while
  palette vars still apply; tint 100% = full colourway
  alpha; no logo or button-label recolour at any strength.
- G5 — Theme round-trip: save / export / load a theme with
  Activation ON, then OFF; theme fields identical, no
  overlay value in exported JSON, Activation unchanged by
  loading a theme (step 9).
- G6 — Locked default: locked title + v32 main menu render
  identically with Activation ON, OFF, and at every hour
  (screenshot diff against the v32 snapshot). Logo is the
  PNG, never font text, at every step.
- G7 — House gates (every PR): diff stat read before
  commit; 0 deletions unless the task names them (this
  plan names none); empty D-filter; no force-push, no
  rebase, no amend; mergeable + CLEAN before any
  mergeability claim; DO NOT merge, DO NOT publish to
  Pages, from a docs PR. Code steps additionally run the
  repo's typecheck + build; this docs PR claims neither
  (no `src/` change).

## Counts (this PR)

- Files: 2 ADDED, 0 modified, 0 deleted.
- Lines: counted from the diff stat after the PR is
  created (reported in the delivery note, not guessed
  here); the two files are the only content.
- Wiring steps: 11 (steps 0–10), of which step 0 is this
  PR, steps 1–9 are code/verification, step 10 is gates.
- Menus covered by the overlay when complete: pause,
  dialogue, save-slots, bag, shop, battle, roster/party,
  PC, preset main-menu (9 surfaces) + Settings as
  preview-only (unchanged). Locked title + locked v32
  main menu: never covered, by design.

## What this plan deliberately does NOT include

- No simulated / frozen in-game clock (Batch B NEED, still
  open; AUTO stays device-clock until it lands).
- No night-music hook (audio lane; HGSS uses per-map
  `.nightMusicId` data, not a menu tint).
- No new palettes, art, fonts, or skin edits.
- No `menuEditor.ts` edit, no Editor UI, no preset-art edit.
- No merge of #153, #212, or this PR by this lane's agent.
