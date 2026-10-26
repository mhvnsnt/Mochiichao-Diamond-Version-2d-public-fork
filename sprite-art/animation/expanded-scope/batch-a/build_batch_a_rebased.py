#!/usr/bin/env python3
"""BATCH A BUILD (2026-10-26) — expanded-scope Batch A, 8 creatures.
Pilot pattern per creature: 4 attacks + 4 hurts = 8 sets / 36 cells.
  attacks: physical strike (5), special/projectile (5), type-signature (6),
           heavy/finisher (6); hurts: light flinch (3), heavy knockback (4),
           status wobble (3), near-faint stagger (4).
Method: transforms of existing locked/game-ready battle_front cells + existing
hurt cells + procedural PIL VFX overlays. 0 image generations.
Set names are STAGING LABELS, not canon move names — no move names invented.
Never writes outside animation/expanded-scope/batch-a/<creature>/ .
Work canvas 256px, final cells 64x64 RGBA. Full body kept in frame every cell.
Sources (locked manifests, battle_front role):
  razorgater cell_04, tyrage cell_03, kittember cell_02, sproutle cell_00,
  tiidebiite cell_00, aquariios cell_00a, chromejaww cell_01, reaperdile cell_01.
Hurt sources: animation/hurt/<c>/<c>_hurt_cell_00.png, except sproutle which
uses the canonical v2 cell (sproutle_hurt_cell_00_v2.png; v1 superseded).
"""
import json, math, os, random
from PIL import Image, ImageDraw, ImageEnhance

BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art")
GR = os.path.join(BASE, "game-ready")
AN = os.path.join(BASE, "animation")
OUT = os.path.join(BASE, "animation/expanded-scope/batch-a")
S = 256

FRONT = {
    "razorgater": "razorgater_cell_04.png",
    "tyrage": "tyrage_cell_03.png",
    "kittember": "kittember_cell_02.png",
    "sproutle": "sproutle_cell_00.png",
    "tiidebiite": "tiidebiite_cell_00.png",
    "aquariios": "aquariios_cell_00a.png",
    "chromejaww": "chromejaww_cell_01.png",
    "reaperdile": "reaperdile_cell_01.png",
}
HURT = {c: f"{c}_hurt_cell_00.png" for c in FRONT}
HURT["sproutle"] = "sproutle_hurt_cell_00_v2.png"

# Per-creature staging flavour: (label, special VFX kind, signature VFX kind)
# Flavours are staging labels drawn from the creature's own name/theme, NOT
# canon move/type claims.
FLAVOUR = {
    "razorgater": ("razor slash", "slash", "slash"),
    "tyrage": ("rage flame", "flame", "flame"),
    "kittember": ("ember", "flame", "flame"),
    "sproutle": ("leaf / seed", "leaf", "leaf"),
    "tiidebiite": ("tide water", "water", "water"),
    "aquariios": ("aqua water", "water", "water"),
    "chromejaww": ("chrome steel", "steel", "steel"),
    "reaperdile": ("shadow", "shadow", "shadow"),
}

def load(path):
    return Image.open(path).convert("RGBA").resize((S, S), Image.LANCZOS)

