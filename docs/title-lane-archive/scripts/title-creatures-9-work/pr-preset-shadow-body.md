StartScreenPlayer — engine-drawn ground shadow (TitleScene PR #102 parameters)

Mars directed this 2026-10-26 ~14:26 CDT ("preset shadows get that done"), lifting the earlier HELD status for this one item only. Preset-only after PR #136/#137: the locked default title renders no figure by design, so this does not change the default title.

FireRed draws a creature's shadow as a SEPARATE 32x8 sprite (gEnemyMonShadow_Gfx, PALTAG_SHADOW, SetBattlerShadowSpriteCallback), never baked into the creature art. Same parameters as the TitleScene shadow:

- One ellipse under the figure's feet, drawn BEFORE the figure (addChildAt at the figure's index) so feet overlap it.
- Width = 65% of the displayed figure width, height = width/4 (FireRed 32x8 ratio), black at 0.32 alpha.
- Ground line here is y = 1180 (figure feet); shadow fixed at 1180 + 12. It follows the walk x (sine sway) but never bobs with the figure.
- When the figure lifts, the shadow shrinks and fades slightly, never below 75% size (same formula as TitleScene: max(0.75, min(1, 1 - elev/200)), alpha 0.32 * scale).
- This player has no Black 2 motion-blur ghost layer, so there is no ghost to duplicate the shadow. GAP case (no figure) draws no shadow, same as TitleScene's missing-figure path.
- Only Yogiferno's already-shipped PR #33 cutout renders here; that show-first rule is untouched.

Branch history, disclosed: the first upload branched from live main a0b16007 (PR #195/#196) but carried the older file version, briefly overwriting PR #196's blink-tempo change ON THE BRANCH ONLY (never merged, never on main). A second, normal commit (not a force-push, not a rewrite) restored the blink-tempo change and kept the shadow, so the branch tip vs main is exactly the shadow below. Blink-tempo code verified present on the branch tip.

Gates on the final branch tree (merged shadow + blink-tempo file): lint (tsc --noEmit) PASS, build PASS (1m42s), validate:reference PASS (warnings are pre-existing open decisions, not failures).

Diff vs main: 1 file modified (src/components/game/StartScreenPlayer.tsx, +31), 0 file deletions.
Deletions: NONE
No Pokemon creature art, no TitleScene, IntroSequence, logo, subtitle, menu, card, background, or other lane files touched. No public publish.
