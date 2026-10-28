# 02 — Automate-Animation/synctoon

**Verified at source 2026-10-28** (GitHub API via the PAT connector:
repo metadata, LICENSE file, README, DEVELOPER.md, tree).

## What it actually is

- Repo exists: 59 stars, Python, last push 2026-09-15. **Licence:
  GPL-3.0** (LICENSE file read — open source, copyleft).
- A 2D cut-out animation tool: script + audio → per-WORD LLM picks
  (head angle, eyes, emotion, gesture, background, zoom) → g2p phonemes
  → mouth viseme per frame → **one CSV, one row per frame**
  (`core/video_frames_info.csv`) → PIL layer compositing
  (background → body → head → eyes → mouth) → OpenCV/ffmpeg video.
- Its own README is honest about seams we rely on below: the CSV
  columns and which ones the renderer actually reads; `Blink` is
  parsed but ignored (known bug); blink rows inflate duration ~3.6%;
  mouth timing splits frames evenly across phonemes instead of using
  aligner phone durations ("floaty" lip-sync, their words).
- Default voice/alignment path is **ElevenLabs** (paid API, with-
  timestamps endpoint). The free alignment path is your own audio +
  **Gentle** (Docker forced aligner). LLM step accepts Anthropic /
  Gemini / any OpenAI-compatible endpoint **including local Ollama** —
  that local slot is the only LLM route compatible with our free rule.
- It ships exactly ONE character (`character_1`) plus a folder of
  stock backgrounds/bodies. **None of that art is taken** (construction
  kit = systems only; also GPL asset-carryover is not needed — our
  characters are canon cutouts with their own rig lane).

## Taken

- The **CSV cue-sheet as the editable source of truth** for a cut-out
  performance: one row per frame, edit a cell and re-render with
  `--skip-core`. That pattern fits our rig/cutout lane directly —
  our equivalent source of truth is `mochiichao-mouth-data/v1` plus
  the mouth-swap stepped-display spec (`mochiichao-show/mouth-swap/v1`,
  `~/workspace/still-to-build/human-rigs/_shared/mouth-swap-spec.json`).

## Wired — real file

- `02_cue_sheet_adapter.py` (this folder, **original clean-room code —
  no synctoon code copied, so no GPL follows it**; the CSV column
  format is data, read from its README):
  - `to-cues`: synctoon per-frame CSV → our per-run cue CSV (identical
    consecutive rows collapsed), with synctoon mouth file stems
    resolved onto our Preston Blair 10-shape set / symbol frames
    (the mapping in `MOUTH-DATA-FORMAT.md`), plus an optional
    `mochiichao-mouth-data/v1` JSON. Unmapped stems fall back to
    `rest` **and are counted in the output message** — a visible gap,
    not a silent wrong mouth. Mouth JSON is refused for creatures
    (cries-only law).
  - `to-frames`: our cue CSV → synctoon-style per-frame CSV, if a
    scratch render through synctoon's own renderer is ever wanted
    (that render itself would be GPL software run as a tool, not
    code we ship).
  - Run-tested both directions on a sample CSV (4 frames → 3 runs →
    back to 4 frames).
- TTS/alignment slots in this lane are NOT ElevenLabs/Gentle: voice
  comes from our staged Chatterbox/Kokoro slots and timing from
  Rhubarb (see `07-talking-avatar.md`). synctoon's per-word LLM cue
  picking, if used, routes to a local model only (their Ollama slot);
  no adapter for that step is wired — **spec/gap**, because our
  dialogue method already authors cues from Rhubarb + the script.

## Not taken

- synctoon code (GPL-3.0 copyleft — using it as a run-time tool is
  fine, vendoring it into our repo is a licence decision nobody has
  made), its character/background art, ElevenLabs default path.

**Measurable help:** any synctoon-format cue sheet (theirs or a
scratch tool's) now converts losslessly in run structure to our cue
CSV + mouth-data in one command.
