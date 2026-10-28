# VOICE-KIT — teardown of the Wizard Gang voice pipe, rebuilt Mochiichao-native

**What this is:** the end-to-end teardown of Jamar's own working voice
system — `mhvnsnt/wizard-gang-voice-pipe` (read at HEAD 2026-10-27 via
the GitHub PAT connector) — and its rebuild as a Mochiichao-native kit
(the `kit/` folder beside this doc, repo-ready).

**What transfers and what does not (owner law):** the *pipeline and
pattern* transfer. The Wizard Gang `refs/` audio does **not** — those
clips are that show's cast identities (named performers' voices).
Mochiichao humans get their own references, cast to the prosody sheets
in `show/production/VOICE-DESIGN.md`. Patterns transfer, identities
don't — the same law as likeness.

**Scope law:** this kit renders **human lines only** (Mochiko, Hex,
Prof. Aeon). Mochiichao creatures are pure cries and sounds by owner
law — no queue entry, no prosody sheet, no render ever gives a
creature words.

---

## 1. The source pipe, as it actually works (teardown)

Source: `mhvnsnt/wizard-gang-voice-pipe` — README.md,
`scripts/render_voice.py`, `render-queue.json`,
`.github/workflows/voice-render.yml`, `requirements.txt`, `refs/`.

### 1.1 Why it exists / where it runs
The local VM does not have the RAM for Chatterbox inference, so the
pipe renders on **GitHub Actions free runners** (ubuntu-latest, ~7 GB
RAM, CPU torch). A local mode exists for testing
(`python scripts/render_voice.py --character … --text … --out …`).
Weights (~3.5 GB) download from Hugging Face `ResembleAI/chatterbox`
on first run and are cached between runs (`actions/cache`,
key `chatterbox-model-v1`).

### 1.2 The whole voice spec is three things per character
From `scripts/render_voice.py` (owner-tuned, verified at HEAD):

| Piece | Where | Meaning |
|---|---|---|
| Reference audio | `refs/<name>-ref.wav` (or `.m4a`) | One clip; Chatterbox zero-shot-clones its voice/prosody. 0.35–1.2 MB each in the source repo — repo-sized, never a TeraBox item. |
| `CHARACTER_REFS` | dict in the script | name → ref path |
| `CHARACTER_DEFAULTS` | dict in the script | name → `{exaggeration, cfg_weight}` |

