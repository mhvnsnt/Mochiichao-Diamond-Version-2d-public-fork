# Tripo "pulling URL" research — full report

## Bottom line first

The API task route does NOT, on any public documentation found, give you Gabu and Dorowani as they exist today. Those two are Studio-published models (2026-10-22, creator "m."):

- Gabu: https://studio.tripo3d.ai/3d-model/8ac709ca-d7c9-48b9-beaf-b72221273f33
- Dorowani: https://studio.tripo3d.ai/3d-model/9ddaeb3f-2c4e-4ce2-b8c4-5c0964585cf0

The API route works for models generated through the API itself, with a retained task_id. No API key and no task_id for either model is on file, and no public Tripo API endpoint was found that lists Studio gallery models or fetches a model by its Studio share UUID. The share UUID in those URLs is not a documented API task_id, and none was guessed or substituted.

The Share link is also not a download: Share > Copy Link gives a preview/share page URL. The file route for a Studio model is Export (GLB/FBX/OBJ, etc.), signed in, subject to that account's export limits. A Studio share page is an HTML viewer page, not a .glb file, so feeding it to a "download from URL" tool will not yield a model.

## 1. The two legitimate "from URL" mechanisms

### A. Tripo MCP — `import_tripo_glb_model`

- Source: https://glama.ai/mcp/servers/VAST-AI-Research/tripo-mcp/tools/import_tripo_glb_model
- What it is: a tool in the community Tripo MCP server (`@VAST-AI-Research/tripo-mcp`) that sends an import command to a connected Blender session via the Tripo AI Blender Addon.
- Its only parameter: `glb_url` — a download URL of a GLB file, required. It returns a result message listing imported models and their dimensions in metres.
- What it needs to run at all: Python 3.10+, Blender, the Tripo AI Blender Addon, and the MCP server configured (e.g. `uvx tripo-mcp`) with the Blender MCP server started. Source: https://mcpservers.org/servers/VAST-AI-Research/tripo-mcp
- What it does NOT do: it does not authenticate to Tripo, does not resolve a Studio share page, does not bypass Export, and does not create a GLB URL. It only imports a GLB URL you already legitimately have into Blender.

Related MCP tools, same server: `create_3d_model_from_image`, `create_3d_model_from_text`, and `get_task_status`. The documented workflow for those is: create → get `task_id` → poll `get_task_status` repeatedly until SUCCESS → use the `pbr_model_url` from the response → pass that URL to `import_tripo_glb_model`. Sources: https://glama.ai/mcp/servers/VAST-AI-Research/tripo-mcp/tools/get_task_status and https://glama.ai/mcp/servers/@VAST-AI-Research/tripo-mcp/schema

### B. Tripo API task download-URL flow

Official v2→v3 mapping (use v3 for new work; v2 and v3 run in parallel per Tripo, and API keys are shared between them): https://developers.tripo3d.ai/en/docs/migration-v2-to-v3

- Authenticate: `Authorization: Bearer <API key>` — key generated in Tripo's developer dashboard. Official example base: `https://openapi.tripo3d.ai/v3/generation/text-to-model`. Source: https://developers.tripo3d.ai/en
- Submit (v3, dedicated endpoints, no `type` field):
  - `POST /v3/generation/text-to-model`
  - `POST /v3/generation/image-to-model`
  - `POST /v3/generation/multiview-to-model`
  - Processing: `POST /v3/models/convert`, `/v3/models/import`, `/v3/models/refine`, `/v3/models/texture`
