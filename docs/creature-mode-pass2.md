# Creature Mode — pass 2 (this lane)

Pass 1 was a tile-step structure with a training dummy and damage = bp/2.
Pass 2 replaces that with a real-time loop on the same Sector 0 map, the
same save/party, and the same PixiJS world canvas as Trainer Mode.

## Pokemon-first mapping

Pokemon element -> Mochiichao replacement in that exact spot -> status:
- FireRed/HeartGold overworld tile movement + collision (blocked 1/4/2)
  -> Creature Mode tile movement on FULL_WORLD sector0 -> HAVE
- FireRed battle damage (STAB 1.5, type multiplier, crit 1.5 at 6%,
  random 85-100, level/power/attack/defence base)
  -> creatureDamage() in CreatureModeView, same structure -> HAVE
- FireRed/HeartGold catch math (catchRate * hpFactor / 255,
  hpFactor = (3*max-2*hp)/(3*max), BattleView adds +0.3)
  -> Luigi Cube capture here, same math -> HAVE
- HeartGold/FireRed level/XP (engine.gainExp, baseExpYield)
  -> defeat XP here, same gainExp -> HAVE
- No Pokemon game in the repo has real-time play-as-creature combat,
  dodge i-frames, or Boids flocking -> those are design choices, labelled
  below, NOT decomp data -> NEED (canonical table / walk sprites)

## What pass 2 actually does

- Held-key movement: 100ms tick, walk step every 2 ticks, sprint step
  every tick. Sprint (Shift): stamina 0-100, drains 8/s, refills 12/s.
- Per-move cooldowns: cooldownMs = clamp(600 + (100-bp)*8, 600, 1800),
  -200ms if priority > 0. Prototype derivation from MOVES_DB, NOT a
  canonical cooldown table — that table is owed in the unify map.
- Dodge (Space): exactly 250ms i-frames. Perfect Dodge: a wild attack
  landing while dodging deals 0 and refunds 50% of remaining cooldowns.
- Q hop: blocked facing tile + walkable tile beyond it = hop over it
  (400ms hop state). Prototype rule, does not cross the map border.
- Tag-switch (Tab): 2000ms switch cooldown.
- Wilds: 5 wilds, built with createMochii() (canonical stats/HP):
  skittish Mochii, territorial Razorgater, pack Tyrage x2, curious
  Kittember. Temperament AI every 900ms. Pack uses Boids-style
  cohesion/separation simplified to tile steps (full Boids flocking
  with continuous vectors is a later pass, not faked here).
- Wild attacks: telegraphed 600ms before impact (red ring in-world),
  so dodges can be timed. Player HP is written back to the shared
  party via updatePartyMember — no separate Creature Mode HP pool.
- Wilds render in-world via PixiWorldCanvas `wilds` prop (optional,
  empty everywhere else), using the same sheet/fallback drawing as
  the player creature.
- Data Tape Transform and Guardian Training UI from pass 1 are kept
  unchanged in this pass.

## Lane 100% checklist (counted, not claimed)

Creature Mode lane items, 23 total. Done in pass 2 or earlier:
1. Mode entry from App (CREATURE view) — done pass 1
2. Same map / same save / same party — done pass 1
3. Tile movement + collision — done pass 1, held-key in pass 2
4. Sprint + stamina — done pass 2
5. Per-move cooldowns (prototype derivation) — done pass 2
6. Dodge 250ms i-frames — done pass 2
7. Perfect Dodge refund — done pass 2
8. Q hop — done pass 2
9. Tag-switch + cooldown — done pass 2 (cooldown added pass 2)
10. Wild creatures with HP — done pass 2
11. Temperament AI (4 types) — done pass 2
12. Canonical damage formula — done pass 2
13. Luigi Cube capture (same math) — done pass 2
14. XP + level via gainExp — done pass 2
15. Wilds rendered in-world — done pass 2
16. Data Tape Transform UI — done pass 1 (local switch)
17. Guardian Training UI — done pass 1 (local assign)

The remaining owed items are:
18. Smooth pixel movement (not tile steps) — 0%, owed
19. Top-down walk sprites (sprite lane production) — 0% in this lane,
    fallback/sheet front frames used for now
20. Canonical cooldown table (unify map) — 0%, prototype derivation
    used for now
21. Easystar A* wild pathfinding (maze maps) — 0%, simple step AI used
22. GardenStats sharing for the +9% bonus (bonus is 0 here, not faked,
    not stacked) — 0%, owed
23. Guardian persistence (currently local state only) — 0%, owed

Corrected total: 17 done / 23 = 74% of the counted lane checklist.
The 6 owed items above are the gap to 100%. No 100% claim is made
until those 6 pass with build + playtest. Research pulls wired in
pass 2: Boids (simplified, tile-step), Pokemon damage/catch/XP
structure from the repo files. Research NOT wired / NOT faked:
easystar A*, full continuous Boids, Vitest damage tests, Pixi
AnimatedSprite walk cycles (sprite lane).

## How to playtest pass 2

1. Start, pick a starter, enter Creature Mode from the world menu.
2. Hold WASD — movement should step continuously; hold Shift to
   sprint until stamina hits 0, then walk only until it refills.
3. Walk to the territorial Razorgater, wait for the red telegraph
   ring, press Space during it — Perfect Dodge should refund half
   your cooldowns and deal 0 damage.
4. Attack with 1-4 within distance 2 — damage should vary with
   STAB/type/crit/roll, not be bp/2. Defeat a wild — EXP and level
   should update on the party creature.
5. Weaken a wild to 30% HP or less, press Catch — a Luigi Cube is
   consumed and the Trainer Mode catch chance applies.
