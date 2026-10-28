# PHASE 2 — STACK: the free full stack, verified at source

**Product definition (owner's naming law, 2026-10-28):** the system
this stack builds is **Wielder — a production Agentic AI system
(autonomous multi-agent production system) for the Mochiichao show**,
in the Agentic AI / Autonomous Agents industry. Wielder is assembled
from ten production pillars — the finish-gate verifier, the Kanboard
queue + method registry, the official LangGraph package (pillar #1,
the backbone), the MCP tool protocol, Pydantic AI validation, SQLite
state/audit, LanceDB memory, durable execution, Langfuse telemetry,
and Browser Use + Playwright — plus the owner's earlier agent system
as donor. The component-by-component record, with hashes, is the
package's PROVENANCE.md; the package README opens with the same
ten-pillar table.

Date: 2026-10-28. Every licence below was read from the component's own
LICENSE file via the GitHub API on 2026-10-28 (raw results:
`licences-1.jsonl`, `licences-2.jsonl` in this folder), or from the
installed package itself where noted. Buckets follow the licence/pricing
honesty law: **open source** (licence named), **free proprietary** (a
vendor's free tier, caps stated), **free-but-restricted** (source-available
or non-OSI terms), **paid**. Where verification failed, the component is
not adopted and the failure is stated — an unverified "free" claim is
never carried into the build.

## 1. The architecture (one system, reconciled from both owner specs)

This is an **Agentic AI system** built on the **ReAct loop** —
Perceive/Reason → Act (strict JSON tool calls) → Observe (raw results,
unedited) → Reflect/Evaluate — implemented as a **LangGraph state graph**
with fallback/recovery routes. Tool connection via **MCP**; validation via
**Pydantic / Pydantic AI**; telemetry via **Langfuse** (self-hosted core).

```
            cron heartbeat (6h studio-orchestrator pattern)
                              │ trigger
                              ▼
   Kanboard (finish-gate board) ──pull WIP=1──► ┌─────────────────────────────┐
                                                 │  LANGGRAPH STATE GRAPH      │
   Method registry (finish-gate                  │  IDLE → PLANNING            │
   methods/INDEX.md) ──one Accepted────────────► │    (Research & Discovery    │
   method per problem, hard-fail otherwise       │     Log gate; method bind)  │
                                                 │  → EXECUTING (Pydantic-     │
   LanceDB memory (top-3 hydration               │    schema tools only)       │
   only) ──────────────────────────────────────► │  → EVALUATING               │
                                                 │    (finish-gate verifier    │
   Constitution (§4) compiled into               │     manifest routes the     │
   graph guards + tool layer                     │     graph; LLM critic is    │
                                                 │     ADVISORY only)          │
                                                 │  → SUCCESS / FAILED /       │
                                                 │    PARKED (exact blocker)   │
                                                 └──────────┬──────────────────┘
   SQLite run ledger ◄── every transition logged ─────────┘
   Langfuse traces ◄── every step: payload, tool in/out, loop-spiral watch
   Review packet ──► Kanboard "Owner review" column
```

- **Work source:** the finish-gate Kanboard queue (its API), WIP=1.
- **Trigger:** cron heartbeat on the existing 6h studio-orchestrator
  pattern — not a web UI button (owner's tail question, answered from the
  standing setup).
- **State of record:** SQLite run ledger (one state machine of record) +
  LangGraph's SQLite checkpointer for resume. Kanboard holds the human
  view; the ledger holds the truth.
- **Memory/context:** LanceDB (embedded, zero-infra) over the measured
  corpus (Phase 1 §4: ≈6–8k indexable text documents; media by metadata
  only). Embeddings local: `BAAI/bge-small-en-v1.5` via
  sentence-transformers. **Top-3 hydration only** — never raw corpus dumps
  (see §5, lost-in-the-middle).
- **Reporting:** the system submits artifacts to the finish-gate verifier.
  The verifier's manifest is the only PASS. The system's own report is
  generated from artifacts/hashes/measurements in that manifest.

## 2. MANDATORY RECONCILIATION — the Validator is not a model

The pasted stack specifies a Validator node that is "an independent model
pass." The finishing-loop research the owner also ordered measures that
design as the failure itself: LLM judges never beat AUROC 0.65, they grade
on confident closing language and action volume, and self-assessment is
where false success concentrates (75.8% of failures) versus 3% where an
independent process verified state; scorer visibility alone moved reward
hacking from 0.7% to 30.4% (METR). Evidence beats the paste:

- The graph's **Validator node routes on the finish-gate verifier's
  deterministic manifest** (per-clause pass/fail from real measurers).
- An LLM critic may run **ADVISORY only**: it produces retry feedback,
  capped iterations, in the zero-trust evaluator persona (§5). It can
  never issue, imply, or phrase a pass.
- The **PASS token exists only inside the verifier's manifest file**,
  which the agent system can read but cannot write (scorer separation:
  finish-gate is a separate git repo; the system has no write path to
  gates, thresholds, goldens, or methods).

## 3. Bill of materials — adopted

| Piece | Role | Licence (verified at source) | Bucket |
|---|---|---|---|
| LangGraph (`langchain-ai/langgraph`) | Orchestration core: stateful cyclic graph, conditional routing, checkpointing | **MIT** | open source |
| LangChain core (`langchain-ai/langchain`) | Glue where needed | **MIT** | open source |
| SQLite (system) + LangGraph SQLite checkpointer | Run ledger, graph state, resume | Public domain (SQLite) | open source |
| LanceDB (`lancedb/lancedb`) | Embedded vector memory, zero-infra | **Apache-2.0** | open source |
| sentence-transformers (`UKPLab/sentence-transformers`) | Local embeddings runner | Licence API route failed 3× (recorded); **verified at Phase-3 install from the installed package's own metadata before use** — if that check fails, embeddings fall back to sqlite-vec + a hash embedder and the gap is reported | open source (pending install-time proof) |
| `BAAI/bge-small-en-v1.5` weights | Embedding model (33M, 384-dim) | **MIT** (FlagEmbedding LICENSE, confirmed via model-card reporting) | open source |
| Kanboard 1.2.56 (already installed by finish-gate) | Work queue / human board | **MIT** (verified from installed source, finish-gate README) | open source |
| finish-gate verifier (owner's own, already built) | The only PASS issuer | Owner's code | owner |
| agent-ops vendored utilities (owner's own) | checkpoint format seed, supervisor triage ideas, instruction gate, local-CI pattern, worktree/upload tools | Owner's code | owner |
| Pydantic (`pydantic/pydantic`) | Every tool payload is a validated schema | **MIT** | open source |
| Pydantic AI (`pydantic/pydantic-ai`) | Validation layer for any LLM seat | **MIT** | open source |
| MCP python-sdk (`modelcontextprotocol/python-sdk`) | Tool comm layer | **MIT** | open source |
| Langfuse, self-hosted **core only** (`langfuse/langfuse`) | Traces per step: payloads, tool in vs out, loop-spiral detection | **Split licence, read in full:** everything outside `ee/` dirs is **MIT Expat**; `ee/` is under the Langfuse Enterprise License. We run core only and never enable ee code | open source (core) / paid (ee — not used) |
| promptfoo (`promptfoo/promptfoo`) | Eval suites: owner's real rejection cases as fixtures | **MIT** | open source |
| Inspect (`UKGovernmentBEIS/inspect_ai`) | Eval harness (secondary) | **MIT** | open source |
| Playwright (`microsoft/playwright-python`) | Browser execution substrate | **Apache-2.0** | open source |
| Browser Use (`browser-use/browser-use`) | Browser agent layer over Playwright | **MIT** | open source |
| Outlines (`dottxt-ai/outlines`) | Constrained decoding when an LLM seat is active | **Apache-2.0** | open source |
| FastAPI (`fastapi/fastapi`) | Read-only status surface over the ledger | **MIT** | open source |
| Ollama (`ollama/ollama`) | Optional local model seat | **MIT** (runner; each model's weights carry that model's own licence — verified per model before any use) | open source (runner) |
| llama.cpp / vLLM | Optional local inference alternatives | **MIT** / **Apache-2.0** | open source |
| DVC (`treeverse/dvc`) | Optional pointer layer for large artifacts staged to TeraBox | **Apache-2.0** | open source (optional) |

**Brain seats (all optional, none load-bearing, none can pass work):**
the deterministic method executor is the default seat — a registered
method names its implementing steps and the graph executes them through
the tool layer. LLM seats plug in behind one adapter for PLANNING help
and the ADVISORY critic only:

| Seat | Terms (verified 2026-10-28) | Bucket |
|---|---|---|
| OpenRouter free tier (`:free` models) | 20 requests/min; **50 requests/day** with no credits ever purchased; 1,000/day after a one-time $10 lifetime credit purchase. Caps are per-account, failed 429s still count, upstream providers add their own limits | **free proprietary, capped** — never labelled open source |
| Groq free tier | Per-model caps on the Free Plan (Groq limits page, as reported Oct 2026): ~30 RPM; larger models ≈1,000 req/day, 8K tokens/min, 200K tokens/day; smaller models higher request caps. Secondary sources conflict (14,400/day figures are stale); plan against the conservative numbers | **free proprietary, capped** |
| Ollama local | No caps, no cost; on this VM (measured: 2 CPU, 7 GB RAM, no GPU) only small models are practical | open source |

No API keys for OpenRouter/Groq are currently held, so the Phase-4 proof
runs on the deterministic seat. That is a stated limit, not a hidden one.

## 4. THE OPPOSITE-DEFAULTS CONSTITUTION

The system's defaults are the opposite of a managed assistant's. Each
default is implemented as code, policy, or gate in Phase 3 — the
"implemented as" column names where.

| # | Default | Implemented as |
|---|---|---|
| 1 | **DENY on "done"**: no artifact + no verifier manifest = not done; the system cannot self-certify | Graph has no edge to SUCCESS except through EVALUATING with a verifier manifest whose clauses pass; report generator reads only the manifest |
| 2 | **State machine, never a loose loop**: IDLE/PLANNING/EXECUTING/EVALUATING/SUCCESS/FAILED (+PARKED) | LangGraph nodes = states; every transition written to the SQLite ledger with timestamp + reason; illegal transitions raise |
| 3 | **Scorer separation**: workers cannot edit gates, thresholds, goldens, methods, or their own rubrics in the change they are graded by | finish-gate is a separate repo mounted read-only; tool layer has no write schema for its paths; guard-paths list compiled into the tool layer (from agent-ops' `guard-paths.sh` law) |
| 4 | **Deterministic pass**: LLM critic advisory only, capped retries; PASS only from the verifier | §2 reconciliation; retry cap in graph config (default 3), enforced by a counter in state, not by prompt |
| 5 | **Method registry**: exactly one Accepted method per problem; unregistered/superseded hard-fail | PLANNING resolves the card's problem class against `methods/INDEX.md`; a Superseded or missing method ends the run FAILED before any execution |
| 6 | **Pydantic-schema tools only**: no raw text-to-shell, no unvalidated file writes | Every tool is a Pydantic model; the execution layer accepts validated JSON payloads only; shell access exists only as a schema'd `run_registered_command` tool whose command must come from the method record |
| 7 | **WIP=1** from the finish queue; no breadth-first sprawl inside a run | Queue pull takes exactly one Ready card; the graph refuses a second card while a run is open |
| 8 | **Evidence attached or it didn't happen** | Run report is generated from artifact paths + sha256 + verifier manifest; prose claims are not generatable by the report code |
| 9 | **Stop-on-fail**: a failed gate routes back with the specific defect or parks with the exact blocker; never papers over, never substitutes a proxy metric as the headline | EVALUATING routes on per-clause failures verbatim; PARKED requires a `blocker` field naming the exact missing thing |
| 10 | **Owner standards compiled in**: grading law (wrong character = fail), current-version law, no-baked-shadows, staging law, no-idle-on-approval | Encoded as target clauses + tool-layer path/staging guards + the registry checks the verifier already enforces; a pending approval parks only its own run, never the queue |

## 5. Anti-sycophancy layer + anti-laziness pipeline (owner addendum 2)

**Anti-sycophancy (every node, by construction):**
- (a) Hard prompt constraints on any LLM seat: no praise, no validation
  openers, no agreeing with an assumption that contradicts the codebase
  or registries. **Inter-agent messages are schema JSON only, never
  prose** — enforced by the tool layer, which has no free-text channel.
- (b) **First-person scrubbing**: the orchestrator programmatically
  rewrites task text into objective third-person instructions before it
  reaches a worker (pronoun/possessive patterns stripped by a sanitizer
  function with tests) — no "fix this code I wrote" anchoring.
- (c) **Zero-trust evaluator persona** for the advisory critic: a strict
  auditor whose job is to find failure reasons. It never compliments and
  never passes (it cannot — §2).
- (d) **Negative sampling**: the critic's fixtures are concrete FAILED
  outputs — the owner's real rejection cases: the wrong-character frame-1
  (VACE proof, frame-1 MAD 50.96/255), slideshow-as-animation (EP01 v3,
  owner-labelled "Microsoft Word slideshow bullshit draft number one"),
  paperwork-only completion claims (attempt-2's log-with-no-clip).
  Rejection has examples, not just rules.
- (e) **Never ask a model "are you sure?"** Certainty is established only
  by code inspecting artifacts, logs, and exit codes.

**Anti-laziness pipeline:**
- (a) **Mandatory Research & Discovery Log** before any execution: a
  schema-enforced record (knowns, unknowns, files to read, assumptions).
  The graph has no edge PLANNING → EXECUTING that skips it.
- (b) **Exit-code truth**: generated work is dropped into a sandbox and
  run against the real test/gate suite. Process exit code 0 **plus** the
  verifier manifest is the only advance signal. Raw stack traces feed
  the retry loop **unedited**.
- (c) **Lost-in-the-middle countermeasure**: no whole-corpus prompt
  dumps — top-k retrieval hydration only. This failure mode is the
  named reason for the top-3 rule in §1.
- (d) **No first-pass code**: planner output is a plan + discovery log,
  never a patch. Execution is a separate state that consumes the plan.

## 6. Rejected / deferred, with reasons (all licences verified as above)

| Candidate | Licence | Verdict |
|---|---|---|
| Temporal (`temporalio/temporal`, SDK) | MIT / MIT | **Deferred, not rejected.** Genuine durable engine, but on this VM (measured 2 CPU / 7 GB RAM) its server is a second heavyweight service, and running two state machines (Temporal + LangGraph) creates split-brain state — the constitution requires one state machine of record. Seam kept: if multi-day or multi-worker runs appear, Temporal becomes the dispatch layer under the same graph. |
| Celery | BSD-3-Clause (LICENSE file text) | **Rejected**: task queue, not a state graph; needs a broker service (Redis/RabbitMQ) this job doesn't otherwise need; no workflow-state semantics. Loose loops are forbidden by the design. |
| RQ | BSD (LICENSE text) | Rejected: Redis dependency, queue-only, same as Celery. |
| Dramatiq (`Bogdanp/dramatiq`) | **LGPL-3.0** (COPYING + COPYING.LESSER) | Rejected: copyleft + broker dependency + queue-only. |
| Hatchet (`hatchet-dev/hatchet`) | MIT | Deferred with Temporal: Postgres-backed service; same one-state-machine argument. |
| Prefect / Dagster | Apache-2.0 / Apache-2.0 | Rejected: each is its own orchestrator/server — adopting one makes a second state machine and a second UI the owner must watch. |
| Inngest (`inngest/inngest`) | **SSPL-1.0** ("Apache 2.0 Future License") | **Rejected: not open source.** Server Side Public License is not OSI-approved; fails the free/open verification for a core component. |
| n8n (`n8n-io/n8n`) | **Sustainable Use License** + enterprise carve-outs (LICENSE.md read in full) | **Rejected: source-available, not open source** — and a second orchestrator besides. |
| CrewAI | MIT | Rejected on fit, not licence: role-play multi-agent prose loops violate schema-only inter-agent messages and the no-loose-loops rule. |
| AutoGen / AG2 | code MIT (LICENSE-CODE), docs CC-BY-4.0 / Apache-2.0 | Rejected on fit: conversational agent patterns; same loose-loop problem. |
| Phoenix (`Arize-ai/phoenix`) | **Elastic License 2.0** | **Flagged: NOT plain Apache, NOT OSI open source** (the paste's implied claim is wrong). Not installed. Langfuse core covers telemetry; Phoenix may only ever be an optional local viewer if the owner accepts ELv2 terms. |
| lakeFS (`treeverse/lakeFS`) | **Business Source License 1.1** | Rejected: not open source. Git + DVC pointers cover the need. |
| MLflow | Apache-2.0 | Rejected on weight: experiment-tracking server for a problem the ledger + manifests already solve. |
| Qdrant | Apache-2.0 | Rejected on fit: a server process where LanceDB is embedded in-process; at ≈6–8k documents the server buys nothing. |
| Chroma | Apache-2.0 | Evaluated; LanceDB preferred (single embedded store shared with the graph process, Arrow-native). |
| Letta / Mem0 | Apache-2.0 / Apache-2.0 | Rejected on fit: agent-memory frameworks that want to own the loop — conflicts with the single state machine. Memory here is retrieval + ledger, not a second agent runtime. |
| sqlite-vec | Apache-2.0 (dual MIT) | Kept as the documented fallback embedder store if LanceDB installation fails. |
| LiteLLM | MIT core, `enterprise/` carve-out (LICENSE read in full) | Not needed: one adapter in our own code covers the two optional remote seats. If adopted later, core only. |
| Skyvern | AGPL-3.0 | Rejected: strong copyleft + hosted-service gravity; Browser Use + Playwright covers the seat. |
| Stagehand | MIT (SDK) | Not adopted: its hosted browser service (Browserbase) is paid; the local SDK adds nothing over Browser Use here. |
| Guardrails AI / NeMo Guardrails | Apache-2.0 / **unverified** (API route failed repeatedly) | Guardrails AI optional later. NeMo Guardrails **not adopted — licence unverified at source**, per the honesty law it cannot enter the BoM on a claim. |
| Ragas / DeepEval | **unverified** / Apache-2.0 | Ragas not adopted (licence unverified via the API route). DeepEval optional; promptfoo + Inspect already cover evals. |

## 7. HONESTY CLAUSE — what this stack does NOT do

**This system does not retrain a foundation model, and nothing in it is
"training" in the machine-learning sense.** The "opposite training" the
owner ordered is: constitutional prompts on every node, policy-as-code
(the constitution in §4 as graph guards and tool-layer checks), strict
schemas, eval suites whose fixtures are the owner's real rejection
cases, and hard verifier gates that no model output can override. A
local open-model fine-tune (e.g. an Ollama-served model tuned on owner
verdicts) may be added later as an optional layer for the advisory
seats — it is never the load-bearing control, and this document does
not claim otherwise.

## 8. Triggers and corpus (owner's tail questions, settled)

- **Triggers:** Kanboard queue (work source) + cron heartbeat (6h
  studio-orchestrator pattern). A run can also be started by hand from
  the CLI for the Phase-4 proof; the trigger does not change the graph.
- **Corpus:** measured in Phase 1 §4 — repo 22,165 files ≈1.0 GB with
  13,157 media files (59%); indexable text ≈6–8k documents across repo
  docs, `show/production/`, and the workspace research/teardown
  libraries. Retrieval is sized for exactly this: metadata + text
  embeddings, top-3 hydration, media never content-dumped.
