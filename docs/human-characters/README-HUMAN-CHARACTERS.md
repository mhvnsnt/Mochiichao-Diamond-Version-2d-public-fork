# Human Characters — batch 1 (docs + art assets only, no code swap)

This batch adds Human Characters lane work to the repo so nothing is lost.
It does NOT swap any art into the playable build: the 20 humanSheets.ts
placeholder silhouettes stay until a character has a finished 64x64 atlas
+ JSON manifest. No game code is edited in this batch.

## Diversity rule (standing, Mars)
Stop making all characters white. No character defaults to white/pale;
every new character gets a named race/ethnicity checked across the set.
Players already varied: A Black, B East Asian, C Latina, D white/blonde —
D is ONE option, not the default.

## Primary / variant / superseded (read CANON-HUMAN-CHARACTERS.md first)
- Mochiko v2 East Asian, no-tan (dark navy jacket with teal trim, teal skirt
  over teal leggings, navy sneakers, capsule backpack) is PRIMARY; v1
  (tan/cream uniform) is SUPERSEDED, kept on disk, not canon.
- Hex black v2 is PRIMARY, white v1 is kept as a VARIANT — Mars did NOT order
  Hex's race changed, so v1 is NOT superseded. Neither is deleted.
- Prof. Aeon black v2 is PRIMARY, white v1 is kept as a VARIANT — same
  correction as Hex, neither deleted.
- Mom is VARIABLE by player pick, NOT fixed canon: Mexican v2 is ONE variant
  example only, NOT "the" Mom; v1 (pale, fixed) is SUPERSEDED. Proposed
  (NOT yet Mars-decided) mapping: Player A -> Black Mom, B -> East Asian
  Mom, C -> Latina Mom, D -> white Mom, same outfit/personality/low
  bun/teal apron/mug, skin/hair/features change with variant. Whether the
  player also gets a separate "select your parents' race" option is OPEN —
  do NOT lock that in.
- Player A in-game sheet v1 is a 4-VIEW DRAFT ONLY — still needs walk
  frames, battle back view, portrait icon, and a 64x64 atlas + JSON
  manifest before it is called done. Do NOT call it finished.

## Excluded from this batch (discarded, identity-swap files, NOT uploaded)
- Player C corrected v2 (came out as Player A) — webp + json sidecar
- Player B corrected v2 (came out as a new female character) — webp + json
- Player D in-game sheet v1 (A/D mashup) — webp + json
- Player C corrected v3 text-only and Player B corrected v3 text-only —
  found in players/ but NOT in the PR include list and NOT Mars-OK'd yet;
  excluded as unclear, not silently uploaded. They stay local only.

## Status
All model sheets here are MODEL SHEETS ONLY (full-body front, locked
style) except Player A in-game draft above. In-game sheets (world
front/back/left/right, walk, battle front/back, portrait, 64x64 atlas +
manifest) are still owed for every OK'd character. See
GAP-CHECKLIST-ACTUAL-GAMES.md for the per-character done checklist.
