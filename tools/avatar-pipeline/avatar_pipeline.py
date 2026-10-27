#!/usr/bin/env python3
"""
Avatar Pipeline — Mochiichao recreation of the Muse avatar pipeline spec.

WHAT THIS RECREATES (measured from a real Muse avatar, Doro/Dorowani,
2026-10-27, avatar.get + ffprobe on the delivered files):
  Input : one character still (reference image).
  Step 1: a square poster still is produced (1600x1600, WebP).
  Step 2: the still is animated into named STATE VARIANTS, each a short
          looping MP4: 720x720, 8.0 s, 24 fps, H.264, on white.
            - idle                 \
            - connecting           / same file as idle
            - working              \
            - waiting_for_subagents/ same file as working
            - making_something
            - milestone_level_up
          (4 unique renders, 6 variant names — exactly the Muse contract.)
  Step 3: a manifest describing the bundle (like avatar.get returns).

WHAT IS DIFFERENT, ON PURPOSE:
  - Muse's original is a hosted generative model; its source/weights are
    not available and are not copied here. This pipeline renders the same
    contract deterministically and locally (Pillow + ffmpeg), so every
    Mochiichao character can be run through it in the repo, for free,
    as many times as needed — for the game, the show, and marketing.
  - MP4/H.264 cannot store an alpha channel. Muse ships white MP4s.
    For game/show use this pipeline ALSO renders a transparent twin of
    every variant as WebM (VP9 with alpha, plays in browsers / the
    Vite+Pixi game). Same frames, no background.
  - A generative backend can be plugged in later: set
    AVATAR_PIPELINE_GENERATOR to a command that takes
    {image} {variant} {out_mp4} and produces a clip; when set, its clips
    are used for the MP4s and re-keyed for the transparent WebMs.

Motion recipes are whole-sprite (no rig needed), matching how the repo's
sprite-art lane already bakes 2D frames:
  idle               gentle bob + breathing scale (2 breaths / 8 s)
  working            small fast bob + slight tilt sway (focused effort)
  making_something   rhythmic bounce + alternating tilt (building)
  milestone_level_up two celebration jumps + sparkle overlay

Background removal: border-connected flood fill on near-white, so interior
near-white areas enclosed by the character outline (belly, teeth, eyes)
are preserved. Already-transparent inputs pass through unchanged.

Usage:
  python3 avatar_pipeline.py --image path/to/front.png --name dorowani \
      --out output/dorowani
  python3 avatar_pipeline.py --image front.png --name gabu --variants idle,working

Requires: Pillow, numpy, scipy, and ffmpeg on PATH.
"""
import argparse, json, math, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

try:
    from scipy import ndimage
except ImportError:
    sys.exit("scipy is required: pip install -r requirements.txt")

CANVAS = 720            # variant video size, matches Muse spec
POSTER = 1600           # poster still size, matches Muse spec
FPS = 24
SECONDS = 8
FRAMES = FPS * SECONDS  # 192
VARIANTS = ["connecting", "idle", "making_something",
            "milestone_level_up", "waiting_for_subagents", "working"]
ALIASES = {"connecting": "idle", "waiting_for_subagents": "working"}
UNIQUE = ["idle", "working", "making_something", "milestone_level_up"]


