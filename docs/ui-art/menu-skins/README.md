# Per-menu Y2K skins — preset definitions only (UI Art lane, 2026-10-26)

## What this is

Selectable Y2K skin presets, one set per menu, shipped as data first.
Each skin in this directory is a **preset/variant**: it describes colours,
frames, gradients, symbols and text treatment for ONE menu. Nothing in
this directory changes the game on its own.

## What this is NOT (hard limits, read before wiring)

- This does NOT change the locked default title/menu. The locked
  default stays exactly as `docs/locked-default-title-menu.md` and
  `docs/ui-art-options/main-menu-default-locked-v32.md` describe it:
  v32 background art, logo y180 w900, cloud centre (600,738) 700x180,
  Mochii cue x170 y~790 w110, CONTINUE pink y788 h110 / NEW GAME
  yellow y918 h70 / SETTINGS blue y1008 h70 / BACK TO TITLE green
  y1098 h70, all inside `LockedStage` (1200x1500).
- This does NOT edit any existing file. Every file here is new.
  No `src/components/*` file, no `LockedStage.tsx`, no
  `IntroSequence.tsx`, no existing settings/custom store was touched.
- The logo is ALWAYS the PNG (`src/assets/ui/mochiichao-main-logo.png`),
  never font text. Skins may style menu *labels* only; they never
  restyle, replace, or re-render the logo.
- The `menu-skins.css` file in this directory is NOT imported by any
  component. It is a preview mapping of the JSON values to CSS custom
  properties, so Mars can see the values applied without a build.
  Importing it or wiring a skin selector is a separate, later step
  that needs Mars shown these presets first.
- Painted menu backgrounds, title backgrounds, cutouts, music and
  sprites belong to other lanes. Skins reference a background only as
  a flat colour/gradient value; no other lane's asset is copied,
  moved, or restyled here.

## How a skin is structured (schema)

Every `*.y2k-skins.json` file in this directory has the same shape:

```json
{
  "menu": "main-menu",
  "source": "file + lines the values were read from, so a later worker can re-check them",
  "lockedSlotsPreserved": ["rects / placements the skin MUST NOT move"],
  "variants": [
    {
      "id": "main-menu-pastel-day",
      "name": "Pastel Day",
      "flavour": "pastel-day | chrome-midnight | bubblegum-pop",
      "panel": { "fill": ["gradient stops, top to bottom"],
                 "border": "unselected frame", "borderWidthPx": 3,
                 "radiusPx": 28, "selectedFrame": "gold frame + glow" },
      "text": { "label": "hex", "sublabel": "hex" },
      "cursor": "hex (must be one of the existing Settings cursor colours or gold)",
      "background": "flat colour or gradient the skin sits on",
      "symbols": "hearts / stars / rings motif, pointer-events none, behind panels",
      "gloss": true, "glow": true,
      "reducedMotion": "all bob/sway frozen to the static values when prefers-reduced-motion",
      "logoRule": "PNG only, never font text"
    }
  ]
}
```

Panel rects (x/y/w/h) are deliberately NOT in the skin values: a skin
recolours the panels in their locked slots, it never relocates them.
A skin that needs a different rect is not a skin — it is a new layout,
and it is out of scope here.

## The three flavours (shared across all 8 menus)

Y2K flavour notes come from the 2026-10-25 UI Art conversation log
(bubbly italic rounded, chrome gradient, stars, orbit rings; pastel
Y2K: white dominant, baby-blue/mint calm, bubblegum pink bonding,
butter-yellow). Each menu carries all three flavours so a future
selector can offer the same three looks everywhere:

1. **pastel-day** — white-dominant pastel Y2K. Closest in spirit to
   the locked v32 look, but lighter: white panels, pastel fills,
   soft glow. The safe "first alternate" for every menu.
2. **chrome-midnight** — black chrome Y2K. Dark panels, chrome
   gradient (silver -> cyan -> deep blue), gold selected frame,
   orbit rings. Built on the generic panel palette already in
   `StdWindow.tsx` (panel #16233a, teal/cyan #22d3ee, gold #fbbf24).
3. **bubblegum-pop** — high-gloss hot Y2K. Saturated pink/cyan
   gradients, thick black frames, star + heart symbols, strongest
   gloss. The loudest of the three, kept off the default by design.

## Menus covered (8 menus, 3 variants each = 24 skin presets)

| Menu | File | Source read (fresh clone of main, 2026-10-26) |
| --- | --- | --- |
| Main Menu | `main-menu.y2k-skins.json` | `IntroSequence.tsx` MAIN_MENU + `v32PanelStyle` (left 300, w 600, radius 28, gold selected frame) |
| Settings | `settings.y2k-skins.json` | `SettingsScreen.tsx` cursor/text colour rows + MENU_CUSTOM screen |
| Bag | `bag.y2k-skins.json` | `BagView.tsx` (`bag-y2k`, bg #0b1526) |
| Shop | `shop.y2k-skins.json` | `ShopView.tsx` (`shop-y2k`, bg #0b1526) |
| Pause | `pause.y2k-skins.json` | `GameShell.tsx` `PauseMenu` |
| Battle HUD | `battle.y2k-skins.json` | `BattleView.tsx` (bg #0b1526, HP green/orange/red) |
| Save Slots | `save-slots.y2k-skins.json` | `SaveMenu.tsx` (teal scheme) + `IntroSequence.tsx` SAVE_SLOTS phase |
| Dialogue | `dialogue.y2k-skins.json` | `DialogueBox.tsx` (`--menu-dialogue-radius`, `--menu-text-color` vars) |
| PC Storage | `pc.y2k-skins.json` | `PcView.tsx` (screen bg #0b1526) — GAP-FILL in the skins wiring PR: #151 shipped no PC file, so this file reuses the bag values verbatim under the #151 schema |
| Party (Team) | `party.y2k-skins.json` | `RosterView.tsx` (screen bg #0b1526) — GAP-FILL in the skins wiring PR: #151 shipped no Party file, so this file reuses the bag values verbatim under the #151 schema |

`skins.json` is the index: every menu, every variant id, and the
file each variant lives in, so a selector worker can load the set
without scanning this directory.

## Still owed (NOT in this batch — shown to Mars first)

1. Skin selector wiring: a settings row / creator control that loads
   one variant id per menu and applies it. No component imports
   anything from this directory yet, by design.
2. Live preview: screenshots / a preview build with each variant
   applied, shown to Mars before any wiring lands.
3. Day/night menu spec and Creator Phase 2 export: separate owed
   items, not covered here.
4. Any new rect/layout: out of scope for skins (see schema note).
