#!/usr/bin/env python3
"""Razorgater shadow-clean test — same methods as PR #84, no hand edits.

Crop: razorgater sheet v1, fractions (0.00, 0.05, 0.165, 0.35) as in
clean_cutouts_scripted.py. Razorgater was NOT flagged by Mars for
white spots; this test is shadow-only. Eye-colour drift is NOT in
scope here (main sheet red eyes vs angles blue eyes — Mars to pick).
Outputs: razorgater-u2netp.png + on-black, razorgater-grabcut.png +
on-black, plus this log. A human eye-check on black decides which,
if either, ships; a damaged body/claws/eyes means REJECT that method.
"""
import os
from PIL import Image
BASE = os.path.expanduser("~/workspace/mochiichao-work/sprite-art/2d-sheets")
OUT = os.path.expanduser("~/workspace/mochiichao-work/title-creatures-9/work/seg-test")
sheet = Image.open(os.path.join(BASE, "razorgater/media-generation-razorgater-sheet-v1-0-508c282d-2c17-4593-b37e-4beed88a094d.webp")).convert("RGB")
w, h = sheet.size
crop = sheet.crop((int(w * 0.00), int(h * 0.05), int(w * 0.165), int(h * 0.35)))
crop.save(os.path.join(OUT, "razorgater-crop.png"))
print(f"crop {crop.size} from sheet {sheet.size}", flush=True)
print("importing rembg...", flush=True)
from rembg import new_session, remove
session = new_session("u2netp")
out = remove(crop, session=session)
out.save(os.path.join(OUT, "razorgater-u2netp.png"))
dark = Image.new("RGBA", out.size, (0, 0, 0, 255)); dark.alpha_composite(out.convert("RGBA"))
dark.convert("RGB").save(os.path.join(OUT, "razorgater-u2netp-on-black.png"))
print(f"u2netp done {out.size} bbox={out.getchannel('A').getbbox()}", flush=True)
import cv2, numpy as np
img = cv2.imread(os.path.join(OUT, "razorgater-crop.png"))
hh, ww = img.shape[:2]
mask = np.full((hh, ww), cv2.GC_PR_FGD, dtype=np.uint8)
mask[:8, :] = cv2.GC_BGD; mask[-8:, :] = cv2.GC_BGD; mask[:, :8] = cv2.GC_BGD; mask[:, -8:] = cv2.GC_BGD
bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, None, bgd, fgd, 5, cv2.GC_INIT_WITH_MASK)
alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2RGBA); rgba[:, :, 3] = alpha
gout = Image.fromarray(rgba); gout.save(os.path.join(OUT, "razorgater-grabcut.png"))
dark2 = Image.new("RGBA", gout.size, (0, 0, 0, 255)); dark2.alpha_composite(gout)
dark2.convert("RGB").save(os.path.join(OUT, "razorgater-grabcut-on-black.png"))
print(f"grabcut done fg_px={int((alpha > 0).sum())}", flush=True)
print("ALL DONE", flush=True)
