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
 *
 * Batch C (2026-10-25, wiring batch C — Fonts): the 13 open Y2K
 * Google Fonts in §5 below plus Press Start 2P are now SHIPPED as
 * local OFL files in src/assets/fonts/ (pulled from the public
 * google/fonts repo, METADATA.pb licence verified OFL per font,
 * OFL.txt present per font dir). They were previously webfont-only
 * via the Google Fonts stylesheet in index.html; that stylesheet
 * is kept as a fallback only. The 6 Font Settings rows already
 * cycle FONT_OPTIONS independently with live-on-return (see
 * SettingsScreen FONT_SETTINGS + applyFontRoles) — no row logic
 * changed in this batch. Behance Y2K Typeface stays PENDING
 * (file not arrived, falls back, NOT dropped, NOT claimed shipped).
 * Custom logo-lettering font: GAP 0/1 — NOT built in this batch
 * (would require lettering extraction from the logo + a design
 * pass); it is NOT in this list and must NOT be claimed to exist.
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
  // 0. Pokemon Base group (Mars readability order, 2026-10-26): the
  // readable base text for main menu + dialogue boxes, DEFAULT for
  // those two rows. Characteristics from the decomp files, NOT a
  // Nintendo font file: HeartGold message font max 11 wide x 16
  // tall, FireRed fg/bg/shadow 3-layer rendering (text.h
  // TextPrinterTemplate), bold weight for panel labels. The family
  // is the game's earlier system-sans default stack — the same
  // stack as PINNED_SUBTITLE_FONT below — which is also what the
  // 2026-10-26 verification proof's panel labels render in (clean
  // bold sans, plain sublabel). Mars's chosen fonts stay below
  // and stay available for every row, including these two.
  { id: 'pokemon-base', label: 'Pokemon Base (Default)', family: 'Trebuchet MS', status: 'slot', note: 'Pokemon Base: readable base text, DEFAULT for MENU + DIALOGUE. DS message metrics 11x16, fg/bg/shadow layers, bold panel labels. Web-safe system-sans match (same stack as the game default + pinned subtitle); never a Nintendo font file.' },
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
  { id: 'bungee', label: 'Bungee', family: 'Bungee', status: 'shipped', note: 'Shipped (Batch C): bungee-regular.ttf (118,996 bytes), google/fonts ofl/bungee, licence OFL verified.' },
  { id: 'titan-one', label: 'Titan One', family: 'Titan One', status: 'shipped', note: 'Shipped (Batch C): titan-one-regular.ttf (55,712 bytes), google/fonts ofl/titanone, licence OFL verified.' },
  { id: 'fredoka', label: 'Fredoka', family: 'Fredoka', status: 'shipped', note: 'Shipped (Batch C): fredoka-variable.ttf (159,184 bytes, wdth+wght variable), google/fonts ofl/fredoka, licence OFL verified.' },
  { id: 'coiny', label: 'Coiny', family: 'Coiny', status: 'shipped', note: 'Shipped (Batch C): coiny-regular.ttf (156,520 bytes), google/fonts ofl/coiny, licence OFL verified, bubble / rounded Y2K.' },
  { id: 'dangrek', label: 'Dangrek', family: 'Dangrek', status: 'shipped', note: 'Shipped (Batch C): dangrek-regular.ttf (62,464 bytes), google/fonts ofl/dangrek, licence OFL verified, bubble / rounded Y2K.' },
  { id: 'sniglet', label: 'Sniglet', family: 'Sniglet', status: 'shipped', note: 'Shipped (Batch C): sniglet-regular.ttf (75,212 bytes; ExtraBold weight exists upstream, not shipped), google/fonts ofl/sniglet, licence OFL verified, bubble / rounded Y2K.' },
  { id: 'rubik-bubbles', label: 'Rubik Bubbles', family: 'Rubik Bubbles', status: 'shipped', note: 'Shipped (Batch C): rubik-bubbles-regular.ttf (219,564 bytes), google/fonts ofl/rubikbubbles, licence OFL verified, bubble / rounded Y2K.' },
  { id: 'orbitron', label: 'Orbitron', family: 'Orbitron', status: 'shipped', note: 'Shipped (Batch C): orbitron-variable.ttf (38,576 bytes, wght variable), google/fonts ofl/orbitron, licence OFL verified, tech / digital Y2K.' },
  { id: 'audiowide', label: 'Audiowide', family: 'Audiowide', status: 'shipped', note: 'Shipped (Batch C): audiowide-regular.ttf (69,916 bytes), google/fonts ofl/audiowide, licence OFL verified, tech / digital Y2K.' },
  { id: 'michroma', label: 'Michroma', family: 'Michroma', status: 'shipped', note: 'Shipped (Batch C): michroma-regular.ttf (64,344 bytes), google/fonts ofl/michroma, licence OFL verified, tech / digital Y2K.' },
  { id: 'turret-road', label: 'Turret Road', family: 'Turret Road', status: 'shipped', note: 'Shipped (Batch C): turret-road-regular.ttf (51,680 bytes; other weights exist upstream, not shipped), google/fonts ofl/turretroad, licence OFL verified, tech / digital Y2K.' },
  { id: 'rajdhani', label: 'Rajdhani', family: 'Rajdhani', status: 'shipped', note: 'Shipped (Batch C): rajdhani-regular.ttf (377,860 bytes; other weights exist upstream, not shipped), google/fonts ofl/rajdhani, licence OFL verified, tech / digital Y2K.' },
  { id: 'exo-2', label: 'Exo 2', family: 'Exo 2', status: 'shipped', note: 'Shipped (Batch C): exo2-variable.ttf (303,940 bytes, wght variable; italic variant exists upstream, not shipped), google/fonts ofl/exo2, licence OFL verified, tech / digital Y2K.' },
  { id: 'press-start-2p', label: 'Press Start 2P (pixel, sparingly)', family: 'Press Start 2P', status: 'shipped', note: 'Shipped (Batch C): press-start-2p-regular.ttf (118,204 bytes), google/fonts ofl/pressstart2p, licence OFL verified, pixel / arcade Y2K branch — use sparingly, not as body text (fonts-settings-list.md §3).' },
  // Locked default: the pre-existing main-menu look, not a new font.
  { id: 'locked-default', label: 'Locked Default (v32 look)', family: 'Trebuchet MS', status: 'slot', note: 'Default until Mars locks a new one. Choosing a font is a preset, like every other Menu Creator choice.' },
];

