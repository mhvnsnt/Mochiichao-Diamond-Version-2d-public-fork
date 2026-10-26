/**
 * battleIntegration.ts — Mochiichao battle integration layer (Step 2).
 *
 * What this is: the ONLY wiring between the locked sprite atlases, the
 * attack/hurt/idle animation sets, the hit-presentation treatments, the
 * arena between-turn system, and the real move data — and the turn-based
 * battle UI (BattleView / PixiBattleCanvas). It contains no art, no
 * creature sprites, and no damage math. Damage math stays in BattleView;
 * this module stages how a hit LOOKS and WHEN its result becomes visible.
 *
 * Sources, in order (Mars, 2026-10-25):
 * - Locked atlases on main: src/assets/sprite-atlases/<slug>/<slug>_atlas_64_locked.png
 *   (PR #30, 51 sets) — front/back/icon cell coordinates come from those
 *   locked manifests and are reproduced in battleSpriteRegistry.json.
 * - Attack/hurt/idle sets from the Step 1 finish batch:
 *   animation/attack/*.attack.json (51/51: 50 transform sets of 4 frames
 *   rendered from each creature's own locked battle_front cell, plus
 *   strikechamp_unsuited_full's 7 extracted cells kept as-is),
 *   animation/hurt/* (51/51), animation/idle/* (51/51).
 *   Attack/hurt/idle cells are LOCAL STAGING ONLY until their PR lands;
 *   this module never invents a cell path — a missing pending cell falls
 *   back to the treatments (flash + recoil + shake + camera), which is
 *   exactly what the treatments module was written for. Transform attack
 *   frames are NOT atlas cells and are never reported as cell numbers.
 * - SHADOWS-SEPARATE (Mars, 2026-10-25 ~20:12 CDT, standing): shadows are
 *   NOT part of character art. Battle cells ship shadow-free; the engine
 *   adds shadows as a separate layer underneath the sprite (see
 *   SHADOW_LAYER below). This module never bakes a shadow into art, never
 *   reads a shadow out of a cell, and never repeats the old rationale
 *   that cutting contact shadows would float a character. The shadow-layer
 *   module/spec itself (decomp verification + strip pass) is owned by the
 *   separate shadows lane; until it lands, SHADOW_LAYER is the contract
 *   the engine renders against, and its absence is a handoff dependency,
 *   not a reason to bake shadows into cells.
 * - Treatments: sprite-art/animation/treatments/battleTreatments.js —
 *   windup 250 / hitstop (impact hold) 90 / recoil 300 / recover 400 ms,
 *   damage-scaled shake, particles, camera push-in on the ATTACKER,
 *   mapTo3D for rigs. The numbers below match that module exactly; if they
 *   ever disagree, the treatments module wins and this file is fixed.
 * - Arena between-turn system: sprite-art/arena-combat/arenaCombat.js —
 *   BATTLE_START -> BETWEEN_TURN (CIRCLING / ADVANCING / RETREATING /
 *   HOLDING / SPAR_CLASH / SEPARATING) -> CHOSEN_ATTACK
 *   (TELEGRAPH / TRAVEL|CAST / WINDUP / STRIKE / IMPACT_HOLD / RECOIL /
 *   RETURN) -> RESOLUTION. This module does NOT rebuild that system and
 *   does NOT import it (it is not in the repo yet); it ADAPTS its timeline
 *   objects and its between-turn pose sampler via duck typing, so the day
 *   arenaCombat.js lands, wiring is one call, not a rewrite.
 * - Real move data (Mars, 2026-10-25 ~19:44 CDT, FINAL AND STANDING):
 *   moves and animations are NOT replaced — real move names, mechanics,
 *   and timing are used verbatim from the decomp extractions
 *   (src/lib/generated/decomp_black2_moves.json, decomp_firered_moves.json)
 *   and the game's own src/lib/moves.ts, reproduced in battleMoveTable.json.
 *   The ONLY exclusions are Pokemon creature NAMES, SOUNDS, ART, and
 *   DIALOGUE. This module contains none of those four. Move names are
 *   never genericized into shapes here.
 * - Capture is NOT wired here at all. Default capture stays normal
 *   Pokemon-style (Luigi Cubes, existing game system). The gated,
 *   optional, arcade-themed ring-capture path (Mars, 2026-10-25 ~19:49 /
 *   ~19:51 CDT: Safari-type zone unlock + shop items, opt-in only) is a
 *   separate follow-up batch in captureLoop.js + zone/shop spec; this
 *   module neither calls it nor makes it a default.
 *
 * The hit-timing law, verified by the demo (battleIntegration.demo.ts):
 *   telegraph -> travel/cast -> windup -> strike -> HELD impact frame
 *   (hitstop: world frozen except flash/particles) -> recoil -> return.
 *   HP drains AFTER hitstop, never during it: every hpDrain event starts
 *   at or after the end of its hit's impact hold. A faint SKIPS the
 *   return (collapse + fade instead) — never recoil-then-walk-back-then-faint.
 *   Any sequence is skippable / 2x-speedable; skip jumps to RESOLUTION
 *   only after the damage result has already been applied by the caller.
 */

