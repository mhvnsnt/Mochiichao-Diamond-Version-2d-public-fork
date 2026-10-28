# Mysterious Figure scene slot — 2026-10-27 (slot only, no scene placed)

## What this PR does (slot PR, separate from the #167 rework PR)
- Adds one HumanSlot: `mysterious_figure`, label "Mysterious Figure",
  role `npc` (neutral — the figure's true role is unknown until reveal),
  colour `#1a102e` (shadow violet-black), `sheetUrl: null`.
- Routes it in `slotForNpc`: an NPC whose id contains `mysterious` or
  whose name contains `mysterious figure` resolves to this slot, before
  the generic fallbacks (so it can never fall through to
  `trainer_generic` or `townspeople`).
- Delivers the silhouette scene art into the repo as a NEW file:
  `src/assets/human-characters/mysterious-figure-silhouette-20261027.png`
  (715x1841 RGBA, transparent background). It is NOT wired as a
  `sheetUrl`: it is full-body scene art, not a 64x64-cell sheet, and
  forcing it into the cell grid would crop/distort it. Until the Human
  Characters lane delivers a real 64x64 sheet, the slot renders the
  repo's standard marked silhouette placeholder in the slot colour —
  which is exactly the shadowed look a nameplate-only figure needs.
- No NPC is placed on any map, no dialogue line is written, no battle
  team is added. Nothing existing is moved, renamed, or re-routed.

## Why sheetUrl stays null (read before "wiring" the PNG)
`humanSheets.ts` loads sheets as 64x64-cell grids (Player A precedent:
`player-a-atlas-64x64.png`, imported in TS). The silhouette PNG is
715x1841 portrait art. Wiring it as `sheetUrl` with default frames
(front 0 / back 64 / left-right 128) would sample 64x64 crops out of
portrait art. Do not do that. The correct follow-up is a real sheet
from the Human Characters lane, swapped in as a file change.

## What Mars still has to decide (blocker for a placed scene)
The exact NPC entry is NOT guessed here. When Mars names them, the
entry shape is:
```ts
// in the chosen map's npcs: array (FullWorldMaps.ts) — map + coords TBD by Mars
{ id: "mysterious_figure", x: <TBD>, y: <TBD>, sprite: "?", name: "Mysterious Figure", dialog: [<TBD — no line invented here>] }
```
Do NOT place this on Castagnoli Island or Silicon Town by default:
Luigi's island scene and the Dojo 8 boss slot are his, and placing a
second figure there would clobber/blur his scene. Persona framing for
this speaker is a one-line follow-up in `src/lib/personaDialogue.ts`
(`personaPresentationForNpc`, same `castagnoli` pattern) once the
#167 rework PR has merged — it is deliberately NOT in this slot PR,
so this PR merges cleanly whatever order the rework lands in.

## Art provenance (edit of owned art, no generation)
Source: workspace V5 rose full-body art (default look) — see
`mysterious-figure-20261027/README-20261027.md` and script
`make_silhouette_20261027.py` (rembg mask + PIL shadow-gradient fill
+ violet rim). Original untouched; V4 staff art not used. No team, no
lore, no reveal identity added anywhere. Canon guardrails honoured:
Dojo 8 boss in Silicon Town, former Syndicate boss, team #009
Oblivirex Lv48 only — none of it expanded here.

## Verification (2026-10-27, sandbox gate on latest main f5fa59a4, #319)
- `npm run build` (Vite) PASS: exit 0, built in 3m11s,
  index-Dxh9RWA8.js. A second build on the #298 tree + slot files
  also passed (exit 0, 2m40s, index-B4j-PgNo.js).
- `npx tsc --noEmit`: 0 errors in PR files. Full-tree count is 27
  errors on BOTH the clean latest-main baseline and the slot tree
  (identical sets: docs/title-lane-archive scripts, IntroSequence
  PINNED_SUBTITLE_FONT, phase4-garden fruit) — all pre-existing on
  the base, none in `src/lib/humanSheets.ts`.
- 0 file deletions (1 modified + 2 new files). Locked default title
  and locked v32 menu untouched (no title/menu file in this PR).
- Opened against head e63ac001 (Environment tiles step 4: brown dirt PATH, cave stone CAVE (#325)); `humanSheets.ts` at that head is
  byte-identical (blob 8c263d45...) to the gated base f5fa59a4, so
  the gate above transfers to the PR base.
- NOT verified: live playtest of the slot (needs a placed scene first).
