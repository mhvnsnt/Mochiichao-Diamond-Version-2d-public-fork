#!/usr/bin/env python3
"""LUSTRE VARIANT EXPANSION FULL BUILD (2026-10-26, Mars confirmed pilot ~19:29 CDT).
Remaining 46 creatures x 10 kinds = 460 looks. Pilot methods copied VERBATIM;
NO method revision (Showtime/Night achromatic weak spots carried as flagged).

shiny-v2 51/51 CONFIRMED and KEPT as base, but they read as made the same
way (single hue+40 rule = green-overlay feel). This pilot builds 10 DISTINCT
creation methods, one per LUSTRE kind, and applies them to 5 pilot creatures
with distinct body types (flyer / quadruped / blob-formless / biped / swimmer).

Pipeline (same skeleton as shiny-v2, different transforms):
  base front (freshest source per shiny-v2 SOURCE-LINEAGE) -> 16-colour
  MEDIANCUT quantize -> per-method palette transform -> rebuild -> swatch.

White-protection rule: palette entries with value >= 0.92 and saturation
<= 0.12 (pure whites: Wispkin mask, eye highlights) are NEVER recolored,
by any method. Wispkin's mask stays bone-white in all 10 variants.

Pokemon structure pulled (Black 2, most recent), recorded in the spec:
  roll  = PML_UtilPIDIsRare(id, pid), src/system/poke_tool.c:681
          (id_hi ^ id_lo ^ pid_hi ^ pid_lo) < 8  -> 8/65536 = 1/8192
  apply = FieldEncount_CreateWildPkm, src/ov036/enc_pokeset.c:332
          (rolls PID until rare; Shiny Charm +2 rolls; Pass Power modifies)
  look  = GetPokemonPaletteDataNo, src/system/pokegra.c:137
          (rare flag selects a HAND-AUTHORED alternate palette per species
          -- Pokemon does NOT use a formula. This pilot follows that lead:
          10 authored methods, not 1 overlay.)
Mars rate (his words, supersedes old split): 10 variants = 10x Pokemon's
chance -- each variant carries Pokemon's full base rate, so any-variant
~10/8192 = 1/819 with Black 2's 1/8192 base.

Staged only. NO PR, NO lock. Show-first.
"""
import colorsys
import json
import os
from PIL import Image
import numpy as np

BASE = os.path.expanduser('~/workspace/mochiichao-work/sprite-art')
EXP = os.path.join(BASE, 'animation/expanded-scope')
OUT = os.path.join(EXP, 'lane100', 'lustre-full-20261026')
os.makedirs(OUT, exist_ok=True)

LINEAGE = json.load(open(os.path.join(EXP, 'lane100', 'shiny-v2', 'SOURCE-LINEAGE.json')))

REMAINING = {'aquariios': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'ashemit': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'astroleviathan': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'chromejaww': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'cocoonode': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'cragarm': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'dorowani': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'dreadtoise': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'duneclaw': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'duskfiend': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'floatcalf': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'gabu': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'gearkid': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'gorokappa': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'inklet': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'kickmaster': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'kittember': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'krakenox': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'manticlaw': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'mechapion': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'megalochrome': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'mochii': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'mothrix': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'mythar': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'oblivirex': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'pebblefist': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'pixilite': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'pupbble': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'pyromonk': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'pyropaw': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'quakehound': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'razorgater': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'reaperdile': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'shellguard': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'sproutle': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'squirmite': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'stormtalon': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'strikechamp': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'strikechamp_unsuited': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'strikechamp_unsuited_full': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'terrapod': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'tiidebiite': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'toxitacle': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'tyrage': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'yogiferno': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)', 'zephling': 'shiny-v2 lineage source (see SOURCE-LINEAGE.json)'}
PILOT = REMAINING  # builder loops over PILOT name below; kept name to minimise diff

def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))

def shift_hue(h, dh):
    return (h + dh) % 1.0

def to_hsv(rgb):
    r, g, b = (c / 255.0 for c in rgb)
    return colorsys.rgb_to_hsv(r, g, b)

