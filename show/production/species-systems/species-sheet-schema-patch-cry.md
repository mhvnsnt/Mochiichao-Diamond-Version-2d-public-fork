# SCHEMA PATCH — cry block for the species sheet

**What this is:** the wiring deliverable of Cry Teardown #2. It adds
one block — `cry` — to every species record, so a species' cry recipe
travels with its sheet exactly the way its footprint bitmap and
silhouette do. A species sheet is not complete until its `cry` block
exists (even if `status` is `draft`).

**Applies to:**
1. Sideline A's intake schema in `species-data-system/` (the sheet
   standard this patch extends). Sideline A's files had not landed
   when this patch was written; the patch is written against the
   agreed element list (bio_short, bio_long, footprint, silhouette,
   discovery, cry, type/description, body data) and `cry` already
   exists there as an element — this patch defines its internals.
2. The game data home `src/data/core/species.json` (the 47-canonical
   roster record; two-lane law: the same block, same values, in game
   data and show data).

Machine-readable form: `cry-schema-fragment.json` in this folder.
Renderer: `tools/cry_synth.py`. Full spec: `CRY-SYNTH.md`.

## The block

```jsonc
"cry": {
  "identity_note": "Bouncing squeak-cry",   // SHOW-BIBLE §4 style, written FIRST
  "status": "draft",                        // draft | locked (owner locks)
  "synth": {
    "wave_a": "pulse25",                    // base waveform family (start)
    "wave_b": "triangle",                   // base waveform family (end)
    "morph": 0.35,                          // wave_a -> wave_b crossfade 0..1
    "base_hz": 740.0,
    "pitch_env": [[0.0, 0.0], [0.12, 5.0], /* ... */ [1.0, 2.0]],
    "amp_env":   [[0.0, 0.0], [0.04, 1.0], /* ... */ [1.0, 0.0]],
    "length_s": 0.55,
    "vibrato":  { "rate_hz": 22.0, "depth_st": 0.25, "delay_s": 0.3 },
    "pwm":      { "rate_hz": 0.0, "duty_lo": 0.2, "duty_hi": 0.5 },   // pulse_pwm only
    "tremolo":  { "rate_hz": 0.0, "depth": 0.0 },                     // throat pulses
    "noise_mix": 0.03, "noise_tone": 0.8,                             // breath component
    "crackle": 0.0,                                                   // fire pops, if any
    "echo":     { "delay_s": 0.0, "decay": 0.5, "repeats": 0 },
    "seed": 1101
  },
  "rendered_wav": "public/audio/cries/mochii-cry.wav"  // null until rendered
}
```

Field-by-field semantics: `cry-schema-fragment.json` (each field
carries its own description). Pilot-six worked examples, all six
fields exercised: `tools/pilot_six_cries.json`.

## Rules that come with the patch

1. **Identity before parameters.** `identity_note` is written first,
   in the SHOW-BIBLE §4 register (two-to-four words of character,
   e.g. "foghorn bellow"). Parameters are then tuned to *be* that
   note. A block whose note and sound disagree is unfinished.
2. **Pure cries only.** This block synthesises cries and sounds —
   never speech, never name-saying (voice law). There is no field
   for lyrics, phonemes, or text, on purpose.
3. **One base-voice family per relation line.** Species related by
   evolution/kinship should share `wave_a` and differ mainly in
   `base_hz` / `length_s` / envelope weight — the classic system's
   family resemblance, adopted as a house rule (see CRY-SYNTH.md §2).
4. **Reproducible renders.** `seed` is mandatory: the same block must
   render the same WAV on any machine, so a re-render is a check,
   not a new creative act.
5. **Owner locks.** Lane-drafted blocks are `status: draft`. Only
   the owner promotes to `locked`, the same promotion discipline as
   the likeness gate (packet recommends; human promotes).
