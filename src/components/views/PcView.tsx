import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import CreaturePortrait from '../game/CreaturePortrait';
import { SPECIES_DB } from '../../lib/species';
import { DATA_CARD_ID } from '../../lib/monster-tamer-systems';
import { MenuHelpLine } from '../game/MenuList';
import { useMenuSkin, menuSkinVars } from '../../lib/menuSkins';
import { STORAGE_RULES } from '../../lib/playableWiring';
import { WALLPAPER_PRESETS, resolveWallpaper, PC_WALLPAPER_UPLOAD_SPEC } from '../../lib/wallpaperCatalogue';
import { SLOTS_PER_BOX, uncappedBoxCount } from '../../lib/uncappedStorage';
import { useMenuLayout } from '../../lib/menuLayoutLive';

/**
 * PC storage, v2 structure (pokemon_storage_system_menu.c, structure/
 * rules only): boxes, NOT one long list — box select, then a grid of
 * slots in that box, Deposit / Withdraw with confirm, cursor preserved
 * per box. Release IS offered (box creatures only, via the confirm
 * dialog) per the 2026-10-27 fill-from-source rule; the egg block
 * is NOT yet enforceable (no egg flag on the instance type).
 *
 * Boxes are computed from the stored list in chunks of 30 (Box 1
 * always exists, more appear as creatures are stored). Party and PC
 * data themselves are the existing store lists — no new storage
 * system, no new save field.
 */
// Uncapped storage (Mars 2026-10-27): 30 slots per box, box count
// unbounded. STORAGE_RULES.slotsPerBox is 30 on main, but this
// module is the cap decision: MAX_BOX_COUNT / MAX_PC_TOTAL are null.
const BOX_SIZE = SLOTS_PER_BOX;

// Preserved cursor per box (module scope, like Roster's preserved
// cursor): a cursor, not game state, so it is not a store/save field.
const boxCursor: Record<number, number> = {};

