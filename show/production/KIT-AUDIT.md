# KIT AUDIT — HAVE / GET / MAKE (2026-10-27)

Jamar's rule: see how much is already in the Mochiichao repo, get the
other half from the cartoon/show repos, combine it all HERE, and make
only what's missing. Every production element, audited against the
live repo tree (counts verified 2026-10-27).

| Element | HAVE (already in Mochiichao) | GET (from his show repos) | MAKE (gap → built here) |
|---|---|---|---|
| Identity/logo | Official logo; title music + mixer stems (23 audio files) | Persona method: one dominant colour, kit before episodes (research/) | ✅ Identity kit one-pager: show/bible/IDENTITY-KIT.md + identity-kit.json (palette SAMPLED from the real art) |
| Fonts | **17 fonts in src/assets/fonts/** incl. Bungee + Fredoka | — | ✅ Locked in the identity kit (no new font needed) |
| Character designs | 47 species data; portraits + T-pose refs (portraits-scripted-v3); lustre/battle variants; garden poses (50 species sets) | Model-sheet SYSTEM: animation-techniques-archive template + settei method (research/) | ✅ Model sheets: Mochii + Dorowani composed (production/model-sheets/); other 4 pilot species next |
| Human cast | 55 files in docs/human-characters/ incl. STYLE-GUIDE + canon doc | TVA bible architecture (disney-tva-bbb-pulls) | Show bible human-cast section (pending bible build) |
| Rigs | **Rigged 3D creatures: sprite-art/3d-checkpoint-2026-10-26/ (187 files, bake scripts + verification)**; title-lane pose frames (86) | Rig standard: Bannon UNIVERSAL-RIG-STANDARD + western-heart canonical pipeline; ata rig-spec template | ✅ Rig standard + 6 scaffolds (production/rigs/); ✅ Dorowani 2D build v1 + ROM proof with findings recorded |
| Mouths/lip-sync | Mouth/pose frames in title-lane archive | Blair 10-viseme system (ata ANIMATION-PLAYBOOK); Rhubarb (vendored OSS) | Per-species viseme packs authored at puppet assembly (in progress) |
| Animation/motion | **sprite-art/animation/: 6,525 files** (attack/idle/etc per species); 10 title videos | HB timing method; CMU mocap via TRIPPEDD manifests | Episode animation (EP01, per FIRST-START) |
| Backgrounds | Battle backgrounds v3 (6); title backgrounds; garden scene art | Donor backgrounds → converted via parts-catalog (filter-checked); BBB layouts pointer | Garden interior master set for EP01 (pending) |
| Props/objects | Game items/UI art across sprite-art/ | cape-jones living-room set (canonical); donor props via parts-catalog | EP01 prop list from beat sheet (pending writing) |
| Voices/audio | ~100 species cries; title track + stems | wizard-gang voice-pipe system (canonical); OpenGameArt SFX via TRIPPEDD manifests | Voice entries for the pilot six (pending voices-first step) |
| Scripts/templates | Title-lane scripts/staging docs | 6-beat formula (mystery-coast); cape-jones script+cue-sheet formats | ✅ Templates in production/tooling/TEMPLATES.md; EP01 beat sheet is the next writing step |
| Pipeline/tooling | tools/avatar-pipeline/ (in repo) | cape-jones 72 tools + TRIPPEDD pipeline (canonical, no-fork) | ✅ Native pipeline spec (production/tooling/PIPELINE.md) |
| Bible | Game design docs + human-cast canon | TVA bible structure; SpongeBob bible as study (holdings pointer) | Show bible build (show/bible/) — next after model sheets |

**Bottom line:** the Mochiichao repo already holds the majority of
the kit (designs, rigs-in-3D, animation frames, fonts, music, poses).
The donor repos supply the *systems* (model-sheet method, visemes,
timing, pipeline, voice). What had to be MADE here is small and is
being made in this PR: identity kit, model sheets, 2D puppet builds,
and the indexes that tie it together.
