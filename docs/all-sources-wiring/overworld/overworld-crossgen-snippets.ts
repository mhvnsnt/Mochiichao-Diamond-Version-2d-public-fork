/**
 * Overworld cross-generation snippets — STAGED ONLY, not wired into the game.
 *
 * Companion to overworld-crossgen-mapping.md (Worker 3/6, 2026-10-26).
 * Every identifier below is renamed to a Mochiichao name. No source
 * creature, character, place, image, logo, literal-dialogue, or
 * creature-voice string appears in this file: creature slots carry a
 * generic `creatureRef` string ID, never a source creature constant;
 * zones carry anonymous numeric IDs, never a place string; weather is
 * carried as a numeric code, never as a source weather label.
 *
 * Sources (structure, order, values only): the field / overworld /
 * weather / camera / encounter / map-header / clock files listed in the
 * mapping file, read in FireRed -> HeartGold -> Black 2 -> other-gens
 * order. Values below are copied verbatim from those files; nothing
 * here is invented, and nothing here assigns a meaning to a numeric
 * weather / projection / camera code — those mappings are Mars-only
 * (see mapping file, "Mars-only decisions owed").
 *
 * Declaration counts (verified by grep):
 * - exported types: 25
 * - exported functions / constants: 30
 * - source creature-constant tokens: 0
 * - source place-name strings: 0
 * - literal dialogue strings: 0
 */

// ---------------------------------------------------------------------------
// Shared slot shapes
// ---------------------------------------------------------------------------

/** One encounter-table slot: a creature reference + a level range. */
export type MochiiWildSlot = {
  creatureRef: string; // generic ID; resolved by the roster mapping (Mars-only)
  minLevel: number;
  maxLevel: number;
};

/** One encounter table: a rate + its slots. */
export type MochiiWildInfo = {
  encounterRate: number;
  slots: MochiiWildSlot[];
};

/** FireRed-shape wild header: one entry per map, four terrain tables. */
export type MochiiWildHeader = {
  mapGroup: number;
  mapNum: number;
  land: MochiiWildInfo | null;
  water: MochiiWildInfo | null;
  rock: MochiiWildInfo | null;
  fishing: MochiiWildInfo | null;
};

// FireRed slot odds, cumulative percent, in slot order (verbatim values).
export const MOCHII_FR_LAND_SLOT_CUMULATIVE = [20, 40, 50, 60, 70, 80, 85, 90, 94, 98, 99, 100];
export const MOCHII_FR_WATER_SLOT_CUMULATIVE = [60, 90, 95, 99, 100];
export const MOCHII_FR_FISHING_SLOT_CUMULATIVE = [70, 100, 160, 180, 200, 240, 280, 295, 299, 300];
// Fishing rod groups, by slot index (FireRed shape).
export const MOCHII_FR_ROD_GROUPS = { oldRod: [0, 1], goodRod: [2, 3, 4], superRod: [5, 6, 7, 8, 9] };

/** FireRed-shape rate test. Scale max 1600; test rate x16; failed rolls
 *  add rate x16 / 200 to a running buff; dice roll random % 1600 < rate. */
export const MOCHII_FR_MAX_ENCOUNTER_RATE = 1600;
export function mochiiFireRedRateTest(rate: number, buff: number, rand1600: number): { hit: boolean; newBuff: number } {
  let test = rate * 16 + Math.floor((buff * 16) / 200);
  if (test > MOCHII_FR_MAX_ENCOUNTER_RATE) test = MOCHII_FR_MAX_ENCOUNTER_RATE;
  if (rand1600 < test) return { hit: true, newBuff: 0 };
  return { hit: false, newBuff: buff + rate };
}

/** FireRed-shape rate modifiers, applied before the dice roll. */
export function mochiiFireRedRateModifiers(rate: number, opts: { fluteUp: boolean; fluteDown: boolean; abilityHalves: boolean; abilityDoubles: boolean }): number {
  let r = rate;
  if (opts.fluteUp) r += Math.floor(r / 2);
  if (opts.fluteDown) r = Math.floor(r / 2);
  if (opts.abilityHalves) r = Math.floor(r / 2);
  if (opts.abilityDoubles) r *= 2;
  return r;
}

// ---------------------------------------------------------------------------
// HeartGold-shape encounter data
// ---------------------------------------------------------------------------

