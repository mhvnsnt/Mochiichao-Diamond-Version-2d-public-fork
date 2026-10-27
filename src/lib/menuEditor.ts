/**
 * Menu Editor — the working menu as data (Mars, 2026-10-26 19:59 CDT,
 * expanded 20:32 + 20:34 CDT).
 *
 * What this is: the WHOLE editable menu (main menu + title slots +
 * pause menu + Mochioteka look) as one data object the game loads.
 * Editing NEVER overwrites the locked v32 default: LOCKED_V32_MENU
 * stays a constant, and this module only ever reads it to build
 * the starting draft. An edit lives in the WORKING preset
 * (localStorage, named) until Mars locks a version himself — only
 * a lock makes a preset the default, and no lock is performed here.
 *
 * Pokemon structure first (see docs/menu-editor-trace-20261026.md):
 * FireRed option_menu.c is a dedicated full screen with a header
 * window, a list window (label left / value right), a help bar,
 * UP/DOWN cursor wrap, LEFT/RIGHT value cycling, and CANCEL =
 * save + exit. The editor keeps that ROW structure inside its
 * panels; Mars's 20:32 CDT call adds the Mochiichao panel form on
 * top: submenu panels are movable, draggable, and minimizable
 * layers over a LIVE preview of the menu being edited. The game
 * menus themselves stay full screens — the draggable layers are
 * the editor tool's own pattern, asked for by Mars in his own
 * words, not a change to how the game menus render.
 *
 * Live preview: the editor preview renders FROM the unsaved draft,
 * so every change shows immediately. Saving writes the draft to
 * the working preset; the real main menu reads the working preset
 * on its next render (getActiveMenuConfig), so SAVE + BACK shows
 * the change on the real menu with no reload.
 *
 * Guards: logo stays the PNG image, never font text. The original
 * puffy-cloud.svg is never edited here (only its frame box is).
 * The traced mochiichao-main-cloud-v32.svg is BANNED and appears
 * nowhere in this module. 0 file deletions anywhere in this PR.
 */
import { LOCKED_V32_MENU } from "./lockedV32Menu";
import { MAIN_MENU_SYMBOLS } from "./mainMenuSymbols";
import { PINNED_SUBTITLE_FONT } from "./fonts";

export type PanelKey = "CONTINUE" | "NEW GAME" | "SETTINGS" | "BACK TO TITLE";
export type LayerId = "arcs" | "symbols" | "emblems" | "logo" | "cloud" | "mochii" | "panels";
export type AnimSpeedId = "perfect" | "slow-rise";

export interface PanelCfg {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  labelSize: number;
}

export interface EmblemCfg {
  id: string;
  kind: "heart" | "star" | "circle";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  visible: boolean;
}

export interface MenuEditorConfig {
  name: string;
  savedAt: number;
  layers: Record<LayerId, { visible: boolean; order: number }>;
  logo: { x: number; y: number; w: number };
  cloud: {
    frameX: number;
    frameY: number;
    frameW: number;
    frameH: number;
    bobOn: boolean;
    bobAmp: number;
    bobPeriod: number;
  };
  mochii: { x: number; y: number; w: number; h: number; bobOn: boolean; bobAmp: number; bobPeriod: number };
  panels: Record<PanelKey, PanelCfg>;
  panelStyle: { borderRadius: number; borderWidth: number; panelFont: string };
  continueSublabel: string;
  symbols: {
    speed: AnimSpeedId;
    swayPx: number;
    swayCycles: number;
    bobPx: number;
    bobCycles: number;
    fieldLeft: number;
    fieldRight: number;
    count: number;
  };
  arcs: {
    cx: number;
    cy: number;
    radii: number[];
    colors: string[];
    stroke: number;
    orbitRx: number[];
    orbitRy: number[];
    orbitColors: string[];
  };
  fade: { gone: number; mid: number; full: number; paper: string };
  emblems: EmblemCfg[];
  title: {
    logoX: number;
    logoY: number;
    logoW: number;
    subX: number;
    subY: number;
    subW: number;
    subH: number;
    subText: string;
    /** 'pinned' = the pinned v32 subtitle stack (default, never
     *  changed on its own); any other value is a font id from
     *  fonts.ts that Mars picked himself in the editor. */
    subFont: string;
    pressY: number;
    pressText: string;
    pressBlink: boolean;
    hsX: number;
    hsY: number;
    hsW: number;
    hsVisible: boolean;
  };
  pause: {
    title: string;
    panelMaxW: number;
    gap: number;
    sparkles: boolean;
    order: string[];
    labels: Record<string, string>;
    help: Record<string, string>;
    visible: Record<string, boolean>;
  };
  mochioteka: {
    /** Look id from DEX_LOOKS below; 'current' = the shipped
     *  Mochiodex layout. Generation looks are added ONLY when
     *  their layout is verified from that generation's files. */
    look: string;
    listPct: number;
    portrait: number;
    detailPortrait: number;
    helpOn: boolean;
    accent: string;
  };
}

