# COUNTER-ADDITIONS CHECKLIST — the twelve, each with its evidence

Addendum 7A: no row ships without evidence — in the live run
(W-c2dd9e831bad, 2026-10-28; packet + manifest in phase4-proof/) or in
a named test/artifact. A blocked row names its blocker and substitute.

| # | Counter-addition | Evidence |
|---|---|---|
| 1 | Evidence-only status node + claim linter | LIVE: the packet for W-c2dd9e831bad was generated from the ledger + manifest (sha256 `d86dc95b…`) and passed `wielder/linter.py` before writing; test `test_claim_linter_rejects_bare_claims_and_owner_only` + `test_linter_rejects_environment_blockers_without_attempt` (17/17 suite) |
| 2 | Input provenance lock | LIVE: the packet's provenance section — target JSON sha256 `1be4651a…` (3,579 B) + registry sha256 `e2e49be8…` recorded at run start, receipts re-verified at preflight |
| 3 | Frame-1 / identity anchor gate | The verifier's AC-03 clause on the target + Wielder's likeness-first ordering in `wielder/judgment.py` (test `test_judgment_headline_never_leads_with_a_passing_side_metric`; critic fixture REJ-FRAME1-WRONG-CHARACTER, MAD 50.96/255). In the live run ART-00 fired first — no artifact existed to anchor; the anchor clause itself is the gate lane's measurer, exercised on calibration targets |
| 4 | Pre-flight validation node | LIVE twice: dry run W-46d76d8f068b REFUSED at preflight on the dirty gate tree (zero spend); live run W-c2dd9e831bad passed preflight (receipts, payload dry-validation, grant check, desktop self-provision) before executing |
| 5 | Scorer separation (structural) | LIVE: SEP-00 PASS in the manifest ("gate set clean"); Wielder's tool layer raises GuardError on scorer paths (test `test_scorer_owned_paths_are_write_denied`); Wielder holds no write path to gates/methods/targets/goldens |
| 6 | Regression pinning node | Request side wired + used by design: `wielder/pinning.py`, CLI `wielder pin-request`, chat owner-gate Deny → `record_rejection.py`. Application (writing gates/regressions.json + committing) stays with the gate lane BY scorer separation — that split is the row's honest form; the verifier applied PIN-001, 003–007 in the live manifest |
| 7 | Three-strikes class-change rule | `wielder/ledger.py` failure taxonomy (test `test_failure_taxonomy_counts_toward_three_strikes`); graph plan node routes ≥3 same-class resubmits to DIAGNOSIS + park. Not triggered in the live run (first submission of its card) — stated plainly |
| 8 | Full-standard self-judgment node | LIVE: the packet's self-judgment section — headline "CORE RESULT: FAIL — ART-00 … artifact missing or empty", failures first, passing side clauses listed after, never as the headline |
| 9 | Current-version resolver node | `wielder/versions.py` (test `test_version_resolver_hard_fails_superseded`); plan node resolves method versions from the registry per run — the live run bound the two Accepted methods and the manifest's METHOD clauses PASSed |
| 10 | Multi-door capability router | `wielder/doors.py` (test `test_doors_reroute_on_failure`); live doors exercised: board JSON-RPC AND the read-only SQLite door (queue.py); browser jobs issue routing receipts (test `test_browser_job_is_a_routing_receipt_not_execution`). Kaggle doors declared in CAPABILITY-MATRIX (API 429 record; browser door is the working route) |
| 11 | No-idle topology + budget spine | Graph budgets (max_steps 40 / max_wall 1800 s in wielder.config); owner-gate interrupt parks ONE run while the queue stays readable/workable (the run parked; the board and other lanes never stopped); checkpoint history + `wielder rewind` surface; heartbeat (`wielder/scheduler.py`, deploy/wielder.service) drains between visits |
| 12 | Rules-registry check + prompt hygiene | LIVE: the live run's plan passed `wielder/rules.py` against `rules.json` (naming laws incl. The Dark Forest / Illuminate / Mochiioteca, construction-kit filter, staging law); scrub receipt in the packet's planning record; tests `test_rules_registry_check_cites_settled_rulings`, `test_first_person_scrubbing`, `test_critic_cannot_use_pass_language` |

**Blocked rows: none.** Two rows carry honest scope notes instead of
live-run triggers (#3 — no artifact existed to anchor; #7 — first
submission, nothing to strike against), and both say so in their row
rather than claiming a trigger that didn't happen.