/** HeartGold-shape encounter data: 6 table rates + slot sets. */
export type MochiiHgEncounterData = {
  rateWalking: number;
  rateSurfing: number;
  rateRock: number;
  rateOldRod: number;
  rateGoodRod: number;
  rateSuperRod: number;
  landLevels: number[]; // 12, shared across the 3 time sets
  landMorning: string[]; // 12 creature refs
  landDay: string[]; // 12 creature refs
  landNight: string[]; // 12 creature refs
  surfSlots: MochiiWildSlot[]; // 5
  rockSlots: MochiiWildSlot[]; // 2
  oldRodSlots: MochiiWildSlot[]; // 5
  goodRodSlots: MochiiWildSlot[]; // 5
  superRodSlots: MochiiWildSlot[]; // 5
  swarmSlots: string[]; // 4 creature refs (land + surf swarm pool)
  nightFishingRef: string; // swapped into one fishing slot at night
};

/** HeartGold-shape land slot roll: cumulative % [20,20,10,10,10,10,5,5,4,4,1,1]. */
export function mochiiHgLandSlotRoll(rand100: number): number {
  const bounds = [20, 40, 50, 60, 70, 80, 85, 90, 94, 98, 99];
  for (let i = 0; i < bounds.length; i++) if (rand100 < bounds[i]) return i;
  return 11;
}

/** HeartGold-shape surf slot roll: [60,30,5,4,1]. */
export function mochiiHgSurfSlotRoll(rand100: number): number {
  if (rand100 < 60) return 0;
  if (rand100 < 90) return 1;
  if (rand100 < 95) return 2;
  if (rand100 < 99) return 3;
  return 4;
}

/** HeartGold-shape fishing slot roll: [40,30,15,10,5]. */
export function mochiiHgFishingSlotRoll(rand100: number): number {
  if (rand100 < 40) return 0;
  if (rand100 < 70) return 1;
  if (rand100 < 85) return 2;
  if (rand100 < 95) return 3;
  return 4;
}

/** HeartGold-shape rock-smash roll: [80,20]; headbutt roll: [50,15,15,10,5,5]. */
export function mochiiHgRockSlotRoll(rand100: number): number {
  return rand100 < 80 ? 0 : 1;
}
export function mochiiHgHeadbuttSlotRoll(rand100: number): number {
  if (rand100 < 50) return 0;
  if (rand100 < 65) return 1;
  if (rand100 < 80) return 2;
  if (rand100 < 90) return 3;
  if (rand100 < 95) return 4;
  return 5;
}

/** HeartGold-shape two-stage rate roll. Stage 1 builds a modified rate
 *  (base 40; -20 walking; +40 very-tall grass; +30 cycling; step boost
 *  0/30/40/60 at 0/2/3/4+ steps; audio-sequence modifier +25/-25; clamp
 *  100); stage 2 rolls that rate, then rolls the table rate. */
export function mochiiHgModifiedRate(opts: {
  isCycling: boolean; isSurfing: boolean; isVeryTallGrass: boolean;
  stepsSinceTurn: number; audioModifier: number;
}): number {
  let rate = 40;
  if (!opts.isCycling && !opts.isSurfing) rate -= 20;
  if (opts.isVeryTallGrass) rate += 40;
  else if (opts.isCycling) rate += 30;
  if (opts.stepsSinceTurn >= 4) rate += 60;
  else if (opts.stepsSinceTurn >= 3) rate += 40;
  else if (opts.stepsSinceTurn >= 2) rate += 30;
  rate += opts.audioModifier;
  if (rate > 100) rate = 100;
  if (rate < 0) rate = 0;
  return rate;
}

// ---------------------------------------------------------------------------
// Black 2-shape encounter data + climbing rate
// ---------------------------------------------------------------------------

/** Black 2-shape encounter data: 7 terrain rates + 7 slot tables. */
export type MochiiBwEncounterData = {
  rates: [number, number, number, number, number, number, number]; // grass, dark grass, shaking grass, surf, rippling surf, fishing, rippling fishing
  flags: number;
  fishingEnabled: boolean;
  grass: MochiiWildSlot[]; // 12
  darkGrass: MochiiWildSlot[]; // 12
  shakingGrass: MochiiWildSlot[]; // 12
  surf: MochiiWildSlot[]; // 5
  surfRare: MochiiWildSlot[]; // 5
  fishing: MochiiWildSlot[]; // 5
  fishingRare: MochiiWildSlot[]; // 5
};

/** How a Black 2 encounter rate climbs while walking. */
export type MochiiEncountRateConfig = { increase: number; threshold: number; max: number; steps: number };

