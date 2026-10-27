#!/usr/bin/env python3
"""Per-creature mouth-shape detection — generalizes the Razorgater take-6 tool.

Mars, 2026-10-26 ~15:29 CDT, take-6 APPROVED PERFECT: Razorgater's mouth
shape is an upside-down triangle (wide top, point at chin), NOT ellipse /
circle. The tool must now START REALIZING what shape a creature's mouth
is, instead of assuming ellipse for every creature.

What this module does, and does NOT do:
  * It measures, per impact cell, the detected jaw (take-5 sensor
    detect_mouth_v5, OpenCV connectedComponents, 64x64 cells) and the
    dark-cavity row profile inside that jaw (top / middle / bottom
    thirds, mean dark pixels per row).
  * It proposes a shape ONLY under strict, stated rules (below). A
    proposal is not a lock. A lock comes from Mars's approval, recorded
    in mouth-shape-registry.json — Razorgater = triangle is the ONLY
    locked shape in this module's registry at ship time.
  * It does NOT lock any other creature's shape from this measurement
    alone. The base-cell row profile is window-capped (seed +-14px, so
    jaw width reads 29px on 21/22 Razorgater cells) and dark-cavity rows
    are sparse on creatures whose mouths are not dark-lined. Any
    creature that fails the strict rules, or whose frames disagree,
    returns "unknown" — never a guessed triangle or ellipse.
  * classify_mask() classifies a DRAWN mouth mask (the overlay itself):
    triangle iff the mask's bottom-third mean width is <= 0.50x its
    top-third mean width and its middle-third mean is 0.30-0.85x top;
    ellipse iff the middle third is the widest and top/bottom are each
    >= 0.60x middle; otherwise unknown. Take-6's triangle mask
    classifies triangle; take-5's ellipse mask classifies ellipse.
    This is how the tool checks its own output shape, not how it
    invents a creature's anatomy.

Triangle proposal rules (per creature, across ALL its impact frames):
  1. detect_mouth_v5 confidence == 'high' on every impact frame used.
  2. Median top-third dark mean >= 10 px/row (a dark-lined jaw is
     actually present; sparse-outline creatures fail here).
  3. Median bottom/top ratio <= 0.70 AND median middle/top <= 0.85
     (the cavity narrows toward the chin, consistently).
  4. Top third is the widest third on a majority of impact frames.
If any rule fails: proposal = "unknown", confidence = "low", and the
caller must NOT draw a triangle for that creature.

Measured evidence, 2026-10-26, v2-rework batch-a impact cells (frame 3):
  Razorgater 4/4 high-confidence; per-frame top/mid/bot dark means
    (thirds of the jaw, this module's _dark_profile):
    physical 10.8 / 7.0 / 5.6, special 13.4 / 6.8 / 9.7,
    signature 14.2 / 8.4 / 9.9, heavy 11.6 / 10.2 / 3.1;
    medians top 12.5, mid 7.7, bot 7.6; bot/top 0.612, mid/top 0.616.
    -> proposal triangle, AND locked triangle by Mars approval.
  Tyrage 4/4 high-confidence but median top dark 6.4 < 10 -> unknown.
  Kittember: bottom third widest (bot/top ~1.1) -> unknown (not ellipse
    by these rules; its mouth is not a measured ellipse either).
  Sproutle / Tiidebiite: low detector confidence on impact cells
    -> unknown.
GPU note (standing workflow, Mars 2026-10-26): this is OpenCV CPU work
on 64x64 cells; a GPU genuinely cannot help this step, stated plainly.
If a step becomes GPU-able (large renders, model inference), route it
to Kaggle GPU first per docs/gpu-workflow.md — do not stall, do not
install Blender locally. No Kaggle run is used or needed here.
"""
import os
import sys

import numpy as np
from PIL import Image

_here = os.path.dirname(os.path.abspath(__file__))
for _p in (_here,
           os.path.expanduser('~/workspace/mochiichao-work/sprite-art/animation/expanded-scope/articulation-pipev3-wide5')):
    if _p not in sys.path:
        sys.path.insert(0, _p)
from mouth_fit_wide5 import detect_mouth_v5  # noqa: E402


