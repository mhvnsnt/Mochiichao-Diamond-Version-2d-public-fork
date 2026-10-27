# Battle core — staged sanitized snippets (renamed identifiers, small excerpts)

Companion to battle-core-mapping-20261026.md. These are short, renamed
pseudocode excerpts distilled from the source-game battle code — NOT whole verbatim
files. All creature / species identifiers are renamed to generic creature terms;
species-locked branches are replaced by a roster-lock note. No species names, no
creature images, no logos, no literal source-game dialogue appear here.

## S1. Turn order (distilled from the source turn-order builder)

```
// Mochiichao names: Combatant, BattleAction, TurnEntry
// Precedence, in order:
//  1. A run action goes first, alone, ahead of everything else.
//  2. Use-item and switch actions go before ALL move actions (chooser order).
//  3. Move actions bubble-sort by strikes-first:
//       - higher move priority strikes first;
//       - on equal priority, higher effective speed strikes first;
//       - on equal speed, random tie-break (1 bit).
// Effective speed = base speed x weather-ability multiplier (x2 or x1)
//   x stat-stage ratio x held-item modifier (halved, or max on quick-claw roll)
//   / 4 if paralysed. Player-side badge boost (x1.1, non-link) has NO
//   Mochiichao counterpart confirmed: drop-or-map decision owed, not coded here.
// Pre-first-turn ordering uses speed only (moves ignored), fastest to slowest,
// for switch-in abilities then switch-in items.
function strikesFirst(a, b) {
  if (priority(a.move) !== priority(b.move))
    return priority(a.move) > priority(b.move) ? a : b;
  if (effectiveSpeed(a) !== effectiveSpeed(b))
    return effectiveSpeed(a) > effectiveSpeed(b) ? a : b;
  return randomBit() ? b : a;
}
```

## S2. Damage core (distilled from the source damage function + damage command)

```
// Mochiichao names: Attacker, Defender, MoveData, BattleResult
// Category: per-move category (physical uses attack/defense,
// special uses special-attack/special-defense). Gen 3 type-split kept as
// reference only; canonical confirmation owed (see mapping row 7).
function baseDamage(attacker, defender, move) {
  let atk = move.category === 'physical' ? attacker.attack : attacker.spAttack;
  let def = move.category === 'physical' ? defender.defense : defender.spDefense;
  // Stat stages applied here (crit: ignore negative attacker stages and
  // positive defender stages — see S4). Held-item type boosts, choice-type
  // boosts, and ability boosts applied here in source order.
  // ROSTER-LOCK NOTE: four source branches keyed a held-item boost to a
  // specific creature are REPLACED here by: if (rosterLockApplies(attacker,
  // move)) apply roster-locked boost — the Mochiichao roster lock is TBD.
  let power = move.power;
  if (move.effect === 'explosion-like') def = Math.floor(def / 2);
  let dmg = Math.floor(Math.floor(Math.floor((2 * attacker.level / 5 + 2)
    * power * atk / def) / 50)) + 2;
  // Crit multiplier, STAB, screens, weather, spread applied AFTER base,
  // in this order (see mapping section 6):
  //   dmg *= critMultiplier (2 or 1); if charged-up and electric-type: *= 2;
  //   if helping-hand: dmg = dmg * 15 / 10;
  //   if burn and physical and not grit-type ability: dmg /= 2;
  //   if reflect (physical) / light-screen (special) and not crit:
  //     doubles-with-2-alive ? dmg = 2 * (dmg / 3) : dmg /= 2;
  //   if spread move in doubles with 2 defenders alive: dmg /= 2;
  //   weather: rain fire /= 2, rain water *= 15/10; sun fire *= 15/10,
  //     sun water /= 2; solar-type power /= 2 in rain / sand / hail.
  // Type modulation: dmg = dmg * multiplier / 10 per defending element,
  //   multipliers 0 / 5 / 10 / 20 (x0 / x0.5 / x1 / x2); if result 0 and
  //   multiplier non-zero, result = 1. Random roll last: 85-100 inclusive.
  return dmg;
}
```

