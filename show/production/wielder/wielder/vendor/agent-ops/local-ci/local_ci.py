#!/usr/bin/env python3
"""local-ci: run a repo's PR validation checks locally when GitHub-hosted runners are down.

WHY THIS EXISTS (2026-10-19): GitHub Actions jobs were dying in ~3s all day
(runner provisioning outage) leaving ~70 PRs UNSTABLE with zero CLEAN results,
which blocks the merge law. The checks our repos actually gate on are plain
git/python/node one-liners, so they can be reproduced exactly on this machine
with no Docker, no server, and no network beyond one `git fetch` + `gh` calls.

WHAT IT MIRRORS (verbatim semantics, read from the workflows on 2026-10-19):
  western-heart .github/workflows/deletion-guard.yml
      deleted = git diff --no-renames --diff-filter=D --name-only BASE...HEAD
      FAIL if >20 deleted or any under canon/, unless PR label
      "owner-approved-deletion" is present.
  western-heart .github/workflows/no-deletion-guard.yml  (job name: guard)
      FAIL if ANY file is deleted, unless PR label "approved-deletion".
  western-heart .github/workflows/instruction-gate.yml
      1) self-test: python3 -m unittest discover -s .github/scripts
                    -p 'test_instruction_gate.py'
      2) gate:      python3 .github/scripts/instruction_gate.py
                    (fed a synthetic GITHUB_EVENT_PATH built from the live PR,
                    exactly like Actions does)
Plus the generic syntax gates the fleet's CI relies on, applied to files the
PR actually changed:
  js-syntax    node --check on changed .js/.mjs/.cjs
  py-syntax    compile() on changed .py (no bytecode written)
  json-valid   json.loads on changed .json
  yaml-valid   yaml.safe_load on changed .yml/.yaml (needs PyYAML; SKIP if absent)

Repos without those workflows simply SKIP the mirrored checks — the tool
never invents gates a repo doesn't have.

ISOLATION: the PR head is checked out into a TEMP git worktree created from
the repo you point at; the repo's own checked-out branch is never touched.
The worktree is removed (and pruned) when the run ends, pass or fail.

USAGE:
  local_ci.py --repo ~/workspace/western-heart-main --pr 359
  local_ci.py --repo ~/workspace/some-clone --branch feat/x [--base main]
  local_ci.py --repo ... --pr 359 --json        # machine-readable verdict
  local_ci.py --repo ... --pr 359 --keep        # keep worktree for debugging

Exit code: 0 = all run checks PASS (SKIPs don't fail), 1 = any FAIL, 2 = usage/setup error.
A local PASS is evidence a PR *would* be CLEAN; it is not a GitHub status and
never authorizes a merge by itself — see README.md.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

RESULTS = []


def run(cmd, cwd=None, env=None, timeout=600):
    e = dict(os.environ)
    if env:
        e.update(env)
    return subprocess.run(cmd, cwd=cwd, env=e, capture_output=True, text=True,
                          timeout=timeout)


def record(check, status, detail=""):
    RESULTS.append({"check": check, "status": status, "detail": detail})
    line = f"[{status:4}] {check}"
    if detail:
        line += f" — {detail}"
    print(line, flush=True)


def gh_json(args):
    r = run(["gh"] + args)
    if r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {r.stderr.strip()[:300]}")
    return json.loads(r.stdout)


def main():
    ap = argparse.ArgumentParser(description="Local mirror of the fleet's PR CI checks.")
    ap.add_argument("--repo", required=True, help="path to a local clone of the repo")
    ap.add_argument("--pr", type=int, help="PR number (uses gh for body/labels/shas)")
    ap.add_argument("--branch", help="branch name (origin/<branch>) instead of a PR")
    ap.add_argument("--base", default="main", help="base branch for --branch mode")
    ap.add_argument("--json", action="store_true", help="print JSON verdict at the end")
    ap.add_argument("--keep", action="store_true", help="keep the temp worktree")
    a = ap.parse_args()

    repo = os.path.abspath(os.path.expanduser(a.repo))
    if run(["git", "-C", repo, "rev-parse", "--git-dir"]).returncode != 0:
        print(f"error: {repo} is not a git repo", file=sys.stderr)
        return 2
    if not a.pr and not a.branch:
        print("error: give --pr N or --branch NAME", file=sys.stderr)
        return 2

    origin = run(["git", "-C", repo, "remote", "get-url", "origin"]).stdout.strip()
    # owner/name from https or ssh remote
    slug = origin.rstrip("/").removesuffix(".git")
    slug = slug.split("github.com")[-1].strip(":/")
    if "/" not in slug:
        print(f"error: cannot parse owner/repo from origin {origin!r}", file=sys.stderr)
        return 2

    print(f"local-ci: repo={slug} fetching origin…", flush=True)
    run(["git", "-C", repo, "fetch", "origin", "--quiet"], timeout=900)

    labels, body, author, pr_number = [], None, "", None
    if a.pr:
        pr = gh_json(["pr", "view", str(a.pr), "-R", slug, "--json",
                      "headRefOid,baseRefOid,headRefName,baseRefName,body,labels,author,title"])
        head_sha, base_sha = pr["headRefOid"], pr["baseRefOid"]
        labels = [l["name"] for l in pr.get("labels", [])]
        body, author, pr_number = pr.get("body") or "", (pr.get("author") or {}).get("login", ""), a.pr
        print(f"local-ci: PR #{a.pr} '{pr.get('title','')[:70]}' "
              f"base={pr['baseRefName']} head={pr['headRefName']} labels={labels}", flush=True)
    else:
        head_sha = run(["git", "-C", repo, "rev-parse", f"origin/{a.branch}"]).stdout.strip()
        base_sha = run(["git", "-C", repo, "rev-parse", f"origin/{a.base}"]).stdout.strip()
        if not head_sha or not base_sha:
            print("error: branch/base not found on origin", file=sys.stderr)
            return 2
        print(f"local-ci: branch={a.branch} base={a.base} (no PR: labels=[], "
              f"instruction-gate body check will SKIP)", flush=True)

    scratch_root = os.path.join(os.path.expanduser("~/workspace"), ".local-ci-tmp")
    os.makedirs(scratch_root, exist_ok=True)
    wt = tempfile.mkdtemp(prefix="wt-", dir=scratch_root)
    os.rmdir(wt)  # git worktree add wants a non-existent path
    try:
        r = run(["git", "-C", repo, "worktree", "add", "--detach", wt, head_sha], timeout=900)
        if r.returncode != 0:
            print(f"error: worktree add failed: {r.stderr.strip()[:400]}", file=sys.stderr)
            return 2
        print(f"local-ci: worktree at {wt} @ {head_sha[:12]}", flush=True)

        def diff(*diff_args):
            r = run(["git", "-C", wt, "diff", *diff_args, f"{base_sha}...{head_sha}"])
            return [l for l in r.stdout.splitlines() if l.strip()]

        # Sparse-checkout repos (e.g. western-heart's shared clone) give the new
        # worktree a sparse tree too. Expand THIS worktree's patterns (per-worktree
        # config only — the source checkout is untouched) to .github + every
        # changed file, so the checks below see real files, not a skeleton.
        sparse = run(["git", "-C", wt, "config", "--get", "core.sparseCheckout"]).stdout.strip()
        if sparse == "true":
            all_changed = diff("--name-only")
            pats = ["/.github/"] + ["/" + f for f in all_changed[:4000]]
            r = run(["git", "-C", wt, "sparse-checkout", "set", "--no-cone", *pats],
                    timeout=900)
            if r.returncode != 0:
                print(f"warning: sparse-checkout expand failed: {r.stderr.strip()[:200]}",
                      flush=True)
            else:
                print(f"local-ci: sparse worktree expanded to .github + "
                      f"{len(all_changed)} changed file(s)", flush=True)

        has_wf = lambda name: os.path.exists(os.path.join(wt, ".github", "workflows", name))

        # ---- 1. deletion-guard (mirror) -----------------------------------
        if has_wf("deletion-guard.yml"):
            deleted = diff("--no-renames", "--diff-filter=D", "--name-only")
            canon = [f for f in deleted if f.startswith("canon/")]
            if len(deleted) <= 20 and not canon:
                record("deletion-guard", "PASS", f"{len(deleted)} deleted, 0 under canon/")
            elif "owner-approved-deletion" in labels:
                record("deletion-guard", "PASS",
                       f"{len(deleted)} deleted but label owner-approved-deletion present")
            else:
                record("deletion-guard", "FAIL",
                       f"{len(deleted)} deleted ({len(canon)} under canon/); limit is 20, "
                       f"canon/ is 0; needs owner-approved-deletion label")
        else:
            record("deletion-guard", "SKIP", "repo has no deletion-guard.yml")

        # ---- 2. no-deletion-guard (mirror) --------------------------------
        if has_wf("no-deletion-guard.yml"):
            deleted = diff("--diff-filter=D", "--name-only")
            if not deleted:
                record("no-deletion-guard", "PASS", "no files deleted")
            elif "approved-deletion" in labels:
                record("no-deletion-guard", "PASS",
                       f"{len(deleted)} deleted but label approved-deletion present")
            else:
                record("no-deletion-guard", "FAIL",
                       f"deletes {len(deleted)} file(s): {', '.join(deleted[:10])}"
                       + (" …" if len(deleted) > 10 else ""))
        else:
            record("no-deletion-guard", "SKIP", "repo has no no-deletion-guard.yml")

        # ---- 3. instruction-gate (mirror) ---------------------------------
        gate_script = os.path.join(wt, ".github", "scripts", "instruction_gate.py")
        if has_wf("instruction-gate.yml") and os.path.exists(gate_script):
            test_f = os.path.join(wt, ".github", "scripts", "test_instruction_gate.py")
            if os.path.exists(test_f):
                r = run([sys.executable, "-m", "unittest", "discover", "-s",
                         ".github/scripts", "-p", "test_instruction_gate.py"],
                        cwd=wt, timeout=300)
                ok = r.returncode == 0
                tail = (r.stderr or r.stdout).strip().splitlines()
                record("instruction-gate:self-test", "PASS" if ok else "FAIL",
                       tail[-1][:160] if tail else f"exit {r.returncode}")
            if pr_number is not None:
                ev = {"pull_request": {"number": pr_number, "body": body,
                                       "labels": [{"name": l} for l in labels],
                                       "user": {"login": author}},
                      "repository": {"full_name": slug}}
                ev_path = os.path.join(wt, ".local-ci-event.json")
                with open(ev_path, "w") as f:
                    json.dump(ev, f)
                r = run([sys.executable, ".github/scripts/instruction_gate.py"],
                        cwd=wt, env={"GITHUB_EVENT_PATH": ev_path}, timeout=300)
                os.unlink(ev_path)
                out = (r.stdout + r.stderr).strip()
                if r.returncode == 0:
                    record("instruction-gate", "PASS", out.splitlines()[-1][:160] if out else "")
                else:
                    errs = [l.replace("::error::", "") for l in out.splitlines()
                            if "::error::" in l]
                    record("instruction-gate", "FAIL",
                           "; ".join(errs[:4])[:400] if errs else out[:300])
            else:
                record("instruction-gate", "SKIP", "branch mode: no PR body to gate")
        else:
            record("instruction-gate", "SKIP", "repo has no instruction-gate.yml/script")

        # ---- 4-7. syntax gates on changed files ---------------------------
        changed = [f for f in diff("--name-only", "--diff-filter=AMR") if os.path.exists(os.path.join(wt, f))]

        js = [f for f in changed if f.endswith((".js", ".mjs", ".cjs"))]
        if js:
            bad = []
            for f in js[:500]:
                r = run(["node", "--check", os.path.join(wt, f)], timeout=120)
                if r.returncode != 0:
                    bad.append(f"{f}: {(r.stderr.strip().splitlines() or ['?'])[0][:120]}")
            record("js-syntax", "FAIL" if bad else "PASS",
                   f"{len(js)} file(s) checked" + (f"; BAD: {'; '.join(bad[:5])}" if bad else ""))
        else:
            record("js-syntax", "SKIP", "no changed .js/.mjs/.cjs files")

        py = [f for f in changed if f.endswith(".py")]
        if py:
            bad = []
            for f in py[:500]:
                try:
                    compile(open(os.path.join(wt, f), encoding="utf-8", errors="replace").read(), f, "exec")
                except SyntaxError as e:
                    bad.append(f"{f}: {e.msg} (line {e.lineno})")
            record("py-syntax", "FAIL" if bad else "PASS",
                   f"{len(py)} file(s) checked" + (f"; BAD: {'; '.join(bad[:5])}" if bad else ""))
        else:
            record("py-syntax", "SKIP", "no changed .py files")

        jsn = [f for f in changed if f.endswith(".json")]
        if jsn:
            bad = []
            for f in jsn[:500]:
                try:
                    json.load(open(os.path.join(wt, f), encoding="utf-8"))
                except Exception as e:  # noqa: BLE001 - report any parse failure
                    bad.append(f"{f}: {str(e)[:120]}")
            record("json-valid", "FAIL" if bad else "PASS",
                   f"{len(jsn)} file(s) checked" + (f"; BAD: {'; '.join(bad[:5])}" if bad else ""))
        else:
            record("json-valid", "SKIP", "no changed .json files")

        yml = [f for f in changed if f.endswith((".yml", ".yaml"))]
        if yml:
            try:
                import yaml  # noqa: F401
                bad = []
                for f in yml[:500]:
                    try:
                        yaml.safe_load(open(os.path.join(wt, f), encoding="utf-8"))
                    except Exception as e:  # noqa: BLE001
                        bad.append(f"{f}: {str(e).splitlines()[0][:120]}")
                record("yaml-valid", "FAIL" if bad else "PASS",
                       f"{len(yml)} file(s) checked" + (f"; BAD: {'; '.join(bad[:5])}" if bad else ""))
            except ImportError:
                record("yaml-valid", "SKIP", "PyYAML not installed on this machine")
        else:
            record("yaml-valid", "SKIP", "no changed .yml/.yaml files")

    finally:
        if a.keep:
            print(f"local-ci: worktree KEPT at {wt} (--keep)")
        else:
            run(["git", "-C", repo, "worktree", "remove", "--force", wt], timeout=300)
            run(["git", "-C", repo, "worktree", "prune"])
            shutil.rmtree(wt, ignore_errors=True)

    fails = [r for r in RESULTS if r["status"] == "FAIL"]
    verdict = "FAIL" if fails else "PASS"
    print(f"\nlocal-ci VERDICT: {verdict} "
          f"({sum(1 for r in RESULTS if r['status']=='PASS')} pass, "
          f"{len(fails)} fail, {sum(1 for r in RESULTS if r['status']=='SKIP')} skip)")
    if a.json:
        print(json.dumps({"verdict": verdict, "repo": slug,
                          "pr": pr_number, "branch": a.branch,
                          "head": head_sha, "base": base_sha,
                          "results": RESULTS}, indent=2))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
