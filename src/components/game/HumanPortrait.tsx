import React from 'react';
import type { HumanSlot, HumanView } from '../../lib/humanSheets';

/**
 * One human portrait through the human loader. Sheet cell when a sheet
 * exists; otherwise a marked human silhouette placeholder (head + body
 * + legs, slot colour, labelled "Art in progress"). Never an emoji,
 * never a creature sheet, never a blue silhouette blob.
 *
 * v4 fix (live playtest: GIRL showed as a squashed strip, not a
 * portrait): the old code set backgroundSize to
 * size*sheetCols wide but only size tall — for a 4x4 grid atlas that
 * squashes the whole 256x256 image into a 288x72 strip. A grid sheet
 * must be scaled square: size*sheetCols wide AND size*sheetRows tall,
 * with a row offset for cells below row 0. Row-0 views (front/back/
 * left/right) still use y=0; the optional `cell` prop selects any
 * grid cell (col, row) — e.g. the Player A portrait cell (1, 3) —
 * for dialogue portraits. Left is mirrored ONLY when the slot's left
 * and right frames are the same cell (old strips); slots with
 * distinct left/right cells (Player A) are NOT mirrored.
 */
export default function HumanPortrait({ slot, view = 'front', size = 96, showName = false, mirror = false, cell }: {
  slot: HumanSlot;
  view?: HumanView;
  size?: number;
  showName?: boolean;
  mirror?: boolean;
  /** Grid cell (col, row) in 64x64 cells — overrides view when set. */
  cell?: { col: number; row: number };
}) {
  const cols = slot.sheetCols ?? 3;
  const rows = slot.sheetRows ?? 1;
  const col = cell ? cell.col : (slot.frames[view] / 64);
  const row = cell ? cell.row : 0;
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      {slot.sheetUrl ? (
        <div
          style={{
            width: size, height: size,
            backgroundImage: `url(${slot.sheetUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${size * cols}px ${size * rows}px`,
            backgroundPosition: `-${col * size}px -${row * size}px`,
            imageRendering: 'pixelated',
            transform: (mirror || (view === 'left' && slot.frames.left === slot.frames.right && !cell)) ? 'scaleX(-1)' : undefined,
          }}
          aria-label={slot.label}
        />
      ) : (
        <div className="relative flex flex-col items-center justify-end" style={{ width: size, height: size }} aria-label={`${slot.label} (art not made yet)`}>
          <div className="rounded-full border-2 border-black/30" style={{ width: size * 0.34, height: size * 0.34, background: '#e8b890' }} />
          <div className="rounded-t-full" style={{ width: size * 0.56, height: size * 0.42, background: slot.color, marginTop: -size * 0.02 }} />
          <div className="flex gap-1" style={{ marginTop: -size * 0.02 }}>
            <div style={{ width: size * 0.2, height: size * 0.18, background: '#2a2a3a' }} />
            <div style={{ width: size * 0.2, height: size * 0.18, background: '#2a2a3a' }} />
          </div>
        </div>
      )}
      {showName && <div className="text-center font-bold text-white leading-tight" style={{ fontSize: Math.max(11, size * 0.16) }}>{slot.label}</div>}
    </div>
  );
}
