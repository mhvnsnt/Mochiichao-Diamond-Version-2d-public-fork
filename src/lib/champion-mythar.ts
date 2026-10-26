// Champion Mythar transform system — CODE-READY, NOT WIRED INTO BattleView.
// Mars ruling 2026-10-26 ~14:15 CDT: the Champion fight is Hex FIRST, then
// Mythar at the END. Mythar is the roster creature #331 and is Arceus-like:
// one entity with multiple forms. He transforms creature <-> human, and his
// battle sprite swaps back and forth between human form and creature form
// during DIALOGUE and during BATTLE — not just at fight start.
//
// This is NOT an evolution. Mythar's evolution entry is null (single-stage).
// A transform changes only the presentation form + the dialogue/sprite slot.
// It never changes species id, level, HP, or moves: the same Champion entity
// keeps fighting through every swap. That is the whole point of the system.
//
// Decomp shape it is built from (structure only — no Pokemon names, cries,
// or dialogue are copied here):
//   FireRed  pokefirered-leafgreen/src/battle_util.c  CastformDataTypeChange:
//     a battle-state flag (weather + ability) decides a form/type change, and
//     the engine pushes a dedicated change script (BattleScript_CastformChange,
//     include/battle_scripts.h) instead of silently swapping values.
//   FireRed  src/battle_gfx_sfx_util.c: trainer front-pic tables + palette
//     load/free (DecompressTrainerFrontPic / FreeTrainerFrontPicPaletteAndTile)
//     and monster sprite palettes by species/personality: front and back
//     pictures are separate loads, so a swap must free the old pic/palette
//     and load the new one — never just relabel the old sprite.
//   Black 2  pokebw2/res/pokemon/*/data.json: one species record carries
//     `forms: { count, sprite_offset }` and party entries carry a `form`
//     field — one entity, N form slots, form index selects the sprite.
//     (Arceus-class example in that table: 17 forms on one record.)
//   Black 2  pokebw2/res/trainers/data/*.json: trainer records carry a
//     `messages` list with typed slots (TRMSG_START / TRMSG_LOSE plus
//     numeric mid-battle message types) — dialogue is data attached to
//     trigger points, not text baked into the battle loop.
//   HeartGold battle controller / message plumbing (src/battle/) shows the
//     same split: the battle engine resolves a message id, the message
//     layer renders it. This file keeps that split: triggers resolve here,
//     rendering belongs to the dialogue/BattleView wiring batch.
//
// Wiring status (honest): this file is 100% code-ready as pure logic +
// data. BattleView / dialogue / champion-battle wiring is 0% — there is no
// Champion battle (Hex, then Mythar) in the game code yet to wire into, and
// this file performs no BattleView call. See the INTEGRATION CHECKLIST at
// the end of this file and docs/champion-mythar-transform-2026-10-26.md.
// Do NOT report this system as playable until that checklist is done.

export type MytharForm = "human" | "creature";

/** One presentation form of the single Mythar Champion entity. */
export interface MytharFormRecord {
  form: MytharForm;
  /** Sprite slot the renderer must load for this form. */
  spriteSlot: "championMytharHuman" | "championMytharCreature";
  /** Dialogue portrait slot (overworld / pre- and post-battle talk). */
  portraitSlot: "mytharHumanPortrait" | "mytharCreaturePortrait";
  /**
   * Battle stats/moves source. Both forms point at the SAME entity:
   * roster creature #331. The human form carries no separate stats, level,
   * HP, or movelist — inventing a second stat block would make it a second
   * creature, which is exactly what this system is not.
   */
  entitySpeciesId: "331";
  entityName: "Mythar";
}

export const MYTHAR_FORMS: Record<MytharForm, MytharFormRecord> = {
  human: {
    form: "human",
    spriteSlot: "championMytharHuman",
    portraitSlot: "mytharHumanPortrait",
    entitySpeciesId: "331",
    entityName: "Mythar",
  },
  creature: {
    form: "creature",
    spriteSlot: "championMytharCreature",
    portraitSlot: "mytharCreaturePortrait",
    entitySpeciesId: "331",
    entityName: "Mythar",
  },
};

/**
 * Dialogue trigger points, mirroring the decomp shape: a typed message slot
 * fired at a battle/script point. `form` is the form Mythar must be in WHILE
 * the line is delivered; a trigger may also demand a swap first
 * (`swapBeforeLine: true`), which is the mid-battle sprite-swap moment.
 */
export type MytharDialogueTrigger =
  | "championIntro" // Hex defeated; Mythar appears (dialogue, human form)
  | "battleStart" // Mythar fight opens (swap to creature for the fight)
  | "hpHalf" // Mythar's HP first falls to <= 50% (mid-battle dialogue + swap)
  | "hpQuarter" // Mythar's HP first falls to <= 25% (mid-battle dialogue + swap)
  | "defeat" // Mythar defeated (dialogue, human form)
  | "postBattle"; // After the fight (dialogue, human form)

export interface MytharDialogueLine {
  trigger: MytharDialogueTrigger;
  /** Form Mythar is in while this line is spoken. */
  form: MytharForm;
  /** Swap to `form` before delivering the line (the visible transform). */
  swapBeforeLine: boolean;
  /** Mochiichao-original line. No Pokemon dialogue is copied here. */
  line: string;
  /** Fires at most once per fight (prevents re-triggering every turn). */
  oncePerFight: true;
}

