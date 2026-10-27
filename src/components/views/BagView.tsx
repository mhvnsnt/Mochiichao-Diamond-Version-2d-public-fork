import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DATA_CARD_ID } from '../../lib/monster-tamer-systems';
import { ITEM_ICONS } from '../../lib/uiArt';
import { MenuHelpLine } from '../game/MenuList';

/**
 * Bag, v5.2 heal wiring: Mend Patch now actually heals (see Use
 * handler below) — before v5.2 Use only decremented the count and
 * said so, even though the item already said "Restores 50 HP."
 * Bag, v2 structure (bag_view.c / item_menu.c, structure/rules only):
 * a pocketed list grouped by pocket/type, cursor, icon + description
 * for the selected item, use/give/toss/quit context where the existing
 * inventory system supports them. Items, names, and descriptions are
 * the existing ShopView items only — nothing invented.
 *
 * Honest limits, stated in the UI itself: Mend Patch heals 50 HP
 * (v5.2); other items' Use only decrements a count, no other item
 * effect (revive, capture) is wired through the bag in this build,
 * so Use for those only changes the count and says so. Give is
 * not offered as a working action: there is no trade or held-item
 * system to give to. Toss discards one, with a confirm window,
 * using the same decrement.
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
  const party = useGameStore(s => s.party);
  const updatePartyMember = useGameStore(s => s.updatePartyMember);
  const [selected, setSelected] = useState(0);
  const [confirmToss, setConfirmToss] = useState(false);
  const [mendSelect, setMendSelect] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const entries = Object.entries(inventory)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => ({ id, count, ...(ITEM_DETAILS[id] || { name: id, desc: 'An item from your bag.', pocket: 'Other' }) }))
    .sort((a, b) => a.pocket.localeCompare(b.pocket) || a.name.localeCompare(b.name));
  const current = entries[Math.min(selected, Math.max(0, entries.length - 1))];
  const pockets = [...new Set(entries.map(e => e.pocket))];

  // v5.3: Y/N keys for the Toss confirm prompt. DialogueBox already
  // answers Y/N for choice dialogues, but this prompt is a separate
  // component in BagView with no key handler at all — so in the
  // v5.2 playtest pressing N did nothing and the prompt had to be
  // clicked away. Y confirms the toss, N cancels it; wording and
  // behaviour are otherwise unchanged.
  const doTossYes = () => {
    if (!current) return;
    useItem(current.id);
    setMessage(`Tossed one ${current.name}.`);
    setConfirmToss(false);
  };
  useEffect(() => {
    if (!confirmToss) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') doTossYes();
      else if (e.key === 'n' || e.key === 'N') setConfirmToss(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmToss, current]);

  // Audit-plan Mend Patch selection (Pokemon bag flow shape):
  // the player CHOOSES which damaged, non-fainted member to heal.
  // 50 HP, clamped to maxHp, hp + currentHp in sync, fainted NOT
  // revived, nothing consumed when nobody needs healing or only
  // fainted members remain. Healing exactly one damaged member
  // needs no picker — the choice is unambiguous.
  const mendCur = (m: any) => m.hp ?? m.currentHp ?? 0;
  const mendDamaged = () => party.map((m, i) => ({ m, i })).filter(({ m }) => mendCur(m) > 0 && mendCur(m) < m.maxHp);
  const healMember = (idx: number) => {
    if (!useItem('mend_patch')) return;
    const m = party[idx];
    const healed = Math.min(m.maxHp, mendCur(m) + 50);
    updatePartyMember(idx, { ...m, hp: healed, currentHp: healed } as any);
    setMessage(`Used Mend Patch. ${m.nickname || 'Your Mochiichao'} restored to ${healed}/${m.maxHp} HP.`);
    setMendSelect(false);
  };

  // Bag Y2K skin ONLY (per-menu skins 2/8): .bag-y2k (index.css) gives
  // this screen the Y2K skin — glossy green gradient, white border,
  // glow, star/heart accents. Pocket order, inputs, and behaviour are
  // unchanged; the sparkles below are decorative (aria-hidden,
  // non-interactive) and sit in the screen's padding corners.
  return (
    <div className="bag-y2k game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 left-3 text-lime-200 text-lg">✦</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 right-3 text-yellow-300 text-lg">♥</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 left-3 text-emerald-200 text-base">★</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 right-3 text-lime-300 text-base">✦</span>
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
                  onClick={() => {
                    // v5.2: Mend Patch actually restores 50 HP (its
                    // existing description) to the first party member
                    // that is damaged but not fainted, clamped to
                    // maxHp, with hp and currentHp kept in sync
                    // (v5.1 HP-sync rule). Fainted members are NOT
                    // revived by a Mend Patch, and nothing is
                    // consumed when nobody needs healing or only
                    // fainted members remain. Other items keep the
                    // old count-only behaviour and say so.
                    if (current.id === 'mend_patch') {
                      // Audit-plan selection: choose the target.
                      // Fainted members are skipped (cur > 0
                      // required). A party with only fainted
                      // members is unreachable in the overworld
                      // (full loss triggers blackout), so the
                      // only-fainted refusal message below
                      // remains untested in live play — stated
                      // plainly, not claimed as verified. (Old
                      // blackout 30% heal note removed: audit-plan
                      // blackout no longer heals at all — see
                      // WorldEngine blackout rule.)
                      const damaged = mendDamaged();
                      if (damaged.length === 0) {
                        setMessage(party.length === 0 ? 'You have no Mochiichao yet.' : party.every(m => mendCur(m) <= 0) ? 'Mend Patch cannot revive a fainted Mochiichao.' : 'No Mochiichao needs healing right now.');
                        return;
                      }
                      if (damaged.length === 1) { healMember(damaged[0].i); return; }
                      setMendSelect(true);
                      return;
                    }
                    if (useItem(current.id)) setMessage(`Used ${current.name}.`);
                  }}
                  className="game-button px-3 py-2 text-sm min-h-[48px]"
                >
                  Use
                </button>
                <button className="game-button px-3 py-2 text-sm min-h-[48px] opacity-60" disabled>Give</button>
                <button onClick={() => setConfirmToss(true)} className="game-button px-3 py-2 text-sm min-h-[48px]">Toss</button>
                <button onClick={onBack} className="game-button px-3 py-2 text-sm min-h-[48px]">Quit</button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Mend Patch restores 50 HP to a party member you choose.</p>
            </div>
          )}
          <MenuHelpLine text={current ? `${current.name} — ${current.desc}` : 'Select an item.'} />
        </div>
      )}
      {mendSelect && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">Heal who with a Mend Patch?</div>
            <p className="text-sm text-slate-400 mb-4">Restores 50 HP. Fainted members cannot be revived by a Mend Patch.</p>
            <div className="flex flex-col gap-2">
              {party.map((m: any, i: number) => {
                const cur = mendCur(m);
                const usable = cur > 0 && cur < m.maxHp;
                return (
                  <button key={i} disabled={!usable} onClick={() => healMember(i)} className="game-button px-4 py-2 font-bold min-h-[48px] text-left disabled:opacity-40">
                    {m.nickname || 'Your Mochiichao'} — {cur}/{m.maxHp} HP{usable ? '' : cur <= 0 ? ' (fainted)' : ' (full HP)'}
                  </button>
                );
              })}
              <button onClick={() => setMendSelect(false)} className="game-button px-4 py-2 font-bold min-h-[48px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {confirmToss && current && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">Toss one {current.name}?</div>
            <p className="text-sm text-slate-400 mb-4">It will be removed from your bag.</p>
            <div className="flex gap-2">
              <button onClick={doTossYes} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">Yes</button>
              <button onClick={() => setConfirmToss(false)} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
