#!/usr/bin/env python3
"""Build per-card animated title versions (staging only, shown first, NOT repo yet).
Each card: centre entrance -> slide to its OWN rest side -> action loop,
effects move WITH the figure to its rest side. Press-start tempo from
FireRed BlinkPressStart (60 frames first, then 30 on/off) sets the beat:
entrance ~0.5s, move ~0.8s, action loop repeats. Mythar is the exception:
stays centre, never grounds, rings orbit it.
Frames are 800x450 (half-scale previews of the 1600x900 drafts); the
full-res anim files get built from this same script at 1.0 scale after
Mars okays the styles. No draft file is touched or overwritten.
"""
import math, os, random
from PIL import Image, ImageDraw

ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-anims"
os.makedirs(OUT, exist_ok=True)
W, H = 800, 450
FEET = 350
CX = 400
# Mochiichao leaf, built from the LeafGreen leaf FILE STRUCTURE (16x16,
# 3 greens, 11 tumbling frames, leftward drift) - NOT Pokemon tile pixels.
LEAF = Image.open("/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/mochi-leaf-32.png").convert("RGBA")

CARDS = [
    # creature, card, restX (draft-frame px), action, burst
    ("yogiferno", "snow", -140, "roar", "fire"),
    ("sproutle", "grass", 140, "shield", "shield"),
    ("dorowani", "water", -140, "glide", "bubbles"),
    ("tyrage", "sand", 140, "roar", "sand"),
    ("razorgater", "stone", -140, "scan", "sparks"),
    ("gabu", "forest", -140, "hop", "leaves"),
    ("mochii", "rain", 140, "glide", "bubbles"),
    ("wispkin", "night", -140, "bob", "smoke"),
    ("mythar", "mythar", 0, "orbit", "sparkle"),
    ("kittember", "lantern", 140, "bounce", "fire"),
]

def ease_out(t):
    return 1 - (1 - t) ** 3

def burst_particles(burst, fx, fy, rng, n=14):
    """Return list of (x, y, dx, dy, size, kind, color)."""
    if burst == "shield":
        return []  # shield burst is the expanding ring overlay, not particles
    cols = {
        "fire": [(249, 115, 22), (239, 68, 68)],
        "bubbles": [(56, 189, 248), (96, 165, 250)],
        "sand": [(210, 180, 140), (253, 230, 138)],
        "sparks": [(34, 211, 238), (165, 243, 252)],
        "leaves": [(74, 222, 128), (34, 197, 94), (134, 239, 172)],
        "smoke": [(168, 85, 247), (100, 116, 139)],
        "sparkle": [(255, 255, 255), (240, 238, 228)],
    }[burst]
    pts = []
    for i in range(n):
        a = (i / n) * 2 * math.pi + rng.uniform(-0.3, 0.3)
        r = rng.uniform(20, 70)
        pts.append((fx + math.cos(a) * r, fy + math.sin(a) * r * 0.7,
                    math.cos(a) * 1.2,
                    -1.0 if burst in ("bubbles", "smoke") else 0.8 if burst == "leaves" else math.sin(a) * 1.2,
                    rng.uniform(10, 18) if burst == "leaves" else rng.uniform(3, 8), burst, rng.choice(cols)))
    return pts

