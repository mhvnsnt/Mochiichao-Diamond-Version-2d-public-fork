# local-ci — validate PRs locally when GitHub-hosted runners are down

GitHub Actions dies on us (Oct 5 + Oct 19 2026 runner-provisioning outages: jobs
killed in ~3s before any check ran, dozens of PRs stuck `UNSTABLE`, merge law
blocked). The checks our repos actually gate on are plain git / python / node
one-liners — they never needed a cloud runner. `local_ci.py` reproduces those
checks **exactly**, on this machine, in a throwaway git worktree, so a lane can
know *"would this PR be CLEAN?"* while GitHub is down.

## Run it (any lane, before claiming a PR is ready)

```bash
# PR mode (recommended): full mirror incl. instruction-gate on the real PR body
python3 tools/local-ci/local_ci.py --repo ~/workspace/western-heart-main --pr 359

# Branch mode: no PR yet — deletion guards run against main, instruction-gate SKIPs
python3 tools/local-ci/local_ci.py --repo ~/workspace/some-clone --branch feat/my-work

# Machine-readable verdict for scripts/other lanes:
python3 tools/local-ci/local_ci.py --repo <clone> --pr 359 --json
```

Exit code `0` = every check that ran PASSED (SKIPs don't fail). `1` = a check
FAILED. `2` = setup error. The target repo's own checked-out branch is never
touched: the PR head goes into a **temp worktree** under
`~/workspace/.local-ci-tmp/`, removed (and pruned) when the run ends. Sparse
checkouts (western-heart) are handled: the temp worktree's sparse patterns are
expanded to `.github/` + the changed files only, per-worktree config, source
checkout untouched.

## What it mirrors (verbatim semantics from the workflows, read 2026-10-19)

| Check | Source workflow | Rule |
|---|---|---|
| `deletion-guard` | western-heart `deletion-guard.yml` | FAIL if >20 files deleted or any under `canon/`, unless PR label `owner-approved-deletion` |
| `no-deletion-guard` | western-heart `no-deletion-guard.yml` ("guard") | FAIL if *any* file deleted, unless PR label `approved-deletion` |
| `instruction-gate:self-test` | western-heart `instruction-gate.yml` | `python3 -m unittest discover -s .github/scripts -p test_instruction_gate.py` |
| `instruction-gate` | western-heart `instruction-gate.yml` | runs the repo's own `.github/scripts/instruction_gate.py` fed a synthetic `GITHUB_EVENT_PATH` built from the live PR (body, labels, author) — the same inputs Actions gives it |
| `js-syntax` | fleet convention | `node --check` on changed `.js/.mjs/.cjs` |
| `py-syntax` | fleet convention | `compile()` on changed `.py` (no bytecode written) |
| `json-valid` | fleet convention | `json.loads` on changed `.json` |
| `yaml-valid` | fleet convention | `yaml.safe_load` on changed `.yml/.yaml` (SKIP if PyYAML missing) |

Checks a repo doesn't have are reported as SKIP — the tool never invents gates.
Build/deploy workflows (mkdocs deploy, Android builds, renders) are **not**
mirrored: they're not validation gates and can't run meaningfully runner-less.

## What a local verdict means (read this before citing one)

* A local **PASS** is strong evidence the PR *would* be CLEAN once runners
  recover — proven 2026-10-19 against western-heart #359 (local reproduced
  GitHub exactly: guards SUCCESS, instruction-gate FAILURE) and #358 (local
  all-PASS, matching the latest GitHub run after its body fix).
* A local PASS is **not** a GitHub status check and does **not** by itself
  authorize a merge under the merge law. It tells the lane "this is ready the
  moment GitHub is back" and tells the owner the PR's state with evidence
  attached, instead of `UNSTABLE` limbo.
* A local **FAIL** is actionable immediately: the detail line names the exact
  guard/section that failed, identical to what Actions would print.

## Why this and not act / Dagger / Woodpecker (researched 2026-10-19)

| Option | 2026 state | Why not here |
|---|---|---|
| **nektos/act** (v0.2.84, 68k★) | alive, faithful Actions-in-Docker | needs a Docker daemon — **this VM has none**; pulls GB runner images onto a 95%-full disk |
| **Dagger** (v0.20) | alive, pipelines-as-code | engine is BuildKit/container-based — same Docker blocker |
| **Woodpecker CI** | alive, Apache-2.0 Drone fork, ~100MB server | a server + Docker agents to run checks that are 6 shell commands; its local CLI still executes in containers |
| **Earthly** | **Cloud shut down Jul 16 2025**, CLI maintenance-only | dead end |
| **Drone** | license moved to PolyForm (Harness) | no longer fully open source |
| **pre-commit / git hooks** | alive, standard | same *idea* as this tool (fast local checks) but per-commit, staged-files only — can't answer "is PR #N clean vs main?" |
| **this script** | stdlib python3 + git + node + gh | zero install, zero Docker, runs in ~90s incl. fetch, mirrors our actual gates bit-for-bit |

If a Docker-capable runner appears later (e.g. the Oracle ARM self-hosted
runner from the friction research), `act` becomes the higher-fidelity second
opinion — this tool stays the fast first pass.

## Requirements

`git`, `python3` (3.10+), `node`, `gh` (authenticated), PyYAML optional.
No network beyond `git fetch` + `gh` API reads. Runtime ~1–2 min for a
western-heart PR on the partial (blob:none) clone.
