#!/usr/bin/env python3
"""BATCH C V2 REWORK — EYES ONLY, MOUTHS HELD FOR V3 (2026-10-26).
Follows articulation/PIPELINE-V2.md (binding): corrected anchors from TRUE
feature pixels measured on enlarged source front cells + final-frame
coordinates + per-frame (sx,sy) ellipse geometry + NO clear-box rectangles
+ gates ON the final frame. Fail either gate = base, never a guess.
MOUTH HOLD (Mars 2026-10-26 ~10:50 CDT): mouth-overlay finalization is HELD
until the V3 contour-fit module + PIPELINE-V3.md land (Kittember/Tiidebiite
are the V3 proof cases). This builder draws NO mouth shape at all — no
rectangle, no ellipse, no arc, no line — on any frame. Mouth anchors are
NOT finalized here; they are listed as pending in the manifest/verification
note for the V3 pass. Old mouth anchors are carried only as 'old (held)'.
Scope: 8 faced Batch C creatures x 4 attack sets, impact frame (index 3)
only, Mode A impact-momentary. Hurts untouched (not copied, not overlaid).
Base cells in batch-c/<creature>/base/ are read-only inputs, never written.
New filenames only, tag artic-v2rework-20261026. Staged only, NO PR.
Eye states (Batch C correction, kept from v1): physical/signature/heavy =
widened, special = glance. Heavy is NOT half-lidded (that read as face
paint in the v1 eye-check).
"""
import json, ast, math, os, shutil
import numpy as np
from PIL import Image, ImageDraw

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
BC = os.path.join(BASE, "animation/expanded-scope/articulation-batch-cd/batch-c")
OUT = os.path.join(BASE, "animation/expanded-scope/articulation-v2-rework/batch-c")
TAG = "artic-v2rework-20261026"

# Corrected anchors (64px source coords) + measured true eye sizes.
# OLD = build_artic_c.py ANCHORS (source space). NEW = re-measured 2026-10-26
# from enlarged source front cells (cluster centroids / pure cores, see
# VERIFICATION note for per-creature evidence).
CORR = {
    # old (32,29) -> red core bbox 31-33,29-31, centroid (32.14,29.86)
    "krakenox":   {"old": [(32, 29)], "new": [(32.1, 29.9)], "eye_r": 1.5,
                   "disc": (220, 30, 30, 255), "inner": (15, 15, 15, 255), "kind": "pupil",
                   "old_mouth": None, "note": "Single red eye. Mouth: none measurable front (eye-only in v1 too) — no mouth drawn, V3 n/a."},
    # old (28,22),(35,22) -> grey eye clusters (28.5,22.0),(33.5,22.0)
    "mythar":     {"old": [(28, 22), (35, 22)], "new": [(28.5, 22.0), (33.5, 22.0)], "eye_r": 1.0,
                   "disc": (15, 15, 15, 255), "inner": (255, 255, 255, 255), "kind": "dot",
                   "old_mouth": (32, 27), "note": "Black eyes + white dots. Teeth: none (ambiguous, kept). Mouth HELD for V3, not drawn."},
    # old (24,31),(40,31) -> bright-yellow cores (23.0,31.2),(40.0,31.2); side lava at x14/x49 excluded
    "pebblefist": {"old": [(24, 31), (40, 31)], "new": [(23.0, 31.2), (40.0, 31.2)], "eye_r": 1.5,
                   "disc": (255, 190, 40, 255), "inner": (255, 255, 255, 255), "kind": "dot",
                   "old_mouth": None, "note": "Glowing yellow eyes under rock brow. No visible mouth (eye-only in v1 too) — no mouth drawn."},
    # old (28,20),(37,19) -> brown eye ovals (21.0,19.5),(30.5,19.5). Old L sat between the eyes, old R sat on ear/orange fur — largest Batch C correction.
    "ashemit":    {"old": [(28, 20), (37, 19)], "new": [(21.0, 19.5), (30.5, 19.5)], "eye_r": 1.5,
                   "disc": (125, 75, 45, 255), "inner": (255, 255, 255, 255), "kind": "dot",
                   "old_mouth": (32, 26), "note": "Brown monkey eyes. Mouth HELD for V3, not drawn (old mouth anchor unverified, not reused)."},
    # old (26,18),(33,18) -> pure dark-red cores (25,18),(33,18); red side fins at x20-22/x37-42 excluded
    "dorowani":   {"old": [(26, 18), (33, 18)], "new": [(25.0, 18.0), (33.0, 18.0)], "eye_r": 1.0,
                   "disc": (175, 40, 40, 255), "inner": (15, 15, 15, 255), "kind": "pupil",
                   "old_mouth": (31, 24), "note": "Dark-red eye ovals in blue snout head. Mouth HELD for V3, not drawn."},
    # old (23,25),(41,25) -> black discs + white dots (21,24),(42,24); white dots at (21,22),(42,22), disc rows 24-26
    "floatcalf":  {"old": [(23, 25), (41, 25)], "new": [(21.0, 24.0), (42.0, 24.0)], "eye_r": 2.0,
                   "disc": (15, 15, 15, 255), "inner": (255, 255, 255, 255), "kind": "dot",
                   "old_mouth": (32, 28), "note": "Black eyes + white star highlights on dark-blue dome. Mouth HELD for V3, not drawn."},
    # old (27,23),(37,23) -> yellow cores (26.75,22.0),(36.25,22.0)
    "gabu":       {"old": [(27, 23), (37, 23)], "new": [(26.75, 22.0), (36.25, 22.0)], "eye_r": 1.5,
                   "disc": (230, 190, 60, 255), "inner": (15, 15, 15, 255), "kind": "pupil",
                   "old_mouth": (32, 29), "note": "Yellow eyes, open pink mouth in source. Teeth: none (ambiguous, kept). Mouth HELD for V3, not drawn."},
    # old (26,43),(36,43) -> black ovals + white dots (26,44),(36,44); white dots (26,42),(36,42), oval rows 43-46
    "inklet":     {"old": [(26, 43), (36, 43)], "new": [(26.0, 44.0), (36.0, 44.0)], "eye_r": 1.5,
                   "disc": (15, 15, 15, 255), "inner": (255, 255, 255, 255), "kind": "dot",
                   "old_mouth": None, "note": "Black octopus eyes + white dots in jar. Mouth on underside, not measurable front (eye-only in v1 too) — no mouth drawn."},
}
IMPACT_EYE = {"physical": "widened", "special": "glance", "signature": "widened", "heavy": "widened"}

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

