# 09 — OpenVINO / NNCF INT4-INT8 Wan pipelines on this VM

**Written verdict only. No test was run, and none is claimed.**
This VM is CPU-only (the GPU seat is Kaggle). Sources: OpenVINO's own
documentation (GenAI/Optimum-Intel INT4 export flow, CPU LLMPipeline)
and the OpenVINO org's published INT4 model cards, read 2026-10-28.

## The question split in two

### 1. Wan video generation on CPU via OpenVINO/NNCF — NOT CLAIMED, not plausible as a production route

- No OpenVINO-native Wan pipeline was found in Intel's docs or model
  zoo: OpenVINO GenAI's documented CPU pipelines are LLM/VLM-class;
  the published NNCF INT4 conversions are language models (Llama,
  Gemma, Qwen, gpt-oss cards). A Wan INT4/INT8 route would mean
  hand-converting a multi-model diffusion graph (T5 encoder + DiT +
  VAE, dynamic frame counts) with no upstream recipe — research, not
  wiring.
- Even granting a conversion, the arithmetic is against it: our
  measured GPU baseline for one short TI2V-5B segment is 78.5 s on
  the accelerated path (item 08 record) and the unaccelerated path
  was 1787.6 s — on a GPU. A CPU has orders of magnitude less
  throughput for DiT attention; INT4 weight compression shrinks
  memory, it does not create GPU-class FLOPs. A 5 s clip would be a
  hours-class job. **Verdict: do not adopt for video; any future
  claim requires a measured run, which this lane did not do.**

### 2. Small utility models on CPU — PLAUSIBLE, spec-level, unmeasured

Where OpenVINO/NNCF genuinely fits this VM:

- **Captioning / prompt assistance**: a small INT4 VLM/LLM through
  OpenVINO GenAI on CPU is a documented, supported shape (the docs'
  own example runs an INT4 LLM pipeline on `"CPU"`). This could serve
  the local-Qwen slot (NONFREE-EQUIVALENTS: script assistance /
  frame description) without touching the GPU seat. Candidate, not
  wired: our Qwen2.5-VL-7B staging is a Kaggle-side cache
  (avatar-tool-build/pull-ins), and an OpenVINO conversion of it has
  not been made or measured.
- **Matting**: NO. Our matting is already solved CPU-side by
  deterministic code (white_matte.py, recomposite diff 1.08) and
  BiRefNet (MIT) for non-white fields; an INT8 OpenVINO BiRefNet is
  conceivable but solves no open problem.
- **Speech utilities** (Whisper-class INT8) are a documented
  OpenVINO shape and could serve transcription checks locally; our
  alignment need is already met by Rhubarb on WAV dialogue.

## Bottom line

OpenVINO/NNCF: **evaluated — not taken for Wan (no upstream pipeline,
CPU arithmetic forbids it); recorded as a candidate route for small
CPU utility models (captioning/text) if the local-Qwen slot ever
needs to run on this VM instead of the Kaggle seat.** Nothing was
installed, converted, or benchmarked by this lane; if that changes,
the first deliverable is a measured timing on a named model, not a
claim.
