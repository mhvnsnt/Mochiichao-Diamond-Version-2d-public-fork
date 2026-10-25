import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MochiiInstance } from '../../lib/types';
import { createMochii, gainExp } from '../../lib/engine';
import { SPECIES_DB } from '../../lib/species';
import { MOVES_DB } from '../../lib/moves';
import { calcTypeMultiplier, TYPES } from '../../lib/constants';
import { creatureDisplayName } from '../../lib/spriteSheets';
import CreaturePortrait from '../game/CreaturePortrait';
import HumanPortrait from '../game/HumanPortrait';
import { playerSlot } from '../../lib/humanSheets';
import PixiBattleCanvas, { BattleAttack } from '../game/PixiBattleCanvas';

type BattleState = 'START' | 'PLAYER_TURN' | 'ANIMATING' | 'ENEMY_TURN' | 'CAUGHT' | 'VICTORY' | 'DEFEAT' | 'FLED';

/**
 * Battle, mod layer: the turn-based logic from the previous BattleView is
 * kept (same damage, catch, EXP, wallet math), the presentation is now a
 * PixiJS arena canvas with the Arena-spec timeline (cue -> windup ->
 * lunge/projectile with both creatures on screen at impact -> HP drain
 * at the triggered frame -> return). HP bars and names are React, above
 * the canvas, and never move with the camera/shake. No Pokemon sprites
 * are fetched here anymore: creatures render from Mochiichao sheets or
 * the original silhouette fallback.
 */
