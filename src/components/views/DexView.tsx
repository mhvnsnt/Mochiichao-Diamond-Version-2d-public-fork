import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { SPECIES_FOLDER } from '../../lib/creatureAnimation';
import { getSheetDef } from '../../lib/spriteSheets';
import { SPECIES_DB } from '../../lib/species';
import CreaturePortrait from '../game/CreaturePortrait';
import { MenuHelpLine } from '../game/MenuList';

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

// MOCHIODEX_MEDIA — speciesId -> { folder, footprint }.
// Footprint block (Black 2 entry-screen rule, caught only) + Play-cry
// button (Black 2 detail cry page, reduced). Footprint URLs are the
// PR #237 on-main paths, verified on main at PR time (all 51 PNGs
// flat in footprints-real/); cry URLs are PR #209 files on main,
// V1 default, HEAD-verified 49/49. Full voice page (stretch +
// waveform) and footprint glow animation are follow-ups, not faked.
const MOCHIODEX_MEDIA: Record<string, { folder: string; footprint: string }> = {
  '001': { folder: 'mochii', footprint: '/sprite-art/animation/expanded-scope/footprints-real/mochii_footprint.png' },
  '002': { folder: 'tiidebiite', footprint: '/sprite-art/animation/expanded-scope/footprints-real/tiidebiite_footprint.png' },
  '003': { folder: 'aquariios', footprint: '/sprite-art/animation/expanded-scope/footprints-real/aquariios_footprint.png' },
  '004': { folder: 'razorgater', footprint: '/sprite-art/animation/expanded-scope/footprints-real/razorgater_footprint.png' },
  '005': { folder: 'chromejaww', footprint: '/sprite-art/animation/expanded-scope/footprints-real/chromejaww_footprint.png' },
  '006': { folder: 'reaperdile', footprint: '/sprite-art/animation/expanded-scope/footprints-real/reaperdile_footprint.png' },
  '007': { folder: 'tyrage', footprint: '/sprite-art/animation/expanded-scope/footprints-real/tyrage_footprint.png' },
  '008': { folder: 'duneclaw', footprint: '/sprite-art/animation/expanded-scope/footprints-real/duneclaw_footprint.png' },
  '009': { folder: 'oblivirex', footprint: '/sprite-art/animation/expanded-scope/footprints-real/oblivirex_footprint.png' },
  '010': { folder: 'kittember', footprint: '/sprite-art/animation/expanded-scope/footprints-real/kittember_footprint.png' },
  '011': { folder: 'pyropaw', footprint: '/sprite-art/animation/expanded-scope/footprints-real/pyropaw_footprint.png' },
  '012': { folder: 'manticlaw', footprint: '/sprite-art/animation/expanded-scope/footprints-real/manticlaw_footprint.png' },
  '013': { folder: 'pupbble', footprint: '/sprite-art/animation/expanded-scope/footprints-real/pupbble_footprint.png' },
  '014': { folder: 'terradog', footprint: '/sprite-art/animation/expanded-scope/footprints-real/terradog_footprint.png' },
  '015': { folder: 'quakehound', footprint: '/sprite-art/animation/expanded-scope/footprints-real/quakehound_footprint.png' },
  '016': { folder: 'squirmite', footprint: '/sprite-art/animation/expanded-scope/footprints-real/squirmite_footprint.png' },
  '017': { folder: 'cocoonode', footprint: '/sprite-art/animation/expanded-scope/footprints-real/cocoonode_footprint.png' },
  '018': { folder: 'mothrix', footprint: '/sprite-art/animation/expanded-scope/footprints-real/mothrix_footprint.png' },
  '019': { folder: 'zephling', footprint: '/sprite-art/animation/expanded-scope/footprints-real/zephling_footprint.png' },
  '020': { folder: 'aerobeak', footprint: '/sprite-art/animation/expanded-scope/footprints-real/aerobeak_footprint.png' },
  '021': { folder: 'stormtalon', footprint: '/sprite-art/animation/expanded-scope/footprints-real/stormtalon_footprint.png' },
  '022': { folder: 'finblade', footprint: '/sprite-art/animation/expanded-scope/footprints-real/finblade_footprint.png' },
  '023': { folder: 'megalochrome', footprint: '/sprite-art/animation/expanded-scope/footprints-real/megalochrome_footprint.png' },
  '024': { folder: 'floatcalf', footprint: '/sprite-art/animation/expanded-scope/footprints-real/floatcalf_footprint.png' },
  '025': { folder: 'astroleviathan', footprint: '/sprite-art/animation/expanded-scope/footprints-real/astroleviathan_footprint.png' },
  '026': { folder: 'inklet', footprint: '/sprite-art/animation/expanded-scope/footprints-real/inklet_footprint.png' },
  '027': { folder: 'toxitacle', footprint: '/sprite-art/animation/expanded-scope/footprints-real/toxitacle_footprint.png' },
  '028': { folder: 'krakenox', footprint: '/sprite-art/animation/expanded-scope/footprints-real/krakenox_footprint.png' },
  '029': { folder: 'punchkid', footprint: '/sprite-art/animation/expanded-scope/footprints-real/punchkid_footprint.png' },
  '030': { folder: 'strikechamp', footprint: '/sprite-art/animation/expanded-scope/footprints-real/strikechamp_footprint.png' },
  '031': { folder: 'kickmaster', footprint: '/sprite-art/animation/expanded-scope/footprints-real/kickmaster_footprint.png' },
  '032': { folder: 'gearkid', footprint: '/sprite-art/animation/expanded-scope/footprints-real/gearkid_footprint.png' },
  '033': { folder: 'mechapion', footprint: '/sprite-art/animation/expanded-scope/footprints-real/mechapion_footprint.png' },
  '034': { folder: 'gorokappa', footprint: '/sprite-art/animation/expanded-scope/footprints-real/gorokappa_footprint.png' },
  '035': { folder: 'pebblefist', footprint: '/sprite-art/animation/expanded-scope/footprints-real/pebblefist_footprint.png' },
  '036': { folder: 'cragarm', footprint: '/sprite-art/animation/expanded-scope/footprints-real/cragarm_footprint.png' },
  '037': { folder: 'terrapod', footprint: '/sprite-art/animation/expanded-scope/footprints-real/terrapod_footprint.png' },
  '038': { folder: 'sproutle', footprint: '/sprite-art/animation/expanded-scope/footprints-real/sproutle_footprint.png' },
  '039': { folder: 'shellguard', footprint: '/sprite-art/animation/expanded-scope/footprints-real/shellguard_footprint.png' },
  '040': { folder: 'dreadtoise', footprint: '/sprite-art/animation/expanded-scope/footprints-real/dreadtoise_footprint.png' },
  '041': { folder: 'pixilite', footprint: '/sprite-art/animation/expanded-scope/footprints-real/pixilite_footprint.png' },
  '042': { folder: 'wispkin', footprint: '/sprite-art/animation/expanded-scope/footprints-real/wispkin_footprint.png' },
  '043': { folder: 'duskfiend', footprint: '/sprite-art/animation/expanded-scope/footprints-real/duskfiend_footprint.png' },
  '044': { folder: 'ashemit', footprint: '/sprite-art/animation/expanded-scope/footprints-real/ashemit_footprint.png' },
  '045': { folder: 'pyromonk', footprint: '/sprite-art/animation/expanded-scope/footprints-real/pyromonk_footprint.png' },
  '046': { folder: 'yogiferno', footprint: '/sprite-art/animation/expanded-scope/footprints-real/yogiferno_footprint.png' },
  '147': { folder: 'dorowani', footprint: '/sprite-art/animation/expanded-scope/footprints-real/dorowani_footprint.png' },
  '148': { folder: 'gabu', footprint: '/sprite-art/animation/expanded-scope/footprints-real/gabu_footprint.png' },
  '331': { folder: 'mythar', footprint: '/sprite-art/animation/expanded-scope/footprints-real/mythar_footprint.png' },
};

