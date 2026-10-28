# 03 — meriasatryan/cartoon-story-generator

**Verified at source 2026-10-28** (GitHub API via the PAT connector:
repo metadata, LICENSE endpoint, README, requirements.txt, main.py).

## What it actually is

- Repo exists: 1 star, 0 forks, Python, last push 2025-05-08, 27 files.
  **Licence: NONE — no LICENSE file (API license endpoint 404) and no
  licence statement in the README.** Bucket: **unlicenced — all rights
  reserved by default; code not taken.**
- Pipeline (`main.py`, README): photo → BLIP caption → OpenAI GPT
  cartoon prompt → ControlNet + DreamShaper cartoonized still →
  GPT 3-scene story prompts → **RunwayML API** animation → joined
  video. Hard dependencies on two paid APIs (`openai`, `runwayml==3.0.1`
  in requirements.txt; README setup requires both keys).

## Verdict: evaluated, not taken (orchestration reference only)

- The only idea in it — caption → prompt → stylize → 3-scene story →
  animate → join — is a strict subset of the AIComicBuilder stage
  order (item 01) and of our existing freedom lane, with weaker
  pieces at every step (single photo input, fixed 3 scenes, no
  character bank, no cue/subtitle handling).
- Nothing is wired: no licence to reuse code, both generative steps
  are paid APIs our free rule excludes, and there is no pattern here
  that items 01/05/06 don't already cover better.
- Its bundled sample photo/generated media were not touched
  (identity-bearing assets are never carried over in any case).
