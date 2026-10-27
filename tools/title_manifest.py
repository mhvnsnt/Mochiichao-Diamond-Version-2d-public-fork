#!/usr/bin/env python3
"""Title lane manifest builder (production pipeline, staging -> repo tools/).
Walks given roots, records path, kind, bytes, sha256, dimensions (PNG),
duration/fps/frames (video via ffprobe when available). Deterministic order.
No Pokemon art, no logo, no audio is checked here — see title_verify.py.
Usage: title_manifest.py <root...> <out.json>
"""
import hashlib, json, os, subprocess, sys
from PIL import Image
def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""): h.update(b)
    return h.hexdigest()
def probe(p):
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height,r_frame_rate,nb_frames,duration",
            "-show_entries", "format=duration", "-of", "json", p],
            capture_output=True, text=True, timeout=60).stdout
        d = json.loads(out); s = (d.get("streams") or [{}])[0]
        return {"width": s.get("width"), "height": s.get("height"),
                "fps": s.get("r_frame_rate"), "frames": s.get("nb_frames"),
                "duration": d.get("format", {}).get("duration")}
    except Exception as e:
        return {"error": str(e)}
def main():
    roots, out = sys.argv[1:-1], sys.argv[-1]
    items = []
    for root in roots:
        for dp, _, names in os.walk(root):
            for n in sorted(names):
                p = os.path.join(dp, n)
                if n.endswith(".pyc") or "__pycache__" in p: continue
                it = {"path": os.path.relpath(p, root), "bytes": os.path.getsize(p), "sha256": sha(p)}
                if n.lower().endswith(".png"):
                    try:
                        with Image.open(p) as im: it.update({"kind": "png", "width": im.width, "height": im.height, "mode": im.mode})
                    except Exception as e: it.update({"kind": "png", "error": str(e)})
                elif n.lower().endswith(".mp4"):
                    it.update({"kind": "mp4"}); it.update(probe(p))
                elif n.lower().endswith((".gif",)):
                    it.update({"kind": "gif"})
                else:
                    it.update({"kind": os.path.splitext(n)[1].lstrip(".") or "file"})
                items.append(it)
    items.sort(key=lambda x: x["path"])
    with open(out, "w") as f: json.dump({"files": items, "count": len(items),
        "total_bytes": sum(i["bytes"] for i in items)}, f, indent=2)
    print(f"{len(items)} files, {sum(i['bytes'] for i in items)} bytes -> {out}")
if __name__ == "__main__": main()
