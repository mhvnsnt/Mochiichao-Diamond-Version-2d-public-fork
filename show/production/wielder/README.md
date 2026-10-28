# WIELDER

**Wielder is a production Agentic AI system — an autonomous multi-agent
production system — for the Mochiichao show.** It takes cards from the
show's finish queue, executes them with the one registered method for
their problem, submits the artifacts to the finish-gate verifier, and
produces the owner's review packet. It cannot declare its own work done:
the verifier's manifest is the only "done" that exists.

Wielder was **assembled, not invented**: ten production pillars, each a
real, already-built system, wired together by a thin layer of gap-fill
code. Every piece is listed in `PROVENANCE.md` with its source, its
licence verified at the licence file, and its hash or version. If a
piece is not in the manifest, it is not claimed as part of Wielder.

## The ten pillars

| # | Pillar (as assembled in Wielder) | What it does here |
|---|---|---|
| 1 | **LangGraph state graph** (official package, MIT) | The backbone: the ReAct loop as explicit nodes + conditional routing on a state machine, with SQLite checkpointing, time-travel rewind, and the owner gate as an interrupt node |
| 2 | **MCP tool protocol** (official python-sdk, MIT) | The tool comm layer: Wielder's tools are exposed over MCP with the same schemas the graph uses internally |
| 3 | **Pydantic AI validation** (MIT) | Every tool payload and inter-agent message is a validated Pydantic schema — no raw text-to-shell, no free-text channels |
| 4 | **SQLite state/audit** | The run ledger: every state transition, tool call, locked input hash and failure-taxonomy row, in one state machine of record |
| 5 | **LanceDB memory** (Apache-2.0) | Embedded vector memory over the show/game corpus; top-3 retrieval hydration only — whole-corpus prompt dumps are forbidden |
| 6 | **Durable execution** (graph checkpointing + ledger + cron heartbeat) | Runs survive crashes and resume from the last verified state; a Temporal-class engine is a documented seam, deliberately not a second state machine |
| 7 | **Langfuse telemetry** (self-host core, MIT) | Trace mirror for steps/payloads/tool in-vs-out. Status in PROVENANCE.md: if the self-host stack is not serving, the SQLite ledger + per-run packets are the telemetry of record and Langfuse is recorded as a gap, never claimed wired |
| 8 | **Browser Use + Playwright** (MIT / Apache-2.0) | The browser door for external jobs (declared in the multi-door router; live-browser steps execute through the browser lane, never faked) |
| 9 | **The finish-gate verifier** (owner's system) | The only PASS issuer: deterministic measurers, evidence manifests, the owner gate. Wielder submits artifacts; it holds no write path to gates, thresholds, goldens, methods or manifests |
| 10 | **The Kanboard finish queue + method registry** (Kanboard MIT; registry owner's) | The work source (WIP=1 pull) and the law of methods: exactly one Accepted method per problem; superseded methods hard-fail at planning |

Plus the owner's earlier agent system, vendored literally under
`vendor/agent-ops/` (checkpoint format, supervisor triage, the
instruction gate, local-CI pattern, path guards) — the donor system
Wielder's protocol layer grew from.

## Wielder defaults

Wielder's settings ship as **`wielder.config`** in this package — the
opposite-defaults constitution as configuration, not library defaults:
default-deny completion (no artifact + no verifier manifest = not
done), WIP=1, capped advisory-critic retries (3), stop-on-fail routing,
no raw shell, schema-only tools, step/time budgets per run, and the
owner's standards compiled in (grading law, current-version law,
no-baked-shadows, staging law, no-idle-on-approval).

## Managing Wielder

The manager (Doro) runs Wielder through its CLI — no code editing:

```
wielder queue            # the finish queue: columns + cards
wielder run-once         # pull one Ready card, run the full loop
wielder run-queue        # process Ready cards; a parked card never blocks the rest
wielder runs             # recent runs from the ledger
wielder status <run>     # one run: state, transitions, tool calls
wielder packet <run>     # the run's evidence packet
wielder resume <run>     # resume a run paused at the owner-gate interrupt
wielder rewind <run>     # list the run's checkpoints (time-travel surface)
wielder pin-request …    # convert an owner rejection into a regression-pin request
wielder seats            # measured brain-seat availability
wielder board-check      # is the finish queue serving?
```

Brain seats are pluggable and never load-bearing: the deterministic
method executor is the default seat; Ollama-local and OpenRouter free
tier (free proprietary, capped — see STACK.md) plug in for planning
help and the advisory critic only. The advisory critic runs the
zero-trust auditor persona with the owner's real rejection cases as
negative fixtures; it can never issue a pass.

## Wielder's home + lift-out design

Wielder's home is **`show/production/wielder/`** in the Mochiichao
fresh-start repo — this package, landed whole by the repo lane. It is
**self-contained**: its own README (this file), its own manifest
(`PROVENANCE.md`), its own pinned dependencies (`requirements.txt`),
its own config (`wielder/wielder.config`), its own defaults and data
layout. Contact with the rest of the repo and the VM happens **only
through the documented interfaces** in `WIRING.md` (the finish queue's
board API, the method registry files, the verifier CLI, the retrieval
corpus). **Lift-out rule:** cloning Wielder into its own standalone
repo later is a clean lift of this one folder — no surgery. Two
consequences are designed in: (1) Wielder code never reaches outside
its documented interfaces (paths to the finish-gate are configuration
in `wielder/constitution.py`, one place); (2) live state
(`wielder/data/` — ledger, checkpoints, memory index, packets) is
runtime data that regenerates on the machine Wielder runs on; the repo
carries the system, not the state.

## Layout

- `wielder/` — the gap-fill wiring (graph, schemas, tool layer, ledger,
  queue client, registry resolver, critic, judgment, pinning, doors,
  rules, linter, scrubber, authz, desktop, scheduler, delegate,
  upgrades, chat, dashboard, MCP surface, CLI)
- `wielder/vendor/agent-ops/` — the owner's earlier agent system,
  vendored literally (see PROVENANCE.md for per-file hashes)
- `wielder/wielder.config` — Wielder defaults (the constitution)
- `wielder/rules.json` — the compiled standing-law registry
- `wielder/standing-authorizations.json` — mirror of the Standing
  Authorization Ledger (Addendum 12)
- `wielder/fixtures/rejection-cases.json` — negative-sampling fixtures
- `chat_app.py` — the chat launcher (Chainlit pillar, :8897)
- `wielder-cli.sh` — the manager launcher
- `requirements.txt` — pinned dependencies, running-verified
- `deploy/` — `wielder.service` (unattended runtime) + `STASH-MANIFEST.md`
  (provisioning stash)
- `PROVENANCE.md` — the component manifest (source / licence / hash / wired-or-gap-fill)
- `THIRD-PARTY-NOTICES` — pillar licence notices (they stay, by law and by licence)
- `CAPABILITY-MATRIX.md`, `CANT-LIST.md`, `EXTRACTION.md`, `ROUTING.md`
- `WIRING.md` — every real file/system Wielder touches
- `STACK.md`, `AUDIT.md` — the stack record and the donor-system audit
