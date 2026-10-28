# A14B TIER — the quality-tier verdict, with the numbers

Date: 2026-10-28. Question: is Wan2.2-I2V-A14B a runnable tier on
our only GPU seat (Kaggle: T4 16 GB ×2 or P100 16 GB, kernel
`/kaggle/working` ≈ 21 GB), and if not, what is the parity tier?

All sizes below are byte-exact from Hugging Face API listings
fetched 2026-10-28 (`https://huggingface.co/api/models/<repo>?blobs=true`),
unless marked as our own measurements.

---

## 1. The official model — Wan-AI/Wan2.2-I2V-A14B

- **Licence: Apache-2.0** (HF API `cardData.license = "apache-2.0"`;
  corroborated by the SiliconFlow model page, "License, APACHE 2.0
  LICENSE"). Bucket: **open source**. MoE: 27 B total parameters,
  14 B active per step — two full expert checkpoints (high-noise +
  low-noise), both required for a normal run.
- **Exact files (official repo, diffusers format):**

| Component | Bytes |
|---|---:|
| `high_noise_model/` — 6 shards (9,994,119,944 / 9,943,937,936 / 9,943,979,184 / 9,839,059,744 / 9,839,059,744 / 7,595,559,224) | 57,155,715,776 |
| `low_noise_model/` — 6 shards (same sizes) | 57,155,715,776 |
| `models_t5_umt5-xxl-enc-bf16.pth` | 11,361,920,418 |
| `Wan2.1_VAE.pth` | 507,609,880 |
| **Whole repo** | **126,205,359,703** |

- **ComfyUI repackaging** (Comfy-Org/Wan_2.2_ComfyUI_Repackaged,
  Apache-2.0): per expert — fp16 `wan2.2_i2v_high_noise_14B_fp16.safetensors`
  **28,577,914,792 B**, fp8-scaled `…_fp8_scaled.safetensors`
  **14,294,742,832 B** (same for low-noise). Working set in fp8:
  2 × 14,294,742,832 = **28,589,485,664 B** + T5 + the 2.1 VAE
  (253,815,318 B in this packaging).

## 2. Quantized options

### GGUF — QuantStack/Wan2.2-I2V-A14B-GGUF

**Licence: Apache-2.0** (HF API card licence; the card adds "all
original licensing terms remain in effect" — it is a direct
conversion of the official model). Per-expert file sizes (both
experts are the same size at every quant):

| Quant | per expert | **pair** |
|---|---:|---:|
| Q2_K | 5,300,957,696 | 10,601,915,392 |
| Q3_K_M | 7,176,106,496 | 14,352,212,992 |
| Q4_K_S | 8,748,151,296 | 17,496,302,592 |
| Q4_K_M | 9,651,728,896 | 19,303,457,792 |
| Q5_K_M | 10,792,055,296 | 21,584,110,592 |
| Q6_K | 12,003,652,096 | 24,007,304,192 |
| Q8_0 | 15,406,608,896 | 30,813,217,792 |

Runs through city96's ComfyUI-GGUF loader / the wrapper's GGUF
path (`WanVideoModelLoader` accepts `.gguf` from `models/unet`;
quantization must be `disabled` for GGUF per its source).

### FP8 distilled — lightx2v/Wan2.2-Distill-Models

**Licence: Apache-2.0** (HF API). Full 4-step distilled fp8
checkpoints, ComfyUI-ready: high-noise **15,003,000,250 B** +
low-noise **15,003,000,250 B** = **30,006,000,500 B** the pair.
(See LIGHTX2V-EVAL.md — these are complete replacement checkpoints,
not LoRAs.)

### Distill LoRAs — lightx2v/Wan2.2-Distill-Loras

**Licence: Apache-2.0** (HF API). `…_high_noise_lora_rank64_lightx2v_4step_1022`
**634,645,944 B** + `…_low_noise_…` **739,472,104 B** — applied to a
base A14B pair; they shrink step count, not model size. Comfy-Org's
repackaged v1 pair is 1,226,977,424 B each.

## 3. The seat's real constraints (measured, ours)

| Constraint | Value | Source |
|---|---:|---|
| GPU | Tesla T4 ×2, **14,912 MB usable VRAM each** | proof kernel's own ComfyUI log (`Total VRAM 14912 MB`, device lines) |
| System RAM | 30,720 MB (cgroup-limited) | same log |
| Kernel working disk | **20,940.49 MB free** | FLUX pull-in kernel's own error (PULL-IN-REPORT.md) |
| Alternative GPU | P100 16 GB | Kaggle's other free accelerator (per brief; not measured this session) |

Consequences, arithmetic only:

- **bf16 pair (57.16 GB/expert in diffusers shards; 28.58 GB/expert
  as Comfy fp16): dead on arrival.** Neither expert fits a T4, the
  pair doesn't fit the working disk, and even dataset-side it would
  need heavy block-swap from a 30 GB RAM ceiling shared with
  everything else. The Wan team's own single-GPU guidance for A14B
  is an 80 GB-class card (their repo README, via the search
  extracts read this session).
- **fp8-scaled pair (28.59 GB) + T5:** exceeds working disk as a
  working set; as dataset-attached read-only mounts it could be
  block-swapped, but each expert (14.29 GB) nearly fills a T4 by
  itself before activations at 480×768×49 f — the run becomes an
  offload-bound crawl, and the wrapper's fp8 path additionally
  warns e4m3fn cannot be torch.compiled on compute capability < 8.9
  (T4 is 7.5) in its own loader tooltip.
- **GGUF Q4_K_M pair (19.30 GB) + non-scaled fp8 T5 (6.73 GB) + VAE
  (0.25 GB) ≈ 26.3 GB staged:** the only configuration whose
  *per-expert* file (9.65 GB) leaves real headroom on a 16 GB card
  with block swap. It is stageable (split below) and plausibly
  runnable at 480p/49 f. It is also the worst-quality A14B variant
  (4-bit weights on both experts), unproven on our material, and
  its speed on a T4 with swapped blocks is unknown — the honest
  label is **runnable-looking, unproven**, not a tier we can claim.

## 4. Bottom line

**The parity tier is 5B + the engaged lock + per-character LoRAs —
not A14B.** Reasoning, in order of weight:

1. **Parity is a likeness problem, not a capacity problem.** The
   measured failure (frame-1 SSIM 0.2938, "reference never
   anchored") happened because the conditioning path was not
   engaged. A 27 B model fed the same unlocked graph has no reason
   to hold a flat-2D canon character better — capacity does not
   substitute for the reference latent. This package's locked VACE
   graph (1.3B) + the turbo-fixed 5B graph attack the actual defect.
2. **The 5B stack is staged, benchmarked and fits:** TI2V-5B fp16
   (9,999,658,848 B) runs the measured 22.8× Turbo path once the T5
   file is swapped (TURBO-T5-FIX.md); its working set + VACE kit +
   T5 ≈ 11.33 GB for the locked 1.3B stack — inside every limit in
   §3 simultaneously, which no A14B variant achieves.
3. **Character LoRAs are the remaining likeness lever and they are
   model-agnostic work** (musubi-tuner, Apache-2.0, already the
   kit's plan): a per-character LoRA trained on canon art attacks
   identity directly, at 5B training cost, and the same dataset of
   canon frames is what an A14B LoRA would need later anyway.
4. **What A14B would still add** (honest, for the record): better
   motion physics and prompt adherence on complex actions, better
   hands/faces on the human cast, 720p headroom, and the MoE
   high/low-noise split's quality on long chained segments. None of
   these fix frame-1 identity; all of them matter *after* identity
   holds.

### If A14B is ever staged — the concrete plan (GGUF Q4_K_M route)

Mirroring the existing 3-dataset Wan kit layout, all files from
QuantStack/Wan2.2-I2V-A14B-GGUF + Kijai/WanVideo_comfy (HF API
listings above), total staged ≈ **26.3 GB**:

| Dataset | Contents | Bytes |
|---|---|---:|
| `mochiichao-wan22-a14b-high` | `Wan2.2-I2V-A14B-HighNoise-Q4_K_M.gguf` | 9,651,728,896 |
| `mochiichao-wan22-a14b-low` | `Wan2.2-I2V-A14B-LowNoise-Q4_K_M.gguf` | 9,651,728,896 |
| `mochiichao-wan22-a14b-common` | `umt5-xxl-enc-fp8_e4m3fn.safetensors` (6,731,333,792) + `wan_2.1_vae.safetensors` (253,815,318, already staged — link, don't duplicate) + optional LightX2V I2V distill LoRA pair (634,645,944 + 739,472,104) | 8,359,267,158 with LoRAs |

Consumer kernel: two sampler passes (high-noise expert for the
first portion of steps, low-noise for the rest — the standard A14B
two-loader pattern), block swap on, 480×768×49 f ceiling for the
first proof, acceptance = the same frame-1 likeness gate. Until
that proof exists, A14B stays **catalogued, not a tier** — the same
honest status the repo already gives its other unproven backends.
