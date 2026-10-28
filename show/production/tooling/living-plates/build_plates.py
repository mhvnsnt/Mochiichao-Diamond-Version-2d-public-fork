#!/usr/bin/env python3
"""
Living Plates builder — EP01 Pond / Green / Dark Forest.
PROVISIONAL SPEC PLATES: painted procedurally from the canon colour/lighting
systems (COLOR-SYSTEM, LIGHTING-SYSTEM, LIVING-WORLD cycle catalogue) and the
Garden Gate plate's palette family. They are NOT canon painted art — the canon
painted plates for these locations do not exist on disk (see PLATES-REGISTRY.md
GAP entries). No characters, no names, no logos. No baked character shadows
(environment cloud-shadow is a composite-life layer, CL-1, per spec).
All scratch/output under ~/workspace — never /tmp.
"""
import math, random, hashlib, os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

W, H = 1280, 720
FPS = 24
DUR = 8.0
N = int(FPS * DUR)
OUT = os.path.expanduser("~/workspace/still-to-build/living-plates")
INK = (16, 16, 16)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def vgrad(w, h, top, bot):
    t = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    a = np.array(top, dtype=np.float32)[None, None, :]; b = np.array(bot, dtype=np.float32)[None, None, :]
    arr = (a + (b - a) * t).astype(np.uint8)
    return Image.fromarray(np.repeat(arr, w, axis=1), "RGB")
_BASE_CACHE = {}
def cached(key, fn):
    if key not in _BASE_CACHE: _BASE_CACHE[key] = fn()
    return _BASE_CACHE[key].copy()
def blob(draw, cx, cy, r, col, squash=0.72):
    draw.ellipse([cx - r, cy - r * squash, cx + r, cy + r * squash], fill=col)
def canopy(draw, cx, cy, s, cols, rng):
    for _ in range(9):
        ox, oy = rng.uniform(-s, s), rng.uniform(-s * .45, s * .45)
        r = rng.uniform(s * .35, s * .7)
        blob(draw, cx + ox, cy + oy, r, rng.choice(cols))
def soft_layer(size=W):
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))

# ---------------------------------------------------------------- POND BASE
def pond_base(dusk=False):
    if not dusk:
        img = vgrad(W, H, (112, 176, 208), (208, 240, 240))          # brand blues -> belly pale
    else:
        img = vgrad(W, H, (42, 62, 110), (232, 168, 96))               # dusk: deep blue -> amber band
        img = vgrad(W, H, (46, 66, 112), (176, 120, 92))
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(11)
    # distant treeline
    tree_cols = [(88, 148, 84), (106, 168, 92), (64, 122, 70), (140, 184, 104)] if not dusk else [(40, 66, 62), (52, 82, 70), (34, 54, 54)]
    for cx in range(-40, W + 60, 90):
        canopy(d, cx + rng.uniform(-18, 18), 252 + rng.uniform(-14, 14), rng.uniform(46, 74), tree_cols, rng)
    d.rectangle([0, 268, W, 330], fill=(96, 158, 82, 255) if not dusk else (44, 74, 60, 255))
    # banks
    d.ellipse([-320, 300, 620, 560], fill=(110, 172, 88, 255) if not dusk else (52, 88, 62, 255))
    d.ellipse([700, 300, 1620, 560], fill=(102, 164, 84, 255) if not dusk else (48, 82, 58, 255))
    # water body
    wtop, wbot = ((58, 144, 184), (112, 192, 208)) if not dusk else ((30, 62, 102), (62, 96, 138))
    water = vgrad(W, 330, wtop, wbot)
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse([-140, 318, W + 140, 760], fill=255)
    img.paste(water, (0, 390), mask.crop((0, 390, W, 720)).resize((W, 330)) if False else Image.new("L", (W, 330), 255))
    # simpler: draw water ellipse directly (opaque, graded via horizontal bands)
    for i in range(26):
        y0 = 330 + i * 15
        d.ellipse([-140, 318 + i * 4, W + 140, 760], outline=None, fill=lerp(wtop, wbot, i / 25))
    d.ellipse([-140, 318, W + 140, 760], outline=(220, 245, 245, 160), width=3)
    # far bank flowers dots
    for _ in range(90):
        x, y = rng.uniform(0, W), rng.uniform(292, 348)
        if 240 < x < 1040 and y > 322: continue
        d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=rng.choice([(240, 200, 90), (238, 170, 190), (250, 250, 240), (170, 150, 230)]))
    return img

