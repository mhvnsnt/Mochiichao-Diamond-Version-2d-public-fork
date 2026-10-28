# Rented-GPU seat — the avatar stack without the Kaggle queue

**What this is, in plain words.** Everything our animation stack
needs to run on a rented GPU box instead of free Kaggle: one setup
script, one runbook, one providers note. Same ComfyUI, same two
workflows (reference-locked + turbo), same weights, same gates.
Nothing about the stack changes — only the seat does. Kaggle's costs
are the queue, the notebook startup, and a 30 GPU-hour weekly quota
that is nearly spent; a rented box has none of that. It just bills by
the second while it runs.

**Status: preparation only.** No account has been created, nothing
has been purchased, no instance exists. This package makes the move
a single owner decision: once an instance exists, `setup.sh` has
generation ready in minutes.

Files here:

| file | what it is |
|---|---|
| `setup.sh` | The full bootstrap for a fresh Ubuntu instance. Idempotent, stops loudly on a missing piece. |
| `RUNBOOK.md` | How a generation job runs on the box, where outputs land, how they get back, and the gates. |
| `PROVIDERS.md` | RunPod vs Vast.ai for this exact use, with sources and dates. |

---

## The instance to rent

- **GPU: one RTX 4090, 24 GB VRAM.** The stack already runs
  T4-marginal at 16 GB (the 5B seat + VACE-1.3B, one model at a
  time); 24 GB is comfortable headroom, and the 4090 is the cheapest
  card in that class on both providers.
- **Disk: 150 GB** (100 GB absolute minimum — see the maths below).
  On RunPod, make it a **network volume** so the weights survive
  between sessions and never re-download. On Vast.ai the disk size
  is fixed at creation and cannot be grown later — choose 150 GB up
  front.
- **Image: Ubuntu 22.04 (or 24.04) with NVIDIA drivers + Python 3.**
  A stock PyTorch template from either provider is fine.

### Where the disk number comes from (derived, byte-exact)

Our staged weights, from the programme's own staging records
(`~/workspace/big-weights-stage/STAGING-TABLE.md`,
`../parity/TURBO-T5-FIX.md`, `../parity/QWEN-WIRING.md`,
`../parity/PARITY-REPORT.md`):

| piece | bytes |
|---|---:|
| Wan 2.2 core + accel + VACE-1.3B + VAEs + RealESRGAN (the three wan22 Kaggle datasets' accounted total) | 33,058,248,950 |
| Turbo LoRA rank-64 fp16 (rides in the same dataset family) | 332,348,584 |
| Non-scaled UMT5 fix file (Kijai build — the turbo path dies without it) | 6,731,333,792 |
| Qwen2.5-VL-7B-Instruct cache (prompt-extension seat) | 16,595,981,281 |
| Character LoRAs (Wispkin + Dorowani, 87,594,264 each) | 175,188,528 |
| **Weights total** | **56,893,101,135 ≈ 56.9 GB** |

Add ComfyUI + node packs + the Python environment (~10 GB,
estimate) and working room for chained segment frames, gate scratch,
and an episode's outputs (20 GB and up), and 100 GB is the floor.
**150 GB recommended** — it also leaves room for the optional A14B
GGUF tier (19,303,457,792 B, `../parity/A14B-TIER.md`) if that eval
ever runs.

## The honest cost picture

**Hourly:** an RTX 4090 rents for roughly **$0.34/hr** at the cheap
end (RunPod Community / Vast interruptible listings) to roughly
**$0.74–0.89/hr** for RunPod Secure on-demand. Full sourcing in
`PROVIDERS.md`. Market rates move; the figure that matters is the
one on the checkout screen the day it is rented.

**What an episode costs in generation time** — arithmetic, shown,
from our one measured speed point. On Kaggle's T4, the optimized
(wrapper + Turbo LoRA + torch.compile) path was benchmarked at
**78.5 s per benchmark clip vs 1,787.6 s native (22.8×)**, recorded
2026-10-27 in `../backends.json` and cited in
`../parity/TURBO-T5-FIX.md` / `../parity/PARITY-REPORT.md`. Two
honest caveats: (1) the locked VACE graph *with the fixes engaged*
has not been re-measured yet — that re-measurement is still owed;
(2) a 4090 is faster than a T4, but by an unmeasured factor for this
stack, so the maths below stays at T4 speed and the real bill
should land under it.

EP01 planning shape (107 cuts, ~8 s average per cut ≈ 4 chained
benchmark-length segments per cut, 3 attempts per keeper):

```
107 cuts × 4 segments × 3 attempts × 78.5 s  ≈  100,800 s  ≈  28 GPU-hours
```

| rate | episode generation spend (at T4 speed) |
|---|---:|
| $0.34/hr | ≈ $9.50 |
| $0.50/hr | ≈ $14 |
| $0.89/hr | ≈ $25 |

Plus one-time setup per fresh box: ~57 GB of weight downloads
(bandwidth-dependent — about 8 minutes at 1 Gbps, about 40 at
200 Mbps) and ~10 minutes of installs, all inside the same hourly
billing. On a RunPod network volume, later sessions skip the
download entirely.

Compare Kaggle: the same 28 GPU-hours would take most of two weeks
of the free quota (30 GPU-hours/week, nearly spent) — if the queue
allowed it at all.

## The steps only the owner can do

Four things, all account-and-payment, all his:

1. **Create the provider account** (RunPod or Vast.ai — see
   `PROVIDERS.md`).
2. **Add payment / credits.** (Vast.ai's minimum top-up is $5;
   RunPod needs a card on file. No free tier exists on either.)
3. **Start the instance:** RTX 4090 24 GB, 150 GB disk (RunPod: a
   network volume in one datacenter, attached to the pod; Vast:
   150 GB chosen at creation), Ubuntu/PyTorch image.
4. **Place the Kaggle token on the box** at `~/.kaggle/kaggle.json`
   (the same file the programme already uses — kaggle.com →
   Settings → API). The weights pull from our private Kaggle
   datasets; the token is a credential, the owner moves it himself,
   and it never goes in the repo or in chat.

## Everything the script does for him

`setup.sh` does the rest, in one run: system packages, this repo,
ComfyUI + the WanVideoWrapper pack (the only custom node the stack
needs — the locked graph is pure ComfyUI core), the Python
environment, every weight from our existing Kaggle staging plus the
UMT5 fix file from Hugging Face, byte-size assertions where the
locked-run kernel asserts them, the symlinks into ComfyUI's model
layout, the job kit (both workflows + preflight + both gates + the
hash-logged reference stills), and a smoke check. Then `RUNBOOK.md`
takes over.

One command on the box:

```bash
git clone --depth 1 https://github.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start.git
cd Mochiichao-Diamond-Version-2d-fresh-start/show/production/tooling/avatar-stack/rented-gpu
bash setup.sh
```

(The script also clones its own copy of the repo under the stack
root — the clone above is just how you fetch the script itself.)

Licence buckets, for the record: everything the script installs is
open source (ComfyUI GPL-3.0; Wan family, UMT5 builds, VACE,
RealESRGAN, character LoRAs Apache-2.0/BSD-3-Clause per the staging
table) or the owner's own staged material. The providers are a paid
service — that is the entire point of this package, and it is the
owner's purchase to make.
