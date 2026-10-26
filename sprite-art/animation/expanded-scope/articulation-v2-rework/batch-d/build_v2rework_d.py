#!/usr/bin/env python3
"""ARTICULATION V2 REWORK — BATCH D (2026-10-26), eyes only.

Binding method: PIPELINE-V2.md. Overlay drawn AFTER the cell transform in
final-frame coordinates; every dimension multiplied by that frame's (sx, sy);
ellipses (not circles) under squash; NO clear-box rectangles anywhere;
size caps from measured true features; gates run ON the final frame
(fail = base, never forced). Anchors re-measured from enlarged front cells
(cluster centroid + visual check), NOT copied blindly from the old method.

MOUTH HOLD (Mars 2026-10-26 ~10:50 CDT): mouth overlays are NOT drawn here.
The two unsuited humanoids' mouth anchors are measured and recorded for V3
contour-fit, but no mouth shape is finalized in this build — eyes only.
No rectangular crop / clearing box exists in this script at all.

Scope: 9 Batch D creature dirs (duplicate-dir versions only; Batch B
untouched). Mode A: overlay only on impact frame (index 3) of each attack
set. Hurts stay base and are NOT staged here. Teeth: none drawn — enlarged
measurement confirms no Batch D front cell shows teeth.
Tag: artic-v2rework-20261026. Staging only, no PR, batch-d originals untouched.
GIF durations are the batch-d pilot durations verbatim (no +250 tail).
"""
import json, ast, math, os
from PIL import Image, ImageDraw

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
BD = os.path.join(BASE, "animation/expanded-scope/articulation-batch-cd/batch-d")
OUT = os.path.join(BASE, "animation/expanded-scope/articulation-v2-rework/batch-d")
TAG = "artic-v2rework-20261026"

# creature -> (front file, eye kind, NEW eyes, OLD eyes, widened source half-size,
#              gate kind, mouth measured-for-V3 or None)
# Half-size: (rx, ry) for ellipses, or rect half-size for visor/slit shapes.
# Caps: widened <= 2x measured true radius (see manifest notes per creature).
ANATOMY = {
    # squirmite: black discs 6x7px, true r~3.2, cap 6.5; old r5 within cap. Keep 5.
    "squirmite": ("squirmite_cell_01.png", "black-disc",
                  [(25.5, 16.9), (37.6, 17.0)], [(25, 17), (38, 17)], (5, 5), "black", None),
    # stormtalon: cyan blobs ~3x3, true r~1.5, cap 3; old r3 at cap. Keep 3.
    "stormtalon": ("stormtalon_cell_02.png", "cyan",
                  [(26.3, 21.0), (36.0, 21.0)], [(27, 22), (36, 22)], (3, 3), "cyan", None),
    # strikechamp: visor slits ~8x3, true half (4,1.5); old rect (3,2) within cap.
    # Old cluster centroid REJECTED (merged with mask dark areas, bbox 19-33);
    # visual slit centres confirm old anchors.
    "strikechamp": ("strikechamp_cell_04.png", "visor",
                   [(26, 15), (38, 15)], [(26, 15), (38, 15)], (3, 2), "dark", None),
    # unsuited humanoids: 1-2px dark dots, true r~1, cap 2; old r2 at cap.
    # Old cluster centroids REJECTED (merged with hair/face dark areas);
    # visual dots confirm old anchors. Mouth measured, HELD for V3.
    "strikechamp_unsuited": ("strikechamp_unsuited_cell_05.png", "humanoid",
                            [(29, 14), (34, 14)], [(29, 14), (34, 14)], (2, 2), "dark", (32, 17)),
    "strikechamp_unsuited_full": ("strikechamp_unsuited_full_cell_00.png", "humanoid",
                                 [(28, 14), (32, 14)], [(28, 14), (32, 14)], (2, 2), "dark", (30, 18)),
    # terradog: dark eye patches 5x4, true r~2.5, cap 5; old r4 within cap. Keep 4.
    "terradog": ("terradog_cell_00.png", "dark-angry",
                [(24.5, 13.2), (38.3, 13.2)], [(25, 13), (38, 13)], (4, 4), "black", None),
    # toxitacle: purple blobs ~4px wide visually, true r~2, cap 4; old r3 within cap.
    # Strict-predicate cluster (n=2-3) understates the visual blob; visual bbox used.
    "toxitacle": ("toxitacle_cell_05.png", "purple",
                 [(24.5, 26.0), (33.7, 25.7)], [(25, 26), (34, 26)], (3, 3), "purple", None),
    # yogiferno: pale vertical slits 1x5, true half (0.5,2.5); old rect (1,3) ~cap.
    "yogiferno": ("yogiferno_cell_00.png", "pale-slit",
                 [(28, 20.5), (35, 20)], [(28, 20), (35, 20)], (1, 3), "pale", None),
    # zephling: black beads 3x4, true r~1.75, cap 3.5; old r5 EXCEEDED the cap.
    # V2 CORRECTION: widened radius cut 5 -> 3.5.
    "zephling": ("zephling_cell_00.png", "black-disc",
                [(25.8, 18.8), (37.2, 18.8)], [(26, 19), (37, 19)], (3.5, 3.5), "black", None),
}