## S3. Accuracy (distilled from the source accuracy command)

```
// Order: protect check -> always-hit / semi-invulnerable handling ->
// stage ratio -> modifiers -> roll.
// Accuracy stage = attacker accuracy stage (+6..-6), minus defender evasion
//   stage, unless foresight-type state ignores evasion; clamped to -6..+6.
// Ratios (-6..+6): 33/100, 36/100, 43/100, 50/100, 60/100, 75/100, 1/1,
//   133/100, 166/100, 2/1, 233/100, 133/50, 3/1.
// Modifiers in order: thunder-type move in sun -> accuracy 50;
//   compound-eyes-type ability -> x130/100; sand-veil-type ability in
//   sandstorm -> x80/100; hustle-type ability on physical -> x80/100;
//   evasion-up held item -> x(100 - param)/100.
// Miss if (random 1..100) > computed accuracy.
```

## S4. Critical hits (distilled from the source crit command)

```
// Stage denominators (stage 0..4): 16, 8, 4, 3, 2. Crit if random % denominator == 0.
// Stage increments: focus-energy-type state +2; high-crit move effects +1
//   each; scope-type held item +1; roster-locked held-item branches +2
//   (REPLACED — see S2 roster-lock note). Stage clamped to 4.
// Multiplier: 2 on crit, else 1. Blocked by armour-type abilities and by
//   cannot-crit states. On crit, negative attacker stat stages and positive
//   defender stat stages are ignored (see S2).
```

## S5. Stat stages (distilled from the source stage-ratio table)

```
// Ratios [numerator, denominator], stage -6..+6:
//   -6: 10/40, -5: 10/35, -4: 10/30, -3: 10/25, -2: 10/20, -1: 10/15,
//    0: 10/10,
//   +1: 15/10, +2: 20/10, +3: 25/10, +4: 30/10, +5: 35/10, +6: 40/10.
// Applied as: effectiveStat = baseStat * numerator / denominator.
// Default stage 0; minimum -6; maximum +6. Applies to attack, defense,
// special attack, special defense, speed, accuracy, evasion.
```

## S6. Opponent-direction anchors (distilled from the source anchor table)

```
// Screen 240x160, y increases downward. Position order:
//   0 player-left, 1 opponent-left, 2 player-right, 3 opponent-right.
// Single battle anchors: player-left (72, 80), opponent-left (176, 40).
// Doubles anchors: player-left (32, 80), opponent-left (200, 40),
//   player-right (90, 88), opponent-right (152, 32).
// Effect Y = table Y + per-creature front/back picture Y-offset
//   (- elevation on the opposing side; +8 player-side in offset variant),
//   clamped to screen bottom. Effect X = table X.
// Opponent -> player vectors (target - attacker):
//   single: (-104, +40); doubles left: (-168, +40); doubles right: (-62, +56).
//   All opponent->player travel is leftward + downward. Angle, if needed,
//   is atan2(dy, dx) from the pair — computed, never copied from player art.
// Window ids (renamed, Gen 3 order): MSG 0, ACTION_PROMPT 1, ACTION_MENU 2,
//   MOVE_NAME_1..4 = 3..6, PP 7, MOVE_TYPE 8, PP_REMAINING 9, DUMMY 10,
//   SWITCH_PROMPT 11, LEVEL_UP_BOX 12, LEVEL_UP_BANNER 13, YESNO 14,
//   VS_PLAYER 15, VS_OPPONENT 16, VS_MULTI_1..4 = 17..20,
//   VS_OUTCOME_DRAW 21, VS_OUTCOME_LEFT 22, VS_OUTCOME_RIGHT 23, TUTORIAL 24.
```

## Sanitisation check note

Checked by the worker after writing (grep over both staged files): species-name
sample list, source-game trademark word, and creature-cry / dialogue markers all
returned 0 hits. Species-locked branches appear only as the roster-lock note above.
No whole source file is reproduced here; each snippet is a short renamed distillate.
