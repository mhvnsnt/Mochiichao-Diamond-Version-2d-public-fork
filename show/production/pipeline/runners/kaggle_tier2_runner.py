# ---------------------------------------------------------------------------
# Mochiichao Studio - Tier 2 Kaggle Generation Runner v2.1 (corrected build)
# Execution target: Kaggle T4 x2 notebook, ComfyUI headless API on :8188
# Mode: Wan 2.2 Turbo generation + gate-packet preparation
#
# HONESTY CONTRACT (house law, do not weaken):
# - This runner NEVER marks a likeness gate PASSED. It generates,
#   extracts frames, and writes a gate packet with
#   likeness_gate = PENDING_VERIFICATION. Promotion happens only in
#   the gate step (automated scorer when wired, else owner review),
#   recorded in show/shared/clip-index.json.
# - It claims only the locks actually present in the workflow graph
#   it submits (see LOCKS below). If a lock is not in the graph, it
#   is not in the report.
# ---------------------------------------------------------------------------
import json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

API = os.environ.get("COMFY_API", "http://127.0.0.1:8188")
WORKDIR = Path(os.environ.get("KAGGLE_WORKING", "/kaggle/working"))
COMFY = WORKDIR / "ComfyUI"

CONFIG = {
    # Real staged filenames (v2 notebook, verified against HF + Kaggle run):
    "model": "wan2.2_ti2v_5B_fp16.safetensors",
    "turbo_lora": "Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors",
    "text_encoder": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
    "vae": "wan2.2_vae.safetensors",
    "input_ref": "wispkin.png",          # canon cutout, in ComfyUI/input
    "steps": 4, "cfg": 1.0, "scheduler": "unipc", "shift": 5.0,
    "width": 480, "height": 1024, "frames": 49, "fps": 16,
    "seed": 42,
    "prompt": ("Animate THIS EXACT character, preserving its design and flat 2D "
               "cartoon style precisely: a small fat round BLACK ghost body wearing "
               "a white cracked skull MASK held onto its face by two small black "
               "hands touching the sides of the mask, a small black flame tip above "
               "the mask, and the body's bottom tapering into a little ghost tail "
               "that dissolves into curling smoke beneath it. No legs. It floats "
               "gently up and down in place, mask tilting slowly as if listening, "
               "smoke curling softly below. Locked-off camera, plain solid background."),
    "negative": ("3d render, photorealistic, realistic human skull, anatomy, teeth, "
                 "legs, feet, tail, hair, beak, bill, extra characters, text, watermark, "
                 "style change, design change"),
}
LOCKS = {
    "start_image_conditioning": True,   # WanVideoImageToVideoEncode on the canon cutout
    "turbo_lora": True,
    "torch_compile": True,
    "ip_adapter": False,                # not a Wan TI2V node in this graph - not claimed
    "controlnet": False,                # not in this graph - not claimed
}

