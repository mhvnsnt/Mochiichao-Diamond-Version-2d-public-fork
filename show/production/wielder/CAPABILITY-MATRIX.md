# WIELDER — CAPABILITY MATRIX

Parity target, per the owner: Wielder does what the leading agent
products do, mapped to free components — with proprietary hosted
features **substituted or declared out, never faked**. Show-production
work is the priority; the architecture stays general.

Competitor capability sets enumerated from public sources (2026-10-28):
Muse platform (owner's enumeration: memory, scheduling, browser
control, subagents, artifacts, connectors, messaging, goals/tracking,
media); Claude / Claude Code (deep repo reading, terminal, git + PRs,
test-driven fixing, code review); Replit Agent (autonomous build,
cloud IDE, one-click deploy, built-in Postgres + secrets manager, live
preview, app history/rollbacks, GitHub sync, pre-deploy security scans,
agent sandboxing — vendor + review pages); Emergent (multi-agent
full-stack generation, live preview, one-click deploy + domains,
GitHub sync/ownership, built-in auth/payments integrations — vendor +
review pages); adjacent class (Cursor/Windsurf: IDE-embedded editing;
Bolt/Lovable/v0: prompt-to-UI/app with hosted preview; Devin-class:
autonomous ticket-to-PR engineering).

Status key: **HAS** (component named) · **GAP-FILL** (Wielder wiring
file named) · **SUBSTITUTE** (free substitute wired) · **OUT** (honest
reason).

| Capability (source products) | Wielder status | Component / file / reason |
|---|---|---|
| Persistent memory across runs (Muse, all) | **HAS** | LanceDB memory (`wielder/memory.py`) + SQLite ledger (every run, transition and locked input survives) |
| Scheduling / recurring jobs (Muse, Replit) | **HAS** | Cron heartbeat trigger (the standing 6h studio-orchestrator pattern) + Kanboard queue; Wielder itself is trigger-agnostic |
| Real browser control (Muse) | **SUBSTITUTE** | Browser Use (MIT) + Playwright (Apache-2.0) are the wired browser door in the multi-door router (`wielder/doors.py`); in this deployment, live-browser steps execute through Doro's browser lane — declared, never faked |
| Subagent / multi-agent delegation (Muse, Emergent) | **HAS** | LangGraph nodes as specialised roles (planner / executor / evaluator / critic / diagnosis) with schema-JSON-only messages; manager-level delegation via the CLI + queue |
| Artifacts / files as deliverables (Muse) | **HAS** | Run packets + evidence manifests (`wielder/report.py`); deliverables staged GitHub/TeraBox per the staging law |
| Connectors / account integrations (Muse, Replit 100+) | **HAS** | MCP tool protocol (`wielder/mcp_server.py`) is the connector surface; GitHub via the owner's PAT connector; new connectors join as MCP tools with Pydantic schemas |
| Messaging (Muse) | **GAP-FILL (partial)** | Board comments are Wielder's wired outbound channel today (`wielder/queue.py`); chat-platform sends route through Doro (manager layer), not Wielder — stated plainly |
| Goals / tracking (Muse) | **HAS** | Kanboard finish queue + run ledger + upgrade loop: every failure/gap becomes a tracked card (Addendum 7D mechanism, `wielder/upgrades.py`) |
| Media handling — generation + measurement (Muse; show-specific) | **HAS** | Registered methods drive the production tools already on this VM (movement engine, X-sheet pipeline, Kaggle browser route); ffmpeg/ffprobe measurers inside the finish-gate verifier |
| Deep repo reading (Claude Code, Devin) | **HAS** | Top-k retrieval over the measured corpus (repo 22,165 files; text index, media by metadata) + read-receipt preflight: cited files are hashed, uncited claims rejected |
| Terminal / shell execution (Claude Code, Replit) | **SUBSTITUTE (by constitution)** | No raw shell — deliberately. Execution is schema-validated tools + registered-method scripts only (`wielder/tools.py`). This is a safety property of the product class, not a missing feature |
| Git + pull requests (Claude Code, Replit, Emergent, Devin) | **HAS** | git on the VM + the vendored resilient GitHub upload tooling (`vendor/agent-ops/lanes/resilient-gh-upload.sh`) + the owner's GitHub PAT path |
| Test-driven fixing (Claude Code, Replit Agent) | **HAS** | Exit-code truth: generated work runs against the real test/gate suite; raw stack traces feed the capped retry loop unedited; the verifier manifest is the advance signal |
| Code review (Claude Code) | **HAS** | The vendored instruction gate (`vendor/agent-ops/github-scripts/instruction_gate.py`, test suite passes) + zero-trust advisory critic with negative fixtures |
| Full-stack app building from a prompt (Replit, Emergent, Bolt, Lovable) | **GAP-FILL (partial, honest)** | Wielder executes registered methods and tool chains end-to-end; open-ended "prompt → arbitrary new app" generation requires an LLM seat at full strength — the deterministic seat does not claim it, and the free-tier seats are capped (STACK.md §3). Declared as the known capability frontier, not papered over |
| Deploy / hosting (Replit, Emergent) | **SUBSTITUTE** | Self-hosted on this VM: systemd-style services + the FastAPI dashboard (`wielder/dashboard.py`) instead of a proprietary host; artifacts staged to GitHub/TeraBox |
| Managed database (Replit Postgres) | **SUBSTITUTE** | SQLite (ledger, board, graph checkpoints) — zero-infra and sufficient at this scale; Postgres-class needs are OUT until a workload names one |
| Secrets manager (Replit) | **SUBSTITUTE** | The platform's secure credential flow (connectors / Secure Vault) at the manager layer; Wielder's code holds no raw credentials — board auth comes from env, keys are never printed |
| Live preview (Replit, Emergent, Bolt, Lovable, v0) | **SUBSTITUTE** | The review packet IS the preview surface for production work: playable artifact path + hash + clause table + self-judgment section, written for the owner's eye |
| App history / rollbacks (Replit) | **HAS** | Graph checkpointing with a rewind surface (`wielder rewind`) + git history + current-version registry (an older version is never silently used) |
| Pre-deploy security scans (Replit) | **GAP-FILL (partial)** | The claim linter + guard-paths + scorer-separation checks run pre-flight (`wielder/linter.py`, preflight node); a Semgrep-class scanner is not wired — named as a gap card candidate, not claimed |
| Agent sandboxing (Replit) | **HAS (scoped)** | Tool-layer sandboxing by construction: workers can only call schema'd tools, writes are path-guarded, scorer paths are unreachable; process-level OS sandboxing of method scripts is OUT (method scripts are the owner's own registered code) |
| Auth / payments in generated apps (Emergent, Replit) | **OUT** | Not a show-production need; no honest free-standing requirement exists in the queue. Would enter as a registered method + target if a real card ever names it |
| Design-first UI generation (Lovable, v0) | **OUT (for now)** | Show visuals come from canon art + registered methods, not prompt-generated UI; design polish is the owner's eye + canon, by the grading law |
| Multiplayer real-time collaboration (Replit) | **OUT** | Solo-creator deployment; the board + packets are the collaboration surface |

