# HELPERS LEDGER — avatar-tool helper list (Owner Addenda 2+3+4)

Date: 2026-10-28. Worker: helper-list wiring lane.
Laws applied: construction-kit only (systems/code/patterns — no
branding, no bundled third-party characters/assets carried over);
free rule (paid-cloud-only pieces are never wired as dependencies —
slots replaced by the local Wan/ComfyUI/Chatterbox/Kokoro/Qwen stack
or flagged spec/gap); real-code wiring ("wired" = a real file named
below; everything else is labelled spec/gap); licence honesty
(verified at source before labelling — LICENSE file or model card
read, not the blurb).

**Prior verification reused, not duplicated:** the pull-in ledger
(`~/workspace/pull-in-programme/PULL-IN-LEDGER.md`) A1 (Chatterbox
MIT / Kokoro Apache-2.0, weights staged byte-verified in Kaggle
dataset `marsfmmg/mochiichao-voice-weights`), A2 (Wan kit staging +
the measured ~21 GB Kaggle kernel working quota), D (Rhubarb MIT,
repaired + run-verified); the avatar-stack `backends.json` record
that MuseTalk's LICENSE file is MIT (read at source 2026-10-27 —
re-confirmed this session by reading the file + README licence
section again via the GitHub API). Everything else below was
verified fresh this session via the GitHub PAT connector (repo
metadata, LICENSE files, READMEs, trees, source files) and the
Hugging Face model card for S2V.

| # | Item | Verified licence (bucket) | Wired where / spec-gap | Measurable help or verdict |
|---|---|---|---|---|
| 1 | LingyiChen-AI/AIComicBuilder | **Apache-2.0** (open source; LICENSE read). Its generators are paid hosted APIs (OpenAI/Gemini/DALL-E/Imagen/Kling/Seedance/Veo) — not wired. | **Wired:** `01_pipeline_adapter.py` — AIComicBuilder-style project → scene-job v2 + SRT (dialogue-ratio timing); paid slots rewritten to local backends and recorded as blocked. Doc: `01-aicomicbuilder.md`. | Shot/subtitle conversion is now mechanical; run-tested. |
| 2 | Automate-Animation/synctoon | **GPL-3.0** (open source, copyleft; LICENSE read). Default TTS = ElevenLabs (paid); free alignment = own audio + Gentle. | **Wired:** `02_cue_sheet_adapter.py` — clean-room (no GPL code copied) synctoon CSV ↔ our cue CSV + mouth-data/v1 JSON, Blair mapping with counted unmapped fallbacks. Doc: `02-synctoon.md`. LLM cue-picker step: spec/gap (our cues are authored via Rhubarb + script). | Both directions run-tested (4 frames → 3 runs → 4 frames). |
| 3 | meriasatryan/cartoon-story-generator | **No licence** (no LICENSE file; API 404) — unlicenced. Depends on paid OpenAI + RunwayML APIs. | **Not taken.** Doc: `03-cartoon-story-generator.md`. | Evaluated, not taken: unlicenced code + paid-only generation + pipeline is a subset of item 01. |
| 4 | Topics `comic-generator` (22 repos) + `ai-comic-creator` (2 repos) | At-a-glance API licence fields, table in doc (MIT/Apache/AGPL/none mix). | **Survey only, no wiring.** Doc: `04-comic-topics-survey.md`. Pointers for possible future verification: phaethix/inkstone (MIT, local-first), gzxx-2025/aid-studio (MIT) — neither verified beyond the glance, neither adopted. | Comic-panel output = storyboard/marketing only, per addendum. |
| 5 | OpenX-Inc/flow | **MIT** (open source; LICENSE read). Defaults lean on paid GPU clouds (Modal/RunPod) as deployment choice, not code dependency. | **Wired (clean-room):** `05_character_bank.py` + `05_character_bank_schema.json` — persistent character bank + cross-scene chain plan for scene-job v2. Doc: `05-flow-patterns.md` with the honest comparison: chaining within a job, job format, assembly, TTS slots already covered by the freedom lane; MCP server + publishers = spec/gap / not taken. | Bank + chain-plan run-tested against item 01's output job. |
| 6 | lilinsong1/comfyui-wan-video-pipeline | **Claimed MIT in README, NO LICENSE file** — bucket: claimed-MIT/unverified, reference only, no code copied. | **Wired:** `06-comfyui-pipeline-runner.py` — original stdlib headless ComfyUI runner (POST /prompt, /history poll, /view download, status file, measured run-report for generate_bundle.py). Doc: `06-comfyui-pipeline.md`. | Dry-run tested; live run needs a ComfyUI server (none on this CPU VM) — stated, not claimed. |
| 7 | Talking-avatar stack | S2V-14B: **Apache-2.0** (HF card read). MuseTalk code: **MIT** (LICENSE read); MuseTalk weights: project-stated commercial-ok in README, **no formal weights licence** + component models carry own terms → scratch/eval only. Chatterbox **MIT**, Kokoro **Apache-2.0** (ledger A1). | **Spec with real interfaces:** `07-talking-avatar.md` + `07_dialogue_spec.py` (TTS slots wired to staged weights; Rhubarb→mouth-data spine wired; S2V = spec/gap — 14B checkpoint ≳28 GB and its documented single-GPU path needs 80 GB VRAM vs our T4×2 seat + ~21 GB working quota; MuseTalk = spec only, not staged). | Ships after the core test scene, as ordered. Spec generator run-tested incl. creature-line refusal. |
| 8 | LightX2V | No claim made (repo identity under that name returned 404 — parity lane to pin down). | **Ledger record only:** `08-lightx2v-ledger-note.md`. | Measured baseline recorded: WanVideoWrapper + Turbo LoRA + torch.compile **78.5 s vs 1787.6 s = 22.8×**. Status: evaluation — parity lane. |
| 9 | OpenVINO/NNCF INT4/INT8 | OpenVINO is Apache-2.0 (noted, nothing installed). | **Written verdict only:** `09-openvino-eval.md`. No Wan-on-CPU claim (no upstream Wan pipeline exists in OpenVINO's docs/zoo; CPU arithmetic forbids it; no test run). Candidate only for small CPU utility models (INT4 captioning/text) — unmeasured, unwired. | Evaluated, not taken for video. |
| A4 | Nonfree-equivalents map | Per-row buckets in the doc; Gemini free-tier scope corroborated against pricing-page summaries 2026-10-28. | `NONFREE-EQUIVALENTS.md` + `backends_optional_scratch.json` (Gemini free tier registered as optional free-proprietary scratch backend; **account creation flagged as an OWNER step; no account created; never a hard dependency**). | Every paid service in the pull-in list now has a named local equivalent + file or an explicit gap. |

## Files in this folder

See the size listing in the worker report. All Python
(`01_pipeline_adapter.py`, `02_cue_sheet_adapter.py`,
`05_character_bank.py`, `06-comfyui-pipeline-runner.py`,
`07_dialogue_spec.py`) passed `python3 -m py_compile` and was
run-tested on sample inputs under this folder's scratch area
(removed after testing). No Kaggle was used. No third-party code,
characters, or assets were copied into any file here.
