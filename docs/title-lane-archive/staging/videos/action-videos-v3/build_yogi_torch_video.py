#!/usr/bin/env python3
"""Yogiferno torch video v3: 5-pose walk cycle with torch in the front fist
in every frame + fire trail embers behind him, snow card.
Structure mirrors v2 (entrance 0-24 fade centre, 25-54 ease to rest left,
55-179 action loop, burst beats 75/135, streaks, drift, PRESS START at
FireRed tempo scaled to 30fps). Fire trail follows TitleScene behaviour:
embers spawn at the figure's feet, rise and drift behind (he faces right,
so behind = left), fade over ~30 frames.
No audio, no logo. MP4 1280x720, 30fps, 6s."""
import math, os, random, subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
FRAMES = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v3/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v3"
os.makedirs(OUT, exist_ok=True)
W, H, FPS, N = 1280, 720, 30, 180
FEET, CX = 560, 640
rest_x = CX + int(-140 * 0.8)
POSES = ["step-a", "torch-raise", "pass", "stomp", "lean"]
HOLD = 6
SHIFT = {"step-a": 6, "torch-raise": 3, "pass": -6, "stomp": 0, "lean": 0}
# flame centre in 145x190 pose space, per pose
FLAME = {"step-a": (106, 62), "torch-raise": (110, 44), "pass": (104, 64),
         "stomp": (108, 70), "lean": (102, 60)}
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
except Exception:
    FONT = ImageFont.load_default()

def load_pose(p, base_h=448):
    im = Image.open(f"{FRAMES}/yogiferno-pose-{p}.png").convert("RGBA")
    w = int(im.size[0] * base_h / im.size[1])
    return im.resize((w, base_h), Image.LANCZOS)

bg0 = Image.open(f"{ROOT}/title-bg-snow-v2.png").convert("RGBA").resize((W + 32, H), Image.LANCZOS)
pose_imgs = {p: load_pose(p) for p in POSES}
rng = random.Random(1234 + len("yogiferno"))
burst_pts = []
for i in range(16):
    a = (i / 16) * 2 * math.pi + rng.uniform(-0.3, 0.3)
    r = rng.uniform(240, 380)
    burst_pts.append((math.cos(a) * r, math.sin(a) * r * 0.7, rng.uniform(4, 10),
                      rng.choice([(249, 115, 22), (239, 68, 68)])))
streaks = [(rng.uniform(0, W), rng.choice([80, 160, 240, 320, 400])) for _ in range(4)]
# fire trail embers: (spawn_frame, x_off, y_off, vx, vy, size, col) relative to feet
trail = []
out_path = f"{OUT}/yogiferno-title-anim-v3.mp4"
cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
       "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-r", str(FPS), out_path]
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def ease_out(t):
    return 1 - (1 - t) ** 3

for f in range(N):
    dx = int(math.sin(f * 0.05) * 8)
    frame = bg0.crop((16 + dx, 0, 16 + dx + W, H)).convert("RGB")
    d = ImageDraw.Draw(frame, "RGBA")
    for i, (sx, sy) in enumerate(streaks):
        nx = sx - f * 6
        while nx < -120:
            nx += W + 120
        d.line([(nx, sy), (nx + 90, sy)], fill=(255, 255, 255, 80), width=2)
    if f < 25:
        t = f / 24
        fx, fy_off, alpha, pose = CX, 0, int(255 * t), POSES[0]
    elif f < 55:
        t = ease_out((f - 25) / 29)
        fx, fy_off, alpha, pose = CX + (rest_x - CX) * t, 0, 255, POSES[0]
    else:
        af = f - 55
        pose = POSES[(af // HOLD) % len(POSES)]
        fx, fy_off, alpha = rest_x + SHIFT[pose], 0, 255
    fig = pose_imgs[pose]
    w, h = fig.size
    px, py = int(fx - w / 2), int(FEET - h + fy_off)
    if alpha < 255:
        a = fig.copy()
        al = a.split()[3].point(lambda v: v * alpha // 255)
        a.putalpha(al)
        fig = a
    tmp = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    tmp.paste(fig, (px, py), fig)
    frame = Image.alpha_composite(frame.convert("RGBA"), tmp).convert("RGB")
    d = ImageDraw.Draw(frame, "RGBA")
    # torch flame flicker glow at the flame centre (scaled from pose space)
    fx0, fy0 = FLAME[pose]
    sc = 448 / 190
    gx = int(px + fx0 * sc)
    gy = int(py + fy0 * sc)
    pulse = 26 + int(math.sin(f * 0.7) * 8)
    for r, al in ((pulse + 18, 45), (pulse, 80), (pulse - 8, 120)):
        if r > 0:
            d.ellipse([gx - r, gy - r, gx + r, gy + r], fill=(249, 115, 22, al))
    if f >= 55:
        # spawn 2 embers at the feet each action frame (TitleScene: rise + drift)
        for _ in range(2):
            trail.append([f, rng.uniform(-14, 14), rng.uniform(-6, 2),
                          rng.uniform(-3.2, -1.0), rng.uniform(-3.5, -1.8),
                          rng.uniform(3, 8), rng.choice([(249, 115, 22), (239, 68, 68), (251, 191, 36)])])
        # draw live embers, fade over 30 frames
        alive = []
        for (sf, ox, oy, vx, vy, sz, col) in trail:
            age = f - sf
            if age > 30:
                continue
            alive.append((sf, ox, oy, vx, vy, sz, col))
            ex = fx + ox + vx * age
            ey = FEET + oy + vy * age
            al = int(230 * (1 - age / 30))
            d.ellipse([ex - sz, ey - sz, ex + sz, ey + sz], fill=col + (al,))
        trail = alive
    if f in (75, 135) or (75 < f < 95) or (135 < f < 155):
        start = 75 if f < 110 else 135
        bf = f - start
        for (bx, by, sz, col) in burst_pts:
            d.ellipse([fx + bx + bf, FEET - 224 + by + bf * 0.5 - sz,
                       fx + bx + bf + sz * 2, FEET - 224 + by + bf * 0.5 + sz], fill=col + (220,))
        frame = frame.convert("RGB")
        d = ImageDraw.Draw(frame, "RGBA")
    if f < 30 or ((f - 30) % 30) < 15:
        txt = "PRESS START"
        bbox = d.textbbox((0, 0), txt, font=FONT)
        tw = bbox[2] - bbox[0]
        d.text(((W - tw) // 2, H - 70), txt, font=FONT, fill=(255, 255, 255, 255))
    proc.stdin.write(frame.convert("RGB").tobytes())
proc.stdin.close()
proc.wait()
print("wrote", out_path, os.path.getsize(out_path))