def pond_still(dusk=False):
    img = pond_base(dusk)
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(23)
    # lily pads (static positions; motion version re-draws per frame)
    for (x, y, r) in LILIES:
        d.ellipse([x - r, y - r * .36, x + r, y + r * .36], fill=(52, 130, 66, 255), outline=(30, 96, 46, 255), width=2)
    if rng.random():  # one lily flower
        x, y, r = LILIES[1]
        for a in range(6):
            d.ellipse([x - 5 + 8 * math.cos(a), y - 10 + 4 * math.sin(a), x + 5 + 8 * math.cos(a), y + 2 + 4 * math.sin(a)], fill=(246, 190, 205, 255))
    draw_reeds(d, 0.0, dusk)
    return img

LILIES = [(330, 520, 44), (520, 592, 56), (880, 548, 48), (1035, 625, 60), (700, 478, 34)]
REEDS = [(86, 470), (128, 505), (180, 452), (1120, 470), (1176, 512), (1080, 448), (240, 428), (1010, 430)]
EMITTERS = [(420, 545), (760, 610), (980, 500)]

def draw_reeds(d, t, dusk=False, wind=1.0):
    col = (44, 108, 54, 255) if not dusk else (26, 62, 44, 255)
    tip = (122, 96, 52, 255) if not dusk else (84, 66, 38, 255)
    for i, (x, y) in enumerate(REEDS):
        sway = math.sin(2 * math.pi * t / 2.9 + i * 1.7) * 9 * wind
        for k in range(3):
            bx = x + (k - 1) * 9
            d.line([bx, y + 58, bx + sway * (0.6 + k * .25), y - 64 - k * 10], fill=col, width=5)
            if k == 1:
                d.ellipse([bx + sway - 5, y - 92, bx + sway + 5, y - 58], fill=tip)

def pond_frame(t, dusk=False):
    img = cached('pond-dusk' if dusk else 'pond-day', lambda: pond_base(dusk))
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(5)
    wind = 0.55 if dusk else 1.0   # dusk stakeout: air stilling (BED-POND-DUSK empties)
    # CL-1 cloud shadow on water/grass (day only, slow)
    if not dusk:
        sh = soft_layer(); sd = ImageDraw.Draw(sh)
        sx = -300 + (t / 13.0 % 1.6) * W
        sd.ellipse([sx, 330, sx + 520, 640], fill=(20, 50, 70, 46))
        img = Image.alpha_composite(img.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(40))).convert("RGB")
        d = ImageDraw.Draw(img, "RGBA")
    # AMB-POND-RIPPLE-01 — concentric rings, 3 motivated emitters, 3.7s sets
    for ei, (ex, ey) in enumerate(EMITTERS):
        for k in range(3):
            ph = ((t + ei * 1.23 + k * 1.23) % 3.7) / 3.7
            r = 6 + ph * 64
            a = int(165 * (1 - ph)) if not dusk else int(110 * (1 - ph))
            d.ellipse([ex - r, ey - r * .34, ex + r, ey + r * .34], outline=(225, 248, 250, a), width=2)
    # AMB-POND-SHIMMER-01 — sparkle field (day); dies at dusk
    if not dusk:
        srng = random.Random(99)
        for _ in range(46):
            x, y = srng.uniform(60, W - 60), srng.uniform(360, 690)
            tw = 0.5 + 0.5 * math.sin(t * 3.1 + x * .11 + y * .07)
            if tw > 0.72:
                s = 2 + 3 * tw
                d.line([x - s, y, x + s, y], fill=(255, 255, 255, int(200 * tw)), width=2)
                d.line([x, y - s * .5, x, y + s * .5], fill=(255, 255, 255, int(140 * tw)), width=1)
    # AMB-POND-LILY-01 — bob + <=2deg rotation illusion (x-skew offset)
    for li, (x, y, r) in enumerate(LILIES):
        bob = math.sin(2 * math.pi * t / 5.3 + li * 2.1) * 3
        rot = math.sin(2 * math.pi * t / 5.3 + li) * 3
        d.ellipse([x - r + rot, y - r * .36 + bob, x + r + rot, y + r * .36 + bob], fill=(52, 130, 66, 255) if not dusk else (30, 84, 46, 255), outline=(28, 92, 44, 255), width=2)
        d.polygon([(x + rot, y + bob), (x + r * .8 + rot, y - r * .2 + bob), (x + r * .55 + rot, y + r * .16 + bob)], fill=(40, 112, 56, 255) if not dusk else (24, 72, 40, 255))
    if not dusk:
        x, y, r = LILIES[1]; bob = math.sin(2 * math.pi * t / 5.3 + 2.1) * 3
        for a in range(6):
            d.ellipse([x - 5 + 8 * math.cos(a), y - 12 + bob + 4 * math.sin(a), x + 5 + 8 * math.cos(a), y + bob + 4 * math.sin(a)], fill=(246, 190, 205, 255))
    # AMB-POND-REED-01
    draw_reeds(d, t, dusk, wind)
    # clouds (day) / mist (dusk)
    if not dusk:
        cl = soft_layer(); cd = ImageDraw.Draw(cl)
        for ci, (cy, sp, s) in enumerate([(64, 7, 54), (110, 5, 38), (40, 9, 70)]):
            cx = ((ci * 430 + t * sp) % (W + 360)) - 180
            for ox, oy, r in [(0, 0, s), (s * .8, 8, s * .7), (-s * .8, 10, s * .62)]:
                cd.ellipse([cx + ox - r, cy + oy - r * .42, cx + ox + r, cy + oy + r * .42], fill=(255, 255, 255, 205))
        img = Image.alpha_composite(img.convert("RGBA"), cl.filter(ImageFilter.GaussianBlur(6))).convert("RGB")
        d = ImageDraw.Draw(img, "RGBA")
        # CL-2 pollen motes
        mrng = random.Random(7)
        for _ in range(22):
            x = (mrng.uniform(0, W) + t * 9) % W; y = mrng.uniform(300, 560) + math.sin(t + x * .05) * 5
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 244, 190, 150))
    else:
        # AMB-POND-MIST-01 — layered mist band drifting 11s, edges soft
        for band, (my, mh, ma) in enumerate([(430, 90, 52), (500, 110, 66), (575, 120, 44)]):
            ml = soft_layer(); mdd = ImageDraw.Draw(ml)
            off = math.sin(2 * math.pi * t / 11.0 + band * 2.0) * 26
            mdd.rectangle([-60 + off, my, W + 60 + off, my + mh], fill=(206, 222, 236, ma))
            img = Image.alpha_composite(img.convert("RGBA"), ml.filter(ImageFilter.GaussianBlur(26))).convert("RGB")
            d = ImageDraw.Draw(img, "RGBA")
        # silver rim line on water (POND-DUSK rim changes employer: sun -> dusk)
        d.line([0, 336, W, 336], fill=(196, 216, 238, 130), width=2)
    return img

