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
  // Flat fills sampled from the locked picture's panel centres
  // (2026-10-26 trace). The picture has NO gradients; the gradients
  // in PR #163 were invented by the restoration, not locked.
  fill: string;
  labelSize: number;
};

export type MenuAnimationSpeed =
  | {
      id: "perfect";
      // Matched GIF, Mars PERFECT 2026-10-25 17:12 CDT: 80 frames x
      // 70ms = 5.6s loop, drift 5.5px/frame half scale = 11px/frame
      // full scale = 157.14 px/s, sway sin*3 half = 6px full,
      // bob sin*2 half = 4px full, 2 cycles per loop.
      risePxPerSec: number;
      swayPx: number;
      bobPx: number;
      loopSec: number;
      cyclesPerLoop: number;
      rotateDeg: number;
    }
  | {
      id: "slow-rise";
      // PR #163 speed, SAVED AS AN OPTION (Mars, 2026-10-26 10:54
      // CDT: the really slow speed might be wanted later). Exact
      // PR #163 numbers. Descriptive name only — Mars did not name
      // it. Option only, NEVER the default.
      riseVyMin: number;
      riseVyMax: number;
      swayMin: number;
      swayMax: number;
      rotateDeg: number;
      periodSec: number[];
    };

export const MENU_ANIMATION_SPEEDS = {
  perfect: {
    id: "perfect",
    risePxPerSec: 157.14,
    swayPx: 6,
    bobPx: 4,
    loopSec: 5.6,
    cyclesPerLoop: 2,
    rotateDeg: 0,
  },
  "slow-rise": {
    id: "slow-rise",
    riseVyMin: 8,
    riseVyMax: 14,
    swayMin: 3,
    swayMax: 8,
    rotateDeg: 4,
    periodSec: [4, 5, 6],
  },
} as const;

