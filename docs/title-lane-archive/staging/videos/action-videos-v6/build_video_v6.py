#!/usr/bin/env python3
"""Yogiferno title video v6 (INTERIM, not final lock): v5 + Black 2
blizzard layer (weather 4, structure only, original snow art), wind
RIGHT to LEFT so he walks INTO it. V5 with the flip
fixed — the two mirrored look-back poses are REMOVED and never replaced
with another mirrored frame, so he never faces backwards while travelling
forwards. 7 forward-facing poses, torch tracked to the measured front
fist, torch appearing slowly, travelling story through the tundra.
Opposite stride still PENDING the hand-drawn frame from the sprite-art
lane — v5 does NOT have it and is not the final lock.

Torch is drawn per frame (not baked) so it can APPEAR: frames <10 no torch,
frames 10-40 alpha 0->100% + flame scale 0.4->1.0, frames >40 full torch.
Flame centres are the v4 pose-sheet values (forward of the fist, clear of
the face), in 200x190 padded pose space. Fist anchors (measured):
  facing-right: (134,110), stomp (136,114), lean (132,114)
  facing-left : (65,110)
Story: figure walks in place at rest-left while the tundra SCROLLS past
(parallax: distant peaks slow, snow card mid, foreground drifts fast),
torch light flickers on the snow, fire trail embers behind him, burst
beats at 75/135, wind streaks, PRESS START at FireRed tempo scaled to
30fps (30 on first, then 15 on/15 off). NO mirrored frames: the v4
look-back poses are removed, so he faces the travel direction in every
frame. MP4 1280x720, 30fps, 6s, no audio, no logo. v2/v3/v4 untouched.
"""
import math, os, random, subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
V2F = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v6"
os.makedirs(OUT, exist_ok=True)
W, H, FPS, N = 1280, 720, 30, 180
FEET, CX = 560, 640
rest_x = CX + int(-140 * 0.8)

def load(p):
    return Image.open(f"{V2F}/yogiferno-pose-{p}.png").convert("RGBA")

def pad(im, ox):
    c = Image.new("RGBA", (200, 190), (0, 0, 0, 0))
    c.paste(im, (ox, 0), im)
    return c

_stomp = load("step-a").resize((152, 180), Image.LANCZOS)
_c = Image.new("RGBA", (145, 190), (0, 0, 0, 0))
_c.paste(_stomp, (-3, 10), _stomp)

# (pose name, torchless padded base, fist, flame_xy, fw, fh, lean)
POSES = {
    "stride-a":       (pad(load("step-a"), 10), (134, 110), (180, 55), 13, 20, 4),
    "pass":           (pad(load("pass"), 10),   (134, 110), (178, 58), 12, 18, 2),
    "torch-forward":  (pad(load("step-a"), 10), (134, 110), (186, 48), 15, 22, 8),
    "lean":           (pad(load("lean"), 10),   (132, 114), (178, 58), 12, 18, -2),
    "stomp":          (pad(_c, 10),             (136, 114), (182, 62), 16, 15, 8),
    "torch-raise":    (pad(load("step-a"), 10), (134, 110), (180, 40), 15, 26, 4),
    "torch-low":      (pad(load("step-a"), 10), (134, 110), (172, 72), 11, 15, 2),
}
# V5: NO mirrored poses at all. The 24 frames the two 12-frame look-backs
# occupied are filled with forward-facing beats (torch-forward 12,
# torch-low 12), so the cycle total stays 66 and the timing of the rest
# of the cycle is unchanged. He faces the travel direction in every frame.
CYCLE = [("stride-a", 6), ("pass", 6), ("torch-forward", 12),
         ("lean", 6), ("stomp", 6), ("torch-raise", 6), ("torch-low", 12),
         ("lean", 6), ("torch-forward", 6)]
TOTAL_CYCLE = sum(h for _, h in CYCLE)

