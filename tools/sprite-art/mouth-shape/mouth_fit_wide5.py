#!/usr/bin/env python3
"""CONTOUR-FIT MOUTH MODULE — PIPELINE V3 (2026-10-26).

Replaces the old retrofit draw_mouth, whose fault Mars identified
2026-10-26 ~10:50 CDT: a flat patch_median RECTANGLE painted under every
mouth (16x10 skin/fur block) that reads as a square crop sitting on the
face instead of fitting it.

V3 rules (binding, see PIPELINE-V3.md):
1. NO rectangles, NO flat median patches, NO square crops anywhere in a
   mouth overlay. Every mouth shape is drawn inside a feathered
   ELLIPTICAL contour mask fitted to the measured true mouth.
2. The "clear" under a new mouth is NOT a flat colour: it is the base
   cell itself Gaussian-blurred, so the cleared area keeps the local
   fur/skin texture and gradient instead of a solid block.
3. The mask edge is feathered (Gaussian blur on the mask alpha), so the
   overlay fades into the surrounding fur instead of ending in a step.
4. The mask is constrained to the base cell's own alpha silhouette
   (exact, IoU 1.0 by construction). GrabCut was tested and REJECTED:
   on the dark-fur Kittember impact cell it reached only IoU 0.428
   against the true silhouette (dark fur on dark background confuses
   it), so it can only make the fit worse.
5. All geometry is in FINAL-frame coordinates (V2): centre =
   propagate(corrected source anchor, frame transform); radii are
   multiplied by that frame's (sx, sy). Ellipses under squash, never
   circles carried through a transform.
6. Teeth are small ellipses clipped by the mask, never white rectangles.

Tools actually used (all present in this environment):
- OpenCV 5.0.0 (atlases/_tools/.venv-opencv): GaussianBlur for the
  feather + the blurred-base clear, connectedComponents for measurement.
- Pillow 13.0.0 + numpy 2.5.4 for compositing.
Rejected: rembg (not installed; would need a model download, and the
cell's own alpha channel already gives the exact silhouette, so a
learned segmenter adds nothing here); scipy (not installed; cv2 covers
the blurs); GrabCut (measured IoU 0.428, rejected, see rule 4).
"""
import math

import cv2
import numpy as np
from PIL import Image, ImageDraw


def propagate(p, t):
    """Same compose math as the batch-a / arefit builders: scale about
    bottom-centre (128,232)@256, translate, rotate about (128,200)@256,
    downscale /4. Input p is a 64px source anchor; output is a 64px
    final-frame position."""
    sx = t.get('sx', 1.0); sy = t.get('sy', 1.0)
    dx = t.get('dx', 0); dy = t.get('dy', 0); rot = t.get('rot', 0)
    X, Y = p[0] * 4, p[1] * 4
    qx = 128 + (X - 128) * sx + dx; qy = 232 + (Y - 256) * sy + dy
    if rot:
        th = math.radians(rot); cx, cy = 128, 200
        rx = cx + (qx - cx) * math.cos(th) + (qy - cy) * math.sin(th)
        ry = cy - (qx - cx) * math.sin(th) + (qy - cy) * math.cos(th)
        qx, qy = rx, ry
    return (qx / 4, qy / 4)


def feathered_ellipse_mask(h, w, cx, cy, rx, ry, feather_sigma=1.0):
    """Float mask 0..1: 1 inside the ellipse, feathered by a Gaussian
    blur so the boundary fades over ~2*sigma px instead of stepping."""
    yy, xx = np.mgrid[0:h, 0:w]
    q = ((xx - cx) / max(rx, 0.5)) ** 2 + ((yy - cy) / max(ry, 0.5)) ** 2
    mask = (q <= 1.0).astype(np.float32)
    if feather_sigma > 0:
        mask = cv2.GaussianBlur(mask, (0, 0), feather_sigma)
    return mask


