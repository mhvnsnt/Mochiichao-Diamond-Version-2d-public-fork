import React, { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TITLE_BIOMES } from '../../lib/titleBiomes';
import { FONT_OPTIONS, PINNED_SUBTITLE_FONT } from '../../lib/fonts';
import {
  cameraAt, keyframedValue, totalDuration,
  INTRO_VIDEO_CUTOUT_STATUS,
  type IntroVideoPreset, type IntroVideoScene,
} from '../../lib/introVideoCreator';
import {
  INTRO_PLAYBACK_PARTICLE_STYLE,
  resolveActiveIntroVideoPreset,
  sceneAt,
  transitionOverlay,
} from '../../lib/introVideoPlayback';
import yogifernoWalkCutout from '../../assets/title/yogiferno-walk-cutout.png';

/**
 * IntroVideoPlayer — Pixi playback of a saved intro preset.
 *
 * This is the playback half of the creator spec: the preset JSON
 * the creator screens save (PR #42) is played here, in Pixi, with
 * the TitleScene layer order (sky + ground, figure, particles,
 * camera container, screen-space transition overlays).
 *
 * - Preset: props.preset if given, else resolveActiveIntroVideoPreset()
 *   (most recently saved user preset, else the locked default — the
 *   locked default is never overwritten).
 * - Timeline: Pixi ticker advances seconds; sceneAt() picks the
 *   scene; cameraAt() (translated Pokemon title math: sine drift +
 *   camera keyframes + deterministic shake) drives the camera
 *   container pan/zoom/shake; keyframedValue() drives figure
 *   position / scale / opacity.
 * - Backgrounds: the 8 title biomes, Pixi-drawn from their palettes
 *   (same data as TitleScene). 'painted' has no art yet, so it
 *   renders a slate fallback + a GAP label — never fake art.
 * - Particles: the scene's spec particle (fire, snow, rain, leaves,
 *   embers, smoke), drawn as Pixi shapes in the particle layer.
 * - Transitions: fade-black / fade-white (screen overlay alpha),
 *   shutter-wipe (retracting bars), slide (scene container offset),
 *   each over the first 0.5 s of the incoming scene.
 * - Any key or click skips the whole intro (onDone), same as the
 *   Pokemon intro rule; reaching the total duration also calls
 *   onDone. The parent (IntroSequence) owns what happens next
 *   (TITLE) — this player never navigates itself.
 * - Creatures: ONLY Yogiferno's clean cutout is drawn. Every other
 *   rotation-pool creature in a scene gets a GAP label in the DOM
 *   overlay — no fake art is generated or shown.
 * - Music: NOT played. The music slot is a name only; the locked
 *   default ships it empty, and PR #36 title/intro tracks are
 *   drafts Mars has not approved as final, so no audio file is
 *   wired here. The overlay labels the slot GAP honestly.
 * - prefers-reduced-motion: timeline still advances (so the intro
 *   ends), but camera shake/drift and particle motion are off.
 */

function fontFamilyFor(id: string): string {
  return FONT_OPTIONS.find(f => f.id === id)?.family || 'Trebuchet MS';
}

