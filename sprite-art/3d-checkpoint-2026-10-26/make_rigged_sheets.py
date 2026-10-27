"""Build 64px sheets + manifest from bake_rigged.py renders.
Usage: make_rigged_sheets.py <renders_dir> <slug> <out_dir>
NOT pose variants: every frame is a real skeletal-clip frame from the
v2-fixed rigged GLB. The old bob/tilt pose-variant walk frames for these
two creatures only are superseded by the walk strips built here; the
47 2D-sheet creatures are untouched.
"""
import sys, os, json
from PIL import Image

render_dir, slug, out_dir = sys.argv[1:4]
os.makedirs(out_dir, exist_ok=True)

CLIPS = {
    "dorowani": {"idle": [0, 15, 30, 45], "walk": [0, 10, 20, 30],
                 "ready": [0, 15, 29], "attack": [0, 8, 16, 23],
                 "hit": [0, 5, 10, 20], "faint": [0, 10, 20, 30]},
    "gabu": {"idle": [1, 16, 31, 46], "walk": [1, 8, 16, 23],
             "ready": [1, 15, 30], "attack": [1, 8, 15, 22, 30],
             "hit": [1, 5, 10, 15], "faint": [1, 15, 30, 45]},
}[slug]

def cell(src_name, out_name):
    src = os.path.join(render_dir, src_name)
    im = Image.open(src).convert("RGBA")
    bbox = im.getbbox()
    assert bbox, f"empty render: {src_name}"
    im = im.crop(bbox)
    c = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    s = min(64 / im.width, 64 / im.height)
    nw, nh = max(1, round(im.width * s)), max(1, round(im.height * s))
    c.paste(im.resize((nw, nh), Image.LANCZOS), ((64 - nw) // 2, (64 - nh) // 2),
            im.resize((nw, nh), Image.LANCZOS))
    c.save(os.path.join(out_dir, out_name))
    return c, nw, nh

meta = []
for clip, frames in CLIPS.items():
    views = ("front", "side") if clip == "walk" else ("front",)
    for view in views:
        cells = []
        for fr in frames:
            src = f"{slug}_{clip}_{view}_f{fr}.png"
            out = f"{slug}_{clip}_{view}_f{fr}_64.png"
            c, nw, nh = cell(src, out)
            cells.append(c)
            meta.append({"kind": "rig_baked", "clip": clip, "view": view,
                         "clip_frame": fr, "source_file": src, "file": out,
                         "width": 64, "height": 64,
                         "trimmed_width": nw, "trimmed_height": nh})
        strip = Image.new("RGBA", (64 * len(cells), 64), (0, 0, 0, 0))
        for i, c in enumerate(cells):
            strip.paste(c, (i * 64, 0), c)
        strip.save(os.path.join(out_dir, f"{slug}_{clip}_{view}_strip.png"))
        print(f"strip: {slug}_{clip}_{view}_strip.png {strip.width}x{strip.height}")

manifest = {
    "creature": slug,
    "kind": "rig_baked_sheets_v1",
    "source_glb": f"sprites-bake/rigged/{slug}/v2-fixed/{slug}-v2-fixed.glb",
    "source_glb_version": "v2-fixed",
    "note": "Real skeletal-clip frames. Supersedes the old bob/tilt pose-variant "
            "walk frames for this creature only; the 47 2D-sheet creatures "
            "are untouched. Battle clips (ready/attack/hit/faint) are front "
            "view; walk is front + side.",
    "clips": CLIPS,
    "frames": meta,
}
with open(os.path.join(out_dir, f"{slug}_rigged_sheets_manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=2)
print(f"manifest: {len(meta)} frames")
