#!/usr/bin/env python3
"""Build Wispkin + Dorowani LoRA training sets from Mochiichao canon art ONLY.

Sources (see DATASET-SOURCES.md for hashes):
  - canon cutouts of record (transparent RGBA)
  - Dorowani only: the 1600px avatar-stack transparent poster (same canon design, high-res)
  - TextRig build frames: deformations of the canon cutout pixels themselves
    (character-sheets manifest: rig texture md5 == canon cutout md5, "no redraw")

Every output is a 512x512 RGB image: the RGBA source composited on a flat
background (white / black / cream / gray). Augmentations: scale/placement,
upper-body and head crops. Horizontal flip: Dorowani ONLY (near-symmetric
design). Wispkin is NOT flipped - its cracked mask and smoke plume are
asymmetric, a mirror would teach a non-canon mirrored crack.
No donor-production art is used anywhere.
"""
import hashlib, json, os, shutil
from PIL import Image

ROOT = os.path.expanduser("~/workspace/avatar-tool-build/lora")
SHOW = os.path.expanduser("~/workspace/mochiichao-show")
CANVAS = 512
BGS = {"white": (255, 255, 255), "black": (0, 0, 0), "cream": (247, 240, 231), "gray": (184, 196, 204)}
BG_WORD = {"white": "on a plain white background", "black": "on a plain black background",
           "cream": "on a plain cream background", "gray": "on a plain gray background"}

CHARS = {
    "wispkin": {
        "trigger": "wispkin_mochii",
        "desc": ("Wispkin, a small ghost creature with a round black shadowy body, a cracked white skull mask "
                 "with two round black eye holes held by two small black hands, a black flame tip on top of its head, "
                 "and a wispy black smoke tail dissolving below"),
        "canon": f"{SHOW}/canon-cutouts/wispkin.png",
        "extra": [],
        "rig": [("float_idle", [0, 30, 60, 90]), ("float_up", [0, 24, 48, 71]), ("mask_tilt_left", [0, 12, 24, 36])],
        "flip": False,
    },
    "dorowani": {
        "trigger": "dorowani_mochii",
        "desc": ("Dorowani, a blue bipedal crocodile-like creature with a tall blue dorsal fin on its head, "
                 "red star-shaped cheek fins, red oval eyes, a long snout with small fangs, a pale cream belly, "
                 "long blue arms with clawed webbed hands, and a tan segmented shell on its back"),
        "canon": f"{SHOW}/canon-cutouts/dorowani.png",
        "extra": [f"{SHOW}/bundles/dorowani/dorowani.transparent.png"],
        "rig": [("idle_breathe", [0, 30, 60, 90]), ("water_orb_charge", [0, 26, 52, 77]), ("fin_flick", [0, 12, 24, 35])],
        "flip": True,
    },
}

def sha256(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()

def trim_rgba(im):
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im

def place(src_rgba, bg, frac_h=0.92, cx=0.5, ground=0.97, flip=False):
    im = trim_rgba(src_rgba.copy())
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    scale = (CANVAS * frac_h) / im.size[1]
    im = im.resize((max(1, round(im.size[0] * scale)), round(CANVAS * frac_h)), Image.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), BGS[bg])
    x = round(CANVAS * cx - im.size[0] / 2)
    y = round(CANVAS * ground - im.size[1])
    canvas.paste(im, (x, y), im)
    return canvas

