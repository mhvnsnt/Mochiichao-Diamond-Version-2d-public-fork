/**
 * Menu Editor export — in-game render/video export (Mars 2026-10-26
 * 19:59 + 20:32 CDT: production tooling wired INTO the editor, not
 * agent-only).
 *
 * What runs in the browser (wired here):
 * - Menu PNG: the live menu config drawn to a canvas-2D stage
 *   (1200x1500, the locked canvas) and downloaded as PNG.
 * - Menu video: the same canvas animated over one 5.6s loop and
 *   recorded with the browser's MediaRecorder API to WebM — the
 *   exact route creator Phase 2 (open PR #155, introVideoExport.ts)
 *   uses for intro/start exports. This module does NOT import
 *   that file (it is not on main yet); it reuses the same browser
 *   pattern so the two exports can share one helper after #155
 *   merges, instead of duplicating its whole file here.
 *
 * What does NOT run in the browser (said plainly, with the
 * equivalent): native FFmpeg is a desktop binary — it cannot run
 * inside the web game. The in-game equivalent is the MediaRecorder
 * WebM above; converting it later is one desktop command:
 *   ffmpeg -i menu-export.webm menu-export.mp4
 * Native Blender / ndstool / DSDecmp likewise cannot run in the
 * browser; their in-game equivalents are this canvas renderer
 * (Blender render -> canvas stage render) and nothing for DS ROM
 * tooling (ROM tooling has no menu-editor use — named, not wired).
 */
import type { MenuEditorConfig } from "./menuEditor";
import { transformSymbols } from "./menuEditor";
import { MAIN_MENU_SYMBOLS } from "./mainMenuSymbols";
import menuLogoUrl from "../assets/ui/mochiichao-main-logo-v32-matched.png";
import cloudUrl from "../assets/ui/puffy-cloud.svg";
import mochiiUrl from "../assets/title/mochii-walk-cutout.png";

export const MENU_STAGE_W = 1200;
export const MENU_STAGE_H = 1500;

type Sym = { x: number; y: number; s: number; c: string; shape: string };

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

interface StageAssets {
  logo: HTMLImageElement | null;
  cloud: HTMLImageElement | null;
  mochii: HTMLImageElement | null;
}

export async function loadStageAssets(): Promise<StageAssets> {
  const [logo, cloud, mochii] = await Promise.all([
    loadImage(menuLogoUrl), loadImage(cloudUrl), loadImage(mochiiUrl),
  ]);
  return { logo, cloud, mochii };
}

function fadeAt(cfg: MenuEditorConfig, y: number): number {
  const { gone, mid, full } = cfg.fade;
  if (y >= full) return 1;
  if (y >= mid) return 0.35 + 0.65 * ((y - mid) / (full - mid));
  if (y <= gone) return 0;
  return 0.35 * ((y - gone) / (mid - gone));
}

function drawShape(ctx: CanvasRenderingContext2D, shape: string, s: number, color: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
  } else if (shape === "diamond") {
    ctx.moveTo(0, -s / 2); ctx.lineTo(s / 2, 0); ctx.lineTo(0, s / 2); ctx.lineTo(-s / 2, 0);
  } else if (shape === "star") {
    const q = s * 0.12;
    ctx.moveTo(0, -s / 2);
    ctx.quadraticCurveTo(q, -q, s / 2, 0);
    ctx.quadraticCurveTo(q, q, 0, s / 2);
    ctx.quadraticCurveTo(-q, q, -s / 2, 0);
    ctx.quadraticCurveTo(-q, -q, 0, -s / 2);
  } else {
    // Heart, same 100-box geometry as MainMenuBackground.
    ctx.moveTo(50, 88);
    ctx.bezierCurveTo(20, 60, 5, 40, 5, 25);
    ctx.bezierCurveTo(5, 10, 20, 0, 32, 8);
    ctx.bezierCurveTo(40, 13, 50, 25, 50, 32);
    ctx.bezierCurveTo(50, 25, 60, 13, 68, 8);
    ctx.bezierCurveTo(80, 0, 95, 10, 95, 25);
    ctx.bezierCurveTo(95, 40, 80, 60, 50, 88);
    ctx.closePath();
  }
  ctx.fill();
}