def _dark_profile(cell_rgba, jaw):
    a = np.array(cell_rgba.convert('RGBA'))
    rgb = a[:, :, :3].astype(int)
    al = a[:, :, 3]
    lum = rgb.mean(axis=2)
    dark = (al > 0) & (lum < 90)
    x0, x1, y0, y1 = jaw[0], jaw[2], jaw[1], jaw[3]
    widths = [int(dark[y, x0:x1 + 1].sum()) for y in range(y0, y1 + 1)]
    h = len(widths)
    if h == 0:
        return widths, (0.0, 0.0, 0.0)
    third = max(1, h // 3)
    top = float(np.mean(widths[:third]))
    mid = float(np.mean(widths[third:2 * third])) if h >= 3 else float(np.mean(widths))
    bot = float(np.mean(widths[2 * third:]))
    return widths, (top, mid, bot)


def classify_mask(mask):
    """Classify a drawn mask array (0..1 or bool) by row-width profile."""
    m = np.asarray(mask) > 0.05
    widths = [int(row.sum()) for row in m]
    rows = [w for w in widths if w > 0]
    if not rows:
        return {'shape': 'unknown', 'reason': 'empty mask'}
    h = len(widths)
    third = max(1, h // 3)
    # Use only rows that carry the mask, in order, to avoid empty padding.
    nz = [i for i, w in enumerate(widths) if w > 0]
    ys = widths[nz[0]:nz[-1] + 1]
    n = len(ys)
    t = max(1, n // 3)
    top = float(np.mean(ys[:t])); mid = float(np.mean(ys[t:2 * t])) if n >= 3 else top
    bot = float(np.mean(ys[2 * t:]))
    if top > 0 and bot / top <= 0.50 and 0.30 <= mid / top <= 0.85:
        return {'shape': 'triangle', 'top': top, 'mid': mid, 'bot': bot,
                'bot_top': round(bot / top, 3), 'mid_top': round(mid / top, 3)}
    if mid >= top and mid >= bot and top >= 0.60 * mid and bot >= 0.60 * mid:
        return {'shape': 'ellipse', 'top': top, 'mid': mid, 'bot': bot,
                'bot_top': round(bot / top, 3) if top else 0, 'mid_top': round(mid / top, 3) if top else 0}
    return {'shape': 'unknown', 'top': top, 'mid': mid, 'bot': bot,
            'bot_top': round(bot / top, 3) if top else 0, 'mid_top': round(mid / top, 3) if top else 0}


def detect_mouth_shape(cell_rgba, seed_cx, seed_cy):
    """One cell: sensor + dark profile + per-cell taper numbers.

    Returns the sensor dict plus 'profile' (row widths, top/mid/bot)
    and 'taper' (bot/top, mid/top). It does NOT return a locked shape;
    use propose_creature_shape() over all impact frames for that."""
    det = detect_mouth_v5(cell_rgba, seed_cx, seed_cy)
    if det['jaw_bbox'] is None:
        return dict(det, profile=[], top_mid_bot=(0.0, 0.0, 0.0), taper=(0.0, 0.0))
    widths, (top, mid, bot) = _dark_profile(cell_rgba, det['jaw_bbox'])
    return dict(det, profile=widths, top_mid_bot=(round(top, 1), round(mid, 1), round(bot, 1)),
                taper=(round(bot / top, 3) if top else 0.0, round(mid / top, 3) if top else 0.0))


def propose_creature_shape(cell_measurements):
    """Aggregate per-impact-frame measurements into a proposal.

    cell_measurements: list of detect_mouth_shape() dicts, one per
    impact frame. Returns {'proposal', 'confidence', 'evidence'}.
    'triangle' only if ALL strict rules in the module docstring pass.
    Anything else is 'unknown' — the tool refuses to guess."""
    if not cell_measurements:
        return {'proposal': 'unknown', 'confidence': 'low', 'evidence': 'no measurements'}
    if any(m['confidence'] != 'high' for m in cell_measurements):
        return {'proposal': 'unknown', 'confidence': 'low',
                'evidence': 'not all impact frames high-confidence'}
    tops = sorted(m['top_mid_bot'][0] for m in cell_measurements)
    mids = sorted(m['top_mid_bot'][1] for m in cell_measurements)
    bots = sorted(m['top_mid_bot'][2] for m in cell_measurements)
    def med(xs):
        return xs[len(xs) // 2] if len(xs) % 2 else (xs[len(xs) // 2 - 1] + xs[len(xs) // 2]) / 2.0
    top, mid, bot = med(tops), med(mids), med(bots)
    top_widest = sum(1 for m in cell_measurements
                     if m['top_mid_bot'][0] >= m['top_mid_bot'][1] and m['top_mid_bot'][0] >= m['top_mid_bot'][2])
    evidence = {'frames': len(cell_measurements), 'median_top': round(top, 1),
                'median_mid': round(mid, 1), 'median_bot': round(bot, 1),
                'bot_top': round(bot / top, 3) if top else 0.0,
                'mid_top': round(mid / top, 3) if top else 0.0,
                'top_widest_frames': top_widest}
    if top >= 10 and bot / top <= 0.70 and mid / top <= 0.85 and top_widest * 2 >= len(cell_measurements):
        return {'proposal': 'triangle', 'confidence': 'high', 'evidence': evidence}
    return {'proposal': 'unknown', 'confidence': 'low', 'evidence': evidence}
