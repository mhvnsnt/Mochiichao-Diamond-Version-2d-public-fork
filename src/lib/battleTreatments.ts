// battleTreatments.ts — DROP-IN TARGET: copy this file to
// src/lib/battleTreatments.ts in the PR batch (do NOT edit it in place
// here; this staging copy is the source). Typed port of
// sprite-art/animation/treatments/battleTreatments.js, same constants,
// same functions, same determinism. If the JS module changes, regenerate
// this file and diff TIMING/SEVERITY — a drift between the two is a bug.
// No game imports, no DOM, no Math.random in the sampled path.

export const FPS = 60;

export const TIMING = Object.freeze({
  FPS,
  WINDUP_MS: 250,
  IMPACT_HOLD_MS: 90,
  RECOIL_MS: 300,
  RECOVER_MS: 400,
  FLASH_MS: 100,
  SHAKE_MS: 350,
  CAMERA_PUSH_MS: 340,
  PARTICLE_MS: 450,
});

export type SeverityLabel = 'light' | 'medium' | 'heavy' | 'critical';
export interface Severity {
  maxFraction: number; recoilPx: number; shakePx: number;
  flash: 'white' | 'red'; particles: number; cameraPush: number; label: SeverityLabel;
}
export const SEVERITY: Record<string, Severity> = Object.freeze({
  LIGHT: Object.freeze({ maxFraction: 0.15, recoilPx: 10, shakePx: 2, flash: 'white', particles: 6, cameraPush: 1.04, label: 'light' }),
  MEDIUM: Object.freeze({ maxFraction: 0.35, recoilPx: 18, shakePx: 4, flash: 'white', particles: 12, cameraPush: 1.08, label: 'medium' }),
  HEAVY: Object.freeze({ maxFraction: 0.6, recoilPx: 28, shakePx: 7, flash: 'white', particles: 20, cameraPush: 1.14, label: 'heavy' }),
  CRITICAL: Object.freeze({ maxFraction: Infinity, recoilPx: 38, shakePx: 10, flash: 'red', particles: 28, cameraPush: 1.2, label: 'critical' }),
} as Record<string, Severity>);

export const HURT_FRAME = Object.freeze({ HOLD_MS: TIMING.RECOIL_MS + TIMING.RECOVER_MS / 2 });

