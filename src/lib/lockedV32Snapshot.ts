/**
 * Locked v32 FULL SNAPSHOT — a persisted, loadable preset (2026-10-27).
 *
 * The true-restore definition: a preset stored as data the game loads
 * that restores ALL of the locked main menu + the settings around it
 * in one selectable step, with a real change-away path (change any
 * row, save, and the snapshot is no longer active; restore again any
 * time). This module is that preset for main. It builds LIVE from
 * src/lib/lockedV32Menu.ts, so it can never go stale against the
 * locked default, and the locked default itself is NEVER
 * overwritten — restore only ever writes the snapshot store + the
 * ordinary settings stores below + clears the editor working
 * preset (see (g)).
 *
 * RENDER-PATH COMPOSITION (current main, after the Menu Editor
 * merged): IntroSequence + MainMenuBackground render menuCfg =
 * getActiveMenuConfig() — the editor working preset when one was
 * saved, else the locked default built live from LOCKED_V32_MENU.
 * This module deliberately does NOT re-route Intro/MMB to read the
 * snapshot JSON instead: that would fight the editor (its edited
 * panel/font/layer values must survive until a restore). Restore
 * clears the editor working preset (g), so menuCfg returns the
 * locked default exactly, and the main menu renders locked values
 * on return. The snapshot JSON is the persisted preset record and
 * the row's active-state source; getActiveV32Menu() is its loadable
 * accessor, verified deep-equal to LOCKED_V32_MENU. The old RESET
 * row does NOT clear the working preset, so after editor edits
 * even RESET leaves the edited menu on screen — this row is the
 * one that actually restores it.
 *
 * What one restore writes, atomically from the caller's point of
 * view (restoreLockedV32Snapshot):
 *   (a) this snapshot as JSON under ACTIVE_KEY — the loadable preset
 *       the game reads back via getActiveV32Menu();
 *   (b) DEFAULT_SETTINGS via persistSettings (gameSettings store);
 *   (c) DEFAULT_MENU_CUSTOM via persistMenuCustom (menuCustom store);
 *   (d) LOCKED_PRESET via savePresets (preset store);
 *   (e) title-start-screen pick cleared (null = locked default);
 *   (f) the animation-speed override key removed, so the LOCKED
 *       speed applies (slow-rise on current main, Mars's 2026-10-26
 *       19:54 CDT order; perfect is kept as the option, not the
 *       default) — never a stale override, never a re-decision;
 *   (g) the Menu Editor working preset cleared (its localStorage
 *       key removed), so menuCfg returns the locked default. The
 *       editor LIBRARY (saved named templates) is NOT touched —
 *       only the current working state is cleared.
 * The Settings screen's RESTORE LOCKED V32 row mirrors the same
 * values into zustand state + live CSS/font/sound application, so
 * the row shows LOCKED v32 ACTIVE immediately and the main menu
 * renders the snapshot on return (live-on-return, same pattern as
 * every other Settings row).
 *
 * Change-away path: any Settings / Menu Creator row edited and
 * saved writes a value that differs from the snapshot, and
 * isLockedV32SnapshotActive() then returns false (it compares the
 * live stores against the stored snapshot); saving a Menu Editor
 * working preset likewise flips it to false (a working preset is
 * present). Geometry CAN diverge on current main via the editor —
 * that is exactly why restore clears its working preset — and the
 * change-away set this snapshot covers is settings / custom /
 * fonts / title pick / speed / editor working, which the row
 * restores in one click.
 *
 * Honest scope limits (do NOT overclaim):
 *   - Symbol field is the locked FORMULA v2 field, 300 entries
 *     (the round-2 measured 285 set is SUPERSEDED — DO NOT USE —
 *     by Mars's 2026-10-26 14:18 CDT order; the snapshot follows
 *     the live locked field, it does not re-decide it).
 *   - TITLE-phase slots (subtitle, press, Heavensent) are NOT in
 *     this snapshot: only the title-start-screen PICK is cleared.
 *     The title scene itself is untouched.
 *   - Pause menu / Mochioteka layouts are NOT in this snapshot:
 *     they belong to the editor config, not to the locked
 *     main-menu spec this item covers. The editor LIBRARY is
 *     likewise untouched by restore (only its working preset
 *     is cleared).
 *   - The logo stays the v32-matched PNG image, never font text;
 *     the cloud stays the original puffy-cloud.svg file, never a
 *     redrawn lookalike.
 */
