import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getExpNeeded, gainExp } from '../../lib/engine';
import { SPECIES_DB } from '../../lib/species';

/**
 * Cheat console — native allowlist ONLY (cheat-console-spec).
 * Real Action Replay / GameShark codes cannot run in a web game, so
 * these are Mochiichao-native codes. Every successful code sets
 * save.cheated = true (shown here and saved with the game).
 * Codes: MOCHII-ALL (Dex flags only), MAX-LVL (to 100, decomp
 * maximum — audit-plan CHANGE: 50 was an unlabelled clamp, not
 * canon; WARNING: level 100 breaks the early-game level curve,
 * use it only as a cheat, never as a balance target),
 * SHINY-ON / SHINY-OFF, NOCLIP (toggle), WARP-SECTOR0,
 * MONEY-1000 (+1000 CR, wallet clamped at 999,999 — the +1000
 * amount is a labelled placeholder cheat amount, NOT canon;
 * wallet cap 999,999 DOES match the decomp money cap).
 * Save states: 4 local slots, save menu only in spirit — stored in
 * localStorage, never in battle (this screen is not reachable in
 * battle). Fast-forward here is world-only by construction: it only
 * changes the world held-direction repeat rate.
 */
const SAVE_STATE_KEY = (slot: number) => `mochii_savestate_${slot}`;

export default function CheatConsoleView({ onBack }: { onBack: () => void }) {
  const gameState = useGameStore(s => s);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Enter a cheat code.');
  const [states, setStates] = useState(() => [1, 2, 3, 4].map(n => {
    try { return localStorage.getItem(SAVE_STATE_KEY(n)) ? JSON.parse(localStorage.getItem(SAVE_STATE_KEY(n))!).timestamp : null; } catch { return null; }
  }));

  const flagCheated = () => useGameStore.setState({ cheated: true });

  const runCode = () => {
    const c = code.trim().toUpperCase();
    const setFlags = gameState.setCheatFlags;
    if (c === 'MOCHII-ALL') {
      const dex: Record<string, string> = {};
      // Dex flags only: mark every battle-ready species as seen, never caught.
      for (const id of Object.keys(SPECIES_DB)) dex[id] = 'seen';
      useGameStore.setState({ dex });
      flagCheated();
      setMessage('MOCHII-ALL: every species marked Seen in the Dex.');
    } else if (c === 'MAX-LVL') {
      const party = gameState.party.map(m => {
        const copy = { ...m };
        const needed = Math.max(0, getExpNeeded(100, 'Medium Slow') - copy.experience);
        gainExp(copy, needed);
        copy.level = Math.min(100, copy.level);
        return copy;
      });
      useGameStore.setState({ party });
      flagCheated();
      setMessage('MAX-LVL: party raised to level 100.');
    } else if (c === 'SHINY-ON') {
      setFlags({ shiny: true });
      flagCheated();
      setMessage('SHINY-ON: Lustre display on.');
    } else if (c === 'SHINY-OFF') {
      setFlags({ shiny: false });
      flagCheated();
      setMessage('SHINY-OFF: Lustre display off.');
    } else if (c === 'NOCLIP') {
      const next = !gameState.noclip;
      setFlags({ noclip: next });
      flagCheated();
      setMessage(`NOCLIP: ${next ? 'ON — walk through solid tiles.' : 'OFF.'}`);
    } else if (c === 'WARP-SECTOR0') {
      gameState.setMapState('sector0', { x: 15, y: 18 });
      flagCheated();
      setMessage('WARP-SECTOR0: warped to Boot Harbor.');
    } else if (c === 'MONEY-1000') {
      useGameStore.setState(s => ({ wallet: Math.min(999999, s.wallet + 1000) }));
      flagCheated();
      setMessage('MONEY-1000: +1000 CR.');
    } else {
      setMessage(`Unknown code. These codes work here: MOCHII-ALL, MAX-LVL, SHINY-ON, SHINY-OFF, NOCLIP, WARP-SECTOR0, MONEY-1000.`);
    }
    setCode('');
  };

  const saveState = (slot: number) => {
    localStorage.setItem(SAVE_STATE_KEY(slot), JSON.stringify({ timestamp: Date.now(), data: useGameStore.getState() }));
    setStates(s => s.map((v, i) => (i + 1 === slot ? Date.now() : v)));
    setMessage(`Save state ${slot} saved (local only).`);
  };
  const loadState = (slot: number) => {
    try {
      const raw = localStorage.getItem(SAVE_STATE_KEY(slot));
      if (!raw) { setMessage(`Save state ${slot} is empty.`); return; }
      useGameStore.getState().loadState(JSON.parse(raw).data);
      setMessage(`Save state ${slot} loaded.`);
    } catch { setMessage(`Save state ${slot} could not be loaded.`); }
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-y-auto bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="game-title text-2xl">Cheat Console</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>
      <div className="game-panel p-4 max-w-2xl w-full mx-auto">
        <div className="text-sm text-slate-300 mb-3">
          Cheats used: <span className={gameState.cheated ? 'text-red-300 font-bold' : 'text-teal-300 font-bold'}>{gameState.cheated ? 'Yes' : 'No'}</span>
          {' '}· Lustre: {gameState.shiny ? 'ON' : 'OFF'} · Noclip: {gameState.noclip ? 'ON' : 'OFF'} · Fast-forward: {gameState.fastForward ? 'ON' : 'OFF'}
        </div>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') runCode(); }}
            placeholder="MOCHII-ALL"
            className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
          />
          <button onClick={runCode} className="game-button px-4 py-2 font-bold">Run</button>
        </div>
        <div className="mt-3 text-sm text-slate-200 min-h-[3rem]">{message}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {['MOCHII-ALL', 'MAX-LVL', 'SHINY-ON', 'SHINY-OFF', 'NOCLIP', 'WARP-SECTOR0', 'MONEY-1000'].map(c => (
            <button key={c} onClick={() => setCode(c)} className="game-button px-2 py-1 text-xs">{c}</button>
          ))}
        </div>
        <button
          onClick={() => { gameState.setCheatFlags({ fastForward: !gameState.fastForward }); setMessage(`Fast-forward (world only): ${!gameState.fastForward ? 'ON — world movement repeats faster.' : 'OFF.'}`); }}
          className="game-button px-3 py-2 text-sm mt-4"
        >
          Toggle Fast-Forward (world only)
        </button>

        <h3 className="text-white font-bold mt-6 mb-2">Save states (4 slots, local only)</h3>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-black/40 rounded-lg p-3">
              <div className="text-white font-bold text-sm">Slot {n}</div>
              <div className="text-xs text-slate-400 mb-2">{states[n - 1] ? new Date(states[n - 1]!).toLocaleString() : 'Empty'}</div>
              <div className="flex gap-2">
                <button onClick={() => saveState(n)} className="game-button px-2 py-1 text-xs flex-1">Save</button>
                <button onClick={() => loadState(n)} className="game-button px-2 py-1 text-xs flex-1">Load</button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-400 mt-4">This console takes Mochiichao cheat codes only.</div>
      </div>
    </div>
  );
}