def feat_present(im, cx, cy, creature):
    """True-feature px within +/-3px of (cx,cy) in the FINAL frame.
    Predicates widened for LANCZOS blending (pipev2 precedent): blended
    1-2px cores fall below strict source predicates, so thresholds are
    set from the blended final-frame colours, not the pure source cores."""
    n = 0
    for y in range(max(0, int(cy) - 3), min(64, int(cy) + 4)):
        for x in range(max(0, int(cx) - 3), min(64, int(cx) + 4)):
            p = im.getpixel((x, y))
            if p[3] < 128:
                continue
            r, g, b = p[:3]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if creature == "krakenox":
                ok = r >= 120 and r - g >= 50 and r - b >= 50
            elif creature == "mythar":
                ok = 40 < lum < 165 and max(p[:3]) - min(p[:3]) < 45
            elif creature == "pebblefist":
                ok = r >= 190 and g >= 130 and b < 150 and r - b >= 70
            elif creature == "ashemit":
                ok = 35 <= r <= 170 and 10 <= g <= 115 and b < 85 and r - g > 12
            elif creature == "dorowani":
                ok = 65 <= r <= 185 and g < 85 and b < 85 and r - g > 18
            elif creature == "floatcalf":
                ok = r < 65 and g < 65 and b < 65  # near-black disc core (head navy has B~85-91, excluded)
            elif creature == "gabu":
                ok = r >= 165 and 120 <= g <= 225 and b < 150
            elif creature == "inklet":
                ok = r + g + b < 140  # near-black core (magenta body sums ~510, excluded)
            else:
                ok = False
            if ok:
                n += 1
    return n

def draw_eyes_v2(d, anchors, state, creature, sx, sy):
    g = CORR[creature]; disc, inner, rb = g["disc"], g["inner"], g["eye_r"]
    for (cx, cy) in anchors:
        if state == "widened":
            rx = max(1, round(2 * rb * sx)); ry = max(1, round(2 * rb * sy))
        elif state == "glance":
            rx = max(1, round(rb * sx)); ry = max(1, round(rb * sy))
            cx = cx + max(1, round(1 * sx))
        else:
            rx = max(1, round(rb * sx)); ry = max(1, round(rb * sy))
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=disc)
        if state == "widened":
            d.ellipse((cx - 1, cy - 1, cx + 1, cy + 1), fill=inner)
        elif g["kind"] == "pupil":
            d.ellipse((cx - 1, cy - 1, cx + 1, cy + 1), fill=inner)
        else:  # dot: white dot offset up, as in v1
            d.ellipse((cx - 1, cy - 2, cx + 1, cy), fill=inner)

def family_of(setname):
    for k in ("physical", "special", "signature", "heavy"):
        if k in setname:
            return k
    return "special"

