import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPECIES_FOLDER } from '../../lib/creatureAnimation';
import { getSheetDef } from '../../lib/spriteSheets';
import { SPECIES_DB } from '../../lib/species';
import CreaturePortrait from '../game/CreaturePortrait';
import { MenuHelpLine } from '../game/MenuList';
import { getActiveMenuConfig } from '../../lib/menuEditor';
import { playTitleCry } from '../../lib/titleCryGate';

/** Shared dex row button (all looks): portrait + # + name/??? + status. */
function DexRowButton({ row, isSelected, onSelect, statusOf, creatureName, portrait, accent }: {
  row: DexRow; isSelected: boolean; onSelect: () => void;
  statusOf: (id: string) => 'caught' | 'seen' | 'undiscovered';
  creatureName: (id: string) => string; portrait: number; accent: string;
}) {
  if (row.kind === 'slot') {
    return (
      <button
        key={`slot-${row.num}`}
        onClick={onSelect}
        aria-label={`#${pad(row.num)} undiscovered slot`}
        className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2' : 'opacity-80'}`}
        style={isSelected ? { boxShadow: `0 0 0 2px ${accent}` } : undefined}
      >
        <div className="flex items-center justify-center shrink-0 text-slate-500 font-black" style={{ width: portrait, height: portrait }} aria-hidden="true">?</div>
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
      onClick={onSelect}
      aria-label={discovered ? `#${pad(row.num)} ${creatureName(row.speciesId)}` : `#${pad(row.num)} undiscovered`}
      className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2' : 'opacity-80'}`}
      style={isSelected ? { boxShadow: `0 0 0 2px ${accent}` } : undefined}
    >
      <CreaturePortrait
        speciesId={row.speciesId}
        view="front"
        size={portrait}
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
}

/**
 * Gated detail fields, Gen 1/Gen 2 rule: number + name + category +
 * height + weight + description are shown only when the creature is
 * owned/caught. Seen-but-not-owned shows the hidden markers
 * (category '?????', height/weight '???', description blank) and
 * undiscovered shows nothing but the number + ???. There is NO
 * height/weight/category data in species.ts today, so an owned
 * creature honestly shows '???' for those fields until roster data
 * lands — never an invented number. Gen 1/Gen 2 detail has NO type
 * field (type lives in battle/status, not the dex detail), so types
 * are deliberately omitted here even though the current look shows
 * type pills.
 */
function GatedDetail({ kind, speciesId, status, name, num, species, detailPortrait, children }: {
  kind: 'creature' | 'slot'; speciesId: string; status: 'caught' | 'seen' | 'undiscovered';
  name: string; num: number; species: { description?: string } | undefined;
  detailPortrait: number; children?: React.ReactNode;
}) {
  const owned = status === 'caught';
  return (
    <div className="flex gap-5 items-start flex-wrap">
      {kind === 'slot' ? (
        <div className="flex items-center justify-center shrink-0 text-slate-500 font-black text-6xl" style={{ width: detailPortrait, height: detailPortrait }} aria-label="Undiscovered slot">?</div>
      ) : (
        <CreaturePortrait
          speciesId={speciesId}
          view="front"
          size={detailPortrait}
          name={status !== 'undiscovered' ? undefined : '???'}
          undiscovered={status === 'undiscovered'}
        />
      )}
      <div className="flex-1 min-w-[180px]">
        <div className="font-black text-2xl text-white">#{pad(num)} {name}</div>
        <div className="text-slate-300 text-sm mt-1">
          {kind === 'slot' ? 'Undiscovered slot' : status === 'caught' ? 'Caught' : status === 'seen' ? 'Seen' : 'Undiscovered'}
        </div>
        {kind === 'creature' && (
          <div className="text-sm text-slate-300 mt-3 space-y-1">
            <div>Category: {owned ? '???' : '?????'}</div>
            {owned && (
              <>
                <div>HT: ??? &nbsp; WT: ???</div>
                {species?.description && <p className="text-slate-400 leading-relaxed pt-2">{species.description}</p>}
              </>
            )}
            {!owned && status === 'seen' && (
              <p className="text-slate-400 leading-relaxed pt-2">Seen but not owned — height, weight and description stay hidden until owned, as in Gen 1/Gen 2.</p>
            )}
          </div>
        )}
        {kind === 'slot' && (
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">Unfilled slot — no creature is recorded here yet.</p>
        )}
        {children}
      </div>
    </div>
  );
}

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
  // Mochioteka editor wiring (2026-10-26): list width, portrait
  // sizes, help line and accent come from the ACTIVE menu config
  // — working preset when saved, else the shipped DexView values
  // exactly. Roster/discovery logic, species data and the close
  // flow are untouched; generation looks land here only when
  // their layout is verified from that generation's files.
  const dexCfg = getActiveMenuConfig().mochioteka;

  // Gen 1 / Gen 2 look state (module-level looks below read these).
  // Gen 2 OPTION cycles OLD (number order) / ABC (name order) — the
  // two Gen 2 option-screen modes that exist in the web game (NEW /
  // discovery order has no discovery-order data here, so it is not
  // offered). Gen 2 SEARCH filters by number or discovered name.
  const [gen2Sort, setGen2Sort] = useState<'old' | 'abc'>('old');
  const [gen2Search, setGen2Search] = useState('');
  const [gen2Page, setGen2Page] = useState(1);
  const [gen1Side, setGen1Side] = useState<'DATA' | 'AREA'>('DATA');
  const [cryMsg, setCryMsg] = useState('');
  const ownCount = ROWS.filter((r) => r.kind === 'creature' && statusOf(r.speciesId) === 'caught').length;
  const playSelectedCry = async () => {
    if (selected.kind !== 'creature' || selectedStatus === 'undiscovered') { setCryMsg('No cry for an undiscovered entry.'); return; }
    const ok = await playTitleCry(creatureName(selected.speciesId));
    setCryMsg(ok ? 'Playing cry…' : 'No cry file for this creature yet.');
  };
  const gen2Rows = (() => {
    const q = gen2Search.trim().toLowerCase();
    let rows = ROWS.filter((r) => {
      if (!q) return true;
      if (r.kind === 'slot') return pad(r.num).includes(q);
      const st = statusOf(r.speciesId);
      if (st === 'undiscovered') return pad(r.num).includes(q);
      return pad(r.num).includes(q) || creatureName(r.speciesId).toLowerCase().includes(q);
    });
    if (gen2Sort === 'abc') {
      const creatures = rows.filter((r) => r.kind === 'creature');
      const slots = rows.filter((r) => r.kind === 'slot');
      const byName = (r: DexRow) => (r.kind === 'creature' && statusOf(r.speciesId) !== 'undiscovered' ? creatureName(r.speciesId) : '');
      creatures.sort((a, b) => {
        const na = byName(a); const nb = byName(b);
        if (!na && !nb) return a.num - b.num;
        if (!na) return 1; if (!nb) return -1;
        return na.localeCompare(nb);
      });
      rows = [...creatures, ...slots];
    }
    return rows;
  })();

  const dexShell = (lookLabel: string, middle: React.ReactNode) => (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Mochiichao Dex</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>
      <div className="text-slate-400 text-xs mb-2">{lookLabel}</div>
      <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">
        Discovered {discoveredCount} / {ROSTER_COUNT} · Unfilled slots {SLOT_COUNT} (#047–#146)
      </div>
      {middle}
      {cryMsg && <div className="text-teal-300 text-sm font-bold py-2">{cryMsg}</div>}
      {dexCfg.helpOn && (
        <div className="shrink-0 mt-4">
          <MenuHelpLine text={helpText} />
        </div>
      )}
    </div>
  );

  // Gen 1 look (Red/Yellow, engine/menus/pokedex.asm): one column,
  // 7 rows visible, SEEN/OWN counts on the side, full-screen
  // bordered detail frame, side menu DATA / CRY / AREA / QUIT.
  if (dexCfg.look === 'gen1') {
    const gated = (
      <GatedDetail
        kind={selected.kind} speciesId={selected.kind === 'creature' ? selected.speciesId : ''}
        status={selectedStatus} name={selectedName} num={selected.num}
        species={selectedSpecies} detailPortrait={dexCfg.detailPortrait}
      />
    );
    return dexShell('Look: Gen 1 (Red/Yellow) — engine/menus/pokedex.asm, ShowPokedexMenu / ShowPokedexData', (
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        <div className="flex gap-4 text-white shrink-0">
          <div className="game-panel px-4 py-2">SEEN {discoveredCount}</div>
          <div className="game-panel px-4 py-2">OWN {ownCount}</div>
        </div>
        <div className="flex gap-2 overflow-y-auto shrink-0" style={{ maxHeight: 552 }}>
          <div className="flex flex-col gap-2 flex-1">
            {ROWS.map((row) => (
              <React.Fragment key={row.kind === 'creature' ? row.speciesId : `slot-${row.num}`}><DexRowButton row={row} isSelected={row.num === selectedNum} onSelect={() => { setSelectedNum(row.num); setGen1Side('DATA'); }} statusOf={statusOf} creatureName={creatureName} portrait={dexCfg.portrait} accent={dexCfg.accent} /></React.Fragment>
            ))}
          </div>
        </div>
        <div className="border-2 border-white/40 p-4 flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            {gen1Side === 'DATA' ? gated : (
              <div className="text-slate-300 text-sm">
                <div className="font-black text-2xl text-white">#{pad(selected.num)} {selectedName}</div>
                <p className="text-slate-400 leading-relaxed mt-3">Area: where this creature is found is not in the Mochiichao roster data yet — no area data is invented here.</p>
                <button onClick={() => setGen1Side('DATA')} className="game-button px-4 py-2 mt-4">BACK TO DATA</button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button onClick={() => setGen1Side('DATA')} className="game-button px-4 py-2">DATA</button>
            <button onClick={playSelectedCry} className="game-button px-4 py-2">CRY</button>
            <button onClick={() => setGen1Side('AREA')} className="game-button px-4 py-2">AREA</button>
            <button onClick={onBack} className="game-button px-4 py-2">QUIT</button>
          </div>
        </div>
      </div>
    ));
  }

  // Gen 2 look (Gold/Crystal, engine/pokedex/pokedex.asm): left
  // sidebar boxes (SEEN/OWN, SELECT > OPTION, START > SEARCH),
  // one-column list, detail with bottom action bar PAGE / AREA /
  // CRY. PRNT is omitted on purpose: it printed to Game Boy
  // Printer hardware, which has no web equivalent.
  if (dexCfg.look === 'gen2') {
    return dexShell('Look: Gen 2 (Gold/Crystal) — engine/pokedex/pokedex.asm, InitMainScreen / InitDexEntryScreen. PRNT omitted: Game Boy Printer hardware, no web equivalent.', (
      <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-56 shrink-0 flex flex-col gap-2">
            <div className="game-panel p-3 text-white">
              <div>SEEN {discoveredCount}</div>
              <div>OWN {ownCount}</div>
            </div>
            <button onClick={() => setGen2Sort((s) => (s === 'old' ? 'abc' : 'old'))} className="game-panel p-3 text-left text-white">
              SELECT &gt; OPTION<br /><span className="text-yellow-300 font-bold">Order: {gen2Sort === 'old' ? 'OLD (number)' : 'ABC (name)'}</span>
            </button>
            <div className="game-panel p-3 text-white">
              START &gt; SEARCH<br />
              <input
                value={gen2Search}
                onChange={(e) => setGen2Search(e.target.value)}
                placeholder="Number or name…"
                className="w-full bg-black/40 border border-white/30 rounded px-2 py-1 text-white mt-2 min-h-[40px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {gen2Rows.map((row) => (
              <React.Fragment key={row.kind === 'creature' ? row.speciesId : `slot-${row.num}`}><DexRowButton row={row} isSelected={row.num === selectedNum} onSelect={() => { setSelectedNum(row.num); setGen2Page(1); }} statusOf={statusOf} creatureName={creatureName} portrait={dexCfg.portrait} accent={dexCfg.accent} /></React.Fragment>
            ))}
            {gen2Rows.length === 0 && <div className="text-slate-400 text-sm">No entries match that search.</div>}
          </div>
        </div>
        <div className="game-panel p-4">
          <GatedDetail
            kind={selected.kind} speciesId={selected.kind === 'creature' ? selected.speciesId : ''}
            status={selectedStatus} name={selectedName} num={selected.num}
            species={gen2Page === 1 ? selectedSpecies : undefined} detailPortrait={dexCfg.detailPortrait}
          />
          {gen2Page === 2 && selected.kind === 'creature' && selectedStatus !== 'undiscovered' && (
            <div className="text-sm text-slate-300 mt-3">
              <div>Status: {selectedStatus === 'caught' ? 'Caught' : 'Seen'}</div>
              <div>Types: {selectedSpecies?.types?.length ? selectedSpecies.types.join(' / ') : 'Not in species.ts yet'}</div>
              <div>Footprint: not wired in DexView yet (footprints are a separate PR #243 follow-up, not invented here).</div>
            </div>
          )}
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={() => setGen2Page((p) => (p === 1 ? 2 : 1))} className="game-button px-4 py-2">PAGE ({gen2Page}/2)</button>
            <button onClick={() => setCryMsg('Area: where this creature is found is not in the Mochiichao roster data yet — no area data is invented here.')} className="game-button px-4 py-2">AREA</button>
            <button onClick={playSelectedCry} className="game-button px-4 py-2">CRY</button>
          </div>
        </div>
      </div>
    ));
  }
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
        <div className="md:w-[var(--dex-list-pct)] flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 pb-1" style={{ "--dex-list-pct": `${dexCfg.listPct}%` } as React.CSSProperties}>
          {ROWS.map((row) => {
            const isSelected = row.num === selectedNum;
            if (row.kind === 'slot') {
              return (
                <button
                  key={`slot-${row.num}`}
                  onClick={() => setSelectedNum(row.num)}
                  aria-label={`#${pad(row.num)} undiscovered slot`}
                  className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2' : 'opacity-80'}`}
                  style={isSelected ? { boxShadow: `0 0 0 2px ${dexCfg.accent}` } : undefined}
                >
                  <div className="flex items-center justify-center shrink-0 text-slate-500 font-black" style={{ width: dexCfg.portrait, height: dexCfg.portrait }} aria-hidden="true">?</div>
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
                className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${isSelected ? 'ring-2' : 'opacity-80'}`}
                style={isSelected ? { boxShadow: `0 0 0 2px ${dexCfg.accent}` } : undefined}
              >
                <CreaturePortrait
                  speciesId={row.speciesId}
                  view="front"
                  size={dexCfg.portrait}
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
              <div className="flex items-center justify-center shrink-0 text-slate-500 font-black text-6xl" style={{ width: dexCfg.detailPortrait, height: dexCfg.detailPortrait }} aria-label="Undiscovered slot">?</div>
            ) : (
              <CreaturePortrait
                speciesId={selected.speciesId}
                view="front"
                size={dexCfg.detailPortrait}
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

      {dexCfg.helpOn && (
        <div className="shrink-0 mt-4">
          <MenuHelpLine text={helpText} />
        </div>
      )}
    </div>
  );
}
