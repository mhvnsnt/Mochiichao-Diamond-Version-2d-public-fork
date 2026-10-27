"""Build 64x64 sprite sheets from 256px Blender renders.
Usage: make_sheets.py <render_dir> <slug> <front_angle> <back_angle> <side_angle> <out_dir>
Angles are e.g. angle90. Produces individual 64x64 PNGs per view, a
horizontal strip sheet (front, back, side), and a JSON manifest.
Walk frames are NOT produced here — the source models are static poses.
"""
import sys, os, json
from PIL import Image

render_dir, slug, front_a, back_a, side_a, out_dir = sys.argv[1:7]
os.makedirs(out_dir, exist_ok=True)
views = [("front", front_a), ("back", back_a), ("side", side_a)]
frames = []
cells = []
for view, angle in views:
    src = os.path.join(render_dir, f"{slug}_{angle}.png")
    im = Image.open(src).convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    # Fit inside 64x64, preserving aspect, centred on transparent canvas
    cell = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    scale = min(64 / im.width, 64 / im.height)
    nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
    im2 = im.resize((nw, nh), Image.LANCZOS)
    cell.paste(im2, ((64 - nw) // 2, (64 - nh) // 2), im2)
    out = os.path.join(out_dir, f"{slug}_{view}_64.png")
    cell.save(out)
    cells.append(cell)
    frames.append({
        "view": view, "source_angle": angle, "source_file": os.path.basename(src),
        "file": os.path.basename(out), "x": len(frames) * 64, "y": 0,
        "width": 64, "height": 64,
        "trimmed_width": nw, "trimmed_height": nh,
    })
    print(f"{view}: {src} -> {out} ({nw}x{nh} inside 64x64)")

sheet = Image.new("RGBA", (64 * len(cells), 64), (0, 0, 0, 0))
for i, c in enumerate(cells):
    sheet.paste(c, (i * 64, 0), c)
sheet_path = os.path.join(out_dir, f"{slug}_sheet.png")
sheet.save(sheet_path)
print(f"sheet: {sheet_path} {sheet.width}x{sheet.height}")

manifest = {
    "creature": slug,
    "roster_id": None,
    "roster_note": "Unnumbered — do NOT assign 047/048 without Mars's say-so.",
    "source": "Mars's own Tripo model, baked from GLB (not loaded raw in game)",
    "game_rule": "looks 3D, runs 2D — game eats only these 2D sheets",
    "cell_size": 64,
    "sheet": {"file": os.path.basename(sheet_path), "width": sheet.width, "height": sheet.height},
    "frames": frames,
    "views_done": ["front", "back", "side"],
    "views_missing": [
        "walk frames (all directions) — source models are static poses, no walk animation baked",
        "battle poses distinct from front/back — first pass reuses front (opponent) / back (player) battle views",
        "side facing the other direction — mirror the side frame in game code until a second side is baked",
    ],
    "notes": "Renders are 256px EEVEE transparent PNGs trimmed and downscaled to fit 64x64. Back/side lighting is darker on some angles (single key sun); front/back/side used here are readable.",
}
mpath = os.path.join(out_dir, f"{slug}.manifest.json")
with open(mpath, "w") as f:
    json.dump(manifest, f, indent=2)
print(f"manifest: {mpath}")
