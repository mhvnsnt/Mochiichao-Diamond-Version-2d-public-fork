import React, { useEffect, useRef } from 'react';
import { Application, Container, Graphics } from 'pixi.js';

/**
 * Yogiferno title walk — DIRECTION SPEC, not final art (Mars,
 * 2026-10-25 18:33-18:34 CDT): when Yogiferno is the rotating title
 * creature, he WALKS THROUGH the screen bringing fire with him —
 * fire trail spawning behind him (embers / flame wisps, fading
 * scorch glow), fire halo above his head, white fur + blue tribal
 * markings vs orange/red fire as the intentional contrast.
 * Snow variant: same walk on a snow background, fire trail on snow.
 *
 * Motion is REAL PixiJS v8 particles + sine sway (ticker, delta
 * time) — never a static Pillow trail image. The FIGURE itself is
 * a Pixi Graphics placeholder, labelled as such in the UI: the
 * local Yogiferno atlas (sprite-art/atlases/yogiferno/) has 18
 * 64x64 cells whose walk roles are all role_unconfirmed heuristic
 * guesses and are back-view only — there is no confirmed
 * side-walk strip to animate yet. Final sheet walk frames are
 * NEED (sprite-art lane), and this component must be re-pointed
 * at them when they are confirmed, not presented as sheet art.
 * Habitat canon (for later, NOT title code): Yogiferno appears
 * in desert (Fire/Ground), forest, rain, Safari-type, mountain,
 * and snow/ice regions — deeper/later regions; snow encounter
 * level/route NOT locked, not invented here.
 */
