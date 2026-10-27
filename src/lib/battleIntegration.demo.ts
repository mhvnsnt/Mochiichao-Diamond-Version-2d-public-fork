/**
 * battleIntegration.demo.ts — runnable demo battle proving front/back wiring
 * + hit timing end-to-end. Run from the repo with: npx tsx src/lib/battleIntegration.demo.ts
 * (tsx is already a devDependency). Exits non-zero on the first failed assertion.
 *
 * Demo battle: player Mochii (001, back view) vs opponent Razorgater (004,
 * front view). Moves are REAL move records, verbatim: Tackle (melee, light),
 * Thunderbolt (projectile, heavy), Swords Dance (status, no drain),
 * DoubleSlap (multi-hit). No capture is staged here — default capture is
 * the existing Luigi Cube system, and the gated optional ring path is a
 * separate follow-up batch; this module calls neither.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  TIMING,
  SHADOW_LAYER,
  resolveBattleSprite,
  resolvePhaseArt,
  findEntry,
  classifyMoveRecord,
  moveAnimFromTable,
  buildFullTimeline,
  sampleBattlePose,
  withTimescale,
  adaptArenaTimeline,
  sampleBetweenTurnPose,
  type BattleSpriteRegistry,
  type MoveTable,
} from './battleIntegration.js';

const here = dirname(fileURLToPath(import.meta.url));
function loadJson(name: string): unknown {
  for (const cand of [join(here, name), join(here, 'generated', name)]) {
    if (existsSync(cand)) return JSON.parse(readFileSync(cand, 'utf8'));
  }
  throw new Error(`demo: could not find ${name} next to the demo or in generated/`);
}
const registry = loadJson('battleSpriteRegistry.json') as BattleSpriteRegistry;
const moveTable = loadJson('battleMoveTable.json') as MoveTable;

let checks = 0;
function check(cond: boolean, label: string): void {
  checks++;
  if (!cond) {
    console.error(`FAIL (${checks}): ${label}`);
    process.exit(1);
  }
  console.log(`ok: ${label}`);
}

// 1. Front/back wired for every set: player = back, opponent = front, never the same cell.
let frontWired = 0;
let backWired = 0;
for (const entry of registry.sets) {
  const player = resolveBattleSprite(registry, entry.slug, 'player');
  const enemy = resolveBattleSprite(registry, entry.slug, 'enemy');
  check(player !== null && player.view === 'back', `${entry.slug}: player resolves to BACK cell ${player?.cell}`);
  check(enemy !== null && enemy.view === 'front', `${entry.slug}: opponent resolves to FRONT cell ${enemy?.cell}`);
  check(player!.cell !== enemy!.cell, `${entry.slug}: front cell ${enemy!.cell} != back cell ${player!.cell} (never front-for-both)`);
  check(player!.atlasRepoPath === `src/assets/sprite-atlases/${entry.slug}/${entry.slug}_atlas_64_locked.png`, `${entry.slug}: atlas path is the locked atlas on main`);
  frontWired++;
  backWired++;
}
console.log(`front wired ${frontWired}/51, back wired ${backWired}/51`);
check(resolveBattleSprite(registry, '999', 'player') === null, 'unknown roster id resolves to null, never a guessed creature');
check(resolveBattleSprite(registry, '047', 'enemy') === null, 'slot 047 (unfilled on purpose) resolves to null');

// 2. Real move data, verbatim — no genericized names.
const tackle = moveAnimFromTable(moveTable, 'MOVE_TACKLE')!;
const thunderbolt = moveAnimFromTable(moveTable, 'MOVE_THUNDERBOLT')!;
const swordsDance = moveAnimFromTable(moveTable, 'MOVE_SWORDS_DANCE')!;
const doubleSlap = moveAnimFromTable(moveTable, 'MOVE_DOUBLE_SLAP')!;
check(tackle.name === 'Tackle' && tackle.kind === 'melee' && tackle.weight === 'light', 'Tackle: melee, light (power 50)');
check(thunderbolt.name === 'Thunderbolt' && thunderbolt.kind === 'projectile' && thunderbolt.weight === 'heavy', 'Thunderbolt: projectile, heavy (power 95)');
check(swordsDance.name === 'Swords Dance' && swordsDance.kind === 'status', 'Swords Dance: status kind');
check(doubleSlap.multiHit === true, 'DoubleSlap: multi-hit flagged from its real decomp effect');
const gameAqua = classifyMoveRecord({ name: 'Water Orb', cat: 'Special', bp: 40, effect: 'NONE' });
check(gameAqua.kind === 'projectile' && gameAqua.weight === 'light', 'game Water Orb (moves.ts shape): projectile, light');
const gameSwarm = moveAnimFromTable(moveTable, 'SWARM_STRIKE')!;
check(gameSwarm.multiHit === true && gameSwarm.name === 'Swarm Strike', 'game Swarm Strike: multi-hit, real name kept');

// 3. Hit timing end-to-end: Tackle, player Mochii -> opponent Razorgater, 20% damage.
const tl = buildFullTimeline({ move: tackle, attackerSide: 'player', damageFraction: 0.2, hits: 1 });
console.log('Tackle timeline:', tl.phases.map((p) => `${p.phase}[${p.startMs}-${p.endMs}]`).join(' '));
check(
  tl.phases.map((p) => p.phase).join(',') === 'telegraph,travel,windup,strike,impact_hold,recoil,return',
  'Tackle phase order: telegraph -> travel -> windup -> strike -> impact_hold -> recoil -> return',
);
const hold = tl.phases.find((p) => p.phase === 'impact_hold')!;
const drain = tl.hpDrain[0];
check(drain.startMs >= hold.endMs, `HP drain starts at ${drain.startMs}ms, at/after hitstop end ${hold.endMs}ms — never during hitstop`);
check(hold.endMs - hold.startMs === TIMING.IMPACT_HOLD_MS && TIMING.IMPACT_HOLD_MS === 90, 'hitstop is exactly 90ms');
const midHold = sampleBattlePose(hold.startMs + 10, tl);
check(midHold.frozen === true && midHold.defenderOffsetX === 0 && midHold.hpDrainProgress === 0, 'during hitstop: frozen, no recoil offset, HP drain at 0');
const midRecoil = sampleBattlePose(hold.endMs + 150, tl);
check(midRecoil.defenderArt === 'hurt' && midRecoil.defenderOffsetX !== 0, 'during recoil: hurt art shown, defender displaced');
const after = sampleBattlePose(tl.totalMs, tl);
check(after.hpDrainProgress === 1 && after.phase === 'done', 'after timeline: HP drain complete');
// Attack art: Razorgater has transform frames (Step 1 finish batch), never a fake atlas cell.
const razorgater = findEntry(registry, 'razorgater')!;
const razAttack = resolvePhaseArt(razorgater, 'attack', 'enemy');
check(razAttack.art === 'attack' && razAttack.lunge === true && razAttack.cells.length === 0, 'Razorgater attack: no atlas cells invented for transform frames');
check(
  razAttack.art === 'attack' &&
    razAttack.frames.length === 4 &&
    razAttack.frames.map((f) => f.role).join(',') === 'windup,strike_lunge,impact_hold,recover' &&
    razAttack.frames.map((f) => f.durationMs).join(',') === '250,120,90,400',
  'Razorgater attack frames: windup 250 / strike 120 / impact 90 / recover 400 ms (treatments match)',
);
const shiny = findEntry(registry, 'strikechamp_unsuited_full')!;
const shinyAttack = resolvePhaseArt(shiny, 'attack', 'enemy');
check(shinyAttack.art === 'attack' && shinyAttack.cells.length === 7, 'strikechamp_unsuited_full attack: extracted cells 21-27 used');
// Attack + hurt coverage over ALL sets: nothing genericized, nothing faked.
const attackCovered = registry.sets.filter((s) => {
  const a = resolvePhaseArt(s, 'attack', 'enemy');
  return a.art === 'attack' && (a.frames.length > 0 || a.cells.length > 0);
}).length;
check(attackCovered === 51, `attack art covers ${attackCovered}/51 sets (50 transform + 1 extracted)`);
const hurtCovered = registry.sets.filter((s) => {
  const r = resolvePhaseArt(s, 'recoil', 'enemy');
  return r.art === 'hurt' && !r.treatmentsFallback;
}).length;
check(hurtCovered === 51, `hurt art covers ${hurtCovered}/51 sets in staging`);
// Shadows-separate contract: engine layer, never baked into art.
check(SHADOW_LAYER.separateLayer === true && SHADOW_LAYER.bakedInArt === false && SHADOW_LAYER.renderOrder === 'below-sprite', 'shadow contract: separate engine layer below sprite, never baked into art');
// Hurt art: present in staging for all 51, flagged onMain=false until its PR lands.
const hurtStaging = registry.sets.filter((s) => s.hurt?.status === 'done').length;
const hurtOnMain = registry.sets.filter((s) => s.hurt?.onMain).length;
console.log(`hurt cells done in staging ${hurtStaging}/51, on main ${hurtOnMain}/51 (Part 2 PR still owed — fallback is treatments, not a fake path)`);

// 4. Projectile + status + multi-hit + faint paths.
const boltTl = buildFullTimeline({ move: thunderbolt, attackerSide: 'enemy', damageFraction: 0.7, isCrit: true, hits: 1 });
check(boltTl.phases.map((p) => p.phase).join(',').includes('cast,projectile_travel,windup'), 'Thunderbolt: cast + projectile travel before windup');
check(boltTl.severity === 'critical', 'Thunderbolt crit at 70% damage: critical severity (red flash, biggest push)');
const statusTl = buildFullTimeline({ move: swordsDance, attackerSide: 'player', damageFraction: 0 });
check(statusTl.hpDrain.length === 0 && !statusTl.phases.some((p) => p.phase === 'impact_hold'), 'Swords Dance: no impact hold, no HP drain');
const multiTl = buildFullTimeline({ move: doubleSlap, attackerSide: 'player', damageFraction: 0.1, hits: 3 });
check(multiTl.hpDrain.length === 3 && multiTl.impactMs.length === 3, 'DoubleSlap x3: 3 impact frames, 3 HP drains, each after its own hitstop');
check(multiTl.hpDrain.every((d, i) => d.startMs >= multiTl.impactMs[i] + TIMING.IMPACT_HOLD_MS), 'every multi-hit drain starts after its own hitstop');
const faintTl = buildFullTimeline({ move: tackle, attackerSide: 'player', damageFraction: 1, defenderFaints: true });
check(faintTl.skipsReturn === true && faintTl.phases.some((p) => p.phase === 'faint') && !faintTl.phases.some((p) => p.phase === 'return'), 'faint: return SKIPPED, faint collapse + fade instead');

// 5. Arena adapter: matching beats pass, mismatched beats are reported, not re-timed.
const arenaOk = adaptArenaTimeline(
  {
    phases: [
      { phase: 'TELEGRAPH', startMs: 0, endMs: 300 },
      { phase: 'TRAVEL', startMs: 300, endMs: 650 },
      { phase: 'WINDUP', startMs: 650, endMs: 900 },
      { phase: 'STRIKE', startMs: 900, endMs: 980 },
      { phase: 'IMPACT_HOLD', startMs: 980, endMs: 1070 },
      { phase: 'RECOIL', startMs: 1070, endMs: 1370 },
      { phase: 'RETURN', startMs: 1370, endMs: 1770 },
    ],
    totalMs: 1770,
  },
  tackle,
  'player',
);
check(arenaOk.beatMismatch.length === 0, 'arena timeline with matching beats: 0 mismatches');
const arenaBad = adaptArenaTimeline(
  { phases: [{ phase: 'WINDUP', startMs: 0, endMs: 999 }], totalMs: 999 },
  tackle,
  'player',
);
check(arenaBad.beatMismatch.length === 1, 'arena timeline with wrong windup: mismatch REPORTED, not silently re-timed');

// 6. Between-turn movement: arena sampler wins when present; shim circles at neutral spacing 6u otherwise.
const shim = sampleBetweenTurnPose(null, 0);
const shimDist = Math.hypot(shim.player.x - shim.foe.x, shim.player.y - shim.foe.y);
check(shim.source === 'shim' && Math.abs(shimDist - 6) < 0.001, `between-turn shim: spacing ${shimDist.toFixed(3)}u = neutral 6u`);
const fakeArena = { sampleArenaPose: () => ({ player: { x: -3, y: 0 }, foe: { x: 3, y: 0 } }) };
const live = sampleBetweenTurnPose(fakeArena, 0);
check(live.source === 'arenaCombat', 'live arena object: its sampler owns between-turn movement');

// 7. Skip / 2x: order preserved, total halved, drains still after hitstops.
const fast = withTimescale(tl, 2);
check(fast.totalMs === tl.totalMs / 2 && fast.phases.map((p) => p.phase).join(',') === tl.phases.map((p) => p.phase).join(','), '2x fast-forward: same phase order, total halved');
check(fast.hpDrain[0].startMs >= fast.phases.find((p) => p.phase === 'impact_hold')!.endMs, '2x timeline: HP drain still after hitstop');

// 8. Research sweep: reduce-motion mirrors arenaCombat (shake 0, push halved, timing unchanged).
const normalShake = sampleBattlePose(hold.endMs + 50, tl);
const reducedShake = sampleBattlePose(hold.endMs + 50, tl, { reduceMotion: true });
check(normalShake.shakeX !== 0 || normalShake.shakeY !== 0, 'normal motion: shake present after impact');
check(reducedShake.shakeX === 0 && reducedShake.shakeY === 0, 'reduce-motion: shake zeroed');
check(Math.abs(reducedShake.cameraZoom - (1 + (normalShake.cameraZoom - 1) / 2)) < 0.0001, 'reduce-motion: camera push halved');
check(reducedShake.hpDrainProgress === normalShake.hpDrainProgress && reducedShake.frozen === normalShake.frozen, 'reduce-motion: hitstop + HP timing unchanged');

console.log(`\nDEMO PASS: ${checks} checks, front ${frontWired}/51, back ${backWired}/51, moves in table: decomp + game (see battleMoveTable.json counts).`);
