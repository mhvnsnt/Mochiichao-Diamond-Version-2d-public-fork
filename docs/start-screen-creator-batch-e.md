# CREATE START SCREEN — batch E (spec section 2 only)

Path: Settings -> Menu Creator -> CREATE START SCREEN.
Full dedicated screen, Pokemon layout first, Y2K skin on top, B: BACK.
Presets only at first; the locked default is never overwritten.

## Files (this batch)

- `src/lib/startScreenPreset.ts` — preset data model, locked layout,
  validation, JSON export/parse, localStorage presets.
- `src/components/game/StartScreenCreator.tsx` — the creator screen.
- `src/components/game/SettingsScreen.tsx` — minimum shared edit only:
  `START_SCREEN_CREATOR` screen + `CREATE START SCREEN` row in Menu
  Creator page 1 + render branch + title + B: BACK guard. No other
  rows, screens, or behaviour changed.

## Slot / feature counts

Locked layout slots (spec-pinned, 1200x1500 canvas): 4/4 wired
- Logo: 900 wide, centre (600, 450)
- DIAMOND VERSION subtitle: 556 wide, centre (600, 735), font PINNED
- PRESS ANY KEY: y = 927, blink 30 frames on / 15 frames off
- Studio logo: 556 wide, centre (600, 1222)

Editable slot content: 3/3 wired
- Creature: rotation pool, 10/10 names selectable
- Background: 8/8 shipped biomes selectable + painted option
- Particles: fire / snow / rain / leaves / embers / smoke / none

Creator actions: 4/4 wired
- SAVE AS PRESET, LOAD PRESET, EXPORT JSON (own format), RESET TO
  LOCKED DEFAULT (locked preset itself is never overwritten —
  saving under its name is refused).

Timeline: ONE scene, loop — same timeline as the Intro Video
Creator, no scene list here. Scene add/duplicate/delete/reorder
belongs to CREATE INTRO VIDEO (separate batch, not touched).

Reuse, no second system: moving a slot = Layout Editor, restyling
a slot = UI Creator. Locked slot rows in this screen are read-only
and say so.

## GAP (labelled, later batches, never claimed here)

- Start-screen playback from a saved preset.
- Phase 2 export: FFmpeg desktop render / MediaRecorder capture.
- Blender .blend export; Blender binary NOT shipped (install note only).
- Painted backgrounds: background option exists, art is GAP.
- Creature cutouts: 1/10 shipped (Yogiferno clean cutout, PR #33);
  9/10 GAP — Mochii, Razorgater, Tyrage, Kittember, Sproutle,
  Dorowani, Gabu, Wispkin, Mythar — shown as GAP labels, never
  fake art and never another creature's art as a stand-in.
- Title music composition / boot sound pick: no music field invented.

## NOT changed

Intro Video Creator (separate batch), HUD, themes, fonts, title
scene, main menu, saves, package.json / package-lock, any other
lane's work. No file deletions. No Pokemon sprites, dialogue,
music, cries, names, or art in this PR.
