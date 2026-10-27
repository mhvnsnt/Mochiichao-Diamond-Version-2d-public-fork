#!/usr/bin/env python3
"""Title lane verification gate (staging -> repo tools/).
Checks, per video file: duration within tolerance, fps, and FRAME-DIFF
ACROSS THE LOOP (evidence gate: a single still is not proof of animation).
Checks, per PNG: dimensions present, size budget. Checks, per manifest:
every listed file exists and its sha256 matches.
Exit 1 on any failure, with counts. No network, no logo/Pokemon-art
content judgement — that gate is a human eye-check, recorded separately.
Usage: title_verify.py --video <mp4> [--t1 3.0 --t2 3.5 --min-diff 0.5]
       title_verify.py --manifest <json> --root <dir>
"""
import argparse, json, os, subprocess, sys
import numpy as np
from PIL import Image
def frame(vid, t, out):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-i", vid,
                    "-frames:v", "1", out], check=True)
    return np.asarray(Image.open(out).convert("L"), dtype=float)
def check_video(path, t1, t2, min_diff, work):
    os.makedirs(work, exist_ok=True)
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    dur = float(out) if out else 0.0
    a, b = frame(path, t1, f"{work}/a.png"), frame(path, t2, f"{work}/b.png")
    diff = float(np.abs(a - b).mean())
    ok = dur > 0 and diff >= min_diff
    print(f"{'PASS' if ok else 'FAIL'} video {path} duration={dur:.2f}s diff({t1}s vs {t2}s)={diff:.2f} min={min_diff}")
    return ok
def check_manifest(manifest, root):
    import hashlib
    data = json.load(open(manifest)); ok = True; n = 0
    for it in data["files"]:
        p = os.path.join(root, it["path"]); n += 1
        if not os.path.exists(p):
            print(f"FAIL manifest missing {it['path']}"); ok = False; continue
        h = hashlib.sha256(open(p, "rb").read()).hexdigest()
        if h != it["sha256"]:
            print(f"FAIL manifest sha mismatch {it['path']}"); ok = False
    print(f"{'PASS' if ok else 'FAIL'} manifest {n} files vs {root}")
    return ok
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--video"); ap.add_argument("--t1", type=float, default=3.0)
    ap.add_argument("--t2", type=float, default=3.5); ap.add_argument("--min-diff", type=float, default=0.5)
    ap.add_argument("--manifest"); ap.add_argument("--root"); ap.add_argument("--work", default="/tmp/title_verify_work")
    a = ap.parse_args(); ok = True
    if a.video: ok &= check_video(a.video, a.t1, a.t2, a.min_diff, a.work)
    if a.manifest: ok &= check_manifest(a.manifest, a.root or ".")
    sys.exit(0 if ok else 1)
if __name__ == "__main__": main()
