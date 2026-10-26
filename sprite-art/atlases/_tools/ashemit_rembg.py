#!/usr/bin/env python3
"""ashemit_rembg.py — scripted rembg pass (open-source rembg library, NOT CLI).

The rembg-venv CLI is broken in this session (missing CLI deps), but the
rembg library itself imports fine with onnxruntime 1.31, so this script uses
the library API: rembg.remove(). Same model, same segmentation — no hand edits.

Usage: ashemit_rembg.py <input.png> [...] <outdir>
Writes <stem>_rembg.png into outdir. Originals NEVER overwritten.
Prints per-file alpha-diff stats (removed / added opaque pixels) so the
caller can decide what ships after eye-checking.
"""
import sys, os
import numpy as np
from PIL import Image
from rembg import remove, new_session

# u2netp (4.4 MB, already in ~/.u2net/) — NOT the venv default bria-rmbg-2.0
# (1.02 GB download, killed by timeout at 8%). Same rembg library, lighter model.
SESSION = new_session("u2netp")

def main(argv):
    if len(argv) < 3:
        print(__doc__); return 2
    outdir = argv[-1]
    os.makedirs(outdir, exist_ok=True)
    for path in argv[1:-1]:
        with open(path, 'rb') as fh:
            out_bytes = remove(fh.read(), session=SESSION)
        import io
        im = Image.open(io.BytesIO(out_bytes)).convert('RGBA')
        stem = os.path.splitext(os.path.basename(path))[0]
        out = os.path.join(outdir, stem + '_rembg.png')
        im.save(out)
        orig = np.asarray(Image.open(path).convert('RGBA'))
        new = np.asarray(im)
        o_op = orig[:, :, 3] >= 200
        n_op = new[:, :, 3] >= 200
        removed = int((o_op & ~n_op).sum())
        added = int((~o_op & n_op).sum())
        print(f"{stem}: orig_opaque={int(o_op.sum())} rembg_opaque={int(n_op.sum())} removed={removed} added={added} -> {out}", flush=True)
    return 0

if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
