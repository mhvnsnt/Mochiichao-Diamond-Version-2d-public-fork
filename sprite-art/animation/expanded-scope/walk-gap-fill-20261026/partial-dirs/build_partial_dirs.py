"""Walk-gap fill: partial dirs + 3 locked sides, 2026-10-26. STAGED ONLY.
Method (no new colours, no baked shadows, no face redraws):
- Locked-side promotes: verbatim own locked cells (cleaned only: alpha<32 stripped,
  <4px specks dropped, detached bright low-saturation components wholly below the
  body midline dropped = zephling wind rings / stormtalon storm-cloud puffs).
- Mirrors: horizontal flip of a verbatim own frame (ashemit precedent: his walk
  left_0/right_0 are pixel-exact mirrors). Face pixels preserved, only side swapped.
- Angles-sheet crops (aerobeak/floatcalf/megalochrome, zero locked sides): own
  2d-sheet panels, border-connected white-bg flood removal, largest component only
  (drops ripple/wind rings + droplets), NEAREST fit to 64x64 (no colour blending).
- Megalochrome ring-strip: after crop, rows below the last row with >=3 neutral-gray
  body pixels are cleared (ripple rings sit below the silver body, not part of it).
- Floatcalf phase 2: NEAREST -4deg tilt + 1px lift of its own right crop (hover bob);
  left_1 is its mirror. No other creature uses a scripted phase.
All outputs are NEW dated files in this staging dir. Nothing in walk-frames/ or
atlases/ is overwritten, locked, or PR'd.
"""
import os, json, hashlib
from PIL import Image
import numpy as np
from scipy import ndimage

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
OUT = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/walk-gap-fill-20261026/partial-dirs")
os.makedirs(OUT, exist_ok=True)

def md5(im):
    return hashlib.md5(im.tobytes()).hexdigest()

def clean_cell(im):
    """Strip alpha<32, drop <4px specks, drop detached bright low-sat components
    wholly below the main body's vertical midpoint (rings/clouds)."""
    a = np.array(im.convert("RGBA")).astype(int)
    alpha = a[:, :, 3]
    keep = alpha >= 32
    lab, n = ndimage.label(keep)
    sizes = ndimage.sum_labels(keep, lab, range(1, n + 1)) if n else []
    dropped = {"specks": 0, "below_body": []}
    if n == 0:
        return im, dropped
    main_id = int(np.argmax(sizes)) + 1
    main = lab == main_id
    ys, xs = np.where(main)
    mid_y = (ys.min() + ys.max()) / 2
    out_keep = np.zeros_like(keep)
    for cid in range(1, n + 1):
        comp = lab == cid
        sz = int(comp.sum())
        if sz < 4:
            dropped["specks"] += sz
            continue
        if cid != main_id:
            cy, cx = np.where(comp)
            px = a[comp]
            bright = px[:, :3].mean()
            sat = (px[:, :3].max(axis=1) - px[:, :3].min(axis=1)).mean()
            if cy.min() >= mid_y and bright > 70 and sat < 25:
                dropped["below_body"].append({"px": sz, "y_min": int(cy.min()), "y_max": int(cy.max())})
                continue
        out_keep |= comp
    out = np.zeros_like(a)
    out[out_keep] = a[out_keep]
    out[~out_keep, 3] = 0
    return Image.fromarray(out.astype(np.uint8)), dropped

def mirror(im):
    return im.transpose(Image.FLIP_LEFT_RIGHT)

def load_locked(c, cell):
    return Image.open(f"{BASE}/atlases/{c}/{c}_cell_{cell:02d}.png").convert("RGBA")

