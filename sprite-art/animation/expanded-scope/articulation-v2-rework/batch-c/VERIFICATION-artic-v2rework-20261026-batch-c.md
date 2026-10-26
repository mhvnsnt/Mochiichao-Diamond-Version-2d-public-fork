# VERIFICATION — BATCH C V2 REWORK, EYES ONLY, MOUTHS HELD FOR V3 (2026-10-26)

Tag artic-v2rework-20261026. Builder: build_v2rework_c.py. Manifest: manifest-artic-v2rework-20261026.json.
Method: articulation/PIPELINE-V2.md (binding) — corrected anchors from TRUE feature pixels on enlarged source front cells,
overlay drawn AFTER the cell transform in final-frame coordinates, every dimension x (sx,sy) (ellipses under squash),
NO clear-box rectangles anywhere, size caps from measured true features, gates ON the final frame.
Staged only under articulation-v2-rework/batch-c/. NO PR, show-first. Batch C originals, Batch B, pilots, hurts untouched.

## MOUTH HOLD (Mars, 2026-10-26 ~10:50 CDT — binding on this staging)

Mouth-overlay finalization is HELD until the V3 contour-fit module + PIPELINE-V3.md land (Kittember + Tiidebiite attacks
are the V3 proof cases). This staging draws NO mouth on any frame — no rectangle, no ellipse, no arc, no line.
The GIFs below are therefore EYES-ONLY and INTERIM, not final attacks: eye expression only, base mouths unchanged.
When V3 lands, mouths are added to these exact frames and reported vs these V2 eye-only versions (per the hold task).
Mouths affected (5 creatures with a measurable mouth in v1; 3 eye-only creatures have no mouth to hold):
- mythar (old mouth anchor (32,27), held, not redrawn), ashemit (old (32,26), held, unverified — NOT reused),
  dorowani (old (31,24), held), floatcalf (old (32,28), held), gabu (old (32,29), held).
- krakenox, pebblefist, inklet: no measurable front mouth in v1 either — eye-only stands, V3 n/a unless V3 re-measures one.
Teeth: NONE drawn on any Batch C creature in this staging. mythar/pebblefist teeth were ambiguous in v1 and stay none;
enlarged measurement proved no clear teeth for gabu either (small white marks at mouth top, ambiguous) — kept none.
Gabu's open pink mouth itself is visible in base art; it is simply not overlaid until V3.

## Results: 32/32 impact frames overlaid eyes-only (8 creatures x 4 attack sets, Mode A frame 3 only)

Per creature: 22 attack cells (physical 5 + special 5 + signature 6 + heavy 6), 4 overlaid, 18/18 non-impact cells
pixel-identical to base (verified by pixel diff, not by filename). Hurts: NOT copied, NOT overlaid, untouched.
Eye states: physical/signature/heavy = widened, special = glance (Batch C correction: heavy is NOT half-lidded).
Post-gate (every changed px within 2px of base silhouette): PASS on all 32. Pre-gate (true-feature px within +/-3px
of each propagated corrected anchor, blended predicates): PASS on all 32 (counts in manifest per frame).

## Corrected anchor table (64px source coords) — OLD = build_artic_c.py, NEW = re-measured 2026-10-26

| Creature | Old eyes | New eyes | Change | True-feature evidence | eye_r |
|---|---|---|---|---|---|
| krakenox | (32,29) | (32.1,29.9) | (+0.1,+0.9) | Red core bbox 31-33,29-31, centroid (32.14,29.86) | 1.5 |
| mythar | (28,22), (35,22) | (28.5,22.0), (33.5,22.0) | (+0.5,+0), (-1.5,+0) | Grey eye clusters (28.5,22.0),(33.5,22.0), 2px each | 1.0 |
| pebblefist | (24,31), (40,31) | (23.0,31.2), (40.0,31.2) | (-1,+0.2), (+0,+0.2) | Bright-yellow cores (23.0,31.2),(40.0,31.2); side lava x14/x49 excluded | 1.5 |
| ashemit | (28,20), (37,19) | (21.0,19.5), (30.5,19.5) | (-7,-0.5), (-6.5,+0.5) | Brown eye ovals (21.0,19.5),(30.5,19.5); old L sat between eyes, old R sat on ear/orange fur | 1.5 |
| dorowani | (26,18), (33,18) | (25.0,18.0), (33.0,18.0) | (-1,+0), (+0,+0) | Pure dark-red cores (25,18),(33,18); red side fins x20-22/x37-42 excluded | 1.0 |
| floatcalf | (23,25), (41,25) | (21.0,24.0), (42.0,24.0) | (-2,-1), (+1,-1) | Black discs + white dots (21,24),(42,24); white dots (21,22),(42,22), disc rows 24-26 | 2.0 |
| gabu | (27,23), (37,23) | (26.75,22.0), (36.25,22.0) | (-0.25,-1), (-0.75,-1) | Yellow cores (26.75,22.0),(36.25,22.0) | 1.5 |
| inklet | (26,43), (36,43) | (26.0,44.0), (36.0,44.0) | (+0,+1), (+0,+1) | Black ovals + white dots (26,44),(36,44); white dots (26,42),(36,42), oval rows 43-46 | 1.5 |