export const LOCKED_V32_MENU = {
  canvas: { w: 1200, h: 1500, centreX: 600 },
  // Logo stays the image, never font text. MAIN MENU logo (orbitfix,
  // 2026-10-26) = src/assets/ui/mochiichao-main-logo-v32-orbitfix-20261026.png:
  // Mars's upload letters, keyed from black, with the v32 picture's
  // own geometry -- thick black outline (dilate 10px), thick black
  // orbit ring (centre (619,472), a=425, b=186, stroke 30, thin white
  // centre line), sparkle stars. Section-O fix (2026-10-26): the
  // round-2 ring (618,500,440,200) was re-fitted from clean strips
  // and corrected to the values above. The previous build's keyed upload
  // (src/assets/ui/mochiichao-main-logo.png: thin white orbit, no
  // outline) vanishes on the white menu -- that is what Mars
  // rejected on his phone 2026-10-26 12:38 CDT, and it is NOT reused
  // for the main menu. TITLE keeps the original upload import
  // (IntroSequence line ~390, dark title background, where the thin
  // white orbit reads correctly); only the MAIN_MENU slot uses the
  // v32-matched asset. Asset canvas 900x548 = this slot exactly.
  logo: { image: "V32_MATCHED" as const, x: 150, y: 180, w: 900 },
  cloud: { x: 250, y: 648, w: 700, h: 180, centre: { x: 600, y: 738 }, bobAmp: 6, bobPeriod: 5 },
  mochii: { x: 170, y: 790, w: 110, h: 110, bobAmp: 8, bobPeriod: 4.5 },
  panels: [
    { key: "CONTINUE", x: 300, y: 788, w: 600, h: 110, fill: "#ff96c8", labelSize: 34 },
    { key: "NEW GAME", x: 300, y: 918, w: 600, h: 70, fill: "#ffe696", labelSize: 32 },
    { key: "SETTINGS", x: 300, y: 1008, w: 600, h: 70, fill: "#8cd2ff", labelSize: 32 },
    { key: "BACK TO TITLE", x: 300, y: 1098, w: 600, h: 70, fill: "#a0e6b4", labelSize: 32 },
  ] as LockedV32Panel[],
  // Picture panel labels: upright bold sans, NOT the slanted Yagiza
  // that var(--menu-font) gives by default. CONTINUE/SETTINGS (and
  // the CONTINUE sublabel) carry a thin white halo in the picture.
  // The MENU FONT Settings row itself is untouched — other menus
  // and creator presets still use it; only the LOCKED default
  // panels use the picture label style, because Mars's 2026-10-26
  // order is to match the perfect picture exactly.
  panelLabel: {
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    fontWeight: 800,
    fontStyle: "normal" as const,
    strokeLabels: ["CONTINUE", "SETTINGS"] as const,
    labelStrokePx: 2,
    sublabelStrokePx: 1,
  },
  panelStyle: { borderRadius: 28, borderWidth: 3 },
  background: {
    type: "layered-animated" as const,
    paper: "#ffffff",
    // Rainbow arcs: MEASURED from the v32 picture (round 2,
    // 2026-10-26), correcting the PR #170 ellipses. The picture's
    // arcs are concentric CIRCLES centred (600,454), not ellipses:
    // exact-colour side-region pixels give single radii with std
    // 2.0px (purple 437, mint 381, yellow 353; blue 411 after
    // removing the tilted-orbit pixels; orange 325 on a radial ray).
    // Colour order runs outward purple -> blue -> mint -> yellow ->
    // orange (the old list had it reversed and added two circles,
    // pink and lavender, that are not in the picture). The two
    // tilted orbits were also wrong: fitted unrotated ellipses
    // (blue a=515, b=265; pink a=475, b=230, both centre (600,454))
    // match 83-90% of their exact-colour pixels within 5%, while
    // the old rotated orbits matched 7-13%. Stroke 5 kept (picture
    // strokes ~5-7px effective with anti-aliasing).
    arcs: {
      centre: { x: 600, y: 454 },
      rx: [325, 353, 381, 411, 437],
      ryRatio: 1.0,
      colors: ["#ffc27a", "#ffe696", "#a0e6b4", "#8cd2ff", "#c8aaff"],
      strokeWidth: 5,
      orbits: [
        { rx: 515, ry: 265, color: "#8cd2ff", rotate: 0 },
        { rx: 475, ry: 230, color: "#ff96c8", rotate: 0 },
      ],
    },
    // Confetti symbols: the MEASURED field (round 2, 2026-10-26,
    // see mainMenuSymbols.ts). 285 symbols measured from the
    // matched GIF; history's field is 300, so the shortfall is
    // 15 = 5.0%, named in that file and in the PR body, NOT filled
    // with generated guesses (the PR #170 generated fill is what
    // Mars rejected).
    symbols: MAIN_MENU_SYMBOLS,
    // Locked phi fade.
    fade: { gone: 620, mid: 729, full: 905 },
    // Symbol speed, selectable. 'perfect' is the DEFAULT (matched
    // GIF, Mars PERFECT 2026-10-25 17:12 CDT). 'slow-rise' is the
    // exact PR #163 speed, saved as an option only (Mars 2026-10-26
    // 10:54 CDT) — changing this field selects it; nothing else in
    // this file changes when it is selected. NOTE: the type is
    // deliberately the two-value union, NOT a single literal:
    // with a literal type the bundler tree-shakes the slow-rise
    // branch and data out of the build entirely, and the option
    // would not actually ship. Keep the union, and keep `as const`
    // off this object: the outer const assertion re-narrowed
    // animationSpeed back to the literal "perfect", and the second
    // build (2026-10-26) shipped slow-rise 0 times even after the
    // union was added. With the union preserved, MainMenuBackground
    // keeps both branches.
    animationSpeed: "perfect" as "perfect" | "slow-rise",
    animationSpeeds: MENU_ANIMATION_SPEEDS,
  },
};

export type LockedV32Menu = typeof LOCKED_V32_MENU;
export type { MainMenuSymbol };
