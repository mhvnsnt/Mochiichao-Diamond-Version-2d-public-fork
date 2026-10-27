# Intro Video Creator + Start Screen Creator — spec
Mars, 2026-10-25 19:28 CDT — "like a Blender, but for this game"
Settings -> Menu Creator -> CREATE INTRO VIDEO / CREATE START SCREEN
Full dedicated screens, Pokemon layout first, Y2K skin on top, B: BACK,
presets only at first, locked default never overwritten.

## What it is, in one line
A timeline creator INSIDE the game, for making your own intro video
and your own start screen, from stuff already inside the game —
creature figures, title backgrounds, biomes, particles, music slots,
logo, fonts — then that creation BECOMES your intro / start screen
when you save it as a preset. Not a video file shipped in the game
at first: it is intro SEQUENCE DATA (JSON) the game already knows
how to play (IntroSequence + TitleScene). Video export is Phase 2.

## Creator screens, in order
1. CREATE INTRO VIDEO — timeline, top to bottom:
   - Scene list (add / duplicate / delete scene, reorder)
   - Per scene: background (biome / painted background, 8 biomes),
     creatures (rotation pool figures, clean cutouts only),
     particles (fire, snow, rain, leaves, embers, smoke),
     camera (pan, zoom, shake — Pokemon title camera math),
     text (logo, subtitle, dialogue — font rows, NOT Pokemon fonts),
     music slot (original music only, GAP if none), duration,
     transition (fade black/white, shutter wipe, slide).
   - Timeline ruler: seconds + frames, playhead, play / pause,
     scrub, keyframes (position, scale, opacity, camera).
   - Any key skips, same as Pokemon intro — creator preview uses it.
2. CREATE START SCREEN — same timeline, one scene, locked layout:
   - Logo slot (phi 900 wide, centre 600,450), DIAMOND VERSION
     subtitle slot (phi 556, centre 600,735, font PINNED),
     PRESS ANY KEY slot (y=927, blink 30/15), studio logo slot
     (556, centre 600,1222), creature slot (rotation pool),
     background slot (biome / painted), particles slot.
   - Move a slot = Layout Editor, restyle a slot = UI Creator —
     same creators, same presets, no second system.
3. SAVE AS PRESET — name it, it goes in Menu Creator presets,
   export JSON (our own format, layout-as-data idea, not Tuxemon code).
   LOAD PRESET — replaces intro / start screen in game, locked
   default stays available as "Reset to Locked Default".

## Open source / industry / academic sources pulled in, licence-clean
- Blender (GPL, desktop, NOT shipped in the web game): timeline,
  keyframe, graph editor, camera, particle emitter concepts —
  translated to Pixi, not Blender code copied in.
- PixiJS v8 (MIT, already in game): layers, sprites, particles,
  camera pan/zoom, alpha fades — the actual engine for the creator.
- FFmpeg (LGPL/GPL, desktop tool, NOT in web build): Phase 2 video
  export only — render the JSON timeline to frames, encode to mp4.
  In-browser Phase 1 export: MediaRecorder Web API (browser native),
  no binary shipped.
- Kenney CC0 UI/particle shapes, game-icons CC BY 3.0 with
  attribution, 0x72 CC0 tiles — as creator asset options, restyled.
- Academic: keyframe interpolation, easing curves, sine-wave
  motion (FireRed AnimTranslateLinearSingleSineWave), camera
  ease — same math as the title animation system.

## What is NOT in Phase 1, labelled GAP
- Video file export (Phase 2, FFmpeg desktop / MediaRecorder).
- Blender project file export (.blend) — desktop tool only, later.
- Title music composition, boot sound pick, painted backgrounds,
  9/10 creature cutouts — creator uses GAP labels in those slots,
  never fake art.
- Blender binary itself in the repo — install note only, GPL.

## Wiring order
Creator screens first (timeline + presets + JSON), then intro
playback from a saved preset, then start screen playback from a
saved preset, then Phase 2 export. One batch per PR, gate-checked.