export default function IntroVideoPlayer({
  preset: presetProp,
  onDone,
}: {
  preset?: IntroVideoPreset;
  onDone: () => void;
}) {
  const resolved = useRef(resolveActiveIntroVideoPreset()).current;
  const preset = presetProp || resolved.preset;
  const source = presetProp ? 'saved' : resolved.source;
  const hostRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = preset.scenes[Math.min(sceneIndex, preset.scenes.length - 1)];
  const total = totalDuration(preset);

  useEffect(() => {
    doneRef.current = false;
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDoneRef.current();
    };
    const keyHandler = () => finish();
    const mouseHandler = () => finish();
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('mousedown', mouseHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('mousedown', mouseHandler);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const app = new Application();
    let tex: Texture | null = null;
    let sceneContainer: Container | null = null;
    let figures: Sprite[] = [];
    let particles: { g: Graphics; speed: number; sway: number }[] = [];
    let fadeOverlay: Graphics | null = null;
    let shutterBars: Graphics[] = [];
    let currentSceneId = '';
    let buildSeq = 0;
    let yogiIndex = 0;
    let elapsed = 0;

    const clearScene = () => {
      if (!sceneContainer) return;
      for (const f of figures) { sceneContainer.removeChild(f); f.destroy(); }
      figures = [];
      for (const p of particles) { sceneContainer.removeChild(p.g); p.g.destroy(); }
      particles = [];
      sceneContainer.removeAllListeners();
      // Remove every child except none: rebuild from scratch below
      // by destroying the container itself and making a new one.
      app.stage.removeChild(sceneContainer);
      sceneContainer.destroy({ children: true });
      sceneContainer = null;
    };

    const buildScene = async (s: IntroVideoScene, seq: number) => {
      if (cancelled || !app.stage) return;
      const W = app.screen.width;
      const H = app.screen.height;
      const groundY = H - 34;
      const container = new Container();
      container.pivot.set(W / 2, H / 2);
      container.position.set(W / 2, H / 2);
      app.stage.addChildAt(container, 0);
      sceneContainer = container;
      const biome = s.background === 'painted' ? null : TITLE_BIOMES[s.background];
      const sky = new Graphics();
      sky.rect(0, 0, W, groundY).fill(biome ? biome.sky : 0x1e293b);
      sky.rect(0, 0, W, Math.floor(groundY / 2)).fill(biome ? biome.sky2 : 0x334155);
      container.addChild(sky);
      const ground = new Graphics();
      ground.rect(0, groundY, W, H - groundY).fill(biome ? biome.ground : 0x334155);
      ground.rect(0, groundY, W, 2).fill(biome ? biome.groundLine : 0x475569);
      container.addChild(ground);
      if (biome?.tufts) {
        const tufts = new Graphics();
        for (let x = 8; x < W; x += 34) {
          tufts.moveTo(x, groundY + 22).lineTo(x + 3, groundY + 8).lineTo(x + 6, groundY + 22).fill(biome.groundLine);
        }
        container.addChild(tufts);
      }
      if (biome?.shimmer) {
        const shim = new Graphics();
        for (let x = 0; x < W; x += 44) shim.rect(x, groundY + 14, 22, 2).fill(0xffffff);
        shim.alpha = 0.5;
        container.addChild(shim);
      }
      // Figures: Yogiferno cutout only; other creatures are GAP
      // labels in the DOM overlay, never drawn here.
      if (s.creatures.includes('Yogiferno')) {
        try {
          if (!tex) tex = await Assets.load(yogifernoWalkCutout);
          if (cancelled || seq !== buildSeq || sceneContainer !== container) return;
          yogiIndex = s.creatures.indexOf('Yogiferno');
          const fig = new Sprite(tex);
          const targetH = 150;
          fig.scale.set(targetH / tex.height);
          fig.anchor.set(0.5, 1);
          fig.x = W / 2;
          fig.y = groundY + 6;
          container.addChild(fig);
          figures.push(fig);
        } catch {
          // Cutout failed to load: scene still renders, DOM labels the gap.
        }
      }
      // Particles for this scene's spec particle id.
      const style = INTRO_PLAYBACK_PARTICLE_STYLE[s.particle];
      if (style && !reduced) {
        for (let i = 0; i < 24; i++) {
          const g = new Graphics();
          if (s.particle === 'rain') g.rect(0, 0, 1.5, 10).fill(style.color);
          else if (s.particle === 'leaves') g.ellipse(0, 0, 4, 2).fill(style.color);
          else g.circle(0, 0, style.size).fill(style.color);
          g.x = Math.random() * W;
          g.y = Math.random() * H;
          container.addChild(g);
          particles.push({ g, speed: style.fallSpeed, sway: Math.random() * Math.PI * 2 });
        }
      }
      currentSceneId = s.id;
    };

    app.init({ resizeTo: host, backgroundAlpha: 0, antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(async () => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      const W = app.screen.width;
      const H = app.screen.height;
      fadeOverlay = new Graphics();
      fadeOverlay.rect(0, 0, W, H).fill(0x000000);
      app.stage.addChild(fadeOverlay);
      const barCount = 8;
      for (let i = 0; i < barCount; i++) {
        const bar = new Graphics();
        bar.rect(0, 0, Math.ceil(W / barCount), H).fill(0x000000);
        bar.x = i * Math.ceil(W / barCount);
        bar.visible = false;
        app.stage.addChild(bar);
        shutterBars.push(bar);
      }
      buildSeq += 1;
      await buildScene(preset.scenes[0], buildSeq);
      if (cancelled) return;
      let lastNow = performance.now();
      app.ticker.add(() => {
        if (doneRef.current) return;
        const now = performance.now();
        const dt = Math.min(0.1, (now - lastNow) / 1000);
        lastNow = now;
        elapsed += dt;
        const pos = sceneAt(preset, elapsed);
        if (pos.done) {
          if (!doneRef.current) { doneRef.current = true; onDoneRef.current(); }
          return;
        }
        if (pos.scene.id !== currentSceneId) {
          // Set synchronously so the next ticker frame does not
          // re-trigger a rebuild while the texture loads.
          currentSceneId = pos.scene.id;
          clearScene();
          buildSeq += 1;
          void buildScene(pos.scene, buildSeq);
          setSceneIndex(pos.sceneIndex);
        }
        const W2 = app.screen.width;
        const H2 = app.screen.height;
        const cam = cameraAt(pos.scene, pos.localTime);
        if (sceneContainer) {
          const ov = transitionOverlay(pos.scene, pos.transitionProgress);
          const baseX = W2 / 2 + (reduced ? pos.scene.camera.panX : cam.x) * (W2 / 100) + ov.slideOffsetX * W2;
          const baseY = H2 / 2 + (reduced ? pos.scene.camera.panY : cam.y) * (H2 / 100);
          sceneContainer.position.set(baseX + (reduced ? 0 : cam.shakeX), baseY + (reduced ? 0 : cam.shakeY));
          sceneContainer.scale.set(reduced ? pos.scene.camera.zoom : cam.zoom);
          // Figure keyframes (position / scale / opacity).
          for (const fig of figures) {
            const idx = yogiIndex;
            const count = Math.max(1, pos.scene.creatures.length);
            const fallbackX = count === 1 ? 50 : (idx + 1) * (100 / (count + 1));
            const px = keyframedValue(pos.scene, 'position', 'x', pos.localTime, fallbackX);
            const py = keyframedValue(pos.scene, 'position', 'y', pos.localTime, 100);
            const sc = keyframedValue(pos.scene, 'scale', 'scale', pos.localTime, 1);
            const op = keyframedValue(pos.scene, 'opacity', 'opacity', pos.localTime, 1);
            const targetH = 150 * sc;
            fig.scale.set(targetH / (tex ? tex.height : 190));
            fig.x = (px / 100) * W2;
            fig.y = (py / 100) * H2;
            fig.alpha = op;
          }
          if (!reduced) {
            for (const p of particles) {
              p.g.y += p.speed * dt;
              p.g.x += Math.sin(elapsed * 2 + p.sway) * 0.4;
              if (p.speed >= 0 && p.g.y > H2) { p.g.y = -4; p.g.x = Math.random() * W2; }
              if (p.speed < 0 && p.g.y < -4) { p.g.y = H2 + 4; p.g.x = Math.random() * W2; }
            }
          }
          // Transition overlays (screen space, above the scene).
          const ov2 = transitionOverlay(pos.scene, pos.transitionProgress);
          if (fadeOverlay) {
            fadeOverlay.clear();
            fadeOverlay.rect(0, 0, W2, H2).fill(ov2.fadeColor);
            fadeOverlay.alpha = ov2.fadeAlpha;
          }
          shutterBars.forEach((bar, i) => {
            bar.visible = ov2.shutterCover > 0;
            bar.height = H2;
            bar.width = Math.ceil(W2 / shutterBars.length);
            bar.x = i * Math.ceil(W2 / shutterBars.length);
            bar.scale.y = ov2.shutterCover;
          });
        }
      });
    });
    return () => {
      cancelled = true;
      doneRef.current = true;
      app.destroy(true);
    };
  }, [preset]);

  if (!scene) return null;
  const gapCreatures = scene.creatures.filter(c => INTRO_VIDEO_CUTOUT_STATUS[c] !== 'ready');
  return (
    <div className="game-screen bg-black flex flex-col items-center justify-center relative overflow-hidden cursor-pointer selection:bg-none p-4">
      <div ref={hostRef} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl pointer-events-none">
        {scene.text.logo && (
          <div className="text-white text-4xl sm:text-5xl font-black tracking-widest drop-shadow-md text-center" style={{ fontFamily: fontFamilyFor(scene.text.logoFontId) }}>
            {scene.text.logo}
          </div>
        )}
        {scene.text.subtitle && (
          <div className="text-teal-300 text-xl font-bold tracking-[0.4em] drop-shadow-lg mt-3 text-center" style={{ fontFamily: PINNED_SUBTITLE_FONT }}>
            {scene.text.subtitle}
          </div>
        )}
        {scene.text.dialogue && (
          <div className="text-white text-sm mt-6 text-center max-w-md" style={{ fontFamily: fontFamilyFor(scene.text.dialogueFontId) }}>
            {scene.text.dialogue}
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 z-10 text-center pointer-events-none">
        <div className="text-gray-400 text-[10px] tracking-widest">
          INTRO — {preset.name} ({source === 'saved' ? 'saved preset' : 'locked default'}) · SCENE {sceneIndex + 1} / {preset.scenes.length} · {scene.name} · {scene.background} · {scene.particle} · ANY KEY SKIPS
        </div>
        {scene.background === 'painted' && (
          <div className="text-yellow-300 text-[10px] mt-1">Painted background: GAP — no painted art yet, slate fallback shown.</div>
        )}
        {gapCreatures.length > 0 && (
          <div className="text-yellow-300 text-[10px] mt-1">Creature cutout GAP (no fake art): {gapCreatures.join(', ')} — only Yogiferno has a clean cutout.</div>
        )}
        <div className="text-gray-500 text-[10px] mt-1">
          Music: GAP — {scene.music ? `slot name "${scene.music}" only, no audio file wired` : 'original music needed, slot empty'} · Total {total.toFixed(1)}s
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); if (!doneRef.current) { doneRef.current = true; onDone(); } }}
        className="game-button absolute top-4 right-4 z-20 px-4 py-2 text-sm font-bold min-h-[48px]"
      >
        SKIP ►
      </button>
    </div>
  );
}
