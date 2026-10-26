import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import CreaturePortrait from '../game/CreaturePortrait';
import { MenuHelpLine } from '../game/MenuList';
import { SPECIES_DB } from '../../lib/species';
import {
  alignmentFromCare, applyGardenItem, gardenBattleBonus, gardenForm,
  colorwayFor, typeVariant, branchEvolution, dataRevert, mochiLinkValidate,
  GardenStats, GardenCreature, BURST_BONUS, BURST_TURNS,
} from '../../lib/mochiichao-systems';
import { MEMORY_QUESTS } from '../../lib/monster-tamer-systems';

/**
 * Mochi Garden — Mainframe Gardens as a reachable screen (pass 1).
 * Structure is real: Academy / Market / race track / sparring ring /
 * farm plots, Garden Stats, alignment (±25 band), Form I/II, battle
 * bonus capped +9%, Burst Form (+30% / 3 turns), Branch Evolution /
 * Data Revert, Mochi Link validation — all wired through
 * mochiichao-systems.ts, which was previously an unimported file.
 * Full Garden gameplay (raising/care over time, races, breeding) is
 * PLACEHOLDER at first: the stats shown here start at a neutral
 * placeholder garden record per creature and are adjusted by the
 * Data-Fruit buttons below; they are persisted to the save via the shared store (pass 3).
 */
const ZERO: GardenStats = { dive: 0, glide: 0, sprint: 0, might: 0, endurance: 0 };

