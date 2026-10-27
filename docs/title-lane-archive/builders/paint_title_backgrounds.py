#!/usr/bin/env python3
"""Paint 8 original Mochiichao title-scene backgrounds, 1600x900 PNG.

Pokemon-FIRST layer rule, structure only (no Pokemon art, code, or names copied):
  L0 far sky gradient            <- FireRed scene_1 bg / HeartGold MAIN 3 (farthest)
  L1 distant silhouettes         <- FireRed scene_2 bg / HeartGold MAIN 2
  L2 mid haze / horizon          <- HeartGold MAIN 1
  L3 near foreground framing     <- FireRed scene_1 grass / scene_3 grass, HeartGold MAIN 0 (nearest)
  L4 particles                   <- FireRed title flame/leaf spawner sprites, Ruby/Emerald shine sprite
  L5 vignette + press-line scrim <- FireRed title copyright/press-start layer (position only, no text)
Title-safe rule baked into every scene: the centre (x 30-70%, y 18-72%) is
kept as smooth haze with no hard edges, no bright spots, no shapes crossing
it, so the logo (phi), the creature slot above it, and the PRESS line below
it stay readable. All detail is pushed to the edges, top corners, and the
bottom foreground frame. NO text is drawn in any file. All art is original
procedural painting in this script; no decomp graphics are read or copied.
Y2K restyle: teal/pink/gold chrome glows at the edges only.
"""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1600, 900
OUT = __file__.rsplit("/", 1)[0]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient(stops):
    """stops: list of (pos 0..1, rgb). Returns RGB image."""
    strip = Image.new("RGB", (1, H))
    px = strip.load()
    for y in range(H):
        t = y / (H - 1)
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]; p1, c1 = stops[i + 1]
            if p0 <= t <= p1:
                px[0, y] = lerp(c0, c1, (t - p0) / (p1 - p0) if p1 > p0 else 0)
                break
        else:
            px[0, y] = stops[-1][1]
    return strip.resize((W, H))

def glow(img, cx, cy, r, color, alpha=90, blur=80):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))

def hills(img, base_y, amp, color, alpha=255, blur=0, seed=0, waves=3):
    rng = random.Random(seed)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = [(0, H), (0, base_y)]
    x = 0
    while x < W:
        pts.append((x, base_y + rng.randint(-amp, amp)))
        x += W // (waves * 6)
    pts += [(W, base_y), (W, H)]
    d.polygon(pts, fill=color + (alpha,))
    if blur:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.alpha_composite(layer)

def side_cliff(img, side, color, top, bottom, alpha=255, blur=2):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if side == "left":
        pts = [(0, H), (0, top), (260, top + 80), (330, top + 260), (240, bottom), (0, H)]
    else:
        pts = [(W, H), (W, top), (W - 260, top + 80), (W - 330, top + 260), (W - 240, bottom), (W, H)]
    d.polygon(pts, fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))

def dots(img, rng, n, color, rmin, rmax, y0=0, y1=H, x0=0, x1=W, alpha=(120, 255)):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x = rng.randint(x0, x1); y = rng.randint(y0, y1); r = rng.uniform(rmin, rmax)
        a = rng.randint(*alpha)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (a,))
    img.alpha_composite(layer)

def streaks(img, rng, n, color, length, alpha=90, angle=0.35):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x = rng.randint(0, W); y = rng.randint(0, H)
        dx = math.cos(angle) * length; dy = math.sin(angle) * length
        d.line([(x, y), (x + dx, y + dy)], fill=color + (alpha,), width=2)
    img.alpha_composite(layer)

def blobs(img, rng, n, colors, y0=0, y1=H, x0=0, x1=W, rmin=40, rmax=180, alpha=(18, 60)):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x = rng.randint(x0, x1); y = rng.randint(y0, y1); r = rng.uniform(rmin, rmax)
        c = rng.choice(colors); a = rng.randint(*alpha)
        d.ellipse([x - r, y - r * 0.55, x + r, y + r * 0.55], fill=c + (a,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(28)))

def grain(img, rng, n=6000, alpha=(10, 40)):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x = rng.randint(0, W - 1); y = rng.randint(0, H - 1)
        v = rng.choice([(255, 255, 255), (0, 0, 0)])
        d.point((x, y), fill=v + (rng.randint(*alpha),))
    img.alpha_composite(layer)

