// Trainer-team resolver -- WIRED LIVE 2026-10-27 (wiring lane, PR C).
// Resolves a map NPC to its row in the 265-row trainer table
// (trainers-region1..5.ts, the structured source: trainerClass + name
// + location + status + team + reward) and converts the row's team
// into the map-member shape trainerBattleMon (WorldEngine) expects.
// WorldEngine's triggerTrainerBattle calls this; when it returns a
// row, the row's team + reward are the battle's, not the inline
// placeholder team in FullWorldMaps.ts.
//
// SOURCE CHOICE: the region files, not trainerTeams.ts (#297). The
// consolidated file flattened trainerClass/name/status into one
// display string and dropped the status for 255 of 265 rows; the
// region files keep all three fields. The two files agree on team +
// reward for 264 of 265 rows -- the one drift is R1-035 (see below)
// and is locked by src/lib/trainer-teams.test.ts.
//
// KNOWN DATA EFFECTS (row wins over the inline map team):
// - R1-035 Master Lin: row says 040 Dreadtoise Lv14; the map and
//   trainerTeams.ts say 039 Shellguard Lv14. The region file carries
//   an explicit note ("spec 039 overridden to 040 per roster-wins
//   reconciliation (Lin's Dreadtoise)"), so this PR takes the region
//   file. If the override is wrong, Lin's team is the one line to fix.
// - R1-010 Miner Cleff: row adds 035 Pebblefist Lv15 ahead of the
//   map's single 007 Tyrage Lv16 (the map team was a placeholder).
// - Five matched rows are still marked NEW in the region files
//   (Mira R1-005, Tess R1-006, Cleff R1-010, Pike R1-011, Skye
//   R1-037) because their NPCs were placed in the maps after the
//   status was written. Status is stale, not blocking; the resolver
//   ignores status and matches by name. The data lane can re-mark
//   them KEEP.
// - AI profiles (Novice/Balanced/Type-aware/Defensive/Aggressive/
//   Elite) are NOT consumed yet: enemy move choice in battle is
//   still random. Wiring AI is a separate, bigger task.
//
// TYPE RULE (cosmetic only -- the battle HUD reads enemy.type for
// its color/label; damage uses SPECIES_DB types, not this field):
// mirrors WorldEngine's TYPE_DISPLAY (hexTeamMember rule) for the
// five covered elements, title-cased raw element id otherwise
// (BUG -> Bug, ROCK -> Rock). Known gap: species type FLYING maps
// to "Flying" here, but the map data writes "Aero" for the same
// species (6 members) -- the HUD color falls back to #888 for those
// either way today (one inline member already says "Flying").
// Settling FLYING -> Aero belongs to a display-name pass, not this PR.
import { TRAINERS_REGION_1, type TrainerTeam } from './trainers-region1';
import { TRAINERS_REGION_2 } from './trainers-region2';
import { TRAINERS_REGION_3 } from './trainers-region3';
import { TRAINERS_REGION_4 } from './trainers-region4';
import { TRAINERS_REGION_5 } from './trainers-region5';
import { SPECIES_DB } from './species';

export type { TrainerTeam };

export const ALL_TRAINER_ROWS: TrainerTeam[] = [
  ...TRAINERS_REGION_1,
  ...TRAINERS_REGION_2,
  ...TRAINERS_REGION_3,
  ...TRAINERS_REGION_4,
  ...TRAINERS_REGION_5,
];

export const TRAINER_ROW_COUNT = ALL_TRAINER_ROWS.length; // 265

/** Display name of a row the way map NPCs write it: "Youngster Jay", or the class alone when the row has no personal name ("Hacker Grunt"). */
export function trainerRowDisplayName(row: TrainerTeam): string {
  return row.name ? `${row.trainerClass} ${row.name}` : row.trainerClass;
}

function norm(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function teamKey(team: { speciesId?: string; id?: string; level?: number }[]): string {
  return team.map((m) => `${m.speciesId || m.id}@${m.level ?? 5}`).join(',');
}

/**
 * Find the trainer-table row for a map NPC by name.
 * - Exact normalized-name match against trainerRowDisplayName.
 * - Rows whose name is a [NAME GAP] placeholder never match.
 * - One candidate -> it. Several -> tie-break by the NPC's inline
 *   team (species+levels), then by reward; still tied -> null, so
 *   an ambiguous name never silently picks the wrong row and the
 *   NPC keeps its inline team. (Acolyte Gale is the only ambiguous
 *   name in the table: R1-036 Dojo 2 Aero Lv17 vs R3-030 Dojo 6 Aero
 *   Lv75; the map Gale's team + reward pick R1-036.)
 * - No candidate -> null (Hex, Junk Warlord Krix, the Luigis and
 *   Champion MYTHAR have hand-built boss teams and no row).
 */
export function resolveTrainerRow(
  npcName: string,
  npcTeam?: { speciesId?: string; id?: string; level?: number }[],
  npcReward?: number,
): TrainerTeam | null {
  const key = norm(npcName);
  const candidates = ALL_TRAINER_ROWS.filter(
    (r) => !r.name.includes('[NAME GAP]') && norm(trainerRowDisplayName(r)) === key,
  );
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  if (npcTeam) {
    const byTeam = candidates.filter((c) => teamKey(c.team) === teamKey(npcTeam));
    if (byTeam.length === 1) return byTeam[0];
  }
  if (npcReward !== undefined) {
    const byReward = candidates.filter((c) => c.reward === npcReward);
    if (byReward.length === 1) return byReward[0];
  }
  return null;
}

/** Display type for a species primary element (see header TYPE RULE). */
function displayType(raw: string): string {
  const TYPE_DISPLAY: Record<string, string> = {
    WATER: 'Water',
    STEEL: 'Chrome',
    GROUND: 'Earth',
    FIRE: 'Flame',
    GRASS: 'Grass',
  };
  return TYPE_DISPLAY[raw] || (raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase());
}

export type RowBattleMember = {
  speciesId: string;
  id: string;
  name: string;
  level: number;
  type: string;
};

/**
 * Convert a row's team into map-member shape for trainerBattleMon:
 * the species name must equal SPECIES_DB's name or trainerBattleMon
 * leaves the member on map stats (it has none -- see below), so a
 * missing species returns null and the caller falls back to the
 * inline team. All 49 row species exist in species.ts today.
 */
export function rowToMapMembers(row: TrainerTeam): RowBattleMember[] | null {
  const out: RowBattleMember[] = [];
  for (const slot of row.team) {
    const sp: any = (SPECIES_DB as any)[slot.speciesId];
    if (!sp) return null;
    out.push({
      speciesId: slot.speciesId,
      id: slot.speciesId,
      name: sp.name,
      level: slot.level,
      type: displayType(sp.types[0]),
    });
  }
  return out;
}
