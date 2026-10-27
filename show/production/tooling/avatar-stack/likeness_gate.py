#!/usr/bin/env python3
"""Likeness gate for avatar-stack clips — REAL measurement, no self-certification.

Compares one decoded frame of a candidate clip against the species' canon
cutout (canon-cutouts/<species>.png) and emits a gate packet JSON with three
measured numbers:

  (a) ssim_union        windowed SSIM (Wang et al., Gaussian window) between
                        the aligned frame and cutout, averaged over the union
                        of the two aligned silhouettes.
  (b) silhouette_iou    intersection-over-union of the frame's non-white
                        foreground mask vs the cutout's alpha silhouette,
                        after bbox-fit alignment to a common canvas.
  (c) rgb_mad_255       masked mean absolute RGB difference (0-255 scale)
                        inside the union silhouette.

Alignment: each image's foreground bounding box is scaled to fit a fixed
box on a common canvas and pasted centred (scale + translation only — no
rotation, no warping; a pose that genuinely differs SHOULD score worse).

Calibration v2 (normalized path, reported ALONGSIDE v1): the first
calibration runs showed the hosted generator REFRAMES its source (a
full-body still becomes a zoomed upper-body performance), so v1's
canvas margins and its bilinear-resampled mask (thresholded at >127,
which erodes thin features on downscale and dilates on upscale) add
measurement artefacts on top of the real framing difference. The v2
path normalizes BOTH sides the same way: crop to the foreground bbox
(frame mask = the same white-distance logic as v1; cutout mask = its
alpha), resize ASPECT-PRESERVING so the crop fills a common square
canvas on its long axis (letterbox/pad — never warped to a fixed
non-square size, because aspect distortion corrupts IoU), resampling
the mask with NEAREST so silhouette edges stay hard. IoU, SSIM and MAD
are then computed with the exact v1 definitions on the normalized pair.

The packet reports both paths. The packet VERDICT remains the v1 path
checked against the shipped thresholds — v2 numbers are diagnostic
until an owner/scorer records a calibration decision (see
AVATAR-STACK-PIPELINE.md, "Calibration v2"). Nothing here retunes a
threshold.

Option A — pose-matched references (owner decision, 2026-10-27). The
v2 readings showed the dominant penalty is content, not placement:
the generator performs a reframed crop of the body, so a full-body
reference can never pixel-match it. With --reference-mode
pose-matched, the gate instead measures against
canon-cutouts/<species>-upper.png — the canon cutout cropped at the
measured performed-framing line (0.91 of the silhouette height; see
the spec, "Option A — pose-matched references"). The packet records
reference_mode and the exact reference_file used. In pose-matched
mode the packet additionally carries pose_matched_verdict: the
v2-normalized path checked against the SAME shipped thresholds, as a
recommendation only. If the -upper reference is missing the run is
FAIL_CANNOT_MEASURE — never a silent fallback to the full cutout.

--debug-dir DIR writes debug_alignment.png into DIR (never into the
repo tree): the v2-normalized aligned reference | aligned prediction
| contour overlay (reference silhouette contour green, prediction
contour red, over the prediction), with the v2 IoU/SSIM/MAD burned
into a header band — so a human can see exactly what the gate scored.

The verdict in the packet is a RECOMMENDATION only. Per the orchestrator
law (show/production/pipeline/ORCHESTRATOR.md), a gate packet never
promotes anything itself: promotion_status is always
PENDING_OWNER_OR_SCORER_RECORD, and promotion happens only when the
verdict is recorded in show/shared/clip-index.json by the gate step.

If a measurement cannot be computed (missing cutout, undecodable clip),
the packet says so and the verdict is FAIL_CANNOT_MEASURE — never a
default pass.

Usage:
  likeness_gate.py --clip CLIP.mp4 --species dorowani [--out PACKET.json]
                   [--cutouts DIR] [--frame N]
                   [--reference-mode {full,pose-matched}]
                   [--debug-dir DIR]
Exit codes: 0 = measured verdict written (PASS or FAIL),
            2 = FAIL_CANNOT_MEASURE packet written.
"""
import argparse, hashlib, json, subprocess, sys, tempfile
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

# ---------------------------------------------------------------------------
# THRESHOLDS (packet-recommendation config — stated, not hidden)
# A clip is recommended PASS only if ALL three hold.
# ---------------------------------------------------------------------------
SSIM_MIN = 0.50        # structural similarity over the union silhouette
IOU_MIN = 0.55         # silhouette intersection-over-union after alignment
RGB_MAD_MAX = 40.0     # masked mean abs RGB diff, 0-255 scale

