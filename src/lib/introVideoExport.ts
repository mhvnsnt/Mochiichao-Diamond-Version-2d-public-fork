/**
 * CREATOR PHASE 2 — video export (MediaRecorder web route).
 *
 * Pokemon structure translated, never Pokemon code, text, art,
 * music or files copied:
 * - FireRed title/intro: dedicated full screen, scene list, any-key
 *   skips, fade transitions. Here the same scene/timeline data the
 *   creator already stores (scenes, keyframes, camera, particles,
 *   text, music slot) is rendered frame-by-frame to a <canvas> and
 *   recorded with the browser's MediaRecorder API.
 *
 * Route shipped (the one that actually works in this React/Vite
 * web game): MediaRecorder capture of a canvas-2D render of the
 * preset timeline. No binary is shipped, no paid/proprietary tool
 * is bundled, nothing over 100 MB is added — MediaRecorder is a
 * browser API (no licence to note), the output is WebM (VP8/VP9,
 * open codecs) where the browser supports it, falling back to
 * MP4 only where the browser reports WebM as unsupported.
 * FFmpeg (LGPL/GPL, desktop) is NOT shipped and NOT in the web
 * build; it stays an install note only, for converting the
 * exported WebM to MP4 later
 * (ffmpeg -i intro-export.webm intro-export.mp4) or for adding
 * an audio track once original final music exists.
 *
 * What IS exported (honest slice, not a fake "complete" export):
 * - Every scene in preset order, at its stored duration, with its
 *   stored background palette, transition (fade-black / fade-white
 *   / shutter-wipe / slide, 0.5 s incoming), camera (pan / zoom /
 *   shake, Pokemon title sine math via cameraAt()), keyframed
 *   position / scale / opacity, particle set, logo / subtitle
 *   (PINNED font) / dialogue text, and any open-source panel /
 *   particle component the scene picked (panel drawn behind the
 *   text block, particle/icon drawn as the particle sprites).
 * - Start screens: one 6 s looping hold of the single scene
 *   (background, logo, PINNED subtitle, PRESS ANY KEY blink
 *   30 frames on / 15 frames off at 60 fps, creature slot,
 *   studio logo), plus picked open-source panel/icon components.
 *
 * What is NOT exported (labelled in the export screens, never
 * faked):
 * - Audio. The music slot is a name only and ships EMPTY in the
 *   locked default; no audio file is attached to any preset, so
 *   the exported file is SILENT. No Pokemon music or cries are
 *   ever attached.
 * - Painted backgrounds: a 'painted' scene renders the slate
 *   fallback palette + a GAP label, same as Pixi playback — no
 *   painted art is invented here.
 * - Creature cutouts: only Yogiferno has a clean cutout in the
 *   repo. Any other rotation-pool creature renders as a GAP
 *   label in the video, never fake art and never another
 *   creature's art.
 * - The DOM preview itself is NOT screen-captured (it is CSS, not
 *   a canvas). The video is a fresh canvas-2D render of the same
 *   timeline data, using the same math as Pixi playback — so the
 *   video matches playback, it is not a screenshot of the editor.
 * - Blender .blend export stays GAP (desktop only, install note).
 *
 * Canvas sizes: intro 1280x720, start screen 720x900 (the locked
 * 1200x1500 canvas scaled to 0.6 — same 4:5 aspect).
 */

import {
  cameraAt, keyframedValue, totalDuration,
  type IntroVideoPreset, type IntroVideoScene,
} from './introVideoCreator';
import {
  sceneAt, transitionOverlay, INTRO_PLAYBACK_PARTICLE_STYLE,
} from './introVideoPlayback';
import { TITLE_BIOMES, type TitleBiomeId } from './titleBiomes';
import { FONT_OPTIONS, PINNED_SUBTITLE_FONT } from './fonts';
import {
  OPEN_SOURCE_ASSETS, openSourceAssetUrl,
  type OpenSourceAsset,
} from './openSourceAssets';
import type { StartScreenPreset } from './startScreenPreset';