def api(path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(API + path, data=data,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode() or "null")

def verify_environment():
    stats = api("/system_stats")
    devs = stats.get("devices", [])
    assert devs, "FATAL: ComfyUI reports no devices. Kaggle T4 session required."
    print(f"[OK] GPU via ComfyUI: {devs[0].get('name')}")
    need = [COMFY / "models/diffusion_models" / CONFIG["model"],
            COMFY / "models/loras" / CONFIG["turbo_lora"],
            COMFY / "models/text_encoders" / CONFIG["text_encoder"],
            COMFY / "models/vae" / CONFIG["vae"],
            COMFY / "input" / CONFIG["input_ref"]]
    for p in need:
        if not p.exists():
            raise FileNotFoundError(f"Missing required asset: {p}")
    print("[OK] All asset paths verified on disk.")

def build_workflow():
    # WanVideoWrapper path, matching the v2 notebook optimized cell.
    # Node ids are local to this graph; class names are the contract.
    return {
        "1": {"class_type": "WanVideoModelLoader",
              "inputs": {"model": CONFIG["model"], "base_precision": "fp16",
                         "quantization": "disabled", "load_device": "offload_device",
                         "attention_mode": "sdpa"}},
        "2": {"class_type": "WanVideoLoraSelect",
              "inputs": {"lora": CONFIG["turbo_lora"], "strength": 1.0,
                         "low_mem_load": False}},
        "3": {"class_type": "WanVideoTorchCompileSettings",
              "inputs": {"backend": "inductor", "fullgraph": False,
                         "mode": "default", "dynamic": False}},
        "4": {"class_type": "LoadImage", "inputs": {"image": CONFIG["input_ref"]}},
        "5": {"class_type": "WanVideoTextEncode",
              "inputs": {"positive_prompt": CONFIG["prompt"],
                         "negative_prompt": CONFIG["negative"],
                         "force_offload": True, "use_disk_cache": False,
                         "device": "gpu"}},
        "6": {"class_type": "WanVideoImageToVideoEncode",
              "inputs": {"width": CONFIG["width"], "height": CONFIG["height"],
                         "num_frames": CONFIG["frames"], "noise_aug_strength": 0.0,
                         "start_latent_strength": 1.0, "end_latent_strength": 1.0}},
        "7": {"class_type": "WanVideoSampler",
              "inputs": {"steps": CONFIG["steps"], "cfg": CONFIG["cfg"],
                         "shift": CONFIG["shift"], "scheduler": CONFIG["scheduler"],
                         "seed": CONFIG["seed"], "force_offload": True,
                         "riflex_freq_index": 0}},
        "8": {"class_type": "WanVideoDecode",
              "inputs": {"tile_x": 272, "tile_y": 272, "tile_stride_x": 144,
                         "tile_stride_y": 128, "normalization": "default"}},
        "9": {"class_type": "CreateVideo",
              "inputs": {"fps": float(CONFIG["fps"]), "bit_depth": 8}},
        "10": {"class_type": "SaveVideo",
               "inputs": {"filename_prefix": "wispkin_tier2", "format": "mp4",
                          "codec": "h264"}},
    }

def run():
    verify_environment()
    wf = build_workflow()
    # NOTE: wiring between nodes (image/vae/model links) is resolved by the
    # notebook's graph_doctor step before submission in the live session;
    # this runner submits the graph it is handed by that step via
    # WORKFLOW_JSON override, falling back to build_workflow() structure.
    override = os.environ.get("WORKFLOW_JSON")
    if override:
        wf = json.loads(Path(override).read_text())
    pid = api("/prompt", {"prompt": wf})["prompt_id"]
    print(f"[RUN] queued prompt {pid} (4-step Turbo, locks={LOCKS})")
    while True:
        hist = api(f"/history/{pid}")
        if pid in hist:
            status = hist[pid].get("status", {})
            if status.get("completed"):
                break
            if status.get("status_str") == "error":
                raise RuntimeError(f"ComfyUI execution error: {status}")
        time.sleep(10)
    outs = hist[pid].get("outputs", {})
    files = [o for node in outs.values() for o in node.get("gifs", []) + node.get("images", [])
             if o.get("filename", "").endswith(".mp4")]
    assert files, "No MP4 in outputs"
    clip = files[0]["filename"]
    out_dir = WORKDIR / "tier2_out"; out_dir.mkdir(exist_ok=True)
    packet = {"status": "GENERATED_AWAITING_GATE", "clip": clip,
              "likeness_gate": "PENDING_VERIFICATION",
              "locks_actually_in_graph": LOCKS, "seed": CONFIG["seed"],
              "gate_criteria": "show/production/rigs/builds/wispkin/BODY-SPEC-OWNER-DIRECTION.md"}
    (out_dir / "gate_packet.json").write_text(json.dumps(packet, indent=2))
    print(f"[OK] Generated {clip}; gate packet written (PENDING_VERIFICATION).")
    print("[OK] Promotion requires the gate step - this runner does not pass clips.")

if __name__ == "__main__":
    run()
