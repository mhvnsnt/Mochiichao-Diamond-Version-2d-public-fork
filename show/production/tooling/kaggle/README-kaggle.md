# Kaggle GPU endpoint — how it fits the pipeline

Settled 2026-10-27: Kaggle (account "Mars FMMG", signed in via
Google) is the show's GPU endpoint. T4 x2 live; ~22h03m of the 30h
weekly GPU quota remained at wiring time. Session options on
Kaggle showed exactly: None / GPU T4 x2 / TPU v5e-8.

- Notebook: mochiichao-comfyui-wan.ipynb (this folder) — ComfyUI
  headless API + Wan 2.2 (Apache-2.0, the house base per
  FULLSTACK-WIRING) + the triple-lock nodes (IP-Adapter,
  ControlNet aux, Manager). Character LoRAs are trained ONLY on
  the owner's own art (Likeness Law) and dropped in per batch.
- Quota discipline: batch per scene, kill idle sessions, prefer
  the 5B TI2V for drafts and reserve the 14B for finals.
- Staging rule applies: weight MASTERS live on TeraBox; Kaggle
  pulls a working set per session (or reads a private Kaggle
  Dataset snapshot for speed — dataset is a cache, TeraBox is the
  warehouse). Outputs download per batch into the workspace and
  ration into the repo via manifests (SHA-256), never bulk media
  into git.
- The notebook is authored + versioned here; running it happens
  in the owner's Kaggle (import the .ipynb, set Accelerator =
  GPU T4 x2, Run All). First live run = first generative scene
  batch, gated by the automated likeness gate before anything
  ships (UNIFIED-PIPELINE).

## Acceleration (v2 notebook, added 2026-10-27)

Baseline measured 2026-10-27: stock fp16 TI2V-5B, native nodes,
20 steps uni_pc, CFG 5.5, seed 42, 49f @16fps, 480x1024 =
**1708s (28m28s)**. The v2 notebook
(mochiichao-comfyui-wan-v2.ipynb) wires the free acceleration
stack (details + licences: TOOLS-MANIFEST.md §Wan acceleration
stack). Optimized settings (Run B):

- Model: stock wan2.2_ti2v_5B_fp16 + **Wan22 Turbo LoRA**
  (Kijai/WanVideo_comfy, strength 1.0) — the 5B step-distill.
  There is NO LightX2V Lightning LoRA for TI2V-5B (A14B only).
- Sampler (wrapper WanVideoSampler): **4 steps, CFG 1.0,
  unipc, shift 5.0, seed 42**, latent exactly 480x1024, 49f.
- torch.compile settings ON (inductor, default mode) — first
  run pays a multi-minute compile; the protocol times run 2.
- TeaCache OFF on the distilled run (no headroom at 4 steps);
  finals path = stock model, 20 steps, WanVideoTeaCache
  rel_l1_thresh 0.15, compile ON (~1.5–2x expected).
- NO upscale node anywhere in either A/B graph (see audit).
- Attention on T4 is PyTorch SDPA — SageAttention and
  FlashAttention 2 require Ampere (sm80)+ and cannot run here.

**Measurement rule:** every speed figure in the manifest and
this README is a community-reported estimate UNTIL the v2 A/B
rerun (same seed/prompt/latent, baseline cell vs optimized
cell, warm compile) is timed on Kaggle — then the measured
numbers replace the estimates, in both docs, in the same commit
as the run report.

**2x audit (test 1 returned 960x2048 for a 480x1024 request):**
before the rerun, fetch the original executed graph from the
session's /history and inspect it (v2 notebook ships
`audit_graph()`): grep for any *Upscale* node class, and check
whether the latent was built at /8 stride (Wan 2.1 habit) for
the 16x-stride Wan 2.2 VAE — either explains an exact 2x. The
v2 graphs are the control: no upscale, latent pinned 480x1024.
