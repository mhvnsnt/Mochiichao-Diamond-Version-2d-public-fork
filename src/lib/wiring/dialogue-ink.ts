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
