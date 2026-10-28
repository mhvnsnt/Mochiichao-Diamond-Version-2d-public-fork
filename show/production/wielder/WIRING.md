# WIELDER — WIRING

Every real file and system Wielder touches, named. If it is not listed
here, Wielder does not touch it.

## Reads (no write path exists in the tool layer)

| System / file | What Wielder does with it |
|---|---|
| `~/workspace/ep01-rebuild/finish-gate/methods/INDEX.json` | Method binding at PLANNING (Accepted check; superseded hard-fails) + provenance lock hash |
| `~/workspace/ep01-rebuild/finish-gate/methods/records/*.md` | Cited by the registry records; read by the manager, not parsed by the graph |
| `~/workspace/ep01-rebuild/finish-gate/targets/<id>.json` | The run's contract: artifact path, method ids, owner-gate state at plan time |
| `~/workspace/ep01-rebuild/finish-gate/evidence/<deliverable>.json` | Read after each verifier run — the ONLY pass source; hashed into the run record |
| `~/workspace/ep01-rebuild/finish-gate/review/<id>/` | The verifier's own owner packets live here; Wielder's packets live in its own data dir (below) and cite these |
| The game repo registries (via LanceDB index) | Retrieval hydration (top-3) from indexed text: repo docs, show/production markdown, workspace research — media by metadata only |
| Kanboard SQLite (`finish-gate/board/kanboard/data/db.sqlite`) | Door 2: read-only task reads when the API door is down |

## Executes (through the schema'd tool layer only)

| System | How |
|---|---|
| `~/workspace/ep01-rebuild/finish-gate/verify <target-id> [--skip-gate-run]` | Subprocess via the `run_verifier` tool. Wielder cannot write evidence/ — verify is the sole author of manifests. Wielder also runs it on `calib-defect-planted` as the gate-calibration pre-flight |
| Registered method scripts (`methods/INDEX.json` → `implementing[]`) | Via `run_registered_script` — only scripts named in an Accepted method's record, only with schema'd args |
| Kanboard JSON-RPC API (127.0.0.1:8899) | Queue pull (WIP=1), card moves (Doing / Owner review / Ready / Done), comments, the Done-rule description update, upgrade-card creation. Auth from env `WIELDER_BOARD_AUTH`, defaulting to the board's documented local default (finish-gate/board/ADMIN-NOTE.txt); never printed |
| The board server itself | Started with finish-gate's own `board/start_board.sh` (PHP 8.3.6 built-in server) when down |

## Writes (Wielder's own ground only)

| Path | What |
|---|---|
| `wielder/data/ledger.sqlite` | Run ledger: runs, transitions, tool calls, inputs (provenance lock), failures (taxonomy) |
| `wielder/data/graph.sqlite` | The graph's checkpoint store (time-travel / resume) |
| `wielder/data/lancedb/` | The memory index |
| `wielder/data/runs/<run_id>/` | `packet.md`, `self_judgment.md` per run |
| `wielder/data/pins/` | Regression-pin REQUESTS (application stays with the gate lane) |
| `wielder/data/browser-jobs/` | Browser-job packets for the manager's browser lane |
| `wielder/data/delegations/` | Delegation records (parent ↔ child run) |
| `wielder/data/chat.sqlite`, `wielder/data/chat-uploads/`, `wielder/data/DIGEST.md` | Chat pillar history, attachments (hashed into provenance), memory digest |

## Never touches (structural, not promised)

- `finish-gate/gates/`, `methods/`, `targets/`, `goldens/`, `evidence/`,
  and the `verify` script: the tool layer raises GuardError on any
  write under these prefixes (constitution.py SCORER_OWNED_PREFIXES;
  test-covered). Gate changes — including the owner-verdict edits that
  `review/record_verdict.py` makes — are the gate lane's own commits.
- The game repo: Wielder lands there only as this package, through the
  repo lane's PR process (`show/production/wielder/`).
- Wielder's own constitution/config: upgrades are proposed as queue
  cards and land through the same gates as all other work (Addendum 7D).

## Trigger wiring

- Manager CLI (`wielder run-once / run-queue / heartbeat --once`) —
  live now.
- Cron heartbeat: the standing 6h studio-orchestrator pattern; the
  package ships the heartbeat (`wielder/scheduler.py`); the cron job
  definition itself is created by the manager on the owner's word
  (a scheduled job is persistent state — it is not created silently
  from inside an assembly run).
- Chat: `chainlit run wielder/chat.py --host 127.0.0.1 --port 8897`
  starts with the stack; one local URL.
