import React, { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { getSheetDef, fallbackColorFor, battleSpriteUrl } from '../../lib/spriteSheets';
import { sheetCellTexture, fullImageTexture } from './pixiSheet';

/**
 * PixiJS battle arena, simplified Arena spec (mod layer on the existing
 * turn-based logic — damage/balance are NOT redesigned here).
 *
 * Timeline per attack, driven by the `attack` prop (nonce increments):
 * cue is shown by the parent React UI (move banner) -> windup (scale pulse)
 * -> approach: PHYSICAL attacker lunges to the target with BOTH creatures
 *   on screen at impact (PBR-1); SPECIAL attacker stays and a coloured
 *   projectile travels to the target -> impact: onImpact() fires exactly
 *   once (parent drains HP at that frame), target flashes white, recoils,
 *   stage shakes -> return to base -> onDone().
 * HP bars and names live in the React layer above this canvas and never
 * move with the camera/shake.
 */
export interface BattleAttack {
  nonce: number;
  attacker: 'player' | 'enemy';
  category: 'Physical' | 'Special' | 'Status';
  color: string;
}

function hex(color: string): number {
  const n = parseInt(color.replace('#', ''), 16);
  return Number.isFinite(n) ? n : 0xffffff;
}

function fallbackSprite(g: Graphics, cx: number, cy: number, size: number, colorHex: number) {
  const r = size / 2;
  g.ellipse(cx, cy + r * 0.42, r * 0.95, r * 0.18).fill({ color: 0x000000, alpha: 0.35 });
  g.ellipse(cx, cy - r * 0.2, r * 0.95, r * 0.8).fill(colorHex);
  g.circle(cx - r * 0.55, cy - r * 0.75, r * 0.3).fill(colorHex);
  g.circle(cx + r * 0.55, cy - r * 0.75, r * 0.3).fill(colorHex);
  g.circle(cx - r * 0.3, cy - r * 0.3, r * 0.14).fill(0xffffff);
  g.circle(cx + r * 0.3, cy - r * 0.3, r * 0.14).fill(0xffffff);
  g.circle(cx - r * 0.3, cy - r * 0.3, r * 0.07).fill(0x111111);
  g.circle(cx + r * 0.3, cy - r * 0.3, r * 0.07).fill(0x111111);
}

export default function PixiBattleCanvas({
  playerSpeciesId, enemySpeciesId, attack, onImpact, onDone,
}: {
  playerSpeciesId: string | undefined | null;
  enemySpeciesId: string | undefined | null;
  attack: BattleAttack | null;
  onImpact: () => void;
  onDone: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const stateRef = useRef<{ player: Container; enemy: Container; arena: Container } | null>(null);
  const spritesRef = useRef<Map<string, Sprite>>(new Map());
  const attackRef = useRef(attack);
  const callbacksRef = useRef({ onImpact, onDone });
  callbacksRef.current = { onImpact, onDone };
  attackRef.current = attack;

  const drawBase = () => {
    const app = appRef.current;
    const st = stateRef.current;
    if (!app || !st) return;
    const vw = app.screen.width;
    const vh = app.screen.height;
    const arena = st.arena;
    arena.removeChildren();
    const g = new Graphics();
    arena.addChild(g);
    // Arena floor: layered bands, drawn — no emoji, no image asset.
    g.rect(0, vh * 0.55, vw, vh * 0.45).fill(0x1a2a1a);
    g.ellipse(vw * 0.78, vh * 0.42, vw * 0.22, vh * 0.06).fill({ color: 0x000000, alpha: 0.35 });
    g.ellipse(vw * 0.22, vh * 0.78, vw * 0.24, vh * 0.07).fill({ color: 0x000000, alpha: 0.35 });

    const place = (side: 'player' | 'enemy') => {
      const isPlayer = side === 'player';
      const speciesId = isPlayer ? playerSpeciesId : enemySpeciesId;
      const def = getSheetDef(speciesId);
      const size = Math.min(vw, vh) * (isPlayer ? 0.42 : 0.36);
      const cx = isPlayer ? vw * 0.22 : vw * 0.78;
      const cy = isPlayer ? vh * 0.78 : vh * 0.42;
      const cont = isPlayer ? st.player : st.enemy;
      cont.removeChildren();
      cont.position.set(cx, cy);
      if (def) {
        // Battle-only three-quarter overrides first (147 player, 148 opponent),
        // facing each other. Any other species/side falls back to the
        // 192x64 sheet cell (player back, opponent front) — never a front
        // cut for both sides, and no mock creatures anywhere.
        const battleUrl = battleSpriteUrl(speciesId, isPlayer);
        if (battleUrl) {
          const key = `${side}-${def.speciesId}-battle`;
          let sp = spritesRef.current.get(key);
          if (!sp) {
            sp = new Sprite();
            spritesRef.current.set(key, sp);
            fullImageTexture(battleUrl).then(tex => {
              sp!.texture = tex;
              // Preserve the cut's own aspect ratio (Dorowani 455x585
              // portrait, Gabu 532x497); width stays `size`, height scales.
              sp!.width = size;
              sp!.height = tex.width > 0 ? size * (tex.height / tex.width) : size;
            }).catch(() => {});
          }
          sp.anchor.set(0.5, 1);
          // If the cut already loaded (redraw/resize), keep its aspect now;
          // otherwise the load callback above corrects it once it arrives.
          const tw = sp.texture?.width ?? 0;
          const th = sp.texture?.height ?? 0;
          sp.width = size;
          sp.height = tw > 1 ? size * (th / tw) : size;
          cont.addChild(sp);
        } else {
          const view = isPlayer ? 'back' : 'front';
          const key = `${side}-${def.speciesId}-${view}`;
          let sp = spritesRef.current.get(key);
          if (!sp) {
            sp = new Sprite();
            spritesRef.current.set(key, sp);
            sheetCellTexture(def.sheetUrl, def.frames[view]).then(tex => { sp!.texture = tex; }).catch(() => {});
          }
          sp.anchor.set(0.5, 1);
          sp.width = size; sp.height = size;
          cont.addChild(sp);
        }
      } else {
        const fg = new Graphics();
        fallbackSprite(fg, 0, 0, size, hex(fallbackColorFor(speciesId)));
        cont.addChild(fg);
      }
    };
    place('player');
    place('enemy');
  };

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current!;
    const app = new Application();
    app.init({ resizeTo: host, background: '#0b1526', antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(() => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      app.canvas.style.display = 'block';
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';
      const arena = new Container();
      const player = new Container();
      const enemy = new Container();
      app.stage.addChild(arena, player, enemy);
      stateRef.current = { player, enemy, arena };
      appRef.current = app;
      drawBase();
    });
    const onResize = () => drawBase();
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      spritesRef.current.forEach(s => s.destroy());
      spritesRef.current.clear();
      app.destroy(true);
      appRef.current = null;
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { drawBase(); }, [playerSpeciesId, enemySpeciesId]);

  // Attack timeline driver.
  useEffect(() => {
    if (!attack || attack.nonce === 0) return;
    const app = appRef.current;
    const st = stateRef.current;
    if (!app || !st) return;
    const attacker = attack.attacker === 'player' ? st.player : st.enemy;
    const target = attack.attacker === 'player' ? st.enemy : st.player;
    const baseA = { x: attacker.position.x, y: attacker.position.y };
    const baseT = { x: target.position.x, y: target.position.y };
    const vw = app.screen.width;
    const vh = app.screen.height;
    let raf = 0;
    let impactFired = false;
    const start = performance.now();
    const color = hex(attack.color);

    const flash = () => {
      const f = new Graphics();
      f.circle(0, -vh * 0.12, Math.min(vw, vh) * 0.16).fill({ color: 0xffffff, alpha: 0.85 });
      target.addChild(f);
      const t0 = performance.now();
      const fade = () => {
        const p = (performance.now() - t0) / 220;
        if (p >= 1) { target.removeChild(f); f.destroy(); return; }
        f.alpha = 1 - p;
        raf = requestAnimationFrame(fade);
      };
      raf = requestAnimationFrame(fade);
    };

    const shake = () => {
      const stage = app.stage;
      const t0 = performance.now();
      const tick = () => {
        const p = (performance.now() - t0) / 220;
        if (p >= 1) { stage.position.set(0, 0); return; }
        const amp = (1 - p) * 6;
        stage.position.set((Math.random() - 0.5) * 2 * amp, (Math.random() - 0.5) * 2 * amp);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const step = () => {
      const t = performance.now() - start;
      if (attack.category === 'Status') {
        // No approach: glow on target, impact at 500ms, done at 900ms.
        const pulse = 1 + 0.08 * Math.sin((t / 500) * Math.PI);
        target.scale.set(pulse, pulse);
        if (t >= 500 && !impactFired) { impactFired = true; callbacksRef.current.onImpact(); flash(); }
        if (t >= 900) { target.scale.set(1, 1); callbacksRef.current.onDone(); return; }
        raf = requestAnimationFrame(step);
        return;
      }
      if (attack.category === 'Special') {
        // Projectile travels attacker -> target over 450ms after a 300ms windup.
        if (t < 300) {
          const pulse = 1 + 0.06 * Math.sin((t / 300) * Math.PI);
          attacker.scale.set(pulse, pulse);
          raf = requestAnimationFrame(step);
          return;
        }
        const p = Math.min(1, (t - 300) / 450);
        const proj = st.arena.children.find(c => (c as any).__proj) as Graphics | undefined;
        let dot = proj;
        if (!dot) {
          dot = new Graphics();
          (dot as any).__proj = true;
          dot.circle(0, 0, 12).fill(color);
          st.arena.addChild(dot);
        }
        dot.position.set(baseA.x + (baseT.x - baseA.x) * p, baseA.y - 40 + (baseT.y - 40 - (baseA.y - 40)) * p);
        if (p >= 1 && !impactFired) {
          impactFired = true;
          st.arena.removeChild(dot); dot.destroy();
          callbacksRef.current.onImpact(); flash(); shake();
          target.position.x = baseT.x + (attack.attacker === 'player' ? 14 : -14);
          setTimeout(() => { target.position.set(baseT.x, baseT.y); }, 180);
          setTimeout(() => callbacksRef.current.onDone(), 500);
          return;
        }
        raf = requestAnimationFrame(step);
        return;
      }
      // Physical: windup 0-350ms, lunge 350-800ms, impact at 800ms, return by 1250ms.
      if (t < 350) {
        const pulse = 1 + 0.06 * Math.sin((t / 350) * Math.PI);
        attacker.scale.set(pulse, pulse);
        raf = requestAnimationFrame(step);
        return;
      }
      if (t < 800) {
        const p = (t - 350) / 450;
        const ease = 1 - Math.pow(1 - p, 2);
        const gap = attack.attacker === 'player' ? 70 : -70;
        attacker.position.set(baseA.x + (baseT.x + gap - baseA.x) * ease, baseA.y + (baseT.y - baseA.y) * ease);
        raf = requestAnimationFrame(step);
        return;
      }
      if (!impactFired) {
        impactFired = true;
        callbacksRef.current.onImpact(); flash(); shake();
        target.position.x = baseT.x + (attack.attacker === 'player' ? 14 : -14);
      }
      if (t < 1250) {
        const p = (t - 800) / 450;
        const ease = p * p;
        attacker.position.set(
          (baseT.x + (attack.attacker === 'player' ? 70 : -70)) + (baseA.x - (baseT.x + (attack.attacker === 'player' ? 70 : -70))) * ease,
          baseA.y,
        );
        if (t >= 980) target.position.set(baseT.x, baseT.y);
        raf = requestAnimationFrame(step);
        return;
      }
      attacker.position.set(baseA.x, baseA.y);
      attacker.scale.set(1, 1);
      target.position.set(baseT.x, baseT.y);
      callbacksRef.current.onDone();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attack?.nonce]);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" />;
}
