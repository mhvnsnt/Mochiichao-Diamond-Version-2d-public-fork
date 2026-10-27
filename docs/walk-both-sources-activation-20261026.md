# Walk both-sources activation (2026-10-26)

Authority: Mars confirmed the v2 manifest + show sheet 2026-10-26 ~19:33 CDT
("I confirm, and Mochii's dir is good"), and confirmed astroleviathan left/right
2026-10-26 ~19:32 CDT. This PR activates that manifest in game. No PR merges
anything live until a Pages rebuild; live playtest still owed after merge.

## Black 2 model applied (pokebw2, src/ov036/fldmmdl_drawdata.c anim set 1)

One strip per actor; standing faces 0/3/6/9, one per direction; walk per
direction = {{ step, stand, step, stand }}, looped, at waits 16/8/4/2/1 by speed
tier. Mochiichao mapping: step frames come from the corrected frames-dir sets,
stand frames are the sheet cells (the renderer already draws the sheet cell
when the resolver returns null). Sheet cells are ALWAYS the standing/side
authority and the fallback.

## What changes in game

- NEW `src/lib/walkCycle.ts`: 51-entry WALK_CYCLE_V2 table + resolver +
  WALK_WAIT_TIERS verbatim from Black 2 + the {step, stand, step, stand} pattern.
- MODIFIED `src/lib/creatureWalkFrames.ts`: thin shim delegating to walkCycle
  (same export + signature — the CreatureModeView call site is untouched).
- Behavior: for 42 frames-dir sets, walking now cycles step PNG / sheet stand /
  step PNG / sheet stand per tile step (walkStep % 4). Previously the 4 wired
  sets alternated step/step every tile (walkStep % 2) and the rest showed a
  static sheet cell. For the 9 sheet-only sets, behavior is UNCHANGED.
- Wait tiers: the table is exported verbatim, but per-frame wait application
  needs a frame clock the game does not have yet (it ticks once per tile step,
  not once per animation frame). That application is flagged, not faked — no
  tier is silently assigned to a creature.

## Per-creature source table (42 frames-dir + 9 sheet-only = 51)

| set | speciesId | source | note |
| --- | --- | --- | --- |
| aerobeak | 020 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| aquariios | 003 | frames-dir | live 8-frame set, already in repo |
| ashemit | 044 | frames-dir | live 8-frame set, already in repo |
| astroleviathan | 025 | frames-dir | down/up live dir + CONFIRMED left/right build |
| chromejaww | 005 | frames-dir | live 8-frame set, NEW to repo in this PR |
| cocoonode | 017 | frames-dir | live 8-frame set, already in repo |
| cragarm | 036 | frames-dir | live 8-frame set, NEW to repo in this PR |
| dorowani | 147 | frames-dir | CONFIRMED rebuilt set (walkfix dir), NOT live Mudkip-like dir |
| dreadtoise | 040 | frames-dir | live 8-frame set, NEW to repo in this PR |
| duneclaw | 008 | frames-dir | live 8-frame set, already in repo |
| duskfiend | 043 | frames-dir | live 8-frame set, NEW to repo in this PR |
| finblade | 022 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| floatcalf | 024 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| gabu | 148 | frames-dir | CONFIRMED rebuilt set (walkfix dir), NOT live shell-missing dir |
| gearkid | 032 | frames-dir | live 8-frame set, already in repo |
| gorokappa | 034 | frames-dir | live 8-frame set, NEW to repo in this PR |
| inklet | 026 | frames-dir | live 8-frame set, already in repo |
| kickmaster | 031 | frames-dir | live 8-frame set, already in repo |
| kittember | 010 | frames-dir | live 8-frame set, already in repo |
| krakenox | 028 | frames-dir | live 8-frame set, already in repo |
| manticlaw | 012 | frames-dir | live 8-frame set, already in repo |
| mechapion | 033 | frames-dir | live 8-frame set, NEW to repo in this PR |
| megalochrome | 023 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| mochii | 001 | frames-dir | live 8-frame set, already in repo |
| mothrix | 018 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| mythar | 331 | frames-dir | live 8-frame set, NEW to repo in this PR |
| oblivirex | 009 | frames-dir | live 8-frame set, already in repo |
| pebblefist | 035 | frames-dir | live 8-frame set, already in repo |
| pixilite | 041 | frames-dir | live 8-frame set, already in repo |
| punchkid | 029 | frames-dir | live 8-frame set, already in repo |
| pupbble | 013 | frames-dir | live 8-frame set, NEW to repo in this PR |
| pyromonk | 045 | frames-dir | live 8-frame set, NEW to repo in this PR |
| pyropaw | 011 | frames-dir | live 8-frame set, already in repo |
| quakehound | 015 | frames-dir | live 8-frame set, already in repo |
| razorgater | 004 | frames-dir | live 8-frame set, already in repo |
| reaperdile | 006 | frames-dir | live 8-frame set, NEW to repo in this PR |
| shellguard | 039 | frames-dir | live 8-frame set, already in repo |
| sproutle | 038 | frames-dir | repo dir partial (down only) — completed by this PR |
| squirmite | 016 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| stormtalon | 021 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| strikechamp | 030 | frames-dir | live 8-frame set, NEW to repo in this PR |
| strikechamp_unsuited | 030 | frames-dir | repo dir partial (up only) — completed by this PR; speciesId 030 default is suited, variant selection owed |
| strikechamp_unsuited_full | 030 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |
| terradog | 014 | frames-dir | live 8-frame set, already in repo |
| terrapod | 037 | frames-dir | live 8-frame set, already in repo |
| tiidebiite | 002 | frames-dir | live 8-frame set, NEW to repo in this PR |
| toxitacle | 027 | frames-dir | live 8-frame set, NEW to repo in this PR |
| tyrage | 007 | frames-dir | live 8-frame set, already in repo |
| wispkin | 042 | frames-dir | live 8-frame set, already in repo |
| yogiferno | 046 | frames-dir | live 8-frame set, NEW to repo in this PR |
| zephling | 019 | sheet-only | gap-fill staged, NOT confirmed — sheet path only |

