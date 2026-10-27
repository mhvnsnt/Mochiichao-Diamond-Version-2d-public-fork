/**
 * Menu Editor — Mars, 2026-10-26 19:59 CDT, expanded 20:32 + 20:34 CDT.
 *
 * The editor tool. The game menus themselves stay full screens
 * (Pokemon pattern: FireRed option_menu.c — header window, list
 * window, help bar, label left / value right, UP/DOWN wrap,
 * LEFT/RIGHT cycle, CANCEL = save + exit). Inside the editor,
 * Mars's 20:32 CDT call governs the TOOL's own form: submenu
 * panels are Mochiichao layers over a LIVE preview of the menu
 * being edited — movable, draggable, minimizable — and every
 * change shows in the preview as it happens, with no
 * save-and-reload round trip to see it.
 *
 * Sections (organized, one submenu per section/part, in order):
 * TITLE, MAIN MENU (Cloud, Symbols, Emblems, Panels, Logo, Mochii,
 * Fade, Layers), PAUSE MENU, MOCHIOTEKA, TEXT, FONTS, LIBRARY
 * (template / theme / layer / background saves), EXPORT.
 * The category panel has a filter box so every section is fast
 * to find.
 *
 * Guards: editing never overwrites the locked v32 default — SAVE
 * writes the WORKING preset only; RESTORE copies the locked values
 * into the draft (it does not write to the locked default, and the
 * draft only becomes the working preset when saved). Logo stays
 * the PNG image, never font text. The subtitle font row defaults
 * to the pinned v32 stack; changing it is Mars's own call in the
 * editor, never an agent default change.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { FONT_OPTIONS, fontById, applyFontRoles } from "../../lib/fonts";
import { persistSettings } from "../../lib/gameSettings";
import {
  type MenuEditorConfig, type PanelKey, type LayerId, type LibraryKind, type PanelAlign,
  lockedMenuEditorConfig, loadWorkingConfig, saveWorkingConfig,
  getActiveMenuConfig, loadLibrary, saveLibrary, addLibraryItem, deleteLibraryItem,
  renameLibraryItem, duplicateLibraryItem, updateLibraryItemData, searchLibrary,
  themeFromConfig, applyTheme, layerSlice, applyLayerSlice,
  backgroundSlice, applyBackgroundSlice, parseLibraryJson, downloadJson,
  pieceSlice, applyPieceSlice, LABEL_STYLE_PRESETS, applyLabelStylePreset,
  haloShadow, contrastRatio, mirroredX,
  DEX_LOOKS, dexLookById, subtitleFontStack, PAUSE_ITEM_KEYS,
} from "../../lib/menuEditor";
import { exportMenuPng, recordMenuVideo } from "../../lib/menuEditorExport";
import { setSoundMode } from "../../lib/audioRouting";
import MainMenuBackground from "./MainMenuBackground";
import { getSlotSummaries } from "../../lib/saveSystem";
import menuLogoUrl from "../../assets/ui/mochiichao-main-logo-v32-matched.png";
import cloudUrl from "../../assets/ui/puffy-cloud.svg";
import mochiiUrl from "../../assets/title/mochii-walk-cutout.png";

type PanelId =
  | "EDITOR" | "CLOUD" | "SYMBOLS" | "EMBLEMS" | "PANELS" | "LOGO" | "MOCHII"
  | "FADE" | "LAYERS" | "TITLE" | "TEXT" | "FONTS" | "PAUSE" | "MOCHIOTEKA"
  | "LIBRARY" | "EXPORT" | "GAME_OPTIONS" | "RETRO_OPTIONS" | "ACCESS";

interface RowDef {
  label: string;
  value: string;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  inputKind?: "text" | "color";
  inputValue?: string;
  onInput?: (v: string) => void;
  note?: string;
}

const PANEL_KEYS: PanelKey[] = ["CONTINUE", "NEW GAME", "SETTINGS", "BACK TO TITLE"];
/** Editor text uses the locked picture label stack (clean upright
 *  sans), NOT whatever display font the game screen inherits — the
 *  first proof run rendered editor rows in a slanted display font
 *  whose digits read as dashes, so values could not be judged. */
const EDITOR_FONT = '"Trebuchet MS", Arial, sans-serif';const LAYER_IDS: LayerId[] = ["arcs", "symbols", "emblems", "logo", "cloud", "mochii", "panels"];
const LAYER_LABELS: Record<LayerId, string> = {
  arcs: "Rainbow arcs", symbols: "Symbols", emblems: "Logo emblems",
  logo: "Logo", cloud: "Cloud", mochii: "Mochii cue", panels: "Panels",
};

const cycle = <T,>(arr: T[], cur: T, dir: 1 | -1): T => {
  const i = arr.indexOf(cur);
  return arr[(i < 0 ? 0 : i + dir + arr.length) % arr.length];
};
const clampNum = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function emblemShape(kind: string, color: string, w: number, h: number): React.ReactNode {
  if (kind === "circle") return <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2} fill={color} />;
  if (kind === "star") {
    const s = Math.min(w, h);
    const q = s * 0.12;
    return (
      <path
        d={`M ${w / 2} 0 Q ${w / 2 + q} ${h / 2 - q} ${w} ${h / 2} Q ${w / 2 + q} ${h / 2 + q} ${w / 2} ${h} Q ${w / 2 - q} ${h / 2 + q} 0 ${h / 2} Q ${w / 2 - q} ${h / 2 - q} ${w / 2} 0 Z`}
        fill={color}
      />
    );
  }
  return (
    <path
      d="M50 88 C20 60 5 40 5 25 C5 10 20 0 32 8 C40 13 50 25 50 32 C50 25 60 13 68 8 C80 0 95 10 95 25 C95 40 80 60 50 88 Z"
      fill={color}
      transform={`translate(0,0) scale(${w / 100},${h / 100})`}
    />
  );
}

/** Live preview of the menu being edited, rendered FROM the draft.
 *  userScale is the editor's pinch/wheel/slider zoom (1 = fit).
 *  Label rendering here matches the real menu's label-style fields
 *  (color, halo outline, font, letter-spacing) and the preview's
 *  LEFT alignment default with the #206 measured margins. The real
 *  menu still centers labels until #206 lands — that gap is stated
 *  in the editor header, not hidden. */
