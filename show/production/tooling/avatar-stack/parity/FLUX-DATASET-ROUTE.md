# FLUX DATASET ROUTE — can FLUX.1-schnell be staged on Kaggle at all?

Date: 2026-10-28. Script: `flux_dataset_stage.py` (this folder —
syntax-checked, `--self-test` executed and passing this session;
**not** run against Kaggle: another worker owns the seat this
round and the account was rate-limited earlier today).

## 1. The two failures, restated with this session's re-verification

| Blocker | Evidence |
|---|---|
| (a) **Gating.** Official repo is `gated: "auto"` | HF API re-fetched 2026-10-28: `black-forest-labs/FLUX.1-schnell`, `cardData.license = "apache-2.0"`, `gated = "auto"`. Direct file fetch without a token returns **HTTP 401** (reproduced this session against `model_index.json`). Pull-in attempt 1 died the same way inside the kernel (`GatedRepoError … 401`). No HF token exists in this environment. |
| (b) **Kernel working disk.** `flux1-schnell.safetensors` alone is **23,782,506,688 B** (23,782.51 MB, official LFS sha256 `9403429e0052277ac2a87ad800adece5481eecefd9ed334e1f348723621d2a0a`) | Kaggle kernel free `/kaggle/working` measured **20,940.49 MB** in pull-in attempt 2's own log warning (`Not enough free disk space… expected 23782.51 MB… only 20940.49 MB free`), which then died with `OSError: [Errno 28] No space left on device`. |

Licence is **not** a blocker: FLUX.1-schnell is **Apache-2.0**
(open source; explicitly not FLUX.1-dev's non-commercial licence).

## 2. The route investigation

Three candidate shapes were checked against the measured numbers:

1. **`snapshot_download` → `kagglehub.dataset_upload` from the same
   kernel.** Dead before it starts: `dataset_upload(handle,
   local_dataset_dir)` (kagglehub, PyPI docs: "Uploads a new dataset
   (or a new version if it already exists)") uploads files that
   already exist in a local directory — the download must land on
   `/kaggle/working` first, and the single file does not fit there.
   The upload call changes *where the durable copy lives*, not the
   transient disk the download needs. **Verdict: cannot work for
   the single file.**
2. **Split the single file into parts that DO fit, one at a time.**
   Range-download 4.0 GB slices (HTTP `Range`, honoured by HF's
   resolve/CDN redirect chain), `dataset_upload` each slice as its
   own dataset, delete the local slice, repeat. Peak disk: one
   4.0 GB part + the upload staging copy — comfortably under
   20,940 MB. Six parts cover the file exactly (the script's
   `--self-test` asserts coverage/contiguity arithmetically).
   **Staging: works.** But **consumption still fails**: a consumer
   kernel that wants the assembled single file must write
   23.78 GB onto the same 20,940 MB quota. Chunked staging moves
   the wall from the staging kernel to the consumer kernel; it
   does not remove it. The script implements this route anyway
   (`--stage`) because it is the correct staging for any
   **non-Kaggle** consumer with ≥24 GB disk — and its manifest
   (per-part sha256 + the whole-file official hash) makes the
   parts independently verifiable.
3. **Stage the diffusers-format tree instead of the single file.**
   The same repo ships the same transformer as three shards —
   9,962,580,296 + 9,949,328,904 + 3,870,584,832 = 23,782,494,032 B —
   plus `vae/diffusion_pytorch_model.safetensors` (167,666,902 B)
   and text encoders totalling 9,770,792,936 B. **Every individual
   file is under the working limit**, and sensible groupings are
   too: dataset A = shards 1+3 (13,833,165,128 B), dataset B =
   shard 2 (9,949,328,904 B), dataset C = vae + encoders + configs
   (≈9.94 GB). Each group: download → `dataset_upload` → delete,
   no Range requests needed at all. The consumer kernel then
   builds a model folder of **symlinks into the read-only
   `/kaggle/input` dataset mounts** (input storage is not the
   working quota) and loads with diffusers/ComfyUI shard-by-shard
   from the mounts — **no byte of the 23.8 GB is ever copied onto
   working disk, in either kernel.** Hashes: every shard's LFS
   sha256 in the ungated mirror was compared against BFL's
   official listing **again this session** (HF API, both repos):
   identical, file by file (`9b633dbe…`, `58b44340…`, `e2cbc254…`
   for the transformer shards; the mirror's `.sft` renames touch
   only `ae` and the big file, not the diffusers tree).
   **Verdict: this route works, end to end, on Kaggle.**

## 3. The verdict

- **A working route EXISTS and is delivered:** route 3 (diffusers
  tree, 3 datasets, symlink consumer layout), with route 2's
  chunked script (`flux_dataset_stage.py --stage`) as the
  single-file staging variant for non-Kaggle consumers. The
  script's `--assemble-plan` prints route 3's exact layout and
  numbers; its `--self-test` verifies the split maths offline.
- **What remains genuinely blocked is narrower than "FLUX can't
  be staged":** the **single-file fp16 checkpoint can never be
  materialised on a Kaggle kernel** (23,782,506,688 B > the
  20,940.49 MB working quota, for staging and consumer alike).
  Two honest ways around that specific shape, if it is ever
  mandatory: (i) the **fp8 single file, 17,236,328,572 B**
  (pull-in report's figure) — fits the quota with ~3.7 GB spare;
  (ii) run the consumer off-Kaggle with ≥24 GB free disk.
- **The gating half needs no owner step on the mirror route**
  (hash-verified mirror, §2.3). **If the parent prefers the
  official repo as the source of record, the exact unblocking
  step is:** (1) in a browser signed in to Hugging Face, open
  the `black-forest-labs/FLUX.1-schnell` model page and accept
  the Apache-2.0 licence (gated-auto repos grant access on
  acceptance); (2) create a read token on the HF tokens page;
  (3) add it as a Kaggle Secret named `HF_TOKEN` on the staging
  kernel. Muse's main lane has the signed-in browser for step 1
  (per the standing browser law this is not an owner-only step);
  steps 2–3 are credential handling through the approved secret
  flows. This subagent created no accounts and accepted no
  licences, per instructions.
- **Priority note (unchanged from the teardown):** FLUX is the
  *bypassed-by-default* stills piece — the pipeline animates canon
  art directly because restyle is what drifts likeness. This route
  removes the "cannot stage" blocker so the piece is *available*;
  it does not make FLUX part of the parity path, and a T4 FLUX run
  would use CPU-offloaded inference (24 GB-class bf16 weights on a
  16 GB card) — staged and runnable is the claim, fast is not.
