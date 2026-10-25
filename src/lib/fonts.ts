/**
 * Settings Font row — single extensible font list, 2026-10-25.
 *
 * Order is Mars's order (~/workspace/mochiichao-work/ui-art/
 * fonts-settings-list.md, as ordered in the code brief):
 *   1. Yagiza, 2. 01 Digitall, 3. Behance Y2K Typeface,
 *   4. Pokemon font SLOTS (structure only, never Pokemon font files),
 *   5. open-source Y2K Google Fonts.
 *
 * To add a font later: append one entry to FONT_OPTIONS, and if it
 * is a local file, drop the file into src/assets/fonts/ and add one
 * @font-face block in src/index.css. No other code change is needed —
 * the Settings Font row cycles FONT_OPTIONS in order.
 *
 * Licence gate REMOVED by Mars (2026-10-25, explicit): Yagiza,
 * 01 Digitall, and the Behance Y2K Typeface are wired in full when
 * their files arrive, including in a public build, and are NOT held
 * local-only on licence grounds. No payment was made and no paid
 * licence was bought for any font in this file. The CufonFonts
 * warning (licence headings auto-generated, may be incomplete) is
 * recorded in fonts-settings-list.md, not re-imposed here as a gate.
 *
 * Statuses, honestly labelled in the UI:
 *   shipped — font file is in src/assets/fonts/ in this PR.
 *   webfont — loaded via the Google Fonts stylesheet in index.html.
 *   slot — a Pokemon font-table slot (Small/Normal/Bold/Male/Female/
 *     Braille), mapped to an open lookalike family, never a file.
 *   pending — row stays in the list, file NOT in hand yet, falls
 *     back to the default stack until the file lands. Never dropped.
 */

export type FontStatus = 'shipped' | 'webfont' | 'slot' | 'pending';

