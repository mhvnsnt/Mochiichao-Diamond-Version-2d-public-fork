import React, { useEffect, useState } from 'react';
import LockedStage from './LockedStage';
import TitleScene from './TitleScene';
import { PINNED_SUBTITLE_FONT } from '../../lib/fonts';
import heavensentLogo from '../../assets/ui/m-heavensent-studios-logo.png';
import mochiichaoLogo from '../../assets/ui/mochiichao-main-logo.png';
import {
  loadTitleStartVideo,
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
 *
 * TitleScene's own host is a 180px strip (its locked shape, kept
 * here): the strip is anchored to the bottom of the host, below
 * the LockedStage poster on portrait phones, so it does not cover
 * the logo/subtitle/press slots; on taller/wider hosts it sits
 * behind the overlay (layer 2), which always wins. Its descriptive
 * caption is suppressed with a single-space caption (TitleScene
 * only falls back to its long description when caption is falsy):
 * a technical paragraph has no place on a title screen.
 * startPrompt stays false — the press prompt is the locked
 * overlay's PRESS ANY KEY, owned by IntroSequence's existing
 * advance path (any key/click -> M3 chirp -> white fade 350ms ->
 * MAIN_MENU); TitleScene's own startPrompt/cry gate is NOT armed
 * here, so there is no double prompt and no double chirp.
 * fireTrail and figureCycleUrls are NOT passed (the task's prop
 * list is biome/figure/figureName/startPrompt): Yogiferno's fire
 * still bursts from its per-creature action, and Kittember's glow
 * cycle is a separate, later wiring decision, not silently added.
 *
 * State machine (titleStartScreens.ts): this component renders
 * the RUN state. INIT/FADEIN are the video load + TitleScene
 * mount; PROCEED/FADEOUT are IntroSequence's existing white fade,
 * not a second fade owned here.
 */
export default function TitleStartScreen({ preset }: { preset: TitleStartScreenPreset }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

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

  const showVideo = videoUrl !== null && !videoFailed;
  return (
    <div className="game-screen bg-[#050810] relative overflow-hidden cursor-pointer">
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
          <div
            className="absolute text-center text-white font-bold"
            style={{ left: 0, top: 905, width: 1200, fontSize: 44, letterSpacing: 6, animation: 'press-blink-first 1s steps(1) 1, press-blink 1s steps(1) 1s infinite' }}
          >
            PRESS ANY KEY
          </div>
          <img
            src={heavensentLogo}
            alt="M Heavensent Studios"
            className="absolute object-contain"
            style={{ left: 322, top: 944, width: 556, height: 556 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </LockedStage>
      </div>
    </div>
  );
}