/**
 * Dialogue lines. Only one line here is Mars-locked verbatim (the defeat
 * reveal, from his 2026-10-26 ruling); every other line is draft Mochiichao
 * wording Mars can edit — none of it is Pokemon dialogue.
 */
export const MYTHAR_DIALOGUE: MytharDialogueLine[] = [
  {
    trigger: "championIntro",
    form: "human",
    swapBeforeLine: false,
    line: "So. You got past Hex. Then you get to meet me.",
    oncePerFight: true,
  },
  {
    trigger: "battleStart",
    form: "creature",
    swapBeforeLine: true,
    line: "Enough talk. Face what I really am.",
    oncePerFight: true,
  },
  {
    trigger: "hpHalf",
    form: "human",
    swapBeforeLine: true,
    line: "You fight well. Let me answer you face to face.",
    oncePerFight: true,
  },
  {
    trigger: "hpQuarter",
    form: "creature",
    swapBeforeLine: true,
    line: "No more holding back. This is the end of the road — mine or yours.",
    oncePerFight: true,
  },
  {
    trigger: "defeat",
    form: "human",
    swapBeforeLine: true,
    // Mars-locked line (2026-10-26 ~14:15 CDT).
    line: "I am Mythar. The end of all challengers.",
    oncePerFight: true,
  },
  {
    trigger: "postBattle",
    form: "human",
    swapBeforeLine: false,
    line: "You beat the end of all challengers. Go on, then. The road is yours.",
    oncePerFight: true,
  },
];

/** Fight order for the Champion sequence. Hex first, Mythar at the end. */
export const CHAMPION_FIGHT_ORDER = ["Hex", "Mythar"] as const;

/** Mutable per-fight state. The renderer owns sprites; this owns decisions. */
export interface MytharFightState {
  form: MytharForm;
  fired: Set<MytharDialogueTrigger>;
  /** HP fraction (0..1) at the last evaluation, for threshold edges. */
  lastHpFraction: number;
}

export function newMytharFight(): MytharFightState {
  return { form: "human", fired: new Set(), lastHpFraction: 1 };
}

/**
 * Pure trigger evaluation. Call after every HP change and at fight
 * boundaries. Returns the lines to deliver, in order, each with the form
 * Mythar must be in. Threshold triggers fire on the DOWNWARD edge only
 * (first crossing 50% / 25%), never again while HP stays below the line.
 * The caller applies the swap (free old sprite/palette, load new — the
 * FireRed front-pic rule) and then renders the line.
 */
export function evaluateMytharTriggers(
  state: MytharFightState,
  event: { kind: "intro" | "battleStart" | "hpChange" | "defeat" | "postBattle"; hpFraction?: number },
): MytharDialogueLine[] {
  const out: MytharDialogueLine[] = [];
  const fire = (trigger: MytharDialogueTrigger): void => {
    if (state.fired.has(trigger)) return;
    const line = MYTHAR_DIALOGUE.find((d) => d.trigger === trigger);
    if (!line) return;
    state.fired.add(trigger);
    if (line.swapBeforeLine) state.form = line.form;
    out.push(line);
  };
  if (event.kind === "intro") fire("championIntro");
  if (event.kind === "battleStart") fire("battleStart");
  if (event.kind === "defeat") fire("defeat");
  if (event.kind === "postBattle") fire("postBattle");
  if (event.kind === "hpChange" && event.hpFraction !== undefined) {
    const hp = event.hpFraction;
    if (state.lastHpFraction > 0.5 && hp <= 0.5) fire("hpHalf");
    if (state.lastHpFraction > 0.25 && hp <= 0.25) fire("hpQuarter");
    state.lastHpFraction = hp;
  }
  return out;
}

/** Sprite slot the renderer must currently show for this fight state. */
export function currentMytharSpriteSlot(state: MytharFightState): MytharFormRecord["spriteSlot"] {
  return MYTHAR_FORMS[state.form].spriteSlot;
}

/** Portrait slot for dialogue/out-of-battle rendering. */
export function currentMytharPortraitSlot(state: MytharFightState): MytharFormRecord["portraitSlot"] {
  return MYTHAR_FORMS[state.form].portraitSlot;
}

// INTEGRATION CHECKLIST (NOT DONE — wiring batch, own gate):
// 1. Champion battle sequence: Hex fight, then Mythar fight. Neither exists
//    in game code yet; do not bolt Mythar onto a normal trainer battle.
// 2. BattleView: after every HP change, call evaluateMytharTriggers with the
//    current HP fraction; on a returned line, swap sprite FIRST (free old
//    pic/palette, load new slot), THEN show the line — never the reverse.
// 3. Dialogue layer: intro/defeat/postBattle lines render through the same
//    dialogue UI as other trainer talk; portrait swaps with the form.
// 4. Art: championMytharHuman sprite + portrait and championMytharCreature
//    sprite + portrait assets do not exist yet — slots are named here so
//    art can land without a code change, but a swap with a missing asset
//    must fall back to the current sprite, never crash the fight.
// 5. Regression: HP, level, and moves must be identical before/after every
//    swap (same entity). A test asserting that is part of the wiring gate.
// 6. No Pokemon names, cries, or dialogue may enter this file at wiring
//    time either; lines stay Mochiichao-original, Mars-editable.