- Poll: `GET /v3/tasks/{task_id}` (v2 equivalent: `GET https://api.tripo3d.ai/v2/openapi/task/{task_id}`).
- On success, the task output contains download URLs — in v2 documentation/examples: `output.model`, `output.pbr_model`, `output.base_model`, plus a rendered image. In MCP `get_task_status` output those appear as `model_url`, `pbr_model_url`, `base_model_url`, `rendered_image_url`, with the instruction "use the pbr_model_url … download it through import_tripo_glb_model".
- Formats: generation endpoints return GLB by default; the exception is Tripo P2 with `quad=true`, which returns FBX (glTF cannot store quad faces). The convert endpoint can produce OBJ, FBX, STL, or PLY. Studio Export separately lists USD, FBX, OBJ, STL, GLB, 3MF. Sources: https://www.3daistudio.com/Platform/API/Tripo and https://www.tripo3d.ai/game-development/image-to-3d-model-ai-with-automatic-pbr-texture-generation-for-realistic-games
- Download handling: Tripo's own blog says it enforces CORS on generated artifact URLs and provides no CORS headers, so you cannot serve a Tripo artifact link directly in a browser — you must download and resave the artifact locally, or proxy it. Source: https://www.tripo3d.ai/blog/how-to-use-generated-file-download-links
- Expiry: Mars's pasted guide states programmatic download URLs expire by default within ~5 minutes, so download immediately. That "5 minutes" figure could NOT be independently confirmed in the official docs fetched — treat it as a handle-immediately rule, not a verified official number.

## 2. Credits — the part that is not bypassed

