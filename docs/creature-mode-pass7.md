# Creature Mode Pass 7 — Daycare level gain wired

## Source (FireRed, structure only, no dialogue copied)

- pokefirered-leafgreen/src/daycare.c: EXP = steps (1 per step),
  level from EXP total, retrieve cost = 100 + 100 * levels gained,
  egg check every 256 steps (steps & 0xFF == 0xFF) with both slots
  filled, compatibility roll vs random * 100.
- include/constants/daycare.h: INCOMPATIBLE 0, LOW 20, MED 50, MAX 70.
- Scoring inputs (species, trainer IDs, genders, egg groups) are
  documented in creatureDaycare.ts; Mochiichao's store has no
  gender or egg-group field, so no compatibility number is guessed.

## What changed (Creature Mode files only)

1. `src/lib/creatureDaycare.ts` (new): constants, retrieve-cost
   function, 256-step egg-check function, compatibility function
   (returns null with the reason while inputs are missing),
   egg-ready function (false without a second creature).
2. `src/store/gameStore.ts`: NEW persisted `daycareSteps` +
   `setDaycareSteps` (SaveMenu serializes the whole store, so
   steps persist like gardenRecords/guardian).
3. `src/components/views/CreatureModeView.tsx`: tile-change
   steps (not 50ms ticks) accumulate while a Guardian is assigned;
   Garden screen shows steps, EXP on retrieve, retrieve preview
   (Lv before → Lv after, cost in CR, wallet), and a Retrieve
   button that applies gainExp() to the Guardian's party
   instance, charges 100 + 100/level in CR via gainWallet(-fee)
   only when the wallet covers it, then resets steps to 0.
   If the Guardian is not in the party, nothing is applied.

## What did NOT change

- No damage, cooldown, movement, pathfinding, capture, or XP
  formula change (gainExp is the existing engine function).
- No egg produced, no compatibility number, no breeding species
  choice — those need a second deposited creature plus
  gender/egg-group inputs and a Chao Garden lane breeding
  decision, none guessed here.
- No new map, tileset, or sprite sheet. No file deletions.

## Playtest steps (live, on a Pages build containing this pass)

1. Assign a Guardian, move to a new tile: daycare steps +1
   per tile change only (not per animation tick).
2. Leave mode, save, load: daycare steps persist.
3. Retrieve preview shows Lv before → after and cost;
   Retrieve applies the level change, deducts CR, resets steps
   to 0. With insufficient CR, nothing changes.
4. Egg line stays "none" and compatibility stays "not computed"
   with one deposited creature — that is the honest state,
   not a missing display.

## Still owed after pass 7 (not claimed done)

- Live playtest (Pass 3/4 + 5 + 6 + 7 steps) on a Pages build
  containing this pass.
- Cooldown table: shown to Mars 2026-10-26; his "okay" that day
  is taken as approval as shown, changeable move by move in
  creatureCooldowns.ts if he names a different number.
- Egg production + compatibility number: structure in code,
  production blocked on a second deposit slot + gender/egg-group
  inputs + breeding species choice (Chao Garden lane).
- Walk-frame sheets (001/004/007/010) — 0/4, sprite lane.
- Garden Form palette sheets (001/004/007/010) — 0/4, sprite lane.
