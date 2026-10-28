# THE CAN'T-LIST — appendix

Each item is worded from this project's record: a thing the managed
assistant could not do, turned into a Wielder feature requirement.
This list is the acceptance test for "opposite defaults" — if a future
change reintroduces one of these behaviours, the change is wrong.

| # | The record ("can't") | Wielder feature requirement | Where it lives |
|---|---|---|---|
| 1 | "Set allow permanently" — the agent cannot change permission settings; the owner taps allow forever | **Standing Authorization Ledger**: lasting grants per action class × scope; a granted class never prompts again; every use audit-logged; revocable in chat at any time | `wielder/authz.py`; `wielder/standing-authorizations.json`; chat + CLI grant management |
| 2 | Work stopping between owner visits / behind approval cards | **Unattended runtime + no-idle topology**: supervised heartbeat drains the queue; a park blocks only its own branch; "waiting on the owner" is a per-action audit state, never a system state | `deploy/wielder.service`; `wielder/scheduler.py`; owner-gate interrupt in `wielder/graph.py` |
| 3 | "Only the browser/owner can do this" (a TeraBox upload parked as an owner's session) | The browser is a first-class declared door; that claim string is **rejected** unless a named hard blocker (physical act, unshared credential, payment/identity card) is attached | `wielder/doors.py`; `wielder/linter.py` |
| 4 | "Waiting on Kaggle" behind an API rate limit | **Multi-door router**: every external job declares API / CLI / browser doors up front; a 429 reroutes to the next door — a job is never parked as waiting-on-a-service | `wielder/doors.py`; Kaggle framing in CAPABILITY-MATRIX.md |
| 5 | The avatar video tool firing only for avatar requests, unusable for episode characters | Wielder's animation stack is **general-purpose by construction**: registered methods + the wired generation stack serve any character the registry names — no slot scoping anywhere in the tool layer | method registry binding in `wielder/graph.py` (any target, any character) |
| 6 | The owner having to catch false completion claims himself | **Evidence-only status**: status is generated from artifacts/hashes/measurements; the verifier is the only PASS issuer; the claim linter rejects unsupported completion language | `wielder/judgment.py`, `wielder/linter.py`, `wielder/report.py` |
| 7 | The owner re-explaining settled rulings | **Rules-registry check before execution**: settled rulings are compiled into `rules.json` and checked at planning — never re-litigated, never re-asked | `wielder/rules.py`, `wielder/rules.json` |
| 8 | Progress language instead of finished work | A run ends in exactly two reportable states: **a manifest + packet**, or **a named blocker**. There is no third state to report | the graph's terminal routing; `wielder/report.py` |

## The honest exception set (final, written up front)

These remain **owner acts** — by the providers' design, not Wielder's,
and no standing grant can cover them:

1. **Payment approvals** on external cards.
2. **Provider identity checks** (the provider insists the human prove
   they are the human).
3. **A credential the owner has never shared** — Wielder cannot grant
   itself access it was never given; the one-step ask is produced
   instead (see PROVENANCE.md §D for the current asks).

Everything else the owner can permanently allow. This list changes
only if a provider changes its rules.
