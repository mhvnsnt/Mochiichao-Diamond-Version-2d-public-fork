import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import PixiWorldCanvas from '../game/PixiWorldCanvas';
import { FULL_WORLD } from '../../world/FullWorldMaps';
import { MOVES_DB } from '../../lib/moves';

/**
 * Creature Mode — play as the creature, real-time, top-down (pass 1).
 * You move as your first party member on the Sector 0 map (PixiJS
 * canvas, same tile maps and save/party as Trainer Mode), use moves
 * 1–4, dodge with Space (brief i-frames), and tag-switch with Tab.
 * This is the structure, playable now: movement is tile-step based
 * (smooth real-time movement is the next pass), the target is a
 * training dummy at a fixed tile, and damage is the move's base
 * shape, not the full Trainer damage formula. Marked as such below.
 */
export default function CreatureModeView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const [pos, setPos] = useState({ x: 15, y: 18 });
  const [dir, setDir] = useState('down');
  const [dummyHp, setDummyHp] = useState(100);
  const [dodging, setDodging] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [log, setLog] = useState('Creature Mode — move with WASD / arrows, moves 1–4, Space to dodge, Tab to switch.');
  const [cooldown, setCooldown] = useState(false);

  const active = party[activeIdx];
  const mapData = FULL_WORLD['sector0'];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); if (party.length > 1) { setActiveIdx(i => (i + 1) % party.length); setLog('Tag-switched!'); } return; }
      if (e.key === ' ') { e.preventDefault(); if (!dodging) { setDodging(true); setLog('Dodge! Brief i-frames.'); setTimeout(() => setDodging(false), 500); } return; }
      if (e.key >= '1' && e.key <= '4') {
        const moveId = active?.moves[Number(e.key) - 1];
        if (moveId && !cooldown) {
          const move = MOVES_DB[moveId];
          const dmg = move ? Math.max(1, Math.floor(move.bp / 2)) : 5;
          setCooldown(true);
          setTimeout(() => setCooldown(false), 800);
          setDummyHp(h => {
            const next = Math.max(0, h - dmg);
            setLog(`${active.nickname} used ${move?.name || moveId} for ${dmg}! Dummy HP: ${next}/100.`);
            return next;
          });
        }
        return;
      }
      const dx = e.key === 'ArrowLeft' || e.key === 'a' ? -1 : e.key === 'ArrowRight' || e.key === 'd' ? 1 : 0;
      const dy = e.key === 'ArrowUp' || e.key === 'w' ? -1 : e.key === 'ArrowDown' || e.key === 's' ? 1 : 0;
      if (dx || dy) {
        e.preventDefault();
        setDir(dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up');
        setPos(p => {
          const nx = p.x + dx, ny = p.y + dy;
          if (nx < 0 || ny < 0 || nx >= mapData.width || ny >= mapData.height) return p;
          const tile = mapData.tiles[ny]?.[nx];
          if (tile === 1 || tile === 4 || tile === 2) return p;
          return { x: nx, y: ny };
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [party, active, cooldown, dodging, mapData]);

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
        animWalk={0}
      />
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-between p-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="game-panel px-3 py-2">
          <div className="font-bold text-white text-sm">Playing as: {active.nickname} {dodging ? '(DODGING)' : ''}</div>
          <div className="text-[11px] text-slate-300">Training dummy HP: {dummyHp}/100</div>
        </div>
        <button onClick={onBack} className="game-button px-3 py-2 text-sm">Exit Creature Mode</button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-40 game-panel-bottom p-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="text-sm text-white mb-2">{log}</div>
        <div className="grid grid-cols-4 gap-2">
          {active.moves.slice(0, 4).map((mId, i) => (
            <button
              key={i}
              onClick={() => {
                const move = MOVES_DB[mId];
                const dmg = move ? Math.max(1, Math.floor(move.bp / 2)) : 5;
                setDummyHp(h => Math.max(0, h - dmg));
                setLog(`${active.nickname} used ${move?.name || mId} for ${dmg}!`);
              }}
              className="game-button px-2 py-2 text-sm"
            >
              {i + 1}. {MOVES_DB[mId]?.name || mId}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => { setDodging(true); setTimeout(() => setDodging(false), 500); }} className="game-button px-3 py-1.5 text-sm flex-1">Dodge (Space)</button>
          <button onClick={() => { if (party.length > 1) setActiveIdx(i => (i + 1) % party.length); }} className="game-button px-3 py-1.5 text-sm flex-1">Tag-Switch (Tab)</button>
        </div>
        <div className="text-[11px] text-slate-400 mt-2">PLACEHOLDER structure: tile-step movement and a training dummy. Smooth real-time movement, wild-creature combat, and full damage rules are the next pass.</div>
      </div>
    </div>
  );
}