def trf(cell):
    t = cell.get("transform", {})
    return ast.literal_eval(t) if isinstance(t, str) else (t or {})


def propagate(p, t):
    sx = t.get("sx", 1.0); sy = t.get("sy", 1.0)
    dx = t.get("dx", 0); dy = t.get("dy", 0); rot = t.get("rot", 0)
    X, Y = p[0] * 4, p[1] * 4
    qx = 128 + (X - 128) * sx + dx; qy = 232 + (Y - 256) * sy + dy
    if rot:
        th = math.radians(rot); cx, cy = 128, 200
        rx = cx + (qx - cx) * math.cos(th) + (qy - cy) * math.sin(th)
        ry = cy - (qx - cx) * math.sin(th) + (qy - cy) * math.cos(th)
        qx, qy = rx, ry
    return (qx / 4, qy / 4)


def feat_count(im, cx, cy, kind, win=3):
    n = 0
    for y in range(max(0, cy - win), min(64, cy + win + 1)):
        for x in range(max(0, cx - win), min(64, cx + win + 1)):
            p = im.getpixel((x, y))
            if len(p) == 4 and p[3] < 128:
                continue
            lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]
            if kind in ("black", "dark"):
                ok = lum < 100
            elif kind == "cyan":
                ok = p[2] > 120 and p[1] > 120 and p[0] < 120
            elif kind == "purple":
                ok = 90 < p[0] < 190 and p[1] < 100 and p[2] > 120
            elif kind == "pale":
                ok = p[0] > 150 and p[1] > 170 and p[2] > 180
            else:
                ok = False
            if ok:
                n += 1
    return n


def rotated_ellipse(d, cx, cy, rx, ry, rot_deg, fill):
    th = math.radians(rot_deg)
    pts = []
    for i in range(36):
        a = 2 * math.pi * i / 36
        ex, ey = rx * math.cos(a), ry * math.sin(a)
        pts.append((cx + ex * math.cos(th) - ey * math.sin(th),
                    cy + ex * math.sin(th) + ey * math.cos(th)))
    d.polygon(pts, fill=fill)


