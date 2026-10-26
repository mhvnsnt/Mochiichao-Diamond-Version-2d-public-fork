// Title card motion + effects + creature assignment (Mars, 2026-10-25).
//
// Structure first, from the real decomp files (no Pokemon art, code,
// or names are copied — only the layer/timing structure):
//   - FireRed src/intro.c scene 3: a fight shot in this order —
//     entrance, bounce/hop, cries, attacks (swipe sprites), recoil
//     dust, zooms. The creature action cycle below follows that
//     order: idle -> hop -> effect burst -> recoil -> idle.
//   - HeartGold intro_movie_scene_2: flyover layers scroll at
//     DIFFERENT speeds (MAIN1 0x140, MAIN0 0xC0, MAIN2 0x40) —
//     far layers move slowest, near layers fastest. The painted
//     background is the far layer, so its drift is the smallest
//     amplitude in the scene; weather/particles (near layers) move
//     faster. That ordering is what TITLE_BIOME_MOTION encodes.
//   - HeartGold title flash (0 show / 30 hide / 45 cycle) and Ruby
//     shine are the models for the rain lightning flash and the
//     stone scan-line sweep: a periodic, frame-counted overlay,
//     not a random flicker.
//   - PixiJS v8 DisplacementFilter (official Pixi docs) is the
//     water-ripple route, and it IS wired in TitleScene for the
//     water card only: the displacement map is generated in code
//     (64x64 random grayscale upscaled to 256x256, repeat wrap),
//     so no displacement texture asset is shipped. Ripple rings +
//     shimmer stay as the fallback if the filter fails.
//
// Per-biome drift values are assistant proposals from the HG
// speed ratios above, not Mars-approved numbers — they live in
// this one data file so Mars can change a single number per card.
// Overscan rule: TitleScene scales the painting cover x 1.06, so
// at the 180px host height the safe drift is ~10px vertical and
// ~21px horizontal; every amp below stays inside that margin, so
// drift can never reveal an edge.
//
// Creature-to-card assignment: sources are labelled per creature.
// 'canon-vfx' = the creature's own manifest VFX / element in the
// repo. 'canon-habitat' = a habitat Mars stated in titleRotation.
// 'title-vibe' = the vibe line Mars approved in titleRotation.
// 'proposed' = NO canon source yet — Mars has not confirmed it,
// and the mapping is shown to him first for correction. A
// proposed mapping is data in this file only; changing it is a
// one-line edit, not a code change.
// 'mars-confirmed' = Mars stated this placement himself in chat
// (quoted in the sourceNote), not an assistant inference.
// Card count, plain: there are 10 cards and 10 title-pool
// creatures, one creature per card — the two cards Mars said
// were missing are now built (batch 6), so the old "8 cards,
// night holds 3" model is superseded and must not be quoted.
// Corrections (Mars, 2026-10-25 ~23:44 CDT): Wispkin goes on the
// purple/night card (was forest in batch 3); Dorowani goes on
// water; Gabu does NOT go on water; Mochii goes on rain.
// Corrections (Mars, 2026-10-26 ~00:14 CDT): Mythar gets his OWN
// card — pearlescent iridescent diamond-pearl background with
// sparkles and sine waves, real sparkly and diamond-like (his
// description from 2026-10-25, recovered from memory: "pearl /
// diamond iridescent — sine-wave rings, diamond sparkles").
// Kittember gets his OWN card too — a night card with lanterns
// surrounding it, illuminating the area, while Kittember's ember
// also illuminates the area. Night keeps Wispkin only.
// Confirmation (Mars, 2026-10-26 ~00:15 CDT): "Gabu is good for
// forest." Forest is canon for Gabu, no longer a proposed fill.
import type { TitleBiomeId } from './titleBiomes';

export interface TitleBiomeMotion {
  ampX: number; // horizontal drift amplitude, px at the 180px host
  ampY: number; // vertical drift amplitude, px
  speed: number; // sine speed, radians per second
  note: string;
}

