# Lustre baked-shadow sweep — 2026-10-28

**Owner order (Jamar, 2026-10-28):** all Lustre versions need any baked
shadow on the feet removed; the shadowed originals are marked obsolete;
the cleaned versions are marked as the current/used ones. This follows
the standing no-baked-shadows rule (shadows are added at composite time,
never painted into character art) and the current-version law.

Machine-readable record (every file, per-file verdict and action):
`show/production/lustre-shadow-sweep-20261028.json`.
Short notes also sit beside the art itself: a `SHADOW-SWEEP-20261028.md`
in each lustre folder.

## What was done

- **1,246 lustre images audited — every one opened and inspected**
  (all of `public/assets/variants/lustre/`, everything under
  `sprite-art/animation/expanded-scope/lane100/` with lustre in the
  path, and the two battle examples in `show/production/battle/examples/`).
- **163 files had a baked ground/foot shadow and were cleaned.** The
  cleaned file sits beside the original as `<name>-clean-20261028.png`
  and is the **CURRENT/used** version. The shadowed original is
  **OBSOLETE for art use** (kept on disk — nothing was deleted).
  Only shadow pixels were made transparent (18,562 px total); every
  kept pixel is byte-identical to the original. Each family's cleaning
  was proofed before/after on white and dark backgrounds.
- **1,050 files checked clean** — no baked shadow; unchanged and still
  current. That includes all 540 palette swatches (flat colour strips,
  no character art) and every Wispkin set (his smoke tails are design,
  not ground shadow).
- **21 sheets display pre-clean art** (show sheets and combined
  sheets). They are dated 2026-10-26 presentation/build records, so
  they were **not** pixel-edited; they are marked **superseded for art
  use** by the cleaned version files. Regenerating them from the
  cleaned art (the lane100 `make_show_sheet.py` builder) is the
  follow-up if fresh sheets are wanted.
- **12 files are AMBIGUOUS — owner's call, not cleaned:** the whole
  **yogiferno** family (11 lane100 files + the public front). A pale
  halo pools under yogiferno's feet, but the same halo wraps the whole
  body — head, arms, everything — as a flame aura that is part of the
  design. Shadow and aura cannot be separated without guessing at
  pixels, so nothing was removed. If the owner rules the under-foot
  part is shadow, it can be cleaned then.

## Where the shadows were

The shadow came from each species' base art and was carried through
the palette transforms into every variant of the family (the variants
share pixel-identical alpha, so the shadow sits on the same pixels in
all of them). Families cleaned: aerobeak, chromejaww, dorowani, gabu,
gearkid, kittember, manticlaw, mythar, oblivirex, punchkid,
quakehound, reaperdile, sproutle, terradog — bases + all 10 lustre
methods each, plus the public fronts for aerobeak, chromejaww,
kittember, manticlaw, oblivirex, quakehound, reaperdile, sproutle and
terradog. (The dorowani and punchkid public fronts come from different
source art and were verified clean.) Kittember's was the biggest: a
full grey ellipse disc under the sitting cat, 411 px in the base
alone.

## Judgment calls (design, NOT shadow — left in place)

Recorded so the owner can override any of them:

- **megalochrome** — the concentric blue ring under it is a water
  ripple, part of the design.
- **duneclaw / razorgater** — the form under the body is the
  creature's own tail, not a shadow.
- **terrapod** — the fringe under the rock body is moss that follows
  the rock's outline.
- **cragarm / strikechamp** — darkening at the feet is sole/boot
  shading that follows the foot outline.
- **zephling** (cloud swirls), **tyrage** (ground-sprawling
  tentacles), **duskfiend** (flame hem), **pebblefist** (drips),
  **cocoonode** (facet shading), **Wispkin** (smoke tails) — all
  design.
- **kittember** also carries a soft ambient glow beside its body
  (not under the feet); only the ground disc was removed.
- **quakehound** keeps its light belly-bottom pixels between the
  legs — that is the body's underside, identical in the base the
  owner has already seen; the separate slab beneath it was removed.

## Also in this change — Sproutle record corrected (Part 1)

Owner ruling 2026-10-28: the "two Sproutle likenesses" framing was a
false conflict. `sprite-art/portraits-scripted-v3/sproutle-portrait-scripted-v3.png`
IS Sproutle's canon likeness; `public/assets/variants/lustre/sproutle_lustre_front.png`
is the Lustre (shiny variant) form, whose different colours are the
point of the form. `DESIGN-BRIEF-canon-world.md` §9 C4 and §8 item 2
are marked RESOLVED with this ruling, and the worked case in
`CANON-CONSISTENCY.md` is corrected the same way. The Sproutle
reference pack was checked: it flags no likeness conflict and already
names the cleaned canon cutout correctly, so it needed no change.
