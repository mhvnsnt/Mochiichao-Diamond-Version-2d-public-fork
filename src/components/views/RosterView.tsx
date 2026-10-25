import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPECIES_DB } from '../../lib/species';
import { MOVES_DB } from '../../lib/moves';
import CreaturePortrait from '../game/CreaturePortrait';

/**
 * Roster, Pokemon-style placement: list on one side, detail panel on the
 * other (sheet image, name, level, HP, types/elements, moves). Not a text
 * list, and NO Grid Asset Forge panel — that placeholder generator is not
 * a player feature and is not wired here in any form. Portraits come from
 * Mochiichao sheets or the original silhouette fallback — never a Pokemon
 * sprite fetch, never an emoji.
 *
 * Placement reference: HeartGold / Black-White party screen structure
 * (list + detail), as read from the decomp menu/battle structure in the
 * reference JSONs — layout only; all art/text here is Mochiichao's own.
 */
const GEN2_PREVIEW = [
  { speciesId: '147', name: 'Dorowani', note: 'Gen 2 starter — sheet ready' },
  { speciesId: '148', name: 'Gabu', note: 'Gen 2 starter — sheet ready' },
];

export default function RosterView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const [selected, setSelected] = useState(0);
  const current = party[Math.min(selected, Math.max(0, party.length - 1))];
  const species = current ? SPECIES_DB[current.speciesId] : undefined;
  const pct = current ? Math.max(0, (current.hp / current.maxHp) * 100) : 0;

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Your Team</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>

      {party.length === 0 ? (
        <div className="game-panel p-6 text-center text-slate-300">
          No partner yet. Visit Prof. Aeon's Lab in Sector 0 and choose your first Mochiichao.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
          {/* List side */}
          <div className="md:w-[38%] flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 pb-1">
            {party.map((mochii, i) => {
              const sp = SPECIES_DB[mochii.speciesId];
              const p = Math.max(0, (mochii.hp / mochii.maxHp) * 100);
              return (
                <button
                  key={mochii.id}
                  onClick={() => setSelected(i)}
                  className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 ${i === selected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
                >
                  <CreaturePortrait speciesId={mochii.speciesId} view="front" size={56} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{mochii.nickname}</div>
                    <div className="text-xs text-slate-400">Lv. {mochii.level} · {sp?.name}</div>
                    <div className="h-2 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
                      <div className="h-full" style={{ width: `${p}%`, background: p > 50 ? '#4caf50' : p > 20 ? '#ff9800' : '#f44336' }} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 shrink-0">{Math.ceil(mochii.hp)}/{mochii.maxHp}</div>
                </button>
              );
            })}
          </div>

          {/* Detail side */}
          {current && species && (
            <div className="game-panel p-4 sm:p-5 flex-1 overflow-y-auto">
              <div className="flex gap-5 items-start flex-wrap">
                <CreaturePortrait speciesId={current.speciesId} view="front" size={128} />
                <div className="flex-1 min-w-[180px]">
                  <div className="font-black text-2xl text-white">
                    {current.nickname}
                    {current.status && <span className="ml-2 bg-purple-900 text-purple-200 text-xs px-2 py-0.5 rounded align-middle">{current.status}</span>}
                  </div>
                  <div className="text-slate-300 text-sm mt-1">Lv. {current.level} · {species.name}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {species.types.map(t => (
                      <span key={t} className="text-xs bg-white/10 text-slate-100 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{species.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>HP</span><span>{Math.ceil(current.hp)} / {current.maxHp}</span>
                </div>
                <div className="h-3 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
                  <div className="h-full transition-all" style={{ width: `${pct}%`, background: pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">ATK</div><div className="text-white font-bold">{current.stats.atk}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">DEF</div><div className="text-white font-bold">{current.stats.def}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPD</div><div className="text-white font-bold">{current.stats.spe}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPA</div><div className="text-white font-bold">{current.stats.spa}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPD</div><div className="text-white font-bold">{current.stats.spd}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">EXP</div><div className="text-white font-bold">{current.experience}</div></div>
              </div>
              <h3 className="text-white font-bold mt-5 mb-2">Moves</h3>
              <div className="grid grid-cols-2 gap-2">
                {current.moves.map((m, j) => (
                  <div key={j} className="bg-black/40 border border-white/10 p-2 rounded-lg text-xs">
                    <div className="text-white">{MOVES_DB[m]?.name || m.replace(/_/g, ' ')}</div>
                    <div className="text-slate-400">PP {current.pp[j]}/{MOVES_DB[m]?.pp ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="shrink-0 mt-4">
        <h3 className="text-white font-bold mb-1 text-sm">Gen 2 starters — art preview</h3>
        <p className="text-xs text-slate-400 mb-2">Drawn from Mars's own models. Their stats and types are not set yet, so they are not choosable in the lab yet.</p>
        <div className="grid grid-cols-2 gap-3">
          {GEN2_PREVIEW.map(c => (
            <div key={c.speciesId} className="game-panel p-3 flex items-center gap-3">
              <CreaturePortrait speciesId={c.speciesId} view="front" size={56} />
              <div>
                <div className="font-bold text-white text-sm">{c.name} <span className="text-slate-400 text-xs">#{c.speciesId}</span></div>
                <div className="text-xs text-slate-400">{c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
