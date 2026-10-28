# Arena Battle Presentation Spec — Mochiichao

Status: SPEC ONLY. No code committed to any repo, no game files pulled.
Rule: this spec recreates the *feel* of Colosseum / Battle Revolution /
modern Pokémon battles from public descriptions and open-source systems.
It does NOT use those games' files, ROMs, art, music, code, or leaked
source. There is no public decomp for Colosseum, Battle Revolution,
Ranger, X/Y, or Switch games, and none is claimed here.

Confirmed user direction (2026-10-25): battles should feel like the new
Pokémon games, Pokémon Battle Colosseum, and the Pokémon Wii game
(Battle Revolution) — a full 3D view of creatures during battles, actually
seeing them do their attacks, more immersive — while the game still
plays 2D and only eats 2D sprite sheets ("looks 3D, runs 2D").
That is Arena Mode presentation in the existing direction file:
Colosseum-style presentation, bigger sprites, camera angles, double
battles, still turn-based underneath, same roster / moves / save.

## 1. What the reference games actually do — public sources only

### 1.1 Pokémon Colosseum (GameCube, 2003, Genius Sonority)
- Battles are 3D, in arenas, and in story mode are double battles
  (2-on-2) by default. The GameCube-era presentation is the reason the
  game still gets praised: detailed 3D creature models, "beautifully
  animated" attacks "with tons of light and color", and camera work
  used to mask the fact that the creatures never actually touch
  each other — camera cuts and attack animations sell contact that
  the models do not make (Nintendo World Report review).
- Fans and reviewers repeatedly name the same two things as the
  difference from later games: (a) camera angles / camera cuts for
  moves, and (b) idle and attack animations with weight, plus a
  unique faint animation per creature (GameFAQs / ResetEra discussion).
- The failure mode to avoid is also documented: Colosseum battles
  are criticised as "slow drawn out" double battles with "long tiring
  animations, and constant slow camera cuts" (review quoted in search).
  So: copy the camera *grammar*, not the pacing. Every attack must
  have a speed cap and a skip/fast path (see §5).

### 1.2 Pokémon Battle Revolution (Wii, 2006/2007, Genius Sonority)
This is the closest reference to what Mars asked for, and the
sharpest contrast with modern games:
- "Pokémon attacks are also much more diverse, with each Pokémon
  acquiring its own animation for most moves in the game. Some
  animations feature both the attacking and defending Pokémon on
  screen at the same time. In previous console titles, the game only
  showed one Pokémon attacking and then cut away to the second
  getting hit" (Wikipedia, Pokémon Battle Revolution).
- Kotaku's retrospective (2024, "17 Years Later, Pokémon's Wii
  Animations Look Better Than Those In Modern Games") states the
  key rule explicitly: Battle Revolution "allows Pokémon to make
  visible contact when they use attacks" — e.g. a Raichu or Torterra
  *walking across the screen* to strike with Iron Tail or Wood
  Hammer. Modern Scarlet/Violet, by contrast, "animate battles so
  Pokémon can stay in their designated spot on the field. Even
  physical attacks like a punch or a kick are animated as such,
  with a quick graphic of a fist or a foot striking the target,
  rather than the Pokémon itself walking across the screen to
  strike."
- Character animation, not just attack animation: each creature has
  an original faint animation (Honchkrow flails back and tips its
  hat before returning to its ball; Roselia puts hands on hips and
  does a sassy walk while recovering; Houndoom roars and snarls
  from its side of the field). Idle behaviour is part of the feel,
  not decoration.
- Camera: the final game "simply cuts between these shots" during
  move selection and attacks (Bulbapedia, development history) —
  the early trailer's continuous pans were cut down to cuts in the
  shipped game. Lesson: cuts are cheaper and clearer than pans in
  a sprite game; use pans only for the attacker approach and the
  return, not for every UI beat.
- Structure: 11 colosseums, double battles are central, an announcer
  calls out double-battle events (including attacking your own
  teammate). For Mochiichao Arena Mode, the announcer equivalent is
  a short text banner, not voice — same job: make double-battle
  targeting readable.
- Mochiichao translation: the PBR rule is the spec's headline rule.
  **Rule PBR-1: a physical-contact attack must show the attacker
  moving to the target and both creatures on screen at impact.
  Never show only a floating fist/foot graphic while the attacker
  stands still.** That single rule is most of the difference Mars
  is asking for.