def contour_fit_mouth(cell_rgba, cx, cy, rx, ry, draw_fn,
                      feather_sigma=1.0, blur_sigma=1.2):
    """Apply one expression mouth to a 64x64 RGBA cell.

    cell_rgba: PIL RGBA image (already transformed base / eyes-only
      frame). cx, cy: final-frame mouth centre. rx, ry: final-frame
      mask radii (already scaled by sx/sy). draw_fn: callable taking
      (ImageDraw, cx, cy, rx, ry) that draws the expression into an
      overlay layer using ellipses/arcs/polylines only — no rectangles.
    Returns (out_pil_rgba, mask, info). The mask is constrained to the
    base silhouette so no overlay pixel can land off the creature.
    """
    base = np.array(cell_rgba.convert('RGBA')).astype(np.float32)
    h, w = base.shape[:2]
    sil = (base[:, :, 3] > 0).astype(np.float32)
    mask = feathered_ellipse_mask(h, w, cx, cy, rx, ry, feather_sigma) * sil
    blurred = cv2.GaussianBlur(base[:, :, :3], (0, 0), blur_sigma)
    # Clear: local blurred base inside the mask (keeps fur texture).
    cleared = base[:, :, :3] * (1.0 - mask[:, :, None]) + blurred * mask[:, :, None]
    # Expression overlay, clipped by the same feathered mask.
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    draw_fn(d, cx, cy, rx, ry)
    ov = np.array(layer).astype(np.float32)
    oa = (ov[:, :, 3] / 255.0) * mask
    out_rgb = cleared * (1.0 - oa[:, :, None]) + ov[:, :, :3] * oa[:, :, None]
    out = np.dstack([out_rgb, base[:, :, 3]]).clip(0, 255)
    out = np.round(out).astype(np.uint8)
    return Image.fromarray(out, 'RGBA'), mask, {'mask_px': float((mask > 0.05).sum())}


# --- Expression drawings: ellipses / arcs / polylines only. ----------
DARK = (25, 15, 15, 255)
INNER = (170, 60, 60, 255)
WHITE = (255, 255, 255, 255)


def draw_open_bite(teeth):
    def fn(d, cx, cy, rx, ry):
        d.ellipse([cx - rx * 0.8, cy - ry * 0.7, cx + rx * 0.8, cy + ry * 0.7], fill=DARK)
        d.ellipse([cx - rx * 0.6, cy - ry * 0.1, cx + rx * 0.6, cy + ry * 0.65], fill=INNER)
        if teeth:
            for fx in (-0.45, 0.0, 0.45):
                d.ellipse([cx + fx * rx - 1.2, cy - ry * 0.7,
                           cx + fx * rx + 1.2, cy - ry * 0.25], fill=WHITE)
    return fn


def draw_grin(d, cx, cy, rx, ry):
    d.arc([cx - rx * 0.85, cy - ry, cx + rx * 0.85, cy + ry], 20, 160, fill=DARK, width=2)


def draw_grimace(d, cx, cy, rx, ry):
    pts = []
    for i in range(9):
        t = i / 8.0
        px = cx - rx * 0.8 + 2 * rx * 0.8 * t
        py = cy + (ry * 0.35 if i % 2 == 0 else -ry * 0.35)
        pts.append((px, py))
    d.line(pts, fill=DARK, width=2, joint='curve')


# --- V3.1 WIDE-OPEN-MOUTH SENSING (Mars-ordered 2026-10-26 ~11:30 CDT) --
# Fault it fixes: V3 queue used FIXED mask radii per expression
# (open-bite 7.0x6.0, grin 6.5x3.5, grimace 6.5x4.0) for every creature.
# Razorgater's true jaw cavity is ~29x20px on the source cell; the fixed
# 14x12 mask landed on the tongue area and read as a tiny mouth.
# A wide open jaw must be measured from the base art, never assumed.
TONGUE_GREY = (208, 208, 210, 255)