/** The 12 Black 2 climbing-rate configs, verbatim, in table order. */
export const MOCHII_BW_RATE_CONFIGS: MochiiEncountRateConfig[] = [
  { increase: 3, threshold: 1, max: 13, steps: 2 },
  { increase: 3, threshold: 1, max: 19, steps: 2 },
  { increase: 2, threshold: 3, max: 13, steps: 3 },
  { increase: 2, threshold: 2, max: 19, steps: 2 },
  { increase: 5, threshold: 1, max: 31, steps: 2 },
  { increase: 5, threshold: 1, max: 31, steps: 2 },
  { increase: 2, threshold: 18, max: 7, steps: 8 },
  { increase: 2, threshold: 9, max: 7, steps: 4 },
  { increase: 2, threshold: 3, max: 13, steps: 3 },
  { increase: 1, threshold: 12, max: 7, steps: 3 },
  { increase: 1, threshold: 9, max: 7, steps: 3 },
  { increase: 2, threshold: 3, max: 13, steps: 3 },
];

/** Black 2-shape climbing-rate step. The step counter must pass the
 *  config's steps before any roll; then the block counter climbs by the
 *  step increment until the threshold, and the rate climbs by `increase`
 *  up to `max`. The roll itself is random(100) <= rate, rate clamped 100. */
export type MochiiEncountState = {
  rateBlockCounter: number;
  rateStepIncrement: number;
  rateStepCounter: number;
  encountRate: number;
  phenomenonSteps: number;
};
export function mochiiBwUpdateEncountRate(state: MochiiEncountState, config: MochiiEncountRateConfig): void {
  state.rateStepCounter += 1;
  if (state.rateStepCounter <= config.steps) return;
  state.rateBlockCounter += state.rateStepIncrement;
  if (state.rateBlockCounter < config.threshold) return;
  state.rateBlockCounter = 0;
  state.encountRate = Math.min(state.encountRate + config.increase, config.max);
}
export function mochiiBwRateRoll(state: MochiiEncountState, config: MochiiEncountRateConfig, rate: number, rand100: number): boolean {
  if (rate > 100) rate = 100;
  if (state.rateStepCounter <= config.steps) return false;
  return rand100 <= rate;
}

/** Black 2-shape phenomenon spot (shaking grass / dust cloud /
 *  rippling water / flying shadow), carried without a place string. */
export type MochiiPhenomenonSpot = {
  zoneId: number; // anonymous numeric zone ID only
  x: number; y: number; z: number;
  height: number;
  kind: number; // terrain-kind value from the tile lookup (meaning owed)
  active: boolean;
  suspended: boolean;
  triggered: boolean;
};

// ---------------------------------------------------------------------------
// Crystal-shape cumulative probabilities
// ---------------------------------------------------------------------------

/** Crystal-shape grass roll: cumulative % [30,60,80,90,95,99,100] (7 slots). */
export function mochiiCrystalGrassSlotRoll(rand100: number): number {
  const bounds = [30, 60, 80, 90, 95, 99];
  for (let i = 0; i < bounds.length; i++) if (rand100 < bounds[i]) return i;
  return 6;
}
/** Crystal-shape water roll: cumulative % [60,90,100] (3 slots). */
export function mochiiCrystalWaterSlotRoll(rand100: number): number {
  if (rand100 < 60) return 0;
  if (rand100 < 90) return 1;
  return 2;
}

// ---------------------------------------------------------------------------
// Weather: state, precedence, transitions
// ---------------------------------------------------------------------------

/** Field-weather state: current + next numeric codes, fade/blend state.
 *  Codes are numeric only; code -> Mochiichao-state mapping is Mars-only. */
export type MochiiFieldWeather = {
  currWeather: number;
  nextWeather: number;
  palState: 0 | 1 | 2 | 3; // changing / fading in / fading out / idle
  blendEva: number;
  blendEvb: number;
  targetBlendEva: number;
  targetBlendEvb: number;
  blendDelay: number;
  weatherChangeComplete: boolean;
};

/** Black 2-shape zone-weather precedence, in order. Each step returns a
 *  numeric code or the "no choice" sentinel; the first choice wins.
 *  Specific zone IDs, flag numbers, and code meanings are withheld here
 *  (Mars-only); only the step order + the sentinel are carried. */
export const MOCHII_WEATHER_NONE = 0xffff;
export function mochiiResolveZoneWeather(steps: {
  forced: number; linkedGame: number; eventFlag: number;
  birthday: number; seasonalCalendar: number; zoneDefault: number;
}): number {
  for (const v of [steps.forced, steps.linkedGame, steps.eventFlag, steps.birthday, steps.seasonalCalendar, steps.zoneDefault]) {
    if (v !== MOCHII_WEATHER_NONE) return v;
  }
  return MOCHII_WEATHER_NONE;
}

