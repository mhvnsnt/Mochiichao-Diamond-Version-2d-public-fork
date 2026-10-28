# 51 — SHOW SFX LIBRARY (sound-category architecture)

Teardown List 6, item 51. Native spec for the Mochiichao show.
Consolidates what already exists — the layer model and spot list of
LIVING-WORLD.md §2.4, and the EP01 CUE-SHEET's source table — into
the show's standing SFX library: taxonomy, record format, sourcing
law. The library is *seeded* by EP01's spot list (§4); it is not a
new invention laid over it.

Licence law applies throughout (AGENTS.md): every sourced file is
classified at its source — open (licence named) / free proprietary /
free-but-restricted / paid — before it enters the library, and the
classification is recorded per file. CC0 ≠ "the pack was free":
licences are per-file and logged per file.

---

## 1. Teardown — how production SFX libraries are categorised

Documented practice (animation sound-design literature, incl. the
taxonomy LIVING-WORLD §1.4 already adopts from *Designing Sound for
Animation*): a working library is organised by **function in the
mix**, not by filename — ambience/backgrounds, foley (by location
and material), motion (ascend/descend, fast/slow), impacts,
animal/nature, vocal effects — and built **per show** from recorded
+ library sources, catalogued so any cue can be retrieved *and its
source documented*. The catalogue record, not the folder tree, is
the library: one row per sound, with source and licence, so the mix
stage never has to re-derive provenance.

## 2. Native taxonomy — three layers × category classes

