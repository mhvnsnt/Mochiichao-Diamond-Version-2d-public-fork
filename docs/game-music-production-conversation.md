# Game Music Production Conversation — Title & Intro (Mochiichao)

This is the production record for Mochiichao's title and intro music, kept in
the repo so the decisions, the feedback, and the method survive the chat.
It is a summary of the conversation and the work, in order — not a raw chat
dump, and not a claim about work that did not happen. Dates are 2026-10-25,
America/Chicago, Title Music lane.

## The standing rules Mars set for this work

- Pokemon-first: build from the real game files first, then build Mochiichao
  on top of that structure. Log as: Pokemon element → Mochiichao replacement
  in that exact spot → HAVE / NEED TO MAKE. No hand-tooled UI/sound patterns
  outside that flow unless Mars asks for that exact pattern in his own words.
- Percentages always: when listing what is not done, give a percentage with
  the count behind it (e.g. 7/16 = 44%), never just "not done".
- Audio delivery: if audio is sent, send playable live links, not download
  links and not in-chat attachments (in-chat audio never worked for Mars).
  Verified route: jsDelivr CDN links to merged repo files return
  `Content-Type: audio/wav` with no attachment header, so browsers play inline.
- Show-first + keep working: anything needing Mars's confirmation must be
  shown to him first, and confirmation items must never block other work —
  keep building everything else to 100% in parallel.
- Use real tools: pull any open source, use any tools available, use anything
  from the actual Pokemon game files that can legally be used. Do not
  hand-tool a cheap version.
- Original only: no Pokemon music, no Pokemon cries, no copied melodies.
  Structure from the decomps is allowed; notes, melodies, and samples are not.

## v1 — built, merged, rejected as not good enough

Mars's order: get title/intro music done, original compositions only, CC0
reference first (hyperpixel, Tallbeard), Quillbit/Vacuous only with credit.
Study Pokemon title music structure from the decomp files.

