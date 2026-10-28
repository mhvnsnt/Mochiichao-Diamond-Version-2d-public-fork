# #72 — SAMPLE-INSTRUMENT CONSTRUCTION → Mochi instrument bank for MUS

**Teardown (public documentation).** Two eras, one discipline.
*Hardware era:* classic game "instruments" are not recordings but
**parameter sets** — a waveform/duty choice, an ADSR-style volume
envelope, vibrato depth/rate, and (on sample channels) a short looped
waveform with a declared loop point; a whole score's instruments fit
in a table because each is a dozen numbers. *Sample era:* tracker /
soundfont practice (OpenMPT, SF2 documentation) formalises the same
thing for recordings: a sample + loop points + envelope + key-range
mapping + layering rules. The transferable kit across both eras:
**an instrument is data (source + loop + envelope + mapping), the
score references instruments by id, and layering is a mix decision
made at arrangement time, not baked into samples.** No samples,
soundfonts, patches, or instrument data are copied — this bank starts
empty of audio and full of structure; its first entries describe how
the owner's *existing* stems' sounds are catalogued, not new sounds.

**Native spec — `mochiichao/instrument-bank/v1`** (fragment beside
this doc). The bank serves the **MUS stem system** (#13
ADAPTIVE-MUSIC): every MUS layer (PULSE / BASS / HARM / LEAD / TEXT /
DRONE) names the instruments it may draw from, and a cue's stem
manifest (format `mochiichao-stems/1`) references bank ids — so a
SCORE-STATE gain change never needs a new recording, only a re-map.

Bank entry fields:

- `id` — `INS-<family>-<nnn>`; families mirror MUS roles
  (`PULSE`, `BASS`, `HARM`, `LEAD`, `TEXT`, `DRONE`) plus `FOLY-MUS`
  for pitched world sounds (gate bell class) that the score borrows.
- `source` — one of: `owner-stem` (catalogue an existing canon stem
  sound, e.g. the title bass/organ), `synth-params` (a parameter set
  in the hardware-era sense: waveform, envelope, vibrato — rendered
  by LMMS/MuseScore desk tools), or `sample` (a recording). Samples
  carry the staging law: **audio files are TeraBox-class if large;
  the repo holds the entry + hash manifest only** (see STAGING.md).
- `loop` — `{start_sample, end_sample}` or `oneshot`; the #13 loop
  law applies (declared loop point; non-commensurate bar counts
  across a cue's layers are an arrangement property, recorded in the
  cue manifest, not the bank).
- `envelope` — attack/decay/sustain/release in ms + a `vibrato`
  block; `range` — usable pitch range; `layers` — which MUS layers
  this instrument may serve (an instrument may serve two layers at
  different octaves — recorded, not assumed).
- `provenance` — who/what made it (owner stem / desk synth / licensed
  sample with licence named) — the licence-honesty law applies to
  sounds exactly as to software: a CC-BY-NC sample is scratch-only
  and the entry must say so.

**Seed entries (structure, canon sounds only).** The title track's
bass and organ stems exist in canon (`public/audio/mixer/mixer-title-*.wav`,
per the EP01 cue sheet; exact filename/loop-point verification is
flagged for landing in #13 already) — they become the bank's first
two `owner-stem` entries when the lane verifies the files; no other
seed entries are asserted. The DRONE family starts **empty on
purpose**: the Forest's permitted near-silence is a SCORE-STATE
(ABSENCE/DREAD) property, and what a Mochiichao drone *sounds like*
is an owner/composer decision — OPEN.

**Wiring.** Producer of record for #13 cue manifests (instrument ids);
consumes the Ardour/LMMS/MuseScore desk (CREDITS-TO-TOOLS wiring);
cry sounds are **not** instruments (the cry synth is its own system —
List 1 #2) and never enter this bank.

**Coverage.** Format architecture: fully documented across both eras.
Contents: structure complete; entries beyond the two canon stems are
OPEN (composer-built over time). Sample payloads, when they exist,
follow the staging rule (TeraBox + hashed repo manifest).
