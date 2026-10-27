import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { saveGame } from '../../lib/saveSystem';
import CreaturePortrait from './CreaturePortrait';
import { UiPanel } from './UiArt';
import { UI_ART } from '../../lib/uiArt';
import { MenuList, MenuHelpLine } from './MenuList';
import { getActiveMenuConfig } from '../../lib/menuEditor';

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
  // Batch 3 skin ONLY: .pause-y2k-panel (index.css) gives this panel the
  // Y2K skin — glossy gradient, white border, glow, star/heart accents.
  // Order, inputs, and behaviour are unchanged; the sparkles below are
  // decorative (aria-hidden, non-interactive).
  // Menu Editor wiring (2026-10-26): the pause rows below read
  // the ACTIVE menu config — working preset when saved, else the
  // shipped rows exactly. The pause menu keeps its overlay form
  // (Pokemon start-menu pattern: a window over the field, not a
  // full screen); the editor edits title, width, gap, sparkles,
  // labels, help lines, visibility and order only. Actions and
  // save behaviour are unchanged. Rows that need onNavigate
  // (Bag .. Cheat Console) still appear only when onNavigate
  // is provided, exactly as before.
  const pauseCfg = getActiveMenuConfig().pause;
  const base: Record<string, { label: string; help: string; action: () => void }> = {
    team: { label: 'Team', help: 'View and manage your team.', action: onRoster },
    shop: { label: 'Shop', help: 'Buy and sell items at the shop.', action: onShop },
    bag: { label: 'Bag', help: 'View your items, grouped by pocket.', action: () => onNavigate?.('BAG') },
    pc: { label: 'PC Storage', help: 'Move Mochiichao between your team and PC storage.', action: () => onNavigate?.('PC') },
    dex: { label: 'Dex', help: 'Browse the Mochiichao Dex — discovered creatures and undiscovered slots.', action: () => onNavigate?.('DEX') },
    garden: { label: 'Mainframe Gardens', help: 'Raise Mochiichao in the Mainframe Gardens.', action: () => onNavigate?.('GARDEN') },
    ring: { label: 'Ring Capture', help: 'Try the Ring Capture loop.', action: () => onNavigate?.('RING') },
    arena: { label: 'Arena Mode', help: 'Battle in Arena Mode doubles.', action: () => onNavigate?.('ARENA') },
    creature: { label: 'Creature Mode', help: 'Play as a Mochiichao in real time.', action: () => onNavigate?.('CREATURE') },
    cheats: { label: 'Cheat Console', help: 'Enter native cheat codes and save states.', action: () => onNavigate?.('CHEATS') },
    save: {
      label: saved ? 'Saved!' : 'Save Game',
      help: 'Save your current progress.',
      action: () => {
        // Explicit manual save releases a START OVER autosave hold.
        gameState.setAutosaveHeldForSlot(null);
        saveGame(saveSlot, 'manual', `PAUSE SAVE - ${gameState.currentMap}`, gameState);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    },
    loadsave: { label: 'Load / Save Files', help: 'Open your save files.', action: onSaveLoad },
    quit: { label: 'Quit to Title', help: 'Return to the title screen.', action: onQuitToTitle },
    back: { label: 'Back to Game', help: 'Close the pause menu and keep playing.', action: onClose },
  };
  const navKeys = new Set(['bag', 'pc', 'dex', 'garden', 'ring', 'arena', 'creature', 'cheats']);
  const items = pauseCfg.order
    .filter((k) => base[k] && pauseCfg.visible[k] !== false && (onNavigate || !navKeys.has(k)))
    .map((k) => ({
      label: k === 'save' && saved ? 'Saved!' : (pauseCfg.labels[k] ?? base[k].label),
      help: pauseCfg.help[k] ?? base[k].help,
      action: base[k].action,
    }));
  const safeSelected = Math.min(selected, items.length - 1);

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <UiPanel slot={UI_ART.pause_menu_panel} className="pause-y2k-panel relative w-full max-w-sm p-6 flex flex-col gap-3 max-h-[92dvh] overflow-y-auto" style={{ maxWidth: pauseCfg.panelMaxW, gap: pauseCfg.gap }}>
        {pauseCfg.sparkles && (<>
          <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 left-3 text-pink-300 text-lg">✦</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute top-2 right-3 text-yellow-300 text-lg">♥</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 left-3 text-cyan-200 text-base">★</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute bottom-2 right-3 text-pink-300 text-base">✦</span>
        </>)}
        <h2 className="game-title text-2xl text-center mb-2">{pauseCfg.title}</h2>
        <MenuList items={items} selected={safeSelected} onSelect={setSelected} />
        <MenuHelpLine text={items[safeSelected]?.help || ''} />
      </UiPanel>
    </div>
  );
}

/** World HUD: location, party mini-bar, money, menu button — an overlay, not a box above the world. */
export function WorldHud({ mapName, timeLabel, goalLabel, onMenu, onRoster }: { mapName: string; timeLabel?: string; goalLabel?: string; onMenu: () => void; onRoster: () => void }) {
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
        {goalLabel && <div className="text-[11px] text-yellow-300 font-bold">{goalLabel}</div>}
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
