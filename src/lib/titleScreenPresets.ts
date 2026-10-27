/**
 * TITLE-SCREEN PRESETS — interchangeable title-screen assembly,
 * DEFINITIONS ONLY (UI Art lane, 2026-10-26).
 *
 * What this file is: one assembled title screen per preset — a
 * painted background (from the 10 on-main biomes in titleBiomes.ts)
 * + a creature figure (from the on-main title cutouts only) +
 * an EXISTING music theme name only + a particle/effect set +
 * a press-start behaviour. Nothing here renders, plays, or wires
 * anything into a screen: it is the data the creator system reads.
 *
 * What this file is NOT, and never claims:
 * - It does NOT change the locked default title (IntroSequence
 *   TITLE phase, phi stage) or the v32 main menu. Every preset
 *   below has isDefault: false, and there is no default preset id
 *   in this module: the locked default stays the default, and
 *   these presets are selectable variants only.
 * - It does NOT touch any creator screen. It edits no existing
 *   file at all: it only imports from on-main lib modules
 *   (titleBiomes, titleCardEffects, music's MusicTrack type) and
 *   from the on-main title cutout assets. The creator screens
 *   import THIS module after PR #155 merges — see the seam note
 *   at the bottom of this header and docs/ui-art/
 *   title-screen-presets-seam.md.
 * - It does NOT invent a biome -> creature assignment. Every
 *   preset's biome + creature pair is exactly the pair already
 *   on main in TITLE_CARD_CREATURES (titleCardEffects.ts); the
 *   mappingSource + mappingSourceNote on each preset are copied
 *   from that file's entry, not upgraded, not reworded into a
 *   stronger claim. (Water / Dorowani stays 'title-vibe' there,
 *   even though its note quotes a Mars statement — this file
 *   keeps the file's own label.)
 * - It does NOT compose music. musicTheme on every preset is
 *   'title': the existing official title track in music.ts
 *   (mochiichao-title-v3.wav, loops, played by IntroSequence's
 *   TITLE phase today). The intro and mainMenu tracks exist in
 *   music.ts but are NOT title-screen tracks, so they are not
 *   assigned to any title preset. Per-preset music themes do
 *   not exist yet — the Title Music lane's gate holds for new
 *   music, and extending MusicTrack with a new theme is that
 *   lane's job, not this file's. Music here is a name only.
 * - It does NOT fake art. Figure GAP today is 0/10: all 10
 *   title-pool creatures have a shipped walk cutout in
 *   src/assets/title/<name>-walk-cutout.png (Yogiferno PR #33 +
 *   the other 9 in the Title Creatures batch, wired via
 *   TitleCreatureFigure / YogifernoTitleWalk). If a cutout were
 *   missing, resolveTitleScreenPreset() would report it in
 *   validateTitleScreenPresets() and the preset would carry a
 *   GAP, never another creature's art. Background GAP is 0/10:
 *   every biome's backgroundImage is set in titleBiomes.ts.
 *
 * Effect / particle set, per preset, resolved (not re-typed) from
 * on-main sources by resolveTitleScreenPreset():
 *   biome weather + weatherCount (titleBiomes.ts),
 *   card effect kind + count (TITLE_CARD_EFFECTS),
 *   creature action + burst (CREATURE_ACTIONS),
 *   background drift ampX / ampY / speed (TITLE_BIOME_MOTION).
 * The preset table itself holds only the assembly choices; if any
 * source map changes, validateTitleScreenPresets() reports the
 * drift instead of silently shipping a stale copy.
 *
 * Press-start behaviour, identical on every preset (the locked
 * default's behaviour, reused unchanged — variants change the
 * scene, not what pressing does):
 *   prompt 'PRESS ANY KEY', blink 30 frames on / 15 frames off
 *   (StartScreenPreset's pinned pressAnyKey blink; IntroSequence
 *   renders it as press-blink 0.75s steps, 66% on),
 *   press sound = M3 Mochii Chirp (bootAudio playPressStartSound),
 *   transition = white fade 350ms, destination = MAIN_MENU.
 *   TitleScene's own startPrompt (HeartGold 0/30/45 flash cycle)
 *   is NOT the preset behaviour: toTitleSceneProps() sets
 *   startPrompt false, because IntroSequence keeps its own
 *   press-blink wiring and TitleScene must not double it.
 *
 * CREATOR SEAM (how the creator system loads these, after
 * PR #155 merges — no wiring is done here):
 *   import { TITLE_SCREEN_PRESETS, resolveTitleScreenPreset,
 *     toTitleSceneProps, toCreatorPresetData,
 *     validateTitleScreenPresets } from '../lib/titleScreenPresets';
 *   1. List: TITLE_SCREEN_PRESETS (10 entries, JSON-syntax table
 *      below; the same table is mirrored as
 *      src/lib/titleScreenPresets.json for JSON-loading creators —
 *      the .ts table is canonical, the .json is a snapshot of it).
 *   2. Resolve: resolveTitleScreenPreset(preset) attaches the
 *      background, weather, card effect, creature action, drift
 *      and figure url from the on-main sources.
 *   3. Render: toTitleSceneProps(resolved) returns exactly the
 *      props TitleScene already accepts (biome, figureUrl,
 *      figureName, fireTrail, caption, startPrompt) — a creator
 *      screen renders <TitleScene {...toTitleSceneProps(...)} />
 *      in its own preset preview, without editing TitleScene.
 *   4. Store: toCreatorPresetData(resolved) returns a plain
 *      JSON-safe object (format
 *      'mochiichao-title-screen-preset', version 1) whose fields
 *      map onto the creator preset shapes — see the field map in
 *      docs/ui-art/title-screen-presets-seam.md. Selection
 *      persistence (which preset the player picked, and under
 *      what storage key) is deliberately NOT defined here: that
 *      is the creator-UI plumbing step owed after #155 merges,
 *      and inventing a storage key here could collide with
 *      #155's preset storage.
 *
 * Pokemon-first structure note: a title screen as one assembled
 * scene (painted background layer + creature layer + weather /
 * particle layer + press prompt) follows the layer order traced
 * in titleBiomes.ts / titleCardEffects.ts from FireRed intro.c
 * and HeartGold intro_movie_scene_2 — structure only, no
 * Pokemon art, code, music, or names are used here.
 */