export default function PcView({ onBack }: { onBack: () => void }) {
  const party = useGameStore(s => s.party);
  const pc = useGameStore(s => s.pc);
  const inventory = useGameStore(s => s.inventory);
  const useItem = useGameStore(s => s.useItem);
  const [cardStored, setCardStored] = useState<Record<string, boolean>>({});
  const [box, setBox] = useState(0);
  const [selected, setSelected] = useState(() => boxCursor[0] || 0);
  const [confirm, setConfirm] = useState<{ kind: 'deposit' | 'withdraw' | 'release'; id: string; name: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // SKELETON wallpaper state (per box). Assignment key + upload
  // key are the staged spec keys; see wallpaperCatalogue.ts.
  const [wallpapers, setWallpapers] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem('mochiichao_pc_wallpapers_v1') || '{}'); } catch { return {}; }
  });
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  // NOTE (skeleton correctness): resolvedWallpaper is NOT computed here.
  // `safeBox` is declared later in PcView (after boxCount), so reading
  // it in this state block would hit the temporal dead zone. The row
  // below calls resolveWallpaper(wallpapers[safeBox], safeBox) inline,
  // where safeBox already exists. setBoxWallpaper only reads safeBox
  // when invoked (after render), which is safe.
  const setBoxWallpaper = (id: string) => {
    const next = { ...wallpapers, [safeBox]: id };
    setWallpapers(next);
    try { localStorage.setItem('mochiichao_pc_wallpapers_v1', JSON.stringify(next)); } catch { /* session-only; assignment kept in state */ }
  };
  const handleWallpaperUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadNotice('That file is not an image — nothing was stored.'); return; }
    if (file.size > PC_WALLPAPER_UPLOAD_SPEC.maxBytes) { setUploadNotice('That image is over 5 MB — nothing was stored.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) { setUploadNotice('That image could not be read — nothing was stored.'); return; }
        const uploadId = `upload:${Date.now()}`;
        const record = { name: file.name, mime: file.type, dataUrl, width: img.naturalWidth, height: img.naturalHeight, createdAt: Date.now() };
        try {
          const existing = JSON.parse(localStorage.getItem(PC_WALLPAPER_UPLOAD_SPEC.storageKey) || '{}');
          existing[uploadId] = record;
          localStorage.setItem(PC_WALLPAPER_UPLOAD_SPEC.storageKey, JSON.stringify(existing));
          setBoxWallpaper(uploadId);
          setUploadNotice(null);
        } catch {
          // Quota fallback (spec): session-memory only, with a visible warning.
          setUploadNotice('Storage is full, so this upload lasts for this session only and will not survive a reload.');
          setBoxWallpaper(uploadId);
        }
      };
      img.onerror = () => setUploadNotice('That image could not be read — nothing was stored.');
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };
  // Y2K skin wiring (skins PR #151 presets via menuSkins.ts): null =
  // default look, untouched. When set, data-menu-skin + variables on
  // the root restyle .game-panel frames/text via menuSkins.css; the
  // selected slot wears .skin-selected instead of the yellow ring.
  const skin = useMenuSkin('pc');
  // Menu-layout live wiring: gen1/gen2 PC is a list, gen3+ is a box
  // grid (gen3/gen4 fix 5x6 by source; gen5 leaves columns to the
  // renderer, so the editor's grid-columns override applies there
  // and in list mode it is ignored). Box-name header and wallpaper
  // row are editor toggles. Box contents, actions and uncapped
  // storage are unchanged.
  const pcMenuLayout = useMenuLayout('pc');
  const pcListMode = pcMenuLayout.entryId === 'gen1.pc' || pcMenuLayout.entryId === 'gen2.pc';

  const boxCount = uncappedBoxCount(pc.length);
  const safeBox = Math.min(box, boxCount - 1);
  const boxCreatures = pc.slice(safeBox * BOX_SIZE, safeBox * BOX_SIZE + BOX_SIZE);
  const selectedCreature = boxCreatures[Math.min(selected, Math.max(0, boxCreatures.length - 1))];

  const selectBox = (b: number) => { setBox(b); setSelected(boxCursor[b] || 0); };
  const selectSlot = (i: number) => { boxCursor[safeBox] = i; setSelected(i); };

  const moveToParty = (id: string) => {
    if (party.length >= STORAGE_RULES.partyMax) return;
    const m = pc.find(x => x.id === id);
    if (!m) return;
    useGameStore.setState(s => ({ pc: s.pc.filter(x => x.id !== id), party: [...s.party, m] }));
  };
  const moveToPc = (id: string) => {
    const m = party.find(x => x.id === id);
    if (!m) return;
    // FLAGGED NEW BEHAVIOUR (F14 deposit guard): refuse a deposit that
    // would empty the party. On main today this deposit is allowed.
    if (STORAGE_RULES.depositBlockedWhenItWouldEmptyParty && party.length <= 1) return;
    useGameStore.setState(s => ({ party: s.party.filter(x => x.id !== id), pc: [...s.pc, m] }));
  };

  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'withdraw') { moveToParty(confirm.id); setMessage(`${confirm.name} withdrawn to your team.`); }
    else if (confirm.kind === 'release') { useGameStore.setState(s => ({ pc: s.pc.filter(x => x.id !== confirm.id) })); setMessage(`${confirm.name} was released.`); }
    else { moveToPc(confirm.id); setMessage(`${confirm.name} deposited to PC storage.`); }
    setConfirm(null);
  };

  return (
    <div className="game-screen flex flex-col p-4 sm:p-6 overflow-hidden bg-[#0b1526]" data-menu-skin={skin?.id} data-menu-layout={pcMenuLayout.entryId} style={menuSkinVars(skin)}>
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="game-title text-2xl">PC Storage</h2>
        <button onClick={onBack} className="game-button px-4 py-2 min-h-[48px]">Close</button>
      </div>
      {message && <div className="game-panel px-4 py-2 mb-4 text-white shrink-0" role="status">{message}</div>}
      <div className="text-sm text-slate-300 mb-3 shrink-0">Data Cards in bag: {inventory[DATA_CARD_ID] || 0} — buy them in the Shop, then store a PC creature&apos;s data on one. It stays swappable at the PC. Release is offered for a selected box creature (confirm dialog; egg block not yet enforceable — no egg flag).</div>

      <div className="flex gap-2 mb-4 shrink-0 flex-wrap">
        {Array.from({ length: boxCount }, (_, b) => (
          <button
            key={b}
            onClick={() => selectBox(b)}
            className={`game-button px-3 py-2 text-sm min-h-[48px] ${b === safeBox ? 'ring-2 ring-yellow-300' : 'opacity-80'}`}
          >
            Box {b + 1}
          </button>
        ))}
      </div>
      {/* SKELETON wallpaper row: preset select (ids only, no artwork shipped) + phone file upload. */}
      {pcMenuLayout.overrides.wallpaperRow !== false && (<div className="game-panel p-3 mb-4 shrink-0 flex flex-wrap items-center gap-2" data-wallpaper={resolveWallpaper(wallpapers[safeBox], safeBox).id}>
        <span className="text-sm text-white font-bold">Box {safeBox + 1} wallpaper:</span>
        <select
          aria-label="Box wallpaper preset"
          value={resolveWallpaper(wallpapers[safeBox], safeBox).kind === 'upload' ? '' : resolveWallpaper(wallpapers[safeBox], safeBox).id}
          onChange={(e) => { if (e.target.value) setBoxWallpaper(e.target.value); }}
          className="game-button px-2 py-2 text-xs min-h-[48px]"
        >
          <option value="">Custom upload</option>
          {WALLPAPER_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.id}{p.theme ? ` — ${p.theme}` : ''}</option>
          ))}
        </select>
        <label className="game-button px-3 py-2 text-xs min-h-[48px] cursor-pointer">
          Upload your own art
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleWallpaperUpload(e.target.files?.[0])} />
        </label>
        {uploadNotice && <span className="text-sm text-amber-300" role="status">{uploadNotice}</span>}
        {resolveWallpaper(wallpapers[safeBox], safeBox).kind === 'upload' && <span className="text-sm text-slate-300">Custom upload for this box.</span>}
      </div>)}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden min-h-0">
      {/* Uncapped storage note: boxes are unlimited — a new box appears whenever the current boxes fill. No 24-box / 720-total cap. */}
      <div className="text-sm text-slate-300 shrink-0 col-span-full">Storage is unlimited: {boxCount} {boxCount === 1 ? 'box' : 'boxes'} so far, more appear as needed.</div>
        <div className="overflow-y-auto pr-1">
          {pcMenuLayout.overrides.boxHeader !== false && (<h3 className="text-white font-bold mb-2">Box {safeBox + 1} ({boxCreatures.length} / {BOX_SIZE})</h3>)}
          {boxCreatures.length === 0 ? (
            <div className="text-slate-400 text-sm">This box is empty. Extra catches go here automatically.</div>
          ) : (
            <div className={pcListMode || pcMenuLayout.overrides.gridColumns ? 'grid gap-2' : 'grid grid-cols-3 sm:grid-cols-5 gap-2'} style={pcListMode ? { gridTemplateColumns: 'minmax(0, 1fr)' } : pcMenuLayout.overrides.gridColumns ? { gridTemplateColumns: `repeat(${pcMenuLayout.overrides.gridColumns}, minmax(0, 1fr))` } : undefined}>
              {boxCreatures.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => selectSlot(i)}
                  onMouseEnter={() => selectSlot(i)}
                  onFocus={() => selectSlot(i)}
                  className={`game-panel p-2 flex flex-col items-center gap-1 min-h-[48px] ${i === selected ? (skin ? 'skin-selected' : 'ring-2 ring-yellow-300') : 'opacity-80'}`}
                >
                  <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
                  <span className="text-xs text-white truncate w-full text-center">{i === selected ? '► ' : ''}{m.nickname}</span>
                  <span className="text-[11px] text-slate-400">Lv. {m.level}</span>
                </button>
              ))}
            </div>
          )}
          {selectedCreature && (
            <div className="game-panel p-4 mt-4">
              <div className="font-bold text-white">{selectedCreature.nickname} — Lv. {selectedCreature.level} · {SPECIES_DB[selectedCreature.speciesId]?.name}</div>
              <div className="text-sm text-slate-400 mt-1">HP {Math.ceil(selectedCreature.hp)} / {selectedCreature.maxHp}</div>
              {cardStored[selectedCreature.id] && <div className="text-xs text-teal-300 mt-1">Stored on Data Card — swappable at the PC</div>}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  disabled={party.length >= STORAGE_RULES.partyMax}
                  onClick={() => setConfirm({ kind: 'withdraw', id: selectedCreature.id, name: selectedCreature.nickname })}
                  className="game-button px-3 py-2 text-xs min-h-[48px]"
                >
                  Withdraw to Team
                </button>
                <button
                  onClick={() => setConfirm({ kind: 'release', id: selectedCreature.id, name: selectedCreature.nickname })}
                  className="game-button px-3 py-2 text-xs min-h-[48px]"
                >
                  Release
                </button>
                <button
                  disabled={!cardStored[selectedCreature.id] && (inventory[DATA_CARD_ID] || 0) <= 0}
                  onClick={() => { if (!cardStored[selectedCreature.id] && useItem(DATA_CARD_ID)) setCardStored(s => ({ ...s, [selectedCreature.id]: true })); }}
                  className="game-button px-3 py-2 text-xs min-h-[48px]"
                >
                  {cardStored[selectedCreature.id] ? 'On Card' : 'Store on Data Card'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-y-auto pr-1">
          <h3 className="text-white font-bold mb-2">Party ({party.length}/{STORAGE_RULES.partyMax})</h3>
          {party.map(m => (
            <div key={m.id} className="game-panel p-3 mb-2 flex items-center gap-3">
              <CreaturePortrait speciesId={m.speciesId} view="front" size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">{m.nickname}</div>
                <div className="text-xs text-slate-400">Lv. {m.level} · {SPECIES_DB[m.speciesId]?.name}</div>
              </div>
              <button disabled={STORAGE_RULES.depositBlockedWhenItWouldEmptyParty && party.length <= 1} onClick={() => setConfirm({ kind: 'deposit', id: m.id, name: m.nickname })} className="game-button px-2 py-2 text-xs min-h-[48px]">Deposit</button>
            </div>
          ))}
          {party.length === 0 && <div className="text-slate-400 text-sm">Party is empty.</div>}
        </div>
      </div>

      <div className="shrink-0 mt-3">
        <MenuHelpLine text={selectedCreature ? `${selectedCreature.nickname} — Box ${safeBox + 1}, slot ${selected + 1}. Withdraw moves it to your team; Deposit moves a team member here.` : 'Select a box, then a slot.'} />
      </div>

      {confirm && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="game-panel p-6 w-full max-w-sm">
            <div className="text-white font-bold text-lg mb-2">
              {confirm.kind === 'withdraw' ? `Withdraw ${confirm.name} to your team?` : confirm.kind === 'release' ? `Release ${confirm.name}?` : `Deposit ${confirm.name} to PC storage?`}
            </div>
            <p className="text-sm text-slate-400 mb-4">Nothing moves until you confirm.</p>
            <div className="flex gap-2">
              <button onClick={doConfirm} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">Yes</button>
              <button onClick={() => setConfirm(null)} className="game-button px-4 py-2 font-bold min-h-[48px] flex-1">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
