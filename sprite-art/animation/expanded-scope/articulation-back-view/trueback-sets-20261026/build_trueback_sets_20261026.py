#!/usr/bin/env python3
"""STEP 2 — TRUE-BACK FULL BACK-VIEW SETS, 2026-10-26. Staged only, NO PR, NO lock.

Builds complete back-view sets (4 attack sets / 22 frames + 4 hurt sets /
14 frames + back-idle 4 frames = 40 PNGs + 3 GIFs per creature) from the
Step 1 pixel true-back cells, for all 10 creatures (9 batch PASS +
Razorgater clean retry). New dated dir; NEVER overwrites the existing
staged back-view sets or anything Mars has seen.

Method: the batch-1 compose pipeline verbatim (body scaled about
bottom-centre at 256px, paste (128-w/2+dx, 232-h+dy), rotate about
(128,200), flash/darken/tint at 256px, LANCZOS downscale to 64px),
EXCEPT identity-transform frames, which are byte copies of the source
pixel cell so the identity gate holds exactly. Transform tables are read
from the verified post-rework chromejaww manifest (batches 1/2
convention) — attacks travel RIGHT (dx > 0 on impacts, opponent on the
right), hurts recoil LEFT (dx < 0). This is the CURRENT direction rule
(Mars 2026-10-26 ~15:27 CDT), NOT the old up-lunge mirror. No face
overlays on true backs (zero faces visible in these cells). Body sets
only — the back-view hand pass is a separate running job and is NOT
included here.

Source cells: <creature>-back-pixel-shadowfree-20261026.png when the
shadow pass wrote one, else <creature>-back-pixel-20261026.png; the
manifest records exactly which file was used per creature. Timing:
front-manifest durations verbatim (0-diff); back-idle uses each
creature's own front-idle timing file. Stormtalon + Shellguard had no
idle set in their old batch-3 dirs — these new sets ADD one (noted).
"""
import json, os, shutil
from PIL import Image, ImageDraw, ImageEnhance

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
PIX = os.path.join(BASE, "animation/expanded-scope/trueback-pixel-20261026/cells")
OUT = os.path.join(BASE, "animation/expanded-scope/articulation-back-view/trueback-sets-20261026")
IDLE = os.path.join(BASE, "animation/idle")
BV = os.path.join(BASE, "animation/expanded-scope/articulation-back-view")
S = 256
DARK = (24, 28, 40, 255)

