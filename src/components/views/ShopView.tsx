import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { DATA_CARD_COST, DATA_CARD_ID } from '../../lib/monster-tamer-systems';
import { ITEM_ICONS } from '../../lib/uiArt';
import { MenuHelpLine } from '../game/MenuList';

/**
 * Shop, v2 structure (shop.c, structure/rules only, no Pokemon code,
 * art, text, or names copied): Buy / Sell / Quit FIRST, not a direct
 * item list. Buy list rows = icon + name + price, cursor at the row,
 * scroll arrows when the list scrolls, description + icon for the
 * selected item, confirm window BEFORE money is taken, then back to
 * the item list (NOT back to the world). CR is the money, same flow.
 * Items and prices are the existing ShopView items only — nothing new.
 * Audit-plan: ALL shop prices here are PLACEHOLDER prices, NOT
 * Mars canon, until Mars sets the CR economy (starting wallet is
 * 1000 CR in gameStore, verified in this PR; trainer rewards must
 * be checked against that same economy in the same PR — reward
 * numbers were NOT changed here, they have no source either).
 * Tiers are kept (capture low, 50-HP heal mid, 50% revive high);
 * no CR exchange rate is invented. The placeholder status is
 * stated in the buy screen itself, not only in this comment.
 */
const SHOP_ITEMS = [
  { id: 'luigi_cube', name: 'Luigi Cube', cost: 250, desc: 'A sketchy syndicate-brand capture device.' },
  { id: 'mend_patch', name: 'Mend Patch', cost: 150, desc: 'Restores 50 HP.' },
  { id: 'revive_core', name: 'Revive Core', cost: 500, desc: 'Reboots a fainted Mochiichao to 50% capacity.' },
  { id: DATA_CARD_ID, name: 'Data Card', cost: DATA_CARD_COST, desc: 'Stores a captured creature\u2019s data. Swap it at the PC. (Placeholder price — not Mars canon.)' },
];

function ItemIcon({ id }: { id: string }) {
  const slot = ITEM_ICONS[id];
  if (slot?.assetUrl) return <img src={slot.assetUrl} alt="" className="w-8 h-8 shrink-0" />;
  return <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10 rounded text-xs font-bold text-slate-200">{id.slice(0, 1).toUpperCase()}</span>;
}

