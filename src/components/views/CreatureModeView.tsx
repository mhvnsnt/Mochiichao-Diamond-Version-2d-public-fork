import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import PixiWorldCanvas from '../game/PixiWorldCanvas';
import { FULL_WORLD } from '../../world/FullWorldMaps';
import { MOVES_DB } from '../../lib/moves';
import { SPECIES_DB } from '../../lib/species';
import { calcTypeMultiplier } from '../../lib/constants';
import { createMochii, gainExp } from '../../lib/engine';
import { GuardianAssignment, guardianLabel } from '../../lib/monster-tamer-systems';
import { creatureCooldownMs } from '../../lib/creatureCooldowns';
import { findNextStep } from '../../lib/creaturePathfinding';
import { gardenBattleBonus } from '../../lib/mochiichao-systems';
import { gardenFormPresentation, saChaoPresentation, MAINFRAME_GARDENS } from '../../lib/creatureGardenForm';
import { daycareRetrieveCost, daycareCompatibility, daycareEggReady, DAYCARE_EXP_PER_STEP } from '../../lib/creatureDaycare';
import { creatureWalkFrameUrl } from '../../lib/creatureWalkFrames';
import { creaturePaletteSheetUrl } from '../../lib/creaturePaletteSheets';
import type { MochiiInstance } from '../../lib/types';

/**
 * Creature Mode — play as the creature, real-time, top-down (pass 2).
 *
 * Pokemon-first mapping (structure from the decomp files in the repo,
 * Mochiichao replacement in that exact spot):
 * - FireRed/HeartGold overworld tile movement + collision
 *   -> Creature Mode tile movement on FULL_WORLD sector0, same blocked
 *   tiles (1 tree, 4 building, 2 water) as pass 1. HAVE.
 * - FireRed battle damage structure (STAB 1.5, type multiplier, crit
 *   1.5 at 6%, random 85-100, level/power/attack/defence base)
 *   -> Creature Mode real-time damage, SAME formula, in
 *   creatureDamage() below. No second damage table. HAVE (pass 2).
 * - FireRed/HeartGold wild encounter + catch math
 *   (catchRate * hpFactor / 255, hpFactor = (3*max-2*hp)/(3*max),
 *   BattleView adds +0.3) -> Luigi Cube capture here, same math. HAVE.
 * - HeartGold/FireRed level/XP (engine.gainExp, baseExpYield)
 *   -> defeat XP here, same gainExp. HAVE.
 * - No Pokemon game in the repo has real-time play-as-creature combat,
 *   dodge i-frames, or Boids pack flocking. Those are NOT Pokemon
 *   structure: they are labelled design choices below, with their
 *   numbers stated in the code, not presented as decomp data. NEED
 *   (canonical cooldown table, top-down walk sprites) is still owed.
 *
 * Pass 4 changes over pass 3 (fan / mod pulls, no new art, no ROMs,
 * no patches, no franchise files copied — mechanics only, from files
 * already in the repo + the pull-list design notes):
 * - Hitstop 90ms, HP drains AFTER hitstop: from
 *   sprite-art/arena-combat/ARENA-COMBAT-SPEC.md (treatment beats
 *   250/90/300/400 ms, hitstop 90 ms default) and
 *   FAN-MECHANICS-SUMMARY.md (hitstop capped 90 ms). On a hit, the
 *   world freezes for 90 ms (player + wild movement tick skips),
 *   then HP drops. Misses / status moves (damage 0) get no hitstop.
 * - Tag-team pack engagement: from pull-list #19 Pokemon Battle
 *   Advanced (real-time, tag-team wild fights). Attacking a pack
 *   wild engages its packmates within 4 tiles for 5 s — they path
 *   to the player even outside their normal range, instead of
 *   standing by while their packmate is fought alone.
 * - Territorial strafe: from fanMechanics AI (timed strafe /
 *   lateral movement). A territorial wild at distance 2-3 sometimes
 *   steps sideways instead of always charging straight in.
 * - NOT wired from those fan files, with reasons: dash-pool
 *   200 ms invulnerability (Creature Mode dodge is already 250 ms
 *   i-frames from pass 2 — changing it would break the timed-dodge
 *   feel Mars already has); speed-compression 1.6-2.3 u/s (units are
 *   arena units, not world tiles — mapping it straight over would
 *   slow world movement from 4 tiles/s to under 2, a feel regression,
 *   not an improvement); softened type steps (Creature Mode uses
 *   the canonical Trainer Mode type multiplier, not a second table).
 *
 * Pass 3 changes over pass 2 (this lane, 100% target):
 * - Smooth pixel movement: player position is now a float tile position,
 *   moved at 4 tiles/s walking / 6 tiles/s sprinting on a 50ms tick,
 *   with per-axis collision (try X, then Y) against the same blocked
 *   tiles. No more tile teleport steps. Walk animation: animWalk
 *   increments on every real move, so PixiWorldCanvas bobs the
 *   creature sprite (existing sheet front/back/side cells, or the
 *   fallback silhouette) — walk ART sheets for the starters are
 *   sprite-lane production, not invented here; this code uses the
 *   sheets that actually exist (Dorowani/Gabu) and the fallback for
 *   everyone else, exactly as the world canvas already does.
 * - Canonical cooldown table: src/lib/creatureCooldowns.ts, an
 *   explicit per-move table (provisional numbers, shown to Mars for
 *   approval in docs/creature-mode-pass3.md — NOT treated as canon
 *   until he approves a change). No formula in this file any more.
 * - Wild pathfinding: easystarjs (MIT, npm) A* over the Sector 0
 *   grid, via src/lib/creaturePathfinding.ts. Engage/pack moves take
 *   the first step of the easystar path, so wilds path around
 *   buildings/trees instead of walking into them. Pack still uses
 *   Boids rules (cohesion to the pack centroid, separation when
 *   sharing a tile) for WHERE to go; easystar decides HOW to get there.
 * - Wilds also move smoothly: each wild has an easystar next-tile
 *   target from the 900ms AI tick and glides toward it at 3 tiles/s
 *   on the 50ms tick, instead of teleporting a tile at a time.
 * - Garden bonus: active creature's Garden record is read from the
 *   shared store (gardenRecords, written by GardenView), and
 *   gardenBattleBonus() (capped +9% in mochiichao-systems) is
 *   applied to the player's Creature Mode damage only, once, and
 *   shown in the HUD. It is NOT applied to wild attacks, NOT stacked.
 * - Guardian persistence: guardian lives in the shared store, so
 *   leaving Creature Mode and saving/loading keeps the assignment.
 *   SaveMenu serializes the whole store state, so both new fields
 *   persist with the save.
 *
 * Pass 2 changes over pass 1, all in this file (+ wilds rendering in
 * PixiWorldCanvas):
 * - Held-key movement (100ms tick, walk step every 2 ticks, sprint
 *   step every tick) instead of one tile per keypress.
 * - Sprint (Shift): stamina 0-100, drains 8/s while sprint-moving,
 *   refills 12/s at rest. Design numbers, not decomp data.
 * - Per-move cooldowns, derived transparently from MOVES_DB:
 *   cooldownMs = clamp(600 + (100 - bp) * 8, 600, 1800), -200ms if
 *   the move has priority > 0. This is a prototype derivation, NOT
 *   a canonical cooldown table — that table is owed in the unify map.
 * - Dodge (Space): exactly 250ms i-frames. Perfect Dodge: if a wild
 *   attack lands while dodging, it deals 0 and refunds 50% of the
 *   remaining cooldown on every move. Design numbers, labelled.
 * - Q hop: if the facing tile is blocked and the tile beyond it is
 *   walkable and in-bounds, hop over it in one step (400ms hop state).
 *   Prototype rule, labelled — it does not cross the map border.
 * - Tag-switch (Tab): 2000ms switch cooldown. Design number.
 * - Wild creatures: 5 wilds on Sector 0, built with createMochii()
 *   so stats/HP are canonical, with temperaments from the spec:
 *   skittish flees, territorial engages, pack flocks (Boids-style
 *   separation/cohesion, simplified to tile steps), curious approaches
 *   but stops at distance 3.
 * - Wild attacks: telegraphed 600ms before impact, so a dodge can
 *   actually be timed. Design number, labelled.
 * - Garden bonus: NOT faked here. Party instances carry no GardenStats
 *   record yet, so gardenBattleBonus() cannot be read for the active
 *   creature — bonus is 0 in this pass, and sharing a GardenStats
 *   record between Garden and Creature Mode is listed as owed below.
 *   The +9% cap itself is NOT stacked or double-applied anywhere.
 */
