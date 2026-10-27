// Learnsets loader -- WIRED LIVE 2026-10-27 (wiring lane, PR D).
// The level-up learnsets in src/lib/generated/mochiichao_learnsets.json
// (47 species: 001-046 + 331, 5-10 moves each) are now the moves a
// creature actually learns, via getSpeciesLearnset. Before this,
// createMochii/gainExp/evolveInstance read only the inline
// species.ts learnsets (BASIC_MOVES + 0-3 extras), so most of the
// pulled learnset data sat unused.
//
// MERGE RULE: JSON level list wins, plus any inline species.ts move
// NOT in the JSON list, kept at its inline level, sorted by level.
// Nine species have exactly one such inline extra each (locked by
// src/lib/learnsets-live.test.ts): 001 AQUA_JET@15, 002
// POWER_STRIKE@16, 004 AQUA_SHOT@15, 006 DRAGON_CLAW@30, 007
// BULLDOZE@14, 008 EARTH_POWER@20, 009 SHADOW_PULSE@34, 010
// FIRE_STREAM@14, 039 SOLAR_BLAST@32. Dropping them would silently
// change those species' movesets; the merge keeps them.
// Species absent from the JSON (147, 148) fall back to the inline
// list unchanged.
//
// SCOPE: level-up lists only. The JSON also carries tm/tutor/egg
// lists per species and a 20-TM catalogue, but no TM/tutor/egg
// system exists in the game code yet (the JSON meta says the same
// for HMs), so those have no consumer in this PR -- a later lane
// wires them when the systems exist. Every JSON moveId (96 across
// level/tm/tutor/egg) already resolves in MOVES_DB (121 moves,
// post-PR A), so nothing here can produce a broken move.
import learnsetsJson from './generated/mochiichao_learnsets.json';
import { SPECIES_DB } from './species';

export type LearnsetEntry = { level: number; moveId: string };

const JSON_SPECIES = (learnsetsJson as any).species as Record<
  string,
  { level: LearnsetEntry[] }
>;

/** Species ids the JSON covers (47: 001-046 + 331). */
export const LEARNSET_JSON_SPECIES: string[] = Object.keys(JSON_SPECIES);

/**
 * Effective level-up learnset for a species: the JSON level list,
 * plus any inline species.ts move the JSON lacks (kept at its inline
 * level), sorted by level. Falls back to the inline list when the
 * species is not in the JSON.
 */
export function getSpeciesLearnset(speciesId: string): LearnsetEntry[] {
  const sp: any = (SPECIES_DB as any)[speciesId];
  const inline: LearnsetEntry[] = sp?.learnset ?? [];
  const json = JSON_SPECIES[speciesId]?.level;
  if (!json) return inline;
  const seen = new Set(json.map((m) => m.moveId));
  const extras = inline.filter((m) => !seen.has(m.moveId));
  return [...json, ...extras].sort((a, b) => a.level - b.level);
}
