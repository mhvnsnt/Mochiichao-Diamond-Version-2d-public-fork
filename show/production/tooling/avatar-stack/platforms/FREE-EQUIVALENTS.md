# Free Equivalents — every commercial feature, obtained free

Status: CURRENT, 2026-10-28. Rule (owner's construction-kit rule): every
capability on the commercial list gets a CLEAN-ROOM functional equivalent
built from free parts, under OUR names, wired into this repo. No paywall
bypass, no cracked/leaked anything, no hosted proprietary models with the
branding stripped. Commercial free tiers are evaluation/scratch only and
are labelled free-but-restricted wherever they appear.

## The map

| Commercial feature (their name) | Our equivalent (our name) | Wired where | Bucket |
|---|---|---|---|
| Elements (Higgsfield/Kling reusable reference libraries) | **Reference Packs** — per-character packs: canon views, palette notes, do-not-change traits, pack manifest | `reference-packs/` (this landing) | ours — built from canon art |
| Soul ID (Higgsfield persistent identity trained from 20+ photos) | **Cast Lock** — reference pack + VACE reference control + per-character LoRA, as one named identity system | pack system + `parity/workflow-i2v-locked.json` (VACE wire verified ENGAGED) + `lora/` (wispkin, dorowani sets trained) + `parity/preflight.py` (refuses to run with an unlogged reference) | open source parts (Wan 2.2 Apache-2.0; musubi-tuner Apache-2.0) |
| Hosted multi-shot in one generation (Kling Multi-Shot, Seedance 2.5) | **Shot Groups** — multi-shot grouping in the job format + segment chaining; PLUS the genuinely-open single-pass option, MultiShotMaster (KlingAIResearch, Apache-2.0, CVPR 2026, built on Wan) as an eval slot | job `multi_shot_group` field (platforms/job_profiles.json) + `freedom/chain_segments.py` (verified on main) + MultiShotMaster eval slot (OPEN-IMPLEMENTATIONS.md) | open source (Apache-2.0) |
| Hosted speed (minutes per clip) | **Fast Lane** — Turbo/FastWan accelerated path now; FastWan via FastVideo (Hao AI Lab, Apache-2.0) as the upgrade eval slot | `parity/workflow-turbo-fixed.json` + FastVideo eval slot | open source (Apache-2.0) |
| Reference-to-video fidelity (Seedance/Kling reference modes) | **VACE reference lock** now; **Phantom-Wan** (ByteDance research, Apache-2.0; 1–4 reference images, subject-consistent) as the eval slot if VACE underperforms on multi-subject shots | `parity/workflow-i2v-locked.json`; Phantom eval slot | open source (Apache-2.0) |
| Native audio inside generation (Seedance/Kling/Veo) | **Voice & Music Lanes** — Chatterbox (MIT) / Kokoro (Apache-2.0) for voices, ACE-Step for music, laid in at composite; creatures = cries, humans = speech. HuMo (Apache-2.0) noted as an eval slot for audio-driven HUMAN dialogue shots only (human-centric model; 97-frame clips) | audio lanes staged in the stack (prior rounds); composite step of PRODUCTION-PATTERN.md | open source (MIT / Apache-2.0) |
| Platform character-sheet generators | **Sheet Assembly** — canon art first; missing views GAP-flagged in the pack manifest; when the owner approves generation, the engine is Qwen-Image-Edit (Apache-2.0, verified on its HF card) driven from the canon front view | `reference-packs/PACK-MANIFEST.md` gap table | open source (Apache-2.0) |

## Follow-up rows (2026-10-28 — see OPEN-STUDIOS-AND-PROMPT-ENGINES.md)

| Commercial feature (their name) | Our equivalent (our name) | Wired where | Bucket |
|---|---|---|---|
| Higgsfield studio UI (hosted studio: prompt bar, model catalog, camera controls, galleries) | **Job Desk pattern** — our ComfyUI workflows + `job_profiles.json`, extended with the two verified open-studio design patterns: per-model declarative settings (each profile declares its own allow-list) and media-inputs-by-role (start/end frame, references, video, audio with per-role caps), after wide-trace/open-higgsfield | `platforms/job_profiles.json` + `.md` design rules; pattern record in OPEN-STUDIOS-AND-PROMPT-ENGINES.md §§1–2 | pattern only — BOTH open-studio repos carry NO licence file, so no code was adopted from either |
| Hosted fast iteration (LTX-class speed: seconds per clip) | **Fast Iteration (eval)** — LTX distilled models as the rapid-previs slot beside Wan: vendor profile ~10s per HD clip (H100, 13B distilled), 2B distilled FP8 (4.46 GB) as the staged first eval | profile `ltx-fast-iteration` in job_profiles; staging plan in OPEN-STUDIOS-AND-PROMPT-ENGINES.md §6 | code open source (Apache-2.0) / **weights free-but-restricted** (custom LTX community licence, HF "other") — EVAL ONLY, outputs do not ship; shipping use needs the owner's full-text licence acceptance |
| Seedance prompt engineering (the "prompt math" around a closed model) | **Prompt Compiler patterns** — reference role map, timestamp beats, failure-diagnosis rewrite loop, extension + storyboard recipes, adapted into our library from allenGKC/Seedance-2.5 (MIT) and ZeroLu/awesome-seedance-2.5 (MIT), with attribution | `platforms/PROMPT-PATTERNS.md` follow-up section | open source (MIT) — patterns adapted, not the closed model |

## Measured numbers for the equivalents (honest)

- Fast Lane, measured: 78.5s for a short test clip vs 1,787.6s native
  (22.8×, wrapper A/B, 2026-10-27). **Scene-scale: UNPROVEN** — the same
  honesty we demand of the platforms' marketing.
- FastWan (vendor's own numbers, H200 hardware — not Kaggle): 5s 720p in
  16s end-to-end for FastWan2.2-5B. Promising, unverified on our hardware.
- Cast Lock: components wired and preflight-tested (14/14); the locked
  end-to-end run is PENDING (Kaggle rate limit at wiring time). Two
  UNLOCKED proofs were graded FAIL (SSIM 0.29–0.40) and that evidence is
  in `parity/PARITY-REPORT.md` — the lock exists precisely because of it.
- Shot Groups chaining: wired (`freedom/chain_segments.py`); a 10.125s
  scene has been produced and harvested on the unlocked path.
- MultiShotMaster / Phantom-Wan / FastVideo: verified open at source
  (licence + function), landed as EVAL SLOTS — not yet run on our cast.
  Running them is GPU work for the Kaggle lane, staged per the staging
  law (weights to Kaggle/TeraBox, never bulk-downloaded to local disk).

## Refused, and why (the boundary held)

- **Qwen-Image-2.1** — newer Qwen image model, but its HF licence is the
  Qwen Research License (non-commercial). REFUSED for the shipping route;
  the Apache-2.0 Qwen-Image-Edit / Qwen-Image-2512 are the picks instead.
  This is exactly the trap the licence law exists for: "newer" ≠ freer.
- **LTX-2 / LTX-2.5** (Lightricks) — genuinely multi-shot + native audio,
  but the HF licence field reads "other" (custom community licence, not
  OSI open). NOT wired as a shipping engine; full-text legal read would
  be an owner decision.
- **SkyReels-V3** (Skywork) — reference-to-video open weights, but under
  the Skywork Community License (custom; commercial use allowed per its
  text, with conditions; not OSI open). Classified free-but-restricted:
  eval only until the full text is read and accepted.
- **MiniMax H3 / FastH3** — MiniMax-H3 Community License with region
  exclusions for local deployment. Refused for the shipping route.
- **Any leaked/cracked copy of Seedance, Kling, Veo, or Higgsfield
  internals** — none was sought, found, or used. The equivalents above
  are clean-room: public docs, public outputs, published research, and
  legitimately open artifacts only.
- **The "bypass IP/copyright filters" tutorial class** (added
  2026-10-28, from the follow-up research: isolating vocal tracks,
  stripping audio fingerprints, feeding depth-mask videos to force
  generations onto famous movie scenes / copyrighted IP or to evade
  platform safety filters) — REFUSED: not taken, not wired, recorded
  only as this refusal (OPEN-STUDIOS-AND-PROMPT-ENGINES.md).
- **ElevenLabs as a "free Seedance route"** — the claim does not
  survive verification (hosting real, free-tier usability not): it is
  not wired as a test route; the working free Seedance route is
  Dreamina (FREE-TEST-ROTATION.md).
