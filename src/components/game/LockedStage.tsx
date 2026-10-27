import React, { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * LockedStage — resize-aware 1200x1500 stage scaler (restoration, 2026-10-26;
 * centering fixed 2026-10-26 phone-menu fix).
 *
 * The locked title and locked v32 main menu are specified on a 1200x1500
 * canvas (see ui-art/title-screen-spec.md and
 * ui-art/main-menu-default-locked-v32.md). This component renders its
 * children at those exact stage coordinates and scales the whole stage
 * to fit its host.
 *
 * CENTERING RULE (the phone fix): left/top are computed from the
 * MEASURED host size, never from the stage size alone:
 *   scale = min(hostW / 1200, hostH / 1500)
 *   left  = (hostW - 1200 * scale) / 2
 *   top   = (hostH - 1500 * scale) / 2
 * The previous formula (left = 600 - 600*scale, top = 750 - 750*scale)
 * assumed the host IS 1200x1500; on a 390px phone (scale 0.325) it put
 * the stage's left edge at x=405 — past the phone's right edge — so
 * the menu panels sat off-screen and nothing was tappable.
 * Measurement runs in useLayoutEffect (before first paint) plus a
 * ResizeObserver and resize/orientation listeners, so the first paint
 * already carries the measured scale and the stage never renders at
 * scale 0 while a resize is awaited.
 * The `background` layer bleeds full-host behind the stage, so on
 * taller-than-stage screens the bars above/below the poster carry the
 * same background instead of empty black. In landscape the stage
 * stays a centered portrait poster with background bleed — it is
 * never stretched, which would break the locked placements.
 */
export const STAGE_W = 1200;
export const STAGE_H = 1500;

export default function LockedStage({
  background,
  children,
}: {
  background?: ReactNode;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  // First-paint fallback (preset-trap fix): if measurement has not
  // run yet, start from the viewport size instead of null, so the
  // stage never paints at scale 0. The useLayoutEffect below
  // measures the real host before first paint in normal cases and
  // overwrites this guess; the guess only ever paints when
  // measurement cannot see a sized host at all. Measured values
  // always win afterwards — the locked title/menu geometry is
  // unchanged once measured.
  const [hostSize, setHostSize] = useState<{ w: number; h: number } | null>(() =>
    typeof window !== 'undefined' && window.innerWidth > 0 && window.innerHeight > 0
      ? { w: window.innerWidth, h: window.innerHeight }
      : null,
  );
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => {
      const r = host.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setHostSize((prev) =>
          prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height },
        );
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(host);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  const scale = hostSize ? Math.min(hostSize.w / STAGE_W, hostSize.h / STAGE_H) : 0;
  const left = hostSize ? (hostSize.w - STAGE_W * scale) / 2 : 0;
  const top = hostSize ? (hostSize.h - STAGE_H * scale) / 2 : 0;
  return (
    <div ref={hostRef} className="relative w-full h-full overflow-hidden">
      {background}
      <div
        className="absolute"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          left,
          top,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