/** HeartGold-shape date-gated weather override: 8 calendar dates on which
 *  one summit-type map's weather code is replaced by code 8. Dates are
 *  plain calendar facts; no place string and no weather label is carried. */
export const MOCHII_DATE_GATED_WEATHER_DATES: Array<{ month: number; day: number }> = [
  { month: 1, day: 1 }, { month: 1, day: 31 }, { month: 2, day: 1 },
  { month: 2, day: 29 }, { month: 3, day: 15 }, { month: 10, day: 10 },
  { month: 12, day: 3 }, { month: 12, day: 31 },
];
export function mochiiDateGatedWeather(month: number, day: number, baseCode: number): number {
  if (MOCHII_DATE_GATED_WEATHER_DATES.some((d) => d.month === month && d.day === day)) return 8;
  return baseCode;
}

/** Black 2-shape weather task modes: start at once, or crossfade over the
 *  other task (sequential vs crossfade transitions). */
export type MochiiWeatherTransition = "atOnce" | "crossfade" | "sequential";

// ---------------------------------------------------------------------------
// Camera + projection
// ---------------------------------------------------------------------------

/** HeartGold-shape camera: perspective vs orthographic, look-at triple,
 *  distance + angle, history buffer with per-axis enable flags. */
export type MochiiCamera = {
  perspectiveType: 0 | 1; // perspective / orthographic
  fovSin: number;
  fovCos: number;
  aspect: number;
  near: number;
  far: number;
  pos: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  up: { x: number; y: number; z: number };
  distance: number;
  angle: { x: number; y: number; z: number };
  enableUpdateX: boolean;
  enableUpdateY: boolean;
  enableUpdateZ: boolean;
};

/** Black 2-shape camera defaults + boundaries. */
export type MochiiCameraDefaults = {
  zoom: number;
  pitch: number;
  yaw: number;
  fov: number;
  zNear: number;
  zFar: number;
  bind: boolean;
  target: { x: number; y: number; z: number };
};
export type MochiiCameraBoundary =
  | { shape: number; applyTo: number; minX: number; maxX: number; minZ: number; maxZ: number }
  | { shape: number; applyTo: number; centerX: number; centerZ: number; radius: number; angleA: number; angleB: number };

/** Black 2-shape event-camera animation: start/end coords + per-channel flags. */
export type MochiiEventCameraAnimation = {
  start: { pos: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; pitch: number; yaw: number; distance: number; fov: number };
  end: { pos: { x: number; y: number; z: number }; target: { x: number; y: number; z: number }; pitch: number; yaw: number; distance: number; fov: number };
  animateExtraTranslation: boolean;
  animatePitch: boolean;
  animateYaw: boolean;
  animateTargetDistance: boolean;
  animateFov: boolean;
  animateTargetPos: boolean;
  frames: number;
};

/** FireRed-shape field camera: callback-driven, pixel offsets, pan-ahead. */
export type MochiiFieldCamera2d = {
  totalPixelOffsetX: number;
  totalPixelOffsetY: number;
  panAheadX: number;
  panAheadY: number;
  bikePanBack: boolean;
};

// ---------------------------------------------------------------------------
// Lighting periods
// ---------------------------------------------------------------------------

/** One Black 2-shape lighting light: enabled + colour + direction. */
export type MochiiLight = {
  enabled: boolean;
  color: { red: number; green: number; blue: number };
  direction: { x: number; y: number; z: number };
};
export type MochiiRgb = { red: number; green: number; blue: number };

/** One Black 2-shape lighting period: end time + 4 lights + material triples. */
export type MochiiLightPeriod = {
  endHour: number;
  endMinutes: number;
  lights: [MochiiLight, MochiiLight, MochiiLight, MochiiLight];
  diffuse: MochiiRgb;
  ambient: MochiiRgb;
  specular: MochiiRgb;
  emission: MochiiRgb;
  fog: MochiiRgb;
  clear: MochiiRgb;
};

/** One Black 2-shape lighting set: 15 periods (field sets 200, battle sets 10). */
export type MochiiLightingSet = { periods: MochiiLightPeriod[] }; // length 15

/** Pick the lighting period in force at a day-seconds value: the first
 *  period whose season-adjusted end second is after now (Black 2-shape
 *  field-light selection; the season adjustment itself is a separate
 *  table, owed, not invented here). */