def to_rgb(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    return (int(round(r * 255)), int(round(g * 255)), int(round(b * 255)))

def is_white_protected(h, s, v):
    return v >= 0.92 and s <= 0.12

def is_achromatic(h, s, v):
    return s < 0.08 or v < 0.08

# Each method: (chromatic_fn, achromatic_fn) over (h, s, v).
def m_solar(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return 40 / 360, 0.25, v
    return shift_hue(h, 25 / 360), clamp(s * 1.15), clamp(v + 0.10)

def m_lunar(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return 230 / 360, 0.25, v
    return shift_hue(h, -35 / 360), clamp(s * 0.90), clamp(v - 0.15)

def m_prism(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        band = 280 / 360 if v < 0.33 else (190 / 360 if v < 0.66 else 320 / 360)
        return band, 0.50, v
    # split chromatic hues into 3 rotated bands by hue sector
    sector = int(h * 3) % 3
    dh = (120 / 360, -120 / 360, 0.0)[sector]
    return shift_hue(h, dh), clamp(s * 1.20), v

def m_bare(h, s, v):
    # Stripped-down natural tones: accents collapse to body tones.
    if is_white_protected(h, s, v):
        return h, s, v
    return h, clamp(s * 0.50), v

def m_clothed(h, s, v):
    # Coordinated garment colorway: accents take deep teal-navy uniform tones.
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return 220 / 360, 0.35, clamp(v * 0.80)
    return 205 / 360, clamp(s * 1.10), v

def m_showtime(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return h, s, 1.0 if v > 0.66 else v
    return h, clamp(s * 1.40), clamp(v + 0.05)

def m_iron(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return 210 / 360, 0.12, clamp(0.35 + v * 0.40)
    return 210 / 360, clamp(s * 0.45), clamp(0.35 + v * 0.40)

def m_ember(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return 15 / 360, 0.60, v
    # pull hue toward ember range 10-30 deg
    target = 20 / 360
    dh = (target - h + 0.5) % 1.0 - 0.5
    return shift_hue(h, dh * 0.7), clamp(s * 1.25), clamp(v - 0.05)

def m_night(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return (190 / 360, 0.30, 1.0) if v > 0.85 else (h, s, clamp(v * 0.50))
    return h, clamp(s * 1.20), clamp(v * 0.55)

def m_parade(h, s, v):
    if is_white_protected(h, s, v):
        return h, s, v
    if is_achromatic(h, s, v):
        return (280 / 360, 0.35, v) if v < 0.66 else (45 / 360, 0.30, v)
    return h, clamp(s * 1.50), clamp(v + 0.10)

METHODS = {
    'solar': m_solar, 'lunar': m_lunar, 'prism': m_prism, 'bare': m_bare,
    'clothed': m_clothed, 'showtime': m_showtime, 'iron': m_iron,
    'ember': m_ember, 'night': m_night, 'parade': m_parade,
}
ORDER = ['solar', 'lunar', 'prism', 'bare', 'clothed',
         'showtime', 'iron', 'ember', 'night', 'parade']

def load_base(creature):
    src = LINEAGE[creature]['source']
    p = os.path.join(BASE, src)
    img = Image.open(p).convert('RGBA')
    return img, src

def quantize_palette(img):
    """16-colour MEDIANCUT palette like shiny-v2, alpha-aware."""
    alpha = img.split()[3]
    rgb = img.convert('RGB')
    q = rgb.quantize(colors=16, method=Image.MEDIANCUT)
    pal = q.getpalette()[:48]
    palette = [tuple(pal[i * 3:i * 3 + 3]) for i in range(16)]
    idx = np.array(q, dtype=np.uint8)
    return palette, idx, np.array(alpha)

def remap(img, fn):
    palette, idx, alpha = quantize_palette(img)
    new_pal = []
    for rgb in palette:
        h, s, v = to_hsv(rgb)
        nh, ns, nv = fn(h, s, v)
        new_pal.append(to_rgb(nh, ns, nv))
    arr = np.zeros((idx.shape[0], idx.shape[1], 4), dtype=np.uint8)
    pal_arr = np.array(new_pal, dtype=np.uint8)
    arr[..., 0] = pal_arr[idx, 0]
    arr[..., 1] = pal_arr[idx, 1]
    arr[..., 2] = pal_arr[idx, 2]
    arr[..., 3] = alpha
    return Image.fromarray(arr, 'RGBA'), palette, new_pal

def hexcol(rgb):
    return '#%02x%02x%02x' % rgb

def swatch(palette, path, cell=16):
    im = Image.new('RGB', (cell * len(palette), cell), (255, 255, 255))
    px = im.load()
    for i, c in enumerate(palette):
        for y in range(cell):
            for x in range(cell):
                px[i * cell + x, y] = c
    im.save(path)

manifest = {}
for creature, body in PILOT.items():
    base, src = load_base(creature)
    cdir = os.path.join(OUT, creature)
    os.makedirs(cdir, exist_ok=True)
    base.save(os.path.join(cdir, f'{creature}-base.png'))
    manifest[creature] = {'body': body, 'base_source': src, 'variants': {}}
    for name in ORDER:
        out_img, pal, new_pal = remap(base, METHODS[name])
        out_img.save(os.path.join(cdir, f'{creature}-lustre-{name}.png'))
        swatch(new_pal, os.path.join(cdir, f'{creature}-lustre-{name}-swatch.png'))
        manifest[creature]['variants'][name] = {
            'palette_before': [hexcol(c) for c in pal],
            'palette_after': [hexcol(c) for c in new_pal],
            'palette_changed': sum(1 for a, b in zip(pal, new_pal) if a != b),
        }

json.dump(manifest, open(os.path.join(OUT, 'lustre-full-new-manifest-20261026.json'), 'w'), indent=2)

# Show sheets: per creature (normal + shiny-v2 + 10 variants), 4x tiles.
from PIL import ImageDraw
TILE = 128
for creature in PILOT:
    cdir = os.path.join(OUT, creature)
    tiles = []
    base = Image.open(os.path.join(cdir, f'{creature}-base.png')).convert('RGBA')
    tiles.append(('BASE', base))
    sv2 = os.path.join(EXP, 'lane100', 'shiny-v2', f'{creature}_shiny_front.png')
    if os.path.exists(sv2):
        tiles.append(('SHINY-V2', Image.open(sv2).convert('RGBA')))
    for name in ORDER:
        tiles.append((name.upper(), Image.open(os.path.join(cdir, f'{creature}-lustre-{name}.png')).convert('RGBA')))
    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGBA', (cols * TILE, rows * (TILE + 18)), (255, 255, 255, 255))
    d = ImageDraw.Draw(sheet)
    for i, (label, im) in enumerate(tiles):
        r, c = divmod(i, cols)
        x, y = c * TILE, r * (TILE + 18)
        t = im.resize((TILE, TILE), Image.NEAREST)
        sheet.paste(t, (x, y), t)
        d.text((x + 4, y + TILE + 2), label, fill=(0, 0, 0))
    sheet.save(os.path.join(cdir, f'{creature}-lustre-show-sheet-20261026.png'))

# Combined sheets BATCHED (not one giant file): 6 batches over 46 creatures.
BATCHES = [list(REMAINING)[i:i+8] for i in range(0, len(REMAINING), 8)]
ctile = 64
for bi, batch in enumerate(BATCHES, start=1):
    comb = Image.new('RGBA', (10 * ctile, len(batch) * (ctile + 14)), (255, 255, 255, 255))
    d = ImageDraw.Draw(comb)
    for ri, creature in enumerate(batch):
        cdir = os.path.join(OUT, creature)
        for ci, name in enumerate(ORDER):
            im = Image.open(os.path.join(cdir, f'{creature}-lustre-{name}.png')).convert('RGBA')
            t = im.resize((ctile, ctile), Image.NEAREST)
            x, y = ci * ctile, ri * (ctile + 14)
            comb.paste(t, (x, y), t)
        d.text((4, ri * (ctile + 14) + ctile + 1), creature, fill=(0, 0, 0))
    comb.save(os.path.join(OUT, f'lustre-full-combined-batch{bi}-20261026.png'))
    print(f'combined batch {bi}: {len(batch)} creatures -> lustre-full-combined-batch{bi}-20261026.png')

# Distinctness check: no two variants of same creature share an identical palette.
bad = []
for creature, m in manifest.items():
    seen = {}
    for name, v in m['variants'].items():
        key = tuple(v['palette_after'])
        if key in seen:
            bad.append((creature, seen[key], name))
        seen[key] = name
print('creatures:', len(manifest), 'variants each:', len(ORDER), 'total looks:', sum(len(m['variants']) for m in manifest.values()))
print('identical-palette collisions:', bad if bad else 'NONE')
for creature, m in manifest.items():
    print(creature, {k: v['palette_changed'] for k, v in m['variants'].items()})