export const INTRO_EXPORT_WIDTH = 1280;
export const INTRO_EXPORT_HEIGHT = 720;
export const START_EXPORT_WIDTH = 720;
export const START_EXPORT_HEIGHT = 900;
/** Start-screen export length: one 6 s hold of the single scene. */
export const START_EXPORT_SECONDS = 6;
/** Frames per second the canvas render + capture run at. */
export const INTRO_EXPORT_FPS = 60;

const MIME_CANDIDATES = [
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
  'video/mp4',
];

/** First MediaRecorder mime type this browser reports, else null. */
export function pickExportMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  for (const m of MIME_CANDIDATES) {
    try {
      if (MediaRecorder.isTypeSupported(m)) return m;
    } catch {
      /* ignore and try the next candidate */
    }
  }
  return null;
}

export function exportFileExtension(mime: string): string {
  return mime.includes('mp4') ? 'mp4' : 'webm';
}

export function openSourceAssetById(id: string): OpenSourceAsset | undefined {
  return OPEN_SOURCE_ASSETS.find(a => a.id === id);
}

/** Load an asset URL into an <img>, or null on failure. */
export function loadAssetImage(asset: OpenSourceAsset): Promise<HTMLImageElement | null> {
  const url = openSourceAssetUrl(asset);
  if (!url || !/\.(png|svg)$/i.test(asset.file)) return Promise.resolve(null);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Load every image-backed picked component, keyed by asset id. */
export async function loadComponentImages(
  ids: string[],
): Promise<Map<string, HTMLImageElement>> {
  const out = new Map<string, HTMLImageElement>();
  for (const id of ids) {
    const asset = openSourceAssetById(id);
    if (!asset) continue;
    const img = await loadAssetImage(asset);
    if (img) out.set(id, img);
  }
  return out;
}

function fontFamilyFor(id: string): string {
  return FONT_OPTIONS.find(f => f.id === id)?.family || 'Trebuchet MS';
}

function hex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`;
}

/** Deterministic pseudo-random in [0, 1) from a string seed. */
function seededRand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export interface ExportFrameImages {
  yogiferno: HTMLImageElement | null;
  components: Map<string, HTMLImageElement>;
}

function pickedComponents(
  ids: string[] | undefined,
  images: Map<string, HTMLImageElement>,
): { asset: OpenSourceAsset; img: HTMLImageElement }[] {
  const out: { asset: OpenSourceAsset; img: HTMLImageElement }[] = [];
  for (const id of ids || []) {
    const asset = openSourceAssetById(id);
    const img = images.get(id);
    if (asset && img) out.push({ asset, img });
  }
  return out;
}

function drawGapLabel(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  lines: string[],
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  const w = W * 0.6;
  const h = 28 + lines.length * 22;
  ctx.fillRect(W / 2 - w / 2, H * 0.62, w, h);
  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${Math.round(H * 0.022)}px Trebuchet MS, sans-serif`;
  ctx.textAlign = 'center';
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, H * 0.62 + 26 + i * 22);
  });
  ctx.restore();
}

/**
 * Draw one intro frame. Pure canvas-2D render of the same timeline
 * data Pixi playback uses (sceneAt / cameraAt / keyframedValue /
 * transitionOverlay) — no DOM, no Pixi, so MediaRecorder can
 * capture it from any canvas.
 */
