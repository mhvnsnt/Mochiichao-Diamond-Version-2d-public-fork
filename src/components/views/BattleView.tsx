import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MochiiInstance } from '../../lib/types';
import { createMochii, evolveInstance, gainExp } from '../../lib/engine';
import { SPECIES_DB } from '../../lib/species';
import {
  buildMidFightPrompt,
  getSafeEvolutionRule,
  safeEvolutionReady,
  type MidFightEvolutionPrompt,
} from '../../lib/evolution-hook';
import { MOVES_DB } from '../../lib/moves';
import { TYPES } from '../../lib/constants';
import {
  resolveTurn,
  type Action,
  type BattleEvent,
  type StageMap,
  type TurnResult,
} from '../../lib/battleResolver';
import {
  LEGACY_TYPE_CHART,
  buildLegacyMoveTable,
  carriedFromInstance,
  makeResolverBattler,
  type CarriedBattlerState,
} from '../../lib/battleWiring';
import { creatureDisplayName } from '../../lib/spriteSheets';
import { fuseStats, fusionName } from '../../lib/monster-tamer-systems';
import CreaturePortrait from '../game/CreaturePortrait';
import HumanPortrait from '../game/HumanPortrait';
import { UiPanel } from '../game/UiArt';
import { UI_ART } from '../../lib/uiArt';
import { playerSlot, cellPos } from '../../lib/humanSheets';
import PixiBattleCanvas, { BattleAttack } from '../game/PixiBattleCanvas';
import {
  healthbarStyle, battleHudPositions, moveButtonContainerClass, ppTypeLine,
  messageWindowStyle, damageNumberStyle, menuPanelColor,
  type HealthbarStyle, type BattleHudLayout, type MoveButtonLayout,
  type PpTypeDisplay, type MessageWindowStyle, type DamageNumberStyle,
} from '../../lib/hudCustom';
import { isConfirmKey, shoulderKey } from '../../lib/buttonMode';
import { useMenuSkin, menuSkinVars, menuSkinPanelShadow } from '../../lib/menuSkins';

