import React, { useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { createMochii } from '../../lib/engine';
import { SPECIES_DB } from '../../lib/species';
import CreaturePortrait from '../game/CreaturePortrait';
import { ringCaptureChance } from '../../lib/mochiichao-systems';

/**
 * Ring Capture — Ranger-style loop, separate from Luigi Cubes.
 * Hold the ring button to draw loops around the target; release too
 * early and the ring breaks. Loops add score, breaks subtract, bond
 * helps (mochiichao-systems.ringCaptureChance). No cube is consumed.
 * Target pool is the battle-ready species list; catch adds via the
 * normal store rule (party, else PC). Full Ranger movement/circling
 * on the world map is the next pass — this is the loop structure,
 * playable now, marked as such.
 */
const TARGETS = Object.keys(SPECIES_DB);

export default function RingCaptureView({ onBack }: { onBack: () => void }) {
  const addMochii = useGameStore(s => s.addMochii);
  const [targetIdx, setTargetIdx] = useState(0);
  const [loops, setLoops] = useState(0);
  const [breaks, setBreaks] = useState(0);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [message, setMessage] = useState('Hold the ring to draw loops. Fill it before it breaks!');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const targetId = TARGETS[targetIdx % TARGETS.length];
  const target = createMochii(targetId, 5);

  const startHold = () => {
    if (holding) return;
    setHolding(true);
    timer.current = setInterval(() => {
      setProgress(p => {
        const next = p + 4;
        if (next >= 100) {
          if (timer.current) clearInterval(timer.current);
          setHolding(false);
          setLoops(l => l + 1);
          const chance = ringCaptureChance(loops + 1, breaks, 0, SPECIES_DB[targetId].catchRate);
          if (Math.random() < chance + 0.35) {
            if (target) addMochii(target);
            setMessage(`Ring complete! ${SPECIES_DB[targetId].name} was caught by Ring Capture (no cube used).`);
            setTargetIdx(i => i + 1);
          } else {
            setMessage('Ring complete, but the target slipped the loop. Try again — loops add up.');
          }
          return 0;
        }
        return next;
      });
    }, 60);
  };
  const endHold = (completed: boolean) => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setHolding(false);
    if (!completed && progress > 0 && progress < 100) {
      setBreaks(b => b + 1);
      setProgress(0);
      setMessage('Ring broke! A break subtracts from your capture score.');
    }
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 items-center bg-[#0b1526] overflow-y-auto">
      <div className="w-full max-w-lg flex justify-between items-center mb-4">
        <h2 className="game-title text-2xl">Ring Capture</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>
      <div className="game-panel p-6 w-full max-w-lg text-center">
        <div className="flex justify-center mb-2">
          <CreaturePortrait speciesId={targetId} view="front" size={128} showName />
        </div>
        <div className="text-slate-300 text-sm">Target: {SPECIES_DB[targetId].name} · Lv. 5 · Loops: {loops} · Breaks: {breaks}</div>
        <div className="h-4 bg-black/70 rounded-full overflow-hidden mt-4 border border-white/20">
          <div className="h-full bg-teal-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <button
          onPointerDown={startHold}
          onPointerUp={() => endHold(false)}
          onPointerLeave={() => endHold(false)}
          onPointerCancel={() => endHold(false)}
          className="game-button w-full mt-5 py-4 font-black tracking-widest text-lg"
          style={{ touchAction: 'none' }}
        >
          {holding ? 'DRAWING RING…' : 'HOLD TO DRAW RING'}
        </button>
        <div className="mt-4 text-sm text-slate-200 min-h-[3rem]">{message}</div>
        <div className="text-xs text-slate-400 mt-2">Hold to fill the ring.</div>
      </div>
    </div>
  );
}
