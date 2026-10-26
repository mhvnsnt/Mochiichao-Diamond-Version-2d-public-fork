# NEEDS-MARS-EYES — staged confirmation list, walk frames lane
## Standing rule applied (Mars, 2026-10-25 ~20:41 CDT)
Anything needing Mars's confirmation is SHOWN to him first (actual image/file via the parent) before deciding, and confirmation items NEVER block other work. Everything below is STAGED, not decided. The worker's "provisional view" is not a decision — if Mars disagrees, only that single set gets a v2; the rest of the batch keeps moving, including the game-wiring PR batch.
## Done items (separate from this list — NOT awaiting confirmation)
Walk frames 51/51 = 100%, all staged under `sprite-art/walk-frames/<creature>/` with `<creature>.walk.json` manifests, all eye-checked enlarged + 64px by the worker. Done ≠ Mars-approved where an item below applies: the sets below are staged as-is AND flagged here, so Mars sees them before they are treated as final.
## How to read each item
- **Files**: the actual staged cells. **Preview**: the montage to show Mars (row order: down_0, down_1, up_0, up_1, left_0, left_1, right_0, right_1, unless noted). Magenta = transparent.
- **Question for Mars**: the exact call he is making. **If Mars says no**: the single-set fix, which does not block anything else.

---

## A — Look / identity calls

