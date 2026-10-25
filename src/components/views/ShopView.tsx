import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

/**
 * Shop as a game shop: item cards with prices in CR, buy buttons, and an
 * inventory panel. No terminal table, no bracket links, no forge panel.
 */
export default function ShopView({ onBack }: { onBack: () => void }) {
  const wallet = useGameStore(s => s.wallet);
  const inventory = useGameStore(s => s.inventory);
  const buyItem = useGameStore(s => s.buyItem);
  const useItem = useGameStore(s => s.useItem);
  const gainWallet = useGameStore(s => s.gainWallet);
  const [message, setMessage] = useState<string | null>(null);

  const shopItems = [
    { id: 'luigi_cube', name: 'Luigi Cube', cost: 250, desc: 'A sketchy syndicate-brand capture device.' },
    { id: 'mend_patch', name: 'Mend Patch', cost: 150, desc: 'Restores 50 HP.' },
    { id: 'revive_core', name: 'Revive Core', cost: 500, desc: 'Reboots a fainted Mochiichao to 50% capacity.' },
  ];

  const handleBuy = (id: string, cost: number, name: string) => {
    if (buyItem(id, cost)) {
      setMessage(`Bought ${name}!`);
    } else {
      setMessage('Not enough Credits for that one.');
    }
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <button onClick={onBack} className="game-button px-3 py-1.5 text-sm mb-2">Leave Shop</button>
          <h2 className="game-title text-2xl">Syndicate Kiosk</h2>
          <p className="text-sm text-slate-400">No returns, no refunds. — Luigi</p>
        </div>
        <div className="game-panel px-4 py-2 text-yellow-300 font-bold shrink-0">
          {wallet} CR
        </div>
      </div>

      {message && <div className="game-panel px-4 py-2 mb-4 text-white shrink-0">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden min-h-0">
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {shopItems.map(item => (
            <div key={item.id} className="game-panel p-4 flex justify-between items-center gap-3">
              <div>
                <div className="font-bold text-white">{item.name}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-sm font-bold text-yellow-300">{item.cost} CR</div>
                <button
                  onClick={() => handleBuy(item.id, item.cost, item.name)}
                  disabled={wallet < item.cost}
                  className="game-button px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="game-panel p-5 flex flex-col min-h-0">
          <h3 className="text-lg font-bold text-white mb-4">Your Bag</h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {Object.entries(inventory).filter(([, count]) => count > 0).length === 0 && (
              <div className="text-sm text-slate-500 italic">Bag is empty.</div>
            )}
            {Object.entries(inventory).map(([id, count]) => {
              if (count <= 0) return null;
              const details = shopItems.find(i => i.id === id);
              const sellPrice = details ? Math.floor(details.cost / 2) : 0;
              return (
                <div key={id} className="flex justify-between items-center text-sm border-b border-white/10 pb-2 gap-2">
                  <span className="text-slate-200">{details?.name || id}</span>
                  <span className="text-yellow-300 font-bold">×{count}</span>
                  {details && (
                    <button
                      onClick={() => { if (useItem(id)) { gainWallet(sellPrice); setMessage(`Sold ${details.name} for ${sellPrice} CR.`); } }}
                      className="game-button px-2 py-1 text-xs"
                    >
                      Sell {sellPrice} CR
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