## Addendum 9 additions — chat pillar + free-API scope + Google AI Studio column

| Capability (source) | Wielder status | Component / file / reason |
|---|---|---|
| Chat interface with streaming, history, attachments, in-chat packets (Muse platform; owner order) | **HAS** | Chainlit (Apache-2.0, licence verified at source 2026-10-28) — `wielder/chat.py`. A chat message becomes a queue card/run under the constitution; the owner gate is presented in chat (Approve/Deny invoke the gate's own record_verdict.py / record_rejection.py); history persists in Wielder's SQLite; attachments are hashed into the provenance lock. LibreChat (MIT) and Gradio/Streamlit (Apache-2.0) evaluated; **Open WebUI excluded — its licence file is a custom "Open WebUI License" (not plain open source)** |
| Multimodal input (Google AI Studio) | **SEAT DECLARED, not wired** | Gemini free-tier seat exists in `wielder/brain.py`; no key held → smoke test returns NOT CONFIGURED (Addendum 9B rule: untested = not wired). One-step ask recorded in PROVENANCE §D |
| Long context (Google AI Studio) | **SUBSTITUTE** | Wielder's answer is structural, not a context window: top-3 retrieval hydration over LanceDB + read receipts; whole-corpus context is a named failure mode (lost-in-the-middle), not a feature |
| Code execution (Google AI Studio) | **HAS (stronger form)** | Wielder executes REAL code on the VM through the schema'd tool layer + registered method scripts, gated by exit codes — not a hosted sandbox snippet runner |
| Structured output (Google AI Studio) | **HAS** | Pydantic schemas everywhere + Outlines (Apache-2.0) available for constrained decoding when an LLM seat is configured |
| Free-tier LLM APIs as advisory seats (Gemini / OpenRouter / Groq) | **SEATS BUILT, keys outstanding** | `wielder/brain.py` seat_status + smoke_test: OpenRouter caps 20 rpm / 50 rpd (1,000 rpd after one-time $10); Groq ~30 rpm, ~1K rpd larger models, 8K tpm; Gemini per-project caps in the AI Studio console (reported 20–1,500 rpd by model; free-tier data may be used by Google under unpaid-service terms). All labelled **free proprietary, capped**. OpenAI API: **OUT — no standing free tier (paid)**. ElevenLabs/Kling free tiers: **free-but-restricted — scratch only, never shipped output** |
| GitHub integration (owner's account) | **HAS — smoke-tested** | PAT connector; real call on record 2026-10-28: GET /user → login mhvnsnt (Phase 1). Wielder's MCP catalogue mirrors connector capabilities where the service is the owner's own account (EXTRACTION.md source 3) |
| Kaggle (owner's account) | **DOORS DECLARED** | CLI + browser doors declared in the multi-door router; the API door was rate-limited (429) this morning — per the standing framing the browser door is the working route, driven by the manager's browser lane, never faked by Wielder |


**The honest frontier, stated once:** open-ended generative breadth
("describe anything, get it built") is the one place the hosted
products' paid frontier-model seats outgun Wielder's free seats today.
Wielder's answer is structural, not rhetorical: for the work this
system actually runs — registered production methods against a hard
verifier — breadth is bounded by the registry, and every gap becomes a
queue card in the open (Addendum 7D).
