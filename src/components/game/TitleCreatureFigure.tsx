import React from 'react';
import TitleScene from './TitleScene';
import { primaryCardForCreature } from '../../lib/titleCardEffects';
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
 * - Razorgater: 265x266, steel crocodile, front. Baked
 *   ground shadow removed (rembg u2netp, 2026-10-25 fix;
 *   GrabCut left the shadow in and was rejected for him).
 *   Eye-colour drift NOT decided here (main sheet red eyes
 *   vs angles sheets blue eyes — Mars to pick).
 * - Tyrage: 327x305, front, ground cracks from the sheet remain.
 *   White spot between feet removed, baked shadow removed
 *   (rembg u2netp, 2026-10-25 white-spot/shadow fix).
 * - Kittember: 287x304, front, ember tail orb in the cutout.
 *   White wedge between head and tail removed, baked shadow
 *   removed (rembg u2netp, 2026-10-25 fix; two tiny satellite
 *   bubbles lost their orange fill in the model pass, noted).
 * - Sproutle: 259x333, front, goggles + shell. White spot
 *   between feet removed, baked shadow removed
 *   (rembg u2netp, 2026-10-25 fix).
 * - Dorowani: 263x398, front (sheet cell 2,0). White spot
 *   between legs removed, baked shadow removed
 *   (OpenCV GrabCut, 2026-10-25 fix — u2netp damaged her belly
 *   and was rejected for her, GrabCut was clean).
 * - Gabu: 292x295, front (sheet cell 2,0, grid-line inset).
 * - Wispkin: 288x609, V1 sheet only — white cracked skull face,
 *   black drop body, wisp smoke. Duskfiend is NOT in this pool.
 * - Mythar: 434x350, front, stained-glass wings + halo ring.
 *
 * Shadow note: Tyrage, Kittember, Sproutle, Dorowani and
 * now Razorgater no longer carry a baked sheet shadow
 * (2026-10-25 fixes above; Pokemon-first: FireRed draws
 * shadow as a separate 32x8 sprite, gEnemyMonShadow_Gfx /
 * PALTAG_SHADOW, not baked into the battler sprite —
 * engine-drawn shadow is the later layer, not claimed here).
 * Wispkin (wisp smoke), Mythar (halo ring) and Yogiferno
 * (fire halo) carry design elements, not ground shadows,
 * verified on black; Gabu was confirmed fine by Mars and
 * is untouched. No title cutout in the 10-pool now carries
 * a baked ground shadow.
 * Biome assignment (title-backgrounds batch, 2026-10-25; corrected
 * by Mars ~23:44 CDT): each creature now shows on its own card
 * from titleCardEffects (primaryCardForCreature), with its
 * per-card effect and its own action burst. Wispkin is on night
 * (purple), Dorowani on water, Mochii on rain; Gabu is NOT on
 * water and fills forest only as a proposed fill until Mars names
 * his card; Kittember (night) is still PROPOSED, not canon.
 * 8 cards, 10 creatures, night holds 3, no card empty.
 */
const FIGURES: Record<string, { url: string; size: string }> = {
  Mochii: { url: mochiiWalkCutout, size: '380x380' },
  Razorgater: { url: razorgaterWalkCutout, size: '265x266' },
  Tyrage: { url: tyrageWalkCutout, size: '327x305' },
  Kittember: { url: kittemberWalkCutout, size: '287x304' },
  Sproutle: { url: sproutleWalkCutout, size: '259x333' },
  Dorowani: { url: dorowaniWalkCutout, size: '263x398' },
  Gabu: { url: gabuWalkCutout, size: '292x295' },
  Wispkin: { url: wispkinWalkCutout, size: '288x609' },
  Mythar: { url: mytharWalkCutout, size: '434x350' },
};

export default function TitleCreatureFigure({ name }: { name: string }) {
  const fig = FIGURES[name];
  if (!fig) return null;
  return (
    <TitleScene
      biome={primaryCardForCreature(name) ?? 'snow'}
      figureUrl={fig.url}
      figureAlt={`${name} title figure`}
      figureName={name}
      caption={`${name} — clean cutout (${fig.size}, transparent) on its ${primaryCardForCreature(name) ?? 'snow'} card + Pixi sine sway + ${name} action burst. No fire trail; Wispkin smoke and Mythar halo are in their cutouts.`}
    />
  );
}
