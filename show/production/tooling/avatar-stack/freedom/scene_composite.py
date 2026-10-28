#!/usr/bin/env python3
"""scene_composite.py - composite N character layers over a background.

The multi-character half of the freedom wiring (see job_format_v2.md):
one scene job carries several characters, each with its own chained
clip, and this tool lays them over a living background plate.

  * Inputs: a background MP4 plus any number of transparent character
    clips (VP9 WebM with alpha, as produced by white_matte.py - the
    repo's transparent twins - or any RGBA video ffmpeg can read).
  * Each layer has: x / y position, scale, z-order, start offset.
    Position is given as fractions of the background frame: `x` is the
    layer's horizontal CENTRE, `y` is the layer's GROUND LINE (where
    its feet / base sit), both 0..1. `scale` is the layer's height as
    a fraction of the background height.
  * CONTACT SHADOWS ARE DRAWN HERE, AT COMPOSITE TIME ONLY: a soft
    blurred black ellipse is generated per layer (Pillow), sized to
    the layer's on-screen width, and laid on the ground line under the
    character for exactly the layer's on-screen window. Character art
    itself NEVER carries a baked shadow (standing no-baked-shadows
    rule); remove this stage and the characters are shadow-free again.
  * Layers are applied back-to-front in z-order; a layer is visible
    only from its start offset until its clip ends.

Usage (CLI):
  scene_composite.py BG.mp4 OUT.mp4 \
    --layer CLIP.webm --x 0.30 --y 0.92 --scale 0.55 --z 1 --start 0.0 \
    --layer CLIP2.webm --x 0.68 --y 0.95 --scale 0.70 --z 2 --start 1.5

Usage (job file):  scene_composite.py --job scene_job.json --out OUT.mp4
  where the JSON follows job_format_v2.md (`background`, `characters[]`
  each with `chained_clip` + `layer`).

Requires: ffmpeg (with libvpx-vp9 for the alpha WebM twins), ffprobe,
Pillow, numpy - the same stack as composite.py in the animation backend.
"""
import argparse, json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,avg_frame_rate",
         "-show_entries", "format=duration", "-of", "json", path],
        capture_output=True, text=True)
    if out.returncode:
        sys.exit(f"ffprobe failed on {path}: {out.stderr.strip()}")
    d = json.loads(out.stdout)
    st = d["streams"][0]
    num, den = st["avg_frame_rate"].split("/")
    fps = float(num) / float(den) if float(den) else 0.0
    return st["width"], st["height"], fps, float(d["format"]["duration"])


