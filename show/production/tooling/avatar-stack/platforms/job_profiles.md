# Job Profiles — platform targets for the job format (human-readable)

Machine-readable source: `job_profiles.json` (same folder). This file is
the plain-words companion. Format: a job-format-v2 job gains an optional
`platform_target` block; the fields below exist on every profile, and any
field a platform does not VERIFY is marked SPEC GAP rather than invented.

## Common fields (all profiles)

- `reference_pack_id` — the pack in `../reference-packs/` that locks the
  character(s) for this job.
- `reference_images` — ordered pack view files, capped at the platform's
  verified cap.
- `multi_shot_group` — shot intents generated as one unit where verified;
  otherwise the shots ride the pattern's chaining step.
- `clip_length_s` — 5–15s working target, capped at the verified max.
- `aspect` — 16:9 default; 1:1 for avatar-format jobs.
- `audio` — true only where native audio is verified; default false
  (audio is ours, laid in at composite).
- Gates: frame-1 + likeness run on EVERY output. No profile opts out.

## Profiles at a glance

| Profile | Engine | Bucket | Refs cap | Clip | Multi-shot | Audio |
|---|---|---|---|---|---|---|
| kaggle-wan22-ours | Our backend (Wan 2.2 + VACE) | open source (Apache-2.0) | per-layer VACE refs | 10.1s proven, chained | grouping + chaining | ours at composite |
| higgsfield-seedance25 | Seedance 2.5 via Higgsfield | paid (Plus+) | 50/gen (30 img) | 4–30s | VERIFIED | native (opt) |
| kling-elements | Kling VIDEO 3.0 / 4.0 | paid | 2–4 per Element | 3–15s (4.0: 30s) | VERIFIED | native (opt) |
| wan3-api | Wan 3.0 API (Alibaba) | paid per-second | SPEC GAP | up to 30s | SPEC GAP | SPEC GAP |
| google-flow-veo31 | Veo 3.1 / Omni Flash | paid / free proprietary | ingredients | 4–8s (Omni 4–10s) | chaining (Extend) | native |
| studioram | StudioRam scenes | paid | saved characters | ≤8s/scene | scene assembly | in-tool |
| anijam | Anijam | paid | persistent assets | SPEC GAP | episode assembly | in-tool |
| atlabs | Atlabs (orchestrates the above) | paid | Cast library | per engine | episode assembly | per engine |

Full per-profile detail (pricing evidence, retry economics, rights
caveats, status) lives in `job_profiles.json` and VERIFIED-PLATFORMS.md.
Open eval engines (FastVideo/FastWan, Phantom-Wan, MultiShotMaster,
HuMo, Qwen-Image-Edit) are profiled in OPEN-IMPLEMENTATIONS.md and slot
into the same job format when the Kaggle lane stages them.

## Follow-up profiles (2026-10-28 — OPEN-STUDIOS-AND-PROMPT-ENGINES.md)

| Profile | Engine | Bucket | Status |
|---|---|---|---|
| ltx-fast-iteration | LTX distilled (Lightricks) | code Apache-2.0 / weights free-but-restricted | EVAL SLOT — rapid previs beside Wan; staging plan written, weights not downloaded; outputs do not ship |
| dreamina-seedance | Seedance 2.0 free / 2.5 where available | free-but-restricted (scratch) / paid | FREE-TEST-ROTATION route #2 — 120cr/day US verified on Dreamina's own page; hands-on PENDING-PARENT |
| seedance-muapi-wrapper | Seedance 2.5 via MuAPI (SamurAIGPT wrapper, MIT) | paid (Pro/Business-gated) | SPEC ONLY — no account, no key |
| seedance-ark-fal-cli | Seedance 2.5 via Volcano Ark / Fal / Replicate | paid (CLI itself unlicensed — not adopted) | SPEC ONLY — no accounts, no keys |
| higgsfield-cli | 40+ Higgsfield models via official CLI (MIT) | paid (drives a Higgsfield account) | SPEC ONLY — its MODELS.md serves as a spec source |
| elevenlabs-seedance | Seedance 2.0/2.5 in ElevenCreative | paid for video | SPEC — claim-checked: hosting real, free-tier route NOT real; not a test route |

Design rules confirmed by the open-studio pattern sources (both
repos licence-free, so patterns only — no code): every profile
DECLARES its own settings allow-list and its media-input roles with
per-role caps; UIs and runners render from the declaration, never from
a hardcoded per-platform form.
