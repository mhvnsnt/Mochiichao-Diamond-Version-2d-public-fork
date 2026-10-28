# Tooling index — production capability pulled in for the show build

**Definition (Jamar, 2026-10-27):** tooling = **reusable production
capability** — pipelines, workflow systems, templates, convention/
spec documents, and Jamar's own code/tools — as distinct from show
content. Tooling comes into the show folder; a studio's actual
production files for *their* episodes/characters (their character
rigs, episode project files, animatics, model packs) are **content,
not tooling — pointers only, never copied or converted.**
Audit date: 2026-10-27, across the repos in the pull-in map /
transfer manifest.

**How "carried in" works for code:** Jamar's own standard (Universal
Rig Standard) is *don't fork pipelines per project — pull canonical,
improvements go back via PR.* So his code stays canonical in its home
repo; this show folder carries the **index, the specs, and the native
adaptations** (PIPELINE.md, TEMPLATES.md in this folder), and episode
work calls the canonical tools by the paths listed here.

---

## Class A — Jamar's own code & tools (canonical homes; indexed here)

### cape-jones — `production/pipeline/` (72 files, verified)
The largest working toolset he owns. The show-relevant core:
- **Boarding/animatic:** `storyboard_sheet.py`, `animatic_builder.py`,
  `fountain_to_animatic.py`, `fountain_to_beats.py` (script → beats →
  animatic), `scene_assembler.py`, `led_scene_assembler.py`
- **Dialogue/lip-sync:** `dialogue_pipeline.py`, `lipsync_align.py`,
  `tts_voices.py` / `tts_voices_2026.py`, `voice_convert.py`,
  `transcribe_translate.py`
- **Cartoon finish:** `anime_fx.py`, `cleanup_lines.py`,
  `vs-anime-cleanup.vpy`, `upscale_span.py`, `palette-enforce.py`,
  `grades.py`, `finish.py`, `comp_glow.py`, `retro_fx.py`,
  `deghost.py`, `cartoon-fx.sh`, `ffmpeg-animation-filters.sh`
- **Audio:** `music_gen.py`, `sfx_gen.py`, `audio_restore.py`,
  `stem_sep.py`
- **Gates/QC:** `claim_gate.py`, `verify_claim.py`,
  `checkpoint_audit.py` (the claim/proof discipline — same family as
  the ANIM-GATE)
- **Formats:** `example_manifest.json` (manifest format),
  `flamenco-manager.ep1.yaml` (render-farm config)
- **Docs:** `ANIMATION-PIPELINE-2026.md`, `FLIPACLIP-POST-PIPELINE.md`,
  `docs/COMPLETE-PIPELINE.md`, `docs/ANIM-GATE.md`
- Also in-repo: a vendored **Rhubarb Lip Sync** tool under
  `3d-assets/face-rig/tools/rhubarb/` (third-party OSS, license file
  included there).

### TRIPPEDD-Animation-Studio — the shot pipeline
- `PIPELINE.md` (architecture), `fetch_assets.py` (license-gated
  acquisition), `catalog/build_catalog.py` + `catalog.json`/SQLite
  FTS5, `find_asset.py`, `render_shot.py` + `render/blender_scene.py`,
  `retarget/retarget_core.py`, `post/finish.py` (grade/grain/
  letterbox/titles/mix −14 LUFS), `post/proof.py` (QC proof stage),
  `shots/SPEC.md` + `shots/templates/` (shot-spec format + templates).

### animation-techniques-archive — the technique toolkit
- `tools/TOOLKIT.md`, `tools/lipsync-timing.py`, `tools/qc-gates.py`,
  `tools/likeness-check.py`, `tools/ebsynth-guide.md`,
  `tools/masking-quickstart.md`
- `templates/character-model-sheet-template.md`,
  `PIPELINE-CHECKLIST.md`, `ANIMATION-PLAYBOOK.md`

