/**
 * Creature Mode walk-frame wiring — now a thin shim over walkCycle.ts.
 *
 * The 4-creature table from Pass 8 (Mochii, Razorgater, Tyrage, Kittember) is
 * superseded by the both-sources table in walkCycle.ts (42 frames-dir sets +
 * 9 sheet-only sets, Mars confirmed 2026-10-26 ~19:33 CDT). Same export name and
 * signature, so the CreatureModeView call site is unchanged — but the rhythm is
 * now Black 2's { step, stand, step, stand } per tile step (walkStep % 4):
 * step phases return a frames-dir PNG URL, stand phases return null, and null
 * makes PixiWorldCanvas render the sheet cell (standing authority, unchanged).
 * Sheet-only sets always return null (existing sheet path, unchanged).
 *
 * Razorgater down-frame shadow caveat is carried in walkCycle.ts + the activation doc.
 */
import { resolveWalkFrameUrlBySpecies } from './walkCycle';

export type WalkDir = 'down' | 'up' | 'left' | 'right';

export function creatureWalkFrameUrl(speciesId: string, dir: string, phase: number): string | null {
  return resolveWalkFrameUrlBySpecies(speciesId, dir, phase);
}