function clamp01(v: number): number { return v < 0 ? 0 : v > 1 ? 1 : v; }
function easeOutCubic(t: number): number { const u = clamp01(t); return 1 - Math.pow(1 - u, 3); }
function easeInOutQuad(t: number): number {
  const u = clamp01(t);
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}
function deterministicUnit(seed: number, index: number): number {
  let h = (seed * 374761393 + index * 668265263) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0; h = (h * 1274126177) >>> 0; h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

export function severityFor(damageFraction: number, isCrit: boolean): Severity {
  const f = typeof damageFraction === 'number' && isFinite(damageFraction) ? Math.max(0, damageFraction) : 0;
  if (isCrit || f > SEVERITY.HEAVY.maxFraction) return SEVERITY.CRITICAL;
  if (f <= SEVERITY.LIGHT.maxFraction) return SEVERITY.LIGHT;
  if (f <= SEVERITY.MEDIUM.maxFraction) return SEVERITY.MEDIUM;
  return SEVERITY.HEAVY;
}

export interface HitPhase {
  phase: string; startMs: number; endMs: number;
  cameraPush?: number; flash?: string; flashMs?: number;
  recoilPx?: number; direction?: number; hurtFrameHeld?: boolean; hurtFrameHeldUntilMs?: number;
}
export interface Particle { index: number; angleRad: number; speedPxPerSec: number; sizePx: number; lifeMs: number; startMs: number; }
export interface HitTimeline {
  severity: SeverityLabel; flash: 'white' | 'red'; direction: 1 | -1; totalMs: number;
  phases: HitPhase[];
  shake: { startMs: number; durationMs: number; amplitudePx: number };
  particles: Particle[];
  camera: { focus: 'attacker'; subject: 'attacker'; pushStartMs: number; pushEndMs: number; zoom: number; releaseEndMs: number };
}
export function buildHitTimeline(options: { damageFraction?: number; isCrit?: boolean; direction?: number; seed?: number } = {}): HitTimeline {
  const sev = severityFor(options.damageFraction ?? 0, !!options.isCrit);
  const dir = options.direction === -1 ? -1 : 1;
  const seed = typeof options.seed === 'number' ? Math.floor(options.seed) : 1;
  const tImpact = TIMING.WINDUP_MS;
  const tRecoilEnd = tImpact + TIMING.IMPACT_HOLD_MS + TIMING.RECOIL_MS;
  const tEnd = tRecoilEnd + TIMING.RECOVER_MS;
  return Object.freeze({
    severity: sev.label, flash: sev.flash, direction: dir, totalMs: tEnd,
    phases: Object.freeze([
      Object.freeze({ phase: 'windup', startMs: 0, endMs: tImpact, cameraPush: sev.cameraPush }),
      Object.freeze({ phase: 'impact_hold', startMs: tImpact, endMs: tImpact + TIMING.IMPACT_HOLD_MS, flash: sev.flash, flashMs: TIMING.FLASH_MS }),
      Object.freeze({ phase: 'recoil', startMs: tImpact + TIMING.IMPACT_HOLD_MS, endMs: tRecoilEnd, recoilPx: sev.recoilPx, direction: dir, hurtFrameHeld: true }),
      Object.freeze({ phase: 'recover', startMs: tRecoilEnd, endMs: tEnd, hurtFrameHeldUntilMs: tImpact + TIMING.IMPACT_HOLD_MS + HURT_FRAME.HOLD_MS }),
    ]),
    shake: Object.freeze({ startMs: tImpact, durationMs: TIMING.SHAKE_MS, amplitudePx: sev.shakePx }),
    particles: buildParticleBurst({ count: sev.particles, seed, startMs: tImpact, direction: dir }),
    camera: Object.freeze({ focus: 'attacker' as const, subject: 'attacker' as const, pushStartMs: 0, pushEndMs: TIMING.CAMERA_PUSH_MS, zoom: sev.cameraPush, releaseEndMs: tEnd }),
  }) as HitTimeline;
}

export interface HitPose {
  tMs: number; defenderOffsetX: number; defenderOffsetY: number; defenderRotationDeg: number;
  flash: number; flashColor: 'white' | 'red'; cameraZoom: number; cameraFocus: 'attacker';
  shakeX: number; shakeY: number; defenderArt: 'hurt' | 'standing'; frozen: boolean;
}
export function sampleHitPose(tMs: number, timeline?: HitTimeline): HitPose {
  const t = typeof tMs === 'number' ? tMs : 0;
  const tl = timeline || buildHitTimeline({});
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const impact = TIMING.WINDUP_MS;
  const recoilStart = impact + TIMING.IMPACT_HOLD_MS;
  const recoilEnd = recoilStart + TIMING.RECOIL_MS;
  const end = recoilEnd + TIMING.RECOVER_MS;
  let offsetX = 0, offsetY = 0, rotationDeg = 0;
  if (t >= recoilStart && t < recoilEnd) {
    const p = easeOutCubic((t - recoilStart) / TIMING.RECOIL_MS);
    offsetX = tl.direction * sev.recoilPx * p; offsetY = -2 * p; rotationDeg = tl.direction * 4 * p;
  } else if (t >= recoilEnd && t < end) {
    const p = easeOutCubic((t - recoilEnd) / TIMING.RECOVER_MS);
    offsetX = tl.direction * sev.recoilPx * (1 - p); offsetY = -2 * (1 - p); rotationDeg = tl.direction * 4 * (1 - p);
  }
  const flash = t >= impact && t < impact + TIMING.FLASH_MS ? 1 - (t - impact) / TIMING.FLASH_MS : 0;
  let cameraZoom = 1;
  if (t < TIMING.CAMERA_PUSH_MS) {
    cameraZoom = 1 + (sev.cameraPush - 1) * easeInOutQuad(t / TIMING.CAMERA_PUSH_MS);
  } else if (t < recoilEnd) {
    cameraZoom = sev.cameraPush;
  } else if (t < end) {
    cameraZoom = sev.cameraPush - (sev.cameraPush - 1) * easeInOutQuad((t - recoilEnd) / TIMING.RECOVER_MS);
  }
  const shake = shakeOffsetAt(t, tl);
  const hurtUntil = recoilStart + HURT_FRAME.HOLD_MS;
  return Object.freeze({
    tMs: t, defenderOffsetX: offsetX, defenderOffsetY: offsetY, defenderRotationDeg: rotationDeg,
    flash, flashColor: sev.flash, cameraZoom, cameraFocus: 'attacker' as const,
    shakeX: shake.x, shakeY: shake.y,
    defenderArt: (t >= recoilStart && t < hurtUntil ? 'hurt' : 'standing') as 'hurt' | 'standing',
    frozen: t >= impact && t < recoilStart,
  });
}

export function shakeOffsetAt(tMs: number, timeline?: HitTimeline): { x: number; y: number } {
  const tl = timeline || buildHitTimeline({});
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const start = TIMING.WINDUP_MS;
  const t = (typeof tMs === 'number' ? tMs : 0) - start;
  if (t < 0 || t >= TIMING.SHAKE_MS) return Object.freeze({ x: 0, y: 0 });
  const decay = 1 - t / TIMING.SHAKE_MS;
  const phase = t / 16.7;
  return Object.freeze({
    x: sev.shakePx * decay * Math.sin(phase * 2.1),
    y: sev.shakePx * 0.6 * decay * Math.cos(phase * 1.7),
  });
}

export function buildParticleBurst(options: { count?: number; seed?: number; startMs?: number; direction?: number } = {}): Particle[] {
  const count = Math.max(0, Math.floor(options.count || 0));
  const seed = typeof options.seed === 'number' ? Math.floor(options.seed) : 1;
  const startMs = options.startMs || 0;
  const dir = options.direction === -1 ? -1 : (options.direction === 1 ? 1 : 0);
  const dirAngle = dir === -1 ? Math.PI : 0;
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    let a = deterministicUnit(seed, i * 3) * Math.PI * 2;
    if (dir !== 0) {
      let diff = a - dirAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      a = dirAngle + diff * 0.5;
    }
    out.push(Object.freeze({
      index: i, angleRad: a, speedPxPerSec: 60 + deterministicUnit(seed, i * 3 + 1) * 180,
      sizePx: 2 + deterministicUnit(seed, i * 3 + 2) * 4, lifeMs: TIMING.PARTICLE_MS, startMs,
    }));
  }
  return Object.freeze(out) as Particle[];
}

