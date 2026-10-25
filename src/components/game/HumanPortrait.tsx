import React from 'react';
import type { HumanSlot, HumanView } from '../../lib/humanSheets';

/**
 * One human portrait through the human loader. Sheet cell when a sheet
 * exists; otherwise a marked human silhouette placeholder (head + body
 * + legs, slot colour, labelled "Art in progress"). Never an emoji,
 * never a creature sheet, never a blue silhouette blob.
 * Row-0 cells only: backgroundSize uses slot.sheetCols (default 3 for
 * strips, 4 for the Player A atlas). Left is mirrored ONLY when the
 * slot's left and right frames are the same cell (old strips); slots
 * with distinct left/right cells (Player A) are NOT mirrored.
 */
export default function HumanPortrait({ slot, view = 'front', size = 96, showName = false, mirror = false }: {
  slot: HumanSlot;
  view?: HumanView;
  size?: number;
  showName?: boolean;
  mirror?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      {slot.sheetUrl ? (
        <div
          style={{
            width: size, height: size,
            backgroundImage: `url(${slot.sheetUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${size * (slot.sheetCols ?? 3)}px ${size}px`,
            backgroundPosition: `-${(slot.frames[view] / 64) * size}px 0px`,
            imageRendering: 'pixelated',
            transform: (mirror || (view === 'left' && slot.frames.left === slot.frames.right)) ? 'scaleX(-1)' : undefined,
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
      {!slot.sheetUrl && <div className="text-center text-[10px] uppercase tracking-wider text-slate-400">Art in progress</div>}
    </div>
  );
}