export default function YogifernoTitleWalk({ variant }: { variant: 'walk' | 'snow' }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const app = new Application();
    app.init({ resizeTo: host, backgroundAlpha: 0, antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(() => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      const W = app.screen.width;
      const H = app.screen.height;
      const groundY = H - 34;
      const snow = variant === 'snow';

      // Ground band.
      const ground = new Graphics();
      ground.rect(0, groundY, W, H - groundY).fill(snow ? 0xf8fafc : 0x0f172a);
      ground.rect(0, groundY, W, 2).fill(snow ? 0xbae6fd : 0x134e4a);
      app.stage.addChild(ground);

      // Yogiferno figure (placeholder shapes): white fur body +
      // head, blue tribal markings, fire halo above the head.
      const yogi = new Container();
      const body = new Graphics();
      body.ellipse(0, 0, 26, 34).fill(0xf8fafc);
      body.ellipse(-8, -12, 9, 5).fill(0x3b82f6);
      body.ellipse(8, 6, 9, 5).fill(0x3b82f6);
      body.ellipse(0, 18, 14, 4).fill(0x3b82f6);
      const head = new Graphics();
      head.circle(0, -42, 16).fill(0xf8fafc);
      head.circle(-6, -44, 2.5).fill(0x111111);
      head.circle(6, -44, 2.5).fill(0x111111);
      const halo = new Graphics();
      halo.circle(0, -66, 12).stroke({ color: 0xf97316, width: 4 });
      halo.circle(0, -66, 7).stroke({ color: 0xfacc15, width: 2 });
      const legL = new Graphics();
      legL.rect(-14, 28, 10, 18).fill(0xf8fafc);
      const legR = new Graphics();
      legR.rect(4, 28, 10, 18).fill(0xf8fafc);
      yogi.addChild(legL, legR, body, head, halo);
      app.stage.addChild(yogi);

      interface Particle { g: Graphics; vx: number; vy: number; life: number; max: number; kind: 'ember' | 'scorch' | 'flake'; sway: number; }
      const particles: Particle[] = [];
      const spawnEmber = (x: number, y: number) => {
        const g = new Graphics();
        const c = Math.random() < 0.5 ? 0xf97316 : 0xef4444;
        g.circle(0, 0, 2 + Math.random() * 3).fill(c);
        g.x = x; g.y = y;
        app.stage.addChild(g);
        particles.push({ g, vx: (Math.random() - 0.5) * 12, vy: -18 - Math.random() * 22, life: 0, max: 1.1 + Math.random() * 0.5, kind: 'ember', sway: Math.random() * Math.PI * 2 });
      };
      const spawnScorch = (x: number) => {
        const g = new Graphics();
        g.ellipse(0, 0, 16, 5).fill({ color: snow ? 0x9a3412 : 0xea580c, alpha: 0.35 });
        g.x = x; g.y = groundY + 8;
        app.stage.addChild(g);
        particles.push({ g, vx: 0, vy: 0, life: 0, max: 3, kind: 'scorch', sway: 0 });
      };
      const flakes: { g: Graphics; speed: number; phase: number }[] = [];
      if (snow) {
        for (let i = 0; i < 40; i++) {
          const g = new Graphics();
          g.circle(0, 0, 1.5 + Math.random() * 2).fill(0xffffff);
          g.x = Math.random() * W; g.y = Math.random() * H;
          app.stage.addChild(g);
          flakes.push({ g, speed: 12 + Math.random() * 20, phase: Math.random() * Math.PI * 2 });
        }
      }

      let x = -70;
      let t = 0;
      let emberTimer = 0;
      let scorchTimer = 0;
      const drawStatic = () => {
        yogi.x = W / 2; yogi.y = groundY - 46;
      };
      if (reduced) {
        drawStatic();
        return;
      }
      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        t += dt / 60;
        // Walk through, left to right, then re-enter: sine bob +
        // sway on top of the crossing (FireRed sine method shape:
        // offset = sine x amplitude on a base position).
        x += 42 * dt / 60;
        if (x > W + 80) x = -70;
        yogi.x = x + Math.sin(t * 2) * 3;
        yogi.y = groundY - 46 + Math.sin(t * 8) * 4;
        // Walk-cycle legs: alternate swing from the same sine.
        legL.y = Math.sin(t * 8) * 4;
        legR.y = -Math.sin(t * 8) * 4;
        // Fire halo flicker: layered sines, never a static ring.
        const flick = 1 + 0.12 * Math.sin(t * 10) + 0.06 * Math.sin(t * 23);
        halo.scale.set(flick);
        // Fire trail: embers behind the feet, scorch glow on the
        // ground behind, both fading — never a painted trail.
        emberTimer -= dt / 60;
        if (emberTimer <= 0) { spawnEmber(x - 24, groundY - 8); emberTimer = 0.08; }
        scorchTimer -= dt / 60;
        if (scorchTimer <= 0) { spawnScorch(x - 20); scorchTimer = 0.25; }
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += dt / 60;
          if (p.life >= p.max) { app.stage.removeChild(p.g); p.g.destroy(); particles.splice(i, 1); continue; }
          const k = 1 - p.life / p.max;
          if (p.kind === 'ember') {
            p.g.x += (p.vx + Math.sin(t * 6 + p.sway) * 8) * dt / 60;
            p.g.y += p.vy * dt / 60;
            p.g.alpha = k;
          } else {
            p.g.alpha = 0.35 * k;
          }
        }
        for (const f of flakes) {
          f.g.y += f.speed * dt / 60;
          f.g.x += Math.sin(t * 2 + f.phase) * 0.4;
          if (f.g.y > H) { f.g.y = -4; f.g.x = Math.random() * W; }
        }
      });
    });
    return () => {
      cancelled = true;
      app.destroy(true);
    };
  }, [variant]);

  return (
    <div className="w-full">
      <div ref={hostRef} className="w-full h-[180px] relative overflow-hidden rounded" />
      <div className="text-center text-[10px] text-gray-500 mt-1">
        Yogiferno walk — Pixi direction spec (particles + sine sway). Figure is a placeholder; final sheet walk frames pending (atlas walk roles unconfirmed, back-view only).
      </div>
    </div>
  );
}
