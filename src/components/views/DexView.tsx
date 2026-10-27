import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPECIES_FOLDER } from '../../lib/creatureAnimation';
import { getSheetDef } from '../../lib/spriteSheets';
import { SPECIES_DB } from '../../lib/species';
import CreaturePortrait from '../game/CreaturePortrait';
import { MenuHelpLine } from '../game/MenuList';
import Black2SystemsPanel from '../game/Black2SystemsPanel';

/**
 * Mochiichao Dex (2026-10-26, FINISH-FIRST item 5) — the first dex
 * surface. Before this, the registry + CreaturePortrait undiscovered
 * prop existed (PR #183) but no screen passed undiscovered, and the
 * WorldEngine menu tab only listed already-known GAME_DATA entries
 * (unknown entries were hidden, not shown as silhouettes).
 *
 * What drives this view — nothing hand-typed, nothing invented:
 * - Roster: SPECIES_FOLDER keys from src/lib/creatureAnimation.ts
 *   (49 species: #001-#046, #147, #148, #331). Names come from the
 *   sheet def (getSheetDef) so #331 Mythar is named even though it
 *   is not in species.ts; species.ts supplies types/description
 *   only where an entry actually exists (12 species) and is never
 *   filled in for the rest.
 * - Discovered = the store dex says 'seen'/'caught' for that
 *   speciesId, OR the creature is in party/PC. The second rule
 *   matters because WorldEngine's wild-battle code writes the
 *   creature instance id (not the speciesId) into the store dex,
 *   so a speciesId-only lookup would miss catches; party/PC
 *   membership is the ground truth for 'caught'. A store-dex key
 *   that is an instance id cannot be resolved back to a species
 *   here and is NOT guessed at — it simply does not light up an
 *   entry on its own.
 * - Undiscovered roster entries render CreaturePortrait with
 *   undiscovered=true, i.e. the PR #175 discovery silhouette for
 *   that creature — never the real art, never a name (the label
 *   passed in is literally "???"). The dex number is shown: it is
 *   the slot, not creature data.
 * - Unfilled slots #047-#146: 100 slots with no species, no name,
 *   no art and no silhouette — a plain "?" tile. They are
 *   discoverable, playable-first placeholders (per the task), NOT
 *   invented creatures. Slots #149-#330 are not listed: no roster
 *   species occupies them and the task reserves only #047-#146.
 * - Silhouette count note: the registry has 51 silhouette files
 *   for 49 species because Strikechamp has 2 extra variant files;
 *   variants are not separate dex entries, so the dex lists 49
 *   roster entries, not 51.
 *
 * Performance: list tiles use the static sheet cell
 * (animateIdle=false); only the selected detail portrait cycles
 * its idle frames, so the 149-row list does not run 49 idle
 * timers at once.
 *
 * Not touched here: shiny/LUSTRE, footprints, walk-gate,
 * IRON_BARRAGE, battle/title flows. This view only reads the
 * store; it never writes dex state.
 */
type DexRow =
  | { kind: 'creature'; speciesId: string; num: number }
  | { kind: 'slot'; num: number };

const UNFILLED_FIRST = 47;
const UNFILLED_LAST = 146;

function dexRows(): DexRow[] {
  const ids = Object.keys(SPECIES_FOLDER).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const low = ids.filter((id) => parseInt(id, 10) < UNFILLED_FIRST);
  const high = ids.filter((id) => parseInt(id, 10) >= UNFILLED_FIRST);
  const rows: DexRow[] = low.map((speciesId) => ({ kind: 'creature', speciesId, num: parseInt(speciesId, 10) }));
  for (let n = UNFILLED_FIRST; n <= UNFILLED_LAST; n++) rows.push({ kind: 'slot', num: n });
  for (const speciesId of high) rows.push({ kind: 'creature', speciesId, num: parseInt(speciesId, 10) });
  return rows;
}

const ROWS = dexRows();
const ROSTER_COUNT = ROWS.filter((r) => r.kind === 'creature').length;
const SLOT_COUNT = ROWS.filter((r) => r.kind === 'slot').length;

function pad(num: number): string {
  return String(num).padStart(3, '0');
}

function creatureName(speciesId: string): string {
  return getSheetDef(speciesId)?.name || '???';
}

