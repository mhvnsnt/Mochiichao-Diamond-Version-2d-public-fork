#!/usr/bin/env python3
"""rembg u2netp test on the 4 front crops, for shadow-clean cutouts.

Model file is already at ~/.u2net/u2netp.onnx (4.4 MB, downloaded
2026-10-25 21:42 CDT). Outputs: <name>-u2netp.png + on-black proof.
Logs progress per creature so a slow CPU run is still observable.
"""
import os, sys
from PIL import Image
OUT = os.path.expanduser("~/workspace/mochiichao-work/title-creatures-9/work/seg-test")
print("importing rembg...", flush=True)
from rembg import new_session, remove
print("creating u2netp session...", flush=True)
session = new_session("u2netp")
print("session ready", flush=True)
for name in ["sproutle", "dorowani", "tyrage", "kittember"]:
    print(f"processing {name}...", flush=True)
    im = Image.open(os.path.join(OUT, f"{name}-crop.png"))
    out = remove(im, session=session)
    out.save(os.path.join(OUT, f"{name}-u2netp.png"))
    dark = Image.new("RGBA", out.size, (0, 0, 0, 255))
    dark.alpha_composite(out.convert("RGBA"))
    dark.convert("RGB").save(os.path.join(OUT, f"{name}-u2netp-on-black.png"))
    print(f"{name} done {out.size} bbox={out.getchannel('A').getbbox()}", flush=True)
print("ALL DONE", flush=True)
