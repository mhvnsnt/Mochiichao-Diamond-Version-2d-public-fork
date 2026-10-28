# EXTRACTION — Muse reverse-engineered into WIELDER

Sources, all on this machine, all read directly during assembly
(2026-10-28):

1. **`~/workspace/system/system_prompt.md`** — 72,970 bytes, 513 lines:
   the runtime's own saved copy of the live system prompt. The closest
   thing to "the platform's code" that exists on this VM.
2. **`/opt/muse/skills/`** — 56 product skill playbooks, full readable
   text; each is a behaviour spec (workflow, guardrails, failure
   handling). Wielder capability cards below cite the pattern, not the
   product's prose.
3. **`/opt/hatch/connectors/`** — 68 connector docs + 105 CLI tools in
   `/opt/hatch/bin`: the tool-surface specs. Wielder's MCP tool
   catalogue mirrors these capabilities where the underlying service
   is the owner's own account (GitHub first — wired and smoke-tested).
4. **`~/docs/`** — the product documentation set (browser, scheduling,
   memory, goals, artifacts, feed/ideas, payments approvals, privacy).

**Out of scope, one line:** the phone app's binary and the model's
weights do not exist on this machine — neither ever touches this VM;
the VM is the workspace the app talks to, and everything the app does
through this workspace is documented in sources 1–4 above.

**The one honest substitution:** the model itself is not code that
exists here to copy. Wielder's brain is the connector layer (Ollama
local / free-tier APIs). Everything AROUND the model — tools, memory,
scheduling, browser control, delegation, gating, routing — is what was
extracted and rebuilt, with the opposite-defaults constitution
replacing the platform's defaults wherever the two differ.

## THE INVERSION TABLE

**Scope rule (owner, 2026-10-28 — surgical, not total):** the
extraction carries the platform's capabilities, workflows, interface
behaviour and settings over **as they are**, and flips a default ONLY
where the owner has identified that default as a cause of failed work
here. The table therefore has exactly two row types:

- **FLIP** — complaint-mapped defaults. Each row cites the owner's
  complaint / the audited failure it answers. The flip list is the
  twelve counter-additions plus the anti-sycophancy / anti-laziness
  set — nothing joins the flip list without a named failure behind it.
- **KEEP** — everything else, carried over unchanged so Wielder stays
  familiar and usable like the platform it was extracted from. If a
  behaviour is neither complaint-mapped nor needed for a capability,
  it is KEEP by default.

### FLIP rows

Clause-by-clause: each behavioural default in the saved system prompt
that maps to an owner complaint in this project's audited failure
record, and the Wielder default that replaces it. The Wielder column
is the operative text — it is what `wielder.config` +
`wielder/constitution.py` encode.

| # | Platform default (source clause in system_prompt.md) | Failure it produced here | WIELDER default (inversion) | Encoded in |
|---|---|---|---|---|
| 1 | "You are warm, helpful and a bit playful" + Fun: "Say yes to the bit. Match the user's energy" | Agreeable tone defaults; validation-first replies; sycophancy | No praise, no validation openers, no yes-by-default on any node. Inter-agent messages are schema JSON only, never prose | constitution.py NODE_PROMPT_CONSTRAINTS; schemas.py |
| 2 | Connection/Curiosity: be a present companion; assume the user's framing | Agreeing with assumptions that contradict the codebase/registries | Never agree with an assumption that contradicts the codebase, registries, or a manifest. The advisory critic runs a zero-trust auditor persona whose job is to find failure reasons | constitution.py CRITIC_PERSONA; critic.py |
| 3 | Tools rules: "State facts based on what a tool returned" (a prose rule the agent applies to itself) | Claims repeated from labels/logs/other reports collapsed on contact with the artifact ("COMPLETE" with no clip; "image was fed"; "motion proven") | Status cannot be authored at all: the evidence-only status node generates status FROM the measurement (hash, bytes, frames, exit codes); the claim linter rejects done/wired/proven/pass sentences without a manifest id + hash | judgment.py; linter.py; report.py |
| 4 | Keeping Track: "account for every open task as it actually stands" (self-reported status) | "In flight / prepared / not claimed as done" status language as a deliverable | Default DENY on done: no artifact + no verifier manifest = not done. Run state is read from the SQLite ledger, never narrated | wielder.config default_deny_completion; ledger.py |
| 5 | Proactivity + Thoughtful follow-through: "look for the additional step"; surface suggestions proactively | Scope widening; owner re-teaching settled wants; turns wasted re-explaining | WIP=1 inside the card's scope. Follow-through exits as an upgrade card, not scope drift. Settled rulings are compiled into the rules registry and checked before execution — never re-litigated, never re-asked | wielder.config wip_limit; rules.py + rules.json; upgrades.py |
| 6 | Approvals: "Some tool calls will natively trigger an approval… you cannot trigger those approvals yourself" — work waits on cards | Whole programme stalling behind one pending approval | No-idle topology: an approval parks only its own run (owner-gate interrupt node); every other card keeps moving; the manager drains the queue with run-queue | graph.py owner_gate; scheduler.py; wielder.config no_idle_on_approval |
| 7 | "Never guess how long work will take… state the last observed status" (self-discipline) | Estimates and momentum claims in place of state | Budgets are numbers in config (steps/wall-seconds); state is whatever the ledger's last transition says; a budget stop parks at the last verified checkpoint, rewindable | wielder.config budgets; graph.py execute; cli.py rewind |
| 8 | Subagents: delegate, "briefly acknowledge", results arrive as handoffs; "a failed report does not show that nothing happened" | Delegated claims accepted at face value; receipts mistaken for completion | A delegation is a full child run graded by the same verifier; the parent cites the child's PACKET (generated from artifacts). A routing receipt is explicitly "not execution, not completion" | delegate.py; tools.py request_browser_job |
| 9 | Scheduled work: "Verify actual execution and delivery; a schedule is not proof of either" | Cron existence treated as work happening | The heartbeat polls the queue and the LEDGER is the record: no ledger run, no run happened. Timing described as polling, honestly | scheduler.py |
| 10 | Memory: "check memory before saying what is or is not saved" | Saved-state claims from recollection | The digest is GENERATED from the ledger (`wielder digest`); retrieval is top-3 with read receipts — cited files are hashed, uncited claims rejected at preflight | cli.py digest; memory.py; graph.py preflight |
| 11 | Writing style: "hand it over in the same message… announcing readiness and making the user go find it is a failure" | Results announced, artifacts elsewhere | The chat pillar delivers the packet IN the conversation: artifact link + manifest summary + run state, nothing to go find | chat.py (Chainlit pillar) |
| 12 | Error reporting: "plainspoken terms instead of error codes and raw error messages" | Plain language smoothing over the actual defect | Internally: raw stack traces feed the retry loop UNEDITED; packets carry measured values verbatim. Plain language wraps the measurement for the owner; it never replaces it | graph.py (raw_output unedited); report.py |
| 13 | "Never say you did or checked something without the matching action behind it" | (Held as a rule; failed in practice under prose self-report) | Structural: there is no code path by which Wielder can emit a checked/did claim — reports are generated from ledger rows and tool results only | report.py (no free-prose path) |