# ---------------------------------------------------------------- GREEN BASE
def green_base():
    img = vgrad(W, H, (112, 176, 208), (176, 208, 240))
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(31)
    for cx in range(-30, W + 60, 110):
        canopy(d, cx + rng.uniform(-16, 16), 218 + rng.uniform(-12, 12), rng.uniform(52, 80),
               [(88, 148, 84), (110, 172, 96), (66, 124, 70), (146, 190, 108)], rng)
    d.rectangle([0, 236, W, H], fill=(104, 170, 84, 255))
    for _ in range(260):  # grass texture strokes (static base texture)
        x, y = rng.uniform(0, W), rng.uniform(250, H)
        tone = rng.choice([(92, 156, 76), (122, 186, 96), (80, 142, 66)])
        d.line([x, y, x + rng.uniform(-3, 3), y - rng.uniform(6, 14)], fill=tone, width=2)
    # path hint bottom-left (garden interior, STAGE-WIDE)
    d.polygon([(0, 720), (210, 720), (430, 560), (330, 560)], fill=(222, 208, 158, 255))
    return img

FLOWERS = [(180, 520), (300, 610), (520, 470), (760, 640), (940, 500), (1100, 600), (640, 560), (420, 660)]
def green_frame(t):
    img = cached('green', green_base)
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(3)
    # AMB-GREEN-CLOUDSHADOW-01 — 13s crossing
    sh = soft_layer(); sd = ImageDraw.Draw(sh)
    sx = -420 + (t / 13.0 % 1.5) * (W + 500)
    sd.ellipse([sx, 210, sx + 620, 660], fill=(18, 48, 30, 52))
    img = Image.alpha_composite(img.convert("RGBA"), sh.filter(ImageFilter.GaussianBlur(46))).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    # AMB-GREEN-GRASSWAVE-01 + grass blades bending with the travelling wave (6.1s)
    for gx in range(14, W, 22):
        for gy in (618, 664, 700):
            bend = 11 * math.sin(2 * math.pi * (gx / 880.0 - t / 6.1) + gy * .01)
            wave_lift = 6 * max(0.0, math.sin(2 * math.pi * (gx / 880.0 - t / 6.1)))
            d.line([gx, gy, gx + bend, gy - 22 - wave_lift], fill=(74, 138, 60, 255), width=3)
    # AMB-GREEN-FLOWER-01 — bob clusters 2.3s
    for fi, (x, y) in enumerate(FLOWERS):
        bob = math.sin(2 * math.pi * t / 2.3 + fi * 1.3) * 3.5
        d.line([x, y + 16, x + bob * .4, y - 8 + bob], fill=(58, 120, 52, 255), width=3)
        for a in range(5):
            px, py = x + 7 * math.cos(a * 1.256), y - 10 + bob + 4 * math.sin(a * 1.256)
            d.ellipse([px - 5, py - 4, px + 5, py + 4], fill=(244, 178, 196, 255))
        d.ellipse([x - 3, y - 13 + bob, x + 3, y - 7 + bob], fill=(246, 204, 92, 255))
    # canopy sway (slow, depth ratio: background ~1/2 rate)
    sway = math.sin(2 * math.pi * t / 4.7) * 4
    d.ellipse([sway - 60, 96, 300 + sway, 218], fill=(110, 172, 96, 110))
    d.ellipse([980 + sway, 90, 1340 + sway, 214], fill=(110, 172, 96, 110))
    # clouds
    cl = soft_layer(); cd = ImageDraw.Draw(cl)
    for ci, (cy, sp, s) in enumerate([(58, 7, 50), (104, 5, 34)]):
        cx = ((ci * 500 + t * sp) % (W + 340)) - 170
        cd.ellipse([cx - s, cy - s * .4, cx + s, cy + s * .4], fill=(255, 255, 255, 200))
        cd.ellipse([cx + s * .7 - s * .7, cy + 6 - s * .28, cx + s * .7 + s * .7, cy + 6 + s * .28], fill=(255, 255, 255, 200))
    img = Image.alpha_composite(img.convert("RGBA"), cl.filter(ImageFilter.GaussianBlur(6))).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    # AMB-GREEN-LEAF-01 — sparse single leaf drift (event-spawn, 1 per pass)
    lx = (t / 8.0) * (W + 80) - 40; ly = 300 + 120 * math.sin(t * .9) + t * 9
    if ly < 660:
        d.ellipse([lx - 9, ly - 5, lx + 9, ly + 5], fill=(140, 190, 92, 235))
        d.line([lx - 9, ly, lx + 9, ly], fill=(84, 138, 58, 255), width=1)
    return img

