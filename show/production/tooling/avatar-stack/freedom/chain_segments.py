#!/usr/bin/env python3
"""chain_segments.py - chain one character's performed segments into one clip.

This is the "freedom" replacement for the avatar tool's fixed slots: a
character's performance is a LIST of free-text segments (see
job_format_v2.md). Each segment is generated on its own (Wan I2V on the
Kaggle seat, driven by run_backend.py-style job fields), and this tool
joins them back into a single continuous clip:

  1. Extracts the LAST frame of every segment (except the final one) and
     saves it as `<stem>_next_start.png` - that PNG is the start-frame
     candidate the NEXT segment's generation job should be conditioned
     on (feed it through prep_start_frame.py), so segment N+1 begins
     where segment N ended instead of jumping back to the canon pose.
  2. Concatenates the segments in order with ffmpeg (all inputs are
     normalised to the first segment's size/fps, then re-encoded once).
  3. Writes a seam report (JSON + stdout): for every joint, the mean
     absolute frame difference ACROSS the joint, compared with the
     median consecutive-frame difference inside the joined clip - the
     same mean-diff measurement family verify_motion.py uses. A seam
     ratio near 1.0 means the joint moves like ordinary in-clip motion;
     a large ratio flags a visible jump the eye will catch.

Usage:
  chain_segments.py SEG1.mp4 SEG2.mp4 [SEG3.mp4 ...] --out JOINED.mp4
                    [--report seam-report.json] [--workdir DIR]

Requires: ffmpeg, ffprobe, numpy, Pillow (all already used by the
animation backend in ep01-rebuild/animation-backend/).
"""
import argparse, json, os, subprocess, sys
import numpy as np


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


def decode_frames(path, w, h):
    """Decode a whole (short) clip to a float32 array [n, h, w, 3]."""
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={w}:{h}",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True)
    if p.returncode:
        sys.exit(f"ffmpeg decode failed on {path}")
    buf = np.frombuffer(p.stdout, np.uint8)
    n = buf.size // (w * h * 3)
    return buf[: n * w * h * 3].reshape(n, h, w, 3).astype(np.float32)


def extract_last_frame(path, out_png):
    r = subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-sseof", "-0.15", "-i", path,
         "-vframes", "1", "-update", "1", out_png])
    if r.returncode or not os.path.exists(out_png):
        sys.exit(f"last-frame extraction failed on {path}")
    return out_png


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("segments", nargs="+", help="segment MP4s, in play order")
    ap.add_argument("--out", required=True)
    ap.add_argument("--report", default=None,
                    help="seam report JSON path (default: <out>.seams.json)")
    ap.add_argument("--workdir", default=None,
                    help="where next-start PNGs go (default: beside --out)")
    a = ap.parse_args()
    if len(a.segments) < 2:
        sys.exit("need at least two segments to chain")
    for s in a.segments:
        if not os.path.exists(s):
            sys.exit(f"segment not found: {s}")
    workdir = a.workdir or os.path.dirname(os.path.abspath(a.out))
    os.makedirs(workdir, exist_ok=True)
    report_path = a.report or (a.out + ".seams.json")

    infos = [probe(s) for s in a.segments]
    w0, h0, fps0 = infos[0][0], infos[0][1], infos[0][2]
    fps_out = int(round(fps0)) or 24

    # 1. last frame of each segment -> next segment's start candidate
    next_starts = []
    for i, seg in enumerate(a.segments[:-1]):
        stem = os.path.splitext(os.path.basename(seg))[0]
        png = os.path.join(workdir, f"{stem}_next_start.png")
        extract_last_frame(seg, png)
        next_starts.append({"after_segment": i, "segment": seg, "next_start_png": png})

    # 2. seam measurement on decoded frames (verify_motion-style MAD)
    decoded = [decode_frames(s, w0, h0) for s in a.segments]
    all_frames = np.concatenate(decoded, axis=0)
    diffs = np.abs(np.diff(all_frames, axis=0)).mean(axis=(1, 2, 3))
    median_diff = float(np.median(diffs)) if len(diffs) else 0.0
    seams, cursor = [], 0
    for i, frames in enumerate(decoded[:-1]):
        cursor += len(frames)
        seam_diff = float(diffs[cursor - 1])  # last-of-i vs first-of-i+1
        seams.append({
            "joint": i,
            "between": [a.segments[i], a.segments[i + 1]],
            "seam_mean_abs_diff": round(seam_diff, 4),
            "clip_median_consecutive_diff": round(median_diff, 4),
            "seam_ratio_vs_median": round(seam_diff / median_diff, 3) if median_diff else None,
            "read": ("smooth - joint moves like ordinary in-clip motion"
                     if median_diff and seam_diff <= 1.5 * median_diff else
                     "visible jump likely - re-generate the next segment "
                     "conditioned on the extracted next-start frame"),
        })

    # 3. concatenate (normalise size/fps, single re-encode)
    inputs, filters = [], []
    for i, seg in enumerate(a.segments):
        inputs += ["-i", seg]
        filters.append(f"[{i}:v]scale={w0}:{h0},fps={fps_out},"
                       f"setsar=1,format=yuv420p[v{i}]")
    labels = "".join(f"[v{i}]" for i in range(len(a.segments)))
    filt = ";".join(filters) + f";{labels}concat=n={len(a.segments)}:v=1:a=0[v]"
    cmd = (["ffmpeg", "-y", "-v", "error"] + inputs +
           ["-filter_complex", filt, "-map", "[v]", "-c:v", "libx264",
            "-pix_fmt", "yuv420p", "-crf", "18", a.out])
    r = subprocess.run(cmd)
    if r.returncode:
        sys.exit("ffmpeg concat failed")
    ow, oh, ofps, odur = probe(a.out)

    report = {
        "tool": "chain_segments.py",
        "segments": a.segments,
        "segment_info": [
            {"file": s, "width": i[0], "height": i[1],
             "fps": round(i[2], 3), "duration_s": round(i[3], 3)}
            for s, i in zip(a.segments, infos)],
        "next_start_frames": next_starts,
        "seams": seams,
        "clip_median_consecutive_diff": round(median_diff, 4),
        "output": {"file": a.out, "width": ow, "height": oh,
                   "fps": round(ofps, 3), "duration_s": round(odur, 3)},
    }
    json.dump(report, open(report_path, "w"), indent=1)
    print(json.dumps(report, indent=1))
    print(f"seam report: {report_path}")


if __name__ == "__main__":
    main()
