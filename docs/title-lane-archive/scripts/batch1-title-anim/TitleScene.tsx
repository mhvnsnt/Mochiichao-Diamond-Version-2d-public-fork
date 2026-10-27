import React, { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TITLE_BIOMES, type TitleBiomeId } from '../../lib/titleBiomes';
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

/**
 * TitleScene — the shared title/start scene system (Mars, 2026-10-25).
 * Layers, traced from Pokemon title screens, Mochiichao content:
 *   1. sky background (two-tone gradient band, Pixi-drawn)
 *   2. ground band + ground line
 *   3. optional figure sprite (Yogiferno clean cutout only, shipped
 *      in this PR — NO Pokemon creature art, NO placeholder figure)
 *   4. weather / particle layer: snow, rain, leaves, dust, shimmer
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
 * no audio is shipped). The other 9/10 title creatures stay GAP:
 * no creature art is invented for them here.
 */
export default function TitleScene({
  biome = 'snow',
  figureUrl,
  figureAlt = 'Title figure',
  fireTrail = false,
  caption,
  startPrompt = false,
  exitKind = 'none',
}: {
  biome?: TitleBiomeId;
  figureUrl?: string;
  figureAlt?: string;
  fireTrail?: boolean;
  caption?: string;
  /** HeartGold start flash prompt (0 show / 30 hide / 45 cycle).
   *  Default false: IntroSequence keeps its own press-blink wiring
   *  (PR #28) untouched; set true only where TitleScene itself
   *  should own the prompt. */
  startPrompt?: boolean;
  /** Platinum exit driver: 'normal' (white out/in) or 'clearSave'
   *  (black out). 'none' (default) leaves the scene running.
   *  IntroSequence does NOT set this yet — that hookup is a later
   *  batch, so no exit is claimed as input-triggered here. */
  exitKind?: PlatinumExitKind;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [startVisible, setStartVisible] = useState(true);
  const exitKindRef = useRef<PlatinumExitKind>(exitKind);
  useEffect(() => { exitKindRef.current = exitKind; }, [exitKind]);
  const startPromptRef = useRef<boolean>(startPrompt);
  useEffect(() => { startPromptRef.current = startPrompt; }, [startPrompt]);

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

      // Layer 1+2: sky + ground, Pixi-drawn, biome palette only.
      const sky = new Graphics();
      sky.rect(0, 0, W, groundY).fill(b.sky);
      sky.rect(0, 0, W, Math.floor(groundY / 2)).fill(b.sky2);
      scene.addChild(sky);
      const ground = new Graphics();
      ground.rect(0, groundY, W, H - groundY).fill(b.ground);
      ground.rect(0, groundY, W, 2).fill(b.groundLine);
      scene.addChild(ground);
      if (b.tufts) {
        const tufts = new Graphics();
        for (let x = 8; x < W; x += 34) {
          tufts.moveTo(x, groundY + 22).lineTo(x + 3, groundY + 8).lineTo(x + 6, groundY + 22).fill(b.groundLine);
        }
        scene.addChild(tufts);
      }
      if (b.shimmer) {
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

      // Layer 3: figure sprite, if supplied. Scaled to ~150px tall
      // inside the 180px host, anchored at the feet.
      let figure: Sprite | null = null;
      let figureTex: Texture | null = null;
      if (figureUrl) {
        try {
          const tex: Texture = await Assets.load(figureUrl);
          figureTex = tex;
          figure = new Sprite(tex);
          const targetH = 150;
          const scale = targetH / tex.height;
          figure.scale.set(scale);
          figure.anchor.set(0.5, 1);
          figure.x = W / 2; figure.y = groundY + 6;
          scene.addChild(figure);
        } catch {
          figure = null; // figure missing: scene still renders, caption labels the gap
        }
      }

      // Layer 4+5: weather + fire trail particles.
      interface P { g: Graphics; vx: number; vy: number; life: number; max: number; kind: 'ember' | 'scorch' | 'flake' | 'rain' | 'leaf' | 'dust'; sway: number; }
      const particles: P[] = [];
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
          else if (b.weather === 'leaves') g.ellipse(0, 0, 4, 2).fill(0x4ade80);
          else if (b.weather === 'dust') g.circle(0, 0, 2).fill(0xfde68a);
          else g.circle(0, 0, 1.5 + Math.random() * 2).fill(0xffffff);
          g.x = Math.random() * W; g.y = Math.random() * H;
          scene.addChild(g);
          weather.push({ g, speed: b.weather === 'rain' ? 90 + Math.random() * 60 : 12 + Math.random() * 20, phase: Math.random() * Math.PI * 2 });
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
        for (const c of clouds) { c.x += 6 * dt / 60; if (c.x > W + 50) c.x = -50; }
        if (figure) {
          // Black 2 motion blur: ghost holds the last position.
          if (ghost) {
            ghost.visible = true;
            ghost.x = figure.x; ghost.y = figure.y;
            ghost.alpha = black2MotionBlurAlpha(exitKindRef.current !== 'none');
          }
          x += 42 * dt / 60;
          if (x > W + 80) x = -80;
          figure.x = x + Math.sin(t * 2) * 3;
          figure.y = groundY + 6 + Math.sin(t * 8) * 4;
          if (fireTrail) {
            emberTimer -= dt / 60;
            if (emberTimer <= 0) { spawnEmber(x - 24, groundY - 8); emberTimer = 0.08; }
            scorchTimer -= dt / 60;
            if (scorchTimer <= 0) { spawnScorch(x - 20); scorchTimer = 0.25; }
          }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.life += dt / 60;
          if (p.life >= p.max) { scene.removeChild(p.g); p.g.destroy(); particles.splice(i, 1); continue; }
          const k = 1 - p.life / p.max;
          if (p.kind === 'ember') { p.g.x += (p.vx + Math.sin(t * 6 + p.sway) * 8) * dt / 60; p.g.y += p.vy * dt / 60; p.g.alpha = k; }
          else p.g.alpha = 0.35 * k;
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
  }, [biome, figureUrl, fireTrail]);

  return (
    <div className="w-full">
      <div ref={hostRef} className="w-full h-[180px] relative overflow-hidden rounded" />
      {startPrompt && (
        <div className="text-center text-xs font-bold tracking-widest" style={{ visibility: startVisible ? 'visible' : 'hidden' }}>
          PRESS ANY KEY
        </div>
      )}
      <div className="text-center text-[10px] text-gray-500 mt-1">
        {caption || `${bLabel(biome)} — Pixi scene: sky, ground, weather, figure, fire trail (where wired) + title systems: FireRed spawner, HeartGold flash, Ruby shine, Black 2 camera/blur, Platinum fades.`}
        {figureUrl ? '' : ' Figure: GAP — no figure shipped for this biome screen yet.'}
      </div>
    </div>
  );
}

function bLabel(id: TitleBiomeId): string {
  return TITLE_BIOMES[id].label;
}
