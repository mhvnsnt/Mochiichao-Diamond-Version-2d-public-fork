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
import {
  newGardenRecord, enterCocoon, tickCocoon, plantPlot, harvestPlot,
  runRace, runSpar, createBreedingEgg, dataRebirth, GardenSaveRecord, upgradeGardenRecord,
} from '../../lib/garden-wiring';
import { GARDEN_CRITTERS } from '../../lib/garden-data';

/**
 * Mochi Garden — Mainframe Gardens as a reachable screen (pass 1).
 * Structure is real: Academy / Market / race track / sparring ring /
 * farm plots, Garden Stats, alignment (±25 band), Form I/II, battle
 * bonus capped +9%, Burst Form (+30% / 3 turns), Branch Evolution /
 * Data Revert, Mochi Link validation — all wired through
 * mochiichao-systems.ts, which was previously an unimported file.
 * Pass 2 (Garden lane, merged onto pass 3): Garden records live in
 * gameStore and persist with the save. Farm, race, sparring, breeding,
 * and cocoon are wired through garden-wiring.ts. Quest rewards stay
 * as MEMORY_QUESTS defines them (currently 0/0 placeholders until Mars
 * gives numbers) — this pass does not invent quest numbers.
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
  const gardenMinutes = useGameStore(s => s.gardenMinutes) || 0;
  const setGardenMinutes = useGameStore(s => s.setGardenMinutes);
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
      ? `${quest.title} complete!`
      : `${quest.title} complete! Bond +${quest.bondReward}, ${quest.gardenStat} +${quest.gardenReward}.`);
  };

  const current = party[Math.min(selected, Math.max(0, party.length - 1))];
  const rec: GardenSaveRecord = current ? upgradeGardenRecord(garden[current.id], current.speciesId, current.id.length) : (null as any);

  const feed = (item: Partial<GardenStats>, label: string) => {
    if (!current) return;
    const next = { ...rec, garden: applyGardenItem(rec.garden, item), trainingSessions: rec.trainingSessions + 1 };
    setGardenRecord(current.id, next);
    setNote(`${label} fed. Your Mochiichao looks happier.`);
  };

  const places: { name: string; text: string }[] = [
    { name: 'Mochiko Academy', text: 'Lessons and training sessions: complete a Bonding Quest above, or feed Data-Fruit below — each session is counted in trainingSessions and saved.' },
    { name: 'Market', text: 'Data Shards, Garden Critters and fruit trading: the Shop screen is the working shop for now; Garden Critters are listed below (21 types).' },
    { name: 'Race Track', text: 'Garden races: use Run Race below — speed is Sprint + Glide, Endurance decides late-race fade.' },
    { name: 'Sparring Ring', text: 'Dojo sparring: use Run Spar below — Might is damage, Endurance is HP, Sprint is ring speed, Dive/Glide is dodge.' },
    { name: 'Farm Plots', text: 'Data-Fruit farming: plant a seed in a plot below, wait 7 Garden minutes, harvest.' },
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
                  <div className="text-sm text-slate-300">Burst Form: +{BURST_BONUS * 100}% for {BURST_TURNS} turns</div>
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
              <h3 className="text-white font-bold mt-4 mb-2">Data-Fruit</h3>
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
                    setNote(cand ? `Branch Evolution is ready for ${current.nickname}!` : 'No Branch Evolution ready yet.');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Check Branch Evolution
                </button>
                <button
                  onClick={() => {
                    const reverted = dataRevert(rec);
                    setGardenRecord(current.id, reverted);
                    setNote('Data Revert applied. Garden stats are halved, colors and parts stay.');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Data Revert
                </button>
                <button
                  onClick={() => {
                    const errs = mochiLinkValidate(current.speciesId, current.speciesId, party.map(p => p.speciesId), current.speciesId);
                    setNote(errs.length ? `Mochi Link: ${errs.join(' ')}` : 'Mochi Link: both sides offer a creature.');
                  }}
                  className="game-button px-3 py-1.5 text-sm"
                >
                  Check Mochi Link
                </button>
              </div>
              {note && <div className="mt-3 text-sm text-slate-200 bg-black/40 rounded-lg p-3">{note}</div>}
            </div>
            <h3 className="text-white font-bold mt-4 mb-2">Farm Plots (3 plots, ready after 7 Garden minutes)</h3>
            <div className="flex flex-wrap gap-2">
              {rec.farm.map(p => (
                <button key={p.id} onClick={() => {
                  if (!p.seed) { setGardenRecord(current.id, plantPlot(rec, p.id, 'Aqua Fruit', gardenMinutes)); setNote(`${p.id} planted with Aqua Fruit.`); }
                  else { const r = harvestPlot(rec, p.id, gardenMinutes); if (r.fruit) { setGardenRecord(current.id, r.rec); setNote(`Harvested ${r.fruit} from ${p.id}.`); } else setNote(`${p.id} not ready yet (ready at ${p.readyAt}, now ${gardenMinutes}).`); }
                }} className="game-button px-3 py-1.5 text-sm">{p.id}: {p.seed || 'empty'}</button>
              ))}
              <button onClick={() => { setGardenMinutes(gardenMinutes + 7); setNote('Garden time +7 minutes.'); }} className="game-button px-3 py-1.5 text-sm">Advance Garden Time +7</button>
            </div>
            <h3 className="text-white font-bold mt-4 mb-2">Data Cocoon / Data Rebirth</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { const n = enterCocoon(rec, gardenMinutes); setGardenRecord(current.id, n); setNote(n.cocoon ? `Entered Data Cocoon, emerges at ${n.cocoon.endsAt}.` : 'No cocoon: needs Garden Form I (150 total) or II (300).'); }} className="game-button px-3 py-1.5 text-sm">Enter Cocoon</button>
              <button onClick={() => { const n = tickCocoon(rec, gardenMinutes); setGardenRecord(current.id, n); setNote(n.cocoon ? 'Cocoon still active.' : 'Cocoon complete (or none active).'); }} className="game-button px-3 py-1.5 text-sm">Check Cocoon</button>
              <button onClick={() => { if (rec.bond > 50) { const n = dataRebirth(rec); setGardenRecord(current.id, n); setNote('Data Rebirth: stats halved, parts kept, Rebirth Egg created.'); } else setNote('Data Rebirth needs Bond >50 — Last-Chance window instead.'); }} className="game-button px-3 py-1.5 text-sm">Data Rebirth (Bond &gt;50)</button>
            </div>
            <div className="text-xs text-slate-400 mt-1">Cocoon: {rec.cocoon ? `active, ends ${rec.cocoon.endsAt}` : 'none'} · Rebirths: {rec.rebirths} · Mythic: {rec.mythic ? 'yes' : 'no'} · Egg: {rec.egg ? rec.egg.speciesId : 'none'}</div>
            <h3 className="text-white font-bold mt-4 mb-2">Race Track / Sparring Ring</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { const rival = party.length > 1 ? garden[party[1].id]?.garden || ZERO : ZERO; const r = runRace(rec.garden, rival); if (r === 'A') setGardenRecord(current.id, { ...rec, raceWins: rec.raceWins + 1 }); setNote(r === 'A' ? 'Race won! Sprint + Glide beat the rival, Endurance held the fade.' : r === 'B' ? 'Race lost — train Sprint/Glide or Endurance.' : 'Race tied.'); }} className="game-button px-3 py-1.5 text-sm">Run Race</button>
              <button onClick={() => { const rival = party.length > 1 ? garden[party[1].id]?.garden || ZERO : ZERO; const r = runSpar(rec.garden, rival); if (r === 'A') setGardenRecord(current.id, { ...rec, sparWins: rec.sparWins + 1 }); setNote(r === 'A' ? 'Spar won! Might + Endurance + Sprint + dodge held.' : r === 'B' ? 'Spar lost — train Might/Endurance.' : 'Spar tied.'); }} className="game-button px-3 py-1.5 text-sm">Run Spar</button>
            </div>
            <div className="text-xs text-slate-400 mt-1">Race wins: {rec.raceWins} · Spar wins: {rec.sparWins}</div>
            <h3 className="text-white font-bold mt-4 mb-2">Bonding Season / Breeding</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => {
                if (party.length < 2) { setNote('Breeding needs a second party creature.'); return; }
                const other = upgradeGardenRecord(garden[party[1].id], party[1].speciesId, party[1].id.length);
                const egg = createBreedingEgg(rec, other, null, 50);
                if (!egg) { setNote('Mythic creatures cannot breed.'); return; }
                setGardenRecord(current.id, { ...rec, egg });
                setNote(`Bonding Season Egg created: ${egg.speciesId} (higher-Bond parent default, player can override in a future pass). No hybrid species, Garden Form not inherited.`);
              }} className="game-button px-3 py-1.5 text-sm">Create Bonding Season Egg</button>
            </div>
            <div className="text-xs text-slate-400 mt-1">Garden Critters (21 types, Mythic gate): {GARDEN_CRITTERS.map(c => c.name).join(', ')}</div>
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