Source values (Wizard Gang's own cast — shown as *evidence of the
pattern's ranges*, not carried into Mochiichao):

| Character | Exaggeration | CFG | Owner's basis note |
|---|---|---|---|
| static | 0.70 | 0.5 | gruff |
| cipher | 0.85 | 0.5 | feral |
| aaron-ruben | 0.50 | 0.5 | deadpan |
| narrator | 0.50 | **0.7** | VO / authority |
| onyx | 0.35 | 0.5 | soft-spoken (temp) |

Operative facts mined from the repo + its queue history
(`research-drafts/PROSODY-REPO-MINE.md`):
- **Exaggeration is the expressiveness dial, set per character**
  (observed range 0.35 soft → 0.85 feral). **CFG is near-constant
  0.5**; the one raise (narrator 0.7) buys *legibility/authority*,
  not expression.
- **Per-line overrides are rare and only move exaggeration**, for
  register shifts (a whisper: 0.50→0.35; a manic character reined in:
  0.85→0.70). CFG is never overridden per line.
- **There is no direction/emotion field in the source queue at all.**
  Performance is written into the *text itself* — ALL-CAPS bursts,
  ellipses, em-dashes, shortening sentences. (The Mochiichao kit adds
  an explicit prosody field on top — §3 — because the owner's
  prosody directive requires per-moment prosody types; the
  text-carries-performance practice is kept as well.)
- Adding a character is a **config change, not a code change**:
  drop ref in `refs/`, add two dict entries, add the name to the
  workflow's choice list.

### 1.3 Render flow (single line)
```
CLI args (--character --text [--exaggeration] [--cfg-weight] --out)
  → resolve character defaults for any unset param
  → FATAL exit if refs/<name>-ref.* is missing (no silent fallback voice)
  → Perth watermarker workaround (mock no-op module — the vendored
    perth watermarker is broken in some chatterbox-tts versions)
  → ChatterboxTTS.from_pretrained(device=cuda|cpu)
  → model.generate(text, audio_prompt_path=ref,
                   exaggeration=…, cfg_weight=…)
  → torchaudio.save WAV, 16-bit PCM at model.sr (24 kHz)
  → report duration + peak; WARN if peak < 0.01 (near-silence guard)
```

### 1.4 Queue flow (batch — the production path)
Trigger: **push to `render-queue.json`**, or manual
`workflow_dispatch` (character / text / exaggeration / cfg_weight /
label inputs).
- Queue file is a **single slot**: each push replaces it with the next
  batch. Its git history *is* the take log.
- Two shapes accepted: single-line
  `{"character","text","exaggeration","cfg_weight","label"}` or batch
  `{"character", …, "lines":[{"label","text"}, …]}` — one character
  and one param set per batch; a failed line logs `FAILED: <label>`
  and the batch continues.
- After render: ffmpeg converts WAV → MP3 (192k), and the run uploads
  `output/` as a workflow artifact (30-day retention).
- Runtime reality: ~15–30 min per line on free CPU runners;
  workflow timeout 120 min. Pinned stack: Python 3.12,
  torch/torchaudio 2.6.0+cpu, chatterbox-tts 0.1.7, librosa 0.11.0,
  soundfile 0.14.0, numpy 1.26.4.

### 1.5 What the source pipe does NOT have (gaps the kit closes)
1. No prosody typing per line (needed by the owner's prosody
   directive — see §3).
2. No character config file — refs/defaults are hardcoded dicts in
   the script. The kit moves them to `characters.json` (same data,
   editable without touching code; the 3-step "add a character"
   recipe becomes: ref file + one JSON entry + workflow choice).
3. No scratch/final status on outputs. The kit stamps every render
   `VOICE-SCRATCH` until the owner passes a casting (VOICE-DESIGN
   gate, step 4 of the chain).
4. No episode/scene/cut addressing — labels are free text
   (`ep02-l1`, `h1-temp`). The kit keeps free-text labels but
   standardises them as `<scene>-<cut-or-line>` so outputs land
   addressed to the cue sheet.

---

## 2. The Mochiichao-native kit design

Landing path in the game repo (show lives in-repo):
`show/production/tooling/voice-kit/` — see WIRING.md for the full
wiring into EP01. Package layout (in `kit/` here, identical on land):

```
voice-kit/
  README.md                  how to render, how to add a character
  VOICE-KIT.md               (this teardown, lands as docs/VOICE-KIT.md)
  WIRING.md                  EP01 integration contract
  TERABOX-MANIFEST.md        binary staging manifest (weights live on TeraBox)
  characters.json            cast slots + prosody sheets + render defaults
  render-queue.json          the single-slot batch queue (worked example inside)
  render-queue.schema.json   queue format spec (JSON Schema)
  requirements.txt           pinned stack (same pins as the source pipe)
  scripts/render_voice.py    queue-driven renderer (dry-run by default)
  refs/README.md             casting slot instructions — NO audio ships here
  refs/.gitkeep
  .github/workflows/voice-render.yml   (lands at repo root workflows on merge —
                             see WIRING.md §4; kept inside the kit until then)
```

### 2.1 Character slots (from `show/production/VOICE-DESIGN.md`)
Render starts are the voice-design doc's own draft values — DRAFT,
owner tunes; refs are **CASTING TBD** for all three.

| Slot | Register sketch (VOICE-DESIGN) | Exaggeration | CFG | Ref status |
|---|---|---|---|---|
| `mochiko` | bright mid-high, quick/eager; wonder contour up, reverence contour flat-slow for Manual readings | 0.45 | 0.5 | CASTING TBD |
| `hex` | lower, drier; beats land on the last word; quieter to win | 0.30 | 0.6 | CASTING TBD |
| `aeon` | warm low, unhurried lecturer; lists are ceremonies | 0.40 | 0.55 | CASTING TBD |

EP01 needs exactly one of these: **Mochiko is EP01's only word-voice**
(cast table, EP01-SHOOTING-SCRIPT-v2 §2). Hex and Aeon slots exist so
EP02+ needs no kit changes.

### 2.2 Engines
- **Chatterbox (primary, clone renders)** — the source pipe's engine.
  Zero-shot clone from the cast reference + exaggeration/CFG.
- **Kokoro-82M (scratch only)** — preset-voice TTS, no cloning. Its
  job in this kit is the casting brief's option 2: *audition first,
  clone later* — EP01 lines rendered as labelled scratch to pick a
  direction before a reference is committed. Kokoro outputs are
  always `VOICE-SCRATCH`, never final.
Both engines' weights are TeraBox-staged (TERABOX-MANIFEST.md);
neither weight set ever sits in the repo.

---

## 3. Prosody fields (the owner's prosody directive, made data)

Directive (MEMORY.md, 2026-10-27): voices must carry TV-grade
prosody, with **different prosody types for different story
moments** — emotional connection, narrative beats, audience
retention/return, character bonding. The side lane's prosody-system
work (`research-drafts/PROSODY-REPO-MINE.md`, VOICE-DESIGN.md) supplies
the per-character contours; this kit makes the per-moment type a
first-class queue field so a batch can be audited against the script.

Every queue line carries:

| Field | Values | Meaning |
|---|---|---|
| `prosody_type` | `emotional-connection` · `narrative-beat` · `audience-retention` · `character-bonding` · `baseline` | the story job this line's delivery does |
| `contour` | free text from the character's sheet (`wonder`, `reverence`, `dead-level`, `lecturer`, …) | which of the character's sentence-melodies applies |
| `exaggeration` / `cfg_weight` | optional per-line override | used sparingly, register shifts only — exaggeration moves, CFG effectively doesn't (source-pipe evidence) |

And the source pipe's core practice is kept: **the performance is
also written into the text** (caps, ellipses, dashes) — the fields
direct and audit; they do not replace writing the line performably.

Worked mapping, EP01 Mochiko (full queue in `kit/render-queue.json`):
- "First rule of the garden: the gate is a trampoline. Got it." →
  `audience-retention` / `wonder` (cold-open hook, discovery tilt-up)
- (reading) "Rule one: mind the gate." → `narrative-beat` /
  `reverence` (Manual readings slow her down)
- "...Hi. You kept the garden all night, didn't you. Every night." →
  `character-bonding` / `wonder→soft` (the Wispkin reveal)
- (Rule 12 reading, Scene 5) → `emotional-connection` / `reverence`

---

## 4. Gate (from VOICE-DESIGN.md, chain step 4)
No render enters an episode mix until it is checked against the
character's prosody sheet (pacing / melody / energy match). Until the
owner passes a casting, **every** output of this kit is labelled
`VOICE-SCRATCH` — in the filename suffix and in the queue's `status`
field — and may time an animatic but may not ship as a final voice.
