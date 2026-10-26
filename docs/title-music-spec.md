# Mochiichao Title / Intro Music — original compositions, PR batch 1

Title Music lane, 2026-10-25. Music only — no creature art, no backgrounds in this batch.

## Rule followed

- Original compositions only. NO Pokemon music, NO Pokemon cries, NO copied melodies.
- CC0 first as reference/structure (hyperpixel, Tallbeard/Abstraction), Quillbit/Vacuous
  only WITH credit if credit is added. Re-checked at download time, 2026-10-25 (see below).
  This batch ships NO pack files at all, so NO credit is owed by this batch.
- Pokemon-first mapping: structure, order, and fade behaviour are taken from the real
  decomp files already in the repo. Notes, chords, and melodies below are Mochiichao's own,
  written for this task. They are listed in full so originality is auditable.
- Boot chimes here are labelled M1/M2/M3 on purpose. They do NOT overwrite the UI Art
  lane's boot sound pick A/B/C, which Mars has NOT yet picked. Mars can pick an M-option,
  an A/B/C option, or none — the music tracks are distinct from any boot chime.

## Pokemon element -> Mochiichao replacement in that exact spot -> HAVE / NEED

| Pokemon element (file, verified) | Mochiichao replacement in that exact spot | Status |
|---|---|---|
| FireRed `src/title_screen.c`: `m4aSongNumStart(MUS_TITLE)` in `CB2_InitTitleScreen` case 2, after title palettes/tiles are loaded, before the Run scene | `public/audio/mochiichao-title.wav` starts after the title art loads, loops (`audio.startFileLoop`, `loop = true`) | HAVE — file in this PR, wiring call is 1 line for main (below) |
| FireRed title timer task: destroys after 2700 frames (45 s at 60 fps) | Title loop plays indefinitely until Any Key — no auto-timeout in this batch | NEED — timeout/demo is a GAP, not claimed |
| FireRed press A/B/Start -> RUN scene -> CRY scene: `PlayCry`, 90-frame wait, white palette fade, `FadeOutBGM(4)` | Press Any Key -> 60-frame (1.0 s) fade out, then main menu. NO cry on title press in this batch | HAVE (fade spec) / NEED (no cry file — deliberately absent, no Pokemon cry, no Mochiichao cry composed here) |
| HeartGold `src/title_screen.c`: `TITLESCREEN_MAIN_START_MUSIC` state, then `TITLESCREEN_MAIN_PLAY`; initialDelay 30 frames, then Press Start flash enabled; A/Start/touch -> `GF_SndStartFadeOutBGM(SEQ_NONE, 60)`, `PlayCry`, white fade; when fade timer hits 0 -> `StopBGM`, black fade to menu; timeout `TITLE_SCREEN_DURATION 2340` frames (39 s) -> same 60-frame fade, no flash | Title: separate START_MUSIC step, short delay before PRESS ANY KEY flashes, Any Key -> 60-frame fade, then menu. Timeout uses the same 60-frame fade when main wires it | HAVE (spec + files) / NEED (timeout wiring) |
| HeartGold `src/field_bgm.c`: `FieldBGM_GetFadeOutAndWaitFrames` mode 1/2/default = 60 fade-out frames | Mochiichao title exit fade = 1000 ms (60 frames at 60 fps). `audio.playScene` already accepts `crossfadeMs`; main passes 1000 on title exit, not the 600 ms default | HAVE (spec) / NEED (main wiring call) |
| FireRed `src/intro.c`: intro sequence music slots (`MUS_GAME_FREAK`, `MUS_INTRO_FIGHT`, etc.) are separate from `MUS_TITLE` | `public/audio/mochiichao-intro.wav` is a separate one-shot intro track, NOT a cut of the title loop | HAVE — file in this PR |
| CC0 structure: hyperpixel loops are seamless, most 150 BPM 4/4; Tallbeard loops are seamless CC0 | Title/intro are exact bar multiples (title 16 bars, intro 12 bars), envelopes end at zero, first sample 0, so the loop point is seamless. Tempos are deliberately different (112 / 96 BPM, not 150) and the key is G major, not hyperpixel's between-C-minor-and-C#-minor | HAVE — verified below |

## Tracks in this batch — 5/5 files rendered, 0 pack files shipped

All WAV: 44,100 Hz, mono, 16-bit. Rendered by
`title-music/compose_title_music.py` (kept locally with this spec; the script is the
score — changing a note there and re-running reproduces the file).

