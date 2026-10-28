# TARGET WIRING REPORT — the owner's nine (Jamar, 2026-10-28)

Rule applied to every item: verify at source before any claim
(repo exists, licence file read, what it actually does, free/local
vs paid-API dependency class). Free/local substance is wired into
the staging structure (`full-stack/src-api/<repo>/` + per-repo
`FETCH-MANIFEST.json` pinning the exact commit and every staged
file's sha256). Paid/API seats are flagged in writing, never
wired as "free." Grades: **WIRED** (evidence named) /
**WIRED-PARTIAL** (missing piece named) / **NOT WIRED** (reason
named).

## 1. OpenX-Inc/flow — **WIRED-PARTIAL**

- Verified: repo exists; **MIT** (LICENSE read at source).
  Staged: 109 of 157 tree files (code/docs/config; binaries and
  >900 KB files listed in its FETCH-MANIFEST), pinned commit
  `19a73be7a86b`, at `src-api/flow/`.
- What it is: an autonomous video pipeline — topic → LLM-written
  narrated script → scene-by-scene Wan 2.2 clips → **scene
  chaining by first/last-frame conditioning** → assembly with
  narration + music → publish. Character consistency via a
  character bank (`src/flow/characters.py`) + reference images /
  subject-driven generation. Ships an MCP server
  (`src/flow/mcp_server/`), a FastAPI app, and a pluggable TTS
  layer.
- Dependency class, seat by seat (from its own
  `config/config.example.toml`, read at source):
  - *Script LLM:* OpenAI-compatible. Default `gpt-4o-mini`
    (**paid API**); DeepSeek (**paid API**); **Ollama local —
    free seat exists** and is documented in the config itself.
  - *GPU video backend:* an HTTP service boundary
    (`src/gpu_backend/client.py`). Default provider **Modal
    (paid cloud)**; RunPod (**paid cloud**); **self-hosted —
    free seat exists**. Its model defaults are the 14B diffusers
    pair (T2V-A14B / I2V-A14B) — datacenter-GPU class, **not
    T4-runnable**; the orchestration itself never touches a GPU.
  - *TTS:* `edge` (Microsoft online voices — free, no cloning)
    default; MisoTTS (local GPU, voice cloning); ElevenLabs
    (**paid API**, key-gated in config).
- What's missing (named): (a) an adapter from flow's GPU-backend
  HTTP contract to our ComfyUI/Kaggle seat — flow expects its
  own FastAPI Wan server (its `gpu_backend/modal_server.py` is
  the reference implementation of that contract); (b) a T4-class
  model configuration — flow has no 1.3B/5B profile, so riding
  our staged weights means serving VACE-1.3B / TI2V-5B behind
  that adapter; (c) it has never been executed here. The
  orchestration code is 100% staged; the run is not claimed.

## 2. lilinsong1/comfyui-wan-video-pipeline — **NOT WIRED** (reason named)

- Verified: repo exists; **no LICENSE file** (root listing +
  staged tree confirm) — so no free licence can be claimed for
  its code, and none is.
- What it is: a personal Hermes-agent skill + shell scripts for
  one Chinese short-video project (real-person style Wan 2.1):
  SSH to a ComfyUI host, audio-first shot production from a
  `script.json` shot list, CosyVoice3 TTS, Jianying (CapCut)
  draft export. Environment-specific throughout (hardcoded
  hosts, paths, project names).
- Why not wired: (a) licence absent — absorbing its *code* would
  be unlicensed reuse; (b) functionally it duplicates the route
  we already run — headless ComfyUI submission/poll/download
  driven by a shot list — which our Kaggle runner already does
  against the staged weights. Its one idea we did not already
  have, audio-first shot timing, is noted for the gag lane. The
  staged copy in `src-api/comfyui-wan-video-pipeline/` is
  reference-only and is labelled as such in the landing package.

## 8. MuseTalk (TMElyralab/MuseTalk) — **WIRED-PARTIAL** (seat confirmed; weights are the named gap)

- Verified at source this pass + parent-lane verification
  (2026-10-28): repo exists; **MIT** (LICENSE read). Architecture
  from its own tree: dual UNet (frozen VAE + Whisper audio
  encoder; trained UNet + positional encoding) — `app.py`,
  `scripts/`, `configs/`, `download_weights.sh` all present in
  the staged copy (`src-api/MuseTalk/`).
- Its place in the wired chain (confirmed): the **human-cast
  lip-sync seat** — downstream of the voice pipe (Chatterbox/
  Kokoro WAV) and upstream of the composite stage; creatures are
  cries-only by voice law, so MuseTalk never touches creature
  footage. This matches its existing `backends.json` entry
  (human-cast candidate, SPEC ONLY there).
- Dependency hygiene, corrected by source evidence: MuseTalk's
  own repo carries **no InsightFace dependency** — the
  non-commercial-research encumbrance belongs to **LivePortrait**
  (which pulls InsightFace for detection/alignment), not to
  MuseTalk. MuseTalk's own seat is clean.
- What's missing (named): its **weights are not staged** (they
  are a `download_weights.sh` pull from HuggingFace, ~4 GB class,
  not in any staged dataset) and it has **never been run** on
  this show's material. Code staged + seat confirmed = partial;
  no output is claimed.

