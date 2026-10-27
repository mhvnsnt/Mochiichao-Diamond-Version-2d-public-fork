#!/usr/bin/env python3
"""Upload Engine-drawn shadow layer (1 TSX) to a new branch.

Additions/changes only, 0 file deletions. Files read from the
gate-checked tree at ~/workspace/mochiichao-work/title-creatures-9/repo
(HEAD = verified main at branch time, gates in work/gates-raz2.log).
Gate tree verified at current main aea7220 (PR #80); gates in work/gates-shadow.log. No Pokemon creature art.
If the branch already exists, abort. PR + merge gate separately
via pr_gate_merge.py. No token printed.
"""
import base64, hashlib, json, os, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-creatures-engine-shadow-1"
BASE = "main"
EXPECTED_MAIN = "e9504e548b20d15a9a66d0d5fc6407289daf7718"
# Note: gate tree verified at aea7220; main moved to e9504e54
# with NO overlap with TitleScene.tsx (verified via git diff
# aea7220..origin/main, grep = empty). Branching from latest main
# and uploading only this 1 file cannot revert other lanes.
WT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo"
FILES = [
    "src/components/game/TitleScene.tsx",
]

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
        body = e.read().decode()
        print(f"HTTP {e.code} {method} {path}: {body[:800]}", flush=True)
        raise

status, main = call("GET", f"/repos/{OWNER}/{REPO}/branches/{BASE}")
main_sha = main["commit"]["sha"]
print("main sha at branch time:", main_sha, flush=True)
print("expected base:", EXPECTED_MAIN, flush=True)
if main_sha != EXPECTED_MAIN:
    print("ABORT: main moved since gate tree was verified — re-verify first", flush=True)
    sys.exit(2)
try:
    status, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}")
    print("ABORT: branch already exists:", ref.get("ref"), flush=True)
    sys.exit(2)
except SystemExit:
    raise
except Exception:
    pass
status, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs", {"ref": f"refs/heads/{BRANCH}", "sha": EXPECTED_MAIN})
print("branch created:", ref.get("ref"), flush=True)
uploaded, skipped = [], []
for i, dest in enumerate(FILES, 1):
    with open(os.path.join(WT, dest), "rb") as f:
        raw = f.read()
    content = base64.b64encode(raw).decode()
    blob_sha = hashlib.sha1(b"blob %d\0" % len(raw) + raw).hexdigest()
    enc = "/".join(quote(part) for part in dest.split("/"))
    sha = None
    try:
        status, existing = call("GET", f"/repos/{OWNER}/{REPO}/contents/{enc}?ref={BRANCH}")
        sha = existing.get("sha")
    except Exception:
        sha = None
    if sha == blob_sha:
        print(f"{i}/{len(FILES)} skipped (identical on branch): {dest}", flush=True)
        skipped.append(dest); continue
    payload = {"message": "Title scene — engine-drawn ground shadow (FireRed separate-shadow pattern)\n\nDeletions: NONE", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
    print(f"{i}/{len(FILES)} uploaded: {dest} ({len(raw)} bytes)", flush=True)
    uploaded.append(dest)
print("uploaded:", len(uploaded), "skipped:", len(skipped), flush=True)
print(json.dumps({"branch": BRANCH, "base": EXPECTED_MAIN, "uploaded": uploaded, "skipped": skipped}, indent=2))
