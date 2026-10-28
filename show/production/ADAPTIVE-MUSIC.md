# ADAPTIVE MUSIC — sequenced-engine teardown → Mochiichao stem-layer system

List-2 teardown #13 (audio & timing cluster). Native spec: every rule
below is our own system, written for this show. The teardown half
studies *how the formats work* from public documentation; nothing is
copied — no game music data, no melodies, no assets. Composition stays
what it already is in canon: the owner's title track and its mixer
stems (`public/audio/mochiichao-title-v3.wav`,
`public/audio/mixer/mixer-title-*.wav`, per `EP01/CUE-SHEET.md`).

Companion systems this wires into (all already in the repo):

- **LIVING-WORLD.md** — the WIND-STATE global (§2.1 C3:
  `WIND ∈ {CALM, BREEZE, GUST}` drives picture cycles *and* the wind
  audio bed from one parameter), the BED catalogue (§2.4:
  `BED-[LOC]-[TIME]`, layered BED + FOLEY + SPOT under the
  music/cries), and the Dark Forest rule (§2.1 C6 / §2.4
  `BED-FOREST-DAY`: engineered absence — no birdsong from inside,
  near-silence with edges).
- **CREDITS-TO-TOOLS.md / TOOLS-MANIFEST.md** — music desk is LMMS +
  MuseScore (both installed/verified) extending the owner's title
  track + stems; **Ardour** is the wired DAW for stem/automation work
  (GPL-2.0+; FULLSTACK-WIRING §8: owner-side human mix pass, scripted
  loudnorm finish remains the deliverable path).
- **Finish law** — every scene ships at **−14 LUFS integrated /
  −1 dBTP** (cue sheet + TRIPPEDD finish spec; Scene 4's shipped bed
  measured −14.44 / −1.00, gates PASS).

---

## PART 1 — THE TEARDOWN: how sequenced game music is built

Classic game music engines (the Game Boy / SNES / GBA generation the
Pokémon scores were written for, documented openly by the
decompilation community and hardware references) share one
architecture, and it is a *format* architecture, not a recording
architecture:

1. **Fixed channels, assigned roles.** A track is a small fixed set of
   monophonic channels (e.g. two pulse channels, one triangle, one
   noise on the GB). The composer writes one line per channel; harmony
   is what the channels add up to. Channels have standing roles —
   bass on the triangle, melody on a pulse, noise as percussion —
   because there are never enough to waste.
2. **Pattern data, stepped by a clock.** Music is stored as note
   streams (pitch, length, instrument/envelope commands) advanced by
   a tempo clock, not as audio. A "song" is a few KB of instructions.
3. **Intro + loop body.** Nearly every track is an intro section that
   plays once, then a body with an explicit loop point that repeats
   forever. The loop point is part of the format, marked in the data.
4. **Envelope/vibrato/duty commands inline.** Expression lives in the
   stream as commands (volume envelopes, vibrato, duty/sample swaps),
   so a single channel can articulate without more channels.
5. **SFX contend for the same channels.** Sound effects steal
   channels from the music while they play, then hand them back —
   which is why game scores are written to survive holes, and why a
   sting is a *channel event*, not a mix event.
6. **State changes are structural.** Battle/town/danger variants are
   separate sequences or the same sequence re-instrumented; the engine
   switches at phrase boundaries, never mid-note.

Modern adaptive audio (the middleware generation: vertical remixing
and horizontal re-sequencing, as documented publicly by Wwise/FMOD
practice) keeps the same skeleton and moves it up a level:

- **Vertical layering** — the track is recorded as simultaneous stems;
  state changes are *gain maps over the stems* with crossfades.
- **Horizontal branching** — different segments (explore/battle) swap
  at bar-quantised boundaries; transitions are written rules, not
  edits.
- **Event stingers** — one-shots fired over the loop, the direct
  descendant of channel-stealing SFX.

**What Mochiichao takes from this** (the kit, not the content): fixed
stem roles, an explicit loop point in every underscore stem, a state
table that maps story state → stem gains, bar-quantised transitions,
and event stingers for cries/beats. Our stems are the owner's own
music; the engine discipline is the borrowed part.

---

## PART 2 — THE NATIVE SYSTEM: `MUS` stem layers + `SCORE-STATE`

### 2.1 Stem layers (fixed roles, channel-engine discipline)

Every underscore cue in the show is built from up to six loop stems
plus an event lane. A stem that a cue doesn't use is *absent from the
cue's manifest*, never muted-and-forgotten (channel discipline: you
only get the channels you wrote for).

