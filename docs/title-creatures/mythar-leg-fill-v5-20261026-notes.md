# Mythar leg-only fill v5 — notes (staged only, show-first)

## Why v5 exists
Mars REJECTED v4 (2026-10-26 ~17:55 CDT): v4 filled the WRONG gaps — the white
spots around the wings and in the light-ring circle that he took so long to
get removed. Corrected order: GO BACK TO V3, fill HIS LEGS ONLY — not between
the wings, not the circle of light. V4 is discarded (never shipped, main
untouched). v5 is built from v3, NOT from v4.

## 1. Where the legs are (located before anything was filled)
Identification method, measured from the shipped image (434x350), not guessed:
- The two front legs hang beneath the body and separate from the body mass
  in the shipped opaque-mask row runs: the left leg run separates at y~280
  (y280 run x154-175, distinct from the body run x186-273); the right leg
  run separates at y~290 (y290 runs x158-175 / x188-245 / x249-269).
- LEFT LEG bbox: x149-178, y280-349 (shaft + paw, viewer-left).
- RIGHT LEG bbox: x247-278, y290-349 (shaft + paw, viewer-right).
- NOT legs, explicitly excluded: the central tail (x~185-245, y~275-325),
  the gold ring / gold V (centre bottom), the wing fragments, and two small
  pale fragments at the very bottom centre (x183-192 and x234-243, y338-349,
  median RGB ~237-240 — not front legs, left untouched).
- Leg shape = shipped alpha>0 pixels inside each tight bbox, plus enclosed
  transparent holes inside the bbox. No gold-ish pixels fall inside either
  leg shape (0 measured).

## 2. Why the legs read as barely visible (measured, not guessed)
Inside the leg shapes, the shipped file itself is mostly SEMI-TRANSPARENT
(u2netp mask): LEFT 1220/1491 px partial alpha (82%), RIGHT 1066/1334 px
(80%). That is why the legs render faint/drained on black and dark ground.
v3 removed NOTHING inside the separated leg shapes (0 px; all 1871 v3
removals sit at y207-253). The 149 removed pixels that overlap the leg
COLUMNS at y230-255 belong to the flank-pocket components, not to legs, and
were deliberately NOT restored — restoring them would refill the wing/flank
gaps Mars ordered to stay removed.

## 3. What v5 changes (leg shapes only)
(a) Restore: leg-shape pixels opaque in shipped but transparent in v3, set
    to exact shipped RGBA. Measured: 0 px in both legs (v3 lacked no
    leg-shape pixels). Implemented anyway; the count is honestly 0.
(b) Solidify: leg-shape pixels with 0 < alpha < 255 set to alpha 255, each
    pixel keeping its OWN RGB (no hue invented, no recolour). LEFT 1220 px,
    RIGHT 1066 px.
(c) Holes: enclosed transparent pixels inside the leg bboxes (flood-fill
    from the box border cannot reach them) filled by iterative neighbour-mean
    diffusion from adjacent leg pixels, alpha 255. LEFT 12 px (x167-169,
    y341-348, near the left paw; fill mean RGB ~246.8/243.1/236.3), RIGHT
    15 px (x255-260, y338-347, near the right paw; fill mean RGB
    ~252.5/246.3/237.1).
Total changed vs v3: 2313 px (LEFT 1232, RIGHT 1081). Non-hole changed
pixels are RGB-identical to v3 (alpha only); 25 of 27 hole pixels also
changed stored RGB (the other 2 matched the stored RGB already).
Sampled leg colours (shipped leg pixels in each box): LEFT pale-leg median
RGB (224, 219, 210), 957 pale px; RIGHT pale-leg median (222, 221, 218),
862 pale px — pearlescent pale lavender-grey, sampled from the legs
themselves, no invented hue.
Opaque counts: v3 83601 -> v5 83628 (+27 holes only; solidified pixels
were already alpha>0). Leg boxes in v5: LEFT partial-alpha 0, opaque 1503;
RIGHT partial-alpha 0, opaque 1349. Legs are now fully opaque.

## 4. Guardrails, verified on reload (not just from the build log)
- Changed pixels outside leg shapes: 0.
- v3 removed set (wing/flank/ring gaps, 1871 px) changed: 0 — wing gaps and
  light-ring circle gaps are pixel-identical to v3 and STAY OPEN.
- Gold pixels changed: 0.
- Everything else byte-identical to v3.
- v5 file: 434x350 RGBA, md5 8bdc23fcfdbf530740579d10e38a8686.
- v3 file untouched; v4 file untouched (discarded record only).

## 5. Status
STAGED ONLY. No repo edit, no PR, no ship, no deletion. Ship + old-file
deletion happen ONLY after Mars confirms v5 in words. CPU-only step
(434x350 PNG work — a GPU genuinely cannot help this step, stated plainly).
Build script: mythar-leg-fill-v5-20261026.py; counts JSON:
mythar-leg-fill-v5-20261026.json.
