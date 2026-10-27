/**
 * Mochiichao dialogue — inkjs (MIT) adapter.
 * Ink source lives in src/lib/wiring/dialogue/*.ink, is compiled to
 * JSON with the inkjs Compiler (ink-full), and is loaded here as a
 * Story. This replaces hand-written dialogue arrays: knots, choices
 * and variables are data, and the compiler catches dead ends.
 * Variables are the game's flags, not hard-coded text: clock_set,
 * codex_get, sprint_boots, badges.
 */
import { Story } from "inkjs";

export type InkChoice = { index: number; text: string };

export function loadInkStory(compiledJson: string) {
  const story = new Story(compiledJson);
  return {
    story,
    /** Drain all lines until a choice or the end. Returns the lines. */
    continueAll(): string[] {
      const lines: string[] = [];
      while (story.canContinue) lines.push(story.Continue()!.trim());
      return lines;
    },
    choices(): InkChoice[] {
      return story.currentChoices.map((c) => ({ index: c.index, text: c.text.trim() }));
    },
    choose(index: number) {
      story.ChooseChoiceIndex(index);
    },
    getVar(name: string): unknown {
      return story.variablesState[name];
    },
    setVar(name: string, value: unknown) {
      story.variablesState[name] = value;
    },
    /** Dead-end check for CI: a story that ends with no choices and
     *  no further content after a knot jump is a broken knot. */
    get canContinue() {
      return story.canContinue;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Hand-shaped dialogue sessions (ink-dialogue-locked-*.json shape).   */
/*                                                                    */
/* The locked file is NOT compiled ink: it is hand-shaped JSON whose  */
/* shape matches the parity-fill dialogue-system spec (story ->       */
/* knots -> stitches -> lines / choices). It cannot go through        */
/* inkjs's Story, so game code loads it through this session API      */
/* instead. The session never edits content: lines, choices and       */
/* setFlags come straight from the file, and setFlags are applied     */
/* to the caller-owned flag store when their stitch is entered.       */
/* Battle events trigger event stitches directly (intro /            */
/* about_to_win / defeat / after / mid_battle / first_* / return_*);  */
/* the `main` stitch is the preview/navigation stitch whose choices   */
/* point at those event stitches. A choice with a `condition` is      */
/* only offered when the condition holds against the flag store.      */
/* ------------------------------------------------------------------ */

export type DialogueLine = { speaker: string; text: string };

export type DialogueTarget = { knot: string; stitch: string };

export type DialogueCondition =
  | { flag: string }
  | { flags: string[] }
  | { all?: string[]; any?: string[] };

export type DialogueChoice = {
  index: number;
  text: string;
  target?: DialogueTarget;
  exit: boolean;
  condition?: DialogueCondition;
};

export type DialogueStitch = {
  lines: DialogueLine[];
  choices: DialogueChoice[];
  exit: boolean;
  setFlags: string[];
};

export type DialogueKnot = {
  character?: string;
  kind?: string;
  stitches: Record<string, DialogueStitch>;
};

export type HandShapedDialogue = {
  knots: Record<string, DialogueKnot>;
  flags: string[];
  supersededKnots: string[];
};

/** Flag store owned by the caller (save data, not this module). */
export type FlagStore = Record<string, boolean>;

/** Battle / field event names that map to event stitches. */
export const BATTLE_EVENT_STITCHES = [
  "intro",
  "about_to_win",
  "defeat",
  "after",
  "mid_battle",
] as const;

export type BattleEventStitch = (typeof BATTLE_EVENT_STITCHES)[number];

/** Evaluate a choice condition against the flag store. No condition = offered. */
export function checkDialogueCondition(
  condition: DialogueCondition | undefined,
  flags: FlagStore,
): boolean {
  if (!condition) return true;
  if ("flag" in condition) return flags[condition.flag] === true;
  if ("flags" in condition) {
    return condition.flags.every((f) => flags[f] === true);
  }
  const all = condition.all ?? [];
  const any = condition.any ?? [];
  if (all.length > 0 && !all.every((f) => flags[f] === true)) return false;
  if (any.length > 0 && !any.some((f) => flags[f] === true)) return false;
  return true;
}

/**
 * Parse hand-shaped dialogue JSON into a session-ready document.
 * Throws on the wrong shape; it does not repair or rewrite content.
 * (Full exit/flag auditing lives in validate-dialogue.ts.)
 */
export function parseHandShapedDialogue(doc: unknown): HandShapedDialogue {
  if (
    typeof doc !== "object" ||
    doc === null ||
    Array.isArray(doc) ||
    !("knots" in doc)
  ) {
    throw new Error(
      "parseHandShapedDialogue: expected hand-shaped dialogue JSON with a `knots` object",
    );
  }
  const raw = doc as Record<string, unknown>;
  const rawKnots = raw["knots"] as Record<string, Record<string, unknown>>;
  const knots: Record<string, DialogueKnot> = {};
  for (const [knotName, knotRaw] of Object.entries(rawKnots)) {
    const stitchesRaw = (knotRaw["stitches"] ?? {}) as Record<
      string,
      Record<string, unknown>
    >;
    const stitches: Record<string, DialogueStitch> = {};
    for (const [stitchName, stitchRaw] of Object.entries(stitchesRaw)) {
      const rawLines = (stitchRaw["lines"] ?? []) as Array<{
        speaker: string;
        text: string;
      }>;
      const rawChoices = (stitchRaw["choices"] ?? []) as Array<
        Record<string, unknown>
      >;
      stitches[stitchName] = {
        lines: rawLines.map((l) => ({ speaker: l.speaker, text: l.text })),
        choices: rawChoices.map((c, index) => ({
          index,
          text: c["text"] as string,
          target: (c["target"] as DialogueTarget | undefined) ?? undefined,
          exit: c["exit"] === true,
          condition: (c["condition"] as DialogueCondition | undefined) ??
            undefined,
        })),
        exit: stitchRaw["exit"] === true,
        setFlags: ((stitchRaw["setFlags"] ?? []) as string[]).slice(),
      };
    }
    knots[knotName] = {
      character:
        typeof knotRaw["character"] === "string"
          ? (knotRaw["character"] as string)
          : undefined,
      kind:
        typeof knotRaw["kind"] === "string"
          ? (knotRaw["kind"] as string)
          : undefined,
      stitches,
    };
  }
  const flags = Array.isArray(raw["flags"])
    ? (raw["flags"] as unknown[]).filter(
        (f): f is string => typeof f === "string",
      )
    : [];
  const supersededKnots = Array.isArray(raw["superseded_knots"])
    ? (raw["superseded_knots"] as unknown[]).filter(
        (f): f is string => typeof f === "string",
      )
    : [];
  return { knots, flags, supersededKnots };
}

/**
 * A loaded hand-shaped dialogue session: game code loads a knot (and
 * stitch), reads lines, follows exits, and checks flags — the same
 * three operations the inkjs adapter offers for compiled stories,
 * minus the compiler. setFlags on the entered stitch are applied to
 * the flag store on entry (e.g. a dojo `after` stitch sets its
 * `dojo_N_defeated` flag once; setting is idempotent).
 */
export function createHandShapedSession(
  doc: HandShapedDialogue,
  flagStore: FlagStore = {},
) {
  let currentKnot: string | null = null;
  let currentStitch: string | null = null;
  let ended = false;

  function stitchAt(knot: string, stitch: string): DialogueStitch {
    const k = doc.knots[knot];
    if (!k) throw new Error(`dialogue: unknown knot "${knot}"`);
    const s = k.stitches[stitch];
    if (!s) throw new Error(`dialogue: unknown stitch "${knot}/${stitch}"`);
    return s;
  }

  function enter(knot: string, stitch: string): DialogueStitch {
    const s = stitchAt(knot, stitch);
    currentKnot = knot;
    currentStitch = stitch;
    ended = false;
    for (const f of s.setFlags) flagStore[f] = true;
    return s;
  }

  function currentStitchObj(): DialogueStitch | null {
    if (!currentKnot || !currentStitch) return null;
    return stitchAt(currentKnot, currentStitch);
  }

  return {
    /** Load a knot's stitch (default `main`) and apply its setFlags. */
    load(knot: string, stitch = "main"): DialogueLine[] {
      return enter(knot, stitch).lines;
    },
    /** Load a battle/field event stitch for a knot (intro/defeat/...). */
    loadEvent(knot: string, event: string): DialogueLine[] {
      return enter(knot, event).lines;
    },
    /** Lines of the currently loaded stitch. */
    lines(): DialogueLine[] {
      return currentStitchObj()?.lines ?? [];
    },
    /** Choices of the current stitch, filtered by flag conditions. */
    choices(): DialogueChoice[] {
      const cur = currentStitchObj();
      if (!cur) return [];
      return cur.choices.filter((c) =>
        checkDialogueCondition(c.condition, flagStore),
      );
    },
    /** All choices of the current stitch, unfiltered (auditing only). */
    allChoices(): DialogueChoice[] {
      return currentStitchObj()?.choices ?? [];
    },
    /**
     * Follow a choice by index. Returns the next stitch's lines, or
     * null when the choice exits the conversation.
     */
    choose(index: number): DialogueLine[] | null {
      const cur = currentStitchObj();
      const offered = (cur?.choices ?? []).filter((c) =>
        checkDialogueCondition(c.condition, flagStore),
      );
      const choice = offered.find((c) => c.index === index) ??
        (cur?.choices ?? []).find((c) => c.index === index);
      if (!choice) {
        throw new Error(`dialogue: no choice with index ${index}`);
      }
      if (choice.exit || !choice.target) {
        ended = true;
        return null;
      }
      return enter(choice.target.knot, choice.target.stitch).lines;
    },
    /** True once an exit choice has been followed. */
    get ended() {
      return ended;
    },
    /** True when the current stitch ends the conversation. */
    get atExit() {
      return currentStitchObj()?.exit ?? false;
    },
    currentKnot(): string | null {
      return currentKnot;
    },
    currentStitch(): string | null {
      return currentStitch;
    },
    hasFlag(name: string): boolean {
      return flagStore[name] === true;
    },
    setFlag(name: string, value = true): void {
      flagStore[name] = value;
    },
    flags(): FlagStore {
      return { ...flagStore };
    },
    /** Declared flag registry from the file (all are written somewhere). */
    declaredFlags(): string[] {
      return doc.flags.slice();
    },
    /** Knots the file marks superseded (retained for history only). */
    supersededKnots(): string[] {
      return doc.supersededKnots.slice();
    },
    isSuperseded(knot: string): boolean {
      return doc.supersededKnots.includes(knot);
    },
    knotNames(): string[] {
      return Object.keys(doc.knots);
    },
    stitchNames(knot: string): string[] {
      const k = doc.knots[knot];
      if (!k) throw new Error(`dialogue: unknown knot "${knot}"`);
      return Object.keys(k.stitches);
    },
  };
}

export type HandShapedSession = ReturnType<typeof createHandShapedSession>;