def detect_wide_mouth(cell_rgba, ax, ay):
    """V3.1 wide-open-mouth sensing (Mars-ordered 2026-10-26 ~11:30 CDT).

    WHY NOT FULL AUTO-SEGMENTATION (measured, not assumed): at 64px
    on steel-shaded art, closed-contour sensing FAILS three ways
    (all tested on Razorgater's source cell 2026-10-26):
      * flood-fill from the tongue leaks through outline gaps into
        the whole body (flood bbox 49x28 = the creature, not the jaw);
      * dark-outline extremes catch head side edges and arms
        (raw bbox 41x26, width overstated by 12px);
      * bounded interior runs fragment on steel shading (widest run
        in the mouth band is 17px while the visual jaw spans 29px).
    So V3.1 senses the wide-open SIGNATURE automatically and sizes
    the mask from the measured jaw gap, with the candidate bbox
    rendered as a verification zoom for eye-check before any
    application (wide_verified flag in the manifest):
      * lip_line: row in [ay-2, ay+3] with the most dark px in
        [ax-18, ax+18] (the upper-lip line under the snout);
      * teeth_line: row in [lip+4, lip+20] with the most dark px in
        the same band (the teeth / jaw-divider band);
      * jaw-gap height = teeth_line - lip_line;
      * tongue/interior fraction = interior px (lum 95..235,
        chroma < 40) inside [ax-18, ax+18] x [lip, teeth];
      * widest bounded interior run in [lip, teeth].
    Wide verdict thresholds (Razorgater = wide; Kittember, Tiidebiite,
    Gabu, Ashemit, Mythar, Floatcalf, Punchkid, Tyrage, Sproutle =
    not wide — all measured as controls):
      wide <=> 10 <= gap <= 16 AND interior_frac >= 0.30 AND run >= 12.
    The gap cap (<= 16) plus the lip+16 span cap are guards against
    the Mythar false positive (chest band at lip+18).
    Mask sizing when wide (formulas reproduce Razorgater's
    eye-measured jaw bbox x17-46 / y32-52 within 1px):
      half_width = gap * 1.2 (jaws are wider than tall);
      top = lip_line; bottom = teeth_line + gap * 0.7 (lower-jaw drop).
    Returns the full measurement dict either way.
    """
    a = np.array(cell_rgba.convert('RGBA'))
    rgb = a[:, :, :3].astype(int); al = a[:, :, 3]
    lum = rgb.mean(axis=2); chroma = rgb.max(axis=2) - rgb.min(axis=2)
    h, w = lum.shape
    ax, ay = int(ax), int(ay)
    bx0, bx1 = max(0, ax - 18), min(w, ax + 19)
    dark = (al > 0) & (lum < 80)
    interior = (al > 0) & (lum >= 95) & (lum <= 235) & (chroma < 40)
    # Lip line: darkest row near the anchor (search up to 6 rows above
    # it: the documented anchor sits ON the mouth line, but the true
    # lip line can sit a few rows above the anchor on jaw-drop art).
    lip, lip_n = None, -1
    for yy in range(max(0, ay - 6), min(h, ay + 4)):
        n = int(dark[yy, bx0:bx1].sum())
        if n > lip_n:
            lip, lip_n = yy, n
    if lip is None:
        return {'wide': False, 'reason': 'no lip line near anchor'}
    # Teeth/jaw-divider BAND: below the lip line, the jaw divider is a
    # band of elevated dark rows, not one dominant row (Razorgater
    # rows 42-47 all carry >= 10 dark px in the band). Take the
    # longest run of rows in [lip+6, lip+16] with dark count >= 10;
    # teeth_line = the run's centre. The span is CAPPED at lip+16:
    # without the cap the search latches onto non-mouth dark bands
    # further down the body (Mythar false positive: a chest/neck
    # band at lip+18 inflated the gap to 18 and the bbox to the
    # whole torso). Fall back to the darkest single row in the span
    # if no such run exists.
    teeth = None
    best_run = None  # (length, start, end)
    run_start = None
    for yy in range(min(h, lip + 6), min(h, lip + 17)):
        n = int(dark[yy, bx0:bx1].sum())
        if n >= 10:
            if run_start is None:
                run_start = yy
        else:
            if run_start is not None:
                if best_run is None or yy - run_start > best_run[0]:
                    best_run = (yy - run_start, run_start, yy - 1)
                run_start = None
    if run_start is not None:
        if best_run is None or (min(h, lip + 16) - run_start) > best_run[0]:
            best_run = (min(h, lip + 16) - run_start, run_start,
                        min(h, lip + 16) - 1)
    if best_run is not None:
        teeth = (best_run[1] + best_run[2]) / 2.0
    else:
        teeth, teeth_n = None, -1
        for yy in range(min(h, lip + 6), min(h, lip + 17)):
            n = int(dark[yy, bx0:bx1].sum())
            if n > teeth_n:
                teeth, teeth_n = float(yy), n
    if teeth is None:
        return {'wide': False, 'reason': 'no teeth band below lip'}
    gap = teeth - lip
    teeth_i = int(round(teeth))
    box = interior[lip:teeth_i + 1, bx0:bx1]
    frac = float(box.sum()) / float(max(1, box.size))
    # Widest bounded interior run in the lip..teeth span.
    best_run = 0
    for yy in range(lip, teeth_i + 1):
        run = 0
        for xx in range(bx0, bx1):
            if interior[yy, xx] and not dark[yy, xx]:
                run += 1
                best_run = max(best_run, run)
            else:
                run = 0
    wide = 10 <= gap <= 16 and frac >= 0.30 and best_run >= 12
    half_w = gap * 1.2
    top = lip
    bottom = teeth + gap * 0.7
    cx = float(ax)
    cy = (top + bottom) / 2.0
    return {'wide': wide, 'lip_line': lip, 'teeth_line': teeth,
            'gap': gap, 'interior_frac': round(frac, 3),
            'widest_run': best_run,
            'bbox': [round(cx - half_w, 1), top,
                     round(2 * half_w, 1), round(bottom - top, 1)],
            'centre': (cx, round(cy, 1)),
            'radii': (round(half_w, 1), round((bottom - top) / 2.0, 1))}