/** Pause menu item keys, in the order GameShell.tsx renders them. */
export const PAUSE_ITEM_KEYS = [
  "team", "shop", "bag", "pc", "dex", "garden", "ring", "arena",
  "creature", "cheats", "save", "loadsave", "quit", "back",
] as const;

const PAUSE_DEFAULT_LABELS: Record<string, string> = {
  team: "Team", shop: "Shop", bag: "Bag", pc: "PC Storage", dex: "Dex",
  garden: "Mainframe Gardens", ring: "Ring Capture", arena: "Arena Mode",
  creature: "Creature Mode", cheats: "Cheat Console", save: "Save Game",
  loadsave: "Load / Save Files", quit: "Quit to Title", back: "Back to Game",
};

const PAUSE_DEFAULT_HELP: Record<string, string> = {
  team: "View and manage your team.",
  shop: "Buy and sell items at the shop.",
  bag: "View your items, grouped by pocket.",
  pc: "Move Mochiichao between your team and PC storage.",
  dex: "Browse the Mochiichao Dex — discovered creatures and undiscovered slots.",
  garden: "Raise Mochiichao in the Mainframe Gardens.",
  ring: "Try the Ring Capture loop.",
  arena: "Battle in Arena Mode doubles.",
  creature: "Play as a Mochiichao in real time.",
  cheats: "Enter native cheat codes and save states.",
  save: "Save your current progress.",
  loadsave: "Open your save files.",
  quit: "Return to the title screen.",
  back: "Close the pause menu and keep playing.",
};

/**
 * Mochioteka looks. A look is a real layout: either the shipped
 * Mochiodex layout ('current') or a generation layout verified
 * from that generation's on-disk files (see
 * docs/menu-editor-trace-20261026.md + the Mochioteka research
 * file). Generation entries with status 'need' are NOT selectable
 * — they are listed so Mars can see what is still owed, and so no
 * generation look is ever guessed into the game.
 */
export interface DexLook {
  id: string;
  gen: string;
  name: string;
  source: string;
  status: "verified" | "need";
  listPct: number;
  portrait: number;
  detailPortrait: number;
  frame: string;
}

export const DEX_LOOKS: DexLook[] = [
  {
    id: "current", gen: "Mochiichao", name: "Mochiichao current",
    source: "src/components/views/DexView.tsx on main (PR #243)",
    status: "verified", listPct: 38, portrait: 48, detailPortrait: 128,
    frame: "game-panel",
  },
  {
    id: "gen1", gen: "Gen 1 (Red/Yellow)", name: "Red / Yellow list + frame",
    source: "decomps/pokered + pokeyellow engine/menus/pokedex.asm (ShowPokedexMenu / ShowPokedexData)",
    status: "verified", listPct: 100, portrait: 48, detailPortrait: 128,
    frame: "gen1-frame",
  },
  {
    id: "gen2", gen: "Gen 2 (Gold/Crystal)", name: "Gold / Crystal sidebar + action bar",
    source: "decomps/pokegold + pokecrystal engine/pokedex/pokedex.asm (Pokedex_InitMainScreen / InitDexEntryScreen)",
    status: "verified", listPct: 38, portrait: 48, detailPortrait: 128,
    frame: "gen2-sidebar",
  },
];

