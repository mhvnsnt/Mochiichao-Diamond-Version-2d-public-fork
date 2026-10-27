Editor preview blink matched to Pokemon code (editor surface only).

FireRed `src/title_screen.c` `Task_TitleScreen_BlinkPressStart` (line 815):
first interval 60 frames, then 30 on / 30 off — the same timing the game
title already uses (PR #196). The creator preview was the only place
still off (30 on / 15 off).

Change, `src/components/game/StartScreenCreator.tsx` ONLY (+13/-10):
- Preview blink tick: on for 1000ms first, then alternate 500ms off /
  500ms on (60-first / 30 on / 30 off at 60fps), in the preview's own
  setTimeout mechanism. No game title path touched.
- Header comment, preview-slot comment, and CreatorRow label updated.
- Label after the change: value "y 927 · blink 60-first/30/30",
  note "Locked. Blink is 60 frames first on, then 30 frames on / 30
  frames off."

NOT touched: IntroSequence.tsx, StartScreenPlayer.tsx,
titleAnimations.ts, startScreenPreset.ts, any game title path, logo /
font / layout / shadow code, locked v32 default. 0 deletions.
Game title blink was already Pokemon-correct and is unchanged.

Gates (clean worktree at main 5939230a8): build PASS (3m02s).
Lint exit 2 and validate exit 1 are PROVEN pre-existing via stash
comparison on the same tree (pristine lint log identical, 8 errors,
0 in the changed file; pristine validate identical 4 Dorowani/Gabu
sheet-PNG errors) — same precedent as PR #232 / PR #247.
