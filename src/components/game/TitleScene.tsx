import React, { useEffect, useRef } from 'react';
import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TITLE_BIOMES, type TitleBiomeId } from '../../lib/titleBiomes';

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
 */
export default function TitleScene({
  biome = 'snow',
  figureUrl,
  figureAlt = 'Title figure',
  fireTrail = false,
  caption,
}: {
  biome?: TitleBiomeId;
  figureUrl?: string;
  figureAlt?: string;
  fireTrail?: boolean;
  caption?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

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

      // Layer 1+2: sky + ground, Pixi-drawn, biome palette only.
      const sky = new Graphics();
      sky.rect(0, 0, W, groundY).fill(b.sky);
      sky.rect(0, 0, W, Math.floor(groundY / 2)).fill(b.sky2);
      app.stage.addChild(sky);
      const ground = new Graphics();
      ground.rect(0, groundY, W, H - groundY).fill(b.ground);
      ground.rect(0, groundY, W, 2).fill(b.groundLine);
      app.stage.addChild(ground);
      if (b.tufts) {
        const tufts = new Graphics();
        for (let x = 8; x < W; x += 34) {
          tufts.moveTo(x, groundY + 22).lineTo(x + 3, groundY + 8).lineTo(x + 6, groundY + 22).fill(b.groundLine);
        }
        app.stage.addChild(tufts);
      }
      if (b.shimmer) {
        const shim = new Graphics();
        for (let x = 0; x < W; x += 44) shim.rect(x, groundY + 14, 22, 2).fill(0xffffff);
        shim.alpha = 0.5;
        app.stage.addChild(shim);
      }
      // Clouds: three soft ellipses drifting in the ticker below.
      const clouds: Graphics[] = [];
      for (let i = 0; i < 3; i++) {
        const c = new Graphics();
        c.ellipse(0, 0, 42, 12).fill({ color: 0xffffff, alpha: 0.35 });
        c.x = (W / 3) * i + 20; c.y = 22 + i * 18;
        app.stage.addChild(c); clouds.push(c);
      }

      // Layer 3: figure sprite, if supplied. Scaled to ~150px tall
      // inside the 180px host, anchored at the feet.
      let figure: Sprite | null = null;
      if (figureUrl) {
        try {
          const tex: Texture = await Assets.load(figureUrl);
          figure = new Sprite(tex);
          const targetH = 150;
          const scale = targetH / tex.height;
          figure.scale.set(scale);
          figure.anchor.set(0.5, 1);
          figure.x = W / 2; figure.y = groundY + 6;
          app.stage.addChild(figure);
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
        g.x = x; g.y = y; app.stage.addChild(g);
        particles.push({ g, vx: (Math.random() - 0.5) * 12, vy: -18 - Math.random() * 22, life: 0, max: 1.1 + Math.random() * 0.5, kind: 'ember', sway: Math.random() * Math.PI * 2 });
      };
      const spawnScorch = (x: number) => {
        const g = new Graphics();
        g.ellipse(0, 0, 16, 5).fill({ color: 0xea580c, alpha: 0.35 });
        g.x = x; g.y = groundY + 8; app.stage.addChild(g);
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
          app.stage.addChild(g);
          weather.push({ g, speed: b.weather === 'rain' ? 90 + Math.random() * 60 : 12 + Math.random() * 20, phase: Math.random() * Math.PI * 2 });
        }
      }

      if (reduced) return;
      let x = -80; let t = 0; let emberTimer = 0; let scorchTimer = 0;
      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        t += dt / 60;
        for (const c of clouds) { c.x += 6 * dt / 60; if (c.x > W + 50) c.x = -50; }
        if (figure) {
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
          if (p.life >= p.max) { app.stage.removeChild(p.g); p.g.destroy(); particles.splice(i, 1); continue; }
          const k = 1 - p.life / p.max;
          if (p.kind === 'ember') { p.g.x += (p.vx + Math.sin(t * 6 + p.sway) * 8) * dt / 60; p.g.y += p.vy * dt / 60; p.g.alpha = k; }
          else p.g.alpha = 0.35 * k;
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
      <div className="text-center text-[10px] text-gray-500 mt-1">
        {caption || `${bLabel(biome)} — Pixi scene: sky, ground, weather, figure, fire trail (where wired).`}
        {figureUrl ? '' : ' Figure: GAP — no figure shipped for this biome screen yet.'}
      </div>
    </div>
  );
}

function bLabel(id: TitleBiomeId): string {
  return TITLE_BIOMES[id].label;
}
