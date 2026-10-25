#!/usr/bin/env python3
"""Background removal for sprite sheets — rembg integration script.

Uses rembg (MIT, https://github.com/danielgatis/rembg) when it is
installed. rembg runs locally through ONNX Runtime — no paid API, no
upload, no account. The model is downloaded on first use and cached in
~/.u2net (size depends on the model; silueta is the small ~43 MB
option); the model file itself is NOT vendored in this repo.

This script vendors no rembg code and no model. It is the wiring: it
checks for rembg, runs it with a chosen model, and writes transparent
PNGs. If rembg is not installed it stops with the install command
instead of silently faking a result — the pipeline's clean stage
(tools/sprite-atlas-cleanup/clean_atlas.py) is the fallback that runs
without it, and it only cuts trapped sheet-background pixels, which is
a different, narrower job than full background removal.

Usage:
  python3 remove_background.py --check
  python3 remove_background.py --input <png|dir> --output <png|dir>
      [--model u2net] [--force]
  --check only reports whether rembg is importable; it installs nothing.
Refuses to overwrite outputs unless --force is given.
"""

import argparse
import os
import sys


def check():
    try:
        import rembg  # noqa: F401
    except ImportError:
        print("rembg: NOT INSTALLED")
        print("install: pip install rembg onnxruntime")
        print("note: first run downloads the model into ~/.u2net "
              "(silueta is the small ~43 MB option: --model silueta)")
        print("fallback: tools/sprite-atlas-cleanup/clean_atlas.py "
              "(trapped-background cuts only, no model needed)")
        return 1
    import rembg as _r
    print(f"rembg: installed (version {getattr(_r, '__version__', 'unknown')})")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--input", default=None)
    ap.add_argument("--output", default=None)
    ap.add_argument("--model", default="u2net")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    if args.check:
        return check()
    if not args.input or not args.output:
        ap.error("--input and --output are required (or use --check)")
    try:
        from rembg import remove, new_session
    except ImportError:
        print("ERROR: rembg is not installed. Run: pip install rembg onnxruntime",
              file=sys.stderr)
        print("Then re-run; first run downloads the model into ~/.u2net.",
              file=sys.stderr)
        return 2
    session = new_session(args.model)
    if os.path.isdir(args.input):
        os.makedirs(args.output, exist_ok=True)
        inputs = sorted(os.path.join(args.input, f)
                        for f in os.listdir(args.input)
                        if f.lower().endswith(".png"))
        if not inputs:
            print(f"ERROR: no PNG files in {args.input}", file=sys.stderr)
            return 3
        done = 0
        for src in inputs:
            dst = os.path.join(args.output, os.path.basename(src))
            if not args.force and os.path.exists(dst):
                print(f"skip (exists): {dst}")
                continue
            with open(src, "rb") as fh:
                out = remove(fh.read(), session=session)
            with open(dst, "wb") as fh:
                fh.write(out)
            done += 1
        print(f"rembg: {done} files -> {args.output} (model {args.model})")
    else:
        if not args.force and os.path.exists(args.output):
            print(f"ERROR: output exists, re-run with --force: {args.output}",
                  file=sys.stderr)
            return 4
        with open(args.input, "rb") as fh:
            out = remove(fh.read(), session=session)
        parent = os.path.dirname(args.output)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(args.output, "wb") as fh:
            fh.write(out)
        print(f"rembg: {args.input} -> {args.output} (model {args.model})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
