# UNIFIED EPISODE BUILD — Research Draft

**Status:** DRAFT for Jamar's review. Nothing here is locked canon yet.
**Date:** 2026-10-27
**Directive it answers (Jamar, 2026-10-27):** episodes get built in ONE
continuous flow — research, environments, character animation (2D puppets +
generative AI as co-author), FX, camera moves, post-production, and audio
attached per scene — not in siloed separate phases. Real production-studio
tooling (already in his repos) combined with generative AI, using the best
open-source / industry-standard / current tooling available.

**The one-sentence design:** a manifest-driven `episode_build` run walks the
locked shooting script scene by scene; for each scene it pulls the board,
assembles puppet + generative passes, composites with camera/FX, attaches
that scene's audio (cries, voice, SFX, music stem) immediately, renders a
scene master, and runs the gate checks — then moves to the next scene. The
episode master is a concat + loudness pass over scene masters, not a
separate post phase.

**His existing tooling this wires together (already in his repos):**
TRIPPEDD-Animation-Studio (`render_shot.py` shot pipeline, −14 LUFS finish),
cape-jones ANIM-GATE, the Tahoma2D puppet standard + rig builds in the show
repo, pocket-studio (phone timeline editor → ffmpeg `build.py`),
wizard-gang-voice-pipe (Chatterbox TTS), video-fix-tools (AI-video → 2D
cartoon fixing). The research below fills the gaps around those, it does not
replace them.

---

## 1. Likeness & style consistency for generative work (the hard problem)

This is the area that already bit us once: the glossy-3D batch was rejected
(Gabu → Blastoise, Sproutle → Bulbasaur-with-visor, Mochii → generic slime).
The 2026 consensus from production write-ups is that consistency is a
**stack of three orthogonal controls**, not a prompt trick:

| Layer | Tool | What it locks | Control strength |
|---|---|---|---|
| Structure | **ControlNet** (canny / depth / pose / lineart) | Pose, composition, silhouette | Strongest |
| Identity + style | **LoRA** trained on the character's own art | Who it is, how it's drawn | Strong |
| Reference nudge | **IP-Adapter / FaceID** | Face/detail drift across lighting changes | Weakest, zero training |