// CRY_URLS — V1 default per the title gate (PR #232); R1 lives in
// dexEntryMedia until Mars chooses. Fail closed: missing URL renders
// the muted note, never a broken player.
const CRY_URLS: Record<string, string> = {
  '001': '/audio/cries/mochii-cry.wav',
  '002': '/audio/cries/tiidebiite-cry.wav',
  '003': '/audio/cries/aquariios-cry.wav',
  '004': '/audio/cries/razorgater-cry.wav',
  '005': '/audio/cries/chromejaww-cry.wav',
  '006': '/audio/cries/reaperdile-cry.wav',
  '007': '/audio/cries/tyrage-cry.wav',
  '008': '/audio/cries/duneclaw-cry.wav',
  '009': '/audio/cries/oblivirex-cry.wav',
  '010': '/audio/cries/kittember-cry.wav',
  '011': '/audio/cries/pyropaw-cry.wav',
  '012': '/audio/cries/manticlaw-cry.wav',
  '013': '/audio/cries/pupbble-cry.wav',
  '014': '/audio/cries/terradog-cry.wav',
  '015': '/audio/cries/quakehound-cry.wav',
  '016': '/audio/cries/squirmite-cry.wav',
  '017': '/audio/cries/cocoonode-cry.wav',
  '018': '/audio/cries/mothrix-cry.wav',
  '019': '/audio/cries/zephling-cry.wav',
  '020': '/audio/cries/aerobeak-cry.wav',
  '021': '/audio/cries/stormtalon-cry.wav',
  '022': '/audio/cries/finblade-cry.wav',
  '023': '/audio/cries/megalochrome-cry.wav',
  '024': '/audio/cries/floatcalf-cry.wav',
  '025': '/audio/cries/astroleviathan-cry.wav',
  '026': '/audio/cries/inklet-cry.wav',
  '027': '/audio/cries/toxitacle-cry.wav',
  '028': '/audio/cries/krakenox-cry.wav',
  '029': '/audio/cries/punchkid-cry.wav',
  '030': '/audio/cries/strikechamp-cry.wav',
  '031': '/audio/cries/kickmaster-cry.wav',
  '032': '/audio/cries/gearkid-cry.wav',
  '033': '/audio/cries/mechapion-cry.wav',
  '034': '/audio/cries/gorokappa-cry.wav',
  '035': '/audio/cries/pebblefist-cry.wav',
  '036': '/audio/cries/cragarm-cry.wav',
  '037': '/audio/cries/terrapod-cry.wav',
  '038': '/audio/cries/sproutle-cry.wav',
  '039': '/audio/cries/shellguard-cry.wav',
  '040': '/audio/cries/dreadtoise-cry.wav',
  '041': '/audio/cries/pixilite-cry.wav',
  '042': '/audio/cries/wispkin-cry.wav',
  '043': '/audio/cries/duskfiend-cry.wav',
  '044': '/audio/cries/ashemit-cry.wav',
  '045': '/audio/cries/pyromonk-cry.wav',
  '046': '/audio/cries/yogiferno-cry.wav',
  '147': '/audio/cries/dorowani-cry.wav',
  '148': '/audio/cries/gabu-cry.wav',
  '331': '/audio/cries/mythar-cry.wav',
};

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
  // MOCHIODEX ADDITIONS — footprint (caught only, Black 2 rule) + cry.
  const selectedMedia =
    selected.kind === 'creature' ? MOCHIODEX_MEDIA[selected.speciesId] : undefined;
  const showFootprint =
    selected.kind === 'creature' && selectedStatus === 'caught' && !!selectedMedia;
  const cryUrl =
    selected.kind === 'creature' && selectedStatus !== 'undiscovered'
      ? CRY_URLS[selected.speciesId]
      : undefined;
  const playCry = () => {
    if (!cryUrl) return;
    try {
      const audio = new Audio(cryUrl);
      void audio.play().catch(() => undefined);
    } catch {
      // Audio unavailable: fail closed, no crash, no fake sound.
    }
  };
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
              {/* MOCHIODEX (a): FOOTPRINT — Black 2 entry-screen rule:
                  caught entries only. Seen-only and undiscovered
                  entries show no footprint block at all. */}
              {showFootprint && selectedMedia && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={selectedMedia.footprint}
                    alt={`${selectedName} footprint`}
                    width={64}
                    height={64}
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Footprint — shown for caught entries only,
                    as in the Black 2 Pokedex entry screen.
                  </div>
                </div>
              )}
              {/* MOCHIODEX (b): CRY — Black 2 detail cry page, reduced
                  to a button here; stretch + waveform is follow-up. */}
              {selected.kind === 'creature' && selectedStatus !== 'undiscovered' && (
                <div className="mt-4">
                  {cryUrl ? (
                    <button onClick={playCry} className="game-button px-4 py-2" aria-label={`Play ${selectedName} cry`}>
                      ▶ Play cry
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500">Cry audio resolves at PR time (PR #209 files on main).</div>
                  )}
                </div>
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

      <div className="shrink-0 mt-4">
        <MenuHelpLine text={helpText} />
      </div>
    </div>
  );
}
