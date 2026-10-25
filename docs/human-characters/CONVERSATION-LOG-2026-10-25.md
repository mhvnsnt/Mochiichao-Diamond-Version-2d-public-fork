# Human Characters lane — conversation log, 2026-10-25 (for repo / PR)

This file documents the whole Human Characters lane conversation on
2026-10-25, so nothing in it is lost when it is pushed to the repo.
It is a LOG, not a canon change by itself — canon lives in
CANON-HUMAN-CHARACTERS.md and STYLE-GUIDE.md.

## Queue (from kickoff)
Player characters -> Hex, Prof. Aeon, Mochiko, Mom -> trainers by
location/role -> antagonists (Hackers/Syndicate/Liberation Front, Krix,
Castagnoli, Champion Mythar) -> everyone else + generic townspeople.
UI art is a SEPARATE lane — not built here. Original art only.
Nothing is committed from this lane directly — main chat owns the PR gate.

## Players batch 1 — model sheets (front view only)
- A teal jacket: young Black woman, short curly afro, teal/chrome jacket.
- B circuit hoodie: tall slim East Asian man, long black ponytail,
  navy hoodie with neon green circuits (outfit later judged weird).
- C windbreaker: plus-size Latina woman, long wavy dark brown side braid,
  orange/cream windbreaker, denim shorts, boots, capsule belt pouches.
- D tech vest: short-stature young man, short spiky blonde hair, goggles,
  purple/silver tech vest. LOCKED as primary style anchor (Mars).

## Style lock (Mars, 2026-10-25)
- D = primary anchor, A = acceptable second anchor.
- Clean 2D anime cel-shaded, full-body front, plain light grey background,
  large expressive anime eyes, clean dark outlines, flat colour + simple
  cel shading, techwear with chrome/silver accents, readable at sprite size.
- NO soft realistic rendering, NO small narrow realistic eyes, NO wide
  realistic smile with detailed teeth, NO layered shorts-over-leggings,
  NO crystal backpack pods, NO stacked gimmick accessories.
- C correction: clothing/body acceptable, face/hair drifted — redraw
  face/hair ONLY in locked style, keep outfit exactly.
- B correction: kind of okay, outfit weird + face/hair drifted — simplify
  outfit to one navy tech jacket + trousers + trainers, redraw face/hair
  in locked style, keep tall slim build / East Asian features / navy-green.
- Mars: "And as we go we need to start making in-game sheets. Of
  everything that I give the ok on." OK so far: D (full), A (full).
  NOT OK yet: C (until face/hair correction approved), B (until outfit +
  face/hair correction approved).
- UPDATE 2026-10-25 13:06 CDT: Mars reacted 👍 to Player B corrected v3
  (text-only, navy tech jacket, no pods/layered shorts). Treat B v3 as
  APPROVED for in-game sheet work, pending any later correction from Mars.
  C v3 was shown in the same batch and had no reaction recorded yet.
- UPDATE 2026-10-25 13:06 CDT: Mars also reacted 👍 to Player C
  corrected v3 (text-only, thick anime side braid, large anime eyes,
  orange/cream windbreaker kept). Treat C v3 as APPROVED for in-game
  sheet work. Players A, B, C, D model sheets are now all OK'd.

## Failed corrections — DISCARDED, DO NOT PUSH
- C corrected v2 came out as Player A (teal jacket, afro). Discarded.
- B corrected v2 came out as a new female character. Discarded.
- D in-game sheet v1 came out as a Black woman with a blonde afro
  (A/D mashup). Discarded.
- Lesson: do NOT chain multiple character images in one generation batch
  (identities bled). Redo from TEXT description only, one at a time,
  eye-check identity before presenting.
- GOOD: Player A in-game sheet v1 — identity correct, 4 views
  front/back/left/right, locked style. Still a DRAFT, not finished:
  walk frames, battle back, portrait icon, 64x64 atlas + JSON manifest owed.

## Named canon batch 1 — model sheets (2026-10-25)
- Hex rival, Prof. Aeon, Mochiko assistant, Mom — all first came back pale.
- Mars reacted 👍 to Hex and Prof. Aeon v1, 👍 to Mochiko v1 with a
  correction below.

## Diversity correction (Mars, 2026-10-25)
- Mars: stop making all the characters white; make them Asian / Black /
  Mexican / etc. — start with Mochiko, and the other named characters.
- Mochiko v2: East Asian, warm brown skin, dark brown twin tails,
  NO tan/cream/beige in the outfit (dark navy jacket + teal trim, teal
  skirt/leggings, navy sneakers, capsule backpack). v1 tan/cream uniform
  superseded for the outfit.
- Hex v2: Black. Prof. Aeon v2: Black. Both eye-checked, locked style held.
- CORRECTION (Mars, same day): he did NOT order Hex/Aeon's races changed.
  Leave their white v1s as VARIANTS, leave the black v2s as the current
  versions since they were already made. Delete neither.
  Confirmed again by Mars: "leave them black."

## Mom — VARIABLE (Mars, 2026-10-25)
- Mom's race VARIES with the player character picked. She is NOT fixed
  to any one race. The Mexican Mom v2 is one variant example only.
- Proposed (NOT yet decided): Player A -> Black Mom, B -> East Asian Mom,
  C -> Latina Mom, D -> white Mom; same outfit/personality (low bun,
  teal apron, mug), skin/hair/features swap.
- OPEN (Mars undecided): a separate "select your parents' race" option
  in character creation, independent of the player pick. Do NOT lock in.

## Autonomous-work clarification (Mars, 2026-10-25)
- "Keep working here, I don't know why you keep stopping, is it like
  cannot all of you agents run at once or something? Keep making the
  rest of the characters in the character sheets and the art and the
  sprites for the characters and everything. So we can get it all into
  the game and so I can start playing the game, And getting it 100%
  complete."
- Answer given: lanes CAN run in parallel (Main, Sprite Art, UI Art,
  Human Characters are separate agents); stops were turn boundaries /
  waiting for handoffs, not a concurrency limit. Lane now continues
  without waiting per character.

## Push request (Mars, 2026-10-25)
- Push ALL of this to the repo: whole conversation documented, all images
  in the repo, WITHOUT clobbering anything from any other side/agent,
  and get it all to the playable build. Keep making whatever is needed.
- Mars also asked: what do the actual game files have for every character,
  so the gaps can be filled? Answered in
  human-characters/GAP-CHECKLIST-ACTUAL-GAMES.md (FireRed / HeartGold
  structure, structure/rules only, no code/art copied).

## Files in this lane (local, for the PR batch)
- STYLE-GUIDE.md, CANON-HUMAN-CHARACTERS.md, CONVERSATION-LOG-2026-10-25.md
  (this file), GAP-CHECKLIST-ACTUAL-GAMES.md,
  manifest-players-batch1.md, manifest-named-canon-batch1.md
- players/: A, B, C, D model sheets (v1) — plus DISCARDED C v2, B v2
  (do NOT include those two files in any PR)
- named-canon/: Hex v1+v2, Aeon v1+v2, Mochiko v1+v2, Mom v1+v2-variant
- in-game-sheets/: Player A v1 (GOOD, draft) — plus DISCARDED D v1
  (do NOT include that file in any PR)
