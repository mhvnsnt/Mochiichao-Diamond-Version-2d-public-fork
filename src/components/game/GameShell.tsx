import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { saveGame } from '../../lib/saveSystem';
import CreaturePortrait from './CreaturePortrait';
import { UiPanel } from './UiArt';
import { UI_ART } from '../../lib/uiArt';
import { MenuList, MenuHelpLine } from './MenuList';

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
  const [selected, setSelected] = React.useState(0);

  // Framed window OVER the world (overlay dims the world, the window is
  // centred, the world stays visible around it — not a blank
  // full-screen panel). Vertical list, one item per row, ~15px row
  // spacing, distinct cursor/selected row, bottom help line for the
  // selected item. Same items and actions as before, no items added
  // or removed; help lines only describe the existing items.
  const items = [
    { label: 'Team', help: 'View and manage your team.', action: onRoster },
    { label: 'Shop', help: 'Buy and sell items at the shop.', action: onShop },
    ...(onNavigate ? [{ label: 'Bag', help: 'View your items, grouped by pocket.', action: () => onNavigate('BAG') }] : []),
    ...(onNavigate ? [
      { label: 'PC Storage', help: 'Move Mochiichao between your team and PC storage.', action: () => onNavigate('PC') },
      { label: 'Mainframe Gardens', help: 'Raise Mochiichao in the Mainframe Gardens.', action: () => onNavigate('GARDEN') },
      { label: 'Ring Capture', help: 'Try the Ring Capture loop.', action: () => onNavigate('RING') },
      { label: 'Arena Mode', help: 'Battle in Arena Mode doubles.', action: () => onNavigate('ARENA') },
      { label: 'Creature Mode', help: 'Play as a Mochiichao in real time.', action: () => onNavigate('CREATURE') },
      { label: 'Cheat Console', help: 'Enter native cheat codes and save states.', action: () => onNavigate('CHEATS') },
    ] : []),
    {
      label: saved ? 'Saved!' : 'Save Game',
      help: 'Save your current progress.',
      action: () => {
        saveGame(saveSlot, 'manual', `PAUSE SAVE - ${gameState.currentMap}`, gameState);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    },
    { label: 'Load / Save Files', help: 'Open your save files.', action: onSaveLoad },
    { label: 'Quit to Title', help: 'Return to the title screen.', action: onQuitToTitle },
    { label: 'Back to Game', help: 'Close the pause menu and keep playing.', action: onClose },
  ];
  const safeSelected = Math.min(selected, items.length - 1);

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <UiPanel slot={UI_ART.pause_menu_panel} className="w-full max-w-sm p-6 flex flex-col gap-3 max-h-[92dvh] overflow-y-auto">
        <h2 className="game-title text-2xl text-center mb-2">Paused</h2>
        <MenuList items={items} selected={safeSelected} onSelect={setSelected} />
        <MenuHelpLine text={items[safeSelected]?.help || ''} />
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
