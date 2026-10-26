# Main Menu Music v1 — DRAFT (wired for testing, not official)

Title Music lane, 2026-10-25. Main menu had NO track before this batch:
no main-menu WAV on main, and the MAIN_MENU phase in IntroSequence played
nothing. This track fills that gap. It is a DRAFT, wired so Mars can hear it
in the game and direct the next version — it is NOT marked official, unlike
title/intro v3.

## Loop audit (what loops, what does not — Mars's question, answered)

| Screen / phase | Track | Loops? | Why |
|---|---|---|---|
| BOOT | UI Art Option B boot SFX, 1.95 s | No, one-shot | A boot sound is a logo sting, not music |
| INTRO (cinematic scenes) | Official intro v3, 24.000 s | No, one-shot | Like FireRed's new-game intro: plays once, then stops; TITLE music starts at the title screen |
| TITLE (PRESS ANY KEY) | Official title v3, 41.143 s | YES, loops | Title music must keep playing until a key is pressed; file ends at a bar boundary with a 0.2 s fade to sample 0, so the loop point is clean |
| MAIN_MENU / SETTINGS / SAVE_SLOTS | Main menu v1, 26.667 s | YES, loops | Menu music must keep playing while the player browses menus; file ends at a bar boundary with a 0.2 s fade to sample 0 |
| PROF_INTRO / name entry / world | (none in this lane) | — | Music stops when leaving the main menu, so the world starts silent; world/field music is a later track batch |

Title → main menu transition: title fades out over 1,000 ms (Pokemon
60-frame fade, HeartGold field_bgm), then main-menu music fades in over
500 ms. Press-start SFX (M3) plays on the title press, overlapping the
fade — it is a separate one-shot element, not the music element.

## Style research (pop + hyperpop + Y2K J-pop + rap, blended)

- Hyperpop (120–160 BPM, SampleFocus / Soundtrap / Output): bright saw
  synths, distorted 808s, rapid hi-hat rolls (1/8 to 1/32), glitch/stutter,
  maximalist, catchy hooks, loud and compressed. Not background music —
  music that wants attention.
- Y2K Japanese electro-pop (128–144 BPM, Perfume / Yasutaka Nakata style):
  bright major chords with add6/add9 shimmer, four-on-the-floor, shimmering
  arps, synth bass, glossy production.
- J-pop chord palettes: bright majors, add6/add9, and the Komuro
  progression vi–IV–V–I (90s J-pop signature: uplifting and bittersweet
  at once, resolves in four bars, perfect for a loop).
- American pop: I–V–vi–IV, the classic pop progression.
- Rap / hip-hop: 808 sub-bass, snare backbeat on beats 2 and 4,
  syncopated kicks, hat patterns.

Blended design choice (not a copy of any one song): A major, 144 BPM
(in hyperpop range, at the top of Y2K electro range), Komuro progression
vi–IV–V–I as the loop backbone, with a pop I–V variation in bars 11–12,
four-on-floor kick + trap hats + snare/clap backbeat, 808 sub-bass,
saw hook synth, pop piano stabs, add9 pad shimmer.

## Golden ratio (same method as v3, plainly)

Phi = 1.618, 1/phi = 0.618. Biggest moment at 61.8% through.
Main menu: 16 bars × 0.618 = 9.89 → bar 10 is the phi bar.
Bar 10 is a D chord (IV) with: crash, a 32-step hat roll, and the highest
hook note of the track (C#6). Bars 1–9 build to it, bars 11–16 release
back toward the loop point (bar 16 = E, the dominant, which resolves to
A, the tonic, when the loop restarts — V → I, the strongest loop cadence).

## Track — `public/audio/mochiichao-main-menu-v1.wav` — DRAFT

- A major, 144 BPM, 16 bars, 26.667 s, loops.
- Chords: F#m | D | E | A | F#m | D | E | A | F#m | D | A | E |
  F#m | D | E | E. Loop point, stated exactly: bar 16 is E (V in A
  major) and bar 1 is F#m (vi), so the loop turns V → vi — a deceptive
  cadence, which is why the loop feels like it keeps rolling instead of
  stopping. The A tonic is established in bars 4, 8, and 11, so the loop
  does not lose its home key.
- Layers (GM programs): hook synth 81 (saw, 77 notes, short catchy
  phrases, glitch stutter at bar 16 into the loop), pop piano 0 (384
  notes, eighth-note chord stabs), pad 88 (64 notes, whole-note chords
  with add9: Aadd9 = A+C#+E+B, Dadd9 = D+F#+A+E), 808 bass 39 (48 notes,
  syncopated root + octave pop), drums (353 notes: four-on-floor kick,
  snare + clap on 2/4, hats eighth in A / sixteenth in B, crash + 32-step
  roll at phi bar 10). Total 926 notes.
- Hook, bar by bar (original to this task): bars 1/5/9/13 share the
  E5–C#5–A4–E5–F#5–E5 phrase; bar 10 peaks at C#6; bar 16 stutters E5
  four times in sixteenths, then A5–F#5–E5 into the loop.
- Mix (stem mix, same method as v3): melody stem (hook+piano+pad,
  highpass 80 Hz), bass stem (lowpass 250 Hz, vol 1.15), drums stem
  (highpass 40 Hz, +2 dB at 5 kHz). Master: compressor threshold
  -16 dB, ratio 3:1, attack 5 ms, release 80 ms; limiter 0.89; final
  0.2 s end fade to sample 0. Menu music is deliberately quieter than
  title (peak 0.64 vs title 0.88) so it sits behind menu browsing.
- Verification: 26.667 s exact, 44,100 Hz, stereo, 16-bit, peak
  20,816/32,767 = 0.64, overall RMS 0.14, per-bar RMS 0.14–0.15 flat
  (four-on-floor throughout; phi bar is a hook/crash accent, not an
  RMS jump — stated honestly), first sample 0, last sample 0.

## Wiring (in the same PR as this track)

- New file `src/lib/music.ts`: music only (intro/title/mainMenu),
  playMusic(track, fadeMs=1000), stopMusic(fadeMs), pending-track
  retry on first gesture (autoplay policy), same-track no-op so
  re-renders do not restart loops, BASE_URL paths so Pages sub-path
  works. Boot/press-start are NOT in this module: they were already
  wired on main in `src/lib/bootAudio.ts` (BOOT = B, press = M3),
  and duplicating them would double-play both sounds.
- `src/components/IntroSequence.tsx`: phase effect — INTRO → intro
  (one-shot), TITLE → title (loop), MAIN_MENU/SETTINGS/SAVE_SLOTS →
  main menu (loop), later phases → stop music; BOOT sound and TITLE
  press sound stay with `src/lib/bootAudio.ts` (already on main);
  unmount → stopMusic(0). Two UI strings updated from "music: GAP"
  to the wired tracks (title background art GAP string is unchanged
  — that art gap is real and separate).
- `src/App.tsx`: onComplete / onEnterWorld → stopMusic(0) before
  entering the world, so menu music does not bleed into gameplay.
- No other game logic, saves, rendering, or store code was touched.
  No audio library was added (plain HTMLAudioElement).

## Status

- Main menu v1: DRAFT, wired for testing. Mars to direct the next
  version (artistic/production direction for all game music is his,
  per his 2026-10-25 message). Do NOT mark it official until he says so.
- Title v3 / intro v3: OFFICIAL (unchanged by this batch).
- Boot B / press-start M3: CHOSEN (unchanged, now wired).
