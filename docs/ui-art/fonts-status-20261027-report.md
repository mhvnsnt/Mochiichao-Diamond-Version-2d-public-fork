# Fonts status verification — 2026-10-27 (READ-ONLY, no PR, no download, no install)

Verified against current main at check time. No repo file was changed, no PR opened, no font downloaded.

## Main head verified

- Repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`
- Main head: `383d8fb59126f1694b2a0c67ed46820c50a265f5`
- Head commit: "Merge pull request #285 from mhvnsnt/feature/title-press-any-key-remove" — 2026-10-27T12:40:23Z (07:40 CDT)
- Method note: the local helper `github_api.py` only supports `me` / `list-repos` (verified via `--help`); `me` returned `mhvnsnt`. Contents/tree checks below were done through the public GitHub Contents/Tree API for this public repo, at the head above. Tree total: 12,304 entries, not truncated.

## Claim check 1 — Mars's picks trio: 2/3 = 67% — CONFIRMED

| Pick | Status in `src/lib/fonts.ts` | File(s) on main in `src/assets/fonts/` |
|---|---|---|
| Yagiza | `shipped` | `yagiza.ttf` 19,544 bytes + `yagiza.woff` 5,100 bytes |
| 01 Digitall | `shipped` | `01-digitall.ttf` 48,832 bytes |
| Behance "Y2K Typeface" | `pending` — "FILE PENDING … falls back to the default stack until it lands" | NONE — zero hits for `kilo`, `roadam`, or `behance` anywhere in the 12,304-entry main tree |

So: 2 of 3 named picks shipped = 67%; 1 of 3 pending = 33%. Counting files for the two shipped picks: 3 files (Yagiza counts twice, ttf + woff).
`src/index.css` has `@font-face` blocks for Yagiza and 01 Digitall pointing at those exact files, and no `@font-face` for the Behance typeface ("has no @font-face here yet").

Behance detail, from `src/lib/fonts.ts` + `src/lib/generated/fonts-y2k-ofl-PROVENANCE.md`: gallery 173066117, Kilo/Roadam row in the tracker, file not arrived, row stays in the list, NOT dropped, NOT claimed shipped. No new route was attempted in this check (no Telegram sign-in, no download) — that stays blocked on Mars's call.

## All font files on main: 17 files

Contents API for `src/assets/fonts/` returns exactly 17 blobs:

- Mars picks: `01-digitall.ttf` (48,832), `yagiza.ttf` (19,544), `yagiza.woff` (5,100)
- Open Y2K OFL batch (14): `audiowide-regular.ttf` (69,916), `bungee-regular.ttf` (118,996), `coiny-regular.ttf` (156,520), `dangrek-regular.ttf` (62,464), `exo2-variable.ttf` (303,940), `fredoka-variable.ttf` (159,184), `michroma-regular.ttf` (64,344), `orbitron-variable.ttf` (38,576), `press-start-2p-regular.ttf` (118,204), `rajdhani-regular.ttf` (377,860), `rubik-bubbles-regular.ttf` (219,564), `sniglet-regular.ttf` (75,212), `titan-one-regular.ttf` (55,712), `turret-road-regular.ttf` (51,680)
- No other font file, and no logo/custom font file, exists in that directory.

## Font options in code: 25 total — 16 shipped = 64%, 8 slot = 32%, 1 pending = 4%

From `src/lib/fonts.ts` (11,164 bytes on main, sha `3ced72fe2aa0d6b8c88ba6ecfb0471e0f3021cc1`):

- Shipped 16/25: Yagiza, 01 Digitall, + 14 OFL (Bungee, Titan One, Fredoka, Coiny, Dangrek, Sniglet, Rubik Bubbles, Orbitron, Audiowide, Michroma, Turret Road, Rajdhani, Exo 2, Press Start 2P).
- Slot 8/25 (structure/mapping only, never a Pokemon font file): `pokemon-base`, Small, Normal, Bold, Male-style, Female-style, Braille-style, Locked Default (v32 look).
- Pending 1/25: `behance-y2k` ("Y2K Typeface (Behance) — FILE PENDING").

## Claim check 2 — PR #171 + MENU/DIALOGUE defaults: CONFIRMED

- PR #171, "UI Art: menu + dialogue fonts default to readable Pokemon Base (Mars readability order 2026-10-26)": state closed, merged = true, merged 2026-10-26T17:07:11Z.
- `pokemon-base` option in `fonts.ts`: label "Pokemon Base (Default)", family "Trebuchet MS", status `slot`, note states it is DEFAULT for MENU + DIALOGUE, DS message metrics 11x16, fg/bg/shadow layers, bold panel labels, same stack as the game default + pinned subtitle, never a Nintendo font file.
- Current defaults on main, `src/lib/gameSettings.ts` lines 106–111, repeated verbatim in the SettingsScreen reset function:
  - MAIN = `yagiza`
  - MENU = `pokemon-base`
  - DIALOGUE = `pokemon-base`
  - SMALL = `01-digitall`
  - BOLD = `yagiza`
  - BATTLE = `01-digitall`
- So the six roles (MAIN / MENU / DIALOGUE / SMALL / BOLD / BATTLE) are all wired via `applyFontRoles` in `fonts.ts`; MENU + DIALOGUE defaulting to Pokemon Base is confirmed, not just claimed.

## Claim check 3 — DIAMOND VERSION subtitle PINNED: CONFIRMED

- `PINNED_SUBTITLE_FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif'` in `src/lib/fonts.ts`.
- Used by `src/components/IntroSequence.tsx` (subtitle style, TITLE and MAIN_MENU phases) and stated in SettingsScreen notes as never changed by any font row. No font row touches it.

