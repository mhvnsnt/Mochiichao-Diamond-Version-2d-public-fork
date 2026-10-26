# Creature Mode pass 4 — fan / mod pulls, mechanics only

Pass 3 was 23/23 = 100% for Creature Mode code. Pass 4 does not reopen
that count — it adds three mechanics pulled from fan / mod files
already in the repo, without copying any franchise file, ROM, patch,
art, music, or code wholesale. This follows the mod-layer architecture
in the goal files: Mochiichao code is the mod layer on top of the base
game; decomp and fan files are reference / mechanics sources only.

## Files changed (0 files deleted)

- `src/components/views/CreatureModeView.tsx` only (79 insertions, 10 deletions).
- `docs/creature-mode-pass4.md` — this file.

## What was pulled, and from where

1. **Hitstop 90 ms, HP drains after hitstop.**
   Source: `sprite-art/arena-combat/ARENA-COMBAT-SPEC.md` —
   treatment beats 250/90/300/400 ms, hitstop 90 ms default; and
   `FAN-MECHANICS-SUMMARY.md` — hitstop 20 ms + damage scaling,
   capped 90 ms. Wiring: on a damaging hit, the 50 ms movement tick
   skips while `Date.now() < hitstopUntil` (world freeze), and the
   wild's HP / defeat / XP are applied in a 90 ms timeout, not
   instantly. Damage 0 (miss / status) gets no hitstop. This matches
   the arena Step 2 demo invariant: HP drains AFTER hitstop.
2. **Tag-team pack engagement (5 s).**
   Source: pull-list #19, Pokemon Battle Advanced (The Daigan) —
   real-time battles, tag-team wild fights, documented as a design
   note only, no fan game file downloaded or copied. Wiring:
   attacking a pack wild engages its packmates within 4 tiles for
   5 s; an engaged packmate paths to the player (easystar, pass 3)
   even outside its normal range, instead of standing by.
3. **Territorial strafe.**
   Source: `FAN-MECHANICS-SUMMARY.md` — AI movement: timed strafe,
   lateral threat dodges. Wiring: a territorial wild at distance
   2–3 steps sideways 30% of AI ticks instead of always charging
   straight in. It still engages and attacks at distance 1.

## Deliberately NOT wired, with reasons (not hidden)

- Dash-pool 200 ms invulnerability (fanMechanics): Creature Mode
  dodge is already 250 ms i-frames from pass 2. Changing it would
  break the timed Perfect Dodge feel, not improve it.
- Speed compression 1.6–2.3 u/s (fanMechanics): those are arena
  units, not world tiles. Mapping them straight over would slow
  world movement from 4 tiles/s to under 2 tiles/s — a regression.
- Softened type steps (immune 0.33, resist 0.75, etc.): Creature
  Mode uses the canonical Trainer Mode type multiplier, not a
  second damage table. Adding softened steps would be exactly the
  second-table mistake pass 2 removed.
- Mystery Dungeon dungeon mode, Ranger loop capture, Pokken
  Field/Duel camera switch, Arena 2D deforming terrain: all are
  separate modes / systems in the pull-list, not Creature Mode
  tweaks, and none of them were downloaded as files. They stay as
  separate future work, not faked here.

## Guardrails kept

- No ROM dumps, no base-ROM patches, no official art/music/code,
  no leaked files, no pret code vendored wholesale — all per the
  modding-pulls inventory in the goal files. The only new
  dependency in pass 3 was easystarjs (MIT, npm); pass 4 adds none.
- No other lane's files touched. Base for this pass is main
  c34e5f80, which already contains pass 3 (PR #72).
- Cooldown table remains provisional (shown to Mars, not canon).
  Walk-art sheets remain sprite-lane production.

## Playtest (pass 4)

1. Hit a wild — the world pauses a beat, then HP drops (not instantly).
2. Attack one Tyrage in a pack — its packmate within 4 tiles starts
   pathing to you even if it was out of its normal range.
3. Stand 2–3 tiles from a territorial Razorgater — sometimes it
   sidesteps instead of charging straight at you.
