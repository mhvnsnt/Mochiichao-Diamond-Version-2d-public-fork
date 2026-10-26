#!/usr/bin/env python3
"""Iter 6 FALLBACK: seam-weight BLEND (no topology change, so no voids possible).

Why: bridged cuts trade voids for shred fins — the weight field itself is
discontinuous at component boundaries finer than anatomy (Tripo soup =
208k components). Cutting or bridging cannot fix inter-component drift
because the components were never connected. Blending smooths the weight
FIELD in space, so adjacent triangles agree on where to go regardless of
topology.

Method:
1. Load gabu-rerig-v1.glb weights (zone-pure, 25 joints, 4 slots/vert ->
   dense per-joint vectors).
2. Seam verts = verts incident to an edge with rerig-v1 weight L1 > 0.4
   (meshsep/unique_edges.npy + edge_L1_rerigv1.npy).
3. Hop distance from seam set via sparse dilation (0 = seam, up to HOPS).
   Strength s(v) falls off with hops: s = 1 / (1 + hop) (hop0 = 1.0).
4. ITERS rounds of: W <- (1 - alpha*s) * W + alpha*s * (row-normalized
   neighbor mean of W). Neighbor mean via one sparse matvec per round.
5. Prune < 0.03, keep top 4, renormalize (same rule as seam_split).
6. Write a new GLB copying the input structure, replacing only the
   JOINTS_0 / WEIGHTS_0 accessors (new bufferViews carry "buffer": 0).

Usage: blend.py <in.glb> <out.glb> [--hops H] [--iters I] [--alpha A]
         [--threshold T]
"""
import sys, os, json, argparse, struct, copy
import numpy as np

sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/wh-fetch/tools/auto_rig")
from validate import read_glb
from anim_check import read_accessor


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"); ap.add_argument("outp")
    ap.add_argument("--threshold", type=float, default=0.4)
    ap.add_argument("--hops", type=int, default=3)
    ap.add_argument("--iters", type=int, default=3)
    ap.add_argument("--alpha", type=float, default=0.7)
    ap.add_argument("--protect-joints", default="",
                    help="comma list of joint names whose dominant verts keep s=0 (no blending)")
    ap.add_argument("--arm-falloff", type=int, default=0,
                    help="if >0: instead of binary protection, ramp s 0->1 over N hops from protected verts")
    ap.add_argument("--edges", default="/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/meshsep/unique_edges.npy")
    ap.add_argument("--l1", default="/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/meshsep/edge_L1_rerigv1.npy")
    a = ap.parse_args()
    js, bdat = read_glb(a.inp)
    prim = None
    for mesh in js["meshes"]:
        for pr in mesh["primitives"]:
            if "JOINTS_0" in pr.get("attributes", {}):
                prim = pr; break
    assert prim is not None
    at = prim["attributes"]
    pos = np.asarray(read_accessor(js, bdat, at["POSITION"]), dtype=np.float32).reshape(-1, 3)
    nor = np.asarray(read_accessor(js, bdat, at["NORMAL"]), dtype=np.float32).reshape(-1, 3) if "NORMAL" in at else None
    uv = np.asarray(read_accessor(js, bdat, at["TEXCOORD_0"]), dtype=np.float32).reshape(-1, 2) if "TEXCOORD_0" in at else None
    J = np.asarray(read_accessor(js, bdat, at["JOINTS_0"]), dtype=np.int64).reshape(-1, 4)
    W = np.asarray(read_accessor(js, bdat, at["WEIGHTS_0"]), dtype=np.float32).reshape(-1, 4)
    idx = np.asarray(read_accessor(js, bdat, prim["indices"]), dtype=np.int64).reshape(-1, 3)
    n = len(pos)
    nj = len(js["skins"][0]["joints"])
    print(f"verts={n} joints={nj}", flush=True)
    # dense weight field
    Wd = np.zeros((n, nj), dtype=np.float32)
    for k in range(4):
        np.add.at(Wd, (np.arange(n), J[:, k]), W[:, k])
    # adjacency (row-normalized) from mesh edges
    edges = np.load(a.edges)
    l1 = np.load(a.l1)
    assert len(edges) == len(l1)
    from scipy import sparse
    rows = np.concatenate([edges[:, 0], edges[:, 1]])
    cols = np.concatenate([edges[:, 1], edges[:, 0]])
    A = sparse.csr_matrix((np.ones(len(rows), dtype=np.float32), (rows, cols)), shape=(n, n))
    deg = np.asarray(A.sum(1)).ravel()
    deg[deg == 0] = 1
    An = sparse.diags(1.0 / deg) @ A
    # seam verts + hop distance by dilation
    cut = l1 > a.threshold
    seam = np.zeros(n, dtype=bool)
    seam[edges[cut, 0]] = True
    seam[edges[cut, 1]] = True
    print(f"seam verts: {int(seam.sum())} ({100*seam.mean():.2f}%)", flush=True)
    hop = np.full(n, 99, dtype=np.int32)
    hop[seam] = 0
    frontier = seam.copy()
    for h in range(1, a.hops + 1):
        nb = (A @ frontier.astype(np.float32)) > 0
        new = nb & (hop == 99)
        hop[new] = h
        frontier = new
        print(f"  hop {h}: {int(new.sum())} verts", flush=True)
    s = np.where(hop <= a.hops, 1.0 / (1.0 + hop), 0.0).astype(np.float32)
    prot = None
    if a.protect_joints:
        jnames = [js["nodes"][j].get("name", f"j{j}") for j in js["skins"][0]["joints"]]
        pset = set(x.strip() for x in a.protect_joints.split(",") if x.strip())
        pidx = [jnames.index(nm) for nm in pset]
        dom = Wd.argmax(1)
        prot = np.isin(dom, pidx)
        if a.arm_falloff and a.arm_falloff > 0:
            # distance (hops) from protected set; ramp s 0->1 over arm_falloff hops
            adist = np.full(n, 99, dtype=np.int32)
            adist[prot] = 0
            frontier = prot.copy()
            for h in range(1, a.arm_falloff + 1):
                nb = (A @ frontier.astype(np.float32)) > 0
                new = nb & (adist == 99)
                adist[new] = h
                frontier = new
            ramp = np.clip(adist / float(a.arm_falloff), 0.0, 1.0).astype(np.float32)
            s = s * ramp
            print(f"arm falloff over {a.arm_falloff} hops; protected verts: {int(prot.sum())}", flush=True)
        else:
            s[prot] = 0.0
            print(f"protected verts (dominant in {sorted(pset)}): {int(prot.sum())}", flush=True)
    print(f"blended verts (s>0): {int((s > 0).sum())}", flush=True)
    # smoothing rounds
    Wc = Wd.copy()
    for it in range(a.iters):
        mean = An @ Wc
        Wc = (1.0 - a.alpha * s[:, None]) * Wc + (a.alpha * s[:, None]) * mean
        Wc = Wc / np.maximum(Wc.sum(1, keepdims=True), 1e-9)
        print(f"  iter {it+1}: mean max-weight {float(Wc.max(1).mean()):.3f}", flush=True)
    # prune + top4 + renormalize
    Wc[Wc < 0.03] = 0
    top = np.argpartition(-Wc, 4, axis=1)[:, :4]
    topw = np.take_along_axis(Wc, top, axis=1)
    order = np.argsort(-topw, axis=1)
    top = np.take_along_axis(top, order, axis=1)
    topw = np.take_along_axis(topw, order, axis=1)
    ss = topw.sum(1, keepdims=True)
    topw = np.where(ss > 0, topw / np.maximum(ss, 1e-9), 0)
    topw[:, 0] = np.where(ss[:, 0] > 0, topw[:, 0], 1.0)
    new_J = top.astype(np.int64); new_W = topw.astype(np.float32)
    # write GLB (same writer pattern as seam_split; new views carry buffer 0)
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
    at2["JOINTS_0"] = add_acc(new_J.astype(np.uint16), "VEC4", 5123)
    at2["WEIGHTS_0"] = add_acc(new_W, "VEC4", 5126)
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
    json.dump({"in": a.inp, "out": a.outp, "threshold": a.threshold,
               "hops": a.hops, "iters": a.iters, "alpha": a.alpha,
               "protect_joints": a.protect_joints, "arm_falloff": a.arm_falloff,
               "seam_verts": int(seam.sum()), "blended_verts": int((s > 0).sum())},
              open(a.outp + ".blend.json", "w"), indent=1)


if __name__ == "__main__":
    main()
