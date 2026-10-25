import React from 'react';
import { getSheetDef, sheetCellStyle, fallbackColorFor, creatureDisplayName } from '../../lib/spriteSheets';

/**
 * One creature portrait, game-style. Real sheet cell when one exists
 * (Dorowani 147 / Gabu 148); otherwise an original coloured silhouette
 * (a drawn blob with eyes, coloured by the creature's first type) plus the
 * creature's name. Never a Pokemon sprite, never an emoji, never a network
 * sprite fetch at play time.
 */
export default function CreaturePortrait({
  speciesId, view = 'front', size = 96, name, showName = false, mirror = false,
}: {
  speciesId: string | undefined | null;
  view?: 'front' | 'back' | 'side';
  size?: number;
  name?: string;
  showName?: boolean;
  mirror?: boolean;
}) {
  const def = getSheetDef(speciesId);
  const color = fallbackColorFor(speciesId);
  const label = name || creatureDisplayName(speciesId);
  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      {def ? (
        <div style={{ ...sheetCellStyle(def, view, size), transform: mirror ? 'scaleX(-1)' : undefined }} aria-label={label} />
      ) : (
        <div
          className="relative flex items-end justify-center"
          style={{ width: size, height: size }}
          aria-label={`${label} (art not made yet)`}
        >
          <div
            className="rounded-full"
            style={{
              width: size * 0.82, height: size * 0.66, background: color,
              boxShadow: `inset -${size * 0.08}px -${size * 0.08}px 0 rgba(0,0,0,0.25)`,
              position: 'relative',
            }}
          >
            <div className="absolute rounded-full bg-white" style={{ width: size * 0.12, height: size * 0.12, left: '24%', top: '28%' }}>
              <div className="absolute rounded-full bg-black" style={{ width: '55%', height: '55%', left: '22%', top: '22%' }} />
            </div>
            <div className="absolute rounded-full bg-white" style={{ width: size * 0.12, height: size * 0.12, right: '24%', top: '28%' }}>
              <div className="absolute rounded-full bg-black" style={{ width: '55%', height: '55%', left: '22%', top: '22%' }} />
            </div>
          </div>
          <div className="absolute rounded-full" style={{ width: size * 0.9, height: size * 0.1, background: 'rgba(0,0,0,0.35)', bottom: 0 }} />
        </div>
      )}
      {showName && <div className="text-center font-bold text-white leading-tight" style={{ fontSize: Math.max(11, size * 0.16) }}>{label}</div>}
      {!def && <div className="text-center text-[10px] uppercase tracking-wider text-slate-400">Art in progress</div>}
    </div>
  );
}
