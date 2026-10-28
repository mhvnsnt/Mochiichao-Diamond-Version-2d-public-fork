# TURBO T5 FIX — why the Wan Turbo path dies in warmup, and the corrected graph

Date: 2026-10-28. Deliverable graph: `workflow-turbo-fixed.json`
(same Turbo graph as the production notebook, T5 path replaced,
one further drift fix included). All code citations are from
kijai/ComfyUI-WanVideoWrapper source fetched via the GitHub API on
2026-10-28: `nodes.py` blob `f0b0e84dc6ba4685ade9713956e92c4eef8333d5`,
`nodes_model_loading.py` blob `f5b7558e7a923a2659a05fa19371f41912c1972b`.
Failure evidence is our own: `test-scene/proof-harvest/comfy.log`
in this workspace.

---

## 1. The failure, exactly as recorded

Warmup of the optimized (wrapper + Turbo LoRA + torch.compile) graph
dies in 0.02 s:

```
[ERROR] !!! Exception during processing !!! Invalid T5 text encoder model, fp8 scaled is not supported by this node
  File ".../ComfyUI-WanVideoWrapper/nodes.py", line 266, in process
    t5, = LoadWanVideoT5TextEncoder().loadmodel(model_name, precision, "main_device", quantization)
  File ".../ComfyUI-WanVideoWrapper/nodes_model_loading.py", line 2004, in loadmodel
    raise ValueError("Invalid T5 text encoder model, fp8 scaled is not supported by this node")
```