export function drawIntroFrame(
  ctx: CanvasRenderingContext2D,
  preset: IntroVideoPreset,
  globalTime: number,
  images: ExportFrameImages,
): void {
  const W = INTRO_EXPORT_WIDTH;
  const H = INTRO_EXPORT_HEIGHT;
  const pos = sceneAt(preset, globalTime);
  const scene: IntroVideoScene = pos.scene;
  const cam = cameraAt(scene, pos.localTime);
  const ov = transitionOverlay(scene, pos.transitionProgress);
  const biome = scene.background === 'painted'
    ? null
    : TITLE_BIOMES[scene.background as TitleBiomeId];

  ctx.save();
  ctx.clearRect(0, 0, W, H);
  // Camera container: pan / zoom / shake around the frame centre,
  // plus the incoming slide offset.
  ctx.translate(
    W / 2 + (cam.x / 100) * W + ov.slideOffsetX * W + cam.shakeX,
    H / 2 + (cam.y / 100) * H + cam.shakeY,
  );
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-W / 2, -H / 2);

  // Background: palette sky + ground band (Pixi player parity).
  const groundY = H - 90;
  ctx.fillStyle = biome ? hex(biome.sky) : '#1e293b';
  ctx.fillRect(0, 0, W, groundY);
  ctx.fillStyle = biome ? hex(biome.sky2) : '#334155';
  ctx.fillRect(0, 0, W, Math.floor(groundY / 2));
  ctx.fillStyle = biome ? hex(biome.ground) : '#334155';
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = biome ? hex(biome.groundLine) : '#475569';
  ctx.fillRect(0, groundY, W, 3);
  if (biome?.tufts) {
    ctx.fillStyle = hex(biome.groundLine);
    for (let x = 8; x < W; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 50);
      ctx.lineTo(x + 3, groundY + 18);
      ctx.lineTo(x + 6, groundY + 50);
      ctx.fill();
    }
  }

  // Open-source panel component, behind the text block.
  const comps = pickedComponents(scene.openSourceComponentIds, images.components);
  const panel = comps.find(c => c.asset.kind === 'panel');
  const textBox = { x: W * 0.22, y: H * 0.14, w: W * 0.56, h: H * 0.42 };
  if (panel) {
    ctx.drawImage(panel.img, textBox.x, textBox.y, textBox.w, textBox.h);
  }

  // Text block (logo / PINNED subtitle / dialogue).
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${Math.round(H * 0.075)}px ${fontFamilyFor(scene.text.logoFontId)}, Trebuchet MS, sans-serif`;
  ctx.fillText(scene.text.logo || '—', W / 2, H * 0.30);
  ctx.fillStyle = '#5eead4';
  ctx.font = `700 ${Math.round(H * 0.032)}px ${PINNED_SUBTITLE_FONT}, Trebuchet MS, sans-serif`;
  ctx.fillText(scene.text.subtitle || '—', W / 2, H * 0.38);
  if (scene.text.dialogue) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.round(H * 0.024)}px ${fontFamilyFor(scene.text.dialogueFontId)}, Trebuchet MS, sans-serif`;
    ctx.fillText(scene.text.dialogue, W / 2, H * 0.46);
  }

  // Creature: Yogiferno cutout only; everyone else is a GAP label.
  const yogi = scene.creatures.includes('Yogiferno');
  const px = keyframedValue(scene, 'position', 'x', pos.localTime, 50);
  const py = keyframedValue(scene, 'position', 'y', pos.localTime, 100);
  const sc = keyframedValue(scene, 'scale', 'scale', pos.localTime, 1);
  const op = keyframedValue(scene, 'opacity', 'opacity', pos.localTime, 1);
  if (yogi && images.yogiferno) {
    const targetH = H * 0.42 * sc;
    const ratio = images.yogiferno.width / images.yogiferno.height;
    ctx.save();
    ctx.globalAlpha = op;
    ctx.drawImage(
      images.yogiferno,
      (px / 100) * W - (targetH * ratio) / 2,
      (py / 100) * H - targetH,
      targetH * ratio,
      targetH,
    );
    ctx.restore();
  }
  const gapCreatures = scene.creatures.filter(c => c !== 'Yogiferno');
  if (gapCreatures.length > 0 || scene.background === 'painted') {
    const lines: string[] = [];
    if (scene.background === 'painted') lines.push('Painted background: GAP — slate fallback shown.');
    if (gapCreatures.length > 0) lines.push(`Creature cutout GAP (no fake art): ${gapCreatures.join(', ')}`);
    drawGapLabel(ctx, W, H, lines);
  }

  // Particles: picked open-source particle/icon sprites if any,
  // otherwise the spec particle drawn as shapes (playback parity).
  const particleSprites = comps.filter(
    c => c.asset.kind === 'particle' || c.asset.kind === 'icon',
  );
  const style = INTRO_PLAYBACK_PARTICLE_STYLE[scene.particle];
  if (style) {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const seed = `${scene.id}:${i}`;
      const x0 = seededRand(`${seed}:x`) * W;
      const y0 = seededRand(`${seed}:y`) * H;
      const speed = style.fallSpeed;
      let y = y0 + speed * pos.localTime;
      y = ((y % H) + H) % H;
      const x = x0 + Math.sin(pos.localTime * 2 + seededRand(`${seed}:s`) * Math.PI * 2) * 12;
      const sprite = particleSprites[i % particleSprites.length];
      if (sprite) {
        const s = style.size * 6;
        ctx.drawImage(sprite.img, x - s / 2, y - s / 2, s, s);
      } else {
        ctx.fillStyle = hex(style.color);
        if (scene.particle === 'rain') ctx.fillRect(x, y, 2, 14);
        else if (scene.particle === 'leaves') {
          ctx.beginPath();
          ctx.ellipse(x, y, 6, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, style.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
  ctx.restore();

  // Transition overlay (screen space, above the scene).
  if (ov.fadeAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = ov.fadeAlpha;
    ctx.fillStyle = ov.fadeColor === 0xffffff ? '#ffffff' : '#000000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (ov.shutterCover > 0) {
    ctx.fillStyle = '#000000';
    const bars = 8;
    const bw = Math.ceil(W / bars);
    for (let i = 0; i < bars; i++) {
      ctx.fillRect(i * bw, 0, bw, H * ov.shutterCover);
    }
  }
}

/** Draw one start-screen frame (6 s hold, single scene). */
export function drawStartFrame(
  ctx: CanvasRenderingContext2D,
  preset: StartScreenPreset,
  elapsed: number,
  images: ExportFrameImages,
): void {
  const W = START_EXPORT_WIDTH;
  const H = START_EXPORT_HEIGHT;
  const scale = W / 1200; // locked 1200x1500 canvas -> 720x900
  const biome = preset.background === 'painted'
    ? null
    : TITLE_BIOMES[preset.background as TitleBiomeId];
  ctx.clearRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, biome ? hex(biome.sky2) : '#1e293b');
  grad.addColorStop(1, biome ? hex(biome.sky) : '#0b1226');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const comps = pickedComponents(preset.openSourceComponentIds, images.components);
  const panel = comps.find(c => c.asset.kind === 'panel');
  if (panel) {
    // Panel component frames the whole start screen.
    ctx.drawImage(panel.img, 8, 8, W - 16, H - 16);
  }
  const icon = comps.find(c => c.asset.kind === 'icon');
  if (icon) {
    ctx.drawImage(icon.img, W - 96, 16, 80, 80);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.font = `900 ${Math.round(64 * scale * 1.6)}px Trebuchet MS, sans-serif`;
  ctx.fillText('MOCHIICHAO', W / 2, 450 * scale + 30);
  ctx.fillStyle = '#a5f3fc';
  ctx.font = `700 ${Math.round(28 * scale * 1.6)}px ${PINNED_SUBTITLE_FONT}, Trebuchet MS, sans-serif`;
  ctx.fillText('DIAMOND VERSION', W / 2, 735 * scale + 12);
  // PRESS ANY KEY blink: 30 frames on / 15 frames off at 60 fps.
  const frame = Math.floor(elapsed * INTRO_EXPORT_FPS);
  if (frame % 45 < 30) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${Math.round(26 * scale * 1.6)}px Trebuchet MS, sans-serif`;
    ctx.fillText('PRESS ANY KEY', W / 2, 927 * scale + 10);
  }
  // Creature slot box.
  ctx.strokeStyle = '#e879f9';
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(W * 0.27, 990 * scale, W * 0.46, 110 * scale);
  ctx.setLineDash([]);
  ctx.fillStyle = '#f0abfc';
  ctx.font = `700 ${Math.round(24 * scale * 1.6)}px Trebuchet MS, sans-serif`;
  ctx.fillText(preset.creature.toUpperCase(), W / 2, 990 * scale + 40);
  if (preset.creature === 'Yogiferno' && images.yogiferno) {
    const targetH = 100 * scale;
    const ratio = images.yogiferno.width / images.yogiferno.height;
    ctx.drawImage(
      images.yogiferno,
      W / 2 - (targetH * ratio) / 2,
      990 * scale + 48,
      targetH * ratio,
      targetH,
    );
  } else if (preset.creature !== 'Yogiferno') {
    ctx.fillStyle = '#fde047';
    ctx.font = `${Math.round(18 * scale * 1.6)}px Trebuchet MS, sans-serif`;
    ctx.fillText('Creature cutout: GAP', W / 2, 990 * scale + 84);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `700 ${Math.round(22 * scale * 1.6)}px Trebuchet MS, sans-serif`;
  ctx.fillText('M-HEAVENSENT STUDIOS', W / 2, 1222 * scale + 8);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `${Math.round(16 * scale * 1.6)}px Trebuchet MS, sans-serif`;
  ctx.fillText(`PARTICLES: ${preset.particles.toUpperCase()}`, W / 2, H - 18);
  if (preset.background === 'painted') {
    drawGapLabel(ctx, W, H, ['Painted background: GAP — slate fallback shown.']);
  }
}

export interface CanvasRecording {
  /** Resolves with the recorded file when the duration elapses. */
  done: Promise<Blob>;
  /** Stop early; `done` rejects with an Error('cancelled'). */
  cancel: () => void;
  mimeType: string;
}

/**
 * Record a canvas at real time for `duration` seconds, drawing
 * each frame with `drawFrame(ctx, elapsed)`. The canvas must be
 * in the DOM (the export screens render it visibly) so the user
 * watches the video being recorded. Throws synchronously when
 * MediaRecorder or canvas capture is unavailable.
 */
export function startCanvasRecording(
  canvas: HTMLCanvasElement,
  duration: number,
  drawFrame: (ctx: CanvasRenderingContext2D, elapsed: number) => void,
  onProgress?: (elapsed: number, duration: number) => void,
): CanvasRecording {
  const mimeType = pickExportMimeType();
  if (!mimeType) {
    throw new Error('Video export is not supported in this browser (no MediaRecorder mime type).');
  }
  const stream = (canvas as HTMLCanvasElement & {
    captureStream?: (fps: number) => MediaStream;
  }).captureStream?.(INTRO_EXPORT_FPS);
  if (!stream) {
    throw new Error('Video export is not supported in this browser (canvas capture unavailable).');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Video export failed: canvas 2d context unavailable.');
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, { mimeType });
  let raf = 0;
  let stopped = false;
  let rejectFn: (err: Error) => void = () => undefined;
  const done = new Promise<Blob>((resolve, reject) => {
    rejectFn = reject;
    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = () => reject(new Error('Video recording failed in this browser.'));
  });
  const start = performance.now();
  const tick = () => {
    if (stopped) return;
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed >= duration) {
      drawFrame(ctx, duration);
      onProgress?.(duration, duration);
      stopped = true;
      // One more frame for the recorder to pick up the final draw.
      requestAnimationFrame(() => {
        try { recorder.stop(); } catch { /* already stopped */ }
      });
      return;
    }
    drawFrame(ctx, elapsed);
    onProgress?.(elapsed, duration);
    raf = requestAnimationFrame(tick);
  };
  recorder.start();
  raf = requestAnimationFrame(tick);
  return {
    done,
    mimeType,
    cancel: () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(raf);
      try { recorder.stop(); } catch { /* already stopped */ }
      rejectFn(new Error('cancelled'));
    },
  };
}

/** Trigger a browser download for a recorded blob. */
export function downloadRecordedVideo(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  return url;
}

/** Total seconds an intro preset's export will record for. */
export function introExportDuration(preset: IntroVideoPreset): number {
  return totalDuration(preset);
}