# --- TAKE 5 AUTOMATIC MOUTH SENSING (Mars-ordered 2026-10-26 ~14:56 CDT) --
# Fault it fixes: take-4 placed its mask from ONE fixed source centre
# (32.0, 42.6) propagated by transform, with radii (15.0, 10.6).
# Re-measured on the actual v2 impact cells, that centre is off by up
# to 2.6px (special: propagated y 36.6 vs detected centre y 34.0) and
# its height (21.2px) overshoots the detected jaw height (17px) while
# its tongue sat on the tongue only — so in the GIF, on the dark
# flatten background, the dark cavity vanished and only the pale
# tongue read. The V3.1 detector does NOT reproduce its own docstring
# on the current source cell (gap 8.5, wide=False, vs claimed 12.5),
# and per-frame it fires false wides on non-impact frames, so it is
# NOT reused as the take-5 sensor.
# Take-5 sensor (OpenCV connectedComponents + numpy, same venv stack
# as V3: atlases/_tools/.venv-opencv, cv2 5.0.0, Pillow, numpy):
#   seed = the pipeline's own per-frame mouth position (v2 manifest
#   prop_mouth_held_v3 for impact frames, propagated source centre
#   otherwise) — a seed, NOT the answer;
#   window = seed +-14px x, +-12px y;
#   lip_line = row in the window with the most dark px (lum < 90);
#   tongue = largest pale connected component (lum 170..245,
#   chroma < 60) in the window below the lip line, >= 8px;
#   jaw_bbox = bbox of dark|mid|pale pixels in the window from the
#   lip line down 17 rows, clipped to the cell silhouette;
#   gap = jaw height; centre/size = jaw_bbox centre/size.
# Measured on all 4 v2 impact cells, this gives jaw 29x17 every time
# (physical x27-55/y34-50, special x12-40/y26-42, signature
# x13-41/y29-45, heavy x22-50/y35-51) — width matches the old
# eye-measured 29px jaw, height 17px is the true jaw, not 21px.
# If the jaw bbox is < 12px wide or < 6px tall, the sensor reports
# low confidence and the builder falls back to the take-4 mask and
# flags it; it never silently invents a mouth.
RIM = (190, 200, 210, 255)


def detect_mouth_v5(cell_rgba, seed_cx, seed_cy):
    """Automatic mouth sensing for one 64x64 cell. Returns a dict with
    lip_line, tongue bbox (or None), jaw_bbox, jaw_w, jaw_h, gap,
    centre, and confidence ('high' if jaw 12+ x 6+ px and a tongue was
    found, else 'low'). No fixed jaw coordinates are used."""
    a = np.array(cell_rgba.convert('RGBA'))
    rgb = a[:, :, :3].astype(int); al = a[:, :, 3]
    lum = rgb.mean(axis=2); chroma = rgb.max(axis=2) - rgb.min(axis=2)
    sil = al > 0
    dark = sil & (lum < 90)
    pale = sil & (lum >= 170) & (lum <= 245) & (chroma < 60)
    mid = sil & (lum >= 90) & (lum < 170) & (chroma < 60)
    cx, cy = float(seed_cx), float(seed_cy)
    x0, x1 = max(0, int(cx - 14)), min(64, int(cx + 15))
    y0, y1 = max(0, int(cy - 12)), min(64, int(cy + 13))
    rows = [(int(dark[y, x0:x1].sum()), y) for y in range(y0, y1)]
    lip = max(rows)[1] if rows else int(cy)
    sub = pale[lip:y1, x0:x1].astype('uint8')
    n, lab, stats, cents = cv2.connectedComponentsWithStats(sub, 8)
    tongue = None
    for i in range(1, n):
        if stats[i, 4] >= 8 and (tongue is None or stats[i, 4] > tongue[0]):
            tongue = [int(stats[i, 4]), int(stats[i, 0] + x0),
                      int(stats[i, 1] + lip), int(stats[i, 2]),
                      int(stats[i, 3])]
    both = dark | mid | pale
    ys, xs = np.where(both[lip:min(64, lip + 17), x0:x1])
    if len(xs):
        jaw = [int(xs.min() + x0), int(ys.min() + lip),
               int(xs.max() + x0), int(ys.max() + lip)]
        jaw_w, jaw_h = jaw[2] - jaw[0] + 1, jaw[3] - jaw[1] + 1
    else:
        jaw, jaw_w, jaw_h = None, 0, 0
    conf = 'high' if (jaw_w >= 12 and jaw_h >= 6 and tongue) else 'low'
    centre = ((jaw[0] + jaw[2]) / 2.0, (jaw[1] + jaw[3]) / 2.0) if jaw else (cx, cy)
    return {'seed': (round(cx, 1), round(cy, 1)), 'lip_line': int(lip),
            'tongue': tongue, 'jaw_bbox': jaw, 'jaw_w': int(jaw_w),
            'jaw_h': int(jaw_h), 'gap': int(jaw_h), 'centre': centre,
            'confidence': conf}