What was built (PR #36, merged): 6 files, 0 deletions.
- `public/audio/mochiichao-title.wav` — "Harbour Dawn", G major, 112 BPM,
  16 bars, 34.286 s loop, 3 voices (square lead + triangle arp + sine bass).
- `public/audio/mochiichao-intro.wav` — "First Light", G major, 96 BPM,
  12 bars, 30.000 s, ends on D → title G.
- Boot options M1 "Data Spark", M2 "Harbour Bell", M3 "Mochii Chirp".
- `docs/title-music-spec.md` with full note lists and the FireRed/HeartGold
  title-screen structure (title starts after title art loads; press Any Key
  → 60-frame / 1.0 s fade out).

Mars's verdict (~20:27 CDT): the title track and intro track "really suck"
and need upgrading. Research how Pokemon actually does title/intro tracks
and build better ones. Save all audio files to the repo as drafts except
for the one he chose.

Correction that same evening (important, do not re-open it): the lane first
told other lanes M3 was the boot sound. Mars clarified he picked BOTH
sounds, in different slots. Final, corrected roles, which still stand:
- BOOT SOUND = UI Art Option B "rising arpeggio"
- PRESS-START SOUND = M3 "Mochii Chirp" (plays on the title screen when you
  press start to enter the main menu)
- M1, M2, title v1, intro v1 = DRAFTS. UI Art A and C are saved as options.

## v2 — real MIDI + real sampler, built from FireRed structure

Research done before composing (structure only, aggregates measured with
mido from the decomp MIDI files in the repo):
- `mus_title.mid`: 140 BPM, 11 tracks (1 meta + 10 musical), 1,249 notes,
  velocities 52–127, steady bars ~35–60 notes/bar, climax bars 22–25 at
  74–89 notes/bar, tail bar 5 notes, one layer enters at beat 9, drum/SFX
  layer enters only at beat 87 (climax).
- `mus_new_game_intro.mid`: 120 BPM, 7 tracks, 24 beats = 6 bars exactly,
  154 notes, several tracks with only 3 long notes each, low pulse tracks,
  one pulse track 85 notes on a single pitch. Sparse by design — not a
  second full song.
- HeartGold/Black 2 title music is SEQ binary, not readable MIDI in the
  decomps, so FireRed MIDI is the readable source. That limit is stated,
  not guessed.

Gap found, in plain words: v1 had only 3 voices, constant velocity, same
density every bar, no percussion, no pad, no counter-melody, no climax.
Pokemon's title has 10 layers, varying velocity, and a late climax with
doubled density. v1's intro was a full 12-bar song; Pokemon's new-game
intro is 6 bars of held chords over a low pulse.

Tooling, authorised by Mars in his own words (~20:49 CDT): install whatever
open-source MIDI samplers and industry-standard tools the Pokemon files
point to, with stuff that passes safety checks. Stack verified working:
FluidSynth 2.3.4 + FluidR3_GM.sf2 (Debian packages, used locally to render
only, NOT shipped), mido in a workspace venv (system pip install did not
persist across sessions), ffmpeg for trimming/fades.

v2 composed (PR #59, merged, 4 files, 0 deletions):
- Title v2: D major, 140 BPM, 24 bars, 41.143 s loop, 8 layers, 808 notes,
  counter enters bar 9, brass + full drums in climax bars 17–20, resolve
  bars 21–24. Peak 24,260/32,767, no clipping (gain 0.5 re-render, trimmed
  to exact bar length + 0.2 s end fade).
- Intro v2: D major, 120 BPM, 12 bars, 24.000 s, lead only 10 long notes,
  ends on A → title D. Peak 23,720.
- `docs/title-music-v2-spec.md`, `docs/title-music-status.md`.

Mars's verdict on v2 (~21:41 CDT): "I like those. You can lock them in as
the drafts but I want to build on them and make them better."

## v3 — layer on v2, mix and master, golden-ratio placement

Mars's v3 order, in his words (paraphrased only where grammar needed it):
add rock guitar, synths, bass and drums (bass + snares), a synthy / rocky /
rap / hip-hop feel, Nosferatu organs, heavy distorted rock guitar, different
orchestrations on top of v2, done through the Pokemon way of making music.
Intro v3: more rap-like, more bass and drums, heavy rock guitar elements,
but not as much of the other stuff as the title. Mix and master them well.
Research how to mix, look at the waveforms and layers, research the
golden-ratio / math equivalent of music — Mars said he does not understand
music theory as much, so explain it plainly.

Research applied:
- Pokemon GBA method: MIDI → mid2agb → `.s` tracks, one voice per track,
  a fixed voicegroup (instrument per track, DirectSound sample or CGB
  waveform), loop at a bar boundary, per-track balance before render,
  no reverb wash. v3 follows that method with a modern sampler; it does
  not claim to fit on a GBA.
- Mixing (frequency slotting): kick bottom 60–100 Hz, bass body 50–100 Hz,
  snare fatness 220–260 Hz + crispness ~5–6 kHz, guitars attack 2–5 kHz,
  hats shimmer 6–8 kHz, cut the 250–800 Hz mud, keep kick and bass out of
  each other's way.
- Golden ratio, plainly: φ = 1.618, 1/φ = 0.618. Put the biggest moment at
  61.8% through a piece. Title: 0.618 × 24 bars = 14.83 → bar 15.
  Intro: 0.618 × 12 bars = 7.42 → bar 8. v3 puts its fullest hit on those
  bars (crash + all layers). This is a placement choice that often feels
  right, not a rule and not lab-proven magic.
- Waveform analysis of v2 (measured, per bar): title A ~0.08 RMS,
  B ~0.11, climax ~0.14, resolve ~0.09, peak 0.74 — headroom existed.
  Intro phrase 1 alternated 0.07/0.11, phrase 2 ~0.11–0.15.

v3 composed (PR #70, merged, 3 files added + status updated, 0 files removed):
- Title v3: v2 base exactly (808 notes) + 580 new notes — distortion guitar
  (GM 30, power chords, eighth chugging, bars 9–24), saw synth (81, doubles
  lead at bar 15 + climax), synth brass (62, bars 9–24), church organ
  (19, bars 15–24), sub-bass (39, bars 9–24), hip-hop drums (syncopated
  kicks, ghost snares, sixteenth hats in climax, crash at bar 15).
  Total 1,388 notes. Stem-mixed (6 stems), compressor -18 dB 2:1,
  limiter 0.89, final fade to sample 0. Verified: 41.143 s, peak
  28,865/32,767 = 0.88, RMS 0.16, A ~0.11 / B ~0.18 / climax ~0.19 /
  resolve ~0.17, bar 15 peak 0.77.
- Intro v3: v2 base + 123 new notes — distortion guitar, sub-bass,
  hip-hop drums only (no organ, no synth, per Mars). Verified: 24.000 s,
  peak 24,228 = 0.74, phrase 1 0.07–0.10, phrase 2 0.16–0.17, bar 8 peak 0.71.
- `docs/title-music-v3-spec.md` with the full research, mix chain, and numbers.

A tool failure during v3 is recorded honestly, not hidden: the stem render
timed out in the tool and then the tool stopped registering new commands
for a while. The render had in fact finished in the background (all 10 stems
+ both mixes on disk at 21:57), and the mixes were verified bar by bar
before any PR — nothing was sent to Mars unverified.

Mars's verdict on v3 (~22:48 CDT): "yeah, those are awesome. Save the way
that we made those into the repo and save the whole conversation and
process into the game music production conversation of the repo and save
those as the official tracks for the title and the intro."

## Official decision (this batch)

- OFFICIAL TITLE TRACK: `public/audio/mochiichao-title-v3.wav`
- OFFICIAL INTRO TRACK: `public/audio/mochiichao-intro-v3.wav`
- v2 title/intro: LOCKED DRAFTS, kept on main, not deleted, not wired as final.
- v1 title/intro, M1, M2, UI Art A/C: drafts/options, kept, not wired as final.
- BOOT: UI Art Option B. PRESS-START: M3. Both chosen, in those slots only.

Playable live links (jsDelivr, audio/wav, verified 200):
- Title v3: https://cdn.jsdelivr.net/gh/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start@main/public/audio/mochiichao-title-v3.wav
- Intro v3: https://cdn.jsdelivr.net/gh/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start@main/public/audio/mochiichao-intro-v3.wav

## What is still NOT done (with percentages, per Mars's rule)

- Wiring official v3 into the playable game: 0/2 = 0%. At the time of this
  batch, live main has NO audio-system file in `src/lib/` and the title
  screen code (`src/components/IntroSequence.tsx`) is owned/edited by other
  lanes, so wiring was NOT done in this batch to avoid clobbering it.
  Wiring is now unlocked by the official decision and is the next explicit
  step: register the two official files, play title on the title screen,
  play intro before it, fade 1.0 s on press-start, and bind the existing
  Settings screen sliders — in its own gate-checked PR, branched from live
  main at that time.
- In-game Web Audio listening test on a live build: 0/1 = 0% (WAVs verified
  locally and via jsDelivr only, so far).
- Full game soundtrack beyond title/intro: 0/48 scenes with real files
  (title/intro lane only).

## Production files in this repo (this batch)

- `tools/music-production/` — `compose_v2_midi.py`, `compose_v3.py`,
  `render_mix_v3.sh`, `README.md`, v2/v3 MIDI files, all 10 stem MIDI files.
  Rebuild from these, in the order in that README.
- `docs/title-music-spec.md` (v1), `docs/title-music-v2-spec.md`,
  `docs/title-music-v3-spec.md`, `docs/title-music-status.md` (authority
  for chosen vs draft vs official), and this file.
- Rendered WAVs in `public/audio/`: v1, v2, v3, boot M1/M2/M3, UI Art A/B/C.
