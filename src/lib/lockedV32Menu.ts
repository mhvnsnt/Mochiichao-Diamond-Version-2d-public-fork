/**
 * Locked v32 main menu — the WHOLE menu as data (2026-10-26 layer fix).
 *
 * Mars's rule (2026-10-26 09:26 CDT): a saved preset / restore is NOT
 * a static render and NOT a partial reset. It must be every
 * hand-built thing stored as data the game loads, so selecting it
 * restores all of it exactly. This module is that data for the main
 * menu itself: canvas, logo, cloud, Mochii cue, panels, background
 * layers, and symbol animation — the values Mars locked 2026-10-25
 * 16:47 CDT (layout) and 17:12 CDT (animation), copied exactly, not
 * redesigned. MAIN_MENU and MainMenuBackground render FROM this
 * object; nothing about the locked menu lives only in JSX literals
 * any more.
 *
 * What this module does NOT yet do (honest gap, follow-up PR — see
 * docs/locked-default-title-menu.md "Full snapshot preset gap"):
 * selecting a preset from Settings does not yet swap this object.
 * The settings-store fields (font rows, cursor, sound, button mode,
 * frame, themes) already live in GameSettings / LOCKED_PRESET and
 * already restore through Settings' RESET row. What is missing is
 * (a) a persisted active-menu-config field in the store holding a
 * menu definition like this one, (b) MAIN_MENU reading that field
 * instead of importing this constant directly, and (c) a Settings
 * row that writes this locked definition into the store. Until that
 * follow-up lands, do NOT claim a Settings-selectable full restore
 * exists: the default code path renders this locked data, which is
 * a restore point in code, not yet a selectable snapshot.
 */
import { MAIN_MENU_SYMBOLS, type MainMenuSymbol } from "./mainMenuSymbols";

export type LockedV32Panel = {
  key: "CONTINUE" | "NEW GAME" | "SETTINGS" | "BACK TO TITLE";
  x: number;
  y: number;
  w: number;
  h: number;
  gradientTop: string;
  gradientBottom: string;
  labelSize: number;
};

export const LOCKED_V32_MENU = {
  canvas: { w: 1200, h: 1500, centreX: 600 },
  // Logo stays the image, never font text. OFFICIAL = Mars's upload
  // (src/assets/ui/mochiichao-main-logo.png, imported by the renderer).
  logo: { image: "OFFICIAL" as const, x: 150, y: 180, w: 900 },
  cloud: { x: 250, y: 648, w: 700, h: 180, centre: { x: 600, y: 738 }, bobAmp: 6, bobPeriod: 5 },
  mochii: { x: 170, y: 790, w: 110, h: 110, bobAmp: 8, bobPeriod: 4.5 },
  panels: [
    { key: "CONTINUE", x: 300, y: 788, w: 600, h: 110, gradientTop: "#f9a8d4", gradientBottom: "#f472b6", labelSize: 34 },
    { key: "NEW GAME", x: 300, y: 918, w: 600, h: 70, gradientTop: "#fde68a", gradientBottom: "#facc15", labelSize: 32 },
    { key: "SETTINGS", x: 300, y: 1008, w: 600, h: 70, gradientTop: "#93c5fd", gradientBottom: "#60a5fa", labelSize: 32 },
    { key: "BACK TO TITLE", x: 300, y: 1098, w: 600, h: 70, gradientTop: "#86efac", gradientBottom: "#4ade80", labelSize: 32 },
  ] as LockedV32Panel[],
  panelStyle: { borderRadius: 28, borderWidth: 3, selectedBorderWidth: 4, selectedBorderColor: "#fbbf24" },
  background: {
    type: "layered-animated" as const,
    paper: "#ffffff",
    // Rainbow arcs: SVG ellipses centred (600,454), palette sampled
    // from the v32 art's top band. This is NOT the old flat PNG.
    arcs: {
      centre: { x: 600, y: 454 },
      rx: [300, 345, 390, 435, 480, 525, 570],
      ryRatio: 0.76,
      colors: ["#c8aaff", "#8cd2ff", "#a0e6b4", "#ffe696", "#ffc27a", "#f9a8d4", "#d8c8ff"],
      strokeWidth: 5,
      orbits: [
        { rx: 570, ry: 300, color: "#8cd2ff", rotate: -14 },
        { rx: 560, ry: 310, color: "#f9a8d4", rotate: 10 },
      ],
    },
    // Confetti symbols: positions/sizes/colours extracted from the
    // v32 reference picture's visible areas (see mainMenuSymbols.ts).
    symbols: MAIN_MENU_SYMBOLS,
    // Locked phi fade + flow animation (menu-background-animation-spec.md).
    fade: { gone: 620, mid: 729, full: 905 },
    animation: { riseVyMin: 8, riseVyMax: 14, swayMin: 3, swayMax: 8, rotateDeg: 4, periodSec: [4, 5, 6] },
  },
} as const;

export type LockedV32Menu = typeof LOCKED_V32_MENU;
export type { MainMenuSymbol };
