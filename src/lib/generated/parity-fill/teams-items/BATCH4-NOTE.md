# PR Batch 4 — Sprite-wiring manifest + fixed teams + items/shop/capture/save (shapes, NOT live wiring)

Status: landed as data under `src/lib/generated/parity-fill/`.
NOT imported by App.tsx / BattleView / RosterView / ShopView / gameStore yet.
Live wiring + playtest are later steps (finish-first order: playtest LAST).

## Counts

- Sprite-wiring manifest: 51/51 creatures mapped (staged). Live wired: 0/51
  UNCHANGED by this batch — spriteSheets.ts still imports only Dorowani 147 +
  Gabu 148; every other species still renders the silhouette fallback in live
  code. Placing the manifest does NOT change live wiring; do not report it as
  wired. Battle front staged 50/51, battle back staged 50/51, icons 51/51
  (41/51 Mars-approved, 10 derived head-crops awaiting Mars), idle/hurt/attack
  51/51, shiny-v2 fronts+palettes 51/51, footprints 37/51 (14/51 footless by
  design, feet never invented), walk dirs 50/51, cry hook 0/51 (no audio).
- Mechapion battle_back: STAGED-UNWIRED (cells exist, 22 game-ready cells, no
  back role assigned). Never guessed; wiring must fall back to front/mirror
  until a true back is assigned.
- No TeamView.tsx exists in live code (battle path BattleView.tsx, team path
  RosterView.tsx via CreaturePortrait.tsx). This batch does not create one.
- Fixed teams staged: 16/16 teams, 33/33 slots = 5 fixed-default (Jax first/mid/
  last + Falk dojo2 + Lin dojo1) + 10 carry-over in-code teams (Hex, Youngster
  Jay, Lass Amy, Hiker Dan, Bug Catcher Rick, Acolytes Ken/Ren/Shin/Ryu,
  Hacker Grunt) + 1 species-locked Cowboy team (6 slots, levels/moves open).
  Jax/Falk moves + Jax rewards + Cowboy levels: open, not invented.
  Known wiring flags carried verbatim, not resolved: Lin 039 ID collision
  (code Dreadtoise vs roster Shellguard), Bug Catcher Rick 004/Squirmite ID,
  Falk same-line team exception + Lv20 Stormtalon vs Lv34 threshold tension.
- Randomized mode: settings option ONLY, default fixed. Seed =
  (saveFileId, trainerId, fightPoint). Rules 8/8 staged. Excluded from
  variation: Cowboy (locked), Falk, Lin, all carry-over teams.
- Items/shop: shop rows priced 6/6 (4 HAVE-in-code + 2 DERIVED). Live ShopView
  wiring 4/6 rows. Sell rule floor(buy/2) already in code.
- Capture Capsule: DERIVED, NOT Mars-locked (see CAPTURE-CAPSULE-DERIVATION.md
  + items-shop-capture-save.json captureCapsuleDerivation). Capture Capsule
  600 CR / 1.5x, Prime Capsule 1200 CR / 2.0x, from FireRed Great/Ultra Ball
  prices (600/1200) + sBallCatchBonuses (15/20 vs base 10). Master tier: not
  priced, not sold, no guaranteed catch invented.
- Save shape: 13/14 defined (10 HAVE-in-code incl. dex partial + 3 SHAPE-FILLED
  here: healPoint, settings.teamMode, resolvedTeams — 3/3 = 100% of the named
  ask). Remaining NEED: 1/14 (flags formal list; completedEvents is the
  current generic mechanism). CORRECTION: the staged file claimed 11/14 HAVE +
  3/14 NEED, but its own list gave 10 HAVE + 4 NEED; corrected counts here.
  Shape-filled is NOT code-wired: gameStore/saveSystem code is unchanged.

## Files

- sprite-wiring/sprite-wiring-manifest.json, sprite-wiring.ts,
  SPRITE-WIRING-NOTE.md, menu-meta-replacement-table.md (staged, verbatim)
- teams-items/fixed-teams.json, randomized-mode.json, README.md (staged, verbatim)
- teams-items/items-shop-capture-save.json (UPDATED: capsule derivation +
  save shapes; all other content verbatim)
- teams-items/CAPTURE-CAPSULE-DERIVATION.md (new)

## Held

- Live sprite wiring 0/51, live shop capsule rows 0/2, live save-field code
  wiring 0/3, Jax/Falk moves, Cowboy levels, Mechapion back role, TeamView.
  No Pokemon names/cries/exact dialogue/town/character names copied verbatim.

## POST-BRIEF Mars decisions (2026-10-26 ~14:15 CDT) — NOT applied here, parent to confirm

These decisions landed in standing memory AFTER this batch's task brief (which
ordered teams per the staged fixed-teams.json, flags carried verbatim):

- TECHNICAL CALL RESOLVED — Roster wins: 003 = AquariiOS (hyphen OUT),
  005 = Chromejaww (roster; Chromedile is the old name, NOT a separate
  evolution), 039 = Shellguard (pre-evolution of Dreadtoise; Sproutle ->
  Shellguard -> Dreadtoise), 040 = Dreadtoise final. Sproutle stats = HIGHER
  numbers (roster 55/68/64/45/55/31). Bug Catcher Rick = Squirmite, NOT
  Razorgater (fix ID to 016). Drift explanation: the two lists disagree by
  which monster sits at which number — same number, different monster/name.
  This batch still ships fixed-teams.json verbatim per its brief (Lin 039
  collision + Rick 004/Squirmite flags intact); applying roster-wins (Lin
  039 = Shellguard, Rick 016 = Squirmite) is a follow-up delta, not done here.