## 3. Wan-Video/Wan2.2 official suite (S2V-14B + Wan-Animate) — **WIRED-PARTIAL**

- Verified: repo exists; **Apache-2.0** (LICENSE.txt read at
  source). Official inference code for both seats lives in this
  repo (`generate.py --task s2v-14B … --offload_model True`;
  Animate integrated, also in Diffusers since 2025-11).
  Source staged at `src-api/Wan2.2/` with its FETCH-MANIFEST.
- The seats: **S2V-14B** = speech-to-video (image + audio →
  talking video; CosyVoice TTS integration in-repo) — the
  human-cast dialogue seat beside MuseTalk. **Animate-14B** =
  character animation/replacement from a driving video — the
  performance-transfer seat, and the strongest known route to
  "correct character performs the action" at full quality.
- What's missing (named): **the weights are not staged.**
  Each is a ~28 GB-class 14B checkpoint (HF `Wan-AI/…`,
  Apache-2.0); neither is in any staged Kaggle dataset, and
  both are T4-marginal even with offload/quantization
  (LightX2V, item 4, is the designated seat if Animate is
  evaluated). Code + entry points wired; no run claimed.

## 6. LingyiChen-AI/AIComicBuilder — **NOT WIRED** (paid-API shell; seats flagged)

- Verified: repo exists; **Apache License 2.0** (LICENSE present;
  README's licence section names it). Source staged at
  `src-api/AIComicBuilder/` for the record.
- What it is: a comic-production web app (projects, storyboard,
  subtitles, provider routing) whose **every generation seat is
  a hosted paid API**, from its own README provider table:
  text = OpenAI / Gemini; image = OpenAI DALL-E / Gemini Imagen
  / Kling; video = Seedance / Kling / Veo. There is **no local
  generator path** — its `.env.example` carries only app
  plumbing (database, upload dir).
- Verdict: nothing free/local to wire. Its orchestration ideas
  (per-project provider config, storyboard-first flow) duplicate
  what flow (item 1) already gives us under MIT with free seats
  available. Every seat above is flagged **paid/proprietary**;
  none is presented as free anywhere in this package.

## 7. meriasatryan/cartoon-story-generator — **NOT WIRED** (reasons named)

- Verified: repo exists; **no LICENSE file** (checked: 404).
- What it actually is (from its README + tree): a small
  single-author demo pipeline — BLIP captioning (local) → GPT
  prompt writing (**OpenAI, paid**) → ControlNet + DreamShaper
  cartoonization (local SD) → GPT story prompts (**paid**) →
  **RunwayML (paid hosted API)** for the animation itself.
- Verdict: unlicensed code whose one animation seat is a paid
  hosted service, and whose local pieces (BLIP, SD cartoonize)
  duplicate seats we already hold. Nothing to wire.

## 9. GitHub topics sweep (comic-generator + ai-comic-creator) — **discovery only, as ordered**

- Swept via the GitHub API (24 repos across both topics,
  2026-10-28). Nothing was wired from the sweep.
- The one substantial find: **gzxx-2025/aid-studio** (MIT,
  ~1,157 stars, actively pushed 2026-10-22) — a self-deployable
  AI comic/drama/film platform (script, characters/scenes,
  smart storyboard, image + video generation, dubbing, finished
  preview; multi-model access). "Multi-model" platforms of this
  class usually route generation to hosted APIs; it is named
  here as the **top candidate for a future source-verification
  pass**, not as a wired component.
- Smaller aligned finds, noted only: **phaethix/inkstone**
  (MIT, local-first novel-to-comic, "free, no GPU, pluggable
  providers"), **BotTony329/mangaharness** (local-first manga
  harness, reusable characters; licence NOASSERTION —
  unverified), **Saeyeon-developer/agent-comic-kit**
  (Apache-2.0, consistent characters + storyboard; tiny).
- Rejected on sight, with reasons: API-wrapper skills whose
  seats are Seedance/Gemini/DeepSeek (paid), a Microsoft Comic
  Chat port (not a generator), unlicensed repos, and a 2023
  abandoned repo.

## 4. LightX2V (ModelTC/LightX2V) — **WIRED-PARTIAL**

- Verified: repo exists; **Apache-2.0** (LICENSE read at source).
  Staged at `src-api/LightX2V/` — **partial tree, named:** the
  repo has 3,497 files; the stager's 500-file cap landed the
  `lightx2v/` package core (attention/caching/model code) +
  configs, with the long tail (kernel-skill docs, examples)
  listed as skipped in its FETCH-MANIFEST. The wireable
  substance — the inference package — is present.
- What it is: the acceleration layer for Wan-class models —
  FP8/NVFP4/GGUF quantization, 4-step distilled model support,
  block offloading, TeaCache/MagCache — with Wan 2.1/2.2 runner
  scripts and a Wan-Animate requirements seat in-repo.
- Role in our chain (named): (a) the designated runtime seat if
  Wan-Animate-14B is ever evaluated on T4-class hardware
  (offload + quantization is the only credible path); (b) the
  step-distillation seat for cutting our 30-step VACE runs.
  Honest constraint, from its own release notes: its newest
  quantization wins (NVFP4) target Blackwell-class GPUs, not
  T4 (Turing) — the T4-usable parts are GGUF/FP8 paths and
  offloading, not the headline 50× figures.
- What's missing (named): runtime integration — no LightX2V
  runner has been executed here; it stands beside the one wired
  ComfyUI route, deliberately not bolted on mid-pass (one wired
  route, per the absorb-don't-duplicate order).

## 5. synctoon (Automate-Animation/synctoon) — **WIRED-PARTIAL**

- Verified: repo exists; **GPL-3.0** (LICENSE read at source).
  Staged at `src-api/synctoon/`: the full `core/` code
  (create_animation.py, core.py, frame_generator.py,
  frame_to_video.py — verified present); the 1,543-file tree's
  bulk is example character art, skipped as binary assets and
  listed in its FETCH-MANIFEST.
- What it is: script → per-word staging decisions (head angle,
  eyes, gesture, background, zoom) → g2p phonemes → viseme
  mouth shapes → **one editable CSV row per frame** → PIL
  cut-out frame render → 24 fps video. Its seat here: the
  **puppet/gag lane tool** — the CSV-cue discipline is exactly
  the control surface the chibi-walk/ED-gag lane needs.
- Dependency class, from its README + requirements (read at
  source): LLM seat = Anthropic / Gemini / OpenAI-compatible —
  **hosted seats are paid**; **local Ollama / LM Studio / vLLM
  is a documented free seat**. Voice seat = **ElevenLabs (paid
  API)** by default; bring-your-own-audio + Gentle (local
  Docker aligner) is the free path. For our chain the voice
  seat is already filled by Chatterbox/Kokoro and the viseme
  seat by Rhubarb (wired + proven) — synctoon's defaults are
  flagged, not adopted.
- Copyleft note for the landing lane: GPL-3.0 — keep synctoon a
  standalone production tool; do not link it into shipped game
  code.
- What's missing (named): it has not been executed here; first
  run belongs with the gag lane's next instance, using our own
  character art in place of its example cast.

## Grade summary

| # | Item | Grade |
|---|---|---|
| 1 | OpenX-Inc/flow | WIRED-PARTIAL (adapter + T4 profile named; paid seats flagged) |
| 2 | lilinsong1/comfyui-wan-video-pipeline | NOT WIRED (no licence; function already covered) |
| 3 | Wan-Video/Wan2.2 (S2V + Animate) | WIRED-PARTIAL (code staged; weights not staged) |
| 4 | LightX2V | WIRED-PARTIAL (package staged, cap noted; not yet executed) |
| 5 | synctoon | WIRED-PARTIAL (code staged; not yet executed; paid defaults flagged) |
| 6 | AIComicBuilder | NOT WIRED (all generation seats paid hosted APIs — flagged) |
| 7 | cartoon-story-generator | NOT WIRED (unlicensed; animation seat is paid RunwayML) |
| 8 | MuseTalk | WIRED-PARTIAL (code + chain seat confirmed; weights not staged) |
| 9 | Topics sweep | DONE as discovery (aid-studio held for future verification) |

No item is claimed "100% wired": the two NOT-WIRED-by-design
items have nothing free to wire, and every WIRED-PARTIAL names
its missing piece above. The generation proof that this whole
exercise serves is graded separately in FULL-STACK-REPORT.md —
both VACE attempts are **NOT GRADED**: attempt 2 ran to
completion and its frames are stranded behind the Kaggle
output-endpoint rate limit, while attempt 1's kernel status,
re-checked later the same day, reads **ERROR** (the earlier
COMPLETE claim is withdrawn in the run record's correction
block). Retrieval commands are recorded, one per attempt.

---

## ADDENDUM (2026-10-28, later the same day) — deep-dive refinements

A dedicated verify-at-source pass over items 6, 7, and 9
(GitHub API, file-by-file) confirms every grade above and adds
the following, which refines — and in one place corrects — the
record:

- **Item 6 (AIComicBuilder): grade stands (NOT WIRED as a
  generation tool), one understatement corrected.** The seat
  list in §6 was incomplete: the code also wires DashScope
  image models (Qwen-Image / Wan 2.7 Image / Z-Image), Seedance
  via TWO hosts (Volcengine Ark + UCloud ModelVerse), hosted
  Wan video via DashScope (Alibaba's cloud API — not local
  weights), and a Bailian / Dify / Coze agent layer. 100% of
  generation remains paid hosted API; there is no local
  generation path anywhere in the tree (zero `ollama` /
  `comfyui` hits). **However**, its non-generative layer is
  genuinely free/local and separable, which §6 understated:
  the Project/Episode/Character/Shot schema + migrations, the
  storyboard editor and task queue, script import
  (TXT/DOCX/PDF), the **prompt registry/templates** (the single
  most valuable asset — incl. four-view character-consistency
  prompting), and a **complete FFmpeg finish layer** (SRT
  generation + burn-in, xfade assembly, drawtext title/credit
  cards, BGM mix) all run with zero external API. It stays
  unwired because our composite/render stage already covers
  the finish function and flow covers orchestration — but the
  prompt registry is named here as available, Apache-2.0
  substance if the landing lane wants it. Also noted: the app
  is shot-based; it has **no comic-panel layout engine**.
- **Item 7 (cartoon-story-generator): grade stands, one fact
  added.** Its one local path (ControlNet + DreamShaper
  cartoonization) is **broken as shipped** — `cartoonizer.py`
  calls `create_pipeline` with 7 positional arguments against
  a 3-parameter signature, so the default path raises
  TypeError. Paid seats confirmed exactly: OpenAI GPT-4
  (prompts/story) + RunwayML Gen-3a Turbo (video). Licence
  absence re-confirmed (all rights reserved — its code may not
  be copied at all).
- **Item 9 (sweep): two seat flags added, one licence note.**
  phaethix/inkstone (MIT) routes generation to the **Agnes
  cloud API** — "local-first" is its shell, not its generator.
  Saeyeon-developer/agent-comic-kit (Apache-2.0) runs on a
  **Codex / GPT-Image backend** (paid seat). BotTony329/
  mangaharness carries MIT LICENSE *text* despite the API's
  NOASSERTION flag. stockedge/manga-generator (MIT, the
  topic's top repo) is rejected precisely: it is a
  **Codex-dependent harness**, not a standalone free stack.
  aid-studio's MIT licence is re-confirmed. One survey-side
  rejection from the same pass: **ComfyUI-MultiGPU** is being
  archived 2026-09-30 and is unmaintained — rejected as a
  T4×2 adjunct; its DisTorch device-splitting idea remains a
  concept reference only.
