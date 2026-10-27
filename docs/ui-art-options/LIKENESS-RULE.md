# LIKENESS RULE — UI Art lane (Mars, 2026-10-25, standing rule)

## The rule, in one line
Do NOT generate a new likeness for any character that already has a
description, an image, a 2D sheet, or a 3D bake. Use the existing sheet
as the source of truth, check the new art against it by eye, and say
plainly when a render drifts. A UI mock is not a new character design.

## Where the source of truth lives
- Local 2D sheets: `~/workspace/mochiichao-work/sprite-art/2d-sheets/<creature>/`
  (main sheet + angles top/diagonal + angles + lighting, per creature).
- Local 3D bakes: `~/workspace/mochiichao-work/sprites-bake/sheets/<creature>/`
  (192x64 sheet + front/back/side 64px + manifest; Dorowani/Gabu also in
  `sprite-art/blender-bakes/kaggle-corrected/`).
- On main after PR #13 (2026-10-25, main b6cc35e1): `src/assets/sprites-2d/`
  (43 sheets + 12 corrected Kaggle PNGs + docs/view-mapping.md).
- Reference crops for UI work (front views only, for checking, NOT game
  assets): `~/workspace/mochiichao-work/ui-art/references/`
  (dorowani-front-reference.png, gabu-front-reference.png,
  mochii-front-reference.png, reference-index.json).
- Original uploads / descriptions: Mars's uploaded images and the
  asset manifests in the goal files (`asset-manifests-*.json`).

## Likenesses checked by eye against the sheets (2026-10-25)
- **Dorowani #147 — bipedal, NOT quadruped.** Blue bipedal
  crocodile-turtle, tall single blue head fin (upright, slightly
  swept), RED star-shaped cheek frills on both sides, RED eyes in the
  2D sheet, pale blue-white belly, tan mottled hexagonal-plate shell,
  long snout with small teeth, clawed hands/feet, blue tail with
  ridges. Wrong in the earlier battle mock: yellow eyes, on all fours,
  backpack/necklace added, red frills kept but shape softened.
- **Gabu #148 — bipedal, NOT quadruped, NOT crystal.** Teal bipedal
  turtle, YELLOW eyes, DARK TEAL spiky crown (many short spikes, not
  crystals, not gold), tan segmented belly, brown/tan shell, dark teal
  spots on limbs, small tail spikes. Wrong in the earlier battle mock:
  crystal/gold spikes, on all fours, angry-only face.
- **Mochii #001 — a water blob, NOT a croc/turtle.** Round blue water
  drop/blob, single top point, black round eyes, smile, white wave
  pattern on the lower body, small water drops around it, bounces /
  walks as a blob. Never redraw Mochii as a reptile, a slime with a
  face, or a generic mascot.
- **Manticlaw — normal = hulking tiger** (main + angles v2 + lighting
  in 2d-sheets/manticlaw/). The Tripo fiery rock golem is a SPECIAL
  INDIVIDUAL VARIATION only (stubby, short spine) — never revise the
  normal design to the golem, and never use the golem as the default
  Manticlaw in UI art.
- **Razorgater eye colour is OPEN** (main sheet red vs angles blue) —
  do not pick one silently in UI art; use the sheet as-is and flag it.

## WORKING RULE (Mars, 2026-10-25 — stop the correction loop)
Check the game files FIRST, fix from them, report only what changed.
No repeated "yeah you're right again" loop, no new hand-drawn mock to
replace a wrong mock. Battle title: OFF — BattleView.tsx has no title
element, Pokemon games do not show the game title in battle, title
belongs only on the title screen. Background: NEVER blank navy —
battle background is PixiBattleCanvas (app #0b1526, arena floor
0x1a2a1a from vh*0.55, shadows under both creatures, game-screen
#050810, game-panel rgba(10,18,34,0.92)); menus sit over the game
world in App.tsx, not over empty space. Wiring record:
battle-wiring-v2.json (already wired in spriteSheets.ts /
PixiBattleCanvas.tsx by the main-chat wiring worker, local only).

## CACHE RULE (Mars, 2026-10-25 — do not make him repeat this)
NEVER overwrite an image file that has already been shown to Mars.
Every new version gets a NEW filename (v1, v2, v3, or a descriptive
suffix), so the client loads the new file instead of the cached old
one. Example of the mistake: cutout-battle.png was reused for the
front/front version AND the corrected back/three-quarter version, so
the app kept showing the old cached battle. Fix: the corrected battle
is cutout-battle-v2-back-threequarter.png (sha256 e8e0096d…), a
different filename, and cutout-battle.png is NOT to be reused for a
third version. Same rule for every image, mock, cutout, and composite,
in this lane and in any handoff to main chat.

## Battle-view rule (Mars, 2026-10-25 — this was missed in the first cutout battle, fixed, do not regress)
How Pokemon games do it, from the actual files/sheets, not hand-guessing:
- Player side = BACK view from the sheet. Never the front view facing
  the camera. Dorowani player cut: dorowani-back-2d-cut.png, main sheet
  4x3 cell (3,0) — shell, red frills from behind, head fin on top.
- Opponent side = FRONT view in a straight battle, OR a
  three-quarter view facing TOWARD the player when the sheet has one.
  Never a straight-at-camera front when a three-quarter exists.
  Gabu opponent cut: gabu-threequarter-left-cut.png, angles sheet
  4x2 cell (3,0) — body diagonal, head turned left toward the player
  (bottom-left), mouth open. Straight front was wrong here because it
  faced the camera, not the player.
- Same rule for every battle, roster preview, and arena screen: check
  the sheet's front/back/side/diagonal cells first, pick the view the
  game position calls for, cut that cell. Do not reuse a front cut for
  both sides because it is convenient.

## How UI art is made under this rule
1. Open the creature's sheet in `sprite-art/2d-sheets/` FIRST.
2. UI art (menus, HUD, title, banners) may show a creature, but it must
   match the sheet: body plan (bipedal/quadruped/blob), colours, eyes,
   frills/spikes/shell, and pose family. If the generator drifts, the
   mock is labelled DRIFT and is NOT used as a final asset — the sheet
   itself (or a crop of it) is used instead for that creature.
3. New likenesses are generated ONLY for characters with no sheet, no
   bake, and no full description — and then they go to the Sprite Art
   lane first, not straight into UI.
4. Open-source tools used to stay close (not to invent): Pillow
   (open source, for cropping sheet cells and checking frames), SVG
   (open standard, for UI cut-outs), Kenney UI Pack (CC0) 9-slice
   structure for panels/buttons/bars, PixiJS (MIT) as the game
   renderer, Blender (open source) bakes for 3D-master creatures.
   No open-source pack's generic creature art is substituted for a
   Mochiichao character.

## Drift log (so the same mistakes are not repeated)
- Battle HUD v1: invented creature/move names — fixed to canon names/moves.
- Battle HUD canon: Dorowani yellow eyes + quadruped, Gabu crystal spikes
  + quadruped — drift vs sheets above; final HUD uses sheet sprites,
  not these mock creatures.
- Main menu canon: Dorowani backpack/necklace added by the generator —
  not in the sheet; do not carry it forward.
- UI kit canon: element icons duplicated Core and Strike — final icons
  are the SVG set, one per True Element.