export const TITLE_BIOME_MOTION: Record<TitleBiomeId, TitleBiomeMotion> = {
  snow:   { ampX: 10, ampY: 3, speed: 0.25, note: 'Slow far-layer drift; snowfall weather is the fast near layer.' },
  grass:  { ampX: 8,  ampY: 2, speed: 0.35, note: 'Fastest horizontal drift, matching the HG flyover layer speed order.' },
  water:  { ampX: 4,  ampY: 6, speed: 0.50, note: 'Vertical-first drift: the water itself heaves, the shore does not slide.' },
  sand:   { ampX: 10, ampY: 2, speed: 0.30, note: 'Horizontal dust drift; the dune line slides like wind-blown sand.' },
  stone:  { ampX: 0,  ampY: 0, speed: 0,    note: 'Rock is steady, intentionally: no drift, so the scan + motes read against still stone.' },
  forest: { ampX: -5, ampY: 2, speed: 0.22, note: 'Slow reverse drift: canopy sway against the leaf weather.' },
  rain:   { ampX: 2,  ampY: 6, speed: 0.40, note: 'Downward-first drift with the rain; lightning flash is the card effect, not the drift.' },
  night:  { ampX: -3, ampY: 1, speed: 0.12, note: 'Slowest drift of all: night sky barely moves, stars twinkle instead.' },
  mythar: { ampX: -2, ampY: 2, speed: 0.15, note: 'Slow prism drift: the pearl shifts, the diamond sparkles are the card effect, not the drift.' },
  lantern:{ ampX: -3, ampY: 1, speed: 0.12, note: 'Night-slow drift; lantern glow pulse is the card effect, not the drift.' },
};

export type TitleCardEffectKind =
  | 'twinkle' | 'ripple' | 'scan' | 'lightning' | 'fireflies'
  | 'splash' | 'dustmotes' | 'pollen';

export interface TitleCardEffect {
  kind: TitleCardEffectKind;
  color: number;
  count: number;
  note: string;
}

// One signature effect per card, on top of the biome weather that
// already runs (snowfall, leaves, dust, rain). The effect layer
// draws AFTER the figure, so it reads as happening in front of
// the scene, like a title-screen overlay — never behind it.
export const TITLE_CARD_EFFECTS: Record<TitleBiomeId, TitleCardEffect> = {
  snow:   { kind: 'twinkle',   color: 0xffffff, count: 12, note: 'Ice sparkles pulsing in the snow, alpha sine, no movement.' },
  grass:  { kind: 'pollen',    color: 0xfde68a, count: 10, note: 'Warm pollen glow dots drifting up over the grass.' },
  water:  { kind: 'ripple',    color: 0x7dd3fc, count: 3,  note: 'Expanding ripple rings from the shore line, fading as they grow.' },
  sand:   { kind: 'dustmotes', color: 0xfde68a, count: 10, note: 'Slow dust motes drifting across still dunes.' },
  stone:  { kind: 'scan',      color: 0x22d3ee, count: 1,  note: 'Chrome scan-line sweep (Razorgater card only); other figures get dust motes instead.' },
  forest: { kind: 'fireflies', color: 0xa3e635, count: 10, note: 'Fireflies pulsing and drifting up under the canopy.' },
  rain:   { kind: 'lightning', color: 0xffffff, count: 1,  note: 'Frame-counted white flash every 420 frames + ground splashes; no random flicker.' },
  night:  { kind: 'twinkle',   color: 0xfde68a, count: 16, note: 'Stars twinkling, warm gold, alpha sine; the moon glow is the painting itself.' },
  mythar: { kind: 'twinkle',   color: 0xffffff, count: 18, note: 'Diamond sparkles pulsing, white + gold, alpha sine; sine waves + pearl haze are the painting itself.' },
  lantern:{ kind: 'twinkle',   color: 0xfbbf24, count: 14, note: 'Lantern glow pulsing, warm amber, alpha sine; the lantern shapes + Kittember ember are the painting + figure.' },
};

export type CardSource = 'canon-vfx' | 'canon-habitat' | 'title-vibe' | 'proposed' | 'mars-confirmed';