import { LOCKED_V32_MENU, type LockedV32Menu } from "./lockedV32Menu";
import {
  DEFAULT_SETTINGS,
  LOCKED_PRESET,
  loadStoredSettings,
  persistSettings,
  savePresets,
  type GameSettings,
  type MenuPreset,
} from "./gameSettings";
import {
  DEFAULT_MENU_CUSTOM,
  loadMenuCustom,
  persistMenuCustom,
  type MenuCustomSettings,
} from "./menuCustom";
import {
  getSelectedTitleStartScreenId,
  setSelectedTitleStartScreenId,
} from "./titleStartScreens";

/** Own localStorage key for the active snapshot (not the editor's key). */
export const LOCKED_V32_SNAPSHOT_KEY = "mochiichao_locked_v32_snapshot_active_v1";
/** Animation-speed override key read by MainMenuBackground. */
export const MENU_ANIMATION_SPEED_KEY = "mochiichao-menu-animation-speed";
/**
 * Menu Editor working-preset key. Duplicated here on purpose with
 * its definition cited: menuEditor.ts WORKING_KEY (line ~368).
 * The editor exports no clear function, so restore removes the key
 * directly; the headless test proves the key matches by writing a
 * working preset through the editor's own saveWorkingConfig and
 * asserting restore clears it. The editor LIBRARY key is NOT
 * touched — only the current working state is cleared.
 */
export const MENU_EDITOR_WORKING_KEY = "mochiichao_menu_editor_working_v1";

export interface LockedV32Snapshot {
  id: "locked-v32";
  name: "Locked Default (v32)";
  /** Original cloud file only — never a redrawn lookalike. */
  cloudFile: "src/assets/ui/puffy-cloud.svg";
  /** V32-matched logo PNG — image only, never font text. */
  logoFile: "src/assets/ui/mochiichao-main-logo-v32-matched.png";
  menu: LockedV32Menu;
  settings: GameSettings;
  custom: MenuCustomSettings;
  preset: MenuPreset;
  /** Locked default title = no interchangeable start-screen pick. */
  titleStartScreenId: null;
}

export interface StoredLockedV32Snapshot {
  version: 1;
  id: "locked-v32";
  savedAt: number;
  snapshot: LockedV32Snapshot;
}

/** The 19 dimensions one restore covers (see the PR doc for values). */
export const LOCKED_V32_SNAPSHOT_DIMENSIONS: string[] = [
  "canvas 1200x1500 centre 600",
  "logo image v32-matched PNG x150 y180 w900 (never font text)",
  "cloud original puffy-cloud.svg frame x250 y648 w700 h180 centre 600,738 bob 6px/5s, rendered imgBox 224,599,825x264",
  "mochii cue x170 y790 w110 h110 bob 8px/4.5s",
  "panels CONTINUE/NEW GAME/SETTINGS/BACK TO TITLE x/y/w/h/fill/labelSize/labelMargin/labelLetterSpacing (35/27/0.10, 26/33/0.14, 35/29/-0.07, 31/33/0)",
  "panel label font Trebuchet stack weight 800, stroke labels CONTINUE+SETTINGS, sublabel size 26 margin 30 lineHeight 1.15",
  "panel style radius 28 border 3",
  "background paper #ffffff",
  "rainbow arcs centre 600,454 radii 325/353/381/411/437 colours stroke 5 + logo emblem layer",
  "orbits blue 515x265 + pink 475x230 rotate 0",
  "phi fade gone 620 mid 729 full 905",
  "symbol animation locked speed slow-rise default (vy 8-14, sway 3-8, rotate +-4, period 4-6s; perfect 157.14/6/4/5.6/2 kept as option)",
  "symbol field FORMULA v2, 300 entries (measured 285 superseded DO NOT USE per Mars 2026-10-26 14:18 CDT)",
  "game settings (all fields incl 6 font rows, text/battle/sound/button/frame, cursor, HUD, panel, per-menu)",
  "menu custom (all DEFAULT_MENU_CUSTOM fields)",
  "preset fields (logoImage/size/radius/border/white/gloss/glow/gradient/panelColor/symbolCount/cursorSize/layout)",
  "title start screen pick cleared (null)",
  "animation-speed override cleared (locked speed applies, not a stale override)",
  "menu editor working preset cleared (menuCfg returns locked; library kept)",
];

