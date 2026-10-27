# True Elements matchup chart — 19×19 (Mars-locked list)

**Staged only, 2026-10-26. NOT canon data until Mars judges it, NOT wired into any game file, NO PR.**
Rows = attacking element, columns = defending element. Values are damage multipliers: 2 = super effective, ½ = not very effective, 1 = neutral, 0 = no effect, TBD = explicitly undecided (Deep only — NOT invented, NOT defaulted to 1).

## 1. Locked list + Pokemon equivalent (Mars-ruled 2026-10-26 ~21:01–21:13 CDT)

| True element | Pokemon equivalent | Source of its row/column |
|---|---|---|
| Water | WATER | Decomp (see §2) |
| Chrome | STEEL | Decomp (see §2) |
| Earth | GROUND | Decomp (see §2) |
| Bug | BUG | Decomp (see §2) |
| Umbral | DARK | Decomp (see §2) |
| Aero | FLYING | Decomp (see §2) |
| Core | ROCK | Decomp (see §2) |
| Strike | FIGHTING | Decomp (see §2) |
| Deep | — none (separate mystical legendary, way-underground primordial, Groudon-like) | TBD — no Pokemon equivalent exists |
| Flame | FIRE | Decomp (see §2) |
| Mythic | DRAGON | Decomp (see §2) |
| Normal | NORMAL | Decomp (see §2) |
| Neon | ELECTRIC | Decomp (see §2) |
| Flora | GRASS | Decomp (see §2) |
| Frost | ICE | Decomp (see §2) |
| Toxic | POISON | Decomp (see §2) |
| Cryptid | FAIRY | Modern-repo chart ONLY (see §3) |
| Paranormal | GHOST | Decomp (see §2) |
| Clairvoyant | PSYCHIC | Decomp (see §2) |

## 2. Decomp sources (exact files, values extracted by script, not memory)

- **Primary (most recent game, Black 2):** `pokebw2/src/ov167/btl_calc.c:61` — `data_ov167_021d7500[17][17]`, comment: “The damage of each attacking type against each defending type in halves: 0, 2 (half), 4 (normal) or 8 (double)”. Row/column order is the standard type order (NORMAL, FIGHTING, FLYING, POISON, GROUND, ROCK, BUG, GHOST, STEEL, FIRE, WATER, GRASS, ELECTRIC, PSYCHIC, ICE, DRAGON, DARK), verified against the rows themselves (e.g. row 0 NORMAL: ROCK 2, GHOST 0, STEEL 2; row 1 FIGHTING: NORMAL 8, GHOST 0, STEEL 8). Applied by `GetTypeEffectiveness` (`btl_calc.c:123`) and pair-multiplied by `BtlCalc_GetTypePairEffectiveness` (`btl_calc.c:140`).
- **Cross-check (FireRed):** `pokefirered-leafgreen/src/battle_main.c:312` — `gTypeEffectiveness[336]`, comment: “format: attacking type, defending type, damage multiplier … 20 is ×2.0, 10 is ×1.0, 05 is ×0.5, 00 is ×0.0”. 110 real triples + 2 sentinels (`TYPE_FORESIGHT, TYPE_FORESIGHT` and `TYPE_ENDTABLE, TYPE_ENDTABLE`, both NO_EFFECT terminators, excluded). **FireRed vs Black 2: 0 differences across all 17×17 = 289 cells** — the 17-type core is identical in Gen 3 and Gen 5 decomps, so the decomp half of this chart rests on two independent in-source tables, not one.
- **HeartGold:** no in-source effectiveness table was found (its battle code reads game data); it is NOT cited for values here. The FireRed↔Black 2 agreement above is the cross-check, not HeartGold.

## 3. Modern-repo source for Cryptid/Fairy ONLY (labelled, NOT decomp)

Fairy appears in **NONE** of the three decomps (all predate Gen 6). Cryptid's entire row and column come from the repo's own modern chart: `src/lib/constants.ts`, `effectiveness()` (superEffective / notVery / noEffect lists), on live main. Cryptid row (attacking): 2× vs Strike (FIGHTING), Mythic (DRAGON), Umbral (DARK); ½× vs Flame (FIRE), Toxic (POISON), Chrome (STEEL); 1× elsewhere. Cryptid column (defending): 2× from Toxic (POISON), Chrome (STEEL); ½× from Bug, Umbral (DARK), Strike (FIGHTING); 0× from Mythic (DRAGON); 1× elsewhere. These are the standard Gen 6 Fairy values; they are labelled modern-repo in every cell count below, never decomp.

## 4. Full 19×19 chart (rows attack, columns defend)

