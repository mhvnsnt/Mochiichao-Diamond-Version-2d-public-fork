# ANIMATION TOOLS — agent-driveable rigs & scene tools (wired 2026-10-27)

Owner directive: wire the AI-agent-usable animation stack 100% into
the pipeline so episodes are built on REAL rigs and editable scenes
(characters stay on-model), with generative art feeding the rig
step — not black-box video alone. Verified 2026-10-27 (repos/PyPI
checked live; maturity labelled honestly).

## The rig chain (how a character gets animated here)
1. ART: GridConnector / Flux.2 Klein / PixelLab-style generation
   (INTEGRATIONS-MAP S1/S2) → flat PNG (single) or layered PSD.
2. RIG (flat PNG): **TextRig MCP** — agent cuts the PNG into pieces,
   places bones, keyframes, renders, visually checks, iterates.
   Output: DragonBones (_ske.json + _tex.json + _tex.png).
   Repo: blackoutbuild/textrig (MIT). MATURITY: young project
   (small community) — wired as the flat-PNG bridge, every output
   still passes the likeness + anim gates; not a silent dependency.
3. RIG (layered): **Rigby2D** — AutoRig from layered PSDs (bones,
   weighted meshes, IK), dopesheet/graph editor, pose library, face
   controls, film workspace (animatable camera, audio tracks,
   Whisper lip-sync), exports skeleton JSON / .skel + atlas, JS
   runtime for Pixi playback. Repo: jaisurya-dev-art/rigby2d
   (Apache-2.0, active). MATURITY: the strongest of the three —
   primary rig editor for layered work. Its pose library is where
   POSING-SYSTEM PRESENT poses get built.
4. ANIMATE: agents drive rigs via the MCP tools (bones/keys/easing,
   batch edits, retarget, lip-sync) against the episode manifest;
   Tahoma2D remains the puppet fallback + house rig standard for
   hand-built puppets (FULLSTACK-WIRING).
5. SCENES: **OpenToonz MCP** (PyPI opentoonz-mcp 0.1.0, ALPHA) drives
   OpenToonz for full shots — xsheet timing, camera, parallax,
   editable .tnz scenes. Requires an OpenToonz install on the
   driving machine (owner's machine for the GUI-coupled parts);
   the MCP server itself is installed in this pipeline's venv and
   starts clean. Treat as alpha: scenes stay editable, renders go
   through the same gates.
6. PLAYBACK/EXPORT: DragonBones + spine-pixi / Rigby JS runtime in
   Pixi (game + show viewer); PNG sequences/WebM-alpha/MP4 to the
   composite stage (UNIFIED-PIPELINE).

## Complementary (evaluated, wired where they fit)
- Spine MCP variants: industry format; editable .spine needs the
  licensed Spine CLI — JSON/atlas consumption is free. WATCH list.
- Anymotion / Remotion / HyperFrames: code-driven composition —
  titles, packaging, episode assembly assists. NEXT phase.
- Stretchy Studio: browser mesh-deform + AutoRig, Spine JSON out —
  alternate flat-image rigger if TextRig stalls. WATCH list.
- PixiJS MCP / Lottie / Rive MCP: in-engine tweaks + UI motion —
  game-side (INTEGRATIONS-MAP), not episode-critical.

## Construction-kit note
All tools above are open-source or MCP-native and process ONLY the
owner's original material in this pipeline. Licences recorded per
tool in tooling/TOOLS-MANIFEST.md.
