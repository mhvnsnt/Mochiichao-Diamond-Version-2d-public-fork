#!/usr/bin/env python3
"""Mythar leg-tool v6 show sheet (staged only). v3 vs v6, black + dark ground,
leg zooms + wing/ring gap proof crops. v6 built by myhar-leg-tool-v6-20261026.py."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np
W = '/home/hatch/workspace/mochiichao-work/title-creatures-9/work/'
v3 = np.array(Image.open(W + 'mythar-white-removed-v3-20261026.png').convert('RGBA'))
v6 = np.array(Image.open(W + 'mythar-leg-tool-v6-20261026.png').convert('RGBA'))
try:
    fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 24)
    fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 19)
    ftag = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception:
    fb = fs = ftag = ImageFont.load_default()
def comp(img, bg):
    a = img[:, :, 3:4] / 255.0
    return (img[:, :, :3] * a + np.array(bg) * (1 - a)).astype(np.uint8)
def tag(d, x, y, text):
    d.rectangle([x, y, x + 12 + 11 * len(text), y + 30], fill=(0, 0, 0))
    d.text((x + 6, y + 4), text, fill=(255, 220, 0), font=ftag)
def crop(img, box, scale, bg):
    x0, x1, y0, y1 = box
    pad = 6
    x0p, y0p = max(0, x0 - pad), max(0, y0 - pad)
    x1p, y1p = min(433, x1 + pad), min(349, y1 + pad)
    c = comp(img[y0p:y1p + 1, x0p:x1p + 1], bg)
    return Image.fromarray(c).resize((c.shape[1] * scale, c.shape[0] * scale), Image.NEAREST)
S = Image.new('RGB', (1600, 2120), (10, 10, 16))
d = ImageDraw.Draw(S)
d.text((20, 10), 'Mythar leg-tool v6 (MI-GAN) — v3 vs v6: legs ONLY', fill=(255, 255, 255), font=fb)
y = 56
for bg, bname in [((0, 0, 0), 'black ground'), ((24, 32, 48), 'dark ground')]:
    d.text((20, y), f'Full figure — {bname}', fill=(255, 255, 255), font=fs)
    y += 28
    for im, lbl, x in [(v3, 'v3', 20), (v6, 'v6 NEW', 480)]:
        S.paste(Image.fromarray(comp(im, bg)), (x, y))
        tag(d, x, y, lbl)
    d.text((960, y + 40), 'Legs: solid + full,', fill=(255, 255, 255), font=fs)
    d.text((960, y + 70), 'anatomy kept.', fill=(255, 255, 255), font=fs)
    d.text((960, y + 100), 'Gaps: untouched.', fill=(255, 255, 255), font=fs)
    y += 380
LEGS = {'LEFT leg': (149, 178, 280, 349), 'RIGHT leg': (247, 278, 290, 349)}
for bg, bname in [((0, 0, 0), 'black ground'), ((24, 32, 48), 'dark ground')]:
    d.text((20, y), f'Leg zooms 4x — {bname}', fill=(255, 255, 255), font=fs)
    y += 28
    x = 20
    for lname, box in LEGS.items():
        for im, lbl in [(v3, 'v3'), (v6, 'v6')]:
            cr = crop(im, box, 4, bg)
            cr.thumbnail((300, 300), Image.NEAREST)
            S.paste(cr, (x, y))
            tag(d, x, y, f'{lname} {lbl}')
            x += 330
        x += 60
    y += 320
d.text((20, y), 'Gap proof — wing + ring gaps v3 vs v6 (must be IDENTICAL)', fill=(255, 255, 255), font=fs)
y += 28
for gname, box in [('LEFT flank gap', (70, 160, 200, 260)), ('RIGHT flank/ring gap', (270, 360, 200, 260))]:
    d.text((20, y), gname, fill=(255, 220, 120), font=fs)
    y += 26
    x = 20
    for im, lbl in [(v3, 'v3'), (v6, 'v6')]:
        cr = crop(im, box, 3, bg=(0, 0, 0))
        cr.thumbnail((430, 220), Image.NEAREST)
        S.paste(cr, (x, y))
        tag(d, x, y, lbl)
        x += 460
    y += 250
S.save(W + 'show-100/mythar-leg-tool-v6-show-20261026.png')
print('sheet', S.size)
