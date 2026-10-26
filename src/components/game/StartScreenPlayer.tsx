import React, { useEffect, useRef, useState } from 'react';
import { Application, Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { TITLE_BIOMES } from '../../lib/titleBiomes';
import { PINNED_SUBTITLE_FONT } from '../../lib/fonts';
import {
  LOCKED_START_SCREEN_LAYOUT,
  START_SCREEN_CANVAS_HEIGHT,
  START_SCREEN_CANVAS_WIDTH,
  startScreenCreatureArtAvailable,
} from '../../lib/startScreenPreset';
import {
  START_SCREEN_AUDIO_SLOT,
  resolveStartScreenPlayback,
} from '../../lib/startScreenPlayback';
import yogifernoWalkCutout from '../../assets/title/yogiferno-walk-cutout.png';

/**
 * StartScreenPlayer — playback of a saved Start Screen preset in Pixi.
 *
 * This is the TITLE phase's renderer (wired in IntroSequence.tsx):
 * it resolves the preset itself (most recently saved user preset,
 * else the locked default, per-field fallback — see
 * startScreenPlayback.ts) and renders it on the locked 1200x1500
 * canvas from PR #44, letterboxed and centred in its host:
 *   logo         — 900 wide, centre (600, 450)
 *   subtitle     — 556 wide, centre (600, 735), font PINNED
 *   PRESS ANY KEY— y = 927, blink FireRed tempo: 60 frames first, then 30 frames on / 30 frames off
 *   studio logo  — 556 wide, centre (600, 1222)
 *   creature     — feet at y = 1180, centred x = 600 (position is
 *     NOT a locked slot in PR #44 — the creator preview box only;
 *     the Layout Editor owns any future move, none invented here)
 *   background   — preset biome palette, Pixi-drawn
 *   particles    — preset particle kind, Pixi-drawn
 * Any key/click advance stays with IntroSequence (window handlers
 * there); this player stops no propagation and owns no phase change.
 *
 * Show-first compliance (Mars, 2026-10-25 ~20:40 CDT, standing):
 *   - Only Yogiferno's already-shipped PR #33 v1 clean cutout may
 *     be drawn, via the availability flag. The other 9 pool names
 *     render a labelled GAP box — no fake art, no invented art,
 *     and the parallel lane's 9 cutout PNGs are NOT imported here.
 *   - Painted backgrounds are NOT drawn: a 'painted' choice renders
 *     a labelled slate fallback + GAP label, never a fake painting
 *     (the 8 title-bg-*-v2.png files on main are not referenced).
 *   - Audio: NO audio is wired here. The footer labels the music
 *     slot by name only, empty (GAP). Settled BOOT Option B /
 *     PRESS-START M3 roles are already wired on main (PR #71,
 *     bootAudio.ts via advanceIntro, untouched) — no second path.
 *   - Fonts: subtitle uses PINNED_SUBTITLE_FONT only. Behance
 *     Kilo/Roadam and the custom logo font are NOT shipped here.
 *   - Phase 2 export (FFmpeg / MediaRecorder) is GAP, not in this
 *     player.
 *
 * Failure mode: if Pixi init or the Yogiferno texture load fails,
 * the player renders the same slots as DOM text (never blank, never
 * a crash). prefers-reduced-motion renders the scene static: no
 * particle motion, no sine sway, PRESS ANY KEY held visible.
 */

const L = LOCKED_START_SCREEN_LAYOUT;
const CW = START_SCREEN_CANVAS_WIDTH;
const CH = START_SCREEN_CANVAS_HEIGHT;

interface ParticleSpec {
  color: number;
  radius: number;
  fall: number;
  rise: boolean;
  drift: number;
  streak: boolean;
  grow: boolean;
}

const PARTICLE_SPECS: Record<string, ParticleSpec> = {
  fire: { color: 0xf97316, radius: 3, fall: 0, rise: true, drift: 10, streak: false, grow: false },
  embers: { color: 0xef4444, radius: 2.5, fall: 0, rise: true, drift: 8, streak: false, grow: false },
  snow: { color: 0xffffff, radius: 2.5, fall: 26, rise: false, drift: 12, streak: false, grow: false },
  rain: { color: 0xbfdbfe, radius: 1.5, fall: 180, rise: false, drift: 4, streak: true, grow: false },
  leaves: { color: 0x4ade80, radius: 3.5, fall: 20, rise: false, drift: 26, streak: false, grow: false },
  smoke: { color: 0x94a3b8, radius: 6, fall: 0, rise: true, drift: 6, streak: false, grow: true },
};

function fitText(text: Text, targetWidth: number): void {
  if (text.width > 0 && text.width !== targetWidth) {
    const s = targetWidth / text.width;
    text.scale.set(s);
  }
}

export default function StartScreenPlayer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [resolved] = useState(() => resolveStartScreenPlayback());
  const [pixiFailed, setPixiFailed] = useState(false);
  const preset = resolved.preset;
  const biome = preset.background === 'painted' ? null : TITLE_BIOMES[preset.background];
  const artAvailable = startScreenCreatureArtAvailable(preset.creature) && resolved.creatureArtAvailable;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const app = new Application();
    app
      .init({
        resizeTo: host,
        background: 0x050810,
        antialias: false,
        resolution: Math.min(2, window.devicePixelRatio || 1),
      })
      .then(async () => {
        if (cancelled) {
          app.destroy(true);
          return;
        }
        host.appendChild(app.canvas);
        const W = app.screen.width;
        const H = app.screen.height;
        const scale = Math.min(W / CW, H / CH);
        const ox = (W - CW * scale) / 2;
        const oy = (H - CH * scale) / 2;
        const scene = new Container();
        scene.scale.set(scale);
        scene.position.set(ox, oy);
        app.stage.addChild(scene);

        // Background: biome palette, Pixi-drawn. Painted choice gets
        // the slate fallback (never a painting, never blank).
        const sky = new Graphics();
        if (biome) {
          sky.rect(0, 0, CW, CH).fill(biome.sky2);
          sky.rect(0, 0, CW, 900).fill(biome.sky);
          const ground = new Graphics();
          ground.rect(0, 1400, CW, 100).fill(biome.ground);
          ground.rect(0, 1400, CW, 3).fill(biome.groundLine);
          scene.addChild(sky, ground);
        } else {
          sky.rect(0, 0, CW, CH).fill(0x1e293b);
          scene.addChild(sky);
        }
        // Thin ground line under the creature's feet.
        const groundLine = new Graphics();
        groundLine.rect(0, 1180, CW, 3).fill(biome ? biome.groundLine : 0x475569);
        scene.addChild(groundLine);

        // Logo slot: 900 wide, centre (600, 450).
        const logo = new Text({
          text: 'MOCHIICHAO',
          style: {
            fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
            fontSize: 120,
            fontWeight: '900',
            fill: 0xffffff,
            letterSpacing: 8,
          },
        });
        fitText(logo, L.logoWidth);
        logo.anchor.set(0.5, 0.5);
        logo.position.set(L.logoCentreX, L.logoCentreY);
        scene.addChild(logo);

        // Subtitle slot: 556 wide, centre (600, 735), font PINNED.
        const subtitle = new Text({
          text: '✦ DIAMOND VERSION ✦',
          style: {
            fontFamily: PINNED_SUBTITLE_FONT,
            fontSize: 44,
            fontWeight: 'bold',
            fill: 0x5eead4,
            letterSpacing: 4,
          },
        });
        fitText(subtitle, L.subtitleWidth);
        subtitle.anchor.set(0.5, 0.5);
        subtitle.position.set(L.subtitleCentreX, L.subtitleCentreY);
        scene.addChild(subtitle);

        // PRESS ANY KEY slot: y = 927, blink FireRed tempo: 60 frames first, then 30 on / 30 off (frames).
        const press = new Text({
          text: 'PRESS ANY KEY',
          style: {
            fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
            fontSize: 44,
            fontWeight: 'bold',
            fill: 0xffffff,
            letterSpacing: 6,
          },
        });
        press.anchor.set(0.5, 0.5);
        press.position.set(CW / 2, L.pressAnyKeyY);
        scene.addChild(press);

        // Creature slot: Yogiferno v1 cutout only; others GAP box.
        // Engine-drawn ground shadow, Pokemon-first: FireRed draws
        // the shadow as a SEPARATE 32x8 sprite (gEnemyMonShadow_Gfx,
        // PALTAG_SHADOW, SetBattlerShadowSpriteCallback), never baked
        // into the creature art. Same parameters as the TitleScene
        // shadow (PR #102): one ellipse under the figure's feet,
        // drawn BEFORE the figure so feet overlap it, width = 65% of
        // the displayed figure width, height = width/4 (FireRed 32x8
        // ratio), black at 0.32 alpha, at the ground line (1180) + 12.
        // This player has no Black 2 motion-blur ghost layer, so
        // there is no ghost to duplicate the shadow. Preset-only:
        // the locked default title renders no figure by design.
        let figure: Sprite | null = null;
        let shadow: Graphics | null = null;
        if (artAvailable && preset.creature === 'Yogiferno') {
          try {
            const tex = await Assets.load(yogifernoWalkCutout);
            if (cancelled) return;
            figure = new Sprite(tex);
            const s = 200 / tex.height;
            figure.scale.set(s);
            figure.anchor.set(0.5, 1);
            figure.position.set(CW / 2, 1180);
            scene.addChild(figure);
            shadow = new Graphics();
            const dispW = tex.width * s;
            const shW = dispW * 0.65;
            shadow.ellipse(0, 0, shW / 2, shW * 0.25 / 2).fill({ color: 0x000000, alpha: 0.32 });
            shadow.x = figure.x; shadow.y = 1180 + 12;
            scene.addChildAt(shadow, scene.children.indexOf(figure));
          } catch {
            figure = null;
            shadow = null;
          }
        }
        if (!figure) {
          const box = new Graphics();
          box.rect(322, 990, 556, 190).stroke({ color: 0xe879f9, width: 3 });
          box.rect(322, 990, 556, 190).fill({ color: 0x000000, alpha: 0.4 });
          scene.addChild(box);
          const gap = new Text({
            text: preset.creature.toUpperCase(),
            style: {
              fontFamily: '"Trebuchet MS", sans-serif',
              fontSize: 36,
              fontWeight: 'bold',
              fill: 0xf5d0fe,
            },
          });
          gap.anchor.set(0.5, 0.5);
          gap.position.set(CW / 2, 1060);
          scene.addChild(gap);
          const gapNote = new Text({
            text: artAvailable
              ? 'Creature cutout failed to load — GAP, no fake art'
              : 'Creature cutout: GAP — clean cutout not shipped yet',
            style: { fontFamily: '"Trebuchet MS", sans-serif', fontSize: 24, fill: 0xe2e8f0 },
          });
          gapNote.anchor.set(0.5, 0.5);
          gapNote.position.set(CW / 2, 1110);
          scene.addChild(gapNote);
        }

        // Studio logo slot: 556 wide, centre (600, 1222).
        const studio = new Text({
          text: 'M HEAVENSENT STUDIOS',
          style: {
            fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
            fontSize: 36,
            fontWeight: 'bold',
            fill: 0xe2e8f0,
            letterSpacing: 4,
          },
        });
        fitText(studio, L.studioLogoWidth);
        studio.anchor.set(0.5, 0.5);
        studio.position.set(L.studioLogoCentreX, L.studioLogoCentreY);
        scene.addChild(studio);

        // GAP / source labels (small, top + footer — never over slots).
        const labels: string[] = [];
        if (resolved.paintedBackgroundGap) {
          labels.push('BACKGROUND: PAINTED — GAP (not shipped): slate fallback shown. Pick a biome for a real background.');
        }
        if (resolved.fellBackFields.length > 0) {
          labels.push(`Preset field(s) fell back to Locked Default: ${resolved.fellBackFields.join(', ')}.`);
        }
        labels.push(
          `Preset: ${resolved.sourceName} (${resolved.source === 'saved' ? 'most recently saved' : 'locked default'}) · ` +
            `Audio: per-preset music slot "${START_SCREEN_AUDIO_SLOT.name}" is name-only (empty); title music plays via the wired official title track · press-start chirp already wired on main (bootAudio) · ` +
            `Reset to Locked Default in Settings → Menu Creator → CREATE START SCREEN`,
        );
        labels.forEach((line, i) => {
          const t = new Text({
            text: line,
            style: { fontFamily: '"Trebuchet MS", sans-serif', fontSize: 20, fill: 0x94a3b8 },
          });
          if (t.width > CW - 80) t.scale.set((CW - 80) / t.width);
          t.anchor.set(0.5, 0.5);
          // Painted/fallback notes sit at the top; the source line
          // sits in the footer below the studio slot.
          t.position.set(CW / 2, i === labels.length - 1 ? 1450 : 90 + i * 30);
          scene.addChild(t);
        });

        // Particles: preset kind, Pixi-drawn, ticker-stepped.
        const spec = preset.particles === 'none' ? null : PARTICLE_SPECS[preset.particles];
        interface P {
          g: Graphics;
          x: number;
          y: number;
          phase: number;
        }
        const particles: P[] = [];
        if (spec) {
          for (let i = 0; i < 42; i++) {
            const g = new Graphics();
            if (spec.streak) g.rect(0, 0, 2, 12).fill(spec.color);
            else g.circle(0, 0, spec.radius + Math.random() * 2).fill(spec.color);
            const x = Math.random() * CW;
            const y = Math.random() * CH;
            g.position.set(x, y);
            scene.addChild(g);
            particles.push({ g, x, y, phase: Math.random() * Math.PI * 2 });
          }
        }

        if (reduced) {
          press.visible = true;
          return;
        }
        let t = 0;
        let frame = 0;
        app.ticker.add((ticker) => {
          const dt = ticker.deltaTime / 60;
          t += dt;
          frame += ticker.deltaTime;
          // Blink, FireRed Task_TitleScreen_BlinkPressStart: first interval 60 frames visible, then 30 off / 30 on.
          const blinkFrame = Math.floor(frame);
          press.visible = blinkFrame < 60 ? true : ((blinkFrame - 60) % 60) >= 30;
          if (figure) {
            figure.y = 1180 + Math.sin(t * 2) * 6;
            figure.x = CW / 2 + Math.sin(t * 2) * 3;
            // Ground shadow follows the figure's walk x but stays
            // on the ground: it never bobs with the figure's sine
            // sway. When the figure lifts, the shadow shrinks and
            // fades slightly — never below 75% size.
            if (shadow) {
              shadow.x = figure.x;
              shadow.y = 1180 + 12;
              const elev = 1180 - figure.y;
              const shScale = Math.max(0.75, Math.min(1, 1 - elev / 200));
              shadow.scale.set(shScale);
              shadow.alpha = 0.32 * shScale;
            }
          }
          for (const p of particles) {
            if (!spec) break;
            if (spec.rise) p.y -= (18 + spec.fall) * dt;
            else p.y += spec.fall * dt;
            p.x += Math.sin(t * 2 + p.phase) * spec.drift * dt;
            if (p.y < -20) p.y = CH + 20;
            if (p.y > CH + 20) p.y = -20;
            if (p.x < -20) p.x = CW + 20;
            if (p.x > CW + 20) p.x = -20;
            p.g.position.set(p.x, p.y);
            if (spec.grow) p.g.scale.set(1 + (Math.sin(t * 3 + p.phase) + 1) * 0.4);
            else p.g.alpha = 0.55 + 0.45 * Math.abs(Math.sin(t * 3 + p.phase));
          }
        });
      })
      .catch(() => {
        if (!cancelled) setPixiFailed(true);
      });
    return () => {
      cancelled = true;
      app.destroy(true);
    };
  }, [biome, preset.background, preset.creature, preset.particles, resolved]);

  if (pixiFailed) {
    // DOM fallback: same slots as text, never blank, never a crash.
    return (
      <div className="w-full flex flex-col items-center text-center gap-2 py-8">
        <div className="text-white text-4xl font-black tracking-widest">MOCHIICHAO</div>
        <div className="text-teal-300 text-xl font-bold tracking-[0.4em]" style={{ fontFamily: PINNED_SUBTITLE_FONT }}>
          ✦ DIAMOND VERSION ✦
        </div>
        <div className="text-white font-bold tracking-widest mt-4">PRESS ANY KEY</div>
        <div className="text-fuchsia-200 font-bold mt-2">
          {preset.creature.toUpperCase()} — {artAvailable ? 'Yogiferno cutout (shipped)' : 'Creature cutout: GAP — clean cutout not shipped yet'}
        </div>
        <div className="text-slate-300 font-bold tracking-widest mt-2">M HEAVENSENT STUDIOS</div>
        <div className="text-slate-400 text-xs mt-2">
          Preset: {resolved.sourceName} · Background: {preset.background}
          {resolved.paintedBackgroundGap ? ' — PAINTED GAP (slate fallback)' : ''} · Particles: {preset.particles} · Music: official title track (wired); per-preset slot name-only · press-start chirp wired on main
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center min-h-0">
      <div ref={hostRef} className="relative overflow-hidden rounded" style={{ width: '100%', height: 'min(92vh, 900px)' }} />
    </div>
  );
}
