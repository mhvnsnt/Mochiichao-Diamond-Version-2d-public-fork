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
  // Logo stays the image, never font text. MAIN MENU logo (round 2,
  // 2026-10-26) = src/assets/ui/mochiichao-main-logo-v32-matched.png:
  // Mars's upload letters, keyed from black, with the v32 picture's
  // own geometry -- thick black outline (dilate 10px), thick black
  // orbit ring (centre (618,500), a=440, b=200, stroke 30, thin white
  // centre line), sparkle stars. The previous build's keyed upload
  // (src/assets/ui/mochiichao-main-logo.png: thin white orbit, no
  // outline) vanishes on the white menu -- that is what Mars
  // rejected on his phone 2026-10-26 12:38 CDT, and it is NOT reused
  // for the main menu. TITLE keeps the original upload import
  // (IntroSequence line ~390, dark title background, where the thin
  // white orbit reads correctly); only the MAIN_MENU slot uses the
  // v32-matched asset. Asset canvas 900x548 = this slot exactly.
  logo: { image: "V32_MATCHED" as const, x: 150, y: 180, w: 900 },
  // Cloud VISIBLE-shape box (locked spec + v21 step): the visible cloud
  // shape spans x250-950, y648-828, centre (600,738), 700x180.
  // imgBox is the element box that puts the ORIGINAL puffy-cloud.svg
  // visible path exactly on that box. The file's visible path fills only
  // 88.3% of its viewBox width (path x10-540 of 600) and 73.2% of its
  // height (path y40-245 of 280), so rendering it fill into the 700x180
  // box showed a 341-wide cloud centred at x583, 132 tall — 17px left
  // and 48px short (measured in render, not from the box).
  // TWO measured rendering facts (Chrome, verified in a standalone
  // render of this exact element AND in the menu render, which agree):
  // (1) a plain <img> applies the SVG's default meet inside the box and
  // letterboxes the viewBox (imgBox 792x246 alone landed 378-844 wide,
  // not 250-950); (2) an <svg><image preserveAspectRatio="none">
  // does NOT stretch to the frame either — it renders the content at
  // 0.851 x frame width, centred 0.044 x frame width LEFT of the frame
  // centre, 0.671 x frame height tall, top at 0.191 x frame height
  // (measured: 674-wide content in a 792 frame, stroke 260-934 in the
  // menu, centre 597 — centred right but 25px narrow).
  // imgBox (225,599,823x258) is therefore the CALIBRATED frame that
  // lands the content on the locked box under fact (2):
  // width 823 x 0.851 = 700, centre 636.5 - 0.044 x 823 = 600,
  // height 258 x 0.671 = 173, top 599 + 0.191 x 258 = 648.
  // SHAPE TRANSFORM, NOT A REDRAW (Mars 2026-10-26 18:13 CDT): the file
  // is untouched; only its rendered scale/position change.
  // File untouched. BANNED / DO NOT USE: mochiichao-main-cloud-v32.svg
  // (the #184 trace) — deleted from main by Mars's order 2026-10-26;
  // it is NOT the cloud file and must never be rendered again.
  // EXACT-TARGET RETUNE (2026-10-26, Mars 19:57 CDT bar: the corrected
  // cloud must look like the TARGET panel EXACTLY, not close, not
  // 99.9%): the fixed3 frame above landed interior 258-942 x 653-811
  // in the app render and 258-942 x 654-816 for the isolated element
  // — both short of target interior 257-942 x 655-815. DECOMP CHECK
  // FIRST (Pokemon-first, FireRed then HeartGold then Black 2): NO
  // decomp pins a menu-cloud placement for this element — FireRed
  // title_screen.c has flame/leaf/slash sprites + background bitmaps
  // (no cloud sprite), main_menu.c has text window templates (no
  // cloud), HeartGold title_screen.c has zero 'cloud' matches (3D
  // scene; any clouds are baked into model/texture assets), Black 2
  // src has no title/menu cloud placement. The 250-950 x 648-828 box
  // is the Mochiichao v21 spec value, NOT a decomp value — stated
  // plainly. So the frame below is tuned by isolated-element
  // measurement (same white-interior flood method that reproduces
  // the picture's target interior 257-942 x 655-815 exactly as the
  // largest enclosed component): frame (224,601,825x254) renders
  // isolated interior 257-942 x 655-815 (685x160) — all four edges
  // EXACT, stroke 249-951 x 649-820 (within 1px of the picture's
  // stroke on every edge; that 1px is edge-threshold, not shape —
  // same file, same stretch mode, same shape).
  // APP CORRECTION (2026-10-26, measured in the true 1200x1500 app
  // render): the isolated rig's interior bottom (815) is the CENTRE
  // bottom, which the CONTINUE panel hides in the game — so in the
  // app the visible interior bottom is the LOBES, and the picture's
  // lobes sit 6px lower than the element's (picture right-lobe stroke
  // 819 vs element 813, left 813 vs ~807; app right-lobe stroke
  // measured IDENTICAL to isolated, 813, same taper — so the app
  // element is exact and the picture's cloud is a uniform vertical
  // stretch x1.039 about the top: interior height 160 vs 154,
  // (819-649)/(813-649) = 1.037). Frame (224,599,825x264) applies
  // that stretch in the app: predicted interior 257-942 x 655-815,
  // right-lobe stroke ~819, left-lobe stroke ~813, top/left/right
  // unchanged (width unchanged, top re-anchored: 599 + 0.191x264).
  // Verified by app re-render + measurement, not by the isolated
  // rig alone.
  cloud: { x: 250, y: 648, w: 700, h: 180, centre: { x: 600, y: 738 }, bobAmp: 6, bobPeriod: 5, imgBox: { x: 224, y: 599, w: 825, h: 264 } },
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
    // Symbol speed, selectable. 'slow-rise' is the DEFAULT from
    // Mars's 2026-10-26 19:54 CDT order (the rising emblems moved
    // too fast; use the slow speed locked earlier today). 'slow-rise'
    // is the exact PR #163 speed (rise vy 8-14 px/s, sway 3-8px,
    // rotate +/-4deg, period 4-6s; saved as an option Mars
    // 2026-10-26 10:54 CDT, made the default by his 19:54 CDT order).
    // 'perfect' (matched GIF, Mars PERFECT 2026-10-25 17:12 CDT:
    // 157.14 px/s) is kept as the option — changing this field
    // selects it; nothing else in this file changes when it is
    // selected. NOTE: the type is deliberately the two-value union,
    // NOT a single literal: with a literal type the bundler
    // tree-shakes the slow-rise branch and data out of the build
    // entirely, and the option would not actually ship. Keep the
    // union, and keep `as const` off this object: the outer const
    // assertion re-narrowed animationSpeed back to the literal
    // "perfect", and the second build (2026-10-26) shipped slow-rise
    // 0 times even after the union was added. With the union
    // preserved, MainMenuBackground keeps both branches.
    animationSpeed: "slow-rise" as "perfect" | "slow-rise",
    animationSpeeds: MENU_ANIMATION_SPEEDS,
    // Logo hearts (Mars 2026-10-26 19:54 CDT: blue + pink hearts by the
    // logo at their exact yesterday placements, on their exact layer).
    // MEASURED from the v32 picture (not copied from PR #214): blue
    // visible bbox 138-200 x 397-446 (centre (169,421.5), 63x50, fill
    // #8cd2ff); pink visible bbox 204-256 x 621-660 (centre (230,640.5),
    // 53x40, fill #ff96c8). PR #214's numbers were off: blue y 405 was
    // 16.5px too high (its own comment admits the crop bbox merged
    // with the arc below), pink y 637 was 3.5px high and h 37 was 3px
    // short, colours #95cbfe/#fe95c7 vs picture fills #8cd2ff/#ff96c8.
    // Centres/sizes below are the picture measurements. Layer (v28,
    // Mars direction): white -> background symbols -> arcs/circles/
    // hearts -> logo -> cloud -> panels; rendered last in
    // MainMenuBackground's SVG (above arcs + symbols, below logo),
    // static, full opacity (the pink heart sits at y640 inside the
    // fade band but is SOLID in the picture, so no fade applies).
    logoHearts: [
      { x: 169, y: 421.5, w: 63, h: 50, c: "#8cd2ff" },
      { x: 230, y: 640.5, w: 53, h: 40, c: "#ff96c8" },
    ],
  },
};

export type LockedV32Menu = typeof LOCKED_V32_MENU;
export type { MainMenuSymbol };