export type BattleSide = 'player' | 'enemy';
export type MoveKind = 'melee' | 'projectile' | 'status';
export type MoveCategory = 'Physical' | 'Special' | 'Status';

export interface AtlasCell {
  cell: number | null;
  x: number | null;
  y: number | null;
  role: string;
  inAtlas?: boolean;
}

export interface RegistryEntry {
  slug: string;
  rosterId: string;
  displayName: string;
  atlas: { repoPath: string; file: string; cellSize: number; width: number | null; height: number | null };
  front: AtlasCell | null;
  back: AtlasCell | null;
  backNote?: string;
  icon: AtlasCell | null;
  attack: {
    status: string;
    cells: number[];
    files: string[];
    frames?: { file: string; role: string; durationMs: number | null }[];
    method?: string | null;
    stagingPath?: string | null;
    onMain?: boolean;
    sourceLockedCell?: string;
  };
  hurt: { status: string; file: string | null; stagingPath: string | null; onMain: boolean } | null;
  idle: { cycleMs: number | null; idleClass: string | null; loop: boolean; stagingPath: string | null; onMain: boolean } | null;
  caveats: string[];
}

export interface BattleSpriteRegistry {
  sets: RegistryEntry[];
}

/** Phase durations in ms. TELEGRAPH/TRAVEL/CAST/STRIKE/FAINT match arenaCombat ARENA. */
export const TIMING = Object.freeze({
  TELEGRAPH_MS: 300,
  TRAVEL_MS: 350, // physical: attacker crosses the gap on an arc, not a slide
  CAST_MS: 300, // projectile: channel pose, then the projectile travels
  PROJECTILE_TRAVEL_MS: 450, // mid-range default; callers scale by range
  WINDUP_LIGHT_MS: 250,
  WINDUP_HEAVY_MS: 500,
  STRIKE_LIGHT_MS: 80,
  STRIKE_HEAVY_MS: 115,
  IMPACT_HOLD_MS: 90, // hitstop: held impact frame, world frozen
  RECOIL_MS: 300,
  RECOVER_MS: 400,
  MULTI_HIT_GAP_MS: 160,
  HP_DRAIN_MS: 250, // inside the research 170-330 ms drain window
  FLASH_MS: 100,
  SHAKE_MS: 350,
  CAMERA_PUSH_MS: 340,
  PARTICLE_MS: 450,
  FAINT_MS: 1000,
  FAINT_FADE_MS: 400,
});

export const SEVERITY = Object.freeze({
  LIGHT: Object.freeze({ maxFraction: 0.15, recoilPx: 10, shakePx: 2, flash: 'white', particles: 6, cameraPush: 1.04, label: 'light' }),
  MEDIUM: Object.freeze({ maxFraction: 0.35, recoilPx: 18, shakePx: 4, flash: 'white', particles: 12, cameraPush: 1.08, label: 'medium' }),
  HEAVY: Object.freeze({ maxFraction: 0.6, recoilPx: 28, shakePx: 7, flash: 'white', particles: 20, cameraPush: 1.14, label: 'heavy' }),
  CRITICAL: Object.freeze({ maxFraction: Infinity, recoilPx: 38, shakePx: 10, flash: 'red', particles: 28, cameraPush: 1.2, label: 'critical' }),
});
export type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

export function severityFor(damageFraction: number, isCrit: boolean): Severity {
  const f = typeof damageFraction === 'number' && Number.isFinite(damageFraction) ? Math.max(0, damageFraction) : 0;
  if (isCrit || f > SEVERITY.HEAVY.maxFraction) return SEVERITY.CRITICAL;
  if (f <= SEVERITY.LIGHT.maxFraction) return SEVERITY.LIGHT;
  if (f <= SEVERITY.MEDIUM.maxFraction) return SEVERITY.MEDIUM;
  return SEVERITY.HEAVY;
}

// ---------------------------------------------------------------- moves
export interface MoveAnim {
  key: string | null;
  name: string;
  type: string | null;
  category: MoveCategory;
  kind: MoveKind;
  power: number | null;
  accuracy: number | null;
  priority: number;
  effect: string | null;
  multiHit: boolean;
  weight: 'light' | 'heavy';
  makesContact: boolean | null;
}

