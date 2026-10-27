# Settings font list — Yagiza + 01 Digitall on top, then Pokemon slots, then open-source Y2K
Mars, 2026-10-25 — Settings > Font row, Pokemon layout, Y2K skin.
Order is Mars's order: the two CufonFonts fonts first, then the
Pokemon font slots, then open-source Y2K fonts. This list is the
Font row's cycle order. The code worker's font-list data file
(src/lib/fonts.ts, see hookup spec) cycles this list in this order.

## 1. ON TOP — Mars's CufonFonts + Behance picks (downloads started)
- Y2K Typeface Free (Behance gallery 173066117) —
  https://www.behance.net/gallery/173066117/Y2K-Typeface-Free
  Status: text fetch blocked (HTTP 403), live browser task started
  2026-10-25 to read the gallery and download if free. Creator,
  actual font name, and download link NOT yet verified — do NOT
  claim this font is downloaded until that task returns.
- Yagiza — https://www.cufonfonts.com/font/yagiza
  DOWNLOADED 2026-10-25, no payment, no sign-in. Verified locally:
  ui-art/fonts/yagiza/YAGIZA__.TTF (19,544 bytes), webfont
  YAGIZA__.woff (5,100 bytes) + style.css + example.html.
  Page: 1 style, yagiza Regular Ver 1.000. Sidebar licence:
  "Free for personal use." Licence tab text: created by b-rain,
  freeware. That text does not explicitly clear commercial use.
- 01 Digitall — https://www.cufonfonts.com/font/01-digitall
  DOWNLOADED 2026-10-25, no payment, no sign-in. Verified locally:
  ui-art/fonts/01-digitall/01 Digitall.ttf (48,832 bytes).
  Page: 1 style, 01 Digitall Ver 1.000. Sidebar licence: "-"
  (unspecified). Licence tab: copyright line for David Chung 2002
  only, no commercial statement either way.