## Claim check 4 — Custom logo font: 0 built = 0% — CONFIRMED (with one sourcing caveat)

- No custom logo font file exists on main: zero logo/font/glyph files in the tree outside the two logo draft PNGs, and `fonts.ts` says explicitly "Custom logo-lettering font: GAP 0/1 — NOT built … it is NOT in this list and must NOT be claimed to exist." The provenance doc says the same ("GAP 0/1. NOT built"). The local settings list (`ui-art/fonts-settings-list.md` §4) says "FUTURE, NOT NOW … Do NOT claim it exists."
- Source-letter evidence: the wordmark in the on-main logo drafts (`docs/ui-art-options/mochiichao-logo-y2k-v2.png`, `mochiichao-logo-y2k-mixed-v3.png`) reads "MOCHII CHAO". Its distinct uppercase letters are exactly A, C, H, I, M, O — 6 letters. So at most 6 source letterforms are evidenced by the wordmark itself: 6/73 = 8% evidenced, if the 73 denominator is accepted.
- Built font glyphs: 0/73 = 0%.
- Caveat, stated plainly: the "73" denominator was NOT found as a sourced figure in the main files checked (`fonts.ts`, provenance doc, local settings list); it is carried from the task's claim, not independently re-sourced here. The earlier "rejected as unrecognizable shards" build attempt likewise leaves no file on main to re-inspect, so it is not re-verified here — only the present-tense fact (no custom logo font on main) is file-evidenced.
- No lettering extraction, design pass, or new build was attempted in this check.

## Shippable vs blocked — clean split

SHIPPABLE / ALREADY ON MAIN (no new work needed for these):
- 2/3 Mars picks shipped (Yagiza + 01 Digitall, 3 files) — 67% of the trio
- 14/14 OFL open Y2K files shipped
- 17/17 files present in `src/assets/fonts/`
- 16/25 font options shipped (64%)
- 6/6 font roles wired with the defaults above
- PR #171 merged; MENU + DIALOGUE = Pokemon Base default
- DIAMOND VERSION subtitle pinned

BLOCKED ON MARS'S DIRECTION (do not fake, do not route around):
- 1/3 Mars picks pending (33%): Behance Y2K Typeface, Kilo + Roadam files — 0 files on main. Previously found route only was Telegram sign-in; no sign-in, download, or alternative route was attempted here, per the task guard.
- Custom logo font: 0/73 glyphs built (0%); 6/73 source letters evidenced in the wordmark (A, C, H, I, M, O = 8% of the claimed 73). Needs Mars's call on lettering source/design direction before any build is attempted again.
- Decision-gated PRs (#261, #260, #233, #215, #214, #212, #206, #199, #157, #155, #154, #153, #167) were not touched except as excluded from this read-only check; no PR was opened or merged by this job.