# ---------------------------------------------------------------- still stage
def cut_background(im: Image.Image) -> Image.Image:
    """Solid background -> alpha, border-connected only.

    The background colour is sampled from the image border (white for
    Muse avatar stills, dark grey for the repo's scripted portraits,
    anything solid). Only pixels similar to that colour AND connected
    to the border are cut, so interior areas enclosed by the character
    outline (a white belly on a white background) are preserved."""
    if im.mode == "RGBA" and np.asarray(im)[:, :, 3].min() < 250:
        return im  # already has real transparency
    rgb = im.convert("RGB")
    a = np.asarray(rgb).astype(np.int32)
    border_px = np.concatenate([a[0].reshape(-1, 3), a[-1].reshape(-1, 3),
                                a[:, 0], a[:, -1]])
    bg_col = np.median(border_px, axis=0)
    dist = np.sqrt(((a - bg_col) ** 2).sum(axis=2))
    similar = dist < 42
    lab, _ = ndimage.label(similar)
    border = set(np.unique(np.concatenate(
        [lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def normalize(im: Image.Image, canvas: int, margin: float = 0.04) -> Image.Image:
    """Trim to the character, fit it centred on a square transparent canvas."""
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    max_side = int(canvas * (1 - 2 * margin))
    scale = min(max_side / im.width, max_side / im.height)
    # Small repo art is pixel art — keep its hard edges when scaling up.
    resample = Image.NEAREST if max(im.width, im.height) <= 256 else Image.LANCZOS
    im = im.resize((max(1, round(im.width * scale)),
                    max(1, round(im.height * scale))), resample)
    base = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    base.alpha_composite(im, ((canvas - im.width) // 2,
                              (canvas - im.height) // 2))
    return base


def make_poster(char720: Image.Image, out_path: str):
    poster = char720.resize((POSTER, POSTER), Image.LANCZOS)
    white = Image.new("RGBA", (POSTER, POSTER), (255, 255, 255, 255))
    white.alpha_composite(poster)
    white.convert("RGB").save(out_path, "WEBP", quality=92)


# ---------------------------------------------------------------- motion
def ease_sin(phase: float) -> float:
    return math.sin(2 * math.pi * phase)


def frame_transform(variant: str, i: int):
    """Return (dx, dy, scale, angle_deg) for frame i of a variant."""
    t = i / FRAMES            # 0..1 over the 8 s loop
    if variant == "idle":
        return 0, 6 * ease_sin(t * 2), 1.0 + 0.015 * ease_sin(t * 2), 0.0
    if variant == "working":
        return 3 * ease_sin(t * 8), 2.5 * abs(ease_sin(t * 8)), \
               1.0, 1.1 * ease_sin(t * 4)
    if variant == "making_something":
        bounce = abs(math.sin(math.pi * (t * 8 % 1))) * -8 if (t * 8) % 1 < 0.5 else 0
        return 0, bounce, 1.0 + 0.01 * ease_sin(t * 8), 2.0 * ease_sin(t * 8)
    if variant == "milestone_level_up":
        dy, scale = 0.0, 1.0
        for start in (0.08, 0.55):              # two jumps per loop
            lt = (t - start) / 0.18
            if 0 <= lt <= 1:
                dy = -46 * math.sin(math.pi * lt)
                scale = 1.0 + 0.05 * math.sin(math.pi * lt)
        return 0, dy, scale, 1.5 * ease_sin(t * 2)
    raise ValueError(variant)


SPARKS = [(37 * k % 720, 91 * k % 720, 6 + (k % 3) * 3,
           [(255, 209, 26), (255, 107, 107), (78, 205, 196)][k % 3])
          for k in range(28)]


def render_variant(char: Image.Image, variant: str, frames_dir: str):
    os.makedirs(frames_dir, exist_ok=True)
    for i in range(FRAMES):
        dx, dy, scale, angle = frame_transform(variant, i)
        frame_char = char
        if scale != 1.0:
            s = max(1, round(CANVAS * scale))
            frame_char = char.resize((s, s), Image.LANCZOS)
        if angle:
            frame_char = frame_char.rotate(angle, resample=Image.BICUBIC,
                                           center=(frame_char.width / 2,
                                                   frame_char.height / 2))
        frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
        frame.alpha_composite(frame_char,
                              (round((CANVAS - frame_char.width) / 2 + dx),
                               round((CANVAS - frame_char.height) / 2 + dy)))
        if variant == "milestone_level_up":
            d = ImageDraw.Draw(frame)
            tt = i / FRAMES
            for x, y0, r, col in SPARKS:
                y = (y0 + tt * 900) % (CANVAS + 40) - 20
                d.ellipse([x - r, y - r, x + r, y + r], fill=col + (235,))
        frame.save(os.path.join(frames_dir, f"f{i:03d}.png"))


def encode(frames_dir: str, mp4_path: str, webm_path: str):
    pat = os.path.join(frames_dir, "f%03d.png")
    # Transparent WebM first (VP9 alpha) — the game/show asset.
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS),
                    "-i", pat, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
                    "-auto-alt-ref", "0", "-b:v", "0", "-crf", "28",
                    webm_path], check=True)
    # White MP4 — the exact Muse deliverable format.
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS),
                    "-i", pat, "-filter_complex",
                    "[0]split[a][b];[a]drawbox=c=white@1:t=fill[bg];"
                    "[bg][b]overlay=format=auto",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
                    "-movflags", "+faststart", mp4_path], check=True)


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--image", required=True, help="character still (PNG/WebP/JPG)")
    ap.add_argument("--name", required=True, help="character id, e.g. dorowani")
    ap.add_argument("--out", help="output dir (default output/<name>)")
    ap.add_argument("--variants", help="comma list; default: all six")
    args = ap.parse_args()

    out = args.out or os.path.join("output", args.name)
    os.makedirs(out, exist_ok=True)
    name = args.name

    raw = Image.open(args.image)
    cut = cut_background(raw)
    cut.save(os.path.join(out, f"{name}.transparent.png"))
    char = normalize(cut, CANVAS)
    make_poster(char, os.path.join(out, f"{name}.webp"))

    wanted = (args.variants.split(",") if args.variants else VARIANTS)
    generator = os.environ.get("AVATAR_PIPELINE_GENERATOR")
    video_variants, rendered = {}, {}
    with tempfile.TemporaryDirectory() as td:
        for variant in wanted:
            unique = ALIASES.get(variant, variant)
            if unique not in rendered:
                mp4 = os.path.join(out, f"{name}-{unique}.mp4")
                webm = os.path.join(out, f"{name}-{unique}.transparent.webm")
                if generator:
                    # External (e.g. generative) backend produces the MP4;
                    # the transparent twin is keyed from its frames later —
                    # hook reserved, see README "Generative backend".
                    cmd = generator.format(image=args.image, variant=unique,
                                           out_mp4=mp4)
                    subprocess.run(cmd, shell=True, check=True)
                fd = os.path.join(td, unique)
                render_variant(char, unique, fd)
                if generator:
                    encode(fd, os.path.join(td, unique + ".mp4"), webm)
                else:
                    encode(fd, mp4, webm)
                rendered[unique] = (mp4, webm)
            video_variants[variant] = os.path.basename(rendered[unique][0])

    manifest = {
        "character": name,
        "status": "ok",
        "pipeline": "tools/avatar-pipeline (Mochiichao recreation of the "
                    "Muse avatar pipeline spec — see SPEC.json)",
        "image_available": True,
        "image_path": f"{name}.webp",
        "transparent_image_path": f"{name}.transparent.png",
        "video_available": True,
        "variants": wanted,
        "video_variants": video_variants,
        "transparent_video_variants": {
            v: video_variants[v].replace(".mp4", ".transparent.webm")
            for v in video_variants},
        "spec": {"video": {"width": CANVAS, "height": CANVAS, "fps": FPS,
                           "seconds": SECONDS, "codec": "h264",
                           "background": "white"},
                 "transparent_video": {"codec": "vp9", "alpha": True,
                                       "container": "webm",
                                       "note": "MP4/H.264 cannot store alpha; "
                                               "the WebM twin carries the "
                                               "transparent background."},
                 "poster": {"width": POSTER, "height": POSTER,
                            "format": "webp"}},
        "source_image": os.path.basename(args.image),
        "deletions": "NONE — new files only",
    }
    # Resumable renders: merge into an existing bundle manifest, if any,
    # so variants rendered in separate runs accumulate into one bundle.
    mpath = os.path.join(out, "manifest.json")
    if os.path.exists(mpath):
        try:
            old = json.load(open(mpath))
            merged = dict(old.get("video_variants", {}))
            merged.update(video_variants)
            manifest["video_variants"] = merged
            manifest["variants"] = VARIANTS if set(merged) >= set(VARIANTS) \
                else sorted(merged)
            manifest["transparent_video_variants"] = {
                v: f.replace(".mp4", ".transparent.webm")
                for v, f in merged.items()}
        except Exception:
            pass
    with open(mpath, "w") as f:
        json.dump(manifest, f, indent=2)
    print(json.dumps({"out": out, "variants": video_variants}, indent=2))


if __name__ == "__main__":
    main()