- LICENCE GATE REMOVED BY MARS (2026-10-25, explicit: "Fuck the
  license gate, bro. I don't give a fuck about a license gate."):
  the previous local-only-until-licence-confirmed gate is NO LONGER
  a blocker. Mars's decision, recorded here so it is not re-imposed:
  wire Yagiza, 01 Digitall, and the Behance Y2K typeface into
  Settings in full, including in a public build, when the files
  arrive. No payment was made, no paid licence was bought, for
  any of these fonts. Note, plainly, not as a new gate: CufonFonts
  itself warns its licence headings are auto-generated and may be
  incomplete, and that using a copyrighted commercial font for free
  is illegal — that warning is recorded, the gate is not.

## 2. Pokemon font slots — structure only, never Pokemon font files
From FireRed/HeartGold font tables, as selectable rows, mapped to
open lookalikes (see §3), never a Pokemon font file copied:
  Small, Normal, Bold, Male-style, Female-style, Braille-style.
These are slots, not files. The Font row cycles them as styles,
not as Pokemon assets.

## 3. Open-source Y2K fonts — Google Fonts, licence to verify per file
Already in Mochiichao Y2K theme (OFL lookalikes, named before):
  Bungee, Titan One, Fredoka.
Added Y2K / bubble / tech, all Google Fonts (free to use via
Google Fonts; verify the exact licence — OFL vs Apache — per
font file before a public PR, do not ship a file whose licence
was not read):
  Bubble / rounded: Coiny, Dangrek, Sniglet, Rubik Bubbles.
  Tech / digital / Y2K-future: Orbitron, Audiowide, Michroma,
  Turret Road, Rajdhani, Exo 2.
  Pixel / arcade (Y2K pixel-logic branch, use sparingly, not as
  body text): Press Start 2P — check licence per file, same gate.
Premium / paid Y2K fonts found in search (Miox, Goji, Plox, Areion,
Cyber Angel, etc.) are NOT in this list and are NOT downloaded —
paid fonts need Mars's explicit licence approval first, same
standing rule as before.

## 4. How the Font rows work in Settings (Mars, 2026-10-25 18:18 + 18:22 CDT)
SEPARATE font placements, each its own row — not one generic Font row:
  MAIN FONT — Yagiza. True starting default. General main font.
  MENU FONT — Yagiza (separate row from MAIN, same starting font).
    Controls menu selection rows ONLY. Main menu screen otherwise
    UNCHANGED: locked v32 layout, logo, cloud, panels, colours, and
    the DIAMOND VERSION subtitle font are NOT changed by any font row.
  DIALOGUE FONT — 01 Digitall. Talking font: dialogue boxes, NPC
    talk, battle text, body text.
  SMALL FONT — 01 Digitall (starting). Pokemon FONT_SMALL slot:
    captions, small text, help lines.
  BOLD FONT — Yagiza (starting). Pokemon FONT_BOLD slot: headers,
    emphasized labels.
  BATTLE FONT — 01 Digitall (starting). Battle log / HUD numbers
    (separate so battle text can differ from dialogue if Mars wants).
  Pokemon font slots behind this (FireRed include/text.h, structure
  only, never Pokemon font files): FONT_SMALL, FONT_NORMAL,
  FONT_MALE, FONT_FEMALE, FONT_BRAILLE, FONT_BOLD. Male/Female are
  name-entry styles, Braille is a special message style — they are
  NOT separate rows unless Mars asks; they follow DIALOGUE unless
  a row above says otherwise.
  DIAMOND VERSION subtitle: LOCKED, DO NOT CHANGE. The subtitle
  font on the main menu stays exactly as it was originally, no font
  row touches it.
  FUTURE, NOT NOW: a custom Mochiichao font made from the logo
  lettering, as another font choice later. Do NOT claim it exists.
Settings path (best submenu, Pokemon full-screen structure):
  Main Menu -> SETTINGS -> Menu Creator -> Font Settings, OR
  Settings -> Font row group if Menu Creator is not yet built —
  the code worker puts all rows in the same full screen, with
  B: BACK, presets only, no popup.
  Rows: MAIN FONT, MENU FONT, DIALOGUE FONT, SMALL FONT,
  BOLD FONT, BATTLE FONT, RESET FONTS.
  Each font row: label left / value right, LEFT/RIGHT cycles
  EVERY font in §1–§3 plus the "Default" entry below, independently.
  Font change applies live on return to the real screen, same as
  Pokemon FRAME reload — no preview popup.
  RESET FONTS: restores MAIN = Yagiza, MENU = Yagiza,
  DIALOGUE = 01 Digitall, SMALL = 01 Digitall, BOLD = Yagiza,
  BATTLE = 01 Digitall (the Mochiichao defaults Mars just set).
  OLD DEFAULT entry, named in the list so Mars can find it:
  "Default — Trebuchet MS / system sans" — this is the game's
  previous default from src/index.css line 32: "Trebuchet MS",
  "Segoe UI", system-ui, sans-serif. It is a non-proprietary
  system font, the one that looks a bit like the Pokemon games'
  font. Choosing "Default" on any row restores that row to it.
  A font choice is a preset, like every other Menu Creator /
  UI Creator choice, until Mars locks it.
Licence gate removed — see §1. Fonts are wired in full per Mars's
override, not held local-only on licence grounds.

## 5. Title / silhouette rotation (Mars, 2026-10-25 18:26 CDT)
Silhouette reveal / title creature ROTATES: every startup, and
every return to the main menu, pick a different creature from the
rotation pool — never the same one every time. Each creature brings
its own vibe/theme (like FireRed / HeartGold / LeafGreen / Sapphire /
Ruby each had a different vibe for the creature on screen).
Rotation pool (10, CORRECTED 18:28 CDT, all with sheets in sprite-art/2d-sheets/):
  Starters with images: Mochii (#001, water drop, main-menu cursor),
  Razorgater, Tyrage, Kittember, Sproutle (lab starters),
  Dorowani (#147), Gabu (#148) — 7 starters.
  Plus, CORRECTED 2026-10-25 18:28 CDT (Mars: "Not dusk fiend,
  wispkin"): Wispkin (#042) is the ghost — black drop body, white
  cracked skull face, black wisp smoke, V1 is the default/base sheet.
  Wispkin gets its own screen/theme (black/white ghost/wisp theme).
  Duskfiend is REMOVED from the rotation pool — do NOT use it.
  Plus: Tiidebiite (#002, "Tidebite" — Mars dictation) — Mochii's
  first evolution at level 16, blue water-drop-headed warrior with
  glowing core and swirling water fists, from global_roster.json.
  Plus: Mythar (#331, white iridescent cat, stained-glass wings,
  gold rings, diamond sparkles, sine-wave rings in its sheet —
  PEARL / DIAMOND / IRIDESCENT theme). "Meth in its name" was
  first matched to Mythar ("myth"); Mars has not confirmed or
  removed Mythar, so Mythar STAYS in the pool until Mars says
  otherwise — do NOT drop it silently.
  Rotation pool is now 10, SWAP 2026-10-25 18:31 CDT (Mars): Tiidebiite OUT, Yogiferno IN. Mochii STAYS. Pool: 7 starters (Mochii, Razorgater, Tyrage, Kittember, Sproutle, Dorowani, Gabu) + Wispkin + Yogiferno + Mythar. Yogiferno: white yeti/gorilla, blue tribal markings, fire halo + fire staff.
