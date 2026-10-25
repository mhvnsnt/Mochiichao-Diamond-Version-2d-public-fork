# Unified direction — how all of this actually fits together

Written 2026-10-25 after Mars said he was confused about 2D vs 3D, sprites vs
models, and how Coliseum / Ranger / normal Pokemon styles mix. This is the
plain version. If Mars changes it, this file changes — do not keep building
on an old version of it.

## The one-sentence direction
Mochiichao is a better version of the 3D Pokemon games in LOOK and FEEL,
but it RUNS as a 2.5D sprite game on the web.
"Looks 3D, runs 2D" is not a compromise line — it is the whole trick stack.

## The confusion, cleared up: you do NOT make both a 2D sprite AND a 3D model for the same creature in the game
You make art ONCE per creature. Then we bake it into the ONE format the game
actually eats: a 2D sprite sheet.
- If a creature already has a 3D model (Dorowani and Gabu do, via Tripo),
  the 3D model is the master. We render it from front, back, and sides, plus
  walk and battle poses, and bake those renders into sprite sheets.
- If a creature has no 3D model yet (the 47 roster creatures), a 2D drawing
  is the master. We draw it once as front, back, and walk frames, and that
  IS the sprite sheet — no 3D model needed.
- The game never sees the difference. It only ever loads sprite sheets.
  Later, if a 2D-first creature gets a 3D model, we re-bake its sheets from
  the model and swap the files. No code change, no double work in the game.
- That is how 2D and 3D mix: 3D is a source, 2D sheets are the game format.
  They are not two parallel games.

## What "better than the 3D Pokemon games" means here, concretely
Not "we rebuild a Switch game on the web" — one person plus Muse cannot do
that as a first step, and pretending otherwise is how this got confusing.
It means: the Pokemon loop, plus the things those games do not give you
in one place — Garden raising, playing as the creature, Ring Capture,
arena battles, and a living Mochiimind log — all sharing one roster,
one move set, one save file, and one sprite format.

## The modes, and which Pokemon style each one is
All modes share the same creatures, moves, and save. A mode is just a
different way to USE the same creatures — that is how they mix.
- Normal Pokemon style = Trainer Mode (the game that already exists).
  Walk a tile world, tall-grass encounters, turn-based battles, catch with
  Luigi Cubes, dojos instead of gyms, story, save and reload.
- Coliseum style = Arena Mode (Mauveville Arena + Dojo Sparring, to build).
  Battles presented like an arena: bigger sprites, camera angles, double
  battles, and a snag-style twist for Umbral/corrupted creatures.
  Under the hood it is still turn-based — the presentation is Coliseum,
  the rules are Pokemon. Coliseum on GameCube has no public decomp we pulled,
  so this is design reference only, not decoded files.
- Ranger style = Ring Capture (a mode, not the main capture).
  Circle a creature with a ring to calm and catch it. Loops add score,
  breaks subtract, bond helps. It does NOT replace Luigi Cubes.
  Ranger also has no public decomp we pulled — design reference only.
- Chao Garden style = Mochi Garden (raising mode, spec written).
  Raise, train Garden Stats, breed, farm, race, spar. Garden Forms are
  palette/overlay/aura on the same species, never a new species.
- Creature Mode = play as the creature, real-time (spec written).
  Walk and fight in real time as the creature itself, tag-switch with Tab.
  This is the Coliseum-arena feel in real time, separate from turn-based.

## Battle feel — confirmed 2026-10-25

Mars confirmed the target feel in his own words: like the new Pokemon
games, Pokemon Battle Colosseum, and the Pokemon Wii game (Battle
Revolution) — full 3D view of creatures during battles, actually seeing
them do their attacks, more immersive battles. That is Arena Mode
presentation: bigger sprites, camera angles/zoom/pan, attack animation
phases (windup, lunge, impact, recoil, return), hit flashes, camera
shake, double battles — still turn-based underneath, still sprite
sheets, still one roster/move set/save. Colosseum / Battle Revolution
have NO public decomp, so this is design + open-source animation
systems (Showdown animation rules, PixiJS camera), not those games'
files. A battle presentation spec worker was spawned 2026-10-25 to
write the per-attack timeline and the sprite views Arena needs.