### Voice + edit
- **wizard-gang-voice-pipe:** `scripts/render_voice.py` (Chatterbox
  TTS), GitHub Actions Voice Render workflow, `render-queue.json`
  format, per-character refs/defaults system.
- **pocket-studio:** `app.html` (phone timeline editor), `build.py`
  (project JSON → ffmpeg → MP4, with clip muting/ducks),
  `extract_recordings.py`, project-JSON format documented in its
  README.

### Body-replace / AI-video fix
- **video-fix-tools/ai-body-replace** (mirrored in TRIPPEDD repos):
  `cape_jones_viggle_kaggle.ipynb`, `viggle_workflow_api.json`,
  `KAGGLE-SETUP.md`, `gen_notebook.py` — the Viggle-on-Kaggle
  workflow that animated Cape Jones.

### Rig repair (3D)
- **western-heart `tools/rig_repair/`** — the canonical 9-stage rig
  pipeline named by the Universal Rig Standard (Bannon/docs). Per
  Jamar's own no-fork law this stays a canonical pointer; the show
  calls it, never copies it.

### Already in this repo
- `tools/avatar-pipeline/` — the Mochiichao avatar/show bundle
  pipeline (PR #309, merged).

## Class B — Convention / spec documents (carried in as native specs)
| Convention/spec | Source (his docs) | Carried in as |
|---|---|---|
| Fla puppet-rig conventions (naming, hierarchy, symbols) | animation-techniques-archive study notes | `show/production/rigs/README.md` standard |
| Preston Blair 10-viseme mouth system | ANIMATION-PLAYBOOK.md | rig specs + playbook adoption |
| HB limited-animation method (2s/3s, holds, cel levels) | mystery-coast-ghosted/docs/research | PIPELINE.md in this folder |
| Dialogue-first production pipeline | mystery-coast PIPELINE.md + TOOLING-2026.md | PIPELINE.md in this folder |
| Scooby 6-beat episode formula | mystery-coast research | beat-sheet template (TEMPLATES.md) |
| Model-pack completeness (8-sheet) + mouth QC | rig-mapping/shows/knd-model-pack.md | model-sheet template (TEMPLATES.md) |
| Palette enforcement as a system | cape-jones `palette-enforce.py` + docs | PIPELINE.md finish stage |
| Persona 5 UI principles (CEDEC 2017) | research report | `show/production/research/persona-5-ui-principles.md` |
| Manifest/catalog formats | TRIPPEDD sources manifests; cape-jones example_manifest.json | `show/shared/` manifests (SHOW-HOME plan) |

## Class C — Pointers only (third-party studio production files)
Content, not tooling — location + catalog description only, per the
unchanged boundary:
- Nick study folder files: studio character rig (.ma), episode
  animatic, bible PDFs (see research INDEX).
- CN archive episode project files, character rigs and model packs
  in the donor repos.
- Rick & Morty Toon Boom project files; Smiling Friends .fla rigs
  (cartoon-vault).

## Gray cases (flagged, per the default rule)
1. **Big Buck Bunny production tree (CC-BY)** — its Python
   rig-constraint scripts look like tooling, but they are a studio's
   production files for their film. **Decision: pointer for the
   files; the reusable system (folder discipline, rig layout) is
   already extracted into native specs** (research INDEX + rigs).
2. **Rhubarb Lip Sync vendored in cape-jones** — third-party open-
   source *software* (not studio content): fine to use as a tool via
   its home path/license; not re-copied here.
3. **`viggle_workflow_api.json`** — a workflow *configuration* for a
   third-party service, authored in Jamar's repos for his pipeline:
   Class A (his tooling configuration), the service itself is
   external.

- **Voice kit** — `show/production/tooling/voice-kit/` (Chatterbox render queue + GitHub Actions workflow for human voices, wired per its WIRING.md; weights staged per its TERABOX-MANIFEST.md — prepared, not yet staged).
