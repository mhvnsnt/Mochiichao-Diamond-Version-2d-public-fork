# Capture Capsule derivation — Batch 4 (DERIVED, NOT Mars-locked)

Parent task 2026-10-26 ordered capsule price/rate/variants filled from FireRed
mart prices + Mochiichao canon. No Coordinator B derivation file was found
(filename search of `pokemon-parity-fill/` and `goals/`; the only
coordinator-named file is a sprite-art checkpoint, and
`AEON-CAPTURE-CAPSULE-INTRO.md` withholds price/rate as Mars-only). This
derivation therefore stands as the filled value. Mars may veto/replace any
number below; nothing here is claimed Mars-locked.

## FireRed sources (read from the repo's own decomp submodule)

- Prices, `pokefirered-leafgreen/src/data/items.json`:
  Poke Ball 200, Great Ball 600, Ultra Ball 1200, Master Ball 0 (not sold).
  Specialty balls (Net/Dive/Nest/Repeat/Timer/Luxury) are 1000 each; they are
  condition balls and are NOT used here.
- Catch bonuses, `pokefirered-leafgreen/src/battle_script_commands.c`,
  `sBallCatchBonuses` (tenths): Poke Ball 10, Great Ball 15, Ultra Ball 20,
  Safari Ball 15. In multiplier terms: 1.0x / 1.5x / 2.0x.

## Mochiichao mapping

| Device | Tier | Price | Bonus | Multiplier | Sell (half) |
|---|---|---|---|---|---|
| Luigi Cube | base / default (in code) | 250 CR | 10 | 1.0x | 125 CR |
| Capture Capsule | standard (Great tier) | 600 CR | 15 | 1.5x | 300 CR |
| Prime Capsule | prime (Ultra tier) | 1200 CR | 20 | 2.0x | 600 CR |

- Luigi Cube 250 CR is existing Mochiichao canon (ShopView + gameStore,
  starter gift +5, default device). FireRed Poke Ball 200 is only the tier
  anchor (250/200 = 1.25x Mochiichao rounding); the 250 itself is not derived.
- Capture Capsule price 600 CR = FireRed Great Ball price carried over
  literally; bonus 15 = Great Ball bonus carried over literally.
- Prime Capsule price 1200 CR = FireRed Ultra Ball price carried over
  literally; bonus 20 = Ultra Ball bonus carried over literally.
- Catch-rate step vs Luigi Cube: 10 -> 15 (+5 tenths, 1.5x) -> 20 (+10 tenths,
  2.0x), inside the existing Mochiichao catchRateShape (3-255) and
  ringCaptureChance shape. No catch formula is changed in code by this batch;
  mapping bonus -> chance is wiring owed.
- Sell rule (already in ShopView code): sellPrice = floor(buyCost / 2).
- Aeon canon bound satisfied: 600 CR > 250 CR and 1200 CR > 250 CR, so the
  first-store beat ("expensive... they take a lot of ***SCIENCE*** to make")
  still holds. First obtainable: first store, NOT the lab, NOT The Ringcade.
- Master tier: NOT priced, NOT sold, NO guaranteed-catch capsule invented.
  Mirrors FireRed Master Ball price 0 (unsold/gift-only). A master-tier capsule
  is a separate Mars-only decision, if ever.

## What is NOT claimed

- Live ShopView listing: SHOP_ITEMS in code still holds 4 items; capsule rows
  are shape-only until wired (shop rows priced 6/6, wired live 4/6).
- Live capture bonus wiring: 0% in code from this batch.
- Mars lock: none. Derivation flagged everywhere it appears.