function cloneJson<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Key-sorted JSON, so store-vs-snapshot equality ignores key order. */
export function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
  if (Array.isArray(v)) return `[${v.map((x) => stableStringify(x)).join(",")}]`;
  const obj = v as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(",")}}`;
}

/**
 * Build the locked snapshot LIVE from the locked data + defaults.
 * Never a stale copy: if Mars locks a new default, this follows it.
 */
export function buildLockedV32Snapshot(): LockedV32Snapshot {
  return {
    id: "locked-v32",
    name: "Locked Default (v32)",
    cloudFile: "src/assets/ui/puffy-cloud.svg",
    logoFile: "src/assets/ui/mochiichao-main-logo-v32-matched.png",
    menu: cloneJson(LOCKED_V32_MENU),
    settings: cloneJson(DEFAULT_SETTINGS),
    custom: cloneJson(DEFAULT_MENU_CUSTOM),
    preset: cloneJson(LOCKED_PRESET),
    titleStartScreenId: null,
  };
}

function isValidStoredSnapshot(v: unknown): v is StoredLockedV32Snapshot {
  if (!v || typeof v !== "object") return false;
  const w = v as Partial<StoredLockedV32Snapshot>;
  if (w.version !== 1 || w.id !== "locked-v32" || !w.snapshot) return false;
  const m = (w.snapshot as LockedV32Snapshot).menu as unknown;
  if (!m || typeof m !== "object") return false;
  const menu = m as Partial<LockedV32Menu>;
  if (!menu.canvas || menu.canvas.w !== 1200 || menu.canvas.h !== 1500) return false;
  if (!Array.isArray(menu.panels) || menu.panels.length !== 4) return false;
  const keys = (menu.panels as { key?: string }[]).map((p) => p.key).join("|");
  if (keys !== "CONTINUE|NEW GAME|SETTINGS|BACK TO TITLE") return false;
  if (!w.snapshot.settings || !w.snapshot.custom) return false;
  return true;
}

/** Read the stored snapshot, or null when none / corrupt. */
export function loadStoredSnapshot(): StoredLockedV32Snapshot | null {
  try {
    const raw = localStorage.getItem(LOCKED_V32_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isValidStoredSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Persist the locked snapshot AND write its settings/custom/preset
 * into their ordinary stores, clear the title pick, the speed
 * override, and the Menu Editor working preset. One call = one
 * persisted, loadable restore. The locked default module itself
 * is never written.
 */
export function restoreLockedV32Snapshot(): LockedV32Snapshot {
  const snapshot = buildLockedV32Snapshot();
  const savedAt = Date.now();
  snapshot.preset = { ...snapshot.preset, savedAt };
  try {
    const stored: StoredLockedV32Snapshot = {
      version: 1,
      id: "locked-v32",
      savedAt,
      snapshot,
    };
    localStorage.setItem(LOCKED_V32_SNAPSHOT_KEY, JSON.stringify(stored));
  } catch {
    /* private mode: stores below + in-session state still apply */
  }
  persistSettings(snapshot.settings);
  persistMenuCustom(snapshot.custom);
  savePresets([{ ...snapshot.preset }]);
  try {
    localStorage.removeItem(MENU_ANIMATION_SPEED_KEY);
  } catch {
    /* private mode: nothing to clear */
  }
  try {
    localStorage.removeItem(MENU_EDITOR_WORKING_KEY);
  } catch {
    /* private mode: nothing to clear */
  }
  setSelectedTitleStartScreenId(null);
  return snapshot;
}

/**
 * True only while the live stores still equal the stored snapshot
 * (settings + custom), with no title pick, no speed override, and
 * no editor working preset. Editing any row and saving, or saving
 * an editor working preset, flips this to false = changed away.
 */
export function isLockedV32SnapshotActive(): boolean {
  const stored = loadStoredSnapshot();
  if (!stored) return false;
  if (getSelectedTitleStartScreenId() !== null) return false;
  try {
    if (localStorage.getItem(MENU_ANIMATION_SPEED_KEY)) return false;
    if (localStorage.getItem(MENU_EDITOR_WORKING_KEY)) return false;
  } catch {
    /* storage unavailable: ignore the override/working checks */
  }
  if (stableStringify(loadStoredSettings()) !== stableStringify(stored.snapshot.settings)) {
    return false;
  }
  if (stableStringify(loadMenuCustom()) !== stableStringify(stored.snapshot.custom)) {
    return false;
  }
  return true;
}

/**
 * The snapshot's menu definition: the stored snapshot's menu when
 * one is stored, else the locked default exactly. The live render
 * path on current main is menuCfg (editor working if saved, else
 * locked); after restore clears the working preset, menuCfg's
 * locked base and this accessor agree because both are built from
 * LOCKED_V32_MENU. This accessor is the snapshot's loadable read
 * (row active-state + tests + future wiring), not a second render
 * path fighting the editor.
 */
export function getActiveV32Menu(): LockedV32Menu {
  const stored = loadStoredSnapshot();
  return stored ? stored.snapshot.menu : LOCKED_V32_MENU;
}