def make_shadow_png(path, width_px):
    """One soft elliptical contact shadow, drawn fresh at composite time."""
    w = max(16, int(width_px * 1.05))
    h = max(8, int(w * 0.16))
    img = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([w * 0.15, h * 0.15, w * 1.85, h * 1.85], fill=(0, 0, 0, 110))
    img = img.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(w / 18.0))
    img.save(path)
    return w, h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("background", nargs="?")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--job", default=None, help="scene job JSON (job_format_v2.md)")
    ap.add_argument("--out-file", default=None)
    ap.add_argument("--layer", action="append", default=[], help="character clip path")
    ap.add_argument("--x", action="append", type=float, default=[])
    ap.add_argument("--y", action="append", type=float, default=[])
    ap.add_argument("--scale", action="append", type=float, default=[])
    ap.add_argument("--z", action="append", type=int, default=[])
    ap.add_argument("--start", action="append", type=float, default=[])
    ap.add_argument("--workdir", default=None)
    a = ap.parse_args()

    layers = []
    if a.job:
        job = json.load(open(a.job))
        background = job["background"]["clip"]
        for ch in job["characters"]:
            lay = ch["layer"]
            layers.append({"clip": ch["chained_clip"], "x": lay["x"],
                           "y": lay["y"], "scale": lay["scale"],
                           "z": lay["z_order"], "start": lay["start_offset_s"]})
        out = a.out_file or a.out
    else:
        background, out = a.background, (a.out_file or a.out)
        n = len(a.layer)
        if not n:
            sys.exit("no layers given")
        def pick(lst, default):
            return [lst[i] if i < len(lst) else default for i in range(n)]
        xs, ys = pick(a.x, 0.5), pick(a.y, 0.95)
        ss, zs, ts = pick(a.scale, 0.6), pick(a.z, 0), pick(a.start, 0.0)
        layers = [{"clip": c, "x": xs[i], "y": ys[i], "scale": ss[i],
                   "z": zs[i], "start": ts[i]} for i, c in enumerate(a.layer)]
    if not background or not out:
        sys.exit("background and output are required")
    workdir = a.workdir or os.path.join(os.path.dirname(os.path.abspath(out)), "scene-work")
    os.makedirs(workdir, exist_ok=True)

    bw, bh, bfps, bdur = probe(background)
    fps_out = int(round(bfps)) or 24
    layers.sort(key=lambda L: L["z"])  # back to front

    # ffmpeg inputs: 0 = background; per layer: shadow loop, then clip.
    inputs = ["-i", background]
    filters = ["[0:v]format=rgba[base]"]
    cur = "base"
    plan = []
    for k, L in enumerate(layers):
        cw, chh, _cf, cdur = probe(L["clip"])
        th = int(bh * L["scale"])
        tw = int(cw * th / chh)
        cx = int(bw * L["x"] - tw / 2)          # x = centre
        top = int(bh * L["y"] - th)             # y = ground line
        sw, sh = make_shadow_png(os.path.join(workdir, f"shadow-{k}.png"), tw)
        sx, sy = int(bw * L["x"] - sw / 2), int(bh * L["y"] - sh / 2)
        end = L["start"] + cdur
        inputs += ["-loop", "1", "-framerate", str(fps_out), "-i",
                   os.path.join(workdir, f"shadow-{k}.png")]
        si = 1 + 2 * k
        inputs += ["-itsoffset", str(L["start"])]
        if L["clip"].lower().endswith(".webm"):
            inputs += ["-c:v", "libvpx-vp9"]
        inputs += ["-i", L["clip"]]
        ci = si + 1
        en = f"enable='between(t,{L['start']},{end})'"
        filters.append(f"[{cur}][{si}:v]overlay={sx}:{sy}:{en}[s{k}]")
        filters.append(f"[{ci}:v]scale={tw}:{th},format=rgba[fg{k}]")
        filters.append(f"[s{k}][fg{k}]overlay={cx}:{top}:{en}[v{k}]")
        cur = f"v{k}"
        plan.append({**L, "on_screen_px": [tw, th], "at_px": [cx, top],
                     "shadow_px": [sw, sh], "visible_s": [L["start"], round(end, 3)]})
    filters.append(f"[{cur}]format=yuv420p[out]")
    cmd = (["ffmpeg", "-y", "-v", "error"] + inputs +
           ["-filter_complex", ";".join(filters), "-map", "[out]",
            "-r", str(fps_out), "-t", str(bdur), "-c:v", "libx264",
            "-pix_fmt", "yuv420p", "-crf", "18", out])
    r = subprocess.run(cmd)
    if r.returncode:
        sys.exit("ffmpeg scene composite failed")

    # Defect guard (same family as composite.py): corners must stay plate.
    import numpy as np
    mid = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(bdur / 2), "-i", out,
         "-vframes", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True).stdout
    frame = np.frombuffer(mid, np.uint8).reshape(bh, bw, 3).astype(float)
    corners = np.concatenate([frame[:40, :40].reshape(-1, 3), frame[:40, -40:].reshape(-1, 3),
                              frame[-40:, :40].reshape(-1, 3), frame[-40:, -40:].reshape(-1, 3)])
    ow, oh, ofps, odur = probe(out)
    summary = {"output": out, "size": [ow, oh], "fps": ofps,
               "duration_s": round(odur, 3), "background": background,
               "layers_back_to_front": plan,
               "corner_mean_rgb_plate_check": [round(float(v), 1) for v in corners.mean(axis=0)]}
    print(json.dumps(summary, indent=1))
    if corners.mean() < 12:
        sys.exit("DEFECT GUARD: corners near-black - alpha flattened; composite rejected")
    print("scene composite OK - shadows were drawn at composite time only; "
          "character art untouched")


if __name__ == "__main__":
    main()
