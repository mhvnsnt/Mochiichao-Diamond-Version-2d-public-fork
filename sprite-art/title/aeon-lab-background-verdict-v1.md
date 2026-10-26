# Aeon Lab Background — A2 verdict v1 (2026-10-26)

Local staging only: no GitHub push, no work-clone git changes, no
src/assets/ changes. SHOW-FIRST: this verdict and the crop below
are staged for Mars to see; nothing here replaces
aeon-intro-frame-v1.png (the outdoor garden-lab frame, which
stays the garden-lab reading) and nothing is wired into the game
by this file.

## Verdict: PROVISIONAL IS USABLE — no new lab painting needed

- Source assessed:
  sprite-art/title/media-generation-aeon-lab-background-provisiona-0-8ad70ff1-5e83-4c07-bc40-1e850365f2b7.png
  (2240 x 1120, RGB). File untouched by this pass.
- Staged spec-size draft (NEW file, crop only — no pixels
  repainted, no content invented):
  sprite-art/title/aeon-lab-background-v1-spec-crop-1920x1080.png
  (1920 x 1080, centre crop: x offset 160, y offset 20 from the
  2240 x 1120 source). Eye-checked after cropping: PASS.
- A2 row status moves from "NOT MADE — location not locked"
  (TITLE-SEQUENCE-ART-SPEC.md §4) to: location IS now readable
  as an indoor greenhouse-lab, and the provisional covers it.
  Counting this verdict + crop: A2 = usable, pending Mars's
  show-first yes; a fresh lab painting is owed only if Mars
  rejects this reading (see "What would trigger a new version").

## Eye-check evidence (provisional, full resolution)

- PASS — indoor greenhouse-lab reads clearly: wooden benches,
  glass terrariums and jars holding glowing teal/pink plants,
  flasks, gardening tools, hanging plants, and wide open
  doors/windows onto a garden meadow at dawn/dusk.
- PASS — palette matches the title set: teal + pink glow plants
  rhyme with the T2 title particles and with Aeon's teal circuit
  suit in aeon-intro-frame-v1.png; no clash with the white lab
  coat (Aeon will read against the bright centre doorway).
- PASS — no people, no creatures, no text baked in (jar/flask
  labels are blank or glowing shapes, nothing legible), no
  Pokemon motifs anywhere.
- PASS — centre floor path is empty: the natural Aeon slot is
  CENTRE, standing on the floorboards in front of the open
  doorway, with the garden vista behind him. This is also the
  slot that keeps him clear of both side benches.
- PASS — the crop keeps all of the above: doorway, floor path,
  both bench rows (slightly trimmed at the far left/right
  edges, nothing essential lost).

## Placement rules for wiring (whenever this background is used)

- Aeon stands CENTRE, not right. In aeon-intro-frame-v1.png he
  stands right in an outdoor clearing; that composition does
  not transfer here — the provisional's right side is crowded
  with a bench, crates, and jars, and a right-placed Aeon would
  overlap them.
- Dialogue window is a UI overlay at the bottom (per the
  composition pattern): it will cover the lower floorboards and
  the bottom corners. That is acceptable — the corners hold
  tools/jars, not story content — but the window must be
  opaque enough to read over the busy lower corners.
- Do NOT use this background and the outdoor garden-lab frame
  in the same beat as if they were one room: this is the
  INDOOR lab; aeon-intro-frame-v1.png is the OUTDOOR garden lab.
  A cut between them needs a fade, not a slide.

## Caveats (honest, not blockers)

1. Busy lower corners: bottom-left (big jar, tools bench) and
   bottom-right (crates, bench, jars) are detailed. Fine under
   a UI dialogue window; not fine if Mars wants a clean empty
   lower third baked into the art itself.
2. Warm/dark sides vs bright centre: the sides are moodier than
   the outdoor frame. Aeon in the bright centre solves the
   readability question; a side placement would not.
3. Aspect: the source is 2240 x 1120 (2:1), not the specced
   1920 x 1080. The staged crop fixes this for wiring; the
   source file itself is kept as the master, never overwritten.

## What would trigger a new version (do not guess one now)

- Mars wants a sterile/tech lab (metal, screens, no plants)
  instead of this greenhouse-workshop reading.
- Mars wants Aeon on the right (matching the outdoor frame) —
  that needs a re-composed background with a clear right slot,
  not a crop of this one.
- Mars wants a clean empty lower third baked in for the
  dialogue window, rather than a UI overlay over busy corners.
- Until one of those is said, no new lab painting is staged:
  generating a second lab now would fork the location design
  the spec said was not locked, and this one already passes.

## Files (all in sprite-art/title/)

- Assessed (untouched):
  media-generation-aeon-lab-background-provisiona-0-8ad70ff1-5e83-4c07-bc40-1e850365f2b7.png
- New this pass (crop only, labelled as such):
  aeon-lab-background-v1-spec-crop-1920x1080.png
- Companion (untouched, outdoor counterpart):
  aeon-intro-frame-v1.png
- Reference (Aeon likeness, human-characters lane, not remade):
  A1 primary per TITLE-SEQUENCE-ART-SPEC.md §4.