/** Symbols after the editor's field-span remap + count sampling. */
export function editorSymbols(cfg: MenuEditorConfig): Sym[] {
  return transformSymbols(
    MAIN_MENU_SYMBOLS as Sym[],
    cfg.symbols.fieldLeft, cfg.symbols.fieldRight, cfg.symbols.count,
  );
}

function symbolPose(
  cfg: MenuEditorConfig, sym: Sym, index: number, t: number,
): { x: number; y: number; rot: number; opacity: number } {
  const { gone, full } = cfg.fade;
  const span = full + (1500 - full) - gone; // zone gone..1500
  const zone = 1500 - gone;
  void span;
  const phase = index * 2.399963;
  if (cfg.symbols.speed === "slow-rise") {
    const period = [4, 5, 6][index % 3];
    const vy = 8 + (index % 7);
    let y = gone + ((((sym.y - gone - t * vy) % zone) + zone) % zone);
    const sway = 3 + (8 - 3) * ((1500 - y) / zone);
    const x = sym.x + Math.sin((2 * Math.PI * t) / period + phase) * sway;
    const rot = Math.sin((2 * Math.PI * t) / period + phase) * 4;
    return { x, y, rot, opacity: fadeAt(cfg, y) };
  }
  const ang = (2 * Math.PI * cfg.symbols.swayCycles * t) / 5.6 + phase;
  let y = gone + ((((sym.y - gone - t * 157.14) % zone) + zone) % zone);
  const bobAng = (2 * Math.PI * cfg.symbols.bobCycles * t) / 5.6 + phase;
  y = Math.max(gone, y + Math.sin(bobAng) * cfg.symbols.bobPx);
  const x = sym.x + Math.sin(ang) * cfg.symbols.swayPx;
  return { x, y, rot: 0, opacity: fadeAt(cfg, y) };
}

