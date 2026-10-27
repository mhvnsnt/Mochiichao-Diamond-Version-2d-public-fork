# Materials & resources index — the construction kit, layer 2

**Framing (Jamar, 2026-10-27):** "I don't need their actual
characters in episodes. I need the stuff that builds them — the
pieces of them: environment, tools, rigs, all the stuff the show is
built from — and not just the tools, but the resources, the
materials the tools use."

This index covers **layer 2 of the construction kit** (tools =
TOOLING-INDEX.md; rig systems = ../rigs/; research =
../research/). **Dispositions:** *carried* = in the show folder/
repo now · *canonical* = Jamar's own material, used from its home
repo · *converted* = donor material rebuilt into Mochiichao-native
form under the transfer rules · *rebuilt-native* = identity-bearing
piece NOT copied; the system behind it was rebuilt for our cast ·
*pointer* = location + description only.
**Filter (unchanged):** no characters, no character names, no
logos/branding — ever.

## 1. Palettes & color systems
| Resource | Where | Disposition |
|---|---|---|
| Mochiichao garden-form palettes (per-species bright/neutral etc.) | this repo `src/assets/garden-form-palettes/` | **carried** (already in repo) — the show's base palette source |
| Palette-enforcement system + VFX palette data | cape-jones `production/pipeline/palette-enforce.py`, `3d-assets/blaster-vfx/blaster_palette.json` | canonical tool + format reference |
| Donor palette sheets (e.g. Gumball colour palettes PDF in its repo) | cn donor repos | **converted** — the *system* (per-character palette sheet + day/night line-ups, the pro model-pack pattern) becomes Mochiichao palette sheets per species (model-sheet standard, TEMPLATES.md); donor sheets themselves stay donor-side |
| Persona color-first design rule | research/persona-5-ui-principles.md | **carried** as principle |

## 2. Textures & material libraries
| Resource | Where | Disposition |
|---|---|---|
| CC0 texture/HDRI/model sources (Poly Haven, ambientCG, Kenney, Quaternius/KayKit) with license+URL per item | TRIPPEDD-Animation-Studio `manifests/sources/*.json` (polyhaven_textures, ph_hdris, ph_models, ambientcg, kenney_3d…) | canonical acquisition index — materials are fetched under the pipeline's license gate, never bulk-copied here |
| OpenGameArt music/SFX/VFX packs (CC0/CC-BY) | same, `oga_music.json`, `oga_sfx.json`, `oga_vfx.json` | canonical acquisition index |
| OFL fonts library | same, `fonts_ofl.json` | canonical |
| BBB texture/material files | disney-tva-bbb-pulls release (BBB tree) | **pointer** (studio production files; discipline already extracted) |

## 3. Mouth-chart & expression SYSTEMS
| Resource | Where | Disposition |
|---|---|---|
| Preston Blair 10-viseme system | ANIMATION-PLAYBOOK (his archive) | **carried** — built into every rig spec + scaffold (../rigs/) |
| Viseme-pack template + per-character pack format | animation-techniques-archive `character-pipeline/04-viseme-pack/template.md` | canonical template — the format our cast packs follow |
| 3D mouth kit (builder + kit) | cape-jones `3d-assets/face-rig/build_mouthkit.py`, `cj_mouth_kit.blend`, SCOUT-FACE-MOUTH notes | canonical (his own mouth system for 3D shots) |
| Lip-sync timing tool + Rhubarb cue format | animation-techniques-archive `tools/lipsync-timing.py`; Rhubarb vendored in cape-jones | canonical |
| Mouth pose frames (closed/half/open per creature) | this repo `docs/title-lane-archive/staging/videos/` | **carried** (already in repo) |
| **⚑ Identity-bearing:** a named donor character's own mouth pack / eye set / hand set inside donor files | cn/nick donor repos | **rebuilt-native** — NOT copied. The *system* (Blair shapes + symbol stepping) was rebuilt for our cast in the rig scaffolds; the donor pieces stay donor-side. Flagged per the gray-case rule. |
| **⚑ Identity-bearing:** Wizard Gang per-character viseme packs (Ashes/Cipher/etc.) | character-pipeline `characters/*` | **rebuilt-native for Mochiichao** — they're another of Jamar's casts, so the packs are the worked example/format proof; Mochiichao packs are authored for Mochiichao mouths, not reused drawings |

