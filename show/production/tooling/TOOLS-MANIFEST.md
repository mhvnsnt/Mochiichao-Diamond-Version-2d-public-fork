# TOOLS MANIFEST — what's wired, where it runs, verified status

Updated 2026-10-27 (credits-to-tools wiring pass: every role on a
Pokémon episode's credit roll mapped to a tool — see
CREDITS-TO-TOOLS.md in this folder — and the recommended tools
installed + verified on this VM). Machine facts: this build VM =
2 vCPU / 7.7GB / no GPU / no X display / FFmpeg 8.1.2 / Python
3.12 / Node 24. Install discipline: no-sudo, everything portable
under ~/opt (AppImages in ~/opt/tools/appimages, tarballs in
~/opt/tools/portable, venvs in ~/opt/venvs-*); TMPDIR/PIP_CACHE on
the home volume (/tmp is a 512MB tmpfs).

**Criterion (owner, 2026-10-27): FREE, not open-source.** "Open
source" was shorthand for "whatever's free" — free proprietary
tools are eligible alongside OSS. The Licence column records each
tool's type honestly. The only surviving flag is commercial-ship
legality (CC-BY-NC weights = scratch only, §NC below).

**VM display/GL note:** this VM has no X server and shipped without
host GL libraries (libEGL/libOpenGL), which several Qt AppImages
expect from the host. Solved without any system install: mesa
25.2.8 + glvnd 1.7.0 extracted from Ubuntu .debs into
~/opt/lib/gl; launcher wrappers in ~/opt/bin (krita, kdenlive,
audacity, inkscape, lmms, blender, natron, tahoma2d, godot)
source ~/opt/bin/appimage-glenv.sh and run the AppImages with
--appimage-extract-and-run (no FUSE device on this VM).

## The spine + the anime core (research verdict, CREDITS-TO-TOOLS §3)

**Blender 4.5.9 LTS is the pipeline spine** (16.5/28 credit roles —
the only free app spanning storyboard → key animation → rigs →
CGI → compositing → editing) and **the OpenToonz line is the
anime core** (16/28 — wins episode direction/xsheet, colour
coordination, finishing, line photography, in-between check).
Together 20.5/28; every remaining gap is a small satellite below.
Blender is VM-VERIFIED including a headless Python smoke test.
OpenToonz 1.8 publishes **no official Linux binary** (its GitHub
release ships only Windows/macOS), so the VM seat is filled by
**Tahoma2D 1.6.3** — the same codebase (Modified BSD), VM-VERIFIED
(`Tahoma2D v1.6.3`) — while OpenToonz 1.8 stays the owner-machine
standard it already was.

