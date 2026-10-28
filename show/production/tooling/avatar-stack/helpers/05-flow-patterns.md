# 05 — OpenX-Inc/flow vs our freedom wiring

**Verified at source 2026-10-28** (GitHub API via the PAT connector:
repo metadata, LICENSE file, README, `src/flow/characters.py`,
`src/flow/schemas.py`, `src/flow/mcp_server/server.py`, pipeline and
tree). Comparison target: our freedom lane — local landing copy at
`~/workspace/avatar-tool-build/wiring/freedom/` (repo path
`show/production/tooling/avatar-stack/freedom/`: `job_format_v2.md`,
`scene_job.example.json`, `chain_segments.py`, `scene_composite.py`)
plus `generate_bundle.py` / `backends.json` in the avatar-stack tooling
and `run_backend.py` in `~/workspace/ep01-rebuild/animation-backend/`.
PAT access re-verified this session (`get_user.py`: HTTP 200, login
`mhvnsnt`).

## What flow actually is

- Repo exists: 33 stars, Python, last push 2026-07-23. **Licence: MIT**
  (LICENSE file read — open source).
- Autonomous pipeline: topic → LLM script/shotlist → per-scene Wan 2.2
  clips → assembly (transitions, narration, subtitles, music) →
  publish (YouTube/TikTok/Reels). Orchestrator is decoupled from a
  **GPU backend service** exposing one HTTP contract
  (`POST /generate/t2v|i2v|flf2v`, `GET /health`, base64 payloads),
  deployable to Modal/RunPod/self-hosted. An **MCP server** exposes
  its tool registry to agent clients over streamable HTTP, with a
  project-resolution + dispatch chokepoint shared with the in-app
  agent. Character consistency: a **CharacterBank** (see below).
  TTS is a pluggable provider registry (edge-tts free default; a
  local cloning provider) — the same slot shape as our TTS wiring.
- Caveats: its cost/time table is the project's own marketing
  (A100 ~4 min/clip at 480p), not measured by us; its default GPU
  routes are paid cloud GPU rentals (Modal/RunPod) — a deployment
  choice, not a code dependency; its LLM writer step needs a hosted
  LLM in its default config.

## Where ours already covers it (said plainly)

| flow piece | Our equivalent | Verdict |
|---|---|---|
| Scene chaining (last-frame conditioning between scenes) | `chain_segments.py`: last frame of each segment extracted → next segment's start frame, with a measured seam report | **Covered** inside a character's performance. flow chains across whole scenes/jobs; see gap below. |
| Per-scene generation jobs | scene-job v2 (any characters × free-text segments) + `run_backend.py` job fields | **Covered**, and ours is freer (no fixed 5 s scenes, no topic-only input). |
| Assembly + subtitles + music | `scene_composite.py` + ACE-Step music lane + item 01's SRT adapter | **Covered** in pieces. |
| Decoupled GPU backend | Kaggle notebook seat driven by job datasets (`run_backend.py`), ComfyUI headless API (item 06 runner) | **Covered differently**: ours is batch/Kaggle, theirs is a standing HTTP service. No change needed until a standing GPU exists. |
| TTS provider registry | Chatterbox/Kokoro slots (item 07) | **Covered**. |
| Publishing to platforms | — | **Not taken**: out of scope for production tooling; a marketing step, owner-run. |

## What flow adds that ours lacked — taken

1. **A persistent character bank across jobs.** Ours resolved a
   character's starting image per job (canon cutout named in the job
   file). flow's `CharacterBank` keeps `{name, description,
   reference_image}` in an on-disk `manifest.json`, captures the
   reference from the character's first generated appearance, and
   injects it as conditioning on later appearances.
2. **Cross-scene chaining as data**: flow's `GeneratedClip` carries
   `last_frame_path`, so scene N+1's conditioning is a recorded field,
   not an operator's memory. Ours chained within a job only.

## Wired — real files (clean-room, original code)

- `05_character_bank.py` — bank register/list with a manifest in
  flow's shape, extended with our fields (`cutout`,
  `current_version` per the current-version law, `lora`, `scope`
  human/creature); plus `chain-plan`, which emits an ordered job list
  for a scene-job v2 file where segment 1 starts from (in precedence
  order) the previous scene's last frame → the bank reference → the
  canon cutout, and later segments chain via the existing
  `chain_segments.py` rule. Run-tested against the item-01 adapter's
  output job. No flow code copied; the pattern is MIT-licensed and
  this is a reimplementation against our schemas.
- `05_character_bank_schema.json` — the manifest + chain-plan schema.

## Not taken

- The MCP server: interesting, but our job control is files +
  `generate_bundle.py`; an MCP façade is a **spec/gap** until an agent
  client needs to drive production directly.
- The autonomous topic→publish loop and platform publishers: the
  show is authored, not auto-generated; publishing is the owner's.
- flow's Modal/RunPod deploy code (paid GPU clouds) and its sample
  films/assets (identity-bearing media, never carried over).
