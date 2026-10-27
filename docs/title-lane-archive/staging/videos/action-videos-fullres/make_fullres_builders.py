#!/usr/bin/env python3
"""Transform 1280x720 title-video builders into native 1600x900 builders.

Uniform geometry scale S=1.25. Every replacement is asserted (count >= 1)
so a silently-missed constant fails loudly instead of shipping a
mis-placed figure. Builders are copied, never edited in place.
"""
import os

BASE = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds"
OUTD = os.path.join(BASE, "action-videos-fullres")
os.makedirs(OUTD, exist_ok=True)

COMMON = [
    ("W, H, FPS, FRAMES_N = 1280, 720, 30, 180", "W, H, FPS, FRAMES_N = 1600, 900, 30, 180"),
    ("FEET, CX = 560, 640", "FEET, CX = 700, 800"),
    ("rest_draft * 0.8", "rest_draft * 1.0"),
    ("base_h=448", "base_h=560"),
    ('ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)',
     'ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 45)'),
    ("math.sin(f * 0.05) * 8", "math.sin(f * 0.05) * 10"),
    ("(16 + dx, 0, 16 + dx + W, H)", "(20 + dx, 0, 20 + dx + W, H)"),
    ("rng.choice([80, 160, 240, 320, 400])", "rng.choice([100, 200, 300, 400, 500])"),
    ("nx = sx - f * 6", "nx = sx - f * 7.5"),
    ("while nx < -120:", "while nx < -150:"),
    ("nx += W + 120", "nx += W + 150"),
    ("(nx + 90, sy)", "(nx + 112, sy)"),
    ("rng.uniform(240, 380)", "rng.uniform(300, 475)"),
    ("rng.uniform(12, 22) if burst == \"leaves\" else rng.uniform(4, 10)",
     "rng.uniform(15, 27.5) if burst == \"leaves\" else rng.uniform(5, 12.5)"),
    ("rad = 260 * (1.618 ** (-p * 2))", "rad = 325 * (1.618 ** (-p * 2))"),
    ("math.cos(math.pi * 3) * 260 * (1.618 ** -2)", "math.cos(math.pi * 3) * 325 * (1.618 ** -2)"),
    ("math.sin(math.pi * 3) * 260 * (1.618 ** -2)", "math.sin(math.pi * 3) * 325 * (1.618 ** -2)"),
    ("fy_off = -36", "fy_off = -45"),
    ("sy0 = -36", "sy0 = -45"),
    ("(-36 - sy0)", "(-45 - sy0)"),
    ("math.sin((f - 155) * 0.35) * 10", "math.sin((f - 155) * 0.35) * 12.5"),
    ("math.cos(ang) * 48", "math.cos(ang) * 60"),
    ("math.sin(ang) * 14", "math.sin(ang) * 17.5"),
    ('pose, fwd = "swim-together", 20', 'pose, fwd = "swim-together", 25'),
    ('pose, fwd = "swim-apart", 40', 'pose, fwd = "swim-apart", 50'),
    ('pose, fwd = "swim-together", 40', 'pose, fwd = "swim-together", 50'),
    ("fy_off = -6 if pose.startswith(\"swim\")", "fy_off = -7.5 if pose.startswith(\"swim\")"),
    ("math.sin(cyc * 3) * 4", "math.sin(cyc * 3) * 5"),
    ("math.cos(cyc * 3) * 3", "math.cos(cyc * 3) * 3.75"),
    ("[(-90, 8, 70), (-30, 12, 90), (40, 8, 80)]", "[(-112, 10, 88), (-38, 15, 112), (50, 10, 100)]"),
    ("FEET + oy + 6", "FEET + oy + 7.5"),
    ("+ ln // 2 + 12, FEET + oy + 16", "+ ln // 2 + 15, FEET + oy + 20"),
    ("((70, 40), (45, 70), (25, 110))", "((87, 40), (56, 70), (31, 110))"),
    ("((140, 140), (1140, 180), (1080, 560))", "((175, 175), (1425, 225), (1350, 700))"),
    ("pulse = 30 + int(math.sin(f * 0.3) * 10)", "pulse = 37 + int(math.sin(f * 0.3) * 12.5)"),
    # NOTE: Kittember trail rr is v3-only, applied after the COMMON loop.
    ("FEET - 224", "FEET - 280"),
    ("bf * 1.2", "bf * 1.5"),
    ("bf * 0.8", "bf * 1.0"),
    ("bf * 0.5", "bf * 0.625"),
    ("H - 70", "H - 87"),
    ('fx = rest_x + (6 if pose == "step-a" else (-6 if pose == "pass" else 0))',
     'fx = rest_x + (7.5 if pose == "step-a" else (-7.5 if pose == "pass" else 0))'),
]