def draw_wide_jaw_v5(d, cx, cy, rx, ry):
    """Take-5 wide jaw: same ellipse shape language as take-4, but
    (a) centred on the DETECTED jaw centre, (b) radii = detected jaw
    half-size x 1.20 (scaled UP ~20% vs the detected jaw; vs take-4
    radii 15.0x10.6, width is +16% at 17.4, height is the detected
    8.5 x 1.20 = 10.2, so the mask no longer overshoots the jaw
    vertically), (c) tongue spans the FULL jaw, not the tongue only:
    95% of mask width (vs take-4 87-90%) and from 20% down the jaw to
    95% down (vs take-4 35%-to-chin, 62% tall) — taller and centred,
    (d) teeth slightly larger (0.9px half-width triangles), and
    (e) a 1px light-steel RIM around the cavity so the WHOLE jaw
    reads on the dark GIF flatten background, where take-4's dark
    cavity alone vanished and only the tongue showed."""
    d.ellipse([cx - rx * 0.98, cy - ry * 0.98,
               cx + rx * 0.98, cy + ry * 0.98], outline=RIM, width=1)
    d.ellipse([cx - rx * 0.92, cy - ry * 0.85,
               cx + rx * 0.92, cy + ry * 0.85], fill=DARK)
    d.ellipse([cx - rx * 0.95, cy - ry * 0.20,
               cx + rx * 0.95, cy + ry * 0.95], fill=TONGUE_GREY)
    tw = 0.9
    for fx in (-0.62, -0.31, 0.0, 0.31, 0.62):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy - ry * 0.85), (tx + tw, cy - ry * 0.85),
                   (tx, cy - ry * 0.50)], fill=WHITE)
    for fx in (-0.45, 0.0, 0.45):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy + ry * 0.95), (tx + tw, cy + ry * 0.95),
                   (tx, cy + ry * 0.55)], fill=WHITE)


def draw_wide_jaw(d, cx, cy, rx, ry):
    """Wide open dinosaur/alligator jaw, TAKE 4 (Mars rejected take 1 for
    trail + sizing, take 2 rectangle + take 3 wedge both read as pasted
    boxes at 64px). Take 1's ellipse was the right shape language ("closer
    to the right shape") — its measured fault was ONLY the tongue: 18.6px
    wide (64% of the 29px jaw) x 8.5px tall (43% of the 20px jaw), parked at
    the jaw bottom, while the base art's pale interior spans the full jaw.
    Fix, measured in source coordinates: tongue 26.1px wide (90% of jaw) x
    12.4px tall (62% of jaw), spanning from 35% down the jaw to the chin.
    Teeth shrunk from 2.2px pills to small embedded triangles, like the
    base art's own small teeth. Cavity ellipse unchanged (it fit the true
    jaw within ~2px on all 4 impact frames)."""
    d.ellipse([cx - rx * 0.92, cy - ry * 0.85,
               cx + rx * 0.92, cy + ry * 0.85], fill=DARK)
    d.ellipse([cx - rx * 0.87, cy - ry * 0.30,
               cx + rx * 0.87, cy + ry * 0.87], fill=TONGUE_GREY)
    tw = 0.6
    for fx in (-0.62, -0.31, 0.0, 0.31, 0.62):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy - ry * 0.85), (tx + tw, cy - ry * 0.85),
                   (tx, cy - ry * 0.50)], fill=WHITE)
    for fx in (-0.45, 0.0, 0.45):
        tx = cx + fx * rx
        d.polygon([(tx - tw, cy + ry * 0.85), (tx + tw, cy + ry * 0.85),
                   (tx, cy + ry * 0.50)], fill=WHITE)
