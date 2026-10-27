import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';

// Views — full-screen game screens, no terminal frame, no fixed box.
import WorldEngine from './world/WorldEngine';
import BattleView from './components/views/BattleView';
import RosterView from './components/views/RosterView';
import ShopView from './components/views/ShopView';
import PcView from './components/views/PcView';
import BagView from './components/views/BagView';
import GardenView from './components/views/GardenView';
import RingCaptureView from './components/views/RingCaptureView';
import ArenaBattleView from './components/views/ArenaBattleView';
import CreatureModeView from './components/views/CreatureModeView';
import DexView from './components/views/DexView';
import CheatConsoleView from './components/views/CheatConsoleView';
import IntroSequence from './components/IntroSequence';
import { playMusic } from './lib/music';
import MochiiMindUI from './components/MochiiMindUI';

export type ViewState = 'STARTER_SELECT' | 'WORLD' | 'BATTLE' | 'ROSTER' | 'SHOP' | 'BAG' | 'PC' | 'GARDEN' | 'RING' | 'ARENA' | 'CREATURE' | 'CHEATS' | 'DEX';

export default function App() {
  const introCompleted = useGameStore(s => s.introCompleted);
  const completeIntro = useGameStore(s => s.completeIntro);
  const [view, setView] = useState<ViewState>('WORLD');
  const [battleEnemyId, setBattleEnemyId] = useState<string | null>(null);
  const [isMindOpen, setIsMindOpen] = useState(false);

  if (!introCompleted) {
    return (
      <IntroSequence
        onComplete={() => { playMusic('world', 0); completeIntro(); setView('WORLD'); }}
        onEnterWorld={() => { playMusic('world', 0); completeIntro(); setView('WORLD'); }}
      />
    );
  }

  return (
    <div className="game-screen">
      {view === 'WORLD' && <WorldEngine setView={setView} setBattleEnemy={setBattleEnemyId} />}
      {view === 'BATTLE' && <BattleView enemyId={battleEnemyId} onLeave={() => setView('WORLD')} />}
      {view === 'ROSTER' && <RosterView onBack={() => setView('WORLD')} />}
      {view === 'SHOP' && <ShopView onBack={() => setView('WORLD')} />}
      {view === 'BAG' && <BagView onBack={() => setView('WORLD')} />}
      {view === 'PC' && <PcView onBack={() => setView('WORLD')} />}
      {view === 'GARDEN' && <GardenView onBack={() => setView('WORLD')} />}
      {view === 'RING' && <RingCaptureView onBack={() => setView('WORLD')} />}
      {view === 'ARENA' && <ArenaBattleView onBack={() => setView('WORLD')} />}
      {view === 'CREATURE' && <CreatureModeView onBack={() => setView('WORLD')} />}
      {view === 'CHEATS' && <CheatConsoleView onBack={() => setView('WORLD')} />}
      {view === 'DEX' && <DexView onBack={() => setView('WORLD')} />}

      {/* MochiiMind toggle — v4: moved below the HUD (top 4.5rem) so it
          no longer overlaps the WorldEngine A/B cluster at bottom-right,
          which was partially clipped in the live playtest. */}
      <button
        onClick={() => setIsMindOpen(!isMindOpen)}
        className="game-button fixed right-4 z-[100] px-3 py-2 text-sm font-bold"
        style={{ top: '4.5rem' }}
        title="Open MochiiMind"
      >
        MochiiMind
      </button>
      <div className="z-[101]">
        <MochiiMindUI isOpen={isMindOpen} onClose={() => setIsMindOpen(false)} />
      </div>
    </div>
  );
}