### 1.3 Pokémon Stadium (N64) and XD: Gale of Darkness
- Stadium is the ancestor: Battle Revolution's animations "iterate
  on what Stadium and its sequel did" (Kotaku). Stadium established
  the arena, the announcer, and per-creature faint behaviour.
- XD improved on Colosseum's pacing and location variety. No
  separate camera grammar is needed from XD — use Colosseum's
  grammar, Battle Revolution's contact rule, and XD's lesson that
  variety of arenas matters (see §3.6).

### 1.4 Modern games (X/Y onward, Sword/Shield, Scarlet/Violet) — what NOT to copy
- Modern battles default, in major trainer battles, to a largely
  fixed "GameBoy camera angle" (GameFAQs discussion, 2026): the
  camera is "almost always moving by default" in Stadium /
  Colosseum / XD / Battle Revolution, and that moving camera is
  exactly what was lost in the modern fixed-angle default.
- Modern physical attacks stay in place and flash a detached
  fist/foot graphic (Kotaku, above). Do NOT copy that.
- Modern move timings, community-timed from video (Pastebin,
  Scarlet/Violet move timing, Dec 2022): most single attacks run
  roughly 2–4 seconds with animation (e.g. Low Kick ~3.07 s,
  Wing Attack ~3.08 s, Aura Sphere ~4.01 s, Close Combat with
  animation ~9.12 s, multi-hit / multi-seed moves up to ~8 s).
  Use this as a pacing ceiling, not a target: Mochiichao Arena
  attacks should land in 1.8–3.2 s (see §4), well under the
  6–9 s outliers, with a fast/skip option.

## 2. Open-source systems that already do this with sprites

### 2.1 Pokémon Showdown client — the best structural model
- Repo: smogon/pokemon-showdown-client. Client code is MIT
  (CONTRIBUTING: "client code should also be MIT licensed"; server
  is MIT per its README). That means the *animation architecture*
  can be studied and, with attribution, its patterns ported —
  but its sprites are NOT Mochiichao's and must not be copied in.
  Mochiichao uses its own sheets only.
- Structure (from its directory documentation): `battle*.ts` =
  battle engine (logic), `battle-animations*.ts` = battle scene
  (visual rendering). Logic and presentation are separate files
  and separate concerns. That separation is the single most
  important architectural borrowing for Mochiichao: the existing
  turn-based battle logic must NOT be rewritten to become the
  animation. Instead, logic emits an event queue (move used,
  target, damage, status, faint), and the Arena scene plays that
  queue as a timeline. This is also how Showdown replays work.
- What to port as RULES (not code, unless the parent makes an
  explicit MIT-attribution decision):
  - Event-queue playback: one logical event = one animation
    segment; the next segment does not start until the previous
    segment's "finished" signal fires.
  - Sprite manipulation primitives: move, scale, rotate, tint/flash,
    fade, shake — all as timed tweens on a sprite object, with a
    restore to the base pose at the end of every segment.
  - Layer order is explicit: attacker, projectile/effect, target,
    and background are separate layers, and double battles need
    partner-layer rules (who draws in front of whom) written down,
    not improvised per move.

### 2.2 pret pokeruby battle-animation system — the sprite-task model
- Repo: pret/pokeruby, `src/battle_anim.c` and
  `src/battle/anim/<type>.c` (normal, fight, water, fire, etc.).
  This is a public decomp already in the Mochiichao pull order,
  unlicenced (see the modding inventory) — so: study its
  *structure*, do not vendor its code.
- Structure worth copying as rules:
  - One animation module per element/type, plus a central
    framework (`battle_anim.c`) that schedules them.
  - Sprite tasks: `ShakeMonInPlace`, `SwayMon`, `ScaleMonAnd
    Restore`, `RotateMonToSideAndRestore`, `AttackerFadeTo
    Invisible` (CFRU animation-system documentation, same
    task family). Note the pattern: every transform has a
    *restore* — the sprite always returns to its base pose.
  - Palette/blending control: attacker palette, defender palette,
    partner palettes, and background palette are addressed
    separately, so a hit flash can tint only the target.
  - Particle tags: one tag per effect type (spark, explosion,
    fire, lightning, ice crystals, razor leaf, shadow ball, aura
    sphere, etc.). Mochiichao's equivalent is a VFX sprite
    library keyed by element (see §4.4), not per-move artwork.