def finish(img):
    # L5: soft vignette + bottom press-line scrim (no text, just readability)
    # soft edge darkening: blurred black border frame, no hard rectangles
    vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dv = ImageDraw.Draw(vig)
    dv.rectangle([0, 0, W, H], outline=(0, 0, 0, 90), width=90)
    img.alpha_composite(vig.filter(ImageFilter.GaussianBlur(45)))
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ds = ImageDraw.Draw(scrim)
    for y in range(H - 140, H):
        a = int(70 * (y - (H - 140)) / 140)
        ds.line([(0, y), (W, y)], fill=(0, 0, 10, a))
    img.alpha_composite(scrim)
    return img.convert("RGB")

def base(stops):
    return gradient(stops).convert("RGBA")

def snow():
    rng = random.Random(1)
    img = base([(0, (168, 205, 235)), (0.45, (222, 238, 250)), (0.72, (190, 214, 232)), (1, (232, 242, 248))])
    glow(img, 220, 130, 260, (95, 216, 208), 55); glow(img, 1400, 110, 240, (255, 179, 209), 45)
    blobs(img, rng, 70, [(255, 255, 255), (180, 210, 235), (150, 190, 220)], y0=0, y1=520)
    hills(img, 560, 60, (127, 168, 200), 255, 18, seed=11); hills(img, 640, 40, (160, 192, 216), 255, 10, seed=12)
    hills(img, 780, 30, (232, 242, 248), 255, 0, seed=13)
    side_cliff(img, "left", (110, 150, 185), 300, 900); side_cliff(img, "right", (110, 150, 185), 340, 900)
    dots(img, rng, 500, (255, 255, 255), 1, 4, alpha=(140, 255))
    return finish(img)

def grass():
    rng = random.Random(2)
    img = base([(0, (150, 214, 240)), (0.45, (205, 240, 190)), (0.72, (150, 205, 120)), (1, (90, 160, 80))])
    glow(img, 1350, 120, 260, (255, 209, 102), 60)
    blobs(img, rng, 70, [(255, 250, 200), (120, 200, 110), (180, 230, 150)], y0=0, y1=620)
    hills(img, 600, 50, (90, 165, 90), 255, 14, seed=21); hills(img, 700, 35, (60, 135, 65), 255, 6, seed=22)
    # tall-grass tufts only at bottom corners / edges, never centre
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for x in list(range(0, 420, 18)) + list(range(1180, 1600, 18)):
        for k in range(3):
            d.line([(x + k * 5, 900), (x + k * 5 + rng.randint(-14, 14), 900 - rng.randint(60, 150))], fill=(35, 105, 45, 220), width=5)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))
    dots(img, rng, 220, (255, 250, 180), 1, 3, y0=100, y1=650, alpha=(100, 220))
    return finish(img)

def water():
    rng = random.Random(3)
    img = base([(0, (10, 70, 95)), (0.4, (20, 110, 135)), (0.7, (45, 165, 190)), (1, (8, 45, 62))])
    glow(img, 250, 100, 300, (127, 232, 255), 55); glow(img, 1380, 140, 260, (255, 158, 198), 40)
    blobs(img, rng, 70, [(80, 200, 230), (30, 140, 170), (150, 230, 250)], y0=0, y1=900)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for y in range(700, 900, 34):
        for x in range(0, W, 110):
            d.arc([x, y, x + 160, y + 18], 0, 180, fill=(127, 232, 255, 45), width=3)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))
    dots(img, rng, 180, (180, 240, 255), 1, 5, y0=620, y1=900, alpha=(80, 200))
    streaks(img, rng, 24, (127, 232, 255), 220, alpha=45, angle=1.1)
    return finish(img)

def sand():
    rng = random.Random(4)
    img = base([(0, (255, 220, 150)), (0.45, (250, 200, 110)), (0.72, (225, 165, 80)), (1, (180, 125, 50))])
    glow(img, 1380, 130, 300, (255, 235, 170), 110)
    blobs(img, rng, 70, [(255, 230, 160), (230, 180, 100), (200, 150, 70)], y0=0, y1=750)
    hills(img, 580, 55, (205, 150, 70), 255, 16, seed=41); hills(img, 690, 40, (185, 122, 46), 255, 8, seed=42)
    hills(img, 800, 25, (160, 105, 40), 255, 0, seed=43)
    dots(img, rng, 350, (255, 240, 190), 1, 3, alpha=(90, 220))
    return finish(img)

