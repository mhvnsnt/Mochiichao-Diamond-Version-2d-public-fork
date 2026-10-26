# Batch C — Fonts: open Y2K Google Fonts provenance (OFL only)

Wiring batch C, 2026-10-25. Source for every file below: the public
`google/fonts` GitHub repo, `ofl/<slug>/`, fetched via the GitHub API.
For each font, `METADATA.pb` was read and its `license:` field verified
as `OFL`, and `OFL.txt` was confirmed present in the font directory,
BEFORE shipping. No font whose licence was not verified OFL was shipped.
No Pokemon font file was used anywhere in this batch. No paid font.

Files were renamed to clean names on import (no brackets/spaces) so the
CSS paths stay simple; the upstream filename is listed per row.

| Font (Settings label) | google/fonts dir | Upstream file | Shipped file in src/assets/fonts/ | Bytes | Licence |
|---|---|---|---|---|---|
| Bungee | ofl/bungee | Bungee-Regular.ttf | bungee-regular.ttf | 118,996 | OFL |
| Titan One | ofl/titanone | TitanOne-Regular.ttf | titan-one-regular.ttf | 55,712 | OFL |
| Fredoka | ofl/fredoka | Fredoka[wdth,wght].ttf | fredoka-variable.ttf | 159,184 | OFL |
| Coiny | ofl/coiny | Coiny-Regular.ttf | coiny-regular.ttf | 156,520 | OFL |
| Dangrek | ofl/dangrek | Dangrek-Regular.ttf | dangrek-regular.ttf | 62,464 | OFL |
| Sniglet | ofl/sniglet | Sniglet-Regular.ttf | sniglet-regular.ttf | 75,212 | OFL |
| Rubik Bubbles | ofl/rubikbubbles | RubikBubbles-Regular.ttf | rubik-bubbles-regular.ttf | 219,564 | OFL |
| Orbitron | ofl/orbitron | Orbitron[wght].ttf | orbitron-variable.ttf | 38,576 | OFL |
| Audiowide | ofl/audiowide | Audiowide-Regular.ttf | audiowide-regular.ttf | 69,916 | OFL |
| Michroma | ofl/michroma | Michroma-Regular.ttf | michroma-regular.ttf | 64,344 | OFL |
| Turret Road | ofl/turretroad | TurretRoad-Regular.ttf | turret-road-regular.ttf | 51,680 | OFL |
| Rajdhani | ofl/rajdhani | Rajdhani-Regular.ttf | rajdhani-regular.ttf | 377,860 | OFL |
| Exo 2 | ofl/exo2 | Exo2[wght].ttf | exo2-variable.ttf | 303,940 | OFL |
| Press Start 2P (pixel branch) | ofl/pressstart2p | PressStart2P-Regular.ttf | press-start-2p-regular.ttf | 118,204 | OFL |

Pulled: 13/13 open Y2K names + Press Start 2P as the pixel branch
(14 files total). Press Start 2P is pixel/arcade only — sparingly,
never body text (fonts-settings-list.md §3).

Not shipped in this batch (deliberately, not dropped):
- Other weights/variants that exist upstream (Sniglet ExtraBold,
  Turret Road Light/Medium/Bold/ExtraBold, Rajdhani Light/Medium/
  SemiBold/Bold, Exo 2 Italic) — Regular / variable only, so the
  batch stays one file per font. Add a weight later only as its own
  @font-face + fonts.ts note.
- Behance Y2K Typeface (gallery 173066117, Kilo/Roadam row in the
  tracker): FILE PENDING. It stays in fonts.ts as `pending`, falls
  back to the default stack, is NOT dropped and is NOT claimed
  shipped. Getting it needs Mars via Telegram/upload or an approved
  alternative source, which this batch does not have — nothing was
  invented for it.
- Custom logo-lettering font: GAP 0/1. NOT built in this batch.
  Building it would require lettering extraction from the logo
  artwork plus a design pass to turn those letters into a usable
  font. It is not in fonts.ts and must not be claimed to exist.

Wiring: the 6 Font Settings rows (MAIN / MENU / DIALOGUE / SMALL /
BOLD / BATTLE) already cycle the full FONT_OPTIONS list independently
(PR #28, SettingsScreen FONT_SETTINGS + fonts.ts applyFontRoles,
live on return/save). This batch changes those entries from
`webfont` to `shipped` and adds local @font-face blocks in
src/index.css; no row logic, no main-menu layout, and no DIAMOND
VERSION subtitle font (PINNED in fonts.ts) was changed. The Google
Fonts stylesheet link in index.html is kept as a fallback only.
The Font Settings screen itself was not rebuilt in this batch —
no Font Settings wiring code changed beyond the fonts.ts entries.
