# TOOLS MANIFEST — what's wired, where it runs, verified status

Updated 2026-10-27 (credits-to-tools wiring pass: every role on a
Pokémon episode's credit roll mapped to a tool — see
CREDITS-TO-TOOLS.md in this folder — and the recommended tools
installed + verified on this VM; then the environment fix pass
the same day: Xvfb virtual display, Ardour installed via the free
distro channel, MuseScore + Krita verified against the virtual
display, voice weights pre-cached, VapourSynth wired, Docker
installed + Kitsu assessed — every claim below carries the
command output that verified it). Machine facts: this build VM =
2 vCPU / 7.7GB / no GPU / no physical display (virtual display
:99 instead, see the display note) / FFmpeg 8.1.2 / Python
3.12 / Node 24. Install discipline: no-sudo, everything portable
under ~/opt (AppImages in ~/opt/tools/appimages, tarballs in
~/opt/tools/portable, venvs in ~/opt/venvs-*); TMPDIR/PIP_CACHE on
the home volume (/tmp is a 512MB tmpfs). Two recorded exceptions:
Xvfb was already present as a distro package, and Docker Engine
was dpkg-installed system-wide on the owner's order (a daemon
cannot live in ~/opt). Deb packages are pulled with apt using
redirected state/cache dirs on the home volume
(Dir::State/Dir::Cache under ~/opt/tmp, sources = the official
azure.archive.ubuntu.com noble main+universe) because a plain
system `apt-get update` stalls in this cell (one configured
mirror hangs and the system lists sit empty mid-update).

**Criterion (owner, 2026-10-27): FREE, not open-source.** "Open
source" was shorthand for "whatever's free" — free proprietary
tools are eligible alongside OSS. The Licence column records each
tool's type honestly. The only surviving flag is commercial-ship
legality (CC-BY-NC weights = scratch only, §NC below).

**VM display/GL note:** this VM shipped without host GL libraries
(libEGL/libOpenGL), which several Qt AppImages expect from the
host. Solved without any system install: mesa 25.2.8 + glvnd
1.7.0 extracted from Ubuntu .debs into ~/opt/lib/gl; launcher
wrappers in ~/opt/bin (krita, kdenlive, audacity, inkscape,
lmms, blender, natron, tahoma2d, godot) source
~/opt/bin/appimage-glenv.sh and run the AppImages with
--appimage-extract-and-run (no FUSE device on this VM).