- Studio and API are separate product lines with separate billing. Tripo's own FAQ states this explicitly: "Tripo Studio and Tripo API function as independent product lines… API access is never bundled as an add-on feature of Tripo Studio subscriptions and operates with its own distinct billing system." Source: https://www.tripo3d.ai/game-development/image-to-3d-model-ai-with-automatic-pbr-texture-generation-for-realistic-games
- Studio (third-party summaries of Tripo's pricing page, verify at checkout): Free ~200 credits/month, public models only, non-commercial, ~15 exports/month limited to the older H2.5 model; Pro ~$20/month, 3,000 credits, private models, commercial use, unlimited downloads on paid plans. Sources: https://indietooling.com/posts/tripo-p2-quad-meshes and https://aimojo.io/tools/tripo-ai/
- API: pay-as-you-go credits, ~$1 per 100 credits in third-party summaries; base generation ~20 credits, +detailed geometry ~30, P1 game-mesh ~60–80, re-texturing ~20–50, segmentation ~80. Downloading an already-finished API task's output is not listed as a separate credit charge in the docs found — the credits are consumed by the generation/processing task itself, and by Studio Export limits on the Studio side. Neither the MCP import tool nor a task-status poll creates a free copy of a Studio model.
- Therefore: using the API/MCP route does not skip export credits. It moves the download to a different, authenticated channel (API credits for a new generation, or Studio export limits for an existing Studio model). Any tool claiming to pull a Studio share page straight to GLB without sign-in or credits would be a viewer-asset extraction / control bypass — reported here as blocked, not as a setup step.

## 3. Why people built these tools

In plain terms: the web Studio Export UI is manual, click-by-click, and buggy for Mars, and Tripo's artifact links cannot be hot-linked in a browser because of CORS. Developers therefore built the API + MCP path so a script or an AI assistant can: submit a generation, poll a task_id, get a direct GLB URL, download and resave it locally immediately, and import it straight into Blender — no browser clicking, no serving Tripo's link. That is an automation of a legitimate, authenticated download, not a way around paying or signing in. The western-heart `tripo-intake` tool exists for the step after that: it assumes you already hold the `.glb`.

## 4. Concrete setup for Mars (no key recorded, nothing committed)

Route A — recommended for these two exact models (Studio Export, signed in):
1. Sign Mars into Tripo in the browser — the two model tabs were already left open on the sign-in dialog in the earlier browser check.
2. On each model page, use Tripo's own Export (not Share), choose GLB, and download immediately. Check the file is a real GLB (header `glTF`) and note its size; expect large files — viewer stats are Gabu 1,909,230 faces / 987,147 vertices and Dorowani 1,955,752 faces / 1,008,079 vertices, both 4K PBR Tripo H3.1, so the GLBs will be heavy and will need decimation before any real-time use, though they are fine as render masters for sprite baking.
3. Drop each GLB into the western-heart intake inbox convention: `tools/tripo-intake/inbox/<fighter>/attire<N>.glb`, with an optional sidecar `attire<N>.json` carrying `{"tripo_uuid": "<share UUID>", "source": "tripo-pull share URL"}` — Gabu UUID `8ac709ca-d7c9-48b9-beaf-b72221273f33`, Dorowani UUID `9ddaeb3f-2c4e-4ce2-b8c4-5c0964585cf0`.
4. Run `python3 tools/tripo-intake/intake.py --scan` (Blender + GameRig backend). Its facing gate refuses rather than guesses; on pass it stages `roster/<fighter>/attires/attire<N>/model-rigged.glb` + a wiring checklist, and archives the inbox original to `outbox/` untouched.
5. For Mochiichao (not western-heart): render that GLB — rigged or static — from front/back/side/walk angles in Blender and bake 2D sprite sheets. The intake rig does not itself produce Mochiichao sheets; that bake step is still needed.

Route B — API regeneration (only if Route A stays blocked):
1. Mars supplies a Tripo API key via the Secure Vault only — never in chat, never in a file. A paid Studio plan does NOT fund this; API credits are a separate balance to top up.
2. Check balance first, then submit an image-to-model task using Mars's own uploaded Dorowani/Gabu images (or the original prompts), and retain the returned task_id.
3. Poll `GET /v3/tasks/{task_id}` until SUCCESS, then immediately download `pbr_model_url` and resave it locally (do not hot-link it). Only then pass that direct GLB URL to `import_tripo_glb_model`, or drop the saved GLB into the intake inbox as in Route A step 3.
4. Caveat to state to Mars plainly: this produces new, regenerated models, not byte-identical copies of the Studio Gabu/Dorowani. Face count, topology, and texture will differ.

One testable bridge — unverified, do not promise it:
Tripo's Studio tutorial says a Studio model's Model Info panel shows a `task_id`. Source: https://www.tripo3d.ai/blog/tripo-studio-tutorial-english
If Mars, signed into his own Studio dashboard, opens Gabu and Dorowani under My Assets and finds a task_id there, the parent can test that exact ID against `GET /v3/tasks/{task_id}` with his API key. A success would prove API visibility of those Studio tasks; a 404/unauthorised would prove the API does not expose them. No public doc found states that Studio task_ids are queryable via the API, so this is a test, not a documented route.

## 5. What remains blocked until Mars acts

1. Tripo sign-in (live-browser) for Route A, or a Tripo API key via Secure Vault for Route B. Neither is on file; no credentials were guessed, and no model was downloaded, scraped, or extracted in this research.
2. Confirmation of the Studio task_id test above, if he wants the API to fetch the existing models rather than regenerate them.
3. After a GLB exists: the Blender bake to sprite sheets, and the decision on Dorowani/Gabu roster slots (still unnumbered — do not assign 047/048 without his say-so).

## Sources used

- https://developers.tripo3d.ai/en/docs/migration-v2-to-v3
- https://developers.tripo3d.ai/en
- https://developers.tripo3d.ai/en/docs/models-texture
- https://glama.ai/mcp/servers/VAST-AI-Research/tripo-mcp/tools/import_tripo_glb_model
- https://glama.ai/mcp/servers/VAST-AI-Research/tripo-mcp/tools/get_task_status
- https://mcpservers.org/servers/VAST-AI-Research/tripo-mcp
- https://www.tripo3d.ai/blog/how-to-use-generated-file-download-links
- https://www.tripo3d.ai/blog/tripo-studio-tutorial-english
- https://www.tripo3d.ai/game-development/image-to-3d-model-ai-with-automatic-pbr-texture-generation-for-realistic-games
- https://www.3daistudio.com/Platform/API/Tripo
- https://pypi.org/project/tripo3d/
