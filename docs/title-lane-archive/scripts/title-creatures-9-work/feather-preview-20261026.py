#!/usr/bin/env python3
"""1px alpha feather previews — Mochii + Yogiferno (staged previews only).

Method (PR #51 description): 1px alpha feather at the figure edge, edge
pixels only, interior untouched, RGB untouched.
- Boundary = opaque pixel (alpha 255) with >= 1 transparent (alpha 0)
  8-neighbour. Both bases are binary alpha (0/255), verified before running.
- Boundary pixels get alpha 128 (50%). Interior pixels (all 8 neighbours
  opaque) are byte-identical. Transparent pixels stay transparent.
- Silhouette extent (bbox, non-zero-alpha pixel count) is unchanged; only
  the outermost ring's opacity softens.

CPU-only: tiny PNG alpha work (380x380, 145x190) — a GPU genuinely
cannot help this step.
"""
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WORK = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work"
GATE = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/src/assets/title"


def feather(src_path, dst_path):
    im = Image.open(src_path).convert("RGBA")
    arr = np.array(im).copy()
    a = arr[:, :, 3]
    opaque = a == 255
    # 8-neighbour transparency: pad with transparent border
    padded = np.pad(a, 1, constant_values=0)
    has_transparent_neighbour = np.zeros_like(opaque)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            has_transparent_neighbour |= padded[1 + dy:1 + dy + a.shape[0],
                                                1 + dx:1 + dx + a.shape[1]] == 0
    boundary = opaque & has_transparent_neighbour
    out = arr.copy()
    out[:, :, 3] = np.where(boundary, 128, a)
    Image.fromarray(out, "RGBA").save(dst_path)

    # Measurements
    orig = np.array(im)
    # interior = opaque pixels that are NOT boundary
    interior_mask = opaque & ~boundary
    interior_identical = bool(np.array_equal(orig[interior_mask], out[interior_mask]))
    rgb_unchanged = bool(np.array_equal(orig[:, :, :3], out[:, :, :3]))
    # opaque neighbour count for boundary pixels (thin-feature note)
    padded_op = np.pad(opaque.astype(np.uint8), 1)
    neigh = np.zeros(a.shape, dtype=int)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            neigh += padded_op[1 + dy:1 + dy + a.shape[0], 1 + dx:1 + dx + a.shape[1]]
    thin = int(np.sum(boundary & (neigh <= 2)))
    ys, xs = np.where(opaque)
    bbox = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
    ys2, xs2 = np.where(out[:, :, 3] > 0)
    bbox2 = [int(xs2.min()), int(ys2.min()), int(xs2.max()), int(ys2.max())]
    return {
        "source": src_path,
        "output": dst_path,
        "size": [int(im.width), int(im.height)],
        "opaque_before": int(np.sum(opaque)),
        "transparent_before": int(np.sum(a == 0)),
        "intermediate_before": int(np.sum((a > 0) & (a < 255))),
        "boundary_pixels_feathered": int(np.sum(boundary)),
        "intermediate_after": int(np.sum((out[:, :, 3] > 0) & (out[:, :, 3] < 255))),
        "intermediate_value": 128,
        "ramp_width_px": 1,
        "nonzero_alpha_after": int(np.sum(out[:, :, 3] > 0)),
        "bbox_before": bbox,
        "bbox_after": bbox2,
        "alpha_mass_before": int(np.sum(a.astype(np.int64))),
        "alpha_mass_after": int(np.sum(out[:, :, 3].astype(np.int64))),
        "interior_byte_identical": interior_identical,
        "rgb_unchanged_everywhere": rgb_unchanged,
        "thin_boundary_pixels_neigh_le2": thin,
    }


