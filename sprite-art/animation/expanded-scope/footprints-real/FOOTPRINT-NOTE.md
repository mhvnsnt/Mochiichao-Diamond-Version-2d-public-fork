# Actual footprints — REAL foot/paw prints (staged only, 2026-10-26)

## Pokemon precedent (Pokemon-first)
FireRed: `graphics/pokemon/<species>/footprint.png` — 16×16, mode 1
(bilevel), black print on white. Pokemon's prints are the creature's FEET,
not its whole body. That is what this build copies. The earlier lane100
"footprints" are FULL-BODY SILHOUETTES and are now the pre-discovery
silhouette set (Mars, 2026-10-26 ~12:33 CDT) — a different thing, kept
separately, never overwritten by this build.

## Method (traced from the feet, not invented)
1. Source per creature: the locked `battle_front` cell (via the locked
   manifest), except where the front view's ground contact is a merged
   mass — then the clearest walk view (`walk_left_0` side profile, or
   `walk_down_0`), recorded per creature in the manifest.
2. Ground band: bottom rows of the silhouette, solid pixels only
   (alpha >= 200, so baked soft shadows do not merge into the print).
   Largest solid component in the band = the foot. Where the front
   band merged both feet into one wide bar, the side view was used
   instead; where no gap exists at all, the print is the merged paw
   impression and is flagged as such.
3. Ashemit special case: its paw was isolated by colour (grey paws vs
   orange body) in the bottom rows — the bottom-centre crossed paw.
4. Render: tight crop of the foot component, scaled to fit 14×14 inside
   16×16, mode 1 black-on-white (Pokemon's exact format).
5. Footless creatures: NO-FOOTPRINT with a reason. Feet were NEVER
   invented for a footless creature.

## Results: 37/51 footprints, 14/51 no-footprint
- Footprints: aerobeak, ashemit, chromejaww, cragarm, dorowani,
  dreadtoise, duneclaw, gabu, gearkid, gorokappa, kickmaster, kittember,
  manticlaw, mechapion, mothrix, mythar, oblivirex, pebblefist, pixilite,
  punchkid, pupbble, pyromonk, pyropaw, quakehound, razorgater,
  reaperdile, shellguard, sproutle, stormtalon, strikechamp,
  strikechamp_unsuited, strikechamp_unsuited_full, terradog, terrapod,
  tiidebiite, tyrage, yogiferno.
- No-footprint (reason in manifest): aquariios (fins), astroleviathan
  (tail flukes), cocoonode (cocoon), duskfiend (spectral wisps),
  finblade (swimmer, fins), floatcalf (hover dome), inklet (tentacles),
  krakenox (tentacles), megalochrome (levitator, no legs by canon),
  mochii (blob base, no distinct feet), squirmite (grub/blob),
  toxitacle (tentacles), wispkin (floating, no legs), zephling
  (hover dome).

## Honest limits (flagged, not hidden)
- Toe counts: NOT claimed anywhere. At 64px source resolution, exact toe
  counts are not resolvable; the manifest records `toe_count: null`
  with a note of what IS visible (claws, paw shape, etc.) per creature.
  A hand-traced toe pass at higher resolution would be separate art.
- Weak prints: pyropaw and mythar read blocky (small square feet fill
  the band); duneclaw and tyrage read thin (flat foot edges). They are
  the true ground-contact shapes, not cleaned up by invention.
- Kittember: feet are not distinctly separated from its round body at
  64px; its print is the body's ground-contact dome, labelled
  "round base impression", confidence low — not an invented paw.
- Wide paw shapes (chromejaww, pixilite, sproutle, reaperdile): both
  feet merge at 64px; the print is the merged paw impression, noted
  in the manifest.
- Mothrix: tiny insect legs only; its print is a small leg-cluster
  mark, confidence low.

## Outputs (staged only, NO PR)
- `footprints-real/<creature>_footprint.png` — 37 files, 16×16, mode 1.
- `footprints-real/FOOTPRINT-MANIFEST.json` — per creature: status,
  foot type, toe note, source view + file, confidence, reason.
- `footprints-real/contact_sheet_51.png` — all 51 slots; no-footprint
  slots marked NO FEET.
- Builders: `footprints-real/work/build_footprints_v2.py`,
  `fix_wide.py`, `fix_side.py`, `fix_final.py`, `remake_sheet.py`;
  foot-zone enlargements in `footprints-real/work/*_footzone.png`.
