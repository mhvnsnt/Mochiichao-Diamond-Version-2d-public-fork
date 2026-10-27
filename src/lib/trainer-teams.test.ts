// Trainer-teams wiring lock (PR C, 2026-10-27).
// Locks the resolver's match set, the row->member conversion, and the
// exact gameplay effect of wiring the 265-row trainer table into
// triggerTrainerBattle: 17 of 22 unique map trainer battles resolve
// to a row, 5 keep hand-built boss teams, and only two battles change
// at all (Lin 039->040, Cleff +035 Lv15 -- both documented in
// trainer-teams-resolver.ts). Also locks the one known drift between
// the region files and trainerTeams.ts (R1-035).
import { describe, expect, it } from 'vitest';
import {
  ALL_TRAINER_ROWS,
  resolveTrainerRow,
  rowToMapMembers,
  trainerRowDisplayName,
} from './trainer-teams-resolver';
import { TRAINER_TEAMS } from './trainerTeams';
import { SPECIES_DB } from './species';
import { createMochii } from './engine';
import { FULL_WORLD } from '../world/FullWorldMaps';

describe('trainer-teams resolver', () => {
  it('loads all 265 rows (76+53+46+43+47)', () => {
    expect(ALL_TRAINER_ROWS.length).toBe(265);
    expect(TRAINER_TEAMS.length).toBe(265);
  });

  it('resolves the 16 single-candidate NPC names to the right rows', () => {
    const cases: [string, string][] = [
      ['Youngster Jay', 'R1-001'],
      ['Lass Amy', 'R1-002'],
      ['Hiker Dan', 'R1-003'],
      ['Bug Catcher Rick', 'R1-004'],
      ['Bug Catcher Mira', 'R1-005'],
      ['Woods Walker Tess', 'R1-006'],
      ['Hacker Grunt', 'R1-007'],
      ['Miner Cleff', 'R1-010'],
      ['Cave Runner Pike', 'R1-011'],
      ['Acolyte Ken', 'R1-031'],
      ['Acolyte Ren', 'R1-032'],
      ['Acolyte Shin', 'R1-033'],
      ['Acolyte Ryu', 'R1-034'],
      ['Master Lin', 'R1-035'],
      ['Acolyte Skye', 'R1-037'],
      ['Master Falk', 'R1-038'],
    ];
    for (const [name, id] of cases) {
      expect(resolveTrainerRow(name)?.id).toBe(id);
    }
  });

  it('resolves the ambiguous Acolyte Gale only with tie-break info', () => {
    expect(resolveTrainerRow('Acolyte Gale')).toBeNull();
    expect(
      resolveTrainerRow('Acolyte Gale', [{ speciesId: '019', level: 17 }])?.id,
    ).toBe('R1-036');
    expect(resolveTrainerRow('Acolyte Gale', undefined, 500)?.id).toBe('R1-036');
    expect(
      resolveTrainerRow('Acolyte Gale', [
        { speciesId: '020', level: 75 },
        { speciesId: '019', level: 75 },
      ])?.id,
    ).toBe('R3-030');
    expect(resolveTrainerRow('Acolyte Gale', undefined, 1850)?.id).toBe('R3-030');
  });

  it('never resolves hand-built boss teams or NAME GAP rows', () => {
    for (const name of [
      'Hex',
      'Junk Warlord Krix',
      'Luigi Castagnoli',
      'Luigi',
      'Champion — MYTHAR',
      'Nobody Here',
      'Elite Four 1 — [NAME GAP] Water',
      'HQ Commander — [NAME GAP]',
    ]) {
      expect(resolveTrainerRow(name)).toBeNull();
    }
    // No [NAME GAP] row is reachable by its display name either.
    for (const row of ALL_TRAINER_ROWS) {
      if (row.name.includes('[NAME GAP]')) {
        expect(resolveTrainerRow(trainerRowDisplayName(row))).toBeNull();
      }
    }
  });

  it('converts every row team to buildable map members (trainerBattleMon rebuild condition)', () => {
    for (const row of ALL_TRAINER_ROWS) {
      const members = rowToMapMembers(row);
      expect(members).not.toBeNull();
      expect(members!.length).toBe(row.team.length);
      for (let i = 0; i < row.team.length; i++) {
        const m = members![i];
        const sp: any = (SPECIES_DB as any)[row.team[i].speciesId];
        expect(m.speciesId).toBe(row.team[i].speciesId);
        expect(m.id).toBe(row.team[i].speciesId);
        expect(m.name).toBe(sp.name); // trainerBattleMon rebuilds only on id+name match
        expect(m.level).toBe(row.team[i].level);
        expect(m.type.length).toBeGreaterThan(0);
        // The member must be rebuildable by createMochii (real stats + moves).
        const built = createMochii(row.team[i].speciesId, row.team[i].level);
        expect(built).not.toBeNull();
        expect(built!.moves.length).toBeGreaterThan(0);
      }
    }
  });

  it('region files and trainerTeams.ts agree except the known R1-035 drift', () => {
    const byId = new Map(TRAINER_TEAMS.map((r: any) => [r.id, r]));
    const drift: string[] = [];
    for (const row of ALL_TRAINER_ROWS) {
      const t: any = byId.get(row.id);
      expect(t).toBeDefined();
      const sameTeam =
        JSON.stringify(t.team) ===
        JSON.stringify(row.team.map((s) => ({ speciesId: s.speciesId, level: s.level })));
      if (!sameTeam || t.reward !== row.reward) drift.push(row.id);
    }
    // R1-035 only: region file 040 Dreadtoise (roster-wins override),
    // consolidated file 039 Shellguard. Anything else drifting fails.
    expect(drift).toEqual(['R1-035']);
  });
});

