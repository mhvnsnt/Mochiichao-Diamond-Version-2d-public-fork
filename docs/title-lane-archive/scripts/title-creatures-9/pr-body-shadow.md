Title scene — engine-drawn ground shadow, Pokemon-first

FireRed draws a creature's shadow as a SEPARATE 32x8 sprite
(gEnemyMonShadow_Gfx, PALTAG_SHADOW, SetBattlerShadowSpriteCallback
in src/battle_gfx_sfx_util.c), never baked into the creature art.
Title cutouts are now shadow-free (PR #84 white-spot batch, PR #95
Razorgater), so this PR gives TitleScene its own shadow layer:

- One ellipse under the figure's feet, drawn BEFORE the figure so
  feet overlap it, never after (foreground frame still draws after
  the figure, unchanged).
- Width = 65% of the displayed figure width, height = width/4
  (FireRed 32x8 ratio), black at 0.32 alpha.
- The shadow follows the walk (x) but stays on the ground: it never
  bobs, hops or orbits with the figure. When the figure lifts
  (orbit, hop, bob peak) the shadow shrinks and fades slightly,
  never below 75% size.
- The Black 2 motion-blur ghost is untouched — it copies only the
  figure, so the shadow is never duplicated.
- Shadow is on for every title figure, including Wispkin and Mythar
  (their smoke/halo are design elements, not shadows, and both stand
  at groundY in this scene). If Mars wants Wispkin floating without
  a shadow, that is a one-line exception — not guessed here.

Gates on the PR tree (main aea7220, PR #80): lint (tsc --noEmit) 0,
build 0, validate:reference 0. Diff: 1 file modified
(src/components/game/TitleScene.tsx, +29), 0 file deletions.
No Pokemon creature art, no other lane's files touched.
