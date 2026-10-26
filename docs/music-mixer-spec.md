# Music Mixer — spec (Mars, 2026-10-26)

## What it is
A music mixer inside the game, under Settings, as its own menu. Open it and
the track currently being worked on is already loaded — title v3 + Mars's
main vocal — like FL Studio popping up a demo song on first load. Delete
stems out of it, or hit NEW for a fresh empty project. LOAD DEFAULT brings
the default project back. Stem files are never deleted; NEW / DELETE only
change the in-memory project.

## Pokemon element -> Mochiichao replacement -> HAVE / NEED
- FireRed `option_menu.c` full-screen options menu (header window, list
  window, help bar, label left / value right, UP/DOWN wraps, LEFT/RIGHT
  cycles, CANCEL saves + exits — structure documented in
  `SettingsScreen.tsx`'s header) -> Settings list + MUSIC MIXER row ->
  HAVE (SettingsScreen rows, StdWindow).
- FireRed `text_window.c` 9-slice window frame -> `StdWindow` (one frame
  everywhere: panel #16233a, teal #22d3ee border, gold selected accent) ->
  HAVE (mixer window + channel strips reuse StdWindow).
- Pokemon dedicated full-screen menus (never a popup over gameplay) ->
  Music Mixer is its own full screen under Settings -> HAVE.
- FL Studio mixer (channel strips, faders, pan, mute/solo, transport,
  master) -> Web Audio channel strips + transport + master -> HAVE
  (new in this PR: `MusicMixerScreen.tsx`, no library, plain Web Audio).
- FL Studio draggable mixer windows -> mixer window drags by its gold
  header, DOCK re-centres it -> HAVE (new, explicitly asked for by Mars
  in his own words 2026-10-26 — this is the one authorised exception to
  the usual no-popup rule; no other screen gets draggable windows here).
- FL Studio playlist / piano roll / plugin rack -> NOT built. NEED, only
  if Mars orders it. The mixer mixes stems; it does not sequence notes.
- Open-source visual help -> NONE newly installed. The repo already has
  Motion (`motion/react`, used by SettingsScreen) and the StdWindow /
  game-panel palette; the mixer reuses those, so package.json and
  package-lock.json are untouched. Adding a mixer UI library would have
  changed the lockfile for no gain.

## Default project (exact stems, measured)
All stems exactly 41.143 s (title loop: 140 BPM, 24 bars), so looped
playback stays in sync. Title stems trimmed from raw renders (43.4–52.5 s)
to the first 41.143 s — that window is what the title loop plays.
- Title Melody 0.70, Bass 1.00, Drums 1.00, Guitar 0.70, Synth 0.70,
  Organ 0.50 (v3 mix-script volumes).
- Main Vocal 1.00: v16 lead (pitch x2.73, formant x1.5, D major, 20 ms
  glide), phrase-placed onto the title timeline, mono.
- Payload: 7 files, ~45 MB total.
- OMITTED, honestly: V15 lead (3.4 MB) and Pancake overdub (7.3 MB
  placed, stereo) would push the payload to ~57 MB. They stay on the
  vocal-mix draft branch; a later vocal-layer pack can add them.

## Behaviour, exactly
- Open: default project loaded, game (main-menu) music stops.
- PLAY: fetches + decodes stems once (cached), starts all looped sources
  at one shared start time, so channels stay together.
- Sliders (VOL 0–150%, PAN L100–R100), MUTE, SOLO apply live while
  playing. Any SOLO silences non-soloed channels.
- DELETE: stops that channel's source and removes it from the project.
- NEW: stops playback, clears all channels, project becomes "Untitled Mix".
- LOAD DEFAULT: stops playback, restores the default project.
- BACK / Esc / B: stops playback, restarts main-menu music, returns to
  Settings. Unmount also stops playback and closes the AudioContext.
- Failure: a stem that fails to fetch/decode stops playback and names
  the stem in the error line; other stems are not faked.

## Files
- `src/components/game/MusicMixerScreen.tsx` (new)
- `src/lib/musicMixerProject.ts` (new)
- `src/components/game/SettingsScreen.tsx` (modified: MUSIC_MIXER screen,
  one row, creator-style key early-return, mixer early-return render)
- `public/audio/mixer/mixer-title-*.wav` (6 new), `public/audio/mixer/mixer-vocal-lead.wav` (1 new)
- `docs/music-mixer-spec.md` (this file, new)

## Still needs Mars's listen/test (not claimed done)
- In-game playback on a real device / phone: build passes, but no
  playtest of the mixer has run yet. Mars's step: open Settings >
  MUSIC MIXER, hit PLAY, drag the window, delete a stem, hit NEW,
  hit LOAD DEFAULT, go back — and say what sounds / feels wrong.
