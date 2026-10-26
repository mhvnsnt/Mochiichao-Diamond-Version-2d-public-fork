import React, { useEffect, useRef } from 'react';
import { Application, Assets, Graphics, Sprite, Text, Texture } from 'pixi.js';
import {
  LOCKED_START_SCREEN_LAYOUT,
  START_SCREEN_CANVAS_HEIGHT,
  START_SCREEN_CANVAS_WIDTH,
  START_SCREEN_SUBTITLE_FONT,
  startScreenCreatureArtAvailable,
  type StartScreenPreset,
} from '../../lib/startScreenPreset';
import { TITLE_BIOMES } from '../../lib/titleBiomes';
import yogifernoWalkCutout from '../../assets/title/yogiferno-walk-cutout.png';

/**
 * StartScreenPlayback — the title/start screen, played in Pixi
 * from a saved CREATE START SCREEN preset (JSON format from
 * src/lib/startScreenPreset.ts). This is playback, not the
 * creator: it reads slot CONTENT (creature / background /
 * particles) and draws it at the LOCKED slots, and it never
 * edits a preset, never overwrites the locked default, and
 * never moves or restyles a slot (Layout Editor / UI Creator
 * jobs, not this component's).
 *
 * Locked slots, verbatim from LOCKED_START_SCREEN_LAYOUT
 * (1200x1500 canvas, centre coords):
 *   logo       — width 900, centre (600, 450)
 *   subtitle   — width 556, centre (600, 735), font PINNED
 *                (START_SCREEN_SUBTITLE_FONT — never changed
 *                here, never taken from any font row)
 *   pressAnyKey— y = 927, blink 30 frames on / 15 frames off
 *                (500ms / 250ms at 60fps, frame-counted)
 *   studioLogo — width 556, centre (600, 1222)
 * Creature slot: the creator preview box (width 556, centre
 * x = 600, box top y = 990) — that position is NOT locked
 * layout (see startScreenPreset.ts: it must be set in the
 * Layout Editor before playback claims it), so it is used
 * here as the preview position only, labelled as such below
 * and in the caption, never as a locked slot.
 *
 * Slot content, honestly labelled:
 *   creature — Yogiferno clean cutout ONLY (the one name
 *     startScreenCreatureArtAvailable() returns true for).
 *     Any other pool name draws a GAP label at the creature
 *     slot — never fake art, never another creature's sprite.
 *   background — the biome's Pixi palette (sky / sky2 /
 *     ground / ground line, from titleBiomes.ts). Painted
 *     backgrounds are GAP in the preset model: the preset
 *     value 'painted' draws a dark fallback + GAP label, and
 *     the painted PNGs are deliberately NOT loaded here
 *     (show-first rule: they stay out of this new playback
 *     until Mars has seen them in it — see
 *     src/lib/startScreenPlayback.ts).
 *   particles — fire / snow / rain / leaves / embers /
 *     smoke / none, all Pixi-drawn shapes, looping. 'none'
 *     draws zero particles.
 *   logo lettering — plain bold text, NOT a custom logo
 *     font (custom logo-lettering font is GAP, 0/1, in
 *     fonts.ts) and NOT the Behance Y2K Typeface (file
 *     pending). No font is claimed that is not shipped.
 *   audio — none in this component. BOOT (Option B) and
 *     PRESS-START (M3) are wired by the caller
 *     (IntroSequence TITLE/BOOT hookup, via
 *     startScreenPlayback.ts) so there is exactly one
 *     sound path per press, not one here and one there.
 *   title music — GAP. No music is played or claimed.
 *
 * Loop: timeline.loop is true in every valid preset, so the
 * ticker runs the sine sway + particles + press blink
 * indefinitely. prefers-reduced-motion renders one static
 * frame (all slots visible, press line on).
 */

const L = LOCKED_START_SCREEN_LAYOUT;
const W = START_SCREEN_CANVAS_WIDTH;
const H = START_SCREEN_CANVAS_HEIGHT;
// Ground band: below the creature slot, above the studio slot,
// so the creature stands on ground and the studio text sits
// over the ground band (same vertical order as the creator).
const GROUND_Y = 1150;
const CREATURE_FEET_Y = 1130;
const CREATURE_SLOT_TOP = 990;

function fitWidth(text: Text, maxWidth: number): void {
  if (text.width > maxWidth) {
    const scale = maxWidth / text.width;
    text.scale.set(scale);
  }
}

