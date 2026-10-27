/**
 * Creature Mode Pass 8 — Garden Form palette sheets, 001/004/007/010.
 *
 * These are PALETTE SWAPS, labelled as such, not hand-drawn sheets:
 * each species' walk down_0 frame is blended toward its Garden Form
 * palette (Pass 5 palettes: Bright = white/gold, Umbral =
 * black/purple, Neutral = base colour) with alpha preserved.
 * Bright: blend 0.40 toward (255,240,190). Umbral: blend 0.35
 * toward (124,58,237), darkened 0.85. Neutral: the base frame
 * unchanged. A hand-drawn full palette atlas per form is still
 * sprite-lane production if Mars wants one later; these sheets
 * are the wired, in-game palette representation now.
 */
import mochii_bright from '../assets/garden-form-palettes/mochii_bright.png';
import mochii_umbral from '../assets/garden-form-palettes/mochii_umbral.png';
import mochii_neutral from '../assets/garden-form-palettes/mochii_neutral.png';
import razorgater_bright from '../assets/garden-form-palettes/razorgater_bright.png';
import razorgater_umbral from '../assets/garden-form-palettes/razorgater_umbral.png';
import razorgater_neutral from '../assets/garden-form-palettes/razorgater_neutral.png';
import tyrage_bright from '../assets/garden-form-palettes/tyrage_bright.png';
import tyrage_umbral from '../assets/garden-form-palettes/tyrage_umbral.png';
import tyrage_neutral from '../assets/garden-form-palettes/tyrage_neutral.png';
import kittember_bright from '../assets/garden-form-palettes/kittember_bright.png';
import kittember_umbral from '../assets/garden-form-palettes/kittember_umbral.png';
import kittember_neutral from '../assets/garden-form-palettes/kittember_neutral.png';

export type PaletteAlignment = 'Bright' | 'Umbral' | 'Neutral';

const PALETTE_SHEETS: Record<string, Record<PaletteAlignment, string>> = {
  '001': { Bright: mochii_bright, Umbral: mochii_umbral, Neutral: mochii_neutral },
  '004': { Bright: razorgater_bright, Umbral: razorgater_umbral, Neutral: razorgater_neutral },
  '007': { Bright: tyrage_bright, Umbral: tyrage_umbral, Neutral: tyrage_neutral },
  '010': { Bright: kittember_bright, Umbral: kittember_umbral, Neutral: kittember_neutral },
};

export function creaturePaletteSheetUrl(speciesId: string, alignment: string): string | null {
  const entry = PALETTE_SHEETS[speciesId];
  if (!entry) return null;
  return entry[(alignment as PaletteAlignment) in entry ? (alignment as PaletteAlignment) : 'Neutral'];
}