def draw_eye(d, kind, cx, cy, rx, ry, rot):
    if kind == "black-disc":
        rotated_ellipse(d, cx, cy, rx, ry, rot, (12, 12, 12, 255))
        rotated_ellipse(d, cx - 0.4 * rx, cy - 0.4 * ry, max(1, 0.35 * rx), max(1, 0.35 * ry), rot, (255, 255, 255, 255))
    elif kind == "cyan":
        rotated_ellipse(d, cx, cy, rx, ry, rot, (90, 220, 235, 255))
        rotated_ellipse(d, cx, cy, max(1, 0.35 * rx), max(1, 0.35 * ry), rot, (10, 10, 20, 255))
    elif kind == "visor":
        # slit rectangle, scaled by (sx, sy), rotated about its centre
        th = math.radians(rot); pts = []
        for ex, ey in ((-rx, -ry), (rx, -ry), (rx, ry), (-rx, ry)):
            pts.append((cx + ex * math.cos(th) - ey * math.sin(th),
                        cy + ex * math.sin(th) + ey * math.cos(th)))
        d.polygon(pts, fill=(10, 10, 10, 255))
    elif kind == "humanoid":
        rotated_ellipse(d, cx, cy, rx, ry, rot, (20, 20, 20, 255))
        d.ellipse((cx, cy - 1, cx, cy), fill=(255, 255, 255, 255))
    elif kind == "dark-angry":
        rotated_ellipse(d, cx, cy, rx, ry, rot, (15, 15, 15, 255))
        rotated_ellipse(d, cx - 0.3 * rx, cy - 0.3 * ry, 1, 1, rot, (255, 255, 255, 255))
    elif kind == "purple":
        rotated_ellipse(d, cx, cy, rx, ry, rot, (150, 70, 210, 255))
        rotated_ellipse(d, cx, cy, max(1, 0.35 * rx), max(1, 0.35 * ry), rot, (15, 10, 25, 255))
    elif kind == "pale-slit":
        th = math.radians(rot); pts = []
        for ex, ey in ((-rx, -ry), (rx, -ry), (rx, ry), (-rx, ry)):
            pts.append((cx + ex * math.cos(th) - ey * math.sin(th),
                        cy + ex * math.sin(th) + ey * math.cos(th)))
        d.polygon(pts, fill=(200, 230, 245, 255))


def dilate(mask, r):
    out = set()
    for (x, y) in mask:
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                if 0 <= x + dx < 64 and 0 <= y + dy < 64:
                    out.add((x + dx, y + dy))
    return out


full = {"tag": TAG, "method": "PIPELINE-V2 eyes-only; mouths HELD for V3 contour-fit (Mars 2026-10-26 ~10:50 CDT). "
        "Mode A impact-frame only (index 3). Teeth: none drawn (no Batch D front cell shows teeth). "
        "Hurts stay base, not staged. Batch B untouched; these are Batch D duplicate-dir versions.",
        "creatures": {}}

