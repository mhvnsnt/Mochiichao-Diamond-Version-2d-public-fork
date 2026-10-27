# LUSTRE VARIANT METHOD SPEC — PILOT (2026-10-26)

Mars order 2026-10-26 ~18:43 CDT: shiny-v2 51/51 CONFIRMED and KEPT as base,
but they read as made the same way (single hue+40 rule = green-overlay feel).
Build MORE color variations and DIFFERENT ways of creating shinies.
Staged only. NO PR, NO lock. Show-first. Full 510 (51 x 10) follows ONLY
after Mars approves this pilot method.

## 1. Pokemon structure pulled (Black 2, most recent game)

All paths verified in `fresh-start/pokebw2` (not quoted from memory):

- **Roll (generation):** `PML_UtilPIDIsRare(id, pid)` —
  `src/system/poke_tool.c:681`:
  `(((id & 0xffff0000) >> 16) ^ (id & 0xffff) ^ ((pid & 0xffff0000) >> 16) ^ (pid & 0xffff)) < 8`
  Threshold **8** over a 16-bit XOR space (0-65535) = 8/65536 = **1/8192**
  per roll. That constant 8 IS Pokemon's shiny rate.
- **Encounter application:** `FieldEncount_CreateWildPkm` —
  `src/ov036/enc_pokeset.c:332`: rolls a fresh PID up to `rolls` times
  (base 1; +2 with Shiny Charm; Pass Power Lucky Shiny modifies rolls);
  the first rare PID wins. The rare flag is then carried on the creature.
- **Appearance:** `GetPokemonPaletteDataNo` — `src/system/pokegra.c:137`:
  the `rare` bool selects a `rareOffset` palette file. Pokemon shinies are
  **HAND-AUTHORED alternate palettes per species, not a formula.** This
  pilot follows that lead: 10 authored methods, not 1 overlay.

## 2. Rate — MARS'S RATE (supersedes the old split)

Old recorded split (SUPERSEDED): any-variant 1/8192, per-variant 1/81920
(one shared roll, variant picked after). Mars 2026-10-26 ~18:43 CDT:
**10 variants = 10x Pokemon's shiny appearance chance — each variant
carries Pokemon's full base rate.** With Black 2's 1/8192 base:
per-variant 1/8192, any-variant ~10/8192 = **1/819**. Do NOT silently
change this. Rolled at generation, persists through evolution/PC (as
before); the per-variant roll model is the only change.

## 3. The 10 methods (each a DISTINCT palette rule)

Pipeline shared by all: freshest base front (shiny-v2 SOURCE-LINEAGE) ->
16-colour MEDIANCUT quantize -> per-method palette transform -> rebuild.
**White-protection rule (all methods):** palette entries with value >= 0.92
and saturation <= 0.12 (pure whites: Wispkin mask, eye highlights) are
NEVER recolored. Verified on the Wispkin sheet: mask bone-white in all 10.

| Kind | Chromatic rule | Achromatic rule | Reads as |
|---|---|---|---|
| Solar | hue +25 deg toward warm, sat x1.15, val +0.10 | warm tint (hue 40, sat 0.25) | golden daylight |
| Lunar | hue -35 deg toward cool, sat x0.90, val -0.15 | cool tint (hue 230, sat 0.25) | cold moonlight |
| Prism | hue split into 3 rotated bands (+120/-120/0 by hue sector), sat x1.20 | luminance bands: dark violet / mid cyan / light magenta (sat 0.50) | rainbow segmentation |
| Bare | sat x0.50 (accents collapse to body tones) | unchanged | stripped-down, natural |
| Clothed | accents -> deep teal-navy uniform (hue 205, sat x1.10) | navy tint (hue 220, sat 0.35, val x0.80) | uniformed/garbed |
| Showtime | sat x1.40, val +0.05 | light achromatics -> white-hot | stage pop |
| Iron | hue -> steel 210, sat x0.45, val compressed 0.35-0.75 | steel gray (hue 210, sat 0.12, val 0.35-0.75) | metallic |
| Ember | hue pulled 70% toward ember 20 deg, sat x1.25, val -0.05 | ember tint (hue 15, sat 0.60) | burning coals |
| Night | sat x1.20, val x0.55 | dark -> darker; light achromatics -> glow (hue 190, sat 0.30, val 1.0) | dark body, luminous accents |
| Parade | sat x1.50, val +0.10 | dark -> vivid violet (hue 280, sat 0.35); light -> gold (hue 45, sat 0.30) | carnival bright |

**Bare/Clothed honesty note:** for pilot creatures these are PALETTE-level
(no geometry invented). True geometry look changes exist only where the
creature already has variants — the Strikechamp rule: armored base vs
non-armored Bare vs clothed non-helmeted Clothed. Do not invent outfits
for creatures that have none.

## 4. Pilot results: 50 looks, 0 same-way collisions

5 creatures, distinct body types: aerobeak (flyer), terradog (quadruped),
wispkin (blob/formless), punchkid (biped), finblade (swimmer).
Per-creature show sheets + swatches + manifest in `lustre-pilot-20261026/`.
Distinctness check: NO two variants of the same creature share an
identical palette (0 collisions) — the "made the same way" defect is
closed at the palette level.

**Weak spots, flagged not hidden:**
- Wispkin SHOWTIME changed only 1/16 palette entries — on a vantablack
  body it reads nearly identical to BASE. Wispkin NIGHT is also weak: its
  glow path never triggers (no light achromatic entries besides protected
  whites), so it reads as a slight darkening. For achromatic bodies,
  Showtime/Night need a rim-light/glow treatment on the smoke — a method
  revision for Mars to approve, NOT silently changed here.
- Bare is the subtlest method everywhere (8-13/16 entries changed) — by
  design (stripped-down), but it is the closest to "same as base" of the 10.

## 5. What follows (only after Mars approves the pilot)

Full 510 = remaining 46 creatures x 10 variants, same 10 methods, same
white-protection rule, same show-sheet format. Then: variant roll wiring
(per-variant 1/8192 model above) and Dex/party display of the variant kind.
