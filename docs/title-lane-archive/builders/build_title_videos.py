#!/usr/bin/env python3
"""Build full title-card VIDEOS (MP4, 1280x720, 30fps, 6s) from the locked
per-card animation styles. This is the full thing, better than Pokemon's
title: entrance + rest side + action + burst + ambient + streaks +
background drift + press-start blink tempo, all at once. Pokemon's title
runs blink + one spawner; these run 9 layers at once.
Logo is NOT baked in: the game draws the official logo over the card in
its locked slot. PRESS START is drawn here only as the UI beat, blinking
at the FireRed tempo scaled to 30fps video (30 frames on first, then
15 on / 15 off). No audio - music is the Title Music lane's job.
Usage: python3 build_title_videos.py [creature]  (default: all 10)
Frames are piped to ffmpeg, no frame files are written to disk.
"""
import math, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos"
os.makedirs(OUT, exist_ok=True)
W, H, FPS, FRAMES = 1280, 720, 30, 180
FEET, CX = 560, 640
LEAF = Image.open("/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/mochi-leaf-32.png").convert("RGBA")
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
except Exception:
    FONT = ImageFont.load_default()

CARDS = {
    "yogiferno": ("snow", -140, "roar", "fire"),
    "sproutle": ("grass", 140, "shield", "shield"),
    "dorowani": ("water", -140, "glide", "bubbles"),
    "tyrage": ("sand", 140, "roar", "sand"),
    "razorgater": ("stone", -140, "scan", "sparks"),
    "gabu": ("forest", -140, "hop", "leaves"),
    "mochii": ("rain", 140, "glide", "bubbles"),
    "wispkin": ("night", -140, "bob", "smoke"),
    "mythar": ("mythar", 0, "orbit", "sparkle"),
    "kittember": ("lantern", 140, "bounce", "fire"),
}
BURST_COLS = {
    "fire": [(249, 115, 22), (239, 68, 68)],
    "bubbles": [(56, 189, 248), (96, 165, 250)],
    "sand": [(210, 180, 140), (253, 230, 138)],
    "sparks": [(34, 211, 238), (165, 243, 252)],
    "leaves": [(74, 222, 128), (34, 197, 94), (148, 255, 57)],
    "smoke": [(168, 85, 247), (100, 116, 139)],
    "sparkle": [(255, 255, 255), (240, 238, 228)],
}

def ease_out(t):
    return 1 - (1 - t) ** 3