Largest correction: ASHEMIT — L (-7,-0.5), R (-6.5,+0.5). This is the Aquariios-class failure in Batch C: the old
anchors passed the old opaque-count gate (121/98) because the 11x11 window sat on opaque face/ear pixels, not on eyes.
The V2 feature gate + enlarged eye-check triplet prove the new anchors: the V2 panel puts brown eyes exactly on the
true brown eyes, while the OLD panel shows giant brown discs + a mouth block over the nose/ear. All other creatures
shifted <=2px per eye (floatcalf L -2x, inklet +1y, mythar R -1.5x, dorowani L -1x, pebblefist L -1x, gabu -1y, krakenox +0.9y).
Old fixed radius 5 for every creature is replaced by measured caps: eye_r 1.0-2.0 above, widened <= 2x true radius (scaled).

## Per-frame gates (pre-gate feature counts +/-3px, post-gate inside-silhouette, diff bbox x/y in final 64px frame)

| Creature | Set | sx/sy | Propagated eyes | Feature counts | Diff bbox (xmin,xmax,ymin,ymax,npx) | Post-gate | Action |
|---|---|---|---|---|---|---|---|
| krakenox | atk_physical_tentacle_lash | 1.25/0.75 | (41.6,32.4) | [11] | [38, 46, 30, 34, 33] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| krakenox | atk_special_ink_jet | 0.95/1.0 | (26.1,23.9) | [10] | [26, 28, 22, 26, 11] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| krakenox | atk_signature_abyss_surge | 1.15/0.9 | (27.1,27.3) | [11] | [24, 30, 24, 30, 37] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| krakenox | atk_heavy_kraken_crash_finisher | 1.3/0.72 | (36.1,33.4) | [8] | [32, 40, 31, 35, 33] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| mythar | atk_physical_star_pounce | 1.25/0.75 | (37.1,26.5), (43.4,26.5) | [10, 9] | [35, 45, 24, 28, 42] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| mythar | atk_special_star_shot | 0.95/1.0 | (22.7,16.0), (27.4,16.0) | [9, 6] | [23, 29, 14, 17, 16] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| mythar | atk_signature_orbit_barrage | 1.15/0.9 | (23.0,20.2), (28.7,20.2) | [11, 9] | [21, 31, 18, 22, 42] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| mythar | atk_heavy_nova_crash_finisher | 1.3/0.72 | (31.4,27.8), (38.0,27.8) | [16, 12] | [28, 41, 27, 29, 34] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| pebblefist | atk_physical_rock_punch | 1.25/0.75 | (30.2,33.4), (51.5,33.4) | [6, 20] | [26, 56, 31, 35, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| pebblefist | atk_special_pebble_shot | 0.95/1.0 | (17.5,25.2), (33.6,25.2) | [6, 6] | [17, 36, 23, 27, 22] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| pebblefist | atk_signature_boulder_barrage | 1.15/0.9 | (16.6,28.5), (36.2,28.5) | [6, 8] | [14, 39, 25, 31, 74] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| pebblefist | atk_heavy_avalanche_finisher | 1.3/0.72 | (24.3,34.4), (46.4,34.4) | [5, 13] | [20, 50, 32, 36, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| ashemit | atk_physical_ash_charge | 1.25/0.75 | (27.8,24.6), (39.6,24.6) | [16, 14] | [24, 44, 23, 27, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| ashemit | atk_special_ember_spray | 0.95/1.0 | (15.6,13.5), (24.6,13.5) | [16, 18] | [16, 27, 12, 16, 22] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| ashemit | atk_signature_flame_tail_sweep | 1.15/0.9 | (14.4,17.9), (25.3,17.9) | [16, 15] | [11, 28, 15, 21, 74] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| ashemit | atk_heavy_inferno_crash_finisher | 1.3/0.72 | (21.7,26.0), (34.0,26.0) | [14, 13] | [18, 38, 24, 28, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| dorowani | atk_physical_glide_ram | 1.25/0.75 | (32.8,23.5), (42.8,23.5) | [2, 4] | [31, 45, 22, 26, 42] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| dorowani | atk_special_spray_jet | 0.95/1.0 | (19.4,12.0), (27.0,12.0) | [11, 4] | [19, 29, 11, 13, 10] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| dorowani | atk_signature_wave_barrage | 1.15/0.9 | (19.0,16.6), (28.1,16.6) | [6, 2] | [17, 30, 15, 19, 42] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| dorowani | atk_heavy_deluge_finisher | 1.3/0.72 | (26.9,24.9), (37.3,24.9) | [5, 3] | [24, 40, 24, 26, 34] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| floatcalf | atk_physical_float_ram | 1.25/0.75 | (27.8,28.0), (54.0,28.0) | [20, 22] | [23, 59, 25, 31, 122] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| floatcalf | atk_special_prism_shot | 0.95/1.0 | (15.6,18.0), (35.5,18.0) | [19, 18] | [15, 39, 16, 20, 42] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| floatcalf | atk_signature_sky_barrage | 1.15/0.9 | (14.4,22.0), (38.5,22.0) | [20, 20] | [9, 43, 18, 26, 150] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| floatcalf | atk_heavy_cloud_crash_finisher | 1.3/0.72 | (21.7,29.2), (49.0,29.2) | [20, 21] | [17, 54, 26, 32, 122] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| gabu | atk_physical_forest_lunge | 1.25/0.75 | (34.9,26.5), (46.8,26.5) | [4, 4] | [31, 51, 24, 28, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| gabu | atk_special_leaf_shot | 0.95/1.0 | (21.0,16.0), (30.0,16.0) | [5, 5] | [21, 32, 14, 18, 22] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| gabu | atk_signature_canopy_burst | 1.15/0.9 | (21.0,20.2), (31.9,20.2) | [5, 5] | [18, 35, 17, 23, 74] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| gabu | atk_heavy_timber_finisher | 1.3/0.72 | (29.2,27.8), (41.5,27.8) | [6, 6] | [25, 46, 26, 30, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| inklet | atk_physical_ink_lash | 1.25/0.75 | (34.0,43.0), (46.5,43.0) | [5, 1] | [30, 50, 41, 45, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| inklet | atk_special_ink_shot | 0.95/1.0 | (20.3,38.0), (29.8,38.0) | [4, 4] | [20, 32, 36, 40, 22] | True | overlay-v2-eyes-only-glance-mouth-HELD |
| inklet | atk_signature_abyss_barrage | 1.15/0.9 | (20.1,40.0), (31.6,40.0) | [6, 7] | [17, 35, 37, 43, 74] | True | overlay-v2-eyes-only-widened-mouth-HELD |
| inklet | atk_heavy_ink_crash_finisher | 1.3/0.72 | (28.2,43.6), (41.2,43.6) | [4, 5] | [24, 45, 42, 46, 66] | True | overlay-v2-eyes-only-widened-mouth-HELD |

## Eye-check (enlarged base / OLD-held / V2 triplets, 4 per creature, 32 total)

Files: <creature>_<set>_base_old_v2.png in each creature dir (left base, middle OLD-held, right V2 eyes-only).
Eye-checked (physical triplets for all 8 + floatcalf signature, enlarged, read directly): PASS on all 8 — V2 eyes sit
on the true eyes in every panel, no block, squash respected (ellipses under sy<1; e.g. heavy sy=0.72 discs flatten).
Mars-judgement items (not defects): widened eyes read larger than base cores by design (<=2x true radius, scaled);
floatcalf widened discs are the largest (eye_r 2.0, true disc ~5px) — same V2 widened-expression rule as pipev2.
OLD panels are shown only to prove the correction; they are held, not shippable, and were not overwritten.

## GIFs (pilot timings verbatim + 250ms after each set's last frame, 22 frames each, 256px)

- krakenox: krakenox-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- mythar: mythar-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- pebblefist: pebblefist-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- ashemit: ashemit-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- dorowani: dorowani-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- floatcalf: floatcalf-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- gabu: gabu-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)
- inklet: inklet-attacks-artic-v2rework-20261026.gif (22 frames, 4 overlaid)

## What is NOT done — percentages (per Mars's percentage rule)

- Batch C V2 rework, eyes: 32/32 = 100% done (this staging).
- Batch C V2 rework, mouths: 0/20 = 0% done — HELD for V3 by Mars's 10:50 CDT order (5 mouthed creatures x 4 sets = 20 mouth
  overlays owed; 3 eye-only creatures need no mouth). Overall Batch C attack-face rework: 32/52 = 62% done (eyes 32/32,
  mouths 0/20), with the 20 mouths blocked on the V3 module, not on measurement or effort here.
- Batch C hurts: 0 overlays by design (face-changing sets ship as base) — not owed.
- PR: 0% — show-first, staged only, awaiting Mars's verdict on these eyes + the V3 module for mouths.

## Files

- Cells: articulation-v2-rework/batch-c/<creature>/<creature>-artic-v2rework-20261026-<set>-cell-XX.png (22 per creature, 176 total)
- GIFs: articulation-v2-rework/batch-c/<creature>-attacks-artic-v2rework-20261026.gif (8)
- Triplets: articulation-v2-rework/batch-c/<creature>/<creature>_<set>_base_old_v2.png (32)
- Builder: articulation-v2-rework/batch-c/build_v2rework_c.py ; Manifest: manifest-artic-v2rework-20261026.json

