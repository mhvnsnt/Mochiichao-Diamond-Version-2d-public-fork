#!/usr/bin/env python3
"""Build the Mythar leg-fill v5 show sheet (staged only).

Panels: full figure v3 vs v5 on black AND dark ground (24,32,48); leg zooms
(3x) on BOTH legs beneath the body; wing/ring gap proof crops (3x) showing
the flank gaps still open and identical in v3 and v5.
"""
from PIL import Image, ImageDraw, ImageFont

W = '/home/hatch/workspace/mochiichao-work/title-creatures-9/work/'
v3 = Image.open(W + 'mythar-white-removed-v3-20261026.png').convert('RGBA')
v5 = Image.open(W + 'mythar-leg-fill-v5-20261026.png').convert('RGBA')

try:
    FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
    FT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception:
    FB = FS = FT = ImageFont.load_default()

BLACK = (0, 0, 0)
DARK = (24, 32, 48)
YELLOW = (255, 220, 0)


def on_bg(im, bg, w):
    h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    canvas = Image.new('RGB', (w, h), bg)
    canvas.paste(im, (0, 0), im)
    return canvas


def tag(d, x, y, text, w=None):
    tw = d.textlength(text, font=FT) + 16
    d.rectangle([x, y, x + tw, y + 30], fill=(0, 0, 0))
    d.text((x + 8, y + 4), text, fill=YELLOW, font=FT)


def crop_on_bg(im, box, bg, scale=3):
    c = im.crop(box).resize(((box[2] - box[0]) * scale, (box[3] - box[1]) * scale), Image.NEAREST)
    canvas = Image.new('RGB', c.size, bg)
    canvas.paste(c, (0, 0), c)
    return canvas


CW = 1600
# layout heights (canvas oversized on purpose; cropped to content at the end)
full_w, full_h = 380, round(350 * 380 / 434)
leg_w, leg_h = 195, 270
gap_w, gap_h = 270, 180
H = 2000
sheet = Image.new('RGB', (CW, H), (10, 10, 14))
d = ImageDraw.Draw(sheet)
y = 12
d.text((20, y), 'MYTHAR LEG-ONLY FILL v5 — v3 vs v5 (legs ONLY)', fill=(255, 255, 255), font=FB)
y += 42
d.text((20, y), 'Base = v3 (NOT v4 — v4 discarded). Wing + ring gaps STAY OPEN.', fill=(200, 200, 200), font=FS)
y += 28
d.text((20, y), 'Legs: LEFT x149-178 y280-349, RIGHT x247-278 y290-349. Changed 2313 px, ALL inside leg shapes.',
       fill=(200, 200, 200), font=FS)
y += 28
d.text((20, y), 'Removed set 1871 px: 0 changed. Gold pixels: 0 changed.', fill=(200, 200, 200), font=FS)
y += 34

def row_panels(y, panels):
    # panels: list of (image, tagtext)
    x = 20
    maxh = max(p.height for p, _ in panels)
    for im, t in panels:
        sheet.paste(im, (x, y))
        tag(d, x, y, t)
        x += im.width + 20
    return y + maxh + 20

# full figures, black then dark
y = row_panels(y, [
    (on_bg(v3, BLACK, full_w), 'v3 — BLACK'),
    (on_bg(v5, BLACK, full_w), 'v5 — BLACK'),
    (on_bg(v3, DARK, full_w), 'v3 — DARK GROUND'),
    (on_bg(v5, DARK, full_w), 'v5 — DARK GROUND'),
])
# leg zooms (3x), black
left_box = (130, 260, 195, 350)
right_box = (230, 260, 295, 350)
y = row_panels(y, [
    (crop_on_bg(v3, left_box, BLACK), 'LEFT LEG v3'),
    (crop_on_bg(v5, left_box, BLACK), 'LEFT LEG v5'),
    (crop_on_bg(v3, right_box, BLACK), 'RIGHT LEG v3'),
    (crop_on_bg(v5, right_box, BLACK), 'RIGHT LEG v5'),
])
# gap proof crops (3x), black: flank gaps identical
lgap = (70, 200, 160, 260)
rgap = (270, 200, 360, 260)
y = row_panels(y, [
    (crop_on_bg(v3, lgap, BLACK), 'L GAP v3 — OPEN'),
    (crop_on_bg(v5, lgap, BLACK), 'L GAP v5 — OPEN'),
    (crop_on_bg(v3, rgap, BLACK), 'R GAP v3 — OPEN'),
    (crop_on_bg(v5, rgap, BLACK), 'R GAP v5 — OPEN'),
])
d.text((20, y), 'HOW TO JUDGE: legs should read SOLID and visible now (own colour, fully opaque).', fill=(255, 255, 255), font=FS)
y += 30
d.text((20, y), 'Wing gaps + ring-circle gaps are pixel-identical to v3 — nothing refilled there.', fill=(255, 255, 255), font=FS)
y += 30
d.text((20, y), 'Counts: LEFT solidified 1220 + holes 12; RIGHT solidified 1066 + holes 15; restored 0.', fill=(200, 200, 200), font=FS)
y += 30
d.text((20, y), 'Restored 0 because v3 lacked no leg-shape pixels; the faintness was semi-transparent leg pixels.', fill=(200, 200, 200), font=FS)
y += 34
out = W + 'show-100/mythar-leg-fill-v5-show-20261026.png'
sheet = sheet.crop((0, 0, CW, y))
sheet.save(out)
print(out, sheet.size)
