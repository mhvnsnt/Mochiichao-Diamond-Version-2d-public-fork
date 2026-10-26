# Title animation v2: more detailed and more complex than Pokemon's, built on Pokemon's file structure

Mars (2026-10-26 ~07:07 CDT): keep researching, use the research to
build animated title cards that are more detailed, more complex,
with more animation, backgrounds, movement, and stuff happening
than the Pokemon title cards - but built on the information and
file structure of the actual Pokemon game files, so ours are better
and cooler than Pokemon's. Per-card styles are LOCKED (Mars
2026-10-26 ~07:07 CDT) - this doc expands them, it does not change
their rest sides, actions, or bursts.

## Why Pokemon's title is simpler (from the files)

FireRed's title Run state runs exactly two tasks: the press-start
blink task and one spawner (flame for FireRed, leaves for
LeafGreen), over a static box-art creature layer. That is the whole
moving title: blink + one particle stream. HeartGold adds parallax
layers at different scroll speeds. The intro scenes add more
(entrance, pan, hop, cry, attack, recoil, zoom), but the title
itself stays simple.

## What v2 adds, layer by layer - still the same Pokemon structure

The v2 stack keeps Pokemon's layer order (far to near, HeartGold
parallax) and adds layers Pokemon's title does not have, all at
once, so every card is doing several things at the same time:

L0  Background painting, with per-biome drift (HeartGold parallax:
    far slowest, near fastest, overscan x1.06) - already shipped.
L1  Environment weather, per card (snow, pollen, ripples, dust,
    fireflies, lightning, stars, lantern glow, diamond sparkle).
L2  Midground streaks / wind lines (LeafGreen streak idea: fast
    lines at 7 px/frame, wrapping, behind the figure).
L3  Figure entrance: fade in at centre (FireRed FadeIn), then
    slide to its locked rest side (intro entrance, start X to end X).
L4  Figure action loop, per card, 360-frame cycle: hop, glide,
    roar, scan, bounce, bob, orbit, shield - FireRed scene-3 order
    (idle -> hop -> burst at 270 -> recoil -> settle).
L5  Burst, per card, at the burst beat, effects moving WITH the
    figure to its rest side (not stuck at centre).
L6  Secondary ambient: a second effect that belongs to the world,
    not the creature - e.g. Gabu: leaves + forest fireflies;
    Mochii: bubbles + rain splashes; Mythar: rings + prism drift.
L7  Foreground frame in front of the figure's feet.
L8  Camera: Black 2 camera pan/zoom curve over the scene container,
    with motion-blur ghost at the previous frame position.
L9  Press-start blink tempo over everything: 60 frames first, then
    30 frames on/off (FireRed BlinkPressStart) - the beat the whole
    card moves to.

Pokemon title: 2 moving tasks. Mochiichao v2: 9 moving layers.
That is the "more detailed and more complex" part, and every layer
above traces to a named Pokemon file structure, not an invented
pattern.

## Per-card v2 expansions (locked styles + one extra layer each)

- Yogiferno, snow, left: roar + fire halo pulse + snow twinkle +
  fire trail embers + scorch mark at the feet.
- Sproutle, grass, right: shield ring expands around the torso +
  pollen rises + grass tufts sway in the foreground.
- Dorowani, water, left: glide + bubbles rise + ripple rings +
  water shimmer on the surface.
- Tyrage, sand, right: roar + sand storm + dust motes + ground
  shake on the roar beat.
- Razorgater, stone, left: scan sweep + sparks + slow dust motes
  on stone, background rock-steady (intentional, stone does not drift).
- Gabu, forest, left: hop + REAL leaves (LeafGreen structure, see
  title-pokemon-leaf-research.md) + forest fireflies + foreground
  ferns. Leaves are the burst AND the ambient - the forest moves
  with him.
- Mochii, rain, right: glide + bubbles + lightning every 420
  frames + ground splashes + rain streaks.
- Wispkin, night, left: bob + smoke + star twinkle + night haze
  pulse.
- Mythar, mythar, centre: orbit rings + diamond sparkle + slow
  prism drift + sine-wave rings, never grounds, never steps aside.
- Kittember, lantern, right: bounce + fire burst + lantern glow
  pulse + ember drift from the lanterns.

## What is NOT done in this batch

- The v2 layers are specified here and previewed in the anim GIFs
  (entrance, rest side, action, burst, ambient). Full game wiring
  of every v2 layer into TitleScene is the next step, after Mars
  okays the anims shipped here.
- Full-res (1600x900) anim files are not built yet - the shipped
  GIFs are 800x450 previews from the same builder script, so the
  styles can be judged before the heavy files are made.
- A live animated playtest on phone + desktop is owed after wiring
  + a Pages rebuild contains it.