# ---------------------------------------------------------------- FOREST STILL
def forest_still():
    # FOREST-DAY "Refusal": high value, ~0 saturation, drained blue-green; flat, no key.
    img = vgrad(W, H, (196, 208, 202), (168, 182, 174))
    d = ImageDraw.Draw(img, "RGBA")
    rng = random.Random(47)
    # far trunks (pale, edges dissolving — rim withheld)
    for x in range(30, W, 64):
        wdt = rng.uniform(14, 26)
        d.rectangle([x, 60, x + wdt, 640], fill=(128, 142, 134, 255))
    d.rectangle([0, 560, W, H], fill=(142, 156, 146, 255))
    # near trunks (darker but still desaturated; NO warm colour anywhere)
    for x, wdt in [(70, 54), (300, 42), (560, 62), (830, 46), (1090, 58), (1210, 40)]:
        d.rectangle([x, -10, x + wdt, H], fill=(62, 76, 70, 255))
        d.rectangle([x + wdt - 7, -10, x + wdt, H], fill=(52, 64, 59, 255))
    # sparse dead canopy blobs, desaturated
    for cx in range(0, W, 150):
        canopy(d, cx + rng.uniform(-20, 20), 56 + rng.uniform(-14, 14), rng.uniform(56, 84),
               [(104, 120, 110), (116, 130, 120), (94, 110, 102)], rng)
    # ground litter — static, sparse; no pattern-fill (Colour System: Forest has none)
    for _ in range(50):
        x, y = rng.uniform(0, W), rng.uniform(580, 706)
        d.ellipse([x - 4, y - 2, x + 4, y + 2], fill=(110, 122, 112, 255))
    # overall drain: desaturate + lift (daylight that doesn't arrive)
    img = ImageEnhance.Color(img).enhance(0.32)
    img = ImageEnhance.Brightness(img).enhance(1.04)
    return img

