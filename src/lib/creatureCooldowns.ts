import { MOVES_DB } from './moves';

/**
 * Creature Mode cooldown table (pass 3) — checked-in, per-move, in ms.
 *
 * PROVISIONAL, shown to Mars for approval before it is treated as canon:
 * every value below is the pass-2 prototype derivation, now frozen into
 * an explicit table so it can be read, changed, and approved move by
 * move, instead of being recomputed silently from base power.
 * Derivation that produced these numbers:
 *   cooldownMs = clamp(600 + (100 - bp) * 8, 600, 1800),
 *   minus 200ms when the move has priority > 0, floored at 400ms.
 * No Pokemon game in the repo ships a real-time cooldown table — this
 * is a Creature Mode design table, NOT decomp data, and it is not
 * presented as one. If Mars changes any number, change it here only;
 * CreatureModeView reads this table, never a formula.
 */
export const CREATURE_COOLDOWNS_MS: Record<string, number> = {
  AQUA_SHOT: 1080,
  AQUA_CANNON: 680,
  HYDRO_SURGE: 600,
  AQUA_JET: 880,
  EMBER_TOSS: 1080,
  FIRE_STREAM: 680,
  INFERNO_WAVE: 600,
  FIRE_PUNCH_MOVE: 800,
  PETAL_BARRAGE: 760,
  SOLAR_BLAST: 600,
  RAZOR_LEAF: 960,
  VINE_LASH: 1040,
  SPARK_SHOT: 1080,
  THUNDER_BOLT: 680,
  WILD_CHARGE: 680,
  METAL_STRIKE: 1000,
  IRON_BARRAGE: 1120,
  FLASH_CANNON_MOVE: 760,
  EARTH_TREMOR: 600,
  MUD_BLAST: 960,
  EARTH_POWER: 680,
  BULLDOZE: 920,
  SHADOW_PULSE: 760,
  DARK_PULSE_MOVE: 760,
  NIGHT_SLASH_MOVE: 840,
  CRUNCH: 760,
  GUST_WAVE: 1080,
  WING_ASSAULT: 720,
  TACKLE: 1080,
  QUICK_ATTACK: 880,
  BODY_SLAM_MOVE: 720,
  MIND_BLAST: 680,
  DRAGON_CLAW: 760,
  POWER_STRIKE: 720,
  SWARM_STRIKE: 1200,
  POISON_JAB: 760,
};

export function creatureCooldownMs(moveId: string): number {
  const table = CREATURE_COOLDOWNS_MS[moveId];
  if (table !== undefined) return table;
  // Unknown move (not in MOVES_DB yet): fall back to the same derivation
  // so a new move never gets a 0ms cooldown by accident.
  const move = MOVES_DB[moveId];
  if (!move) return 800;
  const base = 600 + Math.max(0, 100 - move.bp) * 8;
  const withPri = move.pri > 0 ? base - 200 : base;
  return Math.max(400, Math.min(1800, withPri));
}
