# Cry method — UPDATE 1 (Mars corrections, 2026-10-26 ~14:06–14:09 CDT)

Status: STAGED UPDATE ONLY. This file contains ONLY the sections
changed by Mars's voice-message corrections on 2026-10-26
~14:06–14:09 CDT. It does NOT replace
`cry-method-60-40-20261026.md` — that original file is untouched,
and every section below names the original section it supersedes.
No repo file was edited, no PR opened, no merge.

## Changelog

1. Element match-ups (Pokemon-first, Mars): Silk = Bug, Wind =
   Flying, Neon = Electric — filling the remaining type gaps from
   the rest of the Pokemon code as the starting point, same rule as
   Beast -> Normal-equivalent and Flora -> Grass-equivalent.
2. Neon timbre CHANGED: cosmic-glow shimmer (proposal) is replaced
   by Electric buzz/crackle. Silk and Wind timbres are confirmed
   (Bug-family, Flying/Aero-family), not proposal-only.
3. Dorowani multiverse canon and no-speak-yet rule are recorded in
   the spec update (`all-mochiichao-cry-spec-20261026-update1.md`
   §2–§3); this method file does not change the 60/40 blend itself.
4. Neon v2 production added (see below). No other production fact
   changes.

## Changed section — "Element textures used" (supersedes original method's texture list, Neon/Silk/Wind lines only)

Original lines replaced:
- "Bug/Silk: high flutter trill."
- "Aero/Wind: airy gust sweep."
- "Neon: cosmic-glow shimmer (proposal timbre only, type open)."

New lines (Mars, Pokemon-first, starting point only):
- Silk = Bug: Bug-family flutter/trill, as already used —
  CONFIRMED, not proposal-only. (Creatures 016-018; their v1 WAVs
  are unchanged.)
- Wind = Flying: Flying/Aero airy gust sweep, as already used —
  CONFIRMED, not proposal-only. (Creatures 019-021; their v1 WAVs
  are unchanged.)
- Neon = Electric: Electric buzz/crackle — a square-ish buzz tone
  plus sparse high-frequency crackle bursts, gated so it reads as
  discharge riding the cry, not as a separate drone. This REPLACES
  cosmic-glow shimmer for Neon creatures. (Creatures 024-025
  only; see production below.)
- True Elements slot question, flagged OPEN: Electric-equivalent
  is recorded as Mars's Pokemon-first mapping. It is NOT silently
  assigned to Core or to any other True Element slot. The same
  open-slot note applies to Silk/Bug and Wind/Flying where the
  True Elements list has no exact slot — the Pokemon mapping is
  the starting point, not a final True Elements assignment.

All other element textures in the original list are UNCHANGED
(Water, Chrome, Core/Earth, Flame, Beast/Normal-equivalent,
Flora/Grass-equivalent, Umbral, Strike, Mythic).

## Changed section — "Production facts (staged, 2026-10-26)" (adds Neon v2 production only)

Original production facts are UNCHANGED except for this addition:

- Neon v2 production (this update, staged only):
  - Script: `synth-neon-v2-20261026.py` in this same `work/cries/`
    folder. It reuses the v1 base parameters exactly for the two
    Neon creatures (Floatcalf: 600->450 Hz, 1.4s, bubble base,
    vibrato 6 Hz / 0.04; Astroleviathan: 200->320 Hz, 1.9s, drone
    base, vibrato 3 Hz / 0.03) and adds the Electric layer
    (Floatcalf buzz 1500 Hz, Astroleviathan buzz 900 Hz, both
    with 40 crackle bursts, gated at 7 Hz, mixed at 0.30 before
    the cry envelope and peak normalisation to 0.89).
  - Output (NEW files, v1 files retained untouched):
    `audio/floatcalf-cry-v2.wav` (1.40s, stereo 16-bit 44100 Hz,
    RMS 0.1824, non-silent) and
    `audio/astroleviathan-cry-v2.wav` (1.90s, stereo 16-bit
    44100 Hz, RMS 0.2396, non-silent). Both durations are within
    the original 1.20-2.00s range.
  - Seed note, stated plainly: the v1 script seeded noise with
    Python `hash(name)`, which is salted per process, so the v2
    script uses a stable md5-based seed instead. Base parameters
    are identical; only the Electric layer and the noise-seed
    method differ from v1, and v2 files are new files, not
    in-place replacements.
  - Scope of this regeneration: ONLY Floatcalf and
    Astroleviathan. The other 45 WAVs were NOT regenerated or
    touched, and no Dorowani audio was created, modified, or
    touched (there is no dorowani-cry.wav in `work/cries/audio/`;
    Dorowani's staged cry proposal is unchanged — see spec
    update §3).
- The 60/40 blend itself is UNCHANGED: 60% Mochiichao original
  procedural design (main), 40% Pokemon cry SYSTEM (table + ID
  mapping + API + timing + reuse across title/battle/lab), ZERO
  Pokemon audio copied. The "better than Pokemon" claims in the
  original method (not pitch-shifted copies; modern fidelity;
  expressive envelopes; audible element textures) are UNCHANGED
  and now extend to the Electric texture: Neon creatures no
  longer share a generic glow shimmer — they carry an audible
  Electric buzz/crackle that matches their Pokemon-first mapping.
- Ship step remains NOT done here: after Mars hears and approves
  the staged WAVs in words (including v1 vs v2 per Neon creature),
  a gate-checked PR moves approved files to
  `public/audio/cries/<name>-cry.wav` with TitleScene cry-gate
  wiring. Until then, staged only.