### 2.3 PixiJS + pixi-viewport — the renderer that makes this possible in 2D
- PixiJS: MIT licence (GitHub repository). WebGL/WebGPU renderer,
  scene tree of Containers and Sprites, ticker-driven animation.
- Camera in PixiJS is not a camera object — it is a Container
  whose `pivot` (centre point), `scale` (zoom), and `position`
  (viewport offset) are animated. The scuti-renderer integration
  documents exactly this: "The RoomCamera uses standard PixiJS
  Container properties: pivot, scale, position. These are
  animated using GSAP for smooth transitions."
- pixi-viewport (MIT, © 2017 YOPEY YOPEY LLC / David Figatner):
  a highly configurable 2D camera for PixiJS with drag, pinch,
  wheel zoom, follow-target, snap-to-point, snap-to-zoom, and
  clampZoom (min/max width/height). For Arena Mode, only a
  subset is wanted: snap-to-attacker, snap-to-target, zoom clamp
  (never closer than the impact framing, never wider than the
  full arena), and follow during the attacker approach. Drag /
  pinch / wheel are NOT wanted during a battle animation — the
  camera is scripted, not player-driven, during an attack.
- PixiJS sprite primitives that map 1:1 onto the §4 timeline:
  `anchor.set(0.5)` (centre pivot, so scale/rotation do not
  shift position), `scale.x/y`, `rotation`, `tint` (hit flash),
  `alpha` (fade), `blendMode = ADD` (glows / projectiles),
  filters (blur/glow/drop-shadow, used sparingly — one filter
  per effect sprite, never on the whole arena every frame).
- Tweening: use a small tween/easing helper (GSAP-style easing
  is the documented pattern in the PixiJS camera example; any
  MIT tween library, or a hand-rolled ticker easing function,
  is equivalent). Easing matters: approach = ease-in (accelerate
  into the hit), recoil = ease-out, camera zoom = ease-in-out.
  Linear movement is what makes sprite battles look cheap.

### 2.4 Godot 2D JRPG combat demo (gdquest-demos/godot-2d-jrpg-combat) — the turn/animation contract
- Structure: `BattlerAnim` scene with anchors (front anchor for
  attacks, top anchor for status/damage numbers), driven by
  signals. Combat flow (documented):
  1. Battler performs an action → animation plays.
  2. Battler moves forward toward the target.
  3. At a specific point, a `triggered` signal fires.
  4. The action's effect (damage, healing) is applied.
  5. Battler moves back to its original position.
  6. `animation_finished` fires; combat proceeds to the next turn.
- This is the contract Mochiichao should copy verbatim as a
  rule: **damage is applied at the `triggered` moment, not at
  the start of the animation and not at the end.** The HP bar
  drains during the impact/recoil segment, so the number and
  the picture agree. The same contract works in PixiJS with a
  ticker + a promise/callback, no Godot needed.
- SpriteFrames lesson (from the itch.io engine-ready pack):
  one sheet per monster, named clips (Idle, Walk, Attack, Death
  × south/east/north/west), Aseprite-format JSON with frame
  rectangles and named tags. Mochiichao's manifest should use
  the same idea: named clips, not bare frame numbers, so the
  Arena timeline can call `play("attack")` instead of
  remembering that frame 7 is the lunge.

### 2.5 What was NOT used, and why
- No Colosseum / Battle Revolution / Stadium / X/Y / Switch
  code, assets, or decomp was used. None exists publicly in
  matching-decomp form for those games (see the modding
  inventory), and this spec does not need it: the presentation
  rules above are all public-description or open-source.
- No Showdown sprites, no pret battle-animation code, and no
  Godot demo code is vendored by this spec. Rules and
  architecture only, unless the parent makes an explicit
  licence decision (MIT for Showdown/PixiJS/pixi-viewport;
  unlicenced for pret — study only).

## 3. Arena layout — the stage the camera moves in

### 3.1 Default framing (singles)
- Wide arena shot: both creatures fully visible, player creature
  lower-left, back view, larger (foreground, ~1.25× the enemy
  scale); enemy creature upper-right, front view, smaller
  (background, ~1.0×). Ground shadows under both. This is the
  Colosseum/Stadium default and the current Mochiichao battle
  layout, kept — Arena Mode changes the *camera*, not the
  starting positions.
