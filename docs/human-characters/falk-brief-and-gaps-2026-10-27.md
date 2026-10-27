# Falk (Dojo 2) — staged brief + named gaps, 2026-10-27

Status: STAGED ONLY. No PR, no merge, no repo edit, no wiring, no generation.
Art steps done: **0/8 = 0%**. This is a full-character gap, not a battle-back gap.

## What was re-verified from canon docs (no invention)

- Dojo 2 leader is Master Falk. Type: Aero. Badge: Wind Fragment.
  Dojo: "Aero Dojo — Wind Wing" (CANON-FILL-2026-10-26.md).
- Dojo-leader roster, locked list (SYNDICATE-ADMINS-2026-10-26.md):
  Lin, Falk, Tetsu, Kenji, PHANTOM, Shizuku, Homura, Luigi.
- Dialogue approved 2026-10-26 (MASTER-FALK-DIALOGUE-DRAFT-2026-10-26.md):
  intro / about-to-win / defeat / after-badge lines, built on Mars's verbatim
  seeds "I'm high as a kite", "free like a bird", "I'm about to fly him out".
  Voice/theme: high, mountain-top, wind, swift, free. That is voice, NOT a look.
- Team as briefed for this task: 019 Lv18 / 020 Lv19 / 021 Lv20, with
  Stormtalon (021) at Lv20 below its Lv34 evolution threshold as an explicit
  exception. Species names in lane docs: 019 Zephling, 020 Aerobeak,
  021 Stormtalon (LUSTRE-10-VARIANT-SPEC-2026-10-26.md).
- File search, 2026-10-27: the only Falk file on disk is the dialogue draft
  above. No Falk model, world view, walk, battle, portrait, atlas, or step-8
  file exists. The dojo-leaders model sheet checked this run shows Shizuku +
  Homura, not Falk — it is NOT a Falk source.

## LOCK-STATUS CONFLICT — flagged, not papered over

The team lock status is NOT consistent across same-day lane docs, so the
data step below is not counted as done:

- POKEMON-PARITY-GAPS-2026-10-26.md and TEAM-VARIATION-SYSTEM-PROPOSAL-2026-10-26.md
  say Falk's team 019/020/021 is LOCKED.
- MARS-DECISIONS-REMAINING-2026-10-26.md says "Falk himself is done. The only
  open piece is his team" and the lane Aero team is "marked REPLACE placeholder,
  not Mars-confirmed", with the code placeholder a single Sproutle (wrong theme).
- MASTER-FALK-DIALOGUE-DRAFT-2026-10-26.md also says "Team still open: code
  placeholder Sproutle vs lane Aero team 019 Lv18 / 020 Lv19 / 021 Lv20."

Mars (parent) to confirm in one line: lane Aero team, Sproutle placeholder, or
a different Aero team — and whether the Lv20 Stormtalon exception stands.
Until then, no Falk data/step-8 JSON is issued as locked.

## The 8 art steps — all GAP, all blocked on the same missing input

| # | Step | Status | Blocker |
|---|------|--------|---------|
| 1 | Model sheet | GAP 0% | No locked look: no face, skin, hair, eyes, age, build, outfit, or prop in canon |
| 2 | World views (front/back/left/right) | GAP 0% | Depends on step 1 |
| 3 | Walk frames | GAP 0% | Depends on step 1 |
| 4 | Battle front | GAP 0% | Depends on step 1 |
| 5 | Battle back | GAP 0% | Depends on step 1 (dojo leaders are fought front-facing; back owed only if swappable/playable, per Lin/Castagnoli precedent — still 0 either way) |
| 6 | Portrait | GAP 0% | Depends on step 1 |
| 7 | Data / step-8 JSON | GAP 0% | Team lock conflict above; no look to record |
| 8 | Atlas (64x64) + manifest | GAP 0% | Depends on steps 1–7 |

No generation prompt is issued here, deliberately. Under the named-canon check
rule (CANON-HUMAN-CHARACTERS.md) and the likeness rule (LIKENESS-GENERATION-RULE.md),
a named canon character with no gender/race/description in canon must be marked
UNVERIFIED / proposal and asked about — not silently invented, and not presented
as canon. Guessing an Aero outfit (wind jacket, goggles, feathers, etc.) would
be invention, so it was not done.

## What Mars must supply before any Falk generation (minimum)

1. Age/build + face/skin/hair/eyes, OR an approved reference image to generate from.
2. Outfit in order: shirt/jacket pattern, collar, tie or no tie, belt, trousers, boots.
3. Prop (if any) and pose. "Wind" theme alone is not an outfit.
4. Team confirmation (see conflict above).

Once 1–3 exist, generation proceeds reference-first, attributes only, no name
in any prompt, and the 8 steps can be built in the Lin/Castagnoli pattern.
Until then the correct result is this named-gap brief, not a guessed set.
