# PULL-IN LIST — industry-method construction kit

**What this is:** every document, technique file, and system to pull
from Jamar's archive into the Mochiichao repo as construction kit for
the corrected animation method (see `WHAT-WE-DO-WRONG.md` and
`CORRECTED-METHOD.md`). **List only** — the actual landing happens in
a later pass (stage 2 of the programme). Nothing here has been copied
yet by this pass.

**Licence buckets** (honesty law — verified at source where the source
states one):
- **OWNER** — Jamar's own infrastructure/research. Direct carry-over.
- **CC-BY** — openly licensed, attribution required, legal to use.
- **PD/CC-mixed** — public-domain / Creative-Commons library; verify
  per item in its catalog before any public use.
- **NONE-PRIVATE-STUDY** — NONE, all rights reserved, private study
  only. Studio material. **Conventions and techniques are studied and
  rewritten natively; the files themselves are never copied into show
  material, never shipped, never re-hosted as content.** Reference
  copies stage to the TeraBox private-study shelf, not into the
  show's working folders.

**Staging rule** (staging law): text/code that is OWNER or CC-BY and
small → the Mochiichao repo (destinations named per item). Big
binaries and ALL NONE-PRIVATE-STUDY reference files → TeraBox. Only
the natively-written extraction ever lands in the repo from a
NONE-PRIVATE-STUDY source.

---

## A. The method core — OWNER (direct carry-over)

| # | Item | Source | What it is | Lands in |
|---|---|---|---|---|
| A1 | `ANIMATION-PLAYBOOK.md` (36 KB) | `animation-techniques-archive/` | The technique bible: Preston Blair mouth system, smear frames, walk-cycle standard, holds/moving holds, limited-animation tricks, X-sheets, 12 principles, clean-up pipeline, timing charts. Already prescribes most of the corrected method — the gag failure was building without it | `docs/show/ANIMATION-PLAYBOOK.md` |
| A2 | `PIPELINE-CHECKLIST.md` | `animation-techniques-archive/` | The 9-step per-shot process (model sheet → X-sheet → keys → in-betweens → principles → lip-sync → clean-up → likeness → QC), incl. the masking/compositing rules | `docs/show/PIPELINE-CHECKLIST.md` |
| A3 | `templates/character-model-sheet-template.md` | `animation-techniques-archive/templates/` | The model-sheet template (turnaround, expressions, mouth chart, hands, colour model, scale, likeness checklist) — becomes the hard pre-rig gate | `docs/show/templates/` |
| A4 | `3D-CROSSOVER.md` | `animation-techniques-archive/` | How the 2D principles map to 3D lanes (for rendered segments; keeps one method across lanes) | `docs/show/` |
| A5 | `tools/` — `TOOLKIT.md`, `qc-gates.py`, `likeness-check.py`, `lipsync-timing.py`, `masking-quickstart.md`, `ebsynth-guide.md` | `animation-techniques-archive/tools/` | The QC/likeness/lip-sync tooling the checklist calls; masking quickstart is the part-separation compositing reference | `tools/show-pipeline/` |
| A6 | `research/QC-CHECKLIST.md`, `research/CLEAN-CUTS-TOOLKIT.md`, `research/SOURCES.md` | `animation-techniques-archive/research/` | QC checklist + clean-cuts/masking toolkit (the seam/gap defect class) + the research source register | `docs/show/research/` |
| A7 | (study only, optional) `research/ANTI-SLOP-DEEP.md`, `research/KILLING-SLOP.md` | `animation-techniques-archive/research/` | Long-form anti-slop research behind the playbook's §9 | reference shelf; extract into A1's notes if wanted |

## B. The limited-animation economics & pipeline — OWNER (his research docs)

| # | Item | Source | What it is | Lands in |
|---|---|---|---|---|
| B1 | `docs/research/HB-LIMITED-ANIMATION.md` | `mystery-coast-ghosted/` | The cel-level method + economics: on 2s/3s, level separation, collar/seam design rule, stock cycles, metronome timing, pose quality doctrine — the historical proof of the corrected method | `docs/show/research/` |
| B2 | `docs/research/PIPELINE.md` | `mystery-coast-ghosted/` | The complete dialogue-first open-source pipeline: Tahoma2D cutout rigs + mouth-switch, Xsheet on 2s/3s, **selective-smoothing-only** rule, animatic lock | `docs/show/` (production method) |
| B3 | `docs/research/SCOOBY-DOO-1969-PIPELINE.md` | `mystery-coast-ghosted/` | A network limited-animation production dissected end-to-end (formula + production method) | `docs/show/research/` |
| B4 | `docs/research/TOOLING-2026.md` | `mystery-coast-ghosted/` | The 2026 open-source tooling survey backing B2's choices | `docs/show/research/` |
| B5 | `ANIMATION-REFERENCE.md`, `docs/research/README.md` | `mystery-coast-ghosted/` | The research index + animation reference notes tying B1–B4 together | `docs/show/research/` |

## C. Pipeline machinery & proof discipline — OWNER

| # | Item | Source | What it is | Lands in |
|---|---|---|---|---|
| C1 | `PIPELINE.md` + `post/proof.py` pattern + `shots/` spec format | `TRIPPEDD-Animation-Studio/` | Shot-spec → render → post → **proof** architecture: reopen, ffprobe, SHA-256, check frames, `visual_qc` QC_PENDING until a human looks. The model for our drawn-space gate tooling | `tools/show-pipeline/` (design + adapted code) |
| C2 | `docs/COMPLETE-PIPELINE.md`, `docs/STUDIO-ARCHITECTURE.md` | `cape-jones/` | A second worked pipeline architecture + studio layout, for cross-checking C1's design | `docs/show/research/` |
| C3 | `docs/ANIM-GATE.md` | `cape-jones/` | **Cite correctly:** a clip-*context* gate (which clips may play in fight vs show contexts), NOT a visual QC gate. Pull so the record stops misciting it; the visual gates are A2 + C1 | `docs/show/research/` (with the correction note) |