ATK_NAMES = {
    "reaperdile": ("atk_physical_shadow_lunge", "atk_special_umbral_bolt", "atk_signature_reaper_sweep", "atk_heavy_doom_crash_finisher"),
    "chromejaww": ("atk_physical_chrome_bite", "atk_special_steel_shot", "atk_signature_chrome_barrage", "atk_heavy_iron_crash_finisher"),
    "strikechamp": ("atk_physical_champ_punch", "atk_special_power_shot", "atk_signature_champ_barrage", "atk_heavy_knockout_finisher"),
    "stormtalon": ("atk_physical_talon_strike", "atk_special_lightning_jet", "atk_signature_thunder_barrage", "atk_heavy_tempest_crash_finisher"),
    "duskfiend": ("atk_physical_shadow_lunge", "atk_special_umbral_bolt", "atk_signature_dusk_sweep", "atk_heavy_nightmare_finisher"),
    "finblade": ("atk_physical_blade_ram", "atk_special_aqua_jet", "atk_signature_blade_barrage", "atk_heavy_maelstrom_finisher"),
    "mechapion": ("atk_physical_steel_strike", "atk_special_plasma_shot", "atk_signature_mecha_barrage", "atk_heavy_iron_crash_finisher"),
    "wispkin": ("atk_physical_wisp_lunge", "atk_special_wisp_shot", "atk_signature_phantom_barrage", "atk_heavy_haunt_finisher"),
    "shellguard": ("atk_physical_shell_ram", "atk_special_aqua_jet", "atk_signature_shield_barrage", "atk_heavy_fortress_crash_finisher"),
    "razorgater": ("atk_physical_razor_rush", "atk_special_blade_wave", "atk_signature_cross_slash", "atk_heavy_jaw_crash_finisher"),
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
    tables = {}  # family -> [(dur, transform), ...]
    for fam in FAMILIES:
        key = [k for k, s in ref["sets"].items() if s["kind"] == "attack" and s["family"] == fam.replace("atk_", "")][0]
        tables[fam] = [(c["duration_ms"], c["transform_back"]) for c in ref["sets"][key]["cells"]]
    for fam in HURT_NAMES:
        tables[fam] = [(c["duration_ms"], c["transform_back"]) for c in ref["sets"][fam]["cells"]]
    summary = {}
    for c, atknames in ATK_NAMES.items():
        sf = os.path.join(PIX, f"{c}-back-pixel-shadowfree-20261026.png")
        df = os.path.join(PIX, f"{c}-back-pixel-20261026.png")
        src = sf if os.path.exists(sf) else df
        assert os.path.exists(src), f"no pixel cell for {c}"
        od = os.path.join(OUT, c)
        os.makedirs(od, exist_ok=True)
        base64 = Image.open(src).convert("RGBA")
        assert base64.size == (64, 64), (c, base64.size)
        body256 = base64.resize((S, S), Image.LANCZOS)
        base_cx = centroid_x(src)
        sets = {}
        atk_frames, atk_durs, hurt_frames, hurt_durs = [], [], [], []
        n_png = 0
        atk_ok, hurt_ok, hurt_tot = 0, 0, 0
        for fam, atkname in zip(FAMILIES, atknames):
            cells = []
            for i, (dur, bt) in enumerate(tables[fam]):
                fn = f"{c}-trueback-20261026-{atkname}-cell-{i:02d}.png"
                fp = os.path.join(od, fn)
                if not bt:
                    shutil.copyfile(src, fp)
                    gate = {"identity_byte_identical_to_source": True}
                else:
                    compose(body256, bt).save(fp)
                    gate = {"identity_byte_identical_to_source": False,
                            "rederived_from_source_with_recorded_transform": True,
                            "no_overlay_pixels": True}
                cells.append({"file": fn, "duration_ms": dur,
                              "source": f"trueback-pixel-20261026/cells/{os.path.basename(src)} (Step 1 pixel true-back cell)",
                              "transform_back": bt, "gate": gate})
                atk_frames.append(gif_frame(fp))
                atk_durs.append(dur)
                n_png += 1
                if i in (2, 3, 4) and bt.get("dx", 0) > 0:
                    cx = centroid_x(fp)
                    if cx is not None and base_cx is not None and cx > base_cx:
                        atk_ok += 1
            sets[atkname] = {"kind": "attack", "family": fam.replace("atk_", ""), "cell_count": len(cells),
                             "total_ms": sum(d for d, _ in tables[fam]), "timing_diff_ms": 0,
                             "files": [x["file"] for x in cells], "cells": cells}
        for fam in HURT_NAMES:
            cells = []
            for i, (dur, bt) in enumerate(tables[fam]):
                fn = f"{c}-trueback-20261026-{fam}-cell-{i:02d}.png"
                fp = os.path.join(od, fn)
                if not bt:
                    shutil.copyfile(src, fp)
                    gate = {"identity_byte_identical_to_source": True}
                else:
                    compose(body256, bt).save(fp)
                    gate = {"identity_byte_identical_to_source": False,
                            "rederived_from_source_with_recorded_transform": True,
                            "no_overlay_pixels": True}
                cells.append({"file": fn, "duration_ms": dur,
                              "source": f"trueback-pixel-20261026/cells/{os.path.basename(src)} (Step 1 pixel true-back cell)",
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
            fn = f"{c}-trueback-20261026-back-idle-cell-{i:02d}.png"
            fp = os.path.join(od, fn)
            if not bt:
                shutil.copyfile(src, fp)
            else:
                compose(body256, bt).save(fp)
            idle_cells.append({"file": fn, "duration_ms": dur,
                               "source": f"trueback-pixel-20261026/cells/{os.path.basename(src)} (Step 1 pixel true-back cell)",
                               "transform_back": bt, "note": "gentle bob from pixel true-back cell"})
            idle_frames.append(gif_frame(fp))
            idle_gd.append(dur)
            n_png += 1
        sets["back_idle"] = {"kind": "idle", "cell_count": len(idle_cells), "total_ms": sum(idle_durs),
                             "front_idle_total_ms": sum(idle_durs), "timing_diff_ms": 0,
                             "front_idle_source": f"animation/idle/{c}/{c}.idle.timing-20261026.json",
                             "files": [x["file"] for x in idle_cells], "cells": idle_cells}
        atk_gif = f"{c}-trueback-attacks-20261026.gif"
        hurt_gif = f"{c}-trueback-hurts-20261026.gif"
        idle_gif = f"{c}-trueback-idle-20261026.gif"
        atk_frames[0].save(os.path.join(od, atk_gif), save_all=True, append_images=atk_frames[1:], duration=atk_durs, loop=0)
        hurt_frames[0].save(os.path.join(od, hurt_gif), save_all=True, append_images=hurt_frames[1:], duration=hurt_durs, loop=0)
        idle_frames[0].save(os.path.join(od, idle_gif), save_all=True, append_images=idle_frames[1:], duration=idle_gd, loop=0)
        manifest = {"creature": c, "view": "back", "tag": "trueback-sets-20261026",
                    "date": "2026-10-26", "staging_only": True, "no_pr": True,
                    "method": "Batch-1 compose pipeline verbatim at 256px, post-rework direction tables (chromejaww manifest): attacks RIGHT, hurts LEFT. No face overlays (true backs, no faces). Body sets only — back-view hand pass is a separate running job, NOT included.",
                    "source_pixel_cell": os.path.relpath(src, BASE),
                    "direction": "right",
                    "face": {"face_visible_in_back_cell": False, "back_overlay_action": "none — true back, no face visible"},
                    "direction_check": {"attack_impacts_centroid_right": f"{atk_ok}/10",
                                        "hurt_primaries_centroid_left": f"{hurt_ok}/{hurt_tot}"},
                    "sets": sets,
                    "gifs": {"attacks": atk_gif, "hurts": hurt_gif, "back_idle": idle_gif}}
        with open(os.path.join(od, "manifest-trueback-20261026.json"), "w") as f:
            json.dump(manifest, f, indent=1)
        summary[c] = {"attack_sets": 4, "attack_frames": 22, "hurt_sets": 4, "hurt_frames": 14,
                      "idle_frames": 4, "total_png": n_png, "source": os.path.relpath(src, BASE),
                      "attack_centroid_right": f"{atk_ok}/10", "hurt_centroid_left": f"{hurt_ok}/{hurt_tot}"}
        print(c, summary[c])
    rows = list(ATK_NAMES.keys())
    W = 128 * 2 + 170
    sheet = Image.new("RGBA", (W, 128 * len(rows) + 30), DARK)
    d = ImageDraw.Draw(sheet)
    d.text((6, 6), "TRUE-BACK SETS — attack impact (physical cell-03) | hurt knockback (heavy cell-01)", fill=(255, 255, 0, 255))
    for r, c in enumerate(rows):
        y = 30 + r * 128
        d.text((6, y + 52), c, fill=(255, 255, 255, 255))
        for j, fn in enumerate([f"{c}-trueback-20261026-{ATK_NAMES[c][0]}-cell-03.png",
                                f"{c}-trueback-20261026-hurt_heavy_knockback-cell-01.png"]):
            im = Image.open(os.path.join(OUT, c, fn)).convert("RGBA").resize((128, 128), Image.NEAREST)
            bg = Image.new("RGBA", (128, 128), DARK)
            bg.alpha_composite(im)
            sheet.alpha_composite(bg, (170 + j * 128, y))
    sheet.save(os.path.join(OUT, "trueback-sets-contact-sheet-20261026.png"))
    with open(os.path.join(OUT, "trueback-sets-summary-20261026.json"), "w") as f:
        json.dump(summary, f, indent=1)
    print("contact sheet saved")
    print(json.dumps(summary, indent=1))


if __name__ == "__main__":
    main()
