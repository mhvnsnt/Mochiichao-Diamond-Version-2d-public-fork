# MOUTH DATA FORMAT — mochiichao-mouth-data/v1

**One native mouth-data format for the whole pipeline**, unifying
three sources Jamar already owns:

1. **Rhubarb Lip Sync 1.13.0** (`~/opt/bin/rhubarb`) — automatic
   timing analysis of recorded dialogue.
2. **The Preston Blair mouth system** — ANIMATION-PLAYBOOK §1
   (animation-techniques-archive): the 10-shape chart, the
   M/B/P-always-closes law, lead-audio-by-1-frame, 2–3f average
   holds, never hold a non-rest shape >6f.
3. **His viseme-pack template** — character-pipeline Stage 4
   (`04-viseme-pack/template.md`): mouths are drawn per character,
   in the character's style, as frames of the mouth Graphic symbol
   (chart gives position, character gives style).

> ## ⚠ HUMANS ONLY
> This format exists **only for human characters** (Mochiko, Hex,
> Aeon, human guests), who speak words. **Mochiichao creatures are
> cries-only by owner law — pure cries and sounds, no word dialogue,
> no name-saying — and never receive mouth data.** Creature mouths
> use the cry/expression symbol slot in their rig scaffolds, stepped
> by hand against the cry audio, not by this format or converter.

---

## 1. The pipeline step this feeds (exact)

```
Human voice performance (casting refs; Chatterbox clone render,
  show voice pipe)
    → line WAV (24 fps timeline reference)
    → Rhubarb 1.13.0  (-f json, dialog file supplied for accuracy)
    → rhubarb_to_mouthdata.py   ← THIS PACKAGE
    → mochiichao-mouth-data/v1 JSON  (per line, per character)
    → Tahoma2D: mouth Graphic symbol stepped to symbol_frame numbers
      (Tahoma2D 1.6 also ships a Rhubarb Recognizer; this format is
       the tool-neutral record the show keeps regardless of driver)
    → Blender track (if a human is built in 3D): same cue table
      drives the face action/pose stepping — one cue file, both rigs
    → composite (mouths anchored to head layer; shadows in post)
```
Audio leads, picture follows: mouth data is produced **before**
final puppet animation of a dialogue shot, and the converter applies
the playbook's **1-frame lead** by default.

## 2. The shape mapping (the unification)

Rhubarb emits 6 basic shapes (A–F) + 3 extended (G, H, X; default
`--extendedShapes GHX`). Rhubarb's own `--datUsePrestonBlair`
mapping resolves them onto Blair names; this format resolves them
one step further onto **Jamar's 10-frame Blair symbol set** — the
exact frame names/order in `show/production/rigs/scaffolds/*.rig.json`:

| Rhubarb | Rhubarb sounds | Rhubarb→Blair (DAT) | **Native Blair ID** | Symbol frame | Blair chart description |
|---|---|---|---|---|---|
| X | silence / idle | rest | `rest` | 1 | Closed, neutral — default between lines |
| D | a, æ ("ah/eye") | AI | `A_I` | 2 | Wide open, jaw dropped |
| C | e, i ("eh/ee") | E | `E` | 3 | Slightly open, corners pulled into a grin |
| E | o ("oh") | O | `O` | 4 | Rounded opening, lips pursed forward |
| F | u, w ("oo") | U | `U` | 5 | Tight pucker, small opening |
| A | m, b, p | MBP | `M_B_P` | 6 | Lips pressed firmly together — **non-negotiable closure** |
| G | f, v *(extended)* | FV | `F_V` | 7 | Upper teeth resting on lower lip |
| H | l *(extended)* | L | `L_T_D_N_Th` | 8 | Tongue visible, tip at/behind teeth |
| B | etc — k, s, t, ch, d, g, z… | etc | `C_D_G_K_S_Z` | 9 | Teeth nearly closed, slight gap — the "hiss" shape |
| — | w, q (forward pucker) | WQ | `W_Q` | 10 | Tight pucker, more forward than U |

Two honest seams in the unification, documented rather than hidden:

- **Rhubarb B ("etc") spans two Blair shapes.** Rhubarb lumps the
  hiss cluster (k/s/z) and tongue consonants (t/d/n) into one shape;
  Jamar's set splits them (`C_D_G_K_S_Z` vs `L_T_D_N_Th`). The
  converter defaults B → `C_D_G_K_S_Z`. Animators re-point a B cue
  to `L_T_D_N_Th` when the phoneme is t/d/n/th **and** the tongue
  must read (close shots). Rhubarb H covers only true L sounds.
- **Rhubarb F merges U and W/Q.** The converter defaults F → `U`.
  For w/q-forward lines ("wait", "wonders"), the animator may swap
  F cues to `W_Q` (symbol frame 10). The Stage 4 pack draws both.

## 3. Format definition

