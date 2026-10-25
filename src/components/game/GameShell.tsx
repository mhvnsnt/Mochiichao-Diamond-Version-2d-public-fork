import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { saveGame } from '../../lib/saveSystem';
import CreaturePortrait from './CreaturePortrait';
import { UiPanel, UiButton } from './UiArt';
import { UI_ART } from '../../lib/uiArt';

/** In-game pause menu (X / Esc / Menu button). Real game buttons, no brackets. */
export function PauseMenu({ onClose, onRoster, onShop, onSaveLoad, onQuitToTitle, onNavigate }: {
  onClose: () => void;
  onRoster: () => void;
  onShop: () => void;
  onSaveLoad: () => void;
  onQuitToTitle: () => void;
  onNavigate?: (view: string) => void;
}) {
  const gameState = useGameStore(s => s);
  const saveSlot = useGameStore(s => s.saveSlot);
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <UiPanel slot={UI_ART.pause_menu_panel} className="w-full max-w-sm p-6 flex flex-col gap-3">
        <h2 className="game-title text-2xl text-center mb-2">Paused</h2>
        <button onClick={onRoster} className="game-button px-4 py-3 font-bold">Team</button>
        <button onClick={onShop} className="game-button px-4 py-3 font-bold">Shop</button>
        {onNavigate && (<>
          <button onClick={() => onNavigate('PC')} className="game-button px-4 py-3 font-bold">PC Storage</button>
          <button onClick={() => onNavigate('GARDEN')} className="game-button px-4 py-3 font-bold">Mainframe Gardens</button>
          <button onClick={() => onNavigate('RING')} className="game-button px-4 py-3 font-bold">Ring Capture</button>
          <button onClick={() => onNavigate('ARENA')} className="game-button px-4 py-3 font-bold">Arena Mode</button>
          <button onClick={() => onNavigate('CREATURE')} className="game-button px-4 py-3 font-bold">Creature Mode</button>
          <button onClick={() => onNavigate('CHEATS')} className="game-button px-4 py-3 font-bold">Cheat Console</button>
        </>)}
        <button
          onClick={() => {
            saveGame(saveSlot, 'manual', `PAUSE SAVE - ${gameState.currentMap}`, gameState);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="game-button px-4 py-3 font-bold"
        >
          {saved ? 'Saved!' : 'Save Game'}
        </button>
        <button onClick={onSaveLoad} className="game-button px-4 py-3 font-bold">Load / Save Files</button>
        <button onClick={onQuitToTitle} className="game-button px-4 py-3 font-bold text-red-200">Quit to Title</button>
        <UiButton slot={UI_ART.game_button} onClick={onClose} className="px-4 py-3">Back to Game</UiButton>
      </UiPanel>
    </div>
  );
}

/** World HUD: location, party mini-bar, money, menu button — an overlay, not a box above the world. */
export function WorldHud({ mapName, timeLabel, onMenu, onRoster }: { mapName: string; timeLabel?: string; onMenu: () => void; onRoster: () => void }) {
  const wallet = useGameStore(s => s.wallet);
  const party = useGameStore(s => s.party);
  return (
    <div
      className="absolute top-0 left-0 right-0 z-40 flex items-start justify-between gap-2 p-3 pointer-events-none"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
    >
      <div className="game-panel px-3 py-2 pointer-events-auto">
        <div className="font-bold text-white text-sm leading-tight">{mapName}</div>
        {timeLabel && <div className="text-[11px] text-slate-300">{timeLabel}</div>}
        <div className="text-[11px] text-slate-300">{party.length === 0 ? 'No partner yet' : `${party.length} in team`}</div>
      </div>
      <div className="flex gap-2 pointer-events-auto items-start">
        <div className="game-panel px-3 py-2 hidden sm:flex items-center gap-2">
          {party.slice(0, 3).map(m => (
            <div key={m.id}><CreaturePortrait speciesId={m.speciesId} view="front" size={28} /></div>
          ))}
        </div>
        <div className="game-panel px-3 py-2 font-bold text-yellow-300 text-sm">{wallet} CR</div>
        <button onClick={onRoster} className="game-button px-3 py-2 text-sm">Team</button>
        <button onClick={onMenu} className="game-button px-3 py-2 text-sm">Menu</button>
      </div>
    </div>
  );
}
