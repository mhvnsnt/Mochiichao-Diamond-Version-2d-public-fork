import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MochiiInstance } from '../../lib/types';
import { createMochii, gainExp } from '../../lib/engine';
import { SPECIES_DB } from '../../lib/species';
import { MOVES_DB } from '../../lib/moves';
import { calcTypeMultiplier, TYPES } from '../../lib/constants';
import { creatureDisplayName } from '../../lib/spriteSheets';
import { fuseStats, fusionName } from '../../lib/monster-tamer-systems';
import CreaturePortrait from '../game/CreaturePortrait';
import HumanPortrait from '../game/HumanPortrait';
import { UiPanel } from '../game/UiArt';
import { UI_ART } from '../../lib/uiArt';
import { playerSlot } from '../../lib/humanSheets';
import PixiBattleCanvas, { BattleAttack } from '../game/PixiBattleCanvas';

type BattleState = 'START' | 'PLAYER_TURN' | 'ANIMATING' | 'ENEMY_TURN' | 'CAUGHT' | 'VICTORY' | 'DEFEAT' | 'FLED' | 'SWITCH_CHOICE';

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
  const [attack, setAttack] = useState<BattleAttack | null>(null);
  // Selected move (hover/focus, not a turn action): its PP + TYPE stay
  // visible in a dedicated line, as in the decomp move-menu windows.
  const [selectedMove, setSelectedMove] = useState(0);
  // Data Fusion (monster-tamer spec step 1): temporary, one battle only.
  // This state lives in this component, so leaving the battle ends the
  // fusion; Data Revert (the Split button) ends it mid-battle. The two
  // creatures themselves are never merged in the store — only the
  // attacker used for this battle's damage math is the fused form.
  const [fusedPartnerIdx, setFusedPartnerIdx] = useState<number | null>(null);
  const fusionPartner = fusedPartnerIdx !== null ? party[fusedPartnerIdx] : undefined;
  const fusedAttacker = playerActive && fusionPartner
    ? { ...playerActive, nickname: fusionName(playerActive.nickname, fusionPartner.nickname), stats: fuseStats(playerActive.stats, fusionPartner.stats) }
    : null;
  const playerGender = useGameStore(s => s.playerGender);
  // Settings wiring: BATTLE SCENE (ON/OFF) and BATTLE STYLE (SHIFT/SET).
  const battleScene = useGameStore(s => s.settings.battleScene);
  const battleStyle = useGameStore(s => s.settings.battleStyle);
  const [switchOptions, setSwitchOptions] = useState<Array<{ idx: number; m: MochiiInstance }> | null>(null);
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
      // BATTLE SCENE OFF skips the intro delay; ON keeps 1000ms.
      setTimeout(() => setBState('PLAYER_TURN'), battleScene === 'OFF' ? 0 : 1000);
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
          setBState('ENEMY_TURN');
        }
      }, battleScene === 'OFF' ? 0 : 1500);
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
        // BATTLE STYLE: SHIFT offers a switch choice; SET sends the
        // next alive creature automatically (pre-existing behaviour).
        const aliveOpts = party
          .map((p, idx) => ({ idx, m: idx === activeIdx ? { ...p, hp: newPlayerHp } : p }))
          .filter(o => o.m.hp > 0);
        if (battleStyle === 'SHIFT' && aliveOpts.length > 0) {
          pushLog('Choose your next Mochiichao!');
          setSwitchOptions(aliveOpts);
          setBState('SWITCH_CHOICE');
          return;
        }
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
    const result = executeDamage(fusedAttacker || playerActive, enemy, moveId);
    pushLog(result.text);
    // BATTLE SCENE OFF: apply damage directly, no Pixi animation.
    // This mirrors onAttackDone's player branch with computed HP
    // (not stale closure state), so no animation frame is needed.
    if (battleScene === 'OFF') {
      const newEnemyHp = Math.max(0, enemy.hp - result.damage);
      setEnemy({ ...enemy, hp: newEnemyHp });
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
      return;
    }
    setBState('ANIMATING');
    // Fused attacker: same species/types as the active creature (for
    // STAB in executeDamage), fused stats + fused name only.
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
        // BATTLE SCENE OFF: apply enemy damage directly, mirroring
        // onAttackDone's enemy branch with computed HP.
        if (battleScene === 'OFF') {
          const newPlayerHp = Math.max(0, playerActive.hp - result.damage);
          updatePartyMember(activeIdx, { ...playerActive, hp: newPlayerHp });
          if (newPlayerHp <= 0) {
            pushLog(`${playerActive.nickname} fainted!`);
            const aliveOpts = party
              .map((p, idx) => ({ idx, m: idx === activeIdx ? { ...p, hp: newPlayerHp } : p }))
              .filter(o => o.m.hp > 0);
            if (battleStyle === 'SHIFT' && aliveOpts.length > 0) {
              pushLog('Choose your next Mochiichao!');
              setSwitchOptions(aliveOpts);
              setBState('SWITCH_CHOICE');
            } else if (aliveOpts.length > 0) {
              pushLog(`Go! ${aliveOpts[0].m.nickname}!`);
              setActiveIdx(aliveOpts[0].idx);
              setBState('PLAYER_TURN');
            } else {
              pushLog('You have no more Mochiichao. You blacked out!');
              setBState('DEFEAT');
              setTimeout(onLeave, 3000);
            }
          } else {
            setBState('PLAYER_TURN');
          }
          return;
        }
            (window as any).__battleLastAttack = { attacker: 'enemy', text: result.text };
        pendingRef.current = { damage: result.damage, text: result.text, attacker: 'enemy', moveId: randomMove };
        setAttack({ nonce: Date.now(), attacker: 'enemy', category: move?.cat || 'Physical', color: move ? TYPES[move.type]?.color || '#ffffff' : '#ffffff' });
      }, battleScene === 'OFF' ? 0 : 1000);
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
        {/* HP healthboxes: one box each (name + Lv + bar inside the box,
            bar offset inside the box below the name row), green >50% /
            yellow >20% / red <=20% — thresholds already matched the
            decomp rule, kept unchanged. React layer above canvas, never
            moves with shake. Placement: enemy top-left, player
            bottom-right. */}
        <div className="absolute top-3 left-3 pointer-events-none z-10 w-[46%] max-w-[280px]">
          <div className="game-panel px-3 py-2" style={{ fontFamily: 'var(--battle-font, "Trebuchet MS", sans-serif)' }}>
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
          <div className="game-panel px-3 py-2" style={{ fontFamily: 'var(--battle-font, "Trebuchet MS", sans-serif)' }}>
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
        {/* Small portraits in the corners, for creatures whose sheet is the proof */}
        <div className="absolute bottom-2 left-2 opacity-90 pointer-events-none hidden sm:block">
          <HumanPortrait slot={playerSlot(playerGender)} view="back" size={56} />
        </div>
        <div className="absolute bottom-2 right-2 opacity-90 pointer-events-none hidden sm:block">
          <CreaturePortrait speciesId={enemy.speciesId} view="front" size={56} />
        </div>
      </div>

      {/* Battle menu: current message in a bottom full-width framed box
          (PR #14 SVG dialogue-box panel), log kept below it, then the
          2x2 move grid + Luigi Cube + Flee. No title in battle; the
          Pixi arena canvas stays above/behind this panel, never a
          blank background. */}
      {/* Battle text (message + log) uses the DIALOGUE FONT placement;
          healthboxes and headings above use the MAIN FONT stack. */}
      <div className="game-panel-bottom flex flex-col shrink-0 z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)', fontFamily: 'var(--battle-font, "Trebuchet MS", "Segoe UI", system-ui, sans-serif)' }}>
        <UiPanel
          slot={UI_ART.battle_panel}
          style={{ margin: '8px 12px 0', padding: '12px 16px', minHeight: '56px' }}
        >
          <div className="text-white font-bold text-base leading-relaxed">
            {log.length > 0 ? log[log.length - 1] : `A wild ${creatureDisplayName(enemy.speciesId)} appeared!`}
          </div>
        </UiPanel>
        {switchOptions && (
          <div className="mx-3 mt-2 game-panel p-3">
            <div className="text-white font-bold text-sm mb-2">Choose your next Mochiichao! (BATTLE STYLE: SHIFT)</div>
            <div className="flex flex-wrap gap-2">
              {switchOptions.map(o => (
                <button key={o.idx} onClick={() => { pushLog(`Go! ${o.m.nickname}!`); setActiveIdx(o.idx); setSwitchOptions(null); setBState('PLAYER_TURN'); }} className="game-button px-3 py-2 text-sm font-bold min-h-[48px]">
                  {o.m.nickname} (Lv.{o.m.level}, {Math.ceil(o.m.hp)}/{o.m.maxHp} HP)
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex">
          <div ref={logRef} className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 text-sm text-slate-200 min-h-[56px] max-h-[88px]">
            {log.map((l, i) => (
              <div key={i} className={i === log.length - 1 ? 'text-white font-bold' : 'opacity-70'}>{l}</div>
            ))}
            {bState === 'START' && <div className="animate-pulse">A wild {creatureDisplayName(enemy.speciesId)} appeared!</div>}
          </div>
          <div className="p-3 w-full sm:w-[46%] shrink-0">
            {(() => {
              const selId = playerActive.moves[selectedMove];
              const sel = selId ? MOVES_DB[selId] : undefined;
              return sel ? (
                <div className="text-xs text-slate-200 mb-2">
                  Selected: <span className="font-bold text-white">{sel.name}</span>
                  {' · '}{TYPES[sel.type]?.name || sel.type}
                  {' · '}PP {playerActive.pp[selectedMove]}/{sel.pp}
                </div>
              ) : null;
            })()}
            <div className="grid grid-cols-2 gap-2">
              {playerActive.moves.slice(0, 4).map((mId, i) => {
                const mv = MOVES_DB[mId];
                const color = mv ? TYPES[mv.type]?.color : '#888888';
                return (
                  <button
                    key={i}
                    disabled={bState !== 'PLAYER_TURN'}
                    onClick={() => handlePlayerMove(mId)}
                    onMouseEnter={() => setSelectedMove(i)}
                    onFocus={() => setSelectedMove(i)}
                    className={`game-button text-left px-3 py-2 disabled:opacity-50 ${i === selectedMove ? 'ring-2 ring-yellow-300' : ''}`}
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
            {/* Data Fusion (monster-tamer spec step 1): one battle only.
                Partner = first other alive party member. Fusion form is
                a placeholder — both creatures' existing sheets shown
                together below — until the Sprite Art lane makes a
                fusion sheet. No new likeness is generated here. */}
            {fusedAttacker && fusionPartner ? (
              <div className="mt-2 game-panel p-2 flex items-center gap-2">
                <CreaturePortrait speciesId={playerActive.speciesId} view="front" size={40} />
                <span className="text-white font-bold text-sm">+</span>
                <CreaturePortrait speciesId={fusionPartner.speciesId} view="front" size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-xs truncate">{fusedAttacker.nickname}</div>
                  <div className="text-[11px] text-slate-300">Fusion form (placeholder sheets) · ATK {fusedAttacker.stats.atk} · lasts this battle</div>
                </div>
                <button onClick={() => { pushLog(`Data Revert split ${playerActive.nickname} and ${fusionPartner.nickname} back!`); setFusedPartnerIdx(null); }} className="game-button px-2 py-1 text-xs shrink-0">Split (Data Revert)</button>
              </div>
            ) : (
              (() => {
                const partnerIdx = party.findIndex((p, i) => i !== activeIdx && p.hp > 0);
                return partnerIdx !== -1 ? (
                  <button
                    disabled={bState !== 'PLAYER_TURN'}
                    onClick={() => { setFusedPartnerIdx(partnerIdx); pushLog(`${playerActive.nickname} fused with ${party[partnerIdx].nickname}! Data Fusion — one battle only.`); }}
                    className="game-button mt-2 w-full px-3 py-2 text-sm text-purple-200"
                  >
                    Fuse with {party[partnerIdx].nickname} (Data Fusion)
                  </button>
                ) : null;
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
