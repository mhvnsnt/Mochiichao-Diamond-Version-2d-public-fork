"""Build v2 sheets from bake_v2.py renders.
Usage: make_sheets_v2.py <render_dir> <slug> <out_dir>
Produces: 64x64 frames for neutral front/back/side, walk strips (4 frames per
direction: front/back/side), battle strips (ready/attack/recoil per front/back),
a neutral 192x64 sheet, and a JSON manifest v2.
Walk/battle frames are whole-body pose variants of an unrigged static model —
NOT skeletal limb animation. The manifest says so explicitly.
"""
import sys, os, json
from PIL import Image

render_dir, slug, out_dir = sys.argv[1:4]
os.makedirs(out_dir, exist_ok=True)

def frame(src_name, out_name):
    src = os.path.join(render_dir, src_name)
    im = Image.open(src).convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    cell = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    scale = min(64 / im.width, 64 / im.height)
    nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
    im2 = im.resize((nw, nh), Image.LANCZOS)
    cell.paste(im2, ((64 - nw) // 2, (64 - nh) // 2), im2)
    out = os.path.join(out_dir, out_name)
    cell.save(out)
    return cell, nw, nh

def strip(cells, out_name):
    sheet = Image.new("RGBA", (64 * len(cells), 64), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        sheet.paste(c, (i * 64, 0), c)
    out = os.path.join(out_dir, out_name)
    sheet.save(out)
    print(f"strip: {out} {sheet.width}x{sheet.height}")
    return out

frames_meta = []

# Neutral views: front=angle90, back=angle270, side=angle0 (Dorowani/Gabu mapping)
neutral = []
for view, ang in (("front", "angle90"), ("back", "angle270"), ("side", "angle0")):
    cell, nw, nh = frame(f"{slug}_{ang}.png", f"{slug}_{view}_64.png")
    neutral.append(cell)
    frames_meta.append({"kind": "neutral", "view": view, "source_angle": ang,
                        "source_file": f"{slug}_{ang}.png",
                        "file": f"{slug}_{view}_64.png", "width": 64, "height": 64,
                        "trimmed_width": nw, "trimmed_height": nh})
strip(neutral, f"{slug}_sheet_v2.png")

# Walk strips
for direction, ang in (("front", "angle90"), ("back", "angle270"), ("side", "angle0")):
    cells = []
    for w in ("w0", "w1", "w2", "w3"):
        cell, nw, nh = frame(f"{slug}_walk_{direction}_{w}.png",
                             f"{slug}_walk_{direction}_{w}_64.png")
        cells.append(cell)
        frames_meta.append({"kind": "walk_pose_variant", "view": direction,
                            "walk_frame": w,
                            "source_file": f"{slug}_walk_{direction}_{w}.png",
                            "file": f"{slug}_walk_{direction}_{w}_64.png",
                            "width": 64, "height": 64,
                            "trimmed_width": nw, "trimmed_height": nh})
    strip(cells, f"{slug}_walk_{direction}_strip.png")

# Battle strips
for direction, ang in (("front", "angle90"), ("back", "angle270")):
    cells = []
    for pose in ("battle_ready", "battle_attack", "battle_recoil"):
        cell, nw, nh = frame(f"{slug}_{pose}_{direction}.png",
                             f"{slug}_{pose}_{direction}_64.png")
        cells.append(cell)
        frames_meta.append({"kind": "battle_pose_variant", "view": direction,
                            "battle_pose": pose,
                            "source_file": f"{slug}_{pose}_{direction}.png",
                            "file": f"{slug}_{pose}_{direction}_64.png",
                            "width": 64, "height": 64,
                            "trimmed_width": nw, "trimmed_height": nh})
    strip(cells, f"{slug}_{direction}_battle_strip.png")

manifest = {
    "creature": slug,
    "version": "bake-v2",
    "source": "Mars's own Tripo model, baked from GLB (not loaded raw in game)",
    "game_rule": "looks 3D, runs 2D — game eats only these 2D sheets",
    "cell_size": 64,
    "lighting": "v2: key sun 3.5 + secondary 2.2 + back fill 2.2 + side fill 2.0 + top rim 2.8 + back rim 1.5 + world ambient 0.45 — back/side no longer darker than front (verify by eye)",
    "view_mapping": "Dorowani/Gabu mapping: front=angle90, back=angle270, side=angle0, other-side=angle180. NOT the Megalochrome mapping.",
    "honest_limit": "Walk and battle frames are WHOLE-BODY pose variants (bob, lean, tilt, shift) of an unrigged static Tripo model. They are NOT skeletal limb animation and must never be described as limb-animated walking.",
    "neutral_sheet": {"file": f"{slug}_sheet_v2.png", "width": 192, "height": 64},
    "walk_strips": {d: f"{slug}_walk_{d}_strip.png" for d in ("front", "back", "side")},
    "battle_strips": {d: f"{slug}_{d}_battle_strip.png" for d in ("front", "back")},
    "frames": frames_meta,
    "views_done": ["front", "back", "side", "other-side (angle180 neutral render)",
                   "walk pose variants front/back/side (4 frames each)",
                   "battle poses front/back (ready, attack, recoil)"],
    "views_missing": ["true limb-animated walk cycles (impossible on unrigged static)",
                      "side facing the other direction as a walk/battle strip (mirror side frames in game code)"],
}
mpath = os.path.join(out_dir, f"{slug}.manifest-v2.json")
with open(mpath, "w") as f:
    json.dump(manifest, f, indent=2)
print(f"manifest: {mpath}")
