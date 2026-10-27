#!/usr/bin/env python3
"""Run the avatar pipeline for Mochiichao characters in bulk.

Default source art is the roster front art the game already ships:
  public/assets/variants/lustre/<name>_lustre_front.png
Any folder of <name>.png / <name>_front.png stills works with --source-dir.

  python3 batch.py --limit 6                 # first pilot batch
  python3 batch.py --only mochii,dorowani,gabu,kittember,sproutle,wispkin
  python3 batch.py                           # whole roster

Each character lands in output/<name>/ with the full avatar bundle
(poster, transparent still, 4 unique MP4s + 4 transparent WebMs for the
6 variant names, manifest.json). Nothing outside output/ is written.
"""
import argparse, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-dir", default=os.path.join(
        REPO, "public", "assets", "variants", "lustre"))
    ap.add_argument("--only", help="comma list of character names")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--out", default=os.path.join(HERE, "output"))
    args = ap.parse_args()

    jobs = []
    for f in sorted(os.listdir(args.source_dir)):
        if not f.endswith(".png"):
            continue
        name = f.replace("_lustre_front.png", "").replace("_front.png", "") \
                .replace(".png", "")
        if args.only and name not in args.only.split(","):
            continue
        jobs.append((name, os.path.join(args.source_dir, f)))
    if args.limit:
        jobs = jobs[:args.limit]
    if not jobs:
        sys.exit(f"no character stills found in {args.source_dir}")

    for name, img in jobs:
        print(f"== {name} <- {img}", flush=True)
        subprocess.run([sys.executable, os.path.join(HERE, "avatar_pipeline.py"),
                        "--image", img, "--name", name,
                        "--out", os.path.join(args.out, name)], check=True)
    print(f"done: {len(jobs)} character bundle(s) in {args.out}")

if __name__ == "__main__":
    main()
