# Human Characters — LOCKED ART STYLE (Mars-approved 2026-10-25)

Reference anchors (do not drift from these):
- Player D — tech vest: LOCKED, primary anchor. Spiky blonde hair, goggles,
  purple/silver tech vest, data tablet.
- Player A — teal jacket: ACCEPTABLE, second anchor. Short curly afro,
  teal/chrome jacket, cargo pants, wrist data-device.

## The locked style, in words (use this exact block in every future prompt)
Clean 2D anime cel-shaded game art, full-body front view, standing pose,
plain light grey background, character centred head to feet.
- Faces: large expressive anime eyes with clean highlights, small nose,
  small mouth, clean dark outlines, face about 1/6 to 1/7 of body height,
  youthful trainer proportions (about 6-7 heads tall). NO soft realistic
  rendering, NO small narrow realistic eyes, NO wide realistic smile with
  detailed teeth, NO painterly skin shading.
- Hair: clean anime hair — bold separated strands / spikes / curls with
  dark outlines and flat colour + simple highlight, NOT soft realistic
  wavy hair with fine flyaway strands, NOT a loose realistic braid mass.
  Hair shape must read as a silhouette at sprite size.
- Bodies/outfits: clean flat colours + simple cel shading, dark outlines,
  techwear with chrome/silver accents and simple circuit/panel details.
  Outfits must be readable at small size: one jacket/vest, one trouser,
  one shoe — NO layered shorts-over-leggings, NO crystal backpack pods,
  NO stacked gimmick accessories that clutter the silhouette.
- Background: plain light grey, no scene, no shadow pool, no text.
- Framing: full body, head to feet, centred, no crop.

## Corrections log (Mars, 2026-10-25, recorded — do not repeat these drifts)
- Player C — windbreaker: CLOTHING + BODY ACCEPTABLE, FACE + HAIR DRIFTED.
  Drift: soft realistic face, wide realistic smile, soft wavy realistic
  hair, braid mass. Correction: redraw face/hair ONLY in locked style
  (large anime eyes, clean anime side braid, same face proportions as
  A/D), keep orange/cream windbreaker, denim shorts, boots, belt pouches
  exactly. Do not change body/outfit in the correction.
- Player B — circuit hoodie: KIND OF OKAY, OUTFIT WEIRD + FACE + HAIR DRIFTED.
  Drift: narrow realistic face/eyes, flat realistic hair, outfit clutter —
  crystal backpack pods, layered shorts over leggings, over-detailed
  circuit lines. Correction: simplify outfit to one navy tech jacket +
  trousers + trainers (no crystal pods, no layered shorts), redraw
  face/hair in locked style (large anime eyes, clean anime ponytail).
  Keep: tall slim build, East Asian features, navy/green colour idea.
- Player D: NO correction — this is the anchor.
- Player A: NO correction — acceptable as-is.

## In-game sheet rule (Mars, 2026-10-25)
As we go, make in-game sheets ONLY for pieces Mars has given the OK on.
- OK for in-game sheets now: Player D (full), Player A (full).
- NOT OK yet: Player C (until face/hair correction is approved),
  Player B (until outfit + face/hair correction is approved).
- In-game sheet = 64x64-based atlas + JSON manifest, views: world front,
  back, left, right, walk up/down/left/right, battle back (player) /
  battle front (trainer), portrait icon. A model sheet alone is NOT an
  in-game sheet. A corrected model sheet alone is NOT approval — Mars must
  OK the correction first.

## FAILED ATTEMPTS — DISCARDED, do NOT use, do NOT push (checked by eye 2026-10-25)
- Player C corrected v2: identity swap — output is Player A (teal jacket,
  afro, cargo pants), NOT Player C. Discarded. Player C still needs a
  face/hair correction, redone from text only, no second-character image
  reference, to avoid identity bleed.
- Player B corrected v2: identity swap — output is a new female character
  (curly ponytail, navy jacket), NOT Player B (tall slim man). Discarded.
  Player B still needs outfit + face/hair correction, redone from text only.
- Player D in-game sheet v1: identity swap — output is a Black woman with
  blonde afro in a purple vest, a mashup of A + D, NOT Player D (blonde
  spiky boy, goggles, tech vest, tablet). Discarded. Player D in-game sheet
  must be redone from text only, no image reference chaining.
- Lesson: do NOT chain multiple character images in one generation batch —
  identities bleed. Generate corrections / sheets from text description
  in the locked style, one character at a time, and eye-check identity
  before presenting anything as a correction or a sheet.

## Push / documentation rule (Mars, 2026-10-25)
Remember all of this, push approved art to the repo, document the
conversation, keep making art. This lane does NOT push directly — it
prepares PR-ready files + manifest, and hands them to main chat, which owns
the PR gate (branch from latest main, additions only, 0 deletions, build
passes, no overwriting sprites-2d or UI art). Local working files stay in
~/workspace/mochiichao-work/human-characters/ until main PRs them.