### 1. Title — `public/audio/mochiichao-title.wav` — HAVE
- "Harbour Dawn" — G major, 112 BPM, 4/4, 16 bars, 34.286 s, loop.
- Chords per bar: G | Em | C | D | G | Em | C | D | Em | C | G | D | Em | C | D | G
- Lead (square), arp (triangle, eighth notes cycling chord tones), bass (sine, root + fifth).
- Melody, bar by bar (auditable, original to this task):
  - 1: D5 E5 G5 E5 D5
  - 2: E5 D5 B4 D5
  - 3: C5 E5 G5 E5
  - 4: D5 F#4 A4 D5
  - 5: G5 E5 D5 B4
  - 6: E5 G5 B4 A4
  - 7: C5 D5 E5 G5
  - 8: A4 B4 D5 F#4
  - 9: E5 G5 A5 G5 E5
  - 10: G5 E5 C5 E5
  - 11: D5 G5 B4 D5
  - 12: A4 D5 F#4 A4
  - 13: E5 D5 B4
  - 14: C5 E5 G5
  - 15: D5 F#4 A4 B4
  - 16: G5 D5 G4 (resolves to tonic, loop restarts on D5 over G)
- Wiring: `audio.registerFile('title', '/audio/mochiichao-title.wav')`, then
  `audio.playScene('title')` after title art loads. On Any Key, fade 1000 ms, then menu.

### 2. Intro — `public/audio/mochiichao-intro.wav` — HAVE
- "First Light" — G major, 96 BPM, 4/4, 12 bars, 30.000 s, one-shot (not looped).
- Chords per bar: G | C | Em | D | G | Em | Am | D | Em | C | D | D
- Melody, bar by bar:
  - 1: D5 G5
  - 2: E5 G5
  - 3: B4 E5
  - 4: A4 D5
  - 5: G5 B4
  - 6: E5 G5
  - 7: A4 C5
  - 8: D5 F#4
  - 9: E5 D5
  - 10: C5 E5
  - 11: D5 A4
  - 12: F#4 A4
- Design point: intro ends on D (the dominant). Title starts on G (the tonic).
  Intro -> title is therefore a V -> I cadence across the cut, not a key clash.
- Wiring: `audio.registerFile('intro', '/audio/mochiichao-intro.wav')`, then
  `audio.playScene('intro')` for the Aeon intro. Crossfade to title at 1000 ms.
  Do NOT loop the intro file — if the intro runs long, main holds the last D chord
  or crossfades early; do not restart the intro from bar 1.

### 3. Boot chimes — options only, NOT a pick — HAVE (3/3)
Distinct from title/intro (no shared melody bar) and from each other. Mars picks one,
or none. None of these overwrites the UI Art lane A/B/C pick.

- M1 "Data Spark" — `public/audio/mochiichao-boot-M1-data-spark.wav`, 1.250 s, 120 BPM:
  C5 -> E5 -> G5 -> C6, square arp, ascending, bright. Shortest, most "boot"-like.
- M2 "Harbour Bell" — `public/audio/mochiichao-boot-M2-harbour-bell.wav`, 2.667 s, 90 BPM:
  G4 -> C5 -> E5, slow, warm. Longest, calmest.
- M3 "Mochii Chirp" — `public/audio/mochiichao-boot-M3-mochii-chirp.wav`, 1.364 s, 132 BPM:
  G5 -> E5 -> D5 -> G5, playful dotted rhythm. Most characterful, least formal.
- Wiring (only after Mars picks): play the chosen file once at boot, before the
  M Heavensent Studios logo screen, at low volume, then intro. Do NOT play a boot
  chime AND the title loop at the same time. If Mars picks an A/B/C boot sound from
  the UI Art lane instead, do NOT also wire an M-option.

## Licence re-check, 2026-10-25 (search, not a download — no pack file shipped on this)

