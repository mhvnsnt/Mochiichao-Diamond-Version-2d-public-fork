import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import CreaturePortrait from '../game/CreaturePortrait';
import { MOVES_DB } from '../../lib/moves';

/**
 * Arena Mode — Colosseum presentation structure, selectable battle mode.
 * Doubles layout (2v2, front/back slots), bigger sprites, camera-style
 * zoom on the acting creature (scale transform), move banner, HP bars
 * in the React layer. Turn-based logic is the same damage shape as
 * Trainer battles; doubles VFX and the full Arena camera timeline are
 * PLACEHOLDER at first (scale + flash, not the PixiJS camera grammar).
 *
 * Opponents here are Dorowani (147) and Gabu (148) shown with their
 * original sheets — with clearly labelled SPRITE-TEST stats, because
 * their canon stats/types are not set yet. They are not in the roster
 * and this does not set their canon.
 */
interface Fighter { name: string; speciesId: string; level: number; hp: number; maxHp: number; moves: string[]; isPlayer: boolean }

export default function ArenaBattleView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const gainWallet = useGameStore(s => s.gainWallet);
  const [fighters, setFighters] = useState<Fighter[]>(() => {
    const p0 = party[0];
    const p1 = party[1];
    return [
      { name: p0 ? p0.nickname : 'No partner', speciesId: p0?.speciesId || '001', level: p0?.level || 5, hp: p0?.hp || 0, maxHp: p0?.maxHp || 1, moves: p0?.moves || [], isPlayer: true },
      { name: p1 ? p1.nickname : 'No second', speciesId: p1?.speciesId || '001', level: p1?.level || 5, hp: p1?.hp || 0, maxHp: p1?.maxHp || 1, moves: p1?.moves || [], isPlayer: true },
      { name: 'Dorowani', speciesId: '147', level: 5, hp: 60, maxHp: 60, moves: ['TACKLE'], isPlayer: false },
      { name: 'Gabu', speciesId: '148', level: 5, hp: 60, maxHp: 60, moves: ['TACKLE'], isPlayer: false },
    ];
  });
  const [acting, setActing] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>(['Arena Mode — doubles layout. Choose a move for your front creature.']);
  const [over, setOver] = useState(false);

  if (party.length === 0) {
    return (
      <div className="game-screen flex flex-col p-6 items-center justify-center bg-[#0b1526]">
        <div className="game-panel p-6 text-center max-w-md">
          <div className="font-bold text-white text-xl mb-2">Arena Mode needs a partner</div>
          <div className="text-slate-300 text-sm mb-4">Visit Prof. Aeon's Lab and choose a starter first.</div>
          <button onClick={onBack} className="game-button px-4 py-2">Back</button>
        </div>
      </div>
    );
  }

  const doMove = (moveId: string) => {
    if (over) return;
    const move = MOVES_DB[moveId];
    const dmg = move ? Math.max(1, Math.floor(move.bp / 2) + 5) : 5;
    const targetIdx = fighters.findIndex(f => !f.isPlayer && f.hp > 0);
    if (targetIdx === -1) return;
    setActing(0);
    setLog(l => [...l.slice(-8), `${fighters[0].name} used ${move?.name || moveId}!`]);
    setTimeout(() => {
      setFighters(fs => {
        const next = [...fs];
        next[targetIdx] = { ...next[targetIdx], hp: Math.max(0, next[targetIdx].hp - dmg) };
        return next;
      });
      setLog(l => [...l.slice(-8), `${fighters[targetIdx].name} took ${dmg} damage!`]);
      setActing(null);
      const remaining = fighters.filter((f, i) => i !== targetIdx && !f.isPlayer && f.hp > 0).length;
      if (remaining === 0 && fighters[targetIdx].hp - dmg <= 0) {
        setLog(l => [...l.slice(-8), 'Arena victory! +100 CR.']);
        gainWallet(100);
        setOver(true);
      } else {
        // Enemy front replies with a basic hit.
        setTimeout(() => {
          setActing(targetIdx);
          setLog(l => [...l.slice(-8), `${fighters[targetIdx].name} used Tackle!`]);
          setTimeout(() => {
            setFighters(fs => {
              const next = [...fs];
              next[0] = { ...next[0], hp: Math.max(0, next[0].hp - 8) };
              return next;
            });
            setActing(null);
          }, 500);
        }, 700);
      }
    }, 600);
  };

  const slot = (f: Fighter, i: number, big: boolean) => {
    const pct = Math.max(0, (f.hp / f.maxHp) * 100);
    return (
      <div key={i} className={`flex flex-col items-center ${acting === i ? 'scale-110 z-10' : ''} transition-transform`}>
        <CreaturePortrait speciesId={f.speciesId} view={f.isPlayer ? 'back' : 'front'} size={big ? 128 : 104} />
        <div className="game-panel px-3 py-1.5 mt-1 w-40 text-center">
          <div className="font-bold text-white text-sm truncate">{f.name} <span className="text-slate-400 font-normal">Lv.{f.level}</span></div>
          <div className="h-2 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
            <div className="h-full" style={{ width: `${pct}%`, background: pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336' }} />
          </div>
          <div className="text-[11px] text-slate-300">{Math.max(0, f.hp)} / {f.maxHp}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-screen flex flex-col bg-[#0b1526] overflow-hidden">
      <div className="flex justify-between items-center p-4 shrink-0">
        <h2 className="game-title text-xl">Arena Mode — Doubles</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Leave Arena</button>
      </div>
      <div className="flex-1 relative flex flex-col justify-between px-4 py-2 min-h-0">
        <div className="flex justify-center gap-8">{slot(fighters[2], 2, false)}{slot(fighters[3], 3, true)}</div>
        <div className="flex justify-center gap-8">{slot(fighters[0], 0, true)}{slot(fighters[1], 1, false)}</div>
      </div>
      <div className="game-panel-bottom flex shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex-1 p-3 overflow-y-auto text-sm text-slate-200 min-h-[64px]">
          {log.slice(-3).map((l, i) => <div key={i} className={i === log.slice(-3).length - 1 ? 'text-white font-bold' : 'opacity-70'}>{l}</div>)}
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 w-full sm:w-[46%]">
          {fighters[0].moves.slice(0, 4).map((mId, i) => (
            <button key={i} disabled={over || fighters[0].hp <= 0} onClick={() => doMove(mId)} className="game-button px-3 py-2 text-left">
              <span className="font-bold text-white block truncate">{MOVES_DB[mId]?.name || mId}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
