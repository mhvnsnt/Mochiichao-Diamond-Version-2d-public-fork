# Mochiichao main music theme (Mars, 2026-10-26 — standing)

The main music theme for the whole game is: **hip hop + hyperpop + digicore,
with rock and metal mixed in sometimes, and anime soundtrack type music.**
This is the genre identity every track branches from — title, intro, main menu,
and every future track Mars directs. Digicore here means the hyperpop
microgenre: an exaggerated take on popular music drawing on electronic, hip hop,
and dance (the NTS digicore guide lists Deko's PHANTASY STAR ONLINE ft. Yameii
alongside Jane Remover, 100 gecs, Glaive, ericdoa, and midwxst). Anime
soundtrack means the anime-opening feel: big hooks, bright pitched-up vocals,
dreamy space, dramatic builds. Rock/metal is a spice, not the base — it comes
in on tracks where Mars asks for it (like the heavy distorted guitar already
in the official title/intro v3), never as a replacement for the hip-hop /
hyperpop / digicore core.

# Mochiichao Music Themes — reusable theme registry

Mars, 2026-10-25: save the themes we made, because we are going to make
more music like them, branch all these themes into different genres, and
continue working in these directions and on top of these.

This file is the registry. A "theme" here is not just a WAV file — it is
the whole recipe that made it: key, tempo, chord progression, layers,
golden-ratio placement, mix chain, and loop behaviour. A future track
starts by copying a theme below and changing only what its genre needs,
then gets its own version number and its own spec — it never overwrites
the theme it branched from.

## Theme 1 — Title / Intro (official)

- Mood: cinematic, harbour-dawn, rock + synth + hip-hop, dark organ.
- Key: D major. Title tempo 140 BPM, intro tempo 120 BPM.
- Title form: 24 bars, 41.143 s, loops. Intro form: 12 bars, 24.000 s,
  one-shot, ends on A (dominant) → title D (tonic).
- Title layers: lead, counter, pad, strings, brass, bass, harp, drums,
  plus distortion guitar, saw synth, synth brass, church organ, sub-bass,
  hip-hop drums (v3).
- Intro layers: lead (10 long notes only), pad, strings (phrase 2),
  bass pulse, harp (phrase 2), hat (bars 9+), plus rap bass/drums/guitar
  in phrase 2 (v3).
- Golden ratio: title phi bar 15 (0.618 × 24), intro phi bar 8 (0.618 × 12).
- Mix: stem mix, EQ slotting (bass low, guitars 3 kHz, snare 5 kHz,
  organ dark), compressor -18 dB 2:1, limiter 0.89, 0.2 s end fade.
- Files: `public/audio/mochiichao-title-v3.wav` (OFFICIAL),
  `public/audio/mochiichao-intro-v3.wav` (OFFICIAL).
  Production: `tools/music-production/compose_v2_midi.py`,
  `compose_v3.py`, `render_mix_v3.sh`. Specs: `docs/title-music-v3-spec.md`,
  `docs/game-music-production-conversation.md`.
- Branch from this theme for: other cinematic / story tracks, boss or
  finale music, any track that needs a climax + resolve shape. Keep the
  D-major / 140-120 BPM / phi-bar method; change the melody, not the method.

## Theme 2 — Main Menu (draft, wired for testing)

- Mood: bright, bouncy, pop / hyperpop / Y2K J-pop / American pop /
  rap hip-hop. Sugary hook + abrasive 808 + glossy synths, on purpose.
- Key: A major. Tempo 144 BPM (hyperpop 120–160, Y2K electro 128–144).
- Form: 16 bars, 26.667 s, LOOPS. Loop point V → vi (bar 16 E → bar 1 F#m),
  a deceptive turn that keeps rolling instead of stopping.
- Chords: Komuro vi–IV–V–I (F#m–D–E–A) as the backbone, with a pop
  I–V variation in bars 11–12. Add9 shimmer on A/D pads
  (Aadd9 = A+C#+E+B, Dadd9 = D+F#+A+E).
- Layers: saw hook synth (short catchy phrases, glitch stutter into the
  loop), pop piano eighth stabs, add9 pad, 808 sub-bass (syncopated +
  octave pops), drums (four-on-floor kick, snare + clap on 2/4, hats
  eighth in A / sixteenth in B, crash + 32-step roll at phi).
- Golden ratio: phi bar 10 (0.618 × 16 = 9.89) — crash, hat roll, highest
  hook note C#6.
- Mix: stem mix (melody / bass / drums), bass lowpass 250 Hz vol 1.15,
  drums +2 dB at 5 kHz, compressor -16 dB 3:1, limiter 0.89, 0.2 s end
  fade. Deliberately quieter than title (peak 0.64 vs 0.88) so it sits
  behind menu browsing.
- Files: `public/audio/mochiichao-main-menu-v1.wav` (DRAFT, wired).
  Production: `tools/music-production/compose_main_menu.py` + stem MIDIs.
  Spec: `docs/main-menu-spec.md`.
- Branch from this theme for: shop, PC, bag, garden, or any menu / hub
  music; other pop-leaning area tracks; any track that needs a short,
  bright, looping hook. Keep the 144 BPM / Komuro / phi-bar-10 / stem-mix
  method; change the hook and the genre seasoning (more trap hats for
  rap, more arps for Y2K, more distortion for hyperpop).

## How to branch a theme (rules, from this production's history)

1. Copy the theme's compose script and stem layout; do not edit the
   original theme's WAV, MIDI, or spec in place.
2. New track = new files (new WAV name, new spec, new version number).
   Old versions stay as drafts/options unless Mars names a deletion.
3. Keep the golden-ratio method: phi bar = ceil(0.618 × total bars),
   fullest hit on that bar. State the bar number and the math in the spec.
4. Keep the Pokemon-GBA method: MIDI tracks, one voice per track, fixed
   voicegroup, loop at a bar boundary, per-track balance before render,
   no reverb wash unless a genre explicitly needs it (and then say so).
5. Verify before any PR: duration = exact bar multiple, 44,100 Hz,
   stereo, 16-bit, first/last sample 0, peak under the limiter, per-bar
   RMS/peak measured, playable jsDelivr link checked (audio/wav, 200).
6. Drafts are shown to Mars first (playable links, not downloads).
   Nothing is marked official, and nothing is wired as final, until he
   says so in his own words. Title/intro v3 are the only official tracks
   at the time this registry was written; main menu v1 is a draft.

## Themes still to come (not built yet, listed so they do not get lost)

- World / field, town, battle, boss, shop, garden, dungeon, and other
  area tracks — each to branch from Theme 1 or Theme 2 (or a new theme
  Mars directs), with Mars giving the artistic/production direction for
  producing and orchestrating all of it, as he said on 2026-10-25.
- No theme, track, or genre below is claimed as built until its WAV,
  spec, and PR exist. This registry is a plan + a record, not a promise.