export default function ShopView({ onBack }: { onBack: () => void }) {
  const wallet = useGameStore(s => s.wallet);
  const inventory = useGameStore(s => s.inventory);
  const buyItem = useGameStore(s => s.buyItem);
  const useItem = useGameStore(s => s.useItem);
  const gainWallet = useGameStore(s => s.gainWallet);
  const [mode, setMode] = useState<'menu' | 'buy' | 'sell'>('menu');
  // Selection changes on click / keyboard focus ONLY. Hover selection
  // was removed after the 2026-10-27 live playtest: moving the mouse
  // down to the Buy button crossed intervening rows, and the last
  // row's hover fired first, so Buy confirmed Data Card instead of
  // the selected Revive Core / Mend Patch. No price, order, or
  // confirm behaviour changes.
  const [selected, setSelected] = useState(0);
  const [confirm, setConfirm] = useState<{ kind: 'buy' | 'sell'; id: string; name: string; price: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const updateArrows = () => {
    const el = listRef.current;
    if (!el) return;
    setCanUp(el.scrollTop > 0);
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  };

  const sellable = SHOP_ITEMS
    .map(item => ({ ...item, count: inventory[item.id] || 0, sellPrice: Math.floor(item.cost / 2) }))
    .filter(item => item.count > 0);
  const buySelected = SHOP_ITEMS[Math.min(selected, SHOP_ITEMS.length - 1)];
  const sellSelected = sellable[Math.min(selected, Math.max(0, sellable.length - 1))];

  // Audit-plan Y/N scope: YES/NO key handling must cover ALL
  // yes/no prompts, not only DialogueBox choices and Bag Toss.
  // Shop buy/sell confirm: Y confirms, N cancels. Wording and
  // behaviour are otherwise unchanged.
  useEffect(() => {
    if (!confirm) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') doConfirm();
      else if (e.key === 'n' || e.key === 'N') setConfirm(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirm]);

  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'buy') {
      if (buyItem(confirm.id, confirm.price)) setMessage(`Bought ${confirm.name}!`);
      else setMessage('Not enough Credits for that one.');
    } else {
      if (useItem(confirm.id)) { gainWallet(confirm.price); setMessage(`Sold ${confirm.name} for ${confirm.price} CR.`); }
      else setMessage(`No ${confirm.name} to sell.`);
    }
    setConfirm(null);
    // Back to the item list, NOT back to the world.
    setSelected(0);
  };

  // Shop Y2K skin ONLY (per-menu skins 3/8): .shop-y2k (index.css) gives
  // this screen the Y2K skin — glossy yellow gradient, white border,
  // glow, star/heart accents. Buy/Sell/Quit order, stock, prices,
  // wording, item order, inputs, and behaviour are unchanged; the
  // sparkles below are decorative (aria-hidden, non-interactive)
  // and sit in the screen's padding corners.
  return (
    <div className="shop-y2k game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 left-3 text-yellow-200 text-lg">✦</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 right-3 text-amber-300 text-lg">♥</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 left-3 text-yellow-300 text-base">★</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 right-3 text-amber-200 text-base">✦</span>
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <h2 className="game-title text-2xl">Syndicate Kiosk</h2>
          <p className="text-sm text-slate-400">No returns, no refunds. — Luigi</p>
        </div>
        <div className="game-panel px-4 py-2 text-yellow-300 font-bold shrink-0">{wallet} CR</div>
      </div>

      {message && <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">{message}</div>}

      {mode === 'menu' && (
        <div className="flex flex-col gap-3 max-w-md">
          <button onClick={() => { setMode('buy'); setSelected(0); }} className="game-button px-4 py-3 text-left font-bold min-h-[48px]">► Buy</button>
          <button onClick={() => { setMode('sell'); setSelected(0); }} className="game-button px-4 py-3 text-left font-bold min-h-[48px]">► Sell</button>
          <button onClick={onBack} className="game-button px-4 py-3 text-left font-bold min-h-[48px]">► Quit</button>
          <MenuHelpLine text="Buy items, sell items from your bag, or leave the shop." />
        </div>
      )}

      {mode === 'buy' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex gap-2 mb-3 shrink-0">
            <button onClick={() => setMode('menu')} className="game-button px-3 py-2 text-sm min-h-[48px]">◄ Back to Buy / Sell / Quit</button>
          </div>
          <p className="text-xs text-slate-400 mb-3 shrink-0">Shop prices are placeholders until Mars sets the CR economy — not canon. Tiers only: capture low, 50-HP heal mid, 50% revive high.</p>
          {canUp && <div className="text-center text-slate-300 text-sm shrink-0" aria-hidden="true">▲</div>}
          <div ref={listRef} onScroll={updateArrows} className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {SHOP_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                className={`game-panel p-3 flex items-center gap-3 text-left min-h-[48px] ${i === selected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
              >
                <ItemIcon id={item.id} />
                <span className="flex-1 font-bold text-white">{i === selected ? '► ' : ''}{item.name}</span>
                <span className="text-sm font-bold text-yellow-300 shrink-0">{item.cost} CR</span>
              </button>
            ))}
          </div>
          {canDown && <div className="text-center text-slate-300 text-sm shrink-0" aria-hidden="true">▼</div>}
          <div className="game-panel p-4 mt-3 shrink-0 flex items-center gap-3">
            <ItemIcon id={buySelected.id} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white">{buySelected.name} — {buySelected.cost} CR</div>
              <div className="text-sm text-slate-400">{buySelected.desc}</div>
            </div>
            <button
              onClick={() => setConfirm({ kind: 'buy', id: buySelected.id, name: buySelected.name, price: buySelected.cost })}
              disabled={wallet < buySelected.cost}
              className="game-button px-3 py-2 text-sm disabled:opacity-40 min-h-[48px] shrink-0"
            >
              Buy
            </button>
          </div>
        </div>
      )}

      {mode === 'sell' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex gap-2 mb-3 shrink-0">
            <button onClick={() => setMode('menu')} className="game-button px-3 py-2 text-sm min-h-[48px]">◄ Back to Buy / Sell / Quit</button>
          </div>
          {sellable.length === 0 ? (
            <div className="game-panel p-6 text-center text-slate-300">Nothing to sell — your bag is empty.</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                {sellable.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
                    className={`game-panel p-3 flex items-center gap-3 text-left min-h-[48px] ${i === selected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
                  >
                    <ItemIcon id={item.id} />
                    <span className="flex-1 font-bold text-white">{i === selected ? '► ' : ''}{item.name} ×{item.count}</span>
                    <span className="text-sm font-bold text-yellow-300 shrink-0">{item.sellPrice} CR</span>
                  </button>
                ))}
              </div>
              {sellSelected && (
                <div className="game-panel p-4 mt-3 shrink-0 flex items-center gap-3">
                  <ItemIcon id={sellSelected.id} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white">{sellSelected.name} — sell for {sellSelected.sellPrice} CR</div>
                    <div className="text-sm text-slate-400">{sellSelected.desc}</div>
                  </div>
                  <button
                    onClick={() => setConfirm({ kind: 'sell', id: sellSelected.id, name: sellSelected.name, price: sellSelected.sellPrice })}
                    className="game-button px-3 py-2 text-sm min-h-[48px] shrink-0"
                  >
                    Sell
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {confirm && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">
              {confirm.kind === 'buy' ? `Buy ${confirm.name} for ${confirm.price} CR?` : `Sell ${confirm.name} for ${confirm.price} CR?`}
            </div>
            <p className="text-sm text-slate-400 mb-4">No money or items change until you confirm.</p>
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
