# CRY SYNTH — Teardown #2: Cry Synthesis

**Sideline D, teardown 2 of 3.** How the classic games made a
different voice for every species *without recording anything* —
and our native equivalent. Deliverables: this spec, the reference
renderer `tools/cry_synth.py` (Python, stdlib only), the pilot-six
parameter blocks `tools/pilot_six_cries.json`, and the wiring patch
`species-sheet-schema-patch-cry.md` (+ `cry-schema-fragment.json`)
that puts the cry recipe on every species sheet.

Voices are PURE CRIES AND SOUNDS ONLY (voice law) — this system
synthesises cries; it has no speech capability and no text input,
by design.

---

## 1. What the teardown found

### 1.1 Generation I–II: a small pool of base cries, parameterised

The Game Boy has no sample playback worth the name for this job;
its sound chip offers two pulse channels (with duty-cycle control),
one wave channel (a programmable 32-step, 4-bit waveform), and one
noise channel. The Gen I games build every species' cry from those
channels, scripted through the music/SFX engine, and the numbers
show how far parameterisation stretches:

- **151 species, only 37 completely different base cries** in
  Gen I (Bulbapedia, Cry). Species sharing a base cry are made
  distinct by **pitch, speed/length, echo, and disabling one of
  the sound channels**. Two pairs ended up exactly identical
  (Charizard/Rhyhorn, Poliwag/Ditto) — the failure mode of the
  system, and a useful warning for our own QA.
- Per species, the stored data is a tiny table entry — a
  **(base cry, pitch, length)** triple. Gen I keeps these as
  byte-range values in a `CryData` table indexed by species.
- Gen II adds 30 new base cries and formalises the entry in the
  pokecrystal decomp: the `PokemonCries` table, **6 bytes per
  species — three 16-bit words: base cry, pitch, length**
  (`MON_CRY_LENGTH = 6`). The worked example the whole system can
  be understood by: one evolutionary family, one base cry, three
  settings of the two knobs —

  | Species | Base cry | Pitch | Length |
  |---|---|---|---|
  | Bulbasaur | CRY_BULBASAUR | $080 | $081 |
  | Ivysaur | CRY_BULBASAUR | $020 | $100 |
  | Venusaur | CRY_BULBASAUR | $000 | $140 |

  Growing up = same voice, lower pitch, longer body. That rule —
  **family shares the base, individuals differ in pitch/length** —
  is the single most valuable design pattern in this teardown,
  and it is adopted as a house rule in the schema patch.
- The base cries themselves are little multi-channel scripts (a
  header plus per-channel note data) run through the standard
  audio engine, which supplies the expressive machinery: pitch
  slides, vibrato (delay/rate/depth), volume envelopes, and the
  loadable wave samples of the wave channel.

### 1.2 Generation III onward: samples replace synthesis

From Gen III the cries are digitised sounds played through the
GBA's Direct Sound channels (birds chirping, a xylophone, and so
on for new species; the Gen I–II electronic cries were largely
carried forward). The parameter idea survives the transition:
playback is still per-species adjusted (Gen III famously plays
its samples at 0.9× speed; later engines expose pitch/length/
release/reverse/chorus as named playback modes, e.g. the
weakened-cry and faint-cry modes), and low-HP/status states pitch
the cry down. But the *authoring* model changed from recipe to
recording — which is why this teardown builds our system on the
Gen I–II model: **a roster of thousands cannot be recorded; it
can be parameterised.**

### 1.3 What the dex does with a cry

The Gen III dex CRY subscreen plays the species' cry while
drawing its **waveform** and a **volume/pitch meter** — the cry
is presented as data the keeper can inspect, not just a sound
effect. Our Mochiioteca inherits the presentation: cry playback
on the card, parameters visible on the sheet.

---

## 2. The native system — CRY SYNTH

### 2.1 Model

A cry is rendered from the species sheet's `cry.synth` block
(schema: `cry-schema-fragment.json`; wiring:
`species-sheet-schema-patch-cry.md`). The renderer takes:

- **two base voices** (`wave_a`, `wave_b`) from a small native
  waveform library — `sine`, `triangle`, `saw_soft`, `pulse12`,
  `pulse25`, `pulse50`, `pulse_pwm` — with a `morph` crossfade
  between them across the cry (our stand-in for the GB's
  multi-channel scripts: several channels, one voice);
- a **pitch envelope** — [time, semitones] keyframes over
  `base_hz`. Bounces, chirps, mewls and falls are all *drawn*
  here; this is the species' melodic signature;
- an **amplitude envelope** — [time, level] keyframes. Pulses
  and gaps (chirps) live here;
- **vibrato** (rate/depth/delay), **tremolo** (throat pulses —
  the croak knob), **PWM** duty sweep (reedy/throaty pulse
  voices);
- a **noise component** (`noise_mix`, `noise_tone`) — lowpassed
  white noise for breath, the stand-in for the GB noise channel;
  plus **crackle** (sparse pops) for fire-adjacent species;
