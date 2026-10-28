# SPRITE-SHEET + PALETTE FORMATS — LUSTRE INTO THE BUNDLE FORMAT (List 2, #15)

Sideline H, 2026-10-27. A bundle-format update **proposal** — additive
to the avatar-stack bundle contract
(`show/production/tooling/avatar-stack/`, schema
`mochiichao-show/avatar-bundle/v1`). Nothing here changes a v1 field.

## Teardown: the two format conventions (structure, public sources)

1. **Frame-grid sheets.** Sprite animation is stored as a regular
   grid — fixed cell size, frames in reading order, one row per
   action in most conventions — so any tool can slice any sheet
   without a sidecar. The bundle format's clip spec already plays
   this role for video (720×720, 24 fps, measured by ffprobe, never
   asserted); the proposal below keeps the same discipline for
   variants: measured, hashed, registered.
2. **Palette-swap variants.** The classic variant system (the
   "shiny" pattern) stores **no second artwork**: one palette map
   (source colour → variant colour) is applied to the same pixels.
   Identity lives in the linework and the unmapped colours; the
   variant is a *data file*, a few hundred bytes, not a redraw.

## The system rule for Mochiichao: LUSTRE is the palette variant

- Every species may carry **one lustre palette map**, authored in its
  species sheet (a palette block beside the palette seed), mapping
  its dominant colour families to their lustre families.
- **Identity locks are never in the map**: outline colour, eye
  colour, and any colour the sheet marks protected stay identical —
  that is what keeps a lustre a variant of the same creature rather
  than a recolour of a stranger. (Style corollary, per the Mochi
  Style Spec work: a palette swap changes colours only — never the
  line, the finish, or the render style of record.)
- A lustre is derived, never drawn: same silhouette, same frames,
  same gate metrics should pass identically.

## Bundle format v2 (additive block)

In `manifest.json`, one new optional block; v1 consumers ignore it:

```json
"palette_variants": [
  {
    "variant_id": "lustre",
    "kind": "palette_swap",
    "palette_map": {"path": "<species>-lustre-palette.json", "sha256": "…"},
    "derived_from": "poster",
    "files": {
      "poster": {"path": "<species>.lustre.webp", "sha256": "…", "bytes": 0}
    },
    "clips": [],
    "quality_status": "PENDING_GATE"
  }
]
```

Rules:

1. **Poster first.** The lustre poster is mandatory when a lustre map
   exists; lustre clips are optional per bundle (they cost a
   frame-wise pass of the same tool — listed under `clips` only when
   actually produced, never promised).
2. **Measured like everything else.** Every derived file gets the v1
   treatment: real path, sha256, bytes, and the measured spec for
   clips. A variant entry with no produced file is a spec violation,
   not a placeholder.
3. **Registration.** `clip-index.json` gains the variant under the
   bundle's entry with its own quality status; the likeness gate runs
   on the lustre poster against the same canon cutout (silhouette
   metrics must match the base poster's within rounding — a palette
   swap that moves the silhouette is a bug, and the gate catches it).
4. **Naming.** `<species>.lustre.webp` for the poster;
   `<species>-<variant>--lustre.mp4` / `.transparent.webm` if clips
   are produced. The double hyphen keeps variant-of-variant parsing
   unambiguous.
5. **Palette maps live with the species**, not the bundle: the bundle
   references the map by path + sha256 from the species' sheet data,
   so game and show derive the identical lustre from one source.

## The tool (proof, in `tools/`)

`palette_variant.py` implements the swap on stills: for each map
entry `{from, to, tolerance}`, pixels within tolerance of `from`
shift by the (to − from) delta, weighted toward the centre of the
tolerance band so gradients and soft edges ride along; protected
colours and the near-white field are never touched. Test run and
visual check: see `TEST-RESULTS.md`.

Sheet-format note: the batch art pipeline (Sideline C's PROCESS.md)
works from flat designs on a white field — exactly the input this
tool expects, so a lustre preview can be produced for any designed
species the day its palette map is authored.

## Coverage notes

- Frame-grid and palette-swap conventions are among the most
  thoroughly documented format patterns in public game-dev and
  decomp documentation; confidence high.
- The v2 block is a proposal to the avatar-stack contract, staged
  with the teardown package; adopting it is a one-line schema bump in
  `generate_bundle.py` (out of this sideline's scope — flagged in
  STAGING.md).
