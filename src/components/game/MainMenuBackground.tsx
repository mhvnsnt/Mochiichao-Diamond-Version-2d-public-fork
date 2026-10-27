import { useEffect, useRef, type ReactNode } from "react";
import { LOCKED_V32_MENU } from "../../lib/lockedV32Menu";
import { MAIN_MENU_SYMBOLS } from "../../lib/mainMenuSymbols";
import {
  type MenuEditorConfig, getActiveMenuConfig, transformSymbols,
} from "../../lib/menuEditor";

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
 *     generated guesses (the PR #170 generated fill is what
 *     Mars rejected).
 *
 * Animation — PERFECT by default (matched GIF, Mars PERFECT
 * 2026-10-25 17:12 CDT; see perfect-menu-trace-2026-10-26.md):
 * 285 measured symbols rise at 157.14 px/s (11px/frame at 70ms, 80 frames x
 * 70ms = 5.6s loop), modulo zone 620-1500, sway sin*6px, bob
 * sin*4px on top of rise, 2 cycles per loop, phase by golden
 * angle, fade by the locked phi fade (0 at y620, 0.35 at y729,
 * 1.0 at y905+), clamped never above y620. No rotation.
 * The PR #163 speed (vy 8-14 px/s, sway 3->8px, rotate +/-4deg,
 * period 4-6s) is saved as the "slow-rise" option in
 * lockedV32Menu.animationSpeeds and is selected by the editor's
 * RISE SPEED row; it is never the default. Symbols are
 * pointer-events none, behind logo/panels.
 * prefers-reduced-motion freezes to static base positions.
 *
 * Menu Editor wiring (2026-10-26): this background reads the
 * ACTIVE menu config — the working preset when one was saved,
 * else the locked default exactly. The editor preview passes its
 * unsaved draft as `config`, so the preview animates the draft
 * live. Arcs, symbols, fade, speed, sway/bob, field span, count,
 * and layer visibility/order all come from that config; nothing
 * about the locked menu lives only in JSX literals any more.
 * The old localStorage animation-speed key stopgap is retired:
 * the editor owns speed now, and the key no longer overrides it.
 */
type MenuSymbol = { x: number; y: number; s: number; c: string; shape: string };

const GOLDEN_ANGLE = 2.399963; // 137.508 degrees, radians

function fadeAt(fade: MenuEditorConfig["fade"], y: number): number {
  if (y >= fade.full) return 1;
  if (y >= fade.mid) return 0.35 + 0.65 * ((y - fade.mid) / (fade.full - fade.mid));
  if (y <= fade.gone) return 0;
  return 0.35 * ((y - fade.gone) / (fade.mid - fade.gone));
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

export default function MainMenuBackground({ config }: { config?: MenuEditorConfig }) {
  const refs = useRef<(SVGGElement | null)[]>([]);
  const cfg = config ?? getActiveMenuConfig();
  const syms = transformSymbols(
    MAIN_MENU_SYMBOLS as MenuSymbol[],
    cfg.symbols.fieldLeft, cfg.symbols.fieldRight, cfg.symbols.count,
  ) as MenuSymbol[];
  const fade = cfg.fade;
  const arcs = cfg.arcs;
  const GONE_Y = fade.gone;
  const BOTTOM_Y = LOCKED_V32_MENU.canvas.h;
  const SPAN = BOTTOM_Y - GONE_Y;
  const animKey = [
    cfg.symbols.speed, cfg.symbols.swayPx, cfg.symbols.swayCycles,
    cfg.symbols.bobPx, cfg.symbols.bobCycles, cfg.symbols.fieldLeft,
    cfg.symbols.fieldRight, cfg.symbols.count, fade.gone, fade.mid, fade.full,
  ].join("|");
  const arcsVisible = cfg.layers.arcs.visible;
  const symbolsVisible = cfg.layers.symbols.visible;
  const symbolsBelowArcs = cfg.layers.symbols.order < cfg.layers.arcs.order;

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedId = cfg.symbols.speed;
    const place = (t: number) => {
      syms.forEach((sym, i) => {
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
          const ang = (2 * Math.PI * cfg.symbols.swayCycles * t) / 5.6 + phase;
          const bobAng = (2 * Math.PI * cfg.symbols.bobCycles * t) / 5.6 + phase;
          y = GONE_Y + (((sym.y - GONE_Y - t * 157.14) % SPAN) + SPAN) % SPAN;
          y = Math.max(GONE_Y, y + Math.sin(bobAng) * cfg.symbols.bobPx);
          x = sym.x + Math.sin(ang) * cfg.symbols.swayPx;
          rot = 0;
        } else {
          // slow-rise: exact PR #163 behaviour, option only.
          const sp = LOCKED_V32_MENU.background.animationSpeeds["slow-rise"];
          const period = sp.periodSec[i % sp.periodSec.length];
          const vy = sp.riseVyMin + (i % (sp.riseVyMax - sp.riseVyMin + 1));
          y = GONE_Y + (((sym.y - GONE_Y - t * vy) % SPAN) + SPAN) % SPAN;
          const sway = sp.swayMin + (sp.swayMax - sp.swayMin) * ((BOTTOM_Y - y) / SPAN);
          x = sym.x + Math.sin((2 * Math.PI * t) / period + phase) * sway;
          rot = Math.sin((2 * Math.PI * t) / period + phase) * sp.rotateDeg;
        }
        el.setAttribute("transform", `translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rot.toFixed(2)})`);
        el.setAttribute("opacity", fadeAt(fade, y).toFixed(3));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey]);

  const arcsGroup = arcsVisible ? (
    <g>
      {arcs.radii.map((rx, i) => (
        <ellipse key={i} cx={arcs.cx} cy={arcs.cy} rx={rx} ry={rx} fill="none" stroke={arcs.colors[i % arcs.colors.length]} strokeWidth={arcs.stroke} opacity={0.9} />
      ))}
      {arcs.orbitRx.map((rx, i) => (
        <ellipse key={`o${i}`} cx={arcs.cx} cy={arcs.cy} rx={rx} ry={arcs.orbitRy[i] ?? rx} fill="none" stroke={arcs.orbitColors[i % arcs.orbitColors.length]} strokeWidth={arcs.stroke} opacity={0.9} />
      ))}
    </g>
  ) : null;
  const symbolsGroup = symbolsVisible ? (
    <g>
      {syms.map((sym, i) => (
        <g
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          transform={`translate(${sym.x},${sym.y})`}
          opacity={fadeAt(fade, sym.y)}
        >
          {shapePath(sym)}
        </g>
      ))}
    </g>
  ) : null;

  return (
    <div
      className="absolute"
      style={{ left: 0, top: 0, width: LOCKED_V32_MENU.canvas.w, height: LOCKED_V32_MENU.canvas.h, background: fade.paper, overflow: "hidden", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg width={LOCKED_V32_MENU.canvas.w} height={LOCKED_V32_MENU.canvas.h}>
        {symbolsBelowArcs ? (<>{symbolsGroup}{arcsGroup}</>) : (<>{arcsGroup}{symbolsGroup}</>)}
      </svg>
    </div>
  );
}
