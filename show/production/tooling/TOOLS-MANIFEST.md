# TOOLS MANIFEST — what's wired, where it runs, verified status

Updated 2026-10-27 (owner: "wire them up 100%… let me know when
done so we can start using it on the episode"). Machine facts:
this build VM = 2 vCPU / 7.7GB / no GPU / FFmpeg 8.1.2 / Python
3.12 / Node 24. Install discipline: no-sudo, ~/opt + venvs;
TMPDIR/PIP_CACHE on the home volume (/tmp is a 512MB tmpfs —
pip installs FAIL there without the redirect; learned live).

| Tool | Role in pipeline | Runs | Status |
|---|---|---|---|
| FFmpeg 8.1.2 | composite/audio/finish spine | here | WIRED (beds, animatic, proofs built with it) |
| build_manifest.py | script+boards+cue → episode manifest | here | WIRED (ambient_layers v1) |
| episode_gate.py | one-shot readiness across all gates | here | WIRED (EP01: 5/5 audio PASS, HALT 12 by design) |
| scene_audio_bed.py | per-scene audio beds + loudness gate | here | WIRED |
| sfx_pull.py | Freesound CC0 pulls closing SFX gaps | here | WIRED — needs owner's free Freesound API key to pull |
| Rigby2D (Apache-2.0) | layered rigs, pose library, film workspace | here (editor) + owner | CLONED ~/opt/tools/rigby2d; MCP entry in tooling/mcp/mcp-servers.json |
| TextRig MCP (MIT) | flat PNG → DragonBones rigs | here | INSTALLED + SMOKE-TESTED (MCP handshake OK, server v1.30.0; entry = mcp/serve.sh) |
| OpenToonz MCP (0.1.0a) | episode shots/.tnz scenes | here (server) + owner (OpenToonz) | INSTALLED in ~/opt/venvs-mcp; starts clean |
| OpenToonz 1.8 / Tahoma2D 1.6 | puppet production + shots | owner machine | WIRED as standard (rig standard doc); GUI-coupled |
| Rhubarb 1.13.0 | lip-sync timing (humans only by law) | here | INSTALLED ~/opt/bin/rhubarb, runs |
| git-lfs 3.5.1 | media versioning when media repo lands | here | INSTALLED ~/opt/bin/git-lfs |
| Blender 4.5 LTS | scriptable camera / GP | owner machine | SPECIFIED (FULLSTACK-WIRING) |
| Natron 2.5 | node composite (OCIO) | owner machine fallback | SPECIFIED (maintenance-mode appliance) |
| ComfyUI + Wan 2.2 | generative passes (triple-lock) | **Kaggle GPU (wired 2026-10-27)** | ENDPOINT PROVEN LIVE 2026-10-27: notebook imported + Run All on Kaggle — 2x Tesla T4 verified, ComfyUI v0.43.0 up, Wan 2.2 set staged (ti2v 5B fp16 + umt5 fp8 + vae, ~18GB), triple-lock nodes cloned, headless API answered 200. Quota after run ~21h56m of 30h. Notebook: kaggle.com/code/marsfmmg/mochiichao-comfyui-wan. Same pattern as the owner's video-fix-tools Viggle-on-Kaggle. Notebook build = next wiring step. |
| Chatterbox / Kokoro | human TTS / scratch voices | here (CPU scratch) / GPU | SPECIFIED (voice-pipe is owner's own) |
| EbSynth | — | — | DEMOTED (browser freemium; see FULLSTACK-WIRING §0) |

## Wan acceleration stack (added 2026-10-27)

Owner order: pull in + wire FREE tooling that improves raw Wan
time. Umbrella = FREE (OSS or free proprietary; licences labelled
honestly; nothing here is CC-BY-NC). Baseline (measured
2026-10-27): Wan 2.2 TI2V 5B fp16, native nodes, 20 steps uni_pc,
CFG 5.5, seed 42, 49f @16fps, 480x1024 → **1708s (28m28s)** on
Kaggle 2x T4; VAE decode OOM'd once → tiled fallback. Notebook:
tooling/kaggle/mochiichao-comfyui-wan-v2.ipynb (A/B cells built in).

| Technique | What / where | Licence | Expected gain* | Status |
|---|---|---|---|---|
| Step distillation — Wan22 Turbo LoRA | Self-Forcing distill of TI2V-5B, extracted as a LoRA by Kijai: `Kijai/WanVideo_comfy` → `LoRAs/Wan22-Turbo/Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors`, strength 1.0, **4 steps, CFG 1.0** | Self-Forcing upstream MIT; base Apache-2.0; no licence declared on the Kijai card — re-check before commercial ship | Sampling work drops 40 evals → 4 (~10x on the sampler) | WIRED in v2 notebook (Run B) |
| Step distillation (alt) — FastWan2.2-TI2V-5B-FullAttn | DMD+VSA distilled full checkpoint, 3 steps; ComfyUI file: Kijai repo `FastWan/Wan2_2-TI2V-5B-FastWanFullAttn_bf16.safetensors` | Apache-2.0 (verified on the FastVideo card) | Comparable to Turbo path | Staged in v2 notebook; not in the timed path |
| ~~LightX2V / Wan2.2-Lightning LoRA for 5B~~ | **Does not exist.** lightx2v/Wan2.2-Lightning ships A14B high/low pairs only (verified against the HF file list 2026-10-27); the 14B LoRAs remain available if the show moves to A14B finals | Apache-2.0 | n/a for 5B | NOT ADOPTED (no 5B file) |
| TeaCache / MagCache | Wan 2.2 support lives in **kijai/ComfyUI-WanVideoWrapper** (`WanVideoTeaCache`, rel_l1_thresh 0.15 wired; researched Wan I2V band 0.1–0.3). The standalone welltop-cn/ComfyUI-TeaCache pack supports Wan **2.1 only** — do not install it for this pipeline | Wrapper Apache-2.0; TeaCache pack Apache-2.0 | ~1.5–2x on the 20-step path; ~nothing on a 4-step distilled run (kept OFF Run B by design) | WIRED (finals-path cell) |
| torch.compile (inductor) | Native `TorchCompileModel` / wrapper `WanVideoTorchCompileSettings` (default mode, inductor). First run compiles for minutes (warm-run protocol in the notebook); shape changes force recompiles | BSD (PyTorch) | ~10–30% per-step (community: ~14% measured default mode; up to ~30% reported) | WIRED (Run B + finals cell) |
| Kijai ComfyUI-WanVideoWrapper | Adopted as the acceleration chassis: Wan 2.2-native cache nodes, block swap, compile settings, Turbo/FastWan examples ship in-repo. Block swap = VRAM tool, kept at 0 for the 5B (it fits one T4; swapping only slows it) | Apache-2.0 | Enabler for the rows above | WIRED (v2 notebook) |
| GGUF quantisation | city96/ComfyUI-GGUF + `QuantStack/Wan2.2-TI2V-5B-GGUF` Q8_0 (5.40GB; Q5_K_M 3.81 / Q4_K_S 3.12) into models/unet | Node pack open-source; weights inherit base Apache-2.0 | ~Speed-neutral on T4 (dequant cost ≈ offload saved); real win = VRAM headroom + avoids the VAE-decode OOM path | Staged (optional cell); NOT in timed path |
| SageAttention / FlashAttention 2 | **Not usable on T4**: SageAttention builds only for compute capability ≥ 8.0 (Ampere+); FA2 wheels likewise. A community flash-attention-turing fork exists but is not a ComfyUI drop-in. T4 attention = PyTorch SDPA | — | 0 on this hardware (Ampere+ lever) | REJECTED for T4 (documented) |
| Multi-GPU (DisTorch / ComfyUI-MultiGPU) | Layer/component sharding = VRAM pooling; sampling still executes on one device — **not a latency win** for a model that fits one T4. Real 2x T4 win is throughput (two independent generations, one per GPU) or parking T5/VAE on GPU 1 | Open-source | 0 latency; up to 2x batch throughput | NOT ADOPTED for latency (documented) |

\* All gains are community-reported/vendor figures until the
v2 notebook's timed A/B rerun replaces them with our measured
numbers (rule in README-kaggle.md).

**2x-resolution mystery (test 1 delivered 960x2048 from a
480x1024 request) — audit list for the next session:** (1) an
upscale stage left in a borrowed template (LatentUpscaleBy /
ImageUpscaleWithModel / ImageUpscaleBy — 480x1024 is exactly half
of 960x2048, prime suspect); (2) latent built at /8 stride (Wan
2.1 habit) but decoded by the 16x-stride Wan 2.2 VAE → exactly 2x
in both dims; (3) a preview/upscale branch mis-wired into
SaveVideo; (4) WanImageToVideo fed a start image at native size
through a second encode path. Method: fetch the executed graph
from the API /history (the v2 notebook ships `audit_graph()`),
grep class_types for *Upscale*, and check the latent dims against
the 16x stride. The v2 A/B cells contain NO upscale node, so the
rerun also serves as the control.

Unopened owner actions (everything else is wired): (1) Freesound
API key for sfx_pull; (2) ~~GPU endpoint choice~~ SETTLED 2026-10-27: Kaggle (see table);
(3) Mochiko voice casting (script-level open item, unrelated to
tooling). Picture production unblocks on (2) + the video service.
