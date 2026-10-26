// Title action-shot drafts + per-card animation styles.
//
// DRAFTS (Mars, 2026-10-26 ~06:52-06:55 CDT): the 10 action shots shown
// to Mars on 2026-10-26 are saved in the repo EXACTLY as shown, as
// DRAFTS, under draft- filenames. They are never overwritten: the
// animated versions that come next use DIFFERENT filenames
// (<creature>-action-anim-v1.png), so a draft stays a draft forever.
//
// HOW A DRAFT WAS MADE (saved setup, see also
// docs/title-action-shots-layer-setup.md):
//   L0  card background PNG (the v2 painting for that card)
//   L1  card effect (the card's effect from titleCardEffects.ts)
//   L2  the creature's existing clean walk cutout only - no redraw,
//       no new likeness, no text, no logo, no font, no menu windows
//   L3  action burst at the FireRed intro scene-3 burst moment
//       (hop -> burst at frame 270 -> recoil -> settle, 360-frame cycle)
//   L4  foreground frame in front of the figure's feet
// Draft placement: every draft centres the figure horizontally, feet
// on the card ground line, at the burst moment. The staging worker
// did not save per-pixel placement numbers for 9 of the 10 drafts, so
// this file does NOT invent them - it records centre + ground line +
// burst moment, which is what the PNGs show. The one exact placement
// on file is Gabu v2 (built 2026-10-26, leaves correction):
// cutout 292x295 scaled to 554x560, x 523, y 122, feet y 700, hop -18.
//
// ANIMATION STYLES (proposal for the next, animated versions, Mars
// 2026-10-26 ~06:55 CDT): each card gets its OWN placement and its OWN
// animation style, NOT all placed the same. Rest X is the figure's
// position after the entrance, relative to screen centre (1600-wide
// draft frame): negative = left, positive = right, 0 = stays centre.
// The entrance is the same shape for every card (centre entrance,
// then move to its rest side), the action and the effects are per-card.
// See docs/title-action-shots-layer-setup.md for the Pokemon-file
// research behind the entrance + press-start tempo, and for what is
// Pokemon canon vs what is a Mochiichao adaptation.

import type { CreatureAction } from './titleCardEffects';

export interface TitleActionShotDraft {
  creature: string;
  card: string;
  backgroundImage: string;
  cutout: string;
  draftFile: string;
  draftBytes: number;
  burst: CreatureAction['burst'];
  burstNote: string;
  draftPlacement: string;
  /** Filename pattern for the animated version - never the draft name. */
  animFilePattern: string;
}

export interface TitleCardAnimationStyle {
  creature: string;
  card: string;
  /** Rest position after entrance, px from screen centre. 0 = stays centre. */
  restX: number;
  entrance: string;
  actionLoop: string;
  effectsMoveWithFigure: string;
  story: string;
}

