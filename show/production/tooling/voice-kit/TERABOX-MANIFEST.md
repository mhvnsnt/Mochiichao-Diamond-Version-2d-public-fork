# TERABOX MANIFEST — voice-kit binary staging

**Staging rule (owner, standing):** big binaries never sit in repos.
Weights are staged **once on TeraBox**, hashed, and the repo keeps
only this manifest + hashes; weights are rationed into working
caches (HF cache on runners / Kaggle / the local VM) from there as
needed, never re-downloaded from scratch per task.

**Status of this manifest:** prepared, NOT yet staged. The binary
move joins Jamar's consolidated TeraBox staging session — no multi-GB
download into this VM was made for this teardown (the VM already
holds a verified local cache at `~/opt/hf-cache`, which is where the
sizes and SHA-256 values below were measured on 2026-10-27; the
TeraBox upload must reproduce these hashes or be re-done).

**Licence honesty (verified at source, 2026-10-27):** both weight
sets are genuinely open — no paywall, no non-commercial clause:
- Chatterbox: **open source, MIT** (code + weights, Resemble AI —
  HF model card + resemble.ai state MIT, incl. commercial use).
- Kokoro-82M: **open weights, Apache-2.0** (code + weights, hexgrad —
  HF model card; trained, per the card, on permissive/non-copyrighted
  audio only).

## Target TeraBox layout

```
TeraBox/
  Mochiichao-Production/
    weights/
      voice-kit/
        chatterbox/            <- ResembleAI/chatterbox snapshot 5bb1f6ee
          t3_cfg.safetensors
          s3gen.safetensors
          ve.safetensors
          conds.pt
          tokenizer.json
        kokoro-82m/            <- hexgrad/Kokoro-82M snapshot f3ff3571
          kokoro-v1_0.pth
          config.json
          voices/              (6 preset voice tensors, ~0.5 MB each)
        MANIFEST.sha256        (copy of the hash table below)
```

## Payload table

### 1. Chatterbox (REQUIRED — the clone engine)
Source: Hugging Face `ResembleAI/chatterbox`, snapshot
`5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18` · Licence: **MIT**
(open source) · Total: **3,191,966,992 bytes (~3.19 GB)** — the
source pipe's "~3.5 GB" figure includes the pip dependency tree +
cache overhead; weights proper measure as below.

| File | Bytes | SHA-256 (measured locally 2026-10-27) |
|---|---|---|
| `t3_cfg.safetensors` | 2,129,653,744 | `914cb1696f47527fe8852ca8f1fe1fa63cb34f76f9c715e84e067b744dd0da81` |
| `s3gen.safetensors` | 1,056,484,620 | `2b78103c654207393955e4900aac14a12de8ef25f4b09424f1ef91941f161d4e` |
| `ve.safetensors` | 5,695,784 | `f0921cab452fa278bc25cd23ffd59d36f816d7dc5181dd1bef9751a7fb61f63c` |
| `conds.pt` | 107,374 | `6552d70568833628ba019c6b03459e77fe71ca197d5c560cef9411bee9d87f4e` |
| `tokenizer.json` | 25,470 | TO-HASH AT STAGING (small file; hash when the staging session assembles the folder) |

### 2. Kokoro-82M (REQUIRED — the scratch/audition engine)
Source: Hugging Face `hexgrad/Kokoro-82M`, snapshot
`f3ff3571791e39611d31c381e3a41a3af07b4987` · Licence: **Apache-2.0**
(open weights) · Total: **~330.4 MB** (main weights + config +
6 preset voice tensors).

| File | Bytes | SHA-256 |
|---|---|---|
| `kokoro-v1_0.pth` | 327,212,226 | `496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4` — measured locally AND matches the SHA-256 published on the HF model card |
| `config.json` | 2,351 | TO-HASH AT STAGING |
| `voices/*.pt` (6 files: af_bella, af_heart, am_adam, am_michael, bf_emma, bm_george) | 523,425 each | TO-HASH AT STAGING |

### 3. Optional / not staged by this kit
| Item | Why not |
|---|---|
| Piper voices (scratch alternative named in PIPELINE.md) | Optional scratch path only; stage per-voice (~60 MB each, MIT code / voice data per-voice licences vary) only if the owner picks Piper for a scratch pass. Not required by this kit. |
| Chatterbox-Turbo / Multilingual variants | Different models, not the pipe's engine (the pipe pins `ResembleAI/chatterbox`, English). Stage only on an owner decision (e.g. a future Japanese-language pass). |
| Reference audio (`refs/`) | NOT a TeraBox item — refs are ~1 MB and live in the repo (`voice-kit/refs/`), exactly as in the source pipe. Casting TBD. |

## Staging-session instructions (for the consolidated TeraBox session)
1. Assemble `voice-kit/` folders exactly as the layout above (from
   the VM's `~/opt/hf-cache` snapshots — already hash-verified — or
   fresh from the HF repos at the pinned snapshots).
2. Upload once to `Mochiichao-Production/weights/voice-kit/`.
3. Compute SHA-256 for the TO-HASH rows, fill them in here, and drop
   a `MANIFEST.sha256` beside the folders on TeraBox.
4. Verify every measured hash above reproduces on the staged copies;
   any mismatch = re-upload that file, never paper over it.
5. Record the staging date + verifier in this file's git history
   (WORKLOG rule) and flip this manifest's status line to STAGED.
