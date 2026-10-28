# WIELDER — PROVENANCE MANIFEST

The anti-bullshit device: every piece of Wielder is listed here with
what it is, where it came from, its licence verified at the licence
file (bucket per the honesty law), the sha256 of what was vendored or
the installed version, and whether it is **wired** or **gap-fill**. A
piece that is not in this manifest is not claimed as part of Wielder.
Licence failures were swapped for verified equivalents, and every swap
is recorded — never silently carried.

Assembled 2026-10-28 on this VM (Python 3.12.3, 2 CPU, 7 GB RAM).
Regenerate the file tables with `wielder/tools_build_provenance.py`.

## A. Installed pillars (official packages, wired as-is)

| Piece | Source | Licence (verified at the licence file, 2026-10-28) | Bucket | Installed | Running-verified |
|---|---|---|---|---|---|
| LangGraph | `langchain-ai/langgraph` via PyPI | MIT | open source | langgraph 1.2.18 | Graph executed end-to-end in Wielder's own loop; checkpoint history read back (time-travel surface) |
| LangGraph SQLite checkpointer | `langchain-ai/langgraph` libs via PyPI | MIT | open source | langgraph-checkpoint-sqlite 3.1.2 | Checkpoints written + `get_state_history` exercised |
| LangChain core | `langchain-ai/langchain` via PyPI | MIT | open source | langchain-core 1.7.0 (dependency) | Imported by the graph stack |
| Pydantic | `pydantic/pydantic` via PyPI | MIT | open source | pydantic 2.14.1 | Every Wielder schema validates through it (test suite) |
| Pydantic AI | `pydantic/pydantic-ai` via PyPI | MIT | open source | pydantic-ai 2.63.0 | Installed + imported; validation layer for LLM seats (seats advisory only) |
| MCP python-sdk | `modelcontextprotocol/python-sdk` via PyPI | MIT | open source | mcp 1.30.0 (Chainlit 2.12's pin; the server module tries the 2.x MCPServer API first, falls back to 1.x FastMCP) | `wielder/mcp_server.py` imports and constructs the server on the installed 1.30.0 |
| LanceDB | `lancedb/lancedb` via PyPI | Apache-2.0 | open source | lancedb 0.40.0 | Table created, 29 chunks indexed, top-3 search returned hits |
| sqlite-vec | `asg017/sqlite-vec` via PyPI (arrived as a LanceDB dependency) | Apache-2.0 (dual MIT) | open source | sqlite-vec 0.1.9 | Installed; the documented fallback store |
| FastAPI | `fastapi/fastapi` via PyPI | MIT | open source | fastapi 0.162.0 | Dashboard TestClient: GET / and /runs both 200, title WIELDER |
| Kanboard | finish-gate/board (official v1.2.56 source) | MIT (LICENSE read in the installed source) | open source | 1.2.56, SQLite at 127.0.0.1:8899 | LIVE: PHP 8.3 installed, board serving; Wielder read the queue and ran card #3 through the JSON-RPC API in the live run; the read-only SQLite door also exercised |
| Chainlit | `chainlit/chainlit` via PyPI | Apache-2.0 | open source | chainlit 2.12.0 | Chat pillar SERVING (HTTP 200 at 127.0.0.1:8897) via chat_app.py; messages become cards/runs on the same gated graph |
| finish-gate verifier | Owner's system, `~/workspace/ep01-rebuild/finish-gate/` | Owner's code | owner | its own git repo, head c19669d at the live run | Executed by Wielder runs; manifests are its sole-authored files (live run manifest sha256 d86dc95b…) |
| Method registry | finish-gate `methods/INDEX.json` (+ repo METHOD-REGISTRY of record) | Owner's system | owner | 4 Accepted, 2 Superseded | Resolver exercised in tests + runs; superseded hard-fail tested |

## B. Vendored — the owner's earlier agent system (donor), literal carry-over

Source: `mhvnsnt/agent-ops`, pulled in full during Phase 1
(tarball 6,487,806 B; audit in AUDIT.md). Owner's own code — carried
literally per the construction-kit rule for his own work.

| File | sha256 | Size |
|---|---|---|
| `vendor/agent-ops/AGENTS.md` | 7c44db1d45416fec5521492be06ed7be20fe23687f0e316c3feeb1445e8874b9 | 5219 B |
| `vendor/agent-ops/CHECKPOINT_PROTOCOL.md` | af88c3f796724e96e2785b17d6c4ea7ecb89bc21664684d9c8fe6ac048804882 | 3330 B |
| `vendor/agent-ops/HOW-GROKBOT-WORKS.md` | 48317e7d3a7ba974683b67aa8d7015c405c15663523e71b64c56d981edefc0d2 | 3443 B |
| `vendor/agent-ops/checkpoint.sh` | 95cb2c4d18ca733ee64cf0f22166b3b25550536bcb1df4442b734f2f699129ce | 5180 B |
| `vendor/agent-ops/github-scripts/instruction_gate.py` | ea5338297bba994a57e5cc980e83c3440c78f0bdb2350528e595104fd057f708 | 5337 B |
| `vendor/agent-ops/github-scripts/test_instruction_gate.py` | 92625b0c21e36c718d582f8267d9668e74c58a47cdc87cad28c85f9210ab62f2 | 3140 B |
| `vendor/agent-ops/guard-paths.sh` | cda8b19df96bd998211030cc72aa55bfb4cde81a9e6c7ad98e7ad3dcae9d1869 | 5683 B |
| `vendor/agent-ops/lane-autostart/lane-autostart.sh` | 305e883c222e2e7012ea8e6ebcb51f370c7615e362295652663d1e01ddb9574c | 8197 B |
| `vendor/agent-ops/lane-autostart/lanes.manifest` | 76d1616764624834b604b6d313a0ce5c2c690bd8456e638882e4cac22bfa8e56 | 1616 B |
| `vendor/agent-ops/lane-ckpt.sh` | 7d81ed682b505c75de571e08837a906e33949f9f70f54905350bdcdaf5e4aca8 | 3940 B |
| `vendor/agent-ops/lane-worktree.sh` | 8c4a01a9ca71ca3ba8fd4fa36c48b318765cb2b34739661e6773da80509a2e25 | 7784 B |
| `vendor/agent-ops/lanes/resilient-gh-upload.sh` | 655fed382e188f4ad3a4b4b729f4fcc81d9172309bccda62b5d468af7be2f961 | 11539 B |
| `vendor/agent-ops/local-ci/README.md` | a03f836407cc25df8a6b75ee9a7dc976e65fa999412df403f434596f1b5ccdc6 | 5153 B |
| `vendor/agent-ops/local-ci/local_ci.py` | 39cfccff58cf89759dec83404642fbfa34edebf6d562b7b99ae32f72899248ea | 15369 B |
| `vendor/agent-ops/protected-paths.json` | ec586dbbcfb0f19eb1ee064670d3d5685620de996f8acc2a7f351ac2746a3ec6 | 1489 B |
| `vendor/agent-ops/supervisor.sh` | b0cb75850731cfda5cd80dd6e071219fed23f5c006e7261b549995fed6b0c3bf | 6252 B |

Running-verified: the instruction gate's own test suite passes in its
vendored home (12 tests, run 2026-10-28). Note, honestly:
`lane-autostart.sh` was labelled "DESIGN PROPOSAL — NOT WIRED" by its
own author (AUDIT.md §2); it is vendored as a design record. Its
function in Wielder is performed by the cron heartbeat + queue pull,
not by this script.

## C. Gap-fill — the only new code (thin wiring, per the build mandate)

All under `wielder/`. Each file: graph definition, schema definitions,
or tool adapters onto the real systems above — nothing else was
written.

| File | sha256 | Role |
|---|---|---|
| `__init__.py` | 0cda80c33bb4c575f35f49849a9509f046f8a8a2be7456b6d4e8b8d8c340f252 | product definition |
| `authz.py` | 5f28ff3d4ea0b6a3460088579251f78d99a8147bba953b6cde74d57564178077 | Standing Authorization Ledger (Addendum 12) |
| `brain.py` | 404a327b8fc743980bbf926c795fd1549794a0f893b4ffb26c38f465390a626d | brain seats, measured availability |
| `chat.py` | 355538897135383c9a93128a96fb761b209f96286f66a4fefe154f0047c4e14c | chat pillar logic — Chainlit front-end on the gated graph |
| `cli.py` | ef7fa0a84924a72e69a098cac82dce39ae282caefce4073a7e57d72b774a083a | manager surface |
| `constitution.py` | e81a6eae289a1dcedf47388e96a1e6107168bcb77bbc7bea337dc4b707cabed7 | opposite-defaults as code + config loader |
| `critic.py` | 62034b2ce4770d0a3dfe0242ffbf454d810830c46c3302f150fc4960bc6459ea | zero-trust advisory critic |
| `dashboard.py` | af909a3efb4f7b17609ea63ff3dd0b937e05cb4e798a653dc503ab82129bbafd | read-only status surface |
| `delegate.py` | 426c3b71921d1f7157be452c41619c03b79fdd5d66ea65bd42f2334717296a11 | child-run delegation |
| `desktop.py` | 030f2595bf311029a7b8c6e0f7139a3a842d0c4032d34aa9030a71aaa7ac9723 | desktop layer — display/bus/seat/self-provisioning (Addendum 13) |
| `doors.py` | 1f2f1537d3f443858b778b9f45fcac9de235e6d0204f41fd6d9af8019f0ef00f | multi-door capability router |
| `fixtures/rejection-cases.json` | 70a5c07f7a2db59e18f43534c7a363b95fbdce314dc972a718364500c3a2197b | negative-sampling fixtures (owner's real rejections) |
| `graph.py` | e35578ac3e27c976fccc83674578f5ce47c8575fb43c5475028d04f949192e72 | the ReAct state graph |
| `judgment.py` | 6731ad7dbb691b55e5736591d270b82659fcc29e79642db969c612a2c5e8aacf | full-standard self-judgment |
| `ledger.py` | 36f91e2d6687aa8ec4dd23c523a546525e767ef7ee527f8e26b55f664cb398c3 | SQLite run ledger |
| `linter.py` | 3f82a841cf3882d32425e44ea9a02400ac6d3fbcce44f2e7fab49e2202be5afd | claim linter |
| `mcp_server.py` | 96b93db51f22ddba033edb47ed9bd539ba98c412a1645c76507cdc05e7043ffe | MCP tool surface |
| `memory.py` | 9742f14d02fda51aae094a69b2d925ba33ddbee1777fcb7e6cfb25c108b14420 | LanceDB memory + embedder selection (bge live, hash fallback recorded) |
| `methods.py` | e5a9f5ccec1a6b97d6f228d496dadd69431ec9c276aab289317308125637d39c | registry resolver |
| `pinning.py` | 4ee5df215a97fcf0ecc8e791fc009f6de8619133a5ad7d5792cbf82d75de6e29 | regression-pin requests |
| `queue.py` | 455d7c94f5cddc93a713f8a2de0cd3de3052f85e0b342fa300511959b86d7c1c | Kanboard client (pattern from the board's own seed script) + SQLite read door |
| `report.py` | 6af58c4ce84be9de96f941f39fda44cd35ad209704fabc0dc9201130788e96c8 | evidence-only packet generator |
| `rules.json` | 90f7e6950dc35aa822ab9f3a8dcff52a4767dede0933df2cab0937b9c4757fe7 | compiled standing-law registry |
| `rules.py` | 7d23fa76896bed5ea8f5564ca8b69ff0f9538c5127de22919014813d22d4be31 | rules-registry check |
| `scheduler.py` | 4fa2a104e2236756d4f909ba732cc060f567b9017936bb7160c976a6336c95ad | heartbeat — unattended runtime (Addendum 12B) |
| `schemas.py` | 3e99d2bfe3628de8e949b29a9fc7e133341287fb0e85c421450cbffda91570b7 | Pydantic message/tool schemas |
| `scrub.py` | cc341cb09c88073a11da0750993bcd681e88ada6536eb533f5020cc7da1cd851 | first-person scrubber / prompt hygiene |
| `standing-authorizations.json` | a282d1594a17d926b27e2b10fb56986e1d88bf04b1e7711117d72c71a06ef51e | mirror of the Standing Authorization Ledger |
| `tests/test_wielder.py` | 839d659545f4d6968a15e0b9ae310ccd1173bfa7b8424bf7661f52c7d1847547 | the constitution, executable (17 tests) |
| `tools.py` | 4b06d46edf486b7ed9717314e7b075c747dba727847b60d743ebbe3fc3e367f7 | schema-only execution layer |
| `upgrades.py` | 0af25633ce7bf2b14a6566d7682b1e37af55c45c090f959e0495d19bb1316da6 | upgrade-loop cards (Addendum 7D) |
| `versions.py` | c918c4327391bb9279654fcf6f1f7c2561c5bd93c0a4eff8139d44e76b3927c6 | current-version resolver |
| `wielder.config` | 7786f209b243e17395a0e4b1bdaca3fdddf718a80c79891a89a498cb6cf9f876 | Wielder defaults (the constitution as config) |

## D. Gaps, swaps, and honest statuses (never claimed wired until serving)

| Piece | Status |
|---|---|
| **Langfuse** (self-hosted core, MIT; ee/ dirs under its enterprise licence — never enabled) | **GAP, recorded.** Wielder's telemetry of record is the SQLite ledger + per-run packets (both live and exercised). Langfuse is the optional mirror; it counts as wired only when its stack serves on this VM. |
| **sentence-transformers + bge-small-en-v1.5** (Apache-2.0, verified from the installed package's LICENSE file) | **LIVE.** sentence-transformers 6.2.0 installed; the bge embedder is Wielder's active embedder (measured: `embedder_name` reports BAAI/bge-small-en-v1.5 via sentence-transformers; top-3 retrieval over the corpus index returns relevant chunks). The deterministic hash embedder remains the recorded fallback if the seat is ever absent. |
| **Desktop layer** (Addendum 13: Xvfb 2:21.1.12 distro package; dbus-daemon; Google Chrome 156.0.8078.73, free proprietary, Google's official .deb) | Display + bus + GUI-app smokes PASS (display brought up from down by self-provision; Inkscape rendered under Wielder's env; xclock window measured YAVG 229.6/255; x11vnc seat listening on 127.0.0.1:5999; xdotool installed). **Chrome seat gap, with evidence:** the browser process dies with SIGTRAP at startup on this VM across two flag sets (logs in wielder/data/smoke/); browser execution stays on the manager's browser lane. |
| **Standing Authorization Ledger** (Addendum 12) | LIVE in Wielder's own SQLite (`wielder/authz.py`): the owner's five standing classes granted 2026-10-28 under his standing order (#1–#5, listed by `wielder grants`), every use audit-logged, revocable in chat/CLI. The honest exception set (payment approvals, identity checks, unshared credentials) is never grantable — enforced in code, tested. |
| **Temporal** (MIT) | Deferred by design (STACK.md §6): one state machine of record. Seam documented; not installed, not claimed. |
| **Ollama** (MIT runner) | Not installed on this VM (measured: no binary). Brain-seat status is measured by `wielder seats`, never assumed. |
| **OpenRouter free tier** | Free proprietary, capped (20 req/min; 50 req/day no-purchase; 1,000/day after one-time $10). No API key held — seat unavailable, blocker named in `brain.py`. |
| **Browser Use + Playwright** (MIT / Apache-2.0) | Licences verified; the browser door is declared in the multi-door router. Live-browser execution routes through Doro's browser lane in this deployment (a generic build agent cannot operate the owner's signed-in browser) — declared in CAPABILITY-MATRIX.md, never faked. |
| **Phoenix** | **Excluded:** its licence file reads Elastic License 2.0 — not open source. Recorded here so the exclusion is permanent and visible. |
