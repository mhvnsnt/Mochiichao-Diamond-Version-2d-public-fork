#!/usr/bin/env python3
"""Iter 5: re-derive the faint settle lift for the combined (rerig-v1 + cut) file.

Why: the v2 settle lift (Hips-Y pose edits) was tuned to v2's weights. After
re-weighting + piece-mean, held faint frames sink to -0.0446..-0.0617 because
the lowest verts' Hips share changed (piece means diluted ToeBase 0.78 -> 0.52
and pulled foot-sole verts toward Leg). The fix is a POSE edit, not a weight
edit: pure Hips translation shifts every descendant vert equally, so it
changes minY EXACTLY by the lift and NEVER changes edge stretch (same
mechanism as the original v2 settle lift).

Method: read minY per sampled time from gate_combined_faint.json; lift the
last 13 sampled times (held frames 32-44) to exactly 0.0, with a 5-frame
linear ramp before them to avoid a pop. Only faint's Hips translation
channel is edited (new accessor; other clips untouched even if shared).
Root rotation must be identity at all faint times (asserted) so that
Hips-local Y == world Y.
"""
import sys, os, json, struct, copy
import numpy as np

sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/wh-fetch/tools/auto_rig")
from validate import read_glb
from anim_check import read_accessor

BASE = "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/rerig-v1"
SRC = os.environ.get("LIFT_SRC", os.path.join(BASE, "gabu-rerig-v1-cut-t04.glb"))
OUT = os.environ.get("LIFT_OUT", os.path.join(BASE, "gabu-rerig-v1-cut-t04-lift.glb"))
js, bdat = read_glb(SRC)
nodes = js["nodes"]
gate = json.load(open(os.environ.get("LIFT_GATE", os.path.join(BASE, "gate_combined_faint.json"))))
pf = gate["clips"]["faint"]["per_frame"]
times_g = np.array([p["t"] for p in pf])
miny_g = np.array([p["minY"] for p in pf])
print(f"gate frames: {len(pf)}, held last13 minY: {[round(x, 4) for x in miny_g[-13:]]}", flush=True)

anim = next(a for a in js["animations"] if a.get("name") == "faint")
hips_node = next(i for i, nd in enumerate(nodes) if nd.get("name") == "Hips")
root_node = next(i for i, nd in enumerate(nodes) if nd.get("name") == "Root")
chan = None
for ch in anim["channels"]:
    t = ch.get("target", {})
    if t["node"] == hips_node and t["path"] == "translation":
        chan = ch; break
assert chan is not None
s = anim["samplers"][chan["sampler"]]
htimes = np.asarray(read_accessor(js, bdat, s["input"]), dtype=np.float64).ravel()
hvals = np.asarray(read_accessor(js, bdat, s["output"]), dtype=np.float32).reshape(-1, 3).copy()
print(f"Hips translation samples: {len(htimes)}", flush=True)
# Root rotation identity check
for ch2 in anim["channels"]:
    t = ch2.get("target", {})
    if t["node"] == root_node and t["path"] == "rotation":
        s2 = anim["samplers"][ch2["sampler"]]
        rvals = np.asarray(read_accessor(js, bdat, s2["output"]), dtype=np.float64).reshape(-1, 4)
        dev = np.abs(rvals - np.array([0, 0, 0, 1])).max()
        print(f"Root rotation max dev from identity: {dev:.2e}", flush=True)
        assert dev < 1e-6
# lift per Hips sample time (exact match to gate times within 1e-3)
lift = np.zeros(len(htimes), dtype=np.float64)
n = len(htimes)
held_start = n - 13
for i, t in enumerate(htimes):
    j = np.argmin(np.abs(times_g - t))
    assert abs(times_g[j] - t) < 1e-3, (t, times_g[j])
    my = miny_g[j]
    if i >= held_start:
        lift[i] = -min(my, 0.0)
    elif i >= held_start - 5:
        frac = (i - (held_start - 5) + 1) / 6.0
        lift[i] = frac * (-min(miny_g[np.argmin(np.abs(times_g - htimes[held_start]))], 0.0))
print("lift per sample (last 20):", [round(float(x), 4) for x in lift[-20:]], flush=True)
hvals[:, 1] += lift.astype(np.float32)
# write new GLB: new Hips translation accessor for faint only
js2 = copy.deepcopy(js)
orig_bin = bytes(bdat)
chunks = [orig_bin]
off = len(orig_bin)
b = np.ascontiguousarray(hvals).tobytes()
pad = (-len(b)) % 4
chunks.append(b + b"\x00" * pad)
bv = {"buffer": 0, "byteOffset": off, "byteLength": len(b)}
off += len(b) + pad
js2["bufferViews"].append(bv)
acc = {"bufferView": len(js2["bufferViews"]) - 1, "componentType": 5126,
       "count": len(hvals), "type": "VEC3",
       "min": [float(x) for x in hvals.min(0)], "max": [float(x) for x in hvals.max(0)]}
js2["accessors"].append(acc)
new_acc = len(js2["accessors"]) - 1
anim2 = next(a for a in js2["animations"] if a.get("name") == "faint")
for ch2 in anim2["channels"]:
    t = ch2.get("target", {})
    if t["node"] == hips_node and t["path"] == "translation":
        anim2["samplers"][ch2["sampler"]]["output"] = new_acc
js2["buffers"] = [{"byteLength": off}]
jbytes = json.dumps(js2, separators=(",", ":")).encode()
jbytes += b" " * ((-len(jbytes)) % 4)
total = 12 + 8 + len(jbytes) + 8 + off
with open(OUT, "wb") as f:
    f.write(struct.pack("<III", 0x46546C67, 2, total))
    f.write(struct.pack("<II", len(jbytes), 0x4E4F534A)); f.write(jbytes)
    f.write(struct.pack("<II", off, 0x004E4942))
    for c in chunks: f.write(c)
print("wrote", OUT, os.path.getsize(OUT), "bytes", flush=True)
json.dump({"src": SRC, "out": OUT, "lift_last20": [round(float(x), 4) for x in lift[-20:]],
           "held_minY_before": [round(float(x), 4) for x in miny_g[-13:]]},
          open(os.path.join(BASE, "iter5_lift.json"), "w"), indent=1)
