import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPECIES_DB } from '../../lib/species';
import { MOVES_DB } from '../../lib/moves';
import CreaturePortrait from '../game/CreaturePortrait';
import { MenuHelpLine } from '../game/MenuList';
import { TRUE_ELEMENTS, MAINFRAME_SECTORS, MainframeVariant, variantLabel, isTrueElement } from '../../lib/monster-tamer-systems';
import { useMenuSkin, menuSkinVars } from '../../lib/menuSkins';
import { coatVariantFor, coatLabel, coatLook, lustreDef, lustreFrontForSpecies } from '../../lib/variants';

/**
 * Roster, Pokemon-style placement: list on one side, detail panel on the
 * other (sheet image, name, level, HP, types/elements, moves). Not a text
 * list, and NO Grid Asset Forge panel — that placeholder generator is not
 * a player feature and is not wired here in any form. Portraits come from
 * Mochiichao sheets or the original silhouette fallback — never a Pokemon
 * sprite fetch, never an emoji.
 *
 * Placement reference: HeartGold / Black-White party screen structure
 * (list + detail), as read from the decomp menu/battle structure in the
 * reference JSONs — layout only; all art/text here is Mochiichao's own.
 */
// Preserved cursor (v2, party_menu structure only): the last selected
// slot is kept in module scope so it survives leaving this screen and
// returning. No new store field, no save field — it is a cursor, not
// game state.
let lastSelectedSlot = 0;