V6 = [
    ("W, H, FPS, N = 1280, 720, 30, 180", "W, H, FPS, N = 1600, 900, 30, 180"),
    ("FEET, CX = 560, 640", "FEET, CX = 700, 800"),
    ("rest_x = CX + int(-140 * 0.8)", "rest_x = CX + int(-140 * 1.0)"),
    ("def load_pose(p, base_h=448):", "def load_pose(p, base_h=560):"),
    ('ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)',
     'ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 45)'),
    ("sc = 448 / 190", "sc = 560 / 190"),
    ("pulse = 26 + int(math.sin(flick[0] * 0.7) * 8)", "pulse = 32 + int(math.sin(flick[0] * 0.7) * 10)"),
    ("(pulse + 18, 45)", "(pulse + 22, 45)"),
    ("d.ellipse([fx - 60, FEET - 18, fx + 130 * out if out > 0 else fx + 60, FEET + 14],",
     "d.ellipse([fx - 75, FEET - 22, fx + 162 * out if out > 0 else fx + 75, FEET + 17],"),
    ("rng.choice([80, 160, 240, 320, 400])", "rng.choice([100, 200, 300, 400, 500])"),
    ("(rng.uniform(0, W), 640 + rng.uniform(0, 60), rng.uniform(180, 380), rng.uniform(24, 48))",
     "(rng.uniform(0, W), 800 + rng.uniform(0, 75), rng.uniform(225, 475), rng.uniform(30, 60))"),
    ("GUST_X = [5, 7, 9, 11]", "GUST_X = [6.25, 8.75, 11.25, 13.75]"),
    ("GUST_Y = [1, 2, 1, 2]", "GUST_Y = [1.25, 2.5, 1.25, 2.5]"),
    ("(rng.uniform(0, W), rng.uniform(40, 640), rng.uniform(60, 180),\n                  rng.uniform(30, 55))",
     "(rng.uniform(0, W), rng.uniform(50, 800), rng.uniform(75, 225),\n                  rng.uniform(37.5, 68.75))"),
    ("d.ellipse([x - 2, y - 2, x + 2, y + 2]", "d.ellipse([x - 3, y - 3, x + 3, y + 3]"),
    ("d.ellipse([x - 4, y - 4, x + 4, y + 4]", "d.ellipse([x - 5, y - 5, x + 5, y + 5]"),
    ("d.line([(x - 6, y), (x + 6, y)]", "d.line([(x - 8, y), (x + 8, y)]"),
    ("d.line([(x, y - 6), (x, y + 6)]", "d.line([(x, y - 8), (x, y + 8)]"),
    ("r = 8\n", "r = 10\n"),
    ("d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(255, 255, 255, alpha))\n    else:",
     "d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(255, 255, 255, alpha))\n    else:"),
    ("d.ellipse([x - 16, y - 3, x + 16, y + 3]", "d.ellipse([x - 20, y - 4, x + 20, y + 4]"),
    ("d.ellipse([x - 4, y - 5, x + 4, y + 5]", "d.ellipse([x - 5, y - 6, x + 5, y + 6]"),
    ("off = (f * 3) % 1600", "off = int(f * 3.75) % 1600"),
    ("bg = bg_strip.crop((off, 90, off + W, 90 + H))", "bg = bg_strip.crop((off, 0, off + W, 900))"),
    ("poff = (f * 1) % 640", "poff = int(f * 1.25) % 800"),
    ("for bx in range(-640, W + 640, 320):", "for bx in range(-800, W + 800, 400):"),
    ("d.polygon([(x0, 330), (x0 + 160, 190), (x0 + 320, 330)]",
     "d.polygon([(x0, 412), (x0 + 200, 237), (x0 + 400, 412)]"),
    ("nx = sx - f * 6", "nx = sx - f * 7.5"),
    ("while nx < -120:", "while nx < -150:"),
    ("nx += W + 120", "nx += W + 150"),
    ("(nx + 90, sy)", "(nx + 112, sy)"),
    ("while nx < -200:", "while nx < -250:"),
    ("nx += W + 200", "nx += W + 250"),
    ("d.ellipse([fx - 95, FEET - 4 - 14 * grow, fx + 105, FEET + 10]",
     "d.ellipse([fx - 119, FEET - 5 - 17.5 * grow, fx + 131, FEET + 12]"),
    ("d.ellipse([fx - 60, FEET - 2 - 20 * grow, fx + 60, FEET + 8]",
     "d.ellipse([fx - 75, FEET - 2 - 25 * grow, fx + 75, FEET + 10]"),
    ("rng.uniform(-40, 60), rng.uniform(-14, 0), rng.uniform(-9, -4), rng.uniform(-2, 0.5)",
     "rng.uniform(-50, 75), rng.uniform(-17.5, 0), rng.uniform(-11.25, -5), rng.uniform(-2.5, 0.625)"),
    ("d.ellipse([ex - 3, ey - 3, ex + 3, ey + 3]", "d.ellipse([ex - 4, ey - 4, ex + 4, ey + 4]"),
    ("nx = dx0 - f * 6", "nx = dx0 - f * 7.5"),
    ("while nx < -400:", "while nx < -500:"),
    ("nx += W + 400", "nx += W + 500"),
    ("rng.uniform(-14, 14), rng.uniform(-6, 2),\n                          rng.uniform(-3.2, -1.0), rng.uniform(-3.5, -1.8),\n                          rng.uniform(3, 8)",
     "rng.uniform(-17.5, 17.5), rng.uniform(-7.5, 2.5),\n                          rng.uniform(-4, -1.25), rng.uniform(-4.375, -2.25),\n                          rng.uniform(3.75, 10)"),
    ("FEET - 224", "FEET - 280"),
    ("bf * 0.5", "bf * 0.625"),
    ("d.text((W // 2 - tw // 2, H - 70)", "d.text((W // 2 - tw // 2, H - 87)"),
    ('out_path = f"{OUT}/yogiferno-title-anim-v6.mp4"',
     'out_path = f"{OUT}/yogiferno-title-anim-fullres.mp4"'),
]


