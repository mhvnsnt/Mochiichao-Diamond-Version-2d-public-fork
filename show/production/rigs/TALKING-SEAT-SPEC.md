# Human talking seat — shared spec (Mochiko / Hex / Aeon)

Canon basis (repo, local mirrors):
- Humans speak words. The creature pure-cries law does NOT apply to humans
  (owner correction, 2026-10-27; MEMORY.md "HUMAN TALKING SEAT").
- Voice chain: Chatterbox TTS -> Rhubarb 1.13.0 viseme timings
  (`~/opt/bin/rhubarb`, installed) -> Preston Blair mouth charts in the rig.
- Rig standard (repo `show/production/rigs/README.md`, local mirror at
  `~/workspace/mochiichao-show/repo-add/show/production/rigs/README.md`):
  mouth / eyes / hands are **Graphic symbols** (frame-accurate sync, never
  MovieClips); mouth = **Preston Blair 10-viseme set**:
  `rest, A_I, E, O, U, M_B_P, F_V, L_T_D_N_Th, C_D_G_K_S_Z, W_Q`.
  Motion language: animate on 2s/3s; held body with mouth/eyes for
  dialogue (Hanna-Barbera method).

## How the talking set is wired in a TextRig / DragonBones build

The body rig is a whole-image DEFORM rig (same standard as the six pilot
creature rigs: one mesh over the canon cutout, heat-diffusion weights,
DragonBones 5.5 `_ske.json` + `_tex.json` + `_tex.png`).

The mouth is a SEPARATE swap layer on top of that deform mesh:

- Slot `mouth`, parent bone `head`.
- The slot carries 10 displays, one per Blair shape (see
  `mouth-swap-spec.json` in each character folder). Each display is a
  small mouth-region patch. Display 0 (`rest`) is the character's own
  mouth AS DRAWN in the canon art — it is never redrawn.
- The other 9 displays are mouth patches drawn to the Blair chart in the
  character's own line/colour style, sampled from the canon face
  (skin tone, lip/line colour taken from the source pixels). They are
  NEW drawings of mouth shapes only — the standard Blair symbol set
  every puppet rig in the repo standard carries — not a new likeness.
  Face, eyes, hair and body remain the canon pixels, deformed only.
- A `talk` animation (and dialogue shots generally) drives the slot with
  a stepped `display` timeline: one display index per Rhubarb segment,
  hard cuts, no blending (DragonBones stepped display swap — proven by
  TextRig's `deform-swap` fixture). Body bones stay near-held during
  dialogue per the HB method; head carries a small nod track only.

## Rhubarb -> Blair mapping

Rhubarb 1.13 emits 9 shapes (A–H + X) as TSV/JSON
(`{start, end, value}` per segment, seconds). Map:

| Rhubarb | Meaning (Rhubarb docs)                | Blair display    | Notes |
|---------|----------------------------------------|------------------|-------|
| X       | idle / rest                            | `rest`           | also used for pauses between words |
| A       | closed mouth — M, B, P                 | `M_B_P`          | full closure; hold >= 1 frame at 24 fps |
| B       | slightly open — most consonants/vowels | `C_D_G_K_S_Z`    | teeth-showing default chatter shape |
| C       | extra open                             | `E`              | mid-open |
| D       | fully open — "AA"                      | `A_I`            | widest jaw drop in the set |
| E       | rounded — "O"                          | `O`              | round lips |
| F       | pursed — "OO", W                       | `U`              | tight pucker; for a stressed W onset use `W_Q` instead (phoneme-level override, see below) |
| G       | upper teeth on lower lip — F, V        | `F_V`            | |
| H       | tongue tip up — L                      | `L_T_D_N_Th`     | also the fallback for T/D/N/Th segments Rhubarb folds into B |

Overrides / rules:
- `W_Q` is reached only by override: when the phoneme transcript (Rhubarb
  `--extendedShapes` off; use the line's phoneme list from the script)
  shows a W/Q onset, the F segment at that onset keys `W_Q` for its
  first ~80 ms, then `U`.
- Short segments (< 40 ms) are dropped and the previous shape held —
  Blair/HB practice, avoids machine-gun mouth flapping at 24 fps.
- Dialogue is keyed on 2s: shape changes land on even frames of the
  24 fps timeline unless a plosive (A) forces an odd frame.
- Silence before/after a line keys `rest` (X), never the last shape.

## Per-character voice render params (context — VOICE-DESIGN.md)

| Character | Chatterbox exaggeration | CFG weight | Register (prosody sheet) |
|-----------|------------------------|------------|--------------------------|
| Mochiko   | 0.45 | 0.50 | bright mid-high, quick/eager |
| Hex       | 0.30 | 0.60 | lower, drier, deliberate |
| Aeon      | 0.40 | 0.55 | warm low, unhurried lecturer |

Reference casting for all three is still AWAITING OWNER CASTING
(`~/workspace/voice-weights-stage/characters/*/character.yaml`:
`reference_audio: null`). The rig talking set does not depend on the
casting: it is driven by whatever Rhubarb timings the final (or
scratch) render produces. Scratch lines are labelled VOICE-SCRATCH
until the owner passes a casting.
