import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TYPE_COLORS, calcDamage, makeBattleMon, GAME_DATA as IMPORTED_GAME_DATA } from "./GameData";
import { FULL_WORLD } from "./FullWorldMaps";
import { useGameStore } from "../store/gameStore";
import PixiWorldCanvas from "../components/game/PixiWorldCanvas";
import type { NpcWalkState } from "../components/game/PixiWorldCanvas";
import CreaturePortrait from "../components/game/CreaturePortrait";
import { PauseMenu, WorldHud } from "../components/game/GameShell";
import { getDayPhase, DAY_TINT, DAY_AMBIENT, WEATHER_CONFIG } from "./WorldConstants";
import SaveMenu from "../components/SaveMenu";
import { saveGame, getSaves } from "../lib/saveSystem";
import { SPECIES_DB } from '../lib/species';
import { MOVES_DB } from '../lib/moves';
import { createMochii } from '../lib/engine';
import DialogueBox from "../components/game/DialogueBox";
import { isConfirmKey } from "../lib/buttonMode";
import { slotForNpc } from "../lib/humanSheets";
import { playMusic } from "../lib/music";

const TILE_SIZE = 40; // match PDF size because it renders better in viewports

// ── v4 game-flow helpers (implementation choices, NOT Mars canon) ──
// Starter table order, as the lab balls appear left to right.
export const STARTER_TABLE = ['001', '004', '007', '010', '038'];
const TYPE_DISPLAY: Record<string, string> = {
  WATER: 'Water', STEEL: 'Chrome', GROUND: 'Earth', FIRE: 'Flame', GRASS: 'Grass',
};
/**
 * Hex starter choice (audit-plan CHANGE, Pokemon-derived rule):
 * Hex picks the starter whose primary type is super-effective
 * against the player's starter — the rival counter-pick rule from
 * the decomp (FireRed/HeartGold rival takes the starter strong
 * against the player's), NOT table order. Starter primary types
 * come from species.ts itself (no new mapping invented):
 *   001 Mochii WATER, 004 Razorgater WATER/STEEL,
 *   007 Tyrage GROUND, 010 Kittember FIRE, 038 Sproutle GRASS.
 * Counter table (primary-type counter, classic trio + Water>Ground):
 *   WATER (001, 004) -> GRASS 038 (Grass beats Water)
 *   GROUND (007) -> WATER 001 (Water beats Ground)
 *   FIRE (010) -> WATER 001 (Water beats Fire)
 *   GRASS (038) -> FIRE 010 (Fire beats Grass)
 * TIE-BREAK, TEMPORARY PLACEHOLDER, NOT Mars canon: where two
 * starters share the counter type (both Water starters counter
 * Ground and Fire), the FIRST Water starter in table order (001)
 * is used. Mars must give the tie-break; do not call this canon.
 * nextStarterForHex is kept below ONLY as that labelled
 * placeholder helper — it is NOT the counter-pick rule, and it
 * must not be used for Hex's team (it would pick a non-counter
 * for Tyrage -> Kittember and Sproutle -> Mochii, i.e. a starter
 * the player's type beats). Level 5 stays (rival starter at
 * level 5 in the first lab battle). The team member is built
 * from SPECIES_DB via createMochii at level 5 and converted to
 * the WorldEngine trainer-battle flat format (atk/def/spd,
 * display move names, hp/maxHp) — no stats, types or moves are
 * invented; they are the species' own data at level 5.
 */
export const HEX_COUNTER_PICK: Record<string, string> = {
  '001': '038', '004': '038', '007': '001', '010': '001', '038': '010',
};
export function nextStarterForHex(playerSpeciesId: string): string {
  // TEMPORARY PLACEHOLDER ONLY (see counter-pick comment above):
  // table-order successor, kept for reference, NOT used for Hex.
  const i = STARTER_TABLE.indexOf(playerSpeciesId);
  return STARTER_TABLE[(i + 1) % STARTER_TABLE.length];
}
export function counterPickForHex(playerSpeciesId: string): string {
  return HEX_COUNTER_PICK[playerSpeciesId] || nextStarterForHex(playerSpeciesId);
}
export function hexTeamMember(playerSpeciesId: string): any | null {
  const hexId = counterPickForHex(playerSpeciesId);
  const sp: any = SPECIES_DB[hexId];
  const m = createMochii(hexId, 5);
  if (!sp || !m) return null;
  return {
    id: m.id, speciesId: hexId, name: sp.name,
    hp: m.hp, maxHp: m.maxHp,
    atk: m.stats.atk, def: m.stats.def, spd: m.stats.spe,
    moves: m.moves.map((id: string) => MOVES_DB[id]?.name || id),
    type: TYPE_DISPLAY[sp.types[0]] || sp.types[0],
    level: 5,
  };
}
/**
 * v5.2 trainer-stat fix: map trainer teams were hand-written on the
 * old GameData scale (flat atk/def ~35-65, HP ~30-50), while a player
 * party built by createMochii uses Pokemon-style level-scaled stats
 * (Lv.5 Mochii: atk 10, def 10, HP 20). Put through the same
 * calcDamage, a hand-written Tyrage (atk 40 vs player def 10) dealt
 * 15 while the player dealt 1 — that is a scale mismatch, not a
 * damage-formula bug (the formula is unchanged). Where a map team's
 * species id AND name both match SPECIES_DB, rebuild that member
 * with createMochii at the map level, so trainer, wild and player
 * creatures all use the same stat system and the same existing
 * species base stats — no new stats invented. Members whose id/name
 * do NOT match SPECIES_DB (e.g. Bug Catcher Rick's team now lists id
 * "016" named "Squirmite", which has no SPECIES_DB entry yet, so it
 * stays on map stats until a 016 code entry exists)
 * are left on their map stats unchanged and flagged in the PR body
 * as pre-existing map-data mismatches, not silently renamed.
 */
export function trainerBattleMon(m: any): any {
  const id = m.speciesId || m.id;
  const sp: any = (SPECIES_DB as any)[id];
  if (!sp || sp.name !== m.name) return m;
  const c = createMochii(id, m.level || 5);
  if (!c) return m;
  return {
    id: m.id, speciesId: id, name: sp.name,
    hp: c.hp, maxHp: c.maxHp, currentHp: c.hp,
    atk: c.stats.atk, def: c.stats.def, spd: c.stats.spe,
    moves: c.moves.map((mid: string) => (MOVES_DB as any)[mid]?.name || mid),
    type: m.type, level: c.level,
  };
}
/**
 * Battle move bridge (v4): WorldEngine's GAME_DATA.moves is keyed by
 * display name ("Tackle"), while a party built by createMochii carries
 * moveIds ("TACKLE"). Without this bridge every player move lookup
 * missed and the move did nothing. Resolution is display-name first,
 * then MOVES_DB by moveId (power = bp, type mapped to GameData
 * display names). The damage formula (calcDamage) is unchanged.
 */
export function resolveBattleMove(moveKey: string): { power: number; type: string; display: string } | null {
  const gd: any = (IMPORTED_GAME_DATA as any).moves?.[moveKey];
  if (gd) return { power: gd.power, type: gd.type, display: moveKey };
  const db: any = (MOVES_DB as any)[moveKey];
  if (db) return { power: db.bp, type: TYPE_DISPLAY[db.type] || db.type, display: db.name };
  // v5.3: caught wild creatures carry DISPLAY move names (see
  // triggerWildBattle, which maps moveIds through MOVES_DB names),
  // so a caught Sproutle's buttons are "Quick Attack" / "Vine
  // Lash", not "QUICK_ATTACK" / "VINE_LASH". Neither lookup above
  // matches a display name that is not in GAME_DATA.moves, so
  // those clicks resolved to null and doBattleAction returned
  // silently — the v5.2 playtest's PWR- moves that did nothing.
  // Third lookup: MOVES_DB by display name (existing move data
  // only, no power invented). Tackle already resolves via
  // GAME_DATA.moves, so this changes nothing for Tackle.
  const dbByName: any = Object.values(MOVES_DB as any).find((m: any) => m?.name && String(m.name).toLowerCase() === String(moveKey).toLowerCase());
  if (dbByName) return { power: dbByName.bp, type: TYPE_DISPLAY[dbByName.type] || dbByName.type, display: dbByName.name };
  return null;
}
/** Flat atk/def for calcDamage: MochiiInstance carries stats.*, not flat atk/def. */
export function battleStats(mon: any): any {
  return { ...mon, atk: mon.atk ?? mon.stats?.atk ?? 50, def: mon.def ?? mon.stats?.def ?? 50 };
}
/**
 * v5 battle-name fix: MochiiInstance carries `nickname`, NOT `name`
 * (createMochii sets nickname = species name). Battle code that read
 * bs.player.name therefore logged "undefined used Tackle!" /
 * "undefined took 4 damage!" in the v4 playtest, even though the
 * battle billboards already fell back to nickname. Resolve the
 * display name the same way everywhere: name, then nickname, then
 * the species name from SPECIES_DB. No stats, types or moves change.
 */
export function battleMonName(mon: any): string {
  if (!mon) return "Mochiichao";
  return mon.name || mon.nickname || SPECIES_DB[mon.speciesId || mon.id]?.name || "Mochiichao";
}

export function useDayNight(tickMs = 1000) {
  const [gameHour, setGameHour] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setGameHour(h => (h + 1) % 24);
    }, tickMs * 15);
    return () => clearInterval(interval);
  }, [tickMs]);
  const phase = getDayPhase(gameHour);
  return { gameHour, phase, tint: DAY_TINT[phase], ambient: DAY_AMBIENT[phase] };
}