export default function GardenView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const [selected, setSelected] = useState(0);
  // Pass 3: Garden records are shared store state, not local state —
  // Creature Mode reads the same record for the +9%-capped battle bonus,
  // and SaveMenu saves it with the game. GardenView behaviour is unchanged.
  const garden = useGameStore(s => s.gardenRecords);
  const setGardenRecord = useGameStore(s => s.setGardenRecord);
  const [note, setNote] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  // Bonding / Memory Quests (monster-tamer spec step 4): quest givers
  // are existing Mochiichao NPCs. Completing one raises bond +10 and
  // one Garden stat +5 on the selected creature's Garden record.
  // Befriending does NOT replace capture — capture stays Luigi Cubes
  // + Ring Capture, and Garden records here are still the local
  // Garden records here are shared store records, saved with the game (pass 3).
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const completeQuest = (questId: string) => {
    if (!current || completedQuests[questId]) return;
    const quest = MEMORY_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    const next = {
      ...rec,
      garden: applyGardenItem(rec.garden, { [quest.gardenStat]: quest.gardenReward }),
      bond: Math.min(100, rec.bond + quest.bondReward),
    };
    setGardenRecord(current.id, next);
    setCompletedQuests(q => ({ ...q, [questId]: true }));
    // Audit-plan: quest rewards are placeholders (bond +0 / stat
    // +0) until Mars gives numbers — completing a quest is a flag
    // only, with no invented stat effect. Say so in-game.
    setNote(quest.bondReward === 0 && quest.gardenReward === 0
      ? `${quest.title} complete! (Quest rewards are placeholders — no stat effect until Mars sets them.)`
      : `${quest.title} complete! Bond +${quest.bondReward}, ${quest.gardenStat} +${quest.gardenReward}.`);
  };

  const current = party[Math.min(selected, Math.max(0, party.length - 1))];
  const rec: GardenCreature = current ? (garden[current.id] || {
    speciesId: current.speciesId, garden: { ...ZERO }, careScore: 0, bond: 0,
    careMistakes: 0, trainingSessions: 0, colorwaySeed: current.id.length, parts: [],
  }) : (null as any);

  const feed = (item: Partial<GardenStats>, label: string) => {
    if (!current) return;
    const next = { ...rec, garden: applyGardenItem(rec.garden, item), trainingSessions: rec.trainingSessions + 1 };
    setGardenRecord(current.id, next);
    setNote(`${label} fed. Garden stats updated (saved with the game via the shared store).`);
  };

  const places: { name: string; text: string }[] = [
    { name: 'Mochiko Academy', text: 'PLACEHOLDER — lessons and training sessions will live here. For now, use the Data-Fruit buttons below.' },
    { name: 'Market', text: 'PLACEHOLDER — Data Shards, Garden Critters and fruit trading will live here. The Shop screen is the working shop for now.' },
    { name: 'Race Track', text: 'PLACEHOLDER — Garden races (sprint/glide/dives) will live here. Garden Stats above already feed race readiness.' },
    { name: 'Sparring Ring', text: 'PLACEHOLDER — Dojo sparring will live here. Battle is the working sparring path for now.' },
    { name: 'Farm Plots', text: 'PLACEHOLDER — Data-Fruit farming will live here. The fruit buttons below stand in for harvested fruit.' },
  ];

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Mainframe Gardens</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>
      {party.length === 0 ? (
        <div className="game-panel p-6 text-center text-slate-300">No partner yet. Garden records start once you have a Mochiichao.</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          <div className="md:w-[38%] flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
            {party.map((m, i) => (
              <button key={m.id} onClick={() => setSelected(i)} onMouseEnter={() => setSelected(i)} onFocus={() => setSelected(i)} className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 ${i === selected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}>
                <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
                <div>
                  <div className="font-bold text-white">{i === selected ? '► ' : ''}{m.nickname}</div>
                  <div className="text-xs text-slate-400">Lv. {m.level}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="game-panel p-4">
              <div className="flex gap-4 items-start flex-wrap">
                <CreaturePortrait speciesId={current.speciesId} view="front" size={96} />
                <div>
                  <div className="font-bold text-white text-xl">{current.nickname}</div>
                  <div className="text-sm text-slate-300">Alignment: {alignmentFromCare(rec.careScore)} (±25 neutral band)</div>
                  <div className="text-sm text-slate-300">Garden Form: {gardenForm(rec.garden)} (Form I at 150 total, Form II at 300)</div>
                  <div className="text-sm text-slate-300">Battle bonus: +{(gardenBattleBonus(rec.garden) * 100).toFixed(1)}% (capped +9%)</div>
                  <div className="text-sm text-slate-300">Colorway: {colorwayFor(rec)}</div>
                  <div className="text-sm text-slate-300">Type variant: {typeVariant(rec.garden) || 'none (needs a 20-point stat lead)'}</div>
                  <div className="text-sm text-slate-300">Burst Form: +{BURST_BONUS * 100}% for {BURST_TURNS} turns (battle use, next pass)</div>
                </div>
              </div>
              <h3 className="text-white font-bold mt-4 mb-2">Garden Stats (0–99 each)</h3>
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                {(['dive', 'glide', 'sprint', 'might', 'endurance'] as const).map(k => (
                  <div key={k} className="bg-black/40 rounded-lg p-2">
                    <div className="text-slate-400 text-[11px] uppercase">{k}</div>
                    <div className="text-white font-bold">{rec.garden[k]}</div>
                  </div>
                ))}
              </div>
              <h3 className="text-white font-bold mt-4 mb-2">Data-Fruit (placeholder harvest)</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => feed({ dive: 10 }, 'Aqua Fruit')} className="game-button px-3 py-1.5 text-sm">Aqua Fruit +Dive</button>
                <button onClick={() => feed({ glide: 10 }, 'Aero Fruit')} className="game-button px-3 py-1.5 text-sm">Aero Fruit +Glide</button>
                <button onClick={() => feed({ sprint: 10 }, 'Swift Fruit')} className="game-button px-3 py-1.5 text-sm">Swift Fruit +Sprint</button>
                <button onClick={() => feed({ might: 10 }, 'Chrome Fruit')} className="game-button px-3 py-1.5 text-sm">Chrome Fruit +Might</button>
                <button onClick={() => feed({ endurance: 10 }, 'Earth Fruit')} className="game-button px-3 py-1.5 text-sm">Earth Fruit +Endurance</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => {
                    const cand = branchEvolution(rec, [{ targetSpeciesId: SPECIES_DB[current.speciesId]?.evolution?.targetId || '', minBond: 50 }]);
                    setNote(cand ? `Branch Evolution ready: ${cand.targetSpeciesId} (bond gate met). Evolution itself is the next pass.` : 'No branch evolution ready yet (bond 50+ and a valid target needed).');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Check Branch Evolution
                </button>
                <button
                  onClick={() => {
                    const reverted = dataRevert(rec);
                    setGardenRecord(current.id, reverted);
                    setNote('Data Revert applied: Garden stats halved, colorway/parts kept.');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Data Revert
                </button>
                <button
                  onClick={() => {
                    const errs = mochiLinkValidate(current.speciesId, current.speciesId, party.map(p => p.speciesId), current.speciesId);
                    setNote(errs.length ? `Mochi Link: ${errs.join(' ')}` : 'Mochi Link: both sides offer a creature — trade structure valid (no network trade in pass 1).');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Check Mochi Link
                </button>
              </div>
              {note && <div className="mt-3 text-sm text-slate-200 bg-black/40 rounded-lg p-3">{note}</div>}
            </div>
            <h3 className="text-white font-bold mt-4 mb-2">Bonding / Memory Quests</h3>
            <p className="text-xs text-slate-400 mb-2">Garden Bonding Season quests from Prof. Aeon, Mochiko, and Hex in the Mainframe Region. Befriending raises Garden Stats — it does not replace capture.</p>
            <div className="flex flex-col gap-2">
              {MEMORY_QUESTS.map(q => (
                <div key={q.id} className="game-panel p-3 flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-white text-sm">{q.title} <span className="text-slate-400 font-normal">— {q.giver}</span></div>
                    <div className="text-xs text-slate-400 mt-1">{q.text} Reward: Bond +{q.bondReward}, {q.gardenStat} +{q.gardenReward}.</div>
                  </div>
                  <button
                    disabled={!current || !!completedQuests[q.id]}
                    onClick={() => completeQuest(q.id)}
                    className="game-button px-3 py-1.5 text-sm shrink-0 disabled:opacity-40"
                  >
                    {completedQuests[q.id] ? 'Done' : 'Complete Quest'}
                  </button>
                </div>
              ))}
            </div>
            <h3 className="text-white font-bold mt-4 mb-2">Garden places</h3>
            <div className="flex flex-wrap gap-2">
              {places.map(p => (
                <button key={p.name} onClick={() => setPlace(p.text)} className="game-button px-3 py-2 text-sm">{p.name}</button>
              ))}
            </div>
            {place && <div className="game-panel p-4 mt-3 text-sm text-slate-200">{place}</div>}
            {current && (
              <div className="mt-3">
                <MenuHelpLine text={`${current.nickname} — Lv. ${current.level} · Garden Form: ${gardenForm(rec.garden)} · Battle bonus: +${(gardenBattleBonus(rec.garden) * 100).toFixed(1)}%`} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
