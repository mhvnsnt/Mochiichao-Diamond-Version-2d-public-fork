#!/usr/bin/env python3
"""PICK-A BACK-VIEW SETS — STRIKECHAMP + SHELLGUARD, 2026-10-26. Staged only, NO PR, NO lock.

Mars picked A for both (2026-10-26 ~18:23 CDT): A = the RELABELED cell,
not the generated back. Strikechamp back = locked atlas cell 4 (256,0);
Shellguard back = locked atlas cell 1 (64,0). The generated backs for
these two are SUPERSEDED (kept, not deleted) and the trueback-sets built
from them are now stale for these two creatures — this build replaces
them with sets from the pick-A cells. The other 8 creatures' trueback
sets are NOT touched.

Method: the batch-1 compose pipeline verbatim (body scaled about
bottom-centre at 256px, paste (128-w/2+dx, 232-h+dy), rotate about
(128,200), flash/darken/tint at 256px, LANCZOS downscale to 64px),
EXCEPT identity-transform frames, which are byte copies of the source
pick-A cell so the identity gate holds exactly. Transform tables are
read from the verified post-rework chromejaww manifest — attacks travel
RIGHT (dx > 0 on impacts), hurts recoil LEFT (dx < 0). Zero face
overlays: true backs show no expression, ever. Body sets only — the
back-view hand pass is a separate job and is NOT included here.

Source cells: extracted directly from the locked atlases
(game-ready/strikechamp/strikechamp_atlas_64_locked.png crop (256,0) and
game-ready/shellguard/shellguard_atlas_64_locked.png crop (64,0)) and
saved as provenance files in this dir. No baked ground shadow is present
in either pick-A cell (bottom rows carry feet only), so no shadowfree
variant is needed. Timing: front-manifest durations verbatim (0-diff);
back-idle uses each creature's own front-idle timing file.
"""
import json, os, shutil
from PIL import Image, ImageDraw, ImageEnhance

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
OUT = os.path.join(BASE, "animation/expanded-scope/articulation-back-view/trueback-sets-pickA-20261026")
OLD = os.path.join(BASE, "animation/expanded-scope/articulation-back-view/trueback-sets-20261026")
IDLE = os.path.join(BASE, "animation/idle")
BV = os.path.join(BASE, "animation/expanded-scope/articulation-back-view")
S = 256
DARK = (24, 28, 40, 255)

ATK_NAMES = {
    "strikechamp": ("atk_physical_champ_punch", "atk_special_power_shot", "atk_signature_champ_barrage", "atk_heavy_knockout_finisher"),
    "shellguard": ("atk_physical_shell_ram", "atk_special_aqua_jet", "atk_signature_shield_barrage", "atk_heavy_fortress_crash_finisher"),
}
# (locked atlas path, crop box) per the FRONT-BACK-SWAP-MANIFEST-20261026.json
ATLAS_SRC = {
    "strikechamp": ("game-ready/strikechamp/strikechamp_atlas_64_locked.png", (256, 0, 320, 64)),
    "shellguard": ("game-ready/shellguard/shellguard_atlas_64_locked.png", (64, 0, 128, 64)),
}
HURT_NAMES = ("hurt_light_flinch", "hurt_heavy_knockback", "hurt_status_wobble", "hurt_near_faint_stagger")
FAMILIES = ("atk_physical", "atk_special", "atk_signature", "atk_heavy")


