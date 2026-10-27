import React, { useEffect, useState } from 'react';
import LockedStage from './LockedStage';
import TitleScene from './TitleScene';
import { PINNED_SUBTITLE_FONT } from '../../lib/fonts';
import { TITLE_BIOMES } from '../../lib/titleBiomes';
import heavensentLogo from '../../assets/ui/m-heavensent-studios-logo.png';
import mochiichaoLogo from '../../assets/ui/mochiichao-main-logo.png';
import {
  loadTitleStartVideo,
  setSelectedTitleStartScreenId,
  type TitleStartScreenPreset,
} from '../../lib/titleStartScreens';

/**
 * TitleStartScreen — one selected interchangeable start screen.
 *
 * FILE-HEADER SYNC WARNING: the locked overlay below is a copy of
 * the locked default TITLE render in src/components/IntroSequence.tsx
 * (logo PNG import, subtitle font constant, press prompt + blink CSS,
 * studio logo, and their exact stage coordinates). If the locked
 * default ever changes, THIS copy must be re-synced by hand — it is
 * not imported from IntroSequence, deliberately, so the locked
 * default code path itself stays untouched (IntroSequence's TITLE
 * branch renders the locked stage exactly as before when no preset
 * is selected). Do NOT "improve" the copy's coordinates: a drift
 * here is a silent divergence from the locked title, not a fix.
 *
 * Layer order (bottom -> top):
 *  -1. painted background image — the SAME preset's painted
 *      background, always rendered. It guarantees the screen is
 *      never black: if the video fails to load AND the Pixi canvas
 *      fails, the painting is still there behind everything.
 *   0. video (when it loads) — autoplay, loop, muted, playsInline,
 *      object-cover, full host. Only the selected preset's video
 *      chunk is lazy-loaded (titleStartScreens.ts loaders).
 *   1. TitleScene canvas — biome drift/weather/figure/effects.
 *      hideBackground=true while the video plays, so the video
 *      shows through the transparent Pixi canvas; on video error
 *      (load failure OR <video> onError) the component falls back
 *      to hideBackground=false, so TitleScene's painted background
 *      becomes the fallback. The fallback is the SAME preset's
 *      painted background — never another preset's video or art.
 *   2. locked overlay — LockedStage + the verbatim logo/subtitle/
 *      press/studio elements above. It sits above the scene so the
 *      title identity is identical on every preset.
 *   3. reset control — a small RESET button (preset titles only).
 *      It is NOT part of the locked overlay copy: the locked
 *      default has no reset control, and this one exists only so
 *      a preset title can never trap the game.
 *
 * TitleScene's own host is a 180px strip (its locked shape, kept
 * here): the strip is anchored to the bottom of the host, below
 * the LockedStage poster on portrait phones, so it does not cover
 * the logo/subtitle/press slots; on taller/wider hosts it sits
 * behind the overlay (layer 2), which always wins. Its descriptive
 * caption is suppressed with a single-space caption (TitleScene
 * only falls back to its long description when caption is falsy):
 * a technical paragraph has no place on a title screen.
 *
 * Press behaviour (preset titles ONLY — the locked default keeps
 * IntroSequence's existing any-key/click handler, untouched):
 * this component owns its own press path via the onAdvance prop
 * (IntroSequence's advanceIntro: M3 chirp, white fade 350ms,
 * MAIN_MENU). Its window keydown listener is registered in this
 * child's effect, which runs before the parent's effect, and it
 * calls stopImmediatePropagation after advancing once, so the
 * parent handler never double-fires (no double chirp, no double
 * fade). Its outer-div onMouseDown stops propagation for the
 * same reason. If the parent handler were ever absent, the preset
 * title still advances — a preset title must never be a dead end.
 * TitleScene's own startPrompt/cry gate is NOT armed here, so
 * there is no double prompt and no double chirp.
 * fireTrail and figureCycleUrls are NOT passed (the task's prop
 * list is biome/figure/figureName/startPrompt): Yogiferno's fire
 * still bursts from its per-creature action, and Kittember's glow
 * cycle is a separate, later wiring decision, not silently added.
 *
 * Recovery (preset titles ONLY — the locked default's keys are
 * unchanged): pressing R, or tapping the RESET button, clears
 * the stored preset and calls onReset, so the parent re-renders
 * the locked default title. R is safe here because this handler
 * runs only while a preset title is mounted; on the locked
 * default this component is not mounted and R is just another
 * press key, exactly as before.
 *
 * State machine (titleStartScreens.ts): this component renders
 * the RUN state. INIT/FADEIN are the video load + TitleScene
 * mount; PROCEED/FADEOUT are IntroSequence's existing white fade,
 * not a second fade owned here.
 */

