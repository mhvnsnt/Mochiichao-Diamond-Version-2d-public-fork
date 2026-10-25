import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TYPE_COLORS, calcDamage, makeBattleMon, GAME_DATA as IMPORTED_GAME_DATA } from "./GameData";
import { FULL_WORLD } from "./FullWorldMaps";
import { useGameStore } from "../store/gameStore";
import PixiWorldCanvas from "../components/game/PixiWorldCanvas";
import CreaturePortrait from "../components/game/CreaturePortrait";
import { PauseMenu, WorldHud } from "../components/game/GameShell";
import { UiPanel } from "../components/game/UiArt";
import { UI_ART } from "../lib/uiArt";
import { getDayPhase, DAY_TINT, DAY_AMBIENT, WEATHER_CONFIG } from "./WorldConstants";
import SaveMenu from "../components/SaveMenu";
import { saveGame, getSaves } from "../lib/saveSystem";
import { SPECIES_DB } from '../lib/species';

const TILE_SIZE = 40; // match PDF size because it renders better in viewports

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

  const playerPos = useGameStore(s => s.playerPos);
  const playerGender = useGameStore(s => s.playerGender);
  const setMapState = useGameStore(s => s.setMapState);

  const [screen, setScreen] = useState("overworld"); 

  const [playerDir, setPlayerDir] = useState("down");
  const [playerName, setPlayerName] = useState("Netrunner");
  
  const [battleState, setBattleState] = useState<any>(null);
  const [dialog, setDialog] = useState<any>(null);
  const [dialogIdx, setDialogIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [menuTab, setMenuTab] = useState("team");
  const [notification, setNotification] = useState<any>(null);
  const [introStep, setIntroStep] = useState(0);
  const [nameInput, setNameInput] = useState("Netrunner");
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animWalk, setAnimWalk] = useState(0);
  const [heldDir, setHeldDir] = useState<{dx:number, dy:number} | null>(null);

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

  useEffect(() => {
    // Autosave roughly every 60s
    const iv = setInterval(() => {
      saveGame(saveSlot, 'auto', `AUTOSAVE - ${FULL_WORLD[currentMap]?.name || currentMap}`, useGameStore.getState());
      notify("Game Autosaved", "#88ccff");
    }, 60000);
    return () => clearInterval(iv);
  }, [saveSlot, currentMap]);

  useEffect(() => {
    // Autosave on map change
    saveGame(saveSlot, 'auto', `AUTOSAVE - Map Change`, useGameStore.getState());
  }, [saveSlot, currentMap]);

  const notify = (msg: string, color = "#ffd700") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2500);
  };

  const triggerWildBattle = useCallback((wildMonId: string) => {
    const aliveIdx = playerTeam.findIndex((m: any) => (m.currentHp ?? m.hp) > 0);
    if (aliveIdx === -1) {
      notify("You have no Mochiichao able to battle!", "#f44336");
      return;
    }

    const playerMon = playerTeam[aliveIdx];
    const sp = SPECIES_DB[wildMonId] || Object.values(SPECIES_DB)[0];
    const lvl = Math.max(1, playerMon.level + Math.floor(Math.random() * 3) - 1);
    const hp = Math.floor(sp.baseStats.hp * (1 + (lvl-1)*0.08));
    const spAtk = Math.floor(sp.baseStats.atk * (1 + (lvl-1)*0.08));
    const spDef = Math.floor(sp.baseStats.def * (1 + (lvl-1)*0.08));

    const wildMon = {
        id: `wild_${Date.now()}`,
        speciesId: wildMonId,
        name: sp.name,
        level: lvl,
        hp: hp,
        maxHp: hp,
        currentHp: hp,
        atk: spAtk,
        def: spDef,
        spd: sp.baseStats.spd,
        moves: (sp as any).moves?.slice(0, 4) || [],
        type: sp.types[0],
    };

    setBattleState({
      type: "wild",
      wild: wildMon,
      player: { ...playerMon, currentHp: playerMon.currentHp ?? playerMon.hp },
      playerTeamIdx: aliveIdx,
      log: [`A wild ${wildMon.name} appeared!`],
      phase: "menu",
      canCatch: true,
      reward: 0
    });
    setScreen("battle");
  }, [playerTeam]);

  const triggerTrainerBattle = useCallback((npc: any) => {
    const aliveIdx = playerTeam.findIndex((m: any) => (m.currentHp ?? m.hp) > 0);
    if (aliveIdx === -1) {
      notify("You have no Mochiichao able to battle!", "#f44336");
      return;
    }
    if (!npc.battle || npc.battle.team.length === 0) return;
    
    const playerMon = playerTeam[aliveIdx];
    setBattleState({
      type: "trainer",
      npcId: npc.id,
      trainerName: npc.name,
      trainerTeam: npc.battle.team.map((m: any) => ({ ...m, currentHp: m.hp, speciesId: m.speciesId || m.id })),
      trainerTeamIdx: 0,
      player: { ...playerMon, currentHp: playerMon.currentHp ?? playerMon.hp },
      playerTeamIdx: aliveIdx,
      log: [`${npc.name} wants to battle!`, `${npc.name} sent out ${npc.battle.team[0].name}!`],
      phase: "menu",
      canCatch: false,
      reward: npc.battle.reward || 100,
      isDojo: !!npc.isDojoBoss,
      badge: npc.battle.badge
    });
    setScreen("battle");
  }, [playerTeam]);

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
    if (!noclip) {
      if (tile === 1 || tile === 4) return; // solid
      if (tile === 2) return; // water block
      // Basic NPC collision (solid)
      const npcHere = mapData.npcs?.find(n => n.x === nx && n.y === ny);
      if (npcHere) return; // can't walk through them
    }

    // Check exits
    const exit = (mapData as any).exits?.find((e: any) => e.x === nx && e.y === ny);
    if (exit) {
      setIsTransitioning(true);
      setTimeout(() => {
        setMapState(exit.to, exit.enterAt);
        setIsTransitioning(false);
      }, 400);
      return;
    }

    // Check doors in move (auto-enter)
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
          setDialog({ 
            lines: ev.dialog, 
            isEvent: !isBlocking, 
            eventId: ev.id,
            afterBattle: !!ev.battle,
            npc: ev.battle ? { ...ev.npc, battle: ev.battle, id: ev.id, name: ev.npc?.name || "Trainer" } : undefined 
          });
          setDialogIdx(0);
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
        if (e.key === "Enter" || e.key === " ") { 
          e.preventDefault(); 
          interact();
        }
        if (e.key === "Escape" || e.key === "x") {
          e.preventDefault();
          setPauseOpen(true);
        }
        if (e.key === "F5") {
          e.preventDefault();
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
      } else if (screen === "dialog") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advanceDialog();
        }
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
  }, [screen, move, dialog, dialogIdx, playerPos, playerDir]);

  const interact = () => {
    let dx = 0, dy = 0;
    if (playerDir === "up") dy = -1;
    if (playerDir === "down") dy = 1;
    if (playerDir === "left") dx = -1;
    if (playerDir === "right") dx = 1;
    
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    let npcHere = mapData.npcs?.find((n: any) => n.x === nx && n.y === ny);
    if (npcHere) {
      if (npcHere.eventId && npcHere.eventId.startsWith("pick_starter_") && hasStarter) {
        setDialog({ lines: ["You already have a partner!"], npc: npcHere });
        setDialogIdx(0);
        setScreen("dialog");
        return;
      }
      
      // Dynamic setup for rival hex
      if (npcHere.id === "rival_hex" && hasStarter) {
         npcHere = JSON.parse(JSON.stringify(npcHere)); // shallow clone to mutate safely
         const pType = playerTeam[0].type;
         let rivalStarterId = "004"; // Default Chrome (if player is Water)
         let rivalStarterName = "Razorgater";
         
         // Water (001) < Earth (007) < Chrome (004) < Water (001)
         if (pType === "Water") { rivalStarterId = "007"; rivalStarterName = "Tyrage"; }
         else if (pType === "Earth") { rivalStarterId = "004"; rivalStarterName = "Razorgater"; }
         else if (pType === "Chrome") { rivalStarterId = "001"; rivalStarterName = "Mochii"; }

         npcHere.dialog = [
           `You again? I already picked my starter. ${rivalStarterName}, obviously.`,
           "Don't think I'll go easy on you just because we grew up here.",
           "Next time we meet, we BATTLE. Count on it."
         ];

         const sp = IMPORTED_GAME_DATA.starters.find((s: any) => s.id == rivalStarterId);
         if (sp) {
           npcHere.battle.team = [{ 
             id: rivalStarterId, name: sp.name, hp: sp.hp, maxHp: sp.hp, atk: sp.atk, def: sp.def, spd: sp.spd, 
             moves: sp.moves || ["Tackle", "Growl"], type: sp.type, level: 5 
           }];
         }
      }

      let lines = npcHere.dialog || ["...", ""];
      if (npcHere.battle && !defeatedTrainers.includes(npcHere.id)) {
        setDialog({ lines: [...lines, "...Let's battle!"], npc: npcHere, afterBattle: true });
      } else {
        if (npcHere.battle && npcHere.postBattleDialog && defeatedTrainers.includes(npcHere.id)) {
          lines = npcHere.postBattleDialog;
        }
        setDialog({ lines, npc: npcHere, eventId: npcHere.eventId, isChoice: npcHere.isChoice });
      }
      setDialogIdx(0);
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
      setDialogIdx(0);
      setScreen("dialog");
    }
  };

  const advanceDialog = () => {
    if (!dialog) return;
    if (dialogIdx < dialog.lines.length - 1) {
      setDialogIdx(i => i + 1);
    } else {
      if (dialog.isChoice) return; // Must click a choice button

      if (dialog.isEvent && dialog.eventId) {
        setCompletedEvents(ce => [...ce, dialog.eventId]);
      }
      if (dialog.afterBattle && dialog.npc) {
        triggerTrainerBattle(dialog.npc);
      } else if (dialog.npc?.isShop) {
        if (setView) setView("SHOP");
        setDialog(null);
        setDialogIdx(0);
      } else if (dialog.npc?.isHeal) {
        healParty();
        setScreen("overworld");
        setDialog(null);
        setDialogIdx(0);
      } else {
        setScreen("overworld");
        setDialog(null);
        setDialogIdx(0);
      }
    }
  };

  const handleChoice = (yes: boolean) => {
    if (yes && dialog?.eventId) {
      if (dialog.eventId === "pick_starter_001") initializeStarter("001");
      if (dialog.eventId === "pick_starter_004") initializeStarter("004");
      if (dialog.eventId === "pick_starter_007") initializeStarter("007");
      if (dialog.eventId === "pick_starter_010") initializeStarter("010");
      if (dialog.eventId === "pick_starter_038") initializeStarter("038");
      
      setDialog({ lines: ["You chose your partner! A white flash envelopes you...", "Prof Aeon: A fine choice!", "I've also gifted you 5 Luigi Cubes. You can use them to catch wild Mochiichao in the tall grass!", "Good luck on your journey!"], isEvent: false });
      setDialogIdx(0);
      setIsTransitioning(true);
      setTimeout(() => {
        setScreen("overworld");
        setIsTransitioning(false);
      }, 500);
    } else {
      setScreen("overworld");
      setDialog(null);
    }
  };

  const doEnemyTurn = (bs: any) => {
    const enemy = bs.type === "wild" ? bs.wild : bs.trainerTeam[bs.trainerTeamIdx];
    const moves = enemy.moves || ["Tackle"];
    const chosenMove = moves[Math.floor(Math.random() * moves.length)];
    const moveData = GAME_DATA.moves[chosenMove as keyof typeof GAME_DATA.moves] || { power: 40, type: "Normal" };
    
    setBattleAnim("enemy");
    setTimeout(() => setBattleAnim(null), 500);

    const dmg = calcDamage(moveData, enemy, bs.player);
    const newHp = Math.max(0, bs.player.currentHp - dmg);
    const newLog = [...bs.log, `${enemy.name} used ${chosenMove}!`];
    if (dmg > 0) newLog.push(`${bs.player.name} took ${dmg} damage!`);

    const updatedPlayer = { ...bs.player, currentHp: newHp };

    if (newHp <= 0) {
      newLog.push(`${bs.player.name} fainted!`);
      const nextAlive = playerTeam.findIndex((m, i) => i > bs.playerTeamIdx && (m.currentHp ?? m.maxHp) > 0);
      if (nextAlive === -1) {
        newLog.push("You have no more Mochiichao! You blacked out...");
        setBattleState({ ...bs, player: updatedPlayer, log: newLog, phase: "over" });
        setTimeout(() => {
          setScreen("overworld");
          setBattleState(null);
          setMapState(currentMap, mapData.playerStart);
          setPlayerTeam(t => t.map(m => ({ ...m, currentHp: Math.floor(m.maxHp * 0.3) })));
          notify("You blacked out and were sent back...", "#ff5252");
        }, 2500);
      } else {
        newLog.push(`Go, ${playerTeam[nextAlive].name}!`);
        setBattleState({ ...bs, player: { ...playerTeam[nextAlive], currentHp: playerTeam[nextAlive].currentHp ?? playerTeam[nextAlive].maxHp }, playerTeamIdx: nextAlive, log: newLog, phase: "menu" });
      }
    } else {
      setBattleState({ ...bs, player: updatedPlayer, log: newLog, phase: "menu" });
      const updatedTeam = [...playerTeam];
      updatedTeam[bs.playerTeamIdx] = { ...updatedTeam[bs.playerTeamIdx], currentHp: newHp };
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
      const hpRatio = bs.wild.currentHp / bs.wild.maxHp;
      const catchRate = 0.7 - hpRatio * 0.5;
      const success = Math.random() < catchRate;
      if (success) {
        const caught = { ...bs.wild, currentHp: bs.wild.currentHp };
        setPlayerTeam(t => t.length < 6 ? [...t, caught] : t);
        setDex(d => ({ ...d, [caught.id]: "caught" }));
        notify(`${caught.name} was caught!`, "#4fc3f7");
        setScreen("overworld");
        setBattleState(null);
      } else {
        setBattleState({ ...bs, log: [...bs.log, "The Merkaba shook... and broke!"], phase: "enemy_turn" });
        setTimeout(() => doEnemyTurn({ ...bs, log: [...bs.log, "The Merkaba shook... and broke!"] }), 1200);
      }
      return;
    }

    if (action.type === "move") {
      const moveData = GAME_DATA.moves[action.move as keyof typeof GAME_DATA.moves];
      if (!moveData) return;
      
      setBattleAnim("player");
      setTimeout(() => setBattleAnim(null), 500);

      const enemyMon = bs.type === "wild" ? bs.wild : bs.trainerTeam[bs.trainerTeamIdx];
      const dmg = calcDamage(moveData, bs.player, enemyMon);
      const newLog = [...bs.log, `${bs.player.name} used ${action.move}!`];

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
          setTimeout(() => { setScreen("overworld"); setBattleState(null); }, 2000);
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
            setTimeout(() => { setScreen("overworld"); setBattleState(null); }, 2500);
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
                const hp = m.currentHp ?? m.maxHp;
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
                     const mDef = GAME_DATA.moves[mName as keyof typeof GAME_DATA.moves];
                     return (
                       <button 
                         key={mName}
                         onClick={() => doBattleAction({ type: 'move', move: mName })}
                         className="bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-left p-2 transition-colors flex flex-col justify-center"
                       >
                          <span className="font-bold text-white text-sm truncate">{mName}</span>
                          <span className="text-[10px] mt-1" style={{ color: TYPE_COLORS[mDef?.type] || "#888" }}>{mDef?.type} | PWR {mDef?.power || '-'}</span>
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
                       MERKABA
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
      />

      <WorldHud
        mapName={mapData?.name || currentMap}
        timeLabel={`${String(gameHour).padStart(2, "0")}:00 ${phase}`}
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

      {/* Dialogue box: bottom, full width (within safe margins), framed
          with the PR #14 SVG dialogue-box panel, over the world canvas —
          never floating on blank navy, never a title header. */}
      {screen === "dialog" && dialog && (
        <UiPanel
          slot={UI_ART.battle_panel}
          style={{
            position: 'absolute', left: '0.75rem', right: '0.75rem', zIndex: 50,
            padding: '16px', cursor: 'pointer',
            bottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
          onClick={advanceDialog}
        >
          {dialog.npc && (
            <div className="text-teal-300 text-xs font-bold tracking-widest mb-2 uppercase">{dialog.npc.name}</div>
          )}
          <div className="text-white text-base leading-relaxed min-h-[3rem]">
            {dialog.lines[dialogIdx]}
          </div>
          {dialogIdx < dialog.lines.length - 1 && (
            <div className="text-teal-300 text-xs text-right mt-3 animate-pulse">CONTINUE</div>
          )}
          {dialogIdx === dialog.lines.length - 1 && dialog.isChoice && (
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={(e) => { e.stopPropagation(); handleChoice(true); }} className="game-button px-6 py-2 font-bold">YES</button>
              <button onClick={(e) => { e.stopPropagation(); handleChoice(false); }} className="game-button px-6 py-2 font-bold">NO</button>
            </div>
          )}
        </UiPanel>
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

      {/* MOBILE CONTROLS — action buttons bottom-right, fully on-screen */}
      <div
        className="absolute right-3 z-40 flex gap-3 items-end select-none"
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))', right: 'max(0.75rem, env(safe-area-inset-right))', touchAction: 'none' }}
      >
        <button
          onClick={() => {
            if (screen === 'dialog') advanceDialog();
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
            else advanceDialog();
          }}
          style={{ touchAction: 'none' }}
          className="w-16 h-16 rounded-full bg-teal-900/60 border-b-4 border-teal-400/70 text-teal-100 flex items-center justify-center font-black text-2xl active:border-b-0 active:translate-y-1 transition-all"
        >
          A
        </button>
      </div>

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