/** Draw one menu frame from a config at time t (seconds). */
export function drawMenuStage(
  ctx: CanvasRenderingContext2D, cfg: MenuEditorConfig,
  assets: StageAssets, t: number,
): void {
  const W = MENU_STAGE_W;
  const H = MENU_STAGE_H;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = cfg.fade.paper;
  ctx.fillRect(0, 0, W, H);
  const orderOf = (id: string): number => {
    const l = cfg.layers[id as keyof typeof cfg.layers];
    return l ? l.order : 99;
  };
  const visible = (id: string): boolean => {
    const l = cfg.layers[id as keyof typeof cfg.layers];
    return l ? l.visible : true;
  };
  // Paint in layer order (lowest first). Arcs + symbols share the
  // background group; emblems sit in their own layer slot.
  const paintOrder = ["arcs", "symbols", "emblems", "logo", "cloud", "mochii", "panels"]
    .sort((a, b) => orderOf(a) - orderOf(b));
  for (const layer of paintOrder) {
    if (!visible(layer)) continue;
    if (layer === "arcs") {
      ctx.lineWidth = cfg.arcs.stroke;
      cfg.arcs.radii.forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cfg.arcs.cx, cfg.arcs.cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = cfg.arcs.colors[i % cfg.arcs.colors.length];
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      cfg.arcs.orbitRx.forEach((rx, i) => {
        ctx.beginPath();
        ctx.ellipse(cfg.arcs.cx, cfg.arcs.cy, rx, cfg.arcs.orbitRy[i] ?? rx, 0, 0, Math.PI * 2);
        ctx.strokeStyle = cfg.arcs.orbitColors[i % cfg.arcs.orbitColors.length];
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    } else if (layer === "symbols") {
      const syms = editorSymbols(cfg);
      syms.forEach((sym, i) => {
        const pose = symbolPose(cfg, sym, i, t);
        ctx.save();
        ctx.translate(pose.x, pose.y);
        ctx.rotate((pose.rot * Math.PI) / 180);
        ctx.globalAlpha = pose.opacity;
        if (sym.shape === "heart") {
          ctx.translate(-sym.s / 2, -sym.s / 2);
          ctx.scale(sym.s / 100, sym.s / 100);
          drawShape(ctx, "heart", 100, sym.c);
        } else {
          drawShape(ctx, sym.shape, sym.s, sym.c);
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    } else if (layer === "emblems") {
      for (const e of cfg.emblems) {
        if (!e.visible) continue;
        ctx.save();
        ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
        if (e.kind === "heart") {
          ctx.translate(-e.w / 2, -e.h / 2);
          ctx.scale(e.w / 100, e.h / 100);
          drawShape(ctx, "heart", 100, e.color);
        } else if (e.kind === "star") {
          drawShape(ctx, "star", Math.min(e.w, e.h), e.color);
        } else {
          drawShape(ctx, "circle", Math.min(e.w, e.h), e.color);
        }
        ctx.restore();
      }
    } else if (layer === "logo") {
      if (assets.logo) ctx.drawImage(assets.logo, cfg.logo.x, cfg.logo.y, cfg.logo.w, cfg.logo.w * (assets.logo.height / assets.logo.width));
    } else if (layer === "cloud") {
      if (assets.cloud) {
        const bob = cfg.cloud.bobOn ? Math.sin((2 * Math.PI * t) / cfg.cloud.bobPeriod) * -cfg.cloud.bobAmp : 0;
        ctx.drawImage(assets.cloud, cfg.cloud.frameX, cfg.cloud.frameY + bob, cfg.cloud.frameW, cfg.cloud.frameH);
      }
    } else if (layer === "mochii") {
      if (assets.mochii) ctx.drawImage(assets.mochii, cfg.mochii.x, cfg.mochii.y, cfg.mochii.w, cfg.mochii.h);
    } else if (layer === "panels") {
      const keys: ("CONTINUE" | "NEW GAME" | "SETTINGS" | "BACK TO TITLE")[] =
        ["CONTINUE", "NEW GAME", "SETTINGS", "BACK TO TITLE"];
      for (const key of keys) {
        const p = cfg.panels[key];
        ctx.fillStyle = p.fill;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = cfg.panelStyle.borderWidth;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, p.h, cfg.panelStyle.borderRadius);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.font = `800 ${p.labelSize}px "Trebuchet MS", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, p.x + p.w / 2, p.y + p.h / 2);
        if (key === "CONTINUE") {
          ctx.font = `19px "Trebuchet MS", Arial, sans-serif`;
          ctx.fillText(cfg.continueSublabel, p.x + p.w / 2, p.y + p.h / 2 + 32);
        }
      }
    }
  }
}

function pickMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
  for (const m of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(m)) return m;
    } catch { /* ignore */ }
  }
  return null;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Export the current menu config as a PNG still (one frame). */
export async function exportMenuPng(cfg: MenuEditorConfig, filename: string): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = MENU_STAGE_W;
  canvas.height = MENU_STAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");
  const assets = await loadStageAssets();
  drawMenuStage(ctx, cfg, assets, 0.8);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG export produced no data.");
  downloadBlob(blob, filename);
}

/** Record one 5.6s loop of the animated menu to WebM. */
export async function recordMenuVideo(
  cfg: MenuEditorConfig, filename: string, seconds = 5.6,
  onProgress?: (done: boolean) => void,
): Promise<void> {
  const mime = pickMimeType();
  if (!mime) throw new Error("Video export is not supported in this browser (no MediaRecorder mime type).");
  const canvas = document.createElement("canvas");
  canvas.width = MENU_STAGE_W;
  canvas.height = MENU_STAGE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available in this browser.");
  const assets = await loadStageAssets();
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: mime });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  const done = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  recorder.start();
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      drawMenuStage(ctx, cfg, assets, t);
      if (t < seconds) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
  recorder.stop();
  await done;
  const ext = mime.includes("mp4") ? "mp4" : "webm";
  downloadBlob(new Blob(chunks, { type: mime }), filename.replace(/\.webm$|\.mp4$/, "") + `.${ext}`);
  onProgress?.(true);
}
