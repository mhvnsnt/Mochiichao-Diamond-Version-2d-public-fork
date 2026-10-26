# Move -> set assignment table — LANE-100% build (staged only, 2026-10-26)

## What this is

The routing table Layer 2 wiring needs: when the game plays move X for
creature Y, which attack set plays? Built from the real extracted move data
(`pokemon-layer/moveScripts.json`: 563 union scripts from FireRed 354 +
Black 2 560) and the TAXONOMY-DRAFT slots (physical strike /
special-projectile / type-signature / heavy-finisher / status-utility).

## Routing rules (union moves -> slots)

- Physical, power >= 100 -> heavy/finisher (41 moves).
- Physical, power < 100 (or unpowered) -> physical strike (181 moves).
- Special -> special/projectile (143 moves).
- Status -> status/utility (89 moves).
- Total routed: 454/563 = 81%. Signature slots take ONLY the creature-named
  signature move (e.g. Razorgater's `atk_signature_cross_slash`); union moves
  NEVER route to signature generically.
- Hurt routing: light -> `hurt_light_flinch`, heavy -> `hurt_heavy_knockback`,
  status -> `hurt_status_wobble`, low-HP hits -> `hurt_near_faint_stagger`.

## Coverage (verified on disk)

- Creatures with all 4 attack slots mapped: 51/51 = 100%.
- Attack set names found across manifests: 239 (4 canonical slots per
  creature + same-slot variants from overlapping tracks, listed per creature
  as `attack_slot_variants`, not counted as extra slots).
- Hurt set names found: 204 (4 per creature x 51).
- Per-creature files: `assignment/<creature>_assignment.json` (slots, set
  names, union-move counts per slot, hurt slots, variants).

## UNMAPPED (explicit, never guessed) — see UNMAPPED.json

1. 109 fallback moves: Status-utility moves with no mappable effect in either
   extracted source. They play the generic fallback script (Layer 1), not a
   per-creature set.
2. 54 category-disagreement moves: FireRed vs Black 2 category differs;
   routed by Black 2 category per the moveScripts.json assumption, flagged
   for review.
3. Per-creature KNOWN-move lists: UNMAPPED for all 51. No Mochiichao learnset
   data exists in repo data (species.ts covers 12 species;
   global_roster.json does not parse as JSON). This table routes union moves
   to slots; it does NOT claim any creature knows any specific move. Building
   real learnsets is a data task, not something to invent here.

## Builder

`build_lane100.py` (same dir). Rerun reproduces all three lane100 builds.