function MenuStagePreview({ cfg, userScale, onOpenPanels }: { cfg: MenuEditorConfig; userScale: number; onOpenPanels: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.3);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setFit(Math.min(r.width / 1200, 620 / 1500));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = fit * userScale;
  const zOf = (id: LayerId) => cfg.layers[id].order;
  const vis = (id: LayerId) => cfg.layers[id].visible;
  const opOf = (id: LayerId) => cfg.layers[id].opacity ?? 1;
  // Reduced motion / Gen 1 battle animation OFF: zero the sine
  // amplitudes AND pause descendant CSS animations, so the preview
  // truly freezes instead of only slowing down.
  const frozen = cfg.access.reducedMotion || !cfg.retro.gen1BattleAnim ||
    (typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const effCfg: MenuEditorConfig = frozen
    ? { ...cfg, symbols: { ...cfg.symbols, swayPx: 0, bobPx: 0 }, cloud: { ...cfg.cloud, bobOn: false }, mochii: { ...cfg.mochii, bobOn: false } }
    : cfg;
  // Preview fidelity: the real menu hides CONTINUE when no saves
  // exist (fresh profile) — the preview does the same, so the
  // preview never shows a panel the real menu would not show.
  const hasSaves = getSlotSummaries().some((s) => s !== null);
  const labelFontOf = (p: MenuEditorConfig["panels"][PanelKey]) =>
    p.labelFont === "locked" ? '"Trebuchet MS", Arial, sans-serif' : fontById(p.labelFont).family;
  return (
    <div ref={wrapRef} className="w-full" style={{ height: 1500 * scale }}>
      <div className={`relative overflow-hidden bg-white ${frozen ? "menu-stage-frozen" : ""}`} style={{ width: 1200, height: 1500, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {frozen ? <style>{`.menu-stage-frozen *{animation-play-state:paused !important}`}</style> : null}
        {vis("arcs") || vis("symbols") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: Math.min(zOf("arcs"), zOf("symbols")), opacity: Math.min(opOf("arcs"), opOf("symbols")) }}>
            <MainMenuBackground config={effCfg} />
          </div>
        ) : null}
        {vis("emblems") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: zOf("emblems"), pointerEvents: "none", opacity: opOf("emblems") }}>
            <svg width={1200} height={1500}>
              {[...cfg.emblems].filter((e) => e.visible).sort((a, b) => (a.z ?? 0) - (b.z ?? 0)).map((e) => (
                <g key={e.id} transform={`translate(${e.x - e.w / 2},${e.y - e.h / 2})`}>{emblemShape(e.kind, e.color, e.w, e.h)}</g>
              ))}
            </svg>
          </div>
        ) : null}
        {vis("logo") ? (
          <img src={menuLogoUrl} alt="" className="absolute object-contain" style={{ left: cfg.logo.x, top: cfg.logo.y, width: cfg.logo.w, zIndex: zOf("logo"), pointerEvents: "none", opacity: opOf("logo") }} />
        ) : null}
        {vis("cloud") ? (
          <span className="absolute" style={{ left: cfg.cloud.frameX, top: cfg.cloud.frameY, zIndex: zOf("cloud"), opacity: opOf("cloud") }}>
            <img src={cloudUrl} alt="" style={{ width: cfg.cloud.frameW, height: cfg.cloud.frameH, objectFit: "fill", pointerEvents: "none" }} />
          </span>
        ) : null}
        {vis("mochii") ? (
          <img src={mochiiUrl} alt="" className="absolute object-contain" style={{ left: cfg.mochii.x, top: cfg.mochii.y, width: cfg.mochii.w, height: cfg.mochii.h, zIndex: zOf("mochii"), pointerEvents: "none", opacity: opOf("mochii") }} />
        ) : null}
        {vis("panels") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: zOf("panels"), opacity: opOf("panels") }}>
            {PANEL_KEYS.filter((key) => key !== "CONTINUE" || hasSaves).map((key) => {
              const p = cfg.panels[key];
              const hc = cfg.access.highContrast;
              const alignItems = p.align === "left" ? "flex-start" : p.align === "right" ? "flex-end" : "center";
              return (
                <button
                  key={key}
                  onClick={onOpenPanels}
                  className="absolute flex flex-col justify-center cursor-pointer"
                  style={{
                    left: p.x, top: p.y, width: p.w, height: p.h,
                    background: hc ? "#ffffff" : p.fill,
                    border: `${hc ? 4 : cfg.panelStyle.borderWidth}px solid #000`,
                    borderRadius: cfg.panelStyle.borderRadius,
                    alignItems,
                    fontFamily: cfg.panelStyle.panelFont === "locked" ? '"Trebuchet MS", Arial, sans-serif' : undefined,
                  }}
                >
                  <span
                    className="font-extrabold"
                    style={{
                      fontSize: p.labelSize * cfg.access.fontScale,
                      color: hc ? "#000000" : p.labelColor,
                      fontFamily: labelFontOf(p),
                      ...(p.letterSpacing ? { letterSpacing: p.letterSpacing } : {}),
                      textShadow: hc ? "none" : haloShadow(p.outlineColor, p.outlineWidth),
                      textAlign: p.align,
                      paddingLeft: p.align === "left" ? p.labelMargin : 0,
                      paddingRight: p.align === "right" ? p.labelMargin : 0,
                      width: "100%",
                    }}
                  >{p.label}</span>
                  {key === "CONTINUE" ? (
                    <span
                      style={{
                        fontSize: 19 * cfg.access.fontScale,
                        color: hc ? "#000000" : p.sublabelColor,
                        textShadow: hc ? "none" : haloShadow(p.sublabelOutlineColor, p.sublabelOutlineWidth),
                        textAlign: p.align,
                        paddingLeft: p.align === "left" ? p.sublabelMargin : 0,
                        paddingRight: p.align === "right" ? p.sublabelMargin : 0,
                        width: "100%",
                      }}
                    >{cfg.continueSublabel}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface PanelState {
  id: PanelId;
  x: number;
  y: number;
  w: number;
  scale: number;
  opacity: number;
  minimized: boolean;
  ghost: boolean;
}

/** Options-screen themes for the GAME_OPTIONS panel chrome (editor
 *  tool only). Emerald bg RGB(17,18,31) is exact from
 *  pokeemerald/src/option_menu.c; the other entries map the games'
 *  palette-index triples to neutral shades and are labelled as
 *  approximations, not extracted RGB values. */
const OPTIONS_THEMES: Record<string, { bg: string; header: string; text: string }> = {
  MOCHII: { bg: "rgba(22, 35, 58, 0.96)", header: "#facc15", text: "#e2e8f0" },
  EMERALD: { bg: "rgb(17, 18, 31)", header: "#f87171", text: "#e2e8f0" },
  FIRERED: { bg: "#1e1b4b", header: "#fca5a5", text: "#e2e8f0" },
  HEARTGOLD: { bg: "#0c1a2e", header: "#fde68a", text: "#e2e8f0" },
  PLATINUM: { bg: "#131c2b", header: "#fde68a", text: "#e2e8f0" },
  BLACK2: { bg: "#101828", header: "#facc15", text: "#e2e8f0" },
};
/** Editor row heights by ACCESS touch-target size (S 44px, M 56px, L 68px). */
const TOUCH_MIN: Record<"S" | "M" | "L", number> = { S: 44, M: 56, L: 68 };
/** GB Printer brightness swatches (pokeyellow options.asm +
 *  pokecrystal options_menu.asm Options_Print codes
 *  $00/$20/$40/$60/$7f, lightest to darkest). */
const PRINT_SWATCH: Record<string, string> = {
  LIGHTEST: "#ffffff", LIGHTER: "#e2e8f0", NORMAL: "#cbd5e1", DARKER: "#94a3b8", DARKEST: "#475569",
};

export default function MenuEditorScreen({ onBack, onViewTitle }: { onBack: () => void; onViewTitle?: () => void }) {
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const [draft, setDraft] = useState<MenuEditorConfig>(() => getActiveMenuConfig());
  // Entry snapshot (Black 2 discipline): the config the editor
  // opened with. DISCARD restores it; Quit/Save never silently
  // keep HeartGold's live-leak behaviour.
  const entrySnapshot = useRef(draft);
  const geomOf = (id: PanelId): PanelState => {
    const g = draft.editor.panels[id];
    return g
      ? { id, x: g.x, y: g.y, w: g.w, scale: g.scale, opacity: g.opacity, minimized: g.minimized, ghost: g.ghost ?? false }
      : { id, x: 8, y: 8, w: 360, scale: 1, opacity: 0.96, minimized: false, ghost: false };
  };
  const [panels, setPanels] = useState<PanelState[]>([geomOf("EDITOR")]);
  const [activePanel, setActivePanel] = useState<PanelId>("EDITOR");
  const [cursor, setCursor] = useState(0);
  const [savedMsg, setSavedMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [libName, setLibName] = useState("My Menu 1");
  const [libLayer, setLibLayer] = useState<LayerId>("cloud");
  const [library, setLibrary] = useState(() => loadLibrary());
  const [busy, setBusy] = useState("");
  const [libQuery, setLibQuery] = useState("");
  const [libKind, setLibKind] = useState<"" | LibraryKind>("");
  const [libPiece, setLibPiece] = useState("emblem-heart-blue");
  const [libSection, setLibSection] = useState("");
  const [renamingId, setRenamingId] = useState("");
  const [renameText, setRenameText] = useState("");
  const [typedSample, setTypedSample] = useState("");
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ kind: "move" | "resize"; id: PanelId; dx: number; dy: number; startW: number; startX: number } | null>(null);
  const panelsRef = useRef(panels);
  const pinchRef = useRef<{ d0: number; s0: number } | null>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  // Undo/redo over draft edits (industry-standard editor practice).
  // One history entry per committed edit gesture (a drag counts once,
  // on release — not once per pointermove). Cap 50.
  const undoStack = useRef<MenuEditorConfig[]>([]);
  const redoStack = useRef<MenuEditorConfig[]>([]);
  const suppressHistory = useRef(false);
  const lastDraft = useRef(draft);
  useEffect(() => { panelsRef.current = panels; }, [panels]);
  useEffect(() => {
    if (suppressHistory.current) { suppressHistory.current = false; lastDraft.current = draft; return; }
    if (draft !== lastDraft.current) {
      undoStack.current = [...undoStack.current.slice(-49), lastDraft.current];
      redoStack.current = [];
      lastDraft.current = draft;
    }
  }, [draft]);
  const undo = () => {
    const prev = undoStack.current.pop();
    if (!prev) { setSavedMsg("Nothing to undo."); return; }
    redoStack.current.push(lastDraft.current);
    suppressHistory.current = true;
    setDraft(prev);
    setSavedMsg("Undo applied to the draft (not saved yet).");
  };
  const redo = () => {
    const next = redoStack.current.pop();
    if (!next) { setSavedMsg("Nothing to redo."); return; }
    undoStack.current.push(lastDraft.current);
    suppressHistory.current = true;
    setDraft(next);
    setSavedMsg("Redo applied to the draft (not saved yet).");
  };
  const setEditorGeom = (id: PanelId, patch: Partial<{ x: number; y: number; w: number; scale: number; opacity: number; minimized: boolean; ghost: boolean }>) => {
    setDraft((d) => ({
      ...d,
      editor: {
        ...d.editor,
        panels: {
          ...d.editor.panels,
          [id]: { ...(d.editor.panels[id] ?? { x: 8, y: 8, w: 360, scale: 1, opacity: 0.96, minimized: false, ghost: false }), ...patch },
        },
      },
    }));
  };
  const setPreviewScale = (v: number) => setDraft((d) => ({ ...d, editor: { ...d.editor, previewScale: clampNum(v, 0.25, 2) } }));
  const parkPanels = () => {
    const w = window.innerWidth;
    setPanels((ps) => ps.map((p, i) => ({ ...p, x: Math.max(0, w - p.w - 16), y: 64 + i * 48, minimized: false })));
    setSavedMsg("Panels parked at the right edge — the live preview behind is fully visible. Drag any panel back when you want it.");
  };
  const minimizeAll = () => {
    setPanels((ps) => ps.map((p) => ({ ...p, minimized: true })));
    setSavedMsg("All panels minimized — the live preview behind is fully visible. Tap a ▢ bar below to restore one.");
  };
  const playTypeSample = () => {
    // HeartGold/Diamond text frame delays (options.c Options_GetTextFrameDelay): SLOW 8, MID 4, FAST 1 frames/char.
    const delays: Record<string, number> = { SLOW: 133, MID: 67, FAST: 17 };
    const step = delays[settings.textSpeed as string] ?? 67;
    const text = "MOCHII";
    setTypedSample("");
    let i = 0;
    const tick = () => { i++; setTypedSample(text.slice(0, i)); if (i < text.length) typingRef.current = setTimeout(tick, step); };
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(tick, step);
  };

  const set = (patch: Partial<MenuEditorConfig>) => setDraft((d) => ({ ...d, ...patch }));
  const setCloud = (patch: Partial<MenuEditorConfig["cloud"]>) => setDraft((d) => ({ ...d, cloud: { ...d.cloud, ...patch } }));
  const setSymbols = (patch: Partial<MenuEditorConfig["symbols"]>) => setDraft((d) => ({ ...d, symbols: { ...d.symbols, ...patch } }));
  const setArcs = (patch: Partial<MenuEditorConfig["arcs"]>) => setDraft((d) => ({ ...d, arcs: { ...d.arcs, ...patch } }));
  const setFade = (patch: Partial<MenuEditorConfig["fade"]>) => setDraft((d) => ({ ...d, fade: { ...d.fade, ...patch } }));
  const setTitle = (patch: Partial<MenuEditorConfig["title"]>) => setDraft((d) => ({ ...d, title: { ...d.title, ...patch } }));
  const setPanel = (key: PanelKey, patch: Partial<MenuEditorConfig["panels"][PanelKey]>) =>
    setDraft((d) => ({ ...d, panels: { ...d.panels, [key]: { ...d.panels[key], ...patch } } }));

  const openPanel = (id: PanelId) => {
    setPanels((ps) => {
      const existing = ps.find((p) => p.id === id);
      if (existing) return ps.map((p) => (p.id === id ? { ...p, minimized: false } : p));
      return [...ps, { ...geomOf(id), x: 24, y: 120, minimized: false }];
    });
    setActivePanel(id);
    setCursor(0);
  };
  const pinchDist = (t: React.TouchList) => {
    if (t.length < 2) return 0;
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  };
  const onPinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) pinchRef.current = { d0: pinchDist(e.touches), s0: draft.editor.previewScale };
  };
  const onPinchMove = (e: React.TouchEvent) => {
    const pr = pinchRef.current;
    if (!pr || e.touches.length < 2 || !pr.d0) return;
    setPreviewScale(pr.s0 * (pinchDist(e.touches) / pr.d0));
  };
  const onPinchEnd = () => { pinchRef.current = null; };
  const closePanel = (id: PanelId) => {
    if (id === "EDITOR") { saveAndBack(); return; }
    setPanels((ps) => ps.filter((p) => p.id !== id));
    setActivePanel("EDITOR");
    setCursor(0);
  };
  const saveWorking = () => {
    saveWorkingConfig({ ...draft, name: draft.name || "Working Preset" });
    setSavedMsg("Working preset saved. The real menu loads it on return.");
  };
  const saveAndBack = () => {
    saveWorkingConfig({ ...draft, name: draft.name || "Working Preset" });
    onBack();
  };
  const restoreLocked = () => {
    setDraft(lockedMenuEditorConfig());
    setSavedMsg("Draft reset to Locked Default (v32). Save to make it the working preset — the locked default itself is never overwritten.");
  };
  const alignPanels = (mode: "left" | "center" | "right") => {
    setDraft((d) => {
      const panels = { ...d.panels };
      if (mode === "left") {
        const x = Math.min(...PANEL_KEYS.map((k) => panels[k].x));
        PANEL_KEYS.forEach((k) => { panels[k] = { ...panels[k], x }; });
      } else if (mode === "right") {
        const r = Math.max(...PANEL_KEYS.map((k) => panels[k].x + panels[k].w));
        PANEL_KEYS.forEach((k) => { panels[k] = { ...panels[k], x: r - panels[k].w }; });
      } else {
        const c = PANEL_KEYS.reduce((s, k) => s + panels[k].x + panels[k].w / 2, 0) / PANEL_KEYS.length;
        PANEL_KEYS.forEach((k) => { panels[k] = { ...panels[k], x: c - panels[k].w / 2 }; });
      }
      return { ...d, panels };
    });
    setSavedMsg(`Panels aligned ${mode} (draft only — save to make it the working preset).`);
  };
  const copyContinueStyle = () => {
    setDraft((d) => {
      const src = d.panels["CONTINUE"];
      const panels = { ...d.panels };
      for (const k of PANEL_KEYS) {
        panels[k] = { ...panels[k], labelColor: src.labelColor, outlineColor: src.outlineColor, outlineWidth: src.outlineWidth, labelFont: src.labelFont, letterSpacing: src.letterSpacing };
      }
      return { ...d, panels };
    });
    setSavedMsg("CONTINUE label style copied to all panels (draft only — save to keep it).");
  };

  const setFontRole = (role: "mainFont" | "menuFont" | "dialogueFont" | "smallFont" | "boldFont" | "battleFont", id: string) => {
    const next = { ...settings, [role]: id };
    setSettings(next);
    persistSettings(next);
    applyFontRoles(next);
  };
  const fontLabel = (id: string) => fontById(id).label;

  const nudge = (get: number, setFn: (v: number) => void, step: number, lo: number, hi: number) => ({
    onLeft: () => setFn(clampNum(get - step, lo, hi)),
    onRight: () => setFn(clampNum(get + step, lo, hi)),
  });

  const rowsFor = (id: PanelId): RowDef[] => {
    switch (id) {
      case "EDITOR": {
        const cats: { id: PanelId; label: string; value: string }[] = [
          { id: "TITLE", label: "TITLE", value: "OPEN ►" },
          { id: "CLOUD", label: "MAIN — CLOUD", value: "OPEN ►" },
          { id: "SYMBOLS", label: "MAIN — SYMBOLS + ANIMATION", value: "OPEN ►" },
          { id: "EMBLEMS", label: "MAIN — LOGO EMBLEMS", value: "OPEN ►" },
          { id: "PANELS", label: "MAIN — PANELS", value: "OPEN ►" },
          { id: "LOGO", label: "MAIN — LOGO SLOT", value: "OPEN ►" },
          { id: "MOCHII", label: "MAIN — MOCHII CUE", value: "OPEN ►" },
          { id: "FADE", label: "MAIN — BACKGROUND FADE", value: "OPEN ►" },
          { id: "LAYERS", label: "MAIN — LAYERS", value: "OPEN ►" },
          { id: "PAUSE", label: "PAUSE MENU", value: "OPEN ►" },
          { id: "MOCHIOTEKA", label: "MOCHIOTEKA", value: "OPEN ►" },
          { id: "TEXT", label: "TEXT STRINGS", value: "OPEN ►" },
          { id: "FONTS", label: "FONTS", value: "OPEN ►" },
          { id: "GAME_OPTIONS", label: "GAME OPTIONS (POKEMON SETTINGS)", value: "OPEN ►" },
          { id: "RETRO_OPTIONS", label: "RETRO OPTIONS (GEN 1–5 + BW2)", value: "OPEN ►" },
          { id: "ACCESS", label: "ACCESSIBILITY", value: "OPEN ►" },
          { id: "LIBRARY", label: "LIBRARY — TEMPLATES + THEMES", value: "OPEN ►" },
          { id: "EXPORT", label: "EXPORT — PNG + VIDEO + JSON", value: "OPEN ►" },
        ];
        const q = filter.trim().toLowerCase();
        const shown = q ? cats.filter((c) => c.label.toLowerCase().includes(q)) : cats;
        return [
          ...shown.map((c) => ({
            label: c.label, value: c.value,
            onLeft: () => openPanel(c.id), onRight: () => openPanel(c.id), onSelect: () => openPanel(c.id),
          })),
          { label: "UNDO LAST EDIT", value: "CTRL+Z", onLeft: undo, onRight: undo, onSelect: undo, note: "Undo stack (50 edits, one entry per gesture — a drag counts once, on release). Redo is CTRL+SHIFT+Z / CTRL+Y." },
          { label: "REDO LAST UNDO", value: "CTRL+Y", onLeft: redo, onRight: redo, onSelect: redo },
          { label: "SNAP DRAG TO 10px GRID", value: draft.editor.snap ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, editor: { ...d.editor, snap: !d.editor.snap } })), onRight: () => setDraft((d) => ({ ...d, editor: { ...d.editor, snap: !d.editor.snap } })), note: "Industry-standard editor grid snap. Applies to editor panel drags, not to menu panel geometry." },
          { label: "ALIGN MENU PANELS: LEFT EDGES", value: "ALIGN", onLeft: () => alignPanels("left"), onRight: () => alignPanels("left"), onSelect: () => alignPanels("left"), note: "Sets every menu panel's left edge to the leftmost panel's edge (draft only)." },
          { label: "ALIGN MENU PANELS: CENTRES", value: "ALIGN", onLeft: () => alignPanels("center"), onRight: () => alignPanels("center"), onSelect: () => alignPanels("center") },
          { label: "ALIGN MENU PANELS: RIGHT EDGES", value: "ALIGN", onLeft: () => alignPanels("right"), onRight: () => alignPanels("right"), onSelect: () => alignPanels("right") },
          { label: "COPY CONTINUE STYLE TO ALL PANELS", value: "COPY", onLeft: copyContinueStyle, onRight: copyContinueStyle, onSelect: copyContinueStyle, note: "Copies CONTINUE's letter color, outline, font, and letter-spacing to NEW GAME, SETTINGS, and BACK TO TITLE (draft only)." },
          { label: "EXPORT PRESET PACK (WHOLE LIBRARY)", value: "DOWNLOAD", onLeft: () => downloadJson("mochiichao-menu-library.json", library), onRight: () => downloadJson("mochiichao-menu-library.json", library), onSelect: () => downloadJson("mochiichao-menu-library.json", library), note: "Downloads every library entry as one JSON pack. Import entries one at a time from the LIBRARY panel." },
          { label: "SAVE WORKING PRESET", value: "SAVE", onLeft: saveWorking, onRight: saveWorking, onSelect: saveWorking, note: "Saves this draft as the working preset the real menu loads. It does NOT overwrite Locked Default (v32)." },
          { label: "DISCARD CHANGES", value: "RESTORE ENTRY", onLeft: () => { setDraft(entrySnapshot.current); setSavedMsg("Draft discarded back to the values the editor opened with (Black 2 snapshot discipline). Save to make them the working preset."); }, onRight: () => { setDraft(entrySnapshot.current); setSavedMsg("Draft discarded back to the values the editor opened with (Black 2 snapshot discipline). Save to make them the working preset."); }, onSelect: () => { setDraft(entrySnapshot.current); setSavedMsg("Draft discarded back to the values the editor opened with (Black 2 snapshot discipline). Save to make them the working preset."); }, note: "Black 2's Quit discipline, not HeartGold's live-leak: unsaved edits are dropped and the entry snapshot returns." },
          { label: "RESTORE LOCKED DEFAULT (v32)", value: "RESET DRAFT", onLeft: restoreLocked, onRight: restoreLocked, onSelect: restoreLocked, note: "Copies the locked v32 values into the draft. Save to make them the working preset." },
          { label: "SAVE + BACK TO MAIN MENU", value: "SAVE + BACK", onLeft: saveAndBack, onRight: saveAndBack, onSelect: saveAndBack },
          ...(onViewTitle ? [{ label: "SAVE + VIEW TITLE", value: "VIEW TITLE ►", onLeft: () => { saveWorkingConfig({ ...draft }); onViewTitle(); }, onRight: () => { saveWorkingConfig({ ...draft }); onViewTitle(); }, onSelect: () => { saveWorkingConfig({ ...draft }); onViewTitle(); } }] : []),
          { label: "BACK (SAVE + EXIT)", value: "◄ BACK", onLeft: saveAndBack, onRight: saveAndBack, onSelect: saveAndBack },
        ];
      }
      case "CLOUD":
        return [
          { label: "FRAME X", value: String(draft.cloud.frameX), ...nudge(draft.cloud.frameX, (v) => setCloud({ frameX: v }), 10, 0, 1200), note: "Render box for the original puffy-cloud.svg (frame, not the file — the file is never redrawn). Default follows the locked frame (PR #233 imgBox when present)." },
          { label: "FRAME Y", value: String(draft.cloud.frameY), ...nudge(draft.cloud.frameY, (v) => setCloud({ frameY: v }), 10, 0, 1500) },
          { label: "FRAME WIDTH", value: String(draft.cloud.frameW), ...nudge(draft.cloud.frameW, (v) => setCloud({ frameW: v }), 10, 100, 1200) },
          { label: "FRAME HEIGHT", value: String(draft.cloud.frameH), ...nudge(draft.cloud.frameH, (v) => setCloud({ frameH: v }), 10, 50, 600) },
          { label: "BOB", value: draft.cloud.bobOn ? "ON" : "OFF", onLeft: () => setCloud({ bobOn: !draft.cloud.bobOn }), onRight: () => setCloud({ bobOn: !draft.cloud.bobOn }), note: "Cloud bob is the ±amp sine from PR #149, never Mars-locked. OFF makes the cloud dead static." },
          { label: "BOB AMPLITUDE", value: `${draft.cloud.bobAmp}px`, ...nudge(draft.cloud.bobAmp, (v) => setCloud({ bobAmp: v }), 1, 0, 30) },
          { label: "BOB PERIOD", value: `${draft.cloud.bobPeriod}s`, ...nudge(draft.cloud.bobPeriod, (v) => setCloud({ bobPeriod: v }), 0.5, 1, 12) },
        ];
      case "SYMBOLS":
        return [
          { label: "RISE SPEED", value: draft.symbols.speed === "perfect" ? "PERFECT (matched GIF)" : "SLOW-RISE (PR #163)", onLeft: () => setSymbols({ speed: draft.symbols.speed === "perfect" ? "slow-rise" : "perfect" }), onRight: () => setSymbols({ speed: draft.symbols.speed === "perfect" ? "slow-rise" : "perfect" }), note: "PERFECT = matched GIF 157.14 px/s, 80 frames x 70ms = 5.6s loop. SLOW-RISE = exact PR #163 numbers (vy 8–14 px/s, saved as an option 2026-10-26 10:54 CDT). Slow-rise keeps its own fixed numbers; sway/bob rows below apply to PERFECT." },
          { label: "SWAY AMPLITUDE", value: `${draft.symbols.swayPx}px`, ...nudge(draft.symbols.swayPx, (v) => setSymbols({ swayPx: v }), 1, 0, 30), note: "FireRed sine method: offset = sine × amplitude on base position." },
          { label: "SWAY CYCLES / LOOP", value: String(draft.symbols.swayCycles), ...nudge(draft.symbols.swayCycles, (v) => setSymbols({ swayCycles: v }), 1, 0, 8) },
          { label: "BOB AMPLITUDE", value: `${draft.symbols.bobPx}px`, ...nudge(draft.symbols.bobPx, (v) => setSymbols({ bobPx: v }), 1, 0, 30) },
          { label: "BOB CYCLES / LOOP", value: String(draft.symbols.bobCycles), ...nudge(draft.symbols.bobCycles, (v) => setSymbols({ bobCycles: v }), 1, 0, 8) },
          { label: "FIELD LEFT EDGE", value: String(draft.symbols.fieldLeft), ...nudge(draft.symbols.fieldLeft, (v) => setSymbols({ fieldLeft: v }), 10, 0, 1200), note: "Widening left + right removes the white negative space on both sides of the emblem field (Mars 2026-10-26 19:54 CDT)." },
          { label: "FIELD RIGHT EDGE", value: String(draft.symbols.fieldRight), ...nudge(draft.symbols.fieldRight, (v) => setSymbols({ fieldRight: v }), 10, 0, 1200) },
          { label: "SYMBOL COUNT", value: String(draft.symbols.count), ...nudge(draft.symbols.count, (v) => setSymbols({ count: v }), 5, 0, 285), note: "Shipped measured field is 285 symbols (history's field is 300; shortfall 15 named in mainMenuSymbols.ts, never filled with guesses). Count strides evenly through the field." },
        ];
      case "EMBLEMS": {
        const pink = draft.emblems.find((e) => e.id === "heart-pink");
        return [
          ...draft.emblems.flatMap((e) => [
          { label: `${e.id.toUpperCase()} X`, value: String(e.x), ...nudge(e.x, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, x: v } : x)) })), 5, 0, 1200), note: "X/Y are the emblem's CENTRE (v32 picture placements are centres; hearts corrected to PR #261's measured centres, blue (169,421.5) pink (230,640.5))." },
          { label: `${e.id.toUpperCase()} Y`, value: String(e.y), ...nudge(e.y, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, y: v } : x)) })), 5, 0, 1500) },
          { label: `${e.id.toUpperCase()} W`, value: String(e.w), ...nudge(e.w, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, w: v } : x)) })), 1, 5, 200) },
          { label: `${e.id.toUpperCase()} H`, value: String(e.h), ...nudge(e.h, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, h: v } : x)) })), 1, 5, 200) },
          { label: `${e.id.toUpperCase()} VISIBLE`, value: e.visible ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, visible: !x.visible } : x)) })), onRight: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, visible: !x.visible } : x)) })), note: e.id === "star-top" ? "Top sparkle: v32 picture HAS this star; the matched proof has none there. Mars's call is still open — OFF is one toggle here." : "Blue + pink hearts sit by the logo at the v32 picture placements (Mars 2026-10-26 19:54 CDT); move them on the LAYERS panel's order row if the hearts job lands a different picture layer." },
          { label: `${e.id.toUpperCase()} LAYER`, value: String(e.z ?? 0), ...nudge(e.z ?? 0, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, z: v } : x)) })), 1, 0, 9), note: "Order inside the emblem layer (hearts/stars/circle stack). The whole emblem layer vs logo/cloud/panels moves on the LAYERS panel; lifting ONE heart above the logo while others stay below needs per-heart stacking contexts and is NOT in this pass — stated, not claimed." },
          ]),
          { label: "MIRROR PINK HEART (1200 − X)", value: pink ? `${pink.x} → ${mirroredX(pink.x)}` : "NO PINK HEART", onLeft: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === "heart-pink" ? { ...x, x: mirroredX(x.x) } : x)) })), onRight: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === "heart-pink" ? { ...x, x: mirroredX(x.x) } : x)) })), onSelect: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === "heart-pink" ? { ...x, x: mirroredX(x.x) } : x)) })), note: "A sibling worker is moving the pink heart to its mirrored right-side position in the main game render. This row sets the same mirrored x as data (1200 − current x; 970 from 230). The editor stores whatever x is set and never resets emblems to hardcoded positions on open — RESTORE LOCKED is the only reset, and it is explicit." },
        ];
      }
      case "PANELS":
        return [
          ...PANEL_KEYS.flatMap((key) => {
            const p = draft.panels[key];
            return [
              { label: `${key} LABEL`, value: p.label, inputKind: "text" as const, inputValue: p.label, onInput: (v) => setPanel(key, { label: v }) },
              { label: `${key} X`, value: String(p.x), ...nudge(p.x, (v) => setPanel(key, { x: v }), 10, 0, 1200) },
              { label: `${key} Y`, value: String(p.y), ...nudge(p.y, (v) => setPanel(key, { y: v }), 10, 0, 1500) },
              { label: `${key} WIDTH`, value: String(p.w), ...nudge(p.w, (v) => setPanel(key, { w: v }), 10, 100, 1200) },
              { label: `${key} HEIGHT`, value: String(p.h), ...nudge(p.h, (v) => setPanel(key, { h: v }), 10, 20, 300) },
              { label: `${key} FILL`, value: p.fill, inputKind: "color" as const, inputValue: p.fill, onInput: (v) => setPanel(key, { fill: v }), note: "Locked v32 fills are flat picture fills (no gradients) — the PR #163 gradients were invented, not locked." },
              { label: `${key} LABEL SIZE`, value: String(p.labelSize), ...nudge(p.labelSize, (v) => setPanel(key, { labelSize: v }), 1, 12, 60) },
              { label: `${key} LABEL COLOR`, value: p.labelColor, inputKind: "color" as const, inputValue: p.labelColor, onInput: (v) => setPanel(key, { labelColor: v }), note: `Contrast vs fill: ${contrastRatio(p.labelColor, p.fill).toFixed(1)}:1 ${contrastRatio(p.labelColor, p.fill) >= 4.5 ? "— AA PASS (WCAG 2.x)" : "— below AA 4.5:1, consider a darker/lighter letter color"}.` },
              { label: `${key} OUTLINE COLOR`, value: p.outlineColor, inputKind: "color" as const, inputValue: p.outlineColor, onInput: (v) => setPanel(key, { outlineColor: v }), note: "Halo color, painted BEHIND the letters (locked halo method) so the core stays solid at phone scale." },
              { label: `${key} OUTLINE WIDTH`, value: String(p.outlineWidth), ...nudge(p.outlineWidth, (v) => setPanel(key, { outlineWidth: v }), 1, 0, 8), note: "0 = no outline. Locked: CONTINUE + SETTINGS 2, others 0." },
              { label: `${key} LABEL FONT`, value: p.labelFont === "locked" ? "Locked v32 stack" : fontLabel(p.labelFont), onLeft: () => setPanel(key, { labelFont: "locked" }), onRight: () => setPanel(key, { labelFont: p.labelFont === "locked" ? FONT_OPTIONS[0].id : cycle(FONT_OPTIONS.map((f) => f.id), p.labelFont, 1) }), note: "Per-line font for this panel only (LEFT restores the locked stack). The global PANEL LABEL FONT row below still exists." },
              { label: `${key} ALIGN`, value: p.align.toUpperCase(), onLeft: () => setPanel(key, { align: cycle(["left", "center", "right"] as const, p.align, -1) }), onRight: () => setPanel(key, { align: cycle(["left", "center", "right"] as const, p.align, 1) }), note: "Left / center / right alignment for this panel's label. Preview defaults to LEFT with the #206 margins; the real menu on main now carries #206 (merged 2026-10-27) and this branch centers until the #260 merge reconciles with it." },
              { label: `${key} LABEL MARGIN`, value: `${p.labelMargin}px`, ...nudge(p.labelMargin, (v) => setPanel(key, { labelMargin: v }), 1, 0, 200), note: "Label inset from the panel edge on the aligned side. Locked preview defaults from #206: CONTINUE 70, NEW GAME 33, SETTINGS 29, BACK 33." },
              { label: `${key} LETTER SPACING`, value: `${p.letterSpacing}px`, ...nudge(p.letterSpacing, (v) => setPanel(key, { letterSpacing: v }), 1, 0, 10) },
              { label: `${key} LABEL STYLE PRESET`, value: (() => { const hit = LABEL_STYLE_PRESETS.find((s) => s.labelColor === p.labelColor && s.outlineColor === p.outlineColor && s.outlineWidth === p.outlineWidth); return hit ? hit.name : "Custom"; })(), onLeft: () => setPanel(key, applyLabelStylePreset(p, LABEL_STYLE_PRESETS[(Math.max(0, LABEL_STYLE_PRESETS.findIndex((s) => s.labelColor === p.labelColor && s.outlineColor === p.outlineColor && s.outlineWidth === p.outlineWidth)) - 1 + LABEL_STYLE_PRESETS.length) % LABEL_STYLE_PRESETS.length])), onRight: () => setPanel(key, applyLabelStylePreset(p, LABEL_STYLE_PRESETS[(LABEL_STYLE_PRESETS.findIndex((s) => s.labelColor === p.labelColor && s.outlineColor === p.outlineColor && s.outlineWidth === p.outlineWidth) + 1) % LABEL_STYLE_PRESETS.length])), note: "Named sets incl. white-letters/black-outline and black-letters/white-outline. Applying one writes the three values into this panel only." },
              ...(key === "CONTINUE" ? [
                { label: "CONTINUE SUBLABEL COLOR", value: p.sublabelColor, inputKind: "color" as const, inputValue: p.sublabelColor, onInput: (v) => setPanel(key, { sublabelColor: v }) },
                { label: "CONTINUE SUBLABEL OUTLINE COLOR", value: p.sublabelOutlineColor, inputKind: "color" as const, inputValue: p.sublabelOutlineColor, onInput: (v) => setPanel(key, { sublabelOutlineColor: v }) },
                { label: "CONTINUE SUBLABEL OUTLINE WIDTH", value: String(p.sublabelOutlineWidth), ...nudge(p.sublabelOutlineWidth, (v) => setPanel(key, { sublabelOutlineWidth: v }), 1, 0, 8), note: "Locked sublabel halo: white, radius 1." },
                { label: "CONTINUE SUBLABEL MARGIN", value: `${p.sublabelMargin}px`, ...nudge(p.sublabelMargin, (v) => setPanel(key, { sublabelMargin: v }), 1, 0, 200), note: "Sublabel inset from the panel edge on the aligned side (locked preview default 30, #206). Sublabels sit under their labels at this margin." },
              ] : []),
            ];
          }),
          { label: "CONTINUE SUBLABEL", value: draft.continueSublabel, inputKind: "text" as const, inputValue: draft.continueSublabel, onInput: (v) => set({ continueSublabel: v }), note: "Shown when no save exists. With a save, the real save stats show instead — never faked." },
          { label: "PANEL RADIUS", value: String(draft.panelStyle.borderRadius), ...nudge(draft.panelStyle.borderRadius, (v) => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, borderRadius: v } })), 1, 0, 40) },
          { label: "PANEL BORDER WIDTH", value: String(draft.panelStyle.borderWidth), ...nudge(draft.panelStyle.borderWidth, (v) => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, borderWidth: v } })), 1, 0, 10) },
          { label: "PANEL LABEL FONT", value: draft.panelStyle.panelFont === "locked" ? "Locked v32 stack" : fontLabel(draft.panelStyle.panelFont), onLeft: () => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, panelFont: d.panelStyle.panelFont === "locked" ? FONT_OPTIONS[0].id : "locked" } })), onRight: () => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, panelFont: cycle(FONT_OPTIONS.map((f) => f.id), d.panelStyle.panelFont === "locked" ? FONT_OPTIONS[0].id : d.panelStyle.panelFont, 1) } })), note: "Locked = upright bold Trebuchet stack from the v32 picture labels. Cycling picks a real wired font; 'locked' restores the picture stack." },
        ];
      case "LOGO":
        return [
          { label: "LOGO X", value: String(draft.logo.x), ...nudge(draft.logo.x, (v) => set({ logo: { ...draft.logo, x: v } }), 10, 0, 1200) },
          { label: "LOGO Y", value: String(draft.logo.y), ...nudge(draft.logo.y, (v) => set({ logo: { ...draft.logo, y: v } }), 10, 0, 1500) },
          { label: "LOGO WIDTH", value: String(draft.logo.w), ...nudge(draft.logo.w, (v) => set({ logo: { ...draft.logo, w: v } }), 10, 100, 1200), note: "Logo stays the PNG image in this slot — never font text. Locked v32: x150, y180, w900." },
        ];
      case "MOCHII":
        return [
          { label: "MOCHII X", value: String(draft.mochii.x), ...nudge(draft.mochii.x, (v) => set({ mochii: { ...draft.mochii, x: v } }), 10, 0, 1200) },
          { label: "MOCHII Y", value: String(draft.mochii.y), ...nudge(draft.mochii.y, (v) => set({ mochii: { ...draft.mochii, y: v } }), 10, 0, 1500) },
          { label: "MOCHII WIDTH", value: String(draft.mochii.w), ...nudge(draft.mochii.w, (v) => set({ mochii: { ...draft.mochii, w: v } }), 5, 20, 400) },
          { label: "MOCHII HEIGHT", value: String(draft.mochii.h), ...nudge(draft.mochii.h, (v) => set({ mochii: { ...draft.mochii, h: v } }), 5, 20, 400) },
          { label: "MOCHII BOB", value: draft.mochii.bobOn ? "ON" : "OFF", onLeft: () => set({ mochii: { ...draft.mochii, bobOn: !draft.mochii.bobOn } }), onRight: () => set({ mochii: { ...draft.mochii, bobOn: !draft.mochii.bobOn } }), note: "Mochii cue bob is the ±amp sine from the locked menu (amp 8, period 4.5s). OFF makes the cue dead static." },
          { label: "MOCHII BOB AMPLITUDE", value: `${draft.mochii.bobAmp}px`, ...nudge(draft.mochii.bobAmp, (v) => set({ mochii: { ...draft.mochii, bobAmp: v } }), 1, 0, 30) },
          { label: "MOCHII BOB PERIOD", value: `${draft.mochii.bobPeriod}s`, ...nudge(draft.mochii.bobPeriod, (v) => set({ mochii: { ...draft.mochii, bobPeriod: v } }), 0.5, 1, 12) },
        ];
      case "FADE":
        return [
          { label: "GONE POINT", value: String(draft.fade.gone), ...nudge(draft.fade.gone, (v) => setFade({ gone: v }), 5, 0, 1500), note: "Locked phi fade: gone 620, split 729, full 905, fade length 285 (176/109 ≈ φ)." },
          { label: "SPLIT POINT", value: String(draft.fade.mid), ...nudge(draft.fade.mid, (v) => setFade({ mid: v }), 5, 0, 1500) },
          { label: "FULL START", value: String(draft.fade.full), ...nudge(draft.fade.full, (v) => setFade({ full: v }), 5, 0, 1500) },
          { label: "PAPER COLOUR", value: draft.fade.paper, inputKind: "color" as const, inputValue: draft.fade.paper, onInput: (v) => setFade({ paper: v }) },
          { label: "ARC CENTRE X", value: String(draft.arcs.cx), ...nudge(draft.arcs.cx, (v) => setArcs({ cx: v }), 5, 0, 1200) },
          { label: "ARC CENTRE Y", value: String(draft.arcs.cy), ...nudge(draft.arcs.cy, (v) => setArcs({ cy: v }), 5, 0, 1500) },
          { label: "ARC STROKE", value: String(draft.arcs.stroke), ...nudge(draft.arcs.stroke, (v) => setArcs({ stroke: v }), 1, 1, 20) },
        ];
      case "LAYERS":
        return LAYER_IDS.flatMap((id) => [
          { label: `${LAYER_LABELS[id].toUpperCase()} VISIBLE`, value: draft.layers[id].visible ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, layers: { ...d.layers, [id]: { ...d.layers[id], visible: !d.layers[id].visible } } })), onRight: () => setDraft((d) => ({ ...d, layers: { ...d.layers, [id]: { ...d.layers[id], visible: !d.layers[id].visible } } })) },
          { label: `${LAYER_LABELS[id].toUpperCase()} ORDER`, value: String(draft.layers[id].order), ...nudge(draft.layers[id].order, (v) => setDraft((d) => ({ ...d, layers: { ...d.layers, [id]: { ...d.layers[id], order: v } } })), 1, 0, 10), note: "Lower paints first. Locked order: arcs 1, symbols 2, emblems 3, logo 4, cloud 5, Mochii 6, panels 7. Symbols sit UNDER logo/cloud/panels in the locked stack." },
          { label: `${LAYER_LABELS[id].toUpperCase()} OPACITY`, value: `${Math.round((draft.layers[id].opacity ?? 1) * 100)}%`, ...nudge(draft.layers[id].opacity ?? 1, (v) => setDraft((d) => ({ ...d, layers: { ...d.layers, [id]: { ...d.layers[id], opacity: v } } })), 0.05, 0, 1), note: "Wired into the real render too: arcs/symbols groups in MainMenuBackground, logo/cloud/Mochii/emblems/panels in IntroSequence. Locked default 100% everywhere, so no-preset render is unchanged." },
        ]);
      case "TITLE":
        return [
          { label: "TITLE LOGO X", value: String(draft.title.logoX), ...nudge(draft.title.logoX, (v) => setTitle({ logoX: v }), 10, 0, 1200) },
          { label: "TITLE LOGO Y", value: String(draft.title.logoY), ...nudge(draft.title.logoY, (v) => setTitle({ logoY: v }), 10, 0, 1500) },
          { label: "TITLE LOGO WIDTH", value: String(draft.title.logoW), ...nudge(draft.title.logoW, (v) => setTitle({ logoW: v }), 10, 100, 1200), note: "Title logo stays the uploaded PNG in its phi slot (centre 600,450) — never font text." },
          { label: "SUBTITLE TEXT", value: draft.title.subText, inputKind: "text" as const, inputValue: draft.title.subText, onInput: (v) => setTitle({ subText: v }) },
          { label: "SUBTITLE X", value: String(draft.title.subX), ...nudge(draft.title.subX, (v) => setTitle({ subX: v }), 5, 0, 1200) },
          { label: "SUBTITLE Y", value: String(draft.title.subY), ...nudge(draft.title.subY, (v) => setTitle({ subY: v }), 5, 0, 1500) },
          { label: "SUBTITLE WIDTH", value: String(draft.title.subW), ...nudge(draft.title.subW, (v) => setTitle({ subW: v }), 5, 100, 1200), note: "Locked subtitle slot: 900/φ = 556 wide, 74 tall, centre (600,735)." },
          { label: "SUBTITLE HEIGHT", value: String(draft.title.subH), ...nudge(draft.title.subH, (v) => setTitle({ subH: v }), 2, 20, 200) },
          { label: "PRESS TEXT", value: draft.title.pressText, inputKind: "text" as const, inputValue: draft.title.pressText, onInput: (v) => setTitle({ pressText: v }) },
          { label: "PRESS Y", value: String(draft.title.pressY), ...nudge(draft.title.pressY, (v) => setTitle({ pressY: v }), 5, 0, 1500), note: "Locked press slot: bottom phi line y=927 (top 905 in the render)." },
          { label: "PRESS BLINK", value: draft.title.pressBlink ? "ON" : "OFF", onLeft: () => setTitle({ pressBlink: !draft.title.pressBlink }), onRight: () => setTitle({ pressBlink: !draft.title.pressBlink }), note: "FireRed tempo: 60 first, then 30 off / 30 on." },
          { label: "PRESS ALIGN", value: draft.title.pressAlign.toUpperCase(), onLeft: () => setTitle({ pressAlign: cycle(["left", "center", "right"] as const, draft.title.pressAlign, -1) }), onRight: () => setTitle({ pressAlign: cycle(["left", "center", "right"] as const, draft.title.pressAlign, 1) }), note: "Alignment of the PRESS line on the title screen. Default center (current title render)." },
          { label: "HEAVENSENT X", value: String(draft.title.hsX), ...nudge(draft.title.hsX, (v) => setTitle({ hsX: v }), 5, 0, 1200) },
          { label: "HEAVENSENT Y", value: String(draft.title.hsY), ...nudge(draft.title.hsY, (v) => setTitle({ hsY: v }), 5, 0, 1500) },
          { label: "HEAVENSENT WIDTH", value: String(draft.title.hsW), ...nudge(draft.title.hsW, (v) => setTitle({ hsW: v }), 5, 100, 1200), note: "Locked copyright slot: width 556, centre (600,1222), top 944." },
          { label: "HEAVENSENT VISIBLE", value: draft.title.hsVisible ? "ON" : "OFF", onLeft: () => setTitle({ hsVisible: !draft.title.hsVisible }), onRight: () => setTitle({ hsVisible: !draft.title.hsVisible }) },
          ...(onViewTitle ? [{ label: "SAVE + VIEW TITLE", value: "VIEW TITLE ►", onLeft: () => { saveWorkingConfig({ ...draft }); onViewTitle(); }, onRight: () => { saveWorkingConfig({ ...draft }); onViewTitle(); }, onSelect: () => { saveWorkingConfig({ ...draft }); onViewTitle(); }, note: "Saves the working preset, then shows the real title screen with your title values." }] : []),
        ];
      case "TEXT":
        return [
          ...PANEL_KEYS.map((key) => ({
            label: `${key} LABEL`, value: draft.panels[key].label,
            inputKind: "text" as const, inputValue: draft.panels[key].label,
            onInput: (v: string) => setPanel(key, { label: v }),
          })),
          { label: "CONTINUE SUBLABEL", value: draft.continueSublabel, inputKind: "text" as const, inputValue: draft.continueSublabel, onInput: (v) => set({ continueSublabel: v }) },
          { label: "SUBTITLE TEXT", value: draft.title.subText, inputKind: "text" as const, inputValue: draft.title.subText, onInput: (v) => setTitle({ subText: v }) },
          { label: "PRESS TEXT", value: draft.title.pressText, inputKind: "text" as const, inputValue: draft.title.pressText, onInput: (v) => setTitle({ pressText: v }) },
          { label: "PAUSE TITLE", value: draft.pause.title, inputKind: "text" as const, inputValue: draft.pause.title, onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, title: v } })) },
        ];
      case "FONTS": {
        const roleRows: { role: "mainFont" | "menuFont" | "dialogueFont" | "smallFont" | "boldFont" | "battleFont"; label: string }[] = [
          { role: "mainFont", label: "MAIN FONT" },
          { role: "menuFont", label: "MENU FONT" },
          { role: "dialogueFont", label: "DIALOGUE FONT" },
          { role: "smallFont", label: "SMALL FONT" },
          { role: "boldFont", label: "BOLD FONT" },
          { role: "battleFont", label: "BATTLE FONT" },
        ];
        return [
          ...roleRows.map((r) => ({
            label: r.label, value: fontLabel(settings[r.role] as string),
            onLeft: () => setFontRole(r.role, cycle(FONT_OPTIONS.map((f) => f.id), settings[r.role] as string, -1)),
            onRight: () => setFontRole(r.role, cycle(FONT_OPTIONS.map((f) => f.id), settings[r.role] as string, 1)),
            note: "Real wired fonts only (Yagiza, 01 Digitall, Pokemon Base stack, shipped OFL Y2K fonts). Behance Y2K stays FILE PENDING and falls back until it lands — never dropped.",
          })),
          { label: "SUBTITLE FONT", value: draft.title.subFont === "pinned" ? "Pinned v32 (default)" : fontLabel(draft.title.subFont), onLeft: () => setTitle({ subFont: draft.title.subFont === "pinned" ? FONT_OPTIONS[FONT_OPTIONS.length - 1].id : "pinned" }), onRight: () => setTitle({ subFont: draft.title.subFont === "pinned" ? FONT_OPTIONS[0].id : cycle(FONT_OPTIONS.map((f) => f.id), draft.title.subFont, 1) }), note: "DEFAULT is the pinned v32 subtitle stack and it never changes on its own. Picking another font here is Mars changing it himself in the editor — his call, not an agent default change." },
          { label: "PANEL LABEL FONT", value: draft.panelStyle.panelFont === "locked" ? "Locked v32 stack" : fontLabel(draft.panelStyle.panelFont), onLeft: () => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, panelFont: "locked" } })), onRight: () => setDraft((d) => ({ ...d, panelStyle: { ...d.panelStyle, panelFont: cycle(FONT_OPTIONS.map((f) => f.id), d.panelStyle.panelFont === "locked" ? FONT_OPTIONS[0].id : d.panelStyle.panelFont, 1) } })) },
        ];
      }
      case "PAUSE": {
        const moveItem = (key: string, dir: -1 | 1) => {
          setDraft((d) => {
            const order = [...d.pause.order];
            const i = order.indexOf(key);
            const j = i + dir;
            if (i < 0 || j < 0 || j >= order.length) return d;
            [order[i], order[j]] = [order[j], order[i]];
            return { ...d, pause: { ...d.pause, order } };
          });
        };
        return [
          { label: "PAUSE TITLE", value: draft.pause.title, inputKind: "text" as const, inputValue: draft.pause.title, onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, title: v } })) },
          { label: "PANEL MAX WIDTH", value: `${draft.pause.panelMaxW}px`, ...nudge(draft.pause.panelMaxW, (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, panelMaxW: v } })), 16, 240, 800) },
          { label: "ROW GAP", value: `${draft.pause.gap}px`, ...nudge(draft.pause.gap, (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, gap: v } })), 2, 0, 32) },
          { label: "LABEL MARGIN", value: `${draft.pause.labelMargin}px`, ...nudge(draft.pause.labelMargin, (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, labelMargin: v } })), 2, 0, 64), note: "Left inset for pause row labels (0 = the shipped row style)." },
          { label: "CORNER SPARKLES", value: draft.pause.sparkles ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, sparkles: !d.pause.sparkles } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, sparkles: !d.pause.sparkles } })), note: "Pause menu stays a window over the world (Pokemon start-menu pattern) — the editor edits its values, not its form." },
          ...draft.pause.order.flatMap((key) => [
            { label: `${key.toUpperCase()} LABEL`, value: draft.pause.labels[key] ?? key, inputKind: "text" as const, inputValue: draft.pause.labels[key] ?? key, onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, labels: { ...d.pause.labels, [key]: v } } })) },
            { label: `${key.toUpperCase()} HELP`, value: draft.pause.help[key] ?? "", inputKind: "text" as const, inputValue: draft.pause.help[key] ?? "", onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, help: { ...d.pause.help, [key]: v } } })) },
            { label: `${key.toUpperCase()} VISIBLE`, value: draft.pause.visible[key] === false ? "OFF" : "ON", onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, visible: { ...d.pause.visible, [key]: !(d.pause.visible[key] !== false) } } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, visible: { ...d.pause.visible, [key]: !(d.pause.visible[key] !== false) } } })) },
            { label: `${key.toUpperCase()} LABEL COLOR`, value: draft.pause.labelColors[key] ?? "#e2e8f0", inputKind: "color" as const, inputValue: draft.pause.labelColors[key] ?? "#e2e8f0", onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, labelColors: { ...d.pause.labelColors, [key]: v } } })), note: "Per-line text color for this pause row only. Unset rows inherit the shipped row style — RESET LINE STYLES below unsets all." },
            { label: `${key.toUpperCase()} LABEL FONT`, value: draft.pause.labelFonts[key] ? fontLabel(draft.pause.labelFonts[key]) : "Inherit", onLeft: () => setDraft((d) => { const f = { ...d.pause.labelFonts }; delete f[key]; return { ...d, pause: { ...d.pause, labelFonts: f } }; }), onRight: () => setDraft((d) => { const cur = d.pause.labelFonts[key]; const next = !cur ? FONT_OPTIONS[0].id : cycle(FONT_OPTIONS.map((f) => f.id), cur, 1); return { ...d, pause: { ...d.pause, labelFonts: { ...d.pause.labelFonts, [key]: next } } }; }), note: "Per-line font for this pause row only (LEFT = inherit the shipped row font)." },
            { label: `${key.toUpperCase()} ALIGN`, value: (draft.pause.itemAlign[key] ?? "left").toUpperCase(), onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, itemAlign: { ...d.pause.itemAlign, [key]: cycle(["left", "center", "right"] as const, d.pause.itemAlign[key] ?? "left", -1) } } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, itemAlign: { ...d.pause.itemAlign, [key]: cycle(["left", "center", "right"] as const, d.pause.itemAlign[key] ?? "left", 1) } } })) },
            { label: `${key.toUpperCase()} MOVE`, value: "▲ / ▼", onLeft: () => moveItem(key, -1), onRight: () => moveItem(key, 1), note: "Reorder is a Mochiichao extension (Pokemon list menus do not reorder) — labelled X, not a Pokemon option." },
          ]),
          { label: "RESET LINE STYLES (ALL ROWS)", value: "RESET", onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, labelColors: {}, labelFonts: {}, itemAlign: {} } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, labelColors: {}, labelFonts: {}, itemAlign: {} } })), onSelect: () => setDraft((d) => ({ ...d, pause: { ...d.pause, labelColors: {}, labelFonts: {}, itemAlign: {} } })), note: "Unsets every pause row's color, font, and alignment back to the shipped row style." },
        ];
      }
      case "MOCHIOTEKA": {
        const verified = DEX_LOOKS.filter((l) => l.status === "verified");
        const current = dexLookById(draft.mochioteka.look);
        return [
          { label: "DEX LOOK", value: `${current.gen} — ${current.name}`, onLeft: () => { const next = cycle(verified, current, -1); setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, look: next.id, listPct: next.listPct, portrait: next.portrait, detailPortrait: next.detailPortrait } })); }, onRight: () => { const next = cycle(verified, current, 1); setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, look: next.id, listPct: next.listPct, portrait: next.portrait, detailPortrait: next.detailPortrait } })); }, note: `Source: ${current.source}. Only verified layouts are selectable. Verified now: Mochiichao current, Gen 1 (Red/Yellow), Gen 2 (Gold/Crystal). NOT selectable yet, plainly: Gen 3 Ruby/Emerald (pixel port needs a second pass), FireRed (page pixels unquoted), Platinum + HeartGold (pixels unquoted), Black 2 (pixels unquoted), Diamond (no dex UI file at all — a gap, never inferred).` },
          { label: "LIST WIDTH", value: `${draft.mochioteka.listPct}%`, ...nudge(draft.mochioteka.listPct, (v) => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, listPct: v } })), 2, 20, 60) },
          { label: "LIST PORTRAIT", value: `${draft.mochioteka.portrait}px`, ...nudge(draft.mochioteka.portrait, (v) => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, portrait: v } })), 4, 24, 96) },
          { label: "DETAIL PORTRAIT", value: `${draft.mochioteka.detailPortrait}px`, ...nudge(draft.mochioteka.detailPortrait, (v) => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, detailPortrait: v } })), 8, 64, 256) },
          { label: "HELP LINE", value: draft.mochioteka.helpOn ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, helpOn: !d.mochioteka.helpOn } })), onRight: () => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, helpOn: !d.mochioteka.helpOn } })) },
          { label: "ACCENT COLOUR", value: draft.mochioteka.accent, inputKind: "color" as const, inputValue: draft.mochioteka.accent, onInput: (v) => setDraft((d) => ({ ...d, mochioteka: { ...d.mochioteka, accent: v } })) },
        ];
      }
      case "LIBRARY": {
        const PIECE_IDS: string[] = [
          ...draft.emblems.map((e) => `emblem-${e.id}`),
          ...PANEL_KEYS.map((k) => `panel-${k}`),
          "subtitle", "pause-order",
        ];
        const SECTIONS = ["", "TITLE", "MAIN", "PAUSE", "MOCHIOTEKA", "TEXT", "FONTS"];
        const shownLib = searchLibrary(library, libQuery, libKind);
        const saveKind = (kind: LibraryKind) => {
          if (kind === "template") addLibraryItem("template", libName, draft, libSection);
          else if (kind === "theme") addLibraryItem("theme", libName, themeFromConfig(draft, {
            main: settings.mainFont as string, menu: settings.menuFont as string,
            dialogue: settings.dialogueFont as string, small: settings.smallFont as string,
            bold: settings.boldFont as string, battle: settings.battleFont as string,
          }), libSection);
          else if (kind === "layer") addLibraryItem("layer", `${libName} — ${LAYER_LABELS[libLayer]}`, { layer: libLayer, slice: layerSlice(draft, libLayer) }, libSection);
          else if (kind === "piece") {
            const sliced = pieceSlice(draft, libPiece);
            if (!sliced) { setSavedMsg(`Cannot save piece ${libPiece}: no such piece in this draft.`); return; }
            addLibraryItem("piece", `${libName} — ${libPiece}`, sliced, libSection);
          }
          else addLibraryItem("background", libName, backgroundSlice(draft), libSection);
          setLibrary(loadLibrary());
          setSavedMsg(`Saved to library as ${kind}: ${libName}. Loading it never touches Locked Default (v32).`);
        };
        const loadItem = (id: string) => {
          const item = library.find((i) => i.id === id);
          if (!item) return;
          if (item.kind === "template") setDraft({ ...(item.data as MenuEditorConfig), name: (item.data as MenuEditorConfig).name || item.name });
          else if (item.kind === "theme") setDraft((d) => applyTheme(d, item.data as Parameters<typeof applyTheme>[1]));
          else if (item.kind === "layer") {
            const l = item.data as { layer: LayerId; slice: unknown };
            setDraft((d) => applyLayerSlice(d, l.layer, l.slice));
          } else if (item.kind === "piece") {
            const pd = item.data as { piece: string; slice: unknown };
            setDraft((d) => applyPieceSlice(d, pd.piece, pd.slice));
          } else if (item.kind === "background") setDraft((d) => applyBackgroundSlice(d, item.data));
          setSavedMsg(`Loaded ${item.kind}: ${item.name}. Preview updates live; save to make it the working preset.`);
        };
        const updateItem = (id: string) => {
          const item = library.find((i) => i.id === id);
          if (!item) return;
          if (item.kind === "template") updateLibraryItemData(id, draft);
          else if (item.kind === "theme") updateLibraryItemData(id, themeFromConfig(draft, {
            main: settings.mainFont as string, menu: settings.menuFont as string,
            dialogue: settings.dialogueFont as string, small: settings.smallFont as string,
            bold: settings.boldFont as string, battle: settings.battleFont as string,
          }));
          else if (item.kind === "layer") {
            const l = item.data as { layer: LayerId };
            updateLibraryItemData(id, { layer: l.layer, slice: layerSlice(draft, l.layer) });
          } else if (item.kind === "piece") {
            const pd = item.data as { piece: string };
            const sliced = pieceSlice(draft, pd.piece);
            if (sliced) updateLibraryItemData(id, sliced);
          } else if (item.kind === "background") updateLibraryItemData(id, backgroundSlice(draft));
          setLibrary(loadLibrary());
          setSavedMsg(`Updated ${item.kind}: ${item.name} from the current draft (same id, same name).`);
        };
        return [
          { label: "LIBRARY NAME", value: libName, inputKind: "text" as const, inputValue: libName, onInput: setLibName },
          { label: "SEARCH LIBRARY", value: `${shownLib.length}/${library.length}`, inputKind: "text" as const, inputValue: libQuery, onInput: setLibQuery, note: "Filters entries by name or section (below). Empty = show all." },
          { label: "KIND FILTER", value: libKind === "" ? "ALL KINDS" : libKind.toUpperCase(), onLeft: () => setLibKind(cycle(["", "template", "theme", "layer", "piece", "background"] as const, libKind, -1)), onRight: () => setLibKind(cycle(["", "template", "theme", "layer", "piece", "background"] as const, libKind, 1)) },
          { label: "SECTION TAG", value: libSection === "" ? "UNTAGGED" : libSection, onLeft: () => setLibSection(cycle(SECTIONS, libSection, -1)), onRight: () => setLibSection(cycle(SECTIONS, libSection, 1)), note: "Tag applied to the next save. Search matches tags too." },
          { label: "LAYER TO SAVE", value: LAYER_LABELS[libLayer], onLeft: () => setLibLayer(cycle(LAYER_IDS, libLayer, -1)), onRight: () => setLibLayer(cycle(LAYER_IDS, libLayer, 1)), note: "Saving ONE layer saves only that layer. Loading it patches only that layer in the draft." },
          { label: "PIECE TO SAVE", value: libPiece, onLeft: () => setLibPiece(cycle(PIECE_IDS, libPiece, -1)), onRight: () => setLibPiece(cycle(PIECE_IDS, libPiece, 1)), note: "One reusable piece: a single emblem, a single panel, the subtitle block, or the pause order. Loading a piece patches only that piece." },
          { label: "SAVE AS TEMPLATE", value: "SAVE", onLeft: () => saveKind("template"), onRight: () => saveKind("template"), onSelect: () => saveKind("template"), note: "Whole menu config, reusable later." },
          { label: "SAVE AS THEME", value: "SAVE", onLeft: () => saveKind("theme"), onRight: () => saveKind("theme"), onSelect: () => saveKind("theme"), note: "Colours + fonts only, no geometry." },
          { label: "SAVE AS LAYER", value: "SAVE", onLeft: () => saveKind("layer"), onRight: () => saveKind("layer"), onSelect: () => saveKind("layer") },
          { label: "SAVE AS PIECE", value: "SAVE", onLeft: () => saveKind("piece"), onRight: () => saveKind("piece"), onSelect: () => saveKind("piece"), note: "One piece only (see PIECE TO SAVE). The deepest reusable unit in the library." },
          { label: "SAVE AS BACKGROUND", value: "SAVE", onLeft: () => saveKind("background"), onRight: () => saveKind("background"), onSelect: () => saveKind("background"), note: "Arcs + fade + paper only." },
          ...shownLib.flatMap((item) => renamingId === item.id ? [
            { label: `RENAME: ${item.name}`, value: renameText, inputKind: "text" as const, inputValue: renameText, onInput: setRenameText },
            { label: "SAVE NEW NAME", value: "SAVE", onLeft: () => { renameLibraryItem(item.id, renameText); setLibrary(loadLibrary()); setRenamingId(""); }, onRight: () => { renameLibraryItem(item.id, renameText); setLibrary(loadLibrary()); setRenamingId(""); }, onSelect: () => { renameLibraryItem(item.id, renameText); setLibrary(loadLibrary()); setRenamingId(""); } },
            { label: "CANCEL RENAME", value: "CANCEL", onLeft: () => setRenamingId(""), onRight: () => setRenamingId(""), onSelect: () => setRenamingId("") },
          ] : [
            { label: `LOAD ${item.kind.toUpperCase()}: ${item.name}`, value: item.section ? `[${item.section}] LOAD ►` : "LOAD ►", onLeft: () => loadItem(item.id), onRight: () => loadItem(item.id), onSelect: () => loadItem(item.id) },
            { label: `RENAME ${item.kind.toUpperCase()}: ${item.name}`, value: "RENAME", onLeft: () => { setRenamingId(item.id); setRenameText(item.name); }, onRight: () => { setRenamingId(item.id); setRenameText(item.name); }, onSelect: () => { setRenamingId(item.id); setRenameText(item.name); }, note: "Rename in place (id, kind, and data unchanged). Locked Default (v32) is never a library entry." },
            { label: `DUPLICATE ${item.kind.toUpperCase()}: ${item.name}`, value: "COPY", onLeft: () => { duplicateLibraryItem(item.id); setLibrary(loadLibrary()); }, onRight: () => { duplicateLibraryItem(item.id); setLibrary(loadLibrary()); }, onSelect: () => { duplicateLibraryItem(item.id); setLibrary(loadLibrary()); }, note: "Same kind/data/section, new id, name + ' copy'." },
            { label: `UPDATE ${item.kind.toUpperCase()}: ${item.name}`, value: "FROM DRAFT", onLeft: () => updateItem(item.id), onRight: () => updateItem(item.id), onSelect: () => updateItem(item.id), note: "Edit in place: overwrites this entry's data with the current draft's slice for its kind (same id, same name)." },
            { label: `EXPORT ${item.kind.toUpperCase()}: ${item.name}`, value: "DOWNLOAD", onLeft: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item), onRight: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item), onSelect: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item) },
            { label: `DELETE ${item.kind.toUpperCase()}: ${item.name}`, value: "DELETE", onLeft: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, onRight: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, onSelect: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, note: "Deletes only this user-created library entry. Locked Default (v32) is never a library entry and can never be deleted here." },
          ]),
          { label: "IMPORT LIBRARY JSON", value: "CHOOSE FILE", onSelect: () => { document.getElementById("menu-editor-lib-import")?.click(); } },
        ];
      }
      case "EXPORT": {
        const doPng = async () => {
          setBusy("Rendering menu PNG…");
          try { await exportMenuPng(draft, "mochiichao-menu-export.png"); setSavedMsg("Menu PNG exported (canvas render of your current config)."); }
          catch (e) { setSavedMsg(`PNG export failed: ${e instanceof Error ? e.message : String(e)}`); }
          setBusy("");
        };
        const doVideo = async () => {
          setBusy("Recording 5.6s menu video… (keep this screen open)");
          try { await recordMenuVideo(draft, "mochiichao-menu-export.webm", 5.6); setSavedMsg("Menu video exported as WebM (MediaRecorder, creator Phase 2 route)."); }
          catch (e) { setSavedMsg(`Video export failed: ${e instanceof Error ? e.message : String(e)}`); }
          setBusy("");
        };
        const copyJson = async () => {
          const text = JSON.stringify({ ...draft, savedAt: Date.now() }, null, 2);
          try { await navigator.clipboard.writeText(text); setSavedMsg("Working preset JSON copied (share it anywhere)."); }
          catch { setSavedMsg("Clipboard blocked by the browser — use EXPORT WORKING JSON instead."); }
        };
        return [
          { label: "EXPORT MENU PNG", value: "DOWNLOAD", onLeft: doPng, onRight: doPng, onSelect: doPng, note: "Canvas render of your current config at 1200x1500 (arcs, symbols, emblems, logo, cloud, Mochii, panels). Not a DOM screenshot — no new dependency." },
          { label: "RECORD MENU VIDEO", value: "RECORD 5.6s", onLeft: doVideo, onRight: doVideo, onSelect: doVideo, note: "MediaRecorder WebM, one perfect loop. This is the creator Phase 2 web route (open PR #155); native FFmpeg cannot run in a browser — convert later with: ffmpeg -i mochiichao-menu-export.webm mochiichao-menu-export.mp4" },
          { label: "EXPORT WORKING JSON", value: "DOWNLOAD", onLeft: () => downloadJson("mochiichao-menu-working.json", { ...draft, savedAt: Date.now() }), onRight: () => downloadJson("mochiichao-menu-working.json", { ...draft, savedAt: Date.now() }), onSelect: () => downloadJson("mochiichao-menu-working.json", { ...draft, savedAt: Date.now() }) },
          { label: "COPY WORKING JSON (SHARE)", value: "COPY", onLeft: copyJson, onRight: copyJson, onSelect: copyJson },
          { label: "IMPORT WORKING JSON", value: "CHOOSE FILE", onSelect: () => { document.getElementById("menu-editor-working-import")?.click(); } },
          { label: "FFMPEG / BLENDER / DS TOOLS", value: "NOT IN-BROWSER", note: "Plainly: native FFmpeg, Blender, ndstool and DSDecmp cannot run inside the web game. Their in-game equivalents here are MediaRecorder WebM (FFmpeg), the canvas stage render (Blender render), and nothing for DS ROM tooling (no menu-editor use). JS tools already vendored in tools/ (rot.js, WFC, FastNoiseLite) are game-world tools, not menu tools — not wired here, not claimed." },
        ];
      }
      case "GAME_OPTIONS": {
        // Pokemon options audit (2026-10-26): the rows every
        // generation's options screen actually exposes — FireRed
        // option_menu.c (6 rows), HeartGold options_app.c (6 rows),
        // Black 2 config_panel.c (5 rows; no frame, no button mode).
        // These write the live game settings immediately (frame
        // reloads live, sound routes live), exactly as the games
        // apply them — they are the editor's organized GAME
        // OPTIONS section, not a second settings system: the same
        // GameSettings the Settings screen edits.
        const setOpt = (patch: Partial<typeof settings>) => {
          const next = { ...settings, ...patch };
          setSettings(next);
          persistSettings(next);
        };
        return [
          { label: "TEXT SPEED", value: settings.textSpeed, onLeft: () => setOpt({ textSpeed: cycle(['SLOW', 'MID', 'FAST'] as const, settings.textSpeed, -1) }), onRight: () => setOpt({ textSpeed: cycle(['SLOW', 'MID', 'FAST'] as const, settings.textSpeed, 1) }), note: "FireRed / HeartGold / Black 2, all three: Slow / Mid / Fast. Default Mid." },
          { label: "BATTLE SCENE", value: settings.battleScene, onLeft: () => setOpt({ battleScene: settings.battleScene === 'ON' ? 'OFF' : 'ON' }), onRight: () => setOpt({ battleScene: settings.battleScene === 'ON' ? 'OFF' : 'ON' }), note: "All three games: On / Off. Off gates battle animations." },
          { label: "BATTLE STYLE", value: settings.battleStyle, onLeft: () => setOpt({ battleStyle: settings.battleStyle === 'SHIFT' ? 'SET' : 'SHIFT' }), onRight: () => setOpt({ battleStyle: settings.battleStyle === 'SHIFT' ? 'SET' : 'SHIFT' }), note: "All three games: Shift / Set." },
          { label: "SOUND", value: settings.sound, onLeft: () => { const next = cycle(['MONO', 'STEREO'] as const, settings.sound, -1); setOpt({ sound: next }); setSoundMode(next); }, onRight: () => { const next = cycle(['MONO', 'STEREO'] as const, settings.sound, 1); setOpt({ sound: next }); setSoundMode(next); }, note: "All three games: Mono / Stereo, routed live through audioRouting (Settings screen SOUND row does the same). Polarity differs between games (FireRed 0=Mono, Black 2 0=Stereo) — this row uses the Mochiichao names, never a copied number." },
          { label: "BUTTON MODE", value: settings.buttonMode, onLeft: () => setOpt({ buttonMode: cycle(['NORMAL', 'LR', 'L_EQUALS_A'] as const, settings.buttonMode, -1) }), onRight: () => setOpt({ buttonMode: cycle(['NORMAL', 'LR', 'L_EQUALS_A'] as const, settings.buttonMode, 1) }), note: "FireRed (3: Help / LR / L=A) + HeartGold (2). Black 2 has NO button-mode row — its Config struct has no such field." },
          { label: "FRAME", value: `FRAME ${settings.frame}`, ...nudge(settings.frame, (v) => setOpt({ frame: v }), 1, 1, 20), note: "FireRed cycles 10 frames, HeartGold 20, Black 2 none. Mochiichao frames 1-20 are ORIGINAL Y2K variants in those slots (gameSettings.ts), not Pokemon frame tiles — a frame change reloads live on return (Pokemon FRAME pattern)." },
          { label: "NOT ON THIS PANEL (PLAINLY)", value: "SEE NOTE", note: "Black 2 Config fields kanji (message language) and cgearOn exist in the struct but are NOT editable on Black 2's panel — likewise not added here as fake rows (they ARE listed as info rows in RETRO_OPTIONS so they are never mistaken for panel rows). Black 2's Save-Before-IR IS a real 5th panel row and now lives in RETRO_OPTIONS. No volume/brightness slider exists in any of the three games' options — none is invented here." },
        ];
      }
      case "RETRO_OPTIONS": {
        const setRetro = (patch: Partial<MenuEditorConfig["retro"]>) => setDraft((d) => ({ ...d, retro: { ...d.retro, ...patch } }));
        const setFrame = (v: number) => { const next = { ...settings, frame: v }; setSettings(next); persistSettings(next); };
        const FRAME_SETS: { name: string; max: number }[] = [
          { name: "CRYSTAL 8", max: 8 }, { name: "FIRERED 10", max: 10 }, { name: "EMERALD 20", max: 20 }, { name: "HEARTGOLD 20", max: 20 }, { name: "PLATINUM 20", max: 20 },
        ];
        const frameSet = FRAME_SETS.find((s) => s.name === draft.retro.frameSet) ?? FRAME_SETS[2];
        const stepFrameSet = (dir: 1 | -1) => {
          const next = FRAME_SETS[(FRAME_SETS.indexOf(frameSet) + dir + FRAME_SETS.length) % FRAME_SETS.length];
          setRetro({ frameSet: next.name });
          if ((settings.frame as number) > next.max) setFrame(next.max);
        };
        return [
          { label: "GEN 1 BATTLE ANIMATION", value: draft.retro.gen1BattleAnim ? "ON" : "OFF", onLeft: () => setRetro({ gen1BattleAnim: !draft.retro.gen1BattleAnim }), onRight: () => setRetro({ gen1BattleAnim: !draft.retro.gen1BattleAnim }), note: "Red (pokered engine/menus/main_menu.asm, BATTLE ANIMATION ON/OFF). OFF freezes the preview symbols — the same freeze as REDUCED MOTION, from the Gen 1 row." },
          { label: "YELLOW SOUND", value: draft.retro.yellowSound, onLeft: () => setRetro({ yellowSound: cycle(["MONO", "EARPHONE1", "EARPHONE2", "EARPHONE3"], draft.retro.yellowSound, -1) }), onRight: () => setRetro({ yellowSound: cycle(["MONO", "EARPHONE1", "EARPHONE2", "EARPHONE3"], draft.retro.yellowSound, 1) }), note: "Yellow only (pokeyellow engine/menus/options.asm, SOUND_MASK %110000, wOptions bits 4-5). Stored Yellow-variant setting; in-game routing stays Mono/Stereo — the 4-way set is NOT merged into the 2-way row." },
          { label: "PRINT BRIGHTNESS", value: draft.retro.printBrightness, onLeft: () => setRetro({ printBrightness: cycle(["LIGHTEST", "LIGHTER", "NORMAL", "DARKER", "DARKEST"], draft.retro.printBrightness, -1) }), onRight: () => setRetro({ printBrightness: cycle(["LIGHTEST", "LIGHTER", "NORMAL", "DARKER", "DARKEST"], draft.retro.printBrightness, 1) }), note: "GB Printer brightness (pokeyellow options.asm + pokecrystal options_menu.asm Options_Print, codes $00/$20/$40/$60/$7f). The swatch below the rows shows the darkness live." },
          { label: "MENU ACCOUNT", value: draft.retro.menuAccount ? "ON" : "OFF", onLeft: () => setRetro({ menuAccount: !draft.retro.menuAccount }), onRight: () => setRetro({ menuAccount: !draft.retro.menuAccount }), note: "Gen 2 only (pokecrystal options_menu.asm OPT_MENU_ACCOUNT; start_menu.asm .IsMenuAccountOn draws the account box at tile (0,13), 5×10). ON shows the box outline below the rows; box contents are not ported (not guessed)." },
          { label: "SAVE BEFORE IR", value: draft.retro.saveBeforeIr ? "SAVE" : "NO SAVE", onLeft: () => setRetro({ saveBeforeIr: true }), onRight: () => setRetro({ saveBeforeIr: false }), note: "Black 2's real 5th panel row (pokebw2 config_panel.c OPTION_SAVE_BEFORE_IR; Config_GetSaveBeforeIR). LEFT = Save, RIGHT = No Save — the reversed order from the original is preserved." },
          { label: "HG BUTTON MODE", value: draft.retro.hgButtonMode, onLeft: () => setRetro({ hgButtonMode: draft.retro.hgButtonMode === "NORMAL" ? "L=A" : "NORMAL" }), onRight: () => setRetro({ hgButtonMode: draft.retro.hgButtonMode === "NORMAL" ? "L=A" : "NORMAL" }), note: "HeartGold 2-way (pokeheartgold options_app.c sNumChoicesPerMenuEntry button entry = 2; msg_0045 NORMAL / L=A). No LR exists in HG." },
          { label: "PLAT BUTTON MODE", value: draft.retro.platButtonMode, onLeft: () => setRetro({ platButtonMode: cycle(["NORMAL", "START=X", "L=A"], draft.retro.platButtonMode, -1) }), onRight: () => setRetro({ platButtonMode: cycle(["NORMAL", "START=X", "L=A"], draft.retro.platButtonMode, 1) }), note: "Platinum 3-way (pokeplatinum game_options.h OPTIONS_BUTTON_MODE_NORMAL / START_IS_X / L_IS_A). Emerald/FireRed's middle value is LR instead." },
          { label: "FRAME SET", value: frameSet.name, onLeft: () => stepFrameSet(-1), onRight: () => stepFrameSet(1), note: "Frame-count presets: Crystal 8 (NUM_FRAMES), FireRed 10 (option_menu.c counts), Emerald/Ruby 20 (WINDOW_FRAMES_COUNT 20), HeartGold 20, Platinum 20. Changing the set clamps the FRAME setting into range." },
          { label: "OPTIONS LAYOUT", value: draft.retro.optionsLayout, onLeft: () => setRetro({ optionsLayout: cycle(["RED", "YELLOW", "CRYSTAL", "EMERALD", "FIRERED", "HEARTGOLD", "PLATINUM", "BLACK2"], draft.retro.optionsLayout, -1) }), onRight: () => setRetro({ optionsLayout: cycle(["RED", "YELLOW", "CRYSTAL", "EMERALD", "FIRERED", "HEARTGOLD", "PLATINUM", "BLACK2"], draft.retro.optionsLayout, 1) }), note: "Changes the GAME_OPTIONS panel chrome (header, frame badge, pinned note, grouping) to that game's options-screen layout. Full per-game geometries are in docs/menu-editor-layout-from-pokemon-code-20261027.md; the panel chrome is the honest scope here, not a full-screen port." },
          { label: "OPTIONS THEME", value: draft.retro.optionsTheme, onLeft: () => setRetro({ optionsTheme: cycle(["MOCHII", "EMERALD", "FIRERED", "HEARTGOLD", "PLATINUM", "BLACK2"], draft.retro.optionsTheme, -1) }), onRight: () => setRetro({ optionsTheme: cycle(["MOCHII", "EMERALD", "FIRERED", "HEARTGOLD", "PLATINUM", "BLACK2"], draft.retro.optionsTheme, 1) }), note: "GAME_OPTIONS panel theme. Emerald bg RGB(17,18,31) is exact; FireRed/HG/Platinum triples and BW2 row palettes 3/1/0/1/3 are index-mapped shades, labelled as approximations." },
          { label: "C-GEAR (BW2 SAVE FIELD)", value: "NOT A PANEL ROW", note: "Black 2 Config.cgearOn is set from the start menu's continue question, NOT from config_panel.c — shown here so it is never mistaken for a panel row." },
          { label: "KANJI / LANGUAGE (BW2 SAVE FIELD)", value: "NOT A PANEL ROW", note: "Black 2 Config.kanji is a save field (Config_SetKanji), not a config_panel.c row — likewise not a fake row." },
          { label: "TEXT DELAYS (HG/DIAMOND)", value: "8 / 4 / 1 FRAMES", note: "HeartGold + Diamond options.c Options_GetTextFrameDelay: SLOW 8, MID 4, FAST 1 frames per char. PLAY TYPE SAMPLE below the rows types MOCHII at the current TEXT SPEED so the delay is visible, not just a label." },
        ];
      }
      case "ACCESS": {
        const setAccess = (patch: Partial<MenuEditorConfig["access"]>) => setDraft((d) => ({ ...d, access: { ...d.access, ...patch } }));
        return [
          { label: "REDUCED MOTION", value: draft.access.reducedMotion ? "ON" : "OFF", onLeft: () => setAccess({ reducedMotion: !draft.access.reducedMotion }), onRight: () => setAccess({ reducedMotion: !draft.access.reducedMotion }), note: "Freezes preview animation (symbols, cloud bob, Mochii bob). The preview ALSO freezes when the OS prefers reduced motion, with no toggle needed." },
          { label: "HIGH CONTRAST", value: draft.access.highContrast ? "ON" : "OFF", onLeft: () => setAccess({ highContrast: !draft.access.highContrast }), onRight: () => setAccess({ highContrast: !draft.access.highContrast }), note: "Preview panels go white with 4px black borders and black letters, ignoring fills, so labels stay legible over any fill." },
          { label: "TOUCH TARGET SIZE", value: draft.access.touchSize, onLeft: () => setAccess({ touchSize: cycle(["S", "M", "L"] as const, draft.access.touchSize, -1) }), onRight: () => setAccess({ touchSize: cycle(["S", "M", "L"] as const, draft.access.touchSize, 1) }), note: "Editor row height: S 44px, M 56px, L 68px. Applies to every editor panel row." },
          { label: "PREVIEW FONT SCALE", value: `${Math.round(draft.access.fontScale * 100)}%`, ...nudge(draft.access.fontScale, (v) => setAccess({ fontScale: v }), 0.05, 0.85, 1.3), note: "Multiplies preview label sizes (menu labels + CONTINUE sublabel)." },
          { label: "FOCUS RING", value: draft.access.focusRing ? "ON" : "OFF", onLeft: () => setAccess({ focusRing: !draft.access.focusRing }), onRight: () => setAccess({ focusRing: !draft.access.focusRing }), note: "When ON, keyboard focus on any editor control shows a thick yellow ring. Tab order follows visual row order in every panel." },
        ];
      }
      default:
        return [];
    }
  };

  const activeRows = useMemo(() => rowsFor(activePanel), [activePanel, draft, settings, library, filter, libName, libLayer, libQuery, libKind, libPiece, libSection, renamingId, renameText]); // eslint-disable-line react-hooks/exhaustive-deps
  const safeCursor = Math.min(cursor, Math.max(0, activeRows.length - 1));

  useEffect(() => { setCursor(0); }, [activePanel]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return; // typing targets exempt
      if ((e.key === "z" || e.key === "Z") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
      if ((e.key === "y" || e.key === "Y") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); redo(); return; }
      const rows = rowsFor(activePanel);
      const cur = rows[Math.min(cursor, Math.max(0, rows.length - 1))];
      if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => (c - 1 + rows.length) % rows.length); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => (c + 1) % rows.length); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); cur?.onLeft?.(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); cur?.onRight?.(); }
      else if (e.key === "Enter") { e.preventDefault(); if (cur?.onSelect) cur.onSelect(); else cur?.onRight?.(); }
      else if (e.key === "Escape" || e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (activePanel === "EDITOR") saveAndBack();
        else closePanel(activePanel);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanel, cursor, draft, settings, library, filter, libName, libLayer]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      setPanels((ps) => ps.map((p) => {
        if (p.id !== d.id) return p;
        if (d.kind === "resize") return { ...p, w: clampNum(d.startW + (e.clientX - d.startX), 240, 900) };
        const snap = (v: number) => (lastDraft.current.editor.snap ? Math.round(v / 10) * 10 : v);
        return {
          ...p,
          x: clampNum(snap(e.clientX - d.dx), 0, Math.max(0, window.innerWidth - 120)),
          y: clampNum(snap(e.clientY - d.dy), 0, Math.max(0, window.innerHeight - 60)),
        };
      }));
    };
    const up = () => {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d) return;
      // One history entry per drag/resize: persist geometry into the draft (saved per preset on SAVE).
      const p = panelsRef.current.find((x) => x.id === d.id);
      if (p) setEditorGeom(d.id, { x: p.x, y: p.y, w: p.w });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setDraft((d) => ({ ...d, editor: { ...d.editor, previewScale: clampNum(d.editor.previewScale * (e.deltaY < 0 ? 1.1 : 0.9), 0.25, 2) } }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const panelTitle = (id: PanelId): string => {
    switch (id) {
      case "EDITOR": return "MENU EDITOR";
      case "CLOUD": return "CLOUD";
      case "SYMBOLS": return "SYMBOLS + ANIMATION";
      case "EMBLEMS": return "LOGO EMBLEMS";
      case "PANELS": return "PANELS";
      case "LOGO": return "LOGO SLOT";
      case "MOCHII": return "MOCHII CUE";
      case "FADE": return "BACKGROUND FADE";
      case "LAYERS": return "LAYERS";
      case "TITLE": return "TITLE";
      case "TEXT": return "TEXT STRINGS";
      case "FONTS": return "FONTS";
      case "PAUSE": return "PAUSE MENU";
      case "MOCHIOTEKA": return "MOCHIOTEKA";
      case "GAME_OPTIONS": return "GAME OPTIONS";
      case "RETRO_OPTIONS": return "RETRO OPTIONS (GEN 1–5 + BW2)";
      case "ACCESS": return "ACCESSIBILITY";
      case "LIBRARY": return "LIBRARY";
      case "EXPORT": return "EXPORT";
    }
  };

  const renderPanel = (p: PanelState) => {
    const isActive = p.id === activePanel;
    const rows = p.id === activePanel ? activeRows : rowsFor(p.id);
    const cur = rows[Math.min(cursor, Math.max(0, rows.length - 1))];
    const geom = geomOf(p.id);
    const width = Math.round(geom.w * geom.scale);
    const ghost = geom.ghost || draft.editor.ghost;
    return (
      <div
        key={p.id}
        className="absolute z-20 rounded-lg overflow-hidden shadow-2xl"
        style={{
          left: p.x, top: p.y, width,
          opacity: ghost ? 0.45 : geom.opacity,
          background: "rgba(22, 35, 58, 0.96)", border: p.id === "EDITOR" ? "2px solid #facc15" : "2px solid #ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.65)",
          fontFamily: EDITOR_FONT, fontStyle: "normal",
        }}
        onPointerDown={() => { setActivePanel(p.id); }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing touch-none"
          style={{ background: "#0b1226" }}
          onPointerDown={(e) => {
            dragRef.current = { id: p.id, dx: e.clientX - p.x, dy: e.clientY - p.y };
          }}
        >
          <span className="font-black tracking-widest text-white text-sm">☰ {panelTitle(p.id)}</span>
          <span className="flex gap-1 items-center">
            <button
              className="px-1 py-1 text-white font-bold min-h-[32px] text-xs"
              onClick={(e) => { e.stopPropagation(); setEditorGeom(p.id, { scale: clampNum(geom.scale - 0.1, 0.5, 2) }); }}
              aria-label="Shrink panel"
            >−</button>
            <span className="text-yellow-300 font-bold text-xs">{Math.round(geom.scale * 100)}%</span>
            <button
              className="px-1 py-1 text-white font-bold min-h-[32px] text-xs"
              onClick={(e) => { e.stopPropagation(); setEditorGeom(p.id, { scale: clampNum(geom.scale + 0.1, 0.5, 2) }); }}
              aria-label="Grow panel"
            >+</button>
            <button
              className="px-2 py-1 text-white font-bold min-h-[32px]"
              onClick={(e) => { e.stopPropagation(); setEditorGeom(p.id, { ghost: !ghost }); }}
              aria-label={ghost ? "Make panel solid" : "Ghost panel (see preview through it)"}
              title="Ghost: semi-transparent so the preview behind stays visible"
            >◐</button>
            <button
              className="px-2 py-1 text-white font-bold min-h-[32px]"
              onClick={(e) => { e.stopPropagation(); setPanels((ps) => ps.map((x) => (x.id === p.id ? { ...x, minimized: !x.minimized } : x))); }}
              aria-label={p.minimized ? "Restore panel" : "Minimize panel"}
            >{p.minimized ? "▢" : "—"}</button>
            <button
              className="px-2 py-1 text-white font-bold min-h-[32px]"
              onClick={(e) => { e.stopPropagation(); closePanel(p.id); }}
              aria-label="Close panel"
            >✕</button>
          </span>
        </div>
        {!p.minimized && (
          <div className="p-2 max-h-[62vh] overflow-y-auto">
            {p.id === "EDITOR" && (
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Find a section… (title, cloud, pause…)"
                className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 text-white min-h-[44px] mb-2"
              />
            )}
            {rows.map((row, i) => (
              <button
                key={`${row.label}-${i}`}
                onClick={() => { setCursor(i); if (row.onSelect) row.onSelect(); }}
                onMouseEnter={() => setCursor(i)}
                className={`w-full text-left px-2 py-2 flex justify-between items-center gap-2 rounded ${isActive && i === safeCursor ? "bg-white/10 ring-2 ring-yellow-300" : ""}`}
                style={{ minHeight: TOUCH_MIN[draft.access.touchSize], fontFamily: EDITOR_FONT, fontStyle: "normal" }}
              >
                <span className="font-bold tracking-wide text-xs text-white flex-1">
                  {isActive && i === safeCursor ? "► " : ""}{row.label}
                </span>
                {row.inputKind ? (
                  <input
                    type={row.inputKind === "color" ? "color" : "text"}
                    value={row.inputValue ?? ""}
                    onChange={(e) => row.onInput?.(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/40 border border-white/30 rounded px-2 py-1 text-yellow-300 font-bold text-xs"
                    style={{ width: row.inputKind === "color" ? 56 : 150 }}
                  />
                ) : (
                  <span className="flex items-center gap-1">
                    {row.onLeft && <span className="text-cyan-300 font-bold" onClick={(e) => { e.stopPropagation(); setCursor(i); row.onLeft?.(); }}>◄</span>}
                    <span className="text-yellow-300 font-bold text-xs text-right" style={{ whiteSpace: "nowrap" }}>{row.value}</span>
                    {row.onRight && <span className="text-cyan-300 font-bold" onClick={(e) => { e.stopPropagation(); setCursor(i); row.onRight?.(); }}>►</span>}
                  </span>
                )}
              </button>
            ))}
            {isActive && cur?.note && (
              <div className="px-2 py-2 text-xs text-slate-200">{cur.note}</div>
            )}
            {p.id === "LIBRARY" && (
              <div className="px-2 pb-2">
                <input
                  value={libQuery}
                  onChange={(e) => setLibQuery(e.target.value)}
                  placeholder="Search library by name or section…"
                  className="w-full bg-black/40 border border-white/30 rounded px-3 py-2 text-white min-h-[44px] mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  {["", "template", "theme", "layer", "piece", "background"].map((k) => (
                    <button key={k || "all"} onClick={() => setLibKind(k as typeof libKind)} className={`px-2 py-1 rounded text-xs font-bold ${libKind === k ? "bg-yellow-300 text-black" : "bg-white/10 text-white"}`}>
                      {k === "" ? "ALL" : k.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-300 mt-2">Showing {searchLibrary(library, libQuery, libKind).length} of {library.length} entries.</div>
              </div>
            )}
            {p.id === "RETRO_OPTIONS" && (
              <div className="px-2 pb-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200">PRINT SWATCH ({draft.retro.printBrightness}):</span>
                  <span className="inline-block w-16 h-6 rounded border border-white/40" style={{ background: PRINT_SWATCH[draft.retro.printBrightness] }} />
                </div>
                {draft.retro.menuAccount && (
                  <div className="border border-dashed border-white/50 rounded px-2 py-1 text-xs text-slate-200">
                    MENU ACCOUNT BOX — Gen 2 box outline at tile (0,13), 5×10 (pokecrystal start_menu.asm). Contents not ported, not guessed.
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-yellow-300 text-black rounded text-xs font-bold min-h-[44px]" onClick={() => playTypeSample()}>PLAY TYPE SAMPLE</button>
                  <span className="text-xs text-slate-200 font-mono">{typedSample}</span>
                </div>
              </div>
            )}
            {p.id === "GAME_OPTIONS" && (
              <div className="px-2 pb-2 space-y-2">
                <div className="text-xs font-bold tracking-widest" style={{ color: OPTIONS_THEMES[draft.retro.optionsTheme]?.header ?? "#facc15" }}>
                  {draft.retro.optionsLayout} LAYOUT · {draft.retro.optionsTheme} THEME
                </div>
                <div className="rounded px-2 py-2 text-xs" style={{ background: OPTIONS_THEMES[draft.retro.optionsTheme]?.bg ?? "#11121f", color: OPTIONS_THEMES[draft.retro.optionsTheme]?.text ?? "#e2e8f0" }}>
                  {draft.retro.optionsLayout === "RED" && "Red grouping: TEXT SPEED / BATTLE ANIMATION / BATTLE STYLE, then CANCEL — no sound, print, or frame rows (pokered main_menu.asm)."}
                  {draft.retro.optionsLayout === "YELLOW" && "Yellow rows: TEXT SPEED / BATTLE ANIMATION / BATTLE STYLE / SOUND / PRINT / CANCEL (pokeyellow options.asm)."}
                  {draft.retro.optionsLayout === "CRYSTAL" && "Crystal rows: TEXT SPEED / BATTLE ANIMATION / BATTLE STYLE / SOUND / PRINT / MENU ACCOUNT / FRAME, then CANCEL (pokecrystal options_menu.asm)."}
                  {draft.retro.optionsLayout === "EMERALD" && "Emerald chrome: header (2,1) 26×2 + options window (2,5) 26×14, rows 16px, choices right-aligned at x=104 (option_menu.c)."}
                  {draft.retro.optionsLayout === "FIRERED" && "FireRed chrome: text window (2,3) 26×2 + options window (2,7) 26×12 + help bar at the bottom (option_menu.c)."}
                  {draft.retro.optionsLayout === "HEARTGOLD" && "HeartGold chrome: title (1,0) 12×3 + options (1,3) 30×18 + confirm/quit buttons at y=21 + frame/test window (2,19) 27×4 (options_app.c)."}
                  {draft.retro.optionsLayout === "PLATINUM" && "Platinum chrome: title (1,0) 12×2 + entries (1,3) 30×14 + pinned description (2,19) 27×4 (options_menu.c)."}
                  {draft.retro.optionsLayout === "BLACK2" && "Black 2 chrome: message window (1,19) 30×4 + confirm window (1,1) 30×4 + title bar (0,0) 16×3, row palettes 3/1/0/1/3 (config_panel.c)."}
                </div>
                {draft.retro.optionsLayout === "CRYSTAL" && (
                  <div className="flex justify-end"><span className="text-xs font-bold bg-white/10 rounded px-2 py-1 text-yellow-300">FRAME {settings.frame} (badge at tile (16,15))</span></div>
                )}
                {draft.retro.optionsTheme === "BLACK2" && (
                  <div className="flex gap-1">{[3, 1, 0, 1, 3].map((pal, i) => (<span key={i} className="flex-1 h-3 rounded" style={{ background: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"][pal] }} title={`Row palette ${pal}`} />))}</div>
                )}
              </div>
            )}
          </div>
        )}
        {!p.minimized && (
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize touch-none"
            style={{ background: "linear-gradient(135deg, transparent 50%, #facc15 50%)" }}
            title="Drag to resize panel width (240–900px)"
            onPointerDown={(e) => {
              e.stopPropagation();
              dragRef.current = { id: p.id, kind: "resize", startW: geom.w, startX: e.clientX };
            }}
          />
        )}
      </div>
    );
  };

  const minimized = panels.filter((p) => p.minimized);

  return (
    <div className={`game-screen bg-[#050810] relative overflow-hidden flex flex-col ${draft.access.focusRing ? "menu-editor-focus" : ""}`} style={{ minHeight: "100%", fontFamily: EDITOR_FONT, fontStyle: "normal" }}>
      {draft.access.focusRing && (<style>{`.menu-editor-focus :focus { outline: 3px solid #facc15 !important; outline-offset: 2px; }`}</style>)}
      <div className="relative z-30 flex flex-wrap gap-2 items-center px-2 pt-2 pb-1 bg-[#050810]/85">
        <span className="text-white text-xs font-bold tracking-widest">PREVIEW {Math.round(draft.editor.previewScale * 100)}%</span>
        <input type="range" min={25} max={200} value={Math.round(draft.editor.previewScale * 100)} onChange={(e) => setPreviewScale(Number(e.target.value) / 100)} aria-label="Preview scale" className="w-32" />
        <button onClick={() => setPreviewScale(1)} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px]">RESET 100%</button>
        <button onClick={() => setDraft((d) => ({ ...d, editor: { ...d.editor, ghost: !d.editor.ghost } }))} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px]">GHOST {draft.editor.ghost ? "ON" : "OFF"}</button>
        <button onClick={parkPanels} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px]">PARK PANELS</button>
        <button onClick={minimizeAll} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px]">MINIMIZE ALL</button>
        <button onClick={undo} disabled={undoStack.length === 0} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px] disabled:opacity-40">UNDO</button>
        <button onClick={redo} disabled={redoStack.length === 0} className="px-2 py-1 rounded bg-white/10 text-white text-xs font-bold min-h-[44px] disabled:opacity-40">REDO</button>
        <span className="text-slate-300 text-xs">SNAP {draft.editor.snap ? "10px ON" : "OFF"} · pinch to zoom the preview · Ctrl+wheel zooms too</span>
      </div>
      <input
        id="menu-editor-lib-import"
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            const item = parseLibraryJson(await f.text());
            const items = [...loadLibrary().filter((i) => i.id !== item.id), item];
            saveLibrary(items);
            setLibrary(items);
            setSavedMsg(`Imported ${item.kind}: ${item.name}. Load it from the LIBRARY panel.`);
          } catch (err) {
            setSavedMsg(`Import failed: ${err instanceof Error ? err.message : String(err)}`);
          }
          e.target.value = "";
        }}
      />
      <input
        id="menu-editor-working-import"
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            const parsed = JSON.parse(await f.text()) as Partial<MenuEditorConfig>;
            const base = lockedMenuEditorConfig();
            setDraft({ ...base, ...parsed, name: parsed.name || "Imported Preset" });
            setSavedMsg("Imported working preset into the draft. Preview updates live; save to make it the working preset.");
          } catch {
            setSavedMsg("Import failed: that file is not a menu preset JSON object.");
          }
          e.target.value = "";
        }}
      />
      <div
        ref={previewWrapRef}
        className="relative z-0 flex-1 overflow-y-auto p-2"
        onTouchStart={onPinchStart}
        onTouchMove={onPinchMove}
        onTouchEnd={onPinchEnd}
      >
        <div className="text-center text-white text-xs tracking-widest py-1">
          LIVE PREVIEW BEHIND — every change shows here as you make it, no apply step · drag a panel by its header · — minimizes · ◐ ghosts · ✕ closes (B also closes)
        </div>
        <div className="text-center text-slate-300 text-xs py-1">
          Preview labels default LEFT with #206 margins. The real menu on main now carries #206 (merged 2026-10-27); this branch still centers until the #260 merge reconciles with it — that gap is stated here, not hidden.
        </div>
        <MenuStagePreview cfg={draft} userScale={draft.editor.previewScale} onOpenPanels={() => openPanel("PANELS")} />
        {busy && <div className="text-center text-teal-300 text-sm font-bold py-2">{busy}</div>}
        {savedMsg && <div className="text-center text-teal-300 text-sm font-bold py-2">{savedMsg}</div>}
        <div className="text-center text-slate-300 text-xs py-1">A: SELECT · LEFT/RIGHT: CHANGE · B: CLOSE PANEL (EDITOR panel: SAVE + BACK)</div>
      </div>
      {panels.filter((p) => !p.minimized).map(renderPanel)}
      {minimized.length > 0 && (
        <div className="relative z-30 flex gap-2 flex-wrap px-2 pb-2">
          {minimized.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPanels((ps) => ps.map((x) => (x.id === p.id ? { ...x, minimized: false } : x))); setActivePanel(p.id); }}
              className="px-3 py-2 rounded bg-[#16233a] border border-white/50 text-white text-xs font-bold min-h-[44px]"
            >▢ {panelTitle(p.id)}</button>
          ))}
        </div>
      )}
    </div>
  );
}
