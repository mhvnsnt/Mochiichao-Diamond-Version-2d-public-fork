#!/usr/bin/env python3
"""Qwen2.5-VL-7B prompt extension for the Mochiichao Wan seat.

Takes a reference image (the same tight-framed start frame the video
graph will consume) plus a short free-text action, and returns one
extended Wan-style I2V prompt: an exact description of THIS character
(read from the image, checked against the canon line), then the
action as a continuous performance, then the pipeline's style lock.

Designed to run INSIDE a Kaggle kernel with the private cache kernel
attached (kernel-metadata.json: "kernel_sources":
["marsfmmg/mochiichao-qwen25vl7b-cache"]). The cache's output appears
under /kaggle/input/mochiichao-qwen25vl7b-cache/ with weights/ (the
16-file Qwen/Qwen2.5-VL-7B-Instruct snapshot, 16,595,981,281 B,
Apache-2.0) and manifest.json (per-file sha256) inside. This script
finds that layout by itself; it never downloads the model unless
--allow-download is passed explicitly.

It also runs locally for interface testing with --dry-run (no model
is loaded; the exact chat payload that WOULD be sent is printed).

Usage:
  python3 qwen_prompt_extension.py --image dorowani_start_tight.png \
      --action "charges a glowing blue Water Orb between its hands" \
      --canon "Blue bipedal creature, red fin cheeks, red eyes, light belly, dorsal fin, tan shell on its back." \
      --out extended_prompt.json

  # batch: one JSON object per line: {"image":..., "action":..., "canon":...}
  python3 qwen_prompt_extension.py --batch-jsonl segments.jsonl --out prompts.jsonl

Exit codes: 0 ok; 2 model not found / not staged; 3 bad input.
Stdout (single mode) is JSON: {"extended_prompt": ..., "model_dir": ...,
"image_sha256": ..., "action": ...}. The image hash is included so the
caller can log it next to the video run (standing proof rule: every
generation run logs its exact fed input + hash).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from pathlib import Path

CACHE_KERNEL_SLUG = "mochiichao-qwen25vl7b-cache"
HF_REPO_ID = "Qwen/Qwen2.5-VL-7B-Instruct"
EXPECTED_TOTAL_BYTES = 16_595_981_281  # verified vs HF listing, PULL-IN-REPORT.md

SYSTEM_PROMPT = (
    "You are the prompt-extension step of a video-generation pipeline. "
    "You look at a character reference image and write prompts for a "
    "Wan image-to-video model. You never change the character's design, "
    "never invent new characters, props or backgrounds, and you output "
    "only the finished prompt text."
)

USER_TEMPLATE = """Character canon (authoritative — if the image seems to differ, trust this text): {canon}

Action to perform: {action}

