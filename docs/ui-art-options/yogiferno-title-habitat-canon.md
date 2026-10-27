# Yogiferno — title screen + habitat canon (Mars, 2026-10-25)
## Title screen motion (from Mars, 18:33 CDT)
Yogiferno walks THROUGH the title screen, bringing the fire with him.
- Walking frames from his sheet (side walking poses), left-to-right
  (or right-to-left on alternate rotations — Mars to pick direction,
  default left-to-right).
- Fire trail spawns behind him as he walks: embers, flame wisps,
  ground scorch glow that fades after he passes. In game: PixiJS
  particles + sine sway, NOT a Pillow ellipse trail.
- Fire halo stays above his head the whole walk.
- Colour contrast IS the look: white fur + blue tribal markings
  against orange/red fire. That contradiction (ice-white/blue
  colourway, fire powers) is intentional.
- Rough direction sketch only (not final art):
  ui-art/yogiferno-title-walking-fire-20261025.png — sprite lane
  to make the clean version with real walking frames + fire particles.
## Snow contrast (Mars, 18:34 CDT)
Snow / ice / cold area is where this contrast pops hardest:
white/blue Yogiferno + orange fire on white snow, dark night snow,
or blizzard. Snow title variant: same walk, snow background,
fire trail melts snow / leaves scorch marks that fade.
## Habitat / encounter canon (Mars, 18:34 CDT)
Yogiferno is NOT snow-only. He shows up across biomes, deeper into
the game / at higher level / in later regions that have snow:
- Desert regions — where Fire and Ground creatures show up
- Forest regions
- Rain / raining regions
- Safari Zone-type regions (open, mixed, rare spawns)
- Mountain regions
- Snowy / cold / ice regions (late / deeper, snow-region unlock)
Canon note: "when you get a certain level / further into the game /
deeper into the game, whichever region starts to have snow" — exact
level / region / route for the snow encounter is NOT locked yet.
Do NOT invent a level number or a route name.
## Biome pull — what "pull in all biomes to their right places" means
Pokemon regions each have biomes in specific places (desert, forest,
rain, safari, mountain, snow, cave, beach, city, etc.). Mochiichao's
five regions need the same biome set, placed in play order, NOT
copied town/route names or dialogue.
Biomes to map (7 named by Mars + core set): desert, forest, rain,
safari-type, mountain, snow/ice, plus cave, beach/coast, grassland,
city/town (from existing Mochiichao maps: Sector 0, Route 1.0,
Binary Woods, Quartz Caverns, Silicon Town, MochiiPlex, Castagnoli
Island — these are Mochiichao places, not Pokemon places).
Mapping status: biome LIST 100% (named above), biome-to-region
PLACEMENT 0% — that placement belongs to the World Builder lane
(five-region progression master), in play order, after v5.2 playtest
+ win, like the truck-start order. Do NOT claim biomes are placed.

## Pokemon file pull — what actually exists in the decomp (2026-10-25)
- Black 2 particle system code (structure, not art): src/gfl/particle.c,
  src/ov075/weather_particles.c, src/ov294/intro_particle.c,
  include/field/weather_particles.h, include/demo/demo_particle.h.
  This is how Pokemon does weather/particle emitters — emitter,
  particle count, drift, fade — translated to PixiJS particles.
- Black 2 texture files found locally in pokebw2/res/ (commercial
  game textures, LOCAL REFERENCE ONLY, NOT shipped in Mochiichao):
  field/maps/textures/.../c09_fire.*.png, aku_fire.*.png,
  in04_snow.png, field/props/.../c09_fire.*.png, moves/fire_*,
  moves/powder_snow. These are NOT copied into the public repo or
  the game — they are the reference for how a fire texture is
  framed (multiple frames, alpha) and how a snow texture tiles.
  Shipping them would be shipping Pokemon art.
- FireRed intro graphics structure: graphics/intro/scene_1/bg.png,
  grass.png, scene_2/bg.png, plants.png, scene_3/bg.png, plus
  game_freak/star.png, sparkles_small/big.png — again, structure
  and layer order only, not Mochiichao art.
- Final start screen therefore uses: Yogiferno's own sheet +
  CC0 open-source fire frames + PixiJS particle system translated
  from Black 2 weather/intro particle structure + snow from a CC0
  snow pack. No Pokemon texture file is in the shipped image.

## Fire pack download — FAILED to return files (2026-10-25 18:44 CDT)
Browser task ran 18:38-18:44 CDT, no payment, no sign-in workaround.
- Free Pixel Loops (cs5475, https://cs5475.itch.io/free-pixel-loops):
  free-pixel-loops.zip 93 kB, 20 loops (7 fire, 6 smoke, 7 aura),
  PNG sheets + JSON frame maps, CC0. Page showed "Thanks for
  downloading", but download tool returned outcome unknown, no artifact.
- MOLOTO VFX Free Sampler (was Parazona, milansjpg, redirects to
  https://milansjpg.itch.io/moloto-vfx-free-sampler):
  MOLOTO-VFX-Free-Sampler-v2.zip 2.6 MB, Fire Pillar + Arcane Portal +
  Teleport + Debris Impact, 2048x2048 sheets, 16 frames at 512x512,
  12fps, 3 alpha masks, guide. Licence in ZIP is commercial
  end-product licence — NOT CC0 (only separate CC0 Beam Bonus,
  468 kB, was NOT downloaded). Page showed "Thanks for downloading",
  download tool outcome unknown, no artifact.
- Snow: NO snow in either pack. Frost aura colour is not snow.
  Separate CC0 snow pack still needed.
- Next: user can take over live browser to retrieve the two zips
  from the retained tabs, or download from the two links above
  themselves, or approve a different CC0 snow/fire source.