def compose(body256, t):
    sx, sy = t.get("sx", 1.0), t.get("sy", 1.0)
    dx, dy = t.get("dx", 0), t.get("dy", 0)
    w, h = max(1, int(S * sx)), max(1, int(S * sy))
    b = body256.resize((w, h), Image.LANCZOS)
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    canvas.alpha_composite(b, (128 - b.width // 2 + dx, 232 - b.height + dy))
    if t.get("rot"):
        canvas = canvas.rotate(t["rot"], resample=Image.BICUBIC, center=(128, 200))
    if t.get("flash", 0) > 0:
        white = Image.new("RGBA", (S, S), (255, 255, 255, 0))
        white.putalpha(canvas.split()[3].point(lambda v: int(v * t["flash"])))
        canvas = Image.alpha_composite(canvas, white)
    if t.get("darken", 1.0) != 1.0:
        canvas = ImageEnhance.Brightness(canvas).enhance(t["darken"])
    if t.get("tint"):
        ov = Image.new("RGBA", (S, S), tuple(t["tint"]))
        ov.putalpha(canvas.split()[3].point(lambda v: int(v * 0.28)))
        canvas = Image.alpha_composite(canvas, ov)
    return canvas.resize((64, 64), Image.LANCZOS)


def gif_frame(png64):
    im = Image.open(png64).convert("RGBA").resize((256, 256), Image.NEAREST)
    bg = Image.new("RGBA", (256, 256), DARK)
    bg.alpha_composite(im)
    return bg.convert("RGB")


def centroid_x(png64):
    import numpy as np
    a = np.array(Image.open(png64).convert("RGBA").split()[3]).astype(float)
    tot = a.sum()
    if tot == 0:
        return None
    xs = np.arange(64)
    return float((a.sum(axis=0) * xs).sum() / tot)


def main():
    ref = json.load(open(os.path.join(BV, "chromejaww/manifest-back-20261026.json")))
    tables = {}
    for fam in FAMILIES:
        key = [k for k, s in ref["sets"].items() if s["kind"] == "attack" and s["family"] == fam.replace("atk_", "")][0]
        tables[fam] = [(c["duration_ms"], c["transform_back"]) for c in ref["sets"][key]["cells"]]
    for fam in HURT_NAMES:
        tables[fam] = [(c["duration_ms"], c["transform_back"]) for c in ref["sets"][fam]["cells"]]
    summary = {}
    for c, atknames in ATK_NAMES.items():
        atlas_rel, box = ATLAS_SRC[c]
        atlas = Image.open(os.path.join(BASE, atlas_rel)).convert("RGBA")
        src = os.path.join(OUT, f"{c}-back-pickA-20261026.png")
        atlas.crop(box).save(src)
        od = os.path.join(OUT, c)
        os.makedirs(od, exist_ok=True)
        base64 = Image.open(src).convert("RGBA")
        assert base64.size == (64, 64), (c, base64.size)
        body256 = base64.resize((S, S), Image.LANCZOS)
        base_cx = centroid_x(src)
        sets = {}
        atk_frames, atk_durs, hurt_frames, hurt_durs = [], [], [], []
        n_png = 0
        atk_ok, atk_tot, hurt_ok, hurt_tot = 0, 0, 0, 0
        ident_ok = 0
        for fam, atkname in zip(FAMILIES, atknames):
            cells = []
            for i, (dur, bt) in enumerate(tables[fam]):
                fn = f"{c}-pickA-20261026-{atkname}-cell-{i:02d}.png"
                fp = os.path.join(od, fn)
                if not bt:
                    shutil.copyfile(src, fp)
                    gate = {"identity_byte_identical_to_source": True}
                    ident_ok += 1
                else:
                    compose(body256, bt).save(fp)
                    gate = {"identity_byte_identical_to_source": False,
                            "rederived_from_source_with_recorded_transform": True,
                            "no_overlay_pixels": True}
                cells.append({"file": fn, "duration_ms": dur,
                              "source": f"trueback-sets-pickA-20261026/{c}-back-pickA-20261026.png (pick-A relabeled locked cell)",
                              "transform_back": bt, "gate": gate})
                atk_frames.append(gif_frame(fp))
                atk_durs.append(dur)
                n_png += 1
                if i in (2, 3, 4) and bt.get("dx", 0) > 0:
                    atk_tot += 1
                    cx = centroid_x(fp)
                    if cx is not None and base_cx is not None and cx > base_cx:
                        atk_ok += 1
            sets[atkname] = {"kind": "attack", "family": fam.replace("atk_", ""), "cell_count": len(cells),
                             "total_ms": sum(d for d, _ in tables[fam]), "timing_diff_ms": 0,
                             "files": [x["file"] for x in cells], "cells": cells}
        for fam in HURT_NAMES:
            cells = []
            for i, (dur, bt) in enumerate(tables[fam]):
                fn = f"{c}-pickA-20261026-{fam}-cell-{i:02d}.png"
                fp = os.path.join(od, fn)
                if not bt:
                    shutil.copyfile(src, fp)
                    gate = {"identity_byte_identical_to_source": True}
                    ident_ok += 1
                else:
                    compose(body256, bt).save(fp)
                    gate = {"identity_byte_identical_to_source": False,
                            "rederived_from_source_with_recorded_transform": True,
                            "no_overlay_pixels": True}
                cells.append({"file": fn, "duration_ms": dur,
                              "source": f"trueback-sets-pickA-20261026/{c}-back-pickA-20261026.png (pick-A relabeled locked cell)",
                              "transform_back": bt, "gate": gate})
                hurt_frames.append(gif_frame(fp))
                hurt_durs.append(dur)
                n_png += 1
                if fam == "hurt_light_flinch" and i == 1:
                    hurt_tot += 1
                    cx = centroid_x(fp)
                    if cx is not None and base_cx is not None and cx < base_cx:
                        hurt_ok += 1
                if fam == "hurt_heavy_knockback" and i in (1, 2):
                    hurt_tot += 1
                    cx = centroid_x(fp)
                    if cx is not None and base_cx is not None and cx < base_cx:
                        hurt_ok += 1
                if fam == "hurt_status_wobble" and i == 0:
                    hurt_tot += 1
                    cx = centroid_x(fp)
                    if cx is not None and base_cx is not None and cx < base_cx:
                        hurt_ok += 1
            sets[fam] = {"kind": "hurt", "family": fam, "cell_count": len(cells),
                         "total_ms": sum(d for d, _ in tables[fam]), "timing_diff_ms": 0,
                         "files": [x["file"] for x in cells], "cells": cells}
        idle_timing = json.load(open(os.path.join(IDLE, c, f"{c}.idle.timing-20261026.json")))
        idle_durs = idle_timing["frame_durations_ms"]
        idle_cells, idle_frames, idle_gd = [], [], []
        for i, (bt, dur) in enumerate(zip([{}, {"dy": -12}, {}, {"dy": 8}], idle_durs)):
            fn = f"{c}-pickA-20261026-back-idle-cell-{i:02d}.png"
            fp = os.path.join(od, fn)
            if not bt:
                shutil.copyfile(src, fp)
                ident_ok += 1
            else:
                compose(body256, bt).save(fp)
            idle_cells.append({"file": fn, "duration_ms": dur,
                               "source": f"trueback-sets-pickA-20261026/{c}-back-pickA-20261026.png (pick-A relabeled locked cell)",
                               "transform_back": bt, "note": "gentle bob from pick-A back cell"})
            idle_frames.append(gif_frame(fp))
            idle_gd.append(dur)
            n_png += 1
        sets["back_idle"] = {"kind": "idle", "cell_count": len(idle_cells), "total_ms": sum(idle_durs),
                             "front_idle_total_ms": sum(idle_durs), "timing_diff_ms": 0,
                             "front_idle_source": f"animation/idle/{c}/{c}.idle.timing-20261026.json",
                             "files": [x["file"] for x in idle_cells], "cells": idle_cells}
        atk_gif = f"{c}-pickA-attacks-20261026.gif"
        hurt_gif = f"{c}-pickA-hurts-20261026.gif"
        idle_gif = f"{c}-pickA-idle-20261026.gif"
        atk_frames[0].save(os.path.join(od, atk_gif), save_all=True, append_images=atk_frames[1:], duration=atk_durs, loop=0)
        hurt_frames[0].save(os.path.join(od, hurt_gif), save_all=True, append_images=hurt_frames[1:], duration=hurt_durs, loop=0)
        idle_frames[0].save(os.path.join(od, idle_gif), save_all=True, append_images=idle_frames[1:], duration=idle_gd, loop=0)
        # identity gate: every identity-transform frame byte-identical to source
        ident_frames = []
        for sname, s in sets.items():
            for cell in s["cells"]:
                if cell["gate"].get("identity_byte_identical_to_source") if "gate" in cell else False:
                    ident_frames.append(cell["file"])
        ident_checked = 0
        for fn in ident_frames:
            if open(os.path.join(od, fn), "rb").read() == open(src, "rb").read():
                ident_checked += 1
        manifest = {"creature": c, "view": "back", "tag": "trueback-sets-pickA-20261026",
                    "date": "2026-10-26", "staging_only": True, "no_pr": True,
                    "authority": "Mars 2026-10-26 ~18:23 CDT: 'I'm picking A for both of them' (A = relabeled cell, not generated back).",
                    "method": "Batch-1 compose pipeline verbatim at 256px, post-rework direction tables (chromejaww manifest): attacks RIGHT, hurts LEFT. No face overlays (true backs, no faces). Body sets only — back-view hand pass is a separate job, NOT included.",
                    "source_pickA_cell": f"trueback-sets-pickA-20261026/{c}-back-pickA-20261026.png",
                    "source_locked_atlas": atlas_rel, "source_atlas_xy": list(box[:2]),
                    "direction": "right",
                    "face": {"face_visible_in_back_cell": False, "back_overlay_action": "none — true back, no face visible"},
                    "direction_check": {"attack_impacts_centroid_right": f"{atk_ok}/{atk_tot}",
                                        "hurt_primaries_centroid_left": f"{hurt_ok}/{hurt_tot}",
                                        "identity_frames_byte_identical": f"{ident_checked}/{len(ident_frames)}"},
                    "supersedes": {
                        "generated_back_cell": f"animation/expanded-scope/trueback-pixel-20261026/cells/{c}-back-pixel-20261026.png (kept, SUPERSEDED, not deleted)",
                        "generated_back_smooth": "trueback-20261026/gen/ (kept, SUPERSEDED, not deleted)",
                        "generated_sets_dir": f"animation/expanded-scope/articulation-back-view/trueback-sets-20261026/{c}/ (kept, SUPERSEDED, not deleted; old manifest gained a status field only, art files untouched)",
                        "reason": "Mars pick A (relabeled cell) over generated back, 2026-10-26 ~18:23 CDT"},
                    "sets": sets,
                    "gifs": {"attacks": atk_gif, "hurts": hurt_gif, "back_idle": idle_gif}}
        with open(os.path.join(od, "manifest-pickA-20261026.json"), "w") as f:
            json.dump(manifest, f, indent=1)
        summary[c] = {"attack_sets": 4, "attack_frames": 22, "hurt_sets": 4, "hurt_frames": 14,
                      "idle_frames": 4, "total_png": n_png, "source": f"trueback-sets-pickA-20261026/{c}-back-pickA-20261026.png",
                      "attack_centroid_right": f"{atk_ok}/{atk_tot}", "hurt_centroid_left": f"{hurt_ok}/{hurt_tot}",
                      "identity_byte_identical": f"{ident_checked}/{len(ident_frames)}"}
        print(c, summary[c])
    # combined contact sheet: attack impact (physical cell-03) | hurt knockback (heavy cell-01)
    rows = list(ATK_NAMES.keys())
    W = 128 * 2 + 170
    sheet = Image.new("RGBA", (W, 128 * len(rows) + 30), DARK)
    d = ImageDraw.Draw(sheet)
    d.text((6, 6), "PICK-A BACK SETS — attack impact (physical cell-03) | hurt knockback (heavy cell-01)", fill=(255, 255, 0, 255))
    for r, c in enumerate(rows):
        y = 30 + r * 128
        d.text((6, y + 52), c, fill=(255, 255, 255, 255))
        for j, fn in enumerate([f"{c}-pickA-20261026-{ATK_NAMES[c][0]}-cell-03.png",
                                f"{c}-pickA-20261026-hurt_heavy_knockback-cell-01.png"]):
            im = Image.open(os.path.join(OUT, c, fn)).convert("RGBA").resize((128, 128), Image.NEAREST)
            bg = Image.new("RGBA", (128, 128), DARK)
            bg.alpha_composite(im)
            sheet.alpha_composite(bg, (170 + j * 128, y))
    sheet.save(os.path.join(OUT, "pickA-sets-contact-sheet-20261026.png"))
    # per-creature before/after sheets: SUPERSEDED generated vs PICK A
    for c in rows:
        W2 = 128 * 6 + 170
        s2 = Image.new("RGBA", (W2, 128 + 60), DARK)
        d2 = ImageDraw.Draw(s2)
        d2.text((6, 6), f"{c}: SUPERSEDED generated (left of each pair) vs PICK A relabeled cell (right)", fill=(255, 255, 0, 255))
        d2.text((6, 28), "attack impact | hurt knockback | idle", fill=(255, 255, 255, 255))
        pairs = [
            (os.path.join(OLD, c, f"{c}-trueback-20261026-{ATK_NAMES[c][0]}-cell-03.png"),
             os.path.join(OUT, c, f"{c}-pickA-20261026-{ATK_NAMES[c][0]}-cell-03.png")),
            (os.path.join(OLD, c, f"{c}-trueback-20261026-hurt_heavy_knockback-cell-01.png"),
             os.path.join(OUT, c, f"{c}-pickA-20261026-hurt_heavy_knockback-cell-01.png")),
            (os.path.join(OLD, c, f"{c}-trueback-20261026-back-idle-cell-00.png"),
             os.path.join(OUT, c, f"{c}-pickA-20261026-back-idle-cell-00.png")),
        ]
        for k, (old_fp, new_fp) in enumerate(pairs):
            for j, fp in enumerate((old_fp, new_fp)):
                im = Image.open(fp).convert("RGBA").resize((128, 128), Image.NEAREST)
                bg = Image.new("RGBA", (128, 128), DARK)
                bg.alpha_composite(im)
                s2.alpha_composite(bg, (170 + (k * 2 + j) * 128, 60))
        s2.save(os.path.join(OUT, c, f"{c}-pickA-before-after-20261026.png"))
    with open(os.path.join(OUT, "pickA-sets-summary-20261026.json"), "w") as f:
        json.dump(summary, f, indent=1)
    print("sheets saved")
    print(json.dumps(summary, indent=1))


if __name__ == "__main__":
    main()
