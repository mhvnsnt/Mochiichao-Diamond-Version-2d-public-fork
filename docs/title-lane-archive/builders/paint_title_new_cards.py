#!/usr/bin/env python3
"""Paint 2 NEW original Mochiichao title-scene backgrounds, 1600x900 PNG.

Mars's own descriptions, not assistant invention:
- Mythar card (Mars 2026-10-25, confirmed 2026-10-26): pearlescent /
  iridescent diamond-pearl background, sparkles, sine waves, real
  sparkly and diamond-like. Mythar gets his OWN card, not the shared
  night card.
- Lantern card (Mars 2026-10-26): a night card with lanterns and
  stuff surrounding it, illuminating the area, while Kittember
  (ember) also illuminates the area. Kittember gets his OWN card.

Same rules as paint_title_backgrounds.py: title-safe centre
(x 30-70%, y 18-72%) kept as smooth haze, no hard edges, no bright
spots, no shapes crossing it; all hard detail at edges, top
corners, bottom frame. NO text in any file. All art is original
procedural painting; no decomp graphics are read or copied.
Helpers are imported from paint_title_backgrounds.py (same module,
only runs its SCENES list under __main__, so importing is safe).
"""
import math, os, random, sys
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw, ImageFilter
from paint_title_backgrounds import W, H, base, glow, blobs, dots, hills, finish

OUT = os.path.dirname(__file__)

def sine_wave(img, y0, amp, wavelength, color, alpha=200, width=4, phase=0.0):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = []
    for x in range(0, W + 1, 8):
        y = y0 + amp * math.sin(2 * math.pi * x / wavelength + phase)
        pts.append((x, y))
    d.line(pts, fill=color + (alpha,), width=width, joint="curve")
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))

def diamond_sparkle(d, cx, cy, r, color, alpha=255):
    # 4-point diamond star + cross glints, the "real sparkly" shape
    d.polygon([(cx, cy - r), (cx + r * 0.35, cy - r * 0.35), (cx + r, cy),
               (cx + r * 0.35, cy + r * 0.35), (cx, cy + r),
               (cx - r * 0.35, cy + r * 0.35), (cx - r, cy),
               (cx - r * 0.35, cy - r * 0.35)], fill=color + (alpha,))
    d.line([(cx - r * 1.6, cy), (cx + r * 1.6, cy)], fill=color + (alpha // 2,), width=2)
    d.line([(cx, cy - r * 1.6), (cx, cy + r * 1.6)], fill=color + (alpha // 2,), width=2)

def mythar():
    rng = random.Random(9)
    # Pearlescent pearl base: pale pearl, shifting pink / blue / gold / lavender
    img = base([(0, (242, 240, 232)), (0.45, (250, 246, 238)), (0.72, (232, 228, 242)), (1, (222, 218, 232))])
    glow(img, 200, 120, 320, (255, 182, 193), 60)
    glow(img, 1400, 120, 320, (135, 206, 235), 60)
    glow(img, 200, 760, 300, (255, 215, 130), 50)
    glow(img, 1400, 760, 300, (200, 160, 255), 50)
    # Iridescent pastel haze, soft only — centre stays haze, no hard shapes
    blobs(img, rng, 60, [(255, 182, 193), (135, 206, 235), (255, 215, 130), (200, 160, 255), (180, 240, 200)], y0=0, y1=900, alpha=(18, 55))
    # Sine waves: top band (above centre) + bottom band (below centre), never centre
    sine_wave(img, 110, 26, 320, (255, 255, 255), alpha=220, width=5)
    sine_wave(img, 155, 18, 240, (255, 215, 130), alpha=200, width=4, phase=1.0)
    sine_wave(img, 720, 26, 320, (255, 255, 255), alpha=220, width=5, phase=0.5)
    sine_wave(img, 775, 18, 240, (200, 160, 255), alpha=200, width=4, phase=2.0)
    # Diamond sparkles: edges + corners only, sizes vary, gold + white
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(90):
        x = rng.choice([rng.randint(0, 380), rng.randint(1220, 1600)])
        y = rng.randint(0, 900)
        r = rng.uniform(4, 16)
        diamond_sparkle(d, x, y, r, rng.choice([(255, 255, 255), (255, 215, 130)]), alpha=rng.randint(160, 255))
    for cx, cy, r in [(180, 90, 26), (1420, 80, 30), (120, 800, 24), (1480, 810, 28), (300, 450, 20), (1300, 450, 20)]:
        diamond_sparkle(d, cx, cy, r, (255, 255, 255), alpha=255)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))
    dots(img, rng, 200, (255, 255, 255), 1, 3, alpha=(120, 255))
    return finish(img)

def lantern():
    rng = random.Random(10)
    # Night base, same family as the night card, darker at the bottom
    img = base([(0, (8, 8, 38)), (0.45, (25, 25, 70)), (0.72, (40, 32, 85)), (1, (12, 12, 35))])
    # Warm lantern glow pools at the edges only
    for cx, cy in [(150, 200), (1450, 200), (220, 550), (1380, 550), (120, 820), (1480, 820)]:
        glow(img, cx, cy, 180, (255, 170, 60), 90, blur=60)
    hills(img, 700, 40, (20, 20, 50), 255, 12, seed=101)
    hills(img, 800, 25, (12, 12, 35), 255, 4, seed=102)
    # Lanterns: hanging / standing at the edges and bottom corners only,
    # never in the centre (x 480-1120 is kept clear). Each lantern:
    # string line, cap, warm glowing body, inner bright core.
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    lanterns = [(120, 150), (260, 300), (180, 520), (90, 700),
                (1480, 150), (1340, 300), (1420, 520), (1510, 700),
                (320, 780), (1280, 780)]
    for (x, y) in lanterns:
        w, h = 54, 78
        d.line([(x, y - 90), (x, y - h // 2)], fill=(60, 40, 20, 255), width=3)
        d.rectangle([x - w // 2 - 4, y - h // 2 - 10, x + w // 2 + 4, y - h // 2], fill=(40, 28, 12, 255))
        d.rounded_rectangle([x - w // 2, y - h // 2, x + w // 2, y + h // 2], radius=14, fill=(255, 170, 60, 235))
        d.ellipse([x - 14, y - 16, x + 14, y + 16], fill=(255, 240, 180, 255))
        d.rectangle([x - w // 2 - 4, y + h // 2, x + w // 2 + 4, y + h // 2 + 10], fill=(40, 28, 12, 255))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1)))
    # Warm light dots drifting between lanterns (the illumination), edges only
    dots(img, rng, 160, (255, 200, 110), 1, 4, x0=0, x1=380, alpha=(100, 220))
    dots(img, rng, 160, (255, 200, 110), 1, 4, x0=1220, x1=1600, alpha=(100, 220))
    dots(img, rng, 200, (255, 255, 255), 1, 3, y0=0, y1=500, alpha=(100, 220))
    return finish(img)

if __name__ == "__main__":
    for name, fn in [("mythar", mythar), ("lantern", lantern)]:
        p = os.path.join(OUT, f"title-bg-{name}-v2.png")
        fn().save(p)
        print(p, os.path.getsize(p))