export interface TitleCardCreature {
  name: string;
  source: CardSource;
  sourceNote: string;
}

export const TITLE_CARD_CREATURES: Record<TitleBiomeId, TitleCardCreature[]> = {
  snow: [
    { name: 'Yogiferno', source: 'canon-habitat', sourceNote: 'titleRotation habitat list includes snow/ice regions; YogifernoTitleWalk snow variant already shipped.' },
  ],
  grass: [
    { name: 'Sproutle', source: 'canon-vfx', sourceNote: 'Flora/Chrome grass starter; title-vibe "fresh sprout".' },
  ],
  water: [
    { name: 'Dorowani', source: 'title-vibe', sourceNote: 'Mars 2026-10-25: Dorowani goes on water. Title-vibe "blue water starter"; no canon VFX in the manifests yet (Gen 2, #147).' },
  ],
  sand: [
    { name: 'Tyrage', source: 'canon-vfx', sourceNote: 'Core desert kaiju; manifest VFX: sheds sand, roar kicks up a dust storm.' },
  ],
  stone: [
    { name: 'Razorgater', source: 'canon-vfx', sourceNote: 'Chrome; manifest VFX: scanning lasers, attack sparks blue electricity.' },
  ],
  forest: [
    { name: 'Gabu', source: 'mars-confirmed', sourceNote: 'Mars 2026-10-26 ~00:15 CDT: "Gabu is good for forest." Forest is canon for Gabu, no longer a proposed fill.' },
  ],
  rain: [
    { name: 'Mochii', source: 'canon-vfx', sourceNote: 'Mars 2026-10-25: rain card can be Mochii. Aqua; manifest VFX: glides, ripple trail, bubbles pop; title-vibe "Boot Harbor dawn".' },
  ],
  night: [
    { name: 'Wispkin', source: 'canon-vfx', sourceNote: 'Mars 2026-10-25: Wispkin goes on the purple/night card (was forest in batch 3). Umbral; manifest VFX: bobs rhythmically, dark smoke sheds; evolves into Duskfiend, guardian of the dark forest.' },
  ],
  mythar: [
    { name: 'Mythar', source: 'mars-confirmed', sourceNote: 'Mars 2026-10-26 ~00:14 CDT: Mythar gets his OWN card — pearlescent iridescent diamond-pearl background with sparkles and sine waves, real sparkly and diamond-like (his 2026-10-25 description, recovered from memory). Manifest VFX: never touches ground, three golden rings orbit, roar is a harmonic chime (visual rings only here, no audio).' },
  ],
  lantern: [
    { name: 'Kittember', source: 'mars-confirmed', sourceNote: 'Mars 2026-10-26 ~00:14 CDT: Kittember gets his OWN card — a night card with lanterns surrounding it, illuminating the area, while Kittember (ember) also illuminates the area. Fire feline, ember tail orb.' },
  ],
};

/** First card a creature belongs to, or null when unassigned. */
export function primaryCardForCreature(name: string): TitleBiomeId | null {
  const ids = Object.keys(TITLE_CARD_CREATURES) as TitleBiomeId[];
  for (const id of ids) {
    if (TITLE_CARD_CREATURES[id].some((c) => c.name === name)) return id;
  }
  return null;
}

export type CreatureActionKind =
  | 'bounce' | 'hop' | 'glide' | 'bob' | 'scan' | 'roar' | 'shield' | 'orbit';

export type CreatureBurstKind =
  | 'bubbles' | 'sparks' | 'sand' | 'smoke' | 'fire' | 'sparkle' | 'shield' | 'none';

export interface CreatureAction {
  action: CreatureActionKind;
  burst: CreatureBurstKind;
  color: number;
  note: string;
}

