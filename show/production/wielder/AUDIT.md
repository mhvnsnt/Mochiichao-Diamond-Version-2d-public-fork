# PHASE 1 — AUDIT: the owner's earlier agent system + what already exists here

> **Terminology correction (2026-10-28, owner's naming law):** the word
> "prototype" is retired for this build. The system assembled from this
> audit is **Wielder — a production Agentic AI system (autonomous
> multi-agent production system) for the Mochiichao show**. The repo
> audited below is referenced as "the owner's earlier agent system" /
> donor system. Earlier drafts of this document used the retired word
> in the title and §1 heading; the correction is recorded here rather
> than silently edited, and the headings are corrected below.

Date: 2026-10-28. Method: GitHub API inventory of all repos under `mhvnsnt`
(144 repos visible via PAT, 47 public), full tree reads of every plausible
candidate, a complete local pull of the winning candidate, and line-level
reads of its code (not READMEs alone). Every grade below names the files it
rests on. Test suites were executed, not described.

## 1. The donor system: `mhvnsnt/agent-ops` — VERDICT: this is the one

"Agent operations: checkpoints, watchdog, Proving Ground." Python, 659 files
in tree, pulled in full to `phase1-audit/agent-ops-src/` (tarball 6,487,806 B;
608 files on disk, 25 MB). It is the only repo in the account that is an
agent-operations system aimed at production work: checkpointed lanes,
a supervisor/watchdog, a deterministic instruction gate, and a local CI
mirror. The other leads grade out as follows:

| Candidate | Grade | Evidence |
|---|---|---|
| `God-Mode-OS`, `God-Mode-OS-D3MN`, `God-Mode-OS-D3MN-V2` | **MOCK** | Big React UI demos. `daemon/*.py` are stubs: endpoint commented "Mocking a standard endpoint", `FALLBACK_TEST` payloads, dummy `__main__` harness. No agent loop exists. |
| `TRIPPEDD-Animation-Studio` | **PARTIAL (tool layer, not a spine)** | Real production-pipeline support: `docs/playbooks/PRODUCERBOT_WORKFLOW.md`, `docs/playbooks/media-proof-standard.md`, `post/proof.py`, asset catalog. No orchestration/state engine. Reusable in Phase 3's tool layer. |
| `pocket-studio` | **NOT an agent system** | Media hub / phone timeline editor → ffmpeg build. Tool, not spine. |
| `wizard-gang-voice-pipe` | **NOT an agent system** | Chatterbox TTS pipeline. Tool, not spine. |

## 2. agent-ops, per component

| Component | Grade | Evidence |
|---|---|---|
| `checkpoint.sh` (140 lines) | **REAL** | Atomic tmp+rename JSON state: goal, status, heartbeat, steps_completed, next_steps, decisions, blockers, resume_prompt. The persistence idea Phase 3 inherits. |
| `supervisor.sh` (178 lines) | **REAL** | Read-only triage over checkpoints, STALE detection, emits ready-to-paste re-spawn briefs. Diagnosis only — it cannot act, by design. |
| `.github/scripts/instruction_gate.py` (137 lines) | **REAL, tests pass** | Deterministic PR gate: owner's instruction must appear verbatim; specified-vs-used method must match; claimed proof paths must exist in the diff. **Its test suite was run during this audit: 12 tests, all OK.** This is the seed of the method registry and of evidence-bound reporting. |
| `tools/local-ci/local_ci.py` (309 lines) | **REAL** | Faithful local mirror of the fleet's CI including deletion guards, run in an isolated temp worktree. Exit-code truth, before the term was pasted. |
| `lane-worktree.sh` (207), `guard-paths.sh` (172), `lanes/resilient-gh-upload.sh` (248) | **REAL utilities** | Worktree isolation per lane, path guards, resilient upload. Carried into Phase 3's tool layer. |
| The "agents" themselves | **PROTOCOL-ONLY — NO ENGINE** | Grep across all agent-ops code found **zero** LLM/model/API calls. The workers were external chat sessions following SOPs (`HOW-GROKBOT-WORKS.md`: lock the method, claim it, branch+PR, proof with hashes, honest status line first). There is no loop, no scheduler, no executor to rebuild — the rebuild must supply the engine the protocol always assumed. |
| Completion status | **SELF-DECLARED (defect)** | Checkpoints record worker-claimed status. Nothing mechanical checks the claim against the artifact. The finishing-loop research measures exactly this failure: 75.8% false success among self-assessing coding agents vs 3% where an independent process verified state (`~/workspace/research_notes/finishing-loop-verification-gates-20261028-1237/report.md`). |
| `lane-autostart/lane-autostart.sh` (182 lines) | **NOT WIRED (its own label)** | Header: "DESIGN PROPOSAL — NOT WIRED". The flock-based design itself is sound. `lanes.manifest` ships every lane disabled pending owner approval; `lanes.json` = `{"lanes": []}`. The system never ran unattended. |
| Checkpoint corpus (284 JSON files in-repo) | **DRIFT (defect)** | Samples (e.g. `ashlane-v2-verify.json`) use free-form schemas (attempts/note/verdict) unlike the canonical checkpoint fields. `supervisor.sh` tolerates 6 alternate heartbeat field names — the protocol was never enforced by code. |
| `adr-template.md` | **UNUSED** | Template exists; no ADR records in use. Decisions live in checkpoint prose. |
| `MERGE-QUEUE.md` | **NOT A BOARD** | 1,037,837 B of prose. Queue state as literature, not data. |
| `AGENTS.md` anti-clobber laws | **REAL, hard-won** | Written after a 2026-10-17 incident where a commit deleted 54,456 files. Guardrails worth carrying verbatim into Phase 3. |

## 3. What already exists HERE (do not duplicate)

| System | Grade | Evidence |
|---|---|---|
| finish-gate verifier (`~/workspace/ep01-rebuild/finish-gate/`) | **REAL, run-proven** | `verify` (323 lines): deterministic measurers only; sole author of `evidence/*.json` manifests. Manifests exist for calib-defect-planted, calib03-mochii, ep01-gated-proof-scene, vace-attempt3-dorowani-proof. |
| Method registry (finish-gate `methods/INDEX.md`) | **REAL** | M-ANIM-PARTPACK and M-ANIM-MP4GEN Accepted; M-RETIRED-WHOLESPRITE and M-RETIRED-SINGLEMESH Superseded → claiming one hard-fails. Exactly one accepted method per problem, enforced. |
| Acceptance targets (`finish-gate/targets/*.json`) | **REAL** | Numbered clauses per target; verifier reports per-clause pass/fail. Owner-gate clauses stay PENDING until the owner rules — the machine never self-certifies them. |
| Kanboard queue | **REAL** | Kanboard 1.2.56 (MIT, verified from the installed source), self-hosted on SQLite at 127.0.0.1:8899. Columns: Backlog → Ready(3) → Doing(1) → Verify(1) → Owner review(1) → Done. This is the work source the new system pulls from. |
| Scorer separation | **REAL, structural** | finish-gate is its own git repo. Gate changes land as their own commits (e.g. PIN-004…007 as f8929eb). The new agent system gets read/submit access only — never write access to gates, thresholds, or goldens. |
| Repo orchestrator tradition | **PARTIAL** | `show/production/pipeline/ORCHESTRATOR.md` in the game repo: bus rules over state.json/manifest.json/clip-index.json; "gates no agent may self-certify" (likeness promotion is never the runner's call). Rules are prose; enforcement is the finish-gate, not the document. |
| Studio-orchestrator cron | **PARTIAL** | `mochiichao-studio-orchestrator`, 6h interval, one next_action step per run, GPU steps only when the state.json `approved_auto` latch is true. A heartbeat pattern to reuse as the trigger — not an execution engine. |

## 4. Corpus measurement (owner's tail question, answered from the setup)

Measured 2026-10-28 via the GitHub tree API and local `du`/`find`:

- Game/show repo (`mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`):
  **22,165 files** (24,924 tree paths, not truncated), **≈1.0 GB**.
  Top level: sprite-art 11,446 files; show 6,413; src 2,388; docs 1,126;
  tools 423. **Media files: 13,157 (59% of all files).**
  `show/production/` holds ≈1,810 files (tooling 1,046, world-systems 251,
  rigs 113, battle 110, character-sheets 55, plus smaller sets).
- Workspace libraries: `~/workspace/mochiichao-show/` staging tree 3,575
  files (teardown packages, inventories); `~/workspace/research_notes/`
  23 files; `~/workspace/ep01-rebuild/` 79,895 files (includes the Kanboard
  vendor tree and run workdirs — not a retrieval corpus).
- **Retrieval design consequence:** the indexable text corpus is roughly
  6,000–8,000 documents (repo docs + production markdown + workspace
  research/teardowns). Media is indexed by metadata and registry entries
  only, never by content dump. Top-3 hydration is sized for this scale;
  whole-corpus prompt dumps are both impossible (1 GB) and a named failure
  mode (lost-in-the-middle).

## 5. Defect list Phase 3 must fix (or record why it cannot)

- **D1 — No execution engine.** Protocol-only; workers were chat sessions.
  Fix: LangGraph state graph supplies the loop (Phase 2).
- **D2 — Self-declared completion.** Fix: default-DENY; PASS only from the
  finish-gate verifier's manifest; the system submits artifacts, it cannot
  declare done.
- **D3 — Schema drift across 284 checkpoints.** Fix: one Pydantic schema
  for run state, enforced by the graph's SQLite store; free-form state is
  rejected at write time.
- **D4 — Autostart never wired.** Fix: cron heartbeat trigger (the existing
  6h studio-orchestrator pattern) + Kanboard queue pull, WIP=1.
- **D5 — Proof = path existence only.** The instruction gate checks claimed
  proof paths exist in the diff; it never measures the artifact. Fix:
  reporting routes through the finish-gate verifier's deterministic
  measurers; existence checks remain as a pre-filter only.
- **D6 — No run persistence beyond prose checkpoints.** Fix: SQLite run
  ledger with logged state transitions; checkpoints become a view, not
  the store.
- **D7 — No observability.** No traces, no tool input/output record, no
  loop-spiral detection. Fix: Langfuse self-hosted traces per step +
  the SQLite ledger as the local source of truth.
- **D8 — No scorer separation inside agent-ops.** It relied on repo CI and
  the instruction gate socially. Fix: structural — the agent system has no
  write path to finish-gate gates/thresholds/goldens/methods (separate
  repo, read-only mount, separate credentials).
- **D9 — Queue as prose.** MERGE-QUEUE.md is literature. Fix: Kanboard is
  the queue; the system reads/writes card state via its API only.
- **D10 — No method binding at run time.** The instruction gate checks
  method match after the fact, on PRs. Fix: the graph resolves the card's
  problem class to the registry's one Accepted method before EXECUTING;
  a superseded or unregistered method hard-fails the run at PLANNING.
