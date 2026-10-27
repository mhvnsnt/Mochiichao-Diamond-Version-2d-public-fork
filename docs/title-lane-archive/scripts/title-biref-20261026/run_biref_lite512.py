#!/usr/bin/env python3
"""Run rembg BiRefNet-general-lite with input resized to 512x512 instead of
the session's hardcoded 1024x1024.

Why: BiRefNet-general (1024) was Killed (OOM, exit 137) 3 times and
BiRefNet-general-lite (1024) was Killed once on this shared 8 GB, 0-swap
machine, even with 4.2 GB free at launch. The title crops themselves are
only 326-451 px wide, so a 512px mask still EXCEEDS the crop's own
resolution — no crop detail is lost by not upscaling to 1024 first.
Same model file (birefnet-general-lite.onnx, md5-verified), same rembg
library, same sigmoid/max-min normalisation as the stock session;
only the internal resize target changes. Labelled as lite-512 in the PR.
Usage: run_biref_lite512.py <crop.png> <out.png>
"""
import os, sys
os.environ["OMP_NUM_THREADS"] = "2"
os.environ["MKL_NUM_THREADS"] = "2"

import numpy as np
from PIL import Image
import onnxruntime as ort
from rembg import remove
from rembg.sessions.birefnet_general_lite import BiRefNetSessionGeneralLite


class Lite512(BiRefNetSessionGeneralLite):
    def predict(self, img, *args, **kwargs):
        ort_outs = self.inner_session.run(
            None,
            self.normalize(img, (0.485, 0.456, 0.406), (0.229, 0.224, 0.225), (512, 512)),
        )
        pred = self.sigmoid(ort_outs[0][:, 0, :, :])
        ma = np.max(pred)
        mi = np.min(pred)
        pred = (pred - mi) / (ma - mi)
        pred = np.squeeze(pred)
        mask = Image.fromarray((pred * 255).astype("uint8"), mode="L")
        mask = mask.resize(img.size, Image.Resampling.LANCZOS)
        return [mask]


def main():
    src, dst = sys.argv[1], sys.argv[2]
    print(f"loading BiRefNet-general-lite @512 for {src} ...", flush=True)
    opts = ort.SessionOptions()
    session = Lite512("birefnet-general-lite", opts)
    print("session ready, running inference ...", flush=True)
    with open(src, "rb") as fh:
        out = remove(fh.read(), session=session)
    with open(dst, "wb") as fh:
        fh.write(out)
    print(f"wrote {dst} ({os.path.getsize(dst)} bytes)", flush=True)


if __name__ == "__main__":
    main()
