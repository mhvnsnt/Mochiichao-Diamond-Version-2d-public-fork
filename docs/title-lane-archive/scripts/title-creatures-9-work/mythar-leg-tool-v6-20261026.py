#!/usr/bin/env python3
"""Mythar leg-tool v6 (staged only) — WINNER: MI-GAN ONNX inpainting pipeline.

Tool comparison (measured on the actual leg masks, 434x350 figure, CPU):
- OpenCV Telea r3/r5 (Apache-2.0, cv2 5.0.0): smooth pale fill; erases the
  legs' own dark outline strokes (they are partial-alpha pixels, so they fall
  inside the weak mask); leg luminance 186-197 vs v5 166-170, texture std
  37-41 vs v5 77. Legs read WASHED OUT, anatomy lost. REJECTED.
- OpenCV NS r3/r5: same failure, slightly smoother; lum 186-196, std 41-43. REJECTED.
- scikit-image inpaint_biharmonic (BSD-3, pip-installed into rembg venv):
  closest classical result (lum 172/180, std 47) but still erases strokes and
  pales the legs. REJECTED.
- OpenCV distance-transform nearest-strong-pixel fill: darker (lum 148/155)
  but faceted Voronoi bands, fine lines partly lost. REJECTED.
- LaMa / Lama Cleaner (Apache-2.0, ~208MB weights, generative, GPU-preferred):
  NOT RUN — evaluated from sources: large-mask specialist, generative
  hallucination risk for a character's anatomy, 200MB+ torch stack, GPU
  preferred; overkill for 2.3k masked pixels and riskier than a 28MB mobile
  model on the no-invented-anatomy rule. REJECTED on evidence, not familiarity.
- MI-GAN ONNX pipeline (MIT, Picsart AI Research ICCV 2023, 28MB, CPU via
  onnxruntime 1.31.0 already in rembg venv): WINNER. Leg luminance 167.7/177.0
  (closest to v5 166.5/169.9), texture std 66.6/59.3 (closest to v5 77),
  and — decisively on the visual comparison — it RECONSTRUCTS the legs' dark
  outline strokes inside the mask instead of smoothing them away, so the legs
  read FULL and SOLID with anatomy intact. Output is composited STRICTLY to
  the leg mask; everything outside the mask is v3, so no hallucinated
  anatomy can leak elsewhere. Silhouette = shipped leg shapes exactly.

Method: base = mythar-white-removed-v3-20261026.png (v4 discarded, never a
base). Leg shapes = shipped alpha>0 pixels inside the binding boxes
LEFT x149-178 y280-349, RIGHT x247-278 y290-349 (tail, gold ring/V, wing
fragments excluded). Mask = leg-shape pixels with v3 alpha<255 + enclosed
holes inside the boxes (v5 method). MI-GAN input: v3 RGB + mask (255=known,
0=masked), NCHW uint8. Output composited: masked pixels <- MI-GAN RGB,
alpha 255; unmasked shape pixels keep own RGB, alpha 255 (solidify).
Guardrails verified on reload: wing/ring gap pixels (v3 removed set, 1871 px)
0 changed; changed pixels all inside leg shapes; rest byte-identical to v3.
CPU-only: MI-GAN ONNX runs on CPU here in ~8s; a GPU genuinely cannot help
this step beyond speed, and no Kaggle run was needed.
"""
from PIL import Image
import numpy as np, json
import onnxruntime as ort
from scipy import ndimage

W = '/home/hatch/workspace/mochiichao-work/title-creatures-9/work/'
SHIP = '/home/hatch/workspace/mochiichao-work/title-creatures-9/repo/src/assets/title/mythar-walk-cutout.png'
ship = np.array(Image.open(SHIP).convert('RGBA')).astype(int)
v3 = np.array(Image.open(W + 'mythar-white-removed-v3-20261026.png').convert('RGBA')).astype(int)
assert ship.shape == v3.shape == (350, 434, 4)
LEGS = {'LEFT': (149, 178, 280, 349), 'RIGHT': (247, 278, 290, 349)}
mask = np.full((350, 434), 255, dtype=np.uint8)
shapes = {}
for name, (x0, x1, y0, y1) in LEGS.items():
    sl = (slice(y0, y1 + 1), slice(x0, x1 + 1))
    shape = ship[sl][:, :, 3] > 0
    transp = ~(v3[sl][:, :, 3] > 0)
    seed = np.zeros_like(transp)
    seed[0, :] = transp[0, :]; seed[-1, :] = transp[-1, :]
    seed[:, 0] = transp[:, 0]; seed[:, -1] = transp[:, -1]
    holes = transp & ~ndimage.binary_propagation(seed, mask=transp)
    m = (shape & (v3[sl][:, :, 3] < 255)) | holes
    mask[y0:y1 + 1, x0:x1 + 1][m] = 0
    shapes[name] = (sl, shape, m, holes)
sess = ort.InferenceSession(W + 'migan_pipeline_v2.onnx', providers=['CPUExecutionProvider'])
img = np.transpose(v3[:, :, :3].astype(np.uint8), (2, 0, 1))[None]
out = np.array(sess.run(None, {sess.get_inputs()[0].name: img,
                                sess.get_inputs()[1].name: mask[None, None]})[0])[0]
out = np.transpose(out, (1, 2, 0)).astype(np.uint8)
v6 = v3.copy()
for name, (sl, shape, m, holes) in shapes.items():
    sub = v6[sl]
    sub[m, :3] = out[sl][m]; sub[m, 3] = 255
    keep = shape & ~m; sub[keep, 3] = 255
    v6[sl] = sub
Image.fromarray(v6.astype(np.uint8)).save(W + 'mythar-leg-tool-v6-20261026.png')
# ---- verification on reload ----
v6r = np.array(Image.open(W + 'mythar-leg-tool-v6-20261026.png').convert('RGBA')).astype(int)
sa, v3a = ship[:, :, 3] > 0, v3[:, :, 3] > 0
removed = sa & ~v3a
diff = np.any(v6r != v3, axis=2)
report = {'legs': {}, 'guardrails': {}}
for name, (x0, x1, y0, y1) in LEGS.items():
    sl, shape, m, holes = shapes[name]
    px = v6r[sl][shape][:, :3].astype(float)
    lum = px.mean(axis=1); mx = px.max(axis=1); mn = px.min(axis=1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    report['legs'][name] = {
        'bbox': [x0, x1, y0, y1], 'shape_px': int(shape.sum()),
        'masked_fill_px': int(m.sum()), 'hole_px': int(holes.sum()),
        'changed_px_in_shape': int(diff[sl][shape].sum()),
        'lum_mean': round(float(lum.mean()), 1), 'lum_std': round(float(lum.std()), 1),
        'sat_mean': round(float(sat.mean()), 3),
        'sampled_leg_median_rgb': [round(float(v), 1) for v in np.median(ship[sl][shape][:, :3], axis=0)],
    }
leg_union = np.zeros((350, 434), dtype=bool)
for (sl, shape, m, holes) in shapes.values():
    leg_union[sl] |= shape
report['guardrails'] = {
    'changed_outside_leg_shapes': int((diff & ~leg_union).sum()),
    'removed_set_changed': int((diff & removed).sum()),
    'total_changed_vs_v3': int(diff.sum()),
    'v6_opaque_total': int((v6r[:, :, 3] == 255).sum()),
    'v3_opaque_total': int((v3[:, :, 3] == 255).sum()),
}
json.dump(report, open(W + 'mythar-leg-tool-v6-20261026.json', 'w'), indent=1)
print(json.dumps(report, indent=1))
