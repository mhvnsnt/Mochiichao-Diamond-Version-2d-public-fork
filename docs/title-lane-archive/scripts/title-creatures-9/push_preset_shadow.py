#!/usr/bin/env python3
"""Upload StartScreenPlayer preset shadow (1 TSX) to a new branch.

Additions only, 0 file deletions. File read from the gate-checked
worktree at ~/workspace/mochiichao-work/title-creatures-9/repo-preset-shadow
(branched from live main, gates in work/gates-preset-shadow.log).
If the branch already exists, abort. PR + merge gate separately
via pr_gate_merge.py. No token printed.
"""
import base64, json, os, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/preset-shadow-start-screen-player"
WT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo-preset-shadow"
DEST = "src/components/game/StartScreenPlayer.tsx"

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")

def call(method, path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "Muse-GitHub-Api")
    if data:
        req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github-api", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=180) as resp:
            body = resp.read().decode()
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:800]}", flush=True)
        raise

status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/main")
main_sha = main["commit"]["sha"]
print("main sha at branch time:", main_sha, flush=True)
try:
    status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}")
    print("ABORT: branch already exists:", ref.get("ref"), flush=True)
    sys.exit(2)
except SystemExit:
    raise
except Exception:
    pass
status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
                   {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
print("branch created:", ref.get("ref"), flush=True)
with open(os.path.join(WT, DEST), "rb") as f:
    raw = f.read()
content = base64.b64encode(raw).decode()
enc = "/".join(quote(part) for part in DEST.split("/"))
sha = None
try:
    status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}")
    sha = existing.get("sha")
except Exception:
    sha = None
print("base blob sha on branch:", sha, flush=True)
payload = {"message": "StartScreenPlayer — engine-drawn ground shadow (TitleScene PR #102 parameters)\n\nDeletions: NONE",
           "content": content, "branch": BRANCH}
if sha:
    payload["sha"] = sha
status, out = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
print("uploaded:", out["content"]["path"], "sha:", out["content"]["sha"], flush=True)
