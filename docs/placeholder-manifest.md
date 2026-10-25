# Placeholder manifest — Mochiichao pass 1

Rule (standing, not negotiable): placeholders are gap-fillers built from our
own manifests and reference shapes — coloured silhouette/blob + name +
manifest stats, decomp data shapes for structure only. They are clearly
marked in-game ("Art in progress") and here. No placeholder file, and no
official Pokemon art/code/music/ROM/leaked file, ever goes in a PR or a
shipped build. A releasable build is placeholder count 0.

How replacement works (this is why pass 1 wires the sheet loader first):
a placeholder is replaced by dropping an original sheet into
`src/assets/sprites/<creature>/` with the same manifest format
(192x64, front/back/side cells, JSON manifest). No code change is needed
for a sheet swap; the loader picks the sheet up and the fallback retires
for that creature. Each replacement = original file in, placeholder
reference out, verified in game.

## Status summary (pass 1, 2026-10-25)

- Creatures with a complete original sheet set (front/back/side + walk +
  attack/hit/faint): **0**
- Creatures with a partial original sheet set (front/back/side only):
  **2 — Dorowani 147, Gabu 148** (their own Tripo models, baked to sheets)
- Roster creatures with silhouette-only placeholder art: **47**
  (roster 001–046 + 331; the 12 battle-ready species.ts creatures are a
  subset of these, so they are counted here, not twice)
- Total creatures without a complete sheet set: **49**
- World tile art: drawn PixiJS tiles (original code-drawn shapes, not
  final tile art): **1 placeholder set**
- **Releasable-build placeholder count: 50** (49 creature sheet sets +
  1 tile art set). This build is NOT releasable as finished art. It is
  fully playable end-to-end with placeholders clearly marked.
- Human slots: **20 slots, all placeholder silhouettes, 0 original
  sheets yet** (see docs/human-ui-art-wiring.md). Not counted in the
  50 above (that count is creature sheets + tiles); human placeholders
  are tracked separately so the two lanes do not blur.
- UI art slots: **36 slots, all on the placeholder UI system, 0 UI art
  assets yet** (see docs/human-ui-art-wiring.md). The placeholder UI
  system itself is original code (coloured panels, game buttons),
  not a copied UI.

## Creature sheets

| Creature | Sheet status | Views done | Views placeholder |
|---|---|---|---|
| Dorowani 147 | PARTIAL ORIGINAL | front, back, side | walk (bob transform), attack (front scaled/lunge), hit (flash/recoil), faint (fade/sink) |
| Gabu 148 | PARTIAL ORIGINAL | front, back, side | walk (bob transform), attack (front scaled/lunge), hit (flash/recoil), faint (fade/sink) |
| Roster 001–046, 331 (all 47) | PLACEHOLDER — coloured silhouette + name, "Art in progress" label in Roster | none | front, back, side, walk, attack, hit, faint — all silhouette |

Notes that must not be silently "fixed" by a later pass:
- Dorowani/Gabu are Gen 2 choosable starters (147/148), NOT 047/048.
  Their stats/types are not set yet, so they are visible in world (lab),
  in Roster preview, and in the Arena test battle, but NOT choosable as
  lab starters yet. Inventing their stats to make them choosable would
  be guessing canon.
- Starter evolution naming, Pebblefist HP, and Beast/Flora/Neon element
  decisions are still open. No placeholder in this manifest resolves them.

## Views — what the placeholder actually does in game

- Walk: no walk-cycle frames exist for any creature. World movement uses
  a bob transform on the standing frame. Replacement: rig/pose walk
  frames and re-bake, per creature.
- Attack: battle reuses the front (opponent) / back (player) frame with
  a lunge + scale, per the Arena spec fallback. Replacement: dedicated
  attack poses, front + back.
- Hit: base frame + white flash overlay + recoil + shake. Replacement:
  dedicated hit/flinch poses, front + back.
- Faint: base frame rotated, faded and sunk. Replacement: dedicated
  faint poses, front + back.
- Side (other direction): the single side frame is mirrored in code.
  Replacement: a second, properly lit side angle.

## Replacement order (Mars's order)

1. Dorowani/Gabu — DONE (original sheets, partial views).
   Note 2026-10-25: the Sprite Art lane also finished normal Manticlaw
   sheets (hulking tiger; the stubby Tripo golem is a special variant
   only, not the normal design) and corrected a Kaggle view-label error
   (Kaggle "front" was actually side_right, "back" was side_left,
   "side" was front, no true back — local sprites-bake mapping was
   correct). Those Manticlaw sheets are 2D model sheets, not yet
   192x64 front/back/side game cells, so they are the NEXT replacement
   after the starters, not a file swap in this pass.
2. Starter sheets from the Sprite Art lane (Mochii 001, Razorgater 004,
   Tyrage 007, plus Kittember 010 / Sproutle 038 as offered in the lab).
3. Walk frames (all directions).
4. Attack / hit / faint poses.
5. Remaining 47-creature sheets in manifest batch order
   (001–010, 011–020, 021–031, 032–040, starters-and-final).
6. Menu / world tile art (replacing the drawn PixiJS tile set).

## Menus and systems — placeholder vs original vs missing

- ORIGINAL in pass 1 (new game UI, not placeholders): title screen,
  main menu (Continue / New Game / Roster / Save-Load), pause menu,
  world HUD, Roster menu, Shop menu, battle move menu, PixiJS world
  canvas, PixiJS battle arena timeline.
- PLACEHOLDER: world tile set (drawn shapes), creature silhouettes
  (above), battle VFX colours per element (coloured bursts, not
  per-move art — by design, not a gap to fill with copied art).
- MISSING (not built, not placeholder-filled, not claimed as done):
  Garden mode, Ring Capture, Creature Mode, audio/music, PixiJS
  doubles layout, per-element VFX library beyond colour, starter
  sheets, walk/attack/hit/faint poses (see above).

## Reference layer — what the decomp files are (and are not)

FireRed / HeartGold / Black 2 / Gen 5+ / pret Batch A JSONs on main are
REFERENCE data shapes only: stat/move/learnset/trainer/encounter
shapes, sprite cell + palette systems, menu/battle structure. They are
validated against (see `npm run validate:reference`) but never imported
as playable Mochiichao content. No Pokemon species, move, sprite, or
code is in the game roster, and no official file is in this tree.