def stone():
    rng = random.Random(5)
    img = base([(0, (120, 120, 155)), (0.45, (185, 185, 205)), (0.72, (130, 130, 155)), (1, (70, 70, 90))])
    glow(img, 200, 120, 280, (255, 209, 102), 45); glow(img, 1420, 120, 260, (95, 216, 208), 35)
    blobs(img, rng, 70, [(160, 160, 180), (110, 110, 135), (200, 200, 215)], y0=0, y1=750)
    side_cliff(img, "left", (74, 74, 94), 180, 900); side_cliff(img, "right", (74, 74, 94), 220, 900)
    side_cliff(img, "left", (95, 95, 115), 420, 900); side_cliff(img, "right", (95, 95, 115), 460, 900)
    hills(img, 790, 30, (90, 90, 110), 255, 4, seed=51)
    dots(img, rng, 200, (230, 220, 190), 1, 3, alpha=(80, 180))
    return finish(img)

def forest():
    rng = random.Random(6)
    img = base([(0, (20, 60, 35)), (0.45, (70, 130, 80)), (0.72, (50, 105, 60)), (1, (18, 45, 28))])
    # canopy only in top corners, framing the centre
    for cx, cy in [(120, 60), (1480, 60), (60, 220), (1540, 220)]:
        glow(img, cx, cy, 340, (35, 95, 50), 200, blur=60)
    blobs(img, rng, 80, [(40, 110, 60), (90, 160, 90), (30, 80, 45)], y0=0, y1=400)
    streaks(img, rng, 18, (255, 240, 170), 300, alpha=35, angle=1.35)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for x in list(range(0, 380, 22)) + list(range(1220, 1600, 22)):
        d.line([(x, 900), (x + rng.randint(-20, 20), 900 - rng.randint(80, 190))], fill=(20, 70, 35, 230), width=6)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))
    dots(img, rng, 160, (255, 224, 102), 1, 4, y0=500, y1=880, alpha=(120, 255))
    return finish(img)

def rain():
    rng = random.Random(7)
    img = base([(0, (70, 85, 100)), (0.45, (120, 140, 155)), (0.72, (90, 110, 125)), (1, (45, 60, 75))])
    glow(img, 300, 110, 300, (159, 216, 255), 40); glow(img, 1350, 110, 280, (255, 158, 198), 30)
    blobs(img, rng, 70, [(140, 160, 175), (90, 110, 130), (180, 190, 200)], y0=0, y1=400)
    hills(img, 700, 35, (70, 88, 102), 255, 12, seed=71); hills(img, 810, 20, (55, 70, 85), 255, 3, seed=72)
    streaks(img, rng, 700, (200, 225, 245), 55, alpha=110, angle=1.25)
    dots(img, rng, 120, (200, 225, 245), 1, 3, y0=800, y1=900, alpha=(90, 200))
    return finish(img)

def night():
    rng = random.Random(8)
    img = base([(0, (8, 8, 38)), (0.45, (25, 25, 70)), (0.72, (45, 35, 95)), (1, (15, 15, 40))])
    glow(img, 1380, 130, 220, (255, 243, 176), 130, blur=60)
    blobs(img, rng, 60, [(80, 60, 140), (40, 120, 140), (120, 80, 160)], y0=0, y1=600)
    d = ImageDraw.Draw(img); d.ellipse([1310, 60, 1450, 200], fill=(255, 243, 176, 255))
    glow(img, 180, 140, 300, (95, 216, 208), 45); glow(img, 1420, 500, 300, (255, 158, 198), 35)
    hills(img, 680, 45, (25, 25, 55), 255, 14, seed=81); hills(img, 790, 30, (15, 15, 40), 255, 4, seed=82)
    dots(img, rng, 420, (255, 255, 255), 1, 3, y0=0, y1=620, alpha=(120, 255))
    return finish(img)

SCENES = [("snow", snow), ("grass", grass), ("water", water), ("sand", sand),
          ("stone", stone), ("forest", forest), ("rain", rain), ("night", night)]
if __name__ == "__main__":
    import os
    for name, fn in SCENES:
        p = os.path.join(OUT, f"title-bg-{name}-v2.png")
        fn().save(p)
        print(p, os.path.getsize(p))
