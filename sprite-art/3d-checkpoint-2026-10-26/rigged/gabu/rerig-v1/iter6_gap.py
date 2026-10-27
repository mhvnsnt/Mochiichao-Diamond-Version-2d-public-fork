#!/usr/bin/env python3
"""Gap metric for Iter 5: measure how far cut-duplicated verts separate.

A cut-made dup group = a rest position that appears exactly ONCE in v2 but
>=2 times in Iter 5 (seam_split duplicated it, one copy per piece). At a
deformed frame, the max pairwise distance inside the group IS the slit width
there. Natural coincident verts (present >=2x in v2 already) are excluded.
Gate frames (same as previews): idle 44, ready 14, walk 22, attack 14, hit 3,
faint 44 (indices into sorted unique sampled times).
"""
import sys, json
import numpy as np
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/v2-work")
from fastgate import load, bind_world, skin_frame, anim_channels, eval_world

V2 = "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/v2-fixed/gabu-v2-fixed.glb"
import os
I5 = os.environ.get("CANDIDATE_GLB", "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/rerig-v1/gabu-rerig-v1-cut-t04-lift.glb")
FRAMES = {"idle": 44, "ready": 14, "walk": 22, "attack": 14, "hit": 3, "faint": 44}

def groups_by_rest(pos):
    key = np.round(pos, 4)
    _, inv, counts = np.unique(key, axis=0, return_inverse=True, return_counts=True)
    return inv, counts

print("loading v2...", flush=True)
v2 = load(V2)
_, v2counts = groups_by_rest(v2["pos"])
v2_multi = set(np.nonzero(v2counts >= 2)[0].tolist())
print("v2 rest groups:", len(v2counts), "multi:", len(v2_multi), flush=True)
del v2
print("loading iter5...", flush=True)
m = load(I5)
inv, counts = groups_by_rest(m["pos"])
# map v2 multi-ness onto iter5 groups by matching rounded rest positions
v2keys = None
print("iter5 rest groups:", len(counts), "multi:", int((counts >= 2).sum()), flush=True)
# Recompute v2 keys to test membership: reload positions only (cheap via load again? reuse)
v2 = load(V2)
v2key = set(map(tuple, np.round(v2["pos"], 4)))
# For each iter5 multi group, check whether its rest pos is multi in v2:
# build v2 key->count
from collections import Counter
vc = Counter(map(tuple, np.round(v2["pos"], 4)))
del v2
# iter5 group representative positions
uniq_pos = np.unique(np.round(m["pos"], 4), axis=0)
cut_groups = []
for gi in range(len(counts)):
    if counts[gi] < 2:
        continue
    if vc.get(tuple(uniq_pos[gi]), 0) >= 2:
        continue  # natural coincident, not cut-made
    cut_groups.append(gi)
print("cut-made dup groups:", len(cut_groups), flush=True)
# member indices per cut group
members = {}
for gi in cut_groups:
    members[gi] = np.nonzero(inv == gi)[0]
# rest-state sanity: spreads at bind should be 0
sp0 = []
for gi in cut_groups:
    idx = members[gi]
    P = m["pos"][idx]
    sp0.append(float(np.linalg.norm(P[:, None, :] - P[None, :, :], axis=-1).max()))
print("rest max spread: %.6f (expect 0)" % max(sp0), flush=True)

out = {}
for clip, gi_frame in FRAMES.items():
    anim = next(a for a in m["js"]["animations"] if a.get("name") == clip)
    times, chans = anim_channels(m, anim)
    t = times[gi_frame]
    cur = skin_frame(m, eval_world(m, chans, t))
    spreads = []
    for gi in cut_groups:
        idx = members[gi]
        P = cur[idx]
        spreads.append(float(np.linalg.norm(P[:, None, :] - P[None, :, :], axis=-1).max()))
    spreads = np.array(spreads)
    out[clip] = {"frame": gi_frame, "t": round(float(t), 4), "n_groups": len(spreads),
                 "max_gap_m": round(float(spreads.max()), 4),
                 "p99_gap_m": round(float(np.percentile(spreads, 99)), 4),
                 "mean_gap_m": round(float(spreads.mean()), 4),
                 "n_gt_1cm": int((spreads > 0.01).sum()),
                 "n_gt_5cm": int((spreads > 0.05).sum())}
    print(clip, out[clip], flush=True)
json.dump(out, open("/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/rerig-v1/gap_metric_candidate.json", "w"), indent=1)
print("wrote gap_metric_candidate.json", flush=True)
