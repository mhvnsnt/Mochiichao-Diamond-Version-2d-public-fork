# Title start screens: trap fix, round 2 (2026-10-27)

## What round 1 got wrong, stated plainly

PR #270 assumed the trap lived INSIDE `TitleStartScreen` (scale-0
stage, missing press path, unreachable RESET) and fixed all of
those inside that component. Live playtest 2026-10-27 on the
verified #270 build (Settings showed the `RESET TITLE SCREEN`
row, proving the new build was served) showed the trap unchanged:
Snow — Yogiferno still black-screens on BACK TO TITLE, with no
video, no creature, no overlay, 0 interactive elements, and R
dead — and the #270 RESET button invisible. If the component's
own fallback, button, and key listener are ALL absent at once,
the component never mounted or its render/commit failed before
any of its own recovery could run. A fix inside the failing
component cannot recover from the component failing. Round 2
therefore moves recovery OUTSIDE the preset subtree.

## What round 2 proved before changing code

- **Render is clean.** A server render of `TitleStartScreen`
  with the Snow preset (vite SSR build, 2026-10-27) produces the
  painted background `<img>`, the RESET TITLE button, PRESS ANY
  KEY, and DIAMOND VERSION. The failure is NOT a render throw
  in the preset component itself.
- **Registry and storage are consistent.** Settings cycles the
  same ids the registry holds (`title-snow-yogiferno`, …);
  `getSelectedTitleStartScreenId()` returns the stored id and
  `resolveTitleStartScreen()` returns the preset. No id mismatch.
- **Bundle is complete.** The shipped bundle contains the preset
  ids, the storage key, the RESET strings, and all 10 video
  chunks (mp4 + loader chunks) in dist.
- **What is NOT proven:** the exact post-mount mechanism (which
  preset-only effect or runtime step fails in a real browser).
  No browser console capture exists yet — a generic subagent
  cannot drive a live browser, so that capture is owed by the
  parent's browser lane before this PR is merged (see below).
  This PR does NOT claim a proven root cause; it makes the TITLE
  branch failure-proof regardless of which preset-only step fails.

## What round 2 changes (preset TITLE branch only)

1. **`src/components/game/PresetTitleErrorBoundary.tsx` (new)** —
   a class error boundary ABOVE `TitleStartScreen`. Class is
   required: React has no function-component boundary. It passes
   the repo's real build gate (`vite build`); `tsc --noEmit`
   cannot type-check it because the repo ships no `@types/react`
   and already fails tsc on main for unrelated missing modules.
   On any render/commit error in the preset subtree it swaps in
   the fallback instead of a black screen, and logs the error to
   the console so the next live playtest's console capture names
   the real error if one occurs.
2. **`src/components/IntroSequence.tsx` (TITLE branch only)** —
   - The preset pick is hoisted to render time (`titlePreset`)
     so the branch and the recovery effect read the same pick.
   - A parent-level R listener: when phase is TITLE and a preset
     is picked, R clears the stored preset and re-renders the
     locked default. Declared BEFORE the any-key handler so R is
     intercepted first (effects register in declaration order);
     skipped while `titleFading`; never registered on the locked
     default, where R stays an ordinary press key.
   - The boundary's fallback, rendered by this branch: the SAME
     preset's painted background + the locked overlay (logo,
     subtitle, press prompt, studio logo, same coordinates as
     `TitleStartScreen`'s copy) + a RESET TITLE ✕ (R) button +
     a one-line note that the preset failed and R restores the
     locked default. Any key still advances via the existing
     TITLE handler.
3. **`src/components/game/TitleScene.tsx` (one .catch)** — the
   Pixi `app.init()` chain now catches failures (no WebGL,
   missing texture) and logs them instead of leaving an unhandled
   rejection. The canvas stays absent; the DOM layers above it
   still render. Behaviour when Pixi succeeds is unchanged.

## What is deliberately NOT changed

Locked default title, logo art, font rows, subtitle, main menu,
studio card, Settings rows (including the #270 RESET row), and
the preset registry/ids/storage key are all untouched. No Pokemon
art, sound, name, dialogue, or cry. 0 files deleted.

## What SSR could and could not verify (honest limit)

The boundary's passthrough path renders fine, but its fallback
swap could NOT be validated by server rendering: React's
`renderToString` does not support error boundaries at all (a
throwing child propagates out of `renderToString` by design),
so an SSR test of the boundary proves nothing either way. The
boundary only has meaning in client rendering — which is one
more reason the real-browser check below is mandatory, not
optional. No claim is made that the boundary was observed
swapping in a fallback; only that it is the standard React
mechanism for exactly this failure shape, placed above the
failing subtree for the first time.

## Verification owed before merge (parent's browser lane)

This PR must NOT merge on the vite build alone. The parent must
run a real-browser check first: serve this branch's build with
`vite preview`, select Snow in Settings, go to title, and capture
(a) the browser console (any error line names the true mechanism
— if the boundary fires, its `[PresetTitle]` log appears), and
(b) whether the title shows the preset, the fallback, or black,
and whether R restores the locked default. If the console shows a
mechanism this PR does not cover, that line — not a guess —
decides the next fix. After merge + publish, the full 10-preset
live playtest re-runs with the stale-build guard.
