#!/usr/bin/env python3
"""Build a sparse-keyframe control video for VACE first/last-frame.

The Wan-native first/last-frame route that fits a T4 is NOT a
dedicated FLF model (Wan 2.1 FLF2V is 14B — T4-marginal, see
KAGGLE-KIT.md): it is VACE-1.3B fed a control video whose only
real frames are the FIRST and the LAST, with the frames between
left blank for the model to generate. That sparse-keyframe
pattern is how VACE's own community documentation describes
start/end-frame generation (keyframes separated by empty frames
= interpolate between them).

This helper takes two canon frames (start, end) and writes:
  <out>_control.mp4   start frame, (N-2) neutral-gray frames, end
  <out>_mask.mp4      white (= generate here) on the blank span,
                      black (= keep) on the two keyframes
at the VACE-1.3B eval size (832x480, 480p is the 1.3B model's
supported resolution) and a frame count of the form 4n+1
(default 81). Feed both into wan21_vace_first_last_frame.json.

STATUS: template tooling for the VACE eval — the pair it produces
has not yet been run through a gated Wan test. If the eval shows
VACE wants a different blank value (pure black vs neutral gray),
change --blank and record the finding in the production log;
do not silently ship either variant as proven.

Usage:
  build_sparse_flf_control.py --start canon.png --end canon2.png \
      --out /kaggle/working/flf/wispkin_flf [--frames 81]
"""
import argparse, subprocess, sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser(
        description="Build VACE sparse-keyframe FLF control+mask videos.")
    ap.add_argument("--start", required=True)
    ap.add_argument("--end", required=True)
    ap.add_argument("--out", required=True,
                    help="output prefix (writes <out>_control.mp4 "
                         "and <out>_mask.mp4)")
    ap.add_argument("--frames", type=int, default=81,
                    help="total frames, must be 4n+1 (default 81)")
    ap.add_argument("--width", type=int, default=832)
    ap.add_argument("--height", type=int, default=480)
    ap.add_argument("--fps", type=int, default=16)
    ap.add_argument("--blank", default="gray",
                    choices=["gray", "black"],
                    help="blank-span fill; gray=neutral 0.5, "
                         "black=0. See STATUS in the docstring.")
    args = ap.parse_args()

    if (args.frames - 1) % 4 != 0:
        print(f"FATAL: --frames must be 4n+1, got {args.frames}",
              file=sys.stderr)
        return 2
    for p in (args.start, args.end):
        if not Path(p).exists():
            print(f"FATAL: frame not found: {p}", file=sys.stderr)
            return 2
    try:
        from PIL import Image
    except ImportError:
        print("FATAL: Pillow required (pip install pillow)",
              file=sys.stderr)
        return 2

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.parent / (out.name + "_frames")
    tmp.mkdir(exist_ok=True)
    fill = (128, 128, 128) if args.blank == "gray" else (0, 0, 0)
    size = (args.width, args.height)

    def prep(src, dst):
        im = Image.open(src).convert("RGBA")
        bg = Image.new("RGBA", size, (255, 255, 255, 255))
        im.thumbnail(size)
        bg.alpha_composite(im, ((size[0] - im.width) // 2,
                                (size[1] - im.height) // 2))
        bg.convert("RGB").save(dst)

    prep(args.start, tmp / "f_first.png")
    prep(args.end, tmp / "f_last.png")
    blank = Image.new("RGB", size, fill)
    blank.save(tmp / "f_blank.png")
    keep = Image.new("RGB", size, (0, 0, 0))
    gen = Image.new("RGB", size, (255, 255, 255))
    keep.save(tmp / "m_keep.png")
    gen.save(tmp / "m_gen.png")

    def encode(frame_at, pattern, target):
        # frame_at: function i -> Path of the still for frame i
        seq = tmp / (pattern + "_%04d.png")
        for i in range(args.frames):
            src = frame_at(i)
            dst = Path(str(seq) % i)
            if not dst.exists():
                dst.write_bytes(Path(src).read_bytes())
        r = subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-framerate", str(args.fps),
             "-i", str(seq), "-c:v", "libx264", "-pix_fmt", "yuv420p",
             str(target)], capture_output=True, text=True)
        if r.returncode != 0:
            print(f"FATAL: ffmpeg failed: {r.stderr.strip()}",
                  file=sys.stderr)
            return False
        return True

    n = args.frames
    ok = encode(lambda i: tmp / ("f_first.png" if i == 0 else
                                 "f_last.png" if i == n - 1 else
                                 "f_blank.png"),
                "c", Path(str(out) + "_control.mp4"))
    ok = ok and encode(lambda i: tmp / ("m_keep.png" if i in (0, n - 1)
                                         else "m_gen.png"),
                       "m", Path(str(out) + "_mask.mp4"))
    if not ok:
        return 1
    print(f"control: {out}_control.mp4  ({n} frames, "
          f"{args.width}x{args.height} @ {args.fps}fps, blank={args.blank})")
    print(f"mask:    {out}_mask.mp4")
    print("Feed both into wan21_vace_first_last_frame.json "
          "(WanVaceToVideo control_video / control_masks).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