type BattleState = 'START' | 'PLAYER_TURN' | 'ANIMATING' | 'ENEMY_TURN' | 'CAUGHT' | 'VICTORY' | 'DEFEAT' | 'FLED' | 'SWITCH_CHOICE' | 'EVOLUTION';

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
  // Mid-fight evolution prompt (evolution-hook.ts): set when a level-up
  // meets a safe-chain rule; the victory tail waits behind it until the
  // player confirms or cancels. Null the rest of the time.
  const [evolutionPrompt, setEvolutionPrompt] = useState<MidFightEvolutionPrompt | null>(null);
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
  // Batch A — HUD / border settings (Settings > Menu Creator > UI Creator).
  const settings = useGameStore(s => s.settings);
  const hbStyle = healthbarStyle(settings.hudHealthbar as HealthbarStyle);
  const hudPos = battleHudPositions(settings.hudBattleLayout as BattleHudLayout);
  const battleAccent = menuPanelColor('BATTLE', settings);
  // Y2K skin wiring (skins PR #151 battle presets via menuSkins.ts):
  // null = default look, untouched. When set, healthboxes + command
  // strip + switch panel restyle via menuSkins.css, the selected move
  // wears .skin-selected instead of the yellow ring, and the skin
  // frame colour wins over the BATTLE panel colour. HP thresholds,
  // move type colours, battle math and the Pixi canvas are untouched;
  // the message panel keeps its dialogue-box.svg art when set (see
  // menuSkins.css note), so the strip + healthboxes carry the skin.
  const skin = useMenuSkin('battle');
  const [lastDamage, setLastDamage] = useState<{ amount: number; target: 'enemy' | 'player'; nonce: number } | null>(null);
  useEffect(() => {
    if (!lastDamage) return;
    const t = setTimeout(() => setLastDamage(null), 1400);
    return () => clearTimeout(t);
  }, [lastDamage]);
  // BUTTON MODE (buttonMode.ts): battle had no keyboard handler
  // before this batch — this is its first, PLAYER_TURN only.
  const buttonMode = useGameStore(s => s.settings.buttonMode);
  const [switchOptions, setSwitchOptions] = useState<Array<{ idx: number; m: MochiiInstance }> | null>(null);
  const pendingRef = useRef<{ damage: number; text: string; attacker: 'player' | 'enemy'; moveId: string; damageFraction: number; isCrit: boolean } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  // Resolver wiring (PR #107 -> live BattleView): one resolveTurn call per
  // turn, played back event by event through the existing Pixi pipeline.
  // Per-battle carried state (stages/status/charging) lives in this ref
  // only — it is never written back to the store, so a battle's stages
  // reset when the battle ends. PP is likewise resolver-internal only.
  const battleCarriedRef = useRef<{ player: CarriedBattlerState; foe: CarriedBattlerState } | null>(null);
  const battleHpRef = useRef<{ player: number; foe: number }>({ player: 0, foe: 0 });
  interface QueuedTurn {
    events: BattleEvent[];
    idx: number;
    finalPlayerHp: number;
    finalFoeHp: number;
    finalPlayerStages: StageMap;
    finalFoeStages: StageMap;
    finalPlayerStatus: string | null;
    finalFoeStatus: string | null;
    finalPlayerVolatile: { chargingMoveId?: string | null };
    finalFoeVolatile: { chargingMoveId?: string | null };
    foeSpeciesId: string;
    foeLevel: number;
  }
  const queueRef = useRef<QueuedTurn | null>(null);
  const queueTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (queueTimerRef.current !== null) window.clearTimeout(queueTimerRef.current);
  }, []);

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
      // Resolver per-battle state starts from the instances as created
      // (stages 0, status null) and is carried in a ref for this battle.
      battleCarriedRef.current = {
        player: carriedFromInstance(party[firstAlive]),
        foe: carriedFromInstance(newEnemy),
      };
      battleHpRef.current = { player: party[firstAlive].hp, foe: newEnemy.hp };
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

  // NOTE: the old inline executeDamage is gone. Damage now comes from
  // battleResolver.calculateDamage via resolveTurn (see battleWiring.ts
  // for the verification note: identical base formula, legacy chart).
  // Reset the player side's per-battle carried state when a new creature
  // is sent in (SHIFT choice or SET auto-next): the incoming creature
  // starts from its own stages/status, never the fainted one's.
  const resetPlayerCarried = (idx: number) => {
    const m = useGameStore.getState().party[idx];
    if (!m) return;
    if (battleCarriedRef.current) battleCarriedRef.current.player = carriedFromInstance(m);
    battleHpRef.current.player = m.hp;
  };

  // Victory tail (shared by the plain win and the evolution prompt):
  // the 50-credit reward, the VICTORY state, and the 3s auto-leave.
  // The evolution prompt resolves through this, so a level-up win never
  // leaves before the player answers the prompt.
  const finishVictory = () => {
    gainWallet(50);
    pushLog('You found 50 Credits.');
    setBState('VICTORY');
    setTimeout(onLeave, 3000);
  };

  // End of a resolver turn: sync HP + carried state, then exactly one of
  // victory / switch-or-defeat / next player turn. Foe faint wins over
  // player faint (the resolver's outcome priority): if the foe fainted,
  // the battle is won even if the active member also fainted (e.g. a
  // recoil suicide) — in that edge case EXP is skipped (no living
  // active recipient) while the unchanged victory reward is kept.
  const finishTurnQueue = () => {
    const q = queueRef.current;
    if (!q) return;
    queueRef.current = null;
    battleCarriedRef.current = {
      player: { stages: q.finalPlayerStages, status: q.finalPlayerStatus, volatile: q.finalPlayerVolatile },
      foe: { stages: q.finalFoeStages, status: q.finalFoeStatus, volatile: q.finalFoeVolatile },
    };
    battleHpRef.current = { player: q.finalPlayerHp, foe: q.finalFoeHp };
    // Final HP sync: damage events already drained HP at impact, but
    // end-of-turn burn/poison ticks (events without a damage field)
    // only land here, so bars and store end exactly on resolver HPs.
    setEnemy(prev => prev ? { ...prev, hp: q.finalFoeHp } : null);
    const partyBefore = useGameStore.getState().party;
    const cur = partyBefore[activeIdx];
    if (cur) updatePartyMember(activeIdx, { ...cur, hp: q.finalPlayerHp });
    if (q.finalFoeHp <= 0) {
      const active = useGameStore.getState().party[activeIdx];
      if (active && q.finalPlayerHp > 0) {
        const expGained = Math.floor((SPECIES_DB[q.foeSpeciesId].baseExpYield * q.foeLevel) / 5);
        pushLog(`${active.nickname} gained ${expGained} EXP!`);
        const { leveledUp, newLevel } = gainExp(active, expGained);
        if (leveledUp) pushLog(`${active.nickname} grew to Level ${newLevel}!`);
        updatePartyMember(activeIdx, active);
        // Mid-fight evolution (evolution-hook.ts, SAFE chains only):
        // a level-up that meets a safe-chain rule pauses the victory
        // tail behind a cancellable prompt. Confirm evolves the active
        // member in place (nickname, stats, moves recomputed at the
        // current level, HP proportion kept); cancel keeps the old
        // species and level. Either way the victory tail runs after.
        // A multi-level jump past two rules evolves once, to the
        // immediate target; the next rule fires on the next level-up.
        if (leveledUp) {
          const rule = getSafeEvolutionRule(active.speciesId);
          if (rule && safeEvolutionReady(active.speciesId, newLevel)) {
            const target = SPECIES_DB[rule.targetId];
            const fromName = active.nickname;
            const prompt = buildMidFightPrompt(
              { kind: 'levelUpInBattle', speciesId: active.speciesId, newLevel, rule },
              fromName,
              target ? target.name : rule.targetId,
              () => {
                if (evolveInstance(active, rule.targetId)) {
                  updatePartyMember(activeIdx, active);
                  pushLog(`${fromName} evolved into ${active.nickname}!`);
                }
                setEvolutionPrompt(null);
                finishVictory();
              },
              () => {
                pushLog(`${active.nickname} stopped evolving.`);
                setEvolutionPrompt(null);
                finishVictory();
              },
            );
            setEvolutionPrompt(prompt);
            setBState('EVOLUTION');
            return;
          }
        }
      }
      finishVictory();
      return;
    }
    if (q.finalPlayerHp <= 0) {
      // BATTLE STYLE: SHIFT offers a switch choice; SET sends the
      // next alive creature automatically (pre-existing behaviour).
      const partyAfter = useGameStore.getState().party;
      const aliveOpts = partyAfter
        .map((p, idx) => ({ idx, m: idx === activeIdx ? { ...p, hp: q.finalPlayerHp } : p }))
        .filter(o => o.m.hp > 0);
      if (battleStyle === 'SHIFT' && aliveOpts.length > 0) {
        pushLog('Choose your next Mochiichao!');
        setSwitchOptions(aliveOpts);
        setBState('SWITCH_CHOICE');
        return;
      }
      if (aliveOpts.length > 0) {
        pushLog(`Go! ${aliveOpts[0].m.nickname}!`);
        resetPlayerCarried(aliveOpts[0].idx);
        setActiveIdx(aliveOpts[0].idx);
        setBState('PLAYER_TURN');
        return;
      }
      pushLog('You have no more Mochiichao. You blacked out!');
      setBState('DEFEAT');
      setTimeout(onLeave, 3000);
      return;
    }
    setBState('PLAYER_TURN');
  };

  // Play the next queued resolver event. Damage events (including 0 for
  // a no-effect hit) and misses animate through the Pixi pipeline and
  // advance again from onAttackDone; every other event (flinch text,
  // status/stat application, faint text, charge text, end-of-turn
  // ticks) is log-only and advances after a readable pause.
  const advanceTurnQueue = () => {
    const q = queueRef.current;
    if (!q) return;
    if (q.idx >= q.events.length) { finishTurnQueue(); return; }
    const ev = q.events[q.idx];
    q.idx += 1;
    pushLog(ev.text);
    const isAnim = ev.damage !== undefined || ev.missed === true;
    if (isAnim && ev.actor && ev.moveId) {
      const mv = MOVES_DB[ev.moveId];
      const attacker = ev.actor === 'player' ? 'player' : 'enemy';
      const targetMax = ev.actor === 'player' ? (enemy?.maxHp ?? 1) : (playerActive?.maxHp ?? 1);
      const dmg = ev.damage ?? 0;
      pendingRef.current = { damage: dmg, text: ev.text, attacker, moveId: ev.moveId, damageFraction: dmg / targetMax, isCrit: !!ev.isCrit };
      setBState('ANIMATING');
      setAttack({ nonce: Date.now(), attacker, category: mv?.cat || 'Physical', color: mv ? TYPES[mv.type]?.color || '#ffffff' : '#ffffff', damageFraction: dmg / targetMax, isCrit: !!ev.isCrit, moveId: ev.moveId });
      return;
    }
    queueTimerRef.current = window.setTimeout(advanceTurnQueue, 650);
  };

  // Called by the Pixi canvas at the impact frame: HP drains here, not before.
  // HP is tracked in battleHpRef (authoritative mid-turn) so an impact
  // never double-subtracts from a stale closure value.
  const onAttackImpact = () => {
    const p = pendingRef.current;
    if (!p) return;
    pendingRef.current = null;
    if (p.attacker === 'player') {
      const newEnemyHp = Math.max(0, battleHpRef.current.foe - p.damage);
      battleHpRef.current.foe = newEnemyHp;
      setEnemy(prev => prev ? { ...prev, hp: newEnemyHp } : null);
      if (p.damage > 0) setLastDamage({ amount: p.damage, target: 'enemy', nonce: Date.now() });
    } else {
      const newPlayerHp = Math.max(0, battleHpRef.current.player - p.damage);
      battleHpRef.current.player = newPlayerHp;
      const cur = useGameStore.getState().party[activeIdx];
      if (cur) updatePartyMember(activeIdx, { ...cur, hp: newPlayerHp });
      if (p.damage > 0) setLastDamage({ amount: p.damage, target: 'player', nonce: Date.now() });
    }
  };

  // An attack animation finished: play the next queued resolver event.
  const onAttackDone = () => {
    advanceTurnQueue();
  };

  // Start ONE resolver turn. The player action is the chosen move, or a
  // pass for the catch break-free follow-up (ENEMY_TURN); the foe action
  // is BattleView's existing random enemy move pick — the resolver
  // accepts actions as input and does not choose them (AI is owed
  // separately). Turn order, target, accuracy, damage, secondaries and
  // the win check all come from resolveTurn now, in resolver order
  // (priority, then effective Speed) — not player-then-enemy.
  const startResolverTurn = (playerMoveId: string | null) => {
    if (!enemy || !playerActive) return;
    const carried = battleCarriedRef.current ?? {
      player: carriedFromInstance(playerActive),
      foe: carriedFromInstance(enemy),
    };
    // Fused attacker: same species/types as the active creature (for
    // STAB), fused stats + fused name only — as before.
    const attackerInst = fusedAttacker || playerActive;
    const playerBattler = makeResolverBattler('player', attackerInst, SPECIES_DB[playerActive.speciesId].types, carried.player);
    const foeBattler = makeResolverBattler('foe', enemy, SPECIES_DB[enemy.speciesId].types, carried.foe);
    const actions: Action[] = [];
    if (playerMoveId) actions.push({ kind: 'move', side: 'player', moveId: playerMoveId });
    else actions.push({ kind: 'pass', side: 'player' });
    const enemyMoveId = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
    if (enemyMoveId) actions.push({ kind: 'move', side: 'foe', moveId: enemyMoveId });
    else actions.push({ kind: 'pass', side: 'foe' });
    const result: TurnResult = resolveTurn(
      { player: playerBattler, foe: foeBattler },
      actions,
      buildLegacyMoveTable(),
      LEGACY_TYPE_CHART,
    );
    queueRef.current = {
      events: result.events,
      idx: 0,
      finalPlayerHp: result.battlers.player.hp,
      finalFoeHp: result.battlers.foe.hp,
      finalPlayerStages: result.battlers.player.stages,
      finalFoeStages: result.battlers.foe.stages,
      finalPlayerStatus: result.battlers.player.status,
      finalFoeStatus: result.battlers.foe.status,
      finalPlayerVolatile: { chargingMoveId: result.battlers.player.volatile?.chargingMoveId ?? null },
      finalFoeVolatile: { chargingMoveId: result.battlers.foe.volatile?.chargingMoveId ?? null },
      foeSpeciesId: enemy.speciesId,
      foeLevel: enemy.level,
    };
    // BATTLE SCENE OFF: apply the same resolver result directly, no
    // Pixi animation — all event texts logged, final HPs synced by the
    // shared finish path. The floating damage number keeps the last
    // damage event, as the old OFF path showed one number per attack.
    if (battleScene === 'OFF') {
      for (const ev of result.events) pushLog(ev.text);
      const lastDmg = [...result.events].reverse().find(ev => ev.damage !== undefined && ev.damage > 0);
      if (lastDmg && lastDmg.target) {
        setLastDamage({ amount: lastDmg.damage ?? 0, target: lastDmg.target === 'foe' ? 'enemy' : 'player', nonce: Date.now() });
      }
      finishTurnQueue();
      return;
    }
    setBState('ANIMATING');
    advanceTurnQueue();
  };

  const handlePlayerMove = (moveId: string) => {
    if (!enemy || bState !== 'PLAYER_TURN' || !playerActive) return;
    startResolverTurn(moveId);
  };

  // ENEMY_TURN now only arrives from a failed catch (Luigi Cube break
  // free): the follow-up is a resolver turn in which the player passes
  // and the foe attacks, so it goes through the same order/resolve/win
  // path as a normal turn instead of the old inline enemy phase.
  // Battle keyboard (BUTTON MODE, buttonMode.ts): only on the
  // player's turn, and never while a switch choice is open (the
  // switch buttons are click-only; firing a move under them would
  // act on a fainted creature). LR: Q/E move the selected move
  // (the hover/focus index the move buttons already use). A:
  // Enter / Space, plus 'l' when L_EQUALS_A, fires the selected
  // move — the same handlePlayerMove the buttons call. NEED:
  // switch-choice keys, catch/run keys, and end-state keys (those
  // screens leave on timers today, unchanged).
  useEffect(() => {
    if (bState !== 'PLAYER_TURN' || switchOptions) return;
    const handler = (e: KeyboardEvent) => {
      const moveCount = playerActive?.moves?.length ?? 0;
      if (moveCount === 0) return;
      const shoulder = shoulderKey(e, buttonMode);
      if (shoulder === 'L') { e.preventDefault(); setSelectedMove(s => (s - 1 + moveCount) % moveCount); return; }
      if (shoulder === 'R') { e.preventDefault(); setSelectedMove(s => (s + 1) % moveCount); return; }
      if (isConfirmKey(e, buttonMode)) {
        e.preventDefault();
        const moveId = playerActive?.moves?.[selectedMove];
        if (moveId) handlePlayerMove(moveId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bState, switchOptions, buttonMode, selectedMove, playerActive]);

  useEffect(() => {
    if (bState === 'ENEMY_TURN' && enemy && playerActive) {
      const t = setTimeout(() => {
        startResolverTurn(null);
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
    <div className="game-screen flex flex-col bg-[#0b1526] relative overflow-hidden" data-menu-skin={skin?.id} style={menuSkinVars(skin)}>
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
        {/* Batch A: positions from hudBattleLayout, border accent from
            the BATTLE per-menu panel colour, bar geometry from
            hudHealthbar, opacity / shadow from the border rows. */}
        <div className={hudPos.enemy}>
          <div className="game-panel px-3 py-2" style={{ fontFamily: 'var(--battle-font, "Trebuchet MS", sans-serif)', borderColor: skin ? skin.panel.border : battleAccent, opacity: (settings.panelOpacity || 100) / 100, boxShadow: skin ? menuSkinPanelShadow(skin) : (settings.panelShadow ? '0 10px 30px rgba(0,0,0,0.65)' : undefined) }}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-white uppercase text-sm truncate">{enemy.nickname}</span>
              <span className="text-xs text-slate-300">Lv.{enemy.level}</span>
            </div>
            {settings.hudHealthbar === 'NUMERIC' && (
              <div className="text-[11px] text-slate-300 text-right">{Math.ceil(enemy.hp)} / {enemy.maxHp} HP</div>
            )}
            <div className="bg-black/70 overflow-hidden mt-1 border border-white/20" style={{ height: hbStyle.height, borderRadius: hbStyle.radius }}>
              <div className="h-full transition-all duration-300" style={{ width: `${enemyPct}%`, backgroundColor: hpColor(enemyPct), backgroundImage: hbStyle.segmented ? 'repeating-linear-gradient(90deg, transparent 0 8px, rgba(0,0,0,0.35) 8px 10px)' : undefined }} />
            </div>
          </div>
        </div>
        <div className={hudPos.player}>
          <div className="game-panel px-3 py-2" style={{ fontFamily: 'var(--battle-font, "Trebuchet MS", sans-serif)', borderColor: skin ? skin.panel.border : battleAccent, opacity: (settings.panelOpacity || 100) / 100, boxShadow: skin ? menuSkinPanelShadow(skin) : (settings.panelShadow ? '0 10px 30px rgba(0,0,0,0.65)' : undefined) }}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-white uppercase text-sm truncate">{playerActive.nickname}</span>
              <span className="text-xs text-slate-300">Lv.{playerActive.level}</span>
            </div>
            <div className="text-[11px] text-slate-300 text-right">{Math.ceil(playerActive.hp)} / {playerActive.maxHp} HP</div>
            <div className="bg-black/70 overflow-hidden mt-1 border border-white/20" style={{ height: hbStyle.height, borderRadius: hbStyle.radius }}>
              <div className="h-full transition-all duration-300" style={{ width: `${playerPct}%`, backgroundColor: hpColor(playerPct), backgroundImage: hbStyle.segmented ? 'repeating-linear-gradient(90deg, transparent 0 8px, rgba(0,0,0,0.35) 8px 10px)' : undefined }} />
            </div>
          </div>
        </div>
        {/* Batch A: floating damage number on impact, style from
            hudDamageStyle; cleared after 1.4s. */}
        {lastDamage && (
          <div
            className={`absolute ${lastDamage.target === 'enemy' ? 'top-24' : 'bottom-24'} left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-pulse`}
            style={damageNumberStyle(settings.hudDamageStyle as DamageNumberStyle)}
          >
            -{lastDamage.amount}
          </div>
        )}
        {/* Small portraits in the corners, for creatures whose sheet is the proof */}
        <div className="absolute bottom-2 left-2 opacity-90 pointer-events-none hidden sm:block">
          <HumanPortrait slot={playerSlot(playerGender)} view="back" size={56} cell={playerSlot(playerGender).battleCell != null ? cellPos(playerSlot(playerGender).battleCell!) : undefined} />
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
          style={{ margin: '8px 12px 0', padding: '12px 16px', minHeight: '56px', borderColor: skin ? skin.panel.border : battleAccent, ...messageWindowStyle(settings.hudMessageStyle as MessageWindowStyle, settings.panelOpacity || 100), boxShadow: skin ? menuSkinPanelShadow(skin) : (settings.panelShadow ? '0 10px 30px rgba(0,0,0,0.65)' : undefined) }}
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
                <button key={o.idx} onClick={() => { pushLog(`Go! ${o.m.nickname}!`); resetPlayerCarried(o.idx); setActiveIdx(o.idx); setSwitchOptions(null); setBState('PLAYER_TURN'); }} className="game-button px-3 py-2 text-sm font-bold min-h-[48px]">
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
              if (!sel || settings.hudPpType === 'HIDDEN') return null;
              const detail = ppTypeLine(settings.hudPpType as PpTypeDisplay, TYPES[sel.type]?.name || sel.type, playerActive.pp[selectedMove], sel.pp);
              return (
                <div className="text-xs text-slate-200 mb-2">
                  Selected: <span className="font-bold text-white">{sel.name}</span>
                  {detail ? ` · ${detail}` : ''}
                </div>
              );
            })()}
            {evolutionPrompt && bState === 'EVOLUTION' && (
              <div className="game-panel p-3 mb-2">
                <div className="text-white font-bold">{evolutionPrompt.promptTitle}</div>
                <div className="text-sm text-slate-200">{evolutionPrompt.promptBody}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={evolutionPrompt.onConfirm} className="game-button px-3 py-2 text-sm font-bold min-h-[48px]">{evolutionPrompt.confirmLabel}</button>
                  {evolutionPrompt.canCancel && (
                    <button onClick={evolutionPrompt.onCancel} className="game-button px-3 py-2 text-sm min-h-[48px]">{evolutionPrompt.cancelLabel}</button>
                  )}
                </div>
              </div>
            )}
            <div className={moveButtonContainerClass(settings.hudMoveLayout as MoveButtonLayout)}>
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
                    className={`game-button text-left px-3 py-2 disabled:opacity-50 ${i === selectedMove ? (skin ? 'skin-selected' : 'ring-2 ring-yellow-300') : ''}`}
                    style={{ borderColor: color }}
                  >
                    <span className="font-bold text-white block truncate">{mv ? mv.name : '-'}</span>
                    {mv && ppTypeLine(settings.hudPpType as PpTypeDisplay, TYPES[mv.type]?.name || mv.type, playerActive.pp[i], mv.pp) && (
                      <span className="text-[11px]" style={{ color }}>{ppTypeLine(settings.hudPpType as PpTypeDisplay, TYPES[mv.type]?.name || mv.type, playerActive.pp[i], mv.pp)}</span>
                    )}
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
                  <div className="text-[11px] text-slate-300">Fusion form · ATK {fusedAttacker.stats.atk} · lasts this battle</div>
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
