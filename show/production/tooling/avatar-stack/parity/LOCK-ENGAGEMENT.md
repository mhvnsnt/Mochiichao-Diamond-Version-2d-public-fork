# LOCK ENGAGEMENT — how the likeness lock is actually wired, and how a run proves it

Date: 2026-10-28. Workflows: `workflow-i2v-locked.json` (primary, native
graph, runs on the already-staged bytes) and
`workflow-i2v-locked-wrapper.json` (the same lock in
ComfyUI-WanVideoWrapper form, for the seat that prefers the wrapper —
needs two unstaged files, listed in §4).

Every node name, input name and output index below was read from the
node source this session, not from memory or from a UI export:

- ComfyUI core `comfy_extras/nodes_wan.py` (`WanVaceToVideo`,
  `TrimVideoLatent`) — fetched via the GitHub API from
  Comfy-Org/ComfyUI, 2026-10-28.
- kijai/ComfyUI-WanVideoWrapper `nodes.py` (blob
  `f0b0e84dc6ba4685ade9713956e92c4eef8333d5`), `nodes_model_loading.py`
  (blob `f5b7558e7a923a2659a05fa19371f41912c1972b`),
  `nodes_sampler.py` (blob `32b51c6aa8e4daea742652f08a4e775b9d28b9b0`),
  `nodes_utility.py` — fetched via the GitHub API, 2026-10-28.
- Core loader/sampler nodes (`UNETLoader`, `CLIPLoader`, `VAELoader`,
  `CLIPTextEncode`, `ModelSamplingSD3`, `KSampler`, `VAEDecode`,
  `CreateVideo`, `SaveVideo`, `LoadImage`) — wiring copied from two
  in-workspace graphs that already ran: the production notebook's
  `native_workflow()` and the full-stack lane's VACE job
  (`~/workspace/ep01-rebuild/full-stack/job/workflow.json`).

---

## 0. The correction that shapes this deliverable (read first)

**There is no IP-Adapter node for Wan.** Not in the wrapper, not in
ComfyUI core, not anywhere in this stack. The wrapper's full node
registry was read this session: the string "IPAdapter" does not occur
in `nodes.py`, `nodes_model_loading.py` or `nodes_sampler.py`. This
matches the programme's own standing correction (repo
`backends.json`, 2026-10-27/28: IP-Adapter and ControlNet are
`not_a_wan_lock` — the SD-side `ComfyUI_IPAdapter_plus` pack that was
cloned in early notebooks can never engage a Wan graph; the scene
notebook's cell 5 says the same in its own comments).

The brief's "IP-Adapter-for-Wan reference nodes" therefore resolves,
under the real-code law, to the three reference mechanisms that
**do** exist for Wan, all verified in source:

| Mechanism | Node(s) | What it is | Status in these workflows |
|---|---|---|---|
| **VACE reference control** | native: `WanVaceToVideo.reference_image`; wrapper: `WanVideoVACEEncode.ref_images` + `WanVideoVACEModelSelect` → `WanVideoModelLoader.extra_model` | The reference image is VAE-encoded and **prepended** to the control latents with a zero (locked) mask, and carried into sampling as `vace_frames`/`vace_context` at `strength`/`vace_scale` for the whole run | **ENGAGED in both workflows** (§1, §2) |
| **Stand-In reference latent** | `WanVideoAddStandInLatent` (its input is literally named `ip_image_latent` — the closest thing to an "IP" node in the wrapper) | Adds a reference latent to `image_embeds["standin_input"]`, consumed by the sampler only when the Stand-In LoRA is merged | **NOT used — honestly.** It requires the Stand-In LoRA (`Stand-In_wan2.1_T2V_14B_ver1.0.safetensors`, from Kijai/WanVideo_comfy `Stand-In/`) on a **Wan 2.1 T2V-14B** base (upstream example `wanvideo_2_1_14B_Stand-In_reference_example_01.json`). No 14B base or Stand-In LoRA is staged, and bolting the node onto a 1.3B/5B graph would be present-but-not-engaged — the exact failure this package exists to fix. Route documented in §5. |
| **CLIP-vision image embeds** | `WanVideoClipVisionEncode` → `WanVideoImageToVideoEncode.clip_embeds` | CLIP-vision conditioning for the Wan 2.1 **I2V-14B** family | Not used: no I2V-14B weights staged; TI2V-5B takes no CLIP embeds. Not a VACE-stack input. |

