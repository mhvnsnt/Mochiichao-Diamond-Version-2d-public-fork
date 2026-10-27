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
 *   - white paper + rainbow arcs (SVG CIRCLES centred (600,454),
 *     radii/colours measured from the v32 picture in round 2,
 *     2026-10-26 — the old ellipses were wrong; see
 *     lockedV32Menu.ts arcs comment for the measurements)
 *   - confetti symbols as SEPARATE shapes, MEASURED from the
 *     matched GIF (round 2, 2026-10-26) — see
 *     src/lib/mainMenuSymbols.ts. 285 symbols; history's field is
 *     300, shortfall 15 = 5.0%, named there, NOT filled with
 *     generated guesses (the PR #170 generated fill is what Mars
 *     rejected 2026-10-26 12:38 CDT).
 *
 * Animation — SLOW-RISE by default (Mars 2026-10-26 19:54 CDT: the
 * rising emblems moved too fast; use the slow speed locked earlier
 * today). 285 measured symbols rise at vy 8-14 px/s (PR #163 speed),
 * modulo zone 620-1500, sway 3->8px growing toward the bottom,
 * rotate +/-4deg, period 4-6s, phase by golden angle, fade by the
 * locked phi fade (0 at y620, 0.35 at y729, 1.0 at y905+), clamped
 * never above y620. The matched-GIF PERFECT speed (157.14 px/s,
 * 11px/frame at 70ms, 80 frames x 70ms = 5.6s loop, sway sin*6px, bob
 * sin*4px, 2 cycles per loop, Mars PERFECT 2026-10-25 17:12 CDT)
 * is kept as the option, selected by setting
 * background.animationSpeed to "perfect". Symbols are
 * pointer-events none, behind logo/panels.
 * prefers-reduced-motion freezes to static base positions.
 * Logo hearts (blue + pink, Mars 2026-10-26 19:54 CDT) are static
 * decorations rendered last in this SVG — above arcs + symbols,
 * below logo/cloud/panels — at full opacity, never animated, never
 * faded (see lockedV32Menu.background.logoHearts for the measured
 * placements).
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

function heartPath(c: string, w: number, h: number): ReactNode {
  // Same heart geometry as the symbol hearts (100-box path, x5-95,
  // y0-88, centre (50,44)), scaled so the VISIBLE box is exactly w x h
  // centred on the group's translate point: x maps -w/2..+w/2,
  // y maps -h/2..+h/2.
  return (
    <path
      d="M50 88 C20 60 5 40 5 25 C5 10 20 0 32 8 C40 13 50 25 50 32 C50 25 60 13 68 8 C80 0 95 10 95 25 C95 40 80 60 50 88 Z"
      fill={c}
      transform={`translate(${-50},${-44}) scale(${w / 90},${h / 88})`}
    />
  );
}

const ARC_COLORS = BG.arcs.colors;
const ARC_RX = BG.arcs.rx;

export default function MainMenuBackground() {
  const refs = useRef<(SVGGElement | null)[]>([]);

  // Speed selector. The default is BG.animationSpeed from the locked
  // menu data ("slow-rise" since Mars's 2026-10-26 19:54 CDT order;
  // "perfect" stays selectable). A stored override (key
  // "mochiichao-menu-animation-speed", written by a future Menu
  // Creator / Settings row — nothing writes it today) may select
  // "slow-rise" at runtime. The localStorage read is load-bearing
  // for shipping, not decoration: with a compile-time-known literal
  // the bundler dropped the slow-rise branch and data entirely
  // (second build 2026-10-26: slow-rise 0 occurrences). Because the
  // value cannot be known at build time, BOTH branches ship.
  function resolveSpeedId(): "perfect" | "slow-rise" {
    try {
      const stored = window.localStorage.getItem("mochiichao-menu-animation-speed");
      if (stored === "slow-rise" || stored === "perfect") return stored;
    } catch {
      /* storage unavailable: fall through to the data default */
    }
    return BG.animationSpeed;
  }

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedId = resolveSpeedId();
    const place = (t: number) => {
      SYMBOLS.forEach((sym, i) => {
        const el = refs.current[i];
        if (!el) return;
        const phase = i * GOLDEN_ANGLE;
        let y: number;
        let x: number;
        let rot: number;
        if (reduced) {
          y = sym.y;
          x = sym.x;
          rot = 0;
        } else if (speedId === "perfect") {
          const sp = BG.animationSpeeds.perfect;
          const ang = (2 * Math.PI * sp.cyclesPerLoop * t) / sp.loopSec + phase;
          y = GONE_Y + (((sym.y - GONE_Y - t * sp.risePxPerSec) % SPAN) + SPAN) % SPAN;
          y = Math.max(GONE_Y, y + Math.sin(ang) * sp.bobPx);
          x = sym.x + Math.sin(ang) * sp.swayPx;
          rot = 0;
        } else {
          // slow-rise: exact PR #163 behaviour, now the default.
          const sp = BG.animationSpeeds["slow-rise"];
          const period = sp.periodSec[i % sp.periodSec.length];
          const vy = sp.riseVyMin + (i % (sp.riseVyMax - sp.riseVyMin + 1));
          y = GONE_Y + (((sym.y - GONE_Y - t * vy) % SPAN) + SPAN) % SPAN;
          const sway = sp.swayMin + (sp.swayMax - sp.swayMin) * ((BOTTOM_Y - y) / SPAN);
          x = sym.x + Math.sin((2 * Math.PI * t) / period + phase) * sway;
          rot = Math.sin((2 * Math.PI * t) / period + phase) * sp.rotateDeg;
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
        {/* Logo hearts: static decorations, LAST in this SVG so they
            sit above arcs + symbols and below logo/cloud/panels
            (IntroSequence renders this background first). Full
            opacity, no refs, never animated, never faded. */}
        {BG.logoHearts.map((e, i) => (
          <g key={`heart${i}`} transform={`translate(${e.x},${e.y})`}>
            {heartPath(e.c, e.w, e.h)}
          </g>
        ))}
      </svg>
    </div>
  );
}