## 4. Pose & motion libraries (as systems)
| Resource | Where | Disposition |
|---|---|---|
| Garden pose library — 301 paths: per-species garden poses + `*.garden.json` pose data (feed/play/sleep…) | this repo `sprite-art/garden-poses/` | **carried** (already in repo) — the show's first pose library |
| Sitting pose library + pose audit tooling | cape-jones `3d-assets/cape-jones-rig/SITTING-POSE-LIBRARY.md`, `sitting-poses/`, `cape_pose_audit.py` | canonical (his; the *library pattern* — named poses + turntable proofs — is the template for show pose libraries) |
| Mocap/motion banks (CMU free-use, UAL/mesh2motion, 100STYLE, ACCAD) | TRIPPEDD `manifests/sources/cmu_mocap.json`, `motion_banks.json` + PIPELINE.md source list | canonical acquisition index — motion *data* that retargets onto our rigs |
| Creature animation folders (idle/attack/hurt/walk, ~51 species) | this repo `sprite-art/animation/` | **carried** |
| **⚑** Donor characters' pose sheets/cycle drawings | cn donor repos | **rebuilt-native** — cycles are re-timed/re-drawn for our rigs from the timing systems (§5), not traced from donor sheets |

## 5. Timing & exposure references
| Resource | Where | Disposition |
|---|---|---|
| Technique breakdowns (ones/twos, holds, smears, squash) tied to PD films | animation-research-library `TECHNIQUES.md` + `films/` (~30 PD shorts) | canonical (PD; verified/uncertain status tracked in its CATALOG.md) |
| HB timing economics + X-sheet method (on 2s/3s, metronome walk cycles) | mystery-coast research docs | **carried** as spec (PIPELINE.md) |
| Exposure-sheet study (external, free) | Heritage Auctions lots; Kanzenshuu translations (research/dragon-ball.md) | pointer (external study) |
| Sakuga timing references (animator-tagged cuts) | sakugabooru (research docs) | pointer (external study) |

## 6. Brush / ink / finish settings
| Resource | Where | Disposition |
|---|---|---|
| Line-cleanup + anime-cleanup configs | cape-jones `cleanup_lines.py`, `vs-anime-cleanup.vpy`, `production/tools/anime-upscaling/` (settings + skill doc) | canonical |
| Finish-chain settings (grades, glow, retro FX, ffmpeg filter chains) | cape-jones `production/pipeline/` finish set | canonical |
| Tool settings notes for the OSS stack (Tahoma2D/Krita/Blender) | mystery-coast `docs/research/TOOLING-2026.md` | canonical doc; stage choices carried in PIPELINE.md |

## 7. Backgrounds, environments & props (the pieces)
| Resource | Where | Disposition |
|---|---|---|
| Battle backgrounds set | this repo `sprite-art/battle-backgrounds-v3/` | **carried** |
| Living-room environment + props library (his own 3D set) | cape-jones `3d-assets/living-room/` (+ props README/notes) | canonical — pattern + reusable non-character set pieces for 3D shots |
| Donor-show backgrounds / environment art / props & items | cn donor repos (loaded ones) | **converted** — carry-over-eligible under Jamar's filter (no characters/names/logos): selected pieces are catalogued in `show/shared/parts-catalog.json`, palette-matched to the show, and mixed into Mochiichao scenes; anything character-branded or logo-bearing fails the filter and stays out |
| Environment design method (mixed-media guide) | cape-jones `docs/environments/MIXED-MEDIA-GUIDE.md` | canonical doc |
| PD/CC background art (Blender open movies etc.) | animation-research-library + BBB catalogs | canonical/pointer per license status |

## 8. Voice & audio materials
| Resource | Where | Disposition |
|---|---|---|
| Species cries (~100) | this repo `public/audio/cries/` | **carried** — voice bases for the cast |
| Title music + audio library | this repo `public/audio/` | **carried** |
| Voice reference WAVs + character defaults (TTS materials) | wizard-gang-voice-pipe `refs/`, `scripts/render_voice.py` | canonical — Mochiichao voice entries get authored the same way for our cast (not his Wizard Gang voices) |
| Wizard Gang masters/manifests | wizard-gang-storage | canonical (his production materials store) |
