# SOURCE-FRESHNESS NOTE — Batch A rebase (2026-10-26)

**Standing rule (Mars, 2026-10-26 ~08:03 CDT, after a revert was caught):**
ALWAYS build from the MOST RECENT corrected/edited files — never from
superseded originals. Never assume locked = latest. Before EVERY future
batch, verify source freshness: check for `*_spotfree`, `*_clean2`,
corrected manifests, and ground-spot-removed cells, and record the base
version used here, per creature, so the next batch cannot silently revert.

**What went wrong originally:** Batch A was built from locked
`game-ready/*/cells/*_cell_XX.png` battle_front cells (builder docstring
said so) plus unclean hurt cells. Those carried white/ground spots that
corrected versions had already removed. Mars caught it on the Razorgater
+ Tyrage attack previews (~08:03 CDT).

**Rule for this directory:** old Batch A outputs are PRESERVED untouched
(`batch-a/<creature>/preview_*_4x.png` — the files Mars saw). Rebased
outputs live in NEW dirs (`batch-a/<creature>-rebased/`). No file already
shown to Mars was overwritten. No PR until Mars okays the rebuilt
previews (show-first). Corrected bases live in
`batch-a/corrected-bases/` (+ Sproutle's staged spotfree file).

## Per-creature base versions

### Razorgater — REBUILT (spot + ground blob removed)
- OLD: `game-ready/razorgater/cells/razorgater_cell_04.png` (battle_front,
  locked) + `animation/hurt/razorgater/razorgater_hurt_cell_00.png`
  (unclean — carried the 95px white hole between body and tail).
- NEW battle base: `batch-a/corrected-bases/razorgater_cell_04_groundblob_removed.png`
  — 191px removed total: 177px flat-grey ground blob (bbox x20–43,
  y48–59, values ~141/142) + 14px disconnected bottom arc (x22–31,
  y59–60). Feet, claws, steel cracks intact — rebased-vs-orig diff on
  attack cell_00 is 406px confined to y42–59 (ground zone only).
  Faint sub-threshold grey fragments remain (10–16px per attack cell;
  heavy cell_03 retains a 70px neutral-grey component from impact VFX /
  body shading, NOT a ground blob) — left intact, below Gate C cut rules.
- NEW hurt base: `animation/hurt/razorgater/razorgater_hurt_cell_00_clean.png`
  — the 95px pure-white component cut (bbox x33–52, y32–47),
  Mars-accepted ~20:10 CDT. Verified: clean-vs-unclean diff is exactly
  those 95px, set to transparent.
- Rebuilt: `batch-a/razorgater-rebased/` — 8 sets / 36 cells, previews
  `preview_attacks_4x.png` + `preview_hurts_4x.png`. Verified enlarged +
  native 64px: grey blob gone under the body in all attack cells;
  white hole gone in all hurt cells (hit-flash cell is white by design);
  cracks kept (diff confined below y42 on the check cell).

### Tyrage — REBUILT (leg-gap white patch removed)
- OLD: `game-ready/tyrage/cells/tyrage_cell_03.png` (locked).
- NEW battle base: `batch-a/corrected-bases/tyrage_cell_03_spotfree.png`
  — 47px white leg-gap component removed (bbox x26–40, y46–50),
  visually confirmed background (stark white rectangle between the
  legs). Tan belly, legs, claws intact; bottom teal streaks are part of
  the locked cell and were left untouched (not a white spot, not flagged).
- Hurt base UNCHANGED: `animation/hurt/tyrage/tyrage_hurt_cell_00.png`
  — verified clean (no white comps ≥3px; largest grey ground component
  2px).
- Rebuilt: `batch-a/tyrage-rebased/` — 8 sets / 36 cells. Verified
  enlarged + native: white leg-gap rectangle gone in ALL 22 attack
  cells (native check: 0/22 cells with any white component ≥20px).

### Sproutle — REBUILT from spotfree base (literal compliance, 1px lineage nuance)
- OLD: `game-ready/sproutle/cells/sproutle_cell_00.png` (locked).
- NEW battle base: `stage-show-sproutle-fix/sproutle_cell_00_spotfree.png`
  (PR #150 lineage, Mars-approved 2026-10-26 ~08:45 EDT).
- Lineage nuance, recorded honestly: the game-ready cell_00 ALREADY
  differed from the atlas cell_00 by 14px, all at y55–56 — i.e. the
  atlas between-feet spot (13px, x28–34, y55–56) does NOT exist in the
  game-ready lineage; game-ready vs spotfree differ by exactly 1px
  (x35, y56). So the Sproutle rebase is a base-lineage correction, not
  a visible spot removal: rebased-vs-orig diff is 1,180px total across
  26 cells, ALL confined to y41–57 (feet zone — LANCZOS resampling
  amplification of the 1px base difference through the 256px work
  canvas). No upper-body/head pixel changed.
- Hurt base UNCHANGED: `animation/hurt/sproutle/sproutle_hurt_cell_00_v2.png`
  (canonical v2; verified clean: no white ≥20px, 3px grey max).
- Rebuilt: `batch-a/sproutle-rebased/` — 8 sets / 36 cells. Verified
  enlarged: feet clean, body intact.

### Kittember — NO REBUILD (no white spot; soft shadow left intact)
- Base `kittember_cell_02.png` + hurt cell: no white component ≥20px.
- Present but NOT cut: soft gradient ground-shadow ellipse (166px grey
  component base, 93px hurt). It is a gradient shadow, not a flat spot;
  Mars did not flag Kittember; cutting a gradient risks the body.
  Left intact, documented here.

### Tiidebiite — NO REBUILD (clean)
- Base + hurt: white ≥20px = none, grey ground component = 0px.

### Aquariios — NO REBUILD (clean)
- Base + hurt: white ≥20px = none, grey ground component = 0px.

### Chromejaww — NO REBUILD (no background spot; greys are body shading)
- Base + hurt: no white background patch. Grey components (71px base,
  43px hurt) are chrome body shading, not a discrete ground blob.
  One 23px white component in the hurt cell (x25–32, y26–30) is a
  mid-body design accent, not a background patch — left intact.

### Reaperdile — NO REBUILD (no background spot)
- Base + hurt: no white patch. Grey components (87px base, 36px hurt)
  are steel body shading + small ground smudge, not a discrete flat
  spot — left intact.

### Mochii (pilot) — NO REBUILD (clean)
- Base + hurt (`mochii_cell_00.png`, `mochii_hurt_cell_00.png`):
  white ≥20px = none, grey ground component = 0px.

### Dreadtoise (pilot) — NO REBUILD (clean)
- Base + hurt: white ≥20px = none; grey fragments only (5px base,
  9px hurt) — negligible, no cut.

## Builders (this rebase)
- `batch-a/build_batch_a_rebased.py` — Razorgater + Tyrage, same
  transforms/VFX as the original builder, outputs to
  `*-rebased/` dirs, old previews untouched.
- `batch-a/build_sproutle_rebased.py` — Sproutle only, same pattern.
- Original builder `batch-a/build_batch_a.py` UNCHANGED.

## NOT gated by this fix (recorded, not decided here)
- Pose distinction (attack vs hurt reading as the same pose) is future
  polish, NOT a gate: Mars withdrew the 08:22 pilot-GIF rejection at
  08:23 CDT (GIFs approved as good once played). Rebuilt previews here
  are corrected-base versions of the same sets — not claimed as new
  poses. The 08:26 facial/hand articulation requirement (mouth, eyes,
  hands moving) is a separate standing requirement, handled by its own
  lane work (pilots first, then all batches), not by this rebase.
- No PR for the rebased sets until Mars okays the rebuilt previews.
