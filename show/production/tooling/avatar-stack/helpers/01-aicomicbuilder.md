# 01 — LingyiChen-AI/AIComicBuilder

**Verified at source 2026-10-28** (GitHub API via the PAT connector: repo
metadata, LICENSE file, README, tree).

## What it actually is

- Repo exists: 1,927 stars, 326 forks, TypeScript/Next.js 16, last push
  2026-04-27, size ~90 MB. **Licence: Apache-2.0** (LICENSE file read —
  open source).
- A script-to-animated-comic web app. Pipeline (its README): script
  import (TXT/DOCX/PDF) → script parse → character extraction →
  character four-view reference sheets → shot split (storyboard with
  composition/lighting/camera fields) → first/last-frame generation →
  per-shot video prompts → per-shot video generation → assembly +
  subtitle burn-in. Data model: Project / Character / Shot / Dialogue /
  Task. Its Drizzle migrations confirm useful per-shot fields we mirror:
  `dialogue_start_ratio` / `dialogue_end_ratio` (0018/0019),
  `last_frame_url`, `scene_ref_frame`, storyboard versions.
- **Its generators are hosted paid APIs** (README tech stack): text
  OpenAI/Gemini, image DALL-E/Gemini Imagen/Kling, video
  Seedance/Kling/Veo. Per the owner free rule those are **not wired as
  dependencies** — only the pipeline shape around them is taken.

## Taken (construction kit only)

- The stage order (parse → character extract → storyboard → keyframes
  → video prompts → per-shot video → assembly + subtitles) as an
  orchestration pattern. Our lane already runs most of it; the two
  pieces worth landing are the **dialogue-ratio subtitle timing** and
  the **shot-record shape** (first/last frame + scene reference frame
  per shot), which map directly onto scene-job v2 segments.

## Wired — real file

- `01_pipeline_adapter.py` (this folder, original code, syntax-checked
  and run-tested): converts an AIComicBuilder-style project export into
  (a) a `mochiichao-show/scene-job/v2` job for the freedom lane
  (`run_backend.py` → `chain_segments.py` → `scene_composite.py`) and
  (b) an `.srt` subtitle file timed from the shots' dialogue ratios.
  Every named paid provider in the input is recorded under
  `blocked_paid_slots` and replaced: text → `local-qwen-text`,
  image → `local-wan-keyframe`, video → `kaggle-wan22-ti2v-5b`,
  TTS → `local-tts-chatterbox`. No paid API is called or required.

## Not taken

- The Next.js app itself, its DB schema, its agent-workflow zips
  (Bailian/Coze/Dify bundles — hosted-platform workflows), and any
  bundled demo imagery. Branding/naming: none carried over.
- Four-view character generation: our characters come from canon
  cutouts, not generated sheets (likeness law).

**Measurable help:** subtitle timing + shot shape now convert
mechanically instead of by hand; zero new dependencies (stdlib only).
