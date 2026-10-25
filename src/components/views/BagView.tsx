import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DATA_CARD_ID } from '../../lib/monster-tamer-systems';
import { ITEM_ICONS } from '../../lib/uiArt';
import { MenuHelpLine } from '../game/MenuList';

/**
 * Bag, v2 structure (bag_view.c / item_menu.c, structure/rules only):
 * a pocketed list grouped by pocket/type, cursor, icon + description
 * for the selected item, use/give/toss/quit context where the existing
 * inventory system supports them. Items, names, and descriptions are
 * the existing ShopView items only — nothing invented.
 *
 * Honest limits, stated in the UI itself: gameStore.useItem only
 * decrements a count; no item effect (heal, revive, capture) is wired
 * through the bag in this build, so Use only changes the count and
 * says so. Give is not offered as a working action: there is no
 * trade or held-item system to give to. Toss discards one, with a
 * confirm window, using the same decrement.
 */
const ITEM_DETAILS: Record<string, { name: string; desc: string; pocket: string }> = {
  luigi_cube: { name: 'Luigi Cube', desc: 'A sketchy syndicate-brand capture device.', pocket: 'Capture' },
  mend_patch: { name: 'Mend Patch', desc: 'Restores 50 HP.', pocket: 'Medicine' },
  revive_core: { name: 'Revive Core', desc: 'Reboots a fainted Mochiichao to 50% capacity.', pocket: 'Medicine' },
  [DATA_CARD_ID]: { name: 'Data Card', desc: 'Stores a captured creature\u2019s data. Swap it at the PC.', pocket: 'Storage' },
};

function ItemIcon({ id }: { id: string }) {
  const slot = ITEM_ICONS[id];
  if (slot?.assetUrl) return <img src={slot.assetUrl} alt="" className="w-8 h-8 shrink-0" />;
  return <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10 rounded text-xs font-bold text-slate-200">{id.slice(0, 1).toUpperCase()}</span>;
}

export default function BagView({ onBack }: { onBack: () => void }) {
  const inventory = useGameStore(s => s.inventory);
  const useItem = useGameStore(s => s.useItem);
  const [selected, setSelected] = useState(0);
  const [confirmToss, setConfirmToss] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const entries = Object.entries(inventory)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => ({ id, count, ...(ITEM_DETAILS[id] || { name: id, desc: 'An item from your bag.', pocket: 'Other' }) }))
    .sort((a, b) => a.pocket.localeCompare(b.pocket) || a.name.localeCompare(b.name));
  const current = entries[Math.min(selected, Math.max(0, entries.length - 1))];
  const pockets = [...new Set(entries.map(e => e.pocket))];

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Bag</h2>
        <button onClick={onBack} className="game-button px-4 py-2 min-h-[48px]">Close</button>
      </div>
      {message && <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">{message}</div>}
      {entries.length === 0 ? (
        <div className="game-panel p-6 text-center text-slate-300">Bag is empty.</div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
            {pockets.map(pocket => (
              <div key={pocket}>
                <h3 className="text-white font-bold mb-2 text-sm">{pocket}</h3>
                <div className="flex flex-col gap-2">
                  {entries.filter(e => e.pocket === pocket).map(entry => {
                    const i = entries.indexOf(entry);
                    return (
                      <button
                        key={entry.id}
                        onClick={() => setSelected(i)}
                        onMouseEnter={() => setSelected(i)}
                        onFocus={() => setSelected(i)}
                        className={`game-panel p-3 flex items-center gap-3 text-left min-h-[48px] ${i === selected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
                      >
                        <ItemIcon id={entry.id} />
                        <span className="flex-1 font-bold text-white">{i === selected ? '► ' : ''}{entry.name}</span>
                        <span className="text-yellow-300 font-bold shrink-0">×{entry.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {current && (
            <div className="game-panel p-4 shrink-0">
              <div className="flex items-center gap-3">
                <ItemIcon id={current.id} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white">{current.name} ×{current.count}</div>
                  <div className="text-sm text-slate-400">{current.desc}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => { if (useItem(current.id)) setMessage(`Used ${current.name}. Count only — no item effect is wired through the bag in this build yet.`); }}
                  className="game-button px-3 py-2 text-sm min-h-[48px]"
                >
                  Use
                </button>
                <button className="game-button px-3 py-2 text-sm min-h-[48px] opacity-60" disabled title="No trade or held-item system exists to give to yet.">Give</button>
                <button onClick={() => setConfirmToss(true)} className="game-button px-3 py-2 text-sm min-h-[48px]">Toss</button>
                <button onClick={onBack} className="game-button px-3 py-2 text-sm min-h-[48px]">Quit</button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Use changes the count only in this build. Give is not available: there is no trade or held-item system yet.</p>
            </div>
          )}
          <MenuHelpLine text={current ? `${current.name} — ${current.desc}` : 'Select an item.'} />
        </div>
      )}
      {confirmToss && current && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">Toss one {current.name}?</div>
            <p className="text-sm text-slate-400 mb-4">It will be removed from your bag.</p>
            <div className="flex gap-2">
              <button onClick={() => { useItem(current.id); setMessage(`Tossed one ${current.name}.`); setConfirmToss(false); }} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">Yes</button>
              <button onClick={() => setConfirmToss(false)} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
