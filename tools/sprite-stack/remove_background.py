#!/usr/bin/env python3
"""Background removal for sprite sheets — rembg integration script.

Uses rembg (MIT, https://github.com/danielgatis/rembg) when it is
installed. rembg runs locally through ONNX Runtime — no paid API, no
upload, no account. The model is downloaded on first use and cached
under ~/.rembg/models/ in rembg 2.0.86 (older versions used ~/.u2net);
the model file itself is NOT vendored in this repo.

LICENCE RULE (commercial default — do not relax it):
  * PREFERRED: BiRefNet-general / BiRefNet-general-lite, via
    rembg session "birefnet-general" / "birefnet-general-lite".
    BiRefNet code + weights are MIT: Hugging Face card for
    ZhengPeng7/BiRefNet lists `license: mit`, and
    onnx-community/BiRefNet_lite lists `license: mit`. This is the
    default of this script, so a bare run can never silently pick
    the BRIA model.
  * FAST CPU FALLBACK ONLY, labelled as such: u2net / u2netp
    (Apache-2.0 model family). Blockier edges than BiRefNet.
  * BLOCKED: any BRIA model (BRIA RMBG-2.0, rembg 2.0.85's default
    session). Its open weights are CC BY-NC 4.0 and commercial use
    needs a BRIA agreement, so this script refuses those session
    names outright instead of merely warning about them.

This script vendors no rembg code and no model. It is the wiring: it
checks for rembg, runs it with a chosen model, and writes transparent
PNGs. If rembg is not installed it stops with the install command
instead of silently faking a result — the pipeline's clean stage
(tools/sprite-atlas-cleanup/clean_atlas.py) is the fallback that runs
without it, and it only cuts trapped sheet-background pixels, which is
a different, narrower job than full background removal.

Pipeline order (Quickest 2026 Ways §2a): source at 2-4x final size
-> rembg + BiRefNet-general -> alpha-matting/decontaminate pass
(--alpha-matting) -> downscale (nearest for pixel art, Lanczos for
painted art) -> palette-quantise -> manual edge pass. This script is
step 2 (+ the optional matting flags for step 3); it does not replace
the manual pass, and it never overwrites its inputs.

Usage:
  python3 remove_background.py --check
  python3 remove_background.py --input <png|dir> --output <png|dir>
      [--model birefnet-general] [--force]
      [--alpha-matting] [--alpha-matting-foreground-threshold 240]
      [--alpha-matting-background-threshold 10]
      [--alpha-matting-erode-size 10]
  --check only reports whether rembg is importable; it installs nothing.
Refuses to overwrite outputs unless --force is given.
"""

import argparse
import os
import sys

DEFAULT_MODEL = "birefnet-general"

# Session names this script will never run, whatever the caller asks.
BLOCKED_SUBSTRINGS = ("bria", "rmbg-2", "rmbg_2")

# Fallback models that are licence-clean but lower quality; the caller
# must name them explicitly (they are never the default).
FALLBACK_MODELS = ("u2net", "u2netp", "u2net_human_seg", "silueta")


def validate_model(model):
    """Return an error string, or None if the model may run."""
    name = (model or "").strip().lower()
    if not name:
        return "no model given; use --model birefnet-general"
    for bad in BLOCKED_SUBSTRINGS:
        if bad in name:
            return (
                f"model {model!r} is BLOCKED: BRIA RMBG-2.0 weights are "
                "CC BY-NC 4.0 (commercial use needs a BRIA agreement). "
                "Use --model birefnet-general (MIT) instead."
            )
    return None


def check():
    try:
        import rembg  # noqa: F401
    except ImportError:
        print("rembg: NOT INSTALLED")
        print("install: pip install \"rembg[cpu,cli]\" onnxruntime")
        print("note: first run downloads the model under ~/.rembg/models/ "
              "(BiRefNet-general is the default; it is NOT vendored here)")
        print("fallback: tools/sprite-atlas-cleanup/clean_atlas.py "
              "(trapped-background cuts only, no model needed)")
        return 1
    import rembg as _r
    print(f"rembg: installed (version {getattr(_r, '__version__', 'unknown')})")
    print(f"default model: {DEFAULT_MODEL} (BiRefNet, MIT)")
    print("blocked models: any BRIA / RMBG-2.0 session (CC BY-NC 4.0)")
    print(f"fast CPU fallbacks (labelled, Apache-2.0): "
          f"{', '.join(FALLBACK_MODELS)}")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--input", default=None)
    ap.add_argument("--output", default=None)
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--alpha-matting", action="store_true",
                    help="alpha-matting/decontaminate pass (step 3)")
    ap.add_argument("--alpha-matting-foreground-threshold", type=int,
                    default=240)
    ap.add_argument("--alpha-matting-background-threshold", type=int,
                    default=10)
    ap.add_argument("--alpha-matting-erode-size", type=int, default=10)
    args = ap.parse_args()
    if args.check:
        return check()
    if not args.input or not args.output:
        ap.error("--input and --output are required (or use --check)")
    err = validate_model(args.model)
    if err:
        print(f"ERROR: {err}", file=sys.stderr)
        return 2
    if args.model in FALLBACK_MODELS:
        print(f"NOTE: {args.model} is the fast CPU fallback (Apache-2.0), "
              "not the BiRefNet commercial default.", file=sys.stderr)
    try:
        from rembg import remove, new_session
    except ImportError:
        print("ERROR: rembg is not installed. Run: "
              "pip install \"rembg[cpu,cli]\" onnxruntime",
              file=sys.stderr)
        print("Then re-run; first run downloads the model under ~/.rembg/models/.",
              file=sys.stderr)
        return 2
    session = new_session(args.model)
    kwargs = {}
    if args.alpha_matting:
        kwargs = {
            "alpha_matting": True,
            "alpha_matting_foreground_threshold":
                args.alpha_matting_foreground_threshold,
            "alpha_matting_background_threshold":
                args.alpha_matting_background_threshold,
            "alpha_matting_erode_size": args.alpha_matting_erode_size,
        }

    def clean_one(src, dst):
        with open(src, "rb") as fh:
            out = remove(fh.read(), session=session, **kwargs)
        with open(dst, "wb") as fh:
            fh.write(out)

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
            clean_one(src, dst)
            done += 1
        print(f"rembg: {done} files -> {args.output} (model {args.model})")
    else:
        if not args.force and os.path.exists(args.output):
            print(f"ERROR: output exists, re-run with --force: {args.output}",
                  file=sys.stderr)
            return 4
        parent = os.path.dirname(args.output)
        if parent:
            os.makedirs(parent, exist_ok=True)
        clean_one(args.input, args.output)
        print(f"rembg: {args.input} -> {args.output} (model {args.model})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