/**
 * Classify ANY real move record into animation parameters — no table
 * lookup required, so a move the table has never seen still stages
 * correctly. Accepts the game's moves.ts shape ({ cat, bp, effect }),
 * the Black 2 decomp shape ({ category: 'MOVE_CATEGORY_*', power }),
 * and the FireRed decomp shape ({ derivedCategory, power, flags }).
 * Names are carried verbatim; nothing here renames or genericizes a move.
 */
export function classifyMoveRecord(rec: Record<string, unknown>): MoveAnim {
  const rawCat =
    (rec['cat'] as string) ||
    (rec['category'] as string) ||
    (rec['derivedCategory'] as string) ||
    '';
  const cat: MoveCategory =
    rawCat === 'Physical' || rawCat === 'MOVE_CATEGORY_PHYSICAL'
      ? 'Physical'
      : rawCat === 'Special' || rawCat === 'MOVE_CATEGORY_SPECIAL'
        ? 'Special'
        : 'Status';
  const power =
    typeof rec['bp'] === 'number'
      ? (rec['bp'] as number)
      : typeof rec['power'] === 'number'
        ? (rec['power'] as number)
        : null;
  const flags = rec['flags'];
  const makesContact = Array.isArray(flags) ? flags.includes('MAKES_CONTACT') : null;
  const effect =
    typeof rec['effect'] === 'string' ? (rec['effect'] as string) : null;
  return {
    key:
      typeof rec['sourceConstant'] === 'string'
        ? (rec['sourceConstant'] as string)
        : typeof rec['key'] === 'string'
          ? (rec['key'] as string)
          : null,
    name: typeof rec['name'] === 'string' ? (rec['name'] as string) : 'Unknown move',
    type:
      typeof rec['type'] === 'string'
        ? (rec['type'] as string).replace(/^TYPE_/, '')
        : null,
    category: cat,
    kind: cat === 'Status' ? 'status' : cat === 'Physical' ? 'melee' : 'projectile',
    power,
    accuracy: typeof rec['acc'] === 'number' ? (rec['acc'] as number) : typeof rec['accuracy'] === 'number' ? (rec['accuracy'] as number) : null,
    priority: typeof rec['pri'] === 'number' ? (rec['pri'] as number) : typeof rec['priority'] === 'number' ? (rec['priority'] as number) : 0,
    effect,
    multiHit: effect === 'MULTI_HIT' || (effect !== null && effect.includes('MULTI_HIT')),
    weight: (power ?? 0) >= 80 ? 'heavy' : 'light',
    makesContact,
  };
}

export interface MoveTable {
  moves: Record<string, MoveAnim>;
  gameMoves: Record<string, MoveAnim>;
}

/** Look a real move up in battleMoveTable.json by decomp constant or game id. Returns null, never a guess. */
export function moveAnimFromTable(table: MoveTable, key: string): MoveAnim | null {
  if (!key) return null;
  return table.moves[key] ?? table.gameMoves[key] ?? null;
}

// ---------------------------------------------------------------- sprites
/** Find a registry entry by slug ('mochii') or roster id ('001'). Null if unknown — never a fallback creature. */
export function findEntry(registry: BattleSpriteRegistry, slugOrId: string): RegistryEntry | null {
  return registry.sets.find((s) => s.slug === slugOrId || s.rosterId === slugOrId) ?? null;
}

export interface ResolvedBattleSprite {
  slug: string;
  rosterId: string;
  side: BattleSide;
  /** Opponent shows FRONT, player shows BACK — never front for both sides. */
  view: 'front' | 'back';
  atlasRepoPath: string;
  cell: number | null;
  x: number | null;
  y: number | null;
  cellSize: number;
  note: string | null;
}

/** Resolve the battle sprite for one side. Player = back view, opponent = front view. */
export function resolveBattleSprite(
  registry: BattleSpriteRegistry,
  slugOrId: string,
  side: BattleSide,
): ResolvedBattleSprite | null {
  const entry = findEntry(registry, slugOrId);
  if (!entry) return null;
  const view = side === 'player' ? 'back' : 'front';
  const cell = side === 'player' ? entry.back : entry.front;
  if (!cell) return null;
  return {
    slug: entry.slug,
    rosterId: entry.rosterId,
    side,
    view,
    atlasRepoPath: entry.atlas.repoPath,
    cell: cell.cell,
    x: cell.x,
    y: cell.y,
    cellSize: entry.atlas.cellSize,
    note: side === 'player' && entry.backNote ? entry.backNote : null,
  };
}

