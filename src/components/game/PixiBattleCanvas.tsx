import React, { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { getSheetDef, fallbackColorFor, battleSpriteUrl } from '../../lib/spriteSheets';
import { sheetCellTexture, fullImageTexture } from './pixiSheet';
import { buildHitTimeline, sampleHitPose } from '../../lib/battleTreatments';

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
  // Treatments inputs (BattleView fills these from executeDamage):
  // damageFraction = final damage / defender max HP; isCrit = crit roll.
  // Absent (old callers) = 0 / false = light, non-crit hit.
  damageFraction?: number;
  isCrit?: boolean;
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

  // Attack timeline driver — TREATMENTS-DRIVEN (WIRING.md §3).
  // Phases: windup 250 (treatments) -> travel 450 (existing lunge /
  // projectile) -> contact: flash + particles + sampled shake, 90 ms
  // frozen hold -> onImpact() at hold end -> recoil 300 -> recover 400
  // -> onDone(). Treatments time is sampled, never re-implemented here:
  // windup samples t=0..250, travel holds t=250, contact samples
  // t=250..1040. Direction: player (left) hits right = +1, enemy = -1.
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
    // DELETED: old flash()/shake() helpers (random shake, fixed fade).
    // Flash/shake/particles below are sampled from the timeline.
    const direction = attack.attacker === 'player' ? 1 : -1;
    const timeline = buildHitTimeline({
      damageFraction: attack.damageFraction ?? 0,
      isCrit: !!attack.isCrit, direction, seed: attack.nonce,
    });
    const CONTACT = 700; // windup 250 + travel 450
    const gap = attack.attacker === 'player' ? 70 : -70;
    const lungeEnd = { x: baseT.x + gap, y: baseT.y };
    let flashG: Graphics | null = null;
    let particleGs: Graphics[] = [];
    const spawnContactFx = () => {
      // Flash overlay: colour from the timeline (red on crit), alpha
      // sampled per frame from pose.flash (100 ms fade in the module).
      flashG = new Graphics();
      flashG.circle(0, -vh * 0.12, Math.min(vw, vh) * 0.16)
        .fill({ color: timeline.flash === 'red' ? 0xff3333 : 0xffffff, alpha: 1 });
      target.addChild(flashG);
      // Particles: module gives count/angle/speed/size; wiring gives
      // only colour (move type) and the spawn point. Angles already fan
      // along the hit direction — do NOT re-randomise them here.
      particleGs = timeline.particles.map((p) => {
        const g = new Graphics();
        g.circle(0, 0, Math.max(2, p.sizePx * 0.6)).fill(color);
        g.position.set(baseT.x, baseT.y - vh * 0.12);
        (g as unknown as { __p: typeof p }).__p = p;
        st.arena.addChild(g);
        return g;
      });
    };
    const clearContactFx = () => {
      if (flashG) { target.removeChild(flashG); flashG.destroy(); flashG = null; }
      particleGs.forEach((g) => { st.arena.removeChild(g); g.destroy(); });
      particleGs = [];
    };
    const resetAll = () => {
      clearContactFx();
      attacker.position.set(baseA.x, baseA.y);
      attacker.scale.set(1, 1);
      target.position.set(baseT.x, baseT.y);
      target.rotation = 0;
      app.stage.position.set(0, 0);
    };

    const step = () => {
      const t = performance.now() - start;
      if (attack.category === 'Status') {
        // No approach: glow on target, impact at 500ms, done at 900ms.
        const pulse = 1 + 0.08 * Math.sin((t / 500) * Math.PI);
        target.scale.set(pulse, pulse);
        if (t >= 500 && !impactFired) { impactFired = true; callbacksRef.current.onImpact(); }
        if (t >= 900) { target.scale.set(1, 1); callbacksRef.current.onDone(); return; }
        raf = requestAnimationFrame(step);
        return;
      }
      // Phase A — windup 0-250 ms: treatments cameraZoom ON THE ATTACKER.
      if (t < 250) {
        const pose = sampleHitPose(t, timeline);
        attacker.scale.set(pose.cameraZoom, pose.cameraZoom);
        raf = requestAnimationFrame(step);
        return;
      }
      // Phase B — travel 250-700 ms: zoom held at its windup-end value.
      if (t < CONTACT) {
        const p = (t - 250) / 450;
        const ease = 1 - Math.pow(1 - p, 2);
        attacker.scale.set(sampleHitPose(250, timeline).cameraZoom,
          sampleHitPose(250, timeline).cameraZoom);
        if (attack.category === 'Special') {
          const proj = st.arena.children.find(c => (c as unknown as { __proj?: boolean }).__proj) as Graphics | undefined;
          let dot = proj;
          if (!dot) {
            dot = new Graphics();
            (dot as unknown as { __proj: boolean }).__proj = true;
            dot.circle(0, 0, 12).fill(color);
            st.arena.addChild(dot);
          }
          dot.position.set(baseA.x + (baseT.x - baseA.x) * p,
            baseA.y - 40 + (baseT.y - 40 - (baseA.y - 40)) * p);
        } else {
          attacker.position.set(baseA.x + (lungeEnd.x - baseA.x) * ease,
            baseA.y + (lungeEnd.y - baseA.y) * ease);
        }
        raf = requestAnimationFrame(step);
        return;
      }
      // Phase C/D/E — contact: treatments t = 250 + (t - CONTACT).
      const s = t - CONTACT; // 0..790 ms of treatments time after impact
      const pose = sampleHitPose(Math.min(250 + s, timeline.totalMs), timeline);
      if (s === 0 || !flashG) spawnContactFx();
      // NOTE: the Special projectile dot is removed at contact by the
      // branch below on first contact frame (it served its travel role).
      const oldProj = st.arena.children.find(c => (c as unknown as { __proj?: boolean }).__proj) as Graphics | undefined;
      if (oldProj && s < 16) { st.arena.removeChild(oldProj); oldProj.destroy(); }
      if (flashG) flashG.alpha = pose.flash;
      // Particles ride their module angle/speed for PARTICLE_MS 450 ms.
      const elapsedSec = s / 1000;
      particleGs.forEach((g) => {
        const p = (g as unknown as { __p: { angleRad: number; speedPxPerSec: number; lifeMs: number } }).__p;
        if (s > p.lifeMs) { g.visible = false; return; }
        g.position.set(baseT.x + Math.cos(p.angleRad) * p.speedPxPerSec * elapsedSec,
          baseT.y - vh * 0.12 + Math.sin(p.angleRad) * p.speedPxPerSec * elapsedSec);
        g.alpha = 1 - s / p.lifeMs;
      });
      // Sampled shake replaces the old random shake; frozen hold means
      // nothing else advances here except flash/particles (above).
      app.stage.position.set(pose.shakeX, pose.shakeY);
      target.position.set(baseT.x + pose.defenderOffsetX, baseT.y + pose.defenderOffsetY);
      target.rotation = (pose.defenderRotationDeg * Math.PI) / 180;
      // Hurt-art hook: if a hurt cell exists for this species, swap the
      // target sprite when pose.defenderArt === 'hurt'; otherwise keep
      // standing (fallback rule, WIRING.md §5). Cell swap is a pixiSheet
      // addition at apply time — do NOT invent a cell name here.
      attacker.scale.set(pose.cameraZoom, pose.cameraZoom);
      // Attacker returns to base during recover (treatments t 640-1040).
      if (attack.category !== 'Special' && s >= 390) {
        const p = Math.min(1, (s - 390) / 400);
        const ease = p * p;
        attacker.position.set(lungeEnd.x + (baseA.x - lungeEnd.x) * ease, baseA.y);
      }
      // onImpact() fires at hold end (s = 90), NOT at contact (s = 0):
      // HP drains AFTER the freeze (WIRING.md §4).
      if (s >= 90 && !impactFired) { impactFired = true; callbacksRef.current.onImpact(); }
      if (s >= 790) { resetAll(); callbacksRef.current.onDone(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearContactFx(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attack?.nonce]);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" />;
}