export interface FontOption {
  id: string;
  label: string;
  /** CSS font-family value (without fallbacks; fallbacks are applied by the caller). */
  family: string;
  weight?: number;
  status: FontStatus;
  note: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // 1-3. Mars's picks, on top.
  { id: 'yagiza', label: 'Yagiza', family: 'Yagiza', status: 'shipped', note: 'Shipped: yagiza.woff (5,100 bytes) + yagiza.ttf (19,544 bytes) in src/assets/fonts/.' },
  { id: '01-digitall', label: '01 Digitall', family: '01 Digitall', status: 'shipped', note: 'Shipped: 01-digitall.ttf (48,832 bytes) in src/assets/fonts/.' },
  { id: 'behance-y2k', label: 'Y2K Typeface (Behance) — FILE PENDING', family: 'Y2K Typeface', status: 'pending', note: 'FILE PENDING: Behance gallery 173066117 file has not arrived yet. Row stays in the list and falls back to the default stack until it lands.' },
  // 4. Pokemon font slots — structure only, never Pokemon font files.
  { id: 'slot-small', label: 'Small (slot)', family: 'Fredoka', status: 'slot', note: 'Pokemon Small slot, mapped to Fredoka (open lookalike).' },
  { id: 'slot-normal', label: 'Normal (slot)', family: 'Trebuchet MS', status: 'slot', note: 'Pokemon Normal slot, mapped to the default game stack.' },
  { id: 'slot-bold', label: 'Bold (slot)', family: 'Trebuchet MS', weight: 700, status: 'slot', note: 'Pokemon Bold slot, mapped to the default game stack, bold weight.' },
  { id: 'slot-male', label: 'Male-style (slot)', family: 'Titan One', status: 'slot', note: 'Pokemon Male-style slot, mapped to Titan One (open lookalike).' },
  { id: 'slot-female', label: 'Female-style (slot)', family: 'Fredoka', status: 'slot', note: 'Pokemon Female-style slot, mapped to Fredoka (open lookalike).' },
  { id: 'slot-braille', label: 'Braille-style (slot)', family: 'Rajdhani', status: 'slot', note: 'Pokemon Braille-style slot, mapped to Rajdhani (open lookalike). Braille glyphs themselves are not claimed.' },
  // 5. Open-source Y2K Google Fonts, in the brief's order.
  { id: 'bungee', label: 'Bungee', family: 'Bungee', status: 'webfont', note: 'Google Fonts, OFL lookalike already in the Y2K theme.' },
  { id: 'titan-one', label: 'Titan One', family: 'Titan One', status: 'webfont', note: 'Google Fonts, OFL lookalike already in the Y2K theme.' },
  { id: 'fredoka', label: 'Fredoka', family: 'Fredoka', status: 'webfont', note: 'Google Fonts, OFL lookalike already in the Y2K theme.' },
  { id: 'coiny', label: 'Coiny', family: 'Coiny', status: 'webfont', note: 'Google Fonts, bubble / rounded Y2K.' },
  { id: 'dangrek', label: 'Dangrek', family: 'Dangrek', status: 'webfont', note: 'Google Fonts, bubble / rounded Y2K.' },
  { id: 'sniglet', label: 'Sniglet', family: 'Sniglet', status: 'webfont', note: 'Google Fonts, bubble / rounded Y2K.' },
  { id: 'rubik-bubbles', label: 'Rubik Bubbles', family: 'Rubik Bubbles', status: 'webfont', note: 'Google Fonts, bubble / rounded Y2K.' },
  { id: 'orbitron', label: 'Orbitron', family: 'Orbitron', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'audiowide', label: 'Audiowide', family: 'Audiowide', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'michroma', label: 'Michroma', family: 'Michroma', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'turret-road', label: 'Turret Road', family: 'Turret Road', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'rajdhani', label: 'Rajdhani', family: 'Rajdhani', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'exo-2', label: 'Exo 2', family: 'Exo 2', status: 'webfont', note: 'Google Fonts, tech / digital Y2K.' },
  { id: 'press-start-2p', label: 'Press Start 2P (pixel, sparingly)', family: 'Press Start 2P', status: 'webfont', note: 'Google Fonts, pixel / arcade Y2K branch — use sparingly, not as body text (fonts-settings-list.md §3).' },
  // Locked default: the pre-existing main-menu look, not a new font.
  { id: 'locked-default', label: 'Locked Default (v32 look)', family: 'Trebuchet MS', status: 'slot', note: 'Default until Mars locks a new one. Choosing a font is a preset, like every other Menu Creator choice.' },
];

export function fontById(id: string): FontOption {
  return FONT_OPTIONS.find(f => f.id === id) || FONT_OPTIONS[FONT_OPTIONS.length - 1];
}

/** Apply the two independent font placements live (Mars font-role
 *  update, 2026-10-25): MAIN FONT sets --game-font on :root, which
 *  src/index.css uses for body / titles / menus / UI labels;
 *  DIALOGUE FONT sets --dialogue-font, which DialogueBox and battle
 *  text use for dialogue / NPC talk / battle text / body text.
 *  Pending fonts fall back to the default stack because their
 *  @font-face is not in the build yet — the choice is still saved,
 *  and applies when the file lands. */
export function applyFonts(mainId: string, dialogueId: string): { main: FontOption; dialogue: FontOption } {
  const main = fontById(mainId);
  const dialogue = fontById(dialogueId);
  try {
    document.documentElement.style.setProperty('--game-font', `'${main.family}', "Trebuchet MS", "Segoe UI", system-ui, sans-serif`);
    document.documentElement.style.setProperty('--dialogue-font', `'${dialogue.family}', "Trebuchet MS", "Segoe UI", system-ui, sans-serif`);
  } catch {
    // Non-DOM environment (tests): choices are still saved by the caller.
  }
  return { main, dialogue };
}

/** Backwards-compatible single-font helper (main font only). */
export function applyFont(id: string): FontOption {
  return applyFonts(id, '01-digitall').main;
}