Engineering rule from the write-ups: *fix structure first (ControlNet),
then identity (LoRA), then mood last (prompt + IP-Adapter)* — route each
kind of control to its own channel instead of cramming everything into the
text prompt. Sources: [Image Generation Engineering](https://hub.cissychen.com/super-individual/image-gen-day47.en.html);
[ComfyUI consistency guide (Apatero, 2026)](https://apatero.com/blog/comfyui-character-consistency-advanced-workflows-2026);
[LoRA + ControlNet + IPAdapter in production (dev.to)](https://dev.to/rashid_inmarketing_19a21d/maintaining-character-consistency-in-comfyui-lora-controlnet-ipadapter-5883).

### 1a. Two LoRA tracks — use both

- **Image LoRA (keyframes):** train a per-character LoRA on a still-image
  model (FLUX-class). Used to generate/lock the *first frame* of every
  generative shot — the first frame is the strongest condition a video
  model attends to, which is why image-to-video beats text-to-video for
  identity. Then feed that frame to the video model. (Pattern documented
  in [this step-by-step](https://www.youtube.com/watch?v=dp9fWSi7bQg):
  image LoRA → still → Wan 2.2 I2V; their working settings: rank 16,
  lr 5e-5, ~1,000 steps, LoRA used at strength ~0.35–0.8.)
- **Video LoRA (motion-native):** train directly on the video model so
  identity survives motion, not just frame 1. The standard trainer for
  Wan 2.2 / HunyuanVideo is **musubi-tuner** (kohya-ss); **ai-toolkit**
  and **diffusion-pipe** are the other established trainers. Working
  numbers from current guides: rank 16 is the common default for
  character LoRAs (rank 32 in ai-toolkit configs), a few dozen images of
  the character is a workable dataset, image-based training fits in
  ~12 GB VRAM, video training wants 24 GB+. Sources:
  [Best open-source video stack 2026](https://builderai.tools/blog/best-open-source-video-generation-stack-2026);
  [Wan 2.2 LoRA training guide](https://wan27.org/blog/wan-2-2-lora-training-guide).

### 1b. Reference-to-video (no training) — the second lock

- **Phantom-Wan** (ByteDance, built on Wan 2.1; 1.3B and 14B): takes 1–4
  reference images + prompt and generates subject-consistent video,
  including multi-subject shots — the closest open equivalent to the
  "consistent character" features closed platforms sell. Its evaluation
  method is also our gate template: sample frames, score subject
  consistency with CLIP/DINO similarity against the reference. Sources:
  [Phantom paper (ICCV 2025)](https://arxiv.org/html/2502.11079);
  [Phantom-Data paper](https://arxiv.org/pdf/2506.18851).
- **Wan VACE** (1.3B / 14B): all-in-one creation/editing layer over Wan —
  subject replacement from reference images, first-and-last-frame control,
  in-video object modification, outpainting. First/last-frame control is
  how shots hand off to each other and how a camera move gets bounded.
  Source: [ComfyUI VACE reference-to-video workflow](https://comfy.org/workflows/video_wan_vace_14B_ref2v-83ff3768d42b/).
- **Wan Animate / S2V:** motion + expression transfer onto a character,
  and audio-driven video — the route for acting a puppet-boarded pose
  sequence out generatively when a shot needs it.

### 1c. The Mochiichao recipe (proposed)

1. **Canon source = the title cutouts** (already pulled to
   `~/workspace/mochiichao-show/canon-cutouts/`), expanded per character
   into a training set from repo art (model sheet views, garden poses,
   animation frames) — never text-invented likenesses (Likeness Law).
2. Train **one LoRA per pilot character** (image track first — cheaper —
   then a Wan 2.2 video LoRA for the characters who carry episodes).
3. Train **one show STYLE LoRA** on flattened, approved frames so every
   generative pass gets pulled toward the flat 2D look (see §3d).
4. Every generative shot runs the triple-lock: board/pose → ControlNet,
   character LoRA + style LoRA on, canon cutout → IP-Adapter/Phantom
   reference.
5. **Likeness gate is automated, not vibes:** sampled frames scored with
   DINO/CLIP similarity vs the canon cutout (the Phantom eval method) +
   the existing frame-checked ANIM-GATE. Below threshold = reroll or
   route the shot to the puppet track. Never presented as production
   until it passes.

**Honest limit (sourced):** even with all three layers stacked, working
pipelines report ~10–15% of outputs needing a reroll or manual touch-up,
hands and complex poses first. Budget the revision pass; don't promise
first-generation perfection. Source: [dev.to production write-up](https://dev.to/rashid_inmarketing_19a21d/maintaining-character-consistency-in-comfyui-lora-controlnet-ipadapter-5883).

---

## 2. Open-source 2D production (the puppet track)

| Tool | Current state (researched 2026-10-27) | Role in the build |
|---|---|---|
| **Tahoma2D 1.6** | Active fork of OpenToonz; 1.6 adds brush tips, column alpha lock, loop frames, OCA import, refactored Preproduction Board, and a **Rhubarb Recognizer** option (automatic lip-sync analysis). Plastic tool = mesh + skeleton deformation of a single drawing — the cutout-puppet engine. Sources: [What's New in Tahoma 1.6](https://tahoma2d.readthedocs.io/en/latest/whats_new.html); [Plastic tool docs](https://tahoma2d.readthedocs.io/en/latest/create_animations_using_plastic_tool.html) | **Puppet home.** Rig assembly, symbol mouth/eye/hand frames, scene animation on the puppet track, Rhubarb-driven visemes for human dialogue. |
| **OpenToonz 1.8.0** | Released 19 June 2026 — first stable upstream release in ~3 years (stroke replication, screentones, OCA import). Linux via Flatpak/AppImage/Snap or source; upstream ships no official Linux binary. Source: [OpenToonz on Linux guide](https://www.linuxfordevices.com/tutorials/how-to-install-opentoonz-on-linux) | Upstream reference / fallback; Tahoma2D already ports its fixes, so no separate install needed unless a 1.8 feature is wanted early. |
| **Blender 5.x (Grease Pencil)** | Blender 5.0 (Nov 2025) expanded Grease Pencil: pen tool for Bézier curves, motion blur, improved stroke joining, sketch-to-3D-view combining; 5.2 LTS is the current LTS line. Full Python API (`bpy`) = scriptable headless renders. Sources: [Blender 5.0 coverage](https://en.ubunlog.com/Blender-5.0-New-Features-HDR-Rendering/); [CG Channel Grease Pencil tag](https://www.cgchannel.com/tag/grease-pencil/) | Camera moves in real 3D space over 2D art (the DBZ/JoJo push-ins, pans, parallax), environment builds, FX elements, and a scriptable compositor. This is the natural home for "camera work" as data instead of prompt text. |
| **Krita 5.3.4** | Released ~Sept 2026 (5.3.2.1 was 2 June 2026); 6.0.x Qt6 branch is experimental. Animation workspace: timeline, onion skin, audio track, video/sequence export; full Python API. Source: [Krita 5.3.4 release post](https://krita.org/en/posts/2026/krita-5.3.4-released/) | Painting: background plates, model-sheet paint, EbSynth keyframe paint-overs (§3d), board cleanup. |

**Division of labour:** Tahoma2D animates characters; Blender owns camera +
environments + composite for generative/FX-heavy scenes; Krita paints.
All three read/write PNG sequences, which is the interchange format the
build script passes between stages (same convention as TRIPPEDD's shot
pipeline).

---

## 3. AI video tooling & workflows (the generative track)

### 3a. Runtime: ComfyUI, driven headless

ComfyUI is the workflow runtime; the GUI is only for designing graphs.
Every graph exports as API-format JSON and runs headless: `POST /prompt`
(queue, returns `prompt_id`) → WebSocket `/ws` or `GET /history/{id}` for
progress/results → `GET /view` for outputs; `POST /upload/image` for
inputs. That is exactly the interface an episode-build script needs: patch
prompt/seed/LoRA/first-frame fields per scene, submit, collect. Caveats:
no built-in auth (bind to localhost or put it behind a proxy), outputs are
files on disk referenced by name. Sources:
[ComfyUI API developer guide](https://www.runflow.io/blog/comfyui-api-developer-guide);
[ComfyUI API endpoints reference](https://www.runflow.io/blog/comfyui-api-endpoints).

### 3b. Video models (open weights)

| Model | Facts | Use |
|---|---|---|
| **Wan 2.2** (Alibaba, Apache-2.0) | I2V/T2V; 14B MoE needs ~80 GB at full precision, GGUF quants bring it to ~24 GB (Q8, 720p, 5–10 s clips, ~6–10 min per 5 s on an RTX 4090); 5B variant fits 24 GB cards. LoRA/VACE/Phantom ecosystem is the widest of any open model. Sources: [ComfyUI setup guide](https://localaimaster.com/blog/comfyui-complete-guide); [video stack roundup](https://builderai.tools/blog/best-open-source-video-generation-stack-2026) | **Primary generative engine** — the one the LoRAs in §1 get trained for. |
| **HunyuanVideo 1.5** (Tencent) | 8.3B, native ComfyUI support since Nov 2025, native 720p + bundled distilled super-resolution model to 1080p; runs on a single 24 GB GPU. Source: [ComfyUI docs — HunyuanVideo 1.5](https://docs.comfy.org/tutorials/video/hunyuan/hunyuan-video-1.5) | Quality alternate engine; same triple-lock pattern applies. |
| **LTX-2 / LTX-2.5** (Lightricks) | Fast/distilled variants, native audio in the 2.5 line; suited to rapid draft passes. Source: [video stack roundup](https://builderai.tools/blog/best-open-source-video-generation-stack-2026) | Cheap animatic-motion drafts before committing a Wan render. (Verify exact version/license at wiring time — this family's licensing is revenue-tiered.) |

Closed/hosted frontier models (Veo, Kling, Seedance, Runway, Luma) exist
as API fallbacks via aggregators (fal, Replicate) — usable for a hero shot
in a pinch, but they can't load his LoRAs, so they can never be the
likeness backbone. Note only; not part of the core design.

### 3c. Finishing passes on generated frames

- **Frame interpolation — RIFE** (MIT, via `ComfyUI-Frame-Interpolation`)
  and **FILM**: 24 → 48/60 fps. For this show, use *selectively*: limited
  animation on 2s is the house style, and interpolating everything melts
  the held-frame energy into glide. Reserve for camera-move shots and
  slow pushes. Sources: [RIFE in a production short](https://blog.getrealpha.com/en/blog/mio-daily-ai-short-film/);
  [enhancement roundup](https://www.forasoft.com/blog/article/ai-video-enhancement-tools).
- **Upscaling:** **Real-CUGAN** (anime-tuned, beats Real-ESRGAN on 2D in
  blind tests) or **Real-ESRGAN** (BSD-3) frame-wise via Video2X;
  diffusion restorers (**SeedVR2**, Apache-2.0; **FlashVSR**, Apache-2.0)
  are better but H100-class — hosted-only (§6). Sources:
  [Video2X tutorial](https://unifab.ai/resource/video2x-tutorial);
  [enhancement roundup](https://www.forasoft.com/blog/article/ai-video-enhancement-tools).
- **Matting / rotoscope — SAM 2** (Meta, Apache-2.0) for prompt-once,
  track-through-video segmentation; the production wrapper is
  **Sammie-Roto 2** (open source): SAM 2 segmentation + **MatAnyone /
  MatAnyone 2** video matting (soft alpha — what smoke, wisps and
  translucent FX need) + object removal (ProPainterX / MiniMax-Remover).
  This is how a generated character gets lifted off a generated plate so
  the composite stage can re-layer it over the real background with the
  real camera move. Sources: [Sammie-Roto 2 README](https://github.com/Zarxrax/Sammie-Roto-2/blob/main/README.md);
  [SAM 2 in ComfyUI](https://www.stablediffusiontutorials.com/2024/09/segment-anything-model.html).

### 3d. Flattening 3D-looking AI output back to flat 2D (the video-fix lane)

His video-fix-tools repo exists for exactly this; the researched methods,
strongest first:

1. **EbSynth 2** (Secret Weapons): paint the corrected flat look onto one
   or a few keyframes (in Krita, from canon art) and it propagates that
   exact look across the shot by texture synthesis — *not* generative, so
   it preserves the keyframe at pixel level and cannot invent a
   Blastoise. Used in production on *Apollo 10½* and *Wednesday*. This is
   the single most on-brief tool for "make the AI shot match my art."
   Source: [CG Channel — EbSynth 2](https://www.cgchannel.com/2025/10/ebsynth-2-can-turn-video-into-animation-without-using-ai/).
2. **Low-denoise video-to-video pass** in ComfyUI (AnimateDiff /
   TokenFlow-class style transfer + lineart ControlNet + the style LoRA
   from §1c) — re-draws the shot in the house style while the source
   frames pin the motion. Source: [video editing/remixing matrix](https://llmbook.icsgen-ai.org/part-5-multimodal-llms/module-20-audio-music-generation/section-20.9.html).
3. **Composite-stage flatteners** (cheap, deterministic): posterize /
   palette-quantize to the show's sampled palette, line extraction overlay
   from the source art, grain/halation removal — in Natron or ffmpeg.
   These run in the VM today with no GPU.

---

## 4. Post-production (runs inside the scene pass, not after it)

- **Spine: FFmpeg.** Scene assembly, composite renders, concat, encodes —
  the same role pocket-studio's `build.py` and TRIPPEDD's pipeline already
  give it. Every stage below is an ffmpeg step the build script calls.
- **Loudness: two-pass `loudnorm`, −14 LUFS integrated / −1 dBTP.**
  Pass 1 measures (`print_format=json`), pass 2 applies the measured
  values in linear mode. −14 LUFS / −1 dBTP is the YouTube and Spotify
  target; keep a −23 LUFS / −1 dBTP (EBU R128) variant flag in the build
  for any broadcast deliverable. TRIPPEDD's finish already targets
  −14 LUFS, so this standardises what he already does. Batch helper:
  `ffmpeg-normalize`. Sources:
  [loudnorm walkthrough](https://andreas.mieke.at/blog/20230824---loudness-normalization-with-ffmpeg/);
  [FFmpeg normalization guide](https://dev.to/javidjamae/how-to-normalize-audio-with-ffmpeg-volume-loudnorm-and-api-11cb).
  Note: `loudnorm` upsamples internally — resample back to 48 kHz for
  video sync in the same command.
- **Colour management:** pick ONE pipeline and tag everything. Working
  space: linear/ACES via **OpenColorIO** in **Natron** (32-bit float,
  OpenFX, OCIO colour management, and — critical for orchestration —
  a headless command-line render mode with human-editable XML project
  files, so the build script can generate composite graphs). Delivery:
  BT.709-tagged H.264 (CRF ~16 master / ~21 web copy, `yuv420p`,
  `+faststart`), exactly the encode discipline in the reference pipeline
  write-up. Sources: [Natron feature set](https://nzt-eth.ipns.dweb.link/wiki/Natron_(software).html);
  [motion-reel pipeline write-up](https://www.promptatelier.uk/tutorial-claude-motion-reel.html).
- **FX/camera in composite:** pans/zooms/push-ins are keyframed transforms
  on layered plates (Natron or Blender), driven by the storyboard plan's
  cut list — deterministic and re-renderable, unlike prompting a video
  model for "slow zoom" and taking what it gives you. Generative camera
  moves (VACE first/last frame) are the exception path, not the default.

---

## 5. Audio (attached per scene, during the scene build)

**Scope note (Voice Law):** creatures never speak words — their audio is
the repo's ~100 species cry files plus designed vocalisation SFX. TTS
below is for *human* characters only (Mochiko etc.), whose casting is
still an open item; until casting is decided, TTS = scratch/animatic
voices, clearly labelled as such.

| Need | Tool | License / facts |
|---|---|---|
| Human voices (house engine) | **Chatterbox** (Resemble AI) — already wired in wizard-gang-voice-pipe | MIT (code + weights) — the commercial-safe cloning pick; zero-shot clone from ~5 s of reference; preferred over ElevenLabs by 63.75% of listeners in Resemble's own blind test. Source: [voice cloning guide 2026](https://www.forasoft.com/blog/article/voice-cloning-synthesis) |
| Scratch / animatic voices | **Kokoro-82M** | Apache-2.0, 82M params, runs on CPU (~2–3 GB), 54 preset voices, no cloning. Fast enough to voice a whole animatic while boards are being approved. Source: [local TTS roundup](https://localaimaster.com/blog/best-local-tts-models) |
| Second permissive clone option | **Qwen3-TTS** (Alibaba, Jan 2026) | Apache-2.0, 0.6B/1.7B, clones from a 3 s sample. Source: [open TTS comparison](https://builderai.tools/blog/open-weight-text-to-speech-models-2026) |
| **Avoid for shipped episodes** | F5-TTS (weights CC-BY-NC), XTTS v2 (Coqui CPML, non-commercial, and Coqui is defunct so no license can be bought), Fish Speech S1-mini (CC-BY-NC-SA) | Fine for private experiments; their weights bar commercial use. Source: [licensing comparison](https://builderai.tools/blog/open-weight-text-to-speech-models-2026) |
| Lip-sync (puppet track) | **Rhubarb Lip Sync** — built into Tahoma2D 1.6 as the Rhubarb Recognizer | Analyses the attached voice track and places viseme frames — this is why audio attaches *before* final puppet animation, not after. (Video-face lip-sync tools like LatentSync/MuseTalk are for realistic footage; not needed on either track here.) |
| SFX / foley | **Freesound** filtered to **CC0** (~381k CC0 sounds of ~730k total; check each file — licenses are per-sound CC0/CC-BY/NC); **Sonniss GDC Game Audio Bundles** (annual, royalty-free, 200 GB+ across years, no attribution); **Kenney** audio packs (CC0); **Pixabay SFX** (Pixabay Content License, no attribution); **OpenGameArt** (per-item, filter CC0) | Source: [free SFX/music license reference](http://app.cinevva.com/guides/free-sound-effects-music) |
| **Avoid** | **BBC Sound Effects** — RemArc license = personal/educational/research only, **not** commercial | Same source as above. Fine to audition against, never in a shipped mix. |
| Music | Repo's own title track + mixer stems; episode cues per the locked cue sheet | Already in-repo; no library needed for EP01. |

**Per-scene audio assembly:** the build reads the scene's cue-sheet rows,
lays cry/voice/SFX/music onto the scene timeline at board timings
(ffmpeg `adelay`/`amix` or the pocket-studio timeline format), and the
scene does not pass the gate until its mixed stem exists and measures
within loudness tolerance of the episode target.

---

## 6. Orchestration — the unified episode build

### 6a. Inputs (all already exist for EP01)

- Locked shooting script (house format: VISUAL/ACTION/DIALOGUE/SFX/MUSIC
  blocks, hex-specified props) → parsed into a **scene manifest**
  (`episode.json`: per scene — location, cast, beats, cut list, durations).
- Storyboard plan (28 cuts with seconds) → per-cut rows in the manifest.
- Cue sheet → per-scene audio rows in the manifest.
- Canon assets: cast.json / parts-catalog.json / clip-index.json, model
  sheets, canon cutouts, rig builds, cry files.

### 6b. The build — one pass per scene

1. **Manifest compile.** Script + board plan + cue sheet → `episode.json`.
   Open items in the script HALT the build for that scene (house law:
   TBDs are never silently filled).
2. **Board lock check.** Scene's board frames exist and match the cut
   list (durations in seconds, e-konte discipline). No board = no build.
3. **Environment pull.** Location plates from the parts catalog
   (gate/pond/green exist; Dark Forest is a MAKE item). Missing plate →
   generate via the background workflow (accepted Garden Gate plate is
   the style anchor), gate it, catalogue it — once, reused forever.
4. **Voice/cries first.** Human lines via Chatterbox (scratch: Kokoro),
   creature cries placed from repo files; Rhubarb analysis produces the
   viseme timing the puppet pass animates to. *Audio leads, picture
   follows* — the dialogue-first pipeline from his own donor research.
5. **Character passes, per cut, routed by the manifest:**
   - *Puppet route (default):* Tahoma2D scene with the character's rig,
     animated to the board + viseme timings; headless render to PNG
     sequence.
   - *Generative route (flagged cuts only):* ComfyUI API call — board
     frame as first frame + ControlNet pose, character LoRA + style LoRA,
     canon cutout as Phantom/IP-Adapter reference → clip → SAM 2 /
     MatAnyone matte → EbSynth flatten pass if it drifts glossy.
   - *Hybrid:* puppet body + generative FX element (smoke, glow, water),
     or generative body re-flattened via EbSynth — decided per cut in the
     manifest, not improvised mid-build.
6. **Composite + camera + FX.** Layers into Natron (script-generated XML
   graph) or Blender for true-3D camera moves: BG plate, character
   passes, FX, then the board's camera move as keyframes. Render scene
   composite as PNG sequence → ffmpeg.
7. **Audio attach (same pass).** Scene stem mixed from step 4 outputs +
   cue-sheet SFX/music at board timings; muxed to the scene render
   immediately. A scene is not "done" picture-only.
8. **Gate (per scene).** ANIM-GATE frame-check (motion is real, holds are
   chosen), likeness score vs canon cutout (generative cuts), subtitle-law
   check (intertitles only at the scripted moments), loudness spot-check.
   Fails loop back to step 5/6 for that scene only — the rest of the
   episode keeps its state (per-scene resumability, TRIPPEDD-style).
9. **Scene master written** to `show/episodes/EP##/scenes/SC##/` with a
   build log (tools, versions, seeds, LoRA strengths — reproducibility).
10. **Episode finish (thin, because scenes arrive finished):** concat
    scene masters → two-pass loudnorm to −14 LUFS / −1 dBTP → BT.709
    H.264 master + web copy → poster/contact sheet → clip-index.json
    updated with honest `quality_status` per cut.

### 6c. What runs where (this VM has no GPU)

| Step | In this Linux VM (CPU) | Needs a GPU box or hosted service |
|---|---|---|
| Manifest compile, build script, gates (DINO/CLIP scoring is CPU-slow but workable on sampled frames) | ✅ | |
| ffmpeg everything: assembly, audio mix, loudnorm, encodes | ✅ | |
| Kokoro scratch TTS; Chatterbox (slow on CPU — batch it) | ✅ (slow) | Faster on any small GPU |
| Tahoma2D / Krita / Natron headless renders; Blender CPU renders (Eevee wants a GPU; Cycles CPU works, slowly) | ✅ (slow for Blender) | |
| EbSynth propagation | ✅ (CPU tool) | |
| SAM 2 / MatAnyone matting | ⚠️ CPU possible, painfully slow on long clips | ✅ recommended |
| ComfyUI: Wan 2.2 / HunyuanVideo 1.5 generation, LoRA training (musubi-tuner/ai-toolkit), RIFE, Real-CUGAN, SeedVR2 | ❌ | ✅ **required** |
| Frontier hosted video (Veo/Kling/etc. via fal/Replicate), Topaz | ❌ | Hosted-only, and can't take his LoRAs |

**GPU access patterns that fit:** (a) a ComfyUI server on any GPU machine
he controls, reached over the API in §3a — the build script doesn't care
where it lives; (b) hosted ComfyUI (e.g. Comfy Cloud API — noted on
ComfyUI's own workflow pages as plan/API-key based — or RunComfy-style
hosted workflows); (c) per-job GPU rental (RunPod-class) for LoRA training
runs, which are one-off per character, not per episode. The episode build
itself stays a CPU-side script that *calls* the GPU only for steps 5
(generative route) and the matting in 5/6.

### 6d. Wire now / wire later / hosted-only

| | Item |
|---|---|
| **Wire now** (VM-ready, no new accounts) | Manifest compiler from the locked EP01 script + board plan + cue sheet; ffmpeg scene assembly + per-scene audio attach + loudnorm finish; Kokoro scratch voices + Rhubarb visemes; EbSynth flatten pass; Natron script-generated composite graphs; gate scripts (frame-diff motion check + DINO/CLIP likeness score); per-scene resumable build runner modelled on TRIPPEDD's `render_shot.py` + pocket-studio's `build.py` conventions. |
| **Wire later** (needs a GPU endpoint decided) | ComfyUI workflow JSONs (Wan 2.2 I2V triple-lock, VACE hand-offs, Phantom multi-subject); per-character image LoRAs, then Wan video LoRAs (musubi-tuner); style LoRA; SAM 2/MatAnyone matting stage; RIFE + Real-CUGAN finishing chain. |
| **Hosted-only** (by nature) | SeedVR2/FlashVSR diffusion upscaling (H100-class); frontier closed video models via aggregators (fallback hero shots only); bulk LoRA training if no local GPU (RunPod-class rental or hosted trainers). |

---

## 7. Honest limits

- **No GPU in this environment** is the binding constraint: every
  generative step is a remote call. The unified build is designed around
  that (CPU orchestration + GPU as a service), but render latency for a
  full episode is hours of GPU time, not minutes — Wan 2.2 at 720p runs
  ~6–10 min per 5-second clip on a 4090-class card before rerolls.
- **Consistency is probabilistic.** The triple-lock + gate gets likeness
  *most* of the time; the sourced reroll/touch-up rate is ~10–15%, and
  the glossy-3D failure mode is reduced, not eliminated — EbSynth and the
  puppet route are the deterministic backstops, which is why the default
  route is puppets and generative is the flagged exception.
- **LoRA training is per-character, per-base-model.** A Wan 2.2 LoRA does
  not port to HunyuanVideo; changing base models re-opens training. Pick
  Wan 2.2 as the house base and stay on it.
- **Licenses need a final pass before anything ships commercially:**
  Chatterbox/Kokoro/Qwen3-TTS and Wan (Apache-2.0) are clean; F5-TTS,
  XTTS v2, Fish Speech, and BBC Sound Effects are non-commercial and are
  excluded above; LTX licensing is revenue-tiered — verify the current
  terms at wiring time. Freesound is per-file: CC0 filter only, and log
  the license of every file pulled into the cue sheet.
- **Tahoma2D/Blender/Natron headless rendering works but is GUI-app
  plumbing** — expect the first wiring pass to be fiddly (project-file
  generation, render flags). The manifest/gate/ffmpeg spine is the part
  that must be solid first; it is also the part fully buildable today.
- **Mochiko's voice casting is still an open item.** Until Jamar decides,
  all human dialogue in builds is scratch voice and must be labelled as
  such in the build log.

---

*Sources are linked inline at each claim. Tool versions stated are the
current releases found on 2026-10-27; re-verify at wiring time, especially
LTX licensing and Tahoma2D/Blender point releases.*