/** Generation looks that are NOT selectable yet, and why. Gen 3
 *  Ruby/Emerald: window-level layout verified (src/pokedex.c) but a
 *  pixel-faithful port needs a second pass. FireRed: dex-page pixel
 *  fields unquoted. Platinum/HeartGold: pixel fields unquoted
 *  (HeartGold names obfuscated). Black 2: list/detail pixels
 *  unquoted. Diamond: no dex UI file at all in the tree — a gap,
 *  never inferred from Platinum. */
export const DEX_LOOKS_NEEDED: { gen: string; why: string }[] = [
  { gen: "Gen 3 (Ruby/Emerald)", why: "Window layout verified in src/pokedex.c; pixel port needs a second pass." },
  { gen: "Gen 3 (FireRed/LeafGreen)", why: "Dex-page pixel fields unquoted (window printers, not one print function)." },
  { gen: "Gen 4 (Platinum)", why: "Screen set verified (infomain/formmain/crysub); pixel field positions unquoted." },
  { gen: "Gen 4 (HeartGold)", why: "App/data verified; function names obfuscated (ov18_…), field positions unquoted." },
  { gen: "Gen 5 (Black 2/White 2)", why: "Detail pages INFO/MAP/VOICE/FORM verified; list/detail pixels unquoted." },
  { gen: "Gen 4 (Diamond)", why: "GAP — no dex UI file in the tree; start_menu.h is a TODO stub." },
];

export function dexLookById(id: string): DexLook {
  return DEX_LOOKS.find((l) => l.id === id) || DEX_LOOKS[0];
}

/** Symbol field span actually shipped (measured set, 285 symbols). */
export function symbolFieldSpan(): { left: number; right: number } {
  let left = Infinity;
  let right = -Infinity;
  for (const s of MAIN_MENU_SYMBOLS as { x: number }[]) {
    if (s.x < left) left = s.x;
    if (s.x > right) right = s.x;
  }
  return { left: Math.floor(left), right: Math.ceil(right) };
}

/**
 * The locked default as an editor config. Built LIVE from
 * LOCKED_V32_MENU (never a stale copy) so a later locked change
 * (e.g. the cloud frame fix, PR #233's imgBox) flows into the
 * editor default automatically. The cloud frame default is the
 * RENDER box: imgBox when the locked data carries one, else the
 * visible cloud box.
 */