export default function WorldEngine({ setView, setBattleEnemy }: { setView?: any, setBattleEnemy?: any }) {
  const gameState = useGameStore(s => s); // We need the whole state to save
  const { saveSlot, currentMap } = gameState;
  const party = useGameStore(s => s.party);
  const initializeStarter = useGameStore(s => s.initializeStarter);
  const badges = useGameStore(s => s.badges);
  const wallet = useGameStore(s => s.wallet);
  const dex = useGameStore(s => s.dex);
  const completedEvents = useGameStore(s => s.completedEvents);
  const defeatedTrainers = useGameStore(s => s.defeatedTrainers);
  const gainWallet = useGameStore(s => s.gainWallet);
  const addBadge = useGameStore(s => s.addBadge);
  const updateDex = useGameStore(s => s.updateDex);
  const completeEvent = useGameStore(s => s.completeEvent);
  const defeatTrainer = useGameStore(s => s.defeatTrainer);
  const healParty = useGameStore(s => s.healParty);
  const useItem = useGameStore(s => s.useItem);

  const playerPos = useGameStore(s => s.playerPos);
  const playerGender = useGameStore(s => s.playerGender);
  const rivalName = useGameStore(s => s.rivalName) || 'Hex';
  const setMapState = useGameStore(s => s.setMapState);
  // BUTTON MODE (buttonMode.ts): 'l' copies A when L_EQUALS_A.
  // LR shoulders have no list to flip on the field, so they do
  // nothing here (NEED, labelled in buttonMode.ts); the pause
  // menu itself has no keyboard selection to remap (NEED).
  const buttonMode = useGameStore(s => s.settings.buttonMode);

  const [screen, setScreen] = useState("overworld"); 

  // Wiring Batch 2 (2026-10-26): world / battle music follows the live
  // screen. battle -> battle track, overworld -> world track. Other
  // screens (dialogue, menus, save) leave the current track alone, so
  // music keeps playing under pause/menus. With no world/battle file
  // on main yet, both entries are null-src silence (see music.ts) —
  // the calls land now so the tracks start the day files land.
  useEffect(() => {
    if (screen === "battle") playMusic("battle");
    else if (screen === "overworld") playMusic("world");
  }, [screen]);

  const [playerDir, setPlayerDir] = useState("down");
  const [playerName, setPlayerName] = useState("Netrunner");
  
  const [battleState, setBattleState] = useState<any>(null);
  // v5.1: pending end-of-battle cleanup, run ONLY when the player
  // advances past the win/lose banner. Before v5.1 the "over" phase
  // auto-advanced on a 2000-2500ms timer, so a playtest that did not
  // screenshot inside that window never saw any banner — in all
  // three v5 playtest battles. The banner now blocks until the
  // player presses Continue (or Enter/Space), so it cannot be
  // missed by timing alone. No damage/catch/battle-flow change.
  const pendingBattleEndRef = React.useRef<(() => void) | null>(null);
  // Audit-plan blackout rule: last heal point visited (a healer
  // NPC's map), recorded when finishDialog heals. No such tracking
  // existed before this PR, so blackout used to return to the
  // current map's start and heal 30% — both removed below.
  const lastHealRef = React.useRef<{ map: string; pos: { x: number; y: number } } | null>(null);
  const finishBattleEnd = () => {
    const fn = pendingBattleEndRef.current;
    pendingBattleEndRef.current = null;
    if (fn) fn();
  };
  const [dialog, setDialog] = useState<any>(null);
  // v4: DialogueBox owns typing/page state internally. WorldEngine
  // only keeps this ref so the on-screen A button can advance the
  // box (keyboard Enter/Space is handled inside DialogueBox).
  const dialogAdvanceRef = React.useRef<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [menuTab, setMenuTab] = useState("team");
  const [notification, setNotification] = useState<any>(null);
  const [introStep, setIntroStep] = useState(0);
  const [nameInput, setNameInput] = useState("Netrunner");
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animWalk, setAnimWalk] = useState(0);
  const [heldDir, setHeldDir] = useState<{dx:number, dy:number} | null>(null);

  // ── NPC MOVEMENT, PRODUCER SIDE (PR #130 seam consumer) ──
  // FireRed template (PR #130 research): each map object event
  // carries movement_type + x_radius/y_radius around its spawn
  // tile, and the engine runs face -> move one tile -> random
  // medium delay -> pick a direction -> collision check -> walk.
  // Mochiichao map fields: `movement: "wander"` + `wanderRadius`
  // (one radius, used for both axes) on NPC entries in
  // FullWorldMaps.ts. Standing is the default: battle NPCs,
  // starter balls, display creatures, and staged story NPCs
  // carry no movement field and never get a state.
  // The tick below is WorldEngine's own clock (650ms) — it does
  // NOT piggyback on animWalk, which advances only on player
  // steps. Frame alternation still follows the seam's rule
  // (odd step = step frame, even = idle, layout from the slot).
  type NpcRuntime = {
    homeX: number; homeY: number;
    x: number; y: number;
    dir: NpcWalkState["dir"];
    step: number; moving: boolean; delay: number;
  };
  const npcRuntimeRef = React.useRef<Record<string, NpcRuntime>>({});
  const [npcStates, setNpcStates] = useState<Record<string, NpcWalkState>>({});
  // Refs so the tick callback stays stable while the player
  // walks (otherwise the interval would restart on every step
  // and wandering NPCs would rarely move).
  const npcStatesRef = React.useRef<Record<string, NpcWalkState>>({});
  const playerPosRef = React.useRef(playerPos);
  const currentMapRef = React.useRef(currentMap);
  const defeatedRef = React.useRef(defeatedTrainers);
  useEffect(() => { playerPosRef.current = playerPos; }, [playerPos]);
  useEffect(() => { defeatedRef.current = defeatedTrainers; }, [defeatedTrainers]);
  const npcFacingToDir = (facing: any): NpcWalkState["dir"] =>
    facing === "up" ? "back" : facing === "left" ? "left" : facing === "right" ? "right" : "front";
  // Reset wanderers to home on map/slot change (fresh world entry).
  useEffect(() => {
    currentMapRef.current = currentMap;
    const map: any = FULL_WORLD[currentMap] || FULL_WORLD["sector0"];
    const rt: Record<string, NpcRuntime> = {};
    const states: Record<string, NpcWalkState> = {};
    (map.npcs || []).forEach((n: any) => {
      if (n.movement !== "wander") return;
      const dir = npcFacingToDir(n.facing);
      rt[n.id] = { homeX: n.x, homeY: n.y, x: n.x, y: n.y, dir, step: 0, moving: false, delay: 1 + Math.floor(Math.random() * 3) };
      states[n.id] = { x: n.x, y: n.y, dir, moving: false, step: 0 };
    });
    npcRuntimeRef.current = rt;
    npcStatesRef.current = states;
    setNpcStates(states);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMap, saveSlot]);
  // Live position lookup: a wanderer's live tile wins over its
  // map (home) tile, so player collision, interaction, and the
  // interact prompt all agree with what the canvas renders.
  const npcAt = (x: number, y: number): any | undefined => {
    const map: any = FULL_WORLD[currentMapRef.current] || FULL_WORLD["sector0"];
    return (map.npcs || []).find((n: any) => {
      const s = npcStatesRef.current[n.id];
      return (s ? s.x : n.x) === x && (s ? s.y : n.y) === y;
    });
  };
  const npcTick = useCallback(() => {
    const map: any = FULL_WORLD[currentMapRef.current] || FULL_WORLD["sector0"];
    const rt = npcRuntimeRef.current;
    const wanderers: any[] = (map.npcs || []).filter((n: any) => n.movement === "wander" && !defeatedRef.current.includes(n.id));
    // Occupancy: static NPCs at map tiles, wanderers at live tiles.
    const occupied = new Set<string>();
    (map.npcs || []).forEach((n: any) => {
      if (defeatedRef.current.includes(n.id)) return;
      if (n.movement === "wander") return;
      occupied.add(`${n.x},${n.y}`);
    });
    wanderers.forEach((n: any) => {
      const r = rt[n.id];
      if (r) occupied.add(`${r.x},${r.y}`);
    });
    const DIRS = [
      { dx: 0, dy: 1, dir: "front" as const },
      { dx: 0, dy: -1, dir: "back" as const },
      { dx: -1, dy: 0, dir: "left" as const },
      { dx: 1, dy: 0, dir: "right" as const },
    ];
    const next: Record<string, NpcWalkState> = {};
    wanderers.forEach((n: any) => {
      const r = rt[n.id];
      if (!r) return;
      r.moving = false;
      if (r.delay > 0) {
        r.delay -= 1;
      } else {
        const d = DIRS[Math.floor(Math.random() * DIRS.length)];
        const tx = r.x + d.dx;
        const ty = r.y + d.dy;
        const radius = n.wanderRadius ?? 1;
        const tile = map.tiles?.[ty]?.[tx];
        const blocked =
          tx < 0 || ty < 0 || tx >= map.width || ty >= map.height ||
          tile === 1 || tile === 4 || tile === 2 ||
          (map.exits || []).some((e: any) => e.x === tx && e.y === ty) ||
          (map.doors || []).some((e: any) => e.x === tx && e.y === ty) ||
          occupied.has(`${tx},${ty}`) ||
          (tx === playerPosRef.current.x && ty === playerPosRef.current.y);
        if (blocked) {
          // WanderAround collision: re-face instead of walking.
          r.dir = d.dir;
          r.delay = 1 + Math.floor(Math.random() * 3);
        } else {
          occupied.delete(`${r.x},${r.y}`);
          occupied.add(`${tx},${ty}`);
          r.x = tx; r.y = ty; r.dir = d.dir; r.moving = true; r.step += 1;
          r.delay = 2 + Math.floor(Math.random() * 3);
        }
      }
      next[n.id] = { x: r.x, y: r.y, dir: r.dir, moving: r.moving, step: r.step };
    });
    npcStatesRef.current = next;
    setNpcStates(next);
  }, []);
  useEffect(() => {
    // NPCs freeze during battle, dialogue, menus, and map
    // transitions — notably, a wanderer never walks away while
    // the player is talking to it.
    if (screen !== "overworld" || pauseOpen || menuOpen || isTransitioning) return;
    const iv = setInterval(npcTick, 650);
    return () => clearInterval(iv);
  }, [screen, pauseOpen, menuOpen, isTransitioning, npcTick]);

  // Shims for backwards compatibility
  const playerTeam: any = party;
  const credits: any = wallet;
  const setPlayerTeam: any = (updater: any) => {
    useGameStore.setState(s => ({ party: typeof updater === 'function' ? updater(s.party) : updater }));
  };
  const setDex: any = (updater: any) => {
     useGameStore.setState(s => ({ dex: typeof updater === 'function' ? updater(s.dex) : updater }));
  };
  const setCompletedEvents: any = (updater: any) => {
     useGameStore.setState(s => ({ completedEvents: typeof updater === 'function' ? updater(s.completedEvents) : updater }));
  };
  const setDefeatedTrainers: any = (updater: any) => {
     useGameStore.setState(s => ({ defeatedTrainers: typeof updater === 'function' ? updater(s.defeatedTrainers) : updater }));
  };
  const setBadges: any = (updater: any) => {
     useGameStore.setState(s => ({ badges: typeof updater === 'function' ? updater(s.badges) : updater }));
  };
  const setCredits: any = (updater: any) => {
     useGameStore.setState(s => ({ wallet: typeof updater === 'function' ? updater(s.wallet) : updater }));
  };
  const GAME_DATA: any = {
    starters: [
      { id: "001", type: "Water", desc: "A soft, wave-patterned creature. It bounces instead of walking.", color: "#4fc3f7", name: "Mochii", hp: 45, atk: 49, def: 49, spd: 45 },
      { id: "004", type: "Chrome", desc: "Its razor-edged chrome plating deflects most data attacks.", color: "#b0bec5", name: "Razorgater", hp: 50, atk: 65, def: 64, spd: 43 },
      { id: "007", type: "Earth", desc: "A ground-shaking brute whose footsteps leave glowing cracks.", color: "#a5d6a7", name: "Tyrage", hp: 55, atk: 69, def: 45, spd: 34 }
    ],
    mochiichao: [],
    moves: IMPORTED_GAME_DATA.moves
  };

  const hasStarter = party.length > 0;
  const mapData = FULL_WORLD[currentMap] || FULL_WORLD['sector0'];
  const { gameHour, phase, tint, ambient } = useDayNight(1000);
  const weatherCfg = WEATHER_CONFIG[(mapData as any).weather ?? "clear"];

  // Playtest 2026-10-26 (attempt 6): autosaves are HELD for a START
  // OVER slot until the player saves manually — otherwise the first
  // world entry / map change already overwrote the old save the
  // dialogs promised to keep. No save, no "Game Autosaved" notice.
  const autosaveHeldForSlot = useGameStore(s => s.autosaveHeldForSlot);
  const setAutosaveHeldForSlot = useGameStore(s => s.setAutosaveHeldForSlot);
  // Tracks the last (slot, map) the map-change autosave has seen,
  // so it fires only on a real map change — never on mount, slot
  // change, or hold clear (see the map-change effect below).
  const prevMapRef = React.useRef<{ slot: number; map: string } | null>(null);
  useEffect(() => {
    // Autosave roughly every 60s
    const iv = setInterval(() => {
      if (autosaveHeldForSlot === saveSlot) return;
      // Only notify on a real write: saveGame returns null when
      // the central gate refuses an auto-write to a held slot
      // (e.g. a persisted hold restored after a reload). Notifying
      // on a refused write made a held slot look saved when it
      // was not, and hid the gate doing its job.
      const written = saveGame(saveSlot, 'auto', `AUTOSAVE - ${FULL_WORLD[currentMap]?.name || currentMap}`, useGameStore.getState());
      if (written) notify("Game Autosaved", "#88ccff");
    }, 60000);
    return () => clearInterval(iv);
  }, [saveSlot, currentMap, autosaveHeldForSlot]);

  useEffect(() => {
    // Autosave on a REAL map change only (held for a START OVER
    // slot — see above, plus the central gate in saveSystem).
    // Playtest 2026-10-26 (attempt 7): this effect used to fire on
    // mount and on every dependency change, so entering the world
    // after a LOAD immediately autosaved the loaded state back
    // with a fresh timestamp — the slot summary's content looked
    // held while its timestamp advanced, and a load-then-enter
    // autosave after a manual save would overwrite the manual
    // save's summary with the old loaded content, matching the
    // revert the playtest saw. Mount,
    // slot changes, and hold clears therefore write nothing here;
    // only an actual currentMap change does. The 60s interval
    // above still autosaves during play.
    const prev = prevMapRef.current;
    if (!prev || prev.slot !== saveSlot) {
      prevMapRef.current = { slot: saveSlot, map: currentMap };
      return;
    }
    if (prev.map === currentMap) return;
    prevMapRef.current = { slot: saveSlot, map: currentMap };
    if (autosaveHeldForSlot === saveSlot) return;
    saveGame(saveSlot, 'auto', `AUTOSAVE - Map Change`, useGameStore.getState());
  }, [saveSlot, currentMap, autosaveHeldForSlot]);

  // v4 Mom-first dialogue: on the first world entry in Sector 0 with
  // no partner yet, Mom speaks first (one DialogueBox, portrait),
  // pointing the player at the lab. It fires once (completedEvents
  // 'v4_mom_intro'), never for a loaded save that already has a
  // partner, and never again after the lab starter is chosen.
  const momIntroFired = React.useRef(false);
  useEffect(() => {
    if (momIntroFired.current) return;
    if (screen !== "overworld" || currentMap !== 'sector0' || hasStarter) return;
    if (completedEvents.includes('v4_mom_intro')) return;
    momIntroFired.current = true;
    setDialog({
      lines: [
        "Welcome home! Prof. Aeon is waiting at the lab, just north of here.",
        "Go see him before you head out — the tall grass is no place without a partner.",
        "Your journey starts in Sector 0. I will be right here when you need me.",
      ],
      isEvent: true,
      eventId: 'v4_mom_intro',
      npc: { id: "mom", name: "Mom" },
    });
    setScreen("dialog");
  }, [screen, currentMap, hasStarter, completedEvents]);

  const notify = (msg: string, color = "#ffd700") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2500);
  };

  const triggerWildBattle = useCallback((wildMonId: string): boolean => {
    const aliveIdx = playerTeam.findIndex((m: any) => (m.currentHp ?? m.hp) > 0);
    if (aliveIdx === -1) {
      notify("You have no Mochiichao able to battle!", "#f44336");
      return false;
    }

    const playerMon = playerTeam[aliveIdx];
    const sp = SPECIES_DB[wildMonId] || Object.values(SPECIES_DB)[0];
    const lvl = Math.max(1, playerMon.level + Math.floor(Math.random() * 3) - 1);
    // v5.2 wild-stat fix: the old code scaled RAW base stats
    // (Lv.4 Mochii: atk 60, def 60, HP 55) while a player party uses
    // createMochii level-scaled stats (Lv.5 Mochii: atk 10, def 10,
    // HP 20) — so a wild Lv.4 dealt 19 in one hit while the player
    // dealt 1-2. Wild creatures now use createMochii at the same
    // level, i.e. the same stat system and existing species base
    // stats as the player (no new stats invented). Species NOT in
    // SPECIES_DB keep the old scaling unchanged (flagged in the PR
    // body); note the pre-existing fallback above already maps a
    // missing species id to the first SPECIES_DB entry's name.
    // v5.3: NO wild enemy may use raw base stats anymore. The v5.2
    // fallback (raw base * 1.08) was the only remaining old-scale
    // wild path in the tree — it fired for any species NOT in
    // SPECIES_DB (e.g. Zephling "016") and for any id mismatch —
    // and it reproduces the v5.2 playtest's 1-vs-18 pattern exactly
    // (old-scale atk ~60 vs level-scaled def ~10). Species in
    // SPECIES_DB (including Mochii "001") already used createMochii
    // in v5.2 and that path is unchanged; the specific v5.2 wild
    // Mochii fight could NOT be reproduced from the current tree
    // (its path already uses createMochii), so this change removes
    // the last old-scale wild route and the parent playtest must
    // re-verify wild Mochii damage in the 3-6 range — it is not
    // claimed fixed by code inspection alone. A species missing
    // from SPECIES_DB now falls back to the first entry's
    // level-scaled stats (the same fallback already used for its
    // name/type above), never to raw base stats.
    const wildBuilt = createMochii(wildMonId, lvl) || createMochii(Object.keys(SPECIES_DB)[0], lvl);
    const wildMon = {
        id: `wild_${Date.now()}`,
        speciesId: wildMonId,
        name: sp.name,
        level: lvl,
        hp: wildBuilt!.hp,
        maxHp: wildBuilt!.maxHp,
        currentHp: wildBuilt!.hp,
        atk: wildBuilt!.stats.atk,
        def: wildBuilt!.stats.def,
        spd: wildBuilt!.stats.spe,
        moves: wildBuilt!.moves.map((mid: string) => (MOVES_DB as any)[mid]?.name || mid),
        type: sp.types[0],
    };

    pendingBattleEndRef.current = null;
    setBattleState({
      type: "wild",
      wild: wildMon,
      // v5: give the battle player a real `name` (nickname -> species
      // name); without it the log read "undefined used Tackle!".
      // v5.1 HP sync: battle copy carries BOTH hp and currentHp at
      // the same value — the store's source of truth is hp, the
      // battle's is currentHp, and letting them drift was the v5
      // playtest discrepancy (Team 20/20, next battle 6/20).
      player: { ...playerMon, name: battleMonName(playerMon), currentHp: playerMon.currentHp ?? playerMon.hp, hp: playerMon.currentHp ?? playerMon.hp },
      playerTeamIdx: aliveIdx,
      log: [`A wild ${wildMon.name} appeared!`],
      phase: "menu",
      canCatch: true,
      reward: 0
    });
    setScreen("battle");
    return true;
  }, [playerTeam]);

  const triggerTrainerBattle = useCallback((npc: any): boolean => {
    const aliveIdx = playerTeam.findIndex((m: any) => (m.currentHp ?? m.hp) > 0);
    if (aliveIdx === -1) {
      notify("You have no Mochiichao able to battle!", "#f44336");
      return false;
    }
    if (!npc.battle || npc.battle.team.length === 0) return false;

    const playerMon = playerTeam[aliveIdx];
    // v4: Hex battles use the rival name from the store and the
    // counter-pick starter (hexTeamMember), not the fixed
    // Razorgater team in the map data, which contradicted the
    // player's own pick when the player chose Razorgater.
    const isHexBattle = npc.id === 'hex_battle_event' || npc.id === 'rival_hex' || npc.name === 'Hex';
    const battleTeam = (isHexBattle && playerMon?.speciesId)
      ? [hexTeamMember(playerMon.speciesId)].filter(Boolean)
      : npc.battle.team.map((m: any) => trainerBattleMon(m));
    const trainerName = isHexBattle ? rivalName : npc.name;
    pendingBattleEndRef.current = null;
    setBattleState({
      type: "trainer",
      npcId: npc.id,
      trainerName,
      trainerTeam: battleTeam.map((m: any) => ({ ...m, currentHp: m.currentHp ?? m.hp, speciesId: m.speciesId || m.id })),
      trainerTeamIdx: 0,
      // v5: same name fix as the wild battle — MochiiInstance has
      // `nickname`, not `name`, so the log must not read .name raw.
      // v5.1 HP sync: see wild battle above (hp and currentHp agree).
      player: { ...playerMon, name: battleMonName(playerMon), currentHp: playerMon.currentHp ?? playerMon.hp, hp: playerMon.currentHp ?? playerMon.hp },
      playerTeamIdx: aliveIdx,
      log: [`${trainerName} wants to battle!`, `${trainerName} sent out ${battleTeam[0].name}!`],
      phase: "menu",
      canCatch: false,
      reward: npc.battle.reward || 100,
      isDojo: !!npc.isDojoBoss,
      badge: npc.battle.badge
    });
    setScreen("battle");
    return true;
  }, [playerTeam, rivalName]);

  const move = useCallback((dx: number, dy: number) => {
    if (screen !== "overworld" || isTransitioning) return;
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    const dir = dx === 1 ? "right" : dx === -1 ? "left" : dy === 1 ? "down" : "up";
    setPlayerDir(dir);

    if (!mapData) return;
    if (nx < 0 || nx >= mapData.width || ny < 0 || ny >= mapData.height) return;

    const tile = mapData.tiles[ny]?.[nx];
    const noclip = useGameStore.getState().noclip;
    // v5: exits and doors are checked BEFORE the solid-tile return.
    // Before v5 the solid check ran first, so any exit or door whose
    // tile was wall/building (sector0's route_1 exit row was all
    // wall) could never fire — the player simply stopped at the
    // wall, exactly the v4 playtest symptom. Exits/doors are map
    // data, not a way through ordinary walls: only the exact exit
    // and door tiles bypass the solid check.
    const exitFirst = (mapData as any).exits?.find((e: any) => e.x === nx && e.y === ny);
    if (exitFirst && !noclip) {
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(exitFirst.to, exitFirst.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }
    const doorFirst = (mapData as any).doors?.find((d: any) => d.x === nx && d.y === ny);
    if (doorFirst && !noclip) {
      setMapState(currentMap, { x: nx, y: ny }); // Step on door
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(doorFirst.to, doorFirst.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }
    if (!noclip) {
      if (tile === 1 || tile === 4) return; // solid
      if (tile === 2) return; // water block
      // Basic NPC collision (solid) — live wanderer tiles win
      // over home tiles, so the player can neither walk through
      // a moved NPC nor be blocked by its empty home tile.
      const npcHere = npcAt(nx, ny);
      if (npcHere) return; // can't walk through them
    }

    // Check exits (noclip path; the normal path already handled
    // exits/doors above, before the solid check)
    const exit = (mapData as any).exits?.find((e: any) => e.x === nx && e.y === ny);
    if (exit) {
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(exit.to, exit.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }

    // Check doors in move (auto-enter, noclip path)
    const door = (mapData as any).doors?.find((d: any) => d.x === nx && d.y === ny);
    if (door) {
      setMapState(currentMap, { x: nx, y: ny }); // Step on door
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(door.to, door.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }

    setMapState(currentMap, { x: nx, y: ny });
    setAnimWalk(w => (w + 1) % 4);

    // Check events
    let eventTriggered = false;
    mapData.events?.forEach(ev => {
      if (ev.x === nx && ev.y === ny && !completedEvents.includes(ev.id)) {
        let conditionMet = false;
        if (!ev.condition) conditionMet = true;
        if (ev.condition === "hasStarter" && hasStarter) conditionMet = true;
        if (ev.condition === "noStarter" && !hasStarter) conditionMet = true;

        if (conditionMet) {
          eventTriggered = true;
          const isBlocking = ev.id.startsWith("block_");
          // v4: Hex first battle — dynamic team + rival name (see
          // hexTeamMember). The map's fixed Razorgater team is only
          // a fallback when the player has no speciesId yet.
          const isHexEvent = ev.id === "hex_battle_event";
          const hexMember = isHexEvent && playerTeam[0]?.speciesId ? hexTeamMember(playerTeam[0].speciesId) : null;
          const evBattle = isHexEvent && hexMember
            ? { ...ev.battle, team: [hexMember] }
            : ev.battle;
          const evLines = (ev.dialog || []).map((l: string) => l.replace(/^Hex:/, `${rivalName}:`));
          setDialog({
            lines: evLines,
            isEvent: !isBlocking,
            eventId: ev.id,
            afterBattle: !!evBattle,
            npc: evBattle ? { ...ev.npc, battle: evBattle, id: ev.id, name: isHexEvent ? rivalName : (ev.npc?.name || "Trainer") } : undefined
          });
          setScreen("dialog");
        }
      }
    });

    if (eventTriggered && mapData.events?.find((e: any) => e.x === nx && e.y === ny)?.id.startsWith("block_")) {
      setMapState(currentMap, { x: playerPos.x, y: playerPos.y }); // Step back
    }

    // Tall grass encounter
    if (tile === 6 && hasStarter && Math.random() < 0.15) {
      const enc = mapData.encounters;
      if (enc && enc.length > 0) {
        setIsTransitioning(true);
        setTimeout(() => {
            const zone = enc[0];
            const poolPick = zone.pool[Math.floor(Math.random() * zone.pool.length)];
            triggerWildBattle(poolPick.id || poolPick);
            setIsTransitioning(false);
        }, 800);
      }
    }
  }, [screen, isTransitioning, playerPos, mapData, hasStarter, defeatedTrainers, completedEvents, triggerWildBattle]);

  // Poll for held direction movement
  useEffect(() => {
    if (!heldDir || screen !== "overworld" || isTransitioning) return;
    const interval = setInterval(() => {
      move(heldDir.dx, heldDir.dy);
    }, useGameStore.getState().fastForward ? 70 : 140);
    return () => clearInterval(interval);
  }, [heldDir, move, screen, isTransitioning]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen === "overworld") {
        if (e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); move(0, -1); }
        if (e.key === "ArrowDown" || e.key === "s") { e.preventDefault(); move(0, 1); }
        if (e.key === "ArrowLeft" || e.key === "a") { e.preventDefault(); move(-1, 0); }
        if (e.key === "ArrowRight" || e.key === "d") { e.preventDefault(); move(1, 0); }
        if (isConfirmKey(e, buttonMode)) {
          e.preventDefault();
          interact();
        }
        if (e.key === "Escape" || e.key === "x") {
          e.preventDefault();
          setPauseOpen(true);
        }
        if (e.key === "F5") {
          e.preventDefault();
          setAutosaveHeldForSlot(null);
          saveGame(saveSlot, 'manual', `QUICKSAVE - ${FULL_WORLD[currentMap]?.name || currentMap}`, useGameStore.getState());
          notify("Game Quicksaved", "#88ccff");
        }
        if (e.key === "F9") {
          e.preventDefault();
          const autoSaves = getSaves(saveSlot).filter(s => s.type === 'auto');
          if (autoSaves.length > 0) {
            useGameStore.getState().loadState(autoSaves[0].data);
            notify("Loaded Autosave", "#88ccff");
          }
        }
      } else if (screen === "battle" && battleState?.phase === "over") {
        // v5.1: the banner blocks until advanced. Enter/Space (and
        // the on-screen Continue button) advance it; without this
        // branch battle keys did nothing at all, so a keyboard-only
        // player could never leave the banner.
        if (isConfirmKey(e, buttonMode)) {
          e.preventDefault();
          finishBattleEnd();
        }
      } else if (screen === "dialog") {
        // v4: Enter/Space advance is handled inside DialogueBox
        // (typing-complete-first, then next page). Handling it here
        // as well would advance twice per press.
      } else if (screen === "save_menu") {
        if (e.key === "Escape") {
          setScreen("overworld");
        }
      } else if (screen === "menu") {
        if (e.key === "Escape" || e.key === "x" || e.key === " ") { setScreen("overworld"); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, move, dialog, playerPos, playerDir, battleState, buttonMode]);

  const interact = () => {
    let dx = 0, dy = 0;
    if (playerDir === "up") dy = -1;
    if (playerDir === "down") dy = 1;
    if (playerDir === "left") dx = -1;
    if (playerDir === "right") dx = 1;
    
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    let npcHere = npcAt(nx, ny);
    if (npcHere) {
      if (npcHere.eventId && npcHere.eventId.startsWith("pick_starter_") && hasStarter) {
        setDialog({ lines: ["You already have a partner!"], npc: npcHere });
        setScreen("dialog");
        return;
      }
      
      // dynamic setup for rival hex: counter-pick starter
      // (hexTeamMember), never mirroring the player, and the rival
      // name from the store. The old code read playerTeam[0].type
      // (a field MochiiInstance does not have) and looked the id up
      // in GameData starters (ids 1/2/3), so it always fell back to
      // a fixed Razorgater and its dialogue claimed "Razorgater,
      // obviously" even when the player had Razorgater.
      if (npcHere.id === "rival_hex" && hasStarter && playerTeam[0]?.speciesId) {
         npcHere = JSON.parse(JSON.stringify(npcHere)); // shallow clone to mutate safely
         const hexMember = hexTeamMember(playerTeam[0].speciesId);
         npcHere.name = rivalName;
         npcHere.dialog = [
           `You again? I already picked my starter. ${hexMember?.name || "Razorgater"}, obviously.`,
           "Don't think I'll go easy on you just because we grew up here.",
           "Next time we meet, we BATTLE. Count on it."
         ];
         if (hexMember) npcHere.battle.team = [hexMember];
      }

      let lines = npcHere.dialog || ["...", ""];
      // Playtest 2026-10-26 (attempt 6, pre-starter Hex soft-lock):
      // a trainer battle with no living party member used to append
      // "...Let's battle!" and, on completion, only fire a notify —
      // finishDialog never cleared the dialogue or restored the
      // overworld, so every further press re-fired the notice and
      // movement stayed blocked. Never enter the battle flow
      // without a party: show a plain, dismissible prompt instead.
      const hasLivingParty = playerTeam.some((m: any) => (m.currentHp ?? m.hp) > 0);
      if (npcHere.battle && !defeatedTrainers.includes(npcHere.id) && !hasLivingParty) {
        setDialog({ lines: [...lines, "You need a partner before you can battle. Go see Prof. Aeon at the lab, just north of here."], npc: npcHere });
      } else if (npcHere.battle && !defeatedTrainers.includes(npcHere.id)) {
        setDialog({ lines: [...lines, "...Let's battle!"], npc: npcHere, afterBattle: true });
      } else {
        if (npcHere.battle && npcHere.postBattleDialog && defeatedTrainers.includes(npcHere.id)) {
          lines = npcHere.postBattleDialog;
        }
        setDialog({ lines, npc: npcHere, eventId: npcHere.eventId, isChoice: npcHere.isChoice });
      }
      setScreen("dialog");
      return;
    }

    // Check Doors
    const door = mapData.doors?.find(d => d.x === nx && d.y === ny);
    if (door) {
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(door.to, door.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }

    // Check Signs
    const sign = mapData.signs?.find(s => s.x === nx && s.y === ny);
    if (sign) {
      setDialog({ lines: [sign.text] });
      setScreen("dialog");
    }
  };

  // v4: DialogueBox owns typing + paging. This is only called when
  // the box reports the last page completed (or a choice is made via
  // handleChoice). Choice dialogues never reach here — DialogueBox
  // shows YES/NO instead of advancing.
  const finishDialog = () => {
    if (!dialog) return;
    if (dialog.isEvent && dialog.eventId) {
      setCompletedEvents(ce => [...ce, dialog.eventId]);
    }
    if (dialog.afterBattle && dialog.npc) {
      // Belt-and-braces for the pre-starter soft-lock: if no battle
      // started (no living party), the dialogue MUST close and the
      // overworld MUST return — never leave the player on a dead
      // dialogue screen with movement blocked.
      const started = triggerTrainerBattle(dialog.npc);
      if (!started) {
        setScreen("overworld");
        setDialog(null);
      }
    } else if (dialog.npc?.isShop) {
      if (setView) setView("SHOP");
      setDialog(null);
    } else if (dialog.npc?.isHeal) {
      healParty();
      // Record this healer's map as the blackout return point
      // (its playerStart is the map entrance, next to the healer).
      lastHealRef.current = { map: currentMap, pos: mapData.playerStart };
      setScreen("overworld");
      setDialog(null);
    } else {
      setScreen("overworld");
      setDialog(null);
    }
  };

  const handleChoice = (yes: boolean) => {
    if (yes && dialog?.eventId) {
      if (dialog.eventId === "pick_starter_001") initializeStarter("001");
      if (dialog.eventId === "pick_starter_004") initializeStarter("004");
      if (dialog.eventId === "pick_starter_007") initializeStarter("007");
      if (dialog.eventId === "pick_starter_010") initializeStarter("010");
      if (dialog.eventId === "pick_starter_038") initializeStarter("038");
      
      // v4: the gift dialogue is a real dialogue (screen dialog,
      // Aeon portrait via the npc slot), shown at this beat and
      // closed by finishDialog — the old code set the dialog but
      // never switched to the dialog screen, then timed out to
      // overworld after 500ms, so the gift lines were never seen.
      // Inventory note: the wallet starts with 10 Luigi Cubes and
      // initializeStarter adds 5, so the player now holds 15 — the
      // "gifted you 5" wording is the +5 gift, not a total of 5.
      setDialog({ lines: ["You chose your partner! A white flash envelopes you...", "Prof. Aeon: A fine choice!", "I've also gifted you 5 Luigi Cubes. You can use them to catch wild Mochiichao in the tall grass!", "Good luck on your journey!"], isEvent: false, npc: { id: "prof_aeon", name: "Prof. Aeon" } });
      setScreen("dialog");
    } else {
      setScreen("overworld");
      setDialog(null);
    }
  };

  // v5: the goal statement, shared by the win and loss paths. In v4
  // it was victory-only (win branch below), so a player who lost
  // the first Hex battle — the v4 playtest's final battle, which
  // closed with no banner and no goal — never heard the goal at
  // all. Win OR lose the flow continues and the route gate is
  // unaffected, so the goal is stated once either way. Mochiichao
  // words only; no Pokemon dialogue, names or towns are copied in.
  const hexGoalDialog = () => ({
    lines: [
      "Prof. Aeon: Well done! That was your first battle, and your partner did you proud.",
      "Here is your MochiDex — it records every Mochiichao you meet and catch.",
      "Now, your goal: visit the dojos across the Mainframe Region, beat Champion Mythar, and stop the Hackers and the Syndicate.",
      "Route 1.0 is open. Your first town is Silicon Town — head north when you are ready.",
    ],
    isEvent: true,
    eventId: 'v4_hex_goal',
    npc: { id: "prof_aeon", name: "Prof. Aeon" },
  });

  const doEnemyTurn = (bs: any) => {
    const enemy = bs.type === "wild" ? bs.wild : bs.trainerTeam[bs.trainerTeamIdx];
    // v5.2: an empty moves array is truthy, so the old fallback
    // never fired and chosenMove came out undefined (power-40 move
    // with no display name). Empty now falls back to Tackle too.
    const moves = enemy.moves && enemy.moves.length > 0 ? enemy.moves : ["Tackle"];
    const chosenMove = moves[Math.floor(Math.random() * moves.length)];
    // v4 bridge: enemy moves may be moveIds (wild/species teams) or
    // display names (map teams); resolve both, same formula.
    const resolvedEnemyMove = resolveBattleMove(chosenMove) || { power: 40, type: "Normal", display: chosenMove };
    const moveData = { power: resolvedEnemyMove.power, type: resolvedEnemyMove.type };
    const chosenMoveDisplay = resolvedEnemyMove.display;
    
    setBattleAnim("enemy");
    setTimeout(() => setBattleAnim(null), 500);

    const dmg = calcDamage(moveData, battleStats(enemy), battleStats(bs.player));
    const newHp = Math.max(0, bs.player.currentHp - dmg);
    const newLog = [...bs.log, `${battleMonName(enemy)} used ${chosenMoveDisplay}!`];
    if (dmg > 0) newLog.push(`${battleMonName(bs.player)} took ${dmg} damage!`);

    // v5.1 HP sync: battle copy keeps hp and currentHp together.
    const updatedPlayer = { ...bs.player, currentHp: newHp, hp: newHp };

    if (newHp <= 0) {
      newLog.push(`${battleMonName(bs.player)} fainted!`);
      // v5.1 HP: a mon with hp 0 and no currentHp is fainted, not
      // alive — the old check (currentHp ?? maxHp) would have
      // treated it as alive at full HP.
      const nextAlive = playerTeam.findIndex((m, i) => i > bs.playerTeamIdx && ((m.currentHp ?? m.hp) ?? m.maxHp) > 0);
      if (nextAlive === -1) {
        newLog.push("You have no more Mochiichao! You blacked out...");
        setBattleState({ ...bs, player: updatedPlayer, log: newLog, phase: "over" });
        // v5.1: banner blocks until Continue — no 2500ms timer.
        // The cleanup below is identical to the old timer body,
        // except the blackout heal now writes BOTH hp and
        // currentHp (old code wrote currentHp only, so Team
        // showed full HP while the next battle entered damaged).
        pendingBattleEndRef.current = () => {
          setBattleState(null);
          // Audit-plan blackout rule (decomp-derived, NOT the old
          // 30% heal): lose HALF the wallet, rounded down, floor
          // 0 — no cap value was verified in the decomp data
          // audited, so no cap is invented here. Return to the
          // last heal point visited (home Sector 0 if none yet:
          // Mom heals there). Do NOT heal the party on blackout:
          // fainted/damaged members stay that way until a healer
          // NPC or an item heals them. SOLO-PLAYABILITY WARNING,
          // stated plainly: a player who blacks out with an all-
          // fainted party must walk to a healer before battling
          // again; that is the decomp rule, not a softlock fix.
          // (Mars gave no blackout-heal concession percentage, so
          // the 30% heal is removed, not kept as a concession.)
          useGameStore.setState(s => ({ wallet: Math.max(0, Math.floor(s.wallet / 2)) }));
          const ret = lastHealRef.current || { map: 'sector0', pos: { x: 15, y: 18 } };
          setMapState(ret.map, ret.pos);
          notify("You blacked out and were sent back...", "#ff5252");
          // v5: goal after a loss too (see hexGoalDialog above).
          // This dialogue states the goal once, then finishDialog
          // returns to the overworld. It never re-gifts cubes.
          if (bs.npcId === 'hex_battle_event' && !completedEvents.includes('v4_hex_goal')) {
            setDialog(hexGoalDialog());
            setScreen("dialog");
          } else {
            setScreen("overworld");
          }
        };
      } else {
        newLog.push(`Go, ${battleMonName(playerTeam[nextAlive])}!`);
        const switchHp = (playerTeam[nextAlive].currentHp ?? playerTeam[nextAlive].hp) ?? playerTeam[nextAlive].maxHp;
        setBattleState({ ...bs, player: { ...playerTeam[nextAlive], name: battleMonName(playerTeam[nextAlive]), currentHp: switchHp, hp: switchHp }, playerTeamIdx: nextAlive, log: newLog, phase: "menu" });
      }
    } else {
      setBattleState({ ...bs, player: updatedPlayer, log: newLog, phase: "menu" });
      const updatedTeam = [...playerTeam];
      // v5.1 HP sync: write BOTH fields, or Team (hp) and the
      // next battle (currentHp) disagree — the v5 discrepancy.
      updatedTeam[bs.playerTeamIdx] = { ...updatedTeam[bs.playerTeamIdx], currentHp: newHp, hp: newHp };
      setPlayerTeam(updatedTeam);
    }
  };

  const [battleAnim, setBattleAnim] = useState<"player" | "enemy" | null>(null);

  const doBattleAction = (action: any) => {
    if (!battleState || battleState.phase !== "menu") return;
    const bs = { ...battleState };

    if (action.type === "run") {
      if (bs.type === "trainer") {
        setBattleState({ ...bs, log: [...bs.log, "You can't run from a trainer battle!"] });
        return;
      }
      notify("Got away safely!");
      setScreen("overworld");
      setBattleState(null);
      return;
    }

    if (action.type === "catch") {
      if (!bs.canCatch) return;
      // v5.2: a thrown Luigi Cube is consumed whether it breaks or
      // succeeds — before v5.2 the catch code never touched the
      // inventory, so the Bag still showed x15 after a throw. If
      // the player has no cubes left, no throw happens at all.
      if (!useItem('luigi_cube')) {
        setBattleState({ ...bs, log: [...bs.log, "You have no Luigi Cubes left!"] });
        return;
      }
      const hpRatio = bs.wild.currentHp / bs.wild.maxHp;
      const catchRate = 0.7 - hpRatio * 0.5;
      const success = Math.random() < catchRate;
      if (success) {
        // v5.3: a caught mon must be a real MochiiInstance, not the
        // flat wild-battle shape. The flat shape has no stats.* and
        // no pp, so RosterView (current.stats.atk, current.pp[j])
        // threw on a caught Sproutle and the Team panel went black
        // in the v5.2 playtest. Rebuild via createMochii at the wild
        // level (same species data, no stats invented) and keep
        // the wild's remaining HP, so a damaged catch stays damaged.
        // Caught moves therefore become moveIds again, which also
        // fixes the PWR- display-name resolution for caught mons.
        const built = createMochii(bs.wild.speciesId, bs.wild.level || 5);
        const caught = built
          ? { ...built, hp: bs.wild.currentHp, currentHp: bs.wild.currentHp }
          : { ...bs.wild, currentHp: bs.wild.currentHp, hp: bs.wild.currentHp };
        setPlayerTeam(t => t.length < 6 ? [...t, caught] : t);
        setDex(d => ({ ...d, [caught.id]: "caught" }));
        notify(`${caught.name} was caught!`, "#4fc3f7");
        setScreen("overworld");
        setBattleState(null);
      } else {
        // v5.1 naming: "Merkaba" appeared ONLY here (button + log)
        // and nowhere else as a canon item — Shop, Bag, Team and
        // the gift dialogue all say Luigi Cube. Renamed to the
        // in-game item name for consistency; if Mars wants Merkaba
        // as a separate item, that is a new decision, not a rename.
        setBattleState({ ...bs, log: [...bs.log, "The Luigi Cube shook... and broke!"], phase: "enemy_turn" });
        setTimeout(() => doEnemyTurn({ ...bs, log: [...bs.log, "The Luigi Cube shook... and broke!"] }), 1200);
      }
      return;
    }

    if (action.type === "move") {
      // v4 bridge (see resolveBattleMove): without this, a starter
      // party's moveIds never matched GAME_DATA.moves and the move
      // silently did nothing. Display name is the MOVES_DB name.
      // v5.3: a click must NEVER be silent again. If a move still
      // cannot be resolved, log it visibly and stay in the menu
      // so the player can pick another move — the v5.2 playtest
      // failure mode (click, nothing, no log) must not recur.
      const resolved = resolveBattleMove(action.move);
      if (!resolved) {
        setBattleState({ ...bs, log: [...bs.log, `${battleMonName(bs.player)} used ${action.move}!`, `But it could not be resolved — no damage dealt.`] });
        return;
      }
      const moveData = { power: resolved.power, type: resolved.type };

      setBattleAnim("player");
      setTimeout(() => setBattleAnim(null), 500);

      const enemyMon = bs.type === "wild" ? bs.wild : bs.trainerTeam[bs.trainerTeamIdx];
      const dmg = calcDamage(moveData, battleStats(bs.player), battleStats(enemyMon));
      const newLog = [...bs.log, `${battleMonName(bs.player)} used ${resolved.display}!`];

      const newHp = Math.max(0, enemyMon.currentHp - dmg);
      if (dmg > 0) newLog.push(`Dealt ${dmg} damage!`);
      
      if (newHp <= 0) {
        newLog.push(`${enemyMon.name} fainted!`);
        if (bs.type === "wild") {
          const xp = (Math.floor(Math.random() * 30) + 20) * (enemyMon.level || 5);
          newLog.push(`Gained ${xp} XP!`);
          setDex(d => ({ ...d, [enemyMon.id]: d[enemyMon.id] === "caught" ? "caught" : "seen" }));
          const updatedTeam = [...playerTeam];
          updatedTeam[bs.playerTeamIdx] = { ...updatedTeam[bs.playerTeamIdx], xp: (updatedTeam[bs.playerTeamIdx].xp || 0) + xp };
          setPlayerTeam(updatedTeam);
          setBattleState({ ...bs, wild: { ...bs.wild, currentHp: 0 }, log: newLog, phase: "over" });
          // v5.1: banner blocks until Continue — no 2000ms timer.
          pendingBattleEndRef.current = () => { setScreen("overworld"); setBattleState(null); };
        } else {
          const newTeam = [...bs.trainerTeam];
          newTeam[bs.trainerTeamIdx] = { ...enemyMon, currentHp: 0 };
          const nextAlive = newTeam.findIndex((m, i) => i > bs.trainerTeamIdx && m.currentHp > 0);
          if (nextAlive === -1) {
            newLog.push(`${bs.trainerName} was defeated!`);
            if (bs.isDojo) { setBadges(b => [...b, bs.badge]); newLog.push(`You received the ${bs.badge}!`); }
            setCredits(c => c + bs.reward);
            setDefeatedTrainers(dt => [...dt, bs.npcId]);
            setBattleState({ ...bs, trainerTeam: newTeam, log: newLog, phase: "over" });
            // v5.1: banner blocks until Continue — no 2500ms timer.
            // The cleanup below is identical to the old timer body.
            pendingBattleEndRef.current = () => {
              setBattleState(null);
              // v4 step 7: after the Hex first battle (win), Aeon
              // states the goal in dialogue, in order — dojos,
              // Champion Mythar, Hackers/Syndicate — not in a menu
              // header. The MochiDex + 5 Luigi Cubes were already
              // given at the starter beat (see handleChoice); this
              // dialogue names the goal, it does not re-gift.
              // Win OR lose the flow continues: a loss blacks out
              // and reaches the goal via its own branch (v5), so
              // this win branch and the loss branch share the same
              // goal dialogue; the route gate is unaffected either way.
              if (bs.npcId === 'hex_battle_event' && !completedEvents.includes('v4_hex_goal')) {
                // v5: same goal dialogue as the loss path (hexGoalDialog).
                setDialog(hexGoalDialog());
                setScreen("dialog");
              } else {
                setScreen("overworld");
              }
            };
          } else {
            newLog.push(`${bs.trainerName} sends out ${newTeam[nextAlive].name}!`);
            setBattleState({ ...bs, trainerTeam: newTeam, trainerTeamIdx: nextAlive, log: newLog, phase: "enemy_turn" });
            setTimeout(() => doEnemyTurn({ ...bs, trainerTeam: newTeam, trainerTeamIdx: nextAlive, log: newLog }), 1200);
          }
        }
      } else {
        if (bs.type === "wild") {
          setBattleState({ ...bs, wild: { ...bs.wild, currentHp: newHp }, log: newLog, phase: "enemy_turn" });
          setTimeout(() => doEnemyTurn({ ...bs, wild: { ...bs.wild, currentHp: newHp }, log: newLog }), 1200);
        } else {
          const newTeam = [...bs.trainerTeam];
          newTeam[bs.trainerTeamIdx] = { ...enemyMon, currentHp: newHp };
          setBattleState({ ...bs, trainerTeam: newTeam, log: newLog, phase: "enemy_turn" });
          setTimeout(() => doEnemyTurn({ ...bs, trainerTeam: newTeam, log: newLog }), 1200);
        }
      }
    }
  };

  const pickStarter = (starter: any) => {
    const mon = makeBattleMon(starter, 5);
    setPlayerTeam([mon]);
    setDex({ [starter.id]: "caught" });
    setIntroStep(4);
    notify(`${starter.name} chose you!`, starter.color);
  };

  // --------------------------------------------------------
  // RENDER: TITLE OR INTRO
  // --------------------------------------------------------
  if (screen === "title") {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden relative select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,150,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,150,0.05)_1px,transparent_1px)] bg-[size:40px_40px] animate-[gridscroll_8s_linear_infinite]" />
        
        <div className="w-16 h-16 rotate-45 bg-teal-400/70 mb-4 z-20" />
        <h1 className="text-teal-400 text-5xl md:text-7xl font-black tracking-[0.2em] animate-[pulse_2s_ease-in-out_infinite] mb-2 z-20 drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] text-center">
          MOCHIICHAO
        </h1>
        <div className="text-green-400 text-sm md:text-xl tracking-[0.4em] mb-12 z-20 font-bold">MAINFRAME REGION</div>

        <button 
          onClick={() => setScreen("intro")}
          className="z-20 bg-transparent border-2 border-teal-400 text-teal-400 text-lg px-8 py-3 tracking-[0.2em] font-bold hover:bg-teal-400/20 hover:scale-105 transition-all"
        >
          NEW GAME
        </button>
      </div>
    );
  }

  if (screen === "intro") {
    const lines = [
      { text: "Welcome to the MAINFRAME REGION.", sub: "A digital continent where Mochiichao roam free." },
      { text: "But shadows gather in the network...", sub: "An organization called THE HACKERS brands and steals Mochiichao." },
      { text: "Your journey begins now.", sub: "Choose your name, then pick your partner." },
      { text: "What is your name?", sub: "", isName: true },
      { text: `Welcome, ${playerName}!`, sub: `Now choose your first Mochiichao.`, isStarter: true },
    ];
    const line = lines[introStep];

    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-2xl text-center">
          {!line.isStarter && !line.isName && (
            <div className="animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-teal-500/40 border-4 border-teal-300 mb-6 animate-bounce" />
              <h2 className="text-teal-400 text-2xl tracking-[0.2em] mb-4">{line.text}</h2>
              <p className="text-slate-400 text-sm mb-10 tracking-widest">{line.sub}</p>
              <button 
                onClick={() => setIntroStep(s => s + 1)}
                className="bg-transparent border-2 border-teal-400 text-teal-400 px-8 py-2 tracking-[0.2em] hover:bg-teal-400/20 transition-all font-bold"
              >
                {introStep < 2 ? "CONTINUE" : "BEGIN"}
              </button>
            </div>
          )}
          {line.isName && (
            <div className="animate-fade-in">
              
              <h2 className="text-teal-400 text-xl tracking-[0.2em] mb-6">{line.text}</h2>
              <input 
                value={nameInput} 
                onChange={e => setNameInput(e.target.value)}
                className="bg-slate-900 border-2 border-teal-400 text-teal-400 px-6 py-3 text-lg tracking-[0.2em] text-center w-full max-w-sm mb-6 outline-none"
                maxLength={12} 
              />
              <br/>
              <button 
                onClick={() => { setPlayerName(nameInput || "Netrunner"); setIntroStep(s => s + 1); }}
                className="bg-teal-400 text-black px-8 py-3 tracking-[0.2em] font-black hover:bg-teal-300 transition-all"
              >
                CONFIRM
              </button>
            </div>
          )}
          {line.isStarter && (
            <div className="animate-fade-in">
              <h2 className="text-yellow-400 text-xl tracking-[0.2em] mb-2">{line.text}</h2>
              <p className="text-slate-400 text-xs mb-8 tracking-widest">{line.sub}</p>
              <div className="flex gap-6 justify-center flex-wrap">
                {GAME_DATA.starters.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => { pickStarter(s); setScreen("overworld"); }}
                    className="bg-slate-900 rounded-xl p-6 w-40 text-center hover:-translate-y-2 transition-transform duration-200 border-2 group"
                    style={{ borderColor: s.color }}
                  >
                    <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform"><CreaturePortrait speciesId={s.id} view="front" size={72} /></div>
                    <div style={{ color: s.color }} className="font-black text-lg tracking-wider mb-1">{s.name}</div>
                    <div className="text-slate-400 text-xs mb-2">{s.type} Type</div>
                    <div className="text-slate-500 text-[10px] leading-relaxed">{s.desc.substring(0, 60)}...</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: MENUS
  // --------------------------------------------------------
  if (screen === "menu") {
    return (
      <div className="w-screen h-screen bg-slate-950 flex text-white">
        {/* Sidebar */}
        <div className="w-40 bg-black border-r-2 border-teal-500 flex flex-col py-6 items-stretch">
          <div className="text-teal-500 text-[10px] tracking-[0.3em] px-4 pb-4 border-b border-slate-800 mb-2">MOCHIIMIND</div>
          {["team", "dex", "badges", "save"].map(t => (
            <button 
              key={t} onClick={() => setMenuTab(t)}
              className={`text-left px-4 py-3 text-sm tracking-widest uppercase border-l-4 transition-colors ${menuTab === t ? 'border-teal-400 text-teal-400 bg-teal-900/20' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {t}
            </button>
          ))}
          <div className="flex-1"/>
          <button 
            onClick={() => setScreen("overworld")}
            className="text-left px-4 py-3 text-sm tracking-widest uppercase border-t border-slate-800 text-red-400 hover:bg-red-950/30"
          >
            ✕ CLOSE
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
            <div>
              <div className="text-teal-400 text-2xl font-black tracking-widest uppercase">{playerName}</div>
              <div className="text-slate-500 text-xs mt-1">{mapData?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 text-lg">{credits} CR</div>
              <div className="text-slate-500 text-xs">{badges.length}/8 Badges</div>
            </div>
          </div>

          {menuTab === "team" && (
            <div className="animate-fade-in max-w-2xl">
              <div className="text-slate-500 text-xs tracking-[0.2em] mb-4">ACTIVE TEAM ({playerTeam.length}/6)</div>
              {playerTeam.map((m, i) => {
                // v5.1 HP: store source of truth is hp; currentHp
                // is the battle copy. After the v5.1 sync both
                // agree, but display hp first so Team can never
                // show a stale battle copy.
                const hp = m.hp ?? m.currentHp ?? m.maxHp;
                const hpPct = (hp / m.maxHp) * 100;
                const tc = TYPE_COLORS[m.type] || "#888";
                return (
                  <div key={i} className="bg-slate-900 border rounded-xl p-4 mb-3 flex items-center gap-6" style={{ borderColor: `${tc}44` }}>
                    <div style={{ filter: `drop-shadow(0 0 10px ${tc})` }}><CreaturePortrait speciesId={m.speciesId || m.id} view="front" size={56} /></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-white font-bold text-lg">{m.name}</span>
                        <span className="text-slate-400 text-xs tracking-wider">Lv.{m.level}</span>
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-widest mb-3" style={{ color: tc }}>{m.type} TYPE</div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-slate-500 text-[10px]">HP</span>
                        <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${hpPct}%`, background: hpPct > 50 ? "#4caf50" : hpPct > 20 ? "#ff9800" : "#f44336" }} />
                        </div>
                        <span className="text-slate-400 text-[10px] w-8 text-right">{hp}/{m.maxHp}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {menuTab === "dex" && (
            <div className="animate-fade-in">
              <div className="text-slate-500 text-xs tracking-[0.2em] mb-4">MOCHIICHAO DEX — {Object.keys(dex).length} SET</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {GAME_DATA.mochiichao.concat(GAME_DATA.starters).map(m => {
                  const status = dex[m.id];
                  const tc = TYPE_COLORS[m.type] || "#888";
                  if (!status) return null; // hide unknown for now to keep UI clean, or show silhouettes
                  return (
                    <div key={m.id} className="bg-slate-900 border rounded-lg p-3 text-center" style={{ borderColor: `${tc}44` }}>
                      <div className="mb-2 flex justify-center"><CreaturePortrait speciesId={m.speciesId || m.id} view="front" size={48} /></div>
                      <div className="text-white text-sm font-bold tracking-wide">{m.name}</div>
                      <div className="text-[10px] uppercase mt-1" style={{ color: tc }}>{m.type}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {menuTab === "badges" && (
            <div className="animate-fade-in max-w-xl">
               <div className="text-slate-500 text-xs tracking-[0.2em] mb-4">ROOT PERMISSIONS ({badges.length}/8)</div>
               {badges.length === 0 && <div className="text-slate-600 italic">No access badges authorized yet.</div>}
               {badges.map((b, i) => (
                 <div key={i} className="bg-slate-900 border border-teal-500/30 rounded-lg p-4 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      
                      <div>
                        <div className="text-teal-400 font-bold">{b}</div>
                        <div className="text-slate-500 text-xs">AUTHORIZED</div>
                      </div>
                    </div>
                    <div className="text-teal-500">✓</div>
                 </div>
               ))}
            </div>
          )}
          
          {menuTab === "save" && (
            <div className="animate-fade-in text-center py-12">
               
               <button 
                 onClick={() => { notify("Simulation states persisted to mainframe."); setScreen("overworld"); }}
                 className="bg-teal-400 text-black px-8 py-3 tracking-[0.2em] font-black hover:bg-teal-300 transition-all rounded"
               >
                 COMMIT SAVE
               </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: BATTLE
  // --------------------------------------------------------
  if (screen === "battle" && battleState) {
    const bs = battleState;
    const enemy = bs.type === "wild" ? bs.wild : bs.trainerTeam[bs.trainerTeamIdx];
    const player = bs.player;
    const playerHpPct = Math.max(0, (player.currentHp / player.maxHp) * 100);
    const enemyHpPct = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100);
    const hpColor = (pct: number) => pct > 50 ? "#4caf50" : pct > 20 ? "#ff9800" : "#f44336";
    const typeColor = TYPE_COLORS[enemy.type] || "#888";

    return (
      <div className="w-screen h-screen bg-slate-950 flex flex-col text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
        
        {/* Header HUD */}
        <div className="bg-black border-b-2 border-teal-500 px-6 py-2 flex justify-between items-center z-20">
          <span className="text-teal-400 text-xs tracking-[0.3em] font-bold">
            {bs.type === "wild" ? "WILD ENCOUNTER" : `SYS_BATTLE // ${bs.trainerName}`}
          </span>
          <span className="text-yellow-400 text-sm font-bold">{credits} CR</span>
        </div>

        {/* v5.1 win/lose banner: full-screen blocking overlay, NOT
            the v5 small row + 2000-2500ms timer. The v5 row was
            never seen in any of the three v5 playtest battles —
            whether it was missed between screenshots or hidden
            behind the arena, a timed row is too easy to miss.
            This overlay covers the battle, shows the outcome in
            large text, and BLOCKS until the player presses
            Continue (button, Enter, or Space — see the battle
            key handler). Flow continues either way — a loss
            blacks out and returns to the map, a win goes to the
            goal dialogue or the overworld. Audit-plan note: the
            WIN sub-line below ("Flow continues — your journey
            goes on.") is PLACEHOLDER wording, NOT Mars canon —
            no clear win line was found in story-fill-region1.md,
            so it is kept and labelled here, not replaced with
            invented dialogue. */}
        {bs.phase === "over" && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center gap-4">
            <div className={`text-5xl font-black tracking-[0.25em] ${player.currentHp <= 0 ? "text-red-400" : "text-yellow-300"}`}>
              {player.currentHp <= 0 ? "DEFEAT!" : "VICTORY!"}
            </div>
            <div className="text-slate-200 text-sm tracking-widest text-center px-6">
              {player.currentHp <= 0 ? "You blacked out and were sent back — your journey continues." : "Flow continues — your journey goes on."}
            </div>
            <button
              onClick={finishBattleEnd}
              className="game-button px-8 py-3 font-bold min-h-[48px] tracking-widest"
            >
              Continue ►
            </button>
          </div>
        )}

        {/* 2.5D Battle Arena */}
        <div className="flex-1 relative overflow-hidden flex" style={{ perspective: "1000px" }}>
           <div className="absolute inset-0 bg-slate-900" />
           {/* Floor Grid */}
           <div 
             className="absolute inset-0"
             style={{ 
               backgroundImage: "linear-gradient(rgba(0,255,200,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,200,0.1) 2px, transparent 2px)", 
               backgroundSize: "60px 60px",
               transform: "rotateX(60deg) scale(1.5)",
               transformOrigin: "bottom center"
             }} 
            />

           {/* Enemy Billboard */}
           <div className="absolute top-[10%] right-[15%] flex flex-col items-center">
              <div className="bg-black/80 backdrop-blur border rounded-lg p-3 w-56 mb-6" style={{ borderColor: typeColor }}>
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold tracking-wider">{enemy.name || enemy.nickname || SPECIES_DB[enemy.speciesId || enemy.id]?.name}</h3>
                   <span className="text-slate-400 text-xs">Lv.{enemy.level}</span>
                 </div>
                 <div className="text-[10px] tracking-widest uppercase mb-2" style={{ color: typeColor }}>{enemy.type || SPECIES_DB[enemy.speciesId || enemy.id]?.types[0]} TYPE</div>
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-500" style={{ width: `${enemyHpPct}%`, background: hpColor(enemyHpPct) }} />
                 </div>
              </div>
              <div 
                className="text-9xl drop-shadow-2xl animate-pulse flex items-center justify-center h-40 w-40" 
                style={{ 
                  filter: `drop-shadow(0 0 30px ${typeColor})`, 
                  animation: battleAnim === "enemy" ? "attack_enemy 0.4s ease-out" : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" 
                }}
              >
                <CreaturePortrait speciesId={enemy.speciesId || enemy.id} view="front" size={144} />
              </div>
           </div>

           {/* Player Billboard */}
           <div className="absolute bottom-[20%] left-[10%] flex flex-col items-center z-10">
              <div className="bg-black/80 backdrop-blur border-2 border-teal-400 rounded-lg p-3 w-56 mb-6">
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold tracking-wider text-teal-300">{player.name || player.nickname || SPECIES_DB[player.speciesId || player.id]?.name}</h3>
                   <span className="text-slate-400 text-xs">Lv.{player.level}</span>
                 </div>
                 <div className="flex justify-between items-center mb-1 text-xs">
                   <span className="text-teal-400 font-bold">{Math.max(0, player.currentHp)}/{player.maxHp} HP</span>
                 </div>
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-500" style={{ width: `${playerHpPct}%`, background: hpColor(playerHpPct) }} />
                 </div>
              </div>
              <div 
                className="text-8xl drop-shadow-2xl flex items-end justify-center h-48 w-48" 
                style={{ 
                  filter: "drop-shadow(0 0 20px rgba(0,255,255,0.6))", 
                  animation: battleAnim === "player" ? "attack_player 0.4s ease-out" : "none" 
                }}
              >
                <CreaturePortrait speciesId={player.speciesId || player.id} view="back" size={144} />
              </div>
           </div>
        </div>

        {/* Action Bottom Panel */}
        <div className="h-48 bg-black border-t-4 border-teal-500 flex z-30 shrink-0">
          {/* LOG TRAY */}
          <div className="flex-1 p-4 overflow-y-auto border-r-2 border-slate-800 flex flex-col justify-end text-sm text-slate-300 leading-relaxed">
             {bs.log.slice(-3).map((l: string, i: number, arr: any[]) => (
               <div key={i} className={`mb-1 ${i === arr.length -1 ? 'text-white font-bold opacity-100' : 'opacity-60'}`}>
                 &gt; {l}
               </div>
             ))}
          </div>

          {/* CONTROLS */}
          <div className="w-[45%] lg:w-[30%] p-4 bg-slate-950">
             {bs.phase === "menu" ? (
               <div className="flex flex-col h-full gap-2">
                 <div className="grid grid-cols-2 gap-2 flex-1">
                   {(player.moves || []).map((mName: string) => {
                     // v4 bridge: party moves are moveIds — display the
                     // resolved name/type/power, not the raw id.
                     const mDef = GAME_DATA.moves[mName as keyof typeof GAME_DATA.moves];
                     const mResolved = resolveBattleMove(mName);
                     const mDisplay = mResolved?.display || mName;
                     const mType = mResolved?.type || mDef?.type;
                     const mPower = mResolved?.power ?? mDef?.power;
                     return (
                       <button
                         key={mName}
                         onClick={() => doBattleAction({ type: 'move', move: mName })}
                         className="bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left p-2 transition-colors flex flex-col justify-center"
                       >
                          <span className="font-bold text-white text-sm truncate">{mDisplay}</span>
                          <span className="text-[10px] mt-1" style={{ color: TYPE_COLORS[mType] || "#888" }}>{mType} | PWR {mPower || '-'}</span>
                       </button>
                     )
                   })}
                 </div>
                 <div className="flex gap-2 h-10 mt-2 shrink-0">
                   {bs.canCatch && (
                     <button 
                       onClick={() => doBattleAction({ type: 'catch' })}
                       className="flex-1 bg-teal-950/40 hover:bg-teal-900 border border-teal-700 text-teal-400 font-bold text-sm rounded tracking-widest"
                     >
                       LUIGI CUBE
                     </button>
                   )}
                   <button 
                     onClick={() => doBattleAction({ type: 'run' })}
                     className="flex-1 bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 font-bold text-sm rounded tracking-widest"
                   >
                     FLEE
                   </button>
                 </div>
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-teal-500 animate-pulse tracking-widest font-bold">
                  {bs.phase === "enemy_turn" ? "AWAITING ENEMY ROOT ACTION..." : "RESOLVING..."}
               </div>
             )}
          </div>
        </div>
      </div>
    );
  }


  // --------------------------------------------------------
  // RENDER: OVERWORLD — PixiJS canvas, full viewport (pass 1)
  // The canvas fills the whole screen; HUD is an overlay; D-pad and
  // action buttons sit inside safe-area padding, never clipped.
  // --------------------------------------------------------
  return (
    <div className="game-screen">
      <PixiWorldCanvas
        mapData={mapData}
        playerPos={playerPos}
        playerDir={playerDir}
        playerSpeciesId={party[0]?.speciesId || null}
        playerKind="human"
        playerGender={playerGender}
        defeatedIds={defeatedTrainers}
        phase={phase}
        animWalk={animWalk}
        npcStates={npcStates}
      />

      {/* v4 goal line: the missing "where do I start". The route
          gate itself already exists (block_route_1 events, noStarter
          condition, and tall-grass encounters already require a
          starter) — v4 makes it discoverable instead of inventing a
          second gate. */}
      <WorldHud
        mapName={mapData?.name || currentMap}
        timeLabel={`${String(gameHour).padStart(2, "0")}:00 ${phase}`}
        goalLabel={
          !hasStarter
            ? "Goal: Visit Prof. Aeon's Lab (walk into the north building)"
            : !defeatedTrainers.includes('hex_battle_event') && currentMap === 'aeon_lab'
              ? `Goal: Battle ${rivalName} at the lab exit, then head to Route 1.0`
              : currentMap === 'sector0'
                ? "Goal: Go to Route 1.0 — walk north through the gate, then to Silicon Town"
                : undefined
        }
        onMenu={() => setPauseOpen(true)}
        onRoster={() => { if (setView) setView("ROSTER"); }}
      />

      {pauseOpen && (
        <PauseMenu
          onClose={() => setPauseOpen(false)}
          onRoster={() => { setPauseOpen(false); if (setView) setView("ROSTER"); }}
          onShop={() => { setPauseOpen(false); if (setView) setView("SHOP"); }}
          onSaveLoad={() => { setPauseOpen(false); setScreen("save_menu"); }}
          onNavigate={(v: string) => { setPauseOpen(false); if (setView) setView(v as any); }}
          onQuitToTitle={() => { setPauseOpen(false); window.location.reload(); }}
        />
      )}

      {/* Dialogue box, v4: the shared DialogueBox (typewriter,
          portrait left, ▼, 2 lines max per page, keyboard + click +
          A advance) over the world canvas. Battle log is untouched
          and stays ONLY as battle history — it is not the story
          carrier. Speaker portrait: slotForNpc, silhouette
          placeholder when no sheet exists — never emoji. */}
      {screen === "dialog" && dialog && (
        <DialogueBox
          lines={dialog.lines || []}
          speakerName={dialog.npc?.name}
          speakerSlot={dialog.npc ? slotForNpc(dialog.npc) : null}
          choice={!!dialog.isChoice}
          onComplete={finishDialog}
          onChoice={handleChoice}
          registerAdvance={(fn) => { dialogAdvanceRef.current = fn; }}
        />
      )}

      {/* MOBILE CONTROLS — D-pad bottom-left, fully on-screen */}
      <div
        className="absolute left-3 z-40 flex flex-col gap-1 select-none"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', left: 'max(0.75rem, env(safe-area-inset-left))', touchAction: 'none' }}
      >
        <div className="flex justify-center">
          <button
            onPointerDown={(e) => { e.preventDefault(); move(0, -1); setHeldDir({dx: 0, dy: -1}); }}
            onPointerUp={() => setHeldDir(null)} onPointerLeave={() => setHeldDir(null)} onPointerCancel={() => setHeldDir(null)}
            style={{ touchAction: 'none' }}
            className="w-14 h-14 bg-black/70 border-2 border-teal-400/60 rounded-t-lg active:bg-teal-500/50 text-teal-300 flex items-center justify-center text-xl"
          >▲</button>
        </div>
        <div className="flex gap-1">
          <button
            onPointerDown={(e) => { e.preventDefault(); move(-1, 0); setHeldDir({dx: -1, dy: 0}); }}
            onPointerUp={() => setHeldDir(null)} onPointerLeave={() => setHeldDir(null)} onPointerCancel={() => setHeldDir(null)}
            style={{ touchAction: 'none' }}
            className="w-14 h-14 bg-black/70 border-2 border-teal-400/60 rounded-l-lg active:bg-teal-500/50 text-teal-300 flex items-center justify-center text-xl"
          >◄</button>
          <div className="w-14 h-14 bg-black/70 flex items-center justify-center border border-teal-400/20">
            <div className="w-4 h-4 rounded-full bg-teal-400/30" />
          </div>
          <button
            onPointerDown={(e) => { e.preventDefault(); move(1, 0); setHeldDir({dx: 1, dy: 0}); }}
            onPointerUp={() => setHeldDir(null)} onPointerLeave={() => setHeldDir(null)} onPointerCancel={() => setHeldDir(null)}
            style={{ touchAction: 'none' }}
            className="w-14 h-14 bg-black/70 border-2 border-teal-400/60 rounded-r-lg active:bg-teal-500/50 text-teal-300 flex items-center justify-center text-xl"
          >►</button>
        </div>
        <div className="flex justify-center">
          <button
            onPointerDown={(e) => { e.preventDefault(); move(0, 1); setHeldDir({dx: 0, dy: 1}); }}
            onPointerUp={() => setHeldDir(null)} onPointerLeave={() => setHeldDir(null)} onPointerCancel={() => setHeldDir(null)}
            style={{ touchAction: 'none' }}
            className="w-14 h-14 bg-black/70 border-2 border-teal-400/60 rounded-b-lg active:bg-teal-500/50 text-teal-300 flex items-center justify-center text-xl"
          >▼</button>
        </div>
      </div>

      {/* v5 interact prompt: when the facing tile holds an NPC, a
          door, or a signpost, show a tappable prompt (mobile has no
          reliable A key, and the playtest found on-screen A on a
          wall/sign did nothing because nothing said what was
          interactable). The prompt is a button, not just text, so
          tapping it interacts. Hidden during dialogue, when A
          already advances the box. */}
      {screen === "overworld" && (() => {
        const dx = playerDir === "right" ? 1 : playerDir === "left" ? -1 : 0;
        const dy = playerDir === "down" ? 1 : playerDir === "up" ? -1 : 0;
        const fx = playerPos.x + dx, fy = playerPos.y + dy;
        const npc = npcAt(fx, fy);
        const door = mapData.doors?.find((d: any) => d.x === fx && d.y === fy);
        const sign = mapData.signs?.find((s: any) => s.x === fx && s.y === fy);
        const label = npc ? `Talk to ${npc.name}` : door ? `Enter ${door.label || "door"}` : sign ? "Read sign" : null;
        if (!label) return null;
        return (
          <button
            onClick={() => interact()}
            className="absolute left-1/2 -translate-x-1/2 z-40 px-5 py-3 font-bold tracking-widest game-button min-h-[48px]"
            style={{ top: 'max(5.5rem, calc(env(safe-area-inset-top) + 5.5rem))' }}
          >
            A — {label}
          </button>
        );
      })()}

      {/* MOBILE CONTROLS — action buttons bottom-right, fully on-screen.
          v5: z-70, above the dialogue box (z-50). Before v5 A/B sat
          at z-40 under the dialogue box and were partially obscured
          whenever dialogue was open. Size unchanged — not shrunk.
          v5.2: hidden entirely during a YES/NO choice dialogue.
          Root cause of the v5.1 playtest blocker: YES/NO buttons sit
          at the bottom-right of the dialogue box (z-50), directly
          under the A/B cluster (z-70), so tapping YES/NO hit A/B
          instead — and the on-screen A only advances non-choice
          dialogue, so it did nothing for a choice either. With A/B
          hidden for choice dialogues, YES/NO are tappable, and the
          DialogueBox Y/N keyboard shortcut (below) covers keys. */}
      {!(screen === "dialog" && dialog?.isChoice) && (<div
        className="absolute right-3 z-[70] flex gap-3 items-end select-none"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', right: 'max(0.75rem, env(safe-area-inset-right))', touchAction: 'none' }}
      >
        <button
          onClick={() => {
            if (screen === 'dialog') { /* B does not advance dialogue in v4 */ }
            else if (screen === 'menu' || screen === 'save_menu') setScreen("overworld");
            else setPauseOpen(true);
          }}
          style={{ touchAction: 'none' }}
          className="w-16 h-16 rounded-full bg-red-900/60 border-b-4 border-red-500/70 text-red-100 flex items-center justify-center font-black text-2xl active:border-b-0 active:translate-y-1 transition-all"
        >
          B
        </button>
        <button
          onClick={() => {
            if (screen === 'overworld') interact();
            else if (screen === 'dialog') dialogAdvanceRef.current?.();
          }}
          style={{ touchAction: 'none' }}
          className="w-16 h-16 rounded-full bg-teal-900/60 border-b-4 border-teal-400/70 text-teal-100 flex items-center justify-center font-black text-2xl active:border-b-0 active:translate-y-1 transition-all"
        >
          A
        </button>
      </div>)}

      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black border-2 px-6 py-3 font-bold tracking-widest z-50 text-center shadow-2xl rounded" style={{ borderColor: notification.color, color: notification.color }}>
          {notification.msg}
        </div>
      )}

      {screen === "save_menu" && (
        <SaveMenu onClose={() => setScreen("overworld")} />
      )}

      <div className={`absolute inset-0 bg-black z-[60] transition-opacity duration-300 pointer-events-none ${isTransitioning ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