type Temperament = 'skittish' | 'territorial' | 'pack' | 'curious';
type Wild = MochiiInstance & { temperament: Temperament; x: number; y: number; telegraph: boolean };

const BLOCKED = new Set([1, 4, 2]);
const DODGE_MS = 250;
const HOP_MS = 400;
const SWITCH_COOLDOWN_MS = 2000;
const TELEGRAPH_MS = 600;
const HITSTOP_MS = 90;
const PACK_ENGAGE_MS = 5000;

function makeWild(speciesId: string, level: number, temperament: Temperament, x: number, y: number): Wild | null {
  const m = createMochii(speciesId, level);
  if (!m) return null;
  return { ...m, temperament, x, y, telegraph: false };
}

function initialWilds(): Wild[] {
  const list = [
    makeWild('001', 5, 'skittish', 12, 11),
    makeWild('004', 6, 'territorial', 20, 10),
    makeWild('007', 5, 'pack', 8, 15),
    makeWild('007', 5, 'pack', 9, 16),
    makeWild('010', 5, 'curious', 18, 15),
  ].filter((w): w is Wild => w !== null);
  return list;
}

/** Canonical damage, same structure as BattleView.executeDamage. */
function creatureDamage(attacker: MochiiInstance, defenderSpeciesId: string, defenderStats: { def: number; spd: number }, moveId: string, gardenBonus = 0) {
  const move = MOVES_DB[moveId];
  if (!move || move.cat === 'Status') return { damage: 0, text: `${attacker.nickname} used ${move?.name || moveId}!` };
  const aStat = move.cat === 'Physical' ? attacker.stats.atk : attacker.stats.spa;
  const dStat = move.cat === 'Physical' ? defenderStats.def : defenderStats.spd;
  const baseDmg = Math.floor(Math.floor(Math.floor(2 * attacker.level / 5 + 2) * move.bp * aStat / dStat) / 50) + 2;
  const defTypes = SPECIES_DB[defenderSpeciesId]?.types || [];
  const typeMult = calcTypeMultiplier(move.type, defTypes[0], defTypes[1]);
  const stabMult = SPECIES_DB[attacker.speciesId]?.types.includes(move.type) ? 1.5 : 1;
  const crit = Math.random() < 0.06 ? 1.5 : 1.0;
  const roll = (85 + Math.random() * 15) / 100;
  const damage = Math.floor(baseDmg * typeMult * stabMult * crit * roll * (1 + gardenBonus));
  let text = `${attacker.nickname} used ${move.name}! `;
  if (typeMult > 1) text += "It's super effective! ";
  if (typeMult < 1 && typeMult > 0) text += "It's not very effective... ";
  if (typeMult === 0) text += "It had no effect... ";
  if (crit > 1) text += "A critical hit! ";
  return { damage, text };
}