def find_edge_crop(alpha, prefer="left_mid"):
    """Return (cx, cy) centre of a crop with a clear figure/background edge."""
    opaque = alpha > 0
    h, w = alpha.shape
    ys, xs = np.where(opaque)
    if prefer == "left_mid":
        # leftmost opaque pixel near vertical middle of the figure
        ymid = int((ys.min() + ys.max()) // 2)
        band = [y for y in range(max(0, ymid - 20), min(h, ymid + 20))
                if np.any(opaque[y])]
        y = band[len(band) // 2] if band else ymid
        x = int(np.where(opaque[y])[0].min())
        return x + 6, y
    # top edge near horizontal middle
    xmid = int((xs.min() + xs.max()) // 2)
    band = [x for x in range(max(0, xmid - 20), min(w, xmid + 20))
            if np.any(opaque[:, x])]
    x = band[len(band) // 2] if band else xmid
    y = int(np.where(opaque[:, x])[0].min())
    return x, y + 6


def composite_on(rgba, bg):
    """Composite RGBA image onto a solid RGB background."""
    bg_im = Image.new("RGBA", rgba.size, bg + (255,))
    return Image.alpha_composite(bg_im, rgba).convert("RGB")


def build_sheet(results, zoom_info):
    try:
        fb = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
        fs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        fm = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except Exception:
        fb = fs = fm = ImageFont.load_default()

    W = 1600
    hdr = 70
    # Per creature block: title 40 + full row (300 + labels 60) + zoom row (300 + labels 60)
    block_h = 40 + 360 + 360
    H = hdr + 2 * block_h + 20
    sheet = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(sheet)
    d.text((20, 16), "FEATHER PREVIEWS — hard cut vs 1px feather (PREVIEWS ONLY, not shipped)",
           fill=(255, 255, 255), font=fb)

    y = hdr
    for name, res, zin in zip(["Mochii", "Yogiferno (base = NEW locked clean v3)"],
                              results, zoom_info):
        d.text((20, y + 4), name, fill=(255, 220, 120), font=fb)
        y += 40
        before = Image.open(res["before_path"]).convert("RGBA")
        after = Image.open(res["after_path"]).convert("RGBA")
        # Full-figure row: before-black, after-black, before-dark, after-dark
        panels = [
            ("BEFORE — black", composite_on(before, (0, 0, 0))),
            ("AFTER feather — black", composite_on(after, (0, 0, 0))),
            ("BEFORE — dark ground", composite_on(before, (24, 32, 48))),
            ("AFTER feather — dark ground", composite_on(after, (24, 32, 48))),
        ]
        for i, (label, img) in enumerate(panels):
            h = 300
            w = max(1, round(img.width * h / img.height))
            if w > 380:
                w = 380
                h = round(img.height * w / img.width)
            img = img.resize((w, h), Image.LANCZOS)
            x = i * 400 + (400 - w) // 2
            sheet.paste(img, (x, y + (300 - h) // 2))
            d.text((i * 400 + 10, y + 310), label, fill=(255, 255, 255), font=fs)
        y += 360
        # Zoom row: 6x crops, before/after on black and on dark ground
        cx, cy, cs = zin
        zoom_panels = []
        for label, src in [("ZOOM BEFORE — black", before), ("ZOOM AFTER — black", after),
                           ("ZOOM BEFORE — dark", before), ("ZOOM AFTER — dark", after)]:
            bg = (0, 0, 0) if "black" in label else (24, 32, 48)
            crop = src.crop((cx - cs // 2, cy - cs // 2, cx + cs // 2, cy + cs // 2))
            comp = composite_on(crop, bg).resize((cs * 6, cs * 6), Image.NEAREST)
            zoom_panels.append((label, comp))
        for i, (label, img) in enumerate(zoom_panels):
            x = i * 400 + (400 - img.width) // 2
            sheet.paste(img, (x, y))
            d.text((i * 400 + 10, y + 310), label, fill=(255, 255, 255), font=fs)
        d.text((20, y + 340), f"Edge zoom centre ({cx},{cy}), crop {cs}px at 6x. "
               f"Feathered ring: {res['boundary_pixels_feathered']} px at alpha 128.",
               fill=(170, 170, 170), font=fm)
        y += 360
    out = WORK + "/show-100/feather-preview-show-20261026.png"
    sheet.save(out)
    return out


if __name__ == "__main__":
    jobs = [
        ("Mochii", f"{GATE}/mochii-walk-cutout.png",
         f"{WORK}/mochii-feather-preview-20261026.png"),
        ("Yogiferno", f"{WORK}/yogiferno-white-speck-clean-v3-20261026.png",
         f"{WORK}/yogiferno-feather-preview-20261026.png"),
    ]
    results, zooms = [], []
    for name, src, dst in jobs:
        res = feather(src, dst)
        res["creature"] = name
        res["before_path"] = src
        res["after_path"] = dst
        alpha = np.array(Image.open(src).convert("RGBA"))[:, :, 3]
        # Yogiferno: use a body edge (mid-height left edge) — halo is at top;
        # Mochii: left-mid edge as well.
        cx, cy = find_edge_crop(alpha, "left_mid")
        zooms.append((cx, cy, 48))
        res["zoom_centre"] = [cx, cy]
        results.append(res)
        print(name, json.dumps(res, indent=1))
    sheet = build_sheet(results, zooms)
    print("sheet:", sheet)
    with open(f"{WORK}/feather-preview-20261026.json", "w") as f:
        json.dump(results, f, indent=1)