So the triple lock as actually wired is: **(1) VACE reference
latent, (2) tight-framed start frame as the VACE first-frame/control
anchor, (3) the non-scaled-T5 text path** (so the run does not fall
back to an unlocked graph when the wrapper is used — see
`TURBO-T5-FIX.md`). Locks 1–2 are in the graph below; lock 3 is the
text path in both workflow files.

---

## 1. Primary graph — `workflow-i2v-locked.json` (native, staged bytes only)

Why native: the programme already made this call with evidence
(`~/workspace/ep01-rebuild/full-stack/FULL-STACK-REPORT.md`, wiring
decision): the staged VACE weight is the Comfy-Org **native-format
full model** `wan2.1_vace_1.3B_fp16.safetensors` (4,309,519,800 B,
staged, server-verified). The wrapper's VACE graph loads a different
packaging (T2V-1.3B base + separate VACE module) that is not staged.
The native graph runs on the staged bytes as-is — zero downloads.

### Connections, node by node

| # | Node | Connection | Why it is a lock, not decoration |
|---|---|---|---|
| 1 | `UNETLoader` → `wan2.1_vace_1.3B_fp16.safetensors` | out 0 → `ModelSamplingSD3.model`, then → `KSampler.model` | The VACE model itself: its transformer carries the VACE control blocks that consume `vace_frames`. A plain TI2V/I2V UNET would silently ignore the conditioning. |
| 2 | `CLIPLoader` → `umt5_xxl_fp8_e4m3fn_scaled.safetensors`, `type: wan` | out 0 → both `CLIPTextEncode.clip` | The **native** loader accepts the scaled fp8 file (the proof kernel's log shows it loading: "Using MixedPrecisionOps for text encoder", 6,419 MB staged). Only the *wrapper* loader rejects it — see `TURBO-T5-FIX.md`. |
| 3 | `VAELoader` → `wan_2.1_vae.safetensors` | out 0 → `WanVaceToVideo.vae` and `VAEDecode.vae` | Wan 2.1 VAE (16-ch latents) matches the VACE model's latent space. The 2.2 VAE (48-ch) would be a silent mismatch. |
| 6 | `LoadImage` → `dorowani_start_tight.png` | out 0 (IMAGE) → **`WanVaceToVideo.reference_image`** | **The lock connection.** The file is the tight-framed prep frame (canon cutout on white, character ≥85% of frame height — the `prep_start_frame.py` output, staged by the notebook under this exact name, hash-logged per the standing proof rule). |
| 7 | `WanVaceToVideo` | `positive`←4, `negative`←5, `vae`←3, `width 480, height 768, length 49, strength 1.0`, `reference_image`←6 | In core source (`nodes_wan.py`, `WanVaceToVideo.execute`): the reference is upscaled to the frame size, VAE-encoded, **concatenated in front of the control-video latents** (`torch.cat((reference_image, control_video_latent), dim=2)`), its mask segment is **zero-padded** (mask 0 = known/locked, vs 1 = generate), and both conditionings are stamped with `vace_frames` / `vace_mask` / `vace_strength`. `control_video`/`control_masks` are deliberately omitted: source then substitutes a neutral grey (0.5) field with an all-generate mask, i.e. reference-only mode — the clip is driven by text + the locked reference, with no performance video required. |
| 7→9 | outputs | out 0 → `KSampler.positive`, out 1 → `KSampler.negative`, out 2 → `KSampler.latent_image`, **out 3 (`trim_latent`) → `TrimVideoLatent.trim_amount`** | Out 3 is the wire the earlier in-workspace FLF graph (`job/workflow.json`) left unconnected: with a reference prepended, the sampled latent contains the reference frame(s) at the head; `TrimVideoLatent` removes exactly `trim_latent` of them (source: `samples[:, :, trim_amount:]`). Without this wire the saved clip would carry the reference as a frozen first frame. |
| 8 | `ModelSamplingSD3` shift 8.0 | 1 → 9 | Same value as the in-workspace VACE job graph. |
| 9 | `KSampler` | steps 30, cfg 5.0, `uni_pc`/`simple`, seed 2002, denoise 1.0 | Values carried from the in-workspace VACE job graph (steps/cfg/sampler identical; seed = the scene job's Dorowani base seed). |
| 11–13 | `VAEDecode` → `CreateVideo` (fps 16) → `SaveVideo` (`locked_i2v_dorowani`) | — | Core output path, same as the production notebook. |

### How engagement is verified at runtime (no trust required)

1. **`/history` audit (strongest, machine-checkable):** after the run,
   fetch the prompt from ComfyUI `/history/<prompt_id>` and assert:
   node 7's inputs contain `reference_image: ["6", 0]`, node 1's
   `unet_name` is the VACE file, and node 10's `trim_amount` is
   `["7", 3]`. If any is missing, the lock was not in the graph that
   ran — fail the run record, whatever the clip looks like.
2. **Latent-length tell:** with a reference engaged, the initial
   latent length is `((49-1)//4)+1 + 1 = 14` latent frames, not 13 —
   visible in the sampler's progress/shape logging and in the fact
   that `trim_latent` returns 1. A run whose decode needed no trim
   did not have a reference prepended.
3. **Frame-1 gate (the owner's bar):** extract frame 0 of the saved
   MP4 and run the existing likeness gate against the fed reference
   (SSIM/IoU/RGB-MAD, thresholds already in repo tooling). The proof
   failure this package answers was SSIM 0.2938 / frame-1 "reference
   never anchored". The fed input + its sha256 are logged with the
   run, per the standing proof rule.
4. **Negative control (once, at first locked run):** re-run the same
   graph with node 6 pointed at a *different* character's cutout.
   Frame 1 must change to that character. If it doesn't, the
   reference path is not driving the output and the lock claim is
   withdrawn. (Cheap: one 49-frame 1.3B run.)

---

## 2. Wrapper form — `workflow-i2v-locked-wrapper.json`

Same lock, wrapper nodes, mirroring upstream's own VACE example
(`example_workflows/wanvideo_1_3B_VACE_examples_03.json`, read node by
node this session — its subgraph 3 wires exactly:
`WanVideoVACEEncode.vace_embeds → WanVideoSampler.image_embeds`,
`… .ref_images ← reference LoadImage`,
`WanVideoVACEModelSelect → WanVideoModelLoader`):

- `WanVideoVACEModelSelect.vace_model = Wan2_1-VACE_module_1_3B_bf16.safetensors`
  → out 0 (`extra_model`, type VACEPATH) → `WanVideoModelLoader.extra_model`.
  In `loadmodel`, a non-None `extra_model` is added to the main
  transformer — this is what gives the sampler VACE blocks to feed.
- `WanVideoModelLoader.model = Wan2_1-T2V-1_3B_bf16.safetensors`
  (bf16, quantization disabled, offload_device, sdpa) with
  `compile_args` ← `WanVideoTorchCompileSettings` and
  `block_swap_args` ← `WanVideoBlockSwap` (10 main blocks, 5 of the
  15 VACE blocks swapped — T4 sizing).
- Text: `LoadWanVideoT5TextEncoder` with the **non-scaled** bf16 file
  (§4) → `WanVideoTextEncode.t5` (the non-cached node; see
  `TURBO-T5-FIX.md` for why the Cached node + scaled file is the
  failure pair).
- `LoadImage` (start) → `WanVideoVACEStartToEndFrame.start_image`
  (`nodes_utility.py`: builds the 49-frame batch — start frame first,
  remaining frames at `empty_frame_level 0.5` — plus masks) →
  out 0 → `WanVideoVACEEncode.input_frames`, out 1 →
  `WanVideoVACEEncode.input_masks`.
- `LoadImage` (reference, separate node on purpose) →
  `WanVideoVACEEncode.ref_images`. In `WanVideoVACEEncode.process`
  (nodes.py), `ref_images` are VAE-encoded and concatenated **in
  front of** the control latents, and the returned dict carries
  `"has_ref": True`, `"vace_context"`, `"vace_scale": strength`.
- `WanVideoVACEEncode` out 0 (`vace_embeds`) →
  `WanVideoSampler.image_embeds` — it **replaces** the I2V embeds;
  there is no second image-embeds input to forget. In
  `WanVideoSampler.process` (nodes_sampler.py, ~lines 303–338) the
  sampler reads `image_embeds["vace_context"]` / `["vace_scale"]`,
  builds the per-step VACE context list, and sets
  `target_shape[1] + 1 if has_ref` — the reference frame is inside
  the sampled sequence, then dropped at decode (`WanVideoDecode`
  drops the first latent frame when `has_ref`).
- `WanVideoSampler` (steps 20, cfg 5.0, shift 8.0, unipc, seed 2002)
  → `WanVideoDecode` → `CreateVideo`/`SaveVideo`.

Runtime verification (wrapper): the `/history` audit as in §1
(node 11 must show `ref_images: ["9", 0]` and `input_frames:
["10", 0]`; node 7 must show `extra_model: ["4", 0]`), plus the
frame-1 gate and the negative control. There is no VACE-specific
log line in the sampler — which is exactly why the history audit,
not log-scraping, is the primary proof.

---

## 3. What "tight framing" means here, concretely

Both graphs feed the reference at the **output frame size**
(480×768, the scene job's canvas): the core node upscales the
reference to width×height itself, and the wrapper's VACEEncode does
the same for `ref_images`. Tightness is therefore a property of the
**staged input file**, not of a graph node: the prep frame must be
the canon cutout cropped so the character fills ≥85% of the frame
height on a pure white field (the existing `prep_start_frame.py`
contract). A loose full-body-on-big-white-field reference is the
known weak-conditioning case; the run record must log the staged
file's sha256 so a loose frame can be caught in review.

---

## 4. Staging deltas (honest)

- **Primary (native) graph: zero.** All three weights are the staged,
  server-verified files (consistency-kit datasets).
- **Wrapper graph: two files, 4,344,793,609 B total**, from
  Kijai/WanVideo_comfy (HF API listing, 2026-10-28;
  `https://huggingface.co/api/models/Kijai/WanVideo_comfy?blobs=true`):
  - `Wan2_1-T2V-1_3B_bf16.safetensors` — 2,874,796,712 B
  - `Wan2_1-VACE_module_1_3B_bf16.safetensors` — 1,469,996,897 B
  - plus the T5 fix file from `TURBO-T5-FIX.md` (bf16 UMT5,
    11,361,845,464 B, or the fp8 non-scaled, 6,731,333,792 B) and
    Kijai's VAE naming (`Wan2_1_VAE_bf16.safetensors`; the staged
    Comfy-Org `wan_2.1_vae.safetensors`, 253,815,318 B, is the same
    Wan 2.1 VAE in the other packaging — the wrapper loader lists by
    filename in `models/vae`, so a rename/symlink at staging time is
    the whole conversion; flagged, not assumed: verify by size/hash
    when staged).

## 5. The Stand-In route (documented, not wired)

If a future tier wants the wrapper's IP-style latent lock as well:
stage `Stand-In/Stand-In_wan2.1_T2V_14B_ver1.0.safetensors` (LoRA)
+ a Wan 2.1 T2V-14B base, build
`LoadImage → WanVideoEncode (VAE) → WanVideoAddStandInLatent.ip_image_latent`,
with the LoRA merged via `WanVideoLoraSelect`, on a
`WanVideoEmptyEmbeds` base — upstream's example workflow is the
template. It is a 14B seat (not the T4 1.3B/5B seat) and is **not**
part of the parity claim.
