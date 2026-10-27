# FULL-STACK SOFTWARE WIRING — Audit & Extension

**Status:** DRAFT for Jamar's review. Extends (does not replace)
`show/production/UNIFIED-PIPELINE.md`. Where this doc and the unified
pipeline disagree, **this doc wins** — it is the newer audit.
**Date:** 2026-10-27
**Directive it answers (Jamar, 2026-10-27):** research industry-standard,
production-grade, FREE (no card, no subscription) full-stack
animation-studio software, pull it in, and get it 100% wired into the
pipeline — the living-world upgrade (environment animation, background
life, B-roll, lighting/after-effects, ambient sound) has to run on real
studio tooling, not on hope.

**Method note (honesty):** versions and licenses below were verified
against official project pages / GitHub releases / project docs on the
date above; each claim carries its source. VM facts were measured
directly in the build VM, not assumed. Anything I could not verify is
labelled UNVERIFIED rather than smoothed over.

---

## 0. Corrections to UNIFIED-PIPELINE.md found by this audit

The unified pipeline's architecture stands. These specific claims in it
need amending:

1. **EbSynth 2 is no longer a free desktop tool.** EbSynth 2 is
   **browser-based and freemium**: the free account exports **MP4 only,
   capped at 720p**; PNG image sequences (what a pipeline actually
   needs) and 4K are behind the **$20/month Pro** tier. A self-hosted
   studio version exists but is a commercial conversation. The classic
   EbSynth (v1 beta) desktop app is still a free download, but it is
   **Windows/macOS only — no Linux build, no automation API**.
   → Reclassified below as HOSTED (free tier, limited) / OWNER'S
   MACHINE (classic). It cannot be a VM stage anymore. The flattening
   lane's deterministic backstop in-VM becomes Natron/FFmpeg composite
   flatteners + the low-denoise ComfyUI V2V pass on the GPU endpoint.
   Source: [CG Channel — EbSynth 2](https://www.cgchannel.com/2025/10/ebsynth-2-can-turn-video-into-animation-without-using-ai/).
2. **HunyuanVideo 1.5's license is not a plain "open" license.** It
   ships under the **Tencent Hunyuan Community License**, which
   **does not apply in the EU, UK, or South Korea at all**, and requires
   a separate Tencent license above 100M monthly active users. Fine for
   a US-based production today; it is not Apache-2.0 and must never be
   described as such. **Wan 2.2 (Apache-2.0) stays the house base** —
   this audit strengthens that choice. Sources:
   [licensing comparison](https://techiehub.blog/best-open-source-ai-video-generator/);
   [ComfyUI video guide, licences section](https://www.bestfreewebresources.com/comfyui-video-generation-local-guide-2026).
3. **LTX licensing, pinned down:** the current family (LTX-2.3 / 2.5)
   ships under the **LTX-2 Community License** — free commercial use
   only below **$10M annual revenue**; above that, a paid Lightricks
   license. Fine at this show's scale; log it in the license register.
   Source: [mid-2026 license verification](https://singularitybyte.com/tutorials/open-source-video-models-mid-2026-what-changed.html).
4. **Blender version pin:** the production-stable pin is **4.5 LTS**
   (released 15 July 2025, supported through July 2027). Blender 5.0
   shipped Nov 2025 as the new feature line. The unified pipeline's
   "5.2 LTS" phrasing should read 4.5 LTS. Source:
   [LWN — Blender 4.5](https://lwn.net/Articles/1036262/).
5. **OpenToonz 1.8.0 confirmed** on the official GitHub releases page
   (full changelog `v1.7.1...v1.8.0`). Note some third-party download
   mirrors still list 1.7.1 as "current stable" — trust GitHub.
   Source: [opentoonz/opentoonz releases](https://github.com/opentoonz/opentoonz/releases).
6. **Natron is in maintenance mode.** Latest release is **2.5.0**; no
   newer release exists as of this audit, and even sympathetic coverage
   notes the development pace is inconsistent. It remains the only free
   node compositor in its class (OpenFX, OCIO, headless renderer), so
   we still wire it — but we wire it as a *stable appliance*, not a
   platform we expect features from. Sources:
   [MajorGeeks — Natron 2.5.0](https://www.majorgeeks.com/files/details/natron.html);
   [Softonic review](https://natron.en.softonic.com/).
7. **SoX is effectively unmaintained** (no release since 14.4.2, 2015).
   Do not build new stages on it; FFmpeg covers every SoX job in this
   pipeline. (The unified pipeline listed sox as glue; this audit
   removes it.)
8. **MatAnyone license flag:** MatAnyone ships under NTU S-Lab
   research terms, not a permissive commercial license — treat
   matting outputs as VERIFY-BEFORE-COMMERCIAL-USE, and prefer SAM 2
   (Apache-2.0) + FFmpeg/Natron alpha work where a hard matte suffices.
9. **GitHub LFS free quota is now 10 GiB storage + 10 GiB/month
   bandwidth** on Free/Pro (raised from the old 1 GiB figures still
   quoted in older docs). Source:
   [GitHub docs — LFS billing](https://docs.github.com/de/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage).

---

## 1. 2D animation

| Tool | Version (verified) | License | Role in THIS pipeline | Headless / CLI |
|---|---|---|---|---|
| **Tahoma2D** | **1.6** (current official release; docs + "What's New in 1.6") | BSD-3-Clause | **Puppet home** — rig assembly (Plastic tool), symbol mouth/eye/hand frames, scene animation, built-in **Rhubarb Recognizer** for visemes | Inherits Toonz tooling: GUI + `tcomposer` command-line scene renderer (verify binary name in the portable build at install time) |
| **OpenToonz** | **1.8.0** (GitHub releases, changelog from v1.7.1) | BSD-3-Clause (Dwango "new BSD") | Upstream reference/fallback only — Tahoma2D ports its fixes; install only if a 1.8-only feature is needed before Tahoma ships it | `tcomposer` CLI renderer ships in full builds; **upstream ships no official Linux binary** — Linux via Flatpak/AppImage (community) or source build |
| **Krita** | **5.3.4** (15 Sept 2026; team flags 5.3.4 as the production-safe line, 6.0.x experimental) | GPL-3.0-or-later | **Paint** — BG plates, model-sheet paint, paint-over keyframes, board cleanup; animation timeline for hand-drawn passes (rustling leaves, water, smoke cycles drawn on loops) | Official AppImage; Python scripting (`krita` module, Scripter); CLI export flags (`krita --export …`) for batch sequence export |
| **Pencil2D** | **0.7.2** (13 Mar 2026) | GPL-2.0-only | **Boards/thumbnail timing only** — fast rough boards and motion thumbnails on the owner's machine. Deliberately NOT a render node: no rigging, no camera system worth automating | Basic CLI export exists; treat as artist-side |

Sources: [Tahoma2D — What's New in 1.6](https://tahoma2d.readthedocs.io/en/latest/whats_new.html);
[Tahoma2D site (BSD-3, Rhubarb integration, requirements)](https://tahoma2d.org/);
[Tahoma2D download page (Linux portable builds; plugins need OpenCV 4.5.1 in `/usr/local/lib`)](https://tahoma2d.org/download.html);
[OpenToonz releases](https://github.com/opentoonz/opentoonz/releases);
[Krita 5.3.4 release coverage](https://www.linuxcompatible.org/story/krita-534-release-android-animation-export-and-dropped-gimp-xcf-plugin/);
[Pencil2D — Wikipedia (0.7.2, GPL-2.0-only)](https://en.wikipedia.org/wiki/Pencil2D).

**Wiring notes.**
- `.tnz` scene files are the puppet track's unit of work; the build
  script never edits them by hand — it renders them. Rig/scene
  *generation* stays a human-in-Tahoma task for EP01; automation enters
  at render + downstream stages (see §8).
- Tahoma2D's Linux portable build is a zip, not an installer — it can
  live in `~/opt/` on the VM with no sudo (see §7). The plugins pack is
  a separate download and its OpenCV requirement is the one sharp edge;
  EP01 does not need the plugins.

## 2. 3D / camera

| Tool | Version | License | Role | Interface |
|---|---|---|---|---|
| **Blender** | **Pin 4.5 LTS** (supported → Jul 2027); 5.0 is the current feature line | GNU GPL | **Camera department + environment stage.** Grease Pencil layers hold 2D plates in real 3D space; the camera is keyframed data. Also: parallax environment builds, volumetric-ish FX cards (smoke, god-rays), and the compositor for quick pre-comps | Full headless: `blender -b scene.blend -P scripts/apply_camera.py -- --manifest episode.json --scene SC03` then `blender -b scene.blend -o //render/SC03/#### -a`. Python API (`bpy`) reads the e-konte cut rows (move type, duration, easing) and writes camera keyframes — camera moves become *data from the board*, never prompt text |

Sources: [LWN — Blender 4.5 LTS](https://lwn.net/Articles/1036262/);
[Blender headless scripting reference](https://copyprogramming.com/howto/how-can-i-run-blender-from-command-line-or-a-python-script-without-opening-a-gui).

**Wiring notes.**
- The camera-move vocabulary already named in ENVIRONMENT-AND-CAMERA
  (ESTAB-PAN, PUNCH-IN, HOLD-TENSION, CAMERA-THERE, STILL-FOREST) maps
  1:1 to keyframe presets in `apply_camera.py`: each preset is a
  function (start transform, end transform, easing curve). The board
  plan's camera column selects the preset; the manifest carries it.
- Eevee rendering wants a GPU/OpenGL context; on the CPU-only VM,
  Blender camera work runs in **Workbench/viewport-render or Cycles-CPU
  at low samples for layout proofs only** — final-quality Eevee passes
  run on the owner's machine (see §7). Layout proofs are all EP01
  needs from the VM.
- Install route with no sudo: official tarball from blender.org →
  `~/opt/blender-4.5/`, symlink into `~/bin/`. This is the cleanest
  install in the whole stack.

## 3. Composite / post

| Tool | Version | License | Role | Interface |
|---|---|---|---|---|
| **Natron** | **2.5.0** (latest; maintenance mode — §0.6) | GPL-2.0-or-later | **Node composite appliance** — layer stacks (BG / ambient-life layer / characters / FX / grade), OCIO colour management, OpenFX plugins | Headless renderer binary `NatronRenderer` (ships with the install); project files (`.ntp`) are XML and script-generatable — the build writes the graph, Natron renders it: `NatronRenderer -e <first> <last> comp/SC03.ntp` (flag set per Natron docs; verify against the installed build) |
| **FFmpeg** | **8.1.2 — INSTALLED in the VM (verified)** | LGPL/GPL build-dependent | **The spine.** Assembly, transforms (cheap camera moves on stills), mixes, loudnorm, encodes, contact sheets, gate measurements | CLI everywhere; every stage in §8 names its call |
| **OpenColorIO** | 2.x line | BSD-3-Clause | The ONE colour pipeline: ACES working space in Natron/Blender, BT.709 delivery; config file lives in the repo so every machine renders identical colour | `ocioconvert` (via OpenImageIO) / Natron + Blender read the same `config.ocio` |
| **Kdenlive** | **26.08** (31 Aug 2026) | GPL-3.0-or-later | **Owner-side review editor** — assembling a watchable episode cut for human review, fixing timing by eye before the scripted finish. NOT a render node | Project files are MLT XML; headless render possible via `melt` (MLT CLI) if ever needed |
| **Shotcut** | **26.9.27** (27 Sept 2026) | GPL-3.0-or-later | Alternate owner-side editor (same MLT base); pick ONE of Kdenlive/Shotcut — recommendation: **Kdenlive**, it is the more conventional multitrack timeline and the show's review cuts are timeline work | Same MLT note as Kdenlive |
| **Olive** | 0.2 alpha | GPL-3.0 | **DO NOT WIRE.** Development is paused by its (largely solo) developer; current roundups literally file it under "following the project, not editing with it today." Revisit only if development resumes | — |

Sources: [Natron 2.5.0 — MajorGeeks](https://www.majorgeeks.com/files/details/natron.html);
[Kdenlive 26.08 / Shotcut 26.9 — filmmakingcentral roundup](https://www.filmmakingcentral.com/best-free-video-editing-software-for-filmmakers);
[Shotcut 26.9 details](https://linuxiac.com/shotcut-26-9-video-editor-adds-audio-ducking-ffmpeg-9-0/);
[Olive status — 2026 open-source editor comparison](https://rankite.com/blog/best-open-source-video-editing-software).

**Wiring notes.**
- Natron's Linux distribution is a self-extracting installer that can
  target a user directory — VM-feasible without sudo (verify the
  installer's `--target` behaviour at wire time; fallback: extract on
  the owner's machine pattern and copy the tree, or run Natron
  owner-side only — composite graphs are portable XML either way).
- Delivery encode discipline unchanged from the unified pipeline:
  BT.709-tagged H.264, CRF ~16 master / ~21 web, `yuv420p`, `+faststart`.

## 4. Generative

| Tool | Version / terms | License | Role | Interface |
|---|---|---|---|---|
| **ComfyUI** | Rolling releases — **pin a tag/commit in the install manifest** | GPL-3.0 | **Generative runtime**, driven headless only | REST: `POST /prompt` (API-format workflow JSON) → `GET /history/{id}` / WebSocket `/ws` → `GET /view`; `POST /upload/image` for first frames. No built-in auth — bind localhost or proxy it |
| **Wan 2.2** | Current open line | **Apache-2.0** | **Primary video engine + LoRA base** (unchanged from unified pipeline) | ComfyUI nodes; GGUF quants for 24 GB cards |
| **HunyuanVideo 1.5** | 8.3B, native ComfyUI support | **Tencent Hunyuan Community License — NOT Apache; void in EU/UK/KR; separate license >100M MAU** (§0.2) | Alternate engine only, and only while the production's jurisdiction fits the terms | ComfyUI nodes |
| **LTX-2.3 / 2.5** | Current Lightricks line | **LTX-2 Community License** — free commercial <$10M ARR (§0.3) | Cheap motion drafts / animatic-motion passes | ComfyUI nodes; weights are gated on Hugging Face (account + terms acceptance — free, no card) |
| **RIFE** (Practical-RIFE) | Current | MIT | Selective interpolation (camera-move shots only — house style is held frames) | `ComfyUI-Frame-Interpolation` node pack on the GPU endpoint |
| **FILM** | Google | Apache-2.0 | Alternate interpolator; same selective-use rule | Same node pack |
| **EbSynth** | **2 = browser freemium** (free: 720p MP4 only; PNG seq/4K = $20/mo Pro); classic v1 = free desktop, Win/Mac only | Proprietary (free tier) | Flattening pass — **demoted** (§0.1): use the free web tier for one-off 720p tests, classic on the owner's machine for a hero shot; the *pipeline* flattening default becomes ComfyUI low-denoise V2V + Natron/FFmpeg deterministic flatteners | Web UI (v2) / desktop GUI (v1) — **no automation API in either** |
| **SAM 2** | Meta | Apache-2.0 | Prompt-once, track-through-video segmentation → mattes for re-layering generated characters over real plates | ComfyUI node packs; Python (`sam2` package) on the GPU endpoint |
| **MatAnyone / MatAnyone 2** | Research releases | **NTU S-Lab terms — verify before commercial use** (§0.8) | Soft-alpha matting (smoke, wisps, translucency) via Sammie-Roto 2 — flagged cuts only, license check logged per use | Via Sammie-Roto 2 |
| **Real-CUGAN** | Current (ncnn + torch builds) | MIT | Anime-tuned frame upscale | CLI (`realcugan-ncnn-vulkan` runs without CUDA — Vulkan/CPU fallback is real but slow; prefer GPU endpoint) |

Sources: [Wan/Hunyuan/LTX licensing](https://techiehub.blog/best-open-source-ai-video-generator/);
[EbSynth 2 pricing/shape](https://www.cgchannel.com/2025/10/ebsynth-2-can-turn-video-into-animation-without-using-ai/);
ComfyUI API + model facts as cited in UNIFIED-PIPELINE §3 (unchanged).

## 5. Audio production

| Tool | Version | License | Role | Interface |
|---|---|---|---|---|
| **FFmpeg** | 8.1.2 (installed) | — | **The mix engine of record**: per-scene stems, `adelay`/`amix` placement, two-pass `loudnorm` to −14 LUFS / −1 dBTP (−23 LUFS EBU variant flagged), `ffmpeg-normalize` as batch helper | CLI (already wired — `scene_audio_bed.py`) |
| **Ardour** | **9.8** (current) | GPL-2.0-or-later | **Owner-side DAW** for human mix passes — when a scene's music/SFX balance needs ears, not scripts. Sessions live beside the episode; the *deliverable* still comes out of the scripted loudnorm finish so mixes stay reproducible | GUI + Lua scripting + OSC control; prebuilt binaries from ardour.org are donation-asked (source and distro packages are free — no card needed either way) |
| **Audacity** | **3.7.x** (maintenance line; Audacity 4 in development) | GPL-3.0 | Owner-side quick editor: trimming cries, cleaning a foley take | GUI; `mod-script-pipe` for scripted batch effects if ever needed |
| **Tenacity** | 1.3.x stable / 1.4 alpha (rebased onto Audacity 3.7.5) | GPL-3.0 | **Optional only.** Honest status: development is real but thin (largely one maintainer, mid-rebase); Audacity 3.7.x is the safer recommendation today. Wire neither into automation | GUI |
| **Chatterbox** (Resemble) | Current | MIT (code + weights) | House TTS for human characters — already wired in wizard-gang-voice-pipe | Python API / pipe scripts (existing) |
| **Kokoro-82M** | Current | Apache-2.0 | Scratch/animatic voices on CPU | Python API (`kokoro` pip package) |
| **Rhubarb Lip Sync** | Current GitHub release (repo active in 2026) | MIT | **Viseme analysis.** Two routes: Tahoma2D 1.6's built-in Rhubarb Recognizer (puppet scenes), or the standalone CLI for Blender/ffmpeg-side timing sheets | CLI: `rhubarb -f json -o visemes.json -d dialog.txt line.wav` (recognizers: `pocketSphinx` for English, `phonetic` otherwise) |
| **SoX** | 14.4.2 (2015) | GPL/LGPL | **REMOVED** — unmaintained (§0.7). FFmpeg covers it | — |

Sources: [Ardour 9.8 — ardour.org](https://ardour.org/);
[Ardour 9.8 coverage](https://www.opensourceforu.com/2026/08/ardour-9-8-brings-scales-support-to-open-source-daw/);
[Tenacity status — maintainer's own summary](https://news.ycombinator.com/item?id=45718710);
[Rhubarb Lip Sync — GitHub / CLI options](https://awesome.ecosyste.ms/projects/github.com%2Fdanielswolf%2Frhubarb-lip-sync).

**Ambient/foley note (the living-world ask):** Ardour imports directly
from Freesound inside the DAW, but the *pipeline* path is §7's scripted
pull, so every sound in a shipped mix has a license log entry. DAW
sessions are for balance, not for sourcing.

## 6. Pipeline glue

| Piece | Facts | Wiring decision |
|---|---|---|
| **Python 3.12.3 — INSTALLED (verified)**, with pip 24.0, numpy, Pillow, requests already present | The build VM's measured state | All stage scripts are Python + subprocess calls to the tools above; new deps go in a per-project venv under `~/workspace` (`pip install --user` / venv — no sudo needed) |
| **ImageMagick 7.1.2** | ImageMagick license (Apache-style); NOT installed in the VM (verified absent) | Batch stills work: sequence inspection, contact sheets, palette-quantize flattening. Install route: portable static build or distro package on owner's machine; in-VM, Pillow already covers EP01's needs — **defer install until a job actually needs it** |
| **OpenImageIO (`oiiotool`)** | 3.x line, Apache-2.0 (ASWF) | EXR/sequence metadata, `ocioconvert`, sequence diff for gates. NOT installed in VM; pip-installable (`pip install OpenImageIO` wheels exist) — wire when the first EXR/OCIO job lands (post-EP01) |
| **Render/sync discipline** | — | PNG sequences are the ONLY interchange format between stages (already the house convention). Every stage writes into `scenes/SC##/<stage>/` and never overwrites a prior stage's output; the build log records tool + version + seed + settings per stage (extends TRIPPEDD's per-scene resumability) |
| **Git LFS** | Client is a single free binary (user-local install from the release tarball — no sudo). GitHub Free includes **10 GiB storage + 10 GiB/mo bandwidth** (§0.9); plain-git file limit is 100 MiB, LFS per-file cap 2 GiB on Free | **Decision: the show repo stays code/config/manifests ONLY — no renders, no media.** Media lives in workspace storage next to the build (the VM's home volume has ~149 GB free — measured), with SHA-256 manifests in the repo so any machine can verify/rebuild. Create a separate LFS media repo ONLY if/when renders must be shared across machines, and even then: masters + posters in LFS, intermediates never |
| **Kitsu (CGWire) + Zou API + Gazu** | Kitsu/Zou/Gazu are CGWire's open-source stack (AGPL-3.0 family); Zou is a Flask/PostgreSQL/Redis service, Gazu is its Python client; install is Docker-based; actively maintained, used by real studios | **HONEST VERDICT: NOT WARRANTED YET.** Kitsu earns its keep when multiple humans assign/review/track tasks against each other. This production is one owner + an automated pipeline: the episode manifest (`episode.json`) IS the shot list, git history IS the version record, and the gate scripts ARE the review status. Standing up a Postgres/Redis/web service to duplicate three files we already have is overhead, not infrastructure. **Revisit trigger:** a second human regularly touches production, OR review rounds on shots exceed what clip-index.json notes can carry. If that day comes: Kitsu via Docker on the owner's machine, Gazu wired into the build's gate stage to publish statuses — the manifest already carries every field Kitsu would need |

Sources: [GitHub LFS quotas](https://docs.github.com/de/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage);
[Kitsu/Zou/Gazu — CGWire](https://pypi.org/pypi/zou/0.20.59/json);
[Kitsu developer docs (Docker/self-host/API)](https://dev.kitsu.cloud/).

## 7. Sound libraries

| Library | Access | License discipline |
|---|---|---|
| **Freesound** | **APIv2** (REST). Free account + API key (apply at freesound.org/apiv2 — free, no card). Token auth suffices for search + HQ previews; **original-file downloads require OAuth2** — do the one-time OAuth2 flow and store the token with the pipeline secrets. Official Python client: `pip install freesound` | **CC0 filter is a query parameter, not a hope:** `filter='license:"Creative Commons 0"'`. Every pull logs sound ID, author, license string, and URL into the scene's cue-sheet record (the gate checks the log, not the folder). Note: the API now also exposes uploaders' GenAI-training preferences — irrelevant to playback use, but our pulls are playback-only by design; never feed Freesound pulls into LoRA training sets |
| **Kenney** | Direct zip downloads from kenney.nl — no account, no API needed | **Everything CC0.** The zero-paperwork default for UI clicks, impacts, and generic foley beds |
| **OpenGameArt** | Website downloads; no official API — pulls are manual/curated, which is fine at EP01's SFX count | **Per-item licenses (CC0 / CC-BY / CC-BY-SA / GPL appear side by side).** Filter to CC0 (or CC-BY with the credit logged); the same cue-sheet log entry is mandatory — this is the library where an unlogged pull is most likely to smuggle in a ShareAlike or NC-adjacent term |
| **Sonniss GDC bundles** | Annual free download, no account (2026 bundle: 7.47 GB / 347 files; archives back to 2015) | Royalty-free for use IN productions, no attribution — but NOT CC: no standalone redistribution, and the terms bar AI training use. Fine for mixes; never into training sets |

Sources: [Freesound APIv2 intro + Python client + license filter](https://opensource.creativecommons.org/blog/entries/freesound-intro/);
[Freesound API resources docs](https://freesound.org/docs/api/resources_apiv2.html);
[Sonniss/Kenney/Freesound license roundup](http://app.cinevva.com/guides/free-sound-effects-music).

**This section closes EP01's two flagged audio GAPs** (cold-spot
shimmer, gate bell — UNIFIED-PIPELINE §5 / cue sheet): both are
one-query Freesound CC0 pulls (shimmer: `shimmer glass high` /
`wind chime sparse`; bell: `small bell single hit`) plus Kenney's
audio packs for the gate mechanism clicks. The pull script lands in
Phase Now (§9).

---

## 8. ⚠ WIRE-UP REALITY CHECK

**The build VM, measured (not assumed):** Linux x86_64, **2 vCPU,
7.7 GB RAM, no GPU**. Root overlay is only **7.5 GB** — but the home
volume is **150 GB with ~149 GB free**, so all installs and media live
under `$HOME`. **Installed and verified:** Python 3.12.3 + pip,
FFmpeg 8.1.2, curl/wget/unzip, numpy/Pillow/requests. **Absent
(verified):** ImageMagick, OpenImageIO, SoX, git-lfs, Blender, Krita,
Flatpak, Snap, any AppImage runner. `apt-get` exists but **sudo is
not guaranteed** in this environment — every wiring step below is
therefore specified in a **no-sudo form** (portable tarball/zip into
`~/opt/`, venv/pip `--user`, standalone binaries into `~/bin/`).
AppImages need FUSE, which is commonly unavailable in VM/container
contexts; the no-sudo workaround is `--appimage-extract` (extract and
run the inner binary) — workable, but it makes AppImage-based installs
(Tahoma-adjacent tools, Krita) the *fiddliest* route, so tarballs and
zips are preferred wherever a project offers them. Downloads ride the
same network path this environment already uses for GitHub.

**Classification rules.** INSTALLS-AND-RUNS HERE = a no-sudo install
path exists AND the tool does useful work on 2 CPU cores / 7.7 GB RAM
(headless renders of 2D scenes: yes; Eevee final renders: no; any
diffusion model: no). RUNS ON OWNER'S MACHINE = the pipeline drives
it remotely (API/CLI/shared folders) or the owner runs the scripted
package there. HOSTED-ONLY = no local form exists or the free form is
a web service.

| Tool | Class | Why |
|---|---|---|
| FFmpeg 8.1.2 | **HERE (installed)** | Verified present; already the spine |
| Python glue, manifest compiler, gate scripts | **HERE (installed)** | Verified; numpy/Pillow present for DINO/CLIP-lite frame checks on sampled frames |
| Kokoro-82M (CPU) | **HERE** | pip-installable, CPU by design |
| Chatterbox | HERE (slow, batch) / owner's machine preferred | CPU works; a GPU makes it pleasant |
| Rhubarb CLI | **HERE** | Single small binary, user-local install; also bundled inside Tahoma2D 1.6 |
| Tahoma2D 1.6 | **HERE (render) / owner's machine (authoring)** | Portable zip → `~/opt/`; `tcomposer` headless renders of 2D scenes are CPU-fine. Rig *authoring* is GUI work — owner's machine. Linux plugins pack needs OpenCV in `/usr/local/lib` (sudo) — skip plugins in-VM |
| Blender 4.5 LTS | **HERE (layout proofs) / owner's machine (final Eevee)** | Tarball → `~/opt/`, no sudo, full `bpy` headless. CPU camera/layout renders fine; Eevee final-quality needs a GPU context the VM doesn't have |
| Natron 2.5.0 | **HERE (verify installer) / owner's machine (fallback)** | Headless `NatronRenderer` is CPU compositing — VM-appropriate. The one install in this list I could not verify end-to-end from the VM: the Linux installer is self-extracting; if it refuses a user-local target, run Natron owner-side — `.ntp` graphs are portable XML, so the wiring is identical either way |
| Krita 5.3.4 | **OWNER'S MACHINE** | Painting is human work; the AppImage route (FUSE/`--appimage-extract`) makes VM install the worst value-for-friction in the stack. Batch exports from Krita, if ever needed, run owner-side |
| Pencil2D 0.7.2 | OWNER'S MACHINE | Boards are human work |
| Kdenlive / Shotcut | OWNER'S MACHINE | Review editing is human work |
| Ardour / Audacity | OWNER'S MACHINE | Human mix/edit passes |
| ComfyUI + Wan 2.2 / Hunyuan / LTX | **OWNER'S MACHINE (GPU) or HOSTED** | Needs a GPU, full stop. The VM's role is client: the build script POSTs to the endpoint's `/prompt` API. Hosted forms (Comfy Cloud / RunComfy-class / RunPod rental) are the same API shape |
| LoRA training (musubi-tuner / ai-toolkit) | OWNER'S GPU or HOSTED (rental) | 12–24 GB VRAM jobs; one-off per character |
| RIFE / FILM | GPU ENDPOINT (with ComfyUI) | Node pack; CPU RIFE exists but is too slow to be a stage |
| SAM 2 | GPU ENDPOINT preferred | CPU possible on short clips, painfully slow (unified pipeline's assessment stands) |
| Real-CUGAN | GPU ENDPOINT preferred | ncnn-vulkan build can run CPU-only in a pinch — a fallback, not a plan |
| EbSynth 2 / classic | **HOSTED (free tier, 720p MP4) / OWNER'S MACHINE (classic)** | §0.1 — no Linux, no API, PNG sequences paywalled. Never a scripted stage |
| Freesound / Kenney / OpenGameArt pulls | **HERE (scripts)** | API/HTTPS pulls + license logging run anywhere |
| Kitsu | **NOT WIRED (deferred by verdict, §6)** | Would be owner's-machine Docker if the revisit trigger ever fires |
| Git LFS | HERE (when/if a media repo is created) | Single user-local binary; §6 decision defers the media repo itself |

**The one-sentence summary:** everything deterministic (manifest,
puppets-render, camera-data, composite, audio, gates, finish) can run
in this VM today with no-sudo installs; everything probabilistic
(diffusion generation, training, fast matting/interpolation) is a
remote call to a GPU the pipeline treats as a service — which is
exactly the split UNIFIED-PIPELINE §6c designed for, now with the
install receipts to back it.

---

## 9. THE WIRING MAP

Pipeline stages in build order. "Repo home" is inside the show repo
under `show/production/tooling/` unless noted. Existing pieces are
marked EXISTS; new scripts are named for the phase that writes them (§10).

| # | Stage | Tool(s) | Exact interface | Repo home |
|---|---|---|---|---|
| 1 | **Manifest** | Python (EXISTS: `build-manifest/build_manifest.py`) | `python3 build_manifest.py --script EP01-SHOOTING-SCRIPT-v2.md --boards EP01/STORYBOARD-PLAN.md --cues EP01/CUE-SHEET.md → episode.json` (schema extended in Phase Now with per-cut fields: `route`, `camera_preset`, `ambient_layers[]`, `sfx_pulls[]`) | `tooling/build-manifest/` |
| 2 | **Boards** | Pencil2D / Krita (owner-side); FFmpeg (EXISTS pattern) | Board frames land as PNGs named by cut (`boards/EP01_C##.png`); the build verifies existence + duration rows against the manifest — no board, no build (house law). Animatic assembly: `ffmpeg -f concat` over board frames + scratch bed (the Scene-1 animatic is this stage's proof) | `show/episodes/EP##/boards/` |
| 3 | **Puppets** | Tahoma2D 1.6 | Authoring: owner-side GUI. Render: `tcomposer` headless on `.tnz` scenes → PNG sequences (flags verified at install; scene render settings live in the `.tnz`). Visemes: Tahoma's Rhubarb Recognizer, or standalone `rhubarb -f json -o <scene>_visemes.json -d <dialog>.txt <line>.wav` feeding the puppet pass | Scenes: `show/production/rigs/builds/` + per-episode `scenes/SC##/puppet/`; viseme JSON beside the scene audio |
| 4 | **Generative** | ComfyUI endpoint (Wan 2.2 + triple-lock; VACE hand-offs; Phantom refs) | Build script: `POST {endpoint}/upload/image` (board frame + canon cutout) → patch API-JSON (seed, LoRA strengths, ControlNet pose) → `POST {endpoint}/prompt` → poll `GET {endpoint}/history/{prompt_id}` → fetch via `GET {endpoint}/view`. Endpoint URL + workflow JSONs are config, not code | Workflow JSONs + client: `tooling/comfyui/` (`workflows/*.api.json`, `comfy_client.py`) |
| 5 | **Matte / flatten** | SAM 2 (endpoint); Natron/FFmpeg flatteners (HERE); EbSynth (manual, exception only) | SAM 2 via ComfyUI node pack in the same workflow graph where possible; deterministic flatten chain: `ffmpeg -vf posterize/palettegen+paletteuse` against the show palette + line-overlay in the Natron graph (§6 stage) | In-graph (stage 4) + `tooling/flatten/` for the FFmpeg filter presets |
| 6 | **Composite / camera** | Natron (graphs) + Blender (true-3D camera) + FFmpeg (cheap moves) | Build generates the `.ntp` graph from the manifest (layers: BG plate → ambient-life layer → character passes → FX → lighting/grade stack per LIGHTING-SYSTEM keys) → `NatronRenderer` headless. Camera: board preset → Blender `apply_camera.py` via `blender -b … -P` for CAMERA-THERE/true-parallax cuts; simple pans/zooms stay as FFmpeg `zoompan`/`crop` anim or Natron Transform nodes — cheapest tool that honours the board wins | Graph generator: `tooling/composite/` (`build_comp.py`, templates in `templates/*.ntp`); camera: `tooling/camera/apply_camera.py` + `camera_presets.json` |
| 7 | **Audio beds** | FFmpeg (EXISTS: `build-manifest/scene_audio_bed.py`) + Freesound/Kenney pull script | Bed builder reads cue rows incl. NEW ambient rows (wind, leaves, water, distant cries, gate mechanism) → pulls missing SFX via `sfx_pull.py` (Freesound APIv2, CC0 filter, license log) → `adelay/amix` placement at board timings | `tooling/build-manifest/` + `tooling/audio/sfx_pull.py`; pulls land in `show/episodes/EP##/audio/sfx/` with `SFX-LOG.json` beside them |
| 8 | **Mix** | FFmpeg two-pass `loudnorm` (EXISTS pattern); Ardour (owner-side, optional human pass) | Per-scene stem → episode concat → pass 1 `loudnorm=print_format=json` measure → pass 2 linear apply → −14 LUFS / −1 dBTP (EBU −23 variant behind a manifest flag) | `tooling/build-manifest/` (finish step of the build runner) |
| 9 | **Gates** | Python + FFmpeg + (endpoint for heavy scores) | Per scene: frame-diff motion check (real movement, chosen holds — ANIM-GATE), DINO/CLIP likeness score vs canon cutout on sampled frames (CPU-slow but workable; endpoint if volume grows), subtitle-law check (intertitles only at scripted rows), SFX license-log completeness check, loudness spot-check (`loudnorm` measure on the scene stem). Any fail = scene loops, episode state preserved | `tooling/gates/` (`anim_gate.py`, `likeness_gate.py`, `audio_gate.py`) |
| 10 | **Finish** | FFmpeg + OCIO discipline | Concat scene masters → loudnorm → BT.709 H.264 master (CRF 16) + web copy (CRF 21, `+faststart`) → poster + contact sheet (`ffmpeg -vf tile`) → `clip-index.json` updated with honest `quality_status` per cut + build log (tool versions, seeds, LoRA strengths) | `show/episodes/EP##/exports/` + `show/shared/clip-index.json` |

**Ambient-life wiring (the owner's 14:15 upgrade list), explicitly:**
the "world is alive" layer is a *named manifest layer*, not an
afterthought — `ambient_layers[]` per cut, chosen from a growing BANK:
wind-sway cycles (Krita/Tahoma loops of grass, leaves, tree crowns),
drifting clouds (Blender/Natron plate layer with slow transform),
gate-door physics (a Tahoma Plastic-tool cycle: door sway + creak
sync point), distant-creature passes (silhouette Mochi birds crossing
sky plates; small foreground runners, defocused via Natron Blur in the
comp graph), and B-roll cutaways (pond ripple, leaf-fall, keeper-board
close-ups) shot once into the parts catalog and reused. Each ambient
asset enters `parts-catalog.json` like any other part, with its own
gate pass. Sound pairs with it 1:1: every ambient layer names its
ambient *sound* row (rustle, water, distant cry, mechanism) in the cue
sheet — a silent ambient layer fails the audio gate.

## 10. Phased wire-up order (matched to EP01)

### Phase NOW — EP01 Scene 1–2 finish-able, no new accounts, no GPU
1. **Install the no-sudo trio in the VM:** Blender 4.5 LTS tarball →
   `~/opt/`; Tahoma2D 1.6 portable → `~/opt/` (verify `tcomposer`);
   Rhubarb standalone binary → `~/bin/`. Record exact versions in
   `tooling/INSTALL-MANIFEST.md` (new) — the build log cites it.
2. **Extend the manifest schema** (`build_manifest.py`): per-cut
   `route`, `camera_preset`, `ambient_layers[]`, `sfx_pulls[]`;
   open items still HALT their scene (house law unchanged).
3. **`sfx_pull.py`** (Freesound APIv2, CC0-only, license log): closes
   the cold-spot-shimmer and gate-bell GAPs; pulls EP01's ambient set
   (wind, leaves, pond water, gate creak). One-time owner step: create
   the free Freesound account + API key and complete the OAuth2
   original-download flow.
4. **`build_comp.py` + one Natron template** (layer stack + grade) —
   or, if the Natron installer fights the VM, the same graph spec
   emitted for owner-side Natron with zero changes downstream.
5. **Gate scripts v1** (`tooling/gates/`): motion frame-diff +
   loudness + license-log checks (likeness scorer stubbed to sampled
   frames on CPU).
6. **Ambient BANK v1:** sway cycles + cloud layer + gate-door cycle
   for the Gate location; Scene 1 rebuilt through the full stage list
   as the reference scene.

### Phase NEXT — first GPU contact, EP01 hero cuts
7. **ComfyUI endpoint stood up** (owner's GPU or hosted): health-check
   + the `comfy_client.py` round-trip proven on one throwaway cut.
8. **Triple-lock workflow JSONs** (Wan 2.2 I2V + ControlNet + LoRA
   slots + Phantom reference) versioned in `tooling/comfyui/`.
9. **Image LoRAs for the pilot six** (musubi-tuner/ai-toolkit on the
   endpoint or a rental), trained on canon-cutout-expanded sets;
   likeness gate thresholds calibrated against them.
10. **Camera presets wired:** `apply_camera.py` + the five named
    presets; EP01's CAMERA-THERE ration (2/episode) spent deliberately.
11. **Ardour review pass** on the EP01 mix (owner-side), feeding
    corrections back into the scripted finish.

### Phase LATER — season scale
12. Wan **video LoRAs** for episode-carrying characters; style LoRA
    refresh per season.
13. SAM 2/MatAnyone matting as a default stage (license verdict on
    MatAnyone recorded first); RIFE chain for camera-move shots.
14. OpenImageIO/OCIO tooling formalised (`oiiotool` checks in gates);
    EXR intermediates if Natron graphs outgrow PNG.
15. **Kitsu revisit** — only on the §6 trigger (a second regular human
    in production, or review bookkeeping outgrowing clip-index.json).
16. EbSynth Pro/self-hosted — only if a specific shot's flattening
    defeats both the V2V pass and the deterministic flatteners, and
    the owner chooses to spend the $20 that month. It is a spot tool,
    never a stage.

---

## Sources (official-first)

- Tahoma2D: [tahoma2d.org](https://tahoma2d.org/) ·
  [What's New in 1.6](https://tahoma2d.readthedocs.io/en/latest/whats_new.html) ·
  [Download page](https://tahoma2d.org/download.html)
- OpenToonz: [GitHub releases (1.8.0)](https://github.com/opentoonz/opentoonz/releases)
- Krita: [5.3.4 release coverage](https://www.linuxcompatible.org/story/krita-534-release-android-animation-export-and-dropped-gimp-xcf-plugin/) ·
  [krita.org](https://krita.org/en/posts/2026/monthly-report-2608/)
- Pencil2D: [Wikipedia — 0.7.2, GPL-2.0-only](https://en.wikipedia.org/wiki/Pencil2D)
- Blender: [LWN — 4.5 LTS](https://lwn.net/Articles/1036262/)
- Natron: [MajorGeeks — 2.5.0](https://www.majorgeeks.com/files/details/natron.html)
- Editors: [Kdenlive 26.08 / Shotcut 26.9](https://www.filmmakingcentral.com/best-free-video-editing-software-for-filmmakers) ·
  [Olive status](https://rankite.com/blog/best-open-source-video-editing-software)
- EbSynth 2: [CG Channel](https://www.cgchannel.com/2025/10/ebsynth-2-can-turn-video-into-animation-without-using-ai/)
- Video-model licenses: [comparison w/ license table](https://techiehub.blog/best-open-source-ai-video-generator/) ·
  [LTX-2.3 verification](https://singularitybyte.com/tutorials/open-source-video-models-mid-2026-what-changed.html)
- Ardour: [ardour.org (9.8)](https://ardour.org/) · Tenacity: [maintainer summary](https://news.ycombinator.com/item?id=45718710)
- Rhubarb: [GitHub project + CLI reference](https://awesome.ecosyste.ms/projects/github.com%2Fdanielswolf%2Frhubarb-lip-sync)
- Freesound: [APIv2 intro (CC org)](https://opensource.creativecommons.org/blog/entries/freesound-intro/) ·
  [API resources](https://freesound.org/docs/api/resources_apiv2.html)
- Kitsu/Zou/Gazu: [PyPI — zou](https://pypi.org/pypi/zou/0.20.59/json) ·
  [Kitsu developer docs](https://dev.kitsu.cloud/)
- Git LFS: [GitHub docs — quotas](https://docs.github.com/de/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage)

*Versions verified 2026-10-27. Re-verify at install time and record
what actually landed in `tooling/INSTALL-MANIFEST.md` — the install
manifest, not this doc, is the version of record once wiring starts.*