// One action per title-pool creature, from its own manifest VFX
// where one exists. 'none' bursts are not used: every creature in
// the pool has a visible effect, even if only its card's effect.
export const CREATURE_ACTIONS: Record<string, CreatureAction> = {
  Mochii:      { action: 'glide',  burst: 'bubbles', color: 0x38bdf8, note: 'Manifest: glides, ripple trail, bubbles pop on emote.' },
  Razorgater:  { action: 'scan',   burst: 'sparks',  color: 0x22d3ee, note: 'Manifest: scanning lasers, attack sparks blue electricity.' },
  Tyrage:      { action: 'roar',   burst: 'sand',    color: 0xd2b48c, note: 'Manifest: roar kicks up a dust storm, sand sheds from joints.' },
  Kittember:   { action: 'bounce', burst: 'fire',    color: 0xf97316, note: 'Title-vibe ember tail orb; fire burst is the card reading, no canon VFX in manifests.' },
  Sproutle:    { action: 'shield', burst: 'shield',  color: 0x4ade80, note: 'Manifest: ducks in helmet-shell, hexagonal energy shield.' },
  Dorowani:    { action: 'glide',  burst: 'bubbles', color: 0x60a5fa, note: 'Title-vibe blue water starter; bubbles follow the Mochii water line, no canon VFX yet.' },
  Gabu:        { action: 'hop',    burst: 'bubbles', color: 0x2dd4bf, note: 'Mars-confirmed forest card; teal hop + bubbles.' },
  Wispkin:     { action: 'bob',    burst: 'smoke',   color: 0xa855f7, note: 'Manifest: bobs rhythmically, dark smoke sheds from tail.' },
  Yogiferno:   { action: 'roar',   burst: 'fire',    color: 0xf97316, note: 'Manifest: fire halo, attack dims the environment; the burst + fire trail carry it visually, no audio.' },
  Mythar:      { action: 'orbit',  burst: 'sparkle', color: 0xf0eee4, note: 'Manifest: never touches ground, three golden rings orbit; sparkle burst stands in for the ring flash.' },
};

// FireRed intro scene 3 order, as a frame cycle (60fps ticks):
// idle (0-239) -> hop (240-269) -> burst at 270 -> recoil (270-281)
// -> settle (282-359) -> idle again. 360 frames = 6 seconds.
export const CREATURE_ACTION_CYCLE_FRAMES = 360;
export const CREATURE_ACTION_HOP_START = 240;
export const CREATURE_ACTION_HOP_FRAMES = 30;
export const CREATURE_ACTION_BURST_FRAME = 270;
export const CREATURE_ACTION_RECOIL_FRAMES = 12;

export interface CreatureActionFrame {
  /** Upward hop offset, px (0 outside the hop window). */
  hopY: number;
  /** Scale multiplier during the action (1 outside it). */
  scaleMul: number;
  /** True exactly on the burst frame. */
  burst: boolean;
  /** Backward recoil offset, px (0 outside the recoil window). */
  recoilX: number;
}

export function creatureActionFrame(frameInt: number): CreatureActionFrame {
  const c = ((frameInt % CREATURE_ACTION_CYCLE_FRAMES) + CREATURE_ACTION_CYCLE_FRAMES) % CREATURE_ACTION_CYCLE_FRAMES;
  let hopY = 0;
  let scaleMul = 1;
  let recoilX = 0;
  if (c >= CREATURE_ACTION_HOP_START && c < CREATURE_ACTION_HOP_START + CREATURE_ACTION_HOP_FRAMES) {
    const p = (c - CREATURE_ACTION_HOP_START) / CREATURE_ACTION_HOP_FRAMES;
    hopY = Math.sin(Math.PI * p) * 18;
    scaleMul = 1 + Math.sin(Math.PI * p) * 0.04;
  }
  if (c >= CREATURE_ACTION_BURST_FRAME && c < CREATURE_ACTION_BURST_FRAME + CREATURE_ACTION_RECOIL_FRAMES) {
    const p = (c - CREATURE_ACTION_BURST_FRAME) / CREATURE_ACTION_RECOIL_FRAMES;
    recoilX = -6 * (1 - p);
  }
  return { hopY, scaleMul, burst: c === CREATURE_ACTION_BURST_FRAME, recoilX };
}
