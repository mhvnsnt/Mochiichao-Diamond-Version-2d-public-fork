"""Feather audit v2 (read-only): measure alpha ramp at the figure edge of each
shipped title cutout (main versions in /tmp/feather-audit-20261026/).

Why v2: v1 used a 3px interior window and an opaque threshold of 245, which
misclassified the u2netp outputs (their edges ramp over ~5px and their
interior plateaus at 245-254, so the first 3 interior pixels never hit 245).
v2 uses an 11-sample window (3 outside + 8 inside), an opaque threshold of
240 (the u2netp plateau), and skips crossings where the figure touches the
canvas edge (no outside to judge from).

Per crossing (outside -> in), with profile p[0..2] outside, p[3..10] inside:
- skip: any outside index out of bounds, or figure run shorter than 2px.
- soft-design: interior never reaches >= 240 within the window (smoke, halo,
  fire, translucent leaf/crack region) — not a decisive edge, excluded.
- hard: last outside pixel <= 10 and first figure pixel >= 240, no
  intermediate pixel between them (0 -> full in one step).
- feathered: at least one intermediate pixel (11..239) between the last
  <=10 pixel and the first >= 240 pixel (a ramp, not a step).
- ramp width: count of intermediate pixels in that transition span.

Verdict: feather present = YES if feathered crossings are the majority of
decisive (feathered + hard) crossings. Median ramp width is reported
separately: a 1px feather would show median ramp width 1; a wider soft
segmentation edge shows more, and that distinction is reported, not hidden.
"""
import json, os
from PIL import Image
import numpy as np

D = "/tmp/feather-audit-20261026"
CREATURES = [
    ("Mochii", "mochii-walk-cutout.png"),
    ("Razorgater", "razorgater-walk-cutout.png"),
    ("Tyrage", "tyrage-walk-cutout.png"),
    ("Sproutle", "sproutle-walk-cutout.png"),
    ("Dorowani", "dorowani-walk-cutout.png"),
    ("Gabu", "gabu-walk-cutout.png"),
    ("Wispkin", "wispkin-walk-cutout.png"),
    ("Mythar", "mythar-walk-cutout.png"),
    ("Yogiferno", "yogiferno-walk-cutout.png"),
]
OPAQUE = 240

def runs_of(row):
    runs, s = [], None
    for i, v in enumerate(row):
        if v and s is None:
            s = i
        elif not v and s is not None:
            runs.append((s, i - 1)); s = None
    if s is not None:
        runs.append((s, len(row) - 1))
    return runs

def classify_window(outside, inside):
    """outside: 3 alphas (far->near), inside: 8 alphas (edge->in)."""
    if max(inside) < OPAQUE:
        return "soft-design", 0
    # Find first opaque index in inside.
    first_op = next(i for i, v in enumerate(inside) if v >= OPAQUE)
    span = inside[:first_op + 1]  # edge pixel .. first opaque pixel
    inter = [v for v in span if 11 <= v <= 239]
    if outside[-1] <= 10 and not inter and span[0] >= OPAQUE:
        return "hard", 0
    if inter:
        return "feathered", len(inter)
    return "other", 0

results = {}
for name, fn in CREATURES:
    a = np.asarray(Image.open(os.path.join(D, fn)).convert("RGBA"))[:, :, 3].astype(int)
    h, w = a.shape
    mask = a > 10
    counts = {"feathered": 0, "hard": 0, "soft-design": 0, "other": 0, "skipped_edge_touch": 0}
    ramps, examples = [], []

    def handle(outside, inside, tag):
        c, rw = classify_window(outside, inside)
        counts[c] += 1
        if c == "feathered":
            ramps.append(rw)
        if c in ("feathered", "hard") and len(examples) < 5:
            examples.append({"side": tag, "window_outside_to_in": [int(v) for v in outside + inside]})

    for y in range(h):
        for (s, e) in runs_of(mask[y]):
            if e - s < 1:
                continue
            if s >= 3:
                handle([a[y, s - 3], a[y, s - 2], a[y, s - 1]],
                       [a[y, s + i] if s + i < w else 0 for i in range(8)], "row-left")
            else:
                counts["skipped_edge_touch"] += 1
            if e + 3 < w:
                handle([a[y, e + 3], a[y, e + 2], a[y, e + 1]],
                       [a[y, e - i] if e - i >= 0 else 0 for i in range(8)], "row-right")
            else:
                counts["skipped_edge_touch"] += 1
    for x in range(w):
        for (s, e) in runs_of(mask[:, x]):
            if e - s < 1:
                continue
            if s >= 3:
                handle([a[s - 3, x], a[s - 2, x], a[s - 1, x]],
                       [a[s + i, x] if s + i < h else 0 for i in range(8)], "col-top")
            else:
                counts["skipped_edge_touch"] += 1
            if e + 3 < h:
                handle([a[e + 3, x], a[e + 2, x], a[e + 1, x]],
                       [a[e - i, x] if e - i >= 0 else 0 for i in range(8)], "col-bottom")
            else:
                counts["skipped_edge_touch"] += 1
    decisive = counts["feathered"] + counts["hard"]
    frac = counts["feathered"] / decisive if decisive else 0.0
    med = float(np.median(ramps)) if ramps else 0.0
    verdict = "YES" if (decisive and frac >= 0.5) else "NO"
    inter_total = int(((a >= 1) & (a <= 254)).sum())
    results[name] = {
        "file": fn, "size": [w, h], "crossings": counts, "decisive": decisive,
        "feathered_fraction_of_decisive": round(frac, 4),
        "median_ramp_width_px": med,
        "feather_present": verdict,
        "intermediate_alpha_pixels_1_254": inter_total,
        "example_windows": examples,
    }
    print(f"{name}: {w}x{h} {counts} decisive={decisive} "
          f"feathered_frac={frac:.3f} median_ramp={med} -> {verdict} "
          f"intermediate_px={inter_total}")

with open(os.path.join(D, "results.json"), "w") as f:
    json.dump(results, f, indent=2)
print(f"\nTOTAL feathered: {sum(1 for r in results.values() if r['feather_present']=='YES')}/9")
