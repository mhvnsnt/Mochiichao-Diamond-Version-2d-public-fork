# 06 — lilinsong1/comfyui-wan-video-pipeline → headless job runner

**Verified at source 2026-10-28** (GitHub API via the PAT connector:
repo metadata, LICENSE endpoint, README, tree, `scripts/auto_pipeline.py`,
`scripts/submit_workflow.js`, `templates/characters.json`).

## What it actually is

- Repo exists: 0 stars, 4 forks, shell/JS/Python mix, last push
  2026-04-29, tiny (~83 KB). An end-to-end glue pipeline around a
  remote ComfyUI + Wan2.1: audio-first (TTS before video so durations
  match), script.json shot splitting, workflow generation, batch
  render with retry, per-shot audio merge, RealESRGAN upscale, and a
  Jianying (CapCut-CN) draft export.
- **Licence: CONFLICT — the README's License section says "MIT", but
  the repo contains NO LICENSE file (API licence endpoint 404).**
  Bucket: **claimed-MIT, unverified — treated as reference only; no
  code copied.** (Per the licence honesty law, the label is the
  discrepancy itself, not "MIT".)
- Code quality notes from reading it: server hosts, an SSH password
  and absolute paths are hard-coded placeholders in the shipped
  scripts (`YOUR_COMFYUI_HOST`, `sshpass -p 'YOUR_PASSWORD'`) — the
  patterns are sound, the shipped code is a personal rig, not a
  library. Its character template file is a set of Tang-dynasty
  character prompts — content, not taken.

## Patterns adopted

1. **ComfyUI HTTP job control**: `POST /prompt` → `prompt_id`, poll
   `GET /history/{id}`, read output filenames from history outputs.
2. **On-disk pipeline status** (`pipeline_status.json`, step flags +
   timestamps) so a long batch is resumable and inspectable.
3. **Audio-first duration matching** — already our dialogue method
   (audio leads, picture follows; mouth-data format §1), recorded
   here as convergent, not new.

## Wired — real file

- `06-comfyui-pipeline-runner.py` (this folder): **original, stdlib-
  only** implementation of patterns 1+2 against the standard ComfyUI
  API — placeholder substitution (`{{prompt}}`, `{{seed}}`,
  `{{filename_prefix}}`, `{{image}}`), submit with bounded retries,
  poll to completion, download via ComfyUI's own `/view` (not SSH),
  and a `run-report.json` whose outputs are measured (bytes + sha256),
  matching `generate_bundle.py`'s measured-manifest rule; the report
  names `generate_bundle.py` as the next step. `--dry-run` validates
  and resolves a workflow with no server (run-tested this session).

## Not taken

- All shipped scripts (licence conflict + hard-coded secrets/paths),
  the Jianying draft exporter (an editor we don't use), CosyVoice3
  TTS glue (our TTS slots are Chatterbox/Kokoro), its character
  prompt templates.
