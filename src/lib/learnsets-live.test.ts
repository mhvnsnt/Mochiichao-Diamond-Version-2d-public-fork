// Learnsets wiring lock (PR D, 2026-10-27).
// Locks that the JSON level-up learnsets (47 species) are the moves
// creatures actually learn, that every JSON moveId resolves in
// MOVES_DB, and that the nine inline-only extras survive the merge.
import { describe, expect, it } from 'vitest';
import learnsetsJson from './generated/mochiichao_learnsets.json';
import { getSpeciesLearnset, LEARNSET_JSON_SPECIES } from './learnsets-loader';
import { SPECIES_DB } from './species';
import { MOVES_DB } from './moves';
import { createMochii, evolveInstance } from './engine';

const JSON_SPECIES = (learnsetsJson as any).species as Record<
  string,
  { level: { level: number; moveId: string }[]; tm: string[]; tutor: string[]; egg: string[] }
>;

describe('learnsets loader', () => {
  it('covers 001-046 + 331 (47 species)', () => {
    const expected = [...Array.from({ length: 46 }, (_, i) => String(i + 1).padStart(3, '0')), '331'];
    expect([...LEARNSET_JSON_SPECIES].sort()).toEqual(expected);
  });

  it('every JSON moveId (level/tm/tutor/egg) resolves in MOVES_DB', () => {
    const ids = new Set<string>();
    for (const e of Object.values(JSON_SPECIES)) {
      for (const m of e.level) ids.add(m.moveId);
      for (const m of e.tutor) ids.add(m);
      for (const m of e.egg) ids.add(m);
    }
    for (const tm of Object.values((learnsetsJson as any).tmCatalogue)) ids.add(tm as string);
    expect(ids.size).toBe(96);
    for (const id of ids) {
      expect((MOVES_DB as any)[id], `move ${id} must exist in MOVES_DB`).toBeDefined();
    }
  });

  it('merged list is the JSON level list plus the nine known inline extras, sorted, deduped', () => {
    const extras: Record<string, [number, string]> = {
      '001': [15, 'AQUA_JET'],
      '002': [16, 'POWER_STRIKE'],
      '004': [15, 'AQUA_SHOT'],
      '006': [30, 'DRAGON_CLAW'],
      '007': [14, 'BULLDOZE'],
      '008': [20, 'EARTH_POWER'],
      '009': [34, 'SHADOW_PULSE'],
      '010': [14, 'FIRE_STREAM'],
      '039': [32, 'SOLAR_BLAST'],
    };
    for (const sid of LEARNSET_JSON_SPECIES) {
      const merged = getSpeciesLearnset(sid);
      const json = JSON_SPECIES[sid].level;
      // Starts with the BASIC pair, sorted by level, no duplicate moveIds.
      expect(merged[0]).toEqual({ level: 1, moveId: 'TACKLE' });
      expect(merged[1]).toEqual({ level: 5, moveId: 'QUICK_ATTACK' });
      for (let i = 1; i < merged.length; i++) {
        expect(merged[i].level).toBeGreaterThanOrEqual(merged[i - 1].level);
      }
      expect(new Set(merged.map((m) => m.moveId)).size).toBe(merged.length);
      // Every JSON move present, every inline move present.
      const inline: { level: number; moveId: string }[] = (SPECIES_DB as any)[sid].learnset;
      const allInline = new Set([...inline.map((m) => m.moveId), ...json.map((m) => m.moveId)]);
      expect(new Set(merged.map((m) => m.moveId))).toEqual(allInline);
      // The known extra for this species, if any, at its inline level.
      if (extras[sid]) {
        expect(merged).toContainEqual({ level: extras[sid][0], moveId: extras[sid][1] });
      }
    }
    // Exactly nine species carry an inline extra the JSON lacks.
    const extraSpecies = Object.keys(extras);
    expect(extraSpecies.length).toBe(9);
    for (const sid of LEARNSET_JSON_SPECIES) {
      const jsonIds = new Set(JSON_SPECIES[sid].level.map((m) => m.moveId));
      const inlineIds = new Set(
        ((SPECIES_DB as any)[sid].learnset as { moveId: string }[]).map((m) => m.moveId),
      );
      const missing = [...inlineIds].filter((m) => !jsonIds.has(m));
      if (extraSpecies.includes(sid)) expect(missing).toEqual([extras[sid][1]]);
      else expect(missing).toEqual([]);
    }
  });

  it('species absent from the JSON (147, 148) fall back to the inline list', () => {
    for (const sid of ['147', '148']) {
      expect(getSpeciesLearnset(sid)).toEqual((SPECIES_DB as any)[sid].learnset);
    }
  });

  it('createMochii learns from the merged list with real pp', () => {
    const m = createMochii('001', 18)!;
    // Mochii Lv18 merged: TACKLE 1, QUICK_ATTACK 5, AQUA_SHOT 8,
    // TIDE_SHOT 13, AQUA_JET 15, BUBBLE_BURST 18 -> last 4.
    expect(m.moves).toEqual(['AQUA_SHOT', 'TIDE_SHOT', 'AQUA_JET', 'BUBBLE_BURST']);
    expect(m.pp).toEqual(m.moves.map((id) => (MOVES_DB as any)[id].pp));
    // A low-level creature still gets the BASIC pair only.
    expect(createMochii('001', 5)!.moves).toEqual(['TACKLE', 'QUICK_ATTACK']);
  });

  it('evolveInstance relearns from the merged target list', () => {
    const inst = createMochii('038', 18)!;
    expect(evolveInstance(inst, '039')).toBe(true);
    // Shellguard Lv18 merged: TACKLE 1, QUICK_ATTACK 5, VINE_LASH 6,
    // LEAF_WHIP 12, RAZOR_LEAF 18 -> last 4. (The inline
    // METAL_STRIKE@18 is deduped: the JSON has METAL_STRIKE@24, and
    // the JSON level wins, so it is learned at 24, not 18.)
    expect(inst.moves).toEqual(['QUICK_ATTACK', 'VINE_LASH', 'LEAF_WHIP', 'RAZOR_LEAF']);
    expect(inst.pp).toEqual(inst.moves.map((id) => (MOVES_DB as any)[id].pp));
  });
});