| Tool | Licence | Pipeline stage / EP01 + season job | Runs | Status |
|---|---|---|---|---|
| FFmpeg 8.1.2 | OSS (LGPL+GPL) | Finish spine: composite, audio beds, loudness gate, conform — every EP01 scene bed + animatic + proofs | VM | WIRED |
| build_manifest.py | project code | Script+boards+cue → episode manifest (Series Composition / Screenplay desk) | VM | WIRED (ambient_layers v1) |
| episode_gate.py | project code | One-shot readiness across all gates (In-Between Check / QC desk) | VM | WIRED (EP01: 5/5 audio PASS, HALT 12 by design) |
| scene_audio_bed.py | project code | Per-scene audio beds + loudness gate | VM | WIRED |
| sfx_pull.py | project code | Freesound CC0 pulls closing SFX gaps (Sound Effects desk) | VM | WIRED — needs owner's free Freesound API key to pull |
| **Blender 4.5.9 LTS** | OSS (GPL) | SPINE: Grease Pencil storyboards + previz, 3D-assisted background plates, CGI shots, camera, compositor assists, VSE rough cuts — EP01 boarding/previz + plate work | VM | **INSTALLED + VERIFIED**: `Blender 4.5.9 LTS`; headless smoke `blender -b --python-expr` printed version OK. ~/opt/tools/portable/blender-4.5.9-linux-x64 |
| **Tahoma2D 1.6.3** (OpenToonz line) | OSS (Modified BSD) | ANIME CORE: xsheet episode direction, drawn key/2nd-key/in-between, cleanup + ink & paint (Finishing), palette/style enforcement (Colour Coordination), line photography, FX schematic — EP01 shot production | VM | **INSTALLED + VERIFIED**: `Tahoma2D v1.6.3` (official portable tar.gz → bundled AppImage). OpenToonz 1.8 itself: no official Linux binary exists — owner-machine standard (see below) |
| OpenToonz 1.8 | OSS (Modified BSD) | Same anime-core seat as Tahoma2D, owner-machine install | owner | STANDARD (unchanged); no Linux build published by upstream |
| OpenToonz MCP (0.1.0a) | OSS | Drives OpenToonz/Tahoma shots from the pipeline | VM (server) + owner | INSTALLED in ~/opt/venvs-mcp; starts clean |
| TextRig MCP (MIT) | OSS (MIT) | Flat PNG → DragonBones puppet rigs (Key Animation, puppet route) — Wispkin rig v1 built | VM | INSTALLED + SMOKE-TESTED (MCP handshake OK, server v1.30.0) |
| Rigby2D | OSS (Apache-2.0) | Layered rigs, pose library (Key Animation, puppet route) | VM (editor) + owner | CLONED ~/opt/tools/rigby2d; MCP entry in tooling/mcp/mcp-servers.json |
| Krita 5.2.11 | OSS (GPL-3.0) | Design desk: character/guest setting sheets, model sheets, painted backgrounds, art-direction passes — EP01 guest/prop sheets + BG paint | VM (version-verified) + owner (GUI) | **INSTALLED**: AppImage in ~/opt/tools/appimages; version verified via its bundled `krita_version` → 5.2.11. Caveat: the AppImage ships only the xcb platform plugin (no offscreen), so the full GUI cannot open on this display-less VM — GUI work is owner-machine/display |
| Inkscape 1.4 | OSS (GPL) | Hard-surface/prop + setting sheets, vector props, title/logo vector work | VM | **INSTALLED + VERIFIED**: `Inkscape 1.4 (e7c3feb, 2024-10-09)` |
| Kdenlive 26.08.1 | OSS (GPL-2.0+) | Picture edit (Editing credit): EP01 assembly edit on top of the FFmpeg finish spine | VM | **INSTALLED + VERIFIED**: `kdenlive 26.08.1` (via portable GL stack) |
| Natron 2.5.0 | OSS (GPL-2.0) | Photography/compositing + Special Effects: node comp, glows/flashes/grain for EP01 shots | VM | **INSTALLED + VERIFIED**: official no-installer tarball → `Natron Version 2.5` (needed libGLU, added to ~/opt/lib/gl from libglu1-mesa deb) |
| Godot 4.7.2 | OSS (MIT) | Dark-horse utility: real-time 2D rig playback/preview, interactive previz, game-side crossover checks | VM | **INSTALLED + VERIFIED**: `4.7.2.stable.official` (single binary, ~/opt/tools/portable/godot) |
| Audacity 4.0.1 | OSS (GPL-3.0) | Sound Effects bench + recording capture: SFX edit/design for EP01 beds, voice-take trimming | VM | **INSTALLED + VERIFIED**: `Audacity 4.0.1` (via portable GL stack; official AppImage) |
| Ardour | OSS (GPL-2.0+) | Sound Direction / Recording desk (DAW mix, automation, stems) | — | **DOCUMENTED, NOT INSTALLED**: the official ready-to-run binary is paywalled (ardour.org requires payment/subscription); source is GPL but a from-source DAW build is out of scope for this pass, and no third-party mirror was used on principle. Audacity + FFmpeg loudnorm cover EP01's mix spec (−14 LUFS) meanwhile |
| LMMS 1.2.2 | OSS (GPL-2.0) | Music desk: compose/produce extensions of the owner's title track + stems | VM | **INSTALLED + VERIFIED**: `LMMS 1.2.2 (Linux x86_64, Qt 5.9.7)` (AppImage, run with --allowroot on this VM) |
| MuseScore Studio 4.7.6 | OSS (GPL-3.0) | Music desk: notation, score/lead-sheet work for the season's music | owner (GUI) | **DOWNLOADED, NOT VM-VERIFIED**: official AppImage in ~/opt/tools/appimages; with the GL stack the binary loads but aborts at GTK display init — this VM has no X server/Xvfb, so `--version` could not be captured headlessly. Owner-machine install |
| Chatterbox (chatterbox-tts 0.1.7) | OSS (MIT, code + weights) | Voice Cast desk: the owner's voice-pipe engine — cloned human voices for Mochiko/Hex/Aeon from owner-chosen references (VOICE-SCRATCH law: scratch until the owner casts) | VM (CPU) / GPU | **INSTALLED + IMPORT-VERIFIED**: venv ~/opt/venvs-voice, torch 2.6.0+cpu, `ChatterboxTTS` imports OK. Weights (~3.5GB from HuggingFace) NOT downloaded this pass — first-use pull; no render smoke-tested yet |
| Kokoro (kokoro 0.9.4) | OSS (Apache-2.0) | Scratch voices for animatics/timing only | VM (CPU) | **INSTALLED + IMPORT-VERIFIED**: same venv; `KPipeline` imports OK. Model (~350MB) downloads on first use — not pulled this pass |
| Rhubarb 1.13.0 | OSS (MIT) | Lip-sync timing (humans only by law) | VM | INSTALLED ~/opt/bin/rhubarb, runs |
| ComfyUI + Wan 2.2 | OSS (GPL-3.0 / Apache-2.0) | Generative passes (triple-lock likeness stack) — avatar-stack bundles, plates | **Kaggle GPU** | ENDPOINT PROVEN LIVE 2026-10-27: notebook kaggle.com/code/marsfmmg/mochiichao-comfyui-wan — 2× Tesla T4, ComfyUI v0.43.0, Wan 2.2 staged (~18GB), headless API 200. Quota after run ~21h56m of 30h |
| RIFE (ComfyUI node) | OSS | In-Between Animation ASSIST on the Kaggle endpoint only — interpolation can smear held anime timing, so gated assist, never the douga pass itself | Kaggle | DOCUMENTED as a Kaggle-side workflow node (CREDITS-TO-TOOLS §2/§4); no local install |
| DaVinci Resolve (free tier) | Free proprietary | Editing / colour / Fusion comp / Fairlight — eligible under the free umbrella as an alternate edit+grade seat | owner | **OWNER-MACHINE, NOT INSTALLED HERE**: (1) download is registration-gated through Blackmagic's support API (their API reports latest Linux = 21.1.2); (2) its .run installer installs system-wide, breaking the ~/opt portable rule; (3) Resolve on Linux requires a GPU + display and does not run in this GPU-less headless VM |
| KIT Scenarist 0.7.2.rc12 | OSS (GPL) | Screenplay editor (optional comfort; the house Markdown/Fountain → build_manifest route already fills the role) | — | **SKIPPED**: its GitHub release publishes no Linux binary assets and no official portable Linux build was found. Trelby: skipped-legacy (aging codebase, not attempted) |
| Kitsu (CGWire) | OSS (AGPL-3.0) | Production Desk / Assistant Director desk (assignment + review loops) | — | **DOCUMENTED-STAGED, NOT RUNNING**: Kitsu needs its server stack (Zou API + PostgreSQL + event/queue services) — a heavy multi-service install not warranted for a one-human + agents studio. FULLSTACK-WIRING deferral stands; revisit trigger = a second regular human joins. git + build manifests + episode_gate cover the desk roles until then |
| git-lfs 3.5.1 | OSS (MIT) | Media versioning when the media repo lands | VM | INSTALLED ~/opt/bin/git-lfs |
| EbSynth | — | — | — | DEMOTED (browser freemium; see FULLSTACK-WIRING §0) |

## NC-flagged (free umbrella: scratch-eligible, never shippable)

| Item | Licence fact | Rule |
|---|---|---|
| MusicGen weights | Code MIT, released **weights CC-BY-NC-4.0** | May be pulled for scratch/experiment only; **outputs cannot ship in a commercial release**. Not downloaded this pass. The show's music base stays the owner's title track + stems |
| F5-TTS weights | **CC-BY-NC-4.0** weights | Same rule: scratch only, never in the ship path (Chatterbox MIT is the voice engine). Not downloaded this pass |

## Explicitly not installed, by design

- **Spine / DragonBones proprietary editors** — the pipeline uses
  the open formats only: TextRig (MIT) *emits* DragonBones format
  without the proprietary editor; Rigby2D (Apache-2.0) is fully
  open. (CREDITS-TO-TOOLS §4.6.)

Unopened owner actions (everything else is wired): (1) Freesound
API key for sfx_pull; (2) Mochiko/Hex/Aeon voice casting — pick
reference audio against the prosody sheets, then Chatterbox renders
stop being scratch; (3) MuseScore + Krita GUI seats and DaVinci
Resolve live on the owner's machine (display/GPU), per the table.