| Attack ↓ / Defend → | Water | Chrome | Earth | Bug | Umbral | Aero | Core | Strike | Deep | Flame | Mythic | Normal | Neon | Flora | Frost | Toxic | Cryptid | Paranormal | Clairvoyant |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Water | ½ | 1 | 2 | 1 | 1 | 1 | 2 | 1 | TBD | 2 | ½ | 1 | 1 | ½ | 1 | 1 | 1 | 1 | 1 |
| Chrome | ½ | ½ | 1 | 1 | 1 | 1 | 2 | 1 | TBD | ½ | 1 | 1 | ½ | 1 | 2 | 1 | 2 | 1 | 1 |
| Earth | 1 | 2 | 1 | ½ | 1 | 0 | 2 | 1 | TBD | 2 | 1 | 1 | 2 | ½ | 1 | 2 | 1 | 1 | 1 |
| Bug | 1 | ½ | 1 | 1 | 2 | ½ | 1 | ½ | TBD | ½ | 1 | 1 | 1 | 2 | 1 | ½ | ½ | ½ | 2 |
| Umbral | 1 | ½ | 1 | 1 | ½ | 1 | 1 | ½ | TBD | 1 | 1 | 1 | 1 | 1 | 1 | 1 | ½ | 2 | 2 |
| Aero | 1 | ½ | 1 | 2 | 1 | 1 | ½ | 2 | TBD | 1 | 1 | 1 | ½ | 2 | 1 | 1 | 1 | 1 | 1 |
| Core | 1 | ½ | ½ | 2 | 1 | 2 | 1 | ½ | TBD | 2 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 1 |
| Strike | 1 | 2 | 1 | ½ | 2 | ½ | 2 | 1 | TBD | 1 | 1 | 2 | 1 | 1 | 2 | ½ | ½ | 0 | ½ |
| Deep | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Flame | ½ | 2 | 1 | 2 | 1 | 1 | ½ | 1 | TBD | ½ | ½ | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 |
| Mythic | 1 | ½ | 1 | 1 | 1 | 1 | 1 | 1 | TBD | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| Normal | 1 | ½ | 1 | 1 | 1 | 1 | ½ | 1 | TBD | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| Neon | 2 | 1 | 0 | 1 | 1 | 2 | 1 | 1 | TBD | 1 | ½ | 1 | ½ | ½ | 1 | 1 | 1 | 1 | 1 |
| Flora | 2 | ½ | 2 | ½ | 1 | ½ | 2 | 1 | TBD | ½ | ½ | 1 | 1 | ½ | 1 | ½ | 1 | 1 | 1 |
| Frost | ½ | ½ | 2 | 1 | 1 | 2 | 1 | 1 | TBD | ½ | 2 | 1 | 1 | 2 | ½ | 1 | 1 | 1 | 1 |
| Toxic | 1 | 0 | ½ | 1 | 1 | 1 | ½ | 1 | TBD | 1 | 1 | 1 | 1 | 2 | 1 | ½ | 2 | ½ | 1 |
| Cryptid | 1 | ½ | 1 | 1 | 2 | 1 | 1 | 2 | TBD | ½ | 2 | 1 | 1 | 1 | 1 | ½ | 1 | 1 | 1 |
| Paranormal | 1 | ½ | 1 | 1 | ½ | 1 | 1 | 1 | TBD | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 2 | 2 |
| Clairvoyant | 1 | ½ | 1 | 1 | 0 | 1 | 1 | 2 | TBD | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | ½ |

## 5. Coverage counts (361 cells = 19×19)

- **289 cells from decomp** (17×17 core: FireRed table + Black 2 table, 0 diffs between them).
- **35 cells from the modern-repo chart** (Cryptid row 18 + Cryptid column 18 − Cryptid-vs-Cryptid counted once).
- **37 cells TBD — Deep only** (Deep row 19 + Deep column 19 − Deep-vs-Deep counted once). Deep's row and column are left blank on purpose: inventing them would break the “no invented matchups” rule. Deep has 0 Gen 1 creatures and no legacy type maps to it, so **zero Gen 1 battles can hit a TBD cell** — the TBD cells only matter when a Deep creature or move is created (Gen 2+).
- Derived-cell value totals (324 cells, decomp + modern): 2× = 51, ½× = 63, 0× = 8, 1× = 202. (51 + 63 + 8 + 202 = 324. ✓)

## 6. Rows and columns for the new / split elements (plain lists)

