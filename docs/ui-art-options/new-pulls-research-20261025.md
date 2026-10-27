# New pulls research — 2026-10-25 (FILE-ONLY, no repo edits, no PR)

Research batch for the wiring coordinator. This file does NOT edit the
tracker (`wiring-tracker-100pct.md`) and does NOT touch
`~/workspace/mochiichao-work/fresh-start` or any repo. The coordinator
updates the tracker from this file.

Scope guard, checked against the tracker before writing:
- NOT duplicated here (already running / already claimed elsewhere):
  Title Music lane, Title Backgrounds lane, Title Creatures 9-of-10 lane,
  World Builder audio / trainer / regions batches, and the 10 PR wiring
  batches (title animation, Settings, Pause skin, HUD/borders/cursor,
  themes/day-night, fonts, Intro Creator, Start Creator, field/weather,
  open-source packs).
- NOT re-counted here (already claimed by the World Builder lane's
  unpulled-improvements pull list, 2026-10-25): inkjs, easystarjs, PixiJS
  v8 itself, Zustand+IndexedDB, Vitest/Playwright/axe-core, Tone.js
  sequencer + PR #36 title-music registerFile, Tiled JSON validator, WFC
  (already in tools/). Tone.js is therefore NOT counted as a new pull
  below, even though it was researched in this batch's first pass.
- NOT re-counted here (already in the tracker): Kenney CC0 packs, 0x72
  DungeonTileset II CC0, game-icons CC BY 3.0, OpenGameArt CC0/CC BY
  checked-at-download, Free Pixel Loops CC0, Blender concepts (GPL
  install note only), FFmpeg Phase 2 export only, MediaRecorder Phase 1,
  Google Y2K fonts (OFL).
- NOT in this file at all: no Pokemon sprites, dialogue, music, cries,
  or art; no commercial/paid packs shipped; no leaked files; no ROMs.

## Counted list summary (percentage rule)

Total pulls examined in this batch: 24.
- Verified licence (or verified no-licence-needed technique), recommended
  for a later PR batch subject to its stated wiring gate: 19/24 = 79%.
- UNVERIFIED — do NOT ship until the stated check passes: 2/24 = 8%.
- NOT RECOMMENDED, with reasons: 3/24 = 13%.
- 79% + 8% + 13% = 100% (19 + 2 + 3 = 24).
- Wired from this batch so far: 0/24 = 0% — this batch is research only,
  by order. Nothing below is claimed as wired, in-game, or merged.

Licence method: each "verified" entry below was checked in a public
search result returned 2026-10-25 (npm/cdnjs/PyPI/project docs), not
guessed. Where two sources disagreed (OpenCV), the disagreement is
stated and the wiring gate is to read the pinned version's LICENSE file.
"MIT" below means the source said MIT; it is not a legal opinion.

---

## A. VERIFIED — 19/24 = 79%

### A1. @pixi/particle-emitter (PixiJS particle emitter, formerly pixi-particles)
- Licence: MIT — verified (package docs: "License: MIT", supports
  PixiJS up to v8.0.0, v5.0.8).
- What it gives: declarative particle emitters with object pooling and
  a modular behaviour system (spawn, velocity, scale, rotation, colour,
  alpha over life) — fire, smoke, rain, sparks, bubbles, explosions,
  battle hit bursts, title-screen embers/leaves. Thousands of particles
  without hand-rolling a pool.
- What it does NOT give: no art (textures still have to be Mochiichao
  originals), no sound, no battle logic, no pre-made Mochiichao presets.
- Wiring step (later PR): add `@pixi/particle-emitter` as a dependency,
  add `src/lib/fx/particles.ts` with one emitter factory + JSON presets
  (hit-spark, dust, rain, ember), wire ONE preset to a battle hit first,
  behind the existing animation-speed / reduced-motion settings, then
  add the rest as presets only.