- HP bars and names stay in fixed screen corners during
  animation. The camera container moves the arena; the UI layer
  does NOT move with it. If the camera ever covers an HP bar,
  the framing is wrong — clamp the zoom so both HP bars stay
  readable at impact.

### 3.2 Double-battle layout (Arena default)
- Player pair: front-left and back-left slots, offset so both
  are visible (front slot lower and larger, back slot higher
  and smaller, ~0.9×). Enemy pair mirrored on the right.
- Layer order, written down once: back-slot creatures draw
  behind front-slot creatures on the same side; the acting
  attacker draws in front of everything on its side during its
  approach; projectiles/effects draw above all creatures.
- Targeting must be readable without text: the selected target
  gets a persistent marker (bracket/arrow + slight scale pulse)
  during move selection, and the camera's impact cut frames
  attacker + target, with the non-target partner dimmed
  slightly (alpha ~0.85) for that segment only.
- Double battles are slower by construction (4 actors, 4
  turns per round). That is why §5's speed cap matters more
  in doubles than in singles: default to the fast timing
  column in doubles, or doubles will feel like the Colosseum
  complaint ("slow drawn out double battles").

### 3.3 Arena backgrounds
- Arena Mode is not one background. Use the existing
  Mochiichao landmarks as arena themes (Mauveville Arena —
  The Gauntlet as the default Arena; dojo sparring rings as a
  smaller variant). Background is a flat, layered PixiJS
  backdrop (floor + back wall + crowd/props as silhouettes),
  parallaxed slightly (background moves at ~0.3× the camera
  pan, floor at 1.0×) so a camera pan reads as depth without
  any 3D. No new 3D geometry is needed.

## 4. The attack timeline — the spec

Timing is given in frames at 60 fps, as a SPEC for Mochiichao,
not as measured Colosseum timings. Total budget per single
attack: 108–192 frames (1.8–3.2 s). Multi-hit and faint
segments add to this, they do not stretch the base timeline.

### 4.1 Universal timeline (every damaging move)

| Phase | Frames | What happens (sprite + camera) |
|---|---|---|
| 0. Cue | 0–12 | Camera cuts (not pans) to the attacker. Attacker plays windup start (lean back / crouch / glow). Move name banner appears. Non-actors dim to alpha 0.9. |
| 1. Windup | 12–30 | Attacker holds the windup pose, scale pulses 1.0 → 1.06 → 1.0 once. For special moves, a charge glow (tint + additive glow sprite) builds at the attacker. Camera holds on attacker. |
| 2. Approach / projectile | 30–66 | PHYSICAL CONTACT (Rule PBR-1): attacker slides/lunges across the arena to the target's front anchor, both on screen, camera pans with the attacker and settles on attacker+target. PHYSICAL RANGED / SPECIAL: attacker stays, camera cuts to a two-shot, projectile/effect sprite travels attacker → target along a straight or arced path (ease-in). STATUS: no approach; camera cuts to target, effect sprite plays on target. |
| 3. Impact | 66–78 | On the `triggered` frame (frame 66): damage is applied, HP bar starts draining, target flashes white (tint to white for 3 frames, then back), target plays hit/flinch pose and recoils 8–14 px away from the attacker, screen shakes 2–4 px for 6 frames (small hits) or 5–8 px for 10 frames (critical / super-effective). Impact VFX sprite bursts at the contact point (see §4.4). Camera zooms to ~1.15× on the impact for 12 frames, then eases back. Sound/text: "It's super effective!" etc. appears here, not before impact. |
| 4. Recoil / settle | 78–108 | Target settles back to base pose. Physical attacker returns to its slot (ease-out, same path back, 24–30 frames) and the camera eases back to the wide framing. HP bar finishes draining. If the target faints, go to §4.5 instead of settling. |
| 5. Text / next | 108+ | Battle text line completes. Next event in the queue starts. No dead air: if the next event is another attack, its Cue phase may start at frame 96 (12-frame overlap) so rounds feel continuous, not stop-start. |

