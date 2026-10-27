#!/usr/bin/env python3
"""Upload the staged editor-blink StartScreenCreator.tsx to a new branch
via the GitHub Contents/Refs API (same established route as PR #232/#247).
Aborts unless the live-main blob of the file still matches the expected
base blob (anti-clobber). Prints branch + new blob SHA for verification.
Usage: editor-blink-upload-20261027.py <branch> <expected-base-sha>
"""
import base64
import hashlib
import json
import sys
import urllib.request
import urllib.error

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request

OWNER = "mhvnsnt"
REPO = "Mochiichao-Diamond-Version-2d-fresh-start"
PATH = "src/components/game/StartScreenCreator.tsx"
SRC = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/StartScreenCreator-blink-60-30-30-20261026.tsx"
BRANCH = sys.argv[1]
EXPECTED_BASE = sys.argv[2]


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
        print(f"HTTP {e.code} {method} {path}: {e.read().decode()[:600]}", flush=True)
        raise


def git_blob_sha(content: bytes) -> str:
    return hashlib.sha1(b"blob %d\0" % len(content) + content).hexdigest()


content = open(SRC, "rb").read()
local_blob = git_blob_sha(content)
print("local blob sha:", local_blob, flush=True)

# 1. Live main HEAD + current file blob (anti-clobber).
_, main_ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/main")
main_sha = main_ref["object"]["sha"]
print("live main HEAD:", main_sha, flush=True)
_, cur = call("GET", f"/repos/{OWNER}/{REPO}/contents/{PATH}?ref=main")
cur_sha = cur["sha"]
print("live main file blob:", cur_sha, flush=True)
if cur_sha != EXPECTED_BASE:
    print(f"ABORT: live main blob {cur_sha} != expected base {EXPECTED_BASE}; refusing to overwrite.", flush=True)
    sys.exit(2)

# 2. Create branch from live main HEAD.
_, ref = call("POST", f"/repos/{OWNER}/{REPO}/git/refs",
               {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
print("branch created:", ref["ref"], "->", ref["object"]["sha"], flush=True)

# 3. Upload exactly this one file on the branch.
_, put = call("PUT", f"/repos/{OWNER}/{REPO}/contents/{PATH}", {
    "message": "Match editor preview blink to Pokemon code (60-first / 30 on / 30 off)",
    "content": base64.b64encode(content).decode(),
    "branch": BRANCH,
    "sha": cur_sha,
})
new_sha = put["content"]["sha"]
print("uploaded blob sha:", new_sha, flush=True)
if new_sha != local_blob:
    print(f"ABORT: uploaded blob {new_sha} != local blob {local_blob}.", flush=True)
    sys.exit(3)

# 4. Verify branch file content matches staged file.
_, chk = call("GET", f"/repos/{OWNER}/{REPO}/contents/{PATH}?ref={BRANCH}")
chk_content = base64.b64decode(chk["content"])
print("branch file blob:", chk["sha"], "content match:", chk_content == content, flush=True)
if chk_content != content:
    sys.exit(4)
print("UPLOAD OK", flush=True)
