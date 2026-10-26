import React, { useEffect, useState } from 'react';
import { getSheetDef, sheetCellStyle, fallbackColorFor, creatureDisplayName } from '../../lib/spriteSheets';
import { folderForSpecies, IDLE, loadIdleFrame, loadSilhouette, SILHOUETTES } from '../../lib/creatureAnimation';

/**
 * One creature portrait, game-style. Real sheet cell when one exists
 * (all 49 sheet defs after the Phase 3 pivot, 147/148 included via their
 * locked 2D atlases); otherwise an original coloured silhouette
 * (a drawn blob with eyes, coloured by the creature's first type) plus the
 * creature's name. Never a Pokemon sprite, never an emoji, never a network
 * sprite fetch at play time.
 *
 * Phase 3 additions (creatureAnimation registry):
 * - Idle loops: when animateIdle is on (default) and the creature has an
 *   idle spec, the portrait cycles its idle_a/b/c frames at the spec's
 *   durations, falling back to the static sheet cell while frames load or
 *   if a load fails. The static cell is never replaced by a guessed frame.
 * - Discovery silhouettes: when undiscovered is set and a silhouette exists
 *   for the creature, the silhouette renders instead of the sheet cell
 *   (nothing flashes the real art first — the box stays empty until the
 *   silhouette loads). When there is no sheet def but a silhouette exists,
 *   the silhouette replaces the blob fallback. No dex view passes
 *   undiscovered yet; the prop is the wiring, the dex surface is owed.
 * - Lustre variants (10 looks per creature) render in the Team panel via variants.ts, not here.
 */
export default function CreaturePortrait({
  speciesId, view = 'front', size = 96, name, showName = false, mirror = false,
  animateIdle = true, undiscovered = false,
}: {
  speciesId: string | undefined | null;
  view?: 'front' | 'back' | 'side';
  size?: number;
  name?: string;
  showName?: boolean;
  mirror?: boolean;
  animateIdle?: boolean;
  undiscovered?: boolean;
}) {
  const def = getSheetDef(speciesId);
  const color = fallbackColorFor(speciesId);
  const label = name || creatureDisplayName(speciesId);
  const folder = folderForSpecies(speciesId);
  const idleSpec = folder ? IDLE[folder] : undefined;
  const hasSilhouette = !!(folder && SILHOUETTES[folder]);

  const [idleUrl, setIdleUrl] = useState<string | null>(null);
  const [idleFailed, setIdleFailed] = useState(false);
  const [silUrl, setSilUrl] = useState<string | null>(null);

  // Idle cycle: step through the spec frames at their durations. Each
  // step loads its frame URL (registry-cached promises); a failed load
  // stops the cycle and the static cell shows instead.
  useEffect(() => {
    if (!animateIdle || !idleSpec || !folder || undiscovered) return;
    let cancelled = false;
    let timer = 0;
    const step = (idx: number) => {
      if (cancelled) return;
      const frame = idleSpec.frames[idx % idleSpec.frames.length];
      const p = loadIdleFrame(folder, frame.file);
      if (!p) { setIdleFailed(true); return; }
      p.then((url) => {
        if (cancelled) return;
        setIdleUrl(url);
        timer = window.setTimeout(() => step(idx + 1), frame.durationMs);
      }).catch(() => { if (!cancelled) setIdleFailed(true); });
    };
    step(0);
    return () => { cancelled = true; window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, animateIdle, undiscovered]);

  // Silhouette load (undiscovered, or no-def fallback).
  useEffect(() => {
    if (!folder || !hasSilhouette) return;
    if (!undiscovered && def) return;
    let cancelled = false;
    const p = loadSilhouette(folder);
    if (!p) return;
    p.then((url) => { if (!cancelled) setSilUrl(url); }).catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, hasSilhouette, undiscovered, !!def]);

  const showSilhouette = ((undiscovered && hasSilhouette) || (!def && hasSilhouette)) && !!silUrl;
  const showIdle = !!def && animateIdle && !!idleSpec && !idleFailed && !!idleUrl && !undiscovered;
  // Undiscovered and no silhouette loaded yet: empty box, never the real
  // art (even when a sheet def exists but no silhouette does). No-def,
  // not undiscovered, with a silhouette still loading: the blob below,
  // then the silhouette once it arrives. The blob is the only branch that
  // carries the "Art in progress" caption.
  const showEmptyUndiscovered = undiscovered && !silUrl;
  const showBlob = !def && !showSilhouette && !showEmptyUndiscovered;

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      {showEmptyUndiscovered ? (
        <div style={{ width: size, height: size }} aria-label={`${label} (undiscovered)`} />
      ) : showSilhouette ? (
        <img src={silUrl!} alt={`${label} (undiscovered)`} width={size} height={size} style={{ width: size, height: size, imageRendering: 'pixelated', transform: mirror ? 'scaleX(-1)' : undefined }} />
      ) : showIdle ? (
        <img src={idleUrl!} alt={label} width={size} height={size} style={{ width: size, height: size, imageRendering: 'pixelated', transform: mirror ? 'scaleX(-1)' : undefined }} />
      ) : def ? (
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
    </div>
  );
}
