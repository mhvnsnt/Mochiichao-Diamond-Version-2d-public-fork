/**
 * Menu layout editors — one per menu type, in Settings.
 * Live, not a skeleton: every control here writes the same keys the
 * views read (menuLayoutLive.ts), so a pick changes the rendered
 * menu immediately (same page reload is not required; views listen
 * for the layout-change event). No existing settings row, value,
 * preset, or editor is edited by this component — it is an additive
 * section on the SETTINGS screen only.
 *
 * Editors: battle, pause, bag, pc, shop, save, settings = 7/7.
 * Live preview: dummy rows rendered in the chosen arrangement family
 * (grid vs list vs corner panel vs touch buttons), with the chosen
 * alignment / row spacing applied. Preview data is dummy by design —
 * it shows layout, not game data. Family-only entries keep the view's
 * current numeric spacing (see menuLayoutLive.ts header).
 */
import React, { useState } from 'react';
import {
  LIVE_MENU_TYPES,
  layoutOptionsFor,
  resolveMenuLayout,
  setLayoutFor,
  setOverridesFor,
  clearLayoutFor,
  clearCustomFor,
  setGlobalPreset,
  loadPreset,
  type LiveMenuType,
  type MenuLayoutOverrides,
  cssAlignment,
} from '../../lib/menuLayoutLive';

const LABELS: Record<LiveMenuType, string> = {
  battle: 'Battle menu',
  pause: 'Pause menu',
  bag: 'Bag menu',
  pc: 'PC menu',
  shop: 'Shop menu',
  save: 'Save menu',
  settings: 'Settings menu',
};