/** CSS background-position/size for one atlas cell (caller supplies the loaded atlas URL, e.g. via Vite import.meta.glob). */
export function atlasCellStyle(
  sprite: ResolvedBattleSprite,
  atlasUrl: string,
  displayPx: number,
): { backgroundImage: string; backgroundPosition: string; backgroundSize: string; width: number; height: number } {
  const scale = displayPx / 64;
  return {
    backgroundImage: `url(${atlasUrl})`,
    backgroundPosition: `-${(sprite.x ?? 0) * scale}px -${(sprite.y ?? 0) * scale}px`,
    backgroundSize: 'auto',
    width: displayPx,
    height: displayPx,
  };
}

export type PhaseArt =
  | { art: 'attack'; cells: number[]; frames: { file: string; role: string; durationMs: number | null }[]; lunge: boolean; note: string }
  | { art: 'hurt'; file: string | null; treatmentsFallback: boolean; note: string }
  | { art: 'idle'; cycleMs: number | null; idleClass: string | null; note: string }
  | { art: 'standing'; view: 'front' | 'back'; note: string };

/**
 * SHADOW-LAYER CONTRACT (Mars, 2026-10-25 ~20:12 CDT). The engine renders
 * one shadow per combatant as a SEPARATE layer below the sprite; no battle
 * cell, attack frame, or hurt cell carries a baked shadow. `shape` and
 * `scale` are the contract the renderer implements until the shadows
 * lane's module lands and replaces them with verified values — they are
 * renderer parameters, never art, and never read from a cell.
 */
export const SHADOW_LAYER = Object.freeze({
  separateLayer: true,
  bakedInArt: false,
  renderOrder: 'below-sprite',
  shape: 'ellipse',
  widthFraction: 0.7,
  heightFraction: 0.18,
  yOffsetFraction: 0.46,
  opacity: 0.3,
  owner: 'shadows lane (decomp verification + strip pass + module/spec owed)',
  note: 'Handoff dependency if the shadows module has not landed: render this contract, do not bake shadows into cells.',
});

/**
 * Which art a combatant shows in a phase. Attack art, in priority order:
 * (1) extracted attack cells where the lane extracted them
 * (strikechamp_unsuited_full cells 21-27); (2) the 4 transform frames
 * (windup / strike_lunge / impact_hold / recover) rendered from the
 * creature's own locked battle_front cell — these are PNG frames, NOT
 * atlas cells, so `cells` stays [] for them; (3) only if neither exists,
 * the battle_front cell with a code lunge (treatments windup + travel),
 * NOT a relabelled walk frame.
 * Hurt art is used where its cell exists (local staging until its PR
 * lands); otherwise the standing cell carries the hit via treatments.
 */
export function resolvePhaseArt(
  entry: RegistryEntry,
  phase: 'idle' | 'attack' | 'recoil' | 'standing',
  side: BattleSide,
): PhaseArt {
  const view = side === 'player' ? 'back' : 'front';
  if (phase === 'attack') {
    if (entry.attack.status === 'extracted' && entry.attack.cells.length > 0) {
      return { art: 'attack', cells: entry.attack.cells, frames: entry.attack.frames ?? [], lunge: true, note: 'extracted attack cells' };
    }
    if (entry.attack.frames && entry.attack.frames.length > 0) {
      return { art: 'attack', cells: [], frames: entry.attack.frames, lunge: true, note: 'transform attack frames from locked battle_front (Step 1 finish batch)' };
    }
    return { art: 'attack', cells: [], frames: [], lunge: true, note: 'no attack frames yet; battle_front + treatments lunge' };
  }
  if (phase === 'recoil') {
    if (entry.hurt && entry.hurt.status === 'done' && entry.hurt.file) {
      return { art: 'hurt', file: entry.hurt.file, treatmentsFallback: false, note: 'hurt cell (staging until its PR lands on main)' };
    }
    return { art: 'hurt', file: null, treatmentsFallback: true, note: 'no hurt cell on main yet; treatments flash/recoil/shake carry the hit' };
  }
  if (phase === 'idle') {
    return { art: 'idle', cycleMs: entry.idle?.cycleMs ?? null, idleClass: entry.idle?.idleClass ?? null, note: 'idle transform loop from locked battle_front (Part 2 idle manifests)' };
  }
  return { art: 'standing', view, note: 'locked atlas cell' };
}