def build(creature):
    card, rest_draft, action, burst = CARDS[creature]
    rest_x = CX + int(rest_draft * 0.8)
    bg0 = Image.open(f"{ROOT}/title-bg-{card}-v2.png").convert("RGBA").resize((W + 32, H), Image.LANCZOS)
    cut0 = Image.open(f"{ROOT}/{creature}-walk-cutout.png").convert("RGBA")
    base_h = 448
    base_w = int(cut0.size[0] * base_h / cut0.size[1])
    import random
    rng = random.Random(1234 + len(creature))
    # burst particles, fixed once, drift by frame since burst start
    burst_pts = []
    if burst != "shield":
        cols = BURST_COLS[burst]
        for i in range(16):
            a = (i / 16) * 2 * math.pi + rng.uniform(-0.3, 0.3)
            r = rng.uniform(240, 380)  # outside the 448px-tall figure, around it, not on its belly
            sz = rng.uniform(12, 22) if burst == "leaves" else rng.uniform(4, 10)
            burst_pts.append((math.cos(a) * r, math.sin(a) * r * 0.7, math.cos(a) * 1.5,
                              -1.2 if burst in ("bubbles", "smoke") else 1.0 if burst == "leaves" else math.sin(a) * 1.5,
                              sz, rng.choice(cols)))
    # streaks: 4 wind lines, LeafGreen idea, wrapping
    streaks = [(rng.uniform(0, W), rng.choice([80, 160, 240, 320, 400])) for _ in range(4)]
    out_path = f"{OUT}/{creature}-title-anim-v1.mp4"
    cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-r", str(FPS), out_path]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for f in range(FRAMES):
        # background drift (HeartGold parallax, slow)
        dx = int(math.sin(f * 0.05) * 8)
        bg = bg0.crop((16 + dx, 0, 16 + dx + W, H)).copy()
        # figure position / scale / alpha
        if f < 25:
            t = f / 24; fx, scale, alpha = CX, 0.95 + 0.05 * t, int(255 * t); fy_off = -36 if action == "orbit" else 0
        elif f < 55:
            t = ease_out((f - 25) / 29); fx, scale, alpha = CX + (rest_x - CX) * t, 1.0, 255; fy_off = -36 if action == "orbit" else 0
        else:
            p = ((f - 55) % 60) / 60; fx, scale, alpha = rest_x, 1.0, 255
            if action == "hop": fy_off = -math.sin(math.pi * min(p * 2, 1)) * 22
            elif action == "bounce": fy_off = -abs(math.sin(math.pi * p * 2)) * 26
            elif action == "bob": fy_off = math.sin(p * 2 * math.pi) * 8
            elif action == "glide": fy_off = math.sin(p * 2 * math.pi) * 6
            elif action == "orbit": fy_off = -36 + math.sin(p * 2 * math.pi) * 8
            elif action == "roar": fy_off = 0; scale = 1.0 + 0.04 * math.sin(p * 2 * math.pi)
            else: fy_off = 0
        h = int(base_h * scale); w = int(base_w * scale)
        cut = cut0.resize((w, h), Image.LANCZOS)
        if alpha < 255:
            a = cut.split()[3].point(lambda v: v * alpha // 255); cut.putalpha(a)
        img = bg
        img.alpha_composite(cut, (int(fx - w / 2), int(FEET + fy_off - h)))
        d = ImageDraw.Draw(img)
        # streaks behind figure (drawn after figure here for visibility, thin + faint)
        for i, (sx, sy) in enumerate(streaks):
            nx = sx - f * 6
            while nx < -80: nx += W + 80
            d.line([(nx, sy), (nx + 60, sy)], fill=(255, 255, 255, 70), width=2)
        # ambient dots around figure
        for i in range(6):
            ax = fx + math.cos(i * 1.1 + f * 0.05) * (w * 0.6)
            ay = FEET - h * 0.5 + math.sin(i * 1.7 + f * 0.05) * (h * 0.4)
            r = 2 + (f + i) % 3
            d.ellipse([ax - r, ay - r, ax + r, ay + r], fill=(255, 255, 255, 120))
        # action overlays
        cy = FEET + fy_off - h * 0.5
        if action == "shield" and f >= 55:
            p = ((f - 55) % 60) / 60; rr = 48 + p * 60
            d.ellipse([fx - rr, cy - rr, fx + rr, cy + rr], outline=(74, 222, 128, int(255 * (1 - p))), width=3)
        if action == "scan" and f >= 55:
            p = ((f - 55) % 60) / 60; sx = fx - w / 2 + p * w
            d.line([(sx, FEET + fy_off - h), (sx, FEET + fy_off)], fill=(34, 211, 238, 120), width=2)
        if action == "orbit" and f >= 25:
            for rr in (w * 0.55, w * 0.7, w * 0.85):
                d.ellipse([fx - rr, cy - rr * 0.35, fx + rr, cy + rr * 0.35], outline=(240, 238, 228, 140), width=2)
        # burst beats at f=75 and f=135, lasting 20 frames each
        for beat in (75, 135):
            if beat <= f < beat + 20:
                bf = f - beat; bp = bf / 20
                for (ox, oy, dxv, dyv, sz, col) in burst_pts:
                    bx, by = fx + ox + dxv * bf, cy + oy + dyv * bf
                    al = int(255 * (1 - bp))
                    if burst == "leaves":
                        leaf = LEAF.rotate((f * 12 + int(ox)) % 360, resample=Image.BICUBIC, expand=True)
                        leaf = leaf.resize((int(sz * 2), int(sz * 2)), Image.LANCZOS)
                        la = leaf.split()[3].point(lambda v: v * al // 255); leaf.putalpha(la)
                        img.alpha_composite(leaf, (int(bx - sz), int(by - sz)))
                    elif burst == "bubbles":
                        d.ellipse([bx - sz, by - sz, bx + sz, by + sz], outline=col + (al,), width=2)
                    else:
                        d.ellipse([bx - sz / 2, by - sz / 2, bx + sz / 2, by + sz / 2], fill=col + (al,))
        # press-start blink, FireRed tempo scaled to 30fps: 30 on, then 15/15
        press_on = True if f < 30 else ((f - 30) // 15) % 2 == 0
        if press_on:
            txt = "PRESS START"
            bbox = d.textbbox((0, 0), txt, font=FONT)
            tw = bbox[2] - bbox[0]
            d.text((CX - tw / 2 + 2, 672), txt, font=FONT, fill=(0, 0, 0, 180))
            d.text((CX - tw / 2, 670), txt, font=FONT, fill=(255, 255, 255, 255))
        proc.stdin.write(img.convert("RGB").tobytes())
    proc.stdin.close(); proc.wait()
    print(creature, out_path, os.path.getsize(out_path))

if __name__ == "__main__":
    targets = sys.argv[1:] or list(CARDS.keys())
    for c in targets:
        if c not in CARDS:
            print("unknown creature:", c); continue
        build(c)