function Preview({ menu, entryId, arrangement, overrides }: {
  menu: LiveMenuType; entryId: string; arrangement: string; overrides: MenuLayoutOverrides;
}) {
  const rows = ['Row 1', 'Row 2', 'Row 3', 'Row 4'];
  const gap = overrides.rowSpacing ?? 8;
  const align = cssAlignment(overrides.alignment) ?? 'left';
  const isGrid = arrangement.includes('grid') || arrangement.includes('2x2') || arrangement.includes('corner');
  const isTouch = arrangement.includes('touch');
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: 8 }}>
      <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6 }}>
        Live preview (dummy data) — {entryId} · {arrangement}
        {overrides.helpBar === false ? ' · help bar off' : ''}
      </div>
      <div
        style={{
          display: isGrid ? 'grid' : 'flex',
          gridTemplateColumns: isGrid ? '1fr 1fr' : undefined,
          flexDirection: isGrid ? undefined : 'column',
          gap, textAlign: align,
        }}
      >
        {rows.map((r) => (
          <div
            key={r}
            style={{
              background: 'rgba(255,255,255,0.10)', borderRadius: 6, padding: isTouch ? '14px 10px' : '8px 10px',
              color: '#fff', fontSize: 13, fontWeight: 700,
              marginLeft: arrangement.includes('corner') ? 'auto' : undefined, maxWidth: arrangement.includes('corner') ? 180 : undefined, width: arrangement.includes('corner') ? '100%' : undefined,
            }}
          >
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ menu, refresh }: { menu: LiveMenuType; refresh: () => void }) {
  const resolved = resolveMenuLayout(menu);
  const options = layoutOptionsFor(menu);
  const set = (patch: MenuLayoutOverrides) => { setOverridesFor(menu, patch); refresh(); };
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontWeight: 800, color: '#fff' }}>{LABELS[menu]} — now: {resolved.entryId} ({resolved.source})</div>
      <label style={{ color: '#e2e8f0', fontSize: 13 }}>
        Layout{' '}
        <select
          value={resolved.entryId}
          onChange={(e) => { setLayoutFor(menu, e.target.value); refresh(); }}
          style={{ color: '#000', padding: '6px 8px', minHeight: 40 }}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.id} — {o.arrangement}</option>
          ))}
        </select>
      </label>
      <label style={{ color: '#e2e8f0', fontSize: 13 }}>
        Alignment{' '}
        <select
          value={resolved.overrides.alignment ?? ''}
          onChange={(e) => set({ alignment: (e.target.value || undefined) as MenuLayoutOverrides['alignment'] })}
          style={{ color: '#000', padding: '6px 8px', minHeight: 40 }}
        >
          <option value="">Catalogue default</option>
          <option value="left">Left</option>
          <option value="centre">Centre</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label style={{ color: '#e2e8f0', fontSize: 13 }}>
        Row spacing (px){' '}
        <input
          type="number" min={4} max={32}
          value={resolved.overrides.rowSpacing ?? ''}
          placeholder="Catalogue default"
          onChange={(e) => set({ rowSpacing: e.target.value ? Number(e.target.value) : undefined })}
          style={{ color: '#000', padding: '6px 8px', minHeight: 40, width: 120 }}
        />
      </label>
      <label style={{ color: '#e2e8f0', fontSize: 13 }}>
        <input
          type="checkbox"
          checked={resolved.overrides.helpBar ?? true}
          onChange={(e) => set({ helpBar: e.target.checked })}
        />{' '}
        Help bar
      </label>
      {(menu === 'pc' || menu === 'battle') && (
        <label style={{ color: '#e2e8f0', fontSize: 13 }}>
          Grid columns{' '}
          <input
            type="number" min={1} max={6}
            value={resolved.overrides.gridColumns ?? ''}
            placeholder="Catalogue default"
            onChange={(e) => set({ gridColumns: e.target.value ? Number(e.target.value) : undefined })}
            style={{ color: '#000', padding: '6px 8px', minHeight: 40, width: 120 }}
          />
        </label>
      )}
      {menu === 'bag' && (
        <>
          <label style={{ color: '#e2e8f0', fontSize: 13 }}>
            Pocket tabs{' '}
            <select
              value={resolved.overrides.tabPosition ?? 'top'}
              onChange={(e) => set({ tabPosition: e.target.value as 'top' | 'side' })}
              style={{ color: '#000', padding: '6px 8px', minHeight: 40 }}
            >
              <option value="top">Top (grouped sections)</option>
              <option value="side">Side (one pocket at a time)</option>
            </select>
          </label>
          <label style={{ color: '#e2e8f0', fontSize: 13 }}>
            <input
              type="checkbox"
              checked={resolved.overrides.perPocketCursor ?? (resolved.gen >= 3)}
              onChange={(e) => set({ perPocketCursor: e.target.checked })}
            />{' '}
            Per-pocket cursor (default on for gen3+; turning it on for gen1/gen2 is a new cursor model, flagged)
          </label>
        </>
      )}
      {menu === 'pc' && (
        <>
          <label style={{ color: '#e2e8f0', fontSize: 13 }}>
            <input type="checkbox" checked={resolved.overrides.boxHeader ?? true} onChange={(e) => set({ boxHeader: e.target.checked })} />{' '}
            Box-name header
          </label>
          <label style={{ color: '#e2e8f0', fontSize: 13 }}>
            <input type="checkbox" checked={resolved.overrides.wallpaperRow ?? true} onChange={(e) => set({ wallpaperRow: e.target.checked })} />{' '}
            Wallpaper row
          </label>
        </>
      )}
      {menu === 'shop' && (
        <div style={{ color: '#94a3b8', fontSize: 12 }}>
          Quantity selector is stored but NOT live: it is new UI, not a layout swap, and is not wired in this PR.
        </div>
      )}
      <Preview menu={menu} entryId={resolved.entryId} arrangement={resolved.arrangement} overrides={resolved.overrides} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => { clearLayoutFor(menu); refresh(); }} style={{ padding: '8px 12px', minHeight: 40, fontWeight: 700 }}>
          Reset to gen5 default
        </button>
        <button onClick={() => { clearCustomFor(menu); refresh(); }} style={{ padding: '8px 12px', minHeight: 40 }}>
          Delete custom overrides
        </button>
      </div>
    </div>
  );
}

export default function MenuLayoutLiveEditors() {
  const [, setVersion] = useState(0);
  const refresh: () => void = () => { setVersion((v) => v + 1); };
  const preset = loadPreset();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontWeight: 900, color: '#fff', fontSize: 16 }}>Menu Layouts — swappable by generation</div>
      <div style={{ color: '#cbd5e1', fontSize: 13 }}>
        Default is gen5 (Black 2, most recent gen) for every menu. A per-menu pick beats the global preset;
        a global preset beats the default. Changing one menu never changes another. Title is not here:
        the locked title default is never touched by this editor.
      </div>
      <label style={{ color: '#e2e8f0', fontSize: 13 }}>
        Global preset (all menus without their own pick){' '}
        <select
          value={preset ?? ''}
          onChange={(e) => { setGlobalPreset(e.target.value ? Number(e.target.value) : null); refresh(); }}
          style={{ color: '#000', padding: '6px 8px', minHeight: 40 }}
        >
          <option value="">gen5 default</option>
          {[1, 2, 3, 4, 5].map((g) => (
            <option key={g} value={g}>gen{g} for all</option>
          ))}
        </select>
      </label>
      {LIVE_MENU_TYPES.map((m) => (
        <div key={m}><Editor menu={m} refresh={refresh} /></div>
      ))}
    </div>
  );
}
