# Mochiichao proprietary systems — design + wiring

This is Mochiichao's own version, built from reference systems, not a copy
of anyone else's game, art, music, or code. Reference names are used here
only to say where an idea came from. In the game itself, everything uses
Mochiichao names.

Terminology correction (voice dictation, 2026-10-25): it is **Chao**,
not "child" — Chao Garden, Chao World. Mochiichao, not "Mochi child".
Kaggle, not "Calgo".

## Naming map (reference → Mochiichao)

- Pokemon-style capture/battle/roster → Trainer Mode (existing spine)
- Link Cable trading → **Mochi Link** — peer-to-peer trade between two
  players, with trade-triggered evolution preserved as a Mochiichao method
- Pokemon Ranger capture (human + Styler, circling) → **Ring Capture**
  — a Mochiichao capture loop, not a Pokemon Ranger copy
- Chao Garden / Chao World (Sonic Adventure) → **Mochi Garden** /
  **Mainframe Gardens** — raising, stats, alignment, breeding, farming
- Digimon branching evolution / de-digivolution → **Branch Evolution**
  / **Data Revert** — branch by bond, care, and stats; revert keeps
  part of what was earned
- Digimon Burst / temporary power form → **Burst Form** (already in
  Chao Garden conversion: +30% for 3 turns)

## What is wired in, and from what

Existing generated data (already on main via PR #7 and PR #8, neutral
JSON, not Mochiichao canon yet):
- FireRed: 386 species, 354 moves, 4,052 level-up learnsets, 184
  evolutions, 8,927 TM/HM, 2,388 tutor
- HeartGold: 507 species, 247 evolutions, 738 trainers / 1,776 party
- Black 2: 652 species, 560 moves, level 9,604 / TM/HM 20,604 /
  tutor 7,117 / egg 2,773, 321 evolutions

Wiring rule: decomp data is a **reference library for shapes** —
stat ranges, move power/accuracy/PP shapes, learnset curves,
evolution method shapes. It is NOT pasted in as the Mochiichao roster.
Mochiichao IDs are the roster's own IDs (001–047 in global_roster.json),
never National Dex numbers. Species evolution methods are preserved
exactly in the reference JSON (LEVEL, ITEM, TRADE, FRIENDSHIP, etc.);
in Mochiichao UI they display as Level, Data Shard, Mochi Link,
Bond, etc. — the method is not converted to a different method.

## Mochi Garden — growth variations (the Chao part)

Base (from chao-garden-conversion.md): Garden Stats Dive / Glide /
Sprint / Might / Endurance, Data Shards, Garden Critters, Bright /
Neutral / Umbral alignment, Data Cocoon Garden Form I / II (palette +
accessories + aura, NOT a species change), Data Rebirth, Mythic Form,
Bonding Season / Heart Berry breeding, Mainframe Gardens, Mochiko
Academy, Market, Races, Dojo Sparring, Data-Fruit farming.

Variations added here:
- **Parts:** ears, wings, tails, horns, fins, antennae as overlays
  earned from Garden Critters / Data-Fruit. Parts change the look and
  give a small Garden-stat nudge, never a new species.
- **Colorways:** base palette + alignment tint + a rare Shiny-style
  variant palette. Colorway is derived from species + Garden stats +
  alignment, so the same species can look different in different
  gardens. A colorway never changes type on its own.
- **Type variants:** a secondary element shift, only when one Garden
  stat clearly dominates (e.g. Dive-dominant → Aqua secondary).
  One variant slot per creature, battle bonus capped at the Garden
  cap (+9% from the Garden conversion), so a variant is flavour +
  small bonus, not a power creep loop.
- **Growth drift:** wings / colour drift gradually as Garden stats
  rise, before the Data Cocoon — the player can see where a creature
  is heading in-game, instead of needing an outside recipe list.
  That opacity was Chao's usability cost; Mochiichao shows influence
  in-game.

## Ring Capture (the Ranger part)

- Not play-as-creature, not a battle. The player draws rings around
  a wild creature with the Styler-equivalent (Mochi Ring).
- Loops add capture score; breaks (creature attacks the ring) subtract
  it; friendliness / Bond already earned raises the score per loop.
- Capture chance = loops × friendliness × species catch-rate shape
  (from decomp catch_rate, used as a shape, not a copied creature).
- A failed capture does not kill or harm the creature; it breaks
  the ring and the creature stays wild.

## Mochi Link (the trading part)

- Two players, two creatures, one trade. Validation: both creatures
  exist, neither is a duplicate ID in the receiving save, levels and
  held Data Shards are preserved.
- Trade-triggered evolution fires on receipt, exactly like the
  reference TRADE / TRADE_ITEM methods — the item, if any, is a
  Mochiichao Data Shard, not a copied item.
- A traded creature keeps its Garden history (stats, colorway,
  parts) — trading does not reset raising.

## Branch Evolution + Data Revert (the Digimon part)

- Evolution is not always one straight line. Candidates are scored
  by: Bond level, care history (mistakes / training), Garden stats,
  and time of day / season where the reference method says so.
- The highest-scoring valid branch wins; ties are shown to the
  player, not hidden.
- Data Revert (de-evolution): a creature can revert one stage and
  keeps a percentage of earned Garden stats and its colorway/parts.
  Reverting does not erase Bond.

## Open-source / experimental / academic pull-ins (legal only)

Already vendored or listed (pull-list-50-part2/part3, tools/README):
rot.js, FastNoiseLite, WFC, DSDecmp, ndstool — plus, for this system
specifically, to be evaluated in the Chao Garden lane before wiring:
- Open-source virtual-pet / A-Life projects (genetic stat tuning
  from the start, so creatures do not collapse to one type)
- Academic artificial-life / Boids / co-evolution work for Garden
  Critter behaviour
- Procedural palette / modular sprite-part systems for colorways
  and parts (shared palette, modular parts, as in Cassette Beasts'
  public pipeline)

No official Pokemon, Digimon, or Sonic art, music, code, or ROM data
is pulled in. Reference data is the decomp JSON already extracted,
plus public interviews / GDC / published design coverage.

## Implementation file

`src/lib/mochiichao-systems.ts` in the work clone implements the
pure logic for this doc: Garden stats, alignment, Garden Form,
colorway, type variant, Ring Capture chance, Mochi Link validation,
Branch Evolution scoring, and Data Revert. It imports nothing from
the game and makes no network calls, so it can be unit-tested and
wired into Trainer Mode, Garden Mode, and Creature Mode one at a time.
