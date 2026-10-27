# Title start screens: trap-fix round 3 — Pixi destroy-before-init race (2026-10-27)

## What was wrong, proven — not guessed

Live playtest on the PR #271 build showed Snow — Yogiferno falling
back ("Preset failed to load") while the other nine presets rendered.
That looked Snow-specific. It is not.

A real-browser reproduction (local Chromium 152 driven over CDP,
PR #271 build, cold browser profile) reproduced the fallback for
Snow AND, on a fresh profile, for Grass — the first preset mounted
in the session, whichever it is. The browser console named the
mechanism in both runs:

```
[PresetTitle] preset title failed, showing fallback:
TypeError: this._cancelResize is not a function
    at d0.destroy (pixi.js Application.destroy)
    at ... (TitleScene effect cleanup, via React commit)
```

Root cause, in `src/components/game/TitleScene.tsx`:
`app.init({ resizeTo: host, ... })` is async. When the preset video
loads, `TitleStartScreen` flips `hideBackground` false → true, which
re-runs TitleScene's effect; React's cleanup called `app.destroy(true)`
unconditionally. In Pixi 8.22.0, `Application.destroy()` runs the
ResizePlugin's static destroy, which calls `this._cancelResize()` —
but that static is only assigned when the plugin is instantiated
during `init()`. Destroying while init is still pending throws.
The first mount in a session loses the race (cold WebGL/renderer
init is slow); later mounts win it (warm init), which is why live
testing showed the FIRST preset falling back and the rest rendering.
Before PR #271's boundary existed, the same throw unmounted the
whole tree — the original black-screen trap.

## The fix (this PR)

`src/components/game/TitleScene.tsx` only, plus one adjacent fix below:
- The effect cleanup never destroys before init resolves. A
  `safeDestroy` (once-only, try/catch) runs from the cleanup only
  when `initDone` is true; if cleanup runs first, the `.then`
  callback destroys once init completes; if init rejects, the
  existing `.catch` logs it and there is no renderer to tear down.
  No behaviour change once init has completed: destroy still runs
  exactly once, on cleanup or on the cancelled-init path.

Adjacent fix, same "one uncaught render throw blanks the app"
class, also proven by a real-browser capture in this round:
`src/components/IntroSequence.tsx` — the window keydown/mousedown
advance handler's effect deps omitted `introScene`, so the handler
closed over a stale scene index; keyboard stepping through the
intro could push `introScene` past the last scene, and
`scenes[introScene].title` threw during render with no boundary
above IntroSequence (the live playtest's "black screen after rapid
Enter through the intro" note is this bug). Fixed by adding
`introScene` to the effect deps, plus a one-line clamp on the scene
lookup so no stale state can ever index past the list again.
No visual, logo, font, subtitle, menu, or studio-card change.

## What is NOT claimed

- Snow's video file was already ruled out (serves live, 200,
  1,919,587 bytes, loader chunk 200). Nothing about Snow's art,
  video, or biome data changed here, because none of it was broken.
- The boundary + parent R recovery from PR #271 stay in place
  unchanged: if any future preset subtree throws, the game still
  degrades to the fallback instead of a black screen.

## Verification (this PR, before merge — parent verifies/merges)

- `npx vite build --base=./` gate (repo's real build gate).
- Real-browser CDP reproduction, cold profile, both presets that
  tripped before (Snow, Grass): each must RENDER (video + creature
  + overlay), with zero `[PresetTitle]` fallback logs and zero
  `_cancelResize` errors, and keyboard intro stepping must reach
  TITLE without throwing. Results are recorded in the PR body.
- After merge + publish, the full 10-preset live playtest re-runs
  with the stale-build guard. Presets are NOT proven live until
  that playtest reports.