- **echo** (delay/decay/repeats) — straight from the Gen I
  differentiator list;
- a **seed**, so noise is reproducible render-to-render.

Output: mono 16-bit WAV at 22050 Hz, peak-normalised to 0.85,
anti-click faded. File sizes are repo-class (≈24–71 KB for the
pilot set).

### 2.2 Renderer

`tools/cry_synth.py` — stdlib only (`math`, `random`, `struct`,
`wave`, `json`). Pure functions, no globals; `render_cry(params)`
returns samples, `render_set(map, dir)` renders a whole roster
file. The parameter file format is exactly the sheet format:
`{ "<slug>": { "synth": { ... } } }`.

### 2.3 Pilot six — parameters drafted to the locked identities

SHOW-BIBLE §4 identities are the brief; parameters in
`tools/pilot_six_cries.json` (all `status: draft` — owner locks):

| Species | Identity (canon) | How the parameters make it |
|---|---|---|
| Mochii | bouncing squeak-cry | pulse25→triangle, 740 Hz; pitch_env hops +5/+6/+7 st in three bounces locked to amp pulses — a squeaky metronome |
| Dorowani | low steady croak | pulse_pwm at 118 Hz, slow duty sweep 0.18→0.45 + 17 Hz tremolo = throat pulses; near-flat pitch, slight sag |
| Gabu | foghorn bellow | saw_soft→triangle at 82 Hz, long swell amp_env (1.6 s), pitch settling +1.5 st → −2.2 st, breath at the edges |
| Kittember | thin mewl (+ warm crackle) | triangle→sine at 980 Hz, rise-then-long-fall mewl contour (+3 st → −6 st), late vibrato; `crackle: 0.5` tucks fire pops under the voice |
| Sproutle | soft chirps | sine at 1560 Hz; amp_env written as three separated chirps with silent gaps; gentle pitch dips |
| Wispkin | whisper-wail | sine→triangle at 523 Hz with a slow **minor fall** (+3 st → −7 st), `noise_mix: 0.45` breath carrying it, one faint echo repeat — soft, breathy, receding |

### 2.4 Test results (this package, `test-output/cries/`)

All six rendered successfully with the stdlib renderer:

| File | Duration | Peak | RMS | Zero-crossing F0 estimate* |
|---|---|---|---|---|
| mochii-cry.wav | 0.55 s | 0.85 | 0.494 | ~885 Hz (base 740 × bounce env) |
| dorowani-cry.wav | 0.85 s | 0.85 | 0.450 | ~120 Hz (base 118) |
| gabu-cry.wav | 1.60 s | 0.85 | 0.335 | ~145 Hz (harmonics over 82 Hz base) |
| kittember-cry.wav | 0.70 s | 0.85 | 0.262 | ~1035 Hz |
| sproutle-cry.wav | 0.65 s | 0.85 | 0.251 | ~1770 Hz (1560 × +2 st) |
| wispkin-cry.wav | 1.40 s | 0.85 | 0.207 | n/m — breath noise dominates the estimator; tonal centre is the 523 Hz fall |

\* Rough loudest-window zero-crossing check, run as a sanity gate
(harmonic-rich and noisy voices inflate it; quoted so the numbers
are checkable, not as measurements of record). Files: 24–71 KB
each, 264 KB total for six.

### 2.5 Wiring

- Sheet: `cry` block per `species-sheet-schema-patch-cry.md` —
  **a sheet is incomplete without it** (pipeline step 5, Brief §5).
- Game data: same block lands in `src/data/core/species.json`
  (two-lane law).
- Rendered WAVs go to the home the EP01 cue sheet already
  references: `public/audio/cries/<slug>-cry.wav`.
- QA rule from the teardown's failure mode: renders are checked
  pairwise for near-identity (two species must never ship the
  Charizard/Rhyhorn accident) — cheap RMS/correlation pass when
  the roster render is run in batch.

## 3. Coverage — honest statement

- **Fully documented, relied on:** the (base, pitch, length)
  parameterisation and the 37-base-cry figure (Bulbapedia);
  Gen II's 6-byte table and the evolutionary-family example
  (pokecrystal docs); the engine machinery available to base
  cries (vibrato, pitch slide, wave samples — pokecrystal /
  pinball-decomp audio docs); the Gen III shift to samples and
  the 0.9× playback quirk (Bulbapedia).
- **Documented at summary level:** Gen I's exact per-entry byte
  widths (the surviving tables show byte-range values; Gen II's
  formalised 3×16-bit entry is the one quoted precisely).
  Nothing in our spec depends on Gen I's stride.
- **Not attempted:** reproducing any actual base cry. CRY SYNTH's
  waveform families are our own; no game audio, ripped or
  transcribed, is used or needed. Later-generation playback-mode
  tables (faint/weak/echo variants) are noted as a pattern for
  future *state variants* of a cry (healthy/weak/faint renders
  from one block by pitch/length offsets) but are not built here.