## D. Open production reference — CC-BY / PD-CC-mixed

| # | Item | Source | What it is | Bucket | Lands in |
|---|---|---|---|---|---|
| D1 | Big Buck Bunny production tree (422 files, ~1.08 GB; chars/envs/sets/props/scenes/scripts) | `disney-tva-bbb-pulls/` release asset v1.0.0 | A complete real production tree: character rig files with IK/FK + Python constraint scripts (incl. foot-roll), 137 shot files — the folder/rig discipline template | **CC-BY** (attribution: Blender Foundation / Peach) | TeraBox (size); its *layout conventions* extracted into `docs/show/` |
| D2 | `BBB-PRODUCTION-CATALOG.md`, `DISNEY-TVA-CATALOG.md`, `ANIMATION-REFERENCE.md`, `BLENDER-OPEN-MOVIES-README.md` | `disney-tva-bbb-pulls/` | The catalogs of D1 + the pitch/show-bible architecture survey (bible *structure* standard) | OWNER (the catalogs) | `docs/show/research/` |
| D3 | `TECHNIQUES.md`, `CATALOG.md`, `PRODUCTION-FILES.md`, `WORKFLOW.md` + `films/` (~30 shorts) | `animation-research-library/` | Frame-steppable motion reference: ones-vs-twos, hold-then-snap timing, smears, squash & stretch, limited animation, rotoscope — with a per-film licence catalog | **PD/CC-mixed** — check `CATALOG.md` per film before any public use | Docs → `docs/show/research/`; films → TeraBox |

## E. Studio production documents — NONE-PRIVATE-STUDY (study the conventions; extract natively; files to TeraBox reference shelf only)

| # | Item | Source | What it is |
|---|---|---|---|
| E1 | Series bible (text PDF, ~11 MB) + 2012 production guide (text PDF) | `cn-gigaleak-gumball/` | A network puppet/mixed-media production's bible + guide: how a real show documents its world, cast and production rules |
| E2 | Character comp guide (PDF) + colour palettes (PDF) | `cn-gigaleak-gumball/` | How characters are composited/constructed for that production + the palette-document standard — direct reference for our part-separation and colour-model paperwork |
| E3 | `GBM CONSTRUCTION NOTES` (PDF) | `cn-gigaleak-grim-adventures/` (`Grim Adventures of Billy & Mandy/`) | A production's character **construction notes** — how its characters are put together, the document class our §1 rig sheets imitate |
| E4 | `GBM SIZE CHART` (.pdf/.ai) + `GBM DESIGN GUIDE CNE (REFERENCE ONLY)` folder | `cn-gigaleak-grim-adventures/` | The size-chart document + design guide — scale discipline as actually shipped |
| E5 | `SDMI Main Model Pack` folder + `SDMI Docs` (series description, rollout/matrix spreadsheets, meeting reports) | `cn-gigaleak-scooby-doo-mystery-inc/` | A model pack (the model-sheet standard as a production artefact) + the production-office paperwork around a series |
| E6 | Style guide (PDF, ~27 MB) | `cn-gigaleak-robot-chicken/` | A production style guide — the standards-document format itself |
| E7 | Production document (PDF) in `production-docs/` | `cn-gigaleak-regular-show/` | A production-office document from a modern board-driven show |
| E8 | Series bible PDF (~20 MB) + text extraction (`jb2.txt`, headings) | `animation-techniques-archive/cn-leak-study/` | A network series bible, already text-extracted in the archive — bible completeness standard |
| E9 | `.fla` rig files (zip, ~0.7 MB) | `cn-gigaleak-cartoon-vault/smiling-friends/` | Modern small-team show rig files — rig-construction study per the transfer manifest (file-level listing only this pass; contents not opened) |
| E10 | Animation-study catalogs (CATALOG.md files for three productions) | `TRIPPEDD-Production-studios-/animation-study/` | Jamar's own catalogs of public-source study material — OWNER bucket for the catalogs; underlying material graded per its own sources |

## F. Checked and NOT pullable (honest gaps)

- **Bonus-release model sheets** named in `PULL-IN-MAP.md` (a classic
  strip character's model sheets): the bonus repo
  (`cn-gigaleak-bonus-non-cn`) is a ~3 KB stub — nothing exists to
  pull until that source is filled. Recorded as a gap, not a pull.
- The placeholder gigaleak repos (several at ≤8 KB: fosters,
  adventure-time, teen-titans, johnny-test, wabbit, kids-next-door,
  and duplicates) hold no production documents. Nothing to pull;
  they stay on the existing gap list.
- No Toon Boom / Flash **project files** from a network puppet
  production were found in the archive this pass — the rig
  *documentation* in §A–E plus vendor documentation carries the rig
  method. Recorded as UNVERIFIED-absent, not as a negative claim
  about the full TeraBox holdings (not searched this stage).

---

*Stage 1 of the industry-method programme: explanation + method spec
+ this list. Landing (stage 2) copies A–D per the destinations above
and stages E to the TeraBox private-study shelf with native
extractions only. The gag rebuild (stage 3) follows
`CORRECTED-METHOD.md` §7.*