def flame(d, cx, cy, w, h, lean=0, alpha=255):
    a = max(0, min(255, alpha))
    d.ellipse([cx - w, cy - h * 0.8, cx + w, cy + h * 0.8], fill=(249, 115, 22, int(60 * a / 255)))
    d.polygon([(cx - w * 0.7, cy + h * 0.6), (cx - w * 0.5, cy - h * 0.2),
               (cx + lean, cy - h), (cx + w * 0.5, cy - h * 0.2),
               (cx + w * 0.7, cy + h * 0.6)], fill=(249, 115, 22, a))
    d.ellipse([cx - w * 0.45, cy - h * 0.1, cx + w * 0.45, cy + h * 0.7], fill=(251, 191, 36, a))
    d.ellipse([cx - w * 0.22, cy + h * 0.1, cx + w * 0.22, cy + h * 0.6], fill=(254, 243, 199, a))

def draw_torch(d, px, py, sc, fist, fxy, fw, fh, lean, talpha, fscale):
    """Draw torch on a TRANSPARENT overlay Draw (d): handle in two segments
    (fist intact), flame at fxy (pose space, scaled). talpha 0-255, fscale
    flame size mult. MUST be an overlay: PIL Draw on an opaque RGBA frame
    overwrites alpha instead of blending, and .convert('RGB') then turns
    every translucent glow into a solid disc (the v4 take-1 flame bug)."""
    fx = px + fist[0] * sc
    fy = py + fist[1] * sc
    tx = px + fxy[0] * sc
    ty = py + fxy[1] * sc
    out = 1 if tx > fx else -1
    a = int(talpha)
    if a <= 0:
        return
    # ORDER MATTERS on an overlay: PIL Draw overwrites, it does not blend
    # within the overlay — so glow discs must go FIRST, then handle, then
    # the opaque flame LAST, or the glow erases the flame (take-2 bug:
    # flame vanished, only pale halos remained).
    pulse = 26 + int(math.sin(flick[0] * 0.7) * 8)
    # BLIZZARD: flame bent BACK toward him (to the LEFT, against the
    # right-to-left wind) and flaring harder on gusts; glow stretched
    # left instead of a round halo. lean param is replaced, not added.
    lean = -(12 + 6 * WIND[1] + int(4 * math.sin(flick[0] * 1.3)))
    shift = (10 + 4 * WIND[1]) * sc
    for r, al in ((pulse + 18, 45), (pulse, 80)):
        d.ellipse([tx - shift - r, ty - r, tx - shift + r, ty + r], fill=(249, 115, 22, int(al * a / 255)))
    d.ellipse([fx - 60, FEET - 18, fx + 130 * out if out > 0 else fx + 60, FEET + 14],
              fill=(249, 115, 22, int(28 * a / 255)))
    d.line([(fx, fy + 10 * sc), (fx + out * 3 * sc, fy + 28 * sc)], fill=(101, 67, 33, a), width=max(2, int(6 * sc)))
    d.line([(fx, fy - 10 * sc), (tx, ty + fh * fscale * 0.6 * sc)], fill=(101, 67, 33, a), width=max(2, int(6 * sc)))
    flame(d, tx, ty, fw * fscale * sc, fh * fscale * sc, lean=lean * sc, alpha=a)

try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
except Exception:
    FONT = ImageFont.load_default()

def load_pose(p, base_h=448):
    im = POSES[p][0]
    w = int(im.size[0] * base_h / im.size[1])
    return im.resize((w, base_h), Image.LANCZOS)

pose_imgs = {p: load_pose(p) for p in POSES}
bg_card = Image.open(f"{ROOT}/title-bg-snow-v2.png").convert("RGBA").resize((1600, 900), Image.LANCZOS)
# wider tundra strip for scrolling: card + card side by side
bg_strip = Image.new("RGBA", (3200, 900), (0, 0, 0, 0))
bg_strip.paste(bg_card, (0, 0)); bg_strip.paste(bg_card, (1600, 0))
rng = random.Random(1234 + len("yogiferno"))
burst_pts = []
for i in range(16):
    ang = (i / 16) * 2 * math.pi + rng.uniform(-0.3, 0.3)
    r = rng.uniform(240, 380)
    burst_pts.append((math.cos(ang) * r, math.sin(ang) * r * 0.7, rng.uniform(4, 10),
                      rng.choice([(249, 115, 22), (239, 68, 68)])))
