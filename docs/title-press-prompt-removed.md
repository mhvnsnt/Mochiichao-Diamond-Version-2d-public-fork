# PRESS ANY KEY text removed from main title screens (Mars, 2026-10-27)

**Notice to all lanes/agents: do not re-add PRESS ANY KEY text to a main
title screen.** Mars ordered this removal because the title screens already
say PRESS START, so the blinking middle PRESS ANY KEY prompt is a duplicate.
If a future change reintroduces it, that change is wrong unless Mars himself
says to restore it.

## What was removed (text only — behavior unchanged)

- Locked default title (`src/components/IntroSequence.tsx`, TITLE branch):
  the blinking PRESS ANY KEY prompt at the bottom phi line (y=927) and the
  tiny `▼ PRESS ANY KEY ▼` hint at the bottom of the same screen.
- Preset titles (`src/components/game/TitleStartScreen.tsx`, locked overlay
  copy): the blinking PRESS ANY KEY prompt.
- Preset fallback screen (`src/components/IntroSequence.tsx`, preset
  fallback branch): the blinking PRESS ANY KEY prompt in the fallback's
  locked-overlay copy.

Each removed spot carries an in-code comment with the date and the reason,
so a reader of the file sees the removal without hunting for this doc.

## What was NOT removed, and why

- **Press-to-advance still works.** Any key or click on a title screen still
  advances to the main menu (with the M3 chirp + white fade on presets).
  Only the rendered text was removed, never the handler.
- **PRESS START stays.** Preset title videos already carry PRESS START in
  their frames — that is the prompt Mars wants kept, and no video file was
  touched.
- **TitleScene's own `startPrompt` block was left alone.** Preset titles
  pass `startPrompt={false}`, so it never shows on a main title screen; it
  is only opted into by separate creature-card wrappers
  (`TitleCreatureFigure`, `YogifernoTitleWalk`), which are not main title
  screens.
- **Creator tools and boot were left alone.** `StartScreenPlayer` /
  `StartScreenCreator` and the boot card's "press any key to skip" are not
  main title screens and were not in Mars's order.
- **Logo, subtitle font, studio card, main menu, and all title geometry
  are unchanged.** The prompt slots are simply empty now; nothing moved
  into them.

## Consequence Mars accepted with the order

The locked default title has no video, so after this removal it shows no
visible press cue at all (logo + DIAMOND VERSION + studio only) — pressing
still advances. If that ever reads as broken, that is a question for Mars,
not a reason for an agent to quietly restore the prompt.

## Verification for this change

Build gate (`npx vite build --base=./`) plus a live playtest: locked
default and presets show no middle PRESS ANY KEY, preset videos still show
PRESS START, and pressing still advances to the main menu.