### A2. pixi-viewport (PixiJS 2D camera)
- Licence: MIT — verified (multiple package listings: "MIT License",
  (c) YOPEY YOPEY LLC / David Figatner).
- What it gives: follow, drag, pinch, wheel-zoom, decelerate, clamp and
  clamp-zoom, mouse-edge scrolling — a real camera instead of moving
  every sprite by hand. Directly serves the overworld / Creature Mode
  camera and the title-scene camera curve work already queued.
- What it does NOT give: no map data, no collision, no pathfinding
  (that is the separate easystarjs claim — do not re-add it here), no
  cutscene timeline (see A11).
- Wiring step (later PR): add `pixi-viewport`, wrap the world container
  in a Viewport with world/screen sizes from the map, enable
  follow(player) + clamp to map bounds only, gate drag/pinch behind a
  Settings flag so keyboard play is unchanged.

### A3. pixi-filters (@pixi/filter-* family, pixi-filters)
- Licence: MIT — verified (cdnjs / project docs: "MIT licensed";
  filters listed include Bloom, Pixelate, RGBSplit, Shockwave, Dot,
  CrossHatch, TiltShift, Twist, Godray).
- What it gives: GPU shader filters for Pixi scenes — bloom/glow on
  title logo, shockwave ring on a big hit, pixelate/CRT-flavoured
  transitions, RGB-split on damage, godrays on bright biomes. This is
  the shader side of game-feel, separate from particles.
- What it does NOT give: no new art, no audio, no gameplay; stacked
  filters cost FPS, so it is not a "turn everything on" pack.
- Wiring step (later PR): install only the filters actually used
  (start: Bloom + Shockwave), add `src/lib/fx/filters.ts` with a
  per-scene filter budget (max 1–2 active), default OFF on low-power,
  and a Settings toggle. Measure FPS before adding a third filter.