def crop_place(src_rgba, bg, region, frac_w=0.92):
    """region = (top_frac, bottom_frac) of the trimmed sprite height."""
    im = trim_rgba(src_rgba.copy())
    top = round(im.size[1] * region[0]); bot = round(im.size[1] * region[1])
    im = im.crop((0, top, im.size[0], bot))
    scale = (CANVAS * frac_w) / im.size[0]
    if im.size[1] * scale > CANVAS * 0.96:
        scale = (CANVAS * 0.96) / im.size[1]
    im = im.resize((round(im.size[0] * scale), round(im.size[1] * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (CANVAS, CANVAS), BGS[bg])
    canvas.paste(im, ((CANVAS - im.size[0]) // 2, (CANVAS - im.size[1]) // 2), im)
    return canvas

def main():
    sources_doc = {}
    for name, cfg in CHARS.items():
        out = os.path.join(ROOT, "datasets", name)
        shutil.rmtree(out, ignore_errors=True)
        os.makedirs(out)
        srcs = [cfg["canon"]] + cfg["extra"]
        canon = Image.open(cfg["canon"]).convert("RGBA")
        hi = Image.open(cfg["extra"][0]).convert("RGBA") if cfg["extra"] else canon
        items = []  # (image, caption_suffix, view_word)
        style = "flat 2D cartoon illustration, clean black outlines, cel shading"
        # --- full body, backgrounds x scales (canon cutout) ---
        for bg in ["white", "black", "cream", "gray"]:
            items.append((place(canon, bg, 0.92), f"full body, standing, {BG_WORD[bg]}", "full body"))
        items.append((place(canon, "white", 0.70), f"full body, smaller in frame, {BG_WORD['white']}", "full body"))
        items.append((place(canon, "black", 0.70, cx=0.38), f"full body, off-center, {BG_WORD['black']}", "full body"))
        items.append((place(canon, "white", 0.55, ground=0.80), f"full body, floating pose, {BG_WORD['white']}", "full body"))
        # --- high-res source (Dorowani) or re-use canon at native detail ---
        items.append((place(hi, "white", 0.92), f"full body, standing, {BG_WORD['white']}", "full body"))
        items.append((place(hi, "cream", 0.85), f"full body, standing, {BG_WORD['cream']}", "full body"))
        # --- crops ---
        items.append((crop_place(canon, "white", (0.0, 0.55)), f"upper body close-up, {BG_WORD['white']}", "upper body"))
        items.append((crop_place(canon, "black", (0.0, 0.55)), f"upper body close-up, {BG_WORD['black']}", "upper body"))
        hf = 0.48 if name == "wispkin" else 0.50
        items.append((crop_place(hi, "white", (0.0, hf)), f"head and shoulders close-up, {BG_WORD['white']}", "close-up"))
        items.append((crop_place(hi, "gray", (0.0, hf)), f"head and shoulders close-up, {BG_WORD['gray']}", "close-up"))
        low_cap = "smoke tail close-up" if name == "wispkin" else "lower body and feet close-up"
        items.append((crop_place(canon, "cream", (0.45, 1.0)), f"{low_cap}, {BG_WORD['cream']}", "lower body"))
        # --- flip (Dorowani only, canon-safe near-symmetric design) ---
        if cfg["flip"]:
            items.append((place(canon, "white", 0.92, flip=True), f"full body, standing, {BG_WORD['white']}", "full body"))
            items.append((place(canon, "black", 0.92, flip=True), f"full body, standing, {BG_WORD['black']}", "full body"))
        # --- TextRig frames: canon pixels deformed (poses) ---
        rig_used = []
        for anim, frames in cfg["rig"]:
            for i, fidx in enumerate(frames):
                p = f"{SHOW}/character-sheets/build/{name}/{anim}/frames/f{fidx:03d}.png"
                fr = Image.open(p).convert("RGBA")
                bg = "white" if i % 2 == 0 else "black"
                items.append((place(fr, bg, 0.92), f"full body, animated pose from the {anim.replace('_',' ')} motion, {BG_WORD[bg]}", "full body"))
                rig_used.append(p)
                srcs.append(p)
        # --- write ---
        manifest_items = []
        for i, (im, suffix, view) in enumerate(items, 1):
            stem = f"{name}_{i:03d}"
            im.save(os.path.join(out, stem + ".png"))
            caption = f"{cfg['trigger']}, {cfg['desc']}, {suffix}, {style}"
            open(os.path.join(out, stem + ".txt"), "w").write(caption + "\n")
            manifest_items.append({"file": stem + ".png", "view": view, "caption": caption})
        sources_doc[name] = {
            "trigger": cfg["trigger"], "count": len(items), "flip_used": cfg["flip"],
            "sources": [{"path": p, "bytes": os.path.getsize(p), "sha256": sha256(p)} for p in dict.fromkeys(srcs)],
            "items": manifest_items,
        }
        print(name, len(items), "images")
    json.dump(sources_doc, open(os.path.join(ROOT, "datasets", "dataset-build.json"), "w"), indent=1)

if __name__ == "__main__":
    main()