**VM display note (environment fix pass, 2026-10-27):** the VM
has no physical display, but it is no longer effectively
headless. Xvfb (the standard virtual X server; distro package
xvfb 2:21.1.12-1ubuntu1.9) runs a persistent virtual display
:99 at 1920x1080x24. `~/opt/bin/start-virtual-display.sh`
starts it (idempotent); `~/opt/bin/xvfb-run-muse <cmd>` runs
any GUI tool against it with the portable GL stack loaded
(software rendering). Verified end-to-end: an X client
(xkbcomp) read the server keymap from :99, and Krita,
MuseScore and Ardour all ran real jobs against it (their rows
below). Qt tools that ship only the xcb plugin — the ones that
used to be "owner-machine GUI" — now run HERE.

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
| Xvfb (xorg-xserver 21.1.12) | OSS (MIT/X11) | Virtual display :99 — the not-headless layer every GUI tool on this VM runs through | VM | **INSTALLED (distro package xvfb 2:21.1.12-1ubuntu1.9) + VERIFIED**: ~/opt/bin/start-virtual-display.sh (idempotent) + ~/opt/bin/xvfb-run-muse launchers; `xkbcomp` read the :99 server keymap (1,905 lines); Krita / MuseScore / Ardour all verified against it (their rows) |
| VapourSynth Core R81 | OSS (LGPL-2.1) | Frameserver layer beside FFmpeg: scriptable cuts / transitions / overlays / colour matrices in .vpy, frames piped to FFmpeg via stdin — the programmatic no-GUI, no-GPU edit path (the local seat a graphical NLE can't fill here) | VM | **INSTALLED + VERIFIED**: official PyPI wheel in venv ~/opt/venvs-frameserve (one-time `vapoursynth config` writes ~/.config/vapoursynth/vapoursynth.toml); vspipe linked at ~/opt/bin/vspipe. Verified: 5-line BlankClip script (320x240 RGB24) → vspipe → FFmpeg = 24 frames @24fps h264 MP4 (vspipe reported 567 fps) |
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
| Krita 5.2.11 | OSS (GPL-3.0) | Design desk: character/guest setting sheets, model sheets, painted backgrounds, art-direction passes — EP01 guest/prop sheets + BG paint | VM (Xvfb :99) + owner | **INSTALLED + VERIFIED under the virtual display**: `xvfb-run-muse krita --version` → `krita 5.2.11 (git a4da714)`, and a headless export job (64x64 test PNG → JPEG, 9,409 B valid JFIF) succeeded. The AppImage ships only the xcb plugin (no offscreen) — the virtual display is exactly the fix; the earlier "GUI cannot open here" caveat is retired |
| Inkscape 1.4 | OSS (GPL) | Hard-surface/prop + setting sheets, vector props, title/logo vector work | VM | **INSTALLED + VERIFIED**: `Inkscape 1.4 (e7c3feb, 2024-10-09)` |
| Kdenlive 26.08.1 | OSS (GPL-2.0+) | Picture edit (Editing credit): EP01 assembly edit on top of the FFmpeg finish spine | VM | **INSTALLED + VERIFIED**: `kdenlive 26.08.1` (via portable GL stack) |
| Natron 2.5.0 | OSS (GPL-2.0) | Photography/compositing + Special Effects: node comp, glows/flashes/grain for EP01 shots | VM | **INSTALLED + VERIFIED**: official no-installer tarball → `Natron Version 2.5` (needed libGLU, added to ~/opt/lib/gl from libglu1-mesa deb) |
| Godot 4.7.2 | OSS (MIT) | Dark-horse utility: real-time 2D rig playback/preview, interactive previz, game-side crossover checks | VM | **INSTALLED + VERIFIED**: `4.7.2.stable.official` (single binary, ~/opt/tools/portable/godot) |
| Audacity 4.0.1 | OSS (GPL-3.0) | Sound Effects bench + recording capture: SFX edit/design for EP01 beds, voice-take trimming | VM | **INSTALLED + VERIFIED**: `Audacity 4.0.1` (via portable GL stack; official AppImage) |
| Ardour 8.4.0 | OSS (GPL-2.0+) | Sound Direction / Recording desk (DAW mix, automation, stems) | VM (Xvfb :99) | **INSTALLED + VERIFIED via the free distro channel**: Ubuntu noble/universe package 1:8.4.0+ds1-2ubuntu8 — 56-deb closure pulled with `apt-get --download-only` (redirected state/cache dirs, official azure mirror) and extracted with `dpkg-deb -x` into ~/opt/ardour (201MB); launcher ~/opt/bin/ardour. Verified: `xvfb-run-muse ardour --version` → `Ardour8.4.0~ds1 (built using 8.4.0~ds1-2ubuntu8 and GCC version 13.2.0)`. **LICENCE LABEL CORRECTED** (owner's licence/pricing honesty law): the earlier entry called Ardour's official binary "paywalled" — that was wrong. Ardour is GPL free software; the only fee anywhere is ardour.org's charge for its own optional ready-to-run binaries. Distro packages, the Flathub Flatpak and source builds are fully free — this install used the distro package, and no mirror or crack was needed or used |
| LMMS 1.2.2 | OSS (GPL-2.0) | Music desk: compose/produce extensions of the owner's title track + stems | VM | **INSTALLED + VERIFIED**: `LMMS 1.2.2 (Linux x86_64, Qt 5.9.7)` (AppImage, run with --allowroot on this VM) |
| MuseScore Studio 4.7.6 | OSS (GPL-3.0) | Music desk: notation, score/lead-sheet work for the season's music | VM (Xvfb :99) + owner | **INSTALLED + VERIFIED HEADLESS under the virtual display**: `xvfb-run-muse ~/opt/tools/appimages/MuseScore-Studio-4.7.6-x86_64.AppImage --appimage-extract-and-run --version` → `MuseScore4 4.7.6`; real conversion jobs both exit 0 — MusicXML → WAV (1,764,046 B; pcm_f32le, 44.1kHz stereo, 5.0s) and MusicXML → PDF (15,932 B, 1 page). That xvfb-run-muse route is the standard headless command here. The `QT_QPA_PLATFORM=offscreen` route was tested and FAILS on this AppImage build — it hard-selects the xcb plugin (`qt.qpa.xcb: could not connect to display`, abort exit 134) — do not use offscreen for MuseScore on this box. Software vs service: the MuseScore application is GPL-3.0 free software; musescore.com subscriptions are a separate optional service, not required for any of this |
| Chatterbox (chatterbox-tts 0.1.7) | OSS (MIT, code + weights) | Voice Cast desk: the owner's voice-pipe engine — cloned human voices for Mochiko/Hex/Aeon from owner-chosen references (VOICE-SCRATCH law: scratch until the owner casts) | VM (CPU) / GPU | **INSTALLED + VERIFIED, WEIGHTS PRE-CACHED** (owner order: no first-use pulls): exactly the 5 files `ChatterboxTTS.from_pretrained` requests, pulled from HF ResembleAI/chatterbox into HF_HOME=~/opt/hf-cache — ve.safetensors (5,695,784 B), t3_cfg.safetensors (2,129,653,744 B), s3gen.safetensors (1,056,484,620 B), tokenizer.json (25,470 B), conds.pt (107,374 B); set total 3,191,966,992 B. Verified with a real CPU smoke render: model loaded from cache, one line generated in 83.3s on 2 vCPU → 43,200 samples @ 24,000 Hz = 1.8s WAV. Two venv fixes were needed and are now in: resemble-perth 1.0.1 (the watermarker chatterbox instantiates at load) + setuptools<81 (80.10.2 — perth imports the removed-in-81+ `pkg_resources`). HF pulls need the sanitized no_proxy noted in the Kokoro row |
| Kokoro (kokoro 0.9.4) | OSS (Apache-2.0, code + weights) | Scratch voices for animatics/timing only | VM (CPU) | **INSTALLED + VERIFIED, WEIGHTS PRE-CACHED** (owner order: no first-use pulls): hexgrad/Kokoro-82M files in HF_HOME=~/opt/hf-cache — kokoro-v1_0.pth (327,212,226 B), config.json (2,351 B), voices af_heart / af_bella / am_adam / am_michael / bf_emma / bm_george (~0.52MB each). Verified with a real render: `KPipeline(lang_code='a', voice='af_heart')` spoke a test line → 90,000 samples @ 24,000 Hz = 3.75s WAV. Notes: the pip package loads the PyTorch checkpoint from that repo (that is the layout it expects); its first pipeline init also pulled the spacy en-core-web-sm model into the venv — now cached too. HF pulls on this box need a sanitized no_proxy (the runtime's bracketed-IPv6 entries break httpx): `export no_proxy=localhost,127.0.0.1` |
| Rhubarb 1.13.0 | OSS (MIT) | Lip-sync timing (humans only by law) | VM | INSTALLED ~/opt/bin/rhubarb, runs |
| ComfyUI + Wan 2.2 | OSS (GPL-3.0 / Apache-2.0) | Generative passes (triple-lock likeness stack) — avatar-stack bundles, plates | **Kaggle GPU** | ENDPOINT PROVEN LIVE 2026-10-27: notebook kaggle.com/code/marsfmmg/mochiichao-comfyui-wan — 2× Tesla T4, ComfyUI v0.43.0, Wan 2.2 staged (~18GB), headless API 200. Quota after run ~21h56m of 30h |
| RIFE (ComfyUI node) | OSS | In-Between Animation ASSIST on the Kaggle endpoint only — interpolation can smear held anime timing, so gated assist, never the douga pass itself | Kaggle | DOCUMENTED as a Kaggle-side workflow node (CREDITS-TO-TOOLS §2/§4); no local install |
| DaVinci Resolve (free tier) | Free proprietary | Editing / colour / Fusion comp / Fairlight — eligible under the free umbrella as an alternate edit+grade seat | owner | **OWNER-MACHINE, NOT INSTALLED HERE**: (1) download is registration-gated through Blackmagic's support API (their API reports latest Linux = 21.1.2); (2) its .run installer installs system-wide, breaking the ~/opt portable rule; (3) Resolve on Linux requires a GPU + display and does not run in this GPU-less headless VM |
| KIT Scenarist 0.7.2.rc12 | OSS (GPL) | Screenplay editor (optional comfort; the house Markdown/Fountain → build_manifest route already fills the role) | — | **SKIPPED**: its GitHub release publishes no Linux binary assets and no official portable Linux build was found. Trelby: skipped-legacy (aging codebase, not attempted) |
| Docker Engine 29.1.3 + Compose v2 2.40.3 | OSS (Apache-2.0) | Container runtime (Kitsu stack host; general service sandboxing) | VM (installed; containers blocked — see Kitsu row) | **INSTALLED via the distro channel** (docker.io 29.1.3-0ubuntu3~24.04.2 + docker-compose-v2 2.40.3+ds1-0ubuntu1~24.04.1, Ubuntu noble) — the one system-wide dpkg install in this manifest, on the owner's order (a daemon cannot live in ~/opt). Verified: `docker --version` → `Docker version 29.1.3, build 29.1.3-0ubuntu3~24.04.2`; `docker compose version` → `Docker Compose version 2.40.3+ds1-0ubuntu1~24.04.1`. Daemon is LEFT STOPPED (docker.service reset-failed, no restart loop): it cannot create containers in this cell — evidence in the Kitsu row |
| Kitsu (CGWire) | OSS (AGPL-3.0) | Production Desk / Assistant Director desk (assignment + review loops) | — (blocked on this VM; seat = owner machine / a capability-full VM) | **STAGED, CANNOT RUN ON THIS VM** (assessed 2026-10-27): official cgwire/kitsu-docker cloned to ~/opt/kitsu — note the current upstream ships a single all-in-one image (cgwire/cgwire: Zou + Kitsu + PostgreSQL under supervisord, `docker run -p 80:80 -p 1080:1080`); no compose file ships in the repo, so compose-config validation is N/A rather than faked. The stack was NOT started, because containers cannot execute in this runtime cell: default daemon start fails creating the iptables NAT chain (`Permission denied` — no CAP_NET_ADMIN) and overlay2 mounts are denied; a degraded manual daemon (`dockerd --iptables=false --ip6tables=false --bridge=none --storage-driver=vfs`, data root /var/lib/docker) does start and pulls images through the egress proxy, but runc container creation fails: `unable to join session keyring: operation not permitted`. FULLSTACK-WIRING deferral stands regardless (revisit = a second regular human); git + manifests + episode_gate cover the desk roles until then |
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
stop being scratch; (3) DaVinci Resolve lives on the owner's
machine (GPU/display), per the table. MuseScore + Krita GUI seats
now run HERE under the Xvfb virtual display (:99), and Kitsu's
seat is any capability-full host — this cell's sandbox denies the
container capabilities (see the Kitsu row).