export function fontById(id: string): FontOption {
  return FONT_OPTIONS.find(f => f.id === id) || FONT_OPTIONS[FONT_OPTIONS.length - 1];
}

export interface FontRoles {
  mainFont: string;
  menuFont: string;
  dialogueFont: string;
  smallFont: string;
  boldFont: string;
  battleFont: string;
}
/** Pinned DIAMOND VERSION subtitle font (Mars font correction,
 *  2026-10-25 18:30 CDT): the subtitle font on the main menu is
 *  NEVER changed by any font row. IntroSequence pins the subtitle
 *  to this exact stack in both TITLE and MAIN_MENU phases. */
export const PINNED_SUBTITLE_FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
/** Apply the six independent font placements live (Mars font
 *  correction, 2026-10-25 18:30 CDT, overrides the 2-row version):
 *  MAIN -> --game-font (body / titles / menus / headings / UI
 *  labels); MENU -> --menu-font (menu selection row text);
 *  DIALOGUE -> --dialogue-font (dialogue boxes / NPC talk / body
 *  text); SMALL -> --small-font (small labels / notes);
 *  BOLD -> --bold-font (bold headings / action buttons);
 *  BATTLE -> --battle-font (battle log / HUD). Pending fonts
 *  fall back to the default stack because their @font-face is
 *  not in the build yet — the choice is still saved, and applies
 *  when the file lands. */
export function applyFontRoles(roles: FontRoles): void {
  const vars: [string, string][] = [
    ['--game-font', roles.mainFont],
    ['--menu-font', roles.menuFont],
    ['--dialogue-font', roles.dialogueFont],
    ['--small-font', roles.smallFont],
    ['--bold-font', roles.boldFont],
    ['--battle-font', roles.battleFont],
  ];
  try {
    for (const [v, id] of vars) {
      const opt = fontById(id);
      document.documentElement.style.setProperty(v, `'${opt.family}', "Trebuchet MS", "Segoe UI", system-ui, sans-serif`);
    }
  } catch {
    // Non-DOM environment (tests): choices are still saved by the caller.
  }
}