streaks = [(rng.uniform(0, W), rng.choice([80, 160, 240, 320, 400])) for _ in range(4)]
# foreground snow drifts (parallax fast layer): (x, y, w, h)
drifts = [(rng.uniform(0, W), 640 + rng.uniform(0, 60), rng.uniform(180, 380), rng.uniform(24, 48)) for _ in range(6)]
trail = []
flick = [0]
# --- BLACK 2 BLIZZARD (ov075/weather_particles.c, weather 4) ---
# Real structure, Mochiichao adaptation stated plainly in the report:
#  * wind band index = cycle/256 over a 1024-call cycle (4 bands, wind
#    changes every 256 calls) -> here band = (frame // 45) % 4 over 180f.
#  * sBlizzardSpeedX = {7,11,15,19}, sBlizzardSpeedY = {3,6,3,6};
#    flake speedX = (size+1)*SpeedX, speedY = (size+1)*SpeedY, size 3
#    adds one more SpeedX/SpeedY; every 4th frame speedX += accelX
#    (= SpeedX) and speedY decays toward 1. Scaled for 1280x720/30fps:
#    base X {5,7,9,11} px/frame (DS 256-wide screen -> 1280 wide).
#  * bg scroll tables sBlizzardScrollX {7,8,8,8,8,8,7,7,7} /
#    sBlizzardScrollY {3,2,1,2,1,2,3,2,3}, step every 28 -> the tundra
#    scroll already in v5; blizzard adds its own streak scroll.
#  * DIRECTION MIRRORED vs the original: Black 2 flakes move +x from a
#    negative-x spawn; Mars ordered wind RIGHT->LEFT against a figure
#    facing/walking right, so x speeds are NEGATED and flakes spawn at
#    the RIGHT edge (x in [W, W+400]) and stream left.
#  * Lifetime 9-11 frames in the original is a DS-screen artefact (a
#    flake crosses 256px in ~10 frames); at 1280 wide it is extended
#    to "until it exits left" so flakes visibly stream across the frame.
#  * Fog/light fade (Blizzard_FadeIn: fog 4, light change) -> white
#    haze overlay whose alpha swells with the gust band.
GUST_X = [5, 7, 9, 11]
GUST_Y = [1, 2, 1, 2]
WIND = [0, 0]  # [lean_px, gust_band], set per frame, read by draw_torch
def make_flake(front):
    # front layer: only small/medium flakes, lower alpha, so the figure
    # stays readable; behind layer carries the large/XL streaked flakes.
    size = rng.randint(0, 2) if front else rng.randint(0, 3)
    return {"x": rng.uniform(W, W + 420), "y": rng.uniform(-20, H),
            "size": size, "front": front, "ph": rng.uniform(0, 6.28),
            "age": 0, "acc": 0}
back_flakes = [make_flake(False) for _ in range(90)]
front_flakes = [make_flake(True) for _ in range(60)]
blizz_streaks = [(rng.uniform(0, W), rng.uniform(40, 640), rng.uniform(60, 180),
                  rng.uniform(30, 55)) for _ in range(20)]
spray = []

def draw_flake(d, x, y, size, alpha):
    if size == 0:
        d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 255, 255, alpha))
    elif size == 1:
        d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 255, 255, alpha))
        d.line([(x - 6, y), (x + 6, y)], fill=(255, 255, 255, alpha), width=1)
        d.line([(x, y - 6), (x, y + 6)], fill=(255, 255, 255, alpha), width=1)
    elif size == 2:
        r = 8
        for ang in range(0, 360, 60):
            a = math.radians(ang)
            d.line([(x, y), (x + r * math.cos(a), y + r * math.sin(a))],
                   fill=(255, 255, 255, alpha), width=2)
        d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(255, 255, 255, alpha))
    else:  # XL: streaked along the wind (horizontal), original snow art
        d.ellipse([x - 16, y - 3, x + 16, y + 3], fill=(255, 255, 255, alpha))
        d.ellipse([x - 4, y - 5, x + 4, y + 5], fill=(255, 255, 255, alpha))

