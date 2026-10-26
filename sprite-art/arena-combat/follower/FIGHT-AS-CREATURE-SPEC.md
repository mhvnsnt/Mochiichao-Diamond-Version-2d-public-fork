# Fight-as-creature spec — player controls the creature in overworld encounters (HANDOFF)

Status: SPEC ONLY, no code. NOT wired into battle, the overworld, or
any encounter trigger. Wiring owners: the Step 3 overworld agent (entry
/ exit / overworld movement) and the Creature Mode lane (real-time
combat). This is the Ranger-type system Mars DID want (2026-10-25
~19:45 CDT): fight AS a creature, with followers walking alongside —
not the capture loop, which is a separate gated system
(see `../ring-capture-zone-spec.md`).

## 1. The mode in one paragraph

In an overworld encounter, instead of the human trainer issuing orders
from a menu, control passes to one party creature: the player moves
that creature directly in the encounter space and fires that
creature's own moves. When the encounter ends (win, loss, or flee),
control returns to the human trainer in the overworld, with the party
exactly as the encounter left it (HP, status, XP as the battle rules
say — this spec does not invent battle rewards).

## 2. Entry and exit (for the overworld agent)

- **Entry trigger:** an overworld encounter the player enters with a
  creature selected as the active fighter (default: party slot 1;
  the player may pick another party member before entry, never
  mid-encounter unless the battle rules allow a switch).
- **Entry handoff:** the overworld agent passes the active creature's
  full battle record — species, level, HP, status, and its move list —
  to the encounter. The encounter never re-derives moves from a
  species table alone: the creature's own learned moves are the
  moveset, full stop.
- **Exit conditions:** wild creature faints / is captured (Luigi Cube
  or gated ring capture — capture choice is the capture system's job,
  not this mode's), active creature faints, player flees (if the
  encounter allows fleeing). On exit, control returns to the trainer
  and followers resume trail positions behind the player
  (see `FOLLOWER-SPEC.md`).
- **What does NOT happen on entry:** the trainer sprite does not
  fight, does not take damage, and does not issue orders. Trainer
  presence is visual only (standing at the encounter edge, if staged).

## 3. Moves — real move data, standing scope rule

- The creature fights with its OWN moves, drawn from the REAL move
  data already extracted in the repo (FireRed / HeartGold / Black 2
  extraction batches on main). Per Mars's standing scope rule, moves
  and animations come in 100%: move names, power, accuracy, effects,
  and animation data are kept real.
- The ONLY exclusions, per the same rule: Pokemon creature names,
  sounds, art, and dialogue. Move data passes through the
  creature-name remap (a move belongs to the Mochiichao creature
  using it; no franchise creature name may appear as the user of a
  move in UI text).
- Move slots: the encounter shows the creature's learned moves
  (up to 4 in a turn-based framing; the Creature Mode lane decides
  the real-time mapping — cooldowns, buttons, or both — and this spec
  does not pre-decide it).
- A creature with no usable moves (all out of PP, or none learned)
  falls back to the battle system's struggle-equivalent; this spec
  does not invent a new fallback move.

## 4. Control mapping (for the Creature Mode lane to refine)

- Movement: the same directional input that walks the trainer walks
  the creature in the encounter space.
- Moves: one input per move slot (turn-based: pick, then resolve;
  real-time: fire on press, subject to the lane's cooldown rules).
- Targeting: the wild/opposing creature is the only target in a wild
  encounter; trainer encounters add the opposing party per battle
  rules. No friendly-fire targeting of followers — followers are not
  in the encounter unless the battle rules stage them.
- Camera: follows the player-controlled creature, not the trainer.

## 5. What is NOT in this spec (separate work)

- Real-time combat timing, hitboxes, and dodge/attack resolution —
  Creature Mode lane owns those (arena combat modules already on main
  are the starting point, not the finished system).
- Overworld encounter spawning, rates, and terrain rules — overworld
  agent owns those.
- Capture UI during a fight-as-creature encounter — capture systems
  own their own UI; this mode only guarantees the encounter can hand
  off to them on the player's choice.