import { TITLE_BIOMES, type TitleBiomeId } from './titleBiomes';
import {
  TITLE_CARD_EFFECTS,
  TITLE_CARD_CREATURES,
  TITLE_BIOME_MOTION,
  CREATURE_ACTIONS,
  type TitleCardEffect,
  type TitleBiomeMotion,
  type CreatureAction,
  type CardSource,
} from './titleCardEffects';
import type { MusicTrack } from './music';
import mochiiWalkCutout from '../assets/title/mochii-walk-cutout.png';
import razorgaterWalkCutout from '../assets/title/razorgater-walk-cutout.png';
import tyrageWalkCutout from '../assets/title/tyrage-walk-cutout.png';
import kittemberWalkCutout from '../assets/title/kittember-walk-cutout.png';
import sproutleWalkCutout from '../assets/title/sproutle-walk-cutout.png';
import dorowaniWalkCutout from '../assets/title/dorowani-walk-cutout.png';
import gabuWalkCutout from '../assets/title/gabu-walk-cutout.png';
import wispkinWalkCutout from '../assets/title/wispkin-walk-cutout.png';
import yogifernoWalkCutout from '../assets/title/yogiferno-walk-cutout.png';
import mytharWalkCutout from '../assets/title/mythar-walk-cutout.png';

/** The one press-start behaviour every preset reuses (locked default's). */
export interface TitlePresetPressStart {
  behaviour: 'press-any-key-to-main-menu';
  prompt: 'PRESS ANY KEY';
  blinkOnFrames: 30;
  blinkOffFrames: 15;
  pressSound: 'M3 Mochii Chirp (bootAudio playPressStartSound)';
  transition: 'white fade 350ms';
  destination: 'MAIN_MENU';
  sourceNote: string;
}

export const TITLE_PRESET_PRESS_START: TitlePresetPressStart = {
  behaviour: 'press-any-key-to-main-menu',
  prompt: 'PRESS ANY KEY',
  blinkOnFrames: 30,
  blinkOffFrames: 15,
  pressSound: 'M3 Mochii Chirp (bootAudio playPressStartSound)',
  transition: 'white fade 350ms',
  destination: 'MAIN_MENU',
  sourceNote:
    'IntroSequence TITLE phase: any key/click plays the press sound, sets a white fade, then MAIN_MENU after 350ms. Reused unchanged; presets do not redefine it.',
};

/** One assembled title screen. Assembly choices only — effects resolve from source maps. */
export interface TitleScreenPreset {
  id: string;
  label: string;
  biome: TitleBiomeId;
  creature: string;
  figureFile: string;
  figureComponent: 'TitleCreatureFigure' | 'YogifernoTitleWalk';
  figureSize: string;
  /** Existing music theme name only — 'title' on every preset today (see header). */
  musicTheme: MusicTrack;
  pressStartBehaviour: 'press-any-key-to-main-menu';
  /** Copied from TITLE_CARD_CREATURES — never upgraded by this file. */
  mappingSource: CardSource;
  mappingSourceNote: string;
  /** Always false: the locked default title is not a preset and no preset replaces it. */
  isDefault: false;
  /** 'defined' = assembled definition, not yet wired into creator UI (that step is owed). */
  status: 'defined';
};