export default function TitleStartScreen({
  preset,
  onAdvance,
  onReset,
}: {
  preset: TitleStartScreenPreset;
  /** Re-render token from the parent (bumped on reset). Read by
   *  the caller; the component does not need its value — the
   *  parent's state bump is what re-renders the locked branch. */
  resetNonce?: number;
  /** Preset-title press path (IntroSequence advanceIntro). */
  onAdvance?: () => void;
  /** Called after the stored preset is cleared, so the parent
   *  re-renders the locked default title. */
  onReset?: () => void;
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  // The key handler below registers once per preset and therefore
  // captures the first render's advanceIntro closure (titleFading
  // false). Without this guard, a second keypress inside the 350 ms
  // fade would re-fire the press sound. The click path uses fresh
  // render closures and is guarded by titleFading state instead.
  const advanceGuardRef = React.useRef(false);

  useEffect(() => {
    let cancelled = false;
    setVideoUrl(null);
    setVideoFailed(false);
    void loadTitleStartVideo(preset).then((url) => {
      if (cancelled) return;
      if (url) setVideoUrl(url);
      else setVideoFailed(true);
    });
    return () => { cancelled = true; };
  }, [preset]);

  const doReset = () => {
    setSelectedTitleStartScreenId(null);
    onReset?.();
  };

  // Preset-title keys: R resets to the locked default; any other
  // key advances (via onAdvance). stopImmediatePropagation keeps
  // the parent TITLE handler from double-firing on the same key.
  // Registered in this child's effect, which runs before the
  // parent's effect on mount, so this listener is earlier in the
  // window's listener list.
  useEffect(() => {
    if (!onAdvance && !onReset) return;
    advanceGuardRef.current = false;
    const handler = (e: KeyboardEvent) => {
      // Never hijack browser shortcuts (Ctrl+R refresh, etc.).
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        e.stopImmediatePropagation();
        doReset();
        return;
      }
      if (onAdvance && !advanceGuardRef.current) {
        advanceGuardRef.current = true;
        e.stopImmediatePropagation();
        onAdvance();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // doReset/onAdvance are stable parent callbacks in practice;
    // re-registering on preset change is enough (preset is the
    // only prop that changes what this title is).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  const showVideo = videoUrl !== null && !videoFailed;
  const paintedBg = TITLE_BIOMES[preset.biome]?.backgroundImage ?? null;
  return (
    <div
      className="game-screen bg-[#050810] relative overflow-hidden cursor-pointer"
      onMouseDown={(e) => {
        // Clicks advance via onAdvance only; stopping propagation
        // keeps the parent window-mousedown handler from firing
        // a second advance (no double chirp). The RESET button
        // below stops its own mousedown, so it never reaches here.
        e.stopPropagation();
        onAdvance?.();
      }}
    >
      {/* Layer -1: painted fallback — never black, even if the
          video and the Pixi canvas both fail. */}
      {paintedBg && (
        <img
          src={paintedBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Layer 0: video background. */}
      {showVideo && (
        <video
          key={preset.id}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}
      {/* Layer 1: TitleScene canvas strip, anchored bottom. */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <TitleScene
          biome={preset.biome}
          figureUrl={preset.figureUrl}
          figureName={preset.creature}
          startPrompt={false}
          hideBackground={showVideo}
          caption=" "
        />
      </div>
      {/* Layer 2: locked overlay, copied VERBATIM in coordinates
          from IntroSequence's locked TITLE render (see header).
          Background prop intentionally omitted: the video (or the
          painted fallback) IS the background; the locked render's
          stardust/gradient bleed would sit on top of it. */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <LockedStage>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 bottom-0 bg-white/20"
              style={{ width: 96, animation: 'title-shine 2.4s ease-in-out 2' }}
            />
          </div>
          <style>{`@keyframes title-shine { from { left: -10%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { left: 110%; opacity: 0; } } @keyframes title-slide-up { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes press-blink-first { 0%, 100% { opacity: 1; } } @keyframes press-blink { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }`}</style>
          <img
            src={mochiichaoLogo}
            alt="MOCHIICHAO"
            className="absolute object-contain"
            style={{ left: 150, top: 185, width: 900, animation: 'title-slide-up 0.6s ease-out' }}
          />
          <div
            className="absolute flex items-center justify-center text-teal-300 font-bold drop-shadow-lg"
            style={{ left: 322, top: 698, width: 556, height: 74, fontSize: 44, letterSpacing: 4, animation: 'title-slide-up 0.6s ease-out 0.4s both', fontFamily: PINNED_SUBTITLE_FONT }}
          >
            ✦ DIAMOND VERSION ✦
          </div>
          {/* PRESS ANY KEY text removed 2026-10-27 per Mars: preset title screens already say PRESS START (video); key/click advance unchanged. */}
          <img
            src={heavensentLogo}
            alt="M Heavensent Studios"
            className="absolute object-contain"
            style={{ left: 322, top: 944, width: 556, height: 556 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </LockedStage>
      </div>
      {/* Layer 3: preset-only recovery. Not part of the locked
          overlay copy. Tapping it clears the preset and returns
          to the locked default title without advancing to the
          menu; pressing R does the same. */}
      <div className="absolute right-3 top-3 z-30">
        <button
          type="button"
          aria-label="Reset title screen to locked default"
          onMouseDown={(e) => { e.stopPropagation(); }}
          onClick={(e) => { e.stopPropagation(); doReset(); }}
          className="px-3 py-2 rounded-full bg-black/70 text-white text-xs font-bold tracking-widest border border-white/40"
        >
          RESET TITLE ✕ (R)
        </button>
      </div>
    </div>
  );
}