export const TITLE_ACTION_SHOT_DRAFTS: TitleActionShotDraft[] = [
  { creature: 'Yogiferno', card: 'snow', backgroundImage: 'src/assets/title/title-bg-snow-v2.png', cutout: 'src/assets/title/yogiferno-walk-cutout.png', draftFile: 'src/assets/title/draft-yogiferno-action-shot-v1.png', draftBytes: 626683, burst: 'fire', burstNote: 'Roar + fire burst.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'yogiferno-action-anim-v1.png' },
  { creature: 'Sproutle', card: 'grass', backgroundImage: 'src/assets/title/title-bg-grass-v2.png', cutout: 'src/assets/title/sproutle-walk-cutout.png', draftFile: 'src/assets/title/draft-sproutle-action-shot-v1.png', draftBytes: 640462, burst: 'shield', burstNote: 'Shield + shield ring.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'sproutle-action-anim-v1.png' },
  { creature: 'Dorowani', card: 'water', backgroundImage: 'src/assets/title/title-bg-water-v2.png', cutout: 'src/assets/title/dorowani-walk-cutout.png', draftFile: 'src/assets/title/draft-dorowani-action-shot-v1.png', draftBytes: 611825, burst: 'bubbles', burstNote: 'Glide + bubbles.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'dorowani-action-anim-v1.png' },
  { creature: 'Tyrage', card: 'sand', backgroundImage: 'src/assets/title/title-bg-sand-v2.png', cutout: 'src/assets/title/tyrage-walk-cutout.png', draftFile: 'src/assets/title/draft-tyrage-action-shot-v2.png', draftBytes: 647846, burst: 'sand', burstNote: 'Roar + sand storm. v2 is the draft; v1 (faint sand) stays staging-only and is NOT in the repo.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'tyrage-action-anim-v1.png' },
  { creature: 'Razorgater', card: 'stone', backgroundImage: 'src/assets/title/title-bg-stone-v2.png', cutout: 'src/assets/title/razorgater-walk-cutout.png', draftFile: 'src/assets/title/draft-razorgater-action-shot-v1.png', draftBytes: 549926, burst: 'sparks', burstNote: 'Scan + sparks.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'razorgater-action-anim-v1.png' },
  { creature: 'Gabu', card: 'forest', backgroundImage: 'src/assets/title/title-bg-forest-v2.png', cutout: 'src/assets/title/gabu-walk-cutout.png', draftFile: 'src/assets/title/draft-gabu-action-shot-v2.png', draftBytes: 539790, burst: 'leaves', burstNote: 'Hop + LEAVES (Mars 2026-10-26 ~06:52 CDT: leaves instead of bubbles). v1 bubbles stays staging-only and is NOT in the repo.', draftPlacement: 'Exact on file: cutout 292x295 scaled 554x560, x 523, y 122, feet y 700, hop -18.', animFilePattern: 'gabu-action-anim-v1.png' },
  { creature: 'Mochii', card: 'rain', backgroundImage: 'src/assets/title/title-bg-rain-v2.png', cutout: 'src/assets/title/mochii-walk-cutout.png', draftFile: 'src/assets/title/draft-mochii-action-shot-v1.png', draftBytes: 598160, burst: 'bubbles', burstNote: 'Glide + bubbles.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'mochii-action-anim-v1.png' },
  { creature: 'Wispkin', card: 'night', backgroundImage: 'src/assets/title/title-bg-night-v2.png', cutout: 'src/assets/title/wispkin-walk-cutout.png', draftFile: 'src/assets/title/draft-wispkin-action-shot-v1.png', draftBytes: 521600, burst: 'smoke', burstNote: 'Bob + smoke.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'wispkin-action-anim-v1.png' },
  { creature: 'Mythar', card: 'mythar', backgroundImage: 'src/assets/title/title-bg-mythar-v2.png', cutout: 'src/assets/title/mythar-walk-cutout.png', draftFile: 'src/assets/title/draft-mythar-action-shot-v1.png', draftBytes: 1058616, burst: 'sparkle', burstNote: 'Orbit + sparkle. Hovers, feet 90px above ground line, never grounds.', draftPlacement: 'Centre, hovering, burst moment.', animFilePattern: 'mythar-action-anim-v1.png' },
  { creature: 'Kittember', card: 'lantern', backgroundImage: 'src/assets/title/title-bg-lantern-v2.png', cutout: 'src/assets/title/kittember-walk-cutout.png', draftFile: 'src/assets/title/draft-kittember-action-shot-v1.png', draftBytes: 512929, burst: 'fire', burstNote: 'Bounce + fire.', draftPlacement: 'Centre, feet on ground line, burst moment.', animFilePattern: 'kittember-action-anim-v1.png' },
];

export const TITLE_CARD_ANIMATION_STYLES: TitleCardAnimationStyle[] = [
  { creature: 'Yogiferno', card: 'snow', restX: -140, entrance: 'Centre entrance, slide left to rest.', actionLoop: 'Roar, fire halo pulses, fire burst at the burst beat.', effectsMoveWithFigure: 'Snow twinkle + fire trail follow the figure to the left side.', story: 'A snow creature that roars fire - cold outside, fire inside.' },
  { creature: 'Sproutle', card: 'grass', restX: 140, entrance: 'Centre entrance, hop right to rest.', actionLoop: 'Ducks into shell, hexagonal shield ring expands.', effectsMoveWithFigure: 'Pollen drifts up from the figure at the right side.', story: 'A small guarded sprout - defence as its personality.' },
  { creature: 'Dorowani', card: 'water', restX: -140, entrance: 'Centre entrance, glide left to rest.', actionLoop: 'Glide, bubbles rise, ripple rings spread from the shore.', effectsMoveWithFigure: 'Bubbles and ripples follow the figure to the left side.', story: 'A water starter gliding in - calm water, moving life.' },
  { creature: 'Tyrage', card: 'sand', restX: 140, entrance: 'Centre entrance, stomp right to rest.', actionLoop: 'Roar, sand storm kicks up at the feet and to the right.', effectsMoveWithFigure: 'Dust motes and sand follow the figure to the right side.', story: 'A desert roarer - the ground itself is part of the show.' },
  { creature: 'Razorgater', card: 'stone', restX: -140, entrance: 'Centre entrance, step left to rest.', actionLoop: 'Scan line sweeps left to right, sparks fly.', effectsMoveWithFigure: 'Scan line and sparks stay on the figure at the left side.', story: 'A stone scanner - it reads the world before it fights.' },
  { creature: 'Gabu', card: 'forest', restX: -140, entrance: 'Centre entrance, hop left to rest.', actionLoop: 'Hop, leaves swirl around (NOT bubbles).', effectsMoveWithFigure: 'Leaves + forest fireflies follow the figure to the left side.', story: 'A forest turtle - the forest moves with him, in leaves.' },
  { creature: 'Mochii', card: 'rain', restX: 140, entrance: 'Centre entrance, glide right to rest.', actionLoop: 'Glide, bubbles pop, lightning every 420 frames, ground splashes.', effectsMoveWithFigure: 'Rain, lightning and splashes stay on the figure at the right side.', story: 'The first creature, in rain - the world weather is its mood.' },
  { creature: 'Wispkin', card: 'night', restX: -140, entrance: 'Centre entrance, bob left to rest.', actionLoop: 'Rhythmic bob, dark smoke sheds from the tail.', effectsMoveWithFigure: 'Smoke + star twinkle follow the figure to the left side.', story: 'A night wisp - it never stands still, it bobs to its own rhythm.' },
  { creature: 'Mythar', card: 'mythar', restX: 0, entrance: 'Centre entrance, STAYS centre - never grounds, never moves to a side.', actionLoop: 'Three golden rings orbit, diamond sparkles flash, slow prism drift.', effectsMoveWithFigure: 'Rings and sparkles stay centred with the figure - it is the centre.', story: 'A mythic, pearlescent guardian - it does not step aside, the world orbits it.' },
  { creature: 'Kittember', card: 'lantern', restX: 140, entrance: 'Centre entrance, bounce right to rest.', actionLoop: 'Bounce, fire burst, lantern glow pulses warm amber.', effectsMoveWithFigure: 'Lantern glow + embers follow the figure to the right side.', story: 'A lantern creature - it lights the area it stands in.' },
];