CANVAS = 512           # common alignment canvas (px)
FIT = 448              # foreground bbox is scaled to fit this box (px)
WHITE_DIST_FG = 16.0   # distance-from-white at/above which a pixel counts
                       # as foreground (same midpoint as white_matte.py's
                       # alpha ramp: alpha = clip((d-6)/20) -> 0.5 at d=16)

DEFAULT_CUTOUTS = Path.home() / "workspace/mochiichao-show/canon-cutouts"


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def probe_frames(path):
    """Return (width, height, fps, n_frames) via ffprobe, or raise."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,avg_frame_rate,nb_frames,duration",
         "-of", "json", str(path)],
        capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(f"ffprobe failed on {path}: {out.stderr.strip()}")
    st = json.loads(out.stdout)["streams"][0]
    num, den = st["avg_frame_rate"].split("/")
    fps = float(num) / float(den) if float(den) else 0.0
    if st.get("nb_frames") and int(st["nb_frames"]) > 0:
        n = int(st["nb_frames"])
    elif st.get("duration") and fps:
        n = int(round(float(st["duration"]) * fps))
    else:
        raise RuntimeError(f"cannot determine frame count for {path}")
    return int(st["width"]), int(st["height"]), fps, n


def decode_frame(path, index):
    """Decode frame `index` of a clip to an HxWx3 uint8 numpy array."""
    with tempfile.TemporaryDirectory() as td:
        png = str(Path(td) / "frame.png")
        r = subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(path),
             "-vf", f"select='eq(n\\,{index})'", "-frames:v", "1", png],
            capture_output=True, text=True)
        if r.returncode != 0 or not Path(png).exists():
            raise RuntimeError(f"ffmpeg frame decode failed: {r.stderr.strip()}")
        return np.asarray(Image.open(png).convert("RGB"))


def white_distance(img):
    img = img.astype(np.float32)
    return np.sqrt(((255.0 - img) ** 2).sum(axis=2) / 3.0)


def align_to_canvas(rgb, mask):
    """Scale+translate so the mask bbox fits FIT inside a CANVAS canvas,
    centred. Returns (canvas_rgb float32 HxWx3 over white, canvas_mask bool,
    scale). Raises if the mask is empty."""
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise RuntimeError("empty foreground mask")
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    scale = FIT / max(bw, bh)
    nw, nh = max(1, round(bw * scale)), max(1, round(bh * scale))
    rgb_crop = Image.fromarray(rgb[y0:y1 + 1, x0:x1 + 1].astype(np.uint8))
    msk_crop = Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype(np.uint8))
    rgb_r = rgb_crop.resize((nw, nh), Image.BILINEAR)
    msk_r = msk_crop.resize((nw, nh), Image.BILINEAR)
    canvas_rgb = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    canvas_msk = np.zeros((CANVAS, CANVAS), dtype=np.uint8)
    ox, oy = (CANVAS - nw) // 2, (CANVAS - nh) // 2
    canvas_rgb[oy:oy + nh, ox:ox + nw] = np.asarray(rgb_r)
    canvas_msk[oy:oy + nh, ox:ox + nw] = np.asarray(msk_r)
    return canvas_rgb.astype(np.float32), canvas_msk > 127, scale


def normalize_to_square(rgb, mask):
    """Calibration-v2 normalization: bbox-crop, then aspect-preserving
    resize so the crop fills a CANVAS x CANVAS square on its long axis,
    padded (letterboxed) centred — white for RGB, False for the mask.
    The mask is resampled NEAREST so the silhouette stays hard-edged
    (v1's bilinear mask + >127 threshold erodes/dilates edges).
    Returns (canvas_rgb float32 over white, canvas_mask bool, scale).
    Raises if the mask is empty."""
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise RuntimeError("empty foreground mask")
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    scale = CANVAS / max(bw, bh)
    nw, nh = max(1, round(bw * scale)), max(1, round(bh * scale))
    rgb_crop = Image.fromarray(rgb[y0:y1 + 1, x0:x1 + 1].astype(np.uint8))
    msk_crop = Image.fromarray((mask[y0:y1 + 1, x0:x1 + 1] * 255).astype(np.uint8))
    rgb_r = rgb_crop.resize((nw, nh), Image.BILINEAR)
    msk_r = msk_crop.resize((nw, nh), Image.NEAREST)
    canvas_rgb = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    canvas_msk = np.zeros((CANVAS, CANVAS), dtype=np.uint8)
    ox, oy = (CANVAS - nw) // 2, (CANVAS - nh) // 2
    canvas_rgb[oy:oy + nh, ox:ox + nw] = np.asarray(rgb_r)
    canvas_msk[oy:oy + nh, ox:ox + nw] = np.asarray(msk_r)
    return canvas_rgb.astype(np.float32), canvas_msk > 127, scale


def score_pair(f_rgb, f_msk, c_rgb, c_msk):
    """The three gate metrics, with the exact v1 definitions, computed
    on an already-aligned pair of canvases."""
    union = f_msk | c_msk
    inter = f_msk & c_msk
    iou = float(inter.sum() / union.sum())

    f_gray = f_rgb.mean(axis=2) / 255.0
    c_gray = c_rgb.mean(axis=2) / 255.0
    smap = ssim_map(f_gray, c_gray)
    ssim_union = float(smap[union].mean())

    mad = float(np.abs(f_rgb - c_rgb)[union].mean())

    return {
        "ssim_union": round(ssim_union, 4),
        "silhouette_iou": round(iou, 4),
        "rgb_mad_255": round(mad, 3),
        "rgb_mad_norm": round(mad / 255.0, 4),
    }, int(union.sum())


def ssim_map(x, y):
    """Windowed SSIM map for two float32 grayscale images in [0,1]."""
    C1, C2 = 0.01 ** 2, 0.03 ** 2
    mu_x = ndimage.gaussian_filter(x, 1.5)
    mu_y = ndimage.gaussian_filter(y, 1.5)
    s_x = ndimage.gaussian_filter(x * x, 1.5) - mu_x ** 2
    s_y = ndimage.gaussian_filter(y * y, 1.5) - mu_y ** 2
    s_xy = ndimage.gaussian_filter(x * y, 1.5) - mu_x * mu_y
    num = (2 * mu_x * mu_y + C1) * (2 * s_xy + C2)
    den = (mu_x ** 2 + mu_y ** 2 + C1) * (s_x + s_y + C2)
    return num / den


def measure(clip, species, cutouts_dir, frame_index=None,
            reference_mode="full", want_debug=False):
    """Returns (measurements, measurements_v2, context, debug).
    `debug` is None unless want_debug, else a dict of the v2-normalized
    aligned canvases for write_debug_alignment(). Raises on any failure
    (missing reference included — FAIL_CANNOT_MEASURE, no fallback)."""
    if reference_mode == "pose-matched":
        cutout_path = Path(cutouts_dir) / f"{species}-upper.png"
    else:
        cutout_path = Path(cutouts_dir) / f"{species}.png"
    if not cutout_path.exists():
        raise RuntimeError(
            f"reference not found ({reference_mode} mode): {cutout_path}")
    if not Path(clip).exists():
        raise RuntimeError(f"clip not found: {clip}")

    w, h, fps, n_frames = probe_frames(clip)
    idx = frame_index if frame_index is not None else n_frames // 2
    if not (0 <= idx < n_frames):
        raise RuntimeError(f"frame index {idx} out of range (0..{n_frames - 1})")
    frame = decode_frame(clip, idx)
    frame_mask = white_distance(frame) >= WHITE_DIST_FG

    cut = Image.open(cutout_path).convert("RGBA")
    cut_np = np.asarray(cut).astype(np.float32)
    alpha = cut_np[..., 3] / 255.0
    cut_rgb = cut_np[..., :3] * alpha[..., None] + 255.0 * (1 - alpha[..., None])
    cut_mask = alpha > 0.5

    # --- v1 path (unchanged): bbox fit-box alignment, metrics on canvas ---
    f_rgb, f_msk, f_scale = align_to_canvas(frame, frame_mask)
    c_rgb, c_msk, c_scale = align_to_canvas(cut_rgb.astype(np.uint8), cut_mask)
    measurements, union_px = score_pair(f_rgb, f_msk, c_rgb, c_msk)

    # --- v2 path (calibration): bbox crop + aspect-preserving letterbox ---
    f2_rgb, f2_msk, f2_scale = normalize_to_square(frame, frame_mask)
    c2_rgb, c2_msk, c2_scale = normalize_to_square(cut_rgb.astype(np.uint8),
                                                   cut_mask)
    measurements_v2, union_px_v2 = score_pair(f2_rgb, f2_msk, c2_rgb, c2_msk)

    context = {
        "clip": str(clip),
        "clip_sha256": sha256_of(clip),
        "clip_spec": {"width": w, "height": h, "fps": fps, "frames": n_frames},
        "frame_index": idx,
        "reference_mode": reference_mode,
        "reference_file": str(cutout_path),
        "cutout": str(cutout_path),
        "cutout_sha256": sha256_of(cutout_path),
        "alignment": {"canvas": CANVAS, "fit_box": FIT,
                      "frame_scale": round(f_scale, 4),
                      "cutout_scale": round(c_scale, 4),
                      "method": "foreground-bbox fit, centred; scale+translation only"},
        "union_pixels": union_px,
        "alignment_v2_normalized": {
            "canvas": CANVAS,
            "frame_scale": round(f2_scale, 4),
            "cutout_scale": round(c2_scale, 4),
            "method": ("foreground-bbox crop, aspect-preserving resize to "
                       "fill the square canvas on the long axis, centred "
                       "letterbox pad; mask resampled NEAREST (hard "
                       "silhouette); metric definitions identical to v1"),
        },
        "union_pixels_v2_normalized": union_px_v2,
    }
    debug = None
    if want_debug:
        debug = {"frame_rgb": f2_rgb, "frame_mask": f2_msk,
                 "ref_rgb": c2_rgb, "ref_mask": c2_msk}
    return measurements, measurements_v2, context, debug


def _contour(mask):
    """Silhouette boundary pixels: mask minus its 3x3 erosion, dilated
    once so the drawn contour stays visible at canvas scale."""
    eroded = ndimage.binary_erosion(mask, structure=np.ones((3, 3)))
    edge = mask & ~eroded
    return ndimage.binary_dilation(edge, structure=np.ones((3, 3)))


def write_debug_alignment(debug, measurements_v2, out_dir, reference_mode):
    """Write debug_alignment.png into out_dir: three CANVAS-square
    panels — aligned reference | aligned prediction | contour overlay
    (reference contour green, prediction contour red, drawn over the
    prediction) — under a header band with the v2 metrics burned in.
    Returns the written path."""
    f_rgb = debug["frame_rgb"].astype(np.uint8)
    f_msk = debug["frame_mask"]
    c_rgb = debug["ref_rgb"].astype(np.uint8)
    c_msk = debug["ref_mask"]

    overlay = f_rgb.copy()
    overlay[_contour(f_msk)] = (255, 0, 0)      # prediction contour: red
    overlay[_contour(c_msk)] = (0, 200, 0)      # reference contour: green

    header_h = 40
    img = Image.new("RGB", (CANVAS * 3, CANVAS + header_h), (255, 255, 255))
    img.paste(Image.fromarray(c_rgb), (0, header_h))
    img.paste(Image.fromarray(f_rgb), (CANVAS, header_h))
    img.paste(Image.fromarray(overlay), (CANVAS * 2, header_h))
    from PIL import ImageDraw
    d = ImageDraw.Draw(img)
    m = measurements_v2
    d.text((8, 4),
           f"likeness_gate debug alignment - reference mode: {reference_mode} "
           f"(panels: aligned reference | aligned prediction | contour overlay)",
           fill=(0, 0, 0))
    d.text((8, 22),
           f"v2-normalized: IoU {m['silhouette_iou']} (min {IOU_MIN})   "
           f"SSIM {m['ssim_union']} (min {SSIM_MIN})   "
           f"RGB MAD {m['rgb_mad_255']} (max {RGB_MAD_MAX})   "
           f"contours: reference=green, prediction=red",
           fill=(0, 0, 0))
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    path = out / "debug_alignment.png"
    img.save(path)
    return path


def main():
    ap = argparse.ArgumentParser(description="Likeness gate — measured packet, never self-promoting.")
    ap.add_argument("--clip", required=True)
    ap.add_argument("--species", required=True)
    ap.add_argument("--cutouts", default=str(DEFAULT_CUTOUTS),
                    help="directory holding <species>.png canon cutouts")
    ap.add_argument("--frame", type=int, default=None,
                    help="frame index to score (default: middle frame)")
    ap.add_argument("--reference-mode", choices=["full", "pose-matched"],
                    default="full",
                    help="full: <species>.png canon cutout (default); "
                         "pose-matched: <species>-upper.png, the canon "
                         "cutout cropped at the measured performed-"
                         "framing line (Option A). Missing -upper file "
                         "is FAIL_CANNOT_MEASURE, never a fallback.")
    ap.add_argument("--debug-dir", default=None,
                    help="also write debug_alignment.png into this dir "
                         "(aligned reference | prediction | contours)")
    ap.add_argument("--out", default=None, help="packet JSON path")
    args = ap.parse_args()

    thresholds = {"ssim_min": SSIM_MIN, "silhouette_iou_min": IOU_MIN,
                  "rgb_mad_255_max": RGB_MAD_MAX}
    packet = {
        "schema": "mochiichao-show/likeness-gate-packet/v2",
        "tool": "likeness_gate.py",
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "species": args.species,
        "reference_mode": args.reference_mode,
        "thresholds": thresholds,
        "promotion_status": "PENDING_OWNER_OR_SCORER_RECORD",
        "note": ("Verdict is a packet RECOMMENDATION measured from the actual "
                 "pixels. Promotion is a separate step: recording in "
                 "show/shared/clip-index.json (orchestrator law). The verdict "
                 "is the v1 measurement path against the shipped thresholds; "
                 "measurements_v2_normalized is the calibration-v2 diagnostic "
                 "path, reported alongside and NOT (yet) the verdict — "
                 "adopting it is an owner/scorer calibration decision."),
    }
    try:
        measurements, measurements_v2, context, debug = measure(
            args.clip, args.species, args.cutouts, args.frame,
            reference_mode=args.reference_mode,
            want_debug=args.debug_dir is not None)
        packet.update(context)
        packet["measurements"] = measurements
        packet["measurements_v2_normalized"] = measurements_v2
        checks = {
            "ssim": measurements["ssim_union"] >= SSIM_MIN,
            "silhouette_iou": measurements["silhouette_iou"] >= IOU_MIN,
            "rgb_mad": measurements["rgb_mad_255"] <= RGB_MAD_MAX,
        }
        packet["checks"] = checks
        checks_v2 = {
            "ssim": measurements_v2["ssim_union"] >= SSIM_MIN,
            "silhouette_iou": measurements_v2["silhouette_iou"] >= IOU_MIN,
            "rgb_mad": measurements_v2["rgb_mad_255"] <= RGB_MAD_MAX,
        }
        packet["checks_v2_normalized"] = checks_v2
        packet["verdict"] = "PASS" if all(checks.values()) else "FAIL"
        if args.reference_mode == "pose-matched":
            # Option A recommendation: the v2-normalized path against
            # the pose-matched reference, SAME shipped thresholds.
            # Recommendation only — promotion_status is unchanged.
            packet["pose_matched_checks"] = checks_v2
            packet["pose_matched_verdict"] = (
                "PASS" if all(checks_v2.values()) else "FAIL")
        if debug is not None:
            try:
                dbg_path = write_debug_alignment(
                    debug, measurements_v2, args.debug_dir,
                    args.reference_mode)
                packet["debug_alignment"] = str(dbg_path)
            except Exception as de:
                packet["debug_alignment"] = None
                packet["debug_error"] = f"{type(de).__name__}: {de}"
        code = 0
    except Exception as e:  # measurement impossible — say so, never pass
        packet["measurements"] = None
        packet["measurements_v2_normalized"] = None
        packet["checks"] = None
        packet["checks_v2_normalized"] = None
        if args.reference_mode == "pose-matched":
            packet["pose_matched_checks"] = None
            packet["pose_matched_verdict"] = None
        packet["verdict"] = "FAIL_CANNOT_MEASURE"
        packet["error"] = f"{type(e).__name__}: {e}"
        code = 2

    out_path = Path(args.out) if args.out else Path(f"likeness-gate-{args.species}.json")
    out_path.write_text(json.dumps(packet, indent=2) + "\n")
    print(f"packet: {out_path}")
    print(f"verdict (v1 path): {packet['verdict']}")
    if packet.get("measurements"):
        m = packet["measurements"]
        print(f"  [v1] ssim_union     = {m['ssim_union']}  (min {SSIM_MIN})")
        print(f"  [v1] silhouette_iou = {m['silhouette_iou']}  (min {IOU_MIN})")
        print(f"  [v1] rgb_mad_255    = {m['rgb_mad_255']}  (max {RGB_MAD_MAX})")
    if packet.get("measurements_v2_normalized"):
        m = packet["measurements_v2_normalized"]
        print(f"  [v2] ssim_union     = {m['ssim_union']}  (min {SSIM_MIN})")
        print(f"  [v2] silhouette_iou = {m['silhouette_iou']}  (min {IOU_MIN})")
        print(f"  [v2] rgb_mad_255    = {m['rgb_mad_255']}  (max {RGB_MAD_MAX})")
    if packet.get("pose_matched_verdict"):
        print(f"  pose-matched verdict (v2 path, shipped thresholds): "
              f"{packet['pose_matched_verdict']}")
    if packet.get("debug_alignment"):
        print(f"  debug alignment: {packet['debug_alignment']}")
    if packet.get("error"):
        print(f"  error: {packet['error']}")
    return code


if __name__ == "__main__":
    sys.exit(main())
