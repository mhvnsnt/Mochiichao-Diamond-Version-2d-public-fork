# World Wiring 2 — battle-math, just how Pokemon does it, across all gens we actually have

Scope correction, plain: the fresh-start REPO holds
3 decomp submodules — FireRed (Gen 3), HeartGold
(Gen 4), Black 2 (Gen 5). The WORKSPACE decomps/
folder holds 5 generations in total — Gen 1
(pokered/pokeyellow), Gen 2 (pokegold/pokecrystal),
Gen 3 (pokeruby/pokeemerald/pokefirered), Gen 4
(pokediamond/pokeplatinum/pokeheartgold), Gen 5
(pokebw2). No generation beyond what is present
here is claimed, and no source is invented.

Counts measured on disk, 2026-10-26:
- Gen 1: pokeyellow 2,088 asm files, pokegold 1,893,
  pokecrystal 2,463 (assembly, not C — battle is
  in assembly routines, same step order).
- Gen 3: pokeemerald 62 battle*.c files, firered
  49 battle*.c files, ruby 352 src .c files total.
- Gen 5: pokebw2 res/pokemon/ 657 dirs (652 species
  + pokestar/shared, already extracted 2026-10-25),
  battle as overlay modules (ov167 battle_action /
  battle_condition / battle_event, ov012 event_battle,
  etc.), NOT a single battle_util.c. pokebw2 is
  GPL-3.0 — its code is NOT vendored into this repo.
- Mod community files used as structure only:
  PKHeX / pkNX (GPL-3.0, data shapes only, no code
  vendored), Tiled, Ink/inkjs, easystarjs, WFC.
  No GPL code is in this PR.

What this PR wires, and what it does NOT:
- WIRED (new files, zero new dependencies):
  src/lib/wiring/battle-math.ts — pure module with
  accuracy, priority, speed order (with stat stages),
  damage (Gen 3+ formula shape, STAB 1.5, type,
  crit 1.5, random 85-100%), crit rates (1/24 base,
  1/8 HIGH_CRIT, documented as modern), effect
  rolls (BURN, POISON, PARALYSIS, FLINCH, stat downs,
  RECOIL_25, MULTI_HIT 2-5, CHARGE_TURN, HIGH_CRIT),
  recoil, and multi-hit count. RNG is injected, so
  tests are deterministic.
  tests/battle-math.test.ts — accuracy miss/hit,
  priority beats speed, speed order, STAB +
  super-effective, status moves deal 0, crit rates,
  burn chance, recoil 25%, multi-hit 2 and 5.
- NOT wired yet (call-site swap, next PR):
  BattleView does NOT yet call battle-math.ts —
  it still uses its own executeDamage. This PR
  proves the module, it does not claim BattleView
  is fixed. The swap is: BattleView accuracy →
  accuracyHits, turn order → orderTurns, damage →
  calcDamage with constants.ts as the type chart,
  effects → rollEffect. That swap must be done
  with the v5.3 / current BattleView on live main,
  not with the stale clone's BattleView.
- NOT copied: no decomp code, no Pokemon move
  data, no creature data, no dialogue, no town
  names, no art, no sounds, no logos. Moves in
  tests are generic (WATER vs FLAME, 40 BP) and
  species are generic battlers, not Pokemon.

How each gen does battle, in one line each:
- Gen 1/2: damage + accuracy + speed, no abilities,
  no physical/special split.
- Gen 3: accuracy / priority / speed / type / STAB /
  crit / random / effect, as separate steps in
  battle_util + battle_ai_script_commands.
- Gen 4: same steps, plus physical/special split
  by move category (which Mochiichao's MOVES_DB
  already uses: cat Physical/Special/Status).
- Gen 5: same steps, battle as overlay modules,
  more conditions, same bracket order.

Deletions: NONE. This PR adds 3 files only and
does NOT touch package.json (tests need vitest
from PR #61, which is still open — the module
itself has zero dependencies and merges cleanly
on its own; the tests run once PR #61 lands).
