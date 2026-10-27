import React, { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, DisplacementFilter, Graphics, Sprite, Texture } from 'pixi.js';
import { TITLE_BIOMES, type TitleBiomeId } from '../../lib/titleBiomes';
import { TITLE_CARD_ANIMATION_STYLES } from '../../lib/titleActionShots';
import {
  CREATURE_ACTIONS, TITLE_BIOME_MOTION, TITLE_CARD_EFFECTS,
  creatureActionFrame,
} from '../../lib/titleCardEffects';
import {
  black2CameraPose, black2MotionBlurAlpha, fireRedParticleStep, fireRedStreakStep,
  heartGoldStartFlashVisible, platinumExitOverlay, rubyPhase1Refires, rubyShineStart,
  rubyShineStep, FIRE_RED_FLAME_OFFSET_CYCLE, FIRE_RED_FLAME_SPAWN_DELAY,
  FIRE_RED_FLAME_X_POSITIONS, FIRE_RED_FLAME_Y_BASE, FIRE_RED_LEAF_DELAY_BASE,
  FIRE_RED_LEAF_DELAY_RANGE, FIRE_RED_LEAF_Y_BASE, FIRE_RED_LEAF_Y_RANGE,
  FIRE_RED_STREAK_COUNT, FIRE_RED_STREAK_SPACING, FIRE_RED_STREAK_Y_POSITIONS,
  GBA_DISPLAY_HEIGHT, GBA_DISPLAY_WIDTH, PLATINUM_ENTRY_MAIN_FADE_FRAMES,
  PLATINUM_EXIT_FADE_DELAY, PLATINUM_EXIT_FADE_FRAMES, RUBY_PHASE1_COUNTER_START,
  type PlatinumExitKind, type RubyShineState, type SubpixelParticle,
} from '../../lib/titleAnimations';
import { playTitleCry, titleCryUrl, TITLE_CRY_WAIT_MS } from '../../lib/titleCryGate';

/**
 * TitleScene — the shared title/start scene system (Mars, 2026-10-25).
 * Layers, traced from Pokemon title screens, Mochiichao content:
 *   0. painted background (original 1600x900 PNG, when the biome has one),
 *      drifting per biome (titleCardEffects: far layer moves slowest,
 *      HeartGold flyover order) inside a 1.06 cover overscan;
 *      water card adds a Pixi DisplacementFilter ripple (generated
 *      noise map, scrolling) on top of the drift
 *   1. sky background (two-tone gradient band, Pixi-drawn; fallback only)
 *   2. ground band + ground line
 *   3. figure sprite, supplied by the caller (Yogiferno PR #33
 *      + the other 9 cutouts in this batch — NO Pokemon art)
 *   3.5. foreground frame, in front of the figure's feet (grass
 *      tufts / water line / snow drifts / forest corners)
 *   4. weather / particle layer: snow, rain, leaves, dust, shimmer
 *   4.5. per-card signature effect (twinkle / ripple / scan /
 *      lightning + splash / fireflies / pollen / dust motes) +
 *      per-creature action burst (FireRed scene 3: hop -> burst
 *      -> recoil, 360-frame cycle)
 *   V2 (locked styles, titleActionShots.ts): figure fades in at
 *   centre (frames 0-59), eases to its locked rest offset (frames
 *   60-119, restX * W/1600, Mythar 0), then the action loop runs
 *   at rest instead of the old endless walk; 4 wind streaks run
 *   behind the figure (LeafGreen streak idea, alpha 0.3).
 *   5. Yogiferno fire trail (only when figureUrl is set): embers
 *      spawning behind the feet + fading scorch glow on the ground,
 *      fire halo is baked into the clean cutout itself.
 * Motion is PixiJS v8 ticker + sine sway (offset = sine x amplitude
 * on a base position, FireRed sine method shape) — never a static
 * painted trail. prefers-reduced-motion renders the scene static.
 *
 * Biomes are generic terrain/weather only (snow, grass, water,
 * sand, stone, forest, rain, night). No Pokemon texture, creature,
 * logo, name, dialogue or music is used here.
 *
 * Title animation systems wired here (Batch 1, from the actual
 * decomp files — see src/lib/titleAnimations.ts for the constants
 * and the per-system translation notes): FireRed flame/leaf/streak
 * spawners, HeartGold start-flash 0/30/45, Ruby logo shine
 * (x+=4, brightness +-2 to 31/0, re-fire at counters 160 and 64),
 * Black 2 camera curve (7300-frame loop) + capture-blend motion
 * blur (12/4, 8/8 on exit), Platinum entry/exit fades (entry
 * black 48 frames, exit delay 10 + white 6 + white-in 6, clear-
 * save black 6, BGM fade 60 frames as a documented duration —
 * no audio is shipped). All 10/10 title creatures now have
 * clean cutouts: Yogiferno (PR #33) + the other 9 in this
 * batch, wired via TitleCreatureFigure. No art is invented here.
 *
 * Title cry gate (title 10 only, Mars-confirmed 2026-10-26): where
 * startPrompt is true, a press plays the current figure's cry
 * (titleCryGate.ts, species-indexed, SFX bus, centre pan, normal
 * priority, no music ducking), waits 90 frames (1.5s), then drives
 * the Platinum 'normal' white fade. No other creature is in the
 * table; unknown figures get no cry and no exit.
 */
