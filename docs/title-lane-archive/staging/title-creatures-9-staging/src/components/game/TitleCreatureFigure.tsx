import React from 'react';
import TitleScene from './TitleScene';
import mochiiWalkCutout from '../../assets/title/mochii-walk-cutout.png';
import razorgaterWalkCutout from '../../assets/title/razorgater-walk-cutout.png';
import tyrageWalkCutout from '../../assets/title/tyrage-walk-cutout.png';
import kittemberWalkCutout from '../../assets/title/kittember-walk-cutout.png';
import sproutleWalkCutout from '../../assets/title/sproutle-walk-cutout.png';
import dorowaniWalkCutout from '../../assets/title/dorowani-walk-cutout.png';
import gabuWalkCutout from '../../assets/title/gabu-walk-cutout.png';
import wispkinWalkCutout from '../../assets/title/wispkin-walk-cutout.png';
import mytharWalkCutout from '../../assets/title/mythar-walk-cutout.png';

/**
 * TitleCreatureFigure — the other 9/10 title rotation creatures
 * (Mars, 2026-10-25). Yogiferno keeps its own wrapper
 * (YogifernoTitleWalk, PR #33, fire trail on); this wrapper covers
 * the remaining pool, in rotation order, with no fire trail.
 *
 * Each figure is that creature's own Mochiichao 2D sheet, cut to a
 * single walking/standing figure with a scripted pass only
 * (border flood-fill, white-fringe decontamination, 1px alpha
 * feather — the same pass Mars confirmed good for Mochiichao and
 * that produced Yogiferno v2). No Pokemon creature art, no
 * hand-painted figure, no generated likeness.
 *
 * - Mochii: the Mars-confirmed cutout, copied as-is
 *   (380x380, transparent, blue water blob with wave pattern).
 * - Razorgater: 268x285, steel crocodile, front, ground shadow
 *   from the sheet remains under his feet (see note below).
 * - Tyrage: 326x305, front, ground cracks from the sheet remain.
 * - Kittember: 289x312, front, ember tail orb in the cutout.
 * - Sproutle: 261x337, front, goggles + shell.
 * - Dorowani: 269x409, front (sheet cell 2,0), faint sheet
 *   ground-shadow patch remains under her feet, as in the
 *   earlier Dorowani cut — it is in the sheet, not invented.
 * - Gabu: 292x295, front (sheet cell 2,0, grid-line inset).
 * - Wispkin: 288x609, V1 sheet only — white cracked skull face,
 *   black drop body, wisp smoke. Duskfiend is NOT in this pool.
 * - Mythar: 434x350, front, stained-glass wings + halo ring.
 *
 * Shadow note: several of these cutouts still carry the soft
 * ground shadow baked into their sheet cell. That is the sheet's
 * shadow, not a new drawing, and TitleScene's own ground band
 * sits under it. A shadow-separate pass (engine-drawn shadow,
 * baked shadow stripped) is a later cleanup, not claimed here.
 * Biome is left at TitleScene's default — per-creature biome
 * assignment belongs to the title-backgrounds batch, not this one.
 */
const FIGURES: Record<string, { url: string; size: string }> = {
  Mochii: { url: mochiiWalkCutout, size: '380x380' },
  Razorgater: { url: razorgaterWalkCutout, size: '268x285' },
  Tyrage: { url: tyrageWalkCutout, size: '326x305' },
  Kittember: { url: kittemberWalkCutout, size: '289x312' },
  Sproutle: { url: sproutleWalkCutout, size: '261x337' },
  Dorowani: { url: dorowaniWalkCutout, size: '269x409' },
  Gabu: { url: gabuWalkCutout, size: '292x295' },
  Wispkin: { url: wispkinWalkCutout, size: '288x609' },
  Mythar: { url: mytharWalkCutout, size: '434x350' },
};

export default function TitleCreatureFigure({ name }: { name: string }) {
  const fig = FIGURES[name];
  if (!fig) return null;
  return (
    <TitleScene
      figureUrl={fig.url}
      figureAlt={`${name} title figure`}
      caption={`${name} — clean cutout (${fig.size}, transparent) + Pixi sine sway. No fire trail; Wispkin smoke and Mythar halo are in their cutouts.`}
    />
  );
}
