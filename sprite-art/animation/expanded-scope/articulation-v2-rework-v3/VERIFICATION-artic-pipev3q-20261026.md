# VERIFICATION — V3 MOUTH APPLICATION QUEUE-WIDE (2026-10-26)

Tag: `artic-pipev3q-20261026`. Builder: `build_v3queue.py` (this dir).
Method: PIPELINE-V3 exactly — `articulation-pipev3/mouth_fit.py`
(feathered elliptical contour masks, blurred-base clear, teeth as clipped
ellipses only, gates on the final frame). STAGED ONLY, show-first, NO PR,
no repo edits, no work-clone git changes. No V2-rework file, pipev3 file,
Batch B file, pilot, approved hurt, or hurt cell was touched or overwritten.

## Totals

- Cells staged: 528 (24 creatures x 22 attack frames: 5 batch-a + 8 batch-c +
  9 batch-d + 2 batch-e). Per-creature attacks GIFs: 24 (22 frames each).
- Impact frames: 96. Mouths applied: 45/96 = 47%. Eyes-only impact: 51/96.
- Non-impact cells: 432/432 byte-identical (sha256) to the V2-rework inputs.
  The ONLY delta on any set is the cell-03 mouth.
- Rule eyes-only impact cells: 48/48 byte-identical to V2-rework inputs.
- Reuse impact cells: 8/8 byte-identical to the proven pipev3 proof cells.
- Fresh applied gates: 37 frames, fill ratios 0.604-0.838, all < 0.85,
  all inside the feathered mask support (dilated 2px), 0 px off-silhouette.
- Mouth zooms (v2eyes | v3): 45, one per applied set. Eye-checked, one set
  per applied creature (12/12 PASS, no square block on any zoom).

## Measured mouth centres (re-measured from enlarged game-ready front cells)

| Creature | Source mouth | Teeth | Old anchor verdict |
|---|---|---|---|
| razorgater | (32,36) open jaw | YES (teeth top+bottom) | old (32,40) sat on lower teeth, 4px low — NOT reused |
| tyrage | (28.5,28.5) mouth line | no | old (31,28) sat between y27 snout line and y29 shadow — centre placed mid, mask covers both |
| sproutle | (31.5,27.5) smile arc x28-35/y27-28 | no | old (32,33) was 5.5px LOW, on neck shadow — blind-copy trap, NOT reused |
| kittember | (22.5,30) REUSE proof verbatim | YES | — |
| tiidebiite | (27,24) REUSE proof verbatim | no | — |
| mythar | (31.5,27.5) mark below nose | no | old (32,27) within 0.5px, confirmed |
| ashemit | (26,27.5) closed bar across cream face | no | old (32,26) right-biased — NOT reused |
| floatcalf | (31.5,26.5) dark band x27-36/y26-27, lum 4-18 vs dome 23-24 | no | old (32,28) 1.5px low, on dome/belly edge — refined |
| gabu | (32,29) open pink mouth x24-40/y25-33 | no | old (32,29) confirmed; white at mouth bottom is chin, not teeth |
| strikechamp_unsuited | (32,17) humanoid line | no | confirmed |
| strikechamp_unsuited_full | (30,18) humanoid line | no | confirmed |
| punchkid | (32.5,21.0) faint line | no | candidate confirmed |

Expressions (same as proof): physical/signature = open-bite, special = grin,
heavy = grimace. Mask radii (source scale): open-bite (7,6), grin (6.5,3.5),
grimace (6.5,4), x each frame's (sx,sy).

## Per-creature mouth counts (applied / 4 sets)

- Batch A: razorgater 4/4, tyrage 4/4, sproutle 2/4, kittember 4/4 (reuse),
  tiidebiite 4/4 (reuse) = 18/20.
- Batch C: mythar 4/4, ashemit 4/4, floatcalf 3/4, gabu 4/4, krakenox 0/4,
  pebblefist 0/4, dorowani 0/4, inklet 0/4 = 15/32.
- Batch D: strikechamp_unsuited 4/4, strikechamp_unsuited_full 4/4, all other
  7 sets 0/4 = 8/36.
- Batch E: punchkid 4/4, pyromonk 0/4 = 4/8.

## Gate failures (shipped eyes-only, never forced — fill ratio only)

All three passed pre-gate, inside-mask, and silhouette; only the
changed-bbox fill ratio exceeded 0.85. Mechanism: small squashed
grin/grimace masks overlapping high-contrast edges (visor edge, dome band),
where the blurred-base clear itself changes most bbox pixels. Gates were
NOT loosened (binding: measurement, not loosening).

- sproutle atk_special_seed_shot (grin): fill 0.902, bbox 14x8.
- sproutle atk_signature_bloom_burst (grimace): fill 0.861, bbox 18x12.
- floatcalf atk_heavy_cloud_crash_finisher (grimace): fill 0.925, bbox 20x6.

## Eyes-only with reasons (flagged, not guessed)

- dorowani 0/4: NO distinct mouth line on the front cell. Old (31,24) sits
  on plain blue snout (lum 92-205, no line); no mouth feature anywhere on
  the snout. Task's assumed owed list overridden by measurement (V3 rule 7).
- pyromonk 0/4: NO cleanly measurable mouth line; red/gold face pattern
  noise swamps any line on the enlarged front cell (as flagged in V2 notes).
- krakenox 0/4, pebblefist 0/4, inklet 0/4: no measurable front mouth
  (v1 + v2 rule; inklet's mouth is on the underside, not the front).
- Batch D other 7 (squirmite, stormtalon, strikechamp, terradog, toxitacle,
  yogiferno, zephling) 0/4 each: no mouth over beaks/masks/visors (D rule).

## Eye-check (enlarged mouth zooms, physical set per creature)

PASS 12/12, no square block on any zoom: razorgater, tyrage, sproutle,
kittember (reuse), tiidebiite (reuse), mythar, ashemit, floatcalf, gabu,
strikechamp_unsuited, strikechamp_unsuited_full, punchkid. Floatcalf's
mouth reads as a mouth on the lower dome, not a belly smear; sproutle's
sits under the visor at the true smile, not on the neck.

## GIF duration conventions (kept per batch, as in v2rework)

Batch A/C/E: source durations + 250 ms tail on each set's last frame.
Batch D: pilot durations verbatim, no tail (its v2rework convention).
Batch D v2rework shipped per-set GIFs; this queue ships per-creature
combined 22-frame GIFs for all batches, as tasked.

## Untouched

Batch B, pilots (Mochii/Dreadtoise), approved hurts, Aquariios/Reaperdile
V2 attacks, all hurt cells, all V2-rework inputs, all pipev3 proof files.
Nothing ships on this task (show-first).
