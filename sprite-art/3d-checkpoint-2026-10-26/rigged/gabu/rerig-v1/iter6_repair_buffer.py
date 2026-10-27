import sys, json, struct
sys.path.insert(0, "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/wh-fetch/tools/auto_rig")
from validate import read_glb
p = "/home/hatch/workspace/mochiichao-work/sprites-bake/rigged/gabu/rerig-v1/gabu-iter6-keep4-lift.glb"
js, bdat = read_glb(p)
fixed = [i for i, bv in enumerate(js["bufferViews"]) if "buffer" not in bv]
for i in fixed:
    js["bufferViews"][i]["buffer"] = 0
print("fixed bufferViews:", fixed)
jbytes = json.dumps(js, separators=(",", ":")).encode()
jbytes += b" " * ((-len(jbytes)) % 4)
total = 12 + 8 + len(jbytes) + 8 + len(bdat)
with open(p, "wb") as f:
    f.write(struct.pack("<III", 0x46546C67, 2, total))
    f.write(struct.pack("<II", len(jbytes), 0x4E4F534A)); f.write(jbytes)
    f.write(struct.pack("<II", len(bdat), 0x004E4942)); f.write(bytes(bdat))
print("rewrote", p)