Both the single-character proof run and the scene run hit this and
fell back to the native baseline (proof: 1,236.2 s for 45 frames;
scene: ≈3 h 56 m for 4×81 frames). The benchmarked A/B that the
Turbo path is supposed to reproduce: **78.5 s vs 1,787.6 s (22.8×)**
(wrapper + Turbo LoRA rank-64 + torch.compile, 4 steps, CFG 1.0 —
recorded 2026-10-27 in the repo's `backends.json`).

## 2. Root cause (from the loader's own code)

`LoadWanVideoT5TextEncoder.loadmodel` (`nodes_model_loading.py`,
current main, lines 1996–2004 in the fetched blob):

```python
if quantization == "disabled":
    for k, v in sd.items():
        if isinstance(v, torch.Tensor):
            if v.dtype == torch.float8_e4m3fn:
                quantization = "fp8_e4m3fn"
                break

if "token_embedding.weight" not in sd and "shared.weight" not in sd:
    raise ValueError("Invalid T5 text encoder model, this node expects the 'umt5-xxl' model")
if "scaled_fp8" in sd:
    raise ValueError("Invalid T5 text encoder model, fp8 scaled is not supported by this node")
```

Three facts fall out of this, and they decide the fix:

1. **The rejection is unconditional.** It is a key-presence check on
   the state dict (`"scaled_fp8" in sd`), executed *before* any
   quantization handling. The Comfy-Org file
   `umt5_xxl_fp8_e4m3fn_scaled.safetensors` carries Comfy's
   per-tensor scale weights under that key family — that is what
   "scaled" means in the Comfy repackaging. No node setting avoids
   it: the node's `quantization` input only offers
   `disabled` / `fp8_e4m3fn`, and neither is consulted before the
   raise.
2. **The failing node is not the problem — the file is.**
   `WanVideoTextEncodeCached.process` (nodes.py line ~266) simply
   hard-calls this same loader with whatever `model_name` the graph
   gives it. The notebook's optimized graph gave it the scaled file
   (the only UMT5 the notebook staged — cell 3 stages the Comfy-Org
   set, which is correct for the *native* graph and wrong for the
   *wrapper* graph; the two graphs share one `models/text_encoders`
   folder, which is how the wrong file got fed).
   The **non-cached** `WanVideoTextEncode` does not load anything
   itself — it takes a `t5` input (`WANTEXTENCODER`) produced by
   `LoadWanVideoT5TextEncoder`. So swapping Cached→non-cached alone
   changes nothing; **the fix is the encoder file**, and the node
   swap is done anyway in the delivered graph so the loader is
   explicit and auditable in `/history`.
3. **The native path accepts the scaled file** — the proof log shows
   Comfy core loading it fine ("Found quantization metadata version
   1 / Using MixedPrecisionOps for text encoder", 6,419 MB staged).
   This is a wrapper-only restriction. Do not "fix" it by removing
   the scaled file: the native fallback graph (and the locked VACE
   graph in this package) needs it.

## 3. The fix — encoder files the wrapper loader accepts

The loader accepts any UMT5-XXL file that (a) contains
`token_embedding.weight` or `shared.weight`, and (b) contains **no**
`scaled_fp8` key. Kijai's own repo ships exactly those builds, and
every upstream wrapper example workflow read this session
(2.2-5B I2V, VACE 1.3B, Stand-In) uses one of them
(`umt5-xxl-enc-bf16.safetensors`). Sizes from the HF API listing of
Kijai/WanVideo_comfy, fetched 2026-10-28
(`https://huggingface.co/api/models/Kijai/WanVideo_comfy?blobs=true`):

| File (Kijai/WanVideo_comfy, repo root) | Bytes | Loader behaviour | Verdict |
|---|---:|---|---|
| `umt5-xxl-enc-fp8_e4m3fn.safetensors` | **6,731,333,792** | fp8 tensors, no scale key → auto-detected as `fp8_e4m3fn` (the loader's own `disabled`→detect path above) | **PRIMARY FIX — used in `workflow-turbo-fixed.json`.** Same fp8 class as the staged file, 4,573,105 B smaller (the scale tensors are exactly the difference vs the scaled file's 6,735,906,897 B). |
| `umt5-xxl-enc-bf16.safetensors` | **11,361,845,464** | Full bf16 weights, no fp8 anything | **Fallback / quality reference.** What all upstream examples use. Costs +4.63 GB of staging and more RAM/VRAM at encode time (the node loads then fully unloads the T5, per its description, so the cost is transient). Use if the fp8 build shows any encode anomaly. |
| `umt5_xxl_fp8_e4m3fn_scaled.safetensors` (Comfy-Org, **already staged**) | 6,735,906,897 | **Rejected unconditionally** (root cause above) | Keep for the native + native-VACE graphs only. Never feed to a wrapper text node. |
| `umt5_xxl_fp16.safetensors` (Comfy-Org) | not size-verified this session — not claimed | Another Comfy-repack UMT5 build; not needed | Not used. The two Kijai rows above are sufficient and verified. |

Licence: all UMT5-XXL builds are repackagings of the same Wan-family
encoder — Apache-2.0 bucket, consistent with the staging table's
existing labels for the staged file. Kijai/WanVideo_comfy's card
declares no separate licence field (HF API `cardData.license =
null`, fetched 2026-10-28); the wrapper code itself is Apache-2.0
(GitHub licence API for kijai/ComfyUI-WanVideoWrapper: key
`apache-2.0`, fetched 2026-10-28).

### Kaggle-notebook application (precise, minimal)

In the production/scene notebook, change exactly two things:

1. **Stage one more file** (cell 3b-style, alongside the Turbo LoRA):
   ```python
   path = hf_hub_download(repo_id='Kijai/WanVideo_comfy',
                          filename='umt5-xxl-enc-fp8_e4m3fn.safetensors')
   shutil.copy(path, 'models/text_encoders/umt5-xxl-enc-fp8_e4m3fn.safetensors')
   ```
   (Root-level file in that repo — verified in the API listing
   above; no subfolder.)
2. **Replace node "5" of `optimized_workflow()`** with the two nodes
   "5"+"6" of `workflow-turbo-fixed.json` in this folder
   (`LoadWanVideoT5TextEncoder` + `WanVideoTextEncode`, `t5` wired),
   and point the sampler's `text_embeds` at the new encode node.
   Nothing else in the graph changes: Turbo LoRA, compile settings,
   4 steps / CFG 1.0 / shift 5.0 / unipc stay as benchmarked.

Expected proof on the next run: warmup completes (no ValueError in
the server log), and the timed run lands in the benchmarked
~78.5 s class for a 49-frame segment instead of falling back. If
warmup *still* fails, the log line to look for is the loader's
other raise (`this node expects the 'umt5-xxl' model`) — that would
mean the wrong file was staged, not a new drift.

## 4. Second drift found while fixing (flagged, fixed in the delivered graph)

The notebook's optimized graph feeds the LoRA as
`WanVideoModelLoader.inputs."lora_args"`. In current wrapper source
the input is named **`lora`** (`nodes_model_loading.py`,
`WanVideoModelLoader.INPUT_TYPES`: `"lora": ("WANVIDLORA", …)`;
`compile_args` and `block_swap_args` are unchanged). Under the API,
an unknown input name is at best ignored — i.e. the Turbo LoRA may
have been silently unmerged in recent runs even before the T5
error (the T5 error fired first, at warmup, so this was masked).
`workflow-turbo-fixed.json` uses `"lora"`. **Action for the Kaggle
lane:** apply the same one-word rename in the notebook's
`optimized_workflow()`; verify in `/history` that node 3 carries
`lora: ["2", 0]`.

## 5. What was NOT done

- No patch to the wrapper's Python (e.g. stripping `scaled_fp8`
  keys at load). The loader's rejection is deliberate — scaled-fp8
  T5 weights need Comfy's MixedPrecisionOps handling, which the
  wrapper's T5 implementation does not implement; stripping the
  scales would silently change the encoder's numerics. The file
  swap is the upstream-intended route (it is what every upstream
  example does).
- The delivered graph was not executed here — this worker does not
  use Kaggle this round (another worker owns the seat; API limits
  are account-wide). It is source-verified node by node and ready
  to queue; the warmup pass/fail in §3 is its acceptance test.
