## Title cry gate: activation + per-creature variant rotation

Mars ordered 2026-10-26 ~18:21 CDT (confirmed "Yeah, get that done"): the
title is SUPPOSED to play cries like the Pokemon files do — at
Pokemon's point, press -> cry -> 90-frame wait -> white fade — for
each title-pool creature that gets a title card, swapping between
that creature's OWN multiple calls.

### What changes (3 files, code only, 0 deletions, no audio touched)

- `src/lib/titleCryGate.ts` — per-creature variant lists + rotation.
  Every title-10 creature's list is exactly its OWN two shipped,
  confirmed calls: V1 (PR #193) first, R1 (PR #209) second. Both
  files per creature were verified present on main (HTTP 200, 20/20)
  before this shipped. Rotation rule, deterministic, in code
  comments: each creature has its own in-memory index; each
  title-press play advances THAT creature's index only
  (v1 -> r1 -> v1 ...). Never a cross-creature pick, never a global
  random pick. Unknown creatures still fail closed (null / false).
  `titleCryUrl` still returns the first variant (V1) for
  TitleScene's guard. TO ADD A FUTURE CALL: append its
  `/audio/cries/<name>-cry-*.wav` path to that creature's array in
  `TITLE_CRY_VARIANTS`; rotation includes it automatically.
  Honesty, stated in code: Pokemon's decomp gives ONE cry per
  species (gCryTable / PlayCry_Normal); the multi-call rotation is
  Mochiichao's extension on Pokemon's structure, timing and press
  point, NOT a Pokemon behaviour. This supersedes the 2026-10-26
  ~16:35 CDT V1-only playback decision for PLAYBACK ONLY — V1 stays
  in every list, R1 joins it, no file is removed.
- `src/components/game/TitleCreatureFigure.tsx` — title-card
  activation: the wrapper now passes `startPrompt` to TitleScene,
  so a press on a creature's card plays that creature's own next
  cry variant, waits 90 frames, then drives the white fade.
- `src/components/game/YogifernoTitleWalk.tsx` — same activation
  for Yogiferno's card (walk + snow variants).

### Caller map, verified on current main (why these two, and only these two)

- TitleCreatureFigure / YogifernoTitleWalk ARE the title-card
  renders: each renders TitleScene with `figureName` = its creature
  on that creature's primary card (`primaryCardForCreature`). With
  `startPrompt`, TitleScene renders its own PRESS ANY KEY prompt and
  the gate listener is active in those renders only.
- Default DOM title (IntroSequence TITLE phase) deliberately NOT
  activated: it renders NO figure by locked phi design (PR #137),
  so there is no creature whose own calls could play, and its
  press already plays the settled M3 press-start chirp. Playing any
  cry there would violate the per-creature rule.
- StartScreenPlayer deliberately NOT activated: it is a Menu Creator
  preset player, not the game title path, owns no phase advance,
  and its creature art is still Yogiferno-only with GAP boxes for
  the other 9. Adding cry playback to a creator preview would be
  scope creep and preview hijack.
- Raw TitleScene renders (no `startPrompt`) stay prompt-less and
  listener-less: the gate is opt-in only, never unconditional, so
  no showcase or preview gains a key/click hijack.
- Battle / lab call sites are NOT in this task; they keep using
  nothing new here.

### Preserved (0 changes)

TitleScene itself (Kittember cycle wiring `figureCycleUrls`,
bg-zoom `bgBaseScale`, blink tempo, shadow, logo/subtitle/font/
layout lines), IntroSequence press wiring + M3 chirp, title music
loop, and every audio file. The 24 "deletions" in the diff stat are
replaced lines inside the 3 modified files, named here; no file was
deleted.

### Gates, stated honestly (not greenwashed)

- Rotation logic tested on the real module (tsx): 10/10 creatures
  alternate v1 -> r1 -> v1 -> r1; interleaved presses do not disturb
  per-creature order; unknown creatures fail closed. PASS.
- Build (`vite build`): PASS, 2m25s.
- Lint (`tsc --noEmit`): 3 errors, ALL pre-existing in
  `src/components/views/GardenView.tsx` (another lane, untouched by
  this change, does not import any of these 3 files); 0 errors in
  the 3 changed files. NOT claimed green.
- Validate (`validate:reference`): exit 1 with 4 pre-existing
  Dorowani/Gabu sheet-PNG errors, proven identical on pristine main
  via a stash comparison (same 4 errors with this change reverted).
  NOT claimed green.
- No audio file added, modified, or deleted. Not live until a Pages
  rebuild.
