# TEST RESULTS — Sideline H tools (2026-10-27)

## 1. Animscript validator (`tools/validate_animscript.py`)

Run on `examples/hydro-rush.animscript.json`:

- First run: **INVALID** — correctly caught that the Mochii reference
  performance had neither `overrides` nor an explicit
  `no_variance_reason`. The example was fixed (reference-performance
  declaration added); the validator was not loosened.
- Second run: **VALID** (exit 0). The Flickfin performance passes the
  anchor enforcement: its body track and overrides reference only
  anchors in its `anchors_available` (no hand/forelimb anchors on a
  limbless body), every override carries a reason, and
  `variance_notes` is non-empty — the anatomy-variance doctrine holds
  at the file level.

## 2. Palette tool (`tools/palette_variant.py`) — TEST-ONLY outputs

> **Style-law label:** the batch-001 designs were **rejected by the
> owner on style** (preschool read; not Mochiichao universe art).
> Test A below uses a batch-001 PNG purely as a format/mechanics
> input. Its output is **TEST-ONLY — not production art, not a lustre
> exemplar.** Lustre exemplars must come from canon repo art; Test B
> is the canon-art mechanics check (illustrative palette only — no
> canon lustre map for any species has been authored yet).

### Test A — batch-001 Flickfin (TEST-ONLY, rejected-style source)

- Input: `species-art/new-gens/gen-r2/flickfin.png` (1920×1280,
  white field) + `examples/flickfin-lustre-palette.json`
  (silver-blue family → gold family; outline black protected).
- Output: `examples/flickfin.lustre-preview.png` (+ report JSON).
- Measured: 342,172 pixels remapped across 3 entries (136,924 /
  76,668 / 128,580); 91,751 protected (outline/eye blacks);
  1,979,131 white-field pixels skipped. Runtime ~18 s at full res.
- Visual check: body reads gold with pale gold-cream belly; black
  outline and eye fully intact; white field clean. Unmapped accent
  colours (the decorative bubbles' cyan, the navy brow stripe) are
  unchanged — correct system behaviour: a palette map changes what
  it maps, nothing else.

### Test B — canon Mochii cutout (mechanics check on canon art)

- Input: `canon-cutouts/mochii.png` (380×380 RGBA), composited onto
  white for the test (the tool's contract is white-field input) +
  `examples/mochii-lustre-palette-TESTONLY.json` (sky-blue
  `#53bef5` → violet `#9a6cf2`, tolerance 60; **illustrative palette,
  not a canon lustre map**).
- Output: `examples/mochii.lustre-mechanics-test.png` (+ report JSON).
- Measured: 55,476 pixels remapped; 3,714 protected; 66,000
  white-field skipped.
- Visual check: body shifts blue → violet cleanly; outline, eyes and
  smile untouched; belly wave linework survives as lighter violet
  (delta-shift preserves shading relationships, as designed).

## Known limits

- The palette tool is a per-pixel Python loop: fine for posters and
  previews (~18 s at 1920×1280), too slow as-is for frame-wise clip
  conversion — a clip pass wants a LUT/numpy build, flagged in
  STAGING.md as the follow-on before lustre clips ship.
- White-field input only, matching the avatar-stack twin route;
  alpha-native input is future work, not silently assumed.
