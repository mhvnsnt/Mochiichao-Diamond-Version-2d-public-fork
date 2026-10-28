# STAGING — Rig + Mouth-System Teardowns

Staging law (owner, 2026-10-27): GitHub repos for everything that
fits; **TeraBox** for anything too big; local disk is a workbench,
not a warehouse. Studio production files are **pointers only**
(gray-case rule) — never copied into the repo or TeraBox by this
package; their canonical home stays Blender Studio / download
.blender.org under CC BY, and the manifest below is the record.

## A. Repo staging (all files in this package)

Target repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`
(show lives inside the game repo). Proposed paths — alongside the
existing rig layer, following the SHOW-HOME layout:

| File (this package) | Proposed repo path |
|---|---|
| `RIG-TEARDOWN.md` | `show/production/rigs/RIG-TEARDOWN-open-movies.md` |
| `templates/biped-rig-spec.md` | `show/production/rigs/templates/biped-rig-spec.md` |
| `templates/biped.rig.json` | `show/production/rigs/templates/biped.rig.json` |
| `templates/quadruped-rig-spec.md` | `show/production/rigs/templates/quadruped-rig-spec.md` |
| `templates/quadruped.rig.json` | `show/production/rigs/templates/quadruped.rig.json` |
| `MOUTH-DATA-FORMAT.md` | `show/production/tooling/mouth-data/MOUTH-DATA-FORMAT.md` |
| `rhubarb_to_mouthdata.py` | `show/production/tooling/mouth-data/rhubarb_to_mouthdata.py` |
| `examples/sample-rhubarb.json` (+ `.tsv`, `-pb.dat`) | `show/production/tooling/mouth-data/examples/` (keep the synthesized-sample labelling intact) |
| `examples/sample.mouth.json` (+ tsv/dat outputs) | `show/production/tooling/mouth-data/examples/` |
| `examples/README.md` | `show/production/tooling/mouth-data/examples/README.md` |
| `STAGING.md` | stays with the teardown package record: `show/production/rigs/RIG-TEARDOWN-STAGING.md` |

Cross-references to add when staged (one line each, side-lane PR):
- `show/production/rigs/README.md` — link the teardown + templates
  as the rig system's source and body-plan starting points.
- `show/production/tooling/TOOLING-INDEX.md` — register
  `mochiichao-mouth-data/v1` + converter under lip-sync (humans).
- `show/production/tooling/MATERIALS-INDEX.md` — the Blair system
  row already points at the playbook; add this format as its
  machine-readable form.

Reference-only (no staging — already in their home repos):
`mhvnsnt/Bannon → docs/UNIVERSAL-RIG-STANDARD.md`,
`docs/RIG_PIPELINE_STATUS.md`; `mhvnsnt/animation-techniques-archive
→ ANIMATION-PLAYBOOK.md`, `character-pipeline/03-rig-spec/`,
`04-viseme-pack/`, `cn-gigaleak/study-notes/fla-rig-conventions.md`.

## B. TeraBox pointer manifest — big open-movie files

Target TeraBox folder: `Mochiichao-Staging/open-movies-production/`
**Nothing in this table has been downloaded or uploaded by this
sideline.** This is the pointer record: if/when the owner stages
these, they land in that folder once, hashed, and are rationed into
repos only as small derived specs (never the .blend packs
themselves). Sizes are the sources' own published estimates
(animation-research-library TERABOX-LIST.md, 2026-10-14) — marked
"check" where the source itself says unverified.

| Item | Licence | Size | Canonical source | Notes |
|---|---|---|---|---|
| Spring — full production files (.blend, incl. Autumn + shepherdess rigs) | CC BY 4.0 | tens of GB (pack) | studio.blender.org/films/spring/ (production files) | Download needs Blender Studio subscription/login. Credit: © Blender Foundation \| studio.blender.org |
| Sprite Fright — full production files (.blend, full cast rigs) | CC BY 4.0 | tens of GB (pack) | studio.blender.org/films/sprite-fright/ (production files) | Same access note. |
| Spring — demo/scene files (subset via Blender demo files) | CC BY / CC0 per file | varies | blender.org/download/demo-files/ | Free subset; check per-file licence on staging |
| Sprite Fright — storyboards + production logs | CC BY 4.0 | small (web) | studio.blender.org/films/sprite-fright/ → Production logs | Repo-class if ever pulled (docs/images) |
| Big Buck Bunny — full production files | CC BY 3.0 | several GB | download.blender.org/peach/ | Free download; older-generation rigs (pre-BlenRig/CloudRig) — reference only |
| Sintel — production files | CC BY 3.0 | several GB | download.blender.org/durian/ | Same note |
| Tears of Steel — production files | CC BY 3.0 | several GB | download.blender.org/mango/ | Same note |
| Elephants Dream — production files | CC BY 2.5 | several GB | download.blender.org/ED/ | Same note |
| Rain rig (Blender Studio character, CloudRig-era) | CC BY 4.0 | rig-scale | studio.blender.org/characters/rain/ | Listed "free" in PRODUCTION-FILES.md; candidate first pull if a single reference rig is wanted |

Already in-repo (not TeraBox): the *films* themselves —
`animation-research-library/films/spring_blenderopenmovie.mp4`
(48 MB) and `films/sprite-fright-2021.mp4` (61 MB), CC BY 4.0,
SHA-256 recorded in that repo's CATALOG.md / catalog.json.

## C. Explicitly NOT staged anywhere

- No studio .blend/.ma production file was copied, converted, or
  re-hosted by this package — the teardown transfers construction
  *systems* only (owner's construction-kit + gray-case rules).
- The synthesized example WAV was disposable scratch (`/tmp`) and
  was not kept.