Multi-hit moves: repeat phases 2–3 per hit, with the return
phase skipped between hits (attacker stays at the target, or
the projectile re-fires), and a shorter windup (6 frames) for
hits 2+. Total budget: base 108 + 36 per extra hit, capped at
5 hits in the timeline (further hits are batched into the
final hit's HP drain for readability).

### 4.2 Per move-type camera moves

- Physical contact (Tackle, Iron Tail, Wood Hammer, Close
  Combat, etc.): camera = follow the attacker. Start wide,
  cut to attacker for windup, pan with the lunge, settle on
  the two-shot at impact, zoom 1.15× at impact, ease back
  wide on return. Never cut away mid-lunge — the lunge IS
  the shot.
- Physical ranged (Rock Throw, Bullet-type, etc.): camera =
  two-shot. Attacker stays, projectile travels, camera does
  a small push-in (1.0 → 1.1×) as the projectile crosses
  mid-arena, impact zoom as in §4.1.
- Special (Flamethrower, Shadow Ball, Aura Sphere, etc.):
  camera = target-side close-up. Windup on attacker with
  charge glow, cut to target as the beam/projectile arrives,
  impact zoom 1.2× (specials read better slightly closer
  than physicals because the effect sprite is the star).
  Element-coloured screen edge glow for 12 frames at impact
  (e.g. Flame = orange, Aqua = blue, Umbral = dark purple).
- Status (Growl, Swords Dance, status conditions, healing):
  camera = subject close-up, no shake, no impact zoom.
  Buff: attacker scales up 1.0 → 1.12× and glows, then
  settles, with rising particles. Debuff/status on target:
  target tints to the status colour and plays a droop pose,
  with a persistent small status icon above the target until
  cured. Healing: green rising particles + HP bar refills
  during the settle phase.
- Self-target / switch / item: camera holds wide, no zoom,
  creature slides/fades out (switch) or glows (item). Keep
  these under 60 frames — they are bookkeeping, not spectacle.
- Capture (Luigi Cube in Trainer Mode; snag-style Umbral
  twist in Arena Mode): camera = target close-up, cube/ball
  arcs from the player's side to the target, target is
  drawn into the cube over 24 frames, then the cube shakes
  (1–3 shakes, 12 frames each) with a click/flash per shake.
  This is the only segment allowed to run long (up to
  ~240 frames) because the tension is the point.

### 4.3 Camera grammar — rules, not a list of shots
1. Cuts for UI beats (move selection, text, switch-in).
   Pans only for movement (approach, return, camera
   travelling between double-battle slots).
2. The camera is almost always moving *a little* — a slow
   idle drift (±6 px, 4-second cycle) on the wide shot so
   the arena never looks like a still image, even between
   turns. This is the "camera was almost always moving"
   quality that separates Stadium/Colosseum/PBR from the
   modern fixed-angle default.
3. Zoom is reserved for impact. If every phase zooms, none
   of them read. Wide = 1.0×, two-shot = 1.1×, impact =
   1.15× (physical) / 1.2× (special), capture = 1.3× on the
   target only.
4. Shake is reserved for impact and critical hits. Shake
   amplitude scales with damage fraction (small hit 2–4 px,
   big hit 5–8 px, critical adds 4 px and 4 extra frames).
   Never shake on a miss (a miss gets a "whoosh" slide past
   the target and a small camera dip instead).
5. Never obscure the HP bars, the move menu, or the target
   marker. If a zoom would cover them, the zoom is too
   close — clamp it.

### 4.4 Impact effects achievable with sprite sheets + PixiJS (no new engine)
- Hit flash: target `tint = white` for 3 frames, then restore.
  (PixiJS tint is a multiply — white = no change on a
  coloured sprite, so the flash must be implemented as a
  white overlay sprite at the target's position with alpha
  fading 1.0 → 0 over 6 frames, not as tint alone. This is
  a known PixiJS gotcha — write it into the implementation
  notes.)
- Impact burst: a pooled set of 8–16 small effect sprites
  (star/spark/flame/leaf/shard, per element) spawned at the
  contact point, flying outward with gravity/drag, additive
  blend mode, fading over 12–18 frames. One shared particle
  system, not per-move artwork: the particle *shape* is
  shared, the *colour* is per element.
- Element VFX library (one entry per Mochiichao True Element):
  Water = blue splash droplets + ripple ring; Chrome = silver
  slash lines + metallic sparks; Earth = brown rock shards +
  dust puff; Bug = green leaf/wing flakes; Umbral = dark
  purple smoke + red eye glint; Aero = white wind streaks;
  Core = orange energy rings; Strike = yellow impact star +
  speed lines; Deep = dark blue bubbles; Flame = orange/red
  flame tongues; Mythic = gold sparkles + ring; Normal = grey
  impact star. Each entry is: particle colour(s), particle
  shape, projectile sprite (if any), screen-edge colour.
  This library is the only per-element art needed for
  effects — creatures themselves do not need per-move art.
- Ground shadow: a blurred ellipse under each creature,
  scaling with the creature's scale (this is already in the
  current CSS renderer as a blurred ellipse — port it as a
  PixiJS ellipse sprite, not a texture, so it scales cleanly).