# ---------------------------------------------------------------- AUDIO (synth, licence-clean by construction)
SR = 48000
def synth_bed(kind, seconds=8.0, path=""):
    n = int(SR * seconds); rng = np.random.default_rng(7)
    t = np.arange(n) / SR
    pink = np.cumsum(rng.standard_normal(n)); pink = pink / np.max(np.abs(pink))
    from scipy.signal import butter, sosfilt
    def lp(x, fc):
        sos = butter(2, fc, btype="low", fs=SR, output="sos"); return sosfilt(sos, x)
    if kind == "pond-day":
        base = lp(rng.standard_normal(n), 420) * 0.20
        lap = np.sin(2 * np.pi * .45 * t) * 0.5 + 0.5
        water = lp(rng.standard_normal(n), 900) * (0.05 + 0.10 * lap)
        rustle = lp(rng.standard_normal(n), 2600) * 0.018 * (0.6 + 0.4 * np.sin(2 * np.pi * t / 2.9))
        y = base * .4 + water + rustle
    elif kind == "pond-dusk":
        water = lp(rng.standard_normal(n), 700) * (0.05 + 0.05 * np.sin(2 * np.pi * .3 * t))
        fade = np.linspace(1.0, 0.55, n)  # insect layer thinning across the stakeout
        insect = np.sin(2 * np.pi * 4200 * t) * 0.006 * fade * (np.sin(2 * np.pi * 11 * t) > 0)
        y = water + insect + lp(rng.standard_normal(n), 300) * 0.05
    elif kind == "green-day":
        wind = lp(rng.standard_normal(n), 500) * (0.10 + 0.08 * np.sin(2 * np.pi * t / 6.1))
        grass = lp(rng.standard_normal(n), 3000) * 0.022 * (0.6 + 0.4 * np.sin(2 * np.pi * t / 6.1 + .8))
        y = wind + grass
    elif kind == "forest":
        y = lp(rng.standard_normal(n), 220) * 0.004  # engineered absence: room-tone hush only
    else:
        y = np.zeros(n)
    # seamless loop: crossfade ends
    xf = int(SR * .4); y[:xf] = y[:xf] * np.linspace(.4, 1, xf) + y[-xf:] * np.linspace(.6, 0, xf) if kind != "forest" else y[:xf]
    y = y / (np.max(np.abs(y)) + 1e-9) * (0.14 if kind != "forest" else 0.02)
    import wave, struct
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes(struct.pack("<%dh" % n, *np.clip(y * 32767, -32767, 32767).astype(np.int16)))
    return path

def render(frames_fn, out_mp4, audio_kind, still_png, name):
    fdir = os.path.join(OUT, "build", "frames-" + name)
    os.makedirs(fdir, exist_ok=True)
    for i in range(N):
        fr = frames_fn(i / FPS)
        fr.save(os.path.join(fdir, f"f{i:04d}.png"))
    wav = os.path.join(OUT, "build", name + "-bed.wav")
    synth_bed(audio_kind, DUR, wav)
    os.system(f'ffmpeg -y -v error -framerate {FPS} -i "{fdir}/f%04d.png" -i "{wav}" '
              f'-c:v libx264 -pix_fmt yuv420p -crf 20 -r {FPS} -c:a aac -b:a 96k -shortest "{out_mp4}"')
    print("built", out_mp4)

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""): h.update(c)
    return h.hexdigest()

if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "pond"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "green"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "forest"), exist_ok=True)
    # stills
    pond_still(False).save(os.path.join(OUT, "pond", "EP01-PLATE-pond-day-v0-spec-still.png"))
    pond_still(True).save(os.path.join(OUT, "pond", "EP01-PLATE-pond-dusk-v0-spec-still.png"))
    green_base().save(os.path.join(OUT, "green", "EP01-PLATE-green-day-v0-spec-still.png"))
    # green still with flowers at t=0 for a representative base
    green_frame(0.0).save(os.path.join(OUT, "green", "EP01-PLATE-green-day-v0-spec-still.png"))
    forest_still().save(os.path.join(OUT, "forest", "EP01-PLATE-dark-forest-day-v1-still.png"))
    # living videos
    render(lambda t: pond_frame(t, False), os.path.join(OUT, "pond", "EP01-PLATE-pond-day-v1-living.mp4"), "pond-day", None, "pond-day")
    render(lambda t: pond_frame(t, True), os.path.join(OUT, "pond", "EP01-PLATE-pond-dusk-v1-living.mp4"), "pond-dusk", None, "pond-dusk")
    render(lambda t: green_frame(t), os.path.join(OUT, "green", "EP01-PLATE-green-day-v1-living.mp4"), "green-day", None, "green")
    # FOREST: cycles OFF by law — identical frames, engineered-absence hush only
    fs = forest_still()
    render(lambda t: fs.copy(), os.path.join(OUT, "forest", "EP01-PLATE-dark-forest-day-v1-STILL.mp4"), "forest", None, "forest")
    for root, _, files in os.walk(OUT):
        for fn in sorted(files):
            if fn.endswith((".mp4", ".png")) and "build" not in root:
                p = os.path.join(root, fn)
                print(md5(p), os.path.getsize(p), p)
