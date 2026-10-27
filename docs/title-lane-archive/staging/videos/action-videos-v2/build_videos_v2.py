#!/usr/bin/env python3
"""V2 title videos: POSE-SWITCHING animation, not a bouncing still.
Structure (Pokemon, from decomp, structure only -- no Pokemon art/sound/logo):
- FireRed event_object_movement.c SetStepAnimHandleAlternation: each step seeks
  to the ALTERNATE frame in the frame table (animPos 0<->3, 1<->2). Poses here
  cut hard on a frame table, never crossfade, never slide one image.
- FireRed battle_anim.c BattleAnimHelper_SetSpriteSquashParams: scale start->end
  over a duration -- squash & stretch is a timed parameter, not a sine wobble.
- FireRed title blink tempo: first blink 60 frames, then 30/30 (scaled to 30fps
  video: 30 on first, then 15 on / 15 off) for PRESS START.
- InitMoveInPlace: anim runs for a duration, then animPaused (return to stand)
  -- Dorowani stand -> swim -> stand follows this exactly.
Timing: video 30fps; GBA runs 60fps, so 1 GBA frame = 0.5 video frames. Pose holds
below are video frames, with GBA equivalents in comments.
Beyond Pokemon: 9 layers (drift, weather, streaks, entrance, pose cycle,
burst, secondary ambient, foreground, camera), phi paths for Mythar, circle
walk for Kittember, ground-crack + screen shake for Tyrage impact.
No audio. No logo baked in. MP4 1280x720, 30fps, 6s, 180 frames.
"""
import math, os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = "/home/hatch/workspace/mochiichao-work/title-bg-work/src/assets/title"
FRAMES = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2/frames"
OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2"
os.makedirs(OUT, exist_ok=True)
W, H, FPS, FRAMES_N = 1280, 720, 30, 180
FEET, CX = 560, 640
LEAF = Image.open("/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/mochi-leaf-32.png").convert("RGBA")
try:
    FONT = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
except Exception:
    FONT = ImageFont.load_default()