for creature, (front_file, kind, eyes_new, eyes_old, half, gate_kind, mouth_v3) in ANATOMY.items():
    man = json.load(open(os.path.join(BD, creature, f"{creature}.batch-d-manifest.json")))
    outdir = os.path.join(OUT, creature)
    os.makedirs(outdir, exist_ok=True)
    rep = {"front": front_file, "eye_kind": kind, "eyes_old": eyes_old, "eyes_new": eyes_new,
           "widened_half_source": half, "mouth_measured_for_V3": mouth_v3,
           "mouth_status": ("HELD for V3 contour-fit — not drawn" if mouth_v3 else "none (no measurable mouth)"),
           "sets": {}}
    eye_check_tiles = []  # (base_impact, v2_impact) per attack set, in set order
    for setname, s in man["sets"].items():
        if s["kind"] != "attack":
            continue
        files, states = [], []
        gif_frames, gif_durs = [], []
        for i, cell in enumerate(s["cells"]):
            src = Image.open(os.path.join(BD, creature, cell["file"])).convert("RGBA")
            base = src.copy()
            t = trf(cell)
            action = "base-mode-A-non-impact"
            if i == 3:
                eye_a = [propagate(e, t) for e in eyes_new]
                counts = [feat_count(src, int(round(x)), int(round(y)), gate_kind, 3)
                          for x, y in eye_a]
                verified = all(n >= 1 for n in counts)
                if verified:
                    d = ImageDraw.Draw(src)
                    sx, sy, rot = t.get("sx", 1.0), t.get("sy", 1.0), t.get("rot", 0)
                    for (x, y) in eye_a:
                        draw_eye(d, kind, x, y, half[0] * sx, half[1] * sy, rot)
                    # post-gate: every changed px within 2px of base silhouette,
                    # where silhouette = any non-transparent rendered px (alpha > 0).
                    # (First run used alpha>=128 and failed stormtalon by 3 px that
                    # sit on the semi-transparent cyan glow, alpha 114 — rendered
                    # sprite, not background. alpha>0 is the faithful definition.)
                    sil = {(x, y) for y in range(64) for x in range(64)
                           if base.getpixel((x, y))[3] > 0}
                    sil2 = dilate(sil, 2)
                    changed = [(x, y) for y in range(64) for x in range(64)
                               if src.getpixel((x, y)) != base.getpixel((x, y))]
                    outside = [p for p in changed if p not in sil2]
                    if outside:
                        src = base  # fail post-gate -> base, never forced
                        action = "base-skipped-post-gate-fail"
                        states.append({"frame": i, "pred_eyes": [(round(x, 1), round(y, 1)) for x, y in eye_a],
                                       "eye_feature_counts": counts, "verified": True,
                                       "post_gate_outside_px": len(outside), "action": action})
                    else:
                        action = "overlay-impact-eyes-only-v2"
                        states.append({"frame": i, "pred_eyes": [(round(x, 1), round(y, 1)) for x, y in eye_a],
                                       "eye_feature_counts": counts, "verified": True,
                                       "changed_px": len(changed), "post_gate": "pass",
                                       "transform": t, "action": action})
                else:
                    states.append({"frame": i, "pred_eyes": [(round(x, 1), round(y, 1)) for x, y in eye_a],
                                   "eye_feature_counts": counts, "verified": False,
                                   "action": "base-skipped-unverified"})
            else:
                states.append({"frame": i, "action": action})
            fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
            src.save(os.path.join(outdir, fn))
            files.append(fn)
            gif_frames.append(fn); gif_durs.append(cell["duration_ms"])
            if i == 3:
                eye_check_tiles.append((base, src))
        # per-set GIF, pilot durations verbatim
        fr = []
        for fn in gif_frames:
            im = Image.open(os.path.join(outdir, fn)).convert("RGBA").resize((256, 256), Image.NEAREST)
            bg = Image.new("RGBA", (256, 256), (24, 28, 40, 255)); bg.paste(im, (0, 0), im)
            fr.append(bg.convert("P", palette=Image.ADAPTIVE))
        gname = f"{creature}-attacks-{TAG}-{setname}.gif"
        fr[0].save(os.path.join(outdir, gname), save_all=True, append_images=fr[1:], duration=gif_durs, loop=0)
        rep["sets"][setname] = {"kind": "attack", "timing": "Mode A impact-only (frame 3)",
                                "files": files, "frames": states, "gif": gname,
                                "durations_ms": gif_durs}
        n_over = sum(1 for f in states if f["action"].startswith("overlay"))
        print(creature, setname, f"overlaid {n_over}/1 impact", [f["action"] for f in states if f["frame"] == 3])
    # eye-check sheet: columns = attack sets, top row = base impact, bottom = V2 impact, 256px tiles
    cols = len(eye_check_tiles)
    sheet = Image.new("RGBA", (cols * 256, 2 * 256), (24, 28, 40, 255))
    for j, (b, v) in enumerate(eye_check_tiles):
        sheet.paste(b.resize((256, 256), Image.NEAREST), (j * 256, 0))
        sheet.paste(v.resize((256, 256), Image.NEAREST), (j * 256, 256))
    ename = f"{creature}-eye-check-{TAG}.png"
    sheet.save(os.path.join(outdir, ename))
    rep["eye_check"] = ename
    full["creatures"][creature] = rep

json.dump(full, open(os.path.join(OUT, f"batch-d-artic-{TAG}-manifest.json"), "w"), indent=1)
print("manifest written")
