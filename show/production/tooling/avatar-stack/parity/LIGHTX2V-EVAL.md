# LIGHTX2V EVAL — licence, what it actually accelerates, and the verdict

Date: 2026-10-28. Baseline it is judged against (ours, measured
2026-10-27, recorded in the repo's `backends.json`): the earlier A/B
on the TI2V-5B seat — WanVideoWrapper + Wan22 Turbo LoRA (rank 64) +
torch.compile, 4 steps / CFG 1.0: **78.5 s vs 1,787.6 s native
baseline = 22.8×**.

## 1. Licence — verified at source

- **Code: Apache-2.0.** The `LICENSE` file at the root of
  ModelTC/LightX2V was read this session two independent ways:
  via the GitHub API (`repos/ModelTC/LightX2V/contents/LICENSE` —
  the file is the Apache License, Version 2.0 text) and in the
  programme's own pinned local clone
  (`~/workspace/ep01-rebuild/full-stack/closure/lightx2v/clone/LICENSE`,
  same text; clone pinned at commit
  `543cff43829177f1032938809612f748a29d1a53` per the closure note).
  GitHub's licence API summary in search results likewise reports
  `key: apache-2.0` for the repo. Bucket: **open source**.
- **Weights:** the HF repos used below declare **Apache-2.0** in
  their card data (HF API, fetched 2026-10-28):
  `lightx2v/Wan2.2-Distill-Loras`, `lightx2v/Wan2.2-Distill-Models`.
  Kijai's mirror of the same LoRA family (Kijai/WanVideo_comfy
  `Lightx2v/` folder) carries no separate licence field; treat the
  lightx2v repos as the source of record.

## 2. What it actually is (and is not)

LightX2V (ModelTC) is a lightweight **inference framework** plus a
family of **step-distilled weights**. From the repo and its HF cards
(read this session):

- **Step distillation is the product.** Distilled models/LoRAs run
  Wan at **4 steps, CFG 1.0** instead of 20–50 steps with CFG —
  the same trick our Turbo LoRA already plays on the 5B. Forms:
  (a) **distill LoRAs** (rank 64 for Wan 2.2 A14B I2V/T2V; rank
  16–256 variants for Wan 2.1 14B), applied to a base checkpoint;
  (b) **full distilled checkpoints** (bf16 / fp8 / int8) that
  replace the base model outright.
- **Quantization + offloading are framework features**, not new
  quality: fp8/int8 checkpoint variants (~50% size), CPU offload,
  and attention backends (sage/flash variants; on our T4 the
  programme's closure note already established only `torch_sdpa`
  of its attention types runs on Turing).
- **It is not a likeness or consistency technology.** Nothing in
  LightX2V conditions on a reference image or holds a character.
  It makes a given graph *faster*; it does not change *which*
  character comes out. (The programme already uses it where it
  belongs: the full-stack lane's T4 profile + prepared Animate run
  — `closure/lightx2v/` in ep01-rebuild — and LightX2V's own
  `scripts/wan/run_wan_vace.sh` is its VACE step-distillation seat.)

## 3. The specific artifacts (exact, from HF API listings 2026-10-28)

| Artifact | Repo | Bytes | Applies to |
|---|---|---:|---|
| `wan2.2_i2v_A14b_high_noise_lora_rank64_lightx2v_4step_1022.safetensors` | lightx2v/Wan2.2-Distill-Loras | 634,645,944 | A14B I2V high-noise expert |
| `wan2.2_i2v_A14b_low_noise_lora_rank64_lightx2v_4step_1022.safetensors` | lightx2v/Wan2.2-Distill-Loras | 739,472,104 | A14B I2V low-noise expert |
| `wan2.2_i2v_A14b_high_noise_scaled_fp8_e4m3_lightx2v_4step_comfyui.safetensors` | lightx2v/Wan2.2-Distill-Models | 15,003,000,250 | full distilled checkpoint (not a LoRA) |
| `wan2.2_i2v_A14b_low_noise_scaled_fp8_e4m3_lightx2v_4step_comfyui.safetensors` | lightx2v/Wan2.2-Distill-Models | 15,003,000,250 | full distilled checkpoint |
| `lightx2v_I2V_14B_480p_cfg_step_distill_rank64_bf16.safetensors` | Kijai/WanVideo_comfy `Lightx2v/` | 738 MB (HF tree page, GB-rounded) | Wan 2.1 I2V-14B |
| Comfy-Org v1 pair `wan2.2_i2v_lightx2v_4steps_lora_v1_{high,low}_noise.safetensors` | Comfy-Org/Wan_2.2_ComfyUI_Repackaged | 1,226,977,424 each | A14B I2V experts |

Note what is **absent**: there is no LightX2V distill LoRA for
TI2V-5B in these listings, and none for the Wan 2.1 VACE-1.3B stack
(the VACE seat's distillation lives in LightX2V's own framework
configs, not as a ComfyUI LoRA for our wrapper graph).

## 4. Verdict

**TAKEN — but only where it stacks on a bottleneck we actually
have; NOT taken as a new 5B accelerator, because it has nothing to
add there.**

- **On the current parity seat (5B + VACE-1.3B): not taken.**
  Our 22.8× baseline already *is* a step-distillation result
  (Turbo LoRA, 4 steps, CFG 1.0 — the same operating point
  LightX2V's artifacts target). Swapping one 4-step distill LoRA
  for another on the 5B would need a LightX2V 5B artifact that
  does not exist in its repos, and the seat's actual bottleneck is
  no longer sampling speed: with the T5 fix (TURBO-T5-FIX.md) the
  Turbo path is ~78.5 s-class per segment, while the *native
  fallback* (28.5 min-class) was the cost — a graph bug, now
  fixed on paper, not a distillation gap. Spending a test cycle
  here would measure a tie.
- **On the A14B option (A14B-TIER.md §4): taken, conditionally.**
  If the GGUF A14B proof is ever run, the LightX2V I2V distill
  LoRA pair (634,645,944 + 739,472,104 B, Apache-2.0) is already
  written into that staging plan (`mochiichao-wan22-a14b-common`),
  because A14B at 20–30 steps × 2 experts on a T4 is the one
  place step count is a genuine wall. **The specific artifact to
  test:** Q4_K_M GGUF pair + the 1022 rank-64 LoRA pair at
  4 steps / CFG 1.0 vs the same pair at 20 steps — acceptance is
  the frame-1 likeness gate plus wall time; a speed win that
  costs likeness is a fail under the owner's bar.
- **Framework itself: already in the programme** (full-stack
  lane's pinned clone + T4 profile for Wan-Animate / VACE
  seats). No duplicate pull-in is proposed here; this eval adds
  only the two LoRA files to the A14B staging plan and records
  why the 5B seat stays on Turbo.
