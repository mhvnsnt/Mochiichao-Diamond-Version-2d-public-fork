# NONFREE-EQUIVALENTS — clean-room functional equivalents map

Addendum 4. For every non-free service in the owner pull-in list:
what function it performs, what OUR in-repo equivalent is, and where
that equivalent is wired (a real file) or honestly flagged spec/gap.
**Clean-room only**: equivalents are functional replacements built on
our own/open stack — nothing here cracks, bypasses, or clones a
proprietary service, and no proprietary weights or code are
redistributed.

| Non-free service | Function | Our in-repo equivalent | Wired where (real file) or spec/gap |
|---|---|---|---|
| **Veo** (Google, paid API; not on Gemini free tier) | Text/image-to-video, first-last-frame | **Wan 2.2 stack**: TI2V-5B (wired engine) + I2V-A14B quality tier (prepared, not staged) + Wan2.1 VACE 1.3B + FLF2V first/last-frame conditioning + per-character LoRAs (musubi-tuner, none trained yet) + segment chaining | Wired: `run_backend.py` (ep01-rebuild/animation-backend), `chain_segments.py` (freedom lane), consistency kit staged in Kaggle datasets (ledger A2). LoRA tier: spec/gap — no character LoRA trained yet. |
| **Kling** (paid; free tier watermarked + non-commercial → scratch only) | Image-to-video, motion quality reference | Same Wan 2.2 stack as above | Same as above. Kling itself: never wired; free-tier output may not ship. |
| **Seedance** (paid; trial = scratch only) | Per-shot video generation in AIComicBuilder | Wan 2.2 per-segment generation via scene-job v2 | Wired: `01_pipeline_adapter.py` rewrites the Seedance slot to `kaggle-wan22-ti2v-5b` and records it under `blocked_paid_slots`. |
| **ElevenLabs** (paid; free tier = no commercial rights, attribution required → scratch only) | TTS with word timestamps; synctoon's default voice + alignment; AIComicBuilder dialogue audio | **Chatterbox (MIT) + Kokoro (Apache-2.0)** as the TTS slots; **Rhubarb (MIT)** replaces the timestamp/alignment function (phoneme timing from the WAV + dialog file, verified run — ledger D) | Wired as slots: `07_dialogue_spec.py` (names the staged weight files in dataset `marsfmmg/mochiichao-voice-weights`, ledger A1 byte-verified) and `02_cue_sheet_adapter.py` (cue/mouth lane). ElevenLabs itself: never wired. |
| **OpenAI text/image** (paid; no standing free tier) | Script assistance, character extraction, prompt writing, DALL-E keyframes | **Local Qwen text** for script assistance + **Qwen2.5-VL-7B-Instruct (Apache-2.0)** for vision/prompt extension; keyframes from Wan/ComfyUI on our seat | Slots wired in `01_pipeline_adapter.py` (`local-qwen-text`, `local-wan-keyframe`). Qwen weights: named + licence-verified in the avatar teardown, staging still owed (freedom PULL-IN-STATUS #2) — **gap flagged**, prompts today come from `prompt_library.json`. |
| **Gemini text/image** (paid tiers; free tier = text/Flash only) | Same as above; Imagen keyframes; Veo video | Same local Qwen + Wan equivalents as above | Same as above. Gemini free tier additionally registered as an OPTIONAL scratch backend — see below; never a dependency. |
| **RunwayML** (paid API; cartoon-story-generator's animator) | Image-to-video for story scenes | Wan 2.2 I2V via scene-job v2 | Item 03 verdict: that repo is unlicenced and not taken; the function is covered by the wired Wan lane. |
| **Anthropic/Claude API** (paid; synctoon LLM cue-picking option) | Per-word animation cue picks | Local model via an OpenAI-compatible local endpoint (synctoon's own Ollama slot proves the shape), or our authored-cue method (Rhubarb + script) | Spec/gap: no LLM cue-picker adapter wired; our dialogue method authors cues without an LLM (item 02). |
| **Modal / RunPod GPU rental** (paid compute; flow's default backends) | Standing GPU generation service | Kaggle seat (job datasets + notebooks) + the headless ComfyUI runner for any future standing GPU | Wired: `run_backend.py` (Kaggle), `06-comfyui-pipeline-runner.py` (HTTP job control, server-agnostic). |
| **Google Flow** (closed, Veo-backed) | Scene-chaining filmmaking UX: character bank + chained scenes | Freedom lane (scene-job v2 + chain_segments) + character bank (item 05) | Wired: `05_character_bank.py` + `05_character_bank_schema.json`. |

## Optional free-proprietary scratch backend (registered, not activated)

- **Gemini free tier** — text/Flash models only. Veo and the image
  models are **not** free tier (corroborated 2026-10-28 against
  summaries of Google's Gemini API pricing page: image/Veo entries
  list free tier as "Not available"). Bucket: **free proprietary**.
  Registered in `backends_optional_scratch.json` as
  `gemini-free-tier-scratch`: scratch prompt experiments only,
  human-rechecked, never a hard dependency, nothing ships from it.
  **Account creation is an OWNER step — no account was created.**
- Free-tier traps recorded for the other services (from the
  addendum research, corroborated for ElevenLabs/Kling by
  terms summaries read 2026-10-28): ElevenLabs free = non-commercial
  + attribution (scratch only); Kling free = watermarked +
  non-commercial (scratch only); OpenAI = no standing free tier
  (paid); Seedance = paid, trial scratch only.

## Rule this map enforces

If a pipeline step names a service from the left column, the build
fails the free rule. The adapters in this folder enforce it
mechanically where they can (`01_pipeline_adapter.py` rewrites and
records paid slots; `07_dialogue_spec.py` only accepts the local TTS
slots).
