import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import CreaturePortrait from '../game/CreaturePortrait';
import { SPECIES_DB } from '../../lib/species';
import { DATA_CARD_ID } from '../../lib/monster-tamer-systems';
import { MenuHelpLine } from '../game/MenuList';
import { useMenuSkin, menuSkinVars } from '../../lib/menuSkins';
import { STORAGE_RULES } from '../../lib/playableWiring';

/**
 * PC storage, v2 structure (pokemon_storage_system_menu.c, structure/
 * rules only): boxes, NOT one long list — box select, then a grid of
 * slots in that box, Deposit / Withdraw with confirm, cursor preserved
 * per box. Release is deliberately NOT added: it requires Mars's
 * explicit say-so, which has not been given.
 *
 * Boxes are computed from the stored list in chunks of 30 (Box 1
 * always exists, more appear as creatures are stored). Party and PC
 * data themselves are the existing store lists — no new storage
 * system, no new save field.
 */
const BOX_SIZE = STORAGE_RULES.slotsPerBox;

// Preserved cursor per box (module scope, like Roster's preserved
// cursor): a cursor, not game state, so it is not a store/save field.
const boxCursor: Record<number, number> = {};

export default function PcView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const pc = useGameStore(s => s.pc);
  const inventory = useGameStore(s => s.inventory);
  const useItem = useGameStore(s => s.useItem);
  const [cardStored, setCardStored] = useState<Record<string, boolean>>({});
  const [box, setBox] = useState(0);
  const [selected, setSelected] = useState(() => boxCursor[0] || 0);
  const [confirm, setConfirm] = useState<{ kind: 'deposit' | 'withdraw'; id: string; name: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // Y2K skin wiring (skins PR #151 presets via menuSkins.ts): null =
  // default look, untouched. When set, data-menu-skin + variables on
  // the root restyle .game-panel frames/text via menuSkins.css; the
  // selected slot wears .skin-selected instead of the yellow ring.
  const skin = useMenuSkin('pc');

  const boxCount = Math.max(1, Math.ceil(pc.length / BOX_SIZE));
  const safeBox = Math.min(box, boxCount - 1);
  const boxCreatures = pc.slice(safeBox * BOX_SIZE, safeBox * BOX_SIZE + BOX_SIZE);
  const selectedCreature = boxCreatures[Math.min(selected, Math.max(0, boxCreatures.length - 1))];

  const selectBox = (b: number) => { setBox(b); setSelected(boxCursor[b] || 0); };
  const selectSlot = (i: number) => { boxCursor[safeBox] = i; setSelected(i); };

  const moveToParty = (id: string) => {
    if (party.length >= STORAGE_RULES.partyMax) return;
    const m = pc.find(x => x.id === id);
    if (!m) return;
    useGameStore.setState(s => ({ pc: s.pc.filter(x => x.id !== id), party: [...s.party, m] }));
  };
  const moveToPc = (id: string) => {
    const m = party.find(x => x.id === id);
    if (!m) return;
    useGameStore.setState(s => ({ party: s.party.filter(x => x.id !== id), pc: [...s.pc, m] }));
  };

  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'withdraw') { moveToParty(confirm.id); setMessage(`${confirm.name} withdrawn to your team.`); }
    else { moveToPc(confirm.id); setMessage(`${confirm.name} deposited to PC storage.`); }
    setConfirm(null);
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]" data-menu-skin={skin?.id} style={menuSkinVars(skin)}>
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">PC Storage</h2>
        <button onClick={onBack} className="game-button px-4 py-2 min-h-[48px]">Close</button>
      </div>
      {message && <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">{message}</div>}
      <div className="text-sm text-slate-300 mb-3 shrink-0">Data Cards in bag: {inventory[DATA_CARD_ID] || 0} — buy them in the Shop, then store a PC creature&apos;s data on one. It stays swappable at the PC. Release is not offered here.</div>

      <div className="flex gap-2 mb-4 shrink-0 flex-wrap">
        {Array.from({ length: boxCount }, (_, b) => (
          <button
            key={b}
            onClick={() => selectBox(b)}
            className={`game-button px-3 py-2 text-sm min-h-[48px] ${b === safeBox ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
          >
            Box {b + 1}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden min-h-0">
        <div className="overflow-y-auto pr-1">
          <h3 className="text-white font-bold mb-2">Box {safeBox + 1} ({boxCreatures.length} / {BOX_SIZE})</h3>
          {boxCreatures.length === 0 ? (
            <div className="text-slate-400 text-sm">This box is empty. Extra catches go here automatically.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {boxCreatures.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => selectSlot(i)}
                  onMouseEnter={() => selectSlot(i)}
                  onFocus={() => selectSlot(i)}
                  className={`game-panel p-2 flex flex-col items-center gap-1 min-h-[48px] ${i === selected ? (skin ? 'skin-selected' : 'ring-2 ring-yellow-300') : 'opacity-80'}`}
                >
                  <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
                  <span className="text-xs text-white truncate w-full text-center">{i === selected ? '► ' : ''}{m.nickname}</span>
                  <span className="text-[11px] text-slate-400">Lv. {m.level}</span>
                </button>
              ))}
            </div>
          )}
          {selectedCreature && (
            <div className="game-panel p-4 mt-4">
              <div className="font-bold text-white">{selectedCreature.nickname} — Lv. {selectedCreature.level} · {SPECIES_DB[selectedCreature.speciesId]?.name}</div>
              <div className="text-sm text-slate-400 mt-1">HP {Math.ceil(selectedCreature.hp)} / {selectedCreature.maxHp}</div>
              {cardStored[selectedCreature.id] && <div className="text-xs text-teal-300 mt-1">Stored on Data Card — swappable at the PC</div>}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  disabled={party.length >= STORAGE_RULES.partyMax}
                  onClick={() => setConfirm({ kind: 'withdraw', id: selectedCreature.id, name: selectedCreature.nickname })}
                  className="game-button px-3 py-2 text-xs min-h-[48px]"
                >
                  Withdraw to Team
                </button>
                <button
                  disabled={!cardStored[selectedCreature.id] && (inventory[DATA_CARD_ID] || 0) <= 0}
                  onClick={() => { if (!cardStored[selectedCreature.id] && useItem(DATA_CARD_ID)) setCardStored(s => ({ ...s, [selectedCreature.id]: true })); }}
                  className="game-button px-3 py-2 text-xs min-h-[48px]"
                >
                  {cardStored[selectedCreature.id] ? 'On Card' : 'Store on Data Card'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto pr-1">
          <h3 className="text-white font-bold mb-2">Party ({party.length}/6)</h3>
          {party.map(m => (
            <div key={m.id} className="game-panel p-3 mb-2 flex items-center gap-3">
              <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">{m.nickname}</div>
                <div className="text-xs text-slate-400">Lv. {m.level} · {SPECIES_DB[m.speciesId]?.name}</div>
              </div>
              <button onClick={() => setConfirm({ kind: 'deposit', id: m.id, name: m.nickname })} className="game-button px-2 py-2 text-xs min-h-[48px]">Deposit</button>
            </div>
          ))}
          {party.length === 0 && <div className="text-slate-400 text-sm">Party is empty.</div>}
        </div>
      </div>

      <div className="shrink-0 mt-3">
        <MenuHelpLine text={selectedCreature ? `${selectedCreature.nickname} — Box ${safeBox + 1}, slot ${selected + 1}. Withdraw moves it to your team; Deposit moves a team member here.` : 'Select a box, then a slot.'} />
      </div>

      {confirm && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">
              {confirm.kind === 'withdraw' ? `Withdraw ${confirm.name} to your team?` : `Deposit ${confirm.name} to PC storage?`}
            </div>
            <p className="text-sm text-slate-400 mb-4">Nothing moves until you confirm.</p>
            <div className="flex gap-2">
              <button onClick={doConfirm} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">Yes</button>
              <button onClick={() => setConfirm(null)} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
