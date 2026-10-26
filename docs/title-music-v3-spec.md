# Mochiichao Title / Intro Music v3 — OFFICIAL TRACKS

Title Music lane, 2026-10-25. v3 is built ON TOP of v2. v2 files are NOT deleted,
NOT replaced, NOT overwritten — they stay on main as LOCKED DRAFTS. v3 is a new,
separate pair of files. Mars approved v3 on 2026-10-25 ("those are awesome")
and made it official — see `docs/title-music-status.md` and
`docs/game-music-production-conversation.md`. Wiring into the playable game
is a separate, explicit step (see status doc); this spec records the tracks
and how they were made.

## What Mars asked for (2026-10-25 ~21:41 CDT)

- Lock v2 in as drafts, then build on them and make them better.
- Title v3: add rock guitar, synths, bass, drums (bass + snares), synthy / rocky /
  rap / hip-hop feel, Nosferatu organs, heavy distorted rock guitar, different
  orchestrations on top of v2, done through the Pokemon way of making music.
- Intro v3: more rap-like, more bass and drums, heavy rock guitar elements, but
  NOT as much of the other stuff as the title.
- Mix and master them properly. Research how to mix, look at the waveforms and
  layers, research the golden-ratio / math equivalent of music, notes and theory.
  Mars said he does not understand music theory as much — so this spec explains
  the math in plain words, with the numbers shown, not hidden.

## Pokemon way of making music — applied here (structure, not samples)

From the FireRed decomp in the repo + published GBA audio documentation:

1. Score = MIDI tracks, one voice per track. The GBA pipeline is MIDI → mid2agb →
   `.s` track files. v3 is exactly that: a MIDI file, one track per instrument.
2. Fixed voicegroup. Each GBA song picks one voicegroup: the instrument assigned
   to each track (a DirectSound sample or a CGB waveform). v3's voicegroup is the
   GM program list below — one program per track, fixed for the whole song.
3. Limited channels. GBA Pokemon games use 5 simultaneous DirectSound channels,
   reverb on with default value 0, master volume 12, ~13,379 Hz engine rate,
   8-bit DAC. v3 keeps the spirit, not the limits: 14 title tracks is more than
   5 GBA channels, because this is a modern web game, not a GBA ROM — the
   method (track-per-voice + fixed voicegroup + bar-boundary loop) is the
   Pokemon part, not a claim that this would fit on a GBA.
4. Loop point at a bar boundary. GBA songs loop at a measure marked in the `.s`
   file. v3 title loops at exactly 24 bars (41.143 s), intro is a one-shot.
5. Balance before render. GBA hackers balance per-track volumes in the MIDI
   editor before converting. v3 sets a velocity per track/section in MIDI
   first, then renders, then mixes stems — it does not just turn the master up.
6. No reverb wash. Rendered with FluidSynth `-R 0 -C 0`, same as v2.

No Pokemon melody, cry, sample, or direct_sound_sample file was copied into
v3. The decomp direct_sound_samples/ folder was listed only to confirm the
voicegroup model (e.g. `drum_and_percussion_kick.wav`, `sc88pro_flute.wav` are
the kind of per-track samples a voicegroup holds). None of those WAVs are in v3.

## Golden ratio / math of music — plain version

- Phi (φ) = 1.6180339…, and 1 / φ = 0.618. If you cut a piece at 61.8% of its
  length, that point is the "golden point". Producers and composers (Bartók,
  Debussy, and many film-score writers, per the research) often put the biggest
  moment — the climax, the drop, the new instrument entering — at or near that
  point, because it feels like a natural turn, not too early and not at the end.
  It is NOT a rule and NOT lab-proven magic. It is a proportion that often
  feels right, and v3 uses it as a placement choice, honestly labelled.
- Title: 24 bars × 0.618 = 14.83 → bar 15 is the phi bar.
  v3 puts its fullest hit there: church organ enters at bar 15, saw synth
  doubles the lead at bar 15, distortion guitar is chugging, sub-bass holds a
  whole-bar root, and a crash hits at bar 15 beat 1. Measured: bar 15 peak
  0.77, higher than the surrounding B bars (0.63–0.68).
- Intro: 12 bars × 0.618 = 7.42 → bar 8 is the phi bar.
  v3 phrase 2 starts at bar 7 (rap beat + guitar building), and bar 8 is the
  full hit: crash, guitar chugging in eighths, full hip-hop beat. Measured:
  bar 8 peak 0.71, the highest of the early phrase-2 bars.
