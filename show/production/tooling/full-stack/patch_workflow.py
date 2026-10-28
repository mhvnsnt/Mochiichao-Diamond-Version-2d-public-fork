#!/usr/bin/env python3
"""Resolve the kit VACE FLF template into the exact graph we queue.
Wholesale adoption, minimal deltas: loader filename, prompts, input
filenames, size/length. Everything else is the kit's eval settings."""
import json, pathlib
SRC = pathlib.Path.home()/"workspace/kaggle-kit/avatar-stack/wan21_vace_first_last_frame.json"
DST = pathlib.Path.home()/"workspace/ep01-rebuild/full-stack/job/workflow.json"
wf = json.loads(SRC.read_text())["nodes"]
wf["1"]["inputs"]["unet_name"] = "wan2.1_vace_1.3B_fp16.safetensors"
wf["6"]["inputs"]["video"] = "flf_control.mp4"; wf["6"]["inputs"]["frame_load_cap"] = 49
wf["7"]["inputs"]["video"] = "flf_mask.mp4";    wf["7"]["inputs"]["frame_load_cap"] = 49
wf["8"]["inputs"]["image"] = "dorowani_cutout.png"
wf["4"]["inputs"]["text"] = ("flat 2D cartoon animation, preserve the exact character design of the reference: "
  "a blue bipedal creature with red fin-like cheeks, red eyes, a light cream belly, a small dorsal fin and a tan shell on its back. "
  "The creature raises its arms and forms a glowing blue orb of water swirling in its right hand, its left hand coming up to its chest, "
  "holding the charged orb up toward the viewer. Plain solid white background, locked-off camera, no camera movement.")
wf["5"]["inputs"]["text"] = ("photorealistic, 3d render, cgi, realistic, changing character design, morphing, deformed, "
  "extra limbs, extra characters, blurry, text, watermark, logo, colored background, camera movement, zoom")
wf["9"]["inputs"]["width"] = 480; wf["9"]["inputs"]["height"] = 768; wf["9"]["inputs"]["length"] = 49
wf["13"]["inputs"]["filename_prefix"] = "dorowani_vace_flf_proof"
DST.write_text(json.dumps(wf, indent=1))
print("wrote", DST)
for k in ("1","6","7","8","9","11","13"):
    print(k, wf[k]["class_type"], {kk: vv for kk, vv in wf[k]["inputs"].items() if not isinstance(vv, list)})