for creature, card, rest_draft, action, burst in CARDS:
    bg = Image.open(f"{ROOT}/title-bg-{card}-v2.png").convert("RGBA").resize((W, H), Image.LANCZOS)
    cut0 = Image.open(f"{ROOT}/{creature}-walk-cutout.png").convert("RGBA")
    base_h = 280
    base_w = int(cut0.size[0] * base_h / cut0.size[1])
    rng = random.Random(hash(creature) % 10000)
    rest_x = CX + rest_draft // 2
    # Burst particles are fixed once per creature, then drift by frame -
    # re-rolling them every frame would flicker instead of moving.
    burst_pts = burst_particles(burst, rest_x, FEET - 140, rng, 12)
    frames = []
    keyframe = None
    for f in range(36):
        img = bg.copy()
        # figure position / scale
        if f < 6:  # entrance at centre, fade in
            t = f / 5
            fx, scale, alpha = CX, 0.92 + 0.08 * t, int(255 * t)
            fy_off = 0
        elif f < 16:  # move centre -> rest side
            t = ease_out((f - 6) / 9)
            fx, scale, alpha = CX + (rest_x - CX) * t, 1.0, 255
            fy_off = -45 if action == "orbit" else 0
        else:  # action loop at rest side
            p = (f - 16) / 20
            fx, scale, alpha = rest_x, 1.0, 255
            if action == "hop":
                fy_off = -math.sin(math.pi * min(p * 2, 1)) * 18
            elif action == "bounce":
                fy_off = -abs(math.sin(math.pi * p * 2)) * 20
            elif action == "bob":
                fy_off = math.sin(p * 2 * math.pi) * 6
            elif action == "glide":
                fy_off = math.sin(p * 2 * math.pi) * 5
            elif action == "orbit":
                fy_off = -45 + math.sin(p * 2 * math.pi) * 6
            elif action == "roar":
                fy_off = 0
                scale = 1.0 + 0.04 * math.sin(p * 2 * math.pi)
            else:
                fy_off = 0
        h = int(base_h * scale)
        w = int(base_w * scale)
        cut = cut0.resize((w, h), Image.LANCZOS)
        if alpha < 255:
            a = cut.split()[3].point(lambda v: v * alpha // 255)
            cut.putalpha(a)
        x = int(fx - w / 2)
        y = int(FEET + fy_off - h)
        img.alpha_composite(cut, (x, y))
        d = ImageDraw.Draw(img)
        # ambient card-effect dots around the figure (follow it)
        for i in range(6):
            ax = fx + math.cos(i * 1.1 + f * 0.08) * (w * 0.6)
            ay = FEET - h * 0.5 + math.sin(i * 1.7 + f * 0.08) * (h * 0.4)
            r = 2 + (f + i) % 3
            d.ellipse([ax - r, ay - r, ax + r, ay + r], fill=(255, 255, 255, 120))
        # action-specific overlays
        if action == "shield" and f >= 16:
            p = (f - 16) / 20
            rr = 40 + p * 50
            d.ellipse([fx - rr, FEET - h * 0.5 - rr, fx + rr, FEET - h * 0.5 + rr],
                      outline=(74, 222, 128, int(255 * (1 - p))), width=3)
        if action == "scan" and f >= 16:
            p = (f - 16) / 20
            sx = fx - w / 2 + p * w
            d.line([(sx, y), (sx, y + h)], fill=(34, 211, 238, 120), width=2)
        if action == "orbit" and f >= 6:
            for k, rr in enumerate((w * 0.55, w * 0.7, w * 0.85)):
                d.ellipse([fx - rr, FEET - h * 0.55 - rr * 0.35, fx + rr, FEET - h * 0.55 + rr * 0.35],
                          outline=(240, 238, 228, 140), width=2)
        # burst particles, beat at f=20-31, drifting from their fixed start
        if 20 <= f <= 31:
            bp = (f - 20) / 11
            for (px, py, dx, dy, sz, kind, col) in burst_pts:
                bx, by = px + dx * (f - 20), py + dy * (f - 20)
                al = int(255 * (1 - bp))
                if kind == "leaves":
                    # Actual leaf shape, tumbling: rotate by frame + particle
                    leaf = LEAF.rotate((f * 12 + int(px)) % 360, resample=Image.BICUBIC, expand=True)
                    leaf = leaf.resize((int(sz * 2), int(sz * 2)), Image.LANCZOS)
                    la = leaf.split()[3].point(lambda v: v * al // 255)
                    leaf.putalpha(la)
                    img.alpha_composite(leaf, (int(bx - sz), int(by - sz)))
                    continue
                elif kind == "bubbles":
                    d.ellipse([bx - sz, by - sz, bx + sz, by + sz], outline=col + (al,), width=2)
                elif kind == "shield":
                    pass
                else:
                    d.ellipse([bx - sz / 2, by - sz / 2, bx + sz / 2, by + sz / 2], fill=col + (al,))
        frame = img.convert("RGB")
        frames.append(frame)
        if f == 24:
            keyframe = frame
    gif_path = f"{OUT}/{creature}-action-anim-v1.gif"
    frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=80, loop=0, optimize=True)
    keyframe.save(f"{OUT}/{creature}-action-anim-v1.png")
    print(creature, os.path.getsize(gif_path), os.path.getsize(f"{OUT}/{creature}-action-anim-v1.png"))
