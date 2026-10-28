# Chao Garden mode (Mochi Garden / Mainframe Gardens) — design spec

Designed 2026-10-25, building on `chao-garden-conversion.md` and
`src/lib/mochiichao-systems.ts` (in PR #9, not yet merged).
Pokemon-style, Nintendo-based, 2D/2.5D tile world — NOT voxel, NOT a 3D garden.

## 1. Core rule (do not break this)
Garden growth is a SECOND layer on top of species evolution, never a replacement.
- Species evolution (e.g. Mochii → Tiidebiite → AquariiOS) never changes.
- Garden Form is palette + accessories + aura + a small stat bonus on the same
  species. One base sprite per species + palette/overlay/aura = all Garden Forms.
- Roster stays 47. Breeding never creates a hybrid species.

## 2. Where it lives
- Hub: Mainframe Gardens, entered from the world map like any other location
  (same tile system as Sector 0 / The Dark Forest / Neon City — no separate engine).
- Sub-areas, all as world maps or menu screens, not 3D spaces:
  Garden (raising), Mochiko Academy (tutorials + stat training),
  Silicon Town Market (buy Data Shards / Data-Fruit seeds with CR),
  Race track, Dojo Sparring ring, Data-Fruit farm plots.

## 3. Data per creature (uses mochiichao-systems.ts, already written)
- Garden Stats, each clamped 0–99: Dive, Glide, Sprint, Might, Endurance.
  Functions exist: `applyGardenItem` (clamped), `dominantStat`, `gardenBattleBonus`
  (capped at +9% — never higher, so Garden never outscales battle training).
- Alignment from care: `alignmentFromCare` with a ±25 neutral band.
  Bright / Neutral / Umbral, shown as palette tint + aura, never as a type change
  on its own.
- Garden Form thresholds: Form I at Garden-stat total 150, Form II at 300
  (`gardenForm` in the systems file).
- Colorway: `colorwayFor` — base palette + alignment tint + rare variant.
- Type variant: ONLY when one Garden stat dominates by ≥20 points, and only a
  secondary-element shift (mapping in `mochiichao-systems.ts`:
  dive→Aqua, glide→Aero, sprint→Strike, might→Chrome, endurance→Earth),
  battle bonus still capped at the Garden +9%.
- Data Shards: Garden currency/items that feed Garden Stats (not battle XP).
- Garden Critters: ambient creatures in the Garden. Behaviour = Boids rules
  (separation / alignment / cohesion, MIT, from open-source-pulls.md) ported to
  TypeScript — no Unity code, no copied asset. Critters are scenery + a
  Data-Shard source, not catchable species.

## 4. Loops (what the player actually does)
- Raising: feed Data-Fruit, play, train at the Academy. Each action nudges
  Garden Stats and alignment; the game shows the nudge, never hides it
  (the Chao opacity problem from the developer research — needing online
  recipes to understand growth — is explicitly avoided).
- Data Cocoon: at Form thresholds, the creature enters a cocoon state for a
  set in-game time, then emerges in the new Garden Form. Cocoon is a state,
  not a species change.
- Data Rebirth: at high happiness / max Garden Form, a creature can rebirth —
  keeps Bond and colorway/parts, Garden Stats reset per `dataRevert` (halved,
  not erased), and can earn a new Garden Form path.
- Mythic Form: any species can earn it (Mythar is the template, not the only
  one). Earned, never bought, never a roster addition.
- Bonding Season / Heart Berry breeding: two creatures with high Bond produce
  an egg of one parent's species (player chooses which parent's species, or
  the game defaults to the mother's — to be confirmed with Mars before wiring).
  Egg inherits a mix of Garden Stats and a chance of a parent's colorway/parts.
  No hybrid species, no new roster ID.
- Data-Fruit farming: plant seeds in farm plots, harvest after in-game time,
  fruit feeds specific Garden Stats (fruit→stat map to be finalized with Mars;
  do not guess it in code).
- Races: Garden creatures race on the track. Scoring uses the fish-schooling
  metrics idea (polarization / spread / speed, MIT source) adapted to a
  2D race: Sprint + Glide decide speed, Endurance decides late-race fade.
- Dojo Sparring: friendly battles using the existing turn-based battle system
  with the Garden battle bonus applied. Sparring never changes species
  evolution and never awards story progress.

## 5. Screens (menu + tile world, in the existing view system)
- Garden view (world-style tile area, creatures visible as sprites + aura).
- Creature Garden detail (stats bars 0–99, alignment meter, Form, colorway, Bond).
- Farm view (plots, planted / growing / ready states).
- Race view (track + results, using existing battle-result UI patterns).
- Market / Academy menus (same ShopView pattern as Luigi Cubes / Mend Patches).

## 6. Wiring order and blockers
1. PR #9 lands (mochiichao-systems.ts in the repo).
2. Roster unify PR (canonical IDs + element decisions — Garden type variants
   must use canonical types, not roster's 15 elements).
3. Sprite manifests for Garden Forms: palette/overlay/aura definitions per
   species, reusing the base sprite — no new species art per Form.
4. Only then: Garden screens, farm, races, sparring, breeding.
- This spec is the design deliverable. No Garden code is written yet, and no
  repo file changes because of this file.