export default function DexView({ onBack }: { onBack: () => void }) {
  const dex = useGameStore((s) => s.dex);
  const party = useGameStore((s) => s.party);
  const pc = useGameStore((s) => s.pc);
  const [selectedNum, setSelectedNum] = useState(1);

  const owned = new Set(
    [...party, ...pc].map((m) => m.speciesId).filter((id): id is string => !!id),
  );
  const statusOf = (speciesId: string): 'caught' | 'seen' | 'undiscovered' => {
    if (owned.has(speciesId) || dex[speciesId] === 'caught') return 'caught';
    if (dex[speciesId] === 'seen') return 'seen';
    return 'undiscovered';
  };
  const discoveredCount = ROWS.filter(
    (r) => r.kind === 'creature' && statusOf(r.speciesId) !== 'undiscovered',
  ).length;

  const selected = ROWS.find((r) => r.num === selectedNum) || ROWS[0];
  const selectedStatus =
    selected.kind === 'creature' ? statusOf(selected.speciesId) : 'undiscovered';
  const selectedName =
    selected.kind === 'creature' && selectedStatus !== 'undiscovered'
      ? creatureName(selected.speciesId)
      : '???';
  const selectedSpecies =
    selected.kind === 'creature' ? SPECIES_DB[selected.speciesId] : undefined;
  const helpText =
    selected.kind === 'slot'
      ? `#${pad(selected.num)} ??? — Undiscovered slot. No creature is recorded here yet.`
      : selectedStatus === 'undiscovered'
        ? `#${pad(selected.num)} ??? — Undiscovered. Meet or catch this Mochiichao to reveal it.`
        : `#${pad(selected.num)} ${selectedName} — ${selectedStatus === 'caught' ? 'Caught' : 'Seen'}.`;

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Mochiichao Dex</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>

      <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">
        Discovered {discoveredCount} / {ROSTER_COUNT} · Unfilled slots {SLOT_COUNT} (#047–#146)
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
        {/* List side — every roster entry plus every unfilled slot, in number order. */}
        <div className="md:w-[38%] flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 pb-1">
          {ROWS.map((row) => {
            const isSelected = row.num === selectedNum;
            if (row.kind === 'slot') {
              return (
                <button
                  key={`slot-${row.num}`}
                  onClick={() => setSelectedNum(row.num)}
                  aria-label={`#${pad(row.num)} undiscovered slot`}
                  className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
                >
                  <div className="flex items-center justify-center shrink-0 text-slate-500 font-black" style={{ width: 48, height: 48 }} aria-hidden="true">?</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{isSelected ? '► ' : ''}#{pad(row.num)} ???</div>
                    <div className="text-xs text-slate-400">Undiscovered</div>
                  </div>
                </button>
              );
            }
            const status = statusOf(row.speciesId);
            const discovered = status !== 'undiscovered';
            return (
              <button
                key={row.speciesId}
                onClick={() => setSelectedNum(row.num)}
                aria-label={discovered ? `#${pad(row.num)} ${creatureName(row.speciesId)}` : `#${pad(row.num)} undiscovered`}
                className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
              >
                <CreaturePortrait
                  speciesId={row.speciesId}
                  view="front"
                  size={48}
                  name={discovered ? undefined : '???'}
                  animateIdle={false}
                  undiscovered={!discovered}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white truncate">{isSelected ? '► ' : ''}#{pad(row.num)} {discovered ? creatureName(row.speciesId) : '???'}</div>
                  <div className="text-xs text-slate-400">{discovered ? (status === 'caught' ? 'Caught' : 'Seen') : 'Undiscovered'}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail side — selected entry: idle portrait when discovered, silhouette when not. */}
        <div className="game-panel p-4 sm:p-5 flex-1 overflow-y-auto">
          <div className="flex gap-5 items-start flex-wrap">
            {selected.kind === 'slot' ? (
              <div className="flex items-center justify-center shrink-0 text-slate-500 font-black text-6xl" style={{ width: 128, height: 128 }} aria-label="Undiscovered slot">?</div>
            ) : (
              <CreaturePortrait
                speciesId={selected.speciesId}
                view="front"
                size={128}
                name={selectedStatus !== 'undiscovered' ? undefined : '???'}
                undiscovered={selectedStatus === 'undiscovered'}
              />
            )}
            <div className="flex-1 min-w-[180px]">
              <div className="font-black text-2xl text-white">#{pad(selected.num)} {selectedName}</div>
              <div className="text-slate-300 text-sm mt-1">
                {selected.kind === 'slot'
                  ? 'Undiscovered slot'
                  : selectedStatus === 'caught'
                    ? 'Caught'
                    : selectedStatus === 'seen'
                      ? 'Seen'
                      : 'Undiscovered'}
              </div>
              {selected.kind === 'creature' && selectedStatus !== 'undiscovered' && selectedSpecies && (
                <>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(selectedSpecies.types || []).map((t) => (
                      <span key={t} className="text-xs bg-white/10 text-slate-100 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  {selectedSpecies.description && (
                    <p className="text-sm text-slate-400 mt-3 leading-relaxed">{selectedSpecies.description}</p>
                  )}
                </>
              )}
              {selected.kind === 'creature' && selectedStatus === 'undiscovered' && (
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">Meet or catch this Mochiichao to reveal it.</p>
              )}
              {selected.kind === 'slot' && (
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">Unfilled slot — no creature is recorded here yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Black 2 reference systems panel — display only, not playable content. */}
      <Black2SystemsPanel />

      <div className="shrink-0 mt-4">
        <MenuHelpLine text={helpText} />
      </div>
    </div>
  );
}
