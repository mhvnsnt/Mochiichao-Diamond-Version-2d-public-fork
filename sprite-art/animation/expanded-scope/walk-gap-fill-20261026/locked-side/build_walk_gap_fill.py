"""Walk-gap-fill builder (Razorgater method): pixel-identical copies of each
creature's OWN walk-frames left pair -> staged locked-side cells.
No drawing, no generation, no palette edits, no locked-atlas/manifest writes.
Run from sprite-art/. Outputs per-creature cells + before/after sheet + GIF + manifest."""
import json, hashlib, shutil, os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))  # locked-side/
ROOT = os.path.abspath(os.path.join(BASE, "..", "..", "..", ".."))  # sprite-art/
OUT = BASE
CREATURES = {
    "cocoonode":  {"roster": "017", "next": [11, 12], "front_file": "cocoonode_cell_02.png",
        "shadow": "Crystal point tapers rows 56-63 (15->0 px); no detached shadow ellipse. No baked shadow.",
        "caveat": "walk.json: faceless crystal; sides reuse the front cell with a 6% scale pulse (1.00 vs 1.06), no leg walk. Promoted as-is, not a newly drawn profile."},
    "inklet":     {"roster": "026", "next": [11, 12], "front_file": "inklet_cell_01.png",
        "shadow": "Jar base occupies rows 56-63 (jar body itself, same base as the down frame); no separate shadow ellipse beneath the jar. No baked shadow.",
        "caveat": "walk.json: jar identical in all directions; direction reads only from the octopus inside (face/profile). Left pair shows the profile octopus."},
    "oblivirex":  {"roster": "009", "next": [14, 15], "front_file": "oblivirex_cell_03.png",
        "shadow": "Body bbox ends y56; ZERO pixels in rows 56-63. No baked shadow. walk.json style_note also states no baked shadow in shipped cells.",
        "caveat": "walk.json movement: heavy_slow. Left pair is a genuine quadruped side profile (original 8-panel sheet)."},
    "pixilite":   {"roster": "041", "next": [12, 13], "front_file": "pixilite_cell_04.png",
        "shadow": "Bottom rows are feet/body (rows 56-59 ~28-31 px, tapering to 12 at row 63); no detached shadow ellipse. No baked shadow.",
        "caveat": "walk.json: faceless by design; side reads via single leaf arm + splayed feet. Left pair promoted as-is."},
    "pyropaw":    {"roster": "011", "next": [15, 16], "front_file": "pyropaw_cell_02.png",
        "shadow": "Bottom rows are legs/paws (rows 56-63 ~36->11 px); no detached shadow ellipse. No baked shadow.",
        "caveat": "walk.json: side phase pairs clearly alternate quadruped trot. Left pair is a genuine side trot (original 8-panel sheet)."},
    "shellguard": {"roster": "039", "next": [13, 14], "front_file": "shellguard_cell_03.png",
        "shadow": "Body bbox ends y62; rows 62-63 ZERO; rows 56-61 are legs/feet (21->8 px taper). No baked shadow. walk.json style_note also states no baked shadow in shipped cells.",
        "caveat": "walk.json movement: grounded_standard; all 4 directions with alternating legs. NOTE: locked manifest frame_count=13 but frames list has 14 entries (last cell id 'icon_derived'); staged cells 13/14 follow the highest numeric cell (12), NOT the frame_count field. A future lock amendment must reconcile that pre-existing discrepancy."},
    "wispkin":    {"roster": "042", "next": [10, 11], "front_file": "wispkin_cell_01.png",
        "shadow": "Bottom rows are the wisp's own smoke trail (body effect, 7->0 px); hover creature, no ground shadow; rows 62-63 zero. No baked shadow.",
        "caveat": "walk.json: hover bob (0 vs -3px); sides are tilt variants of the front cell (no locked side cell exists). Promoted as-is, not a newly drawn profile."},
}
BG = (40, 40, 46, 255)
DARK = (20, 20, 24, 255)
def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()
def font(bold, size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except Exception:
        return ImageFont.load_default()
def wrap(draw, text, fnt, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

combined = {"date": "2026-10-26", "status": "STAGED ONLY, show-first, NO PR, NO lock, NO overwrite of locked atlases/manifests",
            "method": "Razorgater method: pixel-identical copies of each creature's OWN walk-frames left pair; NOT newly drawn poses, NOT another creature's cells. No generation performed, so the likeness-generation rule was not triggered.",
            "cells_built": 0, "cells_target": 14, "creatures": {}}
for c, info in CREATURES.items():
    cdir = os.path.join(OUT, c); os.makedirs(cdir, exist_ok=True)
    cells = []
    for i, role in enumerate(["overworld_side", "overworld_side_2"]):
        src = os.path.join(ROOT, "walk-frames", c, f"{c}_walk_left_{i}.png")
        dst_name = f"{c}_walk_side_{i}_20261026.png"
        dst = os.path.join(cdir, dst_name)
        shutil.copyfile(src, dst)
        im = Image.open(dst).convert("RGBA")
        assert im.size == (64, 64), (c, im.size)
        cells.append({"cell": info["next"][i], "role": role, "file": dst_name, "size": "64x64 RGBA",
                      "source": f"walk-frames/{c}/{c}_walk_left_{i}.png",
                      "source_md5": md5(src), "cell_md5": md5(dst),
                      "pixel_identical": md5(src) == md5(dst), "bbox": list(im.getbbox())})
        assert cells[-1]["pixel_identical"]
    # GIF: 2 frames at 3x on dark bg, 300ms/frame (Razorgater precedent)
    frames = []
    for i in range(2):
        tile = Image.new("RGBA", (192, 192), BG)
        tile.alpha_composite(Image.open(os.path.join(cdir, f"{c}_walk_side_{i}_20261026.png")).convert("RGBA").resize((192, 192), Image.NEAREST))
        frames.append(tile.convert("P", palette=Image.ADAPTIVE))
    gif_path = os.path.join(cdir, f"{c}-walk-cycle-20261026.gif")
    frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=300, loop=0)
    # Before/after sheet
    front = Image.open(os.path.join(ROOT, "game-ready", c, "cells", info["front_file"])).convert("RGBA")
    def tile3(im):
        t = Image.new("RGBA", (192, 192), BG); t.alpha_composite(im.resize((192, 192), Image.NEAREST)); return t
    body_lines = []
    W = 860
    d_probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    fb, fs = font(True, 20), font(False, 17)
    for txt, fnt in [("Provenance (plain): new cells are pixel-identical copies of this creature's OWN walk-frames left pair -- NOT newly drawn poses, NOT another creature's cells.", fs),
                     ("Shadow check: " + info["shadow"], fs),
                     ("Pose caveat (from walk.json, not changed): " + info["caveat"], fs),
                     (f"Roles: cell {info['next'][0]} = overworld_side, cell {info['next'][1]} = overworld_side_2. 64x64 RGBA. STAGED ONLY -- no PR, no lock, show-first.", fs),
                     ("Locked atlas + locked manifest untouched. No face changes (copy). No palette invention: 0 new colours vs the creature's own walk-frames source (md5-identical).", fs)]:
        body_lines += wrap(d_probe, txt, fnt, W - 40)
    H = 40 + 26 + 8 + 26 + 192 + 20 + 26 + 192 + 20 + len(body_lines) * 22 + 20
    sheet = Image.new("RGB", (W, H), (20, 20, 24)); d = ImageDraw.Draw(sheet)
    ft, fst = font(True, 28), font(False, 18)
    _title = f"{c.upper()} -- NEW LOCKED SIDE CELLS (before / after)"
    while d.textlength(_title, font=ft) > W - 40 and ft.size > 18:
        ft = font(True, ft.size - 2)
    d.text((20, 8), _title, fill=(255, 220, 80), font=ft)
    y = 48
    d.text((20, y), "BEFORE (locked): no side cell -- front stand-in + BLANK side slot", fill=(255, 120, 120), font=fst); y += 26
    sheet.paste(tile3(front), (20, y)); sheet.paste(Image.new("RGBA", (192, 192), BG), (228, y))
    y += 192 + 20
    d.text((20, y), "AFTER (new): walk_side_0 + walk_side_1 -- own walk-left pair, pixel-identical", fill=(120, 255, 140), font=fst); y += 26
    for i in range(2):
        sheet.paste(tile3(Image.open(os.path.join(cdir, f"{c}_walk_side_{i}_20261026.png")).convert("RGBA")), (20 + i * 208, y))
    y += 192 + 20
    for ln in body_lines:
        d.text((20, y), ln, fill=(230, 230, 230), font=fs); y += 22
    sheet.save(os.path.join(cdir, f"{c}-walk-before-after-20261026.png"))
    manifest = {"creature": c, "roster_id": info["roster"], "date": "2026-10-26",
                "status": "STAGED ONLY, show-first, no PR, no lock",
                "fills": "Locked-manifest side gap: 0 walk_side/overworld_side roles before; 2 new cells now staged",
                "cells": cells,
                "format_note": "Matches locked sheet format: 64x64 RGBA cells, roles overworld_side / overworld_side_2 (same convention as dorowani, ashemit, finblade). Does NOT modify the locked atlas or locked manifest -- new dated files + this manifest only.",
                "provenance_honest": "Promoted from the creature's own existing side-stride frames, NOT newly drawn poses. If Mars wants newly drawn side poses instead, that is a follow-up order.",
                "shadow_check": info["shadow"], "pose_caveat": info["caveat"],
                "palette_note": "0 new colours vs the creature's own walk-frames source (pixel-identical copy, md5-verified). Colours not present in the locked cells dir are the walk-frames palette itself, not invented here; see combined report for per-creature counts.",
                "gif": f"{c}-walk-cycle-20261026.gif (2 frames at 3x, 300ms/frame -- preview timing only, not a game timing claim)",
                "before_after": f"{c}-walk-before-after-20261026.png"}
    json.dump(manifest, open(os.path.join(cdir, f"{c}-walk-cells-manifest-20261026.json"), "w"), indent=1)
    combined["creatures"][c] = manifest
    combined["cells_built"] += 2
    print(c, "cells", [x["cell_md5"][:8] for x in cells], "gif+sheet ok")
json.dump(combined, open(os.path.join(OUT, "walk-gap-fill-manifest-20261026.json"), "w"), indent=1)
print("TOTAL", combined["cells_built"], "/", combined["cells_target"])
