#!/usr/bin/env python3
"""Run rembg BiRefNet-general on ONE crop with a 1-thread ONNX session.

Same model/method as the rembg CLI (BiRefNet-general, MIT, model file
~/.u2net/birefnet-general.onnx, md5-verified), but with intra/inter-op
threads forced to 1: the stock CLI session uses all cores and was Killed
(OOM, 8 GB machine, other lanes running) twice. If this still gets Killed,
the fallback is birefnet-general-lite (same BiRefNet family, MIT), labelled.
Usage: run_biref_1thread.py <crop.png> <out.png>
"""
import os, sys
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"

import onnxruntime as ort
from rembg import remove
from rembg.sessions.birefnet_general import BiRefNetSessionGeneral

def main():
    src, dst = sys.argv[1], sys.argv[2]
    print(f"loading BiRefNet-general (1 thread) for {src} ...", flush=True)
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 1
    opts.inter_op_num_threads = 1
    session = BiRefNetSessionGeneral("birefnet-general", opts)
    print("session ready, running inference ...", flush=True)
    with open(src, "rb") as fh:
        out = remove(fh.read(), session=session)
    with open(dst, "wb") as fh:
        fh.write(out)
    print(f"wrote {dst} ({os.path.getsize(dst)} bytes)", flush=True)

if __name__ == "__main__":
    main()
