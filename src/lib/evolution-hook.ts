// Mid-fight evolution hook -- SHAPE ONLY, NOT WIRED LIVE (staged slice).
// Do NOT report this as playable. BattleView does not call it yet.
// Mirrors the Pokemon shape from the decomp evolution tables:
//   FireRed evolution.h: LEVEL / ITEM / TRADE / TRADE_ITEM / FRIENDSHIP /
//     FRIENDSHIP_DAY / FRIENDSHIP_NIGHT / LEVEL_ATK_* / BEAUTY (+ rarer)
//   HeartGold evo.json: EVO_LEVEL / EVO_STONE / EVO_TRADE* / EVO_FRIENDSHIP*
//     / EVO_HAS_MOVE / EVO_CORONET / EVO_ETERNA / EVO_ROUTE217 / ...
//   Black 2 data.json: EVO_METHOD_LEVEL / ITEM / TRADE* / FRIENDSHIP* /
//     KNOWS_MOVE / LEVEL_MOSS_ROCK / LEVEL_ICE_ROCK / MAGNETIC_FIELD / ...
// Roster data in this slice uses ONLY "level" (29 links in evolutions.json).
// Every other method below is a TYPE, not roster data: 0 instances.

export type EvolutionMethod =
  | "level"
  | "item"
  | "trade"
  | "tradeWithItem"
  | "friendship"
  | "friendshipDay"
  | "friendshipNight"
  | "knowsMove"
  | "location"
  | "timeOfDay"
  | "other"; // decomp rarer methods (atk-compare, beauty, party-species, etc.)

export interface EvolutionRule {
  speciesId: string; // roster id, e.g. "013"
  targetId: string; // roster id, e.g. "014"
  method: EvolutionMethod;
  level?: number; // level method only
  itemId?: string; // item method only -- MARS-ONLY: no Mochiichao evo-item ids exist yet
  moveId?: string; // knowsMove method only
  locationId?: string; // location method only -- no Mochiichao evo-location ids exist yet
}

// Trigger: fired when a level-up (or other qualifying event) happens.
// In battle, the trigger fires AFTER the battle action resolves, BEFORE the
// next turn is chosen -- the Pokemon mid-fight shape. Outside battle it
// fires on the level-up screen. The trigger itself decides nothing about
// cancelling; the prompt does.
export interface EvolutionTrigger {
  kind: "levelUpInBattle" | "levelUpOutOfBattle" | "itemUsed" | "tradeCompleted" | "other";
  speciesId: string;
  newLevel?: number;
  rule: EvolutionRule;
}

// Cancel prompt: shown to the player, cancellable like Pokemon.
// Text below is Mochiichao wording (no Pokemon dialogue copied).
// onConfirm / onCancel are PLACEHOLDER signatures for the wiring batch:
// they must be supplied by BattleView / party code when this is wired.
// Nothing in this file performs an evolution.
export interface MidFightEvolutionPrompt {
  trigger: EvolutionTrigger;
  fromName: string; // e.g. "Pupbble"
  toName: string; // e.g. "Terradog"
  promptTitle: string; // e.g. "Pupbble is evolving!"
  promptBody: string; // e.g. "Pupbble is evolving into Terradog! Let it evolve?"
  confirmLabel: string; // "Let it evolve"
  cancelLabel: string; // "Stop evolution"
  canCancel: true; // always true in this shape -- cancelling is a player right
  onConfirm: () => void;
  onCancel: () => void;
}

export function buildMidFightPrompt(
  trigger: EvolutionTrigger,
  fromName: string,
  toName: string,
  onConfirm: () => void,
  onCancel: () => void,
): MidFightEvolutionPrompt {
  return {
    trigger,
    fromName,
    toName,
    promptTitle: `${fromName} is evolving!`,
    promptBody: `${fromName} is evolving into ${toName}! Let it evolve?`,
    confirmLabel: "Let it evolve",
    cancelLabel: "Stop evolution",
    canCancel: true,
    onConfirm,
    onCancel,
  };
}

// LOCKED SHOWCASE (parity report, 2026-10-26): Cowboy Kid's Pupbble
// evolves into Terradog mid-fight. This instance is the wiring-batch test
// case; it does not make mid-fight evolution live by itself.
export const MID_FIGHT_SHOWCASE: { speciesId: string; targetId: string; fromName: string; toName: string } = {
  speciesId: "013",
  targetId: "014",
  fromName: "Pupbble",
  toName: "Terradog",
};

// WIRING CHECKLIST (NEED TO MAKE, not done here):
// 1. BattleView: after a level-up in battle, call buildMidFightPrompt and
//    show it before the next turn; on cancel, keep the old species/level.
// 2. Party/level-up code: same prompt out of battle.
// 3. If a species would learn a move on evolving, the move-learn prompt
//    runs AFTER the evolution prompt resolves, not before.
// 4. Cancelling must NOT consume the level-up, the item, or the trade.
