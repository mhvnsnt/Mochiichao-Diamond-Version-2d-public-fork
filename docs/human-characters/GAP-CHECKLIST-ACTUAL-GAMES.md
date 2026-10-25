# What the actual games have for every character — gap checklist

Source: structure only, from the decomp submodules already in the repo
(pokefirered-leafgreen, pokeheartgold). No code, art, or sprites copied
from them. This is a checklist of ASSET TYPES to fill, so Mochiichao
characters reach the same completeness as a real game character.

## FireRed / LeafGreen structure (verified in the submodule)
- `graphics/object_events/pics/people/<name>.png` — one overworld sheet
  per person, including named people (brock, misty, mom, bill, etc.),
  generic roles (lass, hiker, fisher, beauty, biker, cooltrainer_f/m,
  bug_catcher, camper, etc.), AND special-action variants of the player
  (green_bike, green_surf, green_surf_run, green_fish, green_item,
  green_vs_seeker_bike, green_normal). An overworld sheet is not one
  picture: it is directions + walk frames + action frames.
- `graphics/trainers/front_pics/<trainer>.png` — opponent battle sprite,
  front view, for every trainer class / named trainer.
- `graphics/trainers/back_pics/<player>.png` — player battle sprite,
  BACK view (you see your own trainer from behind in battle). Only the
  player (and rival in some games) gets a back pic; NPC trainers get
  front pics only.
- Trainer data alongside the art (not art, but part of "complete"):
  trainer class, name, party (species/levels/moves), dialogue lines,
  location / route, and in HeartGold: trainer card data.

## HeartGold / SoulSilver additions (verified in the submodule)
- Trainer class constants and trainer data tables (same idea as above,
  larger roster).
- Trainer Card: a portrait + name + stats screen for the player — so
  the player needs a clean portrait, not just a battle sprite.
- Dialogue / VS screens use the trainer front sprite, not the overworld
  sprite.

## Translated to Mochiichao — per-character done checklist
Every human character needs ALL of these before it is called complete.
A model sheet alone is NOT complete. This matches the lane's existing
per-character checklist, now grounded in the real-game structure.

1. Model sheet — full-body front, locked style, plain grey background.
   (What we have for A/B/C/D, Hex, Aeon, Mochiko, Mom variants.)
2. World sprite — front / back / left / right, as a sheet.
   (Real games: one overworld sheet per person, all directions.)
3. Walk frames — up / down / left / right, at least 2 frames per
   direction (idle + step). Real games animate the walk; a static
   4-view sheet does not walk.
4. Battle sprite — player characters: BACK view (like back_pics).
   Trainer / NPC characters: FRONT view (like front_pics).
   Rival (Hex): BOTH — front when he is your opponent, back if he is
   ever playable / in a tag battle. Do not reuse a front view as a
   battle back.
5. Portrait icon — dialogue box portrait, roster / trainer-card portrait,
   shop / PC list icon. Small, clean, face-readable at 64px and below.
6. Special-action variants — ONLY where the character actually does
   that thing in-game: bike, surf, run, fishing, sitting, waving,
   throwing a Luigi Cube (Mochiichao's capture throw), faint/defeat pose.
   Do not invent a bike variant for a character who never bikes.
   (Mochiko's wave pose is an example of a real action variant, not a
   substitute for a neutral front.)
7. Data, not art — role, location, dialogue lines, and for trainers:
   party, levels, and trainer class. A sprite with no data is not a
   usable NPC; data with a silhouette placeholder is still a placeholder.
8. Atlas + manifest — 64x64-based atlas + JSON manifest, same format as
   creature sheets (front/back/side/walk/battle, manifest naming the
   views). This is what lets the game swap a sheet in for a placeholder
   by file replacement, instead of a rewrite.

## Current gaps in THIS lane (2026-10-25, honest)
- Players: A has (1) + a 4-view draft of (2), missing (3)(4)(5)(8).
  D has (1) only, in-game sheet needs redo. B and C have (1) only and
  still need their corrected (1) approved first.
- Named canon: Hex, Aeon, Mochiko, Mom variants have (1) only.
  Missing (2)(3)(4)(5)(8) for all of them, plus Mom's full variant set
  (one per player background, see CANON-HUMAN-CHARACTERS.md).
- Not yet started: trainers by location/role, antagonists, generic
  townspeople — each needs (1)-(8), or a deliberate "generic townspeople
  share a role sheet" decision from Mars (not assumed).
- Nothing from this lane is in the game yet: pass 1 wired 20 human
  slots as placeholder silhouettes in humanSheets.ts. The swap happens
  when a character reaches (8) and main chat PRs it — not before.

## Order to close the gaps (lane order, no waiting per character)
1. Corrected B and C model sheets (text-only) + D in-game sheet redo.
2. In-game sheets for OK'd players (A first, then D, then B/C on approval).
3. In-game sheets for OK'd named canon (Hex, Aeon, Mochiko, Mom variants).
4. Trainers by location/role, then antagonists, then townspeople —
   each through (1)-(8), with (7) data noted alongside the art.