export default function TitleScene({
  biome = 'snow',
  figureUrl,
  figureCycleUrls,
  figureCycleMs = 500,
  figureAlt = 'Title figure',
  figureName,
  fireTrail = false,
  caption,
  startPrompt = false,
  exitKind = 'none',
}: {
  biome?: TitleBiomeId;
  figureUrl?: string;
  /** Optional frame cycle for one figure (Kittember glow only,
   *  2026-10-26 wiring): textures are swapped on the SAME sprite
   *  in the ticker, so the scene is never recreated per frame.
   *  Unset = the old single-figure path, unchanged. All frames
   *  must share the figure's size, so scale/shadow stay valid. */
  figureCycleUrls?: string[];
  /** Milliseconds per cycle frame (Kittember: 500). Converted to
   *  frames at 60fps in the ticker, matching this file's other
   *  frame-counted systems. */
  figureCycleMs?: number;
  figureAlt?: string;
  /** Title-pool creature name, when the figure is one: drives its
   *  per-creature action (hop / bob / roar / shield / orbit) and
   *  its effect burst from titleCardEffects. Unset figures keep
   *  the plain walk + sine sway, no action claimed. */
  figureName?: string;
  fireTrail?: boolean;
  caption?: string;
  /** HeartGold start flash prompt (0 show / 30 hide / 45 cycle).
   *  Default false: IntroSequence keeps its own press-blink wiring
   *  (PR #28) untouched; set true only where TitleScene itself
   *  should own the prompt. Where true, the title cry gate also
   *  owns the press: cry -> 90-frame wait -> white fade. */
  startPrompt?: boolean;
  /** Platinum exit driver: 'normal' (white out/in) or 'clearSave'
   *  (black out). 'none' (default) leaves the scene running.
   *  IntroSequence does NOT set this yet. The title cry gate
   *  (startPrompt=true only) sets the internal exit to 'normal'
   *  90 frames after a press, so a press IS input-triggered there. */
  exitKind?: PlatinumExitKind;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [startVisible, setStartVisible] = useState(true);
  // Title cry gate state: the internal exit the gate sets 90 frames
  // after a press. An explicit exitKind prop always wins; otherwise
  // the gate's exit drives the Platinum exit driver below.
  const [cryExitKind, setCryExitKind] = useState<PlatinumExitKind>('none');
  const cryGateFiredRef = useRef(false);
  const cryGateTimerRef = useRef<number | null>(null);
  const exitKindRef = useRef<PlatinumExitKind>(exitKind);
  const effectiveExitKind: PlatinumExitKind = exitKind !== 'none' ? exitKind : cryExitKind;
  useEffect(() => { exitKindRef.current = effectiveExitKind; }, [effectiveExitKind]);
  const startPromptRef = useRef<boolean>(startPrompt);
  useEffect(() => { startPromptRef.current = startPrompt; }, [startPrompt]);

  // Title cry gate (title 10 only): press -> PlayCry for the current
  // title creature -> 90-frame (1.5s) wait -> white fade. Active ONLY
  // where TitleScene itself owns the prompt (startPrompt=true);
  // callers without startPrompt (IntroSequence, TitleCreatureFigure,
  // YogifernoTitleWalk) are untouched, and a figure outside the
  // title 10 table gets no cry and no exit — the scene keeps running
  // exactly as before. The press also stops the start-flash prompt:
  // a consumed press must not keep flashing through the wait.
  // prefers-reduced-motion: the cry still plays on press, but the
  // white fade itself is ticker-driven, so a static scene stays
  // static there (existing reduced-motion behaviour, unchanged).
  useEffect(() => {
    if (!startPrompt) return;
    const onPress = () => {
      if (cryGateFiredRef.current) return;
      if (!titleCryUrl(figureName)) return;
      cryGateFiredRef.current = true;
      startPromptRef.current = false;
      setStartVisible(false);
      void playTitleCry(figureName);
      cryGateTimerRef.current = window.setTimeout(() => {
        setCryExitKind('normal');
      }, TITLE_CRY_WAIT_MS);
    };
    window.addEventListener('keydown', onPress);
    window.addEventListener('pointerdown', onPress);
    return () => {
      window.removeEventListener('keydown', onPress);
      window.removeEventListener('pointerdown', onPress);
      if (cryGateTimerRef.current !== null) window.clearTimeout(cryGateTimerRef.current);
    };
  }, [startPrompt, figureName]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const b = TITLE_BIOMES[biome];
    const app = new Application();
    app.init({ resizeTo: host, backgroundAlpha: 0, antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(async () => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      const W = app.screen.width;
      const H = app.screen.height;
      const groundY = H - 34;
      // Black 2 camera layer: everything scene-space goes in here
      // so the camera pan/zoom can move it; screen-space overlays
      // (fades, shine brightness) stay on app.stage below.
      const scene = new Container();
      scene.pivot.set(W / 2, H / 2);
      scene.position.set(W / 2, H / 2);
      app.stage.addChild(scene);

      // Layer 0: painted background, when this biome has one.
      // Added to the camera `scene` container (not app.stage) so
      // the Black 2 camera pan/zoom moves it with everything else.
      // Cover-crop, centred, so the title-safe centre haze of the
      // painting lands under the logo / creature / press layers.
      // If the painting is absent or fails to load, fall through
      // to the Pixi sky/ground rectangles below — never a blank.
      let painted = false;
      let bgSprite: Sprite | null = null;
      let rippleSprite: Sprite | null = null;
      if (b.backgroundImage) {
        try {
          const bgTex: Texture = await Assets.load(b.backgroundImage);
          const bg = new Sprite(bgTex);
          // Cover x 1.06 overscan: the per-biome drift (titleCardEffects)
          // moves the painting up to 10px, and the overscan margin is
          // ~10px vertical / ~21px horizontal at this host size, so
          // drift can never reveal an edge. Scale stays fixed; only
          // position drifts, so the cover never shrinks below full.
          const scale = Math.max(W / bgTex.width, H / bgTex.height) * 1.06;
          bg.scale.set(scale);
          bg.anchor.set(0.5, 0.5);
          bg.x = W / 2; bg.y = H / 2;
          scene.addChild(bg);
          bgSprite = bg;
          painted = true;
          // Water card only: PixiJS v8 DisplacementFilter ripple,
          // from the official Pixi docs (red = horizontal offset,
          // green = vertical). The displacement map is generated
          // in code, not shipped as an asset: a 64x64 random
          // grayscale canvas upscaled with smoothing to 256x256
          // gives the cloudy noise a displacement map needs.
          // The filter constructor sets the map sprite
          // renderable=false, so adding it to the scene does NOT
          // draw it — it only gives it a live transform for the
          // filter matrix, which is what makes the map scroll.
          // Skipped under prefers-reduced-motion (static painting
          // must not be distorted). Ripple rings + shimmer stay
          // as the fallback if this filter ever fails to apply.
          if (biome === 'water' && !reduced) {
            try {
              const small = document.createElement('canvas');
              small.width = 64; small.height = 64;
              const sctx = small.getContext('2d');
              if (sctx) {
                const img = sctx.createImageData(64, 64);
                for (let i = 0; i < img.data.length; i += 4) {
                  const v = Math.floor(Math.random() * 256);
                  img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
                }
                sctx.putImageData(img, 0, 0);
                const big = document.createElement('canvas');
                big.width = 256; big.height = 256;
                const bctx = big.getContext('2d');
                if (bctx) {
                  bctx.imageSmoothingEnabled = true;
                  bctx.drawImage(small, 0, 0, 256, 256);
                  const mapTex = Texture.from(big);
                  mapTex.source.style.addressMode = 'repeat';
                  rippleSprite = new Sprite(mapTex);
                  rippleSprite.scale.set((W * 2) / 256, (H * 2) / 256);
                  scene.addChild(rippleSprite);
                  bg.filters = [new DisplacementFilter({ sprite: rippleSprite, scale: { x: 14, y: 10 } })];
                }
              }
            } catch {
              rippleSprite = null; // filter failed: rings + shimmer still run
            }
          }
        } catch {
          painted = false;
        }
      }
      // Layer 1+2: sky + ground, Pixi-drawn, biome palette only.
      // Skipped when a painting is showing; kept as the fallback
      // for biomes whose batch has not landed yet.
      if (!painted) {
        const sky = new Graphics();
        sky.rect(0, 0, W, groundY).fill(b.sky);
        sky.rect(0, 0, W, Math.floor(groundY / 2)).fill(b.sky2);
        scene.addChild(sky);
        const ground = new Graphics();
        ground.rect(0, groundY, W, H - groundY).fill(b.ground);
        ground.rect(0, groundY, W, 2).fill(b.groundLine);
        scene.addChild(ground);
      }
      if (b.tufts && !painted) {
        const tufts = new Graphics();
        for (let x = 8; x < W; x += 34) {
          tufts.moveTo(x, groundY + 22).lineTo(x + 3, groundY + 8).lineTo(x + 6, groundY + 22).fill(b.groundLine);
        }
        scene.addChild(tufts);
      }
      if (b.shimmer && !painted) {
        const shim = new Graphics();
        for (let x = 0; x < W; x += 44) shim.rect(x, groundY + 14, 22, 2).fill(0xffffff);
        shim.alpha = 0.5;
        scene.addChild(shim);
      }
      // Clouds: three soft ellipses drifting in the ticker below.
      const clouds: Graphics[] = [];
      for (let i = 0; i < 3; i++) {
        const c = new Graphics();
        c.ellipse(0, 0, 42, 12).fill({ color: 0xffffff, alpha: 0.35 });
        c.x = (W / 3) * i + 20; c.y = 22 + i * 18;
        scene.addChild(c); clouds.push(c);
      }

      // Layer 2.5: v2 wind streaks (locked per-card animation v2,
      // docs/title-animation-v2-complex.md). LeafGreen streak idea
      // from docs/title-pokemon-leaf-research.md: fast thin lines
      // moving left, wrapping to the right edge, heights cycling.
      // Separate from the FireRed streak spawner below (leaf biomes
      // only, alpha 0.7, in front): these run on every biome, are
      // subtle (alpha 0.3), and are created BEFORE the figure so
      // they sit BEHIND it. Speed is 7 px/frame at the 1600-wide
      // draft reference, scaled by W/1600 to this host.
      interface V2Streak { g: Graphics; x: number; yIndex: number; }
      const v2StreakHeights = [0.25, 0.5, 0.68, 0.4];
      const v2StreakSpeed = 7 * (W / 1600);
      const v2StreakLen = Math.max(16, 24 * (W / 1600));
      const v2Streaks: V2Streak[] = [];
      for (let i = 0; i < 4; i++) {
        const g = new Graphics();
        g.rect(0, 0, v2StreakLen, 2).fill({ color: 0xffffff, alpha: 0.3 });
        g.x = W + 20 + i * 60;
        g.y = H * v2StreakHeights[i];
        scene.addChild(g);
        v2Streaks.push({ g, x: g.x, yIndex: i });
      }
      // Locked per-card animation style for this figure, when it is
      // a title-pool creature (titleActionShots.ts, LOCKED Mars
      // 2026-10-26 ~07:07 CDT). restX is in 1600-wide draft-frame
      // px, scaled to this host. Unset figures have no locked
      // style and keep the old walk (see ticker), no action claimed.
      const v2Style = figureName ? TITLE_CARD_ANIMATION_STYLES.find((s) => s.creature === figureName) : undefined;
      const v2RestOffset = v2Style ? v2Style.restX * (W / 1600) : 0;
      const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

      // Layer 3: figure sprite, if supplied. Scaled to ~150px tall
      // inside the 180px host, anchored at the feet.
      let figure: Sprite | null = null;
      let figureTex: Texture | null = null;
      let figureBaseScale = 1;
      // Engine-drawn ground shadow, Pokemon-first: FireRed draws the
      // shadow as a SEPARATE 32x8 sprite (gEnemyMonShadow_Gfx,
      // PALTAG_SHADOW, SetBattlerShadowSpriteCallback), never baked
      // into the creature art. Title cutouts are now shadow-free
      // (PR #84 white-spot batch, PR #95 Razorgater), so the engine
      // owns the shadow here: one ellipse under the figure's feet,
      // drawn BEFORE the figure so feet overlap it, never bobbing
      // with the figure — a ground shadow stays on the ground.
      let shadow: Graphics | null = null;
      if (figureUrl) {
        try {
          const tex: Texture = await Assets.load(figureUrl);
          figureTex = tex;
          figure = new Sprite(tex);
          const targetH = 150;
          const scale = targetH / tex.height;
          figureBaseScale = scale;
          figure.scale.set(scale);
          figure.anchor.set(0.5, 1);
          figure.x = W / 2; figure.y = groundY + 6;
          // V2 entrance starts invisible at centre; the ticker
          // fades it in over the first 60 frames. Unset figures
          // stay fully visible (old walk, no entrance claimed).
          if (v2Style) figure.alpha = 0;
          scene.addChild(figure);
          shadow = new Graphics();
          const dispW = tex.width * scale;
          const shW = dispW * 0.65;
          shadow.ellipse(0, 0, shW / 2, shW * 0.25 / 2).fill({ color: 0x000000, alpha: 0.32 });
          shadow.x = figure.x; shadow.y = groundY + 12;
          scene.addChildAt(shadow, scene.children.indexOf(figure));
        } catch {
          figure = null; // figure missing: scene still renders, caption labels the gap
          shadow = null;
        }
      }
      // Figure frame cycle (Kittember glow only): preload every
      // frame now; the ticker swaps figure.texture, never the
      // sprite, so position/scale/shadow/action all keep running.
      // Any load failure disables cycling and leaves the base
      // figure (cycle[0]) in place — a missing glow frame must
      // never blank the figure or shift the cycle out of order.
      let cycleTextures: Texture[] = [];
      let lastCycleIndex = 0;
      if (figure && figureCycleUrls && figureCycleUrls.length > 1) {
        try {
          const loaded = await Promise.all(figureCycleUrls.map((u) => Assets.load(u)));
          if (loaded.length === figureCycleUrls.length) cycleTextures = loaded;
        } catch {
          cycleTextures = [];
        }
      }

      // Layer 3.5: foreground frame, drawn AFTER the figure so it
      // sits in front of its feet — the Pokemon title layering
      // (grass / water / drift in front of the creature), kept to
      // the bottom strip and top corners only, never over the
      // figure's centre, and low enough that feet stay readable.
      // It runs whether or not a painting is showing: the painting
      // already has its own edge detail, and this frame is the
      // moving-scene foreground that ties figure to ground.
      {
        const fg = new Graphics();
        fg.rect(0, H - 26, W, 26).fill({ color: 0x000000, alpha: 0.18 });
        if (biome === 'grass' || biome === 'forest') {
          for (let x = 10; x < W; x += 52) {
            fg.moveTo(x, H).lineTo(x + 3, H - 10).lineTo(x + 6, H).fill(b.groundLine);
          }
        }
        if (biome === 'water') {
          fg.rect(0, groundY + 14, W, 2).fill({ color: 0xffffff, alpha: 0.35 });
        }
        if (biome === 'snow') {
          fg.ellipse(14, H, 30, 10).fill({ color: 0xffffff, alpha: 0.5 });
          fg.ellipse(W - 14, H, 30, 10).fill({ color: 0xffffff, alpha: 0.5 });
        }
        if (biome === 'forest') {
          fg.moveTo(0, 0).lineTo(26, 0).lineTo(0, 22).fill({ color: 0x052e16, alpha: 0.55 });
          fg.moveTo(W, 0).lineTo(W - 26, 0).lineTo(W, 22).fill({ color: 0x052e16, alpha: 0.55 });
        }
        scene.addChild(fg);
      }

      // Layer 4+5: weather + fire trail particles.
      interface P { g: Graphics; vx: number; vy: number; life: number; max: number; kind: 'ember' | 'scorch' | 'flake' | 'rain' | 'leaf' | 'leaves' | 'dust' | 'bubble' | 'spark' | 'sandburst' | 'smoke' | 'fire' | 'sparkle' | 'shield' | 'splash'; sway: number; }
      const particles: P[] = [];
      // Creature effect burst (FireRed scene 3 "attack" beat): one
      // burst kind per creature, from its own manifest VFX in
      // titleCardEffects. Shield is a single expanding ring around
      // the figure; the rest are small particles from the figure.
      const spawnCreatureBurst = (kind: string, x: number, y: number, color: number) => {
        if (kind === 'shield') {
          const g = new Graphics();
          g.circle(0, 0, 26).stroke({ color, width: 3 });
          g.x = x; g.y = y - 60; scene.addChild(g);
          particles.push({ g, vx: 0, vy: 0, life: 0, max: 1.0, kind: 'shield', sway: 0 });
          return;
        }
        const count = kind === 'sand' ? 10 : kind === 'smoke' ? 5 : 8;
        for (let i = 0; i < count; i++) {
          const g = new Graphics();
          const r = kind === 'smoke' ? 5 + Math.random() * 4 : 2 + Math.random() * 2.5;
          if (kind === 'sparkle') g.circle(0, 0, r).fill(0xffffff);
          else if (kind === 'leaves') { g.moveTo(-5, 0).lineTo(0, -3).lineTo(5, 0).lineTo(0, 3).lineTo(-5, 0).fill(color); g.moveTo(-5, 0).lineTo(-8, 2).stroke({ color, width: 1 }); }
          else g.circle(0, 0, r).fill(color);
          const a = (i / count) * Math.PI * 2 + Math.random() * 0.5;
          const sp = kind === 'spark' || kind === 'fire' ? 40 + Math.random() * 40 : 14 + Math.random() * 18;
          g.x = x; g.y = y - 60; scene.addChild(g);
          particles.push({
            g,
            vx: Math.cos(a) * sp,
            vy: kind === 'bubble' || kind === 'smoke' ? -30 - Math.random() * 20 : kind === 'leaves' ? 10 + Math.random() * 12 : Math.sin(a) * sp - 10,
            life: 0, max: 0.9 + Math.random() * 0.5,
            kind: kind as P['kind'], sway: Math.random() * Math.PI * 2,
          });
        }
      };
      const spawnEmber = (x: number, y: number) => {
        const g = new Graphics();
        g.circle(0, 0, 2 + Math.random() * 3).fill(Math.random() < 0.5 ? 0xf97316 : 0xef4444);
        g.x = x; g.y = y; scene.addChild(g);
        particles.push({ g, vx: (Math.random() - 0.5) * 12, vy: -18 - Math.random() * 22, life: 0, max: 1.1 + Math.random() * 0.5, kind: 'ember', sway: Math.random() * Math.PI * 2 });
      };
      const spawnScorch = (x: number) => {
        const g = new Graphics();
        g.ellipse(0, 0, 16, 5).fill({ color: 0xea580c, alpha: 0.35 });
        g.x = x; g.y = groundY + 8; scene.addChild(g);
        particles.push({ g, vx: 0, vy: 0, life: 0, max: 3, kind: 'scorch', sway: 0 });
      };
      const weather: { g: Graphics; speed: number; phase: number }[] = [];
      if (b.weather !== 'none') {
        for (let i = 0; i < b.weatherCount; i++) {
          const g = new Graphics();
          if (b.weather === 'rain') g.rect(0, 0, 1.5, 10).fill(0xbfdbfe);
          else if (b.weather === 'leaves') g.moveTo(-5, 0).lineTo(0, -3).lineTo(5, 0).lineTo(0, 3).lineTo(-5, 0).fill(0x4ade80);
          else if (b.weather === 'dust') g.circle(0, 0, 2).fill(0xfde68a);
          else g.circle(0, 0, 1.5 + Math.random() * 2).fill(0xffffff);
          g.x = Math.random() * W; g.y = Math.random() * H;
          scene.addChild(g);
          weather.push({ g, speed: b.weather === 'rain' ? 90 + Math.random() * 60 : 12 + Math.random() * 20, phase: Math.random() * Math.PI * 2 });
        }
      }

      // Layer 4 (card effect): one signature effect per biome, from
      // TITLE_CARD_EFFECTS, drawn after the figure. Twinkle /
      // firefly / pollen / dust dots pulse and drift; water ripple
      // rings expand from the shore; the stone scan-line sweeps
      // only when the figure is Razorgater (its manifest scan), and
      // other stone figures get slow dust motes instead.
      const cardEffect = TITLE_CARD_EFFECTS[biome];
      interface Tw { g: Graphics; phase: number; baseY: number; }
      const twinkles: Tw[] = [];
      if (cardEffect.kind === 'twinkle' || cardEffect.kind === 'fireflies' || cardEffect.kind === 'pollen' || cardEffect.kind === 'dustmotes') {
        for (let i = 0; i < cardEffect.count; i++) {
          const g = new Graphics();
          g.circle(0, 0, 1.5 + Math.random() * 1.5).fill(cardEffect.color);
          g.x = Math.random() * W; g.y = Math.random() * (H - 40);
          scene.addChild(g);
          twinkles.push({ g, phase: Math.random() * Math.PI * 2, baseY: g.y });
        }
      }
      interface Ring { g: Graphics; r: number; }
      const ripples: Ring[] = [];
      if (cardEffect.kind === 'ripple') {
        for (let i = 0; i < cardEffect.count; i++) {
          const g = new Graphics();
          g.circle(0, 0, 8).stroke({ color: cardEffect.color, width: 2 });
          g.x = W / 2; g.y = groundY + 12;
          scene.addChild(g);
          ripples.push({ g, r: 8 + i * 14 });
        }
      }
      let scanLine: Graphics | null = null;
      const showScan = cardEffect.kind === 'scan' && figureName === 'Razorgater';
      if (showScan) {
        scanLine = new Graphics();
        scanLine.rect(0, 0, 2, H).fill({ color: cardEffect.color, alpha: 0.3 });
        scene.addChild(scanLine);
      } else if (biome === 'stone') {
        for (let i = 0; i < 10; i++) {
          const g = new Graphics();
          g.circle(0, 0, 1.5).fill(0xe2e8f0);
          g.x = Math.random() * W; g.y = Math.random() * (H - 40);
          scene.addChild(g);
          twinkles.push({ g, phase: Math.random() * Math.PI * 2, baseY: g.y });
        }
      }

      // Black 2 motion-blur ghost: one copy of the figure at the
      // previous frame's position, alpha = captureEvb / 16.
      let ghost: Sprite | null = null;
      if (figure && figureTex) {
        ghost = new Sprite(figureTex);
        ghost.scale.copyFrom(figure.scale);
        ghost.anchor.set(0.5, 1);
        ghost.alpha = black2MotionBlurAlpha(false);
        ghost.visible = false;
        scene.addChild(ghost);
      }

      // Screen-space overlays (app.stage, NOT scene: fades and the
      // shine brightness must cover the full canvas even while the
      // Black 2 camera pans/zooms the scene container).
      const entryOverlay = new Graphics();
      entryOverlay.rect(0, 0, W, H).fill(0x000000);
      app.stage.addChild(entryOverlay);
      const exitWhite = new Graphics();
      exitWhite.rect(0, 0, W, H).fill(0xffffff);
      exitWhite.alpha = 0;
      app.stage.addChild(exitWhite);
      const exitBlack = new Graphics();
      exitBlack.rect(0, 0, W, H).fill(0x000000);
      exitBlack.alpha = 0;
      app.stage.addChild(exitBlack);
      // Ruby shine band (vertical white band sweeping left to right)
      // + background-brightness overlay for flashBackground shines.
      const shineBand = new Graphics();
      shineBand.rect(0, 0, 36, H).fill({ color: 0xffffff, alpha: 0.55 });
      shineBand.visible = false;
      app.stage.addChild(shineBand);
      const shineBg = new Graphics();
      shineBg.rect(0, 0, W, H).fill(0xffffff);
      shineBg.alpha = 0;
      app.stage.addChild(shineBg);
      // Rain card lightning: a screen-space white flash, frame-counted
      // (every 420 frames, 6 frames at full alpha, then decay) — the
      // HeartGold flash structure, not a random flicker.
      const lightning = new Graphics();
      lightning.rect(0, 0, W, H).fill(0xffffff);
      lightning.alpha = 0;
      app.stage.addChild(lightning);

      // FireRed spawners. GBA space is stepped with the pure
      // functions, then scaled to canvas space at draw time.
      const scaleX = W / GBA_DISPLAY_WIDTH;
      const scaleY = H / GBA_DISPLAY_HEIGHT;
      const frMode: 'flame' | 'leaf' | 'none' = fireTrail ? 'flame' : (biome === 'grass' || biome === 'forest' ? 'leaf' : 'none');
      interface FrP { g: Graphics; p: SubpixelParticle; }
      const frParticles: FrP[] = [];
      const spawnFrParticle = (xGba: number, yGba: number, sx: number, sy: number, color: number, r: number) => {
        const g = new Graphics();
        g.circle(0, 0, r).fill(color);
        scene.addChild(g);
        frParticles.push({ g, p: { posX: xGba * 16, posY: yGba * 16, speedX: sx, speedY: sy } });
      };
      const randFlameSpeed = () => ({ sx: Math.floor(Math.random() * 4) - 2, sy: Math.floor(Math.random() * 8) - 16 });
      let flameOffset = 0;
      const spawnFlameBurst = () => {
        const y = FIRE_RED_FLAME_Y_BASE + Math.floor(Math.random() * 3);
        const first = randFlameSpeed();
        spawnFrParticle(Math.floor(Math.random() * GBA_DISPLAY_WIDTH), y, first.sx, first.sy, 0xf97316, 3);
        for (let i = 0; i < FIRE_RED_FLAME_X_POSITIONS.length; i++) {
          const sp = randFlameSpeed();
          spawnFrParticle(flameOffset + FIRE_RED_FLAME_X_POSITIONS[i], y, sp.sx, sp.sy, Math.random() < 0.5 ? 0xf97316 : 0xef4444, 2.5);
        }
        flameOffset = (flameOffset + 1) % FIRE_RED_FLAME_OFFSET_CYCLE;
      };
      const spawnLeaf = () => {
        const rval = Math.floor(Math.random() * 30);
        let xspeed = 16;
        if (rval >= 6) { xspeed = 48; if (rval < 12) xspeed = 24; }
        spawnFrParticle(GBA_DISPLAY_WIDTH, FIRE_RED_LEAF_Y_BASE + Math.floor(Math.random() * FIRE_RED_LEAF_Y_RANGE), xspeed, Math.floor(Math.random() * 4) - 2, 0x4ade80, 3);
      };
      interface Streak { g: Graphics; x: number; yIndex: number; }
      const streaks: Streak[] = [];
      if (frMode === 'leaf') {
        for (let i = 0; i < FIRE_RED_STREAK_COUNT; i++) {
          const g = new Graphics();
          g.rect(0, 0, 24, 2).fill({ color: 0xffffff, alpha: 0.7 });
          scene.addChild(g);
          streaks.push({ g, x: GBA_DISPLAY_WIDTH + 16 + FIRE_RED_STREAK_SPACING * i, yIndex: i });
        }
      }

      if (reduced) {
        entryOverlay.alpha = 0;
        shineBand.visible = false;
        shineBg.alpha = 0;
        return;
      }
      let x = -80; let t = 0; let emberTimer = 0; let scorchTimer = 0;
      let lastBurstCycle = -1; let splashTimer = 0;
      let frame = 0;
      let flameTimer = 0; let leafTimer = 0;
      let leafDelay = FIRE_RED_LEAF_DELAY_BASE + Math.floor(Math.random() * FIRE_RED_LEAF_DELAY_RANGE);
      let shine: RubyShineState | null = rubyShineStart(false);
      let lastPhaseCounter = RUBY_PHASE1_COUNTER_START;
      let lastStartVisible = true;
      let lastExitKind: PlatinumExitKind = 'none';
      let exitPhase: 'delay' | 'out' | 'in' | 'done' = 'delay';
      let exitFrame = 0;
      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        t += dt / 60;
        frame += dt;
        const frameInt = Math.floor(frame);
        // Platinum entry: black overlay out over 48 frames.
        entryOverlay.alpha = frameInt < PLATINUM_ENTRY_MAIN_FADE_FRAMES ? 1 - frameInt / PLATINUM_ENTRY_MAIN_FADE_FRAMES : 0;
        // HeartGold start flash: drive the optional prompt only.
        if (startPromptRef.current) {
          const vis = heartGoldStartFlashVisible(frameInt, true);
          if (vis !== lastStartVisible) { lastStartVisible = vis; setStartVisible(vis); }
        }
        // Black 2 camera: slow closed pan/zoom, 7300-frame loop.
        const pose = black2CameraPose(frameInt);
        scene.x = W / 2 + pose.panX * 12;
        scene.y = H / 2 + pose.panY * 12;
        scene.scale.set(pose.zoom);
        // Per-biome background drift (HeartGold parallax order: the
        // far layer moves slowest). On top of the camera motion,
        // inside the 1.06 overscan margin, so no edge ever shows.
        if (bgSprite) {
          const m = TITLE_BIOME_MOTION[biome];
          bgSprite.x = W / 2 + Math.sin(t * m.speed) * m.ampX;
          bgSprite.y = H / 2 + Math.sin(t * m.speed * 0.7) * m.ampY;
        }
        // Water displacement map scrolls slowly; wrapMode repeat
        // means the 256px loop never shows a seam.
        if (rippleSprite) {
          rippleSprite.x = (t * 20) % 256;
          rippleSprite.y = (t * 12) % 256;
        }
        for (const c of clouds) { c.x += 6 * dt / 60; if (c.x > W + 50) c.x = -50; }
        // V2 wind streaks: move left, wrap to the right edge,
        // heights cycle through v2StreakHeights on each wrap.
        for (const st of v2Streaks) {
          st.x -= v2StreakSpeed * dt;
          if (st.x < -v2StreakLen) {
            st.x = W + 20;
            st.yIndex = (st.yIndex + 1) % v2StreakHeights.length;
            st.g.y = H * v2StreakHeights[st.yIndex];
          }
          st.g.x = st.x;
        }
        if (figure) {
          // Figure frame cycle (Kittember glow only, 500ms/frame
          // = 30 frames at 60fps): swap texture only, on the same
          // sprite; the ghost follows so the blur never shows a
          // stale glow step. Reduced-motion scenes never reach
          // this ticker, so they stay on cycle[0] (glow off).
          if (cycleTextures.length > 1) {
            const framesPerStep = Math.max(1, Math.round((figureCycleMs / 1000) * 60));
            const idx = Math.floor(frameInt / framesPerStep) % cycleTextures.length;
            if (idx !== lastCycleIndex) {
              lastCycleIndex = idx;
              figure.texture = cycleTextures[idx];
              if (ghost) ghost.texture = cycleTextures[idx];
            }
          }
          // Black 2 motion blur: ghost holds the last position.
          if (ghost) {
            ghost.visible = true;
            ghost.x = figure.x; ghost.y = figure.y;
            ghost.alpha = black2MotionBlurAlpha(exitKindRef.current !== 'none');
          }
          // V2 entrance + rest (locked per-card styles): fade in
          // at centre for frames 0-59, ease-out to the locked rest
          // offset over frames 60-119, then stay at rest. Mythar's
          // rest is 0, so it fades in at centre and stays centre,
          // never grounding (orbit -18 below still applies).
          // Unset figures keep the old endless walk, unchanged.
          if (v2Style) {
            if (frameInt < 60) {
              figure.alpha = frameInt / 60;
              figure.x = W / 2 + Math.sin(t * 2) * 3;
            } else if (frameInt < 120) {
              figure.alpha = 1;
              figure.x = W / 2 + v2RestOffset * easeOutCubic((frameInt - 60) / 60) + Math.sin(t * 2) * 3;
            } else {
              figure.alpha = 1;
              figure.x = W / 2 + v2RestOffset + Math.sin(t * 2) * 3;
            }
          } else {
            x += 42 * dt / 60;
            if (x > W + 80) x = -80;
            figure.x = x + Math.sin(t * 2) * 3;
          }
          figure.y = groundY + 6 + Math.sin(t * 8) * 4;
          // Per-creature action (FireRed scene 3 order: idle -> hop
          // -> effect burst -> recoil -> idle, 360-frame cycle).
          // Bob creatures sway instead of bouncing; orbit creatures
          // (Mythar) hover above the ground instead of standing on
          // it, per their manifest. Burst fires once per cycle.
          const act = figureName ? CREATURE_ACTIONS[figureName] : undefined;
          if (act) {
            const af = creatureActionFrame(frameInt);
            if (act.action === 'bob') figure.y += Math.sin(t * 2) * 6;
            if (act.action === 'orbit') figure.y -= 18;
            figure.y -= af.hopY;
            figure.x += af.recoilX;
            figure.scale.set(figureBaseScale * af.scaleMul);
            if (af.burst && lastBurstCycle !== Math.floor(frameInt / 360)) {
              lastBurstCycle = Math.floor(frameInt / 360);
              spawnCreatureBurst(act.burst, figure.x, figure.y, act.color);
            }
          }
          // Ground shadow follows the figure (rest position for
          // v2 styled figures, walk x for unset figures) but stays
          // on the ground: it never bobs, hops or orbits with the
          // figure.
          // When the figure lifts (orbit, hop, bob peak) the shadow
          // shrinks and fades slightly, like a shadow under a
          // rising creature — never below 75% size.
          if (shadow) {
            shadow.x = figure.x;
            shadow.y = groundY + 12;
            const elev = (groundY + 6) - figure.y;
            const shScale = Math.max(0.75, Math.min(1, 1 - elev / 200));
            shadow.scale.set(shScale);
            shadow.alpha = 0.32 * shScale;
          }
          if (fireTrail) {
            emberTimer -= dt / 60;
            if (emberTimer <= 0) { spawnEmber(figure.x - 24, groundY - 8); emberTimer = 0.08; }
            scorchTimer -= dt / 60;
            if (scorchTimer <= 0) { spawnScorch(figure.x - 20); scorchTimer = 0.25; }
          }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.life += dt / 60;
          if (p.life >= p.max) { scene.removeChild(p.g); p.g.destroy(); particles.splice(i, 1); continue; }
          const k = 1 - p.life / p.max;
          if (p.kind === 'ember') { p.g.x += (p.vx + Math.sin(t * 6 + p.sway) * 8) * dt / 60; p.g.y += p.vy * dt / 60; p.g.alpha = k; }
          else if (p.kind === 'bubble' || p.kind === 'smoke') { p.g.x += Math.sin(t * 4 + p.sway) * 6 * dt / 60; p.g.y += p.vy * dt / 60; p.g.alpha = k * 0.8; if (p.kind === 'smoke') p.g.scale.set(1 + p.life); }
          else if (p.kind === 'leaves') { p.g.x += (p.vx + Math.sin(t * 4 + p.sway) * 10) * dt / 60; p.g.y += (p.vy + 8) * dt / 60; p.g.alpha = k; p.g.rotation = Math.sin(t * 3 + p.sway) * 0.5; }
          else if (p.kind === 'spark' || p.kind === 'fire' || p.kind === 'sandburst') { p.g.x += p.vx * dt / 60; p.g.y += p.vy * dt / 60; p.g.alpha = k; }
          else if (p.kind === 'sparkle') { p.g.alpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 6 + p.sway)); }
          else if (p.kind === 'shield') { p.g.scale.set(1 + p.life * 1.2); p.g.alpha = k; }
          else if (p.kind === 'splash') { p.g.scale.set(1 + p.life * 2); p.g.alpha = 0.5 * k; }
          else p.g.alpha = 0.35 * k;
        }
        // Card effect layer updates.
        for (const tw of twinkles) {
          tw.g.alpha = 0.25 + 0.75 * Math.abs(Math.sin(t * 1.5 + tw.phase));
          if (cardEffect.kind === 'fireflies' || cardEffect.kind === 'pollen') {
            tw.g.y -= 6 * dt / 60;
            if (tw.g.y < 10) { tw.g.y = H - 40; tw.g.x = Math.random() * W; }
          }
        }
        for (const r of ripples) {
          r.r += 18 * dt / 60;
          if (r.r > 48) r.r = 8;
          r.g.clear();
          r.g.circle(0, 0, r.r).stroke({ color: cardEffect.color, width: 2 });
          r.g.alpha = 1 - r.r / 48;
        }
        if (scanLine) {
          scanLine.x = ((frameInt % 360) / 360) * (W + 10) - 5;
        }
        if (cardEffect.kind === 'lightning') {
          const lc = frameInt % 420;
          lightning.alpha = lc < 6 ? 0.7 : Math.max(0, lightning.alpha - 0.15 * dt);
          splashTimer -= dt / 60;
          if (splashTimer <= 0) {
            splashTimer = 0.25;
            const g = new Graphics();
            g.ellipse(0, 0, 6, 2).fill({ color: 0xbfdbfe, alpha: 0.5 });
            g.x = Math.random() * W; g.y = groundY + 8; scene.addChild(g);
            particles.push({ g, vx: 0, vy: 0, life: 0, max: 0.4, kind: 'splash', sway: 0 });
          }
        }
        // FireRed spawners (frame-counted, not wall-clock).
        if (frMode === 'flame') {
          flameTimer += dt;
          if (flameTimer >= FIRE_RED_FLAME_SPAWN_DELAY) { flameTimer = 0; spawnFlameBurst(); }
        } else if (frMode === 'leaf') {
          leafTimer += dt;
          if (leafTimer >= leafDelay) { leafTimer = 0; leafDelay = FIRE_RED_LEAF_DELAY_BASE + Math.floor(Math.random() * FIRE_RED_LEAF_DELAY_RANGE); spawnLeaf(); }
        }
        for (let i = frParticles.length - 1; i >= 0; i--) {
          const fp = frParticles[i];
          if (!fireRedParticleStep(fp.p)) { scene.removeChild(fp.g); fp.g.destroy(); frParticles.splice(i, 1); continue; }
          fp.g.x = (fp.p.posX / 16) * scaleX;
          fp.g.y = (fp.p.posY / 16) * scaleY;
        }
        for (const st of streaks) {
          const next = fireRedStreakStep(st.x, st.yIndex);
          st.x = next.x; st.yIndex = next.yIndex;
          st.g.x = st.x * scaleX;
          st.g.y = FIRE_RED_STREAK_Y_POSITIONS[st.yIndex] * scaleY;
        }
        // Ruby shine: step the active band; Phase 1 counter counts
        // down from 256 and re-fires (flash) at exactly 160 and 64.
        if (shine) {
          shine = rubyShineStep(shine);
          if (!shine.alive) { shine = null; shineBand.visible = false; shineBg.alpha = 0; }
          else {
            shineBand.visible = true;
            shineBand.x = shine.x * scaleX;
            shineBg.alpha = shine.flashBackground ? (shine.brightness / 31) * 0.4 : 0;
          }
        }
        // Phase 1 counter is an integer counting down from 256,
        // one per frame — re-fire when it reads exactly 160 or 64.
        {
          const counterNow = RUBY_PHASE1_COUNTER_START - frameInt;
          if (counterNow > 0 && counterNow !== lastPhaseCounter) {
            lastPhaseCounter = counterNow;
            if (rubyPhase1Refires(counterNow)) shine = rubyShineStart(true);
          }
        }
        // Platinum exit driver (prop-triggered; see prop comment).
        {
          const kind = exitKindRef.current;
          if (kind !== lastExitKind) { lastExitKind = kind; exitPhase = 'delay'; exitFrame = 0; }
          if (kind !== 'none' && exitPhase !== 'done') {
            exitFrame += dt;
            if (exitPhase === 'delay' && exitFrame >= PLATINUM_EXIT_FADE_DELAY) { exitPhase = 'out'; exitFrame = 0; }
            else if (exitPhase === 'out' && exitFrame >= PLATINUM_EXIT_FADE_FRAMES) {
              if (kind === 'clearSave') { exitPhase = 'done'; }
              else { exitPhase = 'in'; exitFrame = 0; }
            } else if (exitPhase === 'in' && exitFrame >= PLATINUM_EXIT_FADE_FRAMES) { exitPhase = 'done'; }
            const ov = platinumExitOverlay(kind, exitPhase === 'done' ? 'in' : exitPhase, Math.floor(exitFrame));
            if (exitPhase === 'done') { exitWhite.alpha = 0; exitBlack.alpha = kind === 'clearSave' ? 1 : 0; }
            else if (ov.color === 0xffffff) { exitWhite.alpha = ov.alpha; exitBlack.alpha = 0; }
            else { exitBlack.alpha = ov.alpha; exitWhite.alpha = 0; }
          }
        }
        for (const w of weather) {
          w.g.y += w.speed * dt / 60;
          w.g.x += Math.sin(t * 2 + w.phase) * 0.4;
          if (w.g.y > H) { w.g.y = -4; w.g.x = Math.random() * W; }
        }
      });
    });
    return () => { cancelled = true; app.destroy(true); };
  }, [biome, figureUrl, figureCycleUrls, figureCycleMs, figureName, fireTrail]);

  return (
    <div className="w-full">
      <div ref={hostRef} className="w-full h-[180px] relative overflow-hidden rounded" />
      {startPrompt && (
        <div className="text-center text-xs font-bold tracking-widest" style={{ visibility: startVisible ? 'visible' : 'hidden' }}>
          PRESS ANY KEY
        </div>
      )}
      <div className="text-center text-[10px] text-gray-500 mt-1">
        {caption || `${bLabel(biome)} — ${TITLE_BIOMES[biome].backgroundImage ? 'Painted background + Pixi' : 'Pixi'} scene: drifting background, foreground frame, weather, card effect (${TITLE_CARD_EFFECTS[biome].kind}), figure${figureName ? ` + ${figureName} action (${CREATURE_ACTIONS[figureName]?.action ?? 'walk'})` : ''}, fire trail (where wired) + title systems: FireRed spawner, HeartGold flash, Ruby shine, Black 2 camera/blur, Platinum fades.`}
        {figureUrl ? '' : ' Figure: GAP — no figure shipped for this biome screen yet.'}
      </div>
    </div>
  );
}

function bLabel(id: TitleBiomeId): string {
  return TITLE_BIOMES[id].label;
}