export default function StartScreenPlayback({
  preset,
  source,
  onPress,
}: {
  preset: StartScreenPreset;
  /** 'saved' or 'locked-default' — shown in the caption so the player can tell which preset is playing. */
  source: 'saved' | 'locked-default';
  /** Called on click. Keyboard press is the caller's existing any-key handler (IntroSequence), which also plays the press sound once. */
  onPress: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const presetRef = useRef(preset);
  useEffect(() => { presetRef.current = preset; }, [preset]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = presetRef.current;
    const biome = p.background === 'painted' ? null : TITLE_BIOMES[p.background];
    const app = new Application();
    app.init({ width: W, height: H, background: 0x050810, antialias: false, resolution: Math.min(2, window.devicePixelRatio || 1) }).then(async () => {
      if (cancelled) { app.destroy(true); return; }
      host.appendChild(app.canvas);
      app.canvas.style.width = '100%';
      app.canvas.style.height = 'auto';
      app.canvas.style.display = 'block';

      // Background slot: biome palette only, never a painted PNG.
      const sky = new Graphics();
      if (biome) {
        sky.rect(0, 0, W, GROUND_Y).fill(biome.sky);
        sky.rect(0, 0, W, Math.floor(GROUND_Y / 2)).fill(biome.sky2);
        sky.rect(0, GROUND_Y, W, H - GROUND_Y).fill(biome.ground);
        sky.rect(0, GROUND_Y, W, 2).fill(biome.groundLine);
      } else {
        sky.rect(0, 0, W, H).fill(0x1e293b);
      }
      app.stage.addChild(sky);

      // Logo slot: 900 wide, centre (600, 450). Plain bold text —
      // custom logo font is GAP, never claimed.
      const logo = new Text({
        text: 'MOCHIICHAO',
        style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 96, fontWeight: '900', fill: 0xffffff },
      });
      logo.anchor.set(0.5, 0.5);
      logo.position.set(L.logoCentreX, L.logoCentreY);
      fitWidth(logo, L.logoWidth);
      app.stage.addChild(logo);

      // Subtitle slot: 556 wide, centre (600, 735), font PINNED.
      const subtitle = new Text({
        text: '✦ DIAMOND VERSION ✦',
        style: { fontFamily: START_SCREEN_SUBTITLE_FONT, fontSize: 44, fontWeight: '700', fill: 0x5eead4 },
      });
      subtitle.anchor.set(0.5, 0.5);
      subtitle.position.set(L.subtitleCentreX, L.subtitleCentreY);
      fitWidth(subtitle, L.subtitleWidth);
      app.stage.addChild(subtitle);

      // PRESS ANY KEY slot: y = 927, blink 30 on / 15 off.
      const press = new Text({
        text: 'PRESS ANY KEY',
        style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 40, fontWeight: '700', fill: 0xffffff },
      });
      press.anchor.set(0.5, 0.5);
      press.position.set(W / 2, L.pressAnyKeyY);
      app.stage.addChild(press);

      // Studio logo slot: 556 wide, centre (600, 1222). Text, not
      // the square studio PNG (its aspect does not fit this slot).
      const studio = new Text({
        text: 'M-HEAVENSENT STUDIOS',
        style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 36, fontWeight: '700', fill: 0xe2e8f0 },
      });
      studio.anchor.set(0.5, 0.5);
      studio.position.set(L.studioLogoCentreX, L.studioLogoCentreY);
      fitWidth(studio, L.studioLogoWidth);
      app.stage.addChild(studio);

      // Painted-background GAP label (only when background is painted).
      if (p.background === 'painted') {
        const gap = new Text({
          text: 'PAINTED BACKGROUND — GAP (not shipped in playback)',
          style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 24, fontWeight: '700', fill: 0xfacc15 },
        });
        gap.anchor.set(0.5, 0.5);
        gap.position.set(W / 2, 180);
        fitWidth(gap, 1000);
        app.stage.addChild(gap);
      }

      // Creature slot (preview position, NOT locked): Yogiferno
      // cutout only; every other pool name gets a GAP label.
      let figure: Sprite | null = null;
      if (startScreenCreatureArtAvailable(p.creature) && p.creature === 'Yogiferno') {
        try {
          const tex: Texture = await Assets.load(yogifernoWalkCutout);
          if (!cancelled) {
            figure = new Sprite(tex);
            const scale = 200 / tex.height;
            figure.scale.set(scale);
            figure.anchor.set(0.5, 1);
            figure.position.set(W / 2, CREATURE_FEET_Y);
            app.stage.addChild(figure);
          }
        } catch {
          figure = null;
        }
      }
      if (!figure) {
        const gapName = new Text({
          text: `${p.creature.toUpperCase()} — CUTOUT: GAP`,
          style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 28, fontWeight: '700', fill: 0xf0abfc },
        });
        gapName.anchor.set(0.5, 0.5);
        gapName.position.set(W / 2, CREATURE_SLOT_TOP + 45);
        app.stage.addChild(gapName);
        const gapNote = new Text({
          text: 'Clean cutout not shipped for playback — never fake art',
          style: { fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif', fontSize: 20, fill: 0xe2e8f0 },
        });
        gapNote.anchor.set(0.5, 0.5);
        gapNote.position.set(W / 2, CREATURE_SLOT_TOP + 80);
        app.stage.addChild(gapNote);
      }

      // Particles slot: Pixi-drawn shapes, one kind per preset.
      interface Particle { g: Graphics; vx: number; vy: number; life: number; max: number; sway: number; }
      const particles: Particle[] = [];
      const COUNT = 40;
      const spawn = (initial: boolean) => {
        const g = new Graphics();
        const kind = p.particles;
        if (kind === 'rain') g.rect(0, 0, 2, 14).fill(0xbfdbfe);
        else if (kind === 'leaves') g.ellipse(0, 0, 6, 3).fill(0x4ade80);
        else if (kind === 'smoke') g.circle(0, 0, 6 + Math.random() * 6).fill({ color: 0x94a3b8, alpha: 0.4 });
        else if (kind === 'fire' || kind === 'embers') g.circle(0, 0, kind === 'fire' ? 3 + Math.random() * 4 : 2 + Math.random() * 2).fill(Math.random() < 0.5 ? 0xf97316 : 0xef4444);
        else g.circle(0, 0, 2 + Math.random() * 3).fill(0xffffff); // snow
        g.x = Math.random() * W;
        g.y = initial ? Math.random() * H : (kind === 'fire' || kind === 'embers' || kind === 'smoke' ? H - 20 : -10);
        app.stage.addChild(g);
        const rising = kind === 'fire' || kind === 'embers' || kind === 'smoke';
        particles.push({
          g,
          vx: (Math.random() - 0.5) * 20,
          vy: rising ? -(30 + Math.random() * 50) : (kind === 'rain' ? 420 + Math.random() * 180 : 40 + Math.random() * 60),
          life: 0,
          max: rising ? 2 + Math.random() * 2 : 0,
          sway: Math.random() * Math.PI * 2,
        });
      };
      if (p.particles !== 'none') {
        for (let i = 0; i < COUNT; i++) spawn(true);
      }

      if (reduced) return;
      let t = 0;
      let frame = 0;
      app.ticker.add((ticker) => {
        const dt = ticker.deltaTime / 60;
        t += dt;
        frame += ticker.deltaTime;
        // PRESS blink: 30 frames on / 15 frames off (45-frame cycle).
        const cycle = Math.floor(frame) % (L.pressAnyKeyBlinkOnFrames + L.pressAnyKeyBlinkOffFrames);
        press.visible = cycle < L.pressAnyKeyBlinkOnFrames;
        if (figure) {
          figure.x = W / 2 + Math.sin(t * 2) * 3;
          figure.y = CREATURE_FEET_Y + Math.sin(t * 8) * 4;
        }
        for (let i = particles.length - 1; i >= 0; i--) {
          const pt = particles[i];
          pt.life += dt;
          pt.g.x += (pt.vx + Math.sin(t * 2 + pt.sway) * 12) * dt;
          pt.g.y += pt.vy * dt;
          if (p.particles === 'smoke' || p.particles === 'embers' || p.particles === 'fire') {
            pt.g.alpha = Math.max(0, 1 - pt.life / pt.max);
          }
          const out = pt.g.y < -20 || pt.g.y > H + 20 || pt.g.x < -20 || pt.g.x > W + 20 || (pt.max > 0 && pt.life >= pt.max);
          if (out) {
            app.stage.removeChild(pt.g);
            pt.g.destroy();
            particles.splice(i, 1);
            spawn(false);
          }
        }
      });
    });
    return () => { cancelled = true; app.destroy(true); };
  }, [preset]);

  const artGap = !startScreenCreatureArtAvailable(preset.creature);
  return (
    <div className="w-full">
      <div
        ref={hostRef}
        className="w-full mx-auto overflow-hidden rounded cursor-pointer"
        style={{ aspectRatio: '1200 / 1500', maxHeight: '78dvh', background: '#050810' }}
        onClick={onPress}
        role="button"
        aria-label="Press any key — start screen"
      />
      <div className="text-center text-[11px] text-gray-400 mt-2">
        {`Playing preset "${preset.name}" (${source === 'saved' ? 'saved preset' : 'locked default — no saved preset found'}). `}
        {`Background: ${preset.background === 'painted' ? 'PAINTED — GAP' : `${preset.background} biome palette (painted PNG not used in playback)`} · `}
        {`Particles: ${preset.particles} · `}
        {artGap ? `Creature: ${preset.creature} — GAP label (never fake art). ` : 'Creature: Yogiferno clean cutout. '}
        {'Creature slot position is the creator preview position, not locked layout. Subtitle font pinned.'}
      </div>
    </div>
  );
}
