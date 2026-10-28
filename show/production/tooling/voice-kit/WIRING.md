# WIRING — how the voice kit plugs into EP01 production

Kit home (in the Mochiichao game repo — the show lives in-repo):
`show/production/tooling/voice-kit/`
Teardown/design: `VOICE-KIT.md` (lands as
`show/production/tooling/voice-kit/docs/VOICE-KIT.md`).
Voice law source: `show/production/VOICE-DESIGN.md` (prosody sheets +
gate). Pipeline contract: `show/production/tooling/PIPELINE.md`.

## 1. Where the kit sits in the pipeline

`PIPELINE.md` is dialogue-first and already names this kit's pattern
at two stages — the kit is the concrete machine for both:

```
beat sheet (locked)
  -> SCRATCH DIALOGUE  …… voice-kit, Kokoro scratch path and/or
                           Chatterbox once cast; render-queue format.
                           PIPELINE.md stage 1: "Scratch voices are
                           for timing only" — outputs stamped
                           VOICE-SCRATCH time the animatic.
  -> ensemble voice record (final voices; improv pass kept)
  -> audio cut + animatic (cape-jones builders)
  -> … animate … lip sync (Rhubarb cue sheets off the FINAL voice
     takes — never off scratch) …
  -> score/SFX … ANIM GATE … deliver
```

Creatures never enter this wiring: EP01's beds
(`show/episodes/EP01/audio/EP01-SCENE-*.wav`) already carry the
creature cries, and PIPELINE.md sources those from the cry/species
side, not from any voice queue.

## 2. EP01 specifically — the exact plug points

EP01 has **one word-voice: Mochiko** (EP01-SHOOTING-SCRIPT-v2 §2 cast
table; Hex and Aeon are not in EP01). Her lines are all in script §3,
Scenes 1–5, and the kit's shipped `render-queue.json` is already her
EP01 batch — 12 lines, prosody-typed and contoured:

| Output stem | Script point | Feeds |
|---|---|---|
| `mochiko-sc01-gate-trampoline.VOICE-SCRATCH.wav` | Scene 1, gate arrival | animatic timing, Scene 1 bed dialogue slot |
| `mochiko-sc01-rule-one-reading…` | Scene 1, Manual reading | same |
| `mochiko-sc02-unstacked…`, `mochiko-sc02-ducks…` | Scene 2, pond tour | Scene 2 timing |
| `mochiko-sc03-by-supper…`, `mochiko-sc03-directions…` | Scene 3, the Green | Scene 3 timing |
| `mochiko-sc04-*` (4 lines) | Scene 4, pond dusk / Wispkin reveal | Scene 4 timing — the reveal lines are `character-bonding` |
| `mochiko-sc05-rule-12-reading…`, `mochiko-sc05-successful-hat…` | Scene 5, gate night | Scene 5 timing — Rule 12 line is `emotional-connection`/`reverence`, queued verbatim from script §0.3 at render time |

Flow per line: render (Actions artifact or local `--run`) → drop the
take into `show/episodes/EP01/audio/` planning (alongside the
existing `EP01-SCENE-*.wav` beds) → animatic timing pass → after
casting passes and a `FINAL` batch renders, final takes replace
scratch in the mix and Rhubarb generates the lip-sync cue sheets from
the finals.

## 3. Repo paths on landing (PR, per no-data-loss rules)

| Kit file (here) | Lands at |
|---|---|
| `kit/*` (README, characters.json, render-queue.json, schema, requirements.txt, scripts/, refs/) | `show/production/tooling/voice-kit/…` |
| `VOICE-KIT.md` | `show/production/tooling/voice-kit/docs/VOICE-KIT.md` |
| `WIRING.md`, `TERABOX-MANIFEST.md` | `show/production/tooling/voice-kit/` |
| `kit/.github/workflows/voice-render.yml` | `.github/workflows/voice-render-mochiichao.yml` (repo root — GitHub only runs workflows from there; its queue-push path filter already points at the landed kit path) |
| index entry | one line in `show/production/tooling/TOOLING-INDEX.md` + a pointer line in `show/production/VOICE-DESIGN.md` §chain step 3 |

Weights do **not** land in the repo at all — see
`TERABOX-MANIFEST.md`. Actions runners fetch them from the HF cache
exactly as the source pipe does; the TeraBox copy is the durable
staging of record.

## 4. The one remaining manual step

**Casting Mochiko's reference audio.** Everything else in this kit
runs today — the queue plans, the workflow is written, the manifest
is hashed. But the renderer deliberately refuses a `CASTING_TBD`
slot, and only the owner can close it, by one of the casting brief's
three choices (`~/workspace/mochiichao-show/EP01-MOCHIKO-CASTING-BRIEF-DRAFT.md`):

1. supply a reference recording the owner has the right to use, or
2. audition-first: run the shipped EP01 queue through the Kokoro
   scratch path, pick a direction, then commit a clone reference, or
3. defer — EP01 animation continues; voice stays a labelled wait.

The mechanical flip once decided: save the clip as
`refs/mochiko-ref.wav`, set `mochiko.ref_status` to `CAST` in
`characters.json`, push — the next queue push renders finals-track
takes (still `VOICE-SCRATCH` until the owner passes the casting gate
and the batch is marked `FINAL`).