### A1. Strikechamp_unsuited #030 up — helmeted v2 vs bald v1 (worker provisionally picked v2)
- **Judgment call**: the first up sheet came out bald with a gold circlet; the locked regular look wears a red helmet with a gold centre stripe. The worker cut v2 (helmeted) and left v1 uncut — but the pick is Mars's, not the worker's.
- **Files (staged v2, cut)**: [strikechamp_unsuited_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_up_0.png), [strikechamp_unsuited_walk_up_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/strikechamp_unsuited/strikechamp_unsuited_walk_up_1.png)
- **Files (rejected v1 sheet, NOT cut)**: [media-generation-strikechamp-walk-up-v1-0-70d3eeb9-2a44-4cc9-a5b0-846d376a4be0.webp](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/strikechamp_unsuited/media-generation-strikechamp-walk-up-v1-0-70d3eeb9-2a44-4cc9-a5b0-846d376a4be0.webp)
- **Preview (show both)**: v1 sheet [strikechamp_unsuited_raw_preview_b.png](sandbox://workspace/walk-verify/strikechamp_unsuited_raw_preview_b.png) vs v2 sheet [strikechamp_v2_preview.png](sandbox://workspace/walk-verify/strikechamp_v2_preview.png) vs v2 cut cells [strikechamp_unsuited_enlarged.png](sandbox://workspace/walk-verify/strikechamp_unsuited_enlarged.png)
- **Reference (locked regular look)**: [strikechamp_unsuited_cell_04.png](sandbox://workspace/walk-verify/strikechamp_ref_back.png) (back view, red helmet + gold stripe)
- **Question for Mars**: is the helmeted v2 the right regular up set, and should the bald v1 stay unused?
- **Provisional view (not a decision)**: v2 matches the locked reference; v1 does not.
- **If Mars says no**: cut or regenerate the up pair to his pick; down/side coverage is untouched game-ready cells.

### A2. Megalochrome #023 down/up — round sparkle eyes vs locked blue-ringed concentric eyes
- **Judgment call**: the new down/up cells have big round sparkle eyes, same as the already-accepted icon drift; the locked cell's eyes are blue-ringed concentric. Shape, fins, and toothy grin match.
- **Files**: [megalochrome_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/megalochrome/megalochrome_walk_down_0.png), [megalochrome_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/megalochrome/megalochrome_walk_down_1.png), [megalochrome_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/megalochrome/megalochrome_walk_up_0.png), [megalochrome_walk_up_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/megalochrome/megalochrome_walk_up_1.png)
- **Preview**: [megalochrome_enlarged.png](sandbox://workspace/walk-verify/megalochrome_enlarged.png), [megalochrome_64px.png](sandbox://workspace/walk-verify/megalochrome_64px.png)
- **Question for Mars**: keep the sparkle eyes (consistent with the icon), or order a v2 re-matching the locked blue-ringed eyes?
- **Provisional view (not a decision)**: keep for now for icon consistency; v2 is a small eye-only fix.
- **If Mars says no**: eye-only v2 of these 4 cells; nothing else changes.

### A3. Oblivirex #009 up — feet clipped flat at the sheet gridline
- **Judgment call**: the generator drew the back-view panels overlapping the sheet's quarter gridline, so the up feet are cut flat at the bottom edge (claws below the line belong to the next row's panels and cannot be recovered cleanly). The set is otherwise complete and readable.
- **Files**: [oblivirex_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/oblivirex/oblivirex_walk_up_0.png), [oblivirex_walk_up_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/oblivirex/oblivirex_walk_up_1.png)
- **Preview**: [oblivirex_enlarged.png](sandbox://workspace/walk-verify/oblivirex_enlarged.png) (look at the bottom edge of the 3rd/4th cells), [oblivirex_up0_quarter.png](sandbox://workspace/walk-verify/oblivirex_up0_quarter.png) (the raw quarter showing the cut), [oblivirex_64px.png](sandbox://workspace/walk-verify/oblivirex_64px.png)
- **Question for Mars**: ship the up pair with flat-cut feet, or regenerate the up pair?
- **Provisional view (not a decision)**: readable at 64px; the clip is minor.
- **If Mars says no**: regenerate up pair only (2 cells).

### A4. Quakehound down_0 — white block artifact between the front legs
- **Judgment call**: a white block sits between the legs on down_0, visible enlarged and at 64px. It is not part of the creature design.
- **Files**: [quakehound_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/quakehound/quakehound_walk_down_0.png)
- **Preview**: [quakehound_enlarged.png](sandbox://workspace/walk-verify/quakehound_enlarged.png) (1st cell), [quakehound_64px.png](sandbox://workspace/walk-verify/quakehound_64px.png)
- **Question for Mars**: clean this one cell, or ship it as-is?
- **Provisional view (not a decision)**: single-cell cleanup, scripted only (no hand-tooling).
- **If Mars says no**: clean down_0 only; the other 7 cells are unaffected.

### A5. Ashemit #044 — locked manifest direction labels are swapped (confirm the correction)
- **Judgment call**: the locked manifest labels cell_02 as overworld_back and cell_04 as overworld_side, but eye-check shows the opposite: cell_02 is a right-facing side profile and cell_04 is the true back view. The staged set uses the eye-checked mapping, not the manifest labels (pixel-verified: up_0 == cell_04, left_0 == mirror of cell_02).
- **Files**: [ashemit_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/ashemit/ashemit_walk_down_0.png), [ashemit_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/ashemit/ashemit_walk_up_0.png), [ashemit_walk_left_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/ashemit/ashemit_walk_left_0.png), [ashemit_walk_right_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/ashemit/ashemit_walk_right_0.png) (+ phase-1 twins)
- **Preview**: [ashemit_enlarged_fixed2.png](sandbox://workspace/walk-verify/ashemit_enlarged_fixed2.png) (row 1: front, front, back, back; row 2: left profile, left, right profile, right), [ashemit_64px_fixed2.png](sandbox://workspace/walk-verify/ashemit_64px_fixed2.png); source cells [ashemit_cell_02.png](sandbox://workspace/walk-verify/ashemit_ashemit_cell_02.png) (right-facing side) vs [ashemit_cell_04.png](sandbox://workspace/walk-verify/ashemit_ashemit_cell_04.png) (true back)
- **Question for Mars**: confirm the eye-checked mapping (and the lock-label correction to record), or direct a different mapping?
- **Provisional view (not a decision)**: the eye-checked mapping is correct; the manifest labels are the error.
- **If Mars says no**: remap the 8 cells to his directions; no new art needed.

### A6. Wispkin #042 — sides are tilt variants of the front cell (no true profile exists)
- **Judgment call**: the locked V1 set has no side cell, so left/right are the front cell tilted ±6° with a hover bob. Direction reads by lean, not by a new profile drawing (same precedent as Mochii's blob sides). V1 likeness only; V2/V3 trait sheets were not used.
- **Files**: [wispkin_walk_left_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/wispkin/wispkin_walk_left_0.png), [wispkin_walk_right_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/wispkin/wispkin_walk_right_0.png) (+ all 8 cells in dir)
- **Preview**: [wispkin_enlarged.png](sandbox://workspace/walk-verify/wispkin_enlarged.png), [wispkin_64px.png](sandbox://workspace/walk-verify/wispkin_64px.png)
- **Question for Mars**: are tilt-read sides acceptable for a hovering mask creature, or should sides be newly drawn?
- **Provisional view (not a decision)**: acceptable for a hover-bob treatment; new profiles would be new art, not a derivation.
- **If Mars says no**: generate true side profiles (2 directions × 2 phases); down/up bob cells stand.

### A7. Cocoonode #017 — sides reuse the front cell (faceless by design)
- **Judgment call**: the crystal is faceless, so front vs back vs sides cannot be distinguished by eye; the staged sides reuse the front cell (front star-centre vs back plain-diamond-centre ARE distinguishable, and are kept distinct). This is documented, not hidden.
- **Files**: [cocoonode_walk_left_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/cocoonode/cocoonode_walk_left_0.png), [cocoonode_walk_right_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/cocoonode/cocoonode_walk_right_0.png) (+ all 8 cells in dir)
- **Preview**: [cocoonode_enlarged.png](sandbox://workspace/walk-verify/cocoonode_enlarged.png), [cocoonode_64px.png](sandbox://workspace/walk-verify/cocoonode_64px.png)
- **Question for Mars**: is front-reuse for the sides fine for a faceless crystal, or should sides get distinct rotations?
- **Provisional view (not a decision)**: fine — it matches the locked set's own indistinguishability.
- **If Mars says no**: rotate/derive distinct side cells; down/up pulse cells stand.

### A8. Shellguard #039 — pre-existing 8-cell set adopted (not built by this worker)
- **Judgment call**: a previous builder's full 8-cell set was found on disk (raw sheet 647dd052, eye_check recorded) and this worker verified it enlarged + 64px rather than rebuilding the walk-up-only scope. The set is pixel-art style, matching the locked cells, with alternating leg phases in all 4 directions.
- **Files**: all 8 cells in [shellguard/](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/shellguard)
- **Preview**: [shellguard_enlarged_existing.png](sandbox://workspace/walk-verify/shellguard_enlarged_existing.png), [shellguard_64px_existing.png](sandbox://workspace/walk-verify/shellguard_64px_existing.png)
- **Question for Mars**: confirm this adopted set as Shellguard's walk set?
- **Provisional view (not a decision)**: verified good; adoption avoids duplicate work.
- **If Mars says no**: the spare up-only sheet generated this session ([media-generation-shellguard-walk-up-v1-0-13a0d3d4-8099-4ede-8c7c-8061f1174b02.webp](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/shellguard/media-generation-shellguard-walk-up-v1-0-13a0d3d4-8099-4ede-8c7c-8061f1174b02.webp)) can be cut instead, or the set regenerated.

---

## B — Shadow calls (shadows-separate rule: Pokemon adds shadows separately, NOT baked into character art)
**Question for Mars (all four)**: strip the baked shadows from these staged cells (scripted cleanup, engine adds shadows as its own layer), or keep them as-is?
**If Mars says strip**: scripted strip pass on the listed cells only; nothing else changes. **If Mars says keep**: the cells ship as-is. Either way, no other work waits on this.

### B1. Kittember — ground shadow ellipse in all 8 cells
- **Files**: all 8 cells in [kittember/](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/kittember)
- **Preview**: [kittember_enlarged.png](sandbox://workspace/walk-verify/kittember_enlarged.png), [kittember_64px.png](sandbox://workspace/walk-verify/kittember_64px.png)

### B2. Razorgater — ground shadow on the down frames
- **Files**: [razorgater_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/razorgater/razorgater_walk_down_0.png), [razorgater_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/razorgater/razorgater_walk_down_1.png)
- **Preview**: [razorgater_enlarged.png](sandbox://workspace/walk-verify/razorgater_enlarged.png), [razorgater_64px.png](sandbox://workspace/walk-verify/razorgater_64px.png)

### B3. Mochii — faint baked shadow
- **Files**: all 8 cells in [mochii/](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/mochii)
- **Preview**: [mochii_enlarged.png](sandbox://workspace/walk-verify/mochii_enlarged.png), [mochii_64px.png](sandbox://workspace/walk-verify/mochii_64px.png)

### B4. Pebblefist — faint shadow line remnant under the down feet (main ellipses already stripped)
- **Files**: [pebblefist_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pebblefist/pebblefist_walk_down_0.png), [pebblefist_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pebblefist/pebblefist_walk_down_1.png)
- **Preview**: [pebblefist_enlarged2.png](sandbox://workspace/walk-verify/pebblefist_enlarged2.png), [pebblefist_64px2.png](sandbox://workspace/walk-verify/pebblefist_64px2.png)

---

## C — Subtle-cycle / drift calls (sets count as walk; Mars decides if a stronger v2 is wanted)
**Standing note**: none of these block anything. A "yes, v2" answer means one set gets stronger phases; a "ship it" answer means the set stands as-is. No batch waits on these.

### C1. Down pairs read subtle (leg/foot shift only, not a wide stride)
- **Sets + files**: Dorowani ([dorowani_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/dorowani/dorowani_walk_down_0.png), [dorowani_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/dorowani/dorowani_walk_down_1.png)), Kickmaster ([kickmaster_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/kickmaster/kickmaster_walk_down_0.png), [kickmaster_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/kickmaster/kickmaster_walk_down_1.png)), Terradog ([terradog_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/terradog/terradog_walk_down_0.png), [terradog_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/terradog/terradog_walk_down_1.png)), Terrapod ([terrapod_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/terrapod/terrapod_walk_down_0.png), [terrapod_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/terrapod/terrapod_walk_down_1.png)), Manticlaw ([manticlaw_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/manticlaw/manticlaw_walk_down_0.png), [manticlaw_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/manticlaw/manticlaw_walk_down_1.png))
- **Previews**: [dorowani_enlarged.png](sandbox://workspace/walk-verify/dorowani_enlarged.png), [kickmaster_enlarged.png](sandbox://workspace/walk-verify/kickmaster_enlarged.png), [terradog_enlarged.png](sandbox://workspace/walk-verify/terradog_enlarged.png), [terrapod_enlarged.png](sandbox://workspace/walk-verify/terrapod_enlarged.png), [manticlaw_enlarged.png](sandbox://workspace/walk-verify/manticlaw_enlarged.png) (+ matching `_64px.png` files)
- **Question for Mars**: ship the subtle down cycles, or order wider-stride down v2s (per set — he can pick individual sets)?

### C2. Front/back phase pairs near-identical (minor fist/foot shifts only)
- **Sets + files**: Punchkid ([punchkid_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/punchkid/punchkid_walk_down_0.png), [punchkid_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/punchkid/punchkid_walk_down_1.png), [punchkid_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/punchkid/punchkid_walk_up_0.png), [punchkid_walk_up_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/punchkid/punchkid_walk_up_1.png)), Pyropaw ([pyropaw_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pyropaw/pyropaw_walk_down_0.png), [pyropaw_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pyropaw/pyropaw_walk_down_1.png), [pyropaw_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pyropaw/pyropaw_walk_up_0.png), [pyropaw_walk_up_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pyropaw/pyropaw_walk_up_1.png)) — side phases in both sets alternate clearly; only front/back phases are subtle.
- **Previews**: [punchkid_enlarged.png](sandbox://workspace/walk-verify/punchkid_enlarged.png), [pyropaw_enlarged.png](sandbox://workspace/walk-verify/pyropaw_enlarged.png) (+ matching `_64px.png` files)
- **Question for Mars**: ship, or order re-posed front/back phase-2 frames for either set?

### C3. Gearkid — gear colour flips grey (down_0, up) vs gold (down_1, sides) across frames
- **Files**: all 8 cells in [gearkid/](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/gearkid)
- **Preview**: [gearkid_enlarged.png](sandbox://workspace/walk-verify/gearkid_enlarged.png), [gearkid_64px.png](sandbox://workspace/walk-verify/gearkid_64px.png)
- **Question for Mars**: pick one gear colour (grey or gold) for a recolour v2, or ship the flip?
- **If Mars picks a colour**: scripted recolour pass on the affected cells only.

### C4. Duneclaw — down_0 has large dark claw blades, down_1 has plain legs
- **Files**: [duneclaw_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/duneclaw/duneclaw_walk_down_0.png), [duneclaw_walk_down_1.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/duneclaw/duneclaw_walk_down_1.png)
- **Preview**: [duneclaw_enlarged.png](sandbox://workspace/walk-verify/duneclaw_enlarged.png), [duneclaw_64px.png](sandbox://workspace/walk-verify/duneclaw_64px.png)
- **Question for Mars**: claws on both down phases, plain legs on both, or ship the mismatch?
- **If Mars picks**: single-direction v2 (down pair only).

### C5. Pixilite — down/up indistinguishable (faceless by design, canon note)
- **Files**: [pixilite_walk_down_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pixilite/pixilite_walk_down_0.png), [pixilite_walk_up_0.png](sandbox://workspace/mochiichao-work/sprite-art/walk-frames/pixilite/pixilite_walk_up_0.png) (+ all 8 cells in dir)
- **Preview**: [pixilite_enlarged.png](sandbox://workspace/walk-verify/pixilite_enlarged.png), [pixilite_64px.png](sandbox://workspace/walk-verify/pixilite_64px.png)
- **Question for Mars**: confirm faceless down/up indistinguishability is fine (canon: the locked manifest judges Pixilite faceless by design), or direct a distinguishing mark?
- **Provisional view (not a decision)**: fine as canon; a distinguishing mark would change the design.
- **If Mars says no**: design decision needed from him first — nothing is built on a guess.

---

## Non-blocking statement
No item above blocks: the walk lane is 51/51 = 100% staged; the game-wiring PR batch, other lanes, and any other building proceed on the staged cells. Each confirmation resolves to at most a single-set v2 (or a scripted strip/recolour pass) when Mars answers. Nothing in this list was decided by the worker — every "provisional view" above is explicitly non-deciding, pending Mars's eyes on the linked preview.
## Method compliance (standing rule tooling)
All staged work used scripted generation/cleanup only (media generation + scipy/PIL scripts, Pokemon decomp reference cells as likeness grounds). No hand-tooling (no manual pixel edits) was used anywhere in this batch.
