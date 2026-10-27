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
  type MenuEditorConfig, type PanelKey, type LayerId, type LibraryKind,
  lockedMenuEditorConfig, loadWorkingConfig, saveWorkingConfig,
  getActiveMenuConfig, loadLibrary, saveLibrary, addLibraryItem, deleteLibraryItem,
  themeFromConfig, applyTheme, layerSlice, applyLayerSlice,
  backgroundSlice, applyBackgroundSlice, parseLibraryJson, downloadJson,
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
  | "LIBRARY" | "EXPORT" | "GAME_OPTIONS";

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

/** Live preview of the menu being edited, rendered FROM the draft. */
function MenuStagePreview({ cfg, onOpenPanels }: { cfg: MenuEditorConfig; onOpenPanels: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(r.width / 1200, 620 / 1500));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const zOf = (id: LayerId) => cfg.layers[id].order;
  const vis = (id: LayerId) => cfg.layers[id].visible;
  // Preview fidelity: the real menu hides CONTINUE when no saves
  // exist (fresh profile) — the preview does the same, so the
  // preview never shows a panel the real menu would not show.
  const hasSaves = getSlotSummaries().some((s) => s !== null);
  return (
    <div ref={wrapRef} className="w-full" style={{ height: 1500 * scale }}>
      <div className="relative overflow-hidden bg-white" style={{ width: 1200, height: 1500, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {vis("arcs") || vis("symbols") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: Math.min(zOf("arcs"), zOf("symbols")) }}>
            <MainMenuBackground config={cfg} />
          </div>
        ) : null}
        {vis("emblems") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: zOf("emblems"), pointerEvents: "none" }}>
            <svg width={1200} height={1500}>
              {cfg.emblems.filter((e) => e.visible).map((e) => (
                <g key={e.id} transform={`translate(${e.x - e.w / 2},${e.y - e.h / 2})`}>{emblemShape(e.kind, e.color, e.w, e.h)}</g>
              ))}
            </svg>
          </div>
        ) : null}
        {vis("logo") ? (
          <img src={menuLogoUrl} alt="" className="absolute object-contain" style={{ left: cfg.logo.x, top: cfg.logo.y, width: cfg.logo.w, zIndex: zOf("logo"), pointerEvents: "none" }} />
        ) : null}
        {vis("cloud") ? (
          <span className="absolute" style={{ left: cfg.cloud.frameX, top: cfg.cloud.frameY, zIndex: zOf("cloud") }}>
            <img src={cloudUrl} alt="" style={{ width: cfg.cloud.frameW, height: cfg.cloud.frameH, objectFit: "fill", pointerEvents: "none" }} />
          </span>
        ) : null}
        {vis("mochii") ? (
          <img src={mochiiUrl} alt="" className="absolute object-contain" style={{ left: cfg.mochii.x, top: cfg.mochii.y, width: cfg.mochii.w, height: cfg.mochii.h, zIndex: zOf("mochii"), pointerEvents: "none" }} />
        ) : null}
        {vis("panels") ? (
          <div className="absolute" style={{ left: 0, top: 0, width: 1200, height: 1500, zIndex: zOf("panels") }}>
            {PANEL_KEYS.filter((key) => key !== "CONTINUE" || hasSaves).map((key) => {
              const p = cfg.panels[key];
              return (
                <button
                  key={key}
                  onClick={onOpenPanels}
                  className="absolute flex flex-col items-center justify-center cursor-pointer"
                  style={{
                    left: p.x, top: p.y, width: p.w, height: p.h, background: p.fill,
                    border: `${cfg.panelStyle.borderWidth}px solid #000`,
                    borderRadius: cfg.panelStyle.borderRadius,
                    fontFamily: cfg.panelStyle.panelFont === "locked" ? '"Trebuchet MS", Arial, sans-serif' : undefined,
                  }}
                >
                  <span className="text-black font-extrabold" style={{ fontSize: p.labelSize }}>{p.label}</span>
                  {key === "CONTINUE" ? (
                    <span className="text-black" style={{ fontSize: 19 }}>{cfg.continueSublabel}</span>
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
  minimized: boolean;
}

export default function MenuEditorScreen({ onBack, onViewTitle }: { onBack: () => void; onViewTitle?: () => void }) {
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);
  const [draft, setDraft] = useState<MenuEditorConfig>(() => getActiveMenuConfig());
  // Entry snapshot (Black 2 discipline): the config the editor
  // opened with. DISCARD restores it; Quit/Save never silently
  // keep HeartGold's live-leak behaviour.
  const entrySnapshot = useRef(draft);
  const [panels, setPanels] = useState<PanelState[]>([{ id: "EDITOR", x: 8, y: 8, minimized: false }]);
  const [activePanel, setActivePanel] = useState<PanelId>("EDITOR");
  const [cursor, setCursor] = useState(0);
  const [savedMsg, setSavedMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [libName, setLibName] = useState("My Menu 1");
  const [libLayer, setLibLayer] = useState<LayerId>("cloud");
  const [library, setLibrary] = useState(() => loadLibrary());
  const [busy, setBusy] = useState("");
  const dragRef = useRef<{ id: PanelId; dx: number; dy: number } | null>(null);

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
      return [...ps, { id, x: 24, y: 120, minimized: false }];
    });
    setActivePanel(id);
    setCursor(0);
  };
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
      case "EMBLEMS":
        return draft.emblems.flatMap((e) => [
          { label: `${e.id.toUpperCase()} X`, value: String(e.x), ...nudge(e.x, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, x: v } : x)) })), 5, 0, 1200), note: "X/Y are the emblem's CENTRE (v32 picture placements are centres; hearts corrected to PR #261's measured centres, blue (169,421.5) pink (230,640.5))." },
          { label: `${e.id.toUpperCase()} Y`, value: String(e.y), ...nudge(e.y, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, y: v } : x)) })), 5, 0, 1500) },
          { label: `${e.id.toUpperCase()} W`, value: String(e.w), ...nudge(e.w, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, w: v } : x)) })), 1, 5, 200) },
          { label: `${e.id.toUpperCase()} H`, value: String(e.h), ...nudge(e.h, (v) => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, h: v } : x)) })), 1, 5, 200) },
          { label: `${e.id.toUpperCase()} VISIBLE`, value: e.visible ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, visible: !x.visible } : x)) })), onRight: () => setDraft((d) => ({ ...d, emblems: d.emblems.map((x) => (x.id === e.id ? { ...x, visible: !x.visible } : x)) })), note: e.id === "star-top" ? "Top sparkle: v32 picture HAS this star; the matched proof has none there. Mars's call is still open — OFF is one toggle here." : "Blue + pink hearts sit by the logo at the v32 picture placements (Mars 2026-10-26 19:54 CDT); move them on the LAYERS panel's order row if the hearts job lands a different picture layer." },
        ]);
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
          { label: "CORNER SPARKLES", value: draft.pause.sparkles ? "ON" : "OFF", onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, sparkles: !d.pause.sparkles } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, sparkles: !d.pause.sparkles } })), note: "Pause menu stays a window over the world (Pokemon start-menu pattern) — the editor edits its values, not its form." },
          ...draft.pause.order.flatMap((key) => [
            { label: `${key.toUpperCase()} LABEL`, value: draft.pause.labels[key] ?? key, inputKind: "text" as const, inputValue: draft.pause.labels[key] ?? key, onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, labels: { ...d.pause.labels, [key]: v } } })) },
            { label: `${key.toUpperCase()} HELP`, value: draft.pause.help[key] ?? "", inputKind: "text" as const, inputValue: draft.pause.help[key] ?? "", onInput: (v) => setDraft((d) => ({ ...d, pause: { ...d.pause, help: { ...d.pause.help, [key]: v } } })) },
            { label: `${key.toUpperCase()} VISIBLE`, value: draft.pause.visible[key] === false ? "OFF" : "ON", onLeft: () => setDraft((d) => ({ ...d, pause: { ...d.pause, visible: { ...d.pause.visible, [key]: !(d.pause.visible[key] !== false) } } })), onRight: () => setDraft((d) => ({ ...d, pause: { ...d.pause, visible: { ...d.pause.visible, [key]: !(d.pause.visible[key] !== false) } } })) },
            { label: `${key.toUpperCase()} MOVE`, value: "▲ / ▼", onLeft: () => moveItem(key, -1), onRight: () => moveItem(key, 1), note: "Reorder is a Mochiichao extension (Pokemon list menus do not reorder) — labelled X, not a Pokemon option." },
          ]),
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
        const saveKind = (kind: LibraryKind) => {
          if (kind === "template") addLibraryItem("template", libName, draft);
          else if (kind === "theme") addLibraryItem("theme", libName, themeFromConfig(draft, {
            main: settings.mainFont as string, menu: settings.menuFont as string,
            dialogue: settings.dialogueFont as string, small: settings.smallFont as string,
            bold: settings.boldFont as string, battle: settings.battleFont as string,
          }));
          else if (kind === "layer") addLibraryItem("layer", `${libName} — ${LAYER_LABELS[libLayer]}`, { layer: libLayer, slice: layerSlice(draft, libLayer) });
          else addLibraryItem("background", libName, backgroundSlice(draft));
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
          } else if (item.kind === "background") setDraft((d) => applyBackgroundSlice(d, item.data));
          setSavedMsg(`Loaded ${item.kind}: ${item.name}. Preview updates live; save to make it the working preset.`);
        };
        return [
          { label: "LIBRARY NAME", value: libName, inputKind: "text" as const, inputValue: libName, onInput: setLibName },
          { label: "LAYER TO SAVE", value: LAYER_LABELS[libLayer], onLeft: () => setLibLayer(cycle(LAYER_IDS, libLayer, -1)), onRight: () => setLibLayer(cycle(LAYER_IDS, libLayer, 1)), note: "Saving ONE layer saves only that layer. Loading it patches only that layer in the draft." },
          { label: "SAVE AS TEMPLATE", value: "SAVE", onLeft: () => saveKind("template"), onRight: () => saveKind("template"), onSelect: () => saveKind("template"), note: "Whole menu config, reusable later." },
          { label: "SAVE AS THEME", value: "SAVE", onLeft: () => saveKind("theme"), onRight: () => saveKind("theme"), onSelect: () => saveKind("theme"), note: "Colours + fonts only, no geometry." },
          { label: "SAVE AS LAYER", value: "SAVE", onLeft: () => saveKind("layer"), onRight: () => saveKind("layer"), onSelect: () => saveKind("layer") },
          { label: "SAVE AS BACKGROUND", value: "SAVE", onLeft: () => saveKind("background"), onRight: () => saveKind("background"), onSelect: () => saveKind("background"), note: "Arcs + fade + paper only." },
          ...library.flatMap((item) => [
            { label: `LOAD ${item.kind.toUpperCase()}: ${item.name}`, value: "LOAD ►", onLeft: () => loadItem(item.id), onRight: () => loadItem(item.id), onSelect: () => loadItem(item.id) },
            { label: `EXPORT ${item.kind.toUpperCase()}: ${item.name}`, value: "DOWNLOAD", onLeft: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item), onRight: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item), onSelect: () => downloadJson(`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, item) },
            { label: `DELETE ${item.kind.toUpperCase()}: ${item.name}`, value: "DELETE", onLeft: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, onRight: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, onSelect: () => { deleteLibraryItem(item.id); setLibrary(loadLibrary()); }, note: "Deletes only this library entry. Locked Default (v32) is never a library entry and can never be deleted here." },
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
          { label: "NOT ON THIS PANEL (PLAINLY)", value: "SEE NOTE", note: "Black 2 Config fields kanji (message language) and cgearOn exist in the struct but are NOT editable on Black 2's panel — likewise not added here as fake rows. Black 2's Save-Before-IR has no Mochiichao equivalent (no IR hardware) and is not ported. No volume/brightness slider exists in any of the three games' options — none is invented here." },
        ];
      }
      default:
        return [];
    }
  };

  const activeRows = useMemo(() => rowsFor(activePanel), [activePanel, draft, settings, library, filter, libName, libLayer]); // eslint-disable-line react-hooks/exhaustive-deps
  const safeCursor = Math.min(cursor, Math.max(0, activeRows.length - 1));

  useEffect(() => { setCursor(0); }, [activePanel]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return; // typing targets exempt
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
      setPanels((ps) => ps.map((p) => (p.id === d.id ? {
        ...p,
        x: clampNum(e.clientX - d.dx, 0, Math.max(0, window.innerWidth - 120)),
        y: clampNum(e.clientY - d.dy, 0, Math.max(0, window.innerHeight - 60)),
      } : p)));
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
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
      case "LIBRARY": return "LIBRARY";
      case "EXPORT": return "EXPORT";
    }
  };

  const renderPanel = (p: PanelState) => {
    const isActive = p.id === activePanel;
    const rows = p.id === activePanel ? activeRows : rowsFor(p.id);
    const cur = rows[Math.min(cursor, Math.max(0, rows.length - 1))];
    const width = Math.min(360, Math.max(300, window.innerWidth - 32));
    return (
      <div
        key={p.id}
        className="absolute z-20 rounded-lg overflow-hidden shadow-2xl"
        style={{
          left: p.x, top: p.y, width,
          background: "rgba(22, 35, 58, 0.96)", border: "2px solid #ffffff",
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
          <span className="flex gap-1">
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
                style={{ minHeight: 44, fontFamily: EDITOR_FONT, fontStyle: "normal" }}
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
          </div>
        )}
      </div>
    );
  };

  const minimized = panels.filter((p) => p.minimized);

  return (
    <div className="game-screen bg-[#050810] relative overflow-hidden flex flex-col" style={{ minHeight: "100%", fontFamily: EDITOR_FONT, fontStyle: "normal" }}>
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
      <div className="relative z-0 flex-1 overflow-y-auto p-2">
        <div className="text-center text-white text-xs tracking-widest py-1">
          LIVE PREVIEW — every change shows here as you make it · drag a panel by its header · — minimizes · ✕ closes (B also closes)
        </div>
        <MenuStagePreview cfg={draft} onOpenPanels={() => openPanel("PANELS")} />
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