export default function RosterView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const [selected, setSelected] = useState(() => Math.min(lastSelectedSlot, Math.max(0, party.length - 1)));
  const [contextOpen, setContextOpen] = useState(false);
  const [contextMessage, setContextMessage] = useState<string | null>(null);
  const selectSlot = (i: number) => { lastSelectedSlot = i; setSelected(i); setContextOpen(false); };
  const current = party[Math.min(selected, Math.max(0, party.length - 1))];
  const species = current ? SPECIES_DB[current.speciesId] : undefined;
  const pct = current && current.maxHp ? Math.max(0, (current.hp / current.maxHp) * 100) : 0;
  // v5.3: a party member must never crash this panel. Caught wild
  // creatures used to arrive in flat wild-battle shape (atk/def/spd,
  // no stats.*, no pp), so current.stats.atk threw and the Team
  // panel went black in the v5.2 playtest when Sproutle was clicked.
  // New catches are rebuilt as MochiiInstances (see WorldEngine
  // catch), but members already in an older save may still be flat
  // — read stats/pp defensively here, never assuming the shape.
  const statVal = (m: any, key: string, flatKey?: string) => m?.stats?.[key] ?? (flatKey ? m?.[flatKey] : undefined) ?? '—';
  const ppVal = (m: any, j: number) => m?.pp?.[j] ?? '—';
  // Mainframe Variants (monster-tamer spec step 2): variant field keyed
  // by creature instance, NOT a new species ID. Same species, a sector
  // + a True Element tag. Display tag only — battle types and stats
  // are unchanged, because no True-Element-to-code-type mapping has
  // been approved. Capture stays Luigi Cubes + Ring Capture.
  const [variants, setVariants] = useState<Record<string, MainframeVariant>>({});
  const [variantSector, setVariantSector] = useState<string>(MAINFRAME_SECTORS[0]);
  const [variantElement, setVariantElement] = useState<string>(TRUE_ELEMENTS[0]);
  // Y2K skin wiring (skins PR #151 presets via menuSkins.ts): null =
  // default look, untouched. Selected list row wears .skin-selected
  // instead of the yellow ring while a skin is active.
  const skin = useMenuSkin('party');
  const currentVariant = current ? variants[current.id] : undefined;
  const lustreDisplay = useGameStore(s => s.shiny);

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]" data-menu-skin={skin?.id} style={menuSkinVars(skin)}>
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">Your Team</h2>
        <button onClick={onBack} className="game-button px-4 py-2">Close</button>
      </div>

      {/* Message line while choosing (v2): not just a header. */}
      <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">
        {contextMessage || 'Choose a Mochiichao.'}
      </div>

      {party.length === 0 ? (
        <div className="game-panel p-6 text-center text-slate-300">
          No partner yet. Visit Prof. Aeon's Lab in Sector 0 and choose your first Mochiichao.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
          {/* List side */}
          <div className="md:w-[38%] flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 pb-1">
            {party.map((mochii, i) => {
              const sp = SPECIES_DB[mochii.speciesId];
              const p = Math.max(0, (mochii.hp / mochii.maxHp) * 100);
              return (
                <button
                  key={mochii.id}
                  onClick={() => selectSlot(i)}
                  className={`game-panel p-3 flex items-center gap-3 text-left shrink-0 min-h-[48px] ${i === selected ? (skin ? 'skin-selected' : 'ring-2 ring-yellow-300') : 'opacity-80'}`}
                >
                  <CreaturePortrait speciesId={mochii.speciesId} view="front" size={56} />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{i === selected ? '► ' : ''}{mochii.nickname}</div>
                    <div className="text-xs text-slate-400">Lv. {mochii.level} · {sp?.name}{mochii.status ? ` · ${mochii.status}` : ''}</div>
                    <div className="h-2 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
                      <div className="h-full" style={{ width: `${p}%`, background: p > 50 ? '#4caf50' : p > 20 ? '#ff9800' : '#f44336' }} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 shrink-0">{Math.ceil(mochii.hp)}/{mochii.maxHp}</div>
                </button>
              );
            })}
          </div>

          {/* Detail side — v5.3: render for any current member,
              even if its species entry is missing; species fields
              fall back to the member's own data, never a crash. */}
          {current && (
            <div className="game-panel p-4 sm:p-5 flex-1 overflow-y-auto">
              <div className="flex gap-5 items-start flex-wrap">
                <CreaturePortrait speciesId={current.speciesId} view="front" size={128} />
                <div className="flex-1 min-w-[180px]">
                  <div className="font-black text-2xl text-white">
                    {current.nickname}
                    {current.status && <span className="ml-2 bg-purple-900 text-purple-200 text-xs px-2 py-0.5 rounded align-middle">{current.status}</span>}
                  </div>
                  <div className="text-slate-300 text-sm mt-1">Lv. {current.level} · {species?.name || current.speciesId}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(species?.types || []).map(t => (
                      <span key={t} className="text-xs bg-white/10 text-slate-100 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">{species?.description || ''}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>HP</span><span>{Math.ceil(current.hp)} / {current.maxHp}</span>
                </div>
                <div className="h-3 bg-black/70 rounded-full overflow-hidden mt-1 border border-white/20">
                  <div className="h-full transition-all" style={{ width: `${pct}%`, background: pct > 50 ? '#4caf50' : pct > 20 ? '#ff9800' : '#f44336' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">ATK</div><div className="text-white font-bold">{statVal(current, 'atk', 'atk')}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">DEF</div><div className="text-white font-bold">{statVal(current, 'def', 'def')}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPD</div><div className="text-white font-bold">{statVal(current, 'spe', 'spd')}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPA</div><div className="text-white font-bold">{statVal(current, 'spa')}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">SPD</div><div className="text-white font-bold">{statVal(current, 'spd')}</div></div>
                <div className="bg-black/40 rounded-lg p-2"><div className="text-slate-400 text-[11px]">EXP</div><div className="text-white font-bold">{current.experience ?? '—'}</div></div>
              </div>
              {/* Slot context menu (v2): a menu, NOT a new screen. Summary
                  shows this detail panel; Switch swaps this creature with
                  the party lead (existing party data only). Give Item /
                  Take Item are present but disabled: MochiiInstance has
                  no held-item field in this build, so no item can honestly
                  be given or taken yet — nothing is invented here. Release
                  is deliberately NOT added: it requires Mars's explicit
                  say-so, which has not been given. */}
              <div className="mt-5">
                <button
                  onClick={() => setContextOpen(o => !o)}
                  className="game-button px-3 py-2 text-sm min-h-[48px]"
                  aria-expanded={contextOpen}
                >
                  {contextOpen ? 'Close Actions' : 'Actions…'}
                </button>
                {contextOpen && (
                  <div className="game-panel p-3 mt-2 flex flex-wrap gap-2" role="menu">
                    <button className="game-button px-3 py-2 text-sm min-h-[48px]" onClick={() => { setContextOpen(false); setContextMessage(`Summary: ${current.nickname} — Lv. ${current.level} · ${species?.name || current.speciesId}.`); }}>Summary</button>
                    <button
                      className="game-button px-3 py-2 text-sm min-h-[48px]"
                      disabled={selected === 0}
                      onClick={() => {
                        useGameStore.setState(s => {
                          const next = [...s.party];
                          if (next.length > 1 && selected < next.length) {
                            const tmp = next[0]; next[0] = next[selected]; next[selected] = tmp;
                          }
                          return { party: next };
                        });
                        setContextOpen(false);
                        setContextMessage(`${current.nickname} moved to the front of the team.`);
                      }}
                    >
                      Switch
                    </button>
                    <button className="game-button px-3 py-2 text-sm min-h-[48px] opacity-60" disabled>Give Item</button>
                    <button className="game-button px-3 py-2 text-sm min-h-[48px] opacity-60" disabled>Take Item</button>
                    <button className="game-button px-3 py-2 text-sm min-h-[48px]" onClick={() => setContextOpen(false)}>Cancel</button>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">Held item: none.</p>
              </div>
              <h3 className="text-white font-bold mt-5 mb-2">Mainframe Variant</h3>
              <div className="text-sm text-slate-300">
                {currentVariant ? variantLabel(currentVariant) : 'No variant set — same species, no new ID.'}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <select value={variantSector} onChange={e => setVariantSector(e.target.value)} className="game-button px-2 py-1 text-sm">
                  {MAINFRAME_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={variantElement} onChange={e => setVariantElement(e.target.value)} className="game-button px-2 py-1 text-sm">
                  {TRUE_ELEMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button
                  onClick={() => { if (current && isTrueElement(variantElement)) setVariants(v => ({ ...v, [current.id]: { speciesId: current.speciesId, sector: variantSector, trueElement: variantElement } })); }}
                  className="game-button px-3 py-1 text-sm"
                >
                  Set Variant
                </button>
              </div>
              <h3 className="text-white font-bold mt-5 mb-2">Lustre</h3>
              <div className="text-sm text-slate-300">
                {(() => {
                  const coat = coatVariantFor(current.id);
                  const front = lustreFrontForSpecies(species?.name);
                  const def = lustreDef(coat);
                  const showFront = front && (coat !== 'standard' || lustreDisplay);
                  return (<>
                    <span>{coat !== 'standard' ? '✦ ' : ''}{coatLabel(coat)}{def ? ` — ${coatLook(coat)}` : ''}</span>
                    <span className="block text-xs text-slate-400 mt-1">Lustre is rare — 1 in 8,192. Each look, 1 in 81,920.</span>
                    {showFront && <img src={front!} alt={`${species?.name || 'Creature'} Lustre look`} width={128} height={128} style={{ width: 128, height: 128, imageRendering: 'pixelated', filter: def && def.hueRotateDeg ? `hue-rotate(${def.hueRotateDeg}deg)` : undefined }} className="mt-2" />}
                  </>);
                })()}
              </div>
              <h3 className="text-white font-bold mt-5 mb-2">Moves</h3>
              <div className="grid grid-cols-2 gap-2">
                {(current.moves || []).map((m, j) => (
                  <div key={j} className="bg-black/40 border border-white/10 p-2 rounded-lg text-xs">
                    <div className="text-white">{MOVES_DB[m]?.name || String(m).replace(/_/g, ' ')}</div>
                    <div className="text-slate-400">PP {ppVal(current, j)}/{MOVES_DB[m]?.pp ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {current && (
        <div className="shrink-0 mt-4">
          <MenuHelpLine text={`${current.nickname} — Lv. ${current.level} · ${species?.name || ''} · HP ${Math.ceil(current.hp)}/${current.maxHp}`} />
        </div>
      )}

    </div>
  );
}
