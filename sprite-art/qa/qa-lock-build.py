#!/usr/bin/env python3
"""Build qa-lock-manifest.json: SHA-256 for every locked QA file.
Locked set (canonical, cell counts unchanged — manifests are NOT edited):
- game-ready/<set>/cells/*.png, icons/*.png, *_atlas_64_locked.png
  (the *_clean.png variants created by spot_check are listed separately
  under clean_variants, never overwriting a canonical file)
- animation/idle/<set>/idle_a|b|c.png (+ _clean variants listed separately;
  Razorgater idle _clean files are Mars-approved presentation variants)
- animation/attack/<set>/attack_a|b|c|d.png (+ _clean variants)
  strikechamp_unsuited_full: 7 extracted cells from its game-ready set
  (attack manifest lists cells 21-27; no 4-frame transform set exists)
- animation/hurt/<set>/*_hurt_cell_00.png (+ _clean variants;
  Razorgater hurt _clean is Mars-approved)
- walk-frames/<set>/*_walk_*.png for sets with a complete 8-frame set
- icons/<set>/*_icon_v1.png (standalone canonical icons; only 2 exist)
- title finals: intro frames 01-04, aeon intro, starter S1 x5, title-bg v2
  (title-bg v1 is DEFECTIVE — Tyrage missing, Gabu duplicated — NOT locked)
Excluded: media-generation raws, .webp sources, manifests/json, _clean2
duplicates of Razorgater idle (superseded by _clean; retained on disk).
Run: python3 qa-lock-build.py   (from sprite-art/qa/)
"""
import hashlib, json, os, glob

BASE = "/home/hatch/workspace/mochiichao-work/sprite-art"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "qa-lock-manifest.json")

def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def rel(p):
    return os.path.relpath(p, BASE)

files = {}   # rel -> {sha256, bytes, role}
clean_variants = {}  # canonical rel -> [clean rel]

def add(path, role):
    r = rel(path)
    files[r] = {"sha256": sha(path), "bytes": os.path.getsize(path), "role": role}

def add_clean_variants(canonical_path):
    stem = canonical_path[:-4]
    for c in sorted(glob.glob(stem + "_clean.png")):
        clean_variants.setdefault(rel(canonical_path), []).append(rel(c))
        # clean variants are also hash-recorded, under their own path
        files[rel(c)] = {"sha256": sha(c), "bytes": os.path.getsize(c), "role": "clean_variant"}

sets = sorted(d for d in os.listdir(f"{BASE}/game-ready")
              if os.path.isdir(f"{BASE}/game-ready/{d}") and d != "__pycache__")
for s in sets:
    for p in sorted(glob.glob(f"{BASE}/game-ready/{s}/cells/*.png")):
        if "_clean" not in p:
            add(p, "atlas_cell"); add_clean_variants(p)
    for p in sorted(glob.glob(f"{BASE}/game-ready/{s}/icons/*.png")):
        if "_clean" not in p:
            add(p, "atlas_icon"); add_clean_variants(p)
    for p in sorted(glob.glob(f"{BASE}/game-ready/{s}/*_atlas_64_locked.png")):
        add(p, "atlas_sheet"); add_clean_variants(p)
    for f in ("idle_a.png", "idle_b.png", "idle_c.png"):
        p = f"{BASE}/animation/idle/{s}/{f}"
        if os.path.exists(p):
            add(p, "idle"); add_clean_variants(p)
    for f in ("attack_a_windup.png", "attack_b_strike.png", "attack_c_impact.png", "attack_d_recover.png"):
        p = f"{BASE}/animation/attack/{s}/{f}"
        if os.path.exists(p):
            add(p, "attack"); add_clean_variants(p)
    for p in sorted(glob.glob(f"{BASE}/animation/hurt/{s}/*_hurt_cell_00.png")):
        add(p, "hurt"); add_clean_variants(p)
    walks = sorted(glob.glob(f"{BASE}/walk-frames/{s}/*_walk_*.png"))
    walks = [w for w in walks if "_clean" not in w]
    if len(walks) == 8:
        for w in walks:
            add(w, "walk"); add_clean_variants(w)
    for p in sorted(glob.glob(f"{BASE}/icons/{s}/*_icon_v1.png")):
        add(p, "icon_standalone")

title_finals = [
    "title/aeon-intro-frame-v1.png",
    "title/intro-frame-01-world-dawn-v1.png",
    "title/intro-frame-02-starter-trio-v1.png",
    "title/intro-frame-03-dorowani-gabu-faceoff-v1.png",
    "title/intro-frame-04-silhouette-reveal-mochii-v1.png",
    "title/intro-frame-04-silhouette-reveal-mochii-v2-no-cream.png",
    "title/starter-dorowani-s1.png", "title/starter-gabu-s1.png",
    "title/starter-mochii-s1.png", "title/starter-razorgater-s1.png",
    "title/starter-tyrage-s1.png", "title/title-bg-key-art-v2.png",
]
for t in title_finals:
    p = f"{BASE}/{t}"
    if os.path.exists(p):
        add(p, "title")

manifest = {
    "generated": "2026-10-25 (Step 6 QA lock)",
    "rule": "SHA-256 freeze: any later change to a locked file changes its hash and breaks this manifest. Originals are never overwritten; fixes land as *_clean.png variants.",
    "sets": len(sets),
    "files": files,
    "clean_variants": clean_variants,
}
with open(OUT, "w") as fh:
    json.dump(manifest, fh, indent=1, sort_keys=True)
roles = {}
for v in files.values():
    roles[v["role"]] = roles.get(v["role"], 0) + 1
print(f"sets={len(sets)} files={len(files)} roles={roles} clean_variant_links={sum(len(v) for v in clean_variants.values())}")
print(f"wrote {OUT}")