- Faint: creature plays its faint pose, then fades + sinks
  12 px over 24 frames (or, for theatrical faints in the
  PBR spirit, falls backward with rotation to ~-20° before
  fading). The faint animation is per-creature character,
  not a generic disappear — but a generic fall-back is
  acceptable for roster creatures whose dedicated faint
  pose is not yet drawn (see §6).

### 4.5 Faint, switch-in, and round flow
- Faint: impact segment ends, target HP hits 0, faint pose
  (24 frames), fade/sink (24 frames), camera holds on the
  fainting creature, then cuts wide for the switch-in.
  Switch-in: new creature slides/fades in from its side
  (18 frames) with a scale-in 0.8 → 1.0×. Total faint +
  switch budget: ~120 frames.
- Turn order: speed order is decided by logic, animation
  plays in that order, one attacker at a time. In doubles,
  the camera travels between slots (pan, 18 frames) between
  attackers — do not cut directly from one side's attacker
  to the other side's attacker without a travelling shot,
  or doubles become unreadable.
- End of round: status damage (poison/burn) plays as a
  short target-only segment (tint pulse + HP drain, 30
  frames, no camera move). Weather/field effects, if added
  later, play as a background overlay segment, not as a
  creature animation.

## 5. Pacing and player control — the Colosseum lesson
- Default speed: the §4 timeline (1.8–3.2 s per attack).
- Fast mode: 0.6× durations (approach and return shortened
  most, impact held — never shorten the impact below 12
  frames or hits stop reading). Fast mode is a battle-only
  toggle, separate from the existing world fast-forward
  (which is world-only in the cheat spec) — the parent must
  decide whether battle fast-forward is a cheat flag or a
  normal setting. Recommendation: normal setting, not a
  cheat flag, because it changes presentation only, not
  outcomes.
- Skip: pressing a key/button during a non-impact segment
  jumps to the end of that segment (not the whole attack).
  Skipping impact itself is not allowed — that would make
  damage appear without a cause.
- Text speed and animation speed are independent settings.
  Both default to the timeline above.

## 6. Sprite views REQUIRED — feed back to the Sprite Art lane

The existing Sprite Art lane checklist (battle front/back,
overworld front/back/left/right, walk up/down/left/right,
menu icon, 64×64 atlas + JSON manifest) is NECESSARY but
NOT SUFFICIENT for Arena presentation. Add these views per
creature, in priority order:

REQUIRED (P0 — Arena cannot do the PBR feel without them):
1. `battle_front_attack` — lunging / striking pose, front
   view (enemy creature, facing the player).
2. `battle_back_attack` — lunging / striking pose, back
   view (player creature, facing away).
