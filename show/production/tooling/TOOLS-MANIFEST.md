# TOOLS MANIFEST — what's wired, where it runs, verified status

Updated 2026-10-27 (owner: "wire them up 100%… let me know when
done so we can start using it on the episode"). Machine facts:
this build VM = 2 vCPU / 7.7GB / no GPU / FFmpeg 8.1.2 / Python
3.12 / Node 24. Install discipline: no-sudo, ~/opt + venvs;
TMPDIR/PIP_CACHE on the home volume (/tmp is a 512MB tmpfs —
pip installs FAIL there without the redirect; learned live).

| Tool | Role in pipeline | Runs | Status |
|---|---|---|---|
| FFmpeg 8.1.2 | composite/audio/finish spine | here | WIRED (beds, animatic, proofs built with it) |
| build_manifest.py | script+boards+cue → episode manifest | here | WIRED (ambient_layers v1) |
| episode_gate.py | one-shot readiness across all gates | here | WIRED (EP01: 5/5 audio PASS, HALT 12 by design) |
| scene_audio_bed.py | per-scene audio beds + loudness gate | here | WIRED |
| sfx_pull.py | Freesound CC0 pulls closing SFX gaps | here | WIRED — needs owner's free Freesound API key to pull |
| Rigby2D (Apache-2.0) | layered rigs, pose library, film workspace | here (editor) + owner | CLONED ~/opt/tools/rigby2d; MCP entry in tooling/mcp/mcp-servers.json |
| TextRig MCP (MIT) | flat PNG → DragonBones rigs | here | INSTALLING (./install.sh inspected, then run; venv + u2net + chromium) |
| OpenToonz MCP (0.1.0a) | episode shots/.tnz scenes | here (server) + owner (OpenToonz) | INSTALLED in ~/opt/venvs-mcp; starts clean |
| OpenToonz 1.8 / Tahoma2D 1.6 | puppet production + shots | owner machine | WIRED as standard (rig standard doc); GUI-coupled |
| Rhubarb 1.13.0 | lip-sync timing (humans only by law) | here | INSTALLED ~/opt/bin/rhubarb, runs |
| git-lfs 3.5.1 | media versioning when media repo lands | here | INSTALLED ~/opt/bin/git-lfs |
| Blender 4.5 LTS | scriptable camera / GP | owner machine | SPECIFIED (FULLSTACK-WIRING) |
| Natron 2.5 | node composite (OCIO) | owner machine fallback | SPECIFIED (maintenance-mode appliance) |
| ComfyUI + Wan 2.2 | generative passes (triple-lock) | GPU endpoint (owner decision open) | SPECIFIED — endpoint is the open owner action |
| Chatterbox / Kokoro | human TTS / scratch voices | here (CPU scratch) / GPU | SPECIFIED (voice-pipe is owner's own) |
| EbSynth | — | — | DEMOTED (browser freemium; see FULLSTACK-WIRING §0) |

Unopened owner actions (everything else is wired): (1) Freesound
API key for sfx_pull; (2) GPU endpoint choice for diffusion;
(3) Mochiko voice casting (script-level open item, unrelated to
tooling). Picture production unblocks on (2) + the video service.