Every library sound carries exactly one **layer** (how it sits in a
scene, per LIVING-WORLD §2.4's BED + FOLEY + SPOT model) and one
**class** (what it is):

| Layer | Meaning | ID prefix |
|---|---|---|
| BED | continuous location×time atmosphere (a SCORE/WIND sibling) | `BED-[LOC]-[TIME]` |
| FOLEY | performed, synced to visible action/material | `SFX-…` (class FOLEY) |
| SPOT | discrete story events, incl. smear peaks (#49 HR5) | `SFX-…` (class SPOT) |

| Class | Contents | Notes |
|---|---|---|
| AMB | bed constituents, weather, room tone | Forest bed = engineered absence (canon) |
| SURFACE | footsteps by material (path/grass/wood/…) | per-character weight edits are variants, not new sounds |
| MECHANISM | gates, latches, bells, hinges | the Garden's technology speaks in this class |
| NATURE | water, leaves, wind gusts, splashes | gain keyed to WIND-STATE where LIVING-WORLD says so |
| CREATURE | non-cry creature sound: rustles, run-throughs, breath | cries themselves are NOT in this library — they are species data (cry synth / repo cries) |
| MOTION | whooshes, ascends/descends, smear peaks | #49's device peaks spot from here |
| SIGNATURE | designed sounds that *are* the show: cold-spot shimmer class | Takeover-class (LIGHTING TK-2 analogue): made, never found |
| UI-CARD | subtitle-card and device sounds (Mochiioteca) | sparse by law (subtitle rationing) |

## 3. Library record format (one row per sound)

```
id            SFX-[NAME]-## / BED-[LOC]-[TIME]  (stable; LIVING-WORLD grammar)
layer         BED | FOLEY | SPOT
class         per §2
status        CANON (approved take) | CANDIDATE | GAP (sourced route known, no take yet) | DERIVED
source_kind   recorded | synthesised | library | derived_from_repo
source_ref    file/URL + licence (named) + date checked — mandatory unless status=GAP
derives_from  for DERIVED rows (e.g. SFX-CRY-DIST from repo cry files)
used_in       [episode/cut refs] — grows; first use is the row's birth
gate          loudness/peak notes at mix (beds finish −14 LUFS per PIPELINE)
```

**Status law:** a GAP row is closed only by an *approved take*
becoming CANON. Sourcing a candidate file does not close a gap;
the owner's/production's approved take does (this is the exact
sense in which EP01's two cue-sheet GAPs stand: routes are decided,
takes are production work).

## 4. Seed catalogue — EP01's spot list, as library rows

From LIVING-WORLD §2.4 (the 13-item EP01 spot list) + §2.4 beds.
Status reflects the documents, not new claims:

| ID | Class | Status | Route / note |
|---|---|---|---|
| SFX-GATE-SHUT-01 | MECHANISM | GAP | CC0 door/latch + sweeten (route set) |
| SFX-GATE-CREAK-01 | MECHANISM | GAP | CC0, 3 lengths, pitch-matched family |
| SFX-STEP-PATH-01 | SURFACE | GAP | CC0 set + per-character weight edit |
| SFX-STEP-GRASS-01 | SURFACE | GAP | CC0 |
| SFX-STEP-WOOD-01 | SURFACE | GAP | CC0 |
| SFX-RUNTHROUGH-01 | CREATURE | GAP | built: steps × rustle, panned with picture |
| SFX-RUSTLE-GUST-01 | NATURE | GAP | CC0, WIND-STATE gain |
| SFX-RUSTLE-BUSH-01 | NATURE | GAP | CC0 + hand foley if needed |
| SFX-SPLASH-01 | NATURE | GAP | CC0 big splash + droplet tail (cut 14) |
| SFX-BERRY-01 | NATURE | GAP | CC0 soft plops (already in locked script) |
| SFX-DUCK-01 | SIGNATURE-lite | GAP | one signature squeak; CC0 or synthesis; keep consistent forever once CANON |
| SFX-BELL-01 | MECHANISM | GAP → route decided | **closes CUE-SHEET GAP:** foley/record or CC0 bell; single approved take becomes canon |
| SFX-COLDSPOT-01 | SIGNATURE | GAP → route decided | **closes CUE-SHEET GAP:** synthesise (reversed bell partials + air); Takeover-class; must not resemble any natural source |
| SFX-CRY-DIST-01… | CREATURE | DERIVED | repo cry files, pitch/time-varied, low-passed — never newly recorded |
| BED-GATE-MORNING etc. | AMB | CANON-class | beds already built + gated for EP01 scenes (see gate.json set) |

Plus the cue sheet's music rows are **not** SFX-library rows (title
theme + stems belong to the score system, List 2 #13) — the library
links them by episode ref only.

## 5. Sourcing routes (already indexed in-repo; adopted, not re-derived)

Per LIVING-WORLD §2.4 / UNIFIED-PIPELINE §5: Freesound filtered to
CC0 (per-file licence check + log), Kenney packs (CC0), Sonniss GDC
bundles (royalty-free, no attribution), Pixabay SFX (Pixabay Content
Licence — free proprietary class, logged as such), TRIPPEDD
OpenGameArt index, in-repo derived cries, and record/synthesise for
anything recognisable as the show. **Free-but-restricted sources
(any NC term) are scratch-only and may not enter CANON rows.**

## 6. Wiring points

- CUE-SHEET per episode cites library IDs (it already cites the two
  GAPs by description; at landing they resolve to SFX-BELL-01 /
  SFX-COLDSPOT-01 rows).
- Xsheet audio column (TIMING-SYSTEM) spots by ID; #49 smear peaks
  spot MOTION class by ID.
- Build-manifest `sfx_spots` field (LIVING-WORLD Part 4) validates
  against this catalogue: an episode cannot ship a spot ID the
  library doesn't hold as CANON or GAP-with-route.

## 7. Coverage notes

Taxonomy follows published animation-sound practice already adopted
by LIVING-WORLD — high confidence, and deliberately continuous with
it. The seed catalogue is a faithful transcription of §2.4's list
into record form; **no takes were sourced, recorded, or approved by
this teardown**, so GAP statuses are honest: routes decided, sounds
not yet in hand. Duck's "SIGNATURE-lite" tag is this spec's coinage
for script-locked consistency sounds.