3. `battle_front_hit` — flinch / recoil pose, front view.
4. `battle_back_hit` — flinch / recoil pose, back view.
5. `battle_front_faint` — faint pose, front view
   (theatrical where the creature's character allows it).
6. `battle_back_faint` — faint pose, back view.
7. `battle_idle` (2–3 frames, front and back) — breathing /
   shifting weight, looped during move selection and
   between turns. Without idle, the arena looks dead
   between attacks — this is the single cheapest way to
   get the Colosseum "alive" feel.

NICE TO HAVE (P1 — improves specific move types):
8. `battle_front_windup` / `battle_back_windup` — crouch /
   charge pose. Can be faked initially by scaling the
   idle pose down 0.92× and tinting, but a dedicated pose
   reads better for special moves.
9. `battle_side_attack` — for double battles, where a
   creature attacks a target on the far slot and the
   camera catches it side-on. Can be derived from the
   front_attack pose with a horizontal squash initially.
10. `battle_front_victory` / `battle_back_victory` — for
    the end-of-battle shot. Optional; the idle pose can
    stand in at first.

FALLBACKS (so Arena is testable before all views exist):
- Missing attack pose → use the base battle pose, scaled
  1.08×, rotated 6° toward the target, slid to the target.
  This reads as a lunge even without a dedicated pose.
- Missing hit pose → use the base pose, tint-flashed,
  shaken 8 px, rotated -4°.
- Missing faint pose → base pose, rotated to -20°,
  faded + sunk 12 px.
- Missing idle → base pose, scale breathing 1.0 ↔ 1.02×
  on a 2-second cycle.
These fallbacks must be marked in the manifest as
`fallback: true` per view, so the Sprite Art lane knows
which views are still owed.

WHAT IS NOT REQUIRED:
- No per-move creature art. A creature does not need a
  different pose for Tackle vs Iron Tail — the VFX library
  (§4.4) and the camera carry the move identity. This is
  how the scope stays at 7 required views per creature
  instead of 7 × ~36 moves.
- No 3/4 battle views for singles. Front/back are enough
  for singles; side views are a doubles nicety (P1 above).

## 7. Prototype plan — renderer change, in order (NOT code in the repo)

Current state (from the parent's audit): the world renderer
is CSS fake perspective (tile scale 0.88→1.0, sprites
0.85→1.0, gradients, blurred ellipse shadow), no depth
buffer / atlas / WebGL. BattleView is a React component
with sprite URLs. The direction file already orders this
as: PixiJS renderer (Phase 2) after roster unify and after
the Dorowani/Gabu bake proof.

Order for Arena presentation specifically:
1. **PixiJS battle scene, singles, no camera moves yet.**
   Port the existing battle layout (player back / enemy
   front, HP bars in DOM above the canvas, UI layer separate
   from the PixiJS stage) into a PixiJS Application with
   one Container per creature and one Container for the
   arena backdrop. Same tile maps / same battle logic.
   Acceptance: the existing battle plays identically,
   just rendered by PixiJS.
2. **Animation queue + timeline (§4) with fallbacks (§6).**
   Implement the event queue, the `triggered` contract
   (§2.4), and the universal timeline for one move type
   (physical contact) using Dorowani/Gabu sheets once
   they exist. Acceptance: a Dorowani-vs-Gabu test battle
   shows the lunge, both on screen at impact, HP draining
   at the triggered frame, and a return — the PBR-1 rule
   visibly working.
3. **Camera grammar (§3, §4.3).** Add the camera Container
   (pivot/scale/position), the wide/two-shot/impact
   framings, the idle drift, and the zoom clamps. No new
   creature art needed for this step.
4. **Move-type variants (§4.2) + VFX library (§4.4).**
   Special, status, ranged, multi-hit, in that order.
   One element's VFX entry at a time, starting with the
   starter elements (Water, Chrome, Flame — the starter
   lines' elements in the roster).
5. **Doubles.** Double layout (§3.2), slot travelling
   shots, target marker, partner dimming. Only after
   singles reads cleanly — doubles multiply every camera
   mistake by four.
6. **Faint / switch / capture polish + pacing controls
   (§5).** Fast mode, skip-to-segment-end, end-of-round
   status segments. Then, and only then, call Arena
   Mode presentation "done" for a vertical slice.

What can be tested with Dorowani/Gabu sheets once they
exist (and what cannot):
- CAN: singles timeline, PBR-1 lunge, impact zoom/shake,
  hit flash, VFX library for their elements, idle drift,
  faint/switch flow (with fallback faint poses).
- CANNOT yet: doubles (needs 4 distinct sheets), the
  full VFX library (needs one entry per element, starting
  with 3), or a dedicated attack/hit/faint pose per
  creature (falls back to §6 fallbacks until the Sprite
  Art lane delivers them).

## 8. Open questions for the parent / Mars (do NOT guess these)
1. Battle fast-forward: normal setting or cheat flag?
   (Recommendation in §5: normal setting.)
2. Is Arena Mode doubles-by-default (Colosseum style),
   or singles-by-default with doubles as a mode? This
   changes whether step 5 in §7 is in the vertical slice
   or after it.
3. Does the Arena announcer exist as text banners only,
   or is there a voice/audio plan? (Audio is currently
   0% in the game — text banners are the spec default.)
4. Roster unify is still blocked on starter naming,
   Pebblefist HP, and Beast/Flora/Neon — Arena presentation
   does not need those resolved to prototype with
   Dorowani/Gabu, but it does need them before Arena can
   use the full roster.

## 9. Battle doctrine — the living fight (owner-locked 2026-10-27)

Jamar's ruling, two lanes, one shared truth: **a battle is
alive between its decisive beats.**

### 9.1 Game lane (this spec's lane)
Battles stay command-driven, exactly like the Pokémon
games: the player's commands are what affect health and
outcome. What changes is what the player SEES between
commands. The creatures do not idle — between commands they
visibly fight and move in an active living fight (feinting,
circling, trading blows), instead of standing in place
waiting for the next order. This extends §1's finding —
in the reference games, idle behaviour is part of the feel,
not decoration — from idle motion to continuous combat
motion.

**Mechanical boundary (precise):** between-command action
is PRESENTATION ONLY. It is non-scoring: it deals no
damage, applies no status, consumes no PP, and decides
nothing. Health, faint state, and battle outcome change
ONLY when a command resolves, through the MOVE_ANIMATION /
CHECK_FAINT flow of the step-2 state machine
(docs/research-sweep/step2-battle-integration/). If a
between-command clip and a command resolution ever
disagree, the resolution wins and the clip is wrong —
never the arithmetic.

### 9.2 Show lane
The same doctrine from the show's side (SHOW-BIBLE §5,
Law 8): Mochi fight with their own agency. Rangers
sometimes command and direct, but the fight runs between
and without commands. The show has no command-resolution
layer at all — agency is the default state; a command is
an event inside the fight, not the fight's metronome.

### 9.3 The human role's name — CLOSED
CLOSED (owner lock, 2026-10-27): the canon term for the
human who commands in battle is RANGERS. Game data used
"trainers"; "keeper" is the Garden role only. Structural
ids (role:"trainer", trainer_*) are unchanged — this lock
is display/canon text.

## Sources
- Nintendo World Report, Pokémon Colosseum review:
  http://www.nintendoworldreport.com/review/4226/pokemon-colosseum-gamecube
- GameFAQs / ResetEra, Colosseum camera and animation discussion:
  https://gamefaqs.gamespot.com/boards/359435-pokemon-scarlet/80184119
- Wikipedia, Pokémon Battle Revolution:
  https://en.wikipedia.org/wiki/Pokémon_Battle_Revolution
- Bulbapedia, Pokémon Battle Revolution (development / camera cuts):
  https://bulbapedia.bulbagarden.net/wiki/Pokemon_Battle_Revolution
- Kotaku, "17 Years Later, Pokémon's Wii Animations Look Better Than Those In Modern Games":
  https://kotaku.com/pokemon-battle-revolution-animations-wii-scarlet-violet-1850362666
- GameFAQs, "What is the biggest presentation issue of the Pokemon series in 3D?" (moving vs fixed camera):
  https://gamefaqs.gamespot.com/boards/397901-pokemon-scarlet-pokemon-violet-the-hidden-treasure-of-area/81028881
- Pastebin, Scarlet/Violet move timing (community-timed):
  https://pastebin.com/0cm010CQ
- smogon/pokemon-showdown-client, directory structure (battle-animations*.ts = battle scene):
  https://deepwiki.com/smogon/pokemon-showdown-client/1.1-directory-structure
- smogon/pokemon-showdown, CONTRIBUTING (client code MIT):
  https://raw.githubusercontent.com/smogon/pokemon-showdown/master/CONTRIBUTING.md
- smogon/pokemon-showdown, README (server MIT):
  https://github.com/smogon/pokemon-showdown
- pret/pokeruby, Battle Animations (battle_anim.c, per-type modules):
  https://deepwiki.com/pret/pokeruby/4.2-battle-animations
- CFRU animation system (sprite tasks, palette/blending, particle tags):
  https://deepwiki.com/kapibarasan000/CFRU-JP/5-animation-system
- PixiJS camera as Container pivot/scale/position (scuti-renderer):
  https://deepwiki.com/mathishouis/scuti-renderer/11.1-pixijs-integration
- pixi-viewport, MIT licence, follow/snap/clampZoom:
  https://socket.dev/npm/package/pixi-viewport/overview/0.12.0
- PixiJS licence MIT (via PixiJS guide, release notes):
  https://wpdean.com/what-is-pixijs/
- gdquest-demos/godot-2d-jrpg-combat, Battler Animation (triggered / animation_finished contract):
  https://deepwiki.com/gdquest-demos/godot-2d-jrpg-combat/2.1.2-battler-animation