export default function CreatureModeView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const inventory = useGameStore(s => s.inventory);
  const useItem = useGameStore(s => s.useItem);
  const addMochii = useGameStore(s => s.addMochii);
  const updatePartyMember = useGameStore(s => s.updatePartyMember);
  const gardenRecords = useGameStore(s => s.gardenRecords);
  const guardian = useGameStore(s => s.guardian);
  const setGuardian = useGameStore(s => s.setGuardian);
  const daycareSteps = useGameStore(s => s.daycareSteps);
  const setDaycareSteps = useGameStore(s => s.setDaycareSteps);
  const daycarePartner = useGameStore(s => s.daycarePartner);
  const setDaycarePartner = useGameStore(s => s.setDaycarePartner);
  const daycareEgg = useGameStore(s => s.daycareEgg);
  const setDaycareEgg = useGameStore(s => s.setDaycareEgg);
  const wallet = useGameStore(s => s.wallet);
  const gainWallet = useGameStore(s => s.gainWallet);
  const lastDaycareTileRef = useRef<string | null>(null);
  // Pass 3: float tile position — the player glides between tiles, and
  // PixiWorldCanvas draws at (x + 0.5) * tile, so floats render smoothly.
  const [pos, setPos] = useState({ x: 15, y: 18 });
  const [walkStep, setWalkStep] = useState(0);
  const [dir, setDir] = useState('down');
  const [activeIdx, setActiveIdx] = useState(0);
  const [log, setLog] = useState('Hold WASD to move, Shift to sprint, 1–4 moves, Space dodge (250ms), Q hop, Tab switch. Wild creatures are on the map.');
  const [stamina, setStamina] = useState(100);
  const [dodging, setDodging] = useState(false);
  const [hopping, setHopping] = useState(false);
  const [wilds, setWilds] = useState<Wild[]>(() => initialWilds());
  const [targetId, setTargetId] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
  const [switchReadyAt, setSwitchReadyAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [showGarden, setShowGarden] = useState(false);

  const posRef = useRef(pos);
  const wildsRef = useRef(wilds);
  const nextTileRef = useRef<Record<string, { x: number; y: number }>>({});
  const hitstopUntilRef = useRef(0);
  const engagedRef = useRef<Record<string, number>>({});
  const staminaRef = useRef(100);
  staminaRef.current = stamina;
  const keysRef = useRef<Set<string>>(new Set());
  const dodgeUntilRef = useRef(0);
  const tickRef = useRef(0);
  posRef.current = pos;
  wildsRef.current = wilds;
  const mapData = FULL_WORLD['sector0'];
  const active = party[activeIdx];

  const isWalkable = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= mapData.width || y >= mapData.height) return false;
    return !BLOCKED.has(mapData.tiles[y]?.[x]);
  };

  // Pass 3: smooth movement. Speed in tiles/second, applied on the
  // 50ms tick; collision is per-axis against the tile under the new
  // position, so the player slides along a wall instead of stopping.
  const WALK_TILES_PER_SEC = 4;
  const SPRINT_TILES_PER_SEC = 6;
  const gardenBonus = active ? gardenBattleBonus(gardenRecords[active.id]?.garden || { dive: 0, glide: 0, sprint: 0, might: 0, endurance: 0 }) : 0;
  // Pass 5: Garden Form presentation for the active creature, from the
  // shared store record only. Null = no Garden record yet, not faked.
  const gardenFormPres = active ? gardenFormPresentation(gardenRecords[active.id] ?? null) : null;
  // Pass 6: SA Chao data sliders, computed from the same Garden record.
  const saChaoPres = active ? saChaoPresentation(gardenRecords[active.id] ?? null) : null;
  const tryMove = (dx: number, dy: number, sprinting: boolean) => {
    const p = posRef.current;
    if (dx === 1) setDir('right');
    else if (dx === -1) setDir('left');
    else if (dy === 1) setDir('down');
    else if (dy === -1) setDir('up');
    const step = (sprinting ? SPRINT_TILES_PER_SEC : WALK_TILES_PER_SEC) * 0.05;
    let nx = p.x, ny = p.y;
    // X first, then Y — each axis only moves if its target tile is walkable.
    if (dx !== 0 && isWalkable(Math.floor(p.x + dx * step), Math.floor(p.y))) nx = p.x + dx * step;
    if (dy !== 0 && isWalkable(Math.floor(nx), Math.floor(p.y + dy * step))) ny = p.y + dy * step;
    // Clamp inside the map so a float position never leaves the world.
    nx = Math.max(0, Math.min(mapData.width - 1.001, nx));
    ny = Math.max(0, Math.min(mapData.height - 1.001, ny));
    if (nx !== p.x || ny !== p.y) {
      setPos({ x: nx, y: ny });
      setWalkStep(s => s + 1);
      // Pass 7 — Daycare steps are TILE changes, not 50ms ticks:
      // FireRed counts a step when the player moves to a new tile.
      // Only while a Guardian is assigned (deposited).
      const tileKey = `${Math.floor(nx)},${Math.floor(ny)}`;
      if (tileKey !== lastDaycareTileRef.current) {
        lastDaycareTileRef.current = tileKey;
        const st = useGameStore.getState();
        if (st.guardian) st.setDaycareSteps(st.daycareSteps + 1);
      }
    }
  };

  const doDodge = () => {
    if (Date.now() < dodgeUntilRef.current) return;
    dodgeUntilRef.current = Date.now() + DODGE_MS;
    setDodging(true);
    setLog('Dodge! 250ms i-frames — time it against a telegraphed attack for a Perfect Dodge.');
    window.setTimeout(() => setDodging(false), DODGE_MS);
  };

  const doHop = () => {
    const p = { x: Math.floor(posRef.current.x), y: Math.floor(posRef.current.y) };
    const dx = dir === 'right' ? 1 : dir === 'left' ? -1 : 0;
    const dy = dir === 'down' ? 1 : dir === 'up' ? -1 : 0;
    const midX = p.x + dx, midY = p.y + dy;
    const landX = p.x + dx * 2, landY = p.y + dy * 2;
    if (!isWalkable(midX, midY) && isWalkable(landX, landY)) {
      setHopping(true);
      setPos({ x: landX, y: landY });
      setLog('Hop! Over the low obstacle.');
      window.setTimeout(() => setHopping(false), HOP_MS);
    } else {
      setLog('Nothing to hop over in that direction.');
    }
  };

  const doSwitch = () => {
    if (party.length < 2) { setLog('No other party creature to switch to.'); return; }
    if (Date.now() < switchReadyAt) { setLog('Tag-switch is still on cooldown.'); return; }
    setActiveIdx(i => (i + 1) % party.length);
    setSwitchReadyAt(Date.now() + SWITCH_COOLDOWN_MS);
    setLog('Tag-switched!');
  };

  const attackTarget = (moveIndex: number) => {
    if (!active) return;
    const moveId = active.moves[moveIndex];
    if (!moveId) return;
    if (Date.now() < (cooldowns[moveIndex] || 0)) { setLog(`${MOVES_DB[moveId]?.name || moveId} is still on cooldown.`); return; }
    const p = { x: Math.floor(posRef.current.x), y: Math.floor(posRef.current.y) };
    const candidates = wildsRef.current.filter(w => w.hp > 0);
    if (candidates.length === 0) { setLog('No wild creatures left on this map.'); return; }
    const sorted = [...candidates].sort((a, b) => (Math.abs(Math.floor(a.x) - p.x) + Math.abs(Math.floor(a.y) - p.y)) - (Math.abs(Math.floor(b.x) - p.x) + Math.abs(Math.floor(b.y) - p.y)));
    const chosen = targetId ? (candidates.find(w => w.id === targetId) || sorted[0]) : sorted[0];
    const dist = Math.abs(Math.floor(chosen.x) - p.x) + Math.abs(Math.floor(chosen.y) - p.y);
    if (dist > 2) { setTargetId(chosen.id); setLog(`${chosen.nickname} is too far away (distance ${dist}, need 2 or less). Move closer.`); return; }
    // Fresh from the store, not the render closure, so keyboard attacks
    // (whose handler is re-registered on party/active, not garden) still
    // get the current Garden bonus.
    const freshBonus = gardenBattleBonus(useGameStore.getState().gardenRecords[active.id]?.garden || { dive: 0, glide: 0, sprint: 0, might: 0, endurance: 0 });
    const { damage, text } = creatureDamage(active, chosen.speciesId, chosen.stats, moveId, freshBonus);
    setCooldowns(prev => ({ ...prev, [moveIndex]: Date.now() + creatureCooldownMs(moveId) }));
    setTargetId(chosen.id);
    // Tag-team: packmates within 4 tiles of the attacked wild engage
    // the player for 5 s (Battle Advanced tag-team, pull-list #19).
    if (chosen.temperament === 'pack') {
      const nowMs = Date.now();
      wildsRef.current.forEach(w => {
        if (w.id !== chosen.id && w.temperament === 'pack' && w.hp > 0 &&
            Math.abs(Math.floor(w.x) - Math.floor(chosen.x)) + Math.abs(Math.floor(w.y) - Math.floor(chosen.y)) <= 4) {
          engagedRef.current[w.id] = nowMs + PACK_ENGAGE_MS;
        }
      });
    }
    if (damage > 0) {
      // Hitstop 90 ms (arena spec), HP drains AFTER it, not instantly.
      hitstopUntilRef.current = Date.now() + HITSTOP_MS;
      setLog(`${text} Impact!`);
      window.setTimeout(() => {
        const nextHp = Math.max(0, chosen.hp - damage);
        if (nextHp === 0) {
          const copy = { ...active };
          gainExp(copy, SPECIES_DB[chosen.speciesId]?.baseExpYield || 50);
          updatePartyMember(activeIdx, copy);
          setLog(`${text} ${chosen.nickname} was defeated! ${copy.nickname} gained EXP${copy.level > active.level ? ` and reached level ${copy.level}!` : '.'}`);
        } else {
          setLog(`${text} ${chosen.nickname} HP: ${nextHp}/${chosen.maxHp}.`);
        }
        setWilds(prev => prev.map(w => w.id === chosen.id ? { ...w, hp: nextHp } : w));
      }, HITSTOP_MS);
    } else {
      setLog(`${text} No damage.`);
    }
  };

  const catchTarget = () => {
    const chosen = wildsRef.current.find(w => w.id === targetId) || wildsRef.current.find(w => w.hp > 0 && w.hp <= w.maxHp * 0.3);
    if (!chosen) { setLog('No catchable wild targeted — weaken one to 30% HP or less first.'); return; }
    if (chosen.hp > chosen.maxHp * 0.3) { setLog(`${chosen.nickname} is too healthy to catch reliably — weaken it to 30% HP or less first.`); return; }
    if (!useItem('luigi_cube')) { setLog('You have no Luigi Cubes!'); return; }
    const catchRate = SPECIES_DB[chosen.speciesId]?.catchRate || 45;
    const hpFactor = (3 * chosen.maxHp - 2 * chosen.hp) / (3 * chosen.maxHp);
    const chance = (catchRate * hpFactor) / 255;
    if (Math.random() < chance + 0.3) {
      addMochii({ ...chosen, nickname: chosen.nickname } as MochiiInstance);
      setWilds(prev => prev.filter(w => w.id !== chosen.id));
      setLog(`Gotcha! ${chosen.nickname} was caught with a Luigi Cube!`);
    } else {
      setLog(`Oh no! ${chosen.nickname} broke free!`);
    }
  };

  // Keyboard: held keys + discrete actions. Movement itself is on the tick below.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
      if (k === 'tab') { e.preventDefault(); doSwitch(); return; }
      if (k === ' ') { doDodge(); return; }
      if (k === 'q') { doHop(); return; }
      if (k >= '1' && k <= '4') { attackTarget(Number(k) - 1); return; }
      keysRef.current.add(k);
    };
    const up = (e: KeyboardEvent) => { keysRef.current.delete(e.key.toLowerCase()); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party, active, activeIdx, cooldowns, switchReadyAt, targetId, dir]);

  // 50ms game tick (pass 3): smooth player movement + smooth wild glide
  // + stamina (drain 8/s sprinting, refill 12/s at rest) + UI clock.
  useEffect(() => {
    const id = window.setInterval(() => {
      tickRef.current += 1;
      setNow(Date.now());
      // Hitstop: the world freezes for 90 ms after a hit lands.
      if (Date.now() < hitstopUntilRef.current) return;
      const keys = keysRef.current;
      // Sprint only while stamina remains; at 0, Shift still walks.
      const sprinting = keys.has('shift') && staminaRef.current > 0;
      const dx = keys.has('arrowright') || keys.has('d') ? 1 : keys.has('arrowleft') || keys.has('a') ? -1 : 0;
      const dy = keys.has('arrowdown') || keys.has('s') ? 1 : keys.has('arrowup') || keys.has('w') ? -1 : 0;
      if (dx || dy) {
        if (sprinting) {
          setStamina(s => Math.max(0, s - 0.4));
          tryMove(dx, dy, true);
        } else {
          tryMove(dx, dy, false);
        }
      } else if (!keys.has('shift')) {
        setStamina(s => Math.min(100, s + 0.6));
      }
      // Wild glide: each wild moves toward its AI-assigned next tile
      // at 3 tiles/s, snapping when it arrives, instead of teleporting.
      const targets = nextTileRef.current;
      if (Object.keys(targets).length > 0) {
        setWilds(prev => prev.map(w => {
          const tgt = targets[w.id];
          if (!tgt || w.hp <= 0) return w;
          const step = 3 * 0.05;
          let nx = w.x, ny = w.y;
          if (Math.abs(tgt.x - w.x) > 0.001) nx = w.x + Math.sign(tgt.x - w.x) * Math.min(step, Math.abs(tgt.x - w.x));
          if (Math.abs(tgt.y - w.y) > 0.001) ny = w.y + Math.sign(tgt.y - w.y) * Math.min(step, Math.abs(tgt.y - w.y));
          return { ...w, x: nx, y: ny };
        }));
      }
    }, 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wild AI, every 900ms (pass 3): temperament picks a TARGET tile,
  // easystarjs A* picks the next step toward it, and the 50ms tick
  // glides the wild there smoothly. Boids rules still decide the
  // target: cohesion to the pack centroid, separation when sharing
  // a tile, skittish flee, curious approach-to-distance-3.
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = { x: Math.floor(posRef.current.x), y: Math.floor(posRef.current.y) };
      const current = wildsRef.current;
      const targets: Record<string, { x: number; y: number }> = {};
      current.forEach(w => {
        if (w.hp <= 0) return;
        const wx = Math.floor(w.x), wy = Math.floor(w.y);
        const dist = Math.abs(wx - p.x) + Math.abs(wy - p.y);
        let target: { x: number; y: number } | null = null;
        if (w.temperament === 'skittish') {
          if (dist <= 4) {
            // Flee: step away on the larger-gap axis, if walkable.
            const sx = p.x > wx ? -1 : p.x < wx ? 1 : 0;
            const sy = p.y > wy ? -1 : p.y < wy ? 1 : 0;
            const cand = Math.abs(p.x - wx) >= Math.abs(p.y - wy) && sx !== 0
              ? { x: wx + sx, y: wy } : sy !== 0 ? { x: wx, y: wy + sy } : sx !== 0 ? { x: wx + sx, y: wy } : null;
            if (cand && isWalkable(cand.x, cand.y)) target = cand;
          } else if (Math.random() < 0.3) {
            const cand = { x: wx + (Math.random() < 0.5 ? -1 : 1), y: wy };
            if (isWalkable(cand.x, cand.y)) target = cand;
          }
        } else if (w.temperament === 'territorial') {
          if (dist <= 6 && dist > 1) {
            // Strafe: at distance 2-3, sometimes step sideways instead
            // of charging straight in (fanMechanics lateral movement).
            if ((dist === 2 || dist === 3) && Math.random() < 0.3) {
              const side = Math.random() < 0.5 ? 1 : -1;
              const cand = Math.abs(p.x - wx) >= Math.abs(p.y - wy)
                ? { x: wx, y: wy + side } : { x: wx + side, y: wy };
              if (isWalkable(cand.x, cand.y)) target = cand;
              else target = p;
            } else {
              target = p;
            }
          }
        } else if (w.temperament === 'curious') {
          if (dist > 3 && dist <= 7) target = p;
        } else if (w.temperament === 'pack') {
          const pack = current.filter(o => o.temperament === 'pack' && o.hp > 0 && o.id !== w.id);
          if (pack.length > 0) {
            const cx = Math.round(pack.reduce((s, o) => s + Math.floor(o.x), 0) / pack.length);
            const cy = Math.round(pack.reduce((s, o) => s + Math.floor(o.y), 0) / pack.length);
            const mateHere = pack.some(o => Math.floor(o.x) === wx && Math.floor(o.y) === wy);
            if (mateHere) {
              const sx = cx > wx ? -1 : cx < wx ? 1 : -1;
              const sy = cy > wy ? -1 : cy < wy ? 1 : 0;
              target = { x: wx + sx, y: wy + sy };
            }
            else if (Math.abs(cx - wx) + Math.abs(cy - wy) > 2) target = { x: cx, y: cy };
            else if (dist <= 6 && dist > 1) target = p;
          }
        }
        // Tag-team engagement overrides the normal range check: an
        // engaged packmate paths to the player even from further out.
        if (engagedRef.current[w.id] && engagedRef.current[w.id] > Date.now() && dist > 1) {
          target = p;
        }
        if (target) {
          const step = findNextStep(mapData.tiles, BLOCKED, { x: wx, y: wy }, target);
          if (step && isWalkable(step.x, step.y)) targets[w.id] = step;
        }
      });
      nextTileRef.current = targets;
      // Attacks: telegraph, then hit 600ms later unless the player is dodging.
      const attackCurrent = wildsRef.current;
      attackCurrent.forEach(w => {
        if (w.hp <= 0 || w.telegraph) return;
        const dist = Math.abs(Math.floor(w.x) - p.x) + Math.abs(Math.floor(w.y) - p.y);
        if (dist > 1) return;
        setWilds(prev => prev.map(o => o.id === w.id ? { ...o, telegraph: true } : o));
        window.setTimeout(() => {
          const store = useGameStore.getState();
          const attackerIdx = store.party.findIndex(m => m.hp > 0);
          if (attackerIdx < 0) return;
          const defender = store.party[attackerIdx];
          const moveId = w.moves[0] || 'TACKLE';
          if (Date.now() < dodgeUntilRef.current) {
            // Perfect Dodge: 0 damage, refund 50% of remaining cooldowns.
            setCooldowns(prev => {
              const next: Record<number, number> = {};
              const t = Date.now();
              Object.entries(prev).forEach(([k, end]) => { next[Number(k)] = t + Math.max(0, (Number(end) - t) * 0.5); });
              return next;
            });
            setLog(`Perfect Dodge! ${w.nickname}'s attack missed and half your move cooldowns were refunded.`);
          } else {
            const wildStats = { def: defender.stats.def, spd: defender.stats.spd };
            const { damage, text } = creatureDamage({ ...w, nickname: w.nickname } as MochiiInstance, defender.speciesId, wildStats, moveId);
            // creatureDamage expects attacker stats; wild instance stats are in w.stats.
            void text;
            const newHp = Math.max(0, defender.hp - damage);
            store.updatePartyMember(attackerIdx, { ...defender, hp: newHp });
            setLog(`${w.nickname} hit ${defender.nickname} for ${damage}! ${defender.nickname} HP: ${newHp}/${defender.maxHp}.`);
          }
          setWilds(prev => prev.map(o => o.id === w.id ? { ...o, telegraph: false } : o));
        }, TELEGRAPH_MS);
      });
    }, 900);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) {
    return (
      <div className="game-screen flex flex-col p-6 items-center justify-center bg-[#0b1526]">
        <div className="game-panel p-6 text-center max-w-md">
          <div className="font-bold text-white text-xl mb-2">Creature Mode needs a partner</div>
          <div className="text-slate-300 text-sm mb-4">Visit Prof. Aeon's Lab and choose a starter first.</div>
          <button onClick={onBack} className="game-button px-4 py-2">Back</button>
        </div>
      </div>
    );
  }

  const aliveWilds = wilds.filter(w => w.hp > 0);
  const target = wilds.find(w => w.id === targetId) || aliveWilds[0];
  const switchRemaining = Math.max(0, switchReadyAt - now);

  return (
    <div className="game-screen bg-[#0b1526]">
      <PixiWorldCanvas
        mapData={mapData}
        playerPos={pos}
        playerDir={dir}
        playerSpeciesId={active.speciesId}
        playerKind="creature"
        defeatedIds={[]}
        phase="day"
        animWalk={walkStep}
        playerAuraColor={gardenFormPres?.auraColor ?? null}
        playerWalkFrameUrl={active ? creatureWalkFrameUrl(active.speciesId, dir, walkStep) : null}
        wilds={wilds.filter(w => w.hp > 0).map(w => ({ id: w.id, speciesId: w.speciesId, x: w.x, y: w.y, telegraph: w.telegraph }))}
      />
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-between p-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="game-panel px-3 py-2">
          <div className="font-bold text-white text-sm">Playing as: {active.nickname} Lv{active.level} HP {active.hp}/{active.maxHp} {dodging ? '(DODGING 250ms)' : ''} {hopping ? '(HOPPING)' : ''} {gardenBonus > 0 ? `(+${(gardenBonus * 100).toFixed(1)}% Garden bonus)` : ''} {gardenFormPres?.auraColor ? `• ${gardenFormPres.form} aura` : ''}</div>
          <div className="text-[11px] text-slate-300">Stamina: {Math.round(stamina)}/100 {stamina <= 0 ? '(exhausted — walk only until it refills)' : ''} • Luigi Cubes: {inventory['luigi_cube'] || 0}</div>
          <div className="text-[11px] text-slate-300">Wilds alive: {aliveWilds.length}/5 {target ? `• Target: ${target.nickname} ${target.hp}/${target.maxHp} HP (${target.temperament})${target.telegraph ? ' — ATTACK INCOMING, DODGE!' : ''}` : ''}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowGarden(true)} className="game-button px-3 py-2 text-sm">Garden / Daycare</button>
          <button onClick={onBack} className="game-button px-3 py-2 text-sm">Exit Creature Mode</button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-40 game-panel-bottom p-3 max-h-[52vh] overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="text-sm text-white mb-2">{log}</div>
        <div className="grid grid-cols-4 gap-2">
          {active.moves.slice(0, 4).map((mId, i) => {
            const remaining = Math.max(0, (cooldowns[i] || 0) - now);
            return (
              <button key={i} onClick={() => attackTarget(i)} disabled={remaining > 0} className="game-button px-2 py-2 text-sm disabled:opacity-50">
                {i + 1}. {MOVES_DB[mId]?.name || mId}{remaining > 0 ? ` (${Math.ceil(remaining / 1000)}s)` : ''}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={doDodge} className="game-button px-3 py-1.5 text-sm flex-1">Dodge (Space)</button>
          <button onClick={doHop} className="game-button px-3 py-1.5 text-sm flex-1">Hop (Q)</button>
          <button onClick={doSwitch} disabled={switchRemaining > 0} className="game-button px-3 py-1.5 text-sm flex-1 disabled:opacity-50">Tag-Switch (Tab){switchRemaining > 0 ? ` (${Math.ceil(switchRemaining / 1000)}s)` : ''}</button>
          <button onClick={catchTarget} className="game-button px-3 py-1.5 text-sm flex-1">Catch (Luigi Cube)</button>
        </div>
        <div className="mt-3">
          <div className="text-white font-bold text-sm mb-1">Wild creatures (tap to target)</div>
          <div className="flex flex-wrap gap-2">
            {wilds.map(w => (
              <button key={w.id} onClick={() => { setTargetId(w.id); setLog(`Target: ${w.nickname} (${w.temperament}), ${w.hp}/${w.maxHp} HP at (${Math.floor(w.x)}, ${Math.floor(w.y)}).`); }} className={`game-button px-3 py-1.5 text-sm ${w.id === target?.id ? 'ring-2 ring-yellow-300' : ''} ${w.hp <= 0 ? 'opacity-50' : ''}`}>
                {w.nickname} ({w.temperament}) {w.hp}/{w.maxHp}{w.telegraph ? ' ⚠' : ''}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-white font-bold text-sm mb-1">Data Tape Transform — play as a recorded creature</div>
          <div className="flex flex-wrap gap-2">
            {party.map((p, i) => (
              <button key={p.id} onClick={() => { setActiveIdx(i); setLog(`Data Tape Transform: playing as ${p.nickname} (recorded creature).`); }} className={`game-button px-3 py-1.5 text-sm ${i === activeIdx ? 'ring-2 ring-yellow-300' : ''}`}>
                Tape: {p.nickname}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-white font-bold text-sm mb-1">Guardian Training</div>
          {guardian ? (
            <div className="text-sm text-slate-200">{guardianLabel(guardian)} — defending the Garden in Creature Mode training.</div>
          ) : (
            <div className="text-xs text-slate-400">No Guardian assigned yet. Assign the creature you are playing as to defend a Garden.</div>
          )}
          <button
            onClick={() => {
              if (guardian) { setGuardian(null); setLog('Guardian released from Garden duty.'); }
              else if (active) { setGuardian({ creatureId: active.id, nickname: active.nickname, garden: 'Mainframe Gardens' }); setLog(`${active.nickname} assigned as Guardian of the Mainframe Gardens!`); }
            }}
            className="game-button px-3 py-1.5 text-sm mt-2"
          >
            {guardian ? 'Release Guardian' : 'Assign as Garden Guardian'}
          </button>
        </div>
        <div className="text-[11px] text-slate-400 mt-2">
          Hitstop 90ms with HP draining after it, tag-team pack engagement, territorial strafe.
        </div>
      </div>
      {showGarden && (
        <div className="game-screen bg-[#0b1526] absolute inset-0 z-50 overflow-y-auto p-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-white text-lg">Garden / Daycare</div>
            <button onClick={() => setShowGarden(false)} className="game-button px-3 py-2 text-sm">Back</button>
          </div>
          <div className="text-sm text-slate-300 mb-3">Dedicated full screen, in the FireRed screen pattern (menu / summary screens are full screens, not popups). Garden Form is palette + accessories + aura — it never changes species or evolution.</div>
          {gardenFormPres ? (
            <div className="game-panel p-3 mb-3">
              <div className="font-bold text-white text-sm mb-2">{active.nickname} — {gardenFormPres.form} • {gardenFormPres.alignment}</div>
              <div className="text-sm text-slate-200 mb-2">Palette: {gardenFormPres.palettePrimary ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: gardenFormPres.palettePrimary }} />
                  <span className="inline-block w-4 h-4 rounded" style={{ background: gardenFormPres.paletteAccent || '#ffffff' }} />
                  {gardenFormPres.palettePrimary} / {gardenFormPres.paletteAccent}
                </span>
              ) : 'base colour (Neutral — the species\' own colours)'} • Aura: {gardenFormPres.auraColor ? `${gardenFormPres.auraColor} (${gardenFormPres.auraStrength}) — also shown as the ring under {active.nickname} in-world` : 'none (Base form has no aura layer)'}</div>
              <div className="text-sm text-slate-200">Dominant Garden stat: {gardenFormPres.dominant} • Colorway: {gardenFormPres.colorway} • Battle bonus: +{gardenFormPres.bonusPct.toFixed(1)}% (capped +9%)</div>
              <div className="text-sm text-slate-200">Garden stats — Dive {gardenFormPres.garden.dive} • Glide {gardenFormPres.garden.glide} • Sprint {gardenFormPres.garden.sprint} • Might {gardenFormPres.garden.might} • Endurance {gardenFormPres.garden.endurance}</div>
              <div className="text-sm text-slate-200">Bond {gardenFormPres.bond} • Care mistakes {gardenFormPres.careMistakes} • Accessories (parts): {gardenFormPres.parts.length > 0 ? gardenFormPres.parts.join(', ') : 'none'}</div>
              <div className="text-[11px] text-slate-400 mt-2">Palette sprite sheets are sprite-lane production. Until those sheets land, palette here is swatches + the in-world aura ring — an overlay, not a new sheet, and not a species change.</div>
              {active && creaturePaletteSheetUrl(active.speciesId, gardenFormPres.alignment) && (
                <div className="mt-2">
                  <div className="text-sm text-slate-200">Garden Form palette sheet ({gardenFormPres.alignment}, palette swap of the walk frame — not a hand-drawn atlas):</div>
                  <img src={creaturePaletteSheetUrl(active.speciesId, gardenFormPres.alignment)!} alt={`${gardenFormPres.alignment} palette`} style={{ width: 64, height: 64, imageRendering: 'pixelated' }} />
                </div>
              )}
            </div>
          ) : (
            <div className="game-panel p-3 mb-3 text-sm text-slate-200">No Garden record yet for {active.nickname}. Feed and train in the Garden to earn a Garden Form — bonus is 0 until then, not faked.</div>
          )}
          <div className="game-panel p-3 mb-3">
            <div className="font-bold text-white text-sm mb-2">Chao data (SA structure, Mochiichao values)</div>
            {saChaoPres ? (
              <div>
                <div className="text-sm text-slate-200">Power/Run slider: {saChaoPres.powerRunSlider} (Sprint − Might, −99 to +99) • Fly/Swim slider: {saChaoPres.flySwimSlider} (Dive − Glide, −99 to +99)</div>
                <div className="text-sm text-slate-200">Alignment: {saChaoPres.alignmentNumeric} (−1 Umbral / 0 Neutral / +1 Bright) • Evolution progress: {(saChaoPres.evolutionProgress * 100).toFixed(1)}% • Happiness: {saChaoPres.happiness} (= Bond)</div>
                <div className="text-[11px] text-slate-400 mt-1">Stat grades, lifespan, and reincarnation count are not shown — the store has no grade/lifespan/rebirth fields yet, so they are not guessed. Source: SA Tools + ChaoModding docs (ChaoDataStruct), pulled 2026-10-26, open source only.</div>
              </div>
            ) : (
              <div className="text-sm text-slate-200">No Garden record yet — sliders and progress are 0 until then, not faked.</div>
            )}
          </div>
          <div className="game-panel p-3 mb-3">
            <div className="font-bold text-white text-sm mb-2">Daycare slots (FireRed daycare structure)</div>
            <div className="text-sm text-slate-200">Daycare steps (persisted, tile changes while a Guardian is assigned): {daycareSteps} • EXP on retrieve: {daycareSteps * DAYCARE_EXP_PER_STEP} (FireRed: 1 EXP per step).</div>
            <div className="text-sm text-slate-200">Slot 1: {guardian ? `${guardian.nickname} — Guardian, ${guardian.garden}` : 'Empty — assign a Guardian from Creature Mode'}</div>
            <div className="text-sm text-slate-200">Slot 2 (Partner): {daycarePartner ? `${daycarePartner.nickname} — Partner, ${daycarePartner.garden}` : 'Empty — assign a Partner from Creature Mode'}</div>
            <button className="game-button mt-1 mr-2" onClick={() => {
              if (!active) return;
              if (guardian && active.id === guardian.creatureId) { setLog('That creature is already the Guardian — pick a different party creature as Partner.'); return; }
              setDaycarePartner({ creatureId: active.id, nickname: active.nickname, garden: 'Mainframe Gardens' });
              setLog(`${active.nickname} assigned as Daycare Partner.`);
            }}>Assign active creature as Partner</button>
            {daycarePartner && <button className="game-button mt-1" onClick={() => { setDaycarePartner(null); setLog('Daycare Partner released.'); }}>Release Partner</button>}
            <div className="text-sm text-slate-200">Compatibility: {(() => {
              if (!guardian || !daycarePartner) return '— no pair yet (needs Guardian + Partner)';
              const g = party.find(p => p.id === guardian.creatureId);
              const q = party.find(p => p.id === daycarePartner.creatureId);
              if (!g || !q) return '— pair not in party, no number faked';
              const c = daycareCompatibility({ hasSecondCreature: true, sameSpecies: g.speciesId === q.speciesId });
              return `${c!.score} (FireRed table: same species, same trainer = 50; different species, same trainer = 20; gender is not a Mochiichao gate, one shared breeding group)`;
            })()}</div>
            <div className="text-sm text-slate-200">Egg: {daycareEgg ? `${daycareEgg.speciesId} egg (parents ${daycareEgg.parentA} + ${daycareEgg.parentB}) — hatch after ${Math.max(0, 256 - (daycareSteps - daycareEgg.createdAtSteps))} more steps` : (daycareEggReady(daycareSteps, !!daycarePartner) ? 'check hit — press Check for Egg' : 'none — needs Guardian + Partner and a 256-step check hit (FireRed: steps & 0xFF == 0xFF)')}</div>
            {guardian && daycarePartner && !daycareEgg && (
              <button className="game-button mt-1" onClick={() => {
                if (!daycareEggReady(daycareSteps, true)) { setLog('No egg check hit yet — walk until daycare steps hit a 256 multiple.'); return; }
                const g = party.find(p => p.id === guardian!.creatureId);
                const q = party.find(p => p.id === daycarePartner!.creatureId);
                if (!g || !q) { setLog('Egg check failed: pair not in party.'); return; }
                const c = daycareCompatibility({ hasSecondCreature: true, sameSpecies: g.speciesId === q.speciesId })!;
                if (c.score > Math.random() * 100) {
                  setDaycareEgg({ speciesId: g.speciesId, parentA: g.nickname, parentB: q.nickname, createdAtSteps: daycareSteps });
                  setLog(`Egg created! ${g.speciesId} egg (base form of ${g.nickname}). Hatch after 256 more steps.`);
                } else setLog(`No egg this check (compatibility ${c.score}). Walk to the next 256-step check.`);
              }}>Check for Egg</button>
            )}
            {daycareEgg && daycareSteps - daycareEgg.createdAtSteps >= 256 && (
              <button className="game-button mt-1" onClick={() => {
                const baby = createMochii(daycareEgg!.speciesId, 5);
                if (!baby) { setLog('Hatch failed: species not found.'); return; }
                addMochii(baby);
                setDaycareEgg(null);
                setLog(`${baby.nickname} hatched at Lv 5 and joined your party/PC!`);
              }}>Hatch Egg</button>
            )}
            {guardian && daycareSteps > 0 && (() => {
              const idx = party.findIndex(p => p.id === guardian.creatureId);
              if (idx < 0) return <div className="text-sm text-slate-200">Retrieve: Guardian is not in your party, so no EXP is applied — nothing is faked.</div>;
              const preview = { ...party[idx], stats: { ...party[idx].stats } };
              const before = preview.level;
              gainExp(preview, daycareSteps * DAYCARE_EXP_PER_STEP);
              const cost = daycareRetrieveCost(preview.level - before);
              return (
                <div className="mt-2">
                  <div className="text-sm text-slate-200">Retrieve preview: Lv {before} → Lv {preview.level} ({preview.level - before} levels) • Cost {cost} CR • Wallet {wallet} CR</div>
                  <button className="game-button mt-1" onClick={() => {
                    const st = useGameStore.getState();
                    const i = st.party.findIndex(p => p.id === guardian!.creatureId);
                    if (i < 0) { setLog('Retrieve failed: Guardian not in party.'); return; }
                    const updated = { ...st.party[i], stats: { ...st.party[i].stats } };
                    const lv0 = updated.level;
                    gainExp(updated, st.daycareSteps * DAYCARE_EXP_PER_STEP);
                    const fee = daycareRetrieveCost(updated.level - lv0);
                    if (st.wallet < fee) { setLog(`Retrieve needs ${fee} CR, wallet has ${st.wallet} CR.`); return; }
                    st.updatePartyMember(i, updated);
                    st.gainWallet(-fee);
                    st.setDaycareSteps(0);
                    setLog(`${guardian!.nickname} retrieved: Lv ${lv0} → Lv ${updated.level}, ${fee} CR paid, daycare steps reset.`);
                  }}>Retrieve Guardian (apply EXP, pay cost)</button>
                </div>
              );
            })()}
            <div className="text-[11px] text-slate-400 mt-1">Pass 8: level gain wired (FireRed 1 EXP/step, cost 100 + 100/level in CR, via engine gainExp); compatibility wired as 50 same-species / 20 different-species (same trainer, one shared breeding group, gender not a Mochiichao gate — see creatureDaycare.ts); egg roll at 256-step checks, egg species = Guardian's base form, hatches at Lv 5 after 256 more steps.</div>
          </div>
          <div className="game-panel p-3">
            <div className="font-bold text-white text-sm mb-2">Mainframe Gardens (environments)</div>
            {MAINFRAME_GARDENS.map(g => (
              <div key={g.name} className="text-sm text-slate-200">{g.name} — {g.alignment} • {g.capacity} creatures per garden</div>
            ))}
            <div className="text-[11px] text-slate-400 mt-1">Creature Mode still runs on Sector 0. These are the Garden environments from the conversion doc, listed here — no new tileset is invented in this lane.</div>
          </div>
        </div>
      )}
    </div>
  );
}
