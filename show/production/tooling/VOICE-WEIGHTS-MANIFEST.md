# VOICE-WEIGHTS-MANIFEST

Voice-seat weights for the Mochiichao show (Chatterbox-TTS + Kokoro), staged
once so no seat ever re-downloads them. Owner standing instruction,
reaffirmed 2026-10-27. Weights are too large for git — this manifest is the
repo record; the bytes live in the staged locations below.

Local inventory measured byte-exact on this VM, 2026-10-27, from
`~/opt/hf-cache` (the render-verified cache: Chatterbox CPU smoke passed,
Kokoro cached alongside).

## Chatterbox — ResembleAI/chatterbox

- HF revision: `5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18`
- Licence: **MIT** — code licence verified from the locally installed
  package (`chatterbox_tts 0.1.7` dist-info METADATA: "MIT License", LICENSE
  file present). Weights ship under the same MIT release per the ResembleAI
  repo; no licence file is included in the local HF snapshot itself.

| File | Bytes |
|---|---|
| t3_cfg.safetensors | 2,129,653,744 |
| s3gen.safetensors | 1,056,484,620 |
| ve.safetensors | 5,695,784 |
| conds.pt | 107,374 |
| tokenizer.json | 25,470 |
| **Set total** | **3,191,966,992** |

## Kokoro — hexgrad/Kokoro-82M

- HF revision: `f3ff3571791e39611d31c381e3a41a3af07b4987`
- Licence: **Apache-2.0** — verified from the locally installed package
  (`kokoro 0.9.4` dist-info METADATA carries the Apache License text) and
  the model's Apache-2.0 release.

| File | Bytes |
|---|---|
| kokoro-v1_0.pth | 327,212,226 |
| config.json | 2,351 |
| voices/af_heart.pt | 523,425 |
| voices/af_bella.pt | 523,425 |
| voices/am_adam.pt | 523,420 |
| voices/am_michael.pt | 523,435 |
| voices/bf_emma.pt | 523,420 |
| voices/bm_george.pt | 523,430 |
| **Set total** | **330,355,132** |

Only these 6 Kokoro voice packs are cached locally (of the model's full
voice list) — they are the scratch/animatic seat's packs. Casting voices for
the human cast come from Chatterbox references (below), not from this list.

## Grand total — voice weights

**3,522,322,124 bytes** (3.28 GiB). No per-character reference audio exists
anywhere on this VM yet (searched 2026-10-27) — see the casting section.

(Adjacent, not voice: the same HF cache also holds the BiRefNet matting
weights — ZhengPeng7/BiRefNet `model.safetensors`, 444,473,596 bytes, MIT —
catalogued with the avatar stack; it is staged under that programme, not
this one.)

## Where the staged copies live

| Location | State |
|---|---|
| This manifest (repo) | The record. PR pending the GitHub API rate-limit reset (~00:45 UTC, 2026-10-28). |
| VM workbench: `~/workspace/voice-weights-stage/` | Upload-ready folder: `chatterbox/`, `kokoro/`, `characters/`, `kaggle-dataset/`, byte-verified copies of every file above. **Transit staging only** (workspace staging rule: local disk is a workbench, not the warehouse) — clear it once the TeraBox + Kaggle copies confirm. |
| Kaggle private Dataset `mochiichao-voice-weights` | **Pending — owner's step.** No Kaggle CLI and no `~/.kaggle/kaggle.json` on this VM. Exact one-time step + commands: `voice-weights-stage/kaggle-dataset/README.md`. |
| TeraBox | **Pending — browser upload step.** The account is signed in via the Muse browser; the upload source is `~/workspace/voice-weights-stage/` (single folder, 3.52 GB). A blind multi-GB browser upload was not forced; this is the remaining manual step. |

Originals also remain in `~/opt/hf-cache` (installation cache, the local
seat's working copy — not staging).

## Per-character voice entries (human cast)

Structure: character → reference audio → Chatterbox params → staged
locations. Params from `show/production/VOICE-DESIGN.md`. Reference slots
are EMPTY by design — casting is the owner's ear; Wizard Gang cast
references belong to that cast and are never reused here.

| Character | Reference audio | Status | Exaggeration | CFG weight |
|---|---|---|---|---|
| Mochiko | — | AWAITING OWNER CASTING | 0.45 | 0.5 |
| Hex | — | AWAITING OWNER CASTING | 0.3 | 0.6 |
| Aeon | — | AWAITING OWNER CASTING | 0.4 | 0.55 |

Local skeleton: `voice-weights-stage/characters/{mochiko,hex,aeon}/character.yaml`.
Once a reference is cast, its audio file joins this manifest with its byte
size and staged locations, same as the weights above.