export function lockedMenuEditorConfig(): MenuEditorConfig {
  const L = LOCKED_V32_MENU;
  const lockedCloud = L.cloud as typeof L.cloud & {
    imgBox?: { x: number; y: number; w: number; h: number };
  };
  const frame = lockedCloud.imgBox || {
    x: L.cloud.x, y: L.cloud.y, w: L.cloud.w, h: L.cloud.h,
  };
  const span = symbolFieldSpan();
  const panels = {} as Record<PanelKey, PanelCfg>;
  for (const p of L.panels) {
    panels[p.key] = {
      label: p.key === "BACK TO TITLE" ? "◄ BACK TO TITLE (B)" : p.key,
      x: p.x, y: p.y, w: p.w, h: p.h, fill: p.fill, labelSize: p.labelSize,
    };
  }
  return {
    name: "Locked Default (v32)",
    savedAt: 0,
    layers: {
      arcs: { visible: true, order: 1 },
      symbols: { visible: true, order: 2 },
      emblems: { visible: true, order: 3 },
      logo: { visible: true, order: 4 },
      cloud: { visible: true, order: 5 },
      mochii: { visible: true, order: 6 },
      panels: { visible: true, order: 7 },
    },
    logo: { x: L.logo.x, y: L.logo.y, w: L.logo.w },
    cloud: {
      frameX: frame.x, frameY: frame.y, frameW: frame.w, frameH: frame.h,
      bobOn: true, bobAmp: L.cloud.bobAmp, bobPeriod: L.cloud.bobPeriod,
    },
    mochii: {
      x: L.mochii.x, y: L.mochii.y, w: L.mochii.w, h: L.mochii.h,
      bobOn: true, bobAmp: L.mochii.bobAmp, bobPeriod: L.mochii.bobPeriod,
    },
    panels,
    panelStyle: {
      borderRadius: L.panelStyle.borderRadius,
      borderWidth: L.panelStyle.borderWidth,
      panelFont: "locked",
    },
    continueSublabel: "Player • Roster • Dojos • CR • Last: Core Fragment",
    symbols: {
      speed: "perfect",
      swayPx: 6, swayCycles: 2, bobPx: 4, bobCycles: 2,
      fieldLeft: span.left, fieldRight: span.right,
      count: (MAIN_MENU_SYMBOLS as unknown[]).length,
    },
    arcs: {
      cx: L.background.arcs.centre.x, cy: L.background.arcs.centre.y,
      radii: [...L.background.arcs.rx], colors: [...L.background.arcs.colors],
      stroke: L.background.arcs.strokeWidth,
      orbitRx: L.background.arcs.orbits.map((o) => o.rx),
      orbitRy: L.background.arcs.orbits.map((o) => o.ry),
      orbitColors: L.background.arcs.orbits.map((o) => o.color),
    },
    fade: {
      gone: L.background.fade.gone, mid: L.background.fade.mid,
      full: L.background.fade.full, paper: L.background.paper,
    },
    // Logo emblems from the v32 picture (PR #214's restoration
    // numbers, pending the hearts job's exact-layer call — the
    // editor's layer ORDER row is how Mars moves them himself).
    // Top sparkle default ON (v32 picture has it); Mars's
    // picture-vs-proof call on it is still open, and OFF is one
    // toggle in the editor.
    emblems: [
      { id: "heart-blue", kind: "heart", x: 169, y: 405, w: 63, h: 51, color: "#8cd2ff", visible: true },
      { id: "heart-pink", kind: "heart", x: 230, y: 637, w: 53, h: 37, color: "#ff96c8", visible: true },
      { id: "star-top", kind: "star", x: 600, y: 194, w: 41, h: 41, color: "#000000", visible: true },
      { id: "star-left", kind: "star", x: 139, y: 533, w: 45, h: 45, color: "#000000", visible: true },
      { id: "star-right", kind: "star", x: 1059, y: 533, w: 53, h: 53, color: "#000000", visible: true },
      { id: "circle-pink", kind: "circle", x: 1054, y: 412, w: 46, h: 46, color: "#ff96c8", visible: true },
    ],
    title: {
      logoX: 150, logoY: 185, logoW: 900,
      subX: 322, subY: 698, subW: 556, subH: 74,
      subText: "✦ DIAMOND VERSION ✦", subFont: "pinned",
      pressY: 905, pressText: "PRESS ANY KEY", pressBlink: true,
      hsX: 322, hsY: 944, hsW: 556, hsVisible: true,
    },
    pause: {
      title: "Paused", panelMaxW: 384, gap: 12, sparkles: true,
      order: [...PAUSE_ITEM_KEYS],
      labels: { ...PAUSE_DEFAULT_LABELS },
      help: { ...PAUSE_DEFAULT_HELP },
      visible: Object.fromEntries(PAUSE_ITEM_KEYS.map((k) => [k, true])),
    },
    mochioteka: {
      look: "current", listPct: 38, portrait: 48, detailPortrait: 128,
      helpOn: true, accent: "#facc15",
    },
  };
}

/** Subtitle font stack actually used for a config's subtitle. */
export function subtitleFontStack(cfg: MenuEditorConfig): string {
  if (cfg.title.subFont === "pinned") return PINNED_SUBTITLE_FONT;
  return cfg.title.subFont;
}