def step_flakes(flakes, band, f):
    gx, gy = GUST_X[band], GUST_Y[band]
    for fl in flakes:
        fl["age"] += 1
        # every 4th frame: speedX += accelX (Black 2), speedY decays to 1
        acc = gx if fl["age"] % 4 == 0 else 0
        vx = -((fl["size"] + 1) * gx + acc)
        vy = max(1, (fl["size"] + 1) * gy - fl["age"] // 24)
        fl["x"] += vx
        fl["y"] += vy + math.sin(f * 0.3 + fl["ph"]) * 0.8
        if fl["x"] < -40 or fl["y"] > H + 40:
            nf = make_flake(fl["front"])
            fl.update(nf)

out_path = f"{OUT}/yogiferno-title-anim-v6.mp4"
cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
       "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-r", str(FPS), out_path]
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def ease_out(t):
    return 1 - (1 - t) ** 3

def pose_at(af):
    t = af % TOTAL_CYCLE
    acc = 0
    for name, hold in CYCLE:
        if t < acc + hold:
            return name
        acc += hold
    return CYCLE[-1][0]

for f in range(N):
    flick[0] = f
    # tundra scroll: bg offset grows 3px/frame (travelling), peaks slower via bg itself
    off = (f * 3) % 1600
    bg = bg_strip.crop((off, 90, off + W, 90 + H)).convert("RGB")
    frame = bg
    # gust band (Black 2 cycle/256 -> 4 bands) + swell within the band
    band = (f // 45) % 4
    WIND[1] = band
    swell = 0.5 + 0.5 * math.sin(f * 0.11)
    # blizzard fog haze (Black 2 fog/light fade): swells with the gust
    haze = Image.new("RGBA", frame.size, (255, 255, 255, int(14 + 9 * band + 8 * swell)))
    frame = Image.alpha_composite(frame.convert("RGBA"), haze)
    step_flakes(back_flakes, band, f)
    step_flakes(front_flakes, band, f)
    d = ImageDraw.Draw(frame, "RGBA")
    # distant peaks silhouette (slow parallax, 1px/frame) along the horizon
    poff = (f * 1) % 640
    for bx in range(-640, W + 640, 320):
        x0 = bx + poff
        d.polygon([(x0, 330), (x0 + 160, 190), (x0 + 320, 330)], fill=(90, 110, 140, 90))
    # wind streaks
    for sx, sy in streaks:
        nx = sx - f * 6
        while nx < -120:
            nx += W + 120
        d.line([(nx, sy), (nx + 90, sy)], fill=(255, 255, 255, 80), width=2)
    # figure position / pose / entrance alpha
    if f < 25:
        t = f / 24
        fx, alpha, pose = CX, int(255 * t), "stride-a"
    elif f < 55:
        t = ease_out((f - 25) / 29)
        fx, alpha, pose = CX + (rest_x - CX) * t, 255, "stride-a"
    else:
        fx, alpha, pose = rest_x, 255, pose_at(f - 55)
    # torch appear ramp: frames 10-40, 30 frames, 0 -> full
    if f < 10:
        talpha, fscale = 0, 0.4
    elif f <= 40:
        r = (f - 10) / 30
        talpha, fscale = int(255 * r), 0.4 + 0.6 * r
    else:
        talpha, fscale = 255, 1.0
    fig = pose_imgs[pose]
    w, h = fig.size
    px, py = int(fx - w / 2), int(FEET - h)
    if alpha < 255:
        a = fig.copy()
        al = a.split()[3].point(lambda v: v * alpha // 255)
        a.putalpha(al)
        fig = a
    d = ImageDraw.Draw(frame, "RGBA")
    for fl in back_flakes:
        draw_flake(d, fl["x"], fl["y"], fl["size"], 200 if fl["size"] < 3 else 230)
    tmp = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    tmp.paste(fig, (px, py), fig)
    frame = Image.alpha_composite(frame.convert("RGBA"), tmp)
    # translucent overlays (torch, drifts, embers, burst) go on ONE
    # transparent overlay, composited once — never drawn straight onto the
    # opaque frame, or PIL overwrites alpha and convert('RGB') makes every
    # glow a solid disc (take-1 bug).
    ov = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov, "RGBA")
    # torch drawn per frame (tracked, appearing slowly)
    base, fist, fxy, fw, fh, lean = POSES[pose]
    sc = 448 / 190
    # flame flicker harder against the wind: amplitude grows with gust
    draw_torch(d, px, py, sc, fist, fxy, fw, fh, lean, talpha, fscale * (1 + (0.08 + 0.06 * band) * math.sin(f * 1.7)))
    # front flakes (small/medium, translucent) stream past IN FRONT of him
    for fl in front_flakes:
        draw_flake(d, fl["x"], fl["y"], fl["size"], 150)
    # wind streaks inside the snow: long horizontal streaks racing left
    for sx, sy, ln, sp in blizz_streaks:
        nx = sx - f * sp
        while nx < -200:
            nx += W + 200
        d.line([(nx, sy), (nx + ln, sy)], fill=(255, 255, 255, 70), width=2)
    # snow piling/drifting at his feet as he pushes through: mounds grow
    # with the video and spray blows left off them
    grow = min(1.0, f / 150)
    d.ellipse([fx - 95, FEET - 4 - 14 * grow, fx + 105, FEET + 10], fill=(255, 255, 255, 200))
    d.ellipse([fx - 60, FEET - 2 - 20 * grow, fx + 60, FEET + 8], fill=(255, 255, 255, 230))
    if f >= 55:
        for _ in range(3):
            spray.append([f, rng.uniform(-40, 60), rng.uniform(-14, 0), rng.uniform(-9, -4), rng.uniform(-2, 0.5)])
        alive_sp = []
        for (sf, ox, oy, vx, vy) in spray:
            age = f - sf
            if age > 24:
                continue
            alive_sp.append((sf, ox, oy, vx, vy))
            ex = fx + ox + vx * age
            ey = FEET + oy + vy * age
            d.ellipse([ex - 3, ey - 3, ex + 3, ey + 3], fill=(255, 255, 255, int(200 * (1 - age / 24))))
        spray = alive_sp
    # foreground drifts (fast parallax, wrap)
    for dx0, dy0, dw, dh in drifts:
        nx = dx0 - f * 6
        while nx < -400:
            nx += W + 400
        d.ellipse([nx, dy0, nx + dw, dy0 + dh], fill=(255, 255, 255, 110))
    # fire trail embers at feet, drift left (behind, he travels right), fade 30f
    if f >= 55:
        for _ in range(2):
            trail.append([f, rng.uniform(-14, 14), rng.uniform(-6, 2),
                          rng.uniform(-3.2, -1.0), rng.uniform(-3.5, -1.8),
                          rng.uniform(3, 8), rng.choice([(249, 115, 22), (239, 68, 68), (251, 191, 36)])])
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
    # burst beats
    if f in (75, 135) or (75 < f < 95) or (135 < f < 155):
        start = 75 if f < 110 else 135
        bf = f - start
        for (bx, by, sz, col) in burst_pts:
            d.ellipse([fx + bx + bf, FEET - 224 + by + bf * 0.5 - sz,
                       fx + bx + bf + sz * 2, FEET - 224 + by + bf * 0.5 + sz], fill=col + (220,))
    frame = Image.alpha_composite(frame, ov)
    d = ImageDraw.Draw(frame, "RGBA")
    # PRESS START, FireRed tempo scaled to 30fps: 30 on first, then 15/15
    show_press = (f < 30) or ((f - 30) % 30 < 15)
    if show_press:
        txt = "PRESS START"
        bbox = d.textbbox((0, 0), txt, font=FONT)
        tw = bbox[2] - bbox[0]
        d.text((W // 2 - tw // 2, H - 70), txt, font=FONT, fill=(255, 255, 255, 255))
    proc.stdin.write(frame.convert("RGB").tobytes())
proc.stdin.close()
proc.wait()
print("done", out_path, os.path.getsize(out_path))
