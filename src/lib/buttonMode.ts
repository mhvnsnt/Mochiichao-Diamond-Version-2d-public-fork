/**
 * Button Mode — one shared translation, used by every existing
 * keyboard handler. No second input system: each screen keeps its
 * own handler and asks this module what a key means under the
 * current Settings BUTTON MODE row.
 *
 * Modes, translated from FireRed option_menu.c / main.c /
 * menu_helpers.c and HeartGold options.c / system.c (structure
 * only, no Pokemon code copied):
 * - NORMAL (FireRed HELP slot, value 0): the baseline. Confirm =
 *   Enter / Space (the web A button); cancel stays per-screen
 *   (Esc / B / X as each screen already had it — deliberately NOT
 *   unified here, so no screen's cancel behaviour changes).
 *   FireRed's HELP behaviour (L+R together opens the help system)
 *   has no equivalent here: this game ships no help system, so
 *   that part is NEED, labelled, not invented.
 * - LR (value 1): in FireRed, GetLRKeysPressed() makes L / R live
 *   page-flip keys in list menus (L = previous page, R = next
 *   page). On the web there are no shoulder buttons, so L = Q and
 *   R = E, and they act only where a list / page actually exists:
 *   Settings Menu Creator pages (Q/E flip pages 1-4), the Settings
 *   row value (Q/E cycle the focused row), and the battle move
 *   list (Q/E move the selected move). Screens with no list
 *   (dialogue, overworld field, pause menu — which has no keyboard
 *   selection at all) get no shoulder action; that is NEED, not
 *   a silent no-op claimed as wired.
 * - L_EQUALS_A (value 2): FireRed main.c copies L onto A for both
 *   new and held presses. On the web, the 'l' key therefore does
 *   exactly what Enter / Space does, on every surface where A
 *   already does something: main menu, Settings, dialogue advance,
 *   world interact, battle-over continue, and battle move confirm.
 *   Where A does nothing (choice dialogue: Enter is left alone so
 *   a focused YES/NO button can activate), 'l' likewise does
 *   nothing — it copies A, it does not invent a new answer key.
 *
 * Typing guard: remap keys are ignored when the event target is a
 * text input, textarea, select, or content-editable element, so
 * typing 'l', 'q', or 'e' into the NamePad-adjacent fields, the
 * preset-name input, or the cheat console never triggers a game
 * action. Modifier keys (Ctrl / Meta / Alt) also disable remaps.
 */

import type { ButtonMode } from './gameSettings';

export function isTypingTarget(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable === true;
}

function remapsAllowed(e: KeyboardEvent): boolean {
  return !isTypingTarget(e) && !e.metaKey && !e.ctrlKey && !e.altKey;
}

/** True when this key confirms under the current mode (web A). */
export function isConfirmKey(e: KeyboardEvent, mode: ButtonMode): boolean {
  if (!remapsAllowed(e)) return false;
  if (e.key === 'Enter' || e.key === ' ') return true;
  if (mode === 'L_EQUALS_A' && e.key.toLowerCase() === 'l') return true;
  return false;
}

/** 'L' for Q, 'R' for E — only in LR mode, else null. */
export function shoulderKey(e: KeyboardEvent, mode: ButtonMode): 'L' | 'R' | null {
  if (!remapsAllowed(e) || mode !== 'LR') return null;
  const k = e.key.toLowerCase();
  if (k === 'q') return 'L';
  if (k === 'e') return 'R';
  return null;
}

/** One-line description of what the mode changes, for UI footers. */
export function buttonModeNote(mode: ButtonMode): string {
  if (mode === 'LR') return 'LR mode: Q = L shoulder, E = R shoulder (page / list keys).';
  if (mode === 'L_EQUALS_A') return 'L=A mode: the L key confirms like Enter / Space.';
  return 'NORMAL: Enter / Space confirm; Esc / B cancel (per screen).';
}