/* ------------------------------------------------------------------ */
/* Working preset + library persistence (own keys, same pattern as
 * menuCustom's standalone store; never touches LOCKED_PRESET).     */
/* ------------------------------------------------------------------ */

const WORKING_KEY = "mochiichao_menu_editor_working_v1";
const LIBRARY_KEY = "mochiichao_menu_editor_library_v1";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function loadWorkingConfig(): MenuEditorConfig | null {
  try {
    const raw = localStorage.getItem(WORKING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MenuEditorConfig>;
    const base = lockedMenuEditorConfig();
    return { ...base, ...parsed, name: parsed.name || "Working Preset" };
  } catch {
    return null;
  }
}

export function saveWorkingConfig(cfg: MenuEditorConfig): void {
  try {
    localStorage.setItem(WORKING_KEY, JSON.stringify({ ...cfg, savedAt: Date.now() }));
  } catch {
    // Session-only fallback, same as persistSettings: nothing erased.
  }
}

/** The config the real menu renders: working preset if one was
 *  ever saved, else the locked default exactly. */
export function getActiveMenuConfig(): MenuEditorConfig {
  return loadWorkingConfig() || lockedMenuEditorConfig();
}

export type LibraryKind = "template" | "theme" | "layer" | "background";

export interface LibraryItem {
  id: string;
  kind: LibraryKind;
  name: string;
  savedAt: number;
  data: unknown;
}

export function loadLibrary(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LibraryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: LibraryItem[]): void {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
  } catch {
    // Session-only fallback: nothing erased.
  }
}

export function addLibraryItem(kind: LibraryKind, name: string, data: unknown): LibraryItem {
  const item: LibraryItem = {
    id: `${kind}-${Date.now()}`,
    kind, name: name || `${kind} ${new Date().toLocaleString()}`,
    savedAt: Date.now(), data,
  };
  const items = [...loadLibrary(), item];
  saveLibrary(items);
  return item;
}

export function deleteLibraryItem(id: string): void {
  saveLibrary(loadLibrary().filter((i) => i.id !== id));
}

/** Theme = colours + fonts snapshot (no geometry). */
export interface ThemeData {
  panelFills: Record<string, string>;
  panelStyle: { borderRadius: number; borderWidth: number };
  arcsColors: string[];
  orbitColors: string[];
  paper: string;
  fonts: Record<string, string>;
}

export function themeFromConfig(cfg: MenuEditorConfig, fonts: Record<string, string>): ThemeData {
  const fills: Record<string, string> = {};
  for (const k of Object.keys(cfg.panels)) fills[k] = cfg.panels[k as PanelKey].fill;
  return {
    panelFills: fills,
    panelStyle: { borderRadius: cfg.panelStyle.borderRadius, borderWidth: cfg.panelStyle.borderWidth },
    arcsColors: [...cfg.arcs.colors],
    orbitColors: [...cfg.arcs.orbitColors],
    paper: cfg.fade.paper,
    fonts: { ...fonts },
  };
}

export function applyTheme(draft: MenuEditorConfig, theme: ThemeData): MenuEditorConfig {
  const next = clone(draft);
  for (const k of Object.keys(theme.panelFills)) {
    if (next.panels[k as PanelKey]) next.panels[k as PanelKey].fill = theme.panelFills[k];
  }
  next.panelStyle.borderRadius = theme.panelStyle.borderRadius;
  next.panelStyle.borderWidth = theme.panelStyle.borderWidth;
  next.arcs.colors = [...theme.arcsColors];
  next.arcs.orbitColors = [...theme.orbitColors];
  next.fade.paper = theme.paper;
  return next;
}

/** One layer's slice of a config, for per-layer save/load. */
export function layerSlice(cfg: MenuEditorConfig, layer: LayerId): unknown {
  switch (layer) {
    case "arcs": return clone(cfg.arcs);
    case "symbols": return clone(cfg.symbols);
    case "emblems": return clone(cfg.emblems);
    case "logo": return clone(cfg.logo);
    case "cloud": return clone(cfg.cloud);
    case "mochii": return clone(cfg.mochii);
    case "panels": return clone({ panels: cfg.panels, panelStyle: cfg.panelStyle });
  }
}