| Layer | Role (channel ancestor) | Content in Mochiichao terms |
|---|---|---|
| `MUS-PULSE` | Noise/percussion channel | Beat, ticks, heartbeat-class pulse; the tension clock |
| `MUS-BASS` | Triangle/bass channel | Foundation line. **Exists in canon:** the title bass stem (Scene 4 bed: bass at −8 dB reference) |
| `MUS-HARM` | Pad/organ channel | Harmony bed. **Exists in canon:** the title organ stem (Scene 4 bed: organ at −11 dB reference) |
| `MUS-LEAD` | Pulse melody channel | Title melody or a location colour lead; the layer the audience hums |
| `MUS-TEXT` | Arp/sparkle channel | Texture: arpeggios, shimmer, insect-class musical sparkle; density is a state variable |
| `MUS-DRONE` | (Modern addition) | Sub/dissonant sustain for dread; the only layer allowed anywhere near the Forest |
| `EVENT` | Channel-steal SFX | Non-looping: cries, `SFX-COLDSPOT-01`, action-beat hits, subtitles' silence. Events duck stems per §2.4, they never join the loop |

Loop law (audio twin of LIVING-WORLD C2's prime-length rule): every
loop stem is written intro + loop-body with the loop point declared
in the manifest, and loop lengths across the layers of one cue are
non-commensurate bar counts (e.g. 4 / 5 / 7 bars), so layered loops
never phase-lock into an audible pattern. The bed layer underneath
follows its own law already (60–120 s seamless source loops,
LIVING-WORLD §2.4).

### 2.2 `SCORE-STATE` — the music half of the world-state globals

Picture has `WIND-STATE`; beds key off it (LIVING-WORLD §2.4 wind
coherence). Music gets one sibling global, marked per scene on the
board exactly as wind-state is:

```
SCORE-STATE ∈ {SETTLE, PLAY, TENSION, DREAD, ABSENCE}
```

A score-state is a **stem gain map + transition rule**, nothing more:

| State | PULSE | BASS | HARM | LEAD | TEXT | DRONE | Meaning |
|---|---|---|---|---|---|---|---|
| SETTLE | −∞ | −8 | −11 | −∞ | −18 | −∞ | Ceremony, calm, the world at rest (cf. Scene 1 cut 05: wind dies for the Manual read — music thins the same way) |
| PLAY | −14 | −6 | −9 | −7 | −12 | −∞ | Default garden life; full but light |
| TENSION | −10 | −8 | −11 | −∞ | −∞* | −∞ | Stakeout register — *TEXT is withdrawn progressively, see the emptying rule §2.3 |
| DREAD | −16 | −14 | −∞ | −∞ | −∞ | −12 | Depths and approaches; pulse slows (tempo map may drop), drone enters |
| ABSENCE | −∞ | −∞ | −∞ | −∞ | −∞ | −∞ | The Forest rule. No underscore at all — bed only, and the bed is an absence with edges |

(Gains in dB relative to the cue's reference mix; −∞ = stem absent.
Reference anchors are Scene 4's shipped values: BASS −8 / HARM −11.)

**Transition rules (horizontal discipline):** state changes take
effect at the next bar boundary after the marked frame; crossfade =
1 bar at PLAY↔SETTLE, 2 bars into DREAD, **zero bars out of
ABSENCE** — nothing fades *into* the Forest, it is simply already
silent, and the first stem after a Forest cut enters at a bar line
with no swell (the return of music is itself a story beat and is
boarded, not automated). One exception, inherited from LIVING-WORLD
§3.3: a scripted EVENT may cut the bed −6 dB momentarily (cut 18's
wail duck) — events outrank states.

### 2.3 The emptying rule (TENSION's signature behaviour)

Canon precedent, LIVING-WORLD §3.3: `BED-POND-DUSK` *empties* across
cuts 13–15 — the insect layer thins as tension rises; "the bed
*empties* as tension rises" (cue/bed spec). The music system adopts
the same move as a written rule, not an improvisation: under
TENSION, one layer is withdrawn per cut in fixed order
`TEXT → LEAD (already out) → PULSE density halves → HARM thins to a
single sustained voicing`, each withdrawal at a bar boundary, each
noted in the scene's stem manifest. Picture, bed and score all drain
together — the audience feels one event, not three mixes.

### 2.4 Events and ducking

- Cries are EVENT-lane: they sit *over* the stems (they are the
  cast), with stems ducking −3 dB under a principal cry, −6 dB under
  a scripted wail/subtitle beat (cut 18 precedent).
- `SFX-COLDSPOT-01` is a Takeover-class designed sound (LIVING-WORLD
  §2.4); when it sounds, LEAD and TEXT are cut for its duration —
  the cold spot silences the music's bright layers the way it stops
  the grass (cut 09: WIND → CALM in one beat; the score does the
  same).
- Action beats (cut 14's lunge) are stingers: `EVENT` hit + the cry,
  stems uncut — action is the world at full volume, dread is the
  world draining.

### 2.5 Wiring into the build manifest

Following LIVING-WORLD Part 4's precedent (per-cut `wind_state`,
`ambient`, `population`, `bed`, `sfx_spots`), the build-manifest
compiler gains two per-cut fields:

- `score_state: SETTLE|PLAY|TENSION|DREAD|ABSENCE`
- `stems: <path to the scene's stem manifest>` (one per scene, §3)

A cut whose `score_state` is ABSENCE must have `stems: null` and a
bed from the Forest family — the gate can check this mechanically,
the same way Forest cuts invert the frame-diff check.

---

## PART 3 — THE STEM MANIFEST FORMAT (Ardour-consumable)

One JSON file per scene, living beside the scene's audio bed. It is
the single document the mix is built from: the scripted pipeline
reads it for the loudnorm finish, and an Ardour session is built
from it directly — tracks created in manifest order, one track per
stem + bed + event lane, session markers at every event and state
change, loop points set from `loop` fields. (Ardour consumes it via
its session/import + Lua/OSC surface per FULLSTACK-WIRING; the
deliverable still comes out of the scripted −14 LUFS finish so mixes
stay reproducible.)

```jsonc
{
  "format": "mochiichao-stems/1",
  "scene": "EP01-SCENE-04-pond-dusk",
  "finish_target": { "integrated_lufs": -14.0, "true_peak_dbtp": -1.0 },
  "grid": { "bpm": 0, "bar_seconds": 0.0, "note": "0 = free-time cue; transitions use crossfade_seconds instead of bars" },
  "bed": { "id": "BED-POND-DUSK", "file": "EP01-SCENE-04-pond-dusk.wav (bed portion)", "gain_db": -30.0,
           "automation": [ { "over_cuts": ["13","14","15"], "param": "insect_layer_gain", "shape": "emptying, see ADAPTIVE-MUSIC §2.3" } ] },
  "stems": [
    { "layer": "MUS-BASS", "source": "public/audio/mixer/mixer-title-*.wav (the bass stem; exact filename to verify against the game repo at landing — cue sheet gives the glob)",
      "loop": { "intro_seconds": 0.0, "loop_body_seconds": 0.0 },
      "gain_by_state": { "TENSION": -8.0 } }
  ],
  "states": [ { "cut": "13", "score_state": "TENSION" } ],
  "events": [
    { "at_s": 24.0, "lane": "EVENT", "what": "gabu-cry.wav", "role": "lunge sting", "duck_db": -3.0 }
  ],
  "terabox": { "stem_masters_home": null, "note": "rendered stem WAVs, when they outgrow the repo, stage on TeraBox per STAGING.md; manifests always live in-repo" }
}
```

Field rules: `file` paths are repo-relative when the file is
repo-resident (title stems are), TeraBox paths otherwise with the
SHA-256 recorded in the manifest at staging time. `gain_by_state`
only lists states the cue actually visits. Every event carries the
cry/SFX ID from the existing catalogues (`public/audio/cries/…`,
LIVING-WORLD §2.4 SFX IDs) — the manifest never invents a sound.

---

## PART 4 — STATE TABLE: location × time

Defaults per location×time. **CANON** = established in a shipped doc
or bed. **DERIVED** = produced by applying the state's rules to a
location whose bed exists but whose score treatment is not yet
boarded — a template for the board pitch, not a silent fill.
**—** = no bed/canon exists; the board creates it, this table does
not. The Dark Forest depths row is **PROPOSED** (flagged, owner/board
call): memory canon gives the Forest "mist/humming surface, dread in
its depths"; no shipped doc yet scores the depths separately.

| Location × time | Bed (LIVING-WORLD §2.4) | SCORE-STATE | Active stems | Wind coupling | Status / notes |
|---|---|---|---|---|---|
| GATE × morning | BED-GATE-MORNING | PLAY → SETTLE at cut 05 | BASS, HARM, TEXT; LEAD enters with title tail only | TEXT density + bed wind follow WIND (BREEZE, one GUST at cut 04, CALM at 05) | CANON (Scene 1 bed exists; LIVING-WORLD §3.1 wind arc BREEZE→GUST→CALM) |
| GATE × day | (BED-GATE-MORNING family) | PLAY | BASS, HARM, LEAD, TEXT | Full wind coupling | DERIVED — no day scene boarded yet |
| GATE × dusk | — | SETTLE | BASS, HARM | Wind thins with light | — no Gate dusk bed exists |
| GATE × night | BED-GATE-NIGHT | SETTLE | BASS (sparse), HARM | Bed *is* the beat (cut 21 cricket beat); music stays under it | CANON (Scene 5 bed exists) |
| GREEN (Garden) × morning | (BED-GREEN-DAY family) | PLAY | Full set | Grass-wave cycle and TEXT share the wind | DERIVED |
| GREEN × day | BED-GREEN-DAY | PLAY | Full set; LEAD at −7 | WIND-STATE audible in bed and TEXT alike | CANON bed; score treatment DERIVED |
| GREEN × dusk | — | SETTLE | BASS, HARM | — | — |
| GREEN × night | — | SETTLE | BASS sparse | — | — (Garden at night is Wispkin's beat; no bed yet — board creates) |
| POND × morning | (BED-POND-DAY family) | PLAY | BASS, HARM, TEXT (water sparkle) | Reed rustle in bed keys to gusts; TEXT follows | DERIVED |
| POND × day | BED-POND-DAY | PLAY | Full set | As morning | CANON (Scene 2 bed exists) |
| POND × dusk | BED-POND-DUSK | TENSION (emptying §2.3) | BASS −8, HARM −11; LEAD/TEXT absent or withdrawn | Mist stills as wind dies | **CANON — worked example, Part 5** |
| POND × night | — | DREAD-lite → board call | DRONE enters only if boarded | — | — no Pond night bed; do not assume |
| DARK FOREST × day (surface) | BED-FOREST-DAY | **ABSENCE** | none | Wind refuses: no wind layer in bed, no TEXT | CANON (Stinger bed exists; LIVING-WORLD §3.4 anti-application) |
| DARK FOREST × dusk | BED-FOREST-DAY family | **ABSENCE** | none | As day — the Forest does not do dusk | DERIVED from the ABSENCE rule |
| DARK FOREST × night | BED-FOREST-DAY family | **ABSENCE** | none | As day | DERIVED from the ABSENCE rule |
| DARK FOREST — DEPTHS (any time) | BED-FOREST-DAY, lower (−6 dB, garden sounds behind camera removed) | **ABSENCE**, with one exception: a single MUS-DRONE entry is *permitted if boarded* — never looped under dialogue, never with a melody | DRONE at most | None — depths have no weather | **PROPOSED** — extends the surface rule by one layer; needs owner/board lock before use |

Reading rule for the whole table: ABSENCE is not "quiet music." It
is the same engineered absence as the Forest bed and the Forest's
zero frame-diff gate — the score's silence is a place's identity,
and it is what makes six minutes of living garden music worth
spending everywhere else.

---

## PART 5 — WORKED EXAMPLE: Pond × dusk (EP01 Scene 4, shipped bed)

The full filled manifest ships with this teardown as
[`stems-ep01-scene-04.json`](stems-ep01-scene-04.json); summary:

- **Cue:** cuts 13–18, 64 s, Pond at dusk — stakeout → lunge → flare
  → gag reveal → Wispkin reveal → the wail + SUBTITLE 1.
- **Bed:** `BED-POND-DUSK` with the §2.3 emptying automation over
  cuts 13–15 (insect layer thins; population withdraws with it,
  LIVING-WORLD §3.3).
- **Stems (canon, from the shipped bed's gate record):** title
  `MUS-BASS` at −8 dB + `MUS-HARM` (organ) at −11 dB — "dusk
  stakeout register." No LEAD, no TEXT: the stakeout has no melody
  because nobody in it is relaxed enough to hum.
- **Events (bed-file timeline, gate-verified):** Gabu cry lunge
  sting 24.0 s (ACTION BEAT A) · Kittember cry at the tail-flame
  flare 34.0 s · Sproutle cry at the silhouette-gag reveal 38.5 s ·
  Wispkin soft cry into the reveal/wail 45.0 s, with the §2.4 −6 dB
  bed duck under the wail (cut 18).
- **Finish:** measured −14.44 LUFS / −1.00 dBTP against the −14 / −1
  target — gates PASS. The gate history is part of the example: the
  sparse first mix measured −19.7 LUFS and could not be gained up
  (cry peaks pinned true-peak), so the *stems were raised in the
  manifest* and the finish re-measured — the manifest is where mix
  decisions live, so this is the system working as designed.

---

## Coverage notes (honesty)

- The channel-engine teardown (Part 1) is a summary of publicly
  documented format architecture (hardware references +
  decompilation-community documentation of how the data is laid
  out); it was not re-derived from a fresh ROM/decomp read in this
  pass, and it deliberately stays at architecture level.
- The Ardour consumption route is a *format design*: the manifest is
  plain JSON any DAW session-builder can read, and Ardour's role is
  as wired in FULLSTACK-WIRING. An automated Ardour session build
  from a stem manifest has not been run yet; first proof = rebuild
  Scene 4's bed v2 from `stems-ep01-scene-04.json`.
- Locations/times marked DERIVED or PROPOSED above are templates and
  flags, not canon. Depths scoring in particular waits on an owner/
  board decision.