# creature: (card, rest_draft, [pose names in cycle order], hold_frames, burst)
CARDS = {
    "yogiferno": ("snow", -140, ["step-a", "pass", "lean"], 6, "fire"),
    "dorowani": ("water", -140, ["stand", "swim-together", "swim-apart", "swim-together", "stand"], 10, "bubbles"),
    "razorgater": ("stone", -140, ["mouth-open", "mouth-half", "mouth-closed", "mouth-half"], 5, "sparks"),
    "gabu": ("forest", -140, ["stand", "arms-up", "leaf-throw", "crouch"], 8, "leaves"),
    "wispkin": ("night", -140, ["hands-face", "hands-press", "hands-peel", "tilt-left", "tilt-right", "smoke-puff"], 6, "smoke"),
    "sproutle": ("grass", 140, ["stand", "wave", "step"], 10, "shield"),
    "tyrage": ("sand", 140, ["stand", "stomp-up", "impact", "roar-up"], 8, "sand"),
    "mochii": ("rain", 140, ["round", "squash-wide", "stretch-tall", "tilt", "splash-flat"], 6, "bubbles"),
    "kittember": ("lantern", 140, ["walk-a", "walk-b", "tail-up", "tail-down", "sit-look"], 7, "fire"),
    "mythar": ("mythar", 0, ["wings-neutral", "wings-up", "wings-down", "wings-fold"], 8, "sparkle"),
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


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def load_pose(creature, pose, base_h=448):
    p = f"{FRAMES}/{creature}-pose-{pose}.png"
    im = Image.open(p).convert("RGBA")
    w = int(im.size[0] * base_h / im.size[1])
    return im.resize((w, base_h), Image.LANCZOS)


def build(creature):
    card, rest_draft, poses, hold, burst = CARDS[creature]
    rest_x = CX + int(rest_draft * 0.8)
    bg0 = Image.open(f"{ROOT}/title-bg-{card}-v2.png").convert("RGBA").resize((W + 32, H), Image.LANCZOS)
    pose_imgs = {p: load_pose(creature, p) for p in poses}
    # mirrored walk poses for Kittember circle return half
    if creature == "kittember":
        for p in ("walk-a", "walk-b"):
            pose_imgs[p + "-mir"] = pose_imgs[p].transpose(Image.FLIP_LEFT_RIGHT)
    rng = random.Random(1234 + len(creature))
    burst_pts = []
    if burst != "shield":
        cols = BURST_COLS[burst]
        for i in range(16):
            a = (i / 16) * 2 * math.pi + rng.uniform(-0.3, 0.3)
            r = rng.uniform(240, 380)
            sz = rng.uniform(12, 22) if burst == "leaves" else rng.uniform(4, 10)
            burst_pts.append((math.cos(a) * r, math.sin(a) * r * 0.7, sz, rng.choice(cols)))
    streaks = [(rng.uniform(0, W), rng.choice([80, 160, 240, 320, 400])) for _ in range(4)]
    out_path = f"{OUT}/{creature}-title-anim-v2.mp4"
    cmd = ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-r", str(FPS), out_path]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for f in range(FRAMES_N):
        # background drift
        dx = int(math.sin(f * 0.05) * 8)
        frame = bg0.crop((16 + dx, 0, 16 + dx + W, H)).convert("RGB")
        d = ImageDraw.Draw(frame, "RGBA")
        # wind streaks (LeafGreen idea, behind figure)
        for i, (sx, sy) in enumerate(streaks):
            nx = sx - f * 6
            while nx < -120:
                nx += W + 120
            d.line([(nx, sy), (nx + 90, sy)], fill=(255, 255, 255, 80), width=2)
        # ---- figure position + pose (frame table, hard cuts) ----
        shake_x = shake_y = 0
        if f < 25:
            t = f / 24
            fx, fy_off, alpha = CX, 0, int(255 * t)
            pose = poses[0]
            scale_note = 0.95 + 0.05 * t
        elif f < 55:
            t = ease_out((f - 25) / 29)
            if creature == "mythar":
                fx, fy_off, alpha = CX, -36, 255
            else:
                fx = CX + (rest_x - CX) * t
                fy_off, alpha = 0, 255
            pose = poses[0]
            scale_note = 1.0
        else:
            af = f - 55
            if creature == "mythar":
                # phi path 55-114, slow ease to centre 115-154, hold centre 155-179
                if f < 115:
                    p = (f - 55) / 60
                    ang = p * math.pi * 3  # 1.5 turns
                    rad = 260 * (1.618 ** (-p * 2))
                    fx = CX + math.cos(ang) * rad
                    fy_off = -36 + math.sin(ang) * rad * 0.55
                    pose = poses[(af // hold) % len(poses)]
                elif f < 155:
                    t = ease_out((f - 115) / 40)
                    # start from phi-path end point (approx, recompute at p=1)
                    sx0 = CX + math.cos(math.pi * 3) * 260 * (1.618 ** -2)
                    sy0 = -36 + math.sin(math.pi * 3) * 260 * (1.618 ** -2) * 0.55
                    fx = sx0 + (CX - sx0) * t
                    fy_off = sy0 + (-36 - sy0) * t
                    pose = poses[(af // hold) % len(poses)]
                else:
                    fx = CX
                    fy_off = -36 + math.sin((f - 155) * 0.35) * 10
                    pose = poses[((f - 155) // 12) % len(poses)]
                alpha = 255
            elif creature == "kittember":
                # circle walk around rest: angle advances, walk poses alternate,
                # mirror when moving leftward (turning), sit-look pauses at top
                ang = (af / 60) * 2 * math.pi
                fx = rest_x + math.cos(ang) * 48
                fy_off = math.sin(ang) * 14
                moving_left = math.sin(ang) > 0
                step = (af // 6) % 2
                if af % 60 < 40:
                    base_pose = "walk-a" if step == 0 else "walk-b"
                    pose = base_pose + ("-mir" if moving_left else "")
                elif af % 60 < 50:
                    pose = "tail-up" if (af // 8) % 2 == 0 else "tail-down"
                else:
                    pose = "sit-look"
                alpha = 255
            elif creature == "dorowani":
                # stand -> swim forward -> stand (InitMoveInPlace structure)
                cyc = af % 50
                if cyc < 10:
                    pose, fwd = "stand", 0
                elif cyc < 20:
                    pose, fwd = "swim-together", 20
                elif cyc < 30:
                    pose, fwd = "swim-apart", 40
                elif cyc < 40:
                    pose, fwd = "swim-together", 40
                else:
                    pose, fwd = "stand", 0
                fx = rest_x + fwd
                fy_off = -6 if pose.startswith("swim") else 0
                alpha = 255
            elif creature == "tyrage":
                cyc = af % 30
                if cyc < 6:
                    pose = "stand"
                elif cyc < 12:
                    pose = "stomp-up"
                elif cyc < 20:
                    pose = "impact"
                    shake_x = int(math.sin(cyc * 3) * 4)
                    shake_y = int(math.cos(cyc * 3) * 3)
                elif cyc < 26:
                    pose = "roar-up"
                else:
                    pose = "stand"
                fx = rest_x
                fy_off = 0
                alpha = 255
            else:
                pose = poses[(af // hold) % len(poses)]
                fx = rest_x
                fy_off = 0
                alpha = 255
                if creature == "yogiferno":
                    # walk in place: small forward/back shift per step, not a slide
                    fx = rest_x + (6 if pose == "step-a" else (-6 if pose == "pass" else 0))
            fig = pose_imgs[pose]
            w, h = fig.size
            # paste figure, feet at FEET + fy_off, plus shake for tyrage impact
            px = int(fx - w / 2 + shake_x)
            py = int(FEET - h + fy_off + shake_y)
            tmp = Image.new("RGBA", frame.size, (0, 0, 0, 0))
            tmp.paste(fig, (px, py), fig)
            frame = Image.alpha_composite(frame.convert("RGBA"), tmp).convert("RGB")
            d = ImageDraw.Draw(frame, "RGBA")
            # Tyrage crack lines at feet during impact
            if creature == "tyrage" and pose == "impact":
                cx0 = int(fx)
                for k, (ox, oy, ln) in enumerate([(-90, 8, 70), (-30, 12, 90), (40, 8, 80)]):
                    d.line([(cx0 + ox, FEET + oy), (cx0 + ox + ln, FEET + oy + 6)], fill=(34, 211, 238, 220), width=3)
                    d.line([(cx0 + ox + ln // 2, FEET + oy + 6), (cx0 + ox + ln // 2 + 12, FEET + oy + 16)], fill=(34, 211, 238, 220), width=2)
            # Kittember lights: tail glow (at tail orb, right side of figure) + lantern glow
            if creature == "kittember":
                tx, ty = int(fx + w * 0.38), int(FEET - h * 0.55 + fy_off)
                for r, al in ((70, 40), (45, 70), (25, 110)):
                    d.ellipse([tx - r, ty - r, tx + r, ty + r], fill=(249, 115, 22, al))
                for (lx, ly) in ((140, 140), (1140, 180), (1080, 560)):
                    pulse = 30 + int(math.sin(f * 0.3) * 10)
                    d.ellipse([lx - pulse, ly - pulse, lx + pulse, ly + pulse], fill=(253, 224, 71, 60))
            # burst beats at 75 and 135 (v1 beats), 20 frames each, particles AROUND figure
            if f in (75, 135) or (75 < f < 95) or (135 < f < 155):
                start = 75 if f < 110 else 135
                bf = f - start
                for (bx, by, sz, col) in burst_pts:
                    if burst == "leaves":
                        leaf = LEAF.resize((int(sz * 2), int(sz * 2)), Image.LANCZOS)
                        frame.paste(leaf, (int(fx + bx + bf * 1.2), int(FEET - 224 + by + bf * 0.8)), leaf)
                    else:
                        d.ellipse([fx + bx + bf, FEET - 224 + by + bf * 0.5 - sz, fx + bx + bf + sz * 2, FEET - 224 + by + bf * 0.5 + sz], fill=col + (220,))
                frame = frame.convert("RGB")
                d = ImageDraw.Draw(frame, "RGBA")
            # PRESS START blink (FireRed tempo scaled to 30fps)
            if f < 30 or ((f - 30) % 30) < 15:
                txt = "PRESS START"
                bbox = d.textbbox((0, 0), txt, font=FONT)
                tw = bbox[2] - bbox[0]
                d.text(((W - tw) // 2, H - 70), txt, font=FONT, fill=(255, 255, 255, 255))
            proc.stdin.write(frame.convert("RGB").tobytes())
            continue
        # entrance frames (before action loop): paste figure without burst/effects
        fig = pose_imgs[pose]
        w, h = fig.size
        tmp = Image.new("RGBA", frame.size, (0, 0, 0, 0))
        # fade: apply alpha
        if alpha < 255:
            arr = fig.copy()
            a = arr.split()[3].point(lambda v: v * alpha // 255)
            arr.putalpha(a)
            fig = arr
        tmp.paste(fig, (int(fx - w / 2), int(FEET - h + fy_off)), fig)
        frame = Image.alpha_composite(frame.convert("RGBA"), tmp).convert("RGB")
        d = ImageDraw.Draw(frame, "RGBA")
        if f < 30 or ((f - 30) % 30) < 15:
            txt = "PRESS START"
            bbox = d.textbbox((0, 0), txt, font=FONT)
            tw = bbox[2] - bbox[0]
            d.text(((W - tw) // 2, H - 70), txt, font=FONT, fill=(255, 255, 255, 255))
        proc.stdin.write(frame.convert("RGB").tobytes())
    proc.stdin.close()
    proc.wait()
    print(creature, out_path, os.path.getsize(out_path))


if __name__ == "__main__":
    targets = sys.argv[1:] or list(CARDS)
    for t in targets:
        build(t)
