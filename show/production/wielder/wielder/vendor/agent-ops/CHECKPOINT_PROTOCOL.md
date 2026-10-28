# Checkpoint Protocol

How workers save progress so a machine/daemon restart doesn't destroy their work.
Honest scope: **this cannot prevent restarts.** It makes every restart survivable:
a re-spawned worker reads its checkpoint and continues instead of starting over.

Canonical tool: `checkpoint.sh` (in this directory). All commands below use it.

## When to checkpoint

Every worker on a multi-step task must:

1. `init` a checkpoint as its **first** action, with `--goal` and `--resume-prompt`.
2. `beat` at least every 10 minutes during long runs (cheap heartbeat).
3. `step` after each completed unit of work (per card, per model, per batch item).
4. `next` whenever the plan changes; `decide` for anything a future resume must honor.
5. `status completed` when done; `status failed`/`stalled` with the reason when stuck.

If you only checkpoint at the end, you have no checkpoint.

## Schema

`checkpoints/<task_id>.json`:

| Field | Type | Meaning |
|---|---|---|
| `task_id` | string | Filename-safe id, e.g. `judas-cards` |
| `agent_id` | string\|null | Worker agent id (for tracing) |
| `repo` | string\|null | e.g. `mhvnsnt/AshLanev2` |
| `branch` | string | Working branch, default `main` |
| `goal` | string | One-line: what the task is trying to achieve |
| `status` | enum | `running` `completed` `failed` `stalled` |
| `spawned_at` | ISO-8601 UTC | When the task started |
| `last_heartbeat` | ISO-8601 UTC | Last `beat`/`step`/`next`/`decide`/`status` |
| `steps_completed` | [{at, step}] | Done units. **Do not redo these.** |
| `next_steps` | [string] | Where to continue |
| `key_paths` | [string] | Files/dirs the work lives in |
| `decisions` | [{at, decision}] | Binding unless the parent overrides |
| `blockers` | [{at, blocker}] | What's stopping progress |
| `resume_prompt` | string\|null | The brief a re-spawned worker should follow |

Writes are atomic (temp file + rename). A restart mid-write never leaves a
half-written checkpoint.

## Commands

```
checkpoint.sh init TASK_ID --goal "..." [--repo R] [--branch B] [--agent-id ID] [--resume-prompt "..."]
checkpoint.sh beat TASK_ID
checkpoint.sh step TASK_ID "rendered judas-classic.webp"
checkpoint.sh next TASK_ID "render remaining 4 variants"
checkpoint.sh path TASK_ID "~/workspace/judas-cards/"
checkpoint.sh decide TASK_ID "keep all attires, never exclude versions"
checkpoint.sh block TASK_ID "waiting on Tripo export from owner"   # -> status=stalled
checkpoint.sh unblock TASK_ID                                       # -> status=running
checkpoint.sh status TASK_ID completed|failed|stalled|running
checkpoint.sh agent TASK_ID <agent-id>
checkpoint.sh show TASK_ID
checkpoint.sh list
```

## Reading someone else's checkpoint

The supervisor (`supervisor.sh`) is tolerant of ad-hoc schemas — a worker that
writes its own JSON by hand still gets flagged correctly. But workers SHOULD use
`checkpoint.sh`: uniform schema means the re-spawn brief is complete
(steps, next, paths, decisions, blockers).

## The resume contract

A re-spawned worker must read, in order:
1. `checkpoints/<task_id>.json`
2. `RESUME_BRIEF_TEMPLATE.md`
3. `IDEMPOTENCY.md`

...then **verify** (does the repo/outputs match what the checkpoint claims?)
before continuing. If the checkpoint is missing or unreadable: do not guess —
report to the parent agent.