### A4. pixi-ease (PixiJS easing / tweening for Pixi objects)
- Licence: MIT — verified ("MIT License (c) 2019 YOPEY YOPEY LLC by
  David Figatner"); same author family as pixi-viewport.
- What it gives: `ease.add(sprite, {x, y, alpha, scale, tintBlend},
  {duration, ease, reverse})` with named easings (easeInOutSine,
  easeOutQuad, easeInBack, …) and per-tick events — the Pixi-native
  way to do logo slides, menu rise+fade, sprite squash/stretch and
  tint flashes without touching the DOM.
- What it does NOT give: no DOM/CSS animation, no timeline sequencing
  across many objects (see A8/A9/A11), no keyframe editor.
- Wiring step (later PR): GATE FIRST — confirm the pinned pixi-ease
  version's PixiJS v8 peer compatibility in its package.json before
  installing; if it lags v8, use A8/A10 for Pixi-object tweens instead
  and keep pixi-ease out. If compatible, wire it to ONE existing
  animation (title logo slide) and compare against the current
  hand-rolled version before converting others.

### A5. @pixi/sound (PixiJS sound plugin)
- Licence: MIT — verified (PixiJS Sound docs: "License: MIT License";
  compatibility table: PixiJS v8.x → PixiJS Sound v6.x).
- What it gives: Pixi-native sound registry (`sound.add` / `sound.play`),
  sprites (multiple SFX in one file), filters/effects hooks, and a
  single place to route game audio inside the Pixi app — complementary
  to, not a duplicate of, the World Builder Tone.js sequencer claim
  (Tone.js = synthesis/sequencing; this = playback/routing inside Pixi).
- What it does NOT give: no music composition, no synthesis, no
  original audio files — the SOUND setting's audio routing gap is
  closed by wiring, not by this library alone.
- Wiring step (later PR): install the v6.x line for PixiJS v8, add
  `src/lib/audio/soundBus.ts` registering the existing PR #36 title
  files + UI clicks only, wire the Settings SOUND flag and music/SFX
  volume rows to its master buses, and leave Tone.js sequencing to its
  own lane — do not build two competing audio systems.

### A6. Howler.js (Web Audio playback, HTML5 Audio fallback)
- Licence: MIT — verified (header: "(c) 2013-2021 James Simpson and
  GoldFire Studios, Inc. Released under the MIT License"; ~7 kB gzipped,
  zero dependencies).
- What it gives: the most battle-tested small Web Audio player —
  sprites, fade, rate, seek, volume per-sound and globally, 3D/stereo
  panning, auto-unlock on first touch (iOS), codec fallback lists
  (webm → mp3). The safe choice if @pixi/sound (A5) proves awkward in
  the React shell, since Howler lives outside Pixi.
- What it does NOT give: no synthesis, no sequencing, no music files,
  no Pixi integration out of the box.
- Wiring step (later PR): pick EITHER A5 or A6 as the single playback
  layer — do not ship both. If Howler wins, add `src/lib/audio/howlerBus.ts`
  with music / SFX / UI buses, the same Settings volume rows, and a
  fade helper (1000 ms fade, matching the title-music spec's fade
  convention), then register the PR #36 title files through it.

### A7. ZzFX (tiny procedural sound-effect synth)
- Licence: MIT — verified (cdnjs listing: "MIT licensed"; "A Tiny JS
  Sound FX System").
- What it gives: code-defined SFX (pickup blip, hit thud, UI click,
  jump, coin) from a short parameter array — no audio files to ship,
  no recording, tiny bundle. Ideal for placeholder-to-final UI/battle
  blips that are 100% original because they are synthesised, not sampled.
- What it does NOT give: no music, no voices, no realistic instruments,
  no long ambient loops; parameters are fiddly and need a preset table.
- Wiring step (later PR): add a `src/lib/audio/zzfxPresets.ts` table
  (ui-move, ui-confirm, hit-weak, hit-strong, pickup, heal) tuned by ear
  in one sitting, route it through the A5/A6 SFX bus, and keep every
  preset under version control as data — never as binary audio files.

### A8. Anime.js (v4) (DOM + JS-object animation)
- Licence: MIT — verified (multiple sources: "MIT (fully open source)";
  v4 adds modular imports, springs, draggable, timeline, SVG helpers).
- What it gives: the cleanest general tween/timeline API for the
  React/DOM side of the game — menus, HUD, dialogue box, creator
  screens, title HTML overlays — animating CSS, SVG, DOM attributes
  and plain JS objects with stagger, springs and timelines.
- What it does NOT give: no Pixi scene-graph integration (use A4/A10
  inside Pixi), no visual timeline editor (see A11), no physics engine.
- Wiring step (later PR): install `animejs` v4, add
  `src/lib/ui/animate.ts` wrapping `animate`/`timeline`/`stagger` with
  the game's reduced-motion check in one place, then convert ONE menu
  transition (Pause open/close) to it before converting others.

### A9. Motion (formerly Motion One / Framer Motion, `motion` package)
- Licence: MIT — verified (project README: "Motion is MIT licensed";
  core library MIT). PAID EXTRAS EXCLUDED: Motion+ examples/tutorials,
  Motion Studio editor, and premium APIs are a separate paid licence
  and are NOT part of this pull — see §C.
- What it gives: hardware-accelerated animation on the Web Animations
  API, springs (stiffness/damping — the physical feel DOM tweens lack),
  gestures (hover/tap/drag/pan), layout animations, and a 2.6 kB mini
  build for basic work. Strongest where Anime.js is weakest: springs
  and React component motion.
- What it does NOT give: no Pixi integration, no multi-element timeline
  choreography as rich as a dedicated timeline tool, no editor.
- Wiring step (later PR): pick EITHER A8 or A9 as the single DOM
  animation layer — do not ship both. If Motion wins, use
  `motion/mini` for menus/HUD and full `motion` only where a spring
  is actually needed (creature bounce, button press), with the same
  reduced-motion gate as A8.

### A10. tween.js (`tweenjs/tween.js` lineage; CreateJS TweenJS is also MIT)
- Licence: MIT — verified (comparison table: "Tween.js — MIT";
  CreateJS TweenJS docs: "released for free under the MIT license").
- What it gives: the smallest possible tween engine — one `Tween`
  object, Robert Penner easings, chaining, `TWEEN.update(time)` in the
  existing ticker. Useful as the zero-dependency fallback if A4/A8/A9
  are all rejected, or as the interpolation core inside a custom
  timeline (A11's JSON can drive tween.js objects).
- What it does NOT give: no timeline UI, no springs, no DOM mapping,
  no Pixi-specific helpers — deliberately minimal.
- Wiring step (later PR): only if the A4/A8/A9 decision lands on
  "hand-rolled + tiny lib": add `tween.js`, drive it from the Pixi
  ticker, and store every tween's target/duration/easing in the same
  JSON preset format as the Creator screens so tweens are data, not
  scattered code.

### A11. @theatre/core (Theatre.js runtime — timeline/keyframe interpolation)
- Licence: Apache-2.0 for `@theatre/core` — verified (project README:
  "Theatre's core (@theatre/core) is released under the Apache License.
  Same goes for most packages"). THE STUDIO EDITOR IS AGPL-3.0 AND IS
  NOT PART OF THIS PULL — see §C.
- What it gives: a real timeline/keyframe system — projects → sheets →
  objects → sequences, any JS value animatable, sequences playable,
  seekable and scrubbable — which is exactly what the Intro Video /
  Start Screen Creator specs need for playback: a JSON sequence that
  plays camera + particles + fades in order, instead of chained
  setTimeouts. The runtime bundle ships only `@theatre/core`, so only
  Apache-2.0 applies to the shipped game.
- What it does NOT give: no Pixi renderer, no art, no audio, no editor
  in the shipped bundle (the AGPL studio is a dev-time tool only and
  must not be bundled — if Mars wants the visual editor, that is a
  separate decision, not this pull).
- Wiring step (later PR): install `@theatre/core` ONLY (never
  `@theatre/studio` in the game dependency list), add
  `src/lib/creator/theatrePlayback.ts` mapping one Creator preset JSON
  (camera x/y/zoom + fade + one particle emitter) to a Theatre sheet,
  play it on the Intro Creator preview screen, and keep the preset
  format exportable as JSON so a later editor can read it.

### A12. bezier-easing (cubic-bezier easing micro-library)
- Licence: MIT — verified (package docs: "License: MIT License";
  same curve math as CSS `transition-timing-function`).
- What it gives: one function, `BezierEasing(x1, y1, x2, y2)`, returning
  a precise, fast eased value — the shared easing vocabulary between
  CSS, Pixi tweens and Theatre sequences, so a curve designed in the
  Creator screens plays identically everywhere. Also the raw material
  for the golden-ratio / phi placement work: a curve is data, not taste.
- What it does NOT give: no tween engine, no timeline, no animation
  loop — it is a function, not a system.
- Wiring step (later PR): add `bezier-easing`, add
  `src/lib/fx/easings.ts` exporting the named CSS curves
  (ease, ease-in, ease-out, ease-in-out) plus the game's phi-derived
  curve as named presets, and make A4/A8/A10/A11 all read easings from
  that one file.

### A13. lottie-web (Lottie vector-animation player, Bodymovin lineage)
- Licence: MIT — verified (LICENSE text: "The MIT License (MIT)
  Copyright (c) 2015 Bodymovin"; player only).
- What it gives: playback of JSON vector timelines (logo flourishes,
  UI celebrations, title-screen vector flourishes) that scale cleanly
  at any size and can be paused/seeked — a good fit for DOM overlay
  flourishes the Pixi scene should not own.
- What it does NOT give: no animation files (each `.json`/`.lottie`
  file carries its own licence — marketplace files are NOT MIT just
  because the player is), no Pixi rendering, no After Effects (the
  Bodymovin exporter is a separate tool, not shipped).
- Wiring step (later PR): install `lottie-web` (light build if
  available), add ONE original JSON flourish (drawn for Mochiichao,
  not downloaded from a marketplace) to the title screen behind the
  reduced-motion gate, and record the file's own licence in the
  attribution file alongside it.

### A14. rembg (local background removal, Python tool — NOT shipped in the game)
- Licence: MIT — verified (PyPI: "Copyright (c) 2020-present Daniel
  Gatis. Licensed under the MIT License"; runs locally, nothing
  uploaded). MODEL CAVEAT: the tool is MIT, individual models are not
  all MIT — see §B for RMBG-2.0.
- What it gives: a local CLI (`rembg i` / `rembg p`) wrapping
  segmentation models (U-2-Net, ISNet, BiRefNet) for clean cutouts —
  the tool side of the Title Creatures 9-of-10 lane's cleanup work,
  usable offline after the first model download, with no original art
  leaving the machine. Complements (does not replace) the sprite lane's
  scripted white-fringe pass and spot_check.py v2: rembg for the first
  cut, the scripted pass for fringe/alpha feathering.
- What it does NOT give: no perfect edges (fringe, hair/fur, and
  translucent parts still need the scripted pass + eye check), no
  game code, no shipped asset — this is a build-time tool, never a
  runtime dependency.
- Wiring step (later PR — tooling only, not game code): add a
  `tools/cutout-rembg.sh` wrapper pinning the model to
  `birefnet-general` or `u2net` (see §B), with the existing
  white-fringe decontamination + 1px alpha feather as a mandatory
  second step and an eye-check gate before any cutout is shown to Mars
  or PR'd. Never commit downloaded model weights to the repo.
  NOTE (Mars, 2026-10-25 ~20:12 CDT, shadows-separate rule): baked soft
  shadows are NOT part of character art — the engine adds shadows as
  a separate layer. The cutout pipeline must therefore treat a soft
  shadow between feet/limbs as background to remove, not as character
  pixels to preserve, and must not repeat the old "cutting contact
  shadows would float every character" rationale. Verify the
  shadow-as-separate-layer structure from the actual decomp files at
  wiring time; this note does not change any count in this file.

### A15. PyMatting (closed-form alpha matting, Python)
- Licence: MIT — verified (PyPI: "This project is licensed under the
  MIT License"; JOSS paper Germer et al. 2020).
- What it gives: proper alpha-matte refinement from a trimap —
  `cutout(input, trimap, output)` — the mathematically correct fix for
  the white-fringe / halo problem the sprite lane has been fighting
  with scripted passes: soft edges, fur/feather boundaries, and
  semi-transparent parts get a real matte instead of a hard threshold.
- What it does NOT give: no segmentation (it needs a trimap — rembg's
  output is the input), no GPU alpha estimation, no game code.
- Wiring step (later PR — tooling only): add PyMatting as the
  optional third step in the A14 cutout pipeline (rembg → trimap from
  eroded/dilated mask → PyMatting matte → feather), used only where
  the scripted pass visibly fails, with before/after proof strips kept
  alongside the cleaned files.

### A16. OpenCV (image processing, Python `opencv-python` / C++)
- Licence: PERMISSIVE, VERSION-DEPENDENT — verified with a conflict
  to resolve at wiring time: PyPI says "OpenCV itself is available
  under 3-clause BSD License", while a 2026 secondary source says
  "OpenCV has used the Apache 2.0 license since version 4.5 (older
  versions used BSD 3-clause)". Both are permissive and compatible
  with this project; the discrepancy is which text applies to the
  pinned version, not whether it is shippable.
- What it gives: the standard image-processing toolbox for the
  sprite pipeline — thresholding, morphology, flood fill, contour
  finding, inpainting, colour-space work, batch resize/convert —
  replacing one-off Pillow scripts with tested operations, all local.
- What it does NOT give: no segmentation model (that is A14), no
  matting solver (that is A15), no game code; the full wheel also
  pulls FFmpeg (LGPLv2.1) and, on some platforms, Qt (LGPL) — use the
  headless wheel for tooling to avoid GUI dependencies.
- Wiring step (later PR — tooling only): GATE FIRST — pin one
  `opencv-python-headless` version, read that version's LICENSE file,
  and record which licence (BSD-3 or Apache-2.0) applies in the
  tooling README; then add ONE OpenCV step to the cutout pipeline
  (e.g. morphological cleanup of the rembg mask) behind the existing
  eye-check gate.

### A17. tsParticles (canvas particle system, DOM overlay only)
- Licence: MIT — verified (npm registry records for tsParticles
  packages: `"license":"MIT"`).
- What it gives: a JSON-configured canvas particle layer (presets,
  emitters, absorbers, shapes) for DOM/title-overlay ambience — snow,
  petals, stars drifting over a menu — without touching the Pixi scene.
- What it does NOT give: no Pixi integration (do NOT use it inside
  the Pixi game scene — that is A1's job), no battle logic, no art.
- Wiring step (later PR): ONLY if a DOM overlay particle layer is
  wanted: install `tsparticles`, add one JSON preset to the title
  overlay behind reduced-motion, and keep it out of battle/overworld
  scenes entirely. If A1 covers all particle needs, skip A17 — it is
  the alternative, not an addition.

### A18. Game-feel / juice research pattern (no code, no licence needed)
- Licence: N/A — research, not software. Sources are public talks and
  writing: Jonasson & Purho, "Juice It or Lose It" (2012); Nijman,
  "The Art of Screenshake"; Swink, Game Feel; Disney's 12 principles
  of animation as background. No code is copied; only numbers and
  structure are adopted, and they are starting points to playtest,
  not lab-validated constants.
- What it gives: the checklist the battle/overworld juice work has
  been missing — per action, ask: screen shake? hitstop? target flash?
  particles? camera reaction? sound? with concrete starting numbers:
  hitstop 2 frames / 0–120 ms lab range (freeze everything, timer
  ignores time-scale), shake 0.1–0.3 s max, decaying, proportional to
  impact, directional bias, Perlin/sine not raw random; squash &
  stretch on a damped spring (overshoot sells it); rising-pitch combo
  sounds; floating damage/reward labels that drift up and fade.
  Plus the two guardrails the sources agree on: scale juice to event
  importance, and always ship intensity toggles (shake/flash off) for
  motion sickness and photosensitivity.
- What it does NOT give: no code, no library, no tuned constants for
  Mochiichao — every number above must be playtested against the
  actual battle view (cf. the v5.2 playtest bugs: wild damage, bag
  keys, black screens — juice must not be layered over broken math).
- Wiring step (later PR): add `src/lib/fx/juice.ts` implementing ONLY
  the checklist as data — `juiceFor(event)` returning
  {shakeMs, hitstopMs, flash, particles, sound} per event type, all
  gated by the existing reduced-motion / camera-shake Settings rows —
  wire it to ONE battle event (a landed hit: flash + spark + 60 ms
  hitstop + small shake), playtest it, and only then extend the table.

### A19. Native Web Audio bus routing pattern (browser API, no licence needed)
- Licence: N/A — the Web Audio API is a W3C browser API, not a
  library; no dependency, no licence text to ship.
- What it gives: the architecture the Settings SOUND gap actually
  needs, regardless of whether A5 or A6 wins playback: one
  AudioContext, three buses (music / SFX / UI) each with its own
  GainNode, a master gain, a ducking rule (music −6 dB while a
  dialogue voice/UI sting plays, restore on a 1000 ms fade), an
  unlock-on-first-gesture rule, and an auto-suspend-when-hidden rule.
  This is the pattern Howler/Tone.js both sit on top of — adopting
  the pattern first means swapping A5↔A6 later costs one file, not a
  rewrite.
- What it does NOT give: no sounds, no music, no synthesis, no
  fallback for browsers without Web Audio (that fallback is A6's job).
- Wiring step (later PR): add `docs/audio-routing.md` (one page: bus
  diagram, gain staging, ducking/fade rules, unlock/suspend rules) and
  implement it in whichever of A5/A6 is chosen, with the Settings
  music-volume / SFX-volume / SOUND rows as the only public controls.

---

## B. UNVERIFIED — 2/24 = 8% — DO NOT SHIP until checked

### B1. wyzowl/sfx-kit — 320 "original" SFX, claimed CC0
- Licence claimed: CC0-1.0 (repo listing shows "Creative Commons
  Zero v1.0 Universal (CC0-1.0)", "Free for any use, commercial or
  not: CC0, no credit required").
- Why UNVERIFIED, not verified: single-commit repository, 0 stars,
  created 2026-10-19, no provenance for "original" — a CC0 label on a
  brand-new repo is not proof the sounds are original. The claim was
  seen in a search listing, not in a listened-to, provenance-checked
  release.
- What it would give if verified: 320 catalogued SFX with metadata
  (use / do-not-use, length, sync point, level) — a strong UI/battle
  SFX starter set without synthesis tuning.
- Gate before any use: listen to a sample across categories, check
  for recognisable sampled/commercial sounds, confirm the author and
  recording chain, and only then record the verification in this file.
  Until then, use A7 (synthesised, provably original) for SFX.

### B2. RMBG-2.0 model weights (for use with rembg, A14)
- Licence claimed (secondary source only): non-commercial only —
  "its open weights are non-commercial only", vs BiRefNet-general
  "both code and weights are MIT-licensed for commercial use" in the
  same secondary comparison. No primary licence page for RMBG-2.0 was
  verified in this batch.
- Why UNVERIFIED: the tool (rembg, A14) is MIT, but model weights
  carry their own terms, and a blog comparison is not a licence.
  Shipping RMBG-2.0 weights (or outputs whose licence depends on them)
  on a non-commercial-only term would be a silent licence violation.
- Gate before any use: read the RMBG-2.0 model's own licence page /
  model card, record the exact term here, and if it is
  non-commercial, keep it out of the pipeline entirely. Until then,
  the A14 pipeline pins `birefnet-general` or `u2net` only.

---

## C. NOT RECOMMENDED — 3/24 = 13%, with reasons

### C1. GSAP (GreenSock) — free, but NOT open source
- Licence verified as non-OSI: "Standard no-charge license" (Webflow
  acquisition, all plugins free since 2025-04-30); multiple sources
  agree it is "free to use but not open-source", "closed source and
  owned and funded by Webflow", with a competing-tool restriction
  (no building a visual-animation tool competing with Webflow) and a
  termination-at-Webflow's-discretion clause reported in the Motion
  comparison. It is a good timeline engine — that is not the problem.
- Why not recommended: Mochiichao's chain is MIT/Apache/CC0-first by
  Mars's standing direction, and GSAP would be the one
  revocable, single-vendor, non-forkable link in it. A8 (Anime.js,
  MIT) and A9 (Motion, MIT) cover the same timeline/spring ground
  without that risk. Revisit only if a GSAP-only plugin (e.g. a
  specific morph/draw tool) becomes a hard requirement — and then as
  a named Mars decision, not a quiet dependency.

### C2. @theatre/studio (Theatre.js visual editor) — AGPL-3.0 in the bundle risk
- Licence verified: AGPL-3.0 for the studio (project README: "The
  studio (@theatre/studio) is released under the AGPL 3.0 License.
  You only use the studio during design/development. Your project's
  final bundle only includes @theatre/core, so only the Apache
  License applies."). The core (A11) is the recommendation; the
  studio is not.
- Why not recommended (as a shipped dependency): AGPL-3.0's
  network-use clause is the wrong risk profile for a game that will
  be served on the web, and the studio is not needed to play Theatre
  sequences — JSON sequences (A11) play without it. If Mars wants a
  visual timeline editor later, that is a separate, explicitly-gated
  decision (dev-time-only install, never in the game bundle, with the
  AGPL consequence written down first), not part of any wiring PR.

### C3. Hosted background-removal APIs (remove.bg and lookalikes) — upload + paywall
- Licence/cost: hosted services, per-call pricing, free tiers
  watermarked or preview-resolution only (reported in the same
  comparison that verified A14). No licence was needed to reject this:
  the problem is operational, not legal.
- Why not recommended: original Mochiichao art would leave the
  machine to a third-party server, results would depend on a paid
  tier, and the sprite lane already has a local pipeline (A14 + A15 +
  scripted pass + spot_check.py v2) that keeps art private and
  reproducible. Local-first is also the standing direction for Mars's
  own-cart dumps (private/local, never in the public repo) — the same
  instinct applies to original art.

---

## D. Recommended wiring order (for the coordinator, not a PR)

Top 5 to wire next, in order — licences in brackets:

1. **@pixi/particle-emitter [MIT]** — A1. Battle hit bursts, dust,
   title embers. Highest juice-per-line in the game; one preset proves
   the whole system.
2. **pixi-viewport [MIT]** — A2. The overworld/Creature Mode camera
   stops being hand-rolled; follow + clamp is one PR and unblocks
   every later camera curve.
3. **Howler.js [MIT] OR @pixi/sound [MIT] — pick one, not both** — A6/A5.
   Closes the Settings SOUND routing gap (A19's bus pattern) and
   finally registers the PR #36 title files through a real bus
   instead of a flag. Decision needed at PR time: Howler if the React
   shell owns audio, @pixi/sound if Pixi owns it.
4. **Anime.js [MIT] OR Motion [MIT] — pick one, not both** — A8/A9.
   One DOM animation layer for menus/HUD/creator screens, with the
   reduced-motion gate in one wrapper file. Decision needed at PR
   time: Anime.js for timelines, Motion for springs/React motion.
5. **rembg [MIT] + PyMatting [MIT] as a tooling pipeline** — A14/A15.
   Not game code, but it unblocks the Title Creatures lane's cutout
   quality (fringe/matte) without uploading original art anywhere.
   Model pin: `birefnet-general` or `u2net` only until B2 clears.

Next after the top 5, in order: pixi-filters [MIT] (A3, one filter at
a time, FPS-gated) → Theatre core [Apache-2.0] (A11, Creator playback)
→ bezier-easing [MIT] (A12, shared curve vocabulary) → ZzFX [MIT]
(A7, original SFX presets) → game-feel juice table (A18, data first,
one battle event) → OpenCV headless [BSD-3/Apache-2.0, pin-gated]
(A16) → pixi-ease [MIT, v8-gate] (A4) → tween.js [MIT] (A10, only if
the bigger tween layers are rejected) → lottie-web [MIT] (A13, one
original flourish) → tsParticles [MIT] (A17, only if a DOM overlay
particle layer is wanted; otherwise skip).

Explicitly NOT in the wiring order: B1, B2 (until their gates pass),
C1, C2, C3 (do not wire).

## E. What this batch did not do (for the coordinator's audit)

- 0 files edited in the repo, 0 PRs opened, 0 tracker edits.
  Tracker file untouched by design; coordinator updates it.
- 0 Pokemon sprites / dialogue / music / cries / art pulled, copied,
  or referenced as source material.
- 0 commercial/paid packs recommended for shipping. Motion+ and
  Theatre Studio paid/AGPL extras are named only to exclude them.
- 0 downloads, 0 installs, 0 model weights fetched in this batch.
  Every install step above is for a later, gate-checked PR batch.
- Counts behind every % in this file: 19 verified + 2 unverified +
  3 not recommended = 24 examined; 0/24 wired (research only).
