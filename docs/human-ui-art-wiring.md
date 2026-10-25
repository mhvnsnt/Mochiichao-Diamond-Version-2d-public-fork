# Human + UI art wiring — pass 1

Both lanes are wired the same file-swap way as creature sheets. Nothing
in this pass blocks on art arriving, and no UI art was built in the
human lane, no human art in the UI lane.

## Human loader (`src/lib/humanSheets.ts`, `src/components/game/HumanPortrait.tsx`)

- Same 64x64-cell atlas + JSON manifest contract as creatures:
  world front/back/left/right, walk up/down/left/right (walk frames
  reuse the standing frame until the lane delivers cycles), battle
  back (player trainer) / front (opponent trainer), menu/portrait icon.
- Player avatar in the world comes from the human loader
  (`player_boy` / `player_girl`, from the store's playerGender), NOT
  from a creature sheet, NOT a blue silhouette, NOT an emoji. The
  PixiJS world draws the human slot (sheet when present, marked
  silhouette placeholder otherwise). Creature Mode is the one
  exception by design: there you play as the creature, so it passes
  `playerKind="creature"` and the creature sheet/fallback renders.
- NPCs in the world go through `slotForNpc()` in the same loader:
  creature display NPCs (Dorowani/Gabu in the lab) still use the
  creature sheet; every other NPC uses its human slot (sheet when
  present, slot-coloured placeholder figure otherwise).
- Battle back view: the player trainer corner portrait in battle is
  a HumanPortrait (back view) through the loader; the fighting
  creature's back view is still the creature sheet in the arena.
- Slots wired (20, all placeholder silhouettes in pass 1, 0 original
  sheets yet): player_boy, player_girl, hex, prof_aeon, mochiko, mom,
  dojo_trainer, shopkeeper, academy_staff, market_staff, race_staff,
  sparring_staff, hacker, syndicate, liberation, krix, castagnoli,
  mythar, trainer_generic, townspeople.
- Swap procedure: drop the sheet + manifest into
  `src/assets/sprites/humans/<slot>/`, set that slot's `sheetUrl` in
  `humanSheets.ts`. No code change, no other file touched.

## UI art manifest (`src/lib/uiArt.ts`, `src/components/game/UiArt.tsx`)

- Every UI piece has a slot: title art, main/pause menu panels, HUD,
  battle panels, roster/shop/PC panels, Garden/Arena/Creature/Ring
  panels, D-pad, A/B/START buttons, generic game button, type icons
  for the 12 True Elements, item icons (Luigi Cube, Mend Patch,
  Revive Core), status icons (burn, poison, paralysis, faint).
- `UiPanel` / `UiButton` render the asset as a background image when
  `assetUrl` is set, otherwise the placeholder UI system (coloured
  panels, game-style buttons, non-mono font). They are already used
  by the pause menu and the main menu; every other screen uses the
  same placeholder classes (`game-panel` / `game-button`), so it
  joins the same system when its slot fills.
- Placeholder UI count in pass 1: 17 panel/button slots + 12 type
  icons + 3 item icons + 4 status icons = **36 slots, all on the
  placeholder system, 0 UI art assets yet**. The placeholder system
  is clean and non-terminal by design (coloured panels, game buttons,
  Trebuchet/system font) — it is not the old terminal frame, not
  bracket text links, not mono teal.
- Swap procedure: drop the asset, set that slot's `assetUrl` in
  `uiArt.ts`. No screen rewrite. UI art is a separate lane; this pass
  does not build UI art, and does not block human/creature wiring on it.
