#!/usr/bin/env python3
"""Fast gate replicating WH anim_check metrics (p99.9 edge stretch, tearing
spikes, bone-length flags, floor) with joint-wise float32 skinning so a
1.6M-vert mesh fits in ~2GB. Also --diag dumps worst edges at one frame."""
import sys, os, json, argparse
import numpy as np
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/wh-fetch/tools/auto_rig")
from validate import read_glb
from anim_check import read_accessor, node_local_matrix, topo_order, quat_to_mat, sample_channel

def load(path):
    js, bdat = read_glb(path)
    nodes = js["nodes"]
    parent = {}
    for i, nd in enumerate(nodes):
        for c in nd.get("children", []): parent[c] = i
    roots = [i for i in range(len(nodes)) if i not in parent]
    order = topo_order(nodes, roots)
    skin = js["skins"][0]; joints = skin["joints"]
    jnames = [nodes[j].get("name", f"j{j}") for j in joints]
    prim = None
    for mesh in js["meshes"]:
        for pr in mesh["primitives"]:
            if "JOINTS_0" in pr.get("attributes", {}): prim = pr; break
    at = prim["attributes"]
    pos = np.asarray(read_accessor(js, bdat, at["POSITION"]), dtype=np.float32).reshape(-1, 3)
    J = np.asarray(read_accessor(js, bdat, at["JOINTS_0"]), dtype=np.int64).reshape(-1, 4).astype(np.int32)
    W = np.asarray(read_accessor(js, bdat, at["WEIGHTS_0"]), dtype=np.float32).reshape(-1, 4)
    idx = np.asarray(read_accessor(js, bdat, prim["indices"]), dtype=np.int64).reshape(-1) if "indices" in prim else None
    ibm = np.asarray(read_accessor(js, bdat, skin["inverseBindMatrices"]), dtype=np.float64).reshape(-1, 4, 4).transpose(0, 2, 1) if "inverseBindMatrices" in skin else np.repeat(np.eye(4)[None], len(joints), 0)
    # per-joint influence lists
    infl = []
    for ji in range(len(joints)):
        vs, ws = [], []
        for k in range(4):
            m = (J[:, k] == ji) & (W[:, k] > 1e-9)
            if m.any():
                vs.append(np.nonzero(m)[0]); ws.append(W[m, k])
        infl.append((np.concatenate(vs).astype(np.int32) if vs else np.zeros(0, np.int32),
                     np.concatenate(ws).astype(np.float32) if ws else np.zeros(0, np.float32)))
    # edges
    tris = idx.reshape(-1, 3)
    e = np.concatenate([tris[:, [0, 1]], tris[:, [1, 2]], tris[:, [2, 0]]])
    e = np.sort(e, axis=1)
    edges = np.unique(e, axis=0).astype(np.int32)
    return dict(js=js, bdat=bdat, nodes=nodes, parent=parent, order=order, joints=joints,
                jnames=jnames, pos=pos, J=J, W=W, idx=idx, ibm=ibm, infl=infl, edges=edges)

def bind_world(m):
    out = {}
    for i in m["order"]:
        mm = node_local_matrix(m["nodes"][i])
        out[i] = (out[m["parent"][i]] @ mm) if i in m["parent"] else mm
    return out

def skin_frame(m, world):
    """world: dict node->4x4. Returns float32 skinned positions."""
    jidx = m["joints"]
    skin_mats = []
    for k, j in enumerate(jidx):
        skin_mats.append(world[j] @ m["ibm"][k])
    out = np.zeros_like(m["pos"])
    pos = m["pos"]
    for k, (vs, ws) in enumerate(m["infl"]):
        if len(vs) == 0: continue
        S = skin_mats[k]
        R = S[:3, :3].astype(np.float32); t = S[:3, 3].astype(np.float32)
        tr = pos[vs] @ R.T + t
        np.add.at(out, vs, ws[:, None] * tr)
    return out

def anim_channels(m, anim):
    js, bdat = m["js"], m["bdat"]
    chans = []
    for ch in anim.get("channels", []):
        tgt = ch.get("target", {}); node, path = tgt.get("node"), tgt.get("path")
        if node is None or path not in ("translation", "rotation", "scale"): continue
        s = anim["samplers"][ch["sampler"]]
        times = np.asarray(read_accessor(js, bdat, s["input"]), dtype=np.float64).ravel()
        vals = np.asarray(read_accessor(js, bdat, s["output"]), dtype=np.float64)
        per = 3 if path == "translation" else (4 if path == "rotation" else 3)
        mult = 3 if s.get("interpolation") == "CUBICSPLINE" else 1
        vals = vals.reshape(-1, mult * per)
        if s.get("interpolation") == "CUBICSPLINE": vals = vals.reshape(-1, 3, per)
        chans.append((node, path, times, vals, s.get("interpolation", "LINEAR")))
    times = np.unique(np.concatenate([c[2] for c in chans])) if chans else np.array([0.0])
    if len(times) > 120:
        sel = np.linspace(0, len(times) - 1, 120).astype(int); times = times[np.unique(sel)]
    return times, chans

