/**
 * OPEN-SOURCE ASSET PICKER — creator component picker (Creator
 * Phase 2, asset-listing wiring).
 *
 * Reads the on-main listing in src/lib/openSourceAssets.ts
 * (Kenney 60/60 CC0-1.0, game-icons 25/25 CC BY 3.0, 0x72
 * DungeonTileset II 2/2 CC0 — 87/87) and NOTHING else: no
 * Pokemon sprites, dialogue, music, cries or art are in this
 * listing, ever. Every option shows its pack, licence and
 * attribution line where the listing carries one (game-icons
 * CC BY 3.0 names its author; CC0 packs need no attribution).
 *
 * Used by CREATE INTRO VIDEO and CREATE START SCREEN. A pick is
 * stored on the preset (IntroVideoScene.openSourceComponentIds /
 * StartScreenPreset.openSourceComponentIds), shown in the creator
 * preview, and drawn into the exported video where the kind fits
 * (panel behind the text block, particle/icon as particle
 * sprites — see src/lib/introVideoExport.ts). Picks are presets
 * only: the locked defaults never gain components and are never
 * overwritten.
 *
 * This is a picker section inside a full dedicated creator
 * screen, not a popup and not a second creator system: moving a
 * slot stays the Layout Editor's job, restyling a slot stays the
 * UI Creator's job.
 */

import React, { useMemo, useState } from 'react';
import {
  OPEN_SOURCE_ASSETS, OPEN_SOURCE_PACKS, openSourceAssetUrl,
  openSourceAttribution,
  type OpenSourceAsset, type OpenSourceAssetKind,
} from '../../lib/openSourceAssets';

const KIND_OPTIONS: ('all' | OpenSourceAssetKind)[] = [
  'all', 'panel', 'icon', 'particle', 'button', 'bar', 'cursor',
  'slider', 'dropdown', 'tileset', 'tiles-list',
];

export function OpenSourceAssetPicker({
  selectedIds, onToggle, title,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
  title?: string;
}) {
  const [kind, setKind] = useState<'all' | OpenSourceAssetKind>('all');
  const [pack, setPack] = useState<'all' | OpenSourceAsset['pack']>('all');

  const visible = useMemo(
    () => OPEN_SOURCE_ASSETS.filter(a =>
      (kind === 'all' || a.kind === kind) &&
      (pack === 'all' || a.pack === pack),
    ),
    [kind, pack],
  );
  const selected = OPEN_SOURCE_ASSETS.filter(a => selectedIds.includes(a.id));

  return (
    <div>
      <div className="text-white font-bold text-sm mb-1">
        {title || 'OPEN-SOURCE COMPONENTS'}
      </div>
      <div className="text-slate-300 text-xs mb-2">
        From the on-main listing: {OPEN_SOURCE_PACKS.map(p =>
          `${p.pack} ${p.count} (${p.licence}${p.attributionRequired ? ', attribution required' : ', no attribution required'})`,
        ).join(' · ')} — {OPEN_SOURCE_ASSETS.length} assets total.
        Picking a component stores it on this preset only; the locked default is never changed.
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <label className="text-xs text-slate-300">
          Kind&nbsp;
          <select value={kind} onChange={e => setKind(e.target.value as 'all' | OpenSourceAssetKind)}
            className="bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
            {KIND_OPTIONS.map(k => <option key={k} value={k}>{k === 'all' ? 'All kinds' : k}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-300">
          Pack&nbsp;
          <select value={pack} onChange={e => setPack(e.target.value as 'all' | OpenSourceAsset['pack'])}
            className="bg-black/40 border border-white/30 rounded px-2 py-2 text-white min-h-[44px]">
            <option value="all">All packs</option>
            {OPEN_SOURCE_PACKS.map(p => <option key={p.pack} value={p.pack}>{p.pack} ({p.count})</option>)}
          </select>
        </label>
        <span className="text-slate-400 text-xs self-center">
          Showing {visible.length} / {OPEN_SOURCE_ASSETS.length} · {selectedIds.length} picked
        </span>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(a => (
            <span key={a.id} className="px-2 py-1 rounded bg-yellow-300/20 border border-yellow-300 text-yellow-200 text-xs font-bold">
              ✓ {a.id} — {openSourceAttribution(a)}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {visible.map(a => {
          const url = openSourceAssetUrl(a);
          const isImage = /\.(png|svg)$/i.test(a.file);
          const picked = selectedIds.includes(a.id);
          return (
            <button key={a.id} onClick={() => onToggle(a.id)}
              className={`text-left rounded border p-2 min-h-[44px] ${picked ? 'bg-yellow-300/20 border-yellow-300' : 'bg-white/5 border-white/20'}`}>
              {isImage && url && (
                <img src={url} alt={a.id} className="h-8 w-auto max-w-full object-contain bg-black/30 rounded mb-1" />
              )}
              {!isImage && (
                <span className="block text-white/80 text-xs mb-1 break-all">{a.file}</span>
              )}
              <span className="block text-white text-xs font-bold break-all">
                {picked ? '✓ ' : ''}{a.id}
              </span>
              <span className="block text-slate-400 text-[11px]">{openSourceAttribution(a)}</span>
            </button>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="text-slate-400 text-xs">No assets match this kind + pack filter.</div>
      )}
    </div>
  );
}