- Other math, plainly: notes are frequencies doubling every octave (A4 = 440 Hz,
  A5 = 880 Hz). A major chord is root + 4 semitones + 7 semitones (D + F# + A).
  A fifth (power chord) is root + 7 semitones (D + A) — that is why rock guitar
  power chords sound strong and simple. Hip-hop backbeat = snare on beats 2 and
  4. That is the whole theory v3 needs; everything else is the chord lists
  already in the v2 spec, in D major.

## Mixing — what was actually done (stems, not just a master knob)

v2 waveform analysis first (measured, not guessed):
- Title v2 per-bar RMS: A bars ~0.08, B bars ~0.11, climax bars ~0.14, resolve
  ~0.09. Peak 0.74. Headroom existed, so v3 could layer up without clipping.
- Intro v2: phrase 1 bars alternated 0.07 / 0.11 (sparse by design), phrase 2
  ~0.11–0.15. The rap beat in v3 was aimed at lifting phrase 2 evenly.

Stem render (FluidSynth 2.3.4 + FluidR3_GM, gain 0.8, no reverb/chorus):
- Title stems (6): melody (lead/counter/pad/strings/brass/harp), bass (v2 bass +
  sub-bass), drums (v2 drums + hip-hop drums), guitar, synth (saw + synth brass),
  organ.
- Intro stems (4): melody, bass (v2 bass + sub-bass), drums (v2 drums +
  hip-hop drums), guitar.

Stem EQ + levels (ffmpeg, frequency slotting so instruments do not fight):
- Melody: highpass 80 Hz, volume 1.0.
- Bass: lowpass 250 Hz, volume 1.1 — bass owns the low end (hip-hop: boost
  50–100 Hz for body, keep it under the kick).
- Drums: highpass 40 Hz, +2 dB at 5,000 Hz for snare snap, volume 1.0 — kick
  bottom 60–100 Hz, snare fatness 220–260 Hz, crispness ~5–6 kHz.
- Guitar: highpass 150 Hz (cuts mud, leaves room for bass), +3 dB at 3,000 Hz
  for attack/definition, volume 0.9 — rock guitars live at 2–5 kHz.
- Synth: highpass 200 Hz, volume 0.8.
- Organ: lowpass 5,000 Hz, volume 0.7 — dark, sits behind, does not hiss.
- Master: gentle compressor (threshold -18 dB, ratio 2:1, attack 10 ms,
  release 100 ms), then a limiter at 0.89 (-1 dB). No true DAW sidechain
  compressor was used; kick/bass separation is by EQ + level + the bass
  notes being quieter on kick beats in the MIDI, which is stated honestly.
  A final 0.2 s end fade was re-applied after mastering so the loop point
  ends at exactly sample 0.

## Tracks in this batch — 2/2 v3 files, both DRAFT

### 1. Title v3 — `public/audio/mochiichao-title-v3.wav` — DRAFT
- Same base as v2, unchanged: D major, 140 BPM, 24 bars, 41.143 s loop, same
  melody, same chords, same v2 layers at the same velocities.
- New layers on top (new notes only): distortion guitar 256 (GM 30, power
  chords root+fifth, eighth-note chugging, bars 9–24), saw synth 21 (GM 81,
  doubles lead at phi bar 15 + climax bars 17–20), synth brass 48 (GM 62,
  sustained chords, bars 9–24), church organ 30 (GM 19, sustained chords,
  bars 15–24), sub-bass 32 (GM 39, long roots, bars 9–24), hip-hop drums 193
  (syncopated kicks, ghost snares, sixteenth hats in climax, crash at bar 15).
  Total new = 580 notes. Full track = 808 (v2) + 580 = 1,388 notes.
- Verification: 41.143 s, 44,100 Hz, stereo, 16-bit, peak 28,865/32,767 = 0.88
  (limiter 0.89, no clipping), overall RMS 0.16 (v2 was ~0.11 average),
  per-section RMS: A ~0.11, B ~0.18, climax ~0.19, resolve ~0.17,
  first sample 0, last sample 0.

### 2. Intro v3 — `public/audio/mochiichao-intro-v3.wav` — DRAFT
- Same base as v2, unchanged: D major, 120 BPM, 12 bars, 24.000 s, same lead
  (10 long notes), same chords, ends on A → title D.
- New layers on top, deliberately fewer than title: distortion guitar 32
  (GM 30, half-note power chords bars 7–12, eighth chugging at phi bar 8),
  sub-bass 18 (GM 39, syncopated roots + octave pops, bars 7–12), hip-hop
  drums 73 (kick on 1 + 3.5, snare on 2 + 4, eighth hats, crash at bar 8).
  No organ, no synth lead in intro — per Mars's "doesn't need as much".
  Total new = 123 notes.
- Verification: 24.000 s, 44,100 Hz, stereo, 16-bit, peak 24,228/32,767 = 0.74,
  overall RMS 0.13, phrase 1 bars 0.07–0.10 (unchanged sparse), phrase 2 bars
  0.16–0.17 (rap lift), first sample 0, last sample 0.

## Status table

| File | Status | Wire? |
|---|---|---|
| `mochiichao-title-v2.wav`, `mochiichao-intro-v2.wav` | LOCKED DRAFTS (Mars: "lock them in") | No — kept, not wired as final, not deleted |
| `mochiichao-title-v3.wav`, `mochiichao-intro-v3.wav` (this batch) | OFFICIAL (Mars, 2026-10-25) | Yes, when the wiring step runs — wiring itself is not in this spec batch |
| BOOT = UI Art Option B, PRESS-START = M3 | CHOSEN (unchanged) | Yes, those slots only, when wiring runs |
| M1/M2, UI Art A/C, title/intro v1 | DRAFT / OPTIONS (unchanged) | No |

## Sources used for the research in this batch

- Golden-ratio climax at ~0.618: DubSpot "The Fibonacci Sequence in Music",
  Serenade Magazine "Music and Mathematics: The Fibonacci Sequence".
- Mixing EQ ranges: Gearspace kick/808 and bass threads, Ultimate Metal
  mixing EQ article (kick 60–100 Hz, snare 220–260 Hz / 5–6 kHz, bass
  50–100 Hz, guitars 2–5 kHz), NumberAnalytics mastering EQ table.
- GBA m4a method: pokeemerald-expansion Audio System (M4A) DeepWiki
  (mid2agb, voicegroups, DirectSound samples), PokeCommunity Magnius guide
  (voicegroup per song, per-track balance in the MIDI editor).
- Waveform analysis: measured locally from the v2 WAVs with Python (per-bar
  RMS/peak, listed above), not estimated.
