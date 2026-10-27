import type React from 'react';
import {
  getGameVisualState,
  loadMenuCustom,
  resolveDayNightPalette,
  type DayNightPalette,
  type DayNightVisual,
  type MenuCustomSettings,
} from './menuCustom';

/**
 * Day/night menu variants — WIRING (stacked on PR #153's spec).
 *
 * PR #153 specified the variants (docs/ui-art/day-night-menu-spec.md
 * + day-night-menu-variants.json) but wired nothing: the only screen
 * that showed a day/night effect was Settings itself, and
 * applyMenuCustom() did not even set the panel / muted vars. This
 * module is the single place that resolves the variant once per
 * menu render (spec wiring checklist item 1) from the SAME storage
 * the Settings rows already write (loadMenuCustom(), the Batch B
 * localStorage key) — no new storage key, no new settings row, no
 * new UI pattern. The selection control is the existing Settings
 * rows (DAY/NIGHT MODE / PERIOD / GRADUAL TRANSITION / DAY/NIGHT
 * TINT); this module only makes their choice reach menus in-game.
 *
 * What changes with the period (spec shared rules, nothing else):
 * panel colour, accent, text / muted, backdrop sky gradient, and
 * tint overlay. Nothing moves, nothing resizes, no label text
 * changes, and button colour identity never changes (a pink
 * CONTINUE stays pink). Where a menu sits over game art (battle,
 * dialogue over the world) there is no sky gradient — only the
 * panel + accent + tint change, so the game art underneath is
 * never repainted.
 *
 * EXEMPT, always (spec "What never changes"): the locked default
 * TITLE and the locked default MAIN MENU (v32) never call this
 * module and never receive these vars, at any hour, in any mode.
 * The main-menu variant row in the spec applies ONLY when a
 * non-locked preset is active; preset selection lives on the
 * #157 / #199 branches, not on this branch, so preset-menu
 * application is NOT claimed here (see the spec doc's wiring
 * status note). Logo stays the uploaded logo PNG, never font text.
 *
 * Tint strength (spec PROPOSAL, implemented here as specified):
 * strength scales the tint overlay alpha ONLY — 100 = the
 * colourway alpha, 50 = half, 0 = no tint overlay at all.
 * Palettes still change at 0%. Tint never recolours the logo,
 * never recolours button labels, and never moves any element.
 * SettingsScreen itself keeps its own equivalent implementation
 * (tint div + opacity = strength) and is not refactored here.
 */

/** CSS custom properties this module sets (all 7 palette fields). */
export type DayNightMenuVars = {
  '--menu-daynight-panel': string;
  '--menu-daynight-accent': string;
  '--menu-daynight-text': string;
  '--menu-daynight-muted': string;
  '--menu-daynight-sky-top': string;
  '--menu-daynight-sky-bottom': string;
  /** Tint with its alpha already scaled by the tint-strength row. */
  '--menu-daynight-tint': string;
};

export interface DayNightMenuVariant {
  /** AUTO / CUSTOM / OFF, as stored by the Settings rows. */
  mode: MenuCustomSettings['dayNightMode'];
  /** Visual state actually shown (LATE folds to NITE, as in the spec). */
  visual: DayNightVisual;
  /** Resolved palette before tint-strength scaling (panel / tint unblended, per the spec). */
  palette: DayNightPalette;
  /** Tint overlay colour with alpha scaled by the tint-strength row. */
  tint: string;
  /** Ready to spread onto a menu wrapper's style prop. */
  vars: DayNightMenuVars;
}

/**
 * Scale an rgba() tint's alpha by strengthPct (0-100). Returns the
 * input unchanged when it is not an rgba() colour, so a future
 * colourway format can never produce a broken overlay.
 */
export function scaleTintAlpha(tint: string, strengthPct: number): string {
  const m = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)$/.exec(tint);
  if (!m) return tint;
  const strength = Math.min(100, Math.max(0, strengthPct)) / 100;
  const alpha = Math.round(parseFloat(m[4]) * strength * 1000) / 1000;
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
}

/**
 * Resolve the variant for explicit settings (pure: no storage, no
 * document access — the shape a caller passes in from loadMenuCustom()).
 * OFF always resolves to the DAY palette at every hour; CUSTOM to
 * the stored period; AUTO to the device clock at render, blended
 * across the last hour of the period when transition is on.
 */
export function dayNightMenuVariantFor(
  settings: MenuCustomSettings,
  now: Date = new Date(),
): DayNightMenuVariant {
  const palette = resolveDayNightPalette(
    settings.dayNightMode,
    settings.dayNightCustom,
    settings.dayNightTransition,
    now,
  );
  // Visual state shown: OFF -> DAY; CUSTOM -> the stored period;
  // AUTO -> the clock's visual state (blend does not change the
  // named state, only the blended colours inside the palette).
  const visual: DayNightVisual =
    settings.dayNightMode === 'OFF'
      ? 'DAY'
      : settings.dayNightMode === 'CUSTOM'
        ? settings.dayNightCustom
        : getGameVisualState(now);
  const tint = scaleTintAlpha(palette.tint, settings.dayNightTint);
  return {
    mode: settings.dayNightMode,
    visual,
    palette,
    tint,
    vars: {
      '--menu-daynight-panel': palette.panel,
      '--menu-daynight-accent': palette.accent,
      '--menu-daynight-text': palette.text,
      '--menu-daynight-muted': palette.muted,
      '--menu-daynight-sky-top': palette.skyTop,
      '--menu-daynight-sky-bottom': palette.skyBottom,
      '--menu-daynight-tint': tint,
    },
  };
}

/**
 * Read the stored Settings choice once (per menu render, per the
 * spec checklist) and resolve the variant. Storage failures fall
 * back to the Batch B defaults via loadMenuCustom() itself, so a
 * corrupt key can never render a broken menu — it renders DAY.
 */
export function getDayNightMenuVariant(now: Date = new Date()): DayNightMenuVariant {
  return dayNightMenuVariantFor(loadMenuCustom(), now);
}

/** The vars object as a React style prop (custom properties need the cast). */
export function dayNightMenuVarStyle(variant: DayNightMenuVariant): React.CSSProperties {
  return variant.vars as unknown as React.CSSProperties;
}
