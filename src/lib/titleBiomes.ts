// Title scene biomes — generic terrain / weather only.
// Layout is traced from Pokemon title screens (background layer,
// ground band, creature layer, weather/particle layer, fade).
// Content is Mochiichao-original: colours and shapes drawn in
// Pixi code here, NO Pokemon creature art, logo, name, dialogue
// or music, and NO Pokemon texture file is shipped. A biome is
// a palette + a weather kind + ground kind, nothing else.
// Painted backgrounds (batch 1: snow, grass, water, sand; batch 2:
// stone, forest, rain, night; batch 6: mythar pearl, lantern night
// — all 10 now set): when backgroundImage is set,
// TitleScene draws that original 1600x900 painting as layer 0 and
// the Pixi sky/ground rectangles below are skipped; when it is
// null, TitleScene falls back to those rectangles, so no biome
// regresses. Paintings carry no text and keep the title centre
// (logo / creature slot / press line) as smooth haze.
import snowBg from '../assets/title/title-bg-snow-v2.png';
import grassBg from '../assets/title/title-bg-grass-v2.png';
import waterBg from '../assets/title/title-bg-water-v2.png';
import sandBg from '../assets/title/title-bg-sand-v2.png';
import stoneBg from '../assets/title/title-bg-stone-v2.png';
import forestBg from '../assets/title/title-bg-forest-v2.png';
import rainBg from '../assets/title/title-bg-rain-v2.png';
import nightBg from '../assets/title/title-bg-night-v2.png';
import mytharBg from '../assets/title/title-bg-mythar-v2.png';
import lanternBg from '../assets/title/title-bg-lantern-v2.png';
export type TitleBiomeId =
  | 'snow' | 'grass' | 'water' | 'sand' | 'stone'
  | 'forest' | 'rain' | 'night' | 'mythar' | 'lantern';

export interface TitleBiome {
  id: TitleBiomeId;
  label: string;
  sky: number;
  sky2: number;
  ground: number;
  groundLine: number;
  weather: 'snow' | 'rain' | 'none' | 'dust' | 'leaves';
  weatherCount: number;
  tufts: boolean; // grass / reed tufts on the ground band
  shimmer: boolean; // water shimmer line
  /** Original painted background, or null until its batch lands. */
  backgroundImage: string | null;
}

export const TITLE_BIOMES: Record<TitleBiomeId, TitleBiome> = {
  snow:   { id: 'snow',   label: 'Snow — white ground, falling snow',        sky: 0x0b1226, sky2: 0x1e3a5f, ground: 0xf8fafc, groundLine: 0xbae6fd, weather: 'snow',  weatherCount: 40, tufts: false, shimmer: false, backgroundImage: snowBg },
  grass:  { id: 'grass',  label: 'Grass — green ground, drifting leaves',    sky: 0x87ceeb, sky2: 0xdbeafe, ground: 0x4ade80, groundLine: 0x166534, weather: 'leaves', weatherCount: 18, tufts: true,  shimmer: false, backgroundImage: grassBg },
  water:  { id: 'water',  label: 'Water — blue shore, shimmer',              sky: 0x7dd3fc, sky2: 0xe0f2fe, ground: 0x38bdf8, groundLine: 0x0ea5e9, weather: 'none',   weatherCount: 0,  tufts: false, shimmer: true, backgroundImage: waterBg },
  sand:   { id: 'sand',   label: 'Desert sand — dust drift',                 sky: 0xfde68a, sky2: 0xfff7ed, ground: 0xfacc15, groundLine: 0xb45309, weather: 'dust',  weatherCount: 16, tufts: false, shimmer: false, backgroundImage: sandBg },
  stone:  { id: 'stone',  label: 'Mountain stone — grey rock ground',        sky: 0x94a3b8, sky2: 0xe2e8f0, ground: 0x64748b, groundLine: 0x334155, weather: 'none',   weatherCount: 0,  tufts: false, shimmer: false, backgroundImage: stoneBg },
  forest: { id: 'forest', label: 'Forest — dark green, drifting leaves',     sky: 0x14532d, sky2: 0x166534, ground: 0x22c55e, groundLine: 0x052e16, weather: 'leaves', weatherCount: 22, tufts: true,  shimmer: false, backgroundImage: forestBg },
  rain:   { id: 'rain',   label: 'Rain — grey sky, falling rain',            sky: 0x334155, sky2: 0x64748b, ground: 0x475569, groundLine: 0x0f172a, weather: 'rain',  weatherCount: 50, tufts: false, shimmer: true, backgroundImage: rainBg },
  night:  { id: 'night',  label: 'Night — dark ground, no weather',          sky: 0x0f172a, sky2: 0x1e293b, ground: 0x0f172a, groundLine: 0x134e4a, weather: 'none',   weatherCount: 0,  tufts: false, shimmer: false, backgroundImage: nightBg },
  mythar: { id: 'mythar', label: 'Mythar — pearlescent diamond pearl, sine waves, sparkles', sky: 0xf0eee4, sky2: 0xe8e4f2, ground: 0xdedad8, groundLine: 0xd4af37, weather: 'none', weatherCount: 0, tufts: false, shimmer: false, backgroundImage: mytharBg },
  lantern:{ id: 'lantern',label: 'Lantern night — dark night, lanterns illuminating, ember glow', sky: 0x0f172a, sky2: 0x1e293b, ground: 0x0f172a, groundLine: 0xf59e0b, weather: 'none', weatherCount: 0, tufts: false, shimmer: false, backgroundImage: lanternBg },
};

export const TITLE_BIOME_LIST: TitleBiome[] = Object.values(TITLE_BIOMES);
