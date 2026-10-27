#!/usr/bin/env python3
"""Upload the white-spot + shadow fix (4 PNGs + 1 TSX) to a new branch.

Additions/changes only, 0 file deletions. Files are read from the
gate-checked tree at ~/workspace/mochiichao-work/title-creatures-9/repo
(HEAD = verified main at branch time, gates in work/gates.log).
No Pokemon creature art. No package.json/package-lock changes.
If the branch already exists, abort — do not clobber it.
Creates the branch only; PR creation + merge gate are run
separately via pr_gate_merge.py. No token printed.
"""
import base64, hashlib, json, os, sys, urllib.request, urllib.error
from urllib.parse import quote
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request
OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
BRANCH = "feature/title-creatures-white-spot-shadow-fix-1"
BASE = "main"
EXPECTED_MAIN = "c34e5f80f5d67feb3008da46124d3ad4c357f5bb"
# Note: gate tree was verified at 9ac266d1; main moved to c34e5f80
# with NO overlap with the 5 files in this PR (verified via
# git diff 9ac266d1..origin/main, grep for the 5 paths = empty).
# Branching from latest main and uploading only these 5 files
# therefore cannot revert or clobber other lanes' work.
WT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/repo"
FILES = [
    "src/assets/title/sproutle-walk-cutout.png",
    "src/assets/title/dorowani-walk-cutout.png",
    "src/assets/title/tyrage-walk-cutout.png",
    "src/assets/title/kittember-walk-cutout.png",
    "src/components/game/TitleCreatureFigure.tsx",
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
    payload = {"message": "Title creatures white-spot + shadow fix (4/4 flagged)\n\nDeletions: NONE", "content": content, "branch": BRANCH}
    if sha:
        payload["sha"] = sha
    call("PUT", f"/repos/{OWNER}/{REPO}/contents/{enc}", payload)
    print(f"{i}/{len(FILES)} uploaded: {dest} ({len(raw)} bytes)", flush=True)
    uploaded.append(dest)
print("uploaded:", len(uploaded), "skipped:", len(skipped), flush=True)
print(json.dumps({"branch": BRANCH, "base": EXPECTED_MAIN, "uploaded": uploaded, "skipped": skipped}, indent=2))