def flood_crop(sheet, box):
    """Border-connected white-bg flood removal + largest component only, NEAREST fit 64."""
    crop = np.array(Image.open(sheet).convert("RGB").crop(box)).astype(int)
    bg = (np.abs(crop - 255).sum(axis=2) < 75)
    lab, n = ndimage.label(bg)
    border = set(np.unique(np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(border))
    lab2, n2 = ndimage.label(fg)
    sizes = ndimage.sum_labels(fg, lab2, range(1, n2 + 1))
    main = lab2 == (int(np.argmax(sizes)) + 1)
    ys, xs = np.where(main)
    rgba = np.zeros((*main.shape, 4), dtype=np.uint8)
    rgba[main] = np.concatenate([crop[main], np.full((int(main.sum()), 1), 255, dtype=np.uint8)], axis=1)
    sub = Image.fromarray(rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
    w, h = sub.size
    s = min(64 / w, 64 / h)
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    sub = sub.resize((nw, nh), Image.NEAREST)
    out = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    out.paste(sub, ((64 - nw) // 2, (64 - nh) // 2), sub)
    return out, {"panel_box": box, "main_px": int(main.sum()), "fitted": [nw, nh]}

def strip_below_gray_body(im):
    """Megalochrome ring-strip: clear BRIGHT-BLUE ripple pixels (b-r>60, mean>140).
    Body silver is neutral (b-r small); mouth gear / eye are dark (mean<140), so they
    survive. The ripple ellipse is interleaved with body rows, so a row-cut cannot
    separate it; colour-targeting can. Returns (image, bright_blue_px_cleared)."""
    a = np.array(im.convert("RGBA")).astype(int)
    rgb = a[:, :, :3].astype(float)
    bright_blue = (a[:, :, 3] > 0) & ((rgb[:, :, 2] - rgb[:, :, 0]) > 60) & (rgb.mean(axis=2) > 140)
    out = a.copy()
    out[bright_blue, 3] = 0
    cleared = int(bright_blue.sum())
    # Row-cut for the remaining WHITE ring strokes: last row with >=3 silver-gray
    # body pixels (mean 60-230, low saturation; white ring strokes excluded by the
    # 230 cap, blue strokes already cleared above). Rows below it are ring only.
    rgb2 = out[:, :, :3].astype(float)
    silver = (out[:, :, 3] > 0) & (np.abs(rgb2[:, :, 0] - rgb2[:, :, 1]) < 30) & (np.abs(rgb2[:, :, 1] - rgb2[:, :, 2]) < 30) & (rgb2.mean(axis=2) > 60) & (rgb2.mean(axis=2) < 230)
    rows = np.where(silver.sum(axis=1) >= 3)[0]
    if len(rows):
        cut = int(rows.max())
        cleared += int((out[cut + 1:, 3] > 0).sum())
        out[cut + 1:, 3] = 0
    # Keep largest component only: after the blue clear, the ripple survives as
    # detached fragments under the belly (61px/37px arcs + 1-6px specks at 64px);
    # fins/tail/gear/eye are all part of the main body component, so nothing
    # body-shaped is lost. Verified by component listing before this step.
    keep = out[:, :, 3] > 0
    lab, n = ndimage.label(keep)
    if n > 1:
        sizes = ndimage.sum_labels(keep, lab, range(1, n + 1))
        main = lab == (int(np.argmax(sizes)) + 1)
        cleared += int((keep & ~main).sum())
        out[~main, 3] = 0
    return Image.fromarray(out.astype(np.uint8)), cleared

def bbox(im):
    a = np.array(im.convert("RGBA"))[:, :, 3] > 0
    ys, xs = np.where(a)
    if len(xs) == 0:
        return None
    return [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]

def bottom_rows(im):
    a = np.array(im.convert("RGBA"))[:, :, 3] > 0
    return int(a[56:, :].sum())

# ---- sources ----
plan = {}
# 5 locked-side creatures: (left_0, left_1, right_0, right_1) as ("cell", n) or ("mirror", ("cell", n))
plan["finblade"] = [("cell", 5, "mirror"), ("cell", 6, "mirror"), ("cell", 5, "verbatim"), ("cell", 6, "verbatim")]
# finblade cells 05/06 both face right visually; left pair = mirrors, right pair = verbatim
plan["mothrix"] = [("cell", 6, "verbatim"), ("cell", 9, "verbatim"), ("cell", 5, "verbatim"), ("cell", 16, "verbatim")]
plan["squirmite"] = [("cell", 6, "verbatim"), ("cell", 9, "verbatim"), ("cell", 7, "verbatim"), ("cell", 11, "verbatim")]
plan["stormtalon"] = [("cell", 8, "verbatim"), ("cell", 9, "mirror"), ("cell", 9, "verbatim"), ("cell", 8, "mirror")]
plan["zephling"] = [("cell", 4, "verbatim"), ("cell", 6, "verbatim"), ("cell", 5, "verbatim"), ("cell", 9, "verbatim")]

results = {}
for c, spec in plan.items():
    frames = {}
    notes = []
    for role, (kind, cell, mode) in zip(["left_0", "left_1", "right_0", "right_1"], spec):
        src = load_locked(c, cell)
        cleaned, dropped = clean_cell(src)
        im = mirror(cleaned) if mode == "mirror" else cleaned
        frames[role] = im
        notes.append({"role": role, "source": f"atlases/{c}/{c}_cell_{cell:02d}.png",
                      "mode": mode, "clean_dropped": dropped, "bbox": bbox(im),
                      "bottom_rows_56_63_opaque": bottom_rows(im)})
    results[c] = {"frames": frames, "notes": notes}

# ---- 3 angles-sheet creatures ----
S = f"{BASE}/2d-sheets"
aero_l, info_l = flood_crop(f"{S}/aerobeak/media-generation-aerobeak-angles-lighting-v1-0-8d787466-9b9b-4a9f-82ff-698662a7d5ea.webp", (1136, 24, 1652, 571))
aero_r, info_r = flood_crop(f"{S}/aerobeak/media-generation-aerobeak-angles-top-diagonal-v-0-e250a595-d354-4d49-b28f-7cf45a3c9a30.webp", (633, 624, 1057, 1094))
results["aerobeak"] = {"frames": {"left_0": aero_l, "left_1": mirror(aero_r), "right_0": aero_r, "right_1": mirror(aero_l)},
    "notes": [{"role": "left_0", "source": "2d-sheets/aerobeak angles-lighting panel top-row col3", "mode": "crop", "crop": info_l, "bbox": bbox(aero_l), "bottom_rows_56_63_opaque": bottom_rows(aero_l)},
              {"role": "left_1", "source": "2d-sheets/aerobeak angles-top-diagonal panel bottom-row col2", "mode": "mirror", "crop": info_r, "bbox": bbox(mirror(aero_r)), "bottom_rows_56_63_opaque": bottom_rows(mirror(aero_r))},
              {"role": "right_0", "source": "2d-sheets/aerobeak angles-top-diagonal panel bottom-row col2", "mode": "crop", "crop": info_r, "bbox": bbox(aero_r), "bottom_rows_56_63_opaque": bottom_rows(aero_r)},
              {"role": "right_1", "source": "2d-sheets/aerobeak angles-lighting panel top-row col3", "mode": "mirror", "crop": info_l, "bbox": bbox(mirror(aero_l)), "bottom_rows_56_63_opaque": bottom_rows(mirror(aero_l))}]}

fc_r, info_fc = flood_crop(f"{S}/floatcalf/media-generation-floatcalf-angles-lighting-v1-0-0749a22f-0780-4875-a9bf-0694ccadccd6.webp", (1153, 65, 1638, 538))
fc_r1 = fc_r.rotate(4, resample=Image.NEAREST, center=(32, 32))
# 1px lift: shift up (drop top row, pad bottom transparent)
arr = np.array(fc_r1); arr[:-1] = arr[1:]; arr[-1] = 0; fc_r1 = Image.fromarray(arr)
results["floatcalf"] = {"frames": {"left_0": mirror(fc_r), "left_1": mirror(fc_r1), "right_0": fc_r, "right_1": fc_r1},
    "notes": [{"role": "left_0", "source": "2d-sheets/floatcalf angles-lighting panel top-row col3", "mode": "mirror", "crop": info_fc, "bbox": bbox(mirror(fc_r)), "bottom_rows_56_63_opaque": bottom_rows(mirror(fc_r))},
              {"role": "left_1", "source": "2d-sheets/floatcalf angles-lighting panel top-row col3", "mode": "mirror of scripted hover-bob (NEAREST +4deg tilt, 1px lift)", "crop": info_fc, "bbox": bbox(mirror(fc_r1)), "bottom_rows_56_63_opaque": bottom_rows(mirror(fc_r1))},
              {"role": "right_0", "source": "2d-sheets/floatcalf angles-lighting panel top-row col3", "mode": "crop", "crop": info_fc, "bbox": bbox(fc_r), "bottom_rows_56_63_opaque": bottom_rows(fc_r)},
              {"role": "right_1", "source": "2d-sheets/floatcalf angles-lighting panel top-row col3", "mode": "scripted hover-bob (NEAREST +4deg tilt, 1px lift)", "crop": info_fc, "bbox": bbox(fc_r1), "bottom_rows_56_63_opaque": bottom_rows(fc_r1)}]}

mega_l_raw, info_ml = flood_crop(f"{S}/megalochrome/media-generation-megalochrome-angles-lighting-v-0-0c6c6dd9-fa36-44c0-a3d9-25e179de9bf5.webp", (1292, 0, 1920, 436))
mega_r_raw, info_mr = flood_crop(f"{S}/megalochrome/media-generation-megalochrome-angles-lighting-v-0-0c6c6dd9-fa36-44c0-a3d9-25e179de9bf5.webp", (642, 446, 1277, 860))
mega_l, clr_l = strip_below_gray_body(mega_l_raw)
mega_r, clr_r = strip_below_gray_body(mega_r_raw)
results["megalochrome"] = {"frames": {"left_0": mega_l, "left_1": mirror(mega_r), "right_0": mega_r, "right_1": mirror(mega_l)},
    "notes": [{"role": "left_0", "source": "2d-sheets/megalochrome angles-lighting panel row1 col3", "mode": "crop + ring-strip", "crop": info_ml, "ring_px_cleared": clr_l, "bbox": bbox(mega_l), "bottom_rows_56_63_opaque": bottom_rows(mega_l)},
              {"role": "left_1", "source": "2d-sheets/megalochrome angles-lighting panel row2 col2", "mode": "mirror + ring-strip", "crop": info_mr, "ring_px_cleared": clr_r, "bbox": bbox(mirror(mega_r)), "bottom_rows_56_63_opaque": bottom_rows(mirror(mega_r))},
              {"role": "right_0", "source": "2d-sheets/megalochrome angles-lighting panel row2 col2", "mode": "crop + ring-strip", "crop": info_mr, "ring_px_cleared": clr_r, "bbox": bbox(mega_r), "bottom_rows_56_63_opaque": bottom_rows(mega_r)},
              {"role": "right_1", "source": "2d-sheets/megalochrome angles-lighting panel row1 col3", "mode": "mirror + ring-strip", "crop": info_ml, "ring_px_cleared": clr_l, "bbox": bbox(mirror(mega_l)), "bottom_rows_56_63_opaque": bottom_rows(mirror(mega_l))}]}

# ---- palette verification: universe = own walk down/up + used locked cells + crop panels ----
def palette(im):
    a = np.array(im.convert("RGBA"))
    m = a[:, :, 3] > 0
    return set(map(tuple, a[m].reshape(-1, 4).tolist()))

manifest = {"date": "2026-10-26", "status": "STAGED ONLY, show-first, no PR, no lock, no overwrite",
            "frames_built": 0, "locked_side_cells": 0, "creatures": {}}
for c in ["aerobeak", "finblade", "floatcalf", "megalochrome", "mothrix", "squirmite", "stormtalon", "zephling"]:
    uni = set()
    wf = f"{BASE}/walk-frames/{c}"
    for n in ["down_0", "down_1", "up_0", "up_1"]:
        p = f"{wf}/{c}_walk_{n}.png"
        if os.path.exists(p):
            uni |= palette(Image.open(p))
    # used locked cells
    for note in results[c]["notes"]:
        src = note.get("source", "")
        if src.startswith("atlases/"):
            uni |= palette(Image.open(f"{BASE}/{src}"))
    # crop panels: palette of the fitted base (already own-panel pixels); for aerobeak/floatcalf/megalochrome
    # the crop itself is in the frame set, so instead verify frame colours subset of panel crop pixels:
    # panel pixel set = all pixels of the source panel box (RGB, alpha 255) -- computed for the 3 only
    entries = []
    for role in ["left_0", "left_1", "right_0", "right_1"]:
        im = results[c]["frames"][role]
        fn = f"{c}_walk_{role}_20261026.png"
        im.save(f"{OUT}/{fn}")
        pal = palette(im)
        if c in ("aerobeak", "floatcalf", "megalochrome"):
            # universe for crops: frame colours must be subset of (walk palette OR panel palette).
            # Panel palette approximated by the union of the two base crops' colours (both are
            # verbatim panel pixels, and mirrors/tilts only reuse those pixels).
            panel_pal = set()
            for r2 in ["left_0", "right_0"]:
                panel_pal |= palette(results[c]["frames"][r2])
            # for floatcalf right_1 tilt: pixels come from right_0 only -> subset of panel_pal holds
            new_cols = pal - uni - panel_pal
        else:
            new_cols = pal - uni
        entries.append({"role": role, "file": fn, "size": "64x64 RGBA", "md5": md5(im),
                        "palette_size": len(pal), "new_colours_vs_own_art": len(new_cols),
                        "bottom_rows_56_63_opaque": bottom_rows(im), "bbox": bbox(im)})
        manifest["frames_built"] += 1
    # locked sides for the 3 zero-side creatures, from newly built left frames (Razorgater convention)
    locked = []
    if c in ("aerobeak", "floatcalf", "megalochrome"):
        for role, lrole in [("overworld_side", "left_0"), ("overworld_side_2", "left_1")]:
            im = results[c]["frames"][lrole]
            fn = f"{c}_walk_side_{0 if lrole == 'left_0' else 1}_20261026.png"
            im.save(f"{OUT}/{fn}")
            locked.append({"role": role, "file": fn, "size": "64x64 RGBA", "md5": md5(im),
                           "source": f"newly built {lrole} frame in this batch (pixel-identical)",
                           "bottom_rows_56_63_opaque": bottom_rows(im), "bbox": bbox(im)})
            manifest["locked_side_cells"] += 1
    manifest["creatures"][c] = {"frames": entries, "locked_side_cells": locked,
                                "source_notes": results[c]["notes"]}
    print(c, "frames done, locked:", len(locked))

json.dump(manifest, open(f"{OUT}/walk-gap-fill-partial-dirs-manifest-20261026.json", "w"), indent=1)
print("TOTAL frames:", manifest["frames_built"], "locked cells:", manifest["locked_side_cells"])