def apply(src, dst, pairs, out_sub):
    with open(src) as fh:
        txt = fh.read()
    txt = txt.replace('OUT = ', 'OUT = ')  # no-op, clarity
    for old, new in pairs:
        n = txt.count(old)
        assert n >= 1, f"{src}: NOT FOUND: {old!r}"
        txt = txt.replace(old, new)
    txt = txt.replace(out_sub[0], out_sub[1])
    with open(dst, "w") as fh:
        fh.write(txt)
    print("wrote", dst)


# v2 builder: OUT dir + filename
v2src = os.path.join(BASE, "action-videos-v2/build_videos_v2.py")
with open(v2src) as fh:
    v2 = fh.read()
for old, new in COMMON:
    assert v2.count(old) >= 1, f"v2 NOT FOUND: {old!r}"
    v2 = v2.replace(old, new)
v2 = v2.replace('OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v2"',
                f'OUT = "{OUTD}"')
v2 = v2.replace('f"{OUT}/{creature}-title-anim-v2.mp4"', 'f"{OUT}/{creature}-title-anim-fullres.mp4"')
with open(os.path.join(OUTD, "build_videos_fullres_v2.py"), "w") as fh:
    fh.write(v2)

# v3 builder
v3src = os.path.join(BASE, "action-videos-v3/build_videos_v3.py")
with open(v3src) as fh:
    v3 = fh.read()
for old, new in COMMON:
    assert v3.count(old) >= 1, f"v3 NOT FOUND: {old!r}"
    v3 = v3.replace(old, new)
assert v3.count("rr = 45 - i * 5") >= 1, "v3 trail rr NOT FOUND"
v3 = v3.replace("rr = 45 - i * 5", "rr = 56 - i * 6")
v3 = v3.replace('OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v3"',
                f'OUT = "{OUTD}"')
v3 = v3.replace('f"{OUT}/{creature}-title-anim-v3.mp4"', 'f"{OUT}/{creature}-title-anim-fullres.mp4"')
with open(os.path.join(OUTD, "build_videos_fullres_v3.py"), "w") as fh:
    fh.write(v3)

# v6 builder
v6src = os.path.join(BASE, "action-videos-v6/build_video_v6.py")
with open(v6src) as fh:
    v6 = fh.read()
for old, new in V6:
    assert v6.count(old) >= 1, f"v6 NOT FOUND: {old!r}"
    v6 = v6.replace(old, new)
v6 = v6.replace('OUT = "/home/hatch/workspace/mochiichao-work/ui-art/title-backgrounds/action-videos-v6"',
                f'OUT = "{OUTD}"')
with open(os.path.join(OUTD, "build_video_fullres_v6.py"), "w") as fh:
    fh.write(v6)
print("all builders transformed")