| Pack | Licence as found 2026-10-25 | Used in this PR? | Credit owed by this PR? |
|---|---|---|---|
| hyperpixel — 33 Free Chiptune Loops (https://hyperpixel.itch.io/33-free-chiptune-loops) | CC0 1.0, "no credit or royalty required", seamless loops, most 150 BPM 4/4, key between C minor and C# minor | No — reference/structure only, no file downloaded or shipped | No |
| Tallbeard / Abstraction — Free Chiptune Music Loops / Three Red Hearts (https://tallbeard.itch.io/three-red-hearts-prepare-to-dev, bundle https://tallbeard.itch.io/music-loop-bundle) | CC0, "no credit required" (artist asks for courtesy credit as "Abstraction", not a licence requirement); licence note: do not use for NFTs / AI-ML / direct resale of unmodified assets | No — reference/structure only | No (courtesy "Abstraction" line is in the track map for future use, not owed here) |
| Quillbit Chiptune Free Sampler (https://quillbit-type.itch.io/quillbit-chiptune-free-sampler) | Free for commercial games WITH credit: `Music: Quillbit Chiptune (quillbit-type.itch.io)`; 6 loops + 3 jingles, OGG + WAV at -16 LUFS | No | No — do NOT ship a Quillbit track without adding that exact credit to the credits screen first |
| Vacuous BGM — 8BIT GAME BGM Vol.01 | Free with credit: `BGM: 8BIT GAME BGM Vol.01 — Vacuous BGM` (per the earlier track map; not re-verified by a download in this batch) | No | No |

If main later downloads a real CC0 loop for another scene, re-check its page at download
time — a search snippet is not a licence, and the page at download time wins.

## Verification (this lane, before PR)

- File counts: title 1/1, intro 1/1, boot chimes 3/3 = 5/5 audio files rendered.
- Durations (exact bar multiples): title 34.286 s (16 bars at 112 BPM), intro 30.000 s
  (12 bars at 96 BPM), M1 1.250 s, M2 2.667 s, M3 1.364 s.
- WAV headers: 44,100 Hz, mono, 16-bit, first sample 0, last sample -1 to 2 (no click),
  peaks 6,684–15,949 / 32,767 (no clipping, headroom kept).
- Loop seam: title/intro envelopes release to zero in the last 15% of each note;
  last-10-ms maxima are 1,228 (title) and 1,043 (intro) vs peaks above — no pop at the loop point.
- No Pokemon melody, cry, or sample: melodies are listed above, written for this task;
  no decomp music data was copied (decomp files contain song IDs and player code, not
  note data that was transcribed here).
- Build gate for this PR: files are under `public/`, which Vite copies to `dist/` unchanged;
  no code file is modified in this PR, so no TypeScript build break is introduced by it.
  Main's next build (after merge) must still pass `npm run build` before any wiring PR.

## Wiring checklist for main (NOT done in this PR — this PR is files + spec only)

1. [ ] `audio.registerFile('title', '/audio/mochiichao-title.wav')`
2. [ ] `audio.registerFile('intro', '/audio/mochiichao-intro.wav')`
3. [ ] Title art load -> `audio.playScene('title')` (after first user gesture; autoplay
       policies block sound before a gesture — see `audio-system.ts`).
4. [ ] Intro -> title crossfade 1000 ms; title exit on Any Key -> fade 1000 ms (60 frames).
5. [ ] Boot chime: ONLY after Mars picks M1/M2/M3 or A/B/C. One file, once, low volume.
6. [ ] Settings: a real Settings screen now exists on main (`src/components/game/SettingsScreen.tsx`,
       via PR #28 — this closes the old "no Settings screen" audio gap). Bind sliders to
       `audio.setMaster / setMusic / setSfx` and mute to `audio.toggleMute` in the audio
       wiring PR, not in this music-files PR.
7. [ ] Verify with no files registered: synth fallback still plays (existing audio-system behaviour).

## GAP — what is still NOT done (this lane)

- Title music in the playable game: 0/1 wired (files landed, registration calls not yet applied).
  Overall title/intro music: files 2/2 = 100%, wired 0/2 = 0%, boot pick 0/1 = 0%.
- Title-press cry/sound: 0/1 — deliberately absent (no Pokemon cry, no Mochiichao cry yet).
- Title timeout/demo (HeartGold 2340 frames): 0/1 — not wired, title loops until press.
- In-game listening test on the Pages build: 0/1 — files verified locally as WAVs only,
  not yet heard through the game's Web Audio path (that needs the wiring PR + a build).
- Quillbit/Vacuous tracks for other scenes: 0/2 shipped — correctly 0, credits not added,
  and this batch does not claim them.
- Full game soundtrack (town, route, battle, etc. from `audio-track-map.md`): 0/48 scenes
  with real files — this lane was title/intro only, per the order. Do not claim otherwise.
