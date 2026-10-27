/**
 * Creature Mode Pass 5 — Garden Form presentation, presentation only.
 *
 * Pokemon-first mapping (structure from files actually in the repo,
 * Mochiichao replacement in that exact spot):
 * - FireRed daycare.c / include/daycare.h: a deposited-creature record
 *   (slot, steps, compatibility, egg) shown on a dedicated Daycare
 *   level-menu screen (WindowTemplate + ListMenu in menu.c, NOT a
 *   popup) -> here: the Garden/Daycare screen in CreatureModeView,
 *   Slot 1 = the shared-store Guardian (the deposited creature),
 *   Slot 2 = empty, because this lane's store has only one guardian
 *   field. No level gain, no egg, and no compatibility number is
 *   invented here — those fields do not exist in the store yet.
 * - FireRed menu.c / party_menu.c / pokemon_summary_screen.c:
 *   dedicated full screens, never overlay popups -> the Garden
 *   screen is a full-screen view inside Creature Mode, with its
 *   own Back button, not a panel on top of the battle controls.
 * - Chao Garden conversion doc (chao-garden-conversion.md, NOT
 *   Sonic source code — no Sonic source files were found in the
 *   workspace/repo, only this conversion doc and garden-mode-spec):
 *   Garden Form = palette + accessories + aura, NOT a species
 *   change; Bright palette = white/gold, Umbral = black/purple,
 *   Neutral = base colour; Form I/II thresholds and alignment
 *   bands are already in mochiichao-systems.ts (gardenForm,
 *   alignmentFromCare, colorwayFor, dominantStat, gardenBattleBonus)
 *   and are reused here, NOT duplicated or re-derived.
 * - Mainframe Gardens (conversion doc): Sector 0 Plaza = Neutral,
 *   Aeon Spire Garden = Bright, Deep Sector Garden = Umbral,
 *   8 creatures per garden. Listed on the Garden screen as
 *   environments, NOT as new maps — Creature Mode still runs on
 *   Sector 0; no new tileset is invented in this lane.
 *
 * What this file does NOT do: it does not change damage, stats,
 * species, or evolution. The battle bonus still comes only from
 * gardenBattleBonus() (capped +9%). The palette swatches and the
 * in-world aura ring are presentation layers on top of the existing
 * sheet/fallback sprite. Palette sprite sheets themselves are
 * sprite-lane production; until those sheets land, this is an
 * overlay, labelled as such in the doc, not a new sheet.
 *
 * Forbidden list respected: no Sonic/Pokemon character names,
 * dialogue, cries, logos, or town names straight from their games
 * are used anywhere in this file. All names here are Mochiichao's.
 */

import {
  alignmentFromCare,
  colorwayFor,
  dominantStat,
  gardenBattleBonus,
  gardenForm,
  type Alignment,
  type GardenCreature,
  type GardenStats,
} from './mochiichao-systems';

export interface GardenFormPresentation {
  form: 'Base' | 'Garden Form I' | 'Garden Form II';
  alignment: Alignment;
  /** Null = base colour (Neutral palette is the species' own colour). */
  palettePrimary: string | null;
  paletteAccent: string | null;
  /** Null = no aura (Base form has no aura layer). */
  auraColor: string | null;
  auraStrength: 'none' | 'soft' | 'strong';
  dominant: keyof GardenStats;
  colorway: string;
  bonusPct: number;
  garden: GardenStats;
  bond: number;
  careMistakes: number;
  parts: string[];
}

const PALETTES: Record<Alignment, { primary: string | null; accent: string | null; aura: string }> = {
  Bright: { primary: '#f5d76e', accent: '#ffffff', aura: '#ffd700' },
  Umbral: { primary: '#7c3aed', accent: '#111827', aura: '#a855f7' },
  Neutral: { primary: null, accent: null, aura: '#e5e7eb' },
};

export function gardenFormPresentation(record: GardenCreature | null | undefined): GardenFormPresentation | null {
  if (!record) return null;
  const alignment = alignmentFromCare(record.careScore);
  const form = gardenForm(record.garden);
  const palette = PALETTES[alignment];
  return {
    form,
    alignment,
    palettePrimary: palette.primary,
    paletteAccent: palette.accent,
    auraColor: form === 'Base' ? null : palette.aura,
    auraStrength: form === 'Garden Form II' ? 'strong' : form === 'Garden Form I' ? 'soft' : 'none',
    dominant: dominantStat(record.garden),
    colorway: colorwayFor(record),
    bonusPct: gardenBattleBonus(record.garden) * 100,
    garden: record.garden,
    bond: record.bond,
    careMistakes: record.careMistakes,
    parts: record.parts,
  };
}

/**
 * Pass 6 — SA Chao data structure, Mochiichao values only.
 * Source pulled 2026-10-26 (open source, local work area only):
 * X-Hax sa_tools + nostalgianinja ChaoModding_Docs, ChaoDataStruct.md
 * (ChaoDataBase: StatLevels 0-99, PowerRun slider -Power/+Run,
 * FlySwim slider -Fly/+Swim, Alignment -1/0/1, EvolutionProgress
 * magnitude, Happiness). No Sonic character names, dialogue, cries,
 * logos, or town names are used. No SA game files are used.
 * Mapping, all computed from the existing Garden record, no new data:
 * - PowerRun slider = sprint - might (Sprint ~ Run, Might ~ Power)
 * - FlySwim slider = dive - glide (Dive ~ Swim, Glide ~ Fly)
 * - Alignment numeric: Umbral = -1, Neutral = 0, Bright = +1
 * - EvolutionProgress = total Garden stats / 495 (0..1; Form I at
 *   150/495, Form II at 300/495 in mochiichao-systems.ts)
 * - Happiness = bond (already 0-100 in the store)
 * StatGrades, lifespan, and reincarnation count are NOT shown here:
 * the store GardenCreature has no grade/lifespan/rebirth fields yet,
 * so those values are not guessed — see the Garden screen note.
 */
export interface SaChaoPresentation {
  powerRunSlider: number;
  flySwimSlider: number;
  alignmentNumeric: -1 | 0 | 1;
  evolutionProgress: number;
  happiness: number;
}

export function saChaoPresentation(record: GardenCreature | null | undefined): SaChaoPresentation | null {
  if (!record) return null;
  const alignment = alignmentFromCare(record.careScore);
  const total = record.garden.dive + record.garden.glide + record.garden.sprint + record.garden.might + record.garden.endurance;
  return {
    powerRunSlider: record.garden.sprint - record.garden.might,
    flySwimSlider: record.garden.dive - record.garden.glide,
    alignmentNumeric: alignment === 'Umbral' ? -1 : alignment === 'Bright' ? 1 : 0,
    evolutionProgress: total / 495,
    happiness: record.bond,
  };
}

export const MAINFRAME_GARDENS = [
  { name: 'Sector 0 Plaza', alignment: 'Neutral' as Alignment, capacity: 8 },
  { name: 'Aeon Spire Garden', alignment: 'Bright' as Alignment, capacity: 8 },
  { name: 'Deep Sector Garden', alignment: 'Umbral' as Alignment, capacity: 8 },
] as const;