def main():
    os.makedirs(OUT, exist_ok=True)
    report = {"tag": TAG, "method": "PIPELINE-V2 eyes only + V3 mouth hold: corrected anchors + final-frame coords + per-frame (sx,sy) ellipse geometry + no clear-box + final-frame gates; NO mouth drawn on any frame (MOUTH HOLD 2026-10-26 ~10:50 CDT, pending PIPELINE-V3)",
              "mouth_hold": "Mouth overlays HELD for V3 contour-fit (Kittember/Tiidebiite proof cases). This staging is eyes-only and interim: GIFs show eye expression only; mouths will be added by the V3 pass and reported vs these V2 eye-only versions.",
              "creatures": {}}
    for creature, g in CORR.items():
        cdir = os.path.join(BC, creature)
        bman = json.load(open(os.path.join(cdir, f"{creature}-artic-batchc-20261026-base-manifest.json")))
        odir = os.path.join(OUT, creature)
        os.makedirs(odir, exist_ok=True)
        crep = {"old_anchors": g["old"], "new_anchors": g["new"], "eye_r": g["eye_r"],
                "old_mouth_anchor_held_not_drawn": g["old_mouth"], "note": g["note"],
                "sets": {}, "overlaid_frames": 0, "total_attack_frames": 0}
        gif_frames, gif_durs = [], []
        for setname, s in bman["sets"].items():
            if s["kind"] != "attack":
                continue
            fam = family_of(setname); eye_state = IMPACT_EYE[fam]
            files, states = [], []
            for i, cell in enumerate(s["cells"]):
                base = Image.open(os.path.join(cdir, "base", cell["file"])).convert("RGBA")
                t = trf(cell); sx, sy = t.get("sx", 1.0), t.get("sy", 1.0)
                action = "base"; info = {}
                if i == 3 and not t.get("flash", 0):
                    eye_a = [propagate(e, t) for e in g["new"]]
                    eye_i = [(int(round(x)), int(round(y))) for x, y in eye_a]
                    counts = [feat_present(base, ex, ey, creature) for ex, ey in eye_i]
                    info = {"prop_eyes": [(round(x, 1), round(y, 1)) for x, y in eye_a],
                            "sx": sx, "sy": sy, "feature_counts_pm3": counts,
                            "eye_state": eye_state, "mouth": "HELD-V3-not-drawn"}
                    if all(c >= 1 for c in counts):
                        im = base.copy(); d = ImageDraw.Draw(im)
                        draw_eyes_v2(d, eye_i, eye_state, creature, sx, sy)
                        ba = np.array(base)[:, :, 3] >= 128
                        diff = (np.abs(np.array(im).astype(int) - np.array(base).astype(int)).sum(axis=2) > 0)
                        dys, dxs = np.where(diff)
                        inside = True
                        if len(dxs):
                            ok_zone = ba.copy()
                            for _ in range(2):
                                sh = np.zeros_like(ok_zone)
                                sh[1:, :] |= ok_zone[:-1, :]; sh[:-1, :] |= ok_zone[1:, :]
                                sh[:, 1:] |= ok_zone[:, :-1]; sh[:, :-1] |= ok_zone[:, 1:]
                                ok_zone = ok_zone | sh
                            inside = bool(ok_zone[dys, dxs].all())
                        info["diff_bbox_xy"] = (int(dxs.min()), int(dxs.max()), int(dys.min()), int(dys.max()), int(len(dxs))) if len(dxs) else None
                        info["diff_inside_base_silhouette"] = inside
                        if inside:
                            base = im; action = f"overlay-v2-eyes-only-{eye_state}-mouth-HELD"
                            crep["overlaid_frames"] += 1
                        else:
                            action = "base-skipped-postgate-outside-silhouette"
                    else:
                        action = "base-skipped-pregate-no-feature"
                fn = f"{creature}-{TAG}-{setname}-cell-{i:02d}.png"
                base.save(os.path.join(odir, fn))
                files.append(fn); crep["total_attack_frames"] += 1
                states.append({"frame": i, "action": action, "duration_ms": cell["duration_ms"],
                               "transform": cell["transform"], **info})
                gif_frames.append((fn, odir)); gif_durs.append(cell["duration_ms"])
            gif_durs[-1] += 250
            crep["sets"][setname] = {"kind": "attack", "family": fam, "files": files, "frames": states}
            print(creature, setname, [f["action"] for f in states])
        # GIF (pilot timings)
        fr, du = [], []
        for (fn, od), ms in zip(gif_frames, gif_durs):
            im = Image.open(os.path.join(od, fn)).convert("RGBA").resize((256, 256), Image.NEAREST)
            bg = Image.new("RGBA", (256, 256), (24, 28, 40, 255)); bg.paste(im, (0, 0), im)
            fr.append(bg.convert("P", palette=Image.ADAPTIVE)); du.append(ms)
        gif_name = f"{creature}-attacks-{TAG}.gif"
        fr[0].save(os.path.join(OUT, gif_name), save_all=True, append_images=fr[1:], duration=du, loop=0)
        crep["gif_attacks"] = gif_name; crep["gif_frames"] = len(fr)
        print(creature, gif_name, len(fr), "frames, overlaid", crep["overlaid_frames"])
        report["creatures"][creature] = crep
    json.dump(report, open(os.path.join(OUT, f"manifest-{TAG}.json"), "w"), indent=1)
    print("manifest written")

if __name__ == "__main__":
    main()