```jsonc
{
  "schema": "mochiichao-mouth-data/v1",
  "scope": "human_only",              // constant — see warning above
  "character": "Mochiko",             // human cast only
  "audio": "EP01_mochiko_line01.wav", // source line WAV
  "dialog": "Five wonders wait in the garden.",
  "fps": 24,                          // show standard
  "lead_frames": 1,                   // playbook: mouth leads audio
  "duration_s": 3.10,
  "source": { "tool": "Rhubarb Lip Sync 1.13.0", "format": "json" },
  "blair_set": "preston_blair_10 (rig scaffold mouth symbol order)",
  "checks": {
    "mbp_closures": 1,                // M/B/P closure cues present
    "warnings": []                    // e.g. >6f non-rest holds
  },
  "cues": [
    { "start_s": 0.0, "end_s": 0.18,
      "start_frame": 1, "end_frame": 3, "hold_frames": 3,
      "rhubarb": "X", "blair": "rest", "symbol_frame": 1 }
    // … one object per cue; frames are 1-based, lead already applied;
    // consecutive duplicate shapes are merged by the converter.
  ]
}
```
Field rules: `start_frame`/`end_frame` are the timeline frames the
symbol frame is held on (step the mouth symbol's "single frame"
exposure to `symbol_frame` at `start_frame`). `hold_frames` counts
exposed frames. The converter emits a warning for any non-`rest`
hold > 6 frames (playbook frozen-mouth limit) and reports the M/B/P
closure count so a missing closure is caught in review, not on
screen.

## 4. The converter

`rhubarb_to_mouthdata.py` (Python 3, stdlib only):

```bash
# production form — Rhubarb JSON in, native mouth data out
~/opt/bin/rhubarb -f json -d line.txt -o line.rhubarb.json line.wav
python3 rhubarb_to_mouthdata.py line.rhubarb.json -o line.mouth.json \
    --character Mochiko --dialog "Five wonders wait in the garden."

# also accepts Rhubarb TSV (--format tsv) and Preston-Blair DAT
# (rhubarb -f dat --datUsePrestonBlair; --format dat)
```
Options: `--fps` (default 24), `--lead-frames` (default 1; set 0 to
disable), `--character`, `--audio`, `--dialog`.

## 5. Worked example (run 2026-10-27, in `examples/`)

**Honesty note on the input:** a real Rhubarb run was attempted
first on a synthesized test WAV. Rhubarb 1.13.0 on this VM fails at
startup with `Error creating speech decoder` under both recognizers
(`pocketSphinx` and `phonetic`) — the binary in `~/opt/bin` lacks
its bundled PocketSphinx model resources, so **no genuine
recognition output could be produced on this machine**. Per the
fallback, `examples/sample-rhubarb.json` (+ identical `.tsv` and
Preston-Blair `.dat`) is a **synthesized Rhubarb-format sample** —
cue values chosen to exercise every row of the §2 mapping for the
human line *"Five wonders wait in the garden."* — and is labelled as
synthesized in its folder README. The converter output below is the
real, verified result of running the shipped converter on that
sample; JSON, TSV and DAT inputs all produced the **identical**
Blair cue sequence (cross-checked programmatically).

Result (`examples/sample.mouth.json`): 20 cues, 1 M/B/P closure,
0 warnings. Frame table (24 fps, 1-frame lead applied):

| Frames | Hold | Rhubarb → Blair | Symbol |
|---|---|---|---|
| 1–3 | 3 | X → rest | 1 |
| 4–6 | 3 | G → F_V (F of "Five") | 7 |
| 7–10 | 4 | D → A_I | 2 |
| 11–12 | 2 | G → F_V (v) | 7 |
| 13–17 | 5 | D → A_I | 2 |
| 18–20 | 3 | B → C_D_G_K_S_Z | 9 |
| 21–23 | 3 | C → E | 3 |
| 24–27 | 4 | F → U (w of "wait" — animator may swap to W_Q, §2) | 5 |
| 28–31 | 4 | C → E | 3 |
| 32–34 | 3 | B → C_D_G_K_S_Z | 9 |
| 35–37 | 3 | C → E | 3 |
| 38–41 | 4 | B → C_D_G_K_S_Z | 9 |
| 42–44 | 3 | D → A_I | 2 |
| 45–47 | 3 | B → C_D_G_K_S_Z | 9 |
| 48–50 | 3 | C → E | 3 |
| 51–54 | 4 | H → L_T_D_N_Th (l) | 8 |
| 55–58 | 4 | E → O | 4 |
| 59–62 | 4 | B → C_D_G_K_S_Z | 9 |
| 63–66 | 4 | A → M_B_P (final closure) | 6 |
| 67–73 | 7 | X → rest (line tail; rest holds may exceed 6f) | 1 |

## 6. House rules carried into the format

- M/B/P closure is law: if `checks.mbp_closures` is 0 for a line
  containing m/b/p sounds, the cue file fails review.
- Return to `rest` between phrases (converter preserves Rhubarb's
  X cues verbatim; it never deletes them in merging).
- Mouths are drawn per character in Stage 4 packs — this format
  carries **timing and shape IDs only**, never drawings.
- One cue file drives both rigs (Tahoma2D symbol stepping and the
  Blender face-action stepping) so a human's lip-sync is authored
  once.