describe('trainer-teams map parity (wiring effect lock)', () => {
  type Battle = { name: string; team: [string, number][]; reward: number };
  function uniqueMapBattles(): Battle[] {
    const seen = new Map<string, Battle>();
    for (const map of Object.values(FULL_WORLD) as any[]) {
      const entries: any[] = [...(map.npcs || []), ...(map.events || [])];
      for (const e of entries) {
        const npc = e.npc ?? e;
        const team = e.battle?.team;
        if (!team?.length || !npc?.name) continue;
        const b: Battle = {
          name: npc.name,
          team: team.map((m: any) => [m.speciesId || m.id, m.level] as [string, number]),
          reward: e.battle.reward,
        };
        seen.set(JSON.stringify([b.name, b.team, b.reward]), b);
      }
    }
    return [...seen.values()];
  }

  it('wires 17 of 22 unique map trainer battles; 5 keep hand-built teams', () => {
    const battles = uniqueMapBattles();
    expect(battles.length).toBe(22);
    const matched: string[] = [];
    const unmatched: string[] = [];
    for (const b of battles) {
      const row = resolveTrainerRow(b.name, b.team.map(([s, l]) => ({ speciesId: s, level: l })), b.reward);
      if (row) matched.push(b.name);
      else unmatched.push(b.name);
    }
    expect(matched.sort()).toEqual(
      [
        'Acolyte Gale',
        'Acolyte Ken',
        'Acolyte Ren',
        'Acolyte Ryu',
        'Acolyte Shin',
        'Acolyte Skye',
        'Bug Catcher Mira',
        'Bug Catcher Rick',
        'Cave Runner Pike',
        'Hacker Grunt',
        'Hiker Dan',
        'Lass Amy',
        'Master Falk',
        'Master Lin',
        'Miner Cleff',
        'Woods Walker Tess',
        'Youngster Jay',
      ].sort(),
    );
    expect(unmatched.sort()).toEqual(
      ['Champion — MYTHAR', 'Hex', 'Junk Warlord Krix', 'Luigi', 'Luigi Castagnoli'].sort(),
    );
  });

  it('row teams equal inline map teams except Lin and Cleff; rewards always equal', () => {
    const battles = uniqueMapBattles();
    const diffs: string[] = [];
    for (const b of battles) {
      const row = resolveTrainerRow(b.name, b.team.map(([s, l]) => ({ speciesId: s, level: l })), b.reward);
      if (!row) continue;
      expect(row.reward).toBe(b.reward);
      const rowTeam = row.team.map((s) => [s.speciesId, s.level]);
      if (JSON.stringify(rowTeam) !== JSON.stringify(b.team)) diffs.push(b.name);
    }
    // Lin: 039 Shellguard -> 040 Dreadtoise (roster-wins override).
    // Cleff: row adds 035 Pebblefist Lv15 ahead of the map's lone Tyrage.
    expect(diffs.sort()).toEqual(['Master Lin', 'Miner Cleff']);
  });
});
