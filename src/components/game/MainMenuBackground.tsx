import { useEffect, useRef, type ReactNode } from "react";
import { LOCKED_V32_MENU } from "../../lib/lockedV32Menu";
import { MAIN_MENU_SYMBOLS } from "../../lib/mainMenuSymbols";

/**
 * MainMenuBackground — the CLEAN layered main-menu background (L0).
 *
 * Why this exists (2026-10-26, Mars's phone screenshot): the file that
 * used to be wired as the menu background, main-menu-v32-background.png,
 * IS a full-menu picture — logo, cloud, Mochii, and all four panels
 * painted in. Rendering it behind the live logo/cloud/panels drew TWO
 * menus at once. That PNG stays in the repo as the locked reference
 * picture only; it is never used as a background again.
 *
 * This layer is therefore rebuilt as separate pieces, in the locked
 * v32 layout (1200x1500, centre x=600):
 *   - white paper + rainbow arcs (SVG ellipses centred (600,454),
 *     palette sampled from the v32 art's top band)
 *   - confetti symbols as SEPARATE shapes, whose positions, sizes,
 *     and colours were extracted from the v32 PNG's visible areas
 *     (outside the logo/cloud/panel/Mochii rects the live layers
 *     cover) — see src/lib/mainMenuSymbols.ts and the extraction
 *     note in docs/locked-default-title-menu.md. Same palette and
 *     same density as v32; no new look was hand-painted.
 *
 * Animation (ui-art/menu-background-animation-spec.md, the approved
 * 80-frame x 70ms matched GIF): FireRed's AnimTranslateLinearSingle-
 * SineWave method — sine offsets on top of base positions, never a
 * change to the base layout. Mode B (flow): symbols rise slowly
 * (vy 8-14 px/s), sway in x with amplitude growing 3px at the bottom
 * to 8px near the gone point, rotate +/-4 degrees sine, and fade by
 * the locked phi fade (opacity 0 at y620 gone point, 0.35 at y729,
 * 1.0 at y905 and below). On reaching y620 a symbol respawns at the
 * bottom (y1500). Delta-time rAF loop, so speed is the same at 30fps
 * and 120fps. Symbols are pointer-events none and paint behind the
 * logo/cloud/panels, never over button text. prefers-reduced-motion
 * freezes to the static v32 base positions.
 */
type MenuSymbol = { x: number; y: number; s: number; c: string; shape: string };
const SYMBOLS = MAIN_MENU_SYMBOLS as MenuSymbol[];
const BG = LOCKED_V32_MENU.background;

const GOLDEN_ANGLE = 2.399963; // 137.508 degrees, radians
const GONE_Y = BG.fade.gone;
const MID_Y = BG.fade.mid;
const FULL_Y = BG.fade.full;
const BOTTOM_Y = LOCKED_V32_MENU.canvas.h;
const SPAN = BOTTOM_Y - GONE_Y; // 880

function fadeAt(y: number): number {
  if (y >= FULL_Y) return 1;
  if (y >= MID_Y) return 0.35 + 0.65 * ((y - MID_Y) / (FULL_Y - MID_Y));
  return 0.35 * ((y - GONE_Y) / (MID_Y - GONE_Y));
}

function shapePath(sym: MenuSymbol): ReactNode {
  const s = sym.s;
  if (sym.shape === "circle") return <circle r={s / 2} fill={sym.c} />;
  if (sym.shape === "diamond")
    return <polygon points={`0,${-s / 2} ${s / 2},0 0,${s / 2} ${-s / 2},0`} fill={sym.c} />;
  if (sym.shape === "star") {
    const q = s * 0.12;
    return (
      <path
        d={`M 0 ${-s / 2} Q ${q} ${-q} ${s / 2} 0 Q ${q} ${q} 0 ${s / 2} Q ${-q} ${q} ${-s / 2} 0 Q ${-q} ${-q} 0 ${-s / 2} Z`}
        fill={sym.c}
      />
    );
  }
  // heart, drawn in a 100x100 box scaled to s
  return (
    <path
      d="M50 88 C20 60 5 40 5 25 C5 10 20 0 32 8 C40 13 50 25 50 32 C50 25 60 13 68 8 C80 0 95 10 95 25 C95 40 80 60 50 88 Z"
      fill={sym.c}
      transform={`translate(${-s / 2},${-s / 2}) scale(${s / 100})`}
    />
  );
}

const ARC_COLORS = BG.arcs.colors;
const ARC_RX = BG.arcs.rx;

export default function MainMenuBackground() {
  const refs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const place = (t: number) => {
      SYMBOLS.forEach((sym, i) => {
        const el = refs.current[i];
        if (!el) return;
        const phase = i * GOLDEN_ANGLE;
        const period = BG.animation.periodSec[i % BG.animation.periodSec.length];
        const vy = BG.animation.riseVyMin + (i % (BG.animation.riseVyMax - BG.animation.riseVyMin + 1));
        let y: number;
        let x: number;
        let rot: number;
        if (reduced) {
          y = sym.y;
          x = sym.x;
          rot = 0;
        } else {
          y = GONE_Y + (((sym.y - GONE_Y - t * vy) % SPAN) + SPAN) % SPAN;
          const sway = BG.animation.swayMin + (BG.animation.swayMax - BG.animation.swayMin) * ((BOTTOM_Y - y) / SPAN);
          x = sym.x + Math.sin((2 * Math.PI * t) / period + phase) * sway;
          rot = Math.sin((2 * Math.PI * t) / period + phase) * BG.animation.rotateDeg;
        }
        el.setAttribute("transform", `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rot.toFixed(2)})`);
        el.setAttribute("opacity", fadeAt(y).toFixed(3));
      });
    };
    place(0);
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt;
      place(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="absolute"
      style={{ left: 0, top: 0, width: LOCKED_V32_MENU.canvas.w, height: LOCKED_V32_MENU.canvas.h, background: BG.paper, overflow: "hidden", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg width={LOCKED_V32_MENU.canvas.w} height={LOCKED_V32_MENU.canvas.h}>
        {ARC_RX.map((rx, i) => (
          <ellipse key={i} cx={BG.arcs.centre.x} cy={BG.arcs.centre.y} rx={rx} ry={rx * BG.arcs.ryRatio} fill="none" stroke={ARC_COLORS[i]} strokeWidth={BG.arcs.strokeWidth} opacity={0.9} />
        ))}
        {BG.arcs.orbits.map((o, i) => (
          <ellipse key={`o${i}`} cx={BG.arcs.centre.x} cy={BG.arcs.centre.y} rx={o.rx} ry={o.ry} fill="none" stroke={o.color} strokeWidth={BG.arcs.strokeWidth} opacity={0.9} transform={`rotate(${o.rotate} ${BG.arcs.centre.x} ${BG.arcs.centre.y})`} />
        ))}
        {SYMBOLS.map((sym, i) => (
          <g
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            transform={`translate(${sym.x},${sym.y})`}
            opacity={fadeAt(sym.y)}
          >
            {shapePath(sym)}
          </g>
        ))}
      </svg>
    </div>
  );
}