## Files in this PR (164: 163 new + 1 modified, 0 deletions)

- 14 creature walk sets NEW to the repo (8 PNGs + .walk.json each, verbatim
  from sprite-art/walk-frames/): chromejaww, cragarm, dreadtoise, duskfiend,
  gorokappa, mechapion, mythar, pupbble, pyromonk, reaperdile, strikechamp,
  tiidebiite, toxitacle, yogiferno. Reaperdile: the 8 canonical files only;
  the 2 `_clean` up-frame duplicates in staging were NOT uploaded.
- Dorowani corrected set (8 PNGs + manifest) in
  `src/assets/walk-frames/dorowani-walkfix-20261026/` — left rebuilt, right/up
  from other6, down from downgap (leg-gap wedge removed). The old live dir is
  NOT modified and is NOT wired.
- Gabu corrected set (8 PNGs + manifest) in
  `src/assets/walk-frames/gabu-walkfix-20261026/` — all 8 rebuilt from locked
  cells, shell present. The old live dir is NOT modified and is NOT wired.
- Partial repo dirs completed (12 PNGs, additions only, no file overwritten):
  sproutle up/left/right (repo had down only) and strikechamp_unsuited
  down/left/right (repo had up only), from the workspace live dirs.
- Astroleviathan left/right (4 PNGs + manifest) in
  `src/assets/walk-frames/astroleviathan-left-right-20261026/`. Down/up stay in
  the live astroleviathan dir.
- `src/lib/walkCycle.ts` (new), `src/lib/creatureWalkFrames.ts` (modified shim),
  this doc (new).

## Caveats, stated plainly

- Strikechamp variants share speciesId '030' and the call site passes speciesId
  only, so '030' resolves to the DEFAULT suited set. A variant-aware call site
  is owed before the unsuited set can be selected in game.
- Sheet-only 9: their repo walk-frames dirs (8 of 9 exist on main) are staged
  gap-fill sets, NOT confirmed, and are NOT wired by this PR. They switch to
  frames-dir only after Mars confirms the walk-fill sheet.
- Per-cell sheet direction verification (v1 caveat: locked manifest walk
  sub-roles are extractor-assigned, montage-spot-checked) is still owed for
  sheet-side step cells. This PR wires NO sheet-side step cells — sheet-only
  sets keep the static sheet path — so nothing unverified is wired.
- Razorgater down frames carry a grey ellipse ground shadow from the
  sprite-art cut (Pass 8 caveat, carried). Shadow removal still owed.
- All uploaded PNGs verified 64x64 RGBA before upload. Build gate: Vite build
  on a clean clone with these files applied (see PR checks).
