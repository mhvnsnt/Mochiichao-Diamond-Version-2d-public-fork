# LANDING — full-stack wiring package for the repo lane

Source of record on this machine: `~/workspace/ep01-rebuild/full-stack/`
(FULL-STACK-REPORT.md + TARGET-WIRING-REPORT.md + run-records/ +
kernel/ + kernel2/ + job/ + src-api/). This package is staged for
the side lane to land in `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`
under `show/production/tooling/full-stack/` — docs, graphs, and
scripts land as files; the staged third-party source trees
(`src-api/`) land as VENDORED REFERENCE with their licences
attached and their FETCH-MANIFEST.json (pinned commit + per-file
sha256) beside them. Nothing in this package is claimed as run
unless its run record says so.

## What lands, and its honest state

| Piece | State | Repo home (proposed) |
|---|---|---|
| VACE FLF workflow (patched, in-kernel audited) | wired + run ×2 on Kaggle; gate NOT GRADED (Kaggle output-endpoint 429 strands the evidence; retrieval commands in the run record) | `tooling/full-stack/workflows/` |
| Kaggle runners (notebook form + self-sufficient script kernel) | ran COMPLETE ×2 | `tooling/full-stack/kaggle/` |
| Composite stage (baseline lane, proven mechanics) | WIRED AND PROVEN | already in repo tooling |
| OpenX-Inc/flow (MIT) | WIRED-PARTIAL — code staged; adapter to our GPU seat + T4 model profile are the named remaining wires; paid seats (OpenAI/DeepSeek LLM defaults, Modal/RunPod backends, ElevenLabs TTS) flagged, free seats (Ollama, self-hosted backend, Edge/Miso TTS) named | `tooling/full-stack/flow/` (vendored, MIT) |
| lilinsong1/comfyui-wan-video-pipeline | NOT WIRED — no licence file; reference only; its function (headless shot-list ComfyUI runs) is already covered by our runner | reference note only — do not vendor as code |
| Wan-Video/Wan2.2 (Apache-2.0) | WIRED-PARTIAL — official code staged incl. S2V + Animate entry points; weights NOT staged (14B class, T4-marginal) | `tooling/full-stack/wan22/` (vendored, Apache-2.0) |
| LightX2V (Apache-2.0) | staged; the acceleration + future-Animate seat; runtime integration is the named remaining wire | `tooling/full-stack/lightx2v/` (vendored, Apache-2.0) |
| synctoon (GPL-3.0) | staged; the puppet/gag lane seat (CSV cue control + visemes); defaults are paid seats (ElevenLabs, hosted LLMs) — free configuration = Ollama + own audio + Gentle, or our Chatterbox/Kokoro + Rhubarb | `tooling/full-stack/synctoon/` (vendored, GPL-3.0 — copyleft note: keep it a standalone tool, do not link it into shipped game code) |
| MuseTalk (MIT) | WIRED-PARTIAL — code staged; the human-cast lip-sync seat confirmed in the talking chain; weights NOT staged; never run here | `tooling/full-stack/musetalk/` (vendored, MIT) |
| AIComicBuilder (Apache-2.0) | NOT WIRED — every generation seat is a paid hosted API (OpenAI/Gemini/DALL-E/Imagen/Kling/Seedance/Veo), flagged; staged for the record only | reference note only |
| cartoon-story-generator | NOT WIRED — no licence; animation seat is RunwayML (paid) | do not land |
| Topics sweep (comic-generator / ai-comic-creator) | discovery reported; **gzxx-2025/aid-studio** (MIT, ~1.2k★) is the one find held for a future source-verification pass | note in the report only |

## Retrieval debt (one command each, when Kaggle's output rate limit clears)

1. `kaggle kernels output marsfmmg/mochiichao-vace-flf -p <dir> --file-pattern "out/.*"` → gate attempt 1 (sparse FLF). **Note (corrected 2026-10-28):** this kernel's status now reads **ERROR** — its output may be partial or empty; if the listing comes back empty, attempt 1 left nothing retrievable and its record closes as "session errored."
2. `kaggle kernels output marsfmmg/mochiichao-vace-fullctl -p <dir> --file-pattern "out/.*"` → gate attempt 2 (full performed control; output folder carries clip + gate frames + anchors + hashes).

Gate law for both: frame-1 check against the fed reference;
PASS only if the correct Dorowani performs Water Orb; anything
else is FAIL with the clip as evidence. No partial credit.

## Standing follow-ups (named, not hidden)

- flow → ComfyUI/Kaggle GPU-backend adapter + a 1.3B/5B model
  profile (flow ships 14B defaults only).
- MuseTalk weights staging (~4 GB class) + first calibration run
  on a human-cast line, once casting is ruled.
- S2V-14B / Animate-14B: weights staging + a T4 feasibility run
  under LightX2V offload/quantization before any reliance.
- Future kernels should ALSO write outputs into a versioned
  output dataset from inside the session, so gate evidence never
  again depends on the rate-limited output endpoint alone.