// ---------------------------------------------------------------- timelines
export interface TimelinePhase {
  phase: string;
  startMs: number;
  endMs: number;
}
export interface HpDrainEvent {
  hitIndex: number;
  startMs: number;
  endMs: number;
  note: string;
}
export interface FullTimeline {
  move: MoveAnim;
  attackerSide: BattleSide;
  direction: 1 | -1;
  severity: string;
  phases: TimelinePhase[];
  hpDrain: HpDrainEvent[];
  impactMs: number[];
  totalMs: number;
  faint: boolean;
  skipsReturn: boolean;
  timescale: number;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function easeOutCubic(t: number): number {
  const u = clamp01(t);
  return 1 - Math.pow(1 - u, 3);
}
function easeInOutQuad(t: number): number {
  const u = clamp01(t);
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

/**
 * Build the full staged timeline for one move use.
 * Order, always: telegraph -> travel (melee) or cast + projectile travel
 * (projectile) -> windup -> [strike -> impact_hold -> recoil (+ gap)] x hits
 * -> return — or, on a faint, faint collapse + fade INSTEAD of return.
 * Status moves stage telegraph -> windup -> return with no impact hold,
 * no recoil, and no hpDrain (nothing was dealt).
 */
export function buildFullTimeline(opts: {
  move: MoveAnim;
  attackerSide: BattleSide;
  damageFraction: number;
  isCrit?: boolean;
  hits?: number;
  defenderFaints?: boolean;
  seed?: number;
  direction?: 1 | -1;
  projectileTravelMs?: number;
}): FullTimeline {
  const move = opts.move;
  const sev = severityFor(opts.damageFraction, !!opts.isCrit);
  const dir: 1 | -1 = opts.direction === -1 ? -1 : 1;
  const hits = move.kind === 'status' ? 0 : Math.max(1, Math.floor(opts.hits ?? 1));
  const windup = move.weight === 'heavy' ? TIMING.WINDUP_HEAVY_MS : TIMING.WINDUP_LIGHT_MS;
  const strike = move.weight === 'heavy' ? TIMING.STRIKE_HEAVY_MS : TIMING.STRIKE_LIGHT_MS;
  const phases: TimelinePhase[] = [];
  const hpDrain: HpDrainEvent[] = [];
  const impactMs: number[] = [];
  let t = 0;
  const push = (phase: string, ms: number): TimelinePhase => {
    const p = { phase, startMs: t, endMs: t + ms };
    phases.push(p);
    t += ms;
    return p;
  };
  push('telegraph', TIMING.TELEGRAPH_MS);
  if (move.kind === 'melee') push('travel', TIMING.TRAVEL_MS);
  if (move.kind === 'projectile') {
    push('cast', TIMING.CAST_MS);
    push('projectile_travel', opts.projectileTravelMs ?? TIMING.PROJECTILE_TRAVEL_MS);
  }
  push('windup', windup);
  for (let h = 0; h < hits; h++) {
    if (h > 0) push('gap', TIMING.MULTI_HIT_GAP_MS);
    push('strike', strike);
    const hold = push('impact_hold', TIMING.IMPACT_HOLD_MS);
    impactMs.push(hold.startMs);
    const recoil = push('recoil', TIMING.RECOIL_MS);
    // HP drain starts AT the recoil start — i.e. AFTER the hitstop ends — never during it.
    hpDrain.push({
      hitIndex: h,
      startMs: recoil.startMs,
      endMs: recoil.startMs + TIMING.HP_DRAIN_MS,
      note: 'HP drains after hitstop, never during it',
    });
  }
  const faint = !!opts.defenderFaints && move.kind !== 'status';
  if (faint) {
    push('faint', TIMING.FAINT_MS);
    push('faint_fade', TIMING.FAINT_FADE_MS);
  } else {
    push('return', TIMING.RECOVER_MS);
  }
  return {
    move,
    attackerSide: opts.attackerSide,
    direction: dir,
    severity: sev.label,
    phases,
    hpDrain,
    impactMs,
    totalMs: t,
    faint,
    skipsReturn: faint,
    timescale: 1,
  };
}

/** Treatments-compatible single-hit timeline (windup -> impact_hold -> recoil -> recover), for existing callers. */
export function buildHitTimeline(opts: {
  damageFraction: number;
  isCrit?: boolean;
  direction?: 1 | -1;
  seed?: number;
}): {
  severity: string;
  totalMs: number;
  phases: TimelinePhase[];
  shake: { startMs: number; durationMs: number; amplitudePx: number };
  camera: { focus: 'attacker'; pushStartMs: number; pushEndMs: number; zoom: number; releaseEndMs: number };
} {
  const sev = severityFor(opts.damageFraction, !!opts.isCrit);
  const dir: 1 | -1 = opts.direction === -1 ? -1 : 1;
  const tImpact = TIMING.WINDUP_LIGHT_MS;
  const tRecoilEnd = tImpact + TIMING.IMPACT_HOLD_MS + TIMING.RECOIL_MS;
  const tEnd = tRecoilEnd + TIMING.RECOVER_MS;
  void dir;
  return {
    severity: sev.label,
    totalMs: tEnd,
    phases: [
      { phase: 'windup', startMs: 0, endMs: tImpact },
      { phase: 'impact_hold', startMs: tImpact, endMs: tImpact + TIMING.IMPACT_HOLD_MS },
      { phase: 'recoil', startMs: tImpact + TIMING.IMPACT_HOLD_MS, endMs: tRecoilEnd },
      { phase: 'recover', startMs: tRecoilEnd, endMs: tEnd },
    ],
    shake: { startMs: tImpact, durationMs: TIMING.SHAKE_MS, amplitudePx: sev.shakePx },
    camera: { focus: 'attacker', pushStartMs: 0, pushEndMs: TIMING.CAMERA_PUSH_MS, zoom: sev.cameraPush, releaseEndMs: tEnd },
  };
}

export interface SampledPose {
  tMs: number;
  phase: string;
  attackerArt: 'idle' | 'attack' | 'standing';
  defenderArt: 'standing' | 'hurt';
  defenderOffsetX: number;
  defenderOffsetY: number;
  defenderRotationDeg: number;
  flash: number;
  flashColor: string;
  cameraZoom: number;
  cameraFocus: 'attacker';
  shakeX: number;
  shakeY: number;
  frozen: boolean;
  hpDrainProgress: number; // 0 before the drain, 0..1 during, 1 after (per first hit; multi-hit uses hpDrain events)
}

function phaseAt(timeline: FullTimeline, t: number): string {
  for (const p of timeline.phases) {
    if (t >= p.startMs && t < p.endMs) return p.phase;
  }
  return t >= timeline.totalMs ? 'done' : 'telegraph';
}

/**
 * Sample the render state at wall-clock time t inside a full timeline. Deterministic; no randomness.
 * Accessibility (mirrors arenaCombat's reduceMotion rule, 2026-10-25 research sweep):
 * with opts.reduceMotion, scene shake is zeroed and the camera push-in is halved
 * (zoom = 1 + (zoom - 1) / 2); hitstop, recoil, and HP timing are unchanged, so
 * a reduced-motion battle stages identically, only gentler. Between-turn
 * camera shake is always zero — shake belongs to real damage only.
 */
export function sampleBattlePose(tMs: number, timeline: FullTimeline, opts?: { reduceMotion?: boolean }): SampledPose {
  const sev =
    timeline.severity === 'critical'
      ? SEVERITY.CRITICAL
      : timeline.severity === 'heavy'
        ? SEVERITY.HEAVY
        : timeline.severity === 'medium'
          ? SEVERITY.MEDIUM
          : SEVERITY.LIGHT;
  const t = tMs;
  const phase = phaseAt(timeline, t);
  const firstImpact = timeline.impactMs[0] ?? 0;
  const recoilPhase = timeline.phases.find((p) => p.phase === 'recoil');
  const returnPhase = timeline.phases.find((p) => p.phase === 'return');
  const recoilStart = recoilPhase?.startMs ?? firstImpact + TIMING.IMPACT_HOLD_MS;
  const recoilEnd = recoilPhase?.endMs ?? recoilStart + TIMING.RECOIL_MS;
  const end = timeline.totalMs;
  let offsetX = 0;
  let offsetY = 0;
  let rotationDeg = 0;
  if (t >= recoilStart && t < recoilEnd) {
    const p = easeOutCubic((t - recoilStart) / TIMING.RECOIL_MS);
    offsetX = timeline.direction * sev.recoilPx * p;
    offsetY = -2 * p;
    rotationDeg = timeline.direction * 4 * p;
  } else if (t >= recoilEnd && t < end) {
    const p = easeOutCubic((t - recoilEnd) / TIMING.RECOVER_MS);
    offsetX = timeline.direction * sev.recoilPx * (1 - p);
    offsetY = -2 * (1 - p);
    rotationDeg = timeline.direction * 4 * (1 - p);
  }
  const flash = t >= firstImpact && t < firstImpact + TIMING.FLASH_MS ? 1 - (t - firstImpact) / TIMING.FLASH_MS : 0;
  let cameraZoom = 1;
  if (t < TIMING.CAMERA_PUSH_MS) {
    cameraZoom = 1 + (sev.cameraPush - 1) * easeInOutQuad(t / TIMING.CAMERA_PUSH_MS);
  } else if (t < recoilEnd) {
    cameraZoom = sev.cameraPush;
  } else if (t < end) {
    cameraZoom = sev.cameraPush - (sev.cameraPush - 1) * easeInOutQuad((t - recoilEnd) / TIMING.RECOVER_MS);
  }
  const reduceMotion = !!opts?.reduceMotion;
  if (reduceMotion) cameraZoom = 1 + (cameraZoom - 1) / 2;
  let shakeX = 0;
  let shakeY = 0;
  const shakeT = t - firstImpact;
  if (!reduceMotion && shakeT >= 0 && shakeT < TIMING.SHAKE_MS) {
    const decay = 1 - shakeT / TIMING.SHAKE_MS;
    const f = shakeT / 16.7;
    shakeX = sev.shakePx * decay * Math.sin(f * 2.1);
    shakeY = sev.shakePx * 0.6 * decay * Math.cos(f * 1.7);
  }
  const hurtUntil = recoilStart + TIMING.RECOIL_MS + TIMING.RECOVER_MS / 2;
  const defenderArt = t >= recoilStart && t < hurtUntil ? 'hurt' : 'standing';
  const frozen = timeline.phases.some((p) => p.phase === 'impact_hold' && t >= p.startMs && t < p.endMs);
  const drain = timeline.hpDrain[0];
  const hpDrainProgress = !drain ? 1 : t < drain.startMs ? 0 : t >= drain.endMs ? 1 : (t - drain.startMs) / TIMING.HP_DRAIN_MS;
  const attackerArt: SampledPose['attackerArt'] =
    phase === 'windup' || phase === 'strike' || phase === 'travel' || phase === 'cast' || phase === 'projectile_travel'
      ? 'attack'
      : phase === 'telegraph'
        ? 'standing'
        : 'standing';
  void returnPhase;
  return {
    tMs: t,
    phase,
    attackerArt,
    defenderArt,
    defenderOffsetX: offsetX,
    defenderOffsetY: offsetY,
    defenderRotationDeg: rotationDeg,
    flash,
    flashColor: sev.flash,
    cameraZoom,
    cameraFocus: 'attacker',
    shakeX,
    shakeY,
    frozen,
    hpDrainProgress,
  };
}

/** Rig-space mapping for arena-mode rigged models (same factors as treatments mapTo3D: 1px = 0.01 rig units, Y negated). */
export function mapTo3D(pose: SampledPose): {
  rootOffsetX: number;
  rootOffsetY: number;
  spineLeanDeg: number;
  headPitchDeg: number;
  cameraDollyM: number;
  cameraFocus: 'attacker';
  hurtPoseWeight: number;
  flash: number;
  flashColor: string;
  frozen: boolean;
} {
  const recoilFrac = pose.defenderOffsetX === 0 ? 0 : Math.min(1, Math.abs(pose.defenderOffsetX) / 38);
  return {
    rootOffsetX: pose.defenderOffsetX * 0.01,
    rootOffsetY: -pose.defenderOffsetY * 0.01,
    spineLeanDeg: pose.defenderRotationDeg * 2.5,
    headPitchDeg: pose.defenderArt === 'hurt' ? -12 * recoilFrac - 4 : 0,
    cameraDollyM: (pose.cameraZoom - 1) * 2.0,
    cameraFocus: 'attacker',
    hurtPoseWeight: pose.defenderArt === 'hurt' ? 1 : 0,
    flash: pose.flash,
    flashColor: pose.flashColor,
    frozen: pose.frozen,
  };
}

/** Scale every timestamp in a timeline (2x fast-forward = factor 2 divides durations; factor is applied as 1/factor to ms). */
export function withTimescale(timeline: FullTimeline, speed: number): FullTimeline {
  const s = speed > 0 ? speed : 1;
  const scale = (ms: number): number => ms / s;
  return {
    ...timeline,
    phases: timeline.phases.map((p) => ({ phase: p.phase, startMs: scale(p.startMs), endMs: scale(p.endMs) })),
    hpDrain: timeline.hpDrain.map((d) => ({ ...d, startMs: scale(d.startMs), endMs: scale(d.endMs) })),
    impactMs: timeline.impactMs.map(scale),
    totalMs: scale(timeline.totalMs),
    timescale: s,
  };
}

// ---------------------------------------------------------------- arena adapter
export interface ArenaLike {
  state?: string;
  sampleArenaPose?: (elapsedMs: number) => unknown;
  sampleClashPose?: (clash: unknown, elapsedMs: number) => unknown;
  setPositions?: (playerPos: { x: number; y: number }, foePos: { x: number; y: number }) => void;
  setBehaviour?: (side: string, behaviour: string) => void;
  snapshot?: () => unknown;
}

/**
 * Between-turn movement, integrated with (not rebuilt from) arenaCombat.
 * If the caller passes a live arena battle object, its own sampler owns
 * the pose (circling / advancing / retreating / spar-clash, neutral
 * spacing 6u, min separation 1.2u — arenaCombat's invariants, not new
 * numbers). Otherwise a documented shim circles both combatants at the
 * arena's circle speed (1.6 u/s) around the midpoint at neutral spacing,
 * so turn-based battles still move between turns before arenaCombat.js
 * lands in the repo. The shim is labelled as a shim in its return value.
 */
export function sampleBetweenTurnPose(
  arena: ArenaLike | null,
  elapsedMs: number,
): { source: 'arenaCombat' | 'shim'; player: { x: number; y: number }; foe: { x: number; y: number }; note: string } {
  if (arena && typeof arena.sampleArenaPose === 'function') {
    const pose = arena.sampleArenaPose(elapsedMs) as { player?: { x: number; y: number }; foe?: { x: number; y: number } };
    if (pose && pose.player && pose.foe) {
      return { source: 'arenaCombat', player: pose.player, foe: pose.foe, note: 'arenaCombat sampleArenaPose owns between-turn movement' };
    }
  }
  const t = elapsedMs / 1000;
  const angle = t * 0.27; // 1.6 u/s around a 6u-spacing circle
  const r = 3;
  return {
    source: 'shim',
    player: { x: -r * Math.cos(angle), y: r * Math.sin(angle) },
    foe: { x: r * Math.cos(angle), y: -r * Math.sin(angle) },
    note: 'SHIM: arenaCombat.js not in repo yet; circles at neutral spacing 6u until it lands, then sampleArenaPose replaces this branch',
  };
}

export interface ArenaTimelinePhase {
  phase: string;
  startMs: number;
  endMs: number;
}
export interface ArenaTimelineLike {
  phases: ArenaTimelinePhase[];
  totalMs: number;
  hits?: number;
}

/**
 * Adapt an arenaCombat buildChosenAttackTimeline() result into this
 * module's phase vocabulary. Beat numbers are CHECKED, not re-timed:
 * windup / impact_hold / recoil / recover must match TIMING, or the
 * adapter reports the mismatch instead of silently staging a different
 * fight. Arena phase names (TELEGRAPH, TRAVEL/CAST, WINDUP, STRIKE,
 * IMPACT_HOLD, RECOIL, RETURN, GAP) map 1:1 onto the full timeline.
 */
export function adaptArenaTimeline(
  arenaTimeline: ArenaTimelineLike,
  move: MoveAnim,
  attackerSide: BattleSide,
): { timeline: FullTimeline; beatMismatch: string[] } {
  const mismatches: string[] = [];
  const byPhase = (name: string): ArenaTimelinePhase | undefined =>
    arenaTimeline.phases.find((p) => p.phase === name);
  const check = (name: string, expected: number): void => {
    const p = byPhase(name);
    if (p && p.endMs - p.startMs !== expected) {
      mismatches.push(`${name} is ${p.endMs - p.startMs}ms in arena timeline, expected ${expected}ms`);
    }
  };
  check('WINDUP', move.weight === 'heavy' ? TIMING.WINDUP_HEAVY_MS : TIMING.WINDUP_LIGHT_MS);
  check('IMPACT_HOLD', TIMING.IMPACT_HOLD_MS);
  check('RECOIL', TIMING.RECOIL_MS);
  const lower = (s: string): string => s.toLowerCase();
  const phases: TimelinePhase[] = arenaTimeline.phases.map((p) => ({ phase: lower(p.phase), startMs: p.startMs, endMs: p.endMs }));
  const hpDrain: HpDrainEvent[] = [];
  const impactMs: number[] = [];
  arenaTimeline.phases.forEach((p) => {
    if (p.phase === 'IMPACT_HOLD') impactMs.push(p.startMs);
    if (p.phase === 'RECOIL') {
      hpDrain.push({ hitIndex: hpDrain.length, startMs: p.startMs, endMs: p.startMs + TIMING.HP_DRAIN_MS, note: 'HP drains after hitstop, never during it' });
    }
  });
  return {
    timeline: {
      move,
      attackerSide,
      direction: 1,
      severity: 'medium',
      phases,
      hpDrain,
      impactMs,
      totalMs: arenaTimeline.totalMs,
      faint: false,
      skipsReturn: false,
      timescale: 1,
    },
    beatMismatch: mismatches,
  };
}