/* BEGIN PRESET TABLE (JSON syntax — mirrored verbatim in src/lib/titleScreenPresets.json) */
export const TITLE_SCREEN_PRESETS: TitleScreenPreset[] = [
  { "id": "title-snow-yogiferno", "label": "Snow — Yogiferno", "biome": "snow", "creature": "Yogiferno", "figureFile": "yogiferno-walk-cutout.png", "figureComponent": "YogifernoTitleWalk", "figureSize": "145x190", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-habitat", "mappingSourceNote": "titleRotation habitat list includes snow/ice regions; YogifernoTitleWalk snow variant already shipped.", "isDefault": false, "status": "defined" },
  { "id": "title-grass-sproutle", "label": "Grass — Sproutle", "biome": "grass", "creature": "Sproutle", "figureFile": "sproutle-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "259x333", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-vfx", "mappingSourceNote": "Flora/Chrome grass starter; title-vibe \"fresh sprout\".", "isDefault": false, "status": "defined" },
  { "id": "title-water-dorowani", "label": "Water — Dorowani", "biome": "water", "creature": "Dorowani", "figureFile": "dorowani-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "263x398", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "title-vibe", "mappingSourceNote": "Mars 2026-10-25: Dorowani goes on water. Title-vibe \"blue water starter\"; no canon VFX in the manifests yet (Gen 2, #147).", "isDefault": false, "status": "defined" },
  { "id": "title-sand-tyrage", "label": "Sand — Tyrage", "biome": "sand", "creature": "Tyrage", "figureFile": "tyrage-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "327x305", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-vfx", "mappingSourceNote": "Core desert kaiju; manifest VFX: sheds sand, roar kicks up a dust storm.", "isDefault": false, "status": "defined" },
  { "id": "title-stone-razorgater", "label": "Stone — Razorgater", "biome": "stone", "creature": "Razorgater", "figureFile": "razorgater-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "265x266", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-vfx", "mappingSourceNote": "Chrome; manifest VFX: scanning lasers, attack sparks blue electricity.", "isDefault": false, "status": "defined" },
  { "id": "title-forest-gabu", "label": "Forest — Gabu", "biome": "forest", "creature": "Gabu", "figureFile": "gabu-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "292x295", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "mars-confirmed", "mappingSourceNote": "Mars 2026-10-26 ~00:15 CDT: \"Gabu is good for forest.\" Forest is canon for Gabu, no longer a proposed fill.", "isDefault": false, "status": "defined" },
  { "id": "title-rain-mochii", "label": "Rain — Mochii", "biome": "rain", "creature": "Mochii", "figureFile": "mochii-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "380x380", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-vfx", "mappingSourceNote": "Mars 2026-10-25: rain card can be Mochii. Aqua; manifest VFX: glides, ripple trail, bubbles pop; title-vibe \"Boot Harbor dawn\".", "isDefault": false, "status": "defined" },
  { "id": "title-night-wispkin", "label": "Night — Wispkin", "biome": "night", "creature": "Wispkin", "figureFile": "wispkin-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "288x609", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "canon-vfx", "mappingSourceNote": "Mars 2026-10-25: Wispkin goes on the purple/night card (was forest in batch 3). Umbral; manifest VFX: bobs rhythmically, dark smoke sheds; evolves into Duskfiend, guardian of the dark forest.", "isDefault": false, "status": "defined" },
  { "id": "title-mythar-mythar", "label": "Mythar — Mythar", "biome": "mythar", "creature": "Mythar", "figureFile": "mythar-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "434x350", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "mars-confirmed", "mappingSourceNote": "Mars 2026-10-26 ~00:14 CDT: Mythar gets his OWN card — pearlescent iridescent diamond-pearl background with sparkles and sine waves, real sparkly and diamond-like (his 2026-10-25 description, recovered from memory). Manifest VFX: never touches ground, three golden rings orbit, roar is a harmonic chime (visual rings only here, no audio).", "isDefault": false, "status": "defined" },
  { "id": "title-lantern-kittember", "label": "Lantern — Kittember", "biome": "lantern", "creature": "Kittember", "figureFile": "kittember-walk-cutout.png", "figureComponent": "TitleCreatureFigure", "figureSize": "287x304", "musicTheme": "title", "pressStartBehaviour": "press-any-key-to-main-menu", "mappingSource": "mars-confirmed", "mappingSourceNote": "Mars 2026-10-26 ~00:14 CDT: Kittember gets his OWN card — a night card with lanterns surrounding it, illuminating the area, while Kittember (ember) also illuminates the area. Fire feline, ember tail orb.", "isDefault": false, "status": "defined" }
];
/* END PRESET TABLE */

/** No preset is the default: the locked default title stays the default. */
export const TITLE_SCREEN_PRESET_IDS: string[] = TITLE_SCREEN_PRESETS.map((p) => p.id);

export function getTitleScreenPreset(id: string): TitleScreenPreset | null {
  return TITLE_SCREEN_PRESETS.find((p) => p.id === id) ?? null;
}

/** Cutout url per creature, from the same imports TitleCreatureFigure / YogifernoTitleWalk use. */
const TITLE_PRESET_FIGURE_URLS: Record<string, string> = {
  Mochii: mochiiWalkCutout,
  Razorgater: razorgaterWalkCutout,
  Tyrage: tyrageWalkCutout,
  Kittember: kittemberWalkCutout,
  Sproutle: sproutleWalkCutout,
  Dorowani: dorowaniWalkCutout,
  Gabu: gabuWalkCutout,
  Wispkin: wispkinWalkCutout,
  Yogiferno: yogifernoWalkCutout,
  Mythar: mytharWalkCutout,
};

export interface ResolvedTitleScreenPreset extends TitleScreenPreset {
  backgroundLabel: string;
  backgroundFile: string;
  hasPaintedBackground: boolean;
  weather: string;
  weatherCount: number;
  cardEffect: TitleCardEffect;
  creatureAction: CreatureAction;
  motion: TitleBiomeMotion;
  figureUrl: string;
  /** Yogiferno only: YogifernoTitleWalk renders with fireTrail on; other figures have none. */
  fireTrail: boolean;
  pressStart: TitlePresetPressStart;
}

/** Attach the on-main background / weather / effect / action / figure for a preset. */
export function resolveTitleScreenPreset(preset: TitleScreenPreset): ResolvedTitleScreenPreset {
  const biomeDef = TITLE_BIOMES[preset.biome];
  return {
    ...preset,
    backgroundLabel: biomeDef.label,
    backgroundFile: `title-bg-${preset.biome}-v2.png`,
    hasPaintedBackground: biomeDef.backgroundImage !== null,
    weather: biomeDef.weather,
    weatherCount: biomeDef.weatherCount,
    cardEffect: TITLE_CARD_EFFECTS[preset.biome],
    creatureAction: CREATURE_ACTIONS[preset.creature],
    motion: TITLE_BIOME_MOTION[preset.biome],
    figureUrl: TITLE_PRESET_FIGURE_URLS[preset.creature] ?? '',
    fireTrail: preset.creature === 'Yogiferno',
    pressStart: TITLE_PRESET_PRESS_START,
  };
}

export const RESOLVED_TITLE_SCREEN_PRESETS: ResolvedTitleScreenPreset[] =
  TITLE_SCREEN_PRESETS.map(resolveTitleScreenPreset);

/**
 * Drift / GAP check: every preset must match its on-main sources, or
 * the mismatch is returned as an error string (never silently fixed).
 * Returns [] when the set is clean. Run this in the creator screen
 * before listing presets, so a stale table cannot ship as fact.
 */
export function validateTitleScreenPresets(): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenBiomes = new Set<string>();
  const seenCreatures = new Set<string>();
  for (const p of TITLE_SCREEN_PRESETS) {
    if (seenIds.has(p.id)) errors.push(`${p.id}: duplicate preset id.`);
    seenIds.add(p.id);
    if (seenBiomes.has(p.biome)) errors.push(`${p.id}: duplicate biome ${p.biome}.`);
    seenBiomes.add(p.biome);
    if (seenCreatures.has(p.creature)) errors.push(`${p.id}: duplicate creature ${p.creature}.`);
    seenCreatures.add(p.creature);
    const biomeDef = TITLE_BIOMES[p.biome];
    if (!biomeDef) { errors.push(`${p.id}: biome ${p.biome} is not in TITLE_BIOMES.`); continue; }
    if (biomeDef.backgroundImage === null) errors.push(`${p.id}: GAP — biome ${p.biome} has no painted background on main.`);
    const card = TITLE_CARD_CREATURES[p.biome];
    if (!card || card.length === 0) errors.push(`${p.id}: GAP — no TITLE_CARD_CREATURES entry for ${p.biome}.`);
    else {
      if (card[0].name !== p.creature) errors.push(`${p.id}: creature ${p.creature} does not match TITLE_CARD_CREATURES[${p.biome}][0] (${card[0].name}).`);
      if (card[0].source !== p.mappingSource) errors.push(`${p.id}: mappingSource ${p.mappingSource} does not match TITLE_CARD_CREATURES source (${card[0].source}).`);
      if (card[0].sourceNote !== p.mappingSourceNote) errors.push(`${p.id}: mappingSourceNote drifted from TITLE_CARD_CREATURES[${p.biome}] note.`);
    }
    if (!CREATURE_ACTIONS[p.creature]) errors.push(`${p.id}: GAP — no CREATURE_ACTIONS entry for ${p.creature}.`);
    if (!TITLE_CARD_EFFECTS[p.biome]) errors.push(`${p.id}: GAP — no TITLE_CARD_EFFECTS entry for ${p.biome}.`);
    if (!TITLE_PRESET_FIGURE_URLS[p.creature]) errors.push(`${p.id}: GAP — no shipped cutout url for ${p.creature}.`);
    if (p.figureFile !== `${p.creature.toLowerCase()}-walk-cutout.png`) errors.push(`${p.id}: figureFile ${p.figureFile} does not follow the shipped cutout name for ${p.creature}.`);
    if (p.musicTheme !== 'title') errors.push(`${p.id}: musicTheme is ${p.musicTheme}, not the existing title track — per-preset themes do not exist yet.`);
    if (p.pressStartBehaviour !== 'press-any-key-to-main-menu') errors.push(`${p.id}: pressStartBehaviour is not the locked press-any-key behaviour.`);
    if (p.isDefault !== false) errors.push(`${p.id}: isDefault must be false — no preset replaces the locked default.`);
    if (p.status !== 'defined') errors.push(`${p.id}: status is ${p.status}, not 'defined'.`);
  }
  const biomeIds = Object.keys(TITLE_BIOMES);
  if (TITLE_SCREEN_PRESETS.length !== biomeIds.length) {
    errors.push(`Preset count ${TITLE_SCREEN_PRESETS.length} does not match biome count ${biomeIds.length} — one preset per biome is the set's rule.`);
  }
  for (const b of biomeIds) {
    if (!seenBiomes.has(b)) errors.push(`GAP — biome ${b} has no preset.`);
  }
  return errors;
}

/** Props TitleScene already accepts — a creator preview renders <TitleScene {...toTitleSceneProps(...)} />. */
export function toTitleSceneProps(resolved: ResolvedTitleScreenPreset): {
  biome: TitleBiomeId;
  figureUrl: string;
  figureAlt: string;
  figureName: string;
  fireTrail: boolean;
  caption: string;
  startPrompt: false;
} {
  return {
    biome: resolved.biome,
    figureUrl: resolved.figureUrl,
    figureAlt: `${resolved.creature} title figure`,
    figureName: resolved.creature,
    fireTrail: resolved.fireTrail,
    caption: `${resolved.label} — ${resolved.backgroundLabel} + ${resolved.creature} cutout (${resolved.figureSize}, transparent) + ${resolved.cardEffect.kind} card effect + ${resolved.creatureAction.action}/${resolved.creatureAction.burst} action. Press ANY KEY to main menu; music: existing title theme only.`,
    startPrompt: false,
  };
}

/** Plain JSON-safe preset data for creator screens to store / export (format version 1). */
export function toCreatorPresetData(resolved: ResolvedTitleScreenPreset): Record<string, unknown> {
  return {
    format: 'mochiichao-title-screen-preset',
    version: 1,
    id: resolved.id,
    label: resolved.label,
    isDefault: false,
    status: 'defined',
    background: resolved.biome,
    backgroundFile: resolved.backgroundFile,
    backgroundLabel: resolved.backgroundLabel,
    hasPaintedBackground: resolved.hasPaintedBackground,
    creature: resolved.creature,
    figureFile: resolved.figureFile,
    figureComponent: resolved.figureComponent,
    figureSize: resolved.figureSize,
    musicTheme: resolved.musicTheme,
    musicNote: 'Existing theme name only: official title track (mochiichao-title-v3.wav, loops). No new music composed here.',
    pressStart: resolved.pressStart,
    effects: {
      weather: resolved.weather,
      weatherCount: resolved.weatherCount,
      cardEffect: resolved.cardEffect,
      creatureAction: resolved.creatureAction,
      motion: resolved.motion,
    },
    mappingSource: resolved.mappingSource,
    mappingSourceNote: resolved.mappingSourceNote,
    defaultNote: 'Selectable variant only. The locked default title + v32 main menu stay the default; selecting a preset must never overwrite them.',
  };
}
