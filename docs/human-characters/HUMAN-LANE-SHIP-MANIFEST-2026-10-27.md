# Human staged ship — manifest 2026-10-27 (disc-to-repo lane)

Additions only, 0 deletions. No wiring, no humanSheets.ts change (PR #288 wiring is
merged and is NOT duplicated here). No file in this batch overwrites a Mars-seen file.

## Art (src/assets/human-characters/in-game-sheets/) — 5 files
- media-generation-threequarter-logo-v1-0-2138d285-026e-489a-b44a-699c7f7a1891.webp — logo townsperson, three-quarter v1 (draft, eye-checked 2026-10-26)
- media-generation-threequarter-junkyard-v1-0-825816fc-a0a4-47e1-aa08-2e02e009c62f.webp — junkyard townsperson, three-quarter v1 (draft)
- media-generation-threequarter-castagnoli-rose-v-0-284f973f-7d4e-44e5-9423-c6f185c86fff.webp — Castagnoli rose version, three-quarter v1 (draft)
- player-a-portrait-2026-10-27-brown-eyes.webp — Player A portrait correction, brown eyes (SHOW-FIRST ONLY, not wired; atlas cell untouched, see its JSON)
- player-a-portrait-show-sheet-2026-10-27.png — v1 (left) vs corrected 2026-10-27 (right) show sheet

Three-quarter count after this batch: 25/26 = 96%. Still owed: racing three-quarter set ONLY
(1/26 = 4%; generation failed at the tool 2026-10-26 and was not retried per tool instruction).
Do NOT claim three-quarters are 100% until the racing set exists and is eye-checked.

## Docs (docs/human-characters/) — 3 files + 16 dialogue show sheets
- player-a-portrait-2026-10-27.json — provenance/eye-check note; status STAGED ONLY, NOT WIRED
- falk-brief-and-gaps-2026-10-27.md — Falk (Dojo 2) is a GAP: art steps 0/8, team-lock conflict flagged for Mars; no look invented
- luigi-dojo8-identity-check-2026-10-27.md — Luigi (Dojo 8) IS Luigi Castagnoli (shipped in PR #286); NO duplicate Luigi art is created here
- dialogue-2026-10-26/show-sheets-2026-10-26/ — 16 files listed in the PR file list (the 2
  show-sheet files already on main with different content are deliberately NOT overwritten)

## Not in this batch (held, with reasons)
- Player A raw-generation duplicate webp (byte-identical to the clean-named portrait above) — not shipped twice.
- Falk art — none exists; blocked on Mars supplying look + team confirmation (see Falk brief).
- Any Luigi atlas/portrait — would duplicate the shipped castagnoli slot.
- Modified docs already on main (e.g. CANON-HUMAN-CHARACTERS.md, index-update show sheet) — additions-only rule.
- Raw media-generation takes / superseded model variants in the staging roots — intermediates, not final sets.
- Proprietary Pokemon/Sonic material — names only in the lane report; never in this public PR.
