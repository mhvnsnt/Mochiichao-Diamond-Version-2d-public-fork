# Mochiichao Title / Intro Music v2 — DRAFTS, show to Mars first

Title Music lane, 2026-10-25. This batch is DRAFTS ONLY until Mars listens and approves.
Nothing in this batch is wired as final. The only final audio slot decisions are:
- BOOT = UI Art Option B "rising arpeggio" (not in this lane)
- PRESS-START = M3 "Mochii Chirp" (PR #36, chosen)
- All other audio below = DRAFT

## Why v1 was not good enough, and what changed

v1 (PR #36) was 3 flat voices: square lead + triangle arp + sine bass, same density
every bar, no percussion, no dynamics, no climax. Mars: title and intro "really suck".

v2 fixes that with structure measured from the actual FireRed decomp MIDI files
in the repo (aggregate counts only — NO Pokemon melodies, note sequences, or samples
were copied, transcribed, or shipped):

| File (decomp, read-only) | Structure measured | v2 uses |
|---|---|---|
| `sound/songs/midi/mus_title.mid` | 140 BPM, 10 musical tracks, 1,249 notes, velocities 52–127, steady bars ~35–60 notes/bar, climax bars 22–25 at 74–89 notes/bar, tail bar 5 notes, one layer enters at beat 9, drum/SFX layer enters at beat 87 (climax) | Title v2: 140 BPM, 8 layers, 808 notes, velocities 80–127 by section, steady A, fuller B (counter enters bar 9), climax bars 17–20 (brass + full drums + crash), resolve bars 21–24 |
| `sound/songs/midi/mus_new_game_intro.mid` | 120 BPM, 6 bars exactly, sparse: several tracks with only 3 long notes each, low pulse tracks (30 notes, low pitch), one pulse track 85 notes on a single pitch, avg velocity ~100 | Intro v2: 120 BPM, 12 bars = 2× 6-bar phrases, lead only 10 long notes total, pads + low eighth-pulse bass in phrase 1, strings/harp/hat enter in phrase 2, ends on A dominant |
| `src/title_screen.c` / HeartGold `src/title_screen.c` (already in v1 spec) | Title starts after title art loads; Any Key → 60-frame (1.0 s) fade out | Unchanged: v2 title starts in the same slot, same 1.0 s fade. Intro → title is V → I (intro ends on A, title starts on D) |

HeartGold / Black 2 title music data is not in readable MIDI form in the decomps
(SEQ binary), so FireRed MIDI is the readable source used here. That is stated, not
guessed — no claim is made about HeartGold/Black 2 note data.

## Rendering stack — real tools, not v1's hand synth

- Score: original MIDI written with mido (open-source MIDI library, workspace venv).
- Sampler: FluidSynth 2.3.4 (LGPL, Debian package `fluidsynth`), the industry-standard
  open SoundFont sampler.
- SoundFont: FluidR3_GM.sf2 (Debian package `fluid-soundfont-gm`, 142 MB, in
  `/usr/share/sounds/sf2/`). Used locally to render only; the SoundFont itself is NOT
  shipped in the repo (142 MB, and the game does not need it — it plays the rendered WAVs).
- Render flags: no reverb, no chorus (`-R 0 -C 0`), 44,100 Hz, so the loop point has
  no reverb tail crossing into the next loop.
- v1's per-sample Python oscillator synth was NOT reused for v2, per Mars's
  "don't hand-tool" instruction.

## Tracks in this batch — 2/2 v2 files, both DRAFT

All WAV: 44,100 Hz, rendered from the MIDI files of the same names (MIDI kept locally
with the spec, so a note can be changed and re-rendered without re-writing the score).

### 1. Title v2 — `public/audio/mochiichao-title-v2.wav` — DRAFT
- D major, 140 BPM, 24 bars, 41.14 s, loop.
- Chords: D | Bm | G | A | D | Bm | G | A | Em | G | D | A | Bm | G | A | D | Bm | G | D | A | D | Bm | A | D
- Layers (GM programs, 0-indexed): lead 80 (square lead), counter 73 (flute, bars 9+),
  pad 88, strings 48, brass 61 (climax + final bar only), bass 38, harp 46, drums ch. 9
  (hat/kick/snare in B, full + crash in climax, hat only in resolve).
- Lead melody, bar by bar (original to this task, listed for audit):
  - 1: A4 D5 F#5 E5
  - 2: D5 B4 A4 B4
  - 3: G5 F#5 E5 D5
  - 4: E5 C#5 D5
  - 5: F#5 G5 A5 G5 F#5
  - 6: E5 D5 B4 D5
  - 7: G5 E5 D5
  - 8: A4 C#5 E5 A4
  - 9: B4 D5 E5 G5
  - 10: G5 E5 D5 B4
  - 11: D5 F#5 A5 G5
  - 12: A5 F#5 E5
  - 13: B4 D5 F#5
  - 14: G5 A5 B5 A5
  - 15: A4 E5 C#5 D5
  - 16: D5 A4 B4
  - 17: D5 F#5 A5 B5 A5 G5
  - 18: B5 A5 G5 E5
  - 19: F#5 A5 D5
  - 20: E5 F#5 G5 A5
  - 21: D5 B4 A4
  - 22: B4 A4 G4 F#4
  - 23: E5 A4 C#5
  - 24: D5 (held, loop restarts)
- Note counts: lead 88, counter 32, pad 72, strings 48, brass 15, bass 192, harp 192,
  drums 169 = 808 total.

### 2. Intro v2 — `public/audio/mochiichao-intro-v2.wav` — DRAFT
- D major, 120 BPM, 12 bars, 24.00 s, one-shot (not looped).
- Chords: D | G | Bm | A | G | D | Em | G | Bm | G | D | A
- Lead: only 10 long notes: D5, F#5, G5, A5, G5, B5, A5, D5, E5, A5 — sparse by design,
  following the new-game intro structure, not a second full song like v1 intro was.
- Layers: lead 80, pad 88, strings 48 (phrase 2 only), bass 38 (eighth low pulse),
  harp 46 (phrase 2 only), drums hat only (bars 9+).
- Ends on A (dominant). Title v2 starts on D (tonic). Intro → title is V → I.

## Status table — what is draft, what is chosen (for the wiring agent)

| File | Status | Wire? |
|---|---|---|
| `mochiichao-boot-M3-mochii-chirp.wav` (PR #36) | CHOSEN — press-start sound | Yes, press-start slot only, when wiring runs |
| UI Art `boot-sound-option-b-rising-arpeggio.wav` | CHOSEN — boot sound | Yes, boot slot only |
| UI Art A / C boot options | SAVED AS OPTIONS, not chosen | No |
| `mochiichao-boot-M1-data-spark.wav`, `mochiichao-boot-M2-harbour-bell.wav` | DRAFT / unpicked | No |
| `mochiichao-title.wav`, `mochiichao-intro.wav` (v1, PR #36) | DRAFT, superseded by v2 drafts | No, do not wire as final |
| `mochiichao-title-v2.wav`, `mochiichao-intro-v2.wav` (this batch) | DRAFT, awaiting Mars listen + approval | No, until Mars approves after listening |

## Verification (this lane, before PR)

- MIDI note counts and durations above are from the compose script output, not estimates.
- VERIFIED after render (2026-10-25 ~21:13 CDT): title 41.143 s, 44,100 Hz, stereo,
  16-bit, peak 24,260/32,767 (no clipping, re-rendered at gain 0.5), first/last sample 0,
  trimmed to exact bar length with 0.2 s end fade so the loop point is clean.
  Intro 24.000 s, 44,100 Hz, stereo, 16-bit, peak 23,720/32,767, first/last sample 0,
  trimmed to exact bar length with 0.2 s end fade. Files: title 7.0 MB, intro 4.1 MB.
- Playable links for Mars are jsDelivr links to the merged repo files (audio/wav,
  no attachment header, verified on v1) — NOT Muse storage download links, NOT
  in-chat attachments, per Mars's playable-links rule.
- No Pokemon melody, cry, or sample in v2: melodies above are new, the sampler
  SoundFont is a generic GM bank, and no decomp audio file was copied into the repo.
