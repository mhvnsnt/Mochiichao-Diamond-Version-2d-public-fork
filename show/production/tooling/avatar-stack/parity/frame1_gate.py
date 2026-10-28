#!/usr/bin/env python3
"""Automatic frame-1 gate for avatar-stack outputs.

A generated clip is not reportable without the packet this tool writes.
The packet grades the actual decoded pixels and labels the failure class:

  * ``pass`` — frame 1 and the sampled later frames pass the likeness gate.
  * ``reference-never-anchored`` — frame 1 itself fails. This is the
    2026-10-28 Dorowani proof class: the fed reference never took hold, so
    later motion cannot rescue the clip.
  * ``drift`` — frame 1 passes, but a sampled later frame fails.
  * ``fail-cannot-measure`` — a required input or frame could not be read.

The primary comparison is frame 1 against the FED reference image (the exact
prep frame the run consumed), using white-field foreground masks for both.
When --species/--cutouts are supplied, the repo likeness gate is also run
against the canon cutout at the same sampled frames and embedded in the
packet; the stricter of the two frame-1 verdicts wins.

Thresholds match the standing likeness gate: SSIM >= 0.50,
silhouette IoU >= 0.55, RGB MAD <= 40 (0-255 scale).

Exit codes: 0 = pass, 2 = fail packet written, 3 = cannot measure.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image

SSIM_MIN = 0.50
IOU_MIN = 0.55
RGB_MAD_MAX = 40.0
WHITE_DIST_FG = 16.0


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,avg_frame_rate,nb_frames,duration",
         "-of", "json", str(path)], capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(f"ffprobe failed: {out.stderr.strip()}")
    st = json.loads(out.stdout)["streams"][0]
    num, den = st["avg_frame_rate"].split("/")
    fps = float(num) / float(den) if float(den) else 0.0
    if st.get("nb_frames") and int(st["nb_frames"]) > 0:
        n = int(st["nb_frames"])
    elif st.get("duration") and fps:
        n = int(round(float(st["duration"]) * fps))
    else:
        raise RuntimeError("cannot determine frame count")
    return {"width": int(st["width"]), "height": int(st["height"]), "fps": fps, "frames": n}


def decode_frame(path: Path, index: int, scratch: Path) -> np.ndarray:
    png = scratch / f"frame_{index}.png"
    r = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(path),
         "-vf", f"select='eq(n\\,{index})'", "-frames:v", "1", str(png)],
        capture_output=True, text=True)
    if r.returncode != 0 or not png.exists():
        raise RuntimeError(f"frame {index} decode failed: {r.stderr.strip()}")
    return np.asarray(Image.open(png).convert("RGB"))


def locate_likeness_gate(explicit: str | None) -> Path | None:
    here = Path(__file__).resolve()
    candidates = []
    if explicit:
        candidates.append(Path(explicit))
    candidates += [here.parent / "likeness_gate.py", here.parent.parent / "likeness_gate.py",
                   Path.home() / "workspace/mochiichao-show/avatar-stack-wiring/show/production/tooling/avatar-stack/likeness_gate.py"]
    for c in candidates:
        if c.is_file():
            return c
    return None


def load_gate_module(path: Path):
    spec = importlib.util.spec_from_file_location("likeness_gate_for_frame1", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot import likeness gate module: {path}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def white_mask(rgb: np.ndarray) -> np.ndarray:
    img = rgb.astype(np.float32)
    dist = np.sqrt(((255.0 - img) ** 2).sum(axis=2) / 3.0)
    return dist >= WHITE_DIST_FG


def compare_images(mod, frame_rgb: np.ndarray, ref_rgb: np.ndarray) -> dict:
    """SSIM/IoU/MAD after the standing gate's bbox-fit alignment. Both
    images use white-field masks (the fed reference is a white-field prep
    frame, not an alpha cutout)."""
    f_rgb, f_msk, _ = mod.align_to_canvas(frame_rgb, white_mask(frame_rgb))
    r_rgb, r_msk, _ = mod.align_to_canvas(ref_rgb, white_mask(ref_rgb))
    union = f_msk | r_msk
    inter = f_msk & r_msk
    if int(union.sum()) == 0:
        raise RuntimeError("empty union silhouette")
    iou = float(inter.sum() / union.sum())
    smap = mod.ssim_map(f_rgb.mean(axis=2) / 255.0, r_rgb.mean(axis=2) / 255.0)
    ssim = float(smap[union].mean())
    mad = float(np.abs(f_rgb - r_rgb)[union].mean())
    measurements = {"ssim_union": round(ssim, 4), "silhouette_iou": round(iou, 4),
                    "rgb_mad_255": round(mad, 3)}
    checks = {"ssim": ssim >= SSIM_MIN, "silhouette_iou": iou >= IOU_MIN, "rgb_mad": mad <= RGB_MAD_MAX}
    return {"measurements": measurements, "checks": checks, "verdict": "PASS" if all(checks.values()) else "FAIL"}


def main() -> int:
    ap = argparse.ArgumentParser(description="Frame-1 gate with fail-class labels; writes the packet a clip must carry to be reportable.")
    ap.add_argument("--clip", required=True)
    ap.add_argument("--reference", required=True, help="the exact fed reference/prep image the run consumed")
    ap.add_argument("--reference-sha256", help="expected sha256 of --reference; mismatch is a measurement failure, not a pass")
    ap.add_argument("--species", help="also run the canon-cutout likeness gate for this species")
    ap.add_argument("--cutouts", help="directory holding <species>.png canon cutouts")
    ap.add_argument("--likeness-gate", help="path to likeness_gate.py (default: search beside this tool)")
    ap.add_argument("--scratch", help="directory for decoded frames (default: <clip dir>/frame1-gate-scratch)")
    ap.add_argument("--out", required=True, help="packet JSON path")
    args = ap.parse_args()

    clip = Path(args.clip)
    reference = Path(args.reference)
    out_path = Path(args.out)
    packet: dict = {
        "schema": "mochiichao-show/avatar-stack-frame1-gate/v1",
        "tool": "frame1_gate.py",
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "thresholds": {"ssim_min": SSIM_MIN, "silhouette_iou_min": IOU_MIN, "rgb_mad_255_max": RGB_MAD_MAX},
        "reportable_without_this_packet": False,
    }
    code = 2
    try:
        if not clip.is_file():
            raise RuntimeError(f"clip not found: {clip}")
        if not reference.is_file():
            raise RuntimeError(f"fed reference not found: {reference}")
        ref_hash = sha256_of(reference)
        if args.reference_sha256 and ref_hash.lower() != args.reference_sha256.lower().removeprefix("sha256:"):
            raise RuntimeError(f"fed reference hash mismatch: actual {ref_hash}, expected {args.reference_sha256}")
        gate_path = locate_likeness_gate(args.likeness_gate)
        if gate_path is None:
            raise RuntimeError("likeness_gate.py not found; pass --likeness-gate")
        mod = load_gate_module(gate_path)

        spec = probe(clip)
        scratch = Path(args.scratch) if args.scratch else clip.parent / "frame1-gate-scratch"
        scratch.mkdir(parents=True, exist_ok=True)
        n = spec["frames"]
        sampled = sorted({0, max(0, n // 2), n - 1})
        ref_rgb = np.asarray(Image.open(reference).convert("RGB"))

        packet.update({
            "clip": str(clip), "clip_sha256": sha256_of(clip), "clip_spec": spec,
            "reference": str(reference), "reference_sha256": ref_hash,
            "likeness_gate": str(gate_path), "sampled_frames": sampled,
        })

        fed_results = {}
        canon_results = {}
        for idx in sampled:
            frame = decode_frame(clip, idx, scratch)
            fed_results[str(idx)] = compare_images(mod, frame, ref_rgb)
            if args.species:
                kwargs = {}
                if args.cutouts:
                    kwargs["cutouts_dir"] = args.cutouts
                try:
                    m, _ctx = mod.measure(str(clip), args.species, frame_index=idx, **kwargs) \
                        if "cutouts_dir" in kwargs else mod.measure(str(clip), args.species, kwargs.get("cutouts_dir", mod.DEFAULT_CUTOUTS), idx)
                    checks = {"ssim": m["ssim_union"] >= SSIM_MIN,
                              "silhouette_iou": m["silhouette_iou"] >= IOU_MIN,
                              "rgb_mad": m["rgb_mad_255"] <= RGB_MAD_MAX}
                    canon_results[str(idx)] = {"measurements": m, "checks": checks,
                                               "verdict": "PASS" if all(checks.values()) else "FAIL"}
                except TypeError:
                    # Fall back to the module's documented positional signature.
                    m, _ctx = mod.measure(str(clip), args.species, mod.DEFAULT_CUTOUTS, idx)
                    checks = {"ssim": m["ssim_union"] >= SSIM_MIN,
                              "silhouette_iou": m["silhouette_iou"] >= IOU_MIN,
                              "rgb_mad": m["rgb_mad_255"] <= RGB_MAD_MAX}
                    canon_results[str(idx)] = {"measurements": m, "checks": checks,
                                               "verdict": "PASS" if all(checks.values()) else "FAIL"}
        packet["fed_reference_results"] = fed_results
        if canon_results:
            packet["canon_cutout_results"] = canon_results

        def combined(idx: int) -> str:
            verdicts = [fed_results[str(idx)]["verdict"]]
            if str(idx) in canon_results:
                verdicts.append(canon_results[str(idx)]["verdict"])
            return "PASS" if all(v == "PASS" for v in verdicts) else "FAIL"

        frame1 = combined(0)
        later_fail = any(combined(i) == "FAIL" for i in sampled if i != 0)
        if frame1 == "FAIL":
            packet["verdict"] = "FAIL"
            packet["fail_class"] = "reference-never-anchored"
            code = 2
        elif later_fail:
            packet["verdict"] = "FAIL"
            packet["fail_class"] = "drift"
            code = 2
        else:
            packet["verdict"] = "PASS"
            packet["fail_class"] = "pass"
            code = 0
    except Exception as e:
        packet["verdict"] = "FAIL"
        packet["fail_class"] = "fail-cannot-measure"
        packet["error"] = f"{type(e).__name__}: {e}"
        code = 3

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(packet, indent=2) + "\n", encoding="utf-8")
    print(f"packet: {out_path}")
    print(f"verdict: {packet['verdict']} fail_class: {packet['fail_class']}")
    if packet.get("error"):
        print(f"error: {packet['error']}")
    return code


if __name__ == "__main__":
    sys.exit(main())
