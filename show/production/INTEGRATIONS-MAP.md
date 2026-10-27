# INTEGRATIONS MAP — the 20-item research programme, wired to this lane

Provenance: programme issued by the owner 2026-10-27 (see
RESEARCH-DIRECTIVE.md). First implementation landed in the private
mirror (mhvnsnt/Mochiichao-Diamond-Version-2d--mirror) on branch
`research-integrations-2026` — VERIFIED 2026-10-27: branch present,
all listed files exist (docs/INTEGRATIONS.md, src/lib/worldEngine.ts,
src/lib/ecs.ts, src/lib/schemas.ts, src/services/GridConnector.ts,
src/services/MochiiMindService.ts, src/services/multiplayerStub.ts,
src/integrations/pixi/PixiWorld.tsx, src/integrations/3d/ThreeEnv.tsx,
WORKING-METHOD.md, package.json + deps).

This repo (fresh-start) already contains the anchor files the
programme wires against — VERIFIED on main 2026-10-27:
src/services/GridConnector.ts, src/services/MochiiMindService.ts,
src/lib/global_roster.json, src/components/SpriteGenerator.tsx.

Status key: MIRROR = landed in mirror branch · PORT = port to this
repo is the follow-up · SHOW = wires into the show lane (show/).

## Show side (visuals / presentation / AI asset pipeline / UI)
| # | Item | Wire-up here | Status |
|---|---|---|---|
| S1 | PixelLab / Retro Diffusion / sprite-AI grid-native generation | GridConnector.ts + SpriteGenerator.tsx; tags feed global_roster.json | MIRROR (HF path) · PORT |
| S2 | Flux.2 Klein LoRAs (HF) for transparent front-facing sprites | GridConnector.ts inference; blob cache via saveSystem/IndexedDB | MIRROR · PORT |
| S3 | PixiJS v8 + @pixi/react | WorldEngine/WorldRenderer; show-side: the same renderer family carries garden scenes | MIRROR entry point · PORT |
| S4 | PlayCanvas / Babylon / Three for 2.5D environments (replaces Sketchfab embeds) | WorldEngine scene manager; ThreeEnv.tsx entry | MIRROR · PORT |
| S5 | Aseprite / LibreSprite cleanup + palette quantisation after AI gen | Pipeline step documented in WORKING-METHOD; show-side: same pass serves show sprite/key art cleanup | MIRROR (docs) · SHOW |
| S6 | spryte / ParticleContainer batching | WorldEngine weather/day-night particles; show-side: ambient particle life (LIVING-WORLD spec) | Research · SHOW |
| S7 | Motion + industry animation patterns | IntroSequence/BattleView; show-side: UI/motion language shared with keeper tech | In package.json · PORT |
| S8 | Tailwind + shadcn/ui / Radix | Header/menus/MochiiMindUI/SaveMenu; show-side: keeper-device UI grammar (Persona principles) shares the component discipline | Research · PORT |
| S9 | Ludo / Scenario style-lock | Reference sets constrain GridConnector prompts + show generative (triple-lock stack, UNIFIED-PIPELINE) | Research · SHOW |
| S10 | LittleJS / Hilo3D evaluation | Renderer backend evaluation for WorldRenderer | Research |

## Game side (mechanics / engine / AI GM / data / state)
| # | Item | Wire-up here | Status |
|---|---|---|---|
| G1 | Deterministic World Engine (simulation separated from LLM narration) | Pure TS rules layer; MochiiMindService.consult reads/writes against it; Zustand stays live state | MIRROR skeleton (worldEngine.ts) · PORT |
| G2 | Phaser 4 (tilemaps/physics/scenes) or borrow its formats | WorldEngine tilemap lifecycle | Research |
| G3 | Tiled + JSON export as map authoring standard | Replaces/augments hardcoded maps; WorldEngine loader | Research |
| G4 | RPGJS data-model patterns | global_roster.json + event systems; Spore Engine IDs 047–330 | Research |
| G5 | ECS-inspired architecture (lightweight TS ECS) | Around gameStore + battle logic | MIRROR (ecs.ts) · PORT |
| G6 | Enhanced Zustand (persist + Immer, versioned saves) | saveSystem.ts; autosave/quicksave paths | MIRROR deps · PORT |
| G7 | Legacy battle-formula insights (construction-kit only, from owner's own reference) | engine.ts / GameData.ts original implementations; sanitised mapping in WORKING-METHOD | Owner-gated |
| G8 | AI GM best practices (memory & continuity; determinism & fairness) | Explicit memory store queried by MochiiMindService; hard rules before narration; state diffs in consult | MIRROR hooks · PORT |
| G9 | Colyseus multiplayer (optional layer) | On top of deterministic state; world engine stays authoritative | MIRROR stub · PORT |
| G10 | Structured roster/Spore data pipeline (Zod schemas + versioning) | global_roster.json + species.ts validation; canon 001–046, procedural 047–330, legendaries 331+ | MIRROR (schemas.ts) · PORT |

## How this lane uses the map
- The SHOW production consumes S1/S2/S5/S6/S9 directly (asset
  pipeline + living-world particles + style-lock = the same
  triple-lock discipline as UNIFIED-PIPELINE.md).
- Game-side items land in this repo as their own PRs when ported;
  this map is the checklist, the mirror branch is the reference
  implementation. Nothing here is marked done in THIS repo until
  the port actually lands and is verified.
