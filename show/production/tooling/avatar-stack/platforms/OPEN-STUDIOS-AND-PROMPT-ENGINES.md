# Open Studios, Prompt Engines & Wrappers — follow-up verification (2026-10-28)

Companion to OPEN-IMPLEMENTATIONS.md (PR #491). Every item below was
verified at source in this pass: repo metadata + licence via the GitHub
API, licence files read in the tree, READMEs read for actual function.
Claims come from the owner's pasted research (2026-10-28); verdicts are
ours, from the sources named.

## Confirmed fact: Seedance 2.5 has NO open/decompiled/local version

Seedance 2.5 is a closed, hosted ByteDance model. No weights have been
published (nothing on ByteDance Seed's Hugging Face or GitHub), there is
no local file or binary to decompile, and no decompiled or
reverse-engineered copy of the model exists. Access is hosted only:
BytePlus ModelArk / Volcengine Ark APIs, Dreamina, and partner platforms.
Corroborated by the pasted sources (krea.ai "Can you run Seedance 2.5
locally", ai-inspo "Is Seedance 2.5 open source") and by our own check of
seeddance.io's dated verification (2026-10-13): "Seedance 2.5 is a
closed, hosted model… Repositories with Seedance in the name are prompt
collections, skills or API wrappers." That last sentence is exactly what
items 3–5 below are.

## 1. Autom8AI/Open-Higgsfield-AI — PATTERN SOURCE ONLY (no licence)

- Exists: 1,596 stars, actively pushed (2026-10-25). Four studios
  (Image, Video, Lip Sync, Cinema), multi-image input up to 14
  references, upload-history reference library, Electron desktop app.
- Licence: **NONE — no LICENSE file in the repo tree.** No licence =
  all rights reserved; its code is NOT adopted, not copied, not run as
  ours. "Open source" in its README is a claim its own tree does not
  back with a licence.
- Claim check: the pasted claim "runs local open models (Wan 2.2, Flux)
  or plugs into APIs" is **half wrong** — the README states it is
  "Powered by Muapi.ai": generation routes through the MuAPI aggregator
  (paid API keys), including its Wan 2.2 / Flux / Kling / Veo listings.
  It is a self-hostable UI over hosted APIs, not a local engine host.
- What we take (patterns, in our own words): multi-image reference
  input with ordered selection; a persistent reference-image library
  reused across sessions (mirrors our reference-packs); per-studio mode
  switching keyed on whether a reference was provided.

## 2. wide-trace/open-higgsfield — PRIMARY PATTERN SOURCE (no licence)

- Exists: 4,926 stars, Next.js studio, one prompt bar for image+video,
  38-model catalog, gallery/history with reuse.
- Licence: **NONE — no LICENSE file in the repo tree.** Same bar as
  item 1: code not adopted.
- Why it is the primary pattern source of the two: two of its design
  decisions map directly onto our tooling —
  (a) **per-model declarative settings**: each model declares its own
  allow-list of settings (aspect, resolution, duration, audio, caps)
  and the studio renders exactly that — this is the design our
  `job_profiles.json` already follows; the pattern is confirmed sound
  and we keep extending profiles this way rather than hardcoding
  per-platform forms;
  (b) **media inputs by role**: start frame / end frame / references /
  video / audio, each with the per-role cap the model declares — the
  same role map our prompt patterns now use (see PROMPT-PATTERNS.md
  follow-up section).
  Plus: reuse-restores-model+settings+prompt (our job records already
  log the full job; the pattern validates keeping them replayable).
- Autom8AI (item 1) is survey-named for breadth (lip-sync studio,
  desktop shell); wide-trace is the pattern source for the job-desk
  design. Neither's code enters the repo.

## 3. allenGKC/Seedance-2.5 — ADOPTED (patterns), MIT verified

- Exists: 101 stars. Licence: **MIT** (LICENSE file in tree; GitHub API
  spdx MIT).
- Actual function matches the claim: a "Codex Skill OS" — an agent
  skill (`skill/seedance-25/`) that compiles a plain-language idea into
  mode/duration/aspect routing, a reference ROLE MAP, and one
  paste-ready prompt, plus reference docs (prompting, prompt-recipes,
  long-video, editing, troubleshooting, white-model-storyboard).
- Wired: its prompt-math patterns are adapted into PROMPT-PATTERNS.md
  (follow-up section, with attribution): reference declaration/role
  map, timestamp beat structure, failure-diagnosis → prompt-rewrite
  loop, seamless extension recipe, multi-panel storyboard recipe.
  Adapted to our engines (Wan/Kaggle backend, Flow/Kling test lanes) —
  the patterns are engine-agnostic prompt structure, not Seedance
  internals.

## 4. ZeroLu/awesome-seedance-2.5 — MINED (with attribution), MIT verified

- Exists: 145 stars, actively updated (2026-10-28). Licence: **MIT**
  (LICENSE file in tree).
- Actual function: a curated, categorised collection of finished
  Seedance 2.5 prompts + example videos (cinematic, advertising, UGC,
  anime & animation, drama, memes, VFX).
- Mined for PROMPT-PATTERNS.md where the licence allows (MIT, with
  attribution): the multi-reference test construction (its "Antique
  Market Multi-Reference Test") and the anime/animation category's
  prompt shapes. Individual prompts are NOT copied into episode work;
  the structural patterns are what transfer (construction-kit rule).

## 5. API wrappers for PAID backends — ADAPTER SPECS ONLY, bucket PAID

Specs added to `job_profiles.json` / `job_profiles.md`. No accounts
created, no keys, nothing purchased — using any of these is an owner
purchase decision.

| Wrapper | Verified facts | Backend (all paid) |
|---|---|---|
| SamurAIGPT/Seedance-2.5-API | MIT wrapper (LICENSE in tree), 499 stars; Python SDK + MCP server over 72 Seedance 2.5 routes (T2V/I2V/first-last-frame/omni-reference/edit/extend, 4–30s, up to 30 img/10 vid/10 audio refs) | **MuAPI** — and its README states Seedance 2.5 there is early-access gated to MuAPI Pro/Business plans |
| ai-models-lab/seedance-2.5 | CLI + batch generator, 7 stars; **NO licence file** — spec/pattern only, its code is not adopted | Volcano Ark (official ByteDance), Fal.ai, or Replicate — all paid per use |
| higgsfield-ai/cli | **Official** Higgsfield org repo, MIT (LICENSE in tree), 687 stars; terminal client for 40+ Higgsfield models (Seedance 2.5, Kling v3.0, Veo 3.1, Soul V2…); its MODELS.md is the provider's own model/parameter list — a good spec source. Requires `higgsfield auth login` = a Higgsfield account | Higgsfield's paid platform |

Note on the SamurAIGPT author's sibling project (a "Seedance watermark
remover"): watermark strippers were already refused in
FREE-EQUIVALENTS.md (PR #491) and stay refused.

## 6. LTX Video / LTX Lipsync (Lightricks) — EVAL SLOT, licence SPLIT

Verified at source, code and weights SEPARATELY:

- **Code: Apache-2.0.** GitHub API on Lightricks/LTX-Video:
  `"spdx_id": "Apache-2.0"` (11,205 stars, official repo).
  Lightricks/ComfyUI-LTXVideo nodes exist, but that repo's LICENSE file
  is the LTX-2 Community License Agreement (dated 2026-01-05) — the
  node pack for the newer models rides the weights licence, below.
- **Weights: NOT open.** Hugging Face licence field reads **"other"**
  on Lightricks/LTX-Video, Lightricks/LTX-2, and Lightricks/LTX-2.3;
  LTX-2's licence name is `ltx-2-community-license-agreement` — a
  custom Lightricks community licence, not an OSI licence. This
  confirms PR #491's LTX-2 disposition and extends it to the whole LTX
  weights line.
- **Speed profile (vendor numbers, H100):** 13B distilled generates HD
  in ~10s with a low-res preview at ~3s; up to 60s clips (v0.9.8);
  a 2B distilled exists for light hardware; FP8 variants published.
  "LTX Lipsync" is a workflow/model variant in the same ecosystem
  (also the name of a studio inside item 1's UI) — audio-driven lip
  movement for iteration on dialogue shots.
- **Assessment as our fast-iteration slot:** the speed profile is
  exactly the rapid-previs slot our stack lacks beside Wan (our
  measured native scene run was ~3h56m; even the accelerated path is
  unproven at scene scale). Disposition: **EVAL SLOT (previs/iteration
  only)** — profile wired in job_profiles; staging plan below; outputs
  do NOT ship. It does NOT become a shipping engine unless the owner
  accepts the LTX community licence after a full-text read (owner
  decision, same as PR #491 recorded for LTX-2).
- **Staging plan (nothing downloaded in this pass — staging law):**
  stage ONCE to the private Kaggle cache + TeraBox master, md5-verified,
  manifest entry pointing at it: `ltxv-2b-0.9.8-distilled-fp8` (4.46 GB)
  for the first eval (fits free-tier GPUs), with
  `ltxv-13b-0.9.8-distilled` (28.58 GB) as the quality-step option.
  Local disk stays a workbench.

## 7. Claim check: "ElevenLabs hosts Seedance, usable on the free tier"

**Verdict: hosting TRUE, free-tier usability NOT TRUE as stated.**

- Hosting is real: ElevenLabs' ElevenCreative includes Seedance video —
  Seedance 2.0 (reported as "included with all paid ElevenLabs plans")
  and Seedance 2.5 (in ElevenCreative since July 2026; the Chimera
  voice+video workflow, Oct 2026, is built on it).
- The free tier does not make it a free route: (a) ElevenLabs' free
  plan is 10,000 credits/month and **non-commercial** (commercial
  licence starts at Starter) — reported consistently from
  elevenlabs.io/pricing, Oct 2026 (the pricing page itself could not be
  fetched directly in this pass; three independent reviews quoting it
  agree on the numbers); (b) video burns the pool far faster than audio
  — one reviewer measured two short lip-sync clips at 11,547 credits,
  more than a whole free month; (c) an integrator's docs note the
  Image & Video API is Pro-plan gated and ByteDance models are disabled
  by default without explicit approval.
- Bucket: ElevenLabs video = **paid**. The free tier is
  **free-but-restricted** (non-commercial) and is, at most, an
  audio-side evaluation route — it is NOT wired as a Seedance test
  route. The working free Seedance test route is Dreamina
  (FREE-TEST-ROTATION.md).

## Refused in this pass

- **The "bypass IP/copyright filters" tutorial class** from the same
  pasted research (isolating vocal tracks, stripping audio fingerprints,
  feeding depth-mask videos to force generations onto famous movie
  scenes / copyrighted IP or to evade platform filters): **REFUSED —
  not taken, not wired, not linked as a technique.** It exists in the
  record only as this refusal. (Our refusal list's other standing
  entries are in FREE-EQUIVALENTS.md.)
