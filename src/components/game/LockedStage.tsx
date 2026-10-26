import React, { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LockedStage — resize-aware 1200x1500 stage scaler (restoration, 2026-10-26).
 *
 * The locked title and locked v32 main menu are specified on a 1200x1500
 * canvas (see ui-art/title-screen-spec.md and
 * ui-art/main-menu-default-locked-v32.md). This component renders its
 * children at those exact stage coordinates and scales the whole stage
 * to fit its host — recomputed on every host resize (ResizeObserver +
 * window resize/orientation), never computed once at init and frozen.
 * That is the phone-fit mechanism for the restored path: on a ~390px
 * phone the stage scales to 390 wide, so the logo image can never
 * truncate at the right edge, and no horizontal overflow is possible.
 * The `background` layer bleeds full-host behind the stage, so on
 * taller-than-stage screens the bars above/below the poster carry the
 * same background instead of empty black.
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
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => {
      const r = host.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setScale(Math.min(r.width / STAGE_W, r.height / STAGE_H));
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
  const left = 600 - 600 * scale;
  const top = 750 - 750 * scale;
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
