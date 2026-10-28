# Open Implementations Hunt — verified at source, 2026-10-28

Owner's addendum 3: for each commercial feature, hunt the best GENUINELY
OPEN implementation (open weights + open code, real licence file verified
at source). Method: provider repos / HF model cards / licence APIs only.
Leaked, decompiled, or cracked copies of proprietary platforms are OUT —
see the refused list in FREE-EQUIVALENTS.md.

## Adopted as eval slots (licence verified at source)

| Candidate | Feature it answers | Licence evidence (source) | Function evidence | Status |
|---|---|---|---|---|
| **FastVideo + FastWan** (hao-ai-lab) | hosted speed | GitHub API on hao-ai-lab/FastVideo: `"spdx_id": "Apache-2.0"`; lab blog: "All resources — model weights, training recipe, and dataset — are released under the Apache-2.0 license" | FastWan2.2-5B: 5s 720p in 16s end-to-end on one H200 (lab's table); sparse-distillation, 3-step inference | EVAL SLOT in PRODUCTION-PATTERN.md (Fast Lane upgrade). Not yet run on Kaggle hardware — vendor numbers are H200 numbers |
| **Phantom-Wan** (ByteDance research) | reference-to-video fidelity + persistent identity | HF API on bytedance-research/Phantom: `cardData.license: apache-2.0`; weights present incl. Phantom-Wan-1.3B and Phantom_Wan_14B safetensors | Paper (ICCV 2025): subject-consistent generation from 1–4 reference images; paper warns more subjects → less stable; prompts must describe each subject explicitly (folded into PROMPT-PATTERNS.md) | EVAL SLOT (reference eval). Not yet run on our cast |
| **MultiShotMaster** (KlingAIResearch — the Kling team's research arm) | multi-shot in one generation | GitHub API search: KlingAIResearch/MultiShotMaster, `"spdx_id": "Apache-2.0"`, "Official Implementation", CVPR 2026 | Global description + per-shot captions + character/background reference images; 1–5 shots, up to 308 frames, one pass, built on Wan 14B | EVAL SLOT (multi-shot eval). Not yet run |
| **HuMo** (ByteDance research) | native audio + identity for HUMAN dialogue shots | HF API on bytedance-research/HuMo: `cardData.license: apache-2.0`; 1.7B + 17B weights present | Text+image+audio → 97-frame (~3.9s) human-centric clips with lip sync; merged into ComfyUI-WanVideoWrapper per its README. Human-centric: NOT a creature engine | EVAL SLOT (human dialogue only) |
| **Qwen-Image-Edit / Qwen-Image-2512** (Alibaba Qwen) | character-sheet generation | HF API: `cardData.license: apache-2.0` on both model cards | Edit model does in-context edits incl. novel-view rotation from a source image — the sheet-view use case; ComfyUI-native | NAMED as the Sheet Assembly engine for the owner-approved sheet step. Not run (sheet generation is an owner-visible step) |
| **Wan 2.2 + VACE + musubi-tuner** (already ours) | reference lock, identity, chaining | Apache-2.0 (verified in the parity round) | Our production backend today | WIRED + IN USE (likeness proof pending locked run) |

## Checked and NOT adopted (with reason)

| Candidate | Why not |
|---|---|
| Qwen-Image-2.1 | HF licence = Qwen Research License, non-commercial → free-but-restricted; refused for shipping (see FREE-EQUIVALENTS.md) |
| LTX-2 / LTX-2.5 (Lightricks) | Real multi-shot + native audio, but HF licence field = "other" (custom community licence). Not OSI open; not wired pending a full-text legal read (owner decision) |
| SkyReels-V3 R2V (Skywork) | Reference-to-video weights exist, but under the Skywork Community License (custom; commercial allowed with conditions). Free-but-restricted; eval only |
| MiniMax H3 / FastH3 Omni | MiniMax-H3 Community License + region exclusions on local deployment. Refused for the shipping route |
| StoryMem / HoloCine / VGoT (multi-shot research) | Real research projects (Wan-based), but licence + weight availability not verified at source in this pass; MultiShotMaster covers the slot with a verified Apache-2.0 licence. Re-check if the slot needs a second option |
| IP-Adapter (image prompting, Apache-2.0) | SD-era still-image technique; superseded in our stack by VACE reference control on the video model itself. Not needed |

## Follow-up pass (2026-10-28) — studios, prompt engines, LTX, wrappers

Full record: OPEN-STUDIOS-AND-PROMPT-ENGINES.md (same folder).

| Candidate | Licence evidence (source) | Disposition |
|---|---|---|
| allenGKC/Seedance-2.5 (prompt-compiler skill) | MIT — LICENSE file in tree + GitHub API spdx | ADOPTED as patterns: role map, timestamp beats, failure-repair loop, extension/storyboard recipes → PROMPT-PATTERNS.md (attributed, adapted) |
| ZeroLu/awesome-seedance-2.5 (curated prompts) | MIT — LICENSE file in tree + GitHub API spdx | MINED as patterns: multi-reference test construction, anime-category prompt shapes → PROMPT-PATTERNS.md (attributed) |
| wide-trace/open-higgsfield (studio UI) | **No LICENSE file** (GitHub API license: null; tree checked) | PRIMARY PATTERN SOURCE only: per-model declarative settings + media-inputs-by-role design confirmed for our job profiles. Code NOT adopted |
| Autom8AI/Open-Higgsfield-AI (studio UI) | **No LICENSE file** (same check) | Survey-named (lip-sync studio breadth; MuAPI-powered — routes to paid APIs, does not host local models despite the pasted claim). Code NOT adopted |
| LTX-Video (Lightricks) | Code Apache-2.0 (GitHub API); **weights "other"** on all HF repos (LTX-2 licence name: `ltx-2-community-license-agreement`) | EVAL SLOT (fast iteration/previs): profile wired, staging plan written (2B distilled FP8 4.46 GB first), outputs do not ship; shipping = owner licence decision |
| SamurAIGPT/Seedance-2.5-API / ai-models-lab/seedance-2.5 / higgsfield-ai/cli | MIT / no licence / MIT (official) respectively | ADAPTER SPECS ONLY in job_profiles — every backend behind them is paid (MuAPI Pro-gated, Volcano Ark/Fal/Replicate, Higgsfield account). No accounts, no keys |

## Staging note

None of these weights were downloaded to local disk (staging law +
workspace rule: GitHub for code/docs/manifests, Kaggle/TeraBox for
weights). Each eval slot lands on the Kaggle lane the same way Qwen2.5-VL
was staged in the parity round: staged once in the private Kaggle cache,
md5-verified, manifest entry pointing at it.
