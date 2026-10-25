# Wispkin canon correction (Phase 2d, 2026-10-25)

PR #16 wrongly shipped V2 as the main Wispkin set. This PR corrects it.

- DEFAULT likeness: V1, under `src/assets/sprites-2d/wispkin/`
  (main + angles-top-diagonal + angles-lighting). V1 is the standard
  Wispkin: black drop body, white cracked skull face, black wisp smoke.
- V2 = skinny-armed VARIANT only, under
  `src/assets/sprites-2d/wispkin-variant-skinny-armed/` — NOT the default.
  V2 content is preserved byte-identical; nothing was deleted.
- V3 = trait-animation depiction, under
  `src/assets/sprites-2d/wispkin-trait-animation/` — V3 shows the
  stuck-mask trait animation (hands bound to the mask by glue strands).
  V2/V3 are depictions of something that happens to Wispkin at times
  when trying to take its hands off its face; they are NOT replacements
  for the V1 default likeness.
- Wispkin atlas work uses V1 only (see `src/assets/sprite-atlases/wispkin/`).
