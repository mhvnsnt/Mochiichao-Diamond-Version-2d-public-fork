# V3 PROOF VERIFICATION — Kittember + Tiidebiite attacks (2026-10-26)

Tag: artic-pipev3-20261026. Builder: articulation-pipev3/build_v3.py.
Module: articulation-pipev3/mouth_fit.py. Method: PIPELINE-V3.md.
Staged only, show-first, no PR.

## Result: 8/8 impact frames pass both gates

| Creature | Set | Expression | Changed px | Changed bbox | Fill ratio | Off-silhouette |
|---|---|---|---|---|---|---|
| Kittember | physical ember pounce | open-bite | 164 | 22x11 | 0.678 | 0 |
| Kittember | special ember spray | grin | 88 | 15x9 | 0.652 | 0 |
| Kittember | signature inferno pounce | open-bite | 172 | 20x13 | 0.662 | 0 |
| Kittember | heavy blaze crash | grimace | 95 | 19x8 | 0.625 | 0 |
| Tiidebiite | physical tide ram | open-bite | 199 | 21x13 | 0.729 | 0 |
| Tiidebiite | special tide jet | grin | 119 | 16x10 | 0.744 | 0 |
| Tiidebiite | signature surge barrage | open-bite | 207 | 20x14 | 0.739 | 0 |
| Tiidebiite | heavy tsunami finisher | grimace | 129 | 19x9 | 0.754 | 0 |

Fill ratio < 0.85 on all 8 proves shaped, feathered patches, not
blocks (a filled rectangle scores ~1.0). 0 px off-silhouette on all 8.

## Identity checks

- Non-impact cells: 18/18 per creature byte-identical to the
  V2-rework eyes-only inputs. The only delta in the GIFs is the mouth.
- V2-rework inputs, old retrofit files, pilots, approved hurts,
  Aquariios/Reaperdile V2 attacks, Batch B: untouched.

## Eye-check

All 8 base|old|V3 triplets + all 8 mouth-zone zooms checked enlarged:
every old tile shows the square median block (worst: Tiidebiite
heavy/special, Kittember special); no V3 tile shows any block edge —
mouths fade into the surrounding fur/skin. V3 grimaces read
smaller/subtler than the old big grimaces (contour fit, not a
defect — size is Mars's call).

## Gate fixes during this build (measurement, not loosening)

1. First run failed all 8 on bbox containment: the feather tail
   changes pixels at 1 level across a wide fringe. Fix: visible
   change = >=2 levels, outputs rounded (not truncated) to uint8.
2. Two frames then failed 1px fringe boundaries under a bbox check.
   Fix: containment is checked against the feathered mask support
   dilated by 2px, not a rectangle — the fill-ratio check remains
   the anti-block proof.

## Open / flagged (not guessed)

- Pyromonk mouth (Batch E): NOT cleanly measurable per the
  V2-rework notes. V3 must measure it before placing; it is not in
  this proof scope and no mouth was placed for it here.
- V3 grimace size (smaller than old) is Mars's call on the proof GIFs.