export default function BattleView({ enemyId, onLeave }: { enemyId: string | null, onLeave: () => void }) {
  const party = useGameStore(s => s.party);
  const addMochii = useGameStore(s => s.addMochii);
  const gainWallet = useGameStore(s => s.gainWallet);
  const inventory = useGameStore(s => s.inventory);
  const useItemState = useGameStore(s => s.useItem);
  const updatePartyMember = useGameStore(s => s.updatePartyMember);
  const updateDex = useGameStore(s => s.updateDex);

  const [activeIdx, setActiveIdx] = useState(0);
  const playerActive = party[activeIdx];
  const [enemy, setEnemy] = useState<MochiiInstance | null>(null);
  const [bState, setBState] = useState<BattleState>('START');
  const [log, setLog] = useState<string[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [attack, setAttack] = useState<BattleAttack | null>(null);
  const playerGender = useGameStore(s => s.playerGender);
  const pendingRef = useRef<{ damage: number; text: string; attacker: 'player' | 'enemy'; moveId: string } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const pushLog = (msg: string) => setLog(prev => [...prev.slice(-15), msg]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    if (!enemyId) { onLeave(); return; }
    const firstAlive = party.findIndex(p => p.hp > 0);
    if (firstAlive === -1) { onLeave(); return; }
    setActiveIdx(firstAlive);
    const level = Math.max(1, party[0].level + Math.floor(Math.random() * 3) - 1);
    const newEnemy = createMochii(enemyId, level);
    if (newEnemy) {
      setEnemy(newEnemy);
      updateDex(enemyId, 'seen');
      pushLog(`A wild ${newEnemy.nickname} appeared!`);
      setTimeout(() => setBState('PLAYER_TURN'), 1000);
    } else {
      onLeave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRun = () => {
    pushLog('You fled the battle!');
    setBState('ANIMATING');
    setTimeout(onLeave, 1500);
  };

  const handleCatch = () => {
    if (!enemy) return;
    if (inventory['luigi_cube'] > 0) {
      useItemState('luigi_cube');
      pushLog('You threw a Luigi Cube!');
      setBanner('Luigi Cube!');
      setBState('ANIMATING');
      setTimeout(() => {
        const catchRate = SPECIES_DB[enemy.speciesId].catchRate;
        const hpFactor = (3 * enemy.maxHp - 2 * enemy.hp) / (3 * enemy.maxHp);
        const chance = (catchRate * hpFactor) / 255;
        if (Math.random() < chance + 0.3) {
          pushLog(`Gotcha! ${enemy.nickname} was caught!`);
          addMochii(enemy);
          setBState('CAUGHT');
          setTimeout(onLeave, 2000);
        } else {
          pushLog('Oh no! The Mochiichao broke free!');
          setBanner(null);
          setBState('ENEMY_TURN');
        }
      }, 1500);
    } else {
      pushLog('You have no Luigi Cubes!');
    }
  };

  const executeDamage = (attacker: MochiiInstance, defender: MochiiInstance, moveId: string) => {
    const move = MOVES_DB[moveId];
    if (!move || move.cat === 'Status') return { damage: 0, text: `${attacker.nickname} used ${move?.name || 'a move'}!` };
    const aStat = move.cat === 'Physical' ? attacker.stats.atk : attacker.stats.spa;
    const dStat = move.cat === 'Physical' ? defender.stats.def : defender.stats.spd;
    let baseDmg = Math.floor(Math.floor(Math.floor(2 * attacker.level / 5 + 2) * move.bp * aStat / dStat) / 50) + 2;
    const defenderType1 = SPECIES_DB[defender.speciesId].types[0];
    const defenderType2 = SPECIES_DB[defender.speciesId].types[1];
    const typeMult = calcTypeMultiplier(move.type, defenderType1, defenderType2);
    const isStab = SPECIES_DB[attacker.speciesId].types.includes(move.type);
    const stabMult = isStab ? 1.5 : 1;
    const crit = Math.random() < 0.06 ? 1.5 : 1.0;
    const roll = (85 + Math.random() * 15) / 100;
    const finalDmg = Math.floor(baseDmg * typeMult * stabMult * crit * roll);
    let narrative = `${attacker.nickname} used ${move.name}! `;
    if (typeMult > 1) narrative += "It's super effective! ";
    if (typeMult < 1 && typeMult > 0) narrative += "It's not very effective... ";
    if (typeMult === 0) narrative += "It had no effect... ";
    if (crit > 1) narrative += "A critical hit! ";
    return { damage: finalDmg, text: narrative };
  };

  // Called by the Pixi canvas at the impact frame: HP drains here, not before.
  const onAttackImpact = () => {
    const p = pendingRef.current;
    if (!p || !enemy) return;
    pendingRef.current = null;
    if (p.attacker === 'player') {
      const newEnemyHp = Math.max(0, enemy.hp - p.damage);
      setEnemy(prev => prev ? { ...prev, hp: newEnemyHp } : null);
      (window as any).__battleEnemyHp = newEnemyHp;
    } else if (playerActive) {
      const newPlayerHp = Math.max(0, playerActive.hp - p.damage);
      updatePartyMember(activeIdx, { ...playerActive, hp: newPlayerHp });
      (window as any).__battlePlayerHp = newPlayerHp;
    }
  };

  const onAttackDone = () => {
    const p = (window as any).__battleLastAttack as { attacker: 'player' | 'enemy'; text: string } | undefined;
    setBanner(null);
    const enemyHp = (window as any).__battleEnemyHp as number | undefined;
    const playerHp = (window as any).__battlePlayerHp as number | undefined;
    if (p?.attacker === 'player' && enemy) {
      const newEnemyHp = enemyHp ?? enemy.hp;
      if (newEnemyHp <= 0) {
        pushLog(`Enemy ${enemy.nickname} fainted!`);
        const expGained = Math.floor((SPECIES_DB[enemy.speciesId].baseExpYield * enemy.level) / 5);
        pushLog(`${playerActive.nickname} gained ${expGained} EXP!`);
        const { leveledUp, newLevel } = gainExp(playerActive, expGained);
        if (leveledUp) pushLog(`${playerActive.nickname} grew to Level ${newLevel}!`);
        updatePartyMember(activeIdx, playerActive);
        gainWallet(50);
        pushLog('You found 50 Credits.');
        setBState('VICTORY');
        setTimeout(onLeave, 3000);
      } else {
        setBState('ENEMY_TURN');
      }
    } else if (p?.attacker === 'enemy' && playerActive) {
      const newPlayerHp = playerHp ?? playerActive.hp;
      if (newPlayerHp <= 0) {
        pushLog(`${playerActive.nickname} fainted!`);
        const nextIdx = party.findIndex(p => p.hp > 0);
        if (nextIdx !== -1) {
          pushLog(`Go! ${party[nextIdx].nickname}!`);
          setActiveIdx(nextIdx);
          setBState('PLAYER_TURN');
        } else {
          pushLog('You have no more Mochiichao. You blacked out!');
          setBState('DEFEAT');
          setTimeout(onLeave, 3000);
        }
      } else {
        setBState('PLAYER_TURN');
      }
    }
  };

  const handlePlayerMove = (moveId: string) => {
    if (!enemy || bState !== 'PLAYER_TURN' || !playerActive) return;
    const move = MOVES_DB[moveId];
    setBState('ANIMATING');
    const result = executeDamage(playerActive, enemy, moveId);
    pushLog(result.text);
    setBanner(move ? move.name : 'Attack');
    (window as any).__battleLastAttack = { attacker: 'player', text: result.text };
    pendingRef.current = { damage: result.damage, text: result.text, attacker: 'player', moveId };
    setAttack({ nonce: Date.now(), attacker: 'player', category: move?.cat || 'Physical', color: move ? TYPES[move.type]?.color || '#ffffff' : '#ffffff' });
  };

  useEffect(() => {
    if (bState === 'ENEMY_TURN' && enemy && playerActive) {
      const t = setTimeout(() => {
        const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
        const move = MOVES_DB[randomMove];
        const result = executeDamage(enemy, playerActive, randomMove);
        pushLog(result.text);
        setBanner(move ? move.name : 'Attack');
        (window as any).__battleLastAttack = { attacker: 'enemy', text: result.text };
        pendingRef.current = { damage: result.damage, text: result.text, attacker: 'enemy', moveId: randomMove };
        setAttack({ nonce: Date.now(), attacker: 'enemy', category: move?.cat || 'Physical', color: move ? TYPES[move.type]?.color || '#ffffff' : '#ffffff' });
      }, 1000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bState]);

  if (!playerActive || !enemy) return null;

  const playerPct = Math.max(0, (playerActive.hp / playerActive.maxHp) * 100);
  const enemyPct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const hpColor = (pct: number) => pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336';

  return (
    <div className="game-screen flex flex-col bg-[#0b1526] relative overflow-hidden">
      {/* Pixi arena canvas */}
      <div className="relative flex-1 min-h-0">
        <PixiBattleCanvas
          playerSpeciesId={playerActive.speciesId}
          enemySpeciesId={enemy.speciesId}
          attack={attack}
          onImpact={onAttackImpact}
          onDone={onAttackDone}
        />
        {/* HP bars + names: React layer above canvas, never moves with shake.
            Placement (Pokemon-style battle layout, Arena spec §3): enemy
            name/HP top-left, player name/HP/numbers bottom-right. */}
        <div className="absolute top-3 left-3 pointer-events-none z-10 w-[46%] max-w-[280px]">
          <div className="game-panel px-3 py-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-white uppercase text-sm truncate">{enemy.nickname}</span>
              <span className="text-xs text-slate-300">Lv.{enemy.level}</span>
            </div>
            <div className="h-2.5 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
              <div className="h-full transition-all duration-300" style={{ width: `${enemyPct}%`, background: hpColor(enemyPct) }} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none z-10 w-[46%] max-w-[280px]">
          <div className="game-panel px-3 py-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-white uppercase text-sm truncate">{playerActive.nickname}</span>
              <span className="text-xs text-slate-300">Lv.{playerActive.level}</span>
            </div>
            <div className="text-[11px] text-slate-300 text-right">{Math.ceil(playerActive.hp)} / {playerActive.maxHp} HP</div>
            <div className="h-2.5 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
              <div className="h-full transition-all duration-300" style={{ width: `${playerPct}%`, background: hpColor(playerPct) }} />
            </div>
          </div>
        </div>
        {banner && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="game-banner px-6 py-2 text-xl font-black tracking-widest text-white">{banner}</div>
          </div>
        )}
        {/* Small portraits in the corners, for creatures whose sheet is the proof */}
        <div className="absolute bottom-2 left-2 opacity-90 pointer-events-none hidden sm:block">
          <HumanPortrait slot={playerSlot(playerGender)} view="back" size={56} />
        </div>
        <div className="absolute bottom-2 right-2 opacity-90 pointer-events-none hidden sm:block">
          <CreaturePortrait speciesId={enemy.speciesId} view="front" size={56} />
        </div>
      </div>

      {/* Battle menu: log + game buttons */}
      <div className="game-panel-bottom flex shrink-0 z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div ref={logRef} className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 text-sm text-slate-200 min-h-[72px]">
          {log.map((l, i) => (
            <div key={i} className={i === log.length - 1 ? 'text-white font-bold' : 'opacity-70'}>{l}</div>
          ))}
          {bState === 'START' && <div className="animate-pulse">A wild {creatureDisplayName(enemy.speciesId)} appeared!</div>}
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 w-full sm:w-[46%]">
          {playerActive.moves.slice(0, 4).map((mId, i) => {
            const mv = MOVES_DB[mId];
            const color = mv ? TYPES[mv.type]?.color : '#888888';
            return (
              <button
                key={i}
                disabled={bState !== 'PLAYER_TURN'}
                onClick={() => handlePlayerMove(mId)}
                className="game-button text-left px-3 py-2 disabled:opacity-50"
                style={{ borderColor: color }}
              >
                <span className="font-bold text-white block truncate">{mv ? mv.name : '-'}</span>
                {mv && <span className="text-[11px]" style={{ color }}>{TYPES[mv.type]?.name || mv.type} · PP {playerActive.pp[i]}/{mv.pp}</span>}
              </button>
            );
          })}
          <button disabled={bState !== 'PLAYER_TURN'} onClick={handleCatch} className="game-button text-indigo-200">
            Luigi Cube ({inventory['luigi_cube'] || 0})
          </button>
          <button disabled={bState !== 'PLAYER_TURN'} onClick={handleRun} className="game-button text-red-200">
            Flee
          </button>
        </div>
      </div>
    </div>
  );
}
