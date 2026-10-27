# Validation report — slice 2 (moves / learnsets / evolutions)

Date: 2026-10-26. Staged only; no commit, no push, no PR, no repo edits.
Re-run: `python3 validate.py` in this directory (exit 0 = pass).
Regenerate: `python3 build_slice.py` (reads decomp JSONs + roster only).

## Results
- validate.py: ALL CHECKS PASSED (28 PASS lines, 0 FAIL), exit 0.
- tsc --noEmit --strict on moves-catalogue.ts + evolution-hook.ts: exit 0.
- JSON parse: moves-provenance.json, learnsets.json, evolutions.json all valid.
- Full validate.py output is reproduced below (verbatim, from the final run).

## Counts verified by the gate
- New moves: 84; existing moves.ts: 36; union catalogue: 120.
  120/354 = 34% vs FireRed; 120/560 = 21% vs Black 2. Live game: still 36.
- New-move shapes: every entry's type/category/power/accuracy/PP/priority
  matches its decomp source shape (FireRed primary; Black 2 for
  DRAGON_SURGE + UMBRAL_PULSE; borrowed FireRed shapes for the 3 FAIRY
  moves, flagged in provenance). No new name equals a Black 2 move name;
  no new ID collides with moves.ts.
- Learnsets: 47/47 species; level 333 entries; TM 328 entries (20-slot
  catalogue); tutor 138 entries; egg 48 entries on 16 species.
  Every moveId resolves to the 120-move union; every TM code resolves.
  HM [] for all 47 by design (shape only — see SOURCE-MAP.md).
- Evolutions: 29/29 links exactly equal to roster evolution_reqs;
  18 species null (terminal/single). Hook contains 013→014 showcase,
  canCancel true.

## What this gate does NOT prove
- Battle playability: 14 new effect tokens and the mid-fight hook are
  data/shape only; BattleView does not implement them yet.
- Type-chart correctness: Beast/Flora/Neon mappings are placeholders;
  STAB for those species is unconfirmed.
- species.ts merge safety: the 039 id drift (code "Dreadtoise" vs roster
  "Shellguard") is flagged in SOURCE-MAP.md and is NOT resolved by this
  gate. Do not merge learnsets into species.ts until it is resolved.

## Verbatim validate.py output (final run)
```
PASS roster 47 (got 47)
PASS Pebblefist 035 HP stays null (MARS-ONLY, not invented)
PASS existing moves.ts 36 (got 36)
PASS new moves 84 (got 84)
PASS new move IDs unique
PASS no new ID collides with moves.ts
PASS no new name equals a Black 2 move name (bad=[])
PASS no new name duplicates an existing moves.ts name (bad=[])
PASS union catalogue 120 (got 120)
PASS all provenance shapes match decomp (mismatches=[])
  new-move type counts: {'BUG': 4, 'DARK': 3, 'DRAGON': 3, 'ELECTRIC': 5, 'FAIRY': 3, 'FIGHTING': 4, 'FIRE': 5, 'FLYING': 5, 'GHOST': 4, 'GRASS': 6, 'GROUND': 5, 'ICE': 4, 'NORMAL': 8, 'POISON': 5, 'PSYCHIC': 6, 'ROCK': 4, 'STEEL': 4, 'WATER': 6}
  new-move cat counts: {'Physical': 36, 'Status': 16, 'Special': 32}
  new effect tokens: ['ACC_DOWN1', 'ALL_UP1', 'ATK_DOWN1', 'ATK_DOWN2', 'ATK_UP1', 'BURN', 'CONFUSE', 'DEF_DOWN1', 'DEF_UP1', 'DEF_UP2', 'DRAIN', 'FLINCH', 'FREEZE', 'HIGH_CRIT', 'MULTI_HIT', 'NONE', 'PARALYSIS', 'POISON', 'PROTECT', 'SLEEP', 'SPDEF_DOWN1', 'SPDEF_UP1', 'SPDEF_UP2', 'SPE_DOWN1', 'TRAP']
PASS learnset species 47 (got 47)
PASS learnset ids == roster ids
PASS learnset names == roster names (bad=[])
PASS TM catalogue 20 (got 20)
PASS learnset referential integrity (errs=[])
  level entries total: 333; tm entries total: 328; tutor total: 138; egg total: 48
  level coverage: 47/47; tm: 47/47; tutor: 47/47; egg base forms with moves: 16/17 base (+041 [] single-stage)
PASS evolution species 47 (got 47)
PASS evolution links 29 (got 29)
PASS evolution links == roster verbatim (errs=[])
PASS terminal/single species 18 with null evolution
PASS hook contains locked 013->014 showcase
PASS hook canCancel true
PASS hook does not invent Mythar evolution (no-op check)

RESULT: ALL CHECKS PASSED
```