export function applyLayerSlice(draft: MenuEditorConfig, layer: LayerId, slice: unknown): MenuEditorConfig {
  const next = clone(draft);
  const s = slice as Record<string, unknown>;
  if (!s || typeof s !== "object") return next;
  switch (layer) {
    case "arcs": next.arcs = s as MenuEditorConfig["arcs"]; break;
    case "symbols": next.symbols = s as MenuEditorConfig["symbols"]; break;
    case "emblems": next.emblems = s as unknown as MenuEditorConfig["emblems"]; break;
    case "logo": next.logo = s as MenuEditorConfig["logo"]; break;
    case "cloud": next.cloud = s as MenuEditorConfig["cloud"]; break;
    case "mochii": next.mochii = s as MenuEditorConfig["mochii"]; break;
    case "panels": {
      const p = s as { panels: MenuEditorConfig["panels"]; panelStyle: MenuEditorConfig["panelStyle"] };
      if (p.panels) next.panels = p.panels;
      if (p.panelStyle) next.panelStyle = p.panelStyle;
      break;
    }
  }
  return next;
}

/** Background slice = arcs + fade + paper (a reusable background). */
export function backgroundSlice(cfg: MenuEditorConfig): unknown {
  return clone({ arcs: cfg.arcs, fade: cfg.fade });
}

export function applyBackgroundSlice(draft: MenuEditorConfig, slice: unknown): MenuEditorConfig {
  const next = clone(draft);
  const s = slice as { arcs?: MenuEditorConfig["arcs"]; fade?: MenuEditorConfig["fade"] };
  if (s?.arcs) next.arcs = s.arcs;
  if (s?.fade) next.fade = s.fade;
  return next;
}

/** Symbols after the editor's field-span remap + count sampling.
 *  Shared by the live menu background, the editor preview, and the
 *  canvas export, so all three show the same field. Count sampling
 *  strides evenly through the field (never just the first N) so a
 *  lower count still reads as the same field, thinner. */
export function transformSymbols<T extends { x: number }>(
  symbols: T[], fieldLeft: number, fieldRight: number, count: number,
): T[] {
  const xs = symbols.map((s) => s.x);
  const origLeft = Math.min(...xs);
  const origRight = Math.max(...xs);
  const origSpan = Math.max(1, origRight - origLeft);
  const newSpan = Math.max(1, fieldRight - fieldLeft);
  const remapped = symbols.map((s) => ({
    ...s,
    x: fieldLeft + ((s.x - origLeft) / origSpan) * newSpan,
  }));
  const n = Math.max(0, Math.min(remapped.length, Math.floor(count)));
  if (n >= remapped.length) return remapped;
  if (n === 0) return [];
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(remapped[Math.floor((i * remapped.length) / n)]);
  return out;
}

/** Validate an imported library/preset JSON blob. Throws on bad shape. */
export function parseLibraryJson(text: string): LibraryItem {
  const parsed = JSON.parse(text) as Partial<LibraryItem>;
  if (!parsed || typeof parsed !== "object") throw new Error("Not a JSON object.");
  if (parsed.kind !== "template" && parsed.kind !== "theme" && parsed.kind !== "layer" && parsed.kind !== "background") {
    throw new Error("Kind must be template, theme, layer, or background.");
  }
  if (typeof parsed.name !== "string" || !parsed.name) throw new Error("Missing name.");
  if (parsed.data === undefined || parsed.data === null || typeof parsed.data !== "object") {
    throw new Error("Missing data object.");
  }
  return {
    id: typeof parsed.id === "string" ? parsed.id : `${parsed.kind}-${Date.now()}`,
    kind: parsed.kind, name: parsed.name,
    savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : Date.now(),
    data: parsed.data,
  };
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