### KEEP rows — carried over unchanged

Everything not complaint-mapped stays as the platform does it, so
Wielder is familiar to anyone who knows the platform:

| Platform behaviour (source) | Wielder, unchanged |
|---|---|
| Conversational chat as the primary surface; the user talks, work happens (system_prompt.md §Who You Are) | The Chainlit chat pillar: same talk-to-it shape, same plain-language replies |
| Plain-language reporting to the owner; no spec jargon (Writing Style) | Packets and chat replies are written plainly; measurements ride verbatim inside them |
| Timing described as approximate; never promise exact detection moments (scheduling doc) | Heartbeat described as polling on an interval, loosely timed |
| Delegation shape: outcome + constraints + only-needed information to the worker (Subagents) | `delegate.py` child runs take a scope note; the shape is the platform's |
| A task stays open until its result reaches the user (Keeping Track) | Runs stay open in the ledger until the packet is generated and relayed |
| Memory checked before claiming what is saved (Memory doc) | The digest is generated from the ledger before any saved-state statement |
| Skills/playbooks as reusable behaviour specs (56 in /opt/muse/skills/) | Wielder's registered methods are the same idea in production dress: named, versioned, the one way a problem gets solved |
| Connector docs as the tool-surface spec per service (68 in /opt/hatch/connectors/) | Wielder's MCP tool catalogue mirrors connector capabilities for the owner's own accounts |
| Goals as durable outcomes with progress history (~/docs/goals.md) | The finish queue + upgrade loop carry durable outcomes; progress = ledger history |
| Artifacts handed over in the same message, never announced-and-elsewhere (Writing Style) | Packets delivered in chat with the artifact path + manifest summary inline (inversion row 11 is the enforcement, the behaviour is KEEP) |
| Background results surface only when meaningfully new (Scheduled Work) | The heartbeat is silent on no-op cycles; parked blockers and finished packets are what surface |
| User can watch or take over live work (browser doc) | The owner watches runs via the dashboard + chat; the owner gate is his takeover point by design |

## Capability cards (priority set — the capabilities the show runs on)

**Browser execution.** Documented behaviour (~/docs/browser.md): a
browser task is a window carrying an outcome + constraints + only the
information it needs; one sign-in serves all work; results arrive as
handoffs; an acceptance receipt is not completion; the user can watch
or take over. Wielder equivalent: the multi-door router declares the
browser door for external jobs; `request_browser_job` writes a job
packet (intent + steps) for the manager's browser lane and returns a
receipt explicitly marked not-execution. Guardrail carried over: a job
is never parked as "only the owner can do this" without a named hard
blocker (linter-enforced).

**Scheduled / background work.** Documented (~/docs/
scheduling-and-watching.md): polling not watching, loose timing,
workers report as handoffs, interrupted runs resume or are recorded
stopped. Wielder equivalent: `scheduler.heartbeat` (default 6h, the
standing studio-orchestrator pattern) + `wielder heartbeat --once` for
cron; cycles recorded in the ledger.

**Persistent memory.** Documented (~/docs/memory.md): lasting facts,
checked before claimed, background upkeep. Wielder equivalent:
LanceDB retrieval + the SQLite ledger + `wielder digest` (a generated
DIGEST.md in the same file spirit as the platform's memory files).

**Delegation to sub-workers.** Documented (system_prompt.md §Subagents
+ inversion row 8). Wielder equivalent: `delegate.py` child runs.

**Artifact / file production.** Documented (~/docs/artifacts.md):
deliverables the user opens and keeps; an artifact's data lives in the
user's own environment. Wielder equivalent: run packets + evidence
manifests (`wielder artifacts` lists them with hashes); deliverables
stage to GitHub/TeraBox per the staging law.

**Approval / evidence flow.** Documented (~/docs/
payments-and-purchases.md + privacy-and-credentials.md): each
consequential action gets its own review; approvals are the user's,
never the agent's to trigger or control. Wielder equivalent, inverted
where the defaults differ: the owner gate is a graph interrupt — the
run pauses durably, the owner rules through the gate's own recording
scripts (or the chat's approve/deny, which invokes those same
scripts), and only then does the graph resume and re-read the
manifest.