export function mochiiLightingPeriodAt(periods: MochiiLightPeriod[], daySeconds: number, endSeconds: number[]): number {
  for (let i = 0; i < periods.length; i++) {
    const prev = i === 0 ? 0 : endSeconds[i - 1];
    if (prev <= daySeconds && endSeconds[i] > daySeconds) return i;
  }
  return periods.length - 1;
}

// ---------------------------------------------------------------------------
// Zone / map headers (all generations, field lists only)
// ---------------------------------------------------------------------------

/** Black 2-shape zone header: exactly the 14 kept fields from batch B. */
export type MochiiZoneHeader = {
  mapType: number;
  npcCache: number;
  weather: number; // numeric code only; meaning Mars-only
  projection: number; // numeric value only; meaning Mars-only
  camera: number; // numeric value only; meaning Mars-only
  transition: number;
  battleBg: number;
  cycling: boolean;
  escapeRope: boolean;
  flyFrom: boolean;
  fly: { x: number; y: number; z: number };
  camBound: number;
  nameIcon: number;
  easyLevel: number;
};

/** FireRed-shape map header. */
export type MochiiFrMapHeader = {
  layoutId: number;
  regionMapSectionId: number;
  cave: boolean;
  weather: number;
  mapType: number; // 0-9 (see mapping file §6)
  bikingAllowed: boolean;
  allowEscaping: boolean;
  allowRunning: boolean;
  showMapName: boolean;
  floorNum: number;
  battleType: number;
};

/** HeartGold-shape map header (bit widths from the source struct). */
export type MochiiHgMapHeader = {
  wildEncounterBank: number;
  areaDataBank: number;
  matrixId: number;
  dayMusicId: number;
  nightMusicId: number;
  mapSection: number;
  areaIcon: number;
  region: number;
  weather: number; // 7 bits, numeric only
  mapType: number; // 4 bits
  cameraType: number; // 6 bits
  followMode: number; // 2 bits
  battleBg: number; // 5 bits
  bikeAllowed: boolean;
  escapeRopeAllowed: boolean;
  flyAllowed: boolean;
};

/** Platinum-shape map header. */
export type MochiiPtMapHeader = {
  areaDataArchiveId: number;
  matrixId: number;
  dayMusicId: number;
  nightMusicId: number;
  wildEncounterArchiveId: number;
  weather: number; // numeric only
  cameraType: number;
  mapType: number; // 7 bits
  battleBg: number; // 5 bits
  bikeAllowed: boolean;
  runningAllowed: boolean;
  escapeRopeAllowed: boolean;
  flyAllowed: boolean;
};

// ---------------------------------------------------------------------------
// Day / night / seasons / calendar
// ---------------------------------------------------------------------------

/** HeartGold-shape real-time-clock periods by hour. */
export type MochiiRtcPeriod = "late" | "morn" | "day" | "eve" | "nite";
export function mochiiRtcPeriodByHour(hour: number): MochiiRtcPeriod {
  if (hour < 4) return "late";
  if (hour < 10) return "morn";
  if (hour < 17) return "day";
  if (hour < 19) return "eve";
  return "nite";
}
/** HeartGold-shape wild-encounter period mapping: morn / day+eve / nite+late. */
export function mochiiWildPeriodByHour(hour: number): "morn" | "day" | "nite" {
  const p = mochiiRtcPeriodByHour(hour);
  if (p === "morn") return "morn";
  if (p === "day" || p === "eve") return "day";
  return "nite";
}

/** Black 2-shape seasons: (month - 1) % 4, in spring/summer/autumn/winter order. */
export const MOCHII_SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type MochiiSeason = (typeof MOCHII_SEASONS)[number];
export function mochiiSeasonFromMonth(month: number): MochiiSeason {
  return MOCHII_SEASONS[(month - 1) % 4];
}
export function mochiiSeasonNext(season: MochiiSeason): MochiiSeason {
  return MOCHII_SEASONS[(MOCHII_SEASONS.indexOf(season) + 1) % 4];
}
export function mochiiSeasonPrevious(season: MochiiSeason): MochiiSeason {
  return MOCHII_SEASONS[(MOCHII_SEASONS.indexOf(season) + 3) % 4];
}

/** Mochiichao's own day-phase bands (already in the game; kept here so the
 *  cross-gen periods above can be compared against them in one place). */
export function mochiiGameDayPhase(hour: number): "dawn" | "day" | "dusk" | "night" {
  if (hour >= 6 && hour < 10) return "dawn";
  if (hour >= 10 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}