def compose(body, dx=0, dy=0, sx=1.0, sy=1.0, rot=0, flash=0.0, darken=1.0, tint=None):
    w = int(S * sx); h = int(S * sy)
    b = body.resize((max(1, w), max(1, h)), Image.LANCZOS)
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    canvas.alpha_composite(b, (128 - b.width // 2 + dx, 232 - b.height + dy))
    if rot:
        canvas = canvas.rotate(rot, resample=Image.BICUBIC, center=(128, 200))
    if flash > 0:
        white = Image.new("RGBA", (S, S), (255, 255, 255, 0))
        white.putalpha(canvas.split()[3].point(lambda v: int(v * flash)))
        canvas = Image.alpha_composite(canvas, white)
    if darken != 1.0:
        canvas = ImageEnhance.Brightness(canvas).enhance(darken)
    if tint:
        ov = Image.new("RGBA", (S, S), tint)
        ov.putalpha(canvas.split()[3].point(lambda v: int(v * 0.28)))
        canvas = Image.alpha_composite(canvas, ov)
    return canvas

def finish(canvas, overlays):
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for fn in overlays:
        fn(d)
    return Image.alpha_composite(canvas, layer).resize((64, 64), Image.LANCZOS)

# ---------- generic VFX ----------
def burst(cx, cy, r=34, color=(255, 215, 60, 255)):
    def fn(d):
        pts = []
        for i in range(16):
            ang = i * math.pi / 8
            rr = r if i % 2 == 0 else r * 0.45
            pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
        d.polygon(pts, fill=color)
        d.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=(255, 255, 255, 255))
    return fn

def speedlines(y0=140):
    def fn(d):
        for i in range(4):
            y = y0 + i * 20
            d.line([(198, y), (255, y)], fill=(255, 255, 255, 210), width=5)
    return fn

def streaks(y0=150, n=4):
    def fn(d):
        for i in range(n):
            y = y0 + i * 18
            d.line([(150, y), (240, y)], fill=(255, 255, 255, 170), width=4)
    return fn

def dust(y=232):
    def fn(d):
        for x, r in [(70, 10), (110, 14), (170, 12), (215, 9)]:
            d.ellipse([x - r, y - r, x + r, y + r // 2], fill=(200, 185, 160, 170))
    return fn

def bubbles(cx=150, cy=70, n=4, color=(140, 230, 140, 230)):
    def fn(d):
        for i in range(n):
            x = cx + i * 16 - (i % 2) * 8; y = cy - i * 12; r = 7 + i
            d.ellipse([x - r, y - r, x + r, y + r], outline=color, width=3)
    return fn

def dizzy(cx=150, cy=70):
    def fn(d):
        for i, (dx, dy) in enumerate([(-18, 0), (18, -8), (0, -18)]):
            d.ellipse([cx + dx - 7, cy + dy - 7, cx + dx + 7, cy + dy + 7], fill=(255, 220, 60, 255))
    return fn

def ring(cx, cy, r, color=(255, 255, 255, 200), width=6):
    def fn(d):
        d.ellipse([cx - r, cy - r // 3, cx + r, cy + r // 3], outline=color, width=width)
    return fn

def scatter(n, x0, y0, spread, color, rmin=4, rmax=9, seed=7):
    def fn(d):
        rnd = random.Random(seed)
        for _ in range(n):
            x = x0 + rnd.randint(0, spread); y = y0 + rnd.randint(-24, 24)
            r = rnd.randint(rmin, rmax)
            d.ellipse([x - r, y - r, x + r, y + r], fill=color)
    return fn

def jet(x0, x1, y, thick=16, color=(80, 170, 255, 235), dark=(20, 60, 140, 255)):
    def fn(d):
        d.rounded_rectangle([x0, y - thick // 2 - 4, x1, y + thick // 2 + 4], radius=thick // 2 + 4, fill=dark)
        d.rounded_rectangle([x0, y - thick // 2, x1, y + thick // 2], radius=thick // 2, fill=color)
        d.ellipse([x1 - 12, y - thick, x1 + 14, y + thick], fill=(255, 255, 255, 200))
    return fn

def slash(cx, cy, r=46, color=(230, 240, 255, 255)):
    """Diagonal slash arcs: two curved strokes + spark tips."""
    def fn(d):
        d.arc([cx - r, cy - r, cx + r, cy + r], start=300, end=30, fill=color, width=10)
        d.arc([cx - r + 18, cy - r + 18, cx + r + 18, cy + r + 18], start=300, end=30, fill=(160, 180, 210, 255), width=5)
        for (x, y) in [(cx + r, cy - 10), (cx + 10, cy - r)]:
            d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(255, 255, 255, 255))
    return fn

def wave(y=238):
    def fn(d):
        for i in range(6):
            x = 20 + i * 38
            d.arc([x, y - 26, x + 38, y + 12], start=180, end=360, fill=(30, 90, 200, 255), width=9)
            d.arc([x, y - 22, x + 38, y + 10], start=180, end=360, fill=(140, 210, 255, 255), width=5)
        d.ellipse([20, y - 4, 250, y + 10], fill=(80, 170, 255, 190))
    return fn

# flavour projectile / impact per kind
def projectile(kind, x0=175, x1=255, y=150, thick=16):
    if kind == "water":
        return [jet(x0, x1, y, thick)]
    if kind == "flame":
        return [jet(x0, x1, y, thick, color=(255, 140, 40, 235), dark=(140, 30, 0, 255)),
                scatter(5, x1 - 20, y, 18, (255, 200, 60, 230), seed=11)]
    if kind == "leaf":
        return [jet(x0, x1, y, thick, color=(90, 200, 90, 235), dark=(20, 90, 30, 255)),
                scatter(6, x0, y - 10, 70, (60, 180, 80, 230), seed=13)]
    if kind == "steel":
        return [jet(x0, x1, y, thick - 4, color=(200, 210, 225, 240), dark=(60, 70, 90, 255)),
                scatter(6, x1 - 40, y, 36, (255, 220, 90, 240), rmin=2, rmax=5, seed=17)]
    if kind == "shadow":
        return [jet(x0, x1, y, thick, color=(120, 80, 180, 235), dark=(30, 10, 60, 255)),
                scatter(5, x0, y - 10, 70, (160, 120, 220, 200), seed=19)]
    if kind == "slash":  # blade projectile: silver streak + slash arc at tip
        return [jet(x0, x1, y, thick - 6, color=(225, 235, 250, 240), dark=(90, 110, 140, 255)),
                slash(x1 - 12, y, 22)]
    return [jet(x0, x1, y, thick)]

def impact(kind, cx=225, cy=150):
    if kind == "water":
        return [burst(cx, cy, 30, (120, 200, 255, 255)), scatter(6, cx - 25, cy - 10, 50, (140, 210, 255, 230), seed=23)]
    if kind == "flame":
        return [burst(cx, cy, 32, (255, 150, 40, 255)), scatter(6, cx - 25, cy - 10, 50, (255, 200, 60, 230), seed=29)]
    if kind == "leaf":
        return [burst(cx, cy, 30, (110, 210, 110, 255)), scatter(8, cx - 30, cy - 10, 60, (60, 180, 80, 230), seed=31)]
    if kind == "steel":
        return [burst(cx, cy, 30, (210, 220, 235, 255)), scatter(8, cx - 25, cy - 10, 50, (255, 220, 90, 240), rmin=2, rmax=5, seed=37)]
    if kind == "shadow":
        return [burst(cx, cy, 32, (140, 100, 200, 255)), scatter(6, cx - 25, cy - 10, 50, (160, 120, 220, 210), seed=41)]
    if kind == "slash":
        return [slash(cx, cy, 40), burst(cx, cy, 18, (235, 242, 255, 255))]
    return [burst(cx, cy, 30)]

# ---------- set definitions (shared structure, flavour varies) ----------
SET_NAMES = {
    "razorgater": ("atk_physical_razor_rush", "atk_special_blade_wave", "atk_signature_cross_slash", "atk_heavy_jaw_crash_finisher"),
    "tyrage": ("atk_physical_rage_charge", "atk_special_rage_blast", "atk_signature_tyrant_flare", "atk_heavy_cataclysm_finisher"),
    "kittember": ("atk_physical_ember_pounce", "atk_special_ember_spray", "atk_signature_inferno_pounce", "atk_heavy_blaze_crash_finisher"),
    "sproutle": ("atk_physical_vine_lunge", "atk_special_seed_shot", "atk_signature_bloom_burst", "atk_heavy_overgrowth_finisher"),
    "tiidebiite": ("atk_physical_tide_ram", "atk_special_tide_jet", "atk_signature_surge_barrage", "atk_heavy_tsunami_finisher"),
    "aquariios": ("atk_physical_aqua_ram", "atk_special_aqua_jet", "atk_signature_abyss_cannon", "atk_heavy_maelstrom_finisher"),
    "chromejaww": ("atk_physical_chrome_bite", "atk_special_steel_shot", "atk_signature_chrome_barrage", "atk_heavy_iron_crash_finisher"),
    "reaperdile": ("atk_physical_shadow_lunge", "atk_special_umbral_bolt", "atk_signature_reaper_sweep", "atk_heavy_doom_crash_finisher"),
}

def build_sets(creature, F, H):
    kind = FLAVOUR[creature][1]
    phys, spec, sig, heavy = SET_NAMES[creature]
    return {
        phys: [
            (F, dict(sx=1.15, sy=0.82, dy=4), [], 180, "windup squash, from battle_front"),
            (F, dict(sx=0.92, sy=1.08, dx=8, rot=-4), [], 120, "lean into lunge"),
            (F, dict(sx=1.18, sy=0.88, dx=30), [streaks()], 100, "physical lunge, stretched"),
            (F, dict(sx=1.25, sy=0.75, dx=38), impact(kind, 215, 165), 90, "impact squash + flavour burst"),
            (F, dict(), [], 300, "recover to rest pose"),
        ],
        spec: [
            (F, dict(sx=0.95, sy=1.05), [scatter(5, 150, 120, 60, (255, 255, 255, 160))], 200, "gather"),
            (F, dict(sx=0.9, sy=1.12, dx=-10, rot=-3), [], 140, "aim, stretched tall, shifted left for projectile room"),
            (F, dict(sx=1.05, sy=0.95, dx=-24), projectile(kind, 175, 255, 150, 16), 110, "projectile streams right past body to frame edge"),
            (F, dict(sx=0.95, sy=1.0, dx=-24), projectile(kind, 170, 255, 150, 20) + [scatter(4, 240, 150, 12, (255, 255, 255, 180))], 110, "projectile extended, splash head"),
            (F, dict(), [], 300, "recover"),
        ],
        sig: [
            (F, dict(sx=1.0, sy=1.0), [scatter(4, 140, 110, 50, (255, 255, 255, 160))], 200, "signature ready"),
            (F, dict(sx=0.88, sy=1.15, dy=-2), [scatter(8, 130, 95, 80, (255, 255, 255, 180))], 220, "charge: compressed tall, particles orbit"),
            (F, dict(sx=1.1, sy=0.92, dx=-20), projectile(kind, 175, 255, 145, 20), 100, "signature blast starts, shifted left"),
            (F, dict(sx=1.15, sy=0.9, dx=-20), projectile(kind, 170, 255, 145, 26) + impact(kind, 248, 145), 140, "full blast to frame edge + impact burst"),
            (F, dict(sx=1.05, sy=0.95, dx=-10), impact(kind, 225, 150), 120, "splash/impact"),
            (F, dict(), [], 300, "recover"),
        ],
        heavy: [
            (F, dict(sx=1.2, sy=0.78, dy=6), [], 220, "deep crouch"),
            (F, dict(sx=0.85, sy=1.2, dy=-6), [scatter(6, 120, 90, 80, (255, 255, 255, 170))], 160, "rise, energy gathering"),
            (F, dict(sx=1.15, sy=0.95, dx=10), ([wave(232)] if kind == "water" else []) + projectile(kind, 160, 240, 150, 20), 140, "finisher surge + projectile"),
            (F, dict(sx=1.3, sy=0.72, dx=16), impact(kind, 220, 160) + [ring(128, 225, 90)], 120, "crash + impact burst + shockwave ring"),
            (F, dict(sx=1.1, sy=0.85, dx=8), [dust(232)], 100, "dust/particles settling"),
            (F, dict(sx=0.98, sy=0.98), [], 420, "exhausted recover, slower"),
        ],
        "hurt_light_flinch": [
            (H, dict(sx=0.95, sy=1.02, dx=-8, rot=3), [], 120, "flinch back, hurt cell"),
            (H, dict(sx=0.9, sy=1.05, dx=-14, rot=5), [], 180, "flinch peak, pushed back"),
            (F, dict(), [], 220, "recover to rest"),
        ],
        "hurt_heavy_knockback": [
            (H, dict(flash=0.55, dx=-4), [], 80, "hit flash (white)"),
            (H, dict(sx=0.92, sy=1.05, dx=-30, rot=10), [streaks(140, 3)], 140, "knocked back + tilted"),
            (H, dict(sx=1.1, sy=0.85, dx=-34, dy=4), [dust(232)], 180, "skid low, dust"),
            (F, dict(), [], 300, "recover"),
        ],
        "hurt_status_wobble": [
            (H, dict(rot=-8, dx=-6), [bubbles()], 220, "wobble left + status bubbles"),
            (H, dict(rot=8, dx=6), [bubbles(160, 70)], 220, "wobble right + status bubbles"),
            (F, dict(tint=(120, 220, 120, 255)), [bubbles(150, 80, 2)], 300, "settling, faint green status tint"),
        ],
        "hurt_near_faint_stagger": [
            (H, dict(rot=-6, sx=0.95, sy=1.0, dx=-6), [], 260, "stagger lean"),
            (H, dict(rot=4, sx=1.05, sy=0.88, dy=4, darken=0.82), [], 260, "droop, darkened"),
            (H, dict(rot=-4, sx=0.98, sy=0.92, darken=0.82), [dizzy()], 260, "sway, dizzy stars"),
            (F, dict(sx=1.05, sy=0.9, darken=0.88), [], 400, "barely standing, dimmed"),
        ],
    }

for creature in ["razorgater", "tyrage"]:
    outdir = os.path.join(OUT, creature + "-rebased")
    os.makedirs(outdir, exist_ok=True)
    FRONT_ABS = {
        "razorgater": os.path.join(OUT, "corrected-bases", "razorgater_cell_04_groundblob_removed.png"),
        "tyrage": os.path.join(OUT, "corrected-bases", "tyrage_cell_03_spotfree.png"),
    }
    front = load(FRONT_ABS[creature])
    HURT_ABS = {
        "razorgater": os.path.join(AN, "hurt", "razorgater", "razorgater_hurt_cell_00_clean.png"),
        "tyrage": os.path.join(AN, "hurt", "tyrage", "tyrage_hurt_cell_00.png"),
    }
    hurt = load(HURT_ABS[creature])
    srcmap = {"F": FRONT_ABS[creature] + " (CORRECTED base, see SOURCE-FRESHNESS.md)",
              "H": HURT_ABS[creature] + " (corrected/verified base)"}
    key_by_id = {id(front): "F", id(hurt): "H"}
    sets = build_sets(creature, front, hurt)
    man = {"creature": creature, "batch": "batch-a-rebased", "rebases": "batch-a (old locked bases, previews preserved untouched)",
           "base_provenance": "corrected-bases/ (spot/blob removed, cracks + design whites intact) — see SOURCE-FRESHNESS.md", "pilot_pattern": "expanded-scope pilot (mochii/dreadtoise)",
           "date": "2026-10-26",
           "method": "transform_from_existing_cells + procedural PIL VFX overlays; 0 image generations",
           "canon_note": ("Original canon-draft likeness only; set names are staging labels, not canon move names. "
                          f"Flavour: {FLAVOUR[creature][0]}. Full body kept in frame every cell."),
           "cell_size": 64, "sets": {}}
    for setname, cells in sets.items():
        files = []; total = 0; details = []
        for i, (src, kw, ovs, ms, note) in enumerate(cells):
            cell = finish(compose(src, **kw), ovs)
            assert cell.size == (64, 64)
            fname = f"{setname}_cell_{i:02d}.png"
            cell.save(os.path.join(outdir, fname))
            files.append(fname); total += ms
            details.append({"file": fname, "duration_ms": ms,
                            "source": srcmap[key_by_id[id(src)]],
                            "transform": str(kw), "note": note})
        man["sets"][setname] = {"kind": "attack" if setname.startswith("atk_") else "hurt",
                                "cell_count": len(files), "total_ms": total,
                                "files": files, "cells": details}
    for kind, prefix in [("attacks", "atk_"), ("hurts", "hurt_")]:
        names = [n for n in sets if n.startswith(prefix)]
        maxc = max(len(sets[n]) for n in names)
        sheet = Image.new("RGBA", (maxc * 136 + 8, len(names) * 136 + 8), (40, 40, 48, 255))
        for ri, name in enumerate(names):
            for ci, (src, kw, ovs, ms, note) in enumerate(sets[name]):
                cell = finish(compose(src, **kw), ovs).resize((128, 128), Image.NEAREST)
                sheet.alpha_composite(cell, (8 + ci * 136, 8 + ri * 136))
        sheet.convert("RGB").save(os.path.join(outdir, f"preview_{kind}_4x.png"))
        man[f"preview_{kind}"] = f"preview_{kind}_4x.png (rows in set order: {', '.join(names)})"
    with open(os.path.join(outdir, f"{creature}.batch-a-manifest.json"), "w") as f:
        json.dump(man, f, indent=1)
    tot = sum(v["cell_count"] for v in man["sets"].values())
    print(creature, tot, "cells,", len(man["sets"]), "sets")
print("DONE")