Write ONE video prompt, 80-140 words, in English, structured exactly like this:
1. "Animate THIS EXACT character image, preserving its design and flat 2D cartoon style precisely."
2. A precise description of the character AS SEEN IN THE IMAGE: body shape, colours, face, distinctive features, art style.
3. The action above, described as one continuous physical performance (how it starts, what moves, how it ends).
4. "Do not change the character design, do not add anything, no 3D rendering, no new characters. Locked-off camera, plain solid white background."
Output ONLY the prompt. No preamble, no quotes, no explanation."""


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def find_model_dir(explicit: str | None) -> Path | None:
    """Locate the staged Qwen2.5-VL snapshot. Returns the weights dir."""
    candidates: list[Path] = []
    if explicit:
        candidates.append(Path(explicit))
    env = os.environ.get("QWEN_VL_DIR")
    if env:
        candidates.append(Path(env))
    kaggle_input = Path("/kaggle/input")
    if kaggle_input.is_dir():
        # The cache kernel's output: <slug>/weights/ + <slug>/manifest.json
        candidates.append(kaggle_input / CACHE_KERNEL_SLUG / "weights")
        for hit in kaggle_input.rglob("model-00001-of-00005.safetensors"):
            candidates.append(hit.parent)
            break
    for cand in candidates:
        if (cand / "model-00001-of-00005.safetensors").is_file() and (
            cand / "config.json"
        ).is_file():
            return cand
    return None


def check_snapshot(model_dir: Path, verify_hashes: bool) -> dict:
    """Size-check the snapshot against the staged manifest when present.

    The cache kernel writes manifest.json next to weights/ (i.e. in the
    parent of the weights dir) or inside it. Sizes are always checked;
    sha256 only with --verify-hashes (16 GB of hashing is not free).
    """
    report: dict = {"model_dir": str(model_dir), "manifest_found": False}
    manifest_path = None
    for cand in (model_dir / "manifest.json", model_dir.parent / "manifest.json"):
        if cand.is_file():
            manifest_path = cand
            break
    total = sum(p.stat().st_size for p in model_dir.iterdir() if p.is_file())
    report["total_bytes_on_disk"] = total
    if manifest_path is None:
        report["note"] = (
            "no manifest.json beside the snapshot; size total only "
            f"(expected {EXPECTED_TOTAL_BYTES} B for the verified cache)"
        )
        return report
    report["manifest_found"] = True
    manifest = json.loads(manifest_path.read_text())
    files = manifest.get("files", manifest if isinstance(manifest, list) else [])
    mismatches = []
    for entry in files:
        name = entry.get("name") or entry.get("rfilename") or entry.get("path")
        if not name:
            continue
        local = model_dir / Path(name).name
        if not local.is_file():
            mismatches.append(f"missing: {name}")
            continue
        size = entry.get("bytes") or entry.get("size")
        if size is not None and local.stat().st_size != int(size):
            mismatches.append(f"size mismatch: {name}")
            continue
        want = entry.get("sha256") or entry.get("sha256_lfs_official")
        if verify_hashes and want and sha256_of(local) != want:
            mismatches.append(f"sha256 mismatch: {name}")
    report["mismatches"] = mismatches
    return report


def build_messages(image_path: Path, action: str, canon: str) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": [
                {"type": "image", "image": str(image_path)},
                {
                    "type": "text",
                    "text": USER_TEMPLATE.format(canon=canon.strip(), action=action.strip()),
                },
            ],
        },
    ]


def load_model(model_dir: Path):
    """Load Qwen2.5-VL. Lazy imports: --dry-run must work without torch."""
    import torch
    from transformers import AutoProcessor, Qwen2_5_VLForConditionalGeneration

    dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32
    model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
        str(model_dir), torch_dtype=dtype, device_map="auto" if torch.cuda.is_available() else None
    )
    if not torch.cuda.is_available():
        print(
            "WARNING: no CUDA device — running a 7B VL model on CPU is "
            "minutes-per-prompt slow. This seat is meant to run in the "
            "Kaggle kernel (T4).",
            file=sys.stderr,
        )
    processor = AutoProcessor.from_pretrained(str(model_dir))
    return model, processor


def extend_one(model, processor, image_path: Path, action: str, canon: str,
               max_new_tokens: int, seed: int) -> str:
    import torch
    from PIL import Image

    messages = build_messages(image_path, action, canon)
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image = Image.open(image_path).convert("RGB")
    inputs = processor(text=[text], images=[image], return_tensors="pt", padding=True)
    device = next(model.parameters()).device
    inputs = inputs.to(device)
    generator = torch.Generator(device=device).manual_seed(seed)
    with torch.no_grad():
        out = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=False,  # greedy: same image+action => same prompt, reruns are comparable
            generator=generator,
        )
    trimmed = [o[len(i):] for i, o in zip(inputs.input_ids, out)]
    return processor.batch_decode(trimmed, skip_special_tokens=True)[0].strip()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--image", help="reference image (the video graph's start/reference frame)")
    ap.add_argument("--action", help="short free-text action, e.g. a freedom job segment's 'action'")
    ap.add_argument("--canon", default="", help="canon description line for the character (prompt_library.json 'canon')")
    ap.add_argument("--batch-jsonl", help="JSONL of {image, action, canon} — one extension per line")
    ap.add_argument("--out", help="output file (default: stdout); JSON in single mode, JSONL in batch mode")
    ap.add_argument("--model-dir", help="explicit path to the staged snapshot's weights dir")
    ap.add_argument("--max-new-tokens", type=int, default=320)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--verify-hashes", action="store_true", help="sha256 every shard against the cache manifest (slow)")
    ap.add_argument("--allow-download", action="store_true",
                    help="if no staged snapshot is found, download from Hugging Face (16.6 GB — NOT the Kaggle route)")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the chat payload and model resolution, load nothing")
    args = ap.parse_args(argv)

    jobs: list[dict] = []
    if args.batch_jsonl:
        for line in Path(args.batch_jsonl).read_text().splitlines():
            if line.strip():
                jobs.append(json.loads(line))
    elif args.image and args.action:
        jobs.append({"image": args.image, "action": args.action, "canon": args.canon})
    else:
        ap.error("give --image + --action, or --batch-jsonl")
        return 3

    for job in jobs:
        if not Path(job["image"]).is_file():
            print(f"input image not found: {job['image']}", file=sys.stderr)
            return 3

    model_dir = find_model_dir(args.model_dir)
    if args.dry_run:
        payload = {
            "dry_run": True,
            "model_dir_resolved": str(model_dir) if model_dir else None,
            "cache_kernel_slug": CACHE_KERNEL_SLUG,
            "jobs": [
                {
                    "image": j["image"],
                    "image_sha256": sha256_of(Path(j["image"])),
                    "messages_preview": build_messages(Path(j["image"]), j["action"], j.get("canon", "")),
                }
                for j in jobs
            ],
        }
        print(json.dumps(payload, indent=1))
        return 0

    if model_dir is None:
        if not args.allow_download:
            print(
                "Qwen2.5-VL snapshot not found. Attach the cache kernel "
                f"({CACHE_KERNEL_SLUG}) via kernel_sources, or pass "
                "--model-dir / set QWEN_VL_DIR. Refusing to download "
                "implicitly; pass --allow-download to fetch from "
                f"{HF_REPO_ID} instead.",
                file=sys.stderr,
            )
            return 2
        model_dir = Path(HF_REPO_ID)  # from_pretrained resolves the hub id

    snapshot = check_snapshot(model_dir, args.verify_hashes) if model_dir.is_dir() else {}
    if snapshot.get("mismatches"):
        print(f"snapshot check FAILED: {snapshot['mismatches']}", file=sys.stderr)
        return 2

    model, processor = load_model(model_dir)
    results = []
    for job in jobs:
        prompt = extend_one(
            model, processor, Path(job["image"]), job["action"],
            job.get("canon", ""), args.max_new_tokens, args.seed,
        )
        results.append(
            {
                "image": job["image"],
                "image_sha256": sha256_of(Path(job["image"])),
                "action": job["action"],
                "extended_prompt": prompt,
                "model_dir": str(model_dir),
                "snapshot_check": snapshot,
            }
        )

    out = open(args.out, "w") if args.out else sys.stdout
    try:
        if args.batch_jsonl:
            for r in results:
                out.write(json.dumps(r) + "\n")
        else:
            out.write(json.dumps(results[0], indent=1) + "\n")
    finally:
        if args.out:
            out.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