export interface RigPose {
  rootOffsetX: number; rootOffsetY: number; spineLeanDeg: number; headPitchDeg: number;
  cameraDollyM: number; cameraFocus: 'attacker'; hurtPoseWeight: number;
  flash: number; flashColor: 'white' | 'red'; frozen: boolean;
}
export function mapTo3D(timeline: HitTimeline, pose: HitPose): RigPose {
  const tl = timeline || buildHitTimeline({});
  const p = pose || sampleHitPose(0, tl);
  const sev = SEVERITY[tl.severity.toUpperCase()];
  const pxToRig = 0.01;
  const recoilFrac = sev.recoilPx === 0 ? 0 : Math.abs(p.defenderOffsetX) / sev.recoilPx;
  return Object.freeze({
    rootOffsetX: p.defenderOffsetX * pxToRig,
    rootOffsetY: -p.defenderOffsetY * pxToRig, // screen Y down -> rig Y up
    spineLeanDeg: p.defenderRotationDeg * 2.5,
    headPitchDeg: p.defenderArt === 'hurt' ? -12 * recoilFrac - 4 : 0,
    cameraDollyM: (p.cameraZoom - 1) * 2.0,
    cameraFocus: 'attacker' as const,
    hurtPoseWeight: p.defenderArt === 'hurt' ? 1 : 0,
    flash: p.flash, flashColor: p.flashColor, frozen: p.frozen,
  });
}
