#!/usr/bin/env python3
"""Gabu mesh separation, pass 1 (NO Blender needed — pure glTF rewrite).

Method (gradient-cut + piece-mean rigidization):
1. Load the v2-fixed GLB (single skinned primitive, 1,599,257 verts).
2. Cut every mesh edge whose endpoint weight vectors differ by L1 > T
   (edge_L1.npy / unique_edges.npy, precomputed).
3. Recompute connected pieces of the uncut graph (scipy). Cross-piece triangles
   are NOT dropped: each triangle is assigned to the piece of its first vertex,
   and its other vertices are DUPLICATED into that piece (same rest position /
   normal / uv, piece weight vector). Rest pose is therefore identical in shape;
   only topology + weights change.
4. Each piece's verts get the piece MEAN weight vector (pruned <0.03, top 4,
   renormalized). Within a piece, weight gradients are ~0, so intra-piece edge
   stretch collapses to ~rigid motion. Seams between pieces become clean gaps
   instead of shredded triangles.
5. Everything else (nodes, skins, IBMs, animations, materials) is copied
   unchanged, so bone motion is identical.

Usage: seam_split.py <in.glb> <out.glb> --threshold T
"""
import sys, os, json, argparse
import numpy as np

sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/wh-fetch/tools/auto_rig")
from validate import read_glb
from anim_check import read_accessor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"); ap.add_argument("outp")
    ap.add_argument("--threshold", type=float, default=0.4)
    ap.add_argument("--keep-every", type=int, default=0,
                    help="Iter 6 bridged cut: keep every Nth cut edge welded (0 = full cut)")
    ap.add_argument("--edges", default=None)
    ap.add_argument("--l1", default=None)
    a = ap.parse_args()
    base = os.path.dirname(os.path.abspath(__file__))
    edges = np.load(a.edges or os.path.join(base, "unique_edges.npy"))
    l1 = np.load(a.l1 or os.path.join(base, "edge_L1.npy"))
    assert len(edges) == len(l1)
    js, bdat = read_glb(a.inp)
    prim = None
    for mesh in js["meshes"]:
        for pr in mesh["primitives"]:
            if "JOINTS_0" in pr.get("attributes", {}):
                prim = pr; break
    assert prim is not None and "targets" not in prim, "morph targets not supported"
    at = prim["attributes"]
    pos = np.asarray(read_accessor(js, bdat, at["POSITION"]), dtype=np.float32).reshape(-1, 3)
    nor = np.asarray(read_accessor(js, bdat, at["NORMAL"]), dtype=np.float32).reshape(-1, 3) if "NORMAL" in at else None
    uv = np.asarray(read_accessor(js, bdat, at["TEXCOORD_0"]), dtype=np.float32).reshape(-1, 2) if "TEXCOORD_0" in at else None
    J = np.asarray(read_accessor(js, bdat, at["JOINTS_0"]), dtype=np.int64).reshape(-1, 4)
    W = np.asarray(read_accessor(js, bdat, at["WEIGHTS_0"]), dtype=np.float32).reshape(-1, 4)
    idx = np.asarray(read_accessor(js, bdat, prim["indices"]), dtype=np.int64).reshape(-1, 3)
    n = len(pos)
    cut = l1 > a.threshold
    if a.keep_every and a.keep_every > 1:
        cidx = np.nonzero(cut)[0]
        keep_bridge = cidx[np.arange(len(cidx)) % a.keep_every == 0]
        cut[keep_bridge] = False
        print(f"bridges kept: {len(keep_bridge)} of {len(cidx)} cut edges (every {a.keep_every}th)", flush=True)
    print(f"verts={n} edges={len(edges)} cut={int(cut.sum())} ({100*cut.mean():.3f}%)", flush=True)
    from scipy import sparse
    from scipy.sparse.csgraph import connected_components
    keep = edges[~cut]
    rows = np.concatenate([keep[:, 0], keep[:, 1]])
    cols = np.concatenate([keep[:, 1], keep[:, 0]])
    A = sparse.csr_matrix((np.ones(len(rows), dtype=bool), (rows, cols)), shape=(n, n))
    npieces, piece_id = connected_components(A, directed=False)
    piece_id = piece_id.astype(np.int64)
    print(f"pieces={npieces}", flush=True)
    nj = len(js["skins"][0]["joints"])
    sums = np.zeros((npieces, nj), dtype=np.float64)
    for k in range(4):
        np.add.at(sums, (piece_id, J[:, k]), W[:, k].astype(np.float64))
    cnts = np.bincount(piece_id, minlength=npieces).astype(np.float64)
    mean = sums / np.maximum(cnts[:, None], 1)
    mean[mean < 0.03] = 0
    top = np.argpartition(-mean, 4, axis=1)[:, :4]
    topw = np.take_along_axis(mean, top, axis=1)
    order = np.argsort(-topw, axis=1)
    top = np.take_along_axis(top, order, axis=1)
    topw = np.take_along_axis(topw, order, axis=1)
    s = topw.sum(1, keepdims=True)
    topw = np.where(s > 0, topw / np.maximum(s, 1e-9), 0)
    topw[:, 0] = np.where(s[:, 0] > 0, topw[:, 0], 1.0)
    piece_J = top.astype(np.int64); piece_W = topw.astype(np.float32)
    # triangles -> piece of vertex 0; duplicate verts per (vert, piece)
    tri_piece = piece_id[idx[:, 0]]
    keys = idx.astype(np.int64) * np.int64(npieces) + tri_piece[:, None]
    uniq, new_idx = np.unique(keys, return_inverse=True)
    new_idx = new_idx.reshape(-1, 3)
    new_orig = (uniq // npieces).astype(np.int64)
    new_piece = (uniq % npieces).astype(np.int64)
    new_pos = pos[new_orig]
    new_nor = nor[new_orig] if nor is not None else None
    new_uv = uv[new_orig] if uv is not None else None
    new_J = piece_J[new_piece]; new_W = piece_W[new_piece]
    print(f"new verts={len(new_pos)} (orig {n}, dup {len(new_pos) - n}) tris={len(new_idx)}", flush=True)
    import struct, copy
    js2 = copy.deepcopy(js)
    orig_bin = bytes(bdat)
    chunks = [orig_bin]
    off = len(orig_bin)

    def add_buf(arr):
        nonlocal off
        b = np.ascontiguousarray(arr).tobytes()
        pad = (-len(b)) % 4
        chunks.append(b + b"\x00" * pad)
        bv = {"buffer": 0, "byteOffset": off, "byteLength": len(b)}
        off += len(b) + pad
        return bv
    prim2 = None
    for mesh in js2["meshes"]:
        for pr in mesh["primitives"]:
            if "JOINTS_0" in pr.get("attributes", {}):
                prim2 = pr; break
    at2 = prim2["attributes"]

    def add_acc(data, ctype, comp):
        bv = add_buf(data)
        js2["bufferViews"].append(bv)
        acc = {"bufferView": len(js2["bufferViews"]) - 1, "componentType": comp,
               "count": len(data), "type": ctype}
        if ctype in ("VEC3", "VEC2"):
            acc["min"] = [float(x) for x in data.min(0)]; acc["max"] = [float(x) for x in data.max(0)]
        js2["accessors"].append(acc)
        return len(js2["accessors"]) - 1
    at2["POSITION"] = add_acc(new_pos, "VEC3", 5126)
    if new_nor is not None:
        at2["NORMAL"] = add_acc(new_nor, "VEC3", 5126)
    if new_uv is not None:
        at2["TEXCOORD_0"] = add_acc(new_uv, "VEC2", 5126)
    at2["JOINTS_0"] = add_acc(new_J.astype(np.uint16), "VEC4", 5123)
    at2["WEIGHTS_0"] = add_acc(new_W, "VEC4", 5126)
    prim2["indices"] = add_acc(new_idx.astype(np.uint32).reshape(-1), "SCALAR", 5125)
    js2["buffers"] = [{"byteLength": off}]
    jbytes = json.dumps(js2, separators=(",", ":")).encode()
    jbytes += b" " * ((-len(jbytes)) % 4)
    total = 12 + 8 + len(jbytes) + 8 + off
    with open(a.outp, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(jbytes), 0x4E4F534A)); f.write(jbytes)
        f.write(struct.pack("<II", off, 0x004E4942))
        for c in chunks: f.write(c)
    print("wrote", a.outp, os.path.getsize(a.outp), "bytes", flush=True)
    json.dump({"in": a.inp, "out": a.outp, "threshold": a.threshold, "keep_every": a.keep_every,
               "orig_verts": n, "new_verts": int(len(new_pos)),
               "pieces": int(npieces), "cut_edges": int(cut.sum())},
              open(a.outp + ".split.json", "w"), indent=1)
    js2 = None


if __name__ == "__main__":
    main()
