// Mid-fight evolution hook -- WIRED LIVE 2026-10-27 (wiring lane, PR B).
// BattleView calls it after a level-up in battle (see finishTurnQueue:
// buildMidFightPrompt + the EVOLUTION state, SAFE chains only).
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
// 1. BattleView: DONE 2026-10-27 (wiring lane) -- after a level-up in
//    battle, buildMidFightPrompt shows before the victory tail; on
//    cancel, the old species/level is kept.
// 2. Party/level-up code: same prompt out of battle.
// 3. If a species would learn a move on evolving, the move-learn prompt
//    runs AFTER the evolution prompt resolves, not before.
// 4. Cancelling must NOT consume the level-up, the item, or the trade.

// ---------------------------------------------------------------------------
// ROSTER-WINS SAFE CHAINS (decision batch, Mars 2026-10-26 ~14:15 CDT).
// Data + pure resolver only. BattleView calls this now (2026-10-27,
// wiring lane): 013/014/015 and 038/039/040 are all in species.ts
// (roster-wins, PR #205 + #275), and the BattleView hook-up landed
// with the wiring batch. Out-of-battle level-ups (party/daycare) still
// do not call it -- checklist item 2 stays open.
// ---------------------------------------------------------------------------

export interface SafeEvolutionChain {
  chainId: string;
  links: EvolutionRule[]; // level method only, roster verbatim
}

// Pupbble #013 -> Terradog #014 Lv16 -> Quakehound #015 Lv32. canCancel true
// is carried by buildMidFightPrompt (canCancel: true, always).
export const SAFE_CHAIN_PUPBBLE: SafeEvolutionChain = {
  chainId: "013-014-015",
  links: [
    { speciesId: "013", targetId: "014", method: "level", level: 16 },
    { speciesId: "014", targetId: "015", method: "level", level: 32 },
  ],
};

// Sproutle #038 -> Shellguard #039 Lv18 -> Dreadtoise #040 Lv32.
// ROSTER-WINS: 039 is Shellguard (not code's old "Dreadtoise"), 040 is
// Dreadtoise final. The old code 039 stats (90/90/110/60/80/40) matched
// neither roster entry and do not survive; roster stats win.
export const SAFE_CHAIN_SPROUTLE: SafeEvolutionChain = {
  chainId: "038-039-040",
  links: [
    { speciesId: "038", targetId: "039", method: "level", level: 18 },
    { speciesId: "039", targetId: "040", method: "level", level: 32 },
  ],
};

export const SAFE_EVOLUTION_CHAINS: SafeEvolutionChain[] = [
  SAFE_CHAIN_PUPBBLE,
  SAFE_CHAIN_SPROUTLE,
];

/** Pure lookup: the level-evolution rule out of a species, if it is in a safe chain. */
export function getSafeEvolutionRule(speciesId: string): EvolutionRule | null {
  for (const chain of SAFE_EVOLUTION_CHAINS) {
    for (const link of chain.links) {
      if (link.speciesId === speciesId) return link;
    }
  }
  return null;
}

/** True when a level-up at `newLevel` meets the safe-chain rule for this species. */
export function safeEvolutionReady(speciesId: string, newLevel: number): boolean {
  const rule = getSafeEvolutionRule(speciesId);
  return rule !== null && rule.method === "level" && (rule.level ?? Infinity) <= newLevel;
}