- **Neon (Electric)** — attacking: 2× vs Water, Aero; ½× vs Mythic, Neon, Flora; 0× vs Earth. Defending: 2× from Earth; ½× from Chrome, Aero, Neon; 0× from nothing.
- **Flora (Grass)** — attacking: 2× vs Water, Earth, Core; ½× vs Chrome, Bug, Aero, Flame, Mythic, Flora, Toxic; 0× vs nothing. Defending: 2× from Bug, Aero, Flame, Frost, Toxic; ½× from Water, Earth, Neon, Flora; 0× from nothing.
- **Frost (Ice)** — attacking: 2× vs Earth, Aero, Mythic, Flora; ½× vs Water, Chrome, Flame, Frost; 0× vs nothing. Defending: 2× from Chrome, Core, Strike, Flame; ½× from Frost; 0× from nothing.
- **Toxic (Poison)** — attacking: 2× vs Flora, Cryptid; ½× vs Earth, Core, Toxic, Paranormal; 0× vs Chrome. Defending: 2× from Earth, Clairvoyant; ½× from Bug, Strike, Flora, Toxic, Cryptid; 0× from nothing.
- **Cryptid (Fairy, modern)** — attacking: 2× vs Umbral, Strike, Mythic; ½× vs Chrome, Flame, Toxic; 0× vs nothing. Defending: 2× from Chrome, Toxic; ½× from Bug, Umbral, Strike; 0× from Mythic.
- **Paranormal (Ghost)** — attacking: 2× vs Paranormal, Clairvoyant; ½× vs Chrome, Umbral; 0× vs Normal. Defending: 2× from Umbral, Paranormal; ½× from Bug, Toxic; 0× from Strike, Normal.
- **Clairvoyant (Psychic)** — attacking: 2× vs Strike, Toxic; ½× vs Chrome, Clairvoyant; 0× vs Umbral. Defending: 2× from Bug, Umbral, Paranormal; ½× from Strike, Clairvoyant; 0× from nothing.
- **Umbral (Dark ONLY — Ghost split out)** — attacking: 2× vs Paranormal, Clairvoyant; ½× vs Chrome, Umbral, Strike, Cryptid; 0× vs nothing. Defending: 2× from Strike, Bug, Cryptid; ½× from Paranormal, Umbral; 0× from nothing — NOTE: the old merged Umbral's Ghost-immunity-vs-Normal loss is GONE: Normal vs Paranormal is 0× (Ghost immunity survives the split), and Umbral-vs-Normal is 1× (Dark has no Normal interaction).
- **Mythic (Dragon ONLY — Psychic split out)** — attacking: 2× vs Mythic; ½× vs Chrome; 0× vs Cryptid. Defending: 2× from Frost, Mythic, Cryptid; ½× from Flame, Water, Flora, Neon; 0× from nothing.

## 7. Caveats Mars must know before judging (nothing hidden)

1. **Gen 5 core + modern Fairy overlay.** The 17×17 core is Gen 5 (Black 2) values. Gen 6 changed two non-Fairy cells (Steel no longer resists Ghost or Dark); this chart keeps the decomp values (Paranormal-vs-Chrome ½×, Umbral-vs-Chrome ½×) because the brief says decomp where a decomp source exists. If Mars wants Gen 6 values there, those two cells flip to 1× — his call, not a silent edit.
2. **The modern repo chart has 6 omissions vs the decomps — a reason NOT to copy it wholesale.** `constants.ts` vs Black 2 differs on 6 non-Fairy cells (modern = 1×, decomp = ½×): Frost-vs-Flame, Frost-vs-Chrome, Bug-vs-Toxic, Paranormal-vs-Chrome, Mythic-vs-Chrome, Umbral-vs-Chrome. This chart uses the decomp ½× for all six. The modern chart's Fairy cells themselves are standard and unaffected by those omissions.
3. **Dual types multiply.** A defender with two True elements takes the product of the two cells (Black 2 `BtlCalc_GetTypePairEffectiveness`; repo `calcTypeMultiplier` does the same), exactly as Pokemon does. A 0× in either slot zeroes the hit regardless of the other slot.
4. **STAB is unchanged by this chart.** Same-element attack bonus (1.5×) is a separate multiplier in battle-math; it applies when the move's True element matches one of the attacker's True elements. The wiring diff maps BOTH moves and battlers to True names at the same boundary, so STAB comparisons stay consistent.
5. **Deep TBD questions for Mars (all four, explicitly):** (a) what is Deep strong against (2×)? (b) what is Deep weak against — i.e. what hits Deep for 2×? (c) what is Deep immune to, and what is immune to Deep (0×)? (d) what resists Deep, and what does Deep resist (½×)? Until he answers, Deep cells stay TBD and the wiring diff leaves Deep keys ABSENT, so the resolver flags any Deep lookup (typeChartMissing) instead of silently playing ×1.
6. **This chart replaces the old 12-element derivation, it does not extend it.** The existing `src/lib/battleTypeChart.ts` (12 elements, merged Umbral/Mythic, 24 conflict cells, 44 owed cells) is superseded by this 19-element chart: no merges, no conflict cells, Deep TBD instead of owed-×1. The wiring diff retires that file's data model (see wiring note).

## 8. Sources, in one place

- pokebw2 `src/ov167/btl_calc.c:61` (`data_ov167_021d7500[17][17]`), `:123` (`GetTypeEffectiveness`), `:140` (`BtlCalc_GetTypePairEffectiveness`).
- pokefirered-leafgreen `src/battle_main.c:312` (`gTypeEffectiveness[336]`, 110 real triples + 2 sentinels).
- Repo live main `src/lib/constants.ts` `effectiveness()` — Cryptid/Fairy row + column ONLY.
- Mars's locked list + rulings 2026-10-26 ~21:01–21:13 CDT (19 elements, splits, Gen 2 rule). Gen 1 = current 47 creatures; everything new is Gen 2+.