## What we pull in, and what each thing actually gives us
- RULE (Mars's "stop leaving stuff out", legal version): pull EVERY legal
  open/public source file that helps — decomps, open-source games and tools,
  public data and documentation — and leave none of those out. That rule
  does NOT cover commercial ROMs, official art/music/code, leaked internal
  files, or purchased game files, which stay out of the public repo.
  No repo rule can turn that part off.
- FireRed / HeartGold / Black 2 decomps (ALREADY pulled, in the repo):
  stat/move/learnset SHAPES, trainer and encounter structure, the sprite
  cell + palette system, and HeartGold's 3D map-model idea. NOT their art,
  NOT their code copied into the game.
- Other pret decomps available to pull the same legal way (public
  reverse-engineered source on GitHub, not ROMs): pokered, pokecrystal,
  pokeemerald, pokeplatinum, and the other pret projects — same treatment
  as FireRed/HeartGold/Black 2: reference JSON + shapes, never their
  official art in the game.
- Coliseum / Ranger / X-Y / Switch games: DESIGN ONLY. No source, no ROMs,
  no official files pulled. We borrow the arena presentation, the ring
  capture loop, and the 3D look — we do not decode their files.
- Open source / free tools to pull in or already in:
  PixiJS (the 2.5D renderer, Phase 2), Blender (free — THE bridge tool:
  it loads a Tripo GLB model and renders it out as sprite sheets),
  glTF/GLB (the open 3D format Tripo exports — that is the file format
  to ask for), LibreSprite/Krita (2D sprite editing), WFC / rot.js /
  FastNoiseLite (already in tools/ — procedural maps and Garden data),
  Boids + fish-schooling metrics (MIT — Garden Critter and race behaviour),
  Godot part model (MIT, design only — creatures as composable parts).
- NOT pulled in: official Pokemon/Digimon/Sonic art, music, code, ROMs,
  leaked files, purchased Steam games, paid tools that forbid redistribution.

## What needs to be made: 2D or 3D art, or what?
Answer, in order:
1. Sprite sheets — ALWAYS. That is the game format. Front, back, side,
   walk frames, battle poses, in a 64x64-based atlas + JSON manifest.
2. 3D models — ONLY where they already exist or are easy to get
   (Dorowani, Gabu via Tripo). They are masters to bake sheets from,
   not things the game loads directly.
3. 2D drawings — for every roster creature without a 3D model.
   One drawing set per creature, not a drawing set AND a model.
4. Nothing else as art input. No voxel models, no 3D rigs for the game
   itself, no separate art per mode — one sheet per creature, used by
   every mode.

## Build order (so nothing gets built on broken data again)
1. Roster unify (Pebblefist HP, Beast/Flora/Neon, starter naming).
   Already mapped in unification-map.md; blocked on Mars's calls.
2. Prove the bake pipeline with Dorowani + Gabu: get their GLB files,
   render front/back/side/walk in Blender, bake sprite sheets, show them
   in the existing game as Roster art. If this works, the pipeline is proven.
3. Starter sprite sheets (Mochii / Razorgater / Tyrage lines) from 2D art,
   using the same sheet format as step 2.
4. PixiJS 2.5D renderer, replacing the CSS renderer, same tile maps.
5. Garden mode, then Ring Capture, then Arena/Coliseum mode, then
   Creature Mode — in that order, each on the same roster/save/sheets.
6. ONLY if Mars later wants true 3D (Switch-style): swap the renderer
   to 3D and load the Tripo models directly. That is a later fork, not
   this plan, and the sprite sheets still work as fallback.

## What Mars needs to give / decide (short list, nothing else blocks direction)
- Confirm this direction: "looks 3D, runs 2D, one sheet per creature."
- Starter evolution naming set (options already sent).
- Pebblefist HP, Beast/Flora/Neon element calls.
- Dorowani + Gabu GLB files (upload them, or authorise a Tripo browser
  download) — the one art input that proves step 2.