def eval_world(m, chans, t):
    loc = {}
    for i, nd in enumerate(m["nodes"]):
        loc[i] = (np.asarray(nd.get("translation", [0, 0, 0]), float),
                  np.asarray(nd.get("rotation", [0, 0, 0, 1]), float),
                  np.asarray(nd.get("scale", [1, 1, 1]), float),
                  np.asarray(nd["matrix"], float).reshape(4, 4).T if "matrix" in nd else None)
    for node, path, times, vals, interp in chans:
        v = sample_channel(times, vals, path, interp, t)
        tr, ro, sc, mx = loc[node]
        if path == "translation": tr = v
        elif path == "rotation": ro = v
        else: sc = v
        loc[node] = (tr, ro, sc, None)
    world = {}
    for i in m["order"]:
        tr, ro, sc, mx = loc[i]
        if mx is not None: mm = mx
        else:
            mm = np.eye(4); mm[:3, :3] = quat_to_mat(ro) * sc; mm[:3, 3] = tr
        world[i] = (world[m["parent"][i]] @ mm) if i in m["parent"] else mm
    return world

def check_clip(m, anim, diag_frame=None):
    name = anim.get("name", "?")
    times, chans = anim_channels(m, anim)
    bind = bind_world(m)
    rest = skin_frame(m, bind)
    maxdiff = float(np.abs(rest - m["pos"]).max())
    height = float((rest.max(0) - rest.min(0)).max())
    edge_min = max(0.001, 0.005 * height)
    rest_e = np.linalg.norm(rest[m["edges"][:, 0]] - rest[m["edges"][:, 1]], axis=1)
    keep = rest_e >= edge_min
    edges = m["edges"][keep]; rest_e = rest_e[keep]
    n_edge = len(edges)
    tops = []  # per-frame top 5% ratios
    per_frame = []
    prev = None; spikes = []; max_disp = 0.0; miny = []
    diag = None
    for fi, t in enumerate(times):
        world = eval_world(m, chans, t)
        cur = skin_frame(m, world)
        miny.append(float(cur[:, 1].min()))
        el = np.linalg.norm(cur[edges[:, 0]] - cur[edges[:, 1]], axis=1)
        ratio = el / rest_e
        per_frame.append({"t": round(float(t), 4), "p999": round(float(np.percentile(ratio, 99.9)), 3),
                          "max": round(float(ratio.max()), 3), "minY": round(float(cur[:, 1].min()), 4)})
        k = max(1000, int(0.05 * len(ratio)))
        tops.append(np.partition(ratio, len(ratio) - k)[len(ratio) - k:])
        if prev is not None:
            disp = np.linalg.norm(cur - prev, axis=1)
            med = float(np.median(disp)); md = float(disp.max())
            max_disp = max(max_disp, md)
            bad = np.nonzero((disp > 0.35) | ((disp > 8.0 * med) & (disp > 0.10)))[0]
            for v in bad[:10]:
                wrow = m["W"][v]; jrow = m["J"][v]
                nz = wrow > 1e-4
                spikes.append({"frame": fi, "time": round(float(t), 4), "vertex": int(v),
                               "disp_m": round(float(disp[v]), 4), "frame_median_m": round(med, 5),
                               "pos_rest": [round(float(x), 3) for x in rest[v]],
                               "joints": [m["jnames"][int(jrow[i])] for i in np.nonzero(nz)[0][:4]],
                               "weights": [round(float(wrow[i]), 3) for i in np.nonzero(nz)[0][:4]]})
        if diag_frame is not None and fi == diag_frame:
            worst = np.argsort(ratio)[-100:][::-1]
            diag = {"frame": fi, "time": round(float(t), 4), "edges": []}
            for ei in worst:
                a, b = int(edges[ei][0]), int(edges[ei][1])
                def vinfo(v):
                    wrow = m["W"][v]; jrow = m["J"][v]; nz = wrow > 1e-4
                    return {"v": v, "rest": [round(float(x), 3) for x in rest[v]],
                            "def": [round(float(x), 3) for x in cur[v]],
                            "joints": [m["jnames"][int(jrow[i])] for i in np.nonzero(nz)[0][:4]],
                            "weights": [round(float(wrow[i]), 3) for i in np.nonzero(nz)[0][:4]]}
                diag["edges"].append({"ratio": round(float(ratio[ei]), 3), "rest_len": round(float(rest_e[ei]), 4),
                                      "a": vinfo(a), "b": vinfo(b)})
        prev = cur
    alltop = np.concatenate(tops)
    # global p99.9: rank in full set; top buffer holds >= top 5% per frame, so global top 0.1% is inside
    total = n_edge * len(times)
    rank = int(np.ceil(0.999 * total))
    # number of ratios >= threshold: approximate from buffer: values in buffer sorted desc; global p999 is the (total-rank+1)-th largest
    srt = np.sort(alltop)[::-1]
    need = total - rank + 1  # how many largest values are >= p999
    p999 = float(srt[need - 1]) if need <= len(srt) else float(srt[-1])
    # bone length flags (replicate anim_check, unrounded rest for zero-length analysis)
    jp = {j: bind[j][:3, 3] for j in m["joints"]}
    jset = set(m["joints"])
    pairs = []
    for j in m["joints"]:
        for c in m["nodes"][j].get("children", []):
            if c in jset: pairs.append((m["nodes"][j].get("name"), m["nodes"][c].get("name"), j, c))
    rest_len = {(p, c): float(np.linalg.norm(jp[cc] - jp[pp])) for p, c, pp, cc in pairs}
    bmin = {k: float("inf") for k in rest_len}; bmax = {k: 0.0 for k in rest_len}; bsum = {k: 0.0 for k in rest_len}
    for t in times:
        w = eval_world(m, chans, t)
        posd = {j: w[j][:3, 3] for j in m["joints"]}
        for p, c, pp, cc in pairs:
            L = float(np.linalg.norm(posd[cc] - posd[pp])); k = (p, c)
            bmin[k] = min(bmin[k], L); bmax[k] = max(bmax[k], L); bsum[k] += L
    bone_flags = []
    for (p, c), r in rest_len.items():
        if r < 1e-9: bone_flags.append({"bone": f"{p}->{c}", "rest_m": r, "note": "zero-length (skipped by stock gate)"}); continue
        var = (bmax[(p, c)] - bmin[(p, c)]) / r; mean = bsum[(p, c)] / max(len(times), 1); rd = abs(mean - r) / r
        if var > 0.02 or rd > 0.02:
            bone_flags.append({"bone": f"{p}->{c}", "rest_m": round(r, 6), "var": round(var, 4), "rest_dev": round(rd, 4)})
    return {"clip": name, "frames": len(times), "rest_vs_authored_maxdiff": round(maxdiff, 6),
            "model_height_m": round(height, 3), "edge_min_m": round(edge_min, 4), "edges_checked": n_edge,
            "edge_p999": round(p999, 3), "edge_max": round(float(np.concatenate([np.array([pf["max"]]) for pf in per_frame]).max()), 3) if per_frame else None,
            "per_frame": per_frame, "spikes": spikes, "spike_count_capped": len(spikes),
            "max_disp_m": round(max_disp, 4), "minY_per_frame": miny,
            "bone_flags": bone_flags, "diag": diag}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("glb"); ap.add_argument("--out", required=True)
    ap.add_argument("--clip", default=None); ap.add_argument("--diag-frame", type=int, default=None)
    ap.add_argument("--diag-clip", default=None)
    a = ap.parse_args()
    m = load(a.glb)
    print(f"loaded {a.glb}: {len(m['pos'])} verts, {len(m['edges'])} unique edges, {len(m['joints'])} joints", flush=True)
    out = {"file": a.glb, "clips": {}}
    for anim in m["js"].get("animations", []):
        nm = anim.get("name", "?")
        if a.clip and nm != a.clip: continue
        df = a.diag_frame if (a.diag_clip == nm) else None
        print(f"  clip {nm} ...", flush=True)
        r = check_clip(m, anim, diag_frame=df)
        out["clips"][nm] = r
        print(f"    {nm}: p999={r['edge_p999']} max={r['edge_max']} spikes(capped)={len(r['spikes'])} max_disp={r['max_disp_m']} minYmin={min(r['minY_per_frame']):.4f} bone_flags={len(r['bone_flags'])}", flush=True)
    json.dump(out, open(a.out, "w"), indent=1)
    print("wrote", a.out)

if __name__ == "__main__":
    main()
